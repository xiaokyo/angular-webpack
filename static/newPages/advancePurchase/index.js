(function () {
  var app = angular.module('advancePurchase', []);

  var APIS = {
    getPurchaseList:'caigou/prior/queryProductListPage',// 采购通用列表
    getPurchaseListNew:'caigou/prior/queryShopListPage',// 采购列表
    updatePurchaseStatus:'caigou/prior/updateProcurementPass',// 更新预采购审核状态

    querySkuFromStan:'procurement/order/querySkuFromStan',// sku精准查询
    saveProcurementPrior:'procurement/order/saveProcurementPrior',

    updateWarningStatus:'caigou/prior/updateWarningStatus',// 更新采购预警状态

    // 预采购周期
    queryPeriodList:'caigou/prior/queryPeriodList',// 周期列表
    addPeriod:'caigou/prior/savePeriod',// 修改周期
    updatePeriod:'caigou/prior/updatePeriod',// 修改周期
    delPeriod:'caigou/prior/deletePeriod',// 删除周期

    getStorageList:'storehouse/WarehousInfo/getStorehouse',// 获取仓库列表
  }

  var initParams = {
    pageNo:'1',
    pageSize:'10',
    sku:'',// sku
    storage:'',// 仓库
    returned:'',// 是否可以退货 0 是 1 否
    procurementPrice:'',// 采购价格
    procurementCount:'',// 预采购数
    procurementPeriodLow:'',// 采购周期最低值
    procurementPeriodHigh:'',// 采购周期最高值
    arrivalPeriodLow:'',// 到货周期最低值
    arrivalPeriodHigh:'',// 到货周期最高值
    procurementStatus:'',// 采购状态 0-待审核 1-已审核 2-拒绝
    nogoodsStatus:'',// 断货状态 0-是 1-否
  }

  var warehouseobj = {// 仓库列表
    '0':'义乌仓',
    '1':'深圳仓',
    // '2':'美东仓',
    // '3':'美西仓',
    // '4':'泰国仓',
    // '5':'印尼仓',
  }

  var statusobj = {// 数据状态
    '0':'待审核',
    '1':'已审核',
    '2':'已拒绝'
  }

  var getPurchaseList = function(erp,params,Callback){// 采购通用列表
    layer.load(2)
    if(!!params.returned) params.returned = Number(params.returned)
    if(!!params.warningStatus) params.warningStatus = Number(params.warningStatus)
    if(!!params.storage) params.storage = Number(params.storage)
    if(!!params.procurementStatus) params.procurementStatus = Number(params.procurementStatus)
    
    erp.postFun(APIS.getPurchaseList,JSON.stringify(params),function(data){
      layer.closeAll('loading')
      if(data.data.statusCode != '200') return false
      Callback(data.data.result)
    })
  }

  var advancePurchaseList = function($scope,erp,$routeParams){// 预采购列表
    console.log('预采购列表')
    
    $scope.warehouseobj = warehouseobj
    $scope.sendParams = erp.deepClone(initParams)
    $scope.sendParams.sku = !!$routeParams.sku?$routeParams.sku:''
    $scope.list = []// 预采购列表
    function getList(){
      var params = erp.deepClone($scope.sendParams)
      // params.procurementPrice = numRegReturn(params.procurementPrice)
      if(!!params.procurementPrice && !moneyRegReturn(params.procurementPrice)) return layer.msg('请输入正确的价格')
      params.procurementCount = numRegReturn(params.procurementCount)
      params.procurementPeriodLow = numRegReturn(params.procurementPeriodLow)
      params.procurementPeriodHigh = numRegReturn(params.procurementPeriodHigh)
      params.arrivalPeriodLow = numRegReturn(params.arrivalPeriodLow)
      params.arrivalPeriodHigh = numRegReturn(params.arrivalPeriodHigh)
      layer.load(2)
      erp.postFun(APIS.getPurchaseListNew,JSON.stringify(params),function(data){
        layer.closeAll('loading')
        if(data.data.statusCode!='200') return false
        var res = data.data.result
        $scope.list = res.list
        $scope.$broadcast('page-data',{
          pageSize: $scope.sendParams.pageSize,//每页条数
          pageNum: $scope.sendParams.pageNo,//页码
          totalNum: Math.ceil(Number(res.totalCount) / Number($scope.sendParams.pageSize)),//总页数
          totalCounts: res.totalCount,//数据总条数
          pageList:['10','20','50'],//条数选择列表，例：['10','50','100']
          showGo:false
        })
      })
    }
    getList()
    var debounceGetList = erp.deBounce(getList,500)// 防抖配置
    $scope.$watch('sendParams',function(a,b){// 深度监听sendParams变化
      if(a===b) return false
      if(a.pageNo===b.pageNo) $scope.sendParams.pageNo = '1'
      debounceGetList()
    },true)

    $scope.$on('pagedata-fa', function (d, data) {// 分页onchange
      let obj = erp.deepClone($scope.sendParams)
      obj.pageNo = String(data.pageNum)
      obj.pageSize = String(data.pageSize)
      $scope.sendParams = obj
      setTimeout(function(){
        $scope.$apply()
      })
    })

    $scope.rateCalc = rateCalc
    // 申请采购数量
    $scope.purchaseApplyFlag = false
    $scope.searchSku = '' // 查询sku
    $scope.searchSkuObj = undefined // 查询后的结果
    $scope.querySkuList = function(){
      if($scope.searchSku=='') return layer.msg('sku不能为空')
      layer.load(2)
      erp.postFun(APIS.querySkuFromStan+'?sku='+$scope.searchSku,null,function(data){
        layer.closeAll('loading')
        if(data.data.code!='200') return layer.msg(data.data.message || '服务器打盹了，请稍后再试')
        var res = data.data.data
        res.storage = String(res.storage) // 默认仓库
        $scope.searchSkuObj = res
        console.log('sku查询结果',$scope.searchSkuObj)
      })
    }
    function clearApply(){// 清空搜索数据
      $scope.searchSku = ''
      $scope.purchaseApplyFlag = false
      $scope.searchSkuObj = undefined
    }
    $scope.openPurchaseApplyBubble = function(){
      clearApply()
      $scope.purchaseApplyFlag = true
    }
    $scope.savePurchaseSubmit = function(){// 保存预采购申请
      var _searchSkuObj = $scope.searchSkuObj
      if(!!!_searchSkuObj) return layer.msg('无法提交空数据')
      var params = {
        sku:_searchSkuObj.sku,
        image:_searchSkuObj.image,
        procurementCount:_searchSkuObj.procurementCount,
        storage:Number(_searchSkuObj.storage)
      }
      layer.load(2)
      erp.postFun(APIS.saveProcurementPrior,JSON.stringify(params),function(data){
        layer.closeAll('loading')
        if(data.data.code!='200') return layer.msg(data.data.message || '服务器错误')
        layer.msg('提交成功')
        clearApply()
        getList()
      })
    }

    $scope.onKeyUpEventByNumber = function(key){
      onKeyUpEventByNumber($scope,key)
    }

    $scope.keyUpByMoney = moneyCheck

    $scope.onMoneyBlur = function(key){
      if(!moneyRegReturn($scope.list[index][key])){
        return layer.msg('请输入正确的金额')
      }
    }

  }

  var advancePurchaseApplyList = function($scope,erp){// 预采购申请单列表
    console.log('预采购申请单列表')
    $scope.warehouseobj = warehouseobj
    $scope.statusobj = statusobj // 数据状态
    $scope.sendParams = erp.deepClone(initParams)
    $scope.sendParams.procurementStatus = '0' // 默认待审核
    $scope.list = []// 预采购列表
    function getList(){
      var params = erp.deepClone($scope.sendParams)
      // params.procurementPrice = numRegReturn(params.procurementPrice)
      if(!!params.procurementPrice && !moneyRegReturn(params.procurementPrice)) return layer.msg('请输入正确的价格')
      // params.procurementCount = numRegReturn(params.procurementCount)
      params.procurementPeriodLow = numRegReturn(params.procurementPeriodLow)
      params.procurementPeriodHigh = numRegReturn(params.procurementPeriodHigh)
      params.arrivalPeriodLow = numRegReturn(params.arrivalPeriodLow)
      params.arrivalPeriodHigh = numRegReturn(params.arrivalPeriodHigh)
      getPurchaseList(erp,params,function(res){
        $scope.list = res.list

        $scope.$broadcast('page-data',{
          pageSize: $scope.sendParams.pageSize,//每页条数
          pageNum: $scope.sendParams.pageNo,//页码
          totalNum: Math.ceil(Number(res.totalCount) / Number($scope.sendParams.pageSize)),//总页数
          totalCounts: res.totalCount,//数据总条数
          pageList:['10','20','50'],//条数选择列表，例：['10','50','100']
          showGo:false
        })
      })
    }
    getList()
    var debounceGetList = erp.deBounce(getList,500)// 防抖配置
    $scope.$watch('sendParams',function(a,b){// 深度监听sendParams变化
      if(a===b) return false
      if(a.pageNo===b.pageNo) $scope.sendParams.pageNo = '1'
      debounceGetList()
    },true)

    $scope.$on('pagedata-fa', function (d, data) {// 分页onchange
      let obj = erp.deepClone($scope.sendParams)
      obj.pageNo = String(data.pageNum)
      obj.pageSize = String(data.pageSize)
      $scope.sendParams = obj
      setTimeout(function(){
        $scope.$apply()
      })
    })

    $scope.updateStatus = function(item,type){// 修改状态
      var url = APIS.updatePurchaseStatus
      var params = {
        id:item.id,
        procurementStatus:type
      }
      layer.load(2)
      erp.postFun(url,JSON.stringify(params),function(data){
        layer.closeAll('loading')
        if(data.data.statusCode!=200) return layer.msg('修改失败')
        layer.msg('修改成功')
        getList()
      })
    }

    $scope.keyUpByMoney = moneyCheck
    $scope.onKeyUpEventByNumber = function(key){
      onKeyUpEventByNumber($scope,key)
    }
  }

  var advancePurchaseCycleSetting = function($scope,erp){// 预采购周期设置
    console.log('预采购周期设置')
    
    $scope.sendParams = {
      procurementType:0,// 0 通用 1 专用
      procurementPeriod:'',// 采购周期
      procurementPriceLow:'',// 采购价格低
      // procurementPriceHigh:'',// 采购价格高
      sku:'',// sku
    }
    $scope.list = [] // 周期列表
    var getList = function(){
      var params = erp.deepClone($scope.sendParams)
      params.procurementPeriod = numRegReturn(params.procurementPeriod)
      // params.procurementPriceLow = numRegReturn(params.procurementPriceLow)
      if(!!params.procurementPriceLow && !moneyRegReturn(params.procurementPriceLow)) return layer.msg('请输入正确的价格')
      layer.load(2)
      erp.postFun(APIS.queryPeriodList,JSON.stringify(params),function(data){
        layer.closeAll('loading')
        if(data.data.statusCode!='200') return layer.msg('服务器错误')
        $scope.list = data.data.result.list
      })
    }
    getList()
    var deBounceGetList = erp.deBounce(getList,500)
    $scope.$watch('sendParams',function(a,b){// 监听参数
      if(a===b) return false
      if(a.pageNo===b.pageNo) $scope.sendParams.pageNo = '1'
      $scope.list = []// 清空
      deBounceGetList()
    },true)

    $scope.update = function(item){// 修改一条数据添加一条数据
      if(item.hasErrorValid) return layer.msg('请填写正确的信息')
      var params = {
        id:!!item.id?item.id:undefined,
        procurementType:item.procurementType,
        procurementPriceLow:item.procurementPriceLow,
        procurementPriceHigh:item.procurementPriceHigh,
        procurementPeriod:item.procurementPeriod,
        sku:item.sku
      }
      layer.load(2)
      erp.postFun(!!item.id?APIS.updatePeriod:APIS.addPeriod,JSON.stringify(params),function(data){
        layer.closeAll('loading')
        if(data.data.statusCode!='200') return false
        getList()
      })
    }

    $scope.delete = function(item,index){// 删除一条数据
      if(!item.id) return $scope.list.splice(index,1)
      var params = { id:item.id }
      layer.load(2)
      erp.postFun(APIS.delPeriod,JSON.stringify(params),function(data){
        layer.closeAll('loading')
        if(data.data.statusCode!='200') return false
        getList()
      })
    }

    $scope.add = function(){// 添加一条数据
      $scope.list.push({
        sku:'',
        procurementPriceLow:'',
        procurementPriceHigh:'',
        procurementPeriod:'',
        procurementType:$scope.sendParams.procurementType
      })
    }

    $scope.onKeyUpEventByNumber = function(key){
      onKeyUpEventByNumber($scope,key)
    }

    $scope.keyUpByMoney = moneyCheck

    $scope.hasErrorValid = false // 是否有校验错误
    $scope.onMoneyBlur = function(index,key,event){
      if(!moneyRegReturn($scope.list[index][key])){
        event.target.style = 'border-color:red;'
        $scope.list[index]['hasErrorValid'] = true
        return layer.msg('请输入正确的金额')
      }
      event.target.style = 'border-color:initail;'
      $scope.list[index]['hasErrorValid'] = false
    }

    $scope.onKeyUpByNum = function(index,key){
      $scope.list[index][key] = numRegReturn($scope.list[index][key])
    }
  }

  var advancePurchaseWarning = function($scope,erp){// 预采购预警管理
    console.log('预采购预警管理')
    $scope.warehouseobj = warehouseobj
    $scope.statusobj = statusobj // 状态对象
    $scope.sendParams = erp.deepClone(initParams)
    $scope.sendParams.warningStatus = 0 // 默认待审核
    $scope.list = []// 预采购列表
    function getList(){
      var params = erp.deepClone($scope.sendParams)
      // params.procurementPrice = numRegReturn(params.procurementPrice)
      if(!!params.procurementPrice && !moneyRegReturn(params.procurementPrice)) return layer.msg('请输入正确的价格')
      params.procurementCount = numRegReturn(params.procurementCount)
      params.procurementPeriodLow = numRegReturn(params.procurementPeriodLow)
      params.procurementPeriodHigh = numRegReturn(params.procurementPeriodHigh)
      params.arrivalPeriodLow = numRegReturn(params.arrivalPeriodLow)
      params.arrivalPeriodHigh = numRegReturn(params.arrivalPeriodHigh)
      getPurchaseList(erp,params,function(res){
        $scope.list = res.list

        $scope.$broadcast('page-data',{
          pageSize: $scope.sendParams.pageSize,//每页条数
          pageNum: $scope.sendParams.pageNo,//页码
          totalNum: Math.ceil(Number(res.totalCount) / Number($scope.sendParams.pageSize)),//总页数
          totalCounts: res.totalCount,//数据总条数
          pageList:['10','20','50'],//条数选择列表，例：['10','50','100']
          showGo:false
        })
      })
    }
    getList()
    var debounceGetList = erp.deBounce(getList,500)// 防抖配置
    $scope.$watch('sendParams',function(a,b){// 深度监听sendParams变化
      if(a===b) return false
      if(a.pageNo===b.pageNo) $scope.sendParams.pageNo = '1'
      debounceGetList()
    },true)

    $scope.$on('pagedata-fa', function (d, data) {// 分页onchange
      let obj = erp.deepClone($scope.sendParams)
      obj.pageNo = String(data.pageNum)
      obj.pageSize = String(data.pageSize)
      $scope.sendParams = obj
      setTimeout(function(){
        $scope.$apply()
      })
    })

    $scope.updateStatus = function(item,type){// 修改状态
      var url = APIS.updateWarningStatus
      var params = {
        id:item.id,
        warningStatus:type
      }
      layer.load(2)
      erp.postFun(url,JSON.stringify(params),function(data){
        layer.closeAll('loading')
        if(data.data.statusCode!=200) return layer.msg('修改失败')
        layer.msg('修改成功')
        getList()
      })
    }

    $scope.rateCalc = rateCalc
    $scope.keyUpByMoney = moneyCheck

    // setInputNumber()
    $scope.onKeyUpEventByNumber = function(key){
      onKeyUpEventByNumber($scope,key)
    }
  }

  var advancePurchaseStockOutWarning = function($scope,erp){// 断货预警管理
    console.log('断货预警管理')
    $scope.warehouseobj = warehouseobj
    $scope.sendParams = erp.deepClone(initParams)
    $scope.sendParams.nogoodsStatus = 0
    $scope.list = []// 预采购列表
    function getList(){
      var params = erp.deepClone($scope.sendParams)
      params.procurementPrice = numRegReturn(params.procurementPrice)
      params.procurementCount = numRegReturn(params.procurementCount)
      params.procurementPeriodLow = numRegReturn(params.procurementPeriodLow)
      params.procurementPeriodHigh = numRegReturn(params.procurementPeriodHigh)
      params.arrivalPeriodLow = numRegReturn(params.arrivalPeriodLow)
      params.arrivalPeriodHigh = numRegReturn(params.arrivalPeriodHigh)
      getPurchaseList(erp,params,function(res){
        $scope.list = res.list

        $scope.$broadcast('page-data',{
          pageSize: $scope.sendParams.pageSize,//每页条数
          pageNum: $scope.sendParams.pageNo,//页码
          totalNum: Math.ceil(Number(res.totalCount) / Number($scope.sendParams.pageSize)),//总页数
          totalCounts: res.totalCount,//数据总条数
          pageList:['10','20','50'],//条数选择列表，例：['10','50','100']
          showGo:false
        })
      })
    }
    getList()
    var debounceGetList = erp.deBounce(getList)// 防抖配置
    $scope.$watch('sendParams',function(a,b){// 深度监听sendParams变化
      if(a===b) return false
      if(a.pageNo===b.pageNo) $scope.sendParams.pageNo = '1'
      debounceGetList()
    },true)

    $scope.$on('pagedata-fa', function (d, data) {// 分页onchange
      let obj = erp.deepClone($scope.sendParams)
      obj.pageNo = String(data.pageNum)
      obj.pageSize = String(data.pageSize)
      $scope.sendParams = obj
      setTimeout(function(){
        $scope.$apply()
      })
    })

    $scope.onKeyUpEventByNumber = function(key){
      onKeyUpEventByNumber($scope,key)
    }
  }

  // common
  function rateCalc(val){let res = (1-val).toFixed(2) * 100;return res.toFixed(2) } // 利率计算
  function moneyRegReturn(str){return /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(str)}
  function numRegReturn(str){return str.replace(/[^\d]/g,'')}
  function onKeyUpEventByNumber($scope,key){
    $scope.sendParams[key] = numRegReturn($scope.sendParams[key])
  }
  function moneyCheck(e){// 校验金额并加红框
    let val = e.target.value
    let color = 'initail'
    if(!!val && !moneyRegReturn(val)) color = 'red'
    e.target.style = 'border-color:'+color+';' 
  }
  // 通用仓库列表获取
  function getStorageList(erp,success){
    erp.getStorage(function(list){
      let obj = {}
      for(let i=0;i<list.length;i++){
        let item = list[i]
        obj[item.dataId] = item.dataName
      }
      success(obj)
    },1)
    // erp.postFun(APIS.getStorageList,JSON.stringify(sendjson),function(res){
    //   if(res.data.code!=200) return layer.msg('获取仓库失败')
    //   let list = res.data.data
    //   let obj = {}
    //   for(let i=0;i<list.length;i++){
    //     let item = list[i]
    //     obj[item.id] = item.storageName
    //   }
    //   success(obj)
    // })
  }

  app.controller('advancePurchaseList', ['$scope', 'erp', '$routeParams', advancePurchaseList]) // 预采购列表
  app.controller('advancePurchaseApplyList', ['$scope', 'erp', advancePurchaseApplyList]) // 预采购申请单列表
  app.controller('advancePurchaseCycleSetting', ['$scope', 'erp', advancePurchaseCycleSetting]) // 预采购周期设置
  app.controller('advancePurchaseWarning', ['$scope', 'erp', advancePurchaseWarning]) // 采购预警管理
  app.controller('advancePurchaseStockOutWarning', ['$scope', 'erp', advancePurchaseStockOutWarning]) // 断货预警管理

})()