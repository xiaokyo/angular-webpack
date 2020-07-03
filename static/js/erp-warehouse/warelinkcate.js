;~function () {
    let app = angular.module('warehouse-app');
    app.controller('warelinkcateCtrl', ['$scope', "erp", '$location', '$routeParams', function ($scope, erp, $location, $routeParams) {
        console.log('warelinkcateCtrl');
        // getAllWareNodes(erp, $scope, 'check');
        // 首先获取仓库第一级节点
        getRootNode(erp, {
            // news: "1",
            rank: "1",
            codeId: ""
        }, function (result) {
            for (var i = 0; i < result.childrens.length; i++) {
                result.childrens[i].codeType = '仓';
            }
            result.codeType = '';
            console.log(result);
            result.open = true;
            addCheckToEachNode(result.childrens); // 加单选框用
            result.codeName = '全部仓库';
            $scope.folder = result;
            $scope.brunchItem = result;
            $scope.rootPaCodeId = $scope.brunchItem.pCodeId;
        })
		    erp.getCateList().then(res =>{
			    $scope.cateList = res
			    console.log(res)
		    })
        var index1, index2;
        $scope.getCateTwo = function (id) {
            if (id) {
                index1 = erp.findIndexByKey($scope.cateList, 'id', id);
                $scope.cateListTwo = $scope.cateList[index1].children;
            }

        }
        $scope.getCateThree = function (id) {
            if (id) {
                index2 = erp.findIndexByKey($scope.cateListTwo, 'id', id);
                $scope.cateListThree = $scope.cateListTwo[index2].children;
            }
        }
        $scope.cateItem = {};
        $scope.seleCate = function (item) {
            $scope.showCateFlag = false;
            $scope.cateItem = item;
        }
        // $scope.checkWare = [];
        $scope.checkWare = function (item) {
            setAllChiToUnCheck($scope.folder.childrens);
            item.checked = true;
            $scope.checkWareItem = item;
            console.log($scope.checkWareItem);
        }
        $scope.switchList = function (item, flag) {
            if (flag) { // 展开
                if (item.childrens) {
                    item.open = flag;
                } else { // 获取当前节点
                    getRootNode(erp, {
                        // news: "1",
                        rank: item.sequence * 1 + 1 + '',
                        codeId: item.codeid + ''
                    }, function (result) {
                        item.childrens = result;
                        item.open = flag;
                    })
                }
            } else { // 收起
                item.open = flag;
            }
        }
        $scope.searchStr = '';
        $scope.pageSize = '12';
        $scope.pageNum = '1';
        $scope.totalNum = 0;
        $scope.totalPageNum = 0;

        // 获取列表
        function getList(erp, $scope) {
            var sendJson = {};
            sendJson.page = $scope.pageNum;
            sendJson.pageNum = $scope.pageSize;
            sendJson.searchParam = $scope.searchStr;
            // erp.load();
            erp.loadPercent($('.table-con-box'), 600);
            erp.postFun("app/storagedo/selectConcernCategory", JSON.stringify(sendJson), function (data) {
                erp.closeLoadPercent($('.table-con-box'));
                console.log(data);
                var result = data.data.list;
                for (var i = 0; i < result.length; i++) {
                    result[i].down = true;
                }
                $scope.conCateList = result;
                $scope.totalNum = data.data.totalNum;
                $scope.totalPageNum = Math.ceil($scope.totalNum / $scope.pagesize);
                if ($scope.totalNum == 0) {
                    erp.addNodataPic($('.table-con-box'), 600);
                    return
                }
                erp.removeNodataPic($('.table-con-box'));
                $scope.pageNum = '1';
                pageFun(erp, $scope, function (n, type) {
                    if (type == 'init') {
                        return;
                    }
                    // erp.load();
                    erp.loadPercent($('.table-con-box'), 600);
                    $scope.pageNum = n;
                    var sendJson = {};
                    sendJson.page = $scope.pageNum;
                    sendJson.pageNum = $scope.pageSize;
                    sendJson.searchParam = $scope.searchStr;
                    erp.postFun("app/storagedo/selectConcernCategory", JSON.stringify(sendJson), function (data) {
                        erp.closeLoadPercent($('.table-con-box'));
                        console.log(data);
                        var result = data.data.list;
                        for (var i = 0; i < result.length; i++) {
                            result[i].down = true;
                        }
                        $scope.conCateList = result;
                    }, err)
                });
            }, err);
        }

        getList(erp, $scope);
        $scope.search = function () {
            getList(erp, $scope);
        }
        $scope.enterSearch = function (e) {
            if (e.keyCode == 13) {
                getList(erp, $scope);
            }
        }
        $scope.addCon = function () {
            $scope.addConFlag = true;
            $scope.opeConType = '新增关联';
        }
        $scope.goAddConCate = function () {
            if (!$scope.cateThree) {
                layer.msg('请选择商品三级类目');
                return;
            }
            // if (!$scope.cateItem.id) {
            //     layer.msg('请选择商品类目');
            //     return;
            // }
            if (!$scope.checkWareItem) {
                layer.msg('请选择仓库分区');
                return;
            }
            var postUrl;
            var sendJson = {};
            // sendJson.cateGoryId = $scope.cateOne;
            sendJson.cateGoryId = $scope.cateThree;
            sendJson.storageId = $scope.checkWareItem.pCodeKey;
            sendJson.regionId = $scope.checkWareItem.id;
            if ($scope.editConFlag) {
                postUrl = 'app/storagedo/editConcernCategory';
                sendJson.id = $scope.editConItem.id;
            } else {
                postUrl = 'app/storagedo/addConcernCategory';
            }
            // erp.load();
            layer.load(2);
            erp.postFun(postUrl, JSON.stringify(sendJson), function (data) {
                layer.closeAll('loading');
                console.log(data);
                if (data.data.code != 200) {
                    if (data.data.code == 402) {
                        layer.msg(data.data.message);
                    } else {
                        layer.msg('操作失败');
                    }
                } else {
                    layer.msg('操作成功');
                    getList(erp, $scope);
                    $scope.addConFlag = false;
                    $scope.editConFlag = false;
                    $scope.editConItem = null;
                    $scope.cateItem = {};
                    $scope.checkWareItem = null;
                }
            }, err);
        }
        $scope.cancelAddConCate = function () {
            $scope.cateItem = {};
            $scope.checkWareItem = null;
            $scope.editConFlag = false;
            $scope.addConFlag = false;
            $scope.editConItem = null;
        }
        $scope.deleteOneConCate = function (item, index1) {
            erp.postFun('app/storagedo/dellConcernCategory', JSON.stringify({
                id: item.id
            }), function (data) {
                erp.closeLoad();
                console.log(data);
                if (data.data.code != 200) {
                    layer.msg('操作失败');
                } else {
                    layer.msg('操作成功');
                    $scope.conCateList.splice(index1, 1);
                }
            }, err);
        }
        $scope.editOneConCate = function (item, index1) {
            $scope.editConFlag = true;
            $scope.opeConType = '编辑关联';
            $scope.cateItem.name = item.categoryName;
            $scope.editConItem = item;
            // $scope.cateItem.id = item.categoryId;
        }
    }]);
    function err(error) {
        console.log(error);
        layer.closeAll('loading');
    }
    function addCheckToEachNode(arr) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].checkFlag = true;
            if (arr[i].childrens && arr[i].childrens.length > 0) {
                addCheckToEachNode(arr[i].childrens);
            }
        }
    }
    function getRootNode (erp, data, success) {
        erp.postFun('warehouseBuildWeb/management/getNewRootTreeNode', data, function (data) {
            if (data.data.code == 200 && data.data.data) {
                if(data.data.data.root){
                    success(data.data.data.root)
                }else{
                    success(data.data.data)
                }
            } else {
                layer.msg('获取仓库类目失败 ')
            }
        })
    }
    function setAllChiToUnCheck(arr) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].checked = false;
            if (arr[i].childrens && arr[i].childrens.length > 0) {
                setAllChiToUnCheck(arr[i].childrens);
            }
        }
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