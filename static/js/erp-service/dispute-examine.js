;~function(){
    var app = angular.module('erp-service');
    //erp客服---待您审核

    var lang = localStorage.getItem('lang');
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
            } else if (text == 'Lack of inventory' || text == 'Lack Of Inventory') {
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

    app.controller('csdisputePendingExamineCtrl', ['$scope', 'erp', '$timeout', function ($scope, erp, $timeout) {
        console.log('纠纷审核');
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
            $('.replyWrap').css('right', '-260px');
            $scope.replyWrapModal = false
        });
        $('.ulWrap>ul').on('click', 'li>span', function (e) {
            var target = $(this);
            var text = target.attr('title');
            let _current = $scope.replyText
            $scope.replyText = `${text}${_current}`
            $scope.$apply()
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
        $scope.ywyName = '请选择业务员';

        $scope.changeChina = function (text) {
            var str = changeChinese(text);
            return str;
        };
        var base64 = new Base64()
        var erpLoginName = base64.decode(localStorage.getItem('erploginName')==undefined?'':localStorage.getItem('erploginName'));
        var job = localStorage.getItem('job') ? base64.decode(localStorage.getItem('job')) : '';
        
        $scope.isshowBtn = ['管理', '打单', '纠纷'].includes(job.trim()) || ['朱桂芬', '史静怡', '姚亿玲', '温馨怡'].includes(erpLoginName)
        $scope.tkbfBtnFlag = ['朱桂芬', '史静怡', '姚亿玲', '温馨怡'].includes(erpLoginName)
        $scope.type='All';
        function getList() {
            erp.load();
            let params = {
                page:+$scope.pageNum,
                limit:+$scope.pageSize,
                code:'erp',
                responseType:'erp',
                status: "1,2,4,6",
                auditStatus: 0,
                type:$scope.type,
                name:$scope.ywyName != '请选择业务员'?$scope.ywyName:'',
                orderNumber:$scope.searchval,
                beginDate:$scope.startTime,
                endDate:$scope.endTime
            }
            erp.postFun('app/dispute/getDispute', JSON.stringify(params), con, errFun)
            
            function con(data) {
                console.log(data);
                $scope.ordersList = data.data.list;
                $scope.totalNum = data.data.count;//获取总订单的条数
                console.log($scope.totalNum);
                erp.closeLoad();
                pageFun(erp, $scope);
            }
        }

        function errFun(data) {
            console.log(data)
            erp.closeLoad()
        }

        getList()
        $scope.$watch('startTime+endTime', function() {
            $timeout(()=>{
                $scope.pageNum=1;
                getList();
            },300)
        });
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

        //分页
        function pageFun(erp, $scope) {
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
                    getList(erp, $scope)
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
        $scope.keypressFun =(e)=>{
            if (e.keyCode == 13) {
                $scope.pageNum = '1';
                $scope.search()
            }
        }
        $('#cebian-menu .cebian-content').on('click', 'span>a', function () {
            sessionStorage.setItem('searchInformation', $scope.searchval);
        });
        $scope.search = function () {
            console.log($scope.searchval);
            $scope.pageNum = '1';
            getList();
        }
        var jflx = '';
        $('.recordMsg-word').on('click', 'a', function (e) {
            e.preventDefault();
            $(this).addClass('active').siblings('.active').removeClass('active');
            var id = '#' + $(this).attr('href');
            $(id).show().siblings('.recordMsg-content').hide();
        });

        function getOrderDetail(item,bfData){
            if(item.otype==3){//视频单
                erp.postFun('app/dispute/getVideoProduct', JSON.stringify(bfData), function (data) {
                  // console.log(data.data.address.id)
                  let productList = [];
                  data.data.products&&data.data.products.map( (productItem) => {
                    console.log(productItem);
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
                if(item.operation_action == 2){//补发审核
                    let itemObj = item.employee_parameter[0]
                    $scope.productList = itemObj.productids;//商品列表
                    $scope.recoCity = itemObj.city;
                    $scope.recoProvin = itemObj.province;
                    $scope.recoCountrycode = itemObj.countryCode;
                    $scope.recoCustomerName = itemObj.customerName;
                    $scope.recoShippingAddress = itemObj.shippingAddress;
                    $scope.recoShippingAddress2 = itemObj.shippingaddress2;
                    $scope.recoZip = itemObj.zip;
                    $scope.logisticName = itemObj.logisticName;
                    $scope.replacementFreight = itemObj.replacementFreight;
                }else{
                    erp.postFun('app/dispute/getOrderAddress', JSON.stringify(bfData), function (data) {
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
                            $scope.logisticName = resObj.logisticName;
                            $scope.replacementFreight = resObj.replacementFreight;
                        }
                      }, function (data) {
                          console.log(data)
                      })
                }
                
              }
        }
        $scope.examineFun = function(item){
            let params = {
                "orderId":item.orderId
            }
            erp.postFun('app/dispute/auditPass',params,function(data){
                console.log(data)
                let resData = data.data;
                if(resData.code == 200){
                    layer.msg('审核通过')
                    getList();
                }else{
                    layer.msg(resData.message)
                }
            },function(error){
                console.log(error)
            },{layer:true})
        }
        $scope.rejectFun = function(item){
            $scope.rejectFlag = true;
            $scope.itemOrdId = item.orderId;
        }
        $scope.sureRejectFun = function(){
            if(!$scope.rejectResult){
                layer.msg('请输入拒绝原因')
                return
            }
            if($scope.rejectResult.length>50){
                layer.msg('输入要小于50个字符')
                return
            }
            let params = {
                'orderId': $scope.itemOrdId,
                'rejectMsg': $scope.rejectResult
            }
            erp.postFun('app/dispute/reject',params,function(data){
                let resData = data.data;
                if(resData.code == 200){
                    $scope.rejectResult = '';
                    $scope.rejectFlag = false;
                    layer.msg('驳回成功')
                    getList();
                }else{
                    layer.msg(resData.message)
                }
            },function(error){
                console.log(error)
            })
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
            console.log($scope.salseNameFir, $scope.cusNameFir);
            // 创建视频播放
            videoList(erp, item);
            var bfData = {};
            bfData.id = item.ID;
            bfData.type = 'erp';
            getOrderDetail(item,bfData)
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
            $scope.userLeveldj = item.userLevel;
            $scope.cunLeveldj = item.cunLevel;
            $scope.moneyLeveldj = item.moneyLevel;
            var target = $('.recordMsg-word').find('a').eq(0);
            target.addClass('active').siblings('.active').removeClass('active');
            var tid = '#' + target.attr('href');
            $(tid).show().siblings('.recordMsg-content').hide();
            $scope.itemId = item.ID;
            $scope.itemIndex = index;
            $scope.messageListArr = item.message;
            $scope.disputeRate = item.disputeRate;
            console.log(item)
            $scope.nowType = item.type;
            $scope.tdetailDate = item.createDate;
            // $scope.detailData = item.message;//纠纷对话列表
            if(item.operation_action == 2){
                $scope.detailData = item.employee_parameter[1].message;//纠纷对话列表
            }else{
                $scope.detailData = item.employee_parameter[0].message;//纠纷对话列表
            }
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
            getOrderDetail(item,bfData)
        };
        $scope.closRrecordMsgFun = function () {
            $(".recordMsg").css("display", "none");
            $scope.replyText = '';
            $scope.imgArr = [];
            $scope.replyText = "";
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
	        console.log($scope.replyText)
            if (!$scope.replyText) {
                layer.msg('请输入回复的内容')
                return;
            }
            var bfCheckedList = [];
            for (var i = 0; i < $scope.productList.length; i++) {
                var bfObj = {};
                if ($scope.productList[i].checked) {
		                if($scope.productList[i].inputQuantity <= 0){
			                layer.msg('补发数量需大于0')
			                return
		                }
		                if($scope.productList[i].inputQuantity>$scope.productList[i].quantity){
			                layer.msg('补发数量不能大于之前商品数量')
			                return
		                }
                    bfObj.sku = $scope.productList[i].sku;
                    bfObj.quantity = $scope.productList[i].inputQuantity;
                    bfObj.id = $scope.productList[i].id;
	                  bfCheckedList.push(bfObj);
                }
            }
            console.log($scope.replyText)
            console.log(bfCheckedList)
            if (bfCheckedList.length < 1) {
                layer.msg('请选择商品,或者为选择的商品输入补发数量')
                return;
            }
            if($scope.yunFeiMoney&&$scope.yunFeiMoney<=0){
                layer.msg('运费不能小于或则等于0,如果没有运费可不填',{time:3000})
                return;
            }
            if(!$scope.newlogisticName) {
                layer.msg('请选择物流方式')
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
            bfUpData.logisticName = $scope.newlogisticName;
            bfUpData.productids = JSON.stringify(bfCheckedList);
            bfUpData.erpnote = $('#recoTextArea').val();
            //console.log(bfUpData);
            //{"id":"123","productids":[{"sku":"010","quantity":"3"},{"sku":"33","quantity":"2"}]}
	          console.log(bfUpData)
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
                            let mesText = data.data.message || data.data.msg || '回复失败'
                            layer.msg(mesText)
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
                listObj.videoUrl = $scope.videoArr;
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
                        getList(erp, $scope);
                    } else {
                        let mesText = data.data.message || data.data.msg || '回复失败'
                        layer.msg(mesText)
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
            layer.load(2)
            var listObj = {};//存储一条消息内容
            listObj.userName = '1';//业务员
            listObj.image = $scope.imgArr;
            listObj.videoUrl = $scope.videoArr;
            listObj.remark = $scope.replyText;
            listObj.date = timestampToTime(new Date())
            listObj.refuseMoney = $scope.howMoney;
            // listArr.push(listObj);
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
                if (data.data.code == '200') {
                    $(".recordMsg").css("display", "none");
                    $scope.closRrecordMsgFun();//关闭纠纷单
                    layer.msg('退款成功')
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
                layer.closeAll('loading');
                if (data.data.result.code == 200 || data.data.result.code == true||data.data.result==200||data.data.result==true) {
                    $(".recordMsg").css("display", "none");
                    $scope.closRrecordMsgFun();//关闭纠纷单
                    layer.msg('退款成功')
                    $scope.ordersList[$scope.itemIndex].message = $scope.messageListArr;
                    $scope.replyText = '';
                    $scope.howMoney = '';
                    $scope.imgArr = [];
                    $scope.videoArr = [];
                    getList(erp, $scope);
                } else if (data.data.result.code == 222||data.data.result == 222) {
                    layer.msg('退款金额不能大于订单金额')
                    $scope.messageListArr.pop()
                } else if(data.data.result.code == 223||data.data.result == 223) {
                    layer.msg('回复退款失败')
                    $scope.messageListArr.pop()
                } else{
                    let mesText = data.data.message || data.data.msg || '回复失败'
                    layer.msg(mesText)
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


        //纠纷等待
        $scope.ddFun = function (id) {
            layer.confirm('确认要移至等待吗？', {
                btn: ['确定', '取消']//按钮
            }, function (index) {
                layer.close(index);
                var data = {
                    "id": id,
                    "refuseCause": ""
                };
                layer.load(2);
                //此处请求后台程序，下方是成功后的前台处理……
                erp.postFun('app/dispute/waitForDealWith', JSON.stringify(data), function (data) {
                    console.log(data);
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
        };

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
        $scope.CancleFun = function (item) {
            layer.confirm('确认要取消吗？', {
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
                layer.msg('请填写拒绝理由');
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

    }])
    
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
