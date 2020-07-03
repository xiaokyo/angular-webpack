(function () {
    var app = angular.module('erp-l', ['ngSanitize']);
    app.directive('repeatFinish', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, elem, attr) {
                //当前循环至最后一个  
                if (scope.$last === true) {
                    $timeout(function () {
                        //向父控制器传递事件消息  
                        scope.$emit('repeatFinishCallback');
                    }, 100);
                }
            }
        }
    });
    //erp物流查询
    app.controller('waybillsearchCtrl', ['$scope', 'erp', '$compile', function ($scope, erp, $compile) {
        console.log('waybillsearchCtrl');
        //输入单号设置textarea的换行
        $('.order-num-box-text').bind('input propertychange', function () {
            var aa = 0;
            var textnunm = $('.order-num-box-text').val().split("\n");
            var textnunm1 = textnunm.length;
            if (aa == textnunm1) {
                console.log("aa");
            } else {
                aa = textnunm1;
                $(".order-num-box>ul>li").remove();
                for (var i = 0; i < aa; i++) {
                    var li = '<li><span class="span-serial">' + (i + 1) + '</span></li>';
                    $(".order-num-box>ul").append(li);
                }
                console.log("bb");
            }
        });

        //点击搜索
        $scope.search = function () {
            var textarr = $('.order-num-box-text').val().split("\n");
            console.log(textarr);
            var textstring = textarr.join(",");
            console.log(textstring);
            erp.postFun2("getLogisticWay.json", {
                "keyword": textstring
            }, function (data) {
                console.log(data);
                if (data.status == 200) {
                    var obj = data.data;
                    //订单信息
                    $scope.logisticsDetails = obj.list;
                    //物流详细信息
                    //					console.log($scope.logisticsDetails);
                    $scope.bb = function () {
                        var msgsumArr = [];
                        for (var i = 0; i < $scope.logisticsDetails.length; i++) {
                            var waplength = $scope.logisticsDetails[i].trackingRecord;
                            var waplength1 = waplength.length;
                            var msgsumobj = waplength[waplength1 - 1];
                            msgsumArr.push(msgsumobj);
                        }
                        for (var i = 0; i < msgsumArr.length; i++) {
                            $(".repeat").eq(i).find(".this-new-dataem").html(msgsumArr[i].trackTm);
                            var lasttext = '[' + msgsumArr[i].oprBranch + ']' + '[' + msgsumArr[i].oprUser + ']' + msgsumArr[i].remark;
                            $(".repeat").eq(i).find(".this-new-data").html(lasttext);
                        }
                        //获取最后一条信息删除
                        //					var removelength = $(".show-more-box>dd").length;
                        //					$(".show-more-box>dd").eq(removelength-1).remove();
                    }
                }
            }, function (err) {
                alert("搜索失败");
            })


        }

        //点击清除
        $scope.clearAway = function () {
            console.log("清除了");
            $('.order-num-box-text').val("");
            $(".order-num-box>ul>li").remove();
        }

        //点击下拉框
        var cont = 1;
        $scope.aa = function () {
            $(".ea-channel-com-right-con").off("click", "i").on("click", "i", function () {
                if (cont == 1) {
                    $(this).addClass("active");
                    cont = 0;
                } else if (cont == 0) {
                    $(this).removeClass("active");
                    cont = 1;
                }
                console.log(cont);
                $(this).parents().children(".show-more-box").slideToggle(200);
            });
            return;
        }
    }])
    //erp物流运费设置
    app.controller('setmoneyCtrl', ['$scope', 'erp', function ($scope, erp) {
        $scope.$on('repeatFinishCallback', function () {
            $('.ea-list-table .dis-inp').attr('disabled', true)
            $('.ea-list-table .dis-inp').addClass('activedis')

        });
        var bs = new Base64();
        var erpLoginName = bs.decode(localStorage.getItem('erploginName') == undefined ? '' : localStorage.getItem('erploginName'));
        $scope.erpuserId = bs.decode(localStorage.getItem('erpuserId') || '');
        console.log(erpLoginName)
        if (erpLoginName == 'admin') {
            $scope.isAdminFlag = true;
        } else {
            $scope.isAdminFlag = false;
        }
        console.log('erpuserId ->', $scope.erpuserId);
        console.log('setmoneyCtrl')
        $scope.moneywin = false;
        $scope.timewin = false;
        $scope.scwin = false;
        $scope.wuliufangshi = '2';
        //      $scope.logicountry = [{country:"美国",cts:"us",especia:"巴西"},{country:"美国",cts:"us",especia:"巴西"}];
        $scope.logiststyleshow = false;
        //获取物流公司
        erp.postFun("app/erplogistics/getLogisticType", null, con, err);

        function getLogisticInfo(sendData) {
            erp.postFun("app/erplogistics/getLogisticInfo", JSON.stringify(sendData), function (data) {
                // console.log(data.data);
                if (data.status == 200) {
                    if ($scope.wuliufangshi == '1') {
                        $scope.newList = data.data;
                        for (var i = 0; i < $scope.newList.length; i++) {
                            if ($scope.newList[i].propertycn) {
                                $scope.newList[i].propertycn = JSON.parse($scope.newList[i].propertycn).join(',');
                            }
                        }
                    } else {
                        $scope.logicountry = data.data;
                        for (var i = 0; i < $scope.logicountry.length; i++) {
                            if ($scope.logicountry[i].propertycn) {
                                $scope.logicountry[i].propertycn = JSON.parse($scope.logicountry[i].propertycn).join(',');
                            }
                        }
                    }


                    var selectText = $("#ea-right-con2select").find("option:selected").text();
                    $scope.styletxt = selectText;
                    erp.postFun("app/erplogistics/queryLogisticMode", {
                        "param": sendData.nameen,
                        status: $scope.isSwitch
                    }, function (data) {
                        console.log(data);
                        erp.closeLoad()
                        $scope.showLogisticModeList = data.data.result;
                    }, function (data) {
                        erp.closeLoad()
                        console.log(data);
                        layer.msg('网络错误')
                    })
                }

            }, function (data) {
                console.log("网络错误1")
            })
        }

        function con(data) {
            console.log(data)
            $scope.logistStyle = data.data;
            console.log($scope.logistStyle)
            // $scope.Style = 'ePacket ';
            for (var i = 0; i < $scope.logistStyle.length; i++) {
                if ($scope.logistStyle[i].nameen == "ePacket") {
                    $scope.Style = $scope.logistStyle[i].nameen;
                }
            }
            getLogisticInfo({
                "nameen": $scope.Style,
                "status": $scope.wuliufangshi
            });


            $scope.changewuliufangshi = function (fs) {
                console.log($scope.wuliufangshi);
                if ($scope.wuliufangshi == '1') {
                    var sendData = {
                        enname: $scope.Style,
                        status: $scope.wuliufangshi
                    }
                    getCountryFun(sendData);
                } else {
                    var sendData = {
                        "nameen": $scope.Style,
                        "status": $scope.wuliufangshi,
                        "searchCountry": $scope.scountryinfo,
                    }
                    getLogisticInfo(sendData);
                }
            }
            function getCountryFun(sendData) {
                erp.postFun('app/erplogistics/getCountry', JSON.stringify(sendData), function (data) {
                    console.log(data.data);

                    $scope.countryList = data.data;
                    $scope.newList = '';
                    if ($scope.countryList.length > 0) {
                        $scope.countrynameEn = $scope.countryList[0].country;
                    } else {
                        $scope.countrynameEn = '';
                    }

                    var appData = {
                        "nameen": $scope.Style,
                        "status": $scope.wuliufangshi,
                        "country": $scope.countrynameEn,
                        // "searchCountry": $scope.scountryinfo,
                    }
                    getLogisticInfo(appData);
                }, function () { }, { layer: true })
            }
            $scope.Style1 = function () {
                if ($scope.wuliufangshi == '1') {
                    var sendData = {
                        enname: $scope.Style,
                        status: $scope.wuliufangshi
                    }
                    getCountryFun(sendData)
                } else {
                    var sendData = {
                        "nameen": $scope.Style,
                        "status": $scope.wuliufangshi,
                        "searchCountry": $scope.scountryinfo
                        // "country" : $scope.countrynameEn
                    }
                    getLogisticInfo(sendData)
                }

            }
        }

        function err(data) {
            console.log(data);
            layer.msg('网络错误');
        }

        //选择dhl跟usps后出现的选择框
        $scope.selChangeFun = function () {
            console.log($scope.countrynameEn)
            if ($scope.countrynameEn == '') {
                $scope.newList = '';//选择请选择的时候清空列表
                return;
            }
            // $('.ea-list-table .dis-inp').attr('disabled',true)
            var sendData = {
                "nameen": $scope.Style,
                "country": $scope.countrynameEn,
                "status": $scope.wuliufangshi
            }
            getLogisticInfo(sendData)

        }
        //usps dhl的编辑函数
        $scope.newBJFun = function (index, $event) {
            console.log(index)
            //隐藏删除 编辑 按钮 
            $($event.target).hide()
            $($event.target).siblings('.scbtn').hide();
            //保存取消的按钮显示出来
            $($event.target).siblings('.bcbtn').show();
            $($event.target).siblings('.qxbtn').show();

            $($event.target).parent().parent().find(".dis-inp").removeAttr('disabled');
            $($event.target).parent().parent().find(".dis-inp").css('border', '1px solid #ececec')

        }
        //保存
        $scope.saveFun = function ($event, item) {
            var yfVal = $($event.target).parent().parent().find('#yf-inp').val();
            var minVal = $($event.target).parent().parent().find('#min-w').val();
            var maxVal = $($event.target).parent().parent().find('#max-w').val();
            var gjVal = $($event.target).parent().parent().find('#gj-inp').val();
            var gjcod = item.country;
            var id = item.ID;
            //向后台传数据
            // alert(gjVal+'=='+maxVal+'--'+minVal+'**'+yfVal)
            // return;
            //校验上传的数据
            erp.postFun("app/erplogistics/checkEntering", {
                "formula": '0.06*#gram+19',
                "name": gjVal
            }, function (data) {
                console.log(data.data);
                console.log(data.data.country);
                if (data.data.country != 'false') {//校验成功
                    erp.postFun("app/erplogistics/uplogisticSection", {
                        'freight': yfVal,
                        'minweight': minVal,
                        'maxweight': maxVal,
                        'country': gjcod,
                        'countryname': gjVal,
                        'id': id
                    }, function (data1) {
                        console.log(data1);
                        if (data1.data.result == 1) {
                            layer.msg('保存成功')
                            // return;
                            //隐藏保存取消按钮
                            $($event.target).hide()
                            $($event.target).siblings('.qxbtn').hide();
                            //显示编辑 删除按钮
                            $($event.target).siblings('.bjbtn').show()
                            $($event.target).siblings('.scbtn').show();
                            //输入框不可编辑
                            $($event.target).parent().parent().find(".dis-inp").attr('disabled', true);
                            $($event.target).parent().parent().find(".dis-inp").css('border', 'none')
                            //输入框的值传给隐藏域
                            $($event.target).parent().parent().find('.hide-yfp').text(yfVal);
                            $($event.target).parent().parent().find('.hide-minwp').text(minVal);
                            $($event.target).parent().parent().find('.hide-maxwp').text(maxVal);
                            $($event.target).parent().parent().find('.hide-gjp').text(gjVal);

                        } else {
                            layer.msg('保存失败')
                        }
                    }, function (data1) {
                        console.log("网络错误4");
                    })
                } else {
                    layer.msg('没有找到该国家')
                }
            }, function (data) {
                alert("网络错误5");
            })
        }
        //取消
        $scope.cancelFun = function ($event) {
            //隐藏保存取消按钮
            $($event.target).hide()
            $($event.target).siblings('.bcbtn').hide();
            //显示编辑 删除按钮
            $($event.target).siblings('.bjbtn').show()
            $($event.target).siblings('.scbtn').show();

            //获取隐藏域的值赋给输入框
            var yfVal = $($event.target).parent().parent().find('.hide-yfp').text();
            $($event.target).parent().parent().find('#yf-inp').val(yfVal);
            var minVal = $($event.target).parent().parent().find('.hide-minwp').text();
            $($event.target).parent().parent().find('#min-w').val(minVal);
            var maxVal = $($event.target).parent().parent().find('.hide-maxwp').text();
            $($event.target).parent().parent().find('#max-w').val(maxVal);
            var gjVal = $($event.target).parent().parent().find('.hide-gjp').text();
            $($event.target).parent().parent().find('#gj-inp').val(gjVal);

            $($event.target).parent().parent().find(".dis-inp").attr('disabled', true);
            $($event.target).parent().parent().find(".dis-inp").css('border', 'none')
        }
        //usps dhl的删除函数
        $scope.deleteFun = function (index1, $event, item) {
            layer.open({
                title: null,
                type: 1,
                area: ['300px', '200px'],
                skin: "layui-layer-addct layui-layer-remove",
                closeBtn: 0,
                shade: [0.1, '#000'],
                content: '<p style="margin:0 auto;margin-top:50px;width: 100px;">确定删除吗?</p>',
                btn: ["确认", "取消"],
                success: function (layero, index) {
                    var select2 = $("#ea-right-con2select").find("option:selected").text();
                    console.log(select2, item.countryName);
                    $(layero).find(".removect1").text(select2);
                    $(layero).find(".removect2").text(item.countryName);
                },
                yes: function (index, layero) {
                    // alert(6666)
                    console.log(index1 + '===' + item.ID)
                    erp.postFun('app/erplogistics/deletelogisticSection', {
                        'id': item.ID
                    }, function (data) {
                        console.log(data)
                        if (data.data.result == 1) {
                            $scope.newList.splice(index1, 1);
                            $($event.target).parent().parent().remove();
                            layer.msg('删除成功')
                        } else {
                            layer.msg('删除失败')
                        }
                    }, function (data) {
                        layer.msg('网络错误')
                    })
                    layer.close(index);
                }
            })
        }
        //添加国家
        $scope.addlistFun = function () {
            console.log($scope.Style)
            if (($scope.Style == undefined) || $scope.Style == "") {
                layer.msg("请选择物流方式");
            } else {
                layer.open({
                    title: null,
                    type: 1,
                    area: ['500px', '400px'],
                    skin: "layui-layer-addct",
                    closeBtn: 0,
                    shade: [0.1, '#000'],
                    content: $("#gj-wrap").html(),
                    btn: ["确认", "取消"],
                    success: function (layero, index) {
                        var selecttext = $("#ea-right-con2select").find("option:selected").text();
                        $(layero).find(".addctcon1>p").html(selecttext);
                        $(layero).find(".addctcon2>p").html($scope.Style);
                        //获取属性的东西
                        var chactBoc = [];
                        var chactLab = [];
                        $('.search-by-con .check-box input').each(function () {
                            $(this).click(function () {
                                console.log($(this).prop('checked'));
                                if ($(this).prop('checked') == true) {
                                    chactBoc.push($(this).attr('value'));
                                    chactLab.push($(this).next('label').text());
                                    console.log(chactBoc)
                                    console.log(chactLab)
                                }
                                if ($(this).prop('checked') == false) {
                                    for (var i = 0; i < chactBoc.length; i++) {
                                        if (chactBoc[i] == $(this).val()) {
                                            chactBoc.splice(i, 1)
                                        }
                                        if (chactLab[i] == $(this).next("label").text()) {
                                            chactLab.splice(i, 1)
                                        }
                                    }
                                }
                                $scope.chactBoc = chactBoc;
                                $scope.chactLab = chactLab;

                            })
                        })

                    },
                    yes: function (index, layero) {
                        console.log($scope.chactBoc, $scope.chactLab)
                        var con1 = $(layero).find(".addctcon1>p").html(); //物流方式
                        var con2 = $(layero).find(".addctcon2>p").html(); //物流方式缩写
                        var con3 = $(layero).find(".addctcon3>input").val(); //国家
                        var cong = $(layero).find(".addctcong>input").val(); //运费
                        var con5 = $(layero).find(".min-wdiv>input").val(); //最小重量
                        var conf = $(layero).find(".max-wdiv>input").val(); //最大重量
                        // var con4 = $(layero).find(".addctcon4>input").val(); //国家缩写

                        var con6 = JSON.stringify($scope.chactBoc); //属性
                        var con7 = JSON.stringify($scope.chactLab); //属性
                        // var con6 = $scope.chactBoc; //属性
                        // var con7 = $scope.chactLab; //属性
                        console.log(con1, con2, con3, con7, con5, con6, cong, conf)
                        // return;

                        if (con5 == "" || conf == "" || cong == "" || con3 == "") {
                            layer.msg("请补充完整信息");
                        } else {
                            erp.postFun("app/erplogistics/checkEntering", {
                                "formula": '0.06*#gram+19',
                                "name": con3
                            }, function (data) {
                                console.log("判断完成");
                                console.log(data);
                                if (data.status == 200) {
                                    console.log(data.data.formula, data.data.country)
                                    var countrysx = data.data.country;//国家的英文缩写
                                    if (data.data.country == "false") {
                                        layer.msg("未找到该国家,无法添加");
                                        return;
                                    } else {
                                        console.log(con1, con2, con3, con7, con5, con6, cong, conf)

                                        erp.postFun("app/erplogistics/addlogisticSection", {
                                            "enName": con2,//物流方式
                                            'freight': cong,//运费
                                            'minweight': con5,//最小重量
                                            'maxweight': conf,//最大重量
                                            'country': countrysx,//国家缩写
                                            'countryname': con3//国家中文名
                                        }, function (data) {
                                            console.log(data);
                                            if (data.status == 200) {
                                                // console.log(con7)
                                                // var con77 = con7.join(',');
                                                var obj = {
                                                    enName: con2,//物流方式
                                                    freight: cong,//运费
                                                    minweight: con5,//最小重量
                                                    maxweight: conf,//最大重量
                                                    country: countrysx,//国家缩写
                                                    countryname: con3//国家中文名
                                                };
                                                console.log(obj)
                                                // return;
                                                $scope.newList.unshift(obj);
                                                console.log($scope.newList);
                                                for (var i = 0; i < $scope.newList.length; i++) {
                                                    if ($scope.newList[i].propertycn) {
                                                        $scope.newList[i].propertycn = JSON.parse($scope.newList[i].propertycn).join(',');
                                                    }
                                                }

                                                layer.msg("添加成功");
                                                layer.close(index);
                                                setTimeout(function () {
                                                    $('.ea-list-table .dis-inp').attr('disabled', true)
                                                    $('.ea-list-table .dis-inp').addClass('activedis')
                                                }, 10);
                                            }
                                        }, function (data) {
                                            console.log("网络错误6")
                                        })
                                    }
                                }
                            }, function (data) {
                                console.log("网络错误7");
                            })
                        }

                    }
                })
            }

        }
        //点击编辑
        $scope.bianji = function (index, item) {
            if (!erp.isAdminLogin() && erpLoginName != '金仙娟') {
                layer.msg('只有管理员才能修改')
                return;
            }
            $scope.bianjiIndex = index;
            console.log(item)
            console.log(item.propertycn)
            if (item.propertycn) {
                $scope.chactBoc = JSON.parse(item.property);
                $scope.chactLab = item.propertycn.split(',');
                console.log($scope.chactBoc)
                console.log($scope.chactLab)
                var str1 = '';
                for (var i = 0; i < $scope.chactLab.length; i++) {
                    str1 += '<span class="' + $scope.chactBoc[i] + '">' + $scope.chactLab[i] + '</span>'
                }
                $('.moneyfu').eq($scope.bianjiIndex).find(".propertyTD").children(".str1").append(str1);
            }

            $(".moneyfu").eq(index).find(".moneyafter").hide();
            $(".moneyfu").eq(index).find(".moneyafter1").show();
            $(".moneyfu").eq(index).find(".str1").hide();
            $(".moneyfu").eq(index).find(".time").hide();
            $(".moneyfu").eq(index).find(".time1").show();
            $(".moneyfu").eq(index).find(".bjbtn").hide();
            $(".moneyfu").eq(index).find(".scbtn").hide();
            $(".moneyfu").eq(index).find(".bcbtn").show();
            $(".moneyfu").eq(index).find(".qxbtn").show();
            //获取值并且放入input框中
            console.log(item.countryName, item.formula, item.propertycn, item.unitprice, item.registrationfee);
            var afternum = $(".moneyfu").eq(index).find(".zhongyunfei").html(); //重量运费
            var afternum1 = $(".moneyfu").eq(index).find(".guahaofei").html(); //挂号费
            var count = $(".moneyfu").eq(index).find(".count").text(); //计算公式
            var country = $(".moneyfu").eq(index).find(".country").html(); //到达国家
            var shuxing = $(".moneyfu").eq(index).find(".property1").html(); //属性
            var maxWeight = $(".moneyfu").eq(index).find(".country-max-weight1").html(); //最大重量
            var minWeight = $(".moneyfu").eq(index).find(".country-min-weight1").html(); //最小重量
            console.log(afternum1.substring(1))
            console.log(count)
            $(".moneyfu").eq(index).find(".country1").children("input").val(country);
            $(".moneyfu").eq(index).find(".count1").children("input").val(count);
            $(".moneyfu").eq(index).find(".property").children("input").val(shuxing);
            $(".moneyfu").eq(index).find(".registrationfee").children("input").val(afternum1.substring(1));
            $(".moneyfu").eq(index).find(".unitprice").children("input").val(afternum.substring(1));
            $(".moneyfu").eq(index).find(".country-max-weight").children("input").val(maxWeight);
            $(".moneyfu").eq(index).find(".country-min-weight").children("input").val(minWeight);

            $scope.shuxingFun = function (wlIndex) {
                console.log(wlIndex)
                layer.open({
                    title: null,
                    type: 1,
                    area: ['500px', '450px'],
                    skin: "layui-layer-addct",
                    closeBtn: 0,
                    shade: [0.1, '#000'],
                    content: $("#shuxingKuang").html(),
                    btn: ["确认", "取消"],
                    success: function (layero, index) {
                        var chactBoc = [];
                        var chactLab = [];
                        console.log(item.propertycn)
                        $('.search-by-con .check-box input').each(function () {
                            if (item.propertycn) {
                                var proArr = item.propertycn.split(',')
                                console.log(proArr)
                                for (var i = 0; i < proArr.length; i++) {
                                    if (proArr[i] == $(this).next('label').text()) {
                                        $(this).prop('checked', true)
                                        // console.log($(this).attr('value'))
                                        // console.log($(this).next('label').text())
                                        chactBoc.push($(this).attr('value'));
                                        chactLab.push($(this).next('label').text());
                                    }
                                }
                                console.log(chactBoc)
                                console.log(chactLab)
                                $scope.chactBoc = chactBoc;
                                $scope.chactLab = chactLab;
                            }
                            $(this).click(function () {
                                console.log($(this).prop('checked'));
                                if ($(this).prop('checked') == true) {
                                    chactBoc.push($(this).attr('value'));
                                    chactLab.push($(this).next('label').text());
                                }
                                if ($(this).prop('checked') == false) {
                                    for (var i = 0; i < chactBoc.length; i++) {
                                        if (chactBoc[i] == $(this).val()) {
                                            chactBoc.splice(i, 1)
                                        }
                                        if (chactLab[i] == $(this).next("label").text()) {
                                            chactLab.splice(i, 1)
                                        }
                                    }
                                }
                                $scope.chactBoc = chactBoc;
                                $scope.chactLab = chactLab;
                                console.log($scope.chactBoc)
                                console.log($scope.chactLab)
                            })
                        })

                    },
                    yes: function (index, layero) {
                        console.log($scope.chactBoc, $scope.chactLab);
                        $scope.chactLab = $scope.chactLab;
                        var chactArr = $scope.chactLab;
                        var proStr = chactArr.join(',')
                        console.log(proStr)
                        $scope.logicountry[wlIndex].propertycn = proStr;
                        console.log($scope.logicountry[wlIndex])
                        var str1 = '';
                        $('.moneyfu').eq($scope.bianjiIndex).find(".propertyTD").children(".str1").text(str1);
                        for (var i = 0; i < $scope.chactLab.length; i++) {
                            // str1 += $scope.chactLab[i];
                            str1 += '<span class="' + $scope.chactBoc[i] + '">' + $scope.chactLab[i] + '</span>'
                        }
                        $('.moneyfu').eq($scope.bianjiIndex).find(".propertyTD").children(".str1").append(str1);
                        layer.close(index);
                        $(".moneyfu").eq($scope.bianjiIndex).find(".property").hide();
                        $(".moneyfu").eq($scope.bianjiIndex).find(".property1").hide();
                        $(".moneyfu").eq($scope.bianjiIndex).find(".str1").show();
                        console.log($scope.bianjiIndex)
                        $scope.chactBoc = [];
                        $scope.chactLab = [];
                    },
                    btn2: function () {
                        $scope.chactBoc = [];
                        $scope.chactLab = [];
                        // $(".moneyfu").eq(index).find(".property").hide();
                        // $(".moneyfu").eq(index).find(".property1").show();
                    }

                })

            }

        }
        //点击保存
        $scope.baocun = function (index, item) {
            //更改运费
            console.log("进来保存");
            console.log(item);
            var afternum = $(".moneyfu").eq(index).find(".moneyafter1hou").children("input").val(); //重量运费
            var afternum1 = $(".moneyfu").eq(index).find(".moneyafter1hou1").children("input").val(); //挂号费
            var count = $(".moneyfu").eq(index).find(".count1").children("input").val(); //计算公式
            var country = $(".moneyfu").eq(index).find(".country1").children("input").val(); //到达国家
            var maxWeight = $(".moneyfu").eq(index).find(".country-max-weight").children("input").val(); //最大重量
            var minWeight = $(".moneyfu").eq(index).find(".country-min-weight").children("input").val(); //最小重量
            var property = [];
            var propertycn = [];
            var propertySpans = $(".moneyfu").eq(index).find(".str1").children();
            console.log(propertySpans)
            propertySpans.each(function () {
                property.push($(this).attr("class"));
                propertycn.push($(this).html());
            })
            console.log(property)
            console.log(propertycn)
            property = JSON.stringify(property);
            propertycn = JSON.stringify(propertycn);
            // return;
            if (afternum == '') {
                layer.msg('重量运费不能为空');
                return;
            }
            if (afternum1 == '') {
                layer.msg('挂号费不能为空');
                return;
            }
            if (maxWeight && !(maxWeight % 1 === 0 && maxWeight > 0)) {
                console.log(maxWeight)
                layer.msg('国家可用最大重量必须为大于零的整数')
                return
            }
            if (minWeight && !(minWeight % 1 === 0 && minWeight > 0)) {
                layer.msg('国家可用最小重量必须为大于零的整数')
                return
            }
            country = country.toUpperCase();
            //向后台传数据
            console.log(afternum, afternum1, count, country, property, propertycn)
            var checkData = {};
            checkData.code = country;
            checkData.formula = count;
            console.log(JSON.stringify(checkData))
            erp.postFun('app/erplogistics/getEntering', JSON.stringify(checkData), function (data) {
                console.log(data)
                var countryInfo = data.data;
                if (countryInfo.formula == 0 || countryInfo.formula == "false") {
                    layer.msg('国家或则公式错误')
                } else {
                    let sendData = {
                        "formula": count,
                        "countryName": item.countryName,
                        "country": country,
                        "id": item.id,
                        "property": property,
                        "propertycn": propertycn,
                        "registrationfee": afternum1,
                        "unitprice": afternum,
                        "countryfull": countryInfo.nameen,
                    }

                    maxWeight && (sendData.maxweight = Number(maxWeight))
                    minWeight && (sendData.minweight = Number(minWeight))
                    // console.log(sendData)
                    erp.postFun("app/erplogistics/uplogisticformula", JSON.stringify(sendData), function (data1) {
                        console.log(data1);
                        if (data1.data.result == 1) {
                            //更改国家缩写
                            $(".moneyfu").eq(index).find(".countrysx").html(data.data.country);
                            //1kg重物的的运费
                            // $(".moneyfu").eq(index).find(".moneyafterhou").html("¥" + data.data.formula);
                            $(".moneyfu").eq(index).find(".moneyafterhou").html("¥" + afternum);
                            layer.msg("1千克重的运费是" + data.data.formula);
                            $(".moneyfu").eq(index).find(".moneyafter").show();
                            $(".moneyfu").eq(index).find(".moneyafter1").hide();
                            // $(".moneyfu").eq(index).find(".str1").hide();
                            $(".moneyfu").eq(index).find(".property1").hide();
                            $(".moneyfu").eq(index).find(".property").hide();
                            $(".moneyfu").eq(index).find(".time").show();
                            $(".moneyfu").eq(index).find(".time1").hide();
                            $(".moneyfu").eq(index).find(".bjbtn").show();
                            $(".moneyfu").eq(index).find(".scbtn").show();
                            $(".moneyfu").eq(index).find(".bcbtn").hide();
                            $(".moneyfu").eq(index).find(".qxbtn").hide();
                            // $(".moneyfu").eq(index).find(".str1").css({'border':none});
                            $(".moneyfu").eq(index).find("p").removeClass('str1');
                            if ($scope.wuliufangshi == '1') {
                                var sendData = {
                                    "nameen": $scope.Style,
                                    "status": $scope.wuliufangshi,
                                    "country": $scope.country
                                }
                                getLogisticInfo(sendData);
                            } else {
                                var sendData = {
                                    "nameen": $scope.Style,
                                    "status": $scope.wuliufangshi,
                                    "searchcountry": $scope.scountryinfo
                                }
                                getLogisticInfo(sendData);
                            }


                        }
                    }, function (data1) {
                        console.log("网络错误4");
                    })
                }
            }, function (data) {
                console.log(data)
            })

            //重量运费
            if (afternum != "") {
                $(".moneyfu").eq(index).find(".moneyafterhou").html("¥" + afternum);
            }
            //挂号费
            //      	if(afternum1 != ""){
            //      		$(".moneyfu").eq(index).find(".moneyafterhou1").html("¥" + afternum1);
            //      	}
            //更改计算公式
            if (count != "") {
                $(".moneyfu").eq(index).find(".count").html(count);
            }
            //更改国家
            if (country != "") {
                $(".moneyfu").eq(index).find(".country").html(country);
            }
        }
        //点击取消
        $scope.quxiao = function (index, item) {
            //      	console.log("aa");
            $(".moneyfu").eq(index).find(".moneyafter").show();
            $(".moneyfu").eq(index).find(".moneyafter1").hide();
            $(".moneyfu").eq(index).find(".str1").hide();
            $(".moneyfu").eq(index).find(".time").show();
            $(".moneyfu").eq(index).find(".time1").hide();
            $(".moneyfu").eq(index).find(".bjbtn").show();
            $(".moneyfu").eq(index).find(".scbtn").show();
            $(".moneyfu").eq(index).find(".bcbtn").hide();
            $(".moneyfu").eq(index).find(".qxbtn").hide();
            $(".moneyfu").eq(index).find(".str1").children("span").remove();
        }
        //点击添加国家
        $scope.addCt = function () {
            if (!erp.isAdminLogin() && erpLoginName != '金仙娟') {
                layer.msg('只有管理员才能修改')
                return;
            }
            console.log($scope.Style)
            if (($scope.Style == undefined) || $scope.Style == "") {
                layer.msg("请选择物流方式");
            } else {
                layer.open({
                    title: null,
                    type: 1,
                    area: ['500px', '460px'],
                    skin: "layui-layer-addct",
                    closeBtn: 0,
                    shade: [0.1, '#000'],
                    content: $("#addct").html(),
                    btn: ["确认", "取消"],
                    success: function (layero, index) {
                        //					  $(layero).find(".wa-guaHao").text(str2);
                        //				      $(layero).find(".wa-WuLiuGongSi").text(str1);
                        var selecttext = $("#ea-right-con2select").find("option:selected").text();
                        $(layero).find(".addctcon1>p").html(selecttext);
                        $(layero).find(".addctcon2>p").html($scope.Style);
                        $(layero).find('.ddgj-inp').attr('disabled', true);
                        var $gjjmInpObj = $(layero).find(".addctcon2-1 .sm-inp");
                        console.log($gjjmInpObj)
                        $gjjmInpObj.blur(function () {
                            var inpVal = $.trim($(this).val());
                            var upjmData = {};
                            upjmData.code = inpVal;
                            upjmData.formula = '';
                            console.log(JSON.stringify(upjmData))
                            if (inpVal) {
                                erp.postFun('app/erplogistics/getEntering', JSON.stringify(upjmData), function (data) {
                                    console.log(data)
                                    var couninformation = data.data;
                                    console.log(couninformation)
                                    if (couninformation.name) {//如果有该国家
                                        $(layero).find('.err-tipspan').hide();
                                        $(layero).find('.addctcon div .sm-inp').css('width', '70%')
                                        $(layero).find('.ddgj-inp').removeAttr('disabled');
                                        $(layero).find('.zh-valipn').val(couninformation.name)
                                        $(layero).find('.en-valinp').val(couninformation.nameen)
                                        $(layero).find('.ddgj-inp').attr('disabled', true);
                                    } else {
                                        $(layero).find('.err-tipspan').show();
                                        $(layero).find('.addctcon div .sm-inp').css('width', '35%')
                                        $(layero).find('.ddgj-inp').removeAttr('disabled');
                                        $(layero).find('.zh-valipn').val('')
                                        $(layero).find('.en-valinp').val('')
                                        $(layero).find('.ddgj-inp').attr('disabled', true);
                                    }
                                }, function (data) {
                                    console.log(data)
                                })
                            } else {
                                layer.msg('请输入二字码')
                            }

                        })
                        //获取属性的东西
                        var chactBoc = [];
                        var chactLab = [];
                        $('.search-by-con .check-box input').each(function () {
                            $(this).click(function () {
                                console.log($(this).prop('checked'));
                                if ($(this).prop('checked') == true) {
                                    chactBoc.push($(this).attr('value'));
                                    chactLab.push($(this).next('label').text());
                                    console.log(chactBoc)
                                    console.log(chactLab)
                                }
                                if ($(this).prop('checked') == false) {
                                    for (var i = 0; i < chactBoc.length; i++) {
                                        if (chactBoc[i] == $(this).val()) {
                                            chactBoc.splice(i, 1)
                                        }
                                        if (chactLab[i] == $(this).next("label").text()) {
                                            chactLab.splice(i, 1)
                                        }
                                    }
                                }
                                $scope.chactBoc = chactBoc;
                                $scope.chactLab = chactLab;

                            })
                        })

                    },
                    yes: function (index, layero) {//运费设置 确定添加国家
                        //				   	  layer.close(index);\
                        console.log($scope.chactBoc, $scope.chactLab)
                        var con1 = $(layero).find(".addctcon1>p").html(); //物流方式
                        var con2 = $(layero).find(".addctcon2>p").html(); //物流方式英文
                        var con3 = $(layero).find(".addctcon2-2>input").val(); //到达国家中文
                        var enName = $(layero).find(".addctcon2-3>input").val(); //到达国家英文
                        // var con4 = $(layero).find(".addctcon4>input").val(); //国家缩写
                        var con5 = $(layero).find(".addctcon5>input").val(); //计算公式
                        var cong = $(layero).find(".addctcong>input").val(); //重量运费
                        var conf = $(layero).find(".addctconf>input").val(); //挂号费
                        var con6 = JSON.stringify($scope.chactBoc); //属性
                        var con7 = JSON.stringify($scope.chactLab); //属性
                        var countryMaxWeight = $(layero).find('.countryMaxWeight>input').val()
                        var countryMinWeight = $(layero).find('.countryMinWeight>input').val()
                        // var con6 = $scope.chactBoc; //属性
                        // var con7 = $scope.chactLab; //属性
                        // console.log(con1, con2, con3, enName, con7, con5, con6, cong, conf)
                        // return;

                        if (con5 == "" || conf == "" || cong == "" || con3 == "") {
                            layer.msg("请补充完整信息");
                        } else {
                            erp.postFun("app/erplogistics/checkEntering", {
                                "formula": con5,
                                "name": con3
                            }, function (data) {
                                console.log("判断完成");
                                console.log(data);
                                if (data.status == 200) {
                                    console.log(data.data.formula, data.data.country)
                                    var countrysx = data.data.country;
                                    if ((data.data.formula == "false") || (data.data.country == "false")) {
                                        layer.msg("国家或公式错误,无法添加");
                                    } else {
                                        // console.log(con1, con2, con3, enName, con7, con5, con6, cong, conf)
                                        if (countryMaxWeight && !(countryMaxWeight % 1 === 0 && countryMaxWeight > 0)) {
                                            layer.msg('国家可用最大重量必须为大于零的整数')
                                        } else if (countryMinWeight && !(countryMinWeight % 1 === 0 && countryMinWeight > 0)) {
                                            layer.msg('国家可用最小重量必须为大于零的整数')
                                        } else {
                                            let sendData = {
                                                "namecn": con1,
                                                "nameen": con2,
                                                "countryfull": enName,
                                                "formula": con5,
                                                "countryName": con3,
                                                "country": data.data.country,
                                                "property": con6,
                                                "propertycn": con7,
                                                "registrationfee": conf,
                                                "unitprice": cong,
                                            }

                                            countryMaxWeight && (sendData.maxweight = countryMaxWeight)
                                            countryMinWeight && (sendData.minweight = countryMinWeight)
                                            erp.postFun("app/erplogistics/addlogisticformula", JSON.stringify(sendData), function (data) {
                                                console.log(data);
                                                if (data.status == 200) {
                                                    // console.log(con7)
                                                    // var con77 = con7.join(',');
                                                    var obj = {
                                                        countryName: con3,
                                                        country: countrysx,
                                                        formula: con5,
                                                        property: con6,
                                                        propertycn: con7,
                                                        registrationfee: conf,
                                                        unitprice: cong,
                                                        maxweight: countryMaxWeight,
                                                        minweight: countryMinWeight
                                                    };
                                                    layer.msg("添加成功");
                                                    layer.close(index);
                                                    console.log(obj)
                                                    // return;
                                                    $scope.logicountry.unshift(obj);
                                                    console.log($scope.logicountry);
                                                    for (var i = 0; i < $scope.logicountry.length; i++) {
                                                        if ($scope.logicountry[i].propertycn) {
                                                            $scope.logicountry[i].propertycn = JSON.parse($scope.logicountry[i].propertycn).join(',');
                                                        }
                                                    }

                                                }
                                            }, function (data) {
                                                console.log("网络错误6")
                                            }, { layer: true })
                                        }
                                    }
                                }
                            }, function (data) {
                                console.log("网络错误7");
                            })
                        }

                    },
                    btn2: function (index, layero) {

                        //				   	  $(".ea-input-checked input").next("i").removeClass("green");
                        //					  this1.next("i").addClass("green");
                        //					  layer.close(index);
                    }
                })
            }
        }
		$scope.mdtcFlag = false;
        $scope.printMd = function(){
            var bs = new Base64();
            var erpLoginName = bs.decode(localStorage.getItem('erploginName')==undefined?'':localStorage.getItem('erploginName'));
            erp.postFun2('getExpressSheet.json', JSON.stringify({
                ids: $scope.cjorder,
                type:"1",
                loginName:erpLoginName
            }), function (data) {
				console.log(data)
				layer.closeAll("loading")
				// var href = data.data.href;
				$scope.kxt = data.data.kxt;
				$scope.zgyz = data.data.zgyz;
				if ($scope.kxt != '' || $scope.zgyz != '') {
					$scope.mdtcFlag = true;
				} else {
					layer.msg('生成面单错误')
				}
			}, function (data) {
				console.log(data)
				layer.closeAll("loading")
				layer.msg('网络错误')
			})
        }
        //点击删除
        $scope.shanchu = function (index1, item, ev) {
            if (!erp.isAdminLogin() && erpLoginName != '金仙娟') {
                layer.msg('只有管理员才能修改')
                return;
            }
            layer.open({
                title: null,
                type: 1,
                area: ['300px', '200px'],
                skin: "layui-layer-addct layui-layer-remove",
                closeBtn: 0,
                shade: [0.1, '#000'],
                content: $("#remove").html(),
                btn: ["确认", "取消"],
                success: function (layero, index) {
                    var select2 = $("#ea-right-con2select").find("option:selected").text();
                    console.log(select2, item.countryName);
                    $(layero).find(".removect1").text(select2);
                    $(layero).find(".removect2").text(item.countryName);
                },
                yes: function (index, layero) {
                    console.log($scope.logicountry);
                    erp.postFun("app/erplogistics/deletelogisticType", {
                        "id": item.id
                    }, function (data) {
                        console.log(data);
                        $scope.logicountry.splice(index1, 1);
                        $(ev.target).parent().parent().remove();
                    }, function (data) {
                        console.log("网络错误8")
                    })
                    console.log($(ev.target).parent().parent());
                    layer.close(index);
                },
                btn2: function (index, layero) {

                }
            })
        }
        //点击搜索
        $scope.searchcountry = function () {
            var sendData = {
                "nameen": $scope.Style,
                "searchCountry": $scope.scountryinfo,
                "status": $scope.wuliufangshi
            }
            getLogisticInfo(sendData);

        }
        $('#searchInpt').keypress(function (e) {
            if (e.which == 13) {
                $scope.searchcountry();
            }
        })


        //点击计算公式
        $scope.countBtn = function () {
            layer.open({
                title: null,
                type: 1,
                area: ['953px', '580px'],
                skin: "layui-layer-count",
                closeBtn: 0,
                shade: [0.1, '#000'],
                content: $("#count").html(),
                btn: ["检验公式", "取消"],
                success: function (layero, index) {

                },
                yes: function (index, layero) {
                    var gram = $(layero).find(".weit input").val();
                    var rule = $(layero).find(".countTest input").val();
                    console.log(rule.indexOf("#gram") >= 0);
                    console.log(gram, rule);
                    if (rule.indexOf("#gram") >= 0) {
                        // erp.postFun2("getPrice.json", {
                        erp.postFun("app/erplogistics/getPrice", {
                            "gram": gram,
                            "rule": rule
                        }, function (data) {
                            console.log(data);
                            //55+0.22*#gram
                            if (data.status == 200) {
                                if (data.data.result == "false") {
                                    layer.msg("公式不成立");
                                } else {
                                    layer.msg("计算结果为" + data.data.result);
                                }
                            }
                        }, function (data) {

                        })
                    } else {
                        layer.msg("计算公式有误");
                    }
                },
                btn2: function (index, layero) {
                    layer.close(index);
                }
            })
        }

        //点击刷新物流缓存
        $('.shuaxin').hide();
        $scope.shuancunFun = function () {
            if (!erp.isAdminLogin() && erpLoginName != '金仙娟') {
                layer.msg('只有管理员才能修改')
                return;
            }
            $('.shuaxin').show();
            $scope.shuxinquedingFun = function () {
                $('.shuaxin').hide();
                erp.postFun('app/erplogistics/refreshCache', null,
                    function (res) {
                        console.log(res)
                        if (res.data.result == 'true') {
                            $scope.require1 = true;
                        }
                        if (res.data.result == 'false') {
                            $scope.require11 = false;
                        }

                    }, function (res) {
                        console.log(res)
                        layer.msg('网络错误')
                    })
                erp.postFun2('refreshCache.json', null, function (res) {
                    console.log(res)
                    if (res.data.result == 'true') {
                        $scope.require2 = true;
                    }
                    if (res.data.result == 'false') {
                        $scope.require22 = false;
                    }
                    // $scope.require2 = res.data.result;
                }, function (res) {
                    console.log(res)
                    layer.msg('网络错误')

                })
                erp.postFun4('app/erplogistics/refreshCache', null, function (res) {
                    console.log(res)
                    if (res.data.result == 'true') {
                        $scope.require3 = true;
                    }
                    if (res.data.result == 'false') {
                        $scope.require33 = false;
                    }
                    // $scope.require3 = res.data.result;
                }, function (res) {
                    console.log(res)
                    layer.msg('网络错误')

                })
                erp.postFun('order/oldOrder/refreshCache', null, function (res) {
                    console.log(res)
                }, function (res) {
                    console.log(res)
                    layer.msg('网络错误')
                })
            }
            $scope.shuxinquxiaoFun = function () {
                $('.shuaxin').hide();
            }
        }


    }])
    //erp旧的渠道设置
    app.controller('channelsetCtrl', ['$scope', function ($scope) {
        console.log('channelsetCtrl')
        $scope.logisticsMode = [{
            aa: "物流公司A"
        }, {
            aa: "物流公司B"
        }, {
            aa: "物流公司C"
        }, {
            aa: "物流公司D"
        }, {
            aa: "物流公司E"
        }]
        $scope.logisticsModelist = [{
            bb: "普货E邮宝"
        }, {
            bb: "非普货E邮宝"
        }, {
            bb: "当天上网E邮宝"
        }, {
            bb: "中国邮政挂号"
        }, {
            bb: "平邮"
        }, {
            bb: "外邮普货"
        }, {
            bb: "外邮非普货"
        }, {
            bb: "DHL"
        }]
        $scope.aa = function () {
            //默认被选中
            $(".ea-list-table tr").eq(1).children().eq(2).find("i").addClass("green");
            $scope.dianji = function (ev) {
                console.log($(ev.target));
                var inp = $(ev.target).parent().parent().parent().parent();
                var inpVal = parseInt(inp.index());
                var inp1 = $(ev.target).parent().parent().parent();
                var inpVa2 = parseInt(inp1.index());
                var str1 = $(".wa-list-title>th").eq(inpVa2).children().text();
                var str2 = $(ev.target).parents("tr").children().children(".wa-WL").text();
                var this1 = $(ev.target);
                layer.open({
                    title: null,
                    type: 1,
                    area: ['414px', '240px'],
                    skin: "layui-layer-tankuang",
                    closeBtn: 0,
                    shade: [0.1, '#000'],
                    content: $("#inpBox").html(),
                    btn: ["取消", "确认"],
                    success: function (layero, index) {
                        $(layero).find(".wa-guaHao").text(str2);
                        $(layero).find(".wa-WuLiuGongSi").text(str1);
                    },
                    yes: function (index, layero) {
                        layer.close(index);
                        //				   	  return false;
                    },
                    btn2: function (index, layero) {
                        $(".ea-input-checked input").next("i").removeClass("green");
                        this1.next("i").addClass("green");
                        layer.close(index);
                        //					  return false;
                    }
                })
            };
        }
    }])
    //erp渠道管理
    app.controller('channelset', ['$scope', "erp", function ($scope, erp) {
        console.log('channelset')
        $scope.win = false;
        $scope.addwin = false;
        $scope.isSwitch = '1';
        $scope.userinfo = '';
        var bs = new Base64();
        var erpLoginName = bs.decode(localStorage.getItem('erploginName') == undefined ? '' : localStorage.getItem('erploginName'));
        console.log(erpLoginName)
        if (erpLoginName == 'admin') {
            $scope.isAdminFlag = true;
        } else {
            $scope.isAdminFlag = false;
        }
        //查询
        $scope.usersearch = function () {
            firstRequireFun();
        }
        $('.top-search-inp').keypress(function (Event) {
            if (Event.keyCode == 13) {
                $scope.usersearch();
            }
        })

        function firstRequireFun() {
            var data = {
                name: $scope.userinfo,
                status: $scope.isSwitch
            }
            layer.load(2);
            erp.postFun("app/erplogistics/queryLogisticChannel", data, function (data) {
                layer.closeAll("loading");
                console.log(data);
                if (data.status == 200) {
                    $scope.channelList = data.data;
                }
            }, function (data) {
                console.log("网络错误");
            })
        }

        firstRequireFun();
        $scope.FilterChange = function () {
            firstRequireFun();
        }
        var arr = [];
        for (var i = 100; i > 0; i--) {
            var obj = {};
            obj.num = i + "%";
            obj.nummy = i;
            arr.push(obj);
        }
        $scope.discount = arr;
        $scope.num = "100";
        console.log(!erp.isAdminLogin() && erpLoginName != '金仙娟')
        $scope.xinzeng = function () {
            if (!erp.isAdminLogin() && erpLoginName != '金仙娟') {
                layer.msg('只有管理员才能修改')
                return;
            }
            $("#show-img").children("h3").text("新增物流设置");
            $scope.addwin = true;
            $scope.num1 = "";
            $scope.num2 = "";
            $scope.cid = '';//物流公司
            $scope.mid = '';//物流方式
            $scope.addaccount = "";
            erp.postFun("app/erplogistics/queryChannelParam", null, function (data) {
                console.log(data);
                if (data.status == 200) {
                    $scope.companyList = data.data.companyList;
                    $scope.modeList = data.data.modeList;

                    $scope.discountnum1 = function (num1) {
                        // console.log($('#wuliucompany option:selected').text())
                        console.log(num1)
                        $scope.cid = num1;//获取公司名称
                    }
                    $scope.discountnum2 = function (num2) {
                        $scope.mid = num2;
                        console.log(num2)
                    }
                    $scope.sure = function () {
                        if ($scope.addaccount == '') {
                            layer.msg('请输入渠道代码');
                            return;
                        }
                        console.log($scope.num1, $scope.num2, $scope.addaccount);
                        // return;
                        var selectText = $("#selecttext").find("option:selected").text();
                        erp.postFun("app/erplogistics/addLogisticChannel", {
                            "appropriateDay": $scope.appropriateDay,
                            "cid": $scope.cid,
                            "mid": $scope.mid,
                            "code": $scope.addaccount,
                            "discountRate": $scope.num,
                            "cjDiscount": $scope.cjDiscount
                        }, function (data) {
                            console.log(data);
                            if (data.data.result == 1) {
                                firstRequireFun();
                                layer.msg("添加成功", {
                                    shift: -1
                                }, function () {
                                    // window.location.reload();
                                    firstRequireFun();
                                });
                            }
                        }, function (data) {
                            console.log("网络错误");
                        })

                    }
                }
            }, function (data) {
                console.log("网络错误");
            })
        }
        $scope.isNumFun = function (val) {
            $scope.appropriateDay = $scope.appropriateDay.replace(/[^1-9]/g, '')
        }
        //设置
        $scope.shezhi = function (item) {
            if (!erp.isAdminLogin() && erpLoginName != '金仙娟') {
                layer.msg('只有管理员才能修改')
                return;
            }
            $("#show-img").children("h3").text("修改物流渠道");
            $scope.addwin = true;
            var id = item.id;
            console.log(item)
            $scope.num1c = item.company;//获取该条的公司名称
            $scope.num2c = item.modecn;//获取该条的物流方式
            $scope.appropriateDay = item.appropriateDay;
            $scope.cjDiscount = item.cjDiscount;
            /*$('#wuliucompany option:selected').text($scope.num1c);
            $('#wlfstext option:selected').text($scope.num2c);*/

            erp.postFun("app/erplogistics/queryChannelParam", null, function (data) {
                console.log(data);
                if (data.status == 200) {
                    $scope.companyList = data.data.companyList;
                    $scope.modeList = data.data.modeList;
                    //点击设置之后请求数据
                    erp.postFun("app/erplogistics/queryLogisticChannelId", {
                        "id": item.id
                    }, function (data) {
                        console.log(data);
                        if (data.status == 200) {
                            // console.log($scope.num1c,$scope.num2c)
                            // $('#wuliucompany').text($scope.num1c);
                            // $('#wlfstext').text($scope.num2c);
                            $scope.cid = data.data[0].cid;
                            $scope.mid = data.data[0].mid;
                            //$scope.num1c = $('#wuliucompany option:selected').text()
                            console.log(data.data[0].company);
                            console.log($scope.num1);
                            $scope.num1 = data.data[0].companycode;
                            // $scope.num1c = data.data[0].company;

                            console.log($scope.num1, $scope.num1c);
                            $scope.num2 = data.data[0].modeen;
                            $scope.addaccount = data.data[0].code;
                            setTimeout(function () {
                                $('#wuliucompany').val(data.data[0].cid);
                                $('#wlfstext').val(data.data[0].mid);
                            }, 10)


                        }
                    }, function (data) {
                        console.log("网络错误");
                    })
                    $scope.discountnum1 = function (num1) {
                        // console.log($('#wuliucompany option:selected').text())
                        console.log(num1)
                        $scope.cid = num1;//获取公司名称
                    }
                    $scope.discountnum2 = function (num2) {
                        $scope.mid = num2;
                        console.log(num2)
                    }
                    //确定
                    $scope.sure = function () {
                        // console.log($scope.num1, $scope.num2, $scope.addaccount);
                        // return;
                        var selectText = $("#selecttext").find("option:selected").text();
                        $scope.num1c = $('#wuliucompany option:selected').text();
                        console.log($scope.num1, $scope.num1c, $scope.num2, $scope.addaccount, $scope.num);
                        console.log($scope.cid, $scope.mid)
                        //alert($("#wuliucompany").val()+"=="+$scope.cid+'=='+$scope.mid+"=="+$scope.addaccount);
                        // return;
                        erp.postFun("app/erplogistics/upLogisticChannel", {
                            "id": id,
                            /*"company": $scope.num1c,
                            "companycode": $scope.num1,
                            "modecn": selectText,
                            "modeen": $scope.num2,*/
                            "appropriateDay": $scope.appropriateDay,
                            "cid": $scope.cid,
                            "mid": $scope.mid,
                            "code": $scope.addaccount,
                            "discountRate": $scope.num,
                            "cjDiscount":$scope.cjDiscount
                        }, function (data) {
                            console.log(data);
                            if (data.data.result == 1) {
                                layer.msg("修改成功", {
                                    shift: -1
                                }, function () {
                                    // window.location.reload();
                                    firstRequireFun();
                                });
                            }
                        }, function (data) {
                            console.log("网络错误");
                        })

                    }
                }
            }, function (data) {
                console.log("网络错误");
            })
        }
        //刷新
        $scope.refreshFun = function () {
            erp.postFun('newlogistics/channel/refresh', {}, function (data) {
                console.log(data)
                if (data.data.statusCode == 200) {
                    layer.msg('刷新成功')
                } else {
                    layer.msg('刷新失败')
                }
            }, function (data) {
                console.log(data)
            }, { layer: true })
        }
        //重置
        $scope.resetFun = function () {
            erp.postFun('newlogistics/channel/reset', {}, function (data) {
                console.log(data)
                if (data.data.statusCode == 200) {
                    layer.msg('重置成功')
                    firstRequireFun();
                } else {
                    layer.msg('重置失败')
                }
            }, function (data) {
                console.log(data)
            }, { layer: true })
        }
        //删除
        $scope.sfshanchu = false;
        $scope.shanchu = function (ev, item) {
            if (!erp.isAdminLogin() && erpLoginName != '金仙娟') {
                layer.msg('只有管理员才能修改')
                return;
            }
            $scope.sfshanchu = true;
            console.log(item.id);
            var id = item.id;
            console.log($(ev.target).parent().parent());
            $scope.queding = function () {
                erp.postFun("app/erplogistics/deleteLogisticChannel", {
                    "id": id
                }, function (data) {
                    console.log(data);
                    if (data.data.result == 1) {
                        $(ev.target).parent().parent().remove();
                        layer.msg("删除成功")
                        $scope.sfshanchu = false;
                    }
                }, function (data) {
                    console.log("网络错误");
                    layer.msg('网络错误')
                })
                console.log("aa");
            }
            $scope.quxiao = function () {
                $scope.sfshanchu = false;
                console.log("bb");
            }
        }

        //停用
        $scope.zhuangtait = function (item, index, ev) {
            // $(ev.target).next("button").css();
            //隐藏停用按钮
            // $(ev.target).hide();
            if (!erp.isAdminLogin() && erpLoginName != '金仙娟') {
                layer.msg('只有管理员才能修改')
                return;
            }
            //显示启用按钮
            item.status = "0";
            erp.postFun('app/erplogistics/blockLogisticChannel', {
                'id': item.id
            }, function (data) {
                console.log(data);
                if (data.data.result == 1) {
                    layer.msg('停用成功')
                } else {
                    layer.msg('停用失败')
                }
            }, function (data) {
                console.log(data)
                layer.msg('网络错误')
            })

        }
        //启用
        $scope.zhuangtaiq = function (item, index, ev) {
            //隐藏启用按钮
            // $(ev.target).hide();
            //显示停用按钮
            if (!erp.isAdminLogin() && erpLoginName != '金仙娟') {
                layer.msg('只有管理员才能修改')
                return;
            }
            item.status = "1";
            erp.postFun('app/erplogistics/qiyongLogisticChannel', {
                'id': item.id
            }, function (data) {
                console.log(data);
                if (data.data.result == 1) {
                    layer.msg('启用成功')
                } else {
                    layer.msg('启用失败')
                }
            }, function (data) {
                console.log(data)
                layer.msg('网络错误')
            })
        }

    }])
    //erp物流渠道管理
    app.controller('coopcompanyCtrl', ["$scope", "erp", function ($scope, erp) {
        console.log('coopcompanyCtrl');
        var bs = new Base64();
        var erpLoginName = bs.decode(localStorage.getItem('erploginName') == undefined ? '' : localStorage.getItem('erploginName'));
        console.log(erpLoginName)
        if (erpLoginName == 'admin') {
            $scope.isAdminFlag = true;
        } else {
            $scope.isAdminFlag = false;
        }
        $scope.accountDialog = false;
        $scope.resetDialog = false;
        $scope.userName = '';
        $scope.password = '';
        $scope.restuserName = '';
        $scope.restpassword = '';
        $scope.accountId = '';
        $scope.resetId = '';

        // $scope.isaccount = false;
        function firstRequireFun() {
            erp.postFun("app/erplogistics/queryLogisticCompany", {
                "companyName": $scope.userinfo
            }, function (data) {
                console.log(data);
                if (data.status == 200) {
                    $scope.companList = data.data;
                }
            }, function (data) {
                console.log(data)
                layer.msg('网络错误')
            })
        }

        firstRequireFun();
        $('.top-search-inp').keypress(function (Event) {
            if (Event.keyCode == 13) {
                $scope.usersearch();
            }
        })
        $scope.usersearch = function () {
            erp.load()
            erp.postFun("app/erplogistics/queryLogisticCompany", {
                "companyName": $scope.userinfo
            }, function (data) {
                console.log(data);
                erp.closeLoad()
                if (data.status == 200) {
                    $scope.companList = data.data;
                }
            }, function (data) {
                console.log(data)
                erp.closeLoad()
                layer.msg('网络错误')
            })
        }
        $scope.xinzeng = function () {
            if (!erp.isAdminLogin() && erpLoginName != '金仙娟') {
                layer.msg('只有管理员才能修改')
                return;
            }
            $("#show-img").children("h3").text("新增物流渠道");
            $scope.addwin = true;
            $scope.addcompanyName = "";
            $scope.addcompanyjm = "";
            $scope.addurl = "";
            $scope.addapizh = "";
            $scope.addapimm = "";
            $scope.addapimy = "";
            $scope.addapitoken = "";
            $scope.addlianxi = "";
            $scope.addlianxidianhua = "";
            $scope.addlianxiQQ = "";
            $scope.addlianxiww = "";
            $scope.adddizhi = "";
            $scope.addbeizhu = "";
            //新增中的公司 邮编
            $scope.addcompany = '';
            $scope.addzip = '';
            $scope.sure = function () {
                var obj = {
                    companyName: $scope.addcompanyName,
                    companyCode: $scope.addcompanyjm,
                    platformUrl: $scope.addurl,
                    accounts: $scope.addapizh,
                    passWord: $scope.addapimm,
                    apiSecretKey: $scope.addapimy,
                    apiToken: $scope.addapitoken,
                    contacts: $scope.addlianxi,
                    contactPhone: $scope.addlianxidianhua,
                    contactqq: $scope.addlianxiQQ,
                    contactwx: $scope.addlianxiww,
                    companyAddress: $scope.adddizhi,
                    remark: $scope.addbeizhu,
                    //公司 邮编
                    company: $scope.addcompany,
                    zip: $scope.addzip
                }

                if ($scope.addcompanyName == '') {
                    layer.msg('物流公司名称为必填项')
                    return;
                }
                if ($scope.addcompanyjm == '') {
                    layer.msg('公司简码为必填项')
                    return;
                }
                //	    	console.log()
                erp.postFun("app/erplogistics/addLogisticCompany", JSON.stringify(obj), function (data) {
                    console.log(data);
                    if (data.data.result == 1) {
                        layer.msg("添加成功", {
                            shift: -1
                        }, function () {
                            // window.location.reload();
                            firstRequireFun();
                        });
                    }
                }, function (data) {
                    layer.msg('网络错误')
                })
            }
        }

        $scope.shezxhi = function (item) {
            if (!erp.isAdminLogin() && erpLoginName != '金仙娟') {
                layer.msg('只有管理员才能修改')
                return;
            }
            $("#show-img").children("h3").text("修改物流渠道");
            $scope.addwin = true;
            var id = item.id;
            erp.postFun("app/erplogistics/queryLogisticCompanyId", {
                "id": item.id
            }, function (data) {
                console.log(data);
                if (data.status == 200) {
                    console.log("aa");
                    $scope.addwin = true;
                    $scope.xinxi = data.data;
                    console.log($scope.xinxi[0].companyName);
                    //  				console.log($scope.addcompanyName);
                    $scope.addcompanyName = data.data[0].companyName;
                    $scope.addcompanyjm = data.data[0].companyCode;
                    $scope.addurl = data.data[0].platformUrl;
                    $scope.addapizh = data.data[0].accounts;
                    $scope.addapimm = data.data[0].passWord;
                    $scope.addapimy = data.data[0].apiSecretKey;
                    $scope.addapitoken = data.data[0].apiToken;
                    $scope.addlianxi = data.data[0].contacts;
                    $scope.addlianxidianhua = data.data[0].contactPhone;
                    $scope.addlianxiQQ = data.data[0].contactqq;
                    $scope.addlianxiww = data.data[0].contactwx;
                    $scope.adddizhi = data.data[0].companyAddress;
                    $scope.addbeizhu = data.data[0].remark
                    //新增的公司 邮编
                    $scope.addcompany = data.data[0].company;
                    $scope.addzip = data.data[0].zip;
                    $scope.sure = function () {
                        var obj = {
                            companyName: $scope.addcompanyName,
                            companyCode: $scope.addcompanyjm,
                            platformUrl: $scope.addurl,
                            accounts: $scope.addapizh,
                            passWord: $scope.addapimm,
                            apiSecretKey: $scope.addapimy,
                            apiToken: $scope.addapitoken,
                            contacts: $scope.addlianxi,
                            contactPhone: $scope.addlianxidianhua,
                            contactqq: $scope.addlianxiQQ,
                            contactwx: $scope.addlianxiww,
                            companyAddress: $scope.adddizhi,
                            remark: $scope.addbeizhu,
                            id: id,
                            //国家 邮编
                            company: $scope.addcompany,
                            zip: $scope.addzip
                        }
                        if ($scope.addcompanyName == '') {
                            layer.msg('物流公司名称为必填项')
                            return;
                        }
                        if ($scope.addcompanyjm == '') {
                            layer.msg('公司简码为必填项')
                            return;
                        }
                        //	    	console.log()
                        erp.postFun("app/erplogistics/upLogisticCompany", JSON.stringify(obj), function (data) {
                            console.log(data);
                            if (data.data.result == 1) {
                                layer.msg("修改成功", {
                                    shift: -1
                                }, function () {
                                    // window.location.reload();
                                    firstRequireFun();
                                });
                            }
                        }, function (data) {
                            console.log("网络错误");
                            layer.msg('网络错误')
                        })
                    }
                }
            }, function (data) {
                console.log("网络错误");
                layer.msg('网络错误')
            });
        };
        //删除
        $scope.sfshanchu = false;
        $scope.shanchu = function (ev, item) {
            if (!erp.isAdminLogin() && erpLoginName != '金仙娟') {
                layer.msg('只有管理员才能修改')
                return;
            }
            $scope.sfshanchu = true;
            console.log(item.id);
            console.log($(ev.target).parent().parent());
            $scope.queding = function () {
                erp.postFun("app/erplogistics/deleteLogisticCompany", {
                    "id": item.id
                }, function (data) {
                    console.log(data);
                    if (data.data.result == 1) {
                        $(ev.target).parent().parent().remove();
                        layer.msg("删除成功")
                        $scope.sfshanchu = false;
                    }
                }, function (data) {
                    console.log("网络错误");
                    layer.msg('网络错误')
                })
            }
            $scope.quxiao = function () {
                $scope.sfshanchu = false;
            }
        }
        //添加账号
        $scope.addAccount = function (item) {
            if (!erp.isAdminLogin() && erpLoginName != '金仙娟') {
                layer.msg('只有管理员才能修改')
                return;
            }
            console.log(item)
            $scope.accountId = item.id;
            $scope.accountDialog = true;
        }
        $scope.accountY = function () {
            erp.postFun('app/erplogistics/setLoginName', {
                id: $scope.accountId,
                account: $scope.userName,
                pwd: $scope.password
            }, function (res) {
                if (res.data.statusCode == 200) {
                    layer.msg('添加成功')
                    firstRequireFun()
                    $scope.accountDialog = false;
                } else {
                    layer.msg('添加失败')
                }
            }, function (res) {
                layer.msg('添加失败')
            })
        }
        $scope.accountN = function () {
            $scope.accountDialog = false;
        }
        //重置密码
        $scope.resetPwd = function (item) {
            if (!erp.isAdminLogin() && erpLoginName != '金仙娟') {
                layer.msg('只有管理员才能修改')
                return;
            }
            $scope.resetDialog = true;
            $scope.restuserName = item.account;
            $scope.resetId = item.id;
        }
        $scope.restY = function () {
            erp.postFun('app/erplogistics/resetPwd', { id: $scope.resetId, pwd: $scope.restpassword }, function (res) {
                if (res.data.statusCode == 200) {
                    layer.msg('重置成功')
                    firstRequireFun()
                    $scope.resetDialog = false;
                } else {
                    layer.msg('重置失败')
                }
            }, function (res) {
                layer.msg('重置失败')
            })
        }
        $scope.restN = function () {
            $scope.resetDialog = false;
        }
    }])
    //erp物流方式管理
    app.controller('channelsetStyleCtrl', ["$scope", "erp", function ($scope, erp) {
        console.log("channelsetStyleCtrl");
        var bs = new Base64();
        var erpLoginName = bs.decode(localStorage.getItem('erploginName') == undefined ? '' : localStorage.getItem('erploginName'));
        console.log(erpLoginName)
        if (erpLoginName == 'admin') {
            $scope.isAdminFlag = true;
        } else {
            $scope.isAdminFlag = false;
        }
        $scope.isSwitch = '1';

        function firstRequireFun() {
            erp.load()
            erp.postFun("app/erplogistics/queryLogisticMode", {
                "param": "",
                status: $scope.isSwitch
            }, function (data) {
                console.log(data);
                erp.closeLoad()
                $scope.logStyleList = data.data.result;
            }, function (data) {
                erp.closeLoad()
                console.log(data);
                layer.msg('网络错误')
            })
        }

        firstRequireFun();
        $scope.FilterChange = function () {
            //firstRequireFun();
            $scope.usersearch();
        }
        $('.top-search-inp').keypress(function (ev) {
            if (ev.which == 13) {
                $scope.usersearch();
            }
        });
        $scope.usersearch = function () {
            // if(!$scope.userinfo){
            //     layer.msg('请输入查询条件')
            // }else{

            // }
            layer.load(2)
            erp.postFun('app/erplogistics/queryLogisticMode', {
                'param': $scope.userinfo,
                status: $scope.isSwitch
            }, function (data) {
                console.log(data)
                $scope.logStyleList = data.data.result;
                layer.closeAll("loading")
            }, function (data) {
                console.log(data)
                layer.closeAll("loading")
            })
        }
        //点击不限重
        $scope.buxianzhong = function (ev) {
            $scope.addxianzhong = 99999999;
        }
        //获取属性的东西
        var chactBoc = [];
        var chactLab = [];
        $scope.getPropertyInfo = function (ev) {
            var checked = $(ev.target).prop('checked');
            if (checked == true) {
                chactBoc.push($(ev.target).val());
                chactLab.push($(ev.target).next("label").text());
                console.log(chactBoc)
                console.log(chactLab)
            }
            if (checked == false) {
                for (var i = 0; i < chactBoc.length; i++) {
                    if (chactBoc[i] == $(ev.target).val()) {
                        chactBoc.splice(i, 1)
                    }
                    if (chactLab[i] == $(ev.target).next("label").text()) {
                        chactLab.splice(i, 1)
                    }
                }
            }
        }
        //新增
        $scope.test = function () {
            console.log($scope.addlogStyleyn)
        }
        $scope.xinzeng = function () {
            // $scope.XinzhengOrShezhiFlag = true;
            if (!erp.isAdminLogin() && erpLoginName != '金仙娟') {
                layer.msg('只有管理员才能修改')
                return;
            }
            $scope.xinzengFlag = true;
            $scope.shezhiFlag = false;
            chactBoc = [];
            chactLab = [];
            $(".check-box").children("input").prop("checked", false);//清空属性选中
            $("#show-img").children("h3").text("新增物流方式");
            $scope.addwin = true;
            $scope.addlogStylezn = "";
            $scope.addlogStyleyn = "";
            $scope.addlogStyle = "";
            $scope.addtime1 = "";
            $scope.addtime2 = "";
            $scope.addxianzhong = "";
            $scope.addzhekou = 100
            $scope.sure = function () {
                if ($('#wuliu-remark').html() && erp.isInputChinese($('#wuliu-remark').html())) {
                    layer.msg('备注不能输入中文');
                    return;
                }
                console.log($scope.addlogStyleyn)
                console.log(chactBoc);
                console.log(chactLab);
                console.log($scope.addlogStylezn, $scope.addlogStyleyn, $scope.addlogStyle, $scope.addtime1, $scope.addtime2, $scope.addxianzhong, $scope.addzhekou);
                //      	$scope.addtime = $scope.addtime1 + "-" + $scope.addtime2;
                var chactBocloda = chactBoc.join(",");
                var chactBocloda1 = chactLab.join(",");
                if ($('#wuliu-remark').html() == "<br>") {
                    $('#wuliu-remark').html('');
                }
                erp.postFun("app/erplogistics/addLogisticMode", {
                    "namecn": $scope.addlogStylezn,
                    "nameen": $scope.addlogStyleyn,
                    "mode": $scope.addlogStyle,
                    "endAging": $scope.addtime2,
                    "beginAging": $scope.addtime1,
                    "weightLimit": $scope.addxianzhong,
                    "discount": $scope.addzhekou,
                    "property": chactBocloda,
                    "propertycn": chactBocloda1,
                    "remark": $('#wuliu-remark').html() || ''
                }, function (data) {
                    console.log(data);
                    if (data.data.result == 1) {
                        $scope.addwin = false;
                        firstRequireFun();
                        layer.msg("添加成功", {
                            shift: -1
                        });
                    }
                }, function (data) {
                    layer.msg('网络错误')
                })
            };
        }
        //启用停用函数
        $scope.tyWlFun = function (item, index) {
            if (!erp.isAdminLogin() && erpLoginName != '金仙娟') {
                layer.msg('只有管理员才能修改')
                return;
            }
            $scope.isTyFlag = true;
            $scope.itemId = item.id;
            $scope.state = item.state;
        }
        $scope.qyWlFun = function (item, index) {
            if (!erp.isAdminLogin() && erpLoginName != '金仙娟') {
                layer.msg('只有管理员才能修改')
                return;
            }
            $scope.isQyFlag = true;
            $scope.itemId = item.id;
            $scope.state = item.state;
        }
        $scope.isWorkFun = function () {
            layer.load(2)
            $scope.isTyFlag = false;
            $scope.isQyFlag = false;
            var getcsData = {};
            getcsData.id = $scope.itemId;
            if ($scope.state == 1) {
                getcsData.status = 0;
            } else {
                getcsData.status = 1;
            }
            erp.postFun('app/erplogistics/logisticModeStatus', JSON.stringify(getcsData), function (data) {
                console.log(data)
                layer.closeAll('loading')
                if (data.data.statusCode == 200) {
                    layer.msg('成功')
                    firstRequireFun();
                } else {
                    layer.msg('失败')
                }
            }, function (data) {
                layer.closeAll('loading')
                console.log(data)
            })
        }
        //设置
        $scope.shezhi = function (item) {
            // $scope.XinzhengOrShezhiFlag = true;
            if (!erp.isAdminLogin() && erpLoginName != '金仙娟') {
                layer.msg('只有管理员才能修改')
                return;
            }
            $scope.xinzengFlag = false;
            $scope.shezhiFlag = true;
            $("#show-img").children("h3").text("编辑物流方式");
            var id = item.id;
            erp.postFun("app/erplogistics/queryLogisticModeId", {
                "id": item.id
            }, function (data) {
                console.log(data);
                if (data.status == 200) {
                    $scope.addwin = true;
                    $scope.addlogStylezn = data.data.result[0].namecn;
                    $scope.addlogStyleyn = data.data.result[0].nameen;
                    $scope.addlogStyle = data.data.result[0].mode;
                    $scope.addtime1 = data.data.result[0].beginAging - 0;
                    $scope.addtime2 = data.data.result[0].endAging - 0;
                    $scope.addxianzhong = data.data.result[0].weightlimit - 0;
                    $scope.addzhekou = data.data.result[0].discount - 0;
                    $scope.wuliuRemark = data.data.result[0].remark;
                    var proper = data.data.result[0].property;//获取该条物流的属性
                    console.log(proper)
                    var properarr = proper.split(",");
                    console.log(properarr);
                    var lengtharr = properarr.length;//获取到的商品属性的数组长度
                    var lengthdom = $(".check-box").length;//复选框的长度
                    console.log(lengtharr, lengthdom);
                    if (properarr == 0) {
                        $(".check-box").children("input").prop("checked", false);
                    } else {
                        $(".check-box").children("input").prop("checked", false);//清空上条选中
                        for (var j = 0; j < lengtharr; j++) {
                            for (var i = 0; i < lengthdom; i++) {
                                if (properarr[j] == $(".check-box").eq(i).children("input").val()) {
                                    console.log(properarr[j]);
                                    console.log($(".check-box").eq(i).children("input").val());
                                    console.log("判断相等进来了");
                                    //      						$(".check-box").eq(i).children("label").css("background-image","url(./static/image/public-img/multiple2.png)")
                                    $(".check-box").eq(i).children("input").prop("checked", true);
                                }
                            }
                        }
                    }

                    $scope.sure = function () {
                        chactBoc = [];
                        chactLab = [];
                        var length = $(".check-box input").length;
                        for (var i = 0; i < length; i++) {
                            if ($(".check-box input").eq(i).prop('checked') == true) {
                                console.log(i);
                                chactBoc.push($(".check-box input").eq(i).val());
                                chactLab.push($(".check-box input").eq(i).next("label").text());
                            }

                        }
                        console.log(chactBocloda1);
                        var chactBocloda = chactBoc.join(",");
                        var chactBocloda1 = chactLab.join(",");
                        if ($scope.wuliuRemark == "<br>") {
                            $scope.wuliuRemark = '';
                        }
                        // console.log($scope.wuliuRemark)
                        erp.postFun("app/erplogistics/upLogisticMode", {
                            "id": id,
                            "namecn": $scope.addlogStylezn,
                            "nameen": $scope.addlogStyleyn,
                            "mode": $scope.addlogStyle,
                            "endAging": $scope.addtime2,
                            "beginAging": $scope.addtime1,
                            "weightLimit": $scope.addxianzhong,
                            "discount": $scope.addzhekou,
                            "property": chactBocloda,
                            "propertycn": chactBocloda1,
                            "remark": $scope.wuliuRemark || ''
                        }, function (data) {
                            console.log(data);
                            if (data.data.result == 1) {
                                $scope.addwin = false;
                                firstRequireFun();
                                layer.msg("修改成功", {
                                    shift: -1
                                });
                            }
                        }, function (data) {
                            layer.msg('网络错误')
                        })
                    }
                }

            }, function (data) {
                console.log("网络错误")
                layer.msg('网络错误')
            })

        }
        //删除
        $scope.sfshanchu = false;
        $scope.shanchu = function (ev, item) {
            if (!erp.isAdminLogin() && erpLoginName != '金仙娟') {
                layer.msg('只有管理员才能修改')
                return;
            }
            $scope.sfshanchu = true;
            console.log(item.id);
            console.log($(ev.target).parent().parent());
            $scope.queding = function () {
                erp.postFun("app/erplogistics/deleteLogisticMode", {
                    "id": item.id
                }, function (data) {
                    console.log(data);
                    if (data.data.result == 1) {
                        $(ev.target).parent().parent().remove();
                        layer.msg("删除成功")
                        $scope.sfshanchu = false;
                    }
                }, function (data) {
                    console.log("网络错误");
                    layer.msg('网络错误')
                })
            }
            $scope.quxiao = function () {
                $scope.sfshanchu = false;
            }
        }
    }])


    //erp追踪物流公司统计
    app.controller('trackstatisticsCtrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('物流公司统计')
        $scope.wlCompanyList = [];
        $scope.day = 0;
        function getWlGsFun() {
            erp.load()
            if ($('#e-time').val() || $('#b-time').val()) {
                $scope.day = null;
            }
            let upJson = {};
            upJson.logisticsName = $scope.userinfo;
            upJson.startDate = $('#b-time').val();
            upJson.endDate = $('#e-time').val();
            upJson.day = $scope.day;
            erp.postFun('newlogistics/logistics/logisticCompanyStatisticsNew', upJson, function (data) {
                console.log(data)
                erp.closeLoad()
                if (data.data.statusCode == '200') {
                    let resObj = data.data.result;
                    if (JSON.stringify(resObj) != '{}') {
                        // for (let i in resObj) {
                        //     resObj[i]['companyName'] = i;
                        //     console.log(resObj[i])
                        //     arr.push(resObj[i])
                        // }
                        $scope.wlCompanyList = data.data.result;
                        console.log($scope.wlCompanyList)
                    } else {
                        $scope.wlCompanyList = [];
                    }

                }
            }, function (data) {
                console.log(data)
                erp.closeLoad()
            })
        }
        getWlGsFun()
        $scope.usersearch = function () {
            getWlGsFun()
        }
        $scope.timeSeaFun = function (day) {
            $('#b-time').val('')
            $('#e-time').val('')
            $scope.day = day;
            getWlGsFun()
        }
    }])
    //erp物流方式统计
    app.controller('logististylelCtrl', ['$scope', 'erp', function ($scope, erp) {
        let doms = document.getElementById("container");
        let myChartes = echarts.init(doms);

        // 基于准备好的dom，初始化echarts实例
        // var myChart = echarts.init(document.getElementById('main'));
        // var myCircle = echarts.init(document.getElementById('circle'));
        // var mystatusInfo = echarts.init(document.getElementById('statusInfo'));
        // 下拉账户
        $scope.daysList = [
            { "value": "All", "id": "0" },
            { "value": "30days", "id": "1" },
            { "value": "90days", "id": "2" },
        ];
        // 下拉仓库
        $scope.warehouse = erp
            .getStorage()
            .map(_ => ({ id: _.dataId, storageName: _.dataName }));

        Empty = function () {
            $scope.startDate = '',
                $scope.endDate = ''
        }

        //option参数
        let option3 = {
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '直接访问',
                    type: 'bar',
                    barWidth: '60%',
                    data: [10, 52, 200, 334, 390, 330, 220]
                }
            ]
        }

        // 搜索
        $scope.inquire = function () {
            if ($scope.selectDate == undefined && $scope.logisticsName == undefined) {
                layer.msg('请选择时间或物流')
            } else if ($scope.selectDate != undefined && $scope.logisticsName != undefined) {
                layer.msg('请选择时间或物流')
            } else {
                let params = {}
                params.selectDate = $scope.selectDate || '',
                    params.store = $scope.store || '',
                    params.logisticsName = $scope.logisticsName || '',
                    params.startDate = $scope.startDate || '',
                    params.endDate = $scope.endDate || ''

                erp.postFun('newlogistics/logistics/logisticsOrderCountStatistics', JSON.stringify(params), function (res) {
                    console.log(res.data.statusCode)
                    if (res.data.statusCode == '200') {
                        console.log("成功")
                        $scope.sum = res.data.result.dayCounts;
                        // $scope.sum.filter((value,key,arr) => {
                        //     console.log("name",key)
                        //     console.log("count",$scope.sum[key].count)
                        //     $scope.sumes = []
                        //     $scope.sumes.push($scope.sum[key].count)

                        // })
                        $scope.sumes = []
                        $scope.names = []
                        $scope.sum.map((item, i) => {
                            console.log("index", i)
                            // console.log("count",$scope.sum[i].count)
                            $scope.sumes.push($scope.sum[i].count)
                            $scope.names.push($scope.sum[i].name)
                        })
                        option3.xAxis[0].data = $scope.names
                        option3.series[0].data = $scope.sumes

                        console.log("sumes", $scope.sumes)
                        console.log("names", $scope.names)
                        console.log("y轴", option3.xAxis.data)
                        console.log("x轴", option3.series.data)
                        console.log(option3)
                        
                        // if (option3 && typeof option3 === "object") {
                        //     myChartes.setOption(option3, true);
                        // }
                        myChartes.setOption(option3, true);
                        console.log()
                        Empty()
                    }
                }, () => {}, { layer: true })
            }
        }

        $scope.sourcestatus1 = $scope.daysList[0].id;
        erp.postFun('newlogistics/logistics/getAccountInfo', {}, function (res) {
            console.log(res.data.statusCode)

            if (res.data.statusCode == '200') {
                $scope.accountList = res.data.result;
                // $scope.accountItem = res.data.result[0].id;
                // $scope.echartDataLoad('','account')
            }
            // erp.closeLoad()
        })
        console.log('logististylelCtrl')

    }])
    //erp客户物流统计
    app.controller('cslogistiCtrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('cslogistiCtrl')
        erp.load();
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
        var myCircle = echarts.init(document.getElementById('circle'));
        var mystatusInfo = echarts.init(document.getElementById('statusInfo'));
        // 下拉账户
        $scope.daysList = [
            { "value": "All", "id": "0" },
            { "value": "30days", "id": "1" },
            { "value": "90days", "id": "2" },
        ];
        $scope.sourcestatus1 = $scope.daysList[0].id;
        erp.postFun('newlogistics/logistics/getAccountInfo', {}, function (res) {
            console.log(res.data.statusCode)
           
            if (res.data.statusCode == '200') {
                $scope.accountList = res.data.result;
                $scope.accountItem = res.data.result[0].id;
                $scope.echartDataLoad('','account')
            }
            erp.closeLoad()
        })
        // 选择账户
        $scope.getaccount = function (item) {
            $scope.echartDataLoad($scope.sourcestatus1,'account')
            $scope.searchItem = ''
        }
        // 选择时间
        $scope.dayChange = function (value) {
            console.log($scope.accountItem)
            console.log($scope.searchItem)
            if($scope.searchItem != undefined && $scope.searchItem != ''){
                $scope.echartDataLoad(value,'search');
            }else{
                $scope.echartDataLoad(value,'account');
            }
            
        }
        // 搜素
        $scope.searchFun = function(){
            $scope.echartDataLoad($scope.sourcestatus1 ,'search')
            $scope.accountItem = ''
        }
        $scope.echartDataLoad = function (day,flag) {
            console.log($scope.accountItem)
            console.log(day)
            var params = {};
            if(flag == 'account'){
                if (day == 0) {
                    params = {
                        platForm: 'erp',
                        accountId: $scope.accountItem == undefined ? '' :$scope.accountItem,
                    };
                } else {
                    params = {
                        days: day == 1 ? 30 : 90,
                        platForm: 'erp',
                        accountId: $scope.accountItem == undefined ? '' :$scope.accountItem,
                    }
                }
            }else{
                if (day == 0) {
                    params = {
                        platForm: 'erp',
                        search :$scope.searchItem == undefined ? '' :$scope.searchItem
                    };
                } else {
                    params = {
                        days: day == 1 ? 30 : 90,
                        platForm: 'erp',
                        search :$scope.searchItem== undefined ? '' :$scope.searchItem
                    }
                }
            }
            console.log(params);
            erp.postFun('newlogistics/logistics/statistics', JSON.stringify(params), function (data) {
                console.log(data);
                if (data.data.statusCode == 200) {
                    if(data.data.result.statistics.length == 0 &&JSON.stringify(data.data.result.statusInfo) == "{}"){
                        layer.msg('此账户暂无物流方式统计')
                    }
                    if (data.data.result.statistics.length == 0) {
                        $scope.showstatistics = false;
                    } else {
                        $scope.showstatistics = true;
                    }
                    if (JSON.stringify(data.data.result.statusInfo) == "{}") {
                        $scope.showstatusInfo = false;
                        $scope.showicon = false;
                    } else {
                        $scope.showstatusInfo = true;
                        $scope.showicon = true;
                    }
                    var deliveryOrderCount = [];
                    var notDeliveryOrderCount = [];
                    var logisticsName = [];
                    var averageDeliveryDay = [];
                    var deliveryRate = [];
                    var totalDeliveryOrder = 0;
                    var sixDeliveryOrder = 0;
                    var deliveryRateLogisticsName = [];
                    var logisticsInfos = data.data.result.statistics;
                    $scope.cLogisticsInfo = data.data.result.countryLogisticsInfo
                    console.log("列表",$scope.cLogisticsInfo)
                    var logisticsStatus = data.data.result.statusInfo;
                    var maxDeliveryOrder = 0;
                    var maxAveragyDeliveryDay = 0;
                    for (var i = 0; i < logisticsInfos.length; i++) {
                        if (logisticsInfos[i].deliveryCount > maxDeliveryOrder) maxDeliveryOrder = logisticsInfos[i].deliveryCount;
                        if (logisticsInfos[i].notDeliveryCount > maxDeliveryOrder) maxDeliveryOrder = logisticsInfos[i].notDeliveryCount;
                        if (logisticsInfos[i].averageDeliveryDay > maxAveragyDeliveryDay) maxAveragyDeliveryDay = logisticsInfos[i].averageDeliveryDay;
                        deliveryOrderCount.push(logisticsInfos[i].deliveryCount);
                        notDeliveryOrderCount.push(logisticsInfos[i].notDeliveryCount);
                        logisticsName.push(logisticsInfos[i].logisticsName);
                        averageDeliveryDay.push(logisticsInfos[i].averageDeliveryDay);
                        totalDeliveryOrder += logisticsInfos[i].deliveryRate;
                    }
                    console.log(logisticsInfos)
                    // 排序
                    function sortId(a, b) {
                        return b.deliveryRate - a.deliveryRate
                    }
                    logisticsInfos.sort(sortId);
                    console.log(logisticsInfos)
                    var j = 0;
                    for (var i = 0; i < logisticsInfos.length; i++) {
                        if (j <= 4 && logisticsInfos[i].deliveryCount > 0) {
                            j++;
                            deliveryRate.push({ value: logisticsInfos[i].deliveryRate, name: logisticsInfos[i].logisticsName });
                            deliveryRateLogisticsName.push(logisticsInfos[i].logisticsName);
                            sixDeliveryOrder += logisticsInfos[i].deliveryRate;
                        }
                    }
                    console.log(deliveryRate)
                    if (deliveryRate.length > 4 && totalDeliveryOrder - sixDeliveryOrder > 0) {
                        deliveryRate.push({ value: (totalDeliveryOrder - sixDeliveryOrder).toFixed(2), name: "Other" });
                        console.log(deliveryRate)
                        deliveryRateLogisticsName.push("Other");
                    }
                    for (var i = 0; i < option.series.length; i++) {
                        if (option.series[i].name == "Delivered") option.series[i].data = deliveryOrderCount;
                        if (option.series[i].name == "Ready for delivery") option.series[i].data = notDeliveryOrderCount;
                        if (option.series[i].name == "Average delivery time") option.series[i].data = averageDeliveryDay;
                    }
                    for (var i = 0; i < option.yAxis.length; i++) {
                        if (option.yAxis[i].name == "Orders") {
                            option.yAxis[i].max = maxDeliveryOrder;
                            option.yAxis[i].interval = Math.ceil(maxDeliveryOrder / 10);
                        }
                        if (option.yAxis[i].name == "Average delivery time/days") {
                            option.yAxis[i].max = maxAveragyDeliveryDay;
                            option.yAxis[i].interval = Math.ceil(maxAveragyDeliveryDay / 10);
                        }
                    }
                    console.log(logisticsStatus)
                    var arrvalue = [];
                    var arrname = [];
                    var arr = [];
                    for (let i in logisticsStatus) {
                        arrvalue.push(logisticsStatus[i]); //属性
                        arrname.push(i)
                    }
                    for (var i = 0; i < arrname.length; i++) {
                        arr.push({
                            name: arrname[i],
                            value: arrvalue[i]
                        })
                    }
                    option.xAxis[0].data = logisticsName;

                    option1.legend.data = deliveryRateLogisticsName;
                    option1.series[0].data = deliveryRate;
                    // option1.series[0].name = 'deliveryRate';

                    option2.legend.data = arrname;
                    option2.series[0].data = arr;
                    // option2.series[0].name = 'deliveryRate';
                    myChart.setOption(option);
                    myCircle.setOption(option1);
                    mystatusInfo.setOption(option2)
                }
            }, function (n) {
                console.log(n);
            });
        }

        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },

            legend: {
                data: ['Delivered', 'Ready for delivery', 'Average delivery time']
            },
            xAxis: [
                {
                    type: 'category',
                    data: [],
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: 'Orders',
                    min: 0,
                    max: 250,
                    interval: 50,
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    name: 'Average delivery time/days',
                    min: 0,
                    max: 25,
                    interval: 5,
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: [
                {
                    name: 'Delivered',
                    type: 'bar',
                    data: [],
                    itemStyle: {
                        normal: {
                            color: '#F76F20'
                        }
                    },
                },
                {
                    name: 'Ready for delivery',
                    type: 'bar',
                    data: [],
                    itemStyle: {
                        normal: {
                            color: '#FEE0BB'
                        }
                    },
                },
                {
                    name: 'Average delivery time',
                    type: 'line',
                    yAxisIndex: 1,
                    data: [],
                    itemStyle: {
                        normal: {
                            color: '#F76B1C'
                        }
                    },
                }
            ],
            // grid: [
            //     { 
            //         height: 440,
            //         x:700,
            //     }
            // ],
            dataZoom: [
                {
                    startValue: '50'    //只需要将这一项设置为0即可
                },
                {
                    type: 'inside'
                }
            ],
        };

        option1 = {
            title: {
                text: 'Successful delivery rate',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "Compare with current shipping: {c}% <br/>Compare with all shipping: {d}%"
            },
            legend: {
                orient: 'vertical',
                right: 0,
                top: 50,
                bottom: 20,
                data: []
            },
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: ['30%', '60%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '16',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: []
                }
            ]
        };

        option2 = {
            title: {
                text: 'Order status',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{b}: {c} <br> CJ order rate: {d}%"
            },
            legend: {
                orient: 'vertical',
                // x: 'right',
                right: 0,
                top: 50,
                bottom: 20,
                data: []
            },
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: ['30%', '60%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '12',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: []
                }
            ]
        }


    }])

    //erp运费试算
    app.controller('logisticsfreighttrialCtrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('logisticsfreighttrialCtrl')
        //获取物流信息
        var upcsData = {};
        upcsData.country = "CN";
        erp.postFun2("getNewModel2.json", JSON.stringify(upcsData), function (data) {
            console.log(data);
            if (data.status == 200) {
                var obj = data.data;
                $scope.logistics = obj;
                $scope.logisticsMode = "";
            }
        }, function (data) {
            //      	alert("物流信息获取失败");
        })

        //获取折扣列表
        getDiscountList();

        function getDiscountList() {
            var zhekouList = localStorage.getItem('zhekouList');
            if (zhekouList == '' || zhekouList == null || zhekouList == undefined) {
                var sendData = { "param": "", "status": "1" };
                erp.load();
                erp.postFun('app/erplogistics/queryLogisticMode', JSON.stringify(sendData), function (data) {
                    erp.closeLoad();
                    $scope.discountList = data.data.result;
                    localStorage.setItem('zhekouList', JSON.stringify(data.data.result));
                }, function () {
                    erp.closeLoad();
                });
            } else {
                $scope.discountList = JSON.parse(zhekouList);
            }
            console.log($scope.discountList);

        }

        //根据物流方式筛选能到的国家/app/logistic/getCountryByAll : { "country":"US" }
        $scope.isallFlag = true;
        $scope.logisticsMode1 = function (logisticsMode) {
            console.log(logisticsMode)
            console.log($scope.exportingCountry)
            if ($scope.exportingCountry == '美国' || $scope.exportingCountry=='泰国') {
                if (logisticsMode == '') {
                    $scope.isallFlag = true;
                } else {
                    $scope.isallFlag = false;
                }
                if ($scope.isallFlag) {
                    //获取目的国家
                    var usUpdata = {}
                    if($scope.exportingCountry=='美国'){
                        usUpdata.country = "US";
                    }else if($scope.exportingCountry=='泰国'){
                        usUpdata.country = "TH";
                    }
                    erp.postFun("app/logistic/getCountryByAll", JSON.stringify(usUpdata), function (data) {
                        console.log(data.data);
                        if (data.status == 200) {
                            var obj = JSON.parse(data.data.result);
                            console.log(obj.countryList);
                            $scope.nation = obj.countryList;
                            if($scope.exportingCountry=='美国'){
                                $scope.countryDestination = "US";
                            }else if($scope.exportingCountry=='泰国'){
                                $scope.countryDestination = "TH";
                            }
                        }
                    }, function (data) {
                        layer.msg("国家信息获取失败")
                    })
                } else {
                    var upData = {};
                    upData.loginsticName = logisticsMode;
                    console.log(JSON.stringify(upData))
                    erp.postFun2('lc/erplogistics/getLogisticCountry', JSON.stringify(upData), function (data) {
                        // console.log(data)
                        console.log(data.data)
                        $scope.filterCountry = data.data;
                        console.log($scope.filterCountry)
                        // $scope.countryDestination = "US";
                        for (var i = 0; i < $scope.filterCountry.length; i++) {
                            if ($scope.filterCountry[i].country == "US") {
                                $scope.countryDestination = "US";
                                break;
                            } else {
                                $scope.countryDestination = $scope.filterCountry[0].country;
                            }
                        }
                    }, function (data) {
                        console.log(data)
                    })
                }
            } else {
                if (logisticsMode == '') {
                    $scope.isallFlag = true;
                } else {
                    $scope.isallFlag = false;
                }
                if ($scope.isallFlag) {
                    //获取目的国家
                    erp.postFun("app/logistic/getcountry", null, function (data) {
                        console.log(data.data);
                        //          console.log(data.data.result);
                        if (data.status == 200) {
                            var obj = JSON.parse(data.data.result);
                            console.log(obj.countryList);
                            $scope.nation = obj.countryList;
                            $scope.countryDestination = "US";
                        }
                    }, function (data) {
                        layer.msg("国家信息获取失败")
                    })
                } else {
                    var upData = {};
                    upData.loginsticName = logisticsMode;
                    console.log(JSON.stringify(upData))
                    erp.postFun2('lc/erplogistics/getLogisticCountry', JSON.stringify(upData), function (data) {
                        // console.log(data)
                        console.log(data.data)
                        $scope.filterCountry = data.data;
                        console.log($scope.filterCountry)
                        // $scope.countryDestination = "US";
                        for (var i = 0; i < $scope.filterCountry.length; i++) {
                            if ($scope.filterCountry[i].country == "US") {
                                $scope.countryDestination = "US";
                                break;
                            } else {
                                $scope.countryDestination = $scope.filterCountry[0].country;
                            }
                        }
                    }, function (data) {
                        console.log(data)
                    })
                }
            }
        }
        //根据国家筛选物流方式
        $scope.exportingCountry = '中国';
        $scope.cnorusCode = 'CN';
        $scope.exportingCountry1 = function (exportingCountry) {
            console.log(exportingCountry)
            console.log($scope.exportingCountry)
            $scope.isallFlag = true;
            var upcsData = {};
            if ($scope.exportingCountry == '中国') {
                $scope.cnorusCode = 'CN';
                upcsData.country = "CN";
                erp.postFun2("getNewModel2.json", JSON.stringify(upcsData), function (data) {
                    console.log(data);
                    if (data.status == 200) {
                        var obj = data.data;
                        $scope.logistics = obj;
                        $scope.logisticsMode = "";
                    }
                }, function (data) {
                    console.log('获取物流失败')
                })

                erp.postFun("app/logistic/getcountry", null, function (data) {
                    console.log(data.data);
                    //          console.log(data.data.result);
                    if (data.status == 200) {
                        var obj = JSON.parse(data.data.result);
                        console.log(obj.countryList);
                        $scope.nation = obj.countryList;
                        $scope.countryDestination = "US";
                    }
                }, function (data) {
                    layer.msg("国家信息获取失败")
                })
            } else {
                if($scope.exportingCountry == '美国'){
                    $scope.cnorusCode = 'US';
                    upcsData.country = "US";
                }else if($scope.exportingCountry == '泰国'){
                    $scope.cnorusCode = 'TH';
                    upcsData.country = "TH";
                }
                
                erp.postFun2("getNewModel2.json", JSON.stringify(upcsData), function (data) {
                    console.log(data);
                    if (data.status == 200) {
                        var obj = data.data;
                        $scope.logistics = obj;
                        $scope.logisticsMode = "";
                    }
                }, function (data) {
                    console.log('获取物流失败')
                })

                var usUpdata = {}
                if($scope.exportingCountry == '美国'){
                    usUpdata.country = "US";
                }else if($scope.exportingCountry == '泰国'){
                    usUpdata.country = "TH";
                }
                erp.postFun("app/logistic/getCountryByAll", JSON.stringify(usUpdata), function (data) {
                    console.log(data.data);
                    if (data.status == 200) {
                        var obj = JSON.parse(data.data.result);
                        console.log(obj.countryList);
                        $scope.nation = obj.countryList;
                        if($scope.exportingCountry == '美国'){
                            $scope.countryDestination = "US";
                        }else if($scope.exportingCountry == '泰国'){
                            $scope.countryDestination = "TH";
                        }
                    }
                }, function (data) {
                    layer.msg("国家信息获取失败")
                })
            }
        }
        //获取目的国家
        erp.postFun("app/logistic/getcountry", null, function (data) {
            console.log(data.data);
            //      	console.log(data.data.result);
            if (data.status == 200) {
                var obj = JSON.parse(data.data.result);
                console.log(obj.countryList);
                $scope.nation = obj.countryList;
                $scope.countryDestination = "US";
            }
        }, function (data) {
            layer.msg("国家信息获取失败")
        })
        $scope.countryDestination1 = function () {
            console.log($scope.countryDestination);
        }
        //获取属性的东西
        var chactBoc = ['COMMON'];
        $scope.getPropertyInfo = function (ev) {
            var checked = $(ev.target).prop('checked');
            if (checked == true) {
                chactBoc.push($(ev.target).val());
            }
            if (checked == false) {
                for (var i = 0; i < chactBoc.length; i++) {
                    if (chactBoc[i] == $(ev.target).val()) {
                        chactBoc.splice(i, 1)
                    }
                }
            }
        }
        //点击计算
        $scope.countBtn = function () {
            var chactBocloda = chactBoc.join(",");
            console.log(chactBoc)
            console.log(chactBocloda)
            if (!(chactBoc.length == 0) && $scope.weightNum) {
                if ($scope.pLength || $scope.pWidth || $scope.pHeight) {
                    $scope.countResult = [];
                    if (!$scope.pLength || $scope.pLength <= 0) {
                        layer.msg('请输入长度')
                        return;
                    }
                    if (!$scope.pWidth || $scope.pWidth <= 0) {
                        layer.msg('请输入宽度')
                        return;
                    }
                    if (!$scope.pHeight || $scope.pHeight <= 0) {
                        layer.msg('请输入高度')
                        return;
                    }
                    erp.postFun2("lc/erplogistics/getFreight", {
                        "country": $scope.countryDestination,
                        "weight": $scope.weightNum,
                        "enName": $scope.logisticsMode,
                        "character": chactBocloda,
                        "area": $scope.cnorusCode,
                        "length": $scope.pLength,
                        "width": $scope.pWidth,
                        "height": $scope.pHeight
                    }, function (data) {
                        console.log(data);
                        if (data.status == 200) {
                            if (data.data.length == 1 && data.data[0].code == '401') {
                                //该国家无法到达或者货物受限
                                $scope.countResult = []
                                layer.msg("该国家无法到达或货物受限");
                            } else {
                                if ($scope.exportingCountry == '美国'||$scope.exportingCountry == '泰国') {
                                    $scope.countResult = data.data;
                                } else if ($scope.exportingCountry == '中国') {
                                    for (var i = 0, len = data.data.length; i < len; i++) {
                                        if (data.data[i].logisticName == 'USPS+') {
                                            data.data.splice(i, 1)
                                            break
                                        }
                                    }
                                    $scope.countResult = data.data;
                                    console.log($scope.countResult)
                                }
                            }
                        }
                    }, function (data) {
                        layer.msg("计算失败");
                    })
                } else {
                    erp.postFun2("lc/erplogistics/getFreight", {
                        "country": $scope.countryDestination,
                        "weight": $scope.weightNum,
                        "enName": $scope.logisticsMode,
                        "character": chactBocloda,
                        "area": $scope.cnorusCode
                    }, function (data) {
                        console.log(data);
                        if (data.status == 200) {
                            if (data.data.length == 1 && data.data[0].code == '401') {
                                //该国家无法到达或者货物受限
                                $scope.countResult = []
                                layer.msg("该国家无法到达或货物受限");
                            } else {
                                if ($scope.exportingCountry == '美国'||$scope.exportingCountry == '泰国') {
                                    $scope.countResult = data.data;
                                } else if ($scope.exportingCountry == '中国') {
                                    for (var i = 0, len = data.data.length; i < len; i++) {
                                        if (data.data[i].logisticName == 'USPS+') {
                                            data.data.splice(i, 1)
                                            break
                                        }
                                    }
                                    $scope.countResult = data.data;
                                }
                                $.each($scope.countResult, function (i, v) {
                                    var logisticName = v.logisticName;
                                    //    console.log(logisticName);
                                    var price = v.price;
                                    var cnprice = v.cnprice;
                                    $.each($scope.discountList, function (a, b) {
                                        if (b.nameen == logisticName) {
                                            if (b.discount != '100') {
                                                var discount = parseFloat(b.discount) / 100;
                                                v.discount = (price / discount).toFixed(2);
                                                v.cndiscount = (cnprice / discount).toFixed(2);
                                            }
                                        }
                                    });

                                });
                                var newArr = [];
                                $.each($scope.countResult, function (i, v) {
                                    //    var logisticName = v.logisticName;
                                    if (v.logisticName != 'ePacket') {
                                        newArr.push(v);
                                        //    $scope.countResult.splice(i,1);
                                    } else {
                                        var data1 = $.extend(true, {}, v);
                                        var data2 = $.extend(true, {}, v);
                                        var data3 = $.extend(true, {}, v);
                                        data1.logisticName = "深圳 ePacket";
                                        data1.discount = (data1.price * 0.98).toFixed(2);
                                        data1.cndiscount = (data1.cnprice * 0.98).toFixed(2);
                                        data2.logisticName = "义乌 ePacket";
                                        data2.discount = (data2.price * 0.88).toFixed(2);
                                        data2.cndiscount = (data2.cnprice * 0.88).toFixed(2);
                                        data3.logisticName = "北京 ePacket";
                                        data3.discount = (data3.price * 0.91).toFixed(2);
                                        data3.cndiscount = (data3.cnprice * 0.91).toFixed(2);
                                        newArr.push(data1);
                                        newArr.push(data2);
                                        newArr.push(data3);
                                    }

                                })
                                console.log(newArr);
                                $scope.countResult = newArr;
                                // console.log($scope.countResult);

                            }
                        }
                    }, function (data) {
                        layer.msg("计算失败");
                    })
                }

            } else if (!$scope.weightNum && chactBoc.length == 0) {
                //请填写重量和选择属性
                layer.msg("请填写重量或者选择属性");
            } else if (!$scope.weightNum) {
                //请填写重量
                layer.msg("请填写重量");
            } else if (chactBoc.length == 0) {
                //请选择属性
                layer.msg("请选择属性");
            }

        }
        //默认展示
        $scope.usps = false;
        $scope.zgyz = false;
        $scope.yyb = true;
        $scope.aa = function () {
            $(".wllDh-logili").eq(0).addClass("activewll");
        }
    }])
    
     //erp物流财务
     app.controller('finance', ['$scope', 'erp', function ($scope, erp) {
        console.log('finance')
        //导出
		$scope.isdcflag = false;
		$scope.dcflag = false;
		$scope.dcMuOrd = function () {

            var dcData = {};
            var printIds = [];
            $('.c-th .c-chekbox').each(function () {
                if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					printIds.push($(this).siblings('.hide-order-id').text())
                }
            })
            dcData.ids = printIds
			console.log("数组2",dcData.ids)
			if(printIds.length > 0) {
				erp.postFun('erp/logisticsFinancial/export', JSON.stringify(dcData), ({data}) => {
					const { statusCode, result } = data
					layer.msg(statusCode === '200' ? '导出成功' : '导出失败')
					statusCode === '200' && window.open(result)
				}, error => {
					layer.msg('网络错误')
				}, { layer: true })
			} else {
				layer.msg('请选择导出数据')
			}      
        }

        //给母订单里面的所有单个订单添加选中非选中状态
		var cmuIndex = 0;
		$('.ea-erp-cs').on('click','.c-chekbox',function () {
			if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
				$(this).attr('src','static/image/order-img/multiple2.png');
                cmuIndex++;
				if (cmuIndex == $('.ea-erp-cs .c-chekbox').length) {
					$('.ea-erp-cs .c-allchekbox').attr('src','static/image/order-img/multiple2.png');
				}
			} else {
				$(this).attr('src','static/image/order-img/multiple1.png');
                cmuIndex--;
				if (cmuIndex != $('.ea-erp-cs .c-chekbox').length) {
					$('.ea-erp-cs .c-allchekbox').attr('src','static/image/order-img/multiple1.png');
				}
			}
		})
		//全选
		$('.ea-erp-cs').on('click','.c-allchekbox',function () {
			if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
				$(this).attr('src','static/image/order-img/multiple2.png');
				cmuIndex = $('.ea-erp-cs .c-chekbox').length;
				$('.ea-erp-cs .c-chekbox').attr('src','static/image/order-img/multiple2.png');
			} else {
				$(this).attr('src','static/image/order-img/multiple1.png');
				cmuIndex = 0;
				$('.ea-erp-cs .c-chekbox').attr('src','static/image/order-img/multiple1.png');
			}
		})
        
        $scope.showtime = false
        // 导入excel
        $scope.upLoadExcel = function (files) {
            console.log(files)
            var file = $("#upLoadInp").val();
            var index = file.lastIndexOf(".");
            console.log(file)
            var ext = file.substring(index + 1, file.length);
            console.log(ext)
            if (ext != "xlsx" && ext != "xls") {
                layer.msg('请上传excel')
                return;
            }
            erp.load()
            var formData = new FormData();
            formData.append('file', $("#upLoadInp")[0].files[0]);
            formData.append('type',2)
            console.log(formData);
            erp.upLoadImgPost('erp/logisticsFinancial/upExcelFinancial', formData , function (data) {
                console.log(data)
                layer.closeAll('loading')
                $("#upLoadInp").val('')
                $scope.importCgdFlag = false;
                if(data.data.noTrackNumbers != "" ){
                    layer.msg("不存在这些标题："+data.data.noTrackNumbers)
                }else if (data.data.statusCode == 200) {
                    layer.msg('上传成功')
                    $scope.showtime = true
                    $scope.pageNum = '1';
                    getListFun()
                } else if(data.data.statusCode == 505){
                    $scope.importExErrFlag = true;
                    let mesStr = JSON.parse(data.data.message)
                    for(let key in mesStr){
                        mesStr[key] = JSON.parse(mesStr[key])
                    }
                    $scope.mesErrObj = mesStr;
                } else (
                    layer.msg(data.data.message)
                )
            }, function (data) {
                console.log(data)
                layer.closeAll('loading')
            })
        }
        //查询
        $scope.timeList = function (){
            if($scope.cjTracknumber){
                getList()
            }else{
                layer.msg("请输入运单号")
            }
        }
        $scope.timeListes = function (){
           getList()
        }


        //修改列表显示
        $scope.changePriFlag = false

        $scope.editlist = function (item){
            console.log(item);
            
            $scope.id = item.id
            $scope.amount = item.amount
            $scope.status = item.status+'';
            $scope.changePriFlag = true
        }

        //修改
        $scope.updataes = function (){
            let updata = {}
            updata.status = $scope.status
            updata.amount = $scope.amount
            updata.id = $scope.id
            erp.postFun('erp/logisticsFinancial/update', JSON.stringify(updata), function (data) {
                console.log(data)
                if (data.data.statusCode == '200') {
                    $scope.changePriFlag = false
                    getList()
                }else{
                    layer.msg(n.data.message)
                }

            })
        }

       //分页相关
       $scope.pagesize = '20';
       $scope.pagenum = '1';
       // $scope.pagenumarr = [100, 200, 300, 500];
       $scope.totalNum = 0;
       $scope.codeList = [];

       function getList() {
           var upData = {};
           upData.offset = $scope.pagenum + '';
           upData.count = $scope.pagesize;//每页数量
           if($scope.cjTracknumber){
               upData.cjTracknumber = $scope.cjTracknumber;
           }else{
            upData.startDate = $('#b-time').val();
            upData.endDate = $('#e-time').val();
            upData.logisticsName = $scope.logisticsName;
            upData.cjLogisticsSubWeight = $scope.cjLogisticsSubWeight;
           }
           erp.postFun('erp/logisticsFinancial/list', JSON.stringify(upData), function (data) {
               erp.closeLoad();
               console.log(data)
               if (data.data.statusCode == '200') {
                   $scope.returnList = data.data.result.list;
                   console.log("list",$scope.returnList)
                   $scope.totalNum = data.data.result.total;
                   pageFun();
               } else {
                   layer.msg(n.data.message)
               }
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
       $scope.researchFun = function () {
           $scope.pagenum = '1';
           getList();
       }
       //分页
       $scope.pagechange = function (pagesize) {
           console.log(pagesize)
           $scope.pagenum = '1';
           getList();
       }
       //跳页
       $scope.pagenumchange = function () {
           var pagenum = Number($scope.pagenum)
           var totalpage = Math.ceil($scope.totalNum / $scope.pagesize);
           if (pagenum > totalpage) {
               layer.msg('错误页码')
               $scope.pagenum = 1;
           } else {
               getList();
           }
       }
    }])

    app.controller('forwardingCtrl', ['$scope', 'erp', '$timeout', function ($scope, erp, $timeout) {
        console.log('forwardingCtrl')
        $scope.isoverTR = true;
        $scope.names = [];
        $scope.selectedName = '';
        $scope.account = '';
        //分页相关
        $scope.countrySearch = '';
        $scope.selectedName = '';
        $scope.tkCodeSearch = '';
        $scope.weightSearch = '';
        $scope.searchinfo = '';
        $scope.pagesize = '100';
        $scope.pagenum = '1';
        $scope.pagenumarr = [100, 200, 300, 500];
        $scope.totalNum = 0;
        //运费金额弹窗
        $scope.isAddShipping = false;
        $scope.trankingNum = '';
        $scope.shippingMoney = '';
        (function () {
            erp.postFun('app/erplogistics/getLogisticByNotNullList', { "data": "{}" }, function (res) {
                if (res.data.code == 200) {
                    $scope.names = res.data.list;
                }
            }, function (res) {

            })
            erp.postFun('app/logistic/getcountry', '{}', function (data) {
                console.log(data)
                var result = JSON.parse(data.data.result);
                $scope.countryList = result.countryList;
            }, function (data) {
                console.log(data)
            })
            erp.getFun('app/erplogistics/getSalesmans', function (n) {
                if (n.data.statusCode == 200) {
                    $scope.customList = n.data.result;
                    console.log($scope.customList)
                }
            }, function (n) {

            })
        })();
        $('.sea-wltype-btn').eq(0).addClass('sea-wltype-act')
        $scope.type = 'PACKET';

        function getList() {
            erp.load();
            var data = {
                page: $scope.pagenum.toString(),
                pageNum: $scope.pagesize,
                'account': $scope.selectedName,
                'type': $scope.type,
                'countrySearch': $scope.countrySearch,
                'tkCodeSearch': $scope.tkCodeSearch,
                'weightSearch': $scope.weightSearch,
                'moneySearch': $scope.moneySearch,
                'startDate': $('#startDate').val(),
                'endDate': $('#endDate').val() || 'Now',
                'salesmanName': $scope.serSalesmanName,
                'logisticsType': $scope.wlfsName,
                'freightName': $scope.freightGs
            }
            $scope.stafflist = [];
            erp.postFun('app/erplogistics/getFreightAllList', data, function (n) {
                erp.closeLoad();
                if (n.data.code == 200) {
                    $scope.stafflist = n.data.list;
                    $scope.totalNum = n.data.totalNum;
                    if ($scope.type == 'EXPRESS') {
                        $scope.stafflist = n.data.list;
                        $scope.stafflist.forEach(function (o, i) {
                            o.isEdit = false;
                        })
                    }
                    pageFun();
                } else {
                    $scope.stafflist = [];
                    $scope.totalNum = 0;
                }
            }, function (n) {
                erp.closeLoad();
            })
        }
        getList();
        //根据原单号查询信息
        $scope.enterSearch = function (e, val, flag, item) {
            console.log(val)
            if (e.keyCode == 13) {
                if (!val) {
                    layer.msg('请输入原单号')
                    return;
                }
                if (flag == 'add') {
                    $scope.salesmanName = '';
                    $scope.freightName = '';
                    $scope.logisticsType = '';
                    $scope.stateCode = '';
                    $scope.trackingNumCode = '';
                    $scope.freightWeight = '';
                    $scope.freightMoney = '';
                    $scope.billIdByChange = '';
                    $scope.actualWeight = null;
                    $scope.length = null;
                    $scope.width = null;
                    $scope.height = null;
                    $scope.throwingWeight = '';
                    var data = {
                        billIdByOriginal: val
                    };
                    erp.load();
                    erp.postFun('app/erplogistics/getFreightPart', data, function (res) {
                        erp.closeLoad();
                        if (res.data.statusCode == 200) {
                            //$scope.createDate = '';
                            $scope.salesmanName = res.data.result.salesmanName;
                            $scope.freightName = res.data.result.freightName;
                            $scope.logisticsType = res.data.result.logisticsType;
                            $scope.stateCode = res.data.result.stateCode;
                            $scope.trackingNumCode = res.data.result.trackingNumCode;
                            $scope.freightWeight = res.data.result.freightWeight;
                            $scope.freightMoney = res.data.result.freightMoney;
                            $scope.billIdByChange = res.data.result.billIdByChange;
                            $scope.throwingWeight = res.data.result.throwingWeight;
                        } else {
                            layer.msg('信息查询失败')
                        }
                    }, function (n) {
                        erp.closeLoad();
                    })
                } else {
                    item.freightName = '';
                    item.logisticsType = '';
                    item.stateCode = '';
                    item.trackingNumCode = '';
                    item.freightWeight = '';
                    item.freightMoney = '';
                    item.billIdByChange = '';
                    item.actualWeight = null;
                    item.length = null;
                    item.width = null;
                    item.height = null;
                    item.throwingWeight = '';
                    var data = {
                        billIdByOriginal: val
                    };
                    erp.load();
                    erp.postFun('app/erplogistics/getFreightPart', data, function (res) {
                        erp.closeLoad();
                        if (res.data.statusCode == 200) {
                            //$scope.createDate = '';
                            item.freightName = res.data.result.freightName;
                            item.logisticsType = res.data.result.logisticsType;
                            item.stateCode = res.data.result.stateCode;
                            item.trackingNumCode = res.data.result.trackingNumCode;
                            item.freightWeight = res.data.result.freightWeight;
                            item.freightMoney = res.data.result.freightMoney;
                            item.billIdByChange = res.data.result.billIdByChange;
                            item.throwingWeight = res.data.result.throwingWeight;
                        } else {
                            layer.msg('信息查询失败')
                        }
                    }, function (n) {
                        erp.closeLoad();
                    })
                }
            }
        };
        //快捷键操作
        $scope.keyFun = function (e, flag) {
            if (e.keyCode == 13) {
                $scope.addCon()
            } else if (e.keyCode == 187 || e.keyCode == 107) {
                e.preventDefault();
                $scope.next();
            } else if (e.keyCode == 9 && flag == 'tab') {
                $timeout(function () {
                    document.getElementById('zdinput1').focus();
                }, 0)
            }
        };
        $scope.itemkeyFun = function (e, item, flag, idx) {
            if (e.keyCode == 13) {
                $scope.editCon(item)
            } else if (e.keyCode == 9 && flag == 'tab') {
                $timeout(function () {
                    document.getElementsByClassName('zdinput2')[idx].focus();
                }, 0)
            }
        }
        //计算重量
        $scope.Calculation = function (flag, item) {
            if (flag == 'add') {
                console.log($scope.width)
                console.log($scope.length)
                console.log($scope.height)
                if ($scope.width && $scope.length && $scope.height) {
                    if ($scope.logisticsType == 'CJPacket' || $scope.logisticsType == 'S.F China Domestic' || $scope.logisticsType == 'CJ Normal Express') {
                        $scope.throwingWeight = (($scope.width * $scope.length * $scope.height) / 7000).toFixed(2);
                    } else {
                        $scope.throwingWeight = (($scope.width * $scope.length * $scope.height) / 5000).toFixed(2);
                    }
                    console.log($scope.throwingWeight)
                } else {
                    $scope.throwingWeight = '';
                }
            } else {
                if (item.width && item.length && item.height) {
                    if (item.logisticsType == 'CJPacket' || item.logisticsType == 'S.F China Domestic' || item.logisticsType == 'CJ Normal Express') {
                        item.throwingWeight = ((item.width * item.length * item.height) / 7000).toFixed(2);
                    } else {
                        item.throwingWeight = ((item.width * item.length * item.height) / 5000).toFixed(2);
                    }
                    console.log(item.throwingWeight)
                } else {
                    item.throwingWeight = '';
                }
            }
        }
        $scope.wlTypeXbFun = function (ev) {
            $('.sea-wltype-btn').removeClass('sea-wltype-act')
            $(ev.target).addClass('sea-wltype-act')
            $scope.type = 'PACKET';
            $scope.pagenum = '1';
            $scope.isAdd = false;
            $scope.isEdit = false;
            $scope.countrySearch = '';
            $scope.selectedName = '';
            $scope.tkCodeSearch = '';
            $scope.weightSearch = '';
            $scope.serSalesmanName = '';
            $('#startDate').val('');
            $('#endDate').val('');
            getList()
        }
        $scope.wlTypeKdFun = function (ev) {
            $('.sea-wltype-btn').removeClass('sea-wltype-act')
            $(ev.target).addClass('sea-wltype-act')
            $scope.type = 'EXPRESS';
            $scope.pagenum = '1';
            $scope.isAdd = false;
            $scope.isEdit = false;
            $scope.countrySearch = '';
            $scope.selectedName = '';
            $scope.tkCodeSearch = '';
            $scope.weightSearch = '';
            $scope.serSalesmanName = '';
            $('#startDate').val('');
            $('#endDate').val('');
            getList()
        }
        $scope.countryChange = function () {
            if ($scope.isAdd) {
                layer.msg('数据录入中，请完成录入后再进行其他操作');
                return
            }
            if ($scope.isEdit) {
                layer.msg('请先完成数据修改');
                return
            }
            $scope.pagenum = '1';
            getList()
        }
        $scope.filterWlFun = function () {
            console.log($scope.wlfsName)
            $scope.filterArr = [];
            let len = $scope.hdWlfsArr.length;
            for (let i = 0; i < len; i++) {
                if ($scope.hdWlfsArr[i].indexOf($scope.wlfsName) != -1) {
                    $scope.filterArr.push($scope.hdWlfsArr[i])
                }
            }
        }
        $scope.wlNameSeaFun = function (wlName) {
            $scope.wlfsName = wlName;
            $scope.filterArr = [];
            $scope.pagenum = '1';
            getList()
        }
        $scope.freightFun = function () {
            $scope.pagenum = '1';
            getList()
        }
        $scope.serChange = function () {
            console.log($scope.selectedName)
            if ($scope.isAdd) {
                layer.msg('数据录入中，请完成录入后再进行其他操作');
                return
            }
            if ($scope.isEdit) {
                layer.msg('请先完成数据修改');
                return
            }
            $scope.pagenum = '1';
            getList()
        }
        //搜索
        $scope.searchstaff = function () {
            if ($scope.isAdd) {
                layer.msg('数据录入中，请完成录入后再进行其他操作');
                return
            }
            if ($scope.isEdit) {
                layer.msg('请先完成数据修改');
                return
            }
            $scope.pagenum = '1';
            getList()
        }

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

        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            $scope.pagenum = 1;
            getList();
        }
        $scope.pagenumchange = function () {
            var pagenum = Number($scope.pagenum)
            var totalpage = Math.ceil($scope.totalNum / $scope.pagesize);
            if (pagenum > totalpage || !pagenum || pagenum < 1) {
                layer.msg('错误页码')
                $scope.pagenum = 1;
            } else {
                getList();
            }
        }
        //点击行数加样式
        $scope.TrClick = function (i) {
            $scope.focus = i;
        }
        //Excel导出
        $scope.excelUp = function () {
            if ($scope.isAdd) {
                layer.msg('数据录入中，请完成录入后再进行其他操作');
                return
            }
            if ($scope.isEdit) {
                layer.msg('请先完成数据修改');
                return
            }
            var startDate = $('#startDate').val();
            var endDate = $('#endDate').val() || 'Now';
            var base64 = new Base64();
            var token = base64.decode(localStorage.getItem('erptoken') == undefined ? "" : localStorage.getItem('erptoken'));
            var countryName = $scope.countryName ? $scope.countryName : '';
            var account = $scope.account ? $scope.account : '';
            var salesmanName = $scope.serSalesmanName ? $scope.serSalesmanName : "";

            //var url = 'http://192.168.5.176:8080/dsp_server_war/app/erplogistics/downExpressDelivery?countrySearch=' + countryName + '&account=' + account + '&startDate=' + startDate + '&endDate=' + endDate + '&tkCodeSearch=' + $scope.tkCodeSearch + '&weightSearch=' + $scope.weightSearch + '&page=' + $scope.pagenum.toString() + '&pageNum=' + $scope.pagesize.toString() + '&token=' + token + '&salesmanName=' + salesmanName;
            var url = 'https://erp.cjdropshipping.com/app/erplogistics/downExpressDelivery?countrySearch=' + countryName + '&account=' + account + '&startDate=' + startDate + '&endDate=' + endDate + '&tkCodeSearch=' + $scope.tkCodeSearch + '&weightSearch=' + $scope.weightSearch + '&page=' + $scope.pagenum.toString() + '&pageNum=' + $scope.pagesize.toString() + '&token=' + token + '&salesmanName=' + salesmanName;
            console.log(url)
            window.location.href = url;
            return
            erp.load();
            erp.getFun(url, function (res) {
                erp.closeLoad();
                console.log(res)
            }, function (n) {
                erp.closeLoad();
            })

        };
        //录入
        $scope.addClick = function () {
            if ($scope.isEdit) {
                layer.msg('请先完成数据修改');
                return
            }
            if ($scope.isAdd) {
                layer.msg('数据录入中，请完成录入后再进行其他操作');
                return
            }
            $('#zdWeight').val('')
            $scope.isAdd = true;
            $scope.createDate = '--';
            $scope.freightName = '';
            $scope.logisticsType = '';
            $scope.stateCode = '';
            $scope.trackingNumCode = '';
            $scope.freightWeight = '';
            $scope.freightMoney = '';
            $scope.billIdByChange = '';
            $scope.billIdByOriginal = '';
            $scope.actualWeight = null;
            $scope.length = null;
            $scope.width = null;
            $scope.height = null;
            $scope.throwingWeight = '';

            $timeout(function () {
                document.getElementById('zdinput1').focus();
            }, 200)
            // 自动获取重量
            var clearInterval = setInterval(function () {
                $.get('http://localhost:3000/').then(res => {
                    var data = JSON.parse(res);
                    // 重量--千克
                    var kg = data[0].kg.toFixed(3);
                    $('#zdWeight').val(kg);
                    $scope.actualWeight = kg;
                })
            }, 333)
            $scope.clearInterval = clearInterval;
        };
        // 清除实时获取重量
        $scope.isVaildFocus = function () {
            clearTimeout($scope.clearInterval);
        }
        // 继续
        $scope.next = function () {
            if (addCheck()) {
                var data = {
                    //freightName: $scope.freightName,
                    //logisticsType: $scope.logisticsType,
                    //stateCode: $scope.stateCode,
                    //trackingNumCode: $scope.trackingNumCode,
                    //freightWeight: $scope.freightWeight,
                    //freightMoney: $scope.freightMoney,
                    //billIdByChange: $scope.billIdByChange,
                    billIdByOriginal: $scope.billIdByOriginal,
                    actualWeight: $scope.actualWeight ? $scope.actualWeight.toString() : '',
                    length: $scope.length ? $scope.length.toString() : '',
                    width: $scope.width ? $scope.width.toString() : '',
                    height: $scope.height ? $scope.height.toString() : '',
                    //throwingWeight: $scope.throwingWeight ? $scope.throwingWeight.toString() : '',
                    type: $scope.type,
                }
                erp.load();
                erp.postFun('app/erplogistics/saveFreight', data, function (res) {
                    erp.closeLoad();
                    if (res.data.statusCode == 200 || res.data.statusCode == 408) {
                        if (res.data.statusCode == 200) {
                            layer.msg('操作成功');
                        }
                        if (res.data.statusCode == 408) {
                            layer.msg('重量异常');
                        }
                        $scope.isAdd = true;
                        $scope.createDate = '--';
                        $scope.freightName = '';
                        $scope.logisticsType = '';
                        $scope.stateCode = '';
                        $scope.trackingNumCode = '';
                        $scope.freightWeight = '';
                        $scope.freightMoney = '';
                        $scope.billIdByChange = '';
                        $scope.billIdByOriginal = '';
                        $scope.actualWeight = null;
                        $scope.length = null;
                        $scope.width = null;
                        $scope.height = null;
                        $scope.throwingWeight = '';
                        $timeout(function () {
                            document.getElementById('zdinput1').focus();
                        }, 200)
                        getList();
                    } else if (res.data.statusCode == 509) {
                        layer.msg(res.data.message)
                    } else if (res.data.statusCode == 1002) {
                        layer.msg(res.data.message)
                        $scope.isAdd = true;
                        $scope.createDate = '--';
                        $scope.freightName = '';
                        $scope.logisticsType = '';
                        $scope.stateCode = '';
                        $scope.trackingNumCode = '';
                        $scope.freightWeight = '';
                        $scope.freightMoney = '';
                        $scope.billIdByChange = '';
                        $scope.billIdByOriginal = '';
                        $scope.actualWeight = null;
                        $scope.length = null;
                        $scope.width = null;
                        $scope.height = null;
                        $scope.throwingWeight = '';
                        $timeout(function () {
                            document.getElementById('zdinput1').focus();
                        }, 200)
                        getList();
                    } else {
                        layer.msg('操作失败')
                    }
                }, function (n) {
                    erp.closeLoad();
                })
            }
        }
        // 完成
        $scope.addCon = function () {
            if (addCheck()) {
                var data = {
                    //freightName: $scope.freightName,
                    //logisticsType: $scope.logisticsType,
                    //stateCode: $scope.stateCode,
                    //trackingNumCode: $scope.trackingNumCode,
                    //freightWeight: $scope.freightWeight,
                    //freightMoney: $scope.freightMoney,
                    //billIdByChange: $scope.billIdByChange,
                    billIdByOriginal: $scope.billIdByOriginal,
                    actualWeight: $scope.actualWeight ? $scope.actualWeight.toString() : '',
                    length: $scope.length ? $scope.length.toString() : '',
                    width: $scope.width ? $scope.width.toString() : '',
                    height: $scope.height ? $scope.height.toString() : '',
                    //throwingWeight: $scope.throwingWeight ? $scope.throwingWeight.toString() : '',
                    type: $scope.type,
                }
                erp.load();
                erp.postFun('app/erplogistics/saveFreight', data, function (res) {
                    erp.closeLoad();
                    clearTimeout($scope.clearInterval)
                    if (res.data.statusCode == 200 || res.data.statusCode == 408) {
                        if (res.data.statusCode == 200) {
                            layer.msg('操作成功');
                        }
                        if (res.data.statusCode == 408) {
                            layer.msg('重量异常');
                        }
                        getList();
                        $scope.isAdd = false;
                    } else if (res.data.statusCode == 509) {
                        layer.msg(res.data.message)
                    } else if (res.data.statusCode == 1002) {
                        layer.msg(res.data.message)
                        $scope.isAdd = false;
                        getList();
                    } else {
                        layer.msg('操作失败')
                    }
                }, function (n) {
                    erp.closeLoad();
                })
            }
        }
        // 取消
        $scope.isCancel = function () {
            $scope.isAdd = false
            clearTimeout($scope.clearInterval)
        }
        //编辑完成
        $scope.editCon = function (item) {
            console.log(item)
            if (editCheck(item)) {
                var data = {
                    id: item.id,
                    actualWeight: item.actualWeight ? item.actualWeight.toString() : '',
                    length: item.length ? item.length.toString() : '',
                    width: item.width ? item.width.toString() : '',
                    height: item.height ? item.height.toString() : '',
                    throwingWeight: item.throwingWeight ? item.throwingWeight.toString() : '',
                    trackingNumCode: item.trackingNumCode,
                    billIdByChange: item.billIdByChange,
                    freightName: item.freightName
                };
                erp.load();
                erp.postFun('app/erplogistics/updateFreight', data, function (res) {
                    erp.closeLoad();
                    if (res.data.code == 200) {
                        layer.msg('操作成功')
                        getList();
                        item.isEdit = false;
                        $scope.isEdit = false;
                    } else {
                        layer.msg('操作失败')
                    }
                }, function (n) {
                    erp.closeLoad();
                })
            }
        }
        $scope.editItem = function (item, idx) {
            if ($scope.isAdd) {
                layer.msg('数据录入中，请完成录入后再进行其他操作');
                return
            }
            if ($scope.isEdit) {
                layer.msg('请先完成数据修改');
                return
            }
            $scope.stafflist.forEach(function (o, i) {
                o.isEdit = false;
            })
            item.isEdit = true;
            $scope.isEdit = true;
            $timeout(function () {
                document.getElementsByClassName('zdinput2')[idx].focus();
            }, 200)
        }
        $scope.editCancel = function (item) {
            item.isEdit = false;
            $scope.isEdit = false;
        }
        $scope.remove = function (item) {
            if ($scope.isAdd) {
                layer.msg('数据录入中，请完成录入后再进行其他操作');
                return
            }
            if ($scope.isEdit) {
                layer.msg('请先完成数据修改');
                return
            }
            layer.confirm('是否删除？', {
                title: '操作提示',
                icon: 3,
                btn: ['取消', '确定'] //按钮
            }, function (ca) {
                layer.close(ca);
            }, function (index) {
                var data = {
                    id: item.id,
                };
                erp.load();
                erp.postFun('app/erplogistics/deleteDelivery', data, function (res) {
                    erp.closeLoad();
                    if (res.data.statusCode == 200) {
                        layer.msg('操作成功')
                        layer.close(index);
                        getList();
                    } else if (res.data.statusCode == 509) {
                        layer.msg(res.data.message)
                    } else {
                        layer.msg('操作失败')
                    }
                }, function (n) {
                    erp.closeLoad();
                })
            });

        }

        //新增运费金额弹窗
        $scope.shippingamount = function(){
           $scope.isAddShipping = true
        }
        //运费金额确定
        $scope.addShippingConfirm = function () { 
            if(!$scope.trankingNum){
                layer.msg('追踪号不能为空')
            }else if(!$scope.shippingMoney){
                layer.msg('运费金额不能为空')
            }else{
                $scope.isAddShipping = false;
            }
            
        }

        // $scope.trankingNum = '';
        // $scope.shippingMoney = '';
        

        //新增校验
        function addCheck() {
            if (!$scope.billIdByOriginal) {
                layer.msg('原单号必填')
                return false;
            }
            if (!$scope.actualWeight) {
                layer.msg('实际重量必填')
                return false;
            }
            if ($scope.length) {
                if (!$scope.width) {
                    layer.msg('请输入宽')
                    return false;
                }
                if (!$scope.height) {
                    layer.msg('请输入高')
                    return false;
                }
            }
            if ($scope.width) {
                if (!$scope.length) {
                    layer.msg('请输入长')
                    return false;
                }
                if (!$scope.height) {
                    layer.msg('请输入高')
                    return false;
                }
            }
            if ($scope.height) {
                if (!$scope.length) {
                    layer.msg('请输入长')
                    return false;
                }
                if (!$scope.width) {
                    layer.msg('请输入宽')
                    return false;
                }
            }
            return true;
        }

        //编辑校验
        function editCheck(item) {
            if (!item.billIdByOriginal) {
                layer.msg('原单号必填')
                return false;
            }
            if (!item.actualWeight) {
                layer.msg('实际重量必填')
                return false;
            }
            if (item.length) {
                if (!item.width) {
                    layer.msg('请输入宽')
                    return false;
                }
                if (!item.height) {
                    layer.msg('请输入高')
                    return false;
                }
            }
            if (item.width) {
                if (!item.length) {
                    layer.msg('请输入长')
                    return false;
                }
                if (!item.height) {
                    layer.msg('请输入高')
                    return false;
                }
            }
            if (item.height) {
                if (!item.length) {
                    layer.msg('请输入长')
                    return false;
                }
                if (!item.width) {
                    layer.msg('请输入宽')
                    return false;
                }
            }
            return true;
        }

        $scope.hdWlfsArr = [
            'B邮宝挂号'
            , 'China EMS'
            , 'China Post Registered Air Mail'
            , 'CJ Normal Express'
            , 'CJPacket'
            , 'DHL'
            , 'DHL eCommerce'
            , 'DHL HongKong'
            , 'DHL Official'
            , 'EMS'
            , 'ePacket'
            , 'EUB'
            , 'E邮宝2'
            , 'E邮宝2-（杂）'
            , 'FBA'
            , 'Grand Slam'
            , 'HK挂号'
            , 'Jewel Shipping'
            , 'Jewel Shipping Flat'
            , 'Jewel Shipping+'
            , 'K邮宝'
            , 'K邮宝(特货)'
            , 'K邮宝（敏感货）'
            , 'S.F China Domestic'
            , 'UEB'
            , 'USPS'
            , 'USPS+'
            , '上海易邮宝'
            , '上海易邮宝-SJ'
            , '上海易邮宝XC'
            , '上海线下小包-挂'
            , '东莞E邮宝'
            , '东莞E邮宝A'
            , '中巴专线'
            , '中美专线(特惠)'
            , '中美专线(特惠)(USZXR)'
            , '中邮wish线上北京仓平邮'
            , '中邮wish线上北京仓挂号'
            , '中邮上海挂号小包'
            , '中邮上海线下E邮宝'
            , '中邮北京平邮小包'
            , '中邮北京挂号小包'
            , '中邮速卖通线上北京仓平邮'
            , '丹麦'
            , '义乌E邮宝'
            , '义乌UPS红单'
            , '义乌小包-新'
            , '义乌小包新'
            , '义乌易邮宝-TD'
            , '云途全球专线挂号（特惠带电）'
            , '云途全球专线挂号（特惠带电）(THZXR)'
            , '云途全球专线挂号（特惠普货）'
            , '云途全球专线挂号（特惠普货）(THPHR)'
            , '佛山挂号'
            , '佳成南京EUB'
            , '加拿大'
            , '北京EUB化妆品'
            , '北京E邮宝'
            , '南京EUB'
            , '南京E邮宝'
            , '南京易邮宝'
            , '南京联邦小包'
            , '南非专线'
            , '国际(地区)E邮宝物品经济时限'
            , '国际电商-专线'
            , '国际电商专递-标准'
            , '土耳其邮政平邮小包(含电)'
            , '壹电商物流'
            , '奥地利'
            , '奥地利专线'
            , '官方DHL'
            , '官方EUB'
            , '宝来空派'
            , '巴林DHL（发）'
            , '巴西'
            , '广州EUB'
            , '广州E特快'
            , '广州E邮宝'
            , '德国'
            , '德国专线挂号特惠'
            , '意大利'
            , '挪威'
            , '新加坡'
            , '新西兰'
            , '易邮通PG'
            , '未分类物流'
            , '杭州易邮宝'
            , '欧电宝PG'
            , '欧邮宝A'
            , '欧邮宝DS'
            , '比利时'
            , '法国'
            , '法国专线挂号特惠'
            , '深圳E邮宝'
            , '深圳E邮宝特惠'
            , '深圳官方EUB'
            , '深圳挂号'
            , '澳大利亚'
            , '澳洲专线'
            , '燕文专线追踪小包-普货'
            , '燕文专线追踪小包-特货'
            , '燕邮宝平邮-特货'
            , '爱尔兰'
            , '瑞典'
            , '瑞典专线挂号'
            , '瑞士'
            , '纯电宝PG'
            , '美国'
            , '美国ups直发'
            , '美国usps直发'
            , '美国专线'
            , '美国直发'
            , '美国直发usp'
            , '芬兰'
            , '英国'
            , '英国专线挂号特惠'
            , '荷比卢专线'
            , '莆田E邮宝'
            , '莆田E邮宝-海运'
            , '葡萄牙'
            , '西班牙'
            , '西班牙专线'
            , '通达宝PG'
            , '通邮宝PG'
            , '郑州-易邮宝'
            , '郑州易邮宝'
            , '重庆EUB'
            , '阿拉伯联合酋长国'
            , '韩国专线'
            , '顺丰'
            , '顺丰国际电商专递'
            , '顺丰标快'
            , '顺丰特惠-(发)'
            , '顺丰特惠-T'
            , '顺友通挂号'
            , '顺邮宝PLUS挂号'
            , '顺邮宝挂号'
            , '香港ups红单'
            , '香港ups红单带电'
            , '马电宝PG'
        ];
        $scope.hdNameArr = [
            '促特美国专线',
            '宝来',
            '4PX递四方',
            'CJ FULFILLMENT',
            'DHL官方',
            'EMS',
            '一典',
            '义乌',
            '义乌4PX递四方',
            '义乌邮局',
            '乌拉圭',
            '云途',
            '佳成',
            '佳成南京EUB',
            '佳成物流',
            '促成',
            '促特',
            '促特USPS美国专线',
            '促特美国专线',
            '促特饰品专线',
            '南京',
            '南风',
            '壹电商',
            '壹电商物流',
            '壹电物流',
            '官方顺丰',
            '官方顺丰·',
            '宝来',
            '宝莱',
            '深圳',
            '深圳4PX递四方',
            '深圳壹电商',
            '深圳壹电商',
            '深圳官方EUB',
            '燕文',
            '燕文专线',
            '莆田',
            '货代名称',
            '顺友'
        ];
        $scope.filterArr = [];

    }]).directive('stringToNumber', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function (value) {
                    if (value)
                        return '' + value;
                });
                ngModel.$formatters.push(function (value) {
                    return parseInt(value);
                });
            }
        };
    });
    //货代 待匹配
    app.controller('dpphdCtrl', ['$scope', 'erp', '$http', '$routeParams', function ($scope, erp, $http, $routeParams) {
        var bs = new Base64();
        var token = bs.decode(localStorage.getItem('erptoken') == undefined ? "" : localStorage.getItem('erptoken'));
        var loginSpace = localStorage.getItem('space');
        var wlLocStore = localStorage.getItem('wlLocStore') || '';
        var erpLoginName = bs.decode(localStorage.getItem('erploginName') == undefined ? '' : localStorage.getItem('erploginName'));
        console.log(wlLocStore)
        if (wlLocStore) {
            $scope.cliStore = wlLocStore;
            $scope.selStore = wlLocStore;
            // if (wlLocStore === '4') {
            //     $('.two-ck-btn').eq(wlLocStore - 1).addClass('two-ck-activebtn');
            // } else {
            //     $('.two-ck-btn').eq(wlLocStore - 0).addClass('two-ck-activebtn');
            // }
            
        } else {
            if (loginSpace) {
                if (loginSpace == '深圳') {
                    $scope.selStore = '1';
                    $scope.cliStore = '1';
                } else if (loginSpace == '美国') {
                    $scope.selStore = '2';
                    $scope.cliStore = '2';
                    $('.two-ck-btn').eq(2).addClass('two-ck-activebtn');
                } else {
                    $scope.selStore = '0';
                    $scope.cliStore = '0';
                    $('.two-ck-btn').eq(0).addClass('two-ck-activebtn');
                }
            } else {
                $scope.selStore = '0';
                $scope.cliStore = '0';
                $('.two-ck-btn').eq(0).addClass('two-ck-activebtn');
            }
        }
        $scope.pagesize = '100';
        $scope.pagenum = '1';
        $scope.pagenumarr = [100, 200, 300, 500];
        $scope.totalNum = 0;
        $scope.dppStu = +$routeParams.dppTtpe || 0;
        $scope.days = '';
        $scope.type = 'query';
        $scope.isExp = false;
        $scope.ExpURl = '';
        $scope.packageUser = '';
        $scope.weight = '';

        // 获取仓库
        // $scope.storages = erp
        //     .getStorage()
        //     .map(_ => ({ id: _.dataId, storageName: _.dataName }));

        var dbr = $routeParams.dbrname;
        if (dbr == '' || dbr == null || dbr == undefined) {
            $scope.packageUser = '';
        } else {
            $scope.packageUser = dbr;
            $('#dblName').val(dbr)
        }
        $scope.cancelDzcFun = function(){
            $scope.isDzcFlag = false;
            $scope.pphdFlag = true;
            $scope.dzcCzFlag = false;
        }
        $scope.sureDzcFun = function(){
            $scope.isDzcFlag = false;
            $scope.pphdFlag = true;
            $scope.dzcCzFlag = true;
        }
        // 实时获取重量
        $scope.isGetWeight = function () {
            if ($scope.dbrName&&$scope.dzcCzFlag) {
                var timer = setInterval(function () {
                    $.get('http://localhost:3000/').then(res => {
                        var data = JSON.parse(res);
                        // 重量--克
                        var g = parseInt(data[1].g);
                        $('#incur-inp-Weight').val(g);
                        $scope.inpValWeight = g;
                    },err=>{
                        clearInterval(timer)
                        clearTimeout($scope.clearInterval)
                        $scope.tipDzcFlag = true;
                        $('.audio-dazsb').get(0).play();
                        $scope.$apply()
                    })
                }, 333);
                $scope.clearInterval = timer
            }
        }
        $scope.freshFun = function(){
            location.reload()
        }
        function getList() {
            layer.load(2)
            if ($scope.selHdName) {
                $scope.account = $scope.selHdName.companyName;
            } else {
                $scope.account = '';
            }
            var csData = {};
            var urlVal;
            csData.pageNum = $scope.pagenum + '';
            csData.pageSize = $scope.pagesize;
            csData.data = {};
            csData.data.account = $scope.account;
            csData.data.trackcode = $scope.trackCode;
            csData.data.days = $scope.days-0;
            csData.data.type = $scope.type;
            csData.data.packageUser = $scope.packageUser;
            csData.data.weight = $scope.weight;
            csData.data.beginDate = $('#left-time').val();
            csData.data.endDate = $('#right-time').val();
            if ($scope.dppStu == 0 || $scope.dppStu == 1) {
                csData.data.freightStatus = $scope.dppStu == 0 ? '201' : '200';
                csData.data.store = $scope.cliStore;
                urlVal = 'processOrder/faHuo/getFreightBySystemNotDataList';
            } else if ($scope.dppStu == 2 || $scope.dppStu == 3) {
                csData.data.freightStatus = $scope.dppStu == 2 ? '201' : '200';
                urlVal = 'processOrder/faHuo/getFreightNotDataList';
            } else if ($scope.dppStu == 4) {
                csData.data.freightStatus = '300';
                urlVal = 'processOrder/faHuo/getFreightBySystemNotDataList';
            }
            erp.postFun(urlVal, JSON.stringify(csData), function (data) {
                console.log(data)
                layer.closeAll('loading')
                let resData = data.data.data;
                if ($scope.type == 'query') {
                    if (data.data.code == '200') {
                        $scope.totalNum = resData.total;
                        $scope.stafflist = resData.list;
                        $scope.stafflist.forEach(function (o, i) {
                            o.isAct = false;
                        });
                        pageFun();
                    } else {
                        $scope.stafflist = [];
                        $scope.totalNum = 0;
                    }
                } else if ($scope.type == 'exp') {
                    if (data.data.code == '200') {
                        $scope.ExpURlList = resData.list;
                    } else {
                        layer.msg('导出失败')
                    }
                }

            }, function (data) {
                console.log(data)
                layer.closeAll('loading')
            })
        }

        // getList();
        $scope.storageCallback = function({item}){
            if(!!item) $scope.cliStore = item.dataId
            getList()
        }

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

        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            $scope.pagenum = '1';
            getList();
        }
        $scope.pagenumchange = function () {
            if ($scope.pagenum == "" || $scope.pagenum == null || $scope.pagenum == undefined) {
                layer.msg("错误页码");
                return;
            }
            if ($scope.pagenum == 0) {
                $scope.pagenum = 1;
            }
            var pagenum = Number($scope.pagenum)
            var totalpage = Math.ceil($scope.totalNum / $scope.pagesize);
            if (pagenum > totalpage) {
                layer.msg('错误页码')
                $scope.pagenum = 1;
            } else {
                getList();
            }
        }
        $scope.hdNameSeaFun = function () {
            $scope.pagenum = '1';
            getList();
        }
        $scope.selfun = function (type) {
            $scope.dppStu = type;
            $scope.type = 'query';
            $scope.pagenum = '1';
            // $('.dpp-stu').removeClass('dpp-stuactive');
            // $('.dpp-stu').eq(type).addClass('dpp-stuactive');
            getList();
        }
        //全选
        $scope.allChecked = function () {
            $scope.isAllAct = !$scope.isAllAct;
            if ($scope.isAllAct) {
                $scope.stafflist.forEach(function (o, i) {
                    o.isAct = true;
                });
            } else {
                $scope.stafflist.forEach(function (o, i) {
                    o.isAct = false;
                });
            }
        }
        //单选
        $scope.cldChecked = function (item) {
            item.isAct = !item.isAct;
            $scope.stafflist.some(function (o, i) {
                if (!o.isAct) {
                    $scope.isAllAct = false;
                    return true;
                } else {
                    $scope.isAllAct = true;
                }
            });
        }
        //批量生成清单
        $scope.batchList = function () {
            var arr = []
            $scope.stafflist.forEach(function (o, i) {
                if (o.isAct) {
                    arr.push(o.trackingNumCode)
                }
            });
            if (arr.length == 0) {
                layer.msg("请先选择")
                return;
            }
            console.log(arr.join(','));
            erp.load();
            erp.postFun("erp/dhlxb/getAndSaveManifest", { trackNumbers: arr.join(',') }, function (res) {
                erp.closeLoad();
                if (res.data.statusCode == 200) {
                    layer.msg('操作成功');
                    getList();
                } else {
                    layer.msg('操作失败')
                }
            }, function (err) {
                erp.closeLoad();
            });
        };
        //按时间查询
        $scope.timeStuFun = function (ev, type) {
            $scope.type = 'query';
            $('#left-time').val('');
            $('#right-time').val('');
            // $('.drk-time').removeClass('active');
            // $(ev.target).addClass('active');
            $scope.days = type;
            $scope.pagenum = '1';
            getList();
        }
        $('.seach-inp').keypress(function (e) {
            if (e.which == 13) {
                $scope.pagenum = '1';
                $scope.inpSeaFun()
            }
        });
        $scope.inpSeaFun = function () {
            $scope.pagenum = '1';
            $scope.days = '';
            $scope.type = 'query';
            // $('.drk-time').removeClass('active');
            getList();
        }
        // $('.dpp-stu').eq(0).addClass('dpp-stuactive');
        // $('.drk-time').eq(0).addClass('active');
        $scope.inputNumber = function (type) {
            if (type == 'weight') {
                $scope.weight = $scope.weight.replace(/[^\d]/g, '');
                if ($scope.weight == 0) {
                    $scope.weight = '';
                }
            } else if (type == 'pagenum') {
                $scope.pagenum = $scope.pagenum.replace(/[^\d]/g, '');
                if ($scope.pagenum == 0) {
                    $scope.pagenum = 1;
                }
            }
        }
        //导出
        $scope.Export = function () {
            $scope.isExp = true;
            $scope.type = 'exp';
            getList();
        }
        $scope.closeExp = function () {
            $scope.isExp = false;
            $scope.type = 'query';
        }
        //删除
        $scope.delWppFun = function (item, index) {
            if (erpLoginName != 'admin' && erpLoginName != '周鹏' && erpLoginName != '周林') {
                layer.msg('只有管理员才能修改')
                return
            }
            layer.load(2);
            if ($scope.dppStu == 0 || $scope.dppStu == 1) {
                var deUrl = 'processOrder/faHuo/dellOutRecord'
            } else {
                var deUrl = 'processOrder/faHuo/dellExcelOutRecord'
            }
            erp.postFun(deUrl, {
                'id': item.id
            }, function (data) {
                console.log(data)
                layer.closeAll('loading')
                if (data.data.code == 200) {
                    layer.msg('删除成功')
                    $scope.stafflist.splice(index, 1)
                    $scope.totalNum--;
                } else {
                    layer.msg('删除失败')
                }
            }, function (data) {
                console.log(data)
                layer.closeAll('loading')
            })
        }
        erp.postFun('processOrder/faHuo/getLogisticByNotNullList', { "data": "{}" }, function (res) {
            console.log(res)
            if (res.data.code == 200) {
                $scope.names = res.data.data;
                $scope.names.push({
                    companyName: "线下打单",
                    account: "xianxia"
                }, {
                    companyName: "深圳官方E邮宝",
                    account: "深圳官方E邮宝"
                }, {
                    companyName: "义乌官方E邮宝",
                    account: "义乌官方E邮宝"
                })
            }
        }, function (res) {

        })
        // var localArrLen = 0;
        // if (localStorage.getItem('local')) {
        //     var arr = JSON.parse(localStorage.getItem('local'));
        //     localArrLen = arr.length;
        // } else {
        //     var arr = [];
        // }
        $scope.list = [];
        $('#incur-inp').keyup(function (e) {
            console.log(e.which)
            if (e.which == 13) {
                console.log($scope.inpVal)
                $scope.setLocalFun($scope.inpVal)
            }
        });

        //义乌 深圳 美国
        $scope.storeFun = function (ev, type) {
            if ($(ev.target).hasClass('two-ck-activebtn')) {
                $(ev.target).removeClass('two-ck-activebtn');
                $scope.cliStore = '';
                localStorage.removeItem('wlLocStore')
            } else {
                $('.two-ck-btn').removeClass('two-ck-activebtn')
                $(ev.target).addClass('two-ck-activebtn');
                $scope.cliStore = type;
                localStorage.setItem('wlLocStore', type)
            }
            console.log($scope.cliStore)
            $scope.selStore = type;
            $scope.pagenum = '1';
            getList();
        }
        $scope.indexNum = 1;
        var jcRepeatJson = {};
        $scope.setLocalFun = function (val) {
            if (val) {
                // console.log($scope.selectedName)
                // if(!$scope.selectedName){
                //     layer.msg('请选择货代')
                //     return;
                // }
                if ($scope.inpVal.indexOf('DB') != -1 && $scope.inpVal.length == 6) {
                    if ($scope.dbrName) {
                        if ($scope.dbrName != $scope.inpVal) {
                            $('.audio-hrcg').get(0).play();
                        }
                    } else {
                        $('.audio-lrmzcg').get(0).play();
                    }
                    $scope.dbrName = $scope.inpVal;
                    console.log($scope.dbrName)
                    $scope.inpVal = '';
                    $scope.$apply()
                    return
                }
                if (!$scope.dbrName || $scope.dbrName.indexOf('DB') == -1 || $scope.dbrName.length != 6) {
                    $('.audio-dabaoren').get(0).play();
                    $scope.inpVal = '';
                    $scope.$apply()
                    return
                }
                // if($scope.list.length>0&&$scope.list[$scope.list.length-1].trackNum==$scope.inpVal){
                //  layer.msg('跟上一次录入相同')
                //  $scope.inpVal = '';
                //  $scope.$apply()
                //  return
                // }
                if ($scope.inpVal.length < 10) {
                    layer.msg('该追踪号长度少于十位请确定是否有问题!', { time: 3000 })
                    $scope.inpVal = '';
                    $scope.$apply()
                    $('.audio-shibai').get(0).play();
                    return
                }
                // if($scope.inpVal.indexOf('LO')==0&&$scope.inpVal.indexOf('CN')!=-1){
                //     let code = $scope.inpVal;
                //     code = code.substring(3)
                //     code = code.substring(0,code.length-2)
                //     if(code-58500022>=0&&code-59500029<=0){
                //         $scope.lanjieFlag = true;
                //         $scope.inpVal = '';
                //         $scope.$apply()
                //         $('.audio-cn-wtdputdaz').get(0).play();
                //         return
                //     }
                // }
                if ($scope.inpVal.indexOf('JJD') == 0) {
                    $scope.inpVal = $scope.inpVal.substring(1)
                    console.log($scope.inpVal)
                }
                // if ($scope.inpVal.length > 30) {
                //     $scope.inpVal = $scope.inpVal.substring(0, 30)
                //     console.log($scope.inpVal)
                // }
                console.log(jcRepeatJson[$scope.inpVal])
                if ($scope.selStore == '2') {
                    if (jcRepeatJson[$scope.inpVal]) {
                        console.log('美国重复')
                        $('.audio-en-cf').get(0).play();
                        $scope.inpVal = '';
                        $scope.$apply()
                        return
                    }
                } else {
                    if (jcRepeatJson[$scope.inpVal]) {
                        console.log('中国重复')
                        $('.audio-dom').get(0).play();
                        $scope.inpVal = '';
                        $scope.$apply()
                        return
                    }
                }

                jcRepeatJson[$scope.inpVal] = '1';
                console.log(jcRepeatJson)
                if ($scope.inpVal) {
                    console.log($scope.inpVal)
                    $scope.list.push({
                        index: $scope.indexNum,
                        trackNum: $scope.inpVal,
                        weight: $scope.inpValWeight,
                        hdName: '',
                        lanZi: '',
                        flag: false
                    })
                    $scope.indexNum++;
                }

                console.log($scope.indexNum)
                // console.log($scope.list)
                // layer.load(2)
                var codeData = {};
                // codeData.freightName = $scope.selectedName.account;
                codeData.trackingNumCode = $scope.inpVal;
                codeData.store = $scope.selStore;
                codeData.packageUser = $scope.dbrName;
                codeData.weight = $scope.inpValWeight;
                codeData.sdweight = $scope.bgWeight;
                console.log(codeData)
                if ($scope.inpVal.length == 30) {
                    codeData.type = 'usps+';
                }
                $scope.inpVal = '';
                erp.postFun('processOrder/faHuo/addOutRecord', JSON.stringify(codeData), function (data) {
                    layer.closeAll('loading');
                    console.log($scope.list)
                    let resData = data.data.data;
                    console.log(resData)
                    if (resData.exception) {
                        layer.msg('重量异常')
                    } else if (resData.result > 0) {
                        layer.msg('提交成功')
                        // $('.audio-succ').get(0).play();
                        var huoDaiName = resData.huodai;
                        var len = $scope.list.length;
                        var sucCount = 0;
                        for (var i = 0; i < len; i++) {
                            if (!$scope.list[i].flag) {
                                sucCount++
                            }
                            if (resData.trackingNumCode == $scope.list[i].trackNum) {
                                $scope.list[i].hdName = huoDaiName || '没有货代';
                                if (huoDaiName == '义乌官方E邮宝') {
                                    $scope.list[i].lanZi = 1;
                                } else if (huoDaiName == '深圳壹电商') {
                                    $scope.list[i].lanZi = 2;
                                } else if (huoDaiName == '深圳壹电商深圳E邮宝') {
                                    $scope.list[i].lanZi = 3;
                                } else if (huoDaiName == '宝来邮政小包挂号') {
                                    $scope.list[i].lanZi = 4;
                                } else if (huoDaiName == '顺友') {
                                    $scope.list[i].lanZi = 5;
                                } else if (huoDaiName == '燕文' || huoDaiName == 'yanwen') {
                                    $scope.list[i].lanZi = 6;
                                } else if (huoDaiName == 'shunfeng' || huoDaiName == '顺丰国际官方') {
                                    $scope.list[i].lanZi = 7;
                                } else if (huoDaiName == '佳成南京E邮宝') {
                                    $scope.list[i].lanZi = 8;
                                } else if (huoDaiName == '启昊南京E邮宝') {
                                    $scope.list[i].lanZi = 9;
                                } else if (huoDaiName == '深圳官方E邮宝') {
                                    $scope.list[i].lanZi = 3;
                                }
                                // else if(huoDaiName=='Shipstation#美东'){

                                // }
                                // $scope.list.splice(i,1)
                            }
                        }
                        if (sucCount > 3) {
                            for (var i = 0; i < len; i++) {
                                if (!$scope.list[i].flag) {
                                    $scope.list.splice(i, 1)
                                    break
                                }
                            }
                        }
                        $scope.inpVal = '';
                        if (huoDaiName == '义乌官方E邮宝') {
                            $('.audio-hd1').get(0).play();
                        } else if (huoDaiName == '深圳壹电商') {
                            $('.audio-hd2').get(0).play();
                        } else if (huoDaiName == '深圳壹电商深圳E邮宝') {
                            $('.audio-hd3').get(0).play();
                        } else if (huoDaiName == '宝来邮政小包挂号') {
                            $('.audio-hd4').get(0).play();
                        } else if (huoDaiName == '顺友') {
                            $('.audio-hd5').get(0).play();
                        } else if (huoDaiName == '燕文' || huoDaiName == 'yanwen') {
                            $('.audio-hd6').get(0).play();
                        } else if (huoDaiName == 'shunfeng' || huoDaiName == '顺丰国际官方') {
                            $('.audio-hd7').get(0).play();
                        } else if (huoDaiName == '佳成南京E邮宝') {
                            $('.audio-hd8').get(0).play();
                        } else if (huoDaiName == '启昊南京E邮宝') {
                            $('.audio-hd9').get(0).play();
                        } else if (!huoDaiName) {
                            $('.audio-myhd').get(0).play();
                        } else if (huoDaiName == '深圳官方E邮宝') {
                            $('.audio-hd3').get(0).play();
                        } else if (huoDaiName == 'Shipstation#美东') {
                            $('.audio-meiDong').get(0).play()
                        } else if (huoDaiName == 'Shipstation#美西') {
                            $('.audio-meiXi').get(0).play()
                        } else {
                            // $('.audio-ckhd').get(0).play();
                            if (huoDaiName == '促特' || huoDaiName == '促特USPS美国专线' || huoDaiName == 'Shipstation') {
                                // layer.msg('usps')
                                if ($scope.selStore == '2') {//签收usps
                                    $('.audio-en-cg').get(0).play();
                                } else {//出库usps
                                    $('.audio-ckhd').get(0).play();
                                }
                            } else {
                                $('.audio-ckhd').get(0).play();
                                console.log('查看货代')
                            }
                        }

                        if (resData.orderRepeat && resData.orderRepeat > 0) {
                            $('.audio-ord-cf').get(0).play();
                            layer.msg('订单重复')
                            var len = $scope.list.length;
                            for (var i = 0; i < len; i++) {
                                if (resData.trackingNumCode == $scope.list[i].trackNum) {
                                    $scope.list[i].flag = true;
                                    $scope.list[i].desc = '追踪号不重复,订单号重复!';
                                }
                            }
                        }
                    }
                    else if (resData.result == 0) {
                        layer.msg('运单号重复')
                        $('.audio-dom').get(0).play();
                        var len = $scope.list.length;
                        for (var i = 0; i < len; i++) {
                            if (resData.trackingNumCode == $scope.list[i].trackNum) {
                                $scope.list[i].flag = true;
                                $scope.list[i].date = resData.date;
                            }
                        }
                    }
                    else if(resData.result == '此面单已修改，请更新追踪号后打印'){
                        speckText('请更新追踪号后打印')
                        $scope.updateTrackFlag = true;
                    }
                    else if(resData.result == '该订单的运单号已经失效，请联系打单组重新打单'){
                        speckText('失效单,请更新追踪号')
                        $scope.shiXiaoTrackFlag = true;
                    }
                    else if(resData.result == '此面单已修改地址，请重新打印面单'){
                        speckText('请重新打印面单')
                        $scope.cxdyFlag = true;
                        $scope.cxdyResId = resData.orderId
                        $('#incur-inp').blur();
                    }
                    else if (resData.result == '过期面单') {
                        layer.msg('过期面单,请重新换单')
                        $('.audio-gqmd').get(0).play();
                        var len = $scope.list.length;
                        for (var i = 0; i < len; i++) {
                            if (resData.trackingNumCode == $scope.list[i].trackNum) {
                                $scope.list[i].flag = true;
                                $scope.list[i].desc = resData.message;
                            }
                        }
                    }
                    else if (resData.result == '这个包裹的货代错误.请查证后重新录入') {
                        layer.msg('这个包裹的货代错误.请查证后重新录入')
                        $('.audio-hdcw').get(0).play();
                        var len = $scope.list.length;
                        for (var i = 0; i < len; i++) {
                            if (resData.trackingNumCode == $scope.list[i].trackNum) {
                                $scope.list[i].flag = true;
                                $scope.list[i].desc = resData.message;
                            }
                        }
                    }
                    // else if(resData.result=='该追踪号无法查找到订单,可能已经换单,请处理'){
                    //      layer.msg('该追踪号无法查找到订单,可能已经换单,请处理')
                    //      $('.audio-wfcz').get(0).play();
                    //      var len = $scope.list.length;
                    //      for(var i = 0;i<len;i++){
                    //       if(resData.trackingNumCode==$scope.list[i].trackNum){
                    //           $scope.list[i].flag = true;
                    //           $scope.list[i].desc = resData.result;
                    //       }
                    //      }
                    // }
                    else if (resData.result == '该追踪号无法查找到订单,已经换单,请处理') {
                        layer.msg('该追踪号无法查找到订单,已经换单,请处理')
                        $('.audio-wfcz').get(0).play();
                        var len = $scope.list.length;
                        for (var i = 0; i < len; i++) {
                            if (resData.trackingNumCode == $scope.list[i].trackNum) {
                                $scope.list[i].flag = true;
                                $scope.list[i].desc = resData.result;
                            }
                        }
                    }
                    else if (resData.result == '拦截') {
                        if ($scope.selStore == '2') {
                            $('.audio-en-lanjie').get(0).play();
                            var len = $scope.list.length;
                            for (var i = 0; i < len; i++) {
                                if (resData.trackingNumCode == $scope.list[i].trackNum) {
                                    $scope.list[i].flag = true;
                                    $scope.list[i].desc = resData.result;
                                }
                            }
                        } else {
                            $('.audio-lanjie-bfj').get(0).play();
                            var len = $scope.list.length;
                            for (var i = 0; i < len; i++) {
                                if (resData.trackingNumCode == $scope.list[i].trackNum) {
                                    $scope.list[i].flag = true;
                                    $scope.list[i].desc = '拦截,不要发件!';
                                }
                            }
                        }
                        //verificationLanjie(resData.trackingNumCode)
                    }
                    else if (resData.result == '法国不能到地区拦截') {
                        $('.audio-cn-lanjie').get(0).play();
                        var len = $scope.list.length;
                        for (var i = 0; i < len; i++) {
                            if (resData.trackingNumCode == $scope.list[i].trackNum) {
                                $scope.list[i].flag = true;
                                $scope.list[i].desc = resData.result;
                            }
                        }
                    }
                    else if (resData.result == '重复') {
                        $('.audio-en-cf').get(0).play();
                        var len = $scope.list.length;
                        for (var i = 0; i < len; i++) {
                            if (resData.trackingNumCode == $scope.list[i].trackNum) {
                                $scope.list[i].flag = true;
                                $scope.list[i].desc = resData.result;
                            }
                        }
                    }
                    else if (resData.result == '未发货') {
                        $('.audio-en-notfound').get(0).play();
                        var len = $scope.list.length;
                        for (var i = 0; i < len; i++) {
                            if (resData.trackingNumCode == $scope.list[i].trackNum) {
                                $scope.list[i].flag = true;
                                $scope.list[i].desc = resData.result;
                            }
                        }
                    }
                    else {
                        layer.msg('提交失败')
                        var len = $scope.list.length;
                        for (var i = 0; i < len; i++) {
                            if (resData.trackingNumCode == $scope.list[i].trackNum) {
                                $scope.list[i].flag = true;
                                $scope.list[i].date = resData.date;
                            }
                        }
                    }
                    $('#incur-inp').focus()
                }, function (data) {
                    console.log(data,'--------------==============')
                    speckText('服务错误')
                    layer.closeAll('loading')
                })
            }
        }
        //检验是否拦截
        function verificationLanjie(code){
            var param={
                batchNumber:"",
                batchNumberStatus:"",
                trackingNumber:code,
                cjOrder:""
            }
            erp.postFun('processOrder/intercept/verification', param, function(data) { 
                console.log(data)   
                var res=data.data
                if(res.code==200 && res.data.interceptList.length!=0){
                    $scope.cjorder = res.data.interceptList[0].id
                    $scope.interceptStatus=res.data.interceptStatus
                    if(res.data.interceptStatus==0){
                        $scope.lanjieTip =true
                    }else if(res.data.interceptStatus==1){
                        $scope.jiufenOrdFlag=true
                    }
                    // else if(res.data.interceptStatus==2){
                    //     $scope.mdgqPrintFlag=true
                    // }else if(res.data.interceptStatus==3){
                    //     $scope.mdgqFlag=true
                    // }
                }   
            })
        }
        $scope.closeLanjie = function(){
            $scope.lanjieTip = false;
            $scope.jiufenOrdFlag = false
            console.log($scope.cjorder)
            erp.postFun('processOrder/intercept/confirm', {cjOrder:$scope.cjorder}, function (data) {
                console.log(data)
            }, function (data) {
                console.log(data)
            },{layer:true})
        }
        
        $scope.sureCxdyFun = function(){
            getSheet($scope.cxdyResId)
            $scope.focusFun()
        }
        $scope.cancelCxdyFun = function(){
            $scope.cxdyFlag = false;
            $scope.focusFun()
        }
        function PrintCode(url) {
			console.log(url)
			$.ajax({
				url: 'http://127.0.0.1:9999/marking?url=' + url,
				async: true,
				cache: false,
				dataType: 'text',
				error: function (xhr) {
					$scope.downLoadFlag = true;
					$scope.$apply()
					console.log($scope.downLoadFlag)
				},
				success: function (data) {
					$scope.$apply()
				}
			})
        }
        $scope.focusFun = function(){
            $('#incur-inp').focus();
        }
        function getSheet(id) {
            console.log(id)
            erp.load();
			var ids = {};
			ids.ids = id;
			ids.type = '1';
			ids.loginName = erpLoginName;
			ids.uspsType = 0;
            ids.uspsType = 0;
            ids.orderStatusRecordType = '1';
			console.log(JSON.stringify(ids))
            if(id&&id.indexOf('ZF')!=-1){
                ids.orderType='CJPAY';
                erp.zfPostFun('getExpressSheet.json',JSON.stringify(ids),function (data) {
                    console.log(data.data)
                    var resMdArr = data.data;//生成的面单数组
                    layer.closeAll("loading")
                    if (resMdArr.length>0) {
                        PrintCode(resMdArr[0])
                    } else {
                        layer.msg('生成面单错误')
                    }
                },function (data) {
                    console.log(data)
                    layer.closeAll("loading")
                    layer.msg('网络错误')
                })
            }else{
                erp.postFun2('getExpressSheet.json',JSON.stringify(ids),function (data) {
                    console.log(data)
                    layer.closeAll("loading")
                    var resMdArr = data.data;
                    if (resMdArr.length>0) {
                        PrintCode(resMdArr[0])
                    } else if(resMdArr.length===0){
                        erp.postFun3('getExpressSheet.json',JSON.stringify(ids),function (data) {//走美国库
                            console.log(data)
                            layer.closeAll("loading")
                            var resMdArr = data.data;
                            if (resMdArr.length>0) {
                                PrintCode(resMdArr[0])
                            }
                        },function (data) {
                            console.log(data)
                            layer.closeAll("loading")
                            layer.msg('网络错误')
                        })
                    }else {
                        layer.msg('生成面单错误')
                    }
                },function (data) {
                    console.log(data)
                    layer.closeAll("loading")
                    layer.msg('网络错误')
                })
            }
		}
        function speckText(str) {
            var url = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=" + encodeURI(str);
            var n = new Audio(url);
            n.src = url;
            n.play();
        }
        // 关闭录入
        $scope.closeLrFun = function () {
            $scope.pphdFlag = false;
            getList();
            clearTimeout($scope.clearInterval)
        }
        //拦截
        $scope.lanJieFun = function () {
            $scope.lanJieFlag = true;
        }
        $scope.sureLanJieFun = function () {
            console.log($scope.ljTrackVal)
            if (!$scope.ljTrackVal) {
                layer.msg('请输入要拦截的追踪号')
                return
            }
            erp.load()
            erp.postFun('erp/faHuo/lanJieOrder', {
                trackingNumCode: $scope.ljTrackVal
            }, function (data) {
                console.log(data)
                erp.closeLoad()
                if (data.data.result > 0) {
                    layer.msg('添加拦截成功')
                    $scope.lanJieFlag = false;
                    $scope.ljTrackVal = '';
                    getList();
                } else {
                    layer.msg('添加拦截失败')
                }
            }, function (data) {
                erp.closeLoad()
                console.log(data)
            })
        }
        //取消拦截
        $scope.qxLanJieFun = function () {
            $scope.qxLanJieFlag = true;
        }
        $scope.sureQxLanJieFun = function () {
            console.log($scope.qxljTrackVal)
            if (!$scope.qxljTrackVal) {
                layer.msg('请输入要拦截的追踪号')
                return
            }
            erp.load()
            erp.postFun('erp/faHuo/cleanOrder', {
                trackingNumCode: $scope.qxljTrackVal
            }, function (data) {
                console.log(data)
                erp.closeLoad()
                if (data.data.result > 0) {
                    layer.msg('取消拦截成功')
                    $scope.qxLanJieFlag = false;
                    $scope.qxljTrackVal = '';
                    getList();
                } else {
                    layer.msg('取消拦截失败')
                }
            }, function (data) {
                erp.closeLoad()
                console.log(data)
            })
        }
        console.log($('#incur-inp'))
        $('#incur-inp').focus();
        $scope.upLoadImg4 = function (files) {
            if ($scope.uphdSelhdName) {
                console.log(files)
                var file = $("#uploadInp").val();
                var index = file.lastIndexOf(".");
                console.log(file)
                var ext = file.substring(index + 1, file.length);
                console.log(ext)
                if (ext != "xlsx" && ext != "xls") {
                    layer.msg('请上传excel')
                    return;
                }
                layer.load(2)
                $('.subexc-tit').text(file);
                var formData = new FormData($("#upload")[0]);
                console.log(formData);
                var accountName = encodeURI(encodeURI($scope.uphdSelhdName.account))
                erp.upLoadImgPost('processOrder/faHuo/uploadFreightDataByExcel?account=' + accountName, formData, orsFun, dreFun)

                function orsFun(data) {
                    console.log(data)
                    layer.closeAll("loading")
                    if (data.data.code == '200') {
                        layer.msg('上传成功')
                        $scope.uploadHdFlag = false;
                        getList();
                    } else {
                        layer.msg('上传失败')
                    }
                }

                function dreFun() {
                    layer.closeAll("loading")
                }
            } else {
                layer.msg('请选择货代')
                $("#uploadInp").val('')
            }

        }
        $scope.closeUpHdFun = function () {
            $scope.uploadHdFlag = false;
        }
    }]);
    //抽查记录
    app.controller('SpotCheckCtrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('stafftableCtrl')
        $scope.isoverTR = true;
        //分页相关
        $scope.pagesize = '100';
        $scope.pagenum = '1';
        $scope.pagenumarr = [100, 200, 300, 500];
        $scope.totalNum = 0;
        //$scope.samplePassValue = '1';
        //$scope.samplePassSign = 'LESS';
        $scope.dataList = [];
        $scope.list = null;

        function getList() {
            erp.load();
            var data = {
                page: $scope.pagenum + '',
                pageNum: $scope.pagesize,
                'sampleCode': $scope.sersampleCode,
                'sampleUserName': $scope.sersampleUserName
            }
            erp.postFun('app/erplogistics/getSampleRecordByAllList', data, con, err)

            function err(n) {
                erp.closeLoad();
                console.log(n)
            }

            function con(n) {
                erp.closeLoad();
                if (n.data.code == 200) {
                    $scope.totalNum = n.data.totalNum;
                    $scope.stafflist = n.data.list;
                    $scope.stafflist.forEach(function (o, i) {
                        o.dw = false;
                    })
                    pageFun();
                } else {
                    $scope.stafflist = [];
                    $scope.totalNum = 0;
                }
            }
        }

        getList();
        $scope.searchstaff = function () {
            getList()
        }

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

        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            $scope.pagenum = '1';
            getList();
        }
        $scope.pagenumchange = function () {
            var pagenum = Number($scope.pagenum)
            var totalpage = Math.ceil($scope.totalNum / $scope.pagesize);
            if (pagenum > totalpage) {
                layer.msg('错误页码')
                $scope.pagenum = 1;
            } else {
                getList();
            }
        }
        //点击行数加样式
        $scope.TrClick = function (i) {
            $scope.focus = i;
        }
        $scope.addClick = function () {
            $scope.isadd = true;
        }
        $scope.remove = function (item) {
            console.log(item)
            erp.postFun('app/erplogistics/dellSampleInspectionRecord', { id: item.id }, function (res) {
                if (res.data.code == 200) {
                    layer.msg('删除成功');
                    getdtail($scope.list);
                    getList();
                } else {
                    layer.msg('删除失败');
                }
            }, function (res) {

            })
        }
        $scope.define = function () {
            if (!$scope.sampleCode) {
                layer.msg('请输入追踪号！')
            } else if (!$scope.sampleAttrValue) {
                layer.msg('请输入重量！')
            } else {
                var data = {
                    sampleCode: $scope.sampleCode,
                    sampleAttrValue: $scope.sampleAttrValue,
                    samplePassValue: 0,
                    samplePassSign: 'LE',
                    remark: $scope.remark
                }
                erp.postFun('app/erplogistics/addSampleInspectionRecord', data, function (res) {
                    if (res.data.code == 200) {
                        $scope.isadd = false;
                        $scope.sampleCode = '';
                        $scope.sampleAttrValue = '';
                        // $scope.samplePassValue = '';
                        // $scope.samplePassSign = '';
                        $scope.remark = '';
                        getList();
                    } else {
                        layer.msg(res.data.msg)
                    }
                }, function (res) {

                })
            }
        }
        $scope.close = function () {
            $scope.isadd = false;
        }
        $scope.sportClick = function () {
            erp.postFun('app/erplogistics/updateSampleInspection', {}, function (res) {
                if (res.data.code == 200) {
                    layer.msg('抽查成功,3s后更新数据');
                    setTimeout(function () {
                        getList();
                    }, 3000)
                }
            }, function (res) {

            })
        }
        $scope.isfun = function (txt) {
            if (txt == 'EQ') {
                txt = '等于';
            } else if (txt == 'GT') {
                txt = '大于';
            } else if (txt == 'LT') {
                txt = '小于';
            } else if (txt == 'GTE') {
                txt = '大于等于';
            } else if (txt == 'LE') {
                txt = '小于等于';
            } else if (txt == 'LESS') {
                txt = '正负小于';
            }
            return txt;
        }
        $scope.ispass = function (txt) {
            if (txt == 'PASS') {
                txt = '通过';
            } else if (txt == 'NOTPASS') {
                txt = '未通过';
            }
            return txt;
        }

        function getdtail(item) {
            if (item.dw) {
                var data = {
                    createDate: item.createDate,
                    sampleUserName: $scope.sersampleCode,
                    sampleCode: $scope.sersampleCode
                }
                erp.load();
                erp.postFun('app/erplogistics/getSampleRecordByCreateDateList', data, function (res) {
                    erp.closeLoad();
                    if (res.data.code == 200) {
                        item.dataList = res.data.list;
                    } else {
                        layer.msg('查询失败');
                    }
                }, function (res) {
                    erp.closeLoad();
                })
            }
        }

        $scope.downClick = function (item) {
            item.dw = !item.dw;
            $scope.list = item;
            getdtail(item)
        }
        //全选 单选
        var cmuIndex = 0;
        $('#c-mu-ord').on('click', '.c-mu-allchekbox', function () {
            if ($(this).attr('src') == 'static/image/order-img/multiple1.png') {
                $(this).attr('src', 'static/image/order-img/multiple2.png');
                cmuIndex = $('#c-mu-ord .c-mu-chekbox').length;
                $('#c-mu-ord .c-mu-chekbox').attr('src', 'static/image/order-img/multiple2.png');
            } else {
                $(this).attr('src', 'static/image/order-img/multiple1.png');
                cmuIndex = 0;
                $('#c-mu-ord .c-mu-chekbox').attr('src', 'static/image/order-img/multiple1.png');
            }
        })
        $('#c-mu-ord').on('click', '.c-mu-chekbox', function () {
            if ($(this).attr('src') == 'static/image/order-img/multiple1.png') {
                $(this).attr('src', 'static/image/order-img/multiple2.png');
                cmuIndex++;
                if (cmuIndex == $('#c-mu-ord .c-mu-chekbox').length) {
                    $('#c-mu-ord .c-mu-allchekbox').attr('src', 'static/image/order-img/multiple2.png');
                }
            } else {
                $(this).attr('src', 'static/image/order-img/multiple1.png');
                cmuIndex--;
                if (cmuIndex != $('#c-mu-ord .c-mu-chekbox').length) {
                    $('#c-mu-ord .c-mu-allchekbox').attr('src', 'static/image/order-img/multiple1.png');
                }
            }
        })
    }])

    // ---------------------------------------------------------------------------------------- 19-01-09 add
    // 出库记录、出库统计
    app.controller('chuku-statistics', ['$scope', 'erp', function ($scope, erp) {
        let url = '';
        let startInput = null; // 开始
        let endInput = null;

        $scope.goto_page = 1;
        $scope.pagination = [];
        $scope.pages = [];
        $scope.pages_len = 0;
        $scope.page_sizes = [
            { size: 10 },
            { size: 20 },
            { size: 50 }
        ];

        $scope.json_data = {
            page: $scope.goto_page, // 页码
            pageSize: $scope.page_sizes[2].size, // 显示条数
            queryValue: '', // 查询条件
            startTime: '', // 开始时间
            endTime: '' // 结束时间
        };

        $scope.table_data = { outputList: [], totalCount: 0, };
        $scope.typename = "queryName"
        $scope.tag = "出库记录"

        function queryData(url) {
            let data = JSON.parse(JSON.stringify($scope.json_data));

            data.page = data.page.toString();
            data.pageSize = data.pageSize.toString();
            erp.load();
            //console.log($scope.typename)
            data[$scope.typename] = $scope.typevalue 
            erp.postFun(url, data, function (res) {
                var ret = res.data;

                erp.closeLoad();
                if (ret.statusCode == '200') {
                    ret.result.outputList.length || (ret.result.totalCount = 0);
                    $scope.table_data = ret.result;
                } else {
                    layer.msg(ret.msg);
                }
                setPagination();
            }, function (err) {
                console.log(err);
            });
        }

        function setPagination() { // 分页
            let arr2 = []
            start = 0,
                end = 0,
                offset = 2, // 左右各两页
                ellipsis = '...';

            $scope.pages = [];
            for (let x = 0; x < $scope.table_data.totalCount; x += $scope.json_data.pageSize) { // 按 pageSize 切割
                $scope.pages.push(x);
            }

            if ($scope.pages_len = $scope.pages.length) {
                start = Math.min(
                    Math.max($scope.json_data.page - offset - 1, 0),
                    $scope.pages_len - offset * 2 - 1); // 开始位置
                end = start + offset * 2 + 1; // 结束位置
                $scope.json_data.page - offset - 1 > 0 && arr2.unshift(ellipsis); // 前省略号
                for (let i = start; i < end; i++) arr2.push(i + 1); // 页码
                $scope.pages_len - $scope.json_data.page > offset && arr2.push(ellipsis); // 后省略号
                console.log('pagination ->',
                    $scope.pagination = arr2.filter(ele => ele > 0 || ele === ellipsis) // 最终结果 [分页数不足时，start会出现负数现象，暂时用filter修复]
                );
                // console.log($scope.pages_len, $scope.json_data.page, start, end);
            } else {
                $scope.pagination = []; // 没有数据，清空分页
            }
        }

        $scope.sub_nav = [
            {
                tag: '出库记录',
                act: true,
                url: 'storage/output/OutputRecordInfo'
            },
            {
                tag: '出库统计',
                act: false,
                url: 'storage/output/OutputRecordStat'
            }
        ];

        $scope.changeSubMenu = function (item) {
            $scope.sub_nav = $scope.sub_nav.map(ele => {
                if (ele === item) {
                    ele.act = true;
                    $scope.json_data.page = 1;
                    $scope.tag = item.tag
                    queryData(url = ele.url);
                } else {
                    ele.act = false;
                }

                return ele;
            });
        };

        $scope.setTime = function (el, flag, manual) {
            if (manual) {
                $scope.json_data[flag] = el.value; // 手动改日期
            } else {
                WdatePicker({ dateFmt: 'yyyy-MM-dd' });
                $dp.onpicked = function () {
                    if ($dp.el.dataset.flag === 'start') startInput = $dp.el;
                    if ($dp.el.dataset.flag === 'end') endInput = $dp.el;
                    $scope.json_data[flag] = $dp.el.value; // 鼠标选择日期

                    let start = $scope.json_data.startTime.replace(/-/g, '');
                    let end = $scope.json_data.endTime.replace(/-/g, '');

                    if (start > 0 && end > 0 && start > end) {
                        layer.msg('开始时间不能大于结束时间');
                        startInput.value = $scope.json_data.startTime = $scope.json_data.endTime;
                    }
                };
            }
        };

        $scope.setQueryData = function (ev, flag) {
            // console.log(ev.value, flag)
            if (flag === 'start-time') $scope.json_data.startTime = ev.value;
            if (flag === 'end-time') $scope.json_data.endTime = ev.value;
            if (flag === 'query-value') $scope.json_data.queryValue = ev.value;
            if (flag === 'supplier_name') $scope.json_data.supplier_name = ev.value;
        };

        $scope.queryData = function (obj) {
            if (obj && typeof obj === 'object') {
                if (obj.flag === 'set-size' && $scope.table_data.outputList.length === 0) return;
                if (obj.flag === 'set-size') $scope.json_data.page = 1;
                if (obj.flag === 'goto-page') {
                    if ($scope.goto_page == "" || $scope.goto_page == null || $scope.goto_page == undefined) {
                        layer.msg("错误页码");
                        return;
                    }
                    if ($scope.goto_page == 0) {
                        $scope.goto_page = 1;
                    }
                    var totalPage = Math.ceil($scope.table_data.totalCount / $scope.json_data.pageSize);
                    if ($scope.goto_page > totalPage) {
                        layer.msg("错误页码");
                        return;
                    }
                    $scope.json_data.page = $scope.goto_page;
                }
                if (obj.flag === 'change-page' && typeof obj.idx === 'number') $scope.json_data.page = obj.idx;
                if (obj.flag === 'prev-page') $scope.json_data.page = Math.max(--$scope.json_data.page, 1); // start 从 1 开始
                if (obj.flag === 'next-page') $scope.json_data.page = Math.min($scope.pages_len, ++$scope.json_data.page); // end 到数组长度
                if (obj.flag === 'start-page') $scope.json_data.page = 1; // 首页
                if (obj.flag === 'end-page') $scope.json_data.page = $scope.pages_len; // 尾页
                if (obj.flag === 'query-btn') $scope.json_data.page = 1; // 查询按钮
            }
            // if (!$scope.json_data.startTime) return layer.msg('请选择开始时间');

            queryData(url);
        };
        for (let x = 0; x < $scope.sub_nav.length; x++) {
            if ($scope.sub_nav[x].act) {
                queryData(url = $scope.sub_nav[x].url);
            }
        }

    }]);

    function fmtDate(obj) {
        var date = new Date(obj);
        var y = 1900 + date.getYear();
        var M = "0" + (date.getMonth() + 1);
        var d = "0" + date.getDate();
        var h = "0" + date.getHours();
        var m = "0" + date.getMinutes();
        var s = "0" + date.getSeconds();
        return y + "-" + M.substring(M.length - 2, M.length) + "-" + d.substring(d.length - 2, d.length) + ' ' + h.substring(h.length - 2, h.length) + ":" + m.substring(m.length - 2, m.length) + ":" + s.substring(s.length - 2, s.length);
    }

    app.filter('trans_date', function () {
        return function (timestamp) {
            return timestamp ? fmtDate(timestamp) : '';
        }
    });
    // ----------------------------------------------------------------------------------------

    //已妥投退件
    app.controller('ReturnRecordsyttCtrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('已妥投退件')
        $scope.isoverTR = true;
        //分页相关
        $scope.pagesize = '20';
        $scope.pagenum = '1';
        // $scope.pagenumarr = [100, 200, 300, 500];
        $scope.totalNum = 0;
        $scope.codeList = [];

        function getList() {
            var yttUpdata = {};
            yttUpdata.page = $scope.pagenum + '';
            yttUpdata.limit = $scope.pagesize;
            console.log(JSON.stringify(yttUpdata))
            erp.postFun('app/step/returnPackageAccountErpList', JSON.stringify(yttUpdata), function (data) {
                console.log(data)
                if (data.data.statusCode == '200') {
                    var resData = JSON.parse(data.data.result);
                    // console.log(resData)
                    $scope.returnList = resData.list;
                    console.log($scope.returnList)
                    $scope.totalNum = resData.count;
                    pageFun();
                }
            }, errFun)
        }

        function errFun(argument) {
            erp.closeLoad();
            console.log(n)
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

        //搜索
        $('.top-search-inp').keypress(function (e) {
            if (e.which == 13) {
                $scope.researchFun();
            }
        })
        $scope.researchFun = function () {
            // getList();
            //跳到详情去搜索追踪号
            location.href = '#/erplogistics/yttdetailrecord//' + $scope.sersampleCode;
        }
        //分页
        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            $scope.pagenum = '1';
            getList();
        }
        //跳页
        $scope.pagenumchange = function () {
            var pagenum = Number($scope.pagenum)
            var totalpage = Math.ceil($scope.totalNum / $scope.pagesize);
            if (pagenum > totalpage) {
                layer.msg('错误页码')
                $scope.pagenum = 1;
            } else {
                getList();
            }
        }
        //点击客户名 跳转的详情页
        $scope.customFun = function (item) {
            console.log(item)
            var userid;
            // var orderNum = item.returnNumber;
            if (item.userid) {
                userid = item.userid;
            } else {
                userid = -1;
            }
            location.href = '#/erplogistics/yttdetailrecord/' + userid;
        }
        //点击行数加样式
        $scope.TrClick = function (i) {
            $scope.focus = i;
        }


        $scope.resonArr = ["I don't like it", "Wrong color received", "Wrong size received", "Wrong products received", "Defect products received", "Others"]
        //验证邮箱
        $scope.emailFlag = false;
        $scope.emailBlurFun = function () {
            console.log($scope.addEmail)
            if ($scope.addEmail) {
                var isValid = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test($scope.addEmail);
                if (!isValid) {
                    layer.msg('Please enter a correct email address')
                    $scope.emailFlag = false;
                } else {
                    $scope.emailFlag = true;
                }
            } else {
                $scope.emailFlag = false;
            }
        }
        //验证名字
        $scope.addNameFlag = false;
        $scope.nameBlurFun = function () {
            console.log($scope.addCusName)
            if ($scope.addCusName) {
                $scope.addNameFlag = true;
            } else {
                $scope.addNameFlag = false;
            }
        }

        var addupdata = {};//提交的参数
        addupdata.orders = [];//订单的列表
        var addNum = 0;
        var ordObj = {};//展示第一个
        ordObj.addNum = 0;
        ordObj.reason = 'I don\'t like it';
        ordObj.imgs = [];
        addupdata.orders.push(ordObj)
        console.log(addupdata.orders)
        $scope.addList = addupdata.orders;
        $scope.addOrdFun = function () {
            var oneObj = {}
            addNum++;
            oneObj.addNum = addNum;
            oneObj.reason = 'I don\'t like it';
            oneObj.imgs = [];
            addupdata.orders.push(oneObj)
            $scope.addList = addupdata.orders;
            console.log($scope.addList)
            console.log(addupdata.orders)
        }
        $scope.selResonFun = function (index, item) {
            console.log(index)
            console.log(item)
        }
        $scope.reduceOrdFun = function (item, index) {
            // console.log(index)
            // console.log(item)
            // console.log(item.addNum)
            for (var i = 0; i < $scope.addList.length; i++) {
                if ($scope.addList[i].addNum == item.addNum) {
                    $scope.addList.splice(i, 1);
                    break;
                }
            }
            // console.log($scope.addList)
            // console.log(addupdata.orders)
        }
        //失去焦点赋值
        $scope.ordNumBlurFun = function (ev, index) {
            var thisVal = $.trim($(ev.target).val());
            console.log(thisVal)
            $scope.addList[index].ordernumber = thisVal;
            console.log($scope.addList)
        }
        $scope.trackNumBlurFun = function (ev, index) {
            var thisVal = $.trim($(ev.target).val());
            if (thisVal.length > 22) {
                var subResStr = thisVal.substring(thisVal.length - 22);
                if (subResStr.substring(0, 1) == '9') {
                    thisVal = subResStr;
                }
            }
            console.log(thisVal)
            $scope.addList[index].returntrackingumber = thisVal;
            console.log($scope.addList)
        }
        //获取上传图片的index
        var itemIndex = -1;
        $('.addordlist-ul').on('click', '.upimg-inp', function () {
            // alert('567')
            itemIndex = $('.upimg-inp').index(this)
            console.log(itemIndex)
        })
        //上传图片
        // $scope.imgArr=[];
        $scope.upLoadImg4 = function (files) {
            var imgArr = [];
            layer.load(2)
            console.log(files)
            console.log(itemIndex)
            var data = new FormData();
            for (var i = 0; i < files.length; i++) {
                data.append('file', files[i]);
            }
            //以下为向后台提交图片数据
            erp.upLoadImgPost('app/ajax/upload', data, con, err);

            function con(n) {
                // 上传图片的地址
                layer.closeAll('loading');
                console.log(n)
                if (n.data.statusCode == '200') {
                    var obj = JSON.parse(n.data.result);
                    console.log(obj)
                    for (var j = 0; j < obj.length; j++) {
                        $scope.imgArrType = [];
                        var srcList = obj[j].split('.');
                        var fileName = srcList[srcList.length - 1];
                        console.log(fileName)
                        if (fileName == 'png' || fileName == 'jpg' || fileName == 'jpeg') {
                            // imgArr.push('https://'+obj[j]);
                            if (itemIndex >= 0) {
                                $scope.addList[itemIndex].imgs.push('https://' + obj[j]);
                                $('.resshow-imgs').eq(itemIndex).css('width', $scope.addList[itemIndex].imgs.length * 135 + 'px')
                            }
                        }
                    }

                } else {
                    $scope.setStoreLogo = '';
                }
                // console.log(imgArr)
                console.log($scope.addList)
            };

            function err(n) {
                console.log(n)
                layer.closeAll('loading');
            };
        }
        //删除图片
        $scope.deleteImgFun = function (index, pindex) {
            console.log(index)
            console.log(pindex)
            $scope.addList[pindex].imgs.splice(index, 1)
            $('.resshow-imgs').eq(itemIndex).css('width', $scope.addList[itemIndex].imgs.length * 135 + 'px')
            console.log($scope.addList)
        }
        //失败订单
        $scope.errorOrdFlag = false;
        //提交
        $scope.submitOrdFun = function () {

            for (var i = 0; i < $scope.addList.length; i++) {
                if (!$scope.addList[i].returntrackingumber) {
                    console.log(!$scope.addList[i].returntrackingumber)
                    layer.msg('请输入追踪号')
                    return;
                }
            }
            console.log($scope.addList)

            layer.load(2)
            var updataArr = [];//$scope.addList;
            for (var i = 0; i < $scope.addList.length; i++) {
                // $scope.addList[i].imgs = JSON.stringify($scope.addList[i].imgs)
                updataArr[i] = {};
                updataArr[i].imgs = JSON.stringify($scope.addList[i].imgs);
                // updataArr[i].ordernumber = $scope.addList[i].ordernumber;
                // updataArr[i].reason = $scope.addList[i].reason;
                updataArr[i].returntrackingumber = $scope.addList[i].returntrackingumber;
            }
            // return;
            // addupdata.orders = $scope.addList;
            addupdata.orders = updataArr;
            erp.postFun('app/step/returnPackageInfoErp', JSON.stringify(addupdata), function (data) {
                console.log(data)
                layer.closeAll('loading')
                var resObj = JSON.parse(data.data.result)
                console.log(resObj)
                $scope.addJfFlag = false;
                if (resObj.sucess > 0) {
                    if (resObj.error < 1) {
                        layer.msg('添加成功')
                    } else {
                        layer.msg('部分添加成功')
                    }
                    console.log('有成功的订单')
                    $scope.addEmail = '';
                    $scope.addCusName = '';
                    $scope.emailFlag = false;
                    $scope.addNameFlag = false;
                    addupdata = {};
                    addupdata.orders = [];
                    addNum = 0;
                    var sucessObj = {};//展示第一个
                    sucessObj.addNum = 0;
                    // sucessObj.reason = 'I don\'t like it';
                    sucessObj.imgs = [];
                    console.log(sucessObj.imgs)
                    addupdata.orders.push(sucessObj)
                    $scope.addList = addupdata.orders;
                    console.log(addupdata)
                    getList();
                }
                if (resObj.error > 0) {
                    $scope.errorOrdFlag = true;
                    console.log('有错误的订单')
                    $scope.errorArr = resObj.errornumber;
                }
                if (!resObj.sucess) {
                    console.log('服务器错误')
                }
            }, function (data) {
                console.log(data)
                layer.closeAll('loading')
            })
        }
    }])
    //已妥投退件 查看客户详情
    app.controller('ReturnRecordsyttdetailCtrl', ['$scope', 'erp', '$routeParams', function ($scope, erp, $routeParams) {
        console.log('已妥投退件 客户详情')
        $scope.isoverTR = true;
        var userid = $routeParams.userid;
        $scope.searchUserId = $routeParams.userid
        $scope.searchVal = $routeParams.trackNum;
        //分页相关
        $scope.pagesize = '20';
        $scope.pagenum = '1';
        // $scope.pagenumarr = [100, 200, 300, 500];
        $scope.totalNum = 0;
        $scope.codeList = [];

        function getList() {
            var yttUpdata = {};
            yttUpdata.page = $scope.pagenum + '';
            yttUpdata.limit = $scope.pagesize;
            yttUpdata.userid = userid;
            yttUpdata.trackingNumber = $scope.searchVal;
            console.log(JSON.stringify(yttUpdata))
            erp.postFun('app/step/returnPackageErpList', JSON.stringify(yttUpdata), function (data) {
                console.log(data)
                if (data.data.statusCode == '200') {
                    var resData = JSON.parse(data.data.result);
                    // console.log(resData)
                    $scope.returnList = resData.list;
                    console.log($scope.returnList)
                    $scope.totalNum = resData.count;
                    pageFun();
                }
            }, errFun)
        }

        function errFun(argument) {
            erp.closeLoad();
            console.log(n)
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

        //搜索
        $('.top-search-inp').keypress(function (e) {
            if (e.which == 13) {
                $scope.researchFun();
            }
        })
        $scope.researchFun = function () {
            getList();
        }
        //分页
        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            $scope.pagenum = '1';
            getList();
        }
        //跳页
        $scope.pagenumchange = function () {
            var pagenum = Number($scope.pagenum)
            var totalpage = Math.ceil($scope.totalNum / $scope.pagesize);
            if (pagenum > totalpage) {
                layer.msg('错误页码')
                $scope.pagenum = 1;
            } else {
                getList();
            }
        }
        //查看图片详情
        $scope.showitemPicFun = function (item) {
            console.log(item)
            var imgL = item.length;
            console.log(imgL)
            $('.imglist-con').css('width', imgL * 210 + 50 + 'px');
            $scope.itempicArr = item;
            $scope.showimglistFlag = true;
        }
        // $scope.showimglistFun1 = function (item) {
        //     var imgArr = item.imgcj;
        //     console.log(imgArr)
        //     // imgArr = eval("("+imgArr+")")
        //     $('.imglist-con').css('width',imgArr.length*210+50+'px')
        //     $scope.showimglistFlag = true;
        //     console.log(item)
        // }
        // $scope.showimglistFun2 = function (item) {
        //     console.log(item)
        //     var imgArr = item.imgs;
        //     $('.imglist-con').css('width',imgArr.length*210+50+'px')
        //     $scope.showimglistFlag = true;

        // }
        $scope.backHisFun = function () {
            // window.history.back();
            location.href = '#/erplogistics/yttrecord'
        }
        //显示大图
        $('.ea-list-table').on('mouseenter', '.af-sp-smallimg', function () {
            $(this).siblings('.af-hide-bigimg').show();
        })
        $('.ea-list-table').on('mouseenter', '.af-hide-bigimg', function () {
            $(this).show();
        })
        $('.ea-list-table').on('mouseleave', '.af-sp-smallimg', function () {
            $(this).siblings('.af-hide-bigimg').hide();
        })
        $('.ea-list-table').on('mouseleave', '.af-hide-bigimg', function () {
            $(this).hide();
        })
        //上传图片
        $scope.imgArr = [];
        $scope.upLoadImg4 = function (files) {
            var imgArr = [];
            layer.load(2)
            console.log(files)
            var data = new FormData();
            for (var i = 0; i < files.length; i++) {
                data.append('file', files[i]);
            }
            //以下为向后台提交图片数据
            erp.upLoadImgPost('app/ajax/upload', data, con, err);

            function con(n) {
                // 上传图片的地址
                layer.closeAll('loading');
                console.log(n)
                if (n.data.statusCode == '200') {
                    var obj = JSON.parse(n.data.result);
                    console.log(obj)
                    for (var j = 0; j < obj.length; j++) {
                        var srcList = obj[j].split('.');
                        var fileName = srcList[srcList.length - 1];
                        console.log(fileName)
                        if (fileName == 'png' || fileName == 'jpg' || fileName == 'jpeg') {
                            $scope.imgArr.push('https://' + obj[j]);
                        }
                    }

                }
                console.log($scope.imgArr)
                $('.resshow-imgs').css('width', $scope.imgArr.length * 130 + 'px')
            };

            function err(n) {
                console.log(n)
                layer.closeAll('loading');
            };
        }
        //删除图片
        $scope.deleteImgFun = function (index) {
            console.log(index)
            $scope.imgArr.splice(index, 1)
            console.log($scope.imgArr)
            $('.resshow-imgs').css('width', $scope.imgArr.length * 130 + 'px')
        }
        //查看包裹
        $scope.openCheckFun = function (item, index) {
            $scope.checkpacFlag = true;
            $scope.itemId = item.id;
            $scope.checkZzhNum = item.returntrackingumber;
            $scope.documentupload2 = '';
            $scope.itemIndex = index;
            let ocheckup = item.checkup ? JSON.parse(item.checkup) : '';
            if (ocheckup) {
                $scope.checkThCount = ocheckup.count;
                $scope.checkReson = ocheckup.reson;
            }
            $scope.imgArr = item.imgcheckup ? item.imgcheckup : [];
            $('.resshow-imgs').css('width', $scope.imgArr.length * 130 + 'px')
        }
        //包裹异常
        $scope.checkbgycFun = function () {
            console.log($scope.imgArr)
            if (!$scope.checkZzhNum) {
                layer.msg('请输入追踪号')
                return;
            }
            if (!$scope.checkThCount) {
                layer.msg('请输入退货数量')
                return;
            }
            if (!$scope.checkReson) {
                layer.msg('请输入退货原因')
                return;
            }
            $scope.checkpacFlag = false;
            var checkData = {};
            checkData.returntrackingnumber = $scope.checkZzhNum;
            checkData.id = $scope.itemId;
            checkData.type = 1;
            if ($scope.imgArr) {
                checkData.imgcheckup = JSON.stringify($scope.imgArr);
            }
            checkData.checkup = {};
            checkData.checkup.count = $scope.checkThCount;
            checkData.checkup.reson = $scope.checkReson;
            checkData.checkup = JSON.stringify(checkData.checkup)
            console.log(checkData)
            console.log(JSON.stringify(checkData))
            erp.postFun('app/step/returnPackageCheckupErp', JSON.stringify(checkData), function (data) {
                console.log(data)
                if (data.data.statusCode == "200") {
                    layer.msg('查验包裹成功')
                    $scope.returnList[$scope.itemIndex].status = '7';
                    $scope.imgArr = [];
                    $scope.checkThCount = '';
                    $scope.checkReson = '';
                } else {
                    layer.msg('查验包裹失败')
                }
            }, errFun)
        }
        //确认无误
        $scope.checkPacFun = function () {
            console.log($scope.imgArr)
            if (!$scope.checkZzhNum) {
                layer.msg('请输入追踪号')
                return;
            }
            if (!$scope.checkThCount) {
                layer.msg('请输入退货数量')
                return;
            }
            // if(!$scope.checkReson){
            //     layer.msg('请输入退货原因')
            //     return;
            // }
            $scope.checkpacFlag = false;
            var checkData = {};
            checkData.returntrackingnumber = $scope.checkZzhNum;
            checkData.id = $scope.itemId;
            checkData.type = 0;
            if ($scope.imgArr) {
                checkData.imgcheckup = JSON.stringify($scope.imgArr);
            }
            checkData.checkup = {};
            checkData.checkup.count = $scope.checkThCount;
            checkData.checkup.reson = $scope.checkReson;
            checkData.checkup = JSON.stringify(checkData.checkup)
            console.log(checkData)
            console.log(JSON.stringify(checkData))
            erp.postFun('app/step/returnPackageCheckupErp', JSON.stringify(checkData), function (data) {
                console.log(data)
                if (data.data.statusCode == "200") {
                    layer.msg('查验包裹成功')
                    $scope.returnList[$scope.itemIndex].status = '6';
                    $scope.imgArr = [];
                    $scope.checkThCount = '';
                    $scope.checkReson = '';
                    getList();
                } else {
                    layer.msg('查验包裹失败')
                }
            }, errFun)
        }
        //是否确认收货
        $scope.openShtkFun = function (item, index) {
            $scope.isshFlag = true;
            $scope.itemId = item.id;
            $scope.itemIndex = index;
        }
        $scope.sureShFun = function () {
            $scope.isshFlag = false;
            var upcsdata = {};
            upcsdata.id = $scope.itemId;
            upcsdata.type = 0;
            erp.postFun('app/step/returnPackageConfirmErp', JSON.stringify(upcsdata), function (data) {
                console.log(data)
                if (data.data.statusCode == 200) {
                    layer.msg('确认收货成功')
                    // console.log($scope.returnList)
                    getList();
                } else {
                    layer.msg('确认收货失败')
                }
            }, errFun)
        }
        $scope.wshFun = function () {
            $scope.isshFlag = false;
            var upcsdata = {};
            upcsdata.id = $scope.itemId;
            upcsdata.type = 1;
            erp.postFun('app/step/returnPackageConfirmErp', JSON.stringify(upcsdata), function (data) {
                console.log(data)
                if (data.data.statusCode == 200) {
                    layer.msg('未收货成功')
                    // console.log($scope.returnList)
                    getList();
                } else {
                    layer.msg('未收货失败')
                }
            }, errFun)
        }

    }])
    //国内退件
    app.controller('ReturnRecordsgntjCtrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('国内退件')
        $scope.isoverTR = true;
        //查询销售 货代
        erp.postFun('app/returnhome/getInfoName', {}, function (data) {
            console.log(data)
            if (data.data.statusCode == '200') {
                var resList = JSON.parse(data.data.result);
                console.log(resList)
                $scope.saleArr = resList.salesmanName;
                $scope.freightArr = resList.loisticsName;
                console.log($scope.saleArr)
                console.log($scope.freightArr)
            } else {
                console.log(data.data.message)
            }
        }, function (data) {
            console.log(data)
        })
        //分页相关
        $scope.pagesize = '20';
        $scope.pagenum = '1';
        // $scope.pagenumarr = [100, 200, 300, 500];
        $scope.totalNum = 0;
        $scope.codeList = [];

        function getList() {
            erp.load();
            var upData = {};
            // { "start":"2018-06-01", "end":"", "ordernumber":"111", "page":"1", "limit":"100" }
            upData.ordernumber = $scope.sersampleCode;
            upData.page = $scope.pagenum + '';
            upData.limit = $scope.pagesize;
            upData.salesmanName = $scope.saleName;
            upData.loisticsName = $scope.hdName;
            erp.postFun('app/returnhome/homeOrderNumberList', JSON.stringify(upData), function (data) {
                erp.closeLoad();
                console.log(data)
                // console.log(n.data.result)
                if (data.data.statusCode == '200') {
                    var resData = JSON.parse(data.data.result);
                    $scope.returnList = resData.list;
                    console.log($scope.returnList)
                    $scope.totalNum = resData.count;
                    pageFun();
                } else {
                    layer.msg(n.data.message)
                }
            }, err)
        }

        getList();

        function err(n) {
            erp.closeLoad();
            console.log(n)
        }

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

        //搜索
        $('.top-search-inp').keypress(function (e) {
            if (e.which == 13) {
                $scope.researchFun();
            }
        })
        $scope.researchFun = function () {
            $scope.pagenum = '1';
            getList();
        }
        //分页
        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            $scope.pagenum = '1';
            getList();
        }
        //跳页
        $scope.pagenumchange = function () {
            var pagenum = Number($scope.pagenum)
            var totalpage = Math.ceil($scope.totalNum / $scope.pagesize);
            if (pagenum > totalpage) {
                layer.msg('错误页码')
                $scope.pagenum = 1;
            } else {
                getList();
            }
        }
        //业务员
        $scope.saleManFun = function () {
            console.log($scope.saleName)
            console.log($scope.pagesize)
            $scope.pagenum = '1';
            getList();
        }
        //货代
        $scope.hdFun = function () {
            console.log($scope.hdName)
            console.log($scope.pagesize)
            $scope.pagenum = '1';
            getList();
        }
        //点击行数加样式
        $scope.TrClick = function (i) {
            $scope.focus = i;
        }
        $scope.addClick = function () {
            $scope.isadd = true;
            // var code = "";
            // var lastTime,nextTime;
            // var lastCode,nextCode;
        }
        //修改录入追踪号 
        $scope.enters = function (index, ev, item) {
            $scope.codeList[index].code = $(ev.target).text();
            console.log($scope.codeList)
        }
        $scope.removeCode = function (index) {
            console.log(index)
            $scope.codeList.splice(index, 1);
        }

        $scope.close = function () {
            $scope.isadd = false;
        }
        $('.not-content').click(function () {
            $('#content').removeClass('content-active')
        })
        $('#content').click(function (e) {
            e.stopPropagation();
            $(this).addClass('content-active');
        })

        $('.text-list').bind('input propertychange', function () {
            var aa = 0;
            var textnunm = $('.text-list').val().split("\n");
            console.log(textnunm)
            var textnunm1 = textnunm.length;
            console.log(textnunm1)
            if (aa == textnunm1) {
                console.log("aa");
            } else {
                aa = textnunm1;
                $(".indexnum-ul>li").remove();
                for (var i = 0; i < aa; i++) {
                    var li = '<li><span class="span-serial">' + (i + 1) + '</span></li>';
                    $(".indexnum-ul").append(li);
                }
                console.log("bb");
            }
        });
        //清空按钮
        $scope.clearTextFun = function () {
            $('.text-list').val('')
            $(".indexnum-ul>li").remove();
        }
        //扫码确定
        $scope.define = function () {
            // console.log($scope.codeList)
            var textarr = $('.text-list').val().split("\n");
            console.log(textarr);
            // var textstring = textarr.join(",");
            var len = textarr.length - 1;
            if (!textarr[len]) {
                textarr.pop();
            }
            console.log(textarr)
            // console.log(textstring.length);
            // console.log(JSON.stringify(textstring))
            if (textarr.length < 1) {
                layer.msg('请扫描追踪号！')
                return;
            } else {
                layer.load(2)
                var upData = {}
                upData.addList = textarr;
                console.log(JSON.stringify(upData))
                erp.postFun('app/returnhome/homeOrderNumber', JSON.stringify(upData), function (data) {
                    console.log(data)
                    erp.closeLoad();
                    if (data.data.statusCode == '200') {
                        $scope.isadd = false;
                        var resData = JSON.parse(data.data.result);
                        console.log(resData)
                        $scope.errCount = resData.error;
                        $scope.successCount = resData.sucess;
                        $scope.errorListArr = resData.errornumber;
                        console.log($scope.successCount)
                        console.log($scope.errCount)
                        if ($scope.successCount > 0) {
                            getList();
                        }
                        if ($scope.errCount > 0) {
                            $scope.addResFlag = true;
                        }
                    } else {
                        layer.msg('新增失败')
                    }
                }, err)
            }
        }
        //点击失败的按钮显示失败的列表
        $scope.errNumFun = function () {
            $scope.ResErrFlag = true;
        }
        //退件
        $scope.tjFun = function (item) {
            $scope.tjFlag = true;
            $scope.itemId = item.id;
        }
        $scope.tjSureFun = function () {
            console.log($scope.returnZzh)
            if (!$scope.returnZzh) {
                layer.msg('请输入追踪号')
                return;
            }

            layer.load(2)
            var upData = {};
            upData.id = $scope.itemId;
            // upData.type = 'isRecive';
            // upData.isReceive = 1;
            upData.trackingnumber = $scope.returnZzh;
            erp.postFun('app/returnhome/isReceiveHomeOrderNumber', JSON.stringify(upData), function (data) {
                console.log(data)
                layer.closeAll('loading')
                if (data.data.statusCode == '200') {
                    $scope.tjFlag = false;
                    layer.msg('退件成功')
                    getList();
                } else {
                    layer.msg('退件失败')
                }
            }, err)
        }
        //编辑
        $scope.modefyFun = function (item, index) {
            $scope.itemId = item.id;
            $scope.modefyFlag = true;
            $scope.modefyNewNum = item.newWayId;
            $scope.returnReson = item.causeInfo;
            $scope.returnRemark = item.remark;
        }
        $scope.sureModefyFun = function () {
            if (!$scope.modefyNewNum) {
                layer.msg('请输入新的运单号')
                return;
            }
            if (!$scope.returnReson) {
                layer.msg('请输入退件原因')
                return;
            }
            if (!$scope.returnRemark) {
                layer.msg('请输入备注')
                return;
            }
            var upData = {};
            // "id":"国内退件记录id", "newWayId":"新的追踪号", 
            // "causeInfo":"退件原因", "remark":"备注"
            upData.id = $scope.itemId;
            upData.newWayId = $scope.modefyNewNum;
            upData.causeInfo = $scope.returnReson;
            upData.remark = $scope.returnRemark;
            erp.postFun('app/returnhome/updateHomeOrderNumber', JSON.stringify(upData), function (data) {
                console.log(data)
                if (data.data.statusCode == '200') {
                    layer.msg('修改成功')
                    $scope.modefyFlag = false;
                    getList();
                } else {
                    layer.msg('修改失败')
                }
            }, err)
        }
        // 扣费
        $scope.kfFun = function (item) {
            $scope.kfFlag = true;
            $scope.itemId = item.id;
        }
        $scope.kfSureFun = function () {
            console.log($scope.returnKfCount)
            if (!$scope.returnKfCount) {
                layer.msg('请输入扣费金额')
                return;
            } else if ($scope.returnKfCount <= 0) {
                layer.msg('请输入有效的扣费金额')
                return;
            }
            layer.load(2)
            var upData = {};
            upData.id = $scope.itemId;
            // upData.type = 'isChare';
            // upData.isChare = 1;
            upData.chareMoney = $scope.returnKfCount;
            erp.postFun('app/returnhome/isChareHomeOrderNumber', JSON.stringify(upData), function (data) {
                console.log(data)
                erp.closeLoad()
                if (data.data.statusCode == '200') {
                    $scope.kfFlag = false;
                    layer.msg('扣费成功')
                    getList();
                } else {
                    layer.msg('扣费失败')
                }
            }, err)
        }

        // 国内退件录入追踪号
        // /app/returnhome/homeOrderNumber
        // { "addList":[追踪号1,追踪号2,追踪号3] }

        // 国内退件查询
        // /app/returnhome/homeOrderNumberList
        // { "start":"2018-06-01", "end":"", "ordernumber":"111", "page":"1", "limit":"100" }

        // 国内退件编辑
        // /app/returnhome/updateHomeOrderNumber
        // {"id":"国内退件记录id", "newWayId":"新的追踪号", "causeInfo":"退件原因", "remark":"备注"}


        // 赔偿
        $scope.pcFun = function (item) {
            $scope.pcFlag = true;
            $scope.itemId = item.id;
        }
        $scope.pcSureFun = function () {
            console.log($scope.returnPcMoney)
            if (!$scope.returnPcMoney) {
                layer.msg('请输入赔偿金额')
                return;
            } else if ($scope.returnPcMoney <= 0) {
                layer.msg('请输入有效的赔偿金额')
                return;
            }
            layer.load(2)
            var upData = {};
            upData.id = $scope.itemId;
            upData.payMoney = $scope.returnPcMoney;
            erp.postFun('app/returnhome/isPayHomeOrderNumber', JSON.stringify(upData), function (data) {
                console.log(data)
                erp.closeLoad();
                if (data.data.statusCode == '200') {
                    $scope.pcFlag = false;
                    layer.msg('赔偿成功')
                    getList();
                } else {
                    layer.msg('赔偿失败')
                }
            }, err)
        }
    }])
    //退件记录 未妥投
    app.controller('ReturnRecordsCtrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('stafftableCtrl')
        $scope.isoverTR = true;
        //查询销售 货代
        erp.getFun('app/logistics-return-info/get/salesmanName', function (data) {
            console.log(data)
            if (data.data.statusCode == '200') {
                $scope.saleArr = data.data.result;
                console.log($scope.saleArr)
            } else {
                console.log(data.data.message)
            }
        }, function (data) {
            console.log(data)
        })
        erp.getFun('app/logistics-return-info/get/freightName', function (data) {
            console.log(data)
            if (data.data.statusCode == '200') {
                //$scope.freightArr = data.data.result;
                var list = data.data.result;
                $.each(list, function (i, v) {
                    if (v == null) {
                        list.splice(i, 1);
                    }
                });
                $scope.freightArr = list;
                console.log($scope.freightArr)
            } else {
                console.log(data.data.message)
            }
        }, function (data) {
            console.log(data)
        })
        //分页相关
        $scope.pagesize = '20';
        $scope.pagenum = '1';
        // $scope.pagenumarr = [100, 200, 300, 500];
        $scope.totalNum = 0;
        $scope.codeList = [];

        function getList() {
            erp.load();
            // page 页码  pagesize 分页条数 track 追踪号(非必须)  
            // freightName 货代名称  (非必须 )salesmanName 销售名称  (非必须 )
            var getUrl;
            if ($scope.sersampleCode) {
                getUrl = 'app/logistics-return-info/search?page='
                    + $scope.pagenum + ''
                    + '&pagesize=' + $scope.pagesize
                    + '&track=' + $scope.sersampleCode
            } else {
                getUrl = 'app/logistics-return-info/search?page='
                    + $scope.pagenum + ''
                    + '&pagesize=' + $scope.pagesize;
            }
            if ($scope.saleName) {
                getUrl += '&salesmanName=' + $scope.saleName;
            }
            if ($scope.hdName) {
                var str = '';
                if ($scope.hdName.indexOf('+') > -1) {
                    str = $scope.hdName.replace('+', '%2B');
                } else {
                    str = $scope.hdName;
                }
                getUrl += '&freightName=' + str;
            }
            erp.getFun(getUrl, con, err)

            function con(n) {
                erp.closeLoad();
                // console.log(n)
                // console.log(n.data.result)
                if (n.data.statusCode == '200') {
                    var resData = n.data.result;
                    // console.log(resData)
                    $scope.returnList = resData.result;
                    console.log($scope.returnList)
                    $scope.totalNum = resData.pageInfo.totalCount;
                    // console.log($scope.totalNum)
                    pageFun();
                } else {
                    layer.msg(n.data.message)
                }
            }
        }

        getList();

        function err(n) {
            erp.closeLoad();
            console.log(n)
        }

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

        //搜索
        $('.top-search-inp').keypress(function (e) {
            if (e.which == 13) {
                $scope.researchFun();
            }
        })
        $scope.researchFun = function () {
            $scope.pagenum = '1';
            getList();
        }
        //分页
        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            $scope.pagenum = '1';
            getList();
        }
        //跳页
        $scope.pagenumchange = function () {
            var pagenum = Number($scope.pagenum)
            var totalpage = Math.ceil($scope.totalNum / $scope.pagesize);
            if (pagenum > totalpage) {
                layer.msg('错误页码')
                $scope.pagenum = 1;
            } else {
                getList();
            }
        }
        //业务员
        $scope.saleManFun = function () {
            console.log($scope.saleName)
            console.log($scope.pagesize)
            $scope.pagenum = '1';
            getList();
        }
        //货代
        $scope.hdFun = function () {
            console.log($scope.hdName)
            console.log($scope.pagesize)
            $scope.pagenum = '1';
            getList();
        }
        //点击行数加样式
        $scope.TrClick = function (i) {
            $scope.focus = i;
        }
        $scope.addClick = function () {
            $scope.isadd = true;
            var code = "";
            var lastTime, nextTime;
            var lastCode, nextCode;
        }
        //修改录入追踪号 
        $scope.enters = function (index, ev, item) {
            $scope.codeList[index].code = $(ev.target).text();
            console.log($scope.codeList)
        }
        $scope.removeCode = function (index) {
            console.log(index)
            $scope.codeList.splice(index, 1);
        }

        $scope.close = function () {
            $scope.isadd = false;
        }
        $('.not-content').click(function () {
            $('#content').removeClass('content-active')
        })
        $('#content').click(function (e) {
            e.stopPropagation();
            $(this).addClass('content-active');
        })

        $('.text-list').bind('input propertychange', function () {
            var aa = 0;
            var textnunm = $('.text-list').val().split("\n");
            console.log(textnunm)
            var textnunm1 = textnunm.length;
            console.log(textnunm1)
            if (aa == textnunm1) {
                console.log("aa");
            } else {
                aa = textnunm1;
                $(".indexnum-ul>li").remove();
                for (var i = 0; i < aa; i++) {
                    var li = '<li><span class="span-serial">' + (i + 1) + '</span></li>';
                    $(".indexnum-ul").append(li);
                }
                console.log("bb");
            }
        });
        //清空按钮
        $scope.clearTextFun = function () {
            $('.text-list').val('')
            $(".indexnum-ul>li").remove();
        }
        //扫码确定
        $scope.define = function () {
            // console.log($scope.codeList)
            var textarr = $('.text-list').val().split("\n");
            console.log(textarr);
            // var textstring = textarr.join(",");
            var len = textarr.length - 1;
            if (!textarr[len]) {
                textarr.pop();
            }
            console.log(textarr)
            // console.log(textstring.length);
            // console.log(JSON.stringify(textstring))
            if (textarr.length < 1) {
                layer.msg('请扫描追踪号！')
                return;
            } else {
                layer.load(2)
                var upData = {}
                upData.addList = textarr;
                console.log(JSON.stringify(upData))
                erp.postFun('app/logistics-return-info/add-list', JSON.stringify(upData), function (data) {
                    console.log(data)
                    erp.closeLoad();
                    if (data.data.statusCode == '200') {
                        $scope.isadd = false;
                        var resData = data.data.result;
                        console.log(resData)
                        $scope.errCount = resData.errorCount;
                        $scope.successCount = resData.successCount;
                        $scope.errorListArr = resData.errorList;
                        if ($scope.successCount > 0) {
                            getList();
                        }
                        if ($scope.errCount > 0) {
                            $scope.addResFlag = true;
                        }
                    } else {
                        layer.msg('新增失败')
                    }
                }, err)
            }
        }
        //点击失败的按钮显示失败的列表
        $scope.errNumFun = function () {
            $scope.ResErrFlag = true;
        }
        //退件
        $scope.tjFun = function (item) {
            $scope.tjFlag = true;
            $scope.itemId = item.id;
        }
        $scope.tjSureFun = function () {
            console.log($scope.returnZzh)
            layer.load(2)
            var upData = {};
            upData.id = $scope.itemId;
            upData.type = 'isRecive';
            upData.isReceive = 1;
            // upData.receiveTracknumber = $scope.returnZzh;
            erp.postFun('app/logistics-return-info/update-info', JSON.stringify(upData), function (data) {
                console.log(data)
                layer.closeAll('loading')
                if (data.data.statusCode == '200') {
                    $scope.tjFlag = false;
                    layer.msg('退件成功')
                    getList();
                } else {
                    layer.msg('退件失败')
                }
            }, err)
        }
        //编辑
        $scope.modefyFun = function (item, index) {
            $scope.itemId = item.id;
            $scope.modefyFlag = true;
            $scope.modefyNewNum = item.newWayId;
            $scope.returnReson = item.causeInfo;
            $scope.returnRemark = item.remark;
        }
        $scope.sureModefyFun = function () {
            if (!$scope.modefyNewNum) {
                layer.msg('请输入新的运单号')
                return;
            }
            if (!$scope.returnReson) {
                layer.msg('请输入退件原因')
                return;
            }
            if (!$scope.returnRemark) {
                layer.msg('请输入备注')
                return;
            }
            var upData = {};
            upData.id = $scope.itemId;
            upData.newWayId = $scope.modefyNewNum;
            upData.causeInfo = $scope.returnReson;
            upData.remark = $scope.returnRemark;
            erp.postFun('app/logistics-return-info/update-basic', JSON.stringify(upData), function (data) {
                console.log(data)
                if (data.data.statusCode == '200') {
                    layer.msg('修改成功')
                    $scope.modefyFlag = false;
                    getList();
                } else {
                    layer.msg('修改失败')
                }
            }, err)
        }
        // 扣费
        $scope.kfFun = function (item) {
            $scope.kfFlag = true;
            $scope.itemId = item.id;
        }
        $scope.kfSureFun = function () {
            console.log($scope.returnKfCount)
            if (!$scope.returnKfCount) {
                layer.msg('请输入扣费金额')
                return;
            } else if ($scope.returnKfCount <= 0) {
                layer.msg('请输入有效的扣费金额')
                return;
            }
            layer.load(2)
            var upData = {};
            upData.id = $scope.itemId;
            upData.type = 'isChare';
            upData.isChare = 1;
            upData.chareMoney = $scope.returnKfCount;
            erp.postFun('app/logistics-return-info/update-info', JSON.stringify(upData), function (data) {
                console.log(data)
                erp.closeLoad()
                if (data.data.statusCode == '200') {
                    $scope.kfFlag = false;
                    layer.msg('扣费成功')
                    getList();
                } else {
                    layer.msg('扣费失败')
                }
            }, err)
        }
        // 赔偿
        $scope.pcFun = function (item) {
            $scope.pcFlag = true;
            $scope.itemId = item.id;
        }
        $scope.pcSureFun = function () {
            console.log($scope.returnPcMoney)
            if (!$scope.returnPcMoney) {
                layer.msg('请输入赔偿金额')
                return;
            } else if ($scope.returnPcMoney <= 0) {
                layer.msg('请输入有效的赔偿金额')
                return;
            }
            layer.load(2)
            var upData = {};
            upData.id = $scope.itemId;
            upData.type = 'isPay';
            upData.isPay = 1;
            upData.payMoney = $scope.returnPcMoney;
            erp.postFun('app/logistics-return-info/update-info', JSON.stringify(upData), function (data) {
                console.log(data)
                erp.closeLoad();
                if (data.data.statusCode == '200') {
                    $scope.pcFlag = false;
                    layer.msg('赔偿成功')
                    getList();
                } else {
                    layer.msg('赔偿失败')
                }
            }, err)
        }
        var bulkIds = '';
        $scope.bulkReturn = function () {
            var bulkCount = 0;
            bulkIds = '';
            $('#c-mu-ord .cor-check-box').each(function () {
                if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
                    bulkCount++;
                    bulkIds += $(this).parent().siblings('.id-p').text() + ',';
                }
            })
            if (bulkCount <= 0) {
                layer.msg('请选择订单');
                return;
            } else {
                $scope.bulkRFlag = true;
            }
        }
        $scope.sureBulkRFun = function () {
            console.log(bulkIds)
            layer.load(2);
            var upData = {};
            upData.ids = bulkIds;
            erp.postFun('app/logistics-return-info/updateReceive', JSON.stringify(upData), function (data) {
                console.log(data)
                $scope.bulkRFlag = false;
                if (data.data.result > 0) {
                    layer.msg('退件成功')
                    getList();
                } else {
                    layer.closeAll('loading')
                    layer.msg('退件失败')
                }
            }, function (data) {
                layer.closeAll('loading')
                console.log(data)
            })
        }
        //导出
        $scope.sureExportFun = function () {
            $scope.isExportFlag = false;
            layer.load(2)
            var exportData = {};
            exportData.track = $scope.sersampleCode || '';
            exportData.salesmanName = $scope.saleName || '';
            exportData.freightName = $scope.hdName || '';
            erp.postFun('erp/logisticReturn/exportExcel', JSON.stringify(exportData), function (data) {
                console.log(data)
                layer.closeAll("loading")
                if (data.data.statusCode) {
                    var result = data.data.result.url;
                    if (result) {
                        $scope.excelFlag = true;
                        $scope.link = result;
                    } else {
                        layer.msg('导出失败')
                    }
                } else {
                    layer.msg('导出失败')
                }
            }, function (data) {
                layer.closeAll("loading")
                console.log(data)
            })
        }
        //给子订单里面的订单添加选中非选中状态
        var cziIndex = 0;
        $('#c-mu-ord').on('click', '.cor-check-box', function () {
            if ($(this).attr('src') == 'static/image/order-img/multiple1.png') {
                $(this).attr('src', 'static/image/order-img/multiple2.png');
                cziIndex++;
                if (cziIndex == $('#c-mu-ord .cor-check-box').length) {
                    $('#c-mu-ord .c-checkall').attr('src', 'static/image/order-img/multiple2.png');
                }
            } else {
                $(this).attr('src', 'static/image/order-img/multiple1.png');
                cziIndex--;
                if (cziIndex != $('#c-mu-ord .cor-check-box').length) {
                    $('#c-mu-ord .c-checkall').attr('src', 'static/image/order-img/multiple1.png');
                }
            }
        })
        //全选
        $('#c-mu-ord').on('click', '.c-checkall', function () {
            if ($(this).attr('src') == 'static/image/order-img/multiple1.png') {
                $(this).attr('src', 'static/image/order-img/multiple2.png');
                cziIndex = $('#c-mu-ord .cor-check-box').length;
                $('#c-mu-ord .cor-check-box').attr('src', 'static/image/order-img/multiple2.png');
            } else {
                $(this).attr('src', 'static/image/order-img/multiple1.png');
                cziIndex = 0;
                $('#c-mu-ord .cor-check-box').attr('src', 'static/image/order-img/multiple1.png');
            }
        })
    }]).directive('contenteditable', function () {//自定义ngModel的属性可以用在div等其他元素中
        return {
            restrict: 'A', // 作为属性使用
            require: '?ngModel', // 此指令所代替的函数
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) {
                    return;
                } // do nothing if no ng-model
                console.log(scope, element, attrs, ngModel)
                // Specify how UI should be updated
                ngModel.$render = function () {
                    element.html(ngModel.$viewValue || '');
                };
                // Listen for change events to enable binding
                element.on('blur keyup change', function () {
                    scope.$apply(readViewText);
                });
                console.log(scope, element, attrs, ngModel)
                console.log(readViewText())
                // No need to initialize, AngularJS will initialize the text based on ng-model attribute
                // Write data to the model
                function readViewText() {
                    var html = element.html();
                    // When we clear the content editable the browser leaves a <br> behind
                    // If strip-br attribute is provided then we strip this out
                    if (attrs.stripBr && html === '<br>') {
                        html = '';
                    }
                    ngModel.$setViewValue(html);
                }
            }
        };
    })

    //分单
    app.controller('singleRecordCtrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('singleRecordCtrl');

        $scope.pageNum = '1';
        $scope.pageSize = '20';
        $scope.searchInfo = '';

        getFendanList();

        function getFendanList() {
            $scope.offset = (parseInt($scope.pageNum) - 1) * (parseInt($scope.pageSize));
            $scope.count = $scope.offset + (parseInt($scope.pageSize));
            var data = {
                "offset": $scope.offset,
                "count": $scope.count,
                "orderNumber": $scope.searchInfo
            };
            console.log(data);
            erp.load();
            erp.postFun('erp/trackNumber/list', JSON.stringify(data), function (data) {
                erp.closeLoad();
                console.log(data);
                if (data.status == 200) {
                    var result = data.data;
                    console.log(result);
                    if (result.totalCount == 0) {
                        layer.msg('暂无数据');
                    }
                    $scope.trackList = result.trackInfos;
                    $scope.totalCounts = result.totalCount;
                    console.log($scope.trackList);
                    pageFun();
                }
            }, function () {
                erp.closeLoad();
                layer.msg('Network error, please try again later');
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
                    getFendanList();
                }
            });
        }

        //搜索
        $scope.search = function () {
            console.log($scope.searchinfo);
            getFendanList();
        }
        //按下enter搜索
        $(function () {
            $(".search-text-box").keydown(function (event) {
                if (event.keyCode === 13 || event.keyCode === 108) {
                    getFendanList();
                }
            });
        })
        //更换每页多少条数据
        $scope.pagesizechange = function (pagesize) {
            //console.log(pagesize)
            // $scope.pagesize=pagesize-0;
            $scope.pageNum = 1;
            getFendanList();
        };
        //手动输入页码GO跳转
        $scope.pagenumchange = function () {
            var pagenum = Number($scope.pageNum);
            var totalpage = Math.ceil($scope.totalCounts / $scope.pageSize);
            if (pagenum > totalpage) {
                layer.msg('错误页码');
                $scope.pageNum = 1;
            } else {
                getFendanList();
            }
        };

        //打开新增
        $('#addFendan').click(function () {
            $scope.showBtn = true;
            $scope.showSpan = false;
            var zzc = $('.zzc');
            zzc.show().find('h2').html('新增分单');
            zzc.find('.ddh>input').val('').show();
            zzc.find('.ddh>span').html('').hide();
            zzc.find('.ddh>button').show();
            zzc.find('.addBtn').show();
            zzc.find('.updateBtn').hide();
            $scope.groupList = [];
            $scope.$apply();
        });
        //打开修改
        $scope.updateFun = function (item) {
            $scope.showBtn = true;
            $scope.showSpan = false;
            var zzc = $('.zzc');
            zzc.show().find('h2').html('修改分单');
            zzc.find('.ddh>span').html(item.orderNumber).css('display', 'inline-block');
            zzc.find('.ddh>input').hide();
            zzc.find('.ddh>button').show();

            zzc.find('.addBtn').hide();
            zzc.find('.updateBtn').show().attr('data-id', item.id);

            var trackList = JSON.parse(item.trackInfo);
            console.log(trackList);
            var datalist = [];
            $.each(trackList, function (i, v) {
                console.log(i, v);
                var data = {
                    "trackNumber": i,
                    "logisticsName": v
                }
                datalist.push(data);
            });
            $scope.groupList = datalist;

            //$scope.$apply();
        };
        //查看详情
        $scope.lookdetail = function (item) {
            $scope.showBtn = false;
            $scope.showSpan = true;
            var zzc = $('.zzc');
            zzc.show().find('h2').html('分单详情');
            zzc.find('.ddh>span').html(item.orderNumber).show();
            zzc.find('.ddh>input').hide();
            zzc.find('.ddh>button').hide();
            zzc.find('.addBtn').hide();
            zzc.find('.updateBtn').hide();
            var trackList = JSON.parse(item.trackInfo);
            console.log(trackList);
            var datalist = [];
            $.each(trackList, function (i, v) {
                console.log(i, v);
                var data = {
                    "trackNumber": i,
                    "logisticsName": v
                }
                datalist.push(data);
            });
            $scope.groupList = datalist;
        };

        $scope.addZZH = function () {
            var edit = $('.tbodyWrap').find('.edit');
            if (edit.length > 0) {
                layer.msg('请先保存追踪号再新增');
            } else {
                //console.log('可以新增')
                var str = '<div class="table-group table-tbody edit new"><div class="zzh"><span></span><input style="width: 220px" type="text"/></div><div class="wl"><span></span><input style="width: 120px" type="text"/></div><div class="cz"><button class="btn02 editBtn">编辑</button><button class="btn02 deleteBtn">删除</button><button class="btn01 saveBtn">保存</button><button class="btn01 cancelBtn">取消</button></div></div>';
                $('.tbodyWrap').prepend(str);
            }
        };
        //打开编辑
        $('.tbodyWrap').on('click', '.editBtn', function () {
            var edit = $('.tbodyWrap').find('.edit');
            if (edit.length > 0) {
                layer.msg('请先保存追踪号再编辑');
            } else {
                var target = $(this);
                var parent = target.parent().parent();
                parent.addClass('edit');
                var zzh = parent.find('.zzh>span').html();
                var wl = parent.find('.wl>span').html();
                parent.find('.zzh>input').val(zzh);
                parent.find('.wl>input').val(wl);

            }

        });
        //保存
        $('.tbodyWrap').on('click', '.saveBtn', function () {
            var target = $(this);
            var parent = target.parent().parent();
            var index = parent.index();
            var zzh = parent.find('.zzh>input').val();
            var wl = parent.find('.wl>input').val();
            if (zzh == null || zzh == '' || zzh == undefined) {
                layer.msg('追踪号不能为空');
            } else if (wl == null || wl == '' || wl == undefined) {
                layer.msg('物流名称不能为空');
            } else {
                parent.find('.zzh>span').html(zzh);
                parent.find('.wl>span').html(wl);
                if (parent.hasClass('new')) {
                    var data = {
                        "trackNumber": zzh,
                        "logisticsName": wl
                    };
                    $scope.groupList.unshift(data);
                    //parent.removeClass('new');
                    parent.remove();
                } else {
                    $scope.groupList[index].trackNumber = zzh;
                    $scope.groupList[index].logisticsName = wl;
                }
                parent.removeClass('edit');
                $scope.$apply();
            }

        });

        //取消编辑
        $('.tbodyWrap').on('click', '.cancelBtn', function () {
            var target = $(this);
            var parent = target.parent().parent();
            if (parent.hasClass('new')) {
                console.log('new');
                //$('.tbodyWrap').removeChild(parent);
                parent.remove();
            } else {
                parent.removeClass('edit');
            }
        });
        //删除
        $('.tbodyWrap').on('click', '.deleteBtn', function () {
            var target = $(this);
            var parent = target.parent().parent();
            var index = $(this).index();
            console.log(index);
            $scope.groupList.splice(index - 1, 1);
            console.log($scope.groupList);
            $scope.$apply();
            //parent.remove();

        });
        $('.closeBtn').click(function () {
            $('.zzc').hide();
        });

        //确认新增分单
        $('.addBtn').click(function () {
            var tlist = $('.tbodyWrap').find('.table-group');
            console.log(tlist);
            var orderNumber = $('.ddh>input').val();
            console.log(orderNumber);
            if (orderNumber == null || orderNumber == '' || orderNumber == undefined) {
                layer.msg('订单号不能为空');
            } else if (tlist.length <= 0) {
                layer.msg('追踪号不能为空');
            } else {
                var edit = $('.tbodyWrap').find('.edit');
                if (edit.length > 0) {
                    layer.msg('请先保存追踪号');
                } else {
                    var track = {};
                    $.each(tlist, function (i, v) {
                        var target = $(v);
                        var zzh = target.find('.zzh>span').html();
                        var wl = target.find('.wl>span').html();
                        track[zzh] = wl;
                    });
                    //console.log(track);
                    var count = 0;
                    $.each(track, function (i, v) {
                        count++;
                    });
                    //console.log(count);
                    if (tlist.length != count) {
                        layer.msg('你有重复的追踪号');
                    } else {
                        var data = {
                            "orderNumber": orderNumber,
                            "trackNumberInfos": JSON.stringify(track)
                        };
                        console.log(JSON.stringify(data));
                        erp.load();
                        erp.postFun('erp/trackNumber/insert', JSON.stringify(data), function (data) {
                            erp.closeLoad();
                            console.log(data.data);
                            if (data.data.statusCode == "200") {
                                layer.msg('添加成功');
                                $('.zzc').hide();
                                getFendanList();
                            } else {
                                layer.msg('添加失败');
                            }
                        }, function () {
                            erp.closeLoad();
                            layer.msg('Network error, please try again later');
                        });
                    }
                }


            }

        });

        //确认修改
        $('.updateBtn').click(function () {
            var tlist = $('.tbodyWrap').find('.table-group');
            var id = $(this).attr('data-id');
            if (tlist.length <= 0) {
                layer.msg('追踪号不能为空');
            } else {
                var edit = $('.tbodyWrap').find('.edit');
                if (edit.length > 0) {
                    layer.msg('请先保存追踪号');
                } else {
                    var track = {};
                    $.each(tlist, function (i, v) {
                        var target = $(v);
                        var zzh = target.find('.zzh>span').html();
                        var wl = target.find('.wl>span').html();
                        track[zzh] = wl;
                    });
                    //console.log(track);
                    var count = 0;
                    $.each(track, function (i, v) {
                        count++;
                    });
                    //console.log(count);
                    if (tlist.length != count) {
                        layer.msg('你有重复的追踪号');
                    } else {
                        var data = {
                            "id": id,
                            "trackNumberInfos": JSON.stringify(track)
                        };
                        erp.load();
                        erp.postFun('erp/trackNumber/update', JSON.stringify(data), function (data) {
                            erp.closeLoad();
                            console.log(data);
                            if (data.data.statusCode == "200") {
                                layer.msg('修改成功');
                                $('.zzc').hide();
                                getFendanList();
                            } else {
                                layer.msg('修改成功');
                            }
                        }, function () {
                            erp.closeLoad();
                            layer.msg('Network error, please try again later');
                        });
                    }
                }

            }
        });
        //删除记录
        $scope.deleteFun = function (id) {
            layer.confirm('确认要删除吗？', {
                btn: ['确定', '取消']//按钮
            }, function (index) {
                layer.close(index);
                //此处请求后台程序，下方是成功后的前台处理……
                var data = {
                    "id": id
                };
                erp.load();
                erp.postFun('erp/trackNumber/delete', JSON.stringify(data), function (data) {
                    erp.closeLoad();
                    console.log(data);
                    if (data.data.statusCode == "200") {
                        layer.msg('删除成功');
                        getFendanList();
                    } else {
                        layer.msg('删除失败');
                    }
                }, function () {
                    erp.closeLoad();
                    layer.msg('Network error, please try again later');
                });
            });

        }
    }]);

    //打包统计
    app.controller('PackagingStatisticsCtrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('PackagingStatisticsCtrl');
        $scope.pageSize = '20';
        $scope.pageNum = '1';
        $scope.searchInfo = '';
        $scope.startDate = '';
        $scope.endDate = '';

        getPacketList();

        var date2 = new Date();
        var year2 = date2.getFullYear();
        var month2 = date2.getMonth() + 1;
        var day2 = date2.getDate();
        //console.log(year+'-'+month+'-'+day);
        var now = year2 + '-' + month2 + '-' + day2;
        $('#c-data-time').val(now);
        $('#cdatatime2').val(now);

        function getPacketList() {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            //console.log(year+'-'+month+'-'+day);
            if ($scope.startDate == '') {
                $scope.startDate = year + '-' + month + '-' + day;
            }
            if ($scope.endDate == '') {
                $scope.endDate = year + '-' + month + '-' + day;
            }
            var data = {
                "packageUser": $scope.searchInfo,
                "startDate": $scope.startDate + " 00:00:01",
                "endDate": $scope.endDate + " 23:59:59"
            };
            $scope.packageList = [];
            console.log(data);
            erp.load();
            erp.postFun('processOrder/employeeStatistics/packageTongji', JSON.stringify(data), function (data) {
                erp.closeLoad();
                console.log(data);
                if (data.data.code == '200') {
                    var list = data.data.data;
                    if (list.length > 0) {
                        $.each(list, function (i, v) {
                            if (!v.count) {
                                v.count = 0;
                            }
                            if (!v.quantity) {
                                v.quantity = 0
                            }
                        });
                        console.log(list);
                        $scope.packageList = list;
                    } else {
                        layer.msg('暂无数据');
                    }
                } else {
                    layer.msg('查询失败');
                }
            }, function () {
                erp.closeLoad();
                layer.msg('网络错误')
            });
        }

        $scope.gotoFun = function (name) {
            var url = 'manage.html#/erplogistics/dppstu/' + name;
            window.open(url);
        }

        $scope.search = function () {
            console.log($scope.searchInfo);
            $scope.pageNum = '1';
            getPacketList();
        }
        $('#searchInput').keypress(function (event) {
            if (event.keyCode == 13) {
                $scope.search()
            }
        });
        $scope.searchFun = function () {
            var startDate = $('#c-data-time').val();
            var endDate = $('#cdatatime2').val();
            $scope.startDate = startDate;
            $scope.endDate = endDate;
            console.log($scope.startDate, $scope.endDate);
            getPacketList();
        }
    }]);

})()