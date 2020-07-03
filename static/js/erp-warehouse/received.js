;~function () {
    let app = angular.module('warehouse-app');

    //已收货
    app.controller('ReceivedCtrl', ['$scope', "erp", '$location','$timeout', function ($scope, erp, $location,$timeout) {
        $scope.pagesize1 = '20';
        $scope.pagenum1 = 1;
        $scope.percelData = [];//所有包裹数据
        $scope.percelList = [];//单个包裹数据
        $scope.SelectType = 'trackingNumber';
        var lang = localStorage.getItem('lang');
        $('.qs-link').removeClass('qs-act')
        $('.qs-link').eq(1).addClass('qs-act');
        console.log(lang)
        $scope.places = lang == 'cn' ? '关键字查询' : 'Keyword query';
        $scope.gopercel = function (id) {
            window.open('#/erpwarehouse/ScheduledAdd/' + id)
        }
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

        function getWareList() {
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
                shippingStatus: '11',
                pageSize: $scope.pagesize1,
                pageNum: $scope.pagenum1,
            }
            layer.load(2);
            erp.postFun('app/dispatcherTask/selectDispatcherTaskList', data, function (data) {
                console.log(data);
                layer.closeAll("loading");
                if (data.data.code == 200) {
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
                layer.closeAll("loading");
                if(lang == 'cn'){
                    layer.msg('系统异常')
                }else {
                    layer.msg('System exception');
                }
            })
        }

        // getWareList();
        $scope.TRclick = function (index, item) {
            $scope.focus = index;
        }
        $scope.TRclick1 = function (index, item) {
            $scope.focus1 = index;
        }
        //确认完成
        $scope.FPWare = function (item) {
            $scope.addWareFlag = true;
            $scope.itemData = item;
        }
        $scope.confirm = function () {
            var data = {
                id: $scope.itemData.id,
                shippingStatus: '12',
            }
            erp.postFun('app/dispatcherTask/updateDispatcherTaskOfshippingStatus', data, function (data) {
                console.log(data);
                if (data.data.statusCode == 200) {
                    $scope.addWareFlag = false;
                    getWareList();
                    if(lang == 'cn'){
                        layer.msg('确认成功');
                    }else {
                        layer.msg('Confirmed success');
                    }
                } else {
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
        //查验包裹
        $scope.lookbg = function (item) {
            $scope.lookbgFlag = true;
            $scope.percelCode = '';
            $scope.percelList = [];
            $scope.percelId = item.id;
            setTimeout(function () {
                document.getElementById("codeinput").focus();
            }, 300);
            erp.postFun('app/dispatcherTask/selectParcelRelevanceListOfDispatcherTask', {dispatcherTaskId: item.id}, function (data) {
                if (data.data.code == 200) {
                    console.log(data)
                    $scope.percelData = data.data.list;

                } else {
                    if(lang == 'cn'){
                        layer.msg('查询包裹失败');
                    }else {
                        layer.msg('Query package failed');
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
        $scope.getProData = function () {
            console.log($scope.percelCode);
            $scope.percelList = [];
            for (var i = 0; i < $scope.percelData.length; i++) {
                for (var j = 0; j < $scope.percelData[i].length; j++) {
                    if ($scope.percelCode == $scope.percelData[i][j].skuOrOrderId) {
                        $scope.percelList.push($scope.percelData[i]);
                    }
                }
            }
            console.log($scope.percelList)
            if ($scope.percelList.length == 0) {
                if(lang == 'cn'){
                    layer.msg('未找到此SKU或订单号的商品')
                }else {
                    layer.msg('Item not found for this SKU or order number');
                }
            } else if ($scope.percelList.length > 1) {
                if(lang == 'cn'){
                    layer.msg('有多个包裹拥有此商品')
                }else {
                    layer.msg('There are multiple packages with this item');
                }
                var arr = [];
                $scope.percelList.forEach(function (o, i) {
                    o.forEach(function (j, l) {
                        j.isres = false;
                        if ($scope.percelCode == j.skuOrOrderId) {
                            arr.push(j)
                        }
                    })
                })
                console.log(arr)
                $scope.percelList = arr;
                $scope.$apply();
            } else if ($scope.percelList.length == 1) {
                $scope.percelList[0].forEach(function (o, i) {
                    if (o.skuOrOrderId == $scope.percelCode) {
                        $scope.parcelRelevanceId = o.id;
                        $scope.quantityIncoming = o.quantity;
                    }
                })
                var data = {
                    parcelRelevanceId: $scope.parcelRelevanceId,
                    quantityIncoming: $scope.quantityIncoming
                }
                console.log($scope.percelList)
                erp.postFun('app/dispatcherTask/updateQuantityIncomingByParcelRelevanceId', data, function (data) {
                    console.log(data);
                    if (data.data.statusCode == 200) {
                        if(lang == 'cn'){
                            layer.msg('查验成功');
                        }else {
                            layer.msg('Successful inspection');
                        }
                        console.log($scope.percelList[0])
                        var a = [];
                        var b = [];
                        $scope.percelList[0].forEach(function (o, i) {
                            o.ishov = false;
                            if (o.skuOrOrderId == $scope.percelCode) {
                                o.quantityIncoming = o.quantity;
                            }
                            if (o.quantityIncoming) {
                                b.push(o);
                            } else {
                                a.push(o)
                            }
                        })
                        $scope.percelList = a.concat(b);
                        $scope.percelCode = '';
                        //$scope.$apply();
                    } else {
                        if(lang == 'cn'){
                            layer.msg('查验失败');
                        }else {
                            layer.msg('Check failure');
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
        $('#codeinput').keypress(function (e) {
            if (e.which == 13) {

                $scope.getProData();
            }
        });
        $('#codeinput').blur(function () {
            if ($scope.percelCode) {
                $scope.getProData();
            }
        });
        //
        $scope.actinput = function (item) {
            console.log(item)
            if (item.quantityIncoming > item.quantity) {
                item.quantityIncoming = item.quantity;
            }
            if (item.quantityIncoming < 1) {
                item.quantityIncoming = 1;
            }
            erp.postFun('app/dispatcherTask/updateQuantityIncomingByParcelRelevanceId', {
                parcelRelevanceId: item.id,
                quantityIncoming: item.quantityIncoming
            }, function (data) {
                if (data.data.statusCode == 200) {
                    if(lang == 'cn'){
                        layer.msg('修改成功');
                    }else {
                        layer.msg('Successfully modified');
                    }
                } else {
                    if(lang == 'cn'){
                        layer.msg('修改失败');
                    }else {
                        layer.msg('fail to edit');
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
        //
        $scope.mouseen = function (item) {
            if (item.quantityIncoming == 0) {
                item.ishov = !item.ishov;
            }
        }
        //确认收货
        $scope.confWare = function (item) {
            //$scope.confFlag = true;
            erp.postFun('app/dispatcherTask/updateQuantityIncomingByParcelRelevanceId', {
                parcelRelevanceId: item.id,
                quantityIncoming: item.quantity
            }, function (data) {
                if (data.data.statusCode == 200) {
                    item.quantityIncoming = item.quantity;
                    item.ishov = false;
                    if(lang == 'cn'){
                        layer.msg('确认收货成功');
                    }else {
                        layer.msg('Confirm receipt success');
                    }
                } else {
                    if(lang == 'cn'){
                        layer.msg('确认收货失败');
                    }else {
                        layer.msg('Confirm receipt failure');
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
        $scope.close = function () {
            erp.postFun('app/dispatcherTask/checkParcelIsAccomplish', {dispatcherTaskId: $scope.percelId}, function (data) {
                if (data.data.statusCode == 200) {
                    $scope.lookbgFlag = false;
                    getWareList();
                } else {

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
        };
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
    }]);
    function err(error) {
        console.log(error);
        layer.closeAll('loading');
    }
    

}();