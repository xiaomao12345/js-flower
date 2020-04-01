(function(w) {
	w.myTool = {
		$: function(id) {
			return typeof id === 'string' ? document.getElementById(id) : null;
		},
		scroll: function() {
			if(window.pageYOffset !== null) {
				return {
					"top": window.pageYOffset,
					"left": window.pageXOffset
				}
			} else if(document.compatMode === 'CSS1Compat') { //w3c
				return {
					"top": document.documentElement.scrollTop,
					"left": document.documentElement.scrollLeft
				}
			}
			return {
				"top": document.body.scrollTop,
				"left": document.body.scrollLeft
			}
		},
		
		client: function() {
			if(window.innerWidth) { // ie9+ 最新的浏览器
				return {
					"width": window.innerWidth,
					"height": window.innerHeight
				}
			} else if(document.compatMode === "CSS1Compat") { // W3C
				return {
					"width": document.documentElement.clientWidth,
					"height": document.documentElement.clientHeight
				}
			}

			return {
				"width": document.body.clientWidth,
				"height": document.body.clientHeight
			}
		},
		
		/*
		 * 缓动动画函数
		 * @param {Object} obj
		 * @param {Object} json
		 * @param {Function} fn
		 */
		buffer: function(obj, json, fn) {
			// 1.1 清除定时器
			clearInterval(obj.timer);

			// 1.2 设置定时器
			var begin = 0,
				target = 0,
				speed = 0;
			obj.timer = setInterval(function() {
				// 1.3.0 旗帜
				var flag = true;
				for(var key in json) {
					if (json.hasOwnProperty(key)) {
						// 1.3 获取初始值
						if("opacity" === key) {
							/*begin = Math.round(parseFloat(myTool.getCSSAttrValue(obj, key)) * 100) || 100;
							target = parseInt(json[key] * 100);*/
							
							begin = parseInt( parseFloat(myTool.getCSSAttrValue(obj, key)) * 100);
                            target = parseInt(parseFloat(json[key]) * 100);
						} else if('scrollTop' === key) {
							begin = Math.ceil(Number(obj.scrollTop));
							target = parseInt(json[key]);
						}else {
							begin = parseInt(myTool.getCSSAttrValue(obj, key)) || 0;
							target = parseInt(json[key]);
						}
	
						// 1.4 求出步长
						speed = (target - begin) * 0.2;
	
						// 1.5 判断是否向上取整
						speed = (target > begin) ? Math.ceil(speed) : Math.floor(speed);
	
						// 1.6 动起来
						// 1.6 动起来
						if("opacity" === key) { // 透明度
							// w3c的浏览器
							obj.style.opacity = (begin + speed) / 100;
							
                            obj.style.filter = 'alpha(opacity=' + (begin + target)+')'; // 针对IE
						} else if('scrollTop' === key){
							
							obj.scrollTop = begin + speed;
							
						} else if("zIndex" === key) {
							obj.style[key] = json[key];
						} else{
							obj.style[key] = begin + speed + 'px';
						}
	
						// 1.5 判断
						if(begin !== target) {
							flag = false;
						}
					}
				}

				// 1.3 清除定时器
				if(flag) {
					clearInterval(obj.timer);

					//console.log(fn);

					// 判断有没有回调函数
					if(fn) {
						fn();
					}
				}
			}, 20);
		},
		/**
		 *  匀速动画函数
		 * @param {object}obj
		 * @param {number}target
		 * @param {number}speed
		 */
		constant:function (obj, target, speed) {
		    // 1. 清除定时器
		    clearInterval(obj.timer);
		
		    // 2. 判断方向
		    var dir = obj.offsetLeft < target ? speed : -speed;
		
		
		    // 3. 设置定时器
		    obj.timer = setInterval(function () {
		        obj.style.left = obj.offsetLeft + dir + "px";
		
		        if(Math.abs(target - obj.offsetLeft) < Math.abs(dir)){
		            clearInterval(obj.timer);
		
		            obj.style.left = target + "px";
		            console.log(obj.offsetLeft, target);
		        }
		    }, 20);
		
		},
		/**
		 * 获取css的样式值
		 * @param {object}obj
		 * @param attr
		 * @returns {*}
		 */
		getCSSAttrValue: function(obj, attr) {
			if(obj.currentStyle) { // IE 和 opera
				return obj.currentStyle[attr];
			} else {
				return window.getComputedStyle(obj, null)[attr];
			}
		},
		/*传递过来的参数只能通过下标的方式进行改变值，不能通过点语法进行设置*/
		/**
		 * 改变css的属性
		 * @param {object}obj
		 * @param attr
		 * @param value
		 * @returns {*}
		 */
		changeCssStyle: function(obj, attr, value) {
			obj.style[attr] = value;
			/*obj.style.attr = value;不可以实现，必须用下标的方式*/
		}
	}
})(window);