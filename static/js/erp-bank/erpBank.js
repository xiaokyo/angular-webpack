(function(){
    var app = angular.module('erp-bank', []);
    //银行账户管理
    app.controller('bankacountCtrl',['$scope', '$routeParams', 'erp',function($scope,$routeParams,erp){

        $scope.searchinfo='';
        $scope.pageNum = '1';
        $scope.pageSize='20';
        $scope.bankName='';
        $scope.currencyType='';
        $scope.status='';

        getBankList();
        getBankNameList();
        getBZList();
        function getBankList(){
            var data = {
                "cardNumber":$scope.searchinfo,
                "bankName":$scope.bankName,
                "currencyType":$scope.currencyType,
                "status":$scope.status,
                "pageNum":$scope.pageNum,
                "pageSize":$scope.pageSize
            };
            erp.postFun('app/bankAccount/getBankAccountByCondition',JSON.stringify(data),function(data){
                console.log(data);
                $scope.bankList = data.data.list;
                $scope.banktotalCounts = data.data.count;
                getBankpageFun();
                //if(data.data.list.length>0){
                //
                //}else{
                //    layer.msg('暂无数据');
                //}

            },function(data){
                layer.msg('系统错误');
            });
        }
        //更换每页多少条数据
        $scope.pagechange = function (pagesize) {
            console.log(pagesize);
            // $scope.pagesize=pagesize-0;
            $scope.pageNum = 1;
            getBankList();
        };
        //手动输入页码GO跳转
        $scope.pagenumchange = function () {
            var pagenum = Number($scope.pageNum);
            var totalpage = Math.ceil($scope.banktotalCounts / $scope.pageSize);
            if (pagenum > totalpage) {
                layer.msg('错误页码');
                $scope.pageNum = 1;
            }else {
                getBankpageFun();
            }
        };
        //分页函数
        function getBankpageFun() {
            // console.log($scope.customerList4.total,$scope.pagesize)
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.banktotalCounts || 1,
                pageSize: $scope.pageSize * 1,
                visiblePages: 5,
                currentPage: $scope.pageNum * 1,
                activeClass: 'current',
                first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
                prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
                next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
                last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
                page: '<a href="javascript:void(0);">{{page}}<\/a>',
                onPageChange: function (n) {
                    $scope.pageNum = n;
                    // $("#pagination-demo-text").html("当前第" + n + "页");
                    erp.postFun('app/bankAccount/getBankAccountByCondition', {
                        "cardNumber":$scope.searchinfo,
                        "bankName":$scope.bankName,
                        "currencyType":$scope.currencyType,
                        "status":$scope.status,
                        "pageNum":$scope.pageNum,
                        "pageSize":$scope.pageSize
                    }, function (data) {
                        $scope.bankList = data.data.list;
                    }, function (data) {
                        alert("分页错误")
                    });

                }
            });
        }
        $scope.setStatus=function(status){
            if(status==0){
                return  "启用"
            }else if(status==1){
                return  "注销"
            }
        };
        //搜索
        $scope.usersearch = function () {
            console.log($scope.searchinfo);
            //console.log(FormatDate($scope.searchDate));
            getBankList();
        };
        //按下enter搜索
        $(function () {
            $(".top-search-inp").keydown(function (event) {
                console.log(event.keyCode);
                if (event.keyCode === 13 || event.keyCode === 108) {
                    getBankList();
                }
            });
        });
        //获取银行列表
        function getBankNameList(){
            erp.postFun('app/bankAccount/getAllBankName',{},function(data){
                console.log(data);
                $scope.bankNameList = data.data;
            },function(data){
                layer.msg('系统错误');
            });
        }
        //根据银行名称删选
        $('#selectName').change(function(){
            var name = $(this).val();
            console.log(name);
            if(name=='' || name==null || name==undefined){
                $scope.bankName='';
            }else{
                $scope.bankName=name;
            }
            getBankList();
        });

        //获取币种列表
        function getBZList(){
            erp.postFun('app/bankAccount/getAllBankExchangeRate',{},function(data){
                console.log(data);
                $scope.bankBZList = data.data;
            },function(data){});
        }
        //根据币种删选
        $('#selectBZ').change(function(){
            var bz = $(this).val();
            console.log(bz);
            if(bz=='' || bz==null || bz==undefined){
                $scope.currencyType='';
            }else{
                $scope.currencyType=bz;
            }
            getBankList();
        });
        //根据状态删选
        $('#selectStatus').change(function(){
            var status= $(this).val();
            console.log(status);
            if(status=='' || status==null || status==undefined){
                $scope.status='';
            }else{
                $scope.status=status;
            }
            getBankList();
        });

        $scope.whmm=function(bankName,cardNo,bz,id,balance){
            console.log(balance);
            $('#whmm').show();
            $('#whmm h3').html('外汇买卖');
            $('#shouxufei-menu').hide();
            $('#whmm #Transferparities').parent().show();
            $('#whmm #zczh').html(cardNo);
            $('#whmm #zcyh').html(bankName);
            $('#whmm #zcbz').html(bz);
            $('#zcye').attr('data-price',balance).html('');
            $('#zrye').html('');
            //console.log($scope.bankList);
            $('#whmmSubmit').attr('data-id',id);
            $('#TransferAmount').val('');
            $('#Transferparities').val('');
            $('#shouxifei').val('');
            $('#transferInto').val('');
            $('.zzc-content').find('.error').removeClass('error');
            $('.tishi').hide();
            $('#whmmSubmit').show();
            $('#whmmSubmit2').hide();
            var rmbList = [];
            $.each($scope.bankList,function(i,v){
                if(v.currencyType=="RMB" && v.status==0){
                    rmbList.push(v);
                }
            });
            console.log(rmbList);
            if(rmbList.length>0){
                $.each(rmbList,function(i,v){
                    var name = v.bankName;
                    var card = v.cardNumber;
                    var start = card.slice(0,4);
                    var end =card.slice(-4);
                    var str = name+"("+start+"*****"+end+")";
                    v.zh=str;
                });
                console.log(rmbList);
                $scope.rmbList=rmbList;
            }else{
                $('.tishi').html('没有找到RMB转入账户').show();
                $('#whmmSubmit').hide();
                $scope.rmbList=[];
            }
            if(balance==0){
                $('.tishi').html('该账户余额为零，不能进行外汇买卖').show();
                $('#whmmSubmit').hide();
            }


        };
        $scope.nbzz=function(bankName,cardNo,bz,id,balance){
            $('#whmm').show();
            $('#whmm h3').html('内部转账');
            $('#shouxufei-menu').show();
            $('#whmm #Transferparities').parent().hide();
            $('#whmm #zczh').html(cardNo);
            $('#whmm #zcyh').html(bankName);
            $('#whmm #zcbz').html(bz);
            $('#zcye').attr('data-price',balance).html('');
            $('#zrye').html('');
            //console.log($scope.bankList);
            $('#whmmSubmit2').attr('data-id',id);
            $('#TransferAmount').val('');
            $('#Transferparities').val('');
            $('#shouxifei').val('');
            $('#transferInto').val('');
            $('.zzc-content').find('.error').removeClass('error');
            $('.tishi').hide();
            $('#whmmSubmit2').show();
            $('#whmmSubmit').hide();
            var rmbList = [];
            $.each($scope.bankList,function(i,v){
                if(v.id!=id){
                    if(v.currencyType==bz && v.status==0){
                        rmbList.push(v);
                    }
                }
            });
            console.log(rmbList);
            if(rmbList.length>0){
                $.each(rmbList,function(i,v){
                    var name = v.bankName;
                    var card = v.cardNumber;
                    var start = card.slice(0,4);
                    var end =card.slice(-4);
                    var str = name+"("+start+"*****"+end+")";
                    v.zh=str;
                });
                console.log(rmbList);
                $scope.rmbList=rmbList;
            }else{
                $('.tishi').html('没有找到该币种的转入账户').show();
                $('#whmmSubmit2').hide();
                $scope.rmbList=[];
            }
            if(balance==0){
                $('.tishi').html('该账户余额为零，不能进行外汇买卖').show();
                $('#whmmSubmit2').hide();
            }

        };
        $('#whmmCancle').click(function(){
            console.log($(this));
            var ele = $(this).parent().parent().parent();
            ele.hide();
        });
        //转出金额判断
        $('#TransferAmount').blur(function(){
            var title = $('.zzc-content>h3').html();
            var balance = $('#zcye').attr('data-price')*1;
            console.log(balance);
            var zcje = $(this).val();
            //console.log(zcje);
            if(zcje==null || zcje==undefined || zcje==''){
                layer.msg('转出金额不能为空');
                $(this).addClass('error');
            }else{
                if(isNotANumber(zcje)){
                    //console.log('是数字');
                    if(zcje>balance){
                        layer.msg('转出金额超过该账户余额');
                        $(this).addClass('error');
                    }else{
                        $(this).removeClass('error');
                        if(title=='外汇买卖'){
                            var zchl = $('#Transferparities').val();
                            if(zchl==null || zchl==undefined || zchl==''){
                            }else{
                                if(isNotANumber(zchl)){
                                    //console.log('汇率是数字');
                                    var zczh = $('#transferInto').val();
                                    if(zczh==null || zczh==undefined || zczh==''){
                                    }else{
                                        //去计算
                                        //console.log('去计算');
                                        mathYUEFun(zcje,zchl,zczh);
                                    }
                                }
                            }
                        }else if(title=='内部转账'){
                            var sxf = $('#shouxifei').val();
                            console.log('内部转账',sxf);
                            if(sxf==null || sxf=='' || sxf==undefined){
                            }else{
                                if(isNotANumber(sxf)){
                                    var zczh = $('#transferInto').val();
                                    if(zczh==null || zczh==undefined || zczh==''){
                                    }else{
                                        //去计算
                                        //console.log('去计算');
                                        //mathYUEFun(zcje,zchl,zczh);
                                        mathNeibuFun(zcje,sxf,zczh);
                                    }
                                }
                            }
                        }

                    }

                }else{
                    layer.msg('请填写数字');
                    $(this).addClass('error');
                }
            }
        });
        //手续费判断
        $('#shouxifei').blur(function(){
            var balance = $('#zcye').attr('data-price')*1;
            var sxf = $(this).val();
            if(sxf==null || sxf=='' || sxf==undefined){
                layer.msg('手续费不能为空');
                $(this).addClass('error');
            }else{
                if(isNotANumber(sxf)){
                    if(sxf>balance){
                        layer.msg('手续费不能超过转出金额');
                        $(this).addClass('error');
                    }else{
                        $(this).removeClass('error');
                        var zcje = $('#TransferAmount').val();
                        if(zcje==null || zcje=='' || zcje==undefined){
                        }else{
                            if(isNotANumber((zcje))){
                                var zczh = $('#transferInto').val();
                                if(zczh==null || zczh==undefined || zczh==''){
                                }else{
                                    //去计算
                                    //console.log('去计算');
                                    mathNeibuFun(zcje,sxf,zczh);
                                }
                            }
                        }
                    }
                }else{
                    layer.msg('请填写数字');
                    $(this).addClass('error');
                }
            }
        });

        //转出汇率判断
        $('#Transferparities').blur(function(){
            var zchl = $(this).val();
            if(zchl==null || zchl=='' || zchl==undefined){
                layer.msg('转出汇率不能为空');
                $(this).addClass('error');
            }else{
                if(isNotANumber(zchl)){
                    $(this).removeClass('error');
                    var zcje = $('#TransferAmount').val();
                    if(zcje==null || zcje=='' || zcje==undefined){
                    }else{
                        if(isNotANumber(zcje)){
                            var zczh = $('#transferInto').val();
                            if(zczh==null || zczh==undefined || zczh==''){
                            }else{
                                //去计算
                                //console.log('去计算');
                                mathYUEFun(zcje,zchl,zczh);
                            }
                        }
                    }
                }else{
                    layer.msg('请填写数字');
                    $(this).addClass('error');
                }
            }
        });
        //转出账户判断
        $('#transferInto').change(function(){
            var title = $('.zzc-content>h3').html();
            var id  = $(this).val();
            //console.log(id);
            if(id==null || id=='' || id==undefined){
                layer.msg('请选择转出账户');
            }else{
                var zcje = $('#TransferAmount').val();
                if(zcje==null || zcje=='' || zcje==undefined){
                }else{
                    if(isNotANumber(zcje)){
                        if(title=="外汇买卖"){
                            console.log('外汇买卖');
                            var zchl = $('#Transferparities').val();
                            if(zchl==null || zchl=='' || zchl==undefined){
                            }else{
                                if(isNotANumber(zchl)){
                                    //console.log('去计算');
                                    mathYUEFun(zcje,zchl,id);
                                }
                            }
                        }else if(title=="内部转账"){
                            var sxf = $('#shouxifei').val();
                            console.log('内部转账',sxf);
                            if(sxf==null || sxf==undefined || sxf==''){
                            }else{
                                if(isNotANumber(sxf)){
                                    mathNeibuFun(zcje,sxf,id);
                                }
                            }
                        }
                    }
                }
            }
        });

        function mathNeibuFun(zcje,sxf,id){
            //console.log(zcje,sxf,id);
            var zcje =zcje*1;
            var sxf= sxf*1;
            var id =id*1;
            var zcye = ($('#zcye').attr('data-price'))*1;
            var zrye;
            var arr = $scope.rmbList;
            $.each(arr,function(i,v){
                if(v.id==id){
                    zrye = v.bankBalance;
                }
            });
            console.log(zcye,zrye);
            zcye=zcye-zcje-sxf;
            zrye=zrye+zcje;
            console.log(zcje,zcye,zrye);
            $('#zcye').html(zcye);
            $('#zrye').html(zrye);
        }

        function mathYUEFun(zcje,zchl,id){
            //console.log(zcje,zchl,id);
            var zcje = zcje*1;
            var zchl = zchl*1;
            var id =id*1;
            console.log(zcje,zchl,id);
            var zcye = ($('#zcye').attr('data-price'))*1;
            var zrye;
            var arr = $scope.rmbList;
            $.each(arr,function(i,v){
                if(v.id==id){
                    zrye = v.bankBalance;
                }
            });
            console.log(zcye,zrye);
            var zrje = zcje*zchl;
            zcye=zcye-zcje;
            zrye = zrye+zrje;
            console.log(zcye,zrye);
            $('#zcye').html(zcye);
            $('#zrye').html(zrye);
        }
        function isNotANumber(inputData) {
            if (parseFloat(inputData).toString() == "NaN") {
                //alert("请输入数字……");注掉，放到调用时，由调用者弹出提示。
                return false;
            } else {
                return true;
            }
        }
        //外汇买卖确认
        $('#whmmSubmit').click(function(){
            var zcje = $('#TransferAmount').val();
            var zchl = $('#Transferparities').val();
            var zrzh = $('#transferInto').val();
            var balance = $('#zcye').attr('data-price')*1;
            var zcid =  $('#whmmSubmit').attr('data-id');
            var beizhu = $('#beizhuInfo').val();
            if(zcje==null || zcje=='' || zcje==undefined){
                layer.msg('请输入转出金额')
            }else if(!isNotANumber(zcje)){
                layer.msg('请输入正确的转出金额');
            }else if(zcje>balance){
                layer.msg('转出金额超过该账户余额');
            }else if(zchl==null ||zchl=='' || zchl==undefined){
                layer.msg('请输入转出汇率');
            }else if(!isNotANumber(zchl)){
                layer.msg("请输入正确的转出汇率");
            }else if(zrzh==null || zrzh=='' || zrzh==undefined){
                layer.msg('请选择转入账户');
            }else{
                //console.log('可以生成流水');
                var zczh =$('#zczh').html();
                var srzh;
                var bz = $('#zcbz').html();
                var zhuanru = zcje*zchl;
                var data =[{
                    "type":1,//0收入，1支出
                    "money":zcje,//转出金额
                    "incomeAccountId":zrzh,//收入账号
                    "expenditureAccountId":zcid,//支出账号
                    "summary":beizhu,//备注
                    "currencyType":bz,//币种
                    "rate":zchl,//汇率
                    "feeMoney":"",//手续费
                    "source":"0"//

                },{
                    "type":0,//0收入，1支出
                    "money":zhuanru,//转出金额
                    "incomeAccountId":zrzh,//收入账号
                    "expenditureAccountId":zcid,//支出账号
                    "summary":beizhu,//备注
                    "currencyType":"RMB",//币种
                    "rate":1,//汇率
                    "feeMoney":"",//手续费
                    "source":"0"//

                }];
                erp.postFun('app/bankCapitalFlow/addBankCapitalFlow',JSON.stringify(data),function(data){
                    console.log(data);
                    if(data.data.result==true){

                        var zcye = $('#zcye').html();
                        var zrye = $('#zrye').html();
                        var data =[
                            {
                                "id":zcid,
                                "bankBalance":zcye,
                                "cardNumber":"",
                                "bankName":"",
                                "currencyType":"",
                                "describe":""
                            },{
                                "id":zrzh,
                                "bankBalance":zrye,
                                "cardNumber":"",
                                "bankName":"",
                                "currencyType":"",
                                "describe":""
                            }
                        ];
                        erp.postFun('app/bankAccount/updateBankAccount',JSON.stringify(data),function(data){
                            console.log(data);
                            if(data.data.result==true){
                                $('#whmm').hide();
                                getBankList();
                            }
                        },function(data){});
                    }
                },function(data){});
            }
        });

        //内部转账确认
        $('#whmmSubmit2').click(function(){
            var zcje = $('#TransferAmount').val();
            var sxf = $('#shouxifei').val();
            var zrzh = $('#transferInto').val();
            var balance = $('#zcye').attr('data-price')*1;
            var zcid =  $('#whmmSubmit2').attr('data-id');
            var beizhu = $('#beizhuInfo').val();
            if(zcje==null || zcje=='' || zcje==undefined){
                layer.msg('请输入转出金额')
            }else if(!isNotANumber(zcje)){
                layer.msg('请输入正确的转出金额');
            }else if(zcje>balance){
                layer.msg('转出金额超过该账户余额');
            }else if(sxf==null ||sxf=='' || sxf==undefined){
                layer.msg('请输入转出汇率');
            }else if(!isNotANumber(sxf)){
                layer.msg("请输入正确的转出汇率");
            }else if(sxf>balance){
                layer.msg('手续费超过该账户余额');
            }else if(zrzh==null || zrzh=='' || zrzh==undefined){
                layer.msg('请选择转入账户');
            }else{
                //console.log('可以生成流水');
                var zczh =$('#zczh').html();
                var srzh;
                var bz = $('#zcbz').html();
                var data =[{
                    "type":1,//0收入，1支出
                    "money":zcje,//转出金额
                    "incomeAccountId":zrzh,//收入账号
                    "expenditureAccountId":zcid,//支出账号
                    "summary":beizhu,//备注
                    "currencyType":bz,//币种
                    "rate":"",//汇率
                    "feeMoney":sxf,//手续费
                    "source":"1"//
                },{
                    "type":0,//0收入，1支出
                    "money":zcje,//转出金额
                    "incomeAccountId":zrzh,//收入账号
                    "expenditureAccountId":zcid,//支出账号
                    "summary":beizhu,//备注
                    "currencyType":bz,//币种
                    "rate":"",//汇率
                    "feeMoney":sxf,//手续费
                    "source":"1"//
                }];
                console.log(data);
                erp.postFun('app/bankCapitalFlow/addBankCapitalFlow',JSON.stringify(data),function(data){
                    console.log(data);
                    if(data.data.result==true){

                        var zcye = $('#zcye').html();
                        var zrye = $('#zrye').html();
                        var data =[
                            {
                                "id":zcid,
                                "bankBalance":zcye,
                                "cardNumber":"",
                                "bankName":"",
                                "currencyType":"",
                                "describe":""
                            },{
                                "id":zrzh,
                                "bankBalance":zrye,
                                "cardNumber":"",
                                "bankName":"",
                                "currencyType":"",
                                "describe":""
                            }
                        ];
                        erp.postFun('app/bankAccount/updateBankAccount',JSON.stringify(data),function(data){
                            console.log(data);
                            if(data.data.result==true){
                                $('#whmm').hide();
                                getBankList();
                            }
                        },function(data){});
                    }
                },function(data){});
            }
        });

        //启用
        $scope.qiyong=function(id){
            layer.confirm('确认要启用吗？', {
                btn : [ '确定', '取消' ]//按钮
            }, function(index) {
                layer.close(index);
                var data = {
                    "id":id,
                    "status":"0"
                };
                //console.log(data);
                erp.postFun('app/bankAccount/changeBankAccountState',JSON.stringify(data),function(data){
                    console.log(data);
                    if(data.data.result==true){
                        getBankList();
                    }else{
                        layer.msg('启用失败');
                    }
                },function(data){
                    layer.msg('系统错误');
                });
            });
        };
        //注销
        $scope.zhuxiao=function(id){
            layer.confirm('确认要注销吗？', {
                btn : [ '确定', '取消' ]//按钮
            }, function(index) {
                layer.close(index);
                var data = {
                    "id":id,
                    "status":"1"
                };
                //console.log(data);
                erp.postFun('app/bankAccount/changeBankAccountState',JSON.stringify(data),function(data){
                    console.log(data);
                    if(data.data.result==true){
                        getBankList();
                    }else{
                        layer.msg('注销失败');
                    }
                },function(data){
                    layer.msg('系统错误');
                });
            });
        };

        //新增账户
        $('#addAccountBtn').click(function(){
            $('#zhxx').show();
            $('#bankName').val('');
            $('#cardNumber').val('');
            $('#selectBZ2').val('');
            $('#bankBalance').val('');
            $('#describe').val('');
            $('#addAccount').show();
            $('#updateAccount').hide();
        });
        //确认新增
        $('#addAccount').click(function(){
            var bankName = $('#bankName').val();
            var cardNumber = $('#cardNumber').val();
            var currencyType = $('#selectBZ2').val();
            var bankBalance = $('#bankBalance').val();
            var describe = $('#describe').val();
            if(bankName==null || bankName=='' || bankName==undefined){
                layer.msg('银行名称不能为空');
            }else if(cardNumber==null || cardNumber=='' || cardNumber==undefined){
                layer.msg('银行卡号不能为空');
            }else if(!isNotANumber(cardNumber)){
                layer.msg('银行卡号不能含有非数字');
            }else if(currencyType=='' || currencyType==null || currencyType==undefined){
                layer.msg('请选择币种');
            }else if(bankBalance=='' || bankBalance==null || bankBalance==undefined){
                layer.msg('账户余额不能为空');
            }else if(!isNotANumber(bankBalance)){
                layer.msg('账户余额不能含有非数字');
            }else{
                var data = {
                    "bankName":bankName,
                    "cardNumber":cardNumber,
                    "currencyType":currencyType,
                    "bankBalance":bankBalance,
                    "describe":describe
                };
                //console.log(data);
                erp.postFun('app/bankAccount/addBankAccount',JSON.stringify(data),function(data){
                    console.log(data);
                    if(data.data.result==true){
                        $('#zhxx').hide();
                        getBankList();
                    }
                },function(data){});
            }
        });
        //关闭账户信息
        $('#zhxxCancle').click(function(){
            $('#zhxx').hide();
        });
        //修改
        $scope.updatezh=function(bank){
            $('#zhxx').show();
            $('#bankName').val(bank.bankName);
            $('#cardNumber').val(bank.cardNumber);
            $('#selectBZ2').val(bank.currencyType);
            $('#bankBalance').val(bank.bankBalance);
            $('#describe').val(bank.describe);
            $('#addAccount').hide();
            $('#updateAccount').show().attr('data-id',bank.id);
        };
        //确认修改
        $('#updateAccount').click(function(){
            var bankName = $('#bankName').val();
            var cardNumber = $('#cardNumber').val();
            var currencyType = $('#selectBZ2').val();
            var bankBalance = $('#bankBalance').val();
            var describe = $('#describe').val();
            if(bankName==null || bankName=='' || bankName==undefined){
                layer.msg('银行名称不能为空');
            }else if(cardNumber==null || cardNumber=='' || cardNumber==undefined){
                layer.msg('银行卡号不能为空');
            }else if(!isNotANumber(cardNumber)){
                layer.msg('银行卡号不能含有非数字');
            }else if(currencyType=='' || currencyType==null || currencyType==undefined){
                layer.msg('请选择币种');
            }else if(bankBalance=='' || bankBalance==null || bankBalance==undefined){
                layer.msg('账户余额不能为空');
            }else if(!isNotANumber(bankBalance)){
                layer.msg('账户余额不能含有非数字');
            }else{
                var id = $(this).attr('data-id');
                var data = [{
                    "bankName":bankName,
                    "cardNumber":cardNumber,
                    "currencyType":currencyType,
                    "bankBalance":bankBalance,
                    "describe":describe,
                    "id":id
                }];
                erp.postFun('app/bankAccount/updateBankAccount',data,function(data){
                    console.log(data);
                    if(data.data.result==true){
                        $('#zhxx').hide();
                        getBankList();
                    }
                },function(data){});
            }
        });

    }]);

    //银行流水
    app.controller('bankWaterCtrl',['$scope', '$routeParams', 'erp',function($scope,$routeParams,erp){

        $scope.searchInfo='';
        $scope.currencyType="";
        $scope.incomeAccount="";
        $scope.expenditureAccount="";
        $scope.summary="";
        $scope.startTime="";
        $scope.endTime="";
        $scope.pageNum='1';
        $scope.pageSize='20';

        //更换每页多少条数据
        $scope.pagechange = function (pagesize) {
            console.log(pagesize);
            // $scope.pagesize=pagesize-0;
            $scope.pageNum = 1;
            getWaterList();
        };
        //手动输入页码GO跳转
        $scope.pagenumchange = function () {
            var pagenum = Number($scope.pageNum);
            var totalpage = Math.ceil($scope.waterTotalCount / $scope.pageSize);
            if (pagenum > totalpage) {
                layer.msg('错误页码');
                $scope.pageNum = 1;
            }else {
                getWaterPageFun();
            }
        };

        getWaterList();
        getBZList();
        //获取流水列表
        function getWaterList(){
            var data = {
                "currencyType":$scope.currencyType,
                "incomeAccount":$scope.incomeAccount,
                "expenditureAccount":$scope.expenditureAccount,
                "summary":$scope.summary,
                "startTime":$scope.startTime,
                "endTime":$scope.endTime,
                "pageNum":$scope.pageNum,
                "pageSize":$scope.pageSize
            };
            erp.postFun('app/bankCapitalFlow/getBankCapitalFlowByCondition',JSON.stringify(data),function(data){
                console.log(data);
                if(data.data.code==1){
                    var result = data.data.result;
                    $scope.waterTotalCount= data.data.total;
                    erp.postFun('app/bankAccount/getAllBankExchangeRate',{},function(data){
                        console.log(data);
                        var bankBZList = data.data;
                        console.log(bankBZList);
                        $.each(result,function(i,v){
                            v.createTime = timestampToTime(v.time.time);
                            var time = v.createTime.split(' ');
                            v.createTime2 = time[0];
                            var target =v;
                            v.money = (v.money).toFixed(2);
                            v.incomeAccountCardNumber2 = cardNumberChange(v.incomeAccountCardNumber);
                            v.expenditureAccountCardNumber2 = cardNumberChange(v.expenditureAccountCardNumber);
                            if(v.rate=='' || v.rate==null || v.rate==undefined){
                                //获取币种
                                var bz = v.currencyType;
                                $.each(bankBZList,function(i,v){
                                    if(bz==v.currencyType){
                                        target.RMBMoney = (target.money*v.exchangeRate).toFixed(2);
                                        target.rate = v.exchangeRate;
                                    }
                                });
                            }else{
                                var rate = v.rate;
                                v.RMBMoney = (v.money*rate).toFixed(2);
                            }
                        });

                        $.each(result,function(i,v){
                            if(v.type==0){
                                //收入
                                v.szid = v.incomeAccountId;
                                v.szBankName = v.incomeAccountBankName;
                                v.szCardNumber=v.incomeAccountCardNumber;
                                v.szCardNumber2=v.incomeAccountCardNumber2;
                            }else if(v.type==1){
                                //支出
                                v.szid = v.expenditureAccountID;
                                v.szBankName = v.expenditureAccountBankName;
                                v.szCardNumber=v.expenditureAccountCardNumber;
                                v.szCardNumber2=v.expenditureAccountCardNumber2;
                            }
                        });
                        console.log(result);
                        $scope.waterList = result;
                        getWaterPageFun();
                    },function(data){});
                }
            },function(data){
                layer.msg('系统错误');
            });
        }
        //卡号变成保密
        function cardNumberChange(card){
            var start = card.slice(0,4);
            var end =card.slice(-4);
            var str = start+"*****"+end;
            return str;
        }

        //分页函数
        function getWaterPageFun() {
            // console.log($scope.customerList4.total,$scope.pagesize)
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.waterTotalCount || 1,
                pageSize: $scope.pageSize * 1,
                visiblePages: 5,
                currentPage: $scope.pageNum * 1,
                activeClass: 'current',
                first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
                prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
                next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
                last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
                page: '<a href="javascript:void(0);">{{page}}<\/a>',
                onPageChange: function (n) {
                    $scope.pageNum = n;
                    var data = {
                        "currencyType":$scope.currencyType,
                        "incomeAccount":$scope.incomeAccount,
                        "expenditureAccount":$scope.expenditureAccount,
                        "summary":$scope.summary,
                        "startTime":$scope.startTime,
                        "endTime":$scope.endTime,
                        "pageNum":$scope.pageNum,
                        "pageSize":$scope.pageSize
                    };
                    // $("#pagination-demo-text").html("当前第" + n + "页");dat
                    erp.postFun('app/bankCapitalFlow/getBankCapitalFlowByCondition',JSON.stringify(data), function (data) {
                        var result = data.data.result;
                        $.each(result,function(i,v){
                            v.createTime = timestampToTime(v.time.time);
                            var time = v.createTime.split(' ');
                            v.createTime2 = time[0];
                            var target =v;
                            v.money = (v.money).toFixed(2);
                            v.incomeAccountCardNumber2 = cardNumberChange(v.incomeAccountCardNumber);
                            v.expenditureAccountCardNumber2 = cardNumberChange(v.expenditureAccountCardNumber);
                            if(v.rate=='' || v.rate==null || v.rate==undefined){
                                //获取币种
                                var bz = v.currencyType;
                                $.each($scope.bankBZList,function(i,v){
                                    if(bz==v.currencyType){
                                        target.RMBMoney = (target.money*v.exchangeRate).toFixed(2);
                                        target.rate = v.exchangeRate;
                                    }
                                });
                            }else{
                                var rate = v.rate;
                                v.RMBMoney = (v.money*rate).toFixed(2);
                            }
                        });
                        $.each(result,function(i,v){
                            if(v.type==0){
                                //收入
                                v.szid = v.incomeAccountId;
                                v.szBankName = v.incomeAccountBankName+v.incomeAccountCurrencyType;
                                v.szCardNumber=v.incomeAccountCardNumber;
                                v.szCardNumber2=v.incomeAccountCardNumber2;
                            }else if(v.type==1){
                                //支出
                                v.szid = v.expenditureAccountID;
                                v.szBankName = v.expenditureAccountBankName+v.expenditureAccountCurrencyType;
                                v.szCardNumber=v.expenditureAccountCardNumber;
                                v.szCardNumber2=v.expenditureAccountCardNumber2;
                            }
                        });
                        console.log(result);

                        $scope.waterList = result;
                    }, function (data) {
                        alert("分页错误")
                    });

                }
            });
        }
        //获取币种列表
        function getBZList(){
            erp.postFun('app/bankAccount/getAllBankExchangeRate',{},function(data){
                console.log(data);
                $scope.bankBZList = data.data;
            },function(data){});
        }
        //根据币种删选
        $('#selectCurrency').change(function(){
            var bz = $(this).val();
            console.log(bz);
            if(bz=='' || bz==null || bz==undefined){
                $scope.currencyType='';
            }else{
                $scope.currencyType=bz;
            }
            getWaterList();
        });
        function timestampToTime(timestamp) {
            var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            Y = date.getFullYear() + '-';
            M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            D = date.getDate() + ' ';
            h = date.getHours() + ':';
            m = date.getMinutes() + ':';
            s = date.getSeconds();
            return Y+M+D+h+m+s;
        }
        $scope.classType=function(type){
            if(type==0){
                return "收入"
            }else if(type==1){
                return "支出"
            }
        };
        $scope.classSource=function(source){
            if(source==0){
                return "外汇买卖"
            }else if(source==1){
                return "内部转账"
            }
        };
        $scope.nullSxf=function(sxf){
            if(sxf==null || sxf=='' || sxf==undefined){
                return "无";
            }else{
                return sxf;
            }
        };
        //按日期删选
        $scope.timeFun=function(){
            var startTime = $('#c-data-time').val();
            var endTime= $('#cdatatime2').val();
            //console.log(startTime,endTime);
            if(startTime==null || startTime=='' || startTime==undefined){
                layer.msg('请选择开始日期');
            }else{
                if(endTime==null || endTime=='' || endTime==undefined){
                    var date = new Date();
                    var year =date.getFullYear(); //获取完整的年份(4位,1970-????)
                    var month = date.getMonth()+1; //获取当前月份(0-11,0代表1月)
                    var day = date.getDate();
                    if(month<10){
                        month='0'+month;
                    }
                    if(day<10){
                        day='0'+day;
                    }
                    endTime=year+'-'+month+'-'+day;
                }
                console.log(startTime,endTime);

                $scope.startTime=startTime;
                $scope.endTime=endTime;
                getWaterList();
            }
        };
        $scope.usersearch=function(){
            var type = $('#searchType').val();
            var searchInfo = $('#searchInfo').val();
            $scope.incomeAccount="";
            $scope.expenditureAccount="";
            $scope.summary="";
            console.log(type,searchInfo);
            if(type=='1'){
                $scope.expenditureAccount=searchInfo;
            }else if(type=='2'){
                $scope.incomeAccount=searchInfo;
            }else if(type=='3'){
                $scope.summary=searchInfo;
            }
            getWaterList();
        };
        $('#searchType').change(function(){
            console.log('clear');
            $('#searchInfo').val('');
        });

    }]);
    //汇率设置
    app.controller('exchangeCtrl',['$scope', '$routeParams', 'erp',function($scope,$routeParams,erp){

        getExchangeList();
        function getExchangeList(){
            erp.postFun('app/bankAccount/getAllBankExchangeRate',{},function(data){
                console.log(data);
                var result = data.data;
                $scope.exchangeList= result;
            },function(data){});
        }

        //新增
        $('#xzhlBtn').click(function(){
            $('.zzc').show();
            $('.zzc-content').find('h4').html('新增汇率');
            $('#wbbz').val('');
            $('#hlsz').val('');
            $('#addexchange').show();
            $('#updateexchange').hide();
        });
        //新增确认
        $('#addexchange').click(function(){
            var currencyType = $('#wbbz').val();
            var exchangeRate = $('#hlsz').val();
            if(currencyType=='' || currencyType==null || currencyType==undefined){
                layer.msg('币种不能为空');
            }else if(exchangeRate=='' || exchangeRate == null || exchangeRate==undefined){
                layer.msg('汇率不能为空');
            }else if(exchangeRate.toString().split(".").length>1 && exchangeRate.toString().split(".")[1].length>4){
                layer.msg('汇率请保存小数点后4位');
            }else{
                var data = {
                    "currencyType":currencyType,
                    "exchangeRate":exchangeRate
                };
                erp.postFun('app/bankAccount/addBankExchangeRate',JSON.stringify(data),function(data){
                    if(data.data.result==true){
                        $('.zzc').hide();
                        getExchangeList();
                    }
                },function(data){});
            }
        });

        //修改
        $scope.updateHl=function(wbbz,hl,id){
            console.log(wbbz,hl);
            $('.zzc').show();
            $('.zzc-content').find('h4').html('修改汇率');
            $('#wbbz').val(wbbz);
            $('#hlsz').val(hl);
            $('#addexchange').hide();
            $('#updateexchange').show().attr('data-id',id);
        };
        //修改确认
        $('#updateexchange').click(function(){
            var currencyType = $('#wbbz').val();
            var exchangeRate = $('#hlsz').val();
            var id = $(this).attr('data-id');
            if(currencyType==null || currencyType=='' || currencyType==undefined){
                layer.msg('币种不能为空');
            }else if(exchangeRate==null || exchangeRate=='' || exchangeRate==undefined){
                layer.msg('汇率不能为空');
            }else if(exchangeRate.toString().split(".").length>1 && exchangeRate.toString().split(".")[1].length>4){
                layer.msg('汇率请保存小数点后4位');
            }else{
                var data ={
                    "currencyType":currencyType,
                    "exchangeRate":exchangeRate,
                    "id":id
                };
                erp.postFun('app/bankAccount/updateBankExchangeRate',JSON.stringify(data),function(data){
                    console.log(data);
                    if(data.data.result==true){
                        $('.zzc').hide();
                        getExchangeList();
                    }
                },function(data){});
            }
        });
        //关闭
        $('#closezzc').click(function(){
            $('.zzc').hide();
        });
        //删除
        $scope.deleteHl=function(id){
            layer.confirm('确认要删除吗？', {
                btn : [ '确定', '取消' ]//按钮
            }, function(index) {
                layer.close(index);
                var data = {
                    "id":id
                };
                //console.log(data);
                erp.postFun('app/bankAccount/deleteBankExchangeRate',JSON.stringify(data),function(data){
                    console.log(data);
                    if(data.data.result==true){
                        $('.zzc').hide();
                        getExchangeList();
                    }
                },function(data){});
            });
        }

    }]);

})();