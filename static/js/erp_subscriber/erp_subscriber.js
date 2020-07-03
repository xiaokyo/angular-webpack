(function () {
    var app = angular.module('erp-subscriber', []);
    app.controller('subscriberCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        var bs = new Base64();
        var logiName = localStorage.getItem('erploginName') ? bs.decode(localStorage.getItem('erploginName')) : '';
        //客户页面
        $scope.search = '';
        $scope.pagesize = '20';
        $scope.pagenum = '1';
        $scope.pagenumarr = [10, 20, 30, 50];
        $scope.totalNum = 0;
        $scope.AffiliateList = [];
        $scope.detail = false;
        $scope.detailList = [];
        $scope.detailTotal = 0;
        function getList() {
            erp.postFun('app/user/selectAffAccountList', {
                'distributionState': '3',
                'domainName': $scope.domainName,
                'email': $scope.email,
                'isShow': $scope.showOrhide,
                'orderBy': $scope.orderBy,
                'name': $scope.search,
                'pageNum': $scope.pagesize,
                'page': $scope.pagenum
            }, function (n) {
                if (n.data.code == 200) {
                    var obj = n.data.list;
                    $scope.AffiliateList = obj;
                    console.log($scope.AffiliateList)
                    $scope.totalNum = n.data.totalNum || 0;
                    if (n.data.totalNum == 0) {
                        $scope.totalpage = 0;
                        $scope.AffiliateList = [];
                        layer.msg('暂无数据');
                    }
                    $scope.totalpage = function () {
                        return Math.ceil(n.data.totalNum / $scope.pagesize)
                    }
                    pageFun();
                }
            }, function (e) {

            },{layer:true})
        }
        //getList();
        //点击表格行留下颜色
        $scope.TrClick = function (i) {
            $scope.focus = i;
        }
        //付费详情
        $scope.subcriberDetail = function (item) {
            console.log(item)
            $scope.detail = true;
            $scope.detailList = [];
        };
        //分页
        function pageFun() {
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.totalNum || 1,
                pageSize: $scope.pagesize * 1,
                visiblePages: 5,
                currentPage: $scope.pagenum * 1,
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
                    console.log('客户分销')
                    $scope.pagenum = n + '';
                    getList();
                }
            });
        }
        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            $scope.pagenum = '1';
            getList();
        }
        $scope.pagenumchange = function () {
            console.log($scope.pagenum % 1)
            $scope.pagenum = $(".goyema").val() - 0;
            if ($scope.pagenum < 1 || $scope.pagenum > $scope.totalpage()) {
                layer.msg('错误页码');
                $(".goyema").val(1)
            } else {
                getList();
            }
        }
        //搜索客户
        $scope.searchList = function () {
            $scope.pagenum = '1';
            getList();
        }
        //按下enter搜索
        $scope.enterSearch = function (event) {
            if (event.keyCode === 13 || event.keyCode === 108) {
                console.log('搜索条件', $scope.search);
                $scope.orderBy = '';
                $scope.pagenum = '1';
                getList();
            }
        }
    }])
    // 失败回调
    function err(n) {
        // erp.closeLoad();
        layer.closeAll('loading');
        console.log(n);
    }
})()