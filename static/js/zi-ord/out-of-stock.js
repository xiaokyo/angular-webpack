(function () {
  var app = angular.module('out-of-stock', ['service', 'utils']);
  // 缺货数字列表
  app.controller('out-of-stock-controller', [
    '$scope',
    '$http',
    'erp',
    '$routeParams',
    '$compile',
    'utils',
    function ($scope, $http, erp, $routeParams, $compile, utils) {
      const isZhifa = $routeParams.isZhifa;
      console.log('进入缺货列表', '是否为直发？', isZhifa);
      $scope.searchSku = '';
      $scope.store = 0;
      //仓库列表
      $scope.wareList = [
        {
          store: 0,
          whichOneCk: 'bc228e33b02a4c03b46b186994eb6eb3',
          name: '义乌仓',
          active: true,
        },
        {
          store: 1,
          whichOneCk: '08898c4735bf43068d5d677c1d217ab0',
          name: '深圳仓',
          active: false,
        },
        {
          store: 2,
          whichOneCk: 'd3749885b80444baadf8a55277de1c09',
          name: '美西奇诺仓',
          active: false,
        },
        {
          store: 3,
          whichOneCk: 'd3749885b80444baadf8a55277de1c09',
          name: '美东新泽西仓',
          active: false,
        },
        {
          store: 4,
          whichOneCk: 'd3749885b80444baadf8a55277de1c09',
          name: '泰国仓',
          active: false,
        },
        {
          store: 5,
          whichOneCk: '522d3c01c75e4b819ebd31e854841e6c',
          name: '金华仓',
          active: false,
        },
      ];

      //  列表数据
      $scope.erporderList = [
        { sku: '123123123', ziorder: 111, kehu: 100 },
        {
          sku: '123123122123123',
          childList: [{ sku: 13123123, ziorder: 111, kehu: 100 }],
        },
        { sku: '123123123' },
      ];
      // 排序方式
      $scope.orderSoft = 1;
      $scope.orderSoftHandle = function () {
        $scope.orderSoft = $scope.orderSoft === 1 ? 2 : 1;
        console.log('订单排序', '$scope.orderSoft = ', $scope.orderSoft);
        $scope.getList();
      };
      $scope.customSoft = 1;
      $scope.customSoftHandle = function () {
        $scope.customSoft = $scope.customSoft === 1 ? 2 : 1;
        console.log('客户排序', '$scope.customSoft = ', $scope.customSoft);
        $scope.getList();
      };
      $scope.outStockNumSoft = 1;
      $scope.outStockNumSoftHandle = function () {
        $scope.outStockNumSoft = $scope.outStockNumSoft === 1 ? 2 : 1;
        console.log('缺货数排序', '$scope.outStockNumSoft = ', $scope.outStockNumSoft);
        $scope.getList();
      };

      // 仓库切换
      $scope.storeFun = function (item) {
        $scope.store = item.store;
        $scope.wareList.forEach((element) => {
          if (element.store === item.store) {
            element.active = true;
          } else {
            element.active = false;
          }
        });
        $scope.getList();
      };

      // 重置方法
      $scope.reset = function () {
        $scope.searchSku = undefined;
        $scope.store = 0;
        $scope.wareList.forEach((e) => {
          if (e.store === 0) e.active = true;
          else e.active = false;
        });
        $scope.getList();
      };

      $scope.getList = function () {
        const params = {
          searchSku: $scope.searchSku,
          store: $scope.store,
        };
        console.log('请求列表', params);
        // 请求数据 修改erporderList
        // $scope.erporderList = res.list
      };
      $scope.getList();

      //显示大图
      $('.orders-table').on('mouseenter', '.sp-smallimg', function () {
        $(this).siblings('.hide-bigimg').show();
      });
      $('.orders-table').on('mouseenter', '.hide-bigimg', function () {
        $(this).show();
      });
      $('.orders-table').on('mouseleave', '.sp-smallimg', function () {
        $(this).siblings('.hide-bigimg').hide();
      });
      $('.orders-table').on('mouseleave', '.hide-bigimg', function () {
        $(this).hide();
      });
    },
  ]);

  // 缺货SKU订单列表
  app.controller('out-of-stock-orders-controller', [
    '$scope',
    '$http',
    'erp',
    '$routeParams',
    '$compile',
    'utils',
    function ($scope, $http, erp, $routeParams, $compile, utils) {
      var that = this;
      // 接收url参数
      $scope.customName = $routeParams.customName;
      $scope.customId = $routeParams.customId;
      $scope.sku = $routeParams.sku;
      const isZhifa = $routeParams.isZhifa;
      console.log('进入SKU订单列表', '是否为直发？', isZhifa);

      // 时间排序
      $scope.timeSoft = 1;

      $scope.isAnalysis = false;
      $scope.openAnalysis = function (id, name) {
        $scope.isAnalysis = true;
        that.no = {
          id: id,
          name: name,
        };
        that.username = name;
      };
      $scope.$on('log-to-father', function (d, flag) {
        if (d && flag) {
          $scope.isAnalysis = false;
          $scope.isLookLog = false;
          $scope.gxhOrdFlag = false;
          $scope.gxhProductFlag = false;
          $scope.spMessageflag = false;
        }
      });
      $scope.spNoteFun = function (pItem, item, pIndex, index, ev) {
        $scope.spMessageflag = true;
        that.pItem = pItem;
        that.item = item;
        that.pIndex = pIndex;
        that.index = index;
        that.list = $scope.erporderList;
        console.log(pItem, item, pIndex, index);
        ev.stopPropagation();
      };
      $scope.openZZC2 = function (list, e, type, spArr) {
        $scope.gxhOrdFlag = true;
        that.pro = list;
        that.type = type;
        that.sparr = spArr;
        e.stopPropagation();
      };
      $scope.openZZC = function (list, e, type, plist) {
        $scope.gxhProductFlag = true;
        that.pro = list;
        that.type = type;
        that.plist = plist;
        console.log(that.pro);
        console.log(type);
        e.stopPropagation();
      };
      $scope.$on('repeatFinishCallback', function () {
        $('#c-zi-ord .edit-inp').attr('disabled', 'true');
      });
      $scope.curTime = new Date().getTime();
      $scope.dayFun = function (day1, day2) {
        let oday1 = new Date(day1).getTime();
        // console.log(oday1)
        return Math.ceil((day2 - oday1) / 86400000);
      };
      $scope.isSelJqcz = '业务员';
      $scope.pageNum = 1;
      $scope.selstu = 1; //判断订单状态 隐藏选择框中的操作
      var bs = new Base64();
      var erpLoginName = !localStorage.getItem('erploginName')
        ? ''
        : bs.decode(localStorage.getItem('erploginName'));
      var muId = $routeParams.muId || '';
      $scope.shipmentsOrderId = $routeParams.muId || '';
      var erpuserId = localStorage.getItem('userId')
        ? bs.decode(localStorage.getItem('userId'))
        : '';
      var nowTime = new Date().getTime();
      var setTiem =
        localStorage.getItem('setCsTime') == undefined
          ? ''
          : localStorage.getItem('setCsTime');
      var getCsObj =
        localStorage.getItem('ziCs') == undefined
          ? ''
          : JSON.parse(localStorage.getItem('ziCs'));
      let showUserList = [
        'admin',
        '刘思梦',
        '邹丽容',
        '金仙娟',
        '李贞',
        '虞雅婷',
        '杨玉磊',
        '陈真',
        '孙晓蝶',
        '刘依',
        '王细珍',
        '石晶',
        '张俊佩',
        '张文靖',
        '王月',
        '金晓霞',
        '杨梦琴',
        '陆昌兰',
        '李铭辉',
        '徐群群',
        '郑跃飞',
        '朱燕',
        '赵炜',
        '杨艳芬',
        '洪颖锐'
      ];
      $scope.isShowFlag = ~showUserList.indexOf(erpLoginName) ? true : false;

      let cxclUserList = [
        'admin',
        '金仙娟',
        '李贞',
        '李正月',
        '王波',
        '陈真',
        '邹丽容',
        '刘思梦',
        '钟家荣',
        '陈映红',
        '李超',
        '刘依',
        '虞雅婷',
        '石晶',
        '赵炜',
        '张市伟',
        '余珍珍',
        '龚莹',
        '杨梦琴',
        '陆昌兰',
        '李铭辉',
        '张文靖',
        '王月',
        '金晓霞',
        '徐群群',
        '周鹏',
        '罗秋茂',
        '郑跃飞',
        '朱燕',
        '赵炜',
        '徐群群',
        '杨艳芬',
        '洪颖锐'
      ];
      $scope.cxclAdminShowFlag = ~cxclUserList.indexOf(erpLoginName)
        ? true
        : false;
      if (nowTime - setTiem <= 1500) {
        $scope.isSelJqcz = getCsObj.tj;
        $scope.startDate = getCsObj.btime;
        $scope.endDate = getCsObj.etime;
        console.log(nowTime - setTiem);
      }
      $scope.ordType = '';
      $scope.selstu = 2;
      $scope.selType = 1;

      $scope.pageNum = 1;
      $scope.pageSize = '100';
      $scope.timeSoftHandle = function() {
        $scope.timeSoft = $scope.timeSoft === 1 ? 2 : 1;
        console.log('时间排序：', '$scope.timeSoft = ', $scope.timeSoft);
        $scope.getList()
      }
      // 请求缺货列表，这里修改
      $scope.getList = () => {
        erp.load();
        if (muId || $scope.storeNumFlag) {
          $scope.isSelJqcz = '母订单号';
          $scope.storeNumFlag = true;
          getMuNumFun(muId, $scope.store);
        }
        $scope.checkList = [];
        $scope.checkIds = [];
        let erpData = {
          data: {
            ydh: 'all',
            id: muId,
            trackingnumberType: '',
            store: $scope.store,
            status: '', //除了代已配齐其余状态
            flag: '', //待配齐0；已配齐1
            storageId: $scope.selstu == 2 ? '' : $scope.whichOneCk,
            oneOrMuch: $scope.oneOrMuch, //单品0；多品1
            orderNumber: $scope.orderNumber,
            shopName: $scope.shopName,
            sku: $scope.sku,
            cjProductName: $scope.cjProductName,
            consumerName: $scope.consumerName,
            salesmanName: $scope.salesmanName,
            ownerName: $scope.ownerName,
            shipmentsOrderId: $scope.shipmentsOrderId,
            customerName: $scope.customerName,
            split: $scope.split,
            orderobserver: $scope.orderobserver,
            CJTracknumber: $scope.CJTracknumber,
            ydh: $scope.ydh ? $scope.ydh : 'all',
            cjOrderDateBegin: $scope.startDate || '',
            cjOrderDateEnd: $scope.endDate || '',
            isOrderObserver: $scope.selstu == 5 ? 1 : 0,
          },
          pageNum: +$scope.pageNum,
          pageSize: +$scope.pageSize,
        };
        if ($scope.store > 1) {
          erpData.data.oneOrMuch = undefined; //海外仓不需要传单品多品
        }
        $scope.erpordersList = []; //存储所有的订单


        // qing
        erpData = {
          data: {
            ydh: 'all',
            id: '',
            trackingnumberType: 'all',
            store: 0,
            status: '6',
            flag: 0,
            storageId: '',
            shipmentsOrderId: '',
            cjOrderDateBegin: '',
            cjOrderDateEnd: '',
            isOrderObserver: 0,
            disputeId: '',
            serarchPod: '',
          },
          pageNum: 1,
          pageSize: 100,
        };
        let url;
        if ($scope.selType == 1 || $scope.selType == 2) {
          url = 'processOrder/queryOrder/queryWaitCompletedOrderPage';
        } else if ($scope.selType == 7) {
          url = 'processOrder/queryOrder/observerOrdersPageByParam';
        } else {
          url = 'processOrder/queryOrder/queryPendingOrderPageByParam';
        }
        erp.postFun(
          url,
          erpData,
          function (data) {
            layer.closeAll('loading');
            $scope.checkAllFlag = false;
            var erporderResult = data.data.data; //存储订单的所有数据
            $scope.erpordTnum = erporderResult.total;
            $scope.erporderList = erporderResult.list;
            if (erporderResult.counts) {
              $scope.dYi = erporderResult.counts.daipeiqi;
              $scope.dEr = erporderResult.counts.yipeiqi;
            }
            countMFun($scope.erporderList);
            if ($scope.isSelJqcz == '母订单号' && inpVal) {
              getMuNumFun(inpVal, $scope.store);
            }
            $scope.$broadcast('page-data', {
              pageNum: $scope.pageNum,
              totalNum: Math.ceil($scope.erpordTnum / $scope.pageSize),
              totalCounts: $scope.erpordTnum,
              pageSize: $scope.pageSize,
              pageList: ['28', '30', '50', '100'],
            });
          },
          function () {
            layer.closeAll('loading');
            layer.msg('订单获取列表失败');
          }
        );
      };
      $scope.getList();
      $scope.$on('pagedata-fa', function (d, data) {
        // 分页onchange
        $scope.pageNum = data.pageNum;
        $scope.pageSize = data.pageSize;
        $scope.getList();
      });
      function countMFun() {
        var len = $scope.erporderList.length;
        var count = 0;
        for (var i = 0; i < len; i++) {
          count += $scope.erporderList[i].order.amount;
        }
        $scope.countMoney = count.toFixed(2);
        console.log($scope.countMoney);
      }
      //获取物流方式
      erp.postFun(
        'app/erplogistics/queryLogisticMode',
        {
          param: '',
          status: '1',
        },
        function (data) {
          console.log(data);
          $scope.wlNameList = data.data.result;
          $scope.wlNameList.push(
            {
              mode: '深圳E邮宝',
              nameen: 'ePacket',
            },
            {
              mode: '深圳官方E邮宝',
              nameen: 'ePacket',
            }
          );
        },
        function (data) {
          console.log(data);
        }
      );

      //日期切换
      $scope.$watch('startDate+endDate', () => {
        if ($scope.startDate || $scope.endDate) {
          $scope.pageNum = 1;
          $scope.getList();
        }
      });

      //按生成追踪号的类型搜索
      $scope.zzhstuFlag = true;
      $scope.checkBoxFun = function (ev) {
        $scope.pageNum = 1;
        erp.load();
        $scope.getList();
      };
      //批量提交到已发货
      $scope.isaddyfhFlag = false;
      var addyfhIds;
      $scope.bulkAddYfhFun = function () {
        $scope.checkList.length > 0
          ? ($scope.isaddyfhFlag = true)
          : layer.msg('请选择订单');
      };
      $scope.cancelAddyfhFun = function () {
        $scope.isaddyfhFlag = false;
      };
      $scope.sureBulkaddFun = function () {
        erp.load();
        var addyfhData = {
          ids: $scope.checkIds,
          type: '62',
        };
        erp.postFun(
          'processOrder/handleOrder/updateOrderProcessBeShipped',
          JSON.stringify(addyfhData),
          function (data) {
            console.log(data);
            $scope.isaddyfhFlag = false;
            if (data.data.data) {
              layer.msg('提交成功');
              $scope.getList();
            } else {
              layer.closeAll('loading');
              layer.msg('批量提交到已发货失败');
            }
          },
          function (data) {
            layer.closeAll('loading');
            console.log(data);
          }
        );
      };
      //单个提交到已发货
      $scope.singleisaddyfhFlag = false;
      var singleAddYfhId, singleAddYfhIndex;
      $scope.singleAddyfhFun = function (item, index) {
        $scope.singleisaddyfhFlag = true;
        singleAddYfhId = item.id;
        singleAddYfhIndex = index;
        console.log(singleAddYfhId);
        console.log(singleAddYfhIndex);
      };
      $scope.singleCancelFun = function () {
        $scope.singleisaddyfhFlag = false;
      };
      $scope.singleSureFun = function () {
        erp.load();
        var addyfhData = {
          ids: [singleAddYfhId],
        };
        erp.postFun(
          'processOrder/handleOrder/updateOrderProcessShipped',
          JSON.stringify(addyfhData),
          function (data) {
            console.log(data);
            $scope.singleisaddyfhFlag = false;
            layer.closeAll('loading');
            if (data.data.success) {
              $scope.erporderList.splice(singleAddYfhIndex, 1);
              $scope.erpordTnum--;
              countMFun($scope.erporderList);
              if (muId || $scope.storeNumFlag) {
                getMuNumFun(muId, $scope.store);
              }
            } else {
              layer.msg('批量提交到已发货失败');
            }
          },
          function (data) {
            layer.closeAll('loading');
            console.log(data);
          }
        );
      };
      //展示历史追踪号
      $scope.hisTraNumFun = function (item) {
        $scope.hisTrackNumFlag = true;
        var hisArr = item.trackingnumberhistory.replace(
          item.trackingnumber,
          ''
        );
        hisArr = hisArr.split(',');
        $scope.hisArr = hisArr;
      };
      //复制参考号
      $scope.fzckhFun = function (ev) {
        var fzVal = $(ev.target).siblings('.ckh-val')[0];
        console.log(fzVal);
        fzVal.select(); // 选中文本
        document.execCommand('copy'); // 执行浏览器复制命令
        layer.msg('复制成功');
      };
      $scope.fzZdhFun = function (ev) {
        var fzVal = $(ev.target).siblings('.zdh-val')[0];
        console.log(fzVal);
        fzVal.select(); // 选中文本
        document.execCommand('copy'); // 执行浏览器复制命令
        layer.msg('复制成功');
      };
      $scope.lrFun = function (item, ev, index) {
        $scope.lrIndex = index;
        $scope.lrId = item.id;
        $scope.zzhChaFlag = true;
      };
      $scope.canLrFun = function () {
        $scope.zzhChaFlag = false;
        $scope.lrzzhNum = '';
        $scope.lrHref = '';
      };
      $scope.sureChaZzhFun = function () {
        erp.load();
        var lrData = {};
        lrData.logisticsNumber = $scope.lrzzhNum;
        lrData.id = $scope.lrId;
        lrData.href = $scope.lrHref;
        console.log(JSON.stringify(lrData));
        erp.postFun(
          'processOrder/handleOrder/updateOrderTrackingNumber',
          JSON.stringify(lrData),
          function (data) {
            console.log(data);
            layer.closeAll('loading');
            $scope.zzhChaFlag = false;
            if (data.data.data) {
              if ($scope.selstu == 1) {
                $scope.erporderList.splice(index, 1);
                $scope.erpordTnum--;
                countMFun($scope.erporderList);
                if (muId || $scope.storeNumFlag) {
                  getMuNumFun(muId, $scope.store);
                }
                layer.msg('添加追踪号成功');
              } else {
                layer.msg('修改追踪号成功');
                $scope.erporderList[$scope.lrIndex].order.TRACKINGNUMBER =
                  $scope.lrzzhNum;
                $scope.erporderList[
                  $scope.lrIndex
                ].order.TRACKINGNUMBERHISTORY =
                  $scope.lrzzhNum +
                  ',' +
                  $scope.erporderList[$scope.lrIndex].order
                    .TRACKINGNUMBERHISTORY;
              }
              $scope.lrzzhNum = '';
              $scope.lrHref = '';
            } else {
              layer.msg('添加追踪号失败');
            }
          },
          function (data) {
            layer.closeAll('loading');
            console.log(data);
          }
        );
      };
      $scope.toggleSeaFun = function () {
        $scope.moreSeaFlag = !$scope.moreSeaFlag;
        console.log($scope.moreSeaFlag);
      };
      $scope.clearBtnFun = function () {
        $scope.orderNumber = undefined;
        $scope.shopName = undefined;
        $scope.sku = undefined;
        $scope.cjProductName = undefined;
        $scope.consumerName = undefined;
        $scope.salesmanName = undefined;
        $scope.ownerName = undefined;
        $scope.shipmentsOrderId = undefined;
        $scope.customerName = undefined;
        $scope.split = undefined;
        $scope.orderobserver = undefined;
        $scope.CJTracknumber = undefined;
        $scope.ydh = undefined;
        $scope.wlModeName = '';
        $scope.ordType = '';
      };
      $scope.enterSerch = function (ev) {
        if (ev.keyCode == 13) {
          $scope.searchFun();
        }
      };
      $scope.searchFun = function () {
        $scope.getList();
      };

      function getMuNumFun(sid, store) {
        erp.getFun(
          'order/order/getOrderStateCountBySid?sid=' + sid + '&store=' + store,
          function (data) {
            console.log(data);
            if (data.data.statusCode == 200) {
              var numObj = data.data.result;
              $scope.yiWuCount = numObj.yiwu;
              $scope.shenZhenCount = numObj.shenzhen;
              $scope.meiGuoCount = numObj.meixi;
              $scope.meiDongCount = numObj.meidong;
              $scope.meiZzhCount = numObj.mei;
              $scope.youZzhCount = numObj.you;
              $scope.jiuFenCount = numObj.jiufen;
              $scope.dpqCount = numObj.daipeiqi;
              $scope.yiPeiQiCount = numObj.yipeiqi;
              $scope.chuLiZhongCount = numObj.zhong;
              $scope.queHuoCount = numObj.queHuo;
              $scope.daiChuKuCount = numObj.daiChuKu;
              $scope.taiGuoCount = numObj.taiguo;
              console.log($scope.yiWuCount);
              console.log(numObj);
            } else if (data.data.statusCode == 401) {
              $scope.storeNumFlag = false;
            } else {
              layer.msg(data.data.message);
              $scope.storeNumFlag = false;
            }
          },
          function (data) {
            console.log(data);
          }
        );
      }
      //留言的弹框
      //CJ客户留言的弹框
      $scope.messageflag = false;
      var mesOrdId;
      var mesIndex;
      $scope.messageimgFun = function (item, index) {
        // $event.stopPropagation();
        $scope.messageflag = true;
        $scope.messageCon = item.noteAttributes;
        mesIndex = index;
        mesOrdId = item.id;
      };
      $scope.messcloseBtnFun = function () {
        $scope.messageflag = false;
        $scope.messageCon = '';
      };
      $scope.cusmesSurnFun = function () {
        var mesData = {};
        mesData.id = mesOrdId;
        mesData.noteAttributes = $scope.messageCon;
        erp.postFun(
          'processOrder/handleOrder/upOrderNote',
          JSON.stringify(mesData),
          function (data) {
            console.log(data);
            $scope.messageflag = false;
            if (data.data.success) {
              layer.msg('修改成功');
              $scope.erporderList[mesIndex].order.noteAttributes =
                $scope.messageCon;
            } else {
              layer.msg('修改失败');
            }
          },
          function (data) {
            console.log(data);
            layer.msg('网络错误');
          }
        );
      };

      //业务员留言的弹框
      $scope.ywymesFlag = false;
      $scope.ywymesimgFun = function (item, $event) {
        $scope.ywymesFlag = true;
        $scope.ywymessageCon = item.erpnote;
      };
      $scope.ywymescloseBtnFun = function () {
        $scope.ywymesFlag = false;
        $scope.ywymessageCon = '';
      };
      //给子订单里面的订单添加选中非选中状态
      var cziIndex = 0;
      var md10Count = 0;
      var md15Count = 0;
      var thisWlName = '';
      $scope.checkList = [];
      $scope.checkIds = [];
      function getCheckList() {
        $scope.checkIds = [];
        $scope.checkList = $scope.erporderList.filter((item) => {
          if (item.checkFlag) {
            $scope.checkIds.push(item.order.id);
            return item;
          }
        });
        console.log($scope.checkIds);
        cziIndex = $scope.checkList.length;
        $scope.checkAllFlag =
          $scope.erporderList.length == $scope.checkList.length;
      }
      $scope.checkItemFun = (item, e) => {
        e.stopPropagation();
        item.clickcontrl = false;
        thisWlName = item.order.logisticsmodename;
        if ($scope.selstu == 3) {
          if (md15Count != 0 && item.order.logisticsmodename == '顺丰国际') {
            layer.msg('已经选中15x15,只能选择规格相同的');
            item.checkFlag = false;
          } else if (
            md10Count != 0 &&
            item.order.logisticsmodename != '顺丰国际'
          ) {
            layer.msg('已经选中10x10,只能选择规格相同的');
            item.checkFlag = false;
          }
          if (item.checkFlag) {
            item.order.logisticsmodename == '顺丰国际'
              ? md10Count++
              : md15Count++;
          } else {
            item.order.logisticsmodename == '顺丰国际'
              ? md10Count--
              : md15Count--;
          }
        }
        getCheckList();
      };
      //全选
      $scope.checkAllFun = () => {
        if ($scope.selstu == 3) {
          cziIndex = 0;
          md10Count = 0;
          $scope.erporderList.forEach((item) => {
            item.checkFlag = false;
          });
          if ($scope.checkAllFlag) {
            $scope.erporderList.forEach((item) => {
              if (item.order.logisticsmodename == '顺丰国际') {
                md10Count++;
                cziIndex++;
                item.checkFlag = $scope.checkAllFlag;
              }
            });
            if (md10Count < 1) {
              cziIndex = $scope.erporderList.length;
              $scope.erporderList.forEach((item) => {
                item.checkFlag = $scope.checkAllFlag;
              });
              layer.msg('没有10x10,选中所有规格为15x15');
            } else {
              layer.msg('选中了' + md10Count + '条面单为10x10的订单');
            }
          }
        } else {
          cziIndex = $scope.checkAllFlag ? $scope.erporderList.length : 0;
          $scope.erporderList.forEach((item) => {
            item.checkFlag = $scope.checkAllFlag;
          });
        }
        getCheckList();
      };
      //选择28条10x10
      $scope.check10Fun = function () {
        cziIndex = 0;
        md10Count = 0;
        md15Count = 0;
        $scope.erporderList.forEach((item) => {
          item.checkFlag = false;
          if (item.order.logisticsmodename == '顺丰国际' && md10Count < 28) {
            item.checkFlag = true;
            md10Count++;
          }
        });
        if (md10Count == 0) {
          layer.msg('当前没有规格为10x10的订单');
        } else {
          layer.msg('选中了' + md10Count + '条面单为10x10的订单');
          getCheckList();
        }
      };
      //选择28条15x15
      $scope.check15Fun = function () {
        cziIndex = 0;
        md10Count = 0;
        md15Count = 0;
        $scope.erporderList.forEach((item) => {
          item.checkFlag = false;
          if (item.order.logisticsmodename != '顺丰国际' && md15Count < 28) {
            item.checkFlag = true;
            md15Count++;
          }
        });
        if (md15Count == 0) {
          layer.msg('当前没有规格为15x15的订单');
        } else {
          layer.msg('选中了' + md15Count + '条面单为15x15的订单');
          getCheckList();
        }
      };
      //给导航添加点击事件
      $('.ord-stu-cs').click(function () {
        //获取状态中传的参数
        var csDataObj = {};
        var setCsTime = new Date().getTime();
        csDataObj.btime = $scope.startDate;
        csDataObj.etime = $scope.endDate;
        console.log(csDataObj);
        csDataObj = JSON.stringify(csDataObj);
        localStorage.setItem('ziCs', csDataObj);
        localStorage.setItem('setCsTime', setCsTime);
      });
      //关闭找货的PDF弹框
      $scope.closeFresh3Fun = function () {
        $scope.seaProFlag = false;
        $scope.getList();
      };
      $('.buck-dyyd').show(); //批量打印面单
      $('.buck-qxpq').hide(); //批量强行配齐
      $('.ggclass').show(); //输入框

      //单品 多品
      $scope.typeFun = (item) => {
        $scope.proTypeList = $scope.proTypeList.map((_i) => {
          _i.active = false;
          return _i;
        });
        item.active = !item.active;
        $scope.oneOrMuch = item.type;
        $scope.getList();
      };
      //确认发货
      $scope.qrfhFun = function (item) {
        erp.load();
        var addyfhData = {};
        addyfhData.ids = item.id;
        addyfhData.type = '62';
        console.log(JSON.stringify(addyfhData));
        erp.postFun(
          'processOrder/handleOrder/updateOrderProcessBeShipped',
          JSON.stringify(addyfhData),
          function (data) {
            console.log(data);
            if (data.data.data) {
              $scope.getList();
            } else {
              layer.msg('确认发货失败');
            }
          },
          function (data) {
            layer.closeAll('loading');
            console.log(data);
          }
        );
      };
      $scope.selOrdTypeFun = function () {
        $scope.pageNum = 1;
        $scope.getList();
      };
      $scope.stopProgFun = function (ev) {
        ev.stopPropagation();
      };
      //释放库存
      $scope.sfKcFun = function () {
        $scope.checkList.length == 0
          ? layer.msg('请选择订单')
          : ($scope.storeTypeFlag = true);
      };
      $scope.canSfkcFun = function () {
        $scope.storeTypeFlag = false;
      };
      $scope.sureSfkcFun = function () {
        var upData = {
          ids: $scope.checkIds,
        };
        erp.load();
        erp.postFun(
          'processOrder/handleOrder/orderReleaseRepertory',
          JSON.stringify(upData),
          function (data) {
            if (data.data.success) {
              layer.msg('释放成功');
              $scope.storeTypeFlag = false;
              $scope.pageNum = 1;
              $scope.getList();
            } else {
              erp.closeLoad();
              layer.msg('释放失败');
            }
          },
          function (data) {
            erp.closeLoad();
          }
        );
      };
      //批量同步至店铺
      $scope.tbdpFlag = false;
      var tbdpShopIds = []; //存储店铺id
      var tbdpExcelIds = []; //存储excel 的id
      $scope.istbdpTc = function () {
        tbdpShopIds = [];
        tbdpExcelIds = [];
        $scope.lxindex = 0;
        $scope.nfEytNum = 0; //南风转单号
        $scope.jceqkptNum = 0; //佳成英国转单号
        $scope.shipmentId0Num = 0; //店铺为Brightpearl 商品图片id为0
        $scope.erporderList.forEach((item) => {
          if (item.checkFlag) {
            let trackingnumber = item.order.trackingnumber;
            if (trackingnumber.indexOf('EYT') >= 0) {
              $scope.nfEytNum++;
            } else if (trackingnumber.indexOf('EQKPT') >= 0) {
              $scope.jceqkptNum++;
            } else {
              $scope.lxindex++;
            }
            if (
              trackingnumber.indexOf('EYT') < 0 &&
              trackingnumber.indexOf('EQKPT') < 0
            ) {
              if (item.order.storeName == 'Excel Imported') {
                tbdpExcelIds.push(item.order.id);
              } else {
                tbdpShopIds.push(item.order.id);
              }
            }
          }
        });
        if (
          $scope.lxindex <= 0 &&
          $scope.shipmentId0Num <= 0 &&
          $scope.jceqkptNum <= 0 &&
          $scope.nfEytNum <= 0
        ) {
          layer.msg('请选择订单');
          return;
        } else {
          $scope.tbdpFlag = true;
        }
      };
      $scope.istbdpcloseFun = function () {
        $scope.tbdpFlag = false;
      };
      $scope.lvxingFun = function () {
        $scope.tbdpFlag = false; //关闭询问框
        if (tbdpExcelIds.length > 10) {
          $scope.tbdpTipFlag = true; //打开提示时间较长框
        }
        erp.load();
        var upData = {};
        upData.ids = tbdpShopIds.join(',');
        upData.excelId = tbdpExcelIds.join(',');
        console.log(JSON.stringify(upData));
        erp.postFun(
          'processOrder/handleOrder/updateOrderProcessBeShipped',
          JSON.stringify(upData),
          function (data) {
            console.log(data);
            $scope.tbdpTipFlag = false; //关闭提示框
            if (data.data.result) {
              layer.msg('同步成功');
              $scope.getList();
            } else {
              layer.closeAll('loading');
              layer.msg('同步失败');
            }
          },
          function (data) {
            layer.closeAll('loading');
            console.log(data);
          }
        );
      };
      //单独同步至店铺
      $scope.onetbdpFlag = false;
      $scope.onetbdpcloseFun = function () {
        $scope.onetbdpFlag = false;
      };
      $scope.istbzdpFun = function (item) {
        $scope.onetbdpFlag = true; //打开询问框
        $scope.itemId = item.id;
        $scope.shoptype = item.storeName; //判断店铺类型
      };
      $scope.onetbdpSureFun = function () {
        $scope.onetbdpFlag = false; //关闭询问框
        console.log($scope.itemId);
        var upData = {
          excelIds: $scope.itemId,
          ids: $scope.itemId,
        };
        erp.load();
        console.log(JSON.stringify(upData));
        erp.postFun(
          'processOrder/handleOrder/updateOrderProcessBeShipped',
          JSON.stringify(upData),
          function (data) {
            console.log(data);
            layer.closeAll('loading');
            if (data.data.success) {
              layer.msg('同步成功');
              $scope.getList();
            } else {
              layer.closeAll('loading');
              layer.msg('同步失败');
            }
          },
          function (data) {
            layer.closeAll('loading');
            console.log(data);
          }
        );
      };
      //鼠标划过事件
      //点击事件
      $('.orders-table').on('click', '.erporder-detail', function (event) {
        if (
          $(event.target).hasClass('cor-check-box') ||
          $(event.target).hasClass('qtcz-sel') ||
          $(event.target).hasClass('stop-prop') ||
          $(event.target).hasClass('ordlist-fir-td')
        ) {
          return;
        }
        if ($(this).hasClass('order-click-active')) {
          $(this).next().hide();
          $(this).removeClass('order-click-active');
        } else {
          $(this).next().show();
          $(this).addClass('order-click-active');
        }
      });

      $('.orders-table').on('mouseenter', '.ordlist-fir-td', function () {
        $(this).parent('.erporder-detail').next().hide();
      });
      $('.orders-table').on('mouseenter', '.moshow-sp-td', function () {
        $(this).parent('.erporder-detail').next().show();
        $('.orders-table .erporder-detail').removeClass(
          'erporder-detail-active'
        );
        $(this).parent('.erporder-detail').addClass('erporder-detail-active');
      });

      $('.orders-table').on('mouseleave', '.erporder-detail', function () {
        $(this).next().hide();
        if ($(this).hasClass('order-click-active')) {
          $(this).next().show();
        } else {
          $(this).next().hide();
        }
      });
      $('.orders-table').on('mouseenter', '.erpd-toggle-tr', function () {
        $(this).show();
      });
      $('.orders-table').on('mouseleave', '.erpd-toggle-tr', function () {
        // $(this).hide();
        if ($(this).prev().hasClass('order-click-active')) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
      $('.orders-table').mouseleave(function () {
        $('.orders-table .erporder-detail').removeClass(
          'erporder-detail-active'
        );
      });

      //批量修改物流的弹窗
      $scope.selfun = function (e, item) {
        $scope.selstu = item.selstu;
        $scope.selType = item.type;
        $scope.statusList = $scope.statusList.map((_i) => {
          if (_i.type != item.type) {
            _i.active = false;
          }
          return _i;
        });
        item.active = !item.active;
        if (item.selstu == 3) {
          $scope.oneOrMuch = 1;
        } else {
          $scope.oneOrMuch = '';
        }
        $scope.getList();
      };

      //批量打印运单 筛选物流 商品属性
      $scope.isdymdFlag = false;
      $scope.isdymdFlag2 = false; //筛选后有多少条符合打印面单
      $scope.uspsType = '0';
      $scope.isdymdFun = function () {
        $scope.uspsPlusNum = 0;
        $scope.uspsDdCount = 0;
        var isUspsWlName, wlModeAttr;
        $scope.erporderList.forEach((item) => {
          if (item.checkFlag) {
            wlModeAttr = item.order.logisticsmodename;
            isUspsWlName = item.order.logisticName;
            if (
              isUspsWlName == 'USPS+' ||
              isUspsWlName == 'USPS' ||
              wlModeAttr == 'Shipstation'
            ) {
              $scope.uspsPlusNum++;
            }
          }
        });
        if ($scope.checkList.length == 0) {
          layer.msg('请选择订单');
          return;
        } else {
          if ($scope.uspsPlusNum < 1) {
            $scope.isdymdFlag = true;
          }
        }
      };
      //打印面单关闭的弹框
      $scope.isdymdCloseFun = function () {
        $scope.isdymdFlag = false;
      };
      // 取消usps+的打印类型
      $scope.gbSelUSType = function () {
        $scope.uspsType = '0';
        $scope.uspsPlusNum = 0;
        $scope.isdymdFlag = true;
      };
      // 确定usps+的打印类型
      $scope.sureSelUSType = function () {
        $scope.uspsPlusNum = 0;
        $scope.isdymdFlag = true;
      };
      //确定打印面单
      $scope.mdtcFlag = false;
      $scope.buckdyydFun = function () {
        $scope.isdymdFlag = false; //关闭询问是否打印订单的提示框
        erp.load();
        var ids = {};
        ids.ids = $scope.checkIds.join(',');
        ids.type = '1';
        ids.loginName = erpLoginName;
        ids.uspsType = $scope.uspsType;
        erp.postFun2(
          'getExpressSheet.json',
          JSON.stringify(ids),
          function (data) {
            console.log(data);
            console.log(data.data);
            var resMdArr = data.data;
            layer.closeAll('loading');
            var resPdfArr = [];
            if (resMdArr.length > 0) {
              $scope.mdtcFlag = true;
              for (var i = 0, len = resMdArr.length; i < len; i++) {
                resPdfArr.push({
                  printCount: 0,
                  printPdf: resMdArr[i],
                });
              }
              $scope.pdfmdArr = resPdfArr;
              console.log(resPdfArr);
            } else {
              layer.msg('生成面单错误');
            }
          },
          function (data) {
            console.log(data);
            layer.closeAll('loading');
            layer.msg('网络错误');
          }
        );
      };
      $scope.hbBuckdyydFun = function () {
        $scope.isdymdFlag = false; //关闭询问是否打印订单的提示框
        erp.load();
        var ids = {};
        ids.ids = $scope.checkIds.join(',');
        ids.type = '1';
        ids.merge = 'y';
        ids.loginName = erpLoginName;
        ids.uspsType = $scope.uspsType;
        console.log(JSON.stringify(ids));
        erp.postFun2(
          'getExpressSheet.json',
          JSON.stringify(ids),
          function (data) {
            console.log(data);
            console.log(data.data);
            // $scope.pdfmdArr = data.data;//生成的面单数组
            var resMdArr = data.data;
            layer.closeAll('loading');
            var resPdfArr = [];
            if (resMdArr.length > 0) {
              $scope.mdtcFlag = true;
              for (var i = 0, len = resMdArr.length; i < len; i++) {
                resPdfArr.push({
                  printCount: 0,
                  printPdf: resMdArr[i],
                });
              }
              $scope.pdfmdArr = resPdfArr;
              console.log(resPdfArr);
            } else {
              layer.msg('生成面单错误');
            }
          },
          function (data) {
            console.log(data);
            layer.closeAll('loading');
            layer.msg('网络错误');
          }
        );
      };
      $scope.mdClickFun = function (item) {
        item.printCount++;
        console.log(item);
      };
      //有序打印面单
      $scope.isyxdyFun = function () {
        if (localStorage.getItem('yxdyObj')) {
          $scope.yxdymdFlag = true;
          $scope.yxdyList = JSON.parse(localStorage.getItem('yxdyObj'));
          console.log($scope.yxdyList);
        } else {
          $scope.isyxdymdFlag = true;
        }
      };
      //询问是否有序打单确定按钮
      $scope.yxdymdFun = function () {
        if ($scope.checkList.length == 0) {
          layer.msg('请选择订单');
          $scope.isyxdymdFlag = false; //关闭询问按钮
          return;
        }
        layer.load(2);
        var getskuData = {};
        getskuData.ids = $scope.checkIds.join(',');
        getskuData.store = $scope.store;
        erp.postFun(
          'app/order/printSku',
          JSON.stringify(getskuData),
          function (data) {
            console.log(data);
            layer.closeAll('loading');
            $scope.isyxdymdFlag = false;
            $scope.isdyAllmdFlag = false;
            if (data.status == 200) {
              if ($.isEmptyObject(data.data.result)) {
                layer.msg('这些订单不能有序打印面单');
              } else {
                $scope.yxdymdFlag = true;
                $scope.yxdyList = data.data.result;
                localStorage.setItem(
                  'yxdyObj',
                  JSON.stringify($scope.yxdyList)
                );
                console.log($scope.yxdyList);
              }
            }
          },
          function (data) {
            console.log(data);
            layer.closeAll('loading');
          }
        );
      };
      //有序打印面单的打印函数
      var printResObj;
      $scope.yxdyBtnFun = function (item, ev) {
        $scope.isSkuPrintFlag = true;
        $(ev.target).addClass('has-print-actbtn');
        layer.load(2);
        console.log(item);
        $scope.dymdId = item;
        var ids = {};
        ids.ids = item;
        ids.type = '2';
        ids.news = '1';
        ids.userId = erpuserId;
        ids.loginName = erpLoginName;
        // return;
        erp.postFun2(
          'getExpressSheet.json',
          JSON.stringify(ids),
          function (data) {
            console.log(data);
            console.log(data.data);
            printResObj = data.data[0];
            console.log(printResObj);
            if (printResObj.result == 'go') {
              setTimeout(function () {
                $scope.yxdyBtnFun($scope.dymdId);
              }, 2000);
            } else {
              layer.closeAll('loading');
              var resMdArr = data.data;
              var resPdfArr = [];
              if (resMdArr.length > 0) {
                $scope.mdtcFlag = true;
                for (var i = 0, len = resMdArr.length; i < len; i++) {
                  resPdfArr.push({
                    printCount: 0,
                    printPdf: resMdArr[i],
                  });
                }
                $scope.pdfmdArr = resPdfArr;
                console.log(resPdfArr);
              } else {
                layer.msg('生成面单错误');
              }
              // $scope.pdfmdArr = data.data;//生成的面单数组
              // console.log($scope.pdfmdArr)
              // $scope.mdtcFlag = true;
            }
          },
          function (data) {
            console.log(data);
            layer.closeAll('loading');
            layer.msg('网络错误');
          }
        );
      };
      //询问是否移动到处理中
      $scope.yddyclFun = function (item, ev, key) {
        $scope.isyddClzFlag = true;
        $scope.printYdIds = item;
        $scope.printKey = key;
      };
      $scope.sureYdClzFun = function () {
        console.log($scope.printKey);
        var printKey = $scope.printKey;
        layer.load(2);
        var to62Data = {};
        to62Data.ids = $scope.printYdIds;
        erp.postFun(
          'app/order/subTo62',
          JSON.stringify(to62Data),
          function (data) {
            console.log(data);
            layer.closeAll('loading');
            if (data.data.statusCode == 200) {
              layer.msg('移动成功');
              $scope.isyddClzFlag = false;
              delete $scope.yxdyList[printKey];
              localStorage.setItem('yxdyObj', JSON.stringify($scope.yxdyList));
            } else {
              layer.msg('移动失败');
            }
          },
          function (data) {
            console.log(data);
            layer.closeAll('loading');
          }
        );
      };
      //打印所有面单
      $scope.isdyAllFun = function () {
        if (localStorage.getItem('yxdyObj')) {
          $scope.yxdymdFlag = true;
          $scope.yxdyList = JSON.parse(localStorage.getItem('yxdyObj'));
        } else {
          $scope.isdyAllmdFlag = true;
        }
      };
      $scope.dyAllMdFun = function () {
        $scope.isSkuPrintFlag = true;
        // isdyzdata.storeId = $scope.whichOneCk;
        var dyAllData = {};
        dyAllData.store = $scope.store;
        erp.postFun(
          'app/order/printSku',
          JSON.stringify(dyAllData),
          function (data) {
            console.log(data);
            layer.closeAll('loading');
            $scope.isyxdymdFlag = false;
            $scope.isdyAllmdFlag = false;
            if (data.status == 200) {
              if ($.isEmptyObject(data.data.result)) {
                layer.msg('没有可以打印的面单');
              } else {
                $scope.yxdymdFlag = true;
                $scope.yxdyList = data.data.result;
                localStorage.setItem(
                  'yxdyObj',
                  JSON.stringify($scope.yxdyList)
                );
                console.log($scope.yxdyList);
              }
            }
          },
          function (data) {
            console.log(data);
            layer.closeAll('loading');
          }
        );
      };
      //打印拣货单 (测试 等待打印所有面单传仓库参数)
      $scope.printjhdFun = function () {
        console.log($scope.yxdyList);
        var pjhdData = {};
        pjhdData.skuList = [];
        for (var key in $scope.yxdyList) {
          var oneObj = {};
          oneObj.sku = key;
          oneObj.optNum = $scope.yxdyList[key].num;
          oneObj.imgUrl = $scope.yxdyList[key].image;
          pjhdData.skuList.push(oneObj);
        }
        console.log(pjhdData.skuList);
        if ($scope.store == 0) {
          pjhdData.storageId = 'bc228e33b02a4c03b46b186994eb6eb3';
        } else if ($scope.store == 1) {
          pjhdData.storageId = '08898c4735bf43068d5d677c1d217ab0';
        } else if ($scope.store == 2) {
          pjhdData.storageId = 'd3749885b80444baadf8a55277de1c09';
        }
        console.log(pjhdData);
        erp.postFun(
          'app/pdfOpt/createPickingList',
          JSON.stringify(pjhdData),
          function (data) {
            console.log(data);
          },
          function (data) {
            console.log(data);
          }
        );
      };
      //sku打单弹框的关闭按钮
      $scope.closeSkuPrintFun = function () {
        $scope.yxdymdFlag = false;
        $scope.isdyAllmdFlag = false;
        localStorage.removeItem('yxdyObj');
        $scope.getList();
      };
      //单个操作一条订单打印面单
      $scope.oneisdymdFlag = false;
      var onemdId = ''; //存储一条订单的id
      $scope.oneisdymdFun = function (item) {
        //单个打印面单
        onemdId = item.id;
        $scope.oneisdymdFlag = true;
      };
      //分配的单独打印面单
      $scope.seaProDymdFun = function (item) {
        onemdId = item;
        $scope.oneisdymdFlag = true;
        console.log(item);
      };
      $scope.onedymdcloseFun = function () {
        $scope.oneisdymdFlag = false;
      };
      $scope.oneSureFun = function () {
        $scope.isSkuPrintFlag = false;
        console.log(onemdId);
        $scope.oneisdymdFlag = false; //关闭询问是否打印订单的提示框
        erp.load();
        var ids = {};
        ids.ids = onemdId;
        ids.type = '1';
        ids.loginName = erpLoginName;
        // return;
        erp.postFun2(
          'getExpressSheet.json',
          JSON.stringify(ids),
          function (data) {
            console.log(data);
            layer.closeAll('loading');
            var resMdArr = data.data;
            var resPdfArr = [];
            if (resMdArr.length > 0) {
              $scope.mdtcFlag = true;
              for (var i = 0, len = resMdArr.length; i < len; i++) {
                resPdfArr.push({
                  printCount: 0,
                  printPdf: resMdArr[i],
                });
              }
              $scope.pdfmdArr = resPdfArr;
              console.log(resPdfArr);
            } else {
              layer.msg('生成面单错误');
            }
          },
          function (data) {
            console.log(data);
            layer.closeAll('loading');
            layer.msg('网络错误');
          }
        );
      };
      //生成面单链接后的关闭按钮函数
      $scope.closeTcFun = function () {
        $scope.mdtcFlag = false;
      };
      //生成sku面单链接后的关闭按钮函数
      $scope.closeSkuPrintTk = function () {
        $scope.mdtcFlag = false;
      };
      //批量修改仓库
      $scope.bulkChangeCk = function () {
        $scope.checkList.length == 0
          ? layer.msg('请选择订单')
          : ($scope.changeCkFlag = true);
      };
      $scope.storeConfirmVal = '0';
      $scope.sureChangeCkFun = function () {
        erp.load();
        var cxclData = {};
        cxclData.ids = $scope.checkIds;
        cxclData.store = $scope.storeConfirmVal;
        erp.postFun(
          'processOrder/handleOrder/updateOrderWarehouseInfo',
          JSON.stringify(cxclData),
          function (data) {
            console.log(data);
            $scope.changeCkFlag = false;
            if (data.data.code == '200') {
              $scope.getList();
            } else {
              layer.closeAll('loading');
              layer.msg('修改仓库失败');
            }
          },
          function (data) {
            layer.closeAll('loading');
            layer.msg('网络错误');
            console.log(data);
          }
        );
      };
      //重新处理
      $scope.cxclFlag = false;
      $scope.waitFlag = false;
      $scope.iscxclFun = function (sumitToStatus) {
        if (sumitToStatus == 'wait') {
          $scope.checkList.length == 0
            ? layer.msg('请选择订单')
            : ($scope.waitFlag = true);
        } else {
          $scope.checkList.length == 0
            ? layer.msg('请选择订单')
            : ($scope.cxclFlag = true);
        }
      };
      $scope.iscxclCloseFun = function () {
        $scope.cxclFlag = false;
        $scope.waitFlag = false;
      };
      $scope.iscxclSureFun = function () {
        erp.load();
        var cxclData = {
          ids: $scope.checkIds,
        };
        erp.postFun(
          'processOrder/handleOrder/initERPOrder',
          JSON.stringify(cxclData),
          function (data) {
            console.log(data);
            $scope.cxclFlag = false;
            if (data.data.success) {
              if (data.data.message || data.data.data) {
                $scope.cxclResFlag = true;
              }
              $scope.initMessage = data.data.message
                ? data.data.message
                : data.data.data;
              $scope.getList();
            } else {
              layer.closeAll('loading');
              layer.msg('重新处理订单失败');
            }
          },
          function (data) {
            layer.closeAll('loading');
            layer.msg('网络错误');
            console.log(data);
          }
        );
      };
      $scope.isWaitSureFun = function () {
        erp.load();
        var cxclData = {
          ids: $scope.checkIds,
        };
        erp.postFun(
          'processOrder/handleOrder/waitERPOrder',
          JSON.stringify(cxclData),
          function (data) {
            console.log(data);
            $scope.waitFlag = false;
            if (data.data.success) {
              layer.msg('提交待配齐订单成功');
              $scope.getList();
            } else {
              layer.closeAll('loading');
              layer.msg('提交待配齐订单失败');
            }
          },
          function (data) {
            layer.closeAll('loading');
            layer.msg('网络错误');
            console.log(data);
          }
        );
      };

      //单独操作重新处理订单
      $scope.onecxclFlag = false;
      var cxclOrdId = '';
      $scope.oneiscxclFun = function (item) {
        $scope.onecxclFlag = true;
        cxclOrdId = item.id;
      };
      $scope.isonecxclCloseFun = function () {
        $scope.onecxclFlag = false;
      };
      $scope.isonecxclSureFun = function () {
        erp.load();
        var cxclData = {
          ids: [cxclOrdId],
        };
        erp.postFun(
          'processOrder/handleOrder/initERPOrder',
          JSON.stringify(cxclData),
          function (data) {
            console.log(data);
            $scope.onecxclFlag = false;
            if (data.data.success) {
              if (data.data.message || data.data.data) {
                $scope.cxclResFlag = true;
              }
              $scope.initMessage = data.data.message
                ? data.data.message
                : data.data.data;
              $scope.getList();
            } else {
              layer.closeAll('loading');
              layer.msg('重新处理订单失败');
            }
          },
          function (data) {
            layer.closeAll('loading');
            layer.msg('网络错误');
            console.log(data);
          }
        );
      };
      //会释放库存的提交到已发货
      $scope.newPLTJFun = function () {
        $scope.checkList.length == 0
          ? layer.msg('请选择订单')
          : ($scope.newTJYFHFlag = true);
      };
      $scope.sureNewYFHFun = function () {
        erp.load();
        $scope.newTJYFHFlag = false;
        erp.postFun(
          'processOrder/handleOrder/updateOrderProcessShipped',
          {
            ids: $scope.checkIds,
          },
          function (data) {
            console.log(data);
            if (data.data.data) {
              $scope.pageNum = 1;
              $scope.getList();
            } else {
              layer.msg('提交失败');
              layer.closeAll('loading');
            }
          },
          function (data) {
            layer.msg('网络错误');
            layer.closeAll('loading');
            console.log(data);
          }
        );
      };
      //批量提交到拦截
      $scope.oneAddLanJieFun = function (item) {
        $scope.itemId = item.id;
        $scope.oneAddLanJieFlag = true;
      };
      $scope.oneSureLanJieFun = function () {
        erp.load();
        var addyfhData = {};
        addyfhData.ids = $scope.itemId;
        erp.postFun(
          'processOrder/handleOrder/updateOrderProcessInterception',
          JSON.stringify(addyfhData),
          function (data) {
            console.log(data);
            $scope.oneAddLanJieFlag = false;
            if (data.data.success) {
              $scope.pageNum = 1;
              $scope.getList();
            } else {
              layer.msg('拦截失败');
            }
          },
          function (data) {
            layer.closeAll('loading');
            console.log(data);
          }
        );
      };
      $scope.addLanJieFun = function () {
        $scope.checkList.length == 0
          ? layer.msg('请选择订单')
          : ($scope.isaddLjzFlag = true);
      };
      $scope.cancelAddLjzFun = function () {
        $scope.isaddLjzFlag = false;
      };
      $scope.sureAddLjzFun = function () {
        $scope.pageNum = 1;
        erp.load();
        var addyfhData = {};
        addyfhData.ids = $scope.checkIds.join(',');
        erp.postFun(
          'erp/faHuo/addIntercept',
          JSON.stringify(addyfhData),
          function (data) {
            console.log(data);
            $scope.isaddLjzFlag = false;
            if (data.data.result > 0) {
              $scope.pageNum = 1;
              $scope.getList();
            } else {
              layer.msg('批量提交到拦截中失败');
            }
          },
          function (data) {
            layer.closeAll('loading');
            console.log(data);
          }
        );
      };
      //查找商品
      var searchSpIds;
      $scope.isseachPFun = function () {
        var cxclNum = 0;
        var cxclids = [];
        searchSpIds = [];
        $scope.erporderList.forEach((item) => {
          if (item.checkFlag && item.order.id.indexOf('D') != -1) {
            cxclNum++;
            cxclids.push(item.order.id);
            searchSpIds.push(item.order.id);
          }
        });
        if (cxclNum < 1) {
          layer.msg('选中的订单中没有补发订单');
        } else {
          layer.load(2);
          var cxclData = {};
          cxclData.ids = cxclids;
          cxclData.system = 'y';
          cxclData.storageId = $scope.whichOneCk;
          cxclData.store = $scope.store;
          $scope.proTypeList.forEach((item) => {
            if ($scope.oneOrMuch == item.type)
              cxclData.dingDanLeiXing = item.val;
          });
          erp.postFun(
            'processOrder/pici/piLiangZhaoHuo',
            JSON.stringify(cxclData),
            function (data) {
              console.log(data);
              if (data.data.code == '200') {
                layer.msg('生成批次号成功');
                $scope.getList();
                var resPData = {};
                resPData.ids = searchSpIds.join(',');
                resPData.pici = data.data.result;
                console.log(resPData);
                erp.postFun2(
                  'newScanPiCiGetMianDan',
                  {
                    checked: '1',
                  },
                  function (data) {
                    console.log(data);
                  },
                  function (data) {
                    console.log(data);
                  }
                );
              } else {
                layer.closeAll('loading');
                layer.msg(data.data.message);
              }
            },
            function (data) {
              layer.closeAll('loading');
              layer.msg('网络错误');
              console.log(data);
            }
          );
        }
      };
      //查找商品单品
      $scope.danpIsseachPFun = function () {
        layer.load(2);
        var cxclData = {};
        cxclData.store = $scope.store + '';
        erp.postFun(
          'processOrder/pici/danPin',
          JSON.stringify(cxclData),
          function (data) {
            console.log(data);
            layer.closeAll('loading');
            layer.msg(data.data.success ? '成功' : data.data.message);
            erp.postFun2(
              'newScanPiCiGetMianDan',
              {
                checked: '1',
              },
              function (data) {
                console.log(data);
              },
              function (data) {
                console.log(data);
              }
            );
          },
          function (data) {
            layer.closeAll('loading');
            layer.msg('网络错误');
            console.log(data);
          }
        );
      };
      //查找商品多品
      $scope.duopIsseachPFun = function () {
        layer.load(2);
        var cxclData = {
          store: $scope.store + '',
        };
        erp.postFun(
          'processOrder/batchOrder/duoPin',
          JSON.stringify(cxclData),
          function (data) {
            console.log(data);
            layer.closeAll('loading');
            layer.msg(data.data.message);
            erp.postFun2(
              'newScanPiCiGetMianDan',
              {
                checked: '1',
              },
              function (data) {
                console.log(data);
              },
              function (data) {
                console.log(data);
              }
            );
          },
          function (data) {
            layer.closeAll('loading');
            layer.msg('网络错误');
            console.log(data);
          }
        );
      };
      //剩余批次
      $scope.sypcFun = function () {
        layer.load(2);
        var cxclData = {
          flag: $scope.oneOrMuch + '',
          store: $scope.store + '',
        };
        erp.postFun(
          'processOrder/batchOrder/shengYu',
          JSON.stringify(cxclData),
          function (data) {
            console.log(data);
            layer.closeAll('loading');
            layer.msg(data.data.message);
            erp.postFun2(
              'newScanPiCiGetMianDan',
              {
                checked: '1',
              },
              function (data) {
                console.log(data);
              },
              function (data) {
                console.log(data);
              }
            );
          },
          function (data) {
            layer.closeAll('loading');
            layer.msg('网络错误');
            console.log(data);
          }
        );
      };
      //选中
      $scope.isCheckFun = function (item, index, ev) {
        var checkedNum = 0;
        for (var i = 0; i < $scope.bulkResArr[index].skus.length; i++) {
          if ($scope.bulkResArr[index].skus[i]['checked'] == true) {
            checkedNum++;
          }
        }
        if (checkedNum == $scope.bulkResArr[index].skus.length) {
          $scope.bulkResArr[index].checkedAll = true;
          $('.cjd-chek-all').eq(index).prop('checked', true);
        } else {
          $scope.bulkResArr[index].checkedAll = false;
          $('.cjd-chek-all').eq(index).prop('checked', false);
        }
        $scope.$applyAsync();
      };
      // 选中所有商品
      $scope.checkAll = function (checkAllMark, index) {
        $scope.bulkResArr[index].checkedAll = checkAllMark;
        for (var i = 0; i < $scope.bulkResArr[index].skus.length; i++) {
          $scope.bulkResArr[index].skus[i].checked = checkAllMark;
        }
        console.log($scope.bulkResArr[index].skus);
      };
      //导出函数
      $scope.sjdcclosefun = function () {
        $scope.sjorstudcflag = false;
      };
      $scope.sjorstudcfun = function () {
        $scope.checkIds.length == 0
          ? layer.msg('请选择订单')
          : ($scope.sjorstudcflag = true);
      };
      $scope.sjdcFun = function () {
        var dcTimeVal = $.trim($('#dc-ord-time').val());
        if (dcTimeVal == '') {
          layer.msg('请选择时间');
          return;
        }
        erp.load();
        var ids = {};
        ids.ids = dcTimeVal + '#' + $scope.store + '#' + '67';
        ids.type = 1;
        erp.postFun(
          'app/order/exportErpOrder',
          JSON.stringify(ids),
          function (data) {
            console.log(data);
            $scope.sjorstudcflag = false;
            var href = data.data.href;
            console.log(href);
            layer.closeAll('loading');
            if (href.indexOf('https') >= 0) {
              $scope.dcflag = true;
              $scope.hrefsrc = href;
              console.log($scope.hrefsrc);
            } else {
              layer.msg('导出失败');
            }
          },
          function (data) {
            layer.closeAll('loading');
            console.log(data);
          }
        );
      };
      $scope.dcSyFun = function () {
        erp.load();
        var ids = {};
        ids.ids = $scope.store + '#' + '67';
        ids.type = 1;
        erp.postFun(
          'app/order/exportErpOrder',
          JSON.stringify(ids),
          function (data) {
            console.log(data);
            $scope.sjorstudcflag = false;
            var href = data.data.href;
            console.log(href);
            layer.closeAll('loading');
            if (href.indexOf('https') >= 0) {
              $scope.dcflag = true;
              $scope.hrefsrc = href;
              console.log($scope.hrefsrc);
            } else {
              layer.msg('导出失败');
            }
          },
          function (data) {
            layer.closeAll('loading');
            console.log(data);
          }
        );
      };
      $scope.dcxzFun = function (stu) {
        var ids = {};
        erp.load();
        ids.ids = $scope.checkIds.join(',');
        ids.type = stu;
        erp.postFun(
          'app/order/exportErpOrder',
          JSON.stringify(ids),
          function (data) {
            $scope.sjorstudcflag = false;
            console.log(data);
            var href = data.data.href;
            console.log(href);
            layer.closeAll('loading');
            if (href.indexOf('https') >= 0) {
              $scope.dcflag = true;
              // window.open(href,'_blank')
              $scope.hrefsrc = href;
              console.log($scope.hrefsrc);
            } else {
              layer.msg('导出失败');
            }
          },
          function (data) {
            layer.closeAll('loading');
            console.log(data);
          }
        );
      };
      $scope.isdcflag = false;
      $scope.isdcfun = function () {
        $scope.checkIds.length == 0
          ? layer.msg('请选择订单')
          : ($scope.isdcflag = true);
      };
      $scope.isdcclosefun = function () {
        $scope.isdcflag = false;
      };
      $scope.dcflag = false; //导出生成链接
      $scope.dcHbFun = function () {
        $scope.isdcflag = false; //关闭询问弹框
        erp.load();
        var ids = {};
        ids.ids = $scope.checkIds;
        ids.type = '1';
        erp.postFun(
          'processOrder/queryOrder/erpExport',
          JSON.stringify(ids),
          function (data) {
            cjUtils.exportFile(data.data, `orders.xls`);
          },
          function (data) {
            layer.closeAll('loading');
            console.log(data);
          },
          { responseType: 'blob', layer: true }
        );
      };
      $scope.dcFsFun = function () {
        $scope.isdcflag = false; //关闭询问弹框
        erp.load();
        var ids = {};
        ids.ids = $scope.checkIds;
        ids.type = '0';
        erp.postFun(
          'processOrder/queryOrder/erpExport',
          JSON.stringify(ids),
          function (data) {
            cjUtils.exportFile(data.data, `orders.xls`);
          },
          function (data) {
            layer.closeAll('loading');
            console.log(data);
          },
          { responseType: 'blob', layer: true }
        );
      };
      //关闭
      $scope.closeatc = function () {
        $scope.dcflag = false;
      };
      //显示大图
      $('.orders-table').on('mouseenter', '.sp-smallimg', function () {
        $(this).siblings('.hide-bigimg').show();
      });
      $('.orders-table').on('mouseenter', '.hide-bigimg', function () {
        $(this).show();
      });
      $('.orders-table').on('mouseleave', '.sp-smallimg', function () {
        $(this).siblings('.hide-bigimg').hide();
      });
      $('.orders-table').on('mouseleave', '.hide-bigimg', function () {
        $(this).hide();
      });
      //精确查找
      $scope.jqczSelCs = '子订单号'; //精确查询的条件
      $scope.jqczFlag = false;
      $scope.jqczFun = function () {
        $scope.jqczFlag = true;
      };
      $scope.sureJqczFun = function () {
        console.log($scope.jqczSelCs);
        let csData = {};
        csData.type = 'z';
        if ($scope.jqczSelCs == '子订单号') {
          csData.id = $scope.ordOrTnum;
        } else {
          if ($scope.ordOrTnum.length == 30) {
            let midStr = $scope.ordOrTnum;
            let subResStr = midStr.substring(midStr.length - 22);
            if (subResStr.substring(0, 1) == '9') {
              $scope.ordOrTnum = subResStr;
              csData.track = subResStr;
            }
          } else {
            csData.track = $scope.ordOrTnum;
          }
        }
        erp.postFun(
          'processOrder/queryOrder/getOrderLocation',
          JSON.stringify(csData),
          function (data) {
            console.log(data);
            $scope.jqczFlag = false;
            let resLocation = data.data.data.location;
            if (!$.isEmptyObject(data.data.data)) {
              localStorage.removeItem('store');
            }
            if (resLocation == '2') {
              console.log('不用跳转直接搜就行了');
              $scope.store = '';
              $scope.startDate = '';
              $scope.endDate = '';
              $scope.orderNumber = csData.track;
              $scope.searchFun();
            } else {
              var csDataObj = {};
              var setCsTime = new Date().getTime();
              csDataObj.tj = $scope.jqczSelCs;
              csDataObj.val = $scope.ordOrTnum;
              console.log(csDataObj);
              csDataObj = JSON.stringify(csDataObj);
              localStorage.setItem('ziCs', csDataObj);
              localStorage.setItem('setCsTime', setCsTime);
              if (resLocation == '1') {
                sessionStorage.setItem('clickAddr', '1,1,0');
                location.href = '#/erp-czi-ord';
              } else if (resLocation == '3') {
                sessionStorage.setItem('clickAddr', '1,1,2');
                location.href = '#/zi-three';
              } else if (resLocation == '4') {
                sessionStorage.setItem('clickAddr', '1,1,3');
                location.href = '#/zi-four';
              } else if (resLocation == '5') {
                sessionStorage.setItem('clickAddr', '1,1,4');
                location.href = '#/zi-five';
              } else {
                layer.msg('未找到订单');
              }
            }
          },
          function (data) {
            console.log(data);
          }
        );
      };
      $scope.QxJqczFun = function () {
        $scope.jqczFlag = false;
      };
      //获取转单号
      $scope.quaryZdhFun = function (item) {
        var upIds = {};
        upIds.ids = item.id;
        erp.postFun2(
          'searchOrderTracknumber.json',
          JSON.stringify(upIds),
          function (data) {
            console.log(data);
            if (data.data == 1) {
              layer.msg('获取转单号成功');
              $scope.getList();
            } else {
              layer.msg('获取转单号失败');
            }
          },
          function (data) {
            console.log(data);
          }
        );
      };
      $scope.upLoadImg4 = function (files) {
        erp.ossUploadFile($('#file')[0].files, function (data) {
          console.log(data);
          if (data.code == 0) {
            layer.msg('Upload Failed');
            return;
          }
          if (data.code == 2) {
            layer.msg('Upload Incomplete');
          }
          var result = data.succssLinks;
          var srcList = result[0].split('.');
          var fileName = srcList[srcList.length - 1].toLowerCase();
          console.log(fileName);
          if (fileName == 'pdf') {
            $scope.lrHref = result[0];
          } else {
            layer.msg('请上传pdf格式');
          }
          console.log(result);
          console.log($scope.lrHref);
          $scope.$apply();
        });
      };

      // 查看包装
      $scope.imgArr = [];
      $scope.packArr = [];
      $scope.ckBzFun = function (item, index, e) {
        e.stopPropagation();
        $('#ckbz-box .check-box input').each(function () {
          $(this).prop('checked', false);
        });
        $scope.packArr = [];
        $scope.imgArr = [];
        $scope.bzFlag = true;
        $scope.zordItemId = item.id;
        $scope.zordItemIndex = index;
        if (item.isPack) {
          var packKey = item.pack ? item.pack : [];
          var bzImgs = item.imgs ? item.imgs : [];
          $scope.packArr = JSON.parse(JSON.stringify(packKey));
          $scope.imgArr = JSON.parse(JSON.stringify(bzImgs));
          $('#ckbz-box .check-box input').each(function () {
            for (var i = 0, len = packKey.length; i < len; i++) {
              if (packKey[i] == $(this).attr('name')) {
                $(this).prop('checked', true);
              }
            }
          });
        }
      };

      $scope.upLoadImg5 = function (files) {
        erp.ossUploadFile($('#uploadInp')[0].files, function (data) {
          console.log(data);
          if (data.code == 0) {
            layer.msg('上传失败');
            return;
          }
          if (data.code == 2) {
            layer.msg('部分图片上传失败');
          }
          var result = data.succssLinks;
          console.log(result);
          for (var j = 0; j < result.length; j++) {
            var srcList = result[j].split('.');
            var fileName = srcList[srcList.length - 1].toLowerCase();
            console.log(fileName);
            if (
              fileName == 'png' ||
              fileName == 'jpg' ||
              fileName == 'jpeg' ||
              fileName == 'gif'
            ) {
              $scope.imgArr.push(result[j]);
              $('#uploadInp').val('');
            }
          }
          console.log($scope.imgArr);
          $scope.$apply();
        });
      };

      $scope.getPackingInfo = function ($event) {
        var currentCheckbox = $($event.target);
        if (currentCheckbox.prop('checked')) {
          $scope.packArr.push(currentCheckbox.attr('name'));
        } else {
          $scope.packArr.splice(
            $.inArray(currentCheckbox.attr('name'), $scope.packArr),
            1
          );
        }
        console.log($scope.packArr);
      };
      $scope.closeBzFun = function () {
        $scope.bzFlag = false;
      };
      $scope.deletImgFun = function (index) {
        $scope.imgArr.splice(index, 1);
      };
      $scope.sureZdBzFun = function () {
        if ($scope.packArr.length < 1) {
          layer.msg('请指定包装');
          return;
        }
        if ($scope.imgArr.length < 1) {
          layer.msg('请上传包装图片');
          return;
        }
        erp.load();
        var upJson = {};
        upJson.cjorderId = $scope.zordItemId;
        upJson.packKey = $scope.packArr;
        upJson.imgs = $scope.imgArr;
        erp.postFun(
          'processOrder/handleOrder/updateOrderPackInfo',
          JSON.stringify(upJson),
          function (data) {
            console.log(data);
            erp.closeLoad();
            if (data.data.code == 200) {
              $scope.bzFlag = false;
              $scope.erporderList[$scope.zordItemIndex].order.isPack = '1';
              $scope.erporderList[$scope.zordItemIndex].order.imgs =
                $scope.imgArr;
              $scope.erporderList[$scope.zordItemIndex].order.pack =
                $scope.packArr;
              $scope.imgArr = [];
              $scope.packArr = [];
              console.log($scope.erporderList[$scope.zordItemIndex].order);
              layer.msg('指定包装添加成功');
            } else {
              layer.msg(data.data.message);
            }
          },
          function (data) {
            console.log(data);
            erp.closeLoad();
          }
        );
      };

      var that = this;
      // /*查看日志*/
      $scope.isLookLog = false;
      $scope.LookLog = function (No, ev) {
        console.log(No);
        $scope.isLookLog = true;
        that.no = No;
        ev.stopPropagation();
      };
      $scope.$on('log-to-father', function (d, flag) {
        if (d && flag) {
          $scope.isLookLog = false;
        }
      });
      //导出pod图包 文字
      let podMuOrdId, podSaleManName;
      $scope.isSameMuIdFun = function (stu) {
        var addyfhCount = 0;
        addyfhIds = '';
        podMuOrdId = '';
        podSaleManName = '';
        let muOrdIdArr = $scope.checkIds;
        let itemZiOrdId;
        $scope.erporderList.forEach((item) => {
          if (item.checkFlag) {
            if (item.order.id.indexOf('GX') != -1) {
              addyfhIds += itemZiOrdId + ',';
              addyfhCount++;
            }
            podSaleManName = item.order.ownerName || item.order.salesmanName;
          }
        });
        if (addyfhCount > 0) {
          let muIdIsEqual = true;
          for (let i = 1, len = muOrdIdArr.length; i < len; i++) {
            if (muOrdIdArr[i] != muOrdIdArr[0]) {
              muIdIsEqual = false;
              break;
            }
          }
          if (muIdIsEqual) {
            if (stu == 2) {
              $scope.isDaoBaoFlag = true;
              podMuOrdId = muOrdIdArr[0];
            } else if (stu == 1) {
              $scope.isDaoTextFlag = true;
            }
            $scope.podTextIds = addyfhIds.substring(0, addyfhIds.length - 1);
          } else {
            layer.msg('请选择相同的母订单');
          }
        } else {
          $scope.isaddyfhFlag = false;
          layer.msg('请选择个性化订单');
        }
      };
      $scope.sureDaoChuFun = function () {
        console.log($scope.podTextIds);
        $scope.isDaoBaoFlag = false;
        window.open(
          'https://erp1.cjdropshipping.com/erp/podProduct/exportPodOrderText?id=' +
            $scope.podTextIds +
            '&cjId=' +
            podMuOrdId +
            '&salesmanId=' +
            podSaleManName
        );
      };
      $scope.copyPotIdsFun = function () {
        var hideInpVal = $('.pod-ziids');
        hideInpVal.select(); // 选中文本
        var isCopyFlag = document.execCommand('copy'); // 执行浏览器复制命令
        if (isCopyFlag) {
          layer.msg('复制成功');
          $scope.isDaoTextFlag = false;
        }
        console.log(hideInpVal);
      };

      // 获取订单下面的商品
      $scope.handleTargetData = (item, $event) => {
        item.clickcontrl = !item.clickcontrl;
        if (!item.clickcontrl) item.mousecontrol = false; // 保证收起
      };

      // 按规则生成批次
      $scope.handleGenerateBatch = () => {
        $scope.isGenerateBatch = true;
        $scope.orderType = 0;
        $scope.maximumQuantity = 28;
        $scope.minimumQuantity = 28;
      };

      $scope.handleConfrimBatch = () => {
        if (!$scope.maximumQuantity || !($scope.maximumQuantity > 0)) {
          layer.msg('请输入每批次订单最大数量且大于0');
          return;
        }
        if (!$scope.minimumQuantity || !($scope.minimumQuantity > 0)) {
          layer.msg('请输入按库位生成最大数量且大于0');
          return;
        }
        const parmas = {
          store: $scope.store.toString(),
          maximumQuantity: $scope.maximumQuantity,
          minimumQuantity: $scope.minimumQuantity,
          orderType: $scope.oneOrMuch === 0 ? Number($scope.orderType) : 1,
        };
        layer.load(2);
        erp.postFun(
          'processOrder/batchOrder/createBatch',
          parmas,
          (res) => {
            layer.closeAll('loading');
            if (res.data.code === '200') {
              layer.msg('操作成功');
              $scope.isGenerateBatch = false;
            } else {
              layer.msg(res.data.message ? res.data.message : '无可处理数据');
            }
          },
          (err) => {
            console.log(err);
          }
        );
      };

      $scope.handleSetVal = (field) => {
        $scope[field] = utils.floatLength($scope[field], 0);
      };

      $(window).scroll(function () {
        var before = $(window).scrollTop();
        if (before > 60) {
          if ($(window).width() > 1230) {
            $('.fiexd-box').css({
              position: 'fixed',
              top: 0,
              right: '28px',
            });
          } else {
            $('.fiexd-box').css({
              position: 'fixed',
              top: 0,
              right: '0px',
            });
          }
        } else {
          $('.fiexd-box').css({
            position: 'static',
            top: 0,
          });
        }
      });

      $scope.goAddZhiliu = function () {
        if ($scope.checkList.length == 0) {
          layer.msg('请选择订单');
          return;
        }
        erp.load();
        var addyfhData = {};
        addyfhData.ids = $scope.checkIds.join(',');
        erp.postFun(
          'processOrder/queryOrder/submitRetentionOrder',
          {
            ids: $scope.checkIds,
          },
          function (data) {
            console.log(data);
            $scope.isaddZhiliuFlag = false;
            if (data.data.code == 200) {
              $scope.pageNum = 1;
              $scope.getList();
            } else {
              layer.msg('批量提交到滞留订单失败');
            }
          },
          function (data) {
            layer.closeAll('loading');
            console.log(data);
          }
        );
      };

      // 17 物流查询
      $scope.handelLogisticsSearch = () => {
        $scope.trackingNumberList = $scope.erporderList.map(
          (o) => o.order.trackingnumber
        );
        $scope.isShowTarck = true;
        $scope.trackLink = [];
        for (let i = 0; i < $scope.trackingNumberList.length; i += 40) {
          $scope.trackLink.push($scope.trackingNumberList.slice(i, i + 40));
        }
        $scope.trackLink = $scope.trackLink.map(
          (o) => `https://t.17track.net/zh-cn#nums=${o.join(',')}`
        );
        console.log($scope.trackLink);
      };
      //添加到僵尸订单
      $scope.submitToJsOrder = function (it) {
        erp.load();
        var arr = [];
        arr.push(it.id);
        erp.postFun(
          'processOrder/observerOrder/submitObserverOrder',
          { ids: arr },
          function (data) {
            console.log(data);
            if (data.data.success) {
              $scope.pageNum = 1;
              $scope.getList();
              layer.msg('提交成功');
            } else {
              layer.msg('提交失败');
            }
          },
          function (data) {
            layer.closeAll('loading');
            console.log(data);
          }
        );
      };
      //驳回至待配齐
      $scope.rejectToReady = function (it) {
        erp.load();
        var arr = [];
        arr.push(it.id);
        erp.postFun(
          'processOrder/observerOrder/rejectedObserverOrder',
          { ids: arr },
          function (data) {
            console.log(data);
            if (data.data.success) {
              $scope.pageNum = 1;
              $scope.getList();
              layer.msg('驳回成功');
            } else {
              layer.msg('驳回失败');
            }
          },
          function (data) {
            layer.closeAll('loading');
            console.log(data);
          }
        );
      };

      //  缺货处理记录
      $scope.outOfStockHandleLog = function (order) {
        console.log(order);
        // 这里获取到订单的缺货处理记录
        $scope.outOfStockLog = [{ id: 1 }];
        $scope.outOfStockLogIsShow = true;
      };
      // 缺货处理方式
      $scope.outOfStockAction = '1';
      $scope.outOfStockActions = [
        { label: '分开发货', value: '1' },
        { label: '缺货商品退款', value: '2' },
        { label: '全部商品退款', value: '3' },
        { label: '缺货商品替换', value: '4' },
      ];
      // 缺货处理
      $scope.outOfStockActionHandle = function (order) {
        // 缓存当前订单
        $scope.curOrder = order;
        $scope.outOfStockActionIsShow = true;
        // 初始化缺货处理方式
        $scope.outOfStockAction = '1';
        // 缺货退款金额
        $scope.outOfStockReturnMoney = undefined;
        // 缺货替换sku
        $scope.outOfStockActionSkus = [{ sku: undefined, count: 1 }];
      };
      $scope.onOutOfStockAction = function () {
        const params = {
          type: $scope.outOfStockAction,
        };
        if (params.type === '2' || params.type === '3') {
          params.outOfStockReturnMoney = $scope.outOfStockReturnMoney;
        }
        if (params.type === '4') {
          params.skus = $scope.outOfStockActionSkus;
        }
        console.log('这里请求后端数据', params);
        // 成功后关闭弹框
        $scope.outOfStockActionIsShow = false;
      };
    },
  ]);

  // 缺货SKU客户列表
  app.controller('out-of-stock-customs-controller', [
    '$scope',
    '$http',
    'erp',
    '$routeParams',
    '$compile',
    'utils',
    function ($scope, $http, erp, $routeParams, $compile, utils) {
      console.log('进入缺货SKU客户列表', $routeParams);
      $scope.sku = $routeParams.sku || ''
      const isZhifa = $routeParams.isZhifa;
      console.log('进入SKU客户列表', '是否为直发？', isZhifa);
      //  列表数据
      $scope.erporderList = [
        { sku: '123123123', name: 'nammm', orders: 100, customId: 11231 },
        {
          sku: '123123122123123',
          childList: [{ sku: 13123123, ziorder: 111, kehu: 100 }],
        },
        { sku: '123123123' },
      ];

      $scope.getList = function () {
        if (!$scope.sku) return;
        const params = {
          sku: $scope.sku,
          type: 'custom',
        };
        console.log('请求列表', params);
        // 请求数据 修改erporderList
        // $scope.erporderList = res.list
      };
      $scope.getList();
    },
  ]);
})();
