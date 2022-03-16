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

import {DefaultButton, getTheme, Image, ImageFit, Separator, Stack, Text,} from "@fluentui/react";
import React, {useEffect, useState} from "react";
import {downloadSlice} from "../../helpers/helper";

interface ISliceProps {
  tabName: string;
  layerName: string;
  imgSrcs?: any;
}

export function Slice(props: ISliceProps) {
  const [contents, setContents] = useState([]);

  useEffect(() => {
    if (props.imgSrcs && props.imgSrcs.length > 0) {
      let newContents: any = [];
      for (let index = 0; index < props.imgSrcs.length; index++) {
        const imgSrc = props.imgSrcs[index];
        newContents.push(
          <Stack
            horizontalAlign={"center"}
            verticalAlign={"end"}
            styles={{
              root: {
                padding: "8px",
              },
            }}
          >
            <Image
              width={10 + removeSizeSuffix(imgSrc.size) * 5}
              height={10 + removeSizeSuffix(imgSrc.size) * 5}
              shouldStartVisible
              imageFit={ImageFit.centerContain}
              src={`slices/${props.tabName}/${props.layerName}/${imgSrc.size}/index.${imgSrc.format}`}
            />
            <Text
              styles={{
                root: {
                  color: getTheme().palette.whiteTranslucent40,
                },
              }}
              variant="small"
            >
              {imgSrc.size}
            </Text>
          </Stack>
        );
      }
      setContents(newContents);
    } else {
      setContents([]);
    }
  }, [props.imgSrcs]);

  return (
    <Stack tokens={{childrenGap: 8}}>
      <Text variant="small">{props.tabName}</Text>
      <Stack
        tokens={{childrenGap: 8}}
        horizontal
        horizontalAlign={"space-between"}
        verticalAlign="center"
      >
        <Stack horizontal tokens={{childrenGap: 5}}>
          {contents}
        </Stack>
        <Separator vertical/>
        <DefaultButton
          text="下载"
          styles={{
            root: {height: "24px", minWidth: 0, borderRadius: 3},
            label: {
              fontSize: 10,
              fontWeight: 500,
              borderRadius: 3,
            },
            icon: {
              fontWeight: 500,
            },
          }}
          onClick={() => {
            downloadSlice(
              props.imgSrcs,
              `slices/${props.tabName}/${props.layerName}`,
              props.layerName
            );
          }}
        />
      </Stack>
    </Stack>
  );
}

function removeSizeSuffix(sizeString: string) {
  return Number(sizeString.replace("x", ""));
}
