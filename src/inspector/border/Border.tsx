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
  FocusZone,
  getTheme,
  IChoiceGroupOption,
  IconButton,
  ITooltipHostStyles,
  Separator,
  Stack,
  Text,
  TextField,
  TooltipHost,
} from "@fluentui/react";
import React, {useEffect, useState} from "react";
import {InspectorStyle} from "../../helpers/CONSTANTS";
import {GChoiceOptionStyles, GChoiceStyles, SeparatorStyles, TextFieldStyles,} from "../../helpers/styles";
import {BorderFill} from "../fill/BorderFill";

interface IBorderProps {
  layer: any;
  tokens: any;
  styles: any;
  unit: string;
}

enum BorderType {
  Unknown = "unknown",
  Color = "color",
  Gradient = "gradient",
}

enum BorderPosition {
  Center = "center",
  Inner = "inner",
  Outer = "outer",
}

const calloutProps = {gapSpace: 0};
const hostStyles: Partial<ITooltipHostStyles> = {
  root: {display: "inline-block"},
};

function getTitleByBorder(text: string) {
  let title = "";
  if (text == "inherit") {
    title = "居中";
  } else if (text == "border-box") {
    title = "内部";
  } else if (text == "content-box") {
    title = "外部";
  }
  return title;
}

const onRenderField = (opt: IChoiceGroupOption) => {
  return (
    <TooltipHost
      content={getTitleByBorder(opt.text)}
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

export const BorderPositionOptions: any = [
  {
    key: "inner",
    name: "内部",
    text: "border-box",
    onRenderField,
    styles: GChoiceOptionStyles,
  },
  {
    key: "center",
    name: "居中",
    text: "inherit",
    onRenderField,
    styles: GChoiceOptionStyles,
  },
  {
    key: "outer",
    name: "外部",
    text: "content-box",
    onRenderField,
    styles: GChoiceOptionStyles,
  },
];

export function Border(props: IBorderProps) {
  const [borderType, setBorderType] = useState(BorderType.Unknown);
  const [borderPosition, setBorderPosition] = useState(BorderPosition.Outer);

  useEffect(() => {
    if (props.styles["border-image"]) {
      setBorderType(BorderType.Gradient);
    } else if (props.styles["border-color"]) {
      setBorderType(BorderType.Color);
    } else {
      setBorderType(BorderType.Unknown);
    }

    if (props.styles["box-sizing"] == "inherit") {
      setBorderPosition(BorderPosition.Center);
    } else if (props.styles["box-sizing"] == "border-box") {
      setBorderPosition(BorderPosition.Inner);
    } else if (props.styles["box-sizing"] == "content-box") {
      setBorderPosition(BorderPosition.Outer);
    }
  }, [props.layer, props.styles]);

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
          边框
        </Text>
        <Separator styles={SeparatorStyles}/>
        {props.styles["border-width"] != undefined ? (
          <TextField
            readOnly
            label={"宽度"}
            borderless={true}
            styles={TextFieldStyles}
            suffix={props.unit}
            value={String(props.styles["border-width"])}
          />
        ) : null}
        {borderType != BorderType.Unknown ? <BorderFill {...props} /> : null}
        {borderType != BorderType.Unknown ? (
          <ChoiceGroup
            selectedKey={borderPosition}
            options={BorderPositionOptions}
            styles={GChoiceStyles}
          />
        ) : null}
      </Stack>
    </FocusZone>
  );
}
