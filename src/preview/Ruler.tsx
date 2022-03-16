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

import {getTheme} from "@fluentui/react";
import React from "react";

interface IRulerProps {
  id?: string;
}

export enum RulerDirection {
  Horizontal = "row",
  Vertical = "column",
}

export function Ruler(props: IRulerProps) {
  return (
    <div
      style={{
        position: "absolute",
        zIndex: 211,
        pointerEvents: "none",
        display: "flex",
      }}
      id={props.id}
    >
      <div
        id={`${props.id + "ruler-left"}`}
        style={{
          position: "absolute",
          backgroundColor: getTheme().palette.themePrimary,
        }}
      />
      <div
        id={`${props.id + "ruler"}`}
        style={{
          backgroundColor: getTheme().palette.themePrimary,
          position: "absolute",
        }}
      />
      <div
        id={`${props.id + "ruler-right"}`}
        style={{
          backgroundColor: getTheme().palette.themePrimary,
          position: "absolute",
        }}
      />
    </div>
  );
}
