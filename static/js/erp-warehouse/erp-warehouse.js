;(function () {
    var app = angular.module('warehouse-app', ['ngSanitize','utils']);
    app.directive("wareTree", function () {
        return {
            restrict: "E",
            scope: {
                currentFolder: '=',
                myIndex: '=',
                // folderList: '=',
                pointOne: '&',
                // openupList: '&',
                // packupList: '&'
                switchList: '&',
                checkWare: '&'
            },
            // scope: true,
            templateUrl: 'static/template/waretree.html',
        };
    });

    app.directive("cateTree", function () {
        return {
            restrict: "E",
            scope: {
                cateList: '=',
                myIndex: '=',
                // folderList: '=',
                pointOne: '&',
                // openupList: '&',
                // packupList: '&'
                switchList: '&'
            },
            // scope: true,
            templateUrl: 'static/template/catetree.html',
        };
    });
    
})()
