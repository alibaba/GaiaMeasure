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
  Callout,
  FontWeights,
  getTheme,
  mergeStyleSets,
  SelectableOptionMenuItemType,
  Separator,
  Stack,
  Text,
  TextField,
} from "@fluentui/react";
import React, {useEffect, useState} from "react";
import tinycolor from "tinycolor2";
import {TextFieldStyles} from "../../helpers/styles";
import deepmerge from "deepmerge";
import {useBoolean} from "@fluentui/react-hooks";
import {getSingleAttributeTokens} from "../../helpers/tokens";

interface IColourProps {
  colourString: string;
  tokens: any;
  hideLabel?: boolean;
  layer: any;
  noToken?: boolean;
}

export function Colour(props: IColourProps) {
  const [colourValue, setColourValue] = useState("");
  const [isCalloutVisible, {toggle: toggleIsCalloutVisible}] =
    useBoolean(false);
  const [hexColourString, setHexColourString] = useState("");
  const [rgbColourString, setRgbColourString] = useState("");
  const [hslColourString, setHslColourString] = useState("");
  const [hsvColourString, setHsvColourString] = useState("");
  const [descriptions, setDescriptions] = useState([]);

  useEffect(() => {
    if (props.colourString) {
      let color = tinycolor(props.colourString);
      if (color.isValid()) {
        let options: any = [];
        options.push({
          key: "#rgb",
          text: "#RRGGBB[AA]",
          itemType: SelectableOptionMenuItemType.Header,
        });
        if (color.getAlpha() != 1) {
          setColourValue(color.toHex8String());
        } else {
          setColourValue(color.toHexString());
        }
      }
    }
  }, [props.colourString]);

  useEffect(() => {
    if (props.colourString) {
      let color = tinycolor(props.colourString);
      if (color.isValid()) {
        if (color.getAlpha() != 1) {
          setHexColourString(color.toHex8String());
        } else {
          setHexColourString(color.toHexString());
        }
        setRgbColourString(color.toRgbString());
        setHslColourString(color.toHslString());
        setHsvColourString(color.toHsvString());
      }
    }
  }, [props.colourString]);

  useEffect(() => {
    if (!props.noToken) {
      let [matchedToken, matchedCode] = getSingleAttributeTokens(
        props.tokens,
        "color",
        colourValue,
        props.layer ? props.layer.name : undefined
      );
      setDescriptions(matchedToken || []);
    }
  }, [colourValue]);

  return (
    <>
      <Stack horizontal tokens={{childrenGap: 8}} verticalAlign={"start"}>
        <Stack.Item grow={1}>
          <TextField
            id={"color-field"}
            label={props.hideLabel ? "" : "颜色格式：#RRGGBB[AA]"}
            readOnly={true}
            borderless={true}
            value={colourValue}
            styles={deepmerge(TextFieldStyles, {
              suffix: {
                paddingLeft: 0,
                paddingRight: 0,
              },
            })}
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
            onRenderSuffix={() => {
              return (
                <div onClick={toggleIsCalloutVisible}>
                  <TextField
                    readOnly={true}
                    borderless={true}
                    styles={deepmerge(TextFieldStyles, {
                      root: {
                        cursor: "pointer",
                      },
                      field: {
                        cursor: "pointer",
                      },
                      fieldGroup: {
                        width: "32px",
                        cursor: "pointer",
                        backgroundColor: props.colourString,
                        borderWidth: "1px",
                        borderColor: `${tinycolor(props.colourString)
                          .lighten()
                          .setAlpha(70)}`,
                        borderStyle: "solid",
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                      },
                    })}
                  />
                </div>
              );
            }}
          />
        </Stack.Item>
      </Stack>
      {isCalloutVisible ? (
        <Callout
          className={styles.callout}
          gapSpace={0}
          target={`#color-field`}
          onDismiss={toggleIsCalloutVisible}
          setInitialFocus
        >
          <Stack tokens={{childrenGap: 12}}>
            <Stack tokens={{childrenGap: 5}}>
              <Text
                styles={{root: {color: getTheme().palette.themeDark}}}
              >{`HEX: #RRGGBB[AA]`}</Text>
              <Text>{hexColourString}</Text>
            </Stack>
            <Separator/>
            <Stack tokens={{childrenGap: 5}}>
              <Text
                styles={{root: {color: getTheme().palette.themeDark}}}
              >{`RGB: RGB[A]`}</Text>
              <Text>{rgbColourString}</Text>
            </Stack>
            <Separator/>
            <Stack tokens={{childrenGap: 5}}>
              <Text
                styles={{root: {color: getTheme().palette.themeDark}}}
              >{`HSL`}</Text>
              <Text>{hslColourString}</Text>
            </Stack>
            <Separator/>
            <Stack tokens={{childrenGap: 5}}>
              <Text
                styles={{root: {color: getTheme().palette.themeDark}}}
              >{`HSV`}</Text>
              <Text>{hsvColourString}</Text>
            </Stack>
          </Stack>
        </Callout>
      ) : null}
    </>
  );
}

const styles = mergeStyleSets({
  button: {
    width: 130,
  },
  callout: {
    width: 320,
    maxWidth: "90%",
    padding: "20px 24px",
  },
  title: {
    marginBottom: 12,
    fontWeight: FontWeights.semilight,
  },
  link: {
    display: "block",
    marginTop: 20,
  },
});
