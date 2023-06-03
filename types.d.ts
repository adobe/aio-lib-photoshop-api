/**
 * File resolver options
 * @property [presignExpiryInSeconds = 3600] - Expiry time of any presigned urls, defaults to 1 hour
 * @property [defaultAdobeCloudPaths] - True if paths should be considered references to files in Creative Cloud
 */
declare type FileResolverOptions = {
    presignExpiryInSeconds?: number;
    defaultAdobeCloudPaths?: boolean;
};

/**
 * Construct a file resolver
 * @param [files] - Adobe I/O Files instance
 * @param [options] - Options
 */
declare class FileResolver {
    constructor(files?: any, options?: FileResolverOptions);
    /**
     * Expiry time of presigned urls in seconds
     */
    presignExpiryInSeconds: number;
    /**
     * Plain paths can reference either Adobe Creative Cloud or Adobe I/O Files.
     *
     * If an instance of files is provided, the default is considered to be
     * Adobe I/O Files, otherwise it's Creative Cloud. The default can be overridden
     * using the options
     */
    defaultPathStorage: Storage;
    /**
     * Resolve input file from href to an object with href and storage
     * @param input - Input or href to resolve
     * @returns resolved input
     */
    resolveInput(input: string | Input): Input;
    /**
     * Resolve input files from hrefs to an array of objects with href and storage
     * @param inputs - One or more files
     * @returns resolved files
     */
    resolveInputs(inputs: string | string[] | Input | Input[]): Input[];
    /**
     * Resolve the font and layer inputs in the document options
     * @param options - Document options
     * @returns Document options
     */
    resolveInputsDocumentOptions(options: CreateDocumentOptions | ModifyDocumentOptions | ReplaceSmartObjectOptions): CreateDocumentOptions | ModifyDocumentOptions | ReplaceSmartObjectOptions;
    /**
     * Resolve the actions, fonts, and custom presets options
     * @param options - Photoshop Actions options
     * @returns Photoshop Actions options
     */
    resolveInputsPhotoshopActionsOptions(options: ApplyPhotoshopActionsOptions): ApplyPhotoshopActionsOptions;
    /**
     * Resolve output from href to an object with href, storage, and type
     * @param output - One or more output files
     * @returns resolved files
     */
    resolveOutput(output: string | File | Output): Output;
    /**
     * Resolve outputs from href to an object with href, storage, and type
     * @param outputs - One or more output files
     * @returns resolved files
     */
    resolveOutputs(outputs: string | string[] | File | File[] | Output | Output[]): Output[];
}

/**
 * Determine if we should retry fetch due to Server errors (server busy or other application errors)
 * @param response - Fetch response object, should at least have a status property which is the HTTP status code received
 * @returns true if we should retry or false if not
 */
declare function shouldRetryFetch(response: any): boolean;

/**
 * Fetch a URL, with retry options provided or default retry options otherwise
 * By default retries will happen for 14 seconds (3 retries at 1, 2 and then 4 seconds -- there cannot be enough time for anotehr retry after that)
 * Retry will occur if error code 429 or >= 500 occurs.
 * @param options - Fetch options object, which can also include retryOptions described here https://github.com/adobe/node-fetch-retry
 * @returns Wrapped node fetch retry function which takes our preferred default options
 */
declare function nodeFetchRetry(options: any): (...params: any[]) => any;

/**
 * Parse through options object and determine correct parameters to Swagger for desired fetch approach
 * @param options - Photoshop API options object
 * @returns Swagger options object with relevant settings for fetch module
 */
declare function getFetchOptions(options: any): any;

/**
 * Returns a Promise that resolves with a new PhotoshopAPI object.
 * @param orgId - IMS organization id
 * @param apiKey - the API key for your integration
 * @param accessToken - the access token for your integration
 * @param [files] - Adobe I/O Files instance
 * @param [options] - Options
 * @returns a Promise with a PhotoshopAPI object
 */
declare function init(orgId: string, apiKey: string, accessToken: string, files?: any, options?: PhotoshopAPIOptions): Promise<PhotoshopAPI>;

/**
 * Photoshop API options
 * @property [presignExpiryInSeconds = 3600] - Expiry time of any presigned urls, defaults to 1 hour
 * @property [defaultAdobeCloudPaths] - True if paths should be considered references to files in Creative Cloud
 * @property [useSwaggerFetch = false] - True if Swagger's fetch implementation should be used, otherwise will use userFetch if provided or @adobe/node-fetch-retry if nothing else.
 * @property [userFetch] - Fetch function to use replacing Swagger's fetch and node-fetch-retry.  Useful for mocking, etc
 */
declare type PhotoshopAPIOptions = {
    presignExpiryInSeconds?: number;
    defaultAdobeCloudPaths?: boolean;
    useSwaggerFetch?: boolean;
    userFetch?: (...params: any[]) => any;
};

/**
 * This class provides methods to call your PhotoshopAPI APIs.
 * Before calling any method initialize the instance by calling the `init` method on it
 * with valid values for orgId, apiKey and accessToken
 */
declare class PhotoshopAPI {
    /**
     * Initializes the PhotoshopAPI object and returns it.
     * @param orgId - the IMS organization id
     * @param apiKey - the API key for your integration
     * @param accessToken - the access token for your integration
     * @param [files] - Adobe I/O Files instance
     * @param [options] - Options
     * @returns a PhotoshopAPI object
     */
    init(orgId: string, apiKey: string, accessToken: string, files?: any, options?: PhotoshopAPIOptions): Promise<PhotoshopAPI>;
    /**
     * The IMS organization id
     */
    orgId: string;
    /**
     * The api key from your integration
     */
    apiKey: string;
    /**
     * The access token from your integration
     */
    accessToken: string;
    /**
     * Create a cutout mask, and apply it to the input
     * @param input - Input file
     * @param output - Output file
     * @returns Auto cutout job
     */
    createCutout(input: string | Input, output: string | Output): Job;
    /**
     * Create a cutout mask
     * @param input - Input file
     * @param output - Output file
     * @returns Auto masking job
     */
    createMask(input: string | Input, output: string | Output): Job;
    /**
     * Straighten photo
     * @param input - Input file
     * @param outputs - Output file
     * @returns Auto straighten job
     */
    straighten(input: string | Input, outputs: string | Output | Output[]): Job;
    /**
     * Automatically tone photo
     * @param input - Input file
     * @param output - Output file
     * @returns Auto tone job
     */
    autoTone(input: string | Input, output: string | Output): Job;
    /**
     * Apply a set of edit parameters on an image
     * @param input - Input file
     * @param output - Output file
     * @param options - Edit options
     * @returns Edit photo job
     */
    editPhoto(input: string | Input, output: string | Output, options: EditPhotoOptions): Job;
    /**
     * Apply a preset on an image
     * @param input - Input file
     * @param preset - Lightroom preset XMP file
     * @param output - Output file
     * @returns Apply preset job
     */
    applyPreset(input: string | Input, preset: string | Input, output: string | Output): Job;
    /**
     * Apply a preset on an image
     * @param input - Input file
     * @param output - Output file
     * @param xmp - Lightroom preset XMP file contents
     * @returns Apply preset job
     */
    applyPresetXmp(input: string | Input, output: string | Output, xmp: string): Job;
    /**
     * Create a new psd, optionally with layers, and then generate renditions and/or save as a psd
     * @param outputs - Desired output
     * @param options - Document create options
     * @returns Create document job
     */
    createDocument(outputs: string | string[] | Output | Output[], options: CreateDocumentOptions): Job;
    /**
     * Extract and return a psd file's layer information
     * @param input - An object describing an input PSD file.Current support is for files less than 1000MB.
     * @param [options] - available options to apply to all input files
     * @param [options.thumbnails] - Include presigned GET URLs to small preview thumbnails for any renderable layer.
     * @param [options.thumbnails.type] - desired image format. Allowed values: "image/jpeg", "image/png", "image/tiff"
     * @returns Get document manifest job
     */
    getDocumentManifest(input: string | Input, options?: {
        thumbnails?: {
            type?: MimeType;
        };
    }): Job;
    /**
     * Apply (optional) psd edits and then generate renditions and/or save a new psd
     * @param input - An object describing an input PSD file. Current support is for files less than 1000MB.
     * @param outputs - Desired output
     * @param options - Modify document options
     * @returns Modify document job
     */
    modifyDocument(input: string | Input, outputs: string | string[] | Output | Output[], options: ModifyDocumentOptions): Job;
    /**
     * Create renditions
     * @param input - An object describing an input file. Currently supported filetypes include: jpeg, png, psd, tiff. Current support is for files less than 1000MB.
     * @param outputs - Desired output
     * @returns Create rendition job
     */
    createRendition(input: string | Input, outputs: string | string[] | Output | Output[]): Job;
    /**
     * Apply psd edits for replacing embedded smart object and then generate renditions and/or save a new psd
     * @param input - An object describing an input PSD file. Current support is for files less than 1000MB.
     * @param outputs - Desired output
     * @param options - Replace smart object options
     * @returns Replace smart object job
     */
    replaceSmartObject(input: Input, outputs: string | Output | Output[], options: ReplaceSmartObjectOptions): Job;
    /**
     * Apply Photoshop Actions and then generate renditions and/or save a new image
     * @param input - An object describing an input image file. Current support is for files less than 1000MB.
     * @param outputs - Desired output
     * @param options - Apply Photoshop Actions options
     * @returns Photoshop Actions job
     */
    applyPhotoshopActions(input: Input, outputs: string | Output | Output[], options: ApplyPhotoshopActionsOptions): Job;
    /**
     * Apply JSON-formatted Photoshop Actions and then generate renditions and/or save a new image
     * @param input - An object describing an input image file. Current support is for files less than 1000MB.
     * @param outputs - Desired output
     * @param options - Apply Photoshop Actions JSON options
     * @returns Photoshop Actions job
     */
    applyPhotoshopActionsJson(input: Input, outputs: string | Output | Output[], options: ApplyPhotoshopActionsJsonOptions): Job;
}

/**
 * Construct a job with the ability to acquire status updates
 * @param response - Service response
 * @param getJobStatus - Async function to get job status
 */
declare class Job {
    constructor(response: any, getJobStatus: (...params: any[]) => any);
    /**
     * URL to request a status update of the job
     */
    url: string;
    /**
     * Job identifier
     */
    jobId: string;
    /**
     * Status of each output sub job
     */
    outputs: JobOutput[];
    /**
     * Check if the job is done
     *
     * A job is marked done when it has either the `succeeded` or `failed` status.
     * @returns True if the job is done, or false if it is still pending/running
     */
    isDone(): boolean;
    /**
     * Poll for job status
     * @returns Job instance
     */
    poll(): Job;
    /**
     * Poll job until done
     * @param [pollTimeMs = 2000] - Polling time
     * @returns Job instance
     */
    pollUntilDone(pollTimeMs?: number): Job;
}

/**
 * Storage types
 */
declare const enum Storage {
    /**
     * href is a path in Adobe I/O Files: https://github.com/adobe/aio-lib-files
     */
    AIO = "aio",
    /**
     * href is a path in Creative Cloud
     */
    ADOBE = "adobe",
    /**
     * href is a presigned get/put url, e.g. AWS S3
     */
    EXTERNAL = "external",
    /**
     * href is an Azure SAS (Shared Access Signature) URL for upload/download
     */
    AZURE = "azure",
    /**
     * href is a temporary upload/download Dropbox link: https://dropbox.github.io/dropbox-api-v2-explorer/
     */
    DROPBOX = "dropbox"
}

/**
 * Mime types
 */
declare const enum MimeType {
    /**
     * Digital Negative, available from `autoTone`, `straighten`, `applyPreset`
     */
    DNG = "image/x-adobe-dng",
    /**
     * JPEG, available from all operations
     */
    JPEG = "image/jpeg",
    /**
     * PNG, available from all operations
     */
    PNG = "image/png",
    /**
     * Photoshop Document, available from `createDocument`, `modifyDocument`, `createRendition`, `replaceSmartObject`
     */
    PSD = "image/vnd.adobe.photoshop",
    /**
     * TIFF format, available from `createDocument`, `modifyDocument`, `createRendition`, `replaceSmartObject`
     */
    TIFF = "image/tiff"
}

/**
 * Compression level for PNG: small, medium or large.
 */
declare const enum PngCompression {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large"
}

/**
 * Color space
 */
declare const enum Colorspace {
    BITMAP = "bitmap",
    GREYSCALE = "greyscale",
    INDEXED = "indexed",
    RGB = "rgb",
    CMYK = "cmyk",
    MULTICHANNEL = "multichannel",
    DUOTONE = "duotone",
    LAB = "lab"
}

/**
 * Standard ICC profile names
 */
declare const enum StandardIccProfileNames {
    ADOBE_RGB_1998 = "Adobe RGB (1998)",
    APPLE_RGB = "Apple RGB",
    COLORMATCH_RGB = "ColorMatch RGB",
    SRGB = "sRGB IEC61966-2.1",
    DOTGAIN_10 = "Dot Gain 10%",
    DOTGAIN_15 = "Dot Gain 15%",
    DOTGAIN_20 = "Dot Gain 20%",
    DOTGAIN_25 = "Dot Gain 25%",
    DOTGAIN_30 = "Dot Gain 30%",
    GRAY_GAMMA_18 = "Gray Gamma 1.8",
    GRAY_GAMMA_22 = "Gray Gamma 2.2"
}

/**
 * A reference to an input file
 * @property href - Either an href to a single Creative Cloud asset for storage='adobe' OR a presigned GET URL for other external services.
 * @property [storage] - Storage type, by default detected based on `href`
 */
declare type Input = {
    href: string;
    storage?: Storage;
};

/**
 * Either referencing a standard profile from {@link StandardIccProfileNames} in `profileName`, or a custom profile through `input`.
 * @property imageMode - Image mode
 * @property input - Custom ICC profile href to a Creative Cloud asset or presigned URL
 * @property profileName - Standard ICC profile name (e.g. `Adobe RGB (1998)`)
 */
declare type IccProfile = {
    imageMode: Colorspace;
    input: Input;
    profileName: string;
};

/**
 * Type of mask to create
 */
declare const enum CreateMaskType {
    /**
     * Binary mask
     */
    BINARY = "binary",
    /**
     * Soft mask
     */
    SOFT = "soft"
}

/**
 * A reference to an output file, including output options
 * @property href - (all) Either an href to a single Creative Cloud asset for storage='adobe' OR a presigned GET URL for other external services.
 * @property [storage] - (all) Storage type, by default detected based on `href`
 * @property [type] - (all) Desired output image format, by default detected based on `href` extension
 * @property [overwrite = true] - (all) If the file already exists, indicates if the output file should be overwritten. Will eventually support eTags. Only applies to CC Storage
 * @property [mask] - (createMask, createCutout) Type of mask to create
 * @property mask.format - (createMask, createCutout) Binary or soft mask to create
 * @property [width = 0] - (document) width, in pixels, of the renditions. Width of 0 generates a full size rendition. Height is not necessary as the rendition generate will automatically figure out the correct width-to-height aspect ratio. Only supported for image renditions
 * @property [quality = 7] - (document) quality of the renditions for JPEG. Range from 1 to 7, with 7 as the highest quality.
 * @property [compression = large] - (document) compression level for PNG: small, medium or large
 * @property [trimToCanvas = false] - (document) 'false' generates renditions that are the actual size of the layer (as seen by View > Show > Layer Edges within the Photoshop desktop app) but will remove any extra transparent pixel padding. 'true' generates renditions that are the size of the canvas, either trimming the layer to the visible portion of the canvas or padding extra space. If the requested file format supports transparency than transparent pixels will be used for padding, otherwise white pixels will be used.
 * @property [layers] - (document) An array of layer objects. By including this array you are signaling that you'd like a rendition created from these layer id's or layer names. Excluding it will generate a document-level rendition.
 * @property [iccProfile] - (document) Describes the ICC profile to convert to
 */
declare type Output = {
    href: string;
    storage?: Storage;
    type?: MimeType;
    overwrite?: boolean;
    mask?: {
        format: CreateMaskType;
    };
    width?: number;
    quality?: number;
    compression?: PngCompression;
    trimToCanvas?: boolean;
    layers?: LayerReference[];
    iccProfile?: IccProfile;
};

/**
 * White balance enum
 */
declare const enum WhiteBalance {
    AS_SHOT = "As Shot",
    AUTO = "Auto",
    CLOUDY = "Cloudy",
    CUSTOM = "Custom",
    DAYLIGHT = "Daylight",
    FLASH = "Flash",
    FLUORESCENT = "Fluorescent",
    SHADE = "Shade",
    TUNGSTEN = "Tungsten"
}

/**
 * Set of edit parameters to apply to an image
 * @property Contrast - integer [ -100 .. 100 ]
 * @property Saturation - integer [ -100 .. 100 ]
 * @property VignetteAmount - integer [ -100 .. 100 ]
 * @property Vibrance - integer [ -100 .. 100 ]
 * @property Highlights - integer [ -100 .. 100 ]
 * @property Shadows - integer [ -100 .. 100 ]
 * @property Whites - integer [ -100 .. 100 ]
 * @property Blacks - integer [ -100 .. 100 ]
 * @property Clarity - integer [ -100 .. 100 ]
 * @property Dehaze - integer [ -100 .. 100 ]
 * @property Texture - integer [ -100 .. 100 ]
 * @property Sharpness - integer [ 0 .. 150 ]
 * @property ColorNoiseReduction - integer [ 0 .. 100 ]
 * @property NoiseReduction - integer [ 0 .. 100 ]
 * @property SharpenDetail - integer [ 0 .. 100 ]
 * @property SharpenEdgeMasking - integer [ 0 .. 10 ]
 * @property Exposure - float [ -5 .. 5 ]
 * @property SharpenRadius - float [ 0.5 .. 3 ]
 * @property WhiteBalance - white balance
 */
declare type EditPhotoOptions = {
    Contrast: number;
    Saturation: number;
    VignetteAmount: number;
    Vibrance: number;
    Highlights: number;
    Shadows: number;
    Whites: number;
    Blacks: number;
    Clarity: number;
    Dehaze: number;
    Texture: number;
    Sharpness: number;
    ColorNoiseReduction: number;
    NoiseReduction: number;
    SharpenDetail: number;
    SharpenEdgeMasking: number;
    Exposure: number;
    SharpenRadius: number;
    WhiteBalance: WhiteBalance;
};

/**
 * Action to take if there are one or more missing fonts in the document
 */
declare const enum ManageMissingFonts {
    /**
     * The job will succeed, however, by default all the missing fonts will be replaced with this font: ArialMT
     */
    USE_DEFAULT = "useDefault",
    /**
     * The job will not succeed and the status will be set to "failed", with the details of the error provided in the "details" section in the status
     */
    FAIL = "fail"
}

/**
 * Background fill
 */
declare const enum BackgroundFill {
    WHITE = "white",
    BACKGROUND_COLOR = "backgroundColor",
    TRANSPARENT = "transparent"
}

/**
 * Layer type
 */
declare const enum LayerType {
    /**
     * A pixel layer
     */
    LAYER = "layer",
    /**
     * A text layer
     */
    TEXT_LAYER = "textLayer",
    /**
     * An adjustment layer
     */
    ADJUSTMENT_LAYER = "adjustmentLayer",
    /**
     * Group of layers
     */
    LAYER_SECTION = "layerSection",
    /**
     * A smart object
     */
    SMART_OBJECT = "smartObject",
    /**
     * The background layer
     */
    BACKGROUND_LAYER = "backgroundLayer",
    /**
     * A fill layer
     */
    FILL_LAYER = "fillLayer"
}

/**
 * Layer bounds (in pixels)
 * @property top - Top position of the layer
 * @property left - Left position of the layer
 * @property width - Layer width
 * @property height - Layer height
 */
declare type Bounds = {
    top: number;
    left: number;
    width: number;
    height: number;
};

/**
 * Mask applied to an layer
 * @property [clip] - Indicates if this is a clipped layer
 * @property [enabled = true] - Indicates a mask is enabled on that layer or not.
 * @property [linked = true] - Indicates a mask is linked to the layer or not.
 * @property [offset] - An object to specify mask offset on the layer.
 * @property [offset.x = 0] - Offset to indicate horizontal move of the mask
 * @property [offset.y = 0] - Offset to indicate vertical move of the mask
 */
declare type LayerMask = {
    clip?: boolean;
    enabled?: boolean;
    linked?: boolean;
    offset?: {
        x?: number;
        y?: number;
    };
};

/**
 * Blend modes
 */
declare const enum BlendMode {
    NORMAL = "normal",
    DISSOLVE = "dissolve",
    DARKEN = "darken",
    MULTIPLY = "multiply",
    COLOR_BURN = "colorBurn",
    LINEAR_BURN = "linearBurn",
    DARKER_COLOR = "darkerColor",
    LIGHTEN = "lighten",
    SCREEN = "screen",
    COLOR_DODGE = "colorDodge",
    LINEAR_DODGE = "linearDodge",
    LIGHTER_COLOR = "lighterColor",
    OVERLAY = "overlay",
    SOFT_LIGHT = "softLight",
    HARD_LIGHT = "hardLight",
    VIVID_LIGHT = "vividLight",
    LINEAR_LIGHT = "linearLight",
    PIN_LIGHT = "pinLight",
    HARD_MIX = "hardMix",
    DIFFERENCE = "difference",
    EXCLUSION = "exclusion",
    SUBTRACT = "subtract",
    DIVIDE = "divide",
    HUE = "hue",
    SATURATION = "saturation",
    COLOR = "color",
    LUMINOSITY = "luminosity"
}

/**
 * Layer blend options
 * @property [opacity = 100] - Opacity value of the layer
 * @property [blendMode = "normal"] - Blend mode of the layer
 */
declare type BlendOptions = {
    opacity?: number;
    blendMode?: BlendMode;
};

/**
 * Adjustment layer brightness and contrast settings
 * @property [brightness = 0] - Adjustment layer brightness (-150...150)
 * @property [contrast = 0] - Adjustment layer contrast (-150...150)
 */
declare type BrightnessContrast = {
    brightness?: number;
    contrast?: number;
};

/**
 * Adjustment layer exposure settings
 * @property [exposure = 0] - Adjustment layer exposure (-20...20)
 * @property [offset = 0] - Adjustment layer exposure offset (-0.5...0.5)
 * @property [gammaCorrection = 1] - Adjustment layer gamma correction (0.01...9.99)
 */
declare type Exposure = {
    exposure?: number;
    offset?: number;
    gammaCorrection?: number;
};

/**
 * Master channel hue and saturation settings
 * @property [channel = "master"] - Allowed values: "master"
 * @property [hue = 0] - Hue adjustment (-180...180)
 * @property [saturation = 0] - Saturation adjustment (-100...100)
 * @property [lightness = 0] - Lightness adjustment (-100...100)
 */
declare type HueSaturationChannel = {
    channel?: string;
    hue?: number;
    saturation?: number;
    lightness?: number;
};

/**
 * Adjustment layer hue and saturation settings
 * @property [colorize = false] - Colorize
 * @property [channels = []] - An array of hashes representing the 'master' channel (the remaining five channels of 'magentas', 'yellows', 'greens', etc are not yet supported)
 */
declare type HueSaturation = {
    colorize?: boolean;
    channels?: HueSaturationChannel[];
};

/**
 * Adjustment layer color balance settings
 * @property [preserveLuminosity = true] - Preserve luminosity
 * @property [shadowLevels = [0,0,0]] - Shadow levels (-100...100)
 * @property [midtoneLevels = [0,0,0]] - Midtone levels (-100...100)
 * @property [highlightLevels = [0,0,0]] - Highlight levels (-100...100)
 */
declare type ColorBalance = {
    preserveLuminosity?: boolean;
    shadowLevels?: number[];
    midtoneLevels?: number[];
    highlightLevels?: number[];
};

/**
 * Adjustment layer settings
 * @property [brightnessContrast] - Brightness and contrast settings
 * @property [exposure] - Exposure settings
 * @property [hueSaturation] - Hue and saturation settings
 * @property [colorBalance] - Color balance settings
 */
declare type AdjustmentLayer = {
    brightnessContrast?: BrightnessContrast;
    exposure?: Exposure;
    hueSaturation?: HueSaturation;
    colorBalance?: ColorBalance;
};

/**
 * Text orientation
 */
declare const enum TextOrientation {
    HORIZONTAL = "horizontal",
    VERTICAL = "vertical"
}

/**
 * Font color settings for RGB mode (16-bit)
 * @property red - Red color (0...32768)
 * @property green - Green color (0...32768)
 * @property blue - Blue color (0...32768)
 */
declare type FontColorRgb = {
    red: number;
    green: number;
    blue: number;
};

/**
 * Font color settings for CMYK mode (16-bit)
 * @property cyan - Cyan color (0...32768)
 * @property magenta - Magenta color (0...32768)
 * @property yellowColor - Yellow color (0...32768)
 * @property black - Black color (0...32768)
 */
declare type FontColorCmyk = {
    cyan: number;
    magenta: number;
    yellowColor: number;
    black: number;
};

/**
 * Font color settings for Gray mode (16-bit)
 * @property gray - Gray color (0...32768)
 */
declare type FontColorGray = {
    gray: number;
};

/**
 * Font color settings
 * @property rgb - Font color settings for RGB mode (16-bit)
 * @property cmyk - Font color settings for CMYK mode (16-bit)
 * @property gray - Font color settings for Gray mode (16-bit)
 */
declare type FontColor = {
    rgb: FontColorRgb;
    cmyk: FontColorCmyk;
    gray: FontColorGray;
};

/**
 * Character style settings
 * @property [from] - The beginning of the range of characters that this characterStyle applies to. Based on initial index of 0. For example a style applied to only the first two characters would be from=0 and to=1
 * @property [to] - The ending of the range of characters that this characterStyle applies to. Based on initial index of 0. For example a style applied to only the first two characters would be from=0 and to=1
 * @property [fontSize] - Font size (in points)
 * @property [fontName] - Font postscript name (see https://github.com/AdobeDocs/photoshop-api-docs/blob/master/SupportedFonts.md)
 * @property [orientation = "horizontal"] - Text orientation
 * @property [fontColor] - The font color settings (one of rgb, cmyk, gray, lab)
 */
declare type CharacterStyle = {
    from?: number;
    to?: number;
    fontSize?: number;
    fontName?: string;
    orientation?: TextOrientation;
    fontColor?: FontColor;
};

/**
 * Paragraph alignment
 */
declare const enum ParagraphAlignment {
    LEFT = "left",
    CENTER = "center",
    RIGHT = "right",
    JUSTIFY = "justify",
    JUSTIFY_LEFT = "justifyLeft",
    JUSTIFY_CENTER = "justifyCenter",
    JUSTIFY_RIGHT = "justifyRight"
}

/**
 * Horizontal alignment
 */
declare const enum HorizontalAlignment {
    LEFT = "left",
    CENTER = "center",
    RIGHT = "right"
}

/**
 * Vertical alignment
 */
declare const enum VerticalAlignment {
    TOP = "top",
    CENTER = "center",
    BOTTOM = "bottom"
}

/**
 * Paragraph style
 * @property [alignment = "left"] - Paragraph alignment
 * @property [from] - The beginning of the range of characters that this paragraphStyle applies to. Based on initial index of 0. For example a style applied to only the first two characters would be from=0 and to=1
 * @property [to] - The ending of the range of characters that this characterStyle applies to. Based on initial index of 0. For example a style applied to only the first two characters would be from=0 and to=1
 */
declare type ParagraphStyle = {
    alignment?: ParagraphAlignment;
    from?: number;
    to?: number;
};

/**
 * Text layer settings
 * @property content - The text string
 * @property [characterStyles] - If the same supported attributes apply to all characters in the layer than this will be an array of one item, otherwise each characterStyle object will have a 'from' and 'to' value indicating the range of characters that the style applies to.
 * @property [paragraphStyles] - If the same supported attributes apply to all characters in the layer than this will be an array of one item, otherwise each paragraphStyle object will have a 'from' and 'to' value indicating the range of characters that the style applies to.
 */
declare type TextLayer = {
    content: string;
    characterStyles?: CharacterStyle[];
    paragraphStyles?: ParagraphStyle[];
};

/**
 * Smart object settings
 * @property type - Desired image format for the smart object
 * @property [linked = false] - Indicates if this smart object is linked.
 * @property [path] - Relative path for the linked smart object
 */
declare type SmartObject = {
    type: string;
    linked?: boolean;
    path?: string;
};

/**
 * Fill layer settings
 * @property solidColor - An object describing the solid color type for this fill layer. Currently supported mode is RGB only.
 * @property solidColor.red - Red color (0...255)
 * @property solidColor.green - Green color (0...255)
 * @property solidColor.blue - Blue color (0...255)
 */
declare type FillLayer = {
    solidColor: {
        red: number;
        green: number;
        blue: number;
    };
};

/**
 * Layer reference
 * @property [id] - The id of the layer you want to move above. Use either id OR name.
 * @property [name] - The name of the layer you want to move above. Use either id OR name.
 */
declare type LayerReference = {
    id?: number;
    name?: string;
};

/**
 * Position where to add the layer in the layer hierarchy
 * @property [insertAbove] - Used to add the layer above another. If the layer ID indicated is a group layer than the layer will be inserted above the group layer.
 * @property [insertBelow] - Used to add the layer below another. If the layer ID indicated is a group layer than the layer will be inserted below (and outside of) the group layer
 * @property [insertInto] - Used to add the layer inside of a group. Useful when you need to move a layer to an empty group.
 * @property [insertTop] - Indicates the layer should be added at the top of the layer stack.
 * @property [insertBottom] - Indicates the layer should be added at the bottom of the layer stack. If the image has a background image than the new layer will be inserted above it instead.
 */
declare type AddLayerPosition = {
    insertAbove?: LayerReference;
    insertBelow?: LayerReference;
    insertInto?: LayerReference;
    insertTop?: boolean;
    insertBottom?: boolean;
};

/**
 * Position where to move the layer to in the layer hierarchy
 * @property [moveChildren = true] - If layer is a group layer than true = move the set as a unit. Otherwise an empty group is moved and any children are left where they were, un-grouped.
 * @property [insertAbove] - Used to move the layer above another. If the layer ID indicated is a group layer than the layer will be inserted above the group layer.
 * @property [insertBelow] - Used to move the layer below another. If the layer ID indicated is a group layer than the layer will be inserted below (and outside of) the group layer
 * @property [insertInto] - Used to move the layer inside of a group. Useful when you need to move a layer to an empty group.
 * @property [insertTop] - Indicates the layer should be moved at the top of the layer stack.
 * @property [insertBottom] - Indicates the layer should be moved at the bottom of the layer stack. If the image has a background image than the new layer will be inserted above it instead.
 */
declare type MoveLayerPosition = {
    moveChildren?: boolean;
    insertAbove?: LayerReference;
    insertBelow?: LayerReference;
    insertInto?: LayerReference;
    insertTop?: boolean;
    insertBottom?: boolean;
};

/**
 * Layer to add, replace, move or delete when manipulating a Photoshop document, or retrieved from the manifest
 * @property type - The layer type
 * @property [id] - (modify, manifest) The layer id
 * @property [index] - (modify, manifest) The layer index. Required when deleting a layer, otherwise not used
 * @property [children] - (manifest) An array of nested layer objects. Only layerSections (group layers) can include children
 * @property [thumbnail] - (manifest) If thumbnails were requested, a presigned GET URL to the thumbnail
 * @property [name] - Layer name
 * @property [locked = false] - Is the layer locked
 * @property [visible = true] - Is the layer visible
 * @property input - (create, modify) An object describing the input file to add or replace for a Pixel or Embedded Smart object layer. Supported image types are PNG or JPEG. Images support bounds. If the bounds do not reflect the width and height of the image the image will be resized to fit the bounds. Smart object replacement supports PNG, JPEG, PSD, SVG, AI, PDF. Added images are always placed at (top,left = 0,0) and bounds are ignored. Edited images are replaced for exact pixel size
 * @property [adjustments] - Adjustment layer attributes
 * @property [bounds] - The bounds of the layer, applicable to: LAYER, TEXT_LAYER, ADJUSTMENT_LAYER, LAYER_SECTION, SMART_OBJECT, FILL_LAYER
 * @property [mask] - An object describing the input mask to be added or replaced to the layer. Supported mask type is Layer Mask. The input file must be a greyscale image. Supported file types are jpeg, png and psd.
 * @property [smartObject] - An object describing the attributes specific to creating or editing a smartObject. SmartObject properties need the input smart object file to operate on, which can be obtained from Input block. Currently we support Embedded Smart Object only. So this block is optional. If you are creating a Linked Smart Object, this is a required block.
 * @property [fill] - Fill layer attributes
 * @property [text] - Text layer attributes
 * @property [blendOptions] - Blend options of a layer, including opacity and blend mode
 * @property [fillToCanvas = false] - Indicates if this layer needs to be proportionally filled in to the entire canvas of the document. Applicable only to layer type="smartObject" or layer type="layer".
 * @property [horizontalAlign] - Indicates the horizontal position where this layer needs to be placed at. Applicable only to layer type="smartObject" or layer type="layer".
 * @property [verticalAlign] - Indicates the vertical position where this layer needs to be placed at. Applicable only to layer type="smartObject" or layer type="layer".
 * @property [edit] - (modify) Indicates you want to edit the layer identified by it's id or name. Note the object is currently empty but leaves room for futher enhancements. The layer block should than contain changes from the original manifest. If you apply it to a group layer you will be effecting the attributes of the group layer itself, not the child layers
 * @property [move] - (modify) Indicates you want to move the layer identified by it's id or name. You must also indicate where you want to move the layer by supplying one of the attributes insertAbove, insertBelow, insertInto, insertTop or insertBottom
 * @property [add] - (modify) Indicates you want to add a new layer. You must also indicate where you want to insert the new layer by supplying one of the attributes insertAbove, insertBelow, insertInto, insertTop or insertBottom After successful completion of this async request please call layers.read again in order to get a refreshed manifest with the latest layer indexes and any new layer id's. Currently supported layer types available for add are: layer, adjustmentLayer, textLayer, fillLayer
 * @property [delete] - (modify) Indicates you want to delete the layer, including any children, identified by the id or name. Note the object is currently empty but leaves room for futher enhancements.
 */
declare type Layer = {
    type: LayerType;
    id?: number;
    index?: number;
    children?: Layer[];
    thumbnail?: string;
    name?: string;
    locked?: boolean;
    visible?: boolean;
    input: Input;
    adjustments?: AdjustmentLayer;
    bounds?: Bounds;
    mask?: LayerMask;
    smartObject?: SmartObject;
    fill?: FillLayer;
    text?: TextLayer;
    blendOptions?: BlendOptions;
    fillToCanvas?: boolean;
    horizontalAlign?: HorizontalAlignment;
    verticalAlign?: VerticalAlignment;
    edit?: any;
    move?: MoveLayerPosition;
    add?: AddLayerPosition;
    delete?: boolean;
};

/**
 * Smart object layer to add or replace
 * @property [id] - (modify, smart object, manifest) they layer id
 * @property [name] - (all) Layer name
 * @property [locked = false] - (all) Is the layer locked
 * @property [visible = true] - (all) Is the layer visible
 * @property input - (create, modify, smart object) An object describing the input file to add or replace for a Pixel or Embedded Smart object layer. Supported image types are PNG or JPEG. Images support bounds. If the bounds do not reflect the width and height of the image the image will be resized to fit the bounds. Smart object replacement supports PNG, JPEG, PSD, SVG, AI, PDF. Added images are always placed at (top,left = 0,0) and bounds are ignored. Edited images are replaced for exact pixel size
 * @property [bounds] - (all) The bounds of the layer, applicable to: LAYER, TEXT_LAYER, ADJUSTMENT_LAYER, LAYER_SECTION, SMART_OBJECT, FILL_LAYER
 * @property [add] - (modify, smart object) Indicates you want to add a new layer. You must also indicate where you want to insert the new layer by supplying one of the attributes insertAbove, insertBelow, insertInto, insertTop or insertBottom After successful completion of this async request please call layers.read again in order to get a refreshed manifest with the latest layer indexes and any new layer id's. Currently supported layer types available for add are: layer, adjustmentLayer, textLayer, fillLayer
 */
declare type SmartObjectLayer = {
    id?: number;
    name?: string;
    locked?: boolean;
    visible?: boolean;
    input: Input;
    bounds?: Bounds;
    add?: AddLayerPosition;
};

/**
 * Global Photoshop document modification options
 * @property [manageMissingFonts = 'useDefault'] - Action to take if there are one or more missing fonts in the document
 * @property [globalFont] - The full postscript name of the font to be used as the global default for the document. This font will be used for any text layer which has a missing font and no other font has been specifically provided for that layer. If this font itself is missing, the option specified for manageMissingFonts from above will take effect.
 * @property [fonts] - Array of custom fonts needed in this document. Filename should be <font_postscript_name>.otf
 * @property [document] - Document attributes
 * @property [document.canvasSize] - Crop parameters
 * @property [document.canvasSize.bounds] - The bounds to crop the document
 * @property [document.imageSize] - Resize parameters. resizing a PSD always maintains the original aspect ratio by default. If the new width & height values specified in the parameters does not match the original aspect ratio, then the specified height will not be used and the height will be determined automatically
 * @property [document.imageSize.width] - Resize width
 * @property [document.imageSize.height] - Resize height
 * @property [document.trim] - Image trim parameters
 * @property [document.trim.basedOn = 'transparentPixels'] - Type of pixel to trim
 * @property [layers] - An array of layer objects you wish to act upon (edit, add, delete). Any layer missing an "operations" block will be ignored.
 */
declare type ModifyDocumentOptions = {
    manageMissingFonts?: ManageMissingFonts;
    globalFont?: string;
    fonts?: Input[];
    document?: {
        canvasSize?: {
            bounds?: Bounds;
        };
        imageSize?: {
            width?: number;
            height?: number;
        };
        trim?: {
            basedOn?: 'transparentPixels';
        };
    };
    layers?: Layer[];
};

/**
 * Photoshop document create options
 * @property [manageMissingFonts = 'useDefault'] - Action to take if there are one or more missing fonts in the document
 * @property [globalFont] - The full postscript name of the font to be used as the global default for the document. This font will be used for any text layer which has a missing font and no other font has been specifically provided for that layer. If this font itself is missing, the option specified for manageMissingFonts from above will take effect.
 * @property [fonts] - Array of custom fonts needed in this document. Filename should be <font_postscript_name>.otf
 * @property document - Document attributes
 * @property document.width - Document width in pixels
 * @property document.height - Document height in pixels
 * @property document.resolution - Document resolution in pixels per inch. Allowed values: [72 ... 300].
 * @property document.fill - Background fill
 * @property document.mode - Color space
 * @property document.depth - Bit depth. Allowed values: 8, 16, 32
 * @property [layers] - An array of layer objects representing the layers to be created, in the same order as provided (from top to bottom).
 */
declare type CreateDocumentOptions = {
    manageMissingFonts?: ManageMissingFonts;
    globalFont?: string;
    fonts?: Input[];
    document: {
        width: number;
        height: number;
        resolution: number;
        fill: BackgroundFill;
        mode: Colorspace;
        depth: number;
    };
    layers?: Layer[];
};

/**
 * Photoshop document manifest
 * @property name - Name of the input file
 * @property width - Document width in pixels
 * @property height - Document height in pixels
 * @property photoshopBuild - Name of the application that created the PSD
 * @property imageMode - Document image mode
 * @property bitDepth - Bit depth. Allowed values: 8, 16, 32
 */
declare type DocumentManifest = {
    name: string;
    width: number;
    height: number;
    photoshopBuild: string;
    imageMode: Colorspace;
    bitDepth: number;
};

/**
 * Replace Smart Object options
 * @property layers - An array of layer objects you wish to act upon (edit, add, delete). Any layer missing an "operations" block will be ignored.
 */
declare type ReplaceSmartObjectOptions = {
    layers: SmartObjectLayer[];
};

/**
 * Output status
 */
declare const enum JobOutputStatus {
    /**
     * request has been accepted and is waiting to start
     */
    PENDING = "pending",
    /**
     * the child job is running
     */
    RUNNING = "running",
    /**
     * files have been generated and are uploading to destination
     */
    UPLOADING = "uploading",
    /**
     * the child job has succeeded
     */
    SUCCEEDED = "succeeded",
    /**
     * the child job has failed
     */
    FAILED = "failed"
}

/**
 * Reported job errors
 * @property type - A machine readable error type
 * @property code - A machine readable error code
 * @property title - A short human readable error summary
 * @property errorDetails - Further descriptions of the exact errors where errorDetail is substituted for a specific issue.
 */
declare type JobError = {
    type: string;
    code: string;
    title: string;
    errorDetails: object[];
};

/**
 * Job status and output
 * @property input - The original input file path
 * @property status - Output status
 * @property created - Created timestamp of the job
 * @property modified - Modified timestamp of the job
 * @property [document] - (manifest) Information about the PSD file
 * @property [layer] - (manifest) A tree of layer objects representing the PSD layer structure extracted from the psd document
 * @property [_links] - Output references
 * @property [_links.renditions] - (document) Created renditions
 * @property [_links.self] - (lightroom, sensei) Created output
 * @property [errors] - Any errors reported
 */
declare type JobOutput = {
    input: string;
    status: JobOutputStatus;
    created: string;
    modified: string;
    document?: DocumentManifest;
    layer?: Layer[];
    _links?: {
        renditions?: Output[];
        self?: Output;
    };
    errors?: JobError;
};

