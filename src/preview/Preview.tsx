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

import {getTheme, Image, ImageFit} from "@fluentui/react";
import React, {useEffect, useRef} from "react";
import "./Preview.css";
import {Scrollbars} from "react-custom-scrollbars";
import {findMatchedLayer} from "../helpers/layers";
//@ts-ignore
import textWidth from "text-width";
import {getSingleAttributeTokens} from "../helpers/tokens";
import {Ruler, RulerDirection} from "./Ruler";
import {Tips} from "./Tips";

interface IPreviewProps {
  selectedArtboard?: any;
  zoomScale: number;
  unit: string;
  onDidClickLayer: any;
  tokens: any;
}

let margin = 10;
let borderWidth = 1;
let PREVIEW_WIDTH = 10000;
var PREVIEW_HEIGHT = 10000;

export function Preview(props: IPreviewProps) {
  const scrollRef = useRef(null);
  const hoverRectRef = useRef(null);
  const anchorRectRef = useRef(null);
  const movingOverLayerRef = useRef(null);
  const anchorLayerRef = useRef(null);
  const imageSizeRef = useRef();

  useEffect(() => {
    if (props.selectedArtboard) {
      let scrollBar: any = scrollRef.current;
      let previewArea = document.getElementById("preview");
      let pngLeft =
        (PREVIEW_WIDTH - props.selectedArtboard.size.width * props.zoomScale) /
        2;
      let svgTop =
        (PREVIEW_HEIGHT -
          props.selectedArtboard.size.height * props.zoomScale) /
        2;
      if (previewArea) {
        let rect = previewArea.getBoundingClientRect();
        scrollBar.scrollTop(
          svgTop -
          (rect.height -
            props.selectedArtboard.size.height * props.zoomScale) /
          2
        );
        scrollBar.scrollLeft(
          pngLeft -
          (rect.width - props.selectedArtboard.size.width * props.zoomScale) /
          2
        );
      } else {
        scrollBar.scrollLeft(pngLeft);
      }
      //@ts-ignore
      imageSizeRef.current = {
        left: 0,
        top: 0,
        width: props.selectedArtboard.size.width * props.zoomScale,
        height: props.selectedArtboard.size.height * props.zoomScale,
      };
      anchorLayerRef.current = null;
      movingOverLayerRef.current = null;
      hideHover("hover");
      hideHover("anchor-hover");
      hideMovingLines();
    }
  }, [props.zoomScale, props.selectedArtboard]);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
      }}
      id={"preview"}
      onClick={() => {
        anchorLayerRef.current = null;
        movingOverLayerRef.current = null;
        hideHover("hover");
        hideHover("anchor-hover");
        hideMovingLines();
      }}
    >
      <Scrollbars
        ref={scrollRef}
        renderThumbVertical={({style, ...props}) => {
          return (
            <div
              style={{
                ...style,
                backgroundColor: "#292a2d",
                borderRadius: "4px",
                minWidth: "8px",
              }}
              {...props}
            />
          );
        }}
        renderThumbHorizontal={({style, ...props}) => {
          return (
            <div
              style={{
                ...style,
                backgroundColor: "#292a2d",
                borderRadius: "4px",
                minHeight: "8px",
              }}
              {...props}
            />
          );
        }}
      >
        <div
          style={{
            width: `${PREVIEW_WIDTH}px`,
            height: `${PREVIEW_HEIGHT}px`,
            pointerEvents: "all",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: `${
                props.selectedArtboard &&
                (PREVIEW_WIDTH -
                  props.selectedArtboard.size.width * props.zoomScale) /
                2
              }px`,
              top: `${
                props.selectedArtboard &&
                (PREVIEW_HEIGHT -
                  props.selectedArtboard.size.height * props.zoomScale) /
                2
              }px`,
              width: `${
                props.selectedArtboard &&
                `${props.selectedArtboard.size.width * props.zoomScale}px`
              }`,
              height: `${
                props.selectedArtboard &&
                `${props.selectedArtboard.size.height * props.zoomScale}px`
              }`,
            }}
          >
            <Image
              loading="lazy"
              width={"100%"}
              height={"100%"}
              id={props.selectedArtboard && props.selectedArtboard.id}
              imageFit={ImageFit.centerContain}
              src={
                props.selectedArtboard &&
                `artboards/${props.selectedArtboard.thumbnailPath}`
              }
              onClick={(event: any) => {
                event.preventDefault();
                event.stopPropagation();
                if (hoverRectRef.current) {
                  anchorLayerRef.current = movingOverLayerRef.current;
                  if (anchorLayerRef.current) {
                    let layer: any = anchorLayerRef.current;
                    let hoverRect = {
                      left:
                        (Math.round(layer.frame.x) +
                          Math.round(layer.frame.stepX)) *
                        props.zoomScale,
                      top:
                        (Math.round(layer.frame.y) +
                          Math.round(layer.frame.stepY)) *
                        props.zoomScale,
                      width: Math.round(
                        Math.round(layer.frame.width) * props.zoomScale
                      ),
                      height: Math.round(
                        Math.round(layer.frame.height) * props.zoomScale
                      ),
                    };
                    //@ts-ignore
                    anchorRectRef.current = hoverRect;
                  }

                  movingOverLayerRef.current = null;
                  hideHover("hover");
                  hideHover("anchor-hover");
                  hideMovingLines();
                  showHover(hoverRectRef.current, "anchor-hover");
                  props.onDidClickLayer &&
                  props.onDidClickLayer(anchorLayerRef.current);
                }
              }}
              onMouseLeave={(event: any) => {
                event.preventDefault();
                hideHover("hover");
                hideMovingLines();
              }}
              onMouseMove={(event: any) => {
                event.preventDefault();
                event.stopPropagation();

                if (props.selectedArtboard && imageSizeRef.current) {
                  let artboardElement = document.getElementById(
                    props.selectedArtboard.id
                  );
                  if (artboardElement) {
                    let rect = artboardElement.getBoundingClientRect();

                    let layer = findMatchedLayer(
                      (event.clientX - rect.x) / props.zoomScale,
                      (event.clientY - rect.y) / props.zoomScale,
                      0,
                      0,
                      window[props.selectedArtboard.id]
                    );
                    if (!layer) {
                      return;
                    }
                    if (
                      !movingOverLayerRef.current ||
                      (movingOverLayerRef &&
                        movingOverLayerRef.current &&
                        movingOverLayerRef.current["id"] != layer.id)
                    ) {
                      if (layer) {
                        movingOverLayerRef.current = layer;
                        let hoverRect = {
                          left: Math.round(
                            (layer.frame.x + layer.frame.stepX) *
                            props.zoomScale
                          ),
                          top: Math.round(
                            (layer.frame.y + layer.frame.stepY) *
                            props.zoomScale
                          ),
                          width: Math.round(
                            layer.frame.width * props.zoomScale
                          ),
                          height: Math.round(
                            layer.frame.height * props.zoomScale
                          ),
                        };
                        //@ts-ignore
                        hoverRectRef.current = hoverRect;

                        if (anchorLayerRef.current) {
                          hideHover("hover");
                          showHover(hoverRect, "hover");
                          hideMovingLines();
                          drawAnchorLines(
                            props,
                            imageSizeRef.current,
                            anchorRectRef.current,
                            hoverRect
                          );
                        } else {
                          hideHover("hover");
                          showHover(hoverRect, "hover");
                          drawMovingLines(
                            props,
                            imageSizeRef.current,
                            hoverRect
                          );
                        }
                      }
                    }
                  }
                }
              }}
            />
            <div
              style={{
                position: "absolute",
                zIndex: 200,
                pointerEvents: "none",
                borderColor: "#FF5733",
                borderStyle: "solid",
                borderWidth: "1px",
                boxSizing: "content-box",
              }}
              id={"hover"}
            />
            <div
              style={{
                position: "absolute",
                zIndex: 200,
                borderColor: "#FF5733",
                pointerEvents: "none",
                borderStyle: "solid",
                borderWidth: "1px",
                boxSizing: "content-box",
              }}
              id={"anchor-hover"}
            />
            <div
              style={{
                position: "absolute",
                zIndex: 212,
                lineHeight: "16px",
                fontSize: "10px",
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
                backgroundColor: getTheme().palette.themePrimary,
                pointerEvents: "none",
                borderRadius: "4px",
              }}
              id={"anchor-right-tip"}
            />
            <Ruler id={"moving-top-line"}/>
            <Ruler id={"moving-left-line"}/>
            <Ruler id={"moving-right-line"}/>
            <Ruler id={"moving-bottom-line"}/>
            <Tips id={"moving-top-tip"}/>
            <Tips id={"moving-left-tip"}/>
            <Tips id={"moving-right-tip"}/>
            <Tips id={"moving-bottom-tip"}/>
            <div id="dash-line-top" style={dashLineVStyles}/>
            <div id="dash-line-left" style={dashLineHStyles}/>
            <div id="dash-line-right" style={dashLineHStyles}/>
            <div id="dash-line-bottom" style={dashLineVStyles}/>
          </div>
        </div>
      </Scrollbars>
    </div>
  );
}

const dashLineVStyles: any = {
  position: "absolute",
  zIndex: 210,
  borderBottomColor: "red",
  borderBottomWidth: "1px",
  borderBottomStyle: "dashed",
  pointerEvents: "none",
};

const dashLineHStyles: any = {
  position: "absolute",
  zIndex: 210,
  borderRightColor: "red",
  borderRightWidth: "1px",
  borderRightStyle: "dashed",
  pointerEvents: "none",
};

function hideHover(id: string) {
  let element: any = document.getElementById(id);
  element && element.style && (element.style.display = "none");
}

function showHover(rect: any, id: string) {
  let element: any = document.getElementById(id);
  if (element && element.style) {
    element.style.display = "inherit";
    element.style.left = `${rect.left}px`;
    element.style.top = `${rect.top}px`;
    element.style.width = `${rect.width - 2}px`;
    element.style.height = `${rect.height - 2}px`;
  }
}

function hideMovingLines() {
  let element: any = document.getElementById("moving-top-line");
  if (element) {
    element.style.display = "none";
  }
  element = document.getElementById("moving-top-tip");
  if (element) {
    element.style.display = "none";
  }

  element = document.getElementById("moving-left-line");
  if (element) {
    element.style.display = "none";
  }

  element = document.getElementById("moving-left-tip");
  if (element) {
    element.style.display = "none";
  }

  element = document.getElementById("moving-right-line");
  if (element) {
    element.style.display = "none";
  }

  element = document.getElementById("moving-right-tip");
  if (element) {
    element.style.display = "none";
  }

  element = document.getElementById("moving-bottom-line");
  if (element) {
    element.style.display = "none";
  }

  element = document.getElementById("moving-bottom-tip");
  if (element) {
    element.style.display = "none";
  }

  element = document.getElementById("dash-line-top");
  if (element) {
    element.style.height = 0;
    element.style.width = 0;
  }

  element = document.getElementById("dash-line-bottom");
  if (element) {
    element.style.height = 0;
    element.style.width = 0;
  }

  element = document.getElementById("dash-line-left");
  if (element) {
    element.style.height = 0;
    element.style.width = 0;
  }

  element = document.getElementById("dash-line-right");
  if (element) {
    element.style.height = 0;
    element.style.width = 0;
  }
}

function drawLine(
  elementId: string,
  direction: RulerDirection,
  top: number,
  left: number,
  width: number,
  height: number
) {
  let rulerWidth = 6,
    rulerDotWidth = 2;
  let element: any = document.getElementById(elementId);
  if (element) {
    element.style.display = "inherit";
    if (direction == RulerDirection.Horizontal) {
      element.style.left = `${left}px`;
      element.style.top = `${top - (rulerWidth - 1) / 2}px`;
      element.style.height = `${rulerWidth}px`;
      element.style.width = `${width}px`;
    } else {
      element.style.left = `${left - (rulerWidth - 1) / 2}px`;
      element.style.top = `${top}px`;
      element.style.height = `${height}px`;
      element.style.width = `${rulerWidth}px`;
    }
  }

  let innerLeftElement: any = document.getElementById(elementId + "ruler-left");
  if (innerLeftElement) {
    innerLeftElement.style.left = 0;
    innerLeftElement.style.top = 0;
    innerLeftElement.style.width = `${
      direction == RulerDirection.Horizontal ? `${rulerDotWidth}px` : "100%"
    }`;
    innerLeftElement.style.height = `${
      direction == RulerDirection.Horizontal ? "100%" : `${rulerDotWidth}px`
    }`;
  }

  let innerElement: any = document.getElementById(elementId + "ruler");
  if (innerElement) {
    innerElement.style.left = `${
      direction == RulerDirection.Horizontal ? 0 : (rulerWidth - 1) / 2
    }px`;
    innerElement.style.top = `${
      direction == RulerDirection.Horizontal ? (rulerWidth - 1) / 2 : 0
    }px`;
    innerElement.style.width = `${
      direction == RulerDirection.Horizontal ? "100%" : "1px"
    }`;
    innerElement.style.height = `${
      direction == RulerDirection.Horizontal ? "1px" : "100%"
    }`;
  }

  let innerRightElement: any = document.getElementById(
    elementId + "ruler-right"
  );
  if (innerRightElement) {
    innerRightElement.style.left = `${
      direction == RulerDirection.Horizontal ? width - rulerDotWidth : 0
    }px`;
    innerRightElement.style.top = `${
      direction == RulerDirection.Horizontal ? 0 : height - rulerDotWidth
    }px`;
    innerRightElement.style.width = `${
      direction == RulerDirection.Horizontal ? `${rulerDotWidth}px` : "100%"
    }`;
    innerRightElement.style.height = `${
      direction == RulerDirection.Horizontal ? "100%" : `${rulerDotWidth}px`
    }`;
  }
}

function drawTip(
  elementId: string,
  value: string | number,
  token: string,
  lineTop: number,
  lineLeft: number,
  lineWidth: number,
  lineHeight: number
) {
  let containerElement: any = document.getElementById(elementId);
  containerElement.style.display = "inherit";
  let width;
  let text = "";
  let valueElement: any = document.getElementById(elementId + "-value");
  if (valueElement) {
    valueElement.innerText = `${value}`;
    text += String(value);
  }
  if (value == token) {
    let middleElement: any = document.getElementById(elementId + "-middle");
    if (middleElement) {
      middleElement.style.display = "none";
    }
    let tokenElement: any = document.getElementById(elementId + "-token");
    if (tokenElement) {
      tokenElement.innerText = "";
    }
  } else {
    let middleElement: any = document.getElementById(elementId + "-middle");
    if (middleElement) {
      middleElement.style.display = "inherit";
    }
    let tokenElement: any = document.getElementById(elementId + "-token");
    if (tokenElement) {
      tokenElement.innerText = token;
      text += String(token);
    }
  }
  width = Math.min(
    200,
    textWidth(text, {
      family: "Hack",
      size: "12px",
    }) + 15
  );
  if (containerElement) {
    containerElement.style.width = `${width}px`;
    let rect = containerElement.getBoundingClientRect();
    if (elementId.indexOf("-top-") != -1) {
      containerElement.style.left = `${lineLeft - rect.width - 5}px`;
      containerElement.style.top = `${
        lineTop + lineHeight - rect.height - 5
      }px`;
    } else if (elementId.indexOf("-bottom-") != -1) {
      containerElement.style.left = `${lineLeft + 5}px`;
      containerElement.style.top = `${lineTop + 5}px`;
    } else if (elementId.indexOf("-left-") != -1) {
      containerElement.style.left = `${Math.min(
        lineLeft + lineWidth - width - 5,
        lineLeft + Math.max(lineWidth / 2, width / 2) - width / 2
      )}px`;
      containerElement.style.top = `${lineTop + 5}px`;
    } else if (elementId.indexOf("-right-") != -1) {
      containerElement.style.left = `${Math.max(
        lineLeft + 5,
        lineLeft + (lineWidth - width) / 2
      )}px`;
      containerElement.style.top = `${lineTop - rect.height - 5}px`;
    }
  }
}

function hideTip(elementId: string) {
  let element: any = document.getElementById(elementId);
  if (element) {
    element.style.display = "none";
  }
}

function drawMovingLines(props: any, rootRect: any, rect: any) {
  // TOP
  let lineLeft, lineTop, lineHeight, lineWidth;
  lineLeft = rect.left + rect.width / 2;
  lineTop = 0;
  lineHeight = rect.top;
  lineWidth = 1;
  drawLine(
    "moving-top-line",
    RulerDirection.Vertical,
    lineTop,
    lineLeft,
    lineWidth,
    lineHeight
  );
  if (lineHeight > 0) {
    let token,
      value = Math.round(lineHeight / props.zoomScale);
    [token] = getTokenByValue(props, "margin-top", value, true);

    drawTip(
      "moving-top-tip",
      value,
      token,
      lineTop,
      lineLeft,
      lineWidth,
      lineHeight
    );
  } else {
    hideTip("moving-top-tip");
  }

  lineLeft = rect.left + rect.width / 2;
  lineTop = rect.top + rect.height;
  lineHeight = Math.max(0, rootRect.height - lineTop);
  lineWidth = 1;
  drawLine(
    "moving-bottom-line",
    RulerDirection.Vertical,
    lineTop,
    lineLeft,
    lineWidth,
    lineHeight
  );
  if (lineHeight > 0) {
    let token,
      value = Math.round(lineHeight / props.zoomScale);
    [token] = getTokenByValue(props, "margin-bottom", value, true);

    drawTip(
      "moving-bottom-tip",
      value,
      token,
      lineTop,
      lineLeft,
      lineWidth,
      lineHeight
    );
  } else {
    hideTip("moving-bottom-tip");
  }

  // LEFT
  lineLeft = 0;
  lineTop = rect.top + rect.height / 2;
  lineWidth = rect.left;
  lineHeight = 1;
  drawLine(
    "moving-left-line",
    RulerDirection.Horizontal,
    lineTop,
    lineLeft,
    lineWidth,
    lineHeight
  );
  if (lineWidth > 0) {
    let token,
      value = Math.round(lineWidth / props.zoomScale);
    [token] = getTokenByValue(props, "margin-left", value, true);

    drawTip(
      "moving-left-tip",
      value,
      token,
      lineTop,
      lineLeft,
      lineWidth,
      lineHeight
    );
  } else {
    hideTip("moving-left-tip");
  }

  // RIGHT
  lineLeft = rect.left + rect.width;
  lineTop = rect.top + rect.height / 2;
  lineWidth = Math.max(0, rootRect.width - rect.left - rect.width);
  lineHeight = 1;
  drawLine(
    "moving-right-line",
    RulerDirection.Horizontal,
    lineTop,
    lineLeft,
    lineWidth,
    lineHeight
  );
  if (lineWidth > 0) {
    let token,
      value = Math.round(lineWidth / props.zoomScale);
    [token] = getTokenByValue(props, "margin-right", value, true);
    drawTip(
      "moving-right-tip",
      value,
      token,
      lineTop,
      lineLeft,
      lineWidth,
      lineHeight
    );
  } else {
    hideTip("moving-right-tip");
  }
}

function getTokenByValue(
  props: any,
  styleKey: any,
  styleValue: any,
  isEdge = false,
  isSameSize = false
) {
  let token: any;
  let code: any;
  if (props.tokens) {
    let tokens = props.tokens;
    let onlyNumberKey: number = styleValue;
    [token, code] = getSingleAttributeTokens(
      tokens,
      styleKey,
      Math.round(onlyNumberKey)
    );
  }
  if (token == undefined) {
    token = `${Math.round(styleValue)}`;
  } else if (token.length > 1 && isEdge) {
    let tempCode, tempToken;
    for (let index = 0; index < token.length; index++) {
      let subToken: any = String(token[index]);
      if (subToken.indexOf("margin_left") != -1 && styleKey == "margin-left") {
        tempToken = subToken.substr(subToken.indexOf("\r\n") + 2).trim();
        tempCode = code.slice(index * 2, index * 2 + 2);
        break;
      } else if (
        subToken.indexOf("margin_right") != -1 &&
        styleKey == "margin-right"
      ) {
        tempToken = subToken.substr(subToken.indexOf("\r\n") + 2).trim();
        tempCode = code.slice(index * 2, index * 2 + 2);
        break;
      } else {
        tempToken = subToken.substr(subToken.indexOf("\r\n") + 2).trim();
        tempCode = code.slice(index * 2, index * 2 + 2);
      }
    }
    code = tempCode;
    token = tempToken;
  } else if (token.length > 1 && !isEdge && isSameSize) {
    let tempCode, tempToken;
    for (let index = 0; index < token.length; index++) {
      let subToken: any = String(token[index]);
      if (
        (styleKey == "margin-left" || styleKey == "margin-right") &&
        isSameSize
      ) {
        tempToken = subToken.substr(subToken.indexOf("\r\n") + 2).trim();
        tempCode = code.slice(index * 2, index * 2 + 2);
        break;
      } else {
        tempToken = subToken.substr(subToken.indexOf("\r\n") + 2).trim();
        tempCode = code.slice(index * 2, index * 2 + 2);
      }
    }
    code = tempCode;
    token = tempToken;
  } else if (token.length > 1) {
    let tt = token.pop();
    token = [tt.substr(tt.indexOf("\r\n") + 2).trim()];
    code = [code.pop()];
  }
  return [token, code];
}

function drawAnchorLines(
  props: any,
  rootRect: any,
  selectingRect: any,
  rect: any
) {
  drawAnchorTopLines(props, rootRect, selectingRect, rect);
  drawAnchorBottomLines(props, rootRect, selectingRect, rect);
  drawAnchorLeftLines(props, rootRect, selectingRect, rect);
  drawAnchorRightLines(props, rootRect, selectingRect, rect);
}

function drawDashLine(rect: any, elementId: string) {
  let rowDash = document.getElementById(elementId);
  if (rowDash) {
    rowDash.style.left = `${rect.left}px`;
    rowDash.style.top = `${rect.top}px`;
    rowDash.style.width = `${rect.width}px`;
    rowDash.style.height = `${rect.height}px`;
  }
}

function drawAnchorTopLines(
  props: any,
  rootRect: any,
  selectingRect: any,
  rect: any
) {
  let lineLeft = 0,
    lineTop,
    lineHeight = 0,
    lineWidth = 1;
  let tipLeft, tipTop, tipHeight, tipWidth;
  let isEdgeLeft = false,
    isEdgeRight = false;

  if (rect.top > selectingRect.top + selectingRect.height) {
    lineHeight = Math.max(
      0,
      Math.abs(rect.top - selectingRect.top - selectingRect.height)
    );
    lineTop = selectingRect.top + selectingRect.height;
  } else if (
    rect.top > selectingRect.top &&
    selectingRect.top + selectingRect.height < rect.top
  ) {
    lineHeight = Math.max(0, rect.top - selectingRect.top);
    lineTop = Math.max(0, selectingRect.top);
  } else if (isIn(selectingRect, rect) || isIn(rect, selectingRect)) {
    lineHeight = Math.max(0, Math.abs(rect.top - selectingRect.top));
    lineTop = Math.min(rect.top, selectingRect.top);
  }

  if (rect.left > selectingRect.left + selectingRect.width) {
    lineLeft = rect.left + rect.width / 2;
  } else if (selectingRect.left > rect.left + rect.width) {
    lineLeft = rect.left + rect.width / 2;
  } else {
    if (selectingRect.width < rect.width) {
      lineLeft = selectingRect.left + selectingRect.width / 2;
    } else {
      lineLeft = rect.left + rect.width / 2;
    }
  }

  if (lineHeight > 0) {
    if (lineLeft > selectingRect.left + selectingRect.width) {
      drawDashLine(
        {
          left: selectingRect.left + selectingRect.width,
          top: lineTop - 2,
          width: Math.max(
            rootRect.width - selectingRect.left - selectingRect.width,
            0
          ),
          height: 1,
        },
        "dash-line-top"
      );
    } else if (lineLeft < selectingRect.left) {
      drawDashLine(
        {
          left: 0,
          top: lineTop - 2,
          width: Math.max(selectingRect.left, 0),
          height: 1,
        },
        "dash-line-top"
      );
    }

    drawLine(
      "moving-top-line",
      RulerDirection.Vertical,
      lineTop,
      lineLeft,
      lineWidth,
      lineHeight
    );

    let token,
      value = Math.round(lineHeight / props.zoomScale);
    [token] = getTokenByValue(props, "margin-top", value);
    drawTip(
      "moving-top-tip",
      value,
      token,
      lineTop,
      lineLeft,
      lineWidth,
      lineHeight
    );
  }
}

function drawAnchorBottomLines(
  props: any,
  rootRect: any,
  selectingRect: any,
  rect: any
) {
  let lineLeft = 0,
    lineTop,
    lineHeight = 0,
    lineWidth = 1;
  let tipLeft, tipTop, tipHeight, tipWidth;
  let isEdgeLeft = false,
    isEdgeRight = false;

  if (rect.top + rect.height < selectingRect.top) {
    lineHeight = Math.max(
      0,
      Math.abs(rect.top + rect.height - selectingRect.top)
    );
    lineTop = rect.top + rect.height;
  } else if (
    rect.top + rect.height <
    selectingRect.top + selectingRect.height
  ) {
    lineHeight = Math.max(
      0,
      selectingRect.top + selectingRect.height - rect.top - rect.height
    );
    lineTop = Math.max(0, rect.top + rect.height);
  } else if (isIn(selectingRect, rect)) {
    lineHeight = Math.max(
      0,
      Math.abs(
        rect.top + rect.height - selectingRect.top - selectingRect.height
      )
    );
    lineTop = Math.min(
      rect.top + rect.height,
      selectingRect.top + selectingRect.height
    );
  }

  if (rect.left > selectingRect.left + selectingRect.width) {
    lineLeft = rect.left + rect.width / 2;
  } else if (selectingRect.left > rect.left + rect.width) {
    lineLeft = rect.left + rect.width / 2;
  } else {
    if (selectingRect.width < rect.width) {
      lineLeft = selectingRect.left + selectingRect.width / 2;
    } else {
      lineLeft = rect.left + rect.width / 2;
    }
  }

  if (lineHeight > 0) {
    if (lineLeft > selectingRect.left + selectingRect.width) {
      drawDashLine(
        {
          left: selectingRect.left + selectingRect.width,
          top: lineTop + lineHeight - 2,
          width: Math.max(
            rootRect.width - selectingRect.left - selectingRect.width,
            0
          ),
          height: 1,
        },
        "dash-line-bottom"
      );
    } else if (lineLeft < selectingRect.left) {
      drawDashLine(
        {
          left: 0,
          top: lineTop + lineHeight - 2,
          width: Math.max(selectingRect.left, 0),
          height: 1,
        },
        "dash-line-bottom"
      );
    }

    drawLine(
      "moving-bottom-line",
      RulerDirection.Vertical,
      lineTop,
      lineLeft,
      lineWidth,
      lineHeight
    );

    let token,
      value = Math.round(lineHeight / props.zoomScale);
    [token] = getTokenByValue(props, "margin-bottom", value);
    drawTip(
      "moving-bottom-tip",
      value,
      token,
      lineTop,
      lineLeft,
      lineWidth,
      lineHeight
    );
  }
}

function drawAnchorLeftLines(
  props: any,
  rootRect: any,
  selectingRect: any,
  rect: any
) {
  let lineLeft = 0,
    lineTop,
    lineHeight = 1,
    lineWidth = 0;
  let tipLeft, tipTop, tipHeight, tipWidth;
  let isEdgeLeft = false,
    isEdgeRight = false;

  if (rect.left > selectingRect.left + selectingRect.width) {
    lineWidth = Math.max(
      0,
      Math.abs(rect.left - selectingRect.left - selectingRect.width)
    );
    lineLeft = selectingRect.left + selectingRect.width;
  } else if (rect.left > selectingRect.left) {
    lineWidth = Math.max(0, rect.left - selectingRect.left);
    lineLeft = Math.max(0, selectingRect.left);
  } else if (isIn(selectingRect, rect)) {
    lineWidth = Math.max(0, Math.abs(rect.left - selectingRect.left));
    lineLeft = Math.min(rect.left, selectingRect.left);
  }

  if (rect.top > selectingRect.top + selectingRect.height) {
    lineTop = rect.top + rect.height / 2;
  } else if (selectingRect.top > rect.top + rect.height) {
    lineTop = rect.top + rect.height / 2;
  } else {
    if (selectingRect.height < rect.height) {
      lineTop = selectingRect.top + selectingRect.height / 2;
    } else {
      lineTop = rect.top + rect.height / 2;
    }
  }

  if (lineWidth > 0) {
    if (lineTop > selectingRect.top + selectingRect.height) {
      drawDashLine(
        {
          left: lineLeft - 2,
          top: selectingRect.top + selectingRect.height - 1,
          width: 1,
          height: Math.max(
            rootRect.height - selectingRect.top - selectingRect.height,
            0
          ),
        },
        "dash-line-left"
      );
    } else if (lineTop < selectingRect.top) {
      drawDashLine(
        {
          left: lineLeft - 2,
          top: 0,
          width: 1,
          height: selectingRect.top,
        },
        "dash-line-left"
      );
    } else if (lineTop > rect.top + rect.height) {
      drawDashLine(
        {
          left: lineLeft + lineWidth - 2,
          top: rect.top + rect.height - 2,
          width: 1,
          height: Math.max(rootRect.height - rect.top - rect.height, 0),
        },
        "dash-line-left"
      );
    }

    drawLine(
      "moving-left-line",
      RulerDirection.Horizontal,
      lineTop,
      lineLeft,
      lineWidth,
      lineHeight
    );

    let token,
      value = Math.round(lineWidth / props.zoomScale);
    [token] = getTokenByValue(props, "margin-left", value);
    drawTip(
      "moving-left-tip",
      value,
      token,
      lineTop,
      lineLeft,
      lineWidth,
      lineHeight
    );
  }
}

function drawAnchorRightLines(
  props: any,
  rootRect: any,
  selectingRect: any,
  rect: any
) {
  let lineLeft = 0,
    lineTop,
    lineHeight = 1,
    lineWidth = 0;
  let tipLeft, tipTop, tipHeight, tipWidth;
  let isEdgeLeft = false,
    isEdgeRight = false;

  if (selectingRect.left > rect.left + rect.width) {
    lineWidth = Math.max(
      0,
      Math.abs(selectingRect.left - rect.left - rect.width)
    );
    lineLeft = rect.left + rect.width;
  } else if (
    selectingRect.left + selectingRect.width >
    rect.left + rect.width
  ) {
    lineWidth = Math.max(
      0,
      selectingRect.left + selectingRect.width - rect.left - rect.width
    );
    lineLeft = Math.max(0, rect.left + rect.width);
  } else if (isIn(selectingRect, rect)) {
    lineWidth = Math.max(
      0,
      Math.abs(
        rect.left + rect.width - selectingRect.left - selectingRect.width
      )
    );
    lineLeft = Math.min(
      rect.left + rect.width,
      selectingRect.left + selectingRect.width
    );
  }

  if (rect.top > selectingRect.top + selectingRect.height) {
    lineTop = rect.top + rect.height / 2;
  } else if (selectingRect.top > rect.top + rect.height) {
    lineTop = rect.top + rect.height / 2;
  } else {
    if (selectingRect.height < rect.height) {
      lineTop = selectingRect.top + selectingRect.height / 2;
    } else {
      lineTop = rect.top + rect.height / 2;
    }
  }

  if (lineWidth > 0) {
    if (lineTop > selectingRect.top + selectingRect.height) {
      drawDashLine(
        {
          left: lineLeft + lineWidth - 2,
          top: selectingRect.top + selectingRect.height - 2,
          width: 1,
          height: Math.max(
            rootRect.height - selectingRect.top - selectingRect.height,
            0
          ),
        },
        "dash-line-right"
      );
    } else if (lineTop < selectingRect.top) {
      drawDashLine(
        {
          left: lineLeft + lineWidth - 2,
          top: 0,
          width: 1,
          height: selectingRect.top,
        },
        "dash-line-right"
      );
    } else if (lineTop > rect.top + rect.height) {
      drawDashLine(
        {
          left: lineLeft - 2,
          top: rect.top + rect.height - 2,
          width: 1,
          height: Math.max(rootRect.height - rect.top - rect.height, 0),
        },
        "dash-line-right"
      );
    } else if (lineTop < rect.top) {
      drawDashLine(
        {
          left: lineLeft - 2,
          top: 0,
          width: 1,
          height: rect.top,
        },
        "dash-line-right"
      );
    }

    drawLine(
      "moving-right-line",
      RulerDirection.Horizontal,
      lineTop,
      lineLeft,
      lineWidth,
      lineHeight
    );

    let token,
      value = Math.round(lineWidth / props.zoomScale);
    [token] = getTokenByValue(props, "margin-right", value);
    drawTip(
      "moving-right-tip",
      value,
      token,
      lineTop,
      lineLeft,
      lineWidth,
      lineHeight
    );
  }
}

function isIn(rect1: any, rect2: any) {
  if (
    rect1.top > rect2.top &&
    rect1.top + rect1.height < rect2.top + rect2.height &&
    rect1.left > rect2.left &&
    rect1.left + rect1.width < rect2.left + rect2.width
  ) {
    return true;
  }
  return false;
}

function isSameRect(rect1: any, rect2: any) {
  let same = false;
  if (rect1.top == rect2.top) {
    same = rect1.width == rect2.width || rect2.height == rect2.height;
  } else if (rect1.left == rect2.left) {
    same = rect1.width == rect2.width || rect2.height == rect2.height;
  } else if (rect1.height == rect2.height && rect1.width == rect2.width) {
    same = true;
  }
  return same;
}

function intersectRect(rect1: any, rect2: any) {
  let rect = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  };
  if (rect2.left >= rect1.left && rect2.left <= rect1.left + rect1.width) {
    rect.left = rect2.left;
    rect.width = Math.abs(rect1.left - rect2.left) + rect2.left;
  } else if (
    rect1.left >= rect2.left &&
    rect1.left <= rect2.left + rect2.width
  ) {
    rect.left = rect1.left;
    rect.width = Math.abs(rect1.left - rect2.left) + rect1.left;
  }

  if (rect2.top >= rect1.top && rect2.top <= rect1.top + rect1.height) {
    rect.top = rect2.top;
    rect.height = Math.abs(rect1.top - rect2.top) + rect2.top;
  } else if (rect1.top >= rect2.top && rect1.top <= rect2.top + rect2.height) {
    rect.top = rect1.top;
    rect.height = Math.abs(rect1.top - rect2.top) + rect1.top;
  }
  return rect;
}
