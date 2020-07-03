;~function () {
    let app = angular.module('warehouse-app');
    app.controller('privatewareCtrl', ['$scope', "erp", '$location', function ($scope, erp, $location) {
        console.log('privatewareCtrl')
        var curPath = $location.path();
        console.log(curPath);
        if (curPath == '/erpwarehouse/privateruku') {
            $scope.isPrivateruku = true;
            $scope.isPrivatekucun = false;
            $scope.isPrivatechuku = false;
        } else if (curPath == '/erpwarehouse/privatekucun') {
            $scope.isPrivateruku = false;
            $scope.isPrivatekucun = true;
            $scope.isPrivatechuku = false;
        } else if (curPath == '/erpwarehouse/privatechuku') {
            $scope.isPrivateruku = false;
            $scope.isPrivatekucun = false;
            $scope.isPrivatechuku = true;
        }
        console.log($scope.isPrivateruku);
        $scope.choseCustomerTag = true;
        //客户
        $scope.clientul = false;
        $scope.clientname = '';
        $scope.clientchange = function () {
            console.log($scope.clientname)
            erp.postFun('app/account/getaccbyname', {"data": "{'name':'" + $scope.clientname + "'}"}, function (n) {
                var obj = JSON.parse(n.data.result)
                console.log(obj)
                $scope.clientul = true;
                $scope.clientlist = obj.list;
            }, err)
        }
        $scope.getclient = function (item) {
            console.log(item)
            $scope.clientname = item.NAME;
            $scope.client = item;
            $scope.clientul = false
        }
        //提交
        $scope.submit = function () {
            $scope.choseCustomerTag = false;
            getKuncunList();
        }
        $scope.cancel = function () {
            if ($scope.rechoseTag) {
                $scope.choseCustomerTag = false;
            } else {
                history.go(-1);
            }
        }

        $scope.skuSearch = function () {
            erp.postFun('pojo/inventory/getAuthorityVariants', JSON.stringify({
                accountId: $scope.client.ID,
                inputStr: $scope.skuinfo
            }), function (data) {
                var result = JSON.parse(data.data.result);
                console.log(result);
                $scope.proVarientList = result.list;
                if ($scope.proVarientList.length == 0) {
                    layer.msg('没有找到相关商品');
                }
            }, err);
        }
        $scope.enterSearch = function (event) {
            if (event.keyCode == 13) {
                $scope.skuSearch();
            }
        }
        var seleIndex;
        $scope.seleVariant = function (item, index) {
            $scope.addCucunVar = item;
            $('.esou-cheked').attr('src', 'static/image/public-img/radiobutton1.png');
            $('.esou-cheked').eq(index).attr('src', 'static/image/public-img/radiobutton2.png');
            seleIndex = index;
        }
        $scope.quedingFun = function () {
            if (!$scope.addCucunVar) {
                layer.msg('请选择一个变体');
                return;
            }
            var realCount = $('.cucun-inp').eq(seleIndex).val();
            if (!realCount) {
                layer.msg('请给选择的变体指定库存数量');
                return;
            }
            erp.postFun('pojo/inventory/addAuthorityInventory', JSON.stringify({
                accountId: $scope.client.ID,
                vid: $scope.addCucunVar.ID,
                realCount: realCount,
                storageId: $scope.seleWareId
            }), function (data) {
                // var result = JSON.parse(data.data.result);
                console.log(data);
                if (data.data.statusCode == 200) {
                    layer.msg('操作成功');
                    $scope.addKucunTag = false;
                } else {
                    layer.msg('操作失败');
                }
            }, err);
        }

        erp.getFun("app/storage/getStorage", function (data) {
            console.log(data);
            $scope.wareList = JSON.parse(data.data.result);
            $scope.seleWareId = $scope.wareList[0].id;
        }, err);

        // 获取库存列表
        // pojo/inventory/getErpAuthorityList    post
        // {inputStr,accountId,pageSize,pageNum}
        $scope.pageSize = '20';
        $scope.pageNum = '1';
        $scope.totalNum = 0;
        $scope.totalPageNum = 0;

        function getKuncunList() {
            erp.postFun('pojo/inventory/getErpAuthorityList', JSON.stringify({
                inputStr: '',
                accountId: $scope.client.ID,
                pageSize: $scope.pageSize,
                pageNum: $scope.pageNum
            }), function (data) {
                console.log(data);
                if (data.data.statusCode != 200) {
                    layer.msg('网络错误');
                    return;
                }
                var result = JSON.parse(data.data.result);
                if (result.total == 0) {
                    $scope.totalNum = 0;
                    $scope.totalPageNum = 0;
                    $scope.kucunliebiao = [];
                }
                var list = result.list;
                for (var i = 0; i < list.length; i++) {
                    list[i].down = true;
                }
                $scope.kucunliebiao = list;
                console.log($scope.kucunliebiao);
                $scope.totalNum = result.total;
                $scope.totalPageNum = Math.ceil($scope.totalNum / $scope.pageSize);
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
                        }
                        ;
                        erp.load();
                        $scope.pageNum = n;
                        erp.postFun('pojo/inventory/getErpAuthorityList', JSON.stringify({
                            inputStr: '',
                            accountId: $scope.client.ID,
                            pageSize: $scope.pageSize,
                            pageNum: n
                        }), function (data) {
                            if (data.data.statusCode != 200) {
                                layer.msg('网络错误');
                                return;
                            }
                            var result = JSON.parse(data.data.result);
                            var list = result.list;
                            for (var i = 0; i < list.length; i++) {
                                list[i].down = true;
                            }
                            $scope.kucunliebiao = list;
                            console.log($scope.kucunliebiao);
                        }, err)
                    }
                });
            }, err);
        }

        $scope.showVariant = function (item, index) {
            erp.postFun('pojo/inventory/getErpAuthorityVariants', JSON.stringify({
                pid: item.pid,
                accountId: $scope.client.ID
            }), function (data) {
                console.log(data);
                if (data.data.statusCode != 200) {
                    layer.msg('网络错误');
                    return;
                }
                var result = JSON.parse(data.data.result);
                $scope.kucunliebiao[index].vlist = result.list;
                $scope.kucunliebiao[index].down = false;
            }, err);
        }

        $scope.hideVariant = function (item, index) {
            $scope.kucunliebiao[index].vlist = [];
            $scope.kucunliebiao[index].down = true;
        }

        $scope.toRuku = function (item, index2, index1) {
            layer.open({
                title: '入库数量'
                , content: '<input type="text" />'
                , yes: function (index, layero) {
                    var count = $(layero).find('input').val();
                    if (!count) {
                        layer.msg('输入值不能为空');
                    } else {
                        erp.postFun('pojo/inventory/autInventoryAdd', JSON.stringify({
                            id: item.id,
                            count: count
                        }), function (data) {
                            console.log(data);
                            if (data.data.statusCode != 200) {
                                layer.msg('网络错误');
                                return;
                            }
                            layer.close(index);
                            for (var k in $scope.kucunliebiao[index1].realInventory) {
                                $scope.kucunliebiao[index1].realInventory[k] = $scope.kucunliebiao[index1].realInventory[k] * 1 + count * 1;
                            }
                            for (var k in $scope.kucunliebiao[index1].vlist[index2].realInventory) {
                                $scope.kucunliebiao[index1].vlist[index2].realInventory[k] = $scope.kucunliebiao[index1].vlist[index2].realInventory[k] * 1 + count * 1;
                            }
                        }, err);
                    }
                    return false;
                }
            });
        }

        $scope.toChuku = function (item, index2, index1) {
            layer.open({
                title: '出库数量'
                , content: '<input type="text" />'
                , yes: function (index, layero) {
                    var count = $(layero).find('input').val();
                    if (!count) {
                        layer.msg('输入值不能为空');
                    } else {
                        erp.postFun('pojo/inventory/autInventoryOut', JSON.stringify({
                            id: item.id,
                            count: count
                        }), function (data) {
                            console.log(data);
                            if (data.data.statusCode != 200) {
                                layer.msg('网络错误');
                                return;
                            }
                            layer.close(index);
                            for (var k in $scope.kucunliebiao[index1].realInventory) {
                                $scope.kucunliebiao[index1].realInventory[k] = $scope.kucunliebiao[index1].realInventory[k] * 1 - count * 1;
                            }
                            for (var k in $scope.kucunliebiao[index1].vlist[index2].realInventory) {
                                $scope.kucunliebiao[index1].vlist[index2].realInventory[k] = $scope.kucunliebiao[index1].vlist[index2].realInventory[k] * 1 - count * 1;
                            }
                        }, err);
                    }
                    return false;
                }
            });
        }


        function err(a) {
            console.log(a);
            layer.closeAll('loading');
        };
    }])

}();