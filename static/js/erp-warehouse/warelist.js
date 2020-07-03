;(function(){
    let app = angular.module('warehouse-app');
    console.log(app)
    let APIS = {
        getWarehouseList:'warehouseBuildWeb/management/selectStorageDoList',// 获取仓库列表
        newWarehouse:'warehouseBuildWeb/management/addStorageDo',// 新增仓库
        updateWarehouse:'warehouseBuildWeb/management/updateStorageDo',// 修改仓库
        delWarehouse:'warehouseBuildWeb/management/deleteStorageDo',// 删除仓库

        getCountryList:'warehouseBuildWeb/management/getCountryByAreaId',// 获取国家列表
        getRealBlock:'warehouseBuildWeb/block/list',// 获取仓库区列表
    }
    app.controller('warelistCtrl', ['$scope', "erp", '$location', function ($scope, erp, $location) {
        console.log('warelistCtrl');

        $scope.isadmin = erp.isAdminLogin();

        $scope.constOBJ = {// 常量对象
            noOryes:{
                0:'否',
                1:'是',
            },
            storageType:{// 使用仓库类型 (0 测试仓库 1真实仓库 2虚拟仓库)
                '0':'测试仓库',
                '1':'真实仓库',
                '2':'虚拟仓库'
            },
            storageStatus:{
                '':'启用',
                '0':'删除',
                '1':'禁用'
            }
        }

        $scope.sendParams = {
            pageNum:1,
            pageSize:20
        }
        function getWareList() {
            let params = erp.deepClone($scope.sendParams)
            erp.postFun(APIS.getWarehouseList, JSON.stringify(params), function (data) {
                if (data.data.code != 200) return layer.msg('获取列表错误')
                let res = data.data.data
                $scope.wareList = res.list;
                console.log('仓库列表',$scope.wareList)
                $scope.$broadcast('page-data',{
                  pageSize: String($scope.sendParams.pageSize),//每页条数
                  pageNum: String($scope.sendParams.pageNum),//页码
                  totalNum: Math.ceil(Number(res.total) / Number($scope.sendParams.pageSize)),//总页数
                  totalCounts: res.total,//数据总条数
                  pageList:['10','20','50']//条数选择列表，例：['10','50','100']
                })
            })
        }
        // getWareList();

        $scope.$on('pagedata-fa', function (d, data) {// 分页onchange
          $scope.sendParams.pageNum = data.pageNum
          $scope.sendParams.pageSize = data.pageSize
          getWareList()
        })


        // 真实仓的区位列表
        // var getRealBlock = function(){
        //     let params = {
        //         pageNum:1,
        //         pageSize:999
        //     }
        //     erp.postFun(APIS.getRealBlock,JSON.stringify(params),function(res){
        //         if(res.data.code != 200) return layer.msg('服务器错误')
        //         let result = res.data.data
        //         $scope.realBlockList = erp.deepClone(result.list)
        //         let obj = {}
        //         for(let i=0;i<$scope.realBlockList.length;i++){
        //             let item = $scope.realBlockList[i]
        //             obj[item.id] = item.blockName
        //         }
        //         $scope.realBlockObj = obj
        //     })
        // }
        // getRealBlock()

        // areaId对应国家
        $scope.countryByareaIdArr = [] // areaId对应国家
        var getCountryByAreaId = function(){
            layer.load(2)
            erp.postFun(APIS.getCountryList,null,function(res){
                layer.close('loading')
                if(res.data.code != 200) return layer.msg('服务器错误')
                $scope.countryByareaIdArr = res.data.data
                if($scope.countryByareaIdArr.length > 0) getWareList() 
            })
        }
        getCountryByAreaId()
        $scope.formatAreaId = function(areaId){
            let list = $scope.countryByareaIdArr
            let res = '空'
            for(let i=0;i<list.length;i++){
                if(list[i].areaId == areaId){
                    res = list[i].areaCn
                    break
                }
            }
            return res
        }
        // $scope.retBlocksName = function(item){
        //     let ids = item.storeBlockIds
        //     let res = ''
        //     for(let i=0;i<ids.length;i++){
        //         let blockName = $scope.realBlockObj[ids[i]] || '--'
        //         let dh = ','
        //         res += (!res?'':dh)+blockName
        //     }
        //     return res
        // }

        $scope.refershcw = function () {
            //erp.load();
            var str1;
            var str2;
            var str3;
            var lang = localStorage.getItem('lang');
            if (lang == 'cn') {
                str1 = "刷新成功";
                str2 = "刷新频繁，请间隔5分钟后再进行刷新";
                str3 = "请求失败";
            } else if (lang == 'en') {
                str1 = "Refresh successfully";
                str2 = "Refresh frequently, please refresh after 5 minutes";
                str3 = "Request failed";
            }
            erp.postFun('app/storagedo/flushRootTreeNode', '{}', function (data) {
                //console.log(data.data.code);
                var result = data.data.code;
                if (result == '200') {
                    layer.msg(str1);
                } else if (result == '300') {
                    layer.msg(str2);
                } else if (result == '500') {
                    layer.msg(str3);
                }
            });
        };
        $scope.deleteOneWare = function (item) {
            $scope.deleteWareFlag = true;
            $scope.deleteWareId = item.id;
            $scope.deleteWareName = item.storageName;
        };
        $scope.goDeleteWare = function () {
            erp.load();
            erp.postFun(APIS.delWarehouse, JSON.stringify({
                id: $scope.deleteWareId
            }), function (data) {
                erp.closeLoad();
                console.log(data);
                if (data.data.code != 200) {

                    if(data.data.code == 206){
                        layer.msg('需超级管理员权限');
                    }else{
                        layer.msg('操作失败');
                    }
                } else {
                    layer.msg('操作成功');
                    $scope.deleteWareFlag = false;
                    getWareList();
                }
            });
        }
        $scope.showCate = function (item) {
            location.href = 'manage.html#/erpwarehouse/waredetail/' + item.codeId;
        }

        const initUpdateParms =  {// 修改和添加需要的参数
            storageName:'',// 仓库名称
            storageNo2Name:'',// 仓库第二名称
            remark:'',// 备注
            principalName:'',// 负责人
            principalPhone:'',// 直接负责人电话
            addresses:'',// 仓库地址
            useStorageType:'1',// 使用仓库类型 (0 测试仓库 1真实仓库 2虚拟仓库)
            areaId:'',// 区域id
            // countryCode:'',// 国家简码
            suppliersWillBeAbleToDeliver:1,// 国家供应商是否可以发货到该仓库简码(0、否，1、是)
            purchasingAuthority:1,// 该仓库是否有采购权限(0、否，1、是)
            consignee:'',// 收货人
            companyName:'',// 公司名称 
            vipPrivateStockToBuy:1,// 是否需要VIP才能购买私有库存(0、否，1、是)
            storageStatus:'',// 仓库状态(0,删除，1、禁用，‘’启用) 
            // storeBlockIds:[],// 仓库区IdList
        }
        var initUpdateParams = function(){$scope.updateParams = erp.deepClone(initUpdateParms)}
        initUpdateParams()
        var checkValidUpdateParams = function(params){
            if(!params.storageName) return '请输入仓库中文名'
            if(!params.storageNo2Name) return '请输入仓库中文名'
            if(!params.areaId) return '请选择所属国家'
            // if(!params.countryCode) return '请输入国家简码'
            if(!params.principalName) return '请输入负责人'
            if(!params.principalPhone) return '请输入联系电话'
            if(!params.addresses) return '请输入仓库地址'
            if(!params.consignee) return '请输入收货人'
            if(!params.companyName) return '请输入公司名称'
            // if(params.useStorageType == 1){
            //     if(params.storeBlockIds.length<=0) return '请选择至少一个真实仓区位'
            // }
            return ''
        }
        // var getStoreBlockIds = function(){// 获取所有已选择的区位id
        //     let list = erp.deepClone($scope.realBlockList)
        //     let ids = []
        //     for(let i=0;i<list.length;i++){
        //         let item = list[i]
        //         if(item.checked) ids.push(item.id)
        //     }
        //     return ids
        // }
        // 初始化真实仓区位未选择
        var BlockedCheckedFlase = function(){$scope.realBlockList = $scope.realBlockList.map(function(item){item.checked=false; return item})}
        $scope.goAddOneWare = function () {
            // app/storagedo/addStorageDo
            // codeKey;仓库编码 defaultFlag;是否默认仓库  storageType;仓库类型  storageCapacity;仓库容量  storageName;仓库名称 addresses;仓库地址 state;国家 province;省、州行政区  city;市 remark;备注  principalId;直接负责人id principalName;直接负责人名称  principalPhone;直接负责人电话
            
            var sendJson = erp.deepClone($scope.updateParams);
            var sendUrl;
            if ($scope.editWareId) {
                sendJson.id = $scope.editWareId;
                sendUrl = APIS.updateWarehouse;
            } else {
                sendUrl = APIS.newWarehouse;
                sendJson.storageType = '仓';
                // sendJson.useStorageType = $scope.checkTypeList[0].type;
            }
            // sendJson.storeBlockIds = getStoreBlockIds()
            let error = checkValidUpdateParams(sendJson)
            if(error) return layer.msg(error)
            erp.load();
            erp.postFun(sendUrl, JSON.stringify(sendJson), function (data) {
                erp.closeLoad();
                if (data.data.code != 200)  return layer.msg(data.data.message || '服务器出错了')
                if($scope.editWareId){
                    layer.msg('操作成功');
                    $scope.editWareId = null;
                    getWareList();
                }else{
                    // $scope.addStepOne = false;
                    // $scope.addStepTwo = true;
                    // $scope.wareDetailData.codeId=data.data.codeId
                }
                $scope.addWareFlag=false;
                getWareList();
                
            });

        }
        $scope.cancelAddWare = function () {
            $scope.addWareFlag = false;
            $scope.wareName = $scope.wareCode = $scope.wareType = $scope.chargeMan = $scope.phoneNum = $scope.wareAddress = '';
            initUpdateParams()
            // BlockedCheckedFlase()
            $scope.editWareId = null;
        }
        $scope.editOneWare = function (item) {
            $scope.editWareId = item.id;
            $scope.opeWareType = '编辑仓库';
            $scope.addWareFlag = true;
            let obj = $scope.updateParams
            for(let key in obj){
                obj[key] = item[key]
            }
            obj.id = item.id
            $scope.updateParams = obj

            // const getSelectBlocks = function(){
            //     for(let i=0;i<item.storeBlockIds.length;i++){
            //         let id = item.storeBlockIds[i]
            //         for(let j=0;j<$scope.realBlockList.length.length;j++){
            //             let blockItem = $scope.realBlockList[j]
            //             if(blockItem.id == id){
            //                 $scope.realBlockList[i].checked = true
            //                 break
            //             }
            //         }
            //     }  
            // }
            // getSelectBlocks()
        }

        //一键建仓数据
        $scope.addStepOne=true;
        $scope.wareDetailData = {
            areaNum:'',
            rowNum:'',
            tierNum:'',
            boxNum:'',
            codeId:''
        }
        // function resetWare(){
        //     for(let key in $scope.wareDetailData) {
        //         $scope.wareDetailData[key]='';
        //     }
        //     $scope.wareName = $scope.wareCode = $scope.wareType = $scope.chargeMan = $scope.phoneNum = $scope.wareAddress = '';
        // }
        $scope.addWareFun=()=>{
            // resetWare();
            initUpdateParams()
            // BlockedCheckedFlase()
            $scope.addWareFlag=true;
            $scope.addStepOne = true;
            $scope.addStepTwo = false;
            $scope.opeWareType = '新增仓库';
            $scope.countryInfo='';
            $scope.showCountryList = false;
        }
        $scope.cancelDetailWare = ()=>{
            // resetWare();
            initUpdateParams()
            // BlockedCheckedFlase()
            // $scope.addWareFlag=false;
            $scope.addStepOne=true;
            $scope.addWareFlag = false;
            $scope.editWareId = null;
        }
        $scope.addDetailWare = ()=>{
            console.log($scope.wareDetailData)
            if(!$scope.wareDetailData.areaNum){
                return layer.msg('请输入分区数');
            }else if($scope.wareDetailData.areaNum==0||$scope.wareDetailData.areaNum>5){
                return layer.msg('请输入1-5个分区数');
            }else if(!$scope.wareDetailData.rowNum){
                return layer.msg('请输入每个区域排数');
            }else if($scope.wareDetailData.rowNum==0||$scope.wareDetailData.rowNum>100){
                return layer.msg('请输入1-100个区域排数');
            }else if(!$scope.wareDetailData.tierNum){
                return layer.msg('请输入每排层数');
            }else if($scope.wareDetailData.tierNum==0||$scope.wareDetailData.tierNum>10){
                return layer.msg('请输入1-10个区域排数');
            }else if(!$scope.wareDetailData.boxNum){
                return layer.msg('请输入每层框数');
            }else if($scope.wareDetailData.boxNum==0||$scope.wareDetailData.boxNum>50){
                return layer.msg('请输入1-50个层框数');
            }
            erp.load();
            erp.postFun('warehouseBuildWeb/management/oneKeyStorage', $scope.wareDetailData,  (data) =>{
                erp.closeLoad();
                if (data.data.code != 200) {
                    layer.msg(data.data.message);
                } else {
                    resetWare();
                    $scope.addWareFlag=false;
                    getWareList();
                    $scope.refershcw();
                }
            });
        }

        /* 只能输入数字 */
        $scope.areaNumChange = ()=>{
            $scope.wareDetailData.areaNum =  $scope.wareDetailData.areaNum.replace(/\D/g,'')
        }
        $scope.rowNumChange = ()=>{
            $scope.wareDetailData.rowNum =  $scope.wareDetailData.rowNum.replace(/\D/g,'')
        }
        $scope.tierNumChange = ()=>{
            $scope.wareDetailData.tierNum =  $scope.wareDetailData.tierNum.replace(/\D/g,'')
        }
        $scope.boxNumChange = ()=>{
            $scope.wareDetailData.boxNum =  $scope.wareDetailData.boxNum.replace(/\D/g,'')
        }
        /* 国家选择 */
        $scope.showCountryList = false;
        $scope.countryInfo='';
        function getCountry(){
            erp.load();
            erp.postFun('app/logistic/getcountry', {},  (data) =>{
                erp.closeLoad();
                let result = JSON.parse(data.data.result);
                $scope.countryList = result.countryList.map(item=>{
                    item.check=false;
                    item.isShow = true;
                    return item;
                })
            });
        }
        getCountry();
        $scope.toggleCountryFun = (ev)=>{
            ev && ev.stopPropagation();
            $scope.showCountryList = !$scope.showCountryList;
        }
        $scope.chooseCountryFun = (item)=>{
            $scope.countryList.forEach(item=>{
                item.check=false
            })
            $scope.countryInfo = item;
            item.check=true;
        }
        $scope.removeCountryFun = ()=>{
            $scope.countryInfo = '';
            $scope.countryList.forEach(item=>{
                item.check=false
            })
        }
        $scope.stopProp = (ev)=>{
            ev && ev.stopPropagation();
        }
        /* 搜索国家 */
        $scope.searchCountry = ()=>{
            let oval = $scope.searchCountryVal;
            if(/^[A-Za-z]+$/.test){
                oval = oval.toLowerCase();
            }
            $scope.countryList = $scope.countryList.map(item=>{
                let oid = item.ID.toLowerCase();
                let currency = item.currency.toLowerCase();
                item.isShow=false;
                if(oid.indexOf(oval)>=0 || item.NAME.indexOf(oval)>=0 || item.NAME_EN.indexOf(oval)>=0 || currency.indexOf(oval)>=0){
                    item.isShow=true
                }
                return item;
            })
            return false;
        }
        $scope.checkTypeList = [];
        /* 关闭归属国家弹框 */
         function clickCloseStorageType(ev) {
            let rectObj = document.getElementById('selectStorageType').getBoundingClientRect();
            if (rectObj.left > ev.clientX || rectObj.right < ev.clientX ||
            rectObj.top > ev.clientY || rectObj.bottom < ev.clientY) {
            document.getElementById('storageTypeList').click();
            }
        }
        /* 选择仓库类型 */
        $scope.toggleStoreType = (ev)=>{
            ev && ev.stopPropagation();
            $scope.showTypeList = !$scope.showTypeList;
            if ($scope.showTypeList) {
                document.documentElement.addEventListener('click', clickCloseStorageType);
            } else {
                document.documentElement.removeEventListener('click', clickCloseStorageType);
            }
        }
        $scope.chooseTypeFun = (item) => {
            $scope.storageTypeList.forEach(item=>{
                item.check=false;
            })
            item.check = !item.check;
            $scope.checkTypeList = $scope.storageTypeList.filter(item=>{
                if(item.check){
                    return item;
                }
            })
        }
        $scope.removeCheckType = (index,ev) => {
            ev && ev.stopPropagation();
            $scope.checkTypeList=[];
            $scope.storageTypeList = $scope.storageTypeList.map(item=>{
                item.check=false;
                return item;
            })
        }
    }])
}());
