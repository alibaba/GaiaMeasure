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
import {Colour} from "../fill/Colour";

interface IShadowProps {
  layer: any;
  tokens: any;
  styles: any;
  unit: any;
}

export function Shadow(props: IShadowProps) {
  const [shadowColor, setShadowColor] = useState("");
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [blurRadius, setBlurRadius] = useState(0);
  const [spread, setSpread] = useState(0);

  useEffect(() => {
    if (props.styles && props.styles["box-shadow"]) {
      let boxShadow = props.styles["box-shadow"];
      if (boxShadow) {
        let split = boxShadow.split(" ");
        if (split.length == 5) {
          setOffsetX(split[0]);
          setOffsetY(split[1]);
          setBlurRadius(split[2]);
          setSpread(split[3]);
          setShadowColor(split[4]);
        }
      }
    }
  }, [props.layer, props.styles, props.unit]);

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
          阴影
        </Text>
        <Separator styles={SeparatorStyles}/>
        {props.styles["box-shadow"] ? (
          <>
            <Colour
              colourString={shadowColor}
              tokens={props.tokens}
              layer={props.layer}
            />
            <Stack tokens={{childrenGap: 8}}>
              <Stack
                horizontal={true}
                tokens={{childrenGap: 8}}
                verticalAlign={"start"}
              >
                <TextField
                  label={"X"}
                  readOnly
                  borderless={true}
                  styles={TextFieldStyles}
                  suffix={props.unit}
                  value={String(getFixedValue(offsetX))}
                />
                <TextField
                  label={"Y"}
                  readOnly
                  borderless={true}
                  styles={TextFieldStyles}
                  suffix={props.unit}
                  value={String(getFixedValue(offsetY))}
                />
              </Stack>
              <Stack
                horizontal={true}
                tokens={{childrenGap: 8}}
                verticalAlign={"start"}
              >
                <TextField
                  label={"模糊"}
                  readOnly
                  borderless={true}
                  styles={TextFieldStyles}
                  suffix={props.unit}
                  value={String(getFixedValue(blurRadius))}
                />
                <TextField
                  label={"扩展"}
                  readOnly
                  borderless={true}
                  styles={TextFieldStyles}
                  suffix={props.unit}
                  value={String(getFixedValue(spread))}
                />
              </Stack>
            </Stack>
          </>
        ) : null}
      </Stack>
    </FocusZone>
  );
}
