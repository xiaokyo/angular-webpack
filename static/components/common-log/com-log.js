(function(angular) {
    angular.module('manage')
        .component('comlogTk', {
            templateUrl: 'static/components/common-log/com-log.html',
            controller: logMerchandiseCtrl,
            bindings: {
                list: '=',
                type: '='
            },
        });

    function logMerchandiseCtrl($scope, erp) {
        let that = this;
        let itemObj = this.list;
        let stuType = this.type;
        console.log(itemObj)
        $scope.$on('to-pod', function(d,data) {  
            console.log(data);         //子级能得到值  
            if (data == 'getdata') {
               that.podarray = getData(); 
               console.log(that.podarray)
            }
        }); 
        /*查看日志*/
        if(stuType=='purchase'){
            var data = {
                pageNum:0,
                pageSize:9999,
                data:{
                    orderId: itemObj.orderId
                }
            };
            layer.load(2);
            erp.postFun("warehousereceipt/caigouShangpintiansku/getOperatorLog",data, function (res) {
                layer.closeAll("loading");
                console.log(res, 1111111111)
                if(res.data.code == 200){
                    $scope.logList = res.data.data.list;
                }else{
                    layer.msg(res.data.message)
                }
            }, function (err) {
                layer.msg('服务器错误')
            });
        }
        // $scope.LookLog = function (ordId) {
            
        // }
        $scope.closeTkFun = function () {
           $scope.$emit('log-to-father', {closeFlag: false}); 
        }
        
    }

})(angular);