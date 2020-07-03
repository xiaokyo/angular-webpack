(function () {
	var app = angular.module('app',[]);
	app.controller('forgotCtrl',['$scope','$http', '$timeout', '$interval', function ($scope, $http, $timeout, $interval) {

		$scope.beforeSuccess = true;
		$scope.afterSuccess = !$scope.beforeSuccess;

		$scope.forgetPass = true;
		$scope.resetPass = !$scope.forgetPass;
		
		$scope.isError = false;
		$scope.emailAdress = '';
		$timeout(function(){
			$('.email-input').focus(function () {
				$('.email-img').attr('src','./static/image/login/email-check.png');
			})
			$('.email-input').blur(function () {
				$('.email-img').attr('src','./static/image/login/email.png');
			})
			$('.pass-input').focus(function () {
				$(this).parent().find('img').attr('src','./static/image/login/iconpassword-check.png');
			});
			$('.pass-input').blur(function () {
				$(this).parent().find('img').attr('src','./static/image/login/iconpassword-grey.png');
			});
		},0)
		
		$scope.sendEmail=function () {
			$scope.isError = true;//如果没有找到邮件地址
			$('.forcon-text').css('margin-top', '70px')
			$('.forcon-email').css('margin-top', '16px')
		}

		if ($scope.afterSuccess) {
			$('.forgot-footer').css('background', '#ffffff')
			$scope.time = 5;

			var timer = $interval(function () {
				$scope.time--;
			},1000,5);
			timer.then(function () {
				//时间走完以后页面跳转
			})
		}
		

	}])
})()