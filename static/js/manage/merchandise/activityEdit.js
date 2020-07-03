(function() {
  var app = angular.module('merchandise');

  app.controller('activityEditCtrl', [
    '$scope',
    '$window',
    '$location',
    '$compile',
    '$routeParams',
    '$timeout',
    '$http',
    'erp',
    'merchan',
    '$sce',
    function(
      $scope,
      $window,
      $location,
      $compile,
      $routeParams,
      $timeout,
      $http,
      erp,
      merchan,
      $sce
    ) {
      console.log("activityEditCtrl");
      var bs = new Base64();
      $scope.loginName = localStorage.getItem('erploginName') ? bs.decode(localStorage.getItem('erploginName')) : '';
      $scope.isAdminLogin = erp.isAdminLogin();
      console.log('admin', $scope.isAdminLogin);
      $scope.userId = localStorage.getItem('erpuserId') == null ? '' : bs.decode(localStorage.getItem('erpuserId'));
      $scope.userName = localStorage.getItem('erpname') == null ? '' : bs.decode(localStorage.getItem('erpname'));
      $scope.token = localStorage.getItem('erptoken') == null ? '' : bs.decode(localStorage.getItem('erptoken'));
      $scope.editFlag = false;

      $scope.$on('uploadImgResult', function(enevt, data) {
        // console.log(enevt);
        let id = enevt.targetScope.upLoadImgProps.id
        if (id === "pcimg") {
          $scope.pcImgUrl = data;
        } else if (id === "mobileimg") {
          $scope.mobileImgUrl = data;
        }
        console.log($scope.pcImgUrl);
        console.log($scope.mobileImgUrl);
      })

      function initConfirmBox ({title='确认', cb}) {
        $scope.confirmBox = {
          hasShow: true,
          ok() {
            cb && cb()
            this.hasShow = false;
          },
          cancel() {
            this.hasShow = false;
          },
          title,
        }
      }

      // 初始化三级标题
      const initThreeTitlesArr = [{
        tips: "请输入第一个三级标题", id: "", name: ""
      }, {
        tips: "请输入第二个三级标题", id: "", name: ""
      }, {
        tips: "请输入第三个三级标题", id: "", name: ""
      }, {
        tips: "请输入第四个三级标题", id: "", name: ""
      }, {
        tips: "请输入第五个三级标题", id: "", name: ""
      }]
      $scope.threeNamesArr = initThreeTitlesArr.map(_ => _);
      // console.log($scope.threeNamesArr);

      // 初始化颜色JSON
      const colorJSON = [{
        label: "页面背景色", color: "#ffffff"
      }, {
        label: "总三级标题字体色", color: "#ffffff"
      }, {
        label: "单个三级标题字体色", color: "#ffffff"
      }, {
        label: "总三级标题背景色", color: "#ffffff"
      }, {
        label: "单个三级标题背景色", color: "#ffffff"
      }, {
        label: "三级标题移动条色", color: "#ffffff"
      }, {
        label: "商品资料卡颜色", color: "#ffffff"
      }]
      $scope.colorJSON = colorJSON.map(_ => _);
      // console.log($scope.colorJSON);

      const {id} = $location.search();
      console.log(id);
      if (id) {
        $scope.editFlag = true;
        (function() {
          erp.postFun('cj/activity/getActivityByIdV2', {id}, res => {
            // console.log(res);
            const data = res.data;
            if (data.statusCode != 200) {
              return layer.msg(data.message);
            }
            console.log(data.result);
            $scope.activityName = data.result.v1;
            $scope.activityTitle = data.result.category;
            $('#txtBeginDate').val(data.result.startTime);
            $('#txtEndDate').val(data.result.stopTime);
            data.result.threeNames.map((e,i) => {
              $scope.threeNamesArr[i].name = e.name;
              $scope.threeNamesArr[i].id = e.id;
            });
            Object.values(JSON.parse(data.result.v3)).map((value, i) => {
              $scope.colorJSON[i].color = value;
            })
            $scope.$broadcast('uploadImgParam', {
              imgUrl: data.result.activityImgUrl,
              id: 'pcimg'
            });
            $scope.pcImgUrl = data.result.activityImgUrl;
            $scope.$broadcast('uploadImgParam', {
              imgUrl: data.result.v2,
              id: 'mobileimg'
            });
            $scope.mobileImgUrl = data.result.v2;
          })
        })();
      }

      //取消返回活动配置页面
      $scope.toActivityConfig = () =>{
        initConfirmBox({
          title: '确认返回 ?',
          cb: function() {
            $location.path("merchandise/activityConfig").search('');
          }
        })
      }

      $scope.save = (type) => {
        if (!$scope.activityName) return layer.msg('请填写活动名称');
        if (!$scope.activityTitle) return layer.msg('请填写页面title');
        if (!$('#txtBeginDate').val()) return layer.msg('请设置活动开始时间');
        if (!$('#txtEndDate').val()) return layer.msg('请设置活动结束时间');
        if (!$scope.pcImgUrl) return layer.msg('请上传pc端图片');
        if (!$scope.mobileImgUrl) return layer.msg('请上传移动端图片');
        layer.open({
          title: '',
          btn: ['取消', '确定'],
          content: "确认活动信息无误？",
          btn1: function(id) {
            layer.close(id)
          },
          btn2: function(id) {
            layer.load(2);
            let APIS = '';
            if (type === 'saveEdit') {
              APIS = 'cj/activity/updateActivityV2'
            } else if (type === 'saveNew') {
              APIS = 'cj/activity/insertActivityV2'
            }
            let data = {};
            data.v1 = $scope.activityName; //活动名称
            data.category = $scope.activityTitle; //活动titli(二级)
            data.startTime = $('#txtBeginDate').val(); //开始时间
            data.stopTime = $('#txtEndDate').val(); //结束时间
            data.activityImgUrl = $scope.pcImgUrl; //pc端图片
            data.v2 = $scope.mobileImgUrl; //移动端端图片
            data.v3 = {}; //颜色JSON
            data.v3.backColor = $scope.colorJSON[0].color; //页面背景色
            data.v3.allThreeFontColor = $scope.colorJSON[1].color; //总三级标题字体色
            data.v3.oneThreeFontColor = $scope.colorJSON[2].color; //单个三级标题字体色
            data.v3.allThreeBackColor = $scope.colorJSON[3].color; //总三级标题背景色
            data.v3.oneThreeBackColor = $scope.colorJSON[4].color; //单个三级标题背景色
            data.v3.threeMoveColor = $scope.colorJSON[5].color; //三级标题移动条色
            data.v3.merchCardColor = $scope.colorJSON[6].color; //商品资料卡颜色
            data.v3 = JSON.stringify(data.v3);
            data.threeNames = $scope.threeNamesArr.map(item => { //三级标题
              let {tips, ...params} = item;
              return params;
            })
            console.log(data, APIS);
            erp.postFun(APIS, data, res => {
              layer.closeAll('loading');
              console.log(res);
              const data = res.data;
              if (data.statusCode != 200) {
                return layer.msg(data.message);
              }
              layer.msg(data.message);
              $location.path("merchandise/activityConfig").search('');
            })
          }
        })
      }

    }
  ]);
})();