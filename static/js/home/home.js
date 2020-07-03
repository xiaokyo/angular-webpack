(function () {
	var app = angular.module('app',[]);
	app.controller('home',['$scope',function ($scope) {
		$('.listing img').click(function () {
			$(this).attr('src','static/image/home/collect-red.png');
		})
	}])
})()