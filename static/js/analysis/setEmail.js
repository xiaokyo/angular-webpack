(function () {
  app.controller('setEmailCtrl', ['$scope', 'erp', '$http','utils', function ($scope, erp, $http, utils) {
    $scope.pageNum = 1; // 分页 
    $scope.pageSize = 5; // 分页 每页展示几条
    $scope.currentPage = 1; // 当前页
    $scope.pagenumarr = ['5', '20', '30', '50', '100']; // 设置每页展示几条
    $scope.showFLag = false; // 配置弹窗
    $scope.showFLagTips = false; // 删除提示框
    $scope.currenRow = null; // 当前操作行数据
    $scope.currenKey = null; // 当前key
    $scope.formVerify = {
      name_cn: true,
      name_en: true,
      desc_cn: true,
      desc_en: true,
      score: true,
      i1: true,
      sort: true,
      items: true
    }; // 表单必填验证

    getList(); // 初始化列表数据

    // 属性列表数据
    $scope.dataList = [];

    // 属性配置列表
    function getList() {
      let rqData = {
        pageNum: $scope.pageNum,
        pageSize: $scope.pageSize
      };
      erp.postFun("erp/userAttribute/queryPage", rqData, function (data) {
        if(data.data.statusCode == 200){
          const {rows, total} = data.data.result;
          // $scope.dataList = list.map(item => {
					// 	item.createTime = utils.changeTime(item.createTime, false)
					// 	return item
          // });
          $scope.dataList = rows;
          $scope.$broadcast('page-data', {
            pageSize: $scope.pageSize.toString(),
            pageNum: $scope.pageNum,
            // totalNum: result.page,
            totalCounts: total,
            pageList: $scope.pagenumarr
          });
        }else{
          layer.msg('操作错误，请稍后再试');
        }
      }, function (err) { 
        layer.msg('操作错误，请稍后再试');
      }, { layer: true })
    }

    // 分页触发
    $scope.$on('pagedata-fa', function(d, data) {
      $scope.pageNum = parseInt(data.pageNum);
      $scope.pageSize = parseInt(data.pageSize);
      getList();
    });

    // 状态切换
    $scope.setStatus = function(item){
      item.enabled = !item.enabled;
      let rqData = {
        id: item.id,
        enabled: item.enabled
      };
      erp.postFun('erp/userAttribute/updateStateById', rqData, function (data) {
        if(data.data.statusCode != 200){
          layer.msg('操作错误，请稍后再试');
        }
      }, function (err) { 
        layer.msg('操作错误，请稍后再试');
      }, { layer: true })
    }

    // 表单验证数据初始化
    $scope.formVerifyInit = function(){
      $scope.formVerify = {
        name_cn: true,
        name_en: true,
        desc_cn: true,
        desc_en: true,
        score: true,
        i1: true,
        sort: true,
        items: true
      }
    }

    // 表单验证
    $scope.formVerifyFun = function(){
      let verifyValue = true;
      for (var key in $scope.formVerify) {
        if($scope.currenRow){
          $scope.formVerify[key] = $scope.currenRow[key] === null || $scope.currenRow[key] === undefined || $scope.currenRow[key] === '' ? false : true;
        }else{
          $scope.formVerify[key] = false;
        }
        console.log(key,'-',$scope.formVerify[key]); 
        if($scope.formVerify[key] === false){
          verifyValue = false;
        }
      }
      
      return verifyValue;
    }

    // 新增/编辑属性弹窗
    $scope.addAttribute = function(key, item){
      $scope.formVerifyInit();
      $scope.currenRow = item === null || item === undefined || item === '' ? null : JSON.parse(JSON.stringify(item));
      $scope.currenKey = key === null || key === undefined || key === '' ? null : key;
      $scope.showFLag = !$scope.showFLag;
      console.log($scope.currenRow)
    }
    
    // 新增/编辑属性弹窗-保存
    $scope.addAttributeOk = function(){
      let verifyResult =  $scope.formVerifyFun();
      console.log("verifyResult",verifyResult)
      if(!verifyResult){
        return;
      }
      console.log("currenRow",$scope.currenRow);
      let rqUrl = $scope.currenRow.id === undefined ? 'erp/userAttribute/insert' : 'erp/userAttribute/updateById';
      let rqData = $scope.currenRow;
      rqData.enabled = true;
      erp.postFun(rqUrl, rqData, function (data) {
        if(data.data.statusCode == 200){
          layer.msg('操作成功');
          $scope.showFLag = !$scope.showFLag;

          // 新增刷新列表
          if($scope.currenRow.id === undefined){
            getList();
          }else{
            if($scope.currenKey !== null || $scope.currenKey !== undefined || $scope.currenKey !== ''){
              $scope.dataList[$scope.currenKey] = JSON.parse(JSON.stringify($scope.currenRow));
            }
          }
        }else if(data.data.statusCode == 401){
          layer.msg(data.data.message);
        }else{
          layer.msg('操作错误，请稍后再试');
        }
      }, function (err) { 
        layer.msg('操作错误，请稍后再试');
      }, { layer: true })
    }
    
    // 只允许数字输入
    $scope.scoreFormat = function(item){
      item.score = utils.floatLength(item.score, 0);
    }
    $scope.priorityFormat = function(item){
      item.i1 = utils.floatLength(item.i1, 0);
    }
    $scope.sortFormat = function(item){
      item.sort = utils.floatLength(item.sort, 0);
    }

  }])
})()