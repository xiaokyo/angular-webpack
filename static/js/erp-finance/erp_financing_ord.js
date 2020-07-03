(function(){
    app.controller('salesCommissionOrdCtrl',[
        "$scope",
        "erp",
        "$routeParams",
        "utils",
        "$location",
        "$filter",
        "$rootScope",
        function($scope,erp,$routeParams,utils,$location,$filter, $rootScope){
            console.log('salesCommissionOrdCtrl') 
     
            $scope.salesPersonId = $routeParams.id;
            // $scope.payTime = 
            console.log(window.location.hash.split('=')[1])
            $scope.payTime = window.location.hash.split('=')[1]

            $scope.dataList = [];
            $scope.pageSize = '20';
            $scope.pageNum = $rootScope.ordPage || 1;
             $scope.orderVal = '' ;       //搜索
             $scope.customName = '' ;       //搜索
             $scope.startTime = '';
             $scope.endTime = '';
             $scope.seaType = ''   //订单类型
             $scope.customType = '0'    //
             $scope.jufenType = ''
             $scope.orderType = ''
             $scope.yunfeiType = ''
             $scope.zidingdan = ''
             $scope.parentOrderId = ''

            
             $scope.selectVal = ''

            
            $scope.startTime = ''
            $scope.endTime = ''
            $scope.rates = 0
           
            
           
            //搜索
            $scope.searchInput = function(){
                $scope.pageNum = 1
                var d = moment($('#date1').val(),"YYYY-MM"); 
                  var firstDate = d.startOf("month")._d.getDate(); 
                  var lastDate = d.endOf("month")._d.getDate(); 
                  $scope.startTime = $('#date1').val()?$('#date1').val()+'-'+firstDate:''
                  $scope.endTime = $('#date1').val()?$('#date1').val()+'-'+lastDate:''
                  if($scope.seaType=='2'){
                    $scope.jufenType = ''
                    console.log($scope.jufenType)
                  }
                getData();
            }
            $scope.UrlArr = []
            $scope.ImgUrlArr = []
            //获取列表
          
            function getData(){
              var data = {
                "pageNo": $scope.pageNum,
                "pageSize": $scope.pageSize,
                "orderType":$scope.seaType,
                "salesPersonId": $scope.salesPersonId,
                "payTime": $scope.payTime,
                "parentOrderId": $scope.orderVal,
                "customerName": $scope.customName,
                "disputeOrderStatus": $scope.jufenType,
                "userType": $scope.customType,
                "begainDate":$scope.startTime,
                "endDate": $scope.endTime,
            }
            erp.postFun('erp/salecommission/querySaleCommissionParentList', data, function (res) {
                console.log(res)
                if (res.data.statusCode == 200) {
                  $scope.dataList = res.data.result.list;
                  $scope.rates = res.data.result.rate;
                  if($scope.dataList){
                    for(let i = 0,len = $scope.dataList.length;i<len;i++){
                        $scope.dataList[i]['index'] = $scope.pageSize*($scope.pageNum-1)+i+1
                        $scope.dataList[i].payTime =  $scope.dataList[i].payTime.split('.',1)[0]
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
        
        
      $scope.id = ''
      $scope.supplierShopId = ''
      $scope.tradeAmount = ''
        //   返回
        $scope.comeBack = function(){
            // window.history.back();
            location.href = 'manage.html#/erpFinancing/expendiure/commission?payTime='+$scope.payTime;
            // window.open('manage.html#/erpFinancing/expendiure/commission?payTime='+$scope.payTime)
        }
       

          
          //  查看子订单
          $scope.ziOrder = function(parentId){
            $scope.parentId = parentId
            $rootScope.ordPage = $scope.pageNum;
            $scope.pageNum = 1;
            location.href = 'manage.html#/erpFinancing/expendiure/ziOrder/'+parentId
          }
        }]
    )
})()
