;~function(){
    var app = angular.module('erp-service');
    var lang = localStorage.getItem('lang');
    function changeChinese(text) {
        if (lang == 'en') {
            return text;
        } else if (lang == 'cn') {
            if (text == 'No Tracking Information Found'||'NO Tracking Information Found') {
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
    //erp客服---待客户处理
    app.controller('csdisputePendingcCtrl', ['$scope', 'erp', '$timeout', function ($scope, erp, $timeout) {
        console.log('csdisputePendingcCtrl');
        $scope.replyWrapModal = false
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
        $scope.replyText = ""
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
            let _current = $scope.replyText
            $scope.replyText = `${text}${_current}`
            $scope.$apply()
            // console.log(text);
            // var html = $('#replyworld').val();
            // html += text;
            // $('#replyworld').val(html);
        });

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

       
        var base64 = new Base64();
        var job = localStorage.getItem('job') ? base64.decode(localStorage.getItem('job')) : '';
        var loginName = localStorage.getItem('erploginName') ? base64.decode(localStorage.getItem('erploginName')) : '';
        $scope.isshowBtn = ['打单', '纠纷'].includes(job.trim()) || ['张自豪', '田恬', '琚敏', '朱顺', '刘鑫', '邹春妹', 'admin', '朱春翡', '姚亿玲', '温馨怡', '孟莹', '汪宇涛'].includes(loginName)

        $('.recordMsg-word').on('click', 'a', function (e) {
            e.preventDefault();
            $(this).addClass('active').siblings('.active').removeClass('active');
            var id = '#' + $(this).attr('href');
            $(id).show().siblings('.recordMsg-content').hide();
        });
        $('#cebian-menu .cebian-content').on('click', 'span>a', function () {
            sessionStorage.setItem('searchInformation', $scope.searchval);
        });
        $scope.changeChina = function (text) {
            var str = changeChinese(text);
            return str;
        };
        $scope.type='All'
        $scope.operatorName = "";
        $scope.storeNum = '';
        $scope.storeList = [
            {"storeNum":0,"storeName":"义乌仓"},
            {"storeNum":1,"storeName":"深圳仓"},
            {"storeNum":2,"storeName":"美西奇诺仓"},
            {"storeNum":3,"storeName":"美东新泽西"},
            {"storeNum":4,"storeName":"泰国仓"},
            {"storeNum":5,"storeName":"金华仓"},
            {"storeNum":6,"storeName":"印尼雅加达仓"},
            {"storeNum":7,"storeName":"德国法兰克福仓"},
        ]
        function getList() {
            erp.load()
            let getListData = {
                page:+$scope.pageNum,
                limit:+$scope.pageSize,
                code:'erp',
                responseType:'cj',
                status:'1,2,4,7',
                type:$scope.type,
                name:$scope.ywyName,
                orderNumber:$scope.searchval,
                beginDate:$scope.startTime,
                endDate:$scope.endTime,
                store: $scope.storeNum,
                operator: $scope.operatorName,
            };
            erp.postFun('app/dispute/getDispute', JSON.stringify(getListData), con, errFun);
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

        getList();
        $scope.search = ()=>{
            $scope.pageNum = '1';
            getList();
        }
        $scope.$watch('startTime+endTime', function() {
            $timeout(()=>{
                $scope.pageNum=1;
                getList();
            },300)
        });
        //获取业务员
        erp.postFun('app/dispute/getDisputeEmployee', {}, function (data) {
            var list = data.data.list;
            let nameList = ['王能彬','Tina','金林杰','詹雯瑾','陆依婷','方佳','金淑华','陈宁宁','田倩','吴诗林','高晨琦','朱小冬','Lynn','张晶晶','陈磊刚','聂德宁','郑尹尤','赵如心','杨喜发']
            // console.log($scope.ywyList);
            $.each(list, function (i, v) {
                if (~nameList.indexOf(v.NAME)) {
                    list.splice(i, 1);
                    list.unshift(v);
                }
            })
            console.log(list);
            $scope.ywyList = list;
        }, function (data) {
            console.log(data)
        })

        //分页
        function pageFun(erp, $scope) {
            console.log($scope.totalNum)
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
                    ;
                    $scope.pageNum = n;
                    getList();
                }
            });
        }

        $scope.changePageSize = function () {
            $scope.pageNum = '1';
            getList();
        }
        $scope.toSpecifiedPage = function () {
            getList();
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
        $scope.keypressFun = (e)=>{
            if (e.keyCode == 13) {
                $scope.pageNum = '1';
                $scope.search()
            }
        }
        $scope.search = function () {
            console.log($scope.searchval);
            $scope.pageNum = '1';
            getList();
        }

        function getOrderDetail(item,bfData){
          if(item.otype==3){
              erp.postFun('app/dispute/getVideoProduct', JSON.stringify(bfData), function (data) {
                // console.log(data.data.address.id)
                let productList = [];
                data.data.products&&data.data.products.map( (productItem) => {
                  productList.push({
                    id:productItem.id,
                    cjImage:productItem.img,
                    quantity:1,
                    sku:productItem.sku,
                    cjProductName:productItem.nameen
                  })
                });
                $scope.productList = productList;//商品列表
              }, function (data) {
                  console.log(data)
              })
            }else{
              erp.postFun('app/dispute/getOrderAddress', JSON.stringify(bfData), function (data) {
                console.log(data)
                // console.log(data.data.address.id)
                var resObj = data.data.address;
                if (resObj && resObj.id) {
                    $scope.productList = data.data.products;//商品列表
                    $scope.recoCity = resObj.city;
                    $scope.recoProvin = resObj.province;
                    $scope.recoCountrycode = resObj.countryCode;
                    $scope.recoCustomerName = resObj.customerName;
                    $scope.recoShippingAddress = resObj.shippingAddress;
                    $scope.recoShippingAddress2 = resObj.shippingaddress2;
                    $scope.recoZip = resObj.zip;
                }
              }, function (data) {
                  console.log(data)
              })
            }
        }

        // 查询退款详情信息
        function getRefundInfo(id) {
            erp.postFun('app/dispute/getRefundInfo', {id}, res => {
                // console.log(res);
                const {data, status} = res;
                if (status != 200) return layer("信息获取失败！");
                // data.dispute = {...data.dispute, ...JSON.parse(data.dispute.refund_amount_record)}
                data.dispute.refund_amount_record = JSON.parse(data.dispute.refund_amount_record)
                console.log("退款详情信息\n", data);
                $scope.refundInfo = data;
            })
        }
        // 退款处理
        $scope.refundDispose = (item, index) => {
            $scope.replayFlag = 9;
            $scope.itemId = item.ID;
            $scope.itemIndex = index;
            $scope.messageListArr = item.message;
            $scope.otype = item.otype;
            $scope.refundStatus = item.refund_status;
            $scope.refundMoney = item.money;
            getRefundInfo(item.ID);
            $(".recordMsg").css("display", "block");
            var target = $('.recordMsg-word').find('a').eq(2);
            target.addClass('active').siblings('.active').removeClass('active');
            target.click();
        }
        // 退款确认
        $scope.refundConfirm = mode => {
            console.log(mode);
            let title;
            if (mode == '1')  title = '确认后该纠纷订单会进入已完成状态，请谨慎操作';
            if (mode == '2')  title = '确认后会将该笔资金重新退回至客户cj钱包，并将该纠纷订单更新为已完成，请谨慎操作';
            initConfirmBox({
              mode,
              title,
              cb: () => {
                if (mode == '2' && (!$scope.refundMoney || $scope.refundMoney <= 0)) {
                  return layer.msg('请输入退款金额');
                }
                layer.load(2)
                var listObj = {}; //存储一条消息内容
                listObj.userName = '1'; //业务员
                listObj.image = [];
                listObj.videoUrl = [];
                listObj.remark = '';
                listObj.date = timestampToTime(new Date())
                listObj.refuseMoney = $scope.refundMoney;
                $scope.messageListArr.push(listObj)
                var listArr = JSON.stringify($scope.messageListArr)
                let upData = {};
                upData.id = $scope.itemId;
                upData.responseType = 'CJ';
                upData.money = $scope.refundMoney;
                upData.message = listArr;
                upData.refundProcessMode = mode;
                upData.refundAmountRecord = JSON.stringify($scope.refundInfo.dispute.refund_amount_record);
                console.log(upData);
                if ($scope.otype == 3) {
                  erp.postFun('app/dispute/videoOrderRefund', JSON.stringify(upData), function(data) {
                    layer.closeAll('loading');
                    if (data.data.code == "200") {
                      saveRefundInfo(); // 退款成功保存结果
                      $scope.closRrecordMsgFun(); //关闭纠纷单
                      $(".recordMsg").css("display", "none");
                      layer.msg('回复退款成功')
                      $scope.ordersList[$scope.itemIndex].message = $scope.messageListArr;
                      $scope.replyText = '';
                      $scope.howMoney = '';
                      $scope.imgArr = [];
                      $scope.videoArr = [];
                      $scope.proofImgList = [];
                      getList(erp, $scope);
                    } else if (data.data.code == "223") {
                      layer.msg('视频订单无数据')
                      $scope.messageListArr.pop()
                    } else if (data.data.code == "224") {
                      layer.msg('退款金额不能大于订单金额')
                      $scope.messageListArr.pop()
                    } else if (data.data.code == "225") {
                      layer.msg('平台处理失败')
                      $scope.messageListArr.pop()
                    } else if (data.data.code == "226") {
                      layer.msg('退款处理中')
                      $scope.messageListArr.pop()
                    } else if (data.data.code == "400") {
                      layer.msg('退款失败')
                      $scope.messageListArr.pop()
                    } else {
                      layer.msg('退款失败')
                      $scope.messageListArr.pop()
                    }
                  }, errFun)
                } else {
                  erp.postFun('app/dispute/replyDispute', JSON.stringify(upData), function(data) {
                    layer.closeAll('loading');
                    if (data.data.result.code == '200' || data.data.result.code == true || data.data.result == '200' || data.data.result == true || data.data.code === '200') {
                      saveRefundInfo(); // 退款成功保存结果
                      $scope.closRrecordMsgFun(); //关闭纠纷单
                      $(".recordMsg").css("display", "none");
                      layer.msg('回复退款成功')
                      $scope.ordersList[$scope.itemIndex].message = $scope.messageListArr;
                      $scope.replyText = '';
                      $scope.howMoney = '';
                      $scope.imgArr = [];
                      $scope.videoArr = [];
                      $scope.proofImgList = [];
                      getList(erp, $scope);
                    } else if (data.data.result.code == 222 || data.data.result == 222) {
                      layer.msg('退款金额不能大于订单金额')
                      $scope.messageListArr.pop()
                    } else if (data.data.result.code == 223 || data.data.result == 223) {
                      layer.msg('回复退款失败')
                      $scope.messageListArr.pop()
                    } else if (data.data.result.code == 225 || data.data.result == 225) {
                      layer.msg('平台处理失败')
                      $scope.messageListArr.pop()
                    } else if (data.data.result.code == 226 || data.data.result == 226) {
                      layer.msg('退款处理中')
                      $scope.messageListArr.pop()
                    } else {
                      layer.msg('回复退款失败')
                      $scope.messageListArr.pop()
                    }
                  }, errFun)
                }
              }
            })
            // 退款成功保存结果
            function saveRefundInfo() {
              let refundData = {
                refundNotes: $scope.refundNotes,
                vouche: JSON.stringify($scope.proofImgList),
                refundProcessMode: mode,
                id: $scope.itemId
              }
              erp.postFun('app/dispute/saveRefundInfo', refundData, res => {
                console.log(res);

              })
            }
        }

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
            console.log($scope.messageListArr)
            var messageArr = item.message;
            $scope.otype = item.otype;
            $scope.nowType = item.type;
            $scope.tdetailDate = item.createDate;
            $scope.detailData = item.message;//纠纷对话列表
            $scope.userName = item.userName;
            $scope.serverName = item.salesmanName;
            $scope.refundStatus = item.refund_status
            $scope.refundMoney = item.money;
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
            if(item.status!=2||item.money){ //确认补发中 回复详情不传该参数
                bfData.type = 'erp';
            }
            getOrderDetail(item,bfData)
            if (item.refund_status) {
              getRefundInfo(item.ID) // 查询退款详情信息
            }
        }

        // 打开详情
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
            $scope.otype = item.otype;
            $scope.nowType = item.type;
            $scope.tdetailDate = item.createDate;
            $scope.detailData = item.message;//纠纷对话列表
            $scope.userName = item.userName;
            $scope.serverName = item.salesmanName;
            $scope.refundStatus = item.refund_status;
            $scope.refundMoney = item.money;
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
            console.log(item.status)
            if(item.status!=2||item.money){ //确认补发中 回复详情不传该参数
                bfData.type = 'erp';
            }
            getOrderDetail(item,bfData)
            if (item.refund_status) {
              getRefundInfo(item.ID) // 查询退款详情信息
            }
        };
        // 退款
        $scope.tKFun = function (item, index) {
            if (item.money) {
                layer.msg('退款方案进行中')
                return;
            }
            if (item.disputeOrder) {
                layer.msg('该订单已发起补发方案,客户处理之前不能操作退款方案')
                return;
            }
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
            $scope.otype = item.otype
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
            $scope.refundStatus = item.refund_status;
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
            if(item.otype==3){
              erp.postFun('app/dispute/getVideoProduct', JSON.stringify(bfData), function (data) {
                // console.log(data.data.address.id)
                if (resObj && resObj.id) {
                    $scope.productList = data.data.products;//商品列表
                }
              }, function (data) {
                  console.log(data)
              })
            }else{
              erp.postFun('app/dispute/getOrderAddress', JSON.stringify(bfData), function (data) {
                console.log(data)
                // console.log(data.data.address.id)
                var resObj = data.data.address;
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
           
        }
        $scope.closRrecordMsgFun = function () {
            $(".recordMsg").css("display", "none");
            $scope.replyText = '';
            $scope.imgArr = [];
            $scope.proofImgList = [];
        }

        //补发
        $scope.bfFun = function (item, index) {
            // layer.msg('该功能正在开发中')
            $scope.yunFeiMoney = 0;
            if (item.disputeOrder) {
                layer.msg('补发方案进行中')
                return;
            }
            if (item.money) {
                layer.msg('该订单已发起退款方案,客户处理之前不能进行补发操作')
                return;
            }
            var target = $('.recordMsg-word').find('a').eq(0);
            target.addClass('active').siblings('.active').removeClass('active');
            var tid = '#' + target.attr('href');
            $(tid).show().siblings('.recordMsg-content').hide();
            $scope.replyText = "Please confirm the resend information below before we process the resending order.";
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
            console.log(item)
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
                if (resObj && resObj.id) {
                    $scope.checkedAll = true;
                    $scope.dafultLogistic = resObj.logisticName;
                    $scope.logisticList = resObj.logisticinfo;
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
                } else {
                    layer.msg('该订单不能补发')
                }
            }, function (data) {
                console.log(data)
            })
        }
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
            if($scope.yunFeiMoney&&$scope.yunFeiMoney<=0){
                layer.msg('运费不能小于或则等于0,如果没有运费可不填',{time:3000})
                return;
            }
            // return;
            layer.load(2)
            var bfUpData = {};
            bfUpData.replacementFreight = $scope.yunFeiMoney;
            bfUpData.id = $scope.itemId;
            bfUpData.city = $scope.recoCity;
            bfUpData.province = $scope.recoProvin;
            bfUpData.countryCode = $scope.recoCountrycode;
            bfUpData.customerName = $scope.recoCustomerName;
            bfUpData.shippingAddress = $scope.recoShippingAddress;
            bfUpData.shippingaddress2 = $scope.recoShippingAddress2;
            bfUpData.zip = $scope.recoZip;
            bfUpData.logisticName = $scope.dafultLogistic;
            bfUpData.productids = JSON.stringify(bfCheckedList);
            bfUpData.erpnote = $('#recoTextArea').val();
            //{"id":"123","productids":[{"sku":"010","quantity":"3"},{"sku":"33","quantity":"2"}]}
            erp.postFun('app/dispute/createDisputeOrder', JSON.stringify(bfUpData), function (data) {
                console.log(data)
                if (data.data.code == true) {
                    layer.msg('创建补发成功')
                    var listObj = {};//存储一条消息内容
                    listObj.userName = '1';//业务员
                    listObj.image = $scope.imgArr;
                    listObj.videoUrl = $scope.videoArr;
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
                    erp.postFun('app/dispute/replyDispute', JSON.stringify(upData), function (data) {
                        console.log(data)
                        layer.closeAll('loading');
                        if (data.data.result == true || data.data.result == 200) {
                            $scope.closRrecordMsgFun();//关闭纠纷单
                            layer.msg('回复成功')
                            $scope.ordersList[$scope.itemIndex].message = $scope.messageListArr;
                            $scope.replyText = '';
                            $scope.imgArr = [];
                            $scope.videoArr = [];
                            getList(erp, $scope);
                        } else {
                            layer.msg('回复失败')
                            // $scope.messageListArr.pop()
                        }
                    }, errFun)
                } else {
                    layer.closeAll('loading');
                    var msg = data.data.message;
                    layer.msg(msg);
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
                listObj.videoUrl = $scope.videoArr;
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
                        $scope.videoArr = [];
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
            console.log($scope.howMoney)
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
            listObj.videoUrl = $scope.videoArr;
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
            if($scope.otype==3){
              erp.postFun('app/dispute/videoOrderRefund', JSON.stringify(upData), function (data) {
                layer.closeAll('loading');
                if (data.data.code == "200") {
                    $(".recordMsg").css("display", "none");
                    $scope.closRrecordMsgFun();//关闭纠纷单
                    layer.msg('回复退款成功')
                    $scope.ordersList[$scope.itemIndex].message = $scope.messageListArr;
                    $scope.replyText = '';
                    $scope.howMoney = '';
                    $scope.imgArr = [];
                    $scope.videoArr = [];
                    getList(erp, $scope);
                } else if (data.data.code == "223") {
                  layer.msg('视频订单无数据')
                  $scope.messageListArr.pop()
                } else if (data.data.code == "224") {
                  layer.msg('退款金额不能大于订单金额')
                  $scope.messageListArr.pop()
                } else if (data.data.code == "225") {
                  layer.msg('平台处理失败')
                  $scope.messageListArr.pop()
                } else if (data.data.code == "226") {
                  layer.msg('退款处理中')
                  $scope.messageListArr.pop()
                } else if (data.data.code == "400") {
                  layer.msg('退款失败')
                  $scope.messageListArr.pop()
                } else {
                  layer.msg('退款失败')
                  $scope.messageListArr.pop()
                }
              }, errFun)
            }else{
              erp.postFun('app/dispute/replyDispute', JSON.stringify(upData), function (data) {
                console.log(data)
                layer.closeAll('loading');
                if (data.data.result.code == '200' || data.data.result.code == true || data.data.result == '200' || data.data.result == true || data.data.code === '200') {
                    $(".recordMsg").css("display", "none");
                    $scope.closRrecordMsgFun();//关闭纠纷单
                    layer.msg('回复退款成功')
                    $scope.ordersList[$scope.itemIndex].message = $scope.messageListArr;
                    $scope.replyText = '';
                    $scope.howMoney = '';
                    $scope.imgArr = [];
                    $scope.videoArr = [];
                    getList(erp, $scope);
                } else if (data.data.result.code == 222 || data.data.result == 222) {
                  layer.msg('退款金额不能大于订单金额')
                  $scope.messageListArr.pop()
                } else if (data.data.result.code == 223 || data.data.result == 223) {
                  layer.msg('回复退款失败')
                  $scope.messageListArr.pop()
                } else if (data.data.result.code == 225 || data.data.result == 225) {
                  layer.msg('平台处理失败')
                  $scope.messageListArr.pop()
                } else if (data.data.result.code == 226 || data.data.result == 226) {
                  layer.msg('退款处理中')
                  $scope.messageListArr.pop()
                } else {
                  layer.msg('回复退款失败')
                  $scope.messageListArr.pop()
                }
              }, errFun)
            }
            
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

        //上传图片
        $scope.imgArr=[];
        let loadList = {
            img: ['png', 'jpg', 'jpeg', 'gif', "PNG", "JPG", "JPEG", "GIF"],
            video: ['mp4', 'avi', 'wmv', 'mpg', 'mov', 'flv', "MP4", "AVI", "WMV", "MPG", "MOV", "FLV"]
        };
        $scope.upLoadImg4=function (files) {
            console.log(files)
            if($scope.imgArr.length>=8){
              layer.msg('最多上传8张图片')
              return
            }
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
        $scope.$apply()
      }
    };
    

    // 退款处理-上传凭证
    $scope.proofImgList = [];
    $scope.upLoadImg9 = function(files) {
      console.log(files)
      if ($scope.proofImgList.length >= 3) {
        layer.msg('最多上传3张凭证')
        return
      }
      let validFileArr = [];
      if (files) {
        let fileType, fileName;
        for (let i = 0, len = files.length; i < len; i++) {
          fileName = files[i].name;
          fileType = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();
          console.log(fileName, fileType)
          if (loadList.img.indexOf(fileType) != -1) {
            validFileArr.push(files[i])
          }
        }
        console.log(validFileArr)
      }
      $('.upload_file').val('')
      if (validFileArr.length < 1 && files.length > 0) {
        return layer.msg('Images format error')
      }
      erp.ossUploadFile(validFileArr, function(data) {
        console.log(data)
        if (data.code == 0) {
          return layer.msg('Images Upload Failed');
        }
        if (data.code == 2) {
          return layer.msg('Images Upload Incomplete');
        }
        var result = data.succssLinks;
        console.log(result)
        for (var j = 0; j < result.length; j++) {
          var srcList = result[j].split('.');
          var fileName = srcList[srcList.length - 1].toLowerCase();
          console.log(fileName)
          if (fileName == 'png' || fileName == 'jpg' || fileName == 'jpeg' || fileName == 'gif') {
            $scope.proofImgList.push(result[j]);
          }
        }
        if ($scope.proofImgList && $scope.proofImgList.length >= 3) {
          $scope.hideUpImgFlag = true;
        }
        console.log($scope.proofImgList)
        $scope.$apply();
      })
    }
    // 删除上传的凭证
    $scope.delProofImg = (index, event) => {
      event.stopPropagation();
      $scope.proofImgList.splice(index, 1);
      if ($scope.proofImgList.length < 3) {
        $scope.hideUpImgFlag = false;
      }
    };

    function initConfirmBox ({mode, title='确认', cb}) {
        $scope.confirmBox = {
          hasShow: true,
          ok() {
            cb && cb()
            this.hasShow = false;
          },
          cancel() {
            this.hasShow = false;
          },
          title,
          mode,
        }
      }

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
}();