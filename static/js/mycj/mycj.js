(function () {
    var app = angular.module('erp-mycjapp', []);
    //home\

    app.controller('erp-mycjcontrol', ['$scope', 'erp', '$location','$rootScope', function ($scope, erp, $location,$rootScope) {
        $(function () {
            var mySwiper = new Swiper('#banner-container', {
                // direction: 'vertical',
                loop: true,
                autoplay: 5000,
                //用户操作以后会不会停止
                autoplayDisableOnInteraction: false,
                // 如果需要分页器
                pagination: '.swiper-pagination',
                //点击分页按钮的切换
                paginationClickable: true,

                // 如果需要前进后退按钮
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev'
                // 如果需要滚动条
                // scrollbar: '.swiper-scrollbar',
            })
            // $('.content-list').append('<li class="con-list-li">rqeewr</li>')
            // var allH = $('.content-list').height();
            // var countNum = Math.round(allH/0.2)
            // $('.add-btn').click(function () {
            //     var addText = $('.add-text').val();
            //     console.log(addText)
            //     if (addText) {
            //         $('.content-list').append('<li class="con-list-li">'+addText+'</li>')
            //         allH = $('.content-list').height();
            //         countNum = Math.round(allH/0.2)
            //     }
            // })
            // var index = -200;
            // console.log(allH)
            // console.log(countNum)
            // // console.log(index+'----------------------')
            // var timer = setInterval(function () {
            //     var link = location.href;
            //     if (link.indexOf("#/mycj") == -1) {
            //         clearInterval(timer);
            //     } else {
            //         if (link.indexOf("#/mycj/mycjperformance") >= 0||link.indexOf("#/mycj/mycjLuntan") >= 0) {
            //             clearInterval(timer);
            //         }
            //     }

            //     index++;
            //     if (index >= countNum) {
            //         index = -200;
            //     }
            //     // console.log(index)
            //     // console.log('===============')
            //     $('.content-list').css({
            //         top: -index * 0.2 + 'px'
            //     })
            // }, 20)
            //文字轮播

            clearInterval(timer)
            // function topFun () {
            //   var index = 0;
            //   var timer = setInterval(function () {
            //     index++;
            //     if(index>=1000){
            //       index=-200;
            //     }
            //     console.log(index)
            //     console.log('===============')
            //     $('.mc-tz-txtp').css({
            //       top:-index*0.2+'px'
            //     })
            //   },1000)
            // }
            // topFun()

            var index = -200;
            // console.log(index+'----------------------')
            var timer = setInterval(function () {
                var link = location.href;
                if (link.indexOf("#/mycj") == -1) {
                    clearInterval(timer);
                } else {
                    if (link.indexOf("#/mycj/mycjperformance") >= 0||link.indexOf("#/mycj/mycjLuntan") >= 0) {
                        clearInterval(timer);
                    }
                }

                index++;
                if (index >= 500) {
                    index = -200;
                }
                // console.log(index)
                // console.log('===============')
                $('.mc-tz-txtp').css({
                    top: -index * 0.2 + 'px'
                })
            }, 20);
            // var mySwiper = new Swiper ('#tz-txt-container', {
            //     direction: 'vertical',
            //     loop: true,
            //     autoplay:1000,
            //     //用户操作以后会不会停止
            //     autoplayDisableOnInteraction : false,
            //     // 如果需要分页器
            //     pagination: '.swiper-pagination',
            //     //点击分页按钮的切换
            //     paginationClickable :true,

            //     // 如果需要前进后退按钮
            //     nextButton: '.swiper-button-next',
            //     prevButton: '.swiper-button-prev',
            //     // 如果需要滚动条
            //     // scrollbar: '.swiper-scrollbar',
            //   })
        });
        // $scope.XTstate = true;
        // $scope.NBstate = true;
        // $scope.XTclos = false;
        // $scope.NBclos = false;

    }])
    //我的绩效
    app.controller('erp-performance', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        console.log("erp-performance");

    }])
    //usps换订单号
    app.controller('changeOrdIdCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        console.log("换订单号");
        // 更换订单号
        $scope.sureChangeFun = function(){
            if(!$scope.orderNum){
                layer.msg('请输入订单号')
                return
            }
            let upIdsStr = $scope.orderNum;
            upIdsStr = upIdsStr.replace(/\r\n/g,",")
            upIdsStr=upIdsStr.replace(/\n/g,",")
            $scope.resOrdList = [];
            erp.postFun('tool/order/orderTransfer',{
                'orderId':upIdsStr
            },function(data){
                console.log(data)
                if(data.data.statusCode==200){
                    $scope.tipsFlag = false;
                    $scope.resOrdList = data.data.result;
                    console.log($scope.resOrdList)
                    if($scope.resOrdList.length>0){
                        let idStr = '';
                        for(let i = 0,len = $scope.resOrdList.length;i<len;i++){
                            idStr += $scope.resOrdList[i] + ',';
                        }
                        console.log(idStr)
                        $scope.ordIdStr = idStr.substring(0,idStr.length-1)
                        console.log($scope.ordIdStr)
                    }
                    erp.postFun('processOrder/queryOrder/orderTransfer',{
                        'orderId':upIdsStr
                    },function(data){
                        console.log(data)
                        if(data.data.code == 200){
                            $scope.resOrdList = data.data.data;
                            if($scope.resOrdList.length>0){
                                let idStr = '';
                                for(let i = 0,len = $scope.resOrdList.length;i<len;i++){
                                    idStr += $scope.resOrdList[i] + ',';
                                }
                                console.log(idStr)
                                $scope.ordIdStr = idStr.substring(0,idStr.length-1)
                                console.log($scope.ordIdStr)
                            }
                        }else{
                            layer.msg('转换失败')
                        }
                    },function(data){
                        console.log(data)
                    })
                }else{
                    layer.msg('转换失败')
                }
            },function(data){
                console.log(data)
            })
        }
        $scope.clearFun = function(){
            $scope.resOrdList = [];
            $scope.ordIdStr = '';
            $scope.orderNum = '';
        }
        $scope.copyFun = function(){
            var hideInpVal = $('.hideInput');
            hideInpVal.select(); // 选中文本
            var isCopyFlag = document.execCommand("copy"); // 执行浏览器复制命令
            if (isCopyFlag) {
                layer.msg('复制成功')
            }
            console.log(hideInpVal)
        }
        
    }])
    //论坛
    app.controller('erp-luntan', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        console.log("erp-luntan");
        var base64 = new Base64();
        var token = base64.decode(localStorage.getItem('erptoken') == undefined ? "" : localStorage.getItem('erptoken'));
        // document.getElementById("oframe").src = "http://192.168.5.150:8082?token=b14950496e850f5a7ae20146850a22aa";
      document.getElementById("oframe").src = "lun-tan/index.html?token=" + token;
      // document.getElementById("oframe").src = "http://47.254.27.197:8082?token=b14950496e850f5a7ae20146850a22aa";

    }]);
    app.controller('CopyCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location){
        console.log('CopyCtrl');
        $scope.isAdminFlag = erp.isAdminLogin();
        console.log($scope.isAdminFlag )
        var E = window.wangEditor

        var editor = new E('#wang');
        editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
        editor.create();
        // 书签

        $('.openBtn').click(function(e){
            e.preventDefault();
            var txt = editor.txt.html();
            console.log(txt);
            if(txt==null || txt=='' || txt==undefined){
                layer.msg('复制内容不能为空');
            }else{
                var Url1;
                Url1 = document.createElement('input');
                Url1.setAttribute('readonly', 'readonly');
                Url1.setAttribute('value', txt);
                document.body.appendChild(Url1);

                Url1.select();
                document.execCommand("Copy");
                var tag = document.execCommand("Copy");
                if (tag) {
                    layer.msg('复制成功');
                }
                document.body.removeChild(Url1);
            }
        });
        //editor.txt.html()
        $scope.accountType = '1';
        $scope.addSuperPassWord = function(){
            if(!$scope.accountName){
                layer.msg('请输入登录名或者用户名')
                return
            }
            if(!$scope.passWord){
                layer.msg('请输入要设置的密码')
                return
            }
            let upJson = {};
            if($scope.accountType==1){
                upJson.loginName = $scope.accountName;
            }else if($scope.accountType==2){
                upJson.userName = $scope.accountName;
            }
            upJson.superPassWord = $scope.passWord;
            erp.postFun('erp/account/setSuperPassWord',upJson,function(data){
                console.log(data)
                if(data.data.statusCode==200){
                    let len = data.data.result.length;
                    if(len==1){
                        layer.msg('设置成功')
                        $scope.accountName = '';
                        $scope.passWord = '';
                    }else if(len>1){
                        $scope.moreAccountFlag = true;
                        $scope.resArr = data.data.result;
                    }else{
                        layer.msg('设置失败')
                    }
                }else{
                    layer.msg('设置失败')
                }
            },function(data){
                console.log(data)
            },{layer:true})
        }
        $scope.seletFun = function(item){
            $scope.itemObj = item;
        }
        $scope.closeFun = function(){
            $scope.itemObj = null;
            $scope.moreAccountFlag = false;
        }
        $scope.sureAddFun = function(){
            console.log($scope.itemObj)
            if(!$scope.itemObj){
                layer.msg('请选择一个用户')
                return
            }
            let upJson = {};
            upJson.loginName = $scope.itemObj.login_name;
            upJson.superPassWord = $scope.passWord;
            erp.postFun('erp/account/setSuperPassWord',upJson,function(data){
                console.log(data)
                if(data.data.statusCode==200){
                    let len = data.data.result.length;
                    if(len==1){
                        layer.msg('设置成功')
                        $scope.accountName = '';
                        $scope.passWord = '';
                        $scope.itemObj = null;
                        $scope.moreAccountFlag = false;
                    }else{
                        layer.msg('设置失败')
                    }
                }else{
                    layer.msg('设置失败')
                }
            },function(data){
                console.log(data)
            },{layer:true})
        }
    }]);
    //公共首页
    app.controller('erpcomhomeCtrl', ['$scope', 'erp', '$location','$rootScope', function ($scope, erp, $location,$rootScope) {
        console.log('公共首页')
        $('.good-nav').eq(0).addClass('botborder2px')
        $('.souce-nav').eq(0).addClass('botborder2px')
        $('.souce-show').eq(0).show()
        $('.goods-show').eq(0).show()
        $('.good-nav').mouseenter(function () {
            var index = $(this).index();
            $('.goods-show').hide();
            $('.goods-show').eq(index).show()
            console.log(index)
            $('.good-nav').removeClass('botborder2px')
            $('.good-nav').eq(index).addClass('botborder2px')
        })

        $('.souce-nav').mouseenter(function () {
            var index = $(this).index();
            $('.souce-show').hide();
            $('.souce-show').eq(index).show()
            console.log(index)
            $('.souce-nav').removeClass('botborder2px')
            $('.souce-nav').eq(index).addClass('botborder2px')
        })
        erp.load()
        erp.postFun('erp/erphomepage/StatsAccOrderSalesInfo',{},function (data) {
            layer.closeAll('loading')
            if (data.data.code==200) {
                var numObj = data.data.data;
                $scope.bmList = numObj.StatMessageList;//消息
                // $scope.ordList = numObj.StatOrderList;//订单
                $scope.spList0 = numObj.StatProductList;//代发商品
                $scope.spList1 = numObj.StatProductList;//服务商品
                $scope.seaList0 = numObj.searchProductList;//等待搜品
                $scope.seaList1 = numObj.searchProductList;//等待搜品
                $scope.cgList = numObj.statBuyerList;//采购
                $scope.kfList = numObj.statServiceList;//客服
            } else {
                layer.msg('获取数量失败')
            }
        },function (data) {
            console.log(data)
            layer.closeAll('loading')
        })
        erp.postFun('processOrder/queryOrder/getStatOrderInfo',{},function (data) {//订单查询迁移杭州
            if (data.data.code==200) {
                $scope.ordList = data.data.data;//订单
            } else {
                layer.msg('获取数量失败')
            }
        },function (data) {
            console.log(data)
        })
        $scope.pageSize = '4';
        $scope.pageNum = '1';
        function getNoticeFun() {
            erp.loadPercent($('.eccm-right'),$('.eccm-right').height()-61,61,0)
            var eHomeObj = {};
            eHomeObj.pageSize = $scope.pageSize;
            eHomeObj.page = $scope.pageNum
            erp.postFun('erp/erphomepage/getNotice',JSON.stringify(eHomeObj),function (data) {
                console.log(data)
                if(data.data.code==200){
                    $scope.noticeCount = data.data.data.count;
                    $scope.noticeList = data.data.data.noticeList; 
                    pageFun()
                }
                if ($scope.noticeCount<1) {
                    erp.addNodataPic($('.eccm-right'),$('.eccm-right').height()-61,61,0)
                }else{
                    erp.removeNodataPic($('.eccm-right'))
                }
                erp.closeLoadPercent($('.eccm-right'))
            },function (data) {
                console.log(data)
                erp.closeLoadPercent($('.eccm-right'))
            })
        }
        getNoticeFun()
        function pageFun() {
            if($scope.noticeCount<1){
                return
            }
            $(".page-num").jqPaginator({
                totalCounts: $scope.noticeCount,//设置分页的总条目数
                pageSize: $scope.pageSize-0,//设置每一页的条目数
                visiblePages: 5,//显示多少页
                currentPage: $scope.pageNum-0,
                activeClass: 'active',
                prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
                next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
                page: '<a href="javascript:void(0);">{{page}}<\/a>',
                first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
                last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
                onPageChange: function (n,type) {
                    if(type=='init'){
                        layer.closeAll("loading")
                        return;
                    }
                    $scope.pageNum=n+'';
                    getNoticeFun()
                }
            });
        }
        $scope.showNotFun = function (item) {
            $scope.ggTkFlag = true;
            $('.tk-notice-text').text(item.info);
        }
    }])
    //业务员首页
    app.controller('erpywyhomeCtrl', ['$scope', 'erp', '$location','$rootScope', function ($scope, erp, $location,$rootScope) {
        console.log('业务员首页')
        var myChart = echarts.init(document.getElementById('main'));
        $('.good-nav').eq(0).addClass('botborder2px')
        $('.souce-nav').eq(0).addClass('botborder2px')
        $('.souce-show').eq(0).show()
        $('.goods-show').eq(0).show()
        $('.good-nav').mouseenter(function () {
            var index = $(this).index();
            $('.goods-show').hide();
            $('.goods-show').eq(index).show()
            console.log(index)
            $('.good-nav').removeClass('botborder2px')
            $('.good-nav').eq(index).addClass('botborder2px')
        })

        $('.souce-nav').mouseenter(function () {
            var index = $(this).index();
            $('.souce-show').hide();
            $('.souce-show').eq(index).show()
            console.log(index)
            $('.souce-nav').removeClass('botborder2px')
            $('.souce-nav').eq(index).addClass('botborder2px')
        })

        erp.load()
        erp.postFun('erp/erphomepage/StatsAccOrderSalesInfo',{},function (data) {
            console.log(data)
            layer.closeAll('loading')
            if (data.data.code==200) {
                var numObj = data.data.data;
                $scope.bmList = numObj.StatMessageList;//消息
                // $scope.ordList = numObj.StatOrderList;//订单
                $scope.spList0 = numObj.StatProductList;//代发商品
                $scope.spList1 = numObj.StatProductList;//服务商品
                $scope.seaList0 = numObj.searchProductList;//等待搜品
                $scope.seaList1 = numObj.searchProductList;//等待搜品
                $scope.cgList = numObj.statBuyerList;//采购
                $scope.kfList = numObj.statServiceList;//客服
            } else {
                layer.msg('获取数量失败')
            }
        },function (data) {
            console.log(data)
            layer.closeAll('loading')
        })
        erp.postFun('processOrder/queryOrder/getStatOrderInfo',{},function (data) {//订单查询迁移杭州
            if (data.data.code==200) {
                $scope.ordList = data.data.data;//订单
                console.log($scope.ordList)
            } else {
                layer.msg('获取订单数量失败')
            }
        },function (data) {
            console.log(data)
        })
        var dayType = 0;
        $('.day-time').eq(0).addClass('day-act');
        $('.day-time').click(function () {
            var index = $(this).index();
            console.log(index)
            switch (index) {
                case 0:
                    dayType = 0;
                    break;
                case 1:
                    dayType = 1;
                    break;
                case 2:
                    dayType = 7;
                    break;
                case 3:
                    dayType = 30;
                    break;
            }
            $('.day-time').removeClass('day-act')
            $('.day-time').eq(index).addClass('day-act');
            erp.loadPercent($('.top-bang'),$('.top-bang').height()-108,108,0)
            var upData1 = {};
            upData1.type = dayType;
            erp.postFun('erp/erphomepage/getOrderSellRanking',JSON.stringify(upData1),function (data) {
                console.log(data)
                $scope.phbList = data.data.data;
                if ($scope.phbList.length<1) {
                    erp.addNodataPic($('.top-bang'),$('.top-bang').height()-108,108,0)
                    // erp.closeLoadPercent($('.top-bang'))
                }else{
                    erp.removeNodataPic($('.top-bang'))
                }
                // layer.closeAll('loading')
                erp.closeLoadPercent($('.top-bang'))
            },function (data) {
                console.log(data)
                // layer.closeAll('loading')
                erp.closeLoadPercent($('.top-bang'))
            })
        })
        var monthArr = [];
        var xseArr = [];
        var upData = {};
        upData.type = dayType;
        erp.postFun('erp/erphomepage/getOrderSellRanking',JSON.stringify(upData),function (data) {
            console.log(data)
            $scope.phbList = data.data.data;
            if ($scope.phbList.length<1) {
                erp.addNodataPic($('.top-bang'),$('.top-bang').height()-108,108,0)
            }else{
                erp.removeNodataPic($('.top-bang'))
            }
            layer.closeAll('loading')
        },function (data) {
            console.log(data)
            layer.closeAll('loading')
        })

        $scope.pageSize = '4';
        $scope.pageNum = '1';
        function getNoticeFun() {
            erp.loadPercent($('.ywy-gg'),$('.ywy-gg').height()-62,62,0)
            var eHomeObj = {};
            eHomeObj.pageSize = $scope.pageSize;
            eHomeObj.page = $scope.pageNum
            erp.postFun('erp/erphomepage/getNotice',JSON.stringify(eHomeObj),function (data) {
                console.log(data)
                if(data.data.code==200){
                    $scope.noticeCount = data.data.data.count;
                    $scope.noticeList = data.data.data.noticeList; 
                    pageFun()
                }

                if ($scope.noticeCount<1) {
                    erp.addNodataPic($('.ywy-gg'),$('.ywy-gg').height()-62,62,0)
                }else{
                    erp.removeNodataPic($('.ywy-gg'))
                }
                erp.closeLoadPercent($('.ywy-gg'))
            },function (data) {
                console.log(data)
                erp.closeLoadPercent($('.ywy-gg'))
            })
        }
        getNoticeFun()
        function pageFun() {
            if($scope.noticeCount<1){
                return
            }
            $(".page-num").jqPaginator({
                totalCounts: $scope.noticeCount,//设置分页的总条目数
                pageSize: $scope.pageSize-0,//设置每一页的条目数
                visiblePages: 5,//显示多少页
                currentPage: $scope.pageNum-0,
                activeClass: 'active',
                prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
                next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
                page: '<a href="javascript:void(0);">{{page}}<\/a>',
                first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
                last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
                onPageChange: function (n,type) {
                    if(type=='init'){
                        layer.closeAll("loading")
                        return;
                    }
                    $scope.pageNum=n+'';
                    getNoticeFun()
                }
            });
        }
        $scope.showNotFun = function (item) {
            $scope.ggTkFlag = true;
            $('.tk-notice-text').text(item.info);
        }
        var option = {
            backgroundColor: '#fff',
            title: {
                text: '总销售趋势',
                x: '2%',
                padding: 10
            },
            grid: {
                x: '8%',
                y: '17%',
                x2: '10%',
                y2: '10%'
            },
            tooltip: {},
            toolbox : {
                show : true,
                right:'20',
                feature : {
                    magicType : {
                        show : true,
                        type : [ 'line', 'bar' ]
                    },
                    // restore : {
                    //     show : true
                    // },
                    saveAsImage : {
                        show : true,
                        title : '保存为图片',
                        type : 'png',
                        lang : [ '点击保存' ]
                    }
                }
            },
            // legend: {
            //     data:['销量']
            // },
            xAxis: {
                data: [],
                name:'月份'
            },
            yAxis: {
                type : 'value',
                name:'金额 (万美元)'
            },
            series: [{
                name: '销量',
                type: 'bar',
                data: [],
                itemStyle: {
                    normal: {
                        color:'#4A90E2',
                        lineStyle:{  
                            color:'#4A90E2'
                        },
                        label: {
                            show: true, //开启显示
                            position: 'top', //在上方显示
                            textStyle: { //数值样式
                                color: 'black',
                                fontSize: 16
                            }
                        }
                    }
                },
            }],
            //配置样式
            itemStyle: {   
                normal:{
                    color: function (params){
                        var colorList = ['#4A90E2','#4A90E2'];
                        return colorList[params.dataIndex];
                    }
                },
                //鼠标悬停时：
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        };
        console.log(erp.isAdminLogin())
        if (erp.isAdminLogin()) {
           option.title = {
               text: '总销售趋势'
           }
        } else {
            option.title = {
                text: '个人销售额'
            }
        }
        myChart.showLoading(); //加载动画
        erp.postFun('erp/erphomepage/getMonthOrderSell',{},function (data) {
            console.log(data)
            var monObj = data.data.data;
            for(var k in monObj){
                monthArr.push(k)
                xseArr.push(monObj[k])
            }
            console.log(monthArr)
            console.log(xseArr)
            myChart.setOption({ //加载数据图表
                xAxis : {
                    data : monthArr
                },
                series : [ {
                    data : xseArr
                } ]
            });
            myChart.hideLoading();//关闭动画
            console.log(monObj)
        },function (data) {
            console.log(data)
            myChart.hideLoading();//关闭动画
        })
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }])
    //查看差价
    app.controller('ViewTheDifferenceCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        $scope.ParentOrderNum = '';
        $scope.url = '';
        $scope.SubClick = function () {
            if(!$scope.ParentOrderNum){
                layer.msg('请输入母订单号！')
            }else {
                var data = {
                    shipmentsOrderId:$scope.ParentOrderNum,
                };
                layer.load(2);
                erp.postFun('app/order/exportCJOrderExcel',data,function(data){
                    layer.closeAll('loading');
                    if(data.data.statusCode == 200){
                        layer.msg('导出成功！')
                        $scope.url = data.data.result
                    }else{
                        if(data.data.message ==''){
                            layer.msg('导出失败！')
                        }else{
                            layer.msg(data.data.message)
                        }
                       
                    }
                },function(n){
                    layer.msg('系统错误！')
                    console.log(n);
                });
            }
        }

    }])
    //usps自动打单
    app.controller('PlaySingleCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location){
        console.log('PlaySingleCtrl');

        $scope.submitMdd=function(){
            var code = $('#mddSearch').val();
            var data ={
                "shipId":code
            }
            console.log(data);
            erp.postFun2('setUspsList.json',JSON.stringify(data),function(data){
                console.log(data);
                if(data.data.result=='ok'){
                    layer.msg('提交成功');
                }else{
                    layer.msg('提交失败');
                }
            },function(){});
        }
        $scope.checkFun=function(){
            erp.postFun2('getUspsJindu.json',{},function(data){
                console.log(data);
                var result= data.data;
                $scope.result = result;
            },function(){})
        }

    }]);


    app.directive('renderFinish', ['$timeout', function ($timeout) {      //renderFinish自定义指令
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function() {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        };
    }]);
    //自动生成发票
    app.controller('AutomaticInvoicingCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location){
        console.log('AutomaticInvoicingCtrl');
        //$('.right-bar').find('.show2').removeClass('show2').addClass('hide2').siblings('.hide2').removeClass('hide2').addClass('show2');
        $scope.$on('ngRepeatFinished', function(){
            $scope.triggleFirst();
        });
        $scope.triggleFirst=function(){
            console.log('加载完毕');
            $scope.Invoice.billFromCountry='China';
            $scope.Invoice.billFromCountryCode='CN';
            $('#billFromCountry').val('China#CN');
            //var first = $('.nameListWrap').find('.list-tr').eq(0);
            //first.addClass('act').trigger("click");
        };
        //获取国家
        getCountryList();
        function getCountryList(){
            erp.getFun('app/account/countrylist', function (n) {
                $scope.countrylist = JSON.parse(n.data.result);
                console.log($scope.countrylist);
                // $scope.country = $scope.countrylist[236];
            }, function(n){
                console.log(n);
            });
        }
        function uuid(len, radix) {
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var uuid = [], i;
            radix = radix || chars.length;

            if (len) {
                // Compact form
                for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
            } else {
                // rfc4122, version 4 form
                var r;

                // rfc4122 requires these characters
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';

                // Fill in random data.  At i==19 set the high bits of clock sequence as
                // per rfc4122, sec. 4.1.5
                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random()*16;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }

            return uuid.join('');
        }
        //生成发票arr
        var uuid = "CJ"+uuid(8,10);
        console.log(uuid);
        var date = new Date();
        var time = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes();
        var Invoice={
            id:uuid,
            createDate:time,
            payment:"",
            billToName:'',
            billToContactTel:'',
            billToAddress:'',
            billToCity:"",
            billToProvince:"",
            billToPostcode:'',
            billToCountry:'',//United States of America (the)#US
            billToCountryCode:'',//United States of America (the)#US
            billToVatNumber:'',
            billFromName:"Yiwu Cute Jewelry C., Ltd.",
            billFromContactTel:"+8618067627100",
            billFromAddress:" #70383 5th Street, 5th Floor, Gate 97, District 5, Futian Market",
            billFromCity:"Yiwu",
            billFromProvince:"Zhejiang",
            billFromPostcode:"322000",
            billFromCountry:"",
            billFromCountryCode:'',
            productList:[],
            totalCount:0,
            totalWeight:0,
            totalPrice:0,
            logistic:'',
            logisticPrice:0,
            hasZhekou:false
        };
        console.log(Invoice);
        $scope.Invoice = Invoice;

        //打开新增
        $scope.addFun=function(){
            if($scope.Invoice.billToCountryCode==''){
                layer.msg('Please select billToCountry');
            }else if($scope.Invoice.billFromCountryCode==''){
                layer.msg('Please select billFromCountry')
            }else{
                $('.zzc1').show();
                $('#searchInput').val('');
            }
        };
        $scope.closeAdd=function(){
            $('.zzc1').hide();
        };
        //确认新增商品
        $scope.productType = ''
        $scope.addProduct=function(){
            var sku = $('#searchInput').val();
            if(sku==''){
                layer.msg('Please enter sku');
            }else if($scope.Invoice.billToCountryCode==''){
                layer.msg('Please select billToCountry');
            }else{
                var data ={
                    "flag":"0",
                    "status":"3",
                    "pageNum":"1",
                    "pageSize":"20",
                    "filter01":"SKU",
                    "filter02":sku,
                    "filter03":"",
                    "filter04":"",
                    "filter05":"",
                    "filter06":"",
                    "filter21":"",
                    "filter22":"",
                    "filter23":"",
                    "filter24":"",
                    "filter11":"",
                    "filter12":"",
                    "autFlag":"01",
                    "chargeId":"",
                    "flag2":"",
                }

                if ($scope.productType) data = Object.assign(data, { optType: $scope.productType })
                erp.load();
                erp.postFun('pojo/product/list',JSON.stringify(data),function(data){
                    erp.closeLoad();
                    if(data.data.statusCode=='200'){
                        var result = JSON.parse(data.data.result);
                        if(result.ps.length==0){
                            layer.msg('未找到商品，请检查SKU');
                        }else{
                            layer.msg('查询成功');
                            var sp =result.ps[0];
                            console.log(sp);
                            var data = {
                                id:sp.id,
                                Description:sp.nameEn,
                                count:1,
                                weight:parseFloat(sp.packWeight)/1000,
                                sku:sku,
                                price:parseFloat(sp.sellPrice),
                                propertyKey:sp.propertyKey
                            };
                            $scope.Invoice.productList.push(data);
                            console.log($scope.Invoice);
                            //$scope.Invoice.totalCount+=1;
                            $scope.changeCount();
                            //$scope.changeWeight();
                            //$scope.Invoice.totalWeight+=parseFloat(sp.packWeight);
                            $('.zzc1').hide();
                        }
                    }
                },function(){
                    erp.closeLoad();
                    layer.msg('Network error, please try again later');
                })
            }
        };
        //选择支付方式
        $('#payment').change(function(){
            var val = $(this).val();
            console.log(val);
            if(val!=''){
                $scope.Invoice.payment=val;
                //$scope.Invoice.billToCountryCode=val.split('#')[1];
            }
            $scope.$apply();
        });
        //选择billTo国家
        $('#billToCountry').change(function(){
            var val = $(this).val();
            console.log(val);
            if(val!=''){
                $scope.Invoice.billToCountry=val.split('#')[0];
                $scope.Invoice.billToCountryCode=val.split('#')[1];
            }
            $scope.$apply();
        });
        //选择billFrom国家
        $('#billFromCountry').change(function(){
            var val = $(this).val();
            console.log(val);
            if(val!=''){
                $scope.Invoice.billFromCountry=val.split('#')[0];
                $scope.Invoice.billFromCountryCode=val.split('#')[1];
            }
            $scope.$apply();
        });

        //进入编辑
        $scope.gotoEdit=function(){
            $('.right-bar').find('.show2').removeClass('show2').addClass('hide2').siblings('.hide2').removeClass('hide2').addClass('show2');
            $('.right-bar').find('.show3').css("display",'table-cell');
            $('.setzkj').show();
        };
        //修改count
        $scope.changeCount=function(ev, item){
            var sum = 0;
            var total = 0;
            var sum2=0;
            if (ev) {
                //item.count = ev.target.value ? +ev.target.value : 0;
            }
            setTimeout(() => {
                $scope.Invoice.productList.forEach(ele => {
                    sum += ele.count || 0;
                    total+=ele.count * ele.price;
                    sum2 += ele.weight*ele.count || 0;
                });
                $scope.Invoice.totalCount = sum;
                $scope.Invoice.totalPrice = total;
                $scope.Invoice.totalWeight = sum2;
                getLogistic();
                //console.log($scope.Invoice);
                $scope.$apply();
            }, 300);
        };
        //修改weight
        $scope.changeWeight=function(ev, item){
            var sum = 0;
            if (ev) {
                item.weight = ev.target.value ? +ev.target.value : 0;
            }
            setTimeout(() => {
                $scope.Invoice.productList.forEach(ele => {
                    sum += ele.weight*ele.count || 0;
                });
                $scope.Invoice.totalWeight = sum;
                console.log($scope.Invoice.totalWeight);
                getLogistic();
                $scope.$apply();
            }, 300);
        };

        function getLogistic(){
            //console.log($scope.Invoice);
            $scope.Invoice.hasZhekou=false;
            var sendData={};
            sendData.country=$scope.Invoice.billToCountryCode;
            sendData.area=$scope.Invoice.billFromCountryCode;
            sendData.enName='';
            sendData.weight=$scope.Invoice.totalWeight*1000;
            sendData.character='';
            var list=[];
            $.each($scope.Invoice.productList,function(i,v){
                var k = v.propertyKey;
                if(list.indexOf(k)==-1){
                    list.push(k);
                }
            });
            //console.log(list);
            $.each(list,function(i,v){
                if(i==0){
                    sendData.character+=v;
                }else{
                    sendData.character+=','+v;
                }
            });
            console.log(sendData);
            erp.postFun2("lc/erplogistics/getFreight",JSON.stringify(sendData), function (data) {
                console.log(data);
                if (data.status == 200) {
                    if (data.data.length == 0) {
                        //该国家无法到达或者货物受限
                        layer.msg("该国家无法到达或货物受限");
                    } else {
                        //$scope.Invoice.logisticList = data.data;
                        $scope.Invoice.logisticList = data.data;
                        console.log(data.data);
                    }
                }
            }, function (data) {
                layer.msg("计算失败");
            })
        }


        function getWuliu(){
            $scope.Invoice.logisticPrice=0;
            $scope.Invoice.logistic='';
            var sendJson = {};
            sendJson.countryCode = $scope.Invoice.billToCountryCode;
            sendJson.productList = [];
            $.each( $scope.Invoice.productList,function(i,v){
                var data = {
                    "ID": v.id,
                    "itemcount": v.count
                };
                sendJson.productList.push(data);
            });
            sendJson.productList = JSON.stringify(sendJson.productList);
            //console.log(sendJson);
            sendJson = JSON.stringify(sendJson);
            erp.postFun('app/buyOrder/getLogisticList', sendJson, function (data) {
                //console.log(data);
                if (data.data.code == 200) {
                    //console.log(data.data);
                    var priceList = data.data.logisticList;
                    //$scope.wuliuway = $scope.wuliulist[3];
                    if (priceList.length == 0) {
                        layer.msg('There is no shipping method to this country currently.');
                        // $scope.country = $scope.countrylist[236];
                        // getShipMethods();
                    }
                    $scope.Invoice.logisticList=priceList;
                    console.log($scope.Invoice.logisticList);

                }else if(data.data.code == 111){
                    $scope.islogistic = true;
                }else {
                    layer.msg('Get shipping methods err. ');
                }
            },function(n){
                console.log(n);
            });
        }
        //选择物流
        $('#selectWuliu').change(function(){
            var target = $(this);
            var val = target.val();
            console.log(val);
            if(val!=''){
                var logisticName = val.split('#')[0];
                var price  = val.split('#')[1];
                $scope.Invoice.logisticPrice=parseFloat(price);
                $scope.Invoice.logistic=logisticName;
            }
            $scope.$apply();
        });

        //打开设置折扣价
        $scope.setzzjFun=function(totalPrice,logisticPrice){//Invoice.totalPrice+Invoice.logisticPrice
            console.log(totalPrice,logisticPrice);
            if($scope.Invoice.totalPrice==0){
                layer.msg('Please increase the goods.')
            }else if($scope.Invoice.logisticPrice==0){
                layer.msg('Please select logistics')
            }else{
                $('.zzc2').show();
                var old = parseFloat((totalPrice+logisticPrice).toFixed(2));
                $('#oldPrice').val(old);
            }

        };
        //确认折扣价
        $scope.surezkjFun=function(){
            var price = $('#zkjInput').val();
            $scope.Invoice.discount=price;
            $scope.Invoice.hasZhekou=true;
            $('.zzc2').hide();

        }
        $scope.closezzjFun=function(){
            $('.zzc2').hide();
        }

        $scope.saveFun=function(){
            var payment = $('#payment').val();
            if(payment==''){
                layer.msg('请选择支付方式');
            }else{
                $('.right-bar').find('.show2').removeClass('show2').addClass('hide2').siblings('.hide2').removeClass('hide2').addClass('show2');
                $('.right-bar').find('.show3').css("display",'none');
                $('.setzkj').hide();
            }

        };
        $scope.deleteFun=function(index){
            var sum = 0;
            var total = 0;
            var sum2=0;
            $scope.Invoice.productList.splice(index,1);
            console.log($scope.Invoice.productList);
            $scope.Invoice.productList.forEach(ele => {
                sum += ele.count || 0;
                total+=ele.count * ele.price;
                sum2 +=  ele.weight*ele.count || 0;
            });
            $scope.Invoice.totalCount = sum;
            $scope.Invoice.totalPrice = total;
            $scope.Invoice.totalWeight = sum2;
            getWuliu();
            //console.log($scope.Invoice);
            //$scope.$apply();
        };
        //提交生成pdf
        $scope.submitFun=function(){
            var text = document.getElementById('mainWrap').innerHTML;
            text = text.replace('ng-repeat="country in countrylist"','');
            text = text.replace('class="editBtn show2"','class="editBtn hide2"');
            text = text.replace('ng-repeat="(item1,product) in Invoice.productList track by item1"','');
            text = text.replace('ng-repeat="wl in Invoice.logisticList"','');
            text = text.replace('ng-hide','hide2');
            text = text.replace('style="width: 1120px;"','style="width: 1000px;"');
            var html = '<html lang="en" id="right"><head><meta charset="UTF-8"><title></title></head><body>'+text+'</body></html>';
            console.log(html);
            var data = {
                "htmlFile":html
            };
            erp.postFun('tool/pdf/downloadPdf', JSON.stringify(data),function (data) {
                console.log(data);
                if(data.data.statusCode == 200){
                    $scope.url = 'https://'+data.data.result;
                    $('.zzc3').show();
                }
            },function (res) {

            })

        }
        $scope.closezzc3=function(){
            $('.zzc3').hide();
        }
    }]);

    //检测ups原因
    app.controller('CheckUpsCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location){
        console.log('CheckUpsCtrl');
        $scope.serachInfo='';
        $scope.searchFun=function(){
            var sendData={
                id:$scope.serachInfo
            };
            erp.load();
            erp.postFun('order/order/checkOrderLogistics',JSON.stringify(sendData),function(data){
                erp.closeLoad();
                console.log(data.data);
                if(data.data.statusCode=='200'){
                    var message = data.data.message;
                    if(message !=''){
                        $scope.flag=1;
                        $scope.message = message;
                    }else{
                        $scope.flag=2;
                        $scope.wuliuList = data.data.result
                    }
                }else{
                    layer.msg('查询失败')
                }
            },function(){
                layer.msg('网络错误');
                erp.closeLoad();
            });
        }
    }]);

    app.controller('salesVolumeBySku', ['$scope', 'erp', '$location', function ($scope, erp, $location){
        console.log('salesVolumeBySku');
        $scope.sku='';
        $scope.dataList;
        $scope.dcflag=false;
        $scope.salesMount = 0
        $scope.salesAmount = 0
        $("#endTime").val(getNowFormatDate());
        $("#beginTime").val(getNowFormatDate());
        function getNowFormatDate() {
            var date = new Date();
            var seperator1 = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate;
            return currentdate;
        }
        $scope.searchFun=function(){
            if($("#beginTime").val()==''||$("#endTime").val()==''||$scope.sku==''){
                layer.msg('时间范围和sku为必填!');
                return;
            }
            var sendData={
                sku:$scope.sku,
                beginTime:$("#beginTime").val(),
                endTime:$("#endTime").val()
            };
            erp.load();
            console.log(JSON.stringify(sendData));
            erp.postFun('tool/sku/searchSkuDailySales',JSON.stringify(sendData),function(data){
                erp.closeLoad();
                console.log(data);
                $scope.salesMount = 0
                $scope.salesAmount = 0
                $scope.dataList = []
                if(data.data.statusCode=='200'){
                    var message = data.data.message; 
                    $scope.dataList=data.data.result;
                    for(i=0;i<$scope.dataList.length;i++){
                        $scope.salesMount += $scope.dataList[i].QUANTITY
                        $scope.salesAmount +=  $scope.dataList[i].QUANTITY * $scope.dataList[i].PRICE 
                        $scope.salesAmount = Math.round($scope.salesAmount * 100) / 100.
                    }
                    console.log($scope.salesAmount)
                    if(message !=''){
                        $scope.flag=1;
                        $scope.message = message;
                    }else{
                        $scope.flag=2;
                        $scope.wuliuList = data.data.result
                    }
                }else{
                    layer.msg('查询失败,失败原因:'+data.data.message);
                }
            },function(){
                layer.msg('网络错误');
                erp.closeLoad();
            });
        }
        $scope.dcFun=function(){
            if($("#beginTime").val()==''||$("#endTime").val()==''||$scope.sku==''){
                layer.msg('时间范围和sku为必填!');
                return;
            }
            var sendData={
                sku:$scope.sku,
                beginTime:$("#beginTime").val(),
                endTime:$("#endTime").val()
            };
            erp.load();
            console.log(JSON.stringify(sendData));
            erp.postFun('tool/sku/exportExcel',JSON.stringify(sendData),function(data){
                erp.closeLoad();
                console.log(data);
                if(data.data.statusCode=='200'){ 
                    $scope.hrefsrc = data.data.result;
                    $scope.dcflag=true;
                }else{
                    layer.msg('查询失败,失败原因:'+data.data.message);
                }
            },function(){
                layer.msg('网络错误');
                erp.closeLoad();
            });
        }
        //关闭
		$scope.closeatc = function () {
			$scope.dcflag = false;
		}
    }]);

    app.controller('logisticsSelectCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        function getData(){
            layer.load(2);
            erp.postFun('pojo/procurement/getExpLogistics',{},function(res){
                layer.closeAll('loading');
                var Disable = res.data;
                var data = {
                    param:$scope.userinfo,
                    status:""
                };
                layer.load(2);
                erp.postFun('app/erplogistics/queryLogisticMode',data,function(data){
                    layer.closeAll('loading');
                    var channelList = data.data.result;
                    for(var i=0;i<Disable.length;i++){
                        for(var j=0;j<channelList.length;j++){
                            if(channelList[j].nameen == Disable[i].logisticsName){
                                console.log(channelList[j].nameen)
                                channelList[j].flag = '1';
                            }
                        }
                    }
                    console.log(channelList)
                    $scope.channelList = channelList;
                },function(n){
                    layer.msg('系统错误！');
                    console.log(n);
                });
            },function(n){
                layer.msg('系统错误！');
                console.log(n);
            });

        }
        getData();
        $scope.usersearch = function () {
            getData();
        }
        $scope.tingyong = function (item) {
            console.log(item)
            $scope.isTingyong = true;
            $scope.queding = function(){
                layer.load(2);
                var data = {
                    logisticsName:item.nameen
                }
                erp.postFun('pojo/procurement/expLogistics',data,function(data){
                    layer.msg('操作成功！');
                    $scope.isTingyong = false;
                    getData();
                    layer.closeAll('loading');
                },function(n){
                    layer.msg('系统错误！');
                    console.log(n);
                });
            }
        }
    }])

    //将excel上传至出库
    app.controller('chukuCtrl', ['$scope', 'erp', '$location','$http', function ($scope, erp, $location,$http){
        console.log('chukuCtrl');

        $scope.pageNum = '1';
        $scope.pageSize = '20';
        
        $scope.searchFun=function(){
            $scope.pageNum = '1';
            getExcelList();
        }
        //列表
        getExcelList();
        function getExcelList(){
            var start = $('#c-data-time2').val();
            if(start !=''){
                start+=' 00:00:00';
            }
            var end = $('#cdatatime3').val();
            if(end!=''){
                end+=' 23:59:59';
            }
            var sendData = {
                orderId: $scope.searchOrderID || '',
                track: $scope.searchTrackNo || '',
                startTime: start,
                endTime: end,
                pageSize: $scope.pageSize,
                pageNum: $scope.pageNum
            }
            erp.load();
            erp.postFun('erp/orderOperationRecords/queryOrderOperationRecordList',JSON.stringify(sendData),function(data){
                erp.closeLoad();
                if(data.data.statusCode=='200'){
                    var result = data.data.result;
                    // $scope.orderList = result;
                    $scope.totalCount = result.totalCount;
                    $scope.orderList = result.list;
                    pageFun();
                }
                
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
                    $scope.pageNum = n;
                    getExcelList();
                }
            });
        }
        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            $scope.pageSize = pagesize;
            $scope.pageNum = 1;
            getExcelList();
        }
        $scope.pagenumchange = function () {
            if ($scope.pageNum == "" || $scope.pageNum == null || $scope.pageNum == undefined){
                layer.msg("错误页码");
                return;
            }
            if ($scope.pageNum == 0){
                $scope.pageNum = 1;
            }
            var pagenum = Number($scope.pageNum);
            var totalpage = Math.ceil($scope.totalCount / $scope.pageSize);
            if (pagenum > totalpage) {
                layer.msg('错误页码');
                $scope.pageNum = '1';
            } else {
                getExcelList();
            }
        };

        //下载模板
        $scope.downLoadFun=function(){
            var url = $('<a id="downLoadBtn" href="http://cc-west-usa.oss-us-west-1.aliyuncs.com/15255648/4516741933996.xlsx" download=""></a>');
            console.log(url);
            url.get(0).click();
        }

        $scope.uploadFun=function(){
            $('#uploadExcel').trigger('click');
        }
        $('#uploadExcel').change(function(e){
            // var formData = new FormData($("#excel-upload")[0]);
            // var file = e.target.files[0]
            var oData = new FormData(document.forms.namedItem("fileinfo"));
            oData.append('file',e.target.files[0]);
            oData.append("CustomField", "This is some extra data");
            // var formData = new FormData($("#excel-upload")[0]);
            
            console.log(oData);
            // var sendData = {
            //     file: formData
            // }
            // console.log(sendData);
            // erp.load();
            erp.upLoadImgPost('erp/order/uploadDataByExcel',oData,function(data){
                console.log(data.data);
                if(data.data.statusCode=='200'){
                    layer.msg('上传成功');
                    getExcelList();
                }else{
                    layer.msg(data.data.message); 
                }
                $('#uploadExcel').val('');
            },function(){

            })
            erp.postFun('processOrder/orderTools/uploadDataByExcel',oData,function(data){
                console.log(data)
            })
        });
    }]);
})()

