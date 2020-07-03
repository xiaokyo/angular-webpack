(function(angular) {
    angular.module('manage')
        .component('logTk', {
            templateUrl: 'static/components/log/log.html',
            controller: logMerchandiseCtrl,
            bindings: {
                podarray: '=',
                showdetail: '=',
                no: '=',
                onLog: '&',
                showWorkOrder: '&'
            },
        });

    function logMerchandiseCtrl($scope, erp) {
        // console.log(dsp.getQueryString())
        // $scope.text = '';

        // this.testObj = 10;
        // console.log($ctrl.hero);

        // this.podarray = 10;
        var that = this;
        var ordId = this.no;
        console.log(this.no)
        $scope.$on('to-pod', function(d,data) {  
            console.log(data);         //子级能得到值  
            if (data == 'getdata') {
               // getData(); 
               that.podarray = getData(); 
               console.log(that.podarray)
               // $scope.$emit('to-addpro', 'hasgetdata');
            }
        }); 

        $scope.stopProgFun = function(ev){
            ev.stopPropagation()
        }
        /*查看日志*/
        console.log(ordId)
        if(ordId){
            var data = {
                orderId:ordId
            };
            layer.load(2);
            erp.postFun("processOrder/log/list",data, function (res) {
                layer.closeAll("loading");
                console.log(res, 1111111111)
                if(res.data.code == 200){
                    $scope.logList = res.data.data;
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