(function(){
    var app = angular.module('erp-resident');
    app.controller("ExchangeRateCtrl",[
      "$scope",
      "erp",
      "$routeParams",
      "utils",
      "$location",
      "$filter",
      function($scope,erp,$routeParams,utils,$location,$filter){
       console.log('ExchangeRateCtrl') 

       //
       $scope.dataList = [];
       $scope.pageSize = '20';
       $scope.pageNum = 1;
       $scope.val='1'
       $scope.tabArr = [
           {'name':'汇率设置','val':'1','isActive':'true' },
        //    {'name':'收入明细','val':'2','isActive':''},
        ];
        // $scope.searVal = '' ;       //搜索
        // $scope.startTime = '';
        // $scope.endTime = '';
        $scope.moneyVal = '';   //币种展示
        $scope.moneyType = '';   //币种类型
        $scope.moneyAddVal = '';   //币种展示
        $scope.moneyAddType = '';   //币种类型
        $scope.id = ''
        $scope.rateTypr = ''  //选择汇率
        // $scope.seaType = '1' ;   //下拉选择框
        // $scope.selectVal = ''
        // $scope.totalMoney = ''    //获取总金额

        //弹窗
        $scope.isdelRate = false      //删除
        $scope.isEditRate = false
        $scope.isAdd = false
        
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
        // $('#date1').val(formatWDate)
        // $('#date2').val(formatNowDate)
        // $scope.searVal = ''
        $scope.pageNum = 1
      }
       //切换下拉选择框
       $scope.selectArr = [
           {'name':'运费',val:'productFee',activeVal:'1'},
           {'name':'供应商佣金',val:'payFee',activeVal:'2'},
       ]
      

       $scope.checkSelect = function(){
            // console.log($scope.seaType)
            // clear()
            // getData()
            var data;
            if($scope.isAdd ==true){
              data = {
                "currencyType": $scope.moneyAddType,
                "exchangeRate": $scope.moneyAddVal
              }
              erp.postFun("supplier/supplierExchangerate/exchangeR", data, function (res) {
                console.log(res)
                // if (res.data.statusCode == 200) {
                if (res.data.code == 200) {
                  $scope.moneyAddVal = res.data.data.rate
                  console.log($scope.moneyVal)
                }else{
                  layer.msg(res.data.error)
                }
              }, function (data) {
                console.log(data)
              },{layer:true})
            }
            if($scope.isEditRate ==true){
              data = {
                "currencyType": $scope.moneyType,
                "exchangeRate": $scope.moneyVal
              }
              erp.postFun("supplier/supplierExchangerate/exchangeR", data, function (res) {
                    console.log(res)
                    // if (res.data.statusCode == 200) {
                    if (res.data.code == 200) {
                      $scope.moneyVal = res.data.data.rate
                      console.log($scope.moneyVal)
                    }else{
                      layer.msg(res.data.error)
                    }
                  }, function (data) {
                    console.log(data)
                  },{layer:true})
            }
            
       }

    //    //搜索
    //    $scope.searchInput = function(){
    //        $scope.pageNum = 1
    //        getData();
    //    }


       //获取列表
       function getData() {
        var data = {
         
        };
        // erp.postFun("erp/supplierExchangerate/getAllBankExchangeRate", data, function (res) {
        erp.postFun("supplier/supplierExchangerate/getAllBankExchangeRate", data, function (res) {
          console.log(res)
          // if (res.data.statusCode == 200) {
          if (res.data.code == 200) {
            // $scope.dataList = res.data.result.rows;
            $scope.dataList = res.data.data.list;
            if($scope.dataList){
               for(let i = 0,len = $scope.dataList.length;i<len;i++){
                  $scope.dataList[i]['index'] = $scope.pageSize*($scope.pageNum-1)+i+1
                   if($scope.dataList[i]['orderType'] == 1){
                    $scope.dataList[i]['orderType'] = '供应商佣金'
                   }
                   if($scope.dataList[i]['orderType'] == 2){
                    $scope.dataList[i]['orderType'] = '包裹运费'
                   }
                  // $scope.totalMoney = $scope.dataList[i]['']
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
      getData()


      //获取汇率
      function getRate(){
        var data = {}
        erp.postFun("supplier/supplierExchangerate/currencyList", data, function (res) {
          console.log(res)
          // if (res.data.statusCode == 200) {
          if (res.data.code == 200) {
            // $scope.dataList = res.data.result.rows;
            $scope.rateTypr = res.data.data;
          }
        }, function (data) {
          console.log(data)
        },{layer:true})
      }
      

      
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

 
      //删除
      $scope.delRate = function(item){
            console.log(item)
            $scope.id = item.id
            $scope.isdelRate = true
      }

      //取消
      $scope.cancelDel = function(){
        $scope.isdelRate = false
      }

      //确定
      $scope.sureConfirm = function(){
        var data = {
          "id": $scope.id
        };
        erp.postFun("supplier/supplierExchangerate/deleteBankExchangeRate", data, function (res) {
          console.log(res)
          // if (res.data.statusCode == 200) {
          if (res.data.code == 200) {
            $scope.closeAlltan()
            getData()
            pageFun1()
          }else{
            layer.msg(res.data.error)
          }
        }, function (data) {
          console.log(data)
        },{layer:true})
       
      }

      //修改
      $scope.editRate = function(item){
          console.log(item)
          $scope.moneyVal = item.exchangeRate;
          $scope.moneyType = item.currencyType;
          $scope.id = item.id;
          console.log($scope.moneyVal,$scope.moneyType,$scope.id)
          $scope.isEditRate = true;
          getRate()
      }
     
      //确定
      $scope.sureConfirmEdit = function(){
        console.log($scope.moneyVal)
        console.log($scope.moneyType)
        console.log($scope.id)
        if($scope.moneyVal == ''){
          layer.msg('汇率设置不能为空')
        }
        else if($scope.moneyType == ''){
          layer.msg('外币币种不能为空')
        }
         else{
          var data = {
            "id": $scope.id,
            "currencyType": $scope.moneyType,
            "exchangeRate": $scope.moneyVal
          };
          erp.postFun("supplier/supplierExchangerate/updateBankExchangeRate", data, function (res) {
            console.log(res)
            // if (res.data.statusCode == 200) {
            if (res.data.code == 200) {
              $scope.closeAlltan()
              getData()
              pageFun1()
            }else{
              layer.msg(res.data.error)
            }
          }, function (data) {
            console.log(data)
          },{layer:true})
         } 
      }

      //取消
      $scope.cancelEdit = function(){
        $scope.isEditRate = false
        $scope.moneyType = ''
        $scope.moneyVal = ''
      }
      
      //增加
      $scope.addRate = function(){
        $scope.isAdd = true;
        getRate()
      }

      //确定
      $scope.sureConfirmAdd = function () { 
        console.log($scope.moneyAddVal)
        console.log($scope.moneyAddType)
        if($scope.moneyAddVal == ''){
            layer.msg('汇率设置不能为空')
        }
        else if($scope.moneyAddType == ''){
          layer.msg('外币币种不能为空')
        }else{
            var data = {
            "currencyType": $scope.moneyAddType,
            "exchangeRate": $scope.moneyAddVal *1
          };
          erp.postFun("supplier/supplierExchangerate/addBankExchangeRate", data, function (res) {
            console.log(res)
            // if (res.data.statusCode == 200) {
            if (res.data.code == 200) {
              $scope.closeAlltan()
              getData()
              pageFun1()
            }else{
              layer.msg(res.data.error)
            }
          }, function (data) {
            console.log(data)
          },{layer:true})
        }
       }
      
       //取消
       $scope.cancelAdd = function () {
          $scope.isAdd = false
          $scope.moneyAddType = ''
          $scope.moneyAddVal = ''
       }
      //关闭所有弹窗
      $scope.closeAlltan = function(){
        $scope.isEditRate = false
        $scope.isdelRate = false
        $scope.isAdd = false
        $scope.moneyVal = ''
        $scope.moneyType = ''
        $scope.moneyAddType = ''
        $scope.moneyAddVal = ''
      }
    }
    ])
})()