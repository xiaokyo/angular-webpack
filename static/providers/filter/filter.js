/**
 * 自定义全局过滤器
 */

; (function () {
  var app = angular.module('custom-filter', []);

  app.filter('IMG_SIZE', function () {
    return function (url, ...args) {
      if (typeof url !== 'string') return url;
      var json = {}, size = 200, str = `${url}?x-oss-process=image/resize,m_fill`;

      if (args.length === 1) json = { w: args[0] };
      else if (args.length === 2) json = { w: args[0], h: args[1] };
      else { json = { w: size, h: size } };
      for (var k in json) str += `,${k}_${json[k]}`;
      return str;
    }
  });

  app.filter('imgSeparator', function () {
    return function (url) {
      if (typeof url !== 'string') return url;
      try {
        return url.split(',')[0]
      } catch (e) {
        console.warn(e);
        return url;
      }
    }
  })

  app.filter('httpPrefix', function () {
    return function (url) {
      try {
	      return `https://${url.replace('https://', '').replace('http://', '')}`;
      } catch (e) {
        console.warn(e);
        return url;
      }
    }
  })
  
  app.filter('signStatus', function () {
    return function(val) {
		  let name;
		  switch(+val){
			case 2:
			  name='待签收';
			  break;
			case 3:
			  name='已签收';
			  break;
			case 4:
			  name='部分签收';
			  break;
		  }
		  return name;
		}
  })

  app.filter('storeFilter', function () {
    return function(val) {
		  let name;
		  switch(+val){
        case 0:
          name='义乌仓';
          break;
        case 1:
          name='深圳仓';
          break;
        case 2:
          name='美西仓';
          break;
        case 3:
          name='美东仓';
          break;
        case 4:
          name='泰国仓';
          break;
        case 5:
          name='金华仓';
          break;
		  }
		  return name;
		}
  })

  app.filter('procurementFilter', function () {
    return function(val) {
      let name = '';
		  switch(+val){
        case 0:
          name='1688非API';
          break;
        case 1:
          name='1688API';
          break;
        case 2:
          name='淘宝';
          break;
        case 3:
          name='天猫';
          break;
        case 4:
          name='线下';
          break;
        }
        return name;
      }
  })
}());
