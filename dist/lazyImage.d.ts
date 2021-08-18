declare type TLazyImageParams = {
    $element?: HTMLElement;
    src?: string;
    srcset?: string;
    $root?: HTMLElement;
    lazyCallback?: (state: any) => void;
    observerOptions?: IntersectionObserverInit;
};
export declare type TLazyImage = {
    stop: () => void;
    start: () => void;
    update: () => void;
};
/**
 * @name lazyImage
 * @desc Choose the appropriate image URL from srcset attr and
 * preload image before add its url in background-image style attr.
 *
 */
export declare function lazyImage({ $element, srcset, src, $root, lazyCallback, observerOptions, }?: TLazyImageParams): TLazyImage;
export {};
