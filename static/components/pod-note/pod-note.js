(function(angular) {
    angular.module('manage')
        .component('podNote', {
            templateUrl: 'static/components/pod-note/pod-note.html',
            controller: podNoteCtrl,
            bindings: {
                pItem: '=',
                item: '=',
                pIndex: '=',
                index: '=',
                list: '=',
                // csObj: '=',
                onLog: '&',
                showWorkOrder: '&'
            },
        });
    function podNoteCtrl($scope, erp) {
        var that = this;
        var bs = new Base64();
		var erpLoginName = bs.decode(localStorage.getItem('erploginName')==undefined?'':localStorage.getItem('erploginName'));
        console.log(this.pItem,this.pIndex,this.item)
        console.log(this.list,this.index)
        console.log(erpLoginName)
        let itemObj = this.item;
        let pItemObj = this.pItem;
        let pIndexNum = this.pIndex;
        let indexNum = this.index;
        $scope.list = this.list;
        console.log($scope.list)
        $scope.noteListArr = (Array.isArray(itemObj.message)?itemObj.message:JSON.parse(itemObj.message)) || [];
        $scope.spMesSurnFun = function(){
			if(!$scope.spMessVal){
				layer.msg('请输入留言')
				return
			}
			let objItem = {
				"createDate" : new Date().getTime(),
				"createUserName" : erpLoginName,
				"message" : $scope.spMessVal
			}
            $scope.noteListArr.unshift(objItem);
			erp.load()
			var upJson = {};
            upJson.message = JSON.stringify($scope.noteListArr);
            let pid = pItemObj.id||pItemObj.ID;
            let oid = itemObj.id ||itemObj.ID;
            upJson.mixid = `${pid}_${oid}`;
            erp.postFun('erp/order/insertLeaveMessage',JSON.stringify(upJson),function(data){})
			erp.postFun('processOrder/handleOrder/updateOrderProductProcurementMsg',JSON.stringify(upJson),function(data){
				console.log(data)
				erp.closeLoad()
				if (data.data.code==200) {
					layer.msg('留言成功')
                    $scope.list[pIndexNum].product[indexNum].message=JSON.stringify($scope.noteListArr);
                    console.log($scope.list[pIndexNum].product[indexNum])
					$scope.spMessVal = '';
                    $scope.$emit('log-to-father', {closeFlag: false}); 
				} else {
					layer.msg('留言失败')
				}
				$scope.spMessageflag = false;
			},function(data){
				console.log(data)
				erp.closeLoad()
			})
        }
        $scope.closeNoteFun = function(){
            $scope.$emit('log-to-father', {closeFlag: false});
        }
        $scope.stopProgFun = function(ev){
            ev.stopPropagation()
        }
        
    }

})(angular);