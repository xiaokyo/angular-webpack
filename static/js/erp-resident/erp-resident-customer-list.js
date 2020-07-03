(function(){
    var app = angular.module('erp-resident');
    app.controller('CustomerListCtrl',[
        "$scope",
        "erp",
        "$routeParams",
        "utils",
        "$location",
        "$filter",
        function($scope,erp,$routeParams,utils,$location,$filter){
            console.log('CustomerListCtrl') 
     
            //
            $scope.dataList = [];
            $scope.pageSize = '20';
            $scope.pageNum = 1;
            $scope.val='1'
            $scope.searVal = '' ;       //搜索
            

            //文件上传文件
            $scope.file = ''
            //弹框
            $scope.isConfirm = false;
            $scope.isRefuse = false;
            $scope.isRefuse1 = false;

            //弹框的下拉选择框
            $scope.seaType = 'productFee'
            $scope.moneyVal = ''
            $scope.remarks = ''
            $scope.id = ''
             
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
               "pageNum": $scope.pageNum +'',
               "pageSize": $scope.pageSize,
               "customerName": $scope.searVal,
             };
             erp.postFun("supplier/supplierWalletInfo/queryWalletInfoPage", data, function (res) {
               console.log(res)
               // if (res.data.statusCode == 200) {
               if (res.data.code == 200) {
                 // $scope.dataList = res.data.result.rows;
                 $scope.dataList = res.data.data.list;
                 if($scope.dataList){
                    for(let i = 0,len = $scope.dataList.length;i<len;i++){
                       $scope.dataList[i]['index'] = $scope.pageSize*($scope.pageNum-1)+i+1
                       if( $scope.dataList[i]['presentAmount'] == null){
                        $scope.dataList[i]['presentAmount'] = "0.00"
                       }
                       if( $scope.dataList[i]['freezeLimit'] == null){
                        $scope.dataList[i]['freezeLimit'] = "0.00"
                       }
                       if( $scope.dataList[i]['createAt'] == null){
                        $scope.dataList[i]['createAt'] = new Date().getTime()
                       }
                   }
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


           //操作
           function optionAccount(url){
             if($scope.moneyVal < 0){
                  layer.msg('金额必须大于0')
             }else{
               var data = {
                "remarks": $scope.remarks,
                "supplierAccountId":$scope.id,
                // "supplierShopId":"1186189778280853505",
                "tradeAmount": $scope.moneyVal
            }
            erp.postFun(url, data, function (res) {
                console.log(res)
                // if (res.data.statusCode == 200) {
                if (res.data.code == 200) {
                    $scope.isConfirm = false;
                    $scope.isRefuse = false;
                    $scope.isRefuse1 = false;
                   getData()
                    $scope.remarks = ''
                    $scope.moneyVal = ''
                }else{
                    layer.msg(res.data.error)
                }
              }, function (data) {
                console.log(data)
              },{layer:true})
             }
            
           }

           //扣款
          //  $scope.confirmTixian = function(id,acc){
          //      $scope.id = id
          //      $scope.parentAccount = acc;
          //      $scope.isConfirm = true;
          //      console.log(acc,id)
          //  }
          //  //同意确定
          //   $scope.sureConfirm = function(item){
          //       console.log(item)
          //       $scope.remarks = item;
          //       console.log($scope.remarks);
          //       if($scope.moneyVal == ''){
          //         layer.msg('扣款金额不能为空')
          //       }else if($scope.moneyVal > $scope.parentAccount){
          //         layer.msg('扣款金额不能大于余额')
          //       }else if($scope.remarks.length<5){
          //           layer.msg('请输入至少5个字符')
          //       }else if($scope.remarks.length>200){
          //           layer.msg('输入的字符不能超过200个')
          //       }
          //       else{
          //           let url = "supplier/supplierWalletInfo/reduceWalletMoney"
          //           optionAccount(url)
          //       }
                
          //   }

          //   //取消同意
          //   $scope.cancelTixian = function(){
          //       $scope.isConfirm = false
          //       $scope.remarks = ''
          //       $scope.moneyVal = ''
          //   }

            //冻结
            $scope.refuseTixian = function(id){
                $scope.id = id
                $scope.isRefuse = true;
            }
            //拒绝确定
            $scope.sureConfirm1 = function(item){
                console.log(item)
                $scope.remarks = item;
                console.log($scope.remarks);
                console.log($scope.moneyVal);
                if($scope.remarks.length<5){
                    layer.msg('请输入至少5个字符')
                }else if($scope.remarks.length>200){
                  layer.msg('输入的字符不能超过200个')
                }else{
                    let url = "supplier/supplierWalletInfo/addWalletFreezeLimit"
                    optionAccount(url)
                }
            }

            //取消拒绝
            $scope.cancelTixian1 = function(){
                $scope.isRefuse = false
                // $('#document2').val('')
                $scope.remarks = ''
                $scope.moneyVal = ''
            }


            // //退款
            // $scope.refuseTixian1 = function(id){
            //     $scope.isRefuse1 = true;
            //     $scope.id = id
            // }
            // //退款确定
            // $scope.sureConfirm2 = function(item){
            //             console.log(item)
            //             $scope.remarks = item;
            //             console.log($scope.remarks);
            //             console.log($scope.moneyVal);
            //             if($scope.moneyVal == ''){
            //               layer.msg('退款金额不能为空')
            //             }else if($scope.remarks.length<5){
            //                 layer.msg('请输入至少5个字符')
            //             }else if($scope.remarks.length>200){
            //               layer.msg('输入的字符不能超过200个')
            //             }else{
            //                 let url = "supplier/supplierWalletInfo/addWalletMoney"
            //                 optionAccount(url)
            //             }
            // }
        
            // //取消退款
            // $scope.cancelTixian2 = function(){
            //             $scope.isRefuse1 = false
            //             // $('#document2').val('')
            //             $scope.remarks = ''
            //             $scope.moneyVal = ''
            // }
                
            //关闭所有弹框
            $scope.closeAlltan = function(){
                $scope.isConfirm = false;
                $scope.isRefuse = false;
                $scope.isRefuse1 = false;
                $scope.remarks = ''
                $scope.moneyVal = ''
            }
        }]
    )
})()