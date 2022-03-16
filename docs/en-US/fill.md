# Fill

### Solid Color

<img src="https://img.alicdn.com/imgextra/i3/O1CN01fjsQsl1EeFezkeQRW_!!6000000000376-2-tps-628-322.png" style="zoom:50%;" />

The format of the color value (background-color) is a hexadecimal value, ##RRGGBB[AA], if there is alpha, put it in the last two digits

### Linear Gradient

<img src="https://img.alicdn.com/imgextra/i3/O1CN01lcRbnY1m8N1ad4YCM_!!6000000004909-2-tps-628-576.png" style="zoom:40%;" />

Currently only linear gradients are supported (linear-gradient)

* Direction, possible values ​​are:
  `from bottom to top ( to top )` , ` from top to bottom ( to bottom )` , ` from right to left ( to left )` , ` from left to right ( to right )` , ` from bottom left to top right ( to top right )` , `from bottom right to top left ( to top left )` , `from top right to bottom left ( to bottom left )` , `from top left to bottom right ( to bottom right )`

* 【Start Point】and 【End Point】
  
  <img src="https://docs.microsoft.com/en-us/dotnet/media/wcpsdk-graphicsmm-diagonalgradientaxis.png?view=windowsdesktop-6.0" style="zoom:80%;" />

  > Image quoted from `https://docs.microsoft.com/en-us/dotnet/api/system.windows.media.lineargradientbrush.startpoint?view=windowsdesktop-6.0`

  ````objc
  // Property settings corresponding to iOS
  CAGradientLayer *layer = [CAGradientLayer layer];
  layer.startPoint = CGPointMake(0, 0);
  layer.endPoint = CGPointMake(1, 1);
  ````

* 【colour】
  
  ````objc
  // iOS corresponding color and position settings
  CAGradientLayer *layer = [CAGradientLayer layer];
  layer.colors = @[(__bridge id)[UIColor colorWithHexString:@"#3affd4"].CGColor,
                                 (__bridge id)[UIColor colorWithHexString:@"#ff5aa1"].CGColor];
  layer.locations = @[@0.0, @1.0];
  ````
