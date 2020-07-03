(function () {
    var app = angular.module('staffpersoncenter-app', ['service']);
    //信息修改
    app.controller('staffpersoncenterCtrl2', ['$scope', 'erp', function ($scope, erp) {
        console.log('staffpersoncenterCtrl2')
        var b = new Base64();
        $scope.userId = b.decode(localStorage.getItem('erpuserId'));
        // $scope.loginName=b.decode(localStorage.getItem('loginName'));
        $scope.changepassword = false;
        $scope.password = '';
        $scope.confirmpassword = '';
        $scope.password1 = '';
        $scope.passwordState = false;
        $scope.confirmpasswordState = false;
        $scope.DQpassword = false;
        $scope.userState = false;
        $scope.nameState = false;
        erp.postFun('app/employee/getupdate', {"data": "{'userId':'" + $scope.userId + "'}"}, function (n) {
            var obj = JSON.parse(n.data.result)
            console.log(obj)
            $scope.user = obj.list;
            $scope.imgname = $scope.user.LOGIN_NAME.slice(0, 1).toUpperCase();
            $scope.userId = obj.list.ID;
        }, err)
        function err (n) {
            console.log(n)
            layer.msg('网络错误')
        }
        //头像
        $scope.upLoadImg4 = function (files) {
            var data = new FormData();      //以下为向后台提交图片数据
            data.append('file', files[0]);
            data.append('index', '1');
            erp.upLoadImgPost('app/ajax/upload', data, con, err)
            function con (n) {
                console.log(n.data.result)
                var obj = JSON.parse(n.data.result)
                $scope.headimg = 'https://' + obj[0];
                $scope.user.AVATAR = $scope.headimg;

                console.log($scope.headimg);
                console.log($scope.user.AVATAR);
                $('#document2').val('');
                erp.postFun('app/employee/changeAvatar', {userId:$scope.userId,'img': $scope.headimg}, function (n) {
                    console.log(n.data);
                    if (n.data.statusCode == "200") {
                        layer.msg("图片上传成功");
                    }
                }, err)
            }
            function err (n) {
                console.log(n)
            }
        }
        //密码验证
        $scope.pawbl = function () {
            var reg = /^([0-9]|[a-zA-Z]){6,16}$/;
            if(!reg.test($scope.password)){
                $scope.password = '';
                $scope.confirmpassword = '';
                layer.msg('密码格式不对，请重新设置。')
            }else {
                $scope.passwordState = false;
            }
        }
        //提交
        $scope.infoClick = function () {
            if (!$scope.user.LOGIN_NAME) {
                $scope.userState = true;
                return;
            }else {
                $scope.userState = false;
            }
            if (!$scope.user.name) {
                $scope.nameState = true;
                return;
            }else {
                $scope.nameState = false;
            }
            console.log($scope.user.updateid)
            var data = {
                id:$scope.user.updateid,
                name:$scope.user.eename,
                nameEN:$scope.user.nameEN,
                loginName:$scope.user.LOGIN_NAME
                // password:$scope.password
            }
            erp.postFun('app/employee/update',{"data":data}, function (n) {
                if(n.data.statusCode == 200){
                    layer.msg('修改成功');
                    // window.top.location.href = 'login.html';
                }else {
                    layer.msg('修改失败')
                }
            }, function(n){
                layer.msg('修改失败')
            })
        }
        $scope.subClick = function () {
            if (!$scope.password1) {
                $scope.DQpasswordState = true;
            }else {
                $scope.DQpasswordState = false;
            }
            if (!$scope.password) {
                $scope.passwordState = true;
            }
            if (!$scope.confirmpassword) {
                $scope.confirmpasswordState = true;
            }
            if($scope.password && $scope.confirmpassword && $scope.password1){
                if ($scope.password == $scope.confirmpassword) {
                    $scope.DQpasswordState = false;
                    $scope.passwordState = false;
                    $scope.confirmpasswordState = false;
                    var data = {
                        id:$scope.user.updateid,
                        // name:$scope.user.name,
                        // nameEN:$scope.user.nameEN,
                        // loginName:$scope.user.LOGIN_NAME,
                        passwordold:md5($scope.password1),
                        password:md5($scope.password),
                        isEncryption:'2'
                    }
                    erp.postFun('app/employee/update',{"data":data}, function (n) {
                        if(n.data.statusCode == 200){
                            layer.msg('修改成功');
                            window.top.location.href = 'login.html';
                        }else {
                            layer.msg('修改失败')
                        }
                    }, function(n){
                        layer.msg('修改失败')
                    })
                }else {
                    $scope.confirmpassword = '';
                    layer.msg('2次密码不一样，请重新设置。')
                }
            }
        }
        $scope.gologin = function () {
            window.top.location.href = 'login.html';
        }
    }])

})()