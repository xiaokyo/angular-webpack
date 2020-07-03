(function(){
    var app = angular.module('erp-resident');
    app.controller('StoreManagementCtrl',[
        "$scope",
        "erp",
        "$routeParams",
        "utils",
        "$location",
        "$filter",
        function($scope,erp,$routeParams,utils,$location,$filter){
            console.log('StoreManagementCtrl') 
     

                //
                $scope.dataList = [];
                $scope.pageSize = '20';
                $scope.pageNum = 1;
                $scope.val='1'
                $scope.searVal = '' ;       //搜索
                $scope.seaType = 'shopName'

                //弹窗（是否移出黑名单
                $scope.isConfirmAdd = false
                $scope.id = ''

                
            //清空
            function clear(){
                $scope.searVal = ''
                $scope.pageNum = 1
            }
            //搜索
            $scope.searchInput = function(){
                $scope.pageNum = 1
                getData();
            }

            //搜索选择框
     
     
            //获取列表
            function getData() {
                console.log($scope.pageNum)
             var data = {
               "pageNum": $scope.pageNum +'',
               "pageSize": $scope.pageSize,
               "isBlackList": 1,
               "sortType": 'createAt',
               [$scope.seaType]:$scope.searVal
             };
             erp.postFun("supplier/supplierShopBlackList/list", data, function (res) {
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

           //移出黑名单
           $scope.addBlackList = function(id){
                $scope.isConfirmAdd = true
                $scope.id = id
           }
           //确定
           $scope.sureConfirm = function(){
                var data = {
                    id:$scope.id
                }
                erp.postFun("supplier/supplierShopBlackList/remove",data,function(res){
                    console.log(res)
                    if(res.data.code == 200){
                        $scope.isConfirmAdd = false
                        getData()
                    }
                },function(data){},{layer:true})
           }

            
          
        }]
    )
})()