(function(){

  const APIS = {
    getSkuList:'procurement/order/queryOutlineProduct',// 获取sku列表
    getOrderInfo:'caigou/procurementOrder/queryOrderInfo',// 获取订单信息
    queryDeliveryAddress:'procurement/caigouAliaddress/list',// 查询所有收货地址列表
  }

  var app = angular.module('offilinePurchaseDetail', [])
  var offilinePurchaseDetailController = function($scope,erp,$routeParams,merchan){
    console.log('线下采购-详情查看')
    $scope.receiptObj = {
      '1':'银行',
      '2':'支付宝'
    }

    $scope.payforObj = {
      '1':'预付订金',
      '2':'先付款后发货',
      '3':'先发货后付款'
    }

    $scope.warehouseobj = warehouseList

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
    $scope.empty = '未填写' 

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

    function getOrderInfo(){
      const params = {
        orderId:$routeParams.id,
        onlineType:$routeParams.type
      }
      layer.load(2)
      erp.postFun(APIS.getOrderInfo,JSON.stringify(params),function(res){
        layer.closeAll('loading')
        if(res.data.statusCode != 200) return layer.msg('服务器错误')
        const orderInfo = res.data.result.list
        $scope.orderInfo = orderInfo    
        setLogistics(orderInfo)  
        setCertPic(orderInfo)
        getSkuList()
      })
    }
    getOrderInfo()

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
    
    function getSkuList(){// 获取订单下的sku列表
      let store = $scope.orderInfo.store
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
        $scope.skuList = list
        calcRecommend()
      })
    }
    
    $scope.certPic = []
    function setCertPic(orderInfo){
      const proofImg = orderInfo.proofImg
      if(proofImg.length <= 0) return
      const certPic = proofImg.split(',')
      $scope.certPic = certPic
    }

    $scope.previewPic = function (src) {// 预览凭证
			merchan.previewPicTwo(src);
		}

    function setLogistics(orderInfo){// 格式化物流
      const zhuiZongHao = JSON.parse(orderInfo.zhuiZongHao)
      const arr = []
      for(let key in zhuiZongHao){
        arr.push({
          company:zhuiZongHao[key],
          orderNo:key
        })
      }
      if(arr.length <= 0) arr.push({company:'未填写',orderNo:'未填写'})
      $scope.logistics = arr
    }
    $scope.formatWarehouse = function(val){ return getWarehouseByVal(val)}
  }

  const warehouseList = window.warehousePurList

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
  
  app.controller('offilinePurchaseDetailController',['$scope','erp','$routeParams', 'merchan',offilinePurchaseDetailController])
})()