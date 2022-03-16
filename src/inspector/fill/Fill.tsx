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

import {getTheme, Stack, Text} from "@fluentui/react";
import React, {useEffect, useState} from "react";
import {FillStyleType, FillType} from "../../helpers/CONSTANTS";
import {Colour} from "./Colour";
import {LinearGradient} from "./LinearGradient";
import {getSingleAttributeTokens} from "../../helpers/tokens";

interface IFillProps {
  layer: any;
  tokens: any;
  styles: any;
  unit: string;
  fillStyleType: FillStyleType;
  noToken?: boolean;
}

export function Fill(props: IFillProps) {
  const [fillType, setFillType] = useState(FillType.Unknown);
  const [designTokenContent, setDesignTokenContent] = useState(null);

  useEffect(() => {
    if (props.fillStyleType == FillStyleType.Background) {
      if (props.styles["background-image"]) {
        setFillType(FillType.Gradient);
      } else if (props.styles["background-color"]) {
        setFillType(FillType.Color);
      } else {
        setFillType(FillType.Unknown);
      }
    } else if (props.fillStyleType == FillStyleType.Font) {
      if (props.styles["background-image"]) {
        setFillType(FillType.Gradient);
      } else if (props.styles["color"]) {
        setFillType(FillType.Color);
      } else {
        setFillType(FillType.Unknown);
      }
    } else if (props.fillStyleType == FillStyleType.Border) {
      if (props.styles["border-image"]) {
        setFillType(FillType.Gradient);
      } else if (props.styles["border-color"]) {
        setFillType(FillType.Color);
      } else {
        setFillType(FillType.Unknown);
      }
    } else {
      setFillType(FillType.Unknown);
    }
  }, [props.layer, props.styles, props.fillStyleType]);

  useEffect(() => {
    if (fillType && fillType == FillType.Gradient) {
      let linearGradient = getStyleValue(
        props.styles,
        props.fillStyleType,
        fillType
      );
      if (linearGradient && linearGradient.indexOf("线性渐变") == 0) {
        let [matchedToken, matchedCode] = getSingleAttributeTokens(
          props.tokens,
          getLinearGradientKey(props.fillStyleType),
          linearGradient,
          props.layer ? props.layer.name : undefined
        );
        if (matchedToken && matchedToken.length > 0) {
          setDesignTokenContent(
            //@ts-ignore
            <Text
              variant="smallPlus"
              styles={{
                root: {color: getTheme().palette.themeDark},
              }}
            >
              {matchedToken}
            </Text>
          );
        }
      }
    }
  }, [props.layer, props.styles, fillType]);

  return (
    <Stack tokens={{childrenGap: 5}}>
      {fillType != FillType.Unknown ? (
        <Text
          variant="smallPlus"
          styles={{root: {color: getTheme().palette.whiteTranslucent40}}}
        >
          {"颜色类型：" + (fillType == FillType.Gradient ? "线性渐变" : "纯色")}
        </Text>
      ) : null}
      {designTokenContent}
      {fillType == FillType.Color ? (
        <Colour
          colourString={getStyleValue(
            props.styles,
            props.fillStyleType,
            fillType
          )}
          tokens={props.tokens}
          layer={props.layer}
          noToken={props.noToken}
        />
      ) : null}
      {fillType == FillType.Gradient ? (
        <LinearGradient
          linearGradient={getStyleValue(
            props.styles,
            props.fillStyleType,
            fillType
          )}
          noToken={props.noToken}
          tokens={props.tokens}
          layer={props.layer}
        />
      ) : null}
    </Stack>
  );
}

function getStyleValue(
  styles: any,
  fillStyleType: FillStyleType,
  fillType: FillType
) {
  let colourValue;
  if (fillType == FillType.Color) {
    if (fillStyleType == FillStyleType.Background) {
      colourValue = styles["background-color"];
    } else if (fillStyleType == FillStyleType.Font) {
      colourValue = styles["color"];
    } else if (fillStyleType == FillStyleType.Border) {
      colourValue = styles["border-color"];
    }
  } else if (fillType == FillType.Gradient) {
    if (
      fillStyleType == FillStyleType.Background ||
      fillStyleType == FillStyleType.Font
    ) {
      colourValue = styles["background-image"];
    } else if (fillStyleType == FillStyleType.Border) {
      colourValue = styles["border-image"];
    }
  }
  return colourValue;
}

function getLinearGradientKey(fillStyleType: FillStyleType) {
  let key = "background-image";
  if (fillStyleType == FillStyleType.Border) {
    key = "border-image";
  }
  return key;
}
