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

import React, {useEffect, useRef, useState} from "react";
import {TitleBar} from "./titlebar/TitleBar";
import {Inspector} from "./inspector/Inspector";
import {Navigator} from "./navigator/Navigator";
import {Preview} from "./preview/Preview";
import {getStyles} from "./helpers/styles";
import {Scrollbars} from "react-custom-scrollbars";

function App() {
  const [dataInfo, setDataInfo] = useState();
  const [selectedArtboard, setSelectedArtboard] = useState(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [clickedLayer, setClickedLayer] = useState(null);

  const artboardScalesRef = useRef(null);

  useEffect(() => {
    let window: any = globalThis.window;
    let newDataInfo: any = {
      pages: window["__ARTBOARDS__"] || {},
      tokens: window["__TOKENS__"],
      slices: window["__SLICES_INFOS__"] || {},
      unit: window["__UNIT__"] || "px",
      artboardSize: Number(
        window.__ARTBOARD_SIZE__ ? window.__ARTBOARD_SIZE__ : 1
      ),
    };
    setDataInfo(newDataInfo);
    let pageKeys = Object.keys(newDataInfo["pages"]);
    if (
      newDataInfo["pages"] &&
      pageKeys.length > 0 &&
      newDataInfo["pages"][pageKeys[0]].content &&
      newDataInfo["pages"][pageKeys[0]].content.length > 0
    ) {
      setSelectedArtboard(newDataInfo["pages"][pageKeys[0]].content[0]);
    }
  }, []);

  useEffect(() => {
    if (artboardScalesRef.current == null) {
      //@ts-ignore
      artboardScalesRef.current = {};
    }
    if (selectedArtboard) {
      let previewWidth = document.body.clientWidth - 100 - 500;
      let previewHeight = document.body.clientHeight - 44;
      let scaleNumber = 1;
      let savedZoomScale = localStorage.getItem(
        //@ts-ignore
        `${selectedArtboard && selectedArtboard.id}-zoomScale`
      );
      if (savedZoomScale) {
        scaleNumber = Number(savedZoomScale);
      } else {
        if (
          //@ts-ignore
          artboardScalesRef.current[String(selectedArtboard.id)] != undefined
        ) {
          //@ts-ignore
          scaleNumber = artboardScalesRef.current[String(selectedArtboard.id)];
        } else {
          let currentZoomWidthScale = 0.1;
          let currentZoomHeightScale = 0.1;
          for (let index = 1; index >= 0.1; index -= 0.1) {
            //@ts-ignore
            if (Number(selectedArtboard.size.width) * index < previewWidth) {
              currentZoomWidthScale = index;
              break;
            }
          }
          for (let index = 1; index >= 0.1; index -= 0.1) {
            //@ts-ignore
            if (Number(selectedArtboard.size.height) * index < previewHeight) {
              currentZoomHeightScale = index;
              break;
            }
          }
          scaleNumber = Number(
            Number(
              Math.min(currentZoomWidthScale, currentZoomHeightScale)
            ).toFixed(1)
          );
        }
      }
      setZoomScale(scaleNumber);
    }
  }, [selectedArtboard]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "rgba(16,16,17)",
      }}
    >
      <div
        style={{
          left: 0,
          right: 0,
          top: 0,
          height: "44px",
          position: "absolute",
        }}
      >
        <TitleBar
          unit={(dataInfo && dataInfo["unit"]) || "px"}
          zoomScale={zoomScale}
          slicesInfo={
            dataInfo &&
            selectedArtboard &&
            dataInfo["slices"] &&
            //@ts-ignore
            dataInfo["slices"][selectedArtboard.id]
          }
          onZoomScaleDidChange={(nextScaleNumber: number) => {
            setZoomScale(nextScaleNumber);
            localStorage.setItem(
              //@ts-ignore
              `${selectedArtboard && selectedArtboard.id}-zoomScale`,
              String(nextScaleNumber)
            );
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          top: "44px",
        }}
      >
        <Scrollbars
          style={{
            width: "240px",
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            backgroundColor: "rgb(25,25,25)",
          }}
          renderThumbVertical={renderThumbVertical}
          renderThumbHorizontal={renderThumbHorizontal}
        >
          <Navigator
            pages={dataInfo && dataInfo["pages"]}
            selectedArtboard={selectedArtboard}
            onDidSelected={(artboard: any) => {
              setSelectedArtboard(artboard);
              setClickedLayer(null);
            }}
          />
        </Scrollbars>
        <div
          style={{
            position: "absolute",
            left: "240px",
            right: "320px",
            top: 0,
            bottom: 0,
          }}
        >
          <Preview
            unit={(dataInfo && dataInfo["unit"]) || "px"}
            selectedArtboard={selectedArtboard}
            zoomScale={zoomScale}
            tokens={dataInfo && dataInfo["tokens"]}
            onDidClickLayer={(layer: any) => {
              setClickedLayer(layer);
            }}
          />
        </div>
        <Scrollbars
          style={{
            width: "320px",
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: "rgb(25,25,25)",
          }}
          renderThumbVertical={renderThumbVertical}
          renderThumbHorizontal={renderThumbHorizontal}
        >
          <Inspector
            layer={clickedLayer}
            tokens={dataInfo && dataInfo["tokens"]}
            styles={getStyles(clickedLayer)}
            unit={(dataInfo && dataInfo["unit"]) || "px"}
            slicesInfo={
              dataInfo &&
              selectedArtboard &&
              dataInfo["slices"] &&
              //@ts-ignore
              dataInfo["slices"][selectedArtboard.id]
            }
          />
        </Scrollbars>
      </div>
    </div>
  );
}

//@ts-ignore
function renderThumbVertical({style, ...props}) {
  return (
    <div
      style={{
        ...style,
        backgroundColor: "#292a2d",
        borderRadius: "4px",
        width: "8px",
      }}
      {...props}
    />
  );
}

//@ts-ignore
function renderThumbHorizontal({style, ...props}) {
  return (
    <div
      style={{
        ...style,
        backgroundColor: "#292a2d",
        borderRadius: "4px",
        minHeight: "8px",
      }}
      {...props}
    />
  );
}

export default App;
