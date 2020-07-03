;~function () {
    let app = angular.module('warehouse-app');
    //未发货
    app.controller('NotShippedCtrl', ['$scope', "erp", '$location','$timeout', function ($scope, erp, $location,$timeout) {
        $scope.pagesize1 = '20';
        $scope.inputTxt = '';
        $scope.pagenum1 = 1;
        $scope.ChildData = [];
        var lang = localStorage.getItem('lang');
        console.log(lang)
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
            {name: '中通'},
            {name: '宝来空派'},
            {name: '南风空派'},
            {name: 'Hecny Transportion'},
            {name: '双清全包海运'},
            {name: '优速'},
	          {name: 'Kerryexpress'},
	          {name: '泰国其他'},
        ]
        $scope.forwarderName = '';
        $scope.Percellist = [
            {name: '乌拉圭库存'},
            {name: '美国专线'},
            {name: '销售库存'},
            {name: '公司库存'},
        ];
        $scope.SelectType = 'trackingNumber';
        $scope.places = '关键字查询';
        $scope.places = lang == 'cn' ? '关键字查询' : 'Keyword query';

        //差仓位
        function getcangweiList() {
            $scope.cangweilist = erp
                .getStorage()
                .map(_ => ({
                    id: _.dataId,
                    storageName: _.dataName
                }));
            $scope.originalWarehouseId = 'bc228e33b02a4c03b46b186994eb6eb3' // 原始仓默认义乌仓
            $scope.arrivedWarehouseId = '201e67f6ba4644c0a36d63bf4989dd70' // 到达仓默认美东新泽西仓
        }

        getcangweiList();
        //
        $scope.selectChange = function (n) {
            console.log($scope.originalWarehouseId)
            console.log($scope.arrivedWarehouseId)
            if ($scope.originalWarehouseId && $scope.arrivedWarehouseId) {
                if ($scope.originalWarehouseId == $scope.arrivedWarehouseId) {
                    layer.msg('原始仓与到达仓不可一样');
                    if (n == '1') {
                        $scope.originalWarehouseId = ''
                    } else {
                        $scope.arrivedWarehouseId = ''
                    }
                }
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

        //差列表
        function getWareList(idxs) {
            console.log(idxs)
            $scope.datalist = [];
            var data = {
                storageId:$scope.storageId,
                type: $scope.SelectType,
                inputTxt: $scope.inputTxt,
                shippingStatus: '9',
                pageSize: $scope.pagesize1,
                pageNum: $scope.pagenum1,
            }
            layer.load(2)
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
        //
        $scope.gopercel = function (id) {
            window.open('#/erpwarehouse/ScheduledAdd/' + id)
        }
        //
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
        //
        $scope.TRclick = function (index, item) {
            $scope.focus = index;
        }
        /*调度*/
        $scope.addpackage = function () {
            this.addFlag = true;
            $scope.selectedItem = '';
            adddiaodu();
        }
        function adddiaodu() {
            /*   var data = {
                   trackingNumber: '',
                   shippingStatus: '9',
                   pageSize: '10000',
                   pageNum: 1,
               }*/
            erp.postFun('app/dispatcherTask/getDispatcherTaskOfNotYetShippedList', null, function (data) {
                if (data.data.code == 200) {
                    $scope.Diaodulist = data.data.list;
                } else {
                    if(lang == 'cn'){
                        layer.msg('获取失败');
                    }else {
                        layer.msg('Acquisition failed');
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
        //新增调度
        $scope.addDiaodu = function () {
            getcangweiList();
            $scope.addschFlag = true;
            $scope.type = 'add';
            $scope.forwarderName = ''
            $scope.dispatcherTaskName = '';
            $scope.trackingNumber = '';
            $scope.transferNumber = '';
            //$scope.estimatedDeliveryTime = '';
            $scope.remark = '';
        }
        //新增包裹
        $scope.TRdbclick = function (DDid, name,arrivalDiQu) {
            location.href = '#/erpwarehouse/addPackage/' + DDid + '//' + name + '/' + 'add'+'/'+arrivalDiQu;
        }
        //调度
        $scope.editWare = function (item) {
            console.log(item)
            $scope.addschFlag = true;
            $scope.type = 'edit';
            $scope.itemData = item;
            $scope.originalWarehouseId = item.originalWarehouseId;
            $scope.arrivedWarehouseId = item.arrivedWarehouseId;
            $scope.dispatcherTaskName = item.dispatcherTaskName;
            $scope.trackingNumber = item.trackingNumber;
            $scope.forwarderName = item.forwarderName;
            $scope.transferNumber = item.transferNumber;
            //$scope.estimatedDeliveryTime = item.estimatedDeliveryTime;
            $scope.remark = item.remark;
        }
        $scope.add = function () {
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
            }else {
                var data = {
                    originalWarehouseId: $scope.originalWarehouseId,
                    arrivedWarehouseId: $scope.arrivedWarehouseId,
                    //dispatcherTaskName: $scope.dispatcherTaskName,
                    trackingNumber: $scope.trackingNumber,
                    forwarderName: $scope.forwarderName,
                    transferNumber: $scope.transferNumber,
                    //estimatedDeliveryTime: $scope.estimatedDeliveryTime,
                    remark: $scope.remark,
                };
                console.log(data)
                console.log($scope.arrivedWarehouseId)
                if ($scope.type == 'add') {
                    erp.postFun('app/dispatcherTask/createDispatcherTask', data, function (data) {
                        console.log(data);
                        if (data.data.statusCode == 'CODE_200') {
                            if(lang == 'cn'){
                                layer.msg('新增成功');
                            }else {
                                layer.msg('added successfully');
                            }
                            var arrivalTarget;
                            if($scope.arrivedWarehouseId=='201e67f6ba4644c0a36d63bf4989dd70'){
                                arrivalTarget = '美国东'
                            }else if($scope.arrivedWarehouseId=='738A09F1-2834-43CC-85A8-2FE5610C2599'){
                                arrivalTarget = '美国西'
                            }else if($scope.arrivedWarehouseId=='85742FBC-38D7-4DC4-9496-296186FFEED8'){
                                arrivalTarget = '深圳仓'
                            }else if($scope.arrivedWarehouseId=='{6709CCD7-0DC7-43B1-B310-17AB499E9B0A}'){
                                arrivalTarget = '义乌仓'
                            }
                            console.log(arrivalTarget)
                            $scope.addschFlag = false;
                            location.href = '#/erpwarehouse/addPackage/' + data.data.id + '//' + data.data.dispatcherTaskName + '/' + 'add'+'/'+arrivalTarget;
                            getWareList();
                            //adddiaodu();
                        } else {
                            if(lang == 'cn'){
                                layer.msg('新增失败');
                            }else {
                                layer.msg('New failure');
                            }
                        }
                    }, function (data) {
                        if(lang == 'cn'){
                            layer.msg('系统异常')
                        }else {
                            layer.msg('System exception');
                        }
                    })
                } else if ($scope.type == 'edit') {
                    data.id = $scope.itemData.id;
	                  data.isReady = $scope.itemData.isReady && $scope.itemData.isReady.toString();
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
                                layer.msg('Edit failed');
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
        /*包裹编辑*/
        $scope.editperIem = function (DDid, name, BGid) {
            location.href = '#/erpwarehouse/addPackage/' + DDid + '/' + BGid + '/' + name + '/' + 'edit';
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
        //确认发货
        $scope.confahuo = function (item) {
            $scope.confahuolag = true;
            $scope.goconfahuolag = function () {
                erp.postFun('app/dispatcherTask/updateDisPatcherTask', {
                    id: item.id,
                    shippingStatus: '10'
                }, function (data) {
                    console.log(data);
                    if (data.data.statusCode == 200) {
                        if(lang == 'cn'){
                            layer.msg('操作成功');
                        }else {
                            layer.msg('Successful operation');
                        }
                        getWareList();
                        $scope.confahuolag = false;
                    } else {
                        if(lang == 'cn'){
                            layer.msg('操作失败');
                        }else {
                            layer.msg('operation failed');
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
                }else {
                    layer.msg('Error page number');
                }
                $(".goyema").val(1)
            } else {
                getWareList();
            }
        }
        $scope.upLoadFun = function(item,stu){
            $scope.upLoadFlag = true;
            console.log(stu)
            $scope.itemStu = stu;
            if($scope.itemStu=='diaodu'){
                $scope.itemId = item.id;
            }else{
                $scope.itemId = item.id;
            }

            console.log(item)

        }
        $scope.closeUpLoadFun = function(){
            $scope.upLoadFlag = false;
            $scope.lrHref = '';
        }
        $scope.sureUpLoadFun = function(){
            erp.load();
            var postUrlLink;
            var upJson = {};
            console.log($scope.itemStu)
            if($scope.itemStu=='diaodu'){
                postUrlLink='app/dispatcherTask/updateDisPatcherTask'
                upJson.id = $scope.itemId;
            }else{
                postUrlLink='app/parcel/updateParcel'
                upJson.parcelId = $scope.itemId;
            }
            upJson.fileUrl = $scope.lrHref;
            erp.postFun(postUrlLink,JSON.stringify(upJson),function(data){
                console.log(data)
                erp.closeLoad()
                if (data.data.statusCode==200) {
                    $scope.upLoadFlag = false;
                    $scope.lrHref = '';
                    getWareList();
                } else {
                    layer.msg('添加失败')
                }
            },function(data){
                console.log(data)
                erp.closeLoad()
            })
        }
        $scope.upLoadImg4 = function (files) {
            erp.ossUploadFile($('#file')[0].files, function (data) {
                console.log(data)
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
	            console.log(fileName)
	            $scope.lrHref = result[0];
	            $('#file').val('')
	            console.log(result)
	            console.log($scope.lrHref)
	            $scope.$apply();
            })
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
	
	    // 导出报关文件
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
