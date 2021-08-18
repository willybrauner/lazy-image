declare const descriptorNames: {
    readonly w: "width";
    readonly x: "density";
};
declare type TDescriptor = keyof typeof descriptorNames;
export declare type TDescriptorName = typeof descriptorNames[TDescriptor];
export declare type TResponsiveBackgroundImage = {
    url: string;
} & {
    [K in TDescriptorName]?: number;
};
/**
 * Parses an srcset string and returns an array of objects
 * @param {string} srcset
 */
export declare function parseSrcsetToArray(srcset: string): TResponsiveBackgroundImage[];
/**
 * Get Biggest image object from data list
 * ex:
 *  [
 *    { url: "/url", width: 200 },
 *    { url: "/url", width: 500 },
 *    { url: "/url", width: 700 },
 *  ]
 *
 *  returns  { url: "/url", width: 700 }
 *
 * @param images
 */
export declare const getBiggestImageDataOject: (images: TResponsiveBackgroundImage[]) => any;
/**
 * getImageDataObject
 *
 * @desc select appropriate data image
 *
 *  * ex:
 *  [
 *    { url: "/url", width: 200 },
 *    { url: "/url", width: 500 },
 *    { url: "/url", width: 700 },
 *  ]
 *
 *  if window width = 300
 *  returns  { url: "/url", width: 500 }
 *
 * @param images: images array
 * @param width: Width reference
 * @param bigQuality: if true, allow to selected the second biggest image (when possible) up to the width container reference
 */
export declare function getImageDataObject(images: TResponsiveBackgroundImage[], width: number, bigQuality?: boolean): TResponsiveBackgroundImage;
export {};
