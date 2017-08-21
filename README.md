### 需求背景

目前iconfont使用的是 `alicdn`，如果要上传到自己的服务器，必须得先下载到本地，再上传到nos，并且把上传后的地址替换先前的 `alicdn` 地址，比较麻烦。

### 功能介绍

在iconfont项目页，通过chrome扩展获取到生成好的 `font-face` 代码，解析出里面的字体地址。通过 `XMLHttpRequest` 下载字体，然后直接上传至 `nos`，把返回的地址替换掉原先 `alicdn` 的地址。

### 如何使用

* 在chrome中打开 `chrome://extensions/`，把 `.crx` 扩展文件直接托进去。
* 打开iconfont项目页，点击插件图标，点击复制按钮便可。