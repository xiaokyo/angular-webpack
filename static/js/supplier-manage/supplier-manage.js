(function () {
    var app = angular.module('supplier-manage-app',[]);
    app.controller('supplier-manage',['$scope','erp','$location','$routeParams',function ($scope,erp,$location,$routeParams) {
        console.log('黑名单列表');
        $scope.pageSize = '50';
        $scope.pageNum = '1';
        $scope.sortType = 1;
        function getList() {
            erp.load()
            var jsonObj = {};
            jsonObj.pageSize = $scope.pageSize;
            jsonObj.pageNum = $scope.pageNum;
            jsonObj.params = $scope.searchVal;
            erp.postFun('caigou/supplier/supplierBlackList',JSON.stringify(jsonObj),function (data) {
                console.log(data)
                erp.closeLoad()
                if (data.data.statusCode==200) {
                    $scope.gysList = data.data.result.ps;
                    $scope.erpordTnum = data.data.result.total;
                    pageFun ()
                } else {
                    layer.msg('网络错误,请重刷')
                }
            },function (data) {
                console.log(data)
                erp.closeLoad()
            })
        }
        getList()
        $('.top-search-inp').keypress(function (ev) {
            if(ev.which==13){
                $scope.searchFun()
            }
        })
        $scope.searchFun = function () {
            $scope.pageNum = '1';
            getList()
        }
        $scope.pageChange = function () {
            $scope.pageNum = '1';
            getList()
        }
        $scope.gopageFun = function () {
            console.log($scope.pageNum)
            if ($scope.pageNum>Math.ceil($scope.erpordTnum/$scope.pageSize)) {
                layer.msg('页数不能大于总页数')
            } else {
                getList()
            }
        }

    }])
    app.controller('supplier-gys-manage',['$scope','erp','$location','$routeParams',function ($scope,erp,$location,$routeParams){
        console.log('供应商列表')
        $scope.pageSize = '50';
        $scope.pageNum = '1';
        $scope.sortType = 1;
        function getList() {
            erp.load()
            var jsonObj = {};
            jsonObj.pageSize = $scope.pageSize;
            jsonObj.pageNum = $scope.pageNum;
            jsonObj.params = $scope.searchVal;
            if ($scope.sortType==1) {
                jsonObj.sort="sumMoney desc";
            } else if($scope.sortType==2){
                jsonObj.sort="sumMoney asc";
            } else if($scope.sortType==3){
                jsonObj.sort="buyCount desc";
            } else if($scope.sortType==4){
                jsonObj.sort="buyCount asc";
            }
            // sumMoney asc从低到高
            // sumMoney desc从高到低

            // buyCount asc从低到高
            // buyCount desc从高到低
            erp.postFun('caigou/supplier/getSupplierList',JSON.stringify(jsonObj),function (data) {
                console.log(data)
                erp.closeLoad()
                if (data.data.statusCode==200) {
                    $scope.gysList = data.data.result.ps;
                    $scope.erpordTnum = data.data.result.total;
                    pageFun ()
                } else {
                    layer.msg('网络错误,请重刷')
                }
            },function (data) {
                console.log(data)
                erp.closeLoad()
            })
        }
        getList()
        $('.top-search-inp').keypress(function (ev) {
            if(ev.which==13){
                $scope.searchFun()
            }
        })
        $scope.searchFun = function () {
            $scope.pageNum = '1';
            getList()
        }
        $scope.pageChange = function () {
            $scope.pageNum = '1';
            getList()
        }
        $scope.gopageFun = function () {
            console.log($scope.pageNum)
            if ($scope.pageNum == "" || $scope.pageNum == null || $scope.pageNum == undefined){
                layer.msg("错误页码");
                return;
            }
            if ($scope.pageNum == 0){
                $scope.pageNum = 1;
            }
            if ($scope.pageNum>Math.ceil($scope.erpordTnum/$scope.pageSize)) {
                layer.msg('页数不能大于总页数')
            } else {
                getList()
            }
        }
        $scope.moneyDownFun = function(){
            $scope.sortType=1;
            getList()
        }
        $scope.moneyUpFun = function(){
            $scope.sortType=2;
            getList()
        }
        $scope.countUpFun = function(){
            $scope.sortType=4;
            getList()
        }
        $scope.countDownFun = function(){
            $scope.sortType=3;
            getList()
        }
        function pageFun () {
            if($scope.erpordTnum<=0){
                layer.msg('未找到订单')
                layer.closeAll("loading")
                return;
            }
            $("#c-pages-fun").jqPaginator({
                totalCounts: $scope.erpordTnum-0,//设置分页的总条目数
                pageSize: $scope.pageSize*1,//设置每一页的条目数
                visiblePages: 5,//显示多少页
                currentPage: $scope.pageNum*1,
                activeClass: 'active',
                prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
                next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
                page: '<a href="javascript:void(0);">{{page}}<\/a>',
                first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
                last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
                onPageChange: function (n,type) {
                    console.log(n)
                    console.log(n,type)
                    // alert(33333333333)
                    if(type=='init'){
                        layer.closeAll("loading")
                        return;
                    }
                    erp.load();
                    $scope.pageNum = n+'';
                    getList()
                }
            });
        }
        var starIndex = 0;
        $scope.changeBuyLinkStar = function ($event) {
            var $this = $($event.currentTarget);
            starIndex = $('.g-star').index($this)+1;
            console.log(starIndex)
            $this.addClass("click-star")
            $this.prevAll("span").addClass("click-star").end().nextAll("span").removeClass("click-star");
        }
        $scope.provinCFun = function () {
            $scope.cityList = [];
            if($scope.selProVal){
                $scope.provinFlag = true;
            }else{
                $scope.provinFlag = false;
                return
            }
            erp.postFun('caigou/supplier/getCities',{
                provinceid:$scope.selProVal
            },function (data) {
                console.log(data)
                $scope.cityList = data.data.result;
            },function (data) {
                console.log(data)
            })
        }
        var laHeiId;
        var laHeiStatus;
        $scope.laHeiFun = function (item) {
            $scope.laHeiFlag = true;
            laHeiId = item.id;
            laHeiStatus = 2;
        }
        $scope.surelaHeiFun = function (item) {
            erp.load()
            erp.postFun('caigou/supplier/updateSuplier',{
                id:laHeiId,
                status:laHeiStatus
            },function (data) {
                console.log(data)
                erp.closeLoad()
                if(data.data.statusCode == 200){
                    layer.msg('成功')
                    $scope.laHeiFlag = false;
                    $scope.pageNum = '1';
                    getList()
                }else{
                    layer.msg(data.data.message)
                }
            },function (data) {
                console.log(data)
                erp.closeLoad()
            })
        }
        $scope.addGysFun = function () {
            $scope.addGysFlag = true;
        }
        $scope.sureAddFun = function () {
            console.log(starIndex)
            if(!$scope.gysmcVal){
                layer.msg('请输入供应商名称')
                return
            }
            if(!$scope.gyLeiMuId){
                layer.msg('请选择类目')
                return
            }
            if(!$scope.lxrVal){
                layer.msg('请输入联系人')
                return
            }
            // if(!$scope.qqVal){
            //     layer.msg('请输入供应商QQ')
            //     return
            // }
            if(!$scope.phoneVal){
                layer.msg('请输入供应商电话')
                return
            }
            if(!$scope.selProVal){
                layer.msg('请输入省')
                return
            }
            if(!$scope.selCityVal){
                layer.msg('请输入市')
                return
            }  
            if (starIndex<1) {
                layer.msg('请设置星级')
                return
            }
            erp.load()
            var jsonObj = {};
            jsonObj.gongSiMing = $scope.gysmcVal;
            jsonObj.categoryId = $scope.gyLeiMuId;
            jsonObj.diQu = $scope.selCityVal;
            jsonObj.QQ = $scope.qqVal;
            jsonObj.shouji = $scope.phoneVal;
            jsonObj.weiXing = $scope.weiXinVal;
            jsonObj.wangwang = $scope.wangWangVal;
            jsonObj.xingJi = starIndex;
            jsonObj.lianXiRen = $scope.lxrVal;
            console.log(jsonObj)
            erp.postFun('caigou/supplier/addSupplier',JSON.stringify(jsonObj),function (data) {
                console.log(data)
                erp.closeLoad()
                if (data.data.statusCode==200) {
                    $scope.addGysFlag = false;
                    $scope.pageNum = '1';
                    getList()
                    $scope.gysmcVal = '';
                    $scope.selCityVal = '';
                    $scope.lxrVal = '';
                    $scope.phoneVal = '';
                    $scope.weiXinVal = '';
                    $scope.wangWangVal = '';
                    $scope.qqVal = '';
                    $scope.selProVal = '';
                    $scope.selCityVal = '';
                    $('.td-star span').removeClass("click-star")
                } else if(data.data.statusCode==1001){
                    layer.msg(data.data.message)
                    $scope.addGysFlag = false;
                } else {
                    layer.msg(data.data.message)
                }
            },function (data) {
                erp.closeLoad()
                console.log(data)
            })
        }
        erp.postFun('caigou/supplier/getErpCategory',{},function (data) {
            console.log(data)
            $scope.leiMuList = data.data.result;
        },function(data){
            console.log(data)
        })
        erp.postFun('caigou/supplier/getProvinces',null,function (data) {
            console.log(data)
            $scope.provinceList = data.data.result;
        },function (data) {
            console.log(data)
        })
        // $scope.showYellStar = function ($event) {
        //     var $this = $($event.currentTarget);
        //     $this.addClass('star').prevAll("span").addClass("click-star").end().nextAll("span").removeClass("click-star");
        // }
        // $scope.hideYellStar = function ($event) {
        //     var $this = $($event.currentTarget);
        //     $('.g-star').removeClass('star')
        //     // $this.removeClass('star').prevAll("span").removeClass("star");
        //     // $this.parent().find("span[index=10]").addClass("star").prevAll("span").addClass("star");
        // }
        $scope.detailFun = function (item) {
            window.open('#/supplier-gys/detail/'+item.id)
        }
    }])
    app.controller('supplier-gys-detail',['$scope','erp','$location','$routeParams',function ($scope,erp,$location,$routeParams){
        console.log('供应商详情')
        const api = {
            variantListUrl_old: 'caigou/supplier/getStan',//变体列表 {post locproductId: ''}
            variantListUrl: 'procurement/order/selectStanInfo',//变体列表 {post pid: ''} 
        }
        var gysId = $routeParams.id || '';
        console.log(gysId)
        // if (gysId) {
        //     erp.postFun('caigou/supplier/getSupplinerDetail',{
        //         gongYingShangId:gysId
        //     },function (data) {
        //         console.log(data)
        //     },function (data) {
        //         console.log(data)
        //     })
        // } else {
        //     layer.msg('供应商的id不能为空')
        //     location.href="#/supplier-gys"
        // }
        var beginStar;
        erp.postFun('procurement/order/getSupplinerDetail',{
            gongYingShangId:gysId
        },function (data) {
            console.log(data)
            $scope.gysDetailObj = data.data.data.gongYingShangVO;
            $scope.gysSpList = data.data.data.supplierlinkResultVOS;
            $scope.gysId = $scope.gysDetailObj.id;
            $scope.gysGsMc = $scope.gysDetailObj.gongSiMing;
            beginStar = $scope.gysDetailObj.xingJi;
            console.log($scope.gysDetailObj)
            console.log($scope.gysSpList)
        },function (data) {
            console.log(data)
        })
        $scope.szgysDjFun = function(id){
            erp.load()
            console.log(id)
            erp.postFun('caigou/supplier/updateSuplier',{
                id: id,
                xingJi: setStar
            },function(data){
                console.log(data)
                erp.closeLoad()
                if (data.data.statusCode==200) {
                    layer.msg('修改成功')
                    $scope.gysDetailObj.xingJi = setStar;
                    beginStar = $scope.gysDetailObj.xingJi;
                    $scope.changeSFlag = false;
                } else {
                    layer.msg(data.data.message)
                }
            },function(data){
                console.log(data)
                erp.closeLoad()
            })
        }
        $scope.bulkType = 'price';
        $scope.szgysjgFun = function (item) {
            $scope.spId = item.id;
            $scope.spLink = item.lianjie;
            erp.mypost(api.variantListUrl, { pid:item.id }).then(res => {
                console.log("TCL: $scope.szgysjgFun -> res", res)
                $scope.setGysFlag = true;
                $scope.spBtList = res;
            })
        }
        $scope.goBanSetSP = function () {
            if(!$scope.setTypeVal||$scope.setTypeVal<=0){
                layer.msg('请输入批量设置的数字')
                return
            }
            for(var i = 0,len=$scope.spBtList.length;i<len;i++){
                if ($scope.bulkType=='price') {
                    $scope.spBtList[i].costPrice = $scope.setTypeVal;
                } else {
                    $scope.spBtList[i].minCount = $scope.setTypeVal;
                }
            }
        }
        $scope.countFun = function(index,num){
            console.log(index,num)
            $scope.spBtList[index].minCount = num;
            console.log($scope.spBtList[index])
        }
        $scope.priceFun = function(index,num){
            console.log(index,num)
            $scope.spBtList[index].costPrice = num;
            console.log($scope.spBtList[index])
        }
        //确定设置
        $scope.goSetGysFun = function(){
            var updaArr = [];
            var notSelCount = 0;
            for(var i = 0,len=$scope.spBtList.length;i<len;i++){
                var updaObj = {};
                if($scope.spBtList[i].checked){
                    if(!$scope.spBtList[i].minCount){
                        layer.msg('请输入起批数量')
                        return
                    }else{
                       updaObj.minCount = $scope.spBtList[i].minCount 
                    }
                    if(!$scope.spBtList[i].costPrice){
                        layer.msg('请输入单价')
                        return
                    }else{
                        updaObj.costPrice = $scope.spBtList[i].costPrice
                    }
                    if($scope.spBtList[i].isSupplier==1){
                        updaObj.isSupplier = 1;
                    }else{
                        updaObj.isSupplier = 0;
                    }
                    updaObj.vid = $scope.spBtList[i].id
                    updaArr.push(updaObj)
                    console.log(updaArr)
                }else{
                   notSelCount++ 
                }
            }
            console.log(notSelCount)
            if($scope.spBtList.length==notSelCount){
                layer.msg('请选择变体')
                return
            }
            console.log('没有拦截掉')
            erp.load()
            var updaObj = {};
            updaObj.gysId = $scope.gysId;
            updaObj.spId = $scope.spId;
            updaObj.vList = updaArr;
            updaObj.gysGsMc = $scope.gysGsMc;
            updaObj.spLink = $scope.spLink;
            erp.postFun('caigou/supplier/updateGongHuoShang',JSON.stringify(updaObj),function(data){
                console.log(data)
                erp.closeLoad()
                if (data.data.statusCode==200) {
                    $scope.setGysFlag = false;
                } else {
                    layer.msg(data.data.message)
                }
            },function(data){
                console.log(data)
                erp.closeLoad()
            })
        }
        //全选
        $scope.checkAll = false;
        var selCount=0;
        $scope.checkAllLinkv = function () {
            console.log($scope.checkAll)
            if($scope.checkAll){
                selCount=$scope.spBtList.length;
            }else{
                selCount=0;
            }
            for(var i = 0,len=$scope.spBtList.length;i<len;i++){
                $scope.spBtList[i].checked = $scope.checkAll;
            }
            console.log(selCount)
        }
        $scope.checkOneLinkv = function (index,isCheck) {
            console.log(isCheck)
            if (isCheck) {
                selCount++
            } else {
                selCount--
            }
            $scope.spBtList[index].checked = isCheck;
            var checkCountNum = $scope.spBtList.length;
            console.log(selCount)
            if (selCount==$scope.spBtList.length) {
                $scope.checkAll = true;
            } else {
                $scope.checkAll = false;
            }
        }
        //是否停止供应
        $scope.stopSupply = function (item,index) {
            // console.log(item,index)
            console.log(item.isSupplier)
            if(!item.isSupplier||item.isSupplier==0){
                console.log('选中')
                $scope.spBtList[index].isSupplier = 1;
            }else if(item.isSupplier==1){
                console.log('取消')
               $scope.spBtList[index].isSupplier = 0; 
            }
            console.log($scope.spBtList[index].isSupplier)
            console.log(item)
        }
        // var beginStar = $scope.gysDetailObj.xingJi;
        // console.log(beginStar)
        var setStar;
        $scope.showYellStar = function (num,index,ev) {
            $(ev.target).addClass("star");
            $(ev.target).prevAll("a").addClass("star").end().nextAll("a").removeClass("star");
        }
        $scope.hideYellStar = function (num,index,ev,item) {
            console.log(setStar)
            if(setStar){
                $('#gys-outstar a').removeClass('star')
                for(var i = 0;i<setStar;i++){
                    $('#gys-outstar a').eq(i).addClass("star")
                }
            }else{
                $('#gys-outstar a').removeClass('star')
                for(var i = 0,len=item.xingJi;i<len;i++){
                    $('#gys-outstar a').eq(i).addClass("star")
                }
            }
        }
        $scope.changeBuyLinkStar = function (num,index,ev) {
            console.log(beginStar)
            setStar = $('#gys-outstar a').index($(ev.target))+1;
            if(beginStar != setStar){
                $scope.changeSFlag = true;
            } else{
                $scope.changeSFlag = false;
            }
            console.log(setStar)
            $scope.gysDetailObj.xingJi = setStar;
            $scope.$apply();
        }

        // $scope.showYStar = function(){
        //     $(ev.target).addClass("star");
        //     $(ev.target).prevAll("a").addClass("star").end().nextAll("a").removeClass("star");
        // }
        // $scope.hideYStar = function(){
        //     console.log(setStar)
        //     if(setStar){
        //         $('#gys-outstar a').removeClass('star')
        //         for(var i = 0;i<setStar;i++){
        //             $('#gys-outstar a').eq(i).addClass("star")
        //         }
        //     }else{
        //         $('#gys-outstar a').removeClass('star')
        //         for(var i = 0,len=item.xingJi;i<len;i++){
        //             $('#gys-outstar a').eq(i).addClass("star")
        //         }
        //     }
        // }
        // $scope.changeSPStar = function(){
        //     console.log(beginStar)
        //     setStar = $('#gys-outstar a').index($(ev.target))+1;
        //     if(beginStar != setStar){
        //         $scope.changeSFlag = true;
        //     } else{
        //         $scope.changeSFlag = false;
        //     }
        //     console.log(setStar)
        //     $scope.gysDetailObj.xingJi = setStar;
        //     $scope.$apply();
        // }
    }])
    app.controller('edit-supplier',['$scope','erp','$location',function ($scope,erp,$location) {
        console.log(222222)
        $('#star2').raty({
            readOnly: true
        });
        $('#star3').raty({
            // readOnly: true
            click: function(score, evt) {
                $scope.lev2=score;
                console.log( $scope.lev2);

            }
        });
        var sign = localStorage.getItem('id');
        erp.getFun('app/supplier/detail?sid='+sign, ue, err);
        function ue(n) {
            var obj=JSON.parse(n.data.result)
            console.log(obj)
            $scope.useritem=obj.supplier;
            $scope.produc=obj.products;
            $scope.operate=obj.operates;
            $scope.buyproduct=obj.buyProducts;
            $scope.editleixing=$scope.useritem.supplierType;
            $scope.editleimu=$scope.useritem.mainSaleCategory;
            $scope.editlinkman=$scope.useritem.linkman;
            $scope.edittel=$scope.useritem.tel;
            $scope.editqq=$scope.useritem.qq;
            $scope.editwechat=$scope.useritem.wechat;
            $scope.editwangwang=$scope.useritem.wangwang;
            $scope.editorigin=$scope.useritem.origin;
            console.log($scope.editleixing,$scope.editleimu,$scope.editlinkman,$scope.edittel,$scope.editqq,$scope.editwechat,$scope.editwangwang,$scope.editorigin,$scope.useritem.id)
        }
        function err(n) {
            console.log(n)
        }
        //    修改用户信息
        $scope.queryuser=function () {
            console.log($scope.editleixing,$scope.editleimu,$scope.editlinkman,$scope.edittel,$scope.editqq,$scope.editwechat,$scope.editwangwang,$scope.editorigin,$scope.useritem.id)
            $scope.window=false;
            erp.postFun('app/supplier/update', {"userId":"{8DA0EC3E-E4A7-4D9B-8876-2A025515EBE0}","token":"","data":"{'sid':'"+$scope.useritem.id+"','linkman':'"+$scope.editlinkman+"','origin':'"+$scope.editorigin+"','qq':'"+$scope.editqq+"','tel':'"+$scope.edittel+"','supplierType':'"+$scope.editleixing+"','wangwang':'"+$scope.editwangwang+"','wechat':'"+$scope.editwechat+"','cid':'{1126E280-CB7D-418A-90AB-7118E2D97CCC}','lev':'"+$scope.lev2+"','operator':'wangwu'}"}, upb, err);
            function  upb(n) {
                console.log(n.data.result)
                $location.path('/supplier-manage')
            }
        }
    }])
})()