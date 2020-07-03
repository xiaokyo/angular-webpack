;~function () {
    let app = angular.module('warehouse-app');
    //erp仓库   展示仓库列表   展示当前仓库下的到货单列表
    app.controller('erpdepotInCtrl', ['$scope', "erp", "$routeParams", function ($scope, erp, $routeParams) {
        function err(error) {
            console.log(error);
            layer.closeAll('loading');
        }
        console.log('erpdepotInCtrl')
        console.log($routeParams.stu)
        var stuNum = $routeParams.stu || 0;
        $scope.listFlag = stuNum;
        console.log($scope.listFlag)
        // switch (stuNum) {
        //     case 0:
        //         console.log('待签收')
        //         $scope.listFlag = 0;
        //         break;
        //     case 1:
        //         console.log('已签收')
        //         $scope.listFlag = 1;
        //         break;
        //     case 2:
        //         console.log('签收异常')
        //         $scope.listFlag = 2;
        //         break;
        //     case 3:
        //         console.log('线下采购')
        //         $scope.listFlag = 3;
        //         break;
        //     case 4:
        //         console.log('合并发货')
        //         $scope.listFlag = 4;
        //         break;
        //     case 5:
        //         console.log('虚假发货')
        //         $scope.listFlag = 5;
        //         break;
        // }
        //共有仓库 入库
        $scope.pageSize = '20';
        $scope.pageNum = '1';
        $scope.totalNum = 0;
        $scope.totalPageNum = 0;
        $scope.searchTj = '';
        $scope.timeIndex = 1;
        // alert(6666666)
        $('.drk-time').eq(0).addClass('active');

        $scope.messageFlag = false;
        var clickItem;
        $scope.aaa = function (item) {
            //  console.log(item);
            $scope.messageArea = item.remark;
            clickItem = item;
            //   console.log(productId);
            $scope.messageFlag = true;

        }
        $scope.messageCloseFun = function () {
            //  console.log(111);
            $scope.messageFlag = false;
        }
        //按时间查询
        $scope.timeStuFun = function (ev) {
            $('.drk-time').removeClass('active');
            $(ev.target).addClass('active');
            var timeStu = $(ev.target).text();
            switch (timeStu) {
                case '今日':
                    $scope.timeIndex = 1;
                    break;
                case '近三天':
                    $scope.timeIndex = 2;
                    break;
                case '本周':
                    $scope.timeIndex = 3;
                    break;
                case '近一个月':
                    $scope.timeIndex = 4;
                    break;
                case '近三个月':
                    $scope.timeIndex = 5;
                    break;
            }
            console.log($scope.timeIndex)
            cgListFun();
        }
        $scope.timeSFun = function () {
            $scope.timeIndex = 0;
            $('.drk-time').removeClass('active');
            cgListFun();
        }

        //拉取到仓库列表并展示
        function cgListFun() {
            //获取仓库对应的到货单列表
            var leftTime = $('#left-time').val();
            var rightTime = $('#right-time').val();
            var cgData = {};
            console.log($scope.timeIndex)
            switch ($scope.timeIndex) {
                case 0:
                    cgData.dateFlag = '0';
                    cgData.leftDate = leftTime;
                    cgData.rightDate = rightTime;
                    break;
                case 1:
                    cgData.dateFlag = '1';
                    break;
                case 2:
                    cgData.dateFlag = '2';
                    break;
                case 3:
                    cgData.dateFlag = '3';
                    break;
                case 4:
                    cgData.dateFlag = '4';
                    break;
                case 5:
                    cgData.dateFlag = '5';
                    break;
            }
            cgData.listFlag = $scope.listFlag + '';
            cgData.status = ''
            cgData.inputStr = $scope.searchTj;
            cgData.pageNum = $scope.pageNum + '';
            cgData.pageSize = $scope.pageSize + '';
            $('.erp-load-tbody').show();
            erp.loadPercent($('.erp-load-box'), 500);
            $scope.daohuodanliebiao = [];
            console.log(cgData)
            erp.postFun("pojo/procurement/getProcurementWayBillByStorage", JSON.stringify(cgData), bb, err);

            function bb(a) {
                // erp.closeLoad();
                if (a.data.statusCode == 200) {
                    $('.erp-load-tbody').hide();
                    erp.closeLoadPercent($('.erp-load-box'));
                    console.log(a)
                    var arrives = JSON.parse(a.data.result);
                    console.log(arrives);
                    $scope.daohuodanliebiao = arrives.list;
                    $scope.totalNum = arrives.totle;
                    if ($scope.totalNum == 0) {
                        $('.erp-load-tbody').show();
                        erp.addNodataPic($('.erp-load-box'), 500);
                        return;
                    }
                    $('.erp-load-tbody').hide();
                    erp.removeNodataPic($('.erp-load-box'));
                    console.log($scope.totalNum)
                    console.log($scope.daohuodanliebiao)
                    pageFun(erp, $scope);
                }
            };
        }

        function err(a) {
            erp.closeLoad();
            layer.msg("失败")
        };

        //分页
        function pageFun(erp, $scope) {
            if ($scope.totalNum <= 0) {
                return;
            }
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
                    // erp.load();
                    $('.erp-load-tbody').show();
                    erp.loadPercent($('.erp-load-box'), 500);
                    $scope.daohuodanliebiao = [];
                    $scope.pageNum = n;
                    var leftTime = $('#left-time').val();
                    var rightTime = $('#right-time').val();
                    var cgData = {};
                    switch ($scope.timeIndex) {
                        case 0:
                            cgData.dateFlag = '0';
                            cgData.leftDate = leftTime;
                            cgData.rightDate = rightTime;
                            break;
                        case 1:
                            cgData.dateFlag = '1';
                            break;
                        case 2:
                            cgData.dateFlag = '2';
                            break;
                        case 3:
                            cgData.dateFlag = '3';
                            break;
                        case 4:
                            cgData.dateFlag = '4';
                            break;
                        case 5:
                            cgData.dateFlag = '5';
                            break;
                    }
                    cgData.listFlag = $scope.listFlag + '';
                    cgData.status = '';
                    cgData.inputStr = $scope.searchTj;
                    cgData.pageNum = $scope.pageNum + '';
                    cgData.pageSize = $scope.pageSize + '';
                    console.log(JSON.stringify(cgData))
                    erp.postFun("pojo/procurement/getProcurementWayBillByStorage", JSON.stringify(cgData), function (a) {
                        // erp.closeLoad();
                        $('.erp-load-tbody').hide();
                        erp.closeLoadPercent($('.erp-load-box'));
                        console.log(a)
                        var arrives = JSON.parse(a.data.result);
                        console.log(arrives);
                        $scope.daohuodanliebiao = arrives.list;
                        $scope.totalNum = arrives.totle;

                        if (arrives.totle == 0) {
                            $scope.totalpage = 0;
                            layer.msg("没有找到数据");
                            return;
                        }
                        $scope.totalPageNum = Math.ceil($scope.totalNum / $scope.pagesize);
                    }, function (data) {
                        console.log(data)
                    })
                }
            });
        }

        cgListFun(erp, $scope);
        $scope.changePageSize = function () {
            cgListFun(erp, $scope);
        }
        $scope.toSpecifiedPage = function () {
            cgListFun(erp, $scope);
        }
        //搜索
        $('.top-search-inp').keypress(function (Event) {
            if (Event.keyCode == 13) {
                $scope.searchFun();
            }
        })
        $scope.searchFun = function () {
            cgListFun(erp, $scope);
        }
        //删除
        // $scope.cgDeletFun = function () {

        // }
        erp.getFun('pojo/procurement/getLogistic', function (data) {
            console.log(data)
            var obj = JSON.parse(data.data.result);
            console.log(obj)
            $scope.logistArr = obj.list;
        }, function (data) {
            console.log('物流获取失败')
        })
        erp.getFun('app/storage/getStorage', function (data) {
            console.log(data)
            var obj = JSON.parse(data.data.result);
            console.log(obj)
            $scope.ckArr = obj;
        }, function (data) {
            erp.closeLoad();
            console.log('仓库获取失败')
        })
        //修改
        $scope.cjMFlag = false;
        $scope.cgModifyFun = function (item) {
            console.log(item)
            $scope.cjMFlag = true;
            $scope.zzhVal = item.WAYBILL;
            $scope.dhcountVal = item.COUNT;
            $scope.listId = item.ID;
            for (var i = 0; i < $scope.logistArr.length; i++) {
                if (item.LOGISTIC == $scope.logistArr[i].NAMECN) {
                    $scope.addWlSel = item.LOGISTIC + '#' + $scope.logistArr[i].ID;
                    console.log($scope.addWlSel)
                    break;
                } else {
                    $scope.addWlSel = '';
                }
            }
            for (var i = 0; i < $scope.ckArr.length; i++) {
                if (item.STORAGENAME == $scope.ckArr[i].storage) {
                    $scope.addCkSel = item.STORAGENAME + '#' + $scope.ckArr[i].id;
                    console.log($scope.addCkSel)
                    break;
                } else {
                    $scope.addCkSel = '';
                }
            }
        }
        $scope.sureMFun = function () {
            $scope.cjMFlag = false;
            var logistName = '';
            var logistId = '';
            var ckName = '';
            var ckId = '';
            if ($scope.addWlSel == '') {
                logistName = '';
                logistId = '';
            } else {
                console.log($scope.addWlSel)
                logistName = $scope.addWlSel.split('#')[0];
                logistId = $scope.addWlSel.split('#')[1];
            }
            if ($scope.addCkSel == '') {
                ckName = '';
                ckId = '';
            } else {
                console.log($scope.addCkSel)
                ckName = $scope.addCkSel.split('#')[0];
                ckId = $scope.addCkSel.split('#')[1];
            }
            erp.postFun('pojo/procurement/updateWayBill', {
                wayBill: $scope.zzhVal,
                count: $scope.dhcountVal,
                wayBillId: $scope.listId,
                logistic: logistName,
                logisticId: logistId,
                storageId: ckId,
                storageName: ckName
            }, function (data) {
                // console.log(data)
                if (data.data.statusCode == 200) {
                    layer.msg('修改成功')
                    cgListFun(erp, $scope);
                } else {
                    layer.msg('修改失败')
                }
            }, err)
        }
        $scope.qxMFun = function () {
            $scope.cjMFlag = false;
        }
        //删除
        $scope.deletFlag = false;
        $scope.deletFun = function (item) {
            $scope.deletId = item.ID;
            $scope.deletFlag = true;
        }
        $scope.qxDeletFun = function () {
            $scope.deletFlag = false;
        }
        $scope.sureDelFun = function () {
            erp.getFun('pojo/procurement/deleteWayBill?wayBillId=' + $scope.deletId, function (data) {
                console.log(data)
                $scope.deletFlag = false;
                if (data.data.statusCode == 200) {
                    layer.msg('删除成功')
                    cgListFun(erp, $scope);
                } else {
                    layer.msg('删除失败')
                }
            }, err)
        }
        //打印条形码
        $scope.txmFlag = false;
        $scope.dytxmFun = function (item) {
            erp.getFun('pojo/procurement/createBarcode?id=' + item.ID, function (data) {
                console.log(data)
                $scope.imghref = data.data.result;
                if (data.data.result) {
                    $scope.txmFlag = true;
                } else {
                    layer.msg('打印条形码失败')
                }
            }, function (data) {
                console.log(data)
                layer.msg('网络错误')
            })
        }
        //关闭条形码弹框
        $scope.txmcloseFun = function () {
            $scope.txmFlag = false;
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
        //复制条形码
        $scope.copyFun = function () {
            var Url2 = document.getElementById("txm-val");
            Url2.select(); // 选择对象
            var isCopy = document.execCommand("Copy"); // 执行浏览器复制命令
            if (isCopy) {
                layer.msg('复制成功')
                $scope.txmFlag = false;
            }
        }
        //刷新数据
        $scope.refreshFun = function (item) {
            // alert($scope.pageNum)
            erp.load()
            erp.getFun('pojo/procurement/flushLogistic?wayBillId=' + item.ID, function (data) {
                console.log(data)
                erp.closeLoad()
                if (data.data.statusCode == 200) {
                    cgListFun(erp, $scope);
                }
            }, err)
        }
        //查看物流详情
        $scope.wlDetailFlag = false;
        $scope.wlDetailFun = function (item) {
            $scope.wlDetailFlag = true;
            var list = item.LOGISTICMESSAGE;
            console.log(list)
            if (list != "等待刷新物流信息") {
                list = JSON.parse(list)
                $scope.wlListArr = list.Traces;
            }
            console.log($scope.wlListArr)

        }
        $scope.wlDetailCloseFun = function () {
            $scope.wlDetailFlag = false;
            $scope.wlListArr = [];
        }
        //查看业务员
        $scope.viewFun = function (item) {
            $scope.viewFlag = true;
            $scope.ywyListArr = item.empSet;
        }
        $scope.viewCloseFun = function () {
            $scope.viewFlag = false;
        }
        //查看所有的订单
        $scope.ordnumList = function (item) {
            $scope.ordNumFlag = true;
            $scope.ordNumArr = item.orderSet;
        }
        //关闭订单号的弹框
        $scope.closeOrdNum = function () {
            $scope.ordNumFlag = false;
        }

        $scope.copySku = function (sku) {
            var Url1;
            Url1 = document.createElement('input');
            Url1.setAttribute('readonly', 'readonly');
            Url1.setAttribute('value', sku);
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

    }])
    
}();