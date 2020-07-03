;~function () {
    let app = angular.module('warehouse-app');
    
    //已完成调度任务
    app.controller('ScheduledCompletedCtrl', ['$scope', "erp", '$location', '$routeParams', function ($scope, erp, $location, $routeParams) {
        $scope.istabact = false;
        $scope.pagesize1 = '20';
        $scope.pagenum1 = 1;
        $scope.pagesize2 = '20';
        $scope.pagenum2 = 1;
        $scope.datalist = [];
        $scope.datalist1 = [];

        function getWareList() {
            $scope.datalist = [];
            var data = {
                parcelName: $scope.parcelName,
                //status: '7',
                pageSize: $scope.pagesize1,
                pageNum: $scope.pagenum1,
            }
            erp.postFun('app/dispatcherTask/selectCompletedDispatcherTaskOfParcel', data, function (data) {
                console.log(data);
                if (data.data.code == 200) {
                    $scope.datalist = data.data.list;
                    $scope.totalpage1 = function () {
                        return Math.ceil(data.data.totalNum / $scope.pagesize1)
                    }
                    $scope.totalNum1 = data.data.totalNum;
                    pageFun1();
                } else {
                    layer.msg('获取列表失败');
                }
            }, function (data) {
                layer.msg('系统异常')
            })
        }

        getWareList();
        if ($routeParams.pelname) {
            $scope.parcelName = $routeParams.pelname;
            getWareList();
        } else {
            $scope.parcelName = '';
            getWareList();
        }
        $scope.Search = function () {
            getWareList();
        };
        $scope.enterSerch = function (e) {
            if (e.keyCode == 13) {
                getWareList();
            }
        }
        $scope.TRclick = function (index, item) {
            $scope.focus = index;
        }
        $scope.TRclick = function (index, item) {
            $scope.focus = index;
            $scope.itemData = item;
            $scope.packageName = item.parcelName;
            getdetal();
        }

        function getdetal() {
            $scope.datalist1 = [];
            var data = {
                parcelId: $scope.itemData.id,
                pageSize: $scope.pagesize2,
                pageNum: $scope.pagenum2,
            }
            erp.postFun('app/parcel/selectParcelRelevancelListByparcelId', data, function (data) {
                console.log(data);
                if (data.data.code == 200) {
                    $scope.datalist1 = data.data.list;
                    $scope.totalpage2 = function () {
                        return Math.ceil(data.data.totalNum / $scope.pagesize2)
                    }
                    $scope.totalNum2 = data.data.totalNum;
                    pageFun2();
                } else {
                    layer.msg('获取列表失败');
                }
            }, function (data) {
                layer.msg('系统异常')
            })
        }

        $scope.trclick = function (index) {
            $scope.focus1 = index;
        }
        //删除
        $scope.deleteWare = function (item) {
            $scope.delTitle = '此包裹已在调度任务中，是否删除？';
            $scope.deleteWareFlag = true;
            $scope.itemData = item;
        }
        $scope.goDelete = function () {
            erp.postFun('app/parcel/addDeleteFlagByParcelId', {parcelId: $scope.itemData.id}, function (data) {
                console.log(data);
                if (data.data.code == 200) {
                    layer.msg('删除成功');
                    getWareList();
                    $scope.datalist1 = [];
                    $scope.deleteWareFlag = false;
                } else {
                    layer.msg('删除失败');
                }
            }, function (data) {
                layer.msg('系统异常')
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
                layer.msg('错误页码');
                $(".goyema").val(1)
            } else {
                getWareList();
            }
        }

        //分页2
        function pageFun2() {
            $(".pagegroup2").jqPaginator({
                totalCounts: $scope.totalNum2 || 1,
                pageSize: $scope.pagesize2 * 1,
                visiblePages: 5,
                currentPage: $scope.pagenum2 * 1,
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
                    $scope.pagenum2 = n;
                    getdetal();
                }
            });
        }

        $scope.pagechange2 = function (pagesize) {
            console.log(pagesize)
            $scope.pagenum2 = 1;
            getdetal();
        }
        $scope.pagenumchange2 = function () {
            console.log($scope.pagenum2 % 1)
            $scope.pagenum2 = $(".goyema2").val() - 0;
            if ($scope.pagenum2 < 1 || $scope.pagenum2 > $scope.totalpage2()) {
                layer.msg('错误页码');
                $(".goyema2").val(1)
            } else {
                getdetal();
            }
        }
    }])
}();