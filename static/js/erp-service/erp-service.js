(function (angular) {
    var app = angular.module('erp-service', []);
    var lang = localStorage.getItem('lang');
    // console.log(lang);
    var xxx;
    var nydx;
    var shuaxin;
    var quxiao;
    var meiyouywm;
    if (lang == 'en') {
        xxx = "You have new news";
        nydx = "You have dropped";
        shuaxin = "Refresh";
        quxiao = "Cancel";
        meiyouywm = 'The account does not yet have an English name. Please set the English name first.';
    } else if (lang == 'cn' || lang == null) {
        xxx = "你有新消息啦";
        nydx = "你已掉线";
        shuaxin = "刷新";
        quxiao = "取消";
        meiyouywm = '该账户还未有英文名，请先设置英文名';

    }
    function changeChinese(text) {
        if (lang == 'en') {
            return text;
        } else if (lang == 'cn') {
            if (text == 'No Tracking Information Found'||text == 'NO Tracking Information Found') {
                return "无追踪信息";
            } else if (text == 'Tracking Information Frozen') {
                return "追踪信息不更新";
            } else if (text == 'Tracking Information Error') {
                return "追踪信息错误";
            } else if (text == 'Order Returned') {
                return "商品退回";
            } else if (text == 'Products Short') {
                return "商品缺失";
            } else if (text == 'Defective Products') {
                return "商品损坏";
            } else if (text == 'Received Incorrect Products') {
                return "商品错发";
            } else if (text == 'Order Not Received') {
                return "订单未收到";
            } else if (text == 'Lack of inventory' || text == 'Lack of Inventory') {
                return "缺少库存";
            } else if (text == 'Unfilled Orders Cancellation') {
                return "未发货订单取消";
            }else if (text == "It's been a long time and I didn't receive the video yet") {
                return "时间太久，一直未收到视频";
            }else if (text == "I'm not happy with the shooting effect") {
                return "拍摄效果不满意";
            }
        }
    }

    
    var gStoreList = [
        {"storeNum":0,"storeName":"义乌仓"},
        {"storeNum":1,"storeName":"深圳仓"},
        {"storeNum":2,"storeName":"美西奇诺仓"},
        {"storeNum":3,"storeName":"美东新泽西"},
        {"storeNum":4,"storeName":"泰国仓"},
        {"storeNum":5,"storeName":"金华仓"},
        {"storeNum":6,"storeName":"印尼雅加达仓"},
        {"storeNum":7,"storeName":"德国法兰克福仓"},
    ]
    //erp客服---等待纠纷
    app.controller('csdisputeWaiteCtrl', ['$scope', 'erp', '$timeout', function ($scope, erp, $timeout) {
        var searchxx = sessionStorage.getItem('searchInformation');
        $scope.replyWrapModal = false
        $scope.replyText=""
        var base64 = new Base64();
        var job = localStorage.getItem('job') ? base64.decode(localStorage.getItem('job')) : '';
        $scope.loginName = base64.decode(localStorage.getItem('erploginName') == undefined ? '' : localStorage.getItem('erploginName'));
        const operationList = ['朱顺', '刘鑫', '田恬', '姚亿玲', '温馨怡', '朱春翡']

        //打开快捷回复
        $('#quickReply').click(function () {
          $scope.replyWrapModal = true
            //console.log(1);
            $('.replyWrap').css('right', '0');
            var data = {};
            data.title = '';
            data.type = '';
            data.userName = '';
            data.typemessage = '1';
            getQuikReplyList(data);

        });

        function getQuikReplyList(data2) {
            erp.load();
            erp.postFun('erp/fastMessage/searchFastMessageAll', JSON.stringify(data2), function (data) {
                erp.closeLoad();
                console.log(data);
                if (data.data.code == '200') {
                    var result = data.data.data;
                    $scope.replyList = result;
                }
            }, function (n) {
                console.log(n);
                erp.closeLoad();
            });
        }

        $('#replySearch').on('input', function () {
            var title = $(this).val();
            var data = {
                "title": title,
                "type": '',
                "userName": "",
                "typemessage": '1'
            }
            getQuikReplyList(data);
        });
        $('.closeReply').click(function () {
            //console.log(1);
            $('.replyWrap').css('right', '-260px');
            $scope.replyWrapModal = false

        });
        $('.ulWrap>ul').on('click', 'li>span', function (e) {
            var target = $(this);
            var text = target.attr('title');
            const message = $scope.replyText
            $scope.replyText=message+text
            console.log($scope.replyText,'改变后的回复在这');
            $scope.$apply()
        });

        if (searchxx == null || searchxx == undefined || searchxx == '') {
            $scope.searchval = '';
        } else {
            $scope.searchval = searchxx;
        }
        $scope.pageSize = '20';
        $scope.pageNum = '1';
        $scope.totalNum = 0;
        $scope.totalPageNum = 0;
        $scope.changeChina = function (text) {
            var str = changeChinese(text);
            return str;
        };
        $('.recordMsg-word').on('click', 'a', function (e) {
            e.preventDefault();
            $(this).addClass('active').siblings('.active').removeClass('active');
            var id = '#' + $(this).attr('href');
            $(id).show().siblings('.recordMsg-content').hide();
        });
        $scope.getPrintingSurfaceSingle = function (printingSurfaceSingle) {
            //console.log(printingSurfaceSingle);
            if (printingSurfaceSingle == null || printingSurfaceSingle == '' || printingSurfaceSingle == undefined) {
                return '';
            } else {
                return `${printingSurfaceSingle.year + 1900}-${printingSurfaceSingle.month + 1}-${printingSurfaceSingle.date} ${printingSurfaceSingle.hours }:${printingSurfaceSingle.minutes}:${printingSurfaceSingle.seconds}`;
            }

        }
        $scope.isshowBtn = (['打单', '纠纷'].includes(job.trim()) || operationList.includes($scope.loginName) || erp.isAdminLogin())
        console.log($scope.isshowBtn)
        $scope.operatorName = "";
        $scope.storeNum = '';
        $scope.storeList = gStoreList;
        function getList(erp, $scope) {
            console.log($scope.storeNum)
            var getListData = {};
            getListData.page = $scope.pageNum - 0;
            getListData.limit = $scope.pageSize - 0;
            getListData.code = 'erp';
            getListData.responseType = 'erp';
            getListData.status = '7';
            getListData.type = $('.search-select').val();
            getListData.orderNumber = $scope.searchval;
            getListData.store = $scope.storeNum;
            getListData.operator = $scope.operatorName;
            getListData.trackingNumber = $scope.trackNumVal;
            erp.postFun('app/dispute/getDispute', JSON.stringify(getListData), con, errFun,{layer:true})

            function con(data) {
                console.log(data)
                $scope.ordersList = data.data.list;
                $scope.totalNum = data.data.count;//获取总订单的条数
                if(!$scope.operatorList){
                    $scope.operatorList = data.data.operatorList;
                }
                console.log($scope.totalNum)
                erp.closeLoad()
                pageFun(erp, $scope);
            }
        }
        $scope.selSearch = function(){
            console.log($scope.operatorName,$scope.storeNum)
            $scope.pageNum = '1';
            getList(erp, $scope);
        }
        function errFun(data) {
            console.log(data)
            erp.closeLoad()
        }

        getList(erp, $scope)

        //分页
        function pageFun(erp, $scope) {
            console.log($scope.totalNum)
            if ($scope.totalNum < 1) {
                return;
            }
            $(".pagination2").jqPaginator({
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
                    };
                    erp.load();
                    $scope.pageNum = n;
                    getList(erp, $scope);
                }
            });
        }

        $scope.changePageSize = function () {
            getList(erp, $scope);
        }
        $scope.toSpecifiedPage = function () {
            getList(erp, $scope);
        }
        $scope.linkFun = function (item) {
            var muId = item.ID;
            if(item.ID.indexOf('ZF')!=-1||item.ID.indexOf('SY')!=-1){
                window.open('#/StatusQuery' + '/' + muId)
            }else{
                window.open('#/zi-all' + '/' + muId)
            }
        }
        //搜索
        $('.top-search-inp').keypress(function (e) {
            if (e.keyCode == 13) {
                $scope.search()
            }
        });
        $('#cebian-menu .cebian-content').on('click', 'span>a', function () {
            sessionStorage.setItem('searchInformation', $scope.searchval);
        });
        $scope.search = function () {
            console.log($scope.searchval);
            $scope.pageNum = '1';
            getList(erp, $scope);
        }
        var jflx = '';
        $('.search-select').change(function () {
            jflx = $(this).val();
            $scope.pageNum = '1';
            getList(erp, $scope);
        })
        //点击消息记录
        $scope.responseMsgFun = function (item, index) {
            $scope.replayFlag = 1;
            if (item.vip == 1) {
                $scope.vipFlag = true;
            } else {
                $scope.vipFlag = false;
            }
            $scope.userLeveldj = item.userLevel;
            $scope.cunLeveldj = item.cunLevel;
            $scope.moneyLeveldj = item.moneyLevel;
            $(".recordMsg").css("display", "block");
            var target = $('.recordMsg-word').find('a').eq(0);
            target.addClass('active').siblings('.active').removeClass('active');
            var tid = '#' + target.attr('href');
            $(tid).show().siblings('.recordMsg-content').hide();
            $scope.itemId = item.ID;
            $scope.itemIndex = index;
            $scope.messageListArr = item.message;
            console.log(item)
            var messageArr = item.message;
            $scope.nowType = item.type;
            $scope.tdetailDate = item.createDate;
            $scope.detailData = item.message;//纠纷对话列表
            $scope.userName = item.userName;
            $scope.serverName = item.salesmanName;
            console.log(item.createDate.time)
            console.log($scope.nowType, $scope.tdetailDate, $scope.detailData)
            //获取客户名字的第一个字母
            $scope.cusNameFir = $scope.userName.slice(0, 1).toUpperCase();
            $scope.salseNameFir = $scope.serverName.slice(0, 1).toUpperCase();
            console.log($scope.salseNameFir, $scope.cusNameFir);
            // 创建视频播放
            videoList(erp, item);
            var bfData = {};
            bfData.id = item.ID;
            bfData.type = 'erp';
            erp.postFun('app/dispute/getOrderAddress', JSON.stringify(bfData), function (data) {
                console.log(data)
                // console.log(data.data.address.id)
                var resObj = data.data.address;
                if (resObj.id) {
                    $scope.productList = data.data.products;//商品列表
                    $scope.recoCity = resObj.city;
                    $scope.recoProvin = resObj.province;
                    $scope.recoCountrycode = resObj.countryCode;
                    $scope.recoCustomerName = resObj.customerName;
                    $scope.recoShippingAddress = resObj.shippingAddress;
                    $scope.recoShippingAddress2 = resObj.shippingaddress2;
                    $scope.recoZip = resObj.zip;
                } else {
                }
            }, function (data) {
                console.log(data)
            })
        };
        $scope.openDetails = function (item, index) {
            $scope.replayFlag = 0;
            if (item.vip == 1) {
                $scope.vipFlag = true;
            } else {
                $scope.vipFlag = false;
            }
            $scope.userLeveldj = item.userLevel;
            $scope.cunLeveldj = item.cunLevel;
            $scope.moneyLeveldj = item.moneyLevel;
            $(".recordMsg").css("display", "block");
            var target = $('.recordMsg-word').find('a').eq(0);
            target.addClass('active').siblings('.active').removeClass('active');
            var tid = '#' + target.attr('href');
            $(tid).show().siblings('.recordMsg-content').hide();
            $scope.itemId = item.ID;
            $scope.itemIndex = index;
            $scope.messageListArr = item.message;
            console.log(item)
            var messageArr = item.message;
            $scope.nowType = item.type;
            $scope.tdetailDate = item.createDate;
            $scope.detailData = item.message;//纠纷对话列表
            $scope.userName = item.userName;
            $scope.serverName = item.salesmanName;
            console.log(item.createDate.time)
            console.log($scope.nowType, $scope.tdetailDate, $scope.detailData)
            //获取客户名字的第一个字母
            $scope.cusNameFir = $scope.userName.slice(0, 1).toUpperCase();
            $scope.salseNameFir = $scope.serverName.slice(0, 1).toUpperCase();
            console.log($scope.salseNameFir, $scope.cusNameFir);
            // 创建视频播放
            videoList(erp, item);
            var bfData = {};
            bfData.id = item.ID;
            bfData.type = 'erp';
            erp.postFun('app/dispute/getOrderAddress', JSON.stringify(bfData), function (data) {
                console.log(data)
                // console.log(data.data.address.id)
                var resObj = data.data.address;
                if (resObj.id) {
                    $scope.productList = data.data.products;//商品列表
                    $scope.recoCity = resObj.city;
                    $scope.recoProvin = resObj.province;
                    $scope.recoCountrycode = resObj.countryCode;
                    $scope.recoCustomerName = resObj.customerName;
                    $scope.recoShippingAddress = resObj.shippingAddress;
                    $scope.recoShippingAddress2 = resObj.shippingaddress2;
                    $scope.recoZip = resObj.zip;
                } else {
                }
            }, function (data) {
                console.log(data)
            })
        };
        //点击退款
        $scope.tKFun = function (item, index) {
            $scope.replayFlag = 2;
            $scope.userLeveldj = item.userLevel;
            $scope.cunLeveldj = item.cunLevel;
            $scope.moneyLeveldj = item.moneyLevel;
            $scope.itemOrderMoney = item.orderMoney;
            $(".recordMsg").css("display", "block");
            $('.how-money').show();
            var target = $('.recordMsg-word').find('a').eq(0);
            target.addClass('active').siblings('.active').removeClass('active');
            var tid = '#' + target.attr('href');
            $(tid).show().siblings('.recordMsg-content').hide();
            $scope.itemId = item.ID;
            $scope.itemIndex = index;
            $scope.messageListArr = item.message;
            console.log(item)
            var messageArr = item.message;
            $scope.nowType = item.type;
            $scope.tdetailDate = item.createDate;
            $scope.detailData = item.message;//纠纷对话列表
            $scope.userName = item.userName;
            $scope.serverName = item.salesmanName;
            console.log(item.createDate.time)
            console.log($scope.nowType, $scope.tdetailDate, $scope.detailData)
            //获取客户名字的第一个字母
            $scope.cusNameFir = $scope.userName.slice(0, 1).toUpperCase();
            $scope.salseNameFir = $scope.serverName.slice(0, 1).toUpperCase();
            console.log($scope.salseNameFir, $scope.cusNameFir);
            // 创建视频播放
            videoList(erp, item);
            var bfData = {};
            bfData.id = item.ID;
            bfData.type = 'erp';
            erp.postFun('app/dispute/getOrderAddress', JSON.stringify(bfData), function (data) {
                console.log(data)
                // console.log(data.data.address.id)
                var resObj = data.data.address;
                if (resObj.id) {
                    $scope.productList = data.data.products;//商品列表
                    $scope.recoCity = resObj.city;
                    $scope.recoProvin = resObj.province;
                    $scope.recoCountrycode = resObj.countryCode;
                    $scope.recoCustomerName = resObj.customerName;
                    $scope.recoShippingAddress = resObj.shippingAddress;
                    $scope.recoShippingAddress2 = resObj.shippingaddress2;
                    $scope.recoZip = resObj.zip;
                } else {
                }
            }, function (data) {
                console.log(data)
            })
        }
        $scope.closRrecordMsgFun = function () {
            $(".recordMsg").css("display", "none");
            $scope.replyText = '';
            $scope.imgArr = [];
            $scope.replyText = "";
        }
        //补发
        $scope.bfFun = function (item, index) {
            // layer.msg('该功能正在开发中')
            $scope.replyText = "Please confirm the resend information below before we process the resending order.";
            var target = $('.recordMsg-word').find('a').eq(0);
            target.addClass('active').siblings('.active').removeClass('active');
            var tid = '#' + target.attr('href');
            $(tid).show().siblings('.recordMsg-content').hide();
            $scope.replayFlag = 3;
            $scope.itemId = item.ID;
            $scope.itemIndex = index;
            $scope.messageListArr = item.message;
            console.log(item)
            var messageArr = item.message;
            $scope.nowType = item.type;
            $scope.tdetailDate = item.createDate;
            $scope.detailData = item.message;//纠纷对话列表
            $scope.userName = item.userName;
            $scope.serverName = item.salesmanName;
            console.log(item.createDate.time)
            console.log($scope.nowType, $scope.tdetailDate, $scope.detailData)
            //获取客户名字的第一个字母
            $scope.cusNameFir = $scope.userName.slice(0, 1).toUpperCase();
            if ($scope.serverName == '' || $scope.serverName == null || $scope.serverName == undefined) {
                $scope.salseNameFir = '';
            } else {
                $scope.salseNameFir = $scope.serverName.slice(0, 1).toUpperCase();
            }
            console.log($scope.salseNameFir, $scope.cusNameFir)

            console.log(item);
            $('#recoTextArea').val('');
            // 创建视频播放
            videoList(erp, item);
            var bfData = {};
            bfData.id = item.ID;
            bfData.type = 'erp';
            erp.postFun('app/dispute/getOrderAddress', JSON.stringify(bfData), function (data) {
                console.log(data)
                // console.log(data.data.address.id)
                var resObj = data.data.address;
                if(data.data.hasOwnProperty('deliverCode')) {
                    $scope.deliverCode = data.data.deliverCode;
                } else {
                    $scope.deliverCode = "CN"
                }
                if (resObj.id) {
                    $scope.checkedAll = true;
                    // $scope.dafultLogistic = resObj.logisticName;
                    // $scope.logisticList = resObj.logisticinfo;
                    $scope.productList = data.data.products;//商品列表
                    for (var i = 0; i < $scope.productList.length; i++) {
                        $scope.productList[i].checked = true;
                        $scope.productList[i].inputQuantity = 0;
                    }
                    console.log($scope.productList)
                    $scope.userLeveldj = item.userLevel;
                    $scope.cunLeveldj = item.cunLevel;
                    $scope.moneyLeveldj = item.moneyLevel;
                    $(".recordMsg").css("display", "block");
                    $scope.recoCity = resObj.city;
                    $scope.recoProvin = resObj.province;
                    $scope.recoCountrycode = resObj.countryCode;
                    $scope.recoCustomerName = resObj.customerName;
                    $scope.recoShippingAddress = resObj.shippingAddress;
                    $scope.recoShippingAddress2 = resObj.shippingaddress2;
                    $scope.recoZip = resObj.zip;
                    $scope.storeType = data.data.storeType;
                    var params = {
                        "startCountryCode": $scope.deliverCode,
	                    "countryCode": $scope.recoCountrycode,
                        "storeType": $scope.storeType
                    }
                    layer.load(2);
                    erp.postFun('freight/logistics/getLogisticsInfo', params, function (res) {
                        $scope.logisticList = res.data.data;
                        layer.closeAll('loading')
                    }, function() {
                        layer.msg('获取物流信息失败')
                        layer.closeAll('loading')
                    })
                } else {
                    layer.msg('该订单不能补发')
                }
            }, function (data) {
                console.log(data)
            })
        }
        //补发完成
        $scope.bfEndFun = function (item, index) {
            $scope.bfitemId = item.ID;
            $scope.bfitemIndex = index;
            $scope.isbfFlag = true;
        }
        $scope.surebfEndFun = function () {
            $scope.isbfFlag = false;
            var bfdata = {};
            bfdata.id = $scope.bfitemId;
            erp.postFun('app/dispute/finishDispute', JSON.stringify(bfdata), function (data) {
                console.log(data)
                if (data.data.result) {
                    layer.msg('成功')
                    $scope.ordersList.splice($scope.bfitemIndex, 1);
                } else {
                    layer.msg('失败')
                }
            }, function (data) {
                console.log(data)
            })
        }
        //显示更多操作
        $('.morefun-div').mouseenter(function () {
            $('.more-selul').show();
        });
        $('.morefun-div').mouseleave(function () {
            $('.more-selul').hide();
        });
        //选中
        $scope.checkFun = function (item, index) {
            var checkedNum = 0;
            for (var i = 0; i < $scope.productList.length; i++) {
                if ($scope.productList[i]['checked'] == true) {
                    checkedNum++;
                }
            }
            console.log(checkedNum);
            if (checkedNum == $scope.productList.length) {
                $scope.checkedAll = true;
            } else {
                $scope.checkedAll = false;
            }
        }
        $scope.recoCheckAllFun = function () {
            for (var i = 0; i < $scope.productList.length; i++) {
                $scope.productList[i].checked = $scope.checkedAll;
            }
        }
        //选择物流
        $('.reco-logistic').change(function () {
            console.log($scope.dafultLogistic)
            $scope.dafultLogistic = $(this).val();
            console.log($scope.dafultLogistic)
        })
        //商品失去焦点
        $scope.skuBlurFun = function (item, index) {
            console.log(item)
            console.log($scope.productList[index])
        }
        function debounce(fn,wait){
            var timer = null;
            return function(){
                if(timer !== null){
                    clearTimeout(timer);
                }
                timer = setTimeout(fn,wait);
            }
        }

        $scope.countryChange = debounce(function() {
            var params = {
                    "startCountryCode": $scope.deliverCode,
                    "countryCode": $scope.recoCountrycode,
                    "storeType": $scope.storeType
                }
                layer.load(2);
                erp.postFun('freight/logistics/getLogisticsInfo', params, function (res) {
                    $scope.logisticList = res.data.data;
                    layer.closeAll('loading')
                }, function() {
                    layer.msg('获取物流信息失败')
                    layer.closeAll('loading')
                })

        }, 800) 

        $scope.sureBfFun = function () {
            if (!$scope.replyText) {
                layer.msg('请输入回复的内容')
                return;
            }
            var bfCheckedList = [];
            for (var i = 0; i < $scope.productList.length; i++) {
                var bfObj = {};
                if ($scope.productList[i].checked) {
                    bfObj.sku = $scope.productList[i].sku;
                    bfObj.quantity = $scope.productList[i].quantity;
                    bfObj.id = $scope.productList[i].id;
                    bfCheckedList.push(bfObj);
                    if($scope.productList[i].inputQuantity>$scope.productList[i].quantity){
                        layer.msg('补发数量不能大于之前商品数量')
                        return
                    }
                }
            }
            console.log($scope.replyText)
            console.log(bfCheckedList)
            if (bfCheckedList.length < 1) {
                layer.msg('请选择商品')
                return;
            }
            if(!$scope.newlogisticName) {
                layer.msg('请选择物流方式')
                return;
            }
            // return;
            layer.load(2)
            var bfUpData = {};
            bfUpData.id = $scope.itemId;
            bfUpData.city = $scope.recoCity;
            bfUpData.province = $scope.recoProvin;
            bfUpData.countryCode = $scope.recoCountrycode;
            bfUpData.customerName = $scope.recoCustomerName;
            bfUpData.shippingAddress = $scope.recoShippingAddress;
            bfUpData.shippingaddress2 = $scope.recoShippingAddress2;
            bfUpData.zip = $scope.recoZip;
            bfUpData.logisticName = $scope.newlogisticName;
            bfUpData.productids = JSON.stringify(bfCheckedList);
            bfUpData.erpnote = $('#recoTextArea').val();
            //{"id":"123","productids":[{"sku":"010","quantity":"3"},{"sku":"33","quantity":"2"}]}
            erp.postFun('app/dispute/createDisputeOrder', JSON.stringify(bfUpData), function (data) {
                if (data.data.code == true) {
                    layer.msg('创建补发成功')
                    var listObj = {};//存储一条消息内容
                    listObj.userName = '1';//业务员
                    listObj.image = $scope.imgArr;
                    listObj.remark = $scope.replyText;
                    listObj.resendMark = 'resend';
                    listObj.date = timestampToTime(new Date())
                    // listArr.push(listObj);
                    console.log(listObj)
                    console.log(listArr)
                    $scope.messageListArr.push(listObj)
                    var listArr = JSON.stringify($scope.messageListArr)
                    var upData = {};
                    upData.id = $scope.itemId;
                    upData.responseType = 'CJ';
                    upData.disputeOrder = $scope.itemId;//给cj标记是否是补发
                    upData.message = listArr;
                    upData.type=7;
                    erp.postFun('app/dispute/replyDispute', JSON.stringify(upData), function (data) {
                        console.log(data)
                        layer.closeAll('loading');
                        if (data.data.result == true || data.data.result == 200) {
                            $scope.closRrecordMsgFun();//关闭纠纷单
                            layer.msg('回复成功')
                            $scope.ordersList[$scope.itemIndex].message = $scope.messageListArr;
                            $scope.replyText = '';
                            $scope.imgArr = [];
                            getList(erp, $scope);
                        } else {
                            layer.msg('回复失败')
                            // $scope.messageListArr.pop()
                        }
                    }, errFun)
                } else {
                    layer.closeAll('loading');
                    var msg = data.data.message;
                    layer.msg(msg)
                }
            }, errFun)

        }
        //回复纠纷的按钮
        $scope.replyFun = function () {
            if ($scope.replyText) {
                layer.load(2)
                // var listArr = [];
                var listObj = {};//存储一条消息内容
                listObj.userName = '1';//业务员
                listObj.image = $scope.imgArr;
                listObj.remark = $scope.replyText;
                listObj.date = timestampToTime(new Date())
                // listArr.push(listObj);
                console.log(listObj)
                console.log(listArr)
                $scope.messageListArr.push(listObj)
                var listArr = JSON.stringify($scope.messageListArr)
                var upData = {};
                upData.id = $scope.itemId;
                upData.responseType = 'CJ';
                upData.message = listArr;
                upData.type=7;
                erp.postFun('app/dispute/replyDispute', JSON.stringify(upData), function (data) {
                    console.log(data)
                    layer.closeAll('loading');
                    if (data.data.result == true || data.data.result == 200) {
                        $scope.closRrecordMsgFun();//关闭纠纷单
                        layer.msg('回复成功')
                        $scope.ordersList[$scope.itemIndex].message = $scope.messageListArr;
                        $scope.replyText = '';
                        $scope.imgArr = [];
                        getList(erp, $scope);
                    } else {
                        layer.msg('回复失败')
                        // $scope.messageListArr.pop()
                    }
                }, errFun)
            } else {
                layer.msg('请输入回复的内容')
                return;
            }
        }
        $scope.sureTkFun = function () {
            console.log($scope.replyText,'回复退款在这！！！！！');
            if (!$scope.replyText) {
                layer.msg('请输入回复的内容')
                return;
            }
            if (!$scope.howMoney || $scope.howMoney <= 0) {
                layer.msg('请输入退款金额')
                return;
            }
            if ($scope.itemOrderMoney) {
                if ($scope.howMoney > $scope.itemOrderMoney) {
                    layer.msg('退款金额不能大于订单金额')
                    return
                }
            }
            layer.load(2)
            var listObj = {};//存储一条消息内容
            listObj.userName = '1';//业务员
            listObj.image = $scope.imgArr;
            listObj.remark = $scope.replyText;
            listObj.date = timestampToTime(new Date())
            listObj.refuseMoney = $scope.howMoney;
            // listArr.push(listObj);
            console.log(listObj)
            console.log(listArr)
            $scope.messageListArr.push(listObj)
            var listArr = JSON.stringify($scope.messageListArr)
            var upData = {};
            upData.id = $scope.itemId;
            upData.responseType = 'CJ';
            upData.money = $scope.howMoney;
            upData.message = listArr;
            upData.type=7;
            erp.postFun('app/dispute/replyDispute', JSON.stringify(upData), function (data) {
                console.log(data)
                layer.closeAll('loading');
                if (data.data.result == true || data.data.result == 200) {
                    $scope.closRrecordMsgFun();//关闭纠纷单
                    layer.msg('回复退款成功')
                    $scope.ordersList[$scope.itemIndex].message = $scope.messageListArr;
                    $scope.replyText = '';
                    $scope.howMoney = '';
                    $scope.imgArr = [];
                    getList(erp, $scope);
                } else if (data.data.result == 222) {
                    layer.msg('退款金额不能大于订单金额')
                    $scope.messageListArr.pop()
                } else {
                    layer.msg('回复退款失败')
                    $scope.messageListArr.pop()
                }
            }, errFun)
        }
        //点击上传的图片显示大图
        $scope.viewBigImg = function (item) {
            $scope.viewImgFlag = true;
            $scope.bigImgSrc = item;
            console.log(item)
        }
        $scope.closePreImg = function () {
            $scope.viewImgFlag = false;
        }

        //上传图片
        $scope.imgArr=[];
        let loadList = {
            img: ['png', 'jpg', 'jpeg', 'gif', "PNG", "JPG", "JPEG", "GIF"],
            video: ['mp4', 'avi', 'wmv', 'mpg', 'mov', 'flv', "MP4", "AVI", "WMV", "MPG", "MOV", "FLV"]
        };
        $scope.upLoadImg4=function (files) {
            console.log(files)
            let validFileArr = [];
            if(files){
                let fileType,fileName;
                for(let i = 0,len = files.length;i<len;i++){
                    fileName = files[i].name;
                    fileType = fileName.substring(fileName.lastIndexOf('.')+1,fileName.length).toLowerCase();
                    console.log(fileName,fileType)
                    if(loadList.img.indexOf(fileType)!=-1){
                        validFileArr.push(files[i])
                    }
                }
                console.log(validFileArr)
            }
            if(validFileArr.length<1&&files.length>0){
                layer.msg('Images format error')
                return
            }
            erp.ossUploadFile(validFileArr,function (data) {
                console.log(data)
                if($scope.imgArr.length>=8){
                  layer.msg('最多上传8张图片')
                  return
                }
                if (data.code == 0) {
                    layer.msg('Images Upload Failed');
                    return;
                }
                if (data.code == 2) {
                    layer.msg('Images Upload Incomplete');
                }
                var result = data.succssLinks;
                console.log(result)
                var filArr = [];
                for(var j = 0;j < result.length;j++){
                    var srcList = result[j].split('.');
                    var fileName = srcList[srcList.length-1].toLowerCase();
                    console.log(fileName)
                    if(fileName=='png' || fileName=='jpg' || fileName=='jpeg' || fileName=='gif'){
                        $scope.imgArr.push(result[j]);
                    }
                }
                if($scope.imgArr&&$scope.imgArr.length>=8){
                    $scope.hideUpImgFlag = true;
                }
                $('.upload_file').val('')
                // $scope.imgArr = filArr;
                console.log($scope.imgArr)
                $scope.$apply();
            })
        }
        // 删除上传的图片
    $scope.delImg = (index, event) => {
        event.stopPropagation();
        $scope.imgArr.splice(index, 1);
        //   $scope.imgOssArr.splice(index, 1);
        if($scope.imgArr.length<8){
            $scope.hideUpImgFlag = false;
        }
    };
        // 上传视频
    $scope.UploadVideoList = [];
    $scope.videoId = [];
    $scope.videoArr = [];
    $scope.hideUpVideoFlag = true
    $scope.upLoadImg5 = function (files) {
      let file = files[0];
      let fileName = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
      if(loadList.video.indexOf(fileName) == -1) {
        layer.msg('Video format error');
        return;
      }
      if ($scope.videoArr.length == 4) {
        layer.msg('Upload four video at most');
        return;
      }
      if (file.size / 1024 / 1024 > 20) {
        layer.msg('Video file size limited to 20M');
        return;
      }
      erp.load(2);
      let uploader = cjUtils.createUploader({
        url:'https://tools.cjdropshipping.com/tool/downLoad/token',
        type: 1,
        addFileSuccessFn: ({ uploadInfo }) => {
          console.log('视频添加成功 =>', uploadInfo)
        },
        onUploadProgress: ({ uploadInfo, totalSize, progress }) => {
          console.log('上传进度 uploadInfo =>', uploadInfo, 'toalSize =>', totalSize, 'progress =>', progress)
          let progressPercent = Math.ceil(progress * 100);
          console.log('进度 =>', progressPercent)
        },
        success: ({ uploadInfo }) => {
          console.log('上传成功 =>', uploadInfo);
          $scope.videoArr.push({vid: uploadInfo.videoId});
          console.log($scope.videoArr)
          videoUploadPlay({vid: uploadInfo.videoId});
          if($scope.videoArr&&$scope.videoArr.length>=4){
          	$scope.hideUpVideoFlag = false;
          }
          $('.upload_file').val('')
        },
        error: ({ uploadInfo, code, message }) => {
          layer.closeAll("loading");
          console.log("上传失败" + uploadInfo.file.name + ",code:" + code + ", message:" + message)
        },
        onUploadEnd: ({ uploadInfo }) => {
          console.log("全部上传结束 =>", uploadInfo);
        }
      });
      /** 添加视频 **/
      uploader.addFile(file, null, null, null, '{"Vod":{}}');  //file就是视频文件
      /** 开始上传 **/
      uploader.startUpload();
    };
    // 删除上传的视频
    $scope.delVideo = (index) => {
      $scope.videoArr.splice(index, 1);
      $scope.videoOssArr.splice(index, 1);
      if($scope.videoArr.length<4){
      	$scope.hideUpVideoFlag = true;
      }
    };
    
    // 视频创建播放
    function videoUploadPlay () {
      let len = $scope.videoArr.length;
      let id ='J_prismPlayer'+ len;
      let vid = $scope.videoArr[len - 1].vid;
      $timeout(() => {
        let player = cjUtils.AccessVideo({
          eleId: id,
          /** 有视频id，但没有播放凭证，需要获取播放凭证 **/
          videoId: vid,
          getPlayAuthUrl: 'https://tools.cjdropshipping.com/tool/downLoad/getVideoPlayAuth',
          configuration: {
            width: '300px',     //视频宽度
            height: '160px',     //视频高度
            autoplay: false,     //是否自动播放
            isLive: false,       //是否允许直播
            rePlay: false,       //播放器自动循环播放
            playsinline: true,   //H5是否内置播放，有的Android浏览器不起作用。
            preload: true,       //播放器自动加载，目前仅h5可用
            cover: ' '           //封面，在autoplay为false时生效 注：在用videoId的时候，阿里好像会自动截取视频第一针做为封面，但是他的地址是http的，所有不要封面的话，给一个' '
          },
          callback: player => {
            console.log(player)
            erp.closeLoad();
            player.on('ready', () => {
              //视频加载完成后回调
            });
            player.on('ended', () => {
              //视频播放完成后回调
            });
          }
        })
      }, 7000)
    }

        $scope.CancleFun = function (item) {
            layer.confirm('确认要重启取消吗？', {
                btn: ['确定', '取消']//按钮
            }, function (index) {
                layer.close(index);
                //此处请求后台程序，下方是成功后的前台处理……
                var sendData = {
                    "id": item.ID,
                    "message": '',
                    "status": item.status,
                    "state": '5'
                };
                layer.load(2);
                erp.postFun('app/dispute/updateDisputeinfoStatusOfERP', JSON.stringify(sendData), function (data) {
                    if (data.data.result == true) {
                        layer.msg('操作成功');
                        getList(erp, $scope);
                    } else {
                        layer.msg('操作失败');
                    }
                    layer.closeAll('loading');
                }, function (n) {
                    console.log(n);
                    layer.closeAll('loading');
                });
            });
        }
        //打开拒绝理由
        $scope.refuseFun = function (item) {
            console.log(item);
            $('#refuseZzc').show();
            $('#refuseReason').val('');
            if (!(item.orderMoney == null || item.orderMoney == '' || item.orderMoney == undefined)) {
                $('#sureRefuse').attr('data-money', item.orderMoney);
            }
            $('#sureRefuse').attr('data-id', item.ID);
            $('#sureRefuse').attr('data-status', item.status);
        };
        //关闭决绝理由
        $('#closeRefuse').click(function () {
            $('#refuseZzc').hide();
        });
        //确认拒绝
        $('#sureRefuse').click(function () {
            var id = $(this).attr('data-id');
            var message = $('#refuseReason').val();
            var money = $(this).attr('data-money');
            var status = $(this).attr('data-status');
            if (message == null || message == '' || message == undefined) {
                layer.msg('请输入拒绝理由');
            } else {
                var data = {
                    "id": id,
                    "message": message,
                    "status": status
                };
                if (money == '' || money == undefined || money == null) {
                    data.ordermoney = '';
                } else {
                    data.ordermoney = money;
                }
                //data.state='3';
                layer.load(2);
                erp.postFun('app/dispute/refuseToERP', JSON.stringify(data), function (data) {
                    if (data.data.result == true) {
                        layer.msg('操作成功');
                        getList(erp, $scope);
                    } else {
                        layer.msg('操作失败');
                    }
                    $('#refuseZzc').hide();
                    layer.closeAll('loading');
                }, function (n) {
                    console.log(n);
                    layer.closeAll('loading');
                });
            }
        });

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
    }]);
    //erp客服--纠纷已取消
    app.controller('csdisputecloseCtrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('csdisputecloseCtrl');
        var base64 = new Base64();
        var job = base64.decode(localStorage.getItem('job') == undefined ? "" : localStorage.getItem('job'));
        $scope.job = job;
        var searchxx = sessionStorage.getItem('searchInformation');
        if (searchxx == null || searchxx == undefined || searchxx == '') {
            $scope.searchval = '';
        } else {
            $scope.searchval = searchxx;
        }
        $scope.pageSize = '20';
        $scope.pageNum = '1';
        $scope.totalNum = 0;
        $scope.totalPageNum = 0;

        $('#cebian-menu .cebian-content').on('click', 'span>a', function () {
            sessionStorage.setItem('searchInformation', $scope.searchval);
        });
        $scope.changeChina = function (text) {
            var str = changeChinese(text);
            return str;
        };
        $scope.operatorName = "";
        $scope.storeNum = '';
        $scope.storeList = gStoreList;
        function getList(erp, $scope) {
            var getListData = {};
            getListData.page = $scope.pageNum - 0;
            getListData.limit = $scope.pageSize - 0;
            getListData.code = 'erp';
            getListData.status = '5';
            getListData.type = $('.search-select').val();
            getListData.orderNumber = $scope.searchval;
            getListData.store = $scope.storeNum;
            getListData.operator = $scope.operatorName;
            getListData.trackingNumber = $scope.trackNumVal;
            erp.postFun('app/dispute/getDispute', JSON.stringify(getListData), con, errFun,{layer:true})

            function con(data) {
                console.log(data)
                $scope.ordersList = data.data.list;
                $scope.totalNum = data.data.count;//获取总订单的条数
                if(!$scope.operatorList){
                    $scope.operatorList = data.data.operatorList;
                }
                console.log($scope.totalNum)
                erp.closeLoad()
                pageFun(erp, $scope);
            }
        }

        function errFun(data) {
            console.log(data)
            erp.closeLoad()
        }

        getList(erp, $scope)
        $scope.selSearch = function(){
            console.log($scope.operatorName,$scope.storeNum)
            $scope.pageNum = '1';
            getList(erp, $scope);
        }
        //分页
        function pageFun(erp, $scope) {
            console.log($scope.totalNum)
            //if ($scope.totalNum < 1) {
            //    return;
            //}
            $(".pagination2").jqPaginator({
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
                    };
                    $scope.pageNum = n;
                    getList(erp, $scope);
                }
            });
        }

        $scope.changePageSize = function () {
            $scope.pageNum = '1';
            getList(erp, $scope);
        }
        $scope.toSpecifiedPage = function () {
            getList(erp, $scope);
        }
        $scope.linkFun = function (item) {
            var muId = item.ID;
            if(item.ID.indexOf('ZF')!=-1||item.ID.indexOf('SY')!=-1){
                window.open('#/StatusQuery' + '/' + muId)
            }else{
                window.open('#/zi-all' + '/' + muId)
            }
        }
        //搜索
        $('.top-search-inp').keypress(function (e) {
            if (e.keyCode == 13) {
                $scope.search()
            }
        })
        //$scope.searchval = '';
        $scope.search = function () {
            console.log($scope.searchval);
            $scope.pageNum = '1';
            getList(erp, $scope);
        }
        var jflx = '';
        $('.search-select').change(function () {
            $scope.pageNum = '1';
            getList(erp, $scope);
        })


        //点击消息记录
        $scope.responseMsgFun = function (item, index) {
            $scope.replayFlag = true;
            if (item.vip == 1) {
                $scope.vipFlag = true;
            } else {
                $scope.vipFlag = false;
            }
            $scope.userLeveldj = item.userLevel;
            $scope.cunLeveldj = item.cunLevel;
            $scope.moneyLeveldj = item.moneyLevel;
            $(".recordMsg").css("display", "block");
            $scope.itemId = item.ID;
            $scope.itemIndex = index;
            $scope.messageListArr = item.message;
            console.log(item)
            var messageArr = item.message;
            $scope.nowType = item.type;
            $scope.tdetailDate = item.createDate;
            $scope.detailData = item.message;//纠纷对话列表
            $scope.userName = item.userName;
            $scope.serverName = item.salesmanName;
            console.log(item.createDate.time)
            console.log($scope.nowType, $scope.tdetailDate, $scope.detailData)
            //获取客户名字的第一个字母
            $scope.cusNameFir = $scope.userName.slice(0, 1).toUpperCase();
            $scope.salseNameFir = $scope.serverName.slice(0, 1).toUpperCase();
            console.log($scope.salseNameFir, $scope.cusNameFir);
            // 创建视频
            videoList(erp, item);
        }
        //点击消息记录
        $scope.tKFun = function (item, index) {
            $scope.replayFlag = false;
            $scope.userLeveldj = item.userLevel;
            $scope.cunLeveldj = item.cunLevel;
            $scope.moneyLeveldj = item.moneyLevel;
            $(".recordMsg").css("display", "block");
            $('.how-money').show();
            $scope.itemId = item.ID;
            $scope.itemIndex = index;
            $scope.messageListArr = item.message;
            console.log(item)
            var messageArr = item.message;
            $scope.nowType = item.type;
            $scope.tdetailDate = item.createDate;
            $scope.detailData = item.message;//纠纷对话列表
            $scope.userName = item.userName;
            $scope.serverName = item.salesmanName;
            console.log(item.createDate.time)
            console.log($scope.nowType, $scope.tdetailDate, $scope.detailData)
            //获取客户名字的第一个字母
            $scope.cusNameFir = $scope.userName.slice(0, 1).toUpperCase();
            $scope.salseNameFir = $scope.serverName.slice(0, 1).toUpperCase();
            console.log($scope.salseNameFir, $scope.cusNameFir)
            // 创建视频
            videoList(erp, item);
        }
        $scope.closRrecordMsgFun = function () {
            $(".recordMsg").css("display", "none");
            $scope.replyText = '';
            $scope.imgArr = [];
        }
        //补发
        $scope.layertipFun = function () {
            layer.msg('该功能正在开发中')
        }
        //回复纠纷的按钮
        $scope.replyFun = function () {
            if ($scope.replyText) {
                layer.load(2)
                // var listArr = [];
                var listObj = {};//存储一条消息内容
                listObj.userName = '1';//业务员
                listObj.image = $scope.imgArr;
                listObj.remark = $scope.replyText;
                listObj.date = timestampToTime(new Date())
                // listArr.push(listObj);
                console.log(listObj)
                console.log(listArr)
                $scope.messageListArr.push(listObj)
                var listArr = JSON.stringify($scope.messageListArr)
                var upData = {};
                upData.id = $scope.itemId;
                upData.responseType = 'CJ';
                upData.message = listArr;
                erp.postFun('app/dispute/replyDispute', JSON.stringify(upData), function (data) {
                    console.log(data)
                    layer.closeAll('loading');
                    if (data.data.result == true || data.data.result == 200) {
                        $scope.closRrecordMsgFun();//关闭纠纷单
                        layer.msg('回复成功')
                        $scope.ordersList[$scope.itemIndex].message = $scope.messageListArr;
                        $scope.replyText = '';
                        $scope.imgArr = [];
                    } else {
                        layer.msg('回复失败')
                        // $scope.messageListArr.pop()
                    }
                }, errFun)
            } else {
                layer.msg('请输入回复的内容')
                return;
            }
        }
        $scope.sureTkFun = function () {
            if (!$scope.replyText) {
                layer.msg('请输入回复的内容')
                return;
            }
            if (!$scope.howMoney || $scope.howMoney <= 0) {
                layer.msg('请输入退款金额')
                return;
            }
            layer.load(2)
            var listObj = {};//存储一条消息内容
            listObj.userName = '1';//业务员
            listObj.image = $scope.imgArr;
            listObj.remark = $scope.replyText;
            listObj.date = timestampToTime(new Date())
            // listArr.push(listObj);
            console.log(listObj)
            console.log(listArr)
            $scope.messageListArr.push(listObj)
            var listArr = JSON.stringify($scope.messageListArr)
            var upData = {};
            upData.id = $scope.itemId;
            upData.responseType = 'CJ';
            upData.money = $scope.howMoney;
            upData.message = listArr;
            erp.postFun('app/dispute/replyDispute', JSON.stringify(upData), function (data) {
                console.log(data)
                layer.closeAll('loading');
                if (data.data.result == true || data.data.result == 200) {
                    $scope.closRrecordMsgFun();//关闭纠纷单
                    layer.msg('回复退款成功')
                    $scope.ordersList[$scope.itemIndex].message = $scope.messageListArr;
                    $scope.replyText = '';
                    $scope.howMoney = '';
                    $scope.imgArr = [];
                } else {
                    layer.msg('回复退款失败')
                    // $scope.messageListArr.pop()
                }
            }, errFun)
        }
        //点击上传的图片显示大图
        $scope.viewBigImg = function (item) {
            $scope.viewImgFlag = true;
            $scope.bigImgSrc = item;
            console.log(item)
        }
        $scope.closePreImg = function () {
            $scope.viewImgFlag = false;
        }
        //显示更多操作
        $('.morefun-div').mouseenter(function () {
            $('.more-selul').show();
        });
        $('.morefun-div').mouseleave(function () {
            $('.more-selul').hide();
        });

        $scope.imgArr = [];
        $scope.upLoadImg4 = function (files) {
            erp.ossUploadFile($('#file')[0].files, function (data) {
                console.log(data)
                if (data.code == 0) {
                    layer.msg('上传失败');
                    return;
                }
                if (data.code == 2) {
                    layer.msg('部分图片上传失败');
                }
                var result = data.succssLinks;
                console.log(result)
                var filArr = [];
                for (var j = 0; j < result.length; j++) {
                    var srcList = result[j].split('.');
                    var fileName = srcList[srcList.length - 1].toLowerCase();
                    console.log(fileName)
                    if (fileName == 'png' || fileName == 'jpg' || fileName == 'jpeg' || fileName == 'gif') {
                        $scope.imgArr.push(result[j]);
                    }
                }
                // $scope.imgArr = filArr;
                console.log($scope.imgArr)
                $scope.$apply();
            })
        }

        //重开纠纷-田育宇-2019-1-18
        $scope.continueDispute = function (item, index) {
            layer.confirm('确认要重开纠纷吗？', {
                btn: ['确定', '取消']//按钮
            }, function (index) {
                layer.close(index);
                var data = {
                    id: item.ID
                }
                layer.load(2);
                if(item.otype==3){
                  erp.postFun('app/dispute/reopenDispute', JSON.stringify(data), function (data) {
                    console.log(data)
                    layer.closeAll('loading');
                    if (data.data.result == true) {
                        layer.msg('纠纷重开成功');
                        getList(erp, $scope);
                    } else {
                        layer.msg('纠纷重开失败')
                        // $scope.messageListArr.pop()
                    }
                  }, errFun)
                }else{
                  erp.postFun('app/dispute/continueDispute', JSON.stringify(data), function (data) {
                    console.log(data)
                    layer.closeAll('loading');
                    if (data.data.result == true) {
                        layer.msg('纠纷重开成功');
                        getList(erp, $scope);
                    } else {
                        layer.msg('纠纷重开失败')
                        // $scope.messageListArr.pop()
                    }
                  }, errFun)
                }
                
            });
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
    }])
    //erp客服--纠纷已完成
    app.controller('csdisputeoverCtrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('csdisputeoverCtrl');
        var base64 = new Base64();
        var job = base64.decode(localStorage.getItem('job') == undefined ? "" : localStorage.getItem('job'));
        $scope.job = job;
        var searchxx = sessionStorage.getItem('searchInformation');
        if (searchxx == null || searchxx == undefined || searchxx == '') {
            $scope.searchval = '';
        } else {
            $scope.searchval = searchxx;
        }
        $scope.pageSize = '20';
        $scope.pageNum = '1';
        $scope.totalNum = 0;
        $scope.totalPageNum = 0;

        $scope.classStatus = function (message) {
            if (message == null || message == '' || message == undefined) {
                return 1;
            } else {
                return 2;
            }
        };
        $scope.classRefuse = function (refuse) {
            if (refuse == '' || refuse == null || refuse == undefined) {
                return '--';
            } else {
                return refuse;
            }
        }
        $('#cebian-menu .cebian-content').on('click', 'span>a', function () {
            sessionStorage.setItem('searchInformation', $scope.searchval);
        });
        $scope.changeChina = function (text) {
            var str = changeChinese(text);
            return str;
        };
        $scope.operatorName = "";
        $scope.storeNum = '';
        $scope.storeList = gStoreList;
        function getList(erp, $scope) {
            erp.load()
            var getListData = {};
            getListData.page = $scope.pageNum - 0;
            getListData.limit = $scope.pageSize - 0;
            getListData.code = 'erp';
            getListData.status = '3';
            getListData.type = jflx;
            getListData.beginDate = $('#jufenb-data-time').val();
            getListData.endDate = $('#jufene-data-time').val();
            getListData.orderBeginDate = $('#ordb-data-time').val();
            getListData.orderendDate = $('#orde-data-time').val();
            getListData.name = $scope.ywyName;
            getListData.orderNumber = $scope.searchval;
            getListData.store = $scope.storeNum;
            getListData.operator = $scope.operatorName;
            getListData.trackingNumber = $scope.trackNumVal;
            erp.postFun('app/dispute/getDispute', JSON.stringify(getListData), con, errFun,{layer:true})

            function con(data) {
                console.log(data)
                $scope.ordersList = data.data.list;
                $scope.totalNum = data.data.count;//获取总订单的条数
                if(!$scope.operatorList){
                    $scope.operatorList = data.data.operatorList;
                }
                erp.closeLoad()
                pageFun(erp, $scope);
            }
        }

        function errFun(data) {
            console.log(data)
            erp.closeLoad()
        }

        getList(erp, $scope)
        $scope.selSearch = function(){
            $scope.pageNum = '1';
            getList(erp, $scope);
        }
        //获取业务员
        erp.postFun('app/dispute/getDisputeEmployee', {}, function (data) {
            var list = data.data.list;

            // console.log($scope.ywyList);
            $.each(list, function (i, v) {
                if (v.NAME == '王能彬' || v.NAME == 'Tina' || v.NAME == '金林杰' || v.NAME == '詹雯瑾' || v.NAME == '陆依婷' || v.NAME == '方佳' || v.NAME == '金淑华' || v.NAME == '陈宁宁' || v.NAME == '田倩' || v.NAME == '吴诗林' || v.NAME == '高晨琦' || v.NAME == '朱小冬' || v.NAME == 'Lynn' || v.NAME == '张晶晶' || v.NAME == '陈磊刚' || v.NAME == '聂德宁' || v.NAME == '郑尹尤' || v.NAME == '赵如心' || v.NAME == '杨喜发') {
                    list.splice(i, 1);
                    list.unshift(v);
                }
            })
            console.log(list);
            $scope.ywyList = list;
        }, function (data) {
            console.log(data)
        })
        $scope.seachTimeFun = function () {
            $scope.pageNum = '1';
            getList(erp, $scope);
        }
        $scope.ywySelFun = function () {
            $scope.pageNum = '1';
            getList(erp, $scope);
        }
        $scope.daochuFun = function () {
            if ($scope.totalNum > 0) {
                $scope.isdcFlag = true;
            } else {
                layer.msg('当前纠纷列表没有数据可以导出')
            }
        }
        $scope.suredcFun = function () {
            erp.load()
            var getListData = {};
            getListData.page = $scope.pageNum - 0;
            getListData.limit = $scope.pageSize - 0;
            getListData.code = 'erp';
            getListData.status = '3';
            getListData.type = jflx;
            getListData.beginDate = $('#jufenb-data-time').val();
            getListData.endDate = $('#jufene-data-time').val();
            getListData.orderBeginDate = $('#ordb-data-time').val();
            getListData.orderendDate = $('#orde-data-time').val();
            getListData.name = $scope.ywyName;
            getListData.orderNumber = $scope.searchval;
            // getListData.store = $scope.storeNum;
            // getListData.operator = $scope.operatorName;
            erp.postFun('app/client_erp/exportDispute', JSON.stringify(getListData), function (data) {
                console.log(data)
                if (data.data.statusCode == 200) {
                    var result = JSON.parse(data.data.result)
                    $scope.isdcFlag = false;
                    $scope.excelFlag = true;
                    $scope.excelLink = result.href;
                } else {
                    layer.msg(data.data.message)
                }
                erp.closeLoad()
            }, function (data) {
                console.log(data)
                erp.closeLoad()
            })
        }
        //分页
        function pageFun(erp, $scope) {
            console.log($scope.totalNum)
            //if ($scope.totalNum < 1) {
            //    return;
            //}
            $(".pagination2").jqPaginator({
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
                    $scope.pageNum = n;
                    getList(erp, $scope);
                }
            });
        }

        $scope.changePageSize = function () {
            $scope.pageNum = '1';
            getList(erp, $scope);
        }
        $scope.toSpecifiedPage = function () {
            getList(erp, $scope);
        }
        $scope.linkFun = function (item) {
            var muId = item.ID;
            if(item.ID.indexOf('ZF')!=-1||item.ID.indexOf('SY')!=-1){
                window.open('#/StatusQuery' + '/' + muId)
            }else{
                window.open('#/zi-all' + '/' + muId)
            }
        }
        //搜索
        $('.top-search-inp').keypress(function (e) {
            if (e.keyCode == 13) {
                $scope.search()
            }
        })
        //$scope.searchval = '';
        $scope.search = function () {
            console.log($scope.searchval);
            $scope.pageNum = '1';
            getList(erp, $scope);
        }
        var jflx = '';
        $('.search-select').change(function () {
            erp.load();
            jflx = $(this).val();
            console.log(jflx)
            $scope.pageNum = '1';
            getList(erp, $scope);
        })
        $('.recordMsg-word').on('click', 'a', function (e) {
            e.preventDefault();
            $(this).addClass('active').siblings('.active').removeClass('active');
            var id = '#' + $(this).attr('href');
            $(id).show().siblings('.recordMsg-content').hide();
        });
        function getRefundInfo(id) {
          erp.postFun('app/dispute/getRefundInfo', {
            id
          }, res => {
            // console.log(res);
            const {
              data,
              status
            } = res;
            if (status != 200) return layer("信息获取失败！");
            // data.dispute = {...data.dispute, ...JSON.parse(data.dispute.refund_amount_record)}
            data.dispute.refund_amount_record = JSON.parse(data.dispute.refund_amount_record);
            console.log("退款详情信息\n", data);
            $scope.refundInfo = data;
          })
        }
        //点击查看
        $scope.responseMsgFun = function (item, index) {
            $scope.refundStatus = item.refund_status;
            getRefundInfo(item.ID);
            $scope.replayFlag = true;
            if (item.vip == 1) {
                $scope.vipFlag = true;
            } else {
                $scope.vipFlag = false;
            }
            $scope.userLeveldj = item.userLevel;
            $scope.cunLeveldj = item.cunLevel;
            $scope.moneyLeveldj = item.moneyLevel;
            $(".recordMsg").css("display", "block");
            var target = $('.recordMsg-word').find('a').eq(0);
            target.addClass('active').siblings('.active').removeClass('active');
            var tid = '#' + target.attr('href');
            $(tid).show().siblings('.recordMsg-content').hide();
            $scope.itemId = item.ID;
            $scope.itemIndex = index;
            $scope.messageListArr = item.message;
            $scope.disputeRate = item.disputeRate;
            console.log(item)
            var messageArr = item.message;
            $scope.agreeTkMoney = item.money;
            $scope.nowType = item.type;
            $scope.tdetailDate = item.createDate;
            $scope.detailData = item.message;//纠纷对话列表
            $scope.userName = item.userName;
            $scope.serverName = item.salesmanName;
            console.log(item.createDate.time)
            console.log($scope.nowType, $scope.tdetailDate, $scope.detailData)
            //获取客户名字的第一个字母
            $scope.cusNameFir = $scope.userName.slice(0, 1).toUpperCase();
            $scope.salseNameFir = $scope.serverName.slice(0, 1).toUpperCase();
            console.log($scope.salseNameFir, $scope.cusNameFir)
            // 创建视频
            videoList(erp, item);
            var bfData = {};
            bfData.id = item.ID;
            bfData.type = 'erp';
            erp.postFun('app/dispute/getOrderAddress', JSON.stringify(bfData), function (data) {
                console.log(data)
                // console.log(data.data.address.id)
                var resObj = data.data.address;
                console.log(data.data)
                if(data.data.hasOwnProperty('deliverCode')) {
                    $scope.deliverCode = data.data.deliverCode;
                } else {
                    $scope.deliverCode = "CN"
                }
                // 没有商品详情给注释掉----创建视频时注册
                if (resObj && resObj.id) {
                    $scope.productList = data.data.products;//商品列表
                    $scope.recoCity = resObj.city;
                    $scope.recoProvin = resObj.province;
                    $scope.recoCountrycode = resObj.countryCode;
                    $scope.recoCustomerName = resObj.customerName;
                    $scope.recoShippingAddress = resObj.shippingAddress;
                    $scope.recoShippingAddress2 = resObj.shippingaddress2;
                    $scope.recoZip = resObj.zip;
                } else {
                }
            }, function (data) {
                console.log(data)
            })
        }
        //点击消息记录
        $scope.tKFun = function (item, index) {
            $scope.replayFlag = false;
            $scope.userLeveldj = item.userLevel;
            $scope.cunLeveldj = item.cunLevel;
            $scope.moneyLeveldj = item.moneyLevel;
            $(".recordMsg").css("display", "block");
            $('.how-money').show();
            $scope.itemId = item.ID;
            $scope.itemIndex = index;
            $scope.messageListArr = item.message;
            $scope.disputeRate = item.disputeRate;
            console.log(item)
            var messageArr = item.message;
            $scope.nowType = item.type;
            $scope.tdetailDate = item.createDate;
            $scope.detailData = item.message;//纠纷对话列表
            $scope.userName = item.userName;
            $scope.serverName = item.salesmanName;
            console.log(item.createDate.time)
            console.log($scope.nowType, $scope.tdetailDate, $scope.detailData)
            //获取客户名字的第一个字母
            $scope.cusNameFir = $scope.userName.slice(0, 1).toUpperCase();
            $scope.salseNameFir = $scope.serverName.slice(0, 1).toUpperCase();
            console.log($scope.salseNameFir, $scope.cusNameFir)
            // 创建视频
            videoList(erp, item);
        }
        $scope.closRrecordMsgFun = function () {
            $(".recordMsg").css("display", "none");
            $scope.replyText = '';
            $scope.imgArr = [];
        }
        //补发
        $scope.layertipFun = function () {
            layer.msg('该功能正在开发中')
        }
        //回复纠纷的按钮
        $scope.replyFun = function () {
            if ($scope.replyText) {
                layer.load(2)
                // var listArr = [];
                var listObj = {};//存储一条消息内容
                listObj.userName = '1';//业务员
                listObj.image = $scope.imgArr;
                listObj.remark = $scope.replyText;
                listObj.date = timestampToTime(new Date())
                // listArr.push(listObj);
                console.log(listObj)
                console.log(listArr)
                $scope.messageListArr.push(listObj)
                var listArr = JSON.stringify($scope.messageListArr)
                var upData = {};
                upData.id = $scope.itemId;
                upData.responseType = 'CJ';
                upData.message = listArr;
                erp.postFun('app/dispute/replyDispute', JSON.stringify(upData), function (data) {
                    console.log(data)
                    layer.closeAll('loading');
                    if (data.data.result == true || data.data.result == 200) {
                        $scope.closRrecordMsgFun();//关闭纠纷单
                        layer.msg('回复成功')
                        $scope.ordersList[$scope.itemIndex].message = $scope.messageListArr;
                        $scope.replyText = '';
                        $scope.imgArr = [];
                    } else {
                        layer.msg('回复失败')
                        // $scope.messageListArr.pop()
                    }
                }, errFun)
            } else {
                layer.msg('请输入回复的内容')
                return;
            }
        }
        $scope.sureTkFun = function () {
            if (!$scope.replyText) {
                layer.msg('请输入回复的内容')
                return;
            }
            if (!$scope.howMoney || $scope.howMoney <= 0) {
                layer.msg('请输入退款金额')
                return;
            }
            layer.load(2)
            var listObj = {};//存储一条消息内容
            listObj.userName = '1';//业务员
            listObj.image = $scope.imgArr;
            listObj.remark = $scope.replyText;
            listObj.date = timestampToTime(new Date())
            // listArr.push(listObj);
            console.log(listObj)
            console.log(listArr)
            $scope.messageListArr.push(listObj)
            var listArr = JSON.stringify($scope.messageListArr)
            var upData = {};
            upData.id = $scope.itemId;
            upData.responseType = 'CJ';
            upData.money = $scope.howMoney;
            upData.message = listArr;
            erp.postFun('app/dispute/replyDispute', JSON.stringify(upData), function (data) {
                console.log(data)
                layer.closeAll('loading');
                if (data.data.result == true || data.data.result == 200) {
                    $scope.closRrecordMsgFun();//关闭纠纷单
                    layer.msg('回复退款成功')
                    $scope.ordersList[$scope.itemIndex].message = $scope.messageListArr;
                    $scope.replyText = '';
                    $scope.howMoney = '';
                    $scope.imgArr = [];
                } else {
                    layer.msg('回复退款失败')
                    // $scope.messageListArr.pop()
                }
            }, errFun)
        }
        //点击上传的图片显示大图
        $scope.viewBigImg = function (item) {
            $scope.viewImgFlag = true;
            $scope.bigImgSrc = item;
            console.log(item)
        }
        $scope.closePreImg = function () {
            $scope.viewImgFlag = false;
        }
        //显示更多操作
        $('.morefun-div').mouseenter(function () {
            $('.more-selul').show();
        });
        $('.morefun-div').mouseleave(function () {
            $('.more-selul').hide();
        });

        $scope.imgArr = [];
        $scope.upLoadImg4 = function (files) {
            erp.ossUploadFile($('#file')[0].files, function (data) {
                console.log(data)
                if (data.code == 0) {
                    layer.msg('上传失败');
                    return;
                }
                if (data.code == 2) {
                    layer.msg('部分图片上传失败');
                }
                var result = data.succssLinks;
                console.log(result)
                var filArr = [];
                for (var j = 0; j < result.length; j++) {
                    var srcList = result[j].split('.');
                    var fileName = srcList[srcList.length - 1].toLowerCase();
                    console.log(fileName)
                    if (fileName == 'png' || fileName == 'jpg' || fileName == 'jpeg' || fileName == 'gif') {
                        $scope.imgArr.push(result[j]);
                    }
                }
                // $scope.imgArr = filArr;
                console.log($scope.imgArr)
                $scope.$apply();
            })
        }

        //重开纠纷-田育宇-2019-1-18
        $scope.continueDispute = function (item, index) {
            layer.confirm('确认要重开纠纷吗？', {
                btn: ['确定', '取消']//按钮
            }, function (index) {
                layer.close(index);
                var data = {
                    id: item.ID
                }
                layer.load(2);
                if(item.otype==3){
                  erp.postFun('app/dispute/reopenDispute', JSON.stringify(data), function (data) {
                    console.log(data)
                    layer.closeAll('loading');
                    if (data.data.result == true) {
                        layer.msg('纠纷重开成功');
                        getList(erp, $scope);
                    } else {
                        layer.msg('纠纷重开失败')
                        // $scope.messageListArr.pop()
                    }
                  }, errFun)
                }else{
                  erp.postFun('app/dispute/continueDispute', JSON.stringify(data), function (data) {
                    console.log(data)
                    layer.closeAll('loading');
                    if (data.data.result == true) {
                        layer.msg('纠纷重开成功');
                        getList(erp, $scope);
                    } else {
                        layer.msg('纠纷重开失败')
                        // $scope.messageListArr.pop()
                    }
                  }, errFun)
                }
            });
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

    }])
    //erp客服--通知
    app.controller('sysmessagectrl', ['$scope', '$routeParams', 'erp', function ($scope, $routeParams, erp) {
        console.log('sysmessagectrl');
        $scope.closeFun = function () {
            location.href = "#/erpservice/tz";
        }
        var yearArr = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
        // 书签
        $scope.type = $routeParams.type || '';
        console.log($scope.type);
        if ($scope.type == 1) {
            var obj = JSON.parse(sessionStorage.getItem('tz'))
            console.log(obj)
            $scope.id = obj.ID;
            $scope.title2 = obj.notificationType;
            $scope.templatetitle = obj.info;
            $scope.tzurl = 'http://' + obj.notificationUrl;
            erp.postFun('app/notification/analysishtml', { 'data': "{'url':'" + $scope.tzurl + "'}" }, draf, err)

            function draf(n) {
                console.log(n)
                editor.txt.html(n.data.result)
            }

            // $('#wang').load('https://'+obj.notificationUrl)
            // $http.jsonp('https://'+obj.notificationUrl, null).then(a, a);
            // function a(n){
            //     console.log(n)
            // }
            // editor.txt.html(obj.TemplateContent)
            $scope.tzname = obj.title;
        }
        if ($scope.type == 1) {
            erp.postFun('app/notification/updatedetaill', {
                'data': "{'info':'" + $scope.templatetitle + "','id':'" + $scope.id + "','title':'" + $scope.tzname + "'}",
                'html': editor.txt.html()
            }, con2, err)
        }
        // 商品描述 富文本编辑器用户输入值
        var E = window.wangEditor

        var editor = new E('#wang');
        editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
        editor.create();
        //小叉显示隐藏
        $scope.test = function ($event) {
            // console.log($($event.target).find('span'))
            $($event.target).find('span').css('display', 'block')
        }
        $scope.test2 = function ($event) {
            // console.log($($event.target).find('span'))
            $($event.target).find('span').css('display', 'none')
        }
        //删除用户
        $scope.deleteuser = function (item) {
            $scope.userarr.splice($scope.userarr.indexOf(item), 1)
        }
        //获取类型
        $scope.gettype = function () {
            console.log($scope.title)
            erp.postFun('app/notification/gettype', { 'data': "{'type':'" + $scope.title + "'}" }, con2, err)

            function con2(n) {
                console.log(JSON.parse(n.data.result));
                $scope.typearr = JSON.parse(n.data.result)
                console.log($scope.typearr)
                if ($scope.typearr.length == 0) {
                    layer.msg('当前类型没有模板');
                }
            }
        }
        //获取模板
        $scope.typenameget = function (typename) {
            console.log(typename)
            $scope.templatetitle = typename.TemplateTitle;
            editor.txt.html(typename.TemplateContent)
        }
        //获取用户列表
        $scope.userget = function () {
            console.log($scope.username)
            if ($scope.username == '') {
                $scope.userlist = []
                return false;
            }
            erp.postFun('app/account/proList', { 'data': "{'inputStr':'" + $scope.username + "'}" }, con3, err)

        }

        function con3(n) {
            $scope.userlist = JSON.parse(n.data.result)
            console.log($scope.userlist)
        }

        //获取所以用户
        $scope.sendtype = 1;
        $scope.getalluser = function () {
            $scope.sendtype = 0;
            // erp.postFun('app/account/proList',{'data':"{'inputStr':''}"},con3,err)
        }
        //选择用户
        $scope.userarr = [];
        $scope.userstr = '';
        $scope.idstr = '';
        // $scope.alluser={};
        $scope.sendtype = 1;
        $scope.getuser = function (item) {
            $scope.sendtype = 1;
            console.log(item)
            var addIndex = erp.findIndexByKey($scope.userarr, 'id', item.id);
            if (addIndex == -1) {
                $scope.userarr.push(item);
            }
            // if($scope.userarr.indexOf(item)==-1){
            //     $scope.userarr.push(item);
            // }else{
            //     return false;
            // }
        }
        $scope.getFinUsr = function () {
            $scope.userstr = '';
            $scope.idstr = '';
            var arr = []
            for (var i = 0; i < $scope.userarr.length; i++) {
                $scope.userstr += $scope.userarr[i].name + ';';
                arr.push($scope.userarr[i].id);
            }
            $scope.idstr = arr.join(',')
            console.log($scope.userstr, $scope.idstr);
            return $scope.idstr;
        }
        //发送
        $scope.gethtml = function () {
            if (!$scope.templatetitle) {
                layer.msg('请填写简略');
                return;
            }
            if (!editor.txt.text()) {
                layer.msg('请填写正文内容');
                return;
            }
            console.log(editor.txt.html(), $scope.title)
            layer.open({
                type: 1,
                area: ['800px', '600px'],
                skin: 'preview-noti',
                shadeClose: true, //点击遮罩关闭
                title: '预览',
                content: '<div class="preview-noti-box"><p class="preview-noti-jianlue"><span>简略：</span>' + $scope.templatetitle + '</p><div class="preview-noti-con"><span>正文：</span>' + editor.txt.html() + '</div></div>',
                btn: ['发送', '定时发送', '存草稿', '取消'],
                btn1: function (index, layero) {
                    if (!$scope.title) {
                        layer.msg('请选择通知类型');
                        return;
                    }
                    if ($scope.sendtype == 1 && $scope.userarr.length == 0) {
                        layer.msg('请选择发送用户');
                        return;
                    }
                    erp.load()
                    $scope.idstr = $scope.getFinUsr();
                    if ($scope.sendtype == 0) {
                        $scope.idstr = '';
                    }
                    erp.postFun('app/notification/sendnotification', {
                        'data': "{'templateTitle':'" + $scope.title + "','relationType':'" + $scope.sendtype + "','relationId':'" + $scope.idstr + "','info':'" + $scope.templatetitle + "','status':'1','date':'" + $scope.sendtime + "'}",
                        'html': editor.txt.html().replace(/"/g, "'").replace("\n", "<br>")
                    }, function (data) {
                        var data = data.data;
                        erp.closeLoad()
                        console.log(data);
                        if (data.statusCode != 200) {
                            layer.msg('发送失败');
                            layer.close(index);
                            return;
                        }
                        layer.msg('发送成功', { time: 1000 }, function () {
                            layer.close(index);
                            window.location.href = 'manage.html#/erpservice/tz';
                            // window.location.reload();
                        });

                    }, err)
                    console.log(editor.txt.html())
                },
                btn2: function (index, layero) {
                    console.log(editor.txt.html())

                    // alert(666)
                    layer.open({
                        title: null,
                        type: 1,
                        area: ['788px', '292px'],
                        skin: 'layer-tc',
                        closeBtn: 0,
                        content: '<div class="erp-mes-tc">'
                            + '<div class="erp-tc-top">'
                            + '<p>定时发送</p>'
                            + '</div>'
                            + '<div class="erp-tc-mid">'
                            + '<span class="erp-tc-tspan">选择定时发送的时间:</span>'
                            + '<select class="erp-select-year  erp-time-select">'

                            + '</select>'
                            + '<span class="erp-text-s">年</span>'
                            + '<select class="erp-select-month erp-time-select"></select>'
                            + '<span class="erp-text-s">月</span>'
                            + '<select class="erp-select-date erp-time-select"></select>'
                            + '<span class="erp-text-s">日</span>'
                            + '<select class="erp-select-hour erp-time-select"></select>'
                            + '<span class="erp-text-s">时</span>'
                            + '<select class="erp-select-minute erp-time-select"></select>'
                            + '<span class="erp-text-s">分</span>'
                            + '</div>'
                            + '<p class="erp-send-time">'
                            + '<span class="erp-send-s1">本邮件将在2017年1月1日0:0投递到对方收件箱。</span>'
                            + '</p>'
                            + '</div>',
                        btn: ['取消', '发送'],
                        success: function (layero, index) {
                            // var now = new Date();
                            // var year = now.getFullYear();       //年
                            // var month = now.getMonth() + 1;     //月
                            // var day = now.getDate();
                            for (var i = 0; i < yearArr.length; i++) {
                                $(layero).find('.erp-select-year').append("<option>" + yearArr[i] + "</option>");
                            }
                            for (var i = 1; i < 13; i++) {
                                $(layero).find('.erp-select-month').append("<option>" + i + "</option>");
                            }
                            for (var i = 1; i < 32; i++) {
                                $(layero).find('.erp-select-date').append("<option>" + i + "</option>");
                            }
                            for (var i = 0; i < 60; i++) {
                                $(layero).find('.erp-select-hour').append("<option>" + i + "</option>");
                            }
                            for (var i = 0; i < 60; i++) {
                                $(layero).find('.erp-select-minute').append("<option>" + i + "</option>");
                            }
                            $(layero).find('.erp-time-select').on('change', function () {
                                // console.log( $(layero).find('.erp-select-year').val(),$(layero).find('.erp-select-month').val(),$(layero).find('.erp-select-date').val(),$(layero).find('.erp-select-hour').val(),$(layero).find('.erp-select-minute').val())
                                $(layero).find('.erp-send-s1').text('本邮件将在' + $(layero).find('.erp-select-year').val() + '年' + $(layero).find('.erp-select-month').val() + '月' + $(layero).find('.erp-select-date').val() + '日' + $(layero).find('.erp-select-hour').val() + ':' + $(layero).find('.erp-select-minute').val() + '投递到对方收件箱。')
                            })
                        },
                        yes: function (index, layero) {
                            // erp.postFun('app/notification/sendnotification',{'data':"{'templateContent':'"+editor.txt.html()+"','templateTitle':'"+$scope.title+"','relationType':'"+$scope.sendtype+"','relationId':'"+ $scope.idstr+"','status':'1','num':''}"},con,err)
                            layer.close(index);
                        },
                        btn2: function (index, layero) {
                            if (!$scope.title) {
                                layer.msg('请选择通知类型');
                                return;
                            }
                            if ($scope.sendtype == 1 && $scope.userarr.length == 0) {
                                layer.msg('请选择发送用户');
                                return;
                            }
                            if (!$scope.templatetitle) {
                                layer.msg('请填写简略');
                                return;
                            }
                            $scope.idstr = $scope.getFinUsr();
                            if ($scope.sendtype == 0) {
                                $scope.idstr = '';
                            }

                            $scope.sendtime = $(layero).find('.erp-select-year').val() + '-' + $(layero).find('.erp-select-month').val() + '-' + $(layero).find('.erp-select-date').val() + ' ' + $(layero).find('.erp-select-hour').val() + ':' + $(layero).find('.erp-select-minute').val();
                            erp.postFun('app/notification/sendnotification', {
                                'data': "{'templateTitle':'" + $scope.title + "','relationType':'" + $scope.sendtype + "','relationId':'" + $scope.idstr + "','info':'" + $scope.templatetitle + "','status':'2','date':'" + $scope.sendtime + "'}",
                                'html': editor.txt.html().replace(/"/g, "'")
                            }, function (data) {
                                var data = data.data;
                                console.log(data);
                                if (data.statusCode != 200) {
                                    layer.msg('操作失败');
                                    layer.close(index);
                                    return;
                                }
                                layer.msg('操作成功', { time: 1000 }, function () {
                                    layer.close(index);
                                    window.location.href = 'manage.html#/erpservice/tz';
                                    // window.location.reload();
                                });

                            }, err)
                            // console.log($scope.sendtime);
                            layer.close(index);
                            //开启该代码可禁止点击该按钮关闭
                        }

                    })
                    layer.close(index);
                },
                btn3: function (index, layero) {
                    layer.msg('草稿箱功能暂时不可用！');
                    // if (!$scope.title) {
                    //     layer.msg('请选择通知类型');
                    //     return;
                    // }
                    // if ($scope.sendtype == 1 && $scope.userarr.length == 0) {
                    //     layer.msg('请选择发送用户');
                    //     return;
                    // }
                    // if (!$scope.templatetitle) {
                    //     layer.msg('请填写简略');
                    //     return;
                    // }
                    // $scope.idstr = $scope.getFinUsr();
                    // if ($scope.sendtype == 0) {
                    //     $scope.idstr = '';
                    // }
                    // erp.postFun('app/notification/sendnotification',{'data':"{'templateTitle':'"+$scope.title+"','relationType':'"+$scope.sendtype+"','relationId':'"+ $scope.idstr+"','info':'"+$scope.templatetitle+"','status':'3'}",'html': editor.txt.html().replace(/"/g,"'")},function (data){
                    //         var data = data.data;
                    //         console.log(data);
                    //         if (data.statusCode != 200) {
                    //             layer.msg('保存失败');
                    //             layer.close(index);
                    //             return;
                    //         }
                    //         layer.msg('保存成功',{time: 1000}, function () {
                    //             layer.close(index);
                    //             window.location.reload();
                    //         });

                    //     },err)
                    // console.log(editor.txt.html())
                    return false;
                },
                btn4: function (index, layero) {
                    layer.close(index);
                }
            })


        }

        function con(data, index) {
            console.log(data.data)
            layer.msg('发送成功');
            layer.close(index);
            // layer.close(index);
        }

        function err(data) {
            layer.msg('网络错误');
            erp.closeLoad()
        }

        //var monthArr =[1,2,3,4,5,6,7,8,9,10,11,12];
        //var dateArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,
        //19,20,21,22,23,24,25,26,27,28,29,30,31];
        // 商品描述 富文本编辑器用户输入值
        // var editor = new wangEditor('editor-trigger');
        // editor.config.menus = [
        //             // '|',     // '|' 是菜单组的分割线
        //             'fontsize',
        //             'bold',
        //             'italic',
        //             'underline',
        //             'alignleft',
        //             'aligncenter',
        //             'alignright',
        //             'forecolor',
        //             'image',
        //             'link',
        //             'emoticon'
        //           ];
        // // editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
        // editor.create();
        // $scope.editorContent = editor.$txt.html();
        // alert(121)
        //给定时发送添加事件
        $('.sel-time-btn').click(function () {
        })

        // })
    }])
    //    erp--新增通知模板v
    app.controller('sysmessageaddctrl', ['$scope', 'erp', '$routeParams', '$location', '$http', function ($scope, erp, $routeParams, $location, $http) {
        console.log('sysmessageaddctrl')
        var E = window.wangEditor

        var editor = new E('#wang');
        editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
        editor.create();
        // 书签
        $scope.title = '';
        $scope.type = $routeParams.type || '';
        console.log($scope.type)
        if ($scope.type == 1) {
            var obj = JSON.parse(sessionStorage.getItem('template'))
            console.log(obj)
            $scope.id = obj.ID;
            $scope.title = obj.templateType;
            $scope.templatetitle = obj.TemplateTitle;
            editor.txt.html(obj.TemplateContent)
            $scope.tzname = obj.TemplateName;
        }

        //close
        $scope.close = function () {
            console.log($("#ffff").text());
            location.href = "#/erpservice/tztemplet";
        }
        //发送
        $scope.gethtml = function () {
            if (!editor.txt.text()) {
                layer.msg('请填写正文内容');
                return;
            }
            console.log(editor.txt.html().replace(/'/g, '&apos;'), $scope.title)
            layer.open({
                type: 1,
                area: ['800px', '600px'],
                shadeClose: true, //点击遮罩关闭
                title: '预览',
                content: '<div style="padding:20px;">' + editor.txt.html().replace(/'/g, '&apos;') + '</div>',
                btn: ['保存', '取消'],
                btn1: function (index, layero) {
                    if (!$scope.title) {
                        layer.msg('请选择通知类型');
                        return;
                    }
                    if (!$scope.tzname) {
                        layer.msg('请填写模板名字');
                        return;
                    }
                    if (!$scope.templatetitle) {
                        layer.msg('请填写简略');
                        return;
                    }
                    console.log(editor.txt.html())
                    if ($scope.type == 0) {
                        erp.postFun('app/notification/savetemplate', { 'data': "{'templateTitle':'" + $scope.templatetitle + "','templateType':'" + $scope.title + "','templateName':'" + $scope.tzname + "','templateContent':'" + editor.txt.html().replace(/'/g, '&apos;') + "'}" }, function (data) {
                            var data = data.data;
                            console.log(data);
                            if (data.statusCode != 200) {
                                layer.msg('添加失败');
                                layer.close(index);
                                return;
                            }
                            layer.msg('添加成功', { time: 1000 }, function () {
                                layer.close(index);
                                $location.path('/erpservice/tztemplet')
                            });
                        }, err)
                    } else if ($scope.type == 1) {
                        erp.postFun('app/notification/updatetemplate', { 'data': "{'templateTitle':'" + $scope.templatetitle + "','id':'" + $scope.id + "','templateType':'" + $scope.title + "','templateName':'" + $scope.tzname + "','templateContent':'" + editor.txt.html() + "'}" }, function (data) {
                            var data = data.data;
                            console.log(data);
                            if (data.statusCode != 200) {
                                layer.msg('添加失败');
                                layer.close(index);
                                return;
                            }
                            layer.msg('添加成功', { time: 1000 }, function () {
                                layer.close(index);
                                $location.path('/erpservice/tztemplet')
                            });
                        }, err)
                    }
                    layer.close(index);
                },
                btn2: function (index, layero) {
                    layer.close(index);

                    // alert(666)
                    return false;
                }
            })


        }

        function con(data) {
            layer.msg('成功添加')
            console.log(data)
        }

        function con2(data) {
            layer.msg('成功修改')
            $location.path('/erpservice/tztemplet')
            console.log(data)
        }

        function err(data) {
            layer.msg('网络错误');
        }
    }])
    //erp--模板列表
    app.controller('tztempletctrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        console.log('tztempletctrl')
        $scope.pagesize = '20';
        $scope.pagenum = '1';
        $scope.pagearr = [1, 3, 5, 10];
        //条数改变
        $scope.pagesizechange = function (n) {
            $scope.pagesize = n;
            if (!$scope.userinfo) {
                $scope.userinfo = '';
            }
            erp.postFun('app/notification/gettemplatelist', { 'data': "{'pageSize':'" + $scope.pagesize + "','name':'" + $scope.userinfo + "','pageNum':'1'}" }, con, err)
        }
        //页码跳转
        $scope.pagenumchange = function () {
            console.log($scope.pagenum)
            if (!$scope.userinfo) {
                $scope.userinfo = '';
            }
            erp.postFun('app/notification/gettemplatelist', { 'data': "{'pageSize':'" + $scope.pagesize + "','pageNum':'" + $scope.pagenum + "','name':'" + $scope.userinfo + "'}" }, con, err)
        }
        erp.postFun('app/notification/gettemplatelist', { "data": "{'pageSize':'5','pageNum':'1'}" }, con, err)

        function con(data) {
            var obj = JSON.parse(data.data.result)
            $scope.list = obj.list;
            $scope.total = obj.count;
            $scope.pagetol = Math.ceil(obj.count / $scope.pagesize)
            $scope.totalNum = obj.count;
            console.log(obj)
            // layer.msg('发送成功');
            // layer.close(index);
            // layer.close(index);
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.total,
                pageSize: $scope.pagesize - 0,
                visiblePages: 5,
                currentPage: $scope.pagenum - 0,
                activeClass: 'current',
                first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
                prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
                next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
                last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
                page: '<a href="javascript:void(0);">{{page}}<\/a>',
                onPageChange: function (n) {
                    $scope.pagenum = n;
                    if (!$scope.userinfo) {
                        $scope.userinfo = '';
                    }
                    // $("#pagination-demo-text").html("当前第" + n + "页");
                    erp.postFun('app/notification/gettemplatelist', { 'data': "{'pageSize':'" + $scope.pagesize + "','pageNum':'" + $scope.pagenum + "','name':'" + $scope.userinfo + "'}" }, function (data) {
                        var obj = JSON.parse(data.data.result)
                        $scope.list = obj.list;
                    }, err)


                }
            });
        }

        function err(data) {
            layer.msg('网络错误');
        }
        $scope.usersearch = function () {
            $scope.pagenum = '1';
            if (!$scope.userinfo) {
                $scope.userinfo = '';
            }
            erp.postFun('app/notification/gettemplatelist', { 'data': "{'pageSize':'" + $scope.pagesize + "','name':'" + $scope.userinfo + "','pageNum':'" + $scope.pagenum + "'}" }, con, err)
        }
        //编辑
        $scope.edit = function (item) {
            var str = JSON.stringify(item)
            sessionStorage.setItem('template', str)
            $location.path('/erpservice/tztempletadd/1')
        }
        //不可用
        $scope.change = function (item) {
            erp.postFun('app/notification/updateNO', { "data": "{'id':'" + item.ID + "','status':'1'}" }, con2, err)
        }
        //可用
        $scope.change2 = function (item) {
            erp.postFun('app/notification/updateNO', { "data": "{'id':'" + item.ID + "','status':'0'}" }, con2, err)
        }

        function con2(data) {
            layer.msg('成功修改')
            erp.postFun('app/notification/gettemplatelist', { 'data': "{'pageSize':'" + $scope.pagesize + "','pageNum':'1'}" }, con, err)
        }
    }])
    //erp--定时通知
    app.controller('tztimectrl', ['$scope', 'erp', function ($scope, erp) {
        console.log("tztimectrl")
        $scope.pagesize = '20';
        $scope.pagenum = '1';
        $scope.pagearr = [1, 3, 5, 10];
        //条数改变
        $scope.pagesizechange = function (n) {
            $scope.pagesize = n;
            erp.postFun('app/notification/getnotification', { 'data': "{'pageSize':'" + $scope.pagesize + "','pageNum':'1','status':'2'}" }, con, err)
        }
        //页码跳转
        $scope.pagenumchange = function () {
            console.log($scope.pagenum)
            erp.postFun('app/notification/getnotification', { 'data': "{'pageSize':'" + $scope.pagesize + "','pageNum':'" + $scope.pagenum + "','status':'2'}" }, con, err)
        }
        erp.postFun('app/notification/getnotification', { 'data': "{'pageSize':'" + $scope.pagesize + "','pageNum':'" + $scope.pagenum + "','status':'2'}" }, con, err)

        function con(data) {

            var obj = JSON.parse(data.data.result)
            $scope.list = obj.list;
            $scope.total = obj.count;
            $scope.totalNum = obj.count;
            $scope.canShowFlag = obj.list.length > 0
            $scope.pagetol = Math.ceil(obj.count / $scope.pagesize)
            console.log(obj)
            // layer.msg('发送成功');
            // layer.close(index);
            // layer.close(index);
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.total || 1,
                pageSize: $scope.pagesize * 1,
                visiblePages: 5,
                currentPage: $scope.pagenum - 0,
                activeClass: 'current',
                first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
                prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
                next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
                last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
                page: '<a href="javascript:void(0);">{{page}}<\/a>',
                onPageChange: function (n) {
                    $scope.pagenum = n;
                    // $("#pagination-demo-text").html("当前第" + n + "页");
                    erp.postFun('app/notification/getnotification', { 'data': "{'pageSize':'" + $scope.pagesize + "','pageNum':'" + $scope.pagenum + "','status':'2'}" }, function (data) {
                        var obj = JSON.parse(data.data.result)
                        $scope.list = obj.list;
                    }, err)
                }
            });
        }

        function err(data) {
            layer.msg('网络错误');
        }

        $scope.delet = function (item) {
            erp.postFun('app/notification/delete', { 'data': "{'id':'" + item.ID + "'}" }, con2, err)

            function con2(n) {
                console.log(n)
                layer.msg('成功删除');
                erp.postFun('app/notification/getnotification', { 'data': "{'pageSize':'5','pageNum':'1','status':'2'}" }, con, err)
            }
        }
    }])
    //erp--草稿
    app.controller('tzdraftctrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        $scope.forbidUse = true;
        return;
        console.log("tzdraftctrl")
        $scope.pagesize = '20';
        $scope.pagenum = '1';
        $scope.pagearr = [1, 3, 5, 10];
        //条数改变
        $scope.pagesizechange = function (n) {
            $scope.pagesize = n;
            erp.postFun('app/notification/getnotification', { 'data': "{'pageSize':'" + $scope.pagesize + "','pageNum':'1','status':'3'}" }, con, err)
        }
        //页码跳转
        $scope.pagenumchange = function () {
            console.log($scope.pagenum)
            erp.postFun('app/notification/getnotification', { 'data': "{'pageSize':'" + $scope.pagesize + "','pageNum':'" + $scope.pagenum + "','status':'3'}" }, con, err)
        }
        erp.postFun('app/notification/getnotification', { 'data': "{'pageSize':'5','pageNum':'1','status':'3'}" }, con, err)

        function con(data) {


            var obj = JSON.parse(data.data.result)
            $scope.list = obj.list;
            $scope.total = obj.count;
            $scope.pagetol = Math.ceil(obj.count / $scope.pagesize)
            console.log(obj)
            // layer.msg('发送成功');
            // layer.close(index);
            // layer.close(index);
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.total,
                pageSize: $scope.pagesize * 1,
                visiblePages: 5,
                currentPage: $scope.pagenum - 0,
                activeClass: 'current',
                first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
                prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
                next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
                last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
                page: '<a href="javascript:void(0);">{{page}}<\/a>',
                onPageChange: function (n) {
                    $scope.pagenum = n;
                    // $("#pagination-demo-text").html("当前第" + n + "页");
                    erp.postFun('app/notification/getnotification', { 'data': "{'pageSize':'" + $scope.pagesize + "','pageNum':'" + $scope.pagenum + "','status':'3'}" }, function (data) {
                        var obj = JSON.parse(data.data.result)
                        $scope.list = obj.list;
                    }, err)


                }
            });
        }

        function err(data) {
            layer.msg('网络错误');
        }

        $scope.edit = function (item) {
            var str = JSON.stringify(item)
            sessionStorage.setItem('tz', str)
            $location.path('/erpservice/tzedit/1')
        }
        //删除
        $scope.delet = function (item) {
            erp.postFun('app/notification/delete', { 'data': "{'id':'" + item.ID + "'}" }, con2, err)

            function con2(n) {
                console.log(n)
                layer.msg('成功删除');
                erp.postFun('app/notification/getnotification', { 'data': "{'status':'3'}" }, con, err)
            }
        }
    }])
    //erp--通知列表 已发送
    app.controller('tzctrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('tzctrl')
        $scope.pagesize = '20';
        $scope.pagenum = '1';
        $scope.pagearr = [1, 3, 5, 10];
        $scope.notifyType = null
        $scope.changeNotifyType = type => {
            if(+$scope.notifyType === +type ) {
                $scope.notifyType = null
            } else {
                $scope.notifyType = +type
            }
            getList()
        }
        //条数改变
        $scope.pagesizechange = function (n) {
            $scope.pagenum = '1';
            getList ()
        }
        //页码跳转
        $scope.pagenumchange = function () {
            if($scope.pagenum>$scope.pagetol){
                layer.msg('输入的页码大于总页码')
                return
            }
            getList ()
        }
        function getList (){
            var upJson = {};
            upJson.data = {};
            upJson.data.pageSize = $scope.pagesize;
            upJson.data.pageNum = $scope.pagenum;
            upJson.data.status = '1';
            upJson.data.info = $scope.userinfo;
            upJson.data.startDate = $('#c-data-time').val();
            upJson.data.endDate = $('#cdatatime2').val();
            if($scope.notifyType) upJson.data.notifyType = (+$scope.notifyType - 1).toString()
            upJson.data = JSON.stringify(upJson.data)
            
            erp.postFun('app/notification/getnotification',JSON.stringify(upJson), con, err)

            function con(data) {

                var obj = JSON.parse(data.data.result)
                $scope.list = obj.list;
                $scope.total = obj.count;
                $scope.pagetol = Math.ceil(obj.count / $scope.pagesize)
                $scope.totalNum = obj.count;
                console.log(obj)
                // layer.msg('发送成功');
                // layer.close(index);
                // layer.close(index);
                $(".pagegroup").jqPaginator({
                    totalCounts: $scope.total,
                    pageSize: $scope.pagesize * 1,
                    visiblePages: 5,
                    currentPage: $scope.pagenum - 0,
                    activeClass: 'current',
                    first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
                    prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
                    next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
                    last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
                    page: '<a href="javascript:void(0);">{{page}}<\/a>',
                    onPageChange: function (n,type) {
                        if(type=='init'){
                            return
                        }
                        $scope.pagenum = n;
                        getList ()


                    }
                });
            }

            function err(data) {
                layer.msg('网络错误');
            }
        }
        getList ()

        $scope.usersearch = function(){
            $scope.pagenum = '1';
            getList ()
        }
        $scope.timeSeaFun = function(){
            $scope.pagenum = '1';
            getList ()
        }

        $scope.look = function (item) {
            layer.open({
                type: 2,
                area: ['800px', '600px'],
                shadeClose: true, //点击遮罩关闭
                title: '预览',
                content: '//' + item.notificationUrl,
                btn: ['关闭'],
                btn1: function (index, layero) {
                    layer.close(index);
                }
            })
        }
    }])
    //erp-客户聊天室
    app.controller('srCtrl', ['$scope', 'erp', '$location', '$routeParams', function ($scope, erp, $location, $routeParams) {
        var base64 = new Base64()
        var set1, set2;
        let chatUrl, linkUrl
        var hiddenProperty = 'hidden' in document ? 'hidden' :
            'webkitHidden' in document ? 'webkitHidden' :
                'mozHidden' in document ? 'mozHidden' :
                    null;
        // console.log(document[hiddenProperty]);
        var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
        var targetFlag = $routeParams.flag || '';
        console.log(targetFlag)
        var onVisibilityChange = function () {
            if (!document[hiddenProperty]) {
                // haveNewMsg = false;
                clearInterval(set1);
                clearInterval(set2);
                console.log('清空定时器');
                console.log("我在当前页");
                var url = $location.path();
                console.log(url);
                //document.title='客户聊天室';
                if (url == '/erpservice/sc') {
                    document.title = '客户聊天室';
                }
            } else {
                console.log("我没在当前页");

            }
        };

        if (window.environment === '##development##') { //开发
            chatUrl = 'http://chat.test.com/'
            linkUrl = 'http://app.test.com/'
        } else if (window.environment === '##test##') { //测试
            chatUrl = 'http://chat.test.com/'
            linkUrl = 'http://app.test.com/'
        } else if (window.environment === '##production##') { //线上
            chatUrl = 'https://chat.cjdropshipping.com/'
            linkUrl = 'https://app.cjdropshipping.com/'
        } else if (window.environment === '##production-cn##') {
            chatUrl = 'https://chat.cjdropshipping.cn/'
            linkUrl = 'https://app.cjdropshipping.com/'
        }

        console.log(chatUrl)

        document.addEventListener(visibilityChangeEvent, onVisibilityChange);
        window.addEventListener('message', function (e) {
            console.log("父页面监听到了", e);
            var flag = e.data.flag;
            switch (flag) {
                case 'popnotice':
                    console.log('触发了notice');
                    var hiddenProperty = 'hidden' in document ? 'hidden' :
                        'webkitHidden' in document ? 'webkitHidden' :
                            'mozHidden' in document ? 'mozHidden' :
                                null;
                    if (document[hiddenProperty]) {
                        function show1() {
                            document.title = '客户聊天室';
                        }

                        function show2() {
                            document.title = '有新消息(*´∇｀*)';
                        }

                        clearInterval(set1);
                        clearInterval(set2);
                        set1 = setInterval(show1, 1000);
                        set2 = setInterval(show2, 2000);
                    }

                    // var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');

                    // var onVisibilityChange = function(){
                    //     console.log(document[hiddenProperty]);
                    //     if (!document[hiddenProperty]) {
                    //         clearInterval(set1);
                    //         clearInterval(set2);
                    //         console.log("被发现了");
                    //         document.title='客户聊天室';
                    //     }else{
                    //         console.log("藏好了");
                    //         function show1(){
                    //             document.title='你有新消息';
                    //         }
                    //         function show2(){
                    //             document.title='客户聊天室';
                    //         }
                    //         set1 = setInterval(show1,1000);
                    //         set2 = setInterval(show2,2000);
                    //     }
                    // };
                    // document.addEventListener(visibilityChangeEvent,onVisibilityChange);
                    console.log(e.data);
                    var msg = decodeURIComponent(e.data.msg);
                    //var msg = document[hiddenProperty];
                    // var name = e.data.touser;
                    var imgurl = e.data.imgurl;
                    var title = xxx;
                    console.log(Notification.permission);
                    notifyMe();

                    function notifyMe() {
                        // 先检查浏览器是否支持
                        if (!("Notification" in window)) {
                            alert("This browser does not support desktop notification");
                        }
                        // 检查用户是否同意接受通知
                        else if (Notification.permission === "granted") {
                            // If it's okay let's create a notification
                            var notification = new Notification(title, {
                                body: msg,
                                //icon:"./files/images/chatpng_pc_hover.png"
                                icon: imgurl,
                                tag: "tongzhi"
                            });
                        }
                        // 否则我们需要向用户获取权限
                        else if (Notification.permission !== 'denied') {
                            Notification.requestPermission(function (permission) {
                                // 如果用户同意，就可以向他们发送通知
                                if (permission === "granted") {
                                    var notification = new Notification(title, {
                                        body: msg,
                                        //icon:"./files/images/chatpng_pc_hover.png"
                                        icon: imgurl,
                                        tag: "tongzhi"
                                    });
                                }
                            });
                        }
                        // 最后，如果执行到这里，说明用户已经拒绝对相关通知进行授权
                        // 出于尊重，我们不应该再打扰他们了
                    }

                    break;
                case 'offLine':
                    //console.log('iframe的src为：'+angular.element('#chat-frame').attr('src'));
                    var oderUrl = angular.element('#chat-frame').attr('src');
                    document.getElementById('chat-frame').src = oderUrl;
                    // layer.confirm(nydx, { icon: 3, btn: [shuaxin, quxiao] }, function (index) {
                    //     console.log(index);
                    //     layer.close(index);
	
	            // });
                default:
                    break;
            }

        });
        //点击编辑按钮 显示弹窗
        const erpLoginName = base64.decode(localStorage.getItem('erploginName') || '')
        const isAdminList = ['admin', '方丹丹']
        $scope.isadmin = isAdminList.includes(erpLoginName)
        
        $scope.windowtc = false;
        //打开弹窗
        $scope.khgxTc = function () {
            $scope.windowtc = true;
        }
        //关闭弹窗
        $scope.khgbTc = function () {
            $scope.windowtc = false;
        }
        console.log('srCtrl')

        function err(data) {
            layer.msg('网络错误');
        }

        // $scope.look=function (item) {
        //     layer.open({
        //         type: 2,
        //         area: ['800px', '600px'],
        //         shadeClose: true, //点击遮罩关闭
        //         title:'预览',
        //         content: '//'+item.notificationUrl,
        //         btn: ['关闭'],
        //         btn1:function (index,layero) {
        //             layer.close(index);
        //         }
        //     })
        // }

        $scope.startChatFlag = false;
        console.log(($('.ea-right-content-wll').width() - 100) * 9 / 16);
        $('#chat-frame').height(($('.ea-right-content-wll').width() - 100) * 9 / 16);
        //聊天
        // $scope.hasGotChatLink=false;
        if (targetFlag) {
            // $scope.gototalk()
            erp.load();
            erp.postFun('app/message/getYWYChatUrl', null, function (n) {
                erp.closeLoad();
                if (n.error) {
                    layer.msg('网络错误')
                } else {
                    console.log(n.data.href);
                    var lang = localStorage.getItem('lang');
                    var user = n.data.user;
                    // user = 'taeyon';
                    //console.log(user);
                    if (user == undefined || user == '' || user == null || user == 'asd') {
                        layer.msg(meiyouywm);
                    } else {
                        console.log('可以聊天');
                        $('.right-bar').css('padding-top', "1px");
                        $('.zhuanshulink1').css('display', "none");
                        $('.zhuanshu-word').css('display', "none");
                        $('.zhuanshu-box').css('margin', '0 0 10px 0');
                        $('.zhuanshu-box').css('text-align', 'right');

                        // $scope.talkhref = 'https://chat.cjdropshipping.com/chat2?user=' + n.data.user + '&token=' + n.data.token + '&img=' + n.data.img + '&lang=' + lang;
                        $scope.talkhref = chatUrl + 'index.html?user=' + n.data.user + '&token=' + n.data.token + '#/chat/Service';
                        //$scope.talkhref = 'http://localhost:3000/chat2?user=' + n.data.user + '&token=' + n.data.token + '&img=' + n.data.img+'&lang='+lang;
                        //$scope.talkhref = 'http://localhost:3000/chat2?user=Peggy&token=da6f3df74f7f499482fd5c8ae065bfe8&img=&lang='+lang;
                        $scope.startChatFlag = true;
                        angular.element('#chat-frame').attr('src', $scope.talkhref);
                        $('.zhuanshu-box>.lookchat').show();
                    }

                }
            }, function (n) {
                erp.closeLoad();
                console.log(n)
            });
            console.log('open chat')
        }
        $scope.gototalk = function (type) {
            erp.load();
            erp.postFun('app/message/getYWYChatUrl', null, function (n) {
                erp.closeLoad();
                if (n.error) {
                    layer.msg('网络错误')
                } else {
                    console.log(n.data.href);
                    var lang = localStorage.getItem('lang');
                    //console.log(lang);
                    // $scope.talkhref = n.data.href;http://localhost:3000/
                    //https://chat.cjdropshipping.com

                    var user = n.data.user;
                    //user = 'taeyon';
                    //console.log(user);
                    if (user == undefined || user == '' || user == null || user == 'asd') {
                        layer.msg(meiyouywm);
                    } else {
                        console.log('可以聊天');
                        $('.right-bar').css('padding-top', "1px");
                        $('.zhuanshulink1').css('display', "none");
                        $('.zhuanshu-word').css('display', "none");
                        $('.zhuanshu-box').css('margin', '0 0 10px 0');
                        $('.zhuanshu-box').css('text-align', 'right');

                        if(type == 2){
                            $scope.talkhref = chatUrl + 'chat2?user=' + n.data.user + '&token=' + n.data.token + '&img=' + n.data.img + '&lang=' + lang;
                        }else if(type == 1){
                            $scope.talkhref = `${chatUrl}index.html?user=${n.data.user}&token=${n.data.token}&domain=${window.location.host}#/chat/Service`
                        }
                        
                        //$scope.talkhref = 'http://localhost:3000/chat2?user=' + n.data.user + '&token=' + n.data.token + '&img=' + n.data.img+'&lang='+lang;
                        //$scope.talkhref = 'http://localhost:3000/chat2?user=Miranda&token=194b3795efd56ca5090f177bc40fc6de&img=&lang='+lang;
                        $scope.startChatFlag = true;
                        angular.element('#chat-frame').attr('src', $scope.talkhref);
                        $('.zhuanshu-box>.lookchat').show();
                    }

                }
            }, function (n) {
                erp.closeLoad();
                console.log(n)
            });


        }
        $scope.copyLink = function (flag) {
            var Url1;
            Url1 = document.createElement('input');
            Url1.setAttribute('readonly', 'readonly');
            if (flag == 'chat') {
                Url1.setAttribute('value', $scope.zhuanshuLink);
            }
            if (flag == 'reg') {
                Url1.setAttribute('value', $scope.zhuanshuRegLink);
            }
            if (flag == 'source') {
                Url1.setAttribute('value', $scope.zhuanshuSourceLink);
            }
            document.body.appendChild(Url1);
            //console.log(Url1.value);
            Url1.select(); //选择对象
            document.execCommand("Copy");
            var tag = document.execCommand("Copy"); //执行浏览器复制命令
            if (tag) {
                layer.msg('复制成功');
            }
            ;
            document.body.removeChild(Url1);
        }
        $('#zhuanshu-link').on('input', function () {
            $('#zhuanshu-link').val($scope.zhuanshuLink);
        })
        erp.postFun('app/message/createLinkChatUser', null, function (data) {
            console.log(data);
            if (data.code == 300) {
                layer.msg(data.error);
                return;
            }
            $scope.zhuanshuLink = 'https://chat.cjdropshipping.com/' + '?touser=' + data.data.user;
            // $scope.zhuanshuLink = 'https://chat.cjdropshipping.com/index.html?user=' + n.data.user + '&token=' + n.data.token + '#/chat/Service';
            $scope.zhuanshuRegLink = linkUrl+'register.html?ma=' + data.data.user;
            $scope.zhuanshuSourceLink = linkUrl+'cus-sourcing.html?ma=' + data.data.user;
        }, err)
    }])
    //erp-客服-document
    app.controller('serviceDocuCtrl', ['$scope', 'erp', '$timeout', '$rootScope', function ($scope, erp, $timeout, $rootScope) {
        console.log('serviceDocuCtrl');
        var base64 = new Base64();
        var loginName = localStorage.getItem('erploginName') ? base64.decode(localStorage.getItem('erploginName')) : '';
        const isAdminList = ['admin', '吴颖茵', '程珍珍', '高晨琦', '周晓东', '史静怡', '方丹丹']
        $scope.isadmin = isAdminList.includes(loginName)
        console.log($scope.isadmin)
        $scope.curQuestion = '';
        //
        $scope.itemClicked = function ($item) {
            $scope.selectedItem = $item;
            console.log($item, 'item clicked');
        };
        $scope.itemCheckedChanged = function ($item) {
            console.log($item, 'item checked');
        };

        function getlist() {
            layer.load(2);
            erp.postFun('app/problem/selectProblemSetsList', { name: $scope.searchStr }, function (data) {
                console.log(data);
                layer.closeAll('loading');
                //$scope.cateList = data.data.list;
                $scope.tree = [{
                    'id': null,
                    'headline': 'All',
                    'editFlag': false,
                    '$$isExpend': true,
                    'menuType': 1,
                    'children': data.data.list
                }]
                ready($scope.tree);
            }, function (err) {
                layer.closeAll('loading');
                layer.msg('system error')
            });
        }
        getlist();
        function ready(arr) {
            arr.forEach(function (o, i) {
                o.editFlag = false;
                if (o.children && o.children.length > 0) {
                    ready(o.children)
                }
            })
        }
        $scope.switchList = function (index, flag) {
            console.log($scope.cateList[index].problem);
            if (!$scope.cateList[index].problem || $scope.cateList[index].problem.length <= 0) return;
            $scope.cateList[index].open = flag;
        }
        $scope.treeClick = function (item) {
            $scope.curQuestion = item;
            console.log(item)

        }
        //添加目录
        $scope.goAddCate = function () {
            console.log($scope.tree);
            console.log($scope.selectedItem);
            if (!$scope.selectedItem || $scope.selectedItem.menuType == 10000) {
                layer.msg('请先选择目录文件夹！')
                return;
            }
            if (!$scope.addCateName) return;
            layer.load(2);
            erp.postFun('app/problem/createQuestionsType', { "name": $scope.addCateName, 'problemTypeId': $scope.selectedItem.id }, function (data) {
                layer.closeAll('loading');
                console.log(data.data);
                if (data.data.statusCode != 200) {
                    layer.msg('operation failed');
                } else {
                    layer.msg('Successful operation');
                    $scope.selectedItem.children.push({
                        'id': data.data.result,
                        'headline': $scope.addCateName,
                        'editFlag': false,
                        '$$isExpend': false,
                        'menuType': 1,
                        'children': []
                    })
                }
            }, function (err) {
                layer.msg('system error')
                layer.closeAll('loading');
            });
        }
        //添加文档
        $scope.addDocument = function () {
            console.log($scope.selectedItem)
            if (!$scope.selectedItem || $scope.selectedItem.menuType == 10000) {
                layer.msg('请先选择目录！')
                return;
            }
            location.href = '#/erpservice/document/add/add/' + $scope.selectedItem.id;
        }
        //搜素
        $scope.enterSearch = function () {
            console.log($scope.searchStr);
            $rootScope.Title = '';
            $rootScope.contentTXT = '';
            $rootScope.accessory = [];
            $rootScope.annexlist = [];
            layer.load(2);
            erp.postFun('app/problem/selectProblemSetsList', { name: $scope.searchStr }, function (data) {
                console.log(data);
                layer.closeAll('loading');
                $scope.tree = [{
                    'id': null,
                    'headline': 'All',
                    'editFlag': false,
                    '$$isExpend': true,
                    'menuType': 1,
                    'children': data.data.list
                }]
                function expand(arr) {
                    arr.forEach(function (o, i) {
                        o.$$isExpend = true;
                        if (o.children && o.children.length > 0) {
                            expand(o.children)
                        }
                    })
                }
                expand($scope.tree)
            }, function (err) {
                layer.closeAll('loading');
                layer.msg('system error')
            });
        }
        //上移or下移
        $scope.topOrbot = function (type, item, index) {
            console.log(index);
            console.log($scope.cateList);
            var currentId = $scope.cateList[index].problemType.id;
            var currentSort = $scope.cateList[index].problemType.sort;
            var idx;
            if (type == 'top') {
                idx = index - 1;
                if (idx < 0) {
                    idx = $scope.cateList.length - 1;
                }
            } else if (type == 'bot') {
                idx = index + 1;
                if (idx > $scope.cateList.length - 1) {
                    idx = 0;
                }
            }
            console.log(idx);
            var exchangeId = $scope.cateList[idx].problemType.id;
            var exchangeSort = $scope.cateList[idx].problemType.sort;
            console.log(currentSort)
            console.log(exchangeSort)
            erp.postFun('app/problem/moveLocation', {
                currentId: currentId,
                currentSort: currentSort.toString(),
                exchangeId: exchangeId,
                exchangeSort: exchangeSort.toString(),
            }, function (data) {
                console.log(data);
                if (data.data.code == 200) {
                    getlist();
                } else {
                    layer.msg('operation failed')
                }
            }, function (data) {

            });
        }
        //文档编辑
        $scope.docEdit = function () {
            location.href = '#/erpservice/document/add?type=edit&id=' + $scope.selectedItem.id;
        }
        //文档删除
        $scope.docDel = function () {
            erp.postFun('app/problem/addFlagToQuestionsAndAnswers', {
                id: $scope.selectedItem.id
            }, function (data) {
                console.log(data);
                if (data.data.code == 200) {
                    layer.msg('successfully deleted');
                    $rootScope.Title = '';
                    $rootScope.contentTXT = '';
                    $rootScope.accessory = [];
                    $rootScope.annexlist = [];
                    getlist();
                } else {
                    layer.msg('operation failed');
                }
            }, function (data) {
                layer.msg('system error')
                layer.closeAll('loading');
            });
        }
    }]).directive('treeView', [function () {
        return {
            restrict: 'E',
            templateUrl: '/treeView.html',
            scope: {
                treeData: '=',
                canChecked: '=',
                textField: '@',
                itemClicked: '&',
                itemCheckedChanged: '&',
                itemTemplateUrl: '@'
            },
            controller: ['$scope', '$timeout', 'erp', '$rootScope', function ($scope, $timeout, erp, $rootScope) {
                var base64 = new Base64();
                var loginName = localStorage.getItem('erploginName') ? base64.decode(localStorage.getItem('erploginName')) : '';
                if (loginName == 'admin' || loginName == '吴颖茵' || loginName == '程珍珍' || loginName == '高晨琦') {
                    $scope.isadmin = true;
                } else {
                    $scope.isadmin = false;
                }
                $scope.itemExpended = function (item, $event) {
                    item.$$isExpend = !item.$$isExpend;
                    $event.stopPropagation();
                };
                $scope.getItemIcon = function (item) {
                    var isLeaf = $scope.isLeaf(item);
                    if (item.menuType == 10000) {
                        return 'doc';
                    }
                    return item.$$isExpend ? 'fa fa-minus' : 'fa fa-plus';
                };
                $scope.isLeaf = function (item) {
                    return !item.children || !item.children.length;
                };
                var clickTimeId;
                $scope.warpCallback = function (callback, item, $event) {
                    $scope.curQuestion = item;
                    ($scope[callback] || angular.noop)({
                        $item: item,
                        $event: $event
                    });
                    console.log(item)
                    $rootScope.Title = '';
                    $rootScope.contentTXT = '';
                    $rootScope.accessory = [];
                    $rootScope.annexlist = [];
                    if (item.menuType == 10000) {
                        layer.load(2);
                        erp.postFun('app/problem/selectProblemList', {
                            id: item.id
                        }, function (data) {
                            layer.closeAll('loading');
                            console.log(data);
                            if (data.data.code == 200) {
                                $rootScope.Title = data.data.list[0].headline;
                                $rootScope.contentTXT = data.data.list[0].answer;
                                $rootScope.accessory = data.data.list[0].accessory;
                                $rootScope.annexlist = JSON.parse($rootScope.accessory);
                                console.log($rootScope.Title)
                                console.log($rootScope.annexlist)
                            }
                        }, function (data) {
                            layer.msg('system error')
                            layer.closeAll('loading');
                        });
                    }
                };
                //编辑
                $scope.goEdit = function (i, item, e) {
                    if (item.id && $scope.isadmin) {
                        angular.element(e.target).siblings('.edit-cate-inp').val(item.headline);
                        $timeout(function () {
                            angular.element(e.target).siblings('.edit-cate-inp').focus()
                        }, 10);
                        item.editFlag = true;
                    }
                }
                //
                $scope.cancelEdit = function (i, item) {
                    item.editFlag = false;
                }
                $scope.goActEdit = function (i, e, item) {
                    if (e.keyCode != 13) return;
                    var editVal = angular.element(e.target).val();
                    if (!editVal) {
                        item.editFlag = false;
                        return;
                    }
                    layer.load(2);
                    erp.postFun('app/problem/updateProblemType', {
                        "name": editVal,
                        "id": item.id
                    }, function (data) {
                        layer.closeAll('loading');
                        console.log(data);
                        if (data.data.code != 200) {
                            layer.msg('operation failed');
                        } else {
                            layer.msg('Successful operation');
                            item.headline = editVal;
                            item.editFlag = false;
                        }
                    }, function (err) {
                        layer.closeAll('loading');
                        layer.msg('system error')
                    })
                }
            }]
        };
    }]);

    //erp-客服-document-add
    app.controller('serviceDocuAddCtrl', ['$scope', 'erp', '$routeParams', '$rootScope', function ($scope, erp, $routeParams, $rootScope) {
        console.log('serviceDocuAddCtrl');
        console.log($routeParams.type)
        console.log($routeParams.id)
        $scope.isadmin = erp.isAdminLogin();
        console.log($scope.isadmin)
        var editor = new window.wangEditor('#wang');
        editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
        editor.customConfig.uploadImgServer = 'https://erp.cjdropshipping.com/app/ajax/upload';
        editor.customConfig.uploadFileName = 'file'
        editor.customConfig.uploadImgHooks = {
            customInsert: function (insertImg, result, editor) {
                console.log(result)
                // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
                // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

                // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
                var imgList = JSON.parse(result.result);
                for (var i = 0; i < imgList.length; i++) {
                    imgList[i] = 'https://' + imgList[i];
                }
                if (imgList.length > 0) {
                    insertImg(imgList);
                }

                // result 必须是一个 JSON 格式字符串！！！否则报错
            }
        }
        editor.create();
        var type = $routeParams.type;
        if (type == 'add') {
            $scope.addFlag = true;
            $scope.editFlag = false;
        } else if (type == 'edit') {
            if ($routeParams.id != undefined) {
                erp.postFun('app/problem/selectProblemList', {
                    id: $routeParams.id
                }, function (data) {
                    console.log(data);
                    if (data.data.code == 200) {
                        $scope.editFlag = true;
                        $scope.addFlag = false;
                        $scope.docuTitle = data.data.list[0].headline;
                        //$scope.cateItem = item.problemTypeId;
                        $scope.hasUploadFile = JSON.parse(data.data.list[0].accessory);
                        editor.txt.html(data.data.list[0].answer)
                        console.log($scope.hasUploadFile)
                    }
                }, function (err) {
                    layer.closeAll('loading');
                    layer.msg('system error')
                });
            }

        }
        function getlist() {
            erp.postFun('app/problem/selectProblemSetsList', {}, function (data) {
                console.log(data);
                $scope.cateList = data.data.list;
                console.log($scope.cateList)
                $scope.cateItem = data.data.list[0].id;
            });
        }
        //getlist();
        $scope.fileLinks = [];
        $scope.hasUploadFile = [];
        $scope.upLoadImg = function (files) {
            var formData = new FormData($("#uploadfile")[0]);
            console.log(formData)
            console.log(files);
            var filesArr = Array.prototype.slice.call(files);
            if ($scope.hasUploadFile.length > 4) {
                layer.msg('Upload no more than 5 files')
                return;
            }
            layer.load(2);
            erp.upLoadImgPost('app/ajax/upload', formData, function (data) {
                layer.closeAll('loading');
                var data = data.data;
                console.log(data);
                if (data.statusCode != 200) {
                    layer.msg('Server Error');
                    return false;
                }
                //$scope.fileLinks.push(JSON.parse(data.result));
                for (var i = 0; i < filesArr.length; i++) {
                    $scope.hasUploadFile.push({
                        name: filesArr[i].name,
                        url: JSON.parse(data.result)
                    });
                }
                console.log($scope.hasUploadFile)
                $('#enclosure-file').val('');
            }, function () {
                layer.closeAll('loading');
                layer.msg('Network Error');
            });
        }
        $scope.delFile = function (i) {
            $scope.hasUploadFile.splice(i, 1);
        }
        $scope.submitDocu = function () {
            if (!$scope.docuTitle) {
                layer.msg('Please fill in Title');
                return;
            } else if (!editor.txt.html()) {
                layer.msg('Please fill in the text');
                return;
            }
            layer.load(2);
            var data = {
                headline: $scope.docuTitle,
                problemTypeId: $routeParams.id,
                accessory: $scope.hasUploadFile,
                answer: editor.txt.html(),
            }
            if (type == 'add') {
                erp.postFun('app/problem/createQuestionsAndAnswers', JSON.stringify(data), function (data) {
                    layer.closeAll('loading');
                    console.log(data);
                    if (data.data.statusCode != 200) {
                        layer.msg('operation failed');
                    } else {
                        layer.msg('Successful operation');
                        location.href = 'manage.html#/erpservice/document';
                        $rootScope.Title = '';
                        $rootScope.contentTXT = '';
                        $rootScope.accessory = [];
                        $rootScope.annexlist = [];
                    }
                }, function (err) {
                    layer.closeAll('loading');
                    layer.msg('system error')
                });
            } else if (type == 'edit') {
                data.id = $routeParams.id;
                erp.postFun('app/problem/updateQuestionsAndAnswers', JSON.stringify(data), function (data) {
                    layer.closeAll('loading');
                    console.log(data);
                    if (data.data.code != 200) {
                        layer.msg('operation failed');
                    } else {
                        layer.msg('Successful operation');
                        location.href = 'manage.html#/erpservice/document';
                        $rootScope.Title = '';
                        $rootScope.contentTXT = '';
                        $rootScope.accessory = [];
                        $rootScope.annexlist = [];
                    }
                }, function (err) {
                    layer.closeAll('loading');
                    layer.msg('system error')
                });
            }

        }
        $scope.cancelClick = function () {
            location.href = 'manage.html#/erpservice/document';
            $rootScope.Title = '';
            $rootScope.contentTXT = '';
            $rootScope.accessory = [];
            $rootScope.annexlist = [];
        }
    }])
    app.directive('repeatFinish', ['$timeout', function ($timeout) {      //renderFinish自定义指令
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        };
    }]);
    //客服 客户工单
    app.controller('gdctrl', ['$scope', 'erp', '$location', '$sce', function ($scope, erp, $location, $sce) {
        $scope.$on('ngRepeatFinished', function () {
            console.log('111');
            $('#selectOperator').val($scope.operatorId)
        });
        var base64 = new Base64();
        var loginName = localStorage.getItem('erploginName') ? base64.decode(localStorage.getItem('erploginName')): '';
        
        var that = this;
		$scope.isSendMail=false;

        $scope.pagenum = "1";
        $scope.pagesize = "20";
        $scope.searchMSG = "";
        $scope.type = "";
        // $scope.status = "1";
        // gongdanPost();
        $scope.emailStu = true;//Email客户工单
        var gdpath = $location.path();
        console.log(gdpath);
        $scope.chuliFlag = false;
        $scope.replyFlag = false;
        $scope.guaqiFlag = false;
        if (gdpath == '/erpservice/gdcjreply' || gdpath == '/erpservice/gd') {
            $('.top-taps ul li').eq(0).addClass('active').siblings('li').removeClass('active');
            $scope.status = "1";
            $scope.chuliFlag = false;
            $scope.replyFlag = true;
            $scope.guaqiFlag = true;
            gongdanPost();
        }
        if (gdpath == '/erpservice/gdaccountreply') {
            $('.top-taps ul li').eq(1).addClass('active').siblings('li').removeClass('active');
            $scope.status = "2";
            $scope.chuliFlag = false;
            $scope.replyFlag = true;
            $scope.guaqiFlag = true;
            gongdanPost();
        }
        if (gdpath == '/erpservice/gdsuccess') {
            $('.top-taps ul li').eq(2).addClass('active').siblings('li').removeClass('active');
            $scope.status = "3";
            $scope.chuliFlag = false;
            $scope.replyFlag = false;
            $scope.guaqiFlag = false;
            gongdanPost();
        }
        if (gdpath == '/erpservice/gdhangup') {
            $('.top-taps ul li').eq(3).addClass('active').siblings('li').removeClass('active');
            $scope.status = "4";
            $scope.chuliFlag = false;
            $scope.replyFlag = true;
            $scope.guaqiFlag = false;
            gongdanPost();
        }
        if (gdpath == '/erpservice/gdcancel') {
            $('.top-taps ul li').eq(4).addClass('active').siblings('li').removeClass('active');
            $scope.status = "0";
            $scope.chuliFlag = false;
            $scope.replyFlag = false;
            $scope.guaqiFlag = false;
            gongdanPost();
        }
        if (gdpath == '/erpservice/gdautocancel') {
            $('.top-taps ul li').eq(5).addClass('active').siblings('li').removeClass('active');
            $scope.status = "5";
            $scope.chuliFlag = false;
            $scope.replyFlag = false;
            $scope.guaqiFlag = false;
            gongdanPost();
        }
        if (gdpath == '/erpservice/cusemailcancel') {
            $('.top-taps ul li').eq(6).addClass('active').siblings('li').removeClass('active');
            $scope.status = "1";
            $scope.statusFlag = '0';
            $scope.emailStu = false;
            $scope.type = 'email Issue';
            $scope.chuliFlag = true;
            $scope.replyFlag = false;
            $scope.guaqiFlag = false;
            getIssueList();
        }
        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        }

        $scope.operatorId = '';
        $('#selectOperator').change(function () {
            $scope.operatorId = $(this).val();
            $scope.pagenum = 1;
            getIssueList();
        });

        /** 打开邮件发送 */
        $scope.openEmail = function (email) {
            // console.log('email =>', email)
            $scope.isSendMail = true;
            that.no = {email}
        }

        $scope.openEmailGd = function (email, gdId) {
            // console.log('email =>', email)
            $scope.isSendMail = true;
            that.no = {email};
            that.gdId = gdId;
        }

        $scope.$on('log-to-father',function (d,flag) {
            // {closeFlag: false}
            // console.log('收到 =>',flag)
			 if (d && flag) {
				$scope.isSendMail = flag.closeFlag;
			 }
          })
          
        function getIssueList() {
            var offset = ((parseInt($scope.pagenum) - 1) * parseInt($scope.pagesize));
            var count = offset + parseInt($scope.pagesize);
            console.log($scope.statusFlag);
            var sendData = {
                status: $scope.statusFlag,
                offset: offset + '',
                count: count + '',
                inputStr: $scope.searchMSG,
                operatorId: $scope.operatorId,
            }
            erp.load();
            erp.postFun('erp/pojoIssue/getIssues', JSON.stringify(sendData), function (data) {
                erp.closeLoad();
                if (data.data.statusCode == '200') {
                    var result = data.data.result;
                    console.log(result);
                    $scope.totalNum = result.total;
                    $scope.waitcjreplylist = result.issueInfos;
                    $scope.orderFlag = result.status;
                    $scope.chulirenList = result.operatorInfo;
                    console.log($scope.operatorId);
                    //var list = $('#selectOperator option');
                    //console.log(list);
                    //$.each(list,function(i,v){
                    //    var type = $(v).attr('value');
                    //    console.log(type);
                    //    if(type==$scope.operatorId){
                    //        console.log($(v))
                    //        $(v).prop('selected',true);
                    //    }
                    //})
                    pageFun2();
                }
            }, function () {
                erp.closeLoad();
            })
        }

        //分页函数
        function pageFun2() {
            console.log('11111');
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.totalNum || 1,
                pageSize: $scope.pagesize * 1,
                visiblePages: 5,
                currentPage: $scope.pagenum * 1,
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
                    $scope.pagenum = n + '';
                    getIssueList();
                }
            });
        }

        $scope.delFun = function (item) {
            layer.confirm('确认要删除吗？', {
                btn: ['确定', '取消']//按钮
            }, function (index) {
                layer.close(index);
                //此处请求后台程序，下方是成功后的前台处理……
                console.log(item);
                var sendData = {
                    id: item.ID,
                    delFlag: '1'
                };
                erp.load();
                erp.postFun('erp/pojoIssue/updateDelFlag', JSON.stringify(sendData), function (data) {
                    erp.closeLoad();
                    if (data.data.statusCode == '200') {
                        layer.msg('删除成功');
                        getIssueList();
                    } else {
                        layer.msg('删除失败')
                    }
                }, function () {
                    erp.closeLoad();
                    layer.msg('网络错误');
                });
            });
        };
        $scope.huifuDel = function (item) {
            layer.confirm('确认要恢复吗？', {
                btn: ['确定', '取消']//按钮
            }, function (index) {
                layer.close(index);
                //此处请求后台程序，下方是成功后的前台处理……
                console.log(item);
                var sendData = {
                    id: item.ID,
                    delFlag: '0'
                };
                erp.load();
                erp.postFun('erp/pojoIssue/updateDelFlag', JSON.stringify(sendData), function (data) {
                    erp.closeLoad();
                    if (data.data.statusCode == '200') {
                        layer.msg('恢复成功');
                        getIssueList();
                    } else {
                        layer.msg('恢复失败');
                    }
                }, function () {
                    erp.closeLoad();
                    layer.msg('网络错误');
                });
            });
        }
        $scope.joinBlack = function (item) {
            console.log(item);//ACCOUNTEMAIL
            layer.confirm('确认将“' + item.ACCOUNTEMAIL + '”加入黑名单？不再接收“' + item.ACCOUNTEMAIL + '”的邮件。', {
                btn: ['确定', '取消']//按钮
            }, function (index) {
                layer.close(index);
                //此处请求后台程序，下方是成功后的前台处理……
                console.log(item);
                var sendData = {
                    email: item.ACCOUNTEMAIL,
                    status: '1'
                };
                erp.load();
                erp.postFun('erp/emailStatus/updateStatus', JSON.stringify(sendData), function (data) {
                    erp.closeLoad();
                    if (data.data.statusCode == '200') {
                        layer.msg('加入成功');
                        getIssueList();
                    } else {
                        layer.msg('加入失败')
                    }
                }, function () {
                    erp.closeLoad();
                    layer.msg('网络错误');
                });
            });
        };
        $scope.huifuJoin = function (item) {
            layer.confirm('确认重新接收“' + item.ACCOUNTEMAIL + '”的邮件？原有邮件将全部恢复至原页面原位置。', {
                btn: ['确定', '取消']//按钮
            }, function (index) {
                layer.close(index);
                //此处请求后台程序，下方是成功后的前台处理……
                console.log(item);
                var sendData = {
                    email: item.ACCOUNTEMAIL,
                    status: '0'
                };
                erp.load();
                erp.postFun('erp/emailStatus/updateStatus', JSON.stringify(sendData), function (data) {
                    erp.closeLoad();
                    if (data.data.statusCode == '200') {
                        layer.msg('恢复成功');
                        getIssueList();
                    } else {
                        layer.msg('恢复失败')
                    }
                }, function () {
                    erp.closeLoad();
                    layer.msg('网络错误');
                });
            });
        }
        // 按enter搜索
        $(document).keyup(function (event) {
            if (event.keyCode == 13) {
                $("#search").trigger("click");
            }
        });
        $scope.isAdminFlag = erp.isAdminLogin() || ['朱桂芬', '程珍珍', '周晓东', '李博文', '史静怡', '郑茜', '刁雨寒'].includes(loginName)
        console.log($scope.isAdminFlag);
        $('.tabNav1').on('click', 'a', function (e) {
            e.preventDefault();
            $(this).addClass('act').siblings('.act').removeClass('act');
            var type = $(this).attr('href');
            $scope.statusFlag = type;
            if ($scope.statusFlag == '0') {
                $scope.cFlag = false;
                $scope.bFlag = false;
                $scope.cFlag = false;
            } else if ($scope.statusFlag == '' || $scope.statusFlag == '3' || $scope.statusFlag == '4') {
                $scope.cFlag = true;
                $scope.bFlag = true;
                $scope.cFlag = true;
            } else {
                $scope.cFlag = true;
                $scope.bFlag = false;
                $scope.cFlag = true;
            }
            $scope.pagenum = '1';
            $scope.operatorId = '';
            $(".top-search-inp").val('');
            $scope.searchMSG = '';
            getIssueList();
        });
        $('.tabNav2').on('click', 'a', function (e) {
            e.preventDefault();
            $(this).addClass('act').siblings('.act').removeClass('act');
            var type = $(this).attr('href');
            $scope.status = type;
            $scope.pagenum = '1';
            gongdanPost();
        });
        //搜索
        $scope.wllserch = function () {
            var serchMsg = $(".top-search-inp").val();
            $scope.pagenum = "1";
            $scope.searchMSG = serchMsg;
            console.log(serchMsg);
            if (gdpath == '/erpservice/cusemailcancel') {
                getIssueList();
            } else {
                gongdanPost();
            }

        }
        //选择type
        $scope.typechange = function (issuetype) {
            console.log(issuetype);
            $scope.pagenum = "1";
            var serchMsg = $(".top-search-inp").val();
            $scope.searchMSG = serchMsg;
            $scope.type = issuetype;
            if (gdpath == '/erpservice/cusemailcancel') {
                getIssueList();
            } else {
                gongdanPost();
            }
        }
        $scope.evaluateChange = function (evaluateVal) {
            console.log(evaluateVal);
            $scope.pagenum = "1";
            var serchMsg = $(".top-search-inp").val();
            $scope.searchMSG = serchMsg;
            $scope.evaluateVal = evaluateVal;
            if (gdpath == '/erpservice/cusemailcancel') {
                getIssueList();
            } else {
                gongdanPost();
            }
        }
        //跳页
        $scope.pagenumchange = function () {
            console.log($scope.pagenum);
            if (gdpath == '/erpservice/cusemailcancel') {
                getIssueList();
            } else {
                gongdanPost();
            }
        }
        //条数改变
        $scope.pagesizechange = function () {
            console.log($scope.pagesize);
            if (gdpath == '/erpservice/cusemailcancel') {
                getIssueList();
            } else {
                gongdanPost();
            }
        }

        // submit form 上传图片
        $scope.isphoto = false;//判断如果不是图片的弹框
        $scope.imgArr = [];

        $scope.upLoadImg4 = function (files) {
            $scope.imgArrType = [];
            // $scope.imgArr=[];
            var data = new FormData();
            for (var i = 0; i < files.length; i++) {
                data.append('file', files[i]);
            }                            //以下为向后台提交图片数据
            erp.upLoadImgPost('app/ajax/upload', data, con, err);

            function con(n) {
                // 上传图片的地址
                var obj = JSON.parse(n.data.result);
                for (var j = 0; j < obj.length; j++) {

                    // $scope.imgArr.push('https://'+obj[j]);
                    var srcList = obj[j].split('.');
                    console.log(srcList[srcList.length - 1]);
                    //$scope.imgArrType.push(srcList[srcList.length - 1]);

                    //console.log($scope.imgArr);
                    //console.log($scope.imgArrType);
                    if (srcList[srcList.length - 1] == 'png' || srcList[srcList.length - 1] == 'jpg' || srcList[srcList.length - 1] == 'jpeg' || srcList[srcList.length - 1] == 'gif') {
                        $scope.imgArr.push('https://' + obj[j]);
                        if ($scope.imgArr.length > 10) {
                            $scope.imgArr.slice(10);
                            setTimeout(function () {
                                $('.img > ul > li').slice(10).hide();
                            }, 300);
                            $scope.submitTipMessage = 'You can only upload up to 10 images.';
                            $('.hnj-form .hnj-tankuang').css({ 'display': 'block' });
                            $scope.okFun = function () {
                                $('.hnj-form .hnj-tankuang').css({ 'display': 'none' });
                            }
                            $scope.df = function ($event) {
                                $event.preventDefault();
                            }
                        }
                    } else {
                        $scope.isphoto = true;//判断如果不是图片的弹框  显示
                        $('.hnj-form .hnj-tankuang').css({ 'display': 'block' });
                        $scope.submitTipMessage = 'Please upload the correct format.';
                        $scope.okFun = function () {
                            $('.hnj-form .hnj-tankuang').css({ 'display': 'none' });
                        }
                    }
                    //for (var k = 0; k < $scope.imgArrType.length; k++) {//判断格式
                    //    if ($scope.imgArrType[k] == 'png' || $scope.imgArrType[k] == 'jpg' || $scope.imgArrType[k] == 'jpeg' || $scope.imgArrType[k] == 'gif') {
                    //        // $scope.imgArr.push('https://'+obj[j]);
                    //        if ($scope.imgArr.length > 10) {
                    //            $scope.imgArr.slice(10);
                    //            setTimeout(function () {
                    //                $('.img > ul > li').slice(10).hide();
                    //            }, 300);
                    //            $scope.submitTipMessage = 'You can only upload up to 10 images.';
                    //            $('.hnj-form .hnj-tankuang').css({'display': 'block'});
                    //            $scope.okFun = function () {
                    //                $('.hnj-form .hnj-tankuang').css({'display': 'none'});
                    //            }
                    //            $scope.df = function ($event) {
                    //                $event.preventDefault();
                    //            }
                    //        }
                    //    } else {
                    //        //$scope.imgArr = [];
                    //        console.log($scope.imgArr[k]);
                    //        $scope.imgArr.splice(k,1);
                    //        //$scope.imgArrType.splice(k,1);
                    //        $scope.isphoto = true;//判断如果不是图片的弹框  显示
                    //        $('.hnj-form .hnj-tankuang').css({'display': 'block'});
                    //        $scope.submitTipMessage = 'Please upload the correct format.';
                    //        $scope.okFun = function () {
                    //            $('.hnj-form .hnj-tankuang').css({'display': 'none'});
                    //        }
                    //    }
                    //}

                }

            };

            function err(n) {
                console.log(n)
            };
            // console.log($scope.imgArr);
        }
        $scope.isimgcloFun = function () {
            $scope.isphoto = false;//判断如果不是图片的弹框  关闭
        }
        // 图片预览和删除
        // $scope.dpreviewImg=function($event){
        //     // var imgPT=($('.img-preview-wrap').height()-$('.img-preview-wrap img').height())/2
        //     var previewSrc = $($event.target).attr('src');
        //     console.log(previewSrc);
        //     $('.img-preview-wrap').css({'display':'block'});
        //     $('.img-preview-wrap img').css({'marginTop': '10%'});
        //     $scope.previewSrc=previewSrc;
        //     $scope.previewWrapFun=function (){
        //         $('.img-preview-wrap').css({'display':'none'});
        //     }
        // }
        $scope.previewImg = function ($event) {
            // var imgPT=($('.img-preview-wrap').height()-$('.img-preview-wrap img').height())/2
            var previewSrc = $($event.target).parent().parent().children('img').attr('src');
            console.log(previewSrc);
            $('.img-preview-wrap').css({ 'display': 'block' });
            //$('.img-preview-wrap img').css({'marginTop': '10%'});
            $scope.previewSrc = previewSrc;

            $scope.previewWrapFun = function () {
                $('.img-preview-wrap').css({ 'display': 'none' });
            }
        }

        $scope.deleteImg = function (idx) {
            $scope.imgArr.splice(idx, 1);
        }

        $scope.changeStatusFun = function (type) {
            //var sendData={
            //    id:$scope.updateId,
            //    disposeStatus:type
            //}
            erp.getFun('pojo/issue/dispose?id=' + $scope.updateId + '&disposeStatus=' + type, function (data) {
                console.log(data.data);
                if (data.data.statusCode == '200') {
                    layer.msg('成功');
                    $scope.closRrecordMsgFun();
                    getIssueList();
                } else {
                    layer.msg('操作失败')
                }

            }, function () {
                layer.msg('网络错误');
            });
        }
        //点击消息记录
        $scope.recordMsgFun = function (index, item) {
            var recordMsgID = $scope.waitcjreplylist[index].ID;
            $scope.nowStatus = $scope.waitcjreplylist[index].STATUS;
            $scope.nowType = $scope.waitcjreplylist[index].TYPE;
            $scope.firNameWord = $scope.waitcjreplylist[index].ACCOUNTEMAIL.slice(0, 1).toUpperCase();
            $scope.DISPOSESTATUS = $scope.waitcjreplylist[index].DISPOSESTATUS;
            console.log($scope.firNameWord);
            $scope.updateId = recordMsgID
            //$('.recordMsg-bottom').attr('data-id',recordMsgID);
            $scope.userLeveldj = item.userLevel;
            $scope.cunLeveldj = item.cunLevel;
            $scope.moneyLeveldj = item.moneyLevel;
            $scope.ACCOUNTEMAIL = item.ACCOUNTEMAIL;
            $scope.ESTIMATE = item.ESTIMATE?item.ESTIMATE:''
            $scope.ESTIMATEEXPLAIN = item.ESTIMATEEXPLAIN?item.ESTIMATEEXPLAIN:''
            $scope.estimateDate = item.estimateDate?item.estimateDate.time:''
            $(".recordMsg").css("display", "block");
            erp.getFun('pojo/issue/getIssueMessageErp?id=' + recordMsgID, con, err);

            function con(res) {
                if (res.data.result) {
                    var obj = JSON.parse(res.data.result);
                    console.log(obj);
                    console.log(obj[0].ATTACHMENT);
                    $scope.recordMsgArr = obj;
                    $scope.tdetailDate = obj[0].MESSAGEDATE.time;
                    if ($scope.recordMsgArr[0].OPERATOREN) {
                        $scope.imgName = $scope.recordMsgArr[0].OPERATOREN ? $scope.recordMsgArr[0].OPERATOREN.slice(0, 1).toUpperCase() : '';
                    }
                    for (var i = 0; i < $scope.recordMsgArr.length; i++) {
                        if ($scope.recordMsgArr[i].STATUS == '1') {
                            $scope.ywyName = $scope.recordMsgArr[i].OPERATOREN ? $scope.recordMsgArr[i].OPERATOREN.slice(0, 1).toUpperCase() : '';
                        }
                        if ($scope.recordMsgArr[i].ATTACHMENT) {
                            $scope.recordMsgArr[i].ATTACHMENT = $scope.recordMsgArr[i].ATTACHMENT.split(',');
                        }
                    }
                } else {
                    $scope.recordMsgArr = [];
                }
                // var obj = JSON.parse(res.data.result);
                // console.log(obj);
                // console.log(obj[0].ATTACHMENT);
                // $scope.recordMsgArr = obj;
                // $scope.tdetailDate = obj[0].MESSAGEDATE.time;
                // if ($scope.recordMsgArr[0].OPERATOREN) {
                //     $scope.imgName = $scope.recordMsgArr[0].OPERATOREN.slice(0, 1).toUpperCase();
                // }
                // for (var i = 0; i < $scope.recordMsgArr.length; i++) {
                //     if ($scope.recordMsgArr[i].STATUS == '1') {
                //         $scope.ywyName = $scope.recordMsgArr[i].OPERATOREN.slice(0, 1).toUpperCase();
                //     }
                //     if ($scope.recordMsgArr[i].ATTACHMENT) {
                //         $scope.recordMsgArr[i].ATTACHMENT = $scope.recordMsgArr[i].ATTACHMENT.split(',');
                //     }
                // }
                //回复
                $scope.replyMsg = function () {
                    $scope.newimgArr = $scope.imgArr.toString();
                    console.log($scope.newimgArr)

                    $scope.message = $('#replyworld').val();
                    console.log($scope.message);
                    if ($scope.message == '') {
                        layer.msg('请填写信息');
                    } else {
                        erp.postFun('pojo/issue/erpReply', {
                            "id": recordMsgID,
                            "message": $scope.message,
                            "attachment": $scope.newimgArr
                        }, cjReply, err);

                        function cjReply(data) {
                            console.log(data);
                            console.log(data.data.statusCode);
                            if (data.data.statusCode == "200") {
                                layer.msg("回复成功");
                                location.reload();
                            } else {
                                // alert("回复失败");
                                layer.msg(data.data.message);
                            }
                        }

                        function err(data) {
                            layer.msg("网络错误");
                        }

                    }

                }

                //挂起
                $scope.hangupMsg = function () {
                    console.log(recordMsgID);
                    var index = layer.confirm('请确认是否挂起？', {
                        btn: ['确认', '取消'] //按钮
                    }, function () {
                        erp.getFun("pojo/issue/hangUp?id=" + recordMsgID, hangup, err);

                        function hangup(data) {
                            console.log(data);
                            if (data.data.statusCode === "200") {
                                layer.msg("挂起成功");
                                location.reload();

                            } else {
                                layer.msg("挂起失败");
                                layer.msg(data.data.message);
                            }
                        };

                        function err(data) {
                            layer.msg("网络错误");
                        }
                    }, function () {
                        layer.close(index);
                    });
                }

                //图片预览
                $scope.dpreviewImg = function ($event) {
                    var previewSrc = $($event.target).attr('src');
                    console.log(previewSrc);
                    $('.img-preview-wrap').css({ 'display': 'block' });
                    $('.img-preview-wrap img').css({ 'marginTop': '10%' });
                    $scope.previewSrc = previewSrc;

                    $scope.previewWrapFun = function () {
                        $('.img-preview-wrap').css({ 'display': 'none' });
                    }
                }

            };

            function err(res) {
                layer.msg('网络错误');
            }

        }
        $scope.closRrecordMsgFun = function () {
            $(".recordMsg").css("display", "none");
        }

        

        $scope.classResult = function (status) {
            if (status == '0') {
                return '待解决';
            } else if (status == '1') {
                return '已解决';
            } else if (status == '2') {
                return '处理中';
            }
        }
        $scope.evaluateVal = ""

        // 请求数据的函数
        function gongdanPost() {
            console.log($scope.status);
            erp.postFun('pojo/issue/getIssueErp', {
                "status": $scope.status,
                "inputStr": $scope.searchMSG,
                "pageNum": $scope.pagenum + '',
                "pageSize": $scope.pagesize,
                "type": $scope.type,
                "estimate": $scope.evaluateVal
            }, gdcon, err);

            function gdcon(data) {
                console.log(data);
                if (data.data.statusCode == '200') {
                    var list = JSON.parse(data.data.result);
                    console.log(list);
                    $scope.totalNum = list[0].totle;
                    $scope.waitcjreplylist = list[0].issues;
                    console.log($scope.totalNum);
                    console.log($scope.waitcjreplylist);
                } else {
                    layer.msg('查询失败');
                    return;
                }

                console.log(list);
                console.log(list[0].issues);
                console.log($scope.totalNum);
                if ($scope.totalNum == '0') {
                    layer.msg('暂无数据');
                    $scope.waitcjreplylist = [];
                    return;
                } else if (data.data.statusCode == "200") {
                    pageFun($(".pagegroup"), list[0].totle, $scope.pagesize - 0, $scope.pagenum - 0, function (n, type) {
                        $scope.pagenum = n;
                        console.log($scope.pagenum);
                        if (type == 'init') {
                            return;
                        }
                        erp.postFun('pojo/issue/getIssueErp', {
                            "status": $scope.status,
                            "inputStr": $scope.searchMSG,
                            "pageNum": $scope.pagenum + '',
                            "pageSize": $scope.pagesize,
                            "type": $scope.type,
                            "estimate":$scope.evaluateVal
                        }, pagecon, err);

                        function pagecon(data2) {
                            console.log(data2);
                            var list2 = JSON.parse(data2.data.result);
                            if (data2.data.statusCode == "200") {
                                console.log(list2);
                                console.log(list2[0].issues);
                                $scope.waitcjreplylist = list2[0].issues;
                            } else if (data2.data.statusCode === "506") {
                                layer.msg("查询失败");
                            }
                        }

                        function err(data2) {
                            layer.msg("网络错误");
                        }
                    })
                } else if (data.data.statusCode == "506") {
                    layer.msg("查询失败");
                }

            };

            function err(data) {
                console.log(data);
                layer.msg("网络错误");
            };

        }

        $scope.classPerson = function (p) {
            if (p) {
                return p;
            } else {
                return '--'
            }
        }

        //分页函数
        function pageFun(node, totalnum, pagesize, currentnum, change) {
            // console.log(node,totalnum,pagesize,currentnum,change)
            node.jqPaginator({
                totalCounts: totalnum,//总条数
                pageSize: pagesize,//一页多少条
                visiblePages: 5,//设置最多显示的页码
                currentPage: currentnum,//当前的页码
                activeClass: 'current',//当前页码样式
                first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
                prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
                next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
                last: '<a class="prev" href="javascript:void(0);">&gt;&gt;<\/a>',
                page: '<a href="javascript:void(0);">{{page}}<\/a><\/li>',
                onPageChange: change
            });
        }
    }])
    //查看聊天
    app.controller('lookchartCtrl', ['$scope', 'erp', '$timeout', function ($scope, erp, $timeout) {
        //分页相关
        $scope.searchinfo = '';
        $scope.pagesize = '20';
        $scope.pagenum = '1';
        $scope.msgpagesize = '20';
        $scope.msgpagenum = '1';
        $scope.pagenumarr = [10, 20, 30, 50];
        $scope.totalCounts = null;
        $scope.ischat = false;
        $scope.msgLsit = [];
        $scope.msg = null;
        $scope.customerType = 'cj';
        getList();
        $scope.chanType = function () {
            $scope.pagenum = '1';
            getList();
        };

        function getList() {
            var sendUrl;
            if ($scope.customerType == 'cj' || $scope.customerType == 'fenxiao') {
                //sendUrl = 'app/account_erp/seaarchCustomer';
                sendUrl = 'erp/message/searchCustomer';
                getCJ(sendUrl);
            } else {
                sendUrl = 'app/account_erp/seaarchCustomerTempl';
                gettemp(sendUrl)
            }

        }

        function getCJ(sendUrl) {
            erp.load();
            var sendDate = {
                'name': $scope.searchinfo,
                "page": $scope.pagenum + '',
                "limit": $scope.pagesize
            }
            if($scope.customerType == 'cj'){
                sendDate.customerType = '1';
            }else if($scope.customerType == 'fenxiao'){
                sendDate.customerType = '2';
            }
            erp.postFun(sendUrl, JSON.stringify(sendDate), video, err);

            function video(n) {
                console.log(n);
                erp.closeLoad();
                if (n.data.statusCode == '200') {
                    $scope.dataList = n.data.result.list.map(item => {
                        item.isact = false
                        item.eecontent = decodeURIComponent(item.eecontent)
                        item.accontent = decodeURIComponent(item.accontent)
                        return item
                    })
                    console.log($scope.dataList);
                    $scope.totalCounts = n.data.result.count || 1;
                    pageFun();
                }

            }

            function err(n) {
                erp.closeLoad();
                layer.msg("网络错误")
            }
        }

        function gettemp(sendUrl) {
            var sendData = {
                'name': $scope.searchinfo,
                "page": $scope.pagenum + '',
                "limit": $scope.pagesize
            };
            erp.load();
            erp.postFun(sendUrl, JSON.stringify(sendData), function (data) {
                erp.closeLoad();
                if (data.data.code == 'CODE_200') {
                    $scope.dataList = data.data.list.map(item => {
                        item.isact = false
                        item.eecontent = decodeURIComponent(item.eecontent)
                        item.accontent = decodeURIComponent(item.accontent)
                        return item
                    })
                    $scope.totalCounts = data.data.count || 1;
                    pageFun();
                }
            }, function () {
                erp.closeLoad();
                layer.msg("网络错误")
            });
        }

        function getmsg(item) {
            var sendUrl;
            if ($scope.customerType == 'cj') {
                sendUrl = 'app/account_erp/seaarchChat';
            } else {
                sendUrl = 'app/account_erp/seaarchChatTempl';
            }
            erp.load();
            erp.postFun(sendUrl, {
                "acpid": item.acpid,
                'page': $scope.msgpagenum,
                'limit': $scope.msgpagesize
            }, function (res) {
                if (res.data.code == 'CODE_200') {
                    erp.closeLoad();
                    $scope.msgLsit = res.data.list.map(msg => {
                        msg.isku = msg.fromProductId === item.acpid
                        msg.msgContent = decodeURIComponent(msg.msgContent)
                        return msg
                    })
                    console.log($scope.msgLsit)
                    $scope.msgcount = res.data.count;
                    msgpageFun()
                }
            }, function (res) {
                erp.closeLoad();
            });
        }

        $scope.look = function (item) {
            console.log(item)
            $scope.msgpagenum = '1';
            $scope.msgLsit = [];
            $scope.msg = item;
            $scope.ischat = true;
            getmsg(item);
        }
        //搜索
        $scope.SearchBtn = function () {
            $scope.pagenum = '1';
            console.log($scope.searchinfo);
            getList();
        }
        //按下enter搜索
        $(function () {
            $(".search-text-box").keydown(function (event) {
                if (event.keyCode === 13 || event.keyCode === 108) {
                    $scope.pagenum = '1';
                    getList();
                }
            });
        })
        //更换每页多少条数据
        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            // $scope.pagesize=pagesize-0;
            $scope.pagenum = 1;
            getList();
        }
        //手动输入页码GO跳转
        $scope.pagenumchange = function () {
            var pagenum = Number($scope.pagenum)
            var totalpage = Math.ceil($scope.totalCounts / $scope.pagesize);
            if (pagenum > totalpage) {
                layer.msg('错误页码')
                $scope.pagenum = 1;
            } else {
                getList();
            }
        }
        //===========
        $scope.msgpagechange = function (pagesize) {
            $scope.msgpagenum = 1;
            getmsg($scope.msg);
        }
        $scope.msgpagenumchange = function () {
            if ($scope.msgpagenum == "" || $scope.msgpagenum == null || $scope.msgpagenum == undefined){
                layer.msg("错误页码");
                return;
            }
            if ($scope.msgpagenum == 0){
                $scope.msgpagenum = 1;
            }
            var pagenum = Number($scope.msgpagenum)
            var totalpage = Math.ceil($scope.msgcount / $scope.msgpagesize);
            if (pagenum > totalpage) {
                layer.msg('错误页码')
                $scope.msgpagenum = 1;
            } else {
                getmsg($scope.msg);
            }
        }

        //分页函数
        function pageFun() {
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.totalCounts || 1,
                pageSize: $scope.pagesize * 1,
                visiblePages: 5,
                currentPage: $scope.pagenum * 1,
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
                    $scope.pagenum = n;
                    getList();
                }
            });
        }

        function msgpageFun() {
            $(".msgpagegroup").jqPaginator({
                totalCounts: $scope.msgcount || 1,
                pageSize: $scope.msgpagesize * 1,
                visiblePages: 5,
                currentPage: $scope.msgpagenum * 1,
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
                    $scope.msgpagenum = n;
                    getmsg($scope.msg);
                }
            });
        }

        $scope.trClick = function (item) {
            if (item.isact) {
                item.isact = false;
            } else {
                item.isact = true;
            }
        }
        $scope.linktourl = function (txt) {
            var isimg = /\.(png|jpeg|gif|svg|jpg|JPG|PNG|JPEG|GIF|SVG)(\?.*)?$/
            var isurl = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
            var rex = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-|#|%|:)+)/g;
            if (isimg.test(txt)) {
                txt = txt.replace(rex, "<img width='90' src='$1$2' >").replace(/\n/g, "<br />")
            } else if (isurl.test(txt)) {
                txt = txt.replace(rex, "<a href='$1$2' target='_blank' >$1$2</a>").replace(/\n/g, "<br />")
            }
            return txt;
        }
        $scope.CompareDate = function (d1, d2) {
            if (!d2) {
                return true;
            } else {
                if (d1 && d2) {
                    return ((new Date(d1.replace(/-/g, "\/"))) > (new Date(d2.replace(/-/g, "\/"))));
                } else {
                    return true;
                }
            }
        }
        $scope.isHF = function (txt) {
            if (!txt) {
                return '未回复';
            } else {
                return txt;
            }
        }
        $scope.isred = function (txt) {
            if (!txt) {
                return true;
            } else {
                return false;
            }
        }
    }])
    //视频上传
    app.controller('videoctrl', ['$scope', 'erp', '$timeout', function ($scope, erp, $timeout) {
        console.log("videoctrl");
        //分页相关
        $scope.searchinfo = '';
        $scope.pagesize = '20';
        $scope.pagenum = '1';
        $scope.pagenumarr = [10, 20, 30, 50];
        $scope.totalCounts;
        $scope.miaoshu = false;
        $scope.MStitle = '';
        $scope.MSIntroduction = '';
        $scope.MScontent = '';
        getList();

        //
        function getList() {
            erp.postFun('pojo/promotionVideo/erpVideos', {
                "inputStr": $scope.searchinfo,
                "pageNum": $scope.pagenum,
                "pageSize": $scope.pagesize,
                "status": "1"
            }, video, err);

            function video(n) {
                var obj = JSON.parse(n.data.result);
                console.log(obj);
                $scope.videoList = obj.videos;
                $scope.totalCounts = obj.totle;
                $scope.totalNum = obj.totle;
                $scope.totalpage = function () {
                    return Math.ceil($scope.totalCounts / $scope.pagesize)
                }
                pageFun();
            }

            function err(n) {
                layer.msg("网络错误")
            }
        }

        //搜索
        $scope.SearchBtn = function () {
            $scope.pagenum = '1';
            console.log($scope.searchinfo);
            getList();
        }
        //按下enter搜索
        $(function () {
            $(".search-text-box").keydown(function (event) {
                if (event.keyCode === 13 || event.keyCode === 108) {
                    $scope.pagenum = '1';
                    getList();
                }
            });
        })
        //点击上传视频的链接
        $scope.videoUplaode = function () {
            var text1 = $(".video-text2>textarea").val();
            var text2 = $(".video-text3>textarea").val();
            if (!$.trim($(".video-text2>textarea").val())) {
                layer.msg('请上传主题')
                return
            }
            if (!$.trim($(".video-text3>textarea").val())) {
                layer.msg('请上传链接')
                return
            }
            console.log(text1, text2);
            erp.postFun('pojo/promotionVideo/add', { "title": text1, "videoUrl": text2 }, function (data) {
                console.log(data);
                if (data.status == 200) {
                    layer.msg('上传成功', { shift: -1 });
                    $scope.uplaode = false;
                    $(".video-text2>textarea").val("");
                    $(".video-text3>textarea").val("");
                    getList();
                }
            }, function (err) {
                console.log(err)
            })
        }
        //排序
        $scope.videoOrderno = function (item) {
            $scope.serialDialog = true;
            $scope.serialNo = item.orderno;
            $scope.serialSure = function () {
                erp.postFun('pojo/promotionVideo/updateOrderno', {
                    id: item.id,
                    orderno: $scope.serialNo
                }, function (data) {
                    if (data.data.statusCode == 200) {
                        $scope.serialDialog = false;
                        layer.msg('操作成功', { shift: -1 });
                        getList();
                    }
                }, function (data) {
                    alert("网络错误")
                });
            }
        }
        //删除
        $scope.videoremovet = false;
        $scope.videoRemove = function (item, ev) {
            //删除的弹框
            $scope.videoremovet = true;
            //取消
            $scope.videoremoveFalse = function () {
                $scope.videoremovet = false;
            }
            //确定
            $scope.videoremoveSure = function () {
                erp.postFun('pojo/promotionVideo/erpDelete', { id: item.id }, function (data) {
                    if (data.data.statusCode == 200) {
                        $scope.videoremovet = false;
                        layer.msg('成功删除', { shift: -1 });
                        getList();
                    }
                }, function (data) {
                    alert("网络错误")
                });
            }
        }
        //更换每页多少条数据
        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            // $scope.pagesize=pagesize-0;
            $scope.pagenum = 1;
            getList();
        }
        //手动输入页码GO跳转
        $scope.pagenumchange = function () {
            console.log($scope.pagenum % 1)
            $scope.pagenn = $(".goyema").val();
            if ($scope.pagenum < 1) {
                alert('错误页码')
            } else {
                getList();
            }
        }

        //分页函数
        function pageFun() {
            // console.log($scope.customerList4.total,$scope.pagesize)
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.totalCounts || 1,
                pageSize: $scope.pagesize * 1,
                visiblePages: 5,
                currentPage: $scope.pagenum * 1,
                activeClass: 'current',
                first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
                prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
                next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
                last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
                page: '<a href="javascript:void(0);">{{page}}<\/a>',
                onPageChange: function (n) {
                    $scope.pagenum = n;
                    // $("#pagination-demo-text").html("当前第" + n + "页");
                    erp.postFun('pojo/promotionVideo/erpVideos', {
                        "inputStr": $scope.searchinfo,
                        "pageNum": $scope.pagenum,
                        "pageSize": $scope.pagesize,
                        "status": "1"
                    }, function (data) {
                        var obj = JSON.parse(data.data.result);
                        console.log(obj);
                        $scope.videoList = obj.videos;
                    }, function (data) {
                        alert("分页错误")
                    });

                }
            });
        }
    }])
    //文章上传
    app.controller('articlectrl', ['$scope', 'erp', '$timeout', function ($scope, erp, $timeout) {
        //分页相关
        $scope.searchinfo = '';
        $scope.pagesize = '20';
        $scope.pagenum = '1';
        $scope.pagenumarr = [10, 20, 30, 50];
        $scope.totalCounts;
        $scope.miaoshu = false;
        $scope.MStitle = '';
        $scope.MSIntroduction = '';
        $scope.MScontent = '';
        
		    $scope.title = ''
		    $scope.contentUrl = ''
	      $scope.tableItem = null
	      $scope.isShowModal = false
        getList();

        //
        function getList() {
            erp.postFun('pojo/promotionContent/erpContents', {
                "inputStr": $scope.searchinfo,
                "pageNum": $scope.pagenum + '',
                "pageSize": $scope.pagesize,
                "status": "1"
            }, video, err);

            function video(n) {
                var obj = JSON.parse(n.data.result);
                console.log(obj);
                $scope.videoList = obj.videos;
                $scope.totalCounts = obj.totle || 1;
                $scope.totalNum = obj.totle;
                $scope.totalpage = function () {
                    return Math.ceil($scope.totalCounts / $scope.pagesize)
                }
                pageFun();
            }

            function err(n) {
                layer.msg("网络错误")
            }
        }

        //搜索
        $scope.SearchBtn = function () {
            $scope.pagenum = '1';
            console.log($scope.searchinfo);
            getList();
        }
        //按下enter搜索
        $(function () {
            $(".search-text-box").keydown(function (event) {
                if (event.keyCode === 13 || event.keyCode === 108) {
                    $scope.pagenum = '1';
                    getList();
                }
            });
        })
	    
        // 新增/编辑弹窗确认
        $scope.handleConfirm = function () {
	        if (!$scope.title) {
                layer.msg('请上传主题')
                return
            }
	        if (!$scope.contentUrl) {
                layer.msg('请上传链接')
                return
            }
	        if ($scope.tableItem) { // 编辑
		        const parmas = {
			        id:  $scope.tableItem.id,
			        title: $scope.title,
			        contentUrl: $scope.contentUrl
		        }
		        erp.postFun('pojo/promotionContent/updateErpContents', parmas, res => {
			        if(res.data.statusCode === '200'){
				        $scope.isShowModal = false
				        layer.msg('编辑成功')
				        getList();
			        }
		        }, err => {
			
		        })
	        } else { // 新增
		        erp.postFun('pojo/promotionContent/add', {
			        "title": $scope.title,
			        "contentUrl": $scope.contentUrl
		        }, function (data) {
			        if (data.status == 200) {
				        layer.msg('上传成功', { shift: -1 });
				        $scope.isShowModal = false;
				        getList();
			        }
		        }, function (err) {
			        console.log(err)
		        })
	        }
        }
        
        //删除
        $scope.videoremovet = false;
        $scope.videoRemove = function (item, ev) {
            //删除的弹框
            $scope.videoremovet = true;
            //取消
            $scope.videoremoveFalse = function () {
                $scope.videoremovet = false;
            }
            //确定
            $scope.videoremoveSure = function () {
                erp.getFun('pojo/promotionContent/erpDelete?id=' + item.id, function (data) {
                    $scope.videoremovet = false;
                    layer.msg('成功删除', { shift: -1 });
                    getList();
                }, function (data) {
                    alert("网络错误")
                });
            }

        };
        //更换每页多少条数据
        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            // $scope.pagesize=pagesize-0;
            $scope.pagenum = 1;
            getList();
        };
        //手动输入页码GO跳转
        $scope.pagenumchange = function () {
            console.log($scope.pagenum % 1);
            $scope.pagenn = $(".goyema").val();
            if ($scope.pagenum < 1) {
                alert('错误页码')
            } else {
                getList();
            }
        };
	
		    // 新增
		    $scope.handleAdd = () => {
			    $scope.isShowModal = true
			    $scope.tableItem = null
			    $scope.title = ''
			    $scope.contentUrl = ''
		    }
		    // 编辑
		    $scope.handleEidt = item => {
			    $scope.isShowModal = true
			    $scope.tableItem = item
			    $scope.title = item.title
			    $scope.contentUrl = item.contentUrl
		    }
	  

        //分页函数
        function pageFun() {
            // console.log($scope.customerList4.total,$scope.pagesize)
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.totalCounts,
                pageSize: $scope.pagesize * 1,
                visiblePages: 5,
                currentPage: $scope.pagenum * 1,
                activeClass: 'current',
                first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
                prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
                next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
                last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
                page: '<a href="javascript:void(0);">{{page}}<\/a>',
                onPageChange: function (n) {
                    $scope.pagenum = n;
                    // $("#pagination-demo-text").html("当前第" + n + "页");
                    erp.postFun('pojo/promotionContent/erpContents', {
                        "inputStr": $scope.searchinfo,
                        "pageNum": $scope.pagenum + '',
                        "pageSize": $scope.pagesize,
                        "status": "1"
                    }, function (data) {
                        var obj = JSON.parse(data.data.result);
                        console.log(obj);
                        $scope.videoList = obj.videos;
                    }, function (data) {
                        alert("分页错误")
                    });

                }
            });
        }
    }])

    app.controller("assessstandardctrl", ['$scope', 'erp', '$timeout', 'utils', function ($scope, erp, $timeout, utils) {
        console.log("assessstandardctrl");
        $scope.pageSize = '20';//每页显示多少条
        $scope.pageNum = '1';//当前页
        $scope.totalPageNum = 0;//
        $scope.searchinfo = '';//搜索框关键字
        $scope.pagenumarr = [10, 20, 30, 50];
        $scope.totalCounts = null;
        $scope.clickSatisfacrion = false;
        $scope.clickScorefacrion = false;
        $scope.searchDate = '';
        $scope.detailpageNum = '1';
        $scope.detailpageSize = '20';
        $scope.zhpfpageNum = '1';
				$scope.zhpfpageSize = '20';
				/*** 在线时长参数 */
        $scope.showFlag = false
        $scope.timePageNum = '1'
        $scope.timePageSize = '5'
        $scope.timeNameen = ''
        $scope.timeList = []
        $scope.tiemTotalCounts = 0

        $scope.dateType = '0';

				$scope.searchDate = FormatDate(new Date());

				/** 2019-12-10 查看当前上下线记录 */
				$scope.lineFlag = false
				$scope.lineList = []
				$scope.showLineDetail = item => {
					const { begintime, ename, endtime } = item
					const params = {
						nameen: ename,
						startTime: begintime,
						endTime: endtime
					}
					erp.postFun('app/message/loginTimeLog', JSON.stringify(params), ({ data }) => {
						const { data: result = [] } = data
						const list = result.map(item => {
							item.date = utils.changeTime(item.date, false)
							item.date_time = utils.changeTime(item.date_time, true)
							return item
						})
						console.log(list)
						$scope.lineList = list
						$scope.lineFlag = true
					}, _ => console.log('网络错误'), { layer: true })
				}
				
				/** 2019-11-08 查看未读消息 */
				$scope.noReplyFlag = false
				$scope.noReplyNameen = '',
				$scope.noReplyPageNum = 1,
				$scope.noReplyPageSize = 5,
				$scope.noReplyList = []
				$scope.lookNoReply = item => {
					const { nameen, noreplyCount } = item
					if (noreplyCount === 0) {
						layer.msg('没有可以查看的未读次数')
					} else {
						$scope.noReplyNameen = nameen
						$scope.noReplyFlag = true
						getNoReplyList()
					}
				}

				//获取未读次数详情列表
				function getNoReplyList () {
					const params = {
						nameen: $scope.noReplyNameen,
						startTime: `${$scope.searchDate.split('#')[0]} 00:00:00`,
						endTime: `${$scope.searchDate.split('#')[1]} 23:59:59`,
						pageNum: $scope.noReplyPageNum,
						pageSize: $scope.noReplyPageSize
					}
					erp.postFun('app/message/getBaseNoreplyList', JSON.stringify(params), res => {
						const { statusCode, data: list, count } = res.data
						if (statusCode === '200') {
							$scope.noReplyList = list.map(item => {
								const {createDate: {time}} = item
								item.msgContent = decodeURIComponent(item.msgContent)
								item.createDate = utils.changeTime(time, true)
								return item
							})
							$scope.noReplyTotalCounts = count
							noReplyPageFun()
						}
						
					}, _ => {
						console.log('网络错误')
					}, { layer: true })
				}
				function noReplyPageFun() {
			    $('.noReplyPagegroup').jqPaginator({
				    totalCounts: $scope.noReplyTotalCounts || 1,
				    pageSize: $scope.noReplyPageSize * 1,
				    visiblePages: 5,
				    currentPage: $scope.noReplyPageNum * 1,
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
					    $scope.noReplyPageNum = n;
					    getNoReplyList();
				    }
			    });
		    }

		    $scope.noReplyPagenumchange = function () {
			    var pagenum = Number($scope.noReplyPageNum);
			    var totalpage = Math.ceil($scope.noReplyTotalCounts / $scope.noReplyPageSize);
			    if (pagenum > totalpage) {
			    	layer.msg('错误页码');
			    	$scope.noReplyPageNum = 1;
			    } else {
			    	noReplyPageFun();
			    }
		    };
				
				/******************************************************* */
        var name;
        getselectopt();
        // getList();

        $('#selectDateType').change(function(e){
            var val = $(this).val();
            $scope.dateType = val;
            $scope.$apply();
        });
        //getOnlineYw();
        //function getOnlineYw(){
        //    var chatIp = 'http://192.168.5.150:3000/';
        //    var date=new Date();
        //    var timer=date.getTime().toString();
        //    var geturl = chatIp+"app/getOnlineKf?date="+timer;
        //    $.get(geturl,function(data){
        //        //console.log(data);
        //    });
				//}
				/** ********************** 在线时长弹窗 *************************************** */
		    $scope.lookScoremun = item => {
			    const { nameen } = item
			    $scope.timeNameen = nameen
			    $scope.showFlag = true
			    $scope.timePageNum = '1'
			    getLoginTimeDetail()
		    }

		    //获取列表
		    function getLoginTimeDetail() {
			    const params = {
				    nameen: $scope.timeNameen,
				    pageNo: Number($scope.timePageNum),
				    pageSize: Number($scope.timePageSize)
			    }
			    erp.postFun('app/message/getLoginTimeDetail', JSON.stringify(params), res => {
				    const { data, statusCode } = res.data
				    if (statusCode === '200') {
					    const { count, list } = data
					    $scope.timeList = list.map(item => {
						    const { begintime, endtime, nigth_type, count } = item
						    item.begintime = utils.changeTime(begintime.time, true)
							item.endtime = utils.changeTime(endtime.time, true)
                            item.nigth_type = nigth_type ? nigth_type : 1
                            item.count = (count / 12).toFixed(2)
						    return item
					    })
					    $scope.tiemTotalCounts = count
					    timepageFun()
				    }
			    }, error => {
				    layer.msg('网络错误')
			    }, { layer: true })
		    }

		    function timepageFun() {
			    $('.zxscpagegroup').jqPaginator({
				    totalCounts: $scope.tiemTotalCounts || 1,
				    pageSize: $scope.timePageSize * 1,
				    visiblePages: 5,
				    currentPage: $scope.timePageNum * 1,
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
					    $scope.timePageNum = n;
					    getLoginTimeDetail();
				    }
			    });
		    }

		    $scope.timepagenumchange = function () {
			    var pagenum = Number($scope.timePageNum);
			    var totalpage = Math.ceil($scope.tiemTotalCounts / $scope.timePageSize);
			    if (pagenum > totalpage) {
			    	layer.msg('错误页码');
			    	$scope.timePageNum = 1;
			    } else {
			    	getLoginTimeDetail();
			    }
		    };

		    /** ************************************************************************** */


        $scope.checkDeatails = function (data) {
            name = data;
            $scope.clickSatisfacrion = true;
            getdetailList();

            //data.name = name;

        };
        $scope.checkZhpf = function (data) {
            //console.log('综合评分');
            name = data;
            $scope.clickScorefacrion = true;
            getZhpfList();
        };
        
        $scope.zhouQiFun = function () {
            $scope.searchDate = $('.search-select').val();
            console.log($scope.searchDate);
            // $scope.pageNum = 1;
            // getList();
        }

        function getselectopt() {
            var sendUrl = 'app/message/getScoreCycle';
            var data = {};
            erp.postFun(sendUrl, data, video, err);

            function video(data) {
                erp.closeLoad();
                var SelectList = JSON.parse(data.data.result);
                //console.log(SelectList);
                $.each(SelectList, function (i, v) {
                    //console.log(v);
                    v.startDate = v.startDate.split(' ')[0];
                    v.endDate = v.endDate.split(' ')[0];
                    //console.log(v.startDay, v.endDay);
                });
                $scope.selectList = SelectList;
                console.log($scope.selectList)
                $scope.selZqVal = $scope.selectList[$scope.selectList.length - 1].startDate + '#' + $scope.selectList[$scope.selectList.length - 1].endDate;
                $scope.searchDate = $scope.selZqVal;
                getList()
            }

            function err(n) {
                erp.closeLoad();
                layer.msg("网络错误");
            }
        }

        $scope.formatDate = function (time) {
            var createDate = FormatDate(time);

            return createDate;
        };

        function getZhpfList() {
            var sendUrl = 'app/message/scoreEveryDayList';
            var data = {
                "name": name,
                "page": $scope.zhpfpageNum,
                "limit": $scope.zhpfpageSize,
                "startDate": $scope.searchDate.split('#')[0],
                "endDate": $scope.searchDate.split('#')[1]
            };
            erp.load();
            erp.postFun(sendUrl, JSON.stringify(data), video, err);

            function video(data) {
                erp.closeLoad();
                var zhpfList = JSON.parse(data.data.result);
                //console.log(zhpfList);
                $scope.zhpfList = zhpfList.data;
                $scope.zhpftotalCounts = parseInt(zhpfList.count) || 1;
                //console.log(FormatDate(zhpfList.data[0].createat.time));
                $scope.zhpfCount = 0;
                $.each(zhpfList.data, function (i, v) {
                    $scope.zhpfCount += v.score;
                });
                //console.log($scope.zhpftotalCounts);
                zhpfpageFun();
            }

            function err(n) {
                erp.closeLoad();
                layer.msg("网络错误");
            }
        }


        function getdetailList() {
            let sendUrl = 'app/message/insertGradeList'
              , start = $('#c-data-time2').val()
              , end = $('#cdatatime3').val()
              , now = new Date()
              , data = {
                "name": name,
                "page": $scope.detailpageNum,
                "limit": $scope.detailpageSize,
            }

            end = end ? end : utils.changeTime(now.getTime(), false)
	        data = $scope.dateType === '0'
              ? Object.assign(data, {"startDate": $scope.searchDate.split('#')[0], "endDate": $scope.searchDate.split('#')[1]})
              : Object.assign(data, { startDate: start, endDate: end })
            //console.log(data);
            erp.load();
            erp.postFun(sendUrl, JSON.stringify(data), video, err);

            function video(n) {
                erp.closeLoad();
                console.log(n.data.result);
                var detailList = JSON.parse(n.data.result);
                //console.log(detailList);
                $scope.detailList = detailList.data;
                $scope.detailtotalCounts = parseInt(detailList.count) || 0;
                console.log($scope.detailtotalCounts);
                detailpageFun();
            }

            function err(n) {
                erp.closeLoad();
                layer.msg("网络错误");
            }
        }

        $scope.isstatus = function (status, score) {
            var realscore;
            if (status == '0') {

                realscore = '+' + score;
                return realscore;
            } else if (status == '1') {
                realscore = '-' + score;
                return realscore;

            } else if (status == '2') {
                realscore = score;
                return realscore;

            }

        };

        $scope.closeModal = function () {
            //console.log('关闭');
            $scope.clickSatisfacrion = false;
        };
        $scope.closeModal2 = function () {
            $scope.clickScorefacrion = false;
        };

        /*$('.ea-list-table').on('click','.search-date-span',function(){
            console.log('hello');
        });*/
        function getList() {
            var sendUrl = 'app/message/salesmanScoreList';
            var data = {};
            data.name = $scope.searchinfo;
            data.page = $scope.pageNum;
            data.limit = $scope.pageSize;

            if($scope.dateType == '0'){
                //周期
                data.startDate = $scope.searchDate.split('#')[0];
                data.endDate = $scope.searchDate.split('#')[1];
                $scope.startDay = $scope.searchDate.split('#')[0];
                $scope.endDay = $scope.searchDate.split('#')[1];
            }else if($scope.dateType == '1'){
                //日期
                var start = $('#c-data-time2').val();
                var end = $('#cdatatime3').val();
                if(start == '' || start == null || start== undefined){
                    layer.msg('开始日期不能为空');
                    return;
                }else if(end == '' || end == null || end == undefined){
                    var date = new Date();
                    var year = date.getFullYear();
                    var month = date.getMonth()+1;
                    var day = date.getDate();
                    if(month>1 && month<9){
                        month = '0'+month;
                    }
                    if(day>1 && day<9){
                        day = '0'+day;
                    }
                    end = year+'-'+month+'-'+day;
                    data.startDate =start;
                    data.endDate = end;
                    $scope.startDay = start;
                    $scope.endDay = end;
                }else{
                    data.startDate =start;
                    data.endDate = end;
                    $scope.startDay = start;
                    $scope.endDay = end;
                }
            }
            //console.log(data);

            erp.load();
            erp.postFun(sendUrl, JSON.stringify(data), video, err);

            function video(n) {
                erp.closeLoad();
                //console.log(n.data.result);
                var dataList = JSON.parse(n.data.result);
                console.log(dataList);
                $scope.dataList = dataList.data;
                $scope.totalCounts = parseInt(dataList.count) || 1;
                //console.log($scope.dataList);
                //console.log($scope.totalCounts);
                $scope.dataList.forEach(function (o, i) {
                    o.isact = false;
                    //console.log(o.onlineStatus);
                    if (o.onlineStatus == "1") {
                        o.isonline = true;
                    } else {
                        o.isonline = false;
                    }
                });
                pageFun();
            }

            function err(n) {
                erp.closeLoad();
                layer.msg("网络错误")
            }
        }

        function FormatDate(strTime) {
            var date = new Date(strTime);
            var formatedMonth = ("0" + (date.getMonth() + 1)).slice(-2);
            var formatedDate = ("0" + (date.getDate())).slice(-2);
            return date.getFullYear() + "-" + formatedMonth + "-" + formatedDate;
        }

        //搜索
        $scope.usersearch = function () {
            getList();
        };
        //按下enter搜索
        $(function () {
            $(".top-search-inp").keydown(function (event) {
                console.log(event.keyCode);
                if (event.keyCode === 13 || event.keyCode === 108) {
                    getList();
                }
            });
        });
        //更换每页多少条数据
        $scope.pagechange = function (pagesize) {
            //console.log(pagesize)
            // $scope.pagesize=pagesize-0;
            $scope.pageNum = 1;
            getList();
        };
        $scope.detailpagechange = function (detailpageSize) {
            $scope.detailpageNum = 1;

            getdetailList();
        };
        $scope.zhpfpagechange = function (zhpfpageSize) {
            $scope.zhpfpageSize = zhpfpageSize;
            getZhpfList();

        };
        $scope.zhpfpagenumchange = function () {
            var pagenum = Number($scope.zhpfpageNum);
            var totalpage = Math.ceil($scope.zhpftotalCounts / $scope.zhpfpageSize);
            if (pagenum > totalpage) {
                layer.msg('错误页码');
                $scope.zhpfpageNum = 1;
            } else {
                getZhpfList();
            }
        };
        $scope.detailpagenumchange = function () {
            var pagenum = Number($scope.detailpageNum);
            var totalpage = Math.ceil($scope.detailtotalCounts / $scope.detailpageSize);
            if (pagenum > totalpage) {
                layer.msg('错误页码');
                $scope.detailpageNum = 1;
            } else {
                getdetailList();
            }
        };
        //手动输入页码GO跳转
        $scope.pagenumchange = function () {
            var pagenum = Number($scope.pageNum);
            var totalpage = Math.ceil($scope.totalCounts / $scope.pageSize);
            if (pagenum > totalpage) {
                layer.msg('错误页码');
                $scope.pageNum = 1;
            } else {
                getList();
            }
        };

        function zhpfpageFun() {
            $('.zhpfpagegroup').jqPaginator({
                totalCounts: $scope.zhpftotalCounts || 1,
                pageSize: $scope.zhpfpageSize * 1,
                visiblePages: 5,
                currentPage: $scope.zhpfpageNum * 1,
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
                    $scope.zhpfpageNum = n;
                    getZhpfList();
                }
            });
        }

        function detailpageFun() {
            $(".detailpagegroup").jqPaginator({
                totalCounts: $scope.detailtotalCounts || 1,
                pageSize: $scope.detailpageSize * 1,
                visiblePages: 5,
                currentPage: $scope.detailpageNum * 1,
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
                    $scope.detailpageNum = n;
                    getdetailList();
                }
            });
        }

        function pageFun() {
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.totalCounts || 1,
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
                    $scope.pageNum = n;
                    getList();
                }
            });
        }

        $scope.trClick = function (item) {
            if (item.isact) {
                item.isact = false;
            } else {
                item.isact = true;
            }
        }


    }]);

    //快捷回复
    app.controller('fastReplyCtrl', ['$scope', 'erp', '$routeParams', '$location', '$http', function ($scope, erp, $routeParams, $location, $http) {
        console.log('fastReplyCtrl');
        $scope.pageNum = '1';
        $scope.pageSize = '20';
        $scope.title = '';
        $scope.type = "";
        $scope.searchInfo = '';

        $('#searchInput').keypress(function (e) {
            if (e.keyCode == 13) {
                $scope.search()
            }
        })
        $scope.search = function () {
            console.log($scope.searchInfo);
            $scope.title = $scope.searchInfo;
            $scope.pageNum = '1';
            getFastReplyList();

        };
        $scope.classUpdatePeople = function (people) {
            if (people == null || people == '' || people == undefined) {
                return '--';
            } else {
                return people;
            }
        };
        getFastReplyList();

        function getFastReplyList() {
            var data = {
                "limit": $scope.pageSize,
                "page": $scope.pageNum,
                "title": $scope.title,
                "type": $scope.type,
                "typemessage": '0'
            };
            erp.postFun('erp/fastMessage/searchFastMessage', JSON.stringify(data), function (data) {
                if (data.data.code == '200') {
                    var result = data.data.data;
                    console.log(result);
                    $scope.FastReplyList = result.list;
                    $scope.totalCounts = result.count;
                    pageFun();
                } else {
                    layer.msg('查询失败');
                }

            }, function (n) {
                console.log(n);
            });
        }

        function pageFun() {
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.totalCounts || 1,
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
                    $scope.pageNum = n;
                    getFastReplyList();
                }
            });
        }

        //更换每页多少条数据
        $scope.pagesizechange = function (pagesize) {
            //console.log(pagesize)
            // $scope.pagesize=pagesize-0;
            $scope.pageNum = 1;
            getFastReplyList();
        };
        //手动输入页码GO跳转
        $scope.pagenumchange = function () {
            var pagenum = Number($scope.pageNum);
            var totalpage = Math.ceil($scope.totalCounts / $scope.pageSize);
            if (pagenum > totalpage) {
                layer.msg('错误页码');
                $scope.pageNum = 1;
            } else {
                getFastReplyList();
            }
        };
        $scope.classType = function (type) {
            if (type == '1') {
                return "文本";
            } else if (type == '2') {
                return "图片";
            } else if (type == '3') {
                return "附件"
            }
        };
        $scope.classBlock = function (block) {
            if (block == '0') {
                return "启用"
            } else if (block == '1') {
                return "停用"
            }
        };
        //打开新增回复弹窗
        $('#addFastReply').click(function () {
            $('.zzc').show().find('h3').html('新增快捷回复');
            $('#replyName').val('');
            $('#replyType').val('');
            $('#replyText').val('');
            $('#addBtn').show();
            $('#saveBtn').hide();
        });
        //打开修改回复弹窗
        $scope.updateFun = function (reply) {
            $('.zzc').show().find('h3').html('修改快捷回复');
            $('#replyName').val(reply.title);
            $('#replyType').val(reply.type);
            $('#replyText').val(reply.text);
            $('#addBtn').hide();
            $('#saveBtn').show().attr('data-id', reply.id);
        };
        //确认新增
        $scope.addFun = function () {
            var title = $('#replyName').val();
            var type = $('#replyType').val();
            var text = $('#replyText').val();
            if (title == null || title == '' || title == undefined) {
                layer.msg('回复标题不能为空');
            } else if (text == '' || text == null || text == undefined) {
                layer.msg('回复内容不能为空');
            } else {
                var data = {
                    "title": title,
                    "type": '1',
                    "text": text,
                    "typemessage": '0'
                };
                layer.load(2);
                erp.postFun('erp/fastMessage/addFastMessage', JSON.stringify(data), function (data) {
                    console.log(data);
                    if (data.data.code == '200') {
                        $('.zzc').hide();
                        getFastReplyList();
                        layer.closeAll('loading');
                    } else {
                        layer.closeAll('loading');
                        layer.msg('新增失败');
                    }
                }, function (n) {
                    layer.closeAll('loading');
                });
            }
        };

        //确认修改
        $('#saveBtn').click(function () {
            var title = $('#replyName').val();
            var type = $('#replyType').val();
            var text = $('#replyText').val();
            var id = $(this).attr('data-id');
            if (title == null || title == '' || title == undefined) {
                layer.msg('回复标题不能为空');
            } else if (text == '' || text == null || text == undefined) {
                layer.msg('回复内容不能为空');
            } else {
                var data = {
                    "id": id,
                    "title": title,
                    "type": '1',
                    "text": text,
                    "typemessage": '0'
                };
                layer.load(2);
                erp.postFun('erp/fastMessage/updateFastMessage', JSON.stringify(data), function (data) {
                    console.log(data);
                    if (data.data.code == '200') {
                        $('.zzc').hide();
                        getFastReplyList();
                        layer.closeAll('loading');
                    } else {
                        layer.closeAll('loading');
                        layer.msg('修改失败');
                    }
                }, function (n) {
                    console.log(n);
                    layer.closeAll('loading');
                });
            }
        });
        //关闭弹窗
        $('#closeBtn').click(function () {
            $('.zzc').hide();
        });

        //启用停用
        $scope.qiyong = function (id, status) {
            var data = {
                "id": id,
                "block": status
            };
            var str;
            var notice;
            if (status == '0') {
                str = "确认要启用吗？";
                notice = "启用失败";
            } else if (status == '1') {
                str = "确认要禁用吗？";
                notice = '禁用失败';
            }
            layer.confirm(str, {
                btn: ['确定', '取消']//按钮
            }, function (index) {
                layer.close(index);
                erp.postFun('erp/fastMessage/blockFastMessage', JSON.stringify(data), function (data) {
                    console.log(data);
                    if (data.data.code == '200') {
                        getFastReplyList();
                    } else {
                        layer.msg(notice);
                    }
                }, function (n) {
                    console.log(n);
                });
            });

        };

        //删除
        $scope.deleteFun = function (id) {
            layer.confirm('确认要删除吗', {
                btn: ['确定', '取消']//按钮
            }, function (index) {
                layer.close(index);
                var data = {
                    "id": id
                };
                erp.postFun('erp/fastMessage/deleteFastMessage', JSON.stringify(data), function (data) {
                    console.log(data);
                    if (data.data.code == '200') {
                        getFastReplyList();
                    } else {
                        layer.msg('删除失败');
                    }
                }, function (n) {
                    console.log(n);
                });
            });
        }

    }]);
    //纠纷快捷回复
    app.controller('csdisputeFastReplyCtrl', ['$scope', 'erp', '$routeParams', '$location', '$http', function ($scope, erp, $routeParams, $location, $http) {
        console.log('csdisputeFastReplyCtrl');
        $scope.pageNum = '1';
        $scope.pageSize = '20';
        $scope.title = '';
        $scope.type = "";
        $scope.searchInfo = '';

        $('#searchInput').keypress(function (e) {
            if (e.keyCode == 13) {
                $scope.search()
            }
        })
        $scope.search = function () {
            console.log($scope.searchInfo);
            $scope.title = $scope.searchInfo;
            $scope.pageNum = '1';
            getFastReplyList();

        };
        $scope.classUpdatePeople = function (people) {
            if (people == null || people == '' || people == undefined) {
                return '--';
            } else {
                return people;
            }
        };
        $scope.classType = function (type) {
            if (type == '1') {
                return "文本";
            } else if (type == '2') {
                return "图片";
            } else if (type == '3') {
                return "附件"
            }
        };
        $scope.classBlock = function (block) {
            if (block == '0') {
                return "启用"
            } else if (block == '1') {
                return "停用"
            }
        };
        //更换每页多少条数据
        $scope.pagesizechange = function (pagesize) {
            //console.log(pagesize)
            // $scope.pagesize=pagesize-0;
            $scope.pageNum = 1;
            getFastReplyList();
        };
        //手动输入页码GO跳转
        $scope.pagenumchange = function () {
            var pagenum = Number($scope.pageNum);
            var totalpage = Math.ceil($scope.totalCounts / $scope.pageSize);
            if (pagenum > totalpage) {
                layer.msg('错误页码');
                $scope.pageNum = 1;
            } else {
                getFastReplyList();
            }
        };
        getFastReplyList();

        function getFastReplyList() {
            var data = {
                "limit": $scope.pageSize,
                "page": $scope.pageNum,
                "title": $scope.title,
                "type": $scope.type,
                "typemessage": '1'
            };
            erp.postFun('erp/fastMessage/searchFastMessage', JSON.stringify(data), function (data) {
                if (data.data.code == '200') {
                    var result = data.data.data;
                    console.log(result);
                    $scope.FastReplyList = result.list;
                    $scope.totalCounts = result.count;
                    pageFun();
                } else {
                    layer.msg('查询失败');
                }

            }, function (n) {
                console.log(n);
            });
        }

        function pageFun() {
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.totalCounts || 1,
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
                    $scope.pageNum = n;
                    getFastReplyList();
                }
            });
        }

        //新增恢复
        //关闭弹窗
        $('#closeBtn').click(function () {
            $('.zzc').hide();
        });
        //打开新增回复弹窗
        $('#addFastReply').click(function () {
            $('.zzc').show().find('h3').html('新增快捷回复');
            $('#replyName').val('');
            $('#replyType').val('');
            $('#replyText').val('');
            $('#addBtn').show();
            $('#saveBtn').hide();
        });
        //确认新增
        $scope.addFun = function () {
            var title = $('#replyName').val();
            var type = $('#replyType').val();
            var text = $('#replyText').val();
            if (title == null || title == '' || title == undefined) {
                layer.msg('回复标题不能为空');
            } else if (text == '' || text == null || text == undefined) {
                layer.msg('回复内容不能为空');
            } else {
                var data = {
                    "title": title,
                    "type": '1',
                    "text": text,
                    "typemessage": '1'
                };
                layer.load(2);
                erp.postFun('erp/fastMessage/addFastMessage', JSON.stringify(data), function (data) {
                    console.log(data);
                    if (data.data.code == '200') {
                        $('.zzc').hide();
                        getFastReplyList();
                        layer.closeAll('loading');
                    } else {
                        layer.closeAll('loading');
                        layer.msg('新增失败');
                    }
                }, function (n) {
                    layer.closeAll('loading');
                });
            }
        };
        //打开修改回复弹窗
        $scope.updateFun = function (reply) {
            $('.zzc').show().find('h3').html('修改快捷回复');
            $('#replyName').val(reply.title);
            $('#replyType').val(reply.type);
            $('#replyText').val(reply.text);
            $('#addBtn').hide();
            $('#saveBtn').show().attr('data-id', reply.id);
        };
        //确认修改
        $('#saveBtn').click(function () {
            var title = $('#replyName').val();
            var type = $('#replyType').val();
            var text = $('#replyText').val();
            var id = $(this).attr('data-id');
            if (title == null || title == '' || title == undefined) {
                layer.msg('回复标题不能为空');
            } else if (text == '' || text == null || text == undefined) {
                layer.msg('回复内容不能为空');
            } else {
                var data = {
                    "id": id,
                    "title": title,
                    "type": '1',
                    "text": text,
                    "typemessage": '1'
                };
                layer.load(2);
                erp.postFun('erp/fastMessage/updateFastMessage', JSON.stringify(data), function (data) {
                    console.log(data);
                    if (data.data.code == '200') {
                        $('.zzc').hide();
                        getFastReplyList();
                        layer.closeAll('loading');
                    } else {
                        layer.closeAll('loading');
                        layer.msg('修改失败');
                    }
                }, function (n) {
                    console.log(n);
                    layer.closeAll('loading');
                });
            }
        });
        //启用停用
        $scope.qiyong = function (id, status) {
            var data = {
                "id": id,
                "block": status
            };
            var str;
            var notice;
            if (status == '0') {
                str = "确认要启用吗？";
                notice = "启用失败";
            } else if (status == '1') {
                str = "确认要禁用吗？";
                notice = '禁用失败';
            }
            layer.confirm(str, {
                btn: ['确定', '取消']//按钮
            }, function (index) {
                layer.close(index);
                erp.postFun('erp/fastMessage/blockFastMessage', JSON.stringify(data), function (data) {
                    console.log(data);
                    if (data.data.code == '200') {
                        getFastReplyList();
                    } else {
                        layer.msg(notice);
                    }
                }, function (n) {
                    console.log(n);
                });
            });

        };

        //删除
        $scope.deleteFun = function (id) {
            layer.confirm('确认要删除吗', {
                btn: ['确定', '取消']//按钮
            }, function (index) {
                layer.close(index);
                var data = {
                    "id": id
                }
                erp.postFun('erp/fastMessage/deleteFastMessage', JSON.stringify(data), function (data) {
                    console.log(data);
                    if (data.data.code == '200') {
                        getFastReplyList();
                    } else {
                        layer.msg('删除失败');
                    }
                }, function (n) {
                    console.log(n);
                });
            });
        }
    }]);
    //邮件
    app.controller('mailCtrl', ['$scope', 'erp', '$routeParams', '$location', '$http', function ($scope, erp, $routeParams, $location, $http) {
        console.log('mailCtrl');
        $scope.pageSize = "20";
        $scope.pageNum = '1';
        $scope.searchinfo = '';
        var ceshiList = [];
        getModelList();

        //获取模板列表
        function getModelList() {
            var data = {
                "page": $scope.pageNum,
                "pageNum": $scope.pageSize,
                "searchParam": $scope.searchinfo
            };
            erp.load();
            erp.postFun('app/modelEmail/getEmailModelList', JSON.stringify(data), function (data) {
                console.log(data);
                erp.closeLoad();
                if (data.data.code == '200') {
                    $scope.modelList = data.data.list;
                    $scope.totalCounts = data.data.totalNum;
                    pageFun();
                } else {
                    layer.msg('查询失败');
                }
            }, function (n) {
                console.log(n);
                erp.closeLoad();
            });
        }

        function pageFun() {
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.totalCounts || 1,
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
                    $scope.pageNum = n;
                    getModelList();
                }
            });
        }

        //更换每页多少条数据
        $scope.pagesizechange = function (pagesize) {
            //console.log(pagesize)
            // $scope.pagesize=pagesize-0;
            $scope.pageNum = 1;
            getModelList();
        };
        //手动输入页码GO跳转
        $scope.pagenumchange = function () {
            var pagenum = Number($scope.pageNum);
            var totalpage = Math.ceil($scope.totalCounts / $scope.pageSize);
            if (pagenum > totalpage) {
                layer.msg('错误页码');
                $scope.pageNum = 1;
            } else {
                getModelList();
            }
        };
        //搜索
        $scope.SearchBtn = function () {
            console.log($scope.searchinfo);
            getModelList();
        }
        //按下enter搜索
        $(function () {
            $(".search-text-box").keydown(function (event) {
                if (event.keyCode === 13 || event.keyCode === 108) {
                    getModelList();
                }
            });
        })
        $scope.addTemplate = function () {
            var jk = $('#selectPort').val();
            //console.log(jk);
            if (jk == '0') {
                layer.msg('请选择接口');
            } else {
                $('.zzc').show().find('h3').html('新增模板');
                $('#yjjk').html(jk);
                $('#addBtn').show();
                $('#updateBtn').hide();
            }
        };
        $('#closeBtn').click(function () {
            $('.zzc').hide();
        });

        $scope.editFun = function (id, name, title, content, emailType) {
            $('.zzc').show();
            $('#selectBtn').attr('data-id', id);
            $('#modelName').val(name);
            $('#modelTitle').val(title);
            $('#modelContent').val(content);
            $('.left-top>table>tbody').empty();
            $scope.keyList = [];
            $('#ceshiBtn').attr('data-id', id);
            $('#sureMail').attr('data-id', id);
            emailType = emailType.substring(0, 1).toUpperCase() + emailType.substring(1);
            $('#selectModelType').val(emailType);
        };
        //开启停用
        $scope.changeStatus = function (id, optType) {
            var str;
            if (optType == 'open') {
                str = '确认要启用吗？'
            } else if (optType == 'close') {
                str = '确认要停用吗？'
            } else if (optType == 'dell') {
                str = '确认要删除吗？'
            }
            layer.confirm(str, {
                btn: ['确定', '取消']//按钮
            }, function (index) {
                layer.close(index);
                var data = {
                    "id": id,
                    "optType": optType
                }
                console.log(data);
                erp.load();
                erp.postFun('app/modelEmail/udpateEmailModesStatus', JSON.stringify(data), function (data) {
                    erp.closeLoad();
                    console.log(data);
                    if (data.data.code == '200') {
                        getModelList();
                    }
                }, function (n) {
                    console.log(n);
                    erp.closeLoad();
                });
            });
        };

        $scope.classCheckFlag = function (flag) {
            if (flag == '200') {
                return '已通过';
            } else if (flag == '201') {
                return '未验证';
            } else if (flag == '202') {
                return '未通过';
            }
        };
        $scope.classStatus = function (status) {
            if (status == '106') {
                return '开启';
            } else if (status == '107') {
                return '关闭';
            }
        };
        //$('.moreAction>span').hover(function(){
        //    $(this).siblings('ul').show();
        //},function(){
        //    $(this).siblings('ul').hide();
        //});

        //选择查询结果
        $('.selectResult').on('click', 'span', function () {
            var target = $(this);
            var text = target.html();
            text = '${' + text + '}';
            console.log(text);
            var str = $('#modelContent').val();
            str += text;
            $('#modelContent').val(str);
        });
        $scope.openAdd = function () {
            $('#csmc').val('');
            $('#csz').val('');
            $('.addCanshu').show();
        }
        $scope.closeAdd = function () {
            $('.addCanshu').hide();
        }
        $scope.sureAdd = function () {
            var name = $('#csmc').val();
            var value = $('#csz').val();
            if (name == null || name == '' || name == undefined) {
                layer.msg('参数名称不能为空');
            } else if (value == null || value == '' || value == undefined) {
                layer.msg('参数值不能为空');
            } else {
                var str = '<tr><td class="key2">' + name + '</td><td class="value">' + value + '</td><td><button class="linkbtn" style="padding:2px 5px">删除</button></td></tr>';
                var ele = $('.left-top>table>tbody');
                ele.append(str);
                $('.addCanshu').hide();
            }
        };
        $('.left-top>table>tbody').on('click', 'tr>td>button', function () {
            var target = $(this);
            var ele = target.parent().parent();
            ele.remove();
        });
        $('#selectBtn').click(function () {
            var tr = $('.left-top>table>tbody').find('tr');
            var id = $(this).attr('data-id');
            console.log(id);
            if (tr.length == 0) {
                layer.msg('请先增加查询参数');
            } else {
                var dataParam = {};
                console.log(tr);
                tr.each(function () {
                    var key = $(this).find('td.key2').html();
                    var value = $(this).find('td.value').html();
                    dataParam[key] = value;
                });

                var data = {
                    "id": id,
                    "dataParam": JSON.stringify(dataParam)
                }
                console.log(data);
                erp.load();
                erp.postFun('app/modelEmail/getTestRunSqlResult', JSON.stringify(data), function (data) {
                    erp.closeLoad();
                    console.log(data);
                    if (data.data.code == '200') {
                        var list = data.data.keyList;
                        ceshiList = list;
                        var keyList = [];
                        $.each(list, function (i, v) {
                            var data = {
                                'key': v
                            }
                            keyList.push(data);
                        });
                        console.log(keyList);
                        $scope.keyList = keyList;
                    }
                }, function (n) {
                    console.log(n);
                    erp.closeLoad();
                });
            }
        });

        //保存修改
        $('#sureMail').click(function () {
            var id = $(this).attr('data-id');
            var modeName = $('#modelName').val();
            var msgName = $('#modelTitle').val();
            var msgContent = $('#modelContent').val();
            var emailType = $('#selectModelType').val();
            if (modeName == null || modeName == '' || modeName == undefined) {
                layer.msg('模板名称不能为空');
            } else if (msgName == null || msgName == '' || msgName == undefined) {
                layer.msg('邮件标题不能为空');
            } else if (msgContent == null || msgContent == '' || msgContent == undefined) {
                layer.msg('邮件内容不能为空');
            } else {
                emailType = emailType.substring(0, 1).toLowerCase() + emailType.substring(1);
                var data = {
                    "id": id,
                    "modeName": modeName,
                    "msgName": msgName,
                    "msgContent": msgContent,
                    "emailType": emailType
                };
                console.log(data);
                erp.load();
                erp.postFun('app/modelEmail/addAndEditEmailMode', JSON.stringify(data), function (data) {
                    erp.closeLoad();
                    console.log(data);
                    if (data.data.code == '200') {
                        layer.msg('更新成功');
                        $('.zzc').hide();
                        getModelList();
                    } else {
                        layer.msg('更新失败')
                    }
                }, function (n) {
                    console.log(n);
                    erp.closeLoad();
                });
            }
        });


        //测试发送
        $('#ceshiBtn').click(function () {
            var id = $(this).attr('data-id');
            var msgName = $('#modelTitle').val();
            var msgContent = $('#modelContent').val();
            var dataParam;
            if (ceshiList.length == 0) {
                layer.msg('请先获取参数');
            } else {
                var list = ceshiList;
                if (list.indexOf('email') != -1) {
                    //可以测
                    console.log('可以测试');
                    var tr = $('.left-top>table>tbody').find('tr');
                    var dataParam = {}
                    tr.each(function () {
                        var key = $(this).find('.key2').html();
                        var value = $(this).find('.value').html();
                        dataParam[key] = value;
                    });
                    console.log(dataParam);
                    if (msgName == null || msgName == '' || msgName == undefined) {
                        layer.msg('邮件标题不能为空');
                    } else if (msgContent == null || msgContent.trim() == '' || msgContent == undefined) {
                        layer.msg('邮件内容不能为空');
                    } else {
                        var data = {
                            "id": id,
                            "msgName": msgName,
                            "msgContent": msgContent,
                            "dataParam": JSON.stringify(dataParam)
                        }
                        console.log(data);
                        erp.load();
                        erp.postFun('app/modelEmail/testSendModelEmail', JSON.stringify(data), function (data) {
                            erp.closeLoad();
                            console.log(data);
                            if (data.data.code == '200') {
                                layer.msg('测试成功，邮件发送成功！')
                            } else {
                                layer.msg('测试失败，邮件发送失败！');
                            }
                        }, function (n) {
                            console.log(n);
                            erp.closeLoad();
                        });
                    }

                } else {
                    layer.msg('请新增一个email地址');
                }
            }
        });
        $scope.closezzc = function () {
            $('.zzc').hide();
            ceshiList = [];
        };
    }]);

    //邮件模板管理
    app.controller('mailTemplateCtrl', ['$scope', 'erp', '$routeParams', '$location', '$http', function ($scope, erp, $routeParams, $location, $http) {
        console.log('mailTemplateCtrl');
        $scope.pageSize = "20";
        $scope.pageNum = '1';
        $scope.searchinfo = '';
        $scope.conversation = false
        $scope.modelType = ''
        $scope.mailContent = ''
        $scope.showFlag = false                                                     //预览弹窗
        var ceshiList = [];
        getTemplateList();

        /** 邮件抄送 */
        $scope.changeConversation = function () {
            console.log('11')
            $scope.conversation = !$scope.conversation
        }
        $scope.changeModelType = function (modelType) {
            // console.log(modelType)
            $scope.modelType = modelType;
        }

        /**预览 */
        $scope.preview = () => {
			console.log($scope.mailContent)
			$scope.showFlag = true
        }

        //获取模板列表
        function getTemplateList() {
            var data = {
                "pageNo": $scope.pageNum,
                "pageSize": $scope.pageSize,
                "subject": $scope.searchinfo,
                'bustype':$scope.searchbox
            };
            erp.load();
            erp.postFun('mail/template/getEmailTemplateList', JSON.stringify(data), function (data) {
                console.log(data);
                erp.closeLoad();
                if (data.data.statusCode == '200') {
                    $scope.templateList = data.data.result.emailTemplateList;
                    $scope.totalCounts = data.data.result.total;
                    var pagenum = Number($scope.pageNum);
                    var totalpage = Math.ceil($scope.totalCounts / $scope.pageSize);
                    if (pagenum > totalpage) {
                        $scope.pageNum = 1;
                    }
                    pageFun();
                } else {
                    layer.msg('查询失败');
                }
            }, function (n) {
                console.log(n);
                erp.closeLoad();
            });
        }

        function pageFun() {
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.totalCounts || 1,
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
                    $scope.pageNum = n;
                    getTemplateList();
                }
            });
        }

        //更换每页多少条数据
        $scope.pagesizechange = function (pagesize) {
            //console.log(pagesize)
            // $scope.pagesize=pagesize-0;
            $scope.pageNum = 1;
            getTemplateList();
        };
        //手动输入页码GO跳转
        $scope.pagenumchange = function () {
            var pagenum = Number($scope.pageNum);
            var totalpage = Math.ceil($scope.totalCounts / $scope.pageSize);
            if (!(/(^[1-9]\d*$)/.test(pagenum)) || pagenum > totalpage) {
                layer.msg('请输入正确页码');
                $scope.pageNum = 1;
            } else {
                getTemplateList();
            }
        };
        //搜索
        $scope.SearchBtn = function () {
            console.log($scope.searchinfo);
            $scope.pageNum = 1;
            getTemplateList();
        }
        //按下enter搜索
        $(function () {
            $(".search-text-box").keydown(function (event) {
                if (event.keyCode === 13 || event.keyCode === 108) {
                    getTemplateList();
                }
            });
        })
        $scope.addTemplate = function () {
            var jk = $('#selectPort').val();
            //console.log(jk);
            if (jk == '0') {
                layer.msg('请选择接口');
            } else {
                $('.zzc').show().find('h3').html('新增模板');
                $('#yjjk').html(jk);
                $('#addBtn').show();
                $('#updateBtn').hide();
            }
        };
        $('#closeBtn').click(function () {
            $('.zzc').hide();
        });

        $scope.editFun = function ( id, emailtype, subject, content, remark, bustype, emailSwitch ) {
            if(id == 'undefined' || id == undefined){
                id='';
            }
            $('.zzc').show();
            $('#selectBtn').attr('data-id', id);
            $('#emailtype').val(emailtype);
            $('#subject').val(subject);
            // $('#content').val(content);
            $scope.mailContent = content
            $('#remark').val(remark);
            $('.left-top>table>tbody').empty();
            $scope.keyList = [];
            $('#ceshiBtn').attr('data-id', id);
            $('#sureMail').attr('data-id', id);
            // emailType = emailType.substring(0, 1).toUpperCase() + emailType.substring(1);
            // $('#selectModelType').val(bustype);
            $scope.modelType = bustype || ''
            $scope.conversation = emailSwitch === '0' ? true : false
        };
        //开启停用
        $scope.changeStatus = function (id, optType) {
            var str;
            if (optType == 'open') {
                str = '确认要启用吗？'
            } else if (optType == 'close') {
                str = '确认要停用吗？'
            } else if (optType == 'dell') {
                str = '确认要删除吗？'
            }
            layer.confirm(str, {
                btn: ['确定', '取消']//按钮
            }, function (index) {
                layer.close(index);
                var data = {
                    "id": id,
                    "optType": optType
                }
                console.log(data);
                erp.load();
                erp.postFun('app/modelEmail/udpateEmailModesStatus', JSON.stringify(data), function (data) {
                    erp.closeLoad();
                    console.log(data);
                    if (data.data.code == '200') {
                        getTemplateList();
                    }
                }, function (n) {
                    console.log(n);
                    erp.closeLoad();
                });
            });
        };

        $scope.classCheckFlag = function (flag) {
            if (flag == '200') {
                return '已通过';
            } else if (flag == '201') {
                return '未验证';
            } else if (flag == '202') {
                return '未通过';
            }
        };
        $scope.classStatus = function (status) {
            if (status == '106') {
                return '开启';
            } else if (status == '107') {
                return '关闭';
            }
        };
        //$('.moreAction>span').hover(function(){
        //    $(this).siblings('ul').show();
        //},function(){
        //    $(this).siblings('ul').hide();
        //});

        //选择查询结果
        $('.selectResult').on('click', 'span', function () {
            var target = $(this);
            var text = target.html();
            text = '${' + text + '}';
            console.log(text);
            var str = $('#modelContent').val();
            str += text;
            $('#modelContent').val(str);
        });
        //保存修改
        $('#sureMail').click(function () {
            var id = $(this).attr('data-id');
            var emailtype = $('#emailtype').val();
            var subject = $('#subject').val();
            var content = $scope.mailContent;
            var remark = $('#remark').val();
            var bustype = $scope.modelType

            if (emailtype == null || emailtype == '' || emailtype == undefined) {
                layer.msg('模板名称不能为空');
            } else if (subject == null || subject == '' || subject == undefined) {
                layer.msg('邮件标题不能为空');
            } else if (content == null || content == '' || content == undefined) {
                layer.msg('邮件内容不能为空');
            } else if (!bustype) {
                layer.msg('请选择邮件类型');
            } else {
                // bustype = bustype.substring(0, 1).toLowerCase() + bustype.substring(1);
                var data = {
                    "id": id,
                    "emailtype": emailtype,
                    "subject": subject,
                    "content": content,
                    "remark": remark,
                    "bustype": bustype,
                    "emailswitch": $scope.conversation ? '0' : '1'
                };
                console.log(data);
                erp.load();
                erp.postFun('mail/template/updateEmailTemplate', JSON.stringify(data), function (data) {
                    erp.closeLoad();
                    console.log(data);
                    if (data.data.statusCode == '200') {
                        layer.msg('更新成功');
                        $('.zzc').hide();
                        getTemplateList();
                    } else {
                        layer.msg('更新失败')
                    }
                }, function (n) {
                    console.log(n);
                    erp.closeLoad();
                });
            }
        });


        //测试发送
        $('#ceshiBtn').click(function () {
            var id = $(this).attr('data-id');
            var msgName = $('#modelTitle').val();
            var msgContent = $('#modelContent').val();
            var dataParam;
            if (ceshiList.length == 0) {
                layer.msg('请先获取参数');
            } else {
                var list = ceshiList;
                if (list.indexOf('email') != -1) {
                    //可以测
                    console.log('可以测试');
                    var tr = $('.left-top>table>tbody').find('tr');
                    var dataParam = {}
                    tr.each(function () {
                        var key = $(this).find('.key2').html();
                        var value = $(this).find('.value').html();
                        dataParam[key] = value;
                    });
                    console.log(dataParam);
                    if (msgName == null || msgName == '' || msgName == undefined) {
                        layer.msg('邮件标题不能为空');
                    } else if (msgContent == null || msgContent.trim() == '' || msgContent == undefined) {
                        layer.msg('邮件内容不能为空');
                    } else {
                        var data = {
                            "id": id,
                            "msgName": msgName,
                            "msgContent": msgContent,
                            "dataParam": JSON.stringify(dataParam)
                        }
                        console.log(data);
                        erp.load();
                        erp.postFun('app/modelEmail/testSendModelEmail', JSON.stringify(data), function (data) {
                            erp.closeLoad();
                            console.log(data);
                            if (data.data.code == '200') {
                                layer.msg('测试成功，邮件发送成功！')
                            } else {
                                layer.msg('测试失败，邮件发送失败！');
                            }
                        }, function (n) {
                            console.log(n);
                            erp.closeLoad();
                        });
                    }

                } else {
                    layer.msg('请新增一个email地址');
                }
            }
        });
        $scope.closezzc = function () {
            $('.zzc').hide();
            ceshiList = [];
        };
    }]);
    //接口
    app.controller('PortCtrl', ['$scope', 'erp', '$routeParams', '$location', '$http', function ($scope, erp, $routeParams, $location, $http) {
        console.log('PortCtrl');
        $scope.pageSize = "20";
        $scope.pageNum = '1';
        $scope.searchinfo = '';
        getPortList();

        //获取接口列表\]
        function getPortList() {
            var data = {
                "page": $scope.pageNum,
                "pageNum": $scope.pageSize,
                "searchParam": $scope.searchinfo
            };
            erp.load();
            erp.postFun('app/modelEmail/getEmailInterFaceList', JSON.stringify(data), function (data) {
                erp.closeLoad();
                console.log(data.data.list);
                $scope.portList = data.data.list;
                $scope.totalCounts = data.data.totalNum;
                pageFun();
            }, function (n) {
                console.log(n);
                erp.closeLoad();
            });
        }

        function pageFun() {
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.totalCounts || 1,
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
                    $scope.pageNum = n;
                    getPortList();
                }
            });
        }

        //关闭接口类型弹窗
        $scope.closeZzc2 = function () {
            $('.zzc2').hide();
        }
        //搜索
        $scope.SearchBtn = function () {
            console.log($scope.searchinfo);
            $scope.pageNum = '1';
            getPortList();
        }
        //按下enter搜索
        $(function () {
            $(".search-text-box").keydown(function (event) {
                if (event.keyCode === 13 || event.keyCode === 108) {
                    $scope.pageNum = '1';
                    getPortList();
                }
            });
        })
        //更换每页多少条数据
        $scope.pagesizechange = function (pagesize) {
            //console.log(pagesize)
            // $scope.pagesize=pagesize-0;
            $scope.pageNum = 1;
            getPortList();
        };
        //手动输入页码GO跳转
        $scope.pagenumchange = function () {
            var pagenum = Number($scope.pageNum);
            var totalpage = Math.ceil($scope.totalCounts / $scope.pageSize);
            if (pagenum > totalpage) {
                layer.msg('错误页码');
                $scope.pageNum = 1;
            } else {
                getPortList();
            }
        };
        //打开新增
        $scope.addPort = function () {
            $('#portZzc').show().find('h3').html('新增接口');
            $('#portName').val('');
            $('#portHref').val('');
            $('#portRemark').val('');
            $('#addPort').show();
            $('#updatePort').hide();
        };
        //打开修改
        $scope.updatePortFun = function (name, port, remark) {
            $('#portZzc').show().find('h3').html('修改接口');
            $('#portName').val(name);
            $('#portHref').val(port);
            $('#portRemark').val(remark);
            $('#addPort').hide();
            $('#updatePort').show();
        }
        $('#closePort').click(function () {
            $('#portZzc').hide();
        });
        //确认修改
        $('#updatePort').click(function () {
            var interfacePath = $('#portHref').val();
            var interfaceName = $('#portName').val();
            var remark = $('#portRemark').val();
            if (interfaceName == null || interfaceName == '' || interfaceName == undefined) {
                layer.msg('接口名称不能为空');
            } else {
                var data = {
                    "interfacePath": interfacePath,
                    "interfaceName": interfaceName,
                    "remark": remark
                };
                //console.log(data);
                erp.load();
                erp.postFun('app/modelEmail/updateInterfaceInfo', JSON.stringify(data), function (data) {
                    erp.closeLoad();
                    console.log(data);
                    if (data.data.code == '200') {
                        getPortList();
                    } else {
                        layer.msg('修改失败');
                    }
                    $('#portZzc').hide();
                }, function (n) {
                    console.log(n);
                    erp.closeLoad();
                });
            }
        });
        //启用禁用
        $scope.changeStatus = function (path, type) {
            var data = {
                "interfacePath": path,
                "optType": type
            };
            var str;
            if (type == 'open') {
                str = '确认要启用吗？'
            } else if (type == 'close') {
                str = '确认要停用吗？';
            }
            layer.confirm(str, {
                btn: ['确定', '取消']//按钮
            }, function (index) {
                layer.close(index);
                //此处请求后台程序，下方是成功后的前台处理……
                console.log(data);
                erp.load();
                erp.postFun('app/modelEmail/openAndCloseEmailInterface', JSON.stringify(data), function (data) {
                    console.log(data);
                    erp.closeLoad();
                    if (data.data.code == '200') {
                        getPortList();
                    } else {
                        layer.msg('操作失败');
                    }
                }, function (n) {
                    console.log(n);
                    erp.closeLoad();
                });
            });
        };

        //新增模板
        $scope.addModel = function (id, path) {
            var data = {
                "interfaceId": id,
                "optType": "add",
                "interfacePath": path
            };
            $('.zzc2').show().find('#sureAddBtn').attr('data-info', JSON.stringify(data));
            //layer.confirm('是否新增模板', {
            //    btn : [ '确定', '取消' ]//按钮
            //}, function(index) {
            //    layer.close(index);
            //    //此处请求后台程序，下方是成功后的前台处理……
            //    console.log(data);
            //    erp.load();
            //    erp.postFun('app/modelEmail/addAndEditEmailMode',JSON.stringify(data),function(data){
            //        console.log(data);
            //        erp.closeLoad();
            //    },function(n){
            //        console.log(n);
            //        erp.closeLoad();
            //    });
            //
            //});
        };
        $('#sureAddBtn').click(function () {
            var target = $(this);
            var code = JSON.parse(target.attr('data-info'));
            //console.log(code);
            var type = $('#selectModelType').val();
            if (type == '') {
                layer.msg('请选择模板类型');
            } else {
                type = type.substring(0, 1).toLowerCase() + type.substring(1);
                code.emailType = type;
                console.log(code);
                erp.load();
                erp.postFun('app/modelEmail/addAndEditEmailMode', JSON.stringify(code), function (data) {
                    console.log(data);
                    erp.closeLoad();
                    if (data.data.code == '200') {
                        layer.msg('新增成功');
                        $('.zzc2').hide();
                    } else {
                        layer.msg('新增失败');
                    }
                }, function (n) {
                    console.log(n);
                    erp.closeLoad();
                });
            }
        });

        $scope.classStatus = function (status) {
            if (status == '' || status == null || status == undefined) {
                return '未使用';
            } else {
                if (status == '106') {
                    return '已使用';
                } else if (status == '107') {
                    return '未使用';
                }
            }
        }

    }]);
    //自定义模板
    app.controller('SelfMdoelCtrl', ['$scope', 'erp', '$routeParams', '$location', '$http', function ($scope, erp, $routeParams, $location, $http) {
        console.log('SelfMdoelCtrl');
        $scope.pageNum = '1';
        $scope.pageSize = '20';
        $scope.searchinfo = '';

        getModelList();

        //获取自定义模板列表
        function getModelList() {
            var data = {
                "page": $scope.pageNum,
                "pageNum": $scope.pageSize,
                "searchParam": $scope.searchinfo
            };
            erp.load();
            erp.postFun('app/modelEmail/getCustomEmailModelList', JSON.stringify(data), function (data) {
                erp.closeLoad();
                console.log(data);
                $scope.modelList = data.data.list;
                $scope.totalCounts = data.data.totalNum;
                pageFun();
            }, function (n) {
                console.log(n);
                erp.closeLoad();
            });
        }

        function pageFun() {
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.totalCounts || 1,
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
                    $scope.pageNum = n;
                    getModelList();
                }
            });
        }

        //编辑信息
        $scope.updateFun = function (item) {
            var data = {
                "id": item.id
            };
            erp.load();
            erp.postFun('app/modelEmail/getCustomEmailModeById', JSON.stringify(data), function (data) {
                erp.closeLoad();
                var result = data.data.object;
                console.log(result);
                $('.zzc').show().find('h3').html('编辑模板');
                $('#addBtn').hide();
                $('#SaveBtn').show().attr('data-id', item.id);
                if (result.modelType == '101') {
                    //指定客户
                    $('.tab>span:first-child').addClass('active').siblings('.active').removeClass('active');
                    $('.zhiding').show();
                    $('.zidingyi').hide();
                    var len = result.userStatus.length;
                    var length = $('.check-detail>.check-content>input[type=checkbox]').length;
                    if (len == length) {
                        $('.checkAll').prop('checked', true);
                        $('.check-detail>.check-content>input[type=checkbox]').prop('checked', true);
                    } else {
                        var statusList = result.userStatus;
                        $('.checkAll').prop('checked', false);
                        $('.check-detail>.check-content>input[type=checkbox]').prop('checked', false);
                        $.each(statusList, function (i, v) {
                            console.log(v)
                            $('.check-detail>.check-content').eq(v).children('input[type=checkbox]').prop('checked', true);
                        });
                    }
                    var namekey = result.nameKey;
                    if (namekey == '') {
                        //默认
                        $('#radioBox>.check-content').eq(0).children('input[type="radio"]').prop('checked', true);
                        $('.zhidingInput').hide();
                        $('#customerName').val('');
                    } else if (namekey == 'in') {
                        //包含
                        $('#radioBox>.check-content').eq(1).children('input[type="radio"]').prop('checked', true);
                        $('.zhidingInput').show();
                        $('#customerName').val(result.nameValue);
                    } else if (namekey == 'out') {
                        //不包含
                        $('#radioBox>.check-content').eq(2).children('input[type="radio"]').prop('checked', true);
                        $('.zhidingInput').show();
                        $('#customerName').val(result.nameValue);
                    }
                    $('#modelName').val(result.modeName);
                    $('#mailTitle').val(result.msgName);
                    $('#mailContent').val(result.msgContent);
                    //$("#wang").find('.w-e-text').html(result.msgContent);
                    $('.canshu').show();
                } else if (result.modelType == '102') {
                    //自定义
                    $('.tab>span:last-child').addClass('active').siblings('.active').removeClass('active');
                    $('.checkAll').prop('checked', false);
                    $('.check-detail>.check-content>input[type=checkbox]').prop('checked', false);
                    $('#radioBox>.check-content').eq(0).children('input[type="radio"]').prop('checked', true);
                    $('.zhidingInput').hide();
                    $('#customerName').val('');
                    $('.zhiding').hide();
                    $('.zidingyi').show();
                    $('#modelName').val(result.modeName);
                    $('#mailTitle').val(result.msgName);
                    $('#mailContent').val(result.msgContent);
                    //$("#wang").find('.w-e-text').html(result.msgContent);
                    $('#mailAddres').val(result.toAddress);
                    $('.canshu').hide();
                }
            }, function (n) {
                console.log(n)
                erp.closeLoad();
            });
        }

        //搜索
        $scope.SearchBtn = function () {
            console.log($scope.searchinfo);
            getModelList();
        }
        //按下enter搜索
        $(function () {
            $(".search-text-box").keydown(function (event) {
                if (event.keyCode === 13 || event.keyCode === 108) {
                    getModelList();
                }
            });
        })
        //更换每页多少条数据
        $scope.pagesizechange = function (pagesize) {
            //console.log(pagesize)
            // $scope.pagesize=pagesize-0;
            $scope.pageNum = 1;
            getModelList();
        };
        //手动输入页码GO跳转
        $scope.pagenumchange = function () {
            var pagenum = Number($scope.pageNum);
            var totalpage = Math.ceil($scope.totalCounts / $scope.pageSize);
            if (pagenum > totalpage) {
                layer.msg('错误页码');
                $scope.pageNum = 1;
            } else {
                getModelList();
            }
        };
        $scope.classModelType = function (type) {
            if (type == '101') {
                return '指定客户模板';
            } else if (type == '102') {
                return '自定义模板'
            }
        }

        //打开新增模板窗口
        $scope.openAdd = function () {
            $('.zzc').show().find('h3').html('新增模板');
            $('.checkbox .check-content>input[type="checkbox"]').prop('checked', false);
            $('.checkbox .check-content>input[type="radio"]').prop('checked', false);
            $('.moren').prop('checked', true);
            $('.zhidingInput').hide();
            $('.zhidingInput>input').val('');
            $('#mailTitle').val('');
            $('#mailContent').val('');
            $('#mailAddres').val('');
            $('#modelName').val('');
            $('#addBtn').show();
            $('#SaveBtn').hide();
            //$("#wang").find('.w-e-text').html('');
        };
        //关闭窗口
        $scope.closeAdd = function () {
            $('.zzc').hide();
        };
        //tab切换
        $('.tab').on('click', 'span', function () {
            $(this).addClass('active').siblings('.active').removeClass('active');
            var html = $(this).html();
            $('.modelType').html(html);
            if (html.trim() == '指定客户') {
                $('.zhiding').show();
                $('.zidingyi').hide();
                var html = $('.check-content>input[type="radio"]:checked').siblings('span').html();
                if (html.trim() == '默认(不填)') {
                    $('.zhidingInput').hide();
                } else {
                    //console.log('111');
                    $('.zhidingInput').show();
                }
                $('#mailContent').val('');
                $('.canshu').show();
            } else if (html.trim() == '自定义') {
                $('.zhiding').hide();
                $('.zidingyi').show();
                $('.zhidingInput').hide();
                $('#mailContent').val('');
                $('.canshu').hide();
            }
        });
        //客户状态全选
        $scope.checkAll = function () {
            var target = $('.checkAll');
            var checked = target.prop('checked');
            console.log(checked);
            $('.check-detail>.check-content>input[type="checkbox"]').prop('checked', checked);
        }
        $('.check-detail').on('click', '.check-content>input[type="checkbox"]', function () {
            var target = $(this);//input[type=checkbox]:checked
            var len = $('.check-detail>.check-content>input[type=checkbox]').length;
            var checkedlen = $('.check-detail>.check-content>input[type=checkbox]:checked').length;
            if (checkedlen == len) {
                $('.checkAll').prop('checked', true);
            } else if (checkedlen < len) {
                $('.checkAll').prop('checked', false);
            }
        });
        //客户名称单选
        $('.checkbox').on('click', '.check-content>input[type="radio"]', function () {
            var target = $(this);
            var name = target.siblings('span').html();
            console.log(name);
            if (name.trim() == '默认(不填)') {
                $('.zhidingInput').hide();
            } else {
                //console.log('111');
                $('.zhidingInput').show();
            }
        });
        var cursorPosition = {
            get: function (textarea) {
                var rangeData = { text: "", start: 0, end: 0 };

                if (textarea.setSelectionRange) { // W3C
                    textarea.focus();
                    rangeData.start = textarea.selectionStart;
                    rangeData.end = textarea.selectionEnd;
                    rangeData.text = (rangeData.start != rangeData.end) ? textarea.value.substring(rangeData.start, rangeData.end) : "";
                } else if (document.selection) { // IE
                    textarea.focus();
                    var i,
                        oS = document.selection.createRange(),
                        // Don't: oR = textarea.createTextRange()
                        oR = document.body.createTextRange();
                    oR.moveToElementText(textarea);

                    rangeData.text = oS.text;
                    rangeData.bookmark = oS.getBookmark();

                    // object.moveStart(sUnit [, iCount])
                    // Return Value: Integer that returns the number of units moved.
                    for (i = 0; oR.compareEndPoints('StartToStart', oS) < 0 && oS.moveStart("character", -1) !== 0; i++) {
                        // Why? You can alert(textarea.value.length)
                        if (textarea.value.charAt(i) == '\r') {
                            i++;
                        }
                    }
                    rangeData.start = i;
                    rangeData.end = rangeData.text.length + rangeData.start;
                }

                return rangeData;
            },

            set: function (textarea, rangeData) {
                var oR, start, end;
                if (!rangeData) {
                    alert("You must get cursor position first.")
                }
                textarea.focus();
                if (textarea.setSelectionRange) { // W3C
                    textarea.setSelectionRange(rangeData.start, rangeData.end);
                } else if (textarea.createTextRange) { // IE
                    oR = textarea.createTextRange();

                    // Fixbug : ues moveToBookmark()
                    // In IE, if cursor position at the end of textarea, the set function don't work
                    if (textarea.value.length === rangeData.start) {
                        //alert('hello')
                        oR.collapse(false);
                        oR.select();
                    } else {
                        oR.moveToBookmark(rangeData.bookmark);
                        oR.select();
                    }
                }
            },

            add: function (textarea, rangeData, text) {
                var oValue, nValue, oR, sR, nStart, nEnd, st;
                this.set(textarea, rangeData);

                if (textarea.setSelectionRange) { // W3C
                    oValue = textarea.value;
                    nValue = oValue.substring(0, rangeData.start) + text + oValue.substring(rangeData.end);
                    nStart = nEnd = rangeData.start + text.length;
                    st = textarea.scrollTop;
                    textarea.value = nValue;
                    // Fixbug:
                    // After textarea.values = nValue, scrollTop value to 0
                    if (textarea.scrollTop != st) {
                        textarea.scrollTop = st;
                    }
                    textarea.setSelectionRange(nStart, nEnd);
                } else if (textarea.createTextRange) { // IE
                    sR = document.selection.createRange();
                    sR.text = text;
                    sR.setEndPoint('StartToEnd', sR);
                    sR.select();
                }
            }
        };
        //参数添加到内容
        $('.canshuGroup').on('click', 'span.canshubtn', function () {
            var target = $(this);
            var text = target.attr('data-value');
            text = "${" + text + "}";
            var tx = $('#mailContent')[0];
            var pos = cursorPosition.get(tx);

            cursorPosition.add(tx, pos, text);
            //var html = $('#mailContent').val();
            //html+=text;
            //$('#mailContent').val(html);
        });

        //确认新增
        $scope.addModel = function () {
            var modeName = $('#modelName').val();
            var msgName = $('#mailTitle').val();
            var msgContent = $('#mailContent').val();
            var toAddress = $('#mailAddres').val();
            var modelType = $('.tab>span.active').html();//模板类型
            //var emailType=$('#selectEmailType').val();
            var data = {
                "modeName": modeName,
                "msgName": msgName,
                "msgContent": msgContent
                //"emailType":emailType
            };
            if (modelType.trim() == '指定客户') {
                data.modelType = '101';
                data.toAddress = '';
                if ($('.check-content>input[type="checkbox"]:checked').length == 0) {
                    layer.msg('请选择客户状态');
                } else if (modeName == null || modeName == '' || modeName == undefined) {
                    layer.msg('模板名称不能为空');
                } else if (msgName == null || msgName == '' || msgName == undefined) {
                    layer.msg('邮件标题不能为空');
                } else if (msgContent == null || msgContent == '' || msgContent == undefined) {
                    layer.msg('邮件内容不能为空');
                } else {
                    var radio = $('.check-content>input[type="radio"]:checked').siblings('span').html();
                    var nameValue = $('#customerName').val();
                    data.nameValue = nameValue;
                    if (radio.trim() == '默认(不填)') {
                        data.nameKey = '';
                    } else if (radio.trim() == '包含') {
                        data.nameKey = 'in';
                    } else if (radio.trim() == '不包含') {
                        data.nameKey = 'out';
                    }
                    if ($('.checkAll').prop('checked')) {
                        data.userStatus = '0,1,2,3';
                    } else {
                        var checkbox = $('.check-content>input[type="checkbox"]:checked');
                        var str = '';
                        var len = checkbox.length;
                        $.each(checkbox, function (i, v) {
                            var text = $(this).siblings('span').html();
                            var status = getuserStatus(text);
                            if (i < len - 1) {
                                str += status + ',';
                            } else {
                                str += status;
                            }
                        });
                        data.userStatus = str;
                    }
                    //console.log(data);
                    addSelfModel(data);

                }

            } else if (modelType.trim() == '自定义') {
                data.modelType = '102';
                data.userStatus = '';
                data.nameKey = '';
                data.nameValue = '';
                if (modeName == null || modeName == '' || modeName == undefined) {
                    layer.msg('模板名称不能为空');
                } else if (msgName == null || msgName == '' || msgName == undefined) {
                    layer.msg('邮件标题不能为空');
                } else if (msgContent == null || msgContent == '' || msgContent == undefined) {
                    layer.msg('邮件内容不能为空');
                } else if (toAddress == null || toAddress == '' || toAddress == undefined) {
                    layer.msg('邮件地址不能为空');
                } else {
                    data.toAddress = toAddress;
                    addSelfModel(data);
                }
            }
        };
        //确认保存
        $scope.saveModel = function () {
            var modeName = $('#modelName').val();
            var msgName = $('#mailTitle').val();
            var msgContent = $('#mailContent').val();
            var toAddress = $('#mailAddres').val();
            var modelType = $('.tab>span.active').html();//模板类型
            var id = $('#SaveBtn').attr('data-id');
            var data = {
                "modeName": modeName,
                "msgName": msgName,
                "msgContent": msgContent,
                "id": id
            };
            if (modelType.trim() == '指定客户') {
                data.modelType = '101';
                data.toAddress = '';
                if ($('.check-content>input[type="checkbox"]:checked').length == 0) {
                    layer.msg('请选择客户状态');
                } else if (modeName == null || modeName == '' || modeName == undefined) {
                    layer.msg('模板名称不能为空');
                } else if (msgName == null || msgName == '' || msgName == undefined) {
                    layer.msg('邮件标题不能为空');
                } else if (msgContent == null || msgContent == '' || msgContent == undefined) {
                    layer.msg('邮件内容不能为空');
                } else {
                    var radio = $('.check-content>input[type="radio"]:checked').siblings('span').html();
                    var nameValue = $('#customerName').val();
                    data.nameValue = nameValue;
                    if (radio.trim() == '默认(不填)') {
                        data.nameKey = '';
                    } else if (radio.trim() == '包含') {
                        data.nameKey = 'in';
                    } else if (radio.trim() == '不包含') {
                        data.nameKey = 'out';
                    }
                    if ($('.checkAll').prop('checked')) {
                        data.userStatus = '0,1,2,3';
                    } else {
                        var checkbox = $('.check-content>input[type="checkbox"]:checked');
                        var str = '';
                        var len = checkbox.length;
                        $.each(checkbox, function (i, v) {
                            var text = $(this).siblings('span').html();
                            var status = getuserStatus(text);
                            if (i < len - 1) {
                                str += status + ',';
                            } else {
                                str += status;
                            }
                        });
                        data.userStatus = str;
                    }
                    console.log(data);
                    updateSelfModel(data);
                }

            } else if (modelType.trim() == '自定义') {
                data.modelType = '102';
                data.userStatus = '';
                data.nameKey = '';
                data.nameValue = '';
                if (modeName == null || modeName == '' || modeName == undefined) {
                    layer.msg('模板名称不能为空');
                } else if (msgName == null || msgName == '' || msgName == undefined) {
                    layer.msg('邮件标题不能为空');
                } else if (msgContent == null || msgContent == '' || msgContent == undefined) {
                    layer.msg('邮件内容不能为空');
                } else if (toAddress == null || toAddress == '' || toAddress == undefined) {
                    layer.msg('邮件地址不能为空');
                } else {
                    data.toAddress = toAddress;
                    console.log(data);
                    updateSelfModel(data);
                }

            }
        };

        function updateSelfModel(data) {
            erp.load();
            erp.postFun('app/modelEmail/editCustomEmailMode', JSON.stringify(data), function (data) {
                erp.closeLoad();
                console.log(data);
                if (data.data.code == '200') {
                    layer.msg('修改成功');
                    $('.zzc').hide();
                    getModelList();
                } else {
                    layer.msg('修改失败');
                }
            }, function (n) {
                console.log(n);
                erp.closeLoad();
            });
        }

        function addSelfModel(data) {
            erp.load();
            erp.postFun('app/modelEmail/addCustomEmailMode', JSON.stringify(data), function (data) {
                erp.closeLoad();
                console.log(data);
                if (data.data.code == '200') {
                    layer.msg('新增成功');
                    $('.zzc').hide();
                    getModelList();
                } else {
                    layer.msg('新增失败');
                }
            }, function (n) {
                console.log(n);
                erp.closeLoad();
            });
        }

        //在窗口发送邮件
        $scope.sendFunWin = function () {
            var modeName = $('#modelName').val();
            var msgName = $('#mailTitle').val();
            var msgContent = $('#mailContent').val();
            //var msgContent =  editor.txt.html();
            var toAddress = $('#mailAddres').val();
            var modelType = $('.tab>span.active').html();//模板类型
            var id = $('#SaveBtn').attr('data-id');
            var widowType = $('.zzc-wrap>h3').html();
            var data = {
                "modeName": modeName,
                "msgName": msgName,
                "msgContent": msgContent,
                "id": id,
                "editFlag": 'edit'
            };
            if (modelType.trim() == '指定客户') {
                data.modelType = '101';
                data.toAddress = '';
                if ($('.check-content>input[type="checkbox"]:checked').length == 0) {
                    layer.msg('请选择客户状态');
                } else if (modeName == null || modeName == '' || modeName == undefined) {
                    layer.msg('模板名称不能为空');
                } else if (msgName == null || msgName == '' || msgName == undefined) {
                    layer.msg('邮件标题不能为空');
                } else if (msgContent == null || msgContent == '' || msgContent == undefined) {
                    layer.msg('邮件内容不能为空');
                } else {
                    var radio = $('.check-content>input[type="radio"]:checked').siblings('span').html();
                    var nameValue = $('#customerName').val();
                    data.nameValue = nameValue;
                    if (radio.trim() == '默认(不填)') {
                        data.nameKey = '';
                    } else if (radio.trim() == '包含') {
                        data.nameKey = 'in';
                    } else if (radio.trim() == '不包含') {
                        data.nameKey = 'out';
                    }
                    if ($('.checkAll').prop('checked')) {
                        data.userStatus = '0,1,2,3';
                    } else {
                        var checkbox = $('.check-content>input[type="checkbox"]:checked');
                        var str = '';
                        var len = checkbox.length;
                        $.each(checkbox, function (i, v) {
                            var text = $(this).siblings('span').html();
                            var status = getuserStatus(text);
                            if (i < len - 1) {
                                str += status + ',';
                            } else {
                                str += status;
                            }
                        });
                        data.userStatus = str;
                    }
                    console.log(data);
                    if (widowType.trim() == '新增模板') {
                        sendMail(data);
                    } else {
                        erp.load();
                        erp.postFun('app/modelEmail/getSuccessSendModelMail', JSON.stringify({ "id": id }), function (result) {
                            erp.closeLoad();
                            console.log(result);
                            if (result.data.code == '200') {
                                var successMailSize = result.data.successMailSize;
                                if (successMailSize > 0) {
                                    //以发送过
                                    var str = '已发送数量为：' + successMailSize + "，是否需要重新发送？";
                                    layer.confirm(str, {
                                        btn: ['重发', '不重发']//按钮
                                    }, function (index) {
                                        layer.close(index);
                                        console.log('需要');
                                        data.resendFalg = "";
                                        console.log(data);
                                        sendMail(data);
                                    }, function (index) {
                                        layer.close(index);
                                        console.log('不用');
                                        data.resendFalg = "NO";
                                        console.log(data);
                                        sendMail(data);
                                    });
                                } else {
                                    sendMail(data);
                                }
                            }
                        }, function (n) {
                            console.log(n);
                            erp.closeLoad();
                        });
                    }

                    //sendMail(data);
                }
            } else if (modelType.trim() == '自定义') {
                data.modelType = '102';
                data.userStatus = '';
                data.nameKey = '';
                data.nameValue = '';
                if (modeName == null || modeName == '' || modeName == undefined) {
                    layer.msg('模板名称不能为空');
                } else if (msgName == null || msgName == '' || msgName == undefined) {
                    layer.msg('邮件标题不能为空');
                } else if (msgContent == null || msgContent == '' || msgContent == undefined) {
                    layer.msg('邮件内容不能为空');
                } else if (toAddress == null || toAddress == '' || toAddress == undefined) {
                    layer.msg('邮件地址不能为空');
                } else {
                    data.toAddress = toAddress;
                    console.log(data);
                    sendMail(data);
                }
            }
        };
        //发送邮件
        $scope.sendFun = function (id) {
            var data = {
                "id": id
            };
            sendMail(data);
        };
        //删除邮件
        $scope.deleteFun = function (id) {
            var data = {
                "id": id,
                "optType": "dell"
            };
            layer.confirm('确认要删除吗？', {
                btn: ['确定', '取消']//按钮
            }, function (index) {
                layer.close(index);
                erp.load();
                erp.postFun('app/modelEmail/udpateEmailModesStatus', JSON.stringify(data), function (data) {
                    erp.closeLoad();
                    if (data.data.code == '200') {
                        layer.msg('删除成功');
                        getModelList();
                    } else {
                        layer.msg('删除失败');
                    }
                }, function (n) {
                    console.log(n);
                    erp.closeLoad();
                });
            });

        };

        function sendMail(data) {
            layer.confirm('邮件每天限发送1800封，确认要发送吗？', {
                btn: ['确定', '取消']//按钮
            }, function (index) {
                layer.close(index);
                erp.load();
                erp.postFun('app/modelEmail/sendCustomModelMail', JSON.stringify(data), function (data) {
                    erp.closeLoad();
                    console.log(data);
                    if (data.data.code == '200') {
                        layer.msg('发送成功')
                    } else {
                        layer.msg(data.data.message);
                    }
                }, function (n) {
                    erp.closeLoad();
                    console.log(n);
                });
            });

        }

        function getuserStatus(text) {
            if (text.trim() == '正常') {
                return '1'
            } else if (text.trim() == '待审核') {
                return '3'
            } else if (text.trim() == '未通过') {
                return '0'
            } else if (text.trim() == '黑名单') {
                return '2'
            }
        }

    }]);

    //投诉建议
    app.controller('complaintCtrl', ['$scope', 'erp', '$routeParams', '$location', '$http', function ($scope, erp, $routeParams, $location, $http) {
        console.log('complaintCtrl');
        $scope.pageNum = '1';
        $scope.pageSize = '20';
        $scope.searchInfo = '';
        $('#searchInput').keypress(function (e) {
            if (e.keyCode == 13) {
                $scope.search()
            }
        })
        $scope.search = function () {
            console.log($scope.searchInfo);
            //$scope.title=$scope.searchInfo;
            $scope.pageNum = '1';
            getSuggestList();

        };
        //更换每页多少条数据
        $scope.pagesizechange = function (pagesize) {
            //console.log(pagesize)
            // $scope.pagesize=pagesize-0;
            $scope.pageNum = 1;
            getSuggestList();
        };
        //手动输入页码GO跳转
        $scope.pagenumchange = function () {
            var pagenum = Number($scope.pageNum);
            var totalpage = Math.ceil($scope.totalCounts / $scope.pageSize);
            if (pagenum > totalpage) {
                layer.msg('错误页码');
                $scope.pageNum = 1;
            } else {
                getSuggestList();
            }
        };
        getSuggestList();

        function getSuggestList() {
            var data = {
                page: $scope.pageNum,
                limit: $scope.pageSize,
                nameen: $scope.searchInfo,
                beginDate: $('#c-data-time').val(),
                endDate: $('#cdatatime2').val()
            };
            erp.load();
            erp.postFun('erp/suggest/searchSuggest', JSON.stringify(data), function (data) {
                erp.closeLoad();
                if (data.data.statusCode == '200') {
                    var result = data.data.result;
                    $scope.suggestList = result.list;
                    $scope.totalCounts = result.count;
                    pageFun();
                } else {
                    layer.msg(data.data.message)
                }
            }, function () {
                erp.closeLoad();
                layer.msg('查询失败');
            })
        }

        function pageFun() {
            $(".pagegroup1").jqPaginator({
                totalCounts: $scope.totalCounts || 1,
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
                    $scope.pageNum = n;
                    getSuggestList();
                }
            });
        }

        $scope.pageNum2 = '1';
        $scope.pageSize2 = '10';
        var username;
        //更换每页多少条数据
        $scope.pagesizechange2 = function (pagesize) {
            //console.log(pagesize)
            // $scope.pagesize=pagesize-0;
            var html = $('.zzcWrap h1').html();
            var data = {
                "page": $scope.pageNum2,
                "limit": $scope.pageSize2,
                "nameen": username
            };
            $scope.pageNum2 = 1;
            if (html.trim() == '建议详情') {
                getInfoList('1', data);
            } else if (html.trim() == '投诉详情') {
                getInfoList('2', data);
            }
            //getSuggestList();
        };
        //手动输入页码GO跳转
        $scope.pagenumchange2 = function () {
            var pagenum = Number($scope.pageNum2);
            var totalpage = Math.ceil($scope.totalCounts2 / $scope.pageSize2);
            if (pagenum > totalpage) {
                layer.msg('错误页码');
                $scope.pageNum2 = 1;
            } else {
                var html = $('.zzcWrap h1').html();
                var data = {
                    "page": $scope.pageNum2,
                    "limit": $scope.pageSize2,
                    "nameen": username
                };
                if (html.trim() == '建议详情') {
                    getInfoList('1', data);
                } else if (html.trim() == '投诉详情') {
                    getInfoList('2', data);
                }
            }
        };
        //打开弹窗

        $scope.openZzc = function (type, nameen) {
            var title = '';
            var text = '';
            $scope.infoList = '';
            $scope.totalCounts2 = '';
            $scope.pageNum2 = '1';
            username = nameen;
            var data = {
                "page": $scope.pageNum2,
                "limit": $scope.pageSize2,
                "nameen": nameen,
                beginDate: $('#c-data-time').val(),
                endDate: $('#cdatatime2').val()
            };
            if (type == '1') {
                title = '建议详情';
                text = '建议内容';
                getInfoList('1', data);
            } else if (type == '2') {
                title = '投诉详情';
                text = '投诉内容';
                getInfoList('2', data);
            }
            $('.zzcWrap h1').html(title);
            $('.jynr').html(text);
            $('.zzc').show();
            $('.infoWrap').hide();
        };

        function getInfoList(type, data) {
            if (type == '1') {
                erp.load();
                erp.postFun('erp/suggest/searchSuggestSuggestion', JSON.stringify(data), function (data2) {
                    erp.closeLoad();
                    console.log(data2);
                    if (data2.data.statusCode == '200') {
                        var result = data2.data.result;
                        $scope.infoList = result.list;
                        $scope.totalCounts2 = result.count;
                        console.log($scope.infoList);
                        pageFun2(type, data);
                    } else {
                        layer.msg(data.data.message);
                    }
                }, function (n) {
                    erp.closeLoad();
                    console.log('查询失败')
                });
            } else if (type == '2') {
                erp.load();
                erp.postFun('erp/suggest/searchSuggestComplain', JSON.stringify(data), function (data2) {
                    erp.closeLoad();
                    console.log(data2);
                    if (data2.data.statusCode == '200') {
                        var result = data2.data.result;
                        $scope.infoList = result.list;
                        $scope.totalCounts2 = result.count;
                        console.log($scope.infoList);
                        pageFun2(type, data);
                    } else {
                        layer.msg(data.data.message);
                    }
                }, function (n) {
                    erp.closeLoad();
                    console.log('查询失败')
                });
            }
        }

        function pageFun2(x, data) {
            $(".pagegroup2").jqPaginator({
                totalCounts: $scope.totalCounts2 || 1,
                pageSize: $scope.pageSize2 * 1,
                visiblePages: 5,
                currentPage: $scope.pageNum2 * 1,
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
                    $scope.pageNum2 = n;

                    //"page":$scope.pageNum2, "limit":$scope.pageSize2,
                    data.page = $scope.pageNum2;
                    data.limit = $scope.pageSize2;
                    console.log(data);
                    getInfoList(x, data);
                }
            });
        }

        //关闭弹窗
        $scope.closeZzc = function () {
            $('.zzc').hide();
        }
        //dakai info
        $scope.openInfo = function (item) {
            $('.infoWrap').show();
            $('.customerName').html(item.account);
            $('.info-content').html(item.message);
        }
        $scope.closeInfo = function () {
            $('.infoWrap').hide();
        }
    }]);


    //页面模板
    app.controller('pageModelCtrl', ['$scope', 'erp', '$routeParams', '$location', '$http', function ($scope, erp, $routeParams, $location, $http) {
        console.log('pageModelCtrl');

        $scope.pageSize = '20';
        $scope.pageNum = '1';
        $scope.searchInfo = '';
        $scope.startDate = '';
        $scope.endDate = '';

        getPageList();

        function getPageList() {
            $scope.pageSize = $scope.pageSize.toString();
            $scope.pageNum = $scope.pageNum.toString();
            var data = {
                "startDate": $scope.startDate,
                "endDate": $scope.endDate,
                "templateName": $scope.searchInfo,
                "pageSize": $scope.pageSize,
                "pageNum": $scope.pageNum,
                "state": ''
            };
            erp.load();
            erp.postFun('app/modelEmail/getPageTemplate', JSON.stringify(data), function (data) {
                erp.closeLoad();
                console.log(data);
                if (data.data.code == '200') {
                    var result = data.data;
                    $scope.totalCounts = result.count;
                    $scope.pageList = result.list;
                    if ($scope.pageList.length == 0) {
                        layer.msg('暂无数据')
                    }
                    let totalNum = Math.ceil(Number($scope.totalCounts)/Number($scope.pageSize));
                    $scope.$broadcast('page-data', {
                        pageSize: $scope.pageSize,
                        pageNum: $scope.pageNum,
                        totalNum: totalNum,
                        totalCounts: result.totalCounts,
                        pageList: ['20', '30', '50']
                    });
                } else {
                    layer.msg('查询失败');
                }
            }, function () {
                erp.closeLoad();
                layer.msg('Network error, please try again later');
            });
        }
        $scope.$on('pagedata-fa', function (d, data) {
            $scope.pageNum = data.pageNum;
            $scope.pageSize = data.pageSize;
            getPageList();
        })

        $scope.searchFun = function () {
            var startDate = $('#c-data-time').val();
            var endDate = $('#cdatatime2').val();
            $scope.startDate = startDate;
            $scope.endDate = endDate;
            getPageList();
        };
        $('#searchInput').keypress(function (e) {
            if (e.keyCode == 13) {
                $scope.search()
            }
        })
        $scope.search = function () {
            console.log($scope.searchInfo);
            //$scope.title=$scope.searchInfo;
            getPageList();

        };
        //更换每页多少条数据
        $scope.pagesizechange = function (pagesize) {
            //console.log(pagesize)
            // $scope.pagesize=pagesize-0;
            $scope.pageNum = '1';
            getPageList();
        };
        //手动输入页码GO跳转
        $scope.pagenumchange = function () {
            var pagenum = Number($scope.pageNum);
            var totalpage = Math.ceil($scope.totalCounts / $scope.pageSize);
            if (pagenum > totalpage) {
                layer.msg('错误页码');
                $scope.pageNum = '1';
            } else {
                getPageList();
            }
        };
        $scope.classState = function (state) {
            if (state == 0) {
                return '启用';
            } else if (state == 1) {
                return '停用';
            }
        };

        //打开新增弹窗
        $scope.openAdd = function () {
            var zzc1 = $('.zzc1');
            zzc1.show().find('h2').html('新增模板');
            zzc1.find('.addBtn').show();
            zzc1.find('.UpdateBtn').hide();
            zzc1.find('#modelName').val('');
            zzc1.find('#mailTitle').val('');
            zzc1.find('#modelCode').val('');
        }
        //打开编辑弹窗
        $scope.openEdit = function (id, modelName, mailTitle, modelCode, state) {
            var zzc1 = $('.zzc1');
            zzc1.show().find('h2').html('编辑模板');
            zzc1.find('.addBtn').hide();
            zzc1.find('.UpdateBtn').show().attr('data-id', id);
            zzc1.find('.UpdateBtn').attr('data-state', state);
            zzc1.find('#modelName').val(modelName);
            zzc1.find('#mailTitle').val(mailTitle);
            zzc1.find('#modelCode').val(modelCode);
        }
        //关闭遮罩层1
        $scope.closeZzc1 = function () {
            $('.zzc1').hide();
        }
        //打开预览
        $scope.openPreview = function (code) {
            $('.zzc2').show();
            $('.preview').html(code);
        }
        //关闭遮罩层2
        $scope.closeZzc2 = function () {
            $('.zzc2').hide();
        }
        //确认新增
        $scope.addFun = function () {
            var modelName = $('#modelName').val();
            var mailTitle = $('#mailTitle').val();
            var modelCode = $('#modelCode').val();
            if (modelName == null || modelName == '' || modelName == undefined) {
                layer.msg('模板名称不能为空');
            } else if (mailTitle == '' || mailTitle == null || mailTitle == undefined) {
                layer.msg('邮件标题不能为空');
            } else if (modelCode == '' || modelCode == null || modelCode == undefined) {
                layer.msg('模板代码不能为空');
            } else {
                var data = {
                    "templateName": modelName,
                    "emailTitle": mailTitle,
                    "pageSourceCode": modelCode
                };
                console.log(data);
                erp.load();
                erp.postFun('app/modelEmail/addPageTemplate', JSON.stringify(data), function (data) {
                    erp.closeLoad();
                    console.log(data);
                    if (data.data.code == '200') {
                        layer.msg('新增成功');
                        $('.zzc1').hide();
                        getPageList();
                    } else {
                        layer.msg('新增失败')
                    }
                }, function () {
                    erp.closeLoad();
                    layer.msg('Network error, please try again later');
                });
            }
        }
        //确认修改
        $('.UpdateBtn').click(function () {
            var target = $(this);
            var id = target.attr('data-id');
            var state = target.attr('data-state');
            var modelName = $('#modelName').val();
            var mailTitle = $('#mailTitle').val();
            var modelCode = $('#modelCode').val();
            if (modelName == null || modelName == '' || modelName == undefined) {
                layer.msg('模板名称不能为空');
            } else if (mailTitle == '' || mailTitle == null || mailTitle == undefined) {
                layer.msg('邮件标题不能为空');
            } else if (modelCode == '' || modelCode == null || modelCode == undefined) {
                layer.msg('模板代码不能为空');
            } else {
                var data = {
                    "id": id,
                    "templateName": modelName,
                    "emailTitle": mailTitle,
                    "pageSourceCode": modelCode,
                    "state": state
                };
                erp.load();
                erp.postFun('app/modelEmail/updatePageTemplate', JSON.stringify(data), function (data) {
                    erp.closeLoad();
                    console.log(data);
                    if (data.data.flag == true) {
                        layer.msg('修改成功');
                        $('.zzc1').hide();
                        getPageList();
                    } else {
                        layer.msg('修改失败');
                    }
                }, function () {
                    erp.closeLoad();
                    layer.msg('Network error, please try again later');
                });
            }
        });
        //启用停用
        $scope.updateState = function (item) {
            var str = '';
            var data = {
                "id": item.id,
                "templateName": item.templateName,
                "emailTitle": item.emailTitle,
                "pageSourceCode": item.pageSourceCode
            };
            if (item.state == 0) {
                str = '确认要停用吗？';
                data.state = 1;
            } else if (item.state == 1) {
                str = '确认要启用吗？';
                data.state = 0;
            }
            layer.confirm(str, {
                btn: ['确定', '取消']//按钮
            }, function (index) {
                layer.close(index);
                console.log(data);
                erp.load();
                erp.postFun('app/modelEmail/updatePageTemplate', JSON.stringify(data), function (data) {
                    erp.closeLoad();
                    console.log(data);
                    if (data.data.flag == true) {
                        layer.msg('操作成功');
                        getPageList();
                    } else {
                        layer.msg('操作失败');
                    }
                }, function () {
                    erp.closeLoad();
                    layer.msg('Network error, please try again later');
                });
            });
        }
        //删除
        $scope.deleteFun = function (id) {
            layer.confirm('确认要删除吗？', {
                btn: ['确定', '取消']//按钮
            }, function (index) {
                layer.close(index);
                var data = {
                    "id": id.toString()
                };
                erp.load();
                erp.postFun('app/modelEmail/deletePageTemplate', JSON.stringify(data), function (data) {
                    erp.closeLoad();
                    console.log(data);
                    if (data.data.flag == true) {
                        layer.msg('操作成功');
                        getPageList();
                    } else {
                        layer.msg('操作失败');
                    }
                }, function () {
                    erp.closeLoad();
                    layer.msg('Network error, please try again later');
                });
            });
        }
    }]);

    //邮件发送
    app.controller('mailSendingCtrl', ['$scope', 'erp', '$routeParams', '$location', '$http', function ($scope, erp, $routeParams, $location, $http) {
      //富文本编辑器
        console.log('mailSendingCtrl');
        var E = window.wangEditor;
        var editor = new E('#wang');
        // editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
        // editor.customConfig.showLinkImg = false;
        //editor.customConfig.height = 132;
        editor.customConfig.menus = [
          'head',  // 标题
          'bold',  // 粗体
          'fontSize',  // 字号
          'fontName',  // 字体
          'italic',  // 斜体
          'underline',  // 下划线
          'strikeThrough',  // 删除线
          'foreColor',  // 文字颜色
          'backColor',  // 背景颜色
          'link',  // 插入链接
          'list',  // 列表
          'justify',  // 对齐方式
          'quote',  // 引用
          'image',  // 插入图片
          'table',  // 表格
          'video',  // 插入视频
          'code',  // 插入代码
          'undo',  // 撤销
          'redo'  // 重复
        ]
        //editor.customConfig.uploadImgServer = '/upload' //上传本地图片
        editor.customConfig.customUploadImg = function (files, insert) {
            erp.ossUploadFile(files, function (data) {
                console.log(data);
                if (data.code == 0) {
                    layer.msg('上传失败');
                    return;
                }
                if (data.code == 2) {
                    layer.msg('部分图片上传失败');
                }
                var result = data.succssLinks;
                console.log(result);
                var imgArr = [];
                for (var j = 0; j < result.length; j++) {
                    var srcList = result[j].split('.');
                    var fileName = srcList[srcList.length - 1].toLowerCase();
                    console.log(fileName);
                    if (fileName == 'png' || fileName == 'jpg' || fileName == 'jpeg' || fileName == 'gif') {
                        insert(result[j]);
                    }
                }
            });
        }


        editor.create();

        $scope.pageSize = '20';
        $scope.pageNum = '1';
        $scope.searchInfo = '';
        $scope.startDate = '';
        $scope.endDate = '';


        getHistoryList();
        getModelList();

        function getModelList() {
            var data = {
                "startDate": '',
                "endDate": '',
                "templateName": '',
                "pageSize": '9999',
                "pageNum": '1',
                "state": '0'
            };
            //erp.load();
            erp.postFun('app/modelEmail/getPageTemplate', JSON.stringify(data), function (data) {
                //console.log(data);
                if (data.data.code == '200') {
                    $scope.modelList = data.data.list;
                }
            }, function () {
                layer.msg('Network error, please try again later');
            });
        }

        //获取历史记录
        function getHistoryList() {
            $scope.pageSize = $scope.pageSize.toString();
            $scope.pageNum = $scope.pageNum.toString();
            var data = {
                "pageNum": $scope.pageNum,
                "pageSize": $scope.pageSize,
                "emailTitle": $scope.searchInfo,
                "startDate": $scope.startDate,
                "endDate": $scope.endDate
            };
            erp.load();
            erp.postFun('app/modelEmail/getEmailHistoricalRecords', JSON.stringify(data), function (data) {
                erp.closeLoad();
                console.log(data);
                if (data.data.code == '200') {
                    var result = data.data;
                    $scope.totalCounts = result.count;
                    $scope.historyList = result.list;
                    pageFun();
                    if (data.data.list.length == 0) {
                        layer.msg('暂无数据');
                    }
                } else {
                    layer.msg('查询失败');
                }
            }, function () {
                erp.closeLoad();
                layer.msg('Network error, please try again later');
            });
        };

        function pageFun() {
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.totalCounts || 1,
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
                    $scope.pageNum = n;
                    getHistoryList();
                }
            });
        }

        $scope.searchFun = function () {
            var startDate = $('#c-data-time').val();
            var endDate = $('#cdatatime2').val();
            $scope.startDate = startDate;
            $scope.endDate = endDate;
            getHistoryList();
        };
        $('#searchInput').keypress(function (e) {
            if (e.keyCode == 13) {
                $scope.search()
            }
        })
        $scope.search = function () {
            console.log($scope.searchInfo);
            //$scope.title=$scope.searchInfo;
            getHistoryList();

        };
        //更换每页多少条数据
        $scope.pagesizechange = function (pagesize) {
            //console.log(pagesize)
            // $scope.pagesize=pagesize-0;
            $scope.pageNum = '1';
            getPageList();
        };
        //手动输入页码GO跳转
        $scope.pagenumchange = function () {
            var pagenum = Number($scope.pageNum);
            var totalpage = Math.ceil($scope.totalCounts / $scope.pageSize);
            if (pagenum > totalpage) {
                layer.msg('错误页码');
                $scope.pageNum = '1';
            } else {
                getPageList();
            }
        };

        $scope.classGetType = function (item) {
            var state = item.customerStatus;
            if (state == '') {
                return '指定客户';
            } else if (state == '0,1,2,3,4') {
                return '全部客户';
            } else if (state == '0') {
                return '未通过客户';
            } else if (state == '1') {
                return '正常客户';
            } else if (state == '2') {
                return '黑名单客户';
            } else if (state == '3') {
                return '待审核客户';
            } else if (state == '4') {
                return '游客';
            }
        };
        //打开发送邮件弹窗
        $scope.opensend = function () {
            $('.zzc1').show();
            $(' input[type="radio"]').prop('checked', false);
            $('.radioTop .radioWrap:nth-child(1) input[type="radio"]').prop('checked', true);
            $('.khmc02 .radioWrap:nth-child(1) input[type="radio"]').prop('checked', true);
            $('.khmc03 .radioWrap:nth-child(1) input[type="radio"]').prop('checked', true);
            $('.khmc01').hide().val('');
            $('.khmc02').show();
            $('.btn01').addClass('act');
            $('.btn02').removeClass('act');
            $('.yjmb01').addClass('act');
            $('.yjmb02').removeClass('act');
            $('#modelNameSelect').val('');
            $('#mailContent').val('');
            $('#mailTitle').val('');
            $('#customerAdress').val('');
            $('#customerUserName').val('').hide();//customerUserName
            $('#YoukeName').val('').hide();//customerUserName
            // $('#wang').find('.w-e-text-container').css('height','220px');
        };

        //选择邮件模板
        $('#modelNameSelect').change(function () {
            var opt = $(this).find('option:selected');
            var mailTitle = opt.attr('data-title');
            $('#mailTitle').val(mailTitle);
        });
        //打开预览
        $scope.yulan = function (code) {
            //console.log(code);
            var opt = $('#modelNameSelect option:selected');
            //console.log(opt.val());
            if (opt.val() == '') {
                layer.msg('请选择模板');
            } else {
                var editcode = opt.attr('data-edit');
                //console.log(editcode);
                var code = opt.attr('data-code');
                var html = '';
                var num = '';
                if (editcode == '' || editcode == null || editcode == undefined) {
                    html = code;
                    num = 'old';
                } else {
                    html = editcode;
                    num = 'new';
                }
                console.log(num);
                $('.zzc2').show().find('.previewWrap>h2').html('预览');
                var target = $('.preview');
                target.html(html);
                target.find('.bannerBtn').css('display', 'none');
                target.find('.textBtn').css('display', 'none');
                target.find('.categoryBtn').css('display', 'none');
                //target.find('#categoryBtn2').css('display','inline-block');
                target.find('.productBtn').css('display', 'none');
                $('.saveBtn').hide();
                $('.zzc3').hide();

            }
        };
        //打开编辑
        $scope.openEidt = function () {
            var opt = $('#modelNameSelect option:selected');
            //console.log(opt.val());
            if (opt.val() == '') {
                layer.msg('请选择模板');
            } else {
                var editcode = opt.attr('data-edit');
                //console.log(editcode);
                var code = opt.attr('data-code');
                var html = '';
                var num = '';
                if (editcode == '' || editcode == null || editcode == undefined) {
                    html = code;
                    num = 'old';
                } else {
                    html = editcode;
                    num = 'new';
                }
                console.log(num);
                //console.log(code);
                $('.zzc2').show().find('.previewWrap>h2').html('编辑');
                var target = $('.preview');
                target.html(html);
                target.find('.bannerBtn').css('display', 'block');
                target.find('.textBtn').css('display', 'block');
                target.find('.categoryBtn').css('display', 'inline-block');
                //target.find('#categoryBtn2').css('display','inline-block');
                target.find('.productBtn').css('display', 'block');
                $('.saveBtn').show();
                $('.zzc3').hide();
            }
        };
        $('.preview').on('click', '.mailBtn', function () {
            $('.zzc3').show();
            var btnName = $(this).html();
            //console.log(btnName);
            if (btnName.trim() == "替换链接") {
                $('.previewWin').css('width', '350px');
                $('.winWrap').hide();
                $('#bjlj').show();
                $('#bjljLink').val('');
            } else if (btnName.trim() == "替换图片") {
                $('.previewWin').css('width', '350px');
                $('.winWrap').hide();
                $('#thtp').show().find('input[type="radio"]').prop('checked', false);
                $('#thtp').find('.radioWrap:nth-child(1) input[type="radio"]').prop('checked', true);
                $('#tplj').hide();
                $('#bdsc').show();
                $('#piclink2').val('');
                $('#submitPic').val('');
            } else if (btnName.trim() == "替换文本") {
                $('.winWrap').hide();
                $('#bjwa').show();
                $('.previewWin').css({
                    "width": "490px",
                    "margin": "200px auto"
                });
                var test = $(this).parent().prev('p').html();
                $('#bjwaTextarea').val(test).css('width', '400px');
            } else if (btnName.trim() == "替换类目") {
                $('.previewWin').css('width', '350px');
                $('.winWrap').hide();
                $('#bjlm').show();
                var id = $(this).parent().prev().attr('id');
                //console.log(id);
                $('#bjlmBtn').attr('data-id', id);
                $('#bjlmText').val('');
            } else if (btnName.trim() == "替换商品") {
                $('.previewWin').css('width', '350px');
                $('.winWrap').hide();
                $('#thsp').show();
                var id = $(this).parent().parent().attr('id');
                $('#thspBtn').attr('data-id', id);
                $('#thspSKU').val('');
            }
        });

        //确认编辑文案
        $('#bjwaBtn').click(function () {
            var text = $('#bjwaTextarea').val();
            var target = $('.preview').find('.p-text>p');
            target.html(text);
            $scope.closeWin();
        });
        //确认编辑类目
        $('#bjlmBtn').click(function () {
            var text = $('#bjlmText').val();
            var id = '#' + $(this).attr('data-id');
            var target = $('.preview').find(id);
            target.html(text);
            $scope.closeWin();
        });
        //确认替换连接
        $('#bjljBtn').click(function () {
            var link = $('#bjljLink').val();
            var target = $('.preview').find('.p-banner>a');
            target.attr('href', link);
            $scope.closeWin();
        });
        //上传图片
        $('#submitPic').change(function () {
            var target = $(this);
            var id = $(this).attr('id');
            erp.ossUploadFile($('#submitPic')[0].files, function (data) {
                console.log(data);
                if (data.code == 0) {
                    layer.msg('上传失败');
                    return;
                }
                if (data.code == 2) {
                    layer.msg('部分图片上传失败');
                }
                var result = data.succssLinks;
                console.log(result);
                var imgArr = [];
                for (var j = 0; j < result.length; j++) {
                    var srcList = result[j].split('.');
                    var fileName = srcList[srcList.length - 1].toLowerCase();
                    console.log(fileName);
                    if (fileName == 'png' || fileName == 'jpg' || fileName == 'jpeg' || fileName == 'gif') {
                        imgArr.push(result[j]);
                        $('#submitPic').val('');
                    }
                }
                console.log(imgArr);
                var link = imgArr[0];
                target.next('p').show().attr('data-link', link);
                //$scope.$apply();
            });

        });
        //确认替换图片
        $('#thtpBtn').click(function () {
            var val = $('#thtp input[type="radio"]:checked').val();
            var target = $('.preview').find('.p-banner>a>img');
            console.log(val);
            if (val == '0') {
                var link = $('#submitPic').next('p').attr('data-link');
                target.attr('src', link);
                $scope.closeWin();
                $('#submitPic').next('p').hide();
            } else if (val == '1') {
                var link = $('#piclink2').val();
                target.attr('src', link);
                $scope.closeWin();
            }
        });
        //确认替换商品 pojo/product/list
        $('#thspBtn').click(function () {
            var target = $(this);
            var sku = $('#thspSKU').val();
            var data = {
                "flag": "0",
                "status": "3",
                "pageNum": "1",
                "pageSize": "20",
                "filter01": "SKU",
                "filter02": sku,
                "filter03": "",
                "filter04": "",
                "filter05": "",
                "filter06": "",
                "filter21": "",
                "filter22": "",
                "filter23": "",
                "filter24": "",
                "filter11": "",
                "filter12": "",
                "autFlag": "01",
                "chargeId": "",
                "flag2": ""
            };
            erp.load();
            erp.postFun('pojo/product/list', JSON.stringify(data), function (data) {
                erp.closeLoad();
                //CJYDYDYD00110
                if (data.data.statusCode == '200') {

                    var result = JSON.parse(data.data.result);
                    console.log(result);
                    if (result.ps.length == 0) {
                        layer.msg('未找到商品，请检查SKU');
                    } else {
                        layer.msg('查询成功');
                        var sp = result.ps[0];
                        console.log(sp);
                        var aut = sp.authorityStatus;
                        if (aut == '1') {
                            //共有
                            var name = sp.nameEn;
                            var imgUrl = sp.bigImg;
                            var price = sp.sellPrice;
                            var picId = sp.id;
                            var id = '#' + target.attr('data-id');
                            var parent = $('.preview').find(id);
                            var product = parent.find('.product');
                            console.log(product);
                            var imgele = product.find('.product-img>a>img');
                            imgele.attr('src', imgUrl);
                            imgele.attr('title', name);
                            imgele.attr('alt', 'Product Picture');
                            var str = "https://app.cjdropshipping.com/product-detail.html?id=" + picId;
                            imgele.parent().attr('href', str);
                            product.find('.product-name>p').html(name);
                            product.find('.product-bottom .product-price>span').html(price);
                            $scope.closeWin();
                        } else {
                            layer.msg('不能推送私有商品');
                        }
                    }
                } else {
                    layer.msg('查询失败');
                }
            }, function () {
                erp.closeLoad();
                layer.msg('Network error, please try again later');
            });
        });
        //保存编辑
        $('.saveBtn').click(function () {
            $('.zzc2').hide();
            var target = $('.preview');
            target.find('.bannerBtn').css('display', 'none');
            target.find('.textBtn').css('display', 'none');
            target.find('.categoryBtn').css('display', 'none');
            //target.find('#categoryBtn2').css('display','inline-block');
            target.find('.productBtn').css('display', 'none');
            var code = $('.preview').html();
            var opt = $('#modelNameSelect option:selected');
            opt.attr('data-edit', code);
        });

        //客户状态选择判断不同客户名称
        $('.khzt input[type="radio"]').change(function () {
            var val = $(this).val();
            console.log(val);
            if (val == '6') {
                $('.khmc01').show();
                $('.khmc02').hide();
                $('.khmc03').hide();
                $('.emailCanshu').hide();
            } else if (val == '5') {
                $('.khmc01').hide();
                $('.khmc02').hide();
                $('.khmc03').css('display', 'flex');
                $('.emailCanshu').hide();
                var text = $('.selectTypeBtnGroup').find('.act').html();
                if (text.trim() == '文本邮件') {
                    $('.emailCanshu').show();
                    $('.emailCanshu').find('.canshubtn').hide().eq(3).show();
                }
            } else {
                $('.khmc01').hide();
                $('.khmc02').show();
                $('.khmc03').hide();
                var text = $('.selectTypeBtnGroup').find('.act').html();
                if (text.trim() == '文本邮件') {
                    $('.emailCanshu').show();
                    $('.emailCanshu').find('.canshubtn').show();
                }

            }
        });

        $('.khmc02 input[type="radio"]').change(function () {
            var val = $(this).val();
            if (val != '0') {
                $('#customerUserName').show();
            } else {
                $('#customerUserName').hide();
            }
        });
        $('.khmc03 input[type="radio"]').change(function () {
            var val = $(this).val();
            if (val != '0') {
                $('#YoukeName').show();
            } else {
                $('#YoukeName').hide();
            }
        });
        //选择本地上传 or 图片链接
        $('#thtp input[type="radio"]').change(function () {
            var val = $(this).val();
            if (val == '0') {
                $('#tplj').hide();
                $('#bdsc').show();
            } else if (val == '1') {
                $('#tplj').show();
                $('#bdsc').hide();
            }
        });


        //选择不同邮件
        $('.selectTypeBtnGroup').on('click', 'button', function () {
            var target = $(this);
            target.addClass('act').siblings('.act').removeClass('act');
            var index = target.index();
            console.log(index);
            if (index == 0) {
                $('.yjmb01').addClass('act');
                $('.yjmb02').removeClass('act');
                $('.yjmb.email').removeClass('act');
                $('.emailCanshu').hide();
            } else if (index == 1) {
                $('.yjmb02').addClass('act');
                $('.yjmb01').removeClass('act');
                $('.yjmb.email').addClass('act');
                var val = $('.khzt input[type="radio"]:checked').val();
                console.log(val);
                if (val == '5') {
                    $('.emailCanshu').show();
                    $('.emailCanshu').find('.canshubtn').hide().eq(3).show();
                } else if (val == '6') {
                    $('.emailCanshu').hide();
                } else {
                    $('.emailCanshu').show();
                    $('.emailCanshu').find('.canshubtn').show();
                }

            }
        });
        // 邮件预览
        $scope.emailYulan = function () {
          var email = editor.txt.html()
          $('.zzc2').show().find('.previewWrap>h2').html('预览');
            $('.saveBtn').hide();
            //$('.previewWin').hide();
            $('.preview').html(email);
        }
        //打开预览
        $scope.openPreview = function (code) {
            $('.zzc2').show().find('.previewWrap>h2').html('预览');
            $('.saveBtn').hide();
            //$('.previewWin').hide();
            $('.preview').html(code);
        }
        //关闭遮罩层2
        $scope.closeZzc2 = function () {
            $('.zzc2').hide();
        }
        //关闭遮罩层1
        $scope.closezzc1 = function () {
            $('.zzc1').hide();
            $('#modelNameSelect').find('option:selected').attr('data-edit', '');
        }
        //关闭编辑弹窗
        $scope.closeWin = function () {
            $('.zzc3').hide();
        }
        //发送邮件
        $scope.sendFun = function () {
            var checked = $('.khzt input[type="radio"]:checked');
            var val = checked.val();
            //console.log(val);
            var msgName = $('#mailTitle').val();
            var emailType = $('#selectMailType').val().toLowerCase();
            //console.log(emailType);
            $scope.editFlag = 'edit';
            $scope.emailType = emailType;
            if (msgName == null || msgName == '' || msgName == undefined) {
                layer.msg('邮件标题不能为空');
            }else{
                $scope.msgName = msgName;
                var html = $('.selectTypeBtnGroup .act').html();
                var msgContent = '';
                var modeName = '';
                if (html.trim() == '模板邮件') {
                    var opt = $('#modelNameSelect option:selected');
                    modeName = opt.html();
                    var editcode = opt.attr('data-edit');
                    var code = opt.attr('data-code');
                    if (editcode == '' || editcode == null || editcode == undefined) {
                        msgContent = code;
                    } else {
                        msgContent = editcode;
                    }
                    $scope.id = opt.attr('data-id');
                } else if (html.trim() == '文本邮件') {
                    // msgContent = $('#mailContent').val();
                    msgContent= editor.txt.html();
                    $scope.id = '';
                }
                $scope.modeName = modeName;
                if (msgContent == '' || msgContent == null || msgContent == undefined) {
                    layer.msg('邮件内容不能为空');
                } else {
                    $scope.msgContent = msgContent;
                    if (val == '6') {
                        //自定义
                        var address = $('#customerAdress').val();
                        var reg = /^[a-zA-Z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
                        if (address == '' || address == null || address == undefined) {
                            layer.msg('发送地址不能为空');
                        } else if (!reg.test(address)) {
                          layer.msg('邮箱格式不正确');
                          console.log()
                        } else{
                            $scope.modelType = '102';
                            $scope.toAddress = address;
                            $scope.nameKey = '';
                            $scope.nameValue = '';
                            var data = {
                                "modeName": $scope.modeName,
                                "msgName": $scope.msgName,
                                "msgContent": $scope.msgContent,
                                "id": $scope.id,
                                "editFlag": $scope.editFlag,
                                "modelType": $scope.modelType,
                                "toAddress": $scope.toAddress,
                                "nameValue": $scope.nameValue,
                                "nameKey": $scope.nameKey,
                                "emailType": $scope.emailType
                            };
                            sendMail(data);
                        }
                    } else if (val == '5') {
                        //游客
                        var cn = $('.khmc03 input[type="radio"]:checked').val();
                        var nameValue = $('#YoukeName').val();
                        $scope.modelType = '103';
                        $scope.toAddress = '';
                        if (cn == '0') {
                            $scope.nameValue = '';
                            $scope.nameKey = '';
                            var data = {
                                "modeName": $scope.modeName,
                                "msgName": $scope.msgName,
                                "msgContent": $scope.msgContent,
                                "id": $scope.id,
                                "editFlag": $scope.editFlag,
                                "modelType": $scope.modelType,
                                "toAddress": $scope.toAddress,
                                "nameValue": $scope.nameValue,
                                "nameKey": $scope.nameKey,
                                "emailType": $scope.emailType
                            };
                            sendMail(data);
                        } else {
                            if (nameValue == '' || nameValue == undefined || nameValue == null) {
                                layer.msg('游客邮箱不能为空');
                            } else {
                                if (cn == '1') {
                                    $scope.nameValue = nameValue;
                                    $scope.nameKey = 'in';
                                } else if (cn == '2') {
                                    $scope.nameValue = nameValue;
                                    $scope.nameKey = 'out';
                                }
                                var data = {
                                    "modeName": $scope.modeName,
                                    "msgName": $scope.msgName,
                                    "msgContent": $scope.msgContent,
                                    "id": $scope.id,
                                    "editFlag": $scope.editFlag,
                                    "modelType": $scope.modelType,
                                    "toAddress": $scope.toAddress,
                                    "nameValue": $scope.nameValue,
                                    "nameKey": $scope.nameKey,
                                    "emailType": $scope.emailType
                                    //"userStatus":$scope.userStatus
                                };
                                sendMail(data);
                            }
                        }
                    } else {
                        //指定  userStatus
                        var cn = $('.khmc02 input[type="radio"]:checked').val();
                        var nameValue = $('#customerUserName').val();
                        $scope.modelType = '101';
                        $scope.toAddress = '';
                        console.log(cn);
                        if (cn == '0') {
                            //默认
                            $scope.nameValue = '';
                            $scope.nameKey = '';
                            if (val == '0') {
                                $scope.userStatus = '0,1,2,3,4';
                            } else {
                                $scope.userStatus = (val - 1).toString();
                            }
                            var data = {
                                "modeName": $scope.modeName,
                                "msgName": $scope.msgName,
                                "msgContent": $scope.msgContent,
                                "id": $scope.id,
                                "editFlag": $scope.editFlag,
                                "modelType": $scope.modelType,
                                "toAddress": $scope.toAddress,
                                "nameValue": $scope.nameValue,
                                "nameKey": $scope.nameKey,
                                "userStatus": $scope.userStatus,
                                "emailType": $scope.emailType
                            };
                            sendMail(data);
                        } else {
                            if (nameValue == '' || nameValue == undefined || nameValue == null) {
                                layer.msg('客户名称不能为空');
                            } else {
                                if (cn == '1') {
                                    $scope.nameValue = nameValue;
                                    $scope.nameKey = 'in';
                                } else if (cn == '2') {
                                    $scope.nameValue = nameValue;
                                    $scope.nameKey = 'out';
                                }
                                if (val == '0') {
                                    $scope.userStatus = '0,1,2,3,4';
                                } else {
                                    $scope.userStatus = (val - 1).toString();
                                }
                                var data = {
                                    "modeName": $scope.modeName,
                                    "msgName": $scope.msgName,
                                    "msgContent": $scope.msgContent,
                                    "id": $scope.id,
                                    "editFlag": $scope.editFlag,
                                    "modelType": $scope.modelType,
                                    "toAddress": $scope.toAddress,
                                    "nameValue": $scope.nameValue,
                                    "nameKey": $scope.nameKey,
                                    "userStatus": $scope.userStatus,
                                    "emailType": $scope.emailType
                                };
                                sendMail(data);

                            }
                        }


                    }
                }
            }
        }
        //fatema,archelle,mirakuru,xflynz
        function sendMail(data) {
            console.log(data);
            var status;
            var includeCustomerNames = '';
            var notIncludeCustomerNames = '';
            if ($scope.userStatus) {
                status = $scope.userStatus;
            } else {
                status = '';
            }
            if (data.nameKey == '') {
                includeCustomerNames = '';
                notIncludeCustomerNames = '';
            } else if (data.nameKey == 'in') {
                includeCustomerNames = data.nameValue;
                notIncludeCustomerNames = '';
            } else if (data.nameKey == 'out') {
                includeCustomerNames = '';
                notIncludeCustomerNames = data.nameValue;
            }
            data.templateName = data.modeName;
            data.emailTitle = data.msgName;
            data.pageSourceCode = data.msgContent;
            data.customerStatus = status;
            data.includeCustomerNames = includeCustomerNames;
            data.notIncludeCustomerNames = notIncludeCustomerNames;
            data.designatedCustomerEmail = data.toAddress;
            layer.confirm('邮件每天限发送10000封，确认要发送吗？', {
                btn: ['确定', '取消']//按钮
            }, function (index) {
                layer.close(index);
                erp.load();
                erp.postFun('app/modelEmail/sendCustomModelMail', JSON.stringify(data), function (data) {
                    erp.closeLoad();
                    console.log(data);
                    if (data.data.code == '200') {
                        layer.msg('发送成功');
                        $('.zzc1').hide();
                        editor.txt.clear();
                        getHistoryList();
                        //erp.postFun('app/modelEmail/addEmailHistoricalRecords',JSON.stringify(addData),function(data){
                        //    console.log(data);
                        //    getHistoryList();
                        //},function(){
                        //
                        //})
                    } else {
                        layer.alert(data.data.message);
                    }
                }, function (n) {
                    erp.closeLoad();
                    console.log(n);
                });
            });
        }

        var cursorPosition = {
            get: function (textarea) {
                var rangeData = { text: "", start: 0, end: 0 };

                if (textarea.setSelectionRange) { // W3C
                    textarea.focus();
                    rangeData.start = textarea.selectionStart;
                    rangeData.end = textarea.selectionEnd;
                    rangeData.text = (rangeData.start != rangeData.end) ? textarea.value.substring(rangeData.start, rangeData.end) : "";
                } else if (document.selection) { // IE
                    textarea.focus();
                    var i,
                        oS = document.selection.createRange(),
                        // Don't: oR = textarea.createTextRange()
                        oR = document.body.createTextRange();
                    oR.moveToElementText(textarea);

                    rangeData.text = oS.text;
                    rangeData.bookmark = oS.getBookmark();

                    // object.moveStart(sUnit [, iCount])
                    // Return Value: Integer that returns the number of units moved.
                    for (i = 0; oR.compareEndPoints('StartToStart', oS) < 0 && oS.moveStart("character", -1) !== 0; i++) {
                        // Why? You can alert(textarea.value.length)
                        if (textarea.value.charAt(i) == '\r') {
                            i++;
                        }
                    }
                    rangeData.start = i;
                    rangeData.end = rangeData.text.length + rangeData.start;
                }

                return rangeData;
            },

            set: function (textarea, rangeData) {
                var oR, start, end;
                if (!rangeData) {
                    alert("You must get cursor position first.")
                }
                textarea.focus();
                if (textarea.setSelectionRange) { // W3C
                    textarea.setSelectionRange(rangeData.start, rangeData.end);
                } else if (textarea.createTextRange) { // IE
                    oR = textarea.createTextRange();

                    // Fixbug : ues moveToBookmark()
                    // In IE, if cursor position at the end of textarea, the set function don't work
                    if (textarea.value.length === rangeData.start) {
                        //alert('hello')
                        oR.collapse(false);
                        oR.select();
                    } else {
                        oR.moveToBookmark(rangeData.bookmark);
                        oR.select();
                    }
                }
            },

            add: function (textarea, rangeData, text) {
                var oValue, nValue, oR, sR, nStart, nEnd, st;
                this.set(textarea, rangeData);

                if (textarea.setSelectionRange) { // W3C
                    oValue = textarea.value;
                    nValue = oValue.substring(0, rangeData.start) + text + oValue.substring(rangeData.end);
                    nStart = nEnd = rangeData.start + text.length;
                    st = textarea.scrollTop;
                    textarea.value = nValue;
                    // Fixbug:
                    // After textarea.values = nValue, scrollTop value to 0
                    if (textarea.scrollTop != st) {
                        textarea.scrollTop = st;
                    }
                    textarea.setSelectionRange(nStart, nEnd);
                } else if (textarea.createTextRange) { // IE
                    sR = document.selection.createRange();
                    sR.text = text;
                    sR.setEndPoint('StartToEnd', sR);
                    sR.select();
                }
            }
        };
        //参数添加到内容
        $('.canshuGroup').on('click', 'span.canshubtn', function () {
            var target = $(this);
            var text = target.attr('data-en');
            text = "${" + text + "}";
            var tx = $('#mailContent')[0];
            var pos = cursorPosition.get(tx);

            cursorPosition.add(tx, pos, text);
            //var html = $('#mailContent').val();
            //html+=text;
            //$('#mailContent').val(html);
        });
        //富文本
        $('.tool').on('click', 'span', function () {
            var target = $(this);
            var btn = target.html();
            var parent = target.parent();
            var textArea = parent.next('textarea').attr('id');
            var textAreaId = '#' + textArea;
            console.log(textAreaId);
            var text;
            var tx = $(textAreaId)[0];
            var pos = cursorPosition.get(tx);
            if (btn.trim() == '换行') {
                text = '<br>';
                cursorPosition.add(tx, pos, text);
            } else if (btn.trim() == '空格') {
                text = '&nbsp;';
                cursorPosition.add(tx, pos, text);
            } else if (btn.trim() == '加粗') {
                var content = $(textAreaId).val();
                var n = getSelectText(textArea);
                console.log(n);
                console.log(content);
                var newtext = '<b>' + n + '</b>';
                console.log(newtext);
                var str = content.replace(n, newtext);
                $(textAreaId).val(str);
            }

        });

        function getSelectText(id) {
            var t = document.getElementById(id);
            if (window.getSelection) {
                if (t.selectionStart != undefined && t.selectionEnd != undefined) {
                    return t.value.substring(t.selectionStart, t.selectionEnd);
                } else {
                    return "";
                }
            } else {
                return document.selection.createRange().text;
            }
        }
    }]);

    //发件箱
    app.controller('mailOutboxgCtrl', ['$scope', 'erp', '$routeParams', '$location', '$http', function ($scope, erp, $routeParams, $location, $http) {
        //富文本编辑器
          console.log('mailOutboxgCtrl');
       
          var that = this;
		  $scope.isSendMail=false;
          
  
          $scope.pageSize = '20';
          $scope.pageNum = '1';
          $scope.searchInfo = '';
          $scope.startDate = '';
          $scope.endDate = '';
  
  
          getHistoryList();
        //   getModelList();
          
          function getPageList() {
            $scope.pageSize = $scope.pageSize.toString();
            $scope.pageNum = $scope.pageNum.toString();
            var data = {
                "startDate": $scope.startDate,
                "endDate": $scope.endDate,
                "templateName": $scope.searchInfo,
                "pageSize": $scope.pageSize,
                "pageNum": $scope.pageNum,
                "state": ''
            };
            erp.load();
            erp.postFun('app/modelEmail/getPageTemplate', JSON.stringify(data), function (data) {
                erp.closeLoad();
                console.log(data);
                if (data.data.code == '200') {
                    var result = data.data;
                    $scope.totalCounts = result.count;
                    $scope.pageList = result.list;
                    if ($scope.pageList.length == 0) {
                        layer.msg('暂无数据')
                    }
                    pageFun();
                } else {
                    layer.msg('查询失败');
                }
            }, function () {
                erp.closeLoad();
                layer.msg('Network error, please try again later');
            });
        }

  
          function getModelList() {
              var data = {
                  "startDate": '',
                  "endDate": '',
                  "templateName": '',
                  "pageSize": '9999',
                  "pageNum": '1',
                  "state": '0'
              };
              //erp.load();
              erp.postFun('app/modelEmail/getPageTemplate', JSON.stringify(data), function (data) {
                  //console.log(data);
                  if (data.data.code == '200') {
                      $scope.modelList = data.data.list;
                  }
              }, function () {
                  layer.msg('Network error, please try again later');
              });
          }
  
          //获取历史记录
          function getHistoryList() {
              $scope.pageSize = $scope.pageSize.toString();
              $scope.pageNum = $scope.pageNum.toString();
              var data = {
                  "pageNum": $scope.pageNum,
                  "pageSize": $scope.pageSize,
                  "subject": $scope.searchSubject,
                  "emailType": $scope.searchType,
                  "startDate": $scope.startDate,
                  "endDate": $scope.endDate,
                  "searchKey":$scope.youxiang
              };
              erp.load();
              erp.postFun('app/modelEmail/getSendEmailLog', JSON.stringify(data), function (data) {
                  erp.closeLoad();
                  console.log(data);
                  if (data.data.code == '200') {
                      var result = data.data;
                      $scope.totalCounts = result.count;
                      $scope.historyList = result.list;
                      pageFun();
                      if (data.data.list.length == 0) {
                          layer.msg('暂无数据');
                      }
                  } else {
                      layer.msg('查询失败');
                  }
              }, function () {
                  erp.closeLoad();
                  layer.msg('Network error, please try again later');
              });
          };
  
          function pageFun() {
              $(".pagegroup").jqPaginator({
                  totalCounts: $scope.totalCounts || 1,
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
                      $scope.pageNum = n;
                      getHistoryList();
                  }
              });
          }

          $scope.selectSearchType = function (type) {
              $scope.searchType = type
          }
          
          $scope.openEmail = function (email) {
              console.log(email)
              $scope.isSendMail = true;
			  that.no = {
				 email
              }
              console.log(that.no)
          }
          
          $scope.$on('log-to-father',function (d,flag) {
            // {closeFlag: false}
            console.log('收到 =>',flag)
			 if (d && flag) {
				$scope.isSendMail = flag.closeFlag;
			 }
		  })
  
          $scope.searchFun = function () {
              var startDate = $('#c-data-time').val();
              var endDate = $('#cdatatime2').val();
              $scope.startDate = startDate;
              $scope.endDate = endDate;
              $scope.pageNum = '1';
              getHistoryList();
          };
          $('#searchInput').keypress(function (e) {
              if (e.keyCode == 13) {
                  $scope.search()
              }
          })
          $scope.search = function () {
              console.log($scope.searchInfo);
              //$scope.title=$scope.searchInfo;
              getHistoryList();
  
          };
          //更换每页多少条数据
          $scope.pagesizechange = function (pagesize) {
              //console.log(pagesize)
              // $scope.pagesize=pagesize-0;
              $scope.pageNum = '1';
              getHistoryList();
          };
          //手动输入页码GO跳转
          $scope.pagenumchange = function () {
              var pagenum = Number($scope.pageNum);
              var totalpage = Math.ceil($scope.totalCounts / $scope.pageSize);
              if (pagenum > totalpage) {
                  layer.msg('错误页码');
                  $scope.pageNum = '1';
              } else {
                getHistoryList();
              }
          };
  
          $scope.classGetType = function (item) {
              var state = item.customerStatus;
              if (state == '') {
                  return '指定客户';
              } else if (state == '0,1,2,3,4') {
                  return '全部客户';
              } else if (state == '0') {
                  return '未通过客户';
              } else if (state == '1') {
                  return '正常客户';
              } else if (state == '2') {
                  return '黑名单客户';
              } else if (state == '3') {
                  return '待审核客户';
              } else if (state == '4') {
                  return '游客';
              }
          };
          //打开发送邮件弹窗
          $scope.opensend = function () {
              $('.zzc1').show();
              $(' input[type="radio"]').prop('checked', false);
              $('.radioTop .radioWrap:nth-child(1) input[type="radio"]').prop('checked', true);
              $('.khmc02 .radioWrap:nth-child(1) input[type="radio"]').prop('checked', true);
              $('.khmc03 .radioWrap:nth-child(1) input[type="radio"]').prop('checked', true);
              $('.khmc01').hide().val('');
              $('.khmc02').show();
              $('.btn01').addClass('act');
              $('.btn02').removeClass('act');
              $('.yjmb01').addClass('act');
              $('.yjmb02').removeClass('act');
              $('#modelNameSelect').val('');
              $('#mailContent').val('');
              $('#mailTitle').val('');
              $('#customerAdress').val('');
              $('#customerUserName').val('').hide();//customerUserName
              $('#YoukeName').val('').hide();//customerUserName
              // $('#wang').find('.w-e-text-container').css('height','220px');
          };
  
          //选择邮件模板
          $('#modelNameSelect').change(function () {
              var opt = $(this).find('option:selected');
              var mailTitle = opt.attr('data-title');
              $('#mailTitle').val(mailTitle);
          });
          //打开预览
          $scope.yulan = function (code) {
              //console.log(code);
              var opt = $('#modelNameSelect option:selected');
              //console.log(opt.val());
              if (opt.val() == '') {
                  layer.msg('请选择模板');
              } else {
                  var editcode = opt.attr('data-edit');
                  //console.log(editcode);
                  var code = opt.attr('data-code');
                  var html = '';
                  var num = '';
                  if (editcode == '' || editcode == null || editcode == undefined) {
                      html = code;
                      num = 'old';
                  } else {
                      html = editcode;
                      num = 'new';
                  }
                  console.log(num);
                  $('.zzc2').show().find('.previewWrap>h2').html('预览');
                  var target = $('.preview');
                  target.html(html);
                  target.find('.bannerBtn').css('display', 'none');
                  target.find('.textBtn').css('display', 'none');
                  target.find('.categoryBtn').css('display', 'none');
                  //target.find('#categoryBtn2').css('display','inline-block');
                  target.find('.productBtn').css('display', 'none');
                  $('.saveBtn').hide();
                  $('.zzc3').hide();
  
              }
          };
          //打开编辑
          $scope.openEidt = function () {
              var opt = $('#modelNameSelect option:selected');
              //console.log(opt.val());
              if (opt.val() == '') {
                  layer.msg('请选择模板');
              } else {
                  var editcode = opt.attr('data-edit');
                  //console.log(editcode);
                  var code = opt.attr('data-code');
                  var html = '';
                  var num = '';
                  if (editcode == '' || editcode == null || editcode == undefined) {
                      html = code;
                      num = 'old';
                  } else {
                      html = editcode;
                      num = 'new';
                  }
                  console.log(num);
                  //console.log(code);
                  $('.zzc2').show().find('.previewWrap>h2').html('编辑');
                  var target = $('.preview');
                  target.html(html);
                  target.find('.bannerBtn').css('display', 'block');
                  target.find('.textBtn').css('display', 'block');
                  target.find('.categoryBtn').css('display', 'inline-block');
                  //target.find('#categoryBtn2').css('display','inline-block');
                  target.find('.productBtn').css('display', 'block');
                  $('.saveBtn').show();
                  $('.zzc3').hide();
              }
          };
          $('.preview').on('click', '.mailBtn', function () {
              $('.zzc3').show();
              var btnName = $(this).html();
              //console.log(btnName);
              if (btnName.trim() == "替换链接") {
                  $('.previewWin').css('width', '350px');
                  $('.winWrap').hide();
                  $('#bjlj').show();
                  $('#bjljLink').val('');
              } else if (btnName.trim() == "替换图片") {
                  $('.previewWin').css('width', '350px');
                  $('.winWrap').hide();
                  $('#thtp').show().find('input[type="radio"]').prop('checked', false);
                  $('#thtp').find('.radioWrap:nth-child(1) input[type="radio"]').prop('checked', true);
                  $('#tplj').hide();
                  $('#bdsc').show();
                  $('#piclink2').val('');
                  $('#submitPic').val('');
              } else if (btnName.trim() == "替换文本") {
                  $('.winWrap').hide();
                  $('#bjwa').show();
                  $('.previewWin').css({
                      "width": "490px",
                      "margin": "200px auto"
                  });
                  var test = $(this).parent().prev('p').html();
                  $('#bjwaTextarea').val(test).css('width', '400px');
              } else if (btnName.trim() == "替换类目") {
                  $('.previewWin').css('width', '350px');
                  $('.winWrap').hide();
                  $('#bjlm').show();
                  var id = $(this).parent().prev().attr('id');
                  //console.log(id);
                  $('#bjlmBtn').attr('data-id', id);
                  $('#bjlmText').val('');
              } else if (btnName.trim() == "替换商品") {
                  $('.previewWin').css('width', '350px');
                  $('.winWrap').hide();
                  $('#thsp').show();
                  var id = $(this).parent().parent().attr('id');
                  $('#thspBtn').attr('data-id', id);
                  $('#thspSKU').val('');
              }
          });
  
          //确认编辑文案
          $('#bjwaBtn').click(function () {
              var text = $('#bjwaTextarea').val();
              var target = $('.preview').find('.p-text>p');
              target.html(text);
              $scope.closeWin();
          });
          //确认编辑类目
          $('#bjlmBtn').click(function () {
              var text = $('#bjlmText').val();
              var id = '#' + $(this).attr('data-id');
              var target = $('.preview').find(id);
              target.html(text);
              $scope.closeWin();
          });
          //确认替换连接
          $('#bjljBtn').click(function () {
              var link = $('#bjljLink').val();
              var target = $('.preview').find('.p-banner>a');
              target.attr('href', link);
              $scope.closeWin();
          });
          //上传图片
          $('#submitPic').change(function () {
              var target = $(this);
              var id = $(this).attr('id');
              erp.ossUploadFile($('#submitPic')[0].files, function (data) {
                  console.log(data);
                  if (data.code == 0) {
                      layer.msg('上传失败');
                      return;
                  }
                  if (data.code == 2) {
                      layer.msg('部分图片上传失败');
                  }
                  var result = data.succssLinks;
                  console.log(result);
                  var imgArr = [];
                  for (var j = 0; j < result.length; j++) {
                      var srcList = result[j].split('.');
                      var fileName = srcList[srcList.length - 1].toLowerCase();
                      console.log(fileName);
                      if (fileName == 'png' || fileName == 'jpg' || fileName == 'jpeg' || fileName == 'gif') {
                          imgArr.push(result[j]);
                          $('#submitPic').val('');
                      }
                  }
                  console.log(imgArr);
                  var link = imgArr[0];
                  target.next('p').show().attr('data-link', link);
                  //$scope.$apply();
              });
  
          });
          //确认替换图片
          $('#thtpBtn').click(function () {
              var val = $('#thtp input[type="radio"]:checked').val();
              var target = $('.preview').find('.p-banner>a>img');
              console.log(val);
              if (val == '0') {
                  var link = $('#submitPic').next('p').attr('data-link');
                  target.attr('src', link);
                  $scope.closeWin();
                  $('#submitPic').next('p').hide();
              } else if (val == '1') {
                  var link = $('#piclink2').val();
                  target.attr('src', link);
                  $scope.closeWin();
              }
          });
          //确认替换商品 pojo/product/list
          $('#thspBtn').click(function () {
              var target = $(this);
              var sku = $('#thspSKU').val();
              var data = {
                  "flag": "0",
                  "status": "3",
                  "pageNum": "1",
                  "pageSize": "20",
                  "filter01": "SKU",
                  "filter02": sku,
                  "filter03": "",
                  "filter04": "",
                  "filter05": "",
                  "filter06": "",
                  "filter21": "",
                  "filter22": "",
                  "filter23": "",
                  "filter24": "",
                  "filter11": "",
                  "filter12": "",
                  "autFlag": "01",
                  "chargeId": "",
                  "flag2": ""
              };
              erp.load();
              erp.postFun('pojo/product/list', JSON.stringify(data), function (data) {
                  erp.closeLoad();
                  //CJYDYDYD00110
                  if (data.data.statusCode == '200') {
  
                      var result = JSON.parse(data.data.result);
                      console.log(result);
                      if (result.ps.length == 0) {
                          layer.msg('未找到商品，请检查SKU');
                      } else {
                          layer.msg('查询成功');
                          var sp = result.ps[0];
                          console.log(sp);
                          var aut = sp.authorityStatus;
                          if (aut == '1') {
                              //共有
                              var name = sp.nameEn;
                              var imgUrl = sp.bigImg;
                              var price = sp.sellPrice;
                              var picId = sp.id;
                              var id = '#' + target.attr('data-id');
                              var parent = $('.preview').find(id);
                              var product = parent.find('.product');
                              console.log(product);
                              var imgele = product.find('.product-img>a>img');
                              imgele.attr('src', imgUrl);
                              imgele.attr('title', name);
                              imgele.attr('alt', 'Product Picture');
                              var str = "https://app.cjdropshipping.com/product-detail.html?id=" + picId;
                              imgele.parent().attr('href', str);
                              product.find('.product-name>p').html(name);
                              product.find('.product-bottom .product-price>span').html(price);
                              $scope.closeWin();
                          } else {
                              layer.msg('不能推送私有商品');
                          }
                      }
                  } else {
                      layer.msg('查询失败');
                  }
              }, function () {
                  erp.closeLoad();
                  layer.msg('Network error, please try again later');
              });
          });
          //保存编辑
          $('.saveBtn').click(function () {
              $('.zzc2').hide();
              var target = $('.preview');
              target.find('.bannerBtn').css('display', 'none');
              target.find('.textBtn').css('display', 'none');
              target.find('.categoryBtn').css('display', 'none');
              //target.find('#categoryBtn2').css('display','inline-block');
              target.find('.productBtn').css('display', 'none');
              var code = $('.preview').html();
              var opt = $('#modelNameSelect option:selected');
              opt.attr('data-edit', code);
          });
  
          //客户状态选择判断不同客户名称
          $('.khzt input[type="radio"]').change(function () {
              var val = $(this).val();
              console.log(val);
              if (val == '6') {
                  $('.khmc01').show();
                  $('.khmc02').hide();
                  $('.khmc03').hide();
                  $('.emailCanshu').hide();
              } else if (val == '5') {
                  $('.khmc01').hide();
                  $('.khmc02').hide();
                  $('.khmc03').css('display', 'flex');
                  $('.emailCanshu').hide();
                  var text = $('.selectTypeBtnGroup').find('.act').html();
                  if (text.trim() == '文本邮件') {
                      $('.emailCanshu').show();
                      $('.emailCanshu').find('.canshubtn').hide().eq(3).show();
                  }
              } else {
                  $('.khmc01').hide();
                  $('.khmc02').show();
                  $('.khmc03').hide();
                  var text = $('.selectTypeBtnGroup').find('.act').html();
                  if (text.trim() == '文本邮件') {
                      $('.emailCanshu').show();
                      $('.emailCanshu').find('.canshubtn').show();
                  }
  
              }
          });
  
          $('.khmc02 input[type="radio"]').change(function () {
              var val = $(this).val();
              if (val != '0') {
                  $('#customerUserName').show();
              } else {
                  $('#customerUserName').hide();
              }
          });
          $('.khmc03 input[type="radio"]').change(function () {
              var val = $(this).val();
              if (val != '0') {
                  $('#YoukeName').show();
              } else {
                  $('#YoukeName').hide();
              }
          });
          //选择本地上传 or 图片链接
          $('#thtp input[type="radio"]').change(function () {
              var val = $(this).val();
              if (val == '0') {
                  $('#tplj').hide();
                  $('#bdsc').show();
              } else if (val == '1') {
                  $('#tplj').show();
                  $('#bdsc').hide();
              }
          });
  
  
          //选择不同邮件
          $('.selectTypeBtnGroup').on('click', 'button', function () {
              var target = $(this);
              target.addClass('act').siblings('.act').removeClass('act');
              var index = target.index();
              console.log(index);
              if (index == 0) {
                  $('.yjmb01').addClass('act');
                  $('.yjmb02').removeClass('act');
                  $('.yjmb.email').removeClass('act');
                  $('.emailCanshu').hide();
              } else if (index == 1) {
                  $('.yjmb02').addClass('act');
                  $('.yjmb01').removeClass('act');
                  $('.yjmb.email').addClass('act');
                  var val = $('.khzt input[type="radio"]:checked').val();
                  console.log(val);
                  if (val == '5') {
                      $('.emailCanshu').show();
                      $('.emailCanshu').find('.canshubtn').hide().eq(3).show();
                  } else if (val == '6') {
                      $('.emailCanshu').hide();
                  } else {
                      $('.emailCanshu').show();
                      $('.emailCanshu').find('.canshubtn').show();
                  }
  
              }
          });
          // 邮件预览
          $scope.emailYulan = function () {
            var email = editor.txt.html()
            $('.zzc2').show().find('.previewWrap>h2').html('预览');
              $('.saveBtn').hide();
              //$('.previewWin').hide();
              $('.preview').html(email);
          }
          //打开预览
          $scope.openPreview = function (code) {
              $('.zzc2').show().find('.previewWrap>h2').html('预览');
              $('.saveBtn').hide();
              //$('.previewWin').hide();
              $('.preview').html(code);
          }
          //关闭遮罩层2
          $scope.closeZzc2 = function () {
              $('.zzc2').hide();
          }
          //关闭遮罩层1
          $scope.closezzc1 = function () {
              $('.zzc1').hide();
              $('#modelNameSelect').find('option:selected').attr('data-edit', '');
          }
          //关闭编辑弹窗
          $scope.closeWin = function () {
              $('.zzc3').hide();
          }
          //发送邮件
          $scope.sendFun = function () {
              var checked = $('.khzt input[type="radio"]:checked');
              var val = checked.val();
              //console.log(val);
              var msgName = $('#mailTitle').val();
              var emailType = $('#selectMailType').val().toLowerCase();
              //console.log(emailType);
              $scope.editFlag = 'edit';
              $scope.emailType = emailType;
              if (msgName == null || msgName == '' || msgName == undefined) {
                  layer.msg('邮件标题不能为空');
              }else{
                  $scope.msgName = msgName;
                  var html = $('.selectTypeBtnGroup .act').html();
                  var msgContent = '';
                  var modeName = '';
                  if (html.trim() == '模板邮件') {
                      var opt = $('#modelNameSelect option:selected');
                      modeName = opt.html();
                      var editcode = opt.attr('data-edit');
                      var code = opt.attr('data-code');
                      if (editcode == '' || editcode == null || editcode == undefined) {
                          msgContent = code;
                      } else {
                          msgContent = editcode;
                      }
                      $scope.id = opt.attr('data-id');
                  } else if (html.trim() == '文本邮件') {
                      // msgContent = $('#mailContent').val();
                      msgContent= editor.txt.html();
                      $scope.id = '';
                  }
                  $scope.modeName = modeName;
                  if (msgContent == '' || msgContent == null || msgContent == undefined) {
                      layer.msg('邮件内容不能为空');
                  } else {
                      $scope.msgContent = msgContent;
                      if (val == '6') {
                          //自定义
                          var address = $('#customerAdress').val();
                          var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
                          if (address == '' || address == null || address == undefined) {
                              layer.msg('发送地址不能为空');
                          } else if (!reg.test(address)) {
                            layer.msg('邮箱格式不正确');
                          } else{
                              $scope.modelType = '102';
                              $scope.toAddress = address;
                              $scope.nameKey = '';
                              $scope.nameValue = '';
                              var data = {
                                  "modeName": $scope.modeName,
                                  "msgName": $scope.msgName,
                                  "msgContent": $scope.msgContent,
                                  "id": $scope.id,
                                  "editFlag": $scope.editFlag,
                                  "modelType": $scope.modelType,
                                  "toAddress": $scope.toAddress,
                                  "nameValue": $scope.nameValue,
                                  "nameKey": $scope.nameKey,
                                  "emailType": $scope.emailType
                              };
                              sendMail(data);
                          }
                      } else if (val == '5') {
                          //游客
                          var cn = $('.khmc03 input[type="radio"]:checked').val();
                          var nameValue = $('#YoukeName').val();
                          $scope.modelType = '103';
                          $scope.toAddress = '';
                          if (cn == '0') {
                              $scope.nameValue = '';
                              $scope.nameKey = '';
                              var data = {
                                  "modeName": $scope.modeName,
                                  "msgName": $scope.msgName,
                                  "msgContent": $scope.msgContent,
                                  "id": $scope.id,
                                  "editFlag": $scope.editFlag,
                                  "modelType": $scope.modelType,
                                  "toAddress": $scope.toAddress,
                                  "nameValue": $scope.nameValue,
                                  "nameKey": $scope.nameKey,
                                  "emailType": $scope.emailType
                              };
                              sendMail(data);
                          } else {
                              if (nameValue == '' || nameValue == undefined || nameValue == null) {
                                  layer.msg('游客邮箱不能为空');
                              } else {
                                  if (cn == '1') {
                                      $scope.nameValue = nameValue;
                                      $scope.nameKey = 'in';
                                  } else if (cn == '2') {
                                      $scope.nameValue = nameValue;
                                      $scope.nameKey = 'out';
                                  }
                                  var data = {
                                      "modeName": $scope.modeName,
                                      "msgName": $scope.msgName,
                                      "msgContent": $scope.msgContent,
                                      "id": $scope.id,
                                      "editFlag": $scope.editFlag,
                                      "modelType": $scope.modelType,
                                      "toAddress": $scope.toAddress,
                                      "nameValue": $scope.nameValue,
                                      "nameKey": $scope.nameKey,
                                      "emailType": $scope.emailType
                                      //"userStatus":$scope.userStatus
                                  };
                                  sendMail(data);
                              }
                          }
                      } else {
                          //指定  userStatus
                          var cn = $('.khmc02 input[type="radio"]:checked').val();
                          var nameValue = $('#customerUserName').val();
                          $scope.modelType = '101';
                          $scope.toAddress = '';
                          console.log(cn);
                          if (cn == '0') {
                              //默认
                              $scope.nameValue = '';
                              $scope.nameKey = '';
                              if (val == '0') {
                                  $scope.userStatus = '0,1,2,3,4';
                              } else {
                                  $scope.userStatus = (val - 1).toString();
                              }
                              var data = {
                                  "modeName": $scope.modeName,
                                  "msgName": $scope.msgName,
                                  "msgContent": $scope.msgContent,
                                  "id": $scope.id,
                                  "editFlag": $scope.editFlag,
                                  "modelType": $scope.modelType,
                                  "toAddress": $scope.toAddress,
                                  "nameValue": $scope.nameValue,
                                  "nameKey": $scope.nameKey,
                                  "userStatus": $scope.userStatus,
                                  "emailType": $scope.emailType
                              };
                              sendMail(data);
                          } else {
                              if (nameValue == '' || nameValue == undefined || nameValue == null) {
                                  layer.msg('客户名称不能为空');
                              } else {
                                  if (cn == '1') {
                                      $scope.nameValue = nameValue;
                                      $scope.nameKey = 'in';
                                  } else if (cn == '2') {
                                      $scope.nameValue = nameValue;
                                      $scope.nameKey = 'out';
                                  }
                                  if (val == '0') {
                                      $scope.userStatus = '0,1,2,3,4';
                                  } else {
                                      $scope.userStatus = (val - 1).toString();
                                  }
                                  var data = {
                                      "modeName": $scope.modeName,
                                      "msgName": $scope.msgName,
                                      "msgContent": $scope.msgContent,
                                      "id": $scope.id,
                                      "editFlag": $scope.editFlag,
                                      "modelType": $scope.modelType,
                                      "toAddress": $scope.toAddress,
                                      "nameValue": $scope.nameValue,
                                      "nameKey": $scope.nameKey,
                                      "userStatus": $scope.userStatus,
                                      "emailType": $scope.emailType
                                  };
                                  sendMail(data);
  
                              }
                          }
  
  
                      }
                  }
              }
          }
          //fatema,archelle,mirakuru,xflynz
          function sendMail(data) {
              console.log(data);
              var status;
              var includeCustomerNames = '';
              var notIncludeCustomerNames = '';
              if ($scope.userStatus) {
                  status = $scope.userStatus;
              } else {
                  status = '';
              }
              if (data.nameKey == '') {
                  includeCustomerNames = '';
                  notIncludeCustomerNames = '';
              } else if (data.nameKey == 'in') {
                  includeCustomerNames = data.nameValue;
                  notIncludeCustomerNames = '';
              } else if (data.nameKey == 'out') {
                  includeCustomerNames = '';
                  notIncludeCustomerNames = data.nameValue;
              }
              data.templateName = data.modeName;
              data.emailTitle = data.msgName;
              data.pageSourceCode = data.msgContent;
              data.customerStatus = status;
              data.includeCustomerNames = includeCustomerNames;
              data.notIncludeCustomerNames = notIncludeCustomerNames;
              data.designatedCustomerEmail = data.toAddress;
              layer.confirm('邮件每天限发送10000封，确认要发送吗？', {
                  btn: ['确定', '取消']//按钮
              }, function (index) {
                  layer.close(index);
                  erp.load();
                  erp.postFun('app/modelEmail/sendCustomModelMail', JSON.stringify(data), function (data) {
                      erp.closeLoad();
                      console.log(data);
                      if (data.data.code == '200') {
                          layer.msg('发送成功');
                          $('.zzc1').hide();
                          editor.txt.clear();
                          getHistoryList();
                          //erp.postFun('app/modelEmail/addEmailHistoricalRecords',JSON.stringify(addData),function(data){
                          //    console.log(data);
                          //    getHistoryList();
                          //},function(){
                          //
                          //})
                      } else {
                          layer.alert(data.data.message);
                      }
                  }, function (n) {
                      erp.closeLoad();
                      console.log(n);
                  });
              });
          }
  
          var cursorPosition = {
              get: function (textarea) {
                  var rangeData = { text: "", start: 0, end: 0 };
  
                  if (textarea.setSelectionRange) { // W3C
                      textarea.focus();
                      rangeData.start = textarea.selectionStart;
                      rangeData.end = textarea.selectionEnd;
                      rangeData.text = (rangeData.start != rangeData.end) ? textarea.value.substring(rangeData.start, rangeData.end) : "";
                  } else if (document.selection) { // IE
                      textarea.focus();
                      var i,
                          oS = document.selection.createRange(),
                          // Don't: oR = textarea.createTextRange()
                          oR = document.body.createTextRange();
                      oR.moveToElementText(textarea);
  
                      rangeData.text = oS.text;
                      rangeData.bookmark = oS.getBookmark();
  
                      // object.moveStart(sUnit [, iCount])
                      // Return Value: Integer that returns the number of units moved.
                      for (i = 0; oR.compareEndPoints('StartToStart', oS) < 0 && oS.moveStart("character", -1) !== 0; i++) {
                          // Why? You can alert(textarea.value.length)
                          if (textarea.value.charAt(i) == '\r') {
                              i++;
                          }
                      }
                      rangeData.start = i;
                      rangeData.end = rangeData.text.length + rangeData.start;
                  }
  
                  return rangeData;
              },
  
              set: function (textarea, rangeData) {
                  var oR, start, end;
                  if (!rangeData) {
                      alert("You must get cursor position first.")
                  }
                  textarea.focus();
                  if (textarea.setSelectionRange) { // W3C
                      textarea.setSelectionRange(rangeData.start, rangeData.end);
                  } else if (textarea.createTextRange) { // IE
                      oR = textarea.createTextRange();
  
                      // Fixbug : ues moveToBookmark()
                      // In IE, if cursor position at the end of textarea, the set function don't work
                      if (textarea.value.length === rangeData.start) {
                          //alert('hello')
                          oR.collapse(false);
                          oR.select();
                      } else {
                          oR.moveToBookmark(rangeData.bookmark);
                          oR.select();
                      }
                  }
              },
  
              add: function (textarea, rangeData, text) {
                  var oValue, nValue, oR, sR, nStart, nEnd, st;
                  this.set(textarea, rangeData);
  
                  if (textarea.setSelectionRange) { // W3C
                      oValue = textarea.value;
                      nValue = oValue.substring(0, rangeData.start) + text + oValue.substring(rangeData.end);
                      nStart = nEnd = rangeData.start + text.length;
                      st = textarea.scrollTop;
                      textarea.value = nValue;
                      // Fixbug:
                      // After textarea.values = nValue, scrollTop value to 0
                      if (textarea.scrollTop != st) {
                          textarea.scrollTop = st;
                      }
                      textarea.setSelectionRange(nStart, nEnd);
                  } else if (textarea.createTextRange) { // IE
                      sR = document.selection.createRange();
                      sR.text = text;
                      sR.setEndPoint('StartToEnd', sR);
                      sR.select();
                  }
              }
          };
          //参数添加到内容
          $('.canshuGroup').on('click', 'span.canshubtn', function () {
              var target = $(this);
              var text = target.attr('data-en');
              text = "${" + text + "}";
              var tx = $('#mailContent')[0];
              var pos = cursorPosition.get(tx);
  
              cursorPosition.add(tx, pos, text);
              //var html = $('#mailContent').val();
              //html+=text;
              //$('#mailContent').val(html);
          });
          //富文本
          $('.tool').on('click', 'span', function () {
              var target = $(this);
              var btn = target.html();
              var parent = target.parent();
              var textArea = parent.next('textarea').attr('id');
              var textAreaId = '#' + textArea;
              console.log(textAreaId);
              var text;
              var tx = $(textAreaId)[0];
              var pos = cursorPosition.get(tx);
              if (btn.trim() == '换行') {
                  text = '<br>';
                  cursorPosition.add(tx, pos, text);
              } else if (btn.trim() == '空格') {
                  text = '&nbsp;';
                  cursorPosition.add(tx, pos, text);
              } else if (btn.trim() == '加粗') {
                  var content = $(textAreaId).val();
                  var n = getSelectText(textArea);
                  console.log(n);
                  console.log(content);
                  var newtext = '<b>' + n + '</b>';
                  console.log(newtext);
                  var str = content.replace(n, newtext);
                  $(textAreaId).val(str);
              }
  
          });
  
          function getSelectText(id) {
              var t = document.getElementById(id);
              if (window.getSelection) {
                  if (t.selectionStart != undefined && t.selectionEnd != undefined) {
                      return t.value.substring(t.selectionStart, t.selectionEnd);
                  } else {
                      return "";
                  }
              } else {
                  return document.selection.createRange().text;
              }
          }
    }]);

     //收件箱
     app.controller('mailGetingCtrl', ['$scope', 'erp', '$routeParams', '$location', '$http', '$sce', function ($scope, erp, $routeParams, $location, $http, $sce) {
        //富文本编辑器
        console.log('mailGetingCtrl');
        var E = window.wangEditor;
        var editor = new E('#wang');
        // editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
        // editor.customConfig.showLinkImg = false;
        //editor.customConfig.height = 132;
        editor.customConfig.menus = [
            'head',  // 标题
            'bold',  // 粗体
            'fontSize',  // 字号
            'fontName',  // 字体
            'italic',  // 斜体
            'underline',  // 下划线
            'strikeThrough',  // 删除线
            'foreColor',  // 文字颜色
            'backColor',  // 背景颜色
            'link',  // 插入链接
            'list',  // 列表
            'justify',  // 对齐方式
            'quote',  // 引用
            'image',  // 插入图片
            'table',  // 表格
            'video',  // 插入视频
            'code',  // 插入代码
            'undo',  // 撤销
            'redo'  // 重复
        ]
        editor.create();
        var that = this;
        $scope.isSendMail=false;


        $scope.pageSize = '20';
        $scope.pageNum = '1';
        $scope.searchInfo = '';
        $scope.startDate = '';
        $scope.endDate = '';

        $scope.openEmail = function (email) {
            // console.log(email)
            $scope.isSendMail = true;
            that.no = {
               email
            }
            console.log(that.no)
        }
        
        $scope.$on('log-to-father',function (d,flag) {
          // {closeFlag: false}
          console.log('收到 =>',flag)
           if (d && flag) {
              $scope.isSendMail = flag.closeFlag;
           }
        })

        getNewMail();
        
        // getModelList();
        getHistoryList1();
        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        }

        function getModelList() {
            var data = {
                "startDate": '',
                "endDate": '',
                "templateName": '',
                "pageSize": '9999',
                "pageNum": '1',
                "state": '0'
            };
            //erp.load();
            erp.postFun('app/modelEmail/getPageTemplate', JSON.stringify(data), function (data) {
                //console.log(data);
                if (data.data.code == '200') {
                    $scope.modelList = data.data.list;
                }
            }, function () {
                layer.msg('Network error, please try again later');
            });
        }
        // 接受邮件
        function getNewMail(){
            erp.load();
            var data = {
                emailTitle: "",
                endDate: "",
                pageNum: "1",
                pageSize: "20",
                startDate: "",
            }
            erp.postFun('app/modelEmail/receiveCustomlMail',JSON.stringify(data),function(data){
                erp.closeLoad();
                console.log(data)
                if(data.data.code == '200') {
	
                }
            })
        }

        //获取历史记录
        function getHistoryList1() {
            $scope.pageSize = $scope.pageSize.toString();
            $scope.pageNum = $scope.pageNum.toString();
            var data = {
                "pageNum": $scope.pageNum,
                "pageSize": $scope.pageSize,
                "subject": $scope.searchSubject,
                "fromAddress": $scope.searchAddress,
                "startDate": $scope.startDate,
                "endDate": $scope.endDate
            };
            erp.load();
            erp.postFun('app/modelEmail/getReceiveEmailLog', JSON.stringify(data), function (data) {
                erp.closeLoad();
                console.log(data);
                if (data.data.code == '200') {
                    var result = data.data;
                    $scope.totalCounts = result.count;
                    $scope.historyList = result.list;
                    pageFun();
                    if (data.data.list.length == 0) {
                        layer.msg('暂无数据');
                    }
                } else {
                    layer.msg('查询失败');
                }
            }, function () {
                erp.closeLoad();
                layer.msg('Network error, please try again later');
            });
        };


        //收件箱点击消息记录
        $scope.checkMsgFun = function (index, history) {
            console.log(history.content)
            $scope.history = history.content;
            $(".recordMsg").css("display", "block");
        
        }
        $scope.closRrecordMsgFun = function () {
            $(".recordMsg").css("display", "none");
        
        }
        function pageFun() {
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.totalCounts || 1,
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
                    $scope.pageNum = n;
                    getHistoryList1();
                }
            });
        }

        $scope.searchFun = function () {
            var startDate = $('#c-data-time').val();
            var endDate = $('#cdatatime2').val();
            $scope.startDate = startDate;
            $scope.endDate = endDate;
            $scope.pageNum = '1';
            getHistoryList1();
        };
        $('#searchInput').keypress(function (e) {
            if (e.keyCode == 13) {
                $scope.search()
            }
        })
        $scope.search = function () {
            console.log($scope.searchInfo);
            //$scope.title=$scope.searchInfo;
            $scope.pageNum = '1';
            getHistoryList1();

        };
        //更换每页多少条数据
        $scope.pagesizechange = function (pagesize) {
            //console.log(pagesize)
            // $scope.pagesize=pagesize-0;
            $scope.pageNum = '1';
            getHistoryList1();
        };
        //手动输入页码GO跳转
        $scope.pagenumchange = function () {
            alert($scope.pageNum);
            var pagenum = Number($scope.pageNum);
            var totalpage = Math.ceil($scope.totalCounts / $scope.pageSize);
            if (pagenum > totalpage) {
                layer.msg('错误页码');
                $scope.pageNum = '1';
            } else {
                getHistoryList1();
            }
        };

        $scope.classGetType = function (item) {
            var state = item.customerStatus;
            if (state == '') {
                return '指定客户';
            } else if (state == '0,1,2,3,4') {
                return '全部客户';
            } else if (state == '0') {
                return '未通过客户';
            } else if (state == '1') {
                return '正常客户';
            } else if (state == '2') {
                return '黑名单客户';
            } else if (state == '3') {
                return '待审核客户';
            } else if (state == '4') {
                return '游客';
            }
        };
        //打开发送邮件弹窗
        $scope.opensend = function (item) {
            console.log(item)
            
            $('.zzc1').show();
            $(' input[type="radio"]').prop('checked', false);
            $('.radioTop .radioWrap:nth-child(1) input[type="radio"]').prop('checked', true);
            $('.khmc02 .radioWrap:nth-child(1) input[type="radio"]').prop('checked', true);
            $('.khmc03 .radioWrap:nth-child(1) input[type="radio"]').prop('checked', true);
             $('.otherzt .radioWrap:nth-child(2) input[type="radio"]').prop('checked', true);
            $('.khmc01').show();
            $('.khmc02').hide();
            $('.btn01').addClass('act');
            $('.btn02').removeClass('act');
            $('.yjmb01').addClass('act');
            $('.yjmb02').removeClass('act');
            $('#modelNameSelect').val('');
            $('#mailContent').val('');
            $('#mailTitle').val('');
            $('#customerAdress').val(item);
            $('#customerUserName').val('').hide();//customerUserName
            $('#YoukeName').val('').hide();//customerUserName
            // $('#wang').find('.w-e-text-container').css('height','220px');
        };

        //选择邮件模板
        $('#modelNameSelect').change(function () {
            var opt = $(this).find('option:selected');
            var mailTitle = opt.attr('data-title');
            $('#mailTitle').val(mailTitle);
        });
        //打开预览
        $scope.yulan = function (code) {
            //console.log(code);
            var opt = $('#modelNameSelect option:selected');
            //console.log(opt.val());
            if (opt.val() == '') {
                layer.msg('请选择模板');
            } else {
                var editcode = opt.attr('data-edit');
                //console.log(editcode);
                var code = opt.attr('data-code');
                var html = '';
                var num = '';
                if (editcode == '' || editcode == null || editcode == undefined) {
                    html = code;
                    num = 'old';
                } else {
                    html = editcode;
                    num = 'new';
                }
                console.log(num);
                $('.zzc2').show().find('.previewWrap>h2').html('预览');
                var target = $('.preview');
                target.html(html);
                target.find('.bannerBtn').css('display', 'none');
                target.find('.textBtn').css('display', 'none');
                target.find('.categoryBtn').css('display', 'none');
                //target.find('#categoryBtn2').css('display','inline-block');
                target.find('.productBtn').css('display', 'none');
                $('.saveBtn').hide();
                $('.zzc3').hide();

            }
        };
        //打开编辑
        $scope.openEidt = function () {
            var opt = $('#modelNameSelect option:selected');
            //console.log(opt.val());
            if (opt.val() == '') {
                layer.msg('请选择模板');
            } else {
                var editcode = opt.attr('data-edit');
                //console.log(editcode);
                var code = opt.attr('data-code');
                var html = '';
                var num = '';
                if (editcode == '' || editcode == null || editcode == undefined) {
                    html = code;
                    num = 'old';
                } else {
                    html = editcode;
                    num = 'new';
                }
                console.log(num);
                //console.log(code);
                $('.zzc2').show().find('.previewWrap>h2').html('编辑');
                var target = $('.preview');
                target.html(html);
                target.find('.bannerBtn').css('display', 'block');
                target.find('.textBtn').css('display', 'block');
                target.find('.categoryBtn').css('display', 'inline-block');
                //target.find('#categoryBtn2').css('display','inline-block');
                target.find('.productBtn').css('display', 'block');
                $('.saveBtn').show();
                $('.zzc3').hide();
            }
        };
        $('.preview').on('click', '.mailBtn', function () {
            $('.zzc3').show();
            var btnName = $(this).html();
            //console.log(btnName);
            if (btnName.trim() == "替换链接") {
                $('.previewWin').css('width', '350px');
                $('.winWrap').hide();
                $('#bjlj').show();
                $('#bjljLink').val('');
            } else if (btnName.trim() == "替换图片") {
                $('.previewWin').css('width', '350px');
                $('.winWrap').hide();
                $('#thtp').show().find('input[type="radio"]').prop('checked', false);
                $('#thtp').find('.radioWrap:nth-child(1) input[type="radio"]').prop('checked', true);
                $('#tplj').hide();
                $('#bdsc').show();
                $('#piclink2').val('');
                $('#submitPic').val('');
            } else if (btnName.trim() == "替换文本") {
                $('.winWrap').hide();
                $('#bjwa').show();
                $('.previewWin').css({
                    "width": "490px",
                    "margin": "200px auto"
                });
                var test = $(this).parent().prev('p').html();
                $('#bjwaTextarea').val(test).css('width', '400px');
            } else if (btnName.trim() == "替换类目") {
                $('.previewWin').css('width', '350px');
                $('.winWrap').hide();
                $('#bjlm').show();
                var id = $(this).parent().prev().attr('id');
                //console.log(id);
                $('#bjlmBtn').attr('data-id', id);
                $('#bjlmText').val('');
            } else if (btnName.trim() == "替换商品") {
                $('.previewWin').css('width', '350px');
                $('.winWrap').hide();
                $('#thsp').show();
                var id = $(this).parent().parent().attr('id');
                $('#thspBtn').attr('data-id', id);
                $('#thspSKU').val('');
            }
        });

        //确认编辑文案
        $('#bjwaBtn').click(function () {
            var text = $('#bjwaTextarea').val();
            var target = $('.preview').find('.p-text>p');
            target.html(text);
            $scope.closeWin();
        });
        //确认编辑类目
        $('#bjlmBtn').click(function () {
            var text = $('#bjlmText').val();
            var id = '#' + $(this).attr('data-id');
            var target = $('.preview').find(id);
            target.html(text);
            $scope.closeWin();
        });
        //确认替换连接
        $('#bjljBtn').click(function () {
            var link = $('#bjljLink').val();
            var target = $('.preview').find('.p-banner>a');
            target.attr('href', link);
            $scope.closeWin();
        });
        //上传图片
        $('#submitPic').change(function () {
            var target = $(this);
            var id = $(this).attr('id');
            erp.ossUploadFile($('#submitPic')[0].files, function (data) {
                console.log(data);
                if (data.code == 0) {
                    layer.msg('上传失败');
                    return;
                }
                if (data.code == 2) {
                    layer.msg('部分图片上传失败');
                }
                var result = data.succssLinks;
                console.log(result);
                var imgArr = [];
                for (var j = 0; j < result.length; j++) {
                    var srcList = result[j].split('.');
                    var fileName = srcList[srcList.length - 1].toLowerCase();
                    console.log(fileName);
                    if (fileName == 'png' || fileName == 'jpg' || fileName == 'jpeg' || fileName == 'gif') {
                        imgArr.push(result[j]);
                        $('#submitPic').val('');
                    }
                }
                console.log(imgArr);
                var link = imgArr[0];
                target.next('p').show().attr('data-link', link);
                //$scope.$apply();
            });

        });
        //确认替换图片
        $('#thtpBtn').click(function () {
            var val = $('#thtp input[type="radio"]:checked').val();
            var target = $('.preview').find('.p-banner>a>img');
            console.log(val);
            if (val == '0') {
                var link = $('#submitPic').next('p').attr('data-link');
                target.attr('src', link);
                $scope.closeWin();
                $('#submitPic').next('p').hide();
            } else if (val == '1') {
                var link = $('#piclink2').val();
                target.attr('src', link);
                $scope.closeWin();
            }
        });
        //确认替换商品 pojo/product/list
        $('#thspBtn').click(function () {
            var target = $(this);
            var sku = $('#thspSKU').val();
            var data = {
                "flag": "0",
                "status": "3",
                "pageNum": "1",
                "pageSize": "20",
                "filter01": "SKU",
                "filter02": sku,
                "filter03": "",
                "filter04": "",
                "filter05": "",
                "filter06": "",
                "filter21": "",
                "filter22": "",
                "filter23": "",
                "filter24": "",
                "filter11": "",
                "filter12": "",
                "autFlag": "01",
                "chargeId": "",
                "flag2": ""
            };
            erp.load();
            erp.postFun('pojo/product/list', JSON.stringify(data), function (data) {
                erp.closeLoad();
                //CJYDYDYD00110
                if (data.data.statusCode == '200') {

                    var result = JSON.parse(data.data.result);
                    console.log(result);
                    if (result.ps.length == 0) {
                        layer.msg('未找到商品，请检查SKU');
                    } else {
                        layer.msg('查询成功');
                        var sp = result.ps[0];
                        console.log(sp);
                        var aut = sp.authorityStatus;
                        if (aut == '1') {
                            //共有
                            var name = sp.nameEn;
                            var imgUrl = sp.bigImg;
                            var price = sp.sellPrice;
                            var picId = sp.id;
                            var id = '#' + target.attr('data-id');
                            var parent = $('.preview').find(id);
                            var product = parent.find('.product');
                            console.log(product);
                            var imgele = product.find('.product-img>a>img');
                            imgele.attr('src', imgUrl);
                            imgele.attr('title', name);
                            imgele.attr('alt', 'Product Picture');
                            var str = "https://app.cjdropshipping.com/product-detail.html?id=" + picId;
                            imgele.parent().attr('href', str);
                            product.find('.product-name>p').html(name);
                            product.find('.product-bottom .product-price>span').html(price);
                            $scope.closeWin();
                        } else {
                            layer.msg('不能推送私有商品');
                        }
                    }
                } else {
                    layer.msg('查询失败');
                }
            }, function () {
                erp.closeLoad();
                layer.msg('Network error, please try again later');
            });
        });
        //保存编辑
        $('.saveBtn').click(function () {
            $('.zzc2').hide();
            var target = $('.preview');
            target.find('.bannerBtn').css('display', 'none');
            target.find('.textBtn').css('display', 'none');
            target.find('.categoryBtn').css('display', 'none');
            //target.find('#categoryBtn2').css('display','inline-block');
            target.find('.productBtn').css('display', 'none');
            var code = $('.preview').html();
            var opt = $('#modelNameSelect option:selected');
            opt.attr('data-edit', code);
        });

        //客户状态选择判断不同客户名称
        $('.khzt input[type="radio"]').change(function () {
            var val = $(this).val();
            console.log(val);
            if (val == '6') {
                $('.khmc01').show();
                $('.khmc02').hide();
                $('.khmc03').hide();
                $('.emailCanshu').hide();
            } else if (val == '5') {
                $('.khmc01').hide();
                $('.khmc02').hide();
                $('.khmc03').css('display', 'flex');
                $('.emailCanshu').hide();
                var text = $('.selectTypeBtnGroup').find('.act').html();
                if (text.trim() == '文本邮件') {
                    $('.emailCanshu').show();
                    $('.emailCanshu').find('.canshubtn').hide().eq(3).show();
                }
            } else {
                $('.khmc01').hide();
                $('.khmc02').show();
                $('.khmc03').hide();
                var text = $('.selectTypeBtnGroup').find('.act').html();
                if (text.trim() == '文本邮件') {
                    $('.emailCanshu').show();
                    $('.emailCanshu').find('.canshubtn').show();
                }

            }
        });

        $('.khmc02 input[type="radio"]').change(function () {
            var val = $(this).val();
            if (val != '0') {
                $('#customerUserName').show();
            } else {
                $('#customerUserName').hide();
            }
        });
        $('.khmc03 input[type="radio"]').change(function () {
            var val = $(this).val();
            if (val != '0') {
                $('#YoukeName').show();
            } else {
                $('#YoukeName').hide();
            }
        });
        //选择本地上传 or 图片链接
        $('#thtp input[type="radio"]').change(function () {
            var val = $(this).val();
            if (val == '0') {
                $('#tplj').hide();
                $('#bdsc').show();
            } else if (val == '1') {
                $('#tplj').show();
                $('#bdsc').hide();
            }
        });


        //选择不同邮件
        $('.selectTypeBtnGroup').on('click', 'button', function () {
            var target = $(this);
            target.addClass('act').siblings('.act').removeClass('act');
            var index = target.index();
            console.log(index);
            if (index == 0) {
                $('.yjmb01').addClass('act');
                $('.yjmb02').removeClass('act');
                $('.yjmb.email').removeClass('act');
                $('.emailCanshu').hide();
            } else if (index == 1) {
                $('.yjmb02').addClass('act');
                $('.yjmb01').removeClass('act');
                $('.yjmb.email').addClass('act');
                var val = $('.khzt input[type="radio"]:checked').val();
                console.log(val);
                if (val == '5') {
                    $('.emailCanshu').show();
                    $('.emailCanshu').find('.canshubtn').hide().eq(3).show();
                } else if (val == '6') {
                    $('.emailCanshu').hide();
                } else {
                    $('.emailCanshu').show();
                    $('.emailCanshu').find('.canshubtn').show();
                }

            }
        });
        // 邮件预览
        $scope.emailYulan = function () {
            var email = editor.txt.html()
            $('.zzc2').show().find('.previewWrap>h2').html('预览');
            $('.saveBtn').hide();
            //$('.previewWin').hide();
            $('.preview').html(email);
        }
        //打开预览
        $scope.openPreview = function (code) {
            $('.zzc2').show().find('.previewWrap>h2').html('预览');
            $('.saveBtn').hide();
            //$('.previewWin').hide();
            $('.preview').html(code);
        }
        //关闭遮罩层2
        $scope.closeZzc2 = function () {
            $('.zzc2').hide();
        }
        //关闭遮罩层1
        $scope.closezzc1 = function () {
            $('.zzc1').hide();
            $('#modelNameSelect').find('option:selected').attr('data-edit', '');
        }
        //关闭编辑弹窗
        $scope.closeWin = function () {
            $('.zzc3').hide();
        }
        //发送邮件
        $scope.sendFun = function () {
            var checked = $('.khzt input[type="radio"]:checked');
            var val = checked.val();
            //console.log(val);
            var msgName = $('#mailTitle').val();
            var emailType = $('#selectMailType').val().toLowerCase();
            //console.log(emailType);
            $scope.editFlag = 'edit';
            $scope.emailType = emailType;
            if (msgName == null || msgName == '' || msgName == undefined) {
                layer.msg('邮件标题不能为空');
            } else {
                $scope.msgName = msgName;
                var html = $('.selectTypeBtnGroup .act').html();
                var msgContent = '';
                var modeName = '';
                if (html.trim() == '模板邮件') {
                    var opt = $('#modelNameSelect option:selected');
                    modeName = opt.html();
                    var editcode = opt.attr('data-edit');
                    var code = opt.attr('data-code');
                    if (editcode == '' || editcode == null || editcode == undefined) {
                        msgContent = code;
                    } else {
                        msgContent = editcode;
                    }
                    $scope.id = opt.attr('data-id');
                } else if (html.trim() == '文本邮件') {
                    // msgContent = $('#mailContent').val();
                    msgContent = editor.txt.html();
                    $scope.id = '';
                }
                $scope.modeName = modeName;
                if (msgContent == '' || msgContent == null || msgContent == undefined) {
                    layer.msg('邮件内容不能为空');
                } else {
                    $scope.msgContent = msgContent;
                    if (val == '6') {
                        //自定义
                        var address = $('#customerAdress').val();
                        var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
                        if (address == '' || address == null || address == undefined) {
                            layer.msg('发送地址不能为空');
                        } else if (!reg.test(address)) {
                            layer.msg('邮箱格式不正确');
                        } else {
                            $scope.modelType = '102';
                            $scope.toAddress = address;
                            $scope.nameKey = '';
                            $scope.nameValue = '';
                            var data = {
                                "modeName": $scope.modeName,
                                "msgName": $scope.msgName,
                                "msgContent": $scope.msgContent,
                                "id": $scope.id,
                                "editFlag": $scope.editFlag,
                                "modelType": $scope.modelType,
                                "toAddress": $scope.toAddress,
                                "nameValue": $scope.nameValue,
                                "nameKey": $scope.nameKey,
                                "emailType": $scope.emailType
                            };
                            sendMail(data);
                        }
                    } else if (val == '5') {
                        //游客
                        var cn = $('.khmc03 input[type="radio"]:checked').val();
                        var nameValue = $('#YoukeName').val();
                        $scope.modelType = '103';
                        $scope.toAddress = '';
                        if (cn == '0') {
                            $scope.nameValue = '';
                            $scope.nameKey = '';
                            var data = {
                                "modeName": $scope.modeName,
                                "msgName": $scope.msgName,
                                "msgContent": $scope.msgContent,
                                "id": $scope.id,
                                "editFlag": $scope.editFlag,
                                "modelType": $scope.modelType,
                                "toAddress": $scope.toAddress,
                                "nameValue": $scope.nameValue,
                                "nameKey": $scope.nameKey,
                                "emailType": $scope.emailType
                            };
                            sendMail(data);
                        } else {
                            if (nameValue == '' || nameValue == undefined || nameValue == null) {
                                layer.msg('游客邮箱不能为空');
                            } else {
                                if (cn == '1') {
                                    $scope.nameValue = nameValue;
                                    $scope.nameKey = 'in';
                                } else if (cn == '2') {
                                    $scope.nameValue = nameValue;
                                    $scope.nameKey = 'out';
                                }
                                var data = {
                                    "modeName": $scope.modeName,
                                    "msgName": $scope.msgName,
                                    "msgContent": $scope.msgContent,
                                    "id": $scope.id,
                                    "editFlag": $scope.editFlag,
                                    "modelType": $scope.modelType,
                                    "toAddress": $scope.toAddress,
                                    "nameValue": $scope.nameValue,
                                    "nameKey": $scope.nameKey,
                                    "emailType": $scope.emailType
                                    //"userStatus":$scope.userStatus
                                };
                                sendMail(data);
                            }
                        }
                    } else {
                        //指定  userStatus
                        var cn = $('.khmc02 input[type="radio"]:checked').val();
                        var nameValue = $('#customerUserName').val();
                        $scope.modelType = '101';
                        $scope.toAddress = '';
                        console.log(cn);
                        if (cn == '0') {
                            //默认
                            $scope.nameValue = '';
                            $scope.nameKey = '';
                            if (val == '0') {
                                $scope.userStatus = '0,1,2,3,4';
                            } else {
                                $scope.userStatus = (val - 1).toString();
                            }
                            var data = {
                                "modeName": $scope.modeName,
                                "msgName": $scope.msgName,
                                "msgContent": $scope.msgContent,
                                "id": $scope.id,
                                "editFlag": $scope.editFlag,
                                "modelType": $scope.modelType,
                                "toAddress": $scope.toAddress,
                                "nameValue": $scope.nameValue,
                                "nameKey": $scope.nameKey,
                                "userStatus": $scope.userStatus,
                                "emailType": $scope.emailType
                            };
                            sendMail(data);
                        } else {
                            if (nameValue == '' || nameValue == undefined || nameValue == null) {
                                layer.msg('客户名称不能为空');
                            } else {
                                if (cn == '1') {
                                    $scope.nameValue = nameValue;
                                    $scope.nameKey = 'in';
                                } else if (cn == '2') {
                                    $scope.nameValue = nameValue;
                                    $scope.nameKey = 'out';
                                }
                                if (val == '0') {
                                    $scope.userStatus = '0,1,2,3,4';
                                } else {
                                    $scope.userStatus = (val - 1).toString();
                                }
                                var data = {
                                    "modeName": $scope.modeName,
                                    "msgName": $scope.msgName,
                                    "msgContent": $scope.msgContent,
                                    "id": $scope.id,
                                    "editFlag": $scope.editFlag,
                                    "modelType": $scope.modelType,
                                    "toAddress": $scope.toAddress,
                                    "nameValue": $scope.nameValue,
                                    "nameKey": $scope.nameKey,
                                    "userStatus": $scope.userStatus,
                                    "emailType": $scope.emailType
                                };
                                sendMail(data);

                            }
                        }


                    }
                }
            }
        }
        //fatema,archelle,mirakuru,xflynz
        function sendMail(data) {
            console.log(data);
            var status;
            var includeCustomerNames = '';
            var notIncludeCustomerNames = '';
            if ($scope.userStatus) {
                status = $scope.userStatus;
            } else {
                status = '';
            }
            if (data.nameKey == '') {
                includeCustomerNames = '';
                notIncludeCustomerNames = '';
            } else if (data.nameKey == 'in') {
                includeCustomerNames = data.nameValue;
                notIncludeCustomerNames = '';
            } else if (data.nameKey == 'out') {
                includeCustomerNames = '';
                notIncludeCustomerNames = data.nameValue;
            }
            data.templateName = data.modeName;
            data.emailTitle = data.msgName;
            data.pageSourceCode = data.msgContent;
            data.customerStatus = status;
            data.includeCustomerNames = includeCustomerNames;
            data.notIncludeCustomerNames = notIncludeCustomerNames;
            data.designatedCustomerEmail = data.toAddress;
            layer.confirm('邮件每天限发送10000封，确认要发送吗？', {
                btn: ['确定', '取消']//按钮
            }, function (index) {
                layer.close(index);
                erp.load();
                erp.postFun('app/modelEmail/sendCustomModelMail', JSON.stringify(data), function (data) {
                    erp.closeLoad();
                    console.log(data);
                    if (data.data.code == '200') {
                        layer.msg('发送成功');
                        $('.zzc1').hide();
                        editor.txt.clear();
                        getHistoryList1();
                        //erp.postFun('app/modelEmail/addEmailHistoricalRecords',JSON.stringify(addData),function(data){
                        //    console.log(data);
                        //    getHistoryList();
                        //},function(){
                        //
                        //})
                    } else {
                        layer.alert(data.data.message);
                    }
                }, function (n) {
                    erp.closeLoad();
                    console.log(n);
                });
            });
        }

        var cursorPosition = {
            get: function (textarea) {
                var rangeData = { text: "", start: 0, end: 0 };

                if (textarea.setSelectionRange) { // W3C
                    textarea.focus();
                    rangeData.start = textarea.selectionStart;
                    rangeData.end = textarea.selectionEnd;
                    rangeData.text = (rangeData.start != rangeData.end) ? textarea.value.substring(rangeData.start, rangeData.end) : "";
                } else if (document.selection) { // IE
                    textarea.focus();
                    var i,
                        oS = document.selection.createRange(),
                        // Don't: oR = textarea.createTextRange()
                        oR = document.body.createTextRange();
                    oR.moveToElementText(textarea);

                    rangeData.text = oS.text;
                    rangeData.bookmark = oS.getBookmark();

                    // object.moveStart(sUnit [, iCount])
                    // Return Value: Integer that returns the number of units moved.
                    for (i = 0; oR.compareEndPoints('StartToStart', oS) < 0 && oS.moveStart("character", -1) !== 0; i++) {
                        // Why? You can alert(textarea.value.length)
                        if (textarea.value.charAt(i) == '\r') {
                            i++;
                        }
                    }
                    rangeData.start = i;
                    rangeData.end = rangeData.text.length + rangeData.start;
                }

                return rangeData;
            },

            set: function (textarea, rangeData) {
                var oR, start, end;
                if (!rangeData) {
                    alert("You must get cursor position first.")
                }
                textarea.focus();
                if (textarea.setSelectionRange) { // W3C
                    textarea.setSelectionRange(rangeData.start, rangeData.end);
                } else if (textarea.createTextRange) { // IE
                    oR = textarea.createTextRange();

                    // Fixbug : ues moveToBookmark()
                    // In IE, if cursor position at the end of textarea, the set function don't work
                    if (textarea.value.length === rangeData.start) {
                        //alert('hello')
                        oR.collapse(false);
                        oR.select();
                    } else {
                        oR.moveToBookmark(rangeData.bookmark);
                        oR.select();
                    }
                }
            },

            add: function (textarea, rangeData, text) {
                var oValue, nValue, oR, sR, nStart, nEnd, st;
                this.set(textarea, rangeData);

                if (textarea.setSelectionRange) { // W3C
                    oValue = textarea.value;
                    nValue = oValue.substring(0, rangeData.start) + text + oValue.substring(rangeData.end);
                    nStart = nEnd = rangeData.start + text.length;
                    st = textarea.scrollTop;
                    textarea.value = nValue;
                    // Fixbug:
                    // After textarea.values = nValue, scrollTop value to 0
                    if (textarea.scrollTop != st) {
                        textarea.scrollTop = st;
                    }
                    textarea.setSelectionRange(nStart, nEnd);
                } else if (textarea.createTextRange) { // IE
                    sR = document.selection.createRange();
                    sR.text = text;
                    sR.setEndPoint('StartToEnd', sR);
                    sR.select();
                }
            }
        };
        //参数添加到内容
        $('.canshuGroup').on('click', 'span.canshubtn', function () {
            var target = $(this);
            var text = target.attr('data-en');
            text = "${" + text + "}";
            var tx = $('#mailContent')[0];
            var pos = cursorPosition.get(tx);

            cursorPosition.add(tx, pos, text);
            //var html = $('#mailContent').val();
            //html+=text;
            //$('#mailContent').val(html);
        });
        //富文本
        $('.tool').on('click', 'span', function () {
            var target = $(this);
            var btn = target.html();
            var parent = target.parent();
            var textArea = parent.next('textarea').attr('id');
            var textAreaId = '#' + textArea;
            console.log(textAreaId);
            var text;
            var tx = $(textAreaId)[0];
            var pos = cursorPosition.get(tx);
            if (btn.trim() == '换行') {
                text = '<br>';
                cursorPosition.add(tx, pos, text);
            } else if (btn.trim() == '空格') {
                text = '&nbsp;';
                cursorPosition.add(tx, pos, text);
            } else if (btn.trim() == '加粗') {
                var content = $(textAreaId).val();
                var n = getSelectText(textArea);
                console.log(n);
                console.log(content);
                var newtext = '<b>' + n + '</b>';
                console.log(newtext);
                var str = content.replace(n, newtext);
                $(textAreaId).val(str);
            }

        });

        function getSelectText(id) {
            var t = document.getElementById(id);
            if (window.getSelection) {
                if (t.selectionStart != undefined && t.selectionEnd != undefined) {
                    return t.value.substring(t.selectionStart, t.selectionEnd);
                } else {
                    return "";
                }
            } else {
                return document.selection.createRange().text;
            }
        }
    }]);


    //服务客户
    app.controller('CustomerServicectrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        $scope.ParentOrderNum = '';
        $scope.OrderNum = '';
        $scope.OrderNum2 = '';
        $scope.OrderNum3 = '';
        $scope.ParentOrderNum2 = '';
        $scope.ParentOrderNum3 = '';
        $scope.ParentOrderNum4 = '';
        $scope.ParentOrderNum5 = '';
        $scope.ParentOrderNum6 = '';
        $scope.SubClick = function () {
            if (!$scope.ParentOrderNum) {
                layer.msg('请输入客户母订单号！')
            } else if (!$scope.OrderNum) {
                layer.msg('请输入客户订单号！')
            } else {
                var data = {
                    shipId: $scope.ParentOrderNum,
                    ids: $scope.OrderNum,
                    type: '乌拉圭'
                };
                layer.load(2);
                erp.postFun('app/order/cleanOrder', data, function (data) {
                    layer.closeAll('loading');
                    if (data.data.result) {
                        layer.msg('删除成功！')
                        $scope.ParentOrderNum = '';
                        $scope.OrderNum = '';
                    } else {
                        layer.msg('删除失败！')
                    }
                }, function (n) {
                    layer.msg('系统错误！')
                    console.log(n);
                });
            }
        }
        $scope.SubClick2 = function () {
            if (!$scope.ParentOrderNum2) {
                layer.msg('请输入客户母订单号！')
            } else {
                var data = {
                    shipId: $scope.ParentOrderNum2,
                    type: '乌拉圭'
                };
                layer.load(2);
                erp.postFun('erp/order/buChongKuCun', data, function (data) {
                    layer.closeAll('loading');
                    if (data.data.result) {
                        layer.msg('操作成功！')
                        $scope.ParentOrderNum2 = '';
                    } else {
                        layer.msg('操作失败！')
                    }
                }, function (n) {
                    layer.msg('系统错误！')
                    console.log(n);
                });
            }
        }
        $scope.SubClick3 = function () {
            if (!$scope.ParentOrderNum3) {
                layer.msg('请输入客户母订单号！')
            } else {
                var data = {
                    shipId: $scope.ParentOrderNum3,
                    type: '乌拉圭'
                };
                layer.load(2);
                erp.postFun('erp/order/gaibianusps', data, function (data) {
                    layer.closeAll('loading');
                    if (data.data.result) {
                        layer.msg('操作成功！')
                        $scope.ParentOrderNum3 = '';
                    } else {
                        layer.msg('操作失败！')
                    }
                }, function (n) {
                    layer.msg('系统错误！')
                    console.log(n);
                });
            }
        }
        $scope.SubClick4 = function () {
            if (!$scope.ParentOrderNum4 && !$scope.OrderNum2) {
                layer.msg('请输入客户母订单号或客户订单号！')
            } else {
                var data = {
                    shipId: $scope.ParentOrderNum4,
                    ids: $scope.OrderNum2,
                    type: '乌拉圭'
                };
                layer.load(2);
                erp.postFun('erp/order/yidongdaoyifahuo', data, function (data) {
                    layer.closeAll('loading');
                    if (data.data.statusCode == 200) {
                        layer.msg('操作成功！')
                        $scope.ParentOrderNum4 = '';
                        $scope.OrderNum2 = '';
                    } else {
                        layer.msg('操作失败！')
                    }
                }, function (n) {
                    layer.msg('系统错误！')
                    console.log(n);
                });
            }
        }
        $scope.SubClick5 = function () {
            console.log($scope.ParentOrderNum5);
            var data = {
                "ordersId": $scope.ParentOrderNum5
            };
            erp.load();
            erp.postFun('app/order/getBrightpearlOrderState', JSON.stringify(data), function (data) {
                //console.log(data);
                erp.closeLoad();
                if (data.data.response) {
                    layer.msg('查询成功');
                    var result = data.data.response;
                    $scope.ordersList = result;
                    console.log($scope.ordersList);
                    $('.zzc1').show();
                } else {
                    layer.msg('查询失败');
                }
            }, function () {
                erp.closeLoad();
            })
        }
        $scope.SubClick6 = function () {
            var date = new Date();
            var min = date.getMinutes();
            if (min >= 15 && min <= 45) {
                var start = $('#c-data-time').val();
                var end = $('#cdatatime2').val();
                if (start == '' || start == null || start == undefined) {
                    layer.msg('起始日期不能为空');
                } else if (end == '' || end == null || end == undefined) {
                    layer.msg('结束日期不能为空');
                } else {
                    console.log(start, end);
                    var data = {
                        "strDate": start,
                        "endDate": end
                    }
                    //erp.load();
                    //erp.postFun('app/order/getBrightpearlShopOrder',JSON.stringify(data),function(data){
                    //    erp.closeLoad();
                    //    if(data.data.code=='200'){
                    //        layer.msg('拉取成功');
                    //    }else{
                    //        layer.msg(data.data.message);
                    //    }
                    //},function(){
                    //    erp.closeLoad();
                    //})
                }
            } else {
                layer.msg('请在15分-45分时候拉取');
            }

        }
        $scope.SubClick7 = function () {
            console.log($scope.OrderNum3);
            var data = {
                "orderNubmer": $scope.OrderNum3,
                "type": "quehuo"
            };
            erp.load();
            erp.postFun('order/order/shortageOfGoodsRequest', JSON.stringify(data), function (data) {
                //console.log(data);
                erp.closeLoad();
                console.log(data);
                if (data.data.code) {
                    layer.msg('请求发送成功!');
                    $scope.OrderNum3 = "";
                } else {
                    layer.msg('请求发送失败');
                }
            }, function () {
                erp.closeLoad();
            })
        }
        $scope.showDetailFun = function (item) {
            //console.log(item);
            var orderRows = item.orderRows;
            $.each(orderRows, function (i, v) {
                v.keyName = i;
            });
            $scope.orderDetail = item;
            console.log($scope.orderDetail);
            $('.zzc2').show();
        }
        $scope.closeZZC1 = function () {
            $('.zzc1').hide();
        }
        $scope.closeZZC2 = function () {
            $('.zzc2').hide();
        }
        $scope.classDate = function (data) {
            if (data == '' || data == null || data == undefined) {
                return '--';
            } else {
                var date = data;
                var arr = date.split('T');
                var day = arr[0];
                var arr2 = arr[1].split('.');
                var hour = arr2[0];
                var text = day + ' ' + hour;
                return text;
            }

        }
        $scope.classCount = function (count) {
            if (count == '' || count == null || count == undefined) {
                return 0;
            } else {
                return parseInt(count);
            }
        }
        $scope.SubClick8=function(){
            $('.zzc3').show();
        }
        $scope.SubClick10=function(){
            erp.load();
	        erp.postFun('order/oldOrder/getBrightpearlPurchaseOrder', null, function (data) {
                erp.closeLoad();
                console.log(data.data.result);
                if (data.data.result === true) {
                    layer.msg('手动拉取成功');
                } else {
                    layer.msg('手动拉取失败');
                }
            }, function () {
                erp.closeLoad();
            });
        }
        $scope.closeZZC3=function(){
            $('.zzc3').hide();
        }
        var orderNumber;
        $scope.SubClick9 = function () {
            console.log($scope.ParentOrderNum6);
            var data = {
                "orderNumber": $scope.ParentOrderNum6
            };
            erp.load();
            erp.postFun('order/order/purchaseRequest', JSON.stringify(data), function (data) {
                //console.log(data);
                erp.closeLoad();
                console.log(data)
                if (data.data.result.list) {
                    $scope.ordersList = data.data.result.list;
                    console.log($scope.ordersList);
                    orderNumber = data.data.result.orderNumber;
                } else {
                    layer.msg('查询失败');
                }
            }, function () {
                erp.closeLoad();
            })
        }

        $scope.sureFun6 = function(){
            console.log($scope.ordersList);
            var data =[];
            for(var i=0;i<$scope.ordersList.length;i++){
                var num =$scope.ordersList[i].num;
                if(num){
	                data.push({ id: $scope.ordersList[i].id, num: num });
                }
            }
            console.log(data);
            var setMap={ids:data,orderNumber:orderNumber}
            console.log(JSON.stringify(setMap));
            erp.load();
            erp.postFun('order/order/goodsInNotePOST', JSON.stringify(setMap), function (data) {
                //console.log(data);
                erp.closeLoad();
                console.log(data)
                if (data.data.statusCode==200) {
                    layer.msg('请求发送成功');
                } else {
                    layer.msg('请求发送失败');
                }
            }, function () {
                erp.closeLoad();
            })
        }
    }])
    


    //考核标准新
    app.controller('assesmentctrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        console.log('assesmentctrl');

        $scope.job = '客服';
        $scope.pageNum = '1';
        $scope.pageSize = '20';
        $scope.startTime = getDay(-2);
        $scope.endTime = getDay(0);
        console.log($scope.startTime, $scope.endTime);

        /**  2019-10-16 */
        //点击勾选 是否固定客服等级
        $scope.empClick = (item, type) => {
            const { id } = item
            const url = `app/message/${type === 'insert' ? 'insertEmpGrade' : 'deleteEmpGradeById'}`
            erp.postFun(url, JSON.stringify({ id }), ({ data }) => {
                const { statusCode } = data
                layer.msg(statusCode === '200' ? '操作成功' : '操作失败')
                if (statusCode === '200') {
                    item.gid = type === 'insert' ? id : null
                }
                console.log(res)
            }, error => {}, { layer: true })
        }

        /******************************************* */

        //获取列表
        getSalesAssessment();
        function getSalesAssessment(){
            var sendData = {
                startTime: $scope.startTime,
                endTime: $scope.endTime,
                job: $scope.job,
                page: $scope.pageNum,
                limit: $scope.pageSize

            }
            erp.load();
            erp.postFun('app/message/getSalesAssessment',JSON.stringify(sendData),function(data){
                erp.closeLoad();
                // console.log(data.data);
                if(data.data.list){
                    $scope.salesList = data.data.list;
                    $scope.totalCount = data.data.total;
                    pageFun();
                }else{
                    layer.msg('查询失败');                }
            },function(){
                erp.closeLoad();
            })
        }
        function pageFun() {
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.totalCount || 1,
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
                    $scope.pageNum = n + '';
                    getSalesAssessment();
                }
            });
        }
        //更换每页多少条数据
        $scope.pagesizechange = function (pagesize) {
            //console.log(pagesize)
            // $scope.pagesize=pagesize-0;
            $scope.pageNum = '1';
            getSalesAssessment();
        };
        //手动输入页码GO跳转
        $scope.pagenumchange = function () {
            var pagenum = Number($scope.pageNum);
            var totalpage = Math.ceil($scope.totalCount / $scope.pageSize);
            if (pagenum > totalpage) {
                layer.msg('错误页码');
                $scope.pageNum = '1';
            } else {
                getSalesAssessment();
            }
        };

        $scope.searchList = function(type){
            if(type == '0'){
                $scope.startTime = getDay(-2);
                $scope.endTime = getDay(0);
            }else if(type == '1'){
                var str = getWeek();
                var arr = str.split('-');
                $scope.startTime = changeDate(arr[0]);
                // $scope.startTime = arr[0];
                $scope.endTime = changeDate(arr[1]);
            }else if(type == '2'){
                var str = getMonth();
                var arr = str.split('-');
                $scope.startTime = changeDate(arr[0]);
                // $scope.startTime = arr[0];
                $scope.endTime = changeDate(arr[1]);
            }
            // console.log($scope.startTime,$scope.endTime);
            $('.searchByDay a').removeClass('act').eq(type).addClass('act');
            $scope.pageNum = '1';
            getSalesAssessment();

        }

        $scope.changeSales = function(type){
            if(type == 0){
                $scope.job = '销售';
            }else if(type == 1){
                $scope.job = '客服';
            }
            $('.tabTop a').removeClass('act').eq(type).addClass('act');
            $scope.pageNum = '1';
            getSalesAssessment();
        }

        $scope.searchFun = function(){
            var start = $('#c-data-time2').val();
            var end = $('#cdatatime3').val();
            if(start == ''){
                layer.msg('请选择开始日期');
            }else{
                if(end == ''){
                    var date = new Date();
                    var year = date.getFullYear();
                    var month = date.getMonth()+1;
                    var day = date.getDay();
                    if(month<10){
                        month = '0'+month;
                    }
                    if(day <10){
                        day = '0'+day;
                    }
                    end = year+'-'+month+'-'+day;
                }
                $('.tabTop a').removeClass('act');
                $scope.startTime = start;
                $scope.endTime = end;
                getSalesAssessment();
                
            }
        }

        $scope.changeGradeFun = function(grade,id){
            var  str = '确定要设置成LV '+grade+'吗？';
            layer.confirm(str, {
                btn : [ '确定', '取消' ]//按钮
            }, function(index) {
                layer.close(index);
                var sendData = {
                    grade: grade,
                    id: id
                }
                erp.load();
                erp.postFun('app/message/updateGradeByStaff',JSON.stringify(sendData),function(data){
                    erp.closeLoad();
                    console.log(data.data);
                    if(data.data.statusCode == 'CODE_200'){
                        layer.msg('设置成功');
                        getSalesAssessment();
                    }else{
                        layer.msg('设置失败');
                    }
                },function(){
                    erp.closeLaod();
                })
	
            });
            
        }

        function changeDate(day){
            // console.log(day);
            var arr = day.split('/');
            console.log(arr);
            return arr[0]+'-'+arr[1]+'-'+arr[2];
        }
        function getDay(day) {
            var today = new Date();
            var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
            today.setTime(targetday_milliseconds); //注意，这行是关键代码
            var tYear = today.getFullYear();
            var tMonth = today.getMonth();
            var tDate = today.getDate();
            tMonth = doHandleMonth(tMonth + 1);
            tDate = doHandleMonth(tDate);
            return tYear + "-" + tMonth + "-" + tDate;
        }
        function doHandleMonth(month) {
            var m = month;
            if (month.toString().length == 1) {
                m = "0" + month;
            }
            return m;
        }

        // console.log(getMonth());
        //获取本月
        function getMonth() {
	
	        // 获取当前月的第一天
            var start = new Date();
            start.setDate(1);
	
	        // 获取当前月的最后一天
            var date = new Date();
            var currentMonth = date.getMonth();
            var nextMonth = ++currentMonth;
            var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
            var oneDay = 1000 * 60 * 60 * 24;
            var end = new Date(nextMonthFirstDay - oneDay);
	
	        var startDate = transferDate(start); // 日期变换
	        var endDate = transferDate(end); // 日期变换

            return startDate + '-' + endDate;
        }
        //获取本周
        function getWeek() {
	        //按周日为一周的最后一天计算
            var date = new Date();
	
	        //今天是这周的第几天
            var today = date.getDay();
	
	        //上周日距离今天的天数（负数表示）
            var stepSunDay = -today + 1;
	
	        // 如果今天是周日
            if (today == 0) {

                stepSunDay = -7;
            }
	
	        // 周一距离今天的天数（负数表示）
            var stepMonday = 7 - today;

            var time = date.getTime();

            var monday = new Date(time + stepSunDay * 24 * 3600 * 1000);
            var sunday = new Date(time + stepMonday * 24 * 3600 * 1000);
	
	        //本周一的日期 （起始日期）
	        var startDate = transferDate(monday); // 日期变换
	        //本周日的日期 （结束日期）
	        var endDate = transferDate(sunday); // 日期变换


            return startDate + '-' + endDate;
        }
        function transferDate(date) {
	
	        // 年
            var year = date.getFullYear();
	        // 月
            var month = date.getMonth() + 1;
	        // 日
            var day = date.getDate();

            if (month >= 1 && month <= 9) {

                month = "0" + month;
            }
            if (day >= 0 && day <= 9) {

                day = "0" + day;
            }

            var dateString = year + '/' + month + '/' + day;

            return dateString;
        }



    }]);

    //分页函数
    function pageFun($dom, totalCounts, pageSize, currentPage, changeFun) {
        $dom.jqPaginator({
            totalCounts: totalCounts * 1,
            pageSize: pageSize * 1,
            visiblePages: 5,
            currentPage: currentPage * 1,
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
                changeFun(n);
            }
        });
    }

    function linktourl(txt) {
        var isimg = /\.(png|jpeg|gif|svg|jpg|JPG|PNG|JPEG|GIF|SVG)(\?.*)?$/
        var isurl = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
        var rex = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-|#|%|:)+)/g;
        if (isimg.test(txt)) {
            txt = txt.replace(rex, "<img width='90' src='$1$2' >").replace(/\n/g, "<br />")
        } else if (isurl.test(txt)) {
            txt = txt.replace(rex, "<a href='$1$2' target='_blank' >$1$2</a>").replace(/\n/g, "<br />")
        }
        return txt;
    };
    function videoList(erp, item) {
      console.log(item.message);
      for (let [i, list] of item.message.entries()) {
        if (list.videoUrl && list.videoUrl.length > 0) {
          for (let [j, videoList] of list.videoUrl.entries()) {
            let id = 'J_prismPlayer' + (i + 1) + '_' + (j + 1);
            let vid = videoList.vid;
            videoPath(erp, {id, vid});
          }
        }
      }
    };
    // 请求视频地址
    function videoPath (erp, {id, vid}) {
      erp.getFun('tool/downLoad/getVideoPlayAuth?videoId='+vid ,function(data){
        videoPlay({id, vid, playAuth: data.data.playAuth});
      },function () {})
    }
    // 创建视频播放
    function videoPlay ({id, vid, playAuth}) {
      let player = new Aliplayer({
        id: id,
        width: '300px',
        height: '160px',
        autoplay: false,
        vid: vid,
        playauth: playAuth,
	      cover: ' ',
        region:'cn-shanghai'
      },function(player){
        console.log('播放器创建好了。')
      });
    }
})(angular)
