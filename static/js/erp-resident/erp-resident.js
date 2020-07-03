(function(){
    var app = angular.module('erp-resident',[]);
    app.controller("ActivityConsultationCtrl",[
      "$scope",
      "erp",
      "$routeParams",
      "utils",
      "$location",
      "$filter",
      "$http",
      function($scope, erp, $routeParams, utils, $location, $filter,$http){
          console.log("ActivityConsultationCtrl")

          $scope.isEdit = false
          $scope.dataList = [];
          // $scope.totalpage = '';
          $scope.pageNum = 1
          $scope.TotalNum = ''
          $scope.pageSize = '20';
          $scope.isDetail = false;
          $scope.isDel = false;
          $scope.content = ''    //文章详情
          $scope.createAt = ''    //文章详情
          $scope.title = ''    //文章详情
          $scope.id = ''
         
      // 获取列表
      function getData() {
        var data = {
          "page": $scope.pageNum +'',
          "pageSize": $scope.pageSize,
        };
        erp.postFun("supplier/notifyInfo/getList", data, function (res) {
          console.log(res)
          // if (res.data.statusCode == 200) {
          if (res.data.code == 200) {
            // $scope.dataList = res.data.result.rows;
            $scope.dataList = res.data.data.list;
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

      //点击详情
      $scope.showArtical = function(item){
          console.log(item);
          //打开详情弹框
          $scope.isDetail = true;
          $scope.content = item.content
          $scope.createAt = item.createAt
          $scope.title = item.title
          $('.activeContent').html(item.content) 
      }

      //点击关闭详情
      $scope.lookProclose = function(){
        $scope.isDetail = false
      }
      //发布新资讯按钮
      $scope.pushNewConsult = function(){
        // window.open('manage.html#/merchandise/show-detail/' + id + '/' + '0' + '/' + '3' + '/' + '0', '_blank', '');
        window.open('manage.html#/ResidentMerchant/PostNewInformation'+'');
        // location.href = '#/ResidentMerchant/PostNewInformation'
      }


      //删除
      $scope.delArtical = function(item){
         $scope.id = item.id
         $scope.isDel = true
      }
      //确定删除
      var data = {}
      $scope.sureDel = function(){
       erp.postFun("supplier/notifyInfo/delete/"+$scope.id+'',data,  function (res) {
          console.log(res)
          if (res.data.code == 200) {
             $scope.isDel = false
              getData()
          }
        }, function (data) {
          console.log(data)
        },{layer:true})
      }
      //取消删除
      $scope.cancelDel = function(){
        $scope.isDel = false
      }


      //编辑
      $scope.EditArtical = function(item){
        $scope.isEdit = true
        $scope.id = item.id
        // window.open('manage.html#/ResidentMerchant/EditInformation'+'')
        $scope.content = item.content
        $scope.createAt = item.createAt
        $scope.title = item.title
        editor2.txt.html($scope.content)
        console.log(editor2.txt.html())  
      }

        //创建富文本
        var E = window.wangEditor
        var editor2 = new E('#pushEditor')
        editor2.customConfig.uploadImgServer = 'https://erp.cjdropshipping.com/app/ajax/upload'  // 上传图片到服务器
          editor2.customConfig.uploadFileName = 'file'
          editor2.customConfig.uploadImgHooks = {
            customInsert: function (insertImg, result, editor) {
                console.log(result)
                // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
                // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

                // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
                var imgList = JSON.parse(result.result);
                for (var i = 0; i < imgList.length; i++) {
                    imgList[i] = 'https://' + imgList[i];
                }
                if (imgList.length > 0) {
                    insertImg(imgList);
                }

                // result 必须是一个 JSON 格式字符串！！！否则报错
            }
        }
        editor2.create();
       
        //取值
        document.getElementById('publicConsult').addEventListener('click', function () {
          $scope.titleContent = $('#title').val();       //标题
          console.log($scope.titleContent)
          console.log(editor2.txt.html())         //发送给后台
          erp.postFun('supplier/notifyInfo/release/'+$scope.id, {
            'title': $scope.titleContent,
            'content': editor2.txt.html(),
          }, function (res) {
            if (res.data.code == 200) {
                layer.msg('修改成功');
                getData()
                // location.href = "#/ResidentMerchant/ActivityConsultation"
                $scope.isEdit = false
            }else{
                layer.msg(res.data.message)
            }
        })
        }, false)

        //清空
        $scope.clearNewConsult = function(){
          $('#title').val($scope.title);
          // $scope.isEdit = false
          editor2.txt.html($scope.content)
        }


    }
    ])
})()