export type TLazy = "lazyload" | "lazyloading" | "lazyloaded"

export const lazyState: { [x: string]: TLazy } = {
  LAZY_LOAD: "lazyload",
  LAZY_LOADING: "lazyloading",
  LAZY_LOADED: "lazyloaded",
}
