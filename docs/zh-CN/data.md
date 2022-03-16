# 数据

标注模板所需的数据主要包括三个部分

```json
data.js  //包括页面和画板的关系、单位、切图、Design Token等信息

artboards/ //包括图层层级结构和样式信息
    xxxxxxxxxx.js
    xxxxxxxxxx@2x.jpg
    yyyyyyyyyy.js
    yyyyyyyyyy@2x.jpg

slices/ // 切图数据，包括设【计师预设切图】和【自动切图】
    preset/
    auto/
```

标注模板首先会在`index.html`文件中去加载所需的数据，在 `docs/examples` 例子中：

```html
  <script src="data.js"></script>
  <script src="artboards/2FA2883E-8219-4FF9-8ED5-F0445269EDC6.js"></script>
```

`data.js` 数据文件有且只会有一个，`artboards/**.js` 可以有一个或者多个，artboards文件夹下的每个JS文件代表导出的每个画板的数据

## Data.js解析

以 [docs/examples/data.js](../examples/data.js) 为例

* 设计稿【页面】和【画板】的关系

```json
window["__ARTBOARDS__"] = {
  "EA798B22-3E36-471F-947C-4B60A73BC25E ": {
    name: "页面 1",
    content: [
      {
        id: "2FA2883E-8219-4FF9-8ED5-F0445269EDC6",
        name: "画板",
        size: { width: 294, height: 307 },
        backgroundColor: "white",
        thumbnailPath: "2FA2883E-8219-4FF9-8ED5-F0445269EDC6@2x.jpg",
      },
    ],
  },
};
```

* 单位

```json
window["__UNIT__"] = "px";
```

* Design Token

  [Design Token库示例](../examples/test/design-token.xlsx)

  - rules : 代表规则，符合规则即为匹配，最外层数组中的每个元素代表一个规则，每个元素也由数组组成为 `或` 的关系，最外层的数组是 `且` 的关系
  - tokens：代表当符合以上规则是，就去tokens中寻找值对应的token

```json
window["__TOKENS__"] = [
  {
    rules: [["color", "background-color", "background-image", "border-color"]],
    tokens: [
      {
        value: ["#00ff00"],
        token: ["primaryColor"],
        code: [
          { platform: "iOS", snippet: "代码示例" },
          { platform: "Android", snippet: "代码示例" },
        ],
      },
      {
        value: ["rgba(255,0,0,0.3)"],
        token: ["primaryColorAlpha"],
        code: [
          { platform: "iOS", snippet: "代码示例" },
          { platform: "Android", snippet: "代码示例" },
        ],
      },
      {
        value: ["线性渐变(0-0->1-1->#fb00aa-100%->#fb0000-100%)"],
        token: ["linearGradientColor"],
        code: [
          { platform: "iOS", snippet: "代码示例" },
          { platform: "Android", snippet: "代码示例" },
        ],
      },
      {
        value: ["#fafafa"],
        token: [
          "场景1：填充色/一级\r\n(primaryFillColor)",
          "场景2：填充色/二级\r\n(secondaryFillColor)",
          "场景3：其他\r\n（other_2）",
        ],
        code: [
          { platform: "iOS", snippet: "代码示例" },
          { platform: "Android", snippet: "代码示例" },
          { platform: "iOS", snippet: "代码示例" },
          { platform: "Android", snippet: "代码示例" },
          { platform: "iOS", snippet: "代码示例" },
          { platform: "Android", snippet: "代码示例" },
        ],
      },
    ],
  },
  {
    rules: [["font-size"], ["font-weight"]],
    tokens: [
      {
        value: [18, 500],
        token: ["main_title"],
        code: [{ platform: "iOS", snippet: "代码示例" }],
      },
    ],
  },
  { rules: [["font-family"]] },
  {
    rules: [["border-radius"]],
    tokens: [
      {
        value: ["50%"],
        token: ["circle"],
        code: [
          { platform: "iOS", snippet: "代码示例" },
          { platform: "Android", snippet: "代码示例" },
        ],
      },
      {
        value: [5],
        token: ["avator_radius"],
        code: [
          { platform: "iOS", snippet: "代码示例" },
          { platform: "Android", snippet: "代码示例" },
        ],
      },
    ],
  },
  {
    rules: [
      ["margin", "margin-left", "margin-top", "margin-right", "margin-bottom"],
    ],
    tokens: [
      {
        value: [12],
        token: ["margin_left"],
        code: [
          { platform: "iOS", snippet: "代码示例" },
          { platform: "Android", snippet: "代码示例" },
        ],
      },
    ],
  },
  {
    rules: [["width"], ["height"]],
    tokens: [
      {
        value: [33, 40],
        token: ["avator_size"],
        code: [{ platform: "iOS", snippet: "代码示例" }],
      },
    ],
  },
];
```



* 切图数据文件
```json
window["__SLICES_INFOS__"] = {
  "2FA2883E-8219-4FF9-8ED5-F0445269EDC6": { preset: {}, auto: {} },
};
```

## 画板数据JS文件解析

以下以 `docs/examples` 中的 [artboards/2FA2883E-8219-4FF9-8ED5-F0445269EDC6.js](../examples/artboards/2FA2883E-8219-4FF9-8ED5-F0445269EDC6.js)

每个画板数据JS文件中包含了当前画板的图层层级结构，以及每个图层的样式属性等，通过Sketch JS API 可以获取这些数据

```json
window["2FA2883E-8219-4FF9-8ED5-F0445269EDC6"] = {
  type: "Artboard",
  id: "2FA2883E-8219-4FF9-8ED5-F0445269EDC6",
  frame: { x: 418, y: 352, width: 294, height: 307 },
  name: "画板",
  selected: false,
  exportFormats: [],
  sharedStyleId: null,
  layers: [
    {
      type: "Group",
      id: "AF502D62-D880-409E-BA06-E6C68A04598F",
      frame: { x: 52, y: 64, width: 169.5, height: 153 },
      name: "示例",
      selected: false,
      hidden: false,
      locked: false,
      exportFormats: [],
      transform: {
        rotation: 0,
        flippedHorizontally: false,
        flippedVertically: false,
      },
    ...
    }
    ...
  ]
}
```
