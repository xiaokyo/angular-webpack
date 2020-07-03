// 采购退款处理
(function(){
  var app = angular.module('offlinePurchaseRefund', [])
  var APIS = {
    getSkuList:'procurement/order/queryOutlineProduct',// 获取sku列表--线下
    getSkuListOnline:'procurement/order/queryOnlineProduct',// 获取sku列表--线上
    getOrderInfo:'caigou/procurementOrder/queryOrderInfo',// 获取订单信息
    queryDeliveryAddress:'procurement/caigouAliaddress/list',// 查询所有收货地址列表
    submitRefundInfo:'procurement/order/updatePurchasingRefund',// 提交退款信息
    queryPaidPrice:'caigou/procurementOrder/orderPaid', // 获取已付金额
  }
  var offlinePurchaseRefundController = function($scope,erp,$routeParams,$timeout,merchan){
    console.log('新采购--退款')
    $scope.caigouType = '0' // 0->1688非API 1->1688API 2->淘宝 3->天猫 4->线下采购 
    $scope.onlineType = $routeParams.type || 1 // 1 线上  2 线下
    $scope.receiptObj = {
      '1':'银行',
      '2':'支付宝'
    }

    $scope.caigouTypeObj = {
      '0':'1688非API',
      '1':'1688API',
      '2':'淘宝',
      '3':'天猫',
      '4':'线下采购'
    }

    $scope.payTypeObj = {
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

    $scope.certPic = []
    // 上传组件的回调
    function uploadFilesCallback({ pics }) {
      console.log('uploadFilesCallback', pics)
      $scope.certPic = pics
    }
    $scope.uploadFilesCallback = uploadFilesCallback

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

    function getPaidPrice(){// 获取订单已付金额
      const params = {
        orderId:$routeParams.id,
      }
      layer.load(2)
      erp.postFun(APIS.queryPaidPrice,JSON.stringify(params),function(res){
        layer.closeAll('loading')
        if(res.data.statusCode != 200) return layer.msg('服务器错误')
        $scope.paidPrice = res.data.result
      })
    }
    getPaidPrice()

    function getOrderInfo(){// 获取订单信息
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
      let url = $scope.onlineType == 1 ? APIS.getSkuListOnline : APIS.getSkuList
      erp.postFun(url,JSON.stringify(params),function(res){
        layer.closeAll('loading')
        if(res.data.code != 200) return layer.msg('服务器错误')
        const list = res.data.data
        $scope.skuList = list
        calcRecommend()
      })
    }

    $scope.formatWarehouse = function(val){ return getWarehouseByVal(val,'label')}
    
    $scope.batchNumLayer = function(){
      const batchSetNum = function(num){
        let count = Number(numRegReturn(num))
        const list = $scope.skuList
        list.forEach(function(_,i){list[i].tuiKuanHouCaiGou = count})
        $scope.skuList = list
      }
      layer.prompt({
        title:'退款后采购数量（批量）'
      },function(val,index){
        if(numRegtest(val)) return layer.msg('请输入正确的整数格式')
        if(!val || val.length>10) return layer.msg('请输入正确长度')
        layer.close(index)
        batchSetNum(val)
        // console.log($scope.skuList)
        $timeout(function(){$scope.$apply()})
      })
    }

    $scope.openRefundSubmitPup = function(){
      const err = checkRefundParams()
      if(err) return layer.msg(err)
      $scope.confirmPop = true
    }

    // 验证退款参数
    const checkRefundParams = function(){
      const params = $scope.sendParams
      const skuList = $scope.skuList
      if(!params.refundAmount || params.refundAmount < 0) return '请输入退款金额'
      // if(!params.refundReason) return '请输入退款原因'
      if(!$scope.certPic || $scope.certPic.length <= 0) return '请上传退款凭证'

      let noEntryNum = false
      for(let i=0;i<skuList.length;i+=1){
        const item = skuList[i]
        if(!item.tuiKuanHouCaiGou || item.tuiKuanHouCaiGou <= 0){
          noEntryNum = true
          break
        }
      }
      if(noEntryNum) return '请填写退款数量'
      return ''
    }
    $scope.checkRefundParams = checkRefundParams

    $scope.sendParams = {
      orderId:$routeParams.id,
      dtos:[],
      refundType:'1',// 1 全部退款  2 部分退款
      refundAmount:'',
      refundReason:'',
      tuiKuanPingZheng:''
    }
    function submitRefund(){// 提交退款

      const err = checkRefundParams()
      if(err) return layer.msg(err)

      const getDtos = function(){// 获取商品列表的退款后采购数量
        const list = $scope.skuList
        let res = []
        list.forEach(function(item,index){
          const obj = {
            orderId:$routeParams.id,
            cjStanProductId:item.cjStanproductId,
            tuiKuanHouCaiGou:item.tuiKuanHouCaiGou
          }
          res.push(obj)
        })
        return res
      }

      const getPayProve = function(){// 获取退款凭证
        const pics = $scope.certPic
        let res = ''
        pics.forEach(function(item,index){
          let dh = index == 0? '' : ','
          res += dh + item
        })
        return res
      }

      const isRefundAll = function(){// 是否全部退款   1 全部退款 2 部分退款
        const orderInfo = $scope.orderInfo
        const payPrice = orderInfo.huoWuZongJia
        const refundPrice = $scope.sendParams.refundAmount
        let res = "2"
        if(refundPrice >= payPrice) res = '1'
        return res
      }

      const params = erp.deepClone($scope.sendParams)
      params.tuiKuanPingZheng = getPayProve()
      params.caigouType = $routeParams.type
      params.dtos = getDtos()
      params.refundType = isRefundAll()

      layer.load(2)
      erp.postFun(APIS.submitRefundInfo, params, function(res){
        layer.closeAll('loading')
        if(res.data.code != 200) return layer.msg(res.data.message || '服务器错误')
        layer.msg('提交成功')
        $scope.confirmPop = false
        window.history.go(-1)
      })
    }
    $scope.submitRefund = submitRefund

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

    $scope.keyupSkuNum = function(i){// 数字验证
      $scope.skuList[i].tuiKuanHouCaiGou= numRegReturn($scope.skuList[i].tuiKuanHouCaiGou)
    }
  }

  // common
  function numRegReturn(str){return str.replace(/[^\d]/g,'')}
  function numRegtest(str){return /[^\d]/.test(str)}

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

  app.controller('offlinePurchaseRefundController',['$scope','erp','$routeParams','$timeout','merchan',offlinePurchaseRefundController])
})()