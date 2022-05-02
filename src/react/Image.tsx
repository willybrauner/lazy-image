import React, { CSSProperties, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { DEFAULT_SRC_IMAGE_PLACEHOLDER } from "./common"
import type { TImageData, TLazy } from "./common"
import { LazyImage } from "../vanilla/LazyImage"

const componentName = "Image"

interface IProps {
  // image to display before lazyload, default is lightest base64 transparent image
  srcPlaceholder?: string

  // src URL to lazyload
  src?: string

  // srcset URL to lazyload
  srcset?: string

  // list of images with dimension used to build srcset attr
  data?: TImageData[]

  // callback when lazyload state change (lazyload | lazyloading | lazyloaded)
  lazyCallback?: (lazyState: TLazy) => void

  // intersection observer options
  observerOptions?: IntersectionObserverInit

  // style attrs
  style?: CSSProperties
  width?: number | string
  height?: number | string

  // alt attr and aria html
  alt: string
  ariaLabel?: string
  
  // class name added on root element
  className?: string
}

/**
 * React Image
 */
export function Image(props: IProps) {
  const rootRef = useRef<HTMLImageElement>(null)
  const imageInstance = useRef<LazyImage>(null)
  const [lazyState, setLazyState] = useState<TLazy>("lazyload")
  const srcsetFromData: string = useMemo(
    () => props.data?.map((el) => `${el.url} ${el.width}w`).join(", "),
    [props.data]
  )

  /**
   * 1. Root Dimension
   */
  const [rootRefWidth, setRootRefWidth] = useState<number>(null)


  // get window size
  const [windowSize, setWindowSize] = useState({
    width: window?.innerWidth,
    height: window?.innerHeight,
  })
  useEffect(() => {
    const resizeHandler = () => {
      setWindowSize({ width: window?.innerWidth, height: window?.innerHeight })
    }
    resizeHandler()
    window.addEventListener("resize", resizeHandler)
    return () => {
      window.removeEventListener("resize", resizeHandler)
    }
  }, [])

  useEffect(() => {
    if (rootRef.current != null) setRootRefWidth(rootRef.current.offsetWidth)
  }, [windowSize])

  /**
   * Create lazyImage instance
   */
  useLayoutEffect(() => {
    // create instance
    imageInstance.current = new LazyImage({
      $element: rootRef.current,
      srcset: srcsetFromData || props.srcset,
      src: props.src,
      observerOptions: props.observerOptions || {},
      lazyCallback: (state: TLazy) => {
        props.lazyCallback?.(state)
        setLazyState(state)
      },
    })
    // start
    imageInstance.current.start()
    // stop
    return () => imageInstance.current.stop()
  }, [srcsetFromData, props.srcset, props.src, props.lazyCallback, props.observerOptions])

  /**
   * Render
   */
  return (
    <img
      ref={rootRef}
      className={[componentName, props.className, lazyState].filter((e) => e).join(" ")}
      alt={props.alt}
      style={props.style}
      width={props.width}
      height={props.height}
      sizes={rootRefWidth && `${rootRefWidth}px`}
      src={props.srcPlaceholder || DEFAULT_SRC_IMAGE_PLACEHOLDER}
      data-srcset={srcsetFromData || props.srcset}
      data-src={props.src}
      aria-label={props.ariaLabel}
    />
  )
}
