;
(function(window, undefined) {
	var doc = window && window.document || null;
	if (!doc) {
		throw new Error("document不存在！");
	}
	// 工具方法
	var forEach = Array.prototype.forEach;

	function findNodesByClassName(el, className) {
		var nodeArr = [];
		if (el && el.children) {
			if (className) {
				var children = el.children;
				forEach.call(children, function(el, idx) {
					if (~el.className.indexOf(className)) {
						nodeArr.push(el);
					}
					nodeArr = nodeArr.concat(findNodesByClassName(el, className));
				});
			}
		}
		return nodeArr;
	}

	function setStyles(el, style) {
		if (el && el.style && style && typeof style === 'object') {
			Object.keys(style).forEach(function(sty) {
				el.style[sty] = style[sty];
			});
		}
	}
	// 浅拷贝
	function extend(obj, distObj) {
		Object.keys(distObj || {}).forEach(function(key) {
			obj[key] = distObj[key];
		});
		return JSON.parse(JSON.stringify(obj));
	}

	// 构造函数
	function Carrousel(el, options) {
		this.container = el;
		this.init(options);
	}

	Carrousel.prototype = {
		init: function(options) {
			this.initialConfig(options);
			this.initialFrame();
		},
		initialConfig(options) {
			var config = {
				wrapper: 'carrousel-wrapper',
				slide: 'carrousel-slide',
				prevBtn: 'carrousel-prev',
				nextBtn: 'carrousel-next',
				pagination: 'carrousel-pagination',
				paginationClick: true,
				radius: 0,
				autoplay: false,
				speed: 3000,
				hover: true,
			};

			this.config = extend(config, options);
		},
		initialFrame: function() {
			var _self = this;

			this.wrapper = findNodesByClassName(this.container, this.config.wrapper)[0];
			this.slides = findNodesByClassName(this.wrapper, this.config.slide);
			this.prevBtn = findNodesByClassName(this.container, this.config.prevBtn)[0];
			this.nextBtn = findNodesByClassName(this.container, this.config.nextBtn)[0];
			this.pagination = findNodesByClassName(this.container, this.config.pagination)[0];

			var wrapperStyle = window.getComputedStyle(this.wrapper),
				wrapperWidth = parseFloat(wrapperStyle.width),
				wrapperHeight = parseFloat(wrapperStyle.height),
				centerPoint = { x: wrapperWidth / 2, y: wrapperHeight / 2 },
				slideStyle = window.getComputedStyle(this.slides[0]),
				slideWidth = parseFloat(slideStyle.width),
				slideHeight = parseFloat(slideStyle.height),
				slideLen = this.slides.length,
				layers = ~~(slideLen / 2) + 1,
				radius = centerPoint.x - slideWidth / 2,
				angle = Math.PI * 2 / slideLen;

			this.angle = angle;
			this.currentIndex = 0;
			this.posArr = [];

			// 初始化slide
			forEach.call(this.slides, function(el, idx) {
				var offsetX = radius * Math.sin(idx * angle),
					offsetZ = radius * Math.cos(idx * angle),
					pos = {
						x: centerPoint.x + offsetX,
						y: centerPoint.y,
						z: offsetZ
					},
					scale = 1 - (radius - pos.z) / (4 * radius),
					layer = Math.min(Math.abs(idx - _self.currentIndex), Math.abs(_self.currentIndex < layers ? (slideLen + _self.currentIndex - idx) : (slideLen - _self.currentIndex + idx)));

				_self.posArr.push({
					zIndex: ~~pos.z,
					transformOrigin: pos.x + 'px ' + pos.y + 'px',
					transform: 'scale(' + scale + ') translate3d(' + (pos.x - slideWidth / 2) + 'px,' + (pos.y - slideHeight / 2) + 'px,0px)',
					opacity: 1 - layer / layers,
				})

				setStyles(el, {
					position: 'absolute',
					top: 'auto',
					left: 'auto',
					right: 'auto',
					bottom: 'auto',
					margin: 'auto',
					transition: 'all .3s',
				})
			});

			// 控制按钮监听
			if (this.prevBtn) {
				this.prevBtn.addEventListener('click', function(e) {
					_self.currentIndex -= 1;
					_self.rotate();
					_self.autoplay();
				}, false);
			}
			if (this.nextBtn) {
				this.nextBtn.addEventListener('click', function(e) {
					_self.currentIndex += 1;
					_self.rotate();
					_self.autoplay();
				}, false);
			}
			// 初始导航
			if (this.pagination) {
				var paginationHtml = '';

				for (var i = 0; i < slideLen; i++) {
					paginationHtml += '<span class="carrousel-pagination-item active">' + (i + 1) + '</span>';
				}
				this.pagination.innerHTML = paginationHtml;
				this.paginationItems = findNodesByClassName(this.pagination, 'carrousel-pagination-item');
				this.pagination.addEventListener('click', function(e) {
					var index = e.target.innerText - 1;

					if (index === _self.currentIndex) return;
					_self.currentIndex = index;
					_self.rotate();
					_self.autoplay();
				}, false);
			}
			// hover暂停自动切换
			if (this.config.hover && this.config.autoplay) {
				this.wrapper.addEventListener('mouseenter', function(e) {
					clearInterval(_self.interval);
				}, false);
				this.wrapper.addEventListener('mouseleave', function(e) {
					_self.autoplay();
				}, false);
			}
			// 初始化状态
			this.currentIndex = 0;
			this.rotate();

			this.autoplay();
		},
		autoplay: function() {
			var _self = this;

			clearInterval(this.interval);
			if (this.config.autoplay) {
				this.interval = setInterval(function() {
					_self.currentIndex += 1;
					_self.rotate();
				}, this.config.speed);
			}
		},
		rotate: function() {
			var _self = this,
				slideLen = this.slides.length;

			this.currentIndex = ((this.currentIndex % slideLen) + slideLen) % slideLen;

			forEach.call(this.slides, function(el, idx) {
				setStyles(el, _self.posArr[idx - _self.currentIndex + (idx - _self.currentIndex < 0 ? slideLen : 0)])
			});
			forEach.call(this.paginationItems, function(el, idx) {
				el.className = el.className.replace('active', '').trim();
				if (idx === _self.currentIndex) {
					el.className += ' active';
				}
			});
		}
	};

	if (!window.carrousel) {
		window.carrousel = function(selector, options) {
			var container = doc.querySelectorAll(selector),
				carrouselArr = [];

			forEach.call(container, function(el, idx) {
				carrouselArr.push(new Carrousel(el, options));
			});

			return carrouselArr.length > 1 ? carrouselArr : carrouselArr[0];
		};
	}

})(window);

function lg(log, tag) {
	window.console.log('-------------' + (tag || 'console') + '--------------');
	window.console.log(log);
	window.console.log('----------------------------------');
}