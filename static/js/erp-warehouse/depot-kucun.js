;~function () {
    let app = angular.module('warehouse-app');
    //erp库存    查询库存表数据
    app.controller('erpdepotkucunCtrl', ['$scope', "erp", function ($scope, erp) {
        console.log('erpdepotkucunCtrl');

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
                $scope.kucunliebiao = obj;
            };
        };
        // 展示可见用户
        $scope.showPrivUsers = function () {
            var deleteUserId = [];
            layer.open({
                title: null,
                type: 1,
                area: ['560px', '330px'],
                skin: 'layer-content-common',
                closeBtn: 0,
                shade: [0.1, '#000'],
                content: $('#show-users').html(),
                btn: ['确认'],
                success: function (layero, index) {
                },
                yes: function (index, layero) {
                    layer.close(index);
                }
                // btn2: function (index, layero) {
                //     return false;
                // }
            });
        }
        // 转至私有库存
        // $scope.turnToPrivFlag = true;
        $scope.customerList = null;
        $scope.turnToPriv = function (item) {
            $scope.turnToPrivFlag = true;
            $scope.turnPrivPro = item;
        }
        $scope.cancelTurnPriv = function () {
            $scope.turnToPrivFlag = false;
            $scope.turnPrivPro = null;
        }
        var custListTimer = null;
        $scope.getCustList = function () {
            custListTimer && clearTimeout(custListTimer)
            custListTimer = setTimeout(function() {
                var searchUserData = {}
                // {"userId":"","token":"","data":"{\"inputStr\":\"a\"}"}
                searchUserData.userId = '';
                searchUserData.token = '';
                searchUserData.data = {};
                searchUserData.data.inputStr = $scope.customerName || '';
                searchUserData.data = JSON.stringify(searchUserData.data);
                erp.postFun('app/account/proList', JSON.stringify(searchUserData), function (data) {
                    var data = data.data;
                    if (data.statusCode != 200) {
                        layer.msg('服务器错误');
                        return false;
                    }
                    if (JSON.parse(data.result)[0] == null) {
                        $scope.customerList = [];
                    } else {
                        $scope.customerList = JSON.parse(data.result);
                    }
                    console.log($scope.customerList);
                }, err);
            }, 1000)
        }
        $scope.assignOneCust = function (item) {
            $scope.turnPrivCust = item;
            $scope.customerName = item.name;
            $scope.customerList = null;
        }
        $scope.removeCustName = function () {
            $scope.customerName = '';
            $scope.turnPrivCust = null;
        }

        function err(a) {
            alert(a)
        };

    }])
}();