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

import {FocusZone, getTheme, Separator, Stack, Text} from "@fluentui/react";
import React from "react";
import {InspectorStyle} from "../../helpers/CONSTANTS";
import {SeparatorStyles} from "../../helpers/styles";
import {FontSize} from "./FontSize";
import {FontFamily} from "./FontFamily";
import {FontWeight} from "./FontWeight";
import {LineHeight} from "./LineHeight";
import {TextAlign} from "./TextAlign";
import {FontFill} from "../fill/FontFill";

interface ITextDProps {
  layer: any;
  tokens: any;
  unit: string;
  styles: any;
}

export function TextD(props: ITextDProps) {
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
          字符
        </Text>
        <Separator styles={SeparatorStyles}/>
        <Stack tokens={{childrenGap: 8}}>
          <Stack horizontal={true} tokens={{childrenGap: 8}}>
            <Stack.Item grow={1}>
              <FontFamily {...props} />
            </Stack.Item>
          </Stack>

          <Stack
            horizontal={true}
            tokens={{childrenGap: 8}}
            horizontalAlign="space-between"
          >
            <Stack.Item grow={1}>
              <FontWeight {...props} />
            </Stack.Item>
            <LineHeight {...props} />
          </Stack>
        </Stack>
        <FontSize {...props} />
        <FontFill {...props} />
        <TextAlign {...props} />
      </Stack>
    </FocusZone>
  );
}
