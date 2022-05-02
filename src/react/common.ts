export const DEFAULT_SRC_IMAGE_PLACEHOLDER =
  "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="

export type TLazy = "lazyload" | "lazyloading" | "lazyloaded"

export type TImageData = {
  url: string
  width?: number
  height?: number
}
