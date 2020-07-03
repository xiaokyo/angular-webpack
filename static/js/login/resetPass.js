(function () {
	var app = angular.module('app',[]);
	app.controller('resetCtrl',['$scope','$http',function ($scope,$http) {
		$('.pass-input1').focus(function () {
			$('.lock-img1').attr('src','./static/image/login/iconpassword-check.png');
		});
		$('.pass-input1').blur(function () {
			$('.lock-img1').attr('src','./static/image/login/iconpassword-grey.png');
		});
		$('.pass-input2').focus(function () {
			$('.lock-img2').attr('src','./static/image/login/iconpassword-check.png');
		});
		$('.pass-input2').blur(function () {
			$('.lock-img2').attr('src','./static/image/login/iconpassword-grey.png');
		});
		// $scope.isDisabled=true;
	}])
})()