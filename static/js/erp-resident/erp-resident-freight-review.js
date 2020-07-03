(function(){
    var app = angular.module('erp-resident');
    app.controller('FreightReviewCtrl',[
        "$scope",
        "erp",
        "$routeParams",
        "utils",
        "$location",
        "$filter",
        function($scope,erp,$routeParams,utils,$location,$filter){
            console.log('FreightReviewCtrl') 
     
            //
            $scope.dataList = [];
            $scope.pageSize = '20';
            $scope.pageNum = 1;
            $scope.val='1'
            $scope.tabArr = [
                {'name':'待处理','val':'1','isActive':'true' },
                {'name':'已确认收款','val':'2','isActive':''},
                {'name':'收款异常','val':'3','isActive':''},
             ];
             $scope.searVal = '' ;       //搜索
             $scope.startTime = '';
             $scope.endTime = '';
            //  $scope.moneyType = 'USD';   //币种展示
            //  $scope.seaType = 'productFee' ;   //下拉选择框

            //文件上传文件
            $scope.file = ''
            //弹框
            $scope.isConfirm = false;
            $scope.isRefuse = false;
            $scope.selectVal = ''
     
             
            //切换tab
            $scope.checkTab = function(item){
                 console.log(item)
                 for(i=0;i<$scope.tabArr.length;i++){
                     $scope.tabArr[i].isActive = '';
                 }
                 item.isActive = true;
                 $scope.val = item.val;
                 clear()
                 getData()
            }
            
     
            //清空
            function clear(){
                 $('#date1').val('')
                 $('#date2').val('')
                 $scope.searVal = ''
                 $scope.pageNum = 1
             }
            //切换下拉选择框
            // $scope.selectArr = [
            //     {'name':'运费',val:'productFee',activeVal:'1'},
            //     {'name':'供应商佣金',val:'payFee',activeVal:'2'},
            // ]
           
     
            // $scope.checkSelect = function(){
            //      console.log($scope.seaType)
            //      clear()
            //      getData()
            // }
     
            //搜索
            $scope.searchInput = function(){
                $scope.pageNum = 1
                getData();
            }
     
     
            //获取列表
            function getData() {
                console.log($scope.pageNum)
             var data = {
               // "pageNum": $scope.pageNum +'',
               "page": $scope.pageNum +'',
               "pageSize": $scope.pageSize,
               "inputStr": $scope.searVal,
               "type": $scope.seaType,
               "startTime": $('#date1').val(),
               "endTime": $('#date2').val(),
               "status": $scope.val
             };
             var url = ''
             console.log($scope.val)
             if($scope.val == '1'){
                url="erp/accAssign/getAccEmpInfo"
             }else if($scope.val == '2'){
                 url= 'erp/accAssign/getAccEmpInfo'
             }else if($scope.val = '3'){
                 url = 'erp/accAssign/getAccEmpInfo'
             }
             
             erp.postFun(url, data, function (res) {
               console.log(res)
               // if (res.data.statusCode == 200) {
               if (res.data.code == 200) {
                 // $scope.dataList = res.data.result.rows;
                 $scope.dataList = res.data.data.salesmanList;
                 if($scope.dataList){
                    for(let i = 0,len = $scope.dataList.length;i<len;i++){
                       $scope.dataList[i]['index'] = $scope.pageSize*($scope.pageNum-1)+i+1
                   }
                 }
                 console.log($scope.dataList)
                 // $scope.TotalNum1 = res.data.result.total;
                 $scope.TotalNum = res.data.data.count;
                 console.log($scope.TotalNum)
                 pageFun1()
               }
             }, function (data) {
               console.log(data)
             },{layer:true})
           }
           
             getData();
           
           //分页
           function pageFun1() {
             $(".pagegroup1").jqPaginator({
               totalCounts: $scope.TotalNum || 1,
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
                 $scope.pageNum = n;
                 console.log($scope.pageNum,typeof $scope.pageNum)
                 getData()
               }
             });
           }
           $scope.toPage1 = function () {
             var pageNum = Number($scope.pageNum);
             var pageNumtotal = Number($scope.TotalNum);
             var pageSize1 = Number($scope.pageSize);
             // var totalPage = Math.ceil($scope.TotalNum1 / Number($scope.pageSize1));
             var totalPage =  Math.ceil(pageNumtotal / pageSize1);
             console.log(typeof pageNum)
             console.log(typeof Number($scope.pageSize))
             console.log(totalPage)
             if (!pageNum) {
               layer.msg('请输入页码');
               return;
             }
             if (pageNum > totalPage) {
               layer.msg('总计' + totalPage + '页，所输入数字应小于' + totalPage);
               $scope.pageNum1 = 1;
               return;
             }
             getData();
           };
           $scope.pagechange = function(pageSize){
               console.log($scope.pageSize)
               console.log(pageSize)
               $scope.pageNum = 1;
               getData()
           }

           //文件上传
           $scope.upLoadExcelFun = function (item) {
            console.log(item)      //Filelist
            console.log(item[0])      //file
            var file = $("#document2").val();
            console.log(file)     //文件路径
            var index = file.lastIndexOf(".");
            var ext = file.substring(index + 1, file.length);
            console.log(ext)       //后缀名
            if(ext != "xlsx" && ext != "xls") {
              layer.msg('请上传excel文件')
              return;
            }
            erp.load();
            var formData = new FormData($("#uploadimg2")[0]);
            console.log($("#uploadimg2")[0])
            formData.append("file",item[0]);
            console.log(formData)
            $scope.file = formData;
            erp.upLoadImgPost('erp/orderResend/uploadExcel',formData,function (data) {
              console.log(data)
              layer.closeAll("loading")
              // if (data.data.result==true) {
              if (data.data.statusCode==200) {
                layer.msg('上传成功');
                $('#document2').val('') // 注意1
                // data.data.result 数据
                //上传Excel解析弹窗
              } else {
                $('#document2').val('') // 注意1
                layer.msg(data.data.message) 
              }
            },function (data) {
              // console.log(data)
              layer.closeAll("loading")
            })
          }

           //同意
           $scope.confirmTixian = function(item){
               console.log(item)
               $scope.isConfirm = true;
           }
           //同意确定
            $scope.sureConfirm = function(item){
                console.log(item)
                $scope.remarks = item;
                console.log($scope.remarks);
                var data = {
                    "remarks": item,
                    "file":$scope.file
                }
                erp.postFun('erp/accAssign/getAccEmpInfo', data, function (res) {
                    console.log(res)
                    // if (res.data.statusCode == 200) {
                    if (res.data.code == 200) {
                        $scope.isConfirm = false;
                        $('#document2').val('')
                   
                    }
                  }, function (data) {
                    console.log(data)
                  },{layer:true})
            }

            //取消同意
            $scope.cancelTixian = function(){
                $scope.isConfirm = false
                $('#document2').val('')
                $scope.remarks = ''
            }

            //拒绝
                $scope.refuseTixian = function(item){
                    console.log(item)
                $scope.isRefuse = true;
            }
            //拒绝确定
            $scope.sureConfirm1 = function(item){
                console.log(item)
                $scope.remarks = item;
                console.log($scope.remarks);
                if($scope.remarks.length<5){
                    layer.msg('请输入至少5个字符')
                }else{
                    var data = {
                        "remarks": item
                    }
                    erp.postFun('erp/jujue', data, function (res) {
                        console.log(res)
                        // if (res.data.statusCode == 200) {
                        if (res.data.code == 200) {
                        
                        pageFun1()
                        }
                    }, function (data) {
                        console.log(data)
                    },{layer:true})
                }
            }

            //取消拒绝
            $scope.cancelTixian1 = function(){
                $scope.isRefuse = false
                // $('#document2').val('')
                $scope.remarks = ''
            }
                
            //关闭所有弹框
            $scope.closeAlltan = function(){
                $scope.isConfirm = false;
                $scope.isRefuse = false;
            }
        }]
    )
})()