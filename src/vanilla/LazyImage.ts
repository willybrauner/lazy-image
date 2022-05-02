import { TLazy, lazyState } from "../common"

type TLazyImageParams = {
  $element?: HTMLElement
  src?: string
  srcset?: string
  $root?: HTMLElement
  lazyCallback?: (state) => void
  observerOptions?: IntersectionObserverInit
}

/**
 * @name LazyImage
 * @desc Choose the appropriate image URL from srcset attr
 */
export class LazyImage {
  protected dataSrcsetAttr = "data-srcset"
  protected dataSrcAttr = "data-src"
  protected observer: IntersectionObserver
  protected isSpecificElement: boolean
  protected $element: HTMLElement
  protected srcset: string
  protected src: string
  protected $root: HTMLElement
  protected lazyCallback: (state) => void
  protected observerOptions: IntersectionObserverInit

  constructor({
    $element,
    srcset,
    src,
    $root = document.body,
    lazyCallback = () => {},
    observerOptions = {},
  }: TLazyImageParams = {}) {
    this.$element = $element
    this.src = src
    this.$root = $root
    this.lazyCallback = lazyCallback
    this.observerOptions = observerOptions
    this.isSpecificElement = !!$element || !!src || !!srcset
  }

  /**
   * Start
   */
  public start(): void {
    this._observe()
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
  }

  /**
   * Get elements with data-src or data-srcset attr
   */
  private _getElementsWithDataAttr(): HTMLImageElement[] {
    const $els = [
      // @ts-ignore
      ...(this.$root.querySelectorAll(`[${this.dataSrcsetAttr}]`) || []),
      ...(this.$root.querySelectorAll(`[${this.dataSrcAttr}]`) || []),
    ]
    return $els?.length ? $els : null
  }

  /**
   * Start observer via intersection observer
   */
  private _observe(): void {
    if (!("IntersectionObserver" in window)) return
    this.observer = new IntersectionObserver(this._observeOnChangeCallBack, this.observerOptions)
    // get elements to observe
    // prettier-ignore
    const elsToObserve = this.isSpecificElement
      ? this.$element ? [this.$element] : null : this._getElementsWithDataAttr();

    elsToObserve?.forEach((el) => this.observer.observe(el))
  }

  /**
   * Observer callback
   * @param entries
   */
  private _observeOnChangeCallBack = (entries: IntersectionObserverEntry[]): void => {
    entries.forEach(async (el) => {
      const $current = el.target as HTMLImageElement
      // switch lazyState
      this._switchLazyState($current, "lazyload")
      if (el.isIntersecting) {
        // disconnect
        this.observer.unobserve($current)
        // switch lazyState
        this._switchLazyState($current, "lazyloading")
        // start preload and replace
        await this._preloadImage($current)
        // switch lazyState
        this._switchLazyState($current, "lazyloaded")
      }
    })
  }

  /**
   * Preload images and set new URL in src or srcset attr
   * @param $el
   */
  private _preloadImage($el: HTMLImageElement): Promise<void> {
    return new Promise((resolve) => {
      const dataSrcValue = this.src || $el.getAttribute(this.dataSrcAttr)
      const dataSrcSetValue = this.srcset || $el.getAttribute(this.dataSrcsetAttr)

      // create void image tag for start preload
      const $fakeImg = document.createElement("img")
      if (dataSrcValue) $fakeImg.src = dataSrcValue
      if (dataSrcSetValue) $fakeImg.srcset = dataSrcSetValue

      $fakeImg.onload = () => {
        if (dataSrcValue) $el.src = dataSrcValue
        if (dataSrcSetValue) $el.srcset = dataSrcSetValue
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
