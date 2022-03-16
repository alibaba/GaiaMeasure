# Design Token

The generated annotation template supports the display of the Design Token data exported through the plug-in, and can display the Token specified by the designer next to the style, instead of checking them one by one in the Design Token table, which is convenient for development and use

What is Design Token and how to define a Design Token library? You can refer to the plugin's [documentation](https://www.yuque.com/youku-gaia/gaia-sketch/dk7e21)

The following will give a few examples to illustrate how the markup file displays the Design Token

## One on one scene

One-to-one scenario means that one style value corresponds to one Token. For this scenario, the correct Token will be displayed directly below the corresponding style value and identified by <font color="#0091FF">blue</font> out

![img](https://cdn.nlark.com/yuque/0/2022/png/156243/1645671381945-b7b5820c-8d51-4b58-9262-5f61298fb92f.png)

## One-to-many scenario

One-to-many scenario means that one style value corresponds to multiple Tokens, and each Token is applied in different scenarios. In this case, the Tokens corresponding to the style value in the Design Token library will be displayed in a list, and displayed through <font color="#FFB900">Yellow</font> identifies

![img](https://cdn.nlark.com/yuque/0/2022/png/156243/1645671948932-ff8d75d8-f5a9-4748-a33b-3faa17080446.png)

The definition in the corresponding Design Token table is shown in the following figure:

![img](https://cdn.nlark.com/yuque/0/2022/png/156243/1645682804952-542a6d22-05a7-4fc1-b106-eac3589a53d3.png)

In order to solve the above one-to-many scenario, it is not clear which the correct Token should be in the Token list listed in the annotation file, we need to use the plugin's [style library](https://www.yuque.com /youku-gaia/gaia-sketch/be6wcy) function to solve

> At present, the styles that support solving one-to-many scene problems by the following methods only include [color] and [font size]

1. Make a style library. For the Text type layer, name the Text type layer name as the name of the Token, and for the Shape type layer, name the Shape type layer name as the name of the Token, as follows As shown in the figure:

![img](https://cdn.nlark.com/yuque/0/2022/png/156243/1645683027318-cb8d144d-8acb-4ff3-b74c-918b74059c83.png)

1. Import or upload (if the Gitlab service has been configured) in the plugin, the specific method can be found in [Style Library]https://www.yuque.com/youku-gaia/gaia-sketch/be6wcy) and [Service Configuration](https://www.yuque.com/youku-gaia/gaia-sketch/be6wcy) https://www.yuque.com/youku-gaia/gaia-sketch/xxqwz8)

2. Open the Sketch design draft, open the plugin, select the style library you just imported, select the relevant layer in the design draft, click the Token format layer to be specified, after clicking, the layer name in the design draft will be ( token:xxxx) additional information, so that after exporting the annotation, the annotation file can determine the unique Token by parsing this information

The information of the style library imported in the plugin is as follows:

![img](https://cdn.nlark.com/yuque/0/2022/png/156243/1645683919251-35339373-00b7-4b63-993d-41b2d2cd3824.png)

The effect of formatting the relevant layers in the design draft is as follows:

![img](https://cdn.nlark.com/yuque/0/2022/png/156243/1645683919371-a25242c9-745c-49c8-ae7e-da56f56a6691.png)

After exporting the callout, the effect in the callout file is as follows, and is identified by <font color="#0091FF">blue</font>:

![img](https://cdn.nlark.com/yuque/0/2022/png/156243/1645684061457-cf888692-1dc9-441b-b391-c00e811a9828.png)

## Combining scenes

A combination scene refers to multiple style attributes corresponding to a Token, such as the Token of the title text determined by the font size, font weight, etc. The following figure illustrates how the combination scene is displayed

The text that matches the font size of 19 and the font weight of 500 (Medium) is the Token of main_title

![img](https://cdn.nlark.com/yuque/0/2022/png/156243/1645673116390-9624afcb-fab5-491a-91c5-32afd92bc2ba.png)
