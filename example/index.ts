import "./index.css"
import { LazyBackgroundImage, LazyImage } from "../src"

const buildSrcset = (id: number = 1, ratio = 4 / 3) =>
  [
    `https://picsum.photos/id/${id + 1}/360/${Math.round(360 * ratio)} 360w`,
    `https://picsum.photos/id/${id + 1}/1024/${Math.round(1024 * ratio)} 1024w`,
    `https://picsum.photos/id/${id + 1}/1440/${Math.round(1440 * ratio)} 1440w`,
  ].join(", ")

// -----------------------------------------------------------------------------  IMAGE
// avec attr
const image = new LazyImage()
image.start()

const singleImage: LazyImage = new LazyImage({
  $element: document.getElementById("singleImage"),
  // srcset: buildSrcset(),
  // src: `https://picsum.photos/id/${1}/360/${Math.round(360 * 4/6)}`,
})
singleImage.start()

// // ----------------------------------------------------------------------------- BACKGROUND IMAGE
// /**
//  * All div element with data-background-srcset attr
//  */
const backgroundImageWithAttr = new LazyBackgroundImage()
backgroundImageWithAttr.start()
//
// /**
//  *  specific div
//  */
const singleBackgroundImage = new LazyBackgroundImage({
  $element: document.getElementById("single"),
  //srcset: `https://picsum.photos/id/${1}/360/${Math.round((360 * 4) / 6)}`,
  srcset: buildSrcset(),
})
singleBackgroundImage.start()
