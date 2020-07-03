(function () {
    var app = angular.module('staffpersoncenter-app', ['service']);
//密码修改
    app.controller('staffpersoncenterCtrl2', ['$scope', 'erp', function ($scope, erp) {
        console.log('staffpersoncenterCtrl2');
        var b = new Base64();
        $scope.userId = b.decode(localStorage.getItem('erpuserId') == undefined ? '' : localStorage.getItem('erpuserId'));
        // $scope.loginName=b.decode(localStorage.getItem('loginName'));
        $scope.changepassword = false;
        $scope.password = '';
        $scope.passwordagain = '';
        function err(n) {
            console.log(n);
            layer.msg('网络错误');
        }

        erp.postFun('app/employee/getupdate', {"data": "{'userId':'" + $scope.userId + "'}"}, function (n) {
            var obj = JSON.parse(n.data.result);
            console.log(obj);
            $scope.user = obj.list;
            $scope.userImg = obj.list.AVATAR;
            $scope.userImg = $scope.userImg ? $scope.userImg.replace('https://', '').replace('http://', '') : null;
            console.log($scope.userImg);
            $scope.updateid = obj.list.updateid;
            $scope.enname = $scope.user.nameEN;
            $scope.imgname = $scope.user.LOGIN_NAME.slice(0, 1).toUpperCase();
        }, err);
        console.log($('#document2')[0])
        $scope.upLoadImg4 = function () {
            console.log($('#document2')[0].files)
            console.log($('#document2')[0].files.length)
            getSize();

        };
        function getSize(){
            var MyTest = document.getElementById("document2").files[0];
            var reader = new FileReader();
            reader.readAsDataURL(MyTest);
            reader.onload = function(theFile) {
                var image = new Image();
                image.src = theFile.target.result;
                image.onload = function() {
                    //alert("图片的宽度为"+this.width+",长度为"+this.height);
                    console.log(this.width,this.height);
                    if(this.width==this.height){
                        erp.ossUploadFile($('#document2')[0].files, function (data) {
                            $('#document2').val('');
                            console.log(data);
                            if (data.code == 0) {
                                layer.msg('上传失败');
                                return;
                            }
                            if (data.code == 2) {
                                layer.msg('部分图片上传失败');
                            }

                            $scope.userImg = data.succssLinks[0].replace('https://', '');
                            var upData = {};
                            upData.img = $scope.userImg;
                            upData.userId = $scope.userId;
                            $('#document2').val('');
                            erp.postFun('app/employee/changeAvatar', JSON.stringify(upData), function (data) {
                                console.log(data)
                            }, function (data) {
                                console.log(data)
                            })

                        });
                    }else{
                        layer.msg('请上传等宽高的头像');
                    }
                };
            };

        }
        $scope.EditSave = function () {
            if ($scope.password == '' || $scope.passwordagain == '') {
                layer.msg('请输入密码！')
            } else if ($scope.password == $scope.passwordagain) {
                if ($scope.user.nameEN) {
                    erp.postFun('app/employee/update', {"data": "{'id':'" + $scope.updateid + "','loginName':'" + $scope.user.LOGIN_NAME + "','name':'" + $scope.user.name + "','password':'" + md5($scope.password) + "','isEncryption':'2'}"}, con, err)
                } else {
                    erp.postFun('app/employee/update', {"data": "{'id':'" + $scope.updateid + "','loginName':'" + $scope.user.LOGIN_NAME + "','name':'" + $scope.user.name + "','password':'" + md5($scope.password) + "','nameEN':'" + $scope.enname + "','isEncryption':'2'}"}, con, err)
                }
            }else {
                layer.msg('密码不一致！')
            }
        };

        $scope.editclose = function () {
            // location.href = 'manage.html#/mycj';
            location.href = 'manage.html#/mycj';
        };

        function con(n) {
            console.log(n.data);
            if (n.data.statusCode == 200) {
                layer.msg('修改成功')
                // localStorage.clear();
                location.href = 'login.html';
                // setTimeout(function () {
                //     location.href = 'manage.html#/mycj';
                // }, 2000)
            } else {
                layer.msg('修改失败')
            }
        }
    }])

})();