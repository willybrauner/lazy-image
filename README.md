# @wbe/lazy-image

A zero dependency lazy and responsive image management for image and background-image.
React wrapper component using `lazy-image` is available too.

![](https://img.shields.io/npm/v/@wbe/lazy-image/latest.svg)
![](https://img.shields.io/bundlephobia/minzip/@wbe/lazy-image.svg)
![](https://img.shields.io/npm/dt/@wbe/lazy-image.svg)
![](https://img.shields.io/npm/l/@wbe/lazy-image.svg)

## Summary

- [Vanilla LazyImage](#LazyImage)
- [React LazyImage](#ReactLazyImage)

## Installation

```shell script
$ npm install -s @wbe/lazy-image
```

## <a name="LazyImage"></a>LazyImage

### Lazyload a group of images

Lazy image is build to manage lazyloading and responsive via native srcset.

HTML template:

```html
<img alt="image" data-srcset="img-1.jpg 360w, img-2.jpg 768w" />
<img alt="image-2" data-srcset="img-1-2.jpg 360w, img-2-2.jpg 768w" />
```

```js
import { LazyImage } from "@wbe/lazy-image"

const image = new LazyImage()
// start to listen
image.start()
// stop to listen
image.stop()
// update listeners
image.update()
```

When image is appear in viewport, data-srcset value is injected in srcset attribute.

```html
<img
  alt="image"
  class="lazyloaded"
  srcset="img-1.jpg 360w, img-2.jpg 768w"
  data-srcset="img-1.jpg 360w, img-2.jpg 768w"
/>
<!-- ... -->
```

### Lazyload a specific image

`LazyImage()` can lazyload specific image only.

```html
<img alt="image" id="singleImage" srcset="img-360.jpg 360w, img-768.jpg 768w" />
```

```js
const singleImage = new LazyImage({
  $element: document.getElementById("singleImage"),
})
```

### Parameters

All parameters are optional.

| param             | type                       | description                                                                         | default value   |
| ----------------- | -------------------------- | ----------------------------------------------------------------------------------- | --------------- |
| `$root`           | `string`                   | parent DOM element who contains images to lazyload                                  | `document.body` |
| `$element`        | `HTMLElement`              | lazyLoad a specific DOM image element                                               | /               |
| `src`             | `string`                   | if $element is set, define an image src to lazyload                                 | /               |
| `srcset`          | `string`                   | if $element is set, define an image srcset to lazyload                              | /               |
| `lazyCallback`    | `(state)=> void`           | callback executed when lazy state change (`lazyload`, `lazyloading` , `lazyloaded`) | `() => {}`      |
| `observerOptions` | `IntersectionObserverInit` | mutation observer options                                                           | `{}`            |

## LazyBackgroundImage

`LazyBackgroundImage()` set the appropriate image URL from srcset, in CSS background-image url of specific div.
This appropriate image URL depends of element width.

### Lazyload a group of background-images

```html
<div data-background-srcset="img-1.jpg 360w, img-2.jpg 768w" />
```

```js
import { LazyBackgroundImage } from "@wbe/lazy-image"

const backgroundImage = new LazyBackgroundImage()
backgroundImage.start()
```

When DOM element appear in viewport, and element width is less than 360px:

```html
<div
  class="lazyloaded"
  data-background-srcset="img-1.jpg 360w, img-2.jpg 768w"
  style="background-image: url('img-1.jpg')"
/>
```

### Lazyload a specific background-image

`LazyBackgroundImage()` can lazyload specific css image only.

```html
<div id="single" data-background-srcset="img-1.jpg 360w, img-2.jpg 768w" />
```

```js
import { LazyBackgroundImage } from "@wbe/lazy-image"

const singleBackgroundImage = new LazyBackgroundImage({
  $element: document.getElementById("single"),
})
// start to listen
singleBackgroundImage.start()
// stop to listen
singleBackgroundImage.stop()
// update listeners
singleBackgroundImage.update()
```

Or don't specify image srcset in DOM but, directly as function param.

```html
<div id="single" />
```

```js
import { LazyBackgroundImage } from "@wbe/lazy-image"

const singleBackgroundImage = LazyBackgroundImage({
  $element: document.getElementById("single"),
  srcset: "img-1.jpg 360w, img-2.jpg 768w",
})
singleBackgroundImage.start()
```

## Parameters

All parameters are optional.

| param             | type                       | description                                                                                                                                                            | default value   |
| ----------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| `$root`           | `string`                   | parent DOM element who contains images to lazyload                                                                                                                     | `document.body` |
| `$element`        | `HTMLElement`              | lazyLoad a specific DOM image element                                                                                                                                  | /               |
| `srcset`          | `string`                   | if $element is set, define an image srcset to lazyload                                                                                                                 | /               |
| `additonalUrl`    | `string`                   | add a second css URL behind the first one                                                                                                                              | /               |
| `lazyCallback`    | `(state)=> void`           | callback executed when lazy state change (`lazyload`, `lazyloading` , `lazyloaded`)                                                                                    | `() => {}`      |
| `observerOptions` | `IntersectionObserverInit` | mutation observer options                                                                                                                                              | /               |
| `bigQuality`      | `boolean`                  | will returns 2 steps bigger image (ex: if 360, 768, 1024 img are available, and DOM element width is less than 360, the function will return 768 img instead the 360 ) | `false`         |

## <a name="ReactLazyImage"></a>React LazyImage

React image component with lazyloading management.

## `<Image />` component

```js
import { Image } from "@wbe/lazy-image"
```

### `src` props

Be sure you set appropriated css image width and height.

```js
<Image src={`https://image-url`} alt={"src image"} />
```

Will return this HTML before lazyload:

```html
<img
  class="Image lazyload"
  alt="src image"
  src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
  data-src="https://image-url"
/>
```

and after lazyload:

```html
<img
  class="Image lazyloaded"
  alt="src image"
  src="https://image-url"
  data-src="https://image-url"
/>
```

### `srcset` props

```js
<Image srcset={`https://image-url 360w, https://image-url-2 768w`} alt={"srcset image"} />
```

### `data` props

Will generate an appropriated srcset string.

```js
const data = [
  {
    url: "https://url",
    width: 600,
    height: 400,
  },
  {
    url: "https://url-2",
    width: 1000,
    height: 800,
  },
]

;<Image data={data} alt={"srcset image"} />
```

### `srcPlaceholder` props

Allow to display specific low quality image before lazyloading src image.

```js
<Image srcPlaceholder={`https://low-quality-image-url`} src={`https://image-url`} alt={""} />
```

### Props list

```ts
interface IProps {
  // image to display before lazyload
  // default is lightest base64 transparent image
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

  // alt attr and aria html
  alt: string
  ariaLabel?: string

  // class name added on root element
  className?: string

  // style attrs
  style?: CSSProperties
  width?: number | string
  height?: number | string
}
```

## `<BackgroundImage />`

Works this the same API than `<Image />` component.

Before lazyload:

```html
<div
  class="BackgroundImage lazyload"
  style="background-image: url('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==')"
  data-background-srcset="img-1.jpg 360w, img-2.jpg 768w"
/>
```

After lazyload:

```html
<div
  class="BackgroundImage lazyloaded"
  style="background-image: url('img-1.jpg')"
  data-background-srcset="img-1.jpg 360w, img-2.jpg 768w"
/>
```

## `<Placeholder />` wrapper component

Image component comes with `<Placeholder />` parent component
used to display a placeholder behind Image. This process is particulary useful
when image is lazyloading. It allows to not preload all 1px height images in pages
on page load but really waiting the image was shown in viewport to lazyload it.

Example with `<Image />`:

```js
<Placeholder>
    <Image
      src={`https://image-url`}
      width={600}
      height={400}
      alt={"with placeholder"}
    />
<Placeholder/>
```

Example with `<BackgroundImage />`:

```js
<Placeholder>
    <BackgroundImage
      src={`https://image-url`}
      // or srcset={`https://image-url 360w, https://image-url 768w`}
      width={600}
      height={400}
      alt={"with placeholder"}
    />
<Placeholder/>
```

`<Placeholder />` get children Image ratio to calculate its placeholder height.
It's possible to specify an arbitrary ratio who will override image dimension

```js
<Placeholder ratio={3/4}>
    <Image
      src={`https://image-url`}
      alt={"with placeholder"}
    />
<Placeholder />
```

## Props list

```ts
interface IProps {
  // Image component
  children: ReactNode

  // by default, ratio is calc from children image data dimension.
  // set ratio override native image ratio
  ratio?: number

  // shortcut to style wrapper background color
  backgroundColor?: string

  // add style to each dom element
  style?: {
    root?: CSSProperties
    wrapper?: CSSProperties
    img?: CSSProperties
  }

  // class name added on root element
  className?: string
}
```
