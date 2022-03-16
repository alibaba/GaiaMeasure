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

import tinycolor from "tinycolor2";

export function isColor(color: any) {
  let colorFlag = false;
  if (color != undefined) {
    let colorString = String(color);
    if (
      colorString.indexOf("#") == 0 ||
      colorString.indexOf("rgb") == 0 ||
      colorString.indexOf("rgba") == 0
    ) {
      colorFlag = true;
    }
  }
  return colorFlag;
}

export function getSingleAttributeTokens(
  data: any,
  attributeName: any,
  compareValue: any,
  layerName?: string
) {
  let resultToken: any, resultCode: any;
  let result: any = [];
  for (let index = 0; attributeName && data && index < data.length; index++) {
    const {rules, tokens} = data[index];
    if (rules == undefined || tokens == undefined) {
      continue;
    }
    for (
      let ruleIndex = 0;
      rules.length == 1 && ruleIndex < rules[0].length;
      ruleIndex++
    ) {
      const rule = rules[0][ruleIndex];
      if (rule == attributeName) {
        result = [...result, ...tokens];
        break;
      }
    }
  }

  let compareValueArray = [compareValue];
  for (let index = 0; result && index < result.length; index++) {
    const {value, token, code} = result[index];
    if (value && compareValueArray) {
      if (value.length == compareValueArray.length) {
        let same = false;
        for (
          let compareIndex = 0;
          compareIndex < compareValueArray.length;
          compareIndex++
        ) {
          const compare = compareValueArray[compareIndex];
          if (compare != undefined && value[compareIndex] != undefined) {
            if (isColor(compare) && isColor(value[compareIndex])) {
              let color1 = tinycolor(compare);
              let color2 = tinycolor(value[compareIndex]);
              if (color1.isValid() && color2.isValid()) {
                if (color1.toRgbString() == color2.toRgbString()) {
                  same = true;
                  break;
                }
              }
            } else {
              if (
                String(compare).toLocaleLowerCase() ==
                String(value[compareIndex]).toLocaleLowerCase()
              ) {
                same = true;
                break;
              } else {
                let nospace1 = String(compare).replace(/ /g, "");
                let nospace2 = String(value[compareIndex]).replace(/ /g, "");
                if (
                  String(nospace1).toLocaleLowerCase() ==
                  String(nospace2).toLocaleLowerCase()
                ) {
                  same = true;
                  break;
                }
              }
            }
          }
        }
        if (same) {
          if (token && token.length > 0) {
            resultToken = [...token];
          }
          if (code && code.length > 0) {
            resultCode = [...code];
          }
          break;
        }
      }
    }
  }
  if (layerName && resultToken && resultToken.length > 1) {
    let regex = new RegExp(/[(（]token[:：].*[)）]/);
    let match = layerName.match(regex);
    let preferredToken: any;
    if (match && match.length > 0) {
      preferredToken =
        match[0].length > 7 ? match[0].substring(7, match[0].length - 1) : "";
      if (preferredToken.indexOf("|") != -1) {
        let splitToken = preferredToken
          .split("|")
          .map((str: any) => str.trim());
        if (splitToken.length >= 2) {
          preferredToken = splitToken;
        }
      } else if (preferredToken.indexOf("|") != -1) {
        let splitToken = preferredToken
          .split("|")
          .map((str: any) => str.trim());
        if (splitToken.length >= 2) {
          preferredToken = splitToken;
        }
      }
    }
    if (preferredToken) {
      for (let index = 0; index < resultToken.length; index++) {
        const element = resultToken[index];
        if (isTokenInElement(element, preferredToken)) {
          resultToken = [element];
          break;
        }
      }
    }
  }
  return [resultToken, resultCode];
}

function isTokenInElement(element: string, token: any) {
  if (token) {
    if (token instanceof Array) {
      for (let index = 0; index < token.length; index++) {
        const subtoken = token[index];
        if (element.indexOf(subtoken) != -1) {
          return true;
        }
      }
    } else {
      if (element.indexOf(String(token)) != -1) {
        return true;
      }
    }
  }
  return false;
}

export function getMultiTokens(data: any, attributeStyles: any) {
  let matchRules: any;
  let handledAttributeStyles: any;
  if (attributeStyles && Object.keys(attributeStyles).length > 0) {
    handledAttributeStyles = {...attributeStyles};
  }
  for (let index = 0; attributeStyles && data && index < data.length; index++) {
    const {rules, tokens} = data[index];
    if (rules == undefined || tokens == undefined) {
      continue;
    }
    let matchs = [];
    if (rules.length > 1) {
      let found = true;
      for (let ruleIndex = 0; ruleIndex < rules.length; ruleIndex++) {
        const rule = rules[ruleIndex];
        let match = false;
        for (let matchIndex = 0; matchIndex < rule.length; matchIndex++) {
          const element = rule[matchIndex];
          if (attributeStyles[element]) {
            match = true;
            delete handledAttributeStyles[element];
            matchs.push({
              name: element,
              value: attributeStyles[element],
            });
            break;
          }
        }
        if (!match) {
          found = false;
        }
      }
      if (found) {
        if (matchRules == undefined) {
          matchRules = [];
        }
        matchRules.push({
          rules: matchs,
          data: tokens,
        });
      }
    }
  }
  if (
    matchRules &&
    matchRules.length > 0 &&
    Object.keys(handledAttributeStyles).length > 0
  ) {
    let tmpRules = getMultiTokens(data, handledAttributeStyles);
    if (tmpRules && tmpRules.length > 0) {
      matchRules = matchRules.concat(tmpRules);
    }
  }
  return matchRules;
}

export function getMultiAttributeToken(data: any, rules: any) {
  for (let index = 0; data && index < data.length; index++) {
    const item = data[index];
    if (item.value && item.value.length == rules.length) {
      let match = true;
      for (let itemIndex = 0; itemIndex < item.value.length; itemIndex++) {
        const valueItem = item.value[itemIndex];
        if (
          String(valueItem).toLocaleLowerCase() !=
          String(rules[itemIndex].value).toLocaleLowerCase()
        ) {
          match = false;
          break;
        }
      }
      if (match) {
        let result = [];
        if (item.token) {
          result.push([...item.token]);
        }
        if (item.code) {
          result.push([...item.code]);
        }
        return result;
      }
    }
  }
  return [];
}
