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

import {TextField} from "@fluentui/react";
import React from "react";
import {getFixedValue, TextFieldStyles} from "../../helpers/styles";
import deepmerge from "deepmerge";

interface ILineHeightProps {
  layer: any;
  tokens: any;
  unit: string;
  styles: any;
}

export function LineHeight(props: ILineHeightProps) {
  return (
    <TextField
      label={"行高"}
      readOnly={true}
      borderless={true}
      styles={deepmerge(TextFieldStyles, {
        field: {
          width: "50px",
        },
      })}
      suffix={props.unit}
      //@ts-ignore
      value={
        props["styles"]["line-height"]
          ? getFixedValue(props["styles"]["line-height"])
          : "默认"
      }
    />
  );
}
