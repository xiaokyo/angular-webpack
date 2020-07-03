(function() {
  var app = angular.module('merchandise');

  app.controller('activityGoodsManageCtrl', [
    '$scope',
    '$window',
    '$location',
    '$compile',
    '$routeParams',
    '$timeout',
    '$http',
    'erp',
    'merchan',
    '$sce',
    '$q',
    function(
      $scope,
      $window,
      $location,
      $compile,
      $routeParams,
      $timeout,
      $http,
      erp,
      merchan,
      $sce,
      $q,
    ) {
      console.log("activityGoodsManageCtrl");
      var bs = new Base64();
      $scope.loginName = localStorage.getItem('erploginName') ? bs.decode(localStorage.getItem('erploginName')) : '';
      $scope.isAdminLogin = erp.isAdminLogin();
      console.log('admin', $scope.isAdminLogin);
      $scope.userId = localStorage.getItem('erpuserId') == null ? '' : bs.decode(localStorage.getItem('erpuserId'));
      $scope.userName = localStorage.getItem('erpname') == null ? '' : bs.decode(localStorage.getItem('erpname'));
      $scope.token = localStorage.getItem('erptoken') == null ? '' : bs.decode(localStorage.getItem('erptoken'));
      $scope.typeSwitchFlag = true;

      const {id} = $location.search();
      if (id) {
        (function() {
          erp.postFun('cj/activity/getActivityByIdV2', {id}, res => {
            const data = res.data;
            if (data.statusCode != 200) {
              return layer.msg(data.message);
            }
            console.log(data.result);
            $scope.threeNames = data.result.threeNames;
          })
        })();
      } else {
        layer.msg('参数未传递 请返回上一页');
      }

      //分页 适合一次请求数据 前段处理分页
      function renderPage(currentPage, pageSize, totalCounts, dom, cb) {
        totalCounts = totalCounts ? totalCounts * 1 : 1;
        dom.jqPaginator({
          totalCounts,
          pageSize: pageSize * 1,
          visiblePages: 5,
          currentPage: currentPage * 1,
          activeClass: 'current-page',
          first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
          last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
          prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
          next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
          page: '<a href="javascript:void(0);" class="cb-operate">{{page}}<\/a>',
          onPageChange: function(n, type) {
            if (type == 'init') return;
            cb && cb(n)
          }
        });
      }

      function mypost (url, params) {
        return $q((resolve, reject) => {
          erp.postFun(url, JSON.stringify(params), function ({data}) {
            erp.closeLoad();
            const {result, statusCode, message} = data;
            if (statusCode != 200) {
              reject(data)
              return myMsg(message)
            }
            resolve(result)
          }, function(err) {
            console.log('errHandle  --->  ', err)
            reject(err)
            erp.closeLoad();
            layer.msg('服务器错误')
          })
        })
      }

      function initConfirmBox ({title='确认', cb}) {
        $scope.confirmBox = {
          hasShow: true,
          ok() {
            cb && cb()
            this.hasShow = false;
          },
          cancel() {
            this.hasShow = false;
          },
          title,
        }
      }

      function myMsg(str) { //提示框
        return layer.msg(str)
      }

      function getActivityProductList() {
        layer.load(2);
        erp.postFun('cj/activity/getActivityProductList', {'activityId': $scope.threeNamesItem.id}, res => {
          layer.closeAll('loading');
          const data = res.data;
          if (data.statusCode != '200') {
            return layer.msg(data.message);
          }
          const skuList = [];
          data.result.map(_ => {
            skuList.push(_.sku);
          })
          $scope.skuList = skuList.join();
        })
      }
      $scope.selectThreeTitle = () => {
        getActivityProductList();
      }
      $scope.systemSelect = () => {
        if (!$scope.threeNamesItem) return myMsg('请先选择三级标题');
        $scope.typeSwitchFlag = false;
      }
      $scope.goBack = () => {
        initConfirmBox({
          title: '确认返回 ?',
          cb: function() {
            $location.path("merchandise/activityConfig").search('');
          }
        })
      }
      $scope.saveGoods = () => {
        if (!$scope.threeNamesItem) return false;
        initConfirmBox({
          title: '确认保存 ?',
          cb: function() {
            data = {
              'activityId': $scope.threeNamesItem.id,
              'skuList': $scope.skuList
            }
            erp.postFun('cj/activity/insertActivitySKUList', data, res => {
              // console.log(res);
              const data = res.data;
              if (data.statusCode != 200) {
                return layer.msg(data.message);
              }
              layer.open({
                title: '',
                area: ['520px', '420px'],
                content: data.message,
              })
            })
          }
        })
      }


      const GoodsCategorysDic = { //名称对应的  id
        '计算机及办公': '1126E280-CB7D-418A-90AB-7118E2D97CCC',
        '包和鞋子': '2415A90C-5D7B-4CC7-BA8C-C0949F9FF5D8',
        '珠宝和手表': '2837816E-2FEA-4455-845C-6F40C6D70D1E',
        '保健，美容，美发': '2C7D4A0B-1AB2-41EC-8F9E-13DC31B1C902',
        '女士服装': '2FE8A083-5E7B-4179-896D-561EA116F730',
        '运动和户外': '4B397425-26C1-4D0E-B6D2-96B0B03689DB',
        '居家用品，家具': '52FC6CA5-669B-4D0B-B1AC-415675931399',
        '家装': '6A5D2EB4-13BD-462E-A627-78CFED11B2A2',
        '汽车和摩托车': 'A2F799BE-FB59-428E-A953-296AA2673FCF',
        '玩具，儿童及婴儿用品': 'A50A92FA-BCB3-4716-9BD9-BEC629BEE735',
        '男士服装': 'B8302697-CF47-4211-9BD0-DFE8995AEB30',
        '消费电子': 'D9E66BF8-4E81-4CAB-A425-AEDEC5FBFBF2',
        '手机及配件': 'E9FDC79A-8365-4CA6-AC23-64D971F08B8B',
      }

      function getGoodsCategorys() { //获取商品类目id  逗号连成字符串
        return $scope.goodscheckbox.selectedArr.map(({
          name
        }) => GoodsCategorysDic[name]).join(',') //商品类目
      }

      const kindsList = ['计算机及办公', '包和鞋子', '珠宝和手表', '保健，美容，美发', '女士服装', '运动和户外', '居家用品，家具', '家装', '汽车和摩托车', '玩具，儿童及婴儿用品', '男士服装', '消费电子', '手机及配件']
      const goodsTypeList = kindsList.map(item => ({
        name: item,
        checked: false
      }));
      $scope.goodscheckbox = { //商品类目
        kindsList: goodsTypeList,
        text: '请选择类目',
        selectAreaShow: false,
        hoverIndex: -1,
        textblur: false,
        selectedArr: [], //选中的商品类目
        disabled: false,
      }
      $scope.showHandle = function(ev) { //显示商品类目选择列表
        ev.stopPropagation()
        const bol = $scope.goodscheckbox.textblur;
        // console.log('showHandle2', bol)
        $scope.goodscheckbox.textblur = !bol;
        $scope.goodscheckbox.selectAreaShow = !bol;
      }
      $scope.mouseoverHandle = function(i) { //悬浮颜色高亮
        if ($scope.goodscheckbox.disabled) return
        // console.log('mouseoverHandle', i)
        $scope.goodscheckbox.hoverIndex = i;
      }
      $scope.selectItem1 = function(i, ev) { //选择商品类目
        ev && ev.stopPropagation()
        if ($scope.goodscheckbox.disabled) return
        const bol = $scope.goodscheckbox.kindsList[i].checked;
        $scope.goodscheckbox.kindsList[i].checked = !bol;

        $scope.goodscheckbox.selectedArr = $scope.goodscheckbox.kindsList.filter(({
          checked
        }) => checked); //checked
        calcuTxt()
      }

      function calcuTxt() { //计算显示文字
        const len = $scope.goodscheckbox.selectedArr.map(({
          name
        }) => name).length;
        const txt = `已选择 ${len} 个类目`;
        $scope.goodscheckbox.text = $scope.goodscheckbox.textblur || len > 0 ? txt : '请选择类目';
      }
      document.onclick = function() { //点击其他隐藏商品类目选择框
        $timeout(function() {
          $scope.goodscheckbox.selectAreaShow = false;
          $scope.goodscheckbox.textblur = false;
          calcuTxt()
        }, 0)
      }
      $scope.pushGoodsListPamrams = { //推送 商品列表 获取所需参数
        pageNum: '1',
        pageSize: '20',
        total: '1',
        navPage: '', //跳转页面
        hasAllSelected: false, //全选按钮
        productName: '', //  产品名称 sku 搜索栏
        productcate: '', //  商品类目id 逗号连成字符串
        pushStatus: '0' // 0 => 左边   1 => 右边待推送列表
      }
      $scope.pushGoodsListInfo = []; //push 当前页 推送 数据列表
      $scope.goodsWaitingPush = []; //push 待推送列表
      $scope.selectItem = function(i) { //单选商品列表
        // console.log('selectItem', i)
        $scope.pushGoodsListInfo[i].checked = !$scope.pushGoodsListInfo[i].checked;
        const allSelected = $scope.pushGoodsListInfo.every(({
          checked
        }) => checked);
        $scope.pushGoodsListPamrams.hasAllSelected = allSelected;
      }
      $scope.allSelectHandle = function() { //全选商品列表
        let bol = !$scope.pushGoodsListPamrams.hasAllSelected;
        $scope.pushGoodsListPamrams.hasAllSelected = bol;
        $scope.pushGoodsListInfo.forEach(item => item.checked = bol);
      }

      function getPushGoodsList(n) { //获取商品列表数据  同时设置 页码跳转模块
        erp.load()
        let productcate = getGoodsCategorys()
        let params = {
          ...$scope.pushGoodsListPamrams,
          productcate
        }
        let p = mypost('erp/appPush/productList', params);
        p.then(function({
          productManual,
          total
        }) {
          // console.log('getPushGoodsList-------------------------',productManual);
          n && ($scope.pushGoodsListPamrams.pageNum = n + ''); //成功跳转页面后赋值当前页面
          $scope.pushGoodsListInfo = productManual.map(item => {
            let img = item.img.split(',').pop(); //后台数据 的img 有可能多个 字符串逗号拼接 默认选取第一个
            return {
              ...item,
              checked: false,
              img
            } //checked false  默认没有选中
          })
          let {
            pageNum,
            pageSize
          } = $scope.pushGoodsListPamrams;
          $scope.pushGoodsListPamrams.total = total + '';
          const dom = $('.push-page');
          renderPage(pageNum, pageSize, total, dom, changePushListPage)
        })
      }

      function changePushListPage(n) { //页码跳转 jqPaginator回调
        if ($scope.pushGoodsListInfo.some(({
            checked
          }) => checked)) return myMsg('页面跳转不会保存本页选中的商品')
        getPushGoodsList(n)
      }
      $scope.pageGo = function() { //跳转页面
        if ($scope.pushGoodsListInfo.some(({
            checked
          }) => checked)) return myMsg('页面跳转不会保存本页选中的商品')
        const {
          navPage: n,
          total,
          pageSize,
          pageNum
        } = $scope.pushGoodsListPamrams;
        if (n == pageNum) return
        if (n && n <= Math.ceil(total / pageSize) && n > 0) { //异常页码处理
          getPushGoodsList(n)
        } else {
          myMsg('请输入正确的页码进行跳转');
        }
      }
      function getWaitingPushGoodsList() { //获取待推送列表数据
        erp.load()
        let productcate = getGoodsCategorys()
        let params = {
          ...$scope.pushGoodsListPamrams,
          productcate,
          pushStatus: '1'
        }; //pageSize 后端不处理 直接返回全部
        let p = mypost('erp/appPush/productList', params);
        p.then(function({
          pending
        }) {
          $scope.goodsWaitingPush = pending.map(item => {
            const img = item.img.split(',').pop(); //img 可能多个  字符串形式逗号分隔
            return {
              ...item,
              backChecked: false,
              img
            };
          })
        })
      }

      $scope.searchGoods = function() { //查询商品
        getPushGoodsList();
        getWaitingPushGoodsList();
      }
      $scope.addGoods = function () {//添加商品
        const goodsWaitingPush = $scope.pushGoodsListInfo.filter(({checked}) => checked);
        if (goodsWaitingPush.length === 0) return myMsg('请选择添加商品')
        const productid = goodsWaitingPush.map(({productid}) => productid).join(',')
        const p = mypost('erp/appPush/updatePushProducts', {productid, pushStatus: '1'});
        p.then(function() {
        $scope.pushGoodsListPamrams.hasAllSelected = false;//此时全选按钮
          getPushGoodsList();
          getWaitingPushGoodsList();
        })
      }
      $scope.backGoods = function () {//还原商品
        const goodsWaitingPush = $scope.goodsWaitingPush.filter(({backChecked}) => backChecked);
        if (goodsWaitingPush.length === 0) return myMsg('请选择还原商品')
        const productid = goodsWaitingPush.map(({productid}) => productid).join(',')
        const p = mypost ('erp/appPush/updatePushProducts', {productid, pushStatus: '0'});
        p.then(function() {
            getPushGoodsList();
            getWaitingPushGoodsList();
        })
      }

      $scope.sendHandle = () => {
        if ($scope.goodsWaitingPush.length === 0) return myMsg('还未添加任何商品');
        initConfirmBox({
          title: '确认添加待推送列表中的商品 ?',
          cb: function() {
            $scope.goodsWaitingPush.map(({sku}) => {
              if (!$scope.skuList.includes(sku)) {
                if ($scope.skuList.length === 0) return $scope.skuList += `${sku}`;
                $scope.skuList += `,${sku}`;
              }
            })
            $scope.typeSwitchFlag = true;
            const productid = $scope.goodsWaitingPush.map(({productid}) => productid).join(',');
            const p = mypost ('erp/appPush/updatePushProducts', {productid, pushStatus: '0'});
            p.then(function() {
            getPushGoodsList();
            getWaitingPushGoodsList();
            })
          }
        })
      }
    }
  ]);
})();