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

import {FocusZone, getTheme, Separator, Stack, Text, TextField,} from "@fluentui/react";
import React, {useEffect, useState} from "react";
import {InspectorStyle} from "../../helpers/CONSTANTS";
import {getFixedValue, SeparatorStyles, TextFieldStyles,} from "../../helpers/styles";

interface IBlurProps {
  layer: any;
  tokens: any;
  styles: any;
  unit: string;
}

enum BlurType {
  Unknown = "unknown",
  Gaussian = "Gaussian",
  Motion = "Motion",
  Background = "Background",
}

export function Blur(props: IBlurProps) {
  const [blurType, setBlurType] = useState(BlurType.Unknown);
  const [blurRadius, setBlurRadius] = useState(0);
  const [motionAngle, setMotionAngle] = useState(0);

  useEffect(() => {
    if (props.styles && props.styles["blur-type"]) {
      setBlurType(props.styles["blur-type"]);
      setBlurRadius(Number(props.styles["blur-radius"]));
      if (props.styles["motionAngle"] != undefined) {
        setMotionAngle(Number(props.styles["motionAngle"]));
      }
    } else {
      setBlurType(BlurType.Unknown);
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
          模糊
        </Text>
        <Separator styles={SeparatorStyles}/>
        {blurType != BlurType.Unknown ? (
          <Text
            variant="smallPlus"
            styles={{root: {color: getTheme().palette.themeDark}}}
          >
            类型：{getBlurText(blurType)}
          </Text>
        ) : null}
        {blurType != BlurType.Unknown ? (
          <TextField
            label={"模糊半径："}
            readOnly
            borderless={true}
            styles={TextFieldStyles}
            suffix={props.unit}
            value={props.layer && getFixedValue(blurRadius)}
          />
        ) : null}
        {blurType == BlurType.Motion ? (
          <TextField
            label={"角度："}
            readOnly
            borderless={true}
            styles={TextFieldStyles}
            suffix={"°"}
            value={String(motionAngle)}
          />
        ) : null}
      </Stack>
    </FocusZone>
  );
}

function getBlurText(blurType: BlurType) {
  let text = "未知";
  if (blurType == BlurType.Gaussian) {
    text = "高斯模糊";
  } else if (blurType == BlurType.Motion) {
    text = "动感模糊";
  } else if (blurType == BlurType.Background) {
    text = "背景模糊";
  }
  return text;
}
