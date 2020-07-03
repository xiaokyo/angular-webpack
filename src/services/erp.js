import { Base64 as base64 } from 'js-base64'

export default (app) => {
  app.service('erp', function ($http, $q, $state) {
    // 配置start
    /** 这句话千万不要动！！！，打包项目时自动切换环境 */
    //-----*>
    var environment = '##production##';
    //<*-----
    // ##development## 开发
    // ##production## 线上
    // ##production-cn## 国内阿里云代理服务器
    // ##test## 测试

    var httpsJson = {}; // getFun\postFun\postFun4

    window.environment = environment; // 将环境变量抛到全局

    if (
      /production-cn##$/.test(environment)
      || /production##$/.test(environment)
    ) {
      // 国内阿里云代理服务器
      httpsJson = {
        "app": "/",
        "cj-erp": "/",
        "erp": "/",
        "storage": "/",
        "caigou": "/",
        "procurement": "/",
        "tool": '/',
        'order': "/",
        "cj": '/',
        "fulfillment": "/",
        "source": "/",
        "newlogistics": "/",
        "mail": "/",
        "_logistics": "/",
        "_logistics_com": "https://erp.cjdropshipping.com/",
        "_zflogistics": "https://miandan2.cjdropshipping.cn/",
        "supplier": "/",
        "log_recod": "http://jhmjjx.cn:4000/",
        "robot": "/",
        "message": "/",
        "product": "/",
        "warehousereceipt": "/",
        "warehouse": "/",
        "warehouseBuildWeb": "/",
        "control": "/", //权限系统
        "processOrder": "/",
        "storehouseSimple": "/",
        "storehouseUsa": "/",
        "orderSyn": "/",
        "storehouse": "https://erp.cjdropshipping.cn/",
        "unsold": "/",
        "media": "/",
        "integral": "/", // 绩效考核规则相关
        "storehouseOutgoingWarehousing": "/",
        "freight": "/",
        "otherData": "/",
        "payOrder": "/",
        "linShiGong": "/",
        "cujiaOthers": "/"
      }
    }

    window.httpsJson = httpsJson; // 将请求路径抛到全局

    function getToken() {
      return localStorage.getItem('erptoken') ? base64.decode(localStorage.getItem('erptoken')) : '';
    }

    // 19-11-01 -------- 全局报错处理 --------
    var _recordLog = function (data) {
      // 日志上报 [生产环境]
      if (document.domain === 'erp.cjdropshipping.com') {
        /* 19-11-20 remove
        $.ajax({
          method: 'post',
          url: `${window.httpsJson.log_recod}api/setLog`,
          headers: { 'Content-Type': 'application/json;charset=UTF-8' },
          // { type, title, content, access_url, params, add_time = Date.now() }
          data: this.JSON.stringify(data)
        }); */
      }
    }
    window.onerror = function () {
      _recordLog({
        type: 'window.onerror',
        content: Array.prototype.join.call(arguments, ('\n')),
        access_url: location.href,
      });
    };

    var _JSONparse = JSON.parse;
    JSON.parse = function () { // 安全的JSON.parse
      var json = { error: true }; // 如果解析有错，JSON.parse 包含 error 字段
      try {
        json = _JSONparse.apply(this, arguments);
      } catch (e) {
        console.warn(
          '-------- JSONparse error --------\n',
          e.stack,
          '\n-------- JSONparse error --------\n',
          arguments);
        _recordLog({
          type: 'JSON.parse',
          title: e.stack,
          content: arguments[0],
          access_url: location.href,
        });
      }
      return json;
    };
    // 19-11-01 -------- 全局报错处理 --------

    function getDomainByUrl(url) {
      if (typeof url === 'string' && url.indexOf('http') === 0) return url; // http 开头全路径
      // console.log(url);
      var urlStart = url.split('/')[0];
      if (urlStart == 'pojo' || urlStart == 'app') {
        urlStart = 'cj-erp';
      }

      for (var k in httpsJson) {
        if (k == urlStart) {
          return httpsJson[k] + url;
        }
      }
      return url;// 若无匹配 添加url 返回
    }
    // get请求
    this.getFun = function (url, successCallback, errorCallback, json = { responseType: null }) {
      typeof json === 'object' && json.layer && this.load(); // 开启load
      $http.get(getDomainByUrl(url), {
        responseType: json.responseType,
        headers: { 'token': getToken() }
      }).then(function (data) {
        typeof json === 'object' && json.layer && this.closeLoad(); // 关闭load
        // console.log(data);
        if (data.data && ['cj&result'] === false && data.data['message'] === 'Sorry, you are not logged in') {
          localStorage.setItem('登录报错链接', url);
          localStorage.setItem('登录报错信息', JSON.stringify(backdata));
          // location.href = "login.html" + '?target=' + base64.encode(location.href);
          if (
            // location.href.indexOf('/edit-detail/') > -1 ||
            location.href.indexOf('/addSKU2/') > -1
          ) {
            layer.closeAll('loading');
            window.open("login.html", '_blank', '');
          } else {
            location.href = "login.html" + '?target=' + base64.encode(location.href);
          }
        } else if (data.data && data.data['result'] === false && data.data['message'] === 'Sorry, Unexpected error') {
          layer.closeAll('loading');
          layer.msg('服务器错误');
        } else if (data.data && data.data['result'] === false && (data.data['message'] === 'Sorry, Your access was denied' || data.data['message'] === 'Sorry, Your access is down')) {
          // 拒绝访问
          if (data.data['message'] === 'Sorry, Your access was denied') {
            location.href = 'erp.html';
          } else {
            layer.closeAll('loading');
            layer.msg('Sorry, Your access is down');
          }
        } else {
          successCallback(data);
        }
      }.bind(this), function (backdata) {
        typeof json === 'object' && json.layer && this.closeLoad(); // 关闭load
        // console.log(backdata);
        if (errorCallback) {
          errorCallback(backdata);
        } else {
          layer.msg('网络错误，请稍后再试。');
        }
        layer.closeAll('loading');
      }.bind(this));
    }
    // post请求
    /**
     * post请求
     * @param url {String}               请求地址
     * @param data {JSON | String}       请求数据
     * @param successCallback {Function} 成功回调
     * @param errorCallback {Function}   失败回调
     * @param json {?JSON}                配置项
     */


    this.postFun = function (url, data, successCallback, errorCallback, json = { responseType: null }) {
      /*
      {
          layer: boolean
      }
      */
      typeof json === 'object' && json.layer && this.load(); // 开启load
      let headerObj = {};
      headerObj.token = getToken();
      if (url.indexOf('processOrder/') != -1 || url.indexOf('storehouseSimple/') != -1 || url.indexOf('procurement/') != -1 || url.indexOf('cujiaOthers/') != -1) {
        if (url.indexOf('caigou/') == -1) headerObj.language = 'CN';
      }
      $http.post(getDomainByUrl(url), data, {
        responseType: json.responseType,
        // headers: {'token':token}
        headers: headerObj
      }).then(function (backdata) {
        // console.log(token);
        typeof json === 'object' && json.layer && this.closeLoad(); // 关闭load
        // console.log(backdata);
        if (backdata.data && backdata.data['cj&result'] === false && backdata.data['message'] === 'Sorry, you are not logged in') {
          localStorage.setItem('登录报错链接', url);
          localStorage.setItem('登录报错信息', JSON.stringify(backdata));
          // 限制登录，跳转到登录页
          // location.href = "login.html" + '?target=' + base64.encode(location.href);
          if (location.href.indexOf('/addSKU2/') > -1) {
            layer.closeAll('loading');
            window.open("login.html", '_blank', '');
          } else {
            location.href = "login.html" + '?target=' + base64.encode(location.href);
          }
        } else if (backdata.data && backdata.data['result'] === false && backdata.data['message'] === 'Sorry, Unexpected error') {
          // 未知错误，提示
          layer.closeAll('loading');
          layer.msg('服务器错误');
        } else if (backdata.data && backdata.data['result'] === false && (backdata.data['message'] === 'Sorry, Your access was denied' || backdata.data['message'] === 'Sorry, Your access is down')) {
          // 拒绝访问
          if (data.data['message'] === 'Sorry, Your access was denied') {
            location.href = 'erp.html';
          } else {
            layer.closeAll('loading');
            layer.msg('Sorry, Your access is down');
          }
        } else {
          successCallback(backdata);
        }
      }.bind(this), function (backdata) {
        typeof json === 'object' && json.layer && this.closeLoad(); // 关闭load
        // console.log(backdata);
        if (errorCallback) {
          errorCallback(backdata);
        } else {
          layer.msg('网络错误，请稍后再试。');
        }
        layer.closeAll('loading');
      }.bind(this));
    }
    this.postFun2 = function (url, data, successCallback, errorCallback) {
      $http.post(httpsJson._logistics + url, data).then(function (backdata) {
        successCallback(backdata);
      }, function (backdata) {
        // console.log(backdata);
        errorCallback(backdata);
      });
    }
    // 应急处理
    this.postFun3 = function (url, data, successCallback, errorCallback) {
      $http.post(httpsJson._logistics_com + url, data).then(function (backdata) {
        successCallback(backdata);
      }, function (backdata) {
        // console.log(backdata);
        errorCallback(backdata);
      });
    }
    this.zfPostFun = function (url, data, successCallback, errorCallback) {
      $http.post(httpsJson._zflogistics + url, data).then(function (backdata) {
        successCallback(backdata);
      }, function (backdata) {
        // console.log(backdata);
        errorCallback(backdata);
      });
    }
    // 2019-7-9 xiaoy  ---
    const postFun = this.postFun;
    this.mypost = function (url, params, errcb) {
      return $q((resolve, reject) => {
        layer.load()
        postFun(url, JSON.stringify(params), function ({ data }) {// 返回 statusCode + result || code + data 兼容处理
          layer.closeAll('loading')
          let { result, statusCode, message = 'sucess', code, data: retData } = data;
          statusCode === undefined && (statusCode = code);
          result === undefined && (result = retData);
          if (statusCode != 200) {
            reject(data)
            return message && layer.msg(message);
          }
          resolve(result)
        }, function (err) {
          if (typeof errcb === 'function') return errcb(err)
          console.log('errHandle  --->  ', err)
          reject(err)
          layer.closeAll('loading')
          layer.msg('服务器错误')
        })
      })
    }
    // 2019-7-9 xiaoy  --- ---- ---
    // 2019-12-9 xiaoy ---->>
    this.retUrlQuery = retUrlQuery;
    this.encodeUrl = encodeUrl;
    this.decodeUrl = decodeUrl;
    this.myStorage = myStorage;
    this.mySession = mySession;
    this.setQueryToUrl = setQueryToUrl;
    this.handleTimestampToString = handleTimestampToString;//时间戳转 年月日时分秒 string
    this.navTo = navTo;
    this.upload = upload;
    this.retPayMethodList = retPayMethodList;
    this.handleOssImg = handleOssImg;
    function encodeUrl(url) {
      try {
        url = encodeURI(url)
      } catch (err) { console.log('encodeURI failed') }
      return url
    }
    function decodeUrl(url) {
      try {
        url = decodeURIComponent(url)
      } catch (err) { console.log('decodeUrl failed') }
      return url
    }
    function myStorage(key, val) {
      if (arguments.length === 1) {
        const result = localStorage.getItem(key);
        return result && base64.decode(result)
      }
      try {
        val = base64.encode(val)
        localStorage.setItem(key, val)
      } catch (err) { console.log('localStorage set failed') }
    }
    function mySession(key, val, bol) {
      if (arguments.length === 1) {
        try {
          let result = sessionStorage.getItem(key);
          bol && (result = base64.decode(result));
          return result && JSON.parse(result);
        } catch (err) { console.log('sessionStorage get failed') }
      }
      try {
        val = JSON.stringify(val);
        bol && (val = base64.encode(val));
        sessionStorage.setItem(key, val);
      } catch (err) { console.log('sessionStorage set failed') }
    }
    function retUrlQuery() {//返回url query参数 {}
      let splitArr = decodeUrl(window.location.href).split('?');
      const query = {}
      if (splitArr.length === 1) return query;
      if (splitArr.length > 2) {// 传参url 携带 ? 情况 处理 仅截取 第一个 ? 后半部分
        splitArr = [splitArr.slice[0], splitArr.slice(1).join('?')]
      }
      const queryString = splitArr.pop();
      const re = /([A-z]+)\=([^&]+)/g;
      queryString.replace(re, ($, key, val) => query[key] = val)
      return query;
    }
    function setQueryToUrl(url, query) {
      let str = '';
      let queryArr = []
      for (const key in query) {
        if (query.hasOwnProperty(key)) {
          const val = query[key];
          queryArr.push(key + '=' + val)
        }
      }
      queryArr.length > 0 && (str += queryArr.join('&'))
      return encodeUrl(str ? url + '?' + str : url);
    }
    function handleTimestampToString(timestamp) {
      if (!timestamp) return '';
      let t = new Date(timestamp);
      let y = t.getFullYear();
      let m = t.getMonth() + 1;
      let d = t.getDate();
      return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + t.toTimeString().substr(0, 8);
    }
    function navTo(url, type = '_self') {//_blank
      if (!url) return;
      let a = document.createElement('a')
      a.href = url;
      a.setAttribute('target', type)
      a.click()
      a = null;
    }
    function upload() {
      return $q((resolve, reject) => {
        cjUtils.readLocalFile({}).then(res => {
          res.FileArr.forEach(({ file }) => {// output url for preview by base64=> json.base64
            const { type, size } = file;
            if (/(png|jpe?g)$/.test(type) === false) return layer.msg('上传文件仅支持jpg或png格式');
            if (Math.ceil(size / (1024 * 1024) > 10)) return layer.msg('上传文件不能超过10m');
            layer.load()
            const isOnline = window.environment.includes('production');
            const ossUrl = isOnline ? 'https://app.cjdropshipping.com/app/oss/policy' : 'http://erp.test.com/app/oss/policy';
            cjUtils.uploadFileToOSS({ file, signatureURL: ossUrl })
              .then(url => {//async url for saving =>
                resolve(url)
                layer.closeAll()
              })
              .catch(err => {
                reject(err)
                layer.msg('图片上传失败')
                layer.closeAll()
              })
          })
        })
      })
    }
    function retPayMethodList() {// 2020-03-03 前端写死的支付方式 2019-10月左右 后端要求
      const payMethodList = [
        { payType: '1', payName: '支付宝', payObject: '涂宏名', payBank: '', payAccount: '15000616778' },
        { payType: '1', payName: '支付宝', payObject: '周理志', payBank: '', payAccount: 'zlzshadow@outlook.com' },
        { payType: '2', payName: '微信', payObject: '', payBank: '', payAccount: '' },
        { payType: '3', payName: '银联', payObject: '周理志', payBank: '兴业', payAccount: '622908********5417' },
        { payType: '3', payName: '银联', payObject: '周理志', payBank: '华夏', payAccount: '6230********6837' },
        { payType: '3', payName: '银联', payObject: '涂宏名', payBank: '浦发', payAccount: '6217********5395' }
      ];
      return payMethodList;
    }
    function handleOssImg(url, size = 40) {//处理 阿里云地址 尺寸 问题
      if (!url) return '';
      return url.includes('aliyuncs.com') ? `${url}?x-oss-process=image/resize,w_${size},h_${size}` : url;
    }
    // 2019-12-9 xiaoy <<----
    // 从erp向cj项目发请求用
    this.postFun4 = function (url, data, successCallback, errorCallback) {
      $http.post(httpsJson.app + url, data).then(function (backdata) {
        successCallback(backdata);
      }, function (backdata) {
        // console.log(data);
        errorCallback(backdata);
      });
    }

    // 上传图片post（特殊请求头）
    this.upLoadImgPost = function (url, imgData, successCallback, errorCallback) {
      // 低版本浏览器不兼容
      $http({
        method: 'post',
        url: getDomainByUrl(url),
        data: imgData,
        headers: { 'Content-Type': undefined, 'token': getToken() },
        transformRequest: angular.identity
      }).then(function (data) {
        successCallback(data);
      }, function (data) {
        errorCallback(data);
      });
    }

    // 从数组中通过某个key找到对应的对象索引
    this.findIndexByKey = function (arr, key, value) {
      var res;
      for (var i = 0; i < arr.length; i++) {
        // console.log(arr[i][key],value)
        if (arr[i][key] == value) {
          res = i;
          break;
        }
      }
      if (res >= 0) {
        return res;
      } else {
        return -1;
      }
    }
    // 从数组中通过某个key找到对应的对象索引
    this.findIndexByKey2 = function (arr, value) {
      var res;
      for (var i = 0; i < arr.length; i++) {
        // console.log(arr[i], value)
        if (arr[i] == value) {
          res = i;
          break;
        }
      }
      if (res >= 0) {
        return res;
      } else {
        return -1;
      }
    }
    // 转换时间格式
    this.formatDate = function (date, fn) {
      var t = new Date();
      t.setTime(date);
      var y = t.getFullYear();
      var m = t.getMonth() + 1;
      var m1 = m < 10 ? '0' + m : m;
      var d = t.getDate();
      var d1 = d < 10 ? ('0' + d) : d;
      var h = t.getHours();
      var mm = t.getMinutes();
      var s = t.getSeconds();

      fn && fn({ y, m, d, h, mm, s })
      return y + '-' + m1 + '-' + d1;
    };
    // console.log(formatDate(1512639088421));
    // 查看数组是否有重复项
    this.testIsRepeatInArr = function (arr) {
      var res = false;
      var repeatStr;
      var nary = JSON.parse(JSON.stringify(arr)).sort();
      for (var i = 0; i < arr.length; i++) {
        if (nary[i] == nary[i + 1]) {
          res = true;
          repeatStr = nary[i];
          break;
        }
      }
      return { isrepeat: res, repeatstr: repeatStr };
    }
    // 转换汇率（人民币->美元）
    this.REM2USD = function (num) {
      num = num + '';
      if (num.indexOf('--') == -1) {
        num = num * 1;
        return (num / 6.5).toFixed(2);
      } else {
        var numArr = num.split(' -- ');
        return (numArr[0] / 6.5).toFixed(2) + ' -- ' + (numArr[1] / 6.5).toFixed(2);
      }

    }
    // 加载动画
    this.load = function () {
      var str;
      if (this.lang()) {
        str = '加载中,请稍等';
      } else {
        str = 'Loading, please wait a moment.'

      }
      layer.load(2, {
        shade: [0.3, '#393D49'], content: str, success: function (layero) {
          layero.find('.layui-layer-content').css({
            'width': '300px',
            'padding-left': '36px',
            'padding-top': '5px'
          });
        }
      });
    }
    this.loadfile = function () {
      var str;
      if (this.lang()) {
        str = '上传中';
      } else {
        str = 'Loading, please wait a moment.'

      }
      layer.load(2, {
        shade: [0.3, '#393D49'], content: str, success: function (layero) {
          layero.find('.layui-layer-content').css({
            'width': '300px',
            'padding-left': '36px',
            'padding-top': '5px'
          });
        }
      });
    }
    // this.load2 = function () {
    //   layer.load(2);
    // }
    // 关闭加载动画
    this.closeLoad = function () {
      layer.closeAll('loading');
    }
    this.loadPercent = function ($dom, height, x, y) {
      $dom.css({
        'position': 'relative',
        'min-height': height + 'px'
      });
      var picHeight = 260;
      if ($dom.innerWidth() < 600) {
        picHeight = 180;
      }
      var str;
      if (this.lang()) {
        str = '加载中,请稍等';
      } else {
        str = 'Loading, please wait a moment.'
      }
      var newDom = '<div class="erp-load-percent" style="position: absolute; top: ' + (x || 0) + 'px; left: ' + (y || 0) + 'px; background: #fff; width: ' + $dom.innerWidth() + 'px; height: ' + height + 'px"><div style="height: ' + (picHeight + 50) + 'px; width: 100%; position: absolute; top: 50%; margin-top: -' + ((picHeight + 50) / 2 + 15) + 'px"><div style="height: ' + picHeight + 'px; text-align: center;"><img style="display: inline-block; height: ' + picHeight + 'px;" src="./static/image/public-img/loading_percent.gif" alt="" /></div><p style="text-align: center; color: #f69829; font-size: 14px; line-height: 50px;">' + str + '</p></div></div>';
      $dom.append(newDom);
    }
    this.closeLoadPercent = function ($dom) {
      $dom.find('.erp-load-percent').remove();
      $dom.css('min-height', 'auto');
    }
    this.addNodataPic = function ($dom, height, x, y) {
      $dom.css({
        'position': 'relative',
        'min-height': height + 'px'
      });
      var picHeight = 267;
      // console.log($dom.innerWidth());
      if ($dom.innerWidth() < 600) {
        picHeight = 180;
      }
      var str;
      if (this.lang()) {
        str = '没有找到数据！';
      } else {
        str = 'Sorry, The data is not found.'
      }
      var newDom = '<div class="erp-nodata-pic" style="position: absolute; top: ' + (x || 0) + 'px; left: ' + (y || 0) + 'px; background: #fff; width: ' + $dom.innerWidth() + 'px; height: ' + height + 'px"><div style="height: ' + (picHeight + 50) + 'px; width: 100%; position: absolute; top: 50%; margin-top: -' + (picHeight + 50) / 2 + 'px"><div style="height: ' + picHeight + 'px; text-align: center;"><img style="display: inline-block; height: ' + picHeight + 'px;" src="./static/image/public-img/nodata_new.png" alt="" /></div><p style="text-align: center; color: #87899C; font-size: 14px; line-height: 50px;">' + str + '</p></div></div>';
      $dom.append(newDom);
    }
    this.removeNodataPic = function ($dom) {
      $dom.find('.erp-nodata-pic').remove();
      $dom.css('min-height', 'auto');
    }
    // 判断是否管理员登录
    this.isAdminLogin = function () {
      var loginName = localStorage.getItem('erploginName') ? base64.decode(localStorage.getItem('erploginName')) : '';
      // console.log(loginName);
      if (loginName == 'admin') {
        return true;
      } else {
        return false;
      }
    }
    // 获取登录信息
    this.getUserInfo = function () {
      var erploginName = localStorage.getItem('erploginName') ? base64.decode(localStorage.getItem('erploginName')) : '';
      var erpname = localStorage.getItem('erpname') ? base64.decode(localStorage.getItem('erpname')) : '';
      var erpuserId = localStorage.getItem('erpuserId') ? base64.decode(localStorage.getItem('erpuserId')) : '';
      var job = localStorage.getItem('job') ? base64.decode(localStorage.getItem('job')) : '';
      return {
        erploginName: erploginName,
        erpname: erpname,
        erptoken: getToken(),
        job: job
      }
    }
    // textarea换行符转换
    this.getFormatTextarea = function (strValue) {
      return strValue.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ');
    }
    // 判断是否输入中文
    this.isInputChinese = function (val) {
      return /[\u4E00-\u9FA5]/g.test(val)
    }
    this.lang = function () {
      var lang = localStorage.getItem('lang');
      if (lang) {
        if (lang == 'cn') {
          return true;
        } else if (lang == 'en') {
          return false;
        }
      } else {
        return true;
      }
    }
    //oss上传  id:上传input的id，formData: new FormData(),可传可不传
    //erp.ossFun(id,formData).then((res) => {
    //    // 请求成功的结果
    //    console.log(res);
    //})
    this.ossFun = function (id, formData) {
      formData = formData ? formData : new FormData();
      let deferred = $q.defer();
      let promise = deferred.promise;
      this.postFun('app/oss/policy', {}, function (data) {
        if (data.data.code == 200) {
          let accessid = data.data.accessid;
          let expire = data.data.expire;
          let host = data.data.host;
          let policy = data.data.policy;
          let signature = data.data.signature;
          let file = $('#' + id)[0].files[0];
          let time = new Date().getTime();
          let ReturnUrl = null;
          formData.append('key', time + '-' + file.name);  //存储在oss的文件路径
          formData.append('policy', policy);  //policy
          formData.append('OSSAccessKeyId', accessid);  //accessKeyId
          formData.append('success_action_status', "200");  //成功后返回的操作码
          formData.append('Signature', signature);   //签名
          formData.append('file', file);
          $.ajax({
            url: host,
            type: 'POST',
            data: formData,
            async: true,
            cache: false,
            contentType: false,
            processData: false,
            success: function (returndata) {
              // console.log(returndata);
              // console.log('上传成功');
              layer.closeAll("loading");
              $('#' + id).val('');
              ReturnUrl = host + '/' + time + '-' + file.name;
              console.log(ReturnUrl);
              deferred.resolve(ReturnUrl);
            },
            error: function (returndata) {
              // console.log(returndata);
              // console.log('上传失败');
              layer.closeAll("loading");
            }
          });
        } else {
          layer.closeAll("loading");
          layer.msg('获取签名啥的失败');
        }
      }, function (data) {
        layer.closeAll("loading");
        layer.msg('系统错误');
      });
      return promise;
    };
    function getRandomNumber(start, end, n) {
      var numArr = [];
      for (var i = 0; i < n; i++) {
        var number = Math.floor(Math.random() * (end - start + 1) + start);
        if (numArr.indexOf(number) < 0) {
          numArr.push(number);
        } else {
          i--;
        }
      }
      return numArr;
    }
    // oss上传文件
    this.ossUploadFile = function (fileData, scb) {
      // fileData----$('#xxx')[0].files  xxx--input的id
      // scb-回调函数
      layer.load(2);
      this.postFun('app/oss/policy', {}, function (data) {
        // console.log(data.data);
        if (data.data.code == 200) {
          var accessid = data.data.accessid;
          var expire = data.data.expire;
          var host = data.data.host;
          var policy = data.data.policy;
          var signature = data.data.signature;
          var ReturnUrl = null;
          var succssLinks = [];
          var failIndexs = [];
          // console.log(fileData);
          // console.log(fileData.length);
          for (var i = 0; i < fileData.length; i++) {
            (function (i) {
              var formData = new FormData();
              var time = new Date().getTime();
              var year = new Date().getFullYear();
              var month = new Date().getMonth() + 1;
              var day = new Date().getDate();
              if (month < 10) {
                month = '0' + month
              }
              if (day < 10) {
                day = '0' + day
              }
              var timeStr = year + month + day;
              var randomNumArr = getRandomNumber(0, 2147483647, 2)
              var randomNum1 = randomNumArr[0] + 10;
              var randomNum2 = randomNumArr[1] + 1000;
              var randomFileName = Math.floor(time / randomNum1 * randomNum2);
              var fileArr = fileData[i].name.split('.')
              var fileTypeName = fileArr[fileArr.length - 1];
              formData.append('key', timeStr + '/' + randomFileName + '.' + fileTypeName);
              formData.append('policy', policy);  //policy
              formData.append('OSSAccessKeyId', accessid);  //accessKeyId
              formData.append('success_action_status', "200");  //成功后返回的操作码
              formData.append('Signature', signature);   //签名
              formData.append('file', fileData[i]);
              $.ajax({
                url: host,
                type: 'POST',
                data: formData,
                async: true,
                cache: false,
                contentType: false,
                processData: false,
                success: function (returndata) {
                  // console.log(returndata);
                  // console.log('上传成功');
                  ReturnUrl = host + '/' + timeStr + '/' + randomFileName + '.' + fileTypeName;
                  // console.log(ReturnUrl);
                  succssLinks.push(ReturnUrl);
                },
                error: function (returndata) {
                  // console.log(returndata);
                  failIndexs.push(i);
                  // console.log('上传失败');
                }

              });
            })(i)
          }
          var ossTimer = setInterval(function () {
            if (succssLinks.length == fileData.length) {
              scb({
                code: 1, // 全部上传成功，返回成功链接
                succssLinks: succssLinks
              });
              clearInterval(ossTimer);
              layer.closeAll("loading");
            } else if (failIndexs.length == fileData.length) {
              scb({
                code: 0  // 全部上传失败
              });
              clearInterval(ossTimer);
              layer.closeAll("loading");
            } else if ((failIndexs.length + succssLinks.length) == fileData.length) {
              scb({
                code: 2, // 部分上传成功，返回成功链接和失败索引
                failIndexs: failIndexs,
                succssLinks: succssLinks
              });
              clearInterval(ossTimer);
              layer.closeAll("loading");
            }
          }, 10);

        } else {
          layer.closeAll("loading");
          layer.msg('获取签名失败');
          scb({
            code: 0  // 全部上传失败
          });
        }
      }, function () {
        scb({
          code: 0  // 全部上传失败
        });
      });
      // return promise;
    };
    // 计算利润率
    this.cacuProfitRate = function (price1, price2) {
      // price1-销售价，price2-成本价
      var rateRes;
      if (!price1) {
        price1 = '';
      }
      if (!price2) {
        price2 = '';
      }
      var price1 = (price1 + '').replace(' -- ', '--');
      var price2 = (price2 + '').replace(' -- ', '--');
      var price2Arr;
      var price1Arr;
      if (price1.indexOf('--') == -1) {
        if (price2.indexOf('--') == -1) {
          rateRes = Math.round((((price1 * 1) - (price2 * 1)) / (price2 * 1)) * 100) + '%';
        } else {
          price2Arr = price2.split('--');
          rateRes = Math.round((((price1 * 1) - (price2Arr[0] * 1)) / (price2Arr[0] * 1)) * 100) + '%' + '--' + Math.round((((price1 * 1) - (price2Arr[1] * 1)) / (price2Arr[1] * 1)) * 100) + '%';
        }
      } else {
        price1Arr = price1.split('--');
        if (price2.indexOf('--') == -1) {
          rateRes = Math.round((((price1Arr[0] * 1) - (price2 * 1)) / (price2 * 1)) * 100) + '%' + '--' + Math.round((((price1Arr[1] * 1) - (price2 * 1)) / (price2 * 1)) * 100) + '%';
        } else {
          price2Arr = price2.split('--');
          rateRes = Math.round((((price1Arr[0] * 1) - (price2Arr[0] * 1)) / (price2Arr[0] * 1)) * 100) + '%' + '--' + Math.round((((price1Arr[1] * 1) - (price2Arr[1] * 1)) / (price2Arr[1] * 1)) * 100) + '%';
        }
      }
      return rateRes;
    }

    // 计算平均数数
    this.cacuAverage = function (price, shipCost) {
      var priceAmount;
      if (!price) {
        price = 0;
      }
      if (!shipCost) {
        shipCost = 0;
      }
      var price = (price + '').replace(/%/g, '');
      var shipCost = (shipCost + '').replace(/%/g, '');
      var shipCostArr;
      var priceArr;
      if (price.indexOf('--') == -1) {
        if (shipCost.indexOf('--') == -1) {
          priceAmount = Math.round((price * 1 + shipCost * 1) / 2) + '%';
        } else {
          shipCostArr = shipCost.split('--');
          priceAmount = Math.round((price * 1 + shipCostArr[0]) / 2) + '%--' + Math.round((price * shipCostArr[1] * 1) / 2) + '%';
        }
      } else {
        priceArr = price.split('--');
        if (shipCost.indexOf('--') == -1) {
          priceAmount = Math.round((priceArr[0] * 1 + shipCost * 1) / 2) + '%--' + Math.round((priceArr[1] * 1 + shipCost * 1) / 2) + '%';
        } else {
          shipCostArr = shipCost.split('--');
          priceAmount = Math.round((priceArr[0] * 1 + shipCostArr[0] * 1) / 2) + '%--' + Math.round((priceArr[1] * 1 + shipCostArr[1] * 1) / 2) + '%';
        }
      }
      return priceAmount;
    }
    // 计算折扣价
    this.cacuDiscount = function (price, discount) {
      if (!price) {
        return 0;
      }
      var priceRes;
      var price = (price + '').replace(' -- ', '--');
      var discount = (discount + '').replace(' -- ', '--');
      var discountArr;
      var priceArr;
      if (price.indexOf('--') == -1) {
        if (discount.indexOf('--') == -1) {
          priceRes = (price * (100 - discount * 1) / 100).toFixed(2);
        } else {
          discountArr = discount.split('--');
          priceRes = (price * (100 - discountArr[0] * 1) / 100).toFixed(2) + '--' + (price * (100 - discountArr[1] * 1) / 100).toFixed(2);
        }
      } else {
        priceArr = price.split('--');
        if (discount.indexOf('--') == -1) {
          priceRes = (priceArr[0] * (100 - discount * 1) / 100).toFixed(2) + '--' + (priceArr[1] * (100 - discount * 1) / 100).toFixed(2);
        } else {
          discountArr = discount.split('--');
          priceRes = (priceArr[0] * (100 - discountArr[0] * 1) / 100).toFixed(2) + '--' + (priceArr[1] * (100 - discountArr[1]) / 100).toFixed(2);
        }
      }
      return priceRes;
    }
    // 计算总数
    this.cacuAmount = function (price, shipCost) {
      // price: 1 -- 2  shipCost: 3 -- 4
      var priceAmount;
      if (!price) {
        price = 0;
      }
      if (!shipCost) {
        shipCost = 0;
      }
      var price = (price + '').replace(' -- ', '--');
      var shipCost = (shipCost + '').replace(' -- ', '--');
      var shipCostArr;
      var priceArr;
      if (price.indexOf('--') == -1) {
        if (shipCost.indexOf('--') == -1) {
          priceAmount = (price * 1 + shipCost * 1).toFixed(2);
        } else {
          shipCostArr = shipCost.split('--');
          priceAmount = (price * 1 + shipCostArr[0] * 1).toFixed(2) + ' -- ' + (price * 1 + shipCostArr[1] * 1).toFixed(2);
        }
      } else {
        priceArr = price.split('--');
        if (shipCost.indexOf('--') == -1) {
          priceAmount = (priceArr[0] * 1 + shipCost * 1).toFixed(2) + ' -- ' + (priceArr[1] * 1 + shipCost * 1).toFixed(2);
        } else {
          shipCostArr = shipCost.split('--');
          priceAmount = (priceArr[0] * 1 + shipCostArr[0] * 1).toFixed(2) + ' -- ' + (priceArr[1] * 1 + shipCostArr[1] * 1).toFixed(2);
        }
      }
      return priceAmount;
    }
    // 数组去重
    this.uniqueArray = function (arr) {
      var tempArr = new Array();
      for (var i = 0; i < arr.length; i++) {
        if (tempArr.indexOf(arr[i]) == -1) {
          tempArr.push(arr[i]);
        }
      }
      return tempArr;
    }
    // 读取url查询字符串
    this.getQueryString = function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return decodeURI(r[2]);
      return null;
    }
    this.getAppUrl = () => {
      if (/test/.test(environment)) {
        return 'http://app.test.com';
      } else if (/production##$/.test(environment)) {
        return 'https://app.cjdropshipping.com';
      } else if (/production-cn##$/.test(environment)) {
        return 'https://app.cjdropshipping.cn';
      }
    }

    this.getCodUrl = () => {
      if (/development##$/.test(environment)) {
        return 'http://192.168.4.238:8082';
      } else if (/test/.test(environment)) {
        return 'http://192.168.5.239:7901';
      } else if (/production##$/.test(environment)) {
        return 'https://cod.cjdropshipping.com';
      } else if (/production-cn##$/.test(environment)) {
        return 'https://cod.cjdropshipping.com';
      }
    }

    this.getSupplierAppUrl = () => {
      if (/test/.test(environment)) {
        return 'http://192.168.5.239';
      } else if (/production##$/.test(environment)) {
        return 'https://suppliers.cjdropshipping.cn';
      } else if (/production-cn##$/.test(environment)) {
        return 'https://suppliers.cjdropshipping.cn';
      }
    }
    // 获取类目
    this.getCateList = () => {
      const data = localStorage.getItem('categorylist')
      return new Promise(resolve => {
        if (data) {
          resolve(JSON.parse(data))
        } else {
          console.log('------------------------')
          const p = $http.get('static/json/category.json')
          console.log("this.getCateList -> p", p)
          p.success(res => {
            localStorage.setItem('categorylist', JSON.stringify(res));
            resolve(res)
          });
        }
      })
    }

    // 设置仓库列表到session
    this.setStorageToSession = function (dataKindId = 'cangku') {// 获取仓库列表
      return new Promise((resolve, reject) => {
        const params = {
          dataKindId,// 数据分类 cangKu 仓库 默认 cangku
        }
        this.postFun('app/user/getUserDataKindItems', JSON.stringify(params), function (data) {
          if (data.data.code != 200) return reject()
          const list = data.data.data
          if (dataKindId == 'cangku') window.sessionStorage.setItem('storageList', JSON.stringify(list))
          resolve(list)
        })
      })
    }
    // getStorage()

    /**
     * fun 回调函数
     * permissioin 仓库是否有采购权限
     */
    this.getStorage = function (fun, permission) {// 获取仓库列表
      let storageList = window.sessionStorage.getItem('storageList') || '[]'
      if (!storageList || storageList == '[]') return !fun ? [] : fun([])
      storageList = JSON.parse(storageList)
      if (!permission) return !fun ? storageList : fun(storageList)
      const params = {
        useStorageType: 2,// 仓库类型 0测试 1真实 2虚拟
        purchasingAuthority: permission,// 该仓库是否有采购权限，0否，1是
      }
      this.postFun('storehouse/WarehousInfo/getStorehouse', JSON.stringify(params), function (res) {
        if (res.data.code != 200) return layer.msg('获取仓库失败')
        const list = res.data.data
        const retList = []
        console.log(storageList, list)
        storageList.forEach(function (item, index) {
          list.forEach(function (_, i) {
            if (item.dataId == _.id) retList.push(item)
          })
        })
        fun(retList)
      })

    }

    // 显示对应仓库
    this.showStoreName = function (store, id, virtual = false) {
      const storageList = virtual ? warehousePurList.map((value, label, id) => ({ store: value, name: label, id: id[0] })) : window.warehouseList
      let storeName = ''
      if (id) storeName = storageList.find(_ => _.id == id).name
      if (store) storeName = storageList.find(_ => _.store == store).name
      return storeName || '--'
    }

    // 防抖
    this.deBounce = function (fn, delay) {
      var timer
      return function () {
        clearTimeout(timer)
        var context = this
        var args = arguments
        timer = setTimeout(function () {
          fn.apply(context, args)
        }, !!delay ? delay : 500)
      }
    }

    // 拷贝对象
    this.deepClone = function (obj) {
      var objClone = Array.isArray(obj) ? [] : {}
      if (obj && typeof obj === 'object') {
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
              objClone[key] = arguments.callee(obj[key])
            } else {
              objClone[key] = obj[key]
            }
          }
        }
      }
      return objClone
    }

    // import module
    window.importModule = function (url) {
      const rootPath = 'static/newPages/' // 根目录
      document.write("<script type='text/javascript' src='" + rootPath + url + "'></script>")
    }

    // 采购员列表
    this.getPurchasePerson = function (callback) {
      this.postFun('procurement/caigouJobAssignment/getErpEmployeeList', JSON.stringify({}), function (res) {
        if (res.data.code == 200) callback(res.data.data)
      })
    }

    // 采购员关联订单 以sku来获取采购人
    this.getPurchasesBySku = function ({ orderId, stanProductId, stanSku, callback }) {
      if (!orderId || (!stanProductId && !stanSku)) return layer.msg('暂不支持此操作')

      const load = layer.load(0)
      this.postFun(
        'procurement/cost/getBuyerInfo',
        JSON.stringify({ orderId, stanProductId, stanSku }),
        function (res) {
          layer.close(load)
          if (res.data.code != 200) return layer.msg(res.data.message || '获取采购员失败')
          const list = res.data.data
          if (!list || list.length <= 0) return layer.msg('暂无采购人员')
          callback({ purchases: list })
        })
    }

    // 获取缩略图
    const IMG_SUFFIX_ARRAY = ['jpeg', 'png', 'gif', 'jpg', 'jfif']
    this.getThumpPic = function (url) {
      const suffix = '?x-oss-process=image/resize,m_lfit,h_100,w_100'
      const arr = url.split('.')
      const len = arr.length
      const endSuffix = arr[len - 1]
      if (!IMG_SUFFIX_ARRAY.includes(endSuffix)) return url
      return url + suffix
    }

    // 下载文件
    this.loadDown = function ({ url, params, callback, fileName = 'xlsx' }) {
      // 下载excel
      // const url = 'procurement/order/exportCaigouInfo'
      const xhr = new XMLHttpRequest()
      xhr.open('POST', getDomainByUrl(url), true) // 也可以使用POST方式，根据接口
      xhr.setRequestHeader('token', getToken() || '')
      xhr.setRequestHeader('content-type', 'application/json')
      xhr.responseType = 'blob'
      xhr.onload = function () {
        if (this.status === 200) {
          const content = this.response
          const aTag = document.createElement('a')
          const blob = new Blob([content])
          // const headerName = xhr.getResponseHeader('Content-disposition')
          // const fileName = decodeURIComponent(headerName).substring(20)
          aTag.download = new Date().getTime() + '.' + fileName
          // eslint-disable-next-line compat/compat
          aTag.href = URL.createObjectURL(blob)
          aTag.click()
          // eslint-disable-next-line compat/compat
          URL.revokeObjectURL(blob)
          callback()
        } else {
          layer.msg('网络错误,请检查网络')
        }
      }
      xhr.send(JSON.stringify(params))
    }

    //去app商品详情页
    this.toAppDetail = (obj) => {
      let environment = window.environment;
      let url;
      if (/test/.test(environment)) {
        url = 'http://app.test.com'
      } else if (/production##$/.test(environment)) {
        url = 'https://app.cjdropshipping.cn'
      } else {
        url = 'https://app.cjdropshipping.com'
      }
      window.open(`${url}/product-detail.html?id=${obj.id}`)
    }
    this.getWarehouseType = (obj) => {
      const store = this.getStorage();
      console.clear()
      console.log(store)
      let newStore = store.filter(item => {
        if (item.dataName.indexOf('直发') == -1) {
          switch (item.dataId) {
            case 'bc228e33b02a4c03b46b186994eb6eb3':
              item.type = '0';
              break;
            case '08898c4735bf43068d5d677c1d217ab0':
              item.type = '1';
              break;
            case 'd3749885b80444baadf8a55277de1c09':
              item.type = '2';
              break;
            case '201e67f6ba4644c0a36d63bf4989dd70':
              item.type = '3';
              break;
            case 'f87a1c014e6c4bebbe13359467886e99':
              item.type = '4';
              break;
            case '522d3c01c75e4b819ebd31e854841e6c':
              item.type = '5';
              break;
            case 'e18668c0-0b6b-4d07-837e-fe2150d9d9c9':
              item.type = '6';
              break;
            case '55cbb9d2-8dcc-469e-aea2-40890c26cf7c':
              item.type = '7';
              break;
          }
          return item;
        }
      })
      return newStore;
    }

    this.setDrag = (obj) => {
      // drag  拖拽关联弹窗
      const dragBox = document.getElementById(obj.id)
      const dragEv = dragBox.getElementsByClassName(obj.class)[0]
      let x = 0, y = 0, l = 0, t = 0, isDown = 0;

      //鼠标按下事件
      dragEv.onmousedown = function (e) {
        //获取x坐标和y坐标
        x = e.clientX;
        y = e.clientY;

        //获取左部和顶部的偏移量
        l = dragBox.offsetLeft;
        t = dragBox.offsetTop;
        //开关打开
        isDown = true;
        //设置样式
        // dragEv.style.cursor = 'move';
      }
      //鼠标移动
      window.onmousemove = function (e) {
        if (isDown == false) {
          return;
        }
        //获取x和y
        var nx = e.clientX;
        var ny = e.clientY;
        //计算移动后的左偏移量和顶部的偏移量
        var nl = nx - (x - l);
        var nt = ny - (y - t);

        dragBox.style.left = nl + 'px';
        dragBox.style.top = nt + 'px';
      }
      //鼠标抬起事件
      dragEv.onmouseup = function () {
        //开关关闭
        isDown = false;
        // dragEv.style.cursor = 'default';
      }
    }
    this.sliceSku = function (str) {// 与后端 约定 -->> 条形码 短码+批次号  后七位 为批次号
      if (!str) return '';
      if (str.length < 7) return str;
      str = str + '';
      try {
        str = str.substring(0, str.length - 7);
        console.log(str)
      } catch (err) {
        console.log('sliceSku', err)
      }
      return str;
    }
  })

  app.filter('ImgSizeProcess', function () {
    return function (url, ...args) {
      if (typeof url !== 'string') return url

      let json = null, size = 200 // 默认宽高 200 * 200

      if (args.length === 1) json = { w: args[0] }
      else if (args.length === 2) json = { w: args[0], h: args[1] }
      else { json = { w: size, h: size } }

      return imageSizeProcess(url, json);
    }
  });

  /**
   * 图片大小处理[oss服务器自带]
   * @param {String} url 图片链接
   * 文档链接 [https://help.aliyun.com/document_detail/44688.html]
   */
  function imageSizeProcess(url, param = {}) {
    let str = `${url}?x-oss-process=image/resize` // https://cc-west-usa.oss-us-west-1.aliyuncs.com/15330528/2076770670210.jpg?x-oss-process=image/resize,w_200,h_200

    for (let k in param) str += `,${k}_${param[k]}`

    return str
  }
}