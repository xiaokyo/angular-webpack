; (function () {
  angular.module('utils', ['service']).service('utils', ['erp', function (erp) {
    /**
     * 图片大小处理[oss服务器自带]
     * @param {String} url 图片链接
     * 文档链接 [https://help.aliyun.com/document_detail/44688.html]
     */
    this.IMG_SIZE = (url, param = {}) => {
      var str = `${url}?x-oss-process=image/resize`; // https://cc-west-usa.oss-us-west-1.aliyuncs.com/15330528/2076770670210.jpg?x-oss-process=image/resize,w_200,h_200

      for (var k in param) str += `,${k}_${param[k]}`;
      return str;
    };

    this.fixedTop = json => setTimeout(() => {
      /**
       * json {
       *   el: 目标元素
       *   upFn: 向下滚动超过目标元素触发
       *   downFn: 向上滚动超过目标元素触发
       *   offsetTop: 触发偏移量
       * }
       *
       * _json {
       *   top: 滚动位置
       *   scroll: 与目标元素的距离
       *   threshold: 目标元素距离顶部高度，触发callback的阈值
       * }
       */
      var ele = document.querySelector(json.el);
      var offsetTop = json.offsetTop || 0;
      var threshold = ele.getBoundingClientRect().top - offsetTop;
      var top;
      var _json;
      ele.style.position = 'relative';
      ele.style.zIndex = 9;
      window.onscroll = (ev) => {
        top = document.documentElement.scrollTop || document.body.scrollTop;
        _json = { top, scroll: top - threshold, threshold };
        scroll(_json)
        top >= threshold ? json.upFn && json.upFn(_json) : json.downFn && json.downFn(_json);
      };
      function scroll(ev) {
        ele.style.transform = `translate(0px, ${ev.scroll > 0 ? ev.scroll : 0}px)`;
      }
    }, 100);

    /** 时间戳转化为日期 */
    this.changeTime = (str, hasHour) => {
      let date = new Date(str)
        , year = date.getFullYear()
        , month = date.getMonth() + 1
        , day = date.getDate()
        , hour = date.getHours()
        , minutes = date.getMinutes()
        , seconds = date.getSeconds()
        , result

      hasHour  //是否需要时分秒
        ? result = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hour < 10 ? '0' + hour : hour}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
        : result = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`

      return result
    }
    /** 时间搜索判断时间日期是否符合规范 （时间不能大于今天日期， 开始时间不能大于结束时间） */
    this.judgeSearchTime = (startDate, endDate) => {
			let now = new Date().getTime()
				, tomorrow
				, result = { can: true, message: '' }

			now = new Date(this.changeTime(now)).getTime()
			tomorrow = now + 24 * 60 * 60 * 1000
			startDate = new Date(startDate).getTime()
			endDate = new Date(endDate).getTime()

			result = startDate >= tomorrow || endDate >= tomorrow
				? Object.assign(result, { can: false, message: '查询日期不能超过今天' })
				: startDate > endDate
					? Object.assign(result, { can: false, message: '开始日期不能大于结束日期' })
					: result

			return result
		}

    /** 判断是否为一个正确的数字类型（只有一个小数点）/ 根据传值限制小数点位数 */
    this.changeNumber = ({ num, limit, type }) => {
      let result = { message: '', flag: true }
        , reg = new RegExp(`^(([1-9][0-9]*)|(([0]\\.\\d{1,${Number(limit)}}|[1-9][0-9]*\\.\\d{1,${Number(limit)}})))$`, 'gi')

      if (!reg.test(Number(num))) result = Object.assign(result, { message: `${type}只能为正，并且保留两位小数`, flag: false })
      return result
    }
	  // 数字限制
	  this.floatLength = (str = "", length) => {
		  let _val = str
		  .toString()
		  .replace(/[^\d+.]/, "") // 限制输入数字和 .
		  .replace(/^\./, "") // 不允许 . 开头
		  .replace(/\./, "#") // 暂存第一次出现的小数点
		  .replace(/\./g, "") // 干掉所有小数点
		  .replace("#", "."); // 还原第一个暂存的小数点
		
		  const [str1 = "", str2 = ""] = _val.split(".");
		
		  if (length && str2 && str2.length > length) {
			  _val = `${str1}.${str2.substr(0, length)}`;
		  }
		
		  if (length === 0) {
			  _val = str1;
		  }
		
		  return _val;
	  };
    /** 去重 */
    this.uniqueArr = function (arr = [], field) {
      var json = {};

      return arr.filter(item => {
        if (json[item[field]]) {
          return false;
        } else {
          json[item[field]] = 1;
          return true;
        }
      });
    };
	  // 数字限制
	  this.floatLength = (str = "", length) => {
		  let _val = str
		  .toString()
		  .replace(/[^\d+.]/, "") // 限制输入数字和 .
		  .replace(/^\./, "") // 不允许 . 开头
		  .replace(/\./, "#") // 暂存第一次出现的小数点
		  .replace(/\./g, "") // 干掉所有小数点
		  .replace("#", "."); // 还原第一个暂存的小数点
		
		  const [str1 = "", str2 = ""] = _val.split(".");
		
		  if (length && str2 && str2.length > length) {
			  _val = `${str1}.${str2.substr(0, length)}`;
		  }
		
		  if (length === 0) {
			  _val = str1;
		  }
		
		  return _val;
	  };
	  // 文字转语音 (调用百度API)
	  this.textToAudio1 = (text) => {
		  const url = `http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=6&vol=15&text=${text}`
		  const audio = new Audio(url)
		  audio.src = url
		  audio.play()
	  }
	  // 文字转语音 (h5 API)
	  this.textToAudio2 = (text) =>{
		  const audio = new SpeechSynthesisUtterance()
		  audio.text = text
		  audio.lang = 'zh'
		  audio.rate = 0
		  audio.volume = 1
		  audio.pitch = 2
		  speechSynthesis.speak(audio)
		  audio.onend = () => {
			  console.log('播放完了')
		  }
	  }
	
	  // 上传文件获取宽高大小
	  this.filesSizeWH = files => {
		  return new Promise(resolve => {
			  if (files && files[0]) {
				  if (files[0].type === "image/jpeg" || files[0].type === "image/gif" || files[0].type === "image/png") {
					  const reader = new FileReader();
					  reader.readAsDataURL(files[0]);
					  reader.onload = ev =>{
						  const img = new Image();
						  img.src = ev.target.result;
						  img.onload = () => {
							  resolve({ size: files[0].size / 1024, width: img.width, height: img.height })
						  }
					  }
				  } else {
					  console.log("文件类型不对 " + input.files[0].type);
				  }
			  } else {
				  console.log("没有上传，使用默认");
			  }
		  })
		
	  }
  }]);
}());
