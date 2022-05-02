import {
  getBiggestImageDataOject,
  getImageDataObject,
  parseSrcsetToArray,
  TResponsiveBackgroundImage,
} from "./helpers"
import { TLazy, lazyState } from "./common"

/**
 * @name LazyBackgroundImage
 * @desc Choose the appropriate image URL from srcset attr
 * and preload it before add its url in background-image style attr.
 */

export class LazyBackgroundImage {
  protected dataSrcsetAttr = "data-background-srcset"
  protected dataIdAttr = "data-background-id"
  protected observer: IntersectionObserver
  protected storeImageList = []
  protected ID = 0

  protected $root: HTMLElement
  protected $element: HTMLElement
  protected srcset: string
  protected additonalUrl: string
  protected lazyCallback: (state) => void
  protected observerOptions: IntersectionObserverInit
  protected bigQuality: boolean

  constructor({
    $root = document.body,
    $element,
    srcset,
    additonalUrl,
    lazyCallback = () => {},
    observerOptions = {},
    bigQuality = false,
  }: {
    $root?: HTMLElement
    $element?: HTMLElement
    srcset?: string
    additonalUrl?: string
    lazyCallback?: (state) => void
    observerOptions?: IntersectionObserverInit
    bigQuality?: boolean
  } = {}) {
    this.$root = $root
    this.$element = $element
    this.srcset = srcset
    this.additonalUrl = additonalUrl
    this.lazyCallback = lazyCallback
    this.observerOptions = observerOptions
    this.bigQuality = bigQuality
  }

  /**
   * Start
   */
  public start(): void {
    this._observe()
    window.addEventListener("resize", this._handlResize)
  }

  /**
   * Update
   */
  public update(): void {
    this.stop()
    this.start()
  }

  /**
   * Stop
   */
  public stop(): void {
    this.observer.disconnect()
    window.removeEventListener("resize", this._handlResize)
  }

  /**
   * handle resize
   */
  private _handlResize = (): void => {
    this.update()
  }

  /**
   * Get elements with data-background-srcset attr
   */
  private _getElementsWithDataAttr(): HTMLElement[] {
    const $els = this.$root.querySelectorAll(`[${this.dataSrcsetAttr}]:not(img):not(figure)`)
    // @ts-ignore
    return $els?.length ? [...$els] : null
  }

  /**
   * Start observer via intersection observer
   */
  private _observe(): void {
    if (!("IntersectionObserver" in window)) return
    this.observer = new IntersectionObserver(this._observeOnChangeCallBack, this.observerOptions)

    // select dom element to observe
    // depend of witch kind of element
    // prettier-ignore
    const elsToObserve = (this.$element || this.srcset)
        ? this.$element ? [this.$element] : null
        : this._getElementsWithDataAttr();

    elsToObserve?.forEach((el: HTMLElement) => {
      // get current image informations
      const imageInfos = this._getImageInformations(el)
      // get store image object
      const storeImageObject = this.storeImageList?.[el.getAttribute(this.dataIdAttr)]

      if (
        // if store image doest exist
        !storeImageObject ||
        // or store image with is smaller than current image (dom) width
        // and image (dom) width is smaller than the biggest width available
        (storeImageObject?.width < imageInfos.width &&
          imageInfos.width <= imageInfos.biggestImageDataOject.width)
      ) {
        this.observer.observe(el)
      }
    })
  }

  /**
   * observer callback
   * @param entries
   */
  private _observeOnChangeCallBack = (entries: IntersectionObserverEntry[]): void => {
    entries?.forEach(async (el) => {
      const $current = el.target as HTMLElement
      // switch lazy callback
      this._switchLazyState($current, lazyState.LAZY_LOAD)

      if (!el.isIntersecting) return

      // get current image information
      const image = this._getImageInformations($current)

      // get data id on DOM element
      const dataId = $current.getAttribute(this.dataIdAttr)

      // if didn't exist, set in on DOM element and store it
      if (!dataId) {
        $current.setAttribute(this.dataIdAttr, `${this.ID}`)
        this.storeImageList[this.ID] = image?.imageDataObject
        this.ID++
        // else, store it only
      } else {
        this.storeImageList[dataId] = image?.imageDataObject
      }

      // check if data object url exist
      if (!image?.imageDataObject?.url) return

      // switch lazy state
      this._switchLazyState($current, lazyState.LAZY_LOADING)
      // start preload and wait
      await this._preloadImage($current, image.imageDataObject.url)
      // switch lazy state
      this._switchLazyState($current, lazyState.LAZY_LOADED)
      // then replace url
      this._replaceBackgroundImageUrl($current, image.imageDataObject)
      // disconnect
      this.observer.unobserve($current)
    })
  }

  /**
   * Get selected image information
   * @param $el
   */
  private _getImageInformations($el: HTMLElement): {
    width: number
    dataSrcset: string
    imageDataObject: TResponsiveBackgroundImage
    biggestImageDataOject: TResponsiveBackgroundImage
  } {
    // get image width reference
    const width = $el.getBoundingClientRect()?.width || window.innerWidth
    // get image URL
    const dataSrcset = this.srcset || $el.getAttribute(this.dataSrcsetAttr)
    // extract image array from from srcset
    const imagesArray = parseSrcsetToArray(dataSrcset)
    // get image object depend of current width and quality size
    const imageDataObject = getImageDataObject(imagesArray, width, this.bigQuality)
    // ge biggest image object from image data array
    const biggestImageDataOject = getBiggestImageDataOject(imagesArray)

    return {
      width,
      dataSrcset,
      imageDataObject,
      biggestImageDataOject,
    }
  }

  /**
   * Replace background image URL depend of element size
   * @param $element
   * @param imageDataObject
   */
  private _replaceBackgroundImageUrl(
    $element: HTMLElement,
    imageDataObject: TResponsiveBackgroundImage
  ): void {
    $element.style.backgroundImage = [
      `url('${imageDataObject.url}')`,
      this.additonalUrl && `, url('${this.additonalUrl}')`,
    ]
      .filter((v) => v)
      .join("")
  }

  /**
   * Preload image url
   * Set lazy class
   * @param $el
   * @param url
   */
  private _preloadImage($el: HTMLElement, url: string): Promise<void> {
    return new Promise((resolve) => {
      // create void image tag for each url
      const $img = document.createElement("img")
      // add url to src attr in order to start loading
      $img.src = url
      $img.onload = () => {
        resolve()
      }
    })
  }

  /**
   * Switch lazyState and execute lazyCallback
   * @param $el
   * @param state
   */
  private _switchLazyState($el, state: TLazy): void {
    // remove all lazy class
    Object.values(lazyState).forEach((el) => {
      $el.classList.remove(el)
    })
    // add param lazyclass
    $el.classList.add(state)
    // execute callback
    this.lazyCallback(state)
  }
}
