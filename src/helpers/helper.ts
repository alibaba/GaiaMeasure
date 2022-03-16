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

import JSZip from "jszip";
import axios from "axios";
import FileSaver from "file-saver";

export function downloadSlice(attributes: any, linkDir: string, name: string) {
  let zip = new JSZip();
  let links: any = [];
  let formats: any = [];
  let sizes: any = [];
  attributes &&
  attributes.forEach((attribute: any) => {
    links.push(`${linkDir}/${attribute.size}/index.${attribute.format}`);
  });
  attributes &&
  attributes.forEach((attribute: any) => {
    formats.push(`${attribute.format}`);
  });
  attributes &&
  attributes.forEach((attribute: any) => {
    sizes.push(`${attribute.size}`);
  });

  let promises: any = [];
  let alertError = false;
  for (let index = 0; index < links.length; index++) {
    const link = links[index];
    promises.push(
      getFile(link)
        .then((data: any) => {
          const arr_name = link.split("/");
          if (arr_name && arr_name.length > 2) {
            let file_name = `${name}@${sizes[index]}.${formats[index]}`;
            zip.file(file_name, data, {
              binary: true,
            });
          }
        })
        .catch((error) => {
          if (!alertError) {
            alertError = true;
            alert(
              `从本地文件夹打开标注文件时由于跨域的限制无法直接下载切图，请手动前往本地标注文件夹中的【${linkDir}】目录下查看`
            );
          }
        })
    );
  }
  Promise.all(promises).then(() => {
    zip
      .generateAsync({
        type: "blob",
      })
      .then((content) => {
        // 生成二进制流
        FileSaver.saveAs(content, name); // 利用file-saver保存文件
      });
  });
}

function getFile(url: string) {
  return new Promise((resolve, reject) => {
    axios({
      method: "get",
      url,
      responseType: "arraybuffer",
    })
      .then((data) => {
        resolve(data.data);
      })
      .catch((error) => {
        reject(error.toString());
      });
  });
}
