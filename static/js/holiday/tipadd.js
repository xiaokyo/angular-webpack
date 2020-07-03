; ~(function () {
    let app = angular.module('erp-service');
    app.controller('holidayTipAddCtrl', ['$scope', '$routeParams', 'erp','$sce','$filter' ,function ($scope, $routeParams, erp,$sce,$filter) {
        console.log('holidayTipAddCtrl');

        // 商品描述 富文本编辑器用户输入值
        const E = window.wangEditor;
        const editor = new E('#wang');
        editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
        editor.create();
        $scope.addParam = {
            topic: '',
            title: '',
            content: '',
            startTime: '',
            endTime: '',
            isYear: '0'
        }
        $scope.type = $routeParams.type || '';//1:编辑
        if($scope.type==1){
            let obj = JSON.parse(sessionStorage.getItem('tipstemplate'));
            editor.txt.html(obj.content)
            $scope.addParam = {
                id:obj.id,
                topic: obj.topic,
                title: obj.title,
                content: '',
                startTime: $filter('date')(obj.startTime,'yyyy-MM-dd'),
                endTime: $filter('date')(obj.endTime,'yyyy-MM-dd'),
                isYear: '0',
                status:obj.status
            }
        }
        //发送
        $scope.previewFun = () => {
            let ostartTime = $scope.addParam.startTime.replace(/[-]/g,'');
            let oendTime = $scope.addParam.endTime.replace(/[-]/g,'');
            console.log(ostartTime,'==',oendTime)
            if (!$scope.addParam.startTime) {
                return layer.msg('请选择开始时间');
            } else if (!$scope.addParam.endTime) {
                return layer.msg('请选择结束时间');
            } else if (ostartTime>oendTime) {
                return layer.msg('开始时间不能大于结束时间');
            } else if (!$scope.addParam.topic) {
                return layer.msg('请填写模板主题');
            } else if (!$scope.addParam.title) {
                return layer.msg('请填写模版名称');
            } else if (!editor.txt.text()) {
                return layer.msg('请填写正文内容');
            }
            $scope.content = $sce.trustAsHtml(editor.txt.html());
            $scope.addParam.content = editor.txt.html();
            $scope.showCountryTip = true;
        }
        $scope.submitFun = () => {
            layer.load(2);
            let url;
            if($scope.addParam.id){
                url = 'app/dispute/updateTips';
            }else {
                url = 'app/dispute/addTips';
            }
            erp.postFun(url, $scope.addParam, (data) => {
                layer.closeAll();
                if(data.data.statusCode=='200'){
                    $scope.showCountryTip = false;
                    location.href='#/holiday/tips';
                }
            }, (err)=>{
                layer.closeAll();
            });
        }
        $scope.closeFun = ()=>{
            history.go(-1);
        }
    }])


})();