(function () {
    var app = angular.module('erp-staff')
    //临时工
    app.controller('timeWageCtrl', ['$scope', 'erp', function ($scope, erp) {
    var b = new Base64()
    var loginName = b.decode(localStorage.getItem('erploginName'));
    const adminArr = ['admin', '龙香昀', '李金华', '李规圣']
    $scope.adminFlag = adminArr.includes(loginName)
    //客户页面
    $scope.pageSize = '50';
    $scope.pageNum = '1';
    $scope.isAdminFlag = erp.isAdminLogin();
    $scope.status='0';
    document.title="临时工工资结算";
    function err() {
        layer.msg('系统异常')
    }
    function getList() {
        erp.load();
        let upData = {
            beginDate:$scope.endDate,
            endDate:$scope.startDate,
            pageNum:$scope.pageNum,
            pageSize:$scope.pageSize,
            data:{
                lingShiGongId:$scope.searchDdh,
                status:$scope.status,//0 上班  1下班  2待支付  3已支付
                store:''
            }
        };
        erp.postFun('linShiGong/jiLuList', JSON.stringify(upData), con, err)

        function con({data}) {
            erp.closeLoad();
            if (data.code == 200) {
                var result = data.data;
                $scope.listArr = result.list.map(item=>{
                    item.jineNew = item.jine;
                    item.gongZiNew = item.gongZi
                    return item;
                });
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
    $scope.searchFun = function () {
        $scope.pageNum = '1';
        getList();
    }
    $('.sku-inp').keypress(function (event) {
        if (event.keyCode == 13) {
            $scope.searchFun()
        }
    });

    $scope.payingFun = function(item){
        getCheckList();
        if(!item && $scope.checkList.length==0) return layer.msg('请选择相应人员')
        const param = {
            ids:item?[item.id]:$scope.checkIds
        }
        layer.confirm('确认提交待支付吗?', { title: '提示' }, function (index) {
            erp.postFun('linShiGong/submitToWaitPay',param,function(data){
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
    $scope.paidFun = function(item){
        getCheckList();
        if(!item && $scope.checkList.length==0) return layer.msg('请选择相应人员')
        const param = {
            ids:item?[item.id]:$scope.checkIds
        }
        layer.confirm('确认提交已支付吗?', { title: '提示' }, function (index) {
            erp.postFun('linShiGong/submitToPaid',param,function(data){
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

    $scope.hourlyPay = (item)=>{
        const {lingShiGongId,id,jineNew:jine} = item;
        const param = { lingShiGongId, id, jine };
        erp.postFun('linShiGong/updateJinE',param,function(data){
            if (data.data.code==200) {
                item.jine = item.jineNew;
                item.isEditHour=false;
            } else {
                layer.msg(data.data.message)
            }
        },function(data){
            console.log(data)
        })
    }
    $scope.wageFun = (item)=>{
        const {id,gongZiNew:gongZi} = item;
        const param = { id, gongZi };
        erp.postFun('linShiGong/updateGongZi',param,function(data){
            if (data.data.code==200) {
                item.gongZi = item.gongZiNew;
                item.isEdit=false;
            } else {
                layer.msg(data.data.message)
            }
        },function(data){
            console.log(data)
        })
    }
    const qrcode = new QRCode(document.getElementById("qrCodeImg"), {
        width : 450,
        height : 450
    });
    $scope.getQrCode = item =>{
        erp.postFun('linShiGong/getQr',{lingShiGongId:item.lingShiGongId},function({data}){
            if (data.code==200) {
                $scope.qrCode = {
                    show:true,
                    img:data.data
                }
                if(data.data.indexOf('alipay')>-1){
                    $scope.qrCode.title='支付宝';
                }else if(data.data.indexOf('wechat')>-1){
                    $scope.qrCode.title='微信';
                }else{
                    $scope.qrCode.title='未知';
                }
                qrcode.makeCode('');
                qrcode.makeCode(data.data);
            } else {
                layer.msg(data.data.message)
            }
        },function(data){
            console.log(data)
        })
    }
}])
})()