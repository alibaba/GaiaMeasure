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

import tinycolor from "tinycolor2";

function isAllShapes(layer: any) {
  let isAllShape = true;
  if (layer && layer.type == "Group") {
    for (let index = 0; layer.layers && index < layer.layers.length; index++) {
      const element = layer.layers[index];
      if (element.type != "ShapePath" && element.type != "Shape") {
        isAllShape = false;
        break;
      }
    }
  }
  return isAllShape;
}

function overrideColor(color1: any, color2String: string) {
  let color2 = tinycolor(color2String);
  let alpha = color1.getAlpha() * color2.getAlpha();
  let newColor = color1.clone().setAlpha(alpha);
  return newColor.toHex8String();
}

export function findMatchedLayer(
  x: any,
  y: any,
  stepX: any,
  stepY: any,
  layer: any,
  groupFillColor?: any,
  groupShadow?: any
) {
  if (x < 0 || y < 0 || layer == undefined) {
    return undefined;
  }
  let frame = layer.frame;
  if (layer.type == "Artboard") {
    frame.x = 0;
    frame.y = 0;
  }
  if (
    x > frame.x &&
    x < frame.x + frame.width &&
    y > frame.y &&
    y < frame.y + frame.height
  ) {
    if (layer.type != "Shape" && layer.layers && layer.layers.length > 0) {
      let currentGroupFillColor = groupFillColor;
      if (layer.type == "Group" && currentGroupFillColor == undefined) {
        if (
          layer.style &&
          layer.style["fills"] &&
          layer.style["fills"].length > 0
        ) {
          for (let index3 = 0; index3 < layer.style["fills"].length; index3++) {
            let fill = layer.style["fills"][index3];
            if (fill["enabled"] && fill["fillType"] == "Color") {
              currentGroupFillColor = fill["color"];
              break;
            }
          }
        }
      }
      let currentGroupShadow = groupShadow;
      if (layer.type == "Group" && currentGroupShadow == undefined) {
        if (
          layer.style &&
          layer.style["shadows"] &&
          layer.style["shadows"].length > 0
        ) {
          for (
            let index3 = 0;
            index3 < layer.style["shadows"].length;
            index3++
          ) {
            let shadow = layer.style["shadows"][index3];
            if (shadow["enabled"]) {
              currentGroupShadow = {...shadow};
              break;
            }
          }
        }
      }
      for (let index = layer.layers.length - 1; index >= 0; index--) {
        const subLayer = layer.layers[index];
        if (subLayer.hidden || subLayer.locked) {
          continue;
        }
        let matchLayer: any = findMatchedLayer(
          x - frame.x,
          y - frame.y,
          stepX + frame.x,
          stepY + frame.y,
          subLayer,
          currentGroupFillColor,
          currentGroupShadow
        );
        if (
          matchLayer &&
          matchLayer.type != "Artboard" &&
          !matchLayer.hidden &&
          matchLayer.name != undefined &&
          !matchLayer.name.endsWith("gaia_resize")
        ) {
          if (
            matchLayer.type != "Group" ||
            (matchLayer.type == "Group" && isAllShapes(matchLayer))
          ) {
            if (matchLayer.type == "Image") {
              for (let index2 = index - 1; index2 >= 0; index2--) {
                const compareLayer = layer.layers[index2];
                if (
                  (compareLayer.type == "ShapePath" ||
                    compareLayer.type == "Shape") &&
                  (matchLayer.frame.x <= compareLayer.frame.x ||
                    matchLayer.frame.y <= compareLayer.frame.y ||
                    matchLayer.frame.x + matchLayer.frame.width >=
                    compareLayer.frame.x + compareLayer.frame.width ||
                    matchLayer.frame.y + matchLayer.frame.height >=
                    compareLayer.frame.y + compareLayer.frame.height)
                ) {
                  matchLayer = compareLayer;
                  matchLayer.frame.stepX = stepX + frame.x;
                  matchLayer.frame.stepY = stepY + frame.y;
                }
              }
            }
            if (subLayer.id == matchLayer.id) {
              matchLayer.frame.stepX = stepX + frame.x;
              matchLayer.frame.stepY = stepY + frame.y;
            }
            let returnLayer = {...matchLayer};
            if (layer && layer.style && layer.style.opacity != 1) {
              returnLayer.style.opacity = Number(layer.style.opacity).toFixed(
                3
              );
            }
            if (currentGroupShadow) {
              if (returnLayer.style && returnLayer.style.shadows) {
                returnLayer.style.shadows.unshift(currentGroupShadow);
              }
            }
            if (currentGroupFillColor) {
              let fillColor = tinycolor(currentGroupFillColor);
              if (returnLayer.style && returnLayer.style.textColor) {
                returnLayer.style.textColor = overrideColor(
                  fillColor,
                  returnLayer.style.textColor
                );
              }

              if (
                returnLayer.style &&
                returnLayer.style.fills &&
                returnLayer.style.fills.length > 0
              ) {
                if (fillColor) {
                  for (
                    let index4 = 0;
                    index4 < returnLayer.style.fills.length;
                    index4++
                  ) {
                    let fill = returnLayer.style.fills[index4];
                    if (fill["color"]) {
                      fill["color"] = overrideColor(fillColor, fill["color"]);
                    } else {
                      fill["color"] = currentGroupFillColor;
                    }
                    if (fill["gradient"] && fill["gradient"]["stops"]) {
                      for (
                        let index5 = 0;
                        index5 < fill["gradient"]["stops"].length;
                        index5++
                      ) {
                        let stop = fill["gradient"]["stops"][index5];
                        if (stop["color"]) {
                          stop["color"] = overrideColor(
                            fillColor,
                            stop["color"]
                          );
                        } else {
                          stop["color"] = currentGroupFillColor;
                        }
                      }
                    }
                  }
                }
              }
              if (
                returnLayer.style &&
                returnLayer.style.borders &&
                returnLayer.style.borders.length > 0
              ) {
                if (fillColor) {
                  for (
                    let index4 = 0;
                    index4 < returnLayer.style.borders.length;
                    index4++
                  ) {
                    let border = returnLayer.style.borders[index4];
                    if (border["color"]) {
                      border["color"] = overrideColor(
                        fillColor,
                        border["color"]
                      );
                    } else {
                      border["color"] = currentGroupFillColor;
                    }
                    if (border["gradient"] && border["gradient"]["stops"]) {
                      for (
                        let index5 = 0;
                        index5 < border["gradient"]["stops"].length;
                        index5++
                      ) {
                        let stop = border["gradient"]["stops"][index5];
                        if (stop["color"]) {
                          stop["color"] = overrideColor(
                            fillColor,
                            stop["color"]
                          );
                        } else {
                          stop["color"] = currentGroupFillColor;
                        }
                      }
                    }
                  }
                }
              }
            }
            return returnLayer;
          }
        }
      }
    }
    layer.frame.stepX = stepX;
    layer.frame.stepY = stepY;
    if (layer.type != "Artboard") {
      return layer;
    }
  }
}
