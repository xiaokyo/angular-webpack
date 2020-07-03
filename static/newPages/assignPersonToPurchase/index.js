; (function () {
  const app = angular.module('assignPersonToPurchase', [])

  const warehouseList = [//仓库列表   统一采购列表
    { value: '0', label: '义乌仓', id: ['{6709CCD7-0DC7-43B1-B310-17AB499E9B0A}'] },
    { value: '1', label: '深圳仓', id: ['85742FBC-38D7-4DC4-9496-296186FFEED8'] },
    { value: '2', label: '美东仓', id: ['201e67f6ba4644c0a36d63bf4989dd70'] },
    { value: '3', label: '美西仓', id: ['738A09F1-2834-43CC-85A8-2FE5610C2599'] },
    { value: '4', label: '泰国仓', id: ['f87a1c014e6c4bebbe13359467886e99', '7779ff66a0474bbdadcf1bf4924f228b'] },
    { value: '5', label: '金华仓', id: ['83hrf88jd3f38yf8ue8j8u3jhd3ruerj'] },
    // 7779ff66a0474bbdadcf1bf4924f228b -->> 接口请求 虚拟泰国仓  f87a1c014e6c4bebbe13359467886e99  -->> 手动添加泰国仓 实际使用 
    // { value: '6', label: '印尼仓', id: 'f87a1c014e6c4bebbe13359467886e99' },
  ];
  const markList = [// 统一采购标记
    { value: 'zhengChang', label: '正常' },
    { value: 'jiaJi', label: '加急' },
    { value: 'vip', label: 'Vip' },
    { value: 'zhiFa', label: '直发' },
    { value: 'zuZhuang', label: '组装' },
    { value: 'buRuKu', label: '不入库' },
    { value: 'usaZhiFa', label: '美国仓直发' },
    { value: 'xianXiaZu', label: '线下组' },
    { value: 'gaiBiao', label: '改标' },
  ];

  app.controller('assignPersonToPurchaseCtrl', ['$scope', 'erp', 'utils', function ($scope, erp, utils) {
    const api = {
      storageList: 'app/storage/getStorage',// 仓库列表接口  {get}
      goodsList_old: 'caigou/procurement/todaySkuList',//商品 list {post inputStr: '搜索内容', pageNum: '1', pageSize: '30', storageId: '仓库id' }
      goodsList: 'procurement/order/queryProcurementOrderList',//商品 list {post inputStr: '搜索内容', pageNum: '1', pageSize: '30', storageId: '仓库id' }
      needGoodsList_old: 'caigou/procurement/todaySkuListQueHuo',//缺货商品 list{post inputStr: '搜索内容', pageNum: '1', pageSize: '30', storageId: '仓库id' }
      needGoodsList: 'procurement/order/todaySkuListQueHuo',//缺货商品 list {post data: {storageId: '', inputStr: '搜索内容' }, pageSize: '', pageNum: ''}
      goodsVariantList_old: 'caigou/procurement/todaySkuListVariant',//变体 list {post pid: '商品id', storageId: '仓库id'} // 商品id -->> productId
      goodsVariantList: 'procurement/order/todaySkuListVariant',//变体 list {post pid: '商品id', storageId: '仓库id'} // 商品id -->> productId
      remark: 'procurement/order/setMessage',//采购消息 商品备注 {post search: '备注内容', productId: '商品id'}
      supplierLinkList_old: 'caigou/procurement/xiuGaiLianJie',//修改供应商链接 {post pid: '商品id', supplierLinks: [{name: 'url', star: 5, beiZhu: ''}]}
      supplierLinkList: 'procurement/order/xiuGaiLianJie',//修改供应商链接 {post pid: '商品id', supplierLinks: [{name: 'url', star: 5, beiZhu: ''}]}
      prepurchaseDetail: 'caigou/procurement/quQitianJiLu',//预采购详情 {post bianTiId: '变体id', store: 0} // 变体id -->> variantId 仓库映射的数字 -->> store
      finishPurchase: 'caigou/procurement/zhiJieWanCheng',//采购完成 {post chuDanCaiGouIds: [{id: 531723}], dingDanHao: '备注内容'} // id -->> 变体列表 id
      handleNeedGoods: 'caigou/procurement/biaoJiQueHuo',//批量缺货 {post chuDanCaiGouIds：[{id: 531723}] }   // id -->> 变体列表 id
      newGoodsVariantList: 'procurement/product/getProcurementOrderProductList',//变体列表 {post  {storage, productId}} // 商品id -->> productId
      // 仓库 storage :1-义乌仓  2-深圳仓  3-美东仓  4-美西仓  5-泰国仓  6-印尼仓 
      report: 'procurement/report/getReportPage', //post {data: {pid: '', vid: ''}, pageSize: '', pageNum: ''}
      reportAverage: 'procurement/report/getAllAverage',//post {pid: '', vid: ''}
    }
    const query = erp.retUrlQuery();
    const base64 = new Base64();
    const loginName = base64.decode(localStorage.getItem('erpname') == undefined ? "" : localStorage.getItem('erpname'))
    $scope.searchValue = '';//搜索 sku 输入框 
    $scope.storageId = query.storageId || '{6709CCD7-0DC7-43B1-B310-17AB499E9B0A}'; //默认 义乌仓
    // $scope.itemStoragename = warehouseList.find(_=>_.id[0] == $scope.storageId).label // 默认仓库名称
    warehouseList.forEach(_ => { // 默认仓库名称
      _.id.forEach(id => {
        if (id === $scope.storageId) $scope.itemStoragename = _.label
      })
    })
    console.log($scope.itemStoragename)
    $scope.pageNum = query.pageNum || '1';
    $scope.pageSize = '30';
    $scope.totalNum = 0;//查询的商品总数量
    $scope.initGoodsList = initGoodsList;// 搜索 pageSize 切换 初高级采购切换  仓库切换
    init()
    function init() {
      getStorageList()//获取 仓库列表
      // getList()
      // getStorageList(erp,function(data){
      // 	$scope.storageList = data
      // 	$scope.storageId = data[0].id
      // 	getList();// 获取 商品列表
      // })
      getSearchValue()//获取 记录的搜索内容
      // getList();// 获取 商品列表
      initRemarkMoudule()// 初始化 采购消息 商品备注 功能模块
    }

    // $scope.isQueHuoFlag --->> true or false 跳转页面查询接口使用不一致

    $scope.navToPage = function (key, item) {//线上采购 （tmall taobao 1688notApi） --- 单个变体采购 or 全部变体采购 
      // console.log('navToPage', item)
      const { dingDanZhuangtai: caigoubiaoji, name: supplierUrl } = item;
      const urlObj = {
        taobao: { baseUrl: '/manage.html#/erppurchase/online', query: { which: 2 } },
        tmall: { baseUrl: '/manage.html#/erppurchase/online', query: { which: 3 } },
        notapi1688: { baseUrl: '/manage.html#/erppurchase/online', query: { which: 0 } },
      }
      const { pageNum, isQueHuoFlag, storageId, recordId, recordIndex: index, buyerId } = $scope;
      const hasStockout = isQueHuoFlag ? 1 : 0;//是否缺货  所请求的接口相同
      const query = { hasStockout, ...urlObj[key].query, pid: recordId, storageId, pageNum, caigoubiaoji, supplierUrl, buyerId }
      index !== undefined && Object.assign(query, { index })
      const url = erp.setQueryToUrl(urlObj[key].baseUrl, query)
      console.log(url, query)
      setSearchValue()
      // return console.log('url --->> ', url)
      navTo(url)
    }
    $scope.handle1688api = function (item) {
      console.log('handle1688api', item)
      const { name: url, dingDanZhuangtai: caigoubiaoji = 'zhengChang' } = item;
      const { isQueHuoFlag, recordVariantId: stanId, recordIndex: index, recordId, storageId, itemStoragename, pageNum, buyerId } = $scope;
      const hasStockout = isQueHuoFlag ? 1 : 0;//是否缺货  所请求的接口相同
      const query = { url, caigoubiaoji, pid: recordId, storageId, storagename: itemStoragename, hasStockout, pageNum, buyerId };
      if (!recordId) layer.msg('商品ID没取到，请重试')
      console.log(query)
      stanId && Object.assign(query, { stanId, index })
      const navUrl = erp.setQueryToUrl('/manage.html#/erppurchase/1688api', query)
      setSearchValue()
      navTo(navUrl);
    }

    $scope.isAllowPurchase = function (item) { // true 不允许采购
      if (item.warningStatus != '1' && !!item.warningRange) {
        layer.msg('你的商品预采购数量已超过预警值，请联系管理员')
        return true
      }
      return false
    }

    // 判断预采购师傅在处理中且在路上
    $scope.isHandleAdvancePuchaseNum = function (item) {
      const { useStatus, trueQuantity } = item
      let res = ''
      if (useStatus == "1" && trueQuantity) {
        res = " (" + trueQuantity + "在路上) "
      }
      return res
    }

    function setSearchValue() {//记录当前搜索内容
      const val = $scope.searchValue;
      console.log('setSearchValue -->> ', val, typeof val)
      erp.mySession('searchValue', val);
    }
    function getSearchValue() {//获取搜索内容
      const val = erp.mySession('searchValue');
      $scope.searchValue = val || '';
    }
    $scope.recordId = '';//2019-12-10 线上采购点击时记录 线下采购跳转页面  --->> 传递pid
    $scope.recordIndex = undefined;//记录点击时 是变体 还是 列表项 undefined
    $scope.recordVariantId = null;//记录点击时 变体id  null 则 变体列表
    $scope.handleOfflineClick = function (params, index) {//index   变体项 点击时索引 undefined时默认 全部变体采购
      const { productId, storageId } = params;
      let url = '/manage.html#/erppurchase/offline';
      const hasStockout = $scope.isQueHuoFlag ? 1 : 0;
      const query = { pid: productId, hasStockout, storageId, pageNum: $scope.pageNum, buyerId: $scope.buyerId }
      index !== undefined && Object.assign(query, { index })
      url = erp.setQueryToUrl(url, query)
      console.log('handleOfflineClick', url, params)
      setSearchValue()
      navTo(url)
    };
    $scope.batchingOffline = function () {//批量线下 采购
      const url = '/manage.html#/erppurchase/offline';
      batchingHandle(url)
    };
    $scope.batchingOnline = function (key, item) {//批量线上 非1688api tmall 淘宝 采购
      const urlObj = {
        taobao: { baseUrl: '/manage.html#/erppurchase/online', query: { which: 2 } },
        tmall: { baseUrl: '/manage.html#/erppurchase/online', query: { which: 3 } },
        notapi1688: { baseUrl: '/manage.html#/erppurchase/online', query: { which: 0 } },
      }
      const query = { ...urlObj[key].query, supplierUrl: item.name }
      // const list = $scope.btCheckedArr;
      batchingHandle(urlObj[key].baseUrl, query)
    };
    $scope.batching1688Api = function (item) {//批量线上 1688api 采购
      const url = '/manage.html#/erppurchase/1688api';
      batchingHandle(url, { url: item.name })
    }
    function batchingHandle(url, query) {//使用原有的 选择 功能  同时只能选择 一个商品下的变体 btlist 
      const target = $scope.chudanliebiao.find(item => item.btList && item.btList.length > 0)
      if (!target) return layer.msg('请选择变体');
      const list = target.btList.filter(({ checked }) => checked)
      setSearchValue()
      if (list.length <= 0) return layer.msg('获取列表失败,请重新勾选')
      erp.mySession('purchase', { list })
      const { storageId, itemStoragename: storagename, isQueHuoFlag, buyerId } = $scope;
      const hasStockout = isQueHuoFlag ? 1 : 0;//是否缺货  所请求的接口相同
      url = erp.setQueryToUrl(url, { hasStockout, storageId, storagename, buyerId, ...query })
      // return console.log(url, list, storageId)
      navTo(url)
    }
    function handleRecordId(item, index, recordVariantId) {//点击 线上采购 记录 id 以便跳转页面 提供参数
      $scope.recordId = item.productId;//12-10 点击线上采购 记录商品id
      $scope.recordIndex = index;//12-11 点击线上采购记录 索引 undefined时 为全部变体  索引时  具体到某一项
      $scope.recordVariantId = index === undefined ? null : recordVariantId;// index 存在 则 变体id 存在 
      console.log('productId, index, recordVariantId', item.productId, index, recordVariantId)
    }
    function err(a) {
      console.log(a);
      layer.closeAll('loading');
    };





    function initRemarkMoudule() {//初始化 采购消息 商品备注 功能模块
      let recordRemark, selectedItem;
      $scope.showRemarkBox = function (item) {//打开 采购消息编辑框
        const { productId, remark, LOCREMARK } = item;
        const remarktext = remark.split(',')[0]
        selectedItem = { productId, remark: remarktext, LOCREMARK };
        $scope.purchaseRemark = remarktext;//采购消息
        recordRemark = remarktext;//记录采购消息
        $scope.goodsRemark = LOCREMARK;//商品备注
        $scope.remarkBoxShow = true;//打开 采购消息编辑框
      }
      $scope.hideRemarkBox = function () {//关闭 采购消息编辑框
        $scope.remarkBoxShow = false;
        $scope.goodsRemark = '';
        $scope.purchaseRemark = '';
        recordRemark = '';
      }
      $scope.submitRemarkEdit = function () {// 确认 采购消息编辑框
        let search = $scope.purchaseRemark;
        if (recordRemark === search) return $scope.remarkBoxShow = false;
        const params = { productId: selectedItem.productId, search: `${search},${loginName},${utils.changeTime(new Date(), true)}` };
        erp.mypost(api.remark, params).then(() => {
          getList();
          $scope.remarkBoxShow = false;
          layer.msg('备注成功')
        }).catch(() => {
          $scope.remarkBoxShow = false;
          layer.msg("备注失败");
        })
      }
    }

    //预采购 --- >>
    $scope.checkPrepurchaseDetail = function (item) {
      console.log(item)
      const storageArr = ['{6709CCD7-0DC7-43B1-B310-17AB499E9B0A}', '85742FBC-38D7-4DC4-9496-296186FFEED8', ['201e67f6ba4644c0a36d63bf4989dd70', '738A09F1-2834-43CC-85A8-2FE5610C2599']]
      const storeIndex = storageArr.findIndex(item => item.includes($scope.storageId))
      if (storeIndex === -1) return layer.msg('请咨询后端 仓库id 索引')
      const bianTiId = item.variantId;
      erp.load()
      erp.mypost(api.prepurchaseDetail, { bianTiId, store: storeIndex }).then(res => {
        $scope.PrepurchaseDetailBoxShow = true;
        $scope.prepurchaseList = res;
      })
    }
    $scope.checkOrderPayingList = function (item, n) {
      const { yiZhiFuDingDan, weiZhiFuDingDan } = item;
      $scope.orderList = n === 1 ? yiZhiFuDingDan : weiZhiFuDingDan;
      const msg = n === 1 ? '无已支付订单详情' : '无未支付订单详情';
      $scope.orderList.length > 0 ? ($scope.orderListBoxShow = true) : layer.msg(msg)
    }
    //预采购 << ---

    //获取仓库列表
    function getStorageList() {
      $scope.storageList = [];
      erp.getFun(api.storageList, function ({ data }) {
        let { result, statusCode } = data;
        if (statusCode !== '200') return;
        result = JSON.parse(result);
        result.push({ id: "f87a1c014e6c4bebbe13359467886e99", storage: "泰国仓" })//处于某某原因 前端手动添加 泰国项
        $scope.storageList = result;
        console.log("TCL: getStorageList -> result", result)
      })
    }

    // 获取商品列表
    function getList() {
      erp.load();
      const url = api.goodsList;
      const { pageNum, pageSize, storageId, searchValue: inputStr } = $scope;
      const params = { data: { storageId, inputStr }, pageNum, pageSize }
      params.data.buyerId = $scope.buyerId // 组长id
      params.data.personalizedIdentity = $scope.personalizedIdentity // 是否pod商品  0 不是  1 pod商品  2 有采购员但无pod
      params.data.assignBuyerId = $scope.assignBuyerId
      params.data.assignFlag = $scope.assignFlag

      erp.mypost(url, params).then(res => {
        if (!res) {// res存在 返回 null 情况
          $scope.chudanliebiao = [];
          $scope.totalNum = 0;
          return
        };
        const { total, list } = res;
        $scope.totalNum = total;
        $scope.chudanliebiao = list.map(item => {
          const { otherGoodsInfoVOs } = item;
          if (otherGoodsInfoVOs && otherGoodsInfoVOs.length > 0) {
            item.calcCount = otherGoodsInfoVOs.reduce((count, { num }) => count + num, 0)
          }
          return { ...item, checked: false }
        });
        total && pageFun();//存在数量 初始化 页码
      })
    }

    $scope.purchaseList = []
    $scope.purchaseGroupLeaders = []
    erp.getPurchasePerson(function (list) {
      $scope.purchaseList = angular.copy(list)

      const groupLeaders = []
      angular.copy(list).forEach(_ => {
        if (window.purchaseGroupLeaders.includes(_.loginName)) {
          groupLeaders.push(_)
        }
      })
      $scope.purchaseGroupLeaders = groupLeaders
    })

    $scope.purchasePersonCallback = function ({ id, loginName }) {
      $scope.buyerId = undefined
      $scope.loginName = undefined
      $scope.personalizedIdentity = 2
      if (id == 'POD') $scope.personalizedIdentity = 1
      if (id != 'POD' && id != '') {
        $scope.buyerId = id
        $scope.loginName = loginName
        $scope.personalizedIdentity = 0
      }
      getList()
    }

    // assignBuyerId
    let fristPurchasePersonAssignGetList = true
    $scope.purchasePersonAssign = function ({ id }) {
      $scope.assignBuyerId = id
      !fristPurchasePersonAssignGetList && getList()
      fristPurchasePersonAssignGetList = false
    }

    // 切换查询 商品列表 或 缺货列表
    $scope.toggleOutOfStockBtn = function () {
      $scope.isQueHuoFlag = !$scope.isQueHuoFlag;
      initGoodsList()
    }

    // 是否全选
    $scope.isCheckAll = false
    $scope.checkAllcheckbox = function () {
      const checked = $scope.isCheckAll
      const list = $scope.chudanliebiao
      $scope.chudanliebiao = list.map(_ => ({ ..._, checked }))
    }
    $scope.hasCheckAll = function () {
      let count = 0, list = $scope.chudanliebiao, len = list.length;
      list.forEach(_ => {
        if (_.checked) count++
      })
      if (count == len) $scope.isCheckAll = true
      else $scope.isCheckAll = false
    }

    // 指定分配的人
    $scope.selectNeedAssignPurchasePerson = function ({ id: assignerId, loginName: assignerName }) {
      $scope.needAssignPersonObj = { assignerId, assignerName }
    }

    // 单个分配
    $scope.singleAssignParams = {}
    $scope.singleAssign = function ({ productId: locProductId, sku, assignBuyerId }) {
      $scope.singleAssignParams = { locProductId, sku, assignBuyerId }
      $scope.showAssignPop = true
    }
    $scope.singleOnOk = function () {
      const { assignerId, assignerName } = $scope.needAssignPersonObj
      const { locProductId, sku } = $scope.singleAssignParams
      let buyerId = $scope.buyerId, buyerName = $scope.loginName;
      const params = { locProductId, sku, assignerId, assignerName, buyerId, buyerName }
      assignProWork([params])
    }

    // 批量操作弹框
    $scope.batchAssignOpen = function () {
      $scope.singleAssignParams = {}
      const list = $scope.chudanliebiao, len = list.length;
      const selecteds = list.filter(_ => _.checked)
      if (selecteds.length <= 0) return layer.msg('请选择商品')
      $scope.showAssignPop = true
    }

    // 批量操作分配
    $scope.batchAssign = function () {
      const list = $scope.chudanliebiao, len = list.length;
      const { assignerId, assignerName } = $scope.needAssignPersonObj
      const selecteds = list.filter(_ => _.checked)
      let buyerId = $scope.buyerId, buyerName = $scope.loginName;
      const params = selecteds.map(({ productId: locProductId, sku }) => ({ locProductId, sku, buyerId, buyerName, assignerId, assignerName }))
      assignProWork(params)
    }

    $scope.groupLeader = {}
    $scope.assignOk = function () {
      console.log('===============', $scope.purchaseGroupLeaders)
      const type = $scope.singleAssignParams.sku ? 'single' : 'mutiple'
      if (type == 'single') $scope.singleOnOk()
      if (type == 'mutiple') $scope.batchAssign()
    }

    // 批量分配工作
    const assignProWork = function (data) {
      let params = data, isPod = $scope.personalizedIdentity == 1;
      if (isPod) params = params.map(_ => ({ ..._, buyerId: ($scope.groupLeader.currentValue && $scope.groupLeader.currentValue.id) || '', buyerName: ($scope.groupLeader.currentValue && $scope.groupLeader.currentValue.loginName) || '' }))
      const { buyerId, buyerName, assignerId, assignerName } = params[0]
      if (!buyerId || !buyerName) return layer.msg(isPod ? '请选择采购组长' : '请先在列表页选择采购组长')
      if (!assignerId || !assignerName) return layer.msg('请选择需要分配的采购员')
      const index = layer.load(0)
      erp.postFun('procurement/assigner/updateBuyerAssigner', angular.toJson(params), function (res) {
        layer.close(index)
        if (res.data.code != 200) return layer.msg(res.data.message || '网络错误')
        layer.msg('分配成功')
        clearAssignPop()
      })
    }

    // 清空当前分配操作
    function clearAssignPop() {
      $scope.showAssignPop = false
      $scope.singleAssignParams = {}
      $scope.isCheckAll = false
      initGoodsList()
    }


    //创建 分页器
    function pageFun() {
      const { totalNum = 0, pageSize, pageNum } = $scope;
      $("#pagination1").jqPaginator({
        totalCounts: totalNum,
        pageSize: pageSize * 1,
        visiblePages: 5,
        currentPage: pageNum * 1,
        activeClass: 'current',
        first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
        prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
        next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
        last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
        page: '<a href="javascript:void(0);">{{page}}<\/a>',
        onPageChange: function (n, type) {
          if (type == 'init') return;
          $scope.pageNum = n;
          getList()
        }
      });
    }

    // 重新 获取商品列表 或 缺货列表 default pageNum --- 1
    function initGoodsList() {// 搜索 pageSize 切换 初高级采购切换  仓库切换
      $scope.pageNum = '1';
      getList();
    }
    $scope.pageGo = function () {//  页码跳转
      const { pageNum, totalNum, pageSize } = $scope;
      var totalpage = Math.ceil(totalNum / (pageSize * 1));
      if (pageNum > totalpage || pageNum < 1) return layer.msg('页码不存在')
      getList();
    }
    //回车 enter 搜索
    $scope.handleEnterSearch = function (ev) {
      ev.keyCode === 13 && getList();
    }

    // ----- >>>  查看 编辑 供应商
    $scope.supplierBoxShow = false;
    $scope.ckFun = function (item) {//显示弹框  -->> 查看供应商
      $scope.supplierBoxShow = true;
      $scope.ckgysPid = item.productId || item.productId;
      console.log($scope.ckgysPid)
      $scope.gysList = JsonPares(item.supplierLink);
      console.log($scope.gysList)
    }
    $scope.addGysFun = function () {//添加供应商 栏
      // {"name":"https://detail.1688.com",
      // "star":5,"$$hashKey":"object:1115"}
      var gysObj = {};
      gysObj.name = '';
      gysObj.star = 5;
      gysObj.flag = true;
      $scope.gysList.push(gysObj)
      console.log($scope.gysList)
    }
    $scope.bianjiGysFun = function () {// 供应商列表 切换为编辑状态
      for (var i = 0, len = $scope.gysList.length; i < len; i++) {
        $scope.gysList[i].flag = true;
      }
    }
    $scope.deletGysFun = function (index) {// 删除供应商 栏
      if ($scope.gysList.length == 1) {
        layer.msg('至少要保留一个供应商')
        return
      }
      $scope.gysList.splice(index, 1)
    }
    $scope.gyspxUpFun = function (index) {//供应商 栏 上移
      console.log(index)
      if (index != 0) {
        var spliceItem = $scope.gysList.splice(index, 1)[0];
        console.log(spliceItem)
        console.log($scope.gysList)
        $scope.gysList.splice(index - 1, 0, spliceItem)
        console.log($scope.gysList)
      } else {
        layer.msg('当前行在最顶端,不能再上移')
      }
    }
    $scope.gyspxDownFun = function (index) {//供应商 栏 下移
      console.log(index)
      if (index + 1 != $scope.gysList.length) {
        var spliceItem = $scope.gysList.splice(index, 1)[0];
        console.log($scope.gysList)
        $scope.gysList.splice(index + 1, 0, spliceItem)
        console.log(spliceItem)
        console.log($scope.gysList)
      } else {
        layer.msg('当前行在最底端,不能再下移')
      }
    }
    $scope.ckGysWcFun = function () {//完成 编辑 发送 http保存 
      var wcBianjiObj = {};
      wcBianjiObj.supplierLinks = [];
      wcBianjiObj.pid = $scope.ckgysPid
      for (var i = 0, len = $scope.gysList.length; i < len; i++) {
        // console.log($scope.gysList[i].name)
        // console.log($scope.gysList[i].star)
        // console.log($scope.gysList[i].name && $scope.gysList[i].star)
        if ($scope.gysList[i].name && $scope.gysList[i].star) {
          wcBianjiObj.supplierLinks.push({
            name: $scope.gysList[i].name,
            star: $scope.gysList[i].star,
            beiZhu: $scope.gysList[i].beiZhu
          })
        } else {
          // layer.msg('请把供应商信息填写完整')
          // return
        }
      }
      if (wcBianjiObj.supplierLinks.length < 1) {
        layer.msg('请设置采购链接')
        return
      }
      erp.load()
      erp.postFun(api.supplierLinkList, JSON.stringify(wcBianjiObj), function ({ data: { code } }) {
        erp.closeLoad()
        if (code !== 200) return layer.msg('修改失败')
        layer.msg('修改成功')
        $scope.supplierBoxShow = false;
        $scope.gysList = '';
        getList(erp, $scope);
      }, function (data) {
        console.log(data)
        erp.closeLoad()
      })
    }
    // $scope.defaultStar = 5;
    $scope.changeSPStar = function (starNum, item) {// 点击 改变星的状态
      item.star = starNum;
    }
    $scope.showYStar = function (ev) {//悬浮 mouseenter 显示 星星
      $(ev.target).addClass('star');
      $(ev.target).prevAll("a").addClass("star").end().nextAll("a").removeClass("star");
    }
    $scope.hideYStar = function (item, ev) {//悬浮 mouseleave 显示 星星
      $(ev.target).parent('.td-star').children('a').removeClass('star')
      for (var i = 0, len = item.star; i < len; i++) {
        $(ev.target).parent('.td-star').children('a').eq(i).addClass('star')
      }
    }
    $scope.ckcloseFun = function () {//关闭弹框  -->> 查看供应商
      $scope.supplierBoxShow = false;
      $scope.flag1 = false;
      $scope.cgList = '';
    }
    // <<< -----  查看 编辑 供应商

    $scope.flag1 = false;
    //全局变量接收是属于 点击的那一个采购单
    $scope.showOnlinePurchase = function (item, pItem, index) {// 显示弹窗 --->> 线上采购 商品（所有变体） or 变体商品（单个） 
      console.log("TCL: $scope.showOnlinePurchase -> item", item)
      handleRecordId(pItem, index, item.variantId)//12-10 点击线上采购 记录商品id
      // console.log('item --------------->>> ', pItem)
      $scope.flag1 = true;
      var arr = [];
      if (arr.length == 0) {
        arr.push(item.id + '')
      }
      $scope.btArr = arr;
      var a = JsonPares(item.supplierLink)
      $scope.btItemObj = item;
      var cgPrice = item.costPrice;//采购价格
      for (var i = 0; i < a.length; i++) {
        // console.log(a[i])
        a[i].price = cgPrice;
        a[i].dingDanZhuangtai = 'zhengChang';
        a[i].orderNeedCount = item.orderNeedCount;
      }
      console.log(a)
      $scope.cgList = a;
      $scope.variantId = item.variantId;
      $scope.itemBtSku = item.sku;
      // $scope.itemStoragename = item.storageName
    }

    //显示弹框  --->> 今日订单 统计 -->> 变体 商品
    $scope.showTodayOrderBox = function (item) {//显示弹框  --->> 今日订单 统计 -->> 变体 商品
      $scope.todayOrderBoxShow = true;
      $scope.ordList = item.orderList;
    }

    $scope.showBtFun = function (item, ev, index) { // 12-03采购修改 出单采购 --- 1 显示商品变体 列表
      variantIdList = [];//变体id数组置为空
      goodsIdArr = [];//存储商品id的数组置为空
      item.checked = false;
      $scope.itemIndex = index;
      item.toggle = !item.toggle

      if (!item.toggle) return $scope.chudanliebiao[index].btList = [];
      $scope.chudanliebiao.forEach((_, i) => {
        if (_.btList && _.btList.length > 0) $scope.chudanliebiao[i].btList = []
      })


      var btUpdata = {};
      btUpdata.pid = item.productId;
      handleRecordId(item)//12-10 点击线上采购 记录商品id
      if (item.storageId) {
        btUpdata.storageId = item.storageId;
      } else {
        btUpdata.storageId = $scope.storageId;
      }
      var btUrl = api.goodsVariantList;
      btUpdata.isQueHuo = !!$scope.isQueHuoFlag;
      console.log("TCL: $scope.showBtFun -> btUpdata", btUpdata)
      layer.load()
      erp.postFun(btUrl, btUpdata, function ({ data }) {
        console.log("TCL: $scope.showBtFun -> data", data)
        const { data: list, code } = data;
        layer.closeAll('loading');
        if (code !== 200) return;
        if ($(ev.target).hasClass('glyphicon-triangle-top')) {
          if (list.length > 0) {
            for (var i = 0; i < list.length; i++) {
              list[i].checked = false;
            }
            $scope.chudanliebiao[index].btList = list.map(item => {
              const { otherGoodsInfoVOs } = item;
              if (otherGoodsInfoVOs && otherGoodsInfoVOs.length > 0) {
                item.calcCount = otherGoodsInfoVOs.reduce((count, { num }) => count + num, 0)
              }
              return item;
            });
            console.log($scope.chudanliebiao[index].btList)
            // $scope.btListArr = $scope.chudanliebiao[index].btList;
            console.log($scope.chudanliebiao)
          }
        } else {
          $scope.chudanliebiao[index].btList = [];
        }
      }, err)

    }


    $scope.btCgLiuYanFun = function (liuYan) {//查看高级采购留言
      $scope.gjcgLiuYan = liuYan;
      $scope.gjcgLiuYanFlag = true;
    }

    // --- >> 确认出单采购 
    var zjwcArr = [];
    $scope.zjWcFun = function (item) {// 显示 确认出单采购 弹框
      $scope.cgwcFlag = true;
      zjwcArr = [];
      zjwcArr.push(item.id + '');
    }
    $scope.qxCgwcFun = function () {// 隐藏 确认出单采购 弹框
      $scope.cgwcFlag = false;
      $scope.cgwcVal = '';
    }
    $scope.sureCgwcFun = function () {//确认采购 完成
      if (!$scope.cgwcVal) {
        layer.msg('请输入原因')
        return
      }
      erp.load()
      var cgwcData = {};
      cgwcData.chuDanCaiGouIds = zjwcArr;
      cgwcData.dingDanHao = $scope.cgwcVal;
      erp.postFun('caigou/procurement/zhiJieWanCheng', JSON.stringify(cgwcData), function (data) {
        console.log(data)
        layer.closeAll('loading')
        if (data.data.statusCode == 200) {
          $scope.cgwcFlag = false;
          layer.msg('成功')
          getList(erp, $scope);
        } else {
          layer.msg('失败')
        }
      }, function (data) {
        console.log(data)
        layer.closeAll('loading')
      })
    }
    // << --- 确认出单采购 
    $scope.dingDanHFlag = true;

    // -->> 查看业务员
    $scope.showSalesmanListBox = function (item) {//显示弹框 -->> 查看业务员
      $scope.salesmanListBoxShow = true;
      $scope.salesmanList = item.empSet;
    }
    $scope.hideSalesmanListBox = function () {//隐藏弹框 -->> 查看业务员
      $scope.salesmanListBoxShow = false;
      $scope.salesmanList = [];
    }
    // << --- 查看业务员

    //选中  -----   checkbox  区域 
    var goodsIdArr = [];//选中的商品id ['productId'] 商品id  
    var variantIdList = [];//选中的商品 变体id ['id'] 变体id
    $scope.checkSubItem = function (item, spitem, btlist) {//选择 变体 checkbox

      var checkedNum = 0;
      if (item.checked) {
        if (goodsIdArr.length < 1) {//第一次点击变体
          goodsIdArr.push(item.productId)
          variantIdList.push(item.id + '')
          for (var i = 0; i < btlist.length; i++) {
            if (btlist[i]['checked'] == true) {
              checkedNum++;
            }
          }
        } else {
          if (goodsIdArr[0] == item.productId) {//是同一个商品的变体
            goodsIdArr.push(item.productId)
            variantIdList.push(item.id + '')
            for (var i = 0; i < btlist.length; i++) {
              if (btlist[i]['checked'] == true) {
                checkedNum++;
              }
            }
          } else {
            item.checked = false;
          }
        }
      } else {
        goodsIdArr.pop()
        for (var i = 0, len = variantIdList.length; i < len; i++) {
          if (item.id == variantIdList[i]) {
            variantIdList.splice(i, 1)
            break
          }
        }
      }
      console.log('variantIdList -->> ', variantIdList)
      console.log('goodsIdArr -->> ', goodsIdArr)
      if (checkedNum == btlist.length) {
        spitem.checked = true;
      } else {
        spitem.checked = false;
      }
    }
    // 选中所有商品
    $scope.checkAll = function (item, checkAllMark, e, list) {
      variantIdList = [];//变体id数组置为空
      goodsIdArr = [];//存储商品id的数组置为空
      console.log(list)
      console.log(item)
      if (!item.btList) {
        layer.msg('请先查询变体');
        item.checked = false;
        return;
      } else {//如果该商品已经查询过变体
        if (item.checked) {
          for (var i = 0; i < list.length; i++) {//所有的商品变体的复选框置为非选中
            list[i].checked = false;
            if (list[i].btList) {
              for (var k = 0; k < list[i].btList.length; k++) {
                list[i].btList[k].checked = false;
              }
            }
          }
          item.checked = true;//本商品置为选中
          for (var i = 0; i < item.btList.length; i++) {//本商品的所有变体置为选中
            item.btList[i].checked = true;
            variantIdList.push(item.btList[i].id + '')
            goodsIdArr.push(item.productId)
          }
          console.log('variantIdList  --->> ', variantIdList)
        } else {
          goodsIdArr = [];//存储商品id的数组置为空
          for (var i = 0; i < item.btList.length; i++) {
            item.btList[i].checked = false;
            variantIdList = [];
          }
          console.log(variantIdList)
        }
        console.log(goodsIdArr)
      }
    }
    //变体的复选框
    //批量采购 重写ing
    $scope.bulkCgFlag = false;//批量操作弹窗
    $scope.showOnlineBox = function () {//显示弹框  -->> 线上批量采购 重写ing
      console.log('----------$scope.chudanliebiao ', $scope.chudanliebiao)
      if (variantIdList.length === 0) return layer.msg('请选择变体');
      $scope.btCheckedArr = [];//   
      $scope.bulkCgFlag = true;// 显示 批量操作弹窗
      var isBreakOutFlag = false;
      for (var i = 0; i < $scope.chudanliebiao.length; i++) {
        console.log($scope.chudanliebiao[i]['btList'])
        if ($scope.chudanliebiao[i]['btList'] && $scope.chudanliebiao[i]['btList'].length > 0) {
          for (var j = 0, btLen = $scope.chudanliebiao[i]['btList'].length; j < btLen; j++) {
            if ($scope.chudanliebiao[i]['btList'][j].checked) {
              isBreakOutFlag = true;
              var cgArr = JsonPares($scope.chudanliebiao[i].supplierLink);
              console.log(cgArr)
              for (var k = 0, gysLen = cgArr.length; k < gysLen; k++) {
                cgArr[k]['dingDanZhuangtai'] = 'zhengChang'
              }
              $scope.cgList = cgArr;
              console.log($scope.cgList)
              break
            }
          }

          for (var k = 0, kLen = $scope.chudanliebiao[i]['btList'].length; k < kLen; k++) {
            if ($scope.chudanliebiao[i]['btList'][k].checked) {
              $scope.btCheckedArr.push(JsonPares(JSON.stringify($scope.chudanliebiao[i]['btList'][k])))
            }
          }

        }
        if (isBreakOutFlag) {
          console.log('跳出外层循环')
          break
        }
      }
      console.log('btCheckedArr --> ', $scope.btCheckedArr)
      console.log('cgList --> ', $scope.cgList)
    }

    $scope.bulkCloseFun = function () {//隐藏弹框  -->> 线上批量采购
      $scope.bulkCgFlag = false;
      variantIdList = [];//变体id数组置为空
      goodsIdArr = [];//存储商品id的数组置为空
    }
    $scope.showFinishPurchaseBox = function () {//显示弹框  -->> 批量采购完成
      if (variantIdList.length === 0) return layer.msg('请选择变体')
      $scope.finishPurchaseBoxShow = true;
    }
    $scope.submitFinishPurchase = function () {//确认批量完成  -->> http
      erp.load()
      const params = { chuDanCaiGouIds: variantIdList, dingDanHao: '' }
      erp.mypost(api.finishPurchase, params).then(() => {
        $scope.finishPurchaseBoxShow = false;
        layer.msg('成功')
        getList(erp, $scope);
        variantIdList = [];//变体id数组置为空
        goodsIdArr = [];//存储商品id的数组置为空
      }).catch(() => {
        layer.msg('失败')
        $scope.finishPurchaseBoxShow = false;
      })
    }


    //批量缺货
    $scope.bulQueHuoFun = function () {//显示弹框 -->> 批量缺货
      if (variantIdList.length < 1) {
        layer.msg('请选择变体')
        return;
      } else {
        $scope.bulkQueHuoFlag = true;
        var cgArr = [];
        for (var i = 0; i < $scope.chudanliebiao.length; i++) {
          cgArr = [];
          if ($scope.chudanliebiao[i]['btList'] && $scope.chudanliebiao[i]['btList'].length > 0) {
            for (var j = 0, btLen = $scope.chudanliebiao[i]['btList'].length; j < btLen; j++) {
              if ($scope.chudanliebiao[i]['btList'][j].checked) {
                console.log($scope.chudanliebiao[i]['btList'][j])
                cgArr.push($scope.chudanliebiao[i]['btList'][j])
                console.log(cgArr)
                $scope.xxcgList = cgArr;
                console.log($scope.xxcgList)
              }
            }
          }
        }
      }
    }
    // 确定批量缺货
    $scope.bulksureQueHuoFun = function () {//批量缺货 确认 发送http
      var queHuoIds = [];
      console.log($scope.xxcgList)
      for (var i = 0, len = $scope.xxcgList.length; i < len; i++) {
        console.log($scope.xxcgList[i].id)
        queHuoIds.push($scope.xxcgList[i].id)
      }
      erp.load();
      console.log(queHuoIds)
      erp.postFun('caigou/procurement/biaoJiQueHuo', {
        "chuDanCaiGouIds": queHuoIds
      }, function (data) {
        console.log(data)
        layer.closeAll('loading')
        if (data.data.statusCode == 200) {
          $scope.bulkQueHuoFlag = false;
          $scope.pageNum = '1';
          getList(erp, $scope);
        } else {
          layer.msg('失败')
        }
      }, function (data) {
        console.log(data)
        layer.closeAll('loading')
      })

    }

    // 滚动悬浮table head
    $(window).scroll(function () {
      var before = $(window).scrollTop();
      if (before > 60) {
        $('.tit-box').css({
          "position": "fixed",
          "top": 0
        })
      } else if (before < 10) {
        $('.tit-box').css({
          "position": "static",
          "top": 0
        })
      }
    });

    $scope.handleOssImg = handleOssImg;


    /** 2020-3-23  */
    // 查看可用仓库

    initOtherStorageModule();

    function initOtherStorageModule() {
      $scope.showOtherStorageBox = showOtherStorageBox;
      $scope.hideOtherStorageBox = initOtherStorageInfo;
      initOtherStorageInfo()
      function showOtherStorageBox({ otherGoodsInfoVOs }) {
        if (otherGoodsInfoVOs && otherGoodsInfoVOs.length > 0) {
          console.log("showOtherStorageBox -> otherGoodsInfoVOs", otherGoodsInfoVOs)
          $scope.otherStorageInfo = { show: true, list: otherGoodsInfoVOs }
          // $scope.otherStorageBox = true;
          // $scope.otherStorageList = otherGoodsInfoVOs
        }
      }
      function initOtherStorageInfo() {
        $scope.otherStorageInfo = { show: false, list: [] }
        // $scope.otherStorageBox = false;
        // $scope.otherStorageList = [];
      }
    }

    // 采购报表	
    initReportModule()
    function initReportModule() {
      $scope.showReportBox = checkReport;
      $scope.hideReportBox = initReportInfo;
      initReportInfo()
      function initReportInfo() {
        $scope.reportList = []
        $scope.reportAverageInfo = {}
        $scope.reportBoxShow = false;
        $scope.reportSku = '';
        $scope.reportPageInfo = {
          pageNum: '1',
          pageSize: '10',
          totalNum: 0
        }
        $scope.reporPparams = {}
      }

      function checkReport(item) {
        const { productId: pid, variantId: vid, sku } = item;
        $scope.reportBoxShow = true;
        $scope.reportSku = sku;
        $scope.reporPparams = { pid, vid };
        httpReport()
        httpReportAverage()
      }

    }

    function httpReport() {
      const url = api.report;
      const { pid, vid } = $scope.reporPparams;
      const { pageNum, pageSize } = $scope.reportPageInfo;
      const params = { data: { pid, vid }, pageSize, pageNum } //post {data: {pid: '商品id', vid: '变体id'}, pageSize: '', pageNum: ''}
      erp.mypost(url, params).then(res => {
        console.log("httpReport -> res", res)
        const { list, total } = res;
        if (list && list.constructor === Array && list.length > 0) {
          $scope.reportList = list;
          $scope.reportPageInfo.totalNum = total;
          initPage()
        }
      })
    }
    function httpReportAverage() {
      const url = api.reportAverage;
      const { pid, vid } = $scope.reporPparams;
      // const { pageNum, pageSize }  = $scope.reportPageInfo;
      const params = { pid, vid }//post {data: {pid: '商品id', vid: '变体id'}, pageSize: '', pageNum: ''}
      erp.mypost(url, params).then(res => {
        console.log("httpReportAverage -> res", res)
        const { procurememtOrder, orderTime, quantity, procurementCycle, factoryDeliveryCycle, expressDeliveryCycle, defectivePercentage } = res;
        // {procurememtOrder: '订单号', orderTime: '下单时间', quantity: '下单数量', procurementCycle: 	'采购完成周期', factoryDeliveryCycle: '厂家发货周期', expressDeliveryCycle: '快递运输周期', defectivePercentage: '次品率'}
        $scope.reportAverageInfo = { procurememtOrder, orderTime, quantity, procurementCycle, factoryDeliveryCycle, expressDeliveryCycle, defectivePercentage }
      })
    }

    /* page 区域 start */
    function initPage() {
      const { totalNum = 0, pageSize, pageNum } = $scope.reportPageInfo;

      const pages = Math.ceil(totalNum / pageSize);
      $scope.$broadcast('page-data', {
        pageSize: pageSize,//每页条数
        pageNum: pageNum,//页码
        totalNum: pages,//总页数
        totalCounts: totalNum,//数据总条数
        pageList: ['10', '20']//条数选择列表，例：['10','50','100']
      })
    }
    initPageChange()
    function initPageChange() {
      $scope.$on('pagedata-fa', function (_, { pageNum, pageSize }) {// 分页onchange
        $scope.reportPageInfo.pageNum = pageNum;
        $scope.reportPageInfo.pageSize = pageSize;
        httpReport()
      })
    }
    /* page 区域 end */

  }])

  function JsonPares(val) {//基于 全局 JSON parse重写 基础上 
    const newVal = JSON.parse(val);
    if (val === null) return val;
    if (typeof newVal !== 'object') return val;
    if (newVal.error) return val;
    return newVal;
  }
  function navTo(url, type) {
    type = type || '_self';
    if (!url) return;
    let a = document.createElement('a')
    a.href = url;
    a.setAttribute('target', type)
    a.click()
    a = null;
  }
  function navBack(erp, query) {
    let url = '/manage.html#/erppurchase/purchase_order';
    query && (url = erp.setQueryToUrl(url, query))
    navTo(url)
  }
  function handleOssImg(url) {//处理 阿里云地址 尺寸 问题 
    if (!url) return '';
    return url.includes('aliyuncs.com') ? `${url}?x-oss-process=image/resize,w_40,h_40` : url;
  }

})()