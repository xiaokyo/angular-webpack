export default (app) => {
  app.directive('repeatFinish', function () {
    return {
      link: function (scope, element, attr) {
        if (scope.$last == true) {
          scope.$eval(attr.repeatFinish);
        }
      }
    }
  });
  app.directive('renderFinish', ['$timeout', function ($timeout) { //renderFinish自定义指令
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        if (scope.$last === true) {
          $timeout(function () {
            scope.$emit('ngRepeatFinished');
          });
        }
      }
    };
  }]);
}