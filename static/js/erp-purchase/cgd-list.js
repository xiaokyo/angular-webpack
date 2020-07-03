(function () {
    var app = angular.module('purchase-cgd-app', []);

    var APIS = {
        todaySkuListVariant:'procurement/order/todaySkuListVariant',// 获取sku列表  是否缺货按参数来判断
        caiGouList:'procurement/order/queryProcurementOrderList',// 采购列表
        queHuoList:'procurement/order/todaySkuListQueHuo',// 缺货列表
    }

    //erp采购  出单需采购
    app.controller('needbuyCgdCtrl', ['$scope', "erp","$http", 'utils', function ($scope, erp,$http, utils) {
        console.log('导出采购信息')
        function err(a) {
            console.log(a);
            layer.closeAll('loading');
        };
        $scope.data = {
            dindanhao: '', buycount: '', comprice: '', youhuiprice: '', daohuoday: '', wuliufeiyong: '', jine: '', zhuizonghao: '', fahuoshuliang: '', cangku: '', liuyan: ''
        }
        $scope.dindan = false;
        $scope.storages = [];
        $scope.cangku = '';
        $scope.pageSize = '30';
        $scope.pageNum = '1';
        $scope.totalNum = 0;
        $scope.totalPageNum = 0;
        $scope.searchSku = '';

        $scope.messageFlag = false;
        var productId;
        var clickItem;
        $scope.aaa = function (item) {
            productId = item.PRODUCTId || item.productId;
            $scope.messageArea = item.remark
            clickItem = item;
            $scope.addRemarkText = ''
            $scope.messageFlag = true;
            // $scope.localRemark = item.LOCREMARK;
        }
        $scope.messageCloseFun = function () {
            $scope.messageFlag = false;
        }
        $scope.remarkShowFun = function (ev) {
            $(ev.target).children('.remark-con').show();
            console.log('show')
        }
        $scope.remarkHideFun = function (ev) {
            $(ev.target).children('.remark-con').show();
            console.log('hide')
        }

        $('.table-con-box').on('mouseenter', '.remark-box', function () {
            if ($.trim($(this).find('.cg-remark-text').text()) || $.trim($(this).find('.sp-remark-text').text())) {
                $(this).children('.remark-con').show();
            }
        })
        $('.table-con-box').on('mouseleave', '.remark-box', function () {
            $(this).children('.remark-con').hide();
        })
        $scope.messageSureFun = function () {
            let searchList
			if($scope.addRemarkText) {
				searchList = [`${$scope.addRemarkText},${loginName},${utils.changeTime(new Date(), true)}`, ...$scope.messageArea]
			} else {
				searchList = [...$scope.messageArea]
			}
            const params = { productId, search: searchList.length > 0 ? JSON.stringify(searchList) : '' };
            console.log(params)		
            erp.mypost('procurement/order/setMessage', params).then(() => {
                getList(erp, $scope);;
                $scope.messageFlag = false;
                layer.msg('备注成功')
            }).catch(() => {
                $scope.messageFlag = false;
                layer.msg("备注失败");
            })		
        }
        $scope.deleteRemarkFn = idx => {
            $scope.messageArea = $scope.messageArea.filter((_, index) => idx !== index)
            console.log($scope.messageArea)
        }
        //预采购
        $scope.yuCaiGouFun = function (item) {
            console.log(item)
            var storeNum;
            if ($scope.storageId == '201e67f6ba4644c0a36d63bf4989dd70' || $scope.storageId == '738A09F1-2834-43CC-85A8-2FE5610C2599') {
                storeNum = 2
            } else if ($scope.storageId == '{6709CCD7-0DC7-43B1-B310-17AB499E9B0A}') {
                storeNum = 0
            } else if ($scope.storageId == '85742FBC-38D7-4DC4-9496-296186FFEED8') {
                storeNum = 1
            }
            console.log(storeNum)
            var upJson = {};
            upJson.bianTiId = item.VARIANTID;
            upJson.store = storeNum;
            erp.postFun('caigou/procurement/quQitianJiLu', JSON.stringify(upJson), function (data) {
                console.log(data)
                if (data.data.statusCode == 200) {
                    if (JSON.stringify(data.data.result) != '[]') {
                        $scope.yuCaiGouFlag = true;
                        $scope.caiGouHisList = data.data.result;
                    } else {
                        layer.msg('暂无信息')
                    }
                } else {
                    layer.msg('暂无信息')
                }
            }, function (data) {
                console.log(data)
            }, { layer: true })
        }
        $scope.yiZhiFuOrdFun = function (item, stu) {
            if (stu == 1) {
                $scope.yiZhiFuOrdList = item.yiZhiFuDingDan
                if ($scope.yiZhiFuOrdList && JSON.stringify($scope.yiZhiFuOrdList) != "[]") {
                    $scope.zhiFuOrdFlag = true;
                } else {
                    layer.msg('无已支付订单详情')
                }
            } else {
                $scope.yiZhiFuOrdList = item.weiZhiFuDingDan
                console.log($scope.yiZhiFuOrdList)
                if ($scope.yiZhiFuOrdList && JSON.stringify($scope.yiZhiFuOrdList) != "[]") {
                    $scope.zhiFuOrdFlag = true;
                } else {
                    layer.msg('无未支付订单详情')
                }
            }
        }
        //获取仓库
        erp.getFun('app/storage/getStorage', function (data) {
            console.log(data)
            var obj = JSON.parse(data.data.result);
            console.log(obj)
            $scope.ckArr = obj;
        }, function (data) {
            erp.closeLoad();
            console.log('仓库获取失败')
        })

        // erp.getStorage(function(list){ 
        //     $scope.ckArr = list
        //     if(list.length > 0) $scope.storageId = list[0].dataId
        //  },1)
        $scope.storageId = "{6709CCD7-0DC7-43B1-B310-17AB499E9B0A}";
        // 获取列表
        function getList(erp, $scope) {
            erp.load();
            erp.postFun($scope.isQueHuoFlag?APIS.queHuoList:APIS.caiGouList, {
                'pageNum': $scope.pageNum + '',
                'pageSize': $scope.pageSize + '',
                data:{   
                    'storageId': $scope.storageId,
                    'inputStr': $scope.searchSku,
                    'diJi': $scope.cgDjVal,
                    'personalizedIdentity':$scope.personalizedIdentity,
                    'buyerId':$scope.buyerId
                }
            }, function (n) {
                erp.closeLoad();
                let res = n.data
                console.log(res);
                if (res.code != 200) {
                    layer.msg('网络错误');
                    return;
                }
                
                var obj = res.data
                if(!obj){
                    $scope.chudanliebiao = []
                    return layer.msg('无数据')
                }
                $scope.totalNum = obj.total;
                console.log($scope.totalNum)
                if (obj.total == 0) {
                    $scope.totalpage = 0;
                    $scope.customerList = [];
                    layer.msg("没有找到数据");
                    $scope.chudanliebiao = [];
                    $scope.countMoney = 0;
                    return;
                }
                for (var i = 0; i < obj.list.length; i++) {
                    obj.list[i].checked = false;
                }
                $scope.chudanliebiao = obj.list.map(item => {
                    if(item.remark) {
						item.remark = item.remark.startsWith('[') ? JSON.parse(item.remark) : [item.remark]
					} else {
						item.remark = []
					}
                    return item
                });
                console.log($scope.chudanliebiao);
                $scope.totalPageNum = Math.ceil($scope.totalNum / ($scope.pagesize * 1));
                // countMFun ($scope.chudanliebiao)
                pageFun(erp, $scope);
            }, err);
        }

        $scope.purchasePersonCallback = function({id}){
			console.log('purchasePersonCallback11111', id)
			$scope.buyerId = undefined
			$scope.personalizedIdentity = 2
			if(id == 'POD') $scope.personalizedIdentity = 1
			if(id != 'POD' && id != ''){
				$scope.buyerId = id
				$scope.personalizedIdentity = 0
			}
			getList(erp,$scope)
		}
        
        $scope.queHuoTab = function (ev) {
            if ($(ev.target).hasClass('que-huo-act')) {
                $scope.isQueHuoFlag = false;
                $(ev.target).removeClass('que-huo-act')
                $scope.pageNum = '1';
                getList(erp, $scope)
            } else {
                $scope.isQueHuoFlag = true;
                $(ev.target).addClass('que-huo-act')
                $scope.pageNum = '1';
                getList(erp, $scope)
            }
        }
        function countMFun(val) {
            var len = val.length;
            var count = 0;
            for (var i = 0; i < len; i++) {
                count += val[i].COSTPRICE * val[i].ORDERNEEDCOUNT;
            }
            $scope.countMoney = count.toFixed(2)
            console.log($scope.countMoney);
        }
        //分页
        function pageFun(erp, $scope) {
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
                onPageChange: function (n, type) {
                    if (type == 'init') {
                        return;
                    };
                    erp.load();
                    $scope.pageNum = n;
                    getList(erp, $scope)
                }
            });
        }
        // getList(erp, $scope);
        $scope.changePageSize = function () {
            $scope.pageNum = '1';
            getList(erp, $scope);
        }
        $scope.toSpecifiedPage = function () {
            var totalpage = Math.ceil($scope.totalNum / ($scope.pageSize - 0));
            if (!$scope.pageNum || $scope.pageNum > totalpage || $scope.pageNum < 1) {
                layer.msg('页码不存在')
                return
            }
            getList(erp, $scope);
        }
        $scope.selByStorageFun = function () {
            $scope.pageNum = '1';
            getList(erp, $scope);
        }
        //按sku进行搜索
        $('.sku-inp').keypress(function (Event) {
            if (Event.keyCode == 13) {
                $scope.skuSearchFun();
            }
        })
        $scope.skuSearchFun = function () {
            $scope.pageNum = '1';
            getList(erp, $scope);
        }
        $scope.cgDjChangeFun = function () {
            $scope.pageNum = '1';
            getList(erp, $scope);
        }
        // erp.getFun('app/storage/getStorage', function (data) {
        //     console.log(data)
        //     var obj = JSON.parse(data.data.result);
        //     console.log(obj)
        //     $scope.ckArr = obj;
        // }, function (data) {
        //     erp.closeLoad();
        //     console.log('仓库获取失败')
        // })
        //查看供应商
        $scope.ckflag = false;
        $scope.ckFun = function (item) {
            $scope.ckflag = true;
            $scope.ckgysPid = item.productId;
            console.log($scope.ckgysPid)
            let supplierLink = item.supplierLink || item.supllierLink
            if(typeof supplierLink == 'string') supplierLink = JSON.parse(supplierLink)
            $scope.gysList = supplierLink;
            console.log($scope.gysList)
        }
        $scope.addGysFun = function () {
            // {"name":"https://detail.1688.com",
            // "star":5,"$$hashKey":"object:1115"}
            var gysObj = {};
            gysObj.name = '';
            gysObj.star = 5;
            gysObj.flag = true;
            $scope.gysList.push(gysObj)
            console.log($scope.gysList)
        }
        $scope.bianjiGysFun = function () {
            for (var i = 0, len = $scope.gysList.length; i < len; i++) {
                $scope.gysList[i].flag = true;
            }
        }
        $scope.deletGysFun = function (index) {
            if ($scope.gysList.length == 1) {
                layer.msg('至少要保留一个供应商')
                return
            }
            $scope.gysList.splice(index, 1)
        }
        $scope.gyspxUpFun = function (index) {
            console.log(index)
            if (index != 0) {
                var spliceItem = $scope.gysList.splice(index, 1)[0];
                console.log(spliceItem)
                console.log($scope.gysList)
                $scope.gysList.splice(index - 1, 0, spliceItem)
                console.log($scope.gysList)
            } else {
                layer.msg('当前行在最顶端,不能再上移')
            }
        }
        $scope.gyspxDownFun = function (index) {
            console.log(index)
            if (index + 1 != $scope.gysList.length) {
                var spliceItem = $scope.gysList.splice(index, 1)[0];
                console.log($scope.gysList)
                $scope.gysList.splice(index + 1, 0, spliceItem)
                console.log(spliceItem)
                console.log($scope.gysList)
            } else {
                layer.msg('当前行在最底端,不能再下移')
            }
        }
        $scope.ckGysWcFun = function () {
            console.log($scope.gysList)
            var wcBianjiObj = {};
            wcBianjiObj.supplierLinks = [];
            wcBianjiObj.pid = $scope.ckgysPid
            for (var i = 0, len = $scope.gysList.length; i < len; i++) {
                console.log($scope.gysList[i].name)
                console.log($scope.gysList[i].star)
                console.log($scope.gysList[i].name && $scope.gysList[i].star)
                if ($scope.gysList[i].name && $scope.gysList[i].star) {
                    wcBianjiObj.supplierLinks.push({
                        name: $scope.gysList[i].name,
                        star: $scope.gysList[i].star,
                        beiZhu: $scope.gysList[i].beiZhu
                    })
                } else {
                    // layer.msg('请把供应商信息填写完整')
                    // return
                }
            }
            if (wcBianjiObj.supplierLinks.length < 1) {
                layer.msg('请设置采购链接')
                return
            }
            erp.load()
            console.log(wcBianjiObj) 
            erp.postFun('procurement/order/xiuGaiLianJie', JSON.stringify(wcBianjiObj), function (data) {
                console.log(data)
                erp.closeLoad()
                
                if (data.data.code == 200 && data.data.success) {
                    layer.msg(data.data.message || '成功')
                    $scope.ckflag = false;
                    $scope.gysList = '';
                    getList(erp, $scope);
                }else{
                    layer.msg(data.data.message || '失败')
                }
            }, function (data) {
                console.log(data)
                erp.closeLoad()
            })
        }
        // $scope.defaultStar = 5;
        $scope.changeSPStar = function (starNum, item) {
            console.log(starNum)
            item.star = starNum;
            console.log(item)
            console.log($scope.gysList)
        }
        $scope.showYStar = function (ev) {
            $(ev.target).addClass('star');
            $(ev.target).prevAll("a").addClass("star").end().nextAll("a").removeClass("star");
        }
        $scope.hideYStar = function (item, ev) {
            $(ev.target).parent('.td-star').children('a').removeClass('star')
            console.log(item.star)
            for (var i = 0, len = item.star; i < len; i++) {
                $(ev.target).parent('.td-star').children('a').eq(i).addClass('star')
            }
        }
        $scope.ckcloseFun = function () {
            $scope.ckflag = false;
            $scope.flag1 = false;
            $scope.cgList = '';
        }

        $scope.flag1 = false;
        //全局变量接收是属于 点击的那一个采购单
        var clickProcurement;
        $scope.caigou = function (item,pItem) {
            return layer.msg('此页面 值开放 批量导出功能')
            $scope.flag1 = true;
            var arr = [];
            if (arr.length == 0) {
                arr.push(item.ID + '')
            }
            $scope.btArr = arr;
            var a = JSON.parse(item.supplierLink);
            // $scope.cgList = JSON.parse(item.supplierLink);
            $scope.btItemObj = item;
            clickProcurement = item;
            var cgPrice = item.COSTPRICE;//采购价格
            for (var i = 0; i < a.length; i++) {
                console.log(a[i])
                a[i].price = cgPrice;
                a[i].dingDanZhuangtai = 'zhengChang';
                a[i].ORDERNEEDCOUNT = item.ORDERNEEDCOUNT;
            }
            // console.log(a)
            $scope.cgList = a;
            $scope.variantId = item.VARIANTID;
            $scope.itemBtSku = item.SKU;
        }
        $scope.chudancaigou = function (item, index) {
            //采购链接
            var regBol = /^[0-9a-zA-Z]*$/g;
            //采购数量
            var ordNum = $("#ordnum" + index).val();
            if (!regBol.test(ordNum)) {
                layer.msg('请不要输入除了字母跟数字其它的字符串');
                return;
            }
            layer.load(2)
            erp.postFun("caigou/procurement/shengChengCaiGouDingDan", {
                "caiGouLianJie": item.name,
                "chuDanCaiGouIds": $scope.btArr,
                "dingDanHao": ordNum,
                "dingDanZhuangtai": item.dingDanZhuangtai
            }, suc, err);
            function suc(a) {
                $scope.flag1 = false;
                layer.closeAll('loading')
                // layer.msg("添加成功")
                console.log(a)
                layer.msg(a.data.message)
                if (a.data.statusCode == 200) {
                    layer.msg("添加成功")
                    $scope.cgList = '';
                    getList(erp, $scope);
                }
            };
        }

        //    获取仓库
        $scope.getcangku = function (n) {
            $scope.cangku = n;
            console.log($scope.cangku, n)
        }
        //    确定订单
        $scope.quedin = function (item, index) {
            console.log($scope.data.dindanhao, $scope.data.buycount, $scope.data.comprice, $scope.data.youhuiprice, $scope.data.daohuoday, $scope.data.wuliufeiyong, $scope.data.jine, $scope.data.zhuizonghao, $scope.data.fahuoshuliang, $scope.cangku, $scope.data.liuyan)
            erp.postFun("app/storage/buyAdd", { "data": "{'':{'img':'" + item.IMG + "','unit':'','productId':'','buier':'','buierId':'','detail':'" + $scope.data.liuyan + "','variantSku':'" + item.SKU + "','variantId':'" + item.vid + "','supplierName':'','order':'" + $scope.data.dindanhao + "','count':'" + $scope.data.buycount + "','costPrice':'" + $scope.data.jine + "','discount':'" + $scope.data.youhuiprice + "','transDay':'" + $scope.data.daohuoday + "','transFee':'" + $scope.data.wuliufeiyong + "','costAll':'" + $scope.costall + "','storageId':'" + $scope.cangku + "','storage':'','logist':{'" + $scope.waybill + "':{'log':'','count':'" + $scope.waybillcount + "'}}}}}" }, bb, err);

            function bb(a) {
                alert("添加成功")
            };
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
        //
        $scope.ordnumFlag = false;
        $scope.ordNunShowFun = function (item) {
            console.log(item);
            $scope.ordnumFlag = true;
            //$scope.ordList = JSON.parse(item.ORDERMAP);
            $scope.ordList = item.orderList;
        }
        $scope.closeOrdNumFun = function () {
            $scope.ordnumFlag = false;
        }
        //显示变体
        // var listObj = {};//存储所有商品和变体的对象
        $scope.showBtFun = function (item, ev, index) {
            btID = [];//变体id数组置为空
            btIdArr = [];//存储商品id的数组置为空
            item.checked = false;
            $scope.itemIndex = index;
            $(ev.target).toggleClass('.glyphicon glyphicon-triangle-top');
            if (!$(ev.target).hasClass('glyphicon-triangle-top')) {
                delete $scope.chudanliebiao[index].btList
                return
            }
            var btUpdata = {};
            btUpdata.pid = item.productId;
            btUpdata.isQueHuo = $scope.isQueHuoFlag
            if (item.storageId) {
                btUpdata.storageId = item.storageId;
            } else {
                btUpdata.storageId = $scope.storageId;
            }
            console.log(btUpdata)
            erp.postFun(APIS.todaySkuListVariant, JSON.stringify(btUpdata), function (data) {
                // console.log(data)
                // $scope.showbtFlag = true;
                var obj = {}
                obj.list = data.data.data;
                // console.log(obj)
                console.log('skuList',obj.list)
                if ($(ev.target).hasClass('glyphicon-triangle-top')) {
                    if (obj.list.length > 0) {
                        for (var i = 0; i < obj.list.length; i++) {
                            obj.list[i].checked = false;
                        }
                        $scope.chudanliebiao[index].btList = obj.list;
                        console.log($scope.chudanliebiao[index].btList)
                        // $scope.btListArr = $scope.chudanliebiao[index].btList;
                        console.log($scope.chudanliebiao)
                    }
                } else {
                    $scope.chudanliebiao[index].btList = [];
                }
            }, err)

        }
        $scope.cjcgFun = function (item, ev, index) {
            if (item.youJiaGe == 1) {
                layer.msg('已移至初级采购,请勿重复操作')
                return
            }
            console.log(item)
            $scope.gysList = JSON.parse(item.supplierLink);
            console.log($scope.gysList)
            erp.load()
            $scope.bianjiFlag = true;
            $scope.cgDjStu = 'chuJi';
            var btUpdata = {};
            btUpdata.pid = item.PRODUCTId;
            btUpdata.isQueHuo = $scope.isQueHuoFlag
            if (item.storageId) {
                btUpdata.storageId = item.storageId;
            } else {
                btUpdata.storageId = $scope.storageId;
            }
            erp.postFun(APIS.todaySkuListVariant, JSON.stringify(btUpdata), function (data) {
                console.log(data)
                erp.closeLoad();
                var obj = data.data.data;
                console.log(obj)
                $scope.spbtList = obj.list;
                console.log($scope.spbtList)
            }, err)
        }

        $scope.radioFun = function (item) {
            $scope.zhiDingLianJie = item.name;
        }
        $scope.cjcgSureFun = function () {
            if (!$scope.zhiDingLianJie) {
                layer.msg('请指定链接')
                return
            }
            var upArr = [];
            var isCanAddFlag = true;
            for (var i = 0, len = $scope.spbtList.length; i < len; i++) {
                if (!$scope.spbtList[i].ID || !$scope.spbtList[i].VARIANTID || !$scope.spbtList[i].ORDERNEEDCOUNT || !$scope.spbtList[i].COSTPRICE) {
                    isCanAddFlag = false;
                    break
                }
                upArr.push({
                    "id": $scope.spbtList[i].ID,
                    "variantId": $scope.spbtList[i].VARIANTID,
                    "shuLiang": $scope.spbtList[i].ORDERNEEDCOUNT,
                    "jiaGe": $scope.spbtList[i].COSTPRICE,
                    "chuJiLiuYan": $scope.spbtList[i].liuYan
                })
            }
            if (!isCanAddFlag) {
                layer.msg('请填写所有信息')
                return
            }
            erp.load()
            var upJson = {};
            upJson.bts = upArr;
            upJson.zhiDingLianJie = $scope.zhiDingLianJie;
            erp.postFun('caigou/procurement/gaiJiaGe', JSON.stringify(upJson), function (data) {
                erp.closeLoad()
                if (data.data.statusCode == 200) {
                    $scope.bianjiFlag = false;
                    $scope.spbtList = null;
                    $scope.zhiDingLianJie = null;
                    getList(erp, $scope);
                } else {
                    layer.msg(data.data.message)
                }
            }, function (data) {
                erp.closeLoad()
            })
        }
        $scope.gjcgFun = function (item, ev, index) {
            erp.load()
            $scope.bianjiFlag = true;
            $scope.cgDjStu = 'gaoJi';
            var btUpdata = {};
            btUpdata.pid = item.PRODUCTId;
            if (item.storageId) {
                btUpdata.storageId = item.storageId;
            } else {
                btUpdata.storageId = $scope.storageId;
            }
            erp.postFun(btUrl, JSON.stringify(btUpdata), function (data) {
                erp.closeLoad();
                var obj = data.data.data;
                $scope.spbtList = obj.list;
            }, err)
        }
        $scope.gjcgSureFun = function () {
            var upArr = [];
            var isCanAddFlag = true;
            for (var i = 0, len = $scope.spbtList.length; i < len; i++) {
                upArr.push({
                    "id": $scope.spbtList[i].ID,
                    "variantId": $scope.spbtList[i].VARIANTID
                })
            }
            erp.load()
            var upJson = {};
            upJson.bts = upArr;
            erp.postFun('caigou/procurement/gaiJiaGe2', JSON.stringify(upJson), function (data) {
                erp.closeLoad()
                if (data.data.statusCode == 200) {
                    $scope.bianjiFlag = false;
                    $scope.spbtList = null;
                    getList(erp, $scope);
                } else {
                    layer.msg(data.data.message)
                }
            }, function (data) {
                erp.closeLoad()
            })
        }
        $scope.btCgLiuYanFun = function (liuYan) {
            $scope.gjcgLiuYan = liuYan;
            $scope.gjcgLiuYanFlag = true;
        }
        //清空所有
        $scope.qkFun = function (ev) {
            erp.load();
            erp.getFun('pojo/procurement/deleteAllOrderProcurement', function (data) {
                if (data.data[0].statusCode == 200) {
                    $(ev.target).hide();
                    $scope.chudanliebiao = [];
                    getList(erp, $scope);
                } else {
                    layer.msg('清空失败')
                }
            }, err)
        }
        $scope.sxFun = function () {
            erp.getFun('pojo/procurement/flush', function (data) {
                if (data.data[0].statusCode == 200) {
                    getList(erp, $scope);
                } else {
                    layer.msg('刷新失败')
                }
            }, err)
        }
        //采购线下完成
        $scope.errFlag = false;
        var orderProcurementId = '';//存储变体id
        var xxwcArr = [];
        $scope.qxXxcgFun = function () {
            $scope.isSureXxcgFlag = false;
        }
        $scope.sureXxcgFun = function () {
            erp.load();
            erp.postFun('caigou/procurement/xianXiaCaiGou', {
                "chuDanCaiGouIds": xxwcArr
            }, function (data) {
                layer.closeAll('loading')
                if (data.data.statusCode == 200) {
                    $scope.isSureXxcgFlag = false;
                    $scope.dingDanHFlag = true;
                    $scope.dingDanHao = data.data.result;
                } else {
                    layer.msg('线下采购失败')
                }
            }, function (data) {
                layer.closeAll('loading')
            })
        }
        var zjwcArr = [];
        $scope.zjWcFun = function (item) {
            $scope.cgwcFlag = true;
            zjwcArr = [];
            zjwcArr.push(item.ID + '');
        }
        $scope.qxCgwcFun = function () {
            $scope.cgwcFlag = false;
            $scope.cgwcVal = '';
        }
        $scope.sureCgwcFun = function () {
            if (!$scope.cgwcVal) {
                layer.msg('请输入原因')
                return
            }
            erp.load()
            var cgwcData = {};
            cgwcData.chuDanCaiGouIds = zjwcArr;
            cgwcData.dingDanHao = $scope.cgwcVal;
            erp.postFun('caigou/procurement/zhiJieWanCheng', JSON.stringify(cgwcData), function (data) {
                layer.closeAll('loading')
                if (data.data.statusCode == 200) {
                    $scope.cgwcFlag = false;
                    layer.msg('成功')
                    getList(erp, $scope);
                } else {
                    layer.msg('失败')
                }
            }, function (data) {
                layer.closeAll('loading')
            })
        }
        $scope.gbDdhFun = function () {
            $scope.dingDanHFlag = false;
            getList(erp, $scope);
        }
        //查看业务员
        $scope.viewFlag = false;
        $scope.viewFun = function (item) {
            $scope.viewFlag = true;
            $scope.ywyListArr = item.empSet;
        }
        $scope.viewCloseFun = function () {
            $scope.viewFlag = false;
            $scope.ywyListArr = [];
        }

        //选中 
        var firVid;
        var btIdArr = [];
        var btID = [];
        $scope.isCheckFun = function (item, index, ev, spitem, btlist) {
            var checkedNum = 0;
            var btListArr = JSON.parse(spitem.supplierLink)
            if (item.checked) {
                if (btIdArr.length < 1) {//第一次点击变体
                    btIdArr.push(item.PRODUCTID)
                    btID.push(item.ID + '')
                    for (var i = 0; i < btlist.length; i++) {
                        if (btlist[i]['checked'] == true) {
                            checkedNum++;
                        }
                    }
                    console.log('diyici')
                } else {
                    if (btIdArr[0] == item.PRODUCTID) {//是同一个商品的变体
                        btIdArr.push(item.PRODUCTID)
                        console.log('666')
                        btID.push(item.ID + '')
                        for (var i = 0; i < btlist.length; i++) {
                            if (btlist[i]['checked'] == true) {
                                checkedNum++;
                            }
                        }
                    } else {
                        console.log('555')
                        item.checked = false;
                    }
                }
                // console.log(item)
                console.log('xuanzhong')
            } else {
                // btIdArr.pop()
                // btID.pop()
                btIdArr.pop()
                for (var i = 0, len = btID.length; i < len; i++) {
                    if (item.ID == btID[i]) {
                        btID.splice(i, 1)
                        console.log(btID)
                        break
                    }
                }
                console.log('quxiao')
            }
            console.log(btID)
            console.log(btIdArr)
            if (checkedNum == btlist.length) {
                spitem.checked = true;
            } else {
                spitem.checked = false;
            }
        }
        // 选中所有商品
        $scope.checkAll = function (item, checkAllMark, e, list) {
            btID = [];//变体id数组置为空
            btIdArr = [];//存储商品id的数组置为空
            console.log(list)
            console.log(item)
            if (item.checked) {
                item.checked = true;//本商品置为选中
                if(item.btList){
                    for (var i = 0; i < item.btList.length; i++) {//本商品的所有变体置为选中
                        item.btList[i].checked = true;
                        btID.push(item.btList[i].ID + '')
                        btIdArr.push(item.PRODUCTId)
                    }
                }
                console.log(btID)
            } else {
                btIdArr = [];//存储商品id的数组置为空
                for (var i = 0; i < item.btList.length; i++) {
                    item.btList[i].checked = false;
                    btID = [];
                }
                console.log(btID)
            }
            console.log(btIdArr)
        }
        $scope.bulkCloseFun = function () {
            $scope.bulkCgFlag = false;
            getList(erp, $scope);
            btID = [];//变体id数组置为空
            btIdArr = [];//存储商品id的数组置为空
        }
        let expUpArr = []; 
        $scope.bulkExportFun = function () {
            expUpArr = [];
            for(let i = 0,len = $scope.chudanliebiao.length; i < len; i++){
                let expSpObj = {}
                expSpObj.childId = [];
                if($scope.chudanliebiao[i].checked){
                    expSpObj.parentId = $scope.chudanliebiao[i].id;
                    if($scope.chudanliebiao[i].btList){
                        for(let j = 0,jLen = $scope.chudanliebiao[i].btList.length; j < jLen;j++){
                            if($scope.chudanliebiao[i].btList[j].checked){
                                let id = $scope.chudanliebiao[i].btList[j].ID || $scope.chudanliebiao[i].btList[j].id
                                expSpObj.childId.push(id)
                            }
                        }
                    }
                }else{
                    if($scope.chudanliebiao[i].btList){
                        for(let j = 0,jLen = $scope.chudanliebiao[i].btList.length; j < jLen;j++){
                            if($scope.chudanliebiao[i].btList[j].checked){
                                let id = $scope.chudanliebiao[i].btList[j].ID || $scope.chudanliebiao[i].btList[j].id
                                expSpObj.childId.push(id)
                            }
                        }
                    }
                }
                if(expSpObj['parentId'] || expSpObj.childId.length>0){
                    expUpArr.push(expSpObj)
                }
            }
            console.log(expUpArr)
            if (expUpArr.length < 1) {
                layer.msg('请先选择')
                return;
            } else {
                $scope.bulkExpFlag = true;
            }
        }

        var base64 = new Base64();
        var token = base64.decode(localStorage.getItem('erptoken') == undefined ? "" : localStorage.getItem('erptoken'));
        const loginName = base64.decode(localStorage.getItem('erpname') == undefined ? "" : localStorage.getItem('erpname'))

        function loadDown(url,params,callback) {
            // 下载excel
            // const url = 'procurement/order/exportCaigouInfo'
            const xhr = new XMLHttpRequest()
            xhr.open('POST', url, true) // 也可以使用POST方式，根据接口
            xhr.setRequestHeader('token', token || '')
            xhr.setRequestHeader('content-type','application/json')
            xhr.responseType = 'blob'
            xhr.onload = function() {
              if (this.status === 200) {
                const content = this.response
                const aTag = document.createElement('a')
                const blob = new Blob([content])
                // const headerName = xhr.getResponseHeader('Content-disposition')
                // const fileName = decodeURIComponent(headerName).substring(20)
                aTag.download = new Date().getTime()+'.xlsx'
                // eslint-disable-next-line compat/compat
                aTag.href = URL.createObjectURL(blob)
                aTag.click()
                // eslint-disable-next-line compat/compat
                URL.revokeObjectURL(blob)
                callback()
             }
           }
          xhr.send(JSON.stringify(params))
         }

         function getDomainByUrl (url) {
            if (typeof url === 'string' && url.indexOf('http') === 0) return url; // http 开头全路径
            // console.log(url);
            var urlStart = url.split('/')[0];
            if (urlStart=='pojo' || urlStart=='app') {
              urlStart = 'cj-erp';
            }
        
            for (var k in window.httpsJson) {
              if (k == urlStart) {
                return window.httpsJson[k] + url;
              }
            }
          }

        $scope.bulksureExpFun = function () {
            let expIdsStr = '';
            for(let i = 0,len = expUpArr.length; i < len; i++){
                let childIdStr = '';
                for(let j = 0,jLen = expUpArr[i].childId.length; j < jLen; j++){
                    childIdStr += expUpArr[i].childId[j]+'-'
                }
                let iParentId = expUpArr[i].parentId ? expUpArr[i].parentId : 0 
                expIdsStr += iParentId + '*' + childIdStr +',';
            }
            $scope.bulkExpFlag = false;

            let url = getDomainByUrl("procurement/order/exportCaigouInfo")
            let params = {
                'ids':expIdsStr
            }

            layer.load(0)
            return loadDown(url,params,function(){
                layer.closeAll('loading')
                for(let i = 0,len = $scope.chudanliebiao.length; i < len; i++){
                    if($scope.chudanliebiao[i].checked){
                        if($scope.chudanliebiao[i].btList){
                            for(let j = 0,jLen = $scope.chudanliebiao[i].btList.length; j < jLen;j++){
                                if($scope.chudanliebiao[i].btList[j].checked){
                                    $scope.chudanliebiao[i].btList[j].checked = false
                                }
                            }
                        }
                        $scope.chudanliebiao[i].checked = false;
                    }
                }
            })

            // window.open(url)
            
        }
        //变体的复选框
        //批量采购
        $scope.bulkCgFlag = false;
        $scope.bulkCgFun = function () {
            if (btID.length < 1) {
                layer.msg('请选择变体')
                return;
            } else {
                $scope.btCheckedArr = [];
                $scope.bulkCgFlag = true;
                var isBreakOutFlag = false;
                for (var i = 0; i < $scope.chudanliebiao.length; i++) {
                    console.log($scope.chudanliebiao[i]['btList'])
                    if ($scope.chudanliebiao[i]['btList'] && $scope.chudanliebiao[i]['btList'].length > 0) {
                        for (var j = 0, btLen = $scope.chudanliebiao[i]['btList'].length; j < btLen; j++) {
                            if ($scope.chudanliebiao[i]['btList'][j].checked) {
                                isBreakOutFlag = true;
                                var cgArr = JSON.parse($scope.chudanliebiao[i].supplierLink);
                                console.log(cgArr)
                                for (var k = 0, gysLen = cgArr.length; k < gysLen; k++) {
                                    cgArr[k]['dingDanZhuangtai'] = 'zhengChang'
                                }
                                $scope.cgList = cgArr;
                                console.log($scope.cgList)
                                break
                            }
                        }
                        for (var k = 0, kLen = $scope.chudanliebiao[i]['btList'].length; k < kLen; k++) {
                            if ($scope.chudanliebiao[i]['btList'][k].checked) {
                                $scope.btCheckedArr.push(JSON.parse(JSON.stringify($scope.chudanliebiao[i]['btList'][k])))
                            }
                        }
                    }
                    if (isBreakOutFlag) {
                        console.log('跳出外层循环')
                        break
                    }
                }
                console.log($scope.btCheckedArr)
            }
        }
        $scope.sureBulkFun = function (item, index) {
            $scope.cgList = [];
            var ordNum = $("#bulkordnum" + index).val();
            var regBol = /^[0-9a-zA-Z]*$/g;
            if (!regBol.test(ordNum)) {
                layer.msg('请不要输入除了字母跟数字其它的字符串');
                return;
            }
            layer.load(2)
            erp.postFun("caigou/procurement/shengChengCaiGouDingDan", {
                "caiGouLianJie": item.name,
                "dingDanHao": ordNum,
                "chuDanCaiGouIds": btID,
                "dingDanZhuangtai": item.dingDanZhuangtai
            }, suc, err);
            function suc(a) {
                layer.closeAll('loading');
                $scope.bulkCgFlag = false;
                // $scope.flag1 = false;
                console.log(a)
                if (a.data.statusCode == 200) {
                    layer.msg("添加成功")
                    getList(erp, $scope);
                    btIdArr = [];
                } else {
                    layer.msg("添加失败")
                }
            };
        }
        
        //单个线下完成
        $scope.xxcgCkVal = '0';
        $scope.xxwcFun = function (item) {
            $scope.bulkXxcgFlag = true;
            $scope.dingDanZhuangtai = 'zhengChang';
            var oneArr = [];
            oneArr.push({
                "ID": item.ID,
                "IMG": item.IMG,
                "PRODUCTID": item.PRODUCTID,
                "shortSku": item.shortSku,
                "SKU": item.SKU,
                "VARIANTID": item.VARIANTID,
                "xxcgNum": item.xxcgNum,
                "nameEn": item.nameEn
            })
            $scope.xxcgList = oneArr;
            console.log($scope.xxcgList)
        }
        //批量缺货
        $scope.bulQueHuoFun = function () {
            if (btID.length < 1) {
                layer.msg('请选择变体')
                return;
            } else {
                $scope.bulkQueHuoFlag = true;
                var cgArr = [];
                for (var i = 0; i < $scope.chudanliebiao.length; i++) {
                    cgArr = [];
                    if ($scope.chudanliebiao[i]['btList'] && $scope.chudanliebiao[i]['btList'].length > 0) {
                        for (var j = 0, btLen = $scope.chudanliebiao[i]['btList'].length; j < btLen; j++) {
                            if ($scope.chudanliebiao[i]['btList'][j].checked) {
                                console.log($scope.chudanliebiao[i]['btList'][j])
                                cgArr.push($scope.chudanliebiao[i]['btList'][j])
                                console.log(cgArr)
                                $scope.xxcgList = cgArr;
                                console.log($scope.xxcgList)
                            }
                        }
                    }
                }
            }
        }
        // 确定批量缺货
        $scope.bulksureQueHuoFun = function () {
            var queHuoIds = [];
            console.log($scope.xxcgList)
            for (var i = 0, len = $scope.xxcgList.length; i < len; i++) {
                console.log($scope.xxcgList[i].ID)
                queHuoIds.push($scope.xxcgList[i].ID)
            }
            erp.load();
            console.log(queHuoIds)
            erp.postFun('caigou/procurement/biaoJiQueHuo', {
                "chuDanCaiGouIds": queHuoIds
            }, function (data) {
                console.log(data)
                layer.closeAll('loading')
                if (data.data.statusCode == 200) {
                    $scope.bulkQueHuoFlag = false;
                    $scope.pageNum = '1';
                    getList(erp, $scope);
                } else {
                    layer.msg('失败')
                }
            }, function (data) {
                console.log(data)
                layer.closeAll('loading')
            })

        }
        //批量线下采购
        $scope.bulkXxcgFun = function () {
            if (btID.length < 1) {
                layer.msg('请选择变体')
                return;
            } else {
                $scope.bulkXxcgFlag = true;
                $scope.dingDanZhuangtai = 'zhengChang';
                var cgArr = [];
                for (var i = 0; i < $scope.chudanliebiao.length; i++) {
                    cgArr = [];
                    if ($scope.chudanliebiao[i]['btList'] && $scope.chudanliebiao[i]['btList'].length > 0) {
                        for (var j = 0, btLen = $scope.chudanliebiao[i]['btList'].length; j < btLen; j++) {
                            if ($scope.chudanliebiao[i]['btList'][j].checked) {
                                console.log($scope.chudanliebiao[i]['btList'][j])
                                cgArr.push($scope.chudanliebiao[i]['btList'][j])
                                console.log(cgArr)
                                $scope.xxcgList = cgArr;
                                console.log($scope.xxcgList)
                            }
                        }
                    }
                }
            }

        }
        $scope.xxcgNumfun = function (item, index) {
            console.log(index)
            console.log($scope.xxcgList)
            $scope.xxcgList['xxcgNum'] = item.xxcgNum;
        }
        $scope.xxcgdanJIafun = function (item, index) {
            console.log(index)
            console.log($scope.xxcgList)
            $scope.xxcgList['danJia'] = item.danJia;
        }
        $scope.bulkXxcgSureFun = function () {
            console.log($scope.xxcgList)
            if (!$scope.cgrMoneyCount) {
                layer.msg('请输入采购金额')
                return
            }
            var isNumFlag = true;
            var jsonArr = [];
            for (var i = 0, len = $scope.xxcgList.length; i < len; i++) {
                if (!$scope.xxcgList[i].xxcgNum || !$scope.xxcgList[i].danJia) {
                    isNumFlag = false;
                    break
                }
                jsonArr.push({
                    "id": $scope.xxcgList[i].ID,
                    "cjImg": $scope.xxcgList[i].IMG,
                    "cjProductId": $scope.xxcgList[i].PRODUCTID,
                    "cjShortSku": $scope.xxcgList[i].shortSku,
                    "cjSku": $scope.xxcgList[i].SKU,
                    "cjStanproductId": $scope.xxcgList[i].VARIANTID,
                    "shuLiang": $scope.xxcgList[i].xxcgNum,
                    "danJia": $scope.xxcgList[i].danJia,
                    "cjHuoWuBiaoTi": $scope.xxcgList[i].nameEn
                })
            }
            if (!isNumFlag) {
                layer.msg('请为所有SKU填写数量')
                return
            }
            erp.load()
            var xxcgJson = {};
            xxcgJson.dingDanZhuangtai = $scope.dingDanZhuangtai;
            xxcgJson.gongSiMing = $scope.cgrModel;
            xxcgJson.zhiFu = $scope.cgrMoneyCount;
            xxcgJson.cangKu = $scope.xxcgCkVal;
            xxcgJson.skuNums = jsonArr;
            erp.postFun('caigou/procurement/xianXiaCaiGou', JSON.stringify(xxcgJson), function (data) {
                console.log(data)
                layer.closeAll('loading')
                if (data.data.statusCode == 200) {
                    $scope.bulkXxcgFlag = false;
                    $scope.dingDanHFlag = true;
                    $scope.dingDanHao = data.data.result;
                    $scope.cgrModel = '';
                    $scope.cgrMoneyCount = '';
                } else {
                    layer.msg('线下采购失败')
                }
            }, function (data) {
                console.log(data)
                layer.closeAll('loading')
            })

        }
        $(window).scroll(function () {
            var before = $(window).scrollTop();
            if (before > 60) {
                $('.tit-box').css({
                    "position": "fixed",
                    "top": 0
                })
            } else if(before < 10) {
                $('.tit-box').css({
                    "position": "static",
                    "top": 0
                })
            }
        });
        //批量关联
        $scope.plGuanLianFun = function(item){
            $scope.cgBtItemObj = item;
            $scope.oneOrMoreFlag = 'more';
            $scope.seletedCgLink = item.name;
            // erp.postFun('caigou/alProduct/getAlProductByUrl', {
            erp.postFun('caigou/alProduct/getAlProduct', {
                "url": item.name,
                "caigoubiaoji": item.dingDanZhuangtai
            }, function (data) {
                console.log(data)
                if (data.data.statusCode == 200) {
                    $scope.plBianTiFlag = true;
                    $scope.glBtList = data.data.result.product;
                    $scope.glBtsArr = data.data.result.product[0].stanProducts;
                } else {
                    layer.msg(data.data.message)
                }
            }, function (data) {
                console.log(data)
            }, { layer: true })
        }
        $scope.show1688BtFun = function(item,index){//显示1688变体 跟当前变体关联
            $scope.plGuanLianFlag = true;
            $scope.checkedBtIndex = index;
            console.log($scope.checkedBtIndex)
            for (let i = 0, len = $scope.glBtsArr.length; i < len; i++) {
                $scope.glBtsArr[i].isDefault = false;
            }
        }
        $scope.plCheckBtFun = function(item){
            for (let i = 0, len = $scope.glBtsArr.length; i < len; i++) {
                $scope.glBtsArr[i].isDefault = false;
            }
            item.isDefault = true;
            $scope.gl1688ItemObj = item;
            $scope.isGuanLianFlag = true;//是否有关联
            console.log($scope.btCheckedArr[$scope.checkedBtIndex])
            // $scope.btCheckedArr[$scope.checkedBtIndex].glxzObject = item
            // console.log($scope.btCheckedArr[$scope.checkedBtIndex].glxzObject)
            const obj1 = Object.assign({},
                $scope.btCheckedArr[$scope.checkedBtIndex].glxzObject,
                { [$scope.seletedCgLink]: item });
            $scope.btCheckedArr[$scope.checkedBtIndex].glxzObject = obj1
            console.log($scope.btCheckedArr[$scope.checkedBtIndex].glxzObject)
            $scope.btCheckedArr[$scope.checkedBtIndex].glxzArr = objToArrFn($scope.btCheckedArr[$scope.checkedBtIndex].glxzObject);
            // glxzObj[$scope.seletedCgLink] = item
            // $scope.glxzArr = objToArrFn(glxzObj);
            $scope.btCheckedArr[$scope.checkedBtIndex].guanLianObj = item;
            console.log($scope.btCheckedArr[$scope.checkedBtIndex])
            $scope.plGuanLianFlag = false;
        }
        $scope.delYglFun = function(glitem,pIndex){
            let link = glitem.cgLink;
            console.log($scope.btCheckedArr[pIndex].glxzObject[link])
            delete $scope.btCheckedArr[pIndex].glxzObject[link]
            $scope.btCheckedArr[pIndex].glxzArr = objToArrFn($scope.btCheckedArr[pIndex].glxzObject)
            console.log($scope.btCheckedArr[pIndex])
        }
        $scope.plCloseGuanLianFun = function(){
            for (let i = 0, len = $scope.btCheckedArr.length; i < len; i++) {
                if($scope.btCheckedArr[i].guanLianObj){
                    console.log($scope.btCheckedArr[i])
                    delete $scope.btCheckedArr[i].guanLianObj
                    console.log($scope.btCheckedArr[i])
                }
            }
            $scope.plBianTiFlag = false;
        }
        $scope.plSureGuanlianFun = function(){//确定建立批量的关联关系
            let caigouCaigouguanlian = {};
            caigouCaigouguanlian.caiGouGuanLianList = [];
            console.log(btID,$scope.cgBtItemObj)
            for(let i = 0,len = $scope.btCheckedArr.length;i<len;i++){
                if($scope.btCheckedArr[i].glxzArr){
                    for(let k = 0,kLen = $scope.btCheckedArr[i].glxzArr.length; k < kLen ; k++){
                        let upIdArr = [];
                        upIdArr.push($scope.btCheckedArr[i].ID)
                        let obj ={
                            "chuDanCaiGouIds": upIdArr,
                            "dingDanZhuangtai": $scope.cgBtItemObj.dingDanZhuangtai,
                            "stanId": $scope.btCheckedArr[i].VARIANTID,//变体id
                            "locId": $scope.btCheckedArr[i].PRODUCTID,//商品id
                            "specId": $scope.btCheckedArr[i].guanLianObj.specId,//1688变体id
                            "offerId": $scope.glBtList[0].offerId,//1688商品id
                            "minOrderQuantity": $scope.glBtList[0].minOrderQuantity,//1688起批量
                            "qualityLevel": $scope.glBtList[0].qualityLevel,//供应商星级
                            "supplierLoginId": $scope.glBtList[0].supplierLoginId,//供应商名称
                            "quantity": $scope.btCheckedArr[i].ORDERNEEDCOUNT,//变体中退件采购数量
                            "supplierUserId": $scope.glBtList[0].supplierUserId,
                            "caiGouLianJie": $scope.btCheckedArr[i].glxzArr[k].cgLink,
                            "price": $scope.btCheckedArr[i].glxzArr[k].sellPrice,
                            "skuCode": $scope.btCheckedArr[i].glxzArr[k].stanSkuZw, //1688变体sku
                            "amountOnSale": $scope.btCheckedArr[i].glxzArr[k].amountOnSale //1688库存
                        }
                        caigouCaigouguanlian.caiGouGuanLianList.push(obj)
                    }
                    // let upIdArr = [];
                    // upIdArr.push($scope.btCheckedArr[i].ID)
                    // let obj ={
                    //     "caiGouLianJie": $scope.cgBtItemObj.name,
                    //     "chuDanCaiGouIds": upIdArr,
                    //     "dingDanZhuangtai": $scope.cgBtItemObj.dingDanZhuangtai,
                    //     "stanId": $scope.btCheckedArr[i].VARIANTID,//变体id
                    //     "locId": $scope.btCheckedArr[i].PRODUCTID,//商品id
                    //     "specId": $scope.btCheckedArr[i].guanLianObj.specId,//1688变体id
                    //     "offerId": $scope.glBtList[0].offerId,//1688商品id
                    //     "quantity": $scope.btCheckedArr[i].ORDERNEEDCOUNT,//变体中退件采购数量
                    //     "supplierUserId": $scope.glBtList[0].supplierUserId,
                    //     "price": $scope.gl1688ItemObj.sellPrice,
                    //     "skuCode": $scope.gl1688ItemObj.stanSkuZw //1688变体sku
                    // }
                    // caigouCaigouguanlian.caiGouGuanLianList.push(obj)
                }else{
                    layer.msg('请为每个变体都建立关联关系')
                    return
                }
            }
            caigouCaigouguanlian.dingDanZhuangtai = $scope.cgBtItemObj.dingDanZhuangtai;
            // caigouCaigouguanlian.caiGouLianJie = $scope.cgBtItemObj.name;
            caigouCaigouguanlian.supplierUserId = $scope.glBtList[0].supplierUserId;
            caigouCaigouguanlian = JSON.stringify(caigouCaigouguanlian)
            erp.postFun('caigou/alProduct/jianLiCaiGouGuanLian',caigouCaigouguanlian, function (data) {
                console.log(data)
                layer.msg(data.data.message)
                if (data.data.statusCode == 200) {
                    $scope.plBianTiFlag = false;
                    $scope.bulkCgFlag = false;
                    $scope.gl1688ItemObj = '';
                    getList(erp, $scope);
                }
            }, function (data) {
                console.log(data)
            },{layer:true})
        }
        $scope.glxzArr = [];//关联选中的变体集合
        let glxzObj = {};//关联选中的对象
        //关联
        $scope.guanLianFun = function (item) {
            $scope.cgBtItemObj = item;
            $scope.seletedCgLink = item.name;
            $scope.oneOrMoreFlag = 'one';
            erp.postFun('caigou/alProduct/getAlProduct', {
                "url": item.name,
                "caigoubiaoji": item.dingDanZhuangtai,
                "stanId": $scope.variantId
            }, function (data) {
                console.log(data)
                if (data.data.statusCode == 200) {
                    $scope.guanLianFlag = true;
                    $scope.glBtList = data.data.result.product;
                    $scope.glBtsArr = data.data.result.product[0].stanProducts;
                    for (let i = 0, len = $scope.glBtsArr.length; i < len; i++) {
                        if($scope.glBtsArr[i].isDefault){
                            glxzObj[$scope.seletedCgLink] = $scope.glBtsArr[i]
                            $scope.glxzArr = objToArrFn(glxzObj);
                            console.log($scope.glxzArr)
                            $scope.gl1688ItemObj = $scope.glBtsArr[i];
                            $scope.isGuanLianFlag = true;
                            break
                        }
                    }
                } else {
                    layer.msg(data.data.message)
                }
            }, function (data) {
                console.log(data)
            }, { layer: true })
        }
        $scope.openJxglFun = function(index){
            $scope.jxglFlag = true;
            $scope.checkedBtIndex = index;
        }
        $scope.checkCgLinkFun = function(item){//选择采购链接
            console.log(item)
            $scope.seletedCgLink = item.name
        }
        $scope.linkQeryBtFun = function(){//根据链接获取变体
            erp.postFun('caigou/alProduct/getAlProduct',{
                "url": $scope.seletedCgLink
            },function(data){
                console.log(data)
                if (data.data.statusCode == 200) {
                    $scope.jxglFlag = false;
                    $scope.glBtList = data.data.result.product;
                    $scope.glBtsArr = data.data.result.product[0].stanProducts;
                    for (let i = 0, len = $scope.glBtsArr.length; i < len; i++) {
                        if($scope.glBtsArr[i].isDefault){
                            $scope.gl1688ItemObj = $scope.glBtsArr[i];
                            break
                        }
                    }
                    if($scope.oneOrMoreFlag=='more'){
                        $scope.plGuanLianFlag = true;
                    }
                } else {
                    layer.msg(data.data.message)
                    $scope.glBtList = [];
                }
            },function(data){
                console.log(data)
            },{layer:true})
        }
        $scope.checkBtFun = function (item) {
            for (let i = 0, len = $scope.glBtsArr.length; i < len; i++) {
                $scope.glBtsArr[i].isDefault = false;
            };
            glxzObj[$scope.seletedCgLink] = item;
            $scope.glxzArr = objToArrFn(glxzObj);
            console.log($scope.glxzArr)
            item.isDefault = true;
            $scope.gl1688ItemObj = item;
            $scope.isGuanLianFlag = true;//是否有关联
        }
        $scope.delGlgxFun = function(item){
            let link = item.cgLink;
            delete glxzObj[link]
            $scope.glxzArr = objToArrFn(glxzObj)
        }
        function objToArrFn(obj){
            let arr = [];
            for(let key in obj){
                obj[key]['cgLink'] = key;
                arr.push(obj[key])
            }
            return arr
        }
        $scope.sureGuanlianFun = function () {
            if (!$scope.gl1688ItemObj) {
                layer.msg('请选择一个变体')
                return
            }
            let caigouCaigouguanlian = {};
            caigouCaigouguanlian.caiGouGuanLianList = [];
            console.log(btID,$scope.glxzArr)
            for(let i = 0,len = $scope.glxzArr.length;i<len;i++){
                let obj ={
                    "caiGouLianJie": $scope.cgBtItemObj.name,
                    "chuDanCaiGouIds": $scope.btArr,
                    "dingDanZhuangtai": $scope.cgBtItemObj.dingDanZhuangtai,
                    "stanId": $scope.btItemObj.VARIANTID,//变体id
                    "locId": $scope.btItemObj.PRODUCTID,//商品id
                    "offerId": $scope.glBtList[0].offerId,//1688商品id
                    "minOrderQuantity": $scope.glBtList[0].minOrderQuantity,//1688起批量
                    "qualityLevel": $scope.glBtList[0].qualityLevel,//供应商星级
                    "supplierLoginId": $scope.glBtList[0].supplierLoginId,//供应商名称
                    "quantity": $scope.cgBtItemObj.ORDERNEEDCOUNT,//采购数量
                    "supplierUserId":  $scope.glBtList[0].supplierUserId,
                    "price": $scope.glxzArr[i].sellPrice,
                    "skuCode": $scope.glxzArr[i].stanSkuZw, //1688变体sku
                    "specId": $scope.glxzArr[i].specId,//1688变体id
                    "amountOnSale": $scope.glxzArr[i].amountOnSale,//1688库存
                }
                caigouCaigouguanlian.caiGouGuanLianList.push(obj)
            }
            // let obj ={
            //     "caiGouLianJie": $scope.cgBtItemObj.name,
            //     "chuDanCaiGouIds": $scope.btArr,
            //     "dingDanZhuangtai": $scope.cgBtItemObj.dingDanZhuangtai,
            //     "stanId": $scope.btItemObj.VARIANTID,//变体id
            //     "locId": $scope.btItemObj.PRODUCTID,//商品id
            //     "offerId": $scope.glBtList[0].offerId,//1688商品id
            //     "quantity": $scope.cgBtItemObj.ORDERNEEDCOUNT,//采购数量
            //     "supplierUserId":  $scope.glBtList[0].supplierUserId,
            //     "price": $scope.gl1688ItemObj.sellPrice,
            //     "skuCode": $scope.gl1688ItemObj.stanSkuZw //1688变体sku
            //     "specId": $scope.gl1688ItemObj.specId,//1688变体id
            // }
            // caigouCaigouguanlian.caiGouGuanLianList.push(obj)
            caigouCaigouguanlian.dingDanZhuangtai = $scope.cgBtItemObj.dingDanZhuangtai;
            caigouCaigouguanlian.caiGouLianJie = $scope.cgBtItemObj.name;
            caigouCaigouguanlian.supplierUserId = $scope.glBtList[0].supplierUserId
            // console.log(caigouCaigouguanlian)
            // return
            erp.postFun('caigou/alProduct/jianLiCaiGouGuanLian', caigouCaigouguanlian, function (data) {
                console.log(data)
                layer.msg(data.data.message)
                if (data.data.statusCode == 200) {
                    $scope.guanLianFlag = false;
                    $scope.flag1 = false;
                    $scope.gl1688ItemObj = '';
                    $scope.glxzArr = [];
                    glxzObj = {};
                    getList(erp, $scope);
                }
            }, function (data) {
                console.log(data)
            })
        }

    }])
})()