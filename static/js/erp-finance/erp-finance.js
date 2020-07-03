(function () {
    //分页
    function pageFun($scope, pagechange) {
        $(".pagination1").jqPaginator({
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
                if (type == 'init') return;
                pagechange(n);
            }
        });
    }

    var chineseReqG = /[\u4E00-\u9FA5]/g;
    var app = angular.module('erp-finance', []);
    //erp财务--收入管理
    //总销售额
    app.controller('allmoneyCon', ['$scope', 'erp', function ($scope, erp) {
        console.log('incomeshouldCtrl')
        /*************财务********应收金额********BEGIN*************/
        $scope.pagesize = '20';
        $scope.pagenum = '1';
        $scope.pagenumarr = [10, 20, 30, 50];
        $scope.status = ["未付款", "已付款"];
        $scope.clientState = true;
        $scope.customState = false;
        $scope.sort = 'MERCHANT_NUMBER';
        $scope.day = 0;
        $scope.dataList = [];
        $scope.userinfo = '';
        // ----------------------------------------- 19-06-17 按群搜索
        $scope.ownerName = '';
        $scope.$watch('ownerName', function (val) {
          $scope.ownerName = val;
          getList();
        });
        getAllSalesman();
        function getAllSalesman() {
            erp.postFun("app/account_erp/getAllSalesman", {}, function (data) {

                var data = JSON.parse(data.data.result);
                console.log(data);
                $scope.ywList = data;
            }, function (err) { })
        }
        // -----------------------------------------
        $scope.clientClick = function (state) {
            console.log(state)
            if (state == false) {
                $scope.clientState = !$scope.clientState;
                $scope.customState = !$scope.customState;
                $scope.sort = 'MERCHANT_NUMBER';
                getList();
            }
        }
        $scope.customClick = function (state) {
            console.log(state)
            if (state == false) {
                $scope.clientState = !$scope.clientState;
                $scope.customState = !$scope.customState;
                $scope.sort = 'ACCOUNTID,b.owner_name';
                getList();
            }

        }

        function getList() {
            var data = {
                limit: $scope.pagesize,
                page: $scope.pagenum,
                sort: $scope.sort,
                day: $scope.day,
                name: $scope.userinfo,
                ownerName: $scope.ownerName,
                status: '1',
                beginDate: $('#txtBeginDate').val(),
                endDate: $('#txtEndDate').val()
            }
            erp.postFun("app/finance/getTotalSales", data, function (data) {
                layer.closeAll("loading")
                console.log(data)
                $scope.totalSales = data.data.totalSales;
                $scope.realSales = data.data.realSales;
                $scope.dataList = data.data.data;
                $scope.totalNum = data.data.count;
                $scope.totalpage = function () {
                    return Math.ceil(n.data.totalNum / $scope.pagesize)
                }
                pageFun();
            }, function (data) {
                layer.closeAll("loading")
            },{layer:true});
        }

        getList();
        $scope.lastWeek = function (num) {
            // console.log('aaaaa')
            $scope.day = num;
            $scope.pagenum = '1';
            $('#txtBeginDate').val('');
            $('#txtEndDate').val('');
            getList();
        }
        $scope.searchFun = function () {
            $scope.pagenum = '1';
            getList();
        }
        //搜索客户
        $scope.usersearch = function () {
            $scope.pagenum = 1;
            //$scope.day = '';
            $('.datatime-screen a').removeClass('active');
            getList();
        }
        //按下enter搜索
        $scope.enterSearch = function (event) {
            if (event.keyCode === 13 || event.keyCode === 108) {
                $scope.pagenum = 1;
                getList();
            }
        }
        $(".datatime-screen a").click(function () {
            $(".datatime-screen a").removeClass("active");
            $(this).addClass("active");
        });
        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            $scope.pagenum = 1;
            getList();
        }
        $scope.pagenumchange = function () {
            console.log($scope.pagenum % 1)
            $scope.pagenum = $(".goyema").val() - 0;
            if ($scope.pagenum < 1 || $scope.pagenum > $scope.totalpage()) {
                layer.msg('错误');
                $(".goyema").val(1)
            } else {
                getList();
            }
        }

        //分页
        function pageFun() {
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
                    $scope.pagenum = n;
                    getList();
                }
            });
        }
    }])
    //代收款项
    app.controller('incomeshouldCtrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('incomeshouldCtrl')
        $scope.pagesize = '20';
        $scope.pagenum = '1';
        $scope.pagenumarr = [10, 20, 30, 50];
        $scope.status = ["未付款", "已付款"];
        $scope.clientState = true;
        $scope.customState = false;
        $scope.sort = 'MERCHANT_NUMBER';
        $scope.day = 0;
        $scope.dataList = [];
        $scope.userinfo = '';
        $scope.clientClick = function (state) {
            console.log(state)
            if (state == false) {
                $scope.clientState = !$scope.clientState;
                $scope.customState = !$scope.customState;
                $scope.sort = 'MERCHANT_NUMBER';
                getList();
            }
        }
        $scope.customClick = function (state) {
            console.log(state)
            if (state == false) {
                $scope.clientState = !$scope.clientState;
                $scope.customState = !$scope.customState;
                $scope.sort = 'ACCOUNTID,b.owner_name';
                getList();
            }

        }

        function getList() {
            var data = {
                limit: $scope.pagesize,
                page: $scope.pagenum,
                sort: $scope.sort,
                day: $scope.day,
                status: '2',
                name: $scope.userinfo,
                ownerName: $scope.ownerName,
                beginDate: $('#txtBeginDate').val(),
                endDate: $('#txtEndDate').val()
            }
            erp.postFun("app/finance/getTotalSales", data, function (data) {
                layer.closeAll("loading")
                console.log(data)
                $scope.totalSales = data.data.totalSales;
                $scope.realSales = data.data.realSales;
                $scope.dataList = data.data.data;
                $scope.totalNum = data.data.count;
                $scope.totalpage = function () {
                    return Math.ceil($scope.totalNum / $scope.pagesize)
                }
                pageFun();
            }, function (data) {
                layer.closeAll("loading")
            },{layer:true});
        }

        getList();
        $scope.lastWeek = function (num) {
            $scope.day = num;
            $scope.pagenum = '1';
            $('#txtBeginDate').val('');
            $('#txtEndDate').val('');
            getList();
        }
        //搜索客户
        $scope.usersearch = function () {
            $scope.pagenum = 1;
            $('.datatime-screen').find('a').removeClass('active');
            getList();
        }
        //按下enter搜索
        $scope.enterSearch = function (event) {
            if (event.keyCode === 13 || event.keyCode === 108) {
                $scope.pagenum = 1;
                getList();
            }
        }
        $(".datatime-screen a").click(function () {
            $(".datatime-screen a").removeClass("active");
            $(this).addClass("active");
        });
        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            $scope.pagenum = 1;
            getList();
        }
        $scope.pagenumchange = function () {
            console.log($scope.totalpage());
            if ($scope.pagenum < 1 || $scope.pagenum > $scope.totalpage()) {
                layer.msg('错误页码');
                // $(".goyema").val(1);
                $scope.pagenum = '1';
            } else {
                getList();
            }
        }

        //分页
        function pageFun() {
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
                    $scope.pagenum = n;
                    getList();
                }
            });
        }
    }])
    //erp财务--客户钱包管理
    app.controller('walletcuslistdelCtrl', ['$scope','$location', 'erp','$routeParams','$timeout', function ($scope, $location, erp,$routeParams, $timeout) {
        console.log('walletcuslistdelCtrl')
        var bs = new Base64();
        var erpLoginName = bs.decode(localStorage.getItem('erploginName') == undefined ? '' : localStorage.getItem('erploginName'));
        $scope.pageNum = '1';
        $scope.pageSize = '20';
        $scope.platformWithDrawal = $routeParams.type || '1' // 1 CJ  2 COD
        getWalletUser();
        //绑定点击事件.根据查询应收金额列表
        $scope.lastWeek = function (num) {
            day.day = num;
            getWalletUser();
        }
        $(".datatime-screen a").click(function () {
            $(".datatime-screen a").removeClass("active");
            $(this).addClass("active");
        });

        $scope.getSpecifiedPage = function(){
            var pagenum = Number($scope.pageNum);
            var totalpage = Math.ceil($scope.totalNum / $scope.pageSize);
            if (pagenum > totalpage) {
                layer.msg('错误页码');
                $scope.pageNum = '1';
            } else {
                getWalletUser();
            }
        }

        $scope.getPrice = function(item){// 获取余额
            const type = $scope.platformWithDrawal
            let res = (item.balance || 0) + item.noWithdrawalAmount
            if(type == 2) res = item.codbalance || 0
            return res.toFixed(2)
        }

        $scope.getWithdrawPrice = function(item){ // 获取钱包可提现余额
            const type = $scope.platformWithDrawal
            let res = item.balance || 0
            if(type == 2) res = item.codbalance || 0
            return res.toFixed(2)
        }
        
        // console.log($scope.platformWithDrawal,'22222222222222222222222')
        $scope.changePlatform = function(type){
            $scope.platformWithDrawal = type
            getWalletUser()
        }
        function getWalletUser() {
            erp.postFun("app/wallet/getWalletList", JSON.stringify({
                accountName: $scope.userinfo,
                page: $scope.pageNum,
                limit: $scope.pageSize,
                accountType:$scope.platformWithDrawal
            }), function (data) {
                // console.log(data);
                $scope.money = data.data.money;
                $scope.walletUserList = data.data.list;
                console.log($scope.walletUserList);
                $scope.totalNum = data.data.count;
                // if ($scope.totalNum == 0) return;
                pageFun($scope, function (page) {
                    $scope.pageNum = page + '';
                    erp.postFun("app/wallet/getWalletList", JSON.stringify({
                        page: $scope.pageNum,
                        limit: $scope.pageSize,
                        accountType:$scope.platformWithDrawal
                    }), function (data) {
                        $scope.walletUserList = data.data.list;
                    });
                });
            }, function (data) {
                // alert("查询失败");
            });
        }

        $scope.usersearch = function () {
            $scope.pageNum = '1';
            getWalletUser();
        }
        $scope.getPageSize = function () {
            $scope.pageNum = '1';
            getWalletUser()
        }
        $scope.enterEvent = function (e) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {
                getWalletUser();
            }
        }
        $scope.frozenAccount = function (item, index) {
            $scope.frozenAccountFlag = true;
        }
        $scope.Deduction = function (item, index) {
            layer.prompt({title: `请输入密码，并确认`, formType: 1}, function(pass, index2){
            
            if(pass === 'cjcute2015') {
                $timeout(() =>{
                    $scope.DeductionFlag = true;
                    $scope.item = item;
                    $scope.DeductionMoney = '';
                    $scope.DeductionType = '';
                    layer.close(index2);
                })
                
            } else {
                layer.msg('密码错误')
                layer.close(index2);
            }
            });
            
        }
        $scope.isadmin = erp.isAdminLogin();
        $scope.isYangkeNv = ['admin', '吴根玉', '艾云斌'].includes(erpLoginName);
        console.log($scope.isadmin)
        $scope.DeductionSub = function () {
            if (!$scope.DeductionMoney) {
                layer.msg('请输入扣款金额')
            } else if (!$scope.DeductionType) {
                layer.msg('请输入扣款原因')
            } else {
                const url = $scope.platformWithDrawal == 2?'app/wallet/codWithholding':'app/wallet/withholding'
                erp.postFun(url, JSON.stringify({
                    userName: $scope.item.userName,
                    userId: $scope.item.userId,
                    money: $scope.DeductionMoney,
                    type: $scope.DeductionType
                }), function (data) {
                    if (data.data.result) {
                        layer.msg('扣款成功')
                        getWalletUser();
                        $scope.DeductionFlag = false;
                    } else {
                        layer.msg('扣款失败')
                    }
                });
            }
        }
        $scope.returnFun = function (item, index) {
            layer.prompt({title: `请输入密码，并确认`, formType: 1}, function(pass, index2){
                if(pass === 'cjcute2015') {
                    $timeout(() =>{
                        $scope.ReturnFlag = true;
                        $scope.item = item;
                        $scope.ReturnMoney = '';
                        $scope.ReturnType = '';
                        layer.close(index2);
                    })
                } else {
                    layer.msg('密码错误')
                    layer.close(index2);
                }
            });
        }
        $scope.check = function (item, index) {
            $location.path('/erpfinance/billInquiry').search({'userName': item.userName})
        }
        $scope.ReturnSub = function () {
            if (!$scope.ReturnMoney) {
                layer.msg('请输入退款金额')
            } else if (!$scope.ReturnType) {
                layer.msg('请输入退款原因')
            } else {
                const url = $scope.platformWithDrawal == 2?'app/wallet/codRefund':'app/wallet/refund'
                erp.postFun(url, JSON.stringify({
                    userName: $scope.item.userName,
                    userId: $scope.item.userId,
                    money: $scope.ReturnMoney,
                    type: $scope.ReturnType
                }), function (data) {
                    if (data.data.result) {
                        layer.msg('退款成功')
                        getWalletUser();
                        $scope.ReturnFlag = false;
                    } else {
                        layer.msg('退款失败')
                    }
                });
            }
        }

        // 初始化用户钱包
        const initWalletInitObj = {
            initWalletFlag:false, // 弹窗visible
            inputVal:'',
            allChecked:false,
            list:[]
        }
        $scope.walletInitObj = erp.deepClone(initWalletInitObj)
        $scope.initWalletInitObjFun = function(){
            const obj = erp.deepClone(initWalletInitObj)
            obj.initWalletFlag = true
            $scope.walletInitObj = obj
        }
        $scope.searchInitUsers = function(){
            const LoginName = $scope.walletInitObj.inputVal;
            if(!LoginName) return layer.msg('搜索不能为空')
            const load = layer.load(0)
            erp.postFun('app/wallet/getAccountInfoByLonginName', { LoginName }, function(res){
                layer.close(load)
                $scope.walletInitObj.list = res.data.data || []
                $scope.walletInitObj.allChecked = false
            })
        }

        // 初始化钱包搜索
        $scope.walletInitInputValChange = function(value){
            console.log('inputVal', value)
        }

        // // 初始化钱包列表全选
        // $scope.walletInitCheckboxChange = function(checked){
        //     console.log('checked', checked)
        //     let list = $scope.walletInitObj.list;
        //     const arr = list.map(_=>({ ..._, checked }))
        //     $scope.walletInitObj.list = arr
        // }

        // 用户选择单条确定是否全选
        $scope.itemWalletInitCheckboxChange = function(){
            console.log($scope.walletInitObj.list)
            let list = $scope.walletInitObj.list, len = list.length, allChecked = false;
            const arr = $scope.walletInitObj.list.filter(_ => _.checked)
            const checkedCount = arr.length
            if(checkedCount >= len) allChecked = true
            $scope.walletInitObj.allChecked = allChecked
        }

        // onOk 确定初始化
        $scope.initOkWalletInfo = function(){
            const users = $scope.walletInitObj.list.filter(_ => _.checked)
            if(users.length <= 0) return layer.msg('未选择用户')
            if(users.length > 1) return layer.msg('一次只能选择一个用户进行初始化')
            const user = users[0]
            const userId = user ? user.userId : ''
            const load = layer.load(0)
            erp.postFun('app/wallet/initialWalletInfo', { userId }, function(res){
                layer.close(load)
                if(!res.data.result) return layer.msg('该用户已存在钱包初始化信息!')
                layer.msg('初始化成功')
                $scope.walletInitObj = erp.deepClone(initWalletInitObj)
            })
        }

    }])
    //erp财务--客户钱包=>流水详情
    app.controller('walletcusdetailCtrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('walletcusdetailCtrl');

    }])
    //erp财务--对账查询
    app.controller('accountqueryCtrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('accountqueryCtrl')


        /*************财务********对账查询********BEGIN*************/
        $scope.status = ["未付款", "已付款"];
        var day = {"day": "0", "beginPage": "1", "limit": "30"};
        //获取应收金额列表(所有状态 已付款/未付款的订单)
        reconciliation();

        //绑定点击事件.根据查询应收金额列表
        $scope.lastWeek = function (num) {
            day.day = num;
            reconciliation();
        }
        $(".datatime-screen a").click(function () {
            $(".datatime-screen a").removeClass("active");
            $(this).addClass("active");
        });

        function reconciliation() {
            erp.postFun("app/money/reconciliation", day, function (data) {
                //              console.log(data.data);
                $scope.reconciliation = data.data.data;
                console.log(data.data.count); //总页数.分页用
            }, function (data) {
                // alert("查询失败");
            });
        }

        /*************财务********对账查询********END*************/
    }])
    //erp财务--已收款项
    app.controller('receivablesCtrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('receivablesCtrl')
        $scope.pagesize = '20';
        $scope.pagenum = '1';
        $scope.pagenumarr = [10, 20, 30, 50];
        $scope.status = ["未付款", "已付款"];
        $scope.clientState = true;
        $scope.customState = false;
        $scope.sort = 'MERCHANT_NUMBER';
        $scope.day = 0;
        $scope.dataList = [];
        $scope.userinfo = '';
        $scope.clientClick = function (state) {
            console.log(state)
            if (state == false) {
                $scope.clientState = !$scope.clientState;
                $scope.customState = !$scope.customState;
                $scope.sort = 'MERCHANT_NUMBER';
                getList();
            }
        }
        $scope.customClick = function (state) {
            console.log(state)
            if (state == false) {
                $scope.clientState = !$scope.clientState;
                $scope.customState = !$scope.customState;
                $scope.sort = 'ACCOUNTID,b.owner_name';
                getList();
            }

        }
        getAllSalesman();
        function getAllSalesman() {
            erp.postFun("app/account_erp/getAllSalesman", {}, function (data) {

                var data = JSON.parse(data.data.result);
                console.log(data);
                $scope.ywList = data;
            }, function (err) { })
        }

        function getList() {
            var data = {
                limit: $scope.pagesize,
                page: $scope.pagenum,
                sort: $scope.sort,
                day: $scope.day,
                name: $scope.userinfo,
                ownerName: $scope.ownerName,
                status: '3',
                beginDate: $('#txtBeginDate').val(),
                endDate: $('#txtEndDate').val()
            }
            erp.postFun("app/finance/getTotalSales", data, function (data) {
                layer.closeAll("loading")
                console.log(data)
                $scope.totalSales = data.data.totalSales;
                $scope.realSales = data.data.realSales;
                $scope.dataList = data.data.data;
                $scope.totalNum = data.data.count;
                $scope.totalpage = function () {
                    return Math.ceil($scope.totalNum / $scope.pagesize)
                }
                pageFun();
            }, function (data) {
                layer.closeAll("loading")
            },{layer:true});
        }

        getList();
        $scope.lastWeek = function (num) {
            $scope.pagenum = '1';
            $scope.day = num;
            $('#txtBeginDate').val('');
            $('#txtEndDate').val('');
            getList();
        }
        //搜索客户
        $scope.usersearch = function () {
            $('.datatime-screen').find('a').removeClass('active');
            $scope.pagenum = 1;
            getList();
        }
        //按下enter搜索
        $scope.enterSearch = function (event) {
            if (event.keyCode === 13 || event.keyCode === 108) {
                $scope.pagenum = 1;
                getList();
            }
        }
        $(".datatime-screen a").click(function () {
            $(".datatime-screen a").removeClass("active");
            $(this).addClass("active");
        });
        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            $scope.pagenum = 1;
            getList();
        }
        $scope.pagenumchange = function () {
            console.log($scope.pagenum % 1)
            // $scope.pagenum = $(".goyema").val() - 0;
            if ($scope.pagenum < 1 || $scope.pagenum > $scope.totalpage()) {
                layer.msg('错误页码');
                // $(".goyema").val(1)
                $scope.pagenum = '1';
            } else {
                getList();
            }
        }

        //分页
        function pageFun() {
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
                    $scope.pagenum = n;
                    getList();
                }
            });
        }
    }])
    //erp财务--已取消订单金额
    app.controller('canceledCtrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('canceledCtrl')
    }])
    //erp财务--退款金额
    app.controller('refundCtrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('refundCtrl')
    }])
    //erp财务--财务支出
    app.controller('cwzcCtrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('财务支出')
        console.log('linshigong')
        var b = new Base64()
        var loginName = b.decode(localStorage.getItem('erploginName'));
        if(loginName=='admin'||loginName=='龙香昀'||loginName=='李金华'){
            $scope.adminFlag = true;
        }else{
            $scope.adminFlag = false;
        }
        //客户页面
        $scope.pagesize = '50';
        $scope.pagenum = '1';
        $scope.totalNum = 0;
        $scope.clickTime = '0';
        console.log(erp.isAdminLogin())
        $scope.isAdminFlag = erp.isAdminLogin()

        function getList() {
            $('#c-zi-ord .c-checkall').attr('src', 'static/image/order-img/multiple1.png');
            erp.load();
            var upData = {};
            if($("#left-time").val()){
                upData.startDate = $("#left-time").val()+' 00:00:00';
                upData.endDate = $("#left-time").val()+' 23:59:59';
            }
            // if($("#right-time").val()){
            //     upData.endDate = $("#right-time").val()+' 23:59:59';
            // }
            if($("#left-time").val()){
                $('.time-span').removeClass('active-color');
                $scope.clickTime = undefined;
            }
            upData.pageNum = $scope.pagenum;
            upData.pageSize = $scope.pagesize;
            upData.inputStr = $scope.searchDdh;
            upData.ri = $scope.clickTime;
            erp.postFun('pojo/linShiGong/linShiGongCaiWuLieBiao', JSON.stringify(upData), con, err)

            function con(data) {
                console.log(data)
                erp.closeLoad();
                if (data.data.statusCode == 200) {
                    var result = JSON.parse(data.data.result);
                    $scope.riGongZi = result.riGongZi;
                    $scope.YueGongZi = result.YueGongZi;
                    console.log(result)
                    $scope.listArr = result.list;
                    console.log($scope.listArr)
                    $scope.totalNum = result.total || 0;
                    console.log($scope.listArr)
                    $scope.totalpage = function () {
                        return Math.ceil(data.data.totalNum / $scope.pagesize)
                    }
                    pageFun();
                }
            }
        }

        getList();
        $('.time-span').eq(0).addClass('active-color')
        $scope.timeClickFun = function (ev,index) {
            $scope.clickTime = index;
            $("#left-time").val('')
            // $("#right-time").val('')
            $('.time-span').removeClass('active-color');
            $('.time-span').eq(index).addClass('active-color')
            $scope.pagenum = '1';
            getList();
        }
        $scope.timeSFun = function () {
            if(!$("#left-time").val()){
                layer.msg('请选择时间')
                return
            }
            $scope.pagenum = '1';
            $('.time-span').removeClass('active-color');
            getList();
        }

        $scope.searchFun = function () {
            $scope.pagenum = '1';
            getList();
        }
        $('.sku-inp').keypress(function (event) {
            if (event.keyCode == 13) {
                $scope.searchFun()
            }
        });

        //分页
        function pageFun() {
            if ($scope.totalNum < 1) {
                return
            }
            $(".pagination2").jqPaginator({
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
                    $scope.pagenum = n+'';
                    getList();
                }
            });
        }

        $scope.changePageSize = function (pagesize) {
            console.log(pagesize)
            $scope.pagenum = '1';
            getList();
        }
        $scope.toSpecifiedPage = function () {
            if ($scope.pagenum > Math.ceil($scope.totalNum / $scope.pagesize)) {
                console.log(Math.ceil($scope.totalNum / $scope.pagesize))
                layer.msg('输入的页码不能大于总页码')
                return
            }
            getList();
        }
        function err() {
            layer.msg('系统异常')
        }
        var tjcwArr = [];
        $scope.qrfkFun = function (item) {
            tjcwArr = [];
            tjcwArr.push({
                "lsgId":item.lingShiGongId,
                "shangBan":item.shangBan+''
            })
            $scope.istjcwFlag = true;
        }
        $scope.sureYzfFun = function () {
            var upJson = {};
            upJson.lsgs = tjcwArr;
            erp.postFun('pojo/linShiGong/tiJiaoDaoYiZhiFu',JSON.stringify(upJson),function (data) {
                console.log(data)
                $scope.istjcwFlag = false;
                layer.msg(data.data.message)
                if (data.data.statusCode==200) {
                    getList();
                }
            },function (data) {
                console.log(data)
            })
        }
        $scope.bulkQrZfFun = function(){
            tjcwArr = [];
            var addyfhCount = 0;
            $('#c-zi-ord .cor-check-box').each(function () {
                if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
                    addyfhCount++;
                    tjcwArr.push({
                        "lsgId":$(this).siblings('.lsg-id-text').text(),
                        "shangBan":$(this).siblings('.lsg-sb-time').text()
                    })
                }
            })
            if (addyfhCount > 0) {
                $scope.istjcwFlag = true;
            } else {
                $scope.istjcwFlag = false;
                layer.msg('请选择订单')
            }
            console.log(tjcwArr)
        }
        //导出
        $scope.daoChuFun = function(){
            // console.log($scope.clickTime)
            // console.log($scope.clickTime==undefined)
            // if($scope.clickTime==undefined){
            //     layer.msg('请点击昨日或者今日')
            //     return
            // }
            // if(!$("#left-time").val()||!$("#right-time").val()){
            //     layer.msg('开始结束时间必选')
            //     return
            // }
            erp.load()
            var upJson = {};
            if($("#left-time").val()){
                upJson.startDate = $("#left-time").val()+' 00:00:00';
            }
            if($("#left-time").val()){
                upJson.endDate = $("#left-time").val()+' 23:59:59';
            }
            upJson.ri = $scope.clickTime;
            erp.postFun('pojo/linShiGong/daoChuExcel',JSON.stringify(upJson),function(data){
                console.log(data)
                layer.msg(data.data.message)
                erp.closeLoad()
                if (data.data.statusCode==200) {
                    $scope.excelFlag = true;
                    $scope.excelLink = 'https://'+data.data.result;
                }
            },function(data){
                console.log(data)
                erp.closeLoad()
            })
        }
        //给子订单里面的订单添加选中非选中状态
        var cziIndex = 0;
        $('#c-zi-ord').on('click', '.cor-check-box', function () {
            if ($(this).attr('src') == 'static/image/order-img/multiple1.png') {
                $(this).attr('src', 'static/image/order-img/multiple2.png');
                cziIndex++;
                if (cziIndex == $('#c-zi-ord .cor-check-box').length) {
                    $('#c-zi-ord .c-checkall').attr('src', 'static/image/order-img/multiple2.png');
                }
            } else {
                $(this).attr('src', 'static/image/order-img/multiple1.png');
                cziIndex--;
                if (cziIndex != $('#c-zi-ord .cor-check-box').length) {
                    $('#c-zi-ord .c-checkall').attr('src', 'static/image/order-img/multiple1.png');
                }
            }
        })
        //全选
        $('#c-zi-ord').on('click', '.c-checkall', function () {
            if ($(this).attr('src') == 'static/image/order-img/multiple1.png') {
                $(this).attr('src', 'static/image/order-img/multiple2.png');
                cziIndex = $('#c-zi-ord .cor-check-box').length;
                $('#c-zi-ord .cor-check-box').attr('src', 'static/image/order-img/multiple2.png');
            } else {
                $(this).attr('src', 'static/image/order-img/multiple1.png');
                cziIndex = 0;
                $('#c-zi-ord .cor-check-box').attr('src', 'static/image/order-img/multiple1.png');
            }
        })
    }])
    //erp财务--VIP通道额度管理
    app.controller('incomeVIPCtrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('incomeVIPCtrl')
        /*************财务********VIP通道额度管理********BEGIN*************/
        var day = {"day": "0", "beginPage": "1", "limit": "30"};
        getAllUserMoney();
        //绑定点击事件.根据查询应收金额列表
        $scope.lastWeek = function (num) {
            day.day = num;
            getAllUserMoney();
        }
        $(".datatime-screen a").click(function () {
            $(".datatime-screen a").removeClass("active");
            $(this).addClass("active");
        });

        function getAllUserMoney() {
            erp.postFun("app/money/getAllUserMoney", day, function (data) {
                //              console.log(data.data);
                $scope.getAllUserMoney = data.data.data;
                console.log(data.data.count); //总页数.分页用
            }, function (data) {
                // alert("查询失败");
            });
        }

        /*************财务********VIP通道额度管理********END*************/

    }])
    //erp财务--汇款管理
    app.controller('remitCtrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('remitCtrl')
        $scope.currentStatus = "0"; /* 这个状态用来控制请求类型 */
        $scope.remitDfStatus = '4';
        $scope.remitZfStatus = '11';
        $scope.pageNum = '1';
        $scope.pageSize = '20';
        $scope.totalNum;
        $scope.day = '30';
        $scope.status = ["未付款", "已付款"];
        // var day={"day":"0","beginPage":"1","limit":"30"};
        var day_map = { 0: 'today', 6: 'weeks', 30: 'month', 93: 'threeMonth' };
        var day = {};
        // day.day = '30';
        // day.status = '4';
        // day.beginPage = '1';
        $('#page-sel').val('30')
        // day.limit = $('#page-sel').val() - 0;
        //获取应收金额列表(所有状态 已付款/未付款的订单)
        getAccountsReceivableAmount();

        //绑定点击事件.根据查询应收金额列表
        $scope.lastWeek = function (num) {
            console.log(num)
            $scope.day = num;
            $scope.pageNum = '1';
            $scope.pageSize = '20';
            $('.begin-date-val').val('')
            $('.end-date-val').val('')
            getAccountsReceivableAmount();
        }
        $(".datatime-screen a").click(function () {
            $(".datatime-screen a").removeClass("active");
            $(this).addClass("active");
        });
        // console.log(JSON.stringify(day))

        $scope.setTime = function (el, flag, manual) {
            console.log(el,flag,manual)
            if (manual) {
                // $scope[flag] = el.value; // 手动改日期
            } else {
                WdatePicker({dateFmt: 'yyyy-MM-dd', readOnly: true});
                $dp.onpicked = function () {
                    console.log(flag, $scope[flag] = $dp.el.value); // 鼠标选择日期
                };
            }
        };

        $scope.selected = [];
        var updateSelected = function (action, id) {
            if (action == 'add' && $scope.selected.indexOf(id) == -1) $scope.selected.push(id);
            if (action == 'remove' && $scope.selected.indexOf(id) != -1) $scope.selected.splice($scope.selected.indexOf(id), 1);
        };
        //更新某一列数据的选择
        $scope.updateSelection = function ($event, id) {
            var checkbox = $event.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            updateSelected(action, id);
        };
        //全选操作
        $scope.selectAll = function ($event) {
            var checkbox = $event.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            for (var i = 0; i < $scope.accountsReceivableAmount.length; i++) {
                var contact = $scope.accountsReceivableAmount[i];
                updateSelected(action, contact.ID);
            }
        };
        $scope.isSelected = function (id) {
            return $scope.selected.indexOf(id) >= 0;
        };
        $scope.isSelectedAll = function () {
            if($scope.accountsReceivableAmount) {
                return $scope.selected.length === $scope.accountsReceivableAmount.length;
            }   
        };

        $scope.changeStatus = function(key) {
            $scope.currentStatus = key
            $scope.pageNum = '1';
            $scope.pageSize = '20';
            console.log(key)
            switch(key) {
                case '0': 
                    $scope.remitDfStatus = '4';
                    $scope.remitZfStatus = '11';
                    break;
                case '1': 
                    $scope.remitDfStatus = '2';
                    $scope.remitZfStatus = '10';
                    break;
                case '2': 
                    $scope.remitDfStatus = '3';
                    $scope.remitZfStatus = '3';
                    break;
            }
            getAccountsReceivableAmount();
        }
        
        var operationNumber = function (arg1,arg2,operator) {
            var oper=['+','-','*','/'];
            // 不合法的运算
            if (isNaN(arg1)||isNaN(arg2)||oper.indexOf(operator)<0) {
                return NaN;
            }
            // 除以0
            if (operator==='/'&&Number(arg2)===0) {
                return Infinity;
            }
            // 和0相乘
            if (operator==='*'&&Number(arg2)===0) {
                return 0;
            }
            // 相等两个数字相减
            if ((arg1===arg2||Number(arg1)===Number(arg2))&&operator==='-') {
                return 0;
            }
            var r1, r2, max,_r1,_r2;
            try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
            try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
            max = Math.max(r1, r2)
            _r1 = max-r1;
            _r2 = max-r2;
            if (_r1!==0) {
                arg1=arg1+'0'.repeat(_r1)
            }
            if (_r2!==0) {
                arg2=arg2+'0'.repeat(_r2)
            }
            arg1 = Number(arg1.toString().replace('.',''))
            arg2 = Number(arg2.toString().replace('.',''))
            var r3 = operator==='*'?(max*2):(operator==='/'?0:max);
            var newNum = eval(arg1+operator+arg2);

            if (r3!==0) {
                var nStr = newNum.toString();
                nStr = nStr.replace(/^-/,'');
                if (nStr.length<r3+1) {
                    nStr = '0'.repeat(r3+1-nStr.length)+nStr;
                }
                nStr = nStr.replace(new RegExp('(\\\d{'+r3+'})$'),'.$1');
                if (newNum<0) {
                    nStr = '-'+nStr;
                }
                newNum = nStr*1;
            }
            return newNum;
        } 

        $scope.mulConfirmedPaid = function() {
            if($scope.selected.length === 0) {
                layer.msg('请选择需要确认的汇款项');
                return;
            }
            var money = 0;
            $scope.accountsReceivableAmount.forEach((item, i) => {
                $scope.selected.forEach((id, j) => {
                    if(item.ID === id) {
                        if(item.ORDERMONEY) {
                            money = operationNumber(item.ORDERMONEY, money, '+')
                        }
                        if(item.logisticsPrice) {
                            money = operationNumber(parseFloat(item.logisticsPrice), money, '+')
                        }
                    }
                })
                console.log(money)
            })
            layer.prompt({title: `金额总计 $${money}；请输入密码，并确认`, formType: 1}, function(pass, index){
            
            if(pass === 'cjcute2015') {
                layer.load(2, {shade: [0.8, '#393D49']});
                var tempArray = $scope.accountsReceivableAmount.map(item => {
                    if($scope.selected.indexOf(item.ID) !== -1) {
                        return {
                            "orderNum":item.ID,
                            "sourceType":item.sourceType,
                            "moid": item.moid
                        }
                    }
                    })
                var params = {
                    vos: tempArray.filter(i => {
                        if(i) {
                            return i;
                        }
                    })
                }
                erp.postFun('app/finance/confirmTransferBatch', params, function (data) {
                    if (data.data.result == 'true') {
                        layer.closeAll("loading")
                        getAccountsReceivableAmount();
                    } else {
                        layer.closeAll("loading")
                        layer.msg('执行失败')
                    }
                }, function (data) {
                    console.log(data)
                })
                layer.close(index);
            } else {
                layer.msg('密码错误')
            }
            });
        }

        function getAccountsReceivableAmount() {
            $scope.selected = [];
            var day = {};
            day.day = $scope.day;
            day.status = $scope.remitDfStatus;
            day.beginPage = $scope.pageNum;
            day.limit = $scope.pageSize;
            day.zfStatus = $scope.remitZfStatus;
            day.timeFlag = day_map[$scope.day];
            // day.beginDate = $scope.beginDate || '';
            // day.endDate = $scope.endDate || '';
            day.beginDate = $('.begin-date-val').val() || '';
            day.endDate = $('.end-date-val').val() || '';
            day.inputStr = $scope.inputStr || '';
            layer.load(2)
            erp.postFun("app/finance/getAccountsReceivableAmount", JSON.stringify(day), function (data) {
                layer.closeAll("loading")
                console.log(data)
                $scope.money = data.data.money;
                $scope.accountsReceivableAmount = data.data.data;
                console.log(data.data.count); //总页数.分页用
                $scope.totalNum = data.data.count;
                $scope.$broadcast('page-data', {
                    pageSize: $scope.pageSize.toString(),
                    pageNum: $scope.pageNum,
                    totalCounts: data.data.count,
                    pageList: ['10','20','50']
                });
              
            }, function (data) {
                layer.closeAll("loading")
                // alert("查询失败");
            });
        }

        // 分页触发
        $scope.$on('pagedata-fa', function(d, data) {
            $scope.pageNum = parseInt(data.pageNum);
            $scope.pageSize = parseInt(data.pageSize);
            getAccountsReceivableAmount();
        });

        //搜索
        $scope.Search = function(){
            if($('.begin-date-val').val()||$('.end-date-val').val()){
                $(".datatime-screen a").removeClass("active");
            }
            $scope.pageNum = '1';
            console.log($scope.beginDate,$scope.endDate)
            getAccountsReceivableAmount();
        }
        //按下enter搜索
        $scope.enterSearch = function (event) {
            if (event.keyCode === 13 || event.keyCode === 108) {
                $scope.Search()
                // $scope.pageNum = '1';
                // getAccountsReceivableAmount();
            }
        }

        //分页选择框的切换
        $scope.getPageSize = function () {
            getAccountsReceivableAmount();
        }
        $scope.getSpecifiedPage = function () {
            console.log('11111')
            getAccountsReceivableAmount();
        }
        //金额缺少的弹框
        $scope.jeqsflag = false;
        $scope.jeqsBtnFun = function () {
            $scope.jeqsflag = true;
        }
        //金额缺少的关闭按钮
        $scope.jeqsconFun = function () {
            $scope.jeqsflag = false;
        }
        $scope.imgflag = false;
        //查看转账凭证
        $scope.openImgFun = function (item) {
            $scope.imgflag = true;
            var upData = {};
            upData.orderNums = item.ID;
            upData.moid = item.moid;
            console.log(JSON.stringify(upData))
            erp.postFun('app/finance/getimg', JSON.stringify(upData), function (data) {
                console.log(data)
                console.log(data.data)
                // console.log(JSON.parse(data.data[0].transferImg))
                // $scope.imgArr = JSON.parse(data.data[0].transferImg);
                $scope.imgArr = data.data.image ? [data.data.image] : []
                $scope.zzMessage = data.data.message;
                var width = $scope.imgArr.length * 200 + 40;
                console.log(width)
                $('.img-con').css('width', width)
            }, function (data) {
                console.log(data)
            })
        }
        //查看图片的关闭函数
        $scope.closeFun = function () {
            $scope.imgflag = false;
        }
        //执行订单
        $scope.zhixtcFlag = false;
        var zxdata = {};
        $scope.enterFun = function (item) {
            console.clear();
            console.log(item, '1231')
            $scope.zhixtcFlag = true;
            zxdata.orderNum = item.ID;
            zxdata.moid = item.moid;
            if (item.sourceType) {
                zxdata.sourceType = item.sourceType;
            }
            $scope.customeName = item.MERCHANT_NAME;
            $scope.amountMoney = item.ORDERMONEY || item.logisticsPrice;
            // alert($scope.customeName+'======='+$scope.amountMoney)
        }
        //弹框的取消按钮
        $scope.cancelZXFun = function () {
            $scope.zhixtcFlag = false;
        }
        //执行弹框的确定按钮
        $scope.confirmZXFun = function () {
            // var zxdata = {};
            // zxdata.orderNum = item.ID;
            layer.prompt({title: `请输入密码，并确认`, formType: 1}, function(pass, index){
            
            if(pass === 'cjcute2015') {
                layer.load(2, {shade: [0.8, '#393D49']});
                console.log(zxdata)
                erp.postFun('app/finance/confirmTransfer', JSON.stringify(zxdata), function (data) {
                    console.log(data)
                    $scope.zhixtcFlag = false;
                    if (data.data.result == 'true') {
                        layer.closeAll("loading")
                        getAccountsReceivableAmount();
                    } else {
                        layer.closeAll("loading")
                        layer.msg('执行失败')
                    }
                }, function (data) {
                    console.log(data)
                })
                layer.close(index);
            } else {
                layer.msg('密码错误')
            }
            });
        }
        //拒绝的按钮
        $scope.jjFlag = false;
        var jjdata = {};
        $scope.enterjjFun = function (item) {
            // layer.msg('开发中')
            // return;
            console.log(item)
            $scope.jjFlag = true;
            jjdata.orderNum = item.ID;
            jjdata.sourceType = item.sourceType;
            jjdata.moid = item.moid;
        }
        //拒绝弹框的取消按钮
        $scope.canceljjFun = function () {
            $scope.jjFlag = false;
        }
        //拒绝弹框的确定按钮
        $scope.confirmjjFun = function () {
            // var zxdata = {};
            // zxdata.orderNum = item.ID;
            layer.prompt({title: '请输入密码，并确认', formType: 1}, function(pass, index){
                if(pass === 'cjcute2015') {
                layer.load(2);
                console.log(JSON.stringify(jjdata))
                erp.postFun('app/finance/cancelTransfer', JSON.stringify(jjdata), function (data) {
                    console.log(data)
                    $scope.jjFlag = false;
                    if (data.data.result == 'true') {
                        layer.closeAll("loading")
                        layer.msg('执行成功')
                        getAccountsReceivableAmount();
                    } else {
                        layer.closeAll("loading")
                        layer.msg('执行失败')
                    }
                }, function (data) {
                    console.log(data)
                })
                    layer.close(index);
                } else {
                    layer.msg('密码错误')
                }
            });
            
        }
        //查看留言
        $scope.loookLY = function (item) {
            console.log(item)
            $scope.isLook = true;
            var data = {
                shipid:item.ID,
                moid:item.moid
            }
            erp.postFun("app/finance/getMessage", data, function (res) {
                $scope.LYtxt = res.data.result;
            },function (err) {

            })

        }
        // //选中事件
        // var zxsIndex = 0;
        // $('.ea-list-table').on('click', '.checkbtn', function() {
        //     if ($(this).attr('src') == 'static/image/order-img/multiple1.png') {
        //         $(this).attr('src', 'static/image/order-img/multiple2.png');
        //         zxsIndex++;
        //         if (zxsIndex == $('.ea-list-table .checkbtn').length) {
        //             $('.ea-list-table .all-checkbtn').attr('src', 'static/image/order-img/multiple2.png');
        //         }
        //     } else {
        //         $(this).attr('src', 'static/image/order-img/multiple1.png');
        //         zxsIndex--;
        //         if (zxsIndex != $('.ea-list-table .checkbtn').length) {
        //             $('.ea-list-table .all-checkbtn').attr('src', 'static/image/order-img/multiple1.png');
        //         }
        //     }
        // })
        // //全选
        // $('.ea-list-table').on('click', '.all-checkbtn', function() {
        //     if ($(this).attr('src') == 'static/image/order-img/multiple1.png') {
        //         $(this).attr('src', 'static/image/order-img/multiple2.png');
        //         zxsIndex = $('.ea-list-table .checkbtn').length;
        //         $('.ea-list-table .checkbtn').attr('src', 'static/image/order-img/multiple2.png');
        //     } else {
        //         $(this).attr('src', 'static/image/order-img/multiple1.png');
        //         zxsIndex = 0;
        //         $('.ea-list-table .checkbtn').attr('src', 'static/image/order-img/multiple1.png');
        //     }
        // })
    }])
    app.filter('statusTrans', function() {
        return function(status, type) {
            if(type) {
                switch(status) {
                    case '3':
                        return '未收到汇款';
                    case '10':
                        return '已确认汇款'
                    case '11':
                        return '等待到账'
                }
            } else {
                switch(status) {
                    case '3':
                        return '未收到汇款';
                    case '2':
                        return '已确认汇款'
                    case '4':
                        return '等待到账'
                }
            }
        }
    })
    //erp财务--提现申请
    app.controller('walletcashCtrl', ['$scope', 'erp', '$location', '$routeParams','$timeout', function ($scope, erp, $location ,$routeParams, $timeout) {
        console.log('walletcashCtrl')
        $scope.listType = '3'
        $scope.cashStatus = '0';
        $scope.pageNum = '1';
        $scope.pageSize = '20';
        $scope.totalNum;
        $scope.withdrawalType = $routeParams.withdrawalType || '2'// 提现类型
        $scope.withdrawalTypeObj = {
            '3':'CJ提现',
            '13':'COD提现'
        }
        $scope.time = 2;
        $scope.getCashList = function () {
            layer.load(2)
            erp.postFun('app/wallet/getCustomerWatercourseERP', JSON.stringify({
                status: $scope.cashStatus,
                page: $scope.pageNum,
                limit: $scope.pageSize,
                type: $scope.withdrawalType,
                time: $scope.time,
                startTime: $('#txtBeginDate').val(),
                endTime: $('#txtEndDate').val(),
                name: $scope.userName,
                salesName: $scope.salesName
                // withdrawalType:$scope.withdrawalType
            }), function (data) {
                layer.closeAll('loading')
                var data = data.data;
                console.log(data);
                $scope.totalNum = data.count;
                for (var i = 0; i < data.list.length; i++) {
                    data.list[i].moneyAfterDeduct = (data.list[i].copeMoney * 97 / 100).toFixed(2);
                }
                $scope.cashList = data.list;
                if ($scope.totalNum == 0) return;
                pageFun($scope, function (page) {
                    $scope.pageNum = page + '';
                    erp.postFun('app/wallet/getCustomerWatercourseERP', JSON.stringify({
                        status: $scope.cashStatus,
                        page: $scope.pageNum,
                        limit: $scope.pageSize,
                        time: $scope.time,
                        type: $scope.withdrawalType,
                        salesName: $scope.salesName
                    }), function (data) {
                        var data = data.data;
                        for (var i = 0; i < data.list.length; i++) {
                            data.list[i].moneyAfterDeduct = (data.list[i].copeMoney * 97 / 100).toFixed(2);
                        }
                        $scope.cashList = data.list;
                    });
                });
            });
        }
        $scope.getCashList();
        $scope.withdrawalTypeChange = function(type){
            $scope.withdrawalType = type
            $scope.getCashList()
        }
        $scope.getPageSize = function () {
            $scope.pageNum = 1;
            $scope.getCashList();
        }
        $scope.getSpecifiedPage = function () {
            console.log($scope.pageNum>Math.ceil($scope.totalNum/($scope.pageSize-0)))
            if(!$scope.pageNum||$scope.pageNum<1||$scope.pageNum>Math.ceil($scope.totalNum/($scope.pageSize-0))){
                layer.msg('请输入有效的页码')
                return
            }
            $scope.getCashList();
        }
        $scope.lastWeek = function (num,ev) {
            $scope.pageNum = 1;
            $('.datatime-screen a').removeClass('active')
            $(ev.target).addClass('active')
            $scope.time = num;
            $('#txtBeginDate').val('');
            $('#txtEndDate').val('');
            $scope.getCashList();
        }
        $scope.timefilFun = function(){
            $scope.pageNum = 1;
            $scope.time = null;
            $('.datatime-screen a').removeClass('active')
            $scope.getCashList();
        }
        $scope.usersearch = function(){
            $scope.pageNum = 1;
            $scope.getCashList();
        }
        $scope.refuseCash = function (item, index) {
            $scope.opeItem = item;
            $scope.opeItem.index = index;
            $scope.refuseCashFlag = true;
        }
        $scope.canRefuseCash = function () {
            $scope.opeItem = null;
            $scope.refuseReason = '';
            $scope.refuseCashFlag = false;
        }
        $scope.goRefuseCash = function () {
            if (!$scope.refuseReason) {
                layer.msg('请输入拒绝原因');
                return;
            }
            if (chineseReqG.test($scope.refuseReason)) {
                layer.msg('拒绝原因请使用英文');
                return;
            }
            layer.load();
            erp.postFun('app/wallet/refuseWithDraw', JSON.stringify({
                errorInfo: $scope.refuseReason,
                id: $scope.opeItem.ID
            }), function (data) {
                layer.closeAll('loading');
                if (data.data.result == true) {
                    layer.msg('操作成功')
                    $scope.refuseCashFlag = false;
                    $scope.cashList.splice($scope.opeItem.index, 1);
                    $scope.refuseReason = '';
                    $scope.opeItem = null;
                } else {
                    layer.msg('操作失败')
                }
            }, function (err) {
                layer.closeAll('loading');
                console.log(err);
            })

        }
        $scope.confirmCash = function (item, index) {
            layer.prompt({title: `请输入密码，并确认`, formType: 1}, function(pass, index2){
                if(pass === 'cjcute2015') {
                    $timeout(() =>{
                        $scope.imgArr = [];
                        $scope.opeItem = item;
                        $scope.opeItem.index = index;
                        $scope.confirmCashFlag = true;
                        layer.close(index2);
                    })
                } else {
                    layer.msg('密码错误')
                    layer.close(index2);
                }
            });
	          
        }
        $scope.cancelConfirmCash = function () {
            $scope.opeItem = null;
            $scope.imgArr = [];
            $scope.confirmCashFlag = false;
        }
        $scope.removeOnePic = function (index) {
            $scope.imgArr.splice(index, 1);
        }
        $scope.goConfirmCash = function () {
            if ($scope.imgArr.length == 0) {
                layer.msg('请先上传支付凭证');
                return;
            }
            layer.load();
            erp.postFun('app/wallet/executeWithDraw', JSON.stringify({
                image: $scope.imgArr.join(','),
                id: $scope.opeItem.ID,
                type: $scope.opeItem.type === '13' ? 'cod' : undefined
            }), function (data) {
                layer.closeAll('loading');
                if (data.data.result == true) {
                    layer.msg('操作成功')
                    $scope.confirmCashFlag = false;
                    $scope.cashList.splice($scope.opeItem.index, 1);
                    $scope.opeItem = null;
                } else {
                    layer.msg('操作失败')
                }
            }, function (err) {
                layer.closeAll('loading');
                console.log(err);
            })

        }
        $scope.imgArr = [];
        $scope.upLoadImg4 = function (files) {
            if (files.length == 0) return;
            console.log(files);
            $scope.imgArrType = [];
            var data = new FormData();
            console.log(data)
            for (var i = 0; i < files.length; i++) {
                data.append('file', files[i]);
            }
            console.log(data)
            erp.upLoadImgPost('app/ajax/upload', data, con, err)

            function con(n) {
                $("#document2").val('');
                console.log(n)
                console.log(n.data.result)
                var obj = JSON.parse(n.data.result)
                for (var i = 0; i < obj.length; i++) {
                    var srcList = obj[i].split('.');
                    var imgArrType = srcList[srcList.length - 1];
                    if (imgArrType == 'png' || imgArrType == 'jpg' || imgArrType == 'jpeg' || imgArrType == 'gif' || imgArrType == 'pdf') {
                        $scope.imgArr.push(obj[i]);
                        console.log($scope.imgArr)
                        $scope.isimgflag = true; //判断是否上传图片
                    } else {
                        // layer.msg('Incorrect File Extension')
                        $scope.isphoto = true; //判断如果不是图片的弹框  显示
                        $scope.isimgflag = false; //判断是否上传图片
                        return;
                    }
                }
            }

            function err(n) {
                console.log(n)
            }
        }
        $scope.messageFun = (item,index)=>{
            $scope.messageObj = {
                show:true,
                id:item.ID,
                index
            }
        }
         $scope.check = function (item, index) {
             console.log(item, '1231231')
            $location.path('/erpfinance/billInquiry').search({'userName': item.paymentName})
        }
        $scope.submitMessageFun =()=>{
            layer.load(2);
            let param = {
                id:$scope.messageObj.id,
                remarks:$scope.messageObj.val
            }
            erp.postFun('app/wallet/remarks' ,param, function (data) {
                layer.closeAll('loading');
                $scope.messageObj.show=false;
                if (data.data.code == '200') {
                    $scope.cashList[$scope.messageObj.index].message=$scope.messageObj.val;
                    layer.msg('留言成功');
                } else {
                    layer.msg('留言失败');
                }
            }, function (err) {
                $scope.messageObj.show=false;
                layer.closeAll('loading');
                console.log(err);
            })
        }
    }])
    //erp财务--客户钱包-充值管理
    app.controller('walletRechargeCtrl', ['$scope', 'erp', '$timeout', function ($scope, erp, $timeout) {
        console.log('walletRechargeCtrl');
        $scope.listType = '1'
        $scope.chargeStatus = '0';
        $scope.pageNum = '1';
        $scope.pageSize = '20';
        $scope.totalNum;
        $scope.time = 2;
        $scope.getChargeList = function () {
            erp.postFun('app/wallet/getCustomerWatercourseERP', JSON.stringify({
                status: $scope.chargeStatus,
                page: $scope.pageNum,
                limit: $scope.pageSize,
                type: '1',
                time: $scope.time,
                startTime: $('#txtBeginDate').val(),
                endTime: $('#txtEndDate').val(),
                name: $scope.userName
            }), function (data) {
                console.log(data);
                $scope.totalNum = data.data.count;
                $scope.rechargeList = data.data.list;
                if ($scope.totalNum == 0) return;
                pageFun($scope, function (page) {
                    $scope.pageNum = page + '';
                    erp.postFun('app/wallet/getCustomerWatercourseERP', JSON.stringify({
                        status: $scope.chargeStatus,
                        page: $scope.pageNum,
                        limit: $scope.pageSize,
                        type: '1'
                    }), function (data) {
                        $scope.rechargeList = data.data.list;
                    });
                });
            });
        }
        $scope.getChargeList();
        $scope.getPageSize = function () {
            $scope.pageNum = 1;
            $scope.getChargeList();
        }
        $scope.getSpecifiedPage = function () {
            console.log($scope.pageNum>Math.ceil($scope.totalNum/($scope.pageSize-0)))
            if(!$scope.pageNum||$scope.pageNum<1||$scope.pageNum>Math.ceil($scope.totalNum/($scope.pageSize-0))){
                layer.msg('请输入有效的页码')
                return
            }
            $scope.getChargeList();
        }
        $scope.lastWeek = function (num,ev) {
            $scope.pageNum = 1;
            $('.datatime-screen a').removeClass('active')
            $(ev.target).addClass('active')
            $scope.time = num;
            $('#txtBeginDate').val('');
            $('#txtEndDate').val('');
            $scope.getChargeList();
        }
        $scope.timefilFun = function(){
            $scope.pageNum = 1;
            $scope.time = null;
            $('.datatime-screen a').removeClass('active')
            $scope.getChargeList();
        }
        $scope.usersearch = function(){
            $scope.pageNum = 1;
            $scope.getChargeList();
        }
        $scope.showFullMes = function (item) {
            layer.open({
                title: '客户留言'
                , content: item.message
            });
        }

        //执行订单
        $scope.confirmReceiveFlag = false;
        $scope.confirmReceive = function (item, index) {
            layer.prompt({title: `请输入密码，并确认`, formType: 1}, function(pass, index2){
                if(pass === 'cjcute2015') {
                    $timeout(() =>{
                        $scope.confirmReceiveFlag = true;
                        $scope.opeItem = item;
                        $scope.opeItem.index = index;
                        layer.close(index2);
                    })
                } else {
                    layer.msg('密码错误')
                    layer.close(index2);
                }
            });
        }
        //弹框的取消按钮
        $scope.cancelConfirmReceive = function () {
            $scope.confirmReceiveFlag = false;
            $scope.opeItem = null;
        }
        //执行弹框的确定按钮
        $scope.goConfirmReceive = function () {
            layer.load(2);
            erp.postFun('app/wallet/affirmAccount', JSON.stringify({
                id: $scope.opeItem.ID,
                code: '1',
	              type: $scope.opeItem.type === '11' ? 'cod' : undefined
            }), function (data) {
                layer.closeAll("loading")
                console.log(data)
                if (data.data.result == true) {
                    layer.msg('操作成功')
                    $scope.confirmReceiveFlag = false;
                    $scope.rechargeList.splice($scope.opeItem.index, 1);
                    $scope.opeItem = null;
                } else {
                    layer.msg('操作失败')
                }
            }, function (data) {
                layer.closeAll("loading")
                console.log(data)
            })
        }
        //拒绝的按钮
        $scope.receiveErrpeFlag = false;
        $scope.errorInfo = "Payment Not Received";
        $scope.refuseReceive = function (item, index) {
            $scope.receiveErrpeFlag = true;
            $scope.opeItem = item;
            $scope.opeItem.index = index;
        }
        //拒绝弹框的取消按钮
        $scope.canRefuseReceive = function () {
            $scope.receiveErrpeFlag = false;
        }
        //拒绝弹框的确定按钮
        $scope.goRefuseReceive = function () {
            layer.load(2);
            erp.postFun('app/wallet/affirmAccount', JSON.stringify({
                id: $scope.opeItem.ID,
                code: '2',
                errorInfo: $scope.errorInfo
            }), function (data) {
                layer.closeAll("loading")
                console.log(data)
                if (data.data.result == true) {
                    $scope.receiveErrpeFlag = false;
                    $scope.rechargeList.splice($scope.opeItem.index, 1);
                    $scope.opeItem = null;
                } else {
                    layer.msg('操作失败')
                }
            }, function (data) {
                layer.closeAll("loading")
                console.log(data)
            })
        }
    }])
    //订单利润
    app.controller('OrderProfitCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        $scope.otherList = ['聂德宁', '庄晓琪', '吴俊峰', '陈磊刚', '楼晓超', '李敏', '盛晨', '胡雅丽']
        $scope.information = false;
        $scope.DpNumDialog = false;
        $scope.SkNumDialog = false;
        //客户页面
        $scope.search = '';
        $scope.pagesize = '20';
        $scope.pagenum = '1';
        $scope.pagenumarr = [10, 20, 30, 50];
        $scope.totalNum = 0;
        $scope.AffiliateList = [];
        $scope.orderBy = '';
        $scope.UserData = null;
        //客户信息弹窗
        $scope.isoneshow = true;
        $scope.istwoshow = false;

        $scope.Dpsearch = '';
        $scope.Dppagesize = '5';
        $scope.Dppagenum = '1';
        $scope.DpNumTotal = 0;
        $scope.DpList = [];
        $scope.DpuserId = '';

        function getList() {
            erp.load();
            var upData = {};
            upData.id = $scope.searchId;
            upData.accountName = $scope.accountName;
            upData.merchantName = $scope.merchantName;
            upData.merchantNum = $scope.merchantNum;
            upData.ownerName = $scope.ownerName;
            upData.storeName = $scope.storeName;
            upData.beginDate = $('#c-data-time').val();
            upData.endDate = $('#cdatatime2').val();
            upData.limit = $scope.pagesize;
            upData.page = $scope.pagenum;
            erp.postFun('app/finance/orderProfit', JSON.stringify(upData), con, err)

            function con(n) {
                console.log(n)
                erp.closeLoad();
                var obj = n.data.list;
                console.log(obj)
                obj.dw = false;
                $scope.AffiliateList = obj;
                $scope.totalNum = n.data.count || 0;
                if (n.data.count == 0) {
                    $scope.totalpage = 0;
                    $scope.AffiliateList = [];
                    // layer.msg(gjh27);
                }
                $scope.totalpage = function () {
                    return Math.ceil(n.data.count / $scope.pagesize)
                }
                countMFun($scope.AffiliateList);
                pageFun();
                if (n.data.code == 200) {

                }
            }
        }

        function countMFun(val) {
            var len = val.length;
            var count = 0;
            for (var i = 0; i < len; i++) {
                count += val[i].ORDERMONEY;
            }
            $scope.countMoney = count.toFixed(2)
            console.log($scope.countMoney);
        }

        function FxgetList(userId, item, idx) {
            erp.load();
            erp.postFun('app/user/selectAccountList', {'userId': userId}, con, err)

            function con(n) {
                erp.closeLoad();
                if (n.data.code == 200) {
                    var obj = n.data.list;
                    if (obj.length > 0) {
                        obj.forEach(function (o, i) {
                            o.idx = idx;
                        })
                        item.FxList = obj;
                    } else if (obj.length == 0) {
                        item.FxList = [];
                        // layer.msg(gjh27);
                        item.dw = false;
                    }
                }
            }
        }

        function Userinformation(id) {
            erp.load();
            $scope.UserData = null;
            erp.postFun('app/user/getAffUserInfo', {'id': id}, con, err)

            function con(n) {
                erp.closeLoad();
                if (n.data.code == 200) {
                    $scope.UserData = n.data.affUserInfo;
                }
            }
        }

        getList();

        //导出
        $('#daochu').click(function () {
            var searchId = $scope.searchId || '';
            var  merchantName = $scope.merchantName || '';
            var  merchantNum = $scope.merchantNum || '';
            var salesman = $scope.accountName || '';
            var beginDate = $('#c-data-time').val();
            var endDate = $('#cdatatime2').val();
            //console.log(salesman,beginDate,endDate);
           if (beginDate == null || beginDate == '' || beginDate == undefined) {
                layer.msg('请输入开始日期');
            } else if (endDate == null || endDate == '' || endDate == undefined) {
                layer.msg('请输入结束日期');
            } else {
                //console.log(salesman,beginDate,endDate);
                erp.load();
                var params = {
                    "id": searchId,
                    "MERCHANT_NAME": merchantName,
                    "merchantNum": merchantNum,
                    "salesman": salesman,
                    "beginDate": beginDate,
                    "endDate": endDate,
                    ownerName: $scope.ownerName || ''
                };
                // erp.postFun('app/order/financeOrder', JSON.stringify(data), function (data) {
                // erp.postFun('app/order/judgeFinanceOrder', JSON.stringify(data), function (data) {
                //     //console.log(data);
                //     var result = data.data;
                //     var href = result.href;
                //     erp.closeLoad();
                //     if (href == "没有查找到这个业务员") {
                //         layer.msg('没有查找到这个业务员');
                //     } else {
                //         $('.zzc').show();
                //         $('.daochu-top>a').attr('href', href).html(href);
                //     }
                // }, function () {
                //     layer.msg('导出失败');
                // });
                erp.postFun('app/order/judgeFinanceOrder', JSON.stringify(params), ({ data }) => {
                    const { result } = data
                    
                    if (result === '成功' ) {
                        let options = []
                        Object.keys(params).forEach((key, idx) => {
                            options.push(`${key}=${params[key]}`)
                        })
                        const environment = window.environment
                        let excelIp
                          , link = document.createElement('a')
                        if (/development/.test(environment)) {
                            excelIp = 'http://192.168.5.46:8090/'
                        } else if (/test/.test(environment)) {
                            // excelIp = 'http://192.168.5.46:8090/'
                            excelIp = 'http://erp.test.com/'
                        } else if (/production##$/.test(environment)) {
                            excelIp = 'https://erp.cjdropshipping.com/'
                        } else if (/production-cn##$/.test(environment)) {
                            excelIp = 'https://erp.cjdropshipping.cn/'
                        }
                        link.href = `${excelIp}app/order/exportFinanceOrder?${options.join('&')}`
                        link.click()
                        layer.msg('导出成功，请等待下载')
                    } else {
                        layer.msg(result)
                    }
                }, _ => { layer.msg('导出失败')}, { layer: true} )
            }
        });

        $('#daochuShow').click(function () {
            var searchId = $scope.searchId || '';
            var  merchantName = $scope.merchantName || '';
            var salesman = $scope.accountName || '';
            var storeName = $scope.storeName || '';
            var beginDate = $('#c-data-time').val();
            var endDate = $('#cdatatime2').val();
            //console.log(salesman,beginDate,endDate);
           if (beginDate == null || beginDate == '' || beginDate == undefined) {
                layer.msg('请输入开始日期');
            } else if (endDate == null || endDate == '' || endDate == undefined) {
                layer.msg('请输入结束日期');
            } else {
                //console.log(salesman,beginDate,endDate);
                erp.load();
                var ownerName = $scope.ownerName || '';
                erp.getFun(
                    "app/finance/exportOrderProfit?beginDate=" + beginDate + "&endDate=" + endDate + "&ownerName=" + ownerName + "&id=" + searchId + "&merchantName=" + merchantName + "&accountName=" + salesman + "&storeName=" + storeName ,
                    function(res) {
                    // 返回200
                        console.log(res);
                        var blob = res.data;
                        var reader = new FileReader();
                        reader.readAsDataURL(blob); // 转换为base64，可以直接放入a表情href
                        reader.onload = function(e) {
                            // 转换完成，创建一个a标签用于下载
                            var a = document.createElement("a");
                            var body = document.getElementsByTagName("body")[0];
                            a.download = "展示列表";
                            a.href = e.target.result;
                            body.append(a); // 修复firefox中无法触发click
                            a.click();
                        };
                        erp.closeLoad();
                    },
                    function() {
                        erp.closeLoad();
                    },
                    { responseType: "blob" }
                );
                
            }
        });






        //关闭导出
        $('#guanbi').click(function () {
            $('.zzc').hide();
        });

        //erp开始日期搜索
        $("#c-data-time").click(function () {
            var erpbeginTime = $("#c-data-time").val();
            var interval = setInterval(function () {
                var endtime2 = $("#c-data-time").val();
                if (endtime2 != erpbeginTime) {
                    clearInterval(interval);
                    $scope.pagenum = '1';
                    getList();
                }
            }, 100)
        })
        //erp结束日期搜索
        $("#cdatatime2").click(function () {
            var erpendTime = $("#cdatatime2").val();
            var interval = setInterval(function () {
                var endtime2 = $("#cdatatime2").val();
                if (endtime2 != erpendTime) {
                    clearInterval(interval);
                    $scope.pagenum = '1';
                    getList();
                }
            }, 100)
        })
        //点击表格行留下颜色
        $scope.TrClick = function (i) {
            $scope.focus = i;
        }
        //客户信息点击
        $scope.usernameClick = function (item) {
            console.log(item.id)
            $scope.isoneshow = true;
            $scope.istwoshow = false;
            $scope.information = true;
            Userinformation(item.id)
        }
        $scope.informationClose = function () {
            $scope.information = false;
        }
        $scope.leftClick = function () {
            $scope.isoneshow = true;
            $scope.istwoshow = false;
        }
        $scope.rightClick = function () {
            $scope.isoneshow = false;
            $scope.istwoshow = true;
        }
        //分销数量点击
        $scope.fenxiaoNum = function (item, idx) {
            item.dw = !item.dw;
            if (item.dw) {
                FxgetList(item.id, item, idx);
            }
        }

        //分页
        function pageFun() {
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
                    $scope.pagenum = n;
                    getList();
                }
            });
        }

        //加入黑名单
        $scope.addBlank = function (item) {
            console.log(item);
            layer.confirm(gjh30, {
                        title: '操作提示',
                        icon: 3,
                        btn: [gjh10, gjh55] //按钮
                    }, function (ca) {
                        layer.close(ca);
                    }, function (index) {
                        erp.postFun('app/user/updateAffAccountByDistributionState', {
                            id: item.id,
                            'distributionState': 'BLACKLIST_STATE'
                        }, function (res) {
                            if (res.data.code == 200) {
                                layer.msg(gjh24);
                                layer.close(index);
                                getList();
                            } else {
                                layer.msg(gjh25)
                            }
                        }, function (res) {
                            layer.msg(gjh25)
                        })
                    }
            );
        }
        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            $scope.pagenum = 1;
            getList();
        }
        $scope.pagenumchange = function () {
            console.log($scope.pagenum % 1)
            $scope.pagenum = $(".goyema").val() - 0;
            if ($scope.pagenum < 1 || $scope.pagenum > $scope.totalpage()) {
                layer.msg(gjh29);
                $(".goyema").val(1)
            } else {
                getList();
            }
        }
        //搜索客户
        $scope.searchcustomer = function () {
            console.log('搜索条件', $scope.search);
            $scope.orderBy = '';
            $scope.pagenum = 1;
            getList();
        }
        //按下enter搜索
        $scope.enterSearch = function (event) {
            if (event.keyCode === 13 || event.keyCode === 108) {
                console.log('搜索条件', $scope.search);
                $scope.orderBy = '';
                $scope.pagenum = 1;
                getList();
            }
        }
        //升序排列
        $scope.wllSort1 = function () {
            console.log("aa升序")
            $scope.orderBy = "asc";
            getList();
        }
        //降序排列
        $scope.wllSort2 = function () {
            console.log("bb降序")
            $scope.orderBy = "desc";
            getList();
        }

        function err() {
            layer.msg('系统异常')
        }

        $scope.showZiFun = function (item) {
            var muOrdId = item.ID;
            console.log(muOrdId)
            window.open('#/erpfinance/ziOrderProfit/' + muOrdId)
        }
    }])
    //子订单利润
    app.controller('ziOrderProfitCtrl', ['$scope', 'erp', '$location', '$routeParams', function ($scope, erp, $location, $routeParams) {
        //客户页面
        var muOrdId = $routeParams.muOrdId;
        // sessionStorage.setItem('clickAddr','8,3,2')
        console.log(muOrdId)
        $scope.search = '';
        $scope.pagesize = '20';
        $scope.pagenum = '1';
        $scope.pagenumarr = [10, 20, 30, 50];
        $scope.totalNum = 0;
        $scope.AffiliateList = [];
        $scope.orderBy = '';
        $scope.UserData = null;
        //客户信息弹窗
        $scope.isoneshow = true;
        $scope.istwoshow = false;

        $scope.Dpsearch = '';
        $scope.Dppagesize = '5';
        $scope.Dppagenum = '1';
        $scope.DpNumTotal = 0;
        $scope.DpList = [];
        $scope.DpuserId = '';

        function getList() {
            erp.load();
            var shidObj = {};
            shidObj.limit = $scope.pagesize;
            shidObj.page = $scope.pagenum;
            if ($scope.search) {
                shidObj.shid = $scope.search;
            } else {
                shidObj.shid = muOrdId;
            }
            erp.postFun('app/finance/childOrderProfit', JSON.stringify(shidObj), function (data) {
                console.log(data)
                erp.closeLoad();
                $scope.ordList = data.data.order;
                $scope.totalNum = data.data.count || 0;
                console.log($scope.ordList)
                pageFun();
            }, function (data) {
                console.log(data)
                erp.closeLoad();
            })
        }

        getList();

        function pageFun() {
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
                    $scope.pagenum = n;
                    getList();
                }
            });
        }

        //点击事件
        $('.orders-table').on('click', '.erporder-detail', function (event) {
            // if($(event.target).hasClass('cor-check-box')||$(event.target).hasClass('qtcz-sel')||$(event.target).hasClass('stop-prop')){
            //     return;
            // }
            if ($(this).hasClass('focus')) {
                $(this).next().hide();
                $(this).removeClass('focus');
            } else {
                //$('.orders-table .erpd-toggle-tr').hide();//隐藏所有的商品
                $(this).next().show();
                $(this).addClass('focus');
            }
        })
        $('.orders-table').on('mouseenter', '.erporder-detail', function () {
            $(this).next().show();
            // $('.orders-table .erporder-detail').removeClass('focus');
            // $(this).addClass('focus');
        })
        $('.orders-table').on('mouseleave', '.erporder-detail', function () {
            // $(this).next().hide();
            if ($(this).hasClass('focus')) {
                $(this).next().show();
            } else {
                $(this).next().hide();
            }
        })
        $('.orders-table').on('mouseenter', '.erpd-toggle-tr', function () {
            $(this).show();
        })
        $('.orders-table').on('mouseleave', '.erpd-toggle-tr', function () {
            // $(this).hide();
            if ($(this).prev().hasClass('focus')) {
                $(this).show();
            } else {
                $(this).hide();
            }
        })
        // $('.orders-table').mouseleave(function () {
        //     $('.orders-table .erporder-detail').removeClass('focus');
        // })

        //点击表格行留下颜色
        $scope.TrClick = function (i) {
            $scope.focus = i;
        }

        // $scope.informationClose = function () {
        //     $scope.information = false;
        // }
        // $scope.leftClick = function () {
        //     $scope.isoneshow = true;
        //     $scope.istwoshow = false;
        // }
        // $scope.rightClick = function () {
        //     $scope.isoneshow = false;
        //     $scope.istwoshow = true;
        // }
        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            $scope.pagenum = 1;
            getList();
        }
        $scope.pagenumchange = function () {
            console.log($scope.pagenum % 1)
            $scope.pagenum = $(".goyema").val() - 0;
            console.log(Math.ceil($scope.totalNum / ($scope.pagesize - 0)))
            if ($scope.pagenum < 1 || $scope.pagenum > Math.ceil($scope.totalNum / ($scope.pagesize - 0))) {
                layer.msg('请输入有效页码');
            } else {
                getList();
            }
        }
        //按下enter搜索
        $scope.enterSearch = function (event) {
            if (event.keyCode === 13 || event.keyCode === 108) {
                console.log('搜索条件', $scope.search);
                $scope.pagenum = 1;
                getList();
            }
        }

        function err() {
            layer.msg('系统异常')
        }
    }])
    //商品利润
    app.controller('CommodityProfitCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        $scope.information = false;
        $scope.DpNumDialog = false;
        $scope.SkNumDialog = false;
        //客户页面
        $scope.search = '';
        $scope.pagesize = '20';
        $scope.pagenum = '1';
        $scope.pagenumarr = [10, 20, 30, 50];
        $scope.totalNum = 0;
        $scope.AffiliateList = [];
        $scope.orderBy = '';
        $scope.UserData = null;
        //客户信息弹窗
        $scope.isoneshow = true;
        $scope.istwoshow = false;

        $scope.Dpsearch = '';
        $scope.Dppagesize = '5';
        $scope.Dppagenum = '1';
        $scope.DpNumTotal = 0;
        $scope.DpList = [];
        $scope.DpuserId = '';

        function getList() {
            erp.load();
            erp.postFun('app/user/selectAffAccountList', {
                'distributionState': 'ORIGINAL_STATE',
                'orderBy': $scope.orderBy,
                'name': $scope.search,
                'pageNum': $scope.pagesize,
                'page': $scope.pagenum
            }, con, err)

            function con(n) {
                erp.closeLoad();
                if (n.data.code == 200) {
                    var obj = n.data.list;
                    obj.dw = false;
                    $scope.AffiliateList = obj;
                    $scope.totalNum = n.data.totalNum || 0;
                    if (n.data.totalNum == 0) {
                        $scope.totalpage = 0;
                        $scope.AffiliateList = [];
                        // layer.msg(gjh27);
                    }
                    $scope.totalpage = function () {
                        return Math.ceil(n.data.totalNum / $scope.pagesize)
                    }
                    pageFun();
                }
            }
        }

        function FxgetList(userId, item, idx) {
            erp.load();
            erp.postFun('app/user/selectAccountList', {'userId': userId}, con, err)

            function con(n) {
                erp.closeLoad();
                if (n.data.code == 200) {
                    var obj = n.data.list;
                    if (obj.length > 0) {
                        obj.forEach(function (o, i) {
                            o.idx = idx;
                        })
                        item.FxList = obj;
                    } else if (obj.length == 0) {
                        item.FxList = [];
                        // layer.msg(gjh27);
                        item.dw = false;
                    }
                }
            }
        }

        function Userinformation(id) {
            erp.load();
            $scope.UserData = null;
            erp.postFun('app/user/getAffUserInfo', {'id': id}, con, err)

            function con(n) {
                erp.closeLoad();
                if (n.data.code == 200) {
                    $scope.UserData = n.data.affUserInfo;
                }
            }
        }

        getList();
        //点击表格行留下颜色
        $scope.TrClick = function (i) {
            $scope.focus = i;
        }
        //客户信息点击
        $scope.usernameClick = function (item) {
            console.log(item.id)
            $scope.isoneshow = true;
            $scope.istwoshow = false;
            $scope.information = true;
            Userinformation(item.id)
        }
        $scope.informationClose = function () {
            $scope.information = false;
        }
        $scope.leftClick = function () {
            $scope.isoneshow = true;
            $scope.istwoshow = false;
        }
        $scope.rightClick = function () {
            $scope.isoneshow = false;
            $scope.istwoshow = true;
        }
        //分销数量点击
        $scope.fenxiaoNum = function (item, idx) {
            item.dw = !item.dw;
            if (item.dw) {
                FxgetList(item.id, item, idx);
            }
        }

        //分页
        function pageFun() {
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
                    $scope.pagenum = n;
                    getList();
                }
            });
        }

        //加入黑名单
        $scope.addBlank = function (item) {
            console.log(item);
            layer.confirm(gjh30, {
                        title: '操作提示',
                        icon: 3,
                        btn: [gjh10, gjh55] //按钮
                    }, function (ca) {
                        layer.close(ca);
                    }, function (index) {
                        erp.postFun('app/user/updateAffAccountByDistributionState', {
                            id: item.id,
                            'distributionState': 'BLACKLIST_STATE'
                        }, function (res) {
                            if (res.data.code == 200) {
                                layer.msg(gjh24);
                                layer.close(index);
                                getList();
                            } else {
                                layer.msg(gjh25)
                            }
                        }, function (res) {
                            layer.msg(gjh25)
                        })
                    }
            );
        }
        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            $scope.pagenum = 1;
            getList();
        }
        $scope.pagenumchange = function () {
            console.log($scope.pagenum % 1)
            $scope.pagenum = $(".goyema").val() - 0;
            if ($scope.pagenum < 1 || $scope.pagenum > $scope.totalpage()) {
                layer.msg(gjh29);
                $(".goyema").val(1)
            } else {
                getList();
            }
        }
        //搜索客户
        $scope.searchcustomer = function () {
            console.log('搜索条件', $scope.search);
            $scope.orderBy = '';
            $scope.pagenum = 1;
            getList();
        }
        //按下enter搜索
        $scope.enterSearch = function (event) {
            if (event.keyCode === 13 || event.keyCode === 108) {
                console.log('搜索条件', $scope.search);
                $scope.orderBy = '';
                $scope.pagenum = 1;
                getList();
            }
        }
        //升序排列
        $scope.wllSort1 = function () {
            console.log("aa升序")
            $scope.orderBy = "asc";
            getList();
        }
        //降序排列
        $scope.wllSort2 = function () {
            console.log("bb降序")
            $scope.orderBy = "desc";
            getList();
        }

        function err() {
            layer.msg('系统异常')
        }
    }])
    //我的绩效--抓货记录
    app.controller('CatchingGoodsCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        $scope.search = '';
        $scope.pageNum = '1';
        $scope.pageSize = '20';
        $scope.totalNum = 0;
        $scope.Datalist = [];
        $scope.orderBy = '';
        $scope.UserData = null;
        $scope.itemOrMore = '';

        //获取数据
        function getList() {
            erp.load();
            var data = {
                'beginTime': $('#beginTime').val(),
                'endTime': $('#endTime').val(),
                'pageNum': $scope.pageNum,
                'pageSize': $scope.pageSize,
                'batchNumber': $scope.batchNumber,
                'itemOrMore': $scope.itemOrMore,
                'lookingForPerson': $scope.lookingForPerson,
            };
            erp.postFun('storage/batchNumber/selectBatchStatistical', data, function (n) {
                erp.closeLoad();
                console.log(n.data.result.totalNum)
                if (n.data.statusCode == 200) {
                    $scope.Datalist = n.data.result.List;
                    console.log($scope.Datalist)
                    $scope.totalNum = n.data.result.totalNum || 0;
                    if (n.data.result.totalNum == 0) {
                        $scope.totalpage = 0;
                        $scope.Datalist = [];
                        layer.msg(gjh27);
                    }
                    $scope.totalpage = function () {
                        return Math.ceil(n.data.result.totalNum / $scope.pagesize)
                    }
                    pageFun();
                }else if(n.data.statusCode == 403){
                    layer.msg('没有该权限')
                }
            }, err)
        }

        getList();
        //点击表格行留下颜色
        $scope.TrClick = function (i) {
            $scope.focus = i;
        }

        //分页
        function pageFun() {
            $(".pagegroup").jqPaginator({
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
                    getList();
                }
            });
        }

        //加入黑名单
        $scope.addBlank = function (item) {
            console.log(item);
            layer.confirm(gjh30, {
                        title: '操作提示',
                        icon: 3,
                        btn: [gjh10, gjh55] //按钮
                    }, function (ca) {
                        layer.close(ca);
                    }, function (index) {
                        erp.postFun('app/user/updateAffAccountByDistributionState', {
                            id: item.id,
                            'distributionState': '5'
                        }, function (res) {
                            if (res.data.code == 200) {
                                layer.msg(gjh24);
                                layer.close(index);
                                getList();
                            } else {
                                layer.msg(gjh25)
                            }
                        }, function (res) {
                            layer.msg(gjh25)
                        })
                    }
            );
        }
        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            $scope.pageNum = '1';
            getList();
        }
        $scope.pagenumchange = function () {
            console.log($scope.pageNum % 1)
            $scope.pageNum = $(".goyema").val() - 0;
            if ($scope.pageNum < 1 || $scope.pageNum > $scope.totalpage()) {
                layer.msg(gjh29);
                $(".goyema").val(1)
            } else {
                getList();
            }
        }
        //搜索
        $scope.Search = function () {
            $scope.pageNum = '1';
            getList();
        }
        //按下enter搜索
        $scope.enterSearch = function (event) {
            if (event.keyCode === 13 || event.keyCode === 108) {
                $scope.pageNum = '1';
                getList();
            }
        }

        function err(n) {
            // erp.closeLoad();
            layer.closeAll('loading');
            console.log(n);
            $scope.Datalist = [];
        }
    }])
    //我的绩效--验单记录
    app.controller('InspectionFormCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        $scope.search = '';
        $scope.pageNum = '1';
        $scope.pageSize = '20';
        $scope.totalNum = 0;
        $scope.Datalist = [];
        $scope.orderBy = '';
        $scope.UserData = null;
        $scope.itemOrMore = '';

        //获取数据
        function getList() {
            erp.load();
            var data = {
                //'beginTime': $('#beginTime').val(),
                //'endTime': $('#endTime').val(),
                'pageNum': $scope.pageNum,
                'pageSize': $scope.pageSize,
                'caoZuoRen': $scope.caoZuoRen,
                //'trackingNumber': $scope.trackingNumber,
                //'inspectionPeople': $scope.inspectionPeople,
            };
            erp.postFun('storage/batchNumber/selectYanDanTongJiJiLu', data, function (n) {
                erp.closeLoad();
                if (n.data.statusCode == 200) {
                    $scope.Datalist = n.data.result.list;
                    console.log($scope.Datalist)
                    $scope.totalNum = n.data.result.totalNum || 0;
                    if (n.data.totalNum == 0) {
                        $scope.totalpage = 0;
                        $scope.Datalist = [];
                        layer.msg(gjh27);
                    }
                    $scope.totalpage = function () {
                        return Math.ceil(n.data.result.totalNum / $scope.pagesize)
                    }
                    pageFun();
                }else if(n.data.statusCode == 403){
                    layer.msg('没有该权限')
                }
            }, err)
        }

        getList();
        //点击表格行留下颜色
        $scope.TrClick = function (i) {
            $scope.focus = i;
        }

        //分页
        function pageFun() {
            $(".pagegroup").jqPaginator({
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
                    getList();
                }
            });
        }

        //加入黑名单
        $scope.addBlank = function (item) {
            console.log(item);
            layer.confirm(gjh30, {
                        title: '操作提示',
                        icon: 3,
                        btn: [gjh10, gjh55] //按钮
                    }, function (ca) {
                        layer.close(ca);
                    }, function (index) {
                        erp.postFun('app/user/updateAffAccountByDistributionState', {
                            id: item.id,
                            'distributionState': '5'
                        }, function (res) {
                            if (res.data.code == 200) {
                                layer.msg(gjh24);
                                layer.close(index);
                                getList();
                            } else {
                                layer.msg(gjh25)
                            }
                        }, function (res) {
                            layer.msg(gjh25)
                        })
                    }
            );
        }
        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            $scope.pageNum = '1';
            getList();
        }
        $scope.pagenumchange = function () {
            console.log($scope.pageNum % 1)
            $scope.pageNum = $(".goyema").val() - 0;
            if ($scope.pageNum < 1 || $scope.pageNum > $scope.totalpage()) {
                layer.msg(gjh29);
                $(".goyema").val(1)
            } else {
                getList();
            }
        }
        //搜索
        $scope.Search = function () {
            $scope.pageNum = '1';
            getList();
        }
        //按下enter搜索
        $scope.enterSearch = function (event) {
            if (event.keyCode === 13 || event.keyCode === 108) {
                $scope.pageNum = '1';
                getList();
            }
        }

        function err(n) {
            // erp.closeLoad();
            layer.closeAll('loading');
            console.log(n);
            $scope.Datalist = [];
        }
    }])
    //入库绩效记录
    app.controller('rkjxTjCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        //客户页面
        console.log('入库记录')
        $scope.pagesize = '50';
        $scope.pagenum = '1';
        $scope.totalNum = 0;
        $scope.storageId = '';
        $scope.supplier_name = '';
        $scope.isAdminFlag = erp.isAdminLogin()

        function getList() {
            erp.load();
            var upData = {
                startTime: $('#left-time').val(),
                endTime: $('#right-time').val(),
                pageNum:$scope.pagenum,
                pageSize:$scope.pagesize,
                data:{
                    SKU:$scope.searchLongSku,
                    storageSite:$scope.searchWz,
                    storageUserName:$scope.searchRkr,
                    spShortCode: $scope.searchShortSku,
                    remark1: $scope.searchDdh,
                    storageId: $scope.storageId,
                    supplier_name: $scope.supplier_name
                }
            };
            erp.postFun('storehouseSimple/inventoryRecord/getStorageLogInfo', JSON.stringify(upData), con, err)

            function con(n) {
                console.log(n)
                erp.closeLoad();
                if (n.data.code == 200) {
                    $scope.listArr = n.data.data.list;
                    console.log($scope.listArr)
                    $scope.totalNum = n.data.data.total || 0;
                    if (n.data.totalNum == 0) {
                        $scope.totalpage = 0;
                        $scope.listArr = [];
                    }
                    $scope.totalpage = Math.ceil($scope.totalNum / $scope.pagesize)
                    $scope.$broadcast('page-data', {
                        pageSize: $scope.pagesize.toString(),
                        pageNum: $scope.pagenum,
                        totalNum: $scope.totalpage,
                        totalCounts: $scope.totalNum,
                        pageList: ['20','30','50','100']
                    });
                }
            }
        }

        getList();
        $scope.timeSFun = function () {
            $scope.pagenum = '1';
            type = '';
            $('.time-span').removeClass('active-color');
            getList();
        }
        $scope.searchFun = function () {
            $scope.pagenum = '1';
            getList();
        }
        // 分页触发
        $scope.$on('pagedata-fa', function(d, data) {
            $scope.pagenum = data.pageNum;
            $scope.pagesize = data.pageSize;
            getList();
        });
        $scope.clearFun=function(){
            $scope.pagenum = '1';
            $('#left-time').val('');
            $('#right-time').val('');
            $scope.searchRkr='';
            $scope.searchLongSku='';
            $scope.searchWz='';
            $scope.searchShortSku='';
            $scope.searchDdh='';
            $scope.storageId='';
            getList();
        }
        $('.sku-inp').keypress(function (event) {
            if (event.keyCode == 13) {
                $scope.searchFun()
            }
        });
        //获取仓库
        $scope.ckArr = erp
            .getStorage()
            .map(_ => ({ id: _.dataId, storageName: _.dataName }));

        $scope.selByStorageFun = function () {
            $scope.pagenum = '1';
            getList(erp,$scope);
        }
        $scope.showOrdFun = function (item) {
            $scope.ordFlag = true;
            $scope.ordList = item.remark1;
            console.log($scope.ordList)
        }
        $scope.showSyOrdFun = function (item) {
            $scope.ordFlag = true;
            $scope.ordList = item.priFeiPeiId;
            console.log($scope.ordList)
        }
        function err() {
            layer.msg('系统异常')
        }
    }])
     //erp财务--客户钱包-用户账单查询
    app.controller('billInquiryCtrl', ['$scope', '$location', 'erp', function ($scope, $location, erp) {
        console.log('用户账单查询')
        
        const paymentType = {
            "订单-卡付款": 'Stripe',
            "转账-银行卡付款": "Wire Transfer",
            "订单-PayPal付款": "PayPal",
            "订单-Payeezy付款": "CJPay",
            "订单-余额付款": "Store Credit",
            "视频订单-余额付款": "Store Credit",
            "订单-Payssion付款": "Payssion",
            "COD订单-财务打款到cod商家钱包": "COD Order Collection",
            "余额扣款": "Balance Payment",
            "余额抵扣": "Balance Deduction",
            "库存抵扣": "Inventory Deduction",
            "等待-paypal确认到账": "Pending",
            "退款": "Refund",
            "DHL shipping cost": "DHL shipping cost",
            "payoneer": "Payoneer",
            "paypal": "Paypal",
            "stripe": "Stripe",
            "wire_transfer": "Wire Transfer",
            "订单-Payoneer付款": "Payoneer",
            "订单-退款": "Refund",
            "订单-GlobalAlipay付款":"Alipay Global"
        }

        
        $scope.pageNum = 1;
        $scope.pageSize = 10;
        
        $scope.getList = function() {
            var params = {};
            params.page = $scope.pageNum;
            params.size = $scope.pageSize;
            params.userName = $scope.searchContent
            layer.load(2);
            erp.postFun("erp/wallet/getCustomerWatercourse", params, function (res) {
                console.log(res)
                $scope.billList = res.data.result.list.map(item => {
							item.paymenttype = paymentType[item.paymenttype] || ''
							if (item.image) item.image = item.type === '2' || item.type === '6' ? item.image.split(',') : item.image.split(',')
							return item
						});
                $scope.$broadcast('page-data', {
                    pageSize: $scope.pageSize.toString(),
                    pageNum: $scope.pageNum,
                    totalCounts: res.data.result.total,
                    pageList: ['10','20','50', '100', '200']
                });
                layer.closeAll('loading')
            }, function (err) { layer.closeAll('loading')})
        }

         // 分页触发
        $scope.$on('pagedata-fa', function(d, data) {
            $scope.pageNum = parseInt(data.pageNum);
            $scope.pageSize = parseInt(data.pageSize);
            $scope.getList();
        });

        if($location.search().userName) {
            $scope.searchContent = $location.search().userName;
            $scope.getList();
        }
    }])
})()
