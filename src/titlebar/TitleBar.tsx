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

import {CommandButton, ContextualMenuItemType, Icon, Image, ImageFit, Stack, Text, TextField,} from "@fluentui/react";
import {getTheme} from "@fluentui/style-utilities";
import React, {useEffect, useState} from "react";
import {TextFieldStyles} from "../helpers/styles";
import deepmerge from "deepmerge";

interface ITitleBarProps {
  unit: string;
  zoomScale: number;
  onZoomScaleDidChange: any;
  slicesInfo: any;
}

export function TitleBar(props: ITitleBarProps) {
  const [zoomScale, setZoomScale] = useState(1);
  const [presetItems, setPresetItems] = useState<any>([]);
  const [autoItems, setAutoItems] = useState<any>([]);

  useEffect(() => {
    setZoomScale(props.zoomScale);
  }, [props.zoomScale]);

  useEffect(() => {
    if (props.slicesInfo) {
      let newPresetItems = [];
      let preset = props.slicesInfo["preset"];
      if (preset) {
        for (const presetKey in preset) {
          let imgSrc = preset[presetKey].slice(-1)[0];
          newPresetItems.push({
            key: presetKey,
            text: presetKey,
            onRenderContent: (item: any) => {
              return (
                <Stack
                  horizontal={true}
                  tokens={{childrenGap: 12}}
                  styles={{root: {padding: 8}}}
                  verticalAlign={"center"}
                >
                  <Image
                    width={24}
                    height={24}
                    shouldStartVisible
                    imageFit={ImageFit.centerContain}
                    src={`slices/preset/${presetKey}/${imgSrc.size}/index.${imgSrc.format}`}
                  />
                  <Text styles={{root: {fontSize: 13}}}>{presetKey}</Text>
                </Stack>
              );
            },
          });
        }
      }
      setPresetItems(newPresetItems);
      let auto = props.slicesInfo["auto"];
      let newAutoItems = [];
      if (auto) {
        for (const autoKey in auto) {
          let imgSrc = auto[autoKey].slice(-1)[0];
          newAutoItems.push({
            key: autoKey,
            text: autoKey,
            onRenderContent: (item: any) => {
              return (
                <Stack
                  horizontal={true}
                  tokens={{childrenGap: 12}}
                  styles={{root: {margin: 8}}}
                  verticalAlign={"center"}
                >
                  <Stack.Item shrink={1}>
                    <Image
                      width={24}
                      height={24}
                      shouldStartVisible
                      imageFit={ImageFit.centerContain}
                      src={`slices/auto/${autoKey}/${imgSrc.size}/index.${imgSrc.format}`}
                    />
                  </Stack.Item>

                  <Stack.Item shrink={1}>
                    <Text styles={{root: {fontSize: 13}}}>{autoKey}</Text>
                  </Stack.Item>
                </Stack>
              );
            },
          });
        }
      }
      setAutoItems(newAutoItems);
    } else {
      setPresetItems([]);
      setAutoItems([]);
    }
  }, [props.slicesInfo]);

  return (
    <Stack
      styles={{
        root: {
          width: "100%",
          height: "100%",
          paddingLeft: "20px",
          paddingRight: "20px",
          zIndex: 1000,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: getTheme().palette.white,
        },
      }}
      horizontalAlign={"space-between"}
    >
      <Stack.Item
        grow={1}
        styles={{
          root: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            cursor: "pointer",
          },
        }}
      >
        <Stack
          horizontal
          grow={1}
          tokens={{childrenGap: 12}}
          verticalAlign="center"
        >
          <Image
            width="25px"
            height="25px"
            src={"src/logo.png"}
            styles={{
              root: {
                borderRadius: "3px",
              },
            }}
          />
          <Text variant="medium">Gaia Sketch</Text>
        </Stack>
      </Stack.Item>
      <Stack.Item>
        <Stack
          horizontal={true}
          tokens={{childrenGap: 20}}
          verticalAlign={"center"}
        >
          <TextField
            borderless={true}
            styles={deepmerge(TextFieldStyles, {
              field: {
                width: "100px",
                textAlign: "center",
              },
              suffix: {
                cursor: "pointer",
              },
              prefix: {
                cursor: "pointer",
              },
            })}
            readOnly
            value={`缩放 ${Number(zoomScale * 100).toFixed(0)}%`}
            onRenderSuffix={() => {
              return (
                <Icon
                  iconName={"Add"}
                  styles={{
                    root: {
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => {
                    let nextScaleNumber = Number(
                      Math.min(zoomScale + 0.1, 2).toFixed(1)
                    );
                    setZoomScale(nextScaleNumber);
                    setTimeout(() => {
                      props.onZoomScaleDidChange &&
                      props.onZoomScaleDidChange(nextScaleNumber);
                    }, 200);
                  }}
                />
              );
            }}
            onRenderPrefix={() => {
              return (
                <Icon
                  iconName={"Remove"}
                  onClick={() => {
                    let nextScaleNumber = Number(
                      Math.max(0.1, zoomScale - 0.1).toFixed(1)
                    );
                    setZoomScale(nextScaleNumber);
                    setTimeout(() => {
                      props.onZoomScaleDidChange &&
                      props.onZoomScaleDidChange(nextScaleNumber);
                    }, 200);
                  }}
                />
              );
            }}
          />
          <TextField
            borderless={true}
            styles={deepmerge(TextFieldStyles, {
              field: {
                width: "100px",
                textAlign: "center",
              },
            })}
            readOnly
            value={`单位 ${props.unit}`}
          />
          <CommandButton
            iconProps={{iconName: "PictureLibrary"}}
            menuProps={{
              items: [
                {
                  key: "preset",
                  itemType: ContextualMenuItemType.Section,
                  sectionProps: {
                    topDivider: true,
                    bottomDivider: true,
                    title: "设计师预设切图",
                    items: presetItems,
                  },
                },
                {
                  key: "auto",
                  itemType: ContextualMenuItemType.Section,
                  sectionProps: {
                    title: "自动生成切图",
                    items: autoItems,
                  },
                },
              ],
            }}
            styles={{root: {fontSize: 12}, icon: {color: "white"}}}
          />
        </Stack>
      </Stack.Item>
    </Stack>
  );
}
