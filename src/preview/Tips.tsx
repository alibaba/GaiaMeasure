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

import {getTheme, Stack} from "@fluentui/react";
import React from "react";

interface ITipsProps {
  id: string;
}

export function Tips(props: ITipsProps) {
  return (
    <Stack
      id={props.id}
      styles={{
        root: {
          position: "absolute",
          zIndex: 213,
          backgroundColor: getTheme().palette.themePrimary,
          pointerEvents: "none",
          borderRadius: "4px",
          paddingTop: "2px",
          paddingBottom: "2px",
          paddingLeft: "5px",
          paddingRight: "5px",
        },
      }}
      tokens={{childrenGap: 3}}
    >
      <div
        id={`${props.id}-value`}
        style={{color: "white", fontSize: "12px", textAlign: "center"}}
      />
      <div
        id={`${props.id}-middle`}
        style={{backgroundColor: "#ffffff80", height: "1px"}}
      />
      <div
        id={`${props.id}-token`}
        style={{color: "white", fontSize: "12px", textAlign: "center"}}
      />
    </Stack>
  );
}
