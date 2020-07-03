;~function () {
    let app = angular.module('warehouse-app');
    app.controller('warestockCtrl', ['$scope', "erp", '$location', '$routeParams','$timeout', function ($scope, erp, $location, $routeParams,$timeout) {
        console.log('warestockCtrl');
        var base64 = new Base64();
        var loginName = localStorage.getItem('erploginName') ? base64.decode(localStorage.getItem('erploginName')) : '';
        var job = localStorage.getItem('job') ? base64.decode(localStorage.getItem('job')) : '';
        $scope.job=job;
        $scope.loginName = loginName
        console.log(loginName);
        if(loginName=='admin' || loginName === '陈真' || loginName === '庹章龙'){
            $scope.isWw=true;
        }else{
            $scope.isWw=false;
        }
        if (loginName == 'admin' || loginName == '张琪' || loginName == '刘思梦' || job == '管理' || job == '纠纷' || loginName === '金仙娟' || loginName === '庹章龙') {
            $scope.isPermitPrivOpe = true;
        } else {
            $scope.isPermitPrivOpe = false;
        }

        $scope.isAdminLogin = erp.isAdminLogin();

		    erp.getCateList().then(res =>{
			    $scope.cateList = {};
			    $scope.cateList.name = '全部类目';
			    $scope.cateList.open = true;
			    $scope.cateList.active = true;
			    var temArr = res;
			    for (var i = 0; i < temArr.length; i++) {
				    temArr[i].posi = 0;
				    if (temArr[i].children && temArr[i].children.length > 0) {
					    for (var j = 0; j < temArr[i].children.length; j++) {
						    temArr[i].children[j].posi = 1;
						    if (temArr[i].children[j].children && temArr[i].children[j].children.length > 0) {
							    for (var k = 0; k < temArr[i].children[j].children.length; k++) {
								    temArr[i].children[j].children[k].posi = 2;
							    }
						    }
					    }
				    }
			    }
			    $scope.cateList.children = temArr;
			    $scope.cateItem = $scope.cateList;
			    console.log($scope.cateList);
		    })
        // getAllWareNodes(erp, $scope);

        // 首先获取仓库第一级节点
        getRootNode(erp,{
            news: "1",
            rank: "1",
            id: ""
        }, function (result) {
            console.log(result)
            for (var i = 0; i < result.childrens.length; i++) {
                result.childrens[i].codeType = '仓';
            }
            result.codeType = '';
            console.log(result);
            result.open = true;
            result.active = true;
            result.codeName = '全部仓库';
            $scope.folder = result;
            $scope.brunchItem = result;
            $scope.rootPaCodeId = $scope.brunchItem.pCodeId;
        })

        $scope.searchStr = '';
        $scope.pageSize = '15';
        $scope.pageNum = '1';
        $scope.totalNum = 0;
        $scope.totalPageNum = 0;
        //erp.postFun("app/storage/orderBuyList", {"data":"{'pageNum':'1','pageSize':'5'}"}, bb, err);
        // 获取列表
        function getList(erp, $scope) {
            var sendJson = {};
            sendJson.page = $scope.pageNum;
            sendJson.pageNum = $scope.pageSize;
            // sendJson.searchParam = $scope.searchStr;
            if ($scope.cateItem) {
                sendJson.catgoryIdSearch = $scope.cateItem.id;
            }
            if ($scope.brunchItem) {
                sendJson.pathIdSearch = $scope.brunchItem.id;
            }
            if ($scope.searchKey == 'SKU') {
                let olen = $scope.searchStr.length;
                let searchStr = $scope.searchStr;
                if(Number($scope.searchStr)){
                    searchStr = olen>7?$scope.searchStr.substr(0,olen-7):$scope.searchStr;
                }
                sendJson.productSKU = searchStr;
            }
            if ($scope.searchKey == 'supplier_name') {
                sendJson.supplier_name = $scope.searchStr;
            }
            if ($scope.searchKey == 'proname') {
                sendJson.productName = $scope.searchStr;
            }
            if ($scope.searchKey == 'username') {
                sendJson.accountName = $scope.searchStr;
            }
            // sendJson.rootPaCodeId = $scope.rootPaCodeId;
            // sendJson.codeId = $scope.brunchItem.codeId;
            // erp.load();
            erp.loadPercent($('.tab-con-wrap'), 750);
            $scope.productList = [];
            erp.postFun("app/goodsInfo/getOfferingInfoList", JSON.stringify(sendJson), function (data) {
                // erp.closeLoad();
                erp.closeLoadPercent($('.tab-con-wrap'));
                console.log(data);
                if ($scope.brunchItem) {
                    $scope.brunchItem.path = data.data.path;
                }
                var result = data.data.list;
                for (var i = 0; i < result.length; i++) {
                    result[i].down = true;
                }
                $scope.productList = result;
                $scope.totalNum = data.data.totalNum;
                $scope.totalPageNum = Math.ceil($scope.totalNum / $scope.pagesize);
                if ($scope.totalNum == 0) {
                    erp.addNodataPic($('.tab-con-wrap'), 750);
                    return;
                }
                ;
                erp.removeNodataPic($('.tab-con-wrap'), 750);
                // alert(1)
                $scope.pageNum = '1';
                pageFun(erp, $scope, function (n, type) {
                    if (type == 'init') {
                        return;
                    }
                    ;
                    $scope.pageNum = n;
                    var sendJson = {};
                    sendJson.page = $scope.pageNum;
                    sendJson.pageNum = $scope.pageSize;
                    // sendJson.searchParam = $scope.searchStr;
                    if ($scope.cateItem) {
                        sendJson.catgoryIdSearch = $scope.cateItem.id;
                    }
                    if ($scope.brunchItem) {
                        sendJson.pathIdSearch = $scope.brunchItem.id;
                    }
                    if ($scope.searchKey == 'SKU') {
                        sendJson.productSKU = $scope.searchStr;
                    }
                    if ($scope.searchKey == 'proname') {
                        sendJson.productName = $scope.searchStr;
                    }
                    if ($scope.searchKey == 'username') {
                        sendJson.accountName = $scope.searchStr;
                    }
                    // sendJson.rootPaCodeId = $scope.rootPaCodeId;
                    // sendJson.codeId = $scope.brunchItem.codeId;
                    // erp.load();
                    erp.loadPercent($('.tab-con-wrap'), 750);
                    $scope.productList = [];
                    erp.postFun("app/goodsInfo/getOfferingInfoList", JSON.stringify(sendJson), function (data) {
                        // erp.closeLoad();
                        erp.closeLoadPercent($('.tab-con-wrap'));
                        console.log(data);
                        var result = data.data.list;
                        for (var i = 0; i < result.length; i++) {
                            result[i].down = true;
                        }
                        $scope.productList = result;
                    }, err)
                });
            }, err);
        }

        getList(erp, $scope);
        $scope.showVariant = function (item, index1) {
            // $scope.nowOpePro = item;
            $scope.nowOpeList = $scope.productList[index1];
            var sendJson = {};
            sendJson.offeringInfoId = item.id;
            sendJson.regionPathId = $scope.brunchItem.id;
            if ($scope.searchKey == 'username') {
                sendJson.accountName = $scope.searchStr;
            }
            layer.load(2);
            erp.postFun('app/goodsInfo/getGoodsInfoList', JSON.stringify(sendJson), function (data) {
                layer.closeAll('loading');
                //$scope.nowOpeList.vList = data.data.list;
                console.log($scope.nowOpeList);
                $scope.nowOpeList.vList = sjb(data.data.list);
                $scope.nowOpeList.down = false;
            }, err);
        }
        function sjb (arrData){
            var hash = {};
            var res = [];
            arrData.forEach(function (o, i) {
                var sku = o.sku;
                var img = o.img;
                hash[sku] ? res[hash[sku] - 1].arr.push(o) : hash[sku] = ++i && res.push({
                    arr: [o],
                    sku: sku,
                    img: img,
                })
            });
            res.forEach(function (a, b) {
                var ace = []
                var hash1 = {};
                a.arr.forEach(function (k, j) {
                    var type = k.regCodeName.split('>')[0];
                    if (hash1[type]) {
                        ace[hash1[type] - 1].arr.push(k);
                        var num = null;
                        ace[hash1[type] - 1].arr.forEach(function (o, i) {
                            num += Number(o.goodsNum);
                        })
                        ace[hash1[type] - 1].goodsNum = num
                    } else {
                        hash1[type] = ++j && ace.push({
                            arr: [k],
                            type: type,
                            goodsNum: k.goodsNum
                        })
                    }
                    /*   hash1[type] ? ace[hash1[type] - 1].arr.push(k) : hash1[type] = ++j && ace.push({
                           arr: [k],
                           type: type,
                       })*/
                })
                a.arr = ace;
            });
            return res;
        }
        $scope.hideVariant = function (item, index1) {
            $scope.productList[index1].vList = [];
            $scope.productList[index1].down = true;
            // $scope.nowOpePro = {};
        }
        $scope.searchKey = 'SKU';
        $scope.search = function () {
            getList(erp, $scope);
        }
        $scope.enterSearch = function (e) {
            if (e.keyCode == 13) {
                getList(erp, $scope);
            }
        }
        // $scope.showFullSku = function (item) {
        //     layer.open({
        //         title: '商品SKU'
        //         ,content: item.sku
        //     });
        // }
        $scope.turnToPriv = function (itemv, item) {
            $scope.nowOpePro = item;
            $scope.chanVarToPrivFlag = true;
            $scope.chanVarStatusType = '转至私有库存';
            $scope.nowOpeVariant = itemv;
        }
        $scope.turnToPub = function (itemv, item) {
            console.log(itemv,item)
            $scope.nowOpePro = item;
            $scope.chanVarToPubFlag = true;
            $scope.chanVarStatusType = '转至公有库存';
            $scope.nowOpeVariant = itemv;
        }
        $scope.cancelChanVarStatus = function () {
            $scope.chanVarToPrivFlag = false;
            $scope.chanVarToPubFlag = false;
            $scope.nowOpeVariant = {};
            $scope.chanVarNum = '';
            $scope.turnPrivCust = null;
            $scope.customerName = '';
            $scope.customerList = null;
            $scope.nowOpePro = null;
        }
        $scope.goActChanVarStatus = function () {
            if ($scope.chanVarToPrivFlag && !$scope.turnPrivCust) {
                layer.msg('请选择客户');
                return;
            }
            if (!$scope.chanVarNum) {
                layer.msg('请输入数量');
                return;
            }
            if (isNaN($scope.chanVarNum)) {
                layer.msg('数量部分请输入数字');
                $scope.chanVarNum = '';
                return;
            }
            // if ($scope.chanVarNum * 1 > $scope.nowOpeVariant.goodsNum * 1) {
            //     layer.msg('操作数量不能超过' + $scope.nowOpeVariant.goodsNum + '个');
            //     return;
            // }
            var postUrl;
            var postData = {};
            postData.id = $scope.nowOpeVariant.id;
            postData.optValue = $scope.chanVarNum;
            if ($scope.chanVarToPrivFlag) {
                postUrl = 'app/goodsInfo/addPrivateGoodsInfo';
                postData.ownerId = $scope.turnPrivCust.id;
            }
            if ($scope.chanVarToPubFlag) {
                postUrl = 'app/goodsInfo/addPublicByPrivate';
            }
            // erp.load();
            layer.load(2);
            erp.postFun(postUrl, JSON.stringify(postData), function (data) {
                layer.closeAll('loading');
                console.log(data);
                if (data.data.code != 200) {
                    if(data.data.code==401){
                        layer.msg(data.data.message)
                    }else{
                        layer.msg('操作失败');
                    }
                    return;
                }
                layer.msg('操作成功')
                erp.postFun('app/goodsInfo/getGoodsInfoList', JSON.stringify({
                    offeringInfoId: $scope.nowOpePro.id,
                    regionPathId: $scope.brunchItem.id
                }), function (data) {
                    $scope.nowOpeList.vList = sjb(data.data.list);
                    //$scope.nowOpeList.vList = data.data.list;
                    console.log($scope.nowOpeList.vList);
                    $scope.nowOpeList.down = false;
                }, err);
                $scope.cancelChanVarStatus();
            }, err);
        }
        $scope.inStock = function (itemV, index2, index1, item,index3,index4) {
            $scope.nowOpePro = item;
            $scope.nowOpePro.index = index1;
            $scope.inStockFlag = true;
            $scope.opeStockType = '入库';
            $scope.nowOpeVariant = itemV;
            $scope.nowOpeVariant.index = index2;
            $scope.idx3 = index3;
            $scope.idx4 = index4;
        }
        $scope.outStock = function (itemV, index2, index1, item,index3,index4) {
            $scope.nowOpePro = item;
            $scope.nowOpePro.index = index1;
            $scope.outStockFlag = true;
            $scope.opeStockType = '出库';
            $scope.nowOpeVariant = itemV;
            $scope.nowOpeVariant.index = index2;
            $scope.idx3 = index3;
            $scope.idx4 = index4;
        }

        $scope.goOpeStock = function () {
            if (!$scope.opeStockNum) {
                layer.msg('输入值不能为空');
                return false;
            }
            if (isNaN($scope.opeStockNum) || $scope.opeStockNum * 1 < 1) {
                layer.msg('请输入大于0的数字');
                return false;
            }
            var postUrl;
            if ($scope.inStockFlag) {
                postUrl = 'app/goodsInfo/impNumOpt';
            }
            if ($scope.outStockFlag) {
                if ($scope.nowOpeVariant.ownerFlag == 'private') {
                    postUrl = 'app/goodsInfo/expNumOpt';
                }
                if ($scope.nowOpeVariant.ownerFlag == 'public') {
                    postUrl = 'app/goodsInfo/expPulbicNumOpt';
                }
            }
            erp.postFun(postUrl, JSON.stringify({
                id: $scope.nowOpeVariant.id,
                optVal: $scope.opeStockNum,
                remark: $scope.opeStockRemark
            }), function (data) {
                console.log(data);
                if (data.data.code != 200) {
                    if(data.data.code==401){
                        layer.msg(data.data.message)
                    }else if(data.data.code==300){
                        layer.msg('出库数量不能大于库存数量')
                    }else{
                        layer.msg('网络错误');
                    }
                    return false;
                }
                layer.msg('操作成功');
                var count = $scope.outStockFlag ? (-($scope.opeStockNum * 1)) : ($scope.opeStockNum * 1);
                // console.log(count);
                $scope.productList[$scope.nowOpePro.index].totalNum = $scope.productList[$scope.nowOpePro.index].totalNum * 1 + count;
                console.log($scope.productList[$scope.nowOpePro.index].vList)
                $scope.productList[$scope.nowOpePro.index].vList[$scope.nowOpeVariant.index].arr[$scope.idx3].goodsNum = $scope.productList[$scope.nowOpePro.index].vList[$scope.nowOpeVariant.index].arr[$scope.idx3].goodsNum  * 1 + count;
                $scope.productList[$scope.nowOpePro.index].vList[$scope.nowOpeVariant.index].arr[$scope.idx3].arr[$scope.idx4].goodsNum = $scope.productList[$scope.nowOpePro.index].vList[$scope.nowOpeVariant.index].arr[$scope.idx3].arr[$scope.idx4].goodsNum * 1 + count;
                //$scope.productList[$scope.nowOpePro.index].vList[$scope.nowOpeVariant.index].goodsNum = $scope.productList[$scope.nowOpePro.index].vList[$scope.nowOpeVariant.index].goodsNum * 1 + count;
                $scope.opeStockNum = '';
                $scope.opeStockRemark = '';
                $scope.inStockFlag = false;
                $scope.outStockFlag = false;
            }, err);
        }

        $scope.toChuku = function (item, index2, index1) {
            layer.open({
                title: '出库数量'
                ,
                type: 1
                ,
                btn: ['确定']
                ,
                area: ['200px', '150px']
                ,
                content: '<input style="width: 180px; height: 30px; border: 1px solid #eee; margin: 10px;" type="text" />'
                ,
                yes: function (index, layero) {
                    var count = $(layero).find('input').val();
                    if (!count) {
                        layer.msg('输入值不能为空');
                        return false;
                    }
                    if (isNaN(count) || count * 1 < 1) {
                        layer.msg('请输入大于0的数字');
                        return false;
                    }
                    // if (count * 1 > item.goodsNum * 1) {
                    //     layer.msg('操作数量不能超过' + item.goodsNum + '个');
                    //     return false;
                    // }
                    var postUrl;
                    if (item.ownerFlag == 'public') {
                        postUrl = 'app/goodsInfo/expPulbicNumOpt';
                    }
                    if (item.ownerFlag == 'private') {
                        postUrl = 'app/goodsInfo/expNumOpt';
                    }
                    erp.postFun(postUrl, JSON.stringify({id: item.id, optVal: count}), function (data) {
                        console.log(data);
                        if (data.data.code != 200) {
                            if(data.data.code==300){
                                layer.msg('出库数量不能大于库存数量')
                            }else{
                                layer.msg('网络错误');
                            }
                            return false;
                        }
                        layer.close(index);
                        layer.msg('操作成功');
                        $scope.productList[index1].totalNum = $scope.productList[index1].totalNum * 1 - count * 1;
                        $scope.productList[index1].vList[index2].goodsNum = $scope.productList[index1].vList[index2].goodsNum * 1 - count * 1;
                    }, err);
                    return false;
                }
            });
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
            console.log(item);
            $scope.turnPrivCust = item;
            $scope.customerName = item.name;
            $scope.customerList = null;
        }
        $scope.customerBlur = function(){
            $timeout(function () {
                $scope.customerList = null;
            },200)
        }
        $scope.showPosi = function (item) {
            $scope.showPosiFlag = true;
        }

        $scope.index1 = '00';
        $scope.onTheRoot = true;
        $scope.pointOne = function (item) {
            $scope.pageNum = '1';
            $scope.brunchItem = item;
                // console.log($scope.brunchItem);
                if ($scope.brunchItem.sequence == 1) {
                    $scope.onTheRoot = true;
                } else {
                    $scope.onTheRoot = false;
                }
                $scope.folder.active = false;
                setAllChiToUnactive($scope.folder.childrens, 'childrens');
                item.active = true;
            getList(erp, $scope);

        }
        $scope.pointOneC = function (item) {
            $scope.pageNum = '1';
            $scope.cateItem = item;
            $scope.cateList.active = false;
            setAllChiToUnactive($scope.cateList.children, 'children');
            item.active = true;
            getList(erp, $scope);

        }
        $scope.switchListC = function (item, flag) {
            item.open = flag;
        }
        $scope.switchList = function (item, flag) {
            if (flag) { // 展开
                if (item.childrens) {
                    item.open = flag;
                } else { // 获取当前节点
                    getRootNode(erp, {
                        news: "1",
                        rank: item.sequence * 1 + 1 + '',
                        id: item.codeId + ''
                    }, function (result) {
                        item.childrens = result;
                        item.open = flag;
                    })
                }
            } else { // 收起
                item.open = flag;
            }
            // console.log(angular.element('.folder-wrap'))
            // angular.element('.folder-wrap').width((item.posi + 2) * 40 + 150 + 'px');
        }
        $scope.stockByCode = function () {
            if ($scope.brunchItem && $scope.brunchItem.sequence == 1) {
                $scope.codeStockFlag = true;
                setTimeout(function () {
                    angular.element('#sku-code').focus();
                }, 10)
            } else {
                layer.msg('请先选定一个仓库！');
            }
        }
        // var code;
        // $scope.posiList = []; // '81099'
        $scope.getCode = function (e) {
            if (e.keyCode == 13) {
                if (e.target.id == 'sku-code') {
                    $scope.code = angular.element('#sku-code').val();
                    console.log($scope.code);
                    if (!$scope.code) return;
                    layer.load(2);
                    erp.postFun('app/goodsInfo/getGoodsInfoByScanCode', JSON.stringify({
                        spShortCode: $scope.code,
                        storageId: $scope.brunchItem.pCodeKey
                    }), function (data) {
                        layer.closeAll('loading');
                        var data = data.data;
                        console.log(data);
                        if (data.code != 200) {
                            $scope.posiList = [];
                            layer.msg(data.message);
                            return;
                        }
                        $scope.posiList = data.productList;
                        if ($scope.addPosi) {
                            setTimeout(function () {
                                angular.element('#posi-code').focus();
                            }, 10);
                        } else {
                            setTimeout(function () {
                                console.log(angular.element('.inp-stock-num').eq(0));
                                angular.element('.inp-stock-num').eq(0).focus();
                            }, 100);
                        }
                    });
                } else if (e.target.id == 'sku-code-1') {
                    let erpData = {};
                    $scope.code = angular.element('#sku-code-1').val();
                    erpData.cjSku = angular.element('#sku-code-1').val();
                    erpData.startTime = $('#c-start-time').val();
                    erpData.endTime = $('#c-end-time').val();
                    if (!erpData.cjSku) return;
                    layer.load(2);
                    erp.postFun('storage/storageBasic/kuCunChaXun', JSON.stringify(erpData), function (data) {
                        layer.closeAll('loading');
                        var data = data.data;
                        console.log(data);
                        if (data.statusCode == 200) {
                            $scope.caiGouZongShu = data.result.caiGouZongShu;
                            $scope.qianShouZongShu = data.result.qianShouZongShu;
                            $scope.yiChangZongShu = data.result.yiChangZongShu;
                            $scope.ruKuZongShu = data.result.ruKuZongShu;
                            $scope.articleList = data.result.list;
                            console.log($scope.articleList);
                        } else {
                            $scope.articleList = [];
                            layer.msg(data.message);
                            return;
                        }
                        // if ($scope.addPosi) {
                        //     setTimeout(function () {
                        //         angular.element('#posi-code').focus();
                        //     }, 10);
                        // } else {
                        //     setTimeout(function () {
                        //         console.log(angular.element('.inp-stock-num').eq(0));
                        //         angular.element('.inp-stock-num').eq(0).focus();
                        //     }, 100);
                        // }
                    });
                }
            }
        }
        $scope.getPosiCode = function (e) {
            if (e.keyCode == 13) {
                $scope.goAddPosi();
            }
        }
        $scope.focusPosiInp = function () {
            setTimeout(function () {
                angular.element('#posi-code').focus();
            }, 10);
        }
        $scope.goAddPosi = function () {
            if (!$scope.code) {
                layer.msg('请先扫描或输入SKU信息！');
                setTimeout(function () {
                    angular.element('#sku-code').focus();
                }, 10);
                $scope.posiCode = '';
                return;
            }
            $scope.posiCode = angular.element('#posi-code').val();
            if (!$scope.posiCode) return;
            for (var i = 0; i < $scope.posiList.length; i++) {
                if ($scope.posiList[i].regionBarcode == $scope.posiCode) {
                    layer.msg('列表中已有该位置，请勿重复添加！');
                    angular.element('#posi-code').val('');
                    $scope.posiCode = '';
                    return;
                }
            }
            console.log($scope.posiCode);
            layer.load(2);
            erp.postFun('app/goodsInfo/getRegionInfoByScanCode', JSON.stringify({
                regionBarcode: $scope.posiCode,
                storageId: $scope.brunchItem.pCodeKey
            }), function (data) {
                layer.closeAll('loading');
                var data = data.data;
                console.log(data);
                if (data.code != 200) {
                    layer.msg(data.message);
                    return;
                }
                $scope.posiList.unshift(data.regionInfoMap);
                angular.element('#posi-code').val('');
                $scope.posiCode = '';
                setTimeout(function () {
                    angular.element('.inp-stock-num').eq(0).focus();
                }, 100);
            });
        }
        $scope.checkIsNum = function (i) {
            var str = $scope.posiList[i].optVal;
            if (str.indexOf('.') != -1 || isNaN(str) || str * 1 < 0) {
                layer.msg('请输入大于0的整数');
                $scope.posiList[i].optVal = '';
            }
        }

        $scope.continueFlag = false;
        $scope.rukuAlertText = '';
        $scope.reqDate = {};
        $scope.resetRuku = function () {
            $scope.continueFlag = false;
            $scope.codeStockFlag=false;
            $scope.code='';
            $scope.posiList=[];
            $scope.posiCode='';
        };
        $scope.putStorageType = '0';
        $scope.checkRuKuType = function(type){
            $scope.putStorageType = type;
            console.log($scope.putStorageType)
        }
        $scope.goOpeStockByCode = function () {
            if (!$scope.code) {
                layer.msg('请先扫描或输入SKU信息！');
                setTimeout(function () {
                    angular.element('#sku-code').focus();
                }, 10);
                return;
            }
            var regionList = [];
            for (var i = 0; i < $scope.posiList.length; i++) {
                if ($scope.posiList[i].optVal&&$scope.posiList[i].optVal>0) {
                    regionList.push({
                        regionPathId: $scope.posiList[i].regionPathId,
                        optVal: $scope.posiList[i].optVal,
                        pathAllName: $scope.posiList[i].pathAllName,
                        ownerId: '',
                        ownerFlag: 'public'
                    });
                }
            }
            if (regionList.length == 0) {
                layer.msg('入库数量不能为空！');
                return;
            }
            layer.load(2);

            $scope.reqDate.storageId = $scope.brunchItem.pCodeKey;
            $scope.reqDate.spShortCode = $scope.code;
            $scope.reqDate.putStorageType = $scope.putStorageType;
            $scope.reqDate.regionList = JSON.stringify(regionList);

            erp.postFun('storage/historyGoodsInfo/impGoodsByScanCode', JSON.stringify($scope.reqDate), function (data) {
                layer.closeAll('loading');
                var data = data.data;
                console.log(data);
                $scope.reqDate.isopen = undefined;
                if (data.code != 200) {
                    if (data.code == 400) {
                        var date;
                        $scope.continueFlag = true;
                        erp.formatDate(data.data.createdate.time, function (d) { date = d; });
                        $scope.rukuAlertText = `${data.data.userName}已经在
                          ${date.y}年${date.m}月${date.d}日${date.h}时${date.mm}分${date.s}秒入库
                          是否继续入库？`;
                    } else {
                        layer.msg(data.message);
                    }
                } else {
                    $scope.codeStockSucessFlag = true;
                    // $scope.successList = data.successList;
                    $scope.posiList = null;
                    $scope.code = '';
                    angular.element('#sku-code').val('');
                    // layer.msg('提交成功，后台正在处理，库存信息会在1～2分钟后更新');
                }
            });
        }
        $scope.rukuAlertHandle = function (bool) {
            if (bool) {
                $scope.reqDate.isopen = 'open';
                $scope.goOpeStockByCode();
            } else {
                $scope.posiList=[];
            }
            $scope.continueFlag = false;
        };
        $scope.continueStock = function () {
            setTimeout(function () {
                angular.element('#sku-code').focus();
            }, 10)
        }

        $scope.quantity = () => {
            $scope.quantityFlag = true;
        }
        $scope.query = () => {
            let erpData = {};
            $scope.code = angular.element('#sku-code-1').val();
            erpData.cjSku = angular.element('#sku-code-1').val();
            erpData.startTime = $('#c-start-time').val();
            erpData.endTime = $('#c-end-time').val();
            if (!erpData.cjSku) return;
            layer.load(2);
            erp.postFun('storage/storageBasic/kuCunChaXun', JSON.stringify(erpData), function (data) {
                layer.closeAll('loading');
                var data = data.data;
                console.log(data);
                if (data.statusCode == 200) {
                    $scope.caiGouZongShu = data.result.caiGouZongShu;
                    $scope.qianShouZongShu = data.result.qianShouZongShu;
                    $scope.yiChangZongShu = data.result.yiChangZongShu;
                    $scope.ruKuZongShu = data.result.ruKuZongShu;
                    $scope.articleList = data.result.list;
                    console.log($scope.articleList);
                } else {
                    $scope.articleList = [];
                    layer.msg(data.message);
                    return;
                }
                // if ($scope.addPosi) {
                //     setTimeout(function () {
                //         angular.element('#posi-code').focus();
                //     }, 10);
                // } else {
                //     setTimeout(function () {
                //         console.log(angular.element('.inp-stock-num').eq(0));
                //         angular.element('.inp-stock-num').eq(0).focus();
                //     }, 100);
                // }
            });
        }
    }]);
    function err(error) {
        console.log(error);
        layer.closeAll('loading');
    }
    function setAllChiToUnactive(arr, tag) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].active = false;
            if (arr[i][tag] && arr[i][tag].length > 0) {
                setAllChiToUnactive(arr[i][tag], tag);
            }
        }
    }
    function getRootNode (erp, data, success) {
        erp.postFun('app/storagedo/getNewRootTreeNode', data, function (data) {
            if (data.data.code == 200 && data.data.root) {
                success(data.data.root)
            } else {
                layer.msg('获取仓库类目失败 ')
            }
        })
    }
    //分页
    function pageFun(erp, $scope, pagechange) {
        $("#pagination1").jqPaginator({
            totalCounts: $scope.totalNum,
            pageSize: $scope.pageSize * 1,
            visiblePages: 5,
            currentPage: $scope.pageNum * 1,
            activeClass: 'current',
            first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
            prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
            next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
            last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
            page: '<a href="javascript:void(0);">{{page}}<\/a>',
            onPageChange: pagechange
        });
    }
}();