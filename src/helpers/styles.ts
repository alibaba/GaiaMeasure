/*
 * Copyright (c) 2022, Alibaba Group Holding Limited;
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {getTheme} from "@fluentui/style-utilities";
import tinycolor from "tinycolor2";

export const GChoiceOptionStyles: any = {
  root: {
    height: 24,
    margin: 0,
  },
  input: {
    height: 24,
  },
};

export const GChoiceStyles: any = {
  flexContainer: {
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    height: "24px",
  },
  root: {
    margin: 0,
  },
  label: {
    fontSize: "12px",
    height: "24px",
    fontWeight: 500,
  },
};

export const TextFieldStyles: any = {
  subComponentStyles: {
    label: {
      root: {
        fontWeight: 400,
        fontSize: 12,
      },
    },
  },
  field: {
    fontSize: 12,
  },
  icon: {
    fontSize: 12,
    height: "26px",
    lineHeight: "26px",
    bottom: 0,
    color: getTheme().palette.black,
  },
  fieldGroup: {
    height: "26px",
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: "rgb(30,30,30)",
  },
  prefix: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  suffix: {
    fontSize: 12,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
};

export const SeparatorStyles: any = {
  root: {padding: 0, margin: 0, height: 0},
};

export function getStyles(layer: any) {
  let style: any = {};
  if (layer != undefined && !layer.hidden) {
    if (layer.frame.width != null) {
      style["width"] = layer.frame.width;
    }
    if (layer.frame.height != null) {
      style["height"] = layer.frame.height;
    }

    if (layer.style == undefined) {
      return style;
    }

    if (layer.style.textColor != null) {
      style["color"] = mergeOpacity(layer.style, layer.style.textColor);
    }
    if (layer.style.fontSize != null) {
      style["font-size"] = layer.style.fontSize;
    }
    if (layer.style.fontFamily != null) {
      style["font-family"] = layer.style.fontFamily;
    }
    if (layer.style.fontWeight != null) {
      style["font-weight"] = appKitWeightToCSSWeight(
        Number(layer.style.fontWeight)
      );
    }
    if (layer.style.lineHeight != null) {
      style["line-height"] = layer.style.lineHeight;
    }
    if (layer.style.alignment != null) {
      style["text-align"] = layer.style.alignment;
    }
    if (layer.style.verticalAlignment != null) {
      style["vertical-align"] = layer.style.verticalAlignment;
    }

    let borderRadius: any = [];
    for (let index = 0; layer.points && index < layer.points.length; index++) {
      const point = layer.points[index];
      if (point.pointType == "Straight") {
        borderRadius.push(point.cornerRadius);
      }
    }
    let borderRadiusAllSame = true;
    for (let index = 1; index < borderRadius.length; index++) {
      const radius = borderRadius[index];
      if (radius != borderRadius[0]) {
        borderRadiusAllSame = false;
        break;
      }
    }
    if (borderRadius.length > 0) {
      if (borderRadiusAllSame) {
        if (borderRadius[0] != 0) {
          style["border-radius"] = borderRadius[0];
        }
      } else {
        style["border-radius"] = borderRadius.join(",");
      }
    }

    for (
      let index = 0;
      layer.style.borders && index < layer.style.borders.length;
      index++
    ) {
      const border = layer.style.borders[index];
      if (!border.enabled) {
        continue;
      }
      if (border.position != null) {
        if (border.position == "Center") {
          style["box-sizing"] = "inherit";
        } else if (border.position == "Inside") {
          style["box-sizing"] = "border-box";
        } else if (border.position == "Outside") {
          style["box-sizing"] = "content-box";
        }
      }
      if (border.fillType == "Color") {
        style["border-color"] = mergeOpacity(layer.style, border.color);
      } else if (border.fillType == "Gradient") {
        style["border-image"] = getGradient(border.gradient);
      }

      if (border.thickness != null) {
        style["border-width"] = border.thickness;
      }
    }

    for (
      let index = 0;
      layer.style.fills && index < layer.style.fills.length;
      index++
    ) {
      const fill = layer.style.fills[index];
      if (!fill.enabled) {
        continue;
      }
      if (fill.fillType == "Color") {
        style["background-color"] = mergeOpacity(layer.style, fill.color);
      } else if (fill.fillType == "Gradient") {
        style["background-image"] = getGradient(fill.gradient);
      }
    }

    if (layer.style.blur && layer.style.blur.enabled) {
      style["blur-radius"] = layer.style.blur.radius;
      style["blur-type"] = layer.style.blur.blurType;
    }

    for (
      let index = 0;
      layer.style.shadows && index < layer.style.shadows.length;
      index++
    ) {
      const shadow = layer.style.shadows[index];
      if (!shadow.enabled) {
        continue;
      }
      style["box-shadow"] = `${shadow.x} ${shadow.y} ${shadow.blur} ${
        shadow.spread
      } ${convertColor(shadow.color)}`;
    }

    let hasColorStyle = false;
    for (let index = 0; index < Object.keys(style).length; index++) {
      const styleKey = Object.keys(style)[index];
      if (styleKey.indexOf("color") != -1) {
        hasColorStyle = true;
        break;
      }
    }

    if (layer.style["opacity"] != undefined && !hasColorStyle) {
      style["opacity"] = Number(Number(layer.style["opacity"]).toFixed(2));
    }
  }
  return style;
}

function mergeOpacity(styles: any, value: any) {
  let colorString = value;
  if (styles["opacity"] != null) {
    let opacity = Number(styles["opacity"]);
    let mcolor = value && tinycolor(value);
    if (mcolor) {
      if (mcolor.getAlpha() === 1 && opacity == 1) {
        colorString = mcolor.toHexString();
      } else {
        if (opacity != 1) {
          mcolor.setAlpha(opacity);
        }
        colorString = mcolor.toRgbString();
      }
    }
  }
  return colorString;
}

function appKitWeightToCSSWeight(weight: number) {
  return [
    100, 100, 100, 200, 300, 400, 500, 500, 600, 700, 800, 900, 900, 900, 900,
    900,
  ][weight];
}

function convertColor(value: any) {
  let colorString = value;
  let colour = value && tinycolor(value);
  if (colour) {
    if (colour.getAlpha() === 1) {
      colorString = colour.toHexString();
    } else {
      colorString = colour.toHex8String();
    }
  }
  return colorString;
}

export function getGradient(gradient: any) {
  let linearGradientString;
  if (gradient != undefined) {
    if (gradient.gradientType == "Linear") {
      linearGradientString = "线性渐变(";
      let fromX = Math.max(
        0,
        Math.min(Number(Number(gradient.from.x).toFixed(2)), 1)
      );
      let fromY = Math.max(
        0,
        Math.min(Number(Number(gradient.from.y).toFixed(2)), 1)
      );
      let toX = Math.max(
        0,
        Math.min(Number(Number(gradient.to.x).toFixed(2)), 1)
      );
      let toY = Math.max(
        0,
        Math.min(Number(Number(gradient.to.y).toFixed(2)), 1)
      );
      linearGradientString += `${Math.round(Number(fromX) * 10) / 10}-${
        Math.round(Number(fromY) * 10) / 10
      }->${Math.round(Number(toX) * 10) / 10}-${
        Math.round(Number(toY) * 10) / 10
      }->`;
      let stops: any = [];
      for (let index = 0; index < gradient.stops.length; index++) {
        const stop = gradient.stops[index];
        if (stop) {
          stops.push(
            `${convertColor(stop.color)}-${Number(stop.position * 100).toFixed(
              0
            )}%`
          );
        }
      }
      linearGradientString += stops.join("->");
      linearGradientString += ")";
    }
  }
  return linearGradientString;
}

export function getFixedValue(value: number) {
  if (String(value).indexOf(".5") == String(value).length - 2) {
    return value;
  }
  return Math.round(value);
}

/**
 * Formats a given position attribute
 * @param {String} pos - the position value
 * @returns {Number}
 */
const formatPosition = (pos: string) =>
  Number(`${pos}`.trim().endsWith("%") ? pos.trim().replace("%", "") : pos);

/**
 * Returns a gradient angle by a given position properties
 * @param {String} x1 - The gradient x1 position
 * @param {String} x2 - The gradient x2 position
 * @param {String} y1 - The gradient y1 position
 * @param {String} y2 - The gradient y2 position
 * @returns {Number}
 */
// @ts-ignore
export const getGradientAngle = ({x1, x2, y1, y2}) => {
  [x1, x2, y1, y2] = [x1, x2, y1, y2].map(formatPosition);

  const x = x2 - x1;
  const y = y2 - y1;

  // Single axis
  if (y === 0) {
    return x1 > x2 ? 270 : 90;
  }

  if (x === 0) {
    return y1 > y2 ? 0 : 180;
  }

  // Converts angle in degrees
  const angleRad = Math.atan2(y, x);
  return clampAngle((angleRad * 180) / Math.PI + 90);
};

/**
 * Clamps an angle into given boundaries
 * @param {Number} angle
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
const clampAngle = (angle: number, min = 0, max = 360) => {
  if (angle < min) {
    return 360 + angle;
  }

  if (angle > max) {
    return angle - 360;
  }

  return angle;
};

export function normalizedAngle(angle: number) {
  let result: any;
  if (angle == 0) {
    result = "从下到上( to top )";
  } else if (angle == 180) {
    result = "从上到下( to bottom )";
  } else if (angle == 270) {
    result = "从右到左( to left )";
  } else if (angle == 90) {
    result = "从左到右( to right )";
  } else if (angle == 45) {
    result = "从左下到右上( to top right )";
  } else if (angle == 315) {
    result = "从右下到左上( to top left )";
  } else if (angle == 225) {
    result = "从右上到左下( to bottom left )";
  } else if (angle == 135) {
    result = "从左上到右下( to bottom right )";
  }
  return result;
}
