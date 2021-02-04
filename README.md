# 搭建自己的 Vue SSR 实例

## 准备

安装 `vue` & `vue-server-renderer`

## 服务端写vue模板，渲染为字符串

在服务端创建Vue实例，传入模板定义。然后使用 `vue-server-renderer` 将模板和数据渲染为HTML文本