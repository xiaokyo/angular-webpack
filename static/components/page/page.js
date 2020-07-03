(function (angular) {

    angular.module('manage')
        .component('page', {
            templateUrl: '/static/components/page/page.html',
            controller: pageCtrl,
            bindings: {
                pageData:'<',
                onUpdata:'&'
            }
        })

    function pageCtrl($scope, erp) {
        $scope.pageNum='';
        this.$onInit = ()=>{
            this.pageData = {
                pageSize: '',//每页条数
                pageNum: '',//页码
                totalPage: '',//总页数
                totalCounts: '',//数据总条数
                pagesizeList:'',//条数选择列表，例：['10','50','100']
                showSelect:true,
                showGo:true,
                showTotal:true
            }
        }
        this.$onChanges = (changes)=>{
            if(changes.pageData && changes.pageData.currentValue){
                let data = angular.copy(changes.pageData.currentValue);
                let opage = Math.ceil(data.totalCounts/data.pageSize);
                $scope.pageObj = {
                    pageSize: data.pageSize,//每页条数
                    pageNum: data.pageNum,//页码
                    totalNum: opage,//总页数
                    totalCounts: data.totalCounts,//数据总条数
                    pagesizeList:data.pageList,//条数选择列表，例：['10','50','100']
                    showSelect:data.showSelect===false?false:true,
                    showGo:data.showGo===false?false:true,
                    showTotal:data.showTotal===false?false:true
                };
                pageFun();
            }
        }
        $scope.$on('page-data', function (d, data) {
            $scope.pageObj = {
                pageSize: data.pageSize,//每页条数
                pageNum: data.pageNum,//页码
                totalNum: data.totalNum,//总页数
                totalCounts: data.totalCounts,//数据总条数
                pagesizeList:data.pageList,//条数选择列表，例：['10','50','100']
                showSelect:data.showSelect===false?false:true,
                showGo:data.showGo===false?false:true,
                showTotal:data.showTotal===false?false:true
            }
            console.log($scope.pageObj)
            pageFun();
        })
        $scope.numberInput = function () {//只允许数字
            $scope.pageNum = $scope.pageNum.replace(/[^\d]/, "");
        }
        $scope.changeFun = function (type) {//页码输入或条数切换事件
            if(type=='input'){
                if (!$scope.pageObj.totalPage) {
                    $scope.pageObj.totalPage = Math.ceil($scope.pageObj.totalCounts / ($scope.pageObj.pageSize * 1));
                }
                if($scope.pageNum>$scope.pageObj.totalPage || $scope.pageNum==0){
                    $scope.pageNum = $scope.pageObj.totalPage;
                }
                $scope.pageObj.pageNum=$scope.pageNum;
            }
            
            if(type=='size'){
                $scope.pageObj.pageNum='1';
                $scope.pageNum='';
            }
            // this.onUpdata({
            //     $event:{
            //         page:$scope.pageObj
            //     }
            // });
            $scope.$emit('pagedata-fa', $scope.pageObj);
        }
        function pageFun() {
            $(".page-index").jqPaginator({
                totalCounts: Number($scope.pageObj.totalCounts) || 1,
                pageSize: Number($scope.pageObj.pageSize),
                visiblePages: 5,
                currentPage: Number($scope.pageObj.pageNum),
                activeClass: 'current',
                first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
                prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
                next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
                last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
                page: '<a href="javascript:void(0);">{{page}}<\/a>',
                onPageChange: function (n, type) {
                    if (type == 'init') {
                        return;
                    };
                    console.log(n)
                    $scope.pageNum='';
                    $scope.pageObj.pageNum = n.toString();
                    $scope.$emit('pagedata-fa', $scope.pageObj);
                }
            });
        }
    }
})(angular);
