import angular from 'angular'
import angularSanitize from 'angular-sanitize';
import uirouter from 'angular-ui-router'
import oclazyload from 'oclazyload'
import translate from 'angular-translate'
import angularTranslateFileLoader from 'angular-translate-loader-static-files';
import { Base64 as bs } from 'js-base64'
import routers from '../routers/routers'

// style
import './common.less'

// 导出app实例
export const app = angular.module('manage', [
  angularSanitize,
  translate,
  angularTranslateFileLoader,
  uirouter,
  oclazyload,
])

/**启动项目 */
export const start = () => {
  app.controller('manage.ctrl', function ($scope, $window, $location, erp, $translate, $rootScope, $http) {
    $scope.firstNavList = [];
    var loginJob = localStorage.getItem('job') ? bs.decode(localStorage.getItem('job')) : '';
    const userId = localStorage.getItem('erpuserId') ? bs.decode(localStorage.getItem('erpuserId')) : '';
    console.log(loginJob, userId)
    var cebianwidth;

    erp.setStorageToSession()

    getMenuFn()
    //获取导航
    function getMenuFn() {
      const localNav = localStorage.getItem('nav')
      const params = {
        // news: !localNav ? '1' : '0',
        news: '1',
        version: '2'
      }
      //获取导航 数字 对应字典json
      $http.get(`./static/js/manage/menuCount.json?v=${window.BUILD_VERSION}`).then(({ data: countJson }) => {
        $scope.countJson = countJson
        erp.postFun('control/api/getUserMenuTree', JSON.stringify({ sysId: 3, userId }), ({ data: res }) => {
          const { code, data: newMenu } = res
          if (code === 200) {
            $scope.firstNavList = newMenu.map(item => {
              item.name = item.code
              item.img = item.v1 || ''
              item.children = item.child.map(child => {
                child.name = child.code
                child.children = child.child.map(third => {
                  third.name = third.code
                  return third
                })
                return child
              })
              return item
            })
            $scope.disposeMenuByJob()
            erp.postFun('app/menu/getMenu', JSON.stringify(params), ({ data: result }) => {
              $scope.firstNavList = $scope.firstNavList.map(nav => { //遍历菜单，获取一级菜单
                const firstName = nav.name //获取一级菜单的name
                //如果一级菜单的name存在于字典中并且其对应的后台key存在，才需要遍历一级菜单,注：顾虑掉订单模块（100002）
                if (firstName !== '100002' && countJson[firstName] && result[countJson[firstName].javaName]) {
                  //获取字典对应key的后台数字集合
                  const countList = result[countJson[firstName].javaName]
                  //二级菜单字典集合
                  const secondChild = countJson[firstName].child
                  nav.children = nav.children.map(second => { //遍历一级菜单，获得二级菜单
                    //只有菜单二级名称存在于二级菜单字典集合中，才需要对其和子集添加数字
                    if (secondChild[second.name]) {
                      //客户模块 未通过，需审核，黑名单需要再从list中获取
                      if (['100892', '100608', '100891'].includes(second.name)) {
                        countList.list.forEach(_ => {
                          if (_.STATUS === secondChild[second.name].strName) second.count = _.num || 0
                        })
                      } else {
                        second.count = secondChild[second.name].strName ? countList[secondChild[second.name].strName] || 0 : ''
                      }
                      //如果二级菜单字典存在子集且菜单menu也存在子集，则遍历三级菜单
                      if (secondChild[second.name].child && second.children && second.children.length > 0) {
                        //三级菜单字典集合
                        const thirdChild = secondChild[second.name].child
                        second.children = second.children.map(third => {
                          third.count = thirdChild[third.name] ? countList[thirdChild[third.name]] || 0 : ''
                          return third
                        })
                      }
                    }
                    return second
                  })
                }
                return typeof handleModiftHref === 'undefined' ? nav : handleModiftHref(nav);
              })
              $scope.disposeOrder(result['100002'])
            })
          }
        })
      })
    }

    $scope.cebianList = []
    var count = 0;
    $scope.renderFinish = function () {
      var url = `#${$location.path()}`;
      getFirstNav(url)
    }
    // 通过监视锚点值动态的给当前nav添加类名active
    $scope.loca = $location;
    $scope.$watch('loca.url()', function (now, old) {
      var url = "#" + now;
      $scope.firstNavList && getFirstNav(url)
    })
    //根据当前路由匹配符合的以及类目和当前导航索引
    function getFirstNav(url) {
      let targetUrl = url.includes('?') ? url.split('?')[0] : url
      console.log(url, targetUrl)
      let navArr = [],
        documentName = '',
        hasActive = false
      $scope.firstNavList.forEach((item, idx) => {
        item.isActive = false
        if (item.href === targetUrl) { //匹配一级目录
          item.isActive = true
          hasActive = true
        }
        item.children && item.children.length > 0 && item.children.forEach((second, secondIdx) => {
          second.isActive = false
          if (second.href === targetUrl) { //匹配二级目录
            navArr = [idx, secondIdx, 0]
            item.isActive = true
            second.isActive = true
            documentName = `${$translate.instant(second.name)}`
            hasActive = true
          }
          second.children && second.children.length > 0 && second.children.forEach((third, thirdIdx) => {
            third.isActive = false
            if (third.href === targetUrl || (third.name === '老服务商品' && targetUrl.includes('#/merchandise/list/service'))) {//匹配三级目录
              navArr = [idx, secondIdx, thirdIdx]
              documentName = `${$translate.instant(third.name)}-${$translate.instant(second.name)}`
              item.isActive = true
              second.isActive = true
              third.isActive = true
              hasActive = true
            }
          })
        })
      })
      console.log('是否匹配到 =>', hasActive, sessionStorage.getItem('clickAddr'))
      if (!hasActive && sessionStorage.getItem('clickAddr')) {
        navArr = sessionStorage.getItem('clickAddr').split(',')
        console.log(navArr)
        $scope.firstNavList.map((_item, _idx) => {
          if (_idx === +navArr[0]) {
            _item.isActive = true
            _item.children = _item.children.map((_second, _sidx) => {
              if (_sidx === +navArr[1]) {
                _second.isActive = true
                documentName = `${$translate.instant(_second.name)}`
                _second.children = _second.children.map((_third, _tidx) => {
                  if (_tidx === +navArr[2]) {
                    _third.isActive = true
                    documentName = `${$translate.instant(_third.name)}-${$translate.instant(_second.name)}`
                  }
                  return _third
                })
              }
              return _second
            })
          }
          return _item
        })
      }
      if (url == '#/erpservice/sc' || url == '#/erpservice/lookchart') {
        document.title = '客户聊天室';
      } else {
        document.title = documentName;
      }
      const idx1 = +navArr[0]
      const idx2 = +navArr[1]
      const idx3 = +navArr[2]
      sessionStorage.setItem('clickAddr', navArr)
      if ($scope.firstNavList[idx1] &&
        $scope.firstNavList[idx1].children[idx2] &&
        $scope.firstNavList[idx1].children[idx2].children &&
        $scope.firstNavList[idx1].children[idx2].children.length > 0) {
        //获取侧边导航数组
        $scope.cebianList = $scope.firstNavList[idx1].children[idx2].children.map((cebian, idx) => {
          cebian.isActive = idx === idx3
          return cebian
        })
        $scope.isZhankai = localStorage.getItem('isZhankai') ? true : false
      } else {
        $scope.cebianList = []
      }
    }

    $scope.renderFinish2 = function () {
      clearTimeout(timeouters);
      timeouters = setTimeout(function () {
        var w = $('.cebian-content'); //[0].clientWidth
        var ew = w[0].clientWidth;
        cebianwidth = ew + 62 + 'px';
        localStorage.setItem('cebianWidth', cebianwidth);
        $('.cebian-nav').css('width', $scope.isZhankai ? cebianwidth : '25px')
      }, 1000);
    };

    $scope.$on('ngRepeatFinished', function () {
      setWaterFall();
    });

    function setWaterFall() {
      count++;
      if (count == $('.header-nav').find('.second-nav').length) {
        //console.log($('.header-nav').find('.second-nav'));
        var parentList = $('.header-nav').find('.second-nav');
        waterFall(parentList);
      }
    }

    /**
     * 获取链接格式
     * @param {string} href 链接
     */
    $scope.setHref = function (href) {
      if (!href) return 'javascript:void(0)'

      // manage url
      let nav = href
      if (nav.startsWith('#')) {
        nav = nav.replace('#', '')
        const route = routers.find(_ => _.url == nav)
        
        // old url
        if (!route) return `/manage.html${href}`
      }

      return href
    }

    function waterFall(parentList) {
      //console.log(parentList);
      var columns = 2; //3列
      var itemWidth = 300;
      $.each(parentList, function (i, v) {
        var target = $(v);
        var childList = target.find('.s-content');
        //console.log(childList);
        var arr = [];
        childList.each(function (i) {
          var boxheight = $(this).height(); //
          //console.log(boxheight);
          if (i < columns) {
            // 2- 确定第一行
            $(this).css({
              top: 0,
              left: (itemWidth) * i
            });
            arr.push(boxheight);
          } else {
            // 其他行
            // 3- 找到数组中最小高度  和 它的索引
            var minHeight = arr[0];
            var index = 0;
            for (var j = 0; j < arr.length; j++) {
              if (minHeight > arr[j]) {
                minHeight = arr[j];
                index = j;
              }
            }
            // 4- 设置下一行的第一个盒子位置
            // top值就是最小列的高度
            $(this).css({
              top: arr[index],
              left: target.find('.s-content').eq(index).css("left")
            });

            // 5- 修改最小列的高度
            // 最小列的高度 = 当前自己的高度 + 拼接过来的高度
            arr[index] = arr[index] + boxheight;
          }
        });
      });

    }
    /** 2019-12-21 导航 */
    //导航一级类目划入
    $scope.navMouseEnterFn = nav => {
      $scope.firstNavList = $scope.firstNavList.map(item => {
        item.isHover = item.href === nav.href
        return item
      })
    }
    //导航一级类目划出
    $scope.navMouseLeaveFn = () => {
      $scope.firstNavList = $scope.firstNavList.map(item => {
        item.isHover = false
        return item
      })
    }
    //点击类目
    $scope.clickMenu = (ev, item, type) => {
      ev.stopPropagation()
      // console.log($translate.instant(item.name))
      const name = $translate.instant(item.name)
      console.log(name)
      if (name.trim() == '退出' || name.trim() == 'Drop out') { //点击的是退出操作
        logout()
        sessionStorage.removeItem("clickAddr")
      } else if (['母订单', 'Bulk Order', '子订单', 'Sub Orders', '直发订单', 'Wholesale Orders', '私有库存订单', 'Private Pre-stock Orders', '视频订单'].includes(name.trim())) {
        erp.postFun('app/order/getOrderCount', {}, res => {
          res.data && $scope.disposeOrder(res.data)
        }, _ => _)
      } else if (['打印暗转明', '批量设置设计商品价格折扣', 'Bulky price discount setting', '直发商品折扣', 'Discount of wholesale product', 'Role rights management', '角色权限管理', 'IP查询', 'IP Inquiry'].includes(name.trim())) {
        printFun(name.trim())
      }

    }
    //对order菜单进行特殊处理
    $scope.disposeOrder = item => {
      const orderDictionaries = $scope.countJson['100002'].child
      $scope.firstNavList = $scope.firstNavList.map(nav => {
        if (nav.name === '100002') {
          nav.children = nav.children.map(second => {
            //当订单中的二级菜单名称存在于订单字典集合中时，才需要遍历赋值
            if (orderDictionaries[second.name]) {
              const orderCountList = item[orderDictionaries[second.name].strName]
              const orderThirdChild = orderDictionaries[second.name].child
              second.children = second.children.map(third => {
                third.count = orderThirdChild[third.name] ? orderCountList[orderThirdChild[third.name]] || 0 : ''
                return third
              })
            }
            return second
          })
        }
        return nav
      })
      localStorage.setItem('nav', JSON.stringify($scope.firstNavList))
    }
    //处理不同职位显示的不同路由
    $scope.disposeMenuByJob = () => {
      const loginJobList = ['销售', '管理', '人事']
      $scope.firstNavList = $scope.firstNavList.map(item => {
        if (item.name === '100001') {
          item.href = loginJobList.includes(loginJob) ? '#/mycj/ywyHome' : '#/mycj/commonHome'
          item.children = item.children.map(child => {
            if (child.code === 'Home') child.href = loginJobList.includes(loginJob) ? '#/mycj/ywyHome' : '#/mycj/commonHome'
            return child
          })
        }
        return item
      })
    }
    //侧边导航展开收起
    $scope.shrinkFn = type => {
      $scope.isZhankai = type === 'zhankai'
      console.log($scope.isZhankai)
      $('.cebian-nav').animate({ width: $scope.isZhankai ? cebianwidth : '25px' })
      type === 'zhankai' ?
        localStorage.setItem('isZhankai', '1') :
        localStorage.removeItem('isZhankai')
    }
    //点击侧边导航
    $scope.clickCebianfn = () => {
      const addr = sessionStorage.getItem('clickAddr')
      if (addr) {
        const clickArr = addr.split(',')
        if ($scope.firstNavList[clickArr[0]].name == '100002') {
          erp.postFun('app/order/getOrderCount', {}, res => {
            res.data && $scope.disposeOrder(res.data)
          }, _ => _);
        }
      }
    }

    //拖拽
    var mx = 0,
      my = 0; //鼠标x、y轴坐标（相对于left，top）
    var dx = 0,
      dy = 0; //对话框坐标（同上）
    var isDraging = false;
    var scrollheight = 0;
    var menu = $('#cebian-menu');
    //鼠标按下
    $('.zhankaiyidong').mousedown(function (e) {
      e.preventDefault();
      e = e || window.event;
      mx = e.pageX; //点击时鼠标X坐标
      my = e.pageY; //点击时鼠标Y坐标
      dx = menu.offset().left;
      dy = menu.offset().top;
      isDraging = true; //标记对话框可拖动
      var dialogW = menu.width();
      var dialogH = menu.height();
      //console.log('鼠标位置：'+mx+' , '+my);
      //console.log('元素位置：'+dx+' , '+dy);
      //console.log('元素宽高：'+dialogW+' , '+dialogH);
    });
    $('#yidong').mousedown(function (e) {
      e.preventDefault();
      e = e || window.event;
      mx = e.pageX; //点击时鼠标X坐标
      my = e.pageY; //点击时鼠标Y坐标
      dx = menu.offset().left;
      dy = menu.offset().top;
      isDraging = true; //标记对话框可拖动

      var dialogW = menu.width();
      var dialogH = menu.height();
      //console.log('鼠标位置：'+mx+' , '+my);
      //console.log('元素位置：'+dx+' , '+dy);
      //console.log('页面滚动：'+scrollheight);
      //console.log('元素宽高：'+dialogW+' , '+dialogH);
    });
    $(window).scroll(function () {
      //console.log($(window).scrollTop());
      scrollheight = $(window).scrollTop();
    });
    //鼠标移动更新窗口位置
    $(document).mousemove(function (e) {
      var e = e || window.event;
      var x = e.pageX; //移动时鼠标X坐标
      var y = e.pageY - scrollheight; //移动时鼠标Y坐标

      dy = dy - scrollheight;
      my = my - scrollheight;
      if (isDraging) { //判断对话框能否拖动
        //console.log(x+','+y);
        var moveX = dx + x - mx; //移动后对话框新的left值
        var moveY = dy + y - my; //移动后对话框新的top值
        //设置拖动范围
        var pageW = $(window).width();
        var pageH = $(window).height();
        var dialogW = menu.width();
        var dialogH = menu.height();
        var maxX = pageW - dialogW; //X轴可拖动最大值
        var maxY = pageH - dialogH; //Y轴可拖动最大值
        moveX = Math.min(Math.max(250, moveX), maxX); //X轴可拖动范围
        moveY = Math.min(Math.max(0, moveY), maxY); //Y轴可拖动范围
        //重新设置对话框的left、top

        menu.css({ "left": moveX + 'px', "top": moveY + 'px' });
      };
    });

    //鼠标离开
    $('.zhankaiyidong').mouseup(function () {
      isDraging = false;
    });
    $('#yidong').mouseup(function () {
      isDraging = false;
    });
    var timeouters;

    $scope.change_lang = 'en';
    $scope.changeLanguage = function (lang) {

      if (lang == 'cn') {
        $translate.use(lang);
        $scope.change_lang = 'en';
        //$('.header-nav>ul>li>a').css("padding", '0 25px');
        localStorage.setItem('lang', 'cn');
      } else if (lang == 'en') {
        $translate.use(lang);
        $scope.change_lang = 'cn';
        //$('.header-nav>ul>li>a').css("padding", '0 10px');
        localStorage.setItem('lang', 'en');
      }

      clearTimeout(timeouters);
      timeouters = setTimeout(function () {
        var cw = localStorage.getItem('cebianWidth');
        //if(cw=='' || cw==)
        var w = $('.cebian-content'); //[0].clientWidth
        var ew = w[0].clientWidth;


        // console.log(ew);

        var isshouqi = localStorage.getItem('isshouqi');


        // console.log(isshouqi);

        var cwidth = ew + 62 + 'px';
        cebianwidth = cwidth;
        if (isshouqi == '' || isshouqi == null || isshouqi == undefined) {
          //上次收起

          // console.log('收起');

        } else {
          //上次未收起
          //console.log('未收起');
          $('.cebian-nav').css('width', cwidth);

        }
      }, 2000);
    };

    $scope.iflang = function (lang) {
      var text;
      if (lang == 'cn') {
        text = '简体中文';
      } else if (lang == 'en') {
        text = 'English';
      }
      return text;
    };
    var lang = localStorage.getItem('lang');
    if (lang) {
      if (lang == 'en') {
        $scope.changeLanguage(lang);
        $scope.change_lang = 'cn';
      } else if (lang == 'cn') {
        $scope.changeLanguage(lang);
        $scope.change_lang = 'en';
      }
    } else {
      localStorage.setItem('lang', 'cn');
    }


    $scope.iscunzai = function (text) {
      //console.log(text);
      if (text == '' || text == null || text == undefined) {
        //console.log(text);
        if (text === 0) {
          //console.log('mayyu')
          return '(' + text + ')';
        } else {
          return '';
        }

      } else {
        //console.log(text);
        text = '(' + text + ')';
        return text;
      }
    };

    $("#logOut").click(function () {
      logout();
    });

    function logout() {
      var token = base64.decode(localStorage.getItem('erptoken') == undefined ? "" : localStorage.getItem('erptoken'));
      erp.postFun('app/employee/logOut', { token: token }, function (n) {
        if (n.data.code == 200) {
          location.href = "login.html";
        } else {
          layer.msg('退出失败！')
        }
      }, function (n) {
        console.log(n)
      })
    }

    function printFun(targetText) {
      console.log(targetText)
      switch (targetText) {
        case '打印暗转明':
          window.open('print.html')
          break
        case '批量设置设计商品价格折扣':
          window.open('fordesigns.html')
          break
        case 'Bulky price discount setting':
          window.open('fordesigns.html')
          break
        case '直发商品折扣':
          window.open('straight-hair-discount.html')
          break
        case 'IP查询':
          window.open('ip-inquiry.html')
          break
        case 'IP Inquiry':
          window.open('ip-inquiry.html')
          break
        case 'Discount of wholesale product':
          window.open('straight-hair-discount.html')
          break
        case '论坛管理后台':
          window.open('http://test.cjdropshipping.com/#/zh/login?from=')
          break
        case '角色权限管理':
          window.open('https://authority.cjdropshipping.cn/#/login')
          break
        case 'Role rights management':
          window.open('https://authority.cjdropshipping.cn/#/login')
          break
        default:
          break
      }

    }

    var b = Base64;
    $scope.admin = b.decode($window.localStorage.getItem('erploginName') || '');

    // 通知
    $scope.isGetNotice = sessionStorage.getItem('isGetNotice')
    $scope.isShowNotice = false
    $scope.idx = 0
    console.log($scope.isGetNotice)

    function getList() {
      erp.postFun('app/notice/getAllNoticInfo', {}, (res => {
        const data = JSON.parse(res.data.result)
        $scope.isShowNotice = data.sys.length > 0 || data.dhlOrder.length > 0 || data.notice.length > 0
        const noticeData = data.notice.map(_ => {
          return { data: ['1'], title: _.title, info: _.info, type: '4' }
        })
        const sourceData = data.sys.find(_ => {
          return _.stype === 'sourceproductJiaJi'
        })
        const dataArr = [
          { data: data.sys, type: '1', title: '系统通知' },
          { data: data.dhlOrder || [], type: '2', title: 'DHL订单待处理通知' },
          { data: sourceData.count, type: '3', title: '搜品通知' },
          ...noticeData
        ]
        $scope.noticeData = dataArr.filter(_ => _.data.length > 0)
        $scope.showData = $scope.noticeData[$scope.idx]
      }), err => {
        console.log(err)
      });
    }

    if ($scope.isGetNotice !== 'close') {
      getList();
    }

    // 上一条
    $scope.preBtn = () => {
      if ($scope.idx > 0) {
        $scope.idx--
        $scope.showData = $scope.noticeData[$scope.idx]
      }
    }

    // 下一条
    $scope.nextBtn = () => {
      if ($scope.idx < $scope.noticeData.length - 1) {
        $scope.idx++
        $scope.showData = $scope.noticeData[$scope.idx]
      }
    }

    // 关闭
    $scope.closeNotice = () => {
      $scope.isShowNotice = false
      sessionStorage.setItem('isGetNotice', 'close')
    }
  })
} 