(function() {
  var app = angular.module('erp-seachd-app', ['service']);
  app.controller('erp-searchd-control', ['$scope', '$routeParams', 'erp', function($scope, $routeParams, erp) {
    $scope.esoudeId = $routeParams.id;
    $scope.sourcetype = $routeParams.sourcetype;
    let fitType1=""
    if($scope.sourcetype == "0"){
      fitType1 = '店铺搜品'
    }else if($scope.sourcetype == "1"){
      fitType1 = "独有搜品"
    }else{
      fitType1 = "平台搜品"
    }
    $scope.fitType1 = fitType1
    var sourceDetail = {};
    sourceDetail.data = {
      id: $scope.esoudeId,
      sourcetype: $scope.sourcetype
    };
    sourceDetail.data = JSON.stringify(sourceDetail.data);
    console.log(JSON.stringify(sourceDetail))
    erp.postFun('source/sourcing/Cjdetaill', JSON.stringify(sourceDetail), function(data) {
      $scope.sourceDetail = JSON.parse(data.data.result);
      $scope.sourcecontent = $scope.sourceDetail.accSource;
      console.log($scope.sourcecontent)
      const { status }=$scope.sourcecontent
      let fitType2 = ""
      if((status == "2" && fitType1!="平台搜品") || (fitType1=="平台搜品" && status == "0")){
        fitType2 = "搜品失败"       
      }else if(status == "3" || (fitType1=="平台搜品"&&status == "2")){
        fitType2 = "搜品成功"
      }else{
        fitType2 = '搜品中'
      }
      $scope.fitType2 = fitType2
      $scope.sourcecontent.imageUrl = $scope.sourcecontent.imageUrl.split(',');
      for (var i = 0; i < $scope.sourcecontent.imageUrl.length; i++) {
        $scope.sourcecontent.imageUrl[i] = 'https://' + $scope.sourcecontent.imageUrl[i].replace('https://', '').replace('https://', '');

      }
      $scope.sourcecontent.imageUrl = $scope.sourcecontent.imageUrl.slice(0, 10);


    }, function() {

    })
    $scope.succeed=function(item){
      window.open('https://app.cjdropshipping.cn/product-detail.html?id=' + item.CjproductId+"&type="+item.sourcetype,"_blank")      
  }











  }])
})()