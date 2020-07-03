(function (angular) {

  angular.module('manage')
    .component('kButton', {
      templateUrl: '/static/components/button/index.html',
      controller: buttonComCtrl,
      transclude: true,
      controllerAs: 'vm',
      bindings: {
        onClick: '&',// 点击
        type: '@', // 按钮类型
        styles:'@',
      }
    })

  function buttonComCtrl($scope, erp, $timeout) {

    let vm = this

    // 初始化
    this.$onInit = () => {
      // console.log('checkbox', this)
    }

    $scope.kClick = function () {
      vm.onClick && vm.onClick()
    }
  }

})(angular);