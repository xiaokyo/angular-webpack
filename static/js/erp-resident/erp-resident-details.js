(function(){
    var app = angular.module('erp-resident');
    app.controller("CommissionDetailsCtrl",[
      "$scope",
      "erp",
      "$routeParams",
      "utils",
      "$location",
      "$filter",
      function($scope,erp,$routeParams,utils,$location,$filter){
       console.log('CommissionDetailsCtrl') 

       //
       $scope.dataList = [];
       $scope.pageSize = '20';
       $scope.pageNum = 1;
       $scope.val='1'
       $scope.searVal = '';
       $scope.selectVal = '1'
       $scope.tabArr = [
           {'name':'佣金明细','val':'1','isActive':'true' },
           {'name':'佣金设置','val':'2','isActive':''},
        ];
        $scope.isDetail = false;      
        $scope.remarks = '';            //要编辑的备注
        $scope.yongjinNum = '';   //设置佣金值  
        $scope.id = '';   

       //切换tab
       $scope.checkTab = function(item){
            console.log(item)
            for(i=0;i<$scope.tabArr.length;i++){
                $scope.tabArr[i].isActive = '';
            }
            item.isActive = true;
            $scope.val = item.val;
            $('#date1').val('')
            $('#date2').val('')
            $scope.searVal = ''
            $scope.pageNum = 1;
            clear()
            getData()
       }
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
 
 
        //清空
        function clear(){
         $('#date1').val(formatWDate)
         $('#date2').val(formatNowDate)
         $scope.searVal = ''
         $scope.pageNum = 1
       }
       //查询
       $scope.searchInput = function(){
           $scope.pageNum = 1
           console.log($scope.pageNum)
           getData();
       }
       //获取列表
       function getData() {
           console.log($scope.pageNum)
           var url;
           var data;
           if($scope.val == '1'){
             url = "supplier/supplierOrder/commissionInfoList"
             data = {
              "pageNum": $scope.pageNum ,
              // "page": $scope.pageNum +'',
              "pageSize": $scope.pageSize *1,
              "search": $scope.searVal,
              "beginTime": $('#date1').val(),
              "endTime": $('#date2').val(),
              "orderType": $scope.selectVal *1
            };
           }else if($scope.val== '2'){
            url = "supplier/supplierOrder/findCommission"
            data = {
              "commissionType": $scope.selectVal *1
            };
           }
        
        erp.postFun(url, data, function (res) {
          console.log(res)
          // if (res.data.statusCode == 200) {
          if (res.data.code == 200) {
            $scope.dataList = res.data.data.list;
            $scope.yongjinNum = res.data.data.commissionType;
            if($scope.dataList){
               for(let i = 0,len = $scope.dataList.length;i<len;i++){
                  $scope.dataList[i]['index'] = $scope.pageSize*($scope.pageNum-1)+i+1
              }
            }
            console.log($scope.dataList)
            $scope.TotalNum = res.data.data.total;
            console.log($scope.TotalNum)
            pageFun1()
          }
        }, function (data) {
          console.log(data)
        },{layer:true})
      }
      getData()

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

        //点击编辑，添加备注
        $scope.addRemarks = function(remark,id){
          console.log(remark)
            console.log(id)
            $scope.remarks = remark;
            $scope.id = id;
            $scope.isDetail = true
        }

        $scope.sureEdit = function(remark){
            console.log(remark)
            // console.log($scope.remarks)
            var data = {
                "remark":$scope.remarks,
                "id": $scope.id
            };
            erp.postFun("supplier/supplierOrder/addRemark", data, function (res) {
                console.log(res)
                // if (res.data.statusCode == 200) {
                if (res.data.code == 200) {
                    $scope.isDetail = false
                    getData();
                    pageFun1()
                }
              }, function (data) {
                console.log(data)
              },{layer:true})
        }
        $scope.cancelEdit = function(remark,id){
            $scope.isDetail = false
            $scope.remarks = remark
        }
      //佣金设置
      $scope.toPlayFee = function(){
         $scope.yongjinNum = $('#yongjin').val();
         console.log( $scope.yongjinNum ,typeof $scope.yongjinNum)
         if($scope.yongjinNum == ''){
            layer.msg('佣金设置比例不能为空')
         }else{
             //向后台传送数据
            var data = {
                "commissionNum": $scope.yongjinNum *1,
                "commissionType": $scope.selectVal *1
            };
            erp.postFun("supplier/supplierOrder/setCommission", data, function (res) {
                console.log(res)
                if (res.data.code == 200) {
                    layer.msg('设置成功')
                }else{
                  layer.msg(res.data.error)
                }
            }, function (data) {
                // console.log(data)
            },{layer:true})
            }
      }
    }

    ])
})()