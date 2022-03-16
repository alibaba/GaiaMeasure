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
import {TextFieldStyles} from "../../helpers/styles";

interface IFontWeightProps {
  layer: any;
  tokens: any;
  unit: string;
  styles: any;
}

export function FontWeight(props: IFontWeightProps) {
  return (
    <TextField
      label={"字重"}
      readOnly={true}
      borderless={true}
      styles={TextFieldStyles}
      value={getTextByWeight(Number(props["styles"]["font-weight"]))}
    />
  );
}

function getTextByWeight(fontWeight: number) {
  let text = "常规体(Regular, 400)";
  if (fontWeight == 500) {
    text = "中黑体(Medium, 500)";
  } else if (fontWeight == 600) {
    text = "中粗体(Semi Bold, 600)";
  } else if (fontWeight == 700) {
    text = "粗体(Bold, 700)";
  } else if (fontWeight == 300) {
    text = "细体(Light, 300)";
  } else if (fontWeight == 100) {
    text = "纤细体(Thin, 100)";
  } else if (fontWeight == 200) {
    text = "极细体(Ultralight, 200)";
  }
  return text;
}
