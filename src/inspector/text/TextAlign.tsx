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

import {
  ChoiceGroup,
  IChoiceGroupOption,
  IconButton,
  ITooltipHostStyles,
  Stack,
  Text,
  TooltipHost,
} from "@fluentui/react";
import React, {useEffect, useState} from "react";
import {GChoiceOptionStyles, GChoiceStyles} from "../../helpers/styles";

interface ITextAlignProps {
  layer: any;
  tokens: any;
  unit: string;
  styles: any;
}

export function TextAlign(props: ITextAlignProps) {
  const [alignment, setAlignment] = useState("left");

  useEffect(() => {
    if (props.styles["text-align"]) {
      setAlignment(props.styles["text-align"]);
    } else {
      setAlignment("left");
    }
  }, [props.styles]);

  return (
    <Stack tokens={{childrenGap: 5}}>
      <Text variant="smallPlus">对齐方式</Text>
      <ChoiceGroup
        selectedKey={alignment}
        options={HorizontalTextAlignmentOptions}
        styles={GChoiceStyles}
      />
    </Stack>
  );
}

const onRenderField = (opt: IChoiceGroupOption) => {
  return (
    <TooltipHost
      content={getTitleByFlexTextAlign(opt.text)}
      calloutProps={calloutProps}
      styles={hostStyles}
    >
      <IconButton
        iconProps={{
          iconName: opt.text,
          styles: {
            root: {
              color: "white",
            },
          },
        }}
        styles={{
          root: {
            height: "24px",
            width: "32px",
          },
        }}
        // @ts-ignore
        checked={opt.checked}
      />
    </TooltipHost>
  );
};

export const HorizontalTextAlignmentOptions: any = [
  {
    key: "left",
    name: "居左",
    text: "AlignLeft",
    onRenderField,
    styles: GChoiceOptionStyles,
  },
  {
    key: "center",
    name: "居中",
    text: "AlignCenter",
    onRenderField,
    styles: GChoiceOptionStyles,
  },
  {
    key: "right",
    name: "居右",
    text: "AlignRight",
    onRenderField,
    styles: GChoiceOptionStyles,
  },
];

function getTitleByFlexTextAlign(text: string) {
  let title = "";
  if (text == "Separator") {
    title = "垂直居中对齐";
  } else if (text == "Download") {
    title = "垂直底部对齐";
  } else if (text == "Upload") {
    title = "垂直顶部对齐";
  } else if (text == "AlignLeft") {
    title = "居左";
  } else if (text == "AlignCenter") {
    title = "居中";
  } else if (text == "AlignRight") {
    title = "居右";
  }
  return title;
}

const calloutProps = {gapSpace: 0};
const hostStyles: Partial<ITooltipHostStyles> = {
  root: {display: "inline-block"},
};
