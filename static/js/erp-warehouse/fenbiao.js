;~function () {
    let app = angular.module('warehouse-app');
      //erp分标记录
      app.controller('fenBiaoCtrl', ['$scope','erp', function ($scope,erp) {
        $scope.searchKey = 'operatorName';
        $scope.searchVal = '';
        $scope.searchList =[
            {val:'operatorName',name:'业务员'},
            {val:'pid',name:'商品ID'},
            {val:'operatorId',name:'业务员ID'}
        ]
        $scope.params = {
            pageNum:'1',
            pageSize:'50',
            data:{
                operatorType:'7',
                operatorName:'',
                pid:'',
                operatorId:'',
                beginDate:'',
                endDate:''
            }
        }
        function getListFun() {
            erp.load();
            $scope.searchList.forEach(item=>{
                if(item.val==$scope.searchKey){
                    $scope.params.data[item.val]=$scope.searchVal;
                }else{
                    $scope.params.data[item.val]='';
                }
            })
            $scope.params.data.beginDate=$('#start-time').val();
            $scope.params.data.endDate=$('#end-time').val();

            erp.postFun('warehousereceipt/caigouShangpintiansku/getOperatorLog', $scope.params, function ({data}) {
                layer.closeAll('loading')
                if (data.code==200) {
                    $scope.totalNum = data.data.total;
                    $scope.dataList = data.data.list;
                    $scope.totalpage = Math.ceil($scope.totalNum/$scope.params.pageSize);
                    $scope.$broadcast('page-data', {
                        pageSize: $scope.params.pageSize,
                        pageNum: $scope.params.pageNum,
                        totalNum: $scope.totalpage,
                        totalCounts: $scope.totalNum,
                        pageList: ['50','100','200']
                    });
                } else {
                    layer.msg('查询失败')
                }
            }, function (data) {
                layer.closeAll('loading')
                console.log(data)
            })
        }
        getListFun()
        $scope.searchPress = (ev)=> {
            if (ev.keyCode == 13) {
                $scope.searchFun()
            }
        }
        $scope.searchFun = function () {
            getListFun()
        }
        // 分页触发
        $scope.$on('pagedata-fa', function(d, data) {
            $scope.params.pageNum = data.pageNum;
            $scope.params.pageSize = data.pageSize;
            getListFun();
        });
    }])
}();