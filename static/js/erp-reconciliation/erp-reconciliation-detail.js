(function(){
    var app = angular.module('erp-reconciliation');
    app.controller("ReconciliationDetailCtrl",[
      "$scope",
      "erp",
      "$routeParams",
      "utils",
      "$location",
      "$filter",
      function($scope,erp,$routeParams,utils,$location,$filter){
       console.log('ReconciliationDetailCtrl') 
     }
  
    ])
  })()