(function (angular) {

  angular.module('manage')
    .component('checkBox', {
      templateUrl: '/static/components/checkbox/index.html',
      controller: checkboxComCtrl,
      controllerAs: 'vm',
      bindings: {
        label: "@", // label 
        name: "<", // 表单name
        allChecked:'=', // 是否全选
        checked: '=',// 是否选择
        onChange: '&',// change
      }
    })

  function checkboxComCtrl($scope, erp, $timeout) {

    let vm = this

    // 初始化
    this.$onInit = () => {
      // console.log('checkbox', this)
    }

    // onChange
    $scope.onchange = function () {
      vm.onChange({ checked: vm.checked })
    }

  }

})(angular);