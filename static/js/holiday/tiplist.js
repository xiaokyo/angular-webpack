;~(function () {
    let app = angular.module('erp-service');
    app.controller('holidayTipListCtrl', ['$scope', 'erp','$filter', function ($scope, erp, $filter) {
        console.log('holidayTipListCtrl')
        $scope.pagesize = '20';
        $scope.pagenum = '1';
        function getList() {
            let upJson = {
                pageSize:$scope.pagesize,
                pageNum:$scope.pagenum
            }
            layer.load(2)
            erp.postFun('app/dispute/getTipsListByPage', upJson, (data) =>{
                layer.closeAll();
                let obj = JSON.parse(data.data.result)
                $scope.list = obj.list;
                console.log(obj.list)
                $scope.total = obj.count;
                $scope.pagetol = Math.ceil(obj.count / $scope.pagesize)
                $scope.totalNum = obj.count;
                $scope.$broadcast('page-data', {
                    pageSize: $scope.pagesize,//每页条数
                    pageNum: $scope.pagenum,//页码
                    totalNum: $scope.pagetol,//总页数
                    totalCounts: $scope.totalNum,//数据总条数
                    pageList: ['20', '30', '50']//条数选择列表，例：['10','50','100']
                })
            }, (err) =>{
                layer.closeAll();
                layer.msg('网络错误');
            })
        }
        getList()

        $scope.$on('pagedata-fa', function (_, {pageNum, pageSize}) {// 分页onchange
            $scope.pagenum = pageNum;
            $scope.pagesize = pageSize;
            getList()
        })
        $scope.editFun=(item)=> {
            sessionStorage.setItem('tipstemplate',JSON.stringify(item));
            location.href='#/holiday/tipadd/1';
        }
        $scope.onOrOff=(item)=> {
            let otitle=item.status?'确定禁用该通知':'确定启用该通知';
            layer.open({
                title: '',
                area: ["300px", "175px"],
				btn: ['取消', '确定'],
				content: otitle,
				btn1: function (id) {
					layer.close(id)
				},
				btn2: function (id) {
                    let param = {
                        id:item.id,
                        topic: item.topic,
                        title: item.title,
                        content: item.content,
                        startTime: $filter('date')(item.startTime,'yyyy-MM-dd'),
                        endTime: $filter('date')(item.endTime,'yyyy-MM-dd'),
                        status:item.status==0?1:0,
                        isYear:'0'
                    }
                    layer.load(2)
					erp.postFun('app/dispute/updateTips', param, (data) => {
                        getList();
                    }, (err)=>{
                        layer.closeAll();
                    });
				}
			}) 
        }
    }])


})();