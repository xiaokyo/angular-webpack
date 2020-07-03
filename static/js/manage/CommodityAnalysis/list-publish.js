;~function(){
    
	var app = angular.module('analysis');
  // 关联与刊登
	app.controller('LinkageAndPublicationCtrl', ['$scope', '$window', '$location', '$routeParams', '$timeout', '$http', 'erp', 'merchan', '$sce', 'utils', function ($scope, $window, $location, $routeParams, $timeout, $http, erp, merchan, $sce, utils) {
        console.log('LinkageAndPublicationCtrl');
        //搜索部分
        $scope.dateArr = [
            { name: '昨天', flag: true, 'dateType': 'yesterDay' },
            { name: '近一周', flag: false, 'dateType': 'threeDay' },
          {name: '近一个月', flag: false, 'dateType': 'weeks'},
          {name: '全部', flag: false, 'dateType': 'month'},
        ];
        $scope.chartDateArr = [
          {name: '近一周', flag: true, 'dateType': 'chartweeks'},
          {name: '近一个月', flag: false, 'dateType': 'chartmonth'},
          {name: '全部', flag: false, 'dateType': 'all'},
        ];
        $scope.pageNum = 1;
        $scope.pageNum1 = 1
        // $scope.pageSize = '20';
        $scope.dateType = 'threeDay';
        $scope.authoritystatus = '';
        $scope.entryname = '';
        $scope.tabType = '1';
        $scope.categoryid = '';
        $scope.dataList = [];
        $scope.addType = true;
        $scope.editType = false;
        $scope.seaType = 'productName';
        // $scope.PolylineDate = 'chartweeks';
        $scope.PolylineDate = '1';
        $scope.pageSize1 = '10'
        $scope.TotalNum = ''
          //获取系统当前时间
          var nowdate = new Date();
          var y = nowdate.getFullYear();
          var m = nowdate.getMonth()+1;
          var d = nowdate.getDate();
          var formatnowdate = y+'-'+m+'-'+d;
          // $scope.endTime = formatnowdate;
          console.log(formatnowdate)
            //获取系统前一周的时间
            var oneweekdate = new Date(nowdate-7*24*3600*1000);
            var y = oneweekdate.getFullYear();
            var m = oneweekdate.getMonth()+1;
            var d = oneweekdate.getDate();
            var formatwdate = y+'-'+m+'-'+d;
            // $scope.startTime = formatwdate;
          console.log($('#date1').val())
            
            const yesterDay = new Date().setTime(new Date().getTime() - 24 * 60 * 60 * 1000);
            const toDay = new Date().setTime(new Date().getTime());
            $scope.startTime = utils.changeTime(yesterDay, false);
            $scope.endTime = utils.changeTime(toDay, false);
            // console.log($scope.startTime)
            // console.log($scope.endTime)
        
        $scope.dateClick = function (item) {
          console.log(item)
          $scope.dateArr.forEach(function (o, i) {
            o.flag = false;
          })
          item.flag = !item.flag;
          console.log(item.flag)
          $scope.dateType = item.dateType;
          // console.log($scope.dateType)
          // console.log(item.dateType)
            if ($scope.dateType === 'yesterDay') {
                $scope.startTime = utils.changeTime(yesterDay, false);
                $scope.endTime = utils.changeTime(toDay, false);
                getData()
            }else if($scope.dateType == 'threeDay'){
            $scope.pageNum1 = 1;
            //获取当前时间
            var nowdate = new Date();
          var y = nowdate.getFullYear();
          var m = nowdate.getMonth()+1;
          var d = nowdate.getDate();
          var formatnowdate = y+'-'+m+'-'+d;
          $scope.endTime = formatnowdate;
          console.log(formatnowdate)
            //获取系统前一周的时间
          var oneweekdate = new Date(nowdate-7*24*3600*1000);
          var y = oneweekdate.getFullYear();
          var m = oneweekdate.getMonth()+1;
          var d = oneweekdate.getDate();
          var formatwdate = y+'-'+m+'-'+d;
          //  $("#fdate").datebox("setValue",formatwdate);
          // $scope.preWeek = formatwdate;
          $scope.startTime = formatwdate;
            getData()
        }else if($scope.dateType == 'weeks'){
          $scope.pageNum1 = 1;
          //当前
          var nowdate = new Date();
          var y = nowdate.getFullYear();
          var m = nowdate.getMonth()+1;
          var d = nowdate.getDate();
          var formatnowdate = y+'-'+m+'-'+d;
          $scope.endTime = formatnowdate;
          console.log(formatnowdate)
           //获取系统前一个月的时间
           nowdate.setMonth(nowdate.getMonth()-1);
           var y = nowdate.getFullYear();
           var m = nowdate.getMonth()+1;
           var d = nowdate.getDate();
           var formatwdate1 = y+'-'+m+'-'+d;
           console.log(formatwdate1)
           $scope.startTime = formatwdate1;
          getData()
        }else if($scope.dateType == 'month'){
          $scope.pageNum1 = 1;
          $('#date1').val('');
          $('#date2').val('');
          $scope.startTime = ''
          // $scope.endTime = ''
          console.log($scope.startTime)
          getData()
        }else if($scope.dateType == ''){
          getData()
        }
      }
      
        $scope.searchInput = function () {
          $scope.dateType = ''
          $scope.dateArr.forEach(function (o, i) {
            o.flag = false;
          })
          $scope.startTime = $('#date1').val()
          $scope.endTime = $('#date2').val()
          $scope.pageNum1 = 1;
          console.log($scope.startTime)
          console.log($scope.endTime)
          // if ($('#date1').val()||$('#date2').val()) {
          //   $scope.dateType = null;
          //   console.log(12345566)
          //   alert('36566565')
          //   $scope.startTime = $('#data1').val()
          //   $scope.endTime = $('#data2').val()
          //   console.log($scope.startTime)
          //   console.log($scope.endTime)
          //   // $scope.startTime = $('#data1').val()
          //   // $scope.endTime = $('#data2').val()
        
            // }
          getData()
        };
        $scope.sortFun = function(type){
          $scope.isAct = type;
          $scope.pageNum1 = 1;
          getData()
        }
        $scope.stuChange = function(){
          $scope.pageNum1 = 1;
          getData()
        }
        $scope.gopageFun = function(){
          var countPage = Math.ceil($scope.TotalNum / ($scope.pageSize-0));
          if (!$scope.pageNum || $scope.pageNum<1 || $scope.pageNum>countPage) {
            layer.msg('找不到此页');
            return;
          }
          getData()
        }
        $scope.chanPageSize = function(){
          $scope.pageNum1 = 1;
          getData()
        }
        
        function getData() {
          $scope.categoryid = $('.search-cate-name').find('.text').attr('id');
          var seaType = $scope.seaType;
          
          var data = {
            "startTime": $scope.startTime,
            "endTime": $scope.endTime,
            "pageNum": $scope.pageNum1,
            "pageSize": $scope.pageSize1,
            // "timeFlag": $scope.dateType,
          };
          erp.load();
          // layer.load(2);
          data[seaType] = $scope.seachVal;
          console.log(data)
          erp.postFun("erp/productReport/kanDengGuanLianTongJi_page", data, function (res) {
            layer.closeAll('loading')
            console.log(res)
            if (res.data.statusCode == 200) {
              $scope.dataList = res.data.result.rows;
              if($scope.dataList){
                 for(let i = 0,len = $scope.dataList.length;i<len;i++){
                    $scope.dataList[i]['index'] = $scope.pageSize*($scope.pageNum-1)+i+1
                }
              }
              console.log($scope.dataList)
              // $scope.TotalNum = res.data.result.totalNum;
              $scope.TotalNum1 = res.data.result.total;
              console.log($scope.TotalNum1)
              pageFun1()
            }
          }, function (data) {
            console.log(data)
            layer.closeAll('loading')
          },{layer:true})
        }
        getData()
       
          //查看商品
        $scope.lookPro = function (id) {
          window.open('manage.html#/merchandise/show-detail/' + id + '/' + '0' + '/' + '3' + '/' + '0', '_blank', '');
        }
        
       
    //分页
    function pageFun1() {
      $(".pagegroup1").jqPaginator({
        totalCounts: $scope.TotalNum1 || 1,
        pageSize: $scope.pageSize1 * 1,
        visiblePages: 5,
        currentPage: $scope.pageNum1 * 1,
        activeClass: 'current',
        first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
        prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
        next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
        last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
        page: '<a href="javascript:void(0);">{{page}}<\/a>',
        onPageChange: function (n, type) {
          if (type == 'init') {
            return;
          }
          ;
          erp.load();
          $scope.pageNum1 = n;
          getData()
        }
      });
    }
    $scope.toPage1 = function () {
      var pageNum = Number($scope.pageNum1);
      var pageNumtotal = Number($scope.TotalNum1);
      var pageSize1 = Number($scope.pageSize1);
      // var totalPage = Math.ceil($scope.TotalNum1 / Number($scope.pageSize1));
      var totalPage =  Math.ceil(pageNumtotal / pageSize1);
    
      console.log(typeof pageNum)
      console.log(typeof Number($scope.pageSize1))
      console.log(totalPage)
      if (!pageNum) {
        layer.msg('请输入页码');
        return;
      }
      if (pageNum > totalPage) {
        layer.msg('总计' + totalPage + '页，所输入数字应小于' + totalPage);
        $scope.pageNum1 = 1;
        return;
      }
      getData();
    };
    
    
    
        //折线图
        function setZhexiantu() {
          var parms = {
            dateType: $scope.PolylineDate
          };
          // console.log($scope.PolylineDate)
          layer.load(2);
          erp.postFun("erp/productReport/kanDengGuanLianTongJi_chart", parms, function (res) {
            layer.closeAll("loading");
            console.log(res)
            if (res.data.statusCode == 200) {
              var DateArr = [];   //日期
              var publishDataArr = [];   //刊登数量
              var relevanceDataArr = [];   //关联数量
    
              res.data.result && res.data.result.forEach(function (o, i) {
                // DateArr.push([o.disDate, o.cun])
                DateArr.push(o.dt)
                publishDataArr.push(o.publishCount)
                relevanceDataArr.push(o.relevanceCount)
              });
              console.log(relevanceDataArr)
              var myChart6 = echarts.init(document.getElementById('maincharts'));
              var option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['商品刊登','商品关联'],
                    left: '13%',
                },
              dataZoom: [{
                startValue: $scope.PolylineDate == '1' ? res.data.result.data : null
              }, {
                type: 'inside'
              }],
                grid: {
                    left: '6%',
                    // right: '10%',
                    // bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    // data: ['周一','周二','周三','周四','周五','周六','周日']
                    data: DateArr
                },
                yAxis: {
                    type: 'value',
                    // data:[]
                },
                series: [
                    {
                        name:'商品刊登',
                        type:'line',
                        // stack: '总量',
                        // data:[120, 132, 101, 134, 90, 230, 210]
                        data:publishDataArr
                    },
                    {
                        name:'商品关联',
                        type:'line',
                        // stack: '总量',
                        data:relevanceDataArr
                    },
                ]
            };
              myChart6.setOption(option);
            }
          }, function (err) {
            layer.msg('服务器错误')
          });
        }
        setZhexiantu();
        //
        $scope.PolylineFilter = function (item) {
          console.log(item)
            setZhexiantu();
        }
        $scope.toDetail = (id)=>{
          erp.toAppDetail({id:id})
        }
  }])
}();