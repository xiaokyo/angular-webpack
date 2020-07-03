(function (angular) {

  angular.module('manage')
    .component('kInput', {
      templateUrl: '/static/components/input/index.html',
      controller: inputComCtrl,
      transclude: true,
      controllerAs: 'vm',
      bindings: {
        onChange: '&',// 点击
        styles: '@',// 样式
        class: '@',// 类名
        placeholder: '@',
        value: '=',
        onKeyup: '&',
        type: '@'
      }
    })

  function inputComCtrl($scope, erp, $timeout) {

    let vm = this

    // 初始化
    this.$onInit = () => {
      // console.log('checkbox', this)
    }

    // change
    $scope.change = function () {
      vm.onChange && vm.onChange({ value: vm.value })
    }

    $scope.keyup = function (event) {
      vm.onKeyup && vm.onKeyup({ event })
    }

  }

})(angular);