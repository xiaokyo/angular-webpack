(function () {
	var app = angular.module('app',[]);
	app.controller('forgotCtrl',['$scope','$http',function ($scope,$http) {
		$scope.forgetPass = false;
		$scope.resetPass = true;
		$scope.resetPassSuccess = false;
		$scope.isError = false;
		$scope.emailAdress = '';
		$('.email-input').focus(function () {
			$('.email-img').attr('src','./static/image/login/email-check.png');
		})
		$('.email-input').blur(function () {
			$('.email-img').attr('src','./static/image/login/email.png');
		})
		$scope.sendEmail=function () {
			$scope.isError = true;//如果没有找到邮件地址
			$('.forcon-text').css('margin-top', '70px')
			$('.forcon-email').css('margin-top', '16px')
		}
	}])
})()