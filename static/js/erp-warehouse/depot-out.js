;~function () {
    let app = angular.module('warehouse-app');
    //erp出库
    app.controller('erpdepotOutCtrl', ['$scope', "erp", function ($scope, erp) {
        console.log('erpdepotOutCtrl')
        erp.getFun("app/storage/getStorage", aa, err);
        var storages;

        function aa(a) {
            //将数据格式化为json数组
            storages = JSON.parse(a.data.result);
            console.log(storages);
            //将数据存入到angular空间中
            $scope.cangku = storages;
            //获取仓库对应的库存数据
            erp.postFun("app/storage/inventoryList", {"data": "{'pageNum':'1','pageSize':'5','storageid':'" + storages[0].id + "'}"}, bb, err);

            function bb(a) {
                var obj = JSON.parse(a.data.result);
                console.log(obj);
                $scope.chukuliebiao = obj;
            };
        };

        function err(a) {
            alert(a)
        };
    }])
}();