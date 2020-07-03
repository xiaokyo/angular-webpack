; (function () {
    var app = angular.module('zombie-order', ['service']);
    var base64 = new Base64();
    var erpuserId = window.localStorage.getItem('erpuserId');
    var Gscope = null;
    var scroll = null;
    var sku;
    var isScroll = false;
    var pSku = null;
    var skuArrLen = 0;
    var postOrder = null;
    var skuDOMList = [];

    function enableScroll() {
        scroll = new BScroll('#scroll-wrap', { scrollX: true, scrollY: false, probeType: 2, });
        scroll.on('scroll', function(ev) { isScroll = true; })
    }
    function assembleParam(arr, pick_field, val_field) {
        var res = [], json = [];
        for (var x = 0, l = arr.length; x < l; x++) {
            if (arr[x][pick_field]) {
                res.push(arr[x][val_field]);
                json.push(arr[x]);
            }
        }
        // return { json: json, stringify: JSON.stringify(res)};
        return { json: json, stringify: res.join(',')};
    }
    function changePage(bool) {
        // console.log(Gscope.cSku, skuArrLen, bool)
        if (skuArrLen > 0 && Gscope.cSku) {
            if (bool === true && Gscope.cSku.idx < skuArrLen - 1) {  // 下一个
                console.log(Gscope.cSku.idx);
                queryOrder(Gscope.cSku.idx + 1);
                // scroll.scrollTo(-500,0,1000);
            } else if (bool === false && Gscope.cSku.idx > 0) {      // 上一个
                queryOrder(Gscope.cSku.idx - 1);
            }
        }
    }
    function queryOrder(ev) {
        if (isScroll) { // 点击事件代理 和 scroll事件分离
            isScroll = false;
        } else {
            if (ev != undefined) {   // 点击sku、搜索、翻页 [請求表格數據]
                if (typeof ev === "object" && 'target' === ev.target.dataset.flag) {
                    Gscope.cSku = Gscope.skuArr[+ev.target.dataset.idx];
                } else {
                    Gscope.cSku = Gscope.skuArr[ev];
                }
                if (Gscope.cSku) { // 过滤直接点击搜索情况
                    sku = Gscope.cSku.sku;
                    Gscope.cSku.active = true;
                    if(pSku && Gscope.cSku.idx !== pSku.idx){
                        pSku && (pSku.active = false);
                    }
                    pSku = Gscope.cSku;

                    sku = Gscope.cSku ? Gscope.cSku.sku : undefined;
                }
            }
            /* sku为undefined的时候，JSON.stringify会忽略掉sku，那么请求结果就是sku列表。有sku时，返回数据是表格数据 */
            Gscope.pickAll = false;
            const params = {
                payOrder: Gscope.orderType || null,
                pageSize: Gscope.pageSize.toString(),
                pageNum: Gscope.pageNum.toString(),
                userId: erpuserId ? base64.decode(erpuserId) : '',
                // status:ev === 'search' ? Gscope.selected1.toString():'',
                status: Gscope.selected1.toString(),// 2020-2-26 应后台要求 任何时候 都要 传递 state 这个值 不能 传 ''
                sku: sku,
                decisionMaking: assembleParam(Gscope.options2, 'pick', 'val').stringify,
                sousuo: ev === 'search' ? '0' : '2', // 给后台用，写死的
            }
            Gscope.erp.postFun('processOrder/observerOrder/queryObserverOrders', {
                pageSize: Gscope.pageSize.toString(),
                pageNum: Gscope.pageNum.toString(),
                userId: erpuserId ? base64.decode(erpuserId) : '',
                status:Gscope.selected1.toString(),
                sku: sku,
                decisionMaking: assembleParam(Gscope.options2, 'pick', 'val').stringify,
                sousuo: ev === 'search' ? '0' : '2', // 给后台用，写死的
            }, function(data) {
                queryOrderFn1(data, ev)
            }, function(err) {
                layer.msg('请求失败: ' + err);
                console.warn(err);
            }, { layer: true });
        }
    }
    function queryOrderFn1(data, ev) {
        console.log(Gscope.res1 = data.data);
        if ('200' == Gscope.res1.code) {
            if (sku && ev !== 'search') {
                console.log(Gscope.res1)
                Gscope.zombieOrderList = Gscope.res1.data; // 表格数据
                
                $.each(Gscope.zombieOrderList,function (i,v) {

                    if(v.decisionMaking && v.decisionMaking != ''){
                        var arr = v.decisionMaking.split(',');
                        v.decisionMaking = arr;
                    }

                })
            } else {
                console.log(Gscope.res1)
                for (var x = 0, l = Gscope.res1.data.length; x <l; x++) {
                    Gscope.res1.data[x].idx = x;
                    Gscope.res1.data[x].active = false;
                    Gscope.res1.data[x].pick = false;
                }
                Gscope.skuArr = Gscope.res1.data;          // sku数据
                skuArrLen = Gscope.skuArr.length;
                if (scroll == null) setTimeout(enableScroll, 100);
            }
        } else {

        }
    }
    function confirmFun(remark) {
        console.log(remark);
        var json;

        postOrder = assembleParam(Gscope.zombieOrderList, 'pick', 'orderProductId');
        if (!postOrder.json || postOrder.json.length === 0) return layer.msg('请选择订单');
        json = {
            payOrder: postOrder.json[0].payOrder,
            userId: erpuserId ? base64.decode(erpuserId) : '',
            orderProductId: postOrder.stringify,
            remark: '',
            decisionMaking: '',
            status: remark.toString(),
            // sousuo:'2',
        };
        if(remark == 1){
            json.decisionMaking = assembleParam(Gscope.options2, 'pick', 'val').stringify;
            if(Gscope.isExpect){
                if($('#c-data-time').val() == ""){
                    layer.msg('请选择预期到货时间');
                    return;
                }
                json.remark = $('#c-data-time').val();

            }
            // if($('#c-data-time').val() != ""){
            //
            // }
        }

        
        if(remark == 1 && json.decisionMaking == ''){
            layer.msg('请选择需要进行的处理方案');
            return;
        }
        // if (remark) {  // 发送备注，剔除两个没用的字段
        //     json.decisionMaking = undefined;
        //     json.status = undefined;
        // }
        console.log(json);
        Gscope.erp.load();
        // return console.log(postOrder, Gscope.zombieOrderList)
        Gscope.erp.postFun('processOrder/observerOrder/processObserverOrder',JSON.stringify(json), function(data) {
            Gscope.erp.closeLoad();
                let delArr = [];

                if(data.data.code=='200'){
                    for (var x = 0; x < Gscope.zombieOrderList.length; x++) {
                        for (var i = 0; i < postOrder.json.length; i++) {
                            if (postOrder.json[i].orderProductId === Gscope.zombieOrderList[x].orderProductId) {
                                delArr.push(x);
                            }
                        }
                    }
                    for (var x = delArr.length - 1; x >= 0; x--) {
                        Gscope.zombieOrderList.splice(x, 1);
                        if(Gscope.zombieOrderList.length == 0){
                            queryOrder('search');
                        }
                    }
                    $.each(Gscope.options2,function (i,v) {
                        v.pick = false;
                    })
                    Gscope.pickAll = false;
                    if(data.data.data){
                        layer.msg('提交成功');
                    }else{
                        layer.msg('提交失败');
                    }
                }else{
                    layer.msg('提交失败');
                }

                
        }, function(err) {
            Gscope.erp.closeLoad();
            layer.msg('提交失败: ' + err.message);
        });
    }
    function isSelectAll(bool) {
        for (var x = 0, l = Gscope.zombieOrderList.length; x <l; x++) {
            Gscope.zombieOrderList[x].pick = bool;
        }
    }
    function tableHandle(ev) {
        if (ev.target.tagName === 'INPUT') {
            let all = true;

            for (var x = 0, l = Gscope.zombieOrderList.length; x <l; x++) {
                if (!Gscope.zombieOrderList[x].pick) {
                    all = false;
                    break;
                }
            }
            Gscope.pickAll = all;
        }
    }

    let timer = null;
    function searchSKU(keywords) {
      // angular.element(window.哈哈哈哈).scope() // 能够根据element反射出DOM的作用域

      timer && clearTimeout(timer);

      if (!keywords) return;

      setTimeout(_ => {
        let idx = -1;
        let rectBox = window['scroll-wrap'].getBoundingClientRect();
        // let rectItem = {}

        for (let x = 0, l = Gscope.skuArr.length; x < l; x++) {
          if (Gscope.skuArr[x].sku.startsWith(keywords)) {
            idx = x;
            break;
          }
        }

        if (idx !== -1 && skuDOMList[idx]) {
          let oItem = skuDOMList[idx];
          let distance = oItem.offsetLeft - rectBox.left - rectBox.width;

          setTimeout(() => oItem.click(), 40)
          scroll.scrollTo(Math.min(0, -(distance + rectBox.width)), 0, 400)
        }
      }, 500);
    }
    function getSkuArrDOM() {
      skuDOMList = window['scroll-wrap'].getElementsByClassName('item');
    }

    app.controller('zombie-order',['$scope', 'erp', function($scope, erp) {
        Gscope = $scope;
        $scope.erp = erp;
        // 默认是0, 1代表提交到审批中, 2代表同意审批, 3代表拒绝, 4代表延后展示
        $scope.selected1 = 0;
        $scope.isExpect = false;
        $scope.isEditFlag = false;
        $scope.options1 = [
            { val: 0, tag: '未审批' },
            { val: 1, tag: '审批中' },
            { val: 2, tag: '审批完成客户未处理的订单' },
            { val: 5, tag: '审批完成客户已处理的订单' },
            { val: 3, tag: '审批拒绝' },
            { val: 4, tag: '延后展示' },

            // { val: 5, tag: '客户已处理' },
        ];
        // 全额退款，部分退款，已配齐等待发货，部分已配齐的发货部分未配齐的继续等待，继续等待
        $scope.options2 = [
            { pick: true, val: 1, tag: '退款' },
            { pick: true, val: 2, tag: '继续等待发货' },
        ];
        $scope.zombieOrderList = [
            /* {
                orderId: '客户订单号',
                orderProductId: '产品订单号',
                quantity: '数量',
                userName: '客户名称',
                createdate: '创建日期',
                store: '订单所属仓库',
                paymentDate: '付款时间',
            } */
        ];
        $scope.pageSize = 50;
        $scope.pageNum = 0;
        $scope.skuArr = [ /* {sku: "CJBHNSNS00325-Gray"} */ ];
        $scope.cSku = null;
        // (function() { for (var x = 0; x < 20; x++) $scope.skuArr.push({ sku: "CJBHNSNS00325-Gray" }); }());
        $scope.queryOrder = queryOrder;
        $scope.changePage = changePage;
        $scope.res1 = null;
        $scope.pickAll = false;
        $scope.remarkTxt = '';
        $scope.tableHandle = tableHandle;
        $scope.isSelectAll = isSelectAll;
        $scope.confirmFun = confirmFun;
        $scope.orderTypeList = [
            {label: '全部订单', value: ''},// 查询所有订单 后台让不传 或者 传 null
            {label: '直发订单', value: '1'},
            {label: '代发订单', value: '0'}
        ]
        $scope.orderType = '';// 查询所有订单 后台让不传 或者 传 null

        $scope.queryOrder('search');
        $scope.changeZombieStatus = function () {
            console.log($scope.selected1);
            $scope.zombieOrderList = [];
            $scope.queryOrder('search');
            $('#searchSKUInput').val('')
        }
        $scope.checkExpect = function (boolen) {

            $scope.isExpect = boolen;
            // console.log($scope.isExpect);
        }
        // $scope.openEditFun = function (index,item) {
        //     console.log(item);
        //     var arr = item.decisionMaking;
        //     $.each
        // }
        $scope.searchSKU = searchSKU;
        $scope.$watch('skuArr', _ => getSkuArrDOM())
    }]);
}());