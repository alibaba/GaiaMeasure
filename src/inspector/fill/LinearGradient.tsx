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

import {getTheme, Icon, Stack} from "@fluentui/react";
import React, {useEffect, useState} from "react";
import {LinearGradientRow} from "./LinearGradientRow";
import {LinearGradientDirection} from "./LinearGradientDirection";

interface ILinearGradientProps {
  linearGradient: string;
  tokens: any;
  layer: any;
  noToken?: boolean;
}

export function LinearGradient(props: ILinearGradientProps) {
  const [rowsContent, setRowsContent] = useState([]);

  useEffect(() => {
    if (props.linearGradient && props.linearGradient.indexOf("线性渐变") == 0) {
      let lgValue = String(props.linearGradient)
        .substring(5, String(props.linearGradient).length - 1)
        .trim();
      let lgArray = lgValue.split("->").map((lg) => {
        let lgg = lg.split("-");
        return lgg.map((lggg) => {
          return lggg.trim();
        });
      });
      if (lgArray.length > 2) {
        let fromX, fromY, toX, toY;
        if (lgArray[0].length == 2) {
          fromX = lgArray[0][0];
          fromY = lgArray[0][1];
        }
        if (lgArray[1].length == 2) {
          toX = lgArray[1][0];
          toY = lgArray[1][1];
        }
        let rowsContent: any = [];
        rowsContent.push(
          <LinearGradientDirection
            fromX={fromX}
            fromY={fromY}
            toX={toX}
            toY={toY}
          />
        );
        for (let index = 2; index < lgArray.length; index++) {
          const stop = lgArray[index];
          let stopColor = stop[0];
          let stopPercent = stop[1];
          if (index != 2) {
            rowsContent.push(
              <Stack horizontal horizontalAlign={"center"}>
                <Icon
                  iconName={"SortDown"}
                  styles={{
                    root: {
                      color: getTheme().palette.themeDark,
                    },
                  }}
                />
              </Stack>
            );
          }
          rowsContent.push(
            <LinearGradientRow
              colourString={stopColor}
              tokens={props.tokens}
              stopPercent={stopPercent}
              hideLabel={index !== 2}
              layer={props.layer}
            />
          );
        }
        setRowsContent(rowsContent);
      }
    }
  }, [props.linearGradient]);

  return <Stack tokens={{childrenGap: 8}}>{rowsContent}</Stack>;
}
