;~function () {
    let app = angular.module('warehouse-app');
    //已发货
    app.controller('InDeliveryCtrl', ['$scope', "erp", '$location','$timeout', function ($scope, erp, $location,$timeout) {
        $scope.pagesize1 = '20';
        $scope.pagenum1 = 1;
        $scope.isconfirm = false;
        $scope.percelData = [];//包裹数据
        $scope.SelectType = 'trackingNumber';
        var lang = localStorage.getItem('lang');
        console.log(lang)
        $('.qs-link').removeClass('qs-act')
        $('.qs-link').eq(0).addClass('qs-act');
        $scope.forwardData = [
            {name: '义乌UPS红单'},
            {name: '官方DHL美国账号'},
            {name: '官方DHL中国账号'},
            {name: '顺丰官方账号'},
            {name: '联邦'},
            {name: 'DHL'},
            {name: 'UPS'},
            {name: '海运'},
            {name: '圆通'},
            {name: '顺丰'},
	          {name: '百世快运'},
	          {name: 'Kerryexpress'},
	          {name: '泰国其他'},
        ]
        $scope.Percellist = [
            {name: '乌拉圭库存'},
            {name: '美国专线'},
            {name: '销售库存'},
            {name: '公司库存'},
        ];
        $scope.places = lang == 'cn' ? '关键字查询' : 'Keyword query';
        $scope.SelectChanges = function () {
            if ($scope.SelectType == 'estimatedDeliveryTime') {
                $scope.places = lang == 'cn' ? '追踪号查询' : 'Tracking number query';
            } else if ($scope.SelectType == 'estimatedArrivalTime') {
                $scope.places = lang == 'cn' ? '追踪号查询' : 'Tracking number query';
            } else {
                $scope.places = lang == 'cn' ? '关键字查询' : 'Keyword query';
            }
        }

        // 仓库原始仓
        const warehouseList = angular.copy(window.warehouseList)
        $scope.storageCallback = function({ item }){
            $scope.storageId = undefined
            if(!!item){
                const obj = warehouseList.find(_ => _.store == item.dataId)
                $scope.storageId = (obj && obj.id) || item.dataId
            }
            getWareList()
        }
        
        function getWareList(idxs) {
            console.log(idxs)
            if ($scope.SelectType == 'estimatedDeliveryTime') {
                $scope.beginTime = $('#cateDedate').val();
                $scope.endTime = $('#endDadate').val();
            } else if ($scope.SelectType == 'estimatedArrivalTime') {
                $scope.beginTime = $('#cateArDate').val();
                $scope.endTime = $('#endArdate').val();
            } else {
                $scope.beginTime = '';
                $scope.endTime = '';
            }
            $scope.datalist = [];
            var data = {
                storageId:$scope.storageId,
                beginTime: $scope.beginTime,
                endTime: $scope.endTime,
                type: $scope.SelectType,
                inputTxt: $scope.inputTxt,
                shippingStatus: '10',
                pageSize: $scope.pagesize1,
                pageNum: $scope.pagenum1,
            }
            layer.load(2);
            erp.postFun('app/dispatcherTask/selectDispatcherTaskList', data, function (data) {
                layer.closeAll('loading');
                if (data.data.code == 200) {
	                  $scope.checkedAll = false
	                  if ($scope.inputTxt) {
                        data.data.list.forEach(function (o, i) {
                            o.isChild = true;
                            o.rowsNum = o.disparcherParcelList.length > 1? o.disparcherParcelList.length+1:0;
                        })
                    } else {
                        data.data.list.forEach(function (o, i) {
                            o.isChild = false;
                            o.rowsNum = o.disparcherParcelList.length > 1? o.disparcherParcelList.length+1:0;
                        })
                    }
                    $scope.datalist = data.data.list;
                    if (idxs != undefined) {
                        if ($scope.datalist[idxs].disparcherParcelList.length > 0) {
                            $scope.datalist[idxs].isChild = true;
                        }
                    }
                    console.log($scope.datalist)
                    $scope.totalpage1 = function () {
                        return Math.ceil(data.data.totalNum / $scope.pagesize1)
                    }
                    $scope.totalNum1 = data.data.totalNum;
                    pageFun1();
                } else {
                    if(lang == 'cn'){
                        layer.msg('获取列表失败');
                    }else {
                        layer.msg('Failed to get list');
                    }
                }
            }, function (data) {
                layer.closeAll('loading');
                if(lang == 'cn'){
                    layer.msg('系统异常')
                }else {
                    layer.msg('System exception');
                }
            })
        }

        // getWareList();
        $scope.rowfun = function (item) {
            if (item == 1) {
                return 0;
            } else {
                return item;
            }
        }
        //差仓位
        function getcangweiList() {
            $scope.cangweilist = [];
            erp.postFun('app/dispatcherTask/selectStorageList', {}, function (data) {
                console.log(data);
                if (data.data.code == 200) {
                    $scope.cangweilist = data.data.list;
                    $scope.originalWarehouseId = $scope.cangweilist[2].ID;
                    $scope.arrivedWarehouseId = $scope.cangweilist[0].ID;
                    console.log($scope.cangweilist)
                    console.log($scope.originalWarehouseId)
                } else {
                    if(lang == 'cn'){
                        layer.msg('查询失败')
                    }else {
                        layer.msg('Query failed');
                    }
                }
            }, function (data) {
                if(lang == 'cn'){
                    layer.msg('系统异常')
                }else {
                    layer.msg('System exception');
                }
            })
        }

        getcangweiList();
        //isShowChild
        $scope.isShowChild = function (item, idx) {
            if (item.disparcherParcelList.length > 0) {
                item.isChild = !item.isChild;
                //getChild(item.id, item, idx);
            } else {
                if(lang == 'cn'){
                    layer.msg('暂无包裹数据！');
                }else {
                    layer.msg('No parcel data');
                }
            }
        }
        $scope.gopercel = function (id) {
            window.open('#/erpwarehouse/ScheduledAdd/' + id)
            //window.open('#/erpwarehouse/ScheduledAdd/'+id)
        }
        $scope.TRclick = function (index, item) {
            $scope.focus = index;
        }
        //
        $scope.selectChange = function (n) {
            console.log($scope.originalWarehouseId)
            console.log($scope.arrivedWarehouseId)
            if ($scope.originalWarehouseId && $scope.arrivedWarehouseId) {
                if ($scope.originalWarehouseId == $scope.arrivedWarehouseId) {
                    if(lang == 'cn'){
                        layer.msg('原始仓与到达仓不可一样');
                    }else {
                        layer.msg('The original warehouse is not the same as the arrival warehouse.');
                    }
                    if (n == '1') {
                        $scope.originalWarehouseId = ''
                    } else {
                        $scope.arrivedWarehouseId = ''
                    }
                }
            }
        }
        //编辑
        $scope.editbg = function (item) {
            $scope.addschFlag = true;
            $scope.itemData = item;
            $scope.originalWarehouseId = item.originalWarehouseId;
            $scope.arrivedWarehouseId = item.arrivedWarehouseId;
            $scope.dispatcherTaskName = item.dispatcherTaskName;
            $scope.trackingNumber = item.trackingNumber;
            $scope.forwarderName = item.forwarderName;
            $scope.transferNumber = item.transferNumber;
            //$scope.estimatedDeliveryTime = item.estimatedDeliveryTime;
            $scope.remark = item.remark;
            $scope.editClick = function () {
                if (!$scope.originalWarehouseId) {
                    if(lang == 'cn'){
                        layer.msg('请选择原始仓');
                    }else {
                        layer.msg('Please select the original warehouse');
                    }
                } else if (!$scope.arrivedWarehouseId) {
                    if(lang == 'cn'){
                        layer.msg('请选择到达仓');
                    }else {
                        layer.msg('Please choose to arrive at the warehouse');
                    }
                }else if (!$scope.trackingNumber) {
                    if(lang == 'cn'){
                        layer.msg('请填写追踪号');
                    }else {
                        layer.msg('Please fill in the tracking number');
                    }
                } else {
                    var data = {
                        originalWarehouseId: $scope.originalWarehouseId,
                        arrivedWarehouseId: $scope.arrivedWarehouseId,
                        //dispatcherTaskName: $scope.dispatcherTaskName,
                        trackingNumber: $scope.trackingNumber,
                        forwarderName: $scope.forwarderName,
                        transferNumber: $scope.transferNumber,
                        //estimatedDeliveryTime: $scope.estimatedDeliveryTime,
                        remark: $scope.remark,
                        id: item.id,
	                      isReady: item.isReady && item.isReady.toString()
                    };
                    erp.postFun('app/dispatcherTask/updateDisPatcherTask', data, function (data) {
                        console.log(data);
                        if (data.data.statusCode == 200) {
                            if(lang == 'cn'){
                                layer.msg('编辑成功');
                            }else {
                                layer.msg('Successful editing');
                            }
                            $scope.addschFlag = false;
                            getWareList();
                        } else {
                            if(lang == 'cn'){
                                layer.msg('编辑失败');
                            }else {
                                layer.msg('Successful editing');
                            }
                        }
                    }, function (data) {
                        if(lang == 'cn'){
                            layer.msg('系统异常')
                        }else {
                            layer.msg('System exception');
                        }
                    })
                }
            }
        }
        //删除
        $scope.deleteWare = function (item, type, idx) {
            $scope.deleteWareFlag = true;
            $scope.goDelete = function () {
                if (type == 'DD') {
                    erp.postFun('app/dispatcherTask/addDeleteFlagByDispatcherTaskId', {dispatcherTaskId: item.id}, function (data) {
                        console.log(data);
                        if (data.data.statusCode == 200) {
                            if(lang == 'cn'){
                                layer.msg('删除成功');
                            }else {
                                layer.msg('successfully deleted');
                            }
                            getWareList();
                            $scope.deleteWareFlag = false;
                        } else {
                            if(lang == 'cn'){
                                layer.msg('删除失败');
                            }else {
                                layer.msg('failed to delete');
                            }
                        }
                    }, function (data) {
                        if(lang == 'cn'){
                            layer.msg('系统异常')
                        }else {
                            layer.msg('System exception');
                        }
                    })
                } else if (type == 'BG') {
                    erp.postFun('app/parcel/addDeleteFlagByParcelId', {parcelId: item.id}, function (data) {
                        console.log(data);
                        if (data.data.code == 200) {
                            if(lang == 'cn'){
                                layer.msg('删除成功');
                            }else {
                                layer.msg('successfully deleted');
                            }
                            getWareList(idx);
                            $scope.deleteWareFlag = false;
                        } else {
                            if(lang == 'cn'){
                                layer.msg('删除失败');
                            }else {
                                layer.msg('failed to delete');
                            }
                        }
                    }, function (data) {
                        if(lang == 'cn'){
                            layer.msg('系统异常')
                        }else {
                            layer.msg('System exception');
                        }
                    })
                }
            }
        }
        /*包裹*/
        $scope.editperIem = function (DDid, name, BGid) {
            location.href = '#/erpwarehouse/addPackage/' + DDid + '/' + BGid + '/' + name + '/' + 'edit';
        }
        $scope.Search = function () {
            $scope.pagenum1 = 1;
            getWareList();
        };
        $scope.enterSearch = function (e) {
            if (e.keyCode == 13) {
                $scope.pagenum1 = 1;
                getWareList();
            }
        }
        //收货
        $scope.FPWare = function (item, type, idx, items) {
            $scope.shouhuolag = true;
            $scope.confshou = function () {
                if (type == 'all') {
                    erp.postFun('app/dispatcherTask/confirmReceiptFOrDispatcherTask', {dispatcherTaskId: item.id}, function (data) {
                        console.log(data);
                        if (data.data.statusCode == 200) {
                            if(lang == 'cn'){
                                layer.msg('确认成功');
                            }else {
                                layer.msg('Confirmed success');
                            }
                            $scope.shouhuolag = false;
                            getWareList(idx);
                        }else {
                            if(lang == 'cn'){
                                layer.msg('确认失败');
                            }else {
                                layer.msg('Confirmation failure');
                            }
                        }
                    }, function (data) {
                        if(lang == 'cn'){
                            layer.msg('系统异常')
                        }else {
                            layer.msg('System exception');
                        }
                    })
                } else if (type == 'cld') {
                    console.log(item)
                    var list = [];
                    list.push(item.id)
                    erp.postFun('app/dispatcherTask/confirmReceiptFOrParcel', {
                        dispatcherTaskId: items.id,
                        list: list
                    }, function (data) {
                        console.log(data);
                        if (data.data.statusCode == 200) {
                            if(lang == 'cn'){
                                layer.msg('确认成功');
                            }else {
                                layer.msg('Confirmed success');
                            }
                            $scope.shouhuolag = false;
                            getWareList(idx);
                        }else {
                            if(lang == 'cn'){
                                layer.msg('确认失败');
                            }else {
                                layer.msg('Confirmation failure');
                            }
                        }
                    }, function (data) {
                        if(lang == 'cn'){
                            layer.msg('系统异常')
                        }else {
                            layer.msg('System exception');
                        }
                    })
                }
            }
        }
        //
        $scope.upTransfer = function (item) {
            var data = {
                id: item.id,
                transferNumber: $scope.transferNum[5]
            }
            erp.postFun('app/dispatcherTask/updateDisPatcherTask', data, function (data) {
                console.log(data);
                if (data.data.statusCode == 200) {
                    if(lang == 'cn'){
                        layer.msg('添加成功');
                    }else {
                        layer.msg('Added successfully');
                    }
                    $scope.isclick = false;
                    getWareList();
                } else {
                    if(lang == 'cn'){
                        layer.msg('添加失败');
                    }else {
                        layer.msg('add failed');
                    }
                }
            }, function (data) {
                if(lang == 'cn'){
                    layer.msg('系统异常')
                }else {
                    layer.msg('System exception');
                }
            })
        }
        //查看详情
        $scope.LookDetail = function (item) {
            var data = {
                parcelId:item.id
            };
            $scope.SkuList = [];
            erp.postFun('app/dispatcherTask/selectParcelRelationList', data, function (n) {
                if (n.data.code == 200) {
                    $scope.SkuList = n.data.list;
                }
                if($scope.SkuList.length>0){
                    $scope.isLook = true;
                }else {
                    if(lang == 'cn'){
                        layer.msg('暂无数据')
                    }else {
                        layer.msg('No data');
                    }
                }
            }, err)
        }
        //导出Excel
        $scope.ExportEXcel = function (item) {
            console.log(item);
            erp.load(2);
            erp.postFun('app/parcel/exportErpParcel', {parcelId:item.id}, function (data) {
                console.log(data);
                layer.closeAll('loading');
                $scope.ExcelUrl = data.data.href;
                if($scope.ExcelUrl){
                    $timeout(function () {
                        document.getElementById("Excel").click();
                    },0)
                }
            }, function (data) {
                if(lang == 'cn'){
                    layer.msg('系统异常')
                }else {
                    layer.msg('System exception');
                }
            })
        }
        //导出报关信息
        $scope.exportProduct = function(item,type){
            var data = {
                id:item.id,
                type:type
            }

            const load = layer.load(0)
            erp.loadDown({
                url:'erp/dispatchTask/exportParcelOfOrderProduct',
                params: data,
                callback:function(){
                    layer.close(load)
                },
                fileName:'csv'
            })
        }
        //打印包裹编号
        $scope.printBg = function (item) {
            erp.load(2)
            erp.postFun('app/parcel/printBarCodeOfParcel', {parcelNumber: item.parcelName}, function (data) {
                layer.closeAll('loading');
                if (data.data.code == 200) {
                    var url = 'https://' + data.data.href[0];
                    window.open(url)
                    //PrintCode(url)
                }
            }, function (res) {

            })
        }
        //分页1
        function pageFun1() {
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.totalNum1 || 1,
                pageSize: $scope.pagesize1 * 1,
                visiblePages: 5,
                currentPage: $scope.pagenum1 * 1,
                activeClass: 'current',
                first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
                prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
                next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
                last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
                page: '<a href="javascript:void(0);">{{page}}<\/a>',
                onPageChange: function (n, type) {
                    if (type == 'init') {
                        return;
                    }
                    $scope.pagenum1 = n;
                    getWareList();
                }
            });
        }

        $scope.pagechange1 = function (pagesize) {
            console.log(pagesize)
            $scope.pagenum1 = 1;
            getWareList();
        }
        $scope.pagenumchange1 = function () {
            console.log($scope.pagenum1 % 1)
            $scope.pagenum1 = $(".goyema").val() - 0;
            if ($scope.pagenum1 < 1 || $scope.pagenum1 > $scope.totalpage1()) {
                if(lang == 'cn'){
	                layer.msg('错误页码');
                } else {
	                layer.msg('Error page number');
                }
	            $(".goyema").val(1)
            } else {
	            getWareList();
            }
        }
	
	    // 全选
	    $scope.handleCheckAll = () => {
		    $scope.checkedAll = !$scope.checkedAll
		    $scope.datalist = $scope.datalist.map(o => {
			    o = { ...o, checked: $scope.checkedAll }
			    o.disparcherParcelList.forEach(i => i.packageChecked = $scope.checkedAll)
			    return o
		    })
	    }
	
	    // 单选 - 调度
	    $scope.handleCheckDispatch = item => {
		    item.checked = !item.checked
		    item.disparcherParcelList = item.disparcherParcelList.map(o => ({ ...o, packageChecked: item.checked }))
		    $scope.checkedAll = !$scope.datalist.find(o => !o.checked)
	    }
	
	    // 单选 - 包裹
	    $scope.handleCheckPackage = (item, itemc) => {
		    itemc.packageChecked = !itemc.packageChecked
		    item.checked = !item.disparcherParcelList.find(o => !o.packageChecked)
		    $scope.checkedAll = !$scope.datalist.find(o => !o.checked)
	    }
	
	    // 导出报关清单
	    $scope.handleExportList = type => {
		    let packageCheckedList = []
		    $scope.datalist.forEach(o => packageCheckedList = [...packageCheckedList, ...o.disparcherParcelList.filter(i => i.packageChecked).map(i => i.id)])
		    if (packageCheckedList.length === 0) {
			    layer.msg('请选择带包裹的调度任务或者包裹')
			    return
		    }
		    const load = layer.load(0)
		    erp.loadDown({
			    url: 'erp/dispatchTask/exportDeclarationList',
			    params: {
				    dispatchIdList: packageCheckedList,
				    type
			    },
			    callback: function () {
				    layer.close(load)
			    },
		    })
	    }
	
	    // 导出清关文件
	    $scope.handleExportCusList = () => {
		    let packageCheckedList = []
		    $scope.datalist.forEach(o => packageCheckedList = [...packageCheckedList, ...o.disparcherParcelList.filter(i => i.packageChecked).map(i => i.id)])
		    if (packageCheckedList.length === 0) {
			    layer.msg('请选择带包裹的调度任务或者包裹')
			    return
		    }
		    const load = layer.load(0)
		    erp.loadDown({
			    url: 'erp/dispatchTask/exportManifestFileList',
			    params: { dispatchIdList: packageCheckedList },
			    callback: function () {
				    layer.close(load)
			    },
		    })
	    }
	    
    }])
    
    function err(error) {
        console.log(error);
        layer.closeAll('loading');
    }
}();
