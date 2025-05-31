import { A as AstroError, E as ExpectedImage, L as LocalImageUsedWrongly, M as MissingImageDimension, U as UnsupportedImageFormat, I as IncompatibleDescriptorOptions, g as UnsupportedImageConversion, t as toStyleString, N as NoImageMetadata, F as FailedToFetchRemoteImageDimensions, h as ExpectedImageOptions, i as ExpectedNotESMImage, j as InvalidImageService, d as createAstro, c as createComponent, k as ImageMissingAlt, m as maybeRenderHead, b as addAttribute, s as spreadAttributes, r as renderTemplate, l as ExperimentalFontsNotEnabled, n as FontFamilyNotFound, u as unescapeHTML, a as renderComponent } from './astro/server-wGLQO-FJ.js';
import 'kleur/colors';
import { $ as $$PageLayout } from './PageLayout-BEl7r1fk.js';
import { joinPaths, isRemotePath } from '@astrojs/internal-helpers/path';
import { isRemoteAllowed } from '@astrojs/internal-helpers/remote';
import * as mime from 'mrmime';
import 'clsx';
import '../renderers.mjs';

const VALID_SUPPORTED_FORMATS = [
  "jpeg",
  "jpg",
  "png",
  "tiff",
  "webp",
  "gif",
  "svg",
  "avif"
];
const DEFAULT_OUTPUT_FORMAT = "webp";
const DEFAULT_HASH_PROPS = [
  "src",
  "width",
  "height",
  "format",
  "quality",
  "fit",
  "position"
];

const DEFAULT_RESOLUTIONS = [
  640,
  // older and lower-end phones
  750,
  // iPhone 6-8
  828,
  // iPhone XR/11
  960,
  // older horizontal phones
  1080,
  // iPhone 6-8 Plus
  1280,
  // 720p
  1668,
  // Various iPads
  1920,
  // 1080p
  2048,
  // QXGA
  2560,
  // WQXGA
  3200,
  // QHD+
  3840,
  // 4K
  4480,
  // 4.5K
  5120,
  // 5K
  6016
  // 6K
];
const LIMITED_RESOLUTIONS = [
  640,
  // older and lower-end phones
  750,
  // iPhone 6-8
  828,
  // iPhone XR/11
  1080,
  // iPhone 6-8 Plus
  1280,
  // 720p
  1668,
  // Various iPads
  2048,
  // QXGA
  2560
  // WQXGA
];
const getWidths = ({
  width,
  layout,
  breakpoints = DEFAULT_RESOLUTIONS,
  originalWidth
}) => {
  const smallerThanOriginal = (w) => !originalWidth || w <= originalWidth;
  if (layout === "full-width") {
    return breakpoints.filter(smallerThanOriginal);
  }
  if (!width) {
    return [];
  }
  const doubleWidth = width * 2;
  const maxSize = originalWidth ? Math.min(doubleWidth, originalWidth) : doubleWidth;
  if (layout === "fixed") {
    return originalWidth && width > originalWidth ? [originalWidth] : [width, maxSize];
  }
  if (layout === "constrained") {
    return [
      // Always include the image at 1x and 2x the specified width
      width,
      doubleWidth,
      ...breakpoints
    ].filter((w) => w <= maxSize).sort((a, b) => a - b);
  }
  return [];
};
const getSizesAttribute = ({
  width,
  layout
}) => {
  if (!width || !layout) {
    return void 0;
  }
  switch (layout) {
    // If screen is wider than the max size then image width is the max size,
    // otherwise it's the width of the screen
    case "constrained":
      return `(min-width: ${width}px) ${width}px, 100vw`;
    // Image is always the same width, whatever the size of the screen
    case "fixed":
      return `${width}px`;
    // Image is always the width of the screen
    case "full-width":
      return `100vw`;
    case "none":
    default:
      return void 0;
  }
};

function isESMImportedImage(src) {
  return typeof src === "object" || typeof src === "function" && "src" in src;
}
function isRemoteImage(src) {
  return typeof src === "string";
}
async function resolveSrc(src) {
  if (typeof src === "object" && "then" in src) {
    const resource = await src;
    return resource.default ?? resource;
  }
  return src;
}

function isLocalService(service) {
  if (!service) {
    return false;
  }
  return "transform" in service;
}
function parseQuality(quality) {
  let result = parseInt(quality);
  if (Number.isNaN(result)) {
    return quality;
  }
  return result;
}
const sortNumeric = (a, b) => a - b;
const baseService = {
  validateOptions(options) {
    if (!options.src || !isRemoteImage(options.src) && !isESMImportedImage(options.src)) {
      throw new AstroError({
        ...ExpectedImage,
        message: ExpectedImage.message(
          JSON.stringify(options.src),
          typeof options.src,
          JSON.stringify(options, (_, v) => v === void 0 ? null : v)
        )
      });
    }
    if (!isESMImportedImage(options.src)) {
      if (options.src.startsWith("/@fs/") || !isRemotePath(options.src) && !options.src.startsWith("/")) {
        throw new AstroError({
          ...LocalImageUsedWrongly,
          message: LocalImageUsedWrongly.message(options.src)
        });
      }
      let missingDimension;
      if (!options.width && !options.height) {
        missingDimension = "both";
      } else if (!options.width && options.height) {
        missingDimension = "width";
      } else if (options.width && !options.height) {
        missingDimension = "height";
      }
      if (missingDimension) {
        throw new AstroError({
          ...MissingImageDimension,
          message: MissingImageDimension.message(missingDimension, options.src)
        });
      }
    } else {
      if (!VALID_SUPPORTED_FORMATS.includes(options.src.format)) {
        throw new AstroError({
          ...UnsupportedImageFormat,
          message: UnsupportedImageFormat.message(
            options.src.format,
            options.src.src,
            VALID_SUPPORTED_FORMATS
          )
        });
      }
      if (options.widths && options.densities) {
        throw new AstroError(IncompatibleDescriptorOptions);
      }
      if (options.src.format === "svg") {
        options.format = "svg";
      }
      if (options.src.format === "svg" && options.format !== "svg" || options.src.format !== "svg" && options.format === "svg") {
        throw new AstroError(UnsupportedImageConversion);
      }
    }
    if (!options.format) {
      options.format = DEFAULT_OUTPUT_FORMAT;
    }
    if (options.width) options.width = Math.round(options.width);
    if (options.height) options.height = Math.round(options.height);
    if (options.layout && options.width && options.height) {
      options.fit ??= "cover";
      delete options.layout;
    }
    if (options.fit === "none") {
      delete options.fit;
    }
    return options;
  },
  getHTMLAttributes(options) {
    const { targetWidth, targetHeight } = getTargetDimensions(options);
    const {
      src,
      width,
      height,
      format,
      quality,
      densities,
      widths,
      formats,
      layout,
      priority,
      fit,
      position,
      ...attributes
    } = options;
    return {
      ...attributes,
      width: targetWidth,
      height: targetHeight,
      loading: attributes.loading ?? "lazy",
      decoding: attributes.decoding ?? "async"
    };
  },
  getSrcSet(options) {
    const { targetWidth, targetHeight } = getTargetDimensions(options);
    const aspectRatio = targetWidth / targetHeight;
    const { widths, densities } = options;
    const targetFormat = options.format ?? DEFAULT_OUTPUT_FORMAT;
    let transformedWidths = (widths ?? []).sort(sortNumeric);
    let imageWidth = options.width;
    let maxWidth = Infinity;
    if (isESMImportedImage(options.src)) {
      imageWidth = options.src.width;
      maxWidth = imageWidth;
      if (transformedWidths.length > 0 && transformedWidths.at(-1) > maxWidth) {
        transformedWidths = transformedWidths.filter((width) => width <= maxWidth);
        transformedWidths.push(maxWidth);
      }
    }
    transformedWidths = Array.from(new Set(transformedWidths));
    const {
      width: transformWidth,
      height: transformHeight,
      ...transformWithoutDimensions
    } = options;
    let allWidths = [];
    if (densities) {
      const densityValues = densities.map((density) => {
        if (typeof density === "number") {
          return density;
        } else {
          return parseFloat(density);
        }
      });
      const densityWidths = densityValues.sort(sortNumeric).map((density) => Math.round(targetWidth * density));
      allWidths = densityWidths.map((width, index) => ({
        width,
        descriptor: `${densityValues[index]}x`
      }));
    } else if (transformedWidths.length > 0) {
      allWidths = transformedWidths.map((width) => ({
        width,
        descriptor: `${width}w`
      }));
    }
    return allWidths.map(({ width, descriptor }) => {
      const height = Math.round(width / aspectRatio);
      const transform = { ...transformWithoutDimensions, width, height };
      return {
        transform,
        descriptor,
        attributes: {
          type: `image/${targetFormat}`
        }
      };
    });
  },
  getURL(options, imageConfig) {
    const searchParams = new URLSearchParams();
    if (isESMImportedImage(options.src)) {
      searchParams.append("href", options.src.src);
    } else if (isRemoteAllowed(options.src, imageConfig)) {
      searchParams.append("href", options.src);
    } else {
      return options.src;
    }
    const params = {
      w: "width",
      h: "height",
      q: "quality",
      f: "format",
      fit: "fit",
      position: "position"
    };
    Object.entries(params).forEach(([param, key]) => {
      options[key] && searchParams.append(param, options[key].toString());
    });
    const imageEndpoint = joinPaths("/astro-template_v-01-test/", imageConfig.endpoint.route);
    return `${imageEndpoint}?${searchParams}`;
  },
  parseURL(url) {
    const params = url.searchParams;
    if (!params.has("href")) {
      return void 0;
    }
    const transform = {
      src: params.get("href"),
      width: params.has("w") ? parseInt(params.get("w")) : void 0,
      height: params.has("h") ? parseInt(params.get("h")) : void 0,
      format: params.get("f"),
      quality: params.get("q"),
      fit: params.get("fit"),
      position: params.get("position") ?? void 0
    };
    return transform;
  }
};
function getTargetDimensions(options) {
  let targetWidth = options.width;
  let targetHeight = options.height;
  if (isESMImportedImage(options.src)) {
    const aspectRatio = options.src.width / options.src.height;
    if (targetHeight && !targetWidth) {
      targetWidth = Math.round(targetHeight * aspectRatio);
    } else if (targetWidth && !targetHeight) {
      targetHeight = Math.round(targetWidth / aspectRatio);
    } else if (!targetWidth && !targetHeight) {
      targetWidth = options.src.width;
      targetHeight = options.src.height;
    }
  }
  return {
    targetWidth,
    targetHeight
  };
}

function isImageMetadata(src) {
  return src.fsPath && !("fsPath" in src);
}

const cssFitValues = ["fill", "contain", "cover", "scale-down"];
function addCSSVarsToStyle(vars, styles) {
  const cssVars = Object.entries(vars).filter(([_, value]) => value !== void 0 && value !== false).map(([key, value]) => `--${key}: ${value};`).join(" ");
  if (!styles) {
    return cssVars;
  }
  const style = typeof styles === "string" ? styles : toStyleString(styles);
  return `${cssVars} ${style}`;
}

const decoder = new TextDecoder();
const toUTF8String = (input, start = 0, end = input.length) => decoder.decode(input.slice(start, end));
const toHexString = (input, start = 0, end = input.length) => input.slice(start, end).reduce((memo, i) => memo + ("0" + i.toString(16)).slice(-2), "");
const readInt16LE = (input, offset = 0) => {
  const val = input[offset] + input[offset + 1] * 2 ** 8;
  return val | (val & 2 ** 15) * 131070;
};
const readUInt16BE = (input, offset = 0) => input[offset] * 2 ** 8 + input[offset + 1];
const readUInt16LE = (input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8;
const readUInt24LE = (input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8 + input[offset + 2] * 2 ** 16;
const readInt32LE = (input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8 + input[offset + 2] * 2 ** 16 + (input[offset + 3] << 24);
const readUInt32BE = (input, offset = 0) => input[offset] * 2 ** 24 + input[offset + 1] * 2 ** 16 + input[offset + 2] * 2 ** 8 + input[offset + 3];
const readUInt32LE = (input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8 + input[offset + 2] * 2 ** 16 + input[offset + 3] * 2 ** 24;
const methods = {
  readUInt16BE,
  readUInt16LE,
  readUInt32BE,
  readUInt32LE
};
function readUInt(input, bits, offset, isBigEndian) {
  offset = offset || 0;
  const endian = isBigEndian ? "BE" : "LE";
  const methodName = "readUInt" + bits + endian;
  return methods[methodName](input, offset);
}
function readBox(buffer, offset) {
  if (buffer.length - offset < 4) return;
  const boxSize = readUInt32BE(buffer, offset);
  if (buffer.length - offset < boxSize) return;
  return {
    name: toUTF8String(buffer, 4 + offset, 8 + offset),
    offset,
    size: boxSize
  };
}
function findBox(buffer, boxName, offset) {
  while (offset < buffer.length) {
    const box = readBox(buffer, offset);
    if (!box) break;
    if (box.name === boxName) return box;
    offset += box.size;
  }
}

const BMP = {
  validate: (input) => toUTF8String(input, 0, 2) === "BM",
  calculate: (input) => ({
    height: Math.abs(readInt32LE(input, 22)),
    width: readUInt32LE(input, 18)
  })
};

const TYPE_ICON = 1;
const SIZE_HEADER$1 = 2 + 2 + 2;
const SIZE_IMAGE_ENTRY = 1 + 1 + 1 + 1 + 2 + 2 + 4 + 4;
function getSizeFromOffset(input, offset) {
  const value = input[offset];
  return value === 0 ? 256 : value;
}
function getImageSize$1(input, imageIndex) {
  const offset = SIZE_HEADER$1 + imageIndex * SIZE_IMAGE_ENTRY;
  return {
    height: getSizeFromOffset(input, offset + 1),
    width: getSizeFromOffset(input, offset)
  };
}
const ICO = {
  validate(input) {
    const reserved = readUInt16LE(input, 0);
    const imageCount = readUInt16LE(input, 4);
    if (reserved !== 0 || imageCount === 0) return false;
    const imageType = readUInt16LE(input, 2);
    return imageType === TYPE_ICON;
  },
  calculate(input) {
    const nbImages = readUInt16LE(input, 4);
    const imageSize = getImageSize$1(input, 0);
    if (nbImages === 1) return imageSize;
    const imgs = [imageSize];
    for (let imageIndex = 1; imageIndex < nbImages; imageIndex += 1) {
      imgs.push(getImageSize$1(input, imageIndex));
    }
    return {
      height: imageSize.height,
      images: imgs,
      width: imageSize.width
    };
  }
};

const TYPE_CURSOR = 2;
const CUR = {
  validate(input) {
    const reserved = readUInt16LE(input, 0);
    const imageCount = readUInt16LE(input, 4);
    if (reserved !== 0 || imageCount === 0) return false;
    const imageType = readUInt16LE(input, 2);
    return imageType === TYPE_CURSOR;
  },
  calculate: (input) => ICO.calculate(input)
};

const DDS = {
  validate: (input) => readUInt32LE(input, 0) === 542327876,
  calculate: (input) => ({
    height: readUInt32LE(input, 12),
    width: readUInt32LE(input, 16)
  })
};

const gifRegexp = /^GIF8[79]a/;
const GIF = {
  validate: (input) => gifRegexp.test(toUTF8String(input, 0, 6)),
  calculate: (input) => ({
    height: readUInt16LE(input, 8),
    width: readUInt16LE(input, 6)
  })
};

const brandMap = {
  avif: "avif",
  mif1: "heif",
  msf1: "heif",
  // hief-sequence
  heic: "heic",
  heix: "heic",
  hevc: "heic",
  // heic-sequence
  hevx: "heic"
  // heic-sequence
};
function detectBrands(buffer, start, end) {
  let brandsDetected = {};
  for (let i = start; i <= end; i += 4) {
    const brand = toUTF8String(buffer, i, i + 4);
    if (brand in brandMap) {
      brandsDetected[brand] = 1;
    }
  }
  if ("avif" in brandsDetected) {
    return "avif";
  } else if ("heic" in brandsDetected || "heix" in brandsDetected || "hevc" in brandsDetected || "hevx" in brandsDetected) {
    return "heic";
  } else if ("mif1" in brandsDetected || "msf1" in brandsDetected) {
    return "heif";
  }
}
const HEIF = {
  validate(buffer) {
    const ftype = toUTF8String(buffer, 4, 8);
    const brand = toUTF8String(buffer, 8, 12);
    return "ftyp" === ftype && brand in brandMap;
  },
  calculate(buffer) {
    const metaBox = findBox(buffer, "meta", 0);
    const iprpBox = metaBox && findBox(buffer, "iprp", metaBox.offset + 12);
    const ipcoBox = iprpBox && findBox(buffer, "ipco", iprpBox.offset + 8);
    const ispeBox = ipcoBox && findBox(buffer, "ispe", ipcoBox.offset + 8);
    if (ispeBox) {
      return {
        height: readUInt32BE(buffer, ispeBox.offset + 16),
        width: readUInt32BE(buffer, ispeBox.offset + 12),
        type: detectBrands(buffer, 8, metaBox.offset)
      };
    }
    throw new TypeError("Invalid HEIF, no size found");
  }
};

const SIZE_HEADER = 4 + 4;
const FILE_LENGTH_OFFSET = 4;
const ENTRY_LENGTH_OFFSET = 4;
const ICON_TYPE_SIZE = {
  ICON: 32,
  "ICN#": 32,
  // m => 16 x 16
  "icm#": 16,
  icm4: 16,
  icm8: 16,
  // s => 16 x 16
  "ics#": 16,
  ics4: 16,
  ics8: 16,
  is32: 16,
  s8mk: 16,
  icp4: 16,
  // l => 32 x 32
  icl4: 32,
  icl8: 32,
  il32: 32,
  l8mk: 32,
  icp5: 32,
  ic11: 32,
  // h => 48 x 48
  ich4: 48,
  ich8: 48,
  ih32: 48,
  h8mk: 48,
  // . => 64 x 64
  icp6: 64,
  ic12: 32,
  // t => 128 x 128
  it32: 128,
  t8mk: 128,
  ic07: 128,
  // . => 256 x 256
  ic08: 256,
  ic13: 256,
  // . => 512 x 512
  ic09: 512,
  ic14: 512,
  // . => 1024 x 1024
  ic10: 1024
};
function readImageHeader(input, imageOffset) {
  const imageLengthOffset = imageOffset + ENTRY_LENGTH_OFFSET;
  return [
    toUTF8String(input, imageOffset, imageLengthOffset),
    readUInt32BE(input, imageLengthOffset)
  ];
}
function getImageSize(type) {
  const size = ICON_TYPE_SIZE[type];
  return { width: size, height: size, type };
}
const ICNS = {
  validate: (input) => toUTF8String(input, 0, 4) === "icns",
  calculate(input) {
    const inputLength = input.length;
    const fileLength = readUInt32BE(input, FILE_LENGTH_OFFSET);
    let imageOffset = SIZE_HEADER;
    let imageHeader = readImageHeader(input, imageOffset);
    let imageSize = getImageSize(imageHeader[0]);
    imageOffset += imageHeader[1];
    if (imageOffset === fileLength) return imageSize;
    const result = {
      height: imageSize.height,
      images: [imageSize],
      width: imageSize.width
    };
    while (imageOffset < fileLength && imageOffset < inputLength) {
      imageHeader = readImageHeader(input, imageOffset);
      imageSize = getImageSize(imageHeader[0]);
      imageOffset += imageHeader[1];
      result.images.push(imageSize);
    }
    return result;
  }
};

const J2C = {
  // TODO: this doesn't seem right. SIZ marker doesn't have to be right after the SOC
  validate: (input) => toHexString(input, 0, 4) === "ff4fff51",
  calculate: (input) => ({
    height: readUInt32BE(input, 12),
    width: readUInt32BE(input, 8)
  })
};

const JP2 = {
  validate(input) {
    if (readUInt32BE(input, 4) !== 1783636e3 || readUInt32BE(input, 0) < 1) return false;
    const ftypBox = findBox(input, "ftyp", 0);
    if (!ftypBox) return false;
    return readUInt32BE(input, ftypBox.offset + 4) === 1718909296;
  },
  calculate(input) {
    const jp2hBox = findBox(input, "jp2h", 0);
    const ihdrBox = jp2hBox && findBox(input, "ihdr", jp2hBox.offset + 8);
    if (ihdrBox) {
      return {
        height: readUInt32BE(input, ihdrBox.offset + 8),
        width: readUInt32BE(input, ihdrBox.offset + 12)
      };
    }
    throw new TypeError("Unsupported JPEG 2000 format");
  }
};

const EXIF_MARKER = "45786966";
const APP1_DATA_SIZE_BYTES = 2;
const EXIF_HEADER_BYTES = 6;
const TIFF_BYTE_ALIGN_BYTES = 2;
const BIG_ENDIAN_BYTE_ALIGN = "4d4d";
const LITTLE_ENDIAN_BYTE_ALIGN = "4949";
const IDF_ENTRY_BYTES = 12;
const NUM_DIRECTORY_ENTRIES_BYTES = 2;
function isEXIF(input) {
  return toHexString(input, 2, 6) === EXIF_MARKER;
}
function extractSize(input, index) {
  return {
    height: readUInt16BE(input, index),
    width: readUInt16BE(input, index + 2)
  };
}
function extractOrientation(exifBlock, isBigEndian) {
  const idfOffset = 8;
  const offset = EXIF_HEADER_BYTES + idfOffset;
  const idfDirectoryEntries = readUInt(exifBlock, 16, offset, isBigEndian);
  for (let directoryEntryNumber = 0; directoryEntryNumber < idfDirectoryEntries; directoryEntryNumber++) {
    const start = offset + NUM_DIRECTORY_ENTRIES_BYTES + directoryEntryNumber * IDF_ENTRY_BYTES;
    const end = start + IDF_ENTRY_BYTES;
    if (start > exifBlock.length) {
      return;
    }
    const block = exifBlock.slice(start, end);
    const tagNumber = readUInt(block, 16, 0, isBigEndian);
    if (tagNumber === 274) {
      const dataFormat = readUInt(block, 16, 2, isBigEndian);
      if (dataFormat !== 3) {
        return;
      }
      const numberOfComponents = readUInt(block, 32, 4, isBigEndian);
      if (numberOfComponents !== 1) {
        return;
      }
      return readUInt(block, 16, 8, isBigEndian);
    }
  }
}
function validateExifBlock(input, index) {
  const exifBlock = input.slice(APP1_DATA_SIZE_BYTES, index);
  const byteAlign = toHexString(
    exifBlock,
    EXIF_HEADER_BYTES,
    EXIF_HEADER_BYTES + TIFF_BYTE_ALIGN_BYTES
  );
  const isBigEndian = byteAlign === BIG_ENDIAN_BYTE_ALIGN;
  const isLittleEndian = byteAlign === LITTLE_ENDIAN_BYTE_ALIGN;
  if (isBigEndian || isLittleEndian) {
    return extractOrientation(exifBlock, isBigEndian);
  }
}
function validateInput(input, index) {
  if (index > input.length) {
    throw new TypeError("Corrupt JPG, exceeded buffer limits");
  }
}
const JPG = {
  validate: (input) => toHexString(input, 0, 2) === "ffd8",
  calculate(input) {
    input = input.slice(4);
    let orientation;
    let next;
    while (input.length) {
      const i = readUInt16BE(input, 0);
      if (input[i] !== 255) {
        input = input.slice(i);
        continue;
      }
      if (isEXIF(input)) {
        orientation = validateExifBlock(input, i);
      }
      validateInput(input, i);
      next = input[i + 1];
      if (next === 192 || next === 193 || next === 194) {
        const size = extractSize(input, i + 5);
        if (!orientation) {
          return size;
        }
        return {
          height: size.height,
          orientation,
          width: size.width
        };
      }
      input = input.slice(i + 2);
    }
    throw new TypeError("Invalid JPG, no size found");
  }
};

const KTX = {
  validate: (input) => {
    const signature = toUTF8String(input, 1, 7);
    return ["KTX 11", "KTX 20"].includes(signature);
  },
  calculate: (input) => {
    const type = input[5] === 49 ? "ktx" : "ktx2";
    const offset = type === "ktx" ? 36 : 20;
    return {
      height: readUInt32LE(input, offset + 4),
      width: readUInt32LE(input, offset),
      type
    };
  }
};

const pngSignature = "PNG\r\n\n";
const pngImageHeaderChunkName = "IHDR";
const pngFriedChunkName = "CgBI";
const PNG = {
  validate(input) {
    if (pngSignature === toUTF8String(input, 1, 8)) {
      let chunkName = toUTF8String(input, 12, 16);
      if (chunkName === pngFriedChunkName) {
        chunkName = toUTF8String(input, 28, 32);
      }
      if (chunkName !== pngImageHeaderChunkName) {
        throw new TypeError("Invalid PNG");
      }
      return true;
    }
    return false;
  },
  calculate(input) {
    if (toUTF8String(input, 12, 16) === pngFriedChunkName) {
      return {
        height: readUInt32BE(input, 36),
        width: readUInt32BE(input, 32)
      };
    }
    return {
      height: readUInt32BE(input, 20),
      width: readUInt32BE(input, 16)
    };
  }
};

const PNMTypes = {
  P1: "pbm/ascii",
  P2: "pgm/ascii",
  P3: "ppm/ascii",
  P4: "pbm",
  P5: "pgm",
  P6: "ppm",
  P7: "pam",
  PF: "pfm"
};
const handlers = {
  default: (lines) => {
    let dimensions = [];
    while (lines.length > 0) {
      const line = lines.shift();
      if (line[0] === "#") {
        continue;
      }
      dimensions = line.split(" ");
      break;
    }
    if (dimensions.length === 2) {
      return {
        height: parseInt(dimensions[1], 10),
        width: parseInt(dimensions[0], 10)
      };
    } else {
      throw new TypeError("Invalid PNM");
    }
  },
  pam: (lines) => {
    const size = {};
    while (lines.length > 0) {
      const line = lines.shift();
      if (line.length > 16 || line.charCodeAt(0) > 128) {
        continue;
      }
      const [key, value] = line.split(" ");
      if (key && value) {
        size[key.toLowerCase()] = parseInt(value, 10);
      }
      if (size.height && size.width) {
        break;
      }
    }
    if (size.height && size.width) {
      return {
        height: size.height,
        width: size.width
      };
    } else {
      throw new TypeError("Invalid PAM");
    }
  }
};
const PNM = {
  validate: (input) => toUTF8String(input, 0, 2) in PNMTypes,
  calculate(input) {
    const signature = toUTF8String(input, 0, 2);
    const type = PNMTypes[signature];
    const lines = toUTF8String(input, 3).split(/[\r\n]+/);
    const handler = handlers[type] || handlers.default;
    return handler(lines);
  }
};

const PSD = {
  validate: (input) => toUTF8String(input, 0, 4) === "8BPS",
  calculate: (input) => ({
    height: readUInt32BE(input, 14),
    width: readUInt32BE(input, 18)
  })
};

const svgReg = /<svg\s([^>"']|"[^"]*"|'[^']*')*>/;
const extractorRegExps = {
  height: /\sheight=(['"])([^%]+?)\1/,
  root: svgReg,
  viewbox: /\sviewBox=(['"])(.+?)\1/i,
  width: /\swidth=(['"])([^%]+?)\1/
};
const INCH_CM = 2.54;
const units = {
  in: 96,
  cm: 96 / INCH_CM,
  em: 16,
  ex: 8,
  m: 96 / INCH_CM * 100,
  mm: 96 / INCH_CM / 10,
  pc: 96 / 72 / 12,
  pt: 96 / 72,
  px: 1
};
const unitsReg = new RegExp(
  `^([0-9.]+(?:e\\d+)?)(${Object.keys(units).join("|")})?$`
);
function parseLength(len) {
  const m = unitsReg.exec(len);
  if (!m) {
    return void 0;
  }
  return Math.round(Number(m[1]) * (units[m[2]] || 1));
}
function parseViewbox(viewbox) {
  const bounds = viewbox.split(" ");
  return {
    height: parseLength(bounds[3]),
    width: parseLength(bounds[2])
  };
}
function parseAttributes(root) {
  const width = extractorRegExps.width.exec(root);
  const height = extractorRegExps.height.exec(root);
  const viewbox = extractorRegExps.viewbox.exec(root);
  return {
    height: height && parseLength(height[2]),
    viewbox: viewbox && parseViewbox(viewbox[2]),
    width: width && parseLength(width[2])
  };
}
function calculateByDimensions(attrs) {
  return {
    height: attrs.height,
    width: attrs.width
  };
}
function calculateByViewbox(attrs, viewbox) {
  const ratio = viewbox.width / viewbox.height;
  if (attrs.width) {
    return {
      height: Math.floor(attrs.width / ratio),
      width: attrs.width
    };
  }
  if (attrs.height) {
    return {
      height: attrs.height,
      width: Math.floor(attrs.height * ratio)
    };
  }
  return {
    height: viewbox.height,
    width: viewbox.width
  };
}
const SVG = {
  // Scan only the first kilo-byte to speed up the check on larger files
  validate: (input) => svgReg.test(toUTF8String(input, 0, 1e3)),
  calculate(input) {
    const root = extractorRegExps.root.exec(toUTF8String(input));
    if (root) {
      const attrs = parseAttributes(root[0]);
      if (attrs.width && attrs.height) {
        return calculateByDimensions(attrs);
      }
      if (attrs.viewbox) {
        return calculateByViewbox(attrs, attrs.viewbox);
      }
    }
    throw new TypeError("Invalid SVG");
  }
};

const TGA = {
  validate(input) {
    return readUInt16LE(input, 0) === 0 && readUInt16LE(input, 4) === 0;
  },
  calculate(input) {
    return {
      height: readUInt16LE(input, 14),
      width: readUInt16LE(input, 12)
    };
  }
};

function readIFD(input, isBigEndian) {
  const ifdOffset = readUInt(input, 32, 4, isBigEndian);
  return input.slice(ifdOffset + 2);
}
function readValue(input, isBigEndian) {
  const low = readUInt(input, 16, 8, isBigEndian);
  const high = readUInt(input, 16, 10, isBigEndian);
  return (high << 16) + low;
}
function nextTag(input) {
  if (input.length > 24) {
    return input.slice(12);
  }
}
function extractTags(input, isBigEndian) {
  const tags = {};
  let temp = input;
  while (temp && temp.length) {
    const code = readUInt(temp, 16, 0, isBigEndian);
    const type = readUInt(temp, 16, 2, isBigEndian);
    const length = readUInt(temp, 32, 4, isBigEndian);
    if (code === 0) {
      break;
    } else {
      if (length === 1 && (type === 3 || type === 4)) {
        tags[code] = readValue(temp, isBigEndian);
      }
      temp = nextTag(temp);
    }
  }
  return tags;
}
function determineEndianness(input) {
  const signature = toUTF8String(input, 0, 2);
  if ("II" === signature) {
    return "LE";
  } else if ("MM" === signature) {
    return "BE";
  }
}
const signatures = [
  // '492049', // currently not supported
  "49492a00",
  // Little endian
  "4d4d002a"
  // Big Endian
  // '4d4d002a', // BigTIFF > 4GB. currently not supported
];
const TIFF = {
  validate: (input) => signatures.includes(toHexString(input, 0, 4)),
  calculate(input) {
    const isBigEndian = determineEndianness(input) === "BE";
    const ifdBuffer = readIFD(input, isBigEndian);
    const tags = extractTags(ifdBuffer, isBigEndian);
    const width = tags[256];
    const height = tags[257];
    if (!width || !height) {
      throw new TypeError("Invalid Tiff. Missing tags");
    }
    return { height, width };
  }
};

function calculateExtended(input) {
  return {
    height: 1 + readUInt24LE(input, 7),
    width: 1 + readUInt24LE(input, 4)
  };
}
function calculateLossless(input) {
  return {
    height: 1 + ((input[4] & 15) << 10 | input[3] << 2 | (input[2] & 192) >> 6),
    width: 1 + ((input[2] & 63) << 8 | input[1])
  };
}
function calculateLossy(input) {
  return {
    height: readInt16LE(input, 8) & 16383,
    width: readInt16LE(input, 6) & 16383
  };
}
const WEBP = {
  validate(input) {
    const riffHeader = "RIFF" === toUTF8String(input, 0, 4);
    const webpHeader = "WEBP" === toUTF8String(input, 8, 12);
    const vp8Header = "VP8" === toUTF8String(input, 12, 15);
    return riffHeader && webpHeader && vp8Header;
  },
  calculate(input) {
    const chunkHeader = toUTF8String(input, 12, 16);
    input = input.slice(20, 30);
    if (chunkHeader === "VP8X") {
      const extendedHeader = input[0];
      const validStart = (extendedHeader & 192) === 0;
      const validEnd = (extendedHeader & 1) === 0;
      if (validStart && validEnd) {
        return calculateExtended(input);
      } else {
        throw new TypeError("Invalid WebP");
      }
    }
    if (chunkHeader === "VP8 " && input[0] !== 47) {
      return calculateLossy(input);
    }
    const signature = toHexString(input, 3, 6);
    if (chunkHeader === "VP8L" && signature !== "9d012a") {
      return calculateLossless(input);
    }
    throw new TypeError("Invalid WebP");
  }
};

const typeHandlers = /* @__PURE__ */ new Map([
  ["bmp", BMP],
  ["cur", CUR],
  ["dds", DDS],
  ["gif", GIF],
  ["heif", HEIF],
  ["icns", ICNS],
  ["ico", ICO],
  ["j2c", J2C],
  ["jp2", JP2],
  ["jpg", JPG],
  ["ktx", KTX],
  ["png", PNG],
  ["pnm", PNM],
  ["psd", PSD],
  ["svg", SVG],
  ["tga", TGA],
  ["tiff", TIFF],
  ["webp", WEBP]
]);
const types = Array.from(typeHandlers.keys());

const firstBytes = /* @__PURE__ */ new Map([
  [56, "psd"],
  [66, "bmp"],
  [68, "dds"],
  [71, "gif"],
  [73, "tiff"],
  [77, "tiff"],
  [82, "webp"],
  [105, "icns"],
  [137, "png"],
  [255, "jpg"]
]);
function detector(input) {
  const byte = input[0];
  const type = firstBytes.get(byte);
  if (type && typeHandlers.get(type).validate(input)) {
    return type;
  }
  return types.find((fileType) => typeHandlers.get(fileType).validate(input));
}

function lookup(input) {
  const type = detector(input);
  if (typeof type !== "undefined") {
    const size = typeHandlers.get(type).calculate(input);
    if (size !== void 0) {
      size.type = size.type ?? type;
      return size;
    }
  }
  throw new TypeError("unsupported file type: " + type);
}

async function imageMetadata(data, src) {
  let result;
  try {
    result = lookup(data);
  } catch {
    throw new AstroError({
      ...NoImageMetadata,
      message: NoImageMetadata.message(src)
    });
  }
  if (!result.height || !result.width || !result.type) {
    throw new AstroError({
      ...NoImageMetadata,
      message: NoImageMetadata.message(src)
    });
  }
  const { width, height, type, orientation } = result;
  const isPortrait = (orientation || 0) >= 5;
  return {
    width: isPortrait ? height : width,
    height: isPortrait ? width : height,
    format: type,
    orientation
  };
}

async function inferRemoteSize(url) {
  const response = await fetch(url);
  if (!response.body || !response.ok) {
    throw new AstroError({
      ...FailedToFetchRemoteImageDimensions,
      message: FailedToFetchRemoteImageDimensions.message(url)
    });
  }
  const reader = response.body.getReader();
  let done, value;
  let accumulatedChunks = new Uint8Array();
  while (!done) {
    const readResult = await reader.read();
    done = readResult.done;
    if (done) break;
    if (readResult.value) {
      value = readResult.value;
      let tmp = new Uint8Array(accumulatedChunks.length + value.length);
      tmp.set(accumulatedChunks, 0);
      tmp.set(value, accumulatedChunks.length);
      accumulatedChunks = tmp;
      try {
        const dimensions = await imageMetadata(accumulatedChunks, url);
        if (dimensions) {
          await reader.cancel();
          return dimensions;
        }
      } catch {
      }
    }
  }
  throw new AstroError({
    ...NoImageMetadata,
    message: NoImageMetadata.message(url)
  });
}

async function getConfiguredImageService() {
  if (!globalThis?.astroAsset?.imageService) {
    const { default: service } = await import(
      // @ts-expect-error
      './sharp-DVMELVoA.js'
    ).catch((e) => {
      const error = new AstroError(InvalidImageService);
      error.cause = e;
      throw error;
    });
    if (!globalThis.astroAsset) globalThis.astroAsset = {};
    globalThis.astroAsset.imageService = service;
    return service;
  }
  return globalThis.astroAsset.imageService;
}
async function getImage$1(options, imageConfig) {
  if (!options || typeof options !== "object") {
    throw new AstroError({
      ...ExpectedImageOptions,
      message: ExpectedImageOptions.message(JSON.stringify(options))
    });
  }
  if (typeof options.src === "undefined") {
    throw new AstroError({
      ...ExpectedImage,
      message: ExpectedImage.message(
        options.src,
        "undefined",
        JSON.stringify(options)
      )
    });
  }
  if (isImageMetadata(options)) {
    throw new AstroError(ExpectedNotESMImage);
  }
  const service = await getConfiguredImageService();
  const resolvedOptions = {
    ...options,
    src: await resolveSrc(options.src)
  };
  let originalWidth;
  let originalHeight;
  let originalFormat;
  if (options.inferSize && isRemoteImage(resolvedOptions.src) && isRemotePath(resolvedOptions.src)) {
    const result = await inferRemoteSize(resolvedOptions.src);
    resolvedOptions.width ??= result.width;
    resolvedOptions.height ??= result.height;
    originalWidth = result.width;
    originalHeight = result.height;
    originalFormat = result.format;
    delete resolvedOptions.inferSize;
  }
  const originalFilePath = isESMImportedImage(resolvedOptions.src) ? resolvedOptions.src.fsPath : void 0;
  const clonedSrc = isESMImportedImage(resolvedOptions.src) ? (
    // @ts-expect-error - clone is a private, hidden prop
    resolvedOptions.src.clone ?? resolvedOptions.src
  ) : resolvedOptions.src;
  if (isESMImportedImage(clonedSrc)) {
    originalWidth = clonedSrc.width;
    originalHeight = clonedSrc.height;
    originalFormat = clonedSrc.format;
  }
  if (originalWidth && originalHeight) {
    const aspectRatio = originalWidth / originalHeight;
    if (resolvedOptions.height && !resolvedOptions.width) {
      resolvedOptions.width = Math.round(resolvedOptions.height * aspectRatio);
    } else if (resolvedOptions.width && !resolvedOptions.height) {
      resolvedOptions.height = Math.round(resolvedOptions.width / aspectRatio);
    } else if (!resolvedOptions.width && !resolvedOptions.height) {
      resolvedOptions.width = originalWidth;
      resolvedOptions.height = originalHeight;
    }
  }
  resolvedOptions.src = clonedSrc;
  const layout = options.layout ?? imageConfig.experimentalLayout;
  if (imageConfig.experimentalResponsiveImages && layout) {
    resolvedOptions.widths ||= getWidths({
      width: resolvedOptions.width,
      layout,
      originalWidth,
      breakpoints: imageConfig.experimentalBreakpoints?.length ? imageConfig.experimentalBreakpoints : isLocalService(service) ? LIMITED_RESOLUTIONS : DEFAULT_RESOLUTIONS
    });
    resolvedOptions.sizes ||= getSizesAttribute({ width: resolvedOptions.width, layout });
    if (resolvedOptions.priority) {
      resolvedOptions.loading ??= "eager";
      resolvedOptions.decoding ??= "sync";
      resolvedOptions.fetchpriority ??= "high";
    } else {
      resolvedOptions.loading ??= "lazy";
      resolvedOptions.decoding ??= "async";
      resolvedOptions.fetchpriority ??= "auto";
    }
    delete resolvedOptions.priority;
    delete resolvedOptions.densities;
    if (layout !== "none") {
      resolvedOptions.style = addCSSVarsToStyle(
        {
          fit: cssFitValues.includes(resolvedOptions.fit ?? "") && resolvedOptions.fit,
          pos: resolvedOptions.position
        },
        resolvedOptions.style
      );
      resolvedOptions["data-astro-image"] = layout;
    }
  }
  const validatedOptions = service.validateOptions ? await service.validateOptions(resolvedOptions, imageConfig) : resolvedOptions;
  const srcSetTransforms = service.getSrcSet ? await service.getSrcSet(validatedOptions, imageConfig) : [];
  let imageURL = await service.getURL(validatedOptions, imageConfig);
  const matchesOriginal = (transform) => transform.width === originalWidth && transform.height === originalHeight && transform.format === originalFormat;
  let srcSets = await Promise.all(
    srcSetTransforms.map(async (srcSet) => {
      return {
        transform: srcSet.transform,
        url: matchesOriginal(srcSet.transform) ? imageURL : await service.getURL(srcSet.transform, imageConfig),
        descriptor: srcSet.descriptor,
        attributes: srcSet.attributes
      };
    })
  );
  if (isLocalService(service) && globalThis.astroAsset.addStaticImage && !(isRemoteImage(validatedOptions.src) && imageURL === validatedOptions.src)) {
    const propsToHash = service.propertiesToHash ?? DEFAULT_HASH_PROPS;
    imageURL = globalThis.astroAsset.addStaticImage(
      validatedOptions,
      propsToHash,
      originalFilePath
    );
    srcSets = srcSetTransforms.map((srcSet) => {
      return {
        transform: srcSet.transform,
        url: matchesOriginal(srcSet.transform) ? imageURL : globalThis.astroAsset.addStaticImage(srcSet.transform, propsToHash, originalFilePath),
        descriptor: srcSet.descriptor,
        attributes: srcSet.attributes
      };
    });
  }
  return {
    rawOptions: resolvedOptions,
    options: validatedOptions,
    src: imageURL,
    srcSet: {
      values: srcSets,
      attribute: srcSets.map((srcSet) => `${srcSet.url} ${srcSet.descriptor}`).join(", ")
    },
    attributes: service.getHTMLAttributes !== void 0 ? await service.getHTMLAttributes(validatedOptions, imageConfig) : {}
  };
}

const $$Astro$5 = createAstro("https://web22des.github.io");
const $$Image = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Image;
  const props = Astro2.props;
  if (props.alt === void 0 || props.alt === null) {
    throw new AstroError(ImageMissingAlt);
  }
  if (typeof props.width === "string") {
    props.width = parseInt(props.width);
  }
  if (typeof props.height === "string") {
    props.height = parseInt(props.height);
  }
  const layout = props.layout ?? imageConfig.experimentalLayout ?? "none";
  const useResponsive = imageConfig.experimentalResponsiveImages && layout !== "none";
  if (useResponsive) {
    props.layout ??= imageConfig.experimentalLayout;
    props.fit ??= imageConfig.experimentalObjectFit ?? "cover";
    props.position ??= imageConfig.experimentalObjectPosition ?? "center";
  }
  const image = await getImage(props);
  const additionalAttributes = {};
  if (image.srcSet.values.length > 0) {
    additionalAttributes.srcset = image.srcSet.attribute;
  }
  const { class: className, ...attributes } = { ...additionalAttributes, ...image.attributes };
  return renderTemplate`${maybeRenderHead()}<img${addAttribute(image.src, "src")}${spreadAttributes(attributes)}${addAttribute(className, "class")}>`;
}, "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/node_modules/astro/components/Image.astro", void 0);

const $$Astro$4 = createAstro("https://web22des.github.io");
const $$Picture = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Picture;
  const defaultFormats = ["webp"];
  const defaultFallbackFormat = "png";
  const specialFormatsFallback = ["gif", "svg", "jpg", "jpeg"];
  const { formats = defaultFormats, pictureAttributes = {}, fallbackFormat, ...props } = Astro2.props;
  if (props.alt === void 0 || props.alt === null) {
    throw new AstroError(ImageMissingAlt);
  }
  const scopedStyleClass = props.class?.match(/\bastro-\w{8}\b/)?.[0];
  if (scopedStyleClass) {
    if (pictureAttributes.class) {
      pictureAttributes.class = `${pictureAttributes.class} ${scopedStyleClass}`;
    } else {
      pictureAttributes.class = scopedStyleClass;
    }
  }
  const layout = props.layout ?? imageConfig.experimentalLayout ?? "none";
  const useResponsive = imageConfig.experimentalResponsiveImages && layout !== "none";
  if (useResponsive) {
    props.layout ??= imageConfig.experimentalLayout;
    props.fit ??= imageConfig.experimentalObjectFit ?? "cover";
    props.position ??= imageConfig.experimentalObjectPosition ?? "center";
  }
  for (const key in props) {
    if (key.startsWith("data-astro-cid")) {
      pictureAttributes[key] = props[key];
    }
  }
  const originalSrc = await resolveSrc(props.src);
  const optimizedImages = await Promise.all(
    formats.map(
      async (format) => await getImage({
        ...props,
        src: originalSrc,
        format,
        widths: props.widths,
        densities: props.densities
      })
    )
  );
  let resultFallbackFormat = fallbackFormat ?? defaultFallbackFormat;
  if (!fallbackFormat && isESMImportedImage(originalSrc) && specialFormatsFallback.includes(originalSrc.format)) {
    resultFallbackFormat = originalSrc.format;
  }
  const fallbackImage = await getImage({
    ...props,
    format: resultFallbackFormat,
    widths: props.widths,
    densities: props.densities
  });
  const imgAdditionalAttributes = {};
  const sourceAdditionalAttributes = {};
  if (props.sizes) {
    sourceAdditionalAttributes.sizes = props.sizes;
  }
  if (fallbackImage.srcSet.values.length > 0) {
    imgAdditionalAttributes.srcset = fallbackImage.srcSet.attribute;
  }
  const { class: className, ...attributes } = {
    ...imgAdditionalAttributes,
    ...fallbackImage.attributes
  };
  return renderTemplate`${maybeRenderHead()}<picture${spreadAttributes(pictureAttributes)}> ${Object.entries(optimizedImages).map(([_, image]) => {
    const srcsetAttribute = props.densities || !props.densities && !props.widths && !useResponsive ? `${image.src}${image.srcSet.values.length > 0 ? ", " + image.srcSet.attribute : ""}` : image.srcSet.attribute;
    return renderTemplate`<source${addAttribute(srcsetAttribute, "srcset")}${addAttribute(mime.lookup(image.options.format ?? image.src) ?? `image/${image.options.format}`, "type")}${spreadAttributes(sourceAdditionalAttributes)}>`;
  })}  <img${addAttribute(fallbackImage.src, "src")}${spreadAttributes(attributes)}${addAttribute(className, "class")}> </picture>`;
}, "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/node_modules/astro/components/Picture.astro", void 0);

const mod = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$3 = createAstro("https://web22des.github.io");
const $$Font = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Font;
  const { fontsData } = mod;
  if (!fontsData) {
    throw new AstroError(ExperimentalFontsNotEnabled);
  }
  const { cssVariable, preload = false } = Astro2.props;
  const data = fontsData.get(cssVariable);
  if (!data) {
    throw new AstroError({
      ...FontFamilyNotFound,
      message: FontFamilyNotFound.message(cssVariable)
    });
  }
  return renderTemplate`${preload && data.preloadData.map(({ url, type }) => renderTemplate`<link rel="preload"${addAttribute(url, "href")} as="font"${addAttribute(`font/${type}`, "type")} crossorigin>`)}<style>${unescapeHTML(data.css)}</style>`;
}, "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/node_modules/astro/components/Font.astro", void 0);

const imageConfig = {"endpoint":{"route":"/_image/"},"service":{"entrypoint":"astro/assets/services/sharp","config":{}},"domains":[],"remotePatterns":[],"experimentalResponsiveImages":false};
							const getImage = async (options) => await getImage$1(options, imageConfig);

const HeroImg = new Proxy({"src":"/astro-template_v-01-test/assets/hero-01-DuCT-vgs.png","width":698,"height":396,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/assets/images/content/hero-01.png";
							}
							if (target[name] !== undefined && globalThis.astroAsset) globalThis.astroAsset?.referencedImages.add("/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/assets/images/content/hero-01.png");
							return target[name];
						}
					});

const $$Hero = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="hero"> <div class="hero__container"> <div class="hero__header"> <h1 class="hero__title">Сайты в ваш бизнес</h1> <h2 class="hero__subtitle"><span class="hero__subtitle--mobile">Уникальные <span class="accent">продающие сайты</span></span> без использования конструкторов</h2> </div> <div class="hero__body"> <div class="hero__info"> <h3 class="hero__info-title">Гибкие цены, акции и пакетные предложения</h3> <ul class="hero__info-list"> <li class="hero__info-item"> <span class="_icon-checkbox-checked"></span>Современный</li> <li class="hero__info-item"> <span class="_icon-checkbox-checked"></span>Адаптивный</li> <li class="hero__info-item"> <span class="_icon-checkbox-checked"></span>Кроссбраузерный</li> <li class="hero__info-item"> <span class="_icon-checkbox-checked"></span>Масштабируемый</li> <li class="hero__info-item"> <span class="_icon-checkbox-checked"></span>Индивидуальный</li> </ul> <div class="hero__info-wrap-btn"> <button type="submit" class="button">Узнать стоимость</button> <span class="hero__info-text">Предварительный расчёт за 15 минут</span> </div> </div> <div class="hero__wrap-img"> ${renderComponent($$result, "Image", $$Image, { "class": "hero__img", "src": HeroImg, "alt": "\u0433\u043B\u0430\u0432\u043D\u043E\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B" })} </div> </div> </div> </div>`;
}, "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/components/sections/Hero.astro", void 0);

const $$Astro$2 = createAstro("https://web22des.github.io");
const $$TitleSections = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$TitleSections;
  const { titleSection, subTitleSection } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="title-sections__wrap"> <h2 class="title-sections__title">${titleSection}</h2> <h3 class="title-sections__subtitle">${subTitleSection}</h3> </div>`;
}, "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/components/ui/TitleSections.astro", void 0);

const $$Astro$1 = createAstro("https://web22des.github.io");
const $$Card = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Card;
  const { cardTitle, cardIcon, cardContent } = Astro2.props;
  return renderTemplate`<!-- <div class="advantages-card">
    <div class="advantages-card__header">
        <h3 class="advantages-card__title">{cardTitle}</h3>
        <span class={cardIcon}></span>
    </div>
    <p class="advantages-card__content">{cardContent}</p>
</div> -->${maybeRenderHead()}<div class="advantages-card"> <h3 class="advantages-card__title">${cardTitle}<span${addAttribute(cardIcon, "class")}></span></h3> <p class="advantages-card__content">${cardContent}</p> </div>`;
}, "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/components/ui/Card.astro", void 0);

const $$Advantages = createComponent(($$result, $$props, $$slots) => {
  const titleSection = "\u041D\u0410\u0422\u0418\u0412\u041D\u042B\u0419 HTML+CSS3+JS";
  const subTitleSection = "\u041F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u0430 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u044F \u043D\u0430\u0442\u0438\u0432\u043D\u043E\u0433\u043E HTML+CSS3+JS \u043F\u0435\u0440\u0435\u0434 \u043A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u043E\u0440\u0430\u043C\u0438 \u0441\u0430\u0439\u0442\u043E\u0432 \u0432\u043A\u043B\u044E\u0447\u0430\u044E\u0442";
  const cardsData = [
    {
      cardTitle: "\u0413\u0438\u0431\u043A\u043E\u0441\u0442\u044C \u0438 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044C",
      cardIcon: "_icon-equalizer2",
      // Название иконки из IcoMoon
      cardContent: "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u044F \u043D\u0430\u0442\u0438\u0432\u043D\u044B\u0435 \u044F\u0437\u044B\u043A\u0438 HTML, CSS3 \u0438 JS, \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A\u0438 \u0438\u043C\u0435\u044E\u0442 \u043F\u043E\u043B\u043D\u044B\u0439 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044C \u043D\u0430\u0434 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u0435\u043C \u0438 \u0432\u0438\u0437\u0443\u0430\u043B\u044C\u043D\u044B\u043C \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0435\u043C \u0441\u0430\u0439\u0442\u0430. \u041E\u043D\u0438 \u043C\u043E\u0433\u0443\u0442 \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u043E \u043C\u0430\u043D\u0438\u043F\u0443\u043B\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430\u043C\u0438, \u0441\u0442\u0438\u043B\u044F\u043C\u0438 \u0438 \u043F\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u0435\u043C \u0441\u0430\u0439\u0442\u0430, \u0447\u0442\u043E\u0431\u044B \u0442\u043E\u0447\u043D\u043E \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C \u0442\u0440\u0435\u0431\u043E\u0432\u0430\u043D\u0438\u044F\u043C \u043F\u0440\u043E\u0435\u043A\u0442\u0430."
    },
    {
      cardTitle: "\u041F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C",
      cardIcon: "_icon-stats-dots",
      cardContent: "\u041D\u0430\u0442\u0438\u0432\u043D\u044B\u0439 \u043A\u043E\u0434 \u043E\u0431\u044B\u0447\u043D\u043E \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u0431\u044B\u0441\u0442\u0440\u0435\u0435, \u0447\u0435\u043C \u043A\u043E\u0434, \u0441\u043E\u0437\u0434\u0430\u043D\u043D\u044B\u0439 \u0441 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u0435\u043C \u043A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u043E\u0440\u043E\u0432 \u0441\u0430\u0439\u0442\u043E\u0432. \u042D\u0442\u043E \u0441\u0432\u044F\u0437\u0430\u043D\u043E \u0441 \u0442\u0435\u043C, \u0447\u0442\u043E \u043D\u0430\u0442\u0438\u0432\u043D\u044B\u0439 \u043A\u043E\u0434 \u043E\u043F\u0442\u0438\u043C\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D \u0434\u043B\u044F \u0440\u0430\u0431\u043E\u0442\u044B \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435 \u0438 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0431\u043E\u043B\u0435\u0435 \u044D\u0444\u0444\u0435\u043A\u0442\u0438\u0432\u043D\u044B\u043C \u0432 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u0438 \u0440\u0435\u0441\u0443\u0440\u0441\u043E\u0432."
    },
    {
      cardTitle: "\u0418\u0437\u043C\u0435\u043D\u044F\u0435\u043C\u043E\u0441\u0442\u044C \u0438 \u043D\u0430\u0441\u0442\u0440\u0430\u0438\u0432\u0430\u0438\u043C\u043E\u0441\u0442\u044C",
      cardIcon: "_icon-shuffle",
      cardContent: "\u041D\u0430\u0442\u0438\u0432\u043D\u044B\u0439 \u043A\u043E\u0434 \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A\u0430\u043C \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u0440\u0430\u0437\u043B\u0438\u0447\u043D\u044B\u0435 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0438, \u0444\u0440\u0435\u0439\u043C\u0432\u043E\u0440\u043A\u0438 \u0438 \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u044B \u043F\u043E \u0441\u0432\u043E\u0435\u043C\u0443 \u0432\u044B\u0431\u043E\u0440\u0443. \u042D\u0442\u043E \u0434\u0430\u0435\u0442 \u0431\u043E\u043B\u044C\u0448\u0443\u044E \u0441\u0432\u043E\u0431\u043E\u0434\u0443 \u0432 \u0432\u044B\u0431\u043E\u0440\u0435 \u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0435 \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u043E\u0432, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u043B\u0443\u0447\u0448\u0435 \u0432\u0441\u0435\u0433\u043E \u043F\u043E\u0434\u0445\u043E\u0434\u044F\u0442 \u0434\u043B\u044F \u043A\u043E\u043D\u043A\u0440\u0435\u0442\u043D\u043E\u0433\u043E \u043F\u0440\u043E\u0435\u043A\u0442\u0430."
    },
    {
      cardTitle: "Seo-\u043E\u043F\u0442\u0438\u043C\u0438\u0437\u0430\u0446\u0438\u044F",
      cardIcon: "_icon-magic-wand",
      cardContent: "\u041D\u0430\u0442\u0438\u0432\u043D\u044B\u0439 \u043A\u043E\u0434 \u043E\u0431\u0435\u0441\u043F\u0435\u0447\u0438\u0432\u0430\u0435\u0442 \u043B\u0443\u0447\u0448\u0443\u044E SEO-\u043E\u043F\u0442\u0438\u043C\u0438\u0437\u0430\u0446\u0438\u044E, \u0442\u0430\u043A \u043A\u0430\u043A \u043F\u043E\u0438\u0441\u043A\u043E\u0432\u044B\u0435 \u0441\u0438\u0441\u0442\u0435\u043C\u044B \u043B\u0443\u0447\u0448\u0435 \u043F\u043E\u043D\u0438\u043C\u0430\u044E\u0442 \u0438 \u0438\u043D\u0434\u0435\u043A\u0441\u0438\u0440\u0443\u044E\u0442 \u043A\u043E\u043D\u0442\u0435\u043D\u0442, \u0441\u043E\u0437\u0434\u0430\u043D\u043D\u044B\u0439 \u0441 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u0435\u043C \u043D\u0430\u0442\u0438\u0432\u043D\u044B\u0445 \u044F\u0437\u044B\u043A\u043E\u0432. \u042D\u0442\u043E \u043C\u043E\u0436\u0435\u0442 \u043F\u043E\u043C\u043E\u0447\u044C \u0443\u043B\u0443\u0447\u0448\u0438\u0442\u044C \u0432\u0438\u0434\u0438\u043C\u043E\u0441\u0442\u044C \u0441\u0430\u0439\u0442\u0430 \u0432 \u043F\u043E\u0438\u0441\u043A\u043E\u0432\u044B\u0445 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0430\u0445."
    },
    {
      cardTitle: "\u0411\u043E\u043B\u0435\u0435 \u0433\u0438\u0431\u043A\u0438\u0439 \u0438 \u043C\u0430\u0441\u0448\u0442\u0430\u0431\u0438\u0440\u0443\u0435\u043C\u044B\u0439 \u043A\u043E\u0434",
      cardIcon: "_icon-tree",
      cardContent: "\u041D\u0430\u0442\u0438\u0432\u043D\u044B\u0439 \u043A\u043E\u0434 \u043F\u043E\u0437\u0432\u043E\u043B\u044F\u0435\u0442 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A\u0430\u043C \u0441\u043E\u0437\u0434\u0430\u0432\u0430\u0442\u044C \u0431\u043E\u043B\u0435\u0435 \u0433\u0438\u0431\u043A\u0438\u0439 \u0438 \u043C\u0430\u0441\u0448\u0442\u0430\u0431\u0438\u0440\u0443\u0435\u043C\u044B\u0439 \u043A\u043E\u0434. \u041E\u043D\u0438 \u043C\u043E\u0433\u0443\u0442 \u043B\u0435\u0433\u043A\u043E \u0434\u043E\u0431\u0430\u0432\u043B\u044F\u0442\u044C \u043D\u043E\u0432\u044B\u0435 \u0444\u0443\u043D\u043A\u0446\u0438\u0438, \u0438\u0437\u043C\u0435\u043D\u044F\u0442\u044C \u043F\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u0435 \u0438 \u0430\u0434\u0430\u043F\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u0430\u0439\u0442 \u043F\u043E\u0434 \u0440\u0430\u0437\u043B\u0438\u0447\u043D\u044B\u0435 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430 \u0438 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u044B."
    },
    {
      cardTitle: "\u0412 \u0437\u0430\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0438",
      cardIcon: "_icon-flag",
      cardContent: "\u0425\u043E\u0442\u044F \u043A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u043E\u0440\u044B \u0441\u0430\u0439\u0442\u043E\u0432 \u043C\u043E\u0433\u0443\u0442 \u0431\u044B\u0442\u044C \u043F\u043E\u043B\u0435\u0437\u043D\u044B\u043C\u0438 \u0434\u043B\u044F \u0431\u044B\u0441\u0442\u0440\u043E\u0433\u043E \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F \u043F\u0440\u043E\u0441\u0442\u044B\u0445 \u0441\u0430\u0439\u0442\u043E\u0432 \u0431\u0435\u0437 \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E\u0441\u0442\u0438 \u0432 \u0433\u043B\u0443\u0431\u043E\u043A\u0438\u0445 \u0437\u043D\u0430\u043D\u0438\u044F\u0445 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F, \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u0435 \u043D\u0430\u0442\u0438\u0432\u043D\u043E\u0433\u043E HTML+CSS3+JS \u043F\u0440\u0435\u0434\u043E\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u0442 \u0431\u043E\u043B\u044C\u0448\u0435 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0435\u0439 \u0434\u043B\u044F \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F \u0443\u043D\u0438\u043A\u0430\u043B\u044C\u043D\u044B\u0445, \u0433\u0438\u0431\u043A\u0438\u0445 \u0438 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0445 \u0432\u0435\u0431-\u0441\u0430\u0439\u0442\u043E\u0432."
    }
  ];
  return renderTemplate`${maybeRenderHead()}<div class="advantages"> <div class="advantages"> <div class="advantages__container"> ${renderComponent($$result, "TitleSections", $$TitleSections, { "titleSection": titleSection, "subTitleSection": subTitleSection })} <div class="advantages__card-wrap"> ${cardsData.map((card, index) => renderTemplate`${renderComponent($$result, "Card", $$Card, { "key": `advantage-${index}`, "cardTitle": card.cardTitle, "cardIcon": card.cardIcon, "cardContent": card.cardContent })}`)} </div> </div> </div> </div>`;
}, "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/components/sections/Advantages.astro", void 0);

const $$WebsiteTypes = createComponent(($$result, $$props, $$slots) => {
  const titleSection = "\u0412\u0438\u0434\u044B \u0441\u0430\u0439\u0442\u043E\u0432";
  const subTitleSection = "\u041F\u043E\u0434\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u043B\u044F \u0441\u0435\u0431\u044F \u0438\u043C\u0435\u043D\u043D\u043E \u0442\u043E\u0442 \u0432\u0430\u0440\u0438\u0430\u043D\u0442 \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u0431\u043E\u043B\u044C\u0448\u0435 \u043F\u043E\u0434\u0445\u043E\u0434\u0438\u0442 \u043F\u043E\u0434 \u043F\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u043D\u0443\u044E \u0437\u0430\u0434\u0430\u0447\u0443. \u0415\u0441\u043B\u0438 \u0437\u0430\u0442\u0440\u0443\u0434\u043D\u044F\u0435\u0442\u0435\u0441\u044C \u044F \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E \u043F\u0440\u043E\u043A\u043E\u043D\u0441\u0443\u043B\u044C\u0442\u0438\u0440\u0443\u044E \u0438 \u043F\u043E\u043C\u043E\u0433\u0443 \u0441\u0434\u0435\u043B\u0430\u0442\u044C \u0432\u0430\u043C \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u044B\u0439 \u0432\u044B\u0431\u043E\u0440";
  return renderTemplate`${maybeRenderHead()}<div class="website-types"> <div class="website-types__container"> ${renderComponent($$result, "TitleSections", $$TitleSections, { "titleSection": titleSection, "subTitleSection": subTitleSection })} <div class="website-types__card"> <div class="website-types__wrap-images"> <img class="website-types__images" src="" alt="foto"> </div> <div class="website-types__content"> <h3 class="website-types__title">Лендинг</h3> <div class="website-types__paragraph"> <p class="website-types__text">Лендинг (Landing Page) - это специально разработанная веб-страница, которая имеет узкую специализацию и фокусируется на определенной цели, такой как сбор контактных данных, продажа продукта или услуги, регистрация на мероприятие и т. д. </p> <p class="website-types__text">Имеют простую и интуитивно понятную структуру, чтобы посетители могли легко получить необходимую информацию и выполнить желаемое действие. </p> <p class="website-types__text">Лендинги являются эффективным инструментом маркетинга для достижения конкретных целей и увеличения конверсии.</p> </div> </div> </div> <div class="website-types__card"> <div class="website-types__wrap-images"> <img class="website-types__images" src="" alt="foto"> </div> <div class="website-types__content"> <h3 class="website-types__title">Тематический сайт</h3> <div class="website-types__paragraph"> <p class="website-types__text">Тематический сайт - это веб-ресурс, посвященный определенной теме, области или интересам. Он предоставляет полезную информацию, контент, продукты или услуги, связанные с данной темой. Тематические сайты могут быть посвящены различным областям, таким как спорт, культура, здоровье, туризм, мода, технологии и многое другое.</p> <p class="website-types__text">Они могут содержать статьи, новости, обзоры, руководства, фотографии, видео и другие элементы, связанные с темой. Тематические сайты могут служить  платформой для предоставления продуктов или услуг, связанных с этой темой.</p> <p class="website-types__text"></p> </div> </div> </div> <div class="website-types__card"> <div class="website-types__wrap-images"> <img class="website-types__images" src="" alt="foto"> </div> <div class="website-types__content"> <h3 class="website-types__title">Сайт визитка</h3> <div class="website-types__paragraph"> <p class="website-types__text">Сайт-визитка - это тип веб-сайта, который предназначен для представления компании, бренда, человека или организации в Интернете. Он обычно состоит из нескольких страниц и содержит основную информацию о бизнесе или личности.</p> <p class="website-types__text">Сайт-визитка является своего рода виртуальной визитной карточкой или брошюрой, которая позволяет посетителям получить общее представление о предлагаемых услугах, продуктах или профессиональных навыках.</p> <p class="website-types__text">Сайт-визитка может быть полезным инструментом для  представления профессиональных навыков и портфолио.</p> </div> </div> </div> <div class="website-types__card"> <div class="website-types__wrap-images"> <img class="website-types__images" src="" alt="foto"> </div> <div class="website-types__content"> <h3 class="website-types__title">Корпоративный сайт</h3> <div class="website-types__paragraph"> <p class="website-types__text">Корпоративный сайт - это веб-сайт, который создается для представления компании или организации в Интернете. </p> <p class="website-types__text">Он служит визитной карточкой компании и предоставляет информацию о ее деятельности, продуктах или услугах, контактных данных и других важных сведениях. Корпоративные сайты обычно имеют  дизайн, соответствующий корпоративному стилю и имиджу компании.</p> <p class="website-types__text">Может содержать разделы, посвященные истории компании, команде, портфолио, новостям и событиям, блогу и другим разделам, в зависимости от потребностей и целей компании.</p> </div> </div> </div> <div class="website-types__card"> <div class="website-types__wrap-images"> <img class="website-types__images" src="" alt="foto"> </div> <div class="website-types__content"> <h3 class="website-types__title">Интернет магазин</h3> <div class="website-types__paragraph"> <p class="website-types__text">Интернет-магазины обеспечивают удобство покупки, позволяя пользователям совершать покупки в любое время и из любого места с доступом в Интернет.</p> <p class="website-types__text">Он предоставляет возможность просмотра каталога товаров, выбора нужных товаров, оформления заказа и оплаты онлайн.</p> <p class="website-types__text">Интернет-магазины обычно предлагают широкий ассортимент товаров, включая одежду, электронику, косметику, продукты питания, бытовую технику и многое другое.</p> </div> </div> </div> <div class="website-types__card"> <div class="website-types__wrap-images"> <img class="website-types__images" src="" alt="foto"> </div> <div class="website-types__content"> <h3 class="website-types__title">Блог</h3> <div class="website-types__paragraph"> <p class="website-types__text">Блог может быть создан как для личного использования, так и для коммерческих целей. Блоги могут быть посвящены различным тематикам, таким как путешествия, кулинария, мода, технологии, финансы, здоровье и многое другое.</p> <p class="website-types__text">Блог предоставляет возможность авторам поделиться своими знаниями и опытом с аудиторией, а также взаимодействовать с читателями через комментарии и обратную связь.</p> <p class="website-types__text">Блог является важным инструментом для обмена информацией, развлечения и создания сообщества с единомышленниками.</p> </div> </div> </div> </div> </div>`;
}, "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/components/sections/WebsiteTypes.astro", void 0);

const $$DevelopmentProcess = createComponent(($$result, $$props, $$slots) => {
  const titleSection = "\u041F\u0440\u043E\u0446\u0435\u0441\u0441 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0438";
  const subTitleSection = "\u0412\u0435\u0441\u044C \u0446\u0438\u043A\u043B \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0438, \u0441 \u043D\u0443\u043B\u044F \u0438 \u0434\u043E \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0430, \u0432\u043A\u043B\u044E\u0447\u0430\u0435\u0442 \u0432 \u0441\u0435\u0431\u044F \u0432\u0441\u0435\u0433\u043E \u0434\u0435\u0432\u044F\u0442\u044C \u0448\u0430\u0433\u043E\u0432";
  return renderTemplate`${maybeRenderHead()}<div class="development-process"> <div class="development-process__container"> ${renderComponent($$result, "TitleSections", $$TitleSections, { "titleSection": titleSection, "subTitleSection": subTitleSection })} <ol class="development-process__card-grup"> <li class="development-process__card"> <h3 class="development-process__card-title">Обсуждение</h3> <p class="development-process__card-text">Во время обсуждения  оговаривается каким будет дизайн, функциональность, структура и содержание сайта. Так же заказчику желательно заполнить бриф.</p> <div class="development-process__card-footer"> <button type="submit" class="button button--text">Подробнее</button> </div> </li> <li class="development-process__card"> <h3 class="development-process__card-title">Изучение</h3> <p class="development-process__card-text">Анализ рынка и конкурентов - это важный шаг в разработке сайта. Разработчик исследует рынок, изучает конкурентов и определяет их сильные и слабые стороны. </p> <div class="development-process__card-footer"> <button type="submit" class="button button--text">Подробнее</button> </div> </li> <li class="development-process__card"> <h3 class="development-process__card-title">Дизайн-макет</h3> <p class="development-process__card-text">Макет сайта используеться для получения обратной связи от заказчика и внесения необходимых изменений до создания окончательного дизайна.</p> <div class="development-process__card-footer"> <button type="submit" class="button button--text">Подробнее</button> </div> </li> <li class="development-process__card"> <h3 class="development-process__card-title">Дизайн главной</h3> <p class="development-process__card-text">Далее создается дизайн первой страницы, подбирается цветовая палитра, стили шрифтов, различные элементы, которые будут использоваться на всех страницах</p> <div class="development-process__card-footer"> <button type="submit" class="button button--text">Подробнее</button> </div> </li> <li class="development-process__card"> <h3 class="development-process__card-title">Дизайн всего сайта</h3> <p class="development-process__card-text">Дизайн остальных страниц, повторяет стили главной. Основная цель это поддерживать стиль на всех страницах сайта одинаковым. Это очень важно.</p> <div class="development-process__card-footer"> <button type="submit" class="button button--text">Подробнее</button> </div> </li> <li class="development-process__card"> <h3 class="development-process__card-title">Верстка</h3> <p class="development-process__card-text">После подтверждения заказчиком дизайна сайта начинается его верстка, которая должна смотреться одинаково хорошо на всех устройствах и браузерах.</p> <div class="development-process__card-footer"> <button type="submit" class="button button--text">Подробнее</button> </div> </li> <li class="development-process__card"> <h3 class="development-process__card-title">Интеграция</h3> <p class="development-process__card-text">Если есть необходимость, сайт интегрируется на CMS, для упрощения добавления на сайт новых статей или новостей.</p> <div class="development-process__card-footer"> <button type="submit" class="button button--text">Подробнее</button> </div> </li> <li class="development-process__card"> <h3 class="development-process__card-title">Публикация</h3> <p class="development-process__card-text">Публикация включает в себя подключение и приобретение домена, выбор провайдера, исходя из потребностей сайта. Подбирается более оптимальное решение.</p> <div class="development-process__card-footer"> <button type="submit" class="button button--text">Подробнее</button> </div> </li> <li class="development-process__card"> <h3 class="development-process__card-title">Аналитика</h3> <p class="development-process__card-text">Подключаются отдельные скрипты, для последующей аналитики сайта и мониторинга переходов по ссылкам. Для дальнейшего анализа и улучшения поведения.</p> <div class="development-process__card-footer"> <button type="submit" class="button button--text">Подробнее</button> </div> </li> </ol> </div> </div>`;
}, "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/components/sections/DevelopmentProcess.astro", void 0);

const $$Result = createComponent(($$result, $$props, $$slots) => {
  const titleSection = "\u0427\u0442\u043E \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442 \u0437\u0430\u043A\u0430\u0437\u0447\u0438\u043A?";
  const subTitleSection = "\u041F\u043E \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u044E \u043F\u0440\u043E\u0435\u043A\u0442\u0430  \u0437\u0430\u043A\u0430\u0437\u0447\u0438\u043A \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442 \u0440\u0430\u0431\u043E\u0442\u0430\u044E\u0449\u0438\u0439 \u0441\u0430\u0439\u0442 \u0438 \u0430\u0440\u0445\u0438\u0432 \u0441 \u0444\u0430\u0439\u043B\u0430\u043C\u0438, \u0434\u043B\u044F \u043F\u043E\u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0438 \u0438 \u043C\u0430\u0441\u0441\u0448\u0442\u0430\u0431\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u043F\u0440\u043E\u0435\u043A\u0442\u0430. \u0412 \u044D\u0442\u043E\u043C \u0438 \u0435\u0441\u0442\u044C \u043A\u043B\u044E\u0447\u0435\u0432\u043E\u0439 \u043F\u043B\u044E\u0441 \u043F\u0435\u0440\u0435\u0434 \u043A\u043E\u043D\u0441\u0442\u0440\u0443\u043A\u0442\u043E\u0440\u0430\u043C\u0438 \u0441\u0430\u0439\u0442\u043E\u0432.";
  return renderTemplate`${maybeRenderHead()}<div class="result"> <div class="result__container"> ${renderComponent($$result, "TitleSections", $$TitleSections, { "titleSection": titleSection, "subTitleSection": subTitleSection })} <div class="result__accordion-wrap"> <!-- <Accordion items={accordionItems} /> --> <div data-spollers data-one-spoller class="spollers"> <div class="spollers__item"> <button type="button" data-spoller class="spollers__title">Опубликованный сайт</button> <div hidden class="spollers__body"> <p class="spollers__body-text">Готовый веб-сайт: Заказчик получает полностью разработанный и функционирующий веб-сайт, который готов для доступа посетителей.</p> <p class="spollers__body-text">Дизайн и визуальное оформление: Веб-сайт будет иметь уникальный дизайн, соответствующий бренду или предпочтениям заказчика. Визуальные элементы, такие как логотип, цветовая схема, шрифты и изображения, будут включены в дизайн сайта.</p> <p class="spollers__body-text">Оптимизированная структура и навигация: Сайт будет иметь логическую и удобную структуру, которая облегчает посетителям навигацию по разделам и страницам. Это помогает улучшить пользовательский опыт и обеспечивает легкость в поиске информации.</p> <p class="spollers__body-text">Функциональность и интерактивность: Заказчик получает сайт с необходимыми функциями и возможностями, такими как контактные формы, блог, галереи изображений, корзина покупок и другие функции, которые соответствуют его бизнес-потребностям.</p> <p class="spollers__body-text">Адаптивный дизайн: Сайт будет адаптирован для отображения на различных устройствах, таких как компьютеры, планшеты и мобильные телефоны. Это обеспечивает оптимальное отображение и удобство использования сайта для всех пользователей.</p> <p class="spollers__body-text">Возможность самостоятельного управления: В зависимости от типа сайта и требований заказчика, может быть предоставлен доступ к системе управления контентом (CMS), что позволяет заказчику вносить изменения, обновлять контент и управлять своим сайтом без необходимости обращения к разработчикам.</p> </div> </div> <div class="spollers__item"> <button type="button" data-spoller class="spollers__title">Исходники</button> <div hidden class="spollers__body"> <p class="spollers__body-text">После завершения проекта заказчик сайта может получить различные исходные файлы, в зависимости от условий и договоренностей между заказчиком и разработчиком.</p> <p class="spollers__body-text">Дизайн-макеты: Заказчик может получить исходные файлы дизайна, такие как файлы Adobe Photoshop (PSD) или Sketch (SKETCH), которые содержат все слои и элементы дизайна. Это позволяет заказчику внести изменения в дизайн в будущем или передать его другим дизайнерам.</p> <p class="spollers__body-text">Графические ресурсы: Исходные файлы графических элементов, таких как логотипы, иллюстрации, иконки и изображения, могут быть предоставлены заказчику. Это может включать файлы в форматах Adobe Illustrator (AI), Adobe Photoshop (PSD), или векторные файлы в форматах SVG или EPS. Заказчик может использовать эти файлы для внесения изменений в графические ресурсы или их использования в других контекстах.</p> <p class="spollers__body-text">Кодовые файлы: Если заказчиком был предоставлен доступ к исходному коду, он может получить файлы с расширениями, такими как HTML, CSS, JavaScript, PHP и т. д. Эти файлы содержат программный код, используемый для создания и функционирования сайта. Заказчик может использовать эти файлы для внесения изменений в код или передачи проекта другому разработчику.</p> <p class="spollers__body-text">Важно отметить, что доступ к исходным файлам может быть ограничен согласно договоренностям или лицензионным соглашениям. Поэтому рекомендуется уточнить с разработчиком, какие исходные файлы будут предоставлены и как они могут быть использованы заказчиком после завершения проекта.</p> </div> </div> <div class="spollers__item"> <button type="button" data-spoller class="spollers__title">Техническая поддержка</button> <div hidden class="spollers__body"> <p class="spollers__body-text">После завершения проекта заказчик сайта может получить техническую поддержку, которая обеспечивает помощь и решение возникающих проблем с сайтом. В рамках льготного периода в три месяца на обслуживание сайта</p> <p class="spollers__body-text">Исправление ошибок и проблем: Если возникают ошибки или проблемы на сайте, заказчик может обратиться к разработчику для их исправления. Это может включать исправление ошибок в коде, устранение проблем с функциональностью или решение других технических проблем.</p> <p class="spollers__body-text">Обновление и поддержка контента: Заказчик может получить помощь в обновлении и поддержке контента на сайте. Это может включать добавление новых страниц, обновление информации, загрузку новых изображений или другие изменения, связанные с контентом сайта.</p> <p class="spollers__body-text">Резервное копирование и восстановление данных: В случае потери данных или сбоя на сайте, заказчик может рассчитывать на помощь в восстановлении данных из резервных копий. Разработчик может предоставить регулярные резервные копии сайта и помочь восстановить данные в случае необходимости.</p> <p class="spollers__body-text">Обновление безопасности: Разработчик может обеспечить обновление безопасности сайта, чтобы защитить его от уязвимостей и атак. Это может включать установку обновлений программного обеспечения, плагинов или тем, а также мониторинг безопасности сайта.</p> <p class="spollers__body-text">Консультации и поддержка: Заказчик может получить консультации и поддержку от разработчика по вопросам, связанным с сайтом. Это может включать помощь в настройке дополнительных функций, оптимизации производительности или ответы на вопросы заказчика.</p> </div> </div> </div> </div> </div> </div>`;
}, "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/components/sections/Result.astro", void 0);

const $$Form = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<!-- Форма с HTML5-валидацией -->${maybeRenderHead()}<form class="contact-form__form" action="/submit-form" method="POST" novalidate> <fieldset class="contact-form__form-wrap"> <legend class="visually-hidden">Контактная информация</legend> <div class="contact-form__grid"> <div class="contact-form__col"> <!-- Группа полей (имя, email, телефон) --> <div class="contact-form__form-group"> <input class="contact-form__input" type="text" id="first-name" name="first_name" autocomplete="name" required required aria-label="Имя (обязательное поле)" placeholder="Введите ваше имя" minlength="2" maxlength="50"> </div> <div class="contact-form__form-group"> <input class="contact-form__input" type="email" id="email" name="email" autocomplete="email" required aria-label="Email (обязательное поле)" placeholder="example@mail.com" pattern="[^@\s]+@[^@\s]+\.[^@\s]+"> </div> <div class="contact-form__form-group"> <input class="contact-form__input" type="tel" id="phone" name="phone" autocomplete="tel" aria-label="Телефон" placeholder="+7 (XXX) XXX-XX-XX" pattern="[\+]\d{1}\s[\(]\d{3}[\)]\s\d{3}[\-]\d{2}[\-]\d{2}"> </div> </div> <div class="contact-form__col"> <div class="contact-form__textarea-wrap"> <textarea class="contact-form__textarea" id="message" name="message" rows="5" aria-label="Сообщение" placeholder="Введите ваше сообщение..." maxlength="1000"></textarea> </div> </div> </div> <!-- Чекбокс согласия (исправленная версия) --> <label class="contact-form__checkbox-wrap"> <input type="checkbox" id="consent" name="consent" required checked class="visually-hidden"> <span class="contact-form__checkbox-icon _icon-checkbox-unchecked" aria-hidden="true"></span> <span class="contact-form__checkbox-label"> Согласие на обработку персональных данных* </span> </label> <!-- Кнопка отправки --> <div class="contact-form__footer"> <button class="button button--filled" type="submit">Отправить</button> </div> </fieldset> </form> `;
}, "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/components/ui/Form.astro", void 0);

const $$ContactForm = createComponent(($$result, $$props, $$slots) => {
  const titleSection = "\u0411\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u0430\u044F \u043A\u043E\u043D\u0441\u0443\u043B\u044C\u0442\u0430\u0446\u0438\u044F";
  const subTitleSection = "\u0421\u0432\u044F\u0436\u0435\u043C\u0441\u044F \u0441 \u0432\u0430\u043C\u0438, \u0438 \u043E\u0442\u0432\u0435\u0442\u0438\u043C \u043D\u0430 \u0432\u0441\u0435 \u0432\u043E\u043F\u0440\u043E\u0441\u044B, \u0430 \u0442\u0430\u043A \u0436\u0435 \u043F\u043E\u0434\u0431\u0435\u0440\u0435\u043C \u0443\u043D\u0438\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u043F\u0443\u0442\u044C \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F \u0432\u0430\u0448\u0435\u0433\u043E \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u0430.";
  return renderTemplate`${maybeRenderHead()}<section class="contact-form"> <div class="contact-form__container"> ${renderComponent($$result, "TitleSections", $$TitleSections, { "titleSection": titleSection, "subTitleSection": subTitleSection })} ${renderComponent($$result, "Form", $$Form, {})} </div> </section>`;
}, "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/components/sections/ContactForm.astro", void 0);

const $$Astro = createAstro("https://web22des.github.io");
const $$Images = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Images;
  const {
    src,
    alt,
    width,
    height,
    loading = "lazy",
    formats = ["webp"],
    quality = 80,
    class: className
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Image", $$Image, { "src": src, "alt": alt, "width": width, "height": height, "formats": formats, "quality": quality, "loading": loading, "class": className })}`;
}, "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/components/ui/Images.astro", void 0);

const macbookImage = new Proxy({"src":"/astro-template_v-01-test/assets/Macbook-oLtV3o7_.png","width":936,"height":523,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/assets/images/content/gallery/Macbook.png";
							}
							if (target[name] !== undefined && globalThis.astroAsset) globalThis.astroAsset?.referencedImages.add("/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/assets/images/content/gallery/Macbook.png");
							return target[name];
						}
					});

const gallery01 = new Proxy({"src":"/astro-template_v-01-test/assets/gallery-01-sm-BXAsZAXZ.jpg","width":750,"height":6664,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/assets/images/content/gallery/gallery-01-sm.jpg";
							}
							if (target[name] !== undefined && globalThis.astroAsset) globalThis.astroAsset?.referencedImages.add("/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/assets/images/content/gallery/gallery-01-sm.jpg");
							return target[name];
						}
					});

const gallery02 = new Proxy({"src":"/astro-template_v-01-test/assets/gallery-02-sm-DwoBlyIq.jpg","width":750,"height":2402,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/assets/images/content/gallery/gallery-02-sm.jpg";
							}
							if (target[name] !== undefined && globalThis.astroAsset) globalThis.astroAsset?.referencedImages.add("/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/assets/images/content/gallery/gallery-02-sm.jpg");
							return target[name];
						}
					});

const gallery03 = new Proxy({"src":"/astro-template_v-01-test/assets/gallery-03-sm-BlJUp0nH.jpg","width":750,"height":4123,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/assets/images/content/gallery/gallery-03-sm.jpg";
							}
							if (target[name] !== undefined && globalThis.astroAsset) globalThis.astroAsset?.referencedImages.add("/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/assets/images/content/gallery/gallery-03-sm.jpg");
							return target[name];
						}
					});

const gallery04 = new Proxy({"src":"/astro-template_v-01-test/assets/gallery-04-sm-DOlllXM7.jpg","width":750,"height":7555,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/assets/images/content/gallery/gallery-04-sm.jpg";
							}
							if (target[name] !== undefined && globalThis.astroAsset) globalThis.astroAsset?.referencedImages.add("/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/assets/images/content/gallery/gallery-04-sm.jpg");
							return target[name];
						}
					});

const $$Gallery = createComponent(($$result, $$props, $$slots) => {
  const titleSection = "\u0413\u0430\u043B\u0435\u0440\u0435\u044F \u0440\u0430\u0431\u043E\u0442";
  const subTitleSection = "\u0417\u0434\u0435\u0441\u044C \u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u044B \u043D\u0435\u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0440\u0430\u0431\u043E\u0442\u044B \u0441\u0434\u0435\u043B\u0430\u043D\u043D\u044B\u0435 \u0437\u0430 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u043A\u0432\u0430\u0440\u0442\u0430\u043B";
  return renderTemplate`${maybeRenderHead()}<section class="gallery"> <div class="gallery__container"> ${renderComponent($$result, "TitleSections", $$TitleSections, { "titleSection": titleSection, "subTitleSection": subTitleSection })} <!-- Оболочка слайдера --> <div class="gallery__slider swiper"> <!-- Двигающееся часть слайдера --> <div class="gallery__wrapper swiper-wrapper"> <!-- Слайд --> <div class="gallery__slide swiper-slide"> ${renderComponent($$result, "Images", $$Images, { "class": "gallery__img", "src": macbookImage, "alt": "macbook" })} <div class="gallery__slide-content"> ${renderComponent($$result, "Images", $$Images, { "class": "gallery__content-img", "src": gallery01, "alt": "m" })} </div> </div> <div class="gallery__slide swiper-slide"> ${renderComponent($$result, "Images", $$Images, { "class": "gallery__img", "src": macbookImage, "alt": "macbook" })} <div class="gallery__slide-content"> ${renderComponent($$result, "Images", $$Images, { "class": "gallery__content-img", "src": gallery02, "alt": "m" })} </div> </div> <div class="gallery__slide swiper-slide"> ${renderComponent($$result, "Images", $$Images, { "class": "gallery__img", "src": macbookImage, "alt": "macbook" })} <div class="gallery__slide-content"> ${renderComponent($$result, "Images", $$Images, { "class": "gallery__content-img", "src": gallery03, "alt": "m" })} </div> </div> <div class="gallery__slide swiper-slide"> ${renderComponent($$result, "Images", $$Images, { "class": "gallery__img", "src": macbookImage, "alt": "macbook" })} <div class="gallery__slide-content"> ${renderComponent($$result, "Images", $$Images, { "class": "gallery__content-img", "src": gallery04, "alt": "m" })} </div> </div> </div> <!-- Если нужна пагинация --> <div class="swiper-pagination"></div> <!-- Если нужна навигация (влево/вправо) --> <button type="button" class="swiper-button-prev"></button> <button type="button" class="swiper-button-next"></button> <!-- Если нужен скролбар --> <!-- <div class="swiper-scrollbar"></div> --> </div> </div> </section>`;
}, "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/components/sections/gallery/Gallery.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const title = "\u0413\u043B\u0430\u0432\u043D\u0430\u044F";
  return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, { "title": title }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Hero", $$Hero, {})} ${renderComponent($$result2, "Advantages", $$Advantages, {})}  ${renderComponent($$result2, "WebsiteTypes", $$WebsiteTypes, {})} ${renderComponent($$result2, "DevelopmentProcess", $$DevelopmentProcess, {})} ${renderComponent($$result2, "Result", $$Result, {})} ${renderComponent($$result2, "Gallery", $$Gallery, {})} ${renderComponent($$result2, "ContactForm", $$ContactForm, {})} ` })}`;
}, "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/pages/index.astro", void 0);

const $$file = "/home/runner/work/astro-template_v-01-test/astro-template_v-01-test/src/pages/index.astro";
const $$url = "/astro-template_v-01-test/";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page as a, baseService as b, parseQuality as p };
