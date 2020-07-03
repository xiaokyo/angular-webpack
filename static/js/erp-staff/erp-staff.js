(function () {
    var app = angular.module('erp-staff', [])
    //临时工
    app.controller('linshigongCtrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('linshigong')
        var b = new Base64()
        var loginName = b.decode(localStorage.getItem('erploginName'));
        if(loginName=='admin'||loginName=='龙香昀'||loginName=='李金华'){
            $scope.adminFlag = true;
        }else{
            $scope.adminFlag = false;
        }
        console.log($scope.adminFlag)
        //客户页面
        $scope.pagesize = '50';
        $scope.pagenum = '1';
        $scope.totalNum = 0;
        $scope.fkfsType = '0';
        console.log(erp.isAdminLogin())
        $scope.isAdminFlag = erp.isAdminLogin()


        $scope.storageCallback = function({item, storageList, allIdString, setStorageId}){
            $scope.setStorageId = setStorageId
			$scope.store = item.dataId
        }

        function getList() {
            erp.load();
            var upData = {};
            upData.pageNum = $scope.pagenum;
            upData.pageSize = $scope.pagesize;
            upData.inputStr = $scope.searchDdh;
            erp.postFun('pojo/linShiGong/list', JSON.stringify(upData), con, err)

            function con(data) {
                console.log(data)
                erp.closeLoad();
                if (data.data.statusCode == 200) {
                    var result = JSON.parse(data.data.result);
                    console.log(result)
                    $scope.listArr = result.list;
                    console.log($scope.listArr)
                    $scope.totalNum = result.total || 0;
                    // if ($scope.totalNum == 0) {
                    //     $scope.totalpage = 0;
                    //     $scope.listArr = [];
                    // }
                    console.log($scope.listArr)
                    $scope.totalpage = function () {
                        return Math.ceil(data.data.totalNum / $scope.pagesize)
                    }
                    pageFun();
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
        $scope.showOrdFun = function (item) {
            $scope.ordFlag = true;
            console.log(item)
            console.log(item.remark1)
            $scope.ordList = item.remark1;
            console.log($scope.ordList)
        }
        $scope.lrlsgFun = function(){
            $scope.addLsgFlag = true;
        }
        $scope.sureAddFun = function(){
            // if(!$scope.lsgName){
            //     layer.msg('请输入名字')
            //     return
            // }
            if(!$scope.lsgBianHao){
                layer.msg('请输入编号')
                return
            }
            if(!$scope.gzVal){
                layer.msg('请输入工资')
                return
            }
            if(!$scope.zhVal){
                layer.msg('请输入账号')
                return
            }
            if($scope.fkfsType==2){
                if(!$scope.YhZhVal||!$scope.YhVal){
                    layer.msg('请输入银行以及支行名称')
                    return
                }
            }
            if(!$scope.store){
                layer.msg('请选择在哪个仓库')
                return
            }
            erp.load()
            erp.postFun('pojo/linShiGong/add',{
                'id':$scope.lsgBianHao,
                'zhangHu':$scope.zhVal,
                'jinE':$scope.gzVal,
                'name':$scope.lsgName,
                'beiZhu':$scope.bzVal,
                'leiXing':$scope.fkfsType,
                'yinHangMing':$scope.YhVal,
                'zhiHangMing':$scope.YhZhVal,
                'store': $scope.store
            },function(data){
                console.log(data)
                erp.closeLoad()
                layer.msg(data.data.message)
                if (data.data.statusCode==200) {
                    $scope.addLsgFlag = false;
                    $scope.lsgBianHao = '';
                    $scope.zhVal = '';
                    $scope.gzVal = '';
                    $scope.lsgName = '';
                    $scope.bzVal = '';
                    $scope.pagenum = '1';
                    getList();
                }
            },function(data){
                console.log(data)
                erp.closeLoad()
            })
        }
        $scope.delLsgFun = function(item){
            $scope.lsgId = item.id;
            $scope.isDelLsgFlag = true;
        }
        $scope.sureDelLsgFun = function(){
            erp.load()
            erp.postFun('pojo/linShiGong/shanChu',{
                'id':$scope.lsgId
            },function(data){
                console.log(data)
                erp.closeLoad()
                layer.msg(data.data.message)
                if(data.data.statusCode==200){
                    $scope.isDelLsgFlag = false;
                    $scope.pagenum = '1';
                    getList();
                }
            },function(data){
                console.log(data)
                erp.closeLoad()
            })
        }
        $scope.modefyLsgFun = function(item){
            $scope.modefyLsgFlag = true;
            $scope.lsgId = item.id;
            $scope.modLsgName = item.name;
            $scope.modGzVal = item.jinE;
            $scope.modFkfsType = item.leiXing+'';
            $scope.modZhVal = item.zhangHu;
            $scope.modYhVal = item.yinHangMing;
            $scope.modYhZhVal = item.zhiHangMing;
            //$scope.store = item.store;
            if(item.store){
                $scope.setStorageId(item.store);
            }
            if($scope.modFkfsType==2){
                $('#mod-lsg-tk').css('height','410px')
            }else{
                $('#mod-lsg-tk').css('height','340px')
            }
        }
        $scope.sureModefyFun = function(){
            if(!$scope.modGzVal){
                layer.msg('请输入工资')
                return
            }
            if(!$scope.modZhVal){
                layer.msg('请输入账号')
                return
            }

            if($scope.modFkfsType==2){
                if(!$scope.modYhVal||!$scope.modYhZhVal){
                    layer.msg('请输入银行以及支行名称')
                    return
                }
            }
            if(!$scope.store){
                layer.msg('请选择在哪个仓库')
                return
            }
            erp.load()
            erp.postFun('pojo/linShiGong/xiuGai',{
                'id':$scope.lsgId,
                'zhangHu':$scope.modZhVal,
                'jinE':$scope.modGzVal,
                'name':$scope.modLsgName,
                'beiZhu':$scope.modBzVal,
                'leiXing':$scope.modFkfsType,
                'yinHangMing':$scope.modYhVal,
                'zhiHangMing':$scope.modYhZhVal,
                'store': $scope.store
            },function(data){
                console.log(data)
                erp.closeLoad()
                layer.msg(data.data.message)
                if (data.data.statusCode==200) {
                    $scope.modefyLsgFlag = false;
                    $scope.lsgBianHao = '';
                    $scope.modZhVal = '';
                    $scope.modGzVal = '';
                    $scope.modLsgName = '';
                    $scope.modBzVal = '';
                    $scope.modYhVal = '';
                    $scope.modYhZhVal = '';
                    $scope.pagenum = '1';
                    getList();
                }
            },function(data){
                console.log(data)
                erp.closeLoad()
            })
        }
        $scope.selfkfsFun = function(){
            if($scope.fkfsType==2){
                $('#lr-lsg-tk').css('height','450px')
            }else{
                $('#lr-lsg-tk').css('height','370px')
            }
        }
        $scope.modefySelfkfsFun = function(){
            if($scope.modFkfsType==2){
                $('#mod-lsg-tk').css('height','410px')
            }else{
                $('#mod-lsg-tk').css('height','340px')
            }
        }
        function err() {
            layer.msg('系统异常')
        }
    }])
    //临时工 工资结算
    app.controller('linshigongGzCtrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('linshigong')
        var b = new Base64()
        var loginName = b.decode(localStorage.getItem('erploginName'));
        const adminArr = ['admin', '龙香昀', '李金华', '李规圣']
        $scope.adminFlag = adminArr.includes(loginName)
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
            if($("#left-time").val()){
                $('.time-span').removeClass('active-color');
                $scope.clickTime = undefined;
            }
            // if($("#right-time").val()){
            //     upData.endDate = $("#right-time").val()+' 23:59:59';
            // }
            // if($("#right-time").val()&&$("#left-time").val()){
            //     $('.time-span').removeClass('active-color');
            //     $scope.clickTime = undefined;
            // }
            upData.pageNum = $scope.pagenum;
            upData.pageSize = $scope.pagesize;
            upData.inputStr = $scope.searchDdh;
            upData.ri = $scope.clickTime;
            erp.postFun('pojo/linShiGong/linShiGongJiLuLieBiao', JSON.stringify(upData), con, err)

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
            $("#right-time").val('')
            $('.time-span').removeClass('active-color');
            $('.time-span').eq(index).addClass('active-color')
            $scope.pagenum = '1';
            getList();
        }
        $scope.timeSFun = function () {
            if(!$("#left-time").val()){
                layer.msg('请选择日期')
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
        //修改工资
        $scope.modefyGzFun = function(item){
            $scope.itemId = item.lingShiGongId;
            $scope.shangBan = item.shangBan;
            $scope.modefyGzFlag = true;
        }
        $scope.surexggzFun = function(){
            erp.load()
            var upJson = {};
            upJson.lsgId = $scope.itemId;
            upJson.beiZhu = $scope.gzBzVal;
            upJson.gongZi = $scope.gzXgVal||0;
            upJson.shangBan = $scope.shangBan;
            erp.postFun('pojo/linShiGong/gaiGongZi',JSON.stringify(upJson),function(data){
                console.log(data)
                erp.closeLoad()
                if (data.data.statusCode==200) {
                    $scope.gzBzVal = '';
                    $scope.gzXgVal = '';
                    $scope.modefyGzFlag = false;
                    getList();
                } else {
                    layer.msg(data.data.message)
                }
            },function(data){
                console.log(data)
                erp.closeLoad()
            })
        }
        $scope.showOrdFun = function (item) {
            $scope.ordFlag = true;
            console.log(item)
            console.log(item.remark1)
            $scope.ordList = item.remark1;
            console.log($scope.ordList)
        }
        $scope.lrlsgFun = function(){
            $scope.addLsgFlag = true;
        }
        $scope.sureAddFun = function(){
            // if(!$scope.lsgName){
            //     layer.msg('请输入名字')
            //     return
            // }
            if(!$scope.lsgBianHao){
                layer.msg('请输入编号')
                return
            }
            if(!$scope.gzVal){
                layer.msg('请输入工资')
                return
            }
            if(!$scope.zhVal){
                layer.msg('请输入账号')
                return
            }
            erp.load()
            erp.postFun('pojo/linShiGong/add',{
                'id':$scope.lsgBianHao,
                'zhangHu':$scope.zhVal,
                'jinE':$scope.gzVal,
                'name':$scope.lsgName,
                'leiXing':$scope.fkfsType
            },function(data){
                console.log(data)
                erp.closeLoad()
                layer.msg(data.data.message)
                if (data.data.statusCode==200) {
                    $scope.addLsgFlag = false;
                    $scope.lsgBianHao = '';
                    $scope.zhVal = '';
                    $scope.gzVal = '';
                    $scope.lsgName = '';
                    $scope.pagenum = '1';
                    getList();
                }
            },function(data){
                console.log(data)
                erp.closeLoad()
            })
        }
        function err() {
            layer.msg('系统异常')
        }
        //提交到财务
        // var checkedIds = '';
        // var shangban = '';
        var tjcwArr = [];
        $scope.tjdCwFun = function(){
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
        $scope.sureTjcwFun = function(){
            var upJson = {};
            upJson.lsgs = tjcwArr;
            console.log(JSON.stringify(upJson))
            // return
            erp.postFun('pojo/linShiGong/tiJiaoDaoCaiWu',JSON.stringify(upJson),function(data){
                console.log(data)
                if (data.data.statusCode==200) {
                    $scope.istjcwFlag = false;
                    getList();
                } else {
                    layer.msg(data.data.message)
                }
            },function(data){
                console.log(data)
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
    //绩效考核kpi
    app.controller('KPIAssessmentCtrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('KPIAssessmentCtrl')
        var data = [
            {
                name: '销售额',
                value: [45, 52, 54, 74, 90, 84, 45, 52, 54, 74, 90, 0],
                color: '#66C0FF'
            },
            {
                name: '毛利润',
                value: [60, 80, 105, 125, 108, 120, 45, 52, 54, 74, 90, 0],
                color: '#0ADACC'
            },
            {
                name: '利润率',
                value: [15, 20, 25, 30, 32, 120, 45, 52, 54, 74, 90, 0],
                color: '#75C212'
            }
        ];
        var data1 = data
        mycharts(data, data1)

        function mycharts(n, s) {

            data = n;
            data1 = s
            var chart = new iChart.ColumnMulti2D({
                render: 'canvasDiv',
                data: data,
                labels: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                title: '员工绩效考核KPI',
                subtitle: '（其中利润率为百分比%）',
                footnote: '数据来源：ERP',
                width: 1000,
                height: 600,
                background_color: '#ffffff',
                legend: {
                    enable: true,
                    background_color: null,
                    border: {
                        enable: false
                    }
                },
                coordinate: {
                    background_color: '#f1f1f1',
                    scale: [{
                        position: 'left',
                        start_scale: 0,
                        end_scale: 100,
                        scale_space: 100
                    }],
                    width: 1200,
                    height: 460
                }
            });
            //构造折线图
            var line = new iChart.LineBasic2D({
                z_index: 1000,
                data: data,
                label: {
                    color: '#4c4f48'
                },
                point_space: chart.get('column_width') + chart.get('column_space'),
                scaleAlign: 'right',
                sub_option: {
                    label: false,
                    point_size: 5
                },
                coordinate: chart.coo//共用坐标系
            });
            chart.plugin(line);
            chart.draw();

        };

        for (var i = 0; i < data.length; i++) {
            console.log(Math.max.apply(null, data[i].value))
        }
        erp.postFun('app/employee/setkpi', null, con, err)

        function con(n) {
            var obj = JSON.parse(n.data.result)
            console.log('con', obj.info)
            $scope.companyList = obj.info;
            $scope.company = $scope.companyList[0]
            $scope.departmentList = $scope.company.departments;
            $scope.department = $scope.departmentList[0]
            $scope.groupList = $scope.department.group
            $scope.goup = $scope.groupList[0]
            // console.log( 'group',$scope.groupList[0])
            $scope.goupstandardSalesAmount = $scope.goup.standardSalesAmount
            $scope.goupstandardSProfitRate = $scope.goup.standardSProfitRate
            $scope.goupstandardGrossProfit = $scope.goup.standardGrossProfit
        }

        function err(n) {
            console.log(n)
        }

        function ds(n) {
            var obj = JSON.parse(n.data.result)
            console.log('kpichart', obj.info)
            var arr = [];
            var arr2 = [
                {
                    name: '销售额',
                    value: [],
                    color: '#66C0FF'
                },
                {
                    name: '毛利润',
                    value: [],
                    color: '#0ADACC'
                },
                {
                    name: '利润率',
                    value: [],
                    color: '#75C212'
                }
            ];
            var arr3 = [
                {
                    name: '销售额',
                    value: [],
                    color: '#66C0FF'
                },
                {
                    name: '毛利润',
                    value: [],
                    color: '#0ADACC'
                },
                {
                    name: '利润率',
                    value: [],
                    color: '#75C212'
                }
            ];
            for (var i = 0; i < obj.info.length; i++) {
                arr.push(obj.info[i].salesAmount);
                arr.push(obj.info[i].standardSalesAmount);
            }
            $scope.max = Math.max.apply(null, arr);
            for (var i = 0; i < obj.info.length; i++) {
                arr2[0].value.push(obj.info[i].salesAmount);
                arr2[1].value.push(obj.info[i].grossProfit);
                arr2[2].value.push(obj.info[i].profitRate);
                arr3[0].value.push(obj.info[i].standardSalesAmount);
                arr3[1].value.push(obj.info[i].standardGrossProfit);
                arr3[2].value.push(obj.info[i].standardSProfitRate);
            }
            console.log(arr2, arr3)
            mycharts(arr2, arr3)
        }

        // 公司获取
        $scope.company = function (company) {
            console.log(company)
        }
        //获取部门
        $scope.departmentget = function () {
            console.log($scope.department)
            // $scope.groupList=$scope.department.departments
            // console.log( $scope.groupList)
            // erp.postFun('app/employee/getkpi',{"data":"{'department':'"+$scope.department.department+"','comgroup':'','empId':''}"}, ds, err)

        }
        //    获取小组
        $scope.groupget = function (group) {
            console.log(group)
            // $scope.stafflist= $scope.group.list
            // console.log( $scope.stafflist)
            // erp.postFun('app/employee/getkpi',{"data":"{'department':'"+$scope.department.department+"','comgroup':'"+$scope.group.comgroup+"','empId':'1'}"}, gs, err)
            // function gs(n) {
            //     var obj=JSON.parse(n.data.result)
            //     console.log('kpi',obj.info)
            // }
        }
        $scope.staffinfoget = function () {
            console.log($scope.staff);
            erp.postFun('app/employee/getkpi', {"data": "{'department':'" + $scope.department.department + "','comgroup':'" + $scope.group.comgroup + "','empId':'" + $scope.staff.id + "'}"}, ss, err)

            function ss(n) {
                var obj = JSON.parse(n.data.result)
                console.log('kpi', obj.info)
            }
        }
    }])
    //积分规则设置
    app.controller('IntegrationSettingCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        $scope.singleScore = '';
        //获取数据
        function getList() {
            /*验单*/
            $scope.YandanData1 = [];
            $scope.YandanData2 = [];
            $scope.YandanData3 = [];
            /*抓单*/
            $scope.zhuahuoData1 = [];
            $scope.zhuahuoData2 = [];
            $scope.zhuahuoData3 = [];
            //$scope.zhuahuoData4 = [];
            $scope.zhuahuoData5 = [];
            $scope.zhuahuoData6 = [];
            $scope.zhuahuoData7 = [];
            $scope.zhuahuoData8 = [];
            //$scope.zhuahuoData9 = [];
            $scope.zhuahuoData10 = [];
            /*入库*/
            $scope.rukuData1 = [];
            $scope.rukuData2 = [];
            //erp.load();
            var data = {};
            erp.postFun('erp/ObtainScore/getIntegralRules', data, function (n) {
                console.log(n.data.result)
                if (n.data.statusCode == 200) {
                    n.data.result.forEach(function(o,i){
                        switch(o.scoreType)
                        {
                                /*验单*/
                            case 'YANDAN_PRODUCT_NUM':
                                $scope.YandanData1.push(o);
                                break;
                            case 'YANDAN_PRODUCT_TYPE_NUM':
                                $scope.YandanData2.push(o);
                                break;
                            case 'YANDAN_ORDER_NUM':
                                $scope.YandanData3.push(o);
                                break;
                                /*抓货*/
                            case 'DANPIN_PRODUCT_NUM':
                                $scope.zhuahuoData1.push(o);
                                break;
                            case 'DANPIN_ORDER_MUN':
                                $scope.zhuahuoData2.push(o);
                                break;
                            case 'DANPIN_WEIZHI_NUM':
                                $scope.zhuahuoData3.push(o);
                                break;
                           /* case 'DANPIN_ZHAOHUO_SHIJIAN':
                                $scope.zhuahuoData4.push(o);
                                break;*/
                            case 'DANPIN_ZHAOHUO_JULI':
                                $scope.zhuahuoData5.push(o);
                                break;
                            case 'DUOPIN_PRODUCT_NUM':
                                $scope.zhuahuoData6.push(o);
                                break;
                            case 'DUOPIN_ORDER_NUM':
                                $scope.zhuahuoData7.push(o);
                                break;
                            case 'DUOPIN_WEIZHI_NUM':
                                $scope.zhuahuoData8.push(o);
                                break;
                           /* case 'DUOPIN_ZHAOHUO_SHIJIAN':
                                $scope.zhuahuoData9.push(o);
                                break;*/
                            case 'DUOPIN_ZHAOHUO_JULI':
                                $scope.zhuahuoData10.push(o);
                                break;
                                /*入库*/
                            case 'ZHAOHUO_JULI':
                                $scope.rukuData1.push(o);
                                break;
                            case 'RUKU_PRODUCT_NUM':
                                $scope.rukuData2.push(o);
                                break;
                            case 'YANDAN_ONE_ORDER':
                                $scope.singleScore = o.score;
                                break;
                            case 'YANDAN_ONE_PRODUCTTYPE':
                                $scope.singleScore3 = o.score;
                                break;
                            case 'YANDAN_ONE_PRODUCT':
                                $scope.singleScore2 = o.score;
                                break;
                            default:
                        }
                    })
                    $scope.YandanDatalist = n.data.result;
                }
            }, function (err) {

            })
        }
        getList();
        //单个订单设置积分
        $scope.SaveSingle = function (type) {
            let canSubmit = false
              , sendData = {
                dataType: 'YANDAN'
            }

            switch (type) {
                case 1:
                    sendData.scoreType = 'YANDAN_ONE_PRODUCT'
                    sendData.score = $scope.singleScore2
                    !$scope.singleScore2 ? layer.msg('验单单个商品数量') : canSubmit = true

                    break;
                case 2:
                    sendData.scoreType = 'YANDAN_ONE_PRODUCTTYPE'
                    sendData.score = $scope.singleScore3
                    !$scope.singleScore3 ? layer.msg('验单单个商品类别数量') : canSubmit = true

                    break;
                case 3:
                    sendData.scoreType = 'YANDAN_ONE_ORDER'
                    sendData.score = $scope.singleScore
                    !$scope.singleScore ? layer.msg('验单单个订单数量') : canSubmit = true

                    break;
                default:
            }
            if (canSubmit) {
                console.log(sendData);
                erp.postFun('erp/ObtainScore/updateObtainScoreByOneOrder',JSON.stringify(sendData),function(data) {
                    console.log(data.data);
                    if(data.data.statusCode == '200'){
                        layer.msg('操作成功');
                        getList();
                    }else{
                        layer.msg('操作失败');
                    }
                }, function () {}, {layer:true})
            }
        }
        //添加
        $scope.Add = function(type){
            switch(type)
            {
                    /*验单*/
                case '验单1':
                    $scope.YandanData1.push({'beginNumber':'','endNumber':'','score':'','isact1':false,'isact2':false,'isact3':false});
                    break;
                case '验单2':
                    $scope.YandanData2.push({'beginNumber':'','endNumber':'','score':'','isact1':false,'isact2':false,'isact3':false});
                    break;
                case '验单3':
                    $scope.YandanData3.push({'beginNumber':'','endNumber':'','score':'','isact1':false,'isact2':false,'isact3':false});
                    break;
                    /*抓货*/
                case '抓货1':
                    $scope.zhuahuoData1.push({'beginNumber':'','endNumber':'','score':'','isact1':false,'isact2':false,'isact3':false});
                    break;
                case '抓货2':
                    $scope.zhuahuoData2.push({'beginNumber':'','endNumber':'','score':'','isact1':false,'isact2':false,'isact3':false});
                    break;
                case '抓货3':
                    $scope.zhuahuoData3.push({'beginNumber':'','endNumber':'','score':'','isact1':false,'isact2':false,'isact3':false});
                    break;
             /*   case '抓货4':
                    $scope.zhuahuoData4.push({'beginNumber':'','endNumber':'','score':'','isact1':false,'isact2':false,'isact3':false});
                    break;*/
                case '抓货5':
                    $scope.zhuahuoData5.push({'beginNumber':'','endNumber':'','score':'','isact1':false,'isact2':false,'isact3':false});
                    break;
                case '抓货6':
                    $scope.zhuahuoData6.push({'beginNumber':'','endNumber':'','score':'','isact1':false,'isact2':false,'isact3':false});
                    break;
                case '抓货7':
                    $scope.zhuahuoData7.push({'beginNumber':'','endNumber':'','score':'','isact1':false,'isact2':false,'isact3':false});
                    break;
                case '抓货8':
                    $scope.zhuahuoData8.push({'beginNumber':'','endNumber':'','score':'','isact1':false,'isact2':false,'isact3':false});
                    break;
               /* case '抓货9':
                    $scope.zhuahuoData9.push({'beginNumber':'','endNumber':'','score':'','isact1':false,'isact2':false,'isact3':false});
                    break;*/
                case '抓货10':
                    $scope.zhuahuoData10.push({'beginNumber':'','endNumber':'','score':'','isact1':false,'isact2':false,'isact3':false});
                    break;
                    /*入库*/
                case '入库1':
                    $scope.rukuData1.push({'beginNumber':'','endNumber':'','score':'','isact1':false,'isact2':false,'isact3':false});
                    break;
                case '入库2':
                    $scope.rukuData2.push({'beginNumber':'','endNumber':'','score':'','isact1':false,'isact2':false,'isact3':false});
                    break;
                default:
            }
        }
        //保存
        $scope.Save = function(type){
            var arr = [];
            var Data = [];
            var scoreType;
            var dataType;
            switch(type)
            {
                    /*验单*/
                case '验单1':
                    Data = $scope.YandanData1;
                    scoreType = 'YANDAN_PRODUCT_NUM';
                    dataType = 'YANDAN';
                    break;
                case '验单2':
                    Data = $scope.YandanData2;
                    scoreType = 'YANDAN_PRODUCT_TYPE_NUM';
                    dataType = 'YANDAN';
                    break;
                case '验单3':
                    Data = $scope.YandanData3;
                    scoreType = 'YANDAN_ORDER_NUM';
                    dataType = 'YANDAN';
                    break;
                    /*抓货*/
                case '抓货1':
                    Data = $scope.zhuahuoData1;
                    scoreType = 'DANPIN_PRODUCT_NUM';
                    dataType = 'ZHUAHUO';
                    break;
                case '抓货2':
                    Data = $scope.zhuahuoData2;
                    scoreType = 'DANPIN_ORDER_MUN';
                    dataType = 'ZHUAHUO';
                    break;
                case '抓货3':
                    Data = $scope.zhuahuoData3;
                    scoreType = 'DANPIN_WEIZHI_NUM';
                    dataType = 'ZHUAHUO';
                    break;
           /*     case '抓货4':
                    Data = $scope.zhuahuoData4;
                    scoreType = 'DANPIN_ZHAOHUO_SHIJIAN';
                    dataType = 'ZHUAHUO';
                    break;*/
                case '抓货5':
                    Data = $scope.zhuahuoData5;
                    scoreType = 'DANPIN_ZHAOHUO_JULI';
                    dataType = 'ZHUAHUO';
                    break;
                case '抓货6':
                    Data = $scope.zhuahuoData6;
                    scoreType = 'DUOPIN_PRODUCT_NUM';
                    dataType = 'ZHUAHUO';
                    break;
                case '抓货7':
                    Data = $scope.zhuahuoData7;
                    scoreType = 'DUOPIN_ORDER_NUM';
                    dataType = 'ZHUAHUO';
                    break;
                case '抓货8':
                    Data = $scope.zhuahuoData8;
                    scoreType = 'DUOPIN_WEIZHI_NUM';
                    dataType = 'ZHUAHUO';
                    break;
             /*   case '抓货9':
                    Data = $scope.zhuahuoData9;
                    scoreType = 'DUOPIN_ZHAOHUO_SHIJIAN';
                    dataType = 'ZHUAHUO';
                    break;*/
                case '抓货10':
                    Data = $scope.zhuahuoData10;
                    scoreType = 'DUOPIN_ZHAOHUO_JULI';
                    dataType = 'ZHUAHUO';
                    break;
                    /*入库*/
                case '入库1':
                    Data = $scope.rukuData1;
                    scoreType = 'ZHAOHUO_JULI';
                    dataType = 'RUKU';
                    break;
                case '入库2':
                    Data = $scope.rukuData2;
                    scoreType = 'RUKU_PRODUCT_NUM';
                    dataType = 'RUKU';
                    break;
                default:
            }
            console.log(Data)
            Data.forEach(function (o,i) {
                if(!o.id){
                    arr.push({'beginNumber':o.beginNumber,'endNumber':o.endNumber,'score':o.score})
                }
            });
            for (var i=0;i<arr.length;i++){
                if(!arr[i].beginNumber || !arr[i].endNumber || !arr[i].score){
                    layer.msg('请填写完整！');
                    return;
                }
            }

            console.log(arr)
            if(arr.length == 0){
                layer.msg('请先添加！');
                return;
            }
            var data = {
                'scoreType':scoreType,
                'dataType':dataType,
                'list':arr
            };
            console.log(data)
            erp.postFun('erp/ObtainScore/createObtainScore', data, function (res) {
                if(res.data.statusCode == 200){
                    layer.msg('保存成功！');
                    getList();
                }else {
                    layer.msg('保存失败！');
                }
            }, function (err) {
                layer.msg('系统异常！');
            })
        }
        //编辑
        $scope.setFours = function(item,flag,type){
            if(flag == '1'){
                item.isact1 = true;
            }else if(flag == '2'){
                item.isact2 = true;
            }else if(flag == '3'){
                item.isact3 = true;
            }
        }
        $scope.setBlur = function(item,flag,type){
            console.log(item)
            console.log(flag)
            var data = {};
            if(flag == '1'){
                item.isact1 = false;
                data.beginNumber = item.beginNumber;
            }else if(flag == '2'){
                item.isact2 = false;
                data.endNumber = item.endNumber;
            }else if(flag == '3'){
                item.isact3 = false;
                data.score = item.score;
            }
            data.id = item.id;
            if(item.id){
                  erp.postFun('erp/ObtainScore/updateObtainScore', data, function (res) {
                      if(res.data.statusCode == 200){
                          layer.msg('修改成功！');
                      }else {
                          layer.msg('修改失败！');
                      }
                  }, function (err) {
                      layer.msg('系统异常！');
                  })
            }
        }
        //删除
        $scope.Remove = function (item,idx,type) {
            console.log(idx)
            var arr = [];
            switch(type)
            {
                    /*验单*/
                case '验单1':
                    arr = $scope.YandanData1;
                    break;
                case '验单2':
                    arr = $scope.YandanData2;
                    break;
                case '验单3':
                    arr = $scope.YandanData3;
                    break;
                    /*抓货*/
                case '抓货1':
                    arr = $scope.zhuahuoData1;
                    break;
                case '抓货2':
                    arr = $scope.zhuahuoData2;
                    break;
                case '抓货3':
                    arr = $scope.zhuahuoData3;
                    break;
               /* case '抓货4':
                    arr = $scope.zhuahuoData4;
                    break;*/
                case '抓货5':
                    arr = $scope.zhuahuoData5;
                    break;
                case '抓货6':
                    arr = $scope.zhuahuoData6;
                    break;
                case '抓货7':
                    arr = $scope.zhuahuoData7;
                    break;
                case '抓货8':
                    arr = $scope.zhuahuoData8;
                    break;
            /*    case '抓货9':
                    arr = $scope.zhuahuoData9;
                    break;*/
                case '抓货10':
                    arr = $scope.zhuahuoData10;
                    break;
                    /*入库*/
                case '入库1':
                    arr = $scope.rukuData1;
                    break;
                case '入库2':
                    arr = $scope.rukuData2;
                    break;
                default:
            }
            if(item.id){
                $scope.isDel = true;
            }else {
                arr.splice(idx,1)
            }
            $scope.RemoveYbtn = function () {
                var data = {
                    id:item.id,
                    status:'0'
                }
                erp.postFun('erp/ObtainScore/updateObtainScore', data, function (res) {
                    if(res.data.statusCode == 200){
                        $scope.isDel = false;
                        arr.splice(idx,1);
                        layer.msg('删除成功！');
                    }else {
                        layer.msg('删除失败！');
                    }
                }, function (err) {
                    layer.msg('系统异常！');
                })
            }
        }

    }])
    //抓货绩效统计
    app.controller('CatchingGoodsKPICtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        $scope.search = '';
        $scope.pageNum = '1';
        $scope.pageSize = '50';
        $scope.totalNum = 0;
        $scope.Datalist = [];
        $scope.itemOrMore = '';
        $scope.orderByParams = 'zongJiFen';
        $scope.all = true;
        $scope.AllCheck = false;
        $scope.thead = [
            //{name:'批次(单品)',flag:true,type:'batchNumber1'},
            {name:'订单数量',flag:false,type:'cjOrderNumberSum1'},
            {name:'商品数量',flag:false,type:'productNumberSum1'},
            {name:'位置个数',flag:false,type:'locationNumberSum1'},
            {name:'距离',flag:false,type:'zhaoHuoJuLi1'},
            {name:'积分',flag:false,type:'integral1'},
            //{name:'批次(多品)',flag:false,type:'batchNumber2'},
            {name:'订单数量',flag:false,type:'cjOrderNumberSum2'},
            {name:'商品数量',flag:false,type:'productNumberSum2'},
            {name:'位置个数',flag:false,type:'locationNumberSum2'},
            {name:'距离',flag:false,type:'zhaoHuoJuLi2'},
            {name:'积分',flag:false,type:'integral2'},
            //{name:'总积分',flag:false,type:'integral2'},
        ]
        $scope.timeFlag = 'today';
        $scope.sortData = [
            {name:'今日',isAct:true,timeFlag:'today'},
            {name:'本周',isAct:false,timeFlag:'weeks'},
            {name:'本月',isAct:false,timeFlag:'month'},
            {name:'三个月',isAct:false,timeFlag:'month_three'}
        ];
        $scope.allClick = function () {
            $scope.AllCheck = !$scope.AllCheck;
            $scope.Datalist.forEach(function (o,i) {
                if($scope.AllCheck){
                    o.check = true;
                }else {
                    o.check = false;
                }
            })
        }
        $scope.cldClick = function (item) {
            item.check = !item.check;
            $scope.Datalist.some(function (o,i) {
                if(!o.check){
                    $scope.AllCheck = false;
                    return true;
                }else {
                    $scope.AllCheck = true;
                }
            })
        }
        //删除
        $scope.remove = function () {
            var arr = [];
            $scope.Datalist.forEach(function (o,i) {
                if(o.check){
                    arr.push(o.lookingForPersonId)
                }
            });
            console.log(arr)
            if(arr.length>0){
                layer.msg('删除成功');
            }else {
                layer.msg('请选择');
            }
        }

        //刷新
        $scope.refreshFn = () => {
            erp.postFun('processOrder/employeeStatistics/shuaXinZhuaHuoJiLu', {}, res => {
                getList()
            }, error => {}, { layer: true })
        }

        //获取数据
        function getList() {
            erp.load();
            var data = {
                'pageNum':$scope.pageNum,
                'pageSize':$scope.pageSize,
                'orderByParams':$scope.orderByParams,
                'timeFlag':$scope.timeFlag,
                'beginTime':$('#StartDate').val(),
                'endTime':$('#EndDate').val(),
                //'lookingForPerson':$scope.lookingForPerson,
            };
            erp.postFun('processOrder/employeeStatistics/queryZhaoHuoTongJiPici', data, function (n) {
                erp.closeLoad();
                console.log(n.data.data.totalNum)
                if (n.data.code == 200) {
                    let resData = n.data.data;
                    $scope.Datalist = resData.records;
                    console.log($scope.Datalist)
                    $scope.totalNum = resData.total || 0;
                    if (resData.totalNum == 0) {
                        $scope.totalpage = 0;
                        $scope.Datalist = [];
                        layer.msg('暂无数据');
                    }
                    $scope.totalpage = function () {
                        return Math.ceil(resData.total / $scope.pageSize)
                    }
                    pageFun();
                }else if(n.data.code == 422){
                    layer.msg('没有该权限')
                }
            }, err)
        }
        getList();
        //
        $scope.sortClick = function(item){
            $scope.sortData.forEach(function (o,i) {
                o.isAct = false;
            })
            item.isAct = true;
            $('#StartDate').val('');
            $('#EndDate').val('');
            $scope.pageNum = '1';
            $scope.timeFlag = item.timeFlag;
            getList();
        }
        $scope.Datefocus = function(){
            $scope.sortData.forEach(function (o,i) {
                o.isAct = false;
            })
            $scope.timeFlag = '';
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
        //排序
        $scope.Sort = function(item){
            $scope.all = false;
            $scope.thead.forEach(function (o,i) {
                o.flag = false;
            })
            if(item == 'all' ){
                $scope.all = true;
                $scope.orderByParams = 'zongJiFen';
            }else {
                item.flag = true;
                console.log(item.name)
                $scope.orderByParams = item.type;
            }
            getList();
        }
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
            $scope.pageNum = 1;
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
    }])
    //验单绩效统计
    app.controller('InspectionFormKPICtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        $scope.search = '';
        $scope.pageNum = '1';
        $scope.pageSize = '50';
        $scope.totalNum = 0;
        $scope.Datalist = [];
        $scope.itemOrMore = '';
        $scope.shiJian = 'jinTian';
        $scope.orderByParams = 'cjOrderCount';
        $scope.timeFlag = 'today';
        $scope.thead = [
            {name:'面单数量',flag:true,type:'cjOrderCount'},
            {name:'单品面单数量',flag:false,type:'danPinCjOrderCount'},
            {name:'商品数量',flag:false,type:'productCount'},
            {name:'单品商品数量',flag:false,type:'danPinProductCount'},
            {name:'单品批次数量',flag:false,type:'piCiCount'},
            {name:'积分',flag:false,type:'integral'},
        ];
        $scope.sortData = [
            {name:'今日',isAct:true,timeFlag:'today'},
            {name:'本周',isAct:false,timeFlag:'weeks'},
            {name:'本月',isAct:false,timeFlag:'month'},
            {name:'三个月',isAct:false,timeFlag:'month_three'}
        ];
        $scope.AllCheck = false;
    /*    $scope.isTodayFun = function(ev){
            if($(ev.target).hasClass('top-funact-btn')){
                $(ev.target).removeClass('top-funact-btn')
                $scope.shiJian = 'jinTian';
            }else{
                $(ev.target).addClass('top-funact-btn')
                $scope.shiJian = '';
            }
            console.log($scope.shiJian)
            getList()
        }*/
        $scope.allClick = function () {
            $scope.AllCheck = !$scope.AllCheck;
            $scope.Datalist.forEach(function (o,i) {
                if($scope.AllCheck){
                    o.check = true;
                }else {
                    o.check = false;
                }
            })
        }
        $scope.cldClick = function (item) {
            item.check = !item.check;
            $scope.Datalist.some(function (o,i) {
                if(!o.check){
                    $scope.AllCheck = false;
                    return true;
                }else {
                    $scope.AllCheck = true;
                }
            })
        }
        //删除
        $scope.remove = function () {
            var arr = [];
            $scope.Datalist.forEach(function (o,i) {
                if(o.check){
                    arr.push(o.lookingForPersonId)
                }
            });
            if(arr.length>0){
                layer.msg('删除成功');
            }else {
                layer.msg('请选择');
            }
            console.log(arr)
        }
        //获取数据
        function getList() {
            erp.load();
            var data = {
                //'inspectionPeople':$scope.inspectionPeople,
                'pageNum':$scope.pageNum,
                'pageSize':$scope.pageSize
            };
            data.data = {};
            data.data.orderByParams = $scope.orderByParams;
            data.data.timeFlag = $scope.timeFlag;
            data.data.beginTime = $('#StartDate').val();
            data.data.endTime = $('#EndDate').val();
            erp.postFun('processOrder/employeeStatistics/selectYanDanTongJiList', data, function (n) {
                erp.closeLoad();
                console.log(n.data)
                if (n.data.code == 200) {
                    let resData = n.data.data;
                    resData.data.forEach(function (o,i) {
                        o.check = false;
                    })
                    $scope.Datalist = resData.data;
                    console.log($scope.Datalist)
                    $scope.totalNum = resData.total || 0;
                    if (resData.total == 0) {
                        $scope.totalpage = 0;
                        $scope.Datalist = [];
                        layer.msg('暂无数据');
                    }
                    $scope.totalpage = function () {
                        return Math.ceil(resData.total / $scope.pageSize)
                    }
                    pageFun();
                }else if(n.data.code == 422){
                    layer.msg('没有该权限')
                }
            }, err)
        }
        getList();
        //
        $scope.sortClick = function(item){
            $scope.sortData.forEach(function (o,i) {
                o.isAct = false;
            })
            item.isAct = true;
            $('#StartDate').val('');
            $('#EndDate').val('');
            $scope.pageNum = '1';
            $scope.timeFlag = item.timeFlag;
            getList();
        }
        $scope.Datefocus = function(){
            $scope.sortData.forEach(function (o,i) {
                o.isAct = false;
            })
            $scope.timeFlag = '';
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
        //排序
        $scope.Sort = function(item){
            $scope.thead.forEach(function (o,i) {
                o.flag = false;
            })
            item.flag = true;
            console.log(item.name)
            $scope.orderByParams = item.type;
            getList();
        }
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
        function err(n) {
            // erp.closeLoad();
            layer.closeAll('loading');
            console.log(n);
            $scope.Datalist = [];
        }
    }])
    //kpi考核标准
    app.controller('setkpiassessCtrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('setkpiassessCtrl')
        $scope.data = {
            one: '',
            two: '',
            three: ''
        }
        erp.postFun('app/employee/setkpi', null, con, err)

        function con(n) {
            var obj = JSON.parse(n.data.result)
            console.log('con', obj.info)
            $scope.companyList = obj.info;
            $scope.company = $scope.companyList[0]
            $scope.departmentList = $scope.company.departments;
            $scope.department = $scope.departmentList[0]
            $scope.groupList = $scope.department.group
            $scope.goup = $scope.groupList[0]
            // console.log( 'group',$scope.groupList[0])
            $scope.goupstandardSalesAmount = $scope.goup.standardSalesAmount
            $scope.goupstandardSProfitRate = $scope.goup.standardSProfitRate
            $scope.goupstandardGrossProfit = $scope.goup.standardGrossProfit

            $scope.stafflist = $scope.goup.emps;
            for (var i = 0; i < $scope.groupList.length; i++) {
                $scope.groupList[i].flag = false
                console.log('小组', $scope.groupList)
            }
            // console.log($scope.stafflist)
            // $scope.staffstandardSalesAmount=$scope.goup.standardSalesAmount
            // $scope.staffstandardSProfitRate=$scope.goup.standardSalesAmount
            // $scope.staffstandardGrossProfit=$scope.goup.standardSalesAmount
        }

        function err(n) {
            console.log(n)
        }

        $scope.groupshow = false;

        //获取公司
        $scope.companyget = function (company) {
            console.log(company)
            $scope.departmentList = company.departments;
            $scope.department = $scope.departmentList[0]
            $scope.stafflist = []
            // $scope.departmentList=$scope.company.departments
        }
        //获取部门
        $scope.departmentget = function (department) {
            console.log(department)
            // $scope.groupList=$scope.department.departments
            $scope.groupList = department.group
            $scope.goup = $scope.groupList[0];
            $scope.stafflist = []
        }
        //    获取小组
        $scope.groupget = function (item) {
            console.log(item)
            $scope.goup = item;
            for (var i = 0; i < $scope.goup.emps.length; i++) {
                $scope.goup.emps[i].flag = false

            }
            $scope.stafflist = item.emps
            // console.log( $scope.stafflist)
        }
        //修改
        $scope.modifygroup = function () {
            console.log($scope.goup)
            erp.postFun('app/employee/savekpi', {"data": "{'type':'1','id':'" + $scope.goup.id + "','standardSalesAmount':'" + $scope.goupstandardSalesAmount + "','standardSProfitRate':'" + $scope.goupstandardSProfitRate + "','standardGrossProfit':'" + $scope.goupstandardGrossProfit + "'}"}, gs, err)

            function gs(n) {
                console.log(n)
                $scope.goupshow = false;
                // erp.postFun('app/employee/setkpi',null, con, err)
            }

            $scope.groupshow = false;
            // erp.postFun('app/employee/setkpi',null, con, err)
        }
        //
        $scope.editstaff = function (index) {
            $scope.stafflist[index].flag = true;
            $scope.data.one = $scope.stafflist[index].standardSalesAmount
            $scope.data.two = $scope.stafflist[index].standardSProfitRate
            $scope.data.three = $scope.stafflist[index].standardGrossProfit
        }
        $scope.modifystaff = function (item, index) {
            console.log(item)
            console.log($scope.data.one)
            erp.postFun('app/employee/savekpi', {"data": "{'type':'0','id':'" + item.id + "','standardSalesAmount':'" + $scope.data.one + "','standardSProfitRate':'" + $scope.data.two + "','standardGrossProfit':'" + $scope.data.three + "'}"}, function (n) {
                console.log(11111)
                $scope.stafflist[index].flag = false;
                $scope.stafflist[index].standardSalesAmount = $scope.data.one
                $scope.stafflist[index].standardSProfitRate = $scope.data.two
                $scope.stafflist[index].standardGrossProfit = $scope.data.three
            }, err)
        }
    }])
    //员工档案
    app.controller('stafffilesCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        var base = new Base64();
        $scope.isoverTR = true;
        $scope.arr = ['', '在职', '离职'];
        $scope.pagesize = '20';
        $scope.pagenum = '1';
        $scope.pagenumarr = [10, 20, 30, 50];
        $scope.totalNum = 0;
        $scope.searchinfo = '';
		$scope.companynames = '';
        $scope.searchUserStatus = '1'
        $scope.strogeList = erp
            .getStorage()
            .map(_ => ({ id: _.dataId, storageName: _.dataName }));


		function getList () {
			const params = {
				data: JSON.stringify({
					companyname: $scope.companynames,
					name: $scope.searchinfo,
					pageNum: $scope.pagenum,
					pageSize: $scope.pagesize,
					userStatus: Number($scope.searchUserStatus)
				})
			}
			erp.postFun('app/employee/stafflist', params, ({data}) => {
				const { result } = data
				const obj = JSON.parse(result)
				$scope.totalNum = obj.count;
                console.log($scope.totalNum)
                console.log(obj)
                $scope.parentobj = obj
                $scope.stafflist2 = obj.info;
                pageFun()
			}, _ => layer.msg('网路错误'), { layer: true })
		}
		$scope.searchByStatus = () => {
			$scope.pagenum = '1';
			getList()
		}

        getList();
        $scope.serChange = function () {
            $scope.pagenum = '1';
            getList()
        }
        $('.top-search-inp').keypress(function(event) {
            if(event.keyCode=='13'){
                $scope.serChange()
            }
        });
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

        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            $scope.pagenum = 1;
            getList();
        }
        $scope.totalpage = function () {
            return Math.ceil($scope.parentobj.count / $scope.pagesize)
        }
        $scope.pagenumchange = function () {
            console.log($scope.pagenum % 1)
            if ($scope.pagenum < 1 || $scope.pagenum > $scope.totalpage()) {
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
        //分页
        //搜索员工
        $scope.searchstaff = function () {
            console.log($scope.searchinfo)
            $scope.pagenum = 1;
            getList();
        }
        $scope.staffdetail = function (item) {
            $location.path('/staff/stafffilesdetail')
            var str = base.encode(JSON.stringify(item))
            sessionStorage.setItem('staff', str)
        }
        $scope.windowquery = function (item) {
            $scope.newstaff = true;
            $scope.windowname = item.name;
            console.log(item)
            erp.postFun('app/employee/register', {"data": "{'headPortrait':'" + item.headPortrait + "','staffid':'" + item.id + "','name':'" + item.name + "','loginName':'" + item.name + "','email':'" + item.email + "','phone':'" + item.phone + "','nameEN':'" + item.nameen + "'}"}, win, err)

            function win(n) {
                console.log(n.data)
                layer.msg('新增成功')
                $scope.window = false;
            }

            function err() {
                layer.msg('新增失败')
            }
        }
        //弹窗
        $scope.newstaff = false;
        $scope.staffwindow = function () {
            $scope.newstaff = false;
            $location.path('/staff/stafftable')
        }
    }])
    //编辑新员工
    app.controller('stafffilesdetailCtrl', ['$scope', 'erp', '$location', '$http', '$timeout', function ($scope, erp, $location, $http, $timeout) {
        console.log('stafffilesdetailCtrl');
        var base64 = new Base64();
        $scope.job = base64.decode(localStorage.getItem('job') == undefined ? "" : localStorage.getItem('job'));
        $scope.subSate = false;
        //获得证件信息
        $scope.upLoadImg = function (files) {
            var data = new FormData();      //以下为像后台提交图片数据
            data.append('file', files[0]);
            data.append('index', '1');
            erp.upLoadImgPost('app/ajax/upload', data, con, err)

            function con(n) {
                console.log(
                        // if( $scope.imgarr=='undefined'){
                        //     $scope.imgarr=[];
                        // }
                        n.data.result)
                var obj = JSON.parse(n.data.result)
                $scope.imgarr.push('http://' + obj[0])
                console.log($scope.imgarr)
            }

            function err(n) {
                console.log(n)
            }
        }
        //头像
        $scope.upLoadImg2 = function (files) {
            var data = new FormData();      //以下为像后台提交图片数据
            data.append('file', files[0]);
            data.append('index', '1');
            erp.upLoadImgPost('app/ajax/upload', data, con, err)

            function con(n) {
                console.log(
                        n.data.result)
                var obj = JSON.parse(n.data.result)
                $scope.headimg = 'http://' + obj[0]
                console.log($scope.headimg)
                $('#document2').val('');
            }

            function err(n) {
                console.log(n)
            }
        }
        //简历
        $scope.resumearr = [];
        $scope.Upresume = function (files) {
            var obj1 = {}
            console.log(files[0].name)
            var data = new FormData();      //以下为像后台提交图片数据
            data.append('file', files[0]);
            data.append('index', '1');
            erp.upLoadImgPost('app/ajax/upload', data, con, err)

            function con(n) {
                if ($scope.resumearr == 'undefined') {
                    $scope.resumearr = [];
                }
                var obj = JSON.parse(n.data.result)
                $scope.resume = 'http://' + obj[0]
                console.log($scope.resume)
                obj1.url = $scope.resume;
                obj1.name = files[0].name;
                $scope.resumearr.push(obj1)
                console.log($scope.resumearr)
                $('#document3').val('');
            }

            function err(n) {
                console.log(n)
            }
        }
        //获得证件信息
        $scope.upLoadImg3 = function (files) {
            var data = new FormData();      //以下为像后台提交图片数据
            data.append('file', files[0]);
            data.append('index', '1');
            erp.upLoadImgPost('app/ajax/upload', data, con, err)

            function con(n) {
                console.log(
                        n.data.result)
                var obj = JSON.parse(n.data.result)
                $scope.imgarr.push('http://' + obj[0])
                console.log($scope.imgarr)
                $('#document1').val('');

            }

            function err(n) {
                console.log(n)
            }
        }
        /*       //头像
               $scope.upLoadImg4 = function (files) {
                   var data = new FormData();      //以下为像后台提交图片数据
                   data.append('file', files[0]);
                   data.append('index', '1');
                   erp.upLoadImgPost('app/ajax/upload', data, con, err)

                   function con (n) {
                       console.log(
                           n.data.result)
                       var obj = JSON.parse(n.data.result)
                       $scope.headimg = 'http://' + obj[0]
                       console.log($scope.headimg)
                   }

                   function err (n) {
                       console.log(n)
                   }
               }*/
        $scope.provinceList = [
            /*   {
        name: '请选择省份', cityList: [{name: '请选择城市', areaList: ['请选择区县']}]
      },*/
            {
                name: '北京', cityList: [
                    {
                        name: '市辖区',
                        areaList: ['东城区', '西城区', '崇文区', '宣武区', '朝阳区', '丰台区', '石景山区', '海淀区', '门头沟区', '房山区', '通州区', '顺义区', '昌平区', '大兴区', '怀柔区', '平谷区']
                    },
                    {name: '县', areaList: ['密云县', '延庆县']}
                ]
            },
            {
                name: '上海', cityList: [
                    {
                        name: '市辖区',
                        areaList: ['黄浦区', '卢湾区', '徐汇区', '长宁区', '静安区', '普陀区', '闸北区', '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区', '浦东新区', '金山区', '松江区', '青浦区', '南汇区', '奉贤区']
                    },
                    {name: '县', areaList: ['崇明县']}
                ]
            },
            {
                name: '天津', cityList: [
                    {
                        name: '市辖区',
                        areaList: ['和平区', '河东区', '河西区', '南开区', '河北区', '红桥区', '塘沽区', '汉沽区', '大港区', '东丽区', '西青区', '津南区', '北辰区', '武清区', '宝坻区']
                    },
                    {name: '县', areaList: ['宁河县', '静海县', '蓟　县']}
                ]
            },
            {
                name: '重庆', cityList: [
                    {
                        name: '市辖区',
                        areaList: ['万州区', '涪陵区', '渝中区', '大渡口区', '江北区', '沙坪坝区', '九龙坡区', '南岸区', '北碚区', '万盛区', '双桥区', '渝北区', '巴南区', '黔江区', '长寿区']
                    },
                    {
                        name: '县',
                        areaList: ['綦江县', '潼南县', '铜梁县', '大足县', '荣昌县', '璧山县', '梁平县', '城口县', '丰都县', '垫江县', '武隆县', '忠　县', '开　县', '云阳县', '奉节县', '巫山县', '巫溪县', '石柱土家族自治县', '秀山土家族苗族自治县', '酉阳土家族苗族自治县', '彭水苗族土家族自治县']
                    },
                    {name: '市', areaList: ['江津市', '合川市', '永川市', '南川市']}
                ]
            },
            {
                name: '四川', cityList: [
                    {
                        name: '成都市',
                        areaList: ['市辖区', '锦江区', '青羊区', '金牛区', '武侯区', '成华区', '龙泉驿区', '青白江区', '新都区', '温江县', '金堂县', '双流县', '郫　县', '大邑县', '蒲江县', '新津县', '都江堰市', '彭州市', '邛崃市', '崇州市']
                    },
                    {name: '自贡市', areaList: ['市辖区', '自流井区', '贡井区', '大安区', '沿滩区', '荣　县', '富顺县']},
                    {name: '攀枝花市', areaList: ['市辖区', '东　区', '西　区', '仁和区', '米易县', '盐边县']},
                    {name: '泸州市', areaList: ['市辖区', '江阳区', '纳溪区', '龙马潭区', '泸　县', '合江县', '叙永县', '古蔺县']},
                    {name: '德阳市', areaList: ['市辖区', '旌阳区', '中江县', '罗江县', '广汉市', '什邡市', '绵竹市']},
                    {name: '绵阳市', areaList: ['市辖区', '涪城区', '游仙区', '三台县', '盐亭县', '安　县', '梓潼县', '北川羌族自治县', '平武县', '江油市']},
                    {name: '广元市', areaList: ['市辖区', '市中区', '元坝区', '朝天区', '旺苍县', '青川县', '剑阁县', '苍溪县']},
                    {name: '遂宁市', areaList: ['市辖区', '船山区', '安居区', '蓬溪县', '射洪县', '大英县']},
                    {name: '内江市', areaList: ['市辖区', '市中区', '东兴区', '威远县', '资中县', '隆昌县']},
                    {
                        name: '乐山市',
                        areaList: ['市辖区', '市中区', '沙湾区', '五通桥区', '金口河区', '犍为县', '井研县', '夹江县', '沐川县', '峨边彝族自治县', '马边彝族自治县', '峨眉山市']
                    },
                    {name: '南充市', areaList: ['市辖区', '顺庆区', '高坪区', '嘉陵区', '南部县', '营山县', '蓬安县', '仪陇县', '西充县', '阆中市']},
                    {name: '眉山市', areaList: ['市辖区', '东坡区', '仁寿县', '彭山县', '洪雅县', '丹棱县', '青神县']},
                    {
                        name: '宜宾市',
                        areaList: ['市辖区', '翠屏区', '宜宾县', '南溪县', '江安县', '长宁县', '高　县', '珙　县', '筠连县', '兴文县', '屏山县']
                    },
                    {name: '广安市', areaList: ['市辖区', '广安区', '岳池县', '武胜县', '邻水县', '华莹市']},
                    {name: '达州市', areaList: ['市辖区', '通川区', '达　县', '宣汉县', '开江县', '大竹县', '渠　县', '万源市']},
                    {name: '雅安市', areaList: ['市辖区', '雨城区', '名山县', '荥经县', '汉源县', '石棉县', '天全县', '芦山县', '宝兴县']},
                    {name: '巴中市', areaList: ['市辖区', '巴州区', '通江县', '南江县', '平昌县']},
                    {name: '资阳市', areaList: ['市辖区', '雁江区', '安岳县', '乐至县', '简阳市']},
                    {
                        name: '阿坝藏族羌族自治州',
                        areaList: ['汶川县', '理　县', '茂　县', '松潘县', '九寨沟县', '金川县', '小金县', '黑水县', '马尔康县', '壤塘县', '阿坝县', '若尔盖县', '红原县']
                    },
                    {
                        name: '甘孜藏族自治州',
                        areaList: ['康定县', '泸定县', '丹巴县', '九龙县', '雅江县', '道孚县', '炉霍县', '甘孜县', '新龙县', '德格县', '白玉县', '石渠县', '色达县', '理塘县', '巴塘县', '乡城县', '稻城县', '得荣县']
                    },
                    {
                        name: '凉山彝族自治州',
                        areaList: ['西昌市', '木里藏族自治县', '盐源县', '德昌县', '会理县', '会东县', '宁南县', '普格县', '布拖县', '金阳县', '昭觉县', '喜德县', '冕宁县', '越西县', '甘洛县', '美姑县', '雷波县']
                    }
                ]
            },
            {
                name: '贵州', cityList: [
                    {
                        name: '贵阳市',
                        areaList: ['市辖区', '南明区', '云岩区', '花溪区', '乌当区', '白云区', '小河区', '开阳县', '息烽县', '修文县', '清镇市']
                    },
                    {name: '六盘水市', areaList: ['钟山区', '六枝特区', '水城县', '盘　县']},
                    {
                        name: '遵义市',
                        areaList: ['市辖区', '红花岗区', '汇川区', '遵义县', '桐梓县', '绥阳县', '正安县', '道真仡佬族苗族自治县', '务川仡佬族苗族自治县', '凤冈县', '湄潭县', '余庆县', '习水县', '赤水市', '仁怀市']
                    },
                    {name: '安顺市', areaList: ['市辖区', '西秀区', '平坝县', '普定县', '镇宁布依族苗族自治县', '关岭布依族苗族自治县', '紫云苗族布依族自治县']},
                    {
                        name: '铜仁地区',
                        areaList: ['铜仁市', '江口县', '玉屏侗族自治县', '石阡县', '思南县', '印江土家族苗族自治县', '德江县', '沿河土家族自治县', '松桃苗族自治县', '万山特区']
                    },
                    {name: '黔西南布依族苗族自治州', areaList: ['兴义市', '兴仁县', '普安县', '晴隆县', '贞丰县', '望谟县', '册亨县', '安龙县']},
                    {name: '毕节地区', areaList: ['毕节市', '大方县', '黔西县', '金沙县', '织金县', '纳雍县', '威宁彝族回族苗族自治县', '赫章县']},
                    {
                        name: '黔东南苗族侗族自治州',
                        areaList: ['凯里市', '黄平县', '施秉县', '三穗县', '镇远县', '岑巩县', '天柱县', '锦屏县', '剑河县', '台江县', '黎平县', '榕江县', '从江县', '雷山县', '麻江县', '丹寨县']
                    },
                    {
                        name: '黔南布依族苗族自治州',
                        areaList: ['都匀市', '福泉市', '荔波县', '贵定县', '瓮安县', '独山县', '平塘县', '罗甸县', '长顺县', '龙里县', '惠水县', '三都水族自治县']
                    }
                ]
            },
            {
                name: '云南', cityList: [
                    {
                        name: '昆明市',
                        areaList: ['市辖区', '五华区', '盘龙区', '官渡区', '西山区', '东川区', '呈贡县', '晋宁县', '富民县', '宜良县', '石林彝族自治县', '嵩明县', '禄劝彝族苗族自治县', '寻甸回族彝族自治县', '安宁市']
                    },
                    {name: '曲靖市', areaList: ['市辖区', '麒麟区', '马龙县', '陆良县', '师宗县', '罗平县', '富源县', '会泽县', '沾益县', '宣威市']},
                    {
                        name: '玉溪市',
                        areaList: ['市辖区', '红塔区', '江川县', '澄江县', '通海县', '华宁县', '易门县', '峨山彝族自治县', '新平彝族傣族自治县', '元江哈尼族彝族傣族自治县']
                    },
                    {name: '保山市', areaList: ['市辖区', '隆阳区', '施甸县', '腾冲县', '龙陵县', '昌宁县']},
                    {
                        name: '昭通市',
                        areaList: ['市辖区', '昭阳区', '鲁甸县', '巧家县', '盐津县', '大关县', '永善县', '绥江县', '镇雄县', '彝良县', '威信县', '水富县']
                    },
                    {name: '丽江市', areaList: ['市辖区', '古城区', '玉龙纳西族自治县', '永胜县', '华坪县', '宁蒗彝族自治县']},
                    {
                        name: '思茅市',
                        areaList: ['市辖区', '翠云区', '普洱哈尼族彝族自治县', '墨江哈尼族自治县', '景东彝族自治县', '景谷傣族彝族自治县', '镇沅彝族哈尼族拉祜族自治县', '江城哈尼族彝族自治县', '孟连傣族拉祜族佤族自治县', '澜沧拉祜族自治县', '西盟佤族自治县']
                    },
                    {
                        name: '临沧市',
                        areaList: ['市辖区', '临翔区', '凤庆县', '云　县', '永德县', '镇康县', '双江拉祜族佤族布朗族傣族自治县', '耿马傣族佤族自治县', '沧源佤族自治县']
                    },
                    {name: '楚雄彝族自治州', areaList: ['楚雄市', '双柏县', '牟定县', '南华县', '姚安县', '大姚县', '永仁县', '元谋县', '武定县', '禄丰县']},
                    {
                        name: '红河哈尼族彝族自治州',
                        areaList: ['个旧市', '开远市', '蒙自县', '屏边苗族自治县', '建水县', '石屏县', '弥勒县', '泸西县', '元阳县', '红河县', '金平苗族瑶族傣族自治县', '绿春县', '河口瑶族自治县']
                    },
                    {name: '文山壮族苗族自治州', areaList: ['文山县', '砚山县', '西畴县', '麻栗坡县', '马关县', '丘北县', '广南县', '富宁县']},
                    {name: '西双版纳傣族自治州', areaList: ['景洪市', '勐海县', '勐腊县']},
                    {
                        name: '大理白族自治州',
                        areaList: ['大理市', '漾濞彝族自治县', '祥云县', '宾川县', '弥渡县', '南涧彝族自治县', '巍山彝族回族自治县', '永平县', '云龙县', '洱源县', '剑川县', '鹤庆县']
                    },
                    {name: '德宏傣族景颇族自治州', areaList: ['瑞丽市', '潞西市', '梁河县', '盈江县', '陇川县']},
                    {name: '怒江傈僳族自治州', areaList: ['泸水县', '福贡县', '贡山独龙族怒族自治县', '兰坪白族普米族自治县']},
                    {name: '迪庆藏族自治州', areaList: ['香格里拉县', '德钦县', '维西傈僳族自治县']}
                ]
            },
            {
                name: '西藏', cityList: [
                    {name: '拉萨市', areaList: ['市辖区', '城关区', '林周县', '当雄县', '尼木县', '曲水县', '堆龙德庆县', '达孜县', '墨竹工卡县']},
                    {
                        name: '昌都地区',
                        areaList: ['昌都县', '江达县', '贡觉县', '类乌齐县', '丁青县', '察雅县', '八宿县', '左贡县', '芒康县', '洛隆县', '边坝县']
                    },
                    {
                        name: '山南地区',
                        areaList: ['乃东县', '扎囊县', '贡嘎县', '桑日县', '琼结县', '曲松县', '措美县', '洛扎县', '加查县', '隆子县', '错那县', '浪卡子县']
                    },
                    {
                        name: '日喀则地区',
                        areaList: ['日喀则市', '南木林县', '江孜县', '定日县', '萨迦县', '拉孜县', '昂仁县', '谢通门县', '白朗县', '仁布县', '康马县', '定结县', '仲巴县', '亚东县', '吉隆县', '聂拉木县', '萨嘎县', '岗巴县']
                    },
                    {name: '那曲地区', areaList: ['那曲县', '嘉黎县', '比如县', '聂荣县', '安多县', '申扎县', '索　县', '班戈县', '巴青县', '尼玛县']},
                    {name: '阿里地区', areaList: ['普兰县', '札达县', '噶尔县', '日土县', '革吉县', '改则县', '措勤县']},
                    {name: '林芝地区', areaList: ['林芝县', '工布江达县', '米林县', '墨脱县', '波密县', '察隅县', '朗　县']}
                ]
            },
            {
                name: '河南', cityList: [
                    {
                        name: '郑州市',
                        areaList: ['市辖区', '中原区', '二七区', '管城回族区', '金水区', '上街区', '邙山区', '中牟县', '巩义市', '荥阳市', '新密市', '新郑市', '登封市']
                    },
                    {
                        name: '开封市',
                        areaList: ['市辖区', '龙亭区', '顺河回族区', '鼓楼区', '南关区', '郊　区', '杞　县', '通许县', '尉氏县', '开封县', '兰考县']
                    },
                    {
                        name: '洛阳市',
                        areaList: ['市辖区', '老城区', '西工区', '廛河回族区', '涧西区', '吉利区', '洛龙区', '孟津县', '新安县', '栾川县', '嵩　县', '汝阳县', '宜阳县', '洛宁县', '伊川县', '偃师市']
                    },
                    {
                        name: '平顶山市',
                        areaList: ['市辖区', '新华区', '卫东区', '石龙区', '湛河区', '宝丰县', '叶　县', '鲁山县', '郏　县', '舞钢市', '汝州市']
                    },
                    {name: '安阳市', areaList: ['市辖区', '文峰区', '北关区', '殷都区', '龙安区', '安阳县', '汤阴县', '滑　县', '内黄县', '林州市']},
                    {name: '鹤壁市', areaList: ['市辖区', '鹤山区', '山城区', '淇滨区', '浚　县', '淇　县']},
                    {
                        name: '新乡市',
                        areaList: ['市辖区', '红旗区', '卫滨区', '凤泉区', '牧野区', '新乡县', '获嘉县', '原阳县', '延津县', '封丘县', '长垣县', '卫辉市', '辉县市']
                    },
                    {
                        name: '焦作市',
                        areaList: ['市辖区', '解放区', '中站区', '马村区', '山阳区', '修武县', '博爱县', '武陟县', '温　县', '济源市', '沁阳市', '孟州市']
                    },
                    {name: '濮阳市', areaList: ['市辖区', '华龙区', '清丰县', '南乐县', '范　县', '台前县', '濮阳县']},
                    {name: '许昌市', areaList: ['市辖区', '魏都区', '许昌县', '鄢陵县', '襄城县', '禹州市', '长葛市']},
                    {name: '漯河市', areaList: ['市辖区', '源汇区', '郾城区', '召陵区', '舞阳县', '临颍县']},
                    {name: '三门峡市', areaList: ['市辖区', '湖滨区', '渑池县', '陕　县', '卢氏县', '义马市', '灵宝市']},
                    {
                        name: '南阳市',
                        areaList: ['市辖区', '宛城区', '卧龙区', '南召县', '方城县', '西峡县', '镇平县', '内乡县', '淅川县', '社旗县', '唐河县', '新野县', '桐柏县', '邓州市']
                    },
                    {name: '商丘市', areaList: ['市辖区', '梁园区', '睢阳区', '民权县', '睢　县', '宁陵县', '柘城县', '虞城县', '夏邑县', '永城市']},
                    {
                        name: '信阳市',
                        areaList: ['市辖区', '师河区', '平桥区', '罗山县', '光山县', '新　县', '商城县', '固始县', '潢川县', '淮滨县', '息　县']
                    },
                    {
                        name: '周口市',
                        areaList: ['市辖区', '川汇区', '扶沟县', '西华县', '商水县', '沈丘县', '郸城县', '淮阳县', '太康县', '鹿邑县', '项城市']
                    },
                    {
                        name: '驻马店市',
                        areaList: ['市辖区', '驿城区', '西平县', '上蔡县', '平舆县', '正阳县', '确山县', '泌阳县', '汝南县', '遂平县', '新蔡县']
                    }
                ]
            },
            {
                name: '湖北', cityList: [
                    {
                        name: '武汉市',
                        areaList: ['市辖区', '江岸区', '江汉区', '乔口区', '汉阳区', '武昌区', '青山区', '洪山区', '东西湖区', '汉南区', '蔡甸区', '江夏区', '黄陂区', '新洲区']
                    },
                    {name: '黄石市', areaList: ['市辖区', '黄石港区', '西塞山区', '下陆区', '铁山区', '阳新县', '大冶市']},
                    {name: '十堰市', areaList: ['市辖区', '茅箭区', '张湾区', '郧　县', '郧西县', '竹山县', '竹溪县', '房　县', '丹江口市']},
                    {
                        name: '宜昌市',
                        areaList: ['市辖区', '西陵区', '伍家岗区', '点军区', '猇亭区', '夷陵区', '远安县', '兴山县', '秭归县', '长阳土家族自治县', '五峰土家族自治县', '宜都市', '当阳市', '枝江市']
                    },
                    {name: '襄樊市', areaList: ['市辖区', '襄城区', '樊城区', '襄阳区', '南漳县', '谷城县', '保康县', '老河口市', '枣阳市', '宜城市']},
                    {name: '鄂州市', areaList: ['市辖区', '梁子湖区', '华容区', '鄂城区']},
                    {name: '荆门市', areaList: ['市辖区', '东宝区', '掇刀区', '京山县', '沙洋县', '钟祥市']},
                    {name: '孝感市', areaList: ['市辖区', '孝南区', '孝昌县', '大悟县', '云梦县', '应城市', '安陆市', '汉川市']},
                    {name: '荆州市', areaList: ['市辖区', '沙市区', '荆州区', '公安县', '监利县', '江陵县', '石首市', '洪湖市', '松滋市']},
                    {
                        name: '黄冈市',
                        areaList: ['市辖区', '黄州区', '团风县', '红安县', '罗田县', '英山县', '浠水县', '蕲春县', '黄梅县', '麻城市', '武穴市']
                    },
                    {name: '咸宁市', areaList: ['市辖区', '咸安区', '嘉鱼县', '通城县', '崇阳县', '通山县', '赤壁市']},
                    {name: '随州市', areaList: ['市辖区', '曾都区', '广水市']},
                    {name: '恩施土家族苗族自治州', areaList: ['恩施市', '利川市', '建始县', '巴东县', '宣恩县', '咸丰县', '来凤县', '鹤峰县']},
                    {name: '省直辖行政单位', areaList: ['仙桃市', '潜江市', '天门市', '神农架林区']}
                ]
            },
            {
                name: '湖南', cityList: [
                    {name: '长沙市', areaList: ['市辖区', '芙蓉区', '天心区', '岳麓区', '开福区', '雨花区', '长沙县', '望城县', '宁乡县', '浏阳市']},
                    {name: '株洲市', areaList: ['市辖区', '荷塘区', '芦淞区', '石峰区', '天元区', '株洲县', '攸　县', '茶陵县', '炎陵县', '醴陵市']},
                    {name: '湘潭市', areaList: ['市辖区', '雨湖区', '岳塘区', '湘潭县', '湘乡市', '韶山市']},
                    {
                        name: '衡阳市',
                        areaList: ['市辖区', '珠晖区', '雁峰区', '石鼓区', '蒸湘区', '南岳区', '衡阳县', '衡南县', '衡山县', '衡东县', '祁东县', '耒阳市', '常宁市']
                    },
                    {
                        name: '邵阳市',
                        areaList: ['市辖区', '双清区', '大祥区', '北塔区', '邵东县', '新邵县', '邵阳县', '隆回县', '洞口县', '绥宁县', '新宁县', '城步苗族自治县', '武冈市']
                    },
                    {name: '岳阳市', areaList: ['市辖区', '岳阳楼区', '云溪区', '君山区', '岳阳县', '华容县', '湘阴县', '平江县', '汨罗市', '临湘市']},
                    {name: '常德市', areaList: ['市辖区', '武陵区', '鼎城区', '安乡县', '汉寿县', '澧　县', '临澧县', '桃源县', '石门县', '津市市']},
                    {name: '张家界市', areaList: ['市辖区', '永定区', '武陵源区', '慈利县', '桑植县']},
                    {name: '益阳市', areaList: ['市辖区', '资阳区', '赫山区', '南　县', '桃江县', '安化县', '沅江市']},
                    {
                        name: '郴州市',
                        areaList: ['市辖区', '北湖区', '苏仙区', '桂阳县', '宜章县', '永兴县', '嘉禾县', '临武县', '汝城县', '桂东县', '安仁县', '资兴市']
                    },
                    {
                        name: '永州市',
                        areaList: ['市辖区', '芝山区', '冷水滩区', '祁阳县', '东安县', '双牌县', '道　县', '江永县', '宁远县', '蓝山县', '新田县', '江华瑶族自治县']
                    },
                    {
                        name: '怀化市',
                        areaList: ['市辖区', '鹤城区', '中方县', '沅陵县', '辰溪县', '溆浦县', '会同县', '麻阳苗族自治县', '新晃侗族自治县', '芷江侗族自治县', '靖州苗族侗族自治县', '通道侗族自治县', '洪江市']
                    },
                    {name: '娄底市', areaList: ['市辖区', '娄星区', '双峰县', '新化县', '冷水江市', '涟源市']},
                    {name: '湘西土家族苗族自治州', areaList: ['吉首市', '泸溪县', '凤凰县', '花垣县', '保靖县', '古丈县', '永顺县', '龙山县']}
                ]
            },
            {
                name: '广东', cityList: [
                    {
                        name: '广州市',
                        areaList: ['市辖区', '东山区', '荔湾区', '越秀区', '海珠区', '天河区', '芳村区', '白云区', '黄埔区', '番禺区', '花都区', '增城市', '从化市']
                    },
                    {
                        name: '韶关市',
                        areaList: ['市辖区', '武江区', '浈江区', '曲江区', '始兴县', '仁化县', '翁源县', '乳源瑶族自治县', '新丰县', '乐昌市', '南雄市']
                    },
                    {name: '深圳市', areaList: ['市辖区', '罗湖区', '福田区', '南山区', '宝安区', '龙岗区', '盐田区']},
                    {name: '珠海市', areaList: ['市辖区', '香洲区', '斗门区', '金湾区']},
                    {name: '汕头市', areaList: ['市辖区', '龙湖区', '金平区', '濠江区', '潮阳区', '潮南区', '澄海区', '南澳县']},
                    {name: '佛山市', areaList: ['市辖区', '禅城区', '南海区', '顺德区', '三水区', '高明区']},
                    {name: '江门市', areaList: ['市辖区', '蓬江区', '江海区', '新会区', '台山市', '开平市', '鹤山市', '恩平市']},
                    {name: '湛江市', areaList: ['市辖区', '赤坎区', '霞山区', '坡头区', '麻章区', '遂溪县', '徐闻县', '廉江市', '雷州市', '吴川市']},
                    {name: '茂名市', areaList: ['市辖区', '茂南区', '茂港区', '电白县', '高州市', '化州市', '信宜市']},
                    {name: '肇庆市', areaList: ['市辖区', '端州区', '鼎湖区', '广宁县', '怀集县', '封开县', '德庆县', '高要市', '四会市']},
                    {name: '惠州市', areaList: ['市辖区', '惠城区', '惠阳区', '博罗县', '惠东县', '龙门县']},
                    {name: '梅州市', areaList: ['市辖区', '梅江区', '梅　县', '大埔县', '丰顺县', '五华县', '平远县', '蕉岭县', '兴宁市']},
                    {name: '汕尾市', areaList: ['市辖区', '城　区', '海丰县', '陆河县', '陆丰市']},
                    {name: '河源市', areaList: ['市辖区', '源城区', '紫金县', '龙川县', '连平县', '和平县', '东源县']},
                    {name: '阳江市', areaList: ['市辖区', '江城区', '阳西县', '阳东县', '阳春市']},
                    {name: '清远市', areaList: ['市辖区', '清城区', '佛冈县', '阳山县', '连山壮族瑶族自治县', '连南瑶族自治县', '清新县', '英德市', '连州市']},
                    {name: '东莞市', areaList: ['东莞市']},
                    {name: '中山市', areaList: ['中山市']},
                    {name: '潮州市', areaList: ['市辖区', '湘桥区', '潮安县', '饶平县']},
                    {name: '揭阳市', areaList: ['市辖区', '榕城区', '揭东县', '揭西县', '惠来县', '普宁市']},
                    {name: '云浮市', areaList: ['市辖区', '云城区', '新兴县', '郁南县', '云安县', '罗定市']}
                ]
            },
            {
                name: '广西', cityList: [
                    {
                        name: '南宁市',
                        areaList: ['市辖区', '兴宁区', '青秀区', '江南区', '西乡塘区', '良庆区', '邕宁区', '武鸣县', '隆安县', '马山县', '上林县', '宾阳县', '横　县']
                    },
                    {
                        name: '柳州市',
                        areaList: ['市辖区', '城中区', '鱼峰区', '柳南区', '柳北区', '柳江县', '柳城县', '鹿寨县', '融安县', '融水苗族自治县', '三江侗族自治县']
                    },
                    {
                        name: '桂林市',
                        areaList: ['市辖区', '秀峰区', '叠彩区', '象山区', '七星区', '雁山区', '阳朔县', '临桂县', '灵川县', '全州县', '兴安县', '永福县', '灌阳县', '龙胜各族自治县', '资源县', '平乐县', '荔蒲县', '恭城瑶族自治县']
                    },
                    {name: '梧州市', areaList: ['市辖区', '万秀区', '蝶山区', '长洲区', '苍梧县', '藤　县', '蒙山县', '岑溪市']},
                    {name: '北海市', areaList: ['市辖区', '海城区', '银海区', '铁山港区', '合浦县']},
                    {name: '防城港市', areaList: ['市辖区', '港口区', '防城区', '上思县', '东兴市']},
                    {name: '钦州市', areaList: ['市辖区', '钦南区', '钦北区', '灵山县', '浦北县']},
                    {name: '贵港市', areaList: ['市辖区', '港北区', '港南区', '覃塘区', '平南县', '桂平市']},
                    {name: '玉林市', areaList: ['市辖区', '玉州区', '容　县', '陆川县', '博白县', '兴业县', '北流市']},
                    {
                        name: '百色市',
                        areaList: ['市辖区', '右江区', '田阳县', '田东县', '平果县', '德保县', '靖西县', '那坡县', '凌云县', '乐业县', '田林县', '西林县', '隆林各族自治县']
                    },
                    {name: '贺州市', areaList: ['市辖区', '八步区', '昭平县', '钟山县', '富川瑶族自治县']},
                    {
                        name: '河池市',
                        areaList: ['市辖区', '金城江区', '南丹县', '天峨县', '凤山县', '东兰县', '罗城仫佬族自治县', '环江毛南族自治县', '巴马瑶族自治县', '都安瑶族自治县', '大化瑶族自治县', '宜州市']
                    },
                    {name: '来宾市', areaList: ['市辖区', '兴宾区', '忻城县', '象州县', '武宣县', '金秀瑶族自治县', '合山市']},
                    {name: '崇左市', areaList: ['市辖区', '江洲区', '扶绥县', '宁明县', '龙州县', '大新县', '天等县', '凭祥市']}
                ]
            },
            {
                name: '陕西', cityList: [
                    {
                        name: '西安市',
                        areaList: ['市辖区', '新城区', '碑林区', '莲湖区', '灞桥区', '未央区', '雁塔区', '阎良区', '临潼区', '长安区', '蓝田县', '周至县', '户　县', '高陵县']
                    },
                    {name: '铜川市', areaList: ['市辖区', '王益区', '印台区', '耀州区', '宜君县']},
                    {
                        name: '宝鸡市',
                        areaList: ['市辖区', '渭滨区', '金台区', '陈仓区', '凤翔县', '岐山县', '扶风县', '眉　县', '陇　县', '千阳县', '麟游县', '凤　县', '太白县']
                    },
                    {
                        name: '咸阳市',
                        areaList: ['市辖区', '秦都区', '杨凌区', '渭城区', '三原县', '泾阳县', '乾　县', '礼泉县', '永寿县', '彬　县', '长武县', '旬邑县', '淳化县', '武功县', '兴平市']
                    },
                    {
                        name: '渭南市',
                        areaList: ['市辖区', '临渭区', '华　县', '潼关县', '大荔县', '合阳县', '澄城县', '蒲城县', '白水县', '富平县', '韩城市', '华阴市']
                    },
                    {
                        name: '延安市',
                        areaList: ['市辖区', '宝塔区', '延长县', '延川县', '子长县', '安塞县', '志丹县', '吴旗县', '甘泉县', '富　县', '洛川县', '宜川县', '黄龙县', '黄陵县']
                    },
                    {
                        name: '汉中市',
                        areaList: ['市辖区', '汉台区', '南郑县', '城固县', '洋　县', '西乡县', '勉　县', '宁强县', '略阳县', '镇巴县', '留坝县', '佛坪县']
                    },
                    {
                        name: '榆林市',
                        areaList: ['市辖区', '榆阳区', '神木县', '府谷县', '横山县', '靖边县', '定边县', '绥德县', '米脂县', '佳　县', '吴堡县', '清涧县', '子洲县']
                    },
                    {
                        name: '安康市',
                        areaList: ['市辖区', '汉滨区', '汉阴县', '石泉县', '宁陕县', '紫阳县', '岚皋县', '平利县', '镇坪县', '旬阳县', '白河县']
                    },
                    {name: '商洛市', areaList: ['市辖区', '商州区', '洛南县', '丹凤县', '商南县', '山阳县', '镇安县', '柞水县']}
                ]
            },
            {
                name: '甘肃', cityList: [
                    {name: '兰州市', areaList: ['市辖区', '城关区', '七里河区', '西固区', '安宁区', '红古区', '永登县', '皋兰县', '榆中县']},
                    {name: '嘉峪关市', areaList: ['市辖区']},
                    {name: '金昌市', areaList: ['市辖区', '金川区', '永昌县']},
                    {name: '白银市', areaList: ['市辖区', '白银区', '平川区', '靖远县', '会宁县', '景泰县']},
                    {name: '天水市', areaList: ['市辖区', '秦城区', '北道区', '清水县', '秦安县', '甘谷县', '武山县', '张家川回族自治县']},
                    {name: '武威市', areaList: ['市辖区', '凉州区', '民勤县', '古浪县', '天祝藏族自治县']},
                    {name: '张掖市', areaList: ['市辖区', '甘州区', '肃南裕固族自治县', '民乐县', '临泽县', '高台县', '山丹县']},
                    {name: '平凉市', areaList: ['市辖区', '崆峒区', '泾川县', '灵台县', '崇信县', '华亭县', '庄浪县', '静宁县']},
                    {name: '酒泉市', areaList: ['市辖区', '肃州区', '金塔县', '安西县', '肃北蒙古族自治县', '阿克塞哈萨克族自治县', '玉门市', '敦煌市']},
                    {name: '庆阳市', areaList: ['市辖区', '西峰区', '庆城县', '环　县', '华池县', '合水县', '正宁县', '宁　县', '镇原县']},
                    {name: '定西市', areaList: ['市辖区', '安定区', '通渭县', '陇西县', '渭源县', '临洮县', '漳　县', '岷　县']},
                    {name: '陇南市', areaList: ['市辖区', '武都区', '成　县', '文　县', '宕昌县', '康　县', '西和县', '礼　县', '徽　县', '两当县']},
                    {
                        name: '临夏回族自治州',
                        areaList: ['临夏市', '临夏县', '康乐县', '永靖县', '广河县', '和政县', '东乡族自治县', '积石山保安族东乡族撒拉族自治县']
                    },
                    {name: '甘南藏族自治州', areaList: ['合作市', '临潭县', '卓尼县', '舟曲县', '迭部县', '玛曲县', '碌曲县', '夏河县']}
                ]
            },
            {
                name: '青海', cityList: [
                    {name: '西宁市', areaList: ['市辖区', '城东区', '城中区', '城西区', '城北区', '大通回族土族自治县', '湟中县', '湟源县']},
                    {name: '海东地区', areaList: ['平安县', '民和回族土族自治县', '乐都县', '互助土族自治县', '化隆回族自治县', '循化撒拉族自治县']},
                    {name: '海北藏族自治州', areaList: ['门源回族自治县', '祁连县', '海晏县', '刚察县']},
                    {name: '黄南藏族自治州', areaList: ['同仁县', '尖扎县', '泽库县', '河南蒙古族自治县']},
                    {name: '海南藏族自治州', areaList: ['共和县', '同德县', '贵德县', '兴海县', '贵南县']},
                    {name: '果洛藏族自治州', areaList: ['玛沁县', '班玛县', '甘德县', '达日县', '久治县', '玛多县']},
                    {name: '玉树藏族自治州', areaList: ['玉树县', '杂多县', '称多县', '治多县', '囊谦县', '曲麻莱县']},
                    {name: '海西蒙古族藏族自治州', areaList: ['格尔木市', '德令哈市', '乌兰县', '都兰县', '天峻县']}
                ]
            },
            {
                name: '宁夏', cityList: [
                    {name: '银川市', areaList: ['市辖区', '兴庆区', '西夏区', '金凤区', '永宁县', '贺兰县', '灵武市']},
                    {name: '石嘴山市', areaList: ['市辖区', '大武口区', '惠农区', '平罗县']},
                    {name: '吴忠市', areaList: ['市辖区', '利通区', '盐池县', '同心县', '青铜峡市']},
                    {name: '固原市', areaList: ['市辖区', '原州区', '西吉县', '隆德县', '泾源县', '彭阳县', '海原县']},
                    {name: '中卫市', areaList: ['市辖区', '沙坡头区', '中宁县']}
                ]
            },
            {
                name: '新疆', cityList: [
                    {name: '乌鲁木齐市', areaList: ['市辖区', '天山区', '沙依巴克区', '新市区', '水磨沟区', '头屯河区', '达坂城区', '东山区', '乌鲁木齐县']},
                    {name: '克拉玛依市', areaList: ['市辖区', '独山子区', '克拉玛依区', '白碱滩区', '乌尔禾区']},
                    {name: '吐鲁番地区', areaList: ['吐鲁番市', '鄯善县', '托克逊县']},
                    {name: '哈密地区', areaList: ['哈密市', '巴里坤哈萨克自治县', '伊吾县']},
                    {name: '昌吉回族自治州', areaList: ['昌吉市', '阜康市', '米泉市', '呼图壁县', '玛纳斯县', '奇台县', '吉木萨尔县', '木垒哈萨克自治县']},
                    {name: '博尔塔拉蒙古自治州', areaList: ['博乐市', '精河县', '温泉县']},
                    {name: '巴音郭楞蒙古自治州', areaList: ['库尔勒市', '轮台县', '尉犁县', '若羌县', '且末县', '焉耆回族自治县', '和静县', '和硕县', '博湖县']},
                    {name: '阿克苏地区', areaList: ['阿克苏市', '温宿县', '库车县', '沙雅县', '新和县', '拜城县', '乌什县', '阿瓦提县', '柯坪县']},
                    {name: '克孜勒苏柯尔克孜自治州', areaList: ['阿图什市', '阿克陶县', '阿合奇县', '乌恰县']},
                    {
                        name: '喀什地区',
                        areaList: ['喀什市', '疏附县', '疏勒县', '英吉沙县', '泽普县', '莎车县', '叶城县', '麦盖提县', '岳普湖县', '伽师县', '巴楚县', '塔什库尔干塔吉克自治县']
                    },
                    {name: '和田地区', areaList: ['和田市', '和田县', '墨玉县', '皮山县', '洛浦县', '策勒县', '于田县', '民丰县']},
                    {
                        name: '伊犁哈萨克自治州',
                        areaList: ['伊宁市', '奎屯市', '伊宁县', '察布查尔锡伯自治县', '霍城县', '巩留县', '新源县', '昭苏县', '特克斯县', '尼勒克县']
                    },
                    {name: '塔城地区', areaList: ['塔城市', '乌苏市', '额敏县', '沙湾县', '托里县', '裕民县', '和布克赛尔蒙古自治县']},
                    {name: '阿勒泰地区', areaList: ['阿勒泰市', '布尔津县', '富蕴县', '福海县', '哈巴河县', '青河县', '吉木乃县']},
                    {name: '省直辖行政单位', areaList: ['石河子市', '阿拉尔市', '图木舒克市', '五家渠市']}
                ]
            },
            {
                name: '河北', cityList: [
                    {
                        name: '石家庄市',
                        areaList: ['市辖区', '长安区', '桥东区', '桥西区', '新华区', '井陉矿区', '裕华区', '井陉县', '正定县', '栾城县', '行唐县', '灵寿县', '高邑县', '深泽县', '赞皇县', '无极县', '平山县', '元氏县', '赵　县', '辛集市', '藁城市', '晋州市', '新乐市', '鹿泉市']
                    },
                    {
                        name: '唐山市',
                        areaList: ['市辖区', '路南区', '路北区', '古冶区', '开平区', '丰南区', '丰润区', '滦　县', '滦南县', '乐亭县', '迁西县', '玉田县', '唐海县', '遵化市', '迁安市']
                    },
                    {name: '秦皇岛市', areaList: ['市辖区', '海港区', '山海关区', '北戴河区', '青龙满族自治县', '昌黎县', '抚宁县', '卢龙县']},
                    {
                        name: '邯郸市',
                        areaList: ['市辖区', '邯山区', '丛台区', '复兴区', '峰峰矿区', '邯郸县', '临漳县', '成安县', '大名县', '涉　县', '磁　县', '肥乡县', '永年县', '邱　县', '鸡泽县', '广平县', '馆陶县', '魏　县', '曲周县', '武安市']
                    },
                    {
                        name: '邢台市',
                        areaList: ['市辖区', '桥东区', '桥西区', '邢台县', '临城县', '内丘县', '柏乡县', '隆尧县', '任　县', '南和县', '宁晋县', '巨鹿县', '新河县', '广宗县', '平乡县', '威　县', '清河县', '临西县', '南宫市', '沙河市']
                    },
                    {
                        name: '保定市',
                        areaList: ['市辖区', '新市区', '北市区', '南市区', '满城县', '清苑县', '涞水县', '阜平县', '徐水县', '定兴县', '唐　县', '高阳县', '容城县', '涞源县', '望都县', '安新县', '易　县', '曲阳县', '蠡　县', '顺平县', '博野县', '雄　县', '涿州市', '定州市', '安国市', '高碑店市']
                    },
                    {
                        name: '张家口市',
                        areaList: ['市辖区', '桥东区', '桥西区', '宣化区', '下花园区', '宣化县', '张北县', '康保县', '沽源县', '尚义县', '蔚　县', '阳原县', '怀安县', '万全县', '怀来县', '涿鹿县', '赤城县', '崇礼县']
                    },
                    {
                        name: '承德市',
                        areaList: ['市辖区', '双桥区', '双滦区', '鹰手营子矿区', '承德县', '兴隆县', '平泉县', '滦平县', '隆化县', '丰宁满族自治县', '宽城满族自治县', '围场满族蒙古族自治县']
                    },
                    {
                        name: '沧州市',
                        areaList: ['市辖区', '新华区', '运河区', '沧　县', '青　县', '东光县', '海兴县', '盐山县', '肃宁县', '南皮县', '吴桥县', '献　县', '孟村回族自治县', '泊头市', '任丘市', '黄骅市', '河间市']
                    },
                    {
                        name: '廊坊市',
                        areaList: ['市辖区', '安次区', '广阳区', '固安县', '永清县', '香河县', '大城县', '文安县', '大厂回族自治县', '霸州市', '三河市']
                    },
                    {
                        name: '衡水市',
                        areaList: ['市辖区', '桃城区', '枣强县', '武邑县', '武强县', '饶阳县', '安平县', '故城县', '景　县', '阜城县', '冀州市', '深州市']
                    }
                ]
            },
            {
                name: '山西', cityList: [
                    {
                        name: '太原市',
                        areaList: ['市辖区', '小店区', '迎泽区', '杏花岭区', '尖草坪区', '万柏林区', '晋源区', '清徐县', '阳曲县', '娄烦县', '古交市']
                    },
                    {
                        name: '大同市',
                        areaList: ['市辖区', '城　区', '矿　区', '南郊区', '新荣区', '阳高县', '天镇县', '广灵县', '灵丘县', '浑源县', '左云县', '大同县']
                    },
                    {name: '阳泉市', areaList: ['市辖区', '城　区', '矿　区', '郊　区', '平定县', '盂　县']},
                    {
                        name: '长治市',
                        areaList: ['市辖区', '城　区', '郊　区', '长治县', '襄垣县', '屯留县', '平顺县', '黎城县', '壶关县', '长子县', '武乡县', '沁　县', '沁源县', '潞城市']
                    },
                    {name: '晋城市', areaList: ['市辖区', '城　区', '沁水县', '阳城县', '陵川县', '泽州县', '高平市']},
                    {name: '朔州市', areaList: ['市辖区', '朔城区', '平鲁区', '山阴县', '应　县', '右玉县', '怀仁县']},
                    {
                        name: '晋中市',
                        areaList: ['市辖区', '榆次区', '榆社县', '左权县', '和顺县', '昔阳县', '寿阳县', '太谷县', '祁　县', '平遥县', '灵石县', '介休市']
                    },
                    {
                        name: '运城市',
                        areaList: ['市辖区', '盐湖区', '临猗县', '万荣县', '闻喜县', '稷山县', '新绛县', '绛　县', '垣曲县', '夏　县', '平陆县', '芮城县', '永济市', '河津市']
                    },
                    {
                        name: '忻州市',
                        areaList: ['市辖区', '忻府区', '定襄县', '五台县', '代　县', '繁峙县', '宁武县', '静乐县', '神池县', '五寨县', '岢岚县', '河曲县', '保德县', '偏关县', '原平市']
                    },
                    {
                        name: '临汾市',
                        areaList: ['市辖区', '尧都区', '曲沃县', '翼城县', '襄汾县', '洪洞县', '古　县', '安泽县', '浮山县', '吉　县', '乡宁县', '大宁县', '隰　县', '永和县', '蒲　县', '汾西县', '侯马市', '霍州市']
                    },
                    {
                        name: '吕梁市',
                        areaList: ['市辖区', '离石区', '文水县', '交城县', '兴　县', '临　县', '柳林县', '石楼县', '岚　县', '方山县', '中阳县', '交口县', '孝义市', '汾阳市']
                    }
                ]
            },
            {
                name: '内蒙古', cityList: [
                    {
                        name: '呼和浩特市',
                        areaList: ['市辖区', '新城区', '回民区', '玉泉区', '赛罕区', '土默特左旗', '托克托县', '和林格尔县', '清水河县', '武川县']
                    },
                    {
                        name: '包头市',
                        areaList: ['市辖区', '东河区', '昆都仑区', '青山区', '石拐区', '白云矿区', '九原区', '土默特右旗', '固阳县', '达尔罕茂明安联合旗']
                    },
                    {name: '乌海市', areaList: ['市辖区', '海勃湾区', '海南区', '乌达区']},
                    {
                        name: '赤峰市',
                        areaList: ['市辖区', '红山区', '元宝山区', '松山区', '阿鲁科尔沁旗', '巴林左旗', '巴林右旗', '林西县', '克什克腾旗', '翁牛特旗', '喀喇沁旗', '宁城县', '敖汉旗']
                    },
                    {
                        name: '通辽市',
                        areaList: ['市辖区', '科尔沁区', '科尔沁左翼中旗', '科尔沁左翼后旗', '开鲁县', '库伦旗', '奈曼旗', '扎鲁特旗', '霍林郭勒市']
                    },
                    {name: '鄂尔多斯市', areaList: ['东胜区', '达拉特旗', '准格尔旗', '鄂托克前旗', '鄂托克旗', '杭锦旗', '乌审旗', '伊金霍洛旗']},
                    {
                        name: '呼伦贝尔市',
                        areaList: ['市辖区', '海拉尔区', '阿荣旗', '莫力达瓦达斡尔族自治旗', '鄂伦春自治旗', '鄂温克族自治旗', '陈巴尔虎旗', '新巴尔虎左旗', '新巴尔虎右旗', '满洲里市', '牙克石市', '扎兰屯市', '额尔古纳市', '根河市']
                    },
                    {name: '巴彦淖尔市', areaList: ['市辖区', '临河区', '五原县', '磴口县', '乌拉特前旗', '乌拉特中旗', '乌拉特后旗', '杭锦后旗']},
                    {
                        name: '乌兰察布市',
                        areaList: ['市辖区', '集宁区', '卓资县', '化德县', '商都县', '兴和县', '凉城县', '察哈尔右翼前旗', '察哈尔右翼中旗', '察哈尔右翼后旗', '四子王旗', '丰镇市']
                    },
                    {name: '兴安盟', areaList: ['乌兰浩特市', '阿尔山市', '科尔沁右翼前旗', '科尔沁右翼中旗', '扎赉特旗', '突泉县']},
                    {
                        name: '锡林郭勒盟',
                        areaList: ['二连浩特市', '锡林浩特市', '阿巴嘎旗', '苏尼特左旗', '苏尼特右旗', '东乌珠穆沁旗', '西乌珠穆沁旗', '太仆寺旗', '镶黄旗', '正镶白旗', '正蓝旗', '多伦县']
                    },
                    {name: '阿拉善盟', areaList: ['阿拉善左旗', '阿拉善右旗', '额济纳旗']}
                ]
            },
            {
                name: '江苏', cityList: [
                    {
                        name: '南京市',
                        areaList: ['市辖区', '玄武区', '白下区', '秦淮区', '建邺区', '鼓楼区', '下关区', '浦口区', '栖霞区', '雨花台区', '江宁区', '六合区', '溧水县', '高淳县']
                    },
                    {name: '无锡市', areaList: ['市辖区', '崇安区', '南长区', '北塘区', '锡山区', '惠山区', '滨湖区', '江阴市', '宜兴市']},
                    {
                        name: '徐州市',
                        areaList: ['市辖区', '鼓楼区', '云龙区', '九里区', '贾汪区', '泉山区', '丰　县', '沛　县', '铜山县', '睢宁县', '新沂市', '邳州市']
                    },
                    {name: '常州市', areaList: ['市辖区', '天宁区', '钟楼区', '戚墅堰区', '新北区', '武进区', '溧阳市', '金坛市']},
                    {
                        name: '苏州市',
                        areaList: ['市辖区', '沧浪区', '平江区', '金阊区', '虎丘区', '吴中区', '相城区', '常熟市', '张家港市', '昆山市', '吴江市', '太仓市']
                    },
                    {name: '南通市', areaList: ['市辖区', '崇川区', '港闸区', '海安县', '如东县', '启东市', '如皋市', '通州市', '海门市']},
                    {name: '连云港市', areaList: ['市辖区', '连云区', '新浦区', '海州区', '赣榆县', '东海县', '灌云县', '灌南县']},
                    {name: '淮安市', areaList: ['市辖区', '清河区', '楚州区', '淮阴区', '清浦区', '涟水县', '洪泽县', '盱眙县', '金湖县']},
                    {name: '盐城市', areaList: ['市辖区', '亭湖区', '盐都区', '响水县', '滨海县', '阜宁县', '射阳县', '建湖县', '东台市', '大丰市']},
                    {name: '扬州市', areaList: ['市辖区', '广陵区', '邗江区', '郊　区', '宝应县', '仪征市', '高邮市', '江都市']},
                    {name: '镇江市', areaList: ['市辖区', '京口区', '润州区', '丹徒区', '丹阳市', '扬中市', '句容市']},
                    {name: '泰州市', areaList: ['市辖区', '海陵区', '高港区', '兴化市', '靖江市', '泰兴市', '姜堰市']},
                    {name: '宿迁市', areaList: ['市辖区', '宿城区', '宿豫区', '沭阳县', '泗阳县', '泗洪县']}
                ]
            },
            {
                name: '浙江', cityList: [
                    {
                        name: '杭州市',
                        areaList: ['市辖区', '上城区', '下城区', '江干区', '拱墅区', '西湖区', '滨江区', '萧山区', '余杭区', '桐庐县', '淳安县', '建德市', '富阳市', '临安市']
                    },
                    {
                        name: '宁波市',
                        areaList: ['市辖区', '海曙区', '江东区', '江北区', '北仑区', '镇海区', '鄞州区', '象山县', '宁海县', '余姚市', '慈溪市', '奉化市']
                    },
                    {
                        name: '温州市',
                        areaList: ['市辖区', '鹿城区', '龙湾区', '瓯海区', '洞头县', '永嘉县', '平阳县', '苍南县', '文成县', '泰顺县', '瑞安市', '乐清市']
                    },
                    {name: '嘉兴市', areaList: ['市辖区', '秀城区', '秀洲区', '嘉善县', '海盐县', '海宁市', '平湖市', '桐乡市']},
                    {name: '湖州市', areaList: ['市辖区', '吴兴区', '南浔区', '德清县', '长兴县', '安吉县']},
                    {name: '绍兴市', areaList: ['市辖区', '越城区', '绍兴县', '新昌县', '诸暨市', '上虞市', '嵊州市']},
                    {name: '金华市', areaList: ['市辖区', '婺城区', '金东区', '武义县', '浦江县', '磐安县', '兰溪市', '义乌市', '东阳市', '永康市']},
                    {name: '衢州市', areaList: ['市辖区', '柯城区', '衢江区', '常山县', '开化县', '龙游县', '江山市']},
                    {name: '舟山市', areaList: ['市辖区', '定海区', '普陀区', '岱山县', '嵊泗县']},
                    {name: '台州市', areaList: ['市辖区', '椒江区', '黄岩区', '路桥区', '玉环县', '三门县', '天台县', '仙居县', '温岭市', '临海市']},
                    {name: '丽水市', areaList: ['市辖区', '莲都区', '青田县', '缙云县', '遂昌县', '松阳县', '云和县', '庆元县', '景宁畲族自治县', '龙泉市']}
                ]
            },
            {
                name: '安徽', cityList: [
                    {name: '合肥市', areaList: ['市辖区', '瑶海区', '庐阳区', '蜀山区', '包河区', '长丰县', '肥东县', '肥西县']},
                    {name: '芜湖市', areaList: ['市辖区', '镜湖区', '马塘区', '新芜区', '鸠江区', '芜湖县', '繁昌县', '南陵县']},
                    {name: '蚌埠市', areaList: ['市辖区', '龙子湖区', '蚌山区', '禹会区', '淮上区', '怀远县', '五河县', '固镇县']},
                    {name: '淮南市', areaList: ['市辖区', '大通区', '田家庵区', '谢家集区', '八公山区', '潘集区', '凤台县']},
                    {name: '马鞍山市', areaList: ['市辖区', '金家庄区', '花山区', '雨山区', '当涂县']},
                    {name: '淮北市', areaList: ['市辖区', '杜集区', '相山区', '烈山区', '濉溪县']},
                    {name: '铜陵市', areaList: ['市辖区', '铜官山区', '狮子山区', '郊　区', '铜陵县']},
                    {
                        name: '安庆市',
                        areaList: ['市辖区', '迎江区', '大观区', '郊　区', '怀宁县', '枞阳县', '潜山县', '太湖县', '宿松县', '望江县', '岳西县', '桐城市']
                    },
                    {name: '黄山市', areaList: ['市辖区', '屯溪区', '黄山区', '徽州区', '歙　县', '休宁县', '黟　县', '祁门县']},
                    {name: '滁州市', areaList: ['市辖区', '琅琊区', '南谯区', '来安县', '全椒县', '定远县', '凤阳县', '天长市', '明光市']},
                    {name: '阜阳市', areaList: ['市辖区', '颍州区', '颍东区', '颍泉区', '临泉县', '太和县', '阜南县', '颍上县', '界首市']},
                    {name: '宿州市', areaList: ['市辖区', '墉桥区', '砀山县', '萧　县', '灵璧县', '泗　县']},
                    {name: '巢湖市', areaList: ['市辖区', '居巢区', '庐江县', '无为县', '含山县', '和　县']},
                    {name: '六安市', areaList: ['市辖区', '金安区', '裕安区', '寿　县', '霍邱县', '舒城县', '金寨县', '霍山县']},
                    {name: '亳州市', areaList: ['市辖区', '谯城区', '涡阳县', '蒙城县', '利辛县']},
                    {name: '池州市', areaList: ['市辖区', '贵池区', '东至县', '石台县', '青阳县']},
                    {name: '宣城市', areaList: ['市辖区', '宣州区', '郎溪县', '广德县', '泾　县', '绩溪县', '旌德县', '宁国市']}
                ]
            },
            {
                name: '福建', cityList: [
                    {
                        name: '福州市',
                        areaList: ['市辖区', '鼓楼区', '台江区', '仓山区', '马尾区', '晋安区', '闽侯县', '连江县', '罗源县', '闽清县', '永泰县', '平潭县', '福清市', '长乐市']
                    },
                    {name: '厦门市', areaList: ['市辖区', '思明区', '海沧区', '湖里区', '集美区', '同安区', '翔安区']},
                    {name: '莆田市', areaList: ['市辖区', '城厢区', '涵江区', '荔城区', '秀屿区', '仙游县']},
                    {
                        name: '三明市',
                        areaList: ['市辖区', '梅列区', '三元区', '明溪县', '清流县', '宁化县', '大田县', '尤溪县', '沙　县', '将乐县', '泰宁县', '建宁县', '永安市']
                    },
                    {
                        name: '泉州市',
                        areaList: ['市辖区', '鲤城区', '丰泽区', '洛江区', '泉港区', '惠安县', '安溪县', '永春县', '德化县', '金门县', '石狮市', '晋江市', '南安市']
                    },
                    {
                        name: '漳州市',
                        areaList: ['市辖区', '芗城区', '龙文区', '云霄县', '漳浦县', '诏安县', '长泰县', '东山县', '南靖县', '平和县', '华安县', '龙海市']
                    },
                    {
                        name: '南平市',
                        areaList: ['市辖区', '延平区', '顺昌县', '浦城县', '光泽县', '松溪县', '政和县', '邵武市', '武夷山市', '建瓯市', '建阳市']
                    },
                    {name: '龙岩市', areaList: ['市辖区', '新罗区', '长汀县', '永定县', '上杭县', '武平县', '连城县', '漳平市']},
                    {name: '宁德市', areaList: ['市辖区', '蕉城区', '霞浦县', '古田县', '屏南县', '寿宁县', '周宁县', '柘荣县', '福安市', '福鼎市']}
                ]
            },
            {
                name: '江西', cityList: [
                    {name: '南昌市', areaList: ['市辖区', '东湖区', '西湖区', '青云谱区', '湾里区', '青山湖区', '南昌县', '新建县', '安义县', '进贤县']},
                    {name: '景德镇市', areaList: ['市辖区', '昌江区', '珠山区', '浮梁县', '乐平市']},
                    {name: '萍乡市', areaList: ['市辖区', '安源区', '湘东区', '莲花县', '上栗县', '芦溪县']},
                    {
                        name: '九江市',
                        areaList: ['市辖区', '庐山区', '浔阳区', '九江县', '武宁县', '修水县', '永修县', '德安县', '星子县', '都昌县', '湖口县', '彭泽县', '瑞昌市']
                    },
                    {name: '新余市', areaList: ['市辖区', '渝水区', '分宜县']},
                    {name: '鹰潭市', areaList: ['市辖区', '月湖区', '余江县', '贵溪市']},
                    {
                        name: '赣州市',
                        areaList: ['市辖区', '章贡区', '赣　县', '信丰县', '大余县', '上犹县', '崇义县', '安远县', '龙南县', '定南县', '全南县', '宁都县', '于都县', '兴国县', '会昌县', '寻乌县', '石城县', '瑞金市', '南康市']
                    },
                    {
                        name: '吉安市',
                        areaList: ['市辖区', '吉州区', '青原区', '吉安县', '吉水县', '峡江县', '新干县', '永丰县', '泰和县', '遂川县', '万安县', '安福县', '永新县', '井冈山市']
                    },
                    {
                        name: '宜春市',
                        areaList: ['市辖区', '袁州区', '奉新县', '万载县', '上高县', '宜丰县', '靖安县', '铜鼓县', '丰城市', '樟树市', '高安市']
                    },
                    {
                        name: '抚州市',
                        areaList: ['市辖区', '临川区', '南城县', '黎川县', '南丰县', '崇仁县', '乐安县', '宜黄县', '金溪县', '资溪县', '东乡县', '广昌县']
                    },
                    {
                        name: '上饶市',
                        areaList: ['市辖区', '信州区', '上饶县', '广丰县', '玉山县', '铅山县', '横峰县', '弋阳县', '余干县', '鄱阳县', '万年县', '婺源县', '德兴市']
                    }
                ]
            },
            {
                name: '山东', cityList: [
                    {
                        name: '济南市',
                        areaList: ['市辖区', '历下区', '市中区', '槐荫区', '天桥区', '历城区', '长清区', '平阴县', '济阳县', '商河县', '章丘市']
                    },
                    {
                        name: '青岛市',
                        areaList: ['市辖区', '市南区', '市北区', '四方区', '黄岛区', '崂山区', '李沧区', '城阳区', '胶州市', '即墨市', '平度市', '胶南市', '莱西市']
                    },
                    {name: '淄博市', areaList: ['市辖区', '淄川区', '张店区', '博山区', '临淄区', '周村区', '桓台县', '高青县', '沂源县']},
                    {name: '枣庄市', areaList: ['市辖区', '市中区', '薛城区', '峄城区', '台儿庄区', '山亭区', '滕州市']},
                    {name: '东营市', areaList: ['市辖区', '东营区', '河口区', '垦利县', '利津县', '广饶县']},
                    {
                        name: '烟台市',
                        areaList: ['市辖区', '芝罘区', '福山区', '牟平区', '莱山区', '长岛县', '龙口市', '莱阳市', '莱州市', '蓬莱市', '招远市', '栖霞市', '海阳市']
                    },
                    {
                        name: '潍坊市',
                        areaList: ['市辖区', '潍城区', '寒亭区', '坊子区', '奎文区', '临朐县', '昌乐县', '青州市', '诸城市', '寿光市', '安丘市', '高密市', '昌邑市']
                    },
                    {
                        name: '济宁市',
                        areaList: ['市辖区', '市中区', '任城区', '微山县', '鱼台县', '金乡县', '嘉祥县', '汶上县', '泗水县', '梁山县', '曲阜市', '兖州市', '邹城市']
                    },
                    {name: '泰安市', areaList: ['市辖区', '泰山区', '岱岳区', '宁阳县', '东平县', '新泰市', '肥城市']},
                    {name: '威海市', areaList: ['市辖区', '环翠区', '文登市', '荣成市', '乳山市']},
                    {name: '日照市', areaList: ['市辖区', '东港区', '岚山区', '五莲县', '莒　县']},
                    {name: '莱芜市', areaList: ['市辖区', '莱城区', '钢城区']},
                    {
                        name: '临沂市',
                        areaList: ['市辖区', '兰山区', '罗庄区', '河东区', '沂南县', '郯城县', '沂水县', '苍山县', '费　县', '平邑县', '莒南县', '蒙阴县', '临沭县']
                    },
                    {
                        name: '德州市',
                        areaList: ['市辖区', '德城区', '陵　县', '宁津县', '庆云县', '临邑县', '齐河县', '平原县', '夏津县', '武城县', '乐陵市', '禹城市']
                    },
                    {name: '聊城市', areaList: ['市辖区', '东昌府区', '阳谷县', '莘　县', '茌平县', '东阿县', '冠　县', '高唐县', '临清市']},
                    {name: '滨州市', areaList: ['市辖区', '滨城区', '惠民县', '阳信县', '无棣县', '沾化县', '博兴县', '邹平县']},
                    {name: '荷泽市', areaList: ['市辖区', '牡丹区', '曹　县', '单　县', '成武县', '巨野县', '郓城县', '鄄城县', '定陶县', '东明县']}
                ]
            },
            {
                name: '辽宁', cityList: [
                    {
                        name: '沈阳市',
                        areaList: ['市辖区', '和平区', '沈河区', '大东区', '皇姑区', '铁西区', '苏家屯区', '东陵区', '新城子区', '于洪区', '辽中县', '康平县', '法库县', '新民市']
                    },
                    {
                        name: '大连市',
                        areaList: ['市辖区', '中山区', '西岗区', '沙河口区', '甘井子区', '旅顺口区', '金州区', '长海县', '瓦房店市', '普兰店市', '庄河市']
                    },
                    {name: '鞍山市', areaList: ['市辖区', '铁东区', '铁西区', '立山区', '千山区', '台安县', '岫岩满族自治县', '海城市']},
                    {name: '抚顺市', areaList: ['市辖区', '新抚区', '东洲区', '望花区', '顺城区', '抚顺县', '新宾满族自治县', '清原满族自治县']},
                    {name: '本溪市', areaList: ['市辖区', '平山区', '溪湖区', '明山区', '南芬区', '本溪满族自治县', '桓仁满族自治县']},
                    {name: '丹东市', areaList: ['市辖区', '元宝区', '振兴区', '振安区', '宽甸满族自治县', '东港市', '凤城市']},
                    {name: '锦州市', areaList: ['市辖区', '古塔区', '凌河区', '太和区', '黑山县', '义　县', '凌海市', '北宁市']},
                    {name: '营口市', areaList: ['市辖区', '站前区', '西市区', '鲅鱼圈区', '老边区', '盖州市', '大石桥市']},
                    {name: '阜新市', areaList: ['市辖区', '海州区', '新邱区', '太平区', '清河门区', '细河区', '阜新蒙古族自治县', '彰武县']},
                    {name: '辽阳市', areaList: ['市辖区', '白塔区', '文圣区', '宏伟区', '弓长岭区', '太子河区', '辽阳县', '灯塔市']},
                    {name: '盘锦市', areaList: ['市辖区', '双台子区', '兴隆台区', '大洼县', '盘山县']},
                    {name: '铁岭市', areaList: ['市辖区', '银州区', '清河区', '铁岭县', '西丰县', '昌图县', '调兵山市', '开原市']},
                    {name: '朝阳市', areaList: ['市辖区', '双塔区', '龙城区', '朝阳县', '建平县', '喀喇沁左翼蒙古族自治县', '北票市', '凌源市']},
                    {name: '葫芦岛市', areaList: ['市辖区', '连山区', '龙港区', '南票区', '绥中县', '建昌县', '兴城市']}
                ]
            },
            {
                name: '吉林', cityList: [
                    {
                        name: '长春市',
                        areaList: ['市辖区', '南关区', '宽城区', '朝阳区', '二道区', '绿园区', '双阳区', '农安县', '九台市', '榆树市', '德惠市']
                    },
                    {name: '吉林市', areaList: ['市辖区', '昌邑区', '龙潭区', '船营区', '丰满区', '永吉县', '蛟河市', '桦甸市', '舒兰市', '磐石市']},
                    {name: '四平市', areaList: ['市辖区', '铁西区', '铁东区', '梨树县', '伊通满族自治县', '公主岭市', '双辽市']},
                    {name: '辽源市', areaList: ['市辖区', '龙山区', '西安区', '东丰县', '东辽县']},
                    {name: '通化市', areaList: ['市辖区', '东昌区', '二道江区', '通化县', '辉南县', '柳河县', '梅河口市', '集安市']},
                    {name: '白山市', areaList: ['市辖区', '八道江区', '抚松县', '靖宇县', '长白朝鲜族自治县', '江源县', '临江市']},
                    {name: '松原市', areaList: ['市辖区', '宁江区', '前郭尔罗斯蒙古族自治县', '长岭县', '乾安县', '扶余县']},
                    {name: '白城市', areaList: ['市辖区', '洮北区', '镇赉县', '通榆县', '洮南市', '大安市']},
                    {name: '延边朝鲜族自治州', areaList: ['延吉市', '图们市', '敦化市', '珲春市', '龙井市', '和龙市', '汪清县', '安图县']}
                ]
            },
            {
                name: '黑龙江', cityList: [
                    {
                        name: '哈尔滨市',
                        areaList: ['市辖区', '道里区', '南岗区', '道外区', '香坊区', '动力区', '平房区', '松北区', '呼兰区', '依兰县', '方正县', '宾　县', '巴彦县', '木兰县', '通河县', '延寿县', '阿城市', '双城市', '尚志市', '五常市']
                    },
                    {
                        name: '齐齐哈尔市',
                        areaList: ['市辖区', '龙沙区', '建华区', '铁锋区', '昂昂溪区', '富拉尔基区', '碾子山区', '梅里斯达斡尔族区', '龙江县', '依安县', '泰来县', '甘南县', '富裕县', '克山县', '克东县', '拜泉县', '讷河市']
                    },
                    {name: '鸡西市', areaList: ['市辖区', '鸡冠区', '恒山区', '滴道区', '梨树区', '城子河区', '麻山区', '鸡东县', '虎林市', '密山市']},
                    {name: '鹤岗市', areaList: ['市辖区', '向阳区', '工农区', '南山区', '兴安区', '东山区', '兴山区', '萝北县', '绥滨县']},
                    {name: '双鸭山市', areaList: ['市辖区', '尖山区', '岭东区', '四方台区', '宝山区', '集贤县', '友谊县', '宝清县', '饶河县']},
                    {
                        name: '大庆市',
                        areaList: ['市辖区', '萨尔图区', '龙凤区', '让胡路区', '红岗区', '大同区', '肇州县', '肇源县', '林甸县', '杜尔伯特蒙古族自治县']
                    },
                    {
                        name: '伊春市',
                        areaList: ['市辖区', '伊春区', '南岔区', '友好区', '西林区', '翠峦区', '新青区', '美溪区', '金山屯区', '五营区', '乌马河区', '汤旺河区', '带岭区', '乌伊岭区', '红星区', '上甘岭区', '嘉荫县', '铁力市']
                    },
                    {
                        name: '佳木斯市',
                        areaList: ['市辖区', '永红区', '向阳区', '前进区', '东风区', '郊　区', '桦南县', '桦川县', '汤原县', '抚远县', '同江市', '富锦市']
                    },
                    {name: '七台河市', areaList: ['市辖区', '新兴区', '桃山区', '茄子河区', '勃利县']},
                    {
                        name: '牡丹江市',
                        areaList: ['市辖区', '东安区', '阳明区', '爱民区', '西安区', '东宁县', '林口县', '绥芬河市', '海林市', '宁安市', '穆棱市']
                    },
                    {name: '黑河市', areaList: ['市辖区', '爱辉区', '嫩江县', '逊克县', '孙吴县', '北安市', '五大连池市']},
                    {
                        name: '绥化市',
                        areaList: ['市辖区', '北林区', '望奎县', '兰西县', '青冈县', '庆安县', '明水县', '绥棱县', '安达市', '肇东市', '海伦市']
                    },
                    {name: '大兴安岭地区', areaList: ['呼玛县', '塔河县', '漠河县']}
                ]
            },
            {
                name: '海南', cityList: [
                    {name: '海口市', areaList: ['市辖区', '秀英区', '龙华区', '琼山区', '美兰区']},
                    {name: '三亚市', areaList: ['市辖区']},
                    {
                        name: '省直辖县级行政单位',
                        areaList: ['五指山市', '琼海市', '儋州市', '文昌市', '万宁市', '东方市', '定安县', '屯昌县', '澄迈县', '临高县', '白沙黎族自治县', '昌江黎族自治县', '乐东黎族自治县', '陵水黎族自治县', '保亭黎族苗族自治县', '琼中黎族苗族自治县', '西沙群岛', '南沙群岛', '中沙群岛的岛礁及其海域']
                    }
                ]
            },
            {
                name: '台湾', cityList: []
            },
            {
                name: '香港', cityList: []
            },
            {
                name: '澳门', cityList: []
            }
        ];
        var base = new Base64();
        var obj = null;

        $scope.imgarr = [];
        if (sessionStorage.getItem('staff')) {
            var str = base.decode(sessionStorage.getItem('staff'))
            obj = JSON.parse(str);
            console.log(obj)
            var userId = obj.id
        }
        //省级获取
        $scope.provinceget = function (provice) {
            console.log(provice)

            $scope.citylist = provice.cityList;
        }
        //市级获取
        $scope.cityget = function (city) {
            console.log(city)
            $scope.arealist = city.areaList;
        }
        erp.postFun('app/employee/staffrecord', {"data": "{'staffid':'" + obj.id + "'}"}, con, err)

        function xlo(n) {
            var obj = JSON.parse(n.data.result)
            console.log('company', obj.info)
            $scope.companyList = obj.info;
            // $scope.staffcompanydivision = '杭州';
            console.log($scope.staffcompanydivision)
            // console.log('公司级索引',erp.findIndexByKey($scope.companyList,'companyName',$scope.fircompany))
            console.log($scope.fircompany)
            var ci = erp.findIndexByKey($scope.companyList, 'companyName', $scope.fircompany);
            console.log(ci)
            console.log($scope.companyList[ci])
            $scope.staffcompanydivision = $scope.companyList[ci];

            console.log('部门级索引', erp.findIndexByKey($scope.companyList[ci].departments, 'department', $scope.firstdepart))
            var di = erp.findIndexByKey($scope.companyList[ci].departments, 'department', $scope.firstdepart);
            $scope.departmentlist = $scope.companyList[ci].departments
            $scope.staffdepartment = $scope.companyList[ci].departments[di];
            console.log($scope.departmentlist)
            // console.log('组级索引',erp.findIndexByKey($scope.companyList[ci].departments[di].group,'comgroup', $scope.firstgroup))
            var gi = erp.findIndexByKey($scope.companyList[ci].departments[di].group, 'comgroup', $scope.firstgroup)
            $scope.groupList = $scope.companyList[ci].departments[di].group;
            $scope.staffgroup = $scope.companyList[ci].departments[di].group[gi];
        }

        function con(n) {
            var obj = JSON.parse(n.data.result)
            obj = obj.info[0]
            console.log(obj)
            $scope.detail = obj.info
            $scope.stafftype = obj.type;
            $scope.staffid = obj.ID;
            $scope.staffname = obj.name;
            console.log(obj.hiredate)
            // $scope.staffhiredate = obj.hiredate;
            if (obj.hiredate) {
                $scope.staffhiredate = (obj.hiredate.year + 1900) + '-' + (obj.hiredate.month + 1) + '-' + (obj.hiredate.date);
            }
            $scope.staffsex = obj.sex;
            $scope.staffidcard = obj.IDCard;
            $scope.staffaccount = obj.residence;
            $scope.staffage = obj.age;
            var headimg = obj.headPortrait;
            if (headimg) {
                headimg = headimg.replace('http://', '');
                headimg = headimg.replace('https://', '');
                $scope.headimg = 'https://' + headimg;
                console.log($scope.headimg)
            }
            console.log(obj.age.substring(0, 4), obj.age.substring(5, 7))
            var date = new Date;
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            console.log(obj.age.substring(0, 4))
            var age = year - obj.age.substring(0, 4);
            console.log(month)
            console.log(obj.age.substring(4, 6))
            if ((month - obj.age.substring(4, 6)) > 0) {
                age += 1;
            }
            var index = obj.phone.indexOf('-');
            $scope.staffagestr = age + '岁 (' + obj.age.substring(0, 8) + ")";
            $scope.staffeducation = obj.education;
            $scope.staffaddress = obj.newaddress;
            $scope.staffpoliticalstatus = obj.politicalvisage;
            $scope.staffschool = obj.school;
            $scope.staffprofession = obj.major;
            $scope.staffmarriage = obj.maritalstatus;
            $scope.stafftel = obj.phone.substring(index + 1, obj.phone.length);
            $scope.stafftel_qh = obj.phone.substring(0, index);
            $scope.staffemail = obj.email;
            $scope.staffwechat = obj.wechat;
            $scope.staffqq = obj.workqq;
            $scope.staffqqpassword = obj.workqqpassword;
            $scope.workxparr = obj.workexp;
            $scope.staffnameen = obj.nameEN;
            $scope.BXlist = obj.historicalRecords;
            $scope.staffcompanydivision = obj.companyname;
            $scope.staffposition = obj.position;
            $scope.staffjob = obj.job;
            $scope.staffdepartment = obj.department;
            $scope.staffgroup = obj.comgroup;
            $scope.companyId = obj.companyId;
            $scope.resumearr = obj.cvpath;
            $scope.imgarr = obj.certificates;
            $scope.workqqEmail = obj.workqqEmail;
            $scope.workqqPhone = obj.workqqPhone;
            $scope.cloudUrl = obj.cloudUrl;
            $scope.cloudAccount = obj.cloudAccount;
            $scope.cloudPwd = obj.cloudPwd;
            $scope.cloudPhone = obj.cloudPhone;
            $scope.workEmailAccount = obj.workEmailAccount;
            $scope.workEmailPwd = obj.workEmailPwd;
            $scope.workEmailPhone = obj.workEmailPhone;
            $scope.skypeAccount = obj.skypeAccount;
            $scope.skypePwd = obj.skypePwd;
            $scope.skypeEmail = obj.skypeEmail;
            $scope.skypePhone = obj.skypePhone;
            $scope.facebookAccount = obj.facebookAccount;
            $scope.facebookPwd = obj.facebookPwd;
            $scope.facebookPhone = obj.facebookPhone;
            $scope.googleAccount = obj.googleAccount;
            $scope.googlePwd = obj.googlePwd;
            $scope.googlePhone = obj.googlePhone;
            console.log(obj.companyname)
            console.log($scope.staffcompanydivision)
            //首选项
            $scope.fircompany = obj.companyname;
            // console.log('省级索引',erp.findIndexByKey($scope.companyList,'name',$scope.fircompany))
            $scope.firstdepart = obj.department;
            $scope.firstgroup = obj.comgroup;
            console.log($scope.fircompany, $scope.firstdepart, $scope.firstgroup)


            $scope.residencearr = obj.residence.split(',')
            $scope.staffaccount = $scope.residencearr[3];
            $scope.firstprovice = $scope.residencearr[0]
            // console.log('省级索引', erp.findIndexByKey($scope.provinceList, 'name', $scope.firstprovice))
            var pi = erp.findIndexByKey($scope.provinceList, 'name', $scope.firstprovice)
            $scope.province = $scope.provinceList[pi];

            $scope.firstcity = $scope.residencearr[1]
            // console.log('市级索引', erp.findIndexByKey($scope.provinceList[pi].cityList, 'name', $scope.firstcity))
            var ci = erp.findIndexByKey($scope.provinceList[pi].cityList, 'name', $scope.firstcity);
            $scope.citylist = $scope.provinceList[pi].cityList;
            $scope.city = $scope.provinceList[pi].cityList[ci];


            $scope.firstarea = $scope.residencearr[2]
            // console.log('地级索引', erp.findIndexByKey2($scope.provinceList[pi].cityList[ci].areaList, $scope.firstarea))
            var ai = erp.findIndexByKey2($scope.provinceList[pi].cityList[ci].areaList, $scope.firstarea);
            $scope.arealist = $scope.provinceList[pi].cityList[ci].areaList;
            $scope.area = $scope.provinceList[pi].cityList[ci].areaList[ai];
            erp.postFun('app/employee/companyinfo', null, xlo, err)
            // console.log('公司级索引',erp.findIndexByKey($scope.companyList,'companyName',$scope.fircompany))
            // var ci=erp.findIndexByKey($scope.companyList,'companyName',$scope.fircompany);
            // $scope.staffcompanydivision=$scope.companyList[ci];
            //
            //
            //
            // // console.log('部门级索引',erp.findIndexByKey($scope.companyList[ci].departments,'department', $scope.firstdepart))
            // var di=erp.findIndexByKey($scope.companyList[ci].departments,'department', $scope.firstdepart);
            // $scope.departmentlist=$scope.companyList[ci].departments
            // $scope.staffdepartment=$scope.companyList[ci].departments[di];
            // // console.log('组级索引',erp.findIndexByKey($scope.companyList[ci].departments[di].group,'comgroup', $scope.firstgroup))
            // var gi=erp.findIndexByKey($scope.companyList[ci].departments[di].group,'comgroup', $scope.firstgroup)
            // $scope.groupList=$scope.companyList[ci].departments[di].group;
            // $scope.staffgroup=$scope.companyList[ci].departments[di].group[gi]
            // //
        }

        function err(n) {
            layer.msg('信息获取失败')
        }

        //年龄计算
        $scope.idcardchange = function () {
            console.log($scope.staffidcard)

            if ($scope.staffidcard) {
                var date = new Date;
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var str1 = $scope.staffidcard + '';
                var age = year - str1.substring(6, 10);
                if (month - str1.substring(11, 12) < 0) {
                    age -= 1;
                }
                var str = age + '岁 (' + str1.substring(6, 10) + "-" + str1.substring(10, 12) + ')';
                console.log(str)
                $scope.staffagestr = str;
                $scope.staffage = str1.substring(6, 14);
            }
        }
        //获取公司
        $scope.companyget = function (company) {
            console.log(company)
            if (company) {
                $scope.departmentlist = company.departments;
            } else {
                $scope.departmentlist = [];
                $scope.groupList = [];
            }
        }
        //获取部门
        $scope.departmentget = function (department) {
            console.log(department)
            if (department) {
                $scope.groupList = department.group
            } else {
                $scope.groupList = [];
            }
        }
        //    获取小组
        $scope.groupget = function (item) {
            console.log(item)
            if (item) {
                $scope.companyId = item.id;
            }
        }
        //工作经历获取
        $scope.workxparr = [];
        $scope.addworkxp = function () {
            $scope.workstart = $scope.workstart1 + ' - ' + $scope.workstart2;
            if ($scope.workxparr == "undefined") {
                $scope.workxparr = [];
                var obj = {}
                obj.start = $scope.workstart;
                obj.company = $scope.workcompany;
                obj.time = $scope.worktime;
                $scope.workxparr.push(obj);
                $scope.workstart1 = '';
                $scope.workstart2 = '';
                $scope.workcompany = '';
                $scope.worktime = '';
            } else {
                var obj = {}
                obj.start = $scope.workstart;
                obj.company = $scope.workcompany;
                obj.time = $scope.worktime;
                $scope.workxparr.push(obj);
                $scope.workstart1 = '';
                $scope.workstart2 = '';
                $scope.workcompany = '';
                $scope.worktime = '';
            }
        }
        $scope.delworkxp = function (index) {
            $scope.workxparr.splice(index, 1)
        }
        //历史表现获取
        $scope.BXlist = [];
        $scope.addBX = function () {
            console.log($scope.BXlist)
            if (!$scope.BXlist) {
                $scope.BXlist = [];
                var obj = {}
                obj.time = $scope.time;
                obj.type = $scope.type;
                obj.cause = $scope.cause;
                console.log(obj)
                $scope.BXlist.push(obj);
                $scope.time = '';
                $scope.type = '';
                $scope.cause = '';
            } else {
                var obj = {}
                obj.time = $scope.time;
                obj.type = $scope.type;
                obj.cause = $scope.cause;
                console.log(obj)
                $scope.BXlist.push(obj);
                $scope.time = '';
                $scope.type = '';
                $scope.cause = '';
            }
        }
        $scope.delBX = function (index) {
            $scope.BXlist.splice(index, 1)
        }

        //验证
        function verification() {
            if (!$scope.staffname) {
                $scope.staffnameState = true;
            } else {
                $scope.staffnameState = false;
            }
            if (!$scope.staffsex) {
                $scope.staffsexState = true;
            } else {
                $scope.staffsexState = false;
            }
            if (!$scope.staffhiredate) {
                $scope.staffhiredateState = true;
            } else {
                $scope.staffhiredateState = false;
            }
            if (!$scope.staffage) {
                $scope.staffagestrState = true;
            } else {
                $scope.staffagestrState = false;
            }
            if (!$scope.stafftel || !$scope.stafftel_qh) {
                $scope.stafftelState = true;
            } else {
                $scope.stafftelState = false;
            }
            if (!$scope.companyId) {
                $scope.staffgroupState = true;
            } else {
                $scope.staffgroupState = false;
            }
            if (!$scope.staffidcard) {
                $scope.staffidcardState = true;
            } else {
                $scope.staffidcardState = false;
            }
            if (!$scope.staffcompanydivision) {
                $scope.staffcompanydivisionState = true;
            } else {
                $scope.staffcompanydivisionState = false;
            }
            if (!$scope.staffdepartment) {
                $scope.staffdepartmentState = true;
            } else {
                $scope.staffdepartmentState = false;
            }
            if (!$scope.staffaccount) {
                $scope.staffaccountState = true;
            } else {
                $scope.staffaccountState = false;
            }
            $scope.staffEmailFlag = !$scope.staffemail
            if (!$scope.staffnameState && !$scope.staffsexState && !$scope.staffhiredateState &&
                    !$scope.staffagestrState && !$scope.staffgroupState && !$scope.staffidcardState &&
                    !$scope.stafftelState && !$scope.staffcompanydivisionState && !$scope.staffdepartmentState && !$scope.staffaccountState &&
                    !$scope.staffEmailFlag
            ) {
                return true;
            } else {
                layer.msg('带*号为必填项，请填写完整！')
                return false;
            }
        }

        //获取区号
        $scope.countries = null;

        erp.getFun('app/account/countrylist', function (n) {
            if (n.data.statusCode == 200) {
               $scope.countries = JSON.parse(n.data.result);
            } else {
               layer.msg("Get the country list error");
            }
        });

        $scope.determine = function () {
            if (verification()) {
                var obj = {};
                console.log($scope.staffhiredate)
                obj.id = userId;
                obj.name = $scope.staffname;
                obj.nameEN = $scope.staffnameen;
                obj.sex = $scope.staffsex;
                obj.residence = $scope.province.name + "," + $scope.city.name + "," + $scope.area + "," + $scope.staffaccount;
                obj.IDCard = $scope.staffidcard;
                obj.age = $scope.staffage;
                obj.hiredate = $scope.staffhiredate;
                obj.education = $scope.staffeducation;
                obj.school = $scope.staffschool;
                obj.major = $scope.staffprofession;
                obj.politicalvisage = $scope.staffpoliticalstatus;
                obj.maritalstatus = $scope.staffmarriage;
                obj.phone = $scope.stafftel_qh + '-'+ $scope.stafftel;
                obj.email = $scope.staffemail;
                obj.wechat = $scope.staffwechat;
                obj.workqq = $scope.staffqq;
                obj.workqqpassword = $scope.staffqqpassword;
                obj.workexp = JSON.stringify($scope.workxparr);
                obj.historicalRecords = JSON.stringify($scope.BXlist);
                obj.newaddress = $scope.staffaddress;
                obj.companyId = $scope.companyId;
                obj.position = $scope.staffposition;
                obj.job = $scope.staffjob;
                obj.companyname = $scope.staffcompanydivision.companyName;
                obj.department = $scope.staffdepartment.department;
                obj.headPortrait = $scope.headimg;
                obj.certificates = $scope.imgarr;
                obj.cvpath = $scope.resumearr;
                obj.workqqEmail = $scope.workqqEmail;
                obj.workqqPhone = $scope.workqqPhone;
                obj.cloudUrl = $scope.cloudUrl;
                obj.cloudAccount = $scope.cloudAccount;
                obj.cloudPwd = $scope.cloudPwd;
                obj.cloudPhone = $scope.cloudPhone;
                obj.workEmailAccount = $scope.workEmailAccount;
                obj.workEmailPwd = $scope.workEmailPwd;
                obj.workEmailPhone = $scope.workEmailPhone;
                obj.skypeAccount = $scope.skypeAccount;
                obj.skypePwd = $scope.skypePwd;
                obj.skypeEmail = $scope.skypeEmail;
                obj.skypePhone = $scope.skypePhone;
                obj.facebookAccount = $scope.facebookAccount;
                obj.facebookPwd = $scope.facebookPwd;
                obj.facebookPhone = $scope.facebookPhone;
                obj.googleAccount = $scope.googleAccount;
                obj.googlePwd = $scope.googlePwd;
                obj.googlePhone = $scope.googlePhone;
                console.log(obj)
                var str = JSON.stringify(obj)
                if (!$scope.subSate) {
                    $scope.subSate = true;
                    erp.postFun('app/employee/updatestaffrecord', {"data": "" + str}, dte, err)
                } else {
                    layer.msg('正在提交，请勿重复提交！')
                }

                function dte(n) {
                    if (n.data.statusCode == 200) {
                        layer.msg('修改成功')
                        $scope.subSate = false;
                        $location.path('/staff/stafffiles')
                    } else if (n.data.statusCode == 509) {
                        $scope.staffnameenState = true;
                        $scope.subSate = false;
                        layer.msg('英文名重复，请重新输入')
                    } else {
                        $scope.subSate = false;
                        layer.msg('修改失败')
                    }
                    // layer.msg('修改成功');
                    // $scope.subSate = false;
                    // $location.path('/staff/stafffiles')
                }

                function err(n) {
                    layer.msg('修改失败')
                }
            }

        }
    }])
    //添加新员工
    app.controller('stafffilesaddCtrl', ['$scope', 'erp', '$location', '$timeout', function ($scope, erp, $location, $timeout) {
        console.log('stafffilesaddCtrl')
        $scope.window = false;
        $scope.province = '请选择省份';
        $scope.provinceList = [
            /*     {
             name: '请选择省份', cityList: [
             {name: '请选择城市', areaList: ['请选择区县']}
           ]
           },*/
            {
                name: '北京', cityList: [
                    {
                        name: '市辖区',
                        areaList: ['东城区', '西城区', '崇文区', '宣武区', '朝阳区', '丰台区', '石景山区', '海淀区', '门头沟区', '房山区', '通州区', '顺义区', '昌平区', '大兴区', '怀柔区', '平谷区']
                    },
                    {name: '县', areaList: ['密云县', '延庆县']}
                ]
            },
            {
                name: '上海', cityList: [
                    {
                        name: '市辖区',
                        areaList: ['黄浦区', '卢湾区', '徐汇区', '长宁区', '静安区', '普陀区', '闸北区', '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区', '浦东新区', '金山区', '松江区', '青浦区', '南汇区', '奉贤区']
                    },
                    {name: '县', areaList: ['崇明县']}
                ]
            },
            {
                name: '天津', cityList: [
                    {
                        name: '市辖区',
                        areaList: ['和平区', '河东区', '河西区', '南开区', '河北区', '红桥区', '塘沽区', '汉沽区', '大港区', '东丽区', '西青区', '津南区', '北辰区', '武清区', '宝坻区']
                    },
                    {name: '县', areaList: ['宁河县', '静海县', '蓟　县']}
                ]
            },
            {
                name: '重庆', cityList: [
                    {
                        name: '市辖区',
                        areaList: ['万州区', '涪陵区', '渝中区', '大渡口区', '江北区', '沙坪坝区', '九龙坡区', '南岸区', '北碚区', '万盛区', '双桥区', '渝北区', '巴南区', '黔江区', '长寿区']
                    },
                    {
                        name: '县',
                        areaList: ['綦江县', '潼南县', '铜梁县', '大足县', '荣昌县', '璧山县', '梁平县', '城口县', '丰都县', '垫江县', '武隆县', '忠　县', '开　县', '云阳县', '奉节县', '巫山县', '巫溪县', '石柱土家族自治县', '秀山土家族苗族自治县', '酉阳土家族苗族自治县', '彭水苗族土家族自治县']
                    },
                    {name: '市', areaList: ['江津市', '合川市', '永川市', '南川市']}
                ]
            },
            {
                name: '四川', cityList: [
                    {
                        name: '成都市',
                        areaList: ['市辖区', '锦江区', '青羊区', '金牛区', '武侯区', '成华区', '龙泉驿区', '青白江区', '新都区', '温江县', '金堂县', '双流县', '郫　县', '大邑县', '蒲江县', '新津县', '都江堰市', '彭州市', '邛崃市', '崇州市']
                    },
                    {name: '自贡市', areaList: ['市辖区', '自流井区', '贡井区', '大安区', '沿滩区', '荣　县', '富顺县']},
                    {name: '攀枝花市', areaList: ['市辖区', '东　区', '西　区', '仁和区', '米易县', '盐边县']},
                    {name: '泸州市', areaList: ['市辖区', '江阳区', '纳溪区', '龙马潭区', '泸　县', '合江县', '叙永县', '古蔺县']},
                    {name: '德阳市', areaList: ['市辖区', '旌阳区', '中江县', '罗江县', '广汉市', '什邡市', '绵竹市']},
                    {name: '绵阳市', areaList: ['市辖区', '涪城区', '游仙区', '三台县', '盐亭县', '安　县', '梓潼县', '北川羌族自治县', '平武县', '江油市']},
                    {name: '广元市', areaList: ['市辖区', '市中区', '元坝区', '朝天区', '旺苍县', '青川县', '剑阁县', '苍溪县']},
                    {name: '遂宁市', areaList: ['市辖区', '船山区', '安居区', '蓬溪县', '射洪县', '大英县']},
                    {name: '内江市', areaList: ['市辖区', '市中区', '东兴区', '威远县', '资中县', '隆昌县']},
                    {
                        name: '乐山市',
                        areaList: ['市辖区', '市中区', '沙湾区', '五通桥区', '金口河区', '犍为县', '井研县', '夹江县', '沐川县', '峨边彝族自治县', '马边彝族自治县', '峨眉山市']
                    },
                    {name: '南充市', areaList: ['市辖区', '顺庆区', '高坪区', '嘉陵区', '南部县', '营山县', '蓬安县', '仪陇县', '西充县', '阆中市']},
                    {name: '眉山市', areaList: ['市辖区', '东坡区', '仁寿县', '彭山县', '洪雅县', '丹棱县', '青神县']},
                    {
                        name: '宜宾市',
                        areaList: ['市辖区', '翠屏区', '宜宾县', '南溪县', '江安县', '长宁县', '高　县', '珙　县', '筠连县', '兴文县', '屏山县']
                    },
                    {name: '广安市', areaList: ['市辖区', '广安区', '岳池县', '武胜县', '邻水县', '华莹市']},
                    {name: '达州市', areaList: ['市辖区', '通川区', '达　县', '宣汉县', '开江县', '大竹县', '渠　县', '万源市']},
                    {name: '雅安市', areaList: ['市辖区', '雨城区', '名山县', '荥经县', '汉源县', '石棉县', '天全县', '芦山县', '宝兴县']},
                    {name: '巴中市', areaList: ['市辖区', '巴州区', '通江县', '南江县', '平昌县']},
                    {name: '资阳市', areaList: ['市辖区', '雁江区', '安岳县', '乐至县', '简阳市']},
                    {
                        name: '阿坝藏族羌族自治州',
                        areaList: ['汶川县', '理　县', '茂　县', '松潘县', '九寨沟县', '金川县', '小金县', '黑水县', '马尔康县', '壤塘县', '阿坝县', '若尔盖县', '红原县']
                    },
                    {
                        name: '甘孜藏族自治州',
                        areaList: ['康定县', '泸定县', '丹巴县', '九龙县', '雅江县', '道孚县', '炉霍县', '甘孜县', '新龙县', '德格县', '白玉县', '石渠县', '色达县', '理塘县', '巴塘县', '乡城县', '稻城县', '得荣县']
                    },
                    {
                        name: '凉山彝族自治州',
                        areaList: ['西昌市', '木里藏族自治县', '盐源县', '德昌县', '会理县', '会东县', '宁南县', '普格县', '布拖县', '金阳县', '昭觉县', '喜德县', '冕宁县', '越西县', '甘洛县', '美姑县', '雷波县']
                    }
                ]
            },
            {
                name: '贵州', cityList: [
                    {
                        name: '贵阳市',
                        areaList: ['市辖区', '南明区', '云岩区', '花溪区', '乌当区', '白云区', '小河区', '开阳县', '息烽县', '修文县', '清镇市']
                    },
                    {name: '六盘水市', areaList: ['钟山区', '六枝特区', '水城县', '盘　县']},
                    {
                        name: '遵义市',
                        areaList: ['市辖区', '红花岗区', '汇川区', '遵义县', '桐梓县', '绥阳县', '正安县', '道真仡佬族苗族自治县', '务川仡佬族苗族自治县', '凤冈县', '湄潭县', '余庆县', '习水县', '赤水市', '仁怀市']
                    },
                    {name: '安顺市', areaList: ['市辖区', '西秀区', '平坝县', '普定县', '镇宁布依族苗族自治县', '关岭布依族苗族自治县', '紫云苗族布依族自治县']},
                    {
                        name: '铜仁地区',
                        areaList: ['铜仁市', '江口县', '玉屏侗族自治县', '石阡县', '思南县', '印江土家族苗族自治县', '德江县', '沿河土家族自治县', '松桃苗族自治县', '万山特区']
                    },
                    {name: '黔西南布依族苗族自治州', areaList: ['兴义市', '兴仁县', '普安县', '晴隆县', '贞丰县', '望谟县', '册亨县', '安龙县']},
                    {name: '毕节地区', areaList: ['毕节市', '大方县', '黔西县', '金沙县', '织金县', '纳雍县', '威宁彝族回族苗族自治县', '赫章县']},
                    {
                        name: '黔东南苗族侗族自治州',
                        areaList: ['凯里市', '黄平县', '施秉县', '三穗县', '镇远县', '岑巩县', '天柱县', '锦屏县', '剑河县', '台江县', '黎平县', '榕江县', '从江县', '雷山县', '麻江县', '丹寨县']
                    },
                    {
                        name: '黔南布依族苗族自治州',
                        areaList: ['都匀市', '福泉市', '荔波县', '贵定县', '瓮安县', '独山县', '平塘县', '罗甸县', '长顺县', '龙里县', '惠水县', '三都水族自治县']
                    }
                ]
            },
            {
                name: '云南', cityList: [
                    {
                        name: '昆明市',
                        areaList: ['市辖区', '五华区', '盘龙区', '官渡区', '西山区', '东川区', '呈贡县', '晋宁县', '富民县', '宜良县', '石林彝族自治县', '嵩明县', '禄劝彝族苗族自治县', '寻甸回族彝族自治县', '安宁市']
                    },
                    {name: '曲靖市', areaList: ['市辖区', '麒麟区', '马龙县', '陆良县', '师宗县', '罗平县', '富源县', '会泽县', '沾益县', '宣威市']},
                    {
                        name: '玉溪市',
                        areaList: ['市辖区', '红塔区', '江川县', '澄江县', '通海县', '华宁县', '易门县', '峨山彝族自治县', '新平彝族傣族自治县', '元江哈尼族彝族傣族自治县']
                    },
                    {name: '保山市', areaList: ['市辖区', '隆阳区', '施甸县', '腾冲县', '龙陵县', '昌宁县']},
                    {
                        name: '昭通市',
                        areaList: ['市辖区', '昭阳区', '鲁甸县', '巧家县', '盐津县', '大关县', '永善县', '绥江县', '镇雄县', '彝良县', '威信县', '水富县']
                    },
                    {name: '丽江市', areaList: ['市辖区', '古城区', '玉龙纳西族自治县', '永胜县', '华坪县', '宁蒗彝族自治县']},
                    {
                        name: '思茅市',
                        areaList: ['市辖区', '翠云区', '普洱哈尼族彝族自治县', '墨江哈尼族自治县', '景东彝族自治县', '景谷傣族彝族自治县', '镇沅彝族哈尼族拉祜族自治县', '江城哈尼族彝族自治县', '孟连傣族拉祜族佤族自治县', '澜沧拉祜族自治县', '西盟佤族自治县']
                    },
                    {
                        name: '临沧市',
                        areaList: ['市辖区', '临翔区', '凤庆县', '云　县', '永德县', '镇康县', '双江拉祜族佤族布朗族傣族自治县', '耿马傣族佤族自治县', '沧源佤族自治县']
                    },
                    {name: '楚雄彝族自治州', areaList: ['楚雄市', '双柏县', '牟定县', '南华县', '姚安县', '大姚县', '永仁县', '元谋县', '武定县', '禄丰县']},
                    {
                        name: '红河哈尼族彝族自治州',
                        areaList: ['个旧市', '开远市', '蒙自县', '屏边苗族自治县', '建水县', '石屏县', '弥勒县', '泸西县', '元阳县', '红河县', '金平苗族瑶族傣族自治县', '绿春县', '河口瑶族自治县']
                    },
                    {name: '文山壮族苗族自治州', areaList: ['文山县', '砚山县', '西畴县', '麻栗坡县', '马关县', '丘北县', '广南县', '富宁县']},
                    {name: '西双版纳傣族自治州', areaList: ['景洪市', '勐海县', '勐腊县']},
                    {
                        name: '大理白族自治州',
                        areaList: ['大理市', '漾濞彝族自治县', '祥云县', '宾川县', '弥渡县', '南涧彝族自治县', '巍山彝族回族自治县', '永平县', '云龙县', '洱源县', '剑川县', '鹤庆县']
                    },
                    {name: '德宏傣族景颇族自治州', areaList: ['瑞丽市', '潞西市', '梁河县', '盈江县', '陇川县']},
                    {name: '怒江傈僳族自治州', areaList: ['泸水县', '福贡县', '贡山独龙族怒族自治县', '兰坪白族普米族自治县']},
                    {name: '迪庆藏族自治州', areaList: ['香格里拉县', '德钦县', '维西傈僳族自治县']}
                ]
            },
            {
                name: '西藏', cityList: [
                    {name: '拉萨市', areaList: ['市辖区', '城关区', '林周县', '当雄县', '尼木县', '曲水县', '堆龙德庆县', '达孜县', '墨竹工卡县']},
                    {
                        name: '昌都地区',
                        areaList: ['昌都县', '江达县', '贡觉县', '类乌齐县', '丁青县', '察雅县', '八宿县', '左贡县', '芒康县', '洛隆县', '边坝县']
                    },
                    {
                        name: '山南地区',
                        areaList: ['乃东县', '扎囊县', '贡嘎县', '桑日县', '琼结县', '曲松县', '措美县', '洛扎县', '加查县', '隆子县', '错那县', '浪卡子县']
                    },
                    {
                        name: '日喀则地区',
                        areaList: ['日喀则市', '南木林县', '江孜县', '定日县', '萨迦县', '拉孜县', '昂仁县', '谢通门县', '白朗县', '仁布县', '康马县', '定结县', '仲巴县', '亚东县', '吉隆县', '聂拉木县', '萨嘎县', '岗巴县']
                    },
                    {name: '那曲地区', areaList: ['那曲县', '嘉黎县', '比如县', '聂荣县', '安多县', '申扎县', '索　县', '班戈县', '巴青县', '尼玛县']},
                    {name: '阿里地区', areaList: ['普兰县', '札达县', '噶尔县', '日土县', '革吉县', '改则县', '措勤县']},
                    {name: '林芝地区', areaList: ['林芝县', '工布江达县', '米林县', '墨脱县', '波密县', '察隅县', '朗　县']}
                ]
            },
            {
                name: '河南', cityList: [
                    {
                        name: '郑州市',
                        areaList: ['市辖区', '中原区', '二七区', '管城回族区', '金水区', '上街区', '邙山区', '中牟县', '巩义市', '荥阳市', '新密市', '新郑市', '登封市']
                    },
                    {
                        name: '开封市',
                        areaList: ['市辖区', '龙亭区', '顺河回族区', '鼓楼区', '南关区', '郊　区', '杞　县', '通许县', '尉氏县', '开封县', '兰考县']
                    },
                    {
                        name: '洛阳市',
                        areaList: ['市辖区', '老城区', '西工区', '廛河回族区', '涧西区', '吉利区', '洛龙区', '孟津县', '新安县', '栾川县', '嵩　县', '汝阳县', '宜阳县', '洛宁县', '伊川县', '偃师市']
                    },
                    {
                        name: '平顶山市',
                        areaList: ['市辖区', '新华区', '卫东区', '石龙区', '湛河区', '宝丰县', '叶　县', '鲁山县', '郏　县', '舞钢市', '汝州市']
                    },
                    {name: '安阳市', areaList: ['市辖区', '文峰区', '北关区', '殷都区', '龙安区', '安阳县', '汤阴县', '滑　县', '内黄县', '林州市']},
                    {name: '鹤壁市', areaList: ['市辖区', '鹤山区', '山城区', '淇滨区', '浚　县', '淇　县']},
                    {
                        name: '新乡市',
                        areaList: ['市辖区', '红旗区', '卫滨区', '凤泉区', '牧野区', '新乡县', '获嘉县', '原阳县', '延津县', '封丘县', '长垣县', '卫辉市', '辉县市']
                    },
                    {
                        name: '焦作市',
                        areaList: ['市辖区', '解放区', '中站区', '马村区', '山阳区', '修武县', '博爱县', '武陟县', '温　县', '济源市', '沁阳市', '孟州市']
                    },
                    {name: '濮阳市', areaList: ['市辖区', '华龙区', '清丰县', '南乐县', '范　县', '台前县', '濮阳县']},
                    {name: '许昌市', areaList: ['市辖区', '魏都区', '许昌县', '鄢陵县', '襄城县', '禹州市', '长葛市']},
                    {name: '漯河市', areaList: ['市辖区', '源汇区', '郾城区', '召陵区', '舞阳县', '临颍县']},
                    {name: '三门峡市', areaList: ['市辖区', '湖滨区', '渑池县', '陕　县', '卢氏县', '义马市', '灵宝市']},
                    {
                        name: '南阳市',
                        areaList: ['市辖区', '宛城区', '卧龙区', '南召县', '方城县', '西峡县', '镇平县', '内乡县', '淅川县', '社旗县', '唐河县', '新野县', '桐柏县', '邓州市']
                    },
                    {name: '商丘市', areaList: ['市辖区', '梁园区', '睢阳区', '民权县', '睢　县', '宁陵县', '柘城县', '虞城县', '夏邑县', '永城市']},
                    {
                        name: '信阳市',
                        areaList: ['市辖区', '师河区', '平桥区', '罗山县', '光山县', '新　县', '商城县', '固始县', '潢川县', '淮滨县', '息　县']
                    },
                    {
                        name: '周口市',
                        areaList: ['市辖区', '川汇区', '扶沟县', '西华县', '商水县', '沈丘县', '郸城县', '淮阳县', '太康县', '鹿邑县', '项城市']
                    },
                    {
                        name: '驻马店市',
                        areaList: ['市辖区', '驿城区', '西平县', '上蔡县', '平舆县', '正阳县', '确山县', '泌阳县', '汝南县', '遂平县', '新蔡县']
                    }
                ]
            },
            {
                name: '湖北', cityList: [
                    {
                        name: '武汉市',
                        areaList: ['市辖区', '江岸区', '江汉区', '乔口区', '汉阳区', '武昌区', '青山区', '洪山区', '东西湖区', '汉南区', '蔡甸区', '江夏区', '黄陂区', '新洲区']
                    },
                    {name: '黄石市', areaList: ['市辖区', '黄石港区', '西塞山区', '下陆区', '铁山区', '阳新县', '大冶市']},
                    {name: '十堰市', areaList: ['市辖区', '茅箭区', '张湾区', '郧　县', '郧西县', '竹山县', '竹溪县', '房　县', '丹江口市']},
                    {
                        name: '宜昌市',
                        areaList: ['市辖区', '西陵区', '伍家岗区', '点军区', '猇亭区', '夷陵区', '远安县', '兴山县', '秭归县', '长阳土家族自治县', '五峰土家族自治县', '宜都市', '当阳市', '枝江市']
                    },
                    {name: '襄樊市', areaList: ['市辖区', '襄城区', '樊城区', '襄阳区', '南漳县', '谷城县', '保康县', '老河口市', '枣阳市', '宜城市']},
                    {name: '鄂州市', areaList: ['市辖区', '梁子湖区', '华容区', '鄂城区']},
                    {name: '荆门市', areaList: ['市辖区', '东宝区', '掇刀区', '京山县', '沙洋县', '钟祥市']},
                    {name: '孝感市', areaList: ['市辖区', '孝南区', '孝昌县', '大悟县', '云梦县', '应城市', '安陆市', '汉川市']},
                    {name: '荆州市', areaList: ['市辖区', '沙市区', '荆州区', '公安县', '监利县', '江陵县', '石首市', '洪湖市', '松滋市']},
                    {
                        name: '黄冈市',
                        areaList: ['市辖区', '黄州区', '团风县', '红安县', '罗田县', '英山县', '浠水县', '蕲春县', '黄梅县', '麻城市', '武穴市']
                    },
                    {name: '咸宁市', areaList: ['市辖区', '咸安区', '嘉鱼县', '通城县', '崇阳县', '通山县', '赤壁市']},
                    {name: '随州市', areaList: ['市辖区', '曾都区', '广水市']},
                    {name: '恩施土家族苗族自治州', areaList: ['恩施市', '利川市', '建始县', '巴东县', '宣恩县', '咸丰县', '来凤县', '鹤峰县']},
                    {name: '省直辖行政单位', areaList: ['仙桃市', '潜江市', '天门市', '神农架林区']}
                ]
            },
            {
                name: '湖南', cityList: [
                    {name: '长沙市', areaList: ['市辖区', '芙蓉区', '天心区', '岳麓区', '开福区', '雨花区', '长沙县', '望城县', '宁乡县', '浏阳市']},
                    {name: '株洲市', areaList: ['市辖区', '荷塘区', '芦淞区', '石峰区', '天元区', '株洲县', '攸　县', '茶陵县', '炎陵县', '醴陵市']},
                    {name: '湘潭市', areaList: ['市辖区', '雨湖区', '岳塘区', '湘潭县', '湘乡市', '韶山市']},
                    {
                        name: '衡阳市',
                        areaList: ['市辖区', '珠晖区', '雁峰区', '石鼓区', '蒸湘区', '南岳区', '衡阳县', '衡南县', '衡山县', '衡东县', '祁东县', '耒阳市', '常宁市']
                    },
                    {
                        name: '邵阳市',
                        areaList: ['市辖区', '双清区', '大祥区', '北塔区', '邵东县', '新邵县', '邵阳县', '隆回县', '洞口县', '绥宁县', '新宁县', '城步苗族自治县', '武冈市']
                    },
                    {name: '岳阳市', areaList: ['市辖区', '岳阳楼区', '云溪区', '君山区', '岳阳县', '华容县', '湘阴县', '平江县', '汨罗市', '临湘市']},
                    {name: '常德市', areaList: ['市辖区', '武陵区', '鼎城区', '安乡县', '汉寿县', '澧　县', '临澧县', '桃源县', '石门县', '津市市']},
                    {name: '张家界市', areaList: ['市辖区', '永定区', '武陵源区', '慈利县', '桑植县']},
                    {name: '益阳市', areaList: ['市辖区', '资阳区', '赫山区', '南　县', '桃江县', '安化县', '沅江市']},
                    {
                        name: '郴州市',
                        areaList: ['市辖区', '北湖区', '苏仙区', '桂阳县', '宜章县', '永兴县', '嘉禾县', '临武县', '汝城县', '桂东县', '安仁县', '资兴市']
                    },
                    {
                        name: '永州市',
                        areaList: ['市辖区', '芝山区', '冷水滩区', '祁阳县', '东安县', '双牌县', '道　县', '江永县', '宁远县', '蓝山县', '新田县', '江华瑶族自治县']
                    },
                    {
                        name: '怀化市',
                        areaList: ['市辖区', '鹤城区', '中方县', '沅陵县', '辰溪县', '溆浦县', '会同县', '麻阳苗族自治县', '新晃侗族自治县', '芷江侗族自治县', '靖州苗族侗族自治县', '通道侗族自治县', '洪江市']
                    },
                    {name: '娄底市', areaList: ['市辖区', '娄星区', '双峰县', '新化县', '冷水江市', '涟源市']},
                    {name: '湘西土家族苗族自治州', areaList: ['吉首市', '泸溪县', '凤凰县', '花垣县', '保靖县', '古丈县', '永顺县', '龙山县']}
                ]
            },
            {
                name: '广东', cityList: [
                    {
                        name: '广州市',
                        areaList: ['市辖区', '东山区', '荔湾区', '越秀区', '海珠区', '天河区', '芳村区', '白云区', '黄埔区', '番禺区', '花都区', '增城市', '从化市']
                    },
                    {
                        name: '韶关市',
                        areaList: ['市辖区', '武江区', '浈江区', '曲江区', '始兴县', '仁化县', '翁源县', '乳源瑶族自治县', '新丰县', '乐昌市', '南雄市']
                    },
                    {name: '深圳市', areaList: ['市辖区', '罗湖区', '福田区', '南山区', '宝安区', '龙岗区', '盐田区']},
                    {name: '珠海市', areaList: ['市辖区', '香洲区', '斗门区', '金湾区']},
                    {name: '汕头市', areaList: ['市辖区', '龙湖区', '金平区', '濠江区', '潮阳区', '潮南区', '澄海区', '南澳县']},
                    {name: '佛山市', areaList: ['市辖区', '禅城区', '南海区', '顺德区', '三水区', '高明区']},
                    {name: '江门市', areaList: ['市辖区', '蓬江区', '江海区', '新会区', '台山市', '开平市', '鹤山市', '恩平市']},
                    {name: '湛江市', areaList: ['市辖区', '赤坎区', '霞山区', '坡头区', '麻章区', '遂溪县', '徐闻县', '廉江市', '雷州市', '吴川市']},
                    {name: '茂名市', areaList: ['市辖区', '茂南区', '茂港区', '电白县', '高州市', '化州市', '信宜市']},
                    {name: '肇庆市', areaList: ['市辖区', '端州区', '鼎湖区', '广宁县', '怀集县', '封开县', '德庆县', '高要市', '四会市']},
                    {name: '惠州市', areaList: ['市辖区', '惠城区', '惠阳区', '博罗县', '惠东县', '龙门县']},
                    {name: '梅州市', areaList: ['市辖区', '梅江区', '梅　县', '大埔县', '丰顺县', '五华县', '平远县', '蕉岭县', '兴宁市']},
                    {name: '汕尾市', areaList: ['市辖区', '城　区', '海丰县', '陆河县', '陆丰市']},
                    {name: '河源市', areaList: ['市辖区', '源城区', '紫金县', '龙川县', '连平县', '和平县', '东源县']},
                    {name: '阳江市', areaList: ['市辖区', '江城区', '阳西县', '阳东县', '阳春市']},
                    {name: '清远市', areaList: ['市辖区', '清城区', '佛冈县', '阳山县', '连山壮族瑶族自治县', '连南瑶族自治县', '清新县', '英德市', '连州市']},
                    {name: '东莞市', areaList: ['东莞市']},
                    {name: '中山市', areaList: ['中山市']},
                    {name: '潮州市', areaList: ['市辖区', '湘桥区', '潮安县', '饶平县']},
                    {name: '揭阳市', areaList: ['市辖区', '榕城区', '揭东县', '揭西县', '惠来县', '普宁市']},
                    {name: '云浮市', areaList: ['市辖区', '云城区', '新兴县', '郁南县', '云安县', '罗定市']}
                ]
            },
            {
                name: '广西', cityList: [
                    {
                        name: '南宁市',
                        areaList: ['市辖区', '兴宁区', '青秀区', '江南区', '西乡塘区', '良庆区', '邕宁区', '武鸣县', '隆安县', '马山县', '上林县', '宾阳县', '横　县']
                    },
                    {
                        name: '柳州市',
                        areaList: ['市辖区', '城中区', '鱼峰区', '柳南区', '柳北区', '柳江县', '柳城县', '鹿寨县', '融安县', '融水苗族自治县', '三江侗族自治县']
                    },
                    {
                        name: '桂林市',
                        areaList: ['市辖区', '秀峰区', '叠彩区', '象山区', '七星区', '雁山区', '阳朔县', '临桂县', '灵川县', '全州县', '兴安县', '永福县', '灌阳县', '龙胜各族自治县', '资源县', '平乐县', '荔蒲县', '恭城瑶族自治县']
                    },
                    {name: '梧州市', areaList: ['市辖区', '万秀区', '蝶山区', '长洲区', '苍梧县', '藤　县', '蒙山县', '岑溪市']},
                    {name: '北海市', areaList: ['市辖区', '海城区', '银海区', '铁山港区', '合浦县']},
                    {name: '防城港市', areaList: ['市辖区', '港口区', '防城区', '上思县', '东兴市']},
                    {name: '钦州市', areaList: ['市辖区', '钦南区', '钦北区', '灵山县', '浦北县']},
                    {name: '贵港市', areaList: ['市辖区', '港北区', '港南区', '覃塘区', '平南县', '桂平市']},
                    {name: '玉林市', areaList: ['市辖区', '玉州区', '容　县', '陆川县', '博白县', '兴业县', '北流市']},
                    {
                        name: '百色市',
                        areaList: ['市辖区', '右江区', '田阳县', '田东县', '平果县', '德保县', '靖西县', '那坡县', '凌云县', '乐业县', '田林县', '西林县', '隆林各族自治县']
                    },
                    {name: '贺州市', areaList: ['市辖区', '八步区', '昭平县', '钟山县', '富川瑶族自治县']},
                    {
                        name: '河池市',
                        areaList: ['市辖区', '金城江区', '南丹县', '天峨县', '凤山县', '东兰县', '罗城仫佬族自治县', '环江毛南族自治县', '巴马瑶族自治县', '都安瑶族自治县', '大化瑶族自治县', '宜州市']
                    },
                    {name: '来宾市', areaList: ['市辖区', '兴宾区', '忻城县', '象州县', '武宣县', '金秀瑶族自治县', '合山市']},
                    {name: '崇左市', areaList: ['市辖区', '江洲区', '扶绥县', '宁明县', '龙州县', '大新县', '天等县', '凭祥市']}
                ]
            },
            {
                name: '陕西', cityList: [
                    {
                        name: '西安市',
                        areaList: ['市辖区', '新城区', '碑林区', '莲湖区', '灞桥区', '未央区', '雁塔区', '阎良区', '临潼区', '长安区', '蓝田县', '周至县', '户　县', '高陵县']
                    },
                    {name: '铜川市', areaList: ['市辖区', '王益区', '印台区', '耀州区', '宜君县']},
                    {
                        name: '宝鸡市',
                        areaList: ['市辖区', '渭滨区', '金台区', '陈仓区', '凤翔县', '岐山县', '扶风县', '眉　县', '陇　县', '千阳县', '麟游县', '凤　县', '太白县']
                    },
                    {
                        name: '咸阳市',
                        areaList: ['市辖区', '秦都区', '杨凌区', '渭城区', '三原县', '泾阳县', '乾　县', '礼泉县', '永寿县', '彬　县', '长武县', '旬邑县', '淳化县', '武功县', '兴平市']
                    },
                    {
                        name: '渭南市',
                        areaList: ['市辖区', '临渭区', '华　县', '潼关县', '大荔县', '合阳县', '澄城县', '蒲城县', '白水县', '富平县', '韩城市', '华阴市']
                    },
                    {
                        name: '延安市',
                        areaList: ['市辖区', '宝塔区', '延长县', '延川县', '子长县', '安塞县', '志丹县', '吴旗县', '甘泉县', '富　县', '洛川县', '宜川县', '黄龙县', '黄陵县']
                    },
                    {
                        name: '汉中市',
                        areaList: ['市辖区', '汉台区', '南郑县', '城固县', '洋　县', '西乡县', '勉　县', '宁强县', '略阳县', '镇巴县', '留坝县', '佛坪县']
                    },
                    {
                        name: '榆林市',
                        areaList: ['市辖区', '榆阳区', '神木县', '府谷县', '横山县', '靖边县', '定边县', '绥德县', '米脂县', '佳　县', '吴堡县', '清涧县', '子洲县']
                    },
                    {
                        name: '安康市',
                        areaList: ['市辖区', '汉滨区', '汉阴县', '石泉县', '宁陕县', '紫阳县', '岚皋县', '平利县', '镇坪县', '旬阳县', '白河县']
                    },
                    {name: '商洛市', areaList: ['市辖区', '商州区', '洛南县', '丹凤县', '商南县', '山阳县', '镇安县', '柞水县']}
                ]
            },
            {
                name: '甘肃', cityList: [
                    {name: '兰州市', areaList: ['市辖区', '城关区', '七里河区', '西固区', '安宁区', '红古区', '永登县', '皋兰县', '榆中县']},
                    {name: '嘉峪关市', areaList: ['市辖区']},
                    {name: '金昌市', areaList: ['市辖区', '金川区', '永昌县']},
                    {name: '白银市', areaList: ['市辖区', '白银区', '平川区', '靖远县', '会宁县', '景泰县']},
                    {name: '天水市', areaList: ['市辖区', '秦城区', '北道区', '清水县', '秦安县', '甘谷县', '武山县', '张家川回族自治县']},
                    {name: '武威市', areaList: ['市辖区', '凉州区', '民勤县', '古浪县', '天祝藏族自治县']},
                    {name: '张掖市', areaList: ['市辖区', '甘州区', '肃南裕固族自治县', '民乐县', '临泽县', '高台县', '山丹县']},
                    {name: '平凉市', areaList: ['市辖区', '崆峒区', '泾川县', '灵台县', '崇信县', '华亭县', '庄浪县', '静宁县']},
                    {name: '酒泉市', areaList: ['市辖区', '肃州区', '金塔县', '安西县', '肃北蒙古族自治县', '阿克塞哈萨克族自治县', '玉门市', '敦煌市']},
                    {name: '庆阳市', areaList: ['市辖区', '西峰区', '庆城县', '环　县', '华池县', '合水县', '正宁县', '宁　县', '镇原县']},
                    {name: '定西市', areaList: ['市辖区', '安定区', '通渭县', '陇西县', '渭源县', '临洮县', '漳　县', '岷　县']},
                    {name: '陇南市', areaList: ['市辖区', '武都区', '成　县', '文　县', '宕昌县', '康　县', '西和县', '礼　县', '徽　县', '两当县']},
                    {
                        name: '临夏回族自治州',
                        areaList: ['临夏市', '临夏县', '康乐县', '永靖县', '广河县', '和政县', '东乡族自治县', '积石山保安族东乡族撒拉族自治县']
                    },
                    {name: '甘南藏族自治州', areaList: ['合作市', '临潭县', '卓尼县', '舟曲县', '迭部县', '玛曲县', '碌曲县', '夏河县']}
                ]
            },
            {
                name: '青海', cityList: [
                    {name: '西宁市', areaList: ['市辖区', '城东区', '城中区', '城西区', '城北区', '大通回族土族自治县', '湟中县', '湟源县']},
                    {name: '海东地区', areaList: ['平安县', '民和回族土族自治县', '乐都县', '互助土族自治县', '化隆回族自治县', '循化撒拉族自治县']},
                    {name: '海北藏族自治州', areaList: ['门源回族自治县', '祁连县', '海晏县', '刚察县']},
                    {name: '黄南藏族自治州', areaList: ['同仁县', '尖扎县', '泽库县', '河南蒙古族自治县']},
                    {name: '海南藏族自治州', areaList: ['共和县', '同德县', '贵德县', '兴海县', '贵南县']},
                    {name: '果洛藏族自治州', areaList: ['玛沁县', '班玛县', '甘德县', '达日县', '久治县', '玛多县']},
                    {name: '玉树藏族自治州', areaList: ['玉树县', '杂多县', '称多县', '治多县', '囊谦县', '曲麻莱县']},
                    {name: '海西蒙古族藏族自治州', areaList: ['格尔木市', '德令哈市', '乌兰县', '都兰县', '天峻县']}
                ]
            },
            {
                name: '宁夏', cityList: [
                    {name: '银川市', areaList: ['市辖区', '兴庆区', '西夏区', '金凤区', '永宁县', '贺兰县', '灵武市']},
                    {name: '石嘴山市', areaList: ['市辖区', '大武口区', '惠农区', '平罗县']},
                    {name: '吴忠市', areaList: ['市辖区', '利通区', '盐池县', '同心县', '青铜峡市']},
                    {name: '固原市', areaList: ['市辖区', '原州区', '西吉县', '隆德县', '泾源县', '彭阳县', '海原县']},
                    {name: '中卫市', areaList: ['市辖区', '沙坡头区', '中宁县']}
                ]
            },
            {
                name: '新疆', cityList: [
                    {name: '乌鲁木齐市', areaList: ['市辖区', '天山区', '沙依巴克区', '新市区', '水磨沟区', '头屯河区', '达坂城区', '东山区', '乌鲁木齐县']},
                    {name: '克拉玛依市', areaList: ['市辖区', '独山子区', '克拉玛依区', '白碱滩区', '乌尔禾区']},
                    {name: '吐鲁番地区', areaList: ['吐鲁番市', '鄯善县', '托克逊县']},
                    {name: '哈密地区', areaList: ['哈密市', '巴里坤哈萨克自治县', '伊吾县']},
                    {name: '昌吉回族自治州', areaList: ['昌吉市', '阜康市', '米泉市', '呼图壁县', '玛纳斯县', '奇台县', '吉木萨尔县', '木垒哈萨克自治县']},
                    {name: '博尔塔拉蒙古自治州', areaList: ['博乐市', '精河县', '温泉县']},
                    {name: '巴音郭楞蒙古自治州', areaList: ['库尔勒市', '轮台县', '尉犁县', '若羌县', '且末县', '焉耆回族自治县', '和静县', '和硕县', '博湖县']},
                    {name: '阿克苏地区', areaList: ['阿克苏市', '温宿县', '库车县', '沙雅县', '新和县', '拜城县', '乌什县', '阿瓦提县', '柯坪县']},
                    {name: '克孜勒苏柯尔克孜自治州', areaList: ['阿图什市', '阿克陶县', '阿合奇县', '乌恰县']},
                    {
                        name: '喀什地区',
                        areaList: ['喀什市', '疏附县', '疏勒县', '英吉沙县', '泽普县', '莎车县', '叶城县', '麦盖提县', '岳普湖县', '伽师县', '巴楚县', '塔什库尔干塔吉克自治县']
                    },
                    {name: '和田地区', areaList: ['和田市', '和田县', '墨玉县', '皮山县', '洛浦县', '策勒县', '于田县', '民丰县']},
                    {
                        name: '伊犁哈萨克自治州',
                        areaList: ['伊宁市', '奎屯市', '伊宁县', '察布查尔锡伯自治县', '霍城县', '巩留县', '新源县', '昭苏县', '特克斯县', '尼勒克县']
                    },
                    {name: '塔城地区', areaList: ['塔城市', '乌苏市', '额敏县', '沙湾县', '托里县', '裕民县', '和布克赛尔蒙古自治县']},
                    {name: '阿勒泰地区', areaList: ['阿勒泰市', '布尔津县', '富蕴县', '福海县', '哈巴河县', '青河县', '吉木乃县']},
                    {name: '省直辖行政单位', areaList: ['石河子市', '阿拉尔市', '图木舒克市', '五家渠市']}
                ]
            },
            {
                name: '河北', cityList: [
                    {
                        name: '石家庄市',
                        areaList: ['市辖区', '长安区', '桥东区', '桥西区', '新华区', '井陉矿区', '裕华区', '井陉县', '正定县', '栾城县', '行唐县', '灵寿县', '高邑县', '深泽县', '赞皇县', '无极县', '平山县', '元氏县', '赵　县', '辛集市', '藁城市', '晋州市', '新乐市', '鹿泉市']
                    },
                    {
                        name: '唐山市',
                        areaList: ['市辖区', '路南区', '路北区', '古冶区', '开平区', '丰南区', '丰润区', '滦　县', '滦南县', '乐亭县', '迁西县', '玉田县', '唐海县', '遵化市', '迁安市']
                    },
                    {name: '秦皇岛市', areaList: ['市辖区', '海港区', '山海关区', '北戴河区', '青龙满族自治县', '昌黎县', '抚宁县', '卢龙县']},
                    {
                        name: '邯郸市',
                        areaList: ['市辖区', '邯山区', '丛台区', '复兴区', '峰峰矿区', '邯郸县', '临漳县', '成安县', '大名县', '涉　县', '磁　县', '肥乡县', '永年县', '邱　县', '鸡泽县', '广平县', '馆陶县', '魏　县', '曲周县', '武安市']
                    },
                    {
                        name: '邢台市',
                        areaList: ['市辖区', '桥东区', '桥西区', '邢台县', '临城县', '内丘县', '柏乡县', '隆尧县', '任　县', '南和县', '宁晋县', '巨鹿县', '新河县', '广宗县', '平乡县', '威　县', '清河县', '临西县', '南宫市', '沙河市']
                    },
                    {
                        name: '保定市',
                        areaList: ['市辖区', '新市区', '北市区', '南市区', '满城县', '清苑县', '涞水县', '阜平县', '徐水县', '定兴县', '唐　县', '高阳县', '容城县', '涞源县', '望都县', '安新县', '易　县', '曲阳县', '蠡　县', '顺平县', '博野县', '雄　县', '涿州市', '定州市', '安国市', '高碑店市']
                    },
                    {
                        name: '张家口市',
                        areaList: ['市辖区', '桥东区', '桥西区', '宣化区', '下花园区', '宣化县', '张北县', '康保县', '沽源县', '尚义县', '蔚　县', '阳原县', '怀安县', '万全县', '怀来县', '涿鹿县', '赤城县', '崇礼县']
                    },
                    {
                        name: '承德市',
                        areaList: ['市辖区', '双桥区', '双滦区', '鹰手营子矿区', '承德县', '兴隆县', '平泉县', '滦平县', '隆化县', '丰宁满族自治县', '宽城满族自治县', '围场满族蒙古族自治县']
                    },
                    {
                        name: '沧州市',
                        areaList: ['市辖区', '新华区', '运河区', '沧　县', '青　县', '东光县', '海兴县', '盐山县', '肃宁县', '南皮县', '吴桥县', '献　县', '孟村回族自治县', '泊头市', '任丘市', '黄骅市', '河间市']
                    },
                    {
                        name: '廊坊市',
                        areaList: ['市辖区', '安次区', '广阳区', '固安县', '永清县', '香河县', '大城县', '文安县', '大厂回族自治县', '霸州市', '三河市']
                    },
                    {
                        name: '衡水市',
                        areaList: ['市辖区', '桃城区', '枣强县', '武邑县', '武强县', '饶阳县', '安平县', '故城县', '景　县', '阜城县', '冀州市', '深州市']
                    }
                ]
            },
            {
                name: '山西', cityList: [
                    {
                        name: '太原市',
                        areaList: ['市辖区', '小店区', '迎泽区', '杏花岭区', '尖草坪区', '万柏林区', '晋源区', '清徐县', '阳曲县', '娄烦县', '古交市']
                    },
                    {
                        name: '大同市',
                        areaList: ['市辖区', '城　区', '矿　区', '南郊区', '新荣区', '阳高县', '天镇县', '广灵县', '灵丘县', '浑源县', '左云县', '大同县']
                    },
                    {name: '阳泉市', areaList: ['市辖区', '城　区', '矿　区', '郊　区', '平定县', '盂　县']},
                    {
                        name: '长治市',
                        areaList: ['市辖区', '城　区', '郊　区', '长治县', '襄垣县', '屯留县', '平顺县', '黎城县', '壶关县', '长子县', '武乡县', '沁　县', '沁源县', '潞城市']
                    },
                    {name: '晋城市', areaList: ['市辖区', '城　区', '沁水县', '阳城县', '陵川县', '泽州县', '高平市']},
                    {name: '朔州市', areaList: ['市辖区', '朔城区', '平鲁区', '山阴县', '应　县', '右玉县', '怀仁县']},
                    {
                        name: '晋中市',
                        areaList: ['市辖区', '榆次区', '榆社县', '左权县', '和顺县', '昔阳县', '寿阳县', '太谷县', '祁　县', '平遥县', '灵石县', '介休市']
                    },
                    {
                        name: '运城市',
                        areaList: ['市辖区', '盐湖区', '临猗县', '万荣县', '闻喜县', '稷山县', '新绛县', '绛　县', '垣曲县', '夏　县', '平陆县', '芮城县', '永济市', '河津市']
                    },
                    {
                        name: '忻州市',
                        areaList: ['市辖区', '忻府区', '定襄县', '五台县', '代　县', '繁峙县', '宁武县', '静乐县', '神池县', '五寨县', '岢岚县', '河曲县', '保德县', '偏关县', '原平市']
                    },
                    {
                        name: '临汾市',
                        areaList: ['市辖区', '尧都区', '曲沃县', '翼城县', '襄汾县', '洪洞县', '古　县', '安泽县', '浮山县', '吉　县', '乡宁县', '大宁县', '隰　县', '永和县', '蒲　县', '汾西县', '侯马市', '霍州市']
                    },
                    {
                        name: '吕梁市',
                        areaList: ['市辖区', '离石区', '文水县', '交城县', '兴　县', '临　县', '柳林县', '石楼县', '岚　县', '方山县', '中阳县', '交口县', '孝义市', '汾阳市']
                    }
                ]
            },
            {
                name: '内蒙古', cityList: [
                    {
                        name: '呼和浩特市',
                        areaList: ['市辖区', '新城区', '回民区', '玉泉区', '赛罕区', '土默特左旗', '托克托县', '和林格尔县', '清水河县', '武川县']
                    },
                    {
                        name: '包头市',
                        areaList: ['市辖区', '东河区', '昆都仑区', '青山区', '石拐区', '白云矿区', '九原区', '土默特右旗', '固阳县', '达尔罕茂明安联合旗']
                    },
                    {name: '乌海市', areaList: ['市辖区', '海勃湾区', '海南区', '乌达区']},
                    {
                        name: '赤峰市',
                        areaList: ['市辖区', '红山区', '元宝山区', '松山区', '阿鲁科尔沁旗', '巴林左旗', '巴林右旗', '林西县', '克什克腾旗', '翁牛特旗', '喀喇沁旗', '宁城县', '敖汉旗']
                    },
                    {
                        name: '通辽市',
                        areaList: ['市辖区', '科尔沁区', '科尔沁左翼中旗', '科尔沁左翼后旗', '开鲁县', '库伦旗', '奈曼旗', '扎鲁特旗', '霍林郭勒市']
                    },
                    {name: '鄂尔多斯市', areaList: ['东胜区', '达拉特旗', '准格尔旗', '鄂托克前旗', '鄂托克旗', '杭锦旗', '乌审旗', '伊金霍洛旗']},
                    {
                        name: '呼伦贝尔市',
                        areaList: ['市辖区', '海拉尔区', '阿荣旗', '莫力达瓦达斡尔族自治旗', '鄂伦春自治旗', '鄂温克族自治旗', '陈巴尔虎旗', '新巴尔虎左旗', '新巴尔虎右旗', '满洲里市', '牙克石市', '扎兰屯市', '额尔古纳市', '根河市']
                    },
                    {name: '巴彦淖尔市', areaList: ['市辖区', '临河区', '五原县', '磴口县', '乌拉特前旗', '乌拉特中旗', '乌拉特后旗', '杭锦后旗']},
                    {
                        name: '乌兰察布市',
                        areaList: ['市辖区', '集宁区', '卓资县', '化德县', '商都县', '兴和县', '凉城县', '察哈尔右翼前旗', '察哈尔右翼中旗', '察哈尔右翼后旗', '四子王旗', '丰镇市']
                    },
                    {name: '兴安盟', areaList: ['乌兰浩特市', '阿尔山市', '科尔沁右翼前旗', '科尔沁右翼中旗', '扎赉特旗', '突泉县']},
                    {
                        name: '锡林郭勒盟',
                        areaList: ['二连浩特市', '锡林浩特市', '阿巴嘎旗', '苏尼特左旗', '苏尼特右旗', '东乌珠穆沁旗', '西乌珠穆沁旗', '太仆寺旗', '镶黄旗', '正镶白旗', '正蓝旗', '多伦县']
                    },
                    {name: '阿拉善盟', areaList: ['阿拉善左旗', '阿拉善右旗', '额济纳旗']}
                ]
            },
            {
                name: '江苏', cityList: [
                    {
                        name: '南京市',
                        areaList: ['市辖区', '玄武区', '白下区', '秦淮区', '建邺区', '鼓楼区', '下关区', '浦口区', '栖霞区', '雨花台区', '江宁区', '六合区', '溧水县', '高淳县']
                    },
                    {name: '无锡市', areaList: ['市辖区', '崇安区', '南长区', '北塘区', '锡山区', '惠山区', '滨湖区', '江阴市', '宜兴市']},
                    {
                        name: '徐州市',
                        areaList: ['市辖区', '鼓楼区', '云龙区', '九里区', '贾汪区', '泉山区', '丰　县', '沛　县', '铜山县', '睢宁县', '新沂市', '邳州市']
                    },
                    {name: '常州市', areaList: ['市辖区', '天宁区', '钟楼区', '戚墅堰区', '新北区', '武进区', '溧阳市', '金坛市']},
                    {
                        name: '苏州市',
                        areaList: ['市辖区', '沧浪区', '平江区', '金阊区', '虎丘区', '吴中区', '相城区', '常熟市', '张家港市', '昆山市', '吴江市', '太仓市']
                    },
                    {name: '南通市', areaList: ['市辖区', '崇川区', '港闸区', '海安县', '如东县', '启东市', '如皋市', '通州市', '海门市']},
                    {name: '连云港市', areaList: ['市辖区', '连云区', '新浦区', '海州区', '赣榆县', '东海县', '灌云县', '灌南县']},
                    {name: '淮安市', areaList: ['市辖区', '清河区', '楚州区', '淮阴区', '清浦区', '涟水县', '洪泽县', '盱眙县', '金湖县']},
                    {name: '盐城市', areaList: ['市辖区', '亭湖区', '盐都区', '响水县', '滨海县', '阜宁县', '射阳县', '建湖县', '东台市', '大丰市']},
                    {name: '扬州市', areaList: ['市辖区', '广陵区', '邗江区', '郊　区', '宝应县', '仪征市', '高邮市', '江都市']},
                    {name: '镇江市', areaList: ['市辖区', '京口区', '润州区', '丹徒区', '丹阳市', '扬中市', '句容市']},
                    {name: '泰州市', areaList: ['市辖区', '海陵区', '高港区', '兴化市', '靖江市', '泰兴市', '姜堰市']},
                    {name: '宿迁市', areaList: ['市辖区', '宿城区', '宿豫区', '沭阳县', '泗阳县', '泗洪县']}
                ]
            },
            {
                name: '浙江', cityList: [
                    {
                        name: '杭州市',
                        areaList: ['市辖区', '上城区', '下城区', '江干区', '拱墅区', '西湖区', '滨江区', '萧山区', '余杭区', '桐庐县', '淳安县', '建德市', '富阳市', '临安市']
                    },
                    {
                        name: '宁波市',
                        areaList: ['市辖区', '海曙区', '江东区', '江北区', '北仑区', '镇海区', '鄞州区', '象山县', '宁海县', '余姚市', '慈溪市', '奉化市']
                    },
                    {
                        name: '温州市',
                        areaList: ['市辖区', '鹿城区', '龙湾区', '瓯海区', '洞头县', '永嘉县', '平阳县', '苍南县', '文成县', '泰顺县', '瑞安市', '乐清市']
                    },
                    {name: '嘉兴市', areaList: ['市辖区', '秀城区', '秀洲区', '嘉善县', '海盐县', '海宁市', '平湖市', '桐乡市']},
                    {name: '湖州市', areaList: ['市辖区', '吴兴区', '南浔区', '德清县', '长兴县', '安吉县']},
                    {name: '绍兴市', areaList: ['市辖区', '越城区', '绍兴县', '新昌县', '诸暨市', '上虞市', '嵊州市']},
                    {name: '金华市', areaList: ['市辖区', '婺城区', '金东区', '武义县', '浦江县', '磐安县', '兰溪市', '义乌市', '东阳市', '永康市']},
                    {name: '衢州市', areaList: ['市辖区', '柯城区', '衢江区', '常山县', '开化县', '龙游县', '江山市']},
                    {name: '舟山市', areaList: ['市辖区', '定海区', '普陀区', '岱山县', '嵊泗县']},
                    {name: '台州市', areaList: ['市辖区', '椒江区', '黄岩区', '路桥区', '玉环县', '三门县', '天台县', '仙居县', '温岭市', '临海市']},
                    {name: '丽水市', areaList: ['市辖区', '莲都区', '青田县', '缙云县', '遂昌县', '松阳县', '云和县', '庆元县', '景宁畲族自治县', '龙泉市']}
                ]
            },
            {
                name: '安徽', cityList: [
                    {name: '合肥市', areaList: ['市辖区', '瑶海区', '庐阳区', '蜀山区', '包河区', '长丰县', '肥东县', '肥西县']},
                    {name: '芜湖市', areaList: ['市辖区', '镜湖区', '马塘区', '新芜区', '鸠江区', '芜湖县', '繁昌县', '南陵县']},
                    {name: '蚌埠市', areaList: ['市辖区', '龙子湖区', '蚌山区', '禹会区', '淮上区', '怀远县', '五河县', '固镇县']},
                    {name: '淮南市', areaList: ['市辖区', '大通区', '田家庵区', '谢家集区', '八公山区', '潘集区', '凤台县']},
                    {name: '马鞍山市', areaList: ['市辖区', '金家庄区', '花山区', '雨山区', '当涂县']},
                    {name: '淮北市', areaList: ['市辖区', '杜集区', '相山区', '烈山区', '濉溪县']},
                    {name: '铜陵市', areaList: ['市辖区', '铜官山区', '狮子山区', '郊　区', '铜陵县']},
                    {
                        name: '安庆市',
                        areaList: ['市辖区', '迎江区', '大观区', '郊　区', '怀宁县', '枞阳县', '潜山县', '太湖县', '宿松县', '望江县', '岳西县', '桐城市']
                    },
                    {name: '黄山市', areaList: ['市辖区', '屯溪区', '黄山区', '徽州区', '歙　县', '休宁县', '黟　县', '祁门县']},
                    {name: '滁州市', areaList: ['市辖区', '琅琊区', '南谯区', '来安县', '全椒县', '定远县', '凤阳县', '天长市', '明光市']},
                    {name: '阜阳市', areaList: ['市辖区', '颍州区', '颍东区', '颍泉区', '临泉县', '太和县', '阜南县', '颍上县', '界首市']},
                    {name: '宿州市', areaList: ['市辖区', '墉桥区', '砀山县', '萧　县', '灵璧县', '泗　县']},
                    {name: '巢湖市', areaList: ['市辖区', '居巢区', '庐江县', '无为县', '含山县', '和　县']},
                    {name: '六安市', areaList: ['市辖区', '金安区', '裕安区', '寿　县', '霍邱县', '舒城县', '金寨县', '霍山县']},
                    {name: '亳州市', areaList: ['市辖区', '谯城区', '涡阳县', '蒙城县', '利辛县']},
                    {name: '池州市', areaList: ['市辖区', '贵池区', '东至县', '石台县', '青阳县']},
                    {name: '宣城市', areaList: ['市辖区', '宣州区', '郎溪县', '广德县', '泾　县', '绩溪县', '旌德县', '宁国市']}
                ]
            },
            {
                name: '福建', cityList: [
                    {
                        name: '福州市',
                        areaList: ['市辖区', '鼓楼区', '台江区', '仓山区', '马尾区', '晋安区', '闽侯县', '连江县', '罗源县', '闽清县', '永泰县', '平潭县', '福清市', '长乐市']
                    },
                    {name: '厦门市', areaList: ['市辖区', '思明区', '海沧区', '湖里区', '集美区', '同安区', '翔安区']},
                    {name: '莆田市', areaList: ['市辖区', '城厢区', '涵江区', '荔城区', '秀屿区', '仙游县']},
                    {
                        name: '三明市',
                        areaList: ['市辖区', '梅列区', '三元区', '明溪县', '清流县', '宁化县', '大田县', '尤溪县', '沙　县', '将乐县', '泰宁县', '建宁县', '永安市']
                    },
                    {
                        name: '泉州市',
                        areaList: ['市辖区', '鲤城区', '丰泽区', '洛江区', '泉港区', '惠安县', '安溪县', '永春县', '德化县', '金门县', '石狮市', '晋江市', '南安市']
                    },
                    {
                        name: '漳州市',
                        areaList: ['市辖区', '芗城区', '龙文区', '云霄县', '漳浦县', '诏安县', '长泰县', '东山县', '南靖县', '平和县', '华安县', '龙海市']
                    },
                    {
                        name: '南平市',
                        areaList: ['市辖区', '延平区', '顺昌县', '浦城县', '光泽县', '松溪县', '政和县', '邵武市', '武夷山市', '建瓯市', '建阳市']
                    },
                    {name: '龙岩市', areaList: ['市辖区', '新罗区', '长汀县', '永定县', '上杭县', '武平县', '连城县', '漳平市']},
                    {name: '宁德市', areaList: ['市辖区', '蕉城区', '霞浦县', '古田县', '屏南县', '寿宁县', '周宁县', '柘荣县', '福安市', '福鼎市']}
                ]
            },
            {
                name: '江西', cityList: [
                    {name: '南昌市', areaList: ['市辖区', '东湖区', '西湖区', '青云谱区', '湾里区', '青山湖区', '南昌县', '新建县', '安义县', '进贤县']},
                    {name: '景德镇市', areaList: ['市辖区', '昌江区', '珠山区', '浮梁县', '乐平市']},
                    {name: '萍乡市', areaList: ['市辖区', '安源区', '湘东区', '莲花县', '上栗县', '芦溪县']},
                    {
                        name: '九江市',
                        areaList: ['市辖区', '庐山区', '浔阳区', '九江县', '武宁县', '修水县', '永修县', '德安县', '星子县', '都昌县', '湖口县', '彭泽县', '瑞昌市']
                    },
                    {name: '新余市', areaList: ['市辖区', '渝水区', '分宜县']},
                    {name: '鹰潭市', areaList: ['市辖区', '月湖区', '余江县', '贵溪市']},
                    {
                        name: '赣州市',
                        areaList: ['市辖区', '章贡区', '赣　县', '信丰县', '大余县', '上犹县', '崇义县', '安远县', '龙南县', '定南县', '全南县', '宁都县', '于都县', '兴国县', '会昌县', '寻乌县', '石城县', '瑞金市', '南康市']
                    },
                    {
                        name: '吉安市',
                        areaList: ['市辖区', '吉州区', '青原区', '吉安县', '吉水县', '峡江县', '新干县', '永丰县', '泰和县', '遂川县', '万安县', '安福县', '永新县', '井冈山市']
                    },
                    {
                        name: '宜春市',
                        areaList: ['市辖区', '袁州区', '奉新县', '万载县', '上高县', '宜丰县', '靖安县', '铜鼓县', '丰城市', '樟树市', '高安市']
                    },
                    {
                        name: '抚州市',
                        areaList: ['市辖区', '临川区', '南城县', '黎川县', '南丰县', '崇仁县', '乐安县', '宜黄县', '金溪县', '资溪县', '东乡县', '广昌县']
                    },
                    {
                        name: '上饶市',
                        areaList: ['市辖区', '信州区', '上饶县', '广丰县', '玉山县', '铅山县', '横峰县', '弋阳县', '余干县', '鄱阳县', '万年县', '婺源县', '德兴市']
                    }
                ]
            },
            {
                name: '山东', cityList: [
                    {
                        name: '济南市',
                        areaList: ['市辖区', '历下区', '市中区', '槐荫区', '天桥区', '历城区', '长清区', '平阴县', '济阳县', '商河县', '章丘市']
                    },
                    {
                        name: '青岛市',
                        areaList: ['市辖区', '市南区', '市北区', '四方区', '黄岛区', '崂山区', '李沧区', '城阳区', '胶州市', '即墨市', '平度市', '胶南市', '莱西市']
                    },
                    {name: '淄博市', areaList: ['市辖区', '淄川区', '张店区', '博山区', '临淄区', '周村区', '桓台县', '高青县', '沂源县']},
                    {name: '枣庄市', areaList: ['市辖区', '市中区', '薛城区', '峄城区', '台儿庄区', '山亭区', '滕州市']},
                    {name: '东营市', areaList: ['市辖区', '东营区', '河口区', '垦利县', '利津县', '广饶县']},
                    {
                        name: '烟台市',
                        areaList: ['市辖区', '芝罘区', '福山区', '牟平区', '莱山区', '长岛县', '龙口市', '莱阳市', '莱州市', '蓬莱市', '招远市', '栖霞市', '海阳市']
                    },
                    {
                        name: '潍坊市',
                        areaList: ['市辖区', '潍城区', '寒亭区', '坊子区', '奎文区', '临朐县', '昌乐县', '青州市', '诸城市', '寿光市', '安丘市', '高密市', '昌邑市']
                    },
                    {
                        name: '济宁市',
                        areaList: ['市辖区', '市中区', '任城区', '微山县', '鱼台县', '金乡县', '嘉祥县', '汶上县', '泗水县', '梁山县', '曲阜市', '兖州市', '邹城市']
                    },
                    {name: '泰安市', areaList: ['市辖区', '泰山区', '岱岳区', '宁阳县', '东平县', '新泰市', '肥城市']},
                    {name: '威海市', areaList: ['市辖区', '环翠区', '文登市', '荣成市', '乳山市']},
                    {name: '日照市', areaList: ['市辖区', '东港区', '岚山区', '五莲县', '莒　县']},
                    {name: '莱芜市', areaList: ['市辖区', '莱城区', '钢城区']},
                    {
                        name: '临沂市',
                        areaList: ['市辖区', '兰山区', '罗庄区', '河东区', '沂南县', '郯城县', '沂水县', '苍山县', '费　县', '平邑县', '莒南县', '蒙阴县', '临沭县']
                    },
                    {
                        name: '德州市',
                        areaList: ['市辖区', '德城区', '陵　县', '宁津县', '庆云县', '临邑县', '齐河县', '平原县', '夏津县', '武城县', '乐陵市', '禹城市']
                    },
                    {name: '聊城市', areaList: ['市辖区', '东昌府区', '阳谷县', '莘　县', '茌平县', '东阿县', '冠　县', '高唐县', '临清市']},
                    {name: '滨州市', areaList: ['市辖区', '滨城区', '惠民县', '阳信县', '无棣县', '沾化县', '博兴县', '邹平县']},
                    {name: '荷泽市', areaList: ['市辖区', '牡丹区', '曹　县', '单　县', '成武县', '巨野县', '郓城县', '鄄城县', '定陶县', '东明县']}
                ]
            },
            {
                name: '辽宁', cityList: [
                    {
                        name: '沈阳市',
                        areaList: ['市辖区', '和平区', '沈河区', '大东区', '皇姑区', '铁西区', '苏家屯区', '东陵区', '新城子区', '于洪区', '辽中县', '康平县', '法库县', '新民市']
                    },
                    {
                        name: '大连市',
                        areaList: ['市辖区', '中山区', '西岗区', '沙河口区', '甘井子区', '旅顺口区', '金州区', '长海县', '瓦房店市', '普兰店市', '庄河市']
                    },
                    {name: '鞍山市', areaList: ['市辖区', '铁东区', '铁西区', '立山区', '千山区', '台安县', '岫岩满族自治县', '海城市']},
                    {name: '抚顺市', areaList: ['市辖区', '新抚区', '东洲区', '望花区', '顺城区', '抚顺县', '新宾满族自治县', '清原满族自治县']},
                    {name: '本溪市', areaList: ['市辖区', '平山区', '溪湖区', '明山区', '南芬区', '本溪满族自治县', '桓仁满族自治县']},
                    {name: '丹东市', areaList: ['市辖区', '元宝区', '振兴区', '振安区', '宽甸满族自治县', '东港市', '凤城市']},
                    {name: '锦州市', areaList: ['市辖区', '古塔区', '凌河区', '太和区', '黑山县', '义　县', '凌海市', '北宁市']},
                    {name: '营口市', areaList: ['市辖区', '站前区', '西市区', '鲅鱼圈区', '老边区', '盖州市', '大石桥市']},
                    {name: '阜新市', areaList: ['市辖区', '海州区', '新邱区', '太平区', '清河门区', '细河区', '阜新蒙古族自治县', '彰武县']},
                    {name: '辽阳市', areaList: ['市辖区', '白塔区', '文圣区', '宏伟区', '弓长岭区', '太子河区', '辽阳县', '灯塔市']},
                    {name: '盘锦市', areaList: ['市辖区', '双台子区', '兴隆台区', '大洼县', '盘山县']},
                    {name: '铁岭市', areaList: ['市辖区', '银州区', '清河区', '铁岭县', '西丰县', '昌图县', '调兵山市', '开原市']},
                    {name: '朝阳市', areaList: ['市辖区', '双塔区', '龙城区', '朝阳县', '建平县', '喀喇沁左翼蒙古族自治县', '北票市', '凌源市']},
                    {name: '葫芦岛市', areaList: ['市辖区', '连山区', '龙港区', '南票区', '绥中县', '建昌县', '兴城市']}
                ]
            },
            {
                name: '吉林', cityList: [
                    {
                        name: '长春市',
                        areaList: ['市辖区', '南关区', '宽城区', '朝阳区', '二道区', '绿园区', '双阳区', '农安县', '九台市', '榆树市', '德惠市']
                    },
                    {name: '吉林市', areaList: ['市辖区', '昌邑区', '龙潭区', '船营区', '丰满区', '永吉县', '蛟河市', '桦甸市', '舒兰市', '磐石市']},
                    {name: '四平市', areaList: ['市辖区', '铁西区', '铁东区', '梨树县', '伊通满族自治县', '公主岭市', '双辽市']},
                    {name: '辽源市', areaList: ['市辖区', '龙山区', '西安区', '东丰县', '东辽县']},
                    {name: '通化市', areaList: ['市辖区', '东昌区', '二道江区', '通化县', '辉南县', '柳河县', '梅河口市', '集安市']},
                    {name: '白山市', areaList: ['市辖区', '八道江区', '抚松县', '靖宇县', '长白朝鲜族自治县', '江源县', '临江市']},
                    {name: '松原市', areaList: ['市辖区', '宁江区', '前郭尔罗斯蒙古族自治县', '长岭县', '乾安县', '扶余县']},
                    {name: '白城市', areaList: ['市辖区', '洮北区', '镇赉县', '通榆县', '洮南市', '大安市']},
                    {name: '延边朝鲜族自治州', areaList: ['延吉市', '图们市', '敦化市', '珲春市', '龙井市', '和龙市', '汪清县', '安图县']}
                ]
            },
            {
                name: '黑龙江', cityList: [
                    {
                        name: '哈尔滨市',
                        areaList: ['市辖区', '道里区', '南岗区', '道外区', '香坊区', '动力区', '平房区', '松北区', '呼兰区', '依兰县', '方正县', '宾　县', '巴彦县', '木兰县', '通河县', '延寿县', '阿城市', '双城市', '尚志市', '五常市']
                    },
                    {
                        name: '齐齐哈尔市',
                        areaList: ['市辖区', '龙沙区', '建华区', '铁锋区', '昂昂溪区', '富拉尔基区', '碾子山区', '梅里斯达斡尔族区', '龙江县', '依安县', '泰来县', '甘南县', '富裕县', '克山县', '克东县', '拜泉县', '讷河市']
                    },
                    {name: '鸡西市', areaList: ['市辖区', '鸡冠区', '恒山区', '滴道区', '梨树区', '城子河区', '麻山区', '鸡东县', '虎林市', '密山市']},
                    {name: '鹤岗市', areaList: ['市辖区', '向阳区', '工农区', '南山区', '兴安区', '东山区', '兴山区', '萝北县', '绥滨县']},
                    {name: '双鸭山市', areaList: ['市辖区', '尖山区', '岭东区', '四方台区', '宝山区', '集贤县', '友谊县', '宝清县', '饶河县']},
                    {
                        name: '大庆市',
                        areaList: ['市辖区', '萨尔图区', '龙凤区', '让胡路区', '红岗区', '大同区', '肇州县', '肇源县', '林甸县', '杜尔伯特蒙古族自治县']
                    },
                    {
                        name: '伊春市',
                        areaList: ['市辖区', '伊春区', '南岔区', '友好区', '西林区', '翠峦区', '新青区', '美溪区', '金山屯区', '五营区', '乌马河区', '汤旺河区', '带岭区', '乌伊岭区', '红星区', '上甘岭区', '嘉荫县', '铁力市']
                    },
                    {
                        name: '佳木斯市',
                        areaList: ['市辖区', '永红区', '向阳区', '前进区', '东风区', '郊　区', '桦南县', '桦川县', '汤原县', '抚远县', '同江市', '富锦市']
                    },
                    {name: '七台河市', areaList: ['市辖区', '新兴区', '桃山区', '茄子河区', '勃利县']},
                    {
                        name: '牡丹江市',
                        areaList: ['市辖区', '东安区', '阳明区', '爱民区', '西安区', '东宁县', '林口县', '绥芬河市', '海林市', '宁安市', '穆棱市']
                    },
                    {name: '黑河市', areaList: ['市辖区', '爱辉区', '嫩江县', '逊克县', '孙吴县', '北安市', '五大连池市']},
                    {
                        name: '绥化市',
                        areaList: ['市辖区', '北林区', '望奎县', '兰西县', '青冈县', '庆安县', '明水县', '绥棱县', '安达市', '肇东市', '海伦市']
                    },
                    {name: '大兴安岭地区', areaList: ['呼玛县', '塔河县', '漠河县']}
                ]
            },
            {
                name: '海南', cityList: [
                    {name: '海口市', areaList: ['市辖区', '秀英区', '龙华区', '琼山区', '美兰区']},
                    {name: '三亚市', areaList: ['市辖区']},
                    {
                        name: '省直辖县级行政单位',
                        areaList: ['五指山市', '琼海市', '儋州市', '文昌市', '万宁市', '东方市', '定安县', '屯昌县', '澄迈县', '临高县', '白沙黎族自治县', '昌江黎族自治县', '乐东黎族自治县', '陵水黎族自治县', '保亭黎族苗族自治县', '琼中黎族苗族自治县', '西沙群岛', '南沙群岛', '中沙群岛的岛礁及其海域']
                    }
                ]
            },
            {
                name: '台湾', cityList: []
            },
            {
                name: '香港', cityList: []
            },
            {
                name: '澳门', cityList: []
            }
        ];
        $scope.imgarr = [];
        $scope.agearr = [];
        $scope.subSate = false;
        erp.postFun('app/employee/companyinfo', null, xlo, err)

        function xlo(n) {
            var obj = JSON.parse(n.data.result)
            console.log('company', obj.info)
            $scope.companyList = obj.info;
        }

        $scope.strogeList = erp
            .getStorage()
            .map(_ => ({ id: _.dataId, storageName: _.dataName }));


        for (var i = 10; i < 100; i++) {
            $scope.agearr.push(i)
        }
        //获得证件信息
        $scope.upLoadImg = function (files) {
            var data = new FormData();      //以下为像后台提交图片数据
            data.append('file', files[0]);
            data.append('index', '1');
            erp.upLoadImgPost('app/ajax/upload', data, con, err)

            function con(n) {
                console.log(
                        n.data.result)
                var obj = JSON.parse(n.data.result)
                $scope.imgarr.push('http://' + obj[0])
                console.log($scope.imgarr)
            }

            function err(n) {
                console.log(n)
            }
        }
        //头像
        // $scope.headimg='./static/image/public-img/iconplus.png';
        $scope.upLoadImg2 = function (files) {
            var data = new FormData();      //以下为像后台提交图片数据
            data.append('file', files[0]);
            data.append('index', '1');
            erp.upLoadImgPost('app/ajax/upload', data, con, err)

            function con(n) {
                console.log(
                        n.data.result)
                var obj = JSON.parse(n.data.result)
                $scope.headimg = 'http://' + obj[0]
                console.log($scope.headimg)
                $('#document2').val('');
            }

            function err(n) {
                console.log(n)
            }
        }
        /*  //头像
          $scope.upLoadImg4 = function (files) {
              var data = new FormData();      //以下为像后台提交图片数据
              data.append('file', files[0]);
              data.append('index', '1');
              erp.upLoadImgPost('app/ajax/upload', data, con, err)

              function con (n) {
                  console.log(
                          n.data.result)
                  var obj = JSON.parse(n.data.result)
                  $scope.headimg = 'https://' + obj[0]

                  console.log($scope.headimg)
              }

              function err (n) {
                  console.log(n)
              }
          }*/
        //简历
        $scope.resumearr = [];
        $scope.Upresume = function (files) {
            var obj1 = {}
            console.log(files[0].name)
            var data = new FormData();      //以下为像后台提交图片数据
            data.append('file', files[0]);
            data.append('index', '1');
            erp.upLoadImgPost('app/ajax/upload', data, con, err)

            function con(n) {
                var obj = JSON.parse(n.data.result)
                $scope.resume = 'http://' + obj[0]
                console.log($scope.resume)
                obj1.url = $scope.resume;
                obj1.name = files[0].name;
                $scope.resumearr.push(obj1)
                console.log($scope.resumearr)
                $('#document3').val('');
            }

            function err(n) {
                console.log(n)
            }
        }
        //获得证件信息
        $scope.upLoadImg3 = function (files) {
            var data = new FormData();      //以下为像后台提交图片数据
            data.append('file', files[0]);
            data.append('index', '1');
            erp.upLoadImgPost('app/ajax/upload', data, con, err)

            function con(n) {
                console.log(
                        n.data.result)
                var obj = JSON.parse(n.data.result)
                $scope.imgarr.push('http://' + obj[0])
                console.log($scope.imgarr)
                $('#document1').val('');
            }

            function err(n) {
                console.log(n)
            }
        }
        //省级获取
        $scope.provinceget = function (provice) {
            console.log(provice)
            $scope.citylist = provice.cityList;
        }
        //市级获取
        $scope.cityget = function (city) {
            console.log(city)
            $scope.arealist = city.areaList;
        }
        //工作经历获取
        $scope.workxparr = [];
        $scope.addworkxp = function () {
            console.log($scope.workstart, $scope.workcompany, $scope.worktime)
            $scope.workstart = $scope.workstart1 + ' - ' + $scope.workstart2;
            var obj = {}
            obj.start = $scope.workstart;
            obj.company = $scope.workcompany;
            obj.time = $scope.worktime;
            $scope.workxparr.push(obj);
            $scope.workstart1 = '';
            $scope.workstart2 = '';
            $scope.workcompany = '';
            $scope.worktime = '';
        }
        $scope.delworkxp = function (index) {
            $scope.workxparr.splice(index, 1)
        }
        //历史表现获取
        $scope.BXlist = [];
        $scope.addBX = function () {
            var obj = {}
            obj.time = $scope.time;
            obj.type = $scope.type;
            obj.cause = $scope.cause;
            $scope.BXlist.push(obj);
            $scope.time = '';
            $scope.type = '';
            $scope.cause = '';
        }
        $scope.delBX = function (index) {
            $scope.BXlist.splice(index, 1)
        }
        $scope.idcardchange = function () {
            console.log()
            if ($scope.staffidcard) {
                var date = new Date;
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var str1 = $scope.staffidcard + '';
                var age = year - str1.substring(6, 10);
                if (month - str1.substring(11, 12) < 0) {
                    age -= 1;
                }
                var str = age + '岁 (' + str1.substring(6, 10) + "-" + str1.substring(10, 12) + ')';
                console.log(str)
                $scope.staffagestr = str;
                $scope.staffage = str1.substring(6, 14);
            }
        }
        //获得公司名
        $scope.companyget = function (item) {
            console.log(item)
            if (item) {
                $scope.companyname = item.companyName;
                $scope.departmentlist = item.departments;
            } else {
                $scope.departmentlist = [];
                $scope.groupList = [];
            }
        }
        //获得部门名
        $scope.departmentget = function (item, index) {
            console.log(item)
            if (item) {
                $scope.departmentname = item.department;
                $scope.groupList = item.group;
            } else {
                $scope.groupList = [];
            }
        }
        //获得组名
        $scope.groupget = function (item, index) {
            console.log(item)
            if (item) {
                $scope.groupname = item.comgroup;
                $scope.companyId = item.id;
            }
        }

        function err(n) {
            console.log(n)
        }

        //验证
        function verification() {
            if (!$scope.staffname) {
                $scope.staffnameState = true;
            } else {
                $scope.staffnameState = false;
            }
            if (!$scope.staffsex) {
                $scope.staffsexState = true;
            } else {
                $scope.staffsexState = false;
            }
            if (!$scope.staffhiredate) {
                $scope.staffhiredateState = true;
            } else {
                $scope.staffhiredateState = false;
            }
            if (!$scope.staffage) {
                $scope.staffagestrState = true;
            } else {
                $scope.staffagestrState = false;
            }
            if (!$scope.stafftel || !$scope.stafftel_qh) {
                $scope.stafftelState = true;
            } else {
                $scope.stafftelState = false;
            }
            if (!$scope.companyId) {
                $scope.staffgroupState = true;
            } else {
                $scope.staffgroupState = false;
            }
            if (!$scope.staffidcard) {
                $scope.staffidcardState = true;
            } else {
                $scope.staffidcardState = false;
            }
            if (!$scope.staffcompanydivision) {
                $scope.staffcompanydivisionState = true;
            } else {
                $scope.staffcompanydivisionState = false;
            }
            if (!$scope.staffdepartment) {
                $scope.staffdepartmentState = true;
            } else {
                $scope.staffdepartmentState = false;
            }
            if (!$scope.staffaccount) {
                $scope.staffaccountState = true;
            } else {
                $scope.staffaccountState = false;
            }
            $scope.staffemailState = !$scope.staffemail
            if (!$scope.staffnameState && !$scope.staffsexState && !$scope.staffhiredateState &&
                    !$scope.staffagestrState && !$scope.staffgroupState && !$scope.staffidcardState &&
                    !$scope.stafftelState && !$scope.staffcompanydivisionState && !$scope.staffdepartmentState && !$scope.staffaccountState && !$scope.staffemailState
            ) {
                return true;
            } else {
                layer.msg('带*号为必填项，请填写完整！')
                return false;
            }
        }

         //获取区号
         $scope.countries = null;
         $scope.stafftel_qh = '86';
         erp.getFun('app/account/countrylist', function (n) {
             if (n.data.statusCode == 200) {
                $scope.countries = JSON.parse(n.data.result);
             } else {
                layer.msg("Get the country list error");
             }
         });

        $scope.determine = function () {
            var reg = /^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$/;
            var reg2 = /^[0-9]\d{10}$/;
            console.log($scope.staffhiredate)
            console.log($scope.staffhiredate)
            if (verification()) {
                if (reg2.test($scope.stafftel)) {
                    if ($scope.staffemail) {
                        if (!reg.test($scope.staffemail)) {
                            layer.msg('邮箱格式不对')
                            return;
                        }
                    }
                } else {
                    layer.msg('电话格式不对')
                    return;
                }
                if (!$scope.province || !$scope.city) {
                    $scope.province = {}
                    $scope.city = {}
                    $scope.area = '';
                    $scope.staffaccount = '';
                    $scope.province.name = '';
                    $scope.city.name = '';
                }
                console.log('工作经验', JSON.stringify($scope.workxparr));
                var obj = {};
                obj.name = $scope.staffname;
                obj.sex = $scope.staffsex;
                obj.residence = $scope.province.name + "," + $scope.city.name + "," + $scope.area + "," + $scope.staffaccount;
                obj.IDCard = $scope.staffidcard;
                obj.age = $scope.staffage;
                obj.hiredate = $scope.staffhiredate;
                obj.education = $scope.staffeducation;
                obj.school = $scope.staffschool;
                obj.major = $scope.staffprofession;
                obj.politicalvisage = $scope.staffpoliticalstatus;
                obj.maritalstatus = $scope.staffmarriage;
                obj.phone = $scope.stafftel_qh + '-'+ $scope.stafftel;
                obj.email = $scope.staffemail;
                obj.wechat = $scope.staffwechat;
                obj.workqq = $scope.staffqq;
                obj.workqqpassword = $scope.staffqqpassword;
                obj.workexp = JSON.stringify($scope.workxparr);
                obj.historicalRecords = JSON.stringify($scope.BXlist);
                obj.newaddress = $scope.staffaddress;
                obj.companyId = $scope.companyId;
                obj.position = $scope.staffposition;
                obj.job = $scope.staffjob;
                obj.companyname = $scope.companyname;
                obj.department = $scope.departmentname;
                obj.headPortrait = $scope.headimg;
                obj.certificates = $scope.imgarr;
                obj.cvpath = $scope.resumearr;
                obj.nameEN = $scope.staffnameen;
                obj.workqqEmail = $scope.workqqEmail;
                obj.workqqPhone = $scope.workqqPhone;
                obj.cloudUrl = $scope.cloudUrl;
                obj.cloudAccount = $scope.cloudAccount;
                obj.cloudPwd = $scope.cloudPwd;
                obj.cloudPhone = $scope.cloudPhone;
                obj.workEmailAccount = $scope.workEmailAccount;
                obj.workEmailPwd = $scope.workEmailPwd;
                obj.workEmailPhone = $scope.workEmailPhone;
                obj.skypeAccount = $scope.skypeAccount;
                obj.skypePwd = $scope.skypePwd;
                obj.skypeEmail = $scope.skypeEmail;
                obj.skypePhone = $scope.skypePhone;
                obj.facebookAccount = $scope.facebookAccount;
                obj.facebookPwd = $scope.facebookPwd;
                obj.facebookPhone = $scope.facebookPhone;
                obj.googleAccount = $scope.googleAccount;
                obj.googlePwd = $scope.googlePwd;
                obj.googlePhone = $scope.googlePhone;
                console.log(obj)
                var str = JSON.stringify(obj)
                console.log(str)
                if ($scope.staffjob == '销售') {
                    if (!$scope.staffnameen) {
                        layer.msg('英文名必填');
                        return;
                    }
                }
                if (!$scope.subSate) {
                    $scope.subSate = true;
                    erp.postFun('app/employee/savestaffrecord', {"data": '' + str}, function (n) {
                        console.log(n.data)
                        if (n.data.statusCode == 200) {
                            layer.msg('添加成功')
                            $scope.subSate = false;
                            $location.path('/staff/stafffiles')
                        } else if (n.data.statusCode == 509) {
                            $scope.staffnameenState = true;
                            $scope.subSate = false;
                            layer.msg('英文名重复，请重新输入')
                        } else {
                            $scope.subSate = false;
                            layer.msg('添加失败')
                        }
                    }, function (n) {
                        $scope.subSate = false;
                    })
                } else {
                    layer.msg('正在提交，请勿重复提交！')
                }
            }
        }
    }])
    //员工账号管理
    app.controller('stafftableCtrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('stafftableCtrl')
        $scope.isoverTR = true;
        $scope.arr = ['', '停用', '启用']
        $scope.arr2 = ['', '在用', '停用']
        $scope.serState = '1';
        //分页相关
        $scope.searchinfo = '';
        $scope.pagesize = '20';
        $scope.pagenum = '1';
        $scope.pagenumarr = [10, 20, 30, 50];
        $scope.totalNum = 0;
        $scope.companynames = '';
        var b = new Base64();
        $scope.name = b.decode(localStorage.getItem('erploginName') || '') || "";
        $scope.isAdm = false;
        if (erp.isAdminLogin()) {
            console.log('是管理员');
            $scope.isAdm = true;
        } else {
            console.log('不是管理员');
            $scope.isAdm = false;
        }
        $scope.transferUser = function (name) {
            var data = {
                "salesman": name
            };
            layer.load(2);
            erp.postFun('app/account/transferUser', JSON.stringify(data), function (data) {
                console.log(data);
                layer.closeAll('loading');
                if (data.data.result == true) {
                    layer.msg('成功');
                } else {
                    layer.msg('失败');
                }
            }, function (n) {
                layer.closeAll('loading');
                console.log(n);
            });
        };

        $scope.resetPas = function (item) {
            console.log(item)
            console.log(item);
            layer.confirm('请确认是否重置密码！', {
                        title: '操作提示',
                        icon: 3,
                        btn: ['取消', '确认'] //按钮
                    }, function (ca) {
                        layer.close(ca);
                    }, function (index) {
                        erp.postFun('erp/erphomepage/resetPassword', {
                            id: item.id,
                        }, function (res) {
                            if (res.data.code == 200) {
                                layer.msg('重置成功，你的新密码为1234567',{
                                    time:3000
                                });
                                layer.close(index);
                                getList();
                            } else {
                                layer.msg('操作失败')
                            }
                        }, function (res) {
                            layer.msg('系统异常')
                        })
                    }
            );
        }
        function getList() {
            erp.postFun('app/employee/list', {"data": "{'companyname':'" + $scope.companynames + "','userStatus':'" + $scope.serState + "','name':'" + $scope.searchinfo + "','pageNum':'" + $scope.pagenum + "','pageSize':'" + $scope.pagesize + "'}"}, con, err)

            function err(n) {
                console.log(n)
            }

            function con(n) {
                if (n.data.statusCode == 200) {
                    var obj = JSON.parse(n.data.result);
                    console.log(obj);
                    $scope.totalNum = obj.count;
                    $scope.parentobj = obj;
                    $scope.stafflist = obj.info;
                    $scope.stafflist.forEach(function (o,i) {
                        if(o.NAME == $scope.name || $scope.isAdm){
                            o.isResetPas = true;
                        }
                    })
                    pageFun();
                } else {
                    $scope.stafflist = [];
                    $scope.totalNum = 0;
                }
            }
        }

        getList()
        $scope.serChange = function () {
            $scope.pagenum = '1';
            getList()
        }
        $('.top-search-inp').keypress(function(event) {
            if(event.keyCode=='13'){
                $scope.serChange()
            }
        });
        $scope.searchstaff = function () {
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
            if (pagenum > totalpage) {
                layer.msg('错误页码')
                $scope.pagenum = 1;
            } else {
                getList();
            }
        }
        //停用启用
        $scope.leave = function (item) {
            console.log(item)
            var STATUS = null;
            if (item.userStatus == 1) {
                STATUS = 2
            } else if (item.userStatus == 2) {
                STATUS = 1
            }
            var index = layer.confirm('请确认是否' + $scope.arr[item.userStatus] + '?', {
                btn: ['取消', '确认'] //按钮
            }, function () {
                layer.close(index);
            }, function () {
                erp.postFun('app/employee/disable', {"data": "{'id':'" + item.id + "','status':'" + STATUS + "'}"}, lea, err);

                function lea(n) {
                    if (n.data.statusCode == 200) {
                        getList()
                        layer.close(index);
                        layer.msg('' + $scope.arr[item.userStatus] + '成功');
                    } else {
                        layer.msg('' + $scope.arr[item.userStatus] + '失败');
                    }
                }

                function err() {
                    layer.msg('' + $scope.arr[item.userStatus] + '失败');
                }
            });
        }
        //点击行数加样式
        $scope.TrClick = function (i) {
            $scope.focus = i;
        }
    }])
    //内部通知 已发送
    app.controller('staffnbtzCtrl', ['$scope', 'erp', function ($scope, erp) {
        $scope.title = '';
        $scope.status = '1';
        $scope.pagenum = "1";
        $scope.pagesize = "10";
        $scope.pagenumarr = [10, 20, 30, 50];
        $scope.totalNum = 0;
        $scope.dataList = [];
        $scope.lookdata = [];
        $scope.relationId = '';
        $scope.relationId1 = [];
        $scope.isCKstate = false;
        $scope.isoverTR = true;

        function getList() {
            erp.postFun('app/notice/getNoticList', {
                'title': $scope.title,
                'status': $scope.status,
                'limit': $scope.pagesize,
                'page': $scope.pagenum
            }, con, err);

            function con(n) {
                if (n.data.statusCode == 200) {
                    $scope.dataList = JSON.parse(n.data.result).list;
                    $scope.totalNum = JSON.parse(n.data.result).count;
                    console.log(JSON.parse(n.data.result).list)
                    pageFun();
                } else {
                    layer.msg('查询失败')
                }
            }

            function err(n) {
                layer.msg('查询失败')
            }
        }

        getList();
        $scope.usersearch = function () {
            $scope.pagenum = "1";
            getList();
        }
        $('.top-search-inp').keypress(function(event) {
            if(event.keyCode=='13'){
                $scope.usersearch()
            }
        });
        $scope.look = function (item) {
            console.log(item)
            $scope.isCKstate = true;
            erp.postFun('app/notice/getNotice', {'id': item.id, 'status': $scope.status}, con, err);

            function con(n) {
                if (n.data.statusCode == 200) {
                    $scope.lookdata = JSON.parse(n.data.result).info[0];
                    console.log($scope.lookdata)
                    if ($scope.lookdata.relationId == 'all') {
                        $scope.relationId = 'all';
                        $scope.relationId1 = [];
                    } else if ($scope.lookdata.relationId.length > 0) {
                        $scope.relationId = '';
                        $scope.relationId1 = $scope.lookdata.relationId
                    }
                } else {
                    layer.msg('查询失败')
                }
            }

            function err(n) {
                layer.msg('查询失败')
            }
        }
        $scope.close = function () {
            $scope.isCKstate = false;
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
                    $scope.pagenum = n+'';
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
                $scope.pagenum = '1';
            } else {
                getList();
            }
        }
        //点击行数加样式
        $scope.TrClick = function (i) {
            $scope.focus = i;
        }
    }])
    //内部通知 草稿箱
    app.controller('staffcgxCtrl', ['$scope', 'erp', function ($scope, erp, $location) {
        $scope.title = '';
        $scope.status = '0';
        $scope.pagenum = "1";
        $scope.pagesize = "10";
        $scope.pagenumarr = [10, 20, 30, 50];
        $scope.totalNum = 0;
        $scope.dataList = [];
        $scope.relationId = '';
        $scope.relationId1 = [];
        $scope.isCKstate = false;
        $scope.isoverTR = true;

        function getList() {
            erp.postFun('app/notice/getNoticList', {
                'title': $scope.title,
                'status': $scope.status,
                'limit': $scope.pagesize,
                'page': $scope.pagenum
            }, con, err);

            function con(n) {
                if (n.data.statusCode == 200) {
                    $scope.dataList = JSON.parse(n.data.result).list;
                    $scope.totalNum = JSON.parse(n.data.result).count;
                    console.log(JSON.parse(n.data.result).list)
                    pageFun();
                } else {
                    layer.msg('查询失败')
                }
            }

            function err(n) {
                layer.msg('查询失败')
            }
        }

        getList();
        $scope.usersearch = function () {
            $scope.pagenum = "1";
            getList();
        }
        $('.top-search-inp').keypress(function(event) {
            if(event.keyCode=='13'){
                $scope.usersearch()
            }
        });
        $scope.look = function (item) {
            console.log(item)
            $scope.isCKstate = true;
            erp.postFun('app/notice/getNotice', {'id': item.id, 'status': $scope.status}, con, err);

            function con(n) {
                if (n.data.statusCode == 200) {
                    $scope.lookdata = JSON.parse(n.data.result).info[0];
                    console.log($scope.lookdata)
                    if ($scope.lookdata.relationId == 'all') {
                        $scope.relationId = 'all';
                        $scope.relationId1 = [];
                    } else if ($scope.lookdata.relationId.length > 0) {
                        $scope.relationId = '';
                        $scope.relationId1 = $scope.lookdata.relationId
                    }
                } else {
                    layer.msg('查询失败')
                }
            }

            function err(n) {
                layer.msg('查询失败')
            }
        }
        $scope.edit = function (item) {
            location.href = '#/staff/write?type=edit&id=' + item.id;
        }
        $scope.remove = function (item) {
            var index = layer.confirm('请确认是否删除？', {
                btn: ['取消', '确认'] //按钮
            }, function () {
                layer.close(index);
            }, function () {
                erp.postFun('app/notice/isdeleteNotice', {'ids': item.id}, con, err);

                function con(n) {
                    if (n.data.statusCode == 200) {
                        layer.msg('删除成功');
                        getList();
                    } else {
                        layer.msg('删除失败');
                    }
                }

                function err(n) {
                    layer.msg('查询失败')
                }
            });
        }
        $scope.close = function () {
            $scope.isCKstate = false;
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
                    $scope.pagenum = n+'';
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
                $scope.pagenum = '1';
            } else {
                getList();
            }
        }
        //点击行数加样式
        $scope.TrClick = function (i) {
            $scope.focus = i;
        }
    }])
    //内部通知 定时发送
    app.controller('staffdsfsCtrl', ['$scope', 'erp', function ($scope, erp, $location) {
        // alert('定时发送')
        $scope.pagesize = "20";
    }])
    //内部通知 写通知
    app.controller('staffwriteCtrl', ['$scope', 'erp', function ($scope, erp, $location) {
        function GetUrlParam(paraName) {
            var url = document.location.toString();
            var arrObj = url.split("?");
            if (arrObj.length > 1) {
                var arrPara = arrObj[1].split("&");
                var arr;
                for (var i = 0; i < arrPara.length; i++) {
                    arr = arrPara[i].split("=");
                    if (arr != null && arr[0] == paraName) {
                        return arr[1];
                    }
                }
                return "";
            }
            else {
                return "";
            }
        }

        console.log(GetUrlParam('type'))
        $scope.type = GetUrlParam('type');
        $scope.BMlist = [];//所有部门
        $scope.RYlist = [{name: '所有人', nameen: 'all'}];//所有人员
        $scope.TZlist = [];//通知人员
        $scope.BMname = '';//部门
        $scope.serchinput = '';//搜索
        $scope.adr = '';//地区
        $scope.iscg = false;
        $scope.notificationType = '' //通知类型
        $scope.title = '' //标题
        $scope.context = '' //内容
        $scope.status = null //状态
        $scope.id = '';
        $scope.relationId = [];
        if ($scope.type == 'add') {
            $scope.BMlist = [];//所有部门
            $scope.RYlist = [{name: '所有人', nameen: 'all'}];//所有人员
            $scope.TZlist = [];//通知人员
            $scope.BMname = '';//部门
            $scope.serchinput = '';//搜索
            $scope.adr = '';//地区
            $scope.iscg = false;
            $scope.notificationType = '' //通知类型
            $scope.title = '' //标题
            $scope.context = '' //内容
            $scope.status = null //状态
            $scope.id = '';
            $scope.relationId = [];
        } else if ($scope.type == 'edit') {
            $scope.id = GetUrlParam('id')
            console.log($scope.id)
            $scope.status = '0';
            erp.postFun('app/notice/getNotice', {'id': $scope.id, 'status': $scope.status}, con, err);

            function con(n) {
                if (n.data.statusCode == 200) {
                    $scope.notificationType = JSON.parse(n.data.result).info[0].notificationType;
                    $scope.title = JSON.parse(n.data.result).info[0].title; //标题
                    $scope.context = JSON.parse(n.data.result).info[0].info; //内容
                    console.log(JSON.parse(n.data.result).info[0].relationId)
                    if (JSON.parse(n.data.result).info[0].relationId == "all") {
                        $scope.TZlist = [{name: 'all'}]
                        $scope.relationId = 'all';
                    } else if (JSON.parse(n.data.result).info[0].relationId.length > 0) {
                        $scope.TZlist = JSON.parse(n.data.result).info[0].relationId;
                        $scope.relationId = JSON.parse(n.data.result).info[0].relationId;
                    }
                } else {
                    layer.msg('获取数据失败')
                }
            }

            function err(n) {
                layer.msg('查询失败')
            }
        }

        function getBM() {
            erp.postFun('app/notice/getDepartment', {'region': $scope.adr}, con, err);

            function con(n) {
                if (n.data.statusCode == 200) {
                    $scope.BMlist = JSON.parse(n.data.result).department
                } else {
                }
            }

            function err(n) {
                layer.msg('查询失败')
            }
        }

        getBM();

        function getyungong() {
            erp.postFun('app/notice/getDepartmentEmployee', {
                'region': $scope.adr,
                'department': $scope.BMname,
                'name': $scope.serchinput
            }, con, err);

            function con(n) {
                if (n.data.statusCode == 200) {
                    if (!$scope.BMname && !$scope.serchinput && !$scope.adr) {
                        $scope.RYlist = [{name: '所有人', nameen: 'all'}];
                        $scope.relationId = 'all';
                    } else {
                        $scope.RYlist = JSON.parse(n.data.result).list
                    }
                } else {
                    layer.msg('查询失败')
                }
            }

            function err(n) {
                layer.msg('查询失败')
            }
        }

        function issend() {
            erp.load()
            erp.postFun('app/notice/saveNotice', {
                'title': $scope.title,
                'id': $scope.id,
                'status': $scope.status,
                'info': $scope.context,
                'notificationType': $scope.notificationType,
                'relationId': JSON.stringify($scope.relationId)
            }, con, err);

            function con(n) {
                erp.closeLoad()
                if (n.data.statusCode == 200) {
                    if ($scope.status == 0) {
                        layer.msg('已存入草稿');
                        location.href = '#/staff/cgx';
                    } else if ($scope.status == 1) {
                        layer.msg('发布成功');
                        location.href = '#/staff/nbtz';
                    }
                    $scope.BMlist = [];//所有部门
                    $scope.RYlist = [{name: '所有人', nameen: 'all'}];//所有人员
                    $scope.TZlist = [];//通知人员
                    $scope.BMname = '';//部门
                    $scope.serchinput = '';//搜索
                    $scope.adr = '';//地区
                    $scope.iscg = false;
                    $scope.notificationType = '' //通知类型
                    $scope.title = '' //标题
                    $scope.context = '' //内容
                    $scope.status = null //状态
                    $scope.id = '';
                    $scope.relationId = [];
                }else{
                    layer.msg(n.data.message)
                }
            }

            function err(n) {
                erp.closeLoad()
                layer.msg('操作失败')
            }
        }

        //删除
        $scope.remClick = function (name) {
            console.log(name)
            for (var i = 0; i < $scope.TZlist.length; i++) {
                if ($scope.TZlist[i].name == name) {
                    $scope.TZlist.splice(i, 1);
                    if (name == 'all') {
                        $scope.relationId = [];
                    } else {
                        $scope.relationId.splice(i, 1);
                    }
                }
            }
        }
        //姓名查询
        $scope.serchange = function () {
            getyungong()
        }
        //选择地区
        $scope.changeadr = function () {
            $scope.iscg = false;
            $scope.BMname = '';
            getBM();
            getyungong()
        }
        //选择部门
        $scope.changeBM = function (n) {
            getyungong()
            if ($scope.BMname) {
                $scope.iscg = true;
            } else {
                $scope.iscg = false;
            }
        }
        //添加整个部门
        $scope.addAll = function () {
            if ($scope.relationId == 'all') {
                $scope.TZlist = [];
                $scope.relationId = [];
            }
            if ($scope.BMname) {
                if ($scope.TZlist.length == 0) {
                    $scope.TZlist.push({name: $scope.BMname})
                    $scope.relationId.push({type: 'dep', name: $scope.BMname, id: ''})
                } else {
                    var state = true;
                    var flag = true;
                    for (var i = 0; i < $scope.TZlist.length; i++) {
                        if ($scope.TZlist[i].name == $scope.BMname) {
                            state = false;
                            layer.msg('已添加此部门啦')
                        }
                    }
                    if (state) {
                        $scope.TZlist.push({name: $scope.BMname})
                        $scope.relationId.push({type: 'dep', name: $scope.BMname, id: ''})
                    }
                }
            }
        }
        //添加个人
        $scope.listClick = function (item) {
            if ($scope.relationId == 'all') {
                $scope.TZlist = [];
                $scope.relationId = [];
            }
            if (item.name == '所有人') {
                $scope.TZlist = [{name: item.nameen}]
                $scope.relationId = 'all';
            } else {
                if ($scope.TZlist.length == 0) {
                    $scope.TZlist.push({name: item.name})
                    $scope.relationId.push({type: 'user', name: item.name, id: item.id})
                } else {
                    var state = true;
                    for (var i = 0; i < $scope.TZlist.length; i++) {
                        if ($scope.TZlist[i].name == item.name) {
                            state = false;
                            layer.msg('已添加此人啦')
                        }
                    }
                    if (state) {
                        $scope.TZlist.push({name: item.name})
                        $scope.relationId.push({type: 'user', name: item.name, id: item.id})
                    }
                }
            }
        }
        $scope.close = function () {
            $scope.isYLstate = false;
        }
        //草稿
        $scope.caogao = function () {
            if ($scope.notificationType == '') {
                layer.msg('请选择通知类型')
            } else if ($scope.TZlist.length == 0) {
                layer.msg('请选择被通知部门或人员')
            } else if ($scope.title == '') {
                layer.msg('请输入主题')
            } else if ($scope.context == '') {
                layer.msg('请输入内容')
            } else {
                $scope.status = '0';
                issend();
            }
        }
        //发送
        $scope.fasong = function () {
            console.log($scope.notificationType)
            console.log($scope.title)
            console.log($scope.context)
            console.log($scope.TZlist)
            console.log($scope.relationId)
            if ($scope.notificationType == '') {
                layer.msg('请选择通知类型')
            } else if ($scope.TZlist.length == 0) {
                layer.msg('请选择被通知部门或人员')
            } else if ($scope.title == '') {
                layer.msg('请输入主题')
            } else if ($scope.context == '') {
                layer.msg('请输入内容')
            } else {
                $scope.status = '1';
                issend();
            }
        }
    }])
    //招聘
    app.controller('recruitCtrl', ['$scope', 'erp', '$routeParams', function ($scope, erp, $routeParams) {
        $scope.showType = 'add';
        $scope.showId = "";
        // $scope.adressCookie;
        $scope.whetherRelation = '';
        $scope.appointmentBeginDate = '';
        $scope.appointmentEndDate = '';
        $scope.createBeginDate = '';
        $scope.createEndDate = '';

        $scope.name = ''; //姓名
        $scope.tel = ''; //手机号
        $scope.message = ''; //信息
        $scope.ageVal = ''; //年龄
        $scope.educations = ''; //学历
        $scope.inputPerson = ''; //录入人
        $scope.birthDate = ''; //出生日期
        $scope.sex = ''; //性别
        $scope.regions = ''; //招聘地区
        $scope.quarter = ''; //招聘岗位
        $scope.jobPlatforms = ''; //招聘平台
        $scope.appointmentDate = ''; //预约时间
        $scope.whetherRelation = ''; //是否联系
        $scope.appointmentInfo = ''; //预约详情
        $scope.Reasion = ''; //备注
        $scope.id = '';
        $scope.resumeLink = '';
        //更新
        $scope.showtime = '';
        $scope.UPwhetherRelation = '';
        $scope.radios = '';
        $scope.UPReasions = '';
        $scope.resultText = '';
        //搜索
        $scope.serregion = ''; //招聘地区
        $scope.serinputPerson = ''; //录入人
        $scope.serquarters = ''; //招聘岗位
        $scope.serjobPlatforms = ''; //招聘平台
        $scope.serwhetherRelation = ''; //是否联系
        $scope.serappointmentBeginDate = ''; //
        $scope.serappointmentEndDate = ''; //
        $scope.sercreateBeginDate = ''; //
        $scope.sercreateEndDate = ''; //
        $scope.serappointmentInfo = ''

        $scope.UPReasion = '';
        //分页
        $scope.pagesize = '20';
        $scope.pagenum = '1';
        $scope.pagenumarr = [10, 20, 30, 50];
        $scope.totalNum = 0;
        $scope.orderBy = 'desc'

        $scope.isname = false;
        $scope.istel = false;
        $scope.isinputPerson = false;
        $scope.isregion = false;
        $scope.isquarters = false;
        $scope.isjobPlatforms = false;
        $scope.colorState = true;
        //
        $scope.education = [
            {'text': "本科", 'value': '本科', "id": 0},
            {'text': "大专", 'value': '大专', "id": 1}
        ];
        $scope.jobPlatform = [
            {'text': "招聘狗", "id": 0},
            {'text': "智联", "id": 1},
            {'text': "51job", "id": 3},
            {'text': "前程无忧", "id": 4},
            {'text': "拉钩", "id": 5},
            {'text': "其他", "id": 2}
        ]
        $scope.Adress = [
            {
                "roleName": "杭州", "roleId": "role1", "value": "杭州", "children": [
                    {"roleName": "人事", "roleId": "role11"},
                    {"roleName": "销售", "roleId": "role12"},
                    {"roleName": "培训专员", "roleId": "role12"},
                    {"roleName": "行政", "roleId": "role12"},
                    {"roleName": "前端开发", "roleId": "role12"},
                    {"roleName": "java开发", "roleId": "role12"},
                    {"roleName": "ui设计", "roleId": "role12"},
                    {"roleName": "软件测试", "roleId": "role12"},
                    {"roleName": "网络推广", "roleId": "role12"},
                    {"roleName": "美工", "roleId": "role12"}
                ]
            },
            {
                "roleName": "义乌", "roleId": "role2", "value": "义乌", "children": [
                    {"roleName": "翻译", "roleId": "role21"},
                    {"roleName": "搜品", "roleId": "role22"},
                    {"roleName": "人事", "roleId": "role23"},
                    {"roleName": "采购", "roleId": "role24"},
                    {"roleName": "打单", "roleId": "role25"},
                    {"roleName": "配货", "roleId": "role25"},
                    {"roleName": "发货", "roleId": "role25"},
                    {"roleName": "财务", "roleId": "role25"},
                    {"roleName": "经理助理", "roleId": "role25"},
                    {"roleName": "质检", "roleId": "role25"},
                    {"roleName": "上架", "roleId": "role25"},
                    {"roleName": "销售", "roleId": "role25"}
                ]
            }
        ];
        $scope.reasion = [
            {'text': "距离太远", "id": 0},
            {'text': "已经找到工作", "id": 1},
            {'text': "暂时不想找工作", "id": 2},
            {'text': "求职意向不相符", "id": 3},
            {'text': "先考虑下再联系", "id": 4},
            {'text': "还在外省，回来再联系", "id": 5}
        ]
        var inputPerson = localStorage.getItem("inputPerson") || '';
        var address = localStorage.getItem("address") || '';
        $scope.serinputPerson = inputPerson;

        //获取数据
        function getList(item) {
            erp.load();
            if ($scope.serquarters) {
                var quarters = $scope.serquarters.roleName;
            }
            if ($scope.serjobPlatforms) {
                var serjobPlatforms = $scope.serjobPlatforms.text;
            }
            console.log($scope.serquarters)
            erp.postFun('app/recruiting/queryTalents', {
                rname: init,
                phone: tel,
                region: $scope.serregion,
                jobPlatform: serjobPlatforms,
                quarters: quarters,
                inputPerson: $scope.serinputPerson,
                whetherRelation: $scope.serwhetherRelation,
                appointmentInfo: $scope.serappointmentInfo,
                appointmentBeginDate: $scope.serappointmentBeginDate,
                appointmentEndDate: $scope.serappointmentEndDate,
                createBeginDate: $scope.sercreateBeginDate,
                createEndDate: $scope.sercreateEndDate,
                page: $scope.pagenum,
                limit: $scope.pagesize
            }, con, err)

            function con(res) {
                erp.closeLoad();
                $scope.List = res.data.list;
                $scope.totalNum = res.data.count || 0;
                if ($scope.totalNum == 0) {
                    $scope.totalpage = 0;
                    $scope.List = [];
                    layer.msg("未找到相关数据");
                }
                $scope.totalpage = function () {
                    return Math.ceil(res.data.totalNum / $scope.pagesize)
                }
                pageFun();
            }

            function err(res) {
                erp.closeLoad();
                layer.msg("请求失败");
            }
        }

        //根据名字查询
        var init = "";
        var tel = "";
        $scope.textVal = $routeParams.name || '';
        //搜索
        $scope.searchq = function () {
            if (!isNaN($scope.textVal)) {
                tel = $scope.textVal
                init = ""
            } else {
                tel = ""
                init = $scope.textVal
            }
            $scope.pagenum = 1;
            getList()
        }
        $scope.searchq();
        //按下enter搜索
        $scope.enterSearch = function (event) {
            if (event.keyCode === 13 || event.keyCode === 108) {
                $scope.searchq();
            }
        }
        //重置
        $scope.clearClick = function () {
            init = "";
            tel = "";
            $scope.textVal = '';
            $scope.serregion = ''; //招聘地区
            $scope.serinputPerson = ''; //录入人
            $scope.serquarters = ''; //招聘岗位
            $scope.serjobPlatforms = ''; //招聘平台
            $scope.serwhetherRelation = ''; //是否联系
            $scope.serappointmentBeginDate = ''; //
            $scope.serappointmentEndDate = ''; //
            $scope.sercreateBeginDate = ''; //
            $scope.sercreateEndDate = ''; //
            $scope.serappointmentInfo = ''

            $("#appointmentBeginDate").val('')
            $("#appointmentEndDate").val('')
            $("#createBeginDate").val('')
            $("#createEndDate   ").val('')
            getList()
        }
        //点击行数加样式
        $scope.TrClick = function (i) {
            $scope.focus = i;
        }
        //岗位筛选
        $scope.changeAdress = function (selected1) {
            $scope.a = {}
            for (var i = 0; i < $scope.Adress.length; i++) {
                if ($scope.Adress[i].value == selected1) {
                    $scope.a = $scope.Adress[i].children;
                }
            }
            console.log($scope.a)
        };
        //
        $scope.isShoImg = false;
        $scope.autoSrc = '';
        $scope.nameClick = function (item) {
            console.log(item)
            $scope.isShoImg = true;
            $scope.imgarr = item.img;
            $scope.imgarr.forEach(function (o, i) {
                o.isboract = false;
                $scope.imgarr[0].isboract = true;
            })
            $scope.autoSrc = $scope.imgarr[0].src;
            console.log($scope.imgarr)
        }
        //
        $scope.imgClick = function (idx) {
            $scope.imgarr.forEach(function (o, i) {
                o.isboract = false;
                $scope.imgarr[idx].isboract = true;
                $scope.autoSrc = $scope.imgarr[idx].src;
            })
        }
        //
        $scope.addImg = function () {
            $('#upload-img').click();
        }
        $scope.imgList = [];
        $scope.upLoadImg = function (file) {
            console.log(file)
            var type = file[0].type.indexOf("image/") == -1;
            if (type) {
                layer.msg('请上传图片');
                return;
            }
            erp.ossUploadFile(file, function (data) {
                $('#upload-img').val('');
                console.log(data);
                if (data.code == 0) {
                    layer.msg('上传失败');
                    return;
                }
                if (data.code == 2) {
                    layer.msg('部分图片上传失败，请等待图片加载。');
                }
                if (data.code == 1) {
                    layer.msg('上传成功，请等待图片加载。');
                }
                var result = data.succssLinks;
                console.log(result)
                for (var i = 0; i < result.length; i++) {
                    $scope.imgList.push({
                        src: result[i]
                    });
                }
                console.log($scope.imgList);
                $scope.$apply();
            });
        }
        //
        $scope.removeImg = function (idx) {
            console.log(idx)
            $scope.imgList.splice(idx, 1);
        }

        //手机号和姓名检索
        $scope.searchName = function (val) {
            if ($scope.name) {
                erp.postFun('app/recruiting/checkTalents', {
                    rname: $scope.name,
                    phone: $scope.tel
                }, con, err)

                function con(reson) {
                    if (reson.data.result == 0) {
                        $scope.isnameSate = false;
                    } else {
                        $scope.isnameSate = true;
                        $scope.isname = false;
                        //$scope.name = $scope.name;
                    }
                }

                function err(res) {
                    layer.msg("请求失败")
                }
            }else {
                $scope.isnameSate = false;
            }
        }
        $scope.searchTel = function (val) {
            if ($scope.tel) {
                erp.postFun('app/recruiting/checkTalents', {
                    rname: $scope.name,
                    phone: $scope.tel
                }, con, err)

                function con(reson) {
                    if (reson.data.result == 0) {
                        $scope.istelSate = false;
                        $scope.istel = false;
                    } else {
                        $scope.istelSate = true;
                        $scope.istel = false;
                        //$scope.tel = '';
                    }
                }

                function err(res) {
                    layer.msg("请求失败")
                }
            }else {
                $scope.istelSate = false;
            }
        }
        $scope.nameRepeat = function () {
            window.open('#/staff/recruit/' + $scope.name);
        }
        $scope.PhoneRepeat = function(){
            window.open('#/staff/recruit/' + $scope.tel);
        }
        // 筛选
        $scope.showHideSerch = function ($event) {
            for (var i = 0; i < $scope.Adress.length; i++) {
                if ($scope.Adress[i].value == $scope.region) {
                    $scope.a = $scope.Adress[i].children
                }
            }
            var $this = $($event.currentTarget);
            $(".dropsearch").slideToggle();
            $this.toggleClass("shows");
            if ($this.hasClass("shows")) {
                $this.find('.text').html('收起筛选');
                $this.find('.caret').css('transform', 'rotate(180deg)');
            } else {
                $this.find('.text').html('展开筛选');
                $this.find('.caret').css('transform', 'rotate(0deg)');
            }
        }
        //点击新增或更新
        $scope.showModal = function (type, item) {
            if (type == "add") {
                $scope.showType = 'add';
                $(".titleName").text("录入人才")
                $('#addPeople').attr({
                    "data-toggle": "modal",
                    "data-target": "#myModal"
                })
                var inputPerson = localStorage.getItem("inputPerson");
                var address = localStorage.getItem("address");
                if (inputPerson || address) {
                    $scope.inputPerson = inputPerson || '';
                    $scope.region = address || '';
                } else {
                    $scope.inputPerson = '';
                    $scope.region = '';
                }
                $scope.isnameSate = false;
                $scope.istelSate = false;
                $scope.name = ''; //姓名
                $scope.tel = ''; //手机号
                $scope.message = ''; //信息
                $scope.ageVal = ''; //年龄
                $scope.educations = ''; //学历
                $scope.birthDate = ''; //出生日期
                $scope.sex = '男'; //性别
                $scope.resumeLink = '';
                $scope.quarters = ''; //招聘岗位
                $scope.jobPlatforms = ''; //招聘平台
                $scope.appointmentDate = ''; //预约时间
                $scope.whetherRelations = '未联系'; //是否联系
                $scope.appointmentInfos = '未确定'; //预约详情
                $scope.Reasion = ''; //备注
                $scope.a = {}
                for (var i = 0; i < $scope.Adress.length; i++) {
                    if ($scope.Adress[i].value == $scope.region) {
                        $scope.a = $scope.Adress[i].children
                    }
                }
            } else if (type == 'edit') {
                $scope.showType = 'edit';
                $(".titleName").text("修改资料")
                $('.edit').attr({
                    "data-toggle": "modal",
                    "data-target": "#myModal"
                });
                console.log(item)
                $scope.id = item.id;
                $scope.showtime = item.appointmentDate;
                $scope.UPwhetherRelation = item.whetherRelation;
                $scope.UPappointmentInfo = item.appointmentInfo;
                $scope.UPremark = item.remark;
                $scope.UPinterviewResult = item.interviewResult;
            }
        }
        //信息解析
        $scope.showMessage = function () {
            if ($scope.message) {
                if ($scope.message.indexOf("男") >= 0) {
                    $scope.sex = '男';
                } else if ($scope.message.indexOf("女") >= 0) {
                    $scope.sex = "女";
                }
                if ($scope.message.indexOf("本") >= 0) {
                    $scope.educations = "本科";
                } else if ($scope.message.indexOf("专") >= 0) {
                    $scope.educations = "大专";
                }
                var year2 = $scope.message.indexOf("19");
                var month = $scope.message.indexOf("月");
                var months = $scope.message.substring(year2, month);
                $scope.birthDate = months.replace('年', '-');
                var sui = $scope.message.indexOf("岁");
                $scope.ageVal = $scope.message.substring(sui - 2, sui);
            }
        }
        //时间搜索
        $scope.dateSearchFun = function () {
            erp.postFun('app/recruiting/queryTalents', {
                        appointmentBeginDate: $("#c-data-time").val(),
                        appointmentEndDate: $("#cdatatime2").val()
                    },
                    con,
                    err)

            function con(res) {
                getList()
            }

            function err(res) {
                layer.msg("保存失败")
            }
        }

        //表单验证
        function yanzheng() {
            if ($scope.name == '') {
                $scope.isname = true;
            } else {
                $scope.isname = false;
            }
            if ($scope.tel == '') {
                $scope.istel = true;
            } else {
                $scope.istel = false;
            }
            if ($scope.inputPerson == '') {
                $scope.isinputPerson = true;
            } else {
                $scope.isinputPerson = false;
            }
            if ($scope.region == '' || !$scope.region) {
                $scope.isregion = true;
            } else {
                $scope.isregion = false;
            }
            if ($scope.quarters == '' || !$scope.quarters) {
                $scope.isquarters = true;
            } else {
                $scope.isquarters = false;
            }
            if ($scope.jobPlatforms == '' || !$scope.jobPlatforms) {
                $scope.isjobPlatforms = true;
            } else {
                $scope.isjobPlatforms = false;
            }
            if (!$scope.isname && !$scope.istel && !$scope.isinputPerson && !$scope.isregion && !$scope.isquarters && !$scope.isjobPlatforms) {
                return true;
            } else {
                $scope.istelSate = false;
                $scope.isnameSate = false;
                return false;
            }
        }

        //保存
        $scope.savePeople = function () {
            if ($scope.showType == "add") {
                console.log($scope.name)
                if (yanzheng()) {
                    if ($scope.quarters) {
                        var quarters = $scope.quarters.roleName || '';
                    }
                    layer.load(2);
                    erp.postFun('app/recruiting/addTalents', {
                        rname: $scope.name,
                        phone: $scope.tel,
                        age: $scope.ageVal,
                        education: $scope.educations,
                        inputPerson: $scope.inputPerson,
                        birthDate: $scope.birthDate,
                        sex: $scope.sex,
                        resumeLink: $scope.resumeLink,
                        region: $scope.region,
                        quarters: quarters,
                        jobPlatform: $scope.jobPlatforms["text"] || '',
                        appointmentDate: $scope.appointmentDate,
                        whetherRelation: $scope.whetherRelations,
                        appointmentInfo: $scope.appointmentInfos,
                        remark: $scope.Reasion,
                        img: JSON.stringify($scope.imgList)
                    }, con, err)

                    function con(res) {
                        if (res.data.result == 1) {
                      /*      $(".table>tbody").prepend("<tr>" +
                                    "<td>#</td>" +
                                    "<td>" + $scope.name + "</td>" +
                                    "<td>" + $scope.sex + "</td>" +
                                    "<td>" + $scope.ageVal + "</td>" +
                                    "<td>" + $scope.birthDate + "</td>" +
                                    "<td>" + $scope.educations + "</td>" +
                                    "<td>" + $scope.region + "</td>" +
                                    "<td>" + $scope.quarters.roleName + "</td>" +
                                    "<td>" + $scope.tel + "</td>" +
                                    "<td>" + $scope.whetherRelations + "</td>" +
                                    "<td>" + $scope.jobPlatforms["text"] + "</td>" +
                                    "<td>" + $scope.appointmentDate + "</td>" +
                                    "<td>" + $scope.appointmentInfos + "</td>" +
                                    "<td></td>" +
                                    "<td>" + $scope.Reasion + "</td>" +
                                    "<td>" + $scope.inputPerson + "</td>" +
                                    "<td></td>" +
                                    '<td><button class="btn btn-success shows" onclick="location.reload();">更新</button></td>' +
                                    "</tr>")*/
                            $scope.searchq();
                            localStorage.setItem("inputPerson", $scope.inputPerson);
                            localStorage.setItem("address", $scope.region);
                            $('#myModal').modal('hide');
                            layer.closeAll('loading');
                            layer.msg("新增成功")
                        } else {
                            layer.msg("新增失败");
                        }
                    }

                    function err(res) {
                        layer.msg("新增失败");
                    }
                }
            } else if ($scope.showType == "edit") {
                erp.postFun('app/recruiting/upTalents', {
                            id: $scope.id,
                            appointmentDate: $scope.showtime,
                            whetherRelation: $scope.UPwhetherRelation,
                            appointmentInfo: $scope.UPappointmentInfo,
                            remark: $scope.UPremark,
                            interviewResult: $scope.UPinterviewResult
                        },
                        con, err)

                function con(res) {
                    if (res.data.result == 1) {
                        $scope.id = '';
                        $scope.showtime = '';
                        $scope.UPwhetherRelation = '';
                        $scope.UPappointmentInfo = '';
                        $scope.UPremark = '';
                        $scope.UPinterviewResult = '';
                        getList();
                        $('#myModal').modal('hide');
                        layer.msg("更新成功");
                    } else {
                        layer.msg("更新失败");
                    }

                }

                function err(res) {
                    layer.msg("请求失败")
                }
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

        $scope.pagechange = function (pagesize) {
            console.log(pagesize)
            $scope.pagenum = 1;
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
    }])
    //密码修改
    app.controller('staffpersoncenterCtrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('staffpersoncenterCtrl')
        var b = new Base64();
        $scope.userId = b.decode(localStorage.getItem('erpuserId'));
        $scope.loginName = b.decode(localStorage.getItem('erploginName'));

        function err(n) {
            console.log(n)
            alert('网络错误')
        }

        $scope.name = b.decode(localStorage.getItem('erpname'));
        // $scope.department=b.decode(localStorage.getItem('department'));
        $scope.number = b.decode(localStorage.getItem('erpnumber'));
        $scope.info = JSON.parse(b.decode(localStorage.getItem('erpinfo')));
        // $scope.position=b.decode(localStorage.getItem('position'));
        if ($scope.info.staff.department != null) {
            $scope.department = $scope.info.staff.department;
        }
        if ($scope.info.staff.position != null) {
            $scope.position = $scope.info.staff.position;
        }
        console.log($scope.name, $scope.loginName, $scope.department, $scope.position)
        $scope.edit = function () {
            console.log($scope.name, $scope.loginName, $scope.password, $scope.passwordagain)
            if ($scope.password == '' || $scope.passwordagain == '') {
                alert('请输入密码')
            } else if ($scope.password == $scope.passwordagain) {
                erp.postFun('app/employee/update', {"data": "{'id':'" + $scope.userId + "','loginName':'" + $scope.loginName + "','name':'" + $scope.name + "','password':'" + md5($scope.password )+ "','isEncryption':'2'}"}, con, err)

                function con(n) {
                    console.log(n.data);
                    if (n.data.statusCode == 200) {
                        alert('修改成功')
                        localStorage.clear();
                        location.href = 'login.html';
                    } else {
                        alert('修改失败')
                    }
                }
            } else {
                alert('密码不一致')
            }
        }
    }]);

    //上架链接
    app.controller('shelfLinkCtrl', ['$scope', 'erp', '$routeParams', function ($scope, erp, $routeParams){
        console.log('shelfLinkCtrl');
        $scope.pageNum='1';
        $scope.pageSize='20';

        getLinkList();
        //获取商品类目
		    erp.getCateList().then(res =>{
			    $scope.FirstList = res;
		    })

        //获取连接列表
        function getLinkList(){
            var data ={
                "page":$scope.pageNum,
                "pagesize":$scope.pageSize
            };
            erp.load();
            erp.postFun('erp/pieceworkAssessment/getAdressList',JSON.stringify(data),function(data){
                erp.closeLoad();
                //console.log(data);
                if(data.data.code=='200'){
                    var result =data.data.data;
                    $scope.linkList = result.list;
                    $scope.totalCounts = result.count;
                    console.log($scope.linkList);
                    pageFun();
                }else {
                    layer.msg('查询失败');
                }
            },function(n){
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
                    getLinkList();
                }
            });
        }
        //更换每页多少条数据
        $scope.pagesizechange = function (pagesize) {
            //console.log(pagesize)
            // $scope.pagesize=pagesize-0;
            $scope.pageNum = 1;
            getLinkList();
        };
        //手动输入页码GO跳转
        $scope.pagenumchange = function () {
            var pagenum = Number($scope.pageNum);
            var totalpage = Math.ceil($scope.totalCounts / $scope.pageSize);
            if (pagenum > totalpage) {
                layer.msg('错误页码');
                $scope.pageNum = 1;
            } else {
                getLinkList();
            }
        };
        //删除
        $scope.deleteLink=function(id){
            layer.confirm('确认要删除吗？', {
                btn : [ '确定', '取消' ]//按钮
            }, function(index) {
                layer.close(index);
                var data = {
                    "ID":id
                };
                erp.load();
                erp.postFun('erp/pieceworkAssessment/deleteAddress',JSON.stringify(data),function(data){
                    erp.closeLoad();
                    console.log(data);
                    if(data.data.code=='200'){
                        layer.msg('删除成功');
                        getLinkList();
                    }else if(data.data.code=='505'){
                        layer.msg('该任务已被领取，不能删除');
                    }else{
                        layer.msg('删除失败')
                    }
                },function(n){
                    console.log(n);
                    erp.closeLoad();
                });
            });


        }


        //一级类目选择二级类目
        $('.add-content #firstCatory').change(function(){
            var id = $(this).val();
            var parentList = $scope.FirstList;
            $.each(parentList,function(i,v){
                if(v.id==id){
                    console.log(v.children);
                    $scope.secondList = v.children;
                    $scope.thirdList=[];
                    $scope.$apply();
                }
            });
        });
        //二级类目选择三级类目
        $('.add-content #SecondCatory').change(function(){
            var id = $(this).val();
            var parentid = $('.add-content #firstCatory').val();
            var parentList = $scope.FirstList;
            console.log(parentid);
            $.each(parentList,function(i,v){
                if(v.id==parentid){
                    var childList =v.children;
                    $.each(childList,function(i,v){
                        if(v.id==id){
                            console.log(v.children);
                            $scope.thirdList =v.children;
                            $scope.$apply();
                        }
                    });
                }
            });
        });

        //列表 一级类目选择二级
        $('.table-content').on('change','select[name="firstCatory"]',function(){
            var id = $(this).val();
            console.log(id);
            var parentList = $scope.FirstList;
            $.each(parentList,function(i,v){
                if(v.id==id){
                    //console.log(v.children);
                    $scope.secondList2 = v.children;
                    $scope.thirdList3=[];
                    $scope.$apply();
                }
            });
        });
        //列表 二级选三级
        $('.table-content').on('change','select[name="SecondCatory"]',function(){
            var id = $(this).val();
            var parentid = $(this).prev('select[name="firstCatory"]').val();
            var parentList = $scope.FirstList;
            console.log(parentid);
            $.each(parentList,function(i,v){
                if(v.id==parentid){
                    var childList =v.children;
                    $.each(childList,function(i,v){
                        if(v.id==id){
                            console.log(v.children);
                            $scope.thirdList3 =v.children;
                            $scope.$apply();
                        }
                    });
                }
            });
        });
        //新增
        $('.addDiv>span').click(function(){
            $('.add-content').show().find('.lianjie>input').val('');
        });
        //取消
        $scope.quxiao=function(){
            $('.add-content').hide();
        };
        //确认添加
        $scope.addLinkFun=function(){
            var firstId = $('.add-content #firstCatory').val();
            var sesondId = $('.add-content #SecondCatory').val();
            var thirdId = $('.add-content #ThirdCatory').val();
            var name = $('.add-content #ThirdCatory>option:selected').text();
            var link =$('.add-content .lianjie>input').val();
            if(firstId==''){
                layer.msg('请选择一级类目');
            }else if(sesondId==''){
                layer.msg('请选择二级类目');
            }else if(thirdId==''){
                layer.msg('请选择三级类目');
            }else if(link=='' || link==null || link==undefined){
                layer.msg('请填写链接地址');
            }else{
                var data = {
                    "categoryId":thirdId,
                    "onecategory":firstId,
                    "twocategory":sesondId,
                    "address":link,
                    "categoryname":name
                };
                console.log(data);
                erp.load();
                erp.postFun('erp/pieceworkAssessment/addAdress',JSON.stringify(data),function(data){
                    erp.closeLoad();
                    console.log(data);
                    if(data.data.code=='200'){
                        layer.msg('新增成功');
                        //localStorage.setItem('firstCategory',firstId);
                        //localStorage.setItem('secondCategory',sesondId);
                        //localStorage.setItem('thirdCategory',thirdId);
                        $('.add-content').hide();
                        getLinkList();
                    }else{
                        layer.msg('新增失败');
                    }
                },function(n){
                    erp.closeLoad();
                    console.log(n);
                });
            }
        }
        //编辑
        $('.table-content').on('click','.editBtn',function(e){
            var target =$(this);
            var targetLi = $(this).parent().parent();
            if(targetLi.siblings('.act').length>0){
                layer.msg('请先保存修改');
            }else{
                targetLi.addClass('act');
                var link = targetLi.find('.shangjialink').attr('href');
                targetLi.find('input[name="shangjialink"]').val(link);
                var firstId = targetLi.attr('data-first');
                var secondId = targetLi.attr('data-second');
                var thirdId = targetLi.attr('data-third');
                //console.log(firstId,secondId,thirdId);//var parentList = $scope.FirstList;
                var select = targetLi.find('select[name="firstCatory"]');
                var select2 = targetLi.find('select[name="SecondCatory"]');
                var select3 = targetLi.find('select[name="ThirdCatory"]');
                select.val(firstId);
                var parentList = $scope.FirstList;
                $.each(parentList,function(i,v){
                    if(v.id==firstId){
                        console.log(v.children);
                        $scope.secondList2 = v.children;
                        //$scope.thirdList3=[];
                        $scope.$apply();
                        select2.val(secondId);
                        var secondList = v.children;
                        $.each(secondList,function(i,v){
                            if(v.id==secondId){
                                $scope.thirdList3 =v.children;
                                $scope.$apply();
                                select3.val(thirdId);
                            }
                        });
                    }
                });
            }
        });
        //取消编辑
        $('.table-content').on('click','.quxiaoBtn',function(e){
            var target =$(this);
            var targetLi = $(this).parent().parent();
            targetLi.removeClass('act');
        });

        //保存修改
        $('.table-content').on('click','.saveBtn',function(){
            var target =$(this);
            var targetLi = $(this).parent().parent();
            var id= targetLi.attr('data-id');
            var select = targetLi.find('select[name="firstCatory"]');
            var select2 = targetLi.find('select[name="SecondCatory"]');
            var select3 = targetLi.find('select[name="ThirdCatory"]');
            var firstId = select.val();
            var secondId = select2.val();
            var thirdId = select3.val();
            var link = targetLi.find('.lianjie>input').val();
            var name = select3.find('option:selected').text();
            var data = {
                "categoryId":thirdId,
                "onecategory":firstId,
                "twocategory":secondId,
                "address":link,
                "categoryname":name,
                "ID":id
            }
            //console.log(data);
            erp.load();
            erp.postFun('erp/pieceworkAssessment/updateAdress',JSON.stringify(data),function(data){
                console.log(data);
                erp.closeLoad();
                if(data.data.code=='200'){
                    layer.msg('修改成功');
                    getLinkList();
                }else if(data.data.code=='505'){
                    layer.msg('该任务已被领取，不能修改');
                }else {
                    layer.msg('修改失败');
                }
            },function(n){
                console.log(n);
                erp.closeLoad();
            });
        });

        $scope.classState=function(state){
            if(state=='0'){
                return '未领取';
            }else if(state=='1'){
                return '已领取';
            }
        }
    }]);

    //我的任务
    app.controller('myTaskCtrl', ['$scope', 'erp', '$routeParams', function ($scope, erp, $routeParams){
        console.log('myTaskCtrl');
        $scope.pageNum='1';
        $scope.pageSize='20';
        $scope.state='';
        $scope.starttime='';
        $scope.endtime='';

        getTaskList();
        function getTaskList(){
            var data={
                "page":$scope.pageNum,
                "pagesize":$scope.pageSize,
                "state":$scope.state,
                "starttime":$scope.starttime,
                "endtime":$scope.endtime
            };
            erp.load();
            erp.postFun('erp/pieceworkAssessment/getTaskList',JSON.stringify(data),function(data){
                erp.closeLoad();
                //console.log(data);
                if(data.data.code=='200'){
                    var result = data.data.data;
                    console.log(result);
                    $scope.taskList = result.list;
                    $scope.totalCounts = result.tocalcount;
                    pageFun();
                }else{
                    layer.msg('查询失败');
                }
            },function(){
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
                    getTaskList();
                }
            });
        }

        //状态筛选
        $('#TaskStatus').change(function(){
            var state = $(this).val();
            //console.log(state);
            $scope.state=state;
            getTaskList();
        });

        //时间查询
        $('.searchBtn').click(function(){
            var starttime = $('#c-data-time').val();
            var endtime =$('#cdatatime2').val();
            console.log(starttime,endtime);
            $scope.starttime=starttime;
            $scope.endtime=endtime;
            getTaskList();
        });

        //删除
        $scope.deleteFun=function(id){
            layer.confirm('确认要删除吗？', {
                btn : [ '确定', '取消' ]//按钮
            }, function(index) {
                layer.close(index);
                //此处请求后台程序，下方是成功后的前台处理……
                var data ={
                    "ID":id
                };
                erp.load();
                erp.postFun('erp/pieceworkAssessment/deleteTaskListByID',JSON.stringify(data),function(data){
                    erp.closeLoad();
                    if(data.data.code=='200'){
                        layer.msg('删除成功');
                        getTaskList();
                    }else {
                        layer.msg('删除失败');
                    }
                },function(n){
                    console.log(n);
                    erp.closeLoad();
                });
            });
        }

        //更换每页多少条数据
        $scope.pagesizechange = function (pagesize) {
            //console.log(pagesize)
            // $scope.pagesize=pagesize-0;
            $scope.pageNum = 1;
            getTaskList();
        };
        //手动输入页码GO跳转
        $scope.pagenumchange = function () {
            var pagenum = Number($scope.pageNum);
            var totalpage = Math.ceil($scope.totalCounts / $scope.pageSize);
            if (pagenum > totalpage) {
                layer.msg('错误页码');
                $scope.pageNum = 1;
            } else {
                getTaskList();
            }
        };
        $scope.classState=function(state){
            if(state=='0'){
                return '未录入';
            }else if(state=='1'){
                return '已录入';
            }
        };
        $scope.classNull=function(n){
            if(n==null || n=='' || n==undefined){
                return '0';
            }else{
                return n;
            }
        };

        //点击查看商品
        // window.open('manage.html#/merchandise/show-detail/' + item.id + '/' + $scope.merchanFlag + '/' + $scope.merchanStatus+'/'+(item.productType||0), '_blank', '');
        //manage.html#/merchandise/show-detail/853F3D55-D2C3-4E35-A51C-D24543D72885/0/3/0
        $scope.showDetails=function(locproductId){
            console.log(locproductId);
            window.open('manage.html#/merchandise/show-detail/' +locproductId + '/0/3/0' , '_blank', '');
        };

        $scope.luru=function(categoryId,id){
            //"/merchandise/addSKU2/taskid=" + id + '/' + categoryId + '/0'
            window.open('manage.html#/merchandise/addSKU2/taskid='+id+'/'+ categoryId+'/0', '_blank', '');
        }
    }]);
    //难度设置
    app.controller('diffSettingCtrl', ['$scope', 'erp', '$routeParams', function ($scope, erp, $routeParams){
        console.log('diffSettingCtrl');
		    erp.getCateList().then(res =>{
			    $scope.FirstList = res;
		    })

        //点击一级类目
        $('.firstNav').on('click','li',function(e){
            e.stopPropagation();
            e.preventDefault();
            var target =$(this);
            var type =target.attr('data-type');
            //console.log(type);
            if(type=='1'){
                target.addClass('act').siblings('.act').removeClass('act');
                target.find('.secondNav>li.act').removeClass('act');
            }else if(type=='2'){
                target.addClass('act').siblings('.act').removeClass('act');
            }

        });
        //修改
        $('.firstNav').on('click','.diffBtn-2',function(){
           var target = $(this).parent().parent();
            target.find('.difficulty').addClass('active');
            var jichufen = target.find('.jichufen').html();
            var zenjiafen =target.find('.zenjiafen').html();
            var zenjiafen2 = target.find('.zenjiafen2').html();
            target.find('input[name="jichufen"]').val(jichufen);
            target.find('input[name="zenjiafen"]').val(zenjiafen);
            target.find('input[name="zenjiafen2"]').val(zenjiafen2);
        });
        //确认修改
        $('.firstNav').on('click','.setBtn',function(e){
            e.preventDefault();
            var target = $(this).parent().parent();
            console.log(target);
            var jichufen = target.find('input[name="jichufen"]').val();
            var zenjiafen = target.find('input[name="zenjiafen"]').val();
            var zenjiafen2 = target.find('input[name="zenjiafen2"]').val();
            var id = target.attr('data-id');
            var data = {
                "categoryId":id,
                "baseScore":jichufen,
                "variantNum":zenjiafen,
                "variantScore":zenjiafen2
            };
            console.log(data);
            erp.load();
            erp.postFun('erp/pieceworkAssessment/setCategoryScore',JSON.stringify(data),function(data){
                erp.closeLoad();
                console.log(data);
                if(data.data.code=='200'){
                    layer.msg('设置成功');
                    target.find('.jichufen').html(jichufen);
                    target.find('.zenjiafen').html(zenjiafen);
                    target.find('.zenjiafen2').html(zenjiafen2);
                    target.find('.difficulty').removeClass('active');
                }else{
                    layer.msg('设置失败');
                }
            },function(){
                erp.closeLoad();
                layer.msg('Network error, please try again later');
            });
        });
        $('.firstNav').on('click','.cancelBtn',function(){
            var target = $(this).parent().parent();
            target.find('.difficulty').removeClass('active');
        });

    }]);
    //领取任务
    app.controller('getTaskCtrl', ['$scope', 'erp', '$routeParams','$location', function ($scope, erp, $routeParams,$location){
        console.log('getTaskCtrl');
        $scope.onecategory='';//一级类目id
        $scope.twocategory='';//二级
        $scope.categoryId='';//三级
        getCatory();
        getTaskList();
        function getCatory(){
            erp.load();
            erp.getFun('erp/pieceworkAssessment/categorylist?pid=',function(data){
                erp.closeLoad();
                //console.log(data);
                if(data.data.code=='200'){
                    var result = data.data.data;
                    console.log(result);
                    $scope.FirstList = result;
                }else{
                    layer.msg('Get the category list error');
                }
            },function(){
                erp.closeLoad();
                layer.msg('Network error, please try again later');
            });
        }
        //获取任务列表
        function getTaskList(){
            var data ={
                "onecategory":$scope.onecategory,
                "twocategory":$scope.twocategory,
                "categoryId":$scope.categoryId
            }
            erp.load();
            erp.postFun('erp/pieceworkAssessment/getTaskListByCategoryId',JSON.stringify(data),function(data){
                erp.closeLoad();
                console.log(data);
                if(data.data.code=='200'){
                    var result = data.data.data;
                    console.log(result);
                    $scope.entryCount= result.entryCount;
                    $scope.backlogCount=result.backlogCount;
                    $scope.taskList = result.list;
                }else{
                    layer.msg('Get the category list error');
                }
            },function(){
                erp.closeLoad();
                layer.msg('Network error, please try again later');
            });
        }
        $('.firstNav').on('click','li',function(e){
            e.stopPropagation();
            e.preventDefault();
            var target =$(this);
            var type= target.attr('data-type');
            target.addClass('act').siblings('.act').removeClass('act');
            if(type=='1'){
                $scope.onecategory=target.attr('data-id');
                $scope.twocategory='';
                $scope.categoryId='';
                target.find('.secondNav>li.act').removeClass('act');
            }else if(type=='2'){
                $scope.twocategory=target.attr('data-id');
                $scope.onecategory='';
                $scope.categoryId='';
            }else if(type=='3'){
                $scope.onecategory='';
                $scope.twocategory='';
                $scope.categoryId=target.attr('data-id');
            }
            getTaskList();
        });
        //查看链接
        $('.task-right').on('click','.lookLink',function(e){
            e.preventDefault();
            var link = $(this).attr('href');
            if(link=='' || link==undefined || link==null){
                layer.msg('该任务没有链接');
            }else{
                window.open(link);
            }
        });
        //领取任务
        $scope.lingqu=function(categoryId,id){
            var data = {
                "addressId":id
            };

            erp.load();
            erp.postFun('erp/pieceworkAssessment/getTask',JSON.stringify(data),function(data){
                erp.closeLoad();
                if(data.data.code=='200'){
                    layer.msg('领取成功');
                    var newTab=window.open('about:blank');
                    newTab.location.href='manage.html#/merchandise/addSKU2/taskid='+id+'/'+ categoryId+'/0';
                    getTaskList();
                }else if(data.data.code=='505'){
                    layer.msg('你已经领取三个任务了，请先完成任务');
                }else if(data.data.code=='509'){
                    layer.msg('该任务已被领取或者被删除，请选择其他任务领取');
                }
            },function(){
                erp.closeLoad();
                layer.msg('Network error, please try again later');
            });
            //function newWindow(){
            //    console.log('领取成功');
            //    window.open('https://www.baidu.com/','_blank', '');
            //};

            //window.open("/merchandise/addSKU2/" + $scope.addMerchId + '/' + $scope.selectedCategoryId + '/' + $scope.merchType);
        }
    }]);
    //链接组考核
    app.controller('linkAssessmentCtrl', ['$scope', 'erp', '$routeParams','$location', function ($scope, erp, $routeParams,$location){
        console.log('linkAssessmentCtrl');
        $scope.pageNum='1';
        $scope.pageSize='8';
        $scope.name='';
        $scope.starttime='';
        $scope.endtime='';

        getaddressCount();
        getTaskGroupRankingList();
        getAddressByToday();
        //左上
        function getaddressCount(){
            erp.load();
            erp.postFun('erp/pieceworkAssessment/addressCount',{},function(data){
                erp.closeLoad();
                if(data.data.code=='200'){
                    var result = data.data.data;
                    console.log(result);
                    $scope.todaycount=result.todaycount;
                    $scope.totalcount=result.totalcount;
                    var compare = result.compare;
                    var week = compare.week;
                    var day = compare.day;
                    if(week>0){
                        $scope.week = week;
                        $('#zhou').addClass('up').removeClass('down');
                    }else if(week<0){
                        $scope.week = week*(-1);
                        $('#zhou').addClass('down').removeClass('up');
                    }else{
                        $scope.week = week;
                        $('#zhou').removeClass('down').removeClass('up');
                    }
                    if(day>0){
                        $scope.day = day;
                        $('#ri').addClass('up').removeClass('down');
                    }else if(day<0){
                        $scope.day = day*(-1);
                        $('#ri').addClass('down').removeClass('up');
                    }else{
                        $scope.day = day;
                        $('#ri').removeClass('down').removeClass('up');
                    }
                }
            },function(n){
                console.log(n);
                erp.closeLoad();
            });
        }
        //左下
        function getAddressByToday(){
            var data = {
                "page":$scope.pageNum,
                "pagesize":$scope.pageSize,
                "name":$scope.name,
                "starttime":$scope.starttime,
                "endtime":$scope.endtime
            };
            erp.load();
            erp.postFun('erp/pieceworkAssessment/addressByToday',JSON.stringify(data),function(data){
                erp.closeLoad();
                if(data.data.code=='200'){
                    var result = data.data.data;
                    console.log(result);
                    $scope.addressList = result.list;
                    $scope.totalCounts = result.count;
                    $scope.time = result.time;
                    pageFun();
                }
            },function(n){
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
                    getAddressByToday();
                }
            });
        }
        //搜索
        $scope.searchFun=function(){
            $scope.name = $('#searchName').val();
            $scope.starttime =$('#c-data-time').val();
            $scope.endtime =$('#cdatatime2').val();
            if($scope.endtime==''){
                getAddressByToday();
            }else{
                if($scope.starttime==''){
                    layer.msg('请选择开始日期');
                }else{
                    getAddressByToday();
                }
            }

        }
        //手动输入页码GO跳转
        $scope.pagenumchange = function () {
            var pagenum = Number($scope.pageNum);
            var totalpage = Math.ceil($scope.totalCounts / $scope.pageSize);
            if (pagenum > totalpage) {
                layer.msg('错误页码');
                $scope.pageNum = 1;
            } else {
                getAddressByToday();
            }
        };

        //右下
        function getTaskGroupRankingList(){
            erp.load();
            erp.postFun('erp/pieceworkAssessment/addressGroupRankingList',{},function(data){
                erp.closeLoad();
                if(data.data.code=='200'){
                    var result = data.data.data;
                    console.log(result);
                    $scope.taskList = result;
                }
            },function(n){
                console.log(n);
                erp.closeLoad();
            });
        }
        //右上
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        getSeriaData();

        function getSeriaData(){
            erp.load();
            erp.postFun('erp/pieceworkAssessment/addressCountByMonth',{},function(data){
                if(data.data.code=='200'){
                    //console.log(data.data);
                    var seriaData=data.data.data;
                    console.log(seriaData);
                    var option = {
                        color: ['#3398DB'],
                        //tooltip : {
                        //    trigger: 'axis',
                        //    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        //        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        //    }
                        //},
                        grid: {
                            left: '3%',
                            right: '7%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis : [
                            {
                                type : 'category',
                                data : ['1', '2', '3', '4', '5', '6', '7','8','9','10','11','12'],
                                axisTick: {
                                    alignWithLabel: true
                                },
                                name:'月份'
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                name:'数量'
                            }
                        ],
                        series : [
                            {
                                name:'数量',
                                type:'bar',
                                barWidth: '60%',
                                itemStyle : {
                                    normal : {
                                        label: {
                                            show: true,
                                            position: 'top',
                                            textStyle: {
                                                color: 'black'
                                            }
                                        }
                                    }
                                },
                                data:seriaData
                            }
                        ]
                    };
                    myChart.setOption(option);
                }
            },function(n){
                console.log(n);
                erp.closeLoad();
            });
        }
        //var seriaData=[10, 52, 200, 334, 390, 330, 220,800,700,500,112,532];
        // 指定图表的配置项和数据

    }]);
    //绩效组考核
    app.controller('enterAssessmentCtrl', ['$scope', 'erp', '$routeParams','$location', function ($scope, erp, $routeParams,$location){
        console.log('enterAssessmentCtrl');
        $scope.pageNum='1';
        $scope.pageSize='8';
        $scope.name='';
        $scope.starttime='';
        $scope.endtime='';

        getaddressCount();
        getSeriaData();
        getAddressByToday();
        getTaskGroupRankingList();
        //左上
        function getaddressCount(){
            erp.load();
            erp.postFun('erp/pieceworkAssessment/taskCount',{},function(data){
                erp.closeLoad();
                if(data.data.code=='200'){
                    var result = data.data.data;
                    console.log(result);
                    $scope.todaycount=result.todaycount;
                    $scope.totalcount=result.totalcount;
                    var compare = result.compare;
                    var week = compare.week;
                    var day = compare.dat;
                    if(week>0){
                        $scope.week = week;
                        $('#zhou').addClass('up').removeClass('down');
                    }else if(week<0){
                        $scope.week = week*(-1);
                        $('#zhou').addClass('down').removeClass('up');
                    }else{
                        $scope.week = week;
                        $('#zhou').removeClass('down').removeClass('up');
                    }
                    if(day>0){
                        $scope.day = day;
                        $('#ri').addClass('up').removeClass('down');
                    }else if(day<0){
                        $scope.day = day*(-1);
                        $('#ri').addClass('down').removeClass('up');
                    }else{
                        $scope.day = day;
                        $('#ri').removeClass('down').removeClass('up');
                    }
                }
            },function(n){
                console.log(n);
                erp.closeLoad();
            });
        }
        //右上
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
        function getSeriaData(){
            erp.load();
            erp.postFun('erp/pieceworkAssessment/taskCountByMonth',{},function(data){
                if(data.data.code=='200'){
                    //console.log(data.data);
                    var seriaData=data.data.data;
                    console.log(seriaData);
                    var option = {
                        color: ['#3398DB'],
                        //tooltip : {
                        //    trigger: 'axis',
                        //    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        //        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        //    }
                        //},
                        grid: {
                            left: '3%',
                            right: '7%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis : [
                            {
                                type : 'category',
                                data : ['1', '2', '3', '4', '5', '6', '7','8','9','10','11','12'],
                                axisTick: {
                                    alignWithLabel: true
                                },
                                name:'月份'
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                name:'数量'
                            }
                        ],
                        series : [
                            {
                                name:'数量',
                                type:'bar',
                                barWidth: '60%',
                                itemStyle : {
                                    normal : {
                                        label: {
                                            show: true,
                                            position: 'top',
                                            textStyle: {
                                                color: 'black'
                                            }
                                        }
                                    }
                                },
                                data:seriaData
                            }
                        ]
                    };
                    myChart.setOption(option);
                }
            },function(n){
                console.log(n);
                erp.closeLoad();
            });
        }

        //左下
        function getAddressByToday(){
            var data = {
                "page":$scope.pageNum,
                "pagesize":$scope.pageSize,
                "name":$scope.name,
                "starttime":$scope.starttime,
                "endtime":$scope.endtime
            };
            erp.load();
            erp.postFun('erp/pieceworkAssessment/taskByToday',JSON.stringify(data),function(data){
                erp.closeLoad();
                if(data.data.code=='200'){
                    var result = data.data.data;
                    console.log(result);
                    $scope.addressList = result.list;
                    $scope.totalCounts = result.count;
                    $scope.time = result.time;
                    pageFun();
                }
            },function(n){
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
                    getAddressByToday();
                }
            });
        }
        //搜索
        $scope.searchFun=function(){
            $scope.name = $('#searchName').val();
            $scope.starttime =$('#c-data-time').val();
            $scope.endtime =$('#cdatatime2').val();
            if($scope.endtime==''){
                getAddressByToday();
            }else{
                if($scope.starttime==''){
                    layer.msg('请选择开始日期');
                }else{
                    getAddressByToday();
                }
            }

        }
        //手动输入页码GO跳转
        $scope.pagenumchange = function () {
            var pagenum = Number($scope.pageNum);
            var totalpage = Math.ceil($scope.totalCounts / $scope.pageSize);
            if (pagenum > totalpage) {
                layer.msg('错误页码');
                $scope.pageNum = 1;
            } else {
                getAddressByToday();
            }
        };

        //右下
        function getTaskGroupRankingList(){
            erp.load();
            erp.postFun('erp/pieceworkAssessment/taskGroupRankingList',{},function(data){
                        //erp/pieceworkAssessment/taskGroupRankingList
                erp.closeLoad();
                if(data.data.code=='200'){
                    var result = data.data.data;
                    console.log(result);
                    $scope.taskList = result;
                }
            },function(n){
                console.log(n);
                erp.closeLoad();
            });
        }

    }]);
    //入库绩效统计
    app.controller('kpiRkjxTjCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        //客户页面
        console.log(erp.isAdminLogin())
        $scope.isAdminFlag = erp.isAdminLogin()
        $scope.pagesize = '50';
        $scope.pagenum = '1';
        $scope.totalNum = 0;
        // ----------------------------------------------
        $scope.date_option_list = [
            { txt: '今天', type: '1', activeColor: true },
            { txt: '本周', type: '7', activeColor: false },
            { txt: '本月', type: '30', activeColor: false },
            { txt: '三个月', type: '90', activeColor: false }
        ]
        $scope.start_time = ''
        $scope.end_time = ''
        $scope.date_type = $scope.date_option_list[0].type
        // ----------------------------------------------
        getList();
        function getList(item) {
            if ('object' === typeof item) { // 点击背景换色
                $scope.date_option_list = $scope.date_option_list.map(ele => {
                    ele.activeColor = ele === item ? true : false
                    return ele
                })
            }
            erp.load()
            var upData = {
                startTime:$scope.start_time,
                endTime:$scope.end_time,
                page:$scope.pagenum,
                pageSize: $scope.pagesize,
                data:{
                    type:$scope.date_type,
                    userName:$scope.searchSku
                }
            };
            // upData.startTime = $scope.start_time
            // upData.endTime = $scope.end_time
            // upData.data.type = $scope.date_type
            // upData.userName = $scope.searchSku
            // upData.page = $scope.pagenum
            // upData.pageSize = $scope.pagesize
            //storage/tongJiRuKuInfo/getTongJiInfo
            erp.postFun('storehouseSimple/inventoryRecord/getStorageRecordStatistics',JSON.stringify(upData), con, err)
            function con(n) {
                console.log(n)
                erp.closeLoad();
                if (n.data.code == 200) {
                    $scope.listArr = n.data.data.list;
                    console.log($scope.listArr)
                    $scope.totalNum = n.data.data.count || 0;
                    if (n.data.totalNum == 0) {
                        $scope.totalpage = 0;
                        $scope.listArr = [];
                    }
                    $scope.totalpage = function () {
                        return Math.ceil(n.data.totalNum / $scope.pagesize)
                    }
                    pageFun();
                } else if (n.data.code == '403') {
                    layer.msg('没有该权限')
                }
            }
        }
        $scope.timeSFun = function () {
            $scope.pagenum = '1'
            $scope.date_type = ''
            $scope.start_time = $('#start-time').val()
            $scope.end_time = $('#end-time').val()
            if (!$scope.start_time) return layer.msg('请选择开始日期')
            else {
                $scope.date_option_list = $scope.date_option_list.map(item => {
                    item.activeColor = false
                    return item
                })
                getList();
            }
        }
        // $scope.searchFun = function () {
        //     $scope.pagenum = '1';
        //     getList();
        // }
        $scope.getListByClick = function (item) {
            $scope.pagenum = '1';
            $scope.start_time = ''
            $scope.end_time = ''
            $('#start-time').val('')
            $('#end-time').val('')
            $scope.date_type = item.type;
            getList(item);
        }
        $('.sku-inp').keypress(function(event) {
            if(event.keyCode==13){
                $scope.searchFun()
            }
        });
        //分页
        function pageFun() {
            if($scope.totalNum<1){
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
                    $scope.pagenum = n;
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
            if ($scope.pagenum>Math.ceil($scope.totalNum / $scope.pagesize)) {
                console.log(Math.ceil($scope.totalNum / $scope.pagesize))
                layer.msg('输入的页码不能大于总页码')
                return
            }
            getList();
        }
        function err() {
            layer.msg('系统异常')
        }
    }])

    //修改员工密码
    app.controller('UpdateYGPWdCtrl', ['$scope', 'erp', '$routeParams','$location', function ($scope, erp, $routeParams,$location){
        console.log('UpdateYGPWdCtrl');
        var base64 = new Base64();
        var job = base64.decode(localStorage.getItem('job') == undefined ? "" : localStorage.getItem('job'));
        console.log(job);
        if(job.trim()=='管理'){
            $scope.job = 'admin';
        }else{
            $scope.job = 'other';
        }
        $scope.updateFlag=false;
        //获取业务云列表
        $('#SearchInput').on('input',function(){
            var val = $(this).val();
            //console.log(val);
            var data = {
                companyname:'',
                name:val,
                pageNum:'1',
                pageSize:'999999'
            };
            var sendData ={
                data:JSON.stringify(data)
            };
            //console.log(sendData);
            //erp.load();
            erp.postFun('app/employee/stafflist',JSON.stringify(sendData),function(data){
                //erp.closeLoad();
                //console.log(data);
                if(data.data.statusCode=='200'){
                    var result = JSON.parse(data.data.result);
                    //console.log(result);
                    $scope.pList = result.info;
                    $('.DropWrap').show();
                }else{
                    layer.msg('查询失败')
                }
            },function(){
                //erp.closeLoad();
            })
        });
        //选择业务员
        //$('.DropWrap').on('click','li',function(){
        //    console.log('1111');
        //});
        $scope.checkFun=function(item){
            console.log(item);
            var id = item.id;
            //erp.load();
            //erp.postFun('app/employee/getupdate', {"data":"{'userId':'"+id+"'}" },function(data){
            //    erp.closeLoad();
            //    console.log(data.data);
            //},function(){
            //    erp.closeLoad();
            //});
            var name = item.name;
            $scope.updateFlag=false;
            $scope.ywyName = name;
            $('.updateBtn').attr('data-id',id);
            $('.DropWrap').hide();
            $('#pwdInput').val('');
        };
        $('.updateBtn').click(function(){
            var id = $(this).attr('data-id');
            if(id=='' || id==null || id==undefined){
                layer.msg('请选择用户');
            }else if($scope.pwd==''){
                layer.msg('请输入密码');
            }else{
                var data= {
                    id:id,
                    password:md5($scope.pwd),
                    loginName:'',
                    name:'',
                    isEncryption:'2'
                };
                var sendData = {
                    data:JSON.stringify(data)
                };
                console.log(sendData);
                erp.load();
                erp.postFun('app/employee/update',JSON.stringify(sendData),function(data){
                    erp.closeLoad();
                    console.log(data);
                    if(data.data.statusCode=='200'){
                        layer.msg('修改成功');
                        $scope.updateFlag=true;
                        $('#SearchInput').val('');
                    }
                },function(){
                    erp.closeLoad();
                });
            }


        });
        //$('#SearchInput').blur(function(){
        //    $('.DropWrap').hide();
        //});
    }]);

    //pod商品积分统计
    app.controller('podIntergralCtrl', ['$scope', 'erp', 'utils', function($scope, erp, utils) {
        console.log('podIntergralCtrl')

        $scope.dateType = 'one'                                      //三个时间删选
        $scope.pageNum = 1
        $scope.pageSize = '20'
        $scope.startDate = ''
        $scope.endDate = ''
        $scope.canShowPage = true


        //方法
        //获取列表
        getList()
        function getList() {
            let params = {
                pageNum: Number($scope.pageNum),
                pageSize: Number($scope.pageSize)
            }

            if ($scope.dateType) {
                const { start, end } = getTimeRange()
                params = Object.assign(params, { beginDate: start, endDate: end })
            } else {
                params = Object.assign(params, { beginDate: $scope.startDate, endDate: $scope.endDate })
            }
            erp.postFun('otherData/podProductPieceword/list', JSON.stringify(params), ({ data }) => {
                const { data: { list, total } } = data

                $scope.podList = list.map(pod => {
                    const { podProductNumber, noPodProductNumber } = pod
                    pod.jifen = parseFloat((podProductNumber * 0.1 + noPodProductNumber * 0.08).toFixed(2))
                    return pod
                })
                $scope.totalCounts = total
                $scope.canShowPage = list.length > 0
                pageFun()

            }, error => {
                layer.msg('网络错误')
            }, { layer: true })
        }
        //搜索
        $scope.search = () => {
            let flag = true

			if (!$scope.startDate && !$scope.endDate) {
				if (!$scope.dateType) {
					$scope.dateType = 'one'
				}
			} else if (!$scope.startDate && $scope.endDate) {
				layer.msg('请先选择开始日期')
				flag = false
			} else if ($scope.startDate) {
				if (!$scope.endDate) {
					let now = new Date()
					$scope.endDate = utils.changeTime(now.getTime())
				}

                let { can, message } = utils.judgeSearchTime($scope.startDate, $scope.endDate)

				if (!can) {
					layer.msg(message)
					flag = false
				} else {
					$scope.dateType = ''
				}
			}

			if (flag) {
                $scope.pageNum = 1
				getList()
			}
        }

        $scope.searchByDateType = type => {
            $scope.pageNum = 1
            $scope.dateType = type
            $scope.startDate = ''
            $scope.endDate = ''
            getList()
        }

        //根据时间类型获取时间
        function getTimeRange() {
            let now = new Date()
              , year = now.getFullYear()
              , month = now.getMonth() + 1
              , day = now.getDate()
              , today = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
              , result = { start: '', end: today }

            switch($scope.dateType) {
                case 'today':
                    result = Object.assign(result, { start: today })
                    break;
                case 'one':
                    result = Object.assign(result, { start: `${year}-${month < 10 ? '0'+ month : month}-01` })
                    break;
                case 'three':
                    result = Object.assign(result, { start: `${year}-${month - 2 < 10 ? '0' + (month - 2) : month - 2}-01`})
                    break;
            }

            return result
        }

        //分页
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
		//切换pagesize
		$scope.pagechange = function () {
			$scope.pageNum = 1
			getList()
		}
		//跳转第几页
		$scope.pagenumchange = function () {
			if (Number($scope.pageNum) <= 0) {
				$scope.pageNum = 1;
			}
			let pagenum = Number($scope.pageNum)
				, totalpage = Math.ceil($scope.totalCounts / $scope.pageSize)

			if (pagenum > totalpage) {
				layer.msg('错误页码');
				$scope.pageNum = 1;
			} else {
				getList();
			}
		}

    }])
})()
