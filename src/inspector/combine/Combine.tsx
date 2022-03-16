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
import React, {useEffect, useState} from "react";
import {FillStyleType, InspectorStyle} from "../../helpers/CONSTANTS";
import {SeparatorStyles} from "../../helpers/styles";
import {getMultiAttributeToken, getMultiTokens} from "../../helpers/tokens";
import {Fill} from "../fill/Fill";
import {FontSize} from "../text/FontSize";
import {FontFamily} from "../text/FontFamily";
import {FontWeight} from "../text/FontWeight";
import {TextAlign} from "../text/TextAlign";
import {LineHeight} from "../text/LineHeight";
import {Size} from "../size/Size";

interface ICombineProps {
  layer: any;
  tokens: any;
  styles: any;
  unit: string;
}

export function Combine(props: ICombineProps) {
  const [combinesContent, setCombinesContent] = useState([]);
  useEffect(() => {
    let items = getMultiTokens(props.tokens, props.styles);
    if (items && items.length > 0) {
      let newCombinesContent: any = [];
      for (let index = 0; index < items.length; index++) {
        const item = items[index];
        const {rules, data} = item;
        let ttoken: any, tcode: any;
        let rrules = [];
        let rows: any = [];
        if (rules && data) {
          for (
            let ruleItemIndex = 0;
            ruleItemIndex < rules.length;
            ruleItemIndex++
          ) {
            let ruleItem = rules[ruleItemIndex];
            let value: any = `${ruleItem.value}`;
            rrules.push({
              name: ruleItem.name,
              value: value,
            });
          }

          [ttoken, tcode] = getMultiAttributeToken(data, rrules);

          if (ttoken == undefined || ttoken.length <= 0) {
            setCombinesContent([]);
            continue;
          }

          rows.push(
            <Text
              styles={{
                root: {
                  color: getTheme().palette.themePrimary,
                  whiteSpace: "pre-line",
                },
              }}
              variant="small"
            >
              {ttoken
                .map((value: string) => {
                  return value.replace("\r\n", " ");
                })
                .join("\r\n")}
            </Text>
          );
          let onceSize = false;
          for (
            let ruleItemIndex = 0;
            ruleItemIndex < rules.length;
            ruleItemIndex++
          ) {
            let ruleItem = rules[ruleItemIndex];
            if (ruleItem.name == "width" || ruleItem.name == "height") {
              if (!onceSize) {
                onceSize = true;
                rows.push(createReactComponent(ruleItem.name, props));
              }
            } else {
              rows.push(createReactComponent(ruleItem.name, props));
            }
          }
        }
        newCombinesContent.push(rows);
      }
      if (newCombinesContent.length > 0) {
        setCombinesContent(
          //@ts-ignore
          <Stack tokens={{childrenGap: 10}} children={newCombinesContent}/>
        );
      } else {
        setCombinesContent([]);
      }
    }
  }, [props.layer, props.tokens, props.styles]);

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
          组合
        </Text>
        <Separator styles={SeparatorStyles}/>
        {combinesContent}
      </Stack>
    </FocusZone>
  );
}

function createReactComponent(key: string, props: any) {
  if (key) {
    if (props.layer.type == "Text") {
      if (key == "color" || key == "background-image") {
        return React.createElement(Fill, {
          ...props,
          fillStyleType: FillStyleType.Font,
          noToken: true,
        });
      } else if (key == "font-family") {
        return React.createElement(FontFamily, {
          ...props,
          noToken: true,
        });
      } else if (key == "font-weight") {
        return React.createElement(FontWeight, {
          ...props,
          noToken: true,
        });
      } else if (key == "font-size") {
        return React.createElement(FontSize, {
          ...props,
          noToken: true,
        });
      } else if (key == "text-align") {
        return React.createElement(TextAlign, {
          ...props,
          noToken: true,
        });
      } else if (key == "line-height") {
        return React.createElement(LineHeight, {
          ...props,
          noToken: true,
        });
      }
    } else {
      if (key == "background-color" || key == "background-image") {
        return React.createElement(Fill, {
          ...props,
          fillStyleType: FillStyleType.Background,
          noToken: true,
        });
      } else if (key == "border-color" || key == "border-image") {
        return React.createElement(Fill, {
          ...props,
          fillStyleType: FillStyleType.Border,
          noToken: true,
        });
      } else if (key == "width" || key == "height") {
        return React.createElement(Size, {
          ...props,
          noToken: true,
        });
      }
    }
  }
  return;
}
