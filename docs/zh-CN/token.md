# Design Token

生成的标注模板支持显示通过插件导出的Design Token数据，能在样式旁展示出设计师指定的Token，而不是去Design Token表格中一个个查，方便开发使用

什么是Design Token，怎么定义一个Design Token库？可以参考插件的 [文档](https://www.yuque.com/youku-gaia/gaia-sketch/dk7e21)

以下将通过列举几个例子来说明标注文件如何展示Design Token

## 一对一场景

一对一场景是指一个样式值对应一个Token，对于这种场景，正确的Token会直接展示在对应的样式值的下方，并通过 <font color="#0091FF">蓝色</font> 标识出

![img](https://cdn.nlark.com/yuque/0/2022/png/156243/1645671381945-b7b5820c-8d51-4b58-9262-5f61298fb92f.png)

## 一对多场景

一对多场景是指一个样式值对应多个Token，每个Token应用在不同的场景中，对于这种情况，Design Token库中该样式值对应的Token都会通过列表形式展示出来，并通过 <font color="#FFB900">黄色</font> 标识出

![img](https://cdn.nlark.com/yuque/0/2022/png/156243/1645671948932-ff8d75d8-f5a9-4748-a33b-3faa17080446.png)

对应Design Token表格中的定义如下图所示：

![img](https://cdn.nlark.com/yuque/0/2022/png/156243/1645682804952-542a6d22-05a7-4fc1-b106-eac3589a53d3.png)

为了解决上述的一对多的场景，开发不清楚标注文件上列举的Token列表中正确的Token应该是哪个的问题，我们就需要借助插件的 [样式库](https://www.yuque.com/youku-gaia/gaia-sketch/be6wcy) 的功能来解决

> 目前通过以下方法支持解决一对多的场景问题的样式只包括【颜色】和【字号】

1. 制作一个样式库，对于Text类型的图层，将Text类型的图层的名称命名为Token的名称，对于Shape类型的图层，将Shape类型的图层的名称命名为Token的名称，如下图所示：

![img](https://cdn.nlark.com/yuque/0/2022/png/156243/1645683027318-cb8d144d-8acb-4ff3-b74c-918b74059c83.png)

1. 导入或者上传（如果已配置Gitlab服务的话）插件中，具体方法可见 [样式库]https://www.yuque.com/youku-gaia/gaia-sketch/be6wcy) 和 [服务配置](https://www.yuque.com/youku-gaia/gaia-sketch/xxqwz8)

2. 打开Sketch设计稿，打开插件，选择刚才已导入的样式库，选择设计稿中相关的图层，点击要指定的Token格式化图层，点击后，设计稿中的图层名称将有(token:xxxx)的追加信息，这样在导出标注后，标注文件能够通过解析此信息来确定唯一的Token

插件中导入的样式库的信息如下：

![img](https://cdn.nlark.com/yuque/0/2022/png/156243/1645683919251-35339373-00b7-4b63-993d-41b2d2cd3824.png)

格式化设计稿中相关图层后的效果如下：

![img](https://cdn.nlark.com/yuque/0/2022/png/156243/1645683919371-a25242c9-745c-49c8-ae7e-da56f56a6691.png)

导出标注后，标注文件中的效果如下，并且通过  <font color="#0091FF">蓝色</font> 标识出：

![img](https://cdn.nlark.com/yuque/0/2022/png/156243/1645684061457-cf888692-1dc9-441b-b391-c00e811a9828.png)

## 组合场景

组合场景是指多个样式属性对应一个Token，比如通过字号、字重等共同决定标题文本的Token，下图说明了组合场景是如何展示的

符合字号是19，字重是500（Medium）的文本，该文本即是main_title这个Token

![img](https://cdn.nlark.com/yuque/0/2022/png/156243/1645673116390-9624afcb-fab5-491a-91c5-32afd92bc2ba.png)
