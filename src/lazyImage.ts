import { TLazy } from "./types"
import { lazyState } from "./common"

type TLazyImageParams = {
  $element?: HTMLElement
  src?: string
  srcset?: string
  $root?: HTMLElement
  lazyCallback?: (state) => void
  observerOptions?: IntersectionObserverInit
}

export type TLazyImage = {
  stop: () => void
  start: () => void
  update: () => void
}

/**
 * @name lazyImage
 * @desc Choose the appropriate image URL from srcset attr and
 * preload image before add its url in background-image style attr.
 *
 */
export function lazyImage({
  $element,
  srcset,
  src,
  $root = document.body,
  lazyCallback = () => {},
  observerOptions = {},
}: TLazyImageParams = {}): TLazyImage {
  const dataSrcsetAttr = "data-srcset"
  const dataSrcAttr = "data-src"
  let observer: IntersectionObserver

  // check props to know if specific src
  const isSpecificElement = !!$element || !!src || !!srcset

  /**
   * Start
   */
  const start = (): void => {
    _observe()
  }

  /**
   * Update
   */
  const update = (): void => {
    stop()
    start()
  }

  /**
   * Stop
   */
  const stop = (): void => {
    observer.disconnect()
  }

  /**
   * Get elements with data-src or data-srcset attr
   */
  // prettier-ignore
  const _getElementsWithDataAttr = (): HTMLImageElement[] => {
     const $els = [
        // @ts-ignore
        ...($root.querySelectorAll(`[${dataSrcsetAttr}]`) || []),
        ...($root.querySelectorAll(`[${dataSrcAttr}]`) || []),
      ];
      return $els?.length ? $els : null;
    };

  /**
   * Start observer via intersection observer
   */
  const _observe = (): void => {
    if (!("IntersectionObserver" in window)) return
    observer = new IntersectionObserver(_observeOnChangeCallBack, observerOptions)
    // get elements to observe
    // prettier-ignore
    const elsToObserve = isSpecificElement
      ? $element ? [$element] : null : _getElementsWithDataAttr();

    elsToObserve?.forEach((el) => observer.observe(el))
  }

  /**
   *
   * @param entries
   */
  const _observeOnChangeCallBack = (entries: IntersectionObserverEntry[]): void => {
    entries.forEach(async (el) => {
      const $current = el.target as HTMLImageElement
      // switch lazyState
      _switchLazyState($current, "lazyload")
      if (el.isIntersecting) {
        // disconnect
        observer.unobserve($current)
        // switch lazyState
        _switchLazyState($current, "lazyloading")
        // start preload and replace
        await _preloadImage($current)
        // switch lazyState
        _switchLazyState($current, "lazyloaded")
      }
    })
  }

  /**
   * Preload images and set new URL in src or srcset attr
   * @param $el
   */
  const _preloadImage = ($el: HTMLImageElement): Promise<void> => {
    return new Promise((resolve) => {
      const dataSrcValue = src || $el.getAttribute(dataSrcAttr)
      const dataSrcSetValue = srcset || $el.getAttribute(dataSrcsetAttr)

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
  const _switchLazyState = ($el, state: TLazy): void => {
    // remove all lazy class
    Object.values(lazyState).forEach((el) => {
      $el.classList.remove(el)
    })
    // add param lazyclass
    $el.classList.add(state)
    // execute callback
    lazyCallback(state)
  }

  return {
    start,
    update,
    stop,
  }
}
