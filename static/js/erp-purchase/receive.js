(function (angular) {
    var app = angular.module('barcodeApp', ['service']);
    app.controller('barcodeAppCtrl', ['$scope', "erp", "$timeout", "$http", function ($scope, erp, $timeout,
        $http) {
        $scope.condition = 'latestVersion';//  新增泰国仓查询 接口不一致  显示不一样 (oldVersion 3种情况  latestVersion 泰国地区 操作)
        $scope.list = [];//新增需求 产品列表
        $scope.errorbox = false;//显示隐藏 异常操作窗口
        $scope.logisticsName = '';
        $scope.logisticsNumber = '';
        $scope.params = {//异常提交所需参数
            id: '',
            badNum: 0,//异常数量ba
            productNum: 0,
            badType: '',//异常类型
            badRemark: '' //描述
        };
        /* 搜索对象 */
        $scope.filterObj = {
            procurementType: '',
            store: '',
            storeType:''
        }
        /* 仓库 */
        $scope.storeList = erp.getWarehouseType();
        /* 采购方式 */
        $scope.purchaseList = [
            {name:'全部',val:''},
            {name:'1688非API',val:'0'},
            {name:'1688API',val:'1'},
            {name:'淘宝',val:'2'},
            {name:'天猫',val:'3'},
            {name:'线下',val:'4'},
        ]
        /* 库区 */
        $scope.storeTypeList = [
            { name: '全部区', val: '' },
            { name: '直发区', val: '1' },
            { name: '代发区', val: '2' },
        ]
        $scope.showErrBox = function ({id}) {
            layer.load(2);
            erp.postFun('supplier/supplierPackageProduct/number/exception/detail', {id}, function({data}) {
                layer.closeAll('loading');
                const { data: res, code, error } = data;
                if (code !== 200) return layer.msg(error || '系统错误 请联系管理员');
                console.log('getErrBoxInfoHttp', res)
                const { badRemark, badType, badNum, productNum } = res;
                $scope.errorbox = true;
                $scope.params = {//异常提交所需参数
                    id,
                    badNum: +badNum || 0,//异常数量ba
                    productNum: +productNum || 0, //商品数量 异常数量不能大于 商品数量
                    badType: badType ? badType + '' : '',//异常类型
                    badRemark: badRemark || '' //描述
                };
                console.log('get errboxinfo', $scope.params)
            }, function(err) {
                console.log('err', err);
                layer.msg('系统错误 请联系管理员');
            })
        }
        $scope.hideErrBox = function() {//隐藏操作窗口
            $scope.params = { id: '',  badNum: 0, productNum: 0, badType: '', badRemark: '' };
            $scope.errorbox = false;
        }
        const submitErrorThottle = throttle(submitErrorHttp)
        $scope.submitError = function() {//提交异常
            console.log('submitError params', $scope.params)
            let { id, badType, badRemark, badNum, productNum } = $scope.params;
            if (!id) return layer.msg('未定位到异常 请重新操作');
            if (!badType) return layer.msg('请选择异常原因');
            if (!badRemark) return layer.msg('请填写异常描述');
            if (badNum == 0) return layer.msg('提交异常数量须大于0');
            if (badNum > productNum) return layer.msg('异常数量不能大于商品数量');
            $scope.params.badType = badType + '';
            submitErrorThottle()
        }
        $scope.handleNumberLimit = function() {// 异常数量不能大于 商品数量
            let { badNum, productNum } = $scope.params;
            if (+badNum > +productNum) {
                $scope.params.badNum = +productNum;
            }
        }
        function submitErrorHttp() {//提交异常 http
            layer.load(2);
            erp.postFun('supplier/supplierPackageProduct/number/exception/update', $scope.params, function() {
                layer.closeAll('loading');
                $scope.errorbox = false;
                layer.msg('异常提交成功');
            }, function(err) {
                console.log('err', err);
                $scope.errorbox = false;
                layer.msg('异常提交失败 请重新操作');
            })
        }
        function throttle(fn, wait=1) {
            let lastTime = Date.now();
            return function() {
                let currentTime = Date.now();
                if (currentTime - lastTime > wait * 1000) {
                    lastTime = currentTime;
                    fn.apply(this, arguments)
                }
            }
        }
        $scope.print = function() {
            const list = $scope.list;
            if (!list || list.length === 0) return;
            const skuMap = {}
            list.forEach(({num, sku, productNum}) => {
                skuMap[num] = {
                    sku, sum: productNum
                }
            })
            console.log('skuMap', { skuMap })
            var printLink;
            erp.postFun('app/pdfOpt/getBarcode128Batch', JSON.stringify({ skuMap }), function (
                data) {
                console.log(data)
                layer.closeAll('loading');
                if (data.data.code == '200') {
                    printLink = data.data.pdfFillUrl;
                } else {
                    printLink = 'error';
                }

            }, function (data) {
                layer.closeAll('loading');
                printLink = 'error';
            })

            var printTimer = setInterval(function () {
                console.log('100')
                if (printLink == 'error') {
                    layer.msg('打印错误')
                    clearInterval(printTimer);
                    printLink = null;
                    console.log('error');
                } else if (printLink) {
                    window.open('https://' + printLink, '_blank', '');
                    clearInterval(printTimer);
                    printLink = null;
                    console.log('succsee');
                }
            }, 100);
        }
        function queryList() {
            let code = $.trim($("#tx").val());
            console.log('code', code)
            layer.load(2);
            const url = 'supplier/supplierPackageProduct/package/signIn' + '?logisticsNumber=' + code;
            erp.getFun(url, function (data) {
                console.log(data)
                layer.closeAll('loading');
                var arrives = data.data && data.data.data;
                // 数据为null时，设置空数组，执行后续操作，避免报错
                if(arrives === null) {
                    arrives = []
                }
                if (!arrives || arrives.length === 0) {
                    handleOldVersion()
                }
                arrives.forEach(item => {
                    let sku = item.sku;
                    item.skuLeft = sku.substring(0, 14)
                    item.skuRight = sku.substr(14)
                })
                $scope.list = arrives;
                if (arrives && arrives.length > 0) {//追踪号
                    const {logisticsName, logisticsNumber} = arrives[0]
                    $scope.logisticsName = logisticsName;
                    $scope.logisticsNumber = logisticsNumber;
                }
                $("#tx").val('')
            }, function(err) {
                console.log('err ->> ', err)
                handleOldVersion()
            })
        }
        function handleOldVersion() {//新功能接口调用改完后  调用老版本功能 
            $scope.condition = 'oldVersion';
            $scope.showSpFun();
        }
        
        var nowDate = timestampToDate(new Date());
        var bs = new Base64();
        var erpLoginName = bs.decode(localStorage.getItem('erploginName') == undefined ? '' :
            localStorage.getItem('erploginName'));
        var userId = bs.decode(localStorage.getItem('erpuserId') == undefined ? '' : localStorage
            .getItem('erpuserId'));

        $scope.showDesign = false;
        $scope.WaringTxt = '';
        $("#tx").focus();
        $(document).click(function () {
            $("#tx").focus();
        })
        $scope.seachKeyFun = function (e) {
            var keycode = window.event ? e.keyCode : e.which;
            console.log(keycode)
            if (keycode == 13) {
                $scope.fuwuFun();
            }
        }
        $scope.fwQsFun = function (stu) {
            $scope.qsStu = stu;
            $scope.isQianSFlag = true;
        }
        $scope.sureQsFwFun = function () {
            let csArr = [];
            for (let i = 0, len = $scope.listArr[0].productStanList.length; i < len; i++) {
                let obj = {};
                obj.customerId = $scope.listArr[0].createUserId;
                obj.customerName = $scope.listArr[0].createName;
                obj.dbProductId = $scope.listArr[0].dbProductId;
                obj.serverOrderId = $scope.listArr[0].id;
                obj.trackingNumber = $scope.listArr[0].trackingNumber;
                obj.batchNumber = $scope.listArr[0].batchNumber;
                obj.stanId = $scope.listArr[0].productStanList[i].id;
                obj.stanSku = $scope.listArr[0].productStanList[i].sku;
                obj.stanImg = $scope.listArr[0].productStanList[i].img;
                obj.actualNum = $scope.listArr[0].productStanList[i].actualNum;
                obj.damageNum = $scope.listArr[0].productStanList[i].damageNum;
                obj.id = $scope.listArr[0].productStanList[i].orderStanId;
                csArr.push(obj)
            }
            if ($scope.qsStu == 1) { //拒绝签收
                erp.postFun('erp/serveProduct/refusalStanAndNum', csArr, function (data) {
                    layer.msg(data.data.message)
                    if (data.data.statusCode == 200) {
                        console.log($scope.listArr)
                        $scope.isQianSFlag = false;
                        $scope.qsSeaFlag = false;
                        $scope.listArr = [];
                        $('#tx').val('')
                    }
                }, function (data) {
                    console.log(data)
                }, {
                    layer: true
                })
            } else if ($scope.qsStu == 2) { //确定签收
                erp.postFun('erp/serveProduct/signforStanAndNum', csArr, function (data) {
                    console.log(data)
                    layer.msg(data.data.message)
                    if (data.data.statusCode == 200) {
                        console.log($scope.listArr)
                        $scope.isQianSFlag = false;
                        $scope.listArr = [];
                        $scope.qsSeaFlag = false;
                        $('#tx').val('')
                    }
                }, function (data) {
                    console.log(data)
                }, {
                    layer: true
                })
            }

        }
        $scope.hqFwmdFun = function () {
            let arr = [];
            arr.push($scope.listArr[0].miandan)
            layer.load(2)
            erp.postFun2('createPdfInfo.json', JSON.stringify(arr), function (data) {
                console.log(data)
                $scope.pdfLink = data.data.url;
                $scope.fwPdfFlag = true;
                layer.closeAll('loading')
            }, function (data) {
                layer.closeAll('loading')
            })
        }
        $scope.isSureJuShouFun = function () {
            $scope.isJuJueFlag = true;
        }

        function ruKuCountFun(arr) {
            let len = arr.length;
            for (let i = 0; i < len; i++) {
                if (!arr[i].actualNum) {
                    arr[i].actualNum = 0;
                }
                if (!arr[i].damageNum) {
                    arr[i].damageNum = 0;
                }
                arr[i].validNum = arr[i].actualNum - arr[i].damageNum;
            }
            return arr;
        }
        $scope.sureJuJueFwFun = function () { //确定拒签
            erp.postFun('erp/serveProduct/refuseToSign', ruKuCountFun($scope.listArr),
                function (data) {
                    console.log(data)
                    layer.msg(data.data.message)
                    if (data.data.statusCode == 200) {
                        $scope.isJuJueFlag = false;
                        $scope.bianJiFlag = false;
                        $scope.listArr = [];
                        $scope.fuwuInpVal = '';
                    }
                },
                function (data) {
                    console.log(data)
                }, {
                    layer: true
                })
        }
        $scope.isNumFun = function (item, key, shiShouCount) {
            console.log(item.damageNum, shiShouCount, item.damageNum > shiShouCount)
            item[key] = item[key].replace(/[^\d]/g, '')
            if ((item.damageNum - 0) > (shiShouCount - 0)) {
                layer.msg('损坏数量不能大于实收')
                item.damageNum = 0;
                return
            }
            if ((shiShouCount - 0) > (item.num - 0)) {
                item.damageNum = 0;
                item.actualNum = 0;
            }
        }
        var responseObj;
        var storageId;
        var menuId;
        var ydhGlobelNum;
        //扫码展示商品信息
        var code;
        var isCheckEndFlag = false;
        var timer;
        $scope.showSpFun = function () {
            code = $.trim($("#tx").val());
            if (code == null || code == "")  return;  
            // console.log($scope.ydhList)
            if (timer) {
                $timeout.cancel(timer);
            }
            $scope.itemObj = null;
            showProduct()

            // if (isCheckEndFlag) {
            //     if (timer) {
            //         $timeout.cancel(timer);
            //     }
            //     $scope.itemObj = null;
            //     showProduct()
            // } else {
            //     if (code.length < 8) {
            //         tieBiaoJiLu(code)
            //         for (var i = 0, len = $scope.ydhList.length; i < len; i++) {
            //             if (code == $scope.ydhList[i].shortSku) {
            //                 $('.qianshou-tr').removeClass('gold-back')
            //                 $('.qianshou-tr').eq(i).addClass('gold-back')
            //                 $scope.itemObj = $scope.ydhList[i];
            //                 $('#tx').val('')
            //                 $scope.$apply()
            //                 console.log($scope.ydhList[i])
            //                 $('.modal-body').animate({
            //                     scrollTop: i * $('.qianshou-tr').eq(0).height()
            //                 }, 1000);
            //                 // $scope.$apply();
            //                 break
            //             }
            //             if (i == len - 1) {
            //                 $('.qianshou-tr').removeClass('gold-back')
            //                 $('.audio-shibai').get(0).play();
            //             }
            //         }
            //     } else if (code.toUpperCase().indexOf('CJ') != -1) {
            //         tieBiaoJiLu(code)
            //         for (var i = 0, len = $scope.ydhList.length; i < len; i++) {
            //             if (code == $scope.ydhList[i].sku) {
            //                 $('.qianshou-tr').removeClass('gold-back')
            //                 $('.qianshou-tr').eq(i).addClass('gold-back')
            //                 $scope.itemObj = $scope.ydhList[i]
            //                 $('#tx').val('')
            //                 $scope.$apply()
            //                 $('.modal-body').animate({
            //                     scrollTop: i * $('.qianshou-tr').eq(0).height()
            //                 }, 1000);
            //                 console.log($('.qianshou-tr').eq(0).height())
            //                 break
            //             }
            //             if (i == len - 1) {
            //                 $('.qianshou-tr').removeClass('gold-back')
            //                 $('.audio-shibai').get(0).play();
            //             }
            //         }
            //     } else {
            //         $('.qianshou-tr').removeClass('gold-back')
            //         $scope.itemObj = null;
            //         showProduct()
            //     }
            //     $("#tx").val('')
            // }
        }

        function tieBiaoJiLu(sku) {
            if (!userId || !erpLoginName) {
                layer.msg('请先登陆')
                location.href = "login.html"
                return
            }
            var upJson = {};
            upJson.sku = sku;
            erp.postFun('caigou/procurement/fenBiaoJiLu', JSON.stringify(upJson), function (data) {
                console.log(data)
            }, function (data) {
                console.log(data)
            })
        }

        function showProduct() {
            if (!userId || !erpLoginName) {
                layer.msg('请先登陆')
                location.href = "login.html"
                return
            }
            $scope.ptquehuoArr = [];
            $scope.zfquehuoArr = [];
            var b = true;
            ydhGlobelNum = $("#tx").val();
            if (!$scope.searchVal) return; 
            layer.load(2);
            // caigou/procurement/qianShou  "inputStr": code --- >  procurement/order/qianShou  {"search":"11122"}
            $scope.ydhList = []
            erp.postFun('procurement/order/qianShou', {
                search: $scope.searchVal,
                store:$scope.filterObj.store,
                procurementType:$scope.filterObj.procurementType
            }, function ({data}) {
                layer.closeAll('loading');
                console.log(data)
                if(data.code != 200){
                    layer.msg(data.message)
                }
                if (data.data.result == 'pod') {
                    layer.msg(data.data.result)
                    $('.audio-podsp').get(0).play()
                    $scope.searchVal='';
                    return
                }
                
                if(data.data.result=='[]'){
                    speckText('单号不存在')
                    return
                }
                if(data.data.serveOrderList){
                    $scope.listArr = data.data.serveOrderList;
                    console.log($scope.listArr)
                    $scope.qsSeaFlag = true;
                    $("#tx").val('')
                    return
                }
                let isXxFlag = false;
                if (data.data.list[0].orderId.indexOf('X') != -1) {
                    $('.audio-xianxiazu').get(0).play()
                    isXxFlag = true;
                }
                var arrives = data.data.list;
                console.log(arrives);
                var len = arrives.length;
                for (var i = 0; i < len; i++) {
                    arrives[i].count = arrives[i].count - 0;
                    arrives[i].skuLeft = arrives[i].sku.substring(0, 14)
                    arrives[i].skuRight = arrives[i].sku.substring(14)
                    console.log(arrives[i])
                }
                $scope.ydhList = arrives.map(item => {
                    item.zhuiZongHao = JsonPares(item.zhuiZongHao)
                    return item;
                });
                console.log($scope.ydhList)
                var dingDanZhuangtais = arrives.length>0?arrives[0].dingDanZhuangtais:'';
                if(data.data.caigouType == 1){
                    speckText('内部采购')
                }else{
                    let resStuArr = dingDanZhuangtais;
                    if(isXxFlag){
                        $timeout(function(){
                            audioCaseFun(resStuArr)
                        },1500)
                    }else{
                        audioCaseFun(resStuArr)
                    }
                }
                
                if (data.data.cjProductQueHuoMap.length > 0 || data.data
                    .payProductQueHuoList.length > 0) {
                    $scope.ptquehuoArr = data.data.cjProductQueHuoMap;
                    $scope.zfquehuoArr = data.data.payProductQueHuoList;
                    console.log('aaaaa', $scope.zfquehuoArr)
                    //$scope.WaringTxt = '缺货商品的SKU是'+ data.data.cjProductQueHuoMap.sku + '需要'+ data.data.cjProductQueHuoMap.quantity + '个!';
                    $timeout(function () {
                        $('.audio-quehuoxuyao').get(0).play();
                    }, 1000)
                }
                $scope.totalNum = arrives.totle;
                $("#tx").val('')
            })
        }
        function audioCaseFun(dingDanZhuangtais){
            if (dingDanZhuangtais.length <= 1) {
                if (dingDanZhuangtais[0] == 'zhengChang') {
                    $('.audio-zhengchang').get(0).play()
                } else if (dingDanZhuangtais[0] == 'vip') {
                    $('.audio-vip').get(0).play()
                } else if (dingDanZhuangtais[0] == 'jiaJi') {
                    $('.audio-jiaji').get(0).play()
                } else if (dingDanZhuangtais[0] == 'zhiFa') {
                    $('.audio-zhifa').get(0).play()
                } else if (dingDanZhuangtais[0] == 'usaZhiFa') {
                    $('.audio-usazhifa').get(0).play()
                } else if (dingDanZhuangtais[0] == 'zuZhuang') {
                    $('.audio-zuzhuang').get(0).play()
                } else if (dingDanZhuangtais[0] == 'buFa') {
                    $('.audio-bufa').get(0).play()
                } else if (dingDanZhuangtais[0] == 'buRuKu') {
                    $('.audio-buruku').get(0).play()
                } else if (dingDanZhuangtais[0] == 'xianXiaZu') {
                    $('.audio-xianxiazu').get(0).play()
                } else if (dingDanZhuangtais[0] == 'gaiBiao') {
                    $('.audio-gaiBiao').get(0).play()
                }
            } else {
                $('.audio-qingzhuyi').get(0).play()
            }
        }
        function speckText(str) {
            var url = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=" + encodeURI(str);
            var n = new Audio(url);
            n.src = url;
            n.play();
        }
        //异常
        $scope.ycYyVal = '3';
        var itemYcId;
        $scope.yiChangFun = function (item) {
            itemYcId = '';
            $scope.ycCount = 0;
            console.log(item)
            $scope.ycYyFlag = true;
            $scope.ycCount = item.count;
            itemYcId = item.caiGouShangPinid;
        }
        $scope.sureYcFun = function () {
            if ($scope.ycCount <= 0 || !$scope.ycCount) {
                layer.msg('请输入数量')
                return
            }
            if ($scope.ycYyVal == '7') {
                if (!$scope.newQsYcReson) {
                    layer.msg('请输入异常原因')
                    return
                }
            }
            erp.load()
            var ycUpJoson = {};
            ycUpJoson.id = itemYcId;
            ycUpJoson.yuanYin = $scope.newQsYcReson;
            ycUpJoson.shuLiang = $scope.ycCount;
            ycUpJoson.leiXing = $scope.ycYyVal;
            const url = 'procurement/dealWith/yiChang';//接口更改 
            erp.mypost(url, ycUpJoson).then(() => {
                $scope.ycYyFlag = false;
            })
        }
        //批量打印条形码
        $scope.bulkPrintOFun = function () {
            console.log($scope.ydhList)
            if (!$scope.ydhList) return;
            var printData = {};
            var printArr = [];
            for (var i = 0; i < $scope.ydhList.length; i++) {
                var shortSKU = $scope.ydhList[i].shortSku || $scope.ydhList[i].sku;
                var sku = $scope.ydhList[i].sku;
                var count;
                if (printData[shortSKU]) {
                    console.log(printData[shortSKU]);
                    console.log(printData[shortSKU].sku);
                    if (printData[shortSKU].sku) {
                        count = printData[shortSKU].sum;
                    } else {
                        count = null;
                    }
                } else {
                    count = null;
                }
                if (!count) {
                    count = $scope.ydhList[i].count;
                } else {
                    count = $scope.ydhList[i].count + count;
                }
                if (count && count > 0) {
                    printData[shortSKU] = {
                        "sku": sku,
                        "sum": count
                    };
                }
                // printData[shortSKU] = JSON.stringify(printData[shortSKU]);
            }
            if (JSON.stringify(printData) == "{}") {
                layer.msg('打印数量不能为0');
                return;
            }
            console.log(printData)
            // return;
            layer.load(2)
            var pUpdata = {};
            // pUpdata.skuMap = JSON.stringify(printData);
            pUpdata.skuMap = printData;
            var printLink;
            console.log(JSON.stringify(pUpdata))
            erp.postFun('app/pdfOpt/getBarcode128Batch', JSON.stringify(pUpdata), function (
                data) {
                console.log(data)
                layer.closeAll('loading');
                if (data.data.code == '200') {
                    printLink = data.data.pdfFillUrl;
                } else {
                    printLink = 'error';
                }

            }, function (data) {
                console.log(data)
                layer.closeAll('loading');
                printLink = 'error';
            })

            var printTimer = setInterval(function () {
                console.log('100')
                if (printLink == 'error') {
                    layer.msg('打印错误')
                    clearInterval(printTimer);
                    printLink = null;
                    console.log('error');
                } else if (printLink) {
                    window.open('https://' + printLink, '_blank', '');
                    clearInterval(printTimer);
                    printLink = null;
                    console.log('succsee');
                }
            }, 100);
        }

        $scope.copyWord = function (word) {
            var Url1;
            Url1 = document.createElement('input');
            Url1.setAttribute('readonly', 'readonly');
            Url1.setAttribute('value', word);
            document.body.appendChild(Url1);
            //console.log(Url1.value);
            Url1.select(); //选择对象
            document.execCommand("Copy");
            var tag = document.execCommand("Copy"); //执行浏览器复制命令
            if (tag) {
                layer.msg('复制成功');
            }
            document.body.removeChild(Url1);
        }

        $('#YdhModal').click(function (e) {
            e.stopPropagation();
        })
        $('.ydh-rk-wrap').click(function (e) {
            e.stopPropagation();
        })
        $('.stop-pro').click(function (e) {
            e.stopPropagation();
        })
        $('.chage-wrap').click(function (e) {
            e.stopPropagation();
        })
        $('.lookProduct').click(function (e) {
            e.stopPropagation();
        })
        //运单号入库 修改重量的函数
        var targetVal;
        $scope.thisList;
        $scope.thisIndex;
        $scope.isValidWFun = function (item, index, ev) {
            targetVal = $(ev.target).val();
            console.log(targetVal)
            $scope.thisIndex = index;
            $scope.itemOldWei = item.oldWeight;
            $scope.thisList = $scope.ydhList[index];
            if (item.isChangeWeight != '1') { //如果没有修改过 提示修改
                if (targetVal > item.packWeight) {
                    $scope.ydhchangeWFlag = true;
                    $scope.tipWeight = item.packWeight;
                    $scope.ydhbzWeight = item.packWeight;
                } else if (targetVal == item.oldWeight) {
                    return;
                } else {
                    if (targetVal <= 0) {
                        layer.msg('请输入重量')
                        return;
                    }
                    erp.postFun('pojo/procurement/changeWeight', {
                        productId: item.productId,
                        variantId: item.variantId,
                        oldWeight: item.oldWeight,
                        newWeight: targetVal
                    }, function (data) {
                        console.log(data)
                        if (data.data.statusCode == 200) {
                            layer.msg('修改成功')
                            $scope.ydhList[index].isChangeWeight = '1';
                            $scope.ydhList[index].oldWeight = targetVal;
                            $scope.ydhisNextChangeFlag = false;
                        } else {
                            layer.msg('修改失败')
                        }
                    }, function (data) {
                        console.log(data)
                    })
                }
            } else { //如果修改过
                if (targetVal == item.oldWeight) {
                    return;
                }
                $scope.ydhisNextChangeFlag = true;
                // $scope.ydhList[$scope.thisIndex].oldWeight = targetVal-0;
                // console.log(item)
                // console.log($scope.ydhList)
            }

        }
        //运单号入库 再次修改商品重量
        $scope.ydhnextQxFun = function () {
            $scope.ydhisNextChangeFlag = false;
            $('.ydh-weightInp').eq($scope.thisIndex).val($scope.itemOldWei);
            // console.log($scope.itemOldWei)
            // $scope.ydhList[$scope.thisIndex].oldWeight = $scope.itemOldWei;
            // console.log($scope.ydhList[$scope.thisIndex])
            // console.log($scope.ydhList)
        }
        //确定再次修改重量
        $scope.ydhnextSureFun = function () {
            console.log($scope.thisList)
            if (targetVal <= 0) {
                layer.msg('请输入重量')
                return;
            } else if (targetVal >= $scope.thisList.packWeight) { //净重量大于包装重量
                $scope.ydhchangeWFlag = true;
                $scope.ydhtipWeight = $scope.thisList.packWeight;
                return;
            }
            $scope.isNextChangeFlag = false;
            erp.postFun('pojo/procurement/changeWeight', {
                productId: $scope.thisList.productId,
                variantId: $scope.thisList.variantId,
                oldWeight: $scope.thisList.oldWeight,
                newWeight: targetVal
            }, function (data) {
                console.log(data)
                if (data.data.statusCode == 200) {
                    $scope.ydhisNextChangeFlag = false;
                    layer.msg('修改成功')
                    $scope.ydhList[$scope.thisIndex].isChangeWeight = '1';
                    $scope.ydhList[$scope.thisIndex].oldWeight = targetVal;
                } else {
                    layer.msg('修改失败')
                    isChangeWeight = false;
                    $('.rk-weight').addClass('inp-erractive')
                }
            }, function (data) {
                console.log(data)
            })
        }
        //运单号入库按钮
        $scope.ydhRkFun = function () {
            // console.log('00098978')
            console.log($scope.ydhList)
            console.log(responseObj)
            $scope.bulkRkTime = timestampToTime(new Date())
            console.log(timestampToTime(new Date()))
            // layer.msg('开发中')
            $scope.ydhrkFlag = true;
        }
        //运单号入库的取消 确定
        $scope.ydhRkSureFun = function () {
            console.log($scope.ydhList)
            //{"list":[{variantId,productId,waybillId,count},....], storageId}
            var upObj = {}; //存储上传的参数
            var upListArr = []; //存储list数组
            var arrOneObj = {}; //存储数组中的一条
            var itemStoreId;
            for (var i = 0; i < $scope.ydhList.length; i++) {
                if ($scope.ydhList[i].isChangeWeight != '1') {
                    layer.msg('请修改商品的重量')
                    return;
                } else {
                    arrOneObj.variantId = $scope.ydhList[i].variantId;
                    arrOneObj.productId = $scope.ydhList[i].productId;
                    arrOneObj.wayBillId = $scope.ydhList[i].id;
                    arrOneObj.count = $scope.ydhList[i].count;
                    itemStoreId = $scope.ydhList[i].storageId;
                }
                upListArr.push(arrOneObj);
            }
            // upObj.list = JSON.stringify($scope.ydhList)
            layer.load(2)
            upObj.list = upListArr;
            upObj.storageId = itemStoreId;
            upObj.trackingNumber = code;
            console.log(upObj)
            console.log(JSON.stringify(upObj))
            // return;
            erp.postFun('pojo/procurement/inStorages', JSON.stringify(upObj), function (data) {
                console.log(data)
                layer.closeAll('loading')
                if (data.data.statusCode == '200') {
                    layer.msg('批量入库成功')
                    $scope.ydhrkFlag = false;
                } else {
                    layer.msg('批量入库失败')
                }
            }, function (data) {
                console.log(data)
                layer.closeAll('loading')
            })
        }
        $scope.ydhCloseRk = function () {
            $scope.ydhrkFlag = false;
        }
        $scope.ydhRkQsFun = function () {
            $scope.isqianshouFlag = true;
        }
        //询问是否签收
        $scope.ydhNoQs = function () {
            $scope.isqianshouFlag = false;
        }
        //签收
        $scope.ydhSureQs = function () {
            layer.load(2);
            erp.getFun('pojo/procurement/sign?wayBill=' + ydhGlobelNum, function (data) {
                layer.closeAll('loading');
                if (data.data.statusCode == '200') {
                    $scope.isqianshouFlag = false;
                    layer.msg('签收成功')
                    $scope.ydhList = [];
                    $("#tx").val("");
                    setTimeout(function () {
                        $("#tx").blur().focus();
                    }, 100);
                } else {
                    layer.msg('签收失败')
                }
            }, function (data) {
                layer.closeAll('loading');
                layer.msg('网络错误');
                console.log(data)
            })
        }
        //异常签收
        $scope.ycqsFun = function () {
            $scope.qsycResonFlag = true;
        }
        $scope.qsycSureFun = function () {
            if (!$scope.qsycReson) {
                layer.msg('请输入异常原因')
                return;
            }
            var ycqsData = {};
            ycqsData.wayBillId = code;
            ycqsData.exceptionResone = $scope.qsycReson;
            layer.load(2);
            erp.postFun('pojo/procurement/daoHuoYiChang', JSON.stringify(ycqsData), function (
                data) {
                layer.closeAll('loading');
                console.log(data)
                if (data.data.statusCode == 200) {
                    $scope.qsycResonFlag = false;
                    $scope.isqianshouFlag = false;
                    layer.msg('异常签收成功')
                    $scope.ydhList = [];
                    $("#tx").val("");
                    setTimeout(function () {
                        $("#tx").blur().focus();
                    }, 100);
                } else {
                    layer.msg('异常签收失败')
                }
            }, function (data) {
                console.log(data)
            })
        }
        //运单号的修改包装重量
        $scope.ydhcloseCWFun = function () {
            $scope.ydhchangeWFlag = false;
        }
        $scope.ydhsureCWFun = function function_name() {
            if ($scope.ydhbzWeight <= 0) {
                layer.msg('请输入重量')
                return;
            }
            erp.postFun('pojo/procurement/changePackWeight', {
                productId: $scope.thisList.productId,
                variantId: $scope.thisList.variantId,
                oldWeight: $scope.thisList.oldWeight,
                newWeight: $scope.ydhbzWeight
            }, function (data) {
                console.log(data)
                if (data.data.statusCode == 200) {
                    layer.msg('修改成功')
                    $scope.ydhList[$scope.thisIndex].packWeight = $scope.ydhbzWeight;
                    $scope.ydhchangeWFlag = false;
                } else {
                    layer.msg('修改失败')
                }
            }, function (data) {
                console.log(data)
            })
        }
        /* 搜索条件切换查询 */
        $scope.changeFilter = ()=>{
            showProduct();
        }
        $('#tx').keypress(function (e) {
            if (e.which == 13) {
                $scope.condition = 'latestVersion';
                queryList()
            }
        });
        $('.rk-wrap').click(function (e) {
            e.stopPropagation();
        })
        $('#weight-con').click(function (e) {
            e.stopPropagation();
        })
        var isChangeWeight = false;
        //点击入库按钮
        $scope.rkBtnFun = function (ev) {
            // $(ev.target).stopPropagation();
            console.log(responseObj)
            $scope.skuorTxmFlag = true;
            if (responseObj.storageId01) { //如果是sku需要选择仓库
                $scope.moreFlag = true; //显示入库的单选按钮
                $("#tx").blur();
                $(".rk-sp-img").attr("src", responseObj.img)
                $('.rk-num').val(responseObj.mores); //填入获取到的多品数量
                $('.rk-weight').val(responseObj.oldWeight); //填入商品重量
                $('.sku-text').text(responseObj.sku); //填入sku
                $('.rk-wrap').show();
                if (responseObj.isChangeWeight == 0) { //没有修改过重量
                    isChangeWeight = false;
                    $('.rk-weight').removeClass('inp-sucactive')
                    $('.rk-weight').addClass('inp-erractive')
                } else {
                    isChangeWeight = true;
                    $('.rk-weight').removeClass('inp-sucactive')
                    $('.rk-weight').addClass('inp-sucactive')
                }
                storageId = responseObj.storageId;
                menuId = responseObj.firstCategoryId;
                //默认展示义乌仓
                renderBrunch();
            } else {
                $scope.moreFlag = false;
                $("#tx").blur();
                $(".rk-sp-img").attr("src", responseObj.img)
                $('.rk-num').val(responseObj.mores); //填入获取到的多品数量
                $('.rk-weight').val(responseObj.oldWeight); //填入商品重量
                $('.sku-text').text(responseObj.sku); //填入sku
                $('.rk-wrap').show();
                if (responseObj.isChangeWeight == 0) {
                    isChangeWeight = false;
                    $('.rk-weight').removeClass('inp-sucactive')
                    $('.rk-weight').addClass('inp-erractive')
                    // alert('false')
                } else {
                    isChangeWeight = true;
                    $('.rk-weight').removeClass('inp-sucactive')
                    $('.rk-weight').addClass('inp-sucactive')
                    // alert('true')
                }
                storageId = responseObj.storageId;
                menuId = responseObj.firstCategoryId;
                console.log(responseObj)
                console.log(storageId)
                console.log(menuId)
                renderBrunch();
            }
        }
        //如果是sku入库 需要选择仓库
        $scope.selCkFun = function (ev) {
            console.log($(ev.target).val())
            var selRadioVal = $(ev.target).val();
            switch (selRadioVal) {
                case '1':
                    storageId = responseObj.storageId;
                    erp.postFun('app/storagedo/selectByCatIdNodeList', JSON.stringify({
                        storageId: storageId,
                        idList: menuId
                    }), function (data) {
                        console.log(data);
                        // var resArr = data.data.list;
                        $scope.folderData = data.data.root;
                        $scope.folderData.open = true;
                        $scope.folderData.active = true;
                        $scope.folderData.codeType = '仓';
                        $scope.folder = $scope.folderData
                        $scope.brunchItem = $scope.folderData;
                        console.log($scope.brunchItem)
                    }, err);
                    break;
                case '2':
                    storageId = responseObj.storageId01;
                    erp.postFun('app/storagedo/selectByCatIdNodeList', JSON.stringify({
                        storageId: storageId,
                        idList: menuId
                    }), function (data) {
                        console.log(data);
                        // var resArr = data.data.list;
                        $scope.folderData = data.data.root;
                        $scope.folderData.open = true;
                        $scope.folderData.active = true;
                        $scope.folderData.codeType = '仓';
                        $scope.folder = $scope.folderData
                        $scope.brunchItem = $scope.folderData;
                        console.log($scope.brunchItem)
                    }, err);
                    break;
                case '3':
                    storageId = responseObj.storageId02;
                    erp.postFun('app/storagedo/selectByCatIdNodeList', JSON.stringify({
                        storageId: storageId,
                        idList: menuId
                    }), function (data) {
                        console.log(data);
                        // var resArr = data.data.list;
                        $scope.folderData = data.data.root;
                        $scope.folderData.open = true;
                        $scope.folderData.active = true;
                        $scope.folderData.codeType = '仓';
                        $scope.folder = $scope.folderData
                        $scope.brunchItem = $scope.folderData;
                        console.log($scope.brunchItem)
                    }, err);
                    break;
            }

        }
        //修改重量
        $scope.editWeiFun = function () {
            console.log(responseObj)
            var newWeightVal = $('.rk-weight').val();
            if (responseObj.isChangeWeight == 0) {
                if (newWeightVal <= 0) {
                    layer.msg('请输入重量')
                    return;
                } else if (newWeightVal >= responseObj.packWeight) { //净重量大于包装重量
                    $scope.changeWFlag = true;
                    $scope.bzWeight = responseObj.packWeight;
                    $scope.tipWeight = responseObj.packWeight;
                    return;
                }
                erp.postFun('pojo/procurement/changeWeight', {
                    productId: responseObj.productId,
                    variantId: responseObj.variantId,
                    oldWeight: responseObj.oldWeight,
                    newWeight: newWeightVal
                }, function (data) {
                    console.log(data)
                    if (data.data.statusCode == 200) {
                        layer.msg('修改成功')
                        isChangeWeight = true;
                        $('.rk-weight').addClass('inp-sucactive')
                    } else {
                        layer.msg('修改失败')
                        isChangeWeight = false;
                        $('.rk-weight').addClass('inp-erractive')
                    }
                }, function (data) {
                    console.log(data)
                })
            } else {
                $scope.isNextChangeFlag = true;
            }
            //取消再次修改
            $scope.nextQxFun = function () {
                $scope.isNextChangeFlag = false;
            }
            //确定再次修改
            $scope.nextSureFun = function () {
                var newWeightVal = $('.rk-weight').val();
                if (newWeightVal <= 0) {
                    layer.msg('请输入重量')
                    return;
                } else if (newWeightVal >= responseObj.packWeight) { //净重量大于包装重量
                    $scope.changeWFlag = true;
                    $scope.bzWeight = responseObj.packWeight;
                    $scope.tipWeight = responseObj.packWeight;
                    return;
                }
                $scope.isNextChangeFlag = false;
                erp.postFun('pojo/procurement/changeWeight', {
                    productId: responseObj.productId,
                    variantId: responseObj.variantId,
                    oldWeight: responseObj.oldWeight,
                    newWeight: newWeightVal
                }, function (data) {
                    console.log(data)
                    if (data.data.statusCode == 200) {
                        layer.msg('修改成功')
                        isChangeWeight = true;
                        $('.rk-weight').addClass('inp-sucactive')
                    } else {
                        layer.msg('修改失败')
                        isChangeWeight = false;
                        $('.rk-weight').addClass('inp-erractive')
                    }
                }, function (data) {
                    console.log(data)
                })
            }
        }
        //关闭sku/条形码入库弹框
        $scope.skuOrTxmCloseFun = function () {
            $scope.skuorTxmFlag = false;
        }

        $scope.sureRkFun = function () {
            // responseObj = JSON.parse(arr)
            console.log(responseObj)
            var dpCount = responseObj.count; //多品的总数量
            var spId = responseObj.productId; //商品id
            var btId = responseObj.variantId; //变体id
            var ydId = responseObj.wayBillId; //运单id
            // var storageId = responseObj.storageId;//仓库id
            var rkCount = $('.rk-num').val(); //获取入库数量
            var upckId = $scope.brunchItem.id; //该层级的id
            var rkData = {};
            if (!isChangeWeight) {
                layer.msg('请修改商品的重量')
                return;
            } else {
                rkData.waybillId = ydId;
                rkData.storageId = storageId;
                rkData.areaId = upckId;
                rkData.count = rkCount;
                rkData.variantId = btId;
                rkData.productId = spId;
                console.log(rkCount)
                if (!$scope.moreFlag) {
                    if (rkCount < 0) {
                        layer.msg('输入的数量不能小于零')
                        return;
                    } else {
                        if (rkCount * 1 > dpCount * 1) {
                            layer.msg('输入的数量不能大于总数量')
                            return;
                        }
                    }
                } else {
                    if (rkCount < 0) {
                        layer.msg('输入的数量不能小于零')
                        return;
                    }
                }
                erp.load();
                // storageId = responseObj.storageId;//仓库id

                console.log(dpCount, spId, btId, ydId, rkCount, upckId)
                console.log(JSON.stringify(rkData))
                erp.postFun('pojo/procurement/inStorage', JSON.stringify(rkData), function (
                    data) {
                    console.log(data)
                    $('.rk-wrap').hide();
                    erp.closeLoad()
                    if (data.data.statusCode == 200) {
                        $scope.skuorTxmFlag = false;
                        layer.msg('入库成功')
                    } else {
                        layer.msg('入库失败')
                    }
                }, err)
            }
        }
        $scope.closeRkFun = function () {
            $('.rk-wrap').hide();
        }
        //修改包装重量
        $scope.closeCWFun = function () {
            $scope.changeWFlag = false;
        }
        $scope.sureCWFun = function function_name() {
            console.log($scope.bzWeight)
            console.log(responseObj)
            if ($scope.bzWeight <= 0) {
                layer.msg('请输入重量')
                return;
            }
            erp.postFun('pojo/procurement/changePackWeight', {
                productId: responseObj.productId,
                variantId: responseObj.variantId,
                oldWeight: responseObj.oldWeight,
                newWeight: $scope.bzWeight
            }, function (data) {
                console.log(data)
                if (data.data.statusCode == 200) {
                    layer.msg('修改成功')
                    responseObj.packWeight = $scope.bzWeight;
                    $scope.changeWFlag = false;
                } else {
                    layer.msg('修改失败')
                }
            }, function (data) {
                console.log(data)
            })
        }

        $scope.index1 = '00';
        //点击某个仓库
        $scope.pointOne = function (item, e, posi) {
            $scope.folder.active = false;
            // console.log($scope.folder)
            setAllChiToUnactive($scope.folder.childrens, 'childrens'); //把节点置为非选中
            $scope.pointArr = getTheArr(posi, e, $scope);
            // console.log($scope.pointArr)
            // $scope.pointArr.active = true;
            $scope.pointArr.active = true;
            // console.log($scope.folder)
            $scope.brunchItem = item;
            // 选中的仓库分支
            console.log('选中的仓库分支', $scope.brunchItem);
        }
        $scope.switchList = function (posi, e, flag) {
            $scope.temArr = getTheArr(posi, e, $scope);
            $scope.temArr.open = flag;
        }

        // 获取当前节点的信息
        function renderBrunch() {
            console.log(menuId)
            erp.postFun('app/storagedo/selectByCatIdNodeList', JSON.stringify({
                storageId: storageId,
                idList: menuId
            }), function (data) {
                console.log(data);
                // var resArr = data.data.list;
                $scope.folderData = data.data.root;
                $scope.folderData.open = true;
                $scope.folderData.active = true;
                $scope.folderData.codeType = '仓';
                $scope.folder = $scope.folderData
                $scope.brunchItem = $scope.folderData;
                console.log($scope.brunchItem)
            }, err);
        }

        // renderBrunch();
        $scope.queryDesign = function (item) {
            $scope.showDesign = true;
            let detail = JSON.parse(item.customeDesign);
            let sku = item.sku.substring(item.sku.indexOf("-")+1,item.sku.length);
            let variantL = detail.variantkeyen.split("-");
            $scope.designColor='default';

            for(let i=0;i<variantL.length;i++){
                if(variantL[i]=='Color'){
                    $scope.designColor = sku.split("-")[i];
                    console.log($scope.designColor)
                }
            }
            $scope.designObj={
                name:detail.nameen,
                sku:sku,
                customeDesign:JSON.parse(detail.customeDesign)
            }
            $scope.designIndex=0;
            $scope.designImg = getDesignLink();
        }
        $scope.chooseArea = function (item,index) {
            $scope.designIndex=index;
            $scope.designImg = getDesignLink();
        }
        $scope.designIndex=0;
        function getDesignLink(){
            let links = $scope.designObj.customeDesign[$scope.designIndex].links;
            let oareaName = $scope.designObj.customeDesign[$scope.designIndex].areaName;
            $scope.designColor = $scope.designColor.replace(/\s/g,'');
            if(links.length>1){
                for(let i=0;i<links.length;i++){
                    let ocolor = links[i].split("_")[2];
                    let areaName = links[i].split("_")[1];
                    if($scope.designColor==ocolor&&areaName==oareaName){
                        return links[i];
                    }
                    if($scope.designColor.toLowerCase()=='default'&&areaName==oareaName){
                        return links[i];
                    }
                }
            }else{
                return links[0];
            }
        }
        const getPod1 = (d)=>{
            let data = d.zone;
            let podData = [];
            for (let key in data){
              podData.push({
                position:key,
                showImg:data[key].editimgurl,
                originImg:data[key].showimgurl,
                type:data[key].podtype
              })
            }
            $scope.podList = podData;
          }
          const getPod2 = (data,cjSku) =>{
            const customMessgae = JSON.parse(data.customMessage);
            const customeDesign = JSON.parse(data.customeDesign);
            const skuL = cjSku.replace(/\s+/g,'').split('-')
            let podData = customMessgae.map((item,index)=>{
              let showimg,originImg;
              customeDesign[index].links.filter(link=>{
                let color = link.split('_')[2].split('.')[0];
                skuL.forEach(_=>{
                  if(_===color){
                    showimg=link;
                  }
                })
              })
              item.backImgList.filter(d=>{
                const color = d.color.replace(/\s+/g,'');
                skuL.forEach(_=>{
                  if(_===color){
                    originImg=d.imgsrc;
                  }
                })
              })
              return {
                index:index,
                position:item.areaName,
                showImg:showimg,
                originImg:originImg,
                type:item.typeName
              }
            });
            $scope.podList = podData;
        }
        $scope.customeDesignFun  = item =>{
            const data=JSON.parse(item.customMessage);
            if(!data) return;
            if(!Array.isArray(data)){
                getPod1(data);
            }else{
                getPod2(item,item.sku)
            }
            $scope.showCustomDesign=true;
        }
    }]).filter('procurementFilter', function () {
        return function(val) {
          let name = '';
              switch(+val){
            case 0:
              name='1688非API';
              break;
            case 1:
              name='1688API';
              break;
            case 2:
              name='淘宝';
              break;
            case 3:
              name='天猫';
              break;
            case 4:
              name='线下';
              break;
            }
            return name;
          }
      }).filter('IMG_SIZE', function () {
        return function (url, ...args) {
          if (typeof url !== 'string') return url;
          var json = {}, size = 200, str = `${url}?x-oss-process=image/resize,m_fill`;
    
          if (args.length === 1) json = { w: args[0] };
          else if (args.length === 2) json = { w: args[0], h: args[1] };
          else { json = { w: size, h: size } };
          for (var k in json) str += `,${k}_${json[k]}`;
          return str;
        }
      });

    app.directive("folderTree", function () {
        return {
            restrict: "E",
            scope: {
                //传入当前项的值
                currentFolder: '=',
                //循环索引的值
                myIndex: '=',
                // folderList: '=',
                //点击某个的方法
                pointOne: '&',
                // openupList: '&',
                // packupList: '&'
                //展开伸缩的方法
                switchList: '&'
            },
            // scope: true,
            templateUrl: 'static/template/tree.html',
        };
    });

    function err(error) {
        erp.closeLoad();
        console.log(error);
        // layer.closeAll('loading');
    }

    //获取当前节点
    function getTheArr(posi, e, $scope, cateflag) {
        var rootArr, resArr, childFlag;
        if (cateflag) {
            rootArr = $scope.cateList;
            childFlag = 'children';
        } else {
            rootArr = $scope.folder;
            childFlag = 'childrens';
        }
        var temDom = e.target.parentElement;
        var firIndex = angular.element(temDom).find('.index-span').html();
        if (firIndex == '00') {
            // $scope.folder.active = true;
            console.log(firIndex);
            console.log(rootArr)
            return rootArr;
        } else {
            console.log(firIndex, 6666)
        }
        var posiArr = [angular.element(temDom).find('.index-span').html() * 1];
        for (var i = 0; i < (posi); i++) {
            temDom = turnToParentIndex(temDom);
            posiArr.unshift(temDom.find('.index-span').html() * 1);
        }
        // console.log(posiArr);
        var temArr = rootArr;
        for (var i = 0; i < posiArr.length; i++) {
            temArr = turnToChildren(temArr, posiArr[i], childFlag)
        }
        return temArr;
        // console.log(temArr);
        // temArr.active = true;
    }

    function turnToChildren(arr, index, tag) {
        return arr[tag][index];
    }

    function turnToParentIndex(dom) {
        return angular.element(dom).parent().parent().parent().siblings('.top-info');
    }

    //把所有节点置为非选中
    function setAllChiToUnactive(arr, tag) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].active = false;
            if (arr[i][tag] && arr[i][tag].length > 0) {
                setAllChiToUnactive(arr[i][tag], tag);
            }
        }
    }

    function sequencePlusOne(arr) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].sequence = arr[i].sequence * 1 + 1;
            if (arr[i].childrens && arr[i].childrens.length > 0) {
                sequencePlusOne(arr[i].childrens);
            }
        }
    }

    function JsonPares(val) {//基于 全局 JSON parse重写 基础上 
        const newVal = JSON.parse(val);
        if (val === null) return val;
        if (typeof newVal !== 'object') return val;
        if (newVal.error) return val;
        return newVal;
    } 

    //格式化时间
    function timestampToTime(date) {
        var Y, M, D, h, m, s
        Y = date.getFullYear() + '-';
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        D = date.getDate() + ' ';
        h = date.getHours() + ':';
        m = date.getMinutes() + ':';
        s = date.getSeconds();
        return Y + M + D + h + m + s;
    }

    //格式化日期
    function timestampToDate(date) {
        var Y, M, D, h, m, s
        Y = date.getFullYear() + '-';
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        D = date.getDate() + ' ';
        h = date.getHours() + ':';
        m = date.getMinutes() + ':';
        s = date.getSeconds();
        return Y + M + D;
    }
})(angular)
