(function () {
    var app = angular.module('login-app', ['service']);
    app.controller('loginCtrl', ['$scope', '$window', '$location', 'erp', function ($scope, $window, $location, erp) {
        console.log('loginCtrl')
        var b = new Base64();
        var loginJob = localStorage.getItem('job') ? b.decode(localStorage.getItem('job')) : '';
        console.log(loginJob)
        $scope.remberpassword = localStorage.getItem('erpisRememberPassword') === '1' ? true : false;
        $scope.name = b.decode(localStorage.getItem('erploginName') || '') || "";
        $scope.password = b.decode(localStorage.getItem('erppassword') || '') || "";
        // 检测是否有tarket查询字符串
        $scope.target = erp.getQueryString('target');
        if ($scope.target) {
            // $scope.targetEncode = $scope.target;
            $scope.target = b.decode($scope.target);
        }
        var isphone = isPhone();
        //alert(isphone);
        if (isphone) {
            $('.zlogin-left').hide();
            $('.zlogin-right').css('margin-left', "0px");
        } else {
            $('.zlogin-left').show();
            $('.zlogin-right').css('margin-left', "90px");
        }

        function isPhone() {
            var isphone = false;
            //平台、设备和操作系统
            var system = {
                win: false,
                mac: false,
                x11: false,
                ipad: false
            };
            //检测平台
            var p = navigator.platform;
            system.win = p.indexOf("Win") == 0;
            system.mac = p.indexOf("Mac") == 0;
            system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
            system.ipad = (navigator.userAgent.match(/iPad/i) != null) ? true : false;
            if (system.win || system.mac || system.x11 || system.ipad) {
                // alert("PC");
                isphone = false;
            } else {
                var ua = navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == "micromessenger") {
                    // alert("微信浏览器");
                    isphone = true;
                } else {
                    // alert("手机");
                    isphone = true;
                }
            }
            return isphone;
        }

        // alert($scope.remberpassword)
        $scope.signin = function () {
            console.log(
                    $scope.name, $scope.password, $scope.remberpassword
            )
            if ($scope.name == '' || $scope.password == '') {
                // alert('用户名或则密码不能为空')
                layer.msg('用户名或密码不能为空')
            } else {
                const load = layer.load(0)
                erp.postFun('app/employee/login', {"data": "{'name':'" + $scope.name + "','passwd':'" + md5($scope.password) + "','isEncryption':'2' , 'platform':'pc'}" }, con, err);
                function con(n) {
                    layer.close(load)
                    console.log(
                            n.data
                    )
                    var data = n.data;
                    var code = n.data.statusCode;
                    if (code != 200) {
                        console.log(code)
                        localStorage.clear();
                        if (code == 503) {
                            // $scope.loginError = true;
                            // $scope.loginErrorMsg = 'User name or password error';
                            // $timeout(function () {
                            //     $scope.loginErrorMsg = '';
                            // }, 2000);
                            // alert(n.data.message)
                            layer.msg(n.data.message);
                        } else {
                            if (code == 701) {
                                var obj = JSON.parse(data.result)
                                console.log(obj)
                                localStorage.setItem('erpuserId', b.encode(obj.id));
                                localStorage.setItem('erploginName', b.encode(obj.loginName));
                                localStorage.setItem('erpname', b.encode(obj.name));
                                console.log(obj.staff);
                                localStorage.setItem('erpnumber', b.encode(obj.staff.number));
                                localStorage.setItem('erpnameen', obj.nameEN);
                                // localStorage.setItem('department', b.encode(obj.staff.department));
                                // localStorage.setItem('position', b.encode(obj.staff.position));
                                localStorage.setItem('erpinfo', b.encode(data.result))
                                location.href = 'staff-personcenter.html';
                            }
                        }
                    } else { // 登录成功
                        console.log(code)
                        var obj = JSON.parse(data.result)
                        console.log(obj)
                        localStorage.setItem('erpuserId', b.encode(obj.id));
                        localStorage.setItem('erploginName', b.encode(obj.loginName));
                        localStorage.setItem('erptoken', b.encode(obj.token));
                        localStorage.setItem('erpname', b.encode(obj.name));
                        localStorage.setItem('erpstatus', obj.status);
                        localStorage.setItem('erpcountry', b.encode(obj.country));
                        localStorage.setItem('erpaddress', b.encode(obj.address));
                        localStorage.setItem('erpemail', b.encode(obj.email));
                        localStorage.setItem('erpphone', b.encode(obj.phone));
                        localStorage.setItem('job', obj.job ? b.encode(obj.job) : '');
                        localStorage.setItem('space', obj.space);

                        // localStorage.setItem('storeLink', b.encode(obj.storeLink));
                        localStorage.setItem('erpsessionId', b.encode(obj.sessionId));
                        if ($scope.remberpassword) {
                            localStorage.setItem('erppassword', b.encode($scope.password));
                            localStorage.setItem('erpisRememberPassword', '1');
                        } else {
                            localStorage.removeItem('erppassword');
                            localStorage.setItem('erpisRememberPassword', '0');
                        }
                        console.log('login success');
                        if ($scope.target) {
                            location.href = $scope.target;
                            return;
                        }
                        if (obj.job == '销售' || obj.job == '管理') {
                            console.log('销售 管理')
                            location.href = 'manage.html#/mycj/ywyHome';
                        } else {
                            console.log('不是销售')
                            location.href = 'manage.html#/mycj/commonHome';
                        }


                    }

                    // window.location.assign('manage.html#/order')
                }

                function err(n) {
                    console.log(
                            n.message
                    )
                }

            }
        }
// $scope.isCheck = function () {
//     $scope.remberpassword = !$scope.remberpassword; 
// }
// $scope.keyDown=function(Event){
//     if(Event.keyCode==13){
//         $scope.signin();
//     }
// }
        $(document).keypress(function (Event) {
            if (Event.keyCode == 13) {
                $scope.signin();
            }
        })
    }])
})()



