~function(){
var app = angular.module('receiving', ['service']);
app.controller('receivingCtrl', ['$scope', 'erp', '$timeout', function ($scope, erp, $timeout) {
  const warehouseList = [
    {label: '代发仓', value: '1'},
    {label: '直发仓', value: '2'},
    {label: '定制仓', value: '3'},
    {label: '半成品仓', value: '4'},
    {label: '次品仓', value: '5'}
  ]
  
  $scope.storeTypeList = [
      {name:'全部',val:''},
      {name:'代发区',val:'1'},
      {name:'直发区',val:'2'}
  ]
  $scope.purchaseList = [
      { name: '全部', val: '' },
      { name: '1688非API', val: '0' },
      { name: '1688API', val: '1' },
      { name: '淘宝', val: '2' },
      { name: '天猫', val: '3' },
      { name: '线下', val: '4' }
  ]
  $scope.storeList = erp.getWarehouseType();
  $scope.filterObj = {
      store:'',
      procurementType:''
  }
  const api = {
    ListUrl_old: 'caigou/procurementProduct/getQualityList',//post {id: ''}
    ListUrl: 'procurement/dealWith/getQualityList',//post: {ids: ''}
    confirmUrl_old: 'caigou/procurementProduct/splitMark',//质检 {post receiveNun: '到货数量',qualifiedNum: '合格数量', defectiveNum: '次品数量', lackNum: '缺少数量', moreNum: '多出数量',  realNum: '正品数量', realWeight: '实际重量', productL: '长', productW: '宽', productH: '高', id: '', sku: '', type: '1 - 分标 2 - 质检'}
    confirmUrl: 'warehousereceipt/caigouShangpintiansku/update',// ++ trackingNumber  procurementOrderId
    // batchList: 'caigou/procurementProduct/getQualityList',//获取 分配列表  {post batchNum: '1577777414142289'} 弃用
    batchDistrbute: 'procurement/dealWith/batchNumBelong',//提交 分配{post id: '', batchnumBelong: '用户id'}
    batchDistrbute_old: 'caigou/procurementProduct/batchNumBelong',//提交 分配{post id: '', batchnumBelong: '用户id'}
    err_old: 'caigou/procurement/yiChang',//{post id: 'caiGouShangPinid', leiXing: '异常原因', shuLiang: '', yuanYin: '原因文本'}
    err: 'procurement/dealWith/yiChang',//{post id: 'caiGouShangPinid', leiXing: '异常原因', shuLiang: '', yuanYin: '原因文本'}
    nameList: 'procurement/dealWith/getErpEmployeeList',// {post }
    printUrl: 'caigou/procurementProduct/printingBarCode',//打印 {post {cjSku, cjShortSku, id, type: 6, qualifiedNum, moreNum, defectiveNum} }  原字段修改 realNum --> qualifiedNum
    markUrl: 'warehousereceipt/batchGoodsCode/saveBatchGoodsOptInfo',// [{ batchGoodsCode:99, orderId:5, optType:1, stanId:0, shortCode:99, sku:99, regionPath:15, quantity:250 }]
  }
  // 自动称重-扫描批次号获取列表后开始, 检验操作确认后结束
  $scope.autoWeighting = {
    timer: null,
    weight: 0,
    startTime: new Date(),
    start: function() {
      var self = this;
      this.timer = setInterval(function() {
        /* new Promise((resolve, reject) => {
          setTimeout(function() {
            resolve([
              {kg: 200},
              {g: 215},
              {l: 200}
            ])
          }, 50)
        }).then(res => {
          // 重量--克
          self.weight = 100;
          self.handle(self.weight)
          // 1.5秒后停止检测重量
          if (self.weight <= 0) {
            self.startTime = new Date()
            return;
          }
          if(self.weight > 0 && new Date() - self.startTime > 2000) {
            console.log('time', self.startTime, new Date());
            // 还没开始称重，重置开始时间
            self.end();
          }
        }) */
        $.get('http://localhost:3000/').then(res => {
          var data = JSON.parse(res);
          // 重量--克
          self.weight = parseInt(data[1].g);
          // 1.5秒后停止检测重量
          if (self.weight <= 0) {
            self.startTime = new Date()
            return;
          }
          if(self.weight > 0 && new Date() - self.startTime > 2000) {
            console.log('time', self.startTime, new Date());
            // 还没开始称重，重置开始时间
            self.end();
            self.handle(self.weight)
            return;
          }
          self.handle(self.weight);
          return;
        },err=>{
            console.error('[自动称重]：电子秤连接失败');
            self.end()
        })
      }, 300)
    },
    end: function() {
      clearInterval(this.timer)
      console.log('clearTime');
    },
    handle: function(weight) {
      // 写重量
      if (!weight) return
      $('#weightInput').val(weight)
      // 主动触发change同步ng-model更新
      $("#weightInput")[0].dispatchEvent(new Event("input", { bubbles: true }))
      const { realWeight: newweight, packWeight: oldweight, cjProductId: productid, cjStanproductId: variantid } = item;
      if (newweight === oldweight) return;
      $scope.recordWeightParams = { newweight, oldweight, productid, variantid, show: false }
      if((+newweight-(+oldweight))>10 ||(+newweight-(+oldweight))<20) {
        $scope.recordWeightParams.show = true
      }
    }
  };
  
  init();

  function init() {
    initTabModule();//初始化 tab 模块
    handleTabSwitchInit();//tab 切换 初始化对应的 函数
    initErrorBoxModule();// 异常操作模块
    initClipboard();//初始化 剪切板功能
  }

  function initTabModule() {//初始化 tab 模块, { title: '批次分配', checked: false }
    $scope.tabList = [{ title: '质检', checked: true }];
    $scope.switchTab = switchTab;//切换 tab
    $scope.currentIndex = 0;//获取当前 tab 索引
    function switchTab(tab, index) {//切换 tab
      if ($scope.currentIndex === index) return;
      $scope.tabList.forEach((tab, i) => tab.checked = index === i)
      $scope.currentIndex = index;
      handleTabSwitchInit(index)
    }
    function getCurrentIndex() {
      return $scope.tabList.findIndex(({ checked }) => checked);//-1 is not found
    }
  }

  function handleTabSwitchInit(index = 0) {//tab 切换 初始化对应的 函数
    const id = index === 0 ? 'waybillNumber' : 'batchNumber';
    setTimeout(() => {document.getElementById(id).focus()})
    index === 0 && qualityInspectInit();
    index === 1 && distributeInit();
  }

  function qualityInspectInit() {//质检初始化
    initInspectTableModule()
  }

  function distributeInit() {//批次分配初始化
    initTableModule()//初始化 批次分配 table 列表 模块
    initOptionModule()//初始化 批次分配操作面板 
  }


  /* 质检初始化 区域 start */
  function initInspectTableModule() {
    $scope.inspectTableList = [];
    $scope.warehouseList = warehouseList;//模板仓库 列表
    $scope.params = {
      warehouse: '1',
      waybillNumber: '',
      packageStatus: '',
      orderStatus: '',
      productAttribute: '',
    }
    $scope.productAttributes = [
      { label: '普货', value: '普货' },
      { label: '液体', value: '液体' },
      { label: '电池', value: '电池' },
      { label: '尖锐', value: '尖锐' },
      { label: '膏体', value: '膏体' },
      { label: '粉末', value: '粉末' },
      { label: '其他', value: '其他' }
    ]
    $scope.handleSearch = handleSearch;//搜索 或 扫描 列表
    $scope.handleConfirm = handleConfirm;//确认
    $scope.handlePrint = handlePrint; //打印
    $scope.handleUpload = handleUpload;
    $scope.handleInputReceivedNum = handleInputReceivedNum;//computed depend 到货数量
    $scope.handleInputQualifiedNum = handleInputQualifiedNum;//computed depend 合格数量
    $scope.sliceShortSku = sliceShortSku;
  }

  function handleInputReceivedNum(item) {//computed depend 到货数量
    let {shuLiang, receiveNun} = item;
    shuLiang = +shuLiang || 0;
    receiveNun = +receiveNun || 0;
    const dis = shuLiang - receiveNun;
    item.moreNum = dis > 0 ? 0 : -dis;
    item.lackNum = dis > 0 ? dis : 0;
    handleInputQualifiedNum(item)
  }

  function handleInputQualifiedNum(item) {//computed depend 合格数量
    let { receiveNun, qualifiedNum } = item;
    receiveNun = +receiveNun || 0;
    qualifiedNum = +qualifiedNum || 0;
    const dis = receiveNun - qualifiedNum;
    item.defectiveNum = dis > 0 ? dis : 0;
  }

  function getList() {//获取质检列表 
    const val = $scope.params.waybillNumber;
    console.log("TCL: getList -> val", val)
    const id = sliceBatchNumber(val);
    if (!id) return layer.msg('请输入/扫描运单号');
    const url = api.ListUrl;
    let param = {
        ids: id,
        store:$scope.filterObj.store,
        procurementType:$scope.filterObj.procurementType
    }
    erp.mypost(url, param).then(list => {
      $scope.inspectTableList = list.map(item => {
        let {qualifiedNum, receiveNun, shuLiang} = item;
        qualifiedNum == 0 && (item.qualifiedNum = +shuLiang);
        receiveNun == 0 && (item.receiveNun = +shuLiang);
        return item;
      });
      console.log("TCL: getList -> $scope.inspectTableList", $scope.inspectTableList)
      // 获取质检列表成功且有数据，监听称重
      if(list && list.length > 0) {
        $scope.autoWeighting.start()
      }
    })
  }

  function handleConfirm(item,index) {//确认
    //已质检不能确认操作
    if(item.status==3) return false;
    if(!item.unnormal && item.defectiveNum>0) {
      $scope.errBoxShow=true;
      $scope.editIndex=index;
      $scope.errParams.id=item.id;
      $scope.errParams.shuLiang=item.defectiveNum;
      return;
    }
    const pass = validate(item);
    if (pass !== 'ok') return layer.msg(pass);
    const url = api.confirmUrl;
    const {receiveNun, qualifiedNum, defectiveNum, lackNum, moreNum, realWeight, productL, productW, productH, id, cjSku, shuLiang: shuLiang, cjShortSku: cjShortSku, cjStanproductId: cjStanproductId, zhuiZongHao, orderId: procurementOrderId, cjProductId: ID} = item;
    const type = '2';//type: '1 - 分标 2 - 质检'
    const trackingNumber = Object.keys(JsonPares(zhuiZongHao)).join(',');//zhuiZongHao "{123123: '中通'}"
    const params = {
      receiveNun, qualifiedNum, defectiveNum, lackNum, moreNum, realWeight, productL, productW, productH, id, cjSku, shuLiang, cjShortSku, cjStanproductId, trackingNumber, type, procurementOrderId, ID,
      zhiJianbatchNum:$scope.params.waybillNumber
    }
    console.log("TCL: handleConfirm -> params", params)

    layer.load()
    erp.postFun(url, params, function({data}) {
      layer.closeAll()
      if (data.code !== 200) return;
      layer.msg('确认成功')
      iptWayBillNum.focus()
      iptWayBillNum.select()
      $scope.inspectTableList[index].status=3;
      // getList()
    })
  }

  function validate(item) {
    let {receiveNun, qualifiedNum, shuLiang,realWeight} = item;
    receiveNun = +receiveNun;
    qualifiedNum = +qualifiedNum;
    shuLiang = +shuLiang;
    if (receiveNun != 0 && !receiveNun) return '请填写 到货数量';
    if (qualifiedNum != 0 && !qualifiedNum) return '请填写 合格数量';
    if (isNaN(receiveNun) || isNaN(qualifiedNum) ) return '异常数量填写需为 数字';
    if(!realWeight) return '请填写实际重量';
    return 'ok';
  }

  function sliceShortSku(shortSku) {
    let str = shortSku || '';
    try {
      str = shortSku.split('-').slice(1).join('-');
    } catch (err) {
      console.log('sliceShortSku err', err)
    }
    return str; 
  }

  function sliceBatchNumber(str) {//切割批次号 与后端 约定 -->> 条形码 短码+批次号  后七位 为批次号
    if (!str) return '';
    try {
      str = (str + '').split('').reverse().slice(0,7).reverse().join('');
    } catch (err) {
      console.log('sliceBatchNumber err', err)
    }
    return str;
  }
  /* 质检初始化 区域 end */


  /* 批次分配初始化 区域 start */
  function initTableModule() {//初始化 table 模块
    $scope.tableList = [];
    $scope.recordName = [];//操作人
    $scope.allCheckedStatus = allCheckedStatus;//获取 全选 button 状态
    $scope.toggleAllCheckBtn = toggleAllCheckBtn;//全选操作
    $scope.toggleCheckBtn = toggleCheckBtn;//单选操作

    $scope.batchNumber = '';//批次号
    $scope.handleSearch = handleSearch;//搜索 或 扫描 列表
    
    function allCheckedStatus() {//获取 全选 button 状态
      return $scope.tableList.every(({ checked }) => checked);
    }
    
    function toggleAllCheckBtn() {//全选操作
      const isChecked = allCheckedStatus();
      $scope.tableList.forEach(item => item.checked = !isChecked);
    }

    function toggleCheckBtn(item) {//单选操作
      item.checked = !item.checked;
    }
  }

  function initOptionModule() {//初始化 批次分配操作面板 
    $scope.showDistributeBox = showDistributeBox;//显示 分配弹窗
    $scope.hadnleDistribute = hadnleDistribute;
    initMultipleSelectModule()//初始化 操作人员 模块
  }

  function initMultipleSelectModule() {//初始化 操作人员 模块
    getNameList()
    $scope.nameList = [];
    $scope.selectedNames = [];
    $scope.recordName = [];
    $scope.selectListShow = false;
    $scope.toggleMutipleSelect = toggleMutipleSelect;
    $scope.hideMutipleSelect = hideMutipleSelect;
    $scope.selectName = selectName;
    $scope.getSelectedText = getSelectedText;
    $scope.distributeBox = false;
    $scope.getCount = getCount;

    function toggleMutipleSelect(ev) {
      ev.stopPropagation();
      $scope.selectListShow = !$scope.selectListShow;
    }

    function hideMutipleSelect() {
      $scope.selectListShow = false;
    }

    function selectName(ev, name) {
      ev.stopPropagation();
      name.checked = !name.checked;
    }

    function getSelectedText() {
      const len = getSelectedNames().length;
      return len > 0 ? `已选择${len}人` : '请选择负责人员';
    };
  }

  function getNameList() {//获取操作人员 列表
    const url = api.nameList;
    erp.mypost(url, {}).then(res => {
      $scope.nameList = res.map(({id: value, loginName: label}) => ({value, label, checked: false, workload: 0}))
    })
  }
 /* 批次分配初始化 区域 end */


  /* 异常处理 模块 区域 start */
  function initErrorBoxModule() {// 异常处理 模块
    $scope.errBoxShow = false;
    $scope.errOptions = [
      // {label: '未发货', value: '1'},
      // {label: '未收到', value: '2'},
      {label: '质量问题', value: '3'},
      {label: '数量问题', value: '4'},
      {label: '颜色问题', value: '5'},
      {label: '尺寸问题', value: '6'},
      {label: '其它', value: '7'},
    ]
    $scope.errParams = {
      id: '',
      leiXing: '3',
      shuLiang: 0,
      yuanYin: ''
    }
    
    $scope.showErrorBox = function(item,index) {//show and init box内容
      if(item.status==3) return false;
      let { id, defectiveNum: shuLiang } = item;
      shuLiang = +shuLiang || 0
      if (shuLiang === 0) return layer.msg('次品数为 0 无法进行异常操作')
      $scope.errBoxShow = true;
      $scope.editIndex=index;
      $scope.errParams = { id, leiXing: '3', shuLiang, yuanYin: '' }
    }
    $scope.submitError = submitError;// submit http err
  }

  function submitError() {//提交 异常 
    const url = api.err;
    const params = $scope.errParams;
    erp.mypost(url, params).then(res => {
      $scope.errBoxShow = false;
      $scope.inspectTableList[$scope.editIndex].unnormal='有异常信息';
      layer.msg('异常提交成功')
    })
  }
  /* 异常处理 模块 区域 end */


  /* 复制功能初始化 start */
  function initClipboard() {//初始化 剪切板功能
    window.onload = function () {
      const clipboard = new window.cjUtils.Clipboard();
      $scope.handleCopy = handleCopy;
      function handleCopy(content) {
        clipboard.set(content).then(() => {
          layer.msg('复制成功')
        }).catch(err => { console.log('handleCopy failed err -->> ', err) })
      }
    }
  }
  /* 复制功能初始化 end */

  $scope.iptWayBillNum = document.getElementById('iptWayBillNum')
  $scope.iptWayBillNumSecond = document.getElementById('iptWayBillNumSecond')
  document.getElementById('iptWayBillNum').focus();
  /* 搜索 enter / 扫描 搜索列表 功能初始化 区域 start */
  function handleSearch(ev) {//搜索 列表  扫描运单号获取 列表
    if (ev.keyCode !== 13) return;
    ev.target.blur()//主动失去焦点
    document.getElementById('iptWayBillNum').select();
    const index = $scope.currentIndex;
    index === 0 && getList();
    index === 1 && getBatchList();
  }
  $scope.filterGetData = ()=>{
    const index = $scope.currentIndex;
    index === 0 && getList();
    index === 1 && getBatchList();
  }
  function getBatchList() {// 获取批次列表
    const url = api.ListUrl;
    const val = $scope.batchNumber;// 1577859184691814
    const ids = sliceBatchNumber(val)
    if (!ids) return layer.msg('请输入/扫描批次号');
    erp.mypost(url, { ids }).then(res => {
      if (res && res.length > 0) {
        $scope.tableList = res || [];
        let recordName = res[0].batchnumBelong;
        recordName = recordName ? JSON.parse(recordName) : [];
        $scope.recordName = recordName;
        setRecordName(recordName)//更新  分配工作量
        console.log("TCL: getBatchList -> res", res, recordName)
      }
    })

    function setRecordName(recordName) {//更新  分配工作量
      let nameList = $scope.nameList;
      $scope.nameList.map(item => Object.assign(item, {checked: false, workload: 0}))// 出事话清空
      $scope.nameList = $scope.nameList.map(item => {
        recordName.find(record => {
          if (record.value !== item.value) return;
          item.workload = record.workload;
          item.checked = true;
        });
        return item;
      })
    }
  }
  /* 搜索 enter / 扫描 搜索列表 功能初始化 区域 start */
  

  /* 分配功能 模块 区域 start */
  function showDistributeBox() {// 确认分配
    if ($scope.tableList.length === 0) return;
    const selectedNames = getSelectedNames();
    console.log("TCL: showDistributeBox -> selectedNames", selectedNames)
    if (selectedNames.length === 0) return layer.msg('请选择人员进行分配')
    $scope.nameList.forEach(item => {!item.checked && (item.workload = 0)})//每次 未被选择的人员 数量 重新归零
    $scope.distributeBox = true;
  }

  function hadnleDistribute() {//分配
    if ($scope.tableList.length === 0) return;
    const selectedNames = getSelectedNames();
    const total = selectedNames.reduce((prev, next) => {
      const count = +next.workload || 0;
      return prev + count;
    }, 0)
    if (total > getCount()) return layer.msg('分配的数量不允许超出 商品数量');
    const id = $scope.tableList[0].id;
    const url = api.batchDistrbute;
    erp.mypost(url, {id, batchnumBelong: JSON.stringify(selectedNames)}).then(res => {//{post id: '', batchnumBelong: '用户id'}
      console.log("TCL: hadnleDistribute -> res", res)
      $scope.distributeBox = false;
      getBatchList()
    })
  }

  function getSelectedNames() {//获取 已选择的 分配人员
    const selectedNames =  $scope.nameList.filter(({ checked }) => checked);
    return $scope.selectedNames = selectedNames;
  }

  function getCount() {//获取总商品数量 
    return $scope.tableList.reduce((prev, next) => {
      const count = +next.shuLiang || 0;
      return prev + count;
    }, 0)
  }
  /* 分配功能 模块 区域 end */

  
  /* 打印区域 start */
  function handlePrint(item, type) {// 打印 // 1正品，2分标次品，3多货，4质检次品，5质检多货 ,6分标全部，7质检全部
    const { cjSku, cjShortSku, id, qualifiedNum, defectiveNum, moreNum } = item;
    if (isNaN(qualifiedNum) || isNaN(moreNum) || isNaN(defectiveNum)) return layer.msg('请检查 填写数量');
    const params = {cjSku, cjShortSku, id, type, qualifiedNum, defectiveNum, moreNum }//打印 {post {cjSku, cjShortSku, id, type: 6, qualifiedNum, moreNum, defectiveNum} }  原字段修改 realNum --> qualifiedNum
    print(params, item);
  }

  function print(params, item) {
    const url = api.printUrl;
    erp.mypost(url, params).then(url => {
      console.log("TCL: print -> url", url)
      handlePrintLink(url);
      handleMark(item);// 
    })
  }

  function handlePrintLink(link) {//{ post skuMap {shortSku: {sku: '', sum: '数量'}} }
    if (!link) return;
    link = link.includes('http') ? link : `https://${link}`;
    erp.navTo(link, '_blank');// 跳转页面 打印
  }
  /* 打印区域 end */


  /* img 上传 区域 start */
  function handleUpload(item) {
    erp.upload().then(url => {
      saveUploadImg(item, url)
    })
  }

  function saveUploadImg(item, proof) {// {post id: '', proof: 'imgUrl'} 
    const id = item.id;
    const url = api.uploadUrl;
    erp.mypost(url, {id, proof}).then(res => {
      item.proof = proof;
    }).catch(err => {
      layer.msg('图片保存失败')
    })
  }
  /* img 上传 区域 end */


  /* 扫码 日志记录 start */
  function handleMark(item) {
    const url = api.markUrl;
    const optType = '1'; //操作类型（1质检，2入库，3出库，4验单）
    const {batchNum: batchGoodsCode, orderId: orderId, cjStanproductId: stanId, cjShortSku: shortCode, cjSku: sku} = item;
    const params = [{batchGoodsCode, orderId, optType, stanId, shortCode, sku}];//[{post batchGoodsCode: '批次号', orderId: '', optType: '', stanId: '变体id', shortCode: '短码', sku: '', regionPath: '库位-不传', quantity: '数量-不传'}]
    erp.mypost(url, params).then(res => {
      console.log("TCL: handleMark -> res", res)
    })
  }
  /* 扫码 日志记录 end */

  function JsonPares(val) {//基于 全局 JSON parse重写 基础上 
    const newVal = JSON.parse(val);
    if (val === null) return val;
    if (typeof newVal !== 'object') return val;
    if (newVal.error) return val;
    return newVal;
  }
  /* 重量处理 1000655 start */
  function handlePackageWeight(item) {// 处理 邮寄重量、 包裹重量
    const { realWeight, packWeight, cjProductId: productId, cjStanproductId: variantId } = item;
    $scope.packageWeightParams = { realWeight, newWeight: packWeight, oldWeight: packWeight, productId, variantId, show: true }
  }
  $scope.handleActualWeight= (item)=> {// 处理 实际重量
    const { realWeight: newweight, packWeight: oldweight, cjProductId: productid, cjStanproductId: variantid, packWeight } = item;
    if (newweight === oldweight) return;
    $scope.recordWeightParams = { newweight, oldweight, productid, variantid, show: false }
    console.log(newweight,oldweight)
    if((+newweight-(+oldweight))>10 ||(+oldweight-(+newweight))>50) {
      $scope.recordWeightParams.show = true
      // 弹窗出来后，暂停重量更新。后续操作：取消-继续监听重量，确定-不操作
      $scope.autoWeighting.end()
    }
  }
  $scope.submitRecordWeight=()=> {// http 提交 实际重量 修改记录
    const params = $scope.recordWeightParams;
    $scope.recordWeightParams.show = false;
    erp.mypost('caigou/procurementProduct/addWeightRecord', params).then(() => {
    })
  }
  $scope.submitPackageWeight=() =>{// http 修改 邮寄重量
    const params = $scope.packageWeightParams;
    if (params.realWeight > params.newWeight) return layer.msg('邮寄重量不得小于 实际重量')
    const url = api.packageWeight;
    $scope.submitRecordWeight();
    $scope.packageWeightParams.show = false;
    erp.mypost('pojo/procurement/changePackWeight', params).then(() => {
        // layer.msg('')
    })
  }
  $scope.cancelRecordWeight=function(){// 取消 实际重量 修改记录 弹窗，继续称重
    $scope.recordWeightParams.show=false
    // 取消后，继续称重，防止误操作
    //$scope.autoWeighting.start()
  }
  /* 重量处理 end */
}]).filter('storeFilter', function () {
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
}()