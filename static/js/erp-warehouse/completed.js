;~function () {
    let app = angular.module('warehouse-app');
    //已完成
    app.controller('CompletedCtrl', ['$scope', "erp", '$location','$timeout', function ($scope, erp, $location,$timeout) {
        $scope.pagesize1 = '20';
        $scope.pagenum1 = 1;
        $scope.SelectType = 'trackingNumber';
        var lang = localStorage.getItem('lang');
        console.log(lang)
        $scope.places = lang == 'cn' ? '关键字查询' : 'Keyword query';
        $scope.gopercel = function (id) {
            window.open('#/erpwarehouse/ScheduledAdd/' + id)
            //window.open('#/erpwarehouse/ScheduledCompleted/'+id)
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
                beginTime: $scope.beginTime,
                endTime: $scope.endTime,
                type: $scope.SelectType,
                inputTxt: $scope.inputTxt,
                shippingStatus: '12',
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
                if(lang == 'cn'){
                    layer.msg('系统异常')
                }else {
                    layer.msg('System exception');
                }
                layer.closeAll("loading");
            })
        }

        getWareList();
        $scope.TRclick = function (index, item) {
            $scope.focus = index;
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