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

import React, {useEffect, useState} from "react";
import {getTheme, Image, ImageFit, INavLink, INavStyles, Nav, Stack,} from "@fluentui/react";
import "./Navigator.css";

interface INavigatorProps {
  pages?: any;
  selectedArtboard?: any;
  onDidSelected?: any;
}

export function Navigator(props: INavigatorProps) {
  const [linkGroups, setLinkGroups] = useState(null);
  const [selectedArtboard, setSelectedArtboard] = useState(
    props.selectedArtboard
  );

  useEffect(() => {
    let groups: any = [];
    if (props.pages) {
      let pageKeys = Object.keys(props.pages);
      for (let i = 0; pageKeys && i < pageKeys.length; i++) {
        let pageKey = pageKeys[i];
        let artboards: any = props.pages[pageKey].content;
        let links: any = [];
        for (let j = 0; j < artboards.length; j++) {
          let art = artboards[j];
          links.push({
            key: art.id,
            name: art.name,
            userData: art,
          });
        }
        groups.push({
          name: props.pages[pageKey].name,
          links: links,
        });
      }
    }
    setLinkGroups(groups);
  }, [props.pages]);

  useEffect(() => {
    setSelectedArtboard(props.selectedArtboard);
  }, [props.selectedArtboard]);

  return (
    <Nav
      className="navigator-class"
      selectedKey={selectedArtboard && selectedArtboard.id}
      styles={navStyles}
      groups={linkGroups}
      onLinkClick={(event: any, item?: INavLink) => {
        setSelectedArtboard(item && item.userData);
        props.onDidSelected && props.onDidSelected(item && item.userData);
      }}
      onRenderLink={(link?: INavLink) => {
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Stack
              horizontal={true}
              tokens={{childrenGap: 12}}
              styles={{
                root: {paddingLeft: 20, paddingRight: 20},
              }}
              verticalAlign={"center"}
            >
              <Image
                height="45px"
                width="40px"
                imageFit={ImageFit.centerCover}
                loading={"lazy"}
                styles={{
                  root: {
                    borderRadius: "2px",
                    backgroundColor: "rgb(55,55,55)",
                    boxShadow: getTheme().effects.elevation8,
                  },
                }}
                src={link && `artboards/${link.userData.thumbnailPath}`}
              />
              <div
                className={"two-line-text-class"}
                style={{
                  lineHeight: "20px",
                  textAlign: "left",
                  fontSize: "13px",
                  cursor: "pointer",
                  width: "150px",
                  whiteSpace: "normal",
                }}
              >
                {link && link.name}
              </div>
            </Stack>
          </div>
        );
      }}
    />
  );
}

const navStyles: Partial<INavStyles> = {
  groupContent: {
    marginBottom: 0,
  },
  chevronButton: {
    fontSize: "13px",
  },
  chevronIcon: {
    fontSize: "12px",
  },
  link: {
    paddingLeft: 0,
    paddingRight: 0,
    height: "70px",
  },
};
