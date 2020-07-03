;~function () {
    let app = angular.module('warehouse-app');
    //批次列表
    app.controller('piciCtrl', ['$scope', "erp", "$routeParams","utils", function ($scope, erp, $routeParams,utils) {
        console.log('erpdepotInCtrl');
        console.log($routeParams.stu);
        // var loStore = localStorage.getItem('store')==undefined?'':localStorage.getItem('store');
        $scope.storeList = [
            {val:0,name:'义乌仓',check:false},
            {val:1,name:'深圳仓',check:false},
            {val:2,name:'美国仓',check:false},
            {val:4,name:'泰国仓',check:false},
        ]
        // if (loStore) {
        //     $scope.store = loStore-0;
        //     let index = $scope.store>2 ? $scope.store-1 : $scope.store
        //     $scope.storeList[index].check = true;
        //     console.log($scope.storeList)
        // }
        
        $scope.storageCallback = function({item}){
            if(!!item) $scope.store = item.dataId
            cgListFun()
        }

        var stuNum = $routeParams.stu || 0;
        $scope.listIndex = stuNum - 0;
        console.log($scope.listIndex);
        // 搜索
        $scope.chukuVal = ''
        $scope.startTime = ''
        $scope.endTime = ''
       
        //打开还原弹窗
        $scope.openRestore=function(){
            $('.zzc').show();
        };
        $scope.closeRestore=function(){
            $('.zzc').hide();
        }
        //还原批次状态
        $scope.RestoreFun=function(){
            var id = $('#RestoreInput').val();
            console.log(id)
            if(id==''){
                layer.msg('Please enter the batch number')
            }else{
                let idsArr = id.split(',')
                var data= {
                    "ids":idsArr
                };
                erp.load();
                erp.postFun('processOrder/pici/recoveryState',JSON.stringify(data),function(data){
                    erp.closeLoad();
                    if(data.data.code=='200'){
                        layer.msg('Successfully restored');
                        $('.zzc').hide();
                    }else{
                        layer.msg(data.data.message);
                    }
                },function(){
                    erp.closeLoad();
                });
            }
        }

        //点击表格行留下颜色
        $scope.TrClick = function (i) {
            $scope.focus = i;
        }


        // $scope.storeList = erp
        //   .getStorage()
        //   .map(_ => ({ val: _.dataId, name: _.dataName, check: false }));




        //共有仓库 入库
        $scope.pageSize = '50';
        $scope.pageNum = '1';
        $scope.totalNum = 0;
        $scope.totalPageNum = 0;
        $scope.searchTj = '';
        $scope.timeIndex = 1;
        $('.drk-time').eq(0).addClass('active');

        $scope.messageFlag = false;
        var clickItem;

        $scope.yandanren=false;
        function getOrderList(item){
            var data={
                cjOrderId:$scope.searchSku
            };
            erp.load();
            erp.postFun('storage/batchNumber/queryVerificationPerson',JSON.stringify(data),function(data){
                erp.closeLoad();
                console.log(data);
                if(data.data.statusCode=='200'){
                    console.log(data.data.result)
                    $.each(item,function(i,v){
                        v.yandanren = data.data.result
                        //v.yandanren = 'admin,anan,saber,lancer,caster,assisson,rider,archer'
                    });
                }
            },function(){
                layer.msg("失败");
                erp.closeLoad();
            });
        }
        //拉取到仓库列表并展示
        function cgListFun() {
            //获取仓库对应的到货单列表
            var cgData = {};
            cgData.data = {};
            console.log($scope.listIndex)
            switch ($scope.listIndex) {
                case 0:
                    cgData.data.status = '';
                    break;
                case 1:
                    cgData.data.status = '0';
                    break;
                case 2:
                    cgData.data.status = '1';
                    break;
                case 3:
                    cgData.data.status = '6';
                    break;
            }
            cgData.data.inputStr = $scope.searchSku;
            cgData.data.store = $scope.store;
            cgData.pageNum = $scope.pageNum - 0;
            cgData.pageSize = $scope.pageSize - 0;
            cgData.data.orderType = $scope.orderType;
            cgData.data.beginDate = $('#date1').val()
            cgData.data.endDate = $('#date2').val()
            cgData.data.outStatus = $scope.chukuVal
            $scope.piciList = [];
            console.log(cgData)
            erp.load()
            erp.postFun("processOrder/pici/list", JSON.stringify(cgData), bb, err,{layer:true});

            function bb(a) {
                console.log(a)
                layer.closeAll('loading')
                if (a.data.code == 200) {
                    console.log(a)
                    $scope.piciList = a.data.data.list;
                    $scope.totalNum = a.data.data.total;
                    console.log($scope.totalNum)
                    console.log($scope.piciList)
                    if($scope.piciList){
                        for(i=0;i<$scope.piciList.length;i++){
                            // $scope.ids.push($scope.piciList[i].id)
                        }
                    }
                    if($('#selectQuery').val()=='1'){
                        $scope.yandanren=true;
                        getOrderList($scope.piciList);
                    }else{
                        $scope.yandanren=false;
                    }
                    pageFun(erp, $scope);
                }
            };
        }

        function err(a) {
            layer.closeAll('loading')
            layer.msg("失败")
        };

        // 点击出库
        $scope.chukuIds = ''
        $scope.ischuku = false;
        $scope.weichukuList = []
        $scope.weichuku = function(ids){
            $scope.ischuku = true
            $scope.chukuIds = ids
            console.log(ids)
            erp.postFun("storage/pici/orderChuKuStatusList", {ids:ids}, function(res){
                layer.closeAll('loading')
                console.log(res)
                $scope.weichukuList = res.data.list
            }, function(){
                layer.closeAll('loading')
                layer.msg("失败")
            });
        }


        function clearAll(){
            $scope.startTime = ''
            $scope.endTime = ''
            $scope.pageSize = '50';
            $scope.pageNum = '1';
            $scope.searchTj = '';
            // $scope.timeIndex = 1;
        }
        $scope.searchChuku = function(){
            clearAll();
            cgListFun(erp,$scope)
        }
        

// 批量手动出库
$scope.IdArr = []
var cziIndex = 0;
$('#ea-list-table').on('click', '.cg-checkbox', function () {
    if ($(this).attr('src') == 'static/image/order-img/multiple1.png') {
        $(this).attr('src', 'static/image/order-img/multiple2.png');
        cziIndex++;
        if (cziIndex == $('#ea-list-table .cg-checkbox').length) {
            $('#ea-list-table .cg-checkall').attr('src', 'static/image/order-img/multiple2.png');
        }
    } else {
        $(this).attr('src', 'static/image/order-img/multiple1.png');
        cziIndex--;
        if (cziIndex != $('#ea-list-table .cg-checkbox').length) {
            $('#ea-list-table .cg-checkall').attr('src', 'static/image/order-img/multiple1.png');
        }
    }
    $scope.IdArr = cziIndex;
})
//全选
$('#ea-list-table').on('click', '.cg-checkall', function () {
    console.log('123')
    if ($(this).attr('src') == 'static/image/order-img/multiple1.png') {
        $(this).attr('src', 'static/image/order-img/multiple2.png');
        cziIndex = $('#ea-list-table .cg-checkbox').length;
        $('#ea-list-table .cg-checkbox').attr('src', 'static/image/order-img/multiple2.png');
    } else {
        $(this).attr('src', 'static/image/order-img/multiple1.png');
        cziIndex = 0;
        $('#ea-list-table .cg-checkbox').attr('src', 'static/image/order-img/multiple1.png');
    }
    $scope.IdArr = $scope.ids
})
$scope.chukuSelect = function(){
    var bulkCount = 0;
    bulkId = '';
    $('#ea-list-table .cg-checkbox').each(function () {
        if ($(this).attr('src') == "static/image/order-img/multiple2.png") {
            bulkCount++;
            // bulkId += $(this).siblings('.cg-list-id').text() + ',';
            bulkId += $(this).parent().siblings('.cg-list-id').children().text() + ',';
            console.log($(this).parent().siblings('.cg-list-id').children())
        }
        // console.log($(this).parent().siblings('.cg-list-id').children().text())
    })
    if (bulkCount < 1) {
        layer.msg('请选择')
    } else {
        $scope.bulkTxFlag = true;
    }
    let idsArr = bulkId.split(',')
    idsArr.pop();
    console.log(bulkId)
    erp.load();
    erp.postFun('processOrder/pici/updatePiCiStatus',{ids:idsArr},function(data){
        erp.closeLoad();
        console.log(data)
        if(data.data.code=='200'){
            cgListFun()
        }else{
            layer.msg(data.data.message);
        }
    },function(){
        erp.closeLoad();
    });
   
}




        //分页
        function pageFun(erp, $scope) {
            if ($scope.totalNum <0) {
                layer.closeAll('loading')
                return;
            }
            $("#pagination1").jqPaginator({
                totalCounts: $scope.totalNum || 1,
                pageSize: $scope.pageSize * 1,
                visiblePages: 5,
                currentPage: $scope.pageNum * 1,
                activeClass: 'current',
                first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
                prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
                next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
                last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
                page: '<a href="javascript:void(0);">{{page}}<\/a>',
                onPageChange: function (n, type) {
                    if (type == 'init') {
                        return;
                    }
                    $('.erp-load-tbody').show();
                    erp.loadPercent($('.erp-load-box'), 500);
                    $scope.piciList = [];
                    $scope.pageNum = n - 0;
                    cgListFun();
                }
            });
        }

        $scope.toOrdFun = function (item) {
            window.open('#/zi-all//'+item.id)
        }
        //分面单的弹框
        $scope.fenDanFun = function (item) {
            // $scope.fendanObj = item.fenDan;
            layer.load(2);
            $scope.fendanObj='';
            erp.postFun("processOrder/pici/getColumnData", {id:item.id}, function (res) {
                layer.closeAll('loading');
                $scope.fenDanFlag = true;
                if(res.data.data){
                    $scope.fendanObj = JSON.parse(res.data.data[0].lanZi);
                }else{
                    layer.msg('没有详情信息')
                }
            }, function (data) {
                console.log(data)
                layer.closeAll('loading')
            })
        }
        $scope.closeFenDanFun = function () {
            $scope.fenDanFlag = false;
            $scope.fendanObj = {};
        }
        $scope.copyMdFun = function(){
            var Url2=document.getElementById("pdf-link-json");
            Url2.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            console.log(Url2)
            layer.msg("复制成功,有问题交给IT");
        }
        //打单
        $scope.miandanData = [];
        let dataObj = '';
        let daDanIndex = '';
        var base64 = new Base64();
        var loginName = localStorage.getItem('erploginName') ? base64.decode(localStorage.getItem('erploginName')) : ''
        $scope.DaDanFun = function (item,index) {
            console.log(item)
            console.log(item.codeUrl)
            daDanIndex = index;
            // $scope.codeUrl = item.codeUrl; //获取带时间的批次条码
            console.log(loginName)
            if (item.daDanUserId) {
                if (item.daDanUserId != loginName) {
                    layer.msg('你没有重复打单的权限！')
                    return;
                }
            }
            console.log(123123)
            layer.load(2)
            erp.postFun('processOrder/pici/getColumnData',{id:item.id}, function(res) {
                layer.closeAll();
                dataObj = res.data.data[0];
                $scope.dadanFlag = true;
                console.log('打单数据，打单数据'+dataObj.daDan)
            })
        }

        //面单域名转换
        $scope.isCn = false;
        $scope.cnChangeFun = ()=>{
            $scope.miandanData=$scope.miandanData.map(item=>{
                if($scope.isCn){
                    item = item.replace('miandan.cjdropshipping.cn', 'miandan.cjdropshipping.com');
                    item = item.replace('cc-west-usa.oss-accelerate.aliyuncs.com','cc-west-usa.oss-us-west-1.aliyuncs.com')
                    $scope.codeUrl = $scope.codeUrl.replace('cc-west-usa.oss-accelerate.aliyuncs.com','cc-west-usa.oss-us-west-1.aliyuncs.com')
                    layer.msg('国际域名转换成功');
                }else{
                    item = item.replace('miandan.cjdropshipping.com', 'miandan.cjdropshipping.cn');
                    // yangyulei 阿里云链接加速处理
                    item = item.replace('cc-west-usa.oss-us-west-1.aliyuncs.com','cc-west-usa.oss-accelerate.aliyuncs.com')
                    $scope.codeUrl = $scope.codeUrl.replace('cc-west-usa.oss-us-west-1.aliyuncs.com','cc-west-usa.oss-accelerate.aliyuncs.com')
                    layer.msg('国内域名转换成功');
                }
                return item;
            })
            $scope.isCn = !$scope.isCn;
        }
        $scope.Ybtn = function () {
            var datas = {
                code: dataObj.id
            }

            erp.load()
            erp.postFun("processOrder/pici/scanPiCiGetMianDan", datas, function (res) {
                console.log('打单数据，打单数据'+dataObj.daDan)
                console.log(res)
                layer.closeAll('loading')
                if (res.data.code == 200) {
                    $scope.piciList[daDanIndex].daDanUserId = loginName;
                    var date = new Date().getTime();
                    date = utils.changeTime(date,true)
                    $scope.piciList[daDanIndex].daDanDate = date
                    console.log($scope.piciList[daDanIndex])
                    if(res.data.data.flag == '1' || $scope.piciList[daDanIndex].mianDanUrl == '[""]' || !$scope.piciList[daDanIndex].mianDanUrl){
                        erp.load()
                        erp.postFun2("getExpressSheet.json", {ids: dataObj.daDan}, function (data) {
                            console.log('打单数据，打单数据'+dataObj.daDan)
                            console.log(data)
                                layer.closeAll('loading')
                                $scope.dadanURL = true;
                                $scope.dadanFlag = false;
                                $scope.miandanData = data.data;
                                $scope.miandanData.forEach(function (o, i) {
                                    console.log(o)
                                    if(o!=null) {
                                        $scope.miandanData[i] = o.replace('https://', '').replace('http://', '');
                                    }else{
                                        $scope.miandanData[i] = "第"+(i+1)+"链接为null";
                                    }
                                })
                                console.log($scope.miandanData)
                        }, function (data) {

                        })
                    }else if(JSON.parse(res.data.data).flag == '0'){
                        console.log(JSON.parse(res.data.data));
                        //layer.closeAll('loading')
                        $scope.dadanURL = true;
                        $scope.dadanFlag = false;
                        $scope.miandanData = JSON.parse(res.data.data).url;
                        $scope.miandanData.forEach(function (o, i) {
                            console.log(o)
                            if(o!=null) {
                                $scope.miandanData[i] = o.replace('https://', '').replace('http://', '');
                            }else{
                                $scope.miandanData[i] = "第"+(i+1)+"链接为null";
                            }
                        })
                        console.log($scope.miandanData)
                    }

                } else if (res.data.code == 401) {
                    //layer.closeAll('loading')
                    layer.msg(res.data.message)
                }
                erp.postFun('processOrder/pici/getPiciHaoWithPrinterDate',{
                    id: dataObj.id
                },function(data){
                    console.log(data)
                    $scope.codeUrl = data.data.data;
                    console.log($scope.codeUrl)
                })
            }, function (res) {
                //layer.closeAll('loading')
            })
        }
        $scope.Allbtn = function () {
            var datas = {
                code: $scope.piciList[daDanIndex].id
            }
            erp.load()
            erp.postFun("processOrder/pici/scanPiCiGetMianDan", datas, function (res) {
                console.log(res)
                layer.closeAll('loading')
                if (res.data.code == 200) {
                    $scope.piciList[daDanIndex].daDanUserId = loginName;
                    var date = new Date().getTime();
                    date = utils.changeTime(date,true)
                    $scope.piciList[daDanIndex].daDanDate = date
                    // console.log()
                    if(res.data.data.flag == '1' || $scope.piciList[daDanIndex].mianDanUrl == '[""]'){
                        erp.load()
                        erp.postFun2("getExpressSheet.json", {ids: dataObj.daDan}, function (data) {
                            console.log(data)
                            layer.closeAll('loading')
                        /* $scope.dadanURL = true;
                            $scope.dadanFlag = false;
                            $scope.miandanData = data.data;
                            $scope.miandanData.forEach(function (o, i) {
                                console.log(o)
                                $scope.miandanData[i] = o.replace('https://', '').replace('http://', '');
                            })
                            console.log($scope.miandanData)*/
                        if(data.data.length>0){
                            data.data.unshift($scope.codeUrl);
                            erp.postFun2("mergeSheet.json",data.data,function (res1) {
                                layer.closeAll('loading')
                                console.log(res1)
                                $scope.dadanURL = true;
                                $scope.dadanFlag = false;
                                $scope.miandanData = res1.data;
                                $scope.miandanData.forEach(function (o, i) {
                                    console.log(o)
                                    $scope.miandanData[i] = o.replace('https://', '').replace('http://', '');
                                })
                            })
                        }else {
                            $scope.dadanFlag = false;
                            layer.msg('数据错误')

                        }
                        }, function (data) {

                        })
                    }else if(res.data.data.flag == '0'){
                        var parms = res.data.data.url;
                        parms.unshift($scope.codeUrl)
                        erp.postFun2("mergeSheet.json",parms,function (res1) {
                            layer.closeAll('loading')
                            console.log(res1)
                            $scope.dadanURL = true;
                            $scope.dadanFlag = false;
                            $scope.miandanData = res1.data;
                            $scope.miandanData.forEach(function (o, i) {
                                console.log(o)
                                $scope.miandanData[i] = o.replace('https://', '').replace('http://', '');
                            })
                        })

                        console.log($scope.miandanData)
                    }

                } else if (res.data.code == 401) {
                    //layer.closeAll('loading')
                    layer.msg(res.data.message)
                }
                erp.postFun('processOrder/pici/getPiciHaoWithPrinterDate',{
                    id: dataObj.id
                },function(data){
                    console.log(data)
                    $scope.codeUrl = data.data.data;
                    console.log($scope.codeUrl)
                })
            }, function (res) {
                //layer.closeAll('loading')
            })
        }
        $scope.pcibtn = function () {
            var datas = {
                // code: {ids: dataObj.daDan}.id
                code:dataObj.id
            }
            erp.load()
            erp.postFun("processOrder/pici/scanPiCiGetMianDan", datas, function (res) {
                console.log(res)
                layer.closeAll('loading')
                if (res.data.code == 200) {
                    $scope.piciList[daDanIndex].daDanUserId = loginName;
                    var date = new Date().getTime();
                    date = utils.changeTime(date,true)
                    $scope.piciList[daDanIndex].daDanDate = date
                    console.log(res.data.data);
                    //layer.closeAll('loading')
                    $scope.dadanURL = true;
                    $scope.dadanFlag = false;
                    var codeUrl = res.data.data.codeUrl || '';
                    $scope.codeUrl = codeUrl.replace('https://', '').replace('http://', '');
                } else {
                    //layer.closeAll('loading')
                    layer.msg(res.data.message)
                }
            }, function (res) {
                //layer.closeAll('loading')
            })
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
        //分货
        $scope.fenHuoFun = function (item) {
            $scope.fenHuoFlag = true;
            $scope.fenhuoObj = item.fenHuo;
        }
        $scope.closeFenHuoFun = function () {
            $scope.fenHuoFlag = false;
        }
        $scope.showBtFun = function (item, ev, index) {
            layer.load(2);
            erp.postFun('processOrder/pici/getColumnData',{id:item.id}, (res)=> {
                layer.closeAll();
                if(res.data.data){
                    $scope.piciList[index].zhaoFenHuo= JSON.parse(res.data.data[0].zhaoFenHuo);
                }else{
                    layer.msg('没有详情信息')
                }
                
            })
            $(ev.target).toggleClass('.glyphicon glyphicon-triangle-top');
            console.log(item.isShow)
            if(item.isShow){
                item.isShow = false
            }else{
                item.isShow = true
            }
            // if ($(ev.target).parent().parent().parent().siblings('.second-tr').is(":hidden")) {
            //     $(ev.target).parent().parent().parent().siblings('.second-tr').show()
            // } else {
            //     $(ev.target).parent().parent().parent().siblings('.second-tr').hide()
            // }
        }

        // cgListFun(erp, $scope);
        $scope.changePageSize = function () {
            $scope.pageNum = '1';
            cgListFun(erp, $scope);
        }
        $scope.toSpecifiedPage = function () {
            if ($scope.pageNum == "" || $scope.pageNum == null || $scope.pageNum == undefined){
                layer.msg("错误页码");
                return;
            }
            if ($scope.pageNum == 0){
                $scope.pageNum = 1;
            }
            var totalPage = Math.ceil($scope.totalNum / $scope.pageSize);
            if($scope.pageNum > totalPage){
                layer.msg("错误页码");
                return;
            }
            cgListFun(erp, $scope);
        }
        //搜索
        $('.top-search-inp').keypress(function (Event) {
            if (Event.keyCode == 13) {
                $scope.searchFun();
            }
        })
        $scope.searchFun = function () {
            $scope.pageNum = '1';
            cgListFun(erp, $scope);
        }


        //显示大图
        $('#ea-list-table').on('mouseenter', '.s-img', function () {
            $(this).siblings('.hide-bigimg').show();
        })
        $('#ea-list-table').on('mouseenter', '.hide-bigimg', function () {
            $(this).show();
        })
        $('#ea-list-table').on('mouseleave', '.s-img', function () {
            $(this).siblings('.hide-bigimg').hide();
        })
        $('#ea-list-table').on('mouseleave', '.hide-bigimg', function () {
            $(this).hide();
        })
        //合并导出
        $scope.dcHbFun = function (item) {
            $scope.isdcflag = false;//关闭询问弹框
            erp.load();
            let ids = {};
            // ids.ids = item.daDan;
            erp.postFun('processOrder/pici/getColumnData',{id:item.id},function (res) {
                ids.ids = res.data.data[0].daDan;
                ids.type = 1;
                console.log(JSON.stringify(ids))
                erp.postFun('app/order/exportErpOrder',JSON.stringify(ids),function (data) {
                    console.log(data)
                    var href = data.data.href;
                    console.log(href)
                    layer.closeAll("loading")
                    if (href.indexOf('https')>=0) {
                        // $scope.dcflag = true;
                        window.location.href = href;
                        $scope.hrefsrc = href;
                        console.log($scope.hrefsrc)
                    } else {
                        layer.msg('导出失败')
                    }
                },function (data) {
                    layer.closeAll("loading")
                    console.log(data)
                })
            },function (data) {
                layer.closeAll("loading")
                console.log(data)
            })
            
        }
        $scope.closeatc = function () {
            $scope.dcflag = false;
        }
        // 出库
        $scope.chukuFun = function(item){
            var upJson = {};
            let idArr = [];
            idArr.push(item.id)
            upJson.ids = idArr;
            erp.postFun('processOrder/pici/updatePiCiStatus',upJson,function (data) {
                console.log(data)
                if(data.data.code==200){
                    // layer.msg('出库成功')
                    cgListFun(erp, $scope);
                }
            },function (data) {
                layer.closeAll("loading")
                console.log(data)
            },{layer:true})
        }
        // 留言
       
        $scope.isMark = false
        $scope.ids = ''
        $scope.reason = ''
        $scope.addRemark = function(item){
            console.log(item)
            $scope.isMark = true
            $scope.ids = item.orderId;
            $scope.chukuReason = item.reason
            $scope.reason = $scope.chukuReason
        }
        $scope.sureEdit = function(){
            erp.load();
            var datas = {};
            datas.reason = $scope.reason;
            datas.id = $scope.ids;
            console.log($scope.ids)
            erp.postFun('storage/pici/addNotOutReason',JSON.stringify(datas),function (data) {
                console.log(data)
                layer.closeAll("loading")
                if(data.data.statusCode==200){
                    $scope.isMark = false
                    $scope.ischuku = true
                    erp.postFun("storage/pici/orderChuKuStatusList", {ids:$scope.chukuIds}, function(res){
                        layer.closeAll('loading')
                        console.log(res)
                        $scope.weichukuList = res.data.list
                    }, function(){
                        layer.closeAll('loading')
                        layer.msg("失败")
                    });
                }else{
                    $scope.isMark = false
                    layer.msg('失败')
                }
            },function (data) {
                layer.closeAll("loading")
                console.log(data)
            })
        }
        $scope.cancelEdit = function(){
            $scope.reason = $scope.chukuReason
            $scope.isMark = false
        }
        
        //义乌 深圳 美国
        $scope.storeFun = function (item) {
            if(item.check){
                item.check=false;
                $scope.store = '';
                localStorage.removeItem('store')
            }else{
                $scope.storeList.forEach(item=>{
                    item.check=false;
                })
                item.check=true;
                $scope.store = item.val;
                localStorage.setItem('store',item.val)
            }
            /* if ($(ev.target).hasClass('two-ck-activebtn')) {
                $(ev.target).removeClass('two-ck-activebtn')
                
                
            } else {
                $('.two-ck-btn').removeClass('two-ck-activebtn')
                $(ev.target).addClass('two-ck-activebtn');
                
            } */
            $scope.pageNum = '1';
            cgListFun(erp, $scope);
        }
        $scope.storeFun0 = function (ev) {
            $scope.store = 0;
            if ($(ev.target).hasClass('two-ck-activebtn')) {
                $(ev.target).removeClass('two-ck-activebtn')
                $scope.store = '';
                localStorage.removeItem('store')
            } else {
                $('.two-ck-btn').removeClass('two-ck-activebtn')
                $(ev.target).addClass('two-ck-activebtn');
                localStorage.setItem('store',0)
            }
            $scope.pageNum = '1';
            cgListFun(erp, $scope);
        }
        $scope.storeFun1 = function (ev) {
            $scope.store = 1;
            if ($(ev.target).hasClass('two-ck-activebtn')) {
                $(ev.target).removeClass('two-ck-activebtn')
                $scope.store = '';
                localStorage.removeItem('store');
                item.check=false;
            } else {
                localStorage.setItem('store',item.val)
                $scope.storeList.forEach(item=>{
                    item.check=false;
                })
                item.check=true;
            }
            $scope.pageNum = '1';
            cgListFun(erp, $scope);
        }
        //单品、多品、补发单选择
        $scope.orderTypeList = [
            {name:'单品',val:'0',check:false},
            {name:'多品',val:'1',check:false},
            {name:'补发单',val:'2',check:false}
        ]
        $scope.orderTypeFun = (item)=>{
            $scope.orderType = item.name;
            if (item.check) {
                $scope.orderType = '';
                item.check=false;
            } else {
                $scope.orderTypeList.forEach(item=>{
                    item.check=false;
                })
                item.check=true;
            }
            $scope.pageNum = '1';
            cgListFun(erp, $scope);
        }
    }])
}();