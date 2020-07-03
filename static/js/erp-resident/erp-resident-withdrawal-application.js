(function(){
    var app = angular.module('erp-resident');
    app.controller('WithdrawalApplicationCtrl',[
        "$scope",
        "erp",
        "$routeParams",
        "utils",
        "$location",
        "$filter",
        function($scope,erp,$routeParams,utils,$location,$filter){
            console.log('FinancialStatisticsCtrl') 
     
            //
            $scope.dataList = [];
            $scope.pageSize = '20';
            $scope.pageNum = 1;
            $scope.val='1'
            $scope.tabArr = [
                {'name':'待处理','val':'1','isActive':'true' },
                {'name':'已确认提现','val':'2','isActive':''},
                {'name':'提现异常','val':'3','isActive':''},
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
            //  $scope.ImgUrl = ''
             $scope.imgArr = []
             $scope.remarks = ''


              //获取系统当前时间
         var nowTime = new Date();
         var y = nowTime.getFullYear();
         var m = nowTime.getMonth()+1;
         var d = nowTime.getDate();
         var formatNowDate = y+'-'+m+'-'+d;
         //获取系统前一周的时间
         var oneWeekDate = new Date(nowTime-7*24*3600*1000);
         var y = oneWeekDate.getFullYear();
         var m = oneWeekDate.getMonth()+1;
         var d = oneWeekDate.getDate();
         var formatWDate = y+'-'+m+'-'+d;
         //获取系统前一个月的时间
         nowTime.setMonth(nowTime.getMonth()-1);
         var y = nowTime.getFullYear();
         var m = nowTime.getMonth()+1;
         var d = nowTime.getDate();
         var formatMDate = y+'-'+m+'-'+d;
         $scope.startTime = formatWDate;
         $scope.endTime = formatNowDate;
         $('#date1').val(formatWDate)
         $('#date2').val(formatNowDate)
         console.log($scope.startTime)
         console.log($scope.endTime)
 
     
             
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
                 $('#date1').val(formatWDate)
                 $('#date2').val(formatNowDate)
                 $scope.searVal = ''
                 $scope.pageNum = 1
                 $scope.imgArr = []
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
     
     
            $scope.UrlArr = []
            $scope.ImgUrlArr = []
            //获取列表
            function getData() {
                console.log($scope.pageNum)
             var data = {
               // "pageNum": $scope.pageNum +'',
               "pageNum": $scope.pageNum +'',
               "pageSize": $scope.pageSize,
               "customerName": $scope.searVal,
               "sortType": $scope.seaType,
               "startDate": $('#date1').val(),
               "endDate": $('#date2').val(),
               "status": $scope.val
             };
             erp.postFun("supplier/supplierWalletTradeLog/queryWithdrawPage", data, function (res) {
               console.log(res)
               // if (res.data.statusCode == 200) {
               if (res.data.code == 200) {
                 // $scope.dataList = res.data.result.rows;
                 $scope.dataList = res.data.data.list;
                 if($scope.dataList){
                    for(let i = 0,len = $scope.dataList.length;i<len;i++){
                       $scope.dataList[i]['index'] = $scope.pageSize*($scope.pageNum-1)+i+1
                       if($scope.dataList[i]['comeFrom'] =='1'){
                          $scope.dataList[i]['comeFrom'] = '供应商平台'
                       }
                       if($scope.dataList[i]['status'] == 2){
                        $scope.dataList[i]['status'] = "成功"
                        }
                      if($scope.dataList[i]['status'] == 3){
                        $scope.dataList[i]['status'] = "失败"
                      }
                      if($scope.dataList[i]['proofImgUrl']){
                         $scope.dataList[i]['proofImgUrl'] = $scope.dataList[i]['proofImgUrl'].split(',')
                      }
                      
                   }
                  //  console.log($scope.ImgUrlArr)
                 }
                 console.log($scope.dataList)
                 // $scope.TotalNum1 = res.data.result.total;
                 $scope.TotalNum = res.data.data.total;
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

        
    //图片上传
        
        $scope.upLoadImg4 = function (files) {
          // erp.ossUploadFile($('#uploadInp')[0].files, function (data) {
          erp.ossUploadFile(files, function (data) {
              console.log(data)
              if (data.code == 0) {
                  layer.msg('上传失败');
                  return;
              }
              if (data.code == 2) {
                  layer.msg('图片上传失败');
              }
              var result = data.succssLinks;
              console.log(result)
              // $scope.ImgUrl = result;
              // $scope.imgArr = result;
              var filArr = [];
              for (var j = 0; j < result.length; j++) {
                  var srcList = result[j].split('.');
                  var fileName = srcList[srcList.length - 1].toLowerCase();
                  console.log(fileName)
                  if (fileName == 'png' || fileName == 'jpg' || fileName == 'jpeg' || fileName == 'gif') {
                      $scope.imgArr.push(result[j]);
                      $('#uploadInp').val('');
                  }else{
                    layer.msg('请上传图片')
                    $('#uploadInp').val('');
                  }
              }
              console.log($scope.imgArr)
              $scope.$apply();
          })
      }
        $scope.deletImgFun = function (index) {
		    $scope.imgArr.splice(index,1)
		  }
      $scope.id = ''
      $scope.supplierShopId = ''
      $scope.tradeAmount = ''

           //同意
           $scope.confirmTixian = function(item){
                console.log(item)
               $scope.isConfirm = true;
               $scope.id = item.id
               $scope.supplierShopId = item.supplierAccountId
               $scope.tradeAmount = item.tradeAmount
           }
           //同意确定
            $scope.sureConfirm = function(item){
                console.log(item)
                // $scope.remarks = item;
                console.log($scope.remarks);
                console.log( $scope.imgArr.toString())
                $scope.file = $scope.imgArr.toString()
                console.log($scope.id,typeof($scope.id))
                console.log(parseInt($scope.id,10))
                console.log(Number($scope.id))
                console.log($scope.supplierAccountId)
                if($scope.remarks == ''){
                  layer.msg('请填写备注')
                }else if($scope.remarks.length>200){
                  layer.msg('输入的字符不能超过200个')
                }else{
                    var data = {
                      "remarks": $scope.remarks,
                      "proofImgUrl":$scope.file,
                      "id": $scope.id,
                      "supplierAccountId": $scope.supplierShopId,
                      "tradeAmount": $scope.tradeAmount
                  }
                  erp.postFun('supplier/supplierWalletTradeLog/addWithdrawAgree', data, function (res) {
                      console.log(res)
                      // if (res.data.statusCode == 200) {
                      if (res.data.code == 200) {
                          $scope.isConfirm = false;
                          $scope.deletImgFun()
                          $scope.imgArr = []
                          $scope.remarks = ''
                          getData()
                      }else{
                        $scope.deletImgFun()
                        $scope.imgArr = []
                        $scope.remarks = ''
                        layer.msg(res.data.error)
                      }
                    }, function (data) {
                      console.log(data)
                    },{layer:true})
                }
                
            }

            //取消同意
            $scope.cancelTixian = function(){
                $scope.isConfirm = false
                $scope.remarks = ''
                $scope.deletImgFun()
                $scope.imgArr = []
            }

            //拒绝
                $scope.refuseTixian = function(item){
                  console.log(item)
                $scope.isRefuse = true;
                $scope.id = item.id
                $scope.supplierShopId = item.supplierAccountId
                $scope.tradeAmount = item.tradeAmount
            }
            //拒绝确定
            $scope.sureConfirm1 = function(item){
                console.log(item)
                $scope.remarks = item;
                $scope.file = $scope.imgArr.toString()
                console.log($scope.remarks);
                if($scope.remarks.length<5){
                    layer.msg('请输入至少5个字符')
                }else if($scope.remarks.length>200){
                  layer.msg('输入的字符不能超过200个')
                }else{
                    var data = {
                      "remarks": $scope.remarks,
                      "proofImgUrl":$scope.file,
                      "id": $scope.id,
                      "supplierAccountId": $scope.supplierShopId,
                      "tradeAmount": $scope.tradeAmount
                    }
                    erp.postFun('supplier/supplierWalletTradeLog/addWithdrawRefuse', data, function (res) {
                        console.log(res)
                        // if (res.data.statusCode == 200) {
                        if (res.data.code == 200) {
                          $scope.isRefuse = false;
                          $scope.deletImgFun()
                          $scope.imgArr = []
                          $scope.remarks = ''
                          getData()
                        }
                    }, function (data) {
                        console.log(data)
                    },{layer:true})
                }
            }

            //取消拒绝
            $scope.cancelTixian1 = function(){
                $scope.isRefuse = false
                $scope.remarks = ''
                $scope.imgArr = []
                $scope.deletImgFun()
            }
                
            //关闭所有弹框
            $scope.closeAlltan = function(){
                $scope.isConfirm = false;
                $scope.isRefuse = false;
                $scope.imgArr = []
                $scope.remarks = ''
                $scope.deletImgFun()
            }
        }]
    )
})()
