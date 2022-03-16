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

import {getTheme, Text, TextField} from "@fluentui/react";
import React, {useEffect, useState} from "react";
import {getFixedValue, TextFieldStyles} from "../../helpers/styles";
import {getSingleAttributeTokens} from "../../helpers/tokens";

interface IFontSizeProps {
  layer: any;
  tokens: any;
  unit: string;
  styles: any;
}

export function FontSize(props: IFontSizeProps) {
  const [fontSizeDescriptions, setFontSizeDescriptions] = useState([]);
  useEffect(() => {
    if (props.styles) {
      if (props.styles["font-size"]) {
        let [matchedToken, matchedCode] = getSingleAttributeTokens(
          props.tokens,
          "font-size",
          props.styles["font-size"],
          props.layer ? props.layer.name : undefined
        );
        setFontSizeDescriptions(matchedToken || []);
      }
    } else {
      setFontSizeDescriptions([]);
    }
  }, [props.styles]);
  return (
    <TextField
      label={"字号"}
      readOnly={true}
      borderless={true}
      styles={TextFieldStyles}
      suffix={props.unit}
      value={
        props["styles"]["font-size"] &&
        getFixedValue(props["styles"]["font-size"])
      }
      onRenderDescription={() => {
        return (
          <div style={{width: "100%"}}>
            <Text
              variant={"tiny"}
              styles={{
                root: {
                  color:
                    fontSizeDescriptions.length == 1
                      ? getTheme().palette.themePrimary
                      : getTheme().palette.yellow,
                  fontSize: "12px",
                  whiteSpace: "pre-line",
                  marginTop: fontSizeDescriptions ? 5 : 0,
                },
              }}
            >
              {fontSizeDescriptions
                .map((value: string) => {
                  return value.replace("\r\n", " ");
                })
                .join("\r\n")}
            </Text>
          </div>
        );
      }}
    />
  );
}
