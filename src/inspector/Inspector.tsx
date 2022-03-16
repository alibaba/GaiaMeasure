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

import {Stack} from "@fluentui/react";
import React from "react";
import {Border} from "./border/Border";
import {Property} from "./property/Property";
import {Shadow} from "./shadow/Shadow";
import {Size} from "./size/Size";
import {TextD} from "./text/TextD";
import {Blur} from "./blur/Blur";
import {Radius} from "./radius/Radius";
import "./Inspector.css";
import {Code} from "./code/Code";
import {Combine} from "./combine/Combine";
import {ShapeFill} from "./fill/ShapeFill";

interface IInspectorProps {
  layer: any;
  tokens: any;
  unit: string;
  styles: any;
  slicesInfo: any;
}

export function Inspector(props: IInspectorProps) {
  return (
    <Stack>
      <Property {...props} />
      <Combine {...props} />
      <Size {...props} />
      <Code {...props} />
      {props.layer && props.layer.type != "Text" ? <Radius {...props} /> : null}
      {props.layer && props.layer.type == "Text" ? <TextD {...props} /> : null}
      {props.layer && props.layer.type != "Text" ? (
        <ShapeFill {...props} />
      ) : null}
      <Border {...props} />
      <Shadow {...props} />
      <Blur {...props} />
    </Stack>
  );
}
