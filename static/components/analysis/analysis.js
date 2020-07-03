(function(angular) {
    angular.module('manage')
        .component('customerAnalysis', {
            templateUrl: 'static/components/analysis/analysis.html',
            controller: analysisMerchandiseCtrl,
            bindings: {
                podarray: '=',
                showdetail: '=',
                no: '=',
                onLog: '&',
                showWorkOrder: '&',
                username:'='
            }
        });

    function analysisMerchandiseCtrl($scope, erp){
        console.log('analysisMerchandiseCtrl');
        var that = this;
        var userId = this.no.id;
        var name = this.no.name;
        console.log(this.no);
        $scope.name = name;
        //$scope.$on('log-to-id',function(d,flag){
        //    console.log(flag);
        //});
        var myChart = echarts.init(document.getElementById('main1'));
        var myChart2 = echarts.init(document.getElementById('main2'));
        var d = new Date();
        var y = d.getFullYear();
        gettjList('1',y,userId);
        function gettjList(type,time,id){
            var sendData={
                dateType:type,
                dateTime:time,
                paymentId:id
            };
            erp.load();
            erp.postFun('erp/analysis/analysisOrderChart',JSON.stringify(sendData),function(data){
                erp.closeLoad();
                console.log(data.data);
                if(data.data.statusCode=='200'){
                    var result = data.data.result;
                    var data1=[];
                    var data2=[];
                    var data4=[];
                    if(type=='1'){
                        var data3=['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
                        $.each(result,function(i,v){
                            data1.push(parseInt(v.cjocun));
                            data2.push(parseInt(v.ocount));
                            data4.push(parseFloat(v.money));
                        });
                        setTubiao1(data1,data2,data3);
                        setTubiao2(data3,data4);
                    }else if(type=='2'){
                        var data3=[];
                        $.each(result,function(i,v){
                            var str = v.payTime;
                            var arr = str.split('-')[2];
                            data3.push(arr);
                            data1.push(parseInt(v.cjocun));
                            data2.push(parseInt(v.ocount));
                            data4.push(parseFloat(v.money));
                        });
                        setTubiao1(data1,data2,data3);
                        setTubiao2(data3,data4);
                    }else if(type=='3'){
                        var data3=[];
                        $.each(result,function(i,v){
                            var str = v.payTime;
                            var arr = str.split('-')[2];
                            data3.push(arr);
                            data1.push(parseInt(v.cjocun));
                            data2.push(parseInt(v.ocount));
                            data4.push(parseFloat(v.money));
                        });
                        setTubiao1(data1,data2,data3);
                        setTubiao2(data3,data4);
                    }
                    $('.selsectTimeCon').removeClass('show');

                }else{
                    layer.msg('查询失败');
                }
            },function(){
                erp.closeLoad();
            });
        }
        function setTubiao1(data1,data2,data3){
            console.log(data1);
            console.log(data2);
            var serrData= [
                {
                    name:'CJ平台订单数量',
                    type:'line',
                    stack: '总量',
                    data:data1
                },
                {
                    name:'客户店铺订单数量',
                    type:'line',
                    stack: '总量2',
                    data:data2
                }

            ];
            var option = {
                color: ['#F5A623','#4A90E2'],
                tooltip: {
                    trigger: 'axis'
                },
                calculable:true,
                toolbox: {
                    show : false,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                legend: {
                    //type:'plain',
                    orient: 'vertical',
                    left:'0%',
                    top:'2%',
                    itemWidth:24,
                    itemHeight:6,
                    data:[{
                        name:"CJ平台订单数量",
                        icon:'roundRect'
                    },{
                        name:"客户店铺订单数量",
                        icon:'roundRect'
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
                    name:'日期'
                },
                yAxis: {
                    type: 'value'
                },
                series:serrData
            };
            myChart.setOption(option);
        }
        function setTubiao2(data3,data4){
            console.log(data3);
            console.log(data4);
            var serrData= [
                {
                    name:'CJ平台订单金额',
                    type:'line',
                    stack: '总量',
                    data:data4
                }

            ];
            var option = {
                color: ['#F5A623','#4A90E2'],
                tooltip: {
                    trigger: 'axis'
                },
                toolbox: {
                    show : false,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                legend: {
                    //type:'plain',
                    orient: 'vertical',
                    left:'0%',
                    top:'2%',
                    itemWidth:24,
                    itemHeight:6,
                    data:[{
                        name:"CJ平台订单金额",
                        icon:'roundRect'
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
                    name:'日期'
                },
                yAxis: {
                    type: 'value'
                },
                series:serrData
            };
            myChart2.setOption(option);
        }

        $scope.month=1;
        $scope.month2=1;

        $('.selectInput').click(function(){
            var target = $(this);
            var wrap = target.next('.selsectTimeCon');
            var parent = target.parent().parent().parent();
            var id = parent.attr('id');
            var date = new Date();
            var year = date.getFullYear();
            console.log(year);
            if(id.trim()=='statisticsWrap1'){
                if($scope.nowYear=='' || $scope.nowYear==null || $scope.nowYear==undefined){
                    $scope.nowYear = year;
                }
                if($scope.ThisYear=='' || $scope.ThisYear==null || $scope.ThisYear==undefined){
                    $scope.ThisYear= year;
                }
            }else if(id.trim()=='statisticsWrap2'){
                if($scope.nowYear2=='' || $scope.nowYear2==null || $scope.nowYear2==undefined){
                    $scope.nowYear2 = year;
                }
                if($scope.ThisYear2=='' || $scope.ThisYear2==null || $scope.ThisYear2==undefined){
                    $scope.ThisYear2= year;
                }
            }
            if(wrap.hasClass('show')){
                wrap.removeClass('show');
            }else{
                wrap.addClass('show');
                wrap.find('.selectTime1').show();
                wrap.find('.selectTime2').hide();
                wrap.find('.selectTime3').hide();
                $scope.$apply();
            }
        });
        $('.selsectTimeCon').on('click','.searchBtn',function(){
            var target = $(this);
            var wrap = target.parent().parent().parent();
            //查询

            //成功后关闭
            wrap.hide();
        });


        //跳转下一步
        $('.selsectTimeCon').on('click','.select-btn .nextBtn',function(){
            var target = $(this);
            var parent = target.parent().parent();
            var id = parent.attr('data-id');
            var next = parent.next();
            var wrap = parent.parent().parent().parent().parent();
            var wrapId = wrap.attr('id');
            parent.hide();
            if(id.trim()=='selectTime2'){
                var act = parent.find('span.active');
                var month = parseInt(act.children('span').html());
                if(wrapId.trim()=='statisticsWrap1'){
                    $scope.month=month;
                }else if(wrapId.trim()=='statisticsWrap2'){
                    $scope.month2=month;
                }
            }
            next.find('span.active').removeClass('active');
            next.find('.row').eq(0).find('span').eq(0).addClass('active');
            next.show();
            $scope.$apply();
        });
        //上一年下一年
        $('.selsectTimeCon').on('click','.select-top>span',function(){
            var target = $(this);
            var wrap = target.parent().parent().parent();
            var content = target.parent().parent();
            var contentId = content.attr('data-id');
            var wrapId = content.parent().parent().parent().parent().attr('id');
            var index= $(this).index();
            if(index==0){
                //console.log('prev');
                //var y = $scope.ThisYear;
                var spanact = content.find('.select-bottom span.active');
                var index_1 = spanact.index();
                if(index_1>0){
                    //不需要查找上层
                    var ele = spanact.prev('span');
                    if(contentId.trim()=='selectTime1'){
                        if(wrapId.trim()=='statisticsWrap1'){
                            $scope.ThisYear = $scope.ThisYear-1;
                        }else if(wrapId.trim()=='statisticsWrap2'){
                            $scope.ThisYear2 = $scope.ThisYear2-1;
                        }
                        $scope.$apply();
                    }
                    content.find('span.active').removeClass('active');
                    ele.addClass('active');
                }else{
                    //查找上层
                    var parent = spanact.parent();
                    var index_2 = parent.index();
                    if(index_2>0){
                        //不是第一层
                        var parentele = parent.prev('.row');
                        if(contentId.trim()=='selectTime3'){
                            var ele=parentele.find('span').eq(1);
                            content.find('span.active').removeClass('active');
                            ele.addClass('active');
                        }else{
                            if(contentId.trim()=='selectTime1'){
                                var ele = parentele.find('span').eq(2);
                                if(wrapId.trim()=='statisticsWrap1'){
                                    $scope.ThisYear = $scope.ThisYear-1;
                                }else if(wrapId.trim()=='statisticsWrap2'){
                                    $scope.ThisYear2 = $scope.ThisYear2-1;
                                }
                                $scope.$apply();
                                content.find('span.active').removeClass('active');
                                ele.addClass('active');
                            }else if(contentId.trim()=='selectTime2'){
                                var ele = parentele.find('span.month2').eq(2);
                                content.find('span.active').removeClass('active');
                                ele.addClass('active');
                            }
                        }
                    }else{
                        //往前移动一年
                        if(contentId.trim()=='selectTime1'){
                            if(wrapId.trim()=='statisticsWrap1'){
                                $scope.ThisYear = $scope.ThisYear-1;
                                $scope.nowYear = $scope.nowYear-1;
                            }else if(wrapId.trim()=='statisticsWrap2'){
                                $scope.ThisYear2 = $scope.ThisYear2-1;
                                $scope.nowYear2 = $scope.nowYear2-1;
                            }
                            $scope.$apply();
                        }else if(contentId.trim()=='selectTime2'){
                            if(wrapId.trim()=='statisticsWrap1'){
                                $scope.ThisYear = $scope.ThisYear-1;
                            }else if(wrapId.trim()=='statisticsWrap2'){
                                $scope.ThisYear2 = $scope.ThisYear2-1;
                            }
                            var selectTime1 = content.prev('.selectTime1');
                            var selectTime1Act = selectTime1.find('.select-bottom span.active');
                            var index3 = selectTime1Act.index();
                            if(index3>0){
                                //var prev = selectTime1Act.prev('span');
                                selectTime1Act.removeClass('active').prev('span').addClass('active');
                            }else{
                                var parent2 = selectTime1Act.parent();
                                var index4 = parent2.index();
                                if(index4>0){
                                    selectTime1Act.removeClass('active');
                                    parent2.prev().find('span').eq(2).addClass('active');
                                }else{
                                    if(wrapId.trim()=='statisticsWrap1'){
                                        $scope.nowYear = $scope.nowYear-1;
                                    }else if(wrapId.trim()=='statisticsWrap2'){
                                        $scope.nowYear2 = $scope.nowYear2-1;
                                    }
                                }
                            }
                            spanact.removeClass('active');
                            content.find('.row').eq(3).find('span.month2').eq(2).addClass('active');
                            $scope.$apply();
                        }else if(contentId.trim()=='selectTime3'){
                            if(wrapId.trim()=='statisticsWrap1'){
                                $scope.month = $scope.month-1;
                                if($scope.month==0){
                                    $scope.month=12;
                                }
                            }else if(wrapId.trim()=='statisticsWrap2'){
                                $scope.month2 = $scope.month2-1;
                                if($scope.month2==0){
                                    $scope.month2=12;
                                }
                            }
                            var select2 = content.prev('.selectTime2');
                            var select2Act = select2.find('.select-bottom span.active');
                            var index5 = select2Act.index();
                            if(index5>0){
                                //月份不用移至上一行
                                select2Act.removeClass('active').prev('span.month2').addClass('active');
                            }else{
                                var parent3 = select2Act.parent();
                                var index6 = parent3.index();
                                if(index6>0){
                                    //月份移至上一行
                                    select2Act.removeClass('active');
                                    parent3.prev().find('span.month2').eq(2).addClass('active');
                                }else{
                                    //需要移动年份
                                    if(wrapId.trim()=='statisticsWrap1'){
                                        $scope.ThisYear = $scope.ThisYear-1;
                                    }else if(wrapId.trim()=='statisticsWrap2'){
                                        $scope.ThisYear2 = $scope.ThisYear2-1;
                                    }
                                    var select3 = select2.prev('.selectTime1');
                                    var select3Act = select3.find('.select-bottom span.active');
                                    var index7 = select3Act.index();
                                    if(index7>0){
                                        //年份不用移至上一行
                                        select3Act.removeClass('active').prev('span').addClass('active');
                                    }else{
                                        var parent4 = select3Act.parent();
                                        var index8 = parent4.index();
                                        if(index8>0){
                                            //年份移至上一行
                                            select3Act.removeClass('active');
                                            parent4.prev().find('span').eq(2).addClass('active');
                                        }else{
                                            //年份往前一年
                                            if(wrapId.trim()=='statisticsWrap1'){
                                                $scope.nowYear = $scope.nowYear-1;
                                            }else if(wrapId.trim()=='statisticsWrap2'){
                                                $scope.nowYear2 = $scope.nowYear2-1;
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
            }else if(index==2){
                var spanact = content.find('.select-bottom span.active');
                var index_1 = spanact.index();
                if(contentId.trim()=='selectTime3'){
                    //周
                    if(index_1<1){
                        //不用移至下一行
                        spanact.removeClass('active').next('span').addClass('active');
                    }else{
                        var parent = spanact.parent();
                        var index_3 = parent.index();
                        if(index_3<1){
                            //可以移至下一行
                            var nextparent = parent.next('.row');
                            nextparent.find('span').eq(0).addClass('active');
                            spanact.removeClass('active');
                        }else{
                            //往下移动月份
                            var monthWrap =  content.prev('.selectTime2');
                            var actMonth = monthWrap.find('.month2.active');
                            var index_4 = actMonth.index();
                            if(index_4<2){
                                //月份不用换行，直接移至下一个月
                                actMonth.removeClass('active').next('span.month2').addClass('active');
                            }else{
                                var actRow = actMonth.parent();
                                var index_5 = actRow.index();
                                if(index_5<3){
                                    //月份往下移一行
                                    var nextRow = actRow.next('.row');
                                    actMonth.removeClass('active');
                                    nextRow.find('span.month2').eq(0).addClass('active');
                                }else{
                                    //需要移动年份
                                    var yearWrap = monthWrap.prev('.selectTime1');
                                    var actYear = yearWrap.find('.active');
                                    var index_6 = actYear.index();
                                    actMonth.removeClass('active');
                                    monthWrap.find('.row').eq(0).find('.month2').eq(0).addClass('active');
                                    if(index_6<2){
                                        //年份不用换行，直接移至下一年
                                        actYear.removeClass('active').next('span').addClass('active');
                                    }else{
                                        var actYearRow = actYear.parent();
                                        var index_7 = actYearRow.index();
                                        if(index_7<3){
                                            //年份往下一行
                                            var nextYearRow = actYearRow.next('.row');
                                            actYear.removeClass('active');
                                            nextYearRow.find('span').eq(0).addClass('active');
                                        }else{
                                            if(wrapId.trim()=='statisticsWrap1'){
                                                $scope.nowYear+=1;
                                            }else if(wrapId.trim()=='statisticsWrap2'){
                                                $scope.nowYear2+=1;
                                            }
                                        }
                                    }
                                    if(wrapId.trim()=='statisticsWrap1'){
                                        $scope.ThisYear+=1;
                                    }else if(wrapId.trim()=='statisticsWrap2'){
                                        $scope.ThisYear2+=1;
                                    }
                                }
                            }
                            if(wrapId.trim()=='statisticsWrap1'){
                                if($scope.month<12){
                                    $scope.month+=1;
                                }else{
                                    $scope.month=1;
                                }
                            }else if(wrapId.trim()=='statisticsWrap2'){
                                if($scope.month2<12){
                                    $scope.month2+=1;
                                }else{
                                    $scope.month2=1;
                                }
                            }
                            spanact.removeClass('active');
                            content.find('.row').eq(0).find('span').eq(0).addClass('active');
                            $scope.$apply();
                        }
                    }
                }else{
                    if(index_1<2){
                        var ele = spanact.next('span');
                        if(contentId.trim()=='selectTime1'){
                            if(wrapId.trim()=='statisticsWrap1'){
                                $scope.ThisYear = $scope.ThisYear+1;
                            }else if(wrapId.trim()=='statisticsWrap2'){
                                $scope.ThisYear2 = $scope.ThisYear2+1;
                            }
                            $scope.$apply();
                        }
                        content.find('span.active').removeClass('active');
                        ele.addClass('active');
                    }else{
                        var parent = spanact.parent();
                        var index_2 = parent.index();
                        if(index_2<3){
                            //移至下一行
                            var parentele = parent.next('.row');
                            if(contentId.trim()=='selectTime1'){
                                var ele = parentele.find('span').eq(0);
                                if(wrapId.trim()=='statisticsWrap1'){
                                    $scope.ThisYear = $scope.ThisYear+1;
                                }else if(wrapId.trim()=='statisticsWrap2'){
                                    $scope.ThisYear2 = $scope.ThisYear2+1;
                                }
                                $scope.$apply();
                                spanact.removeClass('active');
                                ele.addClass('active');
                            }else if(contentId.trim()=='selectTime2'){
                                var ele = parentele.find('span').eq(0);
                                spanact.removeClass('active');
                                ele.addClass('active');
                            }
                        }else{
                            if(contentId.trim()=='selectTime1'){
                                if(wrapId.trim()=='statisticsWrap1'){
                                    $scope.ThisYear = $scope.ThisYear+1;
                                    $scope.nowYear = $scope.nowYear+1;
                                }else if(wrapId.trim()=='statisticsWrap2'){
                                    $scope.ThisYear2 = $scope.ThisYear2+1;
                                    $scope.nowYear2 = $scope.nowYear2+1;
                                }
                            }else if(contentId.trim()=='selectTime2'){
                                if(wrapId.trim()=='statisticsWrap1'){
                                    $scope.ThisYear = $scope.ThisYear+1;
                                }else if(wrapId.trim()=='statisticsWrap2'){
                                    $scope.ThisYear2 = $scope.ThisYear2+1;
                                }
                                var selectTime1 = content.prev('.selectTime1');
                                var selectTime1Act = selectTime1.find('.select-bottom span.active');
                                var index3 = selectTime1Act.index();
                                if(index3<2){
                                    //var prev = selectTime1Act.prev('span');
                                    selectTime1Act.removeClass('active').next('span').addClass('active');
                                }else{
                                    var parent2 = selectTime1Act.parent();
                                    var index4 = parent2.index();
                                    if(index4<3){
                                        selectTime1Act.removeClass('active');
                                        parent2.next().find('span').eq(0).addClass('active');
                                    }else{
                                        if(wrapId.trim()=='statisticsWrap1'){
                                            $scope.nowYear = $scope.nowYear+1;
                                        }else if(wrapId.trim()=='statisticsWrap2'){
                                            $scope.nowYear2 = $scope.nowYear2+1;
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
            }else if(index==1){
                //返回上一步
                if(contentId.trim()!='selectTime1'){
                    var prev = content.prev();
                    content.hide();
                    prev.show();
                }
            }
        });
        $('.selsectTimeCon').on('click','.row>span',function(){
            var target = $(this);
            var parent = target.parent().parent().parent();
            var parentId = parent.attr('data-id');
            var wrap  = parent.parent().parent().parent().parent();
            var id = wrap.attr('id');
            console.log(id);
            if(parentId.trim()=='selectTime1'){
                var thisYear= parseInt(target.html());
                if(id.trim()=='statisticsWrap1'){
                    $scope.ThisYear = thisYear;
                }else if(id.trim()=='statisticsWrap2'){
                    $scope.ThisYear2 = thisYear;
                }
                $scope.$apply();
            }else if(parentId.trim()=='selectTime2'){
                //var arr = target.html().split('');
                var month =  parseInt(target.find('span').html());
                if(id.trim()=='statisticsWrap1'){
                    $scope.month = month;
                }else if(id.trim()=='statisticsWrap2'){
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
        $('.selsectTimeCon').on('click','.select-btn .searchBtn',function(){
            var target =$(this);
            var parent = target.parent().parent();
            var wrap = parent.parent().parent().parent().parent();
            var parentId = parent.attr('data-id');
            var wrapId = wrap.attr('id');
            if(wrapId=='statisticsWrap1'){
                //订单量
                if(parentId=='selectTime1'){
                    //查询年份
                    var startTime=$scope.ThisYear+'-01-01';
                    var endTime=$scope.ThisYear+'-12-31';
                    console.log(startTime,endTime);
                    wrap.find('.selectInput').val($scope.ThisYear);
                    gettjList('1',$scope.ThisYear,userId);
                }else if(parentId =='selectTime2'){
                    //查询年月
                    var startTime='';
                    var endTime='';
                    var time='';
                    if($scope.month==2){
                        if(isLeapYear($scope.ThisYear)){
                            //是闰年 29
                            startTime=$scope.ThisYear+'-0'+$scope.month+'-'+'1';
                            endTime=$scope.ThisYear+'-0'+$scope.month+'-'+'29';
                            time=$scope.ThisYear+'-0'+$scope.month;
                        }else{
                            startTime=$scope.ThisYear+'-0'+$scope.month+'-'+'1';
                            endTime=$scope.ThisYear+'-0'+$scope.month+'-'+'28';
                            time=$scope.ThisYear+'-0'+$scope.month;
                        }
                    }else if($scope.month==1|| $scope.month==3 || $scope.month==5 || $scope.month==7 || $scope.month==8 || $scope.month==10 || $scope.month==12){
                        if($scope.month>9){
                            startTime=$scope.ThisYear+'-'+$scope.month+'-'+'01';
                            endTime=$scope.ThisYear+'-'+$scope.month+'-'+'31';
                            time=$scope.ThisYear+'-'+$scope.month;
                        }else{
                            startTime=$scope.ThisYear+'-0'+$scope.month+'-'+'01';
                            endTime=$scope.ThisYear+'-0'+$scope.month+'-'+'31';
                            time=$scope.ThisYear+'-0'+$scope.month;
                        }
                    }else{
                        if($scope.month>9){
                            startTime=$scope.ThisYear+'-'+$scope.month+'-'+'01';
                            endTime=$scope.ThisYear+'-'+$scope.month+'-'+'30';
                            time=$scope.ThisYear+'-'+$scope.month;
                        }else{
                            startTime=$scope.ThisYear+'-0'+$scope.month+'-'+'01';
                            endTime=$scope.ThisYear+'-0'+$scope.month+'-'+'30';
                            time=$scope.ThisYear+'-0'+$scope.month;
                        }
                    }
                    console.log(startTime,endTime);
                    wrap.find('.selectInput').val(time);
                    gettjList('2',time,userId);
                }else if(parentId=='selectTime3'){
                    //查询年月周
                    var week = parent.find('span.active').html();
                    var startTime='';
                    var endTime='';
                    var time ='';
                    if(week.trim()=='第一周'){
                        if($scope.month>9){
                            startTime=$scope.ThisYear+'-'+$scope.month+'-'+'01';
                            endTime=$scope.ThisYear+'-'+$scope.month+'-'+'07';
                            time=$scope.ThisYear+'-'+$scope.month+'-'+'07';
                        }else{
                            startTime=$scope.ThisYear+'-0'+$scope.month+'-'+'01';
                            endTime=$scope.ThisYear+'-0'+$scope.month+'-'+'07';
                            time=$scope.ThisYear+'-0'+$scope.month+'-'+'07';
                        }

                    }else if(week.trim()=='第二周'){
                        if($scope.month>9){
                            startTime=$scope.ThisYear+'-'+$scope.month+'-'+'08';
                            endTime=$scope.ThisYear+'-'+$scope.month+'-'+'14';
                            time=$scope.ThisYear+'-'+$scope.month+'-'+'14';
                        }else{
                            startTime=$scope.ThisYear+'-0'+$scope.month+'-'+'08';
                            endTime=$scope.ThisYear+'-0'+$scope.month+'-'+'14';
                            time=$scope.ThisYear+'-0'+$scope.month+'-'+'14';
                        }
                    }else if(week.trim()=='第三周'){
                        if($scope.month>9){
                            startTime=$scope.ThisYear+'-'+$scope.month+'-'+'15';
                            endTime=$scope.ThisYear+'-'+$scope.month+'-'+'21';
                            time=$scope.ThisYear+'-'+$scope.month+'-'+'21';
                        }else{
                            startTime=$scope.ThisYear+'-0'+$scope.month+'-'+'15';
                            endTime=$scope.ThisYear+'-0'+$scope.month+'-'+'21';
                            time=$scope.ThisYear+'-0'+$scope.month+'-'+'21';
                        }

                    }else if(week.trim()=='第四周'){
                        if($scope.month==2){
                            if(isLeapYear($scope.ThisYear)){
                                //是闰年 29
                                startTime=$scope.ThisYear+'-0'+$scope.month+'-'+'22';
                                endTime=$scope.ThisYear+'-0'+$scope.month+'-'+'29';
                                time=$scope.ThisYear+'-0'+$scope.month+'-'+'28';
                            }else{
                                startTime=$scope.ThisYear+'-0'+$scope.month+'-'+'22';
                                endTime=$scope.ThisYear+'-0'+$scope.month+'-'+'28';
                                time=$scope.ThisYear+'-0'+$scope.month+'-'+'28';
                            }
                        }else if($scope.month==1|| $scope.month==3 || $scope.month==5 || $scope.month==7 || $scope.month==8 || $scope.month==10 || $scope.month==12){
                            if($scope.month>9){
                                startTime=$scope.ThisYear+'-'+$scope.month+'-'+'22';
                                endTime=$scope.ThisYear+'-'+$scope.month+'-'+'31';
                                time=$scope.ThisYear+'-'+$scope.month+'-'+'28';
                            }else{
                                startTime=$scope.ThisYear+'-0'+$scope.month+'-'+'22';
                                endTime=$scope.ThisYear+'-0'+$scope.month+'-'+'31';
                                time=$scope.ThisYear+'-0'+$scope.month+'-'+'28';
                            }
                        }else{
                            if($scope.month>9){
                                startTime=$scope.ThisYear+'-'+$scope.month+'-'+'22';
                                endTime=$scope.ThisYear+'-'+$scope.month+'-'+'30';
                                time=$scope.ThisYear+'-'+$scope.month+'-'+'28';
                            }else{
                                startTime=$scope.ThisYear+'-0'+$scope.month+'-'+'22';
                                endTime=$scope.ThisYear+'-0'+$scope.month+'-'+'30';
                                time=$scope.ThisYear+'-0'+$scope.month+'-'+'28';
                            }
                        }
                    }
                    console.log(startTime,endTime);
                    wrap.find('.selectInput').val(time);
                    gettjList('3',time,userId);
                }
            }else if(wrapId=='statisticsWrap2'){
                //订单金额
                if(parentId=='selectTime1'){
                    //查询年份
                    var startTime=$scope.ThisYear2+'-01-01';
                    var endTime=$scope.ThisYear2+'-12-31';
                    console.log(startTime,endTime);
                    wrap.find('.selectInput').val($scope.ThisYear2);
                }else if(parentId =='selectTime2'){
                    //查询年月
                    var startTime='';
                    var endTime='';
                    var time =''
                    if($scope.month2==2){
                        if(isLeapYear($scope.ThisYear2)){
                            //是闰年 29
                            startTime=$scope.ThisYear2+'-0'+$scope.month2+'-'+'1';
                            endTime=$scope.ThisYear2+'-0'+$scope.month2+'-'+'29';
                            time=$scope.ThisYear2+'-0'+$scope.month2;
                        }else{
                            startTime=$scope.ThisYear2+'-0'+$scope.month2+'-'+'1';
                            endTime=$scope.ThisYear2+'-0'+$scope.month2+'-'+'28';
                            time=$scope.ThisYear2+'-0'+$scope.month2;
                        }
                    }else if($scope.month2==1|| $scope.month2==3 || $scope.month2==5 || $scope.month2==7 || $scope.month2==8 || $scope.month2==10 || $scope.month2==12){
                        if($scope.month2>9){
                            startTime=$scope.ThisYear2+'-'+$scope.month2+'-'+'01';
                            endTime=$scope.ThisYear2+'-'+$scope.month2+'-'+'31';
                            time=$scope.ThisYear2+'-'+$scope.month2;
                        }else{
                            startTime=$scope.ThisYear2+'-0'+$scope.month2+'-'+'01';
                            endTime=$scope.ThisYear2+'-0'+$scope.month2+'-'+'31';
                            time=$scope.ThisYear2+'-0'+$scope.month2;
                        }
                    }else{
                        if($scope.month2>9){
                            startTime=$scope.ThisYear2+'-'+$scope.month2+'-'+'01';
                            endTime=$scope.ThisYear2+'-'+$scope.month2+'-'+'30';
                            time=$scope.ThisYear2+'-'+$scope.month2;
                        }else{
                            startTime=$scope.ThisYear2+'-0'+$scope.month2+'-'+'01';
                            endTime=$scope.ThisYear2+'-0'+$scope.month2+'-'+'30';
                            time=$scope.ThisYear2+'-0'+$scope.month2;
                        }
                    }
                    console.log(startTime,endTime);
                    wrap.find('.selectInput').val(time);
                }else if(parentId=='selectTime3'){
                    //查询年月周
                    var week = parent.find('span.active').html();
                    var startTime='';
                    var endTime='';
                    if(week.trim()=='第一周'){
                        if($scope.month2>9){
                            startTime=$scope.ThisYear2+'-'+$scope.month2+'-'+'01';
                            endTime=$scope.ThisYear2+'-'+$scope.month2+'-'+'07';
                        }else{
                            startTime=$scope.ThisYear2+'-0'+$scope.month2+'-'+'01';
                            endTime=$scope.ThisYear2+'-0'+$scope.month2+'-'+'07';
                        }
                    }else if(week.trim()=='第二周'){
                        if($scope.month2>9){
                            startTime=$scope.ThisYear2+'-'+$scope.month2+'-'+'08';
                            endTime=$scope.ThisYear2+'-'+$scope.month2+'-'+'14';
                        }else{
                            startTime=$scope.ThisYear2+'-0'+$scope.month2+'-'+'08';
                            endTime=$scope.ThisYear2+'-0'+$scope.month2+'-'+'14';
                        }
                    }else if(week.trim()=='第三周'){
                        if($scope.month2>9){
                            startTime=$scope.ThisYear2+'-'+$scope.month2+'-'+'15';
                            endTime=$scope.ThisYear2+'-'+$scope.month2+'-'+'21';
                        }else{
                            startTime=$scope.ThisYear2+'-0'+$scope.month2+'-'+'15';
                            endTime=$scope.ThisYear2+'-0'+$scope.month2+'-'+'21';
                        }

                    }else if(week.trim()=='第四周'){
                        if($scope.month2==2){
                            if(isLeapYear($scope.ThisYear2)){
                                //是闰年 29
                                startTime=$scope.ThisYear2+'-0'+$scope.month2+'-'+'22';
                                endTime=$scope.ThisYear2+'-0'+$scope.month2+'-'+'29';
                            }else{
                                startTime=$scope.ThisYear2+'-0'+$scope.month2+'-'+'22';
                                endTime=$scope.ThisYear2+'-0'+$scope.month2+'-'+'28';
                            }
                        }else if($scope.month2==1|| $scope.month2==3 || $scope.month2==5 || $scope.month2==7 || $scope.month2==8 || $scope.month2==10 || $scope.month2==12){
                            if($scope.month2>9){
                                startTime=$scope.ThisYear2+'-'+$scope.month2+'-'+'22';
                                endTime=$scope.ThisYear2+'-'+$scope.month2+'-'+'31';
                            }else{
                                startTime=$scope.ThisYear2+'-0'+$scope.month2+'-'+'22';
                                endTime=$scope.ThisYear2+'-0'+$scope.month2+'-'+'31';
                            }
                        }else{
                            if($scope.month2>9){
                                startTime=$scope.ThisYear2+'-'+$scope.month2+'-'+'22';
                                endTime=$scope.ThisYear2+'-'+$scope.month2+'-'+'30';
                            }else{
                                startTime=$scope.ThisYear2+'-0'+$scope.month2+'-'+'22';
                                endTime=$scope.ThisYear2+'-0'+$scope.month2+'-'+'30';
                            }
                        }
                    }
                    console.log(startTime,endTime);
                }
            }

        });
        function isLeapYear(year) {
            return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
        }

        $scope.closeFun=function(){
            $scope.$emit('log-to-father', {closeFlag: false});
        }
    }
})(angular);