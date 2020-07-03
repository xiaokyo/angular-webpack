;~function () {
    let app = angular.module('warehouse-app');
    //货代 待匹配 已发货 签收
    app.controller('qianshou-controller',['$scope','erp','$http','$routeParams','$timeout',function ($scope,erp,$http,$routeParams,$timeout) {
        var bs = new Base64();
        var token = bs.decode(localStorage.getItem('erptoken') == undefined ? "" : localStorage.getItem('erptoken'));
         var loginSpace = localStorage.getItem('space');
         var wlLocStore = localStorage.getItem('wlLocStore')||'';
         var erpLoginName = bs.decode(localStorage.getItem('erploginName')==undefined?'':localStorage.getItem('erploginName'));
        $scope.selStore = '2';
        $scope.pagesize = '100';
        $scope.pagenum = '1';
        $scope.pagenumarr = [100, 200, 300, 500];
        $scope.totalNum = 0;
        $scope.dppStu = 2;
        $scope.days = 'today';
        $scope.ExpURl = '';

        var dbr=$routeParams.dbrname;
        if(dbr=='' || dbr==null || dbr==undefined){
            $scope.packageUser='';
        }else{
            $scope.packageUser=dbr;
            $('#dblName').val(dbr)
        }
        $('.dpp-stu').eq(0).addClass('dpp-stuactive');
        $('.drk-time').eq(0).addClass('active');
        $('.qs-link').removeClass('qs-act')
        $('.qs-link').eq(0).addClass('qs-act');
        function getList() {
            layer.load(2)
            if($scope.selHdName){
                $scope.account = $scope.selHdName.companyName;
            }else{
               $scope.account = '';
            }
            var csData = {};
            csData.pageSize = $scope.pagesize;
            csData.pageNum = $scope.pagenum+'';
            csData.trackingNumber = $scope.trackCode;
            csData.timeFlag = $scope.days;
            csData.beginDate = $('#left-time').val();
            csData.endDate = $('#right-time').val();
            if($scope.dppStu==0){
               csData.type = '1';
            }else if($scope.dppStu==1){
               csData.type = '2';
            }else if($scope.dppStu==2){
                csData.type = '';
            }
            console.log(csData)
            erp.postFun('app/dispatcherTask/getParcelReceivingRecord',JSON.stringify(csData),function (data) {
                console.log(data)
                layer.closeAll('loading')
                if(data.data.code=='CODE_200'){
                    $scope.totalNum = data.data.totalCount;
                    $scope.stafflist = data.data.list;
                    pageFun();
                }else {
                    $scope.stafflist = [];
                    $scope.totalNum = 0;
                    layer.msg(data.data.message)
                }

            },function (data) {
                console.log(data)
                layer.closeAll('loading')
            })
        }
        getList();
        function pageFun () {
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
                    if($scope.trackCode){
                        $scope.pagenum = '1';
                    }else {
                        $scope.pagenum = n;
                    }
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
            if (!pagenum || pagenum > totalpage) {
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
        $scope.selfun0 = function (ev) {
            $scope.dppStu = 0;
            $scope.pagenum = '1';
            $('.dpp-stu').removeClass('dpp-stuactive');
            $(ev.target).addClass('dpp-stuactive');
            getList();
        }
        $scope.selfun1 = function (ev) {
            $scope.dppStu = 1;
            $scope.pagenum = '1';
            $('.dpp-stu').removeClass('dpp-stuactive');
            $(ev.target).addClass('dpp-stuactive');
            getList();
        }
        $scope.selfun2 = function (ev) {
            $scope.dppStu = 2;
            $scope.pagenum = '1';
            $('.dpp-stu').removeClass('dpp-stuactive');
            $(ev.target).addClass('dpp-stuactive');
            getList();
        }
        //备注
        $scope.wppBzFun = function(item,index,ev){
            ev.stopPropagation()
            $scope.itemId = item.ID;
            $scope.beiZhuFlag = true;
            $scope.wppReson = item.TRACKINGNUMBER;
        }
        $scope.sureBzFun = function(){
            if(!$scope.wppReson){
                layer.msg('请输入追踪号')
                return
            }
            erp.load()
            var upJson = {};
            upJson.recordId = $scope.itemId;
            upJson.trackingNumber = $scope.wppReson;
            erp.postFun('app/dispatcherTask/shouDongPiPeiBaoGuo',JSON.stringify(upJson),function(data){
                console.log(data)
                erp.closeLoad()
                if (data.data.code=='CODE_200') {
                    if (data.data.state==8) {
                        $scope.beiZhuFlag = false;
                        layer.msg(data.data.message)
                    } else {
                        layer.msg('匹配成功')
                        $scope.beiZhuFlag = false;
                        getList()
                        $scope.wppReson = '';
                    }
                } else {
                    layer.msg(data.data.message)
                }
            },function(data){
                console.log(data)
                erp.closeLoad()
            })
        }
        $scope.qxbzFun = function(){
            $scope.beiZhuFlag = false;
            $scope.wppReson = '';
        }
        //按时间查询
        $scope.timeStuFun = function (ev,timeStu) {
            $('#left-time').val('');
            $('#right-time').val('');
            $('.drk-time').removeClass('active');
            $(ev.target).addClass('active');
            // var timeStu = $(ev.target).text();
            console.log(timeStu)
            switch (timeStu) {
                case 0:
                    $scope.days = 'today';
                    break;
                case 1:
                    $scope.days = 'threeDay';
                    break;
                case 2:
                    $scope.days = 'weeks';
                    break;
            }
            console.log($scope.days)
            $scope.pagenum = '1';
            getList();
        }
        $scope.timeSFun = function () {
            $scope.days = '';
            $('.drk-time').removeClass('active');
            $scope.pagenum = '1';
            getList();
        }
        $('.seach-inp').keypress(function(e) {
            if(e.which==13){
              $scope.pagenum = '1';
              $scope.inpSeaFun()
            }
        });
        $scope.inpSeaFun = function () {
            $scope.pagenum = '1';
            $scope.days = '';
            $('.drk-time').removeClass('active');
            getList();
        }
        //导出
        $scope.Export = function(){
            getList();
        }
        //删除
        $scope.delWppFun = function (item,index) {
            if(erpLoginName!='admin'&&erpLoginName!='周鹏'){
                layer.msg('只有管理员才能修改')
                return
            }
            layer.load(2);
            if($scope.dppStu==0||$scope.dppStu==1){
                var deUrl = 'app/erplogistics/dellOutRecord'
            }else{
                var deUrl = 'app/erplogistics/dellExcelOutRecord'
            }
            erp.postFun(deUrl,{
                'id':item.id
            },function (data) {
                console.log(data)
                layer.closeAll('loading')
                if (data.data.code==200) {
                    layer.msg('删除成功')
                    $scope.stafflist.splice(index,1)
                    $scope.totalNum--;
                } else {
                    layer.msg('删除失败')
                }
            },function (data) {
                console.log(data)
                layer.closeAll('loading')
            })
        }
        $scope.list = [];
        $('#incur-inp').keyup(function(e) {
            console.log(e.which)
            if(e.which==13){
                console.log($scope.inpVal)
                $scope.setLocalFun($scope.inpVal)
            }
        });
        $scope.indexNum = 1;
        var jcRepeatJson = {};
        $scope.setLocalFun = function (val) {
            if(val){
               if($scope.inpVal.length>30){
                   $scope.inpVal = $scope.inpVal.substring(0,30)
                   console.log($scope.inpVal)
               }
               console.log(jcRepeatJson[$scope.inpVal])
               if(jcRepeatJson[$scope.inpVal]){
                    console.log('美国重复')
                    $('.audio-en-cf').get(0).play();
                    $scope.inpVal = '';
                    $scope.$apply()
                    return
               }
               jcRepeatJson[$scope.inpVal]='1';
               console.log(jcRepeatJson)
               if($scope.inpVal){
                  console.log($scope.inpVal)
                  $scope.list.push({
                    index:$scope.indexNum,
                    trackNum: $scope.inpVal,
                    hdName: '',
                    lanZi: '',
                    flag: false
                  })
                  $scope.indexNum++;
               }
               console.log($scope.indexNum)
               var codeData = {};
               codeData.trackingNumber = $scope.inpVal;
               $scope.inpVal = '';
               erp.postFun('app/dispatcherTask/saoMiaoBaoGuoQueRenShouHuo',JSON.stringify(codeData),function (data) {
                   layer.closeAll('loading')
                   console.log(data)
                   if(data.data.state>0){
                        if (data.data.state==10||data.data.state==11) {
                            $('.audio-en-cf').get(0).play();
                        } else {
                            $('.audio-en-cg').get(0).play();
                            var len = $scope.list.length;
                            var sucCount = 0;
                            for(var i = 0;i<len;i++){
                                 if(!$scope.list[i].flag){
                                     sucCount++
                                 }
                                 if(sucCount>3){
                                     for(var i = 0;i<len;i++){
                                         if(!$scope.list[i].flag){
                                             $scope.list.splice(i,1)
                                             break
                                         }
                                     }
                                 }
                             }
                        }
                       $scope.inpVal = '';
                   }else{
                       $('.audio-en-fault').get(0).play();
                       var len = $scope.list.length;
                       for(var i = 0;i<len;i++){
                        if(data.data.trackingNumCode==$scope.list[i].trackNum){
                            $scope.list[i].flag = true;
                        }
                       }
                   }
                   $('#incur-inp').focus()
               },function (data) {
                   console.log(data)
                   layer.closeAll('loading')
               })
            }
        }
        // 关闭录入
        $scope.closeLrFun = function () {
            $scope.pphdFlag = false;
            getList();
        }
        //拦截
        $scope.lanJieFun = function(){
            $scope.lanJieFlag=true;
        }
        $scope.sureLanJieFun = function(){
            console.log($scope.ljTrackVal)
            if(!$scope.ljTrackVal){
                layer.msg('请输入要拦截的追踪号')
                return
            }
            erp.load()
            erp.postFun('erp/faHuo/lanJieOrder',{
                trackingNumCode:$scope.ljTrackVal
            },function(data){
                console.log(data)
                erp.closeLoad()
                if (data.data.result>0) {
                    layer.msg('添加拦截成功')
                    $scope.lanJieFlag = false;
                    $scope.ljTrackVal = '';
                    getList();
                } else {
                    layer.msg('添加拦截失败')
                }
            },function(data){
                erp.closeLoad()
                console.log(data)
            })
        }
        //取消拦截
        $scope.qxLanJieFun = function(){
            $scope.qxLanJieFlag=true;
        }
        $scope.sureQxLanJieFun = function(){
            console.log($scope.qxljTrackVal)
            if(!$scope.qxljTrackVal){
                layer.msg('请输入要拦截的追踪号')
                return
            }
            erp.load()
            erp.postFun('erp/faHuo/cleanOrder',{
                trackingNumCode:$scope.qxljTrackVal
            },function(data){
                console.log(data)
                erp.closeLoad()
                if (data.data.result>0) {
                    layer.msg('取消拦截成功')
                    $scope.qxLanJieFlag = false;
                    $scope.qxljTrackVal = '';
                    getList();
                } else {
                    layer.msg('取消拦截失败')
                }
            },function(data){
                erp.closeLoad()
                console.log(data)
            })
        }
        console.log($('#incur-inp'))
        $('#incur-inp').focus();
        $scope.imgArr = [];
        $scope.upLoadImg4 = function (files) {
            erp.ossUploadFile($('#uploadimgs')[0].files,function (data) {
                console.log(data)
                if (data.code == 0) {
                    layer.msg('Upload Failed');
                    return;
                }
                if (data.code == 2) {
                    layer.msg('Upload Incomplete');
                }
                var result = data.succssLinks;
                console.log($scope.imgArr.length)
                if($scope.imgArr.length==0){
                    $scope.imgArr = result;
                }else{
                    var trapArr = $scope.imgArr;
                    console.log(result)
                    for(var i = 0,len=result.length;i<len;i++){
                        trapArr.push(result[i])
                    }
                    console.log(trapArr)
                    $scope.imgArr = trapArr;
                    console.log($scope.imgArr)
                }
                $('#uploadimgs').val('')
                console.log($scope.imgArr)
                $scope.$apply();
            })
        }
        $scope.closeUpHdFun = function () {
            $scope.uploadHdFlag = false;
        }

        //点击事件
        $('.orders-table').on('click','.erporder-detail',function (event) {
            if($(event.target).hasClass('cor-check-box')||$(event.target).hasClass('qtcz-sel')||$(event.target).hasClass('stop-prop')||$(event.target).hasClass('ordlist-fir-td')){
                return;
            }
            if ($(this).hasClass('order-click-active')) {
                $(this).next().hide();
                $(this).removeClass('order-click-active');
                //$('.orders-table .erporder-detail').removeClass('order-click-active');
            } else {
                //$('.orders-table .erpd-toggle-tr').hide();//隐藏所有的商品
                $(this).next().show();
                //$('.orders-table .erporder-detail').removeClass('order-click-active');
                $(this).addClass('order-click-active');
            }
        })

        $('.orders-table').on('mouseenter','.ordlist-fir-td',function () {
            $(this).parent('.erporder-detail').next().hide();
        })
        $('.orders-table').on('mouseenter','.moshow-sp-td',function () {
            $(this).parent('.erporder-detail').next().show();
            $('.orders-table .erporder-detail').removeClass('erporder-detail-active');
            $(this).parent('.erporder-detail').addClass('erporder-detail-active');
        })

        $('.orders-table').on('mouseleave','.erporder-detail',function () {
            $(this).next().hide();
            if($(this).hasClass('order-click-active')){
                $(this).next().show();
            }else{
                $(this).next().hide();
            }
        })
        $('.orders-table').on('mouseenter','.erpd-toggle-tr',function () {
            $(this).show();
        })
        $('.orders-table').on('mouseleave','.erpd-toggle-tr',function () {
            // $(this).hide();
            if ($(this).prev().hasClass('order-click-active')) {
                $(this).show();
            } else {
                $(this).hide();
            }
        })
        $('.orders-table').mouseleave(function () {
            $('.orders-table .erporder-detail').removeClass('erporder-detail-active');
        })
    }])
}();