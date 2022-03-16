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

import {Stack, TextField} from "@fluentui/react";
import React from "react";
import {Colour} from "./Colour";
import {TextFieldStyles} from "../../helpers/styles";
import deepmerge from "deepmerge";

interface ILinearGradientRowProps {
  colourString: string;
  tokens: any;
  stopPercent: string;
  hideLabel: boolean;
  layer: any;
  noToken?: boolean;
}

export function LinearGradientRow(props: ILinearGradientRowProps) {
  return (
    <Stack
      horizontal
      tokens={{childrenGap: 10}}
      verticalAlign={"start"}
      horizontalAlign={"space-between"}
    >
      <Stack.Item>
        <Colour
          colourString={props.colourString}
          tokens={props.colourString}
          hideLabel={props.hideLabel}
          layer={props.layer}
          noToken={props.noToken}
        />
      </Stack.Item>
      <Stack.Item>
        <TextField
          borderless={true}
          label={props.hideLabel ? "" : "STOP"}
          readOnly={true}
          styles={deepmerge(TextFieldStyles, {
            fieldGroup: {width: "55px", minWidth: "55px"},
          })}
          value={props.stopPercent}
        />
      </Stack.Item>
    </Stack>
  );
}
