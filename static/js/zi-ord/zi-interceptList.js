(function () {



    var app = angular.module('custom-intercept-list-app', ['service']);
    app.directive('repeatFinish', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, elem, attr) {
                //当前循环至最后一个
                // console.log(scope.$index)
                if (scope.$last === true) {
                    $timeout(function () {
                        //向父控制器传递事件消息
                        scope.$emit('repeatFinishCallback');
                    }, 100);
                }
            }
        }
    });

    app.controller('intercept-list', ['$scope', '$http', 'erp', '$routeParams', '$compile', '$timeout', function ($scope, $http, erp, $routeParams, $compile, $timeout) {

        //初始方法
        $scope.searchKey = 'id';
        $scope.pageNum = 1;
        $scope.pageSize = '100'
        $scope.lanJieStu = 0;
        
        $scope.storeList = window.warehouseList.map(({ store, name})=>({ storeName:name, store, ordNum:'', storeFlag:false}))

        function getList() {
            var erpData = {};
            erpData.data = {};
            erpData.pageNum = $scope.pageNum;
            erpData.pageSize = $scope.pageSize-0;
            erpData.data[$scope.searchKey] = $scope.searchVal;
            erpData.data.type = $scope.lanJieStu;
            erpData.data.store = $scope.store;
            //查询列表
            erp.postFun('processOrder/handleOrder/queryInterceptList', JSON.stringify(erpData), function (data) {
                var erporderResult = data.data.data;//存储订单的所有数据
                console.log(data)
                // erporderResult = JSON.parse(data.data.orderList)
                $scope.erpordTnum = erporderResult.total;
                $scope.erporderList = erporderResult.list;
                if ($scope.erpordTnum < 1) {
                    layer.msg('未找到订单')
                }
                console.log($scope.erporderList)
                pageFun() 
            }, function () {
                layer.closeAll("loading")
                layer.msg('订单获取列表失败')
                // alert(2121)
            },{layer:true})
        }
        getList();

        $scope.stuTypeFun = function(stu){
            $scope.lanJieStu = stu;
            $scope.pageNum = 1;
            $scope.searchVal=""
            $('#c-zi-ord .c-checkall').attr('src', 'static/image/order-img/multiple1.png')
            getList();
        }
        $scope.storeChangeFun = function(){
            $scope.pageNum = 1;
            getList();
        }
        $scope.freshFun = _ => {
            erp.postFun('erp/faHuo/refreshFailInterceptt', {}, ({ data }) => {
                    if (data.statusCode === '200') {
                            layer.msg('后台刷新已开启，请稍后刷新页面')
                    } else {
                            layer.msg('后台刷新开启失败')
                    }
            }, _ => _, { layer: true })
        }
        //全选
        $('#c-zi-ord').on('click', '.c-checkall', function () {
            if ($(this).attr('src') == 'static/image/order-img/multiple1.png') {
                $(this).attr('src', 'static/image/order-img/multiple2.png');
                cziIndex = $('#c-zi-ord .cor-check-box').length;
                $('#c-zi-ord .cor-check-box').attr('src', 'static/image/order-img/multiple2.png');
            } else {
                $(this).attr('src', 'static/image/order-img/multiple1.png');
                cziIndex = 0;
                $('#c-zi-ord .cor-check-box').attr('src', 'static/image/order-img/multiple1.png');
            }
        })

        //给子订单里面的订单添加选中非选中状态
        var cziIndex = 0;
        $('#c-zi-ord').on('click', '.cor-check-box', function () {
            if ($(this).attr('src') == 'static/image/order-img/multiple1.png') {
                $(this).attr('src', 'static/image/order-img/multiple2.png');
                cziIndex++;
                if (cziIndex == $('#c-zi-ord .cor-check-box').length) {
                    $('#c-zi-ord .c-checkall').attr('src', 'static/image/order-img/multiple2.png');
                }
            } else {
                $(this).attr('src', 'static/image/order-img/multiple1.png');
                cziIndex--;
                if (cziIndex != $('#c-zi-ord .cor-check-box').length) {
                    $('#c-zi-ord .c-checkall').attr('src', 'static/image/order-img/multiple1.png');
                }
            }
        })


        //批量取消拦截
        var checdedIds;
        $scope.addLanJieFun = function () {
            var addyfhCount = 0;
            checdedIds = '';
            $('#c-zi-ord .cor-check-box').each(function () {
                if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
                    addyfhCount++;
                    checdedIds += $(this).siblings('.hide-order-id').text() + ',';
                }
            })
            if (addyfhCount > 0) {
                $scope.isaddLjzFlag = true;
            } else {
                $scope.isaddLjzFlag = false;
                layer.msg('请选择订单')
            }
        }

        //取消拦截
        $scope.cancelAddLjzFun = function () {
            $scope.isaddLjzFlag = false;
            checdedIds = '';
        }
        //确定拦截
        $scope.sureAddLjzFun = function () {
            //let idsArr = checdedIds.split(',')
            //idsArr.pop()
            var addyfhData = {};
            addyfhData.ids = checdedIds;
            erp.postFun('processOrder/handleOrder/updateInterceptList', JSON.stringify(addyfhData), function (data) {
                console.log(data)
                $scope.isaddLjzFlag = false;
                
                if (data.data.code == 200) {
                    $scope.lrzzhNum = data.data.data.join(",");
                    $scope.resultIntercept = true;
                    // layer.msg('批量取消拦截成功')
                    getList()
                } else {
                    layer.msg('批量取消拦截失败')
                }
            }, function (data) {
                layer.closeAll("loading")
                console.log(data)
                $('#table').bootstrapTable('refresh');  // 刷新列表
            })
        }


        //跳页的查询
        $scope.gopageFun = function () {
            var countN = Math.ceil($scope.erpordTnum / ($scope.pageSize-0));
            // alert(countN)
            if ($scope.pageNum > countN||$scope.pageNum < 1) {
                layer.closeAll("loading")
                layer.msg('不存在此页.');
                return;
            }
            getList()
        }


        //单个拦截
        $scope.oneAddLanJieFun = function (item) {
            $scope.itemId = item.id;
            $scope.oneAddLanJieFlag = true;
        }


        //单个拦截确定
        $scope.oneSureLanJieFun = function () {
            var addyfhData = {};
            addyfhData.ids = $scope.itemId;
            erp.postFun('processOrder/handleOrder/updateInterceptList', JSON.stringify(addyfhData), function (data) {
                console.log(data)
                $scope.oneAddLanJieFlag = false;
                if (data.data.code == 200) {
                    $scope.lrzzhNum = data.data.data.join(",");
                    $scope.resultIntercept = true;
                    getList()
                } else {
                    layer.msg('取消拦截失败')
                }
            }, function (data) {
                layer.closeAll("loading")
                console.log(data)

            })
        }
        function pageFun() {
            $("#c-pages-fun").jqPaginator({
                totalCounts: $scope.erpordTnum || 1,
                pageSize: $scope.pageSize * 1,
                visiblePages: 5,
                currentPage: $scope.pageNum * 1,
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
                    $scope.pageNum = n;
                    getList();
                }
            });
        }


        $scope.changePageFun = function(){
            $scope.pageNum = 1;
            getList();
        }
        //搜索
        $('.c-seach-inp').keypress(function (Event) {
            if (Event.keyCode == 13) {
                $scope.searchFun();
            }
        })


        //搜索方法
        $scope.searchFun = function () {
            $scope.pageNum = 1;
            getList()

        }

    }]);


})()