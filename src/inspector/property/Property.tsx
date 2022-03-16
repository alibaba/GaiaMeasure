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
import {InspectorStyle} from "../../helpers/CONSTANTS";
import {SeparatorStyles} from "../../helpers/styles";
import {Slice} from "./Slice";

interface IPropertyProps {
  slicesInfo: any;
  layer: any;
  tokens: any;
  styles: any;
  unit: string;
}

function getTabName(tab: string) {
  let name = "";
  if (tab == "auto") {
    name = "自动生成切图";
  } else if (tab == "preset") {
    name = "设计师预设切图";
  }
  return name;
}

export function Property(props: IPropertyProps) {
  const [sliceContents, setSliceContents] = useState([]);
  useEffect(() => {
    if (props.slicesInfo && props.layer) {
      let tabs = ["preset", "auto"];
      let newContents: any = [];
      for (let index = 0; index < tabs.length; index++) {
        const tab = tabs[index];
        let keys = Object.keys(props.slicesInfo[tab]);
        if (keys && keys.includes(props.layer.name)) {
          const imgSrcs = props.slicesInfo[tab][props.layer.name];
          newContents.push(
            <Slice
              tabName={getTabName(tab)}
              layerName={props.layer.name}
              imgSrcs={imgSrcs}
            />
          );
        }
      }
      setSliceContents(newContents);
    } else {
      setSliceContents([]);
    }
  }, [props.layer, props.slicesInfo]);

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
          属性
        </Text>
        <Separator styles={SeparatorStyles}/>
        {props.layer ? (
          <Stack tokens={{childrenGap: 8}}>
            <Stack tokens={{childrenGap: 8}}>
              <Text variant="small">名称</Text>
              <Stack
                styles={{
                  root: {
                    backgroundColor: "rgb(30,30,30)",
                    borderRadius: "5px",
                  },
                }}
              >
                <Text
                  variant="small"
                  styles={{
                    root: {
                      marginTop: "5px",
                      marginBottom: "5px",
                      marginLeft: "8px",
                      marginRight: "8px",
                    },
                  }}
                >
                  {props.layer && props.layer.name}
                </Text>
              </Stack>
            </Stack>
            {sliceContents.length > 0 ? (
              <Stack tokens={{childrenGap: 8}}>
                <Text variant="small">切图</Text>
                <Stack
                  styles={{
                    root: {
                      padding: "8px",
                      backgroundColor: "rgb(30,30,30)",
                      borderRadius: "5px",
                    },
                  }}
                >
                  {sliceContents}
                </Stack>
              </Stack>
            ) : null}
          </Stack>
        ) : null}
      </Stack>
    </FocusZone>
  );
}
