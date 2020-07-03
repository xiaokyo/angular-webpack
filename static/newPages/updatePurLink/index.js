(function () {
    var app = angular.module('updatePurLink', [])

    var APIS = {
        detailNew: 'pojo/product/detailNew',// 获取对手链接和采购链接
        updateLink: 'erp/locproduct/updateLocproduct',// 修改对手链接和采购链接
        syncLink: 'procurement/order/synLocproduct', // 同步sku
    }

    var ctrlUpdatePurLink = function ($scope, erp, $routeParams, $timeout) {
        console.log('修改商品对手链接和采购链接')

        $scope.merchBuyLinks = []
        // 获取商品详情
        function getDetail() {
            const { id, flag, type: productType } = $routeParams
            const params = { id, flag, productType }
            layer.load(2)
            erp.postFun(APIS.detailNew, JSON.stringify(params), function (res) {
                layer.closeAll('loading')
                if (res.data.statusCode != '200') return layer.msg('获取采购链接和对手链接失败，请检查网络')
                $scope.detail = angular.fromJson(res.data.result)
                console.log('detail', $scope.detail)
                $scope.merchBuyLinks = angular.copy($scope.detail.supplierLink)
                $scope.rivalLink = angular.fromJson($scope.detail.rivalLink)
                // debugger
            })
        }

        // 同步sku的对手链接和采购链接
        function syncPurOrRiva() {
            erp.postFun(APIS.syncLink, JSON.stringify({ sku: $scope.detail.sku }), function (res) {

            })
        }

        // 修改采购链接和对手链接调整
        $scope.updateLink = function () {
            const params = {
                id: $routeParams.id,
                supplierLink: angular.toJson($scope.merchBuyLinks),
                rivalLink: angular.toJson($scope.rivalLink)
            }
            erp.postFun(APIS.updateLink, JSON.stringify(params), function (res) {
                if (res.data.statusCode != 200) return layer.msg('修改失败')
                layer.msg('修改成功')
                syncPurOrRiva()
            })
        }

        // 采购链接操作
        $scope.merchBuyLink = '';
        $scope.addBuylink = function () {
            if ($scope.merchBuyLink.trim()) {
                $scope.merchBuyLinks.push({
                    name: $scope.merchBuyLink,
                    star: 5,
                    beiZhu: $scope.merchBuyLinkBeizhu || ''
                });
                $scope.merchBuyLink = '';
            } else {
                layer.msg('输入值不能为空');
            }
        }
        $scope.deleteBuyLink = function (name) {
            var deleteIndex = erp.findIndexByKey($scope.merchBuyLinks, 'name', name);
            $scope.merchBuyLinks.splice(deleteIndex, 1);
        }
        $scope.changeBuyLinkStar = function (name, $event) {
            var $this = $($event.currentTarget);
            var changeIndex = erp.findIndexByKey($scope.merchBuyLinks, 'name', name);
            $scope.merchBuyLinks[changeIndex].star = $this.attr('data');
            $this.attr("index", "10").siblings("span").removeAttr("index");
        }
        $scope.showYellStar = function ($event) {
            var $this = $($event.currentTarget);
            $this.addClass('star').prevAll("span").addClass("star").end().nextAll("span").removeClass("star");
        }
        $scope.hideYellStar = function ($event) {
            var $this = $($event.currentTarget);
            $this.removeClass('star').prevAll("span").removeClass("star");
            $this.parent().find("span[index=10]").addClass("star").prevAll("span").addClass("star");
        }

        // 对手链接操作
        // 对手链接
        $scope.rivalLink = [];
        $scope.verifyRivallink = false;
        $scope.addRivalLink = function () {
            if (!$scope.addRivalVal) {
                layer.msg('对手链接不能为空');
                return;
            }
            if (!$scope.addRivalPrice) {
                layer.msg('对手价格不能为空');
                return;
            }
            $scope.rivalLink.push({
                name: $scope.addRivalVal,
                price: $scope.addRivalPrice
            });
            $scope.addRivalVal = '';
            $scope.addRivalPrice = '';
        }
        $scope.deleteRivalLink = function (i) {
            $scope.rivalLink.splice(i, 1);
        }

        function init() {
            getDetail()
        }

        init()

    }
    app.controller('ctrlUpdatePurLink', ['$scope', 'erp', '$routeParams', '$timeout', ctrlUpdatePurLink]) // 损耗列表   
})()