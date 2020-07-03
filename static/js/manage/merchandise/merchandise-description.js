(function(angular) {

  var app = angular.module('merchandise');

  app.controller('merchandiseDescriptionCtrl', ['$scope', '$window', '$location', '$compile', '$routeParams', '$timeout', '$http', 'erp', 'merchan', '$sce', function($scope, $window, $location, $compile, $routeParams, $timeout, $http, erp, merchan, $sce) {

    $scope.toshow = false
    $scope.tocheck = false
    $scope.commentId = $routeParams.commentId
    $scope.check = 2


    if(!$scope.commentId){
      getDataList() //列表页获取列表，详情页不需要获取
    }else{
      getDetails() //获取详情信息
    }

    $scope.switch = function(check){
      $scope.check = check
      getDataList(1,'10',{check})
      clear()
    }
    function getDataList(pageNum=1,pageSize='10',filter={check:$scope.check}){
      erp.postFun('erp/locComment/listCommentErp',{
        pageNum,
        pageSize,
        ...filter
      },function(data){
        if(data.data.statusCode == 200){
          const {result} =data.data
          result.list.forEach(item=>{
            if(item.dbLocproductImg){
              item.srcImg = item.dbLocproductImg.split(",")[0] || ""
            }
          })
          console.log(result)
          $scope.dataList = result.list
          $scope.pageNum = pageNum;
          $scope.pageSize = pageSize;
          $scope.$broadcast('page-data', {
						pageNum,
						pageSize:pageSize+"",
						totalNum: Math.ceil(result.count/pageSize),
            totalCounts: result.count,
            showSelect:false,
            showGo:false,          
					});

        }
      },function(data){
      },{layer:true})
    }
    $scope.$on('pagedata-fa', function(d, data) {
      $scope.pageNum = data.pageNum;
      $scope.pageSize = data.pageSize;
      getDataList(data.pageNum,data.pageSize,{check:$scope.check})
    });

    function clear(){
      $scope.dbLocproductSku = ""
      $scope.dbLocproductLanguageName = ""
      $scope.dspAccountName = ""
      $scope.startDate = ""
      $scope.endDate = ""
    }
    $scope.searchList = function(){
      const filter = {
        dbLocproductSku:$scope.dbLocproductSku,
        dbLocproductLanguageName:$scope.dbLocproductLanguageName,
        dspAccountName:$scope.dspAccountName,
        startDate:$scope.startDate,
        endDate:$scope.endDate,
        check:$scope.check
      }
      getDataList(1,"10",filter)
    }
    $scope.toggleShow = function(status,id){
      $scope.toshow = true
      $scope.isHide = status
      $scope.id = id

    }
    $scope.submit = function(){
      erp.postFun('erp/locComment/statusCommentErp',{
        commentId:$scope.id, //显隐的id
        status:$scope.isHide==1?0:1
      },function(data){
        if(data.data.statusCode == 200){
          $scope.toshow = false
          layer.msg("设置成功！")
          getDataList($scope.pageNum,$scope.pageSize,{check:$scope.check})
        }else{
          layer.msg("设置失败，请稍后再试！")
        }
      },function(data){
      },{layer:true})
    }
    function getDetails(){
      erp.postFun('erp/locComment/detailsCommentErp',{
        commentId:$scope.commentId,
      },function(data){
        if(data.data.statusCode == 200){
          const {result} =data.data
          const { dbLocproductComment,listCommentCheck,dbLocproductLanguage,dbLocproduct } = result
          $scope.dbLocproductComment = dbLocproductComment
          $scope.listCommentCheck = listCommentCheck
          $scope.dbLocproduct = dbLocproduct
          if(dbLocproductLanguage.sortType ==2){
            dbLocproductLanguage.lan = "泰文"
          }else if(dbLocproductLanguage.sortType ==3){
            dbLocproductLanguage.lan = "中文"
          }else{
            dbLocproductLanguage.lan = "英文"
          }
          $('#wang-editor').html(dbLocproductLanguage.description);
          $scope.dbLocproductLanguage = dbLocproductLanguage
          console.log(result)
        }
      },function(data){
      },{layer:true})
    }
    $scope.checkShow= function(data){
      $scope.tocheck = true
      $scope.tocheckData = data
    }
    $scope.checkData = function(){
      erp.postFun('erp/locComment/checkCommentErp',{
        commentId:$scope.tocheckData.id,
        locproductId:$scope.tocheckData.dbLocproductId,
        check:$(".redis input:checked").val(),
        remark:$scope.remark
      },function(data){
        if(data.data.statusCode == 200){
          layer.msg("设置成功！")
          $scope.tocheck = false
          getDataList($scope.pageNum,$scope.pageSize,{check:$scope.check})
        }
      },function(data){
      },{layer:true})
    }
    $scope.clearInput = function(){
      $scope.remark = "";
      $(".redis input:first").prop("checked",true);
      $scope.tocheck = false
    }


  }]);

})(angular)