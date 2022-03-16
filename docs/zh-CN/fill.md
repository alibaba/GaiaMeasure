# 填充

### 纯色

<img src="https://img.alicdn.com/imgextra/i3/O1CN01fjsQsl1EeFezkeQRW_!!6000000000376-2-tps-628-322.png" style="zoom:50%;" />

颜色（background-color）色值的格式是十六进制数值，##RRGGBB[AA]，如果有alpha，放在最后两位

### 线性渐变

<img src="https://img.alicdn.com/imgextra/i3/O1CN01lcRbnY1m8N1ad4YCM_!!6000000004909-2-tps-628-576.png" style="zoom:40%;" />

目前只支持线性渐变（linear-gradient）

* 方向，可能的取值有：
  `从下到上( to top )` , `从上到下( to bottom )` , `从右到左( to left )` , `从左到右( to right )` , `从左下到右上( to top right )` , `从右下到左上( to top left )` , `从右上到左下( to bottom left )` , `从左上到右下( to bottom right )` 

* 【起始点】和【终点】
  
  <img src="https://docs.microsoft.com/en-us/dotnet/media/wcpsdk-graphicsmm-diagonalgradientaxis.png?view=windowsdesktop-6.0" style="zoom:80%;" />

  > 图片引用自 `https://docs.microsoft.com/en-us/dotnet/api/system.windows.media.lineargradientbrush.startpoint?view=windowsdesktop-6.0`

  ```objc
  // iOS 对应的属性设置
  CAGradientLayer *layer = [CAGradientLayer layer];
  layer.startPoint = CGPointMake(0, 0);
  layer.endPoint = CGPointMake(1, 1);
  ```

* 【颜色】
  
  ```objc
  // iOS 对应颜色和位置的设置
  CAGradientLayer *layer = [CAGradientLayer layer];
  layer.colors = @[(__bridge id)[UIColor colorWithHexString:@"#3affd4"].CGColor,
                                 (__bridge id)[UIColor colorWithHexString:@"#ff5aa1"].CGColor];
  layer.locations = @[@0.0, @1.0];
  ```

