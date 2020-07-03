(function(){
    var app = angular.module('erp-resident-new',[]);
    app.controller("PostNewInformationCtrl",[
      "$scope",
      "erp",
      "$routeParams",
      "utils",
      "$location",
      "$filter",
      function($scope,erp,$routeParams,utils,$location,$filter){
        //   console.log('PostNewInformationCtrl');
          //输入不能超过20个字符
          $('#title').on('input',function(){
            if($('#title').val().length >= 20){
                layer.msg('输入字符不能多于20个')
                $('#title').attr('maxlength','20')
            }
          })

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
            // console.log(editor2.txt.text())
            console.log(editor2.txt.html())         //发送给后台
            topublic()
          }, false)

          //清空
          $scope.clearNewConsult = function(){
            $('#title').val('');
            $('#title').val('');
            editor2.txt.html('')
          }
          
          //向后台发送数据
          function topublic(){
              erp.postFun('supplier/notifyInfo/release', {
                'title': $scope.titleContent,
                'content': editor2.txt.html(),
            }, function (res) {
                if (res.data.code == 200) {
                    layer.msg('发布成功');
                    location.href = "#/ResidentMerchant/ActivityConsultation"
                }else{
                    layer.msg(res.data.message)
                }
            })
        }
        
    }
    ])
})()