(function () {
	var app = angular.module('login-app',['service']);
  app.controller('loginCtrl',['$scope', '$window', '$location','erp', function ($scope, $window, $location,erp) {
    console.log('loginCtrl')
    var b = new Base64();
    $scope.remberpassword = localStorage.getItem('erpisRememberPassword') === '1' ? true : false;
    console.log($scope.remberpassword);
    if($scope.remberpassword){
        $scope.name = b.decode(localStorage.getItem('erploginName') || '') || "";
        $scope.password = b.decode(localStorage.getItem('erppassword') || '') || "";
    }
    
    // alert($scope.remberpassword)
    $scope.signin=function () {
    	console.log(
    		$scope.name,$scope.password,$scope.remberpassword
    	)
    	if($scope.name==''||$scope.password==''){
    		alert('用户名或则密码不能为空')
    	}else{
        erp.load();
    	  erp.postFun('app/employee/login',{"data":"{'name':'"+$scope.name+"','passwd':'"+md5($scope.password)+"','isEncryption':'2'}"},con,err);
      }
    }
    function con(n){
        console.log(n.data)
        var data =  n.data;
        var code =  n.data.statusCode;
        if (code != 200) {
          erp.closeLoad();
          console.log(code)
            localStorage.clear();
            if (code == 503) {
                // $scope.loginError = true;
                // $scope.loginErrorMsg = 'User name or password error';
                // $timeout(function () {
                //     $scope.loginErrorMsg = '';
                // }, 2000);
        alert(n.data.message)
            } else {
                if(code==701){
                    var obj=JSON.parse(data.result)
                    console.log(obj)
                    localStorage.setItem('erpuserId', b.encode(obj.id));
                    localStorage.setItem('erploginName', b.encode(obj.loginName));
                    localStorage.setItem('erpname', b.encode(obj.name));
                    console.log(obj.staff)
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
          var obj=JSON.parse(data.result)
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
          // localStorage.setItem('storeLink', b.encode(obj.storeLink));
          localStorage.setItem('erpsessionId', b.encode(obj.sessionId));
          if ($scope.remberpassword) {
              localStorage.setItem('erppassword', b.encode($scope.password));
              localStorage.setItem('erpisRememberPassword','1');
          } else {
              localStorage.removeItem('erppassword');
              localStorage.setItem('erpisRememberPassword','0');
          }
          console.log('login success');
          erp.postFun('app/message/getYWYPhoneChatUrl',null,function (n) {
            erp.closeLoad();
            if (n.error){
                layer.msg('网络错误')
            }else {
                // window.open(n.href);
                // var obj=JSON.parse(n)
                console.log(n.data.href)
                // var win= window.open();
                //  win.location=n.data.href;
                // $scope.talkhref=n.data.href;
                location.href = n.data.href;
            }
          },err)
          // location.href = 'manage.html#/mycj';

        }

          // window.location.assign('manage.html#/order')
    }
    function err(n){
      erp.closeLoad();
      console.log(n);
    }
    // $scope.isCheck = function () {
    //     $scope.remberpassword = !$scope.remberpassword; 
    // }
    // $scope.keyDown=function(Event){
    //     if(Event.keyCode==13){
    //         $scope.signin();
    //     }
    // }
    $(document).keypress(function(Event){
        if(Event.keyCode==13){
            $scope.signin();
        }
    });
  }])
})()



