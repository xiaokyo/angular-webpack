(function () {
    var app = angular.module('erp-customer', []);
    var lang = localStorage.getItem('lang');
    var gjh01;
    var gjh02;
    var gjh03;
    var gjh04;
    var gjh05;
    var gjh06;
    var gjh07;
    var gjh08;
    var gjh09;
    var gjh10;
    var gjh11;
    var gjh12;
    var gjh13;
    var gjh14;
    var gjh15;
    var gjh16;
    var gjh17;
    var gjh18;
    var gjh19;
    var gjh20;
    var gjh21;
    var gjh22;
    var gjh23;
    var gjh24;
    var gjh25;
    var gjh26;
    var gjh27;
    var gjh28;
    var gjh29;
    var gjh30;
    var gjh31;
    var gjh32;
    var gjh33;
    var gjh34;
    var gjh35;
    var gjh36;
    var gjh37;
    var gjh38;
    var gjh39;
    var gjh40;
    var gjh41;
    var gjh42;
    var gjh43;
    var gjh44;
    var gjh45;
    var gjh46;
    var gjh47;
    var gjh48;
    var gjh49;
    var gjh50;
    var gjh51;
    var gjh52;
    var gjh53;
    var gjh54;
    var gjh55;
    if (lang == 'cn' || lang == null) {
        gjh01 = '请选择物流';
        gjh02 = '该物流已经存在，不能重复添加！';
        gjh03 = '请先将所有物流方式保存';
        gjh04 = '请给';
        gjh05 = '设置优先级';
        gjh06 = '保存失败';
        gjh07 = '保存成功';
        gjh08 = '您还没有保存修改的信息，确定退出吗？';
        gjh09 = '确定';
        gjh10 = '取消';
        gjh11 = '请选择国家';
        gjh12 = '该国家已经存在，不能重复添加！';
        gjh13 = '请输入大于0的数字';
        gjh14 = '折扣不能设置为小数';
        gjh15 = '公式错误';
        gjh16 = '请输入大于0小于100的整数';
        gjh17 = '请输入业务员';
        gjh18 = '请输入客户';
        gjh19 = '添加成功';
        gjh20 = '成功通过';
        gjh21 = '已拒绝';
        gjh22 = '已加入黑名单';
        gjh23 = '成功加入白名单';
        gjh24 = '操作成功';
        gjh25 = '操作失败';
        gjh26 = '拒绝理由';
        gjh27 = '未找到相关数据';
        gjh28 = '网络错误';
        gjh29 = '错误页码';
        gjh30 = '加入黑名单？';
        gjh31 = '是否审核通过？';
        gjh32 = '拒绝';
        gjh33 = '通过';
        gjh34 = '重新审核？';
        gjh35 = '永不通过';
        gjh36 = '是否解除黑名单？';
        gjh37 = '解除';
        gjh38 = '新增成功';
        gjh39 = '修改成功';
        gjh40 = '修改失败';
        gjh41 = '是否删除？';
        gjh42 = '请上传excel文件';
        gjh43 = '上传成功';
        gjh44 = '上传失败';
        gjh45 = '请输入姓名';
        gjh46 = '系统错误';
        gjh47 = '删除成功';
        gjh48 = '请输入邮箱';
        gjh49 = '请输入正确邮箱';
        gjh50 = '请输入WhatsApp';
        gjh51 = '请输入Skype';
        gjh52 = '请选择一级类目';
        gjh53 = '请选择二级类目';
        gjh54 = '请选择三级类目';
        gjh55 = '确认';
    } else if (lang == 'en') {
        gjh01 = 'Please choose logistics';
        gjh02 = 'The logistics already exists and cannot be added again!';
        gjh03 = 'Please save all logistics methods first';
        gjh04 = 'Please give';
        gjh05 = 'Set the priority';
        gjh06 = 'Failed to save';
        gjh07 = 'Saved successfully';
        gjh08 = 'You haven’t saved the edited information. Are you sure you want to exit?';
        gjh09 = 'Confirm ';
        gjh10 = 'Cancel';
        gjh11 = 'Please select a country';
        gjh12 = 'The country already exists and cannot be added twice!';
        gjh13 = 'Please enter a number greater than 0';
        gjh14 = 'Discount cannot be set to decimal';
        gjh15 = 'Formula error';
        gjh16 = 'Please enter an integer greater than 0 and less than 100';
        gjh17 = 'Please enter the salesman';
        gjh18 = 'Please enter the customer';
        gjh19 = 'Added successfully';
        gjh20 = 'Successfully passed';
        gjh21 = 'rejected';
        gjh22 = 'Blacklisted';
        gjh23 = 'Successfully joined the white list';
        gjh24 = 'Successful operation';
        gjh25 = 'operation failed';
        gjh26 = 'Reason for rejection';
        gjh27 = 'No relevant data found';
        gjh28 = 'Network Error';
        gjh29 = 'Error page number';
        gjh30 = 'add to blacklist？';
        gjh31 = 'Whether to pass the audit？';
        gjh32 = 'Refuse';
        gjh33 = 'Pass';
        gjh34 = 'Re-review？';
        gjh35 = 'Never pass';
        gjh36 = 'Whether to blacklist？';
        gjh37 = 'Release';
        gjh38 = 'added successfully';
        gjh39 = 'Successfully modified';
        gjh40 = 'fail to edit';
        gjh41 = 'delete or not？';
        gjh42 = 'Please upload excel file';
        gjh43 = 'Uploaded successfully';
        gjh44 = 'Upload failed';
        gjh45 = 'Please type in your name';
        gjh46 = 'system error';
        gjh47 = 'successfully deleted';
        gjh48 = 'Please input your email';
        gjh49 = 'Please enter the correct email';
        gjh50 = 'Please enter WhatsApp';
        gjh51 = 'Please enter Skype';
        gjh52 = 'Please select category 1';
        gjh53 = 'Please select category 2';
        gjh54 = 'Please select category 3';
        gjh55 = 'Confirm';
    }


    //执行完毕执行
    app.directive('repeatFinish', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('repeatFinish');
                    });
                }
            }
        }
    });
    //erp客户--客户列表
    app.controller('KeHuLieBiaoCtrl', ['$scope', '$timeout', 'erp', '$location', '$routeParams', function ($scope, $timeout, erp, $location, $routeParams) {
        console.log('KeHuLieBiaoCtrl')
	    $scope.needOptimisation = true;
	    $scope.appHref = erp.getAppUrl();
        $scope.sourceType = '0';
        $scope.isAuditStatus = 'all'; // 是否审核过 -- 通过邮箱验证的
        $scope.isCodkehu = false; // 是否cod客户列表
		const lang = localStorage.getItem('lang') || 'cn'
    // console.log(document.getElementById('kehu-tab').clientTop)
    let kehuContentMT = $routeParams.type == 2 ? '169' : '229';
    let kehuContentMTEn = $routeParams.type == 2 ? '169' : '229';
		document.getElementById('kehu-content').style.marginTop = `${lang === 'cn' ? kehuContentMT : kehuContentMTEn}px`
		window.onresize = function () {
			let height = document.getElementById('kehu-tab').offsetHeight
			console.log(height)
			document.getElementById('kehu-content').style.marginTop = `${height - 26}px`
		}
		const topTabEle = document.getElementById('kehu-tab')
		const topTabLeft = topTabEle.offsetLeft
		window.onscroll = function () {
			let scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
			topTabEle.style.left = `${topTabLeft - scrollLeft}px`
		}

        $scope.goToCj = function (item) {
            console.log(item);
            let toUrl;
            erp.postFun('app/account/erpHuoQuYongHuChaoJiMiMa', {"accountId": item.id}, function (data){
                console.log(data);
                if (data.data.statusCode == 200) {
                    let cjUrl = $scope.appHref + '/home.html?username=' + encodeURIComponent(item.LOGIN_NAME) + '&tempassword=' + encodeURIComponent(data.data.result);
                    if (item.domainName) {
                        if (
                            item.domainName === 'app.cjdropshipping.com' &&
                            /production-cn##$/.test(environment)
                        ) {
                            toUrl= cjUrl;
                        }else if(item.domainName === 'cod.cjdropshipping.com') {
                            toUrl= cjUrl;
                        } else {
                            toUrl = item.domainName.startsWith("http") ? item.domainName : ("https://" + item.domainName) + '/home.html?username=' + encodeURIComponent(item.LOGIN_NAME) + '&tempassword=' + encodeURIComponent(data.data.result);
                        }
                    } else {
                        toUrl = cjUrl;
                    }
                    window.open(toUrl);
                }
            }, function() {}, {layer: true})
        }
        
        // to cod
        $scope.goToCod = item => {
	        console.log(item)
	        erp.postFun('app/account/erpHuoQuYongHuChaoJiMiMa',{"accountId": item.id},({data}) =>{
		        data.statusCode === '200' &&
		        window.open(`${erp.getCodUrl()}/home.html?username=${encodeURIComponent(item.LOGIN_NAME)}&tempassword=${encodeURIComponent(data.result)}`)
	        },err => console.log(err))
        }
        
        
        $scope.$on('repeatFinish', function () {
            console.log('11');
            if ($scope.isTimeFlag) {
                $('#c-mu-ord .c-mu-chekbox').attr('src', 'static/image/order-img/multiple2.png');
                $('#c-mu-ord .c-mu-allchekbox').attr('src', 'static/image/order-img/multiple2.png');
                cmuIndex = $('#c-mu-ord .c-mu-chekbox').length;
               
            }
            
        });
        $scope.openFpkhFun = function () {
            let selCount = 0;

            $('#c-mu-ord .c-mu-chekbox').each(function () {
                if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
                    selCount++;
                }
            })
            selCount < 1 ? layer.msg('请选择客户') : $scope.add = true
        }
        $scope.cuStatus = 0;
        //左侧的列表信息
        // alert(666)
        var b = new Base64();
        var myChart = echarts.init(document.getElementById('main1'));
        var myChart2 = echarts.init(document.getElementById('main2'));
        var jobType = b.decode(localStorage.getItem('job')==undefined?'':localStorage.getItem('job'))
        $scope.userJob = jobType
        $scope.loginName = b.decode(localStorage.getItem('erploginName') == undefined ? '' : localStorage.getItem('erploginName'));
        console.log(jobType)
        if ($scope.loginName == 'admin' || (jobType=='销售' && $scope.loginName !== '程珍珍')) {
            $scope.fpkhBtnFlag = true;
        } else {
            $scope.fpkhBtnFlag = false;
        }
        const allocationList = ['admin', '陈磊刚', '聂德宁', '姚滋阳', '廖倩', '龚莹']
        $scope.allocationFlag = allocationList.includes($scope.loginName)
        if ($scope.loginName == 'Eric' || jobType === '运营' || $scope.loginName === '程珍珍') {
            $scope.isUS = false;
        } else {
            $scope.isUS = true;
		}
		$scope.isCaiwuFlag = ['艾云斌', '杜园园', '郑莹莹', '周其珊'].includes($scope.loginName)
        console.log($scope.loginName);
        //去客户详情
        $scope.gotoDetailFun = function (e,id) {
            e.stopPropagation();
            !$scope.isCaiwuFlag && window.open('manage.html#/erpcustomer/customer-detail/' + id + '/1', '_blank', '');
        }

        // 是否是审核过的客户
        $scope.isAudited = function(item){
            return item.status == 1
        }

        $scope.isLost = false;
        // 头部tab切换
	      $scope.changeStatus = function (s,t) {
            $scope.status = '1'
            $scope.cuStatus = s;
		        $scope.vipType = ''
		        if(s == 'lost'){
                $scope.isLost = true;
                $scope.lostType = '1';
                $scope.dayType = '1';
                customerList = [];
                getLostCustomer();
                getAllSalesman();
            }else if (s.toString().includes('lv')){
			        $('.kehuleixing').hide();
			        $('.yonghuming').css('width','16%');
			        $scope.isLost = false;
			        $scope.sourceVip = null;
			        $scope.dataType= null;
			        $scope.pagenum='1';
			        $scope.vipType = t
			        getcustomerList();
		    }else if (s.toString().includes('vip')){
			        $('.kehuleixing').hide();
			        $('.yonghuming').css('width','16%');
			        $scope.isLost = false;
			        $scope.sourceVip = null;
			        $scope.dataType= null;
			        $scope.pagenum='1';
			        $scope.dataType = t
			        getcustomerList();
		    }else{
                $scope.isLost = false;
                if(s=='0'){
                    $('.kehuleixing').show();
                    $('.yonghuming').css('width','11%');
                    $scope.status = 'all'
                    $scope.dataType='';
                    $scope.sourceVip = null;
                }else if(s == 'sourceVip'){
                    $('.kehuleixing').hide();
                    $('.yonghuming').css('width','16%');
                    $scope.dataType='';
                    $scope.sourceVip = '1';
                }else{
                    $('.kehuleixing').hide();
                    $('.yonghuming').css('width','16%');
                    $scope.dataType = $scope.cuStatus*1 -1;
                    $scope.sourceVip = null;
                }
                console.log($scope.dataType);
                $scope.pagenum='1';
                getcustomerList();
            }
            
        }
        $scope.$on('ngRepeatFinished', function () {
            // console.log('哈哈，加载完毕了')
            $scope.triggleFirst();
        });
        $scope.triggleFirst = function () {
            $('.maylostTbody>.msylostTr').eq(0).addClass('active').trigger('click');
        }
        $('.maylostTbody').on('click','.msylostTr',function () {
            // console.log('点击了');
            var target = $(this);
            var id = target.attr('data-id');
            var name = target.find('.maylostTd').eq(0).find('span').html();
            var sendData = {
                paymentId: id,
                dateType: $scope.dayType
            }
            erp.postFun('erp/analysis/customersChart',JSON.stringify(sendData),function (data) {
                console.log(data.data);
                if (data.data.statusCode == '200') {
                    var result = data.data.result;
                    var zhexianList = result.brokenLine;
                    var zhexianList2 = result.beforeLine;
                    var zhexiantu = [];
                    var zhexiantu2 = [];
                    var zhexianTime = [];
                    $.each(zhexianList, function (i, v) {
                        var d = parseInt(v.payTime);
                        var date = new Date(d);
                        var data = date.getFullYear() + '-'
                            + (date.getMonth() + 1) + '-'
                            + date.getDate();
                        zhexianTime.push(data);
                        zhexiantu.push(parseFloat(v.ocount));
                    });
                    $.each(zhexianList2, function (i, v) {
                        zhexiantu2.push(parseFloat(v.ocount));
                    });

                    console.log(zhexiantu);
                    setZhexiantu(name, zhexiantu, zhexiantu2, zhexianTime);
                    var cake = result.cake;

                    console.log($scope.cakeList);
                    var nameArr = [];
                    var valueArr = [];
                    var cakeCount = 0;
                    $.each(cake, function (i, v) {
                        nameArr.push(v.store_name);
                        var data = {
                            value: v.ocun,
                            name: v.store_name
                        };
                        cakeCount += v.ocun;
                        valueArr.push(data);
                    });
                    $scope.cakeCount = cakeCount;
                    $scope.cakeList = cake;
                    setBingTu(name, valueArr, nameArr);
                    var ele = $('.maylostTbody').find('.msylostTr.active');
                    var total = ele.find('.maylostTd').eq(2).find('span').html();
                    var info = {
                        name: name,
                        length: cake.length,
                        total: total.split('/')[0]
                    };
                    $scope.customerInfo = info;
                    console.log($scope.customerInfo);

                } else {
                    layer.msg('查询失败');
                }
            }, function () {}, {layer:true})
        })
        $scope.classRatio = function (ratio) {
            if(ratio == 0){
                return 0;
            }else{
                return ratio.toFixed(2);
            }
        }
        $scope.classRate = function (ocun) {
            return parseFloat(((ocun / $scope.cakeCount) * 100).toFixed(2));
        }
        function setZhexiantu(name, zhexiantu, zhexiantu2, zhexianTime) {
            var option = {
                color: [
                    '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
                    '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
                    '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
                    '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
                ],
                title: {
                    text: name + '订单数量变化图'
                    //subtext: '纯属虚构'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['CJ 订单量', '环比订单量']
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: zhexianTime
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }
                ],
                series: [
                    {
                        name: 'CJ 订单量',
                        type: 'line',
                        data: zhexiantu,
                        //markPoint : {
                        //    data : [
                        //        {type : 'max', name: '最大值'},
                        //        {type : 'min', name: '最小值'}
                        //    ]
                        //},
                        markLine: {
                            data: [
                                { type: 'average', name: '平均值' }
                            ]
                        }
                    },
                    {
                        name: '环比订单量',
                        type: 'line',
                        data: zhexiantu2,
                        //markPoint : {
                        //    data : [
                        //        {name : '周最低', value : -2, xAxis: 1, yAxis: -1.5}
                        //    ]
                        //},
                        markLine: {
                            data: [
                                { type: 'average', name: '平均值' }
                            ]
                        }
                    }
                ]
            };

            myChart.setOption(option);
        }
        function setBingTu(name, valueArr, nameArr) {
            var option2 = {
                color: [
                    '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
                    '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
                    '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
                    '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
                ],
                //tooltip: {
                //    trigger: 'item',
                //    formatter: "{a} <br/>{b}: {c} ({d}%)"
                //},
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data: nameArr
                },
                series: [
                    {
                        name: '店铺',
                        type: 'pie',
                        radius: ['50%', '70%'],
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
                        data: valueArr
                    }
                ]
            };
            myChart2.setOption(option2);
        }
        //获取了能.流失的客户
        function getLostCustomer () {
            var sendData = {
                dateType: $scope.dayType,
                salesmanName: $('#selectBySales').val(),
                sortType: "1",
                type: "1"
            }
            console.log(sendData);
            erp.postFun('erp/analysis/customers',JSON.stringify(sendData),function (data) {
                // console.log(data.data);
                if(data.data.statusCode == '200'){
                    $scope.customerList2 = data.data.result.userList;
                    console.log($scope.customerList);
                }
            },function () {},{layer:true})
        }
        //筛选业务员
        $('#selectBySales').change(function () {
            getLostCustomer();
        })
        $scope.isFirstLosted = true;
        //改变流失用户子tab
        $scope.changeLostType = function (type) {
            $scope.lostType = type;
            console.log($scope.lostType);
            if(type == 2){
                if($scope.isFirstLosted){
                    $scope.isFirstLosted = false;
                    $scope.dayType2 = '1';
                    $scope.pageNumlosted = '1';
                    $scope.pageSizelosted = '20';
                    $scope.lostedSearchInfo = '';
                    getlostedCustomerList();
                }
            }
        }
        $scope.changeDayType2Fun = function (type) {
            $scope.dayType2 = type;
            $scope.pageNumlosted = '1';
            getlostedCustomerList();
        }
        //改变可能流失客户的时间筛选选项
        $scope.changeDayTypeFun = function (type) {
            $scope.dayType = type;
            getLostCustomer();
        }
        //获取已流失客户列表
        function getlostedCustomerList () {
            var sendData = {
                dateType: $scope.dayType2,
                pageNum: $scope.pageNumlosted,
                pageSize: $scope.pageSizelosted,
                salesmanName: $scope.lostedSearchInfo
            }
            erp.postFun('erp/analysis/getLossCustomer',JSON.stringify(sendData),function (data) {
                console.log(data.data);
                if (data.data.statusCode == '200') {
                    console.log(data.data.result);
                    var list = data.data.result.userList;
                    $scope.lostedList = list;
                    $scope.LostTotalCounts= data.data.result.count;
                    pageFunlosted();
                } else {
                    layer.msg('获取已流失客户列表失败')
                }
            },function () {}, {layer:true})
        }
        //分页
        function pageFunlosted() {
            // console.log($scope.customerList.total, $scope.pagesize, $scope.pagenum);
            $(".pagegroupLosted").jqPaginator({
                totalCounts: $scope.LostTotalCounts || 1,
                pageSize: $scope.pageSizelosted * 1,
                visiblePages: 5,
                currentPage: $scope.pageNumlosted * 1,
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
                    
                    $scope.pageNumlosted = n + '';
                    // $("#pagination-demo-text").html("当前第" + n + "页");
                    getlostedCustomerList();
                }
            });
        }
        $scope.searchLostedFun = function () {
            $scope.pageNumlosted = '1';
            getlostedCustomerList();
        }
        //更换每页多少条数据
        $scope.pagechangelosted = function (pagesize) {
            $scope.pageNumlosted = '1';
            getlostedCustomerList();
        };
 
        //手动输入页码GO跳转
        $scope.pagenumchangelosted = function () {
            if($scope.pageNumlosted === ''){
                $scope.pageNumlosted = '1';
            }
            var pagenum = Number($scope.pageNumlosted);
            var totalpage = Math.ceil($scope.LostTotalCounts / $scope.pageSizelosted);
            if (pagenum > totalpage) {
                layer.msg('错误页码');
                $scope.pageNumlosted = '1';
            } else {
                getlostedCustomerList();
            }
        };
        $scope.classlostedEmpty = function (item) {
            if (item) {
                return item;
            } else {
                return '--';
            }
        }
        $scope.classLostedVip = function (type) {
            if(type == '0'){
                return '小客户';
            }else if(type == '1'){
                return 'VIP';
            }else if(type == '2'){
                return '需吃透';
            }else if(type == '3'){
                return '需跟进';
            }
        }//2 需吃透  3 需跟进
        //改变客户类型
        $scope.changeVIPlosted=function(type,item){
            console.log(item);
            var id = item.id;
            var name = item.login_name;
            $scope.customerID = id;
            $scope.customerName = name;
            $scope.customerChangeType= type;
            $('.VIPzzc').show();
            console.log(name,id);

        }

        $scope.guanlian = false;
        $scope.excl = false;
        $scope.lookPackFlag = false;

        var stat = $('#onlineStatus').val();
        console.log(stat);
        $scope.onlineStatus = stat;
        // 列表状态码
        $scope.status = 'all'; // 是否邮箱验证的账号
        //分页参数
        $scope.pagenum = "1";
        $scope.pagesize = "20";
        $scope.sort = "desc";
        $scope.sortField = 'a.CREATE_DATE'
        $scope.startTime = '';
        $scope.endTime = '';
        $scope.searchinfo = '';
        $scope.dataType='';
        $scope.customerdata = {
            normal: 0,
            black: 0,
            needaudit: 0,
            nopass: 0,
            shop: 0,
            affUserNum: 0
        };
        $scope.salesmanid = '';
        $scope.ownerName = 'all';
        //onlineStatus
        $scope.sendData = {
            discount: "",
            freightdiscount: ''
        };
        $scope.exlData = {
            discount: "",
            freightdiscount: ''
        };
        getAllSalesman();
        getempbyname()
        function getAllSalesman() {
            erp.postFun("app/account_erp/getAllSalesman", { ownerName: '' }, function (data) {

                var data = JSON.parse(data.data.result);
                console.log(data);
                $scope.ownerList = data;
            }, function (err) { })
        }
        function getempbyname(){
            erp.postFun('app/employee/getempbyname', { "data": "{'name':'', 'job': '销售'}" }, function (n) {
                var obj = JSON.parse(n.data.result)
                console.log(obj)
                $scope.ywList = obj.list
            }, function () {})
        }
        //根据业务员搜索
        $scope.searchByYwy = function () {
            $scope.pagenum = 1
            getcustomerList()
        }
        //根据群主搜索
        $scope.searchByOwner = function () {
            $scope.pagenum = 1
            getcustomerList()
        }
        $scope.searchByFrom = () => {
            $scope.pagenum = 1
            getcustomerList()
        }
        // 获取客户列表
        function getcustomerList(scrollFlag) {
	        $scope.needOptimisation = false;
	        var data = {
                page: $scope.pagenum,
                dayTime: $scope.dayTime || '',
                limit: $scope.pagesize,
                sort: $scope.sort,
                sortField : $scope.sortField,
                name: $scope.searchinfo,
                onlineStatus: $scope.onlineStatus || '',
                salesmanSearch: $scope.salesmanid || '',
                ownerName: $scope.ownerName === 'all' ? '' : $scope.ownerName,
                startTime: $scope.startTime,
                endTime: $scope.endTime,
	              type: $scope.dataType || $scope.dataType === 0 ? $scope.dataType + '' : '',
	              sourceVip:$scope.sourceVip,
                sourceType:$scope.sourceType||'',
	              vipType:$scope.vipType ? $scope.vipType.toString() : ''
            }
	          console.log(data)
            console.log('kehuliebiao',$routeParams.type);
            if($routeParams.type == 2){
              $scope.isCodkehu = true;
              data.codStatus = 1; // 0:审核未通过,1:正常,2:锁定(删除),3:注册(待审核)
              data.accountType = 2; // 1:cj客户 2:cod用户
            }else{
              data.status = $scope.status;
            }
            var sendData = {
                data: JSON.stringify(data)
            }
            erp.load();
            erp.postFun("app/account_erp/pageQuery", JSON.stringify(sendData), function (n) {
                console.log('1111');
                erp.closeLoad();
                // console.log(n)
                var obj = JSON.parse(n.data.result);
                $scope.totalNum = obj.total;
                if (obj.total == 0) {
                    $scope.totalpage = 0;
                    $scope.customerList = [];
                    layer.msg(gjh27);
                    document.documentElement.scrollTop = 0
                    return;
                }
                // settleListData ($scope,obj);
                $scope.customerList = obj;
                console.log($scope.customerList);
                $scope.totalpage = Math.ceil(($scope.customerList.total) / ($scope.pagesize));
                console.log($scope.dataType);
                pageFun();
                getPayOrderCountByAccId($scope.customerList.list)
                if(!scrollFlag){
                    document.documentElement.scrollTop = 0
                }
                // !scrollFlag && document.documentElement.scrollTop = 0
            }, function () {
                erp.closeLoad();
            });
        }
        /** 2019-12-19 新增获取直发订单数量接口 */
        function getPayOrderCountByAccId(list = []) {
            let str = ''
            list.forEach((item, idx) => {
                str += `${idx === 0 ? '' : ','}'${item.id}'`
            })
            const params = {
                accIds: str
            }
            erp.postFun('app/account/getPayOrderCountByAccId', JSON.stringify(params), ({data}) => {
                const { statusCode, result } = data
                if (statusCode === '200') {
                    const list = result ? JSON.parse(result) : []
                    console.log(list)
                    $scope.customerList.list = $scope.customerList.list.map(item => {
                        list.forEach(_ => {
                            if(_.MERCHANTN_NUMBER === item.id) item.zfCount = _.count
                        })
                        return item
                    })
                }
            }, _ => layer.msg('System error, please try again later'), { layer: true })
        }
        //分页
        function pageFun() {
            console.log($scope.customerList.total, $scope.pagesize, $scope.pagenum);
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.customerList.total || 1,
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
                    };
                    erp.load();
                    $scope.pagenum = n + '';
                    // $("#pagination-demo-text").html("当前第" + n + "页");
                    getcustomerList();
                }
            });
        }
        /**查看包装图片 */
        $scope.lookPackPicFun = function (type,item) {
            $scope.curRukouType = type;
            if(type==1){
                $scope.lookPackFlag = true;
                $scope.packPicList = [];
                $scope.delBzStu = 0;
                //查看店铺
                var sendData = {
                    accountId: $scope.accountID
                }
                erp.load();
                erp.postFun('pojo/accountPack/queryShopPackByAccount',JSON.stringify(sendData),function(data){
                    erp.closeLoad();
                    console.log(data.data);
                    if(data.data.statusCode == '200'){
                        var result = JSON.parse(data.data.result);
                        console.log(result);
                        console.log($scope.cusStoreVal);
                        
                        if($scope.cusStoreVal == '' || $scope.cusStoreVal == null || $scope.cusStoreVal == undefined){
                            //所有店铺、
                            $.each(result,function(i,v){
                                var arr = JSON.parse(v.imgs);
                                let remark = v.remark;
                                let id = v.id;
                                let name = v.name;
                                let shopId = v.shopId;
                                let pid = v.pid;
                                let accountId = v.accountId;
                                $.each(arr,function(j,k){
                                    console.log(j,k)
                                    var data = {
                                        image:k,
                                        remark:remark,
                                        id:id,
                                        shopName: name,
                                        shopId: shopId,
                                        pid: pid,
                                        accountId: accountId
                                    }
                                    $scope.packPicList.push(data);
                                })
                            })
                        }else{
                            $.each(result,function(i,v){
                                if(v.id == $scope.cusStoreVal){
                                    let remark = v.remark;
                                    let id = v.id;
                                    let name = v.name;
                                    let shopId = v.shopId;
                                    let pid = v.pid;
                                    let accountId = v.accountId;
                                    var arr = JSON.parse(v.imgs);
                                    $.each(arr,function(j,k){
                                        var data = {
                                            image:k,
                                            remark:remark,
                                            shopId:id,
                                            shopName: name,
                                            shopId: shopId,
                                            pid: pid,
                                            accountId: accountId
                                        }
                                        $scope.packPicList.push(data);
                                    })
                                }
                            })
                        }
                        console.log($scope.packPicList);
                    }
                },function(){
                    erp.closeLoad();
                });

            }else if(type==2){
                // console.log(item);
                // if($scope.cusStoreVal == '' || $scope.cusStoreVal==null || $scope.cusStoreVal==undefined){
                //     layer.msg('请选择店铺');
                //     return;
                // }
                $scope.packPicList = [];
                $scope.lookPackFlag = true;
                $scope.delBzStu = 1;
                $scope.productId = item.id;
                console.log(item)
                var sendData = {
                    accountId: $scope.accountID,
                    pid: item.id,
                    shopId: $scope.cusStoreVal || ''
                }
                // console.log(sendData);
                erp.load();
                erp.postFun('pojo/accountPack/queryPackByPro',JSON.stringify(sendData),function(data){
                    erp.closeLoad();
                    // console.log(data.data);
                    if(data.data.statusCode=='200'){
                        var result = JSON.parse(data.data.result);
                        console.log(result);
                        $.each(result,function(i,v){
                            var arr = JSON.parse(v.IMGS);
                            let remark = v.remark;
                            let pid = v.pid;
                            let shopId = v.shopId;
                            let accountId = v.accountId;
                            $.each(arr,function(j,k){
                                var data = {
                                    image:k,
                                    remark: remark,
                                    pid: pid,
                                    shopId: shopId,
                                    accountId: accountId
                                }
                                $scope.packPicList.push(data);
                            })
                        })
                        console.log($scope.packPicList);
                    }
                },function(){
                    erp.closeLoad();
                })
            }
        }
        $scope.delBzImgFun = function(item,index){
            $scope.delBzFlag = true;
            $scope.itemIndex = index;
            $scope.itemShopId = item.shopId;
            $scope.itemObj = item;
        }
        $scope.sureDelBzFun = function(){
            console.log($scope.productId)
            console.log($scope.delBzStu)
            console.log($scope.itemObj)
            let upJson = {};
            if($scope.itemObj.pid=='all'&&$scope.itemObj.shopId=='all'){//客户包装
                upJson.type = 2;
            }else if($scope.itemObj.pid=='all'&&$scope.itemObj.shopId&&$scope.itemObj.shopId!='all'){//店铺包装
                upJson.type = 0;
                upJson.shopId = $scope.itemShopId;
                if($scope.curRukouType==2){//商品进入删除店铺包装
                    upJson.pid = $scope.productId;
                }
            }else if($scope.itemObj.pid&&$scope.itemObj.pid!='all'){//商品包装
                upJson.type = 1;
                upJson.pid = $scope.productId;
            }
            upJson.accountId = $scope.accountID;
            erp.postFun('pojo/accountPack/delectPack',JSON.stringify(upJson),function(data){
                console.log(data)
                
                if(data.data.result>0){
                    layer.msg(data.data.message)
                    $scope.delBzFlag = false;
                    $scope.lookPackFlag = false;
                }else{
                    layer.msg('删除失败')
                }
            },function(data){
                console.log(data)
            },{layer:true})
        }
        $scope.openPIC = function (pic) {
            window.open(pic,'_blank','');
        }

        //** */
        $scope.classVIP=function(vip){
            if(vip=='0'){
                return '小客户';
            }else if(vip=='1'){
                return 'VIP';
            }else if(vip=='2'){
                return '需吃透';
            }else if(vip=='3'){
                return '需跟进';
            } else {
                return '小客户'
            }
        }
        //改变客户类型
        $scope.changeVIP=function(type,item){
            // console.log(item);
            if (type === 1 && $scope.userJob !== '管理') {
                layer.msg('请联系管理来设置VIP')
            } else {
                var id = item.id;
                var name = item.NAME;
                $scope.customerID = id;
                $scope.customerName = name;
                $scope.customerChangeType= type;
                $('.VIPzzc').show();
                console.log(name,id);
            }
            

        }

      //客户详情
      $scope.turnOndetailStatistics=function(item){
        var id = item.id;
        erp.postFun('app/account_erp/detailStatistics',JSON.stringify(item),function(data){
          if (data.data.statusCode === '200') {
            var result = JSON.parse(data.data.result)
            item.inventorys =result.inventorys;
            item.autanum =result.autanum;
            $scope.detailItem = item;
            $scope.detailInventorys = result.inventorys;
            $scope.detailAutanum= result.autanum;
            $('.detail').show();
            console.log(name,id);

          }else{
            layer.msg('查看详情失败')
          }
        },function(){
          erp.closeLoad();
          layer.msg('网络错误');
        });

      }

      $scope.closeDetailStatistics=function(){
        $scope.customerName = '';
        $scope.customerChangeType= '';
        $('.detail').hide();
      }

        $scope.closeVIPWrap=function(){
            $('#vipRemark').val('');
            $scope.customerID = '';
            $scope.customerName = '';
            $scope.customerChangeType= '';
            $('.VIPzzc').hide();
        }
        $scope.sureChangeVIP=function(){
            var sendData= {
                id:$scope.customerID,
                type:$scope.customerChangeType,
                remark:$('#vipRemark').val()
            }
            // console.log(sendData);
            erp.load();
            erp.postFun('erp/accAssign/setVip',JSON.stringify(sendData),function(data){
                erp.closeLoad();
                if (data.data.result > 0) {
                    layer.msg('设置成功');
                    $('#vipRemark').val('');
                    $scope.customerID = '';
                    $scope.customerName = '';
                    $scope.customerChangeType= '';
                    $('.VIPzzc').hide();
                    if($scope.cuStatus == 'lost'){
                        getlostedCustomerList();
                    }else{
                        getcustomerList();
                    }
                    
                }else{
                    layer.msg('设置失败')
                }
            },function(){
                erp.closeLoad();
                layer.msg('网络错误');
            });
        }
        /**/
        //点击左侧导航栏刷新页面
        $scope.refresh = function () {
            window.location.reload();
        }
        $scope.private = false;
        // $scope.edit=false;
        // getList(erp, $scope);
        //getcustomerList();

        $('#onlineStatus').change(function () {
            var stat = $(this).val();
            $scope.pagenum = '1';
            $scope.onlineStatus = stat;
            // getList(erp, $scope);
            getcustomerList();
        });//
        //置为vip
        $scope.szVipFun = function (item, index) {
            if (item.vip == 1) {
                //layer.msg('该客户已经是VIP')
                //return
                $scope.vipMsg = '你确定要取消该客户的Vip吗?';
                $scope.vipFlag2 = '1';
            } else {
                $scope.vipMsg = '你确定要把该客户设置为Vip客户吗?';
                $scope.vipFlag2 = '0';
            }
            $scope.itemIndex = index;
            $scope.itemCusId = item.id;
            $scope.szVipFlag = true;
        }
        $scope.sureSzVipFun = function () {
            erp.load();
            erp.postFun('erp/accAssign/setVip', {
                id: $scope.itemCusId,
                flag: $scope.vipFlag2
            }, function (data) {
                console.log(data)
                $scope.szVipFlag = false;
                layer.closeAll('loading')
                if (data.data.result > 0) {
                    if ($scope.vipFlag2 == '1') {
                        $scope.customerList.list[$scope.itemIndex].vip = 0;
                    } else {
                        $scope.customerList.list[$scope.itemIndex].vip = 1;
                    }

                } else {
                    layer.msg('设置失败')
                }
            }, function (data) {
                console.log(data)
                layer.closeAll('loading')
            })
        }
        //全选 单选
        var cmuIndex = 0;
        $('.right-bar-wrap').on('click', '.c-mu-allchekbox', function () {
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
                    $('.right-bar-wrap .c-mu-allchekbox').attr('src', 'static/image/order-img/multiple2.png');
                }
            } else {
                $(this).attr('src', 'static/image/order-img/multiple1.png');
                cmuIndex--;
                if (cmuIndex != $('#c-mu-ord .c-mu-chekbox').length) {
                    $('.right-bar-wrap .c-mu-allchekbox').attr('src', 'static/image/order-img/multiple1.png');
                }
            }
        })
        $scope.isTimeFlag = false;
        $scope.dayTimeFun1 = function (ev) {
            if ($(ev.target).hasClass('day-time-act')) {
                $(ev.target).removeClass('day-time-act');
                $scope.dayTime = '';
                // getList(erp, $scope);
                $scope.isTimeFlag = false;
                $('#c-mu-ord .c-mu-allchekbox').attr('src', 'static/image/order-img/multiple1.png');
            } else {
                $('.day-time-span').removeClass('day-time-act');
                $(ev.target).addClass('day-time-act')
                $scope.dayTime = '1';
                $scope.isTimeFlag = false;
            }
            $scope.startTime = '';
            $scope.endTime = '';
            $('#c-data-time2').val('');
            $('#cdatatime3').val('');
            // getList(erp, $scope);
            $scope.pagenum = '1';
            getcustomerList();
        }
        $scope.dayTimeFun3 = function (ev) {
            if ($(ev.target).hasClass('day-time-act')) {
                $(ev.target).removeClass('day-time-act');
                $scope.dayTime = '';
                $scope.isTimeFlag = false;
                $('#c-mu-ord .c-mu-allchekbox').attr('src', 'static/image/order-img/multiple1.png');
            } else {
                $('.day-time-span').removeClass('day-time-act');
                $(ev.target).addClass('day-time-act')
                $scope.dayTime = '2';
                $scope.isTimeFlag = false;
            }
            $scope.startTime = '';
            $scope.endTime = '';
            $('#c-data-time2').val('');
            $('#cdatatime3').val('');
            $scope.pagenum = '1';
            // getList(erp, $scope);
            getcustomerList();
        }
        //获取店铺
        $scope.shopget = function (id) {
          if(!$scope.isCaiwuFlag) {
            localStorage.setItem('shopuserId', b.encode(id.id));
            location.href = 'manage.html#/erpcustomer/erpshop'
          }
          
        };
        //shenhes点击姓名进入详情
        $scope.shenhe = function (item) {
            if(!$scope.isCaiwuFlag) {
                if($routeParams.type == 2){
                    window.open('manage.html#/erpcustomer/customer-detail/' + item.id + '/' + $scope.status + '?cod=3', '_blank', '');
                  }else{
                    window.open('manage.html#/erpcustomer/customer-detail/' + item.id + '/' + $scope.status, '_blank', '');
                  }
            }
          
        }
        //分页相关
        $scope.pagesize = '20';
        $scope.pagenum = '1';

        $scope.pagenumarr = [10, 20, 30, 50];
        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            // $scope.pagesize=pagesize-0;
            // $scope.limit = $scope.pagesize;
            $scope.pagenum = '1';
            // getList(erp, $scope);
            getcustomerList();
        }

        $scope.pagenumchange = function () {
            console.log($scope.pagenum % 1)
            // $scope.pagenn = $(".goyema").val();
            console.log($scope.pagenum, $scope.totalpage, $scope.pagenum > $scope.totalpage)
            if (($scope.pagenum < 1) || ($scope.pagenum > $scope.totalpage)) {
                alert(gjh29)
            } else {
                // getList(erp, $scope);
                getcustomerList();
            }
        }
        //升序排列
        $scope.wllSort1 = function () {
            console.log("aa升序")
            $scope.sort = "asc";
            $scope.sortField = 'a.CREATE_DATE'
            // getList(erp, $scope);
            getcustomerList();
        }
        //降序排列
        $scope.wllSort2 = function () {
            console.log("bb降序")
            $scope.sort = "desc";
            $scope.sortField = 'a.CREATE_DATE'
            // getList(erp, $scope);
            getcustomerList();
        }

        // 总销售额排序
        $scope.changeTotalReturnsSort = function(val){
        //    $scope.totalReturnsSort = $scope.totalReturnsSort=='asc'?'desc':'asc'
           $scope.totalReturnsSort = val
           $scope.sort = $scope.totalReturnsSort
           $scope.sortField = 'totalReturns'
           getcustomerList()
        }

        //搜索客户
        $scope.searchcustomer = function () {
            serachFun();
        }
        //按下enter搜索
        $scope.enterSearch = function (event) {
            if (event.keyCode === 13 || event.keyCode === 108) {
                serachFun();
            }
        }
        function serachFun() {
            console.log('搜索条件', $scope.searchinfo);
            $scope.searchinfo = $scope.searchinfo;
            $scope.pagenum = '1';
            var startTime = $('#c-data-time2').val();
            var endTime = $('#cdatatime3').val();
            if (startTime == '' || startTime == null || startTime == undefined) {
                $('#c-data-time2').val('');
                $('#cdatatime3').val('');
                $scope.startTime = '';
                $scope.endTime = '';
            } else {
                $scope.startTime = startTime;
                $scope.dayTime = '';
                $('.day-time-act').removeClass('day-time-act');
                if (endTime == '' || endTime == null || endTime == undefined) {
                    var newDate = new Date();
                    var year = newDate.getFullYear();
                    var month = newDate.getMonth() + 1;
                    var day = newDate.getDate();
                    if (month < 10) {
                        month = '0' + month;
                    }
                    if (day < 10) {
                        day = '0' + day;
                    }
                    endTime = year + '-' + month + '-' + day;
                }
                $scope.endTime = endTime;
            }
            // getList(erp, $scope);
            getcustomerList();
        }
        
				
		    // 指定包装
		    $scope.handleDesPackage = function (item) {
			    console.log(item)
			    $scope.proSearch = ''
			    $scope.shopId = ''
			    $scope.packageSearch = ''
			    $scope.packageType = '1' // 指定包装类型 1 商品 2店铺
			    $scope.productList = [] // 商品数据
			    $scope.packgeList = [] // 包装数据
			    $scope.storeList = [] // 店铺数据
			    $scope.relatedList = [] // 关联的包装数据
			    $scope.isUseOrder = '0' // 是否使用于订单
			    $scope.remark = ''
			    $scope.packageModal = true
			    $scope.itemData = item
			    getStoreData(item.id)
		    }
		
		    // 获取店铺
		    function getStoreData(accountId) {
			    erp.postFun('pojo/accountPack/getShopByAccount', {
				    "accountId": accountId
			    }, function (data) {
				    $scope.storeList = JSON.parse(data.data.result);
				    console.log($scope.storeList)
			    }, function (data) {
			    })
		    }
		    
		    // 搜索商品
	      $scope.handleProductSearch = () =>{
        	const params = {
		        inputStr: $scope.proSearch,
		        accountId: $scope.itemData.id
	        }
        	layer.load(2)
		      erp.postFun('app/sourcing/searchProduct', params, ({data}) =>{
		      	layer.closeAll('loading')
			      if (data.statusCode === '200'){
				      $scope.productList = JSON.parse(data.result).products || []
				      if ($scope.productList.length > 0) {
					      $scope.proShopId = $scope.productList[0].shopId
				      } else {
					      layer.msg('仅能搜索该客户已经关联的商品/变体，如有需要建议先行关联商品')
				      }
			      }else {
				      layer.msg(data.message)
			      }
		      }, err => console.log(err))
	      }
	
		    // 搜索包装商品
		    $scope.handlePackageSearch = () =>{
			    layer.load(2)
			    erp.postFun('erp/PackProduct/search', {"sku": $scope.packageSearch}, ({data}) =>{
				    layer.closeAll('loading')
				    if (data.statusCode === '200'){
					    $scope.packgeList = data.result || []
				    }else {
					    layer.msg(data.message)
				    }
			    }, err => console.log(err))
		    }
		    
		    // 删除关联包装
	      $scope.handleRemove = item => {
		      $scope.relatedList = $scope.relatedList.filter(obj => obj.packVid !== item.packVid)
	      }
	      
	      // 添加关联包装
	      $scope.handleAddPackage = item => {
        	if ($scope.relatedList.find(obj => obj.packVid === item.packVid)){
        		layer.msg('此包装已添加至关联')
		        return
	        }
        	if ($scope.relatedList.length === 5){
		        layer.msg('最多关联5个')
		        return
	        }
		      $scope.relatedList = [...$scope.relatedList , item]
		      console.log($scope.relatedList)
	      }
	    
	      // 指定包装 - 确定
	      $scope.handlePackageConfirm = () =>{
        	if ($scope.packageType === '1' && $scope.productList.length === 0){
        		layer.msg('请先搜索商品')
        		return
	        }
		      if ($scope.packageType === '2' && !$scope.shopId){
			      layer.msg('请先选择店铺')
			      return
		      }
		      if ($scope.relatedList.length === 0){
			      layer.msg('请添加关联包装')
			      return
		      }
        	const params = {
		        accountId: $scope.itemData.id,
		        accountName: $scope.itemData.LOGIN_NAME,
		        shopId: $scope.packageType === '1' ? $scope.proShopId : $scope.shopId,
		        pid: $scope.productList.length > 0 ? $scope.productList[0].id : undefined,
		        remark: $scope.remark,
		        packList: $scope.relatedList.map(o => ({
			        packVid: o.packVid,
			        packKey: o.packKey,
			        matchingType: $scope.isUseOrder,
		        })),
	        }
		      layer.load(2)
		      erp.postFun('erp/accountPack/bind', params,({data}) =>{
		      	layer.closeAll('loading')
			      if (data.statusCode === '200'){
				      layer.msg('操作成功')
				      $scope.packageModal = false
			      }else {
				      layer.msg(data.message)
			      }
		      }, err => console.log(err))
	      }
	
	
	
		    //指定包装 (原指指定包装功能代码)
		    $scope.zdbzSeaFun = function () {
			    if ($scope.zdbzSeaVal) {
				    erp.postFun('app/sourcing/sourceGetProduct', {
					    'inputStr': $scope.zdbzSeaVal
				    }, function (data) {
					    console.log(data)
					    if (data.data.statusCode == 200) {
						    var result = JSON.parse(data.data.result)
						    $scope.pList = result.products;
					    }
				    }, function (data) {
					    console.log(data)
				    })
			    } else {
				    layer.msg('请输入查询内容')
			    }
		    }
		    $scope.imgArr = [];
		    $scope.upLoadImg4 = function (files) {
			    erp.ossUploadFile($('#uploadInp')[0].files, function (data) {
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
						    $scope.imgArr = [];//12-11 指定包装只能上传一张
						    $scope.imgArr.push(result[j]);
						    $('#uploadInp').val('');
					    }
				    }
				    console.log($scope.imgArr)
				    $scope.$apply();
			    })
		    }
		    $scope.packArr = [];
		    $scope.getPackingInfo = function ($event) {
			    var currentCheckbox = $($event.target);
			    // console.log(currentCheckbox.prop('checked'))
			    if (currentCheckbox.prop('checked')) {
				    $scope.packArr.push(currentCheckbox.attr('name'));
			    } else {
				    console.log($.isArray(currentCheckbox, $scope.packArr))
				    console.log(currentCheckbox)
				    $scope.packArr.splice($.inArray(currentCheckbox.attr('name'), $scope.packArr), 1);
			    }
			    console.log($scope.packArr)
		    }
		    var pid = '';
		    var accountId = '';
		    var accountName = '';
		    $scope.optionSelFun = function (ev, item) {
			    if ($(ev.target).attr('src') == 'static/image/public-img/radiobutton1.png') {
				    $('.ipn-option').attr('src', 'static/image/public-img/radiobutton1.png');
				    $(ev.target).attr('src', 'static/image/public-img/radiobutton2.png')
				    pid = item.id;
			    }
			    console.log(pid)
			    console.log(accountName)
		    }
		    $scope.openBzFun = function (item) {
			    console.log(item)
			    $scope.zdbzSeaVal = '';
			    $scope.pList = [];
			    $scope.bzFlag = true;
			    accountId = item.id;
			    $scope.accountID = item.id;
			    accountName = item.LOGIN_NAME;
			    if (item.shopNum > 0) {
				    $scope.isStoreFlag = true;
				    erp.postFun('pojo/accountPack/getShopByAccount', {
					    "accountId": item.id
				    }, function (data) {
					    console.log(data)
					    $scope.cusStoreList = JSON.parse(data.data.result);
				    }, function (data) {
					    console.log(data)
				    })
			    } else {
				    $scope.isStoreFlag = false;
			    }
		    }
		    $scope.closeBzFun = function () {
			    $scope.bzFlag = false;
			    $scope.imgArr = [];
			    $scope.cusStoreVal = '';
		    }
		    $scope.deletImgFun = function (index) {
			    $scope.imgArr.splice(index, 1)
		    }
		    //提交指定的包装
		    $scope.sureZdBzFun = function () {
			    if ($scope.packArr.length < 1) {
				    layer.msg('请指定包装');
				    return;
			    }
			    if ($scope.imgArr.length < 1) {
				    layer.msg('请上传包装图片');
				    return;
			    }
			    if (!accountId) {
				    layer.msg('没有客户id');
				    return;
			    }
			    console.log($scope.cusStoreVal)
			    layer.load(2)
			    var upBzData = {};
			    upBzData.pid = pid;
			    upBzData.accountId = accountId;
			    upBzData.shopId = $scope.cusStoreVal;
			    upBzData.accountName = accountName;
			    upBzData.packKey = $scope.packArr;
			    upBzData.imgs = $scope.imgArr;
			    upBzData.remark = $scope.bzRemark;
			    erp.postFun('pojo/accountPack/addByAccount', JSON.stringify(upBzData), function (data) {
				    console.log(data)
				    layer.closeAll('loading')
				    if (data.data.statusCode == 200) {
					    layer.msg('成功')
					    $scope.bzFlag = false;
					    $scope.imgArr = [];
					    $scope.cusStoreVal = '';
					    $scope.bzRemark = '';
					    pid = '';
					    $scope.cusStoreVal = '';
					
				    } else {
					    layer.msg('失败')
				    }
			    }, function (data) {
				    layer.closeAll('loading')
				    console.log(data)
			    })
		    }
        

        $scope.privateRecord = function (item) {
            if(!item.inventorys) {
                return;
            }
            $scope.$broadcast('customer-list', {
                flag: 'show-private-record',
                customer: item
            })
        }

        $scope.guanlianshangpinNew = function (item) {
            $scope.$broadcast('customer-list', {
                flag: 'show-customer-connected',
                customer: item
            })
        }
        $scope.skulistshangpinNew = function (item) {
            $scope.$broadcast('customer-list', {
                flag: 'show-customer-skulist',
                customer: item
            })
        }
        $scope.privatecomNew = function (item) {
            $scope.$broadcast('customer-list', {
                flag: 'show-customer-private',
                customer: item
            })
        }

        //员工
        $scope.embul = false;
        $scope.empname = '';
        //员工的input框点击
        $scope.empchange = function () {
            console.log($scope.empname)
            erp.postFun("app/account_erp/getAllSalesman", { ownerName: $scope.empname }, function (data) {
                var data = JSON.parse(data.data.result);
                console.log(data);
                $scope.embul = true;
                $scope.emblist = data;
                // $scope.ownerList = data;
            }, function (err) { })
        }

        //点击下拉框中的内容
        $scope.getemp = function (item) {
            console.log(item)
            $scope.empname = item.relate_salesman;
            $scope.embul = false;
            $scope.emp = item;
        }
        //客户
        $scope.clientul = false;
        $scope.clientname = '';
        $scope.clientchange = function () {
            console.log($scope.clientname)
            erp.postFun('app/account/getaccbyname', { "data": "{'name':'" + $scope.clientname + "'}" }, function (n) {
                var obj = JSON.parse(n.data.result)
                console.log(obj)
                $scope.clientul = true;
                $scope.clientlist = obj.list;
            }, err)
        }
        $scope.getclient = function (item) {
            console.log(item)
            $scope.clientname = item.LOGIN_NAME;
            $scope.client = item;
        }
        //提交
        $scope.submit = function () {
            // if (!$scope.emp) {
            //     layer.msg(gjh17);
            //     return;
            // }
            console.log($scope.empname)
            if (!$scope.empname) {
                layer.msg('请选择业务员');
                return;
            }
            var selCount = 0;
            var khIds = '';
            $('#c-mu-ord .c-mu-chekbox').each(function () {
                if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
                    khIds += $(this).siblings('.hide-order-id').text() + ',';
                    selCount++;
                }
            })
            if (selCount < 1) {
                layer.msg('请选择客户')
                return
            }
            console.log(khIds)
            erp.postFun('app/account/updatebyname', { "data": "{'empId':'" + $scope.emp.salesmanid + "','empName':'" + $scope.emp.relate_salesman + "','id':'" + khIds + "'}" }, function (n) {
                layer.msg(n.data.message);
                if (n.data.statusCode == 200) {
                    $scope.add = false;
                }
                // getList(erp, $scope);
                getcustomerList(true);
            }, err)
        }
        console.log('客户列表')
        //导出
        var selIds = '';
        $scope.daoChuFun = function () {
            // selIds = '';
            // var selCount = 0;
            // $('#c-mu-ord .c-mu-chekbox').each(function () {
            //     console.log($(this).attr('src'))
            //     if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
            //         selCount++;
            //         selIds += $(this).siblings('.hide-order-id').text() + ',';
            //     }
            // })
            // if (selCount < 1) {
            //     layer.msg('请选择客户')
            //     return;
            // }
            // else {
            //     $scope.daoChuFlag = true;
            // }
            erp.load();
            var dcJson = {};
            dcJson.data = {};
            // dcJson.ids = {};
            dcJson.data.page = $scope.pagenum;
            dcJson.data.dayTime = $scope.dayTime || '';
            dcJson.data.limit = $scope.pagesize;
            dcJson.data.sort = $scope.sort;
            dcJson.data.sortField = $scope.sortField;
            dcJson.data.name = $scope.searchinfo;
            dcJson.data.onlineStatus = $scope.onlineStatus || '';
            dcJson.data.salesmanSearch = $scope.salesmanid || '';
	          dcJson.data.ownerName = $scope.ownerName === 'all' ? '' : $scope.ownerName;
	          dcJson.data.sourceType = $scope.sourceType || '',
		        dcJson.data.startTime = $scope.startTime || '';
            dcJson.data.endTime = $scope.endTime || '';
            if($routeParams.type == 2){
              dcJson.data.codStatus = 1; // 0:审核未通过,1:正常,2:锁定(删除),3:注册(待审核)
              dcJson.data.accountType = 2; // 1:cj客户 2:cod用户
            }else{
              dcJson.data.status = $scope.status;
            }
            // dcJson.ids = selIds;
            dcJson.data = JSON.stringify(dcJson.data)
            console.log(dcJson)
            erp.postFun("app/client_erp/exportAccountErpAll", JSON.stringify(dcJson), function (data) {
                console.log(data)
                erp.closeLoad()
                if (data.data.statusCode == 200) {
                    console.log(data.data.result)
                    var result = JSON.parse(data.data.result)
                    $scope.excelLink = result.href;
                    $scope.daoChuFlag = true;
                } else {
                    if (data.data.message) {
                        layer.msg(data.data.message)
                    } else {
                        layer.msg('导出失败')
                    }
                }
            }, function (data) {
                console.log(data)
                erp.closeLoad()
            })
        }
        $scope.downExcelFun = function () {
            location.href = $scope.excelLink;
            $scope.daoChuFlag = false;
        }
        $scope.closeExcelFun = function () {
            $scope.daoChuFlag = false;
        }
    }])
    //erp客户--分配客户
    app.controller('fpkhCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        console.log('分配客户')
        var bs = new Base64();
        var logiName = localStorage.getItem('erploginName') ? bs.decode(localStorage.getItem('erploginName')) : '';
        console.log(logiName)
        if (logiName == 'admin') {
            $scope.dcAdminFlag = true;
        } else {
            $scope.dcAdminFlag = false;
        }
        $scope.blurFun = function (type) {
            // type === '1' ? $scope.ywyNameList=[] : $scope.keHuNameList = [];
        }
        $scope.logiName = logiName;
        $scope.bzpYwyFun = function () {
            var getData = {};
            temTimer && clearTimeout(temTimer);
            temTimer = setTimeout(function () {
                getData.name = $scope.bzpywyName;
                console.log(getData)
                erp.postFun('erp/accAssign/getSalesmanByName', JSON.stringify(getData), function (data) {
                    console.log(data)
                    $scope.ywyNameList = data.data.data;
                    console.log($scope.ywyNameList)
                }, function (data) {
                    console.log(data)
                })
            }, 1000);
        }
        // $scope.ywySelFun = function (item) {
        //     $scope.bzpywyName = item.NAME;
        //     $scope.ywyArr = item;
        //     console.log($scope.ywyArr)
        //     $scope.ywyNameList = [];
        // }
        $scope.radioFun = function (ev, item) {
            $('.fil-div-group .radio-btn').attr('src', 'static/image/public-img/radiobutton1.png')
            $(ev.target).attr('src', 'static/image/public-img/radiobutton2.png')
            $scope.bzpywyName = item.NAME;
            $scope.ywyArr = item;
            $scope.ywyNameList = [];
        }
        // $scope.clearFun = function (type) {
        //     type === 1 ? $scope.ywyNameList = [] : $scope.keHuNameList = [];
        
        // }
        // erp.postFun('erp/accAssign/getAccountInfo',{logiName:logiName+''},function (data) {
        //     console.log(data)
        //     $scope.keHuNameList = data.data.data;
        //     console.log($scope.keHuNameList)
        // },function (data) {
        //     console.log(data)
        // })
        var temTimer;
        $scope.keHuFun = function () {
            var getData = {};
            temTimer && clearTimeout(temTimer);
            console.log(1111)
            temTimer = setTimeout(function () {
                getData.loginName = $scope.bzpkhName;
                console.log(getData)
                erp.postFun('erp/accAssign/getAccountInfo', JSON.stringify(getData), function (data) {
                    console.log(data)
                    $scope.keHuNameList = data.data.data;
                    $scope.showKehuList = 1;
                    console.log($scope.keHuNameList)
                }, function (data) {
                    console.log(data)
                })
            }, 1000);
        }
        $scope.chekFun = function (ev, item) {
            console.log($(ev.target).attr('src'))
            if ($(ev.target).attr('src') == 'static/image/order-img/multiple1.png') {
                $(ev.target).attr('src', 'static/image/order-img/multiple2.png');
            } else {
                $(ev.target).attr('src', 'static/image/order-img/multiple1.png');
            }
            var accName = '';
            $('.fpkh-resul .cor-check-box').each(function () {
                if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
                    accName += $(this).siblings('.fpkh-cusname').text() + ',';
                }
            })
            $scope.bzpkhName = accName;
            $scope.showKehuList = 0;
            // $scope.keHuNameList = [];
        }
        $scope.addFpFun = function () {
            var accIds = '';
            $('.fpkh-resul .cor-check-box').each(function () {
                if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
                    accIds += $(this).siblings('.cus-id').text() + ',';
                }
            })
            if (!$scope.ywyArr) {
                layer.msg('请指定业务员')
                return;
            }
            if (!accIds) {
                layer.msg('请指定客户')
                return;
            }
            erp.load()
            var upData = {};
            upData.AccID = accIds;
            upData.PromoterID = $scope.ywyArr.ID;
            upData.PromoterName = $scope.ywyArr.NAME;
            console.log(upData)
            erp.postFun('erp/accAssign/setAccAssign', JSON.stringify(upData), function (data) {
                console.log(data)
                erp.closeLoad()
                if (data.data.data > 0) {
                    layer.msg('授权成功')
                    $scope.pageNum = '1';
                    getListFun()
                    $scope.ywyArr = {};
                    $scope.ywyNameList = [];
                    $scope.keHuNameList = [];
                    $scope.bzpkhName = '';
                    $scope.bzpywyName = '';
                } else if (data.data.code == 401) {
                    layer.msg('不能授权给自己')
                } else {
                    layer.msg('授权失败')
                }
            }, function (data) {
                erp.closeLoad()
                console.log(data)
            })
        }

        $scope.pageSize = '50';
        $scope.pageNum = '1';
        function getListFun() {
            erp.load()
            var fpkhObj = {};
            fpkhObj.page = $scope.pageNum;
            fpkhObj.pageSize = $scope.pageSize;
            fpkhObj.searchName = $scope.searchSku;
            fpkhObj.startTime = $('#left-time').val();
            fpkhObj.endTime = $('#right-time').val();
            erp.postFun('erp/accAssign/getAccEmpInfo', JSON.stringify(fpkhObj), function (data) {
                console.log(data)
                console.log(data.data.data)
                layer.closeAll('loading')
                if (data.data.code == 200) {
                    $scope.listArr = data.data.data.salesmanList;
                    $scope.totalNum = data.data.data.count;
                    pageFun()
                } else {
                    layer.msg('服务器错误')
                }
            }, function (data) {
                console.log(data)
                layer.closeAll('loading')
            })
        }
        function pageFun() {
            if ($scope.totalNum < 1) {
                return
            }
            $(".pagination2").jqPaginator({
                totalCounts: $scope.totalNum * 1,
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
                    erp.load()
                    $scope.pageNum = n + '';
                    getListFun();
                }
            });
        }
        getListFun()
        $('.sku-inp').keypress(function (ev) {
            if (ev.which == 13) {
                $scope.searchFun()
            }
        });
        $scope.searchFun = function () {
            $scope.pageNum = '1';
            getListFun()
        }
        $scope.timeSFun = function () {
            $scope.pageNum = '1';
            getListFun()
        }
        $scope.changePageSize = function () {
            $scope.pageNum = '1';
            getListFun()
        }
        $scope.toSpecifiedPage = function () {
            if ($scope.pageNum > Math.ceil($scope.totalNum / $scope.pageSize)) {
                layer.msg('输入的页数不能大于总页数')
                return
            }
            $scope.pageNum = '1';
            getListFun()
        }
        $scope.qxsqFun = function (item) {
            $scope.qxsqFlag = true;
            $scope.itemId = item.ID;
        }
        $scope.sureQxsqFun = function () {
            erp.load()
            erp.postFun('erp/accAssign/delAccEmpInfo', {
                id: $scope.itemId
            }, function (data) {
                console.log(data)
                layer.closeAll('loading')
                if (data.data.code == 200) {
                    layer.msg('取消授权成功')
                    $scope.qxsqFlag = false;
                    $scope.pageNum = '1';
                    getListFun()
                } else {
                    layer.msg('取消授权失败')
                }
            }, function (data) {
                console.log(data)
                layer.closeAll('loading')
            })
        }
        // $('.fpkh-resul').on('click','.cor-check-box',function () {
        //     console.log($(this).attr('src'))
        //     if ($(this).attr('src')=='static/image/order-img/multiple1.png') {
        //         $(this).attr('src','static/image/order-img/multiple2.png');
        //     } else {
        //         $(this).attr('src','static/image/order-img/multiple1.png');
        //     }
        // })

    }])
    //erp客户需审核
    app.controller('xushenheCtrl', ['$scope', 'erp', '$location', '$routeParams', function ($scope, erp, $location,$routeParams) {
        console.log('xushenheCtrl',$routeParams.type);
        $scope.customerdata = {
            normal: 0,
            black: 0,
            needaudit: 0,
            nopass: 0,
            shop: 0,
            affUserNum: 0
        }
        // 列表状态码
        $scope.status = '3';
        $scope.codStatus = $routeParams.type && $routeParams.type == 2 ? '3' : null;
        //分页相关
        $scope.pagesize = '20';
        $scope.pagenum = '1';
        $scope.searchinfo = '';
        $scope.sort = "desc";
        $scope.sortField = 'a.CREATE_DATE'
        $scope.totalReturnsSort = 'desc'
        $scope.pagenumarr = [10, 20, 30, 50];
        getList(erp, $scope);
        //点击左侧导航栏刷新页面
        $scope.refresh = function () {
            window.location.reload();
        }

        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            // $scope.pagesize=pagesize-0;
            $scope.pagenum = 1;
            getList(erp, $scope);
        }

        $scope.pagenumchange = function () {
            console.log($scope.pagenum % 1)
            $scope.pagenum = $(".goyema").val();
            if ($scope.pagenum < 1 || $scope.pagenum > $scope.totalpage) {
                alert(gjh29)
            } else {
                getList(erp, $scope);
            }
        }
        //搜索客户
        $scope.searchcustomer = function () {
            console.log('搜索条件', $scope.searchinfo);
            $scope.pagenum = '1';
            getList(erp, $scope);
        }
        //按下enter搜索
        $scope.enterSearch = function (event) {
            if (event.keyCode === 13 || event.keyCode === 108) {
                console.log('搜索条件', $scope.searchinfo);
                $scope.searchinfo = $scope.searchinfo;
                $scope.pagenum = 1;
                getList(erp, $scope);
            }
        }
        //点击姓名跳转详情
        $scope.shenhe = function (item) {
            // sessionStorage.clear();
            // sessionStorage.setItem('userid',item.id);
            // sessionStorage.setItem('buttongb','false');
            // sessionStorage.setItem('buttontg','false');
            // sessionStorage.setItem('buttonjj','false');
            // sessionStorage.setItem('buttonfh','false');
            // sessionStorage.setItem('buttonjrhmd','true');
            // sessionStorage.setItem('buttonjrbmd','true');
            // $location.path('/erpcustomer/customer-detail');
            // window.open('manage.html#/erpcustomer/customer-detail','_blank','');
            if($scope.codStatus != null && $scope.codStatus != undefined){
              window.open('manage.html#/erpcustomer/customer-detail/' + item.id + '/' + $scope.status + '?cod=' + $scope.codStatus, '_blank', '');
            }else{
              window.open('manage.html#/erpcustomer/customer-detail/' + item.id + '/' + $scope.status, '_blank', '');
            }
        }
        //升序排列
        $scope.wllSort1 = function () {
            console.log("aa升序")
            $scope.sort = "asc";
            getList(erp, $scope);
        }
        //降序排列
        $scope.wllSort2 = function () {
            console.log("bb降序")
            $scope.sort = "desc";
            getList(erp, $scope);
        }

    }])
    //erp客户详情
    app.controller('customerdetailCtrl', ['$scope', 'erp', '$timeout', '$location', '$routeParams', function ($scope, erp, $timeout, $location, $routeParams) {
      var b = new Base64();
        console.log('customerdetailCtrl');
        console.log($location);
      
        var that = this;
        $scope.isSendMail=false;
        $scope.isCod = $location.$$search.cod == '3' ? true : false; // 是否cod客户

        $scope.job = localStorage.getItem('job')?b.decode(localStorage.getItem('job')):'';
        const erpLoginName = localStorage.getItem('erploginName') ? b.decode(localStorage.getItem('erploginName')) : ''
        const phoneList = [ '龚莹', '廖倩' ]
        $scope.showPhone = phoneList.includes(erpLoginName)
        // console.log(sessionStorage.getItem('userid'))
        $scope.isAdminLogin = erp.isAdminLogin();
        $scope.customerdata = {
            normal: 0,
            black: 0,
            needaudit: 0,
            nopass: 0,
            shop: 0,
            affUserNum: 0
        }
        $scope.classVIP=function(vip){
            if(vip=='0'){
                return '小客户';
            }else if(vip=='1'){
                return 'VIP';
            }else if(vip=='2'){
                return '需吃透';
            }else if(vip=='3'){
                return '需跟进';
            }
        }
        //按关闭的显示隐藏
        $scope.go = function () {
            // location.href=window.history.back();
            if($scope.isCod){
              $location.path('/erpcustomer/xushenhe/2');
            }else{
              $location.path('/erpcustomer/xushenhe');
            }
        }
        //点击上边关闭按钮回到客户列表
        // $scope.canelDetail = function(){
        //   // $location.path('/erpcustomer/KeHuLieBiao');
        // history.back();
        // }
        // $scope.buttonjrhmd=sessionStorage.getItem('buttonjrhmd');
        // $scope.buttonfh = sessionStorage.getItem('buttonfh');
        // $scope.buttonjj = sessionStorage.getItem('buttonjj');
        // $scope.buttontg = sessionStorage.getItem('buttontg');
        // $scope.buttongb = sessionStorage.getItem('buttongb');
        // $scope.buttonjrbmd = sessionStorage.getItem('buttonjrbmd');
        // $scope.passshenhe = sessionStorage.getItem('passshenhe');
        $scope.custId = $routeParams.custId;
        $scope.status = $routeParams.status;
        console.log($scope.custId, $scope.status)
        $scope.through = false;
        $scope.refuse = false;
        $scope.blacklist = false;
        // sessionStorage.getItem('userid')
        erp.postFun("app/account_erp/queryOne", { "data": "{'id':'" + $scope.custId + "'}" }, ddd, err)
        //erp.postFun("app/account_erp/queryEmployee", null, sman, err)

        //点击通过按钮
        $scope.embul = false;
        $scope.empname = "";
        $scope.emp = "";
        $scope.ywyname = "";
        $scope.ywyId;
        $scope.empchange = function () {
            console.log($scope.empname)
            erp.postFun('app/employee/getempbyname', { "data": "{'name':'" + $scope.empname + "', 'job': '销售'}" }, function (n) {
                var obj = JSON.parse(n.data.result)
                console.log(obj)
                $scope.embul = true;
                $scope.emblist = obj.list;
            }, err)
        }
        // 跳转客户分析
        $scope.openAnalyze = function (name) {
          console.log(name)
          var url = 'detail' + name
          window.location.href = '#/erpcustomer/khgl/' + url;
        }
        //点击下拉框中的内容
        $scope.getemp = function (item) {
            console.log(item)
            $scope.empname = item.NAME;
            $scope.emp = item;
        }
        /** 打开邮件发送 */
        $scope.openEmail = function (email) {
            $scope.isSendMail = true;
            that.no = {email}
        }
        $scope.$on('log-to-father',function (d,flag) {
            // {closeFlag: false}
            // console.log('收到 =>',flag)
          if (d && flag) {
            $scope.isSendMail = flag.closeFlag;
          }
        })

        function ddd(n) {
            var obj = JSON.parse(n.data.result)
            console.log(obj.list)
            $scope.user = obj.list[0];
            console.log($scope.user)
            console.log($scope.user.RELATE_SALESMAN);
            $scope.ywyname = $scope.user.RELATE_SALESMAN;
            $scope.ywyId = $scope.user.SALESMANID;
            if (!($scope.user.survey == null || $scope.user.survey == undefined || $scope.user.survey == "")) {
                //商品消费人群
                if (!($scope.user.survey.niches == null || $scope.user.survey.niches == undefined || $scope.user.survey.niches == "")) {
                    var aa = $scope.user.survey.niches.length;
                    var arr = [];
                    for (var i = 0; i < aa; i++) {
                        arr.push(obj.list[0].survey.niches[i].name);
                    }
                    var str = arr.join(',');
                    $scope.niches = str;
                }
                //店铺所在平台
                if (!($scope.user.survey.platforms == null || $scope.user.survey.platforms == undefined || $scope.user.survey.platforms == "")) {
                    var bb = $scope.user.survey.platforms.length;
                    var arr1 = [];
                    for (var i = 0; i < bb; i++) {
                        arr1.push($scope.user.survey.platforms[i])
                    }
                    var str1 = arr1.join(',');
                    $scope.platforms = str1;
                }
                //主要销售商品类目
                if (!($scope.user.survey.markets == null || $scope.user.survey.markets == undefined || $scope.user.survey.markets == "")) {
                    var cc = $scope.user.survey.markets.length;
                    var arr2 = [];
                    for (var i = 0; i < cc; i++) {
                        arr2.push($scope.user.survey.markets[i])
                    }
                    var str2 = arr2.join(',');
                    $scope.markets = str2;
                }
                //每日需处理订单量
                if (!($scope.user.survey.orderNumber == null || $scope.user.survey.orderNumber == undefined || $scope.user.survey.orderNumber == "")) {
                    $scope.orderNumber = $scope.user.survey.orderNumber[0];
                }

            }
            var str = $scope.user.CONTACT_ID || '';
            str = str.replace(/\\/g, '');
            var obj = str ? JSON.parse(str) : str;
            $scope.skype = obj.Skype;
            $scope.whatapp = obj.Whatapp;
        }

        //点击通过
        $scope.pase = function (item) {
            $scope.through = true;
            $scope.empname = item.RELATE_SALESMAN;
            if ($scope.empname) {
                $scope.emp = {
                    ID: item.SALESMANID,
                    NAME: item.RELATE_SALESMAN
                }
            }
            // if($scope.ywyname){
            //  $scope.empname = $scope.ywyname;
            // }
            //点击确认
            $scope.throughquery = function () {
                if (!$scope.empname || !$scope.emp) {
                    layer.msg('请选择业务员');
                    return;
                }
                var obj = $scope.emp;
                // sessionStorage.getItem('userid')
                let rqData = "";
                if($scope.isCod){
                  // erp.postFun("erp/account/auditCodAccounts", {codStatus:1,accountId:$scope.custId,accountType:$scope.user.account_type}, pase, err);
                  rqData = "{'id':'" + $scope.custId + "','codStatus':'1','salesmanid':'" + obj.ID + "','relatesalesman':'" + obj.NAME + "','accountType':'" + $scope.user.account_type + "','sign':'cod'}";
                }else{
                  rqData = "{'id':'" + $scope.custId + "','status':'1','salesmanid':'" + obj.ID + "','relatesalesman':'" + obj.NAME + "'}";
                }
                erp.postFun("app/account_erp/updateOne", { "data": rqData }, pase, err);
                
                function pase(data) {
                    if (data.data.statusCode == 200) {
                        layer.msg(gjh20);
                        $timeout(function () {
                            if($scope.isCod){
                              $location.path('/erpcustomer/KeHuLieBiao/2');
                            }else{
                              $location.path('/erpcustomer/KeHuLieBiao');
                            }
                        }, 1000)
                    }else{
                      layer.msg(gjh25);
                    }
                    console.log(data);
                }

            }
        }

        //拒绝时候弹框的确定
        $scope.refusequery = function () {
            console.log($scope.remarks2)
            let rqData = "";
            if($scope.isCod){
              // erp.postFun("erp/account/auditCodAccounts", {codStatus:0,accountId:$scope.custId,remarks2:$scope.remarks2,accountType:$scope.user.account_type}, refuse, err);
              rqData = "{'id':'" + $scope.custId + "','codStatus':'0','remarks2':'" + $scope.remarks2 + "','accountType':'" + $scope.user.account_type + "','sign':'cod'}";
            }else{
              rqData = "{'id':'" + $scope.custId + "','status':'0','remarks2':'" + $scope.remarks2 + "'}";
            }
            erp.postFun("app/account_erp/updateOne", { "data": rqData }, refuse, err);

            function refuse(data) {
                console.log(data);
                if (data.data.statusCode == 200) {
                    layer.msg(gjh21, { shift: -1 });
                    $timeout(function () {
                        if($scope.isCod){
                          $location.path('/erpcustomer/shenhenopass/2');
                        }else{
                          $location.path('/erpcustomer/shenhenopass');
                        }
                    }, 1000)
                }else{
                  layer.msg(gjh25);
                }
            }

            //$location.path('/erpcustomer/KeHuLieBiao')
        }
        //加入黑名单的确认
        $scope.blacklistquery = function () {
            function blacklist(data) {
                console.log(data);
                if (data.status == 200) {
                    layer.msg(gjh22, { shift: -1 });
                    $timeout(function () {
                        $location.path('/erpcustomer/heimingdan');
                    }, 1000)
                }
            }
            let param = {
                id:$scope.custId,
                remarks1:$scope.remarks1
            }
            erp.postFun("app/account_erp/addBlackList", { "data": JSON.stringify(param) }, blacklist, err)

        }
        //加入白名单
        $scope.addWhite = function () {
            $scope.through = true;
            if ($scope.ywyname) {
                console.log("aa");
                $scope.empname = $scope.ywyname;
                // $(".detail-tanchuang1-search>input").attr("disabled","disabled");
                $('#assign-saleman-inp').attr("disabled", "disabled");
                //白名单中的确认
                $scope.throughquery = function () {
                    erp.postFun("app/account_erp/updateOne", { "data": "{'id':'" + $scope.custId + "','status':'1','salesmanid':'" + $scope.ywyId + "','relatesalesman':'" + $scope.empname + "','sign':'2'}" }, pase, err)

                    function pase(data) {
                        if (data.status == 200) {
                            layer.msg(gjh23);
                            $timeout(function () {
                                if($scope.isCod){
                                  $location.path('/erpcustomer/KeHuLieBiao/2');
                                }else{
                                  $location.path('/erpcustomer/KeHuLieBiao');
                                }
                            }, 1000)
                        }
                        console.log(data);
                    }
                }
            } else {
                //白名单中的确认
                console.log("bb");
                $scope.throughquery = function () {
                    console.log($scope.emp);
                    var obj = $scope.emp;
                    console.log("aa");
                    console.log(obj.id);
                    console.log(obj.name);
                    // console.log(sessionStorage.getItem('userid'));
                    console.log("aa");
                    erp.postFun("app/account_erp/updateOne", { "data": "{'id':'" + $scope.custId + "','status':'1','salesmanid':'" + obj.ID + "','relatesalesman':'" + obj.NAME + "'}" }, pase, err)

                    function pase(data) {
                        if (data.status == 200) {
                            layer.msg(gjh23);
                            $timeout(function () {
                              if($scope.isCod){
                                $location.path('/erpcustomer/KeHuLieBiao/2');
                              }else{
                                $location.path('/erpcustomer/KeHuLieBiao');
                              }
                            }, 1000)
                        }
                        console.log(data);
                    }
                }
            }

        }

        /*****************客户列表里面添加业务员*********************/
        //客户列表的input框点击
        $scope.embul1 = false;
        $scope.ywyadd = function () {
            $scope.through1 = true;
            $scope.empname1 = '';
            $scope.empchange1 = function () {
                console.log($scope.empname1)
                erp.postFun('app/employee/getempbyname', { "data": "{'name':'" + $scope.empname1 + "', 'job': '销售'}" }, function (n) {
                    var obj = JSON.parse(n.data.result)
                    console.log(obj)
                    $scope.embul1 = true;
                    $scope.emblist1 = obj.list;
                }, err)
            }
        }
        //修改的时候的input框
        $scope.ywyamend = function (user) {
            $scope.through1 = true;
            $scope.empname1 = $scope.ywyname;
            console.log(user);
            $scope.emp = {};
            $scope.emp.ID = user.SALESMANID;
            $scope.emp.NAME = user.RELATE_SALESMAN;
            $scope.empchange1 = function () {
                console.log($scope.empname1)
                erp.postFun('app/employee/getempbyname', { "data": "{'name':'" + $scope.empname1 + "', 'job': '销售,客服'}" }, function (n) {
                    var obj = JSON.parse(n.data.result)
                    console.log(obj)
                    $scope.embul1 = true;
                    $scope.emblist1 = obj.list;
                }, err)
            }
        }
        //点击下拉框中的内容选择业务员姓名
        $scope.getemp1 = function (item) {
            console.log(item)
            $scope.empname1 = item.NAME;
            $scope.embul1 = false;
            $scope.emp = item;
        }

        //点击确定提交
        $scope.throughquery1 = function () {
            erp.postFun('app/account/updatebyname', { "data": "{'empId':'" + $scope.emp.ID + "','empName':'" + $scope.emp.NAME + "','id':'" + $scope.custId + "'}" }, function (n) {
                layer.msg(gjh24);
                $timeout(function () {
                    $scope.add = false;
                    window.location.reload();
                }, 1000)
            }, err)
        }

        $scope.guanlianshangpinNew = function (item) {
            console.log(item)
            $scope.$broadcast('customer-list', {
                flag: 'show-customer-connected',
                customer: item
            })
        }
        $scope.skulistshangpinNew = function (item) {
            $scope.$broadcast('customer-list', {
                flag: 'show-customer-skulist',
                customer: item
            })
        }
        $scope.privatecomNew = function (item) {
            $scope.$broadcast('customer-list', {
                flag: 'show-customer-private',
                customer: item
            })
        }

        //获取店铺
        $scope.detailShopget = function (id) {
          console.log(id)
            localStorage.setItem('shopuserId', b.encode(id.ID));
            location.href = 'manage.html#/erpcustomer/erpshop'
        };

    }])
    //erp审核未通过
    app.controller('shenhenopassCtrl', ['$scope', 'erp', '$location', '$routeParams',  function ($scope, erp, $location, $routeParams) {
        console.log('shenhenopassCtrl',$routeParams.type)
        $scope.customerdata = {
            normal: 0,
            black: 0,
            needaudit: 0,
            nopass: 0,
            shop: 0,
            affUserNum: 0
        }
        // 列表状态码
        $scope.status = '0';
        $scope.codStatus = $routeParams.type && $routeParams.type == 2 ? '0' : null; // 0:审核未通过,1:正常,2:锁定(删除),3:注册(待审核)
        //分页相关
        $scope.searchinfo = '';
        $scope.pagesize = '20';
        $scope.pagenum = '1';
        $scope.sort = "desc";
        $scope.sortField = 'a.CREATE_DATE'
        $scope.pagenumarr = [10, 20, 30, 50];
        getList(erp, $scope);

        //点击左侧导航栏刷新页面
        $scope.refresh = function () {
            window.location.reload();
        }
        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            // $scope.pagesize=pagesize-0;
            $scope.pagenum = 1;
            getList(erp, $scope);
        }
        $scope.pagenumchange = function () {
            console.log($scope.pagenum % 1)
            $scope.pagenum = $(".goyema").val();
            if ($scope.pagenum < 1 || $scope.pagenum > $scope.totalpage()) {
                alert(gjh29)
            } else {
                getList(erp, $scope);
            }
        }
        //搜索客户
        $scope.searchcustomer = function () {
            console.log('搜索条件', $scope.searchinfo);
            $scope.pagenum = '1';
            getList(erp, $scope);
        }
        //按下enter搜索
        $scope.enterSearch = function (event) {
            if (event.keyCode === 13 || event.keyCode === 108) {
                console.log('搜索条件', $scope.searchinfo);
                $scope.searchinfo = $scope.searchinfo;
                $scope.pagenum = 1;
                getList(erp, $scope);
            }
        }
        $scope.reasons = false;
        //拒绝理由的弹框
        $scope.refusal = function (item) {
            console.log(item.remarks2);
            $scope.reasons = true;
            $(".reasonsname").text(item.LOGIN_NAME + gjh26);
            $(".reasonsText>p").text(item.remarks2);
            if (item.remarks2 == "" || item.remarks2 == null || item.remarks2 == undefined) {
                $scope.reasons = false;
            }
        }
        $scope.reasonsclose = function () {
            $scope.reasons = false;
        }
        //shenhes点击姓名进入详情
        $scope.shenhe = function (item) {
            // sessionStorage.setItem('userid',item.id)
            // sessionStorage.setItem('buttongb','true');
            // sessionStorage.setItem('buttontg','false');
            // sessionStorage.setItem('buttonjj','true');
            // sessionStorage.setItem('buttonfh','false');
            // sessionStorage.setItem('buttonjrhmd','true');
            // sessionStorage.setItem('buttonjrbmd','true');
            // $location.path('/erpcustomer/customer-detail');
            // window.open('manage.html#/erpcustomer/customer-detail','_blank','');
            if($scope.codStatus != null && $scope.codStatus != undefined){
              window.open('manage.html#/erpcustomer/customer-detail/' + item.id + '/' + $scope.status + '?cod=3', '_blank', '');
            }else{
              window.open('manage.html#/erpcustomer/customer-detail/' + item.id + '/' + $scope.status, '_blank', '');
            }
        }

        //升序排列
        $scope.wllSort1 = function () {
            console.log("aa升序")
            $scope.sort = "asc";
            getList(erp, $scope);
        }
        //降序排列
        $scope.wllSort2 = function () {
            console.log("bb降序")
            $scope.sort = "desc";
            getList(erp, $scope);
        }

    }])
    //erpshop
    app.controller('erpshopCtrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('erpshopCtrl')
        var base64 = new Base64();
        var userId = base64.decode(localStorage.getItem('shopuserId') == undefined ? "" : localStorage.getItem('shopuserId'));
        erp.postFun('app/shop/getshoplist', { "data": "{'accountid':'" + userId + "','search':'','type':'','pageSize':'" + 10000 + "','pageNum':'" + 1 + "','sort':''}" }, con, err);

        function con(n) {
            var obj = JSON.parse(n.data.result);
            console.log(obj);
            $scope.shopall = obj;
            if ($scope.shopall.count == 0) {
                $scope.totalpage = 0;
                $scope.shoplist = [];
                layer.msg(gjh27);
            }
            $scope.shoplist = obj.shoplist;
        }
        // 返回
        $scope.goBack = function () {
          history.back()
        }
        /** 店铺地址转化 */
        $scope.changeShopAddress = function (item) {
            let url = item.NAME + (item.TYPE === 'shopify' ? '.myshopify.com' : '')
              , _url

            _url = (url.startsWith('http') ? url : 'https://' + url).replace(/$http(s?)/, 'https');
            return _url
        }
    }])
    //erp客户黑名单
    app.controller('heimingdanCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        console.log('heimingdanCtrl')
        $scope.customerdata = {
            normal: 0,
            black: 0,
            needaudit: 0,
            nopass: 0,
            shop: 0,
            affUserNum: 0
        }
        // 列表状态码
        $scope.status = '2';
        //分页相关
        $scope.searchinfo = '';
        $scope.pagesize = '20';
        $scope.pagenum = '1';
        $scope.sort = "desc";
        $scope.sortField = 'a.CREATE_DATE'
        $scope.pagenumarr = [10, 20, 30, 50];
        getList(erp, $scope);

        //点击左侧导航栏刷新页面
        $scope.refresh = function () {
            window.location.reload();
        }
        $scope.pagechange = function (pagesize) {
            $scope.pagenum = 1;
            getList(erp, $scope);
        }
        $scope.pagenumchange = function () {
            console.log($scope.pagenum % 1);
            $scope.pagenum = $(".goyema").val();
            if ($scope.pagenum < 1 || $scope.pagenum > $scope.totalpage) {
                alert(gjh29)
            } else {
                getList(erp, $scope);
            }
        }
        //搜索客户
        $scope.searchcustomer = function () {
            console.log('搜索条件', $scope.searchinfo);
            $scope.pagenum = '1';
            getList(erp, $scope);
        }
        //按下enter搜索
        $scope.enterSearch = function (event) {
            if (event.keyCode === 13 || event.keyCode === 108) {
                console.log('搜索条件', $scope.searchinfo);
                $scope.searchinfo = $scope.searchinfo;
                $scope.pagenum = 1;
                getList(erp, $scope);
            }
        }
        //拒绝理由的弹框
        $scope.refusal = function (item) {
            $scope.reasons = true;
            $(".reasonsname").text(item.LOGIN_NAME + gjh26);
            $(".reasonsText>p").text(item.remarks1);
            if (item.remarks1 == "" || item.remarks1 == null || item.remarks1 == undefined) {
                $scope.reasons = false;
            }
        }
        $scope.reasonsclose = function () {
            $scope.reasons = false;
        }
        //shenhes点击姓名进入详情
        $scope.shenhe = function (item) {
            window.open('manage.html#/erpcustomer/customer-detail/' + item.id + '/' + $scope.status, '_blank', '');
        }
        //升序排列
        $scope.wllSort1 = function () {
            console.log("aa升序")
            $scope.sort = "asc";
            getList(erp, $scope);
        }
        //降序排列
        $scope.wllSort2 = function () {
            console.log("bb降序")
            $scope.sort = "desc";
            getList(erp, $scope);
        }
        $scope.interObj = {
            page:1,
            limit:'10',
            show:false
        }
        function getInterceptList() {
            let param = {
                page:$scope.interObj.page,
                limit:$scope.interObj.limit,
                type:6,
                accountId:$scope.item.id
            }
            layer.load(2);
            erp.postFun("app/order/queryInterceptList", param, ({data}) =>{
                layer.closeAll();
                $scope.interList = data.ordersList;
                $scope.interObj.show=true;
                $scope.$broadcast('page-data', {
                    pageNum: $scope.interObj.page,
                    totalNum: Math.ceil(data.orderCount / $scope.interObj.limit),
                    totalCounts: data.orderCount,
                    pageSize: $scope.interObj.limit,
                    pageList: ['10','20','30']
                  })
            },err=>{
                console.log(err)
            })
        }
        $scope.getInterceptL = item=>{
            if(item.interceptSize==0) return false;
            $scope.item = item;
            getInterceptList();
        }
        $scope.$on('pagedata-fa', function(d, data) {
            $scope.interObj.page = data.pageNum;
            $scope.interObj.limit = data.pageSize;
            getInterceptList();
        });

    }])
    // erp展会客户customerExhibitionCtrl
    app.controller('customerExhibitionCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        console.log("展会客户")
        var bs = new Base64();
        var logiName = localStorage.getItem('erploginName') ? bs.decode(localStorage.getItem('erploginName')) : '';
        console.log(logiName)
        if (logiName == 'admin') {
            $scope.dcAdminFlag = true;
        } else {
            $scope.dcAdminFlag = false;
        }
        $scope.customerdata = {};
        $scope.customerdata = {
            normal: 0,
            black: 0,
            needaudit: 0,
            nopass: 0,
            shop: 0,
            affUserNum: 0
        }
        // custExhiList
        $scope.pageSize = '20';
        $scope.pageNum = '1';
        $scope.totalNum = 0;
        $scope.totalPageNum = 0;
        $scope.searchinfo = '';
        //erp.postFun("app/storage/orderBuyList", {"data":"{'pageNum':'1','pageSize':'5'}"}, bb, err);
        // 获取列表
        function getList(erp, $scope) {
            erp.load();
            erp.postFun("pojo/exhibition/erpList", {
                'pageNum': $scope.pageNum,
                'pageSize': $scope.pageSize,
                'inputStr': $scope.searchinfo
            }, function (n) {
                erp.closeLoad();
                console.log(n);
                if (n.data.statusCode != 200) {
                    layer.msg(gjh28);
                    return;
                }
                var obj = JSON.parse(n.data.result);
                if (obj.totle == 0) {
                    $scope.totalpage = 0;
                    $scope.custExhiList = [];
                    layer.msg(gjh27);
                    return;
                }
                $scope.totalNum = obj.totle;
                $scope.custExhiList = obj.list;
                console.log($scope.custExhiList);
                $scope.totalPageNum = Math.ceil(($scope.totalNum * 1) / ($scope.pageSize * 1));
                pageFun(erp, $scope);
            }, err);
        }

        //分页
        function pageFun(erp, $scope) {
            $(".page-index").jqPaginator({
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
                    ;
                    erp.load();
                    $scope.pageNum = n + '';
                    erp.postFun("pojo/exhibition/erpList", {
                        'pageNum': $scope.pageNum,
                        'pageSize': $scope.pageSize,
                        'inputStr': $scope.searchinfo
                    }, function (n) {
                        erp.closeLoad();
                        var obj = JSON.parse(n.data.result)
                        $scope.custExhiList = obj.list;
                        console.log($scope.custExhiList);
                    }, err)
                }
            });
        }

        getList(erp, $scope);
        //点击左侧导航栏刷新页面
        $scope.refresh = function () {
            window.location.reload();
        }
        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            getList(erp, $scope);
        }
        $scope.pagenumchange = function () {
            console.log($scope.pageNum, $scope.totalPageNum);
            if (isNaN($scope.pageNum) || $scope.pageNum * 1 < 1 || $scope.pageNum * 1 > $scope.totalPageNum) {
                layer.msg(gjh29)
            } else {
                getList(erp, $scope);
            }
        }
        //搜索客户
        $scope.searchcustomer = function () {
            console.log('搜索条件', $scope.searchinfo);
            $scope.pageNum = '1';
            getList(erp, $scope);
        }
        //按下enter搜索
        $scope.enterSearch = function (event) {
            if (event.keyCode === 13 || event.keyCode === 108) {
                console.log('搜索条件', $scope.searchinfo);
                $scope.pageNum = 1;
                getList(erp, $scope);
            }
        }
        $scope.grantGift = function (item, index) {
            $scope.grantGiftFlag = true;
            $scope.grantItem = item;
            $scope.grantItem.index = index;
        }
        $scope.goGrantGift = function () {
            erp.load();
            erp.postFun('pojo/exhibition/grantGift', JSON.stringify({
                id: $scope.grantItem.ID,
                codegift: $scope.grantItem.codegift
            }), function (data) {
                erp.closeLoad();
                if (data.data.statusCode == 200) {
                    layer.msg(gjh24);
                    $scope.grantGiftFlag = false;
                    $scope.custExhiList[$scope.grantItem.index].isgift = 1;
                    $scope.grantItem = null;
                } else {
                    layer.msg(gjh25);
                }
            }, err);
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
        //导出
        var selIds = '';
        $scope.daoChuFun = function () {
            // selIds = '';
            // var selCount = 0;
            // $('#c-mu-ord .c-mu-chekbox').each(function () {
            //     console.log($(this).attr('src'))
            //     if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
            //         selCount++;
            //         selIds += $(this).siblings('.hide-order-id').text() + ',';
            //     }
            // })
            // if (selCount < 1) {
            //     layer.msg('请选择客户')
            //     return;
            // }
            // else {
            //     $scope.daoChuFlag = true;
            // }
            erp.load();
            erp.postFun("app/client_erp/exportExhibitionAll", {
                'inputStr': $scope.searchinfo
            }, function (data) {
                console.log(data)
                erp.closeLoad()
                if (data.data.statusCode == 200) {
                    console.log(data.data.result)
                    var result = JSON.parse(data.data.result)
                    $scope.excelLink = result.href;
                    $scope.daoChuFlag = true;
                } else {
                    if (data.data.message) {
                        layer.msg(data.data.message)
                    } else {
                        layer.msg('导出失败')
                    }
                }
            }, function (data) {
                console.log(data)
                erp.closeLoad()
            })
        }
        $scope.downExcelFun = function () {
            location.href = $scope.excelLink;
            $scope.daoChuFlag = false;
        }
        $scope.closeExcelFun = function () {
            $scope.daoChuFlag = false;
        }
    }])
    //erpshoplist店铺列表
    app.controller('shoplistCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        console.log("shoplistCtrl")
        $scope.customerdata = {
            normal: 0,
            black: 0,
            needaudit: 0,
            nopass: 0,
            shop: 0,
            affUserNum: 0
        }

        //分页相关
        $scope.searchinfo = '';
        $scope.pagesize = '20';
        $scope.pagenum = '1';
        $scope.pagesize1 = '10';
        $scope.pagenum1 = '1';
        $scope.sort = "desc";
        $scope.sortField = 'a.CREATE_DATE'
        $scope.pagenumarr = [10, 20, 30, 50];
        $scope.type = 0;
        $scope.accredit = "授权成功";
        $scope.viewFlag = false;
        $scope.dplist = [];
        $scope.id = '';
        $scope.typeChange = function (accredit) {
            console.log(accredit);
            $scope.pagenum = '1';
            if (accredit == "授权成功") {
                $scope.type = 0;
                getList();
            } else if (accredit == "授权失败") {
                $scope.type = 1;
                getList();

            }
        }
        getList();

        function getList() {
            erp.load();
            erp.postFun('app/shop/getshoplist', { "data": "{'search':'" + $scope.searchinfo + "','type':'" + $scope.type + "','pageSize':'" + $scope.pagesize + "','pageNum':'" + $scope.pagenum + "','sort':'" + $scope.sort + "'}" }, con, err)

            function con(n) {
                erp.closeLoad();
                var obj = JSON.parse(n.data.result);
                console.log(obj);
                $scope.shopall = obj;
                $scope.customerdata.shop = $scope.shopall.count;
                $scope.totalNum = $scope.shopall.count;
                if ($scope.shopall.count == 0) {
                    $scope.totalpage = 0;
                    $scope.shoplist = [];
                    layer.msg(gjh27);
                }
                $scope.shoplist = obj.shoplist;
                $scope.totalpage = function () {
                    return Math.ceil($scope.shopall.count / $scope.pagesize)
                }

                pageFun();
            }
        }

        //查看
        function getlookdata() {
            erp.load();
            $scope.dplist = [];
            erp.postFun('app/shop/getShopSalesVol', {
                currentPage: $scope.pagenum1,
                pageSize: $scope.pagesize1,
                shopid: $scope.id
            }, function (res) {
                erp.closeLoad();
                if (res.data.status == 200) {
                    $scope.dplist = res.data.shop || [];
                    $scope.totalNum1 = res.data.totalCount;
                    if (res.data.totalCount == 0) {
                        $scope.totalpage1 = 0;
                        $scope.dplist = [];
                        layer.msg(res.data.message);
                    }
                    $scope.totalpage1 = function () {
                        return Math.ceil(res.data.totalCount / $scope.pagesize1)
                    }
                    $scope.dplist.forEach(function (o, i) {
                        o.dw = false;
                    })
                } else {
                    layer.msg(res.data.message);
                }
                pageFun1();
            }, function (res) {
                erp.closeLoad();

            })
        }

        /** 店铺地址转化 */
        $scope.changeShopAddress = function (item) {
            let url = item.NAME + (item.TYPE === 'shopify' ? '.myshopify.com' : '')
              , _url

            _url = (url.startsWith('http') ? url : 'https://' + url).replace(/$http(s?)/, 'https');
            return _url
        }

        $scope.look = function (item) {
            if (item.TYPE != 'Shopify' && item.TYPE != 'shopify') {
                layer.msg('暂时只支持查看shopify订单销量');
                return;
            }
            $scope.dplist = [];
            console.log(item)
            $scope.id = item.ID;
            $scope.shopName = item.NAME;
            $scope.viewFlag = true;
            getlookdata();
        }
        //其他规格查看
        $scope.isloook = function (item, idx) {
            item.dw = !item.dw;
            item.prolist = []
            if (item.dw) {
                erp.load();
                erp.postFun('app/shop/getProVariants', { product_id: item.productId }, function (res) {
                    erp.closeLoad();
                    console.log(res.data.variants)
                    item.prolist = res.data.variants || [];
                }, function (res) {
                    layer.msg(gjh28);
                })
            }
        }

        //分页
        function pageFun() {
            if ($scope.shopall.count < 1) {
                layer.msg('暂无数据')
                // return
            }
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.shopall.count || 1,
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
                    // $("#pagination-demo-text").html("当前第" + n + "页");
                    erp.postFun('app/shop/getshoplist', { "data": "{'search':'" + $scope.searchinfo + "','type':'" + $scope.type + "','pageSize':'" + $scope.pagesize + "','pageNum':'" + n + "','sort':'" + $scope.sort + "'}" }, function (n) {
                        var obj = JSON.parse(n.data.result);
                        console.log(obj);
                        if ($scope.shopall.count == 0) {
                            $scope.totalpage = 0;
                            $scope.shoplist = [];
                            layer.msg(gjh27);
                        }
                        $scope.shoplist = obj.shoplist;
                    }, err)

                }
            });
        }

        function pageFun1() {
            $(".pagegroup1").jqPaginator({
                totalCounts: $scope.totalNum1 || 1,
                pageSize: $scope.pagesize1 * 1,
                visiblePages: 5,
                currentPage: $scope.pagenum1 * 1,
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
                    $scope.pagenum1 = n;
                    getlookdata();
                }
            });
        }

        $scope.pagechange1 = function (pagesize) {
            console.log(pagesize)
            $scope.pagesize1 = pagesize;
            $scope.pagenum1 = 1;
            getlookdata();
        }
        $scope.pagenumchange1 = function () {
            console.log($scope.pagenum1 % 1)
            $scope.pagenum1 = $(".goyema1").val() - 0;
            if ($scope.pagenum1 < 1 || $scope.pagenum1 > $scope.totalpage1()) {
                alert(gjh29)
                $scope.pagenum1 = 1;
            } else {
                getlookdata();
            }
        }
        //点击左侧导航栏刷新页面
        $scope.refresh = function () {
            window.location.reload();
        }
        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            $scope.pagesize = pagesize;
            $scope.pagenum = 1;
            getList();
            //erp.postFun("app/account_erp/pageQuery", {"data": "{'page': '1','limit':'"+$scope.pagesize+"','status':'2','name':'"+$scope.searchinfo+"'}"}, ccc, err)
        }

        $scope.pagenumchange = function () {
            console.log($scope.pagenum % 1)
            $scope.pagenum = $(".goyema").val() - 0;
            if ($scope.pagenum < 1 || $scope.pagenum > $scope.totalpage()) {
                alert(gjh29)
            } else {
                getList();
                //erp.postFun("app/account_erp/pageQuery", {"data": "{'page': '"+ $scope.pagenum+"','limit':'"+$scope.pagesize+"','status':'2','name':'"+$scope.searchinfo+"'}"}, ccc, err)
            }
        }
        //搜索客户
        $scope.searchcustomer = function () {
            console.log('搜索条件', $scope.searchinfo);
            $scope.pagenum = '1';
            getList();
        }
        //按下enter搜索
        $scope.enterSearch = function (event) {
            if (event.keyCode === 13 || event.keyCode === 108) {
                console.log('搜索条件', $scope.searchinfo);
                $scope.searchinfo = $scope.searchinfo;
                $scope.pagenum = 1;
                getList();
            }
        }
        //升序排列
        $scope.wllSort1 = function () {
            console.log("aa升序")
            $scope.sort = "asc";
            getList();
        }
        //降序排列
        $scope.wllSort2 = function () {
            console.log("bb降序")
            $scope.sort = "desc";
            getList();
        }
        //点击姓名跳转详情
        $scope.shenhe = function (item) {
            // sessionStorage.clear();
            // sessionStorage.setItem('userid',item.ACCOUNTID);
            // sessionStorage.setItem('buttongb','true');
            // sessionStorage.setItem('buttontg','true');
            // sessionStorage.setItem('buttonjj','true');
            // sessionStorage.setItem('buttonfh','false');
            // sessionStorage.setItem('buttonjrhmd','true');
            // sessionStorage.setItem('buttonjrbmd','true');
            // $location.path('/erpcustomer/customer-detail');
            // window.open('manage.html#/erpcustomer/customer-detail','_blank','');
            window.open('manage.html#/erpcustomer/customer-detail/' + item.ACCOUNTID + '/4', '_blank', '');
        }

        //关闭查看弹出框
        $scope.closechange = function () {
            $scope.viewFlag = false;
            $scope.pagenum1 = 1;
            $scope.totalNum1 = 0;
        }

    }])
    //erp 客户分销
    app.controller('customerAffiliateCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        $scope.customerdata = {
            normal: 0,
            black: 0,
            needaudit: 0,
            nopass: 0,
            shop: 0,
            affUserNum: 0
        }
        var bs = new Base64();
        var logiName = localStorage.getItem('erploginName') ? bs.decode(localStorage.getItem('erploginName')) : '';
        console.log(logiName)
        if (logiName == 'admin') {
            $scope.dcAdminFlag = true;
        } else {
            $scope.dcAdminFlag = false;
        }
        console.log('客户分销')
        console.log($scope.customerdata)
        $scope.information = false;
        $scope.DpNumDialog = false;
        $scope.SkNumDialog = false;
        $scope.showOrhide  = '';
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
        //枚举
        $scope.Country = {
            AF: 'afghanistan',
            AX: 'aland islands',
            AL: 'albania',
            DZ: 'algeria',
            AS: 'american samoa',
            AD: 'andorra',
            AO: 'angola',
            AI: 'anguilla',
            AQ: 'antarctica',
            AG: 'antigua and barbuda',
            AR: 'argentina',
            AM: 'armenia',
            AW: 'aruba',
            AP: 'asia (unknown country)',
            AU: 'australia',
            AT: 'austria',
            AZ: 'azerbaijan',
            BS: 'bahamas',
            BH: 'bahrain',
            BD: 'bangladesh',
            BB: 'barbados',
            BY: 'belarus',
            BE: 'belgium',
            BZ: 'belize',
            BJ: 'benin',
            BM: 'bermuda',
            BT: 'bhutan',
            BO: 'bolivia',
            BQ: 'bonaire/sint eustatius/saba',
            BA: 'bosnia and herzegowina',
            BW: 'botswana',
            BV: 'bouvet island',
            BR: 'brazil',
            IO: 'british indian ocean territory',
            VG: 'british virgin islands',
            BN: 'brunei darussalam',
            BG: 'bulgaria',
            BF: 'burkina faso',
            BI: 'burundi',
            KH: 'cambodia',
            CM: 'cameroon',
            CA: 'canada',
            CV: 'cape verde',
            KY: 'cayman islands',
            CF: 'central african republic',
            TD: 'chad',
            CL: 'chile',
            CN: 'China',
            CX: 'christmas island',
            CC: 'cocos (keeling) islands',
            CO: 'colombia',
            KM: 'comoros',
            CG: 'congo',
            CK: 'cook islands',
            CR: 'costa rica',
            CI: 'cote d ivoire',
            HR: 'croatia',
            CU: 'cuba',
            CW: 'curacao',
            CY: 'cyprus',
            CZ: 'czech republic',
            CD: 'democratic republic of the congo',
            DK: 'denmark',
            DJ: 'djibouti',
            DM: 'dominica',
            DO: 'dominican republic',
            EC: 'ecuador',
            EG: 'egypt',
            SV: 'el salvador',
            GQ: 'equatorial guinea',
            ER: 'eritrea',
            EE: 'estonia',
            ET: 'ethiopia',
            EU: 'europe (unknown country)',
            FK: 'falkland islands (malvinas)',
            FO: 'faroe islands',
            FM: 'federated states of micronesia',
            FJ: 'fiji',
            FI: 'finland',
            FR: 'france',
            GF: 'french guiana',
            PF: 'french polynesia',
            TF: 'french southern territories',
            GA: 'gabon',
            GM: 'gambia',
            GE: 'georgia',
            DE: 'germany',
            GH: 'ghana',
            GI: 'gibraltar',
            GR: 'greece',
            GL: 'greenland',
            GD: 'grenada',
            GP: 'guadeloupe',
            GU: 'guam',
            GT: 'guatemala',
            GG: 'guernsey',
            GN: 'guinea',
            GW: 'guinea-bissau',
            GY: 'guyana',
            HT: 'haiti',
            HM: 'heard and mc donald islands',
            VA: 'holy see (vatican city state)',
            HN: 'honduras',
            HK: 'hong kong',
            HU: 'hungary',
            IS: 'iceland',
            IN: 'india',
            ID: 'indonesia',
            IR: 'iran (islamic republic of)',
            IQ: 'iraq',
            IE: 'ireland',
            IM: 'isle of man',
            IL: 'israel',
            IT: 'italy',
            JM: 'jamaica',
            JP: 'japan',
            JE: 'jersey',
            JO: 'jordan',
            KZ: 'kazakhstan',
            KE: 'kenya',
            KI: 'kiribati',
            KW: 'kuwait',
            KG: 'kyrgyzstan',
            LA: 'lao peoples democratic republic',
            LV: 'latvia',
            LB: 'lebanon',
            LS: 'lesotho',
            LR: 'liberia',
            LY: 'libyan arab jamahiriya',
            LI: 'liechtenstein',
            LT: 'lithuania',
            LU: 'luxembourg',
            MO: 'macau',
            MK: 'macedonia',
            MG: 'madagascar',
            MW: 'malawi',
            MY: 'malaysia',
            MV: 'maldives',
            ML: 'mali',
            MT: 'malta',
            MH: 'marshall islands',
            MQ: 'martinique',
            MR: 'mauritania',
            MU: 'mauritius',
            YT: 'mayotte',
            MX: 'mexico',
            MD: 'moldova',
            MC: 'monaco',
            MN: 'mongolia',
            ME: 'montenegro',
            MS: 'montserrat',
            MA: 'morocco',
            MZ: 'mozambique',
            MM: 'myanmar',
            NA: 'namibia',
            NR: 'nauru',
            NP: 'nepal',
            NL: 'netherlands',
            AN: 'netherlands antilles',
            NC: 'new caledonia',
            NZ: 'new zealand',
            NI: 'nicaragua',
            NE: 'niger',
            NG: 'nigeria',
            NU: 'niue',
            NF: 'norfolk island',
            KP: 'north korea',
            MP: 'northern mariana islands',
            NO: 'norway',
            OM: 'oman',
            PK: 'pakistan',
            PW: 'palau',
            PS: 'palestinian territories',
            PA: 'panama',
            PG: 'papua new guinea',
            PY: 'paraguay',
            PE: 'peru',
            PH: 'philippines',
            PN: 'pitcairn',
            PL: 'poland',
            PT: 'portugal',
            PR: 'puerto rico',
            QA: 'qatar',
            '**': 'reserved/private',
            RE: 'reunion',
            RO: 'romania',
            RU: 'russian federation',
            RW: 'rwanda',
            BL: 'saint barthelemy',
            KN: 'saint kitts and nevis',
            LC: 'saint lucia',
            MF: 'saint martin',
            VC: 'saint vincent and the grenadines',
            WS: 'samoa',
            SM: 'san marino',
            ST: 'sao tome and principe',
            SA: 'saudi arabia',
            SN: 'senegal',
            RS: 'serbia',
            SC: 'seychelles',
            SL: 'sierra leone',
            SG: 'singapore',
            SX: 'sint maarten',
            SK: 'slovakia (slovak republic)',
            SI: 'slovenia',
            SB: 'solomon islands',
            SO: 'somalia',
            ZA: 'south africa',
            GS: 'south georgia / south sandwich isl',
            KR: 'south korea',
            SS: 'south sudan',
            ES: 'spain',
            LK: 'sri lanka',
            SH: 'st. helena',
            PM: 'st. pierre and miquelon',
            SD: 'sudan',
            SR: 'suriname',
            SJ: 'svalbard and jan mayen islands',
            SZ: 'swaziland',
            SE: 'sweden',
            CH: 'switzerland',
            SY: 'syrian arab republic',
            TW: 'taiwan',
            TJ: 'tajikistan',
            TZ: 'tanzania',
            TH: 'thailand',
            TL: 'timor-leste',
            TG: 'togo',
            TK: 'tokelau',
            TO: 'tonga',
            TT: 'trinidad and tobago',
            TN: 'tunisia',
            TR: 'turkey',
            TM: 'turkmenistan',
            TC: 'turks and caicos islands',
            TV: 'tuvalu',
            UG: 'uganda',
            UA: 'ukraine',
            AE: 'united arab emirates',
            UK: 'united kingdom',
            US: 'united states',
            '?': 'unknown',
            UY: 'uruguay',
            UM: 'us minor outlying islands',
            VI: 'us virgin islands',
            UZ: 'uzbekistan',
            VU: 'vanuatu',
            VE: 'venezuela',
            VN: 'viet nam',
            WF: 'wallis and futuna islands',
            EH: 'western sahara',
            YE: 'yemen',
            ZM: 'zambia',
            ZW: 'zimbabwe',
            other: 'Not Listed'
        }
        //收款账户
        // $scope.SkNumTotal = 0;
        //店铺数量弹框
        $scope.Dpsearch = '';
        $scope.Dppagesize = '5';
        $scope.Dppagenum = '1';
        $scope.DpNumTotal = 0;
        $scope.DpList = [];
        $scope.DpuserId = '';

        function getList() {
            erp.load();
            erp.postFun('app/user/selectAffAccountList', {
                'distributionState': '3',
                'domainName': $scope.domainName,
                'email': $scope.email,
                'isShow': $scope.showOrhide,
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
                        layer.msg(gjh27);
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
            erp.postFun('app/user/selectAccountList', { 'userId': userId }, con, err)

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
                        layer.msg(gjh27);
                        item.dw = false;
                    }
                }
            }
        }

        function Userinformation(id) {
            erp.load();
            $scope.UserData = null;
            erp.postFun('app/user/getAffUserInfo', { 'id': id }, con, err)

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
                    console.log('客户分销')
                    $scope.pagenum = n + '';
                    getList();
                }
            });
        }
        //
        $scope.setRote = function(item){
            $scope.isSetRote = true;
            $scope.rote = Number(item.profitRate);
            $scope.setRoteConf = function () {
                if(!$scope.dcAdminFlag){
                    layer.msg('你没有权限')
                    return;
                }
                if($scope.rote < 0){
                    layer.msg('请输入正确的利润率')
                    return;
                }
                erp.load();
                var data = {
                    profitRate:$scope.rote,
                    id:item.id
                };
                erp.postFun('app/user/updateFenxiaoLiRunLv', data, function (res) {
                    erp.closeLoad();
                    if(res.data.code == 200){
                        layer.msg('操作成功');
                        $scope.isSetRote = false;
                        getList()
                    }else {
                        layer.msg('操作失败')
                    }

                }, function (err) {
                    erp.closeLoad();
                })
            }
        }
        $scope.setShow = function(item){
            $scope.isSetShow = true;
            $scope.isShow = item.isShow;
            $scope.setShowConf = function () {
                if(!$scope.dcAdminFlag){
                    layer.msg('你没有权限')
                    return;
                }
                erp.load();
                var data = {
                    id:item.id,
                    isShow:$scope.isShow
                }
                erp.postFun('app/user/updateAffAccount', data, function (res) {
                    erp.closeLoad();
                    if(res.data.code == 200){
                        layer.msg('操作成功');
                        $scope.isSetShow = false;
                        getList()
                    }else {
                        layer.msg('操作失败')
                    }
                }, function (err) {
                    erp.closeLoad();
                })
            }
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
        //点击左侧导航栏刷新页面
        $scope.refresh = function () {
            window.location.reload();
        }
        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            $scope.pagenum = '1';
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
            $scope.pagenum = '1';
            getList();
        }
        //按下enter搜索
        $scope.enterSearch = function (event) {
            if (event.keyCode === 13 || event.keyCode === 108) {
                console.log('搜索条件', $scope.search);
                $scope.orderBy = '';
                $scope.pagenum = '1';
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
        //导出
        var selIds = '';
        $scope.daoChuFun = function () {
            // selIds = '';
            // var selCount = 0;
            // $('#c-mu-ord .c-mu-chekbox').each(function () {
            //     console.log($(this).attr('src'))
            //     if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
            //         selCount++;
            //         selIds += $(this).siblings('.hide-order-id').text() + ',';
            //     }
            // })
            // if (selCount < 1) {
            //     layer.msg('请选择客户')
            //     return;
            // }
            // else {
            //     $scope.daoChuFlag = true;
            // }
            erp.load();
            erp.postFun("app/client_erp/exportAffAccountAll", {
                'distributionState': '3',
                'orderBy': $scope.orderBy,
                'name': $scope.search
            }, function (data) {
                console.log(data)
                erp.closeLoad()
                if (data.data.statusCode == 200) {
                    console.log(data.data.result)
                    var result = JSON.parse(data.data.result)
                    console.log(result)
                    $scope.excelLink = result.href;
                    $scope.daoChuFlag = true;
                } else {
                    if (data.data.message) {
                        layer.msg(data.data.message)
                    } else {
                        layer.msg('导出失败')
                    }
                }
            }, function (data) {
                console.log(data)
                erp.closeLoad()
            })
        }
        $scope.downExcelFun = function () {
            location.href = $scope.excelLink;
            $scope.daoChuFlag = false;
        }
        $scope.closeExcelFun = function () {
            $scope.daoChuFlag = false;
        }
    }])
    //erp erp需审核
    app.controller('customerreviewCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        $scope.customerdata = {
            normal: 0,
            black: 0,
            needaudit: 0,
            nopass: 0,
            shop: 0,
            affUserNum: 0
        }
        console.log($scope.customerdata)
        $scope.information = false;
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
        //枚举
        $scope.Country = {
            AF: 'afghanistan',
            AX: 'aland islands',
            AL: 'albania',
            DZ: 'algeria',
            AS: 'american samoa',
            AD: 'andorra',
            AO: 'angola',
            AI: 'anguilla',
            AQ: 'antarctica',
            AG: 'antigua and barbuda',
            AR: 'argentina',
            AM: 'armenia',
            AW: 'aruba',
            AP: 'asia (unknown country)',
            AU: 'australia',
            AT: 'austria',
            AZ: 'azerbaijan',
            BS: 'bahamas',
            BH: 'bahrain',
            BD: 'bangladesh',
            BB: 'barbados',
            BY: 'belarus',
            BE: 'belgium',
            BZ: 'belize',
            BJ: 'benin',
            BM: 'bermuda',
            BT: 'bhutan',
            BO: 'bolivia',
            BQ: 'bonaire/sint eustatius/saba',
            BA: 'bosnia and herzegowina',
            BW: 'botswana',
            BV: 'bouvet island',
            BR: 'brazil',
            IO: 'british indian ocean territory',
            VG: 'british virgin islands',
            BN: 'brunei darussalam',
            BG: 'bulgaria',
            BF: 'burkina faso',
            BI: 'burundi',
            KH: 'cambodia',
            CM: 'cameroon',
            CA: 'canada',
            CV: 'cape verde',
            KY: 'cayman islands',
            CF: 'central african republic',
            TD: 'chad',
            CL: 'chile',
            CN: 'China',
            CX: 'christmas island',
            CC: 'cocos (keeling) islands',
            CO: 'colombia',
            KM: 'comoros',
            CG: 'congo',
            CK: 'cook islands',
            CR: 'costa rica',
            CI: 'cote d ivoire',
            HR: 'croatia',
            CU: 'cuba',
            CW: 'curacao',
            CY: 'cyprus',
            CZ: 'czech republic',
            CD: 'democratic republic of the congo',
            DK: 'denmark',
            DJ: 'djibouti',
            DM: 'dominica',
            DO: 'dominican republic',
            EC: 'ecuador',
            EG: 'egypt',
            SV: 'el salvador',
            GQ: 'equatorial guinea',
            ER: 'eritrea',
            EE: 'estonia',
            ET: 'ethiopia',
            EU: 'europe (unknown country)',
            FK: 'falkland islands (malvinas)',
            FO: 'faroe islands',
            FM: 'federated states of micronesia',
            FJ: 'fiji',
            FI: 'finland',
            FR: 'france',
            GF: 'french guiana',
            PF: 'french polynesia',
            TF: 'french southern territories',
            GA: 'gabon',
            GM: 'gambia',
            GE: 'georgia',
            DE: 'germany',
            GH: 'ghana',
            GI: 'gibraltar',
            GR: 'greece',
            GL: 'greenland',
            GD: 'grenada',
            GP: 'guadeloupe',
            GU: 'guam',
            GT: 'guatemala',
            GG: 'guernsey',
            GN: 'guinea',
            GW: 'guinea-bissau',
            GY: 'guyana',
            HT: 'haiti',
            HM: 'heard and mc donald islands',
            VA: 'holy see (vatican city state)',
            HN: 'honduras',
            HK: 'hong kong',
            HU: 'hungary',
            IS: 'iceland',
            IN: 'india',
            ID: 'indonesia',
            IR: 'iran (islamic republic of)',
            IQ: 'iraq',
            IE: 'ireland',
            IM: 'isle of man',
            IL: 'israel',
            IT: 'italy',
            JM: 'jamaica',
            JP: 'japan',
            JE: 'jersey',
            JO: 'jordan',
            KZ: 'kazakhstan',
            KE: 'kenya',
            KI: 'kiribati',
            KW: 'kuwait',
            KG: 'kyrgyzstan',
            LA: 'lao peoples democratic republic',
            LV: 'latvia',
            LB: 'lebanon',
            LS: 'lesotho',
            LR: 'liberia',
            LY: 'libyan arab jamahiriya',
            LI: 'liechtenstein',
            LT: 'lithuania',
            LU: 'luxembourg',
            MO: 'macau',
            MK: 'macedonia',
            MG: 'madagascar',
            MW: 'malawi',
            MY: 'malaysia',
            MV: 'maldives',
            ML: 'mali',
            MT: 'malta',
            MH: 'marshall islands',
            MQ: 'martinique',
            MR: 'mauritania',
            MU: 'mauritius',
            YT: 'mayotte',
            MX: 'mexico',
            MD: 'moldova',
            MC: 'monaco',
            MN: 'mongolia',
            ME: 'montenegro',
            MS: 'montserrat',
            MA: 'morocco',
            MZ: 'mozambique',
            MM: 'myanmar',
            NA: 'namibia',
            NR: 'nauru',
            NP: 'nepal',
            NL: 'netherlands',
            AN: 'netherlands antilles',
            NC: 'new caledonia',
            NZ: 'new zealand',
            NI: 'nicaragua',
            NE: 'niger',
            NG: 'nigeria',
            NU: 'niue',
            NF: 'norfolk island',
            KP: 'north korea',
            MP: 'northern mariana islands',
            NO: 'norway',
            OM: 'oman',
            PK: 'pakistan',
            PW: 'palau',
            PS: 'palestinian territories',
            PA: 'panama',
            PG: 'papua new guinea',
            PY: 'paraguay',
            PE: 'peru',
            PH: 'philippines',
            PN: 'pitcairn',
            PL: 'poland',
            PT: 'portugal',
            PR: 'puerto rico',
            QA: 'qatar',
            '**': 'reserved/private',
            RE: 'reunion',
            RO: 'romania',
            RU: 'russian federation',
            RW: 'rwanda',
            BL: 'saint barthelemy',
            KN: 'saint kitts and nevis',
            LC: 'saint lucia',
            MF: 'saint martin',
            VC: 'saint vincent and the grenadines',
            WS: 'samoa',
            SM: 'san marino',
            ST: 'sao tome and principe',
            SA: 'saudi arabia',
            SN: 'senegal',
            RS: 'serbia',
            SC: 'seychelles',
            SL: 'sierra leone',
            SG: 'singapore',
            SX: 'sint maarten',
            SK: 'slovakia (slovak republic)',
            SI: 'slovenia',
            SB: 'solomon islands',
            SO: 'somalia',
            ZA: 'south africa',
            GS: 'south georgia / south sandwich isl',
            KR: 'south korea',
            SS: 'south sudan',
            ES: 'spain',
            LK: 'sri lanka',
            SH: 'st. helena',
            PM: 'st. pierre and miquelon',
            SD: 'sudan',
            SR: 'suriname',
            SJ: 'svalbard and jan mayen islands',
            SZ: 'swaziland',
            SE: 'sweden',
            CH: 'switzerland',
            SY: 'syrian arab republic',
            TW: 'taiwan',
            TJ: 'tajikistan',
            TZ: 'tanzania',
            TH: 'thailand',
            TL: 'timor-leste',
            TG: 'togo',
            TK: 'tokelau',
            TO: 'tonga',
            TT: 'trinidad and tobago',
            TN: 'tunisia',
            TR: 'turkey',
            TM: 'turkmenistan',
            TC: 'turks and caicos islands',
            TV: 'tuvalu',
            UG: 'uganda',
            UA: 'ukraine',
            AE: 'united arab emirates',
            UK: 'united kingdom',
            US: 'united states',
            '?': 'unknown',
            UY: 'uruguay',
            UM: 'us minor outlying islands',
            VI: 'us virgin islands',
            UZ: 'uzbekistan',
            VU: 'vanuatu',
            VE: 'venezuela',
            VN: 'viet nam',
            WF: 'wallis and futuna islands',
            EH: 'western sahara',
            YE: 'yemen',
            ZM: 'zambia',
            ZW: 'zimbabwe',
            other: 'Not Listed'
        }

        function getList() {
            erp.load();
            erp.postFun('app/user/selectAffAccountList', {
                'distributionState': '2',
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
                        layer.msg(gjh27);
                    }
                    $scope.totalpage = function () {
                        return Math.ceil(n.data.totalNum / $scope.pagesize)
                    }
                    pageFun();
                }
            }
        }

        function Userinformation(id) {
            erp.load();
            $scope.UserData = null;
            erp.postFun('app/user/getAffUserInfo', { 'id': id }, con, err)

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
        $scope.review = function (item) {
            console.log(item);
            layer.confirm(gjh31, {
                title: '操作提示',
                icon: 3,
                btn: [gjh32, gjh33] //按钮
            }, function (ca) {
                console.log(gjh32)
                erp.postFun('app/user/updateAffAccountByDistributionState', {
                    id: item.id,
                    'distributionState': '4',
                }, function (res) {
                    if (res.data.code == 200) {
                        layer.msg(gjh24);
                        layer.close(ca);
                        getList();
                    } else {
                        layer.msg(gjh25)
                    }
                }, function (res) {
                    layer.msg(gjh25)
                })
            }, function (index) {
                console.log('通过')
                erp.postFun('app/user/updateAffAccountByDistributionState', {
                    id: item.id,
                    'distributionState': '3'
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
        //按下enter搜索
        $scope.enterDPsearch = function (event) {
            if (event.keyCode === 13 || event.keyCode === 108) {
                console.log('搜索条件', $scope.Dpsearch);
                $scope.Dpsearch = $scope.Dpsearch;
                $scope.Dppagenum = '1';
                DpgetList($scope.DpuserId);
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
                    $scope.pagenum = n + '';
                    getList();
                }
            });
        }

        //点击左侧导航栏刷新页面
        $scope.refresh = function () {
            window.location.reload();
        }
        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            $scope.pagenum = '1';
            getList();
        }
        $scope.pagenumchange = function () {
            console.log($scope.pagenum % 1)
            $scope.pagenum = $(".goyema").val();
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
            $scope.pagenum = '1';
            getList();
        }
        //按下enter搜索
        $scope.enterSearch = function (event) {
            if (event.keyCode === 13 || event.keyCode === 108) {
                console.log('搜索条件', $scope.search);
                $scope.orderBy = '';
                $scope.pagenum = '1';
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
    }])
    //erp erp审核未通过
    app.controller('customerunpassCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        $scope.customerdata = {
            normal: 0,
            black: 0,
            needaudit: 0,
            nopass: 0,
            shop: 0,
            affUserNum: 0
        }
        console.log($scope.customerdata)
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
        //枚举
        $scope.Country = {
            AF: 'afghanistan',
            AX: 'aland islands',
            AL: 'albania',
            DZ: 'algeria',
            AS: 'american samoa',
            AD: 'andorra',
            AO: 'angola',
            AI: 'anguilla',
            AQ: 'antarctica',
            AG: 'antigua and barbuda',
            AR: 'argentina',
            AM: 'armenia',
            AW: 'aruba',
            AP: 'asia (unknown country)',
            AU: 'australia',
            AT: 'austria',
            AZ: 'azerbaijan',
            BS: 'bahamas',
            BH: 'bahrain',
            BD: 'bangladesh',
            BB: 'barbados',
            BY: 'belarus',
            BE: 'belgium',
            BZ: 'belize',
            BJ: 'benin',
            BM: 'bermuda',
            BT: 'bhutan',
            BO: 'bolivia',
            BQ: 'bonaire/sint eustatius/saba',
            BA: 'bosnia and herzegowina',
            BW: 'botswana',
            BV: 'bouvet island',
            BR: 'brazil',
            IO: 'british indian ocean territory',
            VG: 'british virgin islands',
            BN: 'brunei darussalam',
            BG: 'bulgaria',
            BF: 'burkina faso',
            BI: 'burundi',
            KH: 'cambodia',
            CM: 'cameroon',
            CA: 'canada',
            CV: 'cape verde',
            KY: 'cayman islands',
            CF: 'central african republic',
            TD: 'chad',
            CL: 'chile',
            CN: 'China',
            CX: 'christmas island',
            CC: 'cocos (keeling) islands',
            CO: 'colombia',
            KM: 'comoros',
            CG: 'congo',
            CK: 'cook islands',
            CR: 'costa rica',
            CI: 'cote d ivoire',
            HR: 'croatia',
            CU: 'cuba',
            CW: 'curacao',
            CY: 'cyprus',
            CZ: 'czech republic',
            CD: 'democratic republic of the congo',
            DK: 'denmark',
            DJ: 'djibouti',
            DM: 'dominica',
            DO: 'dominican republic',
            EC: 'ecuador',
            EG: 'egypt',
            SV: 'el salvador',
            GQ: 'equatorial guinea',
            ER: 'eritrea',
            EE: 'estonia',
            ET: 'ethiopia',
            EU: 'europe (unknown country)',
            FK: 'falkland islands (malvinas)',
            FO: 'faroe islands',
            FM: 'federated states of micronesia',
            FJ: 'fiji',
            FI: 'finland',
            FR: 'france',
            GF: 'french guiana',
            PF: 'french polynesia',
            TF: 'french southern territories',
            GA: 'gabon',
            GM: 'gambia',
            GE: 'georgia',
            DE: 'germany',
            GH: 'ghana',
            GI: 'gibraltar',
            GR: 'greece',
            GL: 'greenland',
            GD: 'grenada',
            GP: 'guadeloupe',
            GU: 'guam',
            GT: 'guatemala',
            GG: 'guernsey',
            GN: 'guinea',
            GW: 'guinea-bissau',
            GY: 'guyana',
            HT: 'haiti',
            HM: 'heard and mc donald islands',
            VA: 'holy see (vatican city state)',
            HN: 'honduras',
            HK: 'hong kong',
            HU: 'hungary',
            IS: 'iceland',
            IN: 'india',
            ID: 'indonesia',
            IR: 'iran (islamic republic of)',
            IQ: 'iraq',
            IE: 'ireland',
            IM: 'isle of man',
            IL: 'israel',
            IT: 'italy',
            JM: 'jamaica',
            JP: 'japan',
            JE: 'jersey',
            JO: 'jordan',
            KZ: 'kazakhstan',
            KE: 'kenya',
            KI: 'kiribati',
            KW: 'kuwait',
            KG: 'kyrgyzstan',
            LA: 'lao peoples democratic republic',
            LV: 'latvia',
            LB: 'lebanon',
            LS: 'lesotho',
            LR: 'liberia',
            LY: 'libyan arab jamahiriya',
            LI: 'liechtenstein',
            LT: 'lithuania',
            LU: 'luxembourg',
            MO: 'macau',
            MK: 'macedonia',
            MG: 'madagascar',
            MW: 'malawi',
            MY: 'malaysia',
            MV: 'maldives',
            ML: 'mali',
            MT: 'malta',
            MH: 'marshall islands',
            MQ: 'martinique',
            MR: 'mauritania',
            MU: 'mauritius',
            YT: 'mayotte',
            MX: 'mexico',
            MD: 'moldova',
            MC: 'monaco',
            MN: 'mongolia',
            ME: 'montenegro',
            MS: 'montserrat',
            MA: 'morocco',
            MZ: 'mozambique',
            MM: 'myanmar',
            NA: 'namibia',
            NR: 'nauru',
            NP: 'nepal',
            NL: 'netherlands',
            AN: 'netherlands antilles',
            NC: 'new caledonia',
            NZ: 'new zealand',
            NI: 'nicaragua',
            NE: 'niger',
            NG: 'nigeria',
            NU: 'niue',
            NF: 'norfolk island',
            KP: 'north korea',
            MP: 'northern mariana islands',
            NO: 'norway',
            OM: 'oman',
            PK: 'pakistan',
            PW: 'palau',
            PS: 'palestinian territories',
            PA: 'panama',
            PG: 'papua new guinea',
            PY: 'paraguay',
            PE: 'peru',
            PH: 'philippines',
            PN: 'pitcairn',
            PL: 'poland',
            PT: 'portugal',
            PR: 'puerto rico',
            QA: 'qatar',
            '**': 'reserved/private',
            RE: 'reunion',
            RO: 'romania',
            RU: 'russian federation',
            RW: 'rwanda',
            BL: 'saint barthelemy',
            KN: 'saint kitts and nevis',
            LC: 'saint lucia',
            MF: 'saint martin',
            VC: 'saint vincent and the grenadines',
            WS: 'samoa',
            SM: 'san marino',
            ST: 'sao tome and principe',
            SA: 'saudi arabia',
            SN: 'senegal',
            RS: 'serbia',
            SC: 'seychelles',
            SL: 'sierra leone',
            SG: 'singapore',
            SX: 'sint maarten',
            SK: 'slovakia (slovak republic)',
            SI: 'slovenia',
            SB: 'solomon islands',
            SO: 'somalia',
            ZA: 'south africa',
            GS: 'south georgia / south sandwich isl',
            KR: 'south korea',
            SS: 'south sudan',
            ES: 'spain',
            LK: 'sri lanka',
            SH: 'st. helena',
            PM: 'st. pierre and miquelon',
            SD: 'sudan',
            SR: 'suriname',
            SJ: 'svalbard and jan mayen islands',
            SZ: 'swaziland',
            SE: 'sweden',
            CH: 'switzerland',
            SY: 'syrian arab republic',
            TW: 'taiwan',
            TJ: 'tajikistan',
            TZ: 'tanzania',
            TH: 'thailand',
            TL: 'timor-leste',
            TG: 'togo',
            TK: 'tokelau',
            TO: 'tonga',
            TT: 'trinidad and tobago',
            TN: 'tunisia',
            TR: 'turkey',
            TM: 'turkmenistan',
            TC: 'turks and caicos islands',
            TV: 'tuvalu',
            UG: 'uganda',
            UA: 'ukraine',
            AE: 'united arab emirates',
            UK: 'united kingdom',
            US: 'united states',
            '?': 'unknown',
            UY: 'uruguay',
            UM: 'us minor outlying islands',
            VI: 'us virgin islands',
            UZ: 'uzbekistan',
            VU: 'vanuatu',
            VE: 'venezuela',
            VN: 'viet nam',
            WF: 'wallis and futuna islands',
            EH: 'western sahara',
            YE: 'yemen',
            ZM: 'zambia',
            ZW: 'zimbabwe',
            other: 'Not Listed'
        }

        function getList() {
            erp.load();
            erp.postFun('app/user/selectAffAccountList', {
                'distributionState': '4',
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
                        layer.msg(gjh27);
                    }
                    $scope.totalpage = function () {
                        return Math.ceil(n.data.totalNum / $scope.pagesize)
                    }
                    pageFun();
                }
            }
        }

        function Userinformation(id) {
            erp.load();
            $scope.UserData = null;
            erp.postFun('app/user/getAffUserInfo', { 'id': id }, con, err)

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
        $scope.ReReview = function (item) {
            console.log(item);
            layer.confirm(gjh34, {
                title: '操作提示',
                icon: 3,
                btn: [gjh35, gjh33] //按钮
            }, function (ca) {
                console.log('永不通过')
                erp.postFun('app/user/updateAffAccountByDistributionState', {
                    id: item.id,
                    auditFlag: '1',
                    'distributionState': '4',
                }, function (res) {
                    if (res.data.code == 200) {
                        layer.msg(gjh24)
                        layer.close(ca);
                        getList();
                    } else {
                        layer.msg(gjh25)
                    }
                }, function (res) {
                    layer.msg(gjh25)
                })
            }, function (index) {
                erp.postFun('app/user/updateAffAccountByDistributionState', {
                    id: item.id,
                    'distributionState': '3'
                }, function (res) {
                    if (res.data.code == 200) {
                        layer.msg(gjh24)
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
                    $scope.pagenum = n + '';
                    getList();
                }
            });
        }

        //点击左侧导航栏刷新页面
        $scope.refresh = function () {
            window.location.reload();
        }
        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            $scope.pagenum = '1';
            getList();
        }
        $scope.pagenumchange = function () {
            console.log($scope.pagenum % 1)
            $scope.pagenum = $(".goyema").val();
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
            $scope.pagenum = '1';
            getList();
        }
        //按下enter搜索
        $scope.enterSearch = function (event) {
            if (event.keyCode === 13 || event.keyCode === 108) {
                console.log('搜索条件', $scope.search);
                $scope.orderBy = '';
                $scope.pagenum = '1';
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
    }])
    //erp erp黑名单
    app.controller('customerblacklistCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        $scope.customerdata = {
            normal: 0,
            black: 0,
            needaudit: 0,
            nopass: 0,
            shop: 0,
            affUserNum: 0
        }
        console.log($scope.customerdata)
        $scope.information = false;
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
        //枚举
        $scope.Country = {
            AF: 'afghanistan',
            AX: 'aland islands',
            AL: 'albania',
            DZ: 'algeria',
            AS: 'american samoa',
            AD: 'andorra',
            AO: 'angola',
            AI: 'anguilla',
            AQ: 'antarctica',
            AG: 'antigua and barbuda',
            AR: 'argentina',
            AM: 'armenia',
            AW: 'aruba',
            AP: 'asia (unknown country)',
            AU: 'australia',
            AT: 'austria',
            AZ: 'azerbaijan',
            BS: 'bahamas',
            BH: 'bahrain',
            BD: 'bangladesh',
            BB: 'barbados',
            BY: 'belarus',
            BE: 'belgium',
            BZ: 'belize',
            BJ: 'benin',
            BM: 'bermuda',
            BT: 'bhutan',
            BO: 'bolivia',
            BQ: 'bonaire/sint eustatius/saba',
            BA: 'bosnia and herzegowina',
            BW: 'botswana',
            BV: 'bouvet island',
            BR: 'brazil',
            IO: 'british indian ocean territory',
            VG: 'british virgin islands',
            BN: 'brunei darussalam',
            BG: 'bulgaria',
            BF: 'burkina faso',
            BI: 'burundi',
            KH: 'cambodia',
            CM: 'cameroon',
            CA: 'canada',
            CV: 'cape verde',
            KY: 'cayman islands',
            CF: 'central african republic',
            TD: 'chad',
            CL: 'chile',
            CN: 'China',
            CX: 'christmas island',
            CC: 'cocos (keeling) islands',
            CO: 'colombia',
            KM: 'comoros',
            CG: 'congo',
            CK: 'cook islands',
            CR: 'costa rica',
            CI: 'cote d ivoire',
            HR: 'croatia',
            CU: 'cuba',
            CW: 'curacao',
            CY: 'cyprus',
            CZ: 'czech republic',
            CD: 'democratic republic of the congo',
            DK: 'denmark',
            DJ: 'djibouti',
            DM: 'dominica',
            DO: 'dominican republic',
            EC: 'ecuador',
            EG: 'egypt',
            SV: 'el salvador',
            GQ: 'equatorial guinea',
            ER: 'eritrea',
            EE: 'estonia',
            ET: 'ethiopia',
            EU: 'europe (unknown country)',
            FK: 'falkland islands (malvinas)',
            FO: 'faroe islands',
            FM: 'federated states of micronesia',
            FJ: 'fiji',
            FI: 'finland',
            FR: 'france',
            GF: 'french guiana',
            PF: 'french polynesia',
            TF: 'french southern territories',
            GA: 'gabon',
            GM: 'gambia',
            GE: 'georgia',
            DE: 'germany',
            GH: 'ghana',
            GI: 'gibraltar',
            GR: 'greece',
            GL: 'greenland',
            GD: 'grenada',
            GP: 'guadeloupe',
            GU: 'guam',
            GT: 'guatemala',
            GG: 'guernsey',
            GN: 'guinea',
            GW: 'guinea-bissau',
            GY: 'guyana',
            HT: 'haiti',
            HM: 'heard and mc donald islands',
            VA: 'holy see (vatican city state)',
            HN: 'honduras',
            HK: 'hong kong',
            HU: 'hungary',
            IS: 'iceland',
            IN: 'india',
            ID: 'indonesia',
            IR: 'iran (islamic republic of)',
            IQ: 'iraq',
            IE: 'ireland',
            IM: 'isle of man',
            IL: 'israel',
            IT: 'italy',
            JM: 'jamaica',
            JP: 'japan',
            JE: 'jersey',
            JO: 'jordan',
            KZ: 'kazakhstan',
            KE: 'kenya',
            KI: 'kiribati',
            KW: 'kuwait',
            KG: 'kyrgyzstan',
            LA: 'lao peoples democratic republic',
            LV: 'latvia',
            LB: 'lebanon',
            LS: 'lesotho',
            LR: 'liberia',
            LY: 'libyan arab jamahiriya',
            LI: 'liechtenstein',
            LT: 'lithuania',
            LU: 'luxembourg',
            MO: 'macau',
            MK: 'macedonia',
            MG: 'madagascar',
            MW: 'malawi',
            MY: 'malaysia',
            MV: 'maldives',
            ML: 'mali',
            MT: 'malta',
            MH: 'marshall islands',
            MQ: 'martinique',
            MR: 'mauritania',
            MU: 'mauritius',
            YT: 'mayotte',
            MX: 'mexico',
            MD: 'moldova',
            MC: 'monaco',
            MN: 'mongolia',
            ME: 'montenegro',
            MS: 'montserrat',
            MA: 'morocco',
            MZ: 'mozambique',
            MM: 'myanmar',
            NA: 'namibia',
            NR: 'nauru',
            NP: 'nepal',
            NL: 'netherlands',
            AN: 'netherlands antilles',
            NC: 'new caledonia',
            NZ: 'new zealand',
            NI: 'nicaragua',
            NE: 'niger',
            NG: 'nigeria',
            NU: 'niue',
            NF: 'norfolk island',
            KP: 'north korea',
            MP: 'northern mariana islands',
            NO: 'norway',
            OM: 'oman',
            PK: 'pakistan',
            PW: 'palau',
            PS: 'palestinian territories',
            PA: 'panama',
            PG: 'papua new guinea',
            PY: 'paraguay',
            PE: 'peru',
            PH: 'philippines',
            PN: 'pitcairn',
            PL: 'poland',
            PT: 'portugal',
            PR: 'puerto rico',
            QA: 'qatar',
            '**': 'reserved/private',
            RE: 'reunion',
            RO: 'romania',
            RU: 'russian federation',
            RW: 'rwanda',
            BL: 'saint barthelemy',
            KN: 'saint kitts and nevis',
            LC: 'saint lucia',
            MF: 'saint martin',
            VC: 'saint vincent and the grenadines',
            WS: 'samoa',
            SM: 'san marino',
            ST: 'sao tome and principe',
            SA: 'saudi arabia',
            SN: 'senegal',
            RS: 'serbia',
            SC: 'seychelles',
            SL: 'sierra leone',
            SG: 'singapore',
            SX: 'sint maarten',
            SK: 'slovakia (slovak republic)',
            SI: 'slovenia',
            SB: 'solomon islands',
            SO: 'somalia',
            ZA: 'south africa',
            GS: 'south georgia / south sandwich isl',
            KR: 'south korea',
            SS: 'south sudan',
            ES: 'spain',
            LK: 'sri lanka',
            SH: 'st. helena',
            PM: 'st. pierre and miquelon',
            SD: 'sudan',
            SR: 'suriname',
            SJ: 'svalbard and jan mayen islands',
            SZ: 'swaziland',
            SE: 'sweden',
            CH: 'switzerland',
            SY: 'syrian arab republic',
            TW: 'taiwan',
            TJ: 'tajikistan',
            TZ: 'tanzania',
            TH: 'thailand',
            TL: 'timor-leste',
            TG: 'togo',
            TK: 'tokelau',
            TO: 'tonga',
            TT: 'trinidad and tobago',
            TN: 'tunisia',
            TR: 'turkey',
            TM: 'turkmenistan',
            TC: 'turks and caicos islands',
            TV: 'tuvalu',
            UG: 'uganda',
            UA: 'ukraine',
            AE: 'united arab emirates',
            UK: 'united kingdom',
            US: 'united states',
            '?': 'unknown',
            UY: 'uruguay',
            UM: 'us minor outlying islands',
            VI: 'us virgin islands',
            UZ: 'uzbekistan',
            VU: 'vanuatu',
            VE: 'venezuela',
            VN: 'viet nam',
            WF: 'wallis and futuna islands',
            EH: 'western sahara',
            YE: 'yemen',
            ZM: 'zambia',
            ZW: 'zimbabwe',
            other: 'Not Listed'
        }

        function getList() {
            erp.load();
            erp.postFun('app/user/selectAffAccountList', {
                'distributionState': '5',
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
                        layer.msg(gjh27);
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
            erp.postFun('app/user/selectAccountList', { 'userId': userId }, con, err)

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
                        layer.msg(gjh27);
                        item.dw = false;
                    }
                }
            }
        }

        function Userinformation(id) {
            erp.load();
            $scope.UserData = null;
            erp.postFun('app/user/getAffUserInfo', { 'id': id }, con, err)

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
        $scope.DismissBlack = function (item) {
            console.log(item);
            layer.confirm(gjh36, {
                title: '操作提示',
                icon: 3,
                btn: [gjh10, gjh37] //按钮
            }, function (ca) {
                console.log(gjh10)
                layer.close(ca);
            }, function (index) {
                erp.postFun('app/user/updateAffAccountByDistributionState', {
                    id: item.id,
                    'distributionState': '3',
                    'sign': '5'
                }, function (res) {
                    if (res.data.code == 200) {
                        layer.msg(gjh24)
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
                    $scope.pagenum = n + '';
                    getList();
                }
            });
        }

        //点击左侧导航栏刷新页面
        $scope.refresh = function () {
            window.location.reload();
        }
        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            $scope.pagenum = '1';
            getList();
        }
        $scope.pagenumchange = function () {
            console.log($scope.pagenum % 1)
            $scope.pagenum = $(".goyema").val();
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
            $scope.pagenum = '1';
            getList();
        }
        //按下enter搜索
        $scope.enterSearch = function (event) {
            if (event.keyCode === 13 || event.keyCode === 108) {
                console.log('搜索条件', $scope.search);
                $scope.orderBy = '';
                $scope.pagenum = '1';
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
    }])
    //erp erp佣金管理
    app.controller('customeryongjinCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        $scope.information = false;
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
        //
        $scope.jiaoyiDialog = false;
        $scope.tixianDialog = false;
        //枚举
        $scope.Country = {
            AF: 'afghanistan',
            AX: 'aland islands',
            AL: 'albania',
            DZ: 'algeria',
            AS: 'american samoa',
            AD: 'andorra',
            AO: 'angola',
            AI: 'anguilla',
            AQ: 'antarctica',
            AG: 'antigua and barbuda',
            AR: 'argentina',
            AM: 'armenia',
            AW: 'aruba',
            AP: 'asia (unknown country)',
            AU: 'australia',
            AT: 'austria',
            AZ: 'azerbaijan',
            BS: 'bahamas',
            BH: 'bahrain',
            BD: 'bangladesh',
            BB: 'barbados',
            BY: 'belarus',
            BE: 'belgium',
            BZ: 'belize',
            BJ: 'benin',
            BM: 'bermuda',
            BT: 'bhutan',
            BO: 'bolivia',
            BQ: 'bonaire/sint eustatius/saba',
            BA: 'bosnia and herzegowina',
            BW: 'botswana',
            BV: 'bouvet island',
            BR: 'brazil',
            IO: 'british indian ocean territory',
            VG: 'british virgin islands',
            BN: 'brunei darussalam',
            BG: 'bulgaria',
            BF: 'burkina faso',
            BI: 'burundi',
            KH: 'cambodia',
            CM: 'cameroon',
            CA: 'canada',
            CV: 'cape verde',
            KY: 'cayman islands',
            CF: 'central african republic',
            TD: 'chad',
            CL: 'chile',
            CN: 'China',
            CX: 'christmas island',
            CC: 'cocos (keeling) islands',
            CO: 'colombia',
            KM: 'comoros',
            CG: 'congo',
            CK: 'cook islands',
            CR: 'costa rica',
            CI: 'cote d ivoire',
            HR: 'croatia',
            CU: 'cuba',
            CW: 'curacao',
            CY: 'cyprus',
            CZ: 'czech republic',
            CD: 'democratic republic of the congo',
            DK: 'denmark',
            DJ: 'djibouti',
            DM: 'dominica',
            DO: 'dominican republic',
            EC: 'ecuador',
            EG: 'egypt',
            SV: 'el salvador',
            GQ: 'equatorial guinea',
            ER: 'eritrea',
            EE: 'estonia',
            ET: 'ethiopia',
            EU: 'europe (unknown country)',
            FK: 'falkland islands (malvinas)',
            FO: 'faroe islands',
            FM: 'federated states of micronesia',
            FJ: 'fiji',
            FI: 'finland',
            FR: 'france',
            GF: 'french guiana',
            PF: 'french polynesia',
            TF: 'french southern territories',
            GA: 'gabon',
            GM: 'gambia',
            GE: 'georgia',
            DE: 'germany',
            GH: 'ghana',
            GI: 'gibraltar',
            GR: 'greece',
            GL: 'greenland',
            GD: 'grenada',
            GP: 'guadeloupe',
            GU: 'guam',
            GT: 'guatemala',
            GG: 'guernsey',
            GN: 'guinea',
            GW: 'guinea-bissau',
            GY: 'guyana',
            HT: 'haiti',
            HM: 'heard and mc donald islands',
            VA: 'holy see (vatican city state)',
            HN: 'honduras',
            HK: 'hong kong',
            HU: 'hungary',
            IS: 'iceland',
            IN: 'india',
            ID: 'indonesia',
            IR: 'iran (islamic republic of)',
            IQ: 'iraq',
            IE: 'ireland',
            IM: 'isle of man',
            IL: 'israel',
            IT: 'italy',
            JM: 'jamaica',
            JP: 'japan',
            JE: 'jersey',
            JO: 'jordan',
            KZ: 'kazakhstan',
            KE: 'kenya',
            KI: 'kiribati',
            KW: 'kuwait',
            KG: 'kyrgyzstan',
            LA: 'lao peoples democratic republic',
            LV: 'latvia',
            LB: 'lebanon',
            LS: 'lesotho',
            LR: 'liberia',
            LY: 'libyan arab jamahiriya',
            LI: 'liechtenstein',
            LT: 'lithuania',
            LU: 'luxembourg',
            MO: 'macau',
            MK: 'macedonia',
            MG: 'madagascar',
            MW: 'malawi',
            MY: 'malaysia',
            MV: 'maldives',
            ML: 'mali',
            MT: 'malta',
            MH: 'marshall islands',
            MQ: 'martinique',
            MR: 'mauritania',
            MU: 'mauritius',
            YT: 'mayotte',
            MX: 'mexico',
            MD: 'moldova',
            MC: 'monaco',
            MN: 'mongolia',
            ME: 'montenegro',
            MS: 'montserrat',
            MA: 'morocco',
            MZ: 'mozambique',
            MM: 'myanmar',
            NA: 'namibia',
            NR: 'nauru',
            NP: 'nepal',
            NL: 'netherlands',
            AN: 'netherlands antilles',
            NC: 'new caledonia',
            NZ: 'new zealand',
            NI: 'nicaragua',
            NE: 'niger',
            NG: 'nigeria',
            NU: 'niue',
            NF: 'norfolk island',
            KP: 'north korea',
            MP: 'northern mariana islands',
            NO: 'norway',
            OM: 'oman',
            PK: 'pakistan',
            PW: 'palau',
            PS: 'palestinian territories',
            PA: 'panama',
            PG: 'papua new guinea',
            PY: 'paraguay',
            PE: 'peru',
            PH: 'philippines',
            PN: 'pitcairn',
            PL: 'poland',
            PT: 'portugal',
            PR: 'puerto rico',
            QA: 'qatar',
            '**': 'reserved/private',
            RE: 'reunion',
            RO: 'romania',
            RU: 'russian federation',
            RW: 'rwanda',
            BL: 'saint barthelemy',
            KN: 'saint kitts and nevis',
            LC: 'saint lucia',
            MF: 'saint martin',
            VC: 'saint vincent and the grenadines',
            WS: 'samoa',
            SM: 'san marino',
            ST: 'sao tome and principe',
            SA: 'saudi arabia',
            SN: 'senegal',
            RS: 'serbia',
            SC: 'seychelles',
            SL: 'sierra leone',
            SG: 'singapore',
            SX: 'sint maarten',
            SK: 'slovakia (slovak republic)',
            SI: 'slovenia',
            SB: 'solomon islands',
            SO: 'somalia',
            ZA: 'south africa',
            GS: 'south georgia / south sandwich isl',
            KR: 'south korea',
            SS: 'south sudan',
            ES: 'spain',
            LK: 'sri lanka',
            SH: 'st. helena',
            PM: 'st. pierre and miquelon',
            SD: 'sudan',
            SR: 'suriname',
            SJ: 'svalbard and jan mayen islands',
            SZ: 'swaziland',
            SE: 'sweden',
            CH: 'switzerland',
            SY: 'syrian arab republic',
            TW: 'taiwan',
            TJ: 'tajikistan',
            TZ: 'tanzania',
            TH: 'thailand',
            TL: 'timor-leste',
            TG: 'togo',
            TK: 'tokelau',
            TO: 'tonga',
            TT: 'trinidad and tobago',
            TN: 'tunisia',
            TR: 'turkey',
            TM: 'turkmenistan',
            TC: 'turks and caicos islands',
            TV: 'tuvalu',
            UG: 'uganda',
            UA: 'ukraine',
            AE: 'united arab emirates',
            UK: 'united kingdom',
            US: 'united states',
            '?': 'unknown',
            UY: 'uruguay',
            UM: 'us minor outlying islands',
            VI: 'us virgin islands',
            UZ: 'uzbekistan',
            VU: 'vanuatu',
            VE: 'venezuela',
            VN: 'viet nam',
            WF: 'wallis and futuna islands',
            EH: 'western sahara',
            YE: 'yemen',
            ZM: 'zambia',
            ZW: 'zimbabwe',
            other: 'Not Listed'
        }
        function getList() {
            erp.postFun('erp/afProfitMargin/queryByErpListPage', {
                'customerName': $scope.search,
                'pageSize': $scope.pagesize,
                'pageNo': $scope.pagenum
            }, function (n) {
                if (n.data.code == 200) {
                    $scope.AffiliateList =  n.data.data;
                    $scope.totalNum = n.data.totle || 0;
                    $scope.totalpage = function () {
                        return Math.ceil($scope.totalNum / $scope.pagesize)
                    }
                    pageFun();
                }
            }, function () {

            },{layer:true})
        }
        getList();
        function Userinformation(id) {
            erp.load();
            $scope.UserData = null;
            erp.postFun('app/user/getAffUserInfo', { 'id': id }, con, err)

            function con(n) {
                erp.closeLoad();
                if (n.data.code == 200) {
                    $scope.UserData = n.data.affUserInfo;
                }
            }
        }
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
        //交易数量点击
        $scope.jiaoyiDetail = function (item) {
            console.log(item);
            $scope.jiaoyiDialog = true;
            $scope.cjId = '';
            $scope.salesman = '';
            $scope.name = '';
            $scope.jiaoyiList = [];
            $scope.jiaoyi_pagenum = '1';
            $scope.jiaoyi_pagesize = '8';
            jiaoyiData(item)

        }
        function jiaoyiData(item){
            erp.postFun('erp/afProfitMargin/queryByDetalListPage', {
                fxCustomerId:item.rid,
                customerName:item.customerName,
                relateSalesman:item.relateSalesman,
                cjNum:item.cjNum,
                type:'1',
                'pageSize': $scope.jiaoyi_pagesize,
                'pageNo': $scope.jiaoyi_pagenum
            }, function (res) {
                if (res.data.code == 200) {
                    $scope.cjId = res.data.cjId;
                    $scope.salesman = res.data.salesman;
                    $scope.name = res.data.name;
                    $scope.jiaoyiList = res.data.data;
                    $scope.jiaoyi_totalNum = res.data.totle || 0;
                    jiaoyi_pageFun(item)
                }
            }, function (err) {

            },{layer:true})
        }
        //提现金额点击
        $scope.tixianDetail = function (item) {
            console.log(item);
            $scope.tixianDialog = true;
            $scope.cjId = '';
            $scope.salesman = '';
            $scope.name = '';
            $scope.tixianList = [];
            $scope.tixian_pagenum = '1';
            $scope.tixian_pagesize = '8';
            tixianData(item)
        }
        function tixianData(item){
            erp.postFun('erp/afProfitMargin/getWithdrawDetilPage', {
                id:item.rid,
                customerName:item.customerName,
                relateSalesman:item.relateSalesman,
                cjNum:item.cjNum,
                'pageSize': $scope.tixian_pagesize,
                'pageNo': $scope.tixian_pagenum
            }, function (res) {
                if (res.data.code == 200) {
                    $scope.cjId = res.data.cjId;
                    $scope.salesman = res.data.salesman;
                    $scope.name = res.data.name;
                    $scope.tixianList = res.data.data;
                    $scope.tixian_totalNum = res.data.totle || 0;
                    tixian_pageFun(item)
                }
            }, function (err) {

            },{layer:true})
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
                    $scope.pagenum = n + '';
                    getList();
                }
            });
        }
        function tixian_pageFun(item) {
            $(".tixian-page").jqPaginator({
                totalCounts: $scope.tixian_totalNum || 1,
                pageSize: $scope.tixian_pagesize * 1,
                visiblePages: 5,
                currentPage: $scope.tixian_pagenum * 1,
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
                    $scope.tixian_pagenum = n + '';
                    tixianData(item)
                }
            });
        }
        function jiaoyi_pageFun(item) {
            $(".jiaoyi-page").jqPaginator({
                totalCounts: $scope.jiaoyi_totalNum || 1,
                pageSize: $scope.jiaoyi_pagesize * 1,
                visiblePages: 5,
                currentPage: $scope.jiaoyi_pagenum * 1,
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
                    $scope.jiaoyi_pagenum = n + '';
                    jiaoyiData(item)
                }
            });
        }

        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            $scope.pagenum = '1';
            getList();
        }
        $scope.pagenumchange = function () {
            console.log($scope.pagenum % 1)
            $scope.pagenum = $(".goyema").val();
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
            $scope.pagenum = '1';
            getList();
        }
        //按下enter搜索
        $scope.enterSearch = function (event) {
            if (event.keyCode === 13 || event.keyCode === 108) {
                console.log('搜索条件', $scope.search);
                $scope.orderBy = '';
                $scope.pagenum = '1';
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
    }])
    //erp erpFAQ
    app.controller('customerFAQCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        $scope.customerdata = {
            normal: 0,
            black: 0,
            needaudit: 0,
            nopass: 0,
            shop: 0,
            affUserNum: 0
        }
        $scope.search = '';
        $scope.pagesize = '10';
        $scope.pagenum = '1';
        $scope.pagenumarr = [5, 10, 20, 30, 50];
        $scope.totalNum = 0;
        $scope.addDialog = false;
        $scope.tit = '新增FAQ';
        function getList() {
            erp.load();
            erp.postFun('app/questions/selectQuestionsAndAnswers', {
                'title': $scope.search,
                'pageNum': $scope.pagesize,
                'page': $scope.pagenum
            }, con, err)

            function con(n) {
                erp.closeLoad();
                if (n.data.code == 200) {
                    var obj = n.data.list;
                    obj.dw = false;
                    $scope.dataList = obj;
                    $scope.totalNum = n.data.totalNum || 0;
                    if (n.data.totalNum == 0) {
                        $scope.totalpage = 0;
                        $scope.dataList = [];
                        layer.msg(gjh27);
                    }
                    $scope.totalpage = function () {
                        return Math.ceil(n.data.totalNum / $scope.pagesize)
                    }
                    pageFun();
                }
            }
        }
        getList();
        //富文本编辑器
        var E = window.wangEditor;
        var editor = new E('#wang');
        editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
        editor.create();
        //新增
        $scope.addFaq = function () {
            $scope.title = '';
            editor.txt.html('');
            $scope.addORedit = 'add';
            $scope.addDialog = true;
        }
        //编辑
        $scope.edit = function (item) {
            $scope.addDialog = true;
            $scope.tit = '编辑FAQ';
            $scope.addORedit = 'edit';
            $scope.title = item.title;
            editor.txt.html(item.answer);
            $scope.item = item;
        }
        $scope.consub = function () {
            console.log($scope.title);
            console.log(editor.txt.html())
            if ($scope.addORedit == 'add') {
                erp.postFun('app/questions/createQuestionsAndAnswers', {
                    'title': $scope.title,
                    'answer': editor.txt.html(),
                }, function (res) {
                    if (res.data.statusCode == 200) {
                        layer.msg(gjh38);
                        $scope.title = '';
                        editor.txt.html('');
                        $scope.addDialog = false;
                        getList();
                    }
                }, err)
            } else if ($scope.addORedit == 'edit') {
                erp.postFun('app/questions/updateQuestionsAndAnswers', {
                    'id': $scope.item.id,
                    'title': $scope.title,
                    'answer': editor.txt.html()
                }, function (res) {
                    if (res.data.code == 200) {
                        layer.msg(gjh39);
                        $scope.title = '';
                        editor.txt.html('');
                        $scope.addDialog = false;
                        getList();
                    }
                }, err)
            }
        }
        //删除
        $scope.delete = function (item) {
            console.log(item);
            layer.confirm(gjh41, {
                title: '操作提示',
                icon: 3,
                btn: [gjh10, gjh09] //按钮
            }, function (ca) {
                console.log(gjh10)
                layer.close(ca);
            }, function (index) {
                erp.postFun('app/questions/addFlagToQuestionsAndAnswers', {
                    id: item.id
                }, function (res) {
                    if (res.data.code == 200) {
                        layer.msg(gjh47)
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
                    $scope.pagenum = n + '';
                    getList();
                }
            });
        }

        //
        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            $scope.pagenum = '1';
            getList();
        }
        $scope.pagenumchange = function () {
            console.log($scope.pagenum % 1)
            $scope.pagenum = $(".goyema").val();
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
            $scope.pagenum = '1';
            getList();
        }
        //按下enter搜索
        $scope.enterSearch = function (event) {
            if (event.keyCode === 13 || event.keyCode === 108) {
                console.log('搜索条件', $scope.search);
                $scope.orderBy = '';
                $scope.pagenum = '1';
                getList();
            }
        }

    }])

    // erp客户公海
    app.controller('customerGHCtrl', ['$scope', 'erp', '$location', 'merchan', function ($scope, erp, $location, merchan) {
        $scope.customerdata = {};
        $scope.customerdata = {
            normal: 0,
            black: 0,
            needaudit: 0,
            nopass: 0,
            shop: 0,
            affUserNum: 0,
            customerResourceNum: 0
        }
        var bs = new Base64();
        var logiName = localStorage.getItem('erploginName') ? bs.decode(localStorage.getItem('erploginName')) : '';
        console.log(logiName)
        if (logiName == 'admin') {
            $scope.dcAdminFlag = true;
        } else {
            $scope.dcAdminFlag = false;
        }
        $scope.pageSize = '20';
        $scope.pageNum = '1';
        $scope.totalNum = 0;
        $scope.totalPageNum = 0;
        $scope.searchinfo = '';
        $scope.startDate = '';
        $scope.endDate = '';
        // 获取列表
        function getList(erp, $scope) {
            erp.load();
            erp.postFun("app/customer/getCustomerResourceList", {
                'name': $scope.sername,
                'emailId': $scope.seremailId,
                'skypeId': $scope.serskypeId,
                'whatsAppId': $scope.serwhatsAppId,
                'page': $scope.pageNum,
                'limit': $scope.pageSize,
                'startDate': $scope.startDate,
                'endDate': $scope.endDate
            }, function (n) {
                erp.closeLoad();
                console.log(n);
                if (n.data.code != 200) {
                    layer.msg(gjh28);
                    return;
                }
                var obj = n.data.list;
                console.log(n.data.list)
                if (obj.totalNum == 0) {
                    $scope.totalpage = 0;
                    $scope.custExhiList = [];
                    layer.msg(gjh27);
                    return;
                }
                $scope.totalNum = n.data.totalNum;
                $scope.custExhiList = obj;
                console.log($scope.custExhiList);
                $scope.totalPageNum = Math.ceil(($scope.totalNum * 1) / ($scope.pageSize * 1));
                pageFun(erp, $scope);
            }, err);
        }
        getList(erp, $scope);
        //分页
        function pageFun(erp, $scope) {
            $(".page-index").jqPaginator({
                totalCounts: $scope.totalNum - 0 || 1,
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
                    $scope.pageNum = n + '';
                    getList(erp, $scope)
                }
            });
        }
        $scope.pagechange = function (pagesize) {
            console.log(pagesize);
            $scope.pageNum = '1';
            getList(erp, $scope);
        };
        $scope.pagenumchange = function () {
            console.log($scope.pageNum, $scope.totalPageNum);
            if (isNaN($scope.pageNum) || $scope.pageNum * 1 < 1 || $scope.pageNum * 1 > $scope.totalPageNum) {
                layer.msg(gjh29)
            } else {
                getList(erp, $scope);
            }
        };
        //搜索客户
        $('#selectType').change(function () {
            $('#searchInput').val('');
        });
        $scope.searchcustomer = function () {
            //console.log('搜索条件', $scope.searchinfo);
            var val = $('#searchInput').val();
            var type = $('#selectType').val();
            if (type == 'sername') {
                $scope.sername = val;
                $scope.seremailId = '';
                $scope.serskypeId = '';
                $scope.serwhatsAppId = '';
            } else if (type == 'seremailId') {
                $scope.sername = '';
                $scope.seremailId = val;
                $scope.serskypeId = '';
                $scope.serwhatsAppId = '';
            } else if (type == 'serskypeId') {
                $scope.sername = '';
                $scope.seremailId = '';
                $scope.serskypeId = val;
                $scope.serwhatsAppId = '';
            } else if (type == 'serwhatsAppId') {
                $scope.sername = '';
                $scope.seremailId = '';
                $scope.serskypeId = '';
                $scope.serwhatsAppId = val;
            }
            var start = $('#c-data-time2').val();
            var end = $('#cdatatime3').val();
            $scope.startDate = start;
            $scope.endDate = end;
            $scope.pageNum = '1';
            getList(erp, $scope);
        };
        //按下enter搜索
        $scope.enterSearch = function (event) {
            if (event.keyCode === 13 || event.keyCode === 108) {
                $scope.pageNum = '1';
                getList(erp, $scope);
            }
        };
        //上传excel
        $scope.addExcel = function () {
            document.getElementById('upexcel').click();
        };
        $scope.upLoadExcelFun = function (file) {
            console.log(file);
            //var filetype = document.getElementById("upexcel").files[0];
            //console.log(filetype);
            var index = file[0].name.lastIndexOf('.');
            var ext = file[0].name.substring(index + 1, file[0].name.length);
            console.log(ext);
            if (ext != "xlsx" && ext != "xls") {
                layer.msg(gjh42);
                return;
            }
            erp.load();
            console.log($('#upexcel')[0].files[0]);
            var formData = new FormData();
            formData.append('name', $('#upexcel').val());
            formData.append('file', $('#upexcel')[0].files[0]);
            console.log(formData);
            //formData.append("shipmentsOrderId",scId);
            erp.upLoadImgPost('app/customer/uploadDataByExcel', formData, function (data) {
                console.log(data);
                layer.closeAll("loading");
                if (data.data.code == 200) {
                    layer.msg(gjh43);
                    $('#upexcel').val('');
                    getList(erp, $scope);
                } else {
                    layer.msg(gjh44)
                }
            }, function (data) {
                layer.closeAll("loading")
            })
        };
        //add
        $scope.addCustomer = function (item, index) {
            $scope.grantGiftFlag = true;
            $scope.name = '';
            $scope.emailId = '';
            $scope.whatsAppId = '';
            $scope.skypeId = '';
            $scope.Facebook = '';
            $scope.PhoneNumber = '';
            $scope.remark = '';
        }
        $scope.classOperator = function (name) {
            if (name) {
                return name;
            } else {
                return '--';
            }
        }
        $scope.confCustomer = function () {
            if(!$scope.name){
                layer.msg('姓名必填！');
                return;
            }
            var data = {
                name: $scope.name,
                emailId: $scope.emailId,
                whatsAppId: $scope.whatsAppId,
                skypeId: $scope.skypeId,
                Facebook: $scope.Facebook,
                PhoneNumber: $scope.PhoneNumber,
                remark: $scope.remark,
                //businessCategoryId:$scope.selectedCategoryId
            };
            erp.postFun("app/customer/addCustomerResource", data, function (n) {
                if (n.data.code == 200) {
                    layer.msg(gjh38);
                    $scope.grantGiftFlag = false;
                    getList(erp, $scope);
                    $scope.name = '';
                    $scope.skypeId = '';
                    $scope.emailId = '';
                    $scope.whatsAppId = '';
                    $scope.remark = '';
                } else {
                    layer.msg(n.data.message);
                }
            }, function (n) {

            })
        };
        //
        $scope.CategoryList = '';
        $scope.CategoryClick = function (item) {
            $scope.isCategory = true;
            $scope.CategoryList = item;
            console.log(item);
            $scope.firstMenu = '';
            $scope.secondMenu = '';
            $scope.thirdMenu = '';
            $scope.categoryListTwo = [];
            $scope.categoryListThree = [];
            var arr = item.businessCategoryId.split("/");
            console.log(arr);
            $scope.categoryOne = arr[0];
            $scope.categoryTwo = arr[1];
            $scope.categoryThree = arr[2];
            $scope.categoryListOne.forEach(function (o, i) {
                if (o.name == arr[0]) {
                    $scope.firstMenu = $scope.categoryListOne[i];
                    console.log(o);
                    $scope.categoryListTwo = o.children;
                    o.children.forEach(function (a, b) {
                        if (a.name == arr[1]) {
                            $scope.secondMenu = o.children[b];
                            console.log(a);
                            $scope.categoryListThree = a.children;
                            a.children.forEach(function (k, j) {
                                if (k.name == arr[2]) {
                                    $scope.thirdMenu = a.children[j];
                                    console.log(k)
                                }
                            })
                        }
                    })
                }
            })
        };
        // 获取商品目录列表
        $scope.categoryListOne = [];
        $scope.categoryListTwo = [];
        $scope.categoryListThree = [];
        $scope.categoryOne = '';
        $scope.categoryTwo = '';
        $scope.categoryThree = '';
        merchan.getCateListOne(function (data) {
            console.log(data);
            $scope.categoryListOne = data;
        });
        $scope.selectOne = function (item) {
            console.log(item);
            if (item) {
                $scope.categoryOne = item.name;
                $scope.categoryListTwo = item.children;
                console.log($scope.categoryOne)
            } else {
                $scope.categoryOne = '';
                $scope.categoryTwo = '';
                $scope.categoryThree = '';
                $scope.categoryListTwo = [];
            }
        };
        $scope.selectTwo = function (item) {
            console.log(item);
            if (item) {
                $scope.categoryTwo = item.name;
                $scope.categoryListThree = item.children;
                console.log($scope.categoryTwo)
            } else {
                $scope.categoryTwo = '';
                $scope.categoryThree = '';
                $scope.categoryListThree = [];
            }
        };
        $scope.selectThree = function (item) {
            console.log(item);
            if (item) {
                $scope.categoryThree = item.name;
            } else {
                $scope.categoryThree = '';
            }
        };
        $scope.confCategory = function () {
            var CategoryName;
            if (!$scope.categoryOne) {
                CategoryName = '';
                //layer.msg(gjh52)
            } else if (!$scope.categoryTwo) {
                //layer.msg(gjh53)
                CategoryName = $scope.categoryOne;
            } else if (!$scope.categoryThree) {
                //layer.msg(gjh54)
                CategoryName = $scope.categoryOne + '/' + $scope.categoryTwo;
            } else {
                CategoryName = $scope.categoryOne + '/' + $scope.categoryTwo + '/' + $scope.categoryThree;
            }

            console.log(CategoryName);
            var data = {
                id: $scope.CategoryList.id,
                businessCategoryId: CategoryName
            };
            if ($scope.CategoryList.status == '') {
                data.status = '0';
            } else {
                data.status = $scope.CategoryList.status;
            }
            console.log(data);
            erp.postFun('app/customer/upBusinessCategory', data, function (data) {
                if (data.data.code == 200) {
                    $scope.isCategory = false;
                    layer.msg(gjh39);
                    getList(erp, $scope);
                } else {
                    layer.msg(gjh40)
                }
            }, function (data) {
                layer.msg(gjh46)
            })

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
        console.log('客户公海')
        //导出
        var selIds = '';
        $scope.daoChuFun = function () {
            // selIds = '';
            // var selCount = 0;
            // $('#c-mu-ord .c-mu-chekbox').each(function () {
            //     console.log($(this).attr('src'))
            //     if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
            //         selCount++;
            //         selIds += $(this).siblings('.hide-order-id').text() + ',';
            //     }
            // })
            // if (selCount < 1) {
            //     layer.msg('请选择客户')
            //     return;
            // }
            // else {
            //     $scope.daoChuFlag = true;
            // }
            var start = $('#c-data-time2').val();
            var end = $('#cdatatime3').val();
            erp.load();
            erp.postFun("app/client_erp/exportCustomerAll", {
                'name': $scope.sername,
                'emailId': $scope.seremailId,
                'skypeId': $scope.serskypeId,
                'whatsAppId': $scope.serwhatsAppId,
                'startDate': start,
                'endDate': end
            }, function (data) {
                console.log(data)
                erp.closeLoad()
                if (data.data.statusCode == 200) {
                    console.log(data.data.result)
                    var result = JSON.parse(data.data.result)
                    console.log(result)
                    $scope.excelLink = result.href;
                    $scope.daoChuFlag = true;
                } else {
                    if (data.data.message) {
                        layer.msg(data.data.message)
                    } else {
                        layer.msg('导出失败')
                    }
                }
            }, function (data) {
                console.log(data)
                erp.closeLoad()
            })
        }
        $scope.downExcelFun = function () {
            location.href = $scope.excelLink;
            $scope.daoChuFlag = false;
        }
        $scope.closeExcelFun = function () {
            $scope.daoChuFlag = false;
        }
    }]);
    //客户分配
    app.controller('staffclientCtrl', ['$scope', 'erp', function ($scope, erp) {

        //    $(function () {
        //
        //      $("#txtBeginDate").calendar({
        //          controlId: "divDate",                                 // 弹出的日期控件ID，默认: $(this).attr("id") + "Calendar"
        //          speed: 200,                                           // 三种预定速度之一的字符串("slow", "normal", or "fast")或表示动画时长的毫秒数值(如：1000),默认：200
        //          complement: true,                                     // 是否显示日期或年空白处的前后月的补充,默认：true
        //          readonly: true,                                       // 目标对象是否设为只读，默认：true
        //          upperLimit: new Date(),                               // 日期上限，默认：NaN(不限制)
        //          lowerLimit: new Date("2011/01/01"),                   // 日期下限，默认：NaN(不限制)
        //          callback: function () {                               // 点击选择日期后的回调函数
        //          //alert("您选择的日期是：" + $("#txtBeginDate").val());
        //          }
        //      });
        //      $("#txtEndDate").calendar();
        //  });

    }]);

    //客户管理
    app.controller('CustomerManagementCtrl', ['$scope', 'erp', '$location', '$routeParams', function ($scope, erp, $location, $routeParams) {
        console.log('CustomerManagementCtrl');
        // console.log(window.location.href);
        /** 客户管理 model */
        $scope.searchModel = {
            "kehuList": { val: 1, txt: '客户列表'},
            "uruguay": { val: 2, txt: '乌拉圭'},
            "shopify": { val: 3, txt: 'shopify'},
            "shopmaster": { val: 4, txt: 'shopmaster'}
        }

        // 客户档案跳转过来 LOGIN_NAME 参数
        var href = window.location.href
        var detail = href.indexOf('/detail')
        var LOGIN_NAME = ''
        if (detail > 0) {
          LOGIN_NAME = href.substr(detail + 7)
        }
        var base64 = new Base64();


        //var myChart3;
        //var myChart4;
        //$scope.definedFlag = false;



        $scope.zhuceType = '1';
        //$('.searchGG').hide();
        $scope.moreListFun = function (type) {
            location.href = '#/erpcustomer/khfxlb/' + type;
        };
        $scope.morelost = function () {
            location.href = '#/erpcustomer/lostCustomer';
        }
        $scope.openDetail = function (id, name) {
            console.log('111');
            var id = base64.encode(id);
            var name = base64.encode(name);
            window.open('manage.html#/erpcustomer/khtj/' + id + '/'+name+'/'+$scope.step, '_blank', '');
            // location.href = '#/erpcustomer/khtj/' + id + '/' + name + '/' + $scope.step;
        };
        $scope.morepjList = function () {
            location.href = '#/erpcustomer/khpj';
        };
        $scope.gotoDetail = function (id) {
            var id = base64.encode(id);
            location.href = '#/erpcustomer/lost/' + id;
        }

        //erpcustomer/customer-detail/659aaf54ab704d93a60b27ce3fd462f0/1 跳转客户档案
        $scope.openToUserInfo = function (id) {
            // console.log(id);
            // var id = base64.encode(id);
            window.open('manage.html#/erpcustomer/customer-detail/' + id + '/1', '_blank', '');
            // location.href = '#/erpcustomer/customer-detail/'+id+'/1';
        }
        $scope.dateType1 = '1';
        $scope.dateType2 = '1';

        $scope.dateType3 = '1';
        $scope.paymentName = '';
        $scope.beginDate = '';
        $scope.endDate = '';
        $scope.pageNum = '1';
        $scope.pageSize = '10';

        $scope.beginDate2 = '';
        $scope.endDate2 = '';
        $scope.pageNumZ = '1';
        $scope.pageSizeZ = '10';
        $scope.sortType = '1';
        $scope.ratingType = '-1';

        //已流失
        $scope.dataType9 = '1'
        $scope.pageNum2 = '1';
        $scope.pageSize2 = '5';

        //获取流失客户
        $scope.pageNum10 = '1';
        $scope.pageSize10 = '5';

        //获取上升客户
        $scope.pageNum11 = '1';
        $scope.pageSize11 = '5';

        //乌拉圭
        $scope.down1 = '0';
        $scope.down2 = '0';
        //单量限制
        $scope.dlxzVal = '1';
        $scope.salesmanName='';
        $scope.sortFlag = '1';
        //客户评级 总量排序
        $scope.rateSort = 1   // 1:降序  2：升序

        var type = $routeParams.type;

        if (type == '1') {
            $scope.step = 1;
            $scope.classCustomerType = '1';
            $scope.dayType5 = '1';
            $scope.isFirstCustomerRate = true;
            getSellManList();
            getUpList();
        } else if (type == '2') {
            $scope.step = 2;
            $scope.searchWrapFlag = $scope.searchModel.kehuList.val;
            //$scope.pageNum='1';
            $scope.orderList=[];
            $scope.sellManList=[];
            clearCustomerList();
            getCustomerList();
            getSellManList();
        }else if(type=='3'){
            $scope.step=3;
            $scope.pageNumZ='1';
            $scope.zhuceType='1';
            $('.selectTab>span').removeClass('act');
            $('.selectTab>span').eq(0).addClass('act');
            $('#c-data-time2').val('');
            $('#cdatatime3').val('');
            getZhuce();
        } else {
            $scope.step = 2;
            $scope.searchWrapFlag = $scope.searchModel.kehuList.val;
            //$scope.pageNum='1';
            $scope.orderList=[];
            $scope.sellManList=[];
            clearCustomerList();
            getCustomerList();
            getSellManList();
        }
        //console.log($(document).find('#main3'))
        var myChart = echarts.init(document.getElementById('main1'));
        var myChart2 = echarts.init(document.getElementById('main2'));
        var myChart3 = echarts.init($(document).find('#main3')[0]);
        var myChart4 = echarts.init($(document).find('#main4')[0]);
        var myChart8 = echarts.init(document.getElementById('main8'));
        var myChart9 = echarts.init(document.getElementById('main9'));
        var myChartA = echarts.init(document.getElementById('mainA'));
        var myChartB = echarts.init(document.getElementById('mainB'));
        //点击tab
        $('.tab').on('click', 'li>a', function (e) {
            e.preventDefault();
            var type = $(this).attr('href');
            console.log(type);
            location.href = '#/erpcustomer/khgl/' + type;
        });
        //切换客户类型
        $scope.changeClassCustomer = function (type) {
            $scope.classCustomerType = type;
            if(type == '2'){
                if($scope.isFirstCustomerRate){
                    $scope.isFirstCustomerRate = false;
                    console.log('第一次触发获取客户评级');
                    $scope.customerRateType = '1';
                    $scope.yearList = [];
                    $scope.getYearList();
                    getRateList();
                }
            }
        }
        //去详情
        $scope.gotoDetail = function (e,id) {
            e.stopPropagation();
            // console.log(e);
            window.open('manage.html#/erpcustomer/customer-detail/' + id + '/1', '_blank', '');
        }
        //订单上升客户时间
        $scope.changeUpCustomerType = function (type) {
            $scope.dayType5 = type;
            getUpList();
        }
        //上升客户
        $scope.$on('ngRepeatFinished', function () {
            $scope.triggleFirst();
        });
        $scope.triggleFirst = function () {
            // console.log('金泰妍');
            if($scope.classCustomerType == '1'){
                $('.upCustomerTbody').find('.upCustomerTr').eq(0).addClass('active').trigger("click");
            }else if($scope.classCustomerType == '2'){
                $('.rateCustomerTbody').find('.rateCustomerTr').eq(0).addClass('active').trigger("click");
            }
            
        }
        $('.upCustomerTbody').on('click','.upCustomerTr',function (e) {
            // console.log('点击了哈哈哈')
            var target = $(this);
            target.addClass('active').siblings('.active').removeClass('active');
            var paymentId = target.attr('data-id');
            var sendData = {
                paymentId: paymentId,
                dateType: $scope.dayType5
            }
            var name = target.find('.upCustomerTd').eq(0).find('span').html();
            erp.postFun('erp/analysis/customersChart', JSON.stringify(sendData), function (data) {
                console.log(data.data);
                if (data.data.statusCode == '200') {
                    var result = data.data.result;
                    var zhexianList = result.brokenLine;
                    var zhexianList2 = result.beforeLine;
                    var zhexiantu = [];
                    var zhexiantu2 = [];
                    var zhexianTime = [];
                    $.each(zhexianList, function (i, v) {
                        var d = parseInt(v.payTime);
                        var date = new Date(d);
                        var data = date.getFullYear() + '-'
                            + (date.getMonth() + 1) + '-'
                            + date.getDate();
                        zhexianTime.push(data);
                        zhexiantu.push(parseFloat(v.ocount));
                    });
                    $.each(zhexianList2, function (i, v) {
                        zhexiantu2.push(parseFloat(v.ocount));
                    });

                    console.log(zhexiantu);
                    setZhexiantu(name, zhexiantu, zhexiantu2, zhexianTime);
                    var cake = result.cake;

                    console.log($scope.cakeList);
                    var nameArr = [];
                    var valueArr = [];
                    var cakeCount = 0;
                    $.each(cake, function (i, v) {
                        nameArr.push(v.store_name);
                        var data = {
                            value: v.ocun,
                            name: v.store_name
                        };
                        cakeCount += v.ocun;
                        valueArr.push(data);
                    });
                    $scope.cakeCount = cakeCount;
                    $scope.cakeList = cake;
                    setBingTu(name, valueArr, nameArr);
                    // var ele = $('.nameListWrap').find('.list-tr.act');
                    var total = target.find('.upCustomerTd').eq(2).find('span').html();
                    var info = {
                        name: name,
                        length: cake.length,
                        total: total.split('/')[0]
                    };
                    $scope.customerInfo = info;

                } else {
                    layer.msg('查询失败');
                }
            }, function () {
            
            },{layer:true});
        })
        $scope.classRate = function (ocun) {
            return parseFloat(((ocun / $scope.cakeCount) * 100).toFixed(2));
        }
        function setZhexiantu(name, zhexiantu, zhexiantu2, zhexianTime) {
            var option = {
                color: [
                    '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
                    '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
                    '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
                    '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
                ],
                title: {
                    text: name + '订单数量变化图'
                    //subtext: '纯属虚构'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['CJ 订单量', '环比订单量']
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: zhexianTime
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }
                ],
                series: [
                    {
                        name: 'CJ 订单量',
                        type: 'line',
                        data: zhexiantu,
                        //markPoint : {
                        //    data : [
                        //        {type : 'max', name: '最大值'},
                        //        {type : 'min', name: '最小值'}
                        //    ]
                        //},
                        markLine: {
                            data: [
                                { type: 'average', name: '平均值' }
                            ]
                        }
                    },
                    {
                        name: '环比订单量',
                        type: 'line',
                        data: zhexiantu2,
                        //markPoint : {
                        //    data : [
                        //        {name : '周最低', value : -2, xAxis: 1, yAxis: -1.5}
                        //    ]
                        //},
                        markLine: {
                            data: [
                                { type: 'average', name: '平均值' }
                            ]
                        }
                    }
                ]
            };

            myChart8.setOption(option);
        }
        function setBingTu(name, valueArr, nameArr) {
            var option2 = {
                color: [
                    '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
                    '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
                    '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
                    '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
                ],
                //tooltip: {
                //    trigger: 'item',
                //    formatter: "{a} <br/>{b}: {c} ({d}%)"
                //},
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data: nameArr
                },
                series: [
                    {
                        name: '店铺',
                        type: 'pie',
                        radius: ['50%', '70%'],
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
                        data: valueArr
                    }
                ]
            };
            myChart9.setOption(option2);
        }
        function getUpList() {
            var data = {
                "type": '2',
                "dateType": $scope.dayType5,
                "sortType": '1',
                "salesmanName": $('#selectCustomerBySales').val()
            };
            erp.postFun('erp/analysis/customers', JSON.stringify(data), function (data) {
                if (data.data.statusCode == '200') {
                    var result = data.data.result;
                    $scope.upList = result.userList;
                   
                } else {
                    layer.msg('获取订单上升客户失败');
                }
            }, function () {
            },{layer:true})
        }
        $('#selectCustomerBySales').change(function(){
            getUpList();
        })
        $scope.changeSearchType = function (type) {
			// console.log(type)
            $scope.searchWrapFlag = type
            switch (type) {
                case $scope.searchModel.kehuList.val:
					$scope.orderList=[];
					$('#selectSellMan').val('');
					$('#selectkhpj').val('1');
					$scope.sortType='1';
					$scope.ratingType = '-1';
					$scope.salesmanName='';
					clearCustomerList();
					getCustomerList();
					break
				case $scope.searchModel.uruguay.val:
					$scope.wlgList = [];
					getwlgList();
					break;
				case $scope.searchModel.shopify.val:
					$scope.orderList=[];
					$('#selectSellMan').val('');
					$('#selectkhpj').val('1');
					$scope.sortType='1';
					$scope.ratingType = '-1';
					$scope.salesmanName='';
					clearCustomerList()
					sopifyCustomerAnalysis()
					break;
                case $scope.searchModel.shopmaster.val:
                    $scope.orderList=[];
                    $('#selectSellMan').val('');
                    $('#selectkhpj').val('1');
                    $scope.sortType='1';
                    $scope.ratingType = '-1';
                    $scope.salesmanName='';
                    clearCustomerList()
                    sopifyCustomerAnalysis('shopMaster')
                    break;
				default:
					break
            }
        }

        $('.selectTab').on('click', 'span', function () {
            var index = $(this).index() + 1;
            $scope.zhuceType = index + '';
            $scope.pageNumZ='1';
            $(this).addClass('act').siblings('.act').removeClass('act');
            $('#c-data-time2').val('');
            $('#cdatatime3').val('');
            getZhuce();
        });
        //获取业务员
        function getSellManList(){
            erp.postFun('app/employee/getempbyname', {"data": "{'name':'', 'job': '销售'}"}, function (data) {
                $scope.sellManList = JSON.parse(data.data.result).list;
                console.log($scope.sellManList);
            });

        }
        /**客户评级 */
        $('.rateCustomerTbody').on('click','.rateCustomerTr',function() {
            // console.log('MMP')
            $(this).addClass('active').siblings('.active').removeClass('active');
            var year = $('#selectYearGroup').val();
            var id = $(this).attr('data-id');
            var name = $(this).find('.rateCustomerTd').eq(0).find('span').html();
            var data = {
                paymentId: id,
                year: year
            };
            erp.postFun('erp/analysis/customersAssessChart', JSON.stringify(data), function (data) {
                if (data.data.statusCode == '200') {
                    var result = data.data.result;
                    console.log(result);
                    var data1 = [];
                    var data2 = [];
                    var data3 = [];
                    $.each(result, function (i, v) {
                        var p;
                        if (v.ocount == '0') {
                            p = 0;
                        } else {
                            p = parseFloat(((v.cjocun / v.ocount) * 100).toFixed(2));
                        }
                        v.rate = p;
                        data1.push(v.ocount);
                        data2.push(v.cjocun);
                        var d = new Date();
                        var y = d.getFullYear();
                        var m = d.getMonth()+1;
                        var time = parseInt(v.payTime.split('-')[1]);
                        if(year == y){
                            if(time > m){
                                data3.push('')
                            }else{
                                data3.push(p);
                            }
                        }else{
                            data3.push(p);
                        }
                        
                    });
                    console.log(data3);
                    setZhuzhuangtu2(name, data1, data2);
                    setZhexiantu2(name, data3);
                } else {
                    layer.msg('查询失败');
                }
            }, function () {
            },{layer:true});
        })
        $('#selectYearGroup').change(function(){
            var val = $(this).val();
            var ele = $('.rateCustomerTbody').find('.rateCustomerTr.active');
            console.log(ele);
            ele.trigger('click');
        });
        function setZhuzhuangtu2(name, data1, data2) {
            var data1 = [
                {
                    name: '总订单',
                    type: 'bar',
                    data: data1
                    //markPoint : {
                    //    data : [
                    //        {type : 'max', name: '最大值'},
                    //        {type : 'min', name: '最小值'}
                    //    ]
                    //},
                    //markLine : {
                    //    data : [
                    //        {type : 'average', name: '平均值'}
                    //    ]
                    //}
                },
                {
                    name: 'CJ订单',
                    type: 'bar',
                    data: data2
                    //markPoint : {
                    //    data : [
                    //        {type : 'max', name: '最大值'},
                    //        {type : 'min', name: '最小值'}
                    //    ]
                    //},
                    //markLine : {
                    //    data : [
                    //        {type : 'average', name : '平均值'}
                    //    ]
                    //}
                }
            ];
            var option = {
                // 默认色板
                color: [
                    '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
                    '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
                    '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
                    '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
                ],
                title: {
                    text: name + '的订单历史'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['总订单', 'CJ订单']
                },
                toolbox: {
                    show: false,
                    feature: {
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                grid: {
                    left: '8%',
                    right: "8%"
                },
                series: data1
            };
            myChartA.setOption(option);
        }
        function setZhexiantu2(name, data3) {
            var data2 = [
                {
                    name: '订单转化率',
                    type: 'line',
                    smooth: true,
                    data: data3
                    //markPoint : {
                    //    data : [
                    //        {type : 'max', name: '最大值'},
                    //        {type : 'min', name: '最小值'}
                    //    ]
                    //},
                    //markLine : {
                    //    data : [
                    //        {type : 'average', name: '平均值'}
                    //    ]
                    //}
                }
            ];
            var option2 = {
                color: [
                    '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
                    '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
                    '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
                    '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
                ],
                title: {
                    text: name + '的订单转化历史曲线'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['订单转化率']
                },
                grid: {
                    left: '8%',
                    right: "8%"
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} %'
                        }
                    }
                ],
                series: data2
            };
            myChartB.setOption(option2);
        }
        $scope.changeRateTypeFun = function (type) {
            $scope.rateSort = 1
            $scope.customerRateType = type;
            selectRateCustometFun();
        }
        function getRateList() {
            var data = {
                "dateType": '3'
            };
            erp.postFun('erp/analysis/customersAssess', JSON.stringify(data), function (data) {
                if (data.data.statusCode == '200') {
                    console.log(data.data);
                    var pjAList = [];
                    var pjBList = [];
                    var pjCList = [];
                    var result = data.data.result;
                    $.each(result, function (i, v) {
                        var p;
                        if (v.ocun == 0) {
                            p = 0;
                        } else {
                            p = parseFloat(((v.cjocun / v.ocun) * 100).toFixed(2));
                        }
                        v.rate = p;
                        if (p >= 0 && p <= 30) {
                            pjAList.push(v);
                        } else if (p > 30 && p <= 50) {
                            pjBList.push(v);
                        } else if (p > 50 && p <= 100) {
                            pjCList.push(v);
                        }
                    });
                    $scope.gradList = {
                        "youzhi": pjCList,
                        "putong": pjBList,
                        "qianli": pjAList
                    }
                    selectRateCustometFun()
                }
            }, function () {
            
            },{layer:true})
        }
        /** 客户评级 -- 总量排序 */
        $scope.rateSortFun = function (type) {
            $scope.rateSort = type
            selectRateCustometFun()
        }
        
        $scope.getYearList = function(){
            var date = new Date();
            var year = date.getFullYear();
            var cha = year-2017;
            for(var i=0;i<=cha;i++){
                var y = 2017 + i;
                var data = {
                    year: y
                }
                $scope.yearList.unshift(data);
            }
            console.log($scope.yearList);
        }
        
        function selectRateCustometFun () {
            console.log($scope.gradList);
            if($scope.customerRateType == '1'){
                //潜在客户
                $scope.RateCustomerList = $scope.rateSort === 1 ? jiangxu2($scope.gradList.qianli) : shengxu2($scope.gradList.qianli);
            }else if($scope.customerRateType == '2'){
                //优质客户
                $scope.RateCustomerList = $scope.rateSort === 1 ? jiangxu2($scope.gradList.youzhi) : shengxu2($scope.gradList.youzhi);
            }else if($scope.customerRateType == '3'){
                //普通客户
                $scope.RateCustomerList = $scope.rateSort === 1 ? jiangxu2($scope.gradList.putong) : shengxu2($scope.gradList.putong);
            }
            console.log($scope.RateCustomerList)
        }
        //获取注册用户列表
        //getZhuce();
        function getZhuce() {
            getAccountList();
            getUserCount();
            getUserLine();
        }
        function getAccountList() {
            var sendData = {
                pageNum: $scope.pageNumZ,
                pageSize: $scope.pageSizeZ
            };
            if ($scope.zhuceType == '1' || $scope.zhuceType == '2') {
                sendData.dateType = $scope.zhuceType;
            } else {
                sendData.begainDate = $scope.beginDate2;
                sendData.endDate = $scope.endDate2;
            }
            //erp.load();
            var index2 = layer.load(2, {
                shade: [0.3, '#393D49'], content: '加载中,请稍等', success: function (layero) {
                    layero.find('.layui-layer-content').css({
                        'width': '300px',
                        'padding-left': '36px',
                        'padding-top': '5px'
                    });
                }
            });
            erp.postFun('erp/account/getAccountList', JSON.stringify(sendData), function (data) {
                //erp.closeLoad();
                layer.close(index2);
                console.log(data.data);
                if (data.data.statusCode == '200') {
                    $scope.accountLiat = data.data.result.userList;
                    $scope.accountTotal = data.data.result.count;
                    pageFunZ();
                } else {
                    layer.msg('查询新注册用户失败');
                }
            }, function () {
                //erp.closeLoad();
                layer.close(index2);
                layer.msg('网络错误')
            })
        }
        function getUserCount() {
            var sendData = {};
            if ($scope.zhuceType == '1' || $scope.zhuceType == '2') {
                sendData.dateType = $scope.zhuceType;
            } else {
                sendData.begainDate = $scope.beginDate2;
                sendData.endDate = $scope.endDate2;
            }
            erp.postFun('erp/account/getUserCount', JSON.stringify(sendData), function (data) {
                console.log(data);
                if (data.data.statusCode == '200') {
                    var result = data.data.result;
                    var a1 = [];
                    a1.push(result.acount);
                    var a2 = [];
                    a2.push(result.gcount);
                    $scope.totalPerson = parseInt(result.acount) + parseInt(result.gcount);
                    setChart01(a1, a2);
                } else {
                    layer.msg('查询错误')
                }
            }, function () {
                layer.msg('网络错误')
            });
        }
        function getUserLine() {
            var sendData = {};
            if ($scope.zhuceType == '1' || $scope.zhuceType == '2') {
                sendData.dateType = $scope.zhuceType;
            } else {
                sendData.begainDate = $scope.beginDate2;
                sendData.endDate = $scope.endDate2;
            }
            erp.postFun('erp/account/getUserLine', JSON.stringify(sendData), function (data) {
                console.log(data);
                if (data.data.statusCode == '200') {
                    var result = data.data.result;
                    var alist = result.aList;
                    var glist = result.gList;
                    var a1 = [];
                    var a2 = [];
                    var time = [];
                    $.each(alist, function (i, v) {
                        var c = v;
                        $.each(c, function (i, v) {
                            a1.push(v);
                            time.push(i);
                        });
                    });
                    $.each(glist, function (i, v) {
                        var c = v;
                        $.each(c, function (i, v) {
                            a2.push(v);
                        });
                    });
                    console.log(time);
                    console.log(a1);
                    console.log(a2);
                    setChart02(time, a1, a2)
                } else {
                    layer.msg('查询错误')
                }
            }, function () {
                layer.msg('网络错误')
            });
        }
        function pageFunZ() {
            $(".pagegroup-z").jqPaginator({
                totalCounts: $scope.accountTotal || 1,
                pageSize: $scope.pageSizeZ * 1,
                visiblePages: 5,
                currentPage: $scope.pageNumZ * 1,
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
                    $scope.pageNumZ = n + '';
                    getAccountList();
                }
            });
        }
        $scope.classTypeACC = function (type) {
            if (type == 2) {
                return '供应商';
            } else if (type == 1) {
                return 'CJ注册用户'
            }
        };
        //$('#selectDataType').change(function(){
        //    var type = $(this).val();
        //    console.log(type);
        //    if(type=='3'){
        //        $('.searchGG').show();
        //    }else{
        //        $('.searchGG').hide();
        //        $scope.zhuceType = type;
        //        $scope.pageNumZ='1';
        //        getZhuce();
        //    }
        //});
        $scope.searchFun2 = function () {
            var start = $('#c-data-time2').val();
            var end = $('#cdatatime3').val();
            if (start == '') {
                layer.msg('请选择起始日期');
                return;
            } else if (end == '') {
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                if (month < 10) {
                    month = '0' + month
                }
                if (day < 10) {
                    day = '0' + day;
                }
                end = year + '-' + month + '-' + day;
            }
            console.log(start, end);
            $scope.beginDate2 = start;
            $scope.endDate2 = end;
            $scope.zhuceType = '3';
            $scope.pageNumZ = '1';
            $('.selectTab>span').removeClass('act');
            getZhuce();
        }



        //获取已流失的客户
        //getLostList();
        //获取客户列表
        function clearCustomerList() {
            $scope.beginDate = '';
            $scope.endDate = '';
            $scope.paymentName = '';
            $scope.dateType3 = '1';
            $scope.pageNum = '1';
            $scope.sortType = '1';
            $scope.ratingType = '-1';
            $('#c-data-time').val('');
            $('#cdatatime2').val('');
            $('#searchName').val('');
            $('#selectkhpj').val('1');
            $scope.dateType3 = '1'

		}
		
		/** 获取上周 */
		function getLastTime () {
			let now = new Date()
				, weekDay = now.getDay() === 0 ? 7 : now.getDay()
				, lwMonday
				, lwSunday
				, result = []
				
			if (weekDay > 1) {
				now = new Date(now.getTime() - 1000 * 60 * 60 * 24 * (weekDay - 1) )
			}
			lwMonday = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7)
			lwSunday = new Date(lwMonday.getTime() + 1000 * 60 * 60 *24 * 6)
			result = [`${lwMonday.getFullYear()}-${(lwMonday.getMonth() + 1) < 10 ? '0'+ (lwMonday.getMonth() + 1) : (lwMonday.getMonth() + 1)}-${lwMonday.getDate() < 10 ? '0'+ lwMonday.getDate() : lwMonday.getDate()}`, `${lwSunday.getFullYear()}-${(lwSunday.getMonth() + 1) < 10 ? '0'+ (lwSunday.getMonth() + 1) : (lwSunday.getMonth() + 1)}-${lwSunday.getDate() < 10 ? '0'+ lwSunday.getDate() : lwSunday.getDate()}`]
		
			return result
			
		}

		/** 根据时间 */

		/** shopify */
		function sopifyCustomerAnalysis (queryType) {
			console.log($scope.beginDate)
			
			let sort
			  , sendData = {
				count: $scope.pageSize,
				offset: $scope.pageNum * 1 - 1,
				// sort: $scope.sortType,
				customerName: $scope.paymentName,
                salesName: $scope.salesmanName,
                shopStatus: '1'
			}

			$scope.dlxzVal === '1' && (sendData.orderCount = 1000)

			/** 【排序 */
			switch ($scope.sortType) {
				case '1':
					sort = 2
					break;
				case '2':
					sort = 3
					break
				case '6':
					sort = 0
					break
				case '7':
					sort = 1
					break
				default:
					break
			}
			sendData.sort = sort
			/** 客户评级 */
            // sendData.customerLevel = $scope.ratingType === '-1' ? '' : ($scope.ratingType * 1 -3) + '';

            switch ($scope.ratingType) {
                case '-1':
                    sendData.customerLevel = ''
                    break
                case '3':
                    sendData.customerLevel = '2'
                    break
                case '4':
                    sendData.customerLevel = '1'
                    break
                case '5':
                    sendData.customerLevel = '0'
                    break
                default:
                    break
            }

			/** 时间 */
			if ($scope.beginDate) {
				sendData.startDate = $scope.beginDate
				sendData.endDate = $scope.endDate
			} else {
				let now = new Date()
				  , month = now.getMonth() === 0 ? 12 : now.getMonth()
				  , year = now.getFullYear()
				  , bigMonth = [1, 3, 5, 7, 8, 10, 12]

				switch ($scope.dateType3) {
					case '1':
						let dayList = getLastTime()
						sendData.startDate = dayList[0]
						sendData.endDate = dayList[1]
						break;
					case '2':
					    if (bigMonth.includes(month)) {
							sendData.startDate = `${year}-${month < 10 ? '0' + month : month}-01`
						    sendData.endDate = `${year}-${month < 10 ? '0' + month : month}-31`
						} else if (month === 2) {
							if (year%4 === 0 && year%100 !== 0 || year%400 === 0) {
								sendData.startDate = `${year}-${month < 10 ? '0' + month : month}-01`
								sendData.endDate = `${year}-${month < 10 ? '0' + month : month}-29`
							} else {
								sendData.startDate = `${year}-${month < 10 ? '0' + month : month}-01`
								sendData.endDate = `${year}-${month < 10 ? '0' + month : month}-28`
							}
						} else {
							sendData.startDate = `${year}-${month < 10 ? '0' + month : month}-01`
						    sendData.endDate = `${year}-${month < 10 ? '0' + month : month}-30`
						}
						break;
					case '3':
						sendData.startDate = `${year}-01-01`
						sendData.endDate = `${year}-12-31`
						break
					default:
						break
				}
			}
			console.log(sendData)
            var url  = 'erp/analysis/shopifyCustomerAnalysis';
			if(queryType!=null){
			    switch (queryType){
                    case 'shopMaster':
                        url = 'erp/analysis/shopMasterCustomerAnalysis';
                        break;
                }
            }
			erp.postFun(url, JSON.stringify(sendData), ({data}) => {
                // console.log(data)
                if (data.statusCode === '200') {
                    let list = JSON.parse(data.result.list)

                    list = list.map((item, idx) => {
                        if (!item.ocun || item.ocun === 0){
                            item.zhanbi = 0
                        } else {
                            item.zhanbi = parseFloat(((item.cjocun / item.ocun) * 100).toFixed(2))
                        }
                        item.zhanbi > 0 ? item.num = true : item.num = false

                        return item
                    })
                    // console.log(list)
                    $scope.orderList = list;
                    console.log($scope.orderList);
                    $scope.totalCounts = data.result.total;
                    pageFun();
                }
			}, err => {}, { layer: true } )
			
		}

        function getCustomerList() {
            var sendData;
            // var paymentName = $location.
            if ($scope.beginDate == '') {
              console.log($scope.beginDate);
              // 客户档案跳转过来
              sendData = {
                "dateType": $scope.dateType3,
                "paymentName": $scope.paymentName
              };
              if (LOGIN_NAME) {
                $scope.paymentName = LOGIN_NAME
                sendData.paymentName = LOGIN_NAME
              }
            } else {
                sendData = {
                    "paymentName": $scope.paymentName,
                    "beginDate": $scope.beginDate,
                    "endDate": $scope.endDate
                };
            }
            sendData.pageNum=$scope.pageNum;
            sendData.pageSize=$scope.pageSize;
            sendData.sortType=$scope.sortType;
            sendData.ratingType = $scope.ratingType
            sendData.salesmanName=$scope.salesmanName;
            sendData.limit = $scope.dlxzVal;
            var index = layer.load(2,{
                shade: [0.3, '#393D49'], content: '加载中,请稍等', success: function (layero) {
                    layero.find('.layui-layer-content').css({
                        'width': '300px',
                        'padding-left': '36px',
                        'padding-top': '5px'
                    });
                }
            });
            erp.postFun('erp/analysis/customersOrder', JSON.stringify(sendData), function (data) {
                //erp.closeLoad();
                layer.close(index);
                console.log(data);
                if (data.data.statusCode == '200') {
                    var result = data.data.result.orderList;
                    $.each(result, function (i, v) {
                        var p;
                        if (v.ocun == '0' || v.ocun == '' || v.ocun == null || v.ocun == undefined) {
                            p = 0;
                        } else {
                            p = parseFloat(((v.cjocun / v.ocun) * 100).toFixed(2));
                        }
                        v.zhanbi = p;
                        if (v.zhanbi > 0) {
                            v.num = true;
                        } else {
                            v.num = false;
                        }
                        //if(p>=0 && p<=40){
                        //    v.pj = '潜在客户'
                        //}
                    });
                    $scope.orderList = result;
                    console.log($scope.orderList);
                    $scope.totalCounts = data.data.result.total;
                    // if($scope.sortType == '3' || $scope.sortType == '4' || $scope.sortType == '5'){
                    //     $scope.sortFlag = '0';
                    // }else if($scope.sortType == '1'){
                    //     $scope.sortFlag = '1';
                    // }
                    pageFun();
                }
            }, function () {
                //erp.closeLoad();
                layer.close(index);
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
                    $scope.pageNum = n + '';
                    $scope.searchWrapFlag === $scope.searchModel.shopify.val
                       ?   sopifyCustomerAnalysis()
                       :   getCustomerList()
                    
                }
            });
        }
        //更换每页多少条数据
        $scope.pagesizechange = function (pagesize) {
            //console.log(pagesize)
            // $scope.pagesize=pagesize-0;
            $scope.pageNum = '1';
            $scope.searchWrapFlag === $scope.searchModel.shopify.val
                ?   sopifyCustomerAnalysis()
                :   getCustomerList()
        };
        //手动输入页码GO跳转
        $scope.pagenumchange = function () {
            var pagenum = Number($scope.pageNum);
            var totalpage = Math.ceil($scope.totalCounts / $scope.pageSize);
            if (pagenum > totalpage) {
                layer.msg('错误页码');
                $scope.pageNum = '1';
            } else {
                $scope.searchWrapFlag === $scope.searchModel.shopify.val
                ?   sopifyCustomerAnalysis()
                :   getCustomerList()
            }
        };

        //筛选业务员
        $('#selectSellMan').change(function(){
            var val = $(this).val();
            console.log(val);
            $scope.salesmanName=val;
        });
        $scope.sortChangeFun = function (sort) {
            $scope.sortFlag = sort;
            $scope.sortType = sort;
            // $('#selectkhpj').val('1');
            $scope.searchWrapFlag === $scope.searchModel.shopify.val
            ?   sopifyCustomerAnalysis()
            :   getCustomerList()
        }
        $(document).on('change', '#selectkhpj', function () {
            var type = $(this).val();
            if(type == '1'){
                $scope.ratingType = '-1';
            }else{
                $scope.ratingType = type;
            }
            
        });
        $scope.daoChuFun = function () {
            let start = $('#c-data-time').val();
            let end = $('#cdatatime2').val();
            let ostart =Number(start.replace(/[-]/g,''));
            let oend =Number(end.replace(/[-]/g,''));
            if(!start){
                layer.msg("请选择起始日期");
                return false;
            }else if(!end){
                layer.msg("请选择结束日期");
                return false;
            }else if(ostart>oend){
                layer.msg("起始日期大于结束日期，请重新选择");
                return false;
            }
            erp.load();
            erp.postFun("erp/analysis/shopMasterExport", {
                'startDate': start,
                'endDate': end
            }, function (data) {
                console.log(data)
                erp.closeLoad()
                if (data.data.statusCode == 200&&data.data.result) {
                    var result = data.data.result
                    $scope.excelLink = result;
                    let ohtml = '<p>'+result+'</p><p><a href="'+result+'">点击下载</a><p>'
                    layer.confirm(ohtml, {
                        btn: ['确定']//按钮
                    }, function (index) {
                        layer.close(index);
                    })
                } else {
                    layer.msg(data.data.message?data.data.message:'导出失败');
                }
            }, function (data) {
                console.log(data)
                erp.closeLoad()
            })
        }
        $scope.downExcelFun = function () {
            location.href = $scope.excelLink;
            $scope.daoChuFlag = false;
        }
        $scope.closeExcelFun = function () {
            $scope.daoChuFlag = false;
        }
        //点击查询
        $scope.searchFun = function () {
            var name = $('#searchName').val();
            var startTime = $('#c-data-time').val();
            var endTime = $('#cdatatime2').val();
            $scope.beginDate = startTime;
            if (endTime == '' && startTime !== '') {
                var date = new Date();
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? '0' + m : m;
                var d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                endTime = y + '-' + m + '-' + d;
            }
            $scope.endDate = endTime;
            if($scope.beginDate || $scope.endDate){
                $scope.dateType3 = ''
            }
            $scope.paymentName = name;
            $scope.pageNum = '1';
            //console.log($scope.paymentName);
            $scope.searchWrapFlag === $scope.searchModel.shopify.val
                ?   sopifyCustomerAnalysis()
                :   getCustomerList()
        };

		//时间转改涮选
		$scope.changeDateSelect = function (type) {
			$scope.pageNum = 1;
			$scope.dateType3 = type
			$scope.beginDate = '';
			$scope.endDate = '';
			$('#c-data-time').val('');
			$('#cdatatime2').val('');
			$scope.searchWrapFlag === $scope.searchModel.shopify.val
                ?   sopifyCustomerAnalysis()
                :   getCustomerList()
		}
        //getliushiList();
        //流失客户
        function getliushiList() {
            var data = {
                "type": '1',
                "dateType": $scope.dateType1,
                "sortType": '1',
                "pageNum": $scope.pageNum10,
                "pageSize": $scope.pageSize10
            };
            //erp.load();
            var index = layer.load(2, {
                shade: [0.3, '#393D49'], content: '加载中,请稍等', success: function (layero) {
                    layero.find('.layui-layer-content').css({
                        'width': '300px',
                        'padding-left': '36px',
                        'padding-top': '5px'
                    });
                }
            });
            erp.postFun('erp/analysis/customers', JSON.stringify(data), function (data) {
                //erp.closeLoad();
                layer.close(index);
                //console.log(data);
                if (data.data.statusCode == '200') {
                    var result = data.data.result;
                    console.log(data.data);
                    //var arr=[];
                    //$.each(result,function(i,v){
                    //    if(i<5){
                    //        arr.push(v);
                    //    }
                    //});
                    $scope.liushiTotal = result.count;
                    $scope.liushiList = result.userList;
                    pageFunX1();
                } else {
                    layer.msg('获取可能流失的客户失败');
                }
            }, function () {
                layer.close(index);
            })
        }
        function pageFunX1() {
            $(".pagegroup-x1").jqPaginator({
                totalCounts: $scope.liushiTotal || 1,
                pageSize: $scope.pageSize10 * 1,
                visiblePages: 5,
                currentPage: $scope.pageNum10 * 1,
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
                    $scope.pageNum10 = n + '';
                    getliushiList();
                }
            });
        }

        //getUpList();
        
        function pageFunX2() {
            $(".pagegroup-x2").jqPaginator({
                totalCounts: $scope.upTotal || 1,
                pageSize: $scope.pageSize11 * 1,
                visiblePages: 5,
                currentPage: $scope.pageNum11 * 1,
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
                    $scope.pageNum11 = n + '';
                    getUpList();
                }
            });
        }
        //获取客户评级
        //getRateList();
        


        //已流失的客户
        function getLostList() {
            var index = layer.load(2, {
                shade: [0.3, '#393D49'], content: '加载中,请稍等', success: function (layero) {
                    layero.find('.layui-layer-content').css({
                        'width': '300px',
                        'padding-left': '36px',
                        'padding-top': '5px'
                    });
                }
            });
            var sendData = {
                dateType: $scope.dataType9,
                pageNum: $scope.pageNum2,
                pageSize: $scope.pageSize2
            };
            erp.postFun('erp/analysis/getLossCustomer', JSON.stringify(sendData), function (data) {
                layer.close(index);
                if (data.data.statusCode == '200') {
                    console.log(data.data.result);
                    var list = data.data.result.userList;
                    $scope.lostList = list;
                    $scope.totalCounts2 = data.data.result.count;
                    pageFun2();
                } else {
                    layer.msg('获取已流失客户列表失败')
                }
            }, function () {
                layer.close(index);
                layer.msg("网络错误")
            });
        }

        function pageFun2() {
            $(".pagegroup-loss").jqPaginator({
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
                    $scope.pageNum2 = n + '';
                    getLostList();
                }
            });
        }
        $scope.classEmpty = function (item) {
            if (item) {
                return item;
            } else {
                return '--';
            }
        }
        //更换每页多少条数据
        $scope.pagesizechange2 = function (pagesize) {
            //console.log(pagesize)
            // $scope.pagesize=pagesize-0;
            $scope.pageNum2 = '1';
            getLostList();
        };
        //手动输入页码GO跳转
        $scope.pagenumchange2 = function () {
            var pagenum = Number($scope.pageNum2);
            var totalpage = Math.ceil($scope.totalCounts2 / $scope.pageSize2);
            if (pagenum > totalpage) {
                layer.msg('错误页码');
                $scope.pageNum2 = '1';
            } else {
                getLostList();
            }
        };
        //时间删选
        $(document).on('click', '.dateRange>span', function () {
            console.log('11111111');
            var target = $(this);
            target.addClass('act').siblings('.act').removeClass('act');
            var parent = target.parent();
            var parentID = parent.attr('id');
            var val = target.attr('data-value');
            if (parentID.trim() == 'downRange') {
                $scope.dateType1 = val;
                getliushiList();
            } else if (parentID.trim() == 'upRange') {
                $scope.dateType2 = val;
                getUpList();
            } else if (parentID.trim() == 'lostRange') {
                $scope.dataType9 = val;
                getLostList();
            }

        });

        //打开设置
        $('.ddzhl-1>span').click(function () {
            var target = $(this);
            var parent = target.parent();
            var ele = parent.next('.ddzhl-2');
            ele.show();
            parent.hide();
        });
        //关闭设置
        $('.ddzhl-2>.cancelBtn').click(function () {
            var target = $(this);
            var parent = target.parent();
            var ele = parent.prev('.ddzhl-1');
            ele.show();
            parent.hide();
        });

        function setChart01(a1, a2) {
            var option = {
                color: [
                    '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
                    '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
                    '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
                    '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
                ],
                title: {
                    //text: '新注册用户数量统计'
                    //subtext: '数据来自网络'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['CJ注册用户', '新增供应商']
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'value',
                        boundaryGap: [0, 0.01]
                    }
                ],
                yAxis: [
                    {
                        type: 'category',
                        data: ['']
                    }
                ],
                series: [
                    {
                        name: 'CJ注册用户',
                        type: 'bar',
                        data: a1
                    },
                    {
                        name: '新增供应商',
                        type: 'bar',
                        data: a2
                    }
                ]
            };
            myChart.setOption(option)
        }
        function setChart02(time, a1, a2) {
            var option = {
                color: [
                    '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
                    '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
                    '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
                    '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
                ],
                //title : {
                //    text: '未来一周气温变化',
                //    subtext: '纯属虚构'
                //},
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['CJ注册用户', '新增供应商']
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: time
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                        //axisLabel : {
                        //    formatter: '{value} °C'
                        //}
                    }
                ],
                series: [
                    {
                        name: 'CJ注册用户',
                        type: 'line',
                        data: a1
                        //markPoint : {
                        //    data : [
                        //        {type : 'max', name: '最大值'},
                        //        {type : 'min', name: '最小值'}
                        //    ]
                        //},
                        //markLine : {
                        //    data : [
                        //        {type : 'average', name: '平均值'}
                        //    ]
                        //}
                    },
                    {
                        name: '新增供应商',
                        type: 'line',
                        data: a2
                        //markPoint : {
                        //    data : [
                        //        {name : '周最低', value : -2, xAxis: 1, yAxis: -1.5}
                        //    ]
                        //},
                        //markLine : {
                        //    data : [
                        //        {type : 'average', name : '平均值'}
                        //    ]
                        //}
                    }
                ]
            };
            myChart2.setOption(option);
        }

        //清除
        $scope.resetSearchFun = function () {
            $('#c-data-time2').val('');
            $('#cdatatime3').val('');
        }
        $scope.resetSearchFun2 = function () {
            $('#c-data-time').val('');
            $('#cdatatime2').val('');
        }
        $scope.classFix = function (item) {
            if (item.comcun == 0) {
                return '--';
            } else {
                return parseFloat(item.orderRatio.toFixed(2)) + '%';
            }

        }

        //乌拉圭
        //getwlgList();
        function getwlgList() {
            var day = getDay(0);
            var day2 = getDay(-1);
            var day3 = getDay(-2);
            var day4 = getDay(-3);
            var day5 = getDay(-4);
            var day6 = getDay(-5);
            var day7 = getDay(-6);
            var str = day7 + ',' + day6 + ',' + day5 + ',' + day4 + ',' + day3 + ',' + day2 + ',' + day;
            getwlgcusList(str);

        }
        function getwlgcusList(str) {
            var sendData = {
                date: str
            };
            var index = layer.load(2, {
                shade: [0.3, '#393D49'], content: '加载中,请稍等', success: function (layero) {
                    layero.find('.layui-layer-content').css({
                        'width': '300px',
                        'padding-left': '36px',
                        'padding-top': '5px'
                    });
                }
            });
            erp.postFun('erp/analysis/brightpearlCustomerAnalysis', JSON.stringify(sendData), function (data) {
                layer.close(index);
                console.log(data.data);
                if (data.data.statusCode == '200') {
                    var result = data.data.result;
                    var list = [];
                    var totalcun = 0;
                    var totalcj = 0;
                    $.each(result, function (i, v) {
                        var time = i;
                        var cun = parseInt(v.uruguay);
                        var ocun = parseInt(v.cj);
                        var rate;
                        var times = new Date(time);
                        var ss = times.getTime();
                        if (cun == 0) {
                            rate = 0
                        } else {
                            rate = parseFloat(((ocun / cun) * 100).toFixed(2));
                        }
                        var money = parseFloat(v.cjMoney);
                        totalcun += cun;
                        totalcj += ocun;
                        var data = {
                            time: time,
                            cun: cun,
                            ocun: ocun,
                            rate: rate,
                            money: money,
                            times: ss
                        };
                        list.push(data);
                    });
                    console.log(list);
                    list = shengxu3(list);
                    $scope.wlgList = list;
                    setChart03($scope.wlgList);
                    setChart04($scope.wlgList);

                    $scope.zhouqi = list.length;
                    $scope.totalcun = totalcun;
                    $scope.totalcj = totalcj;
                    if (totalcun == 0) {
                        $scope.totalRate = 0;
                    } else {
                        $scope.totalRate = parseFloat(((totalcj / totalcun) * 100).toFixed(2));
                    }
                } else {
                    layer.msg('查询失败')
                }
            }, function () {
                layer.close(index);
            });
        }
        $scope.resetSearchFun5 = function () {
            $('#c-data-time3').val('');
            $('#cdatatime4').val('');
        }
        $scope.searchFun3 = function () {
            var start = $('#c-data-time3').val();
            var end = $('#cdatatime4').val();
            var result = getBetweenDateStr(start, end);
            //console.log(result);
            var str = '';
            $.each(result, function (i, v) {
                if (i == 0) {
                    str += v;
                } else {
                    str += ',' + v;
                }
            });
            console.log(str);
            getwlgcusList(str);

        }
        function getBetweenDateStr(start, end) {
            var result = [];
            var beginDay = start.split("-");
            var endDay = end.split("-");
            var diffDay = new Date();
            var dateList = new Array;
            var i = 0;
            diffDay.setDate(beginDay[2]);
            diffDay.setMonth(beginDay[1] - 1);
            diffDay.setFullYear(beginDay[0]);
            result.push(start);
            while (i == 0) {
                var countDay = diffDay.getTime() + 24 * 60 * 60 * 1000;
                diffDay.setTime(countDay);
                dateList[2] = diffDay.getDate();
                dateList[1] = diffDay.getMonth() + 1;
                dateList[0] = diffDay.getFullYear();
                if (String(dateList[1]).length == 1) { dateList[1] = "0" + dateList[1] };
                if (String(dateList[2]).length == 1) { dateList[2] = "0" + dateList[2] };
                result.push(dateList[0] + "-" + dateList[1] + "-" + dateList[2]);
                if (dateList[0] == endDay[0] && dateList[1] == endDay[1] && dateList[2] == endDay[2]) {
                    i = 1;
                }
            }
            //        console.log(result);
            return result;
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
        //排序
        $('.wlg-thead').on('click', '.sort', function () {
            //var parent = $(this).parent();
            if ($(this).hasClass('sort1')) {
                //同步订单量排序
                if ($scope.down1 == '0' || $scope.down1 == '2') {
                    //降序
                    $scope.down1 = '1';
                    console.log('降序', $scope.down1);
                    var list = $scope.wlgList;
                    list = jiangxu(list);
                    console.log(list);
                    $scope.wlgList = list;
                    $scope.$apply();
                } else if ($scope.down1 == '1') {
                    //升序
                    $scope.down1 = '2';
                    console.log('升序', $scope.down1);
                    var list = $scope.wlgList;
                    list = shengxu(list);
                    console.log(list);
                    $scope.wlgList = list;
                    $scope.$apply();
                }
            } else if ($(this).hasClass('sort2')) {
                if ($scope.down2 == '0' || $scope.down2 == '2') {
                    //降序
                    $scope.down2 = '1';
                    console.log('降序', $scope.down2);
                    var list = $scope.wlgList;
                    list = jiangxu2(list);
                    console.log(list);
                    $scope.wlgList = list;
                    $scope.$apply();
                } else if ($scope.down2 == '1') {
                    //升序
                    $scope.down2 = '2';
                    console.log('升序', $scope.down2);
                    var list = $scope.wlgList;
                    list = shengxu2(list);
                    console.log(list);
                    $scope.wlgList = list;
                    $scope.$apply();
                }
            }
        });
        function jiangxu(arr) {
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                for (var j = 0; j < len - i - 1; j++) {
                    if (arr[j].cun < arr[j + 1].cun) {  //相邻元素进行对比
                        var temp = arr[j + 1];//交换元素
                        arr[j + 1] = arr[j];
                        arr[j] = temp;
                    }
                }
            }
            return arr;//返回数组
        }
        function shengxu(arr) {
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                for (var j = 0; j < len - i - 1; j++) {
                    if (arr[j].cun > arr[j + 1].cun) {  //相邻元素进行对比
                        var temp = arr[j + 1];//交换元素
                        arr[j + 1] = arr[j];
                        arr[j] = temp;
                    }
                }
            }
            return arr;//返回数组
        }
        function jiangxu2(arr) {
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                for (var j = 0; j < len - i - 1; j++) {
                    if (arr[j].ocun < arr[j + 1].ocun) {  //相邻元素进行对比
                        var temp = arr[j + 1];//交换元素
                        arr[j + 1] = arr[j];
                        arr[j] = temp;
                    }
                }
            }
            return arr;//返回数组
        }
        function shengxu2(arr) {
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                for (var j = 0; j < len - i - 1; j++) {
                    if (arr[j].ocun > arr[j + 1].ocun) {  //相邻元素进行对比
                        var temp = arr[j + 1];//交换元素
                        arr[j + 1] = arr[j];
                        arr[j] = temp;
                    }
                }
            }
            return arr;//返回数组
        }
        function shengxu3(arr) {
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                for (var j = 0; j < len - i - 1; j++) {
                    if (arr[j].times > arr[j + 1].times) {  //相邻元素进行对比
                        var temp = arr[j + 1];//交换元素
                        arr[j + 1] = arr[j];
                        arr[j] = temp;
                    }
                }
            }
            return arr;//返回数组
        }
        function setChart03(list) {
            var time = [];
            var rate = [];
            $.each(list, function (i, v) {
                time.push(v.time);
                rate.push(v.rate);
            });
            console.log(time);
            console.log(rate);
            var option = {
                color: [
                    '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
                    '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
                    '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
                    '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
                ],
                //title : {
                //    text: '未来一周气温变化',
                //    subtext: '纯属虚构'
                //},
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['CJ订单转化率']
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: time
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} %'
                        }
                    }
                ],
                series: [
                    {
                        name: 'CJ订单转化率',
                        type: 'line',
                        data: rate
                        //markPoint : {
                        //    data : [
                        //        {type : 'max', name: '最大值'},
                        //        {type : 'min', name: '最小值'}
                        //    ]
                        //},
                        //markLine : {
                        //    data : [
                        //        {type : 'average', name: '平均值'}
                        //    ]
                        //}
                    }
                    //{
                    //    name:'新增供应商',
                    //    type:'line',
                    //    data:a2
                    //    //markPoint : {
                    //    //    data : [
                    //    //        {name : '周最低', value : -2, xAxis: 1, yAxis: -1.5}
                    //    //    ]
                    //    //},
                    //    //markLine : {
                    //    //    data : [
                    //    //        {type : 'average', name : '平均值'}
                    //    //    ]
                    //    //}
                    //}
                ]
            };
            myChart3.setOption(option);
        }
        function setChart04(list) {
            var time = [];
            var a1 = [];
            var a2 = [];
            $.each(list, function (i, v) {
                time.push(v.time);
                a1.push(v.cun);
                a2.push(v.ocun);
            });
            var option = {
                color: [
                    '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
                    '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
                    '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
                    '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
                ],
                //title : {
                //    text: '未来一周气温变化',
                //    subtext: '纯属虚构'
                //},
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['同步订单量', 'CJ订单量']
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: time
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                        //axisLabel : {
                        //    formatter: '{value} %'
                        //}
                    }
                ],
                series: [
                    {
                        name: '同步订单量',
                        type: 'line',
                        data: a1
                        //markPoint : {
                        //    data : [
                        //        {type : 'max', name: '最大值'},
                        //        {type : 'min', name: '最小值'}
                        //    ]
                        //},
                        //markLine : {
                        //    data : [
                        //        {type : 'average', name: '平均值'}
                        //    ]
                        //}
                    },
                    {
                        name: 'CJ订单量',
                        type: 'line',
                        data: a2
                        //markPoint : {
                        //    data : [
                        //        {name : '周最低', value : -2, xAxis: 1, yAxis: -1.5}
                        //    ]
                        //},
                        //markLine : {
                        //    data : [
                        //        {type : 'average', name : '平均值'}
                        //    ]
                        //}
                    }
                ]
            };
            myChart4.setOption(option);
        }

    }]);

    //客户统计
    app.controller('CustomerStatisticsCtrl', ['$scope', 'erp', '$location', '$routeParams', function ($scope, erp, $location, $routeParams) {
        console.log('CustomerStatisticsCtrl');
        var base64 = new Base64();
        //var id = $routeParams.id;
        var userId = base64.decode($routeParams.id == undefined ? "" : $routeParams.id);
        var userName = base64.decode($routeParams.id == undefined ? "" : $routeParams.name);
        var typeStep = $routeParams.type;
        var myChart = echarts.init(document.getElementById('main'));
        var myChart2 = echarts.init(document.getElementById('main2'));
        $scope.userName = userName;
        $scope.goBackFun = function () {
            location.href = '#/erpcustomer/khgl/' + typeStep;
        };
        $('.menuTable').on('click', '.selectShop', function (e) {
            e.stopPropagation();
        });
        //$scope.isShowFlag=false;
        $scope.month = 1;
        $scope.month2 = 1;

        var d = new Date();
        var y = d.getFullYear();
        gettjList('1', y, userId);
        //获取列表
        function gettjList(type, time, id) {
            var data = {
                dateType: type,
                dateTime: time,
                paymentId: id
            };
            erp.load();
            erp.postFun('erp/analysis/analysisOrderChart', JSON.stringify(data), function (data) {
                erp.closeLoad();
                console.log(data);
                if (data.data.statusCode == '200') {
                    console.log(time);
                    var d = new Date();
                    var y = d.getFullYear();
                    var m = d.getMonth()+1;
                    var day = d.getDate();
                    var result = data.data.result;
                    var data1 = [];
                    var data2 = [];
                    var data4 = [];
                    if (type == '1') {
                        var data3 = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
                        
                        $.each(result, function (i, v) {
                            var month = parseInt(v.payTime.split('-')[1]);
                            console.log(month);
                            if(time == y){
                                //当前年
                                if(month>m){
                                    data1.push('');
                                    data2.push('');
                                    data4.push('');
                                }else{
                                    data1.push(parseInt(v.cjocun));
                                    data2.push(parseInt(v.ocount));
                                    data4.push(parseFloat(v.money));
                                }
                            }else if(time > y){
                                data1.push('');
                                data2.push('');
                                data4.push('');
                            }else{
                                data1.push(parseInt(v.cjocun));
                                data2.push(parseInt(v.ocount));
                                data4.push(parseFloat(v.money));
                            }
                           
                        });
                        setTubiao1(data1, data2, data3);
                        setTubiao2(data3, data4);
                    } else if (type == '2') {
                        var data3 = [];
                        var t = parseInt(time.split('-')[0]);
                        $.each(result, function (i, v) {
                            var str = v.payTime;
                            var arr = str.split('-')[2];
                            data3.push(arr);
                            if(t>y){
                                data1.push('');
                                data2.push('');
                                data4.push('');
                            }else if(t == y){
                                var month = parseInt(v.payTime.split('-')[1]);
                                var dd = parseInt(v.payTime.split('-')[2]);
                                if(month < m){
                                    data1.push(parseInt(v.cjocun));
                                    data2.push(parseInt(v.ocount));
                                    data4.push(parseFloat(v.money));
                                }else if(month == m){
                                    if(dd > day){
                                        data1.push('');
                                        data2.push('');
                                        data4.push('');
                                    }else{
                                        data1.push(parseInt(v.cjocun));
                                        data2.push(parseInt(v.ocount));
                                        data4.push(parseFloat(v.money));
                                    }
                                }else if(month > m){
                                    data1.push('');
                                    data2.push('');
                                    data4.push('');
                                }
                            }else{
                                data1.push(parseInt(v.cjocun));
                                data2.push(parseInt(v.ocount));
                                data4.push(parseFloat(v.money));
                            }
                            // data1.push(parseInt(v.cjocun));
                            // data2.push(parseInt(v.ocount));
                            // data4.push(parseFloat(v.money));
                        });
                        setTubiao1(data1, data2, data3);
                        setTubiao2(data3, data4);
                    } else if (type == '3') {
                        var data3 = [];
                        var t = parseInt(time.split('-')[0]);
                        $.each(result, function (i, v) {
                            var str = v.payTime;
                            var arr = str.split('-')[2];
                            data3.push(arr);
                            if(t>y){
                                data1.push('');
                                data2.push('');
                                data4.push('');
                            }else if(t == y){
                                var month = parseInt(v.payTime.split('-')[1]);
                                var dd = parseInt(v.payTime.split('-')[2]);
                                if(month < m){
                                    data1.push(parseInt(v.cjocun));
                                    data2.push(parseInt(v.ocount));
                                    data4.push(parseFloat(v.money));
                                }else if(month == m){
                                    if(dd > day){
                                        data1.push('');
                                        data2.push('');
                                        data4.push('');
                                    }else{
                                        data1.push(parseInt(v.cjocun));
                                        data2.push(parseInt(v.ocount));
                                        data4.push(parseFloat(v.money));
                                    }
                                }else if(month > m){
                                    data1.push('');
                                    data2.push('');
                                    data4.push('');
                                }
                            }else{
                                data1.push(parseInt(v.cjocun));
                                data2.push(parseInt(v.ocount));
                                data4.push(parseFloat(v.money));
                            }
                        });
                        setTubiao1(data1, data2, data3);
                        setTubiao2(data3, data4);
                    }
                    $('.selsectTimeCon').removeClass('show');

                } else {
                    layer.msg('查询失败');
                }
            }, function () {
                erp.closeLoad();
            });
        }
        function setTubiao1(data1, data2, data3) {
            console.log(data1);
            console.log(data2);
            var serrData = [
                {
                    name: 'CJ平台订单数量',
                    type: 'line',
                    stack: '总量',
                    data: data1
                },
                {
                    name: '客户店铺订单数量',
                    type: 'line',
                    stack: '总量2',
                    data: data2
                }

            ];
            var option = {
                color: ['#F5A623', '#4A90E2'],
                tooltip: {
                    trigger: 'axis'
                },
                calculable: true,
                toolbox: {
                    show: false,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                legend: {
                    //type:'plain',
                    orient: 'vertical',
                    left: '0%',
                    top: '2%',
                    itemWidth: 24,
                    itemHeight: 6,
                    data: [{
                        name: "CJ平台订单数量",
                        icon: 'roundRect'
                    }, {
                        name: "客户店铺订单数量",
                        icon: 'roundRect'
                    }]
                },
                grid: {
                    left: '0%',
                    right: '5%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    //nameLocation:'center',
                    boundaryGap: false,
                    data: data3,
                    name: '日期'
                },
                yAxis: {
                    type: 'value'
                },
                series: serrData
            };
            myChart.setOption(option);
        }
        function setTubiao2(data3, data4) {
            console.log(data3);
            console.log(data4);
            var serrData = [
                {
                    name: 'CJ平台订单金额',
                    type: 'line',
                    stack: '总量',
                    data: data4
                }

            ];
            var option = {
                color: ['#F5A623', '#4A90E2'],
                tooltip: {
                    trigger: 'axis'
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                legend: {
                    //type:'plain',
                    orient: 'vertical',
                    left: '0%',
                    top: '2%',
                    itemWidth: 24,
                    itemHeight: 6,
                    data: [{
                        name: "CJ平台订单金额",
                        icon: 'roundRect'
                    }]
                },
                grid: {
                    left: '0%',
                    right: '5%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    //nameLocation:'center',
                    boundaryGap: false,
                    data: data3,
                    name: '日期'
                },
                yAxis: {
                    type: 'value'
                },
                series: serrData
            };
            myChart2.setOption(option);
        }

        $('.selectInput').click(function () {
            var target = $(this);
            var wrap = target.next('.selsectTimeCon');
            var parent = target.parent().parent().parent();
            var id = parent.attr('id');
            var date = new Date();
            var year = date.getFullYear();
            console.log(year);
            if (id.trim() == 'statisticsWrap1') {
                if ($scope.nowYear == '' || $scope.nowYear == null || $scope.nowYear == undefined) {
                    $scope.nowYear = year;
                }
                if ($scope.ThisYear == '' || $scope.ThisYear == null || $scope.ThisYear == undefined) {
                    $scope.ThisYear = year;
                }
            } else if (id.trim() == 'statisticsWrap2') {
                if ($scope.nowYear2 == '' || $scope.nowYear2 == null || $scope.nowYear2 == undefined) {
                    $scope.nowYear2 = year;
                }
                if ($scope.ThisYear2 == '' || $scope.ThisYear2 == null || $scope.ThisYear2 == undefined) {
                    $scope.ThisYear2 = year;
                }
            }
            if (wrap.hasClass('show')) {
                wrap.removeClass('show');
            } else {
                wrap.addClass('show');
                wrap.find('.selectTime1').show();
                wrap.find('.selectTime2').hide();
                wrap.find('.selectTime3').hide();
                $scope.$apply();
            }
        });
        $('.selsectTimeCon').on('click', '.searchBtn', function () {
            var target = $(this);
            var wrap = target.parent().parent().parent();
            //查询

            //成功后关闭
            wrap.hide();
        });


        //跳转下一步
        $('.selsectTimeCon').on('click', '.select-btn .nextBtn', function () {
            var target = $(this);
            var parent = target.parent().parent();
            var id = parent.attr('data-id');
            var next = parent.next();
            var wrap = parent.parent().parent().parent().parent();
            var wrapId = wrap.attr('id');
            parent.hide();
            if (id.trim() == 'selectTime2') {
                var act = parent.find('span.active');
                var month = parseInt(act.children('span').html());
                if (wrapId.trim() == 'statisticsWrap1') {
                    $scope.month = month;
                } else if (wrapId.trim() == 'statisticsWrap2') {
                    $scope.month2 = month;
                }
            }
            next.find('span.active').removeClass('active');
            next.find('.row').eq(0).find('span').eq(0).addClass('active');
            next.show();
            $scope.$apply();
        });
        //上一年下一年
        $('.selsectTimeCon').on('click', '.select-top>span', function () {
            var target = $(this);
            var wrap = target.parent().parent().parent();
            var content = target.parent().parent();
            var contentId = content.attr('data-id');
            var wrapId = content.parent().parent().parent().parent().attr('id');
            var index = $(this).index();
            if (index == 0) {
                //console.log('prev');
                //var y = $scope.ThisYear;
                var spanact = content.find('.select-bottom span.active');
                var index_1 = spanact.index();
                if (index_1 > 0) {
                    //不需要查找上层
                    var ele = spanact.prev('span');
                    if (contentId.trim() == 'selectTime1') {
                        if (wrapId.trim() == 'statisticsWrap1') {
                            $scope.ThisYear = $scope.ThisYear - 1;
                        } else if (wrapId.trim() == 'statisticsWrap2') {
                            $scope.ThisYear2 = $scope.ThisYear2 - 1;
                        }
                        $scope.$apply();
                    }
                    content.find('span.active').removeClass('active');
                    ele.addClass('active');
                } else {
                    //查找上层
                    var parent = spanact.parent();
                    var index_2 = parent.index();
                    if (index_2 > 0) {
                        //不是第一层
                        var parentele = parent.prev('.row');
                        if (contentId.trim() == 'selectTime3') {
                            var ele = parentele.find('span').eq(1);
                            content.find('span.active').removeClass('active');
                            ele.addClass('active');
                        } else {
                            if (contentId.trim() == 'selectTime1') {
                                var ele = parentele.find('span').eq(2);
                                if (wrapId.trim() == 'statisticsWrap1') {
                                    $scope.ThisYear = $scope.ThisYear - 1;
                                } else if (wrapId.trim() == 'statisticsWrap2') {
                                    $scope.ThisYear2 = $scope.ThisYear2 - 1;
                                }
                                $scope.$apply();
                                content.find('span.active').removeClass('active');
                                ele.addClass('active');
                            } else if (contentId.trim() == 'selectTime2') {
                                var ele = parentele.find('span.month2').eq(2);
                                content.find('span.active').removeClass('active');
                                ele.addClass('active');
                            }
                        }
                    } else {
                        //往前移动一年
                        if (contentId.trim() == 'selectTime1') {
                            if (wrapId.trim() == 'statisticsWrap1') {
                                $scope.ThisYear = $scope.ThisYear - 1;
                                $scope.nowYear = $scope.nowYear - 1;
                            } else if (wrapId.trim() == 'statisticsWrap2') {
                                $scope.ThisYear2 = $scope.ThisYear2 - 1;
                                $scope.nowYear2 = $scope.nowYear2 - 1;
                            }
                            $scope.$apply();
                        } else if (contentId.trim() == 'selectTime2') {
                            if (wrapId.trim() == 'statisticsWrap1') {
                                $scope.ThisYear = $scope.ThisYear - 1;
                            } else if (wrapId.trim() == 'statisticsWrap2') {
                                $scope.ThisYear2 = $scope.ThisYear2 - 1;
                            }
                            var selectTime1 = content.prev('.selectTime1');
                            var selectTime1Act = selectTime1.find('.select-bottom span.active');
                            var index3 = selectTime1Act.index();
                            if (index3 > 0) {
                                //var prev = selectTime1Act.prev('span');
                                selectTime1Act.removeClass('active').prev('span').addClass('active');
                            } else {
                                var parent2 = selectTime1Act.parent();
                                var index4 = parent2.index();
                                if (index4 > 0) {
                                    selectTime1Act.removeClass('active');
                                    parent2.prev().find('span').eq(2).addClass('active');
                                } else {
                                    if (wrapId.trim() == 'statisticsWrap1') {
                                        $scope.nowYear = $scope.nowYear - 1;
                                    } else if (wrapId.trim() == 'statisticsWrap2') {
                                        $scope.nowYear2 = $scope.nowYear2 - 1;
                                    }
                                }
                            }
                            spanact.removeClass('active');
                            content.find('.row').eq(3).find('span.month2').eq(2).addClass('active');
                            $scope.$apply();
                        } else if (contentId.trim() == 'selectTime3') {
                            if (wrapId.trim() == 'statisticsWrap1') {
                                $scope.month = $scope.month - 1;
                                if ($scope.month == 0) {
                                    $scope.month = 12;
                                }
                            } else if (wrapId.trim() == 'statisticsWrap2') {
                                $scope.month2 = $scope.month2 - 1;
                                if ($scope.month2 == 0) {
                                    $scope.month2 = 12;
                                }
                            }
                            var select2 = content.prev('.selectTime2');
                            var select2Act = select2.find('.select-bottom span.active');
                            var index5 = select2Act.index();
                            if (index5 > 0) {
                                //月份不用移至上一行
                                select2Act.removeClass('active').prev('span.month2').addClass('active');
                            } else {
                                var parent3 = select2Act.parent();
                                var index6 = parent3.index();
                                if (index6 > 0) {
                                    //月份移至上一行
                                    select2Act.removeClass('active');
                                    parent3.prev().find('span.month2').eq(2).addClass('active');
                                } else {
                                    //需要移动年份
                                    if (wrapId.trim() == 'statisticsWrap1') {
                                        $scope.ThisYear = $scope.ThisYear - 1;
                                    } else if (wrapId.trim() == 'statisticsWrap2') {
                                        $scope.ThisYear2 = $scope.ThisYear2 - 1;
                                    }
                                    var select3 = select2.prev('.selectTime1');
                                    var select3Act = select3.find('.select-bottom span.active');
                                    var index7 = select3Act.index();
                                    if (index7 > 0) {
                                        //年份不用移至上一行
                                        select3Act.removeClass('active').prev('span').addClass('active');
                                    } else {
                                        var parent4 = select3Act.parent();
                                        var index8 = parent4.index();
                                        if (index8 > 0) {
                                            //年份移至上一行
                                            select3Act.removeClass('active');
                                            parent4.prev().find('span').eq(2).addClass('active');
                                        } else {
                                            //年份往前一年
                                            if (wrapId.trim() == 'statisticsWrap1') {
                                                $scope.nowYear = $scope.nowYear - 1;
                                            } else if (wrapId.trim() == 'statisticsWrap2') {
                                                $scope.nowYear2 = $scope.nowYear2 - 1;
                                            }
                                        }
                                    }
                                    select2Act.removeClass('active');
                                    select2.find('.row').eq(3).find('span.month2').eq(2).addClass('active');
                                }
                            }
                            spanact.removeClass('active');
                            content.find('.row').eq(1).find('span').eq(1).addClass('active');
                            $scope.$apply();
                        }
                    }
                }
            } else if (index == 2) {
                var spanact = content.find('.select-bottom span.active');
                var index_1 = spanact.index();
                if (contentId.trim() == 'selectTime3') {
                    //周
                    if (index_1 < 1) {
                        //不用移至下一行
                        spanact.removeClass('active').next('span').addClass('active');
                    } else {
                        var parent = spanact.parent();
                        var index_3 = parent.index();
                        if (index_3 < 1) {
                            //可以移至下一行
                            var nextparent = parent.next('.row');
                            nextparent.find('span').eq(0).addClass('active');
                            spanact.removeClass('active');
                        } else {
                            //往下移动月份
                            var monthWrap = content.prev('.selectTime2');
                            var actMonth = monthWrap.find('.month2.active');
                            var index_4 = actMonth.index();
                            if (index_4 < 2) {
                                //月份不用换行，直接移至下一个月
                                actMonth.removeClass('active').next('span.month2').addClass('active');
                            } else {
                                var actRow = actMonth.parent();
                                var index_5 = actRow.index();
                                if (index_5 < 3) {
                                    //月份往下移一行
                                    var nextRow = actRow.next('.row');
                                    actMonth.removeClass('active');
                                    nextRow.find('span.month2').eq(0).addClass('active');
                                } else {
                                    //需要移动年份
                                    var yearWrap = monthWrap.prev('.selectTime1');
                                    var actYear = yearWrap.find('.active');
                                    var index_6 = actYear.index();
                                    actMonth.removeClass('active');
                                    monthWrap.find('.row').eq(0).find('.month2').eq(0).addClass('active');
                                    if (index_6 < 2) {
                                        //年份不用换行，直接移至下一年
                                        actYear.removeClass('active').next('span').addClass('active');
                                    } else {
                                        var actYearRow = actYear.parent();
                                        var index_7 = actYearRow.index();
                                        if (index_7 < 3) {
                                            //年份往下一行
                                            var nextYearRow = actYearRow.next('.row');
                                            actYear.removeClass('active');
                                            nextYearRow.find('span').eq(0).addClass('active');
                                        } else {
                                            if (wrapId.trim() == 'statisticsWrap1') {
                                                $scope.nowYear += 1;
                                            } else if (wrapId.trim() == 'statisticsWrap2') {
                                                $scope.nowYear2 += 1;
                                            }
                                        }
                                    }
                                    if (wrapId.trim() == 'statisticsWrap1') {
                                        $scope.ThisYear += 1;
                                    } else if (wrapId.trim() == 'statisticsWrap2') {
                                        $scope.ThisYear2 += 1;
                                    }
                                }
                            }
                            if (wrapId.trim() == 'statisticsWrap1') {
                                if ($scope.month < 12) {
                                    $scope.month += 1;
                                } else {
                                    $scope.month = 1;
                                }
                            } else if (wrapId.trim() == 'statisticsWrap2') {
                                if ($scope.month2 < 12) {
                                    $scope.month2 += 1;
                                } else {
                                    $scope.month2 = 1;
                                }
                            }
                            spanact.removeClass('active');
                            content.find('.row').eq(0).find('span').eq(0).addClass('active');
                            $scope.$apply();
                        }
                    }
                } else {
                    if (index_1 < 2) {
                        var ele = spanact.next('span');
                        if (contentId.trim() == 'selectTime1') {
                            if (wrapId.trim() == 'statisticsWrap1') {
                                $scope.ThisYear = $scope.ThisYear + 1;
                            } else if (wrapId.trim() == 'statisticsWrap2') {
                                $scope.ThisYear2 = $scope.ThisYear2 + 1;
                            }
                            $scope.$apply();
                        }
                        content.find('span.active').removeClass('active');
                        ele.addClass('active');
                    } else {
                        var parent = spanact.parent();
                        var index_2 = parent.index();
                        if (index_2 < 3) {
                            //移至下一行
                            var parentele = parent.next('.row');
                            if (contentId.trim() == 'selectTime1') {
                                var ele = parentele.find('span').eq(0);
                                if (wrapId.trim() == 'statisticsWrap1') {
                                    $scope.ThisYear = $scope.ThisYear + 1;
                                } else if (wrapId.trim() == 'statisticsWrap2') {
                                    $scope.ThisYear2 = $scope.ThisYear2 + 1;
                                }
                                $scope.$apply();
                                spanact.removeClass('active');
                                ele.addClass('active');
                            } else if (contentId.trim() == 'selectTime2') {
                                var ele = parentele.find('span').eq(0);
                                spanact.removeClass('active');
                                ele.addClass('active');
                            }
                        } else {
                            if (contentId.trim() == 'selectTime1') {
                                if (wrapId.trim() == 'statisticsWrap1') {
                                    $scope.ThisYear = $scope.ThisYear + 1;
                                    $scope.nowYear = $scope.nowYear + 1;
                                } else if (wrapId.trim() == 'statisticsWrap2') {
                                    $scope.ThisYear2 = $scope.ThisYear2 + 1;
                                    $scope.nowYear2 = $scope.nowYear2 + 1;
                                }
                            } else if (contentId.trim() == 'selectTime2') {
                                if (wrapId.trim() == 'statisticsWrap1') {
                                    $scope.ThisYear = $scope.ThisYear + 1;
                                } else if (wrapId.trim() == 'statisticsWrap2') {
                                    $scope.ThisYear2 = $scope.ThisYear2 + 1;
                                }
                                var selectTime1 = content.prev('.selectTime1');
                                var selectTime1Act = selectTime1.find('.select-bottom span.active');
                                var index3 = selectTime1Act.index();
                                if (index3 < 2) {
                                    //var prev = selectTime1Act.prev('span');
                                    selectTime1Act.removeClass('active').next('span').addClass('active');
                                } else {
                                    var parent2 = selectTime1Act.parent();
                                    var index4 = parent2.index();
                                    if (index4 < 3) {
                                        selectTime1Act.removeClass('active');
                                        parent2.next().find('span').eq(0).addClass('active');
                                    } else {
                                        if (wrapId.trim() == 'statisticsWrap1') {
                                            $scope.nowYear = $scope.nowYear + 1;
                                        } else if (wrapId.trim() == 'statisticsWrap2') {
                                            $scope.nowYear2 = $scope.nowYear2 + 1;
                                        }
                                    }
                                }
                                spanact.removeClass('active');
                                content.find('.row').eq(0).find('span').eq(0).addClass('active');
                            }
                            $scope.$apply();
                        }
                    }
                }
            } else if (index == 1) {
                //返回上一步
                if (contentId.trim() != 'selectTime1') {
                    var prev = content.prev();
                    content.hide();
                    prev.show();
                }
            }
        });
        $('.selsectTimeCon').on('click', '.row>span', function () {
            var target = $(this);
            var parent = target.parent().parent().parent();
            var parentId = parent.attr('data-id');
            var wrap = parent.parent().parent().parent().parent();
            var id = wrap.attr('id');
            console.log(id);
            if (parentId.trim() == 'selectTime1') {
                var thisYear = parseInt(target.html());
                if (id.trim() == 'statisticsWrap1') {
                    $scope.ThisYear = thisYear;
                } else if (id.trim() == 'statisticsWrap2') {
                    $scope.ThisYear2 = thisYear;
                }
                $scope.$apply();
            } else if (parentId.trim() == 'selectTime2') {
                //var arr = target.html().split('');
                var month = parseInt(target.find('span').html());
                if (id.trim() == 'statisticsWrap1') {
                    $scope.month = month;
                } else if (id.trim() == 'statisticsWrap2') {
                    $scope.month2 = month;
                }
                //console.log( $scope.month);
                $scope.$apply();
            }
            var wrap = target.parent().parent();
            wrap.find('span.active').removeClass('active');
            target.addClass('active');


        });

        //根据时间查询
        $('.selsectTimeCon').on('click', '.select-btn .searchBtn', function () {
            var target = $(this);
            var parent = target.parent().parent();
            var wrap = parent.parent().parent().parent().parent();
            var parentId = parent.attr('data-id');
            var wrapId = wrap.attr('id');
            if (wrapId == 'statisticsWrap1') {
                //订单量
                if (parentId == 'selectTime1') {
                    //查询年份
                    var startTime = $scope.ThisYear + '-01-01';
                    var endTime = $scope.ThisYear + '-12-31';
                    console.log(startTime, endTime);
                    wrap.find('.selectInput').val($scope.ThisYear);
                    gettjList('1', $scope.ThisYear, userId);
                } else if (parentId == 'selectTime2') {
                    //查询年月
                    var startTime = '';
                    var endTime = '';
                    var time = '';
                    if ($scope.month == 2) {
                        if (isLeapYear($scope.ThisYear)) {
                            //是闰年 29
                            startTime = $scope.ThisYear + '-0' + $scope.month + '-' + '1';
                            endTime = $scope.ThisYear + '-0' + $scope.month + '-' + '29';
                            time = $scope.ThisYear + '-0' + $scope.month;
                        } else {
                            startTime = $scope.ThisYear + '-0' + $scope.month + '-' + '1';
                            endTime = $scope.ThisYear + '-0' + $scope.month + '-' + '28';
                            time = $scope.ThisYear + '-0' + $scope.month;
                        }
                    } else if ($scope.month == 1 || $scope.month == 3 || $scope.month == 5 || $scope.month == 7 || $scope.month == 8 || $scope.month == 10 || $scope.month == 12) {
                        if ($scope.month > 9) {
                            startTime = $scope.ThisYear + '-' + $scope.month + '-' + '01';
                            endTime = $scope.ThisYear + '-' + $scope.month + '-' + '31';
                            time = $scope.ThisYear + '-' + $scope.month;
                        } else {
                            startTime = $scope.ThisYear + '-0' + $scope.month + '-' + '01';
                            endTime = $scope.ThisYear + '-0' + $scope.month + '-' + '31';
                            time = $scope.ThisYear + '-0' + $scope.month;
                        }
                    } else {
                        if ($scope.month > 9) {
                            startTime = $scope.ThisYear + '-' + $scope.month + '-' + '01';
                            endTime = $scope.ThisYear + '-' + $scope.month + '-' + '30';
                            time = $scope.ThisYear + '-' + $scope.month;
                        } else {
                            startTime = $scope.ThisYear + '-0' + $scope.month + '-' + '01';
                            endTime = $scope.ThisYear + '-0' + $scope.month + '-' + '30';
                            time = $scope.ThisYear + '-0' + $scope.month;
                        }
                    }
                    console.log(startTime, endTime);
                    wrap.find('.selectInput').val(time);
                    gettjList('2', time, userId);
                } else if (parentId == 'selectTime3') {
                    //查询年月周
                    var week = parent.find('span.active').html();
                    var startTime = '';
                    var endTime = '';
                    var time = '';
                    if (week.trim() == '第一周') {
                        if ($scope.month > 9) {
                            startTime = $scope.ThisYear + '-' + $scope.month + '-' + '01';
                            endTime = $scope.ThisYear + '-' + $scope.month + '-' + '07';
                            time = $scope.ThisYear + '-' + $scope.month + '-' + '07';
                        } else {
                            startTime = $scope.ThisYear + '-0' + $scope.month + '-' + '01';
                            endTime = $scope.ThisYear + '-0' + $scope.month + '-' + '07';
                            time = $scope.ThisYear + '-0' + $scope.month + '-' + '07';
                        }

                    } else if (week.trim() == '第二周') {
                        if ($scope.month > 9) {
                            startTime = $scope.ThisYear + '-' + $scope.month + '-' + '08';
                            endTime = $scope.ThisYear + '-' + $scope.month + '-' + '14';
                            time = $scope.ThisYear + '-' + $scope.month + '-' + '14';
                        } else {
                            startTime = $scope.ThisYear + '-0' + $scope.month + '-' + '08';
                            endTime = $scope.ThisYear + '-0' + $scope.month + '-' + '14';
                            time = $scope.ThisYear + '-0' + $scope.month + '-' + '14';
                        }
                    } else if (week.trim() == '第三周') {
                        if ($scope.month > 9) {
                            startTime = $scope.ThisYear + '-' + $scope.month + '-' + '15';
                            endTime = $scope.ThisYear + '-' + $scope.month + '-' + '21';
                            time = $scope.ThisYear + '-' + $scope.month + '-' + '21';
                        } else {
                            startTime = $scope.ThisYear + '-0' + $scope.month + '-' + '15';
                            endTime = $scope.ThisYear + '-0' + $scope.month + '-' + '21';
                            time = $scope.ThisYear + '-0' + $scope.month + '-' + '21';
                        }

                    } else if (week.trim() == '第四周') {
                        if ($scope.month == 2) {
                            if (isLeapYear($scope.ThisYear)) {
                                //是闰年 29
                                startTime = $scope.ThisYear + '-0' + $scope.month + '-' + '22';
                                endTime = $scope.ThisYear + '-0' + $scope.month + '-' + '29';
                                time = $scope.ThisYear + '-0' + $scope.month + '-' + '28';
                            } else {
                                startTime = $scope.ThisYear + '-0' + $scope.month + '-' + '22';
                                endTime = $scope.ThisYear + '-0' + $scope.month + '-' + '28';
                                time = $scope.ThisYear + '-0' + $scope.month + '-' + '28';
                            }
                        } else if ($scope.month == 1 || $scope.month == 3 || $scope.month == 5 || $scope.month == 7 || $scope.month == 8 || $scope.month == 10 || $scope.month == 12) {
                            if ($scope.month > 9) {
                                startTime = $scope.ThisYear + '-' + $scope.month + '-' + '22';
                                endTime = $scope.ThisYear + '-' + $scope.month + '-' + '31';
                                time = $scope.ThisYear + '-' + $scope.month + '-' + '28';
                            } else {
                                startTime = $scope.ThisYear + '-0' + $scope.month + '-' + '22';
                                endTime = $scope.ThisYear + '-0' + $scope.month + '-' + '31';
                                time = $scope.ThisYear + '-0' + $scope.month + '-' + '28';
                            }
                        } else {
                            if ($scope.month > 9) {
                                startTime = $scope.ThisYear + '-' + $scope.month + '-' + '22';
                                endTime = $scope.ThisYear + '-' + $scope.month + '-' + '30';
                                time = $scope.ThisYear + '-' + $scope.month + '-' + '28';
                            } else {
                                startTime = $scope.ThisYear + '-0' + $scope.month + '-' + '22';
                                endTime = $scope.ThisYear + '-0' + $scope.month + '-' + '30';
                                time = $scope.ThisYear + '-0' + $scope.month + '-' + '28';
                            }
                        }
                    }
                    console.log(startTime, endTime);
                    wrap.find('.selectInput').val(time);
                    gettjList('3', time, userId);
                }
            } else if (wrapId == 'statisticsWrap2') {
                //订单金额
                if (parentId == 'selectTime1') {
                    //查询年份
                    var startTime = $scope.ThisYear2 + '-01-01';
                    var endTime = $scope.ThisYear2 + '-12-31';
                    console.log(startTime, endTime);
                    wrap.find('.selectInput').val($scope.ThisYear2);
                } else if (parentId == 'selectTime2') {
                    //查询年月
                    var startTime = '';
                    var endTime = '';
                    var time = ''
                    if ($scope.month2 == 2) {
                        if (isLeapYear($scope.ThisYear2)) {
                            //是闰年 29
                            startTime = $scope.ThisYear2 + '-0' + $scope.month2 + '-' + '1';
                            endTime = $scope.ThisYear2 + '-0' + $scope.month2 + '-' + '29';
                            time = $scope.ThisYear2 + '-0' + $scope.month2;
                        } else {
                            startTime = $scope.ThisYear2 + '-0' + $scope.month2 + '-' + '1';
                            endTime = $scope.ThisYear2 + '-0' + $scope.month2 + '-' + '28';
                            time = $scope.ThisYear2 + '-0' + $scope.month2;
                        }
                    } else if ($scope.month2 == 1 || $scope.month2 == 3 || $scope.month2 == 5 || $scope.month2 == 7 || $scope.month2 == 8 || $scope.month2 == 10 || $scope.month2 == 12) {
                        if ($scope.month2 > 9) {
                            startTime = $scope.ThisYear2 + '-' + $scope.month2 + '-' + '01';
                            endTime = $scope.ThisYear2 + '-' + $scope.month2 + '-' + '31';
                            time = $scope.ThisYear2 + '-' + $scope.month2;
                        } else {
                            startTime = $scope.ThisYear2 + '-0' + $scope.month2 + '-' + '01';
                            endTime = $scope.ThisYear2 + '-0' + $scope.month2 + '-' + '31';
                            time = $scope.ThisYear2 + '-0' + $scope.month2;
                        }
                    } else {
                        if ($scope.month2 > 9) {
                            startTime = $scope.ThisYear2 + '-' + $scope.month2 + '-' + '01';
                            endTime = $scope.ThisYear2 + '-' + $scope.month2 + '-' + '30';
                            time = $scope.ThisYear2 + '-' + $scope.month2;
                        } else {
                            startTime = $scope.ThisYear2 + '-0' + $scope.month2 + '-' + '01';
                            endTime = $scope.ThisYear2 + '-0' + $scope.month2 + '-' + '30';
                            time = $scope.ThisYear2 + '-0' + $scope.month2;
                        }
                    }
                    console.log(startTime, endTime);
                    wrap.find('.selectInput').val(time);
                } else if (parentId == 'selectTime3') {
                    //查询年月周
                    var week = parent.find('span.active').html();
                    var startTime = '';
                    var endTime = '';
                    if (week.trim() == '第一周') {
                        if ($scope.month2 > 9) {
                            startTime = $scope.ThisYear2 + '-' + $scope.month2 + '-' + '01';
                            endTime = $scope.ThisYear2 + '-' + $scope.month2 + '-' + '07';
                        } else {
                            startTime = $scope.ThisYear2 + '-0' + $scope.month2 + '-' + '01';
                            endTime = $scope.ThisYear2 + '-0' + $scope.month2 + '-' + '07';
                        }
                    } else if (week.trim() == '第二周') {
                        if ($scope.month2 > 9) {
                            startTime = $scope.ThisYear2 + '-' + $scope.month2 + '-' + '08';
                            endTime = $scope.ThisYear2 + '-' + $scope.month2 + '-' + '14';
                        } else {
                            startTime = $scope.ThisYear2 + '-0' + $scope.month2 + '-' + '08';
                            endTime = $scope.ThisYear2 + '-0' + $scope.month2 + '-' + '14';
                        }
                    } else if (week.trim() == '第三周') {
                        if ($scope.month2 > 9) {
                            startTime = $scope.ThisYear2 + '-' + $scope.month2 + '-' + '15';
                            endTime = $scope.ThisYear2 + '-' + $scope.month2 + '-' + '21';
                        } else {
                            startTime = $scope.ThisYear2 + '-0' + $scope.month2 + '-' + '15';
                            endTime = $scope.ThisYear2 + '-0' + $scope.month2 + '-' + '21';
                        }

                    } else if (week.trim() == '第四周') {
                        if ($scope.month2 == 2) {
                            if (isLeapYear($scope.ThisYear2)) {
                                //是闰年 29
                                startTime = $scope.ThisYear2 + '-0' + $scope.month2 + '-' + '22';
                                endTime = $scope.ThisYear2 + '-0' + $scope.month2 + '-' + '29';
                            } else {
                                startTime = $scope.ThisYear2 + '-0' + $scope.month2 + '-' + '22';
                                endTime = $scope.ThisYear2 + '-0' + $scope.month2 + '-' + '28';
                            }
                        } else if ($scope.month2 == 1 || $scope.month2 == 3 || $scope.month2 == 5 || $scope.month2 == 7 || $scope.month2 == 8 || $scope.month2 == 10 || $scope.month2 == 12) {
                            if ($scope.month2 > 9) {
                                startTime = $scope.ThisYear2 + '-' + $scope.month2 + '-' + '22';
                                endTime = $scope.ThisYear2 + '-' + $scope.month2 + '-' + '31';
                            } else {
                                startTime = $scope.ThisYear2 + '-0' + $scope.month2 + '-' + '22';
                                endTime = $scope.ThisYear2 + '-0' + $scope.month2 + '-' + '31';
                            }
                        } else {
                            if ($scope.month2 > 9) {
                                startTime = $scope.ThisYear2 + '-' + $scope.month2 + '-' + '22';
                                endTime = $scope.ThisYear2 + '-' + $scope.month2 + '-' + '30';
                            } else {
                                startTime = $scope.ThisYear2 + '-0' + $scope.month2 + '-' + '22';
                                endTime = $scope.ThisYear2 + '-0' + $scope.month2 + '-' + '30';
                            }
                        }
                    }
                    console.log(startTime, endTime);
                }
            }

        });
        function isLeapYear(year) {
            return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
        }




    }]);

    app.directive('renderFinish', ['$timeout', function ($timeout) {      //renderFinish自定义指令
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
    //客户统计--查看更多
    app.controller('CustomerAnalysisListCtrl', ['$scope', 'erp', '$location', '$routeParams', function ($scope, erp, $location, $routeParams) {
        console.log('CustomerAnalysisListCtrl');
        var myChart = echarts.init(document.getElementById('main1'));
        var myChart2 = echarts.init(document.getElementById('main2'));
        $scope.goBackFun = function () {
            location.href = '#/erpcustomer/khgl/1';
        };
        $scope.$on('ngRepeatFinished', function () {
            $scope.triggleFirst();
        });
        $scope.triggleFirst = function () {
            console.log('加载完毕');
            var first = $('.nameListWrap').find('.list-tr').eq(0);
            first.addClass('act').trigger("click");
        };
        $scope.classFix = function (item) {
            if (item.comcun == 0) {
                return '--';
            } else {
                return parseFloat(item.orderRatio.toFixed(2)) + '%';
            }
        }
        //获取业务员
        getSellManList();
        function getSellManList(){
            erp.postFun('app/account_erp/getAllSalesman',{},function(data){
                // console.log(data.data);
                if(data.data.statusCode=='200'){
                    if(data.data.result){
                        var result =  JSON.parse(data.data.result);
                        $scope.sellManList = result;
                        console.log($scope.sellManList);
                    }
                }
            },function(){});
        }

        var type = $routeParams.type;
        console.log(type);
        if (type == '1') {
            $('.listTop>p').html('可能流失客户');
        } else if (type == '2') {
            $('.listTop>p').html('订单上升客户');
        }
        $scope.type = type;
        $scope.dateType = '1';
        //获取客户列表
        $scope.pageNum11='1';
        $scope.pageSize11='100';
        $scope.sellManName = '';
        getCustomerList();
        function getCustomerList() {
            var data = {
                dateType:$scope.dateType,
                type:$scope.type,
                "sortType":'1',
                salesmanName:$scope.sellManName
            };
            erp.load();
            erp.postFun('erp/analysis/customers', JSON.stringify(data), function (data) {
                erp.closeLoad();
                console.log(data);
                if (data.data.statusCode == '200') {
                    var result = data.data.result;
                    $scope.customerList = result.userList;
                    $scope.customerTotal = result.count;
                    console.log($scope.customerList.length);
                    if ($scope.customerList.length == 0) {
                        setZhexiantu('', []);
                        setBingTu('', [], []);
                        $scope.customerInfo.name = '';
                        $scope.customerInfo.total = 0;
                        $scope.customerInfo.length = 0;
                    }
                } else {
                    layer.msg('获取可能流失的客户失败');
                }
            }, function () {
                erp.closeLoad();
            })
        }

        //业务员筛选
        $('#selectSellMan').change(function(){
            var val = $(this).val();
            console.log(val);
            $scope.sellManName=val;
            getCustomerList();
        });
        //时间删选
        $('.selectWrap').on('click', 'span', function () {
            $(this).addClass('act').siblings('.act').removeClass('act');
            var type = $(this).attr('data-type');
            $scope.dateType = type;
            //var ele = $('.nameListWrap').find('.list-tr.act');
            //console.log(ele);
            getCustomerList();
        });
        $('.nameListWrap').on('click', '.list-tr', function () {
            //console.log('点击');
            var target = $(this);
            target.addClass('act').siblings('.act').removeClass('act');
            //console.log(target);
            var id = target.attr('data-id');
            var name = target.find('.list-td').eq(0).find('span').html();
            var data = {
                paymentId: id,
                dateType: $scope.dateType
            };
            erp.load();
            erp.postFun('erp/analysis/customersChart', JSON.stringify(data), function (data) {
                erp.closeLoad();
                console.log(data.data);
                if (data.data.statusCode == '200') {
                    var result = data.data.result;
                    var zhexianList = result.brokenLine;
                    var zhexianList2 = result.beforeLine;
                    var zhexiantu = [];
                    var zhexiantu2 = [];
                    var zhexianTime = [];
                    $.each(zhexianList, function (i, v) {
                        var d = parseInt(v.payTime);
                        var date = new Date(d);
                        var data = date.getFullYear() + '-'
                            + (date.getMonth() + 1) + '-'
                            + date.getDate();
                        zhexianTime.push(data);
                        zhexiantu.push(parseFloat(v.ocount));
                    });
                    $.each(zhexianList2, function (i, v) {
                        zhexiantu2.push(parseFloat(v.ocount));
                    });

                    console.log(zhexiantu);
                    setZhexiantu(name, zhexiantu, zhexiantu2, zhexianTime);
                    var cake = result.cake;

                    console.log($scope.cakeList);
                    var nameArr = [];
                    var valueArr = [];
                    var cakeCount = 0;
                    $.each(cake, function (i, v) {
                        nameArr.push(v.store_name);
                        var data = {
                            value: v.ocun,
                            name: v.store_name
                        };
                        cakeCount += v.ocun;
                        valueArr.push(data);
                    });
                    $scope.cakeCount = cakeCount;
                    $scope.cakeList = cake;
                    setBingTu(name, valueArr, nameArr);
                    var ele = $('.nameListWrap').find('.list-tr.act');
                    var total = ele.find('.list-td').eq(2).find('span').html();
                    var info = {
                        name: name,
                        length: cake.length,
                        total: total.split('/')[0]
                    };
                    $scope.customerInfo = info;

                } else {
                    layer.msg('查询失败');
                }
            }, function () {
                erp.closeLoad();
            });
        });

        $scope.classRate = function (ocun) {
            return parseFloat(((ocun / $scope.cakeCount) * 100).toFixed(2));
        }


        //TODO2
        function setZhexiantu(name, zhexiantu, zhexiantu2, zhexianTime) {
            var option = {
                color: [
                    '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
                    '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
                    '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
                    '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
                ],
                title: {
                    text: name + '订单数量变化图'
                    //subtext: '纯属虚构'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['CJ 订单量', '环比订单量']
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: zhexianTime
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }
                ],
                series: [
                    {
                        name: 'CJ 订单量',
                        type: 'line',
                        data: zhexiantu,
                        //markPoint : {
                        //    data : [
                        //        {type : 'max', name: '最大值'},
                        //        {type : 'min', name: '最小值'}
                        //    ]
                        //},
                        markLine: {
                            data: [
                                { type: 'average', name: '平均值' }
                            ]
                        }
                    },
                    {
                        name: '环比订单量',
                        type: 'line',
                        data: zhexiantu2,
                        //markPoint : {
                        //    data : [
                        //        {name : '周最低', value : -2, xAxis: 1, yAxis: -1.5}
                        //    ]
                        //},
                        markLine: {
                            data: [
                                { type: 'average', name: '平均值' }
                            ]
                        }
                    }
                ]
            };

            myChart.setOption(option);
        }
        function setBingTu(name, valueArr, nameArr) {
            var option2 = {
                color: [
                    '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
                    '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
                    '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
                    '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
                ],
                //tooltip: {
                //    trigger: 'item',
                //    formatter: "{a} <br/>{b}: {c} ({d}%)"
                //},
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data: nameArr
                },
                series: [
                    {
                        name: '店铺',
                        type: 'pie',
                        radius: ['50%', '70%'],
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
                        data: valueArr
                    }
                ]
            };
            myChart2.setOption(option2);
        }

    }]);

    //客户统计--客户评级
    app.controller('customerGradingCtrl', ['$scope', 'erp', '$location', '$routeParams', function ($scope, erp, $location, $routeParams) {
        console.log('customerGradingCtrl');
        $scope.goBackFun = function () {
            location.href = '#/erpcustomer/khgl/1';
        };
        var myChart = echarts.init(document.getElementById('main1'));
        var myChart2 = echarts.init(document.getElementById('main2'));
        $scope.nowYear = 0;
        $scope.thisYear = 0;
        $scope.oldYear = 0;
        if ($scope.nowYear == 0) {
            var date = new Date();
            $scope.nowYear = date.getFullYear();
            $scope.thisYear = date.getFullYear();
            $scope.oldYear = date.getFullYear()
            //$('.yearSpan').html($scope.thisYear);
        } else {
            //$('.yearSpan').html($scope.thisYear);
        }
        $scope.yearList = [];
        
        $scope.getYearList = function(){
            var date = new Date();
            var year = date.getFullYear();
            var cha = year-2017;
            for(var i=0;i<=cha;i++){
                var y = 2017 + i;
                var data = {
                    year: y
                }
                $scope.yearList.unshift(data);
            }
            console.log($scope.yearList);
        }
        $scope.getYearList();

        $scope.$on('ngRepeatFinished', function () {
            $scope.triggleFirst();
        });
        $scope.triggleFirst = function () {
            console.log('加载完毕');
            var first = $('.nameListWrap').find('.list-tr').eq(0);
            first.addClass('act').trigger("click");
        };
        $('.nameListWrap').on('click', '.list-tr', function () {
            $(this).addClass('act').siblings('.act').removeClass('act');
            var year = $('#selectYearGroup').val();
            var id = $(this).attr('data-id');
            var name = $(this).find('.list-td').eq(0).find('span').html();
            var data = {
                paymentId: id,
                year: year
            };
            console.log(data);
            erp.load();
            erp.postFun('erp/analysis/customersAssessChart', JSON.stringify(data), function (data) {
                erp.closeLoad();
                if (data.data.statusCode == '200') {
                    var result = data.data.result;
                    console.log(result);
                    var data1 = [];
                    var data2 = [];
                    var data3 = [];
                    $.each(result, function (i, v) {
                        var p;
                        if (v.ocount == '0') {
                            p = 0;
                        } else {
                            p = parseFloat(((v.cjocun / v.ocount) * 100).toFixed(2));
                        }
                        v.rate = p;
                        data1.push(v.ocount);
                        data2.push(v.cjocun);
                        var d = new Date();
                        var y = d.getFullYear();
                        var m = d.getMonth()+1;
                        var time = parseInt(v.payTime.split('-')[1]);
                        if(year == y){
                            if(time > m){
                                data3.push('')
                            }else{
                                data3.push(p);
                            }
                        }else{
                            data3.push(p);
                        }
                        
                    });
                    console.log(data3);
                    setZhuzhuangtu(name, data1, data2);
                    setZhexiantu(name, data3);
                } else {
                    layer.msg('查询失败');
                }
            }, function () {
                erp.closeLoad();
            });
        });
        $('#selectYearGroup').change(function(){
            var val = $(this).val();
            var ele = $('.nameListWrap').find('.list-tr.act');
            console.log(ele);
            ele.trigger('click');
        });
        $scope.gotoCustmerDetail = function(id){
            var url = '#/erpcustomer/customer-detail/'+id+'/1';
            window.open(url);
        }



        //点击选择年份
        $('.timeDropWrap').on('click', '.time-tr>span', function () {
            $('.timeDropWrap').find('span.act').removeClass('act');
            $(this).addClass('act');
            var year = $(this).html();
            $scope.thisYear = year;
            $scope.$apply();

        });

        $scope.sureYearFun = function () {
            console.log($scope.thisYear);
            var arr = $('.nameListWrap').find('.list-tr');
            if (arr.length > 0) {
                var ele = arr.eq(0);
                ele.trigger('click');
                $scope.closeYear();
            }
        }
        $scope.prevYear = function () { $scope.changeYear('0'); }
        $scope.nextYear = function () { $scope.changeYear('1'); }
        //改变年份
        $scope.changeYear = function (type) {
            if (type == '0') {
                //往前一年
                var ele = $('.timeDropWrap').find('span.act');
                var eleIndex = ele.index();
                if (eleIndex > 0) {
                    //在这一行移动
                    ele.removeClass('act');
                    var prev = ele.prev('span');
                    prev.addClass('act');
                } else {
                    var parent = ele.parent();
                    var parentIndex = parent.index();
                    if (parentIndex > 0) {
                        //可以往上一行移动
                        var prevParent = parent.prev('.time-tr');
                        ele.removeClass('act');
                        var prev = prevParent.find('span').eq(2);
                        prev.addClass('act');
                    } else {
                        //整体往前移动
                        $scope.nowYear -= 1;
                    }
                }
                $scope.thisYear -= 1;
            } else if (type == '1') {
                //往后一年
                var ele = $('.timeDropWrap').find('span.act');
                var eleIndex = ele.index();
                if (eleIndex < 2) {
                    //在这一行移动
                    ele.removeClass('act');
                    var next = ele.next('span');
                    next.addClass('act');
                } else {
                    var parent = ele.parent();
                    var parentIndex = parent.index();
                    if (parentIndex < 3) {
                        //可以往下一行移动
                        var nextParent = parent.next('.time-tr');
                        ele.removeClass('act');
                        var next = nextParent.find('span').eq(0);
                        next.addClass('act');
                    } else {
                        //整体往后移动
                        $scope.nowYear += 1;
                    }
                }
                $scope.thisYear += 1;
            }
        };


        $scope.selectYearFun = function () {
            $('.timeDropWrap').show();
        }
        $scope.closeYear = function () {
            $('.timeDropWrap').hide();
        }

        //获取客户列表
        //获取客户评级
        getRateList();
        function getRateList() {
            var data = {
                "dateType": '3'
            };
            erp.load();
            erp.postFun('erp/analysis/customersAssess', JSON.stringify(data), function (data) {
                if (data.data.statusCode == '200') {
                    erp.closeLoad();
                    layer.msg('查询成功')
                    console.log(data.data);
                    var pjAList = [];
                    var pjBList = [];
                    var pjCList = [];
                    var result = data.data.result;
                    $.each(result, function (i, v) {
                        var p;
                        if (v.ocun == '0') {
                            p = 0;
                        } else {
                            p = parseFloat(((v.cjocun / v.ocun) * 100).toFixed(2));
                        }
                        v.ratio = p;
                        if (p >= 0 && p <= 30) {
                            pjAList.push(v);
                        } else if (p > 30 && p <= 50) {
                            pjBList.push(v);
                        } else if (p > 50 && p <= 100) {
                            pjCList.push(v);
                        }
                    });
                    $scope.gradList = {
                        "youzhi": pjCList,
                        "putong": pjBList,
                        "qianli": pjAList
                    };
                    console.log($scope.gradList);
                    selecteCustomer()
                } else {
                    erp.closeLoad();
                    layer.msg('查询失败');
                }
            }, function () {
                erp.closeLoad();
            })
        }
        //选择不同类型客户
        $('.selectWrap').on('click', 'span', function () {
            $(this).addClass('act').siblings('.act').removeClass('act');
            selecteCustomer();
            $scope.$apply();
        });
        //筛选客户
        function selecteCustomer() {
            console.log($scope.gradList);
            var ele = $('.selectWrap').find('.act');
            var type = ele.attr('data-value');
            if (type == '0') {
                $scope.customerList = $scope.gradList.youzhi;
            } else if (type == '1') {
                $scope.customerList = $scope.gradList.putong;
            } else if (type == '2') {
                $scope.customerList = $scope.gradList.qianli;
            }
            if ($scope.customerList.length == '0') {
                setZhuzhuangtu('', [], []);
                setZhexiantu('', []);
            }
            console.log($scope.customerList);
            //$scope.$apply();
        }

        function setZhuzhuangtu(name, data1, data2) {
            var data1 = [
                {
                    name: '总订单',
                    type: 'bar',
                    data: data1
                    //markPoint : {
                    //    data : [
                    //        {type : 'max', name: '最大值'},
                    //        {type : 'min', name: '最小值'}
                    //    ]
                    //},
                    //markLine : {
                    //    data : [
                    //        {type : 'average', name: '平均值'}
                    //    ]
                    //}
                },
                {
                    name: 'CJ订单',
                    type: 'bar',
                    data: data2
                    //markPoint : {
                    //    data : [
                    //        {type : 'max', name: '最大值'},
                    //        {type : 'min', name: '最小值'}
                    //    ]
                    //},
                    //markLine : {
                    //    data : [
                    //        {type : 'average', name : '平均值'}
                    //    ]
                    //}
                }
            ];
            var option = {
                // 默认色板
                color: [
                    '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
                    '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
                    '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
                    '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
                ],
                title: {
                    text: name + '的订单历史'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['总订单', 'CJ订单']
                },
                toolbox: {
                    show: false,
                    feature: {
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                grid: {
                    left: '8%',
                    right: "8%"
                },
                series: data1
            };
            myChart.setOption(option);
        }
        function setZhexiantu(name, data3) {
            var data2 = [
                {
                    name: '订单转化率',
                    type: 'line',
                    smooth: true,
                    data: data3
                    //markPoint : {
                    //    data : [
                    //        {type : 'max', name: '最大值'},
                    //        {type : 'min', name: '最小值'}
                    //    ]
                    //},
                    //markLine : {
                    //    data : [
                    //        {type : 'average', name: '平均值'}
                    //    ]
                    //}
                }
            ];
            var option2 = {
                color: [
                    '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
                    '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
                    '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
                    '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
                ],
                title: {
                    text: name + '的订单转化历史曲线'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['订单转化率']
                },
                grid: {
                    left: '8%',
                    right: "8%"
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} %'
                        }
                    }
                ],
                series: data2
            };
            myChart2.setOption(option2);
        }

    }]);

    //客户统计--流失客户
    app.controller('LostCustomerManagementCtrl', ['$scope', 'erp', '$location', '$routeParams', function ($scope, erp, $location, $routeParams) {
        console.log('LostCustomerManagementCtrl');
        var base64 = new Base64();
        //var id = $routeParams.id;
        var userId = base64.decode($routeParams.uid == undefined ? "" : $routeParams.uid);
        var myChart = echarts.init(document.getElementById('main'));
        var myChart2 = echarts.init(document.getElementById('main2'));
        console.log(userId);
        $scope.goBackFun = function () {
            location.href = '#/erpcustomer/khgl';
        };
        getLossCustomerInfo();
        function getLossCustomerInfo() {
            var sendData = {
                userId: userId
            };
            erp.load();
            erp.postFun('erp/analysis/getLossCustomerInfo', JSON.stringify(sendData), function (data) {
                erp.closeLoad();
                if (data.data.statusCode == '200') {
                    console.log(data.data);
                    var list = data.data.result;
                    var seriaData = [];
                    $.each(list, function (i, v) {
                        var data = [];
                        data.push(parseInt(v.date));
                        data.push(parseFloat(v.cun));
                        seriaData.push(data);
                    });
                    console.log(seriaData);
                    setZx(seriaData);

                } else {
                    layer.msg('查询失败');
                }
            }, function () {
                layer.msg('网络错误');
                erp.closeLoad();
            });
        }
        function setZx(data) {
            var option = {
                title: {
                    text: name + '订单数量变化图'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        var date = new Date(params.value[0]);
                        data = date.getFullYear() + '-'
                            + (date.getMonth() + 1) + '-'
                            + date.getDate() + ' '
                            + date.getHours() + ':'
                            + date.getMinutes();
                        return data + '<br/>'
                            + params.value[1]
                    }
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                dataZoom: {
                    show: true,
                    start: 0
                },
                legend: {
                    data: ['订单量']
                },
                grid: {
                    left: '5%',
                    right: '5%',
                    y2: 80
                },
                xAxis: [
                    {
                        type: 'time',
                        splitNumber: 10
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '订单量',
                        type: 'line',
                        showAllSymbol: true,
                        data: data
                    }
                ]
            };
            myChart.setOption(option);
        }
    }]);
    
    //客户分析 已流失客户
    app.controller('lostCustomerCtrl', ['$scope', 'erp', '$location', '$routeParams', function ($scope, erp, $location, $routeParams){
        console.log('lostCustomerCtrl');
        var base64 = new Base64();
        $scope.goBackFun = function () {
            location.href = '#/erpcustomer/khgl/1';
        }
        $scope.dateType = '1';
        $scope.pageNum = '1';
        $scope.pageSize = '20';
        $scope.searchInfo = '';
        $scope.isSetVIP = false;
        $scope.typeRemark = '';
        //2 需吃透  3 需跟进
        $('.selectDateGroup').on('click','a',function(e){
            var target = $(e.target);
            // e.preventDefault;
            e.preventDefault();
            target.addClass('act').siblings('.act').removeClass('act');
            var type = target.attr('href');
            $scope.dateType = type;
            getLostList();
        });
        $scope.searchFun = function () {
            $scope.pageNum = '1';
            getLostList();
        }

        //已流失的客户
        getLostList();
        function getLostList() {
            var index = layer.load(2, {
                shade: [0.3, '#393D49'], content: '加载中,请稍等', success: function (layero) {
                    layero.find('.layui-layer-content').css({
                        'width': '300px',
                        'padding-left': '36px',
                        'padding-top': '5px'
                    });
                }
            });
            var sendData = {
                dateType: $scope.dateType,
                pageNum: $scope.pageNum,
                pageSize: $scope.pageSize,
                salesmanName: $scope.searchInfo
            };
            erp.postFun('erp/analysis/getLossCustomer', JSON.stringify(sendData), function (data) {
                layer.close(index);
                if (data.data.statusCode == '200') {
                    console.log(data.data.result);
                    var list = data.data.result.userList;
                    $scope.lostList = list;
                    $scope.totalCounts = data.data.result.count;
                    pageFun();
                } else {
                    layer.msg('获取已流失客户列表失败')
                }
            }, function () {
                layer.close(index);
                layer.msg("网络错误")
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
                    $scope.pageNum = n + '';
                    getLostList();
                }
            });
        }
        //更换每页多少条数据
        $scope.pagechange = function (pagesize) {
            //console.log(pagesize)
            // $scope.pagesize=pagesize-0;
            $scope.pageNum = '1';
            getLostList();
        };
 
        //手动输入页码GO跳转
        $scope.pagenumchange = function () {
            var pagenum = Number($scope.pageNum);
            var totalpage = Math.ceil($scope.totalCounts / $scope.pageSize);
            if (pagenum > totalpage) {
                layer.msg('错误页码');
                $scope.pageNum = '1';
            } else {
                getLostList();
            }
        };
        $scope.openDetail = function (id,name) {
            // var id = base64.encode(id);
            // var name = base64.encode(name);
            // location.href = '#/erpcustomer/khtj/' + id + '/' + name + '/' + $scope.step;
            window.open('manage.html#/erpcustomer/customer-detail/' + id + '/1', '_blank', '');
        }
        $scope.classEmpty = function (item) {
            if (item) {
                return item;
            } else {
                return '--';
            }
        }
        $scope.classType = function (type) {
            if(type == '0'){
                return '小客户';
            }else if(type == '1'){
                return 'VIP';
            }else if(type == '2'){
                return '需吃透';
            }else if(type == '3'){
                return '需跟进';
            }
        }
        //客户类型修改
        $scope.changeTypeFun = function (type,item) {
            $scope.setName = item.login_name;
            $scope.setType = type;
            $scope.isSetVIP = true;
            $scope.sendData =  {
                id:item.id,
                type:type
            }
        }
        $scope.sureChangeType = function () {
            var sendData = $scope.sendData;
            sendData.remark = $scope.typeRemark;
            console.log(sendData);
            erp.load();
            erp.postFun('erp/accAssign/setVip',JSON.stringify(sendData),function(data){
                erp.closeLoad();
                if (data.data.result > 0) {
                    layer.msg('设置成功');
                    $scope.typeRemark = '';
                    $scope.sendData = {};
                    $scope.isSetVIP = false;
                    getLostList();
                }else{
                    layer.msg('设置失败')
                }
            },function(){
                erp.closeLoad();
            })
        }
        $scope.closeZZC = function () {
            $scope.isSetVIP = false;
            $scope.sendData = {};
        }

    }]);
    
    //xiaoy -2019-6-25
    //push-table
    app.controller('pushTableCtrl', ['$scope', 'erp', '$location', '$q', function ($scope, erp, $location, $q) {
        function mypost (url, params) {
            return $q((resolve, reject) => {
                erp.postFun(url, JSON.stringify(params), function ({data}) {
                    erp.closeLoad();
                    const {result, statusCode, message} = data;
                    if (statusCode != 200) {
                        reject(data)
                        return layer.msg(message)
                    }
                    resolve(result)
                }, function(err) {
                    console.log('errHandle  --->  ', err)
                    reject(err)
                    erp.closeLoad();
                    layer.msg('服务器错误')
                })
            })
        }
        $scope.info = {
            sTime: '',
            eTime: '',
            userName: '全部',
            search: '',
            pageNum: '1',
            pageSize: '20',
            total: '1'
        },
        $scope.pageIndex = '';//going pageNum
        $scope.userNameList = [];//发布人列表
        $scope.goodsPushList = [];//商品列表
        $scope.searchInfo = function () {
            $scope.info.pageNum = '1';
            // $scope.info.pageSize = '20';
            $scope.info.sTime = $('#s-time').val();
            $scope.info.eTime = $('#e-time').val();
            getListInfo()
        }
        $scope.pageIndexHandle = function () {
            let {pageNum, total, pageSize} = $scope.info;
            const pageIndex = $scope.pageIndex;
            if ((pageIndex < 1) || (pageIndex > Math.ceil(total/pageSize) )) return layer.msg('页面不存在');
            if (pageIndex == pageNum) return ;
            $scope.info.pageNum = pageIndex;
            getListInfo();
        }
        $scope.pageSizeChange = function () {
            $scope.info.pageNum = '1';
            getListInfo();
        }
        $scope.newItem = function () {//跳转新增页面
            $location.path('/erpcustomer/pushnew');
        }
        $scope.checkDetail = function (i) {//跳转修改页面
            const id = $scope.goodsPushList[i].push_id;
            $location.search({id})
            $location.path('/erpcustomer/pushdetail')
        }
        //分页
        function pageFun() {
            let {pageNum: currentPage, total, pageSize} = $scope.info;
            total = total ? total * 1 : 1;
            $(".page-group").jqPaginator({
                totalCounts: total,
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
                    // console.log('onpage', n, type)
                    if (type == 'init') return;
                    $scope.info.pageNum = n + '';//当前页
                    getListInfo();
                }
            });
        }
        function outputList (arrList) {//格式化数据列表 补足空余数据
            $scope.goodsPushList = arrList.map(item => ({...item, detailBtn: true}));//显示 /渲染 详情按钮
        }
        function getListInfo() {
            let params = {...$scope.info};
            params.userName = params.userName === '全部' ? '' : params.userName;
            erp.load();
            mypost('erp/appPush/getPushList', params).then(({total, list}) => {
                $scope.info.total = total + '';
                list && outputList(list)
                pageFun()
            })
        }
        function getUserName () {
            let params = {...$scope.info};
            delete params.userName;
            erp.load();
            mypost('erp/appPush/getPushList', params).then(({users}) => {
                $scope.userNameList = users.map(name => ({name}));
            })
        }
        //init
        getUserName()
        getListInfo()
    }]);
    app.controller('pushNewCtrl', ['$scope', 'erp', '$location', '$timeout', '$q', function ($scope, erp, $location, $timeout, $q) {//新增推送页面
        //common fn ----------------------------------------------------------
        function errHandle (err) {//数据请求异常处理
            console.log('errHandle  --->  ', err)
            erp.closeLoad();
            layer.msg('服务器错误')
            layer.closeAll('loading')
        }
        function myMsg (str) {//提示框
            return layer.msg(str)
        }
        //分页 适合一次请求数据 前段处理分页
        function renderPage (currentPage, pageSize, totalCounts, dom, cb) {
            totalCounts = totalCounts ? totalCounts * 1 : 1;
            dom.jqPaginator({
                totalCounts,
                pageSize: pageSize * 1,
                visiblePages: 5,
                currentPage: currentPage * 1,
                activeClass: 'current-page',
                first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
                last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
                prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
                next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
                page: '<a href="javascript:void(0);" class="cb-operate">{{page}}<\/a>',
                onPageChange: function (n, type) {
                    if (type == 'init') return;
                    cb && cb(n)
                }
            });
        }
        function mypost (url, params) {
            return $q((resolve, reject) => {
                erp.postFun(url, JSON.stringify(params), function ({data}) {
                    erp.closeLoad();
                    const {result, statusCode, message} = data;
                    if (statusCode != 200) {
                        reject(data)
                        return myMsg(message)
                    }
                    resolve(result)
                }, function(err) {
                    console.log('errHandle  --->  ', err)
                    reject(err)
                    erp.closeLoad();
                    layer.msg('服务器错误')
                })
            })
        }
        function initConfirmBox ({title='确认', tip, cb}) {
            $scope.confirmBox = {
                hasShow: true,
                ok () {
                    tip && myMsg(tip)
                    cb && cb()
                    this.hasShow = false;
                },
                cancel () {
                    this.hasShow = false;
                },
                title,
            }
        }
        //common fn ----------------------------------------------------------

        $scope.allowEdit = false;//手动选择商品 是否 可编辑
        // ----获取商品列表所需参数
        const GoodsCategorysDic = {//名称对应的  id
            '计算机及办公': '1126E280-CB7D-418A-90AB-7118E2D97CCC',
            '包和鞋子': '2415A90C-5D7B-4CC7-BA8C-C0949F9FF5D8',
            '珠宝和手表': '2837816E-2FEA-4455-845C-6F40C6D70D1E',
            '保健，美容，美发': '2C7D4A0B-1AB2-41EC-8F9E-13DC31B1C902',
            '女士服装': '2FE8A083-5E7B-4179-896D-561EA116F730',
            '运动和户外': '4B397425-26C1-4D0E-B6D2-96B0B03689DB',
            '居家用品，家具': '52FC6CA5-669B-4D0B-B1AC-415675931399',
            '家装': '6A5D2EB4-13BD-462E-A627-78CFED11B2A2',
            '汽车和摩托车': 'A2F799BE-FB59-428E-A953-296AA2673FCF',
            '玩具，儿童及婴儿用品': 'A50A92FA-BCB3-4716-9BD9-BEC629BEE735',
            '男士服装': 'B8302697-CF47-4211-9BD0-DFE8995AEB30',
            '消费电子': 'D9E66BF8-4E81-4CAB-A425-AEDEC5FBFBF2',
            '手机及配件': 'E9FDC79A-8365-4CA6-AC23-64D971F08B8B',
        }
        function getGoodsCategorys () {//获取商品类目id  逗号连成字符串
            const n = $scope.submitParams.customerGroup;
            if (n == 1) return $scope.goodscheckbox.selectedArr.map(({name}) => GoodsCategorysDic[name]).join(',')//商品类目
            if (n == 2) return $scope.mycheckbox.selectedArr.map(({name}) => GoodsCategorysDic[name]).join(',')//客户群体类型
        }
        // ---
        
        //手动推送商品页面  --------------------
        $scope.pushGoodsListPamrams = {//推送 商品列表 获取所需参数
            pageNum: '1',
            pageSize: '20',
            total: '1',
            navPage: '',//跳转页面
            hasAllSelected: false,//全选按钮
            productName: '',//  产品名称 sku 搜索栏
            productcate: '',//  商品类目id 逗号连成字符串
            pushStatus: '0'// 0 => 左边   1 => 右边待推送列表
        }
        $scope.pushGoodsListInfo = [];//push 当前页 推送 数据列表
        $scope.goodsWaitingPush = [];//push 待推送列表
        $scope.selectItem = function (i) {//单选商品列表
            // console.log('selectItem', i)
            $scope.pushGoodsListInfo[i].checked = !$scope.pushGoodsListInfo[i].checked;
            const allSelected = $scope.pushGoodsListInfo.every(({checked}) => checked);
            $scope.pushGoodsListPamrams.hasAllSelected = allSelected;
        }
        $scope.allSelectHandle = function () {//全选商品列表
            let bol = !$scope.pushGoodsListPamrams.hasAllSelected;
            $scope.pushGoodsListPamrams.hasAllSelected = bol;
            $scope.pushGoodsListInfo.forEach(item => item.checked = bol);
        }
        
        function getPushGoodsList (n) {//获取商品列表数据  同时设置 页码跳转模块
            erp.load()
            let productcate = getGoodsCategorys()
            let params = {...$scope.pushGoodsListPamrams, productcate}
            let p = mypost('erp/appPush/productList', params);
            p.then(function ({productManual, total}) {
                // console.log('getPushGoodsList-------------------------',productManual);
                n && ($scope.pushGoodsListPamrams.pageNum = n + '');//成功跳转页面后赋值当前页面
                $scope.pushGoodsListInfo = productManual.map(item => {
                    let img = item.img.split(',').pop();//后台数据 的img 有可能多个 字符串逗号拼接 默认选取第一个
                    return {...item, checked: false, img}//checked false  默认没有选中
                })
                let {pageNum, pageSize} = $scope.pushGoodsListPamrams;
                $scope.pushGoodsListPamrams.total = total + '';
                const dom = $('.push-page');
                renderPage(pageNum, pageSize, total, dom, changePushListPage)
            })
        }
        function changePushListPage (n) {//页码跳转 jqPaginator回调
            if ( $scope.pushGoodsListInfo.some(({checked}) => checked) ) return myMsg('页面跳转不会保存本页选中的商品')
            getPushGoodsList(n)
        }
        $scope.pageGo = function () {//跳转页面
            if ( $scope.pushGoodsListInfo.some(({checked}) => checked) ) return myMsg('页面跳转不会保存本页选中的商品')
            const {navPage: n, total, pageSize, pageNum} = $scope.pushGoodsListPamrams;
            if (n == pageNum) return
            if (n && n <=  Math.ceil(total/pageSize) && n > 0) {//异常页码处理
                getPushGoodsList(n)
            } else {
                myMsg('请输入正确的页码进行跳转');
            }
        }
        function getWaitingPushGoodsList () {//获取待推送列表数据
            erp.load()
            let productcate = getGoodsCategorys()
            let params = {...$scope.pushGoodsListPamrams, productcate, pushStatus: '1'};//pageSize 后端不处理 直接返回全部
            let p = mypost('erp/appPush/productList', params);
            p.then(function ({pending}) {
                $scope.goodsWaitingPush = pending.map(item => {
                    const img = item.img.split(',').pop();//img 可能多个  字符串形式逗号分隔
                    return {...item, backChecked: false, img};
                })
            })
        }
        // getPushGoodsList()
        // getWaitingPushGoodsList()
        //手动推送商品页面  ------------------------------------------------------------------------------
        //自动推荐 商品页面 --------------------
        $scope.autoPushGoodsParams = {//推荐页面所需参数 及  页面绑定数据
            pageNum: '1',
            pageSize: '10',
            total: '1',//默认设置一个
            productcate: '',//所选商品类目 id 拼接
            autoCount: '',//自动推送数量
            pushStatus:"0",
            hasShow: false,//是否显示
            navPage: ''//跳转页面
        }
        $scope.autoPushGoodsListInfo = [];//autopush  自动推送 数据列表
        $scope.autoPushGoodsCurrentList = [];//autopush  自动推送 数据列表 current  当前显示列表
        function getAutoPushGoodsList () {//获取自动推送 商品列表
            let productcate = getGoodsCategorys()
            let params = {...$scope.autoPushGoodsParams, productcate}
            erp.load()
            mypost('erp/appPush/productAutoList', params).then(({productAuto1, total}) => {
                $scope.autoPushGoodsListInfo = productAuto1.map(item => {
                    let img = item.img.split(',').pop();//后台数据 的img 有可能多个 字符串逗号拼接 默认选取第一个
                    return {...item, checked: true, img}
                });
                let {pageNum, pageSize} = $scope.autoPushGoodsParams
                $scope.autoPushGoodsParams.total = total;
                $scope.autoPushGoodsCurrentList = $scope.autoPushGoodsListInfo.slice((pageNum - 1) * pageSize, pageNum * pageSize);
                const dom = $('.auto-push-page');
                renderPage(pageNum, pageSize, total, dom, changeAutoPushListPage)
            })
        }
        function changeAutoPushListPage (n) {//页码跳转
            const pageSize = $scope.autoPushGoodsParams.pageSize;
            $timeout(function () {
                $scope.autoPushGoodsCurrentList = $scope.autoPushGoodsListInfo.slice((n - 1) * pageSize, n * pageSize);
            },0)
        }
        $scope.inputHandle = function (ev) {
            // console.log('inputHandle', ev)
            // $scope.autoPushGoodsParams.autoCount = ev.target.value;
        }
        $scope.editAutoPushGoodsList = function () {//修改自动推送商品界面btn
            if ($scope.submitParams.driverWay == 1 && $scope.allowEdit) return myMsg('请先完成手动推送 编辑页面 (点击完成)')
            const autoCount = $scope.autoPushGoodsParams.autoCount
            if (autoCount >= 1 && autoCount <= 200) {
                $scope.autoPushGoodsParams.hasShow = true;
                getAutoPushGoodsList();
            } else {
                myMsg('请输入1 -- 200 之间的推送数量')
            }
        }
        $scope.pageTo = function () {//跳转页面
            const {navPage: n, total, pageSize} = $scope.autoPushGoodsParams;
            if (n && n <=  Math.ceil(total/pageSize) && n > 0) {//异常页码处理
                changeAutoPushListPage(n);
                $scope.autoPushGoodsParams.pageNum = n + '';
                $('.box-wrap .cb-operate').removeClass('current-page').eq(n-1).addClass('current-page')
            } else {
                myMsg('请输入正确的页码进行跳转')
            }
        }
        //自动推荐 商品页面 ------------------------------------------------------------------------------
        // 最终提交保存   ----------
        $scope.searchGoods = function () {//查询商品
            getPushGoodsList();
            getWaitingPushGoodsList();
        }
        $scope.addGoods = function () {//添加商品
            const goodsWaitingPush = $scope.pushGoodsListInfo.filter(({checked}) => checked);
            if (goodsWaitingPush.length === 0) return myMsg('请选择添加商品')
            const productid = goodsWaitingPush.map(({productid}) => productid).join(',')
            const p = mypost('erp/appPush/updatePushProducts', {productid, pushStatus: '1'});
            p.then(function() {
                $scope.pushGoodsListPamrams.hasAllSelected = false;//此时全选按钮
                getPushGoodsList();
                getWaitingPushGoodsList();
            })
        }
        $scope.backGoods = function () {//还原商品
            const goodsWaitingPush = $scope.goodsWaitingPush.filter(({backChecked}) => backChecked);
            if (goodsWaitingPush.length === 0) return myMsg('请选择还原商品')
            const productid = goodsWaitingPush.map(({productid}) => productid).join(',')
            const p = mypost ('erp/appPush/updatePushProducts', {productid, pushStatus: '0'});
            p.then(function() {
                getPushGoodsList();
                getWaitingPushGoodsList();
            })
        }
        $scope.typeChangeHandle = function (i) {//手自一体 手动 自动切换
            $scope.submitParams.driverWay = i;
        }
        $scope.submitParams = {
            title: '',//标题 必填项
            content: '',//内容 必填项
            push_type: '1',//推送类型  1=> 商品推送  暂时只有一种 为默认
            picurl: '',// img  选填
            productIds: '',//必填  产品id连接 必填 未选择推送商品
            customerGroup: 1,//必填  1 商品自动分配 2 定向分送
            categoryName: '',//必填  类目名称 逗号连接字符串
            driverWay: '1',//必填  1 手自一体 2 手动 3 自动
            disabled: false,//控制 是否可编辑
        };
        $scope.pushType = '手自一体';
        $scope.goodsTypeArr = ['全部', '商品类目1', '商品类目2'];
        function getProductIds () {//产品id  逗号连接 手动自动 所选商品的 id
            const n = $scope.submitParams.driverWay;//推送发送
            if (n == 1) return [...$scope.goodsWaitingPush.map(({productid}) => productid), ...$scope.autoPushGoodsListInfo.map(({productid}) => productid)].join(',')
            if (n == 2)  return $scope.goodsWaitingPush.map(({productid}) => productid).join(',')
            if (n == 3) return $scope.autoPushGoodsListInfo.map(({productid}) => productid).join(',')
        }
        function getCategoryName () {//获取商品类目名称  __ 连接
            const n = $scope.submitParams.customerGroup;
            if (n == 1) return $scope.goodscheckbox.selectedArr.map(({name}) => name).join('__');//商品类目
            if (n == 2) return $scope.mycheckbox.selectedArr.map(({name}) => name).join('__');//客户群体类型
        }
        $scope.sendHandle = function () {
            let {push_type, title, content, picurl, productIds, customerGroup, categoryName, driverWay, disabled} = $scope.submitParams
            if (disabled) return
            if (!title) return myMsg('请输入标题');
            if (!content) return myMsg('请输入内容');
            if (!picurl) return myMsg('请输上传图片');
            // console.log('picurl----',picurl )
            categoryName = getCategoryName();
            productIds = getProductIds();
            if (!productIds) return myMsg('待推送商品不得为空');
            const params = {push_type, title, content, picurl, productIds, customerGroup, categoryName, driverWay}
            console.log('submitParams ->>',params);
            initConfirmBox({title: '确认发布', cb: function() {
                erp.load()
                const p = mypost('erp/appPush/insertPushInfo', params);
                p.then(function (data) {
                    myMsg('保存成功')
                    $location.path('/erpcustomer/pushtable')
                })
            }})
        }
        $scope.cancelSend = function () {//取消保存  删除推送列表中的数据
            initConfirmBox({title: '确认返回 ?', cb: function() {
                const goodsWaitingPush = $scope.goodsWaitingPush
                console.log('cancelSend', goodsWaitingPush)
                erp.load()
                if (goodsWaitingPush.length > 0) {
                    const productid = goodsWaitingPush.map(({productid}) => productid).join(',')
                    const p = mypost ('erp/appPush/updatePushProducts', {productid, pushStatus: '0'});
                    p.then(function() {
                        $location.path('/erpcustomer/pushtable')
                    })
                } else $location.path('/erpcustomer/pushtable')
                
            }})
        }
        customerGroup = [{name: '系统根据商品自动匹配', value: 1}, {name: '定向发送', value: 2}];
        $scope.uploadImg = function () {
            cjUtils.readLocalFile({}).then(res => {
                res.FileArr.forEach(({file}) => {// output url for preview by base64=> json.base64
                    // console.log('uploadImg --------->  ', file);
                    const {type, size} = file;
                    if (/(png|jpe?g)$/.test(type) === false) return myMsg('上传文件仅支持jpg或png格式');
                    if (Math.ceil(size/(1024*1024) > 10)) return myMsg('上传文件不能超过10m');
                    erp.load()
                    const isOnline = window.environment.includes('production');
                    const ossUrl =  isOnline ? 'https://app.cjdropshipping.com/app/oss/policy' : 'http://erp.test.com/app/oss/policy';
                    cjUtils.uploadFileToOSS({ file, signatureURL: ossUrl })
                        .then(url => {//async url for saving =>
                            $timeout(function() {$scope.submitParams.picurl = url;}, 0)
                            myMsg('图片上传成功')
                            erp.closeLoad();
                        })
                        .catch(err => {
                            console.log('uploadImg err => ', err)
                            $timeout(function() {$scope.submitParams.picurl = '';}, 0)
                            myMsg('图片上传失败')
                            erp.closeLoad();
                        })
				})
			})
        }
        /* 自定义多选框 ----------------*/
        $scope.toggleMode = function (n) {//客户群体 切换模式
            if (n == 1) {//自动匹配
                $scope.goodscheckbox.disabled = false;
                $scope.mycheckbox.disabled = true;
                $scope.mycheckbox.selectedArr = [];//多选框已选项
                $scope.mycheckbox.kindsList.forEach(item => item.checked = false)
            } else {//定向发送
                $scope.mycheckbox.disabled = false;
                $scope.goodscheckbox.disabled = true;
                $scope.goodscheckbox.selectedArr = [];//多选框已选项
                $scope.goodscheckbox.kindsList.forEach(item => item.checked = false)
                $scope.pushGoodsListInfo = [];//push 当前页 推送 数据列表
                // $scope.goodsWaitingPush = [];//push 待推送列表
            }
            $scope.submitParams.customerGroup = n;
        }
        const kindsList = ['计算机及办公', '包和鞋子', '珠宝和手表', '保健，美容，美发', '女士服装', '运动和户外' , '居家用品，家具', '家装', '汽车和摩托车', '玩具，儿童及婴儿用品', '男士服装', '消费电子', '手机及配件']
        const customerList = kindsList.map(item => ({name:item, checked: false}));
        $scope.mycheckbox = {//定向发送
            kindsList: customerList,
            text: '请选择类目',
            selectAreaShow: false,
            hoverIndex: -1,
            textblur: false,
            selectedArr: [],//选中的商品类目
            disabled: true,
        }
        $scope.showHandle = function (ev) {//显示商品类目选择列表
            ev && ev.stopPropagation()
            const bol = $scope.mycheckbox.textblur;
            // console.log('showHandle', bol)
            $scope.mycheckbox.textblur = !bol;
            $scope.mycheckbox.selectAreaShow = !bol;
        }
        $scope.mouseoverHandle = function (i) {//悬浮颜色高亮
            if ($scope.submitParams.disabled || $scope.mycheckbox.disabled) return
            // console.log('mouseoverHandle', i)
            $scope.mycheckbox.hoverIndex = i;
        }
        $scope.selectItem1 = function (i, ev) {//选择商品类目
            ev && ev.stopPropagation()
            if ($scope.submitParams.disabled || $scope.mycheckbox.disabled) return
            const bol = $scope.mycheckbox.kindsList[i].checked;
            $scope.mycheckbox.kindsList[i].checked = !bol;
            $scope.mycheckbox.selectedArr = $scope.mycheckbox.kindsList.filter(({checked}) => checked);
            calcuTxt()
        }
        function calcuTxt () {//计算显示文字
            // const txt = $scope.mycheckbox.selectedArr.map(({name}) => name).join('-');
            const len = $scope.mycheckbox.selectedArr.map(({name}) => name).length;
            const txt = `已选择 ${len} 个类目`;
            $scope.mycheckbox.text = $scope.mycheckbox.textblur || len > 0 ? txt : '请选择类目' ;
        }
        document.onclick = function () {//点击其他隐藏商品类目选择框
            $timeout(function () {
                $scope.mycheckbox.selectAreaShow = false;
                $scope.mycheckbox.textblur = false;
                calcuTxt()
            }, 0)
        }

        const goodsTypeList = kindsList.map(item => ({name:item, checked: false}));
        $scope.goodscheckbox = {//商品类目
            kindsList:goodsTypeList,
            text: '请选择类目',
            selectAreaShow: false,
            hoverIndex: -1,
            textblur: false,
            selectedArr: [],//选中的商品类目
            disabled: false,
        }
        $scope.showHandle2 = function (ev) {//显示商品类目选择列表
            ev.stopPropagation()
            const bol = $scope.goodscheckbox.textblur;
            // console.log('showHandle2', bol)
            $scope.goodscheckbox.textblur = !bol;
            $scope.goodscheckbox.selectAreaShow = !bol;
        }
        $scope.mouseoverHandle2 = function (i) {//悬浮颜色高亮
            if ($scope.submitParams.disabled || $scope.goodscheckbox.disabled) return
            // console.log('mouseoverHandle', i)
            $scope.goodscheckbox.hoverIndex = i;
        }
        $scope.selectItem2 = function (i, ev) {//选择商品类目
            ev && ev.stopPropagation()
            if ($scope.submitParams.disabled || $scope.goodscheckbox.disabled) return
            const bol = $scope.goodscheckbox.kindsList[i].checked;
            $scope.goodscheckbox.kindsList[i].checked = !bol;
            
            $scope.goodscheckbox.selectedArr = $scope.goodscheckbox.kindsList.filter(({checked}) => checked);  //checked
            calcuTxt2()
        }
        function calcuTxt2 () {//计算显示文字
            // const txt = $scope.goodscheckbox.selectedArr.map(({name}) => name).join('-');
            const len = $scope.goodscheckbox.selectedArr.map(({name}) => name).length;
            const txt = `已选择 ${len} 个类目`;
            $scope.goodscheckbox.text = $scope.goodscheckbox.textblur || len > 0 ? txt : '请选择类目' ;
        }
        document.onclick = function () {//点击其他隐藏商品类目选择框
            $timeout(function () {
                $scope.mycheckbox.selectAreaShow = false;
                $scope.mycheckbox.textblur = false;
                calcuTxt()
                $scope.goodscheckbox.selectAreaShow = false;
                $scope.goodscheckbox.textblur = false;
                calcuTxt2()
            }, 0)
        }
        /* 自定义多选框  ---------------------------------------------------------------------------*/
        // console.log('cjUtils -------->', cjUtils)
    }])
    app.controller('pushDetailCtrl', ['$scope', 'erp', '$location', '$timeout', '$q', function ($scope, erp, $location, $timeout, $q) {
        function errHandle (err) {//数据请求异常处理
            console.log('errHandle  --->  ', err)
            erp.closeLoad();
            layer.msg('服务器错误')
            layer.closeAll('loading')
        }
        function myMsg (str) {//提示框
            return layer.msg(str)
        }
        //分页 适合一次请求数据 前段处理分页
        function renderPage (currentPage, pageSize, totalCounts, dom, cb) {
            totalCounts = totalCounts ? totalCounts * 1 : 1;
            dom.jqPaginator({
                totalCounts,
                pageSize: pageSize * 1,
                visiblePages: 5,
                currentPage: currentPage * 1,
                activeClass: 'current-page',
                prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
                next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
                page: '<a href="javascript:void(0);" class="cb-operate">{{page}}<\/a>',
                onPageChange: function (n, type) {
                    if (type == 'init') return;
                    cb && cb(n)
                }
            });
        }
        function mypost (url, params) {
            return $q((resolve, reject) => {
                erp.postFun(url, JSON.stringify(params), function ({data}) {
                    erp.closeLoad();
                    const {result, statusCode, message} = data;
                    if (statusCode != 200) {
                        reject(data)
                        return myMsg(message)
                    }
                    resolve(result)
                }, errHandle)
            })
        }
        $scope.title = 'push详情'
        $scope.info = {
            title: '',//标题 必填项
            content: '',//内容 必填项
            push_type: '1',//推送类型  1=> 商品推送  暂时只有一种 为默认
            picurl: '',// img  选填
            customerGroup: 1,//必填  1 商品自动分配 2 定向分送
            categoryName: '',//必填  类目名称 逗号连接字符串
            driverWay: '1',//必填  1 手自一体 2 手动 3 自动
        }
        $scope.picInfo = {
            list: [],
            pageNum: '1',
            total: '1',
            pageSize: '20',
            navPage: ''
        };
        const driverWayDic = {
            '1': '手自一体',
            '2': '手动',
            '3': '自动'
        }
        const kindsList = ['计算机及办公', '包和鞋子', '珠宝和手表', '保健，美容，美发', '女士服装', '运动和户外' , '居家用品，家具', '家装', '汽车和摩托车', '玩具，儿童及婴儿用品', '男士服装', '消费电子', '手机及配件']
        // const id = 'e0c5afd97a694f0a9a198d1f7a692dd3';
        const {id}= $location.search();//获取url ? id
        if (id) {
            getInfo(id)
            getPicList()
        } else {
            myMsg('参数未传递 请返回上一页')
        }
        function getInfo (push_id)  {
            erp.load();
            const p = mypost('erp/appPush/getPushbyId', {push_id});
            p.then(function (result) {
                // console.log('getInfo--->', result)
                let {title, content, picurl, customerGroup, driverWay, categoryName} = result;
                driverWay = driverWayDic[driverWay];
                const categoryNameList = categoryName ? categoryName.split('__') : [];
                $scope.info = {title, content, picurl, customerGroup, driverWay}
                const customerList = kindsList.map(name => {
                    if (categoryNameList.includes(name)) {
                        return {name, checked: true}
                    }
                    return {name, checked: false}
                });
                initCheckbox (customerList)
            })
        }
        function initCheckbox (customerList) {
            $scope.mycheckbox = {//定向发送
                kindsList: customerList,
                text: '请选择类目',
                selectAreaShow: false,
                hoverIndex: -1,
                textblur: false,
                selectedArr: [],//选中的商品类目
                disabled: true,
            }
            $scope.showHandle = function (ev) {//显示商品类目选择列表
                ev && ev.stopPropagation()
                const bol = $scope.mycheckbox.textblur;
                $scope.mycheckbox.textblur = !bol;
                $scope.mycheckbox.selectAreaShow = !bol;
            }
            $scope.selectItem = function (i, ev) {//选择商品类目
                ev && ev.stopPropagation()
            }
            function calcuTxt () {//计算显示文字
                const len = $scope.mycheckbox.kindsList.filter(({checked}) => checked).length;
                const txt = `已选择 ${len} 个类目`;
                $scope.mycheckbox.text = $scope.mycheckbox.textblur || len > 0 ? txt : '商品类目' ;
            }
            calcuTxt()
            document.onclick = function () {//点击其他隐藏商品类目选择框
                $timeout(function () {
                    $scope.mycheckbox.selectAreaShow = false;
                    $scope.mycheckbox.textblur = false;
                    calcuTxt()
                }, 0)
            }
        }
        function getPicList (n) {
            erp.load();
            n && ($scope.picInfo.pageNum = n + '');
            const {pageNum, pageSize} = $scope.picInfo
            const p = mypost('erp/appPush/getproductList', {push_id: id, pageNum, pageSize});
            p.then((res) => {
                const {productManual, total} = res;
                $scope.picInfo.list = productManual;
                $scope.picInfo.total = total;
                // console.log('getPicList -- > ', res)
                const dom = $('.auto-push-page');
                renderPage(pageNum, pageSize, total, dom, pageChange)
            })
        }
        function pageChange (n) {
            getPicList(n)
        }
        $scope.pageTo = function () {//跳转页面
            const {navPage: n, total, pageSize, pageNum} = $scope.picInfo;
            if (n == pageNum) return
            if (n && n <=  Math.ceil(total/pageSize) && n > 0) {//异常页码处理
                getPicList(n)
            } else {
                myMsg('请输入正确的页码进行跳转');
            }
        }
        $scope.backHandle = function () {
            $location.path('/erpcustomer/pushtable');
        }
        
    }])
    // 失败回调
    function err(n) {
        // erp.closeLoad();
        layer.closeAll('loading');
        console.log(n);
    }

    // 处理列表数据
    function settleListData($scope, obj) {
        for (var i = 0; i < obj.list.length; i++) {
            if (!obj.list[i].email == "") {
                var email = obj.list[i].email;
                var email1 = email.split("@");
                var email2 = email1[0].substring(0, 2);
                obj.list[i].email = email2 + "..@" + email1[1];
            }
        }
    }

    // 获取客户列表
    function getList(erp, $scope) {
        erp.load();
        // erp.postFun("app/account_erp/pageQuery", {"data": "{'page': '" + $scope.pagenum + "','dayTime':'" + ($scope.dayTime||'') + "','limit':'" + $scope.pagesize + "','status':'" + $scope.status + "','sort':'" + $scope.sort + "','name':'" + $scope.searchinfo + "','onlineStatus':'"+($scope.onlineStatus || '')+"','salesmanSearch':'"+($scope.salesmanid || '')+"','startTime':'"+($scope.startTimez||'')+"','endTime':'"+($scope.endTime||'')+"'}"}, ccc, err);
        let rqData = {
          page: $scope.pagenum,
          dayTime: $scope.dayTime||'',
          limit: $scope.pagesize,
          sort: $scope.sort,
          name: $scope.searchinfo,
          onlineStatus: $scope.onlineStatus || '',
          salesmanSearch: $scope.salesmanid || '',
          startTime: $scope.startTimez||'',
          endTime: $scope.endTime||''
        };
        if($scope.codStatus != null && $scope.codStatus != undefined){
          rqData.codStatus = $scope.codStatus;
          rqData.accountType = 2; // 1:cj客户 2:cod用户
        }else{
          rqData.status = $scope.status;
        }
        erp.postFun("app/account_erp/pageQuery", JSON.stringify({data:JSON.stringify(rqData)}), ccc, err);

        function ccc(n) {
            erp.closeLoad();
            console.log(n)
            var obj = JSON.parse(n.data.result);
            $scope.totalNum = obj.total;
            if (obj.total == 0) {
                $scope.totalpage = 0;
                $scope.customerList = [];
                layer.msg(gjh27);
                return;
            }
            // settleListData ($scope,obj);
            $scope.customerList = obj;
            console.log($scope.customerList);
            $scope.totalpage = Math.ceil(($scope.customerList.total) / ($scope.pagesize));
            pageFun(erp, $scope);
        }
    }

    //分页
    function pageFun(erp, $scope) {
        console.log($scope.customerList.total, $scope.pagesize, $scope.pagenum);
        $(".pagegroup").jqPaginator({
            totalCounts: $scope.customerList.total,
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
                };
                erp.load();
                $scope.pagenum = n + '';
                // $("#pagination-demo-text").html("当前第" + n + "页");
                erp.postFun("app/account_erp/pageQuery", {"data": "{'page': '" + n + "','limit':'" + $scope.pagesize + "','status':'" + $scope.status + "','name':'" + $scope.searchinfo + "','sort':'" + $scope.sort + "','sortField':'" + $scope.sortField + "','onlineStatus':'"+($scope.onlineStatus || '')+"','salesmanSearch':'"+($scope.salesmanid || '')+"','startTime':'"+($scope.startTime||'')+"','endTime':'"+($scope.endTime || '')+"'}"}, function (n) {
                    erp.closeLoad();
                    var obj = JSON.parse(n.data.result);
                    // settleListData ($scope,obj);
                    $scope.customerList = obj;
                    console.log($scope.customerList);
                }, err)
            }
        });
    }
})();
