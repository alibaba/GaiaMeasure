# 标注模板

> [en-US](./README_en.md)

## 介绍

该库是[Sketch插件](https://github.com/alibaba/GaiaSketch)中的【导出标注】功能的一部分，通过此项目生成标注模板，产物集成在设计师插件中，通过和插件导出设计稿的数据，生成可供开发参考的标注文件

[语雀知识库地址](https://www.yuque.com/youku-gaia/gaia-measure)

项目架构基于 [Create React App](https://github.com/facebook/create-react-app)，界面基于 [FluentUI](https://github.com/microsoft/fluentui) 

[标注示例](./docs/examples/)

## 特点

* 支持插件定义的Design Token库，以及显示选中图层特定属性的Design Token
* 更清晰的标注界面
* 支持查看选中图层的CSS样式

## 数据格式

* [数据](./docs/zh-CN/data.md)

## 功能

* [Design Token](./docs/zh-CN/token.md)
* [属性](./docs/zh-CN/property.md)
* [尺寸](./docs/zh-CN/size.md)
* [背景](./docs/zh-CN/fill.md)
* [边框](./docs/zh-CN/border.md)
* [阴影](./docs/zh-CN/shadow.md)
* [代码](./docs/zh-CN/code.md)
* [切图](./docs/zh-CN/slice.md)
* [字符](./docs/zh-CN/font.md)
* [模糊](./docs/zh-CN/blur.md)

## 开发

### 安装依赖

```sh
npm run install 
```
或者
```sh
yarn 
```

### 启动服务

```sh
npm run start
```
或者
```sh
yarn start
```

### 编译

```sh
npm run build
```
或者
```sh
yarn build
```

### 集成到插件

编译后，拷贝 `build` 目录下的 `asset-manifest.json` 、 `index.html` 、 `src/**`、 `static/**` 文件及子目录到插件的 `sketch/assets/export-measure` 目录，然后重新编译打包插件

> 如果index.html文件中有类似如下 `<script src="artboards/FF7DA7EF-B893-47CE-8C1F-A042C0011233.js"></script>` 的内容，请手动删掉，只保留  `<script src="data.js"></script>`


# 行为准则

[Alibaba Open Source Code of Conduct](https://github.com/AlibabaDR/community/blob/master/CODE_OF_CONDUCT_zh.md)


# 开源协议

Gaia Measure is licensed under the Apache License, Version 2.0. See LICENSE for the full license text.
