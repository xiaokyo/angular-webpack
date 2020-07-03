;~function () {
    let app = angular.module('warehouse-app');
    //设置区域长度
    app.controller('qycdszCtrl', ['$scope', "erp", "$routeParams", function ($scope, erp, $routeParams) {
        console.log('设置区域长度')
        //共有仓库 入库
        $scope.pageSize = '20';
        $scope.pageNum = '1';
        $scope.totalNum = 0;
        $scope.piciList = [];
        function cgListFun() {
            let cgData = {
                pageNum: $scope.pageNum + '',
                pageSize: $scope.pageSize + ''
            };
            erp.load();
            let bb = (a)=> {
                layer.closeAll('loading')
                let odata = a.data.data;
                if (a.data.code == 200) {
                    $scope.piciList = odata.list;
                    $scope.totalNum = odata.total;
					let totalPage = Math.ceil(Number($scope.totalNum) / Number($scope.pageSize));
                    $scope.$broadcast('page-data', {
						pageSize: $scope.pageSize,//每页条数
						pageNum: $scope.pageNum,//页码
						totalNum: totalPage,//总页数
						totalCounts: $scope.totalNum,//数据总条数
						pageList:['20','30','50','100']//条数选择列表，例：['10','50','100']
					})
                }
            };
            let err=(a)=> {
                layer.closeAll('loading')
                layer.msg("失败")
            };
            erp.postFun("warehouseBuildWeb/management/getStorageBasicInfoList", JSON.stringify(cgData), bb, err);
        }
        cgListFun();
        $scope.$on('pagedata-fa', function (d, data) {// 分页onchange
			$scope.pageNum = data.pageNum;
			$scope.pageSize = data.pageSize;
			cgListFun();
		})
    }])
}();