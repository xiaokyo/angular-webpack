(function () {
    var app = angular.module('erp-staff')
    //临时工
    app.controller('daywokerCtrl', ['$scope', 'erp', function ($scope, erp) {
        var b = new Base64()
        var loginName = b.decode(localStorage.getItem('erploginName'));
        const adminArr = ['admin', '龙香昀', '李金华', '李规圣']
        $scope.adminFlag = adminArr.includes(loginName)
        $scope.listArr=[];
        $scope.pageSize = '50';
        $scope.pageNum = '1';
        document.title="临时工列表";
        function err(){
            layer.msg('请重新请求');
        }
        function getList() {
            erp.load();
            let upData = {
                beginDate:$scope.endDate,
                endDate:$scope.startDate,
                pageNum:$scope.pageNum,
                pageSize:$scope.pageSize,
                data:{
                    id:$scope.searchDdh,
                    status:'',//0 上班  1下班  2待支付  3已支付
                    store:''
                }
            };
            erp.postFun('linShiGong/list', upData, con, err)

            function con({data}) {
                console.log(data)
                erp.closeLoad();
                if (data.code == 200) {
                    var result = data.data;
                    $scope.listArr = result.list;
                    $scope.pageData = {
                        pageSize:$scope.pageSize,//每页条数
                        pageNum:$scope.pageNum,//页码
                        totalCounts: result.total,//数据总条数
                        pageList: ['30', '50','100']//条数选择列表，例：['10','50','100']
                    }
                }
            }
        }

        getList();
        $scope.$on("pagedata-fa", function (d, data) {
            $scope.pageNum = data.pageNum;
            $scope.pageSize = data.pageSize;
            getList();
        });
        $scope.searchFun = ()=>{
            getList();
        }
        function getCheckList(){
            $scope.checkIds = [];
            $scope.checkList = [];
            $scope.checkList = $scope.listArr.filter(item=>{
                if(item.check){ 
                    $scope.checkIds.push(item.id)
                    return item;
                }
            })
        }
        $scope.checkFun = ()=>{
            getCheckList();
            $scope.checkAllFlag = $scope.checkList.length==$scope.listArr.length;
        }
        $scope.checkAllFun = ()=>{
            $scope.listArr.forEach(item=>{
                item.check=$scope.checkAllFlag;
            })
        }
        $scope.deleteFun = function(item){
            getCheckList();
            if(!item && $scope.checkList.length==0) return layer.msg('请选择相应人员')
            const param = {
                ids:item?[item.id]:$scope.checkIds
            }
            layer.confirm('确认删除吗?', { title: '提示' }, function (index) {
                erp.postFun('linShiGong/deleteLingShiGong',param,function(data){
                    if (data.data.code==200) {
                        getList();
                        layer.closeAll();
                    } else {
                        layer.msg(data.data.message)
                    }
                },function(data){
                    console.log(data)
                })
            })
        }
        $scope.printFun = (item,type)=>{
            const link = item.idUrl;
            if (!link) return;
            if (type == 1) {
                erp.navTo(link, '_blank');// 跳转页面 打印
            } else {
                PrintCode(link)
            }
        }
        function PrintCode(url) {
            $.ajax({
                url: 'http://127.0.0.1:9999/marking?url=' + url,
                async: true,
                cache: false,
                dataType: 'text',
                error: function (xhr) {
                    $scope.downLoadFlag = true;
                    $scope.$apply()
                    console.log($scope.downLoadFlag)
                },
                success: function (data) {
                    data = data.constructor === Boolean ? data : data === 'true'
                    if (!data) {
                        $scope.zddyFalseFlag = true;
                        $scope.zddyErrorPdfLink = url;
                        $scope.$apply()
                    }
                }
            })
        }
    }])
})()