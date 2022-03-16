# Measure Template

## Introduction

This library is part of [Export Measure] in [Sketch Plugin](https://github.com/alibaba/GaiaSketch). Through this project, annotation templates are generated. The product is integrated in the designer plugin, and the design is exported through the plugin and the plugin. The data of the manuscript is generated, and the annotation file for development reference is generated.

[YuQue](https://www.yuque.com/youku-gaia/gaia-measure)

The overall structure of the project is based on [Create React App](https://github.com/facebook/create-react-app), and the interface is based on [FluentUI](https://github.com/microsoft/fluentui)

[Annotation example](./docs/examples/)


## Features

* Supports the Design Token library defined by Plugin, as well as the Design Token that displays the specific properties of the selected layer
* Clearer annotation interface
* Support to view the CSS style of the selected layer

## Data Format

* [Data](./docs/data.md)

## Features

* [Property](./docs/en-US/property.md)
* [Size](./docs/en-US/size.md)
* [Background](./docs/en-US/fill.md)
* [Border](./docs/en-US/border.md)
* [Shadow](./docs/en-US/shadow.md)
* [Design Token](./docs/en-US/token.md)
* [Code](./docs/en-US/code.md)
* [Slice](./docs/en-US/slice.md)
* [Font](./docs/en-US/font.md)
* [Blur](./docs/en-US/blur.md)

## Development

### Install dependencies

````sh
npm run install
````
or
````sh
yarn
````

### Start the service

````sh
npm run start
````
or
````sh
yarn start
````

### Compile

````sh
npm run build
````
or
````sh
yarn build
````

### Integration into plugin

After compiling, copy the `asset-manifest.json` , `index.html` , `src/**`, `static/**` files and subdirectories in the `build` directory to the `sketch/assets' of the plugin project /export-measure` directory, then recompile and package the plugin

> If there is something similar to the following `<script src="artboards/FF7DA7EF-B893-47CE-8C1F-A042C0011233.js"></script>` in the index.html file, please delete it manually and only keep the `<script src ="data.js"></script>`


# Code of Conduct

Please refer to [Alibaba Open Source Code of Conduct](https://github.com/AlibabaDR/community/blob/master/CODE_OF_CONDUCT.md)


# LICENCE

Gaia Measure is licensed under the Apache License, Version 2.0. See LICENSE for the full license text.
