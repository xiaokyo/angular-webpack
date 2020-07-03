(function(){
    app.controller('salesCommissionZiOrderCtrl',[
        "$scope",
        "erp",
        "$routeParams",
        "utils",
        "$location",
        "$filter",
        function($scope,erp,$routeParams,utils,$location,$filter){
            console.log('salesCommissionZiOrderCtrl') 
             $scope.parentOrderId  = $routeParams.id;
            //  console.log($scope.parentOrderId)
            // window.history.back();
            $scope.dataList = [];
            $scope.pageSize = '20';
            $scope.pageNum = 1;
             $scope.searVal = '' ;       //搜索
             $scope.orderVal = '' ;       //搜索
             $scope.customName = '' ;       //搜索
             $scope.startTime = '';
             $scope.endTime = '';
            //  $scope.seaType = '0'   //订单类型
             $scope.customType = '0'    //
             $scope.jufenType = ''
             $scope.orderType = ''
             $scope.yunfeiType = ''
             $scope.zidingdan = ''
            //  $scope.parentOrderId = ''
            $scope.isEdit = false
            $scope.moneyVal1 = ''
            $scope.moneyVal2 = ''
            $scope.rates = 0

              //清空
              function clear(){
                $('#date1').val(formatWDate)
                $('#date2').val(formatNowDate)
                $scope.searVal = ''
                $scope.pageNum = 1
                $scope.imgArr = []
            }
           $scope.startTime = ''
           $scope.endTime = ''
    
          
           //搜索
           $scope.searchInput = function(){
               $scope.pageNum = 1
               var d = moment($('#date1').val(),"YYYY-MM"); 
                 var firstDate = d.startOf("month")._d.getDate(); 
                 var lastDate = d.endOf("month")._d.getDate(); 
                 $scope.startTime = $('#date1').val()?$('#date1').val()+'-'+firstDate:''
                 $scope.endTime = $('#date1').val()?$('#date1').val()+'-'+lastDate:''
               getData();
                    
           }
           $scope.UrlArr = []
           $scope.ImgUrlArr = []
           //获取列表
         
           function getData(){
            var data = {
              "pageNo": $scope.pageNum,
              "pageSize": $scope.pageSize,
              // "pageSize": 2,
              "begainDate":$scope.startTime,
              "endDate": $scope.endTime,
              "orderId": $scope.zidingdan,
              "parentOrderId": $scope.parentOrderId,
              "transportCommissionType": $scope.yunfeiType,
              "disputeOrderStatus": $scope.jufenType,
            }
          erp.postFun('erp/salecommission/querySaleCommissionRecordList', data, function (res) {
              console.log(res)
              if (res.data.statusCode == 200) {
                $scope.dataList2 = res.data.result.list;
                $scope.rates = res.data.result.rate;
                if($scope.dataList2){
                  for(let i = 0,len = $scope.dataList2.length;i<len;i++){
                      $scope.dataList2[i]['index'] = $scope.pageSize*($scope.pageNum-1)+i+1
                  }
                }
                $scope.TotalNum = res.data.result.totalCount;
                console.log($scope.TotalNum)
                pageFun1()
              }else{
                $scope.imgArr = []
                $scope.remarks = ''
                layer.msg(res.data.error)
              }
            }, function (data) {
              console.log(data)
            },{layer:true})
          }
           
            getData();
          
          //分页
          function pageFun1() {
            console.log($scope.TotalNum)
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
          $scope.comeBack1 = function(){
            window.history.back();
          }

          $scope.AddContent = function(item){
              console.log(item)
              $scope.orderIds = item.orderId
              $scope.moneyVal1 = item.reissueProductCommission
              $scope.moneyVal2 = item.reissueProductTransportCommission
              $scope.disputeOrderStatus = item.disputeOrderStatus
              $scope.isEdit = true
          }
          $scope.sureConfirm1 = function(){
              let data = {
                "orderId":$scope.orderIds,
                "reissueProductCommission":$scope.moneyVal1,
                "reissueProductTransportCommission":$scope.moneyVal2,
              }
            erp.postFun('erp/salecommission/updateReissueProductCommission', data,function(res){
                console.log(res)
                if(res.status == 200){
                    $scope.isEdit = false
                    getData()
                }else{
                    layer.msg('修改失败')
                }
            },function(){

            })
          }
          $scope.closeAlltan = function(){
              $scope.isEdit = false;
          }
        }]
    )
})()
