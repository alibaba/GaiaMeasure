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

import {FocusZone, getTheme, Separator, Stack, Text, TextField,} from "@fluentui/react";
import React, {useEffect, useState} from "react";
import {InspectorStyle} from "../../helpers/CONSTANTS";
import {getFixedValue, SeparatorStyles, TextFieldStyles,} from "../../helpers/styles";
import {getSingleAttributeTokens} from "../../helpers/tokens";

interface IRadiusProps {
  layer: any;
  tokens: any;
  styles: any;
  unit: any;
}

enum RadiusType {
  Equal,
  NotEqual,
}

export function Radius(props: IRadiusProps) {
  const [borderRadius, setBorderRadius] = useState(-1);
  const [radiusType, setRadiusType] = useState(RadiusType.Equal);
  const [radiusTopLeft, setRadiusTopLeft] = useState(0);
  const [radiusTopRight, setRadiusTopRight] = useState(0);
  const [radiusBottomLeft, setRadiusBottomLeft] = useState(0);
  const [radiusBottomRight, setRadiusBottomRight] = useState(0);
  const [descriptions, setDescriptions] = useState([]);

  useEffect(() => {
    if (props.styles) {
      let borderRadius = props.styles["border-radius"];
      if (borderRadius != undefined) {
        if (isNaN(Number(borderRadius))) {
          let split = borderRadius.split(",").map((value: string) => {
            return value.trim();
          });
          setRadiusType(RadiusType.NotEqual);
          if (split && split.length == 4) {
            setRadiusTopLeft(Number(split[0]));
            setRadiusTopRight(Number(split[1]));
            setRadiusBottomRight(Number(split[2]));
            setRadiusBottomLeft(Number(split[3]));
          }
        } else {
          setBorderRadius(borderRadius);
        }
      } else {
        setBorderRadius(-1);
      }
    }
  }, [props.layer, props.styles, props.unit]);

  useEffect(() => {
    if (borderRadius >= 0) {
      let [matchedToken, matchedCode] = getSingleAttributeTokens(
        props.tokens,
        "border-radius",
        borderRadius,
        props.layer ? props.layer.name : undefined
      );
      setDescriptions(matchedToken || []);
    }
  }, [borderRadius]);

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
          圆角
        </Text>
        <Separator styles={SeparatorStyles}/>
        {borderRadius >= 0 && radiusType == RadiusType.Equal ? (
          <TextField
            readOnly
            borderless={true}
            styles={TextFieldStyles}
            suffix={props.unit}
            value={String(getFixedValue(borderRadius))}
            onRenderDescription={() => {
              return (
                <Text
                  variant={"tiny"}
                  styles={{
                    root: {
                      whiteSpace: "pre-line",
                      color:
                        descriptions.length == 1
                          ? getTheme().palette.themePrimary
                          : getTheme().palette.yellow,
                      fontSize: "12px",
                      marginTop: descriptions ? 5 : 0,
                    },
                  }}
                >
                  {descriptions
                    .map((value: string) => {
                      return value.replace("\r\n", " ");
                    })
                    .join("\r\n")}
                </Text>
              );
            }}
          />
        ) : radiusType == RadiusType.NotEqual ? (
          <Stack tokens={{childrenGap: 5}}>
            <Stack horizontal={true} tokens={{childrenGap: 8}}>
              <TextField
                readOnly
                label={"左上"}
                borderless={true}
                styles={TextFieldStyles}
                suffix={props.unit}
                value={String(getFixedValue(radiusTopLeft))}
              />
              <TextField
                readOnly
                label={"右上"}
                borderless={true}
                styles={TextFieldStyles}
                suffix={props.unit}
                value={String(getFixedValue(radiusTopRight))}
              />
            </Stack>
            <Stack horizontal={true} tokens={{childrenGap: 8}}>
              <TextField
                readOnly
                label={"左下"}
                borderless={true}
                styles={TextFieldStyles}
                suffix={props.unit}
                value={String(getFixedValue(radiusBottomLeft))}
              />
              <TextField
                readOnly
                borderless={true}
                label={"右下"}
                styles={TextFieldStyles}
                suffix={props.unit}
                value={String(getFixedValue(radiusBottomRight))}
              />
            </Stack>
          </Stack>
        ) : null}
      </Stack>
    </FocusZone>
  );
}
