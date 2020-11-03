/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/**
 * Storage types
 *
 * @readonly
 * @enum
 */
const Storage = {
  /**
   * href is a path in Adobe I/O Files: https://github.com/adobe/aio-lib-files
   */
  AIO: 'aio',
  /**
   * href is a path in Creative Cloud
   */
  ADOBE: 'adobe',
  /**
   * href is a presigned get/put url, e.g. AWS S3
   */
  EXTERNAL: 'external',
  /**
   * href is an Azure SAS (Shared Access Signature) URL for upload/download
   */
  AZURE: 'azure',
  /**
   * href is a temporary upload/download Dropbox link: https://dropbox.github.io/dropbox-api-v2-explorer/
   */
  DROPBOX: 'dropbox'
}

/**
 * Mime types
 *
 * @readonly
 * @enum
 */
const MimeType = {
  /**
   * Digital Negative, available from `autoTone`, `straighten`, `applyPreset`
   */
  DNG: 'image/x-adobe-dng',
  /**
   * JPEG, available from all operations
   */
  JPEG: 'image/jpeg',
  /**
   * PNG, available from all operations
   */
  PNG: 'image/png',
  /**
   * Photoshop Document, available from `createDocument`, `modifyDocument`, `createRendition`, `replaceSmartObject`
   */
  PSD: 'image/vnd.adobe.photoshop',
  /**
   * TIFF format, available from `createDocument`, `modifyDocument`, `createRendition`, `replaceSmartObject`
   */
  TIFF: 'image/tiff'
}

/**
 * Compression level for PNG: small, medium or large.
 *
 * @readonly
 * @enum
 */
const PngCompression = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
}

/**
 * Color space
 *
 * @readonly
 * @enum
 */
const Colorspace = {
  BITMAP: 'bitmap',
  GREYSCALE: 'greyscale',
  INDEXED: 'indexed',
  RGB: 'rgb',
  CMYK: 'cmyk',
  MULTICHANNEL: 'multichannel',
  DUOTONE: 'duotone',
  LAB: 'lab'
}

/**
 * Standard ICC profile names
 *
 * @readonly
 * @enum
 */
const StandardIccProfileNames = {
  ADOBE_RGB_1998: 'Adobe RGB (1998)',
  APPLE_RGB: 'Apple RGB',
  COLORMATCH_RGB: 'ColorMatch RGB',
  SRGB: 'sRGB IEC61966-2.1',
  DOTGAIN_10: 'Dot Gain 10%',
  DOTGAIN_15: 'Dot Gain 15%',
  DOTGAIN_20: 'Dot Gain 20%',
  DOTGAIN_25: 'Dot Gain 25%',
  DOTGAIN_30: 'Dot Gain 30%',
  GRAY_GAMMA_18: 'Gray Gamma 1.8',
  GRAY_GAMMA_22: 'Gray Gamma 2.2'
}

/**
 * @typedef {object} Input
 * @description A reference to an input file
 * @property {string} href Either an href to a single Creative Cloud asset for storage='adobe' OR a presigned GET URL for other external services.
 * @property {Storage} [storage] Storage type, by default detected based on `href`
 */

/**
 * @typedef {object} IccProfile
 * @description Either referencing a standard profile from {@link StandardIccProfileNames} in `profileName`, or a custom profile through `input`.
 * @property {Colorspace} imageMode Image mode
 * @property {Input} input Custom ICC profile href to a Creative Cloud asset or presigned URL
 * @property {string} profileName Standard ICC profile name (e.g. `Adobe RGB (1998)`)
 */

/**
 * @typedef {object} Output
 * @property {string} href (all) Either an href to a single Creative Cloud asset for storage='adobe' OR a presigned GET URL for other external services.
 * @property {Storage} [storage] (all) Storage type, by default detected based on `href`
 * @property {MimeType} [type] (all) Desired output image format, by default detected based on `href` extension
 * @property {boolean} [overwrite=true] (all) If the file already exists, indicates if the output file should be overwritten. Will eventually support eTags. Only applies to CC Storage
 * @property {object} [mask] (createMask, createCutout) Type of mask to create
 * @property {'binary'|'soft'} mask.format (createMask, createCutout) Binary or soft mask to create
 * @property {number} [width=0] (document) width, in pixels, of the renditions. Width of 0 generates a full size rendition. Height is not necessary as the rendition generate will automatically figure out the correct width-to-height aspect ratio. Only supported for image renditions
 * @property {number} [quality=7] (document) quality of the renditions for JPEG. Range from 1 to 7, with 7 as the highest quality.
 * @property {PngCompression} [compression=large] (document) compression level for PNG: small, medium or large
 * @property {boolean} [trimToCanvas=false] (document) 'false' generates renditions that are the actual size of the layer (as seen by View > Show > Layer Edges within the Photoshop desktop app) but will remove any extra transparent pixel padding. 'true' generates renditions that are the size of the canvas, either trimming the layer to the visible portion of the canvas or padding extra space. If the requested file format supports transparency than transparent pixels will be used for padding, otherwise white pixels will be used.
 * @property {LayerReference[]} [layers] (document) An array of layer objects. By including this array you are signaling that you'd like a rendition created from these layer id's or layer names. Excluding it will generate a document-level rendition.
 * @property {IccProfile} [iccProfile] (document) Describes the ICC profile to convert to
 */

/**
 * White balance enum
 *
 * @readonly
 * @enum
 */
const WhiteBalance = {
  AS_SHOT: 'As Shot',
  AUTO: 'Auto',
  CLOUDY: 'Cloudy',
  CUSTOM: 'Custom',
  DAYLIGHT: 'Daylight',
  FLASH: 'Flash',
  FLUORESCENT: 'Fluorescent',
  SHADE: 'Shade',
  TUNGSTEN: 'Tungsten'
}

/**
 * @typedef {object} EditPhotoOptions
 * @property {number} Contrast integer [ -100 .. 100 ]
 * @property {number} Saturation integer [ -100 .. 100 ]
 * @property {number} VignetteAmount integer [ -100 .. 100 ]
 * @property {number} Vibrance integer [ -100 .. 100 ]
 * @property {number} Highlights integer [ -100 .. 100 ]
 * @property {number} Shadows integer [ -100 .. 100 ]
 * @property {number} Whites integer [ -100 .. 100 ]
 * @property {number} Blacks integer [ -100 .. 100 ]
 * @property {number} Clarity integer [ -100 .. 100 ]
 * @property {number} Dehaze integer [ -100 .. 100 ]
 * @property {number} Texture integer [ -100 .. 100 ]
 * @property {number} Sharpness integer [ 0 .. 150 ]
 * @property {number} ColorNoiseReduction integer [ 0 .. 100 ]
 * @property {number} NoiseReduction integer [ 0 .. 100 ]
 * @property {number} SharpenDetail integer [ 0 .. 100 ]
 * @property {number} SharpenEdgeMasking integer [ 0 .. 10 ]
 * @property {number} Exposure float [ -5 .. 5 ]
 * @property {number} SharpenRadius float [ 0.5 .. 3 ]
 * @property {WhiteBalance} WhiteBalance white balance
 */

/**
 * Action to take if there are one or more missing fonts in the document
 *
 * @readonly
 * @enum
 */
const ManageMissingFonts = {
  /**
   * The job will succeed, however, by default all the missing fonts will be replaced with this font: ArialMT
   */
  USE_DEFAULT: 'useDefault',
  /**
   * The job will not succeed and the status will be set to "failed", with the details of the error provided in the "details" section in the status
   */
  FAIL: 'fail'
}

/**
 * Background fill
 *
 * @readonly
 * @enum
 */
const BackgroundFill = {
  WHITE: 'white',
  BACKGROUND_COLOR: 'backgroundColor',
  TRANSPARENT: 'transparent'
}

/**
 * Layer type
 *
 * @readonly
 * @enum
 */
const LayerType = {
  /**
   * A pixel layer
   */
  LAYER: 'layer',
  /**
   * A text layer
   */
  TEXT_LAYER: 'textLayer',
  /**
   * An adjustment layer
   */
  ADJUSTMENT_LAYER: 'adjustmentLayer',
  /**
   * Group of layers
   */
  LAYER_SECTION: 'layerSection',
  /**
   * A smart object
   */
  SMART_OBJECT: 'smartObject',
  /**
   * The background layer
   */
  BACKGROUND_LAYER: 'backgroundLayer',
  /**
   * A fill layer
   */
  FILL_LAYER: 'fillLayer'
}

/**
 * @typedef {object} Bounds
 * @property {number} top Top position of the layer (in pixels)
 * @property {number} left Left position of the layer (in pixels)
 * @property {number} width Layer width (in pixels)
 * @property {number} height Layer height (in pixels)
 */

/**
 * @typedef {object} LayerMask
 * @property {boolean} [clip] Indicates if this is a clipped layer
 * @property {boolean} [enabled=true] Indicates a mask is enabled on that layer or not.
 * @property {boolean} [linked=true] Indicates a mask is linked to the layer or not.
 * @property {object} [offset] An object to specify mask offset on the layer.
 * @property {number} [offset.x=0] Offset to indicate horizontal move of the mask
 * @property {number} [offset.y=0] Offset to indicate vertical move of the mask
 */

/**
 * Blend modes
 *
 * @enum
 * @readonly
 */
const BlendMode = {
  NORMAL: 'normal',
  DISSOLVE: 'dissolve',
  DARKEN: 'darken',
  MULTIPLY: 'multiply',
  COLOR_BURN: 'colorBurn',
  LINEAR_BURN: 'linearBurn',
  DARKER_COLOR: 'darkerColor',
  LIGHTEN: 'lighten',
  SCREEN: 'screen',
  COLOR_DODGE: 'colorDodge',
  LINEAR_DODGE: 'linearDodge',
  LIGHTER_COLOR: 'lighterColor',
  OVERLAY: 'overlay',
  SOFT_LIGHT: 'softLight',
  HARD_LIGHT: 'hardLight',
  VIVID_LIGHT: 'vividLight',
  LINEAR_LIGHT: 'linearLight',
  PIN_LIGHT: 'pinLight',
  HARD_MIX: 'hardMix',
  DIFFERENCE: 'difference',
  EXCLUSION: 'exclusion',
  SUBTRACT: 'subtract',
  DIVIDE: 'divide',
  HUE: 'hue',
  SATURATION: 'saturation',
  COLOR: 'color',
  LUMINOSITY: 'luminosity'
}

/**
 * @typedef {object} BlendOptions
 * @property {number} [opacity=100] Opacity value of the layer
 * @property {BlendMode} [blendMode="normal"] Blend mode of the layer
 */

/**
 * @typedef {object} BrightnessContrast
 * @property {number} [brightness=0] Adjustment layer brightness (-150...150)
 * @property {number} [contrast=0] Adjustment layer contrast (-150...150)
 */

/**
 * @typedef {object} Exposure
 * @property {number} [exposure=0] Adjustment layer exposure (-20...20)
 * @property {number} [offset=0] Adjustment layer exposure offset (-0.5...0.5)
 * @property {number} [gammaCorrection=1] Adjustment layer gamma correction (0.01...9.99)
 */

/**
 * @typedef {object} HueSaturationChannel
 * @property {string} [channel="master"] Allowed values: "master"
 * @property {number} [hue=0] Hue adjustment (-180...180)
 * @property {number} [saturation=0] Saturation adjustment (-100...100)
 * @property {number} [lightness=0] Lightness adjustment (-100...100)
 */

/**
 * @typedef {object} HueSaturation
 * @property {boolean} [colorize=false] Colorize
 * @property {HueSaturationChannel[]} [channels=[]] An array of hashes representing the 'master' channel (the remaining five channels of 'magentas', 'yellows', 'greens', etc are not yet supported)
 */

/**
 * @typedef {object} ColorBalance
 * @property {boolean} [preserveLuminosity=true] Preserve luminosity
 * @property {number[]} [shadowLevels=[0,0,0]] Shadow levels (-100...100)
 * @property {number[]} [midtoneLevels=[0,0,0]] Midtone levels (-100...100)
 * @property {number[]} [highlightLevels=[0,0,0]] Highlight levels (-100...100)
 */

/**
 * @typedef {object} AdjustmentLayer
 * @property {BrightnessContrast} [brightnessContrast] Brightness and contrast settings
 * @property {Exposure} [exposure] Exposure settings
 * @property {HueSaturation} [hueSaturation] Hue and saturation settings
 * @property {ColorBalance} [colorBalance] Color balance settings
 */

/**
 * Text orientation
 *
 * @enum
 * @readonly
 */
const TextOrientation = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical'
}

/**
 * @typedef {object} FontColorRgb
 * @property {number} red Red color (0...32768)
 * @property {number} green Green color (0...32768)
 * @property {number} blue Blue color (0...32768)
 */
/**
 * @typedef {object} FontColorCmyk
 * @property {number} cyan Cyan color (0...32768)
 * @property {number} magenta Magenta color (0...32768)
 * @property {number} yellowColor Yellow color (0...32768)
 * @property {number} black Black color (0...32768)
 */
/**
 * @typedef {object} FontColorGray
 * @property {number} gray Gray color (0...32768)
 */
/**
 * @typedef {object} FontColor
 * @property {FontColorRgb} rgb Font color settings for RGB mode (16-bit)
 * @property {FontColorCmyk} cmyk Font color settings for CMYK mode (16-bit)
 * @property {FontColorGray} gray Font color settings for Gray mode (16-bit)
 */
/**
 * @typedef {object} CharacterStyle
 * @property {number} [from] The beginning of the range of characters that this characterStyle applies to. Based on initial index of 0. For example a style applied to only the first two characters would be from=0 and to=1
 * @property {number} [to] The ending of the range of characters that this characterStyle applies to. Based on initial index of 0. For example a style applied to only the first two characters would be from=0 and to=1
 * @property {number} [fontSize] Font size (in points)
 * @property {string} [fontName] Font postscript name (see https://github.com/AdobeDocs/photoshop-api-docs/blob/master/SupportedFonts.md)
 * @property {TextOrientation} [orientation="horizontal"] Text orientation
 * @property {FontColor} [fontColor] The font color settings (one of rgb, cmyk, gray, lab)
 */

/**
 * Paragraph alignment
 *
 * @enum
 * @readonly
 */
const ParagraphAlignment = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
  JUSTIFY: 'justify',
  JUSTIFY_LEFT: 'justifyLeft',
  JUSTIFY_CENTER: 'justifyCenter',
  JUSTIFY_RIGHT: 'justifyRight'
}

/**
 * Horizontal alignment
 *
 * @enum
 * @readonly
 */
const HorizontalAlignment = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right'
}

/**
 * Vertical alignment
 *
 * @enum
 * @readonly
 */
const VerticalAlignment = {
  TOP: 'top',
  CENTER: 'center',
  BOTTOM: 'bottom'
}

/**
 * @typedef {object} ParagraphStyle
 * @property {ParagraphAlignment} [alignment="left"] Paragraph alignment
 * @property {number} [from] The beginning of the range of characters that this paragraphStyle applies to. Based on initial index of 0. For example a style applied to only the first two characters would be from=0 and to=1
 * @property {number} [to] The ending of the range of characters that this characterStyle applies to. Based on initial index of 0. For example a style applied to only the first two characters would be from=0 and to=1
 */

/**
 * @typedef {object} TextLayer
 * @property {string} content The text string
 * @property {CharacterStyle[]} [characterStyles] If the same supported attributes apply to all characters in the layer than this will be an array of one item, otherwise each characterStyle object will have a 'from' and 'to' value indicating the range of characters that the style applies to.
 * @property {ParagraphStyle[]} [paragraphStyles] If the same supported attributes apply to all characters in the layer than this will be an array of one item, otherwise each paragraphStyle object will have a 'from' and 'to' value indicating the range of characters that the style applies to.
 */

/**
 * @typedef {object} SmartObject
 * @property {string} type Desired image format for the smart object
 * @property {boolean} [linked=false] Indicates if this smart object is linked.
 * @property {string} [path] Relative path for the linked smart object
 */

/**
 * @typedef {object} FillLayer
 * @property {object} solidColor An object describing the solid color type for this fill layer. Currently supported mode is RGB only.
 * @property {number} solidColor.red Red color (0...255)
 * @property {number} solidColor.green Green color (0...255)
 * @property {number} solidColor.blue Blue color (0...255)
 */

/**
 * @typedef {object} LayerReference
 * @property {number} [id] The id of the layer you want to move above. Use either id OR name.
 * @property {string} [name] The name of the layer you want to move above. Use either id OR name.
 */

/**
 * @typedef {object} AddLayerPosition
 * @property {LayerReference} [insertAbove] Used to add the layer above another. If the layer ID indicated is a group layer than the layer will be inserted above the group layer.
 * @property {LayerReference} [insertBelow] Used to add the layer below another. If the layer ID indicated is a group layer than the layer will be inserted below (and outside of) the group layer
 * @property {LayerReference} [insertInto] Used to add the layer inside of a group. Useful when you need to move a layer to an empty group.
 * @property {boolean} [insertTop] Indicates the layer should be added at the top of the layer stack.
 * @property {boolean} [insertBottom] Indicates the layer should be added at the bottom of the layer stack. If the image has a background image than the new layer will be inserted above it instead.
 */

/**
 * @typedef {object} MoveLayerPosition
 * @property {boolean} [moveChildren=true] If layer is a group layer than true = move the set as a unit. Otherwise an empty group is moved and any children are left where they were, un-grouped.
 * @property {LayerReference} [insertAbove] Used to move the layer above another. If the layer ID indicated is a group layer than the layer will be inserted above the group layer.
 * @property {LayerReference} [insertBelow] Used to move the layer below another. If the layer ID indicated is a group layer than the layer will be inserted below (and outside of) the group layer
 * @property {LayerReference} [insertInto] Used to move the layer inside of a group. Useful when you need to move a layer to an empty group.
 * @property {boolean} [insertTop] Indicates the layer should be moved at the top of the layer stack.
 * @property {boolean} [insertBottom] Indicates the layer should be moved at the bottom of the layer stack. If the image has a background image than the new layer will be inserted above it instead.
 */

/**
 * @typedef {object} Layer
 * @property {LayerType} type Layer type, supported: LAYER, TEXT_LAYER, ADJUSTMENT_LAYER, SMART_OBJECT, FILL_LAYER
 * @property {number} [id] (modify, manifest) they layer id
 * @property {number} [index] (modify) the layer index. Required when deleting a layer, otherwise not used
 * @property {string} [name] Layer name
 * @property {boolean} [locked=false] Is the layer locked
 * @property {boolean} [visible=true] Is the layer visible
 * @property {Input} input (create, modify) An object describing the input file to add or replace for a Pixel or Embedded Smart object layer. Supported image types are PNG or JPEG. Images support bounds. If the bounds do not reflect the width and height of the image the image will be resized to fit the bounds. Smart object replacement supports PNG, JPEG, PSD, SVG, AI, PDF. Added images are always placed at (top,left = 0,0) and bounds are ignored. Edited images are replaced for exact pixel size
 * @property {AdjustmentLayer} [adjustments] Adjustment layer attributes
 * @property {Bounds} [bounds] The bounds of the layer, applicable to: LAYER, TEXT_LAYER, ADJUSTMENT_LAYER, LAYER_SECTION, SMART_OBJECT, FILL_LAYER
 * @property {LayerMask} [mask] An object describing the input mask to be added or replaced to the layer. Supported mask type is Layer Mask. The input file must be a greyscale image. Supported file types are jpeg, png and psd.
 * @property {SmartObject} [smartObject] An object describing the attributes specific to creating or editing a smartObject. SmartObject properties need the input smart object file to operate on, which can be obtained from Input block. Currently we support Embedded Smart Object only. So this block is optional. If you are creating a Linked Smart Object, this is a required block.
 * @property {FillLayer} [fill] Fill layer attributes
 * @property {TextLayer} [text] Text layer attributes
 * @property {BlendOptions} [blendOptions] Blend options of a layer, including opacity and blend mode
 * @property {boolean} [fillToCanvas=false] Indicates if this layer needs to be proportionally filled in to the entire canvas of the document. Applicable only to layer type="smartObject" or layer type="layer".
 * @property {HorizontalAlignment} [horizontalAlign] Indicates the horizontal position where this layer needs to be placed at. Applicable only to layer type="smartObject" or layer type="layer".
 * @property {VerticalAlignment} [verticalAlign] Indicates the vertical position where this layer needs to be placed at. Applicable only to layer type="smartObject" or layer type="layer".
 * @property {object} [edit] (modify) Indicates you want to edit the layer identified by it's id or name. Note the object is currently empty but leaves room for futher enhancements. The layer block should than contain changes from the original manifest. If you apply it to a group layer you will be effecting the attributes of the group layer itself, not the child layers
 * @property {MoveLayerPosition} [move] (modify) Indicates you want to move the layer identified by it's id or name. You must also indicate where you want to move the layer by supplying one of the attributes insertAbove, insertBelow, insertInto, insertTop or insertBottom
 * @property {AddLayerPosition} [add] (modify) Indicates you want to add a new layer. You must also indicate where you want to insert the new layer by supplying one of the attributes insertAbove, insertBelow, insertInto, insertTop or insertBottom After successful completion of this async request please call layers.read again in order to get a refreshed manifest with the latest layer indexes and any new layer id's. Currently supported layer types available for add are: layer, adjustmentLayer, textLayer, fillLayer
 * @property {boolean} [delete] (modify) Indicates you want to delete the layer, including any children, identified by the id or name. Note the object is currently empty but leaves room for futher enhancements.
 */

/**
 * @typedef {object} SmartObjectLayer
 * @property {number} [id] (modify, smart object, manifest) they layer id
 * @property {string} [name] (all) Layer name
 * @property {boolean} [locked=false] (all) Is the layer locked
 * @property {boolean} [visible=true] (all) Is the layer visible
 * @property {Input} input (create, modify, smart object) An object describing the input file to add or replace for a Pixel or Embedded Smart object layer. Supported image types are PNG or JPEG. Images support bounds. If the bounds do not reflect the width and height of the image the image will be resized to fit the bounds. Smart object replacement supports PNG, JPEG, PSD, SVG, AI, PDF. Added images are always placed at (top,left = 0,0) and bounds are ignored. Edited images are replaced for exact pixel size
 * @property {Bounds} [bounds] (all) The bounds of the layer, applicable to: LAYER, TEXT_LAYER, ADJUSTMENT_LAYER, LAYER_SECTION, SMART_OBJECT, FILL_LAYER
 * @property {AddLayerPosition} [add] (modify, smart object) Indicates you want to add a new layer. You must also indicate where you want to insert the new layer by supplying one of the attributes insertAbove, insertBelow, insertInto, insertTop or insertBottom After successful completion of this async request please call layers.read again in order to get a refreshed manifest with the latest layer indexes and any new layer id's. Currently supported layer types available for add are: layer, adjustmentLayer, textLayer, fillLayer
 */

/**
 * @typedef {object} ModifyDocumentOptions
 * @property {ManageMissingFonts} [manageMissingFonts='useDefault'] Action to take if there are one or more missing fonts in the document
 * @property {string} [globalFont] The full postscript name of the font to be used as the global default for the document. This font will be used for any text layer which has a missing font and no other font has been specifically provided for that layer. If this font itself is missing, the option specified for manageMissingFonts from above will take effect.
 * @property {Input[]} [fonts] Array of custom fonts needed in this document. Filename should be <font_postscript_name>.otf
 * @property {object} [document] Document attributes
 * @property {object} [document.canvasSize] Crop parameters
 * @property {Bounds} [document.canvasSize.bounds] The bounds to crop the document
 * @property {object} [document.imageSize] Resize parameters. resizing a PSD always maintains the original aspect ratio by default. If the new width & height values specified in the parameters does not match the original aspect ratio, then the specified height will not be used and the height will be determined automatically
 * @property {number} [document.imageSize.width] Resize width
 * @property {number} [document.imageSize.height] Resize height
 * @property {object} [document.trim] Image trim parameters
 * @property {'transparentPixels'} [document.trim.basedOn='transparentPixels'] Type of pixel to trim
 * @property {Layer[]} [layers] An array of layer objects you wish to act upon (edit, add, delete). Any layer missing an "operations" block will be ignored.
 */

/**
 * @typedef {object} CreateDocumentOptions
 * @property {ManageMissingFonts} [manageMissingFonts='useDefault'] Action to take if there are one or more missing fonts in the document
 * @property {string} [globalFont] The full postscript name of the font to be used as the global default for the document. This font will be used for any text layer which has a missing font and no other font has been specifically provided for that layer. If this font itself is missing, the option specified for manageMissingFonts from above will take effect.
 * @property {Input[]} [fonts] Array of custom fonts needed in this document. Filename should be <font_postscript_name>.otf
 * @property {object} document Document attributes
 * @property {number} document.width Document width
 * @property {number} document.height Document height
 * @property {number} document.resolution Document resolution in pixels per inch. Allowed values: [72 ... 300].
 * @property {BackgroundFill} document.fill Background fill
 * @property {Colorspace} document.mode Color space
 * @property {number} document.depth Bit depth. Allowed values: 8, 16, 32
 * @property {Layer[]} [layers] An array of layer objects representing the layers to be created, in the same order as provided (from top to bottom).
 */

/**
 * @typedef {object} ReplaceSmartObjectOptions
 * @property {SmartObjectLayer[]} layers An array of layer objects you wish to act upon (edit, add, delete). Any layer missing an "operations" block will be ignored.
 */

/**
 * Output status
 *
 * @enum
 * @readonly
 */
const JobOutputStatus = {
  /**
   * request has been accepted and is waiting to start
   */
  PENDING: 'pending',
  /**
   * the child job is running
   */
  RUNNING: 'running',
  /**
   * files have been generated and are uploading to destination
   */
  UPLOADING: 'uploading',
  /**
   * the child job has succeeded
   */
  SUCCEEDED: 'succeeded',
  /**
   * the child job has failed
   */
  FAILED: 'failed'
}

/**
 * @typedef {object} JobOutput
 * @property {string} input the original input file path
 * @property {JobOutputStatus} status output status
 */

module.exports = {
  BackgroundFill,
  BlendMode,
  Colorspace,
  HorizontalAlignment,
  LayerType,
  VerticalAlignment,
  ManageMissingFonts,
  MimeType,
  JobOutputStatus,
  ParagraphAlignment,
  PngCompression,
  StandardIccProfileNames,
  Storage,
  TextOrientation,
  WhiteBalance
}
