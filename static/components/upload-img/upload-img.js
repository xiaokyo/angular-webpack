(function(angular) {
  angular.module('manage')
      .component('uploadImg', {
          templateUrl: 'static/components/upload-img/upload-img.html',
          controller: uploadImgCtrl,
          bindings: {
            width: '=',
            height: '=',
            id: '@',
          },
      });

      function uploadImgCtrl($scope, erp){
        $scope.upLoadImgProps = {
          imgUrl: '', // 图片地址
          width: this.width, // 组件宽度
          height: this.height, // 组件高度
          id: this.id, // 组件id
        };

        $scope.$on('uploadImgParam',(event,data)=>{
          if (data.id) {
            if (data.id == this.id) {
              $scope.upLoadImgProps.imgUrl = data.imgUrl;
            }
          } else {
            $scope.upLoadImgProps.imgUrl = data.imgUrl;
          }
        })

        // 上传图片
        $scope.upLoadImg = function(files){
          $scope.uploadImgs = []; // 待上传图片列表
          const file = files[0];
          const fileName = file.name;
          // 图片格式 allow: *.jpg/*.png/*.png/*.JPG
          if (!/.png|.jpg|.PNG|.JPG$/.test(fileName)) {
            return layer.msg('Invalid image. Only JPG and PNG supported.');
          }
          // 当前图片数据
          const currentImg = {};
          currentImg.file = file;
          // 如果上传的图片已在待上传列表直接 return
          if ($scope.uploadImgs.some(
              f => f.file.name === file.name && f.file.size === file.size
            )) {
              return;
          }
          // 上传阿里云
          erp.ossUploadFile(files, function (data) {
              if (data.code == 0) {
                layer.msg('Images Upload Failed');
                return;
              }
              if (data.code == 2) {
                layer.msg('Images Upload Incomplete');
              }
              const resUrl = data.succssLinks[0];
              $scope.upLoadImgProps.imgUrl = resUrl;
              $scope.uploadImgs.push(currentImg);
              $scope.$emit('uploadImgResult',resUrl);
              $scope.$apply();
          });
        }
        
      }
})(angular);