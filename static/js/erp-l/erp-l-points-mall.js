(function() {
  var app = angular.module("erp-l");
  //问题接口
  app.controller("pointsmallCtrl", [
    "$scope",
    "erp",
    "$routeParams",
    "utils",
    "$location",
    "$filter",
    function($scope, erp, $routeParams, utils, $location, $filter) {
      console.log("pointsmallCtrl");

      //选项卡头部，切换至哪个页面
      $scope.expenditureTypeModel = {
        cost: { val: 1, txt: "待核对" },
        dispute: { val: 2, txt: "待处理" },
        sellComposite: { val: 3, txt: "待回访" },
        completeds: { val: 4, txt: "已完成" },
        costInfo: { val: 5, txt: "待核对信息表格" },
        tosurecostInfo: { val: 6, txt: "待核对信息表格确认" },
        disputeInfo: { val: 7, txt: "待处理信息" },
        tosuredisputeInfo: { val: 8, txt: "待处理信息确认" },
        sellCompositeInfo: { val: 9, txt: "待回访信息" },
        tosuresellCompositeInfo: { val: 10, txt: "待回访信息确认" },
        completedInfo: { val: 12, txt: "已完成确认" }
      };
      //弹窗
      $scope.iscost = false; //待核对
      $scope.iscompleted = false; //待处理
      $scope.isdispute = false; //待回访
      $scope.isoption = false; //已完成

      //获取数据
      $scope.orderList = "";
      $scope.checkList = ""; //点击核对获取数据 
      $scope.itemList = ""; //点击按钮获取对应一行的数据 
      $scope.checkids = [];   //点击核对提交时存放id
      $scope.checkremark = [];   //点击核对提交时存放备注
      $scope.contentmen = [];   //点击提交时存放联系人
      $scope.contentphone= [];   //点击提交时存放联系电话
      $scope.id = ''              //获取待处理的id
      $scope.username = ''         //获取用户（顾客名称）

      // 获取备注
      $scope.daishenhe = "";


      //绑定联系人与联系方式
      // $scope.contentmens = ''
      // $scope.contentphone = ''

      //获取顶部数量
      $scope.titleNum1 = 0;
      $scope.titleNum2 = 0;
      $scope.titleNum3 = 0;
      $scope.titleNum4 = 0;

      //传递参数
      if ($scope.expenditureType == 1) {
        // senedData = {stutes}
      }

      //tab页切换
      $scope.expenditureType = 1;
      if ($scope.expenditureType == 1) {
        getList();
        total();
        // $scope.canShowPage = true;
      }
      $scope.changeIncomeType = type => {
        // console.log(type);    //1,2,3,4
        $scope.expenditureType = type;
        // clearSearch()
        getList();
        total();
        
      };
      console.log($scope.expenditureType)

      // 获取数据列表
      function getList() {
        let url = "erp/integralMall/getERPFlightList",
          // , sendData = { pageNo: Number($scope.pageNum), pageSize: Number($scope.pageSize), cjorderNo: $scope.cjorderNo, localTn:$scope.localTn}
          sendData = { status: $scope.expenditureType + "" };
        $scope.searchSendData = JSON.parse(JSON.stringify(sendData));
        optAsyn({
          url,
          sendData,
          callback: result => {
            console.log(result);
            const message = result.message;
            const list = result.result;
            console.log(list);
            if (list) {
              $scope.orderList = list.map(cost => {
                cost.flight_time.time = erp.formatDate(cost.flight_time.time); //起飞时间
                cost.create_date.time = erp.formatDate(cost.create_date.time); //创建时间
                cost.update_date.time = erp.formatDate(cost.update_date.time); //创建时间
                console.log(cost.flight_time.time);
                console.log(cost.create_date.time);
                total();
                return cost;
              });
            }
            console.log($scope.orderList);
          }
        });
      }

      function total(){
        let url = "erp/integralMall/total",
        sendData = {};
        $scope.searchSendData = JSON.parse(JSON.stringify(sendData));
        optAsyn({
        url,
        sendData,
        callback: result => {
          console.log(result);
          const res = result.result;
          console.log(res)
          if (res.length>0) {
            for(i=0;i<res.length;i++){
              console.log(res[i].total)
              if(res[i].status == 1){
                $scope.titleNum1 = res[i].count
              }
              else if(res[i].status == 2){
                $scope.titleNum2 = res[i].count
                console.log($scope.titleNum2)
              }else if(res[i].status == 3){
                $scope.titleNum3 = res[i].count
              }
              else if(res[i].status == 4){
                $scope.titleNum4 = res[i].count
              }
            }
            console.log($scope.titleNum1,$scope.titleNum2,$scope.titleNum3,$scope.titleNum4)
            // res.forEach(ele=>{
            //   console.log(ele.status)
            //   if(ele.status == 1){
            //     $scope.titleNum1 = ele.total
            //   }else if(ele.status == 2){
            //     $scope.titleNum2 = ele.total
            //   }else if(ele.status == 3){
            //     $scope.titleNum3 = ele.total
            //   }else if(ele.statu == 4){
            //     $scope.titleNum4 = ele.total
            //   }
            // })
          }
          console.log($scope.titleNum);
        }
      });
      }

      //点击核对

    // 待审核
      // 核对待审核
      $scope.costcheck = function(item) {
        console.log(item.id);
        $scope.username = item.customer_name;
        $scope.itemList = item;
        $scope.flightId = item.id;
        console.log(item.batch_no);
        $scope.expenditureType = $scope.expenditureTypeModel.costInfo.val;
        console.log($scope.expenditureType);
        //点击核对，要传入批次号  betch_no:item.piciNum
        let url = "erp/integralMall/getServerOrderList",
          // sendData = { batch_no: item.batch_no + "" };
          sendData = { id: item.id + "" };
        $scope.searchSendData = JSON.parse(JSON.stringify(sendData));
        optAsyn({
          url,
          sendData,
          callback: result => {
            console.log(result);
            const message = result.message;
            const list = result.result;
            console.log(list);
            if (list) {
              $scope.checkList = list.map(cost => {
                return cost;
              });
            }
            console.log($scope.checkList);
          }
        });
      };
      //核对提交(将数据提交到后台)
      $scope.surecost = function() {
        // console.log(item);
        let Dnote = document.querySelectorAll(".idW");
        console.log(Dnote)
        getinputText(Dnote,$scope.orderList,'remark');
        getinputText(Dnote,$scope.checkList,'remark');
        console.log($scope.checkList);
        let obj = {}
        let arr= []
        Dnote.forEach(ele=>
            {
              console.log(ele.getAttribute('id').slice(3));
              $scope.checkids.push(ele.getAttribute('id').slice(3));
              console.log($scope.checkids)
            }
          );
          $scope.checkList.forEach(ele=>{
            $scope.checkremark.push(ele.remark) ;
            console.log($scope.checkremark)
            // obj.remark = ele.remark ;
            // arr.push(obj);
          })
          for(i=0;i<$scope.checkids.length;i++){
              obj[$scope.checkids[i]] = $scope.checkremark[i];
          }
          console.log(obj)
          if($scope.checkremark.includes('')){
            layer.msg('请填写备注');
            $scope.checkremark = []
            $scope.checkids = []
          }else{
            $scope.iscost = true;
            obj.id = $scope.flightId;
            let url = "erp/integralMall/customerCheckOrder",
              sendData = obj;
            $scope.searchSendData = JSON.parse(JSON.stringify(sendData));
            optAsyn({
              url,
              sendData,
              callback: ({ result }) => {
                console.log(result);
                const { total, rows, pageSize } = result;
                if (rows) {
                  $scope.sellCompositeList = rows.map(item => {
                    item.moneyDate = utils.changeTime(item.moneyDate, false);
                    return item;
                  });
                  $scope.sellCompositeList.map(item => {
                    item.updatedTime = erp.formatDate(item.updatedTime);
                  });
                  console.log($scope.sellCompositeList);
                  $scope.totalCounts = total;
                  $scope.canShowPage = rows.length > 0;
                  pageFun();
                }
              }
        });
          }
        // console.log($scope.orderList);
        // console.log($scope.checkList);
        
      };

      //确定提交
      $scope.sureConfirm1 = function() {
        $scope.iscost = false;
        // console.log(item)
        // console.log(item.batch_no)
        // $scope.batch_no = item.batch_no;
        // $scope.username = item.customer_name;
        // $scope.id = item.batch_no
        // $scope.itemList = item;
        // console.log($scope.itemList)
        $scope.expenditureType = $scope.expenditureTypeModel.cost.val;
        getList()
        total();
      };

      // 待处理
      // 待处理确认
      $scope.contentInfo = function(item) {
        $scope.itemList = item;
        console.log(item)
        $scope.id = item.id
        $scope.expenditureType = $scope.expenditureTypeModel.disputeInfo.val;
        console.log($scope.checkList);
        let url = "erp/integralMall/getServerOrderList",
          // sendData = { batch_no: item.batch_no + "" };
          sendData = { id: item.id + "" };
          $scope.searchSendData = JSON.parse(JSON.stringify(sendData));
          optAsyn({
            url,
            sendData,
            callback: result => {
              console.log(result);
              const message = result.message;
              const list = result.result;
              console.log(list);
              if (list) {
                $scope.checkList = list.map(cost => {
                  return cost;
                });
              }
              console.log($scope.checkList);
              
            }
          });
      };

      // 待处理填写信息
      $scope.suredispute = function(item) {

            //获取联系人
            let contentmen = document.querySelectorAll(".idCr");
            console.log(contentmen);
            getinputText(contentmen, $scope.checkList, "contact_user");

            for (i = 0; i < contentmen.length; i++) {
              console.log(contentmen[i].value)
                $scope.contentmen.push(contentmen[i].value);
                // $scope.checkList[i].contact_user = contentmen[i].value ;
            }
            console.log($scope.contentmen)

            //获取联系电话
            let contentphone = document.querySelectorAll(".idCp");

            getinputText(contentphone, $scope.checkList, "contact_phone");
            console.log($scope.checkList)
            for (i = 0; i < contentphone.length; i++) {
              $scope.contentphone.push(contentphone[i].value);
              // $scope.checkList[i].contact_phone = contentphone[i].value ;
            }
            console.log($scope.contentphone)
            console.log($scope.checkList)
            if($scope.contentphone.includes("") || $scope.contentmen.includes("")){
                  layer.msg('联系人和联系方式都不能为空')
                  $scope.contentphone = [];
                  $scope.contentmen = [];
            }else{
              $scope.isdispute = true;
            }
      };

      //核对返回
      $scope.checkcancel = function(){
        $scope.expenditureType = $scope.expenditureTypeModel.dispute.val;
      }
      //待处理填写信息返回
      $scope.cancel3 = function(){

      }

      //  待处理确定提交
      $scope.sureConfirm2 = function() {
        $scope.isdispute = false;
        $scope.expenditureType = $scope.expenditureTypeModel.dispute.val;
        getList();
        total();
        
        // 处理数据
        let obj = {}
        let arrContent = []
        $scope.contentmen.forEach(ele=>{
          arrContent.push({contact_user:ele})
          console.log(arrContent)
        })
        for(i=0;i<$scope.contentphone.length;i++){
          arrContent[i].contact_phone = $scope.contentphone[i];
          arrContent[i].id = $scope.checkList[i].id;
        }
        console.log(arrContent)
        console.log($scope.orderList)

  let url = "erp/integralMall/addContactInfo",
            sendData = { 
              "contactInfo":arrContent,
              "id": $scope.id+""
             };
          $scope.searchSendData = JSON.parse(JSON.stringify(sendData));
          optAsyn({
            url,
            sendData,
            callback: result => {
              console.log(result);
              $scope.contentphone = [];
              $scope.contentmen = [];
              getList();
              total();
              // const message = result.message;
              // const list = result.result;
              // console.log(list);
              // if (list) {
              //   $scope.checkList = list.map(cost => {
              //     return cost;
              //   });
              // }
              console.log($scope.checkList);
            }
          });
      };

      //提交取消
      $scope.cancel2 = function () {
        $scope.isdispute=false;
        $scope.contentmen = [];
        $scope.contentphone = [];
      }
      

    //  待回访
      // 待回访确认
      $scope.completedInfo = function(item) {
        console.log(item);
         $scope.itemList = item;
         $scope.id = item.id;
        $scope.expenditureType =
          $scope.expenditureTypeModel.sellCompositeInfo.val;

          let url = "erp/integralMall/getServerOrderList",
          // sendData = { batch_no: item.batch_no + "" };
          sendData = { id: item.id + "" };
          $scope.searchSendData = JSON.parse(JSON.stringify(sendData));
          optAsyn({
            url,
            sendData,
            callback: result => {
              console.log(result);
              const message = result.message;
              const list = result.result;
              console.log(list);
              if (list) {
                $scope.checkList = list.map(cost => {
                  return cost;
                });
              }
              console.log($scope.checkList);
            }
          });
      };

      // 待回访数据确认
      $scope.surecompleted = function(item) {
        console.log(item);
        $scope.iscompleted = true;
      };

      // 确认完成服务
      $scope.sureConfirm3 = function(item) {
        $scope.iscompleted = false;
        $scope.expenditureType = $scope.expenditureTypeModel.sellComposite.val;
        let url = "erp/integralMall/updateStatus",
          sendData = {
            id:$scope.id
          };
        $scope.searchSendData = JSON.parse(JSON.stringify(sendData));
        optAsyn({
          url,
          sendData,
          callback: ({ result }) => {
            console.log(result);
            const statusCode = result;
            getList();
            total();
            if (statusCode == 200) {
             //刷新页面
             iscompleted=false
             getList();
             total();
            }
          }
        });
      };
      //待回访确认返回
      $scope.completecancel = function(){
        $scope.iscompleted=false;
        $scope.expenditureType = $scope.expenditureTypeModel.sellComposite.val;
        getList();
      }


    // 已完成
      $scope.toption = function(item) {
        console.log(item);
        $scope.itemList = item;
        $scope.expenditureType = $scope.expenditureTypeModel.completedInfo.val;
        
        let url = "erp/integralMall/getServerOrderList",
        // sendData = { batch_no: item.batch_no + "" };
        sendData = { id: item.id + "" };
        $scope.searchSendData = JSON.parse(JSON.stringify(sendData));
        optAsyn({
          url,
          sendData,
          callback: result => {
            console.log(result);
            const message = result.message;
            const list = result.result;
            console.log(list);
            if (list) {
              $scope.checkList = list.map(cost => {
                return cost;
              });
            }
            console.log($scope.checkList);
          }
        });


      };

      // 已完成返回
      $scope.tocancel = function() {
        $scope.expenditureType = $scope.expenditureTypeModel.completeds.val;
      };

      //请求接口分装
      function optAsyn({ url, sendData, callback }) {
        erp.postFun(
          url,
          JSON.stringify(sendData),
          ({ data }) => {
            console.log(data);
            if (data.statusCode === "200") {
              callback(data);
            } else {
              console.log("操作失败");
              // callback(data)
            }
          },
          error => {
            layer.msg("网络错误");
          },
          { layer: true }
        );
      }

      //获取文本框内容封装
      function getinputText(inputList, orderList, orderListkey) {
        for (i = 0; i < inputList.length; i++) {
          for (j = 0; j < orderList.length; j++) {
            // console.log(inputList[i])
            if (i == j) {
              orderList[j][orderListkey] = inputList[i].value;
              // $scope.contentmen.push(inputList[i].value);
              // console.log($scope.contentmen);
              // console.log(contentmen[i].value)
            }
          }
        }
      }
    }
  ]);
})();
