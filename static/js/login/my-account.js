(function () {
    var app = angular.module('staffpersoncenter-app', ['service']);
    //信息修改
    app.controller('staffpersoncenterCtrl2', ['$scope', 'erp', function ($scope, erp) {
        console.log('staffpersoncenterCtrl2')
        var b = new Base64();
        $scope.userId = b.decode(localStorage.getItem('erpuserId'));
        // $scope.loginName=b.decode(localStorage.getItem('loginName'));
        $scope.changepassword = false;
        erp.postFun('app/employee/getupdate', {"data": "{'userId':'" + $scope.userId + "'}"}, function (n) {
            var obj = JSON.parse(n.data.result)
            console.log(obj)
            $scope.user = obj.list;
            $scope.userImg = obj.list.AVATAR;
            $scope.userImg = $scope.userImg.replace('http://','');
            $scope.userImg = $scope.userImg.replace('https://','');
            console.log($scope.userImg)
            $scope.userId = obj.list.ID;
            $scope.imgname = $scope.user.LOGIN_NAME.slice(0, 1).toUpperCase();
        }, err)
        function err (n) {
            console.log(n)
            layer.msg('网络错误')
        }

        $scope.upLoadImg4 = function(files) {
            layer.load(2)
            var data = new FormData();
            console.log(data)
            data.append('file', files[0]);

            erp.upLoadImgPost('app/ajax/upload', data, con, err)

            function con(n) {
                console.log(n)
                layer.closeAll('loading');
                if (n.data.statusCode=='200') {
                    layer.msg('上传成功')
                    var obj = JSON.parse(n.data.result)
                    console.log(obj[0])
                    $scope.userImg = obj[0];
                    var upData = {};
                    upData.img=$scope.userImg;
                    upData.userId=$scope.userId;
                    $('#document2').val('');
                    erp.postFun('app/employee/changeAvatar',JSON.stringify(upData),function (data) {
                        console.log(data)
                    },function (data) {
                        console.log(data)
                    })
                }else{
                    layer.msg('上传失败')
                }
            }

            function err(n) { 
                layer.closeAll('loading');
                console.log(n) 
            }
        }
    }])

})()