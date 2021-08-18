export declare type TLazyBackgroundImage = {
    stop: () => void;
    start: () => void;
    update: () => void;
};
/**
 * @name lazyBackgroundImage
 * @desc Choose the appropriate image URL from srcset attr and
 * preload image before add its url in background-image style attr.
 *
 * @example1 with multiple elements
 *
 * - Add "data-background-srcset" attr on div:
 *    <div data-background-srcset="image-1.jpg 640w, image-2.jpg 1240w" />
 *
 *    const bg = lazyBackgroundImage();
 *
 * - start
 *    bg.start();
 *
 * - update if new backgroundImage div with attr is inject in DOM
 *    bg.update();
 *
 * - stop to track and listen backgroundImage
 *    bg.stop();
 *
 *
 * @example2 with specific element
 *
 *  * - Add div:
 *    <div class="my-bg-img" />
 *
 *     const bg = lazyBackgroundImage({
 *       $element: document.querySelector('.my-bg-img')
 *       srcset: "image-1.jpg 640w, image-2.jpg 1240w"
 *     });
 *
 *  * - start
 *    bg.start();
 *
 *    ...
 *
 */
export declare function lazyBackgroundImage({ $root, $element, srcset, additonalUrl, lazyCallback, observerOptions, bigQuality, }?: {
    $root?: HTMLElement;
    $element?: HTMLElement;
    srcset?: string;
    additonalUrl?: string;
    lazyCallback?: (state: any) => void;
    observerOptions?: IntersectionObserverInit;
    bigQuality?: boolean;
}): TLazyBackgroundImage;
