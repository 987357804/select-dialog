## 组件简介
以弹窗形式，分页展示数据列表，并可以支持单选/多选数据进行返回。
![image.png](https://cdn.nlark.com/yuque/0/2021/png/1385890/1620373862025-67a13f01-72f6-4110-8513-57031353a195.png#clientId=uf99514e0-af9a-4&from=paste&height=382&id=u5c1bf748&margin=%5Bobject%20Object%5D&name=image.png&originHeight=763&originWidth=790&originalType=binary&size=49893&status=done&style=none&taskId=u3b532f60-68db-4786-b132-da7ee1494eb&width=395)


## 依赖组件
element-ui：  
弹窗（el-dialog）  
分页（el-pagination）  
列表（el-table）  
下拉菜单（el-select）  
输入框（el-input）  


## 属性
| 属性 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| value/v-model | 绑定值 | [Object] | —— | —— |
| title | 标题 | String | —— | 选择 |
| visible | 弹窗隐藏状态 | Boolean | —— | false |
| tableProps | 列表字段，详见[列表格式](https://www.yuque.com/shawliang/ne6zxu/wutdgn#f4l1d) | [Object] | —— | —— |
| searchParams | 搜索参数 | Object | —— | —— |
| api | 获取列表接口函数 | Funtion | —— | —— |
| value-key | 数据唯一标识的键名 | String | —— | code |

#### 列表格式
| 属性 | 说明 | 类型 |
| --- | --- | --- |
| prop | 列内容字段名 | String |
| label | 列标题 | String |
| attr | 列属性设置，详细参考[列属性配置](https://element.eleme.cn/#/zh-CN/component/table#table-column-attributes) | Object |

```javascript
// 例子
[
    { prop: 'name_cn', label: '设备名称', attr: { 'show-overflow-tooltip':true } },
    { prop: 'sn', label: 'SN号' },
    { prop: 'ipv4', label: 'IP地址' },
    { prop: 'physics_name', label: '所在机房' },
]
```


## 事件
| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| close | 必填，Dialog关闭前回调，用于把visible值改为false | —— |



## 方法
| 方法名 | 说明 | 回调参数 |
| --- | --- | --- |
| search | 用于调用列表搜索事件 | —— |



## 实现功能

- [x] 1、通过v-model双向绑定已选项  
- [x] 2、打开弹窗已选择数据进行回显  
- [x] 3、支持单选和多选  
- [x] 4、头部搜索可通过插槽实现自定义
- [x] 5、可通过tableProp传值，实现列表配置
- [x] 6、可自定义数据唯一键名



## 开发重点流程
#### 1、实现弹窗开关效果  
**实现过程：**
通过组件  visible  属性传递控制弹窗开关的变量  deviceShow  ;
然后通过调用  el-dialog  组件的  before-close  属性，在弹窗关闭前，调用父组件的  close  事件，改变父组件的变量 deviceShow  ，从而关闭弹窗。
**注意：**
不能使用  el-dialog  原生的关闭弹窗方式，因为原生方法会改变绑定的  deviceShow  值，而  deviceShow  是通过prop父传子的方式传入，因此不能在子组件内被改动。因此使用了通过  emit  触发改变父组件层的deviceShow  
```vue
// index.vue

<template>
  <div>
    <select-dialog
      :visible="deviceShow"
      @close="deviceShow = false"
    ></select-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      deviceShow: false,
    }
  }
}
</script>
```
```vue
// selectDialog.vue

<template>
  <div>
    <el-dialog :visible.sync="visible" :before-close="closeDialog">
    </el-dialog>
  </div>
</template>

<script>
export default {
  props:{
    visible: { type: Boolean, default: false },
  }
  methods: {
  	// 关闭弹窗
    closeDialog() {
      this.$emit('close',false);
    },
  }
}
</script>
```
  
## 封装优点
#### 1、减少布局结构重复的代码
如果一个页面需要多个弹窗的时候，在不封装的情况下会出现大量相重复的代码，使代码结构变得非常不简洁。
> 如：弹窗(dialog)、列表(table)、分页(pagination)等。

但是封装成组件后，只需要简单的为组件配置相应的属性就能重复使用。


#### 2、避免变量重复导致变量冲突
当出现多个弹窗的时候，为重复弹窗的相同属性命名，既要不重复，又要语义化，这也是一件很头疼的事情。
> 如：显示状态(visible)、列表数据（data)、分页的属性（page-size、total、layout）。

但是封装成组建后，只要配置一个变量就能在所有组件中使用，而且组件内配置的变量也有效和外部的变量分割，避免重复时覆盖。因此能放心使用更加简洁语义话的变量名。


#### 3、减少维护成本
一般情况下 ，在同一页面下的弹窗，都是需要统一布局样式的，如果不封装的情况下，布局一旦需要改变，就需要逐个进行更改，非常繁琐，并且有可能会出现改漏了的情况。
> 如：弹窗宽度(width)、底部操作按钮的布局等。



## 后续优化

- [ ] 简化回显效果
- [ ] 打开弹窗生命周期
- [ ] 优化获取数据不同字段名的处理
- [ ] 完善文档使用案例



## 组件版本记录
### v1.0 - 2021.5.16

- 实现组件弹窗打开关闭效果
- 实现数据请求
- 实现数据分页展示
- 实现列表数据搜索功能
- 实现列表框单选/多选功能
- 实现v-model数据绑定
- 实现绑定数据回显效果
