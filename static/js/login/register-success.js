(function () {
	var app = angular.module('app',[]);
	app.controller('regsucessCtrl',['$scope','$interval',function ($scope,$interval) {
		$scope.time = 5;
		var timer = $interval(function () {
			$scope.time--;
		},1000,5);
		timer.then(function () {
			//时间走完以后页面跳转
		})
	}])
})()