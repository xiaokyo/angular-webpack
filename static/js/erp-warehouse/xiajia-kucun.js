;~function () {
    let app = angular.module('warehouse-app');
    //下架库存
    app.controller('xiaJiaKuCunCtrl', ['$scope', "erp", "$routeParams", function ($scope, erp, $routeParams) {
        console.log('下架库存')
        // var loStore = localStorage.getItem('store')==undefined?'0':localStorage.getItem('store');
        // if (loStore) {
        //     $scope.store = loStore-0;
        //     $('.kucun-ck-btn').eq($scope.store).addClass('kucun-ck-btn-act');
        // }
        var stuNum = $routeParams.stu || 0;
        $scope.listIndex = stuNum - 0;
        console.log($scope.listIndex)
        //共有仓库 入库
        $scope.pageSize = '50';
        $scope.pageNum = '1';
        $scope.totalNum = 0;
        $scope.totalPageNum = 0;
        $scope.searchTj = '';
        $scope.timeIndex = 1;

        $scope.messageFlag = false;
        var clickItem;
        // $scope.storages = erp
        //     .getStorage()
        //     .map(_ => ({ id: _.dataId, storageName: _.dataName }));

        $scope.storageCallback = function({ item }){
            if(!!item) $scope.store = item.dataId
            cgListFun()
		}

        function cgListFun() {
            var cgData = {};
            cgData.store = $scope.store;
            cgData.pageSize = $scope.pageSize + '';
            cgData.pageNum = $scope.pageNum + '';
            $scope.piciList = [];
            console.log(cgData)
            erp.load()
            erp.postFun("app/goodsInfo/yiXiaJiaKuCun", JSON.stringify(cgData), bb, err);

            function bb(a) {
                layer.closeAll('loading')
                console.log(a)
                if (a.data.statusCode == 200) {
                    var result = JSON.parse(a.data.result)
                    $scope.piciList = result.list;
                    $scope.totalNum = result.total;
                    console.log($scope.totalNum)
                    console.log($scope.piciList)
                    pageFun(erp, $scope);
                }
            };
        }

        function err(a) {
            layer.closeAll('loading')
            layer.msg("失败")
        };
        // cgListFun()
        //分页
        function pageFun(erp, $scope) {
            if ($scope.totalNum <= 0) {
                layer.closeAll('loading')
                return;
            }
            $("#pagination1").jqPaginator({
                totalCounts: $scope.totalNum,
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
                    erp.load()
                    $('.erp-load-tbody').show();
                    erp.loadPercent($('.erp-load-box'), 500);
                    $scope.piciList = [];
                    $scope.pageNum = n + '';
                    cgListFun()
                }
            });
        }

        $scope.changePageSize = function () {
            $scope.pageNum = '1';
            cgListFun(erp, $scope);
        }
        $scope.toSpecifiedPage = function () {
            if ($scope.pageNum == "" || $scope.pageNum == null || $scope.pageNum == undefined || $scope.pageNum < 1){
                layer.msg("错误页码");
                return;
            }
            if ($scope.pageNum == 0){
                $scope.pageNum = 1;
            }
            var totalPage = Math.ceil($scope.totalNum / $scope.pageSize);
            if($scope.pageNum > totalPage){
                layer.msg("错误页码");
                return;
            }
            cgListFun(erp, $scope);
        }
        $scope.storeFun = function(ev,stu){
            $('.kucun-ck-btn').removeClass('kucun-ck-btn-act')
            $(ev.target).addClass('kucun-ck-btn-act')
            $scope.store = stu;
            $scope.pageNum = '1';
            cgListFun(erp, $scope);
        }
        //搜索
        $('.top-search-inp').keypress(function (Event) {
            if (Event.keyCode == 13) {
                $scope.searchFun();
            }
        })
        $scope.searchFun = function () {
            $scope.pageNum = '1';
            cgListFun(erp, $scope);
        }
        $scope.delFun = function(item){
            $scope.isDelFlag = true;
            $scope.itemPid = item.pid;
            console.log($scope.isDelFlag,$scope.itemPid)
        }
        $scope.sureDelFun = function(){
            erp.postFun('app/goodsInfo/delYiXiaJiaKuCunInfo',{'pid':$scope.itemPid},function(data){
                console.log(data)
                if(data.data.data>0){
                    $scope.isDelFlag = false;
                    cgListFun(erp, $scope);
                }else{
                    layer.msg('失败')
                }
            },function(data){
                console.log(data)
            },{layer:true})
        }
        //显示大图
        $('#ea-list-table').on('mouseenter','.s-img',function () {
            $(this).siblings('.hide-bigimg').show();
        })
        $('#ea-list-table').on('mouseenter','.hide-bigimg',function () {
            $(this).show();
        })
        $('#ea-list-table').on('mouseleave','.s-img',function () {
            $(this).siblings('.hide-bigimg').hide();
        })
        $('#ea-list-table').on('mouseleave','.hide-bigimg',function () {
            $(this).hide();
        })
    }])
}();