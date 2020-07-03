(function (angular) {

  angular.module('manage')
    .component('modal', {
      templateUrl: '/static/components/modal/index.html',
      controller: modalComCtrl,
      transclude: true,
      controllerAs: 'vm',
      bindings: {
        tit: "@", // label 
        visible: "=", // visible
        width: '<',// 宽度
        onOk: '&',
        okText: '@',// 确定的文本
        cancelText: '@',// 取消的文本
      }
    })

  function modalComCtrl($scope, erp, $timeout) {

    let vm = this

    // 初始化
    this.$onInit = () => {
      // console.log('modal', this)
      if (!this.width) vm.width = 800
      if (!this.cancelText) vm.cancelText = '取消'
      if (!this.okText) vm.okText = '确定'
    }

    $scope.onOk = function () {
      vm.onOk && vm.onOk()
    }

  }

})(angular);