;
~function() {
  let app = angular.module('purchase-app');
  app.controller('purchaseCostCtrl', ['$scope', 'erp', '$filter','$routeParams', function($scope, erp, $filter,$routeParams) {
    $scope.type = 1; //1：采购成本；2：采购记录
    $scope.productObj = {};
    let pageData1 = {};
    // 列表请求参数
    $scope.listParam={
      pageNum:1,
      pageSize:'20',
      data:{
        sku:'',
        buyerName:''
      }
    }

    $scope.getList=()=> {
      layer.load(2);
      erp.postFun('procurement/cost/list', $scope.listParam, ({data}) => {
        layer.closeAll();
        let obj = data.data;
        $scope.dataList = obj.list.map(item=>{
          item.hoverShow=false;
          item.showItemDetail=false;
          return item;
        });
        let totalCounts = obj.total;
        const {pageSize,pageNum}=$scope.listParam;
        $scope.pageData={
          pageSize, pageNum, totalCounts,
          pageList: ['20', '50', '100'] //条数选择列表
        }
        pageData1 = angular.copy($scope.pageData);
      }, (err) => {
        layer.closeAll();
        layer.msg('网络错误');
      })
    }
    $scope.getList();
    $scope.$on('pagedata-fa', function(_,{pageNum,pageSize}) { // 分页onchange
      $scope.listParam.pageNum=pageNum;
      $scope.listParam.pageSize=pageSize;
      if($scope.type==1){
        $scope.getList();
      }else{
        let params = {
          stanSku:$scope.recordObj.vSku,
          buyerName:$scope.recordObj.buyerName
        };
        getRecordList(params,(data)=>{
          let totalCounts = data.total;
          $scope.pageData={
            pageSize, pageNum, totalCounts,
            pageList: ['20', '50', '100'] //条数选择列表
          }
          $scope.recordSKUList=data.list;
        })
      }
    })
    $scope.showSkuList = item => {
      item.showItemDetail = !item.showItemDetail;
    }
    let getRecordList=(obj,callback)=>{
      layer.load(2);
      const {pageSize,pageNum}=$scope.listParam;
      let params = {
        pageSize,pageNum,
        data:{
          stanSku:obj.stanSku,
          buyerName:obj.buyerName
        }
      };
      erp.postFun('procurement/cost/getOrderRecordList', params, ({data}) => {
        layer.closeAll();
        if(data.code=='200'){
          callback(data.data)
        }else{
          callback([]);
          layer.msg('获取sku列表失败')
        }
      })
    }
    $scope.goRecord = (item)=>{
      $scope.recordObj =item;
      const {pageSize,pageNum}=$scope.listParam;
      let params = {
        stanSku:item.vSku,
        buyerName:item.buyerName
      };
      $scope.productObj.sku = item.vSku;
      getRecordList(params,(data)=>{
        let totalCounts = data.total;
        $scope.pageData={
          pageSize, pageNum, totalCounts,
          pageList: ['20', '50', '100'] //条数选择列表
        }
        $scope.recordSKUList=data.list;
        $scope.type=2;
      })
    }
    $scope.goBack = ()=>{
      $scope.type=1;
      $scope.pageData = angular.copy(pageData1);
    }
  }]).filter('procurementType', function() { //采购方式替换
    return function(val) {
      let name;
      switch(+val){
        case 0:
          name='1688非API';
          break;
        case 1:
          name='1688API';
          break;
        case 2:
          name='淘宝';
          break;
        case 3:
          name='天猫';
          break;
        case 4:
          name='	线下';
          break;
      }
      return name;
    }
  });


}();
