;(function () {
    let app = angular.module('warehouse-app');
    //新增包裹
    console.log(app)
    app.controller('addPackageCtrl', ['$scope', "erp", '$location', '$routeParams','utils', function ($scope, erp, $location, $routeParams,utils) {
        $scope.productName = '';
        $scope.ParcelData = [];
        $scope.DDid = $routeParams.DDid ? $routeParams.DDid : null;
        $scope.BGid = $routeParams.BGid ? $routeParams.BGid : null;
        $scope.bgName = $routeParams.bgName ? $routeParams.bgName : '';
        $scope.TypeFlag = $routeParams.type;
        $scope.diQu = $routeParams.diQu;
        console.log($scope.diQu)
        if($scope.diQu=='美西奇诺仓' || $scope.diQu=='美国西'){
            $scope.store = 2;
        }else if($scope.diQu=='美东新泽西仓' || $scope.diQu=='美国东'){
            $scope.store = 3;
        }else if($scope.diQu=='深圳仓'){
            $scope.store = 1;
        }else if($scope.diQu=='义乌仓'){
            $scope.store = 0;
        }else{
            $scope.store = '';
        }
        $scope.property = '1';//包裹属性
        $scope.Percellist = [
            {name: '乌拉圭库存'},
            {name: '美国专线'},
            {name: '销售库存'},
            {name: '公司库存'},
        ];
        $scope.parcelUse = '公司库存';
        $scope.orderNum = '';
        
        //$scope.estimatedTotalWeight = 0;
        //返回
        $scope.back = function () {
            //location.href = '#/erpwarehouse/NotShipped';
            window.history.back(-1);
        }
        //excel 订单上传
        $scope.upLoadExcel = () => {
          $('#file').click()
        };
        $scope.isLook = false; // 是否展示上传Excel中有订单与所选属性不符合的数据
        $scope.changeUpload = (files) => {
          layer.load(2);
          let formData = new FormData();
          formData.append('file', files[0]);
          erp.upLoadImgPost('erp/parcel/uploadDataByExcel', formData, function (res) {
          layer.closeAll('loading');
          $('#file').val('');
          if (res.data.statusCode === '200') {
            console.log(res.data.result)
            $scope.feiPuHuoList = res.data.result.feiPuHuoList;
            $scope.puHuoList = res.data.result.puHuoList;
            $scope.weiZhaoDaoList = res.data.result.weiZhaoDaoList;
            $scope.weiZhiShuXingList = res.data.result.weiZhiShuXingList;
            if ($scope.property == '1') { // 普货
              $scope.isLook = $scope.feiPuHuoList.length > 0 || $scope.weiZhaoDaoList.length > 0;
              $scope.puHuoList.forEach((o,i) =>{
                $scope.ParcelData = [...$scope.ParcelData,{
                  productName: o.orderId,
                  skuOrOrderId: o.trackingNumber,
                  estimatedTotalWeight: o.estimatedTotalWeight || 0,
                  actualGrossWeight: o.actualGrossWeight || 0,
                  type: o.type,
                  quantity: o.number,
                }]
              })
            } else if ($scope.property == '0') { //非普货
              $scope.isLook = $scope.puHuoList.length > 0 || $scope.weiZhaoDaoList.length > 0;
              $scope.feiPuHuoList.forEach((o,i) =>{
                $scope.ParcelData = [...$scope.ParcelData,{
                  productName: o.orderId,
                  skuOrOrderId: o.trackingNumber,
                  estimatedTotalWeight: o.estimatedTotalWeight || 0,
                  actualGrossWeight: o.actualGrossWeight || 0,
                  type: o.type,
                  quantity: o.number,
                }]
              })
            }else if($scope.property == '2'){ // 未知属性
              $scope.weiZhiShuXingList.forEach((o,i) =>{
                $scope.ParcelData = [...$scope.ParcelData,{
                  productName: o.orderId,
                  skuOrOrderId: o.trackingNumber,
                  estimatedTotalWeight: o.estimatedTotalWeight || 0,
                  actualGrossWeight: o.actualGrossWeight || 0,
                  type: o.type,
                  quantity: o.number,
                }]
              })
            }
            $scope.ParcelData = utils.uniqueArr($scope.ParcelData,'skuOrOrderId')
          } else {
            layer.msg(res.data.message || '操作失败')
          }
        }, function (res) {
            layer.closeAll('loading');
            layer.msg('系统异常');
          });
        };
        //sku扫描
        $('#saomiao1').keypress(function (e) {
	        if (e.which == 13) {
                if($scope.ParmsNo1){
                    $scope.getProData($scope.ParmsNo1,'sku');
                    layer.msg('扫描')
                }
            }
        });
        //追踪号扫描
        $('#saomiao2').keypress(function (e) {
            if (e.which == 13) {
                if($scope.ParmsNo2){
                    if($scope.ParmsNo2.substring(0,1)=='D'&&$scope.ParmsNo2.substring(1,2)!='D'&&$scope.ParmsNo2.length==9){//服务商品
                        $scope.getProData($scope.ParmsNo2,'package');
                    }else{
                        $scope.getProData($scope.ParmsNo2,'order');
                    }
                    // layer.msg('扫描')
                }
            }
        });
        //扫描后查询
        $scope.getProData = function (ParmsNo,type) {
            $scope.orderNum = '';
            $scope.ParmsNo1 = '';
            $scope.productName = '';
            $scope.productNameOrOrder = '';
            $scope.ParmsNo2 = '';
            $scope.ParmsNos = ParmsNo;
            $scope.parmsType = type;
            $scope.estimatedTotalWeight = null;
            $scope.actualGrossWeight = null;
            $scope.Weight = null;
            $scope.quantity = null;
            var data = {
                skuOrOrderId: $scope.ParmsNos,
                type:type
            };
            layer.load(2);
            erp.postFun('app/parcel/selectProductOrOrderByNumber', data, function (res) {
                layer.closeAll('loading');
                if (res.data.code == 200) {
                    if (res.data.list.length > 0 && res.data.list[0].property) {
                          var store = res.data.list[0].store;
                          let playPromise;
	                      console.log(res.data.list[0].propertyList)
	                      let isPlayAudio = false;
                        if($scope.store){
                            if($scope.store!=store&&store!=''){
                                $('.audio-diaodubufu').get(0).play();
                                playPromise = $('.audio-diaodubufu').get(0).play();
	                            isPlayAudio = true;
                                layer.msg('该包裹与当前调度任务不符',{tiem:3000})
                            }
                        }

                        $scope.ParmsNos = res.data.list[0].skuOrOrderId;
                        $scope.estimatedTotalWeight = Number(res.data.list[0].estimatedTotalWeight) / 1000;
                        $scope.Weight = Number(res.data.list[0].estimatedTotalWeight) / 1000;
                        $scope.actualGrossWeight = res.data.list[0].weight;
                        $scope.quantity = null;
		                    // 播放语音
		                    const audioPlay = function() {
                                console.log(res.data.list[0].propertyList)
			                    if(store === '2' &&isPlayAudio){
				                    res.data.list[0].propertyList.push('美西')
			                    }else if(store === '3' && isPlayAudio){
				                    res.data.list[0].propertyList.push('美东')
                                }
                                console.log(res.data.list[0].propertyList)
			                    const text = res.data.list[0].propertyList.join(',')
			                    utils.textToAudio2(text)
		                    }
		                    if(isPlayAudio){
			                    const audio = document.getElementsByClassName("audio-diaodubufu")[0];
                                playPromise.then(() => {
                                    setTimeout(() => {
                                        audioPlay();
                                    }, 2000);
                                }).catch((e) => {
                                    console.log("调度音频失败")
                                });
		                    }else {
			                    audioPlay()
		                    }
	                    if(res.data.list[0].property){
                            if($scope.property == '1'){//普货
                                if (res.data.list[0].property != '1'||res.data.list[0].jiaJi == '1') {
                                    if (res.data.list[0].property != '1') {//非普货
                                       layer.msg('非普货不可添加')
	                                    return
                                    }
                                }
                            }else if($scope.property == '0'){//非普货
                                if (res.data.list[0].property == '1') {
                                    if (res.data.list[0].property == '1'&&res.data.list[0].jiaJi == '0') {//普货
                                       layer.msg('普货不可添加')
                                       if($('.audio-diaodubufu').get(0).paused){
                                           $('.audio-puhuo-bktj').get(0).play()
                                       }else{
                                           clearInterval(timer2)
                                           var timer2 = setInterval(function () {
                                               if($('.audio-diaodubufu').get(0).paused){
                                                   clearInterval(timer2)
                                                   $('.audio-puhuo-bktj').get(0).play()
                                               }
                                           },10)
                                       }
                                       return
                                    }
                                }
                            }
                        }
	
                        if(type == 'order'){
                            $scope.orderNum = res.data.list[0].orderId;
                            $scope.productNameOrOrder = res.data.list[0].orderId;
                            $scope.ParmsNo2 = res.data.list[0].skuOrOrderId;
                            var isRepeat1 = false;
                            $scope.ParcelData.some(function (o, i) {
                                if (o.skuOrOrderId == $scope.ParmsNos && type == o.type) {
                                    $scope.ParmsNos = o.skuOrOrderId;
                                    //$scope.estimatedTotalWeight = o.estimatedTotalWeight;
                                    $scope.estimatedTotalWeight = Number($scope.Weight * o.quantity);
                                    $scope.actualGrossWeight = o.actualGrossWeight;
                                    //$scope.quantity = Number(o.quantity);
                                    isRepeat1 = true;
                                }
                            });
                            if(isRepeat1){
                                layer.msg('追踪号重复,请确认信息或更改手动添加！');
                            }else {
                                $scope.quantity = 1;
                                $scope.addlist();
                            }
                        }else if(type == 'sku'){
                            $scope.productName = res.data.list[0].productName;
                            $scope.productNameOrOrder = res.data.list[0].productName;
                            $scope.ParmsNo1 = res.data.list[0].skuOrOrderId;
                            var isRepeat2 = false;
                            console.log($scope.ParcelData)
                            $scope.ParcelData.some(function (o, i) {
                                if (o.skuOrOrderId == $scope.ParmsNos && type == o.type) {
                                    $scope.ParmsNos = o.skuOrOrderId;
                                    //$scope.estimatedTotalWeight = o.estimatedTotalWeight;
                                    $scope.estimatedTotalWeight = Number($scope.Weight * o.quantity);
                                    $scope.actualGrossWeight = o.actualGrossWeight;
                                    $scope.quantity = Number(o.quantity);
                                    isRepeat2 = true;
                                }
                            });
                            if(isRepeat2){
                                layer.msg('SKU重复,请确认信息或更改手动添加！');
                            }else {
                                $scope.quantity = 1;
                                //$scope.addlist();
                            }
                        }else if(type=='package'){
                            // $scope.orderNum = res.data.list[0].orderId;
                            // $scope.productName = res.data.list[0].productName;
                            // $scope.productNameOrOrder = res.data.list[0].orderId;
                            // $scope.ParmsNo2 = res.data.list[0].skuOrOrderId;
                            // var isRepeat1 = false;
                            // $scope.ParcelData.some(function (o, i) {
                            //     if (o.skuOrOrderId == $scope.ParmsNos && type == o.type) {
                            //         $scope.ParmsNos = o.skuOrOrderId;
                            //         //$scope.estimatedTotalWeight = o.estimatedTotalWeight;
                            //         $scope.estimatedTotalWeight = Number($scope.Weight * o.quantity);
                            //         $scope.actualGrossWeight = o.actualGrossWeight;
                            //         //$scope.quantity = Number(o.quantity);
                            //         isRepeat1 = true;
                            //     }
                            // });
                            // if(isRepeat1){
                            //     layer.msg('追踪号重复,请确认信息或更改手动添加！');
                            // }else {
                            //     $scope.quantity = 1;
                            //     $scope.addlist();
                            // }
                            $scope.productNameOrOrder = res.data.list[0].productName;
                            $scope.estimatedTotalWeight = Number(res.data.list[0].estimatedTotalWeight) / 1000;;
                            $scope.actualGrossWeight = null;
                            $scope.property = res.data.list[0].property;
                            var isRepeat = false;
                            $scope.ParcelData.some(function (o, i) {
                                if (o.skuOrOrderId == $scope.ParmsNos && type == o.type) {
                                    console.log($scope.Weight)
                                    console.log(o.quantity)
                                    $scope.productName = o.productName;
                                    $scope.ParmsNos = o.skuOrOrderId;
                                    //$scope.estimatedTotalWeight = o.estimatedTotalWeight;
                                    $scope.estimatedTotalWeight = Number($scope.Weight * o.quantity);
                                    $scope.actualGrossWeight = o.actualGrossWeight;
                                    //$scope.quantity = Number(o.quantity);
                                    console.log($scope.estimatedTotalWeight)
                                    isRepeat = true;
                                }
                            });
                            if(isRepeat){
                                layer.msg('追踪号重复,请确认信息或更改手动添加！');
                            }else {
                                $scope.quantity = 1;
                                $scope.addlist();
                            }
                        }
                    } else {
                        if(type == 'sku'){
                            layer.msg('此SKU商品信息未找到,请确认！');
                        }else if(type == 'order'){
                            layer.msg('此追踪号未找到订单信息,请确认！');
                            $scope.productName = '';
                            $scope.productNameOrOrder = '';
                            $scope.estimatedTotalWeight = null;
                            $scope.actualGrossWeight = null;
                            $scope.property = '2';
                            var isRepeat = false;
                            $scope.ParcelData.some(function (o, i) {
                                if (o.skuOrOrderId == $scope.ParmsNos && type == o.type) {
                                    console.log($scope.Weight)
                                    console.log(o.quantity)
                                    $scope.productName = o.productName;
                                    $scope.ParmsNos = o.skuOrOrderId;
                                    //$scope.estimatedTotalWeight = o.estimatedTotalWeight;
                                    $scope.estimatedTotalWeight = Number($scope.Weight * o.quantity);
                                    $scope.actualGrossWeight = o.actualGrossWeight;
                                    //$scope.quantity = Number(o.quantity);
                                    console.log($scope.estimatedTotalWeight)
                                    isRepeat = true;
                                }
                            });
                            if(isRepeat){
                                layer.msg('追踪号重复,请确认信息或更改手动添加！');
                            }else {
                                $scope.quantity = 1;
                                $scope.addlist();
                            }
                        }else if(type=='package'){
                            layer.msg('此追踪号未找到订单信息,请确认！');
                            $scope.productNameOrOrder = res.data.list[0].productName;
                            $scope.estimatedTotalWeight = Number(res.data.list[0].estimatedTotalWeight) / 1000;;
                            $scope.actualGrossWeight = null;
                            $scope.property = '2';
                            var isRepeat = false;
                            $scope.ParcelData.some(function (o, i) {
                                if (o.skuOrOrderId == $scope.ParmsNos && type == o.type) {
                                    console.log($scope.Weight)
                                    console.log(o.quantity)
                                    $scope.productName = o.productName;
                                    $scope.ParmsNos = o.skuOrOrderId;
                                    //$scope.estimatedTotalWeight = o.estimatedTotalWeight;
                                    $scope.estimatedTotalWeight = Number($scope.Weight * o.quantity);
                                    $scope.actualGrossWeight = o.actualGrossWeight;
                                    //$scope.quantity = Number(o.quantity);
                                    console.log($scope.estimatedTotalWeight)
                                    isRepeat = true;
                                }
                            });
                            if(isRepeat){
                                layer.msg('追踪号重复,请确认信息或更改手动添加！');
                            }else {
                                $scope.quantity = 1;
                                $scope.addlist();
                            }
                        }

                    }
                } else {
                    layer.msg('信息查询失败');
                }
            }, function (res) {
                layer.closeAll('loading');
                layer.msg('系统异常');
            });
        }
        //删除
        $scope.deletelist = function (item, index) {
            $scope.ParcelData.splice(index, 1);
        }
        //验证名字是否重复
        $scope.isname = function (name) {
            if($scope.isparcelName == name){
                return;
            }
            if (name) {
                erp.postFun('app/parcel/selectParcelByParcelName', {'parcelName': name}, function (n) {
                    if (n.data.code == 200) {
                        if (n.data.parcelCount > 0) {
                            layer.msg('此包裹名称已存在！')
                            $scope.parcelName = '';
                        }
                    }
                }, err)
            }
        }
        //左边添加
        $scope.addlist = function () {
            console.log($scope.ParmsNos)
            console.log($scope.parmsType)
            if(!$scope.parmsType || !$scope.ParmsNos){
                layer.msg('请用扫描枪扫描添加或手动录入后回车再点击！');
                return;
            }
            if(!$scope.quantity && $scope.parmsType == 'sku'){
                layer.msg('请填写数量！');
                return;
            }
            for (var i = 0; i < $scope.ParcelData.length; i++) {
                if ($scope.ParcelData[i].skuOrOrderId == $scope.ParmsNos && $scope.parmsType == $scope.ParcelData[i].type) {
                    $scope.ParcelData[i].productNameOrOrder = $scope.productNameOrOrder;
                    $scope.ParcelData[i].skuOrOrderId = $scope.ParmsNos;
                    $scope.ParcelData[i].estimatedTotalWeight = $scope.estimatedTotalWeight || 0;
                    $scope.ParcelData[i].actualGrossWeight = $scope.actualGrossWeight || 0;
                    $scope.ParcelData[i].type = $scope.parmsType;
                    if($scope.parmsType == 'sku'){
                        $scope.ParcelData[i].quantity = $scope.quantity ? $scope.quantity.toString() : '';
                    }else if($scope.parmsType == 'order'){
                        $scope.ParcelData[i].quantity = '1';
                    }
                    layer.msg('数据已更新');
                    $scope.reset();
                    return false;
                }
            }
            $scope.ParcelData.push({
                productName: $scope.productNameOrOrder,
                skuOrOrderId: $scope.ParmsNos,
                estimatedTotalWeight: $scope.estimatedTotalWeight || 0,
                actualGrossWeight: $scope.actualGrossWeight || 0,
                type: $scope.parmsType,
                quantity: $scope.quantity ? $scope.quantity.toString() : '',
            })
            console.log($scope.ParcelData)
            layer.msg('添加成功');
            $scope.reset();
        }
        //重置
        $scope.reset = function () {
            $scope.productName = '';
            $scope.orderNum = '';
            $scope.ParmsNo1 = '';
            $scope.ParmsNo2 = '';
            $scope.ParmsNos = '';
            $scope.estimatedTotalWeight = null;
            $scope.actualGrossWeight = null;
            $scope.quantity = null;
        }
        //保存提交
        $scope.Save = function () {
            if($scope.TypeFlag == 'add'){
                if (!$scope.DDid) {
                    layer.msg('无调度id');
                    return false;
                }
                var data = {
                    dispatcherTaskId: $scope.DDid,
                    dskName: $scope.bgName,
                    parcelUse: $scope.parcelUse,
                    remark: $scope.remark,
                    trackingNumber: $scope.trackingNumber,
                    transferNumber: $scope.transferNumber,
                    weight: $scope.transWeight,
                    list: $scope.ParcelData,
                    property:$scope.property
                }
                layer.load(2);
                erp.postFun('app/parcel/createParcel', data, function (res) {
                    layer.closeAll('loading');
                    if (res.data.statusCode == 200) {
                        layer.msg('新增包裹成功');
                        $scope.parcelName = '';
                        $scope.parcelUse = '公司库存';
                        $scope.remark = '';
                        $scope.trackingNumber = '';
                        $scope.transferNumber = '';
                        $scope.transWeight = '';
                        $scope.ParcelData = [];
                        getPercel($scope.DDid);
                        //location.href = '#/erpwarehouse/NotShipped';
                    } else {
                        layer.closeAll('loading');
                        layer.msg('新增包裹失败');
                    }
                }, function (res) {
                    layer.msg('系统异常');
                });
            }else if($scope.TypeFlag == 'edit'){
                console.log('编辑')
                console.log($scope.ParcelData)
                var data = {
                    parcelId:$scope.BGid,
                    list:$scope.ParcelData,
                    //parcelName:$scope.parcelName,
                    parcelUse:$scope.parcelUse,
                    remark:$scope.remark,
                    trackingNumber:$scope.trackingNumber,
                    transferNumber:$scope.transferNumber,
                    weight: $scope.transWeight,
                    property:$scope.property
                };
                layer.load(2);
                console.log(data)
                erp.postFun('app/parcel/updateParcelAndParcelRelation', data, function (res) {
                    layer.closeAll('loading');
                    if (res.data.statusCode == 200) {
                        layer.msg('操作成功');
                        //$scope.cancelAdd();
                        getPercel($scope.DDid);
                        //location.href = '#/erpwarehouse/NotShipped';
                    } else {
                        layer.msg('操作失败');
                    }
                }, function (res) {
                    layer.closeAll('loading');
                    layer.msg('系统错误');
                });
            }
        };
        getPercel($scope.DDid);
        //包裹数据
        $scope.ParcelDatas = [];
        function getPercel(id) {
            erp.postFun('app/dispatcherTask/selectParcelListOfDispatcherTaskId', {'dispatcherTaskId': id}, function (n) {
                if (n.data.code == 200) {
                    $scope.ParcelDatas = n.data.list;
                    console.log( $scope.ParcelDatas)
                    if($scope.TypeFlag == 'edit'){
                        $scope.ParcelData = [];
                        $scope.ParcelDatas.forEach(function (o,i) {
                            if(o.id == $scope.BGid){
                                $scope.isparcelName = o.parcelName;
                                $scope.parcelName = o.parcelName;
                                $scope.parcelUse = o.parcelUse;
                                $scope.remark = o.remark;
                                $scope.trackingNumber = o.trackingNumber;
                                $scope.transferNumber = o.transferNumber;
                                $scope.transWeight = o.weight;
                                $scope.property = o.property;
                                o.parcelRelationList.forEach(function (k,j) {
                                    $scope.ParcelData.push({
                                        productName: k.productName,
                                        skuOrOrderId: k.skuOrOrderId,
                                        estimatedTotalWeight: k.estimated_total_weight || 0,
                                        actualGrossWeight: k.actual_gross_weight || 0,
                                        quantity: k.quantity ? k.quantity.toString() : '',
                                        type: k.type,
                                    })
                                })
                            }
                        })
                    }
                }
            }, err)
        }
        //包裹点击
        $scope.isAddBG = false;
        $scope.BGclick = function (item) {
            console.log(item)
            if($scope.TypeFlag == 'add'){
                return;
            }
            $scope.BGid = item.id;
            $scope.parcelName = item.parcelName;
            $scope.parcelUse = item.parcelUse;
            $scope.remark = item.remark;
            $scope.trackingNumber = item.trackingNumber;
            $scope.transferNumber = item.transferNumber;
            $scope.transWeight = item.weight || 0;
            $scope.property = item.property;
            $scope.ParcelData = [];
            item.parcelRelationList.forEach(function (o,i) {
                $scope.ParcelData.push({
                    productName: o.productName,
                    skuOrOrderId: o.skuOrOrderId,
                    estimatedTotalWeight: o.estimated_total_weight || 0,
                    actualGrossWeight: o.actual_gross_weight || 0,
                    quantity: o.quantity ? o.quantity.toString() : '',
                    type: o.type,
                })
            })
            console.log($scope.ParcelData)
        };
        //计算重量
        $scope.Calculation = function () {
            if($scope.quantity == 0){
                $scope.quantity = 1;
            }
            $scope.estimatedTotalWeight = Number($scope.quantity * $scope.Weight).toFixed(2);
        }
    }]);
    function err(error) {
        console.log(error);
        layer.closeAll('loading');
    }
})();
