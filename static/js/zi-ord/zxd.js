(function () {
    var app = angular.module('zxd-app', ['service']);
    app.controller('zxd-controller', ['$scope', '$http', 'erp', '$routeParams', '$compile', function ($scope, $http, erp, $routeParams, $compile) {
        console.log('装箱单')
        $scope.pageNum = '1';
        $scope.pageSize = '50';
        $scope.checkAll = function (checkAllMark) {
            for (let i = 0, len = $scope.groupList.length; i < len; i++) {
                $scope.groupList[i].checked = checkAllMark;
            }
        }
        $scope.checkItem = function (item, check) {
            item.checked = check;
            let allCheckFlag = true;
            if (check) {
                for (let i = 0, len = $scope.groupList.length; i < len; i++) {
                    if (!$scope.groupList[i].checked) {
                        allCheckFlag = false;
                        break;
                    }
                }
                $scope.checkAllMark = allCheckFlag;
            } else {
                $scope.checkAllMark = false;
            }
        }
        $scope.seaKey = 'orderId'
        function getOrdListFun() {
            erp.load()
            var upJson = {};
            upJson.pageNum = $scope.pageNum + '';
            upJson.pageSize = $scope.pageSize;
            upJson[$scope.seaKey] = $scope.searchVal || undefined;
            upJson.endDate = $('#cdatatime2').val() || undefined;
            upJson.beginData = $('#c-data-time').val() || undefined;
            erp.postFun('caigou/procurement2/getBoxInfo', JSON.stringify(upJson), function (data) {
                console.log(data)
                if (data.data.statusCode == 200) {
                    let resResult = JSON.parse(data.data.result);
                    let resList = resResult.list;
                    for (let i = 0, len = resList.length; i < len; i++) {
                        try {
                            resList[i].shuxing = JSON.parse(resList[i].shuxing)
                        } catch (error) {
                            console.log(error,i)
                        }
                    }
                    $scope.groupList = resList;
                    $scope.erpordTnum = resResult.total;

                } else {
                    layer.msg(data.data.message)
                }
                console.log($scope.groupList)
                dealpage()
                layer.closeAll('loading')
            }, function (data) {
                layer.closeAll('loading')
                console.log(data)
            })
        }
        getOrdListFun()
        $scope.searchFun = function () {
            $scope.pageNum = 1;
            getOrdListFun()
        }
        $scope.pagesizechange = function () {
            $scope.pageNum = 1;
            getOrdListFun()
        }
        $scope.pagenumchange = function(){
            var pagenum = Number($scope.pageNum)
            var totalpage = Math.ceil($scope.erpordTnum / $scope.pageSize);
            if (pagenum > totalpage || pagenum<1) {
                layer.msg('错误页码')
                $scope.pageNum = 1;
            } else {
                getOrdListFun();
            }
        }
        $scope.delteSp = function(item){
            $scope.inquiryFlag = true;
            $scope.itemBoxNum = item.boxNumber;
            $scope.itemSku = item.cjsku;
        }
        $scope.sureDeleteFun = function(){
            erp.postFun('caigou/procurement2/deleteBoxShangPinBySKU',{
                boxNumber: $scope.itemBoxNum,
                cjsku: $scope.itemSku
            },function(data){
                console.log(data)
                if (data.data.statusCode == 200) {
                    $scope.inquiryFlag = false;
                    getOrdListFun()
                } else {
                    layer.msg(data.data.message)
                }
            },function(data){
                console.log(data)
            },{layer:true})
        }
        $scope.editBoxNum = function(item){
            $scope.editBoxNumFlag = true;
            $scope.itemOrdId = item.boxDetailId;
            $scope.newBoxNum = item.boxNumber;
        }
        $scope.sureEditBoxNumFun = function(){
            if(!$scope.newBoxNum){
                layer.msg('箱号不能为空')
                return
            }
            erp.postFun('caigou/procurement2/updateShangPin',{
                boxNumber: $scope.newBoxNum,
                id: $scope.itemOrdId
            },function(data){
                console.log(data)
                if (data.data.statusCode == 200) {
                    layer.msg('成功')
                    $scope.editBoxNumFlag = false;
                    getOrdListFun()
                } else {
                    layer.msg(data.data.message)
                }
            },function(data){
                console.log(data)
            },{layer:true})
        }
        $scope.editFun = function (item) {
            $scope.editZxFlag = true;
            $scope.itemZxObj = item;
            $scope.shuxing = item.shuxing[0].value;
        }
        $scope.exportFun = function(item){
            erp.postFun('caigou/procurement2/getBoxInfoExport',{
                orderId: item.orderId
            },function(data){
                console.log(data)
                if(data.data.statusCode == 200){
                    $scope.resExcelLink = data.data.result;
                    $scope.excelFlag = true;
                }else{
                    layer.msg(data.data.message)
                }
            },function(data){
                console.log(data)
            },{layer:true})
        }
        $scope.printFun = function(item){
            let upArr = [];
            upArr.push(item.boxNumber)
            upArr = JSON.stringify(upArr)
            erp.postFun('caigou/procurement2/printBox',upArr,function(data){
                console.log(data)
                let result = data.data.result;
                if(result && result.indexOf(',')!=-1){
                    $scope.resPrintLink = result.split(',')
                    $scope.resPrintFlag = true;
                }else{
                    $scope.resPrintLink = [];
                    if(result){
                        $scope.resPrintLink.push(result)
                        $scope.resPrintFlag = true;
                    }else{
                        layer.msg('未获取到装箱单')
                    }
                }
            },function(data){
                console.log(data)
            },{layer:true})
        }
        $scope.bulkPrintFun = function(){
            let idsArr = checkedIdArrFun();
            if(idsArr.length<1){
                layer.msg('请选择订单')
                return
            }
            erp.postFun('caigou/procurement2/printBox',JSON.stringify(idsArr),function(data){
                console.log(data)
                let result = data.data.result;
                if(result && result.indexOf(',')!=-1){
                    $scope.resPrintLink = result.split(',')
                    $scope.resPrintFlag = true;
                }else{
                    $scope.resPrintLink = [];
                    if(result){
                        $scope.resPrintLink.push(result)
                        $scope.resPrintFlag = true;
                    }else{
                        layer.msg('未获取到装箱单')
                    }
                }
            },function(data){
                console.log(data)
            },{layer:true})
        }
        $scope.bulkExport = function(){
            let idsArr = checkedIdArrFun();
            console.log(idsArr)
            if(idsArr.length>0){
                erp.postFun('caigou/procurement2/getBoxInfoExport2',JSON.stringify(idsArr),function(data){
                    console.log(data)
                    if(data.data.statusCode == 200){
                        $scope.resExcelLink = data.data.result;
                        $scope.excelFlag = true;
                    }else{
                        layer.msg(data.data.message)
                    }
                },function(data){
                    console.log(data)
                },{layer:true})
            }else{
                layer.msg('请选择订单')
            }
        }
        $scope.exportSeaFun = function(){
            let upJson = {};
            upJson[$scope.seaKey] = $scope.searchVal || undefined;
            upJson.endDate = $('#cdatatime2').val() || undefined;
            upJson.beginData = $('#c-data-time').val() || undefined;
            erp.postFun('caigou/procurement2/getBoxInfoExport',JSON.stringify(upJson),function(data){
                if(data.data.statusCode == 200){
                    $scope.resExcelLink = data.data.result;
                    $scope.excelFlag = true;
                }else{
                    layer.msg(data.data.message)
                }
            },function(data){
                console.log(data)
            },{layer:true})
        }
        function checkedIdArrFun(){
            let idsArr = [];
            for(let i = 0,len = $scope.groupList.length;i<len;i++){
                if($scope.groupList[i].checked){
                    idsArr.push($scope.groupList[i].boxNumber)
                }
            }
            return idsArr
        }
        $scope.sureEditFun = function () {
            console.log($scope.shuxing)
            let selSxArr = [];
            if (!$scope.shuxing) {
                layer.msg('请选择属性')
                return
            }
            if (!$scope.itemZxObj.chang || !$scope.itemZxObj.gao || !$scope.itemZxObj.kuan || !$scope.itemZxObj.weight) {
                layer.msg('长宽高重量都不能为空')
                return
            }
            for (let i = 0, len = this.shuXingArr.length; i < len; i++) {
                if (this.shuxing === this.shuXingArr[i].value) {
                    selSxArr.push(this.shuXingArr[i])
                }
            }
            let strSelSxArr = JSON.stringify(selSxArr)
            erp.postFun('caigou/procurement2/updateBox', JSON.stringify({
                "chang": $scope.itemZxObj.chang,
                "gao": $scope.itemZxObj.gao,
                "id": $scope.itemZxObj.boxNumber,
                "kuan": $scope.itemZxObj.kuan,
                "shuxing": strSelSxArr,
                "weight": $scope.itemZxObj.weight
            }), function (data) {
                console.log(data)
                if (data.data.result > 0) {
                    $scope.editZxFlag = false;
                    layer.msg('成功')
                } else {
                    layer.msg(data.data.message)
                }
            }, function (data) {
                console.log(data)
            })
        }
        function dealpage() {
            erp.load();
            if (!$scope.erpordTnum || $scope.erpordTnum <= 0) {
                layer.msg('未找到订单')
                layer.closeAll("loading")
                return;
            }
            console.log($scope.erpordTnum)
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.erpordTnum,//设置分页的总条目数
                pageSize: $scope.pageSize * 1,//设置每一页的条目数
                visiblePages: 5,//显示多少页
                currentPage: $scope.pageNum * 1,
                activeClass: 'active',
                prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
                next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
                page: '<a href="javascript:void(0);">{{page}}<\/a>',
                first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
                last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
                onPageChange: function (n, type) {
                    console.log(n)
                    console.log(n, type)
                    // alert(33333333333)
                    if (type == 'init') {
                        layer.closeAll("loading")
                        return;
                    }
                    layer.load(2)
                    $scope.pageNum = n;
                    getOrdListFun()
                }
            });
        }
        $scope.shuXingArr = [
            { name: '普货', value: 'COMMON' },
            { name: '电子', value: 'ELECTRONIC' },
            { name: '内置电池', value: 'BATTERY' },
            { name: '纯电池', value: 'IS_ELECTRICITY' },
            { name: '含液体', value: 'HAVE_LIQUID' },
            { name: '含粉末', value: 'HAVE_STIVE' },
            { name: '含膏状', value: 'HAVE_CREAM' },
            { name: '含磁', value: 'HAVE_MAGNETISM' },
            { name: '尖锐', value: 'EDGE' },
            { name: '海关禁售', value: 'NO_ENTRY' },
            { name: '仿牌', value: 'CLONE' },
            { name: '抛货', value: 'OVERSIZE' },
            { name: '轻薄', value: 'THIN' },
            { name: '薄平', value: 'FLAT' },
            { name: '其他', value: 'PROOERTY' },
        ]
    }]);
    app.controller('bgcx-controller', ['$scope', '$http', 'erp', '$routeParams', '$compile','utils', function ($scope, $http, erp, $routeParams, $compile,utils) {
        console.log('包裹信息查询')
        var bs = new Base64();
        var erpLoginName = bs.decode(localStorage.getItem('erploginName')==undefined?'':localStorage.getItem('erploginName'));
        var loginNameArr = [
            {loginName:'称重1',printName:'YW01'},
            {loginName:'称重2',printName:'YW02'},
            {loginName:'称重3',printName:'SZ'},
            {loginName:'称重4',printName:'JH'},
            {loginName:'称重6',printName:'JH2'},
        ]
        var chengZhongName;
        for(let i = 0,len = loginNameArr.length;i<len;i++){
            if(erpLoginName == loginNameArr[i].loginName){
                chengZhongName = loginNameArr[i].printName;
                break
            }
        }
        console.log(chengZhongName)
        $scope.pageNum = '1';
        $scope.pageSize = '50';
        $scope.store = '';
        
        // 仓库change
        $scope.storageCallback = function({item, storageList, allIdString}){
            $scope.store = ''
            if(!!item) $scope.store = item.dataId
            getOrdListFun()
        }

        $scope.checkAll = function (checkAllMark) {
            for (let i = 0, len = $scope.groupList.length; i < len; i++) {
                $scope.groupList[i].checked = checkAllMark;
            }
        }
        $scope.checkItem = function (item, check) {
            item.checked = check;
            let allCheckFlag = true;
            if (check) {
                for (let i = 0, len = $scope.groupList.length; i < len; i++) {
                    if (!$scope.groupList[i].checked) {
                        allCheckFlag = false;
                        break;
                    }
                }
                $scope.checkAllMark = allCheckFlag;
            } else {
                $scope.checkAllMark = false;
            }
        }
        $scope.seaKey = 'orderId'
        function getOrdListFun() {
            var upJson = {};
            upJson.pageNum = $scope.pageNum + '';
            upJson.pageSize = $scope.pageSize;
            upJson.store = $scope.store;
            upJson.printName = $scope.searchVal;
            // upJson[$scope.seaKey] = $scope.searchVal || undefined;
            // upJson.endDate = $('#cdatatime2').val() || undefined;
            // upJson.beginData = $('#c-data-time').val() || undefined;
            erp.postFun('processOrder/outputBarcode/getOutputBarcodeInfo', JSON.stringify(upJson), function (data) {
                console.log(data)
                if (data.data.code == 200) {
                    let resResult = data.data.data;
                    $scope.groupList = resResult.list;
                    $scope.erpordTnum = resResult.total;
                } else {
                    layer.msg(data.data.message)
                }
                console.log($scope.groupList)
                dealpage()
                layer.closeAll('loading')
            }, function (data) {
                layer.closeAll('loading')
                console.log(data)
            },{layer:true})
        }
        // getOrdListFun()
        $scope.isNumFun = function (item, val) {
            val = val.replace(/[^\d.]/g, '');
            val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
            val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
            item.roughWeightVal = val;
        }
        $scope.storeList = [
            {'storeName':'义乌仓',"storeVal":0},
            {'storeName':'深圳仓',"storeVal":1},
            {'storeName':'美西奇诺仓',"storeVal":2},
            {'storeName':'美东新泽西仓',"storeVal":3},
            {'storeName':'泰国仓',"storeVal":4},
        ]
        $scope.storeChangeFun = function(){
            $scope.pageNum = 1;
            getOrdListFun()
        }
        $scope.keyEnterFun = function(ev){
            if(ev.keyCode == 13){
                $scope.searchFun()
            }
        }
        function isPiPeiFlag(loginName,itemName){
            // return true
            if (loginName==itemName) {
                return true
            } else {
                return false
            }
        }
        $scope.startPrintFun = function(item){
            let piPeiFlag = isPiPeiFlag(chengZhongName,item.theirMachineType)
            if(!piPeiFlag){
                layer.msg('你没有权限操作别人的包裹')
                return
            }
            $scope.startdyFlag = true;
            $scope.itemId = item.iD;
            $scope.itemTheirMachineType = item.theirMachineType;
        }
        $scope.sureStartPrintFun = function(){
            let upJson = {};
            upJson.ID = $scope.itemId;
            upJson.theirMachineType = $scope.itemTheirMachineType;
            erp.postFun('processOrder/outputBarcode/startPrint',upJson,function(data){
                console.log(data)
                if(data.data.code == '200'){
                    $scope.startdyFlag = false;
                    getOrdListFun()
                }else{
                    layer.msg(data.data.message)
                }
            },function(data){
                console.log(data)
            },{layer:true})
        }
        $scope.qxPrintFun = function(item){
            let piPeiFlag = isPiPeiFlag(chengZhongName,item.theirMachineType)
            if(!piPeiFlag){
                layer.msg('你没有权限操作别人的包裹')
                return
            }
            $scope.qxdyFlag = true;
            $scope.itemId = item.iD;
        }
        $scope.sureQxPrintFun = function(){
            let upJson = {};
            upJson.ID = $scope.itemId;
            erp.postFun('processOrder/outputBarcode/cancelPrint',upJson,function(data){
                console.log(data)
                if(data.data.code == '200'){
                    $scope.qxdyFlag = false;
                    getOrdListFun()
                }else{
                    layer.msg(data.data.message)
                }
            },function(data){
                console.log(data)
            },{layer:true})
        }
        $scope.printMdFun = function(item){
            let piPeiFlag = isPiPeiFlag(chengZhongName,item.theirMachineType)
            if(!piPeiFlag){
                layer.msg('你没有权限操作别人的包裹')
                return
            }
            let upJson = {};
            upJson.barcodeId = item.iD;
            console.log(item.roughWeight)
            if(item.roughWeight){
                upJson.roughWeight = item.roughWeight;
                console.log(item.roughWeight)
            }else{
                if(!item.roughWeightVal){
                    layer.msg('请输入毛重')
                    return
                }
                upJson.roughWeight = item.roughWeightVal;
            }
            upJson.isPrint = item.isPrint;
            upJson.grossWeight = item.weight;
            upJson.stroageName = item.storageName;
            upJson.LogisticsCompany = item.logisticsCompany;
            upJson.num = item.num;
            console.log(upJson)
            erp.postFun('processOrder/outputBarcode/executePrint',upJson,function(data){
                console.log(data)
                if(data.data.code == '200'){
                    erp.postFun('erp/YltdApi/executePrint',upJson,function(data){
                        console.log(data)
                        if(data.data.statusCode == '200'){
                            $scope.resMdLink = data.data.result;
                            $scope.resMdFlag = true;
                            item.isPrint=1
                        }else if(data.data.statusCode == '508'){//包裹信息不一致  查询详情
                            erp.postFun('processOrder/outputBarcode/getPackageInfoList',{
                                barcodeId: item.iD
                            },function(data){
                                console.log(data)
                                if(data.data.code == 200){
                                    $scope.bgMesFlag = true;
                                    $scope.bgMesList = data.data.data;
                                }else{
                                    layer.msg('获取不到包裹信息')
                                }
                            },function(data){
                                console.log(data)
                            },{layer:true})
                        }else{
                            layer.msg(data.data.message)
                        }
                    },function(data){
                        console.log(data)
                    },{layer:true})
                }else if(data.data.code == '508'){//包裹信息不一致  查询详情
                    erp.postFun('processOrder/outputBarcode/getPackageInfoList',{
                        barcodeId: item.iD
                    },function(data){
                        console.log(data)
                        if(data.data.code == 200){
                            $scope.bgMesFlag = true;
                            $scope.bgMesList = data.data.data;
                        }else{
                            layer.msg('获取不到包裹信息')
                        }
                    },function(data){
                        console.log(data)
                    },{layer:true})
                }else{
                    layer.msg(data.data.message)
                }
            },function(data){
                console.log(data)
            },{layer:true})
            
        }
        $scope.addFun = function(item){
            let piPeiFlag = isPiPeiFlag(chengZhongName,item.theirMachineType)
            if(!piPeiFlag){
                layer.msg('你没有权限操作别人的包裹')
                return
            }
            $scope.itemObj = item;
            $scope.addTrackFlag = true;
        }
        $scope.addKeyUpFun = function(ev){
            console.log(ev.keyCode)
            if(ev.keyCode==13){
                $scope.sureAddFun()
            }
        }
        $scope.sureAddFun = function(){
            if(!$scope.trackNum){
                layer.msg('请输入追踪号')
                return
            }
            erp.postFun('processOrder/outputBarcode/addPackage',{
                barcodeId: $scope.itemObj.iD,
                trackingNumCode: $scope.trackNum
            },function(data){
                console.log(data)
                if(data.data.code==200){
                    $scope.addTrackFlag = false;
                    $scope.trackNum = '';
                    getOrdListFun()
                }else{
                    layer.msg('新增失败')
                }
            },function(data){
                console.log(data)
            },{layer:true})
        }
        $scope.delWlFun = function(item,index){
            console.log(index)
            $scope.itemObj = item;
            $scope.itemIndex = index;
            $scope.isDelFlag = true;
        }
        $scope.sureDelFun = function(){
            erp.postFun('processOrder/outputBarcode/outPackage',{
                ID: $scope.itemObj.id
            },function(data){
                if(data.data.code == 200){
                    $scope.isDelFlag = false;
                    $scope.bgMesList.splice($scope.itemIndex,1)
                    getOrdListFun()
                }else{
                    layer.msg('删除包裹失败')
                }
            },function(data){
                console.log(data)
            },{layer:true})
        }
        $scope.searchFun = function () {
            $scope.pageNum = 1;
            getOrdListFun()
        }
        $scope.pagesizechange = function () {
            $scope.pageNum = 1;
            getOrdListFun()
        }
        $scope.pagenumchange = function(){
            var pagenum = Number($scope.pageNum)
            var totalpage = Math.ceil($scope.erpordTnum / $scope.pageSize);
            if (pagenum > totalpage || pagenum<1) {
                layer.msg('错误页码')
                $scope.pageNum = 1;
            } else {
                getOrdListFun();
            }
        }
        $scope.delteSp = function(item){
            $scope.inquiryFlag = true;
            $scope.itemBoxNum = item.boxNumber;
            $scope.itemSku = item.cjsku;
        }
        $scope.sureDeleteFun = function(){
            erp.postFun('processOrder/outputBarcode/deleteBoxShangPinBySKU',{
                boxNumber: $scope.itemBoxNum,
                cjsku: $scope.itemSku
            },function(data){
                console.log(data)
                if (data.data.code == 200) {
                    $scope.inquiryFlag = false;
                    getOrdListFun()
                } else {
                    layer.msg(data.data.message)
                }
            },function(data){
                console.log(data)
            },{layer:true})
        }
        function dealpage() {
            erp.load();
            if (!$scope.erpordTnum || $scope.erpordTnum <= 0) {
                layer.msg('未找到订单')
                layer.closeAll("loading")
                return;
            }
            console.log($scope.erpordTnum)
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.erpordTnum,//设置分页的总条目数
                pageSize: $scope.pageSize * 1,//设置每一页的条目数
                visiblePages: 5,//显示多少页
                currentPage: $scope.pageNum * 1,
                activeClass: 'active',
                prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
                next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
                page: '<a href="javascript:void(0);">{{page}}<\/a>',
                first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
                last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
                onPageChange: function (n, type) {
                    console.log(n)
                    console.log(n, type)
                    // alert(33333333333)
                    if (type == 'init') {
                        layer.closeAll("loading")
                        return;
                    }
                    layer.load(2)
                    $scope.pageNum = n;
                    getOrdListFun()
                }
            });
        }
    }]);
    //盘点
    app.controller('pandian-controller', ['$scope', '$http', 'erp', '$routeParams', '$compile','utils', function ($scope, $http, erp, $routeParams, $compile,utils) {
        console.log('盘点')
        var bs = new Base64();
        var erpLoginName = bs.decode(localStorage.getItem('erploginName')==undefined?'':localStorage.getItem('erploginName'));
        
        $scope.pageNum = '1';
        $scope.pageSize = '50';
        $scope.store = '';
        $scope.pdStu = '0';
        function getOrdListFun() {
            $scope.groupList = [];
            var upJson = {};
            upJson.pageNum = $scope.pageNum + '';
            upJson.pageSize = $scope.pageSize;
            upJson.data = {};
            upJson.data.checkStatus = $scope.pdStu-0;
            upJson.data.stanSku = $scope.searchVal;
            erp.postFun('processOrder/checkOrder/getCheckSkuList', JSON.stringify(upJson), function (data) {
                console.log(data)
                if (data.data.code == 200) {
                    let resResult = data.data.data;
                    $scope.groupList = resResult.list;
                    $scope.erpordTnum = resResult.total;
                } else {
                    layer.msg(data.data.message)
                }
                console.log($scope.groupList)
                dealpage()
                layer.closeAll('loading')
            }, function (data) {
                layer.closeAll('loading')
                console.log(data)
            },{layer:true})
        }
        getOrdListFun()
        $scope.searchFun = function(){
            $scope.pageNum = 1;
            getOrdListFun()
        }
        $scope.pagesizechange = function () {
            $scope.pageNum = 1;
            getOrdListFun()
        }
        $scope.pagenumchange = function(){
            var pagenum = Number($scope.pageNum)
            var totalpage = Math.ceil($scope.erpordTnum / $scope.pageSize);
            if (pagenum > totalpage || pagenum<1) {
                layer.msg('错误页码')
                $scope.pageNum = 1;
            } else {
                getOrdListFun();
            }
        }
        $scope.stuFun = function(stu){
            $scope.pdStu = stu;
            $scope.pageNum = 1;
            getOrdListFun()
        }
        $scope.keyEnterFun = function(ev){
            if(ev.keyCode == 13){
                $scope.searchFun()
            }
        }
        $scope.pandianFun = function(item){
            $scope.addTrackFlag = true;
            $scope.stanSku = item.stanSku;
            $scope.checkStatus = item.checkStatus-0;
            $scope.pdTipsText = item.checkStatus == 1?'确定置为未盘点吗？':'确定置为盘点吗？'
        }
        $scope.sureFun = function(){
            erp.postFun('processOrder/checkOrder/updateCheckSku',{
                stanSku: $scope.stanSku,
                checkStatus: $scope.checkStatus == 1 ? 0 : 1
            },function(data){
                console.log(data)
                if(data.data.code==200){
                    $scope.addTrackFlag = false;
                    getOrdListFun()
                }else{
                    layer.msg('设置失败')
                }
            },function(data){
                console.log(data)
            },{layer:true})
        }

        function dealpage() {
            if (!$scope.erpordTnum || $scope.erpordTnum <= 0) {
                // layer.msg('未找到数据')
                return;
            }
            console.log($scope.erpordTnum)
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.erpordTnum,//设置分页的总条目数
                pageSize: $scope.pageSize * 1,//设置每一页的条目数
                visiblePages: 5,//显示多少页
                currentPage: $scope.pageNum * 1,
                activeClass: 'active',
                prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
                next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
                page: '<a href="javascript:void(0);">{{page}}<\/a>',
                first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
                last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
                onPageChange: function (n, type) {
                    console.log(n)
                    console.log(n, type)
                    // alert(33333333333)
                    if (type == 'init') {
                        layer.closeAll("loading")
                        return;
                    }
                    $scope.pageNum = n;
                    getOrdListFun()
                }
            });
        }
        $scope.copyPiCiFun = function (word) {
            var Url1;
            Url1 = document.createElement('input');
            Url1.setAttribute('readonly', 'readonly');
            Url1.setAttribute('value', word);
            document.body.appendChild(Url1);
            Url1.select(); //选择对象
            document.execCommand("Copy");
            var tag = document.execCommand("Copy"); //执行浏览器复制命令
            if (tag) {
                layer.msg('复制成功');
            }
            document.body.removeChild(Url1);
        }
    }]);
})()