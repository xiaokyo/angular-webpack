;
~(function() {
  let app = angular.module('analysis');
  app.controller('superdealAnalysisCtrl', ['$scope', 'erp', '$filter', function($scope, erp, $filter) {
    $scope.type = 1; //1：所有列表；2：sku列表
    $scope.storeList = [
        { 'storeName': '全部', 'store': ''}, 
        { 'storeName': '义乌仓', 'store': 0}, 
        { 'storeName': '深圳仓', 'store': 1}, 
        { 'storeName': '美西奇诺仓', 'store': 2}, 
        { 'storeName': '美东新泽西仓', 'store': 3}, 
        { 'storeName': '泰国仓', 'store': 4}
    ]
    
    // 列表请求参数
    $scope.listParam={
      storageDoId:'',
      pageSize:'10',
      pageNum:'1',
      sku:'',
      discountStatus:'1'
    }

    $scope.getList=()=> {
      layer.load(2);
      erp.postFun('erp/unsold/product/listPage', $scope.listParam, ({data}) => {
        layer.closeAll();
        let obj = data.result;
        $scope.superList = obj.rows;
        $scope.totalNum = obj.total;
        let pagetol = Math.ceil($scope.totalNum / (+$scope.listParam.pageSize))
        $scope.$broadcast('page-data', {
          pageSize: $scope.listParam.pageSize, //每页条数
          pageNum: $scope.listParam.pageNum, //页码
          totalNum: pagetol, //总页数
          totalCounts: $scope.totalNum, //数据总条数
          pageList: ['10', '30', '50'] //条数选择列表，例：['10','50','100']
        })
      }, (err) => {
        layer.closeAll();
        layer.msg('网络错误');
      })
    }
    $scope.getList();
    $scope.$on('pagedata-fa', function(_,{pageNum,pageSize}) { // 分页onchange
      $scope.listParam.pageNum = pageNum;
      $scope.listParam.pageSize = pageSize;
      $scope.getList();
    })
    let getSKUList=(obj,callback)=>{
      layer.load(2);
      let params = {
        pid:obj.productId
      }
      erp.postFun('erp/unsold/variant/getVariantsByProductId', params, ({data}) => {
        layer.closeAll();
        if(data.statusCode=='200'){
          callback(data.result)
        }else{
          callback([])
          layer.msg('获取sku列表失败')
        }
      })
    }
    $scope.viewDetailFun = item => {
      $scope.productSKU=item.sku;
      if(!item.detailList){
        let sendObj = {productId:item.productId};
        getSKUList(sendObj,(data)=>{
          item.detailList = data;
          $scope.superSKUList=data;
          $scope.type=2;
        })
      }else{
        $scope.superSKUList=item.detailList;
        $scope.type=2;
      }
    }
  }])


})();