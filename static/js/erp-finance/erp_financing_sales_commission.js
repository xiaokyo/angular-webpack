(function(){
    app.controller('salesCommissionCtrl',[
        "$scope",
        "erp",
        "$routeParams",
        "utils",
        "$location",
        "$filter",
        "$rootScope",
        function($scope,erp,$routeParams,utils,$location,$filter, $rootScope){
            console.log('salesCommissionCtrl') 
            
            //
            $scope.dataList = [];
            $scope.pageSize = '20';
            $scope.pageNum = 1;;
            //  $scope.searVal = '' ;       //搜索
             $scope.startTime = '';
             $scope.endTime = '';
             $scope.orderType = ''
             $scope.salesPersonId = ''
             $scope.parentOrderId = ''
             $scope.rates = 0


            //文件上传文件
            $scope.file = ''
            //弹框
            $scope.isConfirm = false;
            $scope.isRefuse = false;
            
             $scope.selectVal = ''
             $scope.moneyVal = ''

            
     
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
            $scope.startTime = ''
            $scope.endTime = ''

            var myDate=new Date();
            
            myDate.setMonth(myDate.getMonth()+1);
            // $('#date1').val(myDate.getFullYear() + "-" + myDate.getMonth())
            $scope.payTime = $routeParams.payTime?$routeParams.payTime:myDate.getFullYear() + "-" + myDate.getMonth();
            $scope.searVal = $routeParams.searVal?$routeParams.searVal:'';
     
            $('#date1').val($scope.payTime)
            console.log( $('#date1').val())
            console.log($scope.searVal)
            //搜索
            $scope.searchInput = function(){
                $scope.pageNum = 1
                console.log($('#date1').val())
                  // var d = moment($('#date1').val(),"YYYY-MM"); 
                  // var firstDate = d.startOf("month")._d.getDate(); 
                  // var lastDate = d.endOf("month")._d.getDate(); 
                  // $scope.startTime = $('#date1').val()?$('#date1').val()+'-'+firstDate:''
                  // $scope.endTime = $('#date1').val()?$('#date1').val()+'-'+lastDate:''
                  getData();
            }
            //获取列表
            function getData() {
                
             var data = {
               // "pageNum": $scope.pageNum +'',
               "pageNo": $scope.pageNum +'',
               "pageSize": $scope.pageSize,
               "salesPerson": $scope.searVal,
               "groupId": !$scope.groupId ? null : $scope.groupId,
               "payTime": $('#date1').val(),
              //  "begainDate": $scope.startTime,
              //  "endDate": $scope.endTime,
             };
             erp.postFun("erp/salecommission/querySaleCommissionList", data, function (res) {
               console.log(res)
               if (res.data.statusCode == 200) {
                 $scope.dataList = res.data.result.list;
                 $scope.rates = res.data.result.rate;
                 if($scope.dataList){
                    for(let i = 0,len = $scope.dataList.length;i<len;i++){
                       $scope.dataList[i]['index'] = $scope.pageSize*($scope.pageNum-1)+i+1
                   }
                  //  console.log($scope.ImgUrlArr)
                 }
                 console.log($scope.dataList)
                 $scope.TotalNum = res.data.result.totalCount;
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
      
        

           //查看母订单
           $scope.confirmDetail = function(item){
                console.log(item)
                $scope.pageNum = 1;
                $scope.ordPage = 1;
                $scope.orderType = item.orderType
                $scope.salesPersonId = item.salesPersonId
                $scope.parentOrderId = item.parentOrderId
                location.href = 'manage.html#/erpFinancing/expendiure/muOrder/'+item.salesPersonId+'?payTime='+item.payTime;
           }
          //  查看子订单
        
          
           
        }]
    )
})()
