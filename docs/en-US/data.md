# Data

The data required for the annotation template mainly includes three parts

````json
data.js //Include information such as the relationship between the page and the artboard, unit, slice, Design Token, etc.

artboards/ //Includes layer hierarchy and style information
    xxxxxxxxxx.js
    xxxxxxxxxx@2x.jpg
    yyyyyyyyyy.js
    yyyyyyyyyy@2x.jpg

slices/ // Slicing data, including [designer preset slices] and [automatic slices]
    preset/
    auto/
````

The callout template will first load the required data in the `index.html` file, in the `docs/examples` example:

```html
  <script src="data.js"></script>
  <script src="artboards/2FA2883E-8219-4FF9-8ED5-F0445269EDC6.js"></script>
````

There is only one `data.js` data file, and there can be one or more `artboards/**.js`. Each JS file in the artboards folder represents the exported data of each artboard

##Data.js parsing

Take [docs/examples/data.js](../examples/data.js) as an example

* The relationship between the design draft [page] and [artboard]

````json
window["__ARTBOARDS__"] = {
  "EA798B22-3E36-471F-947C-4B60A73BC25E ": {
    name: "Page 1",
    content: [
      {
        id: "2FA2883E-8219-4FF9-8ED5-F0445269EDC6",
        name: "Palette",
        size: { width: 294, height: 307 },
        backgroundColor: "white",
        thumbnailPath: "2FA2883E-8219-4FF9-8ED5-F0445269EDC6@2x.jpg",
      },
    ],
  },
};
````

* unit

````json
window["__UNIT__"] = "px";
````

* Design Token

  [Design Token library example](../examples/test/design-token.xlsx)

  - rules : Represents a rule, matching a rule is a match, each element in the outermost array represents a rule, and each element is also composed of an array in the relationship of ` or `, the outermost array is `and` relation
  - tokens: means that when the above rules are met, go to the tokens to find the token corresponding to the value

````json
window["__TOKENS__"] = [
  {
    rules: [["color", "background-color", "background-image", "border-color"]],
    tokens: [
      {
        value: ["#00ff00"],
        token: ["primaryColor"],
        code: [
          { platform: "iOS", snippet: "Code Sample" },
          { platform: "Android", snippet: "Code Sample" },
        ],
      },
      {
        value: ["rgba(255,0,0,0.3)"],
        token: ["primaryColorAlpha"],
        code: [
          { platform: "iOS", snippet: "Code Sample" },
          { platform: "Android", snippet: "Code Sample" },
        ],
      },
      {
        value: ["Linear gradient (0-0->1-1->#fb00aa-100%->#fb0000-100%)"],
        token: ["linearGradientColor"],
        code: [
          { platform: "iOS", snippet: "Code Sample" },
          { platform: "Android", snippet: "Code Sample" },
        ],
      },
      {
        value: ["#fafafa"],
        token: [
          "Scenario 1: Fill Color/Primary\r\n(primaryFillColor)",
          "Scenario 2: Fill Color/Secondary\r\n(secondaryFillColor)",
          "Scenario 3: Other\r\n(other_2)",
        ],
        code: [
          { platform: "iOS", snippet: "Code Sample" },
          { platform: "Android", snippet: "Code Sample" },
          { platform: "iOS", snippet: "Code Sample" },
          { platform: "Android", snippet: "Code Sample" },
          { platform: "iOS", snippet: "Code Sample" },
          { platform: "Android", snippet: "Code Sample" },
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
        code: [{ platform: "iOS", snippet: "Code Sample" }],
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
          { platform: "iOS", snippet: "Code Sample" },
          { platform: "Android", snippet: "Code Sample" },
        ],
      },
      {
        value: [5],
        token: ["avator_radius"],
        code: [
          { platform: "iOS", snippet: "Code Sample" },
          { platform: "Android", snippet: "Code Sample" },
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
          { platform: "iOS", snippet: "Code Sample" },
          { platform: "Android", snippet: "Code Sample" },
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
        code: [{ platform: "iOS", snippet: "Code Sample" }],
      },
    ],
  },
];
````



* Cut data file
````json
window["__SLICES_INFOS__"] = {
  "2FA2883E-8219-4FF9-8ED5-F0445269EDC6": { preset: {}, auto: {} },
};
````

## Artboard data JS file parsing

The following starts with [artboards/2FA2883E-8219-4FF9-8ED5-F0445269EDC6.js](../examples/artboards/2FA2883E-8219-4FF9-8ED5-F0445269EDC6.js) from `docs/examples`

Each artboard data JS file contains the layer hierarchy of the current artboard, as well as the style attributes of each layer, etc. These data can be obtained through the Sketch JS API

````json
window["2FA2883E-8219-4FF9-8ED5-F0445269EDC6"] = {
  type: "Artboard",
  id: "2FA2883E-8219-4FF9-8ED5-F0445269EDC6",
  frame: { x: 418, y: 352, width: 294, height: 307 },
  name: "Palette",
  selected: false,
  exportFormats: [],
  sharedStyleId: null,
  layers: [
    {
      type: "Group",
      id: "AF502D62-D880-409E-BA06-E6C68A04598F",
      frame: { x: 52, y: 64, width: 169.5, height: 153 },
      name: "Example",
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
````
