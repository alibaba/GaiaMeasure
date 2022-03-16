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

import {FocusZone, getTheme, PivotItem, Separator, Stack, Text,} from "@fluentui/react";
import React, {useEffect, useState} from "react";
import {InspectorStyle} from "../../helpers/CONSTANTS";
import {SeparatorStyles} from "../../helpers/styles";
import Highlight from "react-highlight";
import "./Code.css";

interface ICodeProps {
  layer: any;
  tokens: any;
  unit: string;
  styles: any;
}

export function Code(props: ICodeProps) {
  const [cssCode, setCssCode] = useState("");

  useEffect(() => {
    if (props.layer && props.styles) {
      let cssString = "";
      for (let key in props.styles) {
        if (props.styles[key] === undefined) {
          continue;
        }
        if (key == "width" || key == "height" || key == "border-width") {
          cssString += ` ${key}: ${Number(props.styles[key]).toFixed(1)};\n`;
        } else if (key == "background-image" || key == "border-image") {
          cssString += ` ${key}: ${convertLinearGradientToCss(
            props.styles[key]
          )};\n`;
        } else {
          cssString += ` ${key}: ${props.styles[key]};\n`;
        }
      }
      cssString += "";
      setCssCode(cssString);
    }
  }, [props.layer, props.styles]);

  return (
    <FocusZone data-is-visible>
      <Stack
        styles={{
          root: {
            boxShadow: getTheme().effects.elevation64,
            margin: InspectorStyle.Margin,
            padding: InspectorStyle.Padding,
            borderRadius: getTheme().effects.roundedCorner4,
            backgroundColor: getTheme().palette.white,
          },
        }}
        tokens={{childrenGap: 12}}
      >
        <Text
          styles={{
            root: {
              color: getTheme().palette.whiteTranslucent40,
            },
          }}
          variant="small"
        >
          CSS
        </Text>
        <Separator styles={SeparatorStyles}/>
        {cssCode && cssCode.length > 0 ? (
          <PivotItem headerText="CSS">
            <Highlight className="css">{cssCode}</Highlight>
          </PivotItem>
        ) : null}
      </Stack>
    </FocusZone>
  );
}

function convertLinearGradientToCss(gradient: any) {
  let result = gradient;
  if (gradient.indexOf("线性渐变(") != -1) {
    let lgValue = String(gradient)
      .substring(5, String(gradient).length - 1)
      .trim();
    let lgArray = lgValue.split("->").map((lg) => {
      let lgg = lg.split("-");
      return lgg.map((lggg) => {
        return lggg.trim();
      });
    });
    result = "linear-gradient(";
    if (lgArray.length > 2) {
      let fromX = 0,
        fromY = 0,
        toX = 0,
        toY = 0;
      if (lgArray[0].length == 2) {
        fromX = Math.round(Number(lgArray[0][0]) * 10) / 10;
        fromY = Math.round(Number(lgArray[0][1]) * 10) / 10;
      }
      if (lgArray[1].length == 2) {
        toX = Math.round(Number(lgArray[1][0]) * 10) / 10;
        toY = Math.round(Number(lgArray[1][1]) * 10) / 10;
      }
      const deltaX = toX - fromX;
      const deltaY = toY - fromY;
      let deg = (Math.atan2(deltaY, deltaX) * 180) / Math.PI + 90;
      result += `${Number(deg.toFixed(2))}deg`;
    }

    for (let index = 2; index < lgArray.length; index++) {
      const stop = lgArray[index];
      let stopColor = stop[0];
      let stopPercent = stop[1];
      result += `, ${stopColor} ${stopPercent}`;
    }
    result += ")";
  }
  return result;
}
