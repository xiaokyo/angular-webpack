// 线下采购--待确认
(function(){
  var app = angular.module('purchaseOffline_k', []);
  var APIS = {
    // 待确认
    getOfflineList:'caigou/procurementOrder/queryOrderNotApiPage',// 线下采购列表
    batchDel:'caigou/procurementOrder/batchDelete', // 批量删除
    batchReject:'caigou/procurementOrder/offlineReject', //批量驳回

    // 确认提交
    getSkuList:'procurement/order/queryOutlineProduct',// 获取sku列表
    getOrderInfo:'caigou/procurementOrder/queryOrderInfo',// 获取订单信息
    queryDeliveryAddress:'procurement/caigouAliaddress/list',// 查询所有收货地址列表
    export2word:'procurement/caigouDingdanxianxia/exprotDoc',// 导出订单信息 

    saveCaigouDan:'caigou/procurementOrder/saveNoCheck',// 提交至未付款
  }

  var purchaseOfflineConfirm = function($scope,erp,$routeParams){
    console.log('线下采购--待确认')

    // 线下采购列表
    $scope.list = [] // 待确认列表
    $scope.sendParams = {
      'status': 5,
      'pageNo': '1',
      'pageSize': '10',
      'chuDanCaiGouIds': '',
      'orderId': '',
      'caigouRen': '',
      'caigouType': '4',
      'begainDate': '',
      'endDate': ''
    }
    var getList = function(){
      let params = erp.deepClone($scope.sendParams)
      params.caigouRen = $scope.loginName
      params.personalizedIdentity = $scope.personalizedIdentity
      layer.load(2)
      erp.postFun(APIS.getOfflineList,JSON.stringify(params),function(res){
        layer.closeAll('loading')
        if(res.data.statusCode!='200') return
        let result = res.data.result
        $scope.list = result.list
        $scope.$broadcast('page-data',{
          pageSize: $scope.sendParams.pageSize,//每页条数
          pageNum: $scope.sendParams.pageNo,//页码
          totalNum: Math.ceil(Number(result.totalCount) / Number($scope.sendParams.pageSize)),//总页数
          totalCounts: result.totalCount,//数据总条数
          pageList:['10','20','50']//条数选择列表，例：['10','50','100']
        })

      })
    }
    $scope.getList = getList
    // getList()

    $scope.purchasePersonCallback = function({id, loginName}){
			console.log('purchasePersonCallback', id)
			$scope.personalizedIdentity = 2
			$scope.loginName = undefined
			if(id == 'POD') $scope.personalizedIdentity = 1
			if(loginName && id != 'POD') {
				$scope.personalizedIdentity = 0
				$scope.loginName = loginName
			}
			getList()
		}

    $scope.$on('pagedata-fa', function (d, data) {// 分页onchange
      $scope.sendParams.pageNo = data.pageNum
      $scope.sendParams.pageSize = data.pageSize
      getList()
    })

    $scope.allChecked = false // 全选
    $scope.changeChecked = function(){// 全选和反选
      $scope.list.forEach(function(_,index){ $scope.list[index]['checked'] = $scope.allChecked })
    }
    $scope.isAllChecked = function(){// checkbox子项点击判断是否已全选
      let arr = $scope.list,len = arr.length,sum = 0
      arr.forEach(function(_){ if(_.checked) sum+=1 })
      if(sum==len) $scope.allChecked = true
      else $scope.allChecked = false
    }

    // 批量common
    var batchRequest = function(type,fn){
      let arr = $scope.list,ids = []
      arr.forEach(function(_,i){if(_.checked){ids.push({orderId:_.orderId,type:_.onlineType})}})
      if(ids.length<=0) return layer.msg('请选择')
      const tips = type == 'batchReject' ? "你确定驳回出单采购吗？":"你确定删除吗？"
      const flag = confirm(tips)
      if(!flag) return
      let params = { list:ids }
      erp.postFun(APIS[type],JSON.stringify(params),function(res){
        if(res.data.statusCode != 200) return layer.msg('服务器错误')
        layer.msg('操作成功')
        getList()
        fn && fn(res)
      })
    }
    
    // 驳回至采购出单
    $scope.batchReject = function(){batchRequest('batchReject',function(res){})}

    // 批量删除
    $scope.batchDel = function(){batchRequest('batchDel',function(res){})}

    $scope.export2word = function(item){// 导出至word
      const params = { orderId:item.orderId }
      layer.load(2)
      erp.loadDown({
        url:APIS.export2word,
        params:params,
        fileName:'doc',
        callback(){
          layer.closeAll('loading')
          layer.msg('导出成功')
        }
      })
    }
 
  }

  var purchaseOfflineConfirmSubmit = function($scope,erp,$routeParams,merchan){
    console.log('线下采购--待提交')
    $scope.id = $routeParams.id
    
    $scope.receiptObj = {
      1:'银行',
      2:'支付宝'
    }

    $scope.payforObj = {
      '1':'预付订金',
      '2':'先付款后发货',
      '3':'先发货后付款',
      // '4':'先付尾款后发货',
      // '5':'分批付款发货'
    }
    
    // payTypeChange
    $scope.payTypeChange = function(){
      const type = $scope.sendParams.payType
      let frontMoneyType = ''
      if(type == 1) frontMoneyType = '1'
      $scope.frontMoneyType = frontMoneyType
    }

    $scope.frontMoneyType = '0'
    $scope.frontMoneyTypeObj = {
      '0':'普通预付订金',
      '1':'先付尾款后发货',
      '2':'分批付款发货'
    }

    // 批次列表
    $scope.barCodPayList = [{key:'',value:''}] // key : index, value: 金额
    $scope.addBarCodPay = function(){
      const len = $scope.barCodPayList.length
      if(len >= 10) return layer.msg('暂时只支持分十批次')
      $scope.barCodPayList.push({key:'',value:''})
    }

    $scope.warehouseList = warehouseList

    $scope.markList = {// 统一采购标记
      'zhengChang':'正常',
      'jiaJi':'加急',
      'vip':'Vip',
      'zhiFa':'直发',
      'zuZhuang':'组装',
      'buRuKu':'不入库',
      'usaZhiFa':'美国仓直发',
      'xianXiaZu':'线下组',
      'gaiBiao':'改标',
    }

    // 计算建议采购数量
    const calcRecommend = function(){
      const list = $scope.skuList.map(_=>{
        const { orderneedcount, nprocurementcount, kucun} = _
        return {..._,recommentCount:calcRecommendCount({orderneedcount,nprocurementcount,kucun})}
      })
      $scope.skuList = list
    }

    function calcRecommendCount({orderneedcount, nprocurementcount, kucun}) {
			let calcCount = orderneedcount - nprocurementcount - kucun;
			return calcCount > 0 ? calcCount : 0;
		}

    $scope.empty = '未填写'
    $scope.sendParams = {}
    $scope.skuList = []// skuList
    function getSkuList(){
      let store = $scope.sendParams.store
      let params = {
				store:store,
				storageId:getWarehouseByVal(store,'id')[0],
				orderId:$routeParams.id
      }
      layer.load(2)
      erp.postFun(APIS.getSkuList,JSON.stringify(params),function(res){
        layer.closeAll('loading')
        if(res.data.code!=200) return layer.msg('服务器错误')
        const list = res.data.data
        $scope.skuList = erp.deepClone(list)
        calcRecommend()
        $scope.oldSkuList = erp.deepClone(list)
      })
    }

    $scope.getAddressText = function(id){ // id获取收货地址全部信息
      let res = ''
      const addressList = $scope.deliveryAddressArr || []
      for(let i=0,len=addressList.length;i<len;i++){
        const item = addressList[i]
        if(id==item.addressId){
          res = item.addressCodeText + " "+ item.townText + " "+ item.address + " "+ item.fullName + ","+item.mobile
          break
        }
      }
      return res
    }

    function queryDeliveryAddress(){// 获取收货地址列表
      const params = {
        pageNum:1,
        pageSize:9999
      }
      erp.postFun(APIS.queryDeliveryAddress,JSON.stringify(params),function(res){
        if(res.data.code!=200) return layer.msg('服务器错误')
        $scope.deliveryAddressArr = res.data.data.list
      })
    }
    queryDeliveryAddress()

    $scope.formatWarehouse = function(val){return getWarehouseByVal(val)}

    function setLogistics(orderInfo){// 格式化物流
      const zhuiZongHao = !!orderInfo.zhuiZongHao?JSON.parse(orderInfo.zhuiZongHao):{}
      const arr = []
      for(let key in zhuiZongHao){
        arr.push({
          company:zhuiZongHao[key],
          orderNo:key
        })
      }
      arr.push({company:'',orderNo:''})
      $scope.logistics = arr
    }

    function Int2String(keys){ // 批量设置成string
      const params = erp.deepClone($scope.sendParams)
      if(keys instanceof Array){
        for(let i=0;i<keys.length;i++){
          params[keys[i]] = params[keys[i]] + ''
        }
      }else{
        params[keys] = params[keys] + ''
      }
      $scope.sendParams = params
    }
    
    const setDefault = () =>{ // 设置默认为0的为1
      const params = erp.deepClone($scope.sendParams)
      if(params.payType == 0) params.payType = '1'
      if(params.acceptType == 0) params.acceptType = '1'
      $scope.sendParams = params
    }

    function getOrderInfo(){// orderInfo
      let params = {
				onlineType:$routeParams.type,
				orderId:$routeParams.id
      }
      layer.load(2)
      erp.postFun(APIS.getOrderInfo,JSON.stringify(params),function(res){
        layer.closeAll('loading')
        const orderInfo = res.data.result.list
        $scope.orderInfo = orderInfo
        $scope.sendParams = erp.deepClone(orderInfo)
        Int2String(['payType','store','acceptType','addressId'])
        setLogistics(orderInfo)
        setDefault()
        getSkuList()
      }) 
    }
    getOrderInfo()

    // 添加一个物流信息
    $scope.addLogistics = function(){
      if($scope.logistics.length>=5) return layer.msg('超出限制')
      $scope.logistics.push({
        company:'',
        orderNo:''
      })
    }

    // 确认弹窗
    $scope.submitBubble = false 
    $scope.openConfrimBubble = function(){
      const params = $scope.sendParams
      const checkVaildField = () => {
        if(!params.gongHuoGongSi) return '供货公司不能为空'
        if(!params.accountName) return '账户名称不能为空'
        if(!params.addressId) return '收货地址不能为空'

        if(params.payType == 1){
          const barCodPayList = $scope.barCodPayList
          if(!params.frontMoney && !$scope.barCodPayList[0].value) return '订金不能为空'
          if($scope.frontMoneyType == 2){
            let barErr = ''
            barCodPayList.forEach(_=>{ if(!_.value) barErr = '批次金额不能为空' })
            if(barErr) return barErr
          }
        }else
          if(!params.zhiFu) return '供需支付不能为空'
        
        if(params.acceptType == 1){// 银行  
          if(!params.bankAccount) return '银行账号不能为空'
          if(!params.bank) return '收款银行不能为空'
          if(!params.branchBank) return '收款银行支行不能为空'   
        }

        if(params.acceptType == 2){// 支付宝
          if(!params.bankAccount) return '支付宝账号不能为空'
        }

        if(!$scope.certPic || $scope.certPic.length <= 0) return '请上传采购凭证'

        const list = $scope.skuList
        let error = false
        for(let i=0;i<list.length;i++){
          if(list[i].shuLiang <= 0){
            error = true
            break
          }
        }

        if(error) return '实际采购数量不能为空或者为0'
        return ''
      }

      const vaildError = checkVaildField()
      if(vaildError != '') return layer.msg(vaildError)

      $scope.submitBubble = true
    }
    
    // 批量修改弹窗
    $scope.batchEditBubble = false 
    $scope.batchPurchaseNum = 0 // 批量设置的采购数量
    $scope.batchEditPurchaseNum = function(){
      if(!$scope.batchPurchaseNum || $scope.batchPurchaseNum<=0) return layer.msg('采购数量不能为空')
      console.log($scope.batchPurchaseNum)
      const list = erp.deepClone($scope.skuList)
      for(let i=0;i<list.length;i++){
        list[i].shuLiang = $scope.batchPurchaseNum
      }
      $scope.skuList = list
      $scope.batchEditBubble = false 
    } 


    $scope.certPic = []
    $scope.upLoadImg = function () {// 上传凭证
      const MAX_SIZE = 3
			var files = $('#upload-img1')[0].files
			if($scope.certPic.length + files.length > MAX_SIZE) return layer.msg('限制'+ MAX_SIZE +'张凭证图片')
			erp.ossUploadFile(files, function (data) {
					$('#upload-img1').val('');
					console.log(data);
					if (data.code == 0) {
						layer.msg('上传失败');
						return;
					}
					if (data.code == 2) {
						layer.msg('部分图片上传失败，请等待图片加载。');
					}
					if (data.code == 1) {
						layer.msg('上传成功，请等待图片加载。');
					}
					var result = data.succssLinks;
					for(var i=0;i<result.length;i++){
						$scope.certPic.push(result[i])
					}
					$scope.$apply()
			});
		}
		$scope.previewPic = function (src) {// 预览凭证
			merchan.previewPicTwo(src);
		}
		$scope.deletePic = function(index){// 删除上传凭证
			$scope.certPic.splice(index,1);
		}

    // save 
    $scope.saveCaigou = function(){
      const order = $scope.orderInfo
      const newOrder = $scope.sendParams

      const getUnitPrice = function(oldItem,newItem,len){// 获取最新单价
        let oldPrice = Number($scope.sendParams.huoWuZongJia.replace(/,/g,'')) // 原总价
        if($routeParams.type == '2') oldPrice = Number($scope.sendParams.zhiFu)
        let rate = Number(oldItem.shuLiang)*Number(oldItem.costprice)
        rate = rate / oldPrice
        let newPrice = Number($scope.sendParams.zhiFu) // 实际支付价格
        if(len==1){
          return (newPrice / Number(newItem.shuLiang)).toFixed(2)
        }
        let result = newPrice*rate // 新单品总价
        result = result / Number(newItem.shuLiang) // 新单价
        return result.toFixed(2)
      }
      const getSkuListParams = function (){// 获取skulist传参
        const res = [],list = $scope.oldSkuList,newList = $scope.skuList
        for(var i=0;i<list.length;i++){
          res.push({
            id:String(list[i].id),
            procurementOrderId:list[i].chuDanCaiGouId,
            productUnitPrice:getUnitPrice(list[i],newList[i],list.length),
            oldNumber:parseInt(list[i].shuLiang),
            newNumber:parseInt(newList[i].shuLiang)
          })
        }
        return res
      }
      // var getTimeTamp = function(str){// 获取时间戳
      //   return new Date(str).getTime()
      // }
      const getLogisticsParams = function (){// 获取物流参数
        var res = {},logistics = $scope.logistics,len = logistics.length
        if(len <=0) return '{}'
        for(var i=0;i<len;i++){
          if(logistics[i].company != ''){
            res[logistics[i].orderNo] = logistics[i].company
          }		
        }
        return JSON.stringify(res)
      }

      const getPurchaseProve = function(){// 获取采购凭证
        const pics = $scope.certPic
        let res = ''
        pics.forEach(function(item,index){
          let dh = index == 0? '' : ','
          res += dh + item
        })
        return res
      }

      // 获取批次map 对象
      const getBarCodPayMap = function(){
        if($scope.frontMoneyType != '2') return null
        const barCodPayList = $scope.barCodPayList
        const barObj = {}
        barCodPayList.forEach((_,index) => { barObj[index+1] = _.value })
        return barObj
      }

      // 获取payTypeTo
      const getPayTypeTo = function(){
        const frontMoneyType = $scope.frontMoneyType
        let payTypeTo = newOrder.payType
        const payTypeObj = {
          '1':'4',
          '2':'5'
        }
        if(!!frontMoneyType && frontMoneyType != '0') payTypeTo = payTypeObj[frontMoneyType]
        return Number(payTypeTo)
      }

      // 获取订金和尾款
      const getFrontAndEndPrice = () => {
        let frontMoney = newOrder.frontMoney, restMoney = newOrder.restMoney;
        if($scope.frontMoneyType == '2'){
          const barCodPayList = $scope.barCodPayList
          frontMoney = barCodPayList[0].value || 0
          let restSum = 0
          barCodPayList.forEach(( _, i) => {
            if(i > 0){
              restSum += +_.value
            }
          })
          restMoney = restSum
        }
        return { frontMoney, restMoney }
      }

      const { frontMoney, restMoney } = getFrontAndEndPrice()

      const params = {
        'id': order.id,
        'orderId': order.orderId,
        'type': order.caigouType,
        'waybillNo': getLogisticsParams(),
        'company': newOrder.gongHuoGongSi,
        'warehouse': newOrder.store,
        'tag': newOrder.caiGouLiuYan,
        'signRemark': newOrder.signRemark,
        'originalPrice': newOrder.zhiFu,
        'actualPayAmount': newOrder.huoWuZongJia,
        // 'payVoucher': '',
        'payType': order.payType,
        'payObject': newOrder.accountName,
        'payAccount': newOrder.bankAccount,
        
        'bank': newOrder.bank,
        'branchBank':newOrder.branchBank,

        'barCodPayMap': getBarCodPayMap(),
        // 'payTime': '',
        'payTypeTo': getPayTypeTo(),
        'acceptType':Number(newOrder.acceptType),
        'addressId':Number(newOrder.addressId),
        'frontMoney': frontMoney,
        'restMoney': restMoney,
        'caigouRen':newOrder.caigouRen,
        'detail':getSkuListParams(),
        'proofImg':getPurchaseProve()
        // 'payResultType':isPayAll()
      }

      layer.load(2)
      erp.postFun(APIS.saveCaigouDan,JSON.stringify(params),function(res){
        layer.closeAll('loading')
        if(res.data.statusCode != 200) return layer.msg('服务器出错')
        layer.msg('提交成功')
        $scope.submitBubble = false
        window.location.href = '/manage.html#/erppurchase/offlinePurchase'
      })

    }
  }

  const warehouseList = window.warehousePurList

  const PAY_RESULT_TYPE = {// 是否全部付清
    1:'部分付清',
    2:'全部付清'
  }

  function getWarehouseByVal(val,key='label'){// value匹对 默认返回对应label 
		var result = ''
		for(var i=0;i<warehouseList.length;i++){
			var item = warehouseList[i]
			if(item.value==val){
				result = item[key]
				break
			}
		}
		return result
	}

  app.controller('purchaseOfflineConfirm', ['$scope', 'erp', '$routeParams', purchaseOfflineConfirm]) // 线下采购-待确认
  app.controller('purchaseOfflineConfirmSubmit', ['$scope', 'erp', '$routeParams', 'merchan', purchaseOfflineConfirmSubmit]) // 线下采购-待提交
})()