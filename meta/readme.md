# rangeDefine格式

## 最小单元格式
------
> {rangeType:string,opts?:{distance:number,direction?:number}}
> 第一个元素表示**范围搜索类型**
> 第二个元素表示**距离参数**
------
> 或者直接传入一个函数
> (posi:IPosition) => IPosition[]


### 范围搜索类型
 - line 直线
 - slash 斜线
 - near 上下左右一格
 - circle 周围一圈

### 基础函数
