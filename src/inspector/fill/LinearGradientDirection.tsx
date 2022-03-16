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

import {getTheme, Stack, Text, TextField} from "@fluentui/react";
import React, {useEffect, useState} from "react";
import {getGradientAngle, normalizedAngle, TextFieldStyles,} from "../../helpers/styles";

interface ILinearGradientDirectionProps {
  fromX: string | undefined;
  fromY: string | undefined;
  toX: string | undefined;
  toY: string | undefined;
}

export function LinearGradientDirection(props: ILinearGradientDirectionProps) {
  const [normalizedDirection, setNormalizedDirection] = useState("");

  useEffect(() => {
    let angle = getGradientAngle({
      x1: props.fromX,
      y1: props.fromY,
      x2: props.toX,
      y2: props.toY,
    });
    let result = normalizedAngle(angle);
    if (result) {
      setNormalizedDirection(result);
    }
  }, [props.fromX, props.fromY, props.toX, props.toY]);

  return (
    <Stack tokens={{childrenGap: 8}}>
      <Stack>
        <Text
          variant="small"
          styles={{root: {color: getTheme().palette.themeDark}}}
        >
          方向：{normalizedDirection}
        </Text>
      </Stack>
      <Stack horizontal={true} tokens={{childrenGap: 8}}>
        <TextField
          borderless={true}
          label={"起始点"}
          readOnly={true}
          styles={TextFieldStyles}
          value={`(${props.fromX}, ${props.fromY})`}
        />
        <TextField
          borderless={true}
          label={"终点"}
          readOnly={true}
          styles={TextFieldStyles}
          value={`(${props.toX}, ${props.toY})`}
        />
      </Stack>
    </Stack>
  );
}
