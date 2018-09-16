# carrousel

> 一个简单的基于原生js的旋转木马插件

## 安装

> 通过npm安装

	npm install mini-carrousel

> 或者直接下载压缩包，引入里面的carrousel.js文件

## 使用 ##

> HTML结构

	<!-- 外部容器 -->
	<div class="carrousel-container">
		<!-- 内部容器 -->
		<div class="carrousel-wrapper">
			<div class="carrousel-slide">1</div>
			<div class="carrousel-slide">2</div>
			<div class="carrousel-slide">3</div>
			<div class="carrousel-slide">4</div>
			<div class="carrousel-slide">5</div>
			<div class="carrousel-slide">6</div>
			<div class="carrousel-slide">7</div>
		</div>
		<!-- 控制 -->
		<div class="carrousel-prev">←</div>
		<div class="carrousel-next">→</div>
		<!-- 分页 -->
		<div class="carrousel-pagination"></div>
	</div>

> 样式

	wrapper和slide只需定宽高，其他自定义

> 初始化

	carrousel(selector[,options])

## 参数 ##

> selector

	外部容器元素选择器，例：'.carrousel-container'

> options

	可配置项：
	wrapper:内部容器选择器，例：'carrousel-wrapper'
	slide:slide选择器，例：'carrousel-slide'
	prevBtn:控制器选择器，例：'carrousel-prev'
	nextBtn:控制器选择器，例：'carrousel-next'
	pagination:导航选择器，例：'carrousel-pagination'
	paginationClick:导航是否可点击，布尔类型，默认为true
	radius:半径偏移量，数值类型，默认0
	autoplay:自动播放，布尔类型，默认false
	speed:自动播放速度，数值类型，单位毫秒，默认3000
	hover:鼠划暂停，布尔类型，默认true