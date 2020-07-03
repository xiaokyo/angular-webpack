(function(){
    var app = angular.module('systemSettings-app',['service']);
    app.controller('systemSettingsCtrl', ['$scope', 'erp', function ($scope, erp) {
        console.log('systemSettingsCtrl');
        //角色页面 页面加载后获取角色列表
        $scope.jsList = [
            {
                "jsid":"1",
                "jsm":"管理员",
                "ywm":"guanliyuan",
                "jsms":"111",
                "kssj":"0",
                "jssj":"24"
            },{
                "jsid":"2",
                "jsm":"业务员",
                "ywm":"yewuyuan",
                "jsms":"111",
                "kssj":"8",
                "jssj":"22"
            }
        ];
        $scope.startTimelist=[
            {
                "time":'0',
                "checked":true
            },{
                "time":'1',
                "checked":false
            },{
                "time":'2',
                "checked":false
            },{
                "time":'3',
                "checked":false
            },{
                "time":'4',
                "checked":false
            },{
                "time":'5',
                "checked":false
            },{
                "time":'6',
                "checked":false
            },{
                "time":'7',
                "checked":false
            },{
                "time":'8',
                "checked":false
            },{
                "time":'9',
                "checked":false
            },{
                "time":'10',
                "checked":false
            },{
                "time":'11',
                "checked":false
            },{
                "time":'12',
                "checked":false
            },{
                "time":'13',
                "checked":false
            },{
                "time":'14',
                "checked":false
            },{
                "time":'15',
                "checked":false
            },{
                "time":'16',
                "checked":false
            },{
                "time":'17',
                "checked":false
            },{
                "time":'18',
                "checked":false
            },{
                "time":'19',
                "checked":false
            },{
                "time":'20',
                "checked":false
            },{
                "time":'21',
                "checked":false
            },{
                "time":'22',
                "checked":false
            },{
                "time":'23',
                "checked":false
            }
        ];
        $scope.endTimelist=[
            {
                "time":'1',
                "checked":false
            },{
                "time":'2',
                "checked":false
            },{
                "time":'3',
                "checked":false
            },{
                "time":'4',
                "checked":false
            },{
                "time":'5',
                "checked":false
            },{
                "time":'6',
                "checked":false
            },{
                "time":'7',
                "checked":false
            },{
                "time":'8',
                "checked":false
            },{
                "time":'9',
                "checked":false
            },{
                "time":'10',
                "checked":false
            },{
                "time":'11',
                "checked":false
            },{
                "time":'12',
                "checked":false
            },{
                "time":'13',
                "checked":false
            },{
                "time":'14',
                "checked":false
            },{
                "time":'15',
                "checked":false
            },{
                "time":'16',
                "checked":false
            },{
                "time":'17',
                "checked":false
            },{
                "time":'18',
                "checked":false
            },{
                "time":'19',
                "checked":false
            },{
                "time":'20',
                "checked":false
            },{
                "time":'21',
                "checked":false
            },{
                "time":'22',
                "checked":false
            },{
                "time":'23',
                "checked":false
            },{
                "time":'24',
                "checked":true
            }
        ]
        //新增角色
        $('.addJs').click(function(){
            $('#jsm').val('');
            $('#ywm').val('');
            $("#jsms").val('');
            $('#startTime').val('0');
            $('#endTime').val('24');
            $('.xzjszzc').show();
            $('.xzBtn').show();
            $('.updateJsBtn').hide();
        });
        $('.cancel').click(function(){
            $('.xzjszzc').find('h3').html('新增角色');
            $('.xzjszzc').hide();

        });
        $('.qxcancle').click(function(){
           $('.qxszzzc').hide();
        });
        //$('.qxszbtn').click(function(){
        //    $('.qxszzzc').show();
        //});
        $scope.qxszfn=function(jsid,name){
            //根据角色id获取对应的json格式字符串
            $('.qxszzzc').find('.dqjsxm').html(name);
            $('.qxszzzc').show();
        };
        $('.xzBtn').click(function(){
            var jsm = $('#jsm').val();
            var ywm = $('#ywm').val();
            var jsms =$("#jsms").val();
            var startTime = $('#startTime').val();
            var endTime = $('#endTime').val();
            //console.log(jsm,ywm,jsms);
            if(jsm==''){
                layer.msg('请填写角色名');
            }else if(ywm==''){
                layer.msg('请填写英文名');
            }else{
                //console.log('开始新增');
                var arr = $scope.jsList;
                //$('.xzjszzc').find('h3').html('新增角色');
                //发送请求，
                //如果成功
                $('.xzjszzc').hide();
                $('#jsm').val('');
                $('#ywm').val('');
                $('#jsms').val('');
                $('#startTime').val('0');
                $('#endTime').val('24');
                var jsData = {
                    "jsid":String(arr.length+1),
                    "jsm":jsm,
                    "ywm":ywm,
                    "jsms":jsms,
                    "kssj":startTime,
                    "jssj":endTime
                };
                arr.push(jsData);
                $scope.jsList=arr;
                console.log($scope.jsList);
                $scope.$apply();
            }
        });
        //修改角色
        $scope.xgjs =function(jsm,ywm,jsms,jsid,kssj,jssj){
            $('.xzjszzc').find('h3').html('修改角色');
            $('.xzjszzc').show();
            $('#jsm').val(jsm);
            $('#ywm').val(ywm);
            $('#jsms').val(jsms);
            $('.xzBtn').hide();
            //console.log(kssj);
            var option1=$('#startTime>option');
            $.each(option1,function(i,v){
                //console.log($(this).html());
                if($(this).html()==kssj){
                    $(this).prop('selected',true).siblings('option').prop('selected',false);
                }
            });
            var option2 = $('#endTime>option');
            $.each(option2,function(i,v){
                if($(this).html()==jssj){
                    $(this).prop('selected',true).siblings('option').prop('selected',false);
                }
            });
            $('.updateJsBtn').show();
            $('.updateJsBtn').attr('data-jsid',jsid);
        };
        $('.updateJsBtn').click(function(){
            var jsm = $('#jsm').val();
            var ywm = $('#ywm').val();
            var jsms =$("#jsms").val();
            var startt=$('#startTime').val();
            var endt=$('#endTime').val();
            console.log(startt,endt);
            if(jsm==''){
                layer.msg('请填写角色名');
            }else if(ywm==''){
                layer.msg('请填写英文名');
            }else{
                //console.log('开始修改');
                var a = parseInt(startt);
                var b = parseInt(endt);
                if(a>=b){
                    layer.msg('结束时间必须大于开始时间');
                    return;
                }else{
                    var arr = $scope.jsList;
                    var jsid = $(this).attr('data-jsid');
                    //console.log(jsid);
                    $.each(arr,function(i,v){
                        if(v.jsid==jsid){
                            v.jsm=jsm;
                            v.ywm=ywm;
                            v.jsms=jsms;
                            v.kssj=startt;
                            v.jssj=endt;
                        }
                    });
                    $scope.jsList=arr;
                    console.log($scope.jsList);
                    $scope.$apply();
                    $('.xzjszzc').hide();
                }
            }
        });
        $scope.scjs=function(id,index){
            var i = index;
            var arr = $scope.jsList
            layer.confirm('确认要删除吗？', {
                btn : [ '确定', '取消' ]//按钮
            }, function(index) {
                layer.close(index);
                //此处请求后台程序，下方是成功后的前台处理……
               console.log('删除了'+id,i);
                //后台删除成功后
                arr.splice(i,1);
                $scope.jsList=arr;
                console.log($scope.jsList);
                $scope.$apply();
            });
        };

        var data= {
            "news":"1"
        };
        erp.postFun('app/menu/getMenu',JSON.stringify(data),function(n){
            var result = n.data.menu;
            $scope.xqList = result;
            console.log($scope.xqList);
        },function(n){});
        $scope.hashidden=function(hidden){
            //console.log(hidden);
            if(hidden=='' || hidden==null || hidden==undefined){
                return true;
            }else{
                if(hidden==true){
                    return false;
                }else{
                    return true;
                }
            }
        };
        $('.szqxBtn').click(function(){
            console.log($('.firstUl').children('li'));
            var arr =$scope.xqList;
            var grandLi = $('.firstUl').children('li');
            $.each(grandLi,function(i,v){
                var ishidden = $(this).find('.firstLi input[type=checkbox]').prop('checked');
                //console.log(ishidden);
                var name = $(this).find('.firstLi>.qxtext').attr('data-id');
                var index = i;
                //console.log(i,ishidden,name);
                arr[index].hidden=!ishidden;
                var childList = $(this).find('.sescondUl>li');
                $.each(childList,function(i,v){
                    var childeIndex = i;
                    var ishidden2  =$(this).find('.sesondLi input[type=checkbox]').prop('checked');
                    arr[index].children[childeIndex].hidden=!ishidden2;
                    var granchildList = $(this).find('.thirdUl>li');
                    if(granchildList.length>0){
                        $.each(granchildList,function(i,v){
                            var grandIndex =i;
                            var ishidden3 = $(this).find('.thirdLi input[type=checkbox]').prop('checked');
                            arr[index].children[childeIndex].children[grandIndex].hidden = !ishidden3;
                        });
                    }
                });
            });
            console.log(arr);
            $('.qxszzzc').hide();
        });

        $('.qx-tree').on('click','span.zksq',function(){
            var target = $(this);
            var flag  = target.html();
            //console.log(flag);
            if(flag=='+'){
                //展开
                var ele = target.parent();
                //console.log(ele.siblings('ul'));
                if(ele.siblings('ul').find('li').length>0){
                    ele.siblings('ul').show();
                }
                target.html('-');
            }else if(flag=='-'){
                //收起
                var ele = target.parent();
                if(ele.siblings('ul').find('li').length>0){
                    ele.siblings('ul').hide();
                    target.html('+');
                }
            }
        });
        $('.qx-tree').on('click','input:checkbox',function(){
            var target = $(this);
            var attr = target.parent().attr('data-attr');
            //console.log(attr);
            if(attr=='1'){
                //第一级
                var ischecked = target.prop('checked');
                var ele =  target.parent().parent().siblings('.sescondUl');
                ele.find('input:checkbox').prop('checked',ischecked);
            }else if(attr=='2'){
                //第二级
                var ischecked = target.prop('checked');
                var ele =  target.parent().parent().siblings('.thirdUl');
                ele.find('input:checkbox').prop('checked',ischecked);
                //console.log(ele.parent().parent().find('.sesondLi input[type=checkbox]:checked').length);
                var len = ele.parent().parent().children('li').length;
                console.log(len);
                //if(ele.parent().parent().find('.sesondLi input[type=checkbox]:checked').length==len){
                //    console.log('全选');
                //    ele.parent().parent().siblings('.firstLi').find('input:checkbox').prop('checked',true);
                //}else
                if(ele.parent().parent().find('.sesondLi input[type=checkbox]:checked').length==0){
                    console.log('全部选');
                    ele.parent().parent().siblings('.firstLi').find('input:checkbox').prop('checked',false);
                }else{
                    ele.parent().parent().siblings('.firstLi').find('input:checkbox').prop('checked',true);
                }
            }else if(attr=='3'){
                //第三极
                var parentUl = target.parent().parent().parent().parent();
                var len =parentUl.children('li').length;
                //console.log(parentUl.find('.thirdLi input[type=checkbox]:checked').length,len);
                if(parentUl.find('.thirdLi input[type=checkbox]:checked').length==0){
                    parentUl.siblings('.sesondLi').find('input:checkbox').prop('checked',false);
                }else{
                    parentUl.siblings('.sesondLi').find('input:checkbox').prop('checked',true);
                }

                var grandParentUl = parentUl.parent().parent();
                var grandlen = grandParentUl.children('li').length;
                if(grandParentUl.find('.sesondLi input[type=checkbox]:checked').length==0){
                    grandParentUl.siblings('.firstLi').find('input:checkbox').prop('checked',false);
                }else{
                    grandParentUl.siblings('.firstLi').find('input:checkbox').prop('checked',true);
                }
            }
        });

        $scope.BtnList=[];
        $('.qx-tree').on('click','span.qxtext',function(){
            var target= $(this);
            //console.log(target.html());
            //根据id查找按钮列表
            $scope.BtnList=[
                {
                    "groupId":"1",
                    "czmc":"未添加到调度任务",
                    "jkdz":"1111",
                    "code":"2312231",
                    "czms":"未添加到调度任务",
                    "show":true
                },{
                    "groupId":"1",
                    "czmc":"111",
                    "jkdz":"1111",
                    "code":"2312231",
                    "czms":"23131",
                    "show":false
                },{
                    "groupId":"1",
                    "czmc":"vip通道额度管理",
                    "jkdz":"1111",
                    "code":"231dsadada2231",
                    "czms":"2阿达的萨德卡上阿大短裤的奥丁卡顿奥丁阿达打1",
                    "show":true
                }
            ];
            $('.anqx-tree').show();
            $('.anqx-tree').find('h3').html('" '+target.html()+' " 按钮权限');
            $scope.$apply();
        });
        $scope.isallchecked=function(data){
            if(data.length>0){
                var count =0;
                $.each(data,function(i,v){
                    if(v.show==true){
                        count+=1;
                    }
                });
                if(count==data.length){
                    return true;
                }else{
                    return false;
                }
            }
        };

        //按钮权限全选
        $('#anqx-table').on('click','thead>tr>th>input[type=checkbox]',function(){
            var ischecked = $(this).prop('checked');
            console.log(ischecked);
            $('#anqx-table').find('tbody>tr>td>input[type=checkbox]').prop('checked',ischecked);
        });
        $('#anqx-table').on('click','tbody>tr>td>input[type=checkbox]',function(){
            var ischecked = $(this).prop('checked');
            //input[type=checkbox]:checked
            var len = $('#anqx-table').find('tbody>tr>td>input[type=checkbox]').length;
            var checkeinputlen = $('#anqx-table').find('tbody>tr>td>input[type=checkbox]:checked').length;
            if(checkeinputlen==len){
                $('#anqx-table').find('thead>tr>th>input[type=checkbox]').prop('checked',true);
            }else{
                $('#anqx-table').find('thead>tr>th>input[type=checkbox]').prop('checked',false);
            }

        });

        $('.anqxClose').click(function(){
            $('.anqx-tree').hide();
        });
        $('.anqxSet').click(function(){
            var trList = $('.anqx-tree #anqx-table tbody>tr');
            var arr = $scope.BtnList;
            $.each(trList,function(i,v){
                var isshow = $(this).find('input[type=checkbox]').prop('checked');

                arr[i].show=isshow;
            });
            console.log(arr);
            $('.anqx-tree').hide();
        });
        //$('.qx-tree input:checkbox').change(function(){
        //    var target = $(this);
        //    var attr = target.parent().attr('data-attr');
        //    console.log(attr);
        //});
        //function pageFun(erp, $scope) {
        //    $(".pagegroup").jqPaginator({
        //        totalCounts: $scope.dataList.length,
        //        pageSize: 12 * 1,
        //        visiblePages: 5,
        //        currentPage: $scope.pagenum * 1,
        //        activeClass: 'current',
        //        first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
        //        prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
        //        next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
        //        last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
        //        page: '<a href="javascript:void(0);">{{page}}<\/a>',
        //        onPageChange: function (n, type) {
        //            if (type == 'init') {
        //                return;
        //            };
        //            erp.load();
        //            $scope.pagenum = n;
        //            // $("#pagination-demo-text").html("当前第" + n + "页");
        //            erp.postFun("app/account_erp/pageQuery", {"data": "{'page': '" + n + "','limit':'" + $scope.pagesize + "','status':'" + $scope.status + "','name':'" + $scope.searchinfo + "','sort':'" + $scope.sort + "','onlineStatus':'"+$scope.onlineStatus+"','salesmanSearch':'"+$scope.salesmanid+"'}"}, function (n) {
        //                erp.closeLoad();
        //                var obj = JSON.parse(n.data.result);
        //                // settleListData ($scope,obj);
        //                $scope.customerList = obj;
        //                console.log($scope.customerList);
        //            }, err)
        //        }
        //    });
        //}
        var targetAddr=[];
        $('.qx-tree').on('click','.divLi>span.qxtext',function(e){
            var target = $(this);
            //console.log(target.html());
            $('.qx-tree').find('.divLi>span.act').removeClass('act');
            target.addClass('act');
            var tid = target.attr('data-id');
            var type = target.attr('data-addr');
            var targetLi = target.parent().parent();
            var index = targetLi.index();
            var arr = $scope.xqList;
            var data={
                "name":tid
            };

            var addrStr='';
            var dataList =[];
            if(type=='1'){
                //console.log(targetLi.index());
                targetAddr = [index,null,null];
                addrStr=index;
                data.targetAddr=targetAddr;
                data.addrStr=addrStr;
                data.href = arr[index].href;
                data.img = arr[index].img;
                data.type = type;
                dataList.push(data);
                //查找二级
                $.each(arr[index].children,function(i,v){
                    var sonIndex=i;
                    var data2={
                        "name": v.name,
                        "href": v.href,
                        "targetAddr":[index,sonIndex,null],
                        "addrStr":index+','+sonIndex,
                        "type":"2"
                    };
                    dataList.push(data2);
                    //if(v.children.length>0){
                    //    $.each(v.children,function(i,v){
                    //        var data3={
                    //            "name": v.name,
                    //            "href": v.href,
                    //            "targetAddr":[index,sonIndex,i],
                    //            "addrStr":index+','+sonIndex+','+i,
                    //            "type":"3"
                    //        };
                    //        dataList.push(data3);
                    //    });
                    //}
                });
                //console.log(dataList);
                $scope.dataList = dataList;
                $scope.$apply();
                //$scope.pagenum =1;

            }else if(type=='2'){
                //console.log('第二级');
                var parent = targetLi.parent().parent();
                var parentIndex = parent.index();
                targetAddr = [parentIndex,index,null];
                addrStr=parentIndex+','+index;
                data.targetAddr=targetAddr;
                data.addrStr=addrStr;
                data.href = arr[parentIndex].children[index].href;
                data.type=type;
                dataList.push(data);
                if(arr[parentIndex].children[index].children.length>0){
                    $.each(arr[parentIndex].children[index].children,function(i,v){
                        var data2={
                            "name": v.name,
                            "href": v.href,
                            "targetAddr":[parentIndex,index,i],
                            "addrStr":parentIndex+','+index+','+i,
                            "type":"3"
                        };
                        dataList.push(data2);
                    });
                }
                //console.log(dataList);
                $scope.dataList = dataList;
                $scope.$apply();

            }else if(type=='3'){
                //console.log('第三级');
                var parent = targetLi.parent().parent();
                var parentIndex = parent.index();
                var grandParent = parent.parent().parent();
                var grandparentIndex= grandParent.index();
                targetAddr = [grandparentIndex,parentIndex,index];
                addrStr=grandparentIndex+','+parentIndex+','+index;
                data.targetAddr=targetAddr;
                data.addrStr=addrStr;
                data.href = arr[grandparentIndex].children[parentIndex].children[index].href;
                data.type=type;
                dataList.push(data);
                //console.log(dataList);
                $scope.dataList = dataList;
                $scope.$apply();
            }
        });

        $('#xztjBtn').click(function(){
            var act = $('.qx-tree').find('.divLi>span.act');
            if(act.length>0){
                var a1 = targetAddr[0];
                var a2 = targetAddr[1];
                var a3 = targetAddr[2];
                //console.log('可以新增');
                //console.log(targetAddr);
                $('#dhbh').val('');
                $('#dhjk').val('');
                if(a3==null){
                    if(a2==null){
                        //console.log(1);//只有一级
                        $('#dhtpdiv').hide();
                        $('#dhmcdiv').hide();
                        $('#updxz').attr('data-xz','2');
                        $('.updateNavZzc').show();
                    }else{
                        //console.log(2);//到2级
                        $('#dhtpdiv').hide();
                        $('#dhmcdiv').hide();
                        $('#updxz').attr('data-xz','3');
                        $('.updateNavZzc').show();
                    }
                    $('.update-content h3').html('新增层级');
                    $('#updxz').show();
                    $('#updxg').hide();
                }else{
                    //console.log(3);//到3级
                    layer.msg('不能再新增层级了');
                }
            }else{
                layer.msg('请选择导航');
            }
        });

        $('#xzxjBtn').click(function(){
            $('.update-content h3').html('新增层级');
            $('#dhbh').val('');
            $('#dhjk').val('');
            $('#dhtp').val('');
            $('#dhtpdiv').show();
            $('#dhmcdiv').hide();
            $('#updxz').attr('data-xz','1');
            $('#updxz').show();
            $('#updxg').hide();
            $('.updateNavZzc').show();
        });
        //新增层级
        $scope.addNav=function(){
            var a1 = targetAddr[0];
            var a2 = targetAddr[1];
            var a3 = targetAddr[2];
            var arr =$scope.xqList;
            var ss = $scope.dataList;
            var tarr;
            var type = $('#updxz').attr('data-xz');
            var name = $('#dhbh').val();
            var href = $('#dhjk').val();
            if(name==null || name == '' || name==undefined){
                layer.msg('请填写导航编号');
            }else if(href=='' || href==null || href==undefined){
                layer.msg('请填写导航接口');
            }else{
                var data ={
                    "name":name,
                    "href":href,
                    "count":'',
                    "hidden":false,
                    "children":[]
                };
                if(type=='1'){
                    //新增第一级
                    console.log(11111);
                    var img = $('#dhtp').val();
                    data.img=img;
                    arr.push(data);
                }else if(type=='2'){
                    //新增第二级
                    tarr = arr[a1].children;
                    console.log(tarr);
                    tarr.push(data);
                    var data2={
                        "name": name,
                        "href": href,
                        "targetAddr":[a1,tarr.length-1,null],
                        "addrStr":a1+','+tarr.length-1,
                        "type":"2"
                    };
                    //console.log(data2);
                    ss.push(data2);
                }else if(type=='3'){
                    //新增第三极
                    tarr = arr[a1].children[a2].children;
                    tarr.push(data);
                    var data2={
                        "name": name,
                        "href": href,
                        "targetAddr":[a1,a2,tarr.length-1],
                        "addrStr":a1+','+a2+','+tarr.length-1,
                        "type":"3"
                    };
                    ss.push(data2);
                }
                console.log(arr);
                $('.updateNavZzc').hide();
                $scope.xqList=arr;
                $scope.dataList=ss;
            }
        };
        $('#updxz').click(function(){


        });

        //删除导航
        $scope.deleteNav=function(data,index2){
            layer.confirm('确认要删除吗？', {
                btn : [ '确定', '取消' ]//按钮
            }, function(index) {
                layer.close(index);
                console.log('取消了'+index2);
            })
        };
        //修改
        $scope.updateNav=function(data,index){
            $('.update-content h3').html('修改导航信息');
            console.log(data);
            $scope.updateDate = data;
            //$scope.$apply();
            $('#dhbh').val(data.name);
            $('#dhjk').val(data.href);
            if(data.type=='1'){
                $('#dhtp').val(data.img);
                $('#dhmcdiv').show();
                $('#dhtpdiv').show();
            }else{
                $('#dhmcdiv').show();
                $('#dhtpdiv').hide();
            }
            $('#updxg').attr('data-index',index);
            $('#updxz').hide();
            $('#updxg').show();
            $('.updateNavZzc').show();

        };
        $('#updgb').click(function(){
            $('.updateNavZzc').hide();
        });
        $scope.updateXgdh=function(){
            var addr = $scope.updateDate.targetAddr;
            var arr =$scope.xqList;
            var index = $('#updxg').attr('data-index');
            var ss = $scope.dataList[index];
            //console.log(addr);
            var a1 = addr[0];
            var a2 = addr[1];
            var a3 = addr[2];
            var name = $('#dhbh').val();
            var href = $('#dhjk').val();
            if(a3==null){
                if(a2==null){
                    //console.log(1);//只有一级
                    var img = $('#dhtp').val();
                    var tar = arr[a1];
                    tar.img=img;
                    tar.name=name;
                    tar.href=href;
                    ss.img=img;
                    ss.name=name;
                    ss.hreg=href;
                }else{
                    //console.log(2);//到2级
                    var tar=arr[a1].children[a2];
                    tar.name=name;
                    tar.href=href;
                    ss.name=name;
                    ss.hreg=href;
                }
            }else{
                //console.log(3);//到3级
                var tar =arr[a1].children[a2].children[a3];
                tar.name=name;
                tar.href=href;
                ss.name=name;
                ss.hreg=href;
            }

            console.log($scope.dataList);
            $scope.xqList=arr;
            //console.log(index);
            $('.update-menu input').html('');
            $('.updateNavZzc').hide();
        };



        //新增一行
        $('#xzrow').click(function(){
            var tbody =$('#lrtable tbody');
            if(tbody.find('tr').length>0){
                if(tbody.find('tr>td .act').length>0){
                    layer.msg('请先录入一个操作');
                }else{
                    addrow();
                }
            }else{
                addrow();
            }
            function addrow(){
                var str='<tr style="background: #fff;"><td><span class="czmc"></span> <input class="lrinput" type="text" id="czmc"/></td><td><span class="jkdz"></span><input class="lrinput" type="text" id="jkdz"/></td><td> <span class="code"></span> <input class="lrinput" type="text" id="code"/> </td> <td> <span class="czms"></span> <input class="lrinput" type="text" id="czms"/> </td> <td> <button class="sysBtn lrupdate">修改</button> <button class="sysBtn lrsave">保存</button> <button class="sysBtn lrdelete">删除</button> <button class="sysBtn lrcancel">取消</button> </td> </tr>';
                tbody.append(str);
                tbody.find('tr:last>td>span').hide();
                tbody.find('tr:last>td>.lrupdate').hide();
                tbody.find('tr:last>td>.lrdelete').hide();
                tbody.find('tr:last>td>.lrinput').show();
                tbody.find('tr:last>td>.lrsave').show().addClass('act');
                tbody.find('tr:last>td>.lrcancel').show()
            }
        });
        //打开录入
        $scope.openAnqx=function(id){
            $('.lranZzc').show();
            $('#lrtable').attr('data-id',id);
        };
        //关闭录入
        $('.closeZzc').click(function(){
            $('.lranZzc').hide();
        });
        //删除
        $('#lrtable').on('click','.lrdelete',function(){
            var target =$(this);
            var tr = target.parent().parent();
            tr.remove();
        });
        //修改
        $('#lrtable').on('click','.lrupdate',function(){
            var target =$(this);
            var tr =target.parent().parent();
            tr.find('input').val('');
            var czmc = tr.find('.czmc').html();
            var jkdz = tr.find('.jkdz').html();
            var code = tr.find('.code').html();
            var czms = tr.find('.czms').html();
            //console.log(czmc,jkdz,code,czms);
            tr.find('#czmc').val(czmc).show();
            tr.find('#jkdz').val(jkdz).show();
            tr.find('#code').val(code).show();
            tr.find('#czms').val(czms).show();
            tr.find('.czmc').hide();
            tr.find('.jkdz').hide();
            tr.find('.code').hide();
            tr.find('.czms').hide();
            target.hide();
            target.siblings('.lrdelete').hide();
            target.siblings('.lrsave').addClass('active').show();
            target.siblings('.lrcancel').show();
        });
        //保存
        $('#lrtable').on('click','.lrsave',function(){
            var target =$(this);
            var tr =target.parent().parent();
            var czmc = tr.find('#czmc').val();
            var jkdz = tr.find('#jkdz').val();
            var code = tr.find('#code').val();
            var czms = tr.find('#czms').val();
            if(czmc==''){
                layer.msg('请输入操作名称');
            }else if(jkdz==''){
                layer.msg('请输入接口地址');
            }else if(code==''){
                layer.msg('请输入code');
            }else{
                //console.log(czmc,jkdz,code,czms);
                tr.find('.czmc').html(czmc).show();
                tr.find('.jkdz').html(jkdz).show();
                tr.find('.code').html(code).show();
                tr.find('.czms').html(czms).show();
                tr.find('#czmc').hide();
                tr.find('#jkdz').hide();
                tr.find('#code').hide();
                tr.find('#czms').hide();
                target.removeClass('act').hide();
                target.siblings('.lrcancel').hide();
                target.siblings('.lrupdate').show();
                target.siblings('.lrdelete').show();
            }
        });
        //取消
        $('#lrtable').on('click','.lrcancel',function(){
            var target =$(this);
            var tbody =$('#lrtable tbody');
            var savbtn = target.siblings('.lrsave');
            if(savbtn.hasClass('act')){
                //console.log('新建的行');
                layer.confirm('确认要取消吗？', {
                    btn : [ '确定', '取消' ]//按钮
                }, function(index) {
                    layer.close(index);
                   $('#lrtable tbody>tr:last').remove();
                    //console.log(last);
                });
            }else if(savbtn.hasClass('active')){
                //console.log('不是新建的行');
                layer.confirm('确认要取消吗？', {
                    btn : [ '确定', '取消' ]//按钮
                }, function(index) {
                    layer.close(index);
                    target.hide();
                    target.siblings('.lrsave').hide();
                    target.siblings('.lrupdate').show();
                    target.siblings('.lrdelete').show();
                    target.parent().parent().find('input').hide();
                    target.parent().parent().find('span').show();

                });
            }
        });



        //用户管理

    }]);

    app.controller('systemUserCtrl',['$scope','erp',function($scope,erp){
        //加载用户列表
        $scope.UserList = [
            {
                "userId":"1",
                "userName":"Andy",
                "EnName":"Andy",
                "DisStatu":"1",
                "character":"管理员"
            }, {
                "userId":"2",
                "userName":"金泰妍",
                "EnName":"Taeyon",
                "DisStatu":"1",
                "character":"业务员"
            }, {
                "userId":"3",
                "userName":"盛大",
                "EnName":"Shenda",
                "DisStatu":"0",
                "character":""
            }, {
                "userId":"4",
                "userName":"艾恩",
                "EnName":"AIen",
                "DisStatu":"0",
                "character":""
            }
        ];
        $scope.characterList = [
            {
                "id":'0',
                "name":"全部"
            },{
                "id":'1',
                "name":"管理员"
            },{
                "id":'2',
                "name":"业务员"
            },{
                "id":'3',
                "name":"财务"
            },{
                "id":'-1',
                "name":"未分配"
            }
        ];
        $scope.charactrtList02=[
            {
                "id":'1',
                "name":"管理员"
            },{
                "id":'2',
                "name":"业务员"
            },{
                "id":'3',
                "name":"财务"
            }
        ];
        $scope.isStatu=function(statu){
            if(statu=='1'){
                return '已分配';
            }else if(statu=='0'){
                return '未分配';
            }
        };
        $('.jsfpTable thead>tr>th>input[type=checkbox]').click(function(){
            //console.log('全选');
            $('.jsfpTable tbody tr>td>input[type=checkbox]').prop('checked',$(this).prop('checked'));
        });
        $('.jsfpTable tbody').on('click','tr>td>input[type=checkbox]',function(){//input[type=checkbox]:checked
            var len =  $('.jsfpTable tbody').find('tr>td>input[type=checkbox]').length;
            var checkedLen = $('.jsfpTable tbody').find('tr>td>input[type=checkbox]:checked').length;
            if(checkedLen==len){
                $('.jsfpTable thead>tr>th>input[type=checkbox]').prop('checked',true);
            }else{
                $('.jsfpTable thead>tr>th>input[type=checkbox]').prop('checked',false);
            }
        });

        //查看时间
        $scope.looktime=function(id){
            $('.dlsjZzc').show();
        };
        $('.closedlsj').click(function(){
            $('.dlsjZzc').hide();
        });
        //修改分配
        $scope.updateAllocation=function(id,name,cur){
            $('.fpjsZzc').find('.fpjs-input01').show();
            $('.fpjsZzc').find('#yhm').val(name);
            $('.fpjsZzc').find('#fpfs').val('修改');
            $('.fpjsZzc').find('#yfpjs').val(cur);
            $('.fpjsZzc').find('.fpjs-input02').show();
            $('.fpsubBtn').show();
            $('.plfpsubBtn').hide();
            $('.fpjsZzc').show();
            $('.fpsubBtn').attr('data-id',id);
        };

        //分配 fpjsBtn
        $('.fpsubBtn').click(function(){
            var id =$(this).attr('data-id');
            var curid = $('#fpjs').val();
            var arr = $scope.UserList;
            var cur ='';
            $.each($scope.charactrtList02,function(i,v){
                if(v.id==curid){
                    cur= v.name;
                    $.each(arr,function(i,v){
                        if(v.userId==id){
                            v.character=cur;
                            v.DisStatu='1';
                        }
                    });
                }
            });
            console.log(arr);
            $scope.UserList=arr;
            $('.fpjsZzc').hide();
            $scope.$apply();
        });
        $scope.allocation=function(id,name){
            $('.fpjsZzc').find('.fpjs-input01').show();
            $('.fpjsZzc').find('#yhm').val(name);
            $('.fpjsZzc').find('#fpfs').val('分配');
            $('.fpjsZzc').find('.fpjs-input02').hide();
            $('.fpjsZzc').show();
        };

        //批量分配
        $('.plfpBtn').click(function(){
            var checkedlist=$('.jsfpTable tbody').find('tr>td>input[type=checkbox]:checked');
            if(checkedlist.length>0){
                console.log(checkedlist);
                //$('.fpjsZzc').find('#yhm').val('批量分配');
                $('.fpjsZzc').find('.fpjs-input01').hide();
                $('.fpjsZzc').find('#fpfs').val('批量分配');
                $('.fpjsZzc').find('.fpjs-input02').hide();
                $('.fpsubBtn').hide();
                $('.plfpsubBtn').show();
                $('.fpjsZzc').show();
            }else{
                layer.msg('请勾选需要设置的用户');
            }
        });
        $('.plfpsubBtn').click(function(){
            var checkedlist=$('.jsfpTable tbody').find('tr>td>input[type=checkbox]:checked');
            var curid = $('#fpjs').val();
            var cur ='';
            var arr = $scope.UserList;
            $.each($scope.charactrtList02,function(i,v){
                if(v.id==curid){
                    cur= v.name;
                }
            });
            $.each(checkedlist,function(){
                var target = $(this);
                var next = target.parent().siblings('td.userId');
                var id = next.attr('data-id');
                //console.log(id+'-->'+cur);
                $.each(arr,function(i,v){
                    if(v.userId==id){
                        v.character=cur;
                        v.DisStatu='1';
                    }
                });
            });
            $scope.UserList=arr;
            $scope.$apply();
            $('.fpjsZzc').hide();
        });
        //取消分配 cancelFp
        $scope.cancelFp=function(id){
            layer.confirm('确认要取消分配吗？', {
                btn : [ '确定', '取消' ]//按钮
            }, function(index) {
                layer.close(index);
                console.log('取消了'+id);
            });
        };
        //关闭分配
        $('.closeFpjs').click(function(){
            $('.fpjsZzc').hide();
        });
    }]);

})();