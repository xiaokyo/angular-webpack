(function () {
	var app = angular.module('analysis', []);
  /*纠纷*/
  app.controller('disputeCtrl', ['$scope', '$window', '$location', '$routeParams', '$timeout', '$http', 'erp', 'merchan', '$sce', function ($scope, $window, $location, $routeParams, $timeout, $http, erp, merchan, $sce) {
    console.log('disputeCtrl')
    $scope.ProfilterDate = [
      {'name': '近三天', flag: true, type: '1'},
      {'name': '本周', flag: false, type: '2'},
      {'name': '本月', flag: false, type: '3'},
    ];
    $scope.ClientfilterDate = [
      {'name': '近三天', flag: true, type: '1'},
      {'name': '本周', flag: false, type: '2'},
      {'name': '本月', flag: false, type: '3'},
    ];
    $scope.ProRankingData = []
    $scope.ClientRankingData = []
    $scope.dateType1 = '1';
    $scope.dateType2 = '1';
    $scope.pageNum1 = 1;
    $scope.pageSize1 = '5';
    $scope.TotalNum1 = null;
    $scope.pageNum2 = 1;
    $scope.pageSize2 = '5';
    $scope.TotalNum2 = null;
    $scope.isAct = '2';
    $scope.PolylineDate = '1';

    /*枚举*/
    function Enumerable(arr) {
      var EnArr = {
        'Defective Products': '商品损坏',
        'Lack Of Inventory': '缺少库存',
        'No Tracking Information Found': '无追踪信息',
        'Order Not Received': '订单未收到',
        'Order Returned': '商品退回',
        'Products Short': '商品缺失',
        'Received Incorrect Products': '商品错发',
        'Tracking Information Error': '追踪信息错误',
        'Tracking Information Frozen': '追踪信息不更新',
        'Unfilled Orders Cancellation': '未发货订单取消',
      }
      for (var i = 0; i < arr.length; i++) {
        for (var k in EnArr) {
          if (arr[i] == k) {
            arr[i] = EnArr[k];
          }
        }
      }
      return arr;
    }

    function EnumeTable(arr) {
      var EnArr = {
        'Defective Products': '商品损坏',
        'Lack Of Inventory': '缺少库存',
        'No Tracking Information Found': '无追踪信息',
        'Order Not Received': '订单未收到',
        'Order Returned': '商品退回',
        'Products Short': '商品缺失',
        'Received Incorrect Products': '商品错发',
        'Tracking Information Error': '追踪信息错误',
        'Tracking Information Frozen': '追踪信息不更新',
        'Unfilled Orders Cancellation': '未发货订单取消',
      }
      for (var i = 0; i < arr.length; i++) {
        for (var k in EnArr) {
          if (arr[i].type == k) {
            arr[i].type = EnArr[k];
          }
        }
      }
      return arr;
    }

    //获取各状态数量
    function getNumData() {
      var data = {};
      layer.load(2);
      erp.postFun("erp/disputeInfo/getTotalDisputeList", data, function (res) {
        layer.closeAll("loading");
        if (res.data.statusCode == 200) {
          $scope.allCun = res.data.result[0].allCun || 0;
          $scope.cancelCun = res.data.result[0].cancelCun || 0;
          $scope.finishCun = res.data.result[0].finishCun || 0;
          $scope.customer = res.data.result[0].customer || 0;
          $scope.salesman = res.data.result[0].salesman || 0;
          $scope.dayCount = res.data.result[0].dayCount || 0;
          $scope.monthCount = res.data.result[0].monthCount || 0;
          $scope.weekCount = res.data.result[0].weekCount || 0;
          //$scope.ProRankingData = res.data.result;
        }
      }, function (err) {
        layer.msg('服务器错误')
      });
    }

    getNumData();

    //商品排行数据
    function getProranking1() {
      var data = {
        pageNum: $scope.pageNum1.toString(),
        pageSize: $scope.pageSize1,
        dateType: $scope.dateType1
      };
      layer.load(2);
      erp.postFun("erp/disputeInfo/getProductDisputeList", data, function (res) {
        layer.closeAll("loading");
        if (res.data.statusCode == 200) {
          $scope.TotalNum1 = res.data.result.count;
          //$scope.TotalPage1 = Math.ceil($scope.TotalNum1 / $scope.pageSize1);
          $scope.ProRankingData = res.data.result.disputeList;
          $scope.ProRankingData = EnumeTable($scope.ProRankingData);
          pageFun1();
        }
      }, function (err) {
        layer.msg('服务器错误')
      });
    }

    getProranking1();
    //商品排行筛选
    $scope.Profilter = function (item) {
      $scope.ProfilterDate.forEach(function (o, i) {
        o.flag = false;
      });
      item.flag = !item.flag;
      $scope.dateType1 = item.type;
      $scope.pageNum1 = '1';
      getProranking1();
    }

    //客户排行数据
    function getProranking2() {
      var data = {
        sortType: $scope.isAct,
        pageNum: $scope.pageNum2.toString(),
        pageSize: $scope.pageSize2,
        dateType: $scope.dateType2
      };
      layer.load(2);
      erp.postFun("erp/disputeInfo/getCustomerDisputeList", data, function (res) {
        layer.closeAll("loading");
        if (res.data.statusCode == 200) {
          $scope.TotalNum2 = res.data.result.count;
          //$scope.TotalNum2 = Math.ceil(res.data.result.count / $scope.pageSize2);
          $scope.ClientRankingData = res.data.result.customerList;
          $scope.ClientRankingData = EnumeTable($scope.ClientRankingData);
          pageFun2();
        }
      }, function (err) {
        layer.msg('服务器错误')
      });
    }

    getProranking2();
    //客户排行筛选
    $scope.Clientfilter = function (item) {
      $scope.ClientfilterDate.forEach(function (o, i) {
        o.flag = false;
      })
      item.flag = !item.flag;
      $scope.dateType2 = item.type;
      $scope.pageNum2 = '1';
      getProranking2();
    };
    //sort
    $scope.Sort = function (type) {
      $scope.isAct = type;
      $scope.pageNum2 = '1';
      getProranking2()
      console.log($scope.isAct)
    }

    //折线图
    function setZhexiantu() {
      var parms = {
        dateType: $scope.PolylineDate
      };
      layer.load(2);
      erp.postFun("erp/disputeInfo/getDisputeLineList", parms, function (res) {
        layer.closeAll("loading");
        if (res.data.statusCode == 200) {
          var DateArr = [];
          res.data.result.disputeLineList.forEach(function (o, i) {
            DateArr.push([o.disDate, o.cun])
          });
          var myChart1 = echarts.init(document.getElementById('main1'));
          var option = {
            color: ['#4A90E2'],
            tooltip: {
              trigger: 'axis'
            },
            grid: {
              left: '4%',
              containLabel: false
            },
            xAxis: {
              data: DateArr.map(function (item) {
                return item[0];
              })
            },
            yAxis: {
              splitLine: {
                show: false
              }
            },
            toolbox: {
              left: 'center',
              feature: {
                dataZoom: {
                  yAxisIndex: 'none'
                },
                restore: {},
                saveAsImage: {}
              }
            },
            dataZoom: [{
              startValue: $scope.PolylineDate == '1' ? res.data.result.data : ''
            }, {
              type: 'inside'
            }],
            series: {
              name: '',
              barWidth: '75px',
              type: $scope.PolylineDate == '3' ? 'bar' : 'line',
              data: DateArr.map(function (item) {
                return item[1];
              }),
              markLine: {
                silent: true,
                data: [{
                  name: '平均线',
                  type: 'average',
                }]
              }
            }
          };
          myChart1.setOption(option);
        }
      }, function (err) {
        layer.msg('服务器错误')
      });
    }

    setZhexiantu();
    //
    $scope.PolylineFilter = function () {
      setZhexiantu();
    }
    //各纠纷数量类型数据
    $scope.EchartsDate = '1';

    function getEchartsData() {
      var data = {
        dateType: $scope.EchartsDate
      };
      layer.load(2);
      erp.postFun("erp/disputeInfo/getDisputeTypeList", data, function (res) {
        layer.closeAll("loading");
        if (res.data.statusCode == 200) {
          //$scope.ProRankingData = res.data.result;
          var NameData = [];
          var NumData = [];
          if (res.data.result.allcun > 0) {
            $scope.disputeRate = ((Number(res.data.result.ocun) / Number(res.data.result.allcun)) * 100).toFixed(2);
          } else {
            $scope.disputeRate = 0;
          }
          console.log($scope.disputeRate)
          res.data.result.typeList.forEach(function (o, i) {
            NameData.push(o.type);
            NumData.push(o.cun);
          });
          NameData = Enumerable(NameData)
          console.log(NameData)
          console.log(NumData)
          //Echart图表
          var myChart2 = echarts.init(document.getElementById('main2'));
          var option = {
            /*    title:{
                    text:'纠纷类型统计'
                },*/
            color: ['#4A90E2'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            /*  toolbox : {
                  show : true,
                  feature : {
                      magicType : {
                          show : true,
                          type : [ 'line', 'bar' ]
                      },
                      restore : {
                          show : true
                      },
                      saveAsImage : {
                          show : true,
                          title : '保存为图片',
                          type : 'png',
                          lang : [ '点击保存' ]
                      }
                  }
              },*/
            grid: {
              left: '3%',
              right: '10%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: NameData,
                axisTick: {
                  alignWithLabel: true
                },
                name: '',
                axisLabel: {
                  interval: 0,
                  formatter: function (value) {
                    //debugger
                    var ret = "";//拼接加\n返回的类目项
                    var maxLength = 18;//每项显示文字个数
                    var valLength = value.length;//X轴类目项的文字个数
                    var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                    if (rowN > 1)//如果类目项的文字大于3,
                    {
                      for (var i = 0; i < rowN; i++) {
                        var temp = "";//每次截取的字符串
                        var start = i * maxLength;//开始截取的位置
                        var end = start + maxLength;//结束截取的位置
                        //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                        temp = value.substring(start, end) + "\n";
                        ret += temp; //凭借最终的字符串
                      }
                      return ret;
                    }
                    else {
                      return value;
                    }
                  }
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '数量',
              }
            ],
            series: [
              {
                name: '数量',
                type: 'bar',
                barWidth: '75px',
                itemStyle: {
                  normal: {
                    label: {
                      show: true,
                      position: 'top',
                      textStyle: {
                        color: 'black'
                      }
                    }
                  }
                },
                data: NumData
              }
            ]
          };
          myChart2.setOption(option);
        }
      }, function (err) {
        layer.msg('服务器错误')
      });
    }

    getEchartsData();
    //Echart图表筛选
    $scope.EchartsFilter = function (t) {
      console.log(t)
      $scope.EchartsDate = t;
      getEchartsData();
    }
    $scope.ProData = [];
    //搜索
    $scope.EnterSearch = function (ev) {
      if (ev.which == '13') {
        $scope.Search();
      }
    }
    $scope.SearchType = 'SKU';
    $scope.Search = function () {
      $scope.ProData = [];
      if (!$scope.SearchTxt) {
        layer.msg('请输入关键字！')
        return;
      }
      var data = {
        autFlag: "01",
        chargeId: "",
        filter01: $scope.SearchType,
        filter02: $scope.SearchTxt,
        filter03: "",
        filter04: "",
        filter05: "",
        filter06: "",
        filter11: "",
        filter12: "",
        filter21: "",
        filter22: "",
        filter23: "",
        filter24: "",
        flag: "0",
        flag2: "",
        pageNum: "1",
        pageSize: "10000",
        status: "3"
      };
      layer.load(2);
      erp.postFun("pojo/product/list", data, function (res) {
        layer.closeAll("loading");
        if (res.data.statusCode == 200) {
          /*  res.data.result.forEach(function (o,i) {
                o.over = false;
            });*/
          $scope.ProData = JSON.parse(res.data.result).ps;
          console.log($scope.ProData)
        }
      }, function (err) {
        layer.closeAll("loading");
        layer.msg('服务器错误')
      });
    }
    //查看商品
    $scope.lookPro = function (id) {
      window.open('manage.html#/merchandise/show-detail/' + id + '/' + '0' + '/' + '3' + '/' + '0', '_blank', '');
    };

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
          getProranking1()
        }
      });
    }
    $scope.toPage1 = function () {
      var pageNum = Number($scope.pageNum1);
      var totalPage = Math.ceil($scope.TotalNum1 / $scope.pageSize1);
      if (!pageNum) {
        layer.msg('请输入页码');
        return;
      }
      if (pageNum > totalPage) {
        layer.msg('总计' + totalPage + '页，所输入数字应小于' + totalPage);
        $scope.pageNum1 = 1;
        return;
      }
      getProranking1();
    };
    function pageFun2() {
      $(".pagegroup2").jqPaginator({
        totalCounts: $scope.TotalNum2 || 1,
        pageSize: $scope.pageSize2 * 1,
        visiblePages: 5,
        currentPage: $scope.pageNum2 * 1,
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
          $scope.pageNum2 = n;
          getProranking2()
        }
      });
    }
    $scope.toPage2 = function () {
      var pageNum = Number($scope.pageNum2);
      var totalPage = Math.ceil($scope.TotalNum2 / $scope.pageSize2);
      if (!pageNum) {
        layer.msg('请输入页码');
        return;
      }
      if (pageNum > totalPage) {
        layer.msg('总计' + totalPage + '页，所输入数字应小于' + totalPage);
        $scope.pageNum2 = 1;
        return;
      }
      getProranking2();
    };
  }])
  /*访客*/
  app.controller('VisitorCtrl', ['$scope', '$window', '$location', '$routeParams', '$timeout', '$http', 'erp', 'merchan', '$sce', function ($scope, $window, $location, $routeParams, $timeout, $http, erp, merchan, $sce) {
    console.log('VisitorCtrl')
    $scope.RankingFilter1 = [
      {'name': '近三天', flag: true, type: '1'},
      {'name': '本周', flag: false, type: '2'},
      {'name': '本月', flag: false, type: '3'},
    ];
    $scope.RankingFilter2 = [
      {'name': '近三天', flag: true, type: '1'},
      {'name': '本周', flag: false, type: '2'},
      {'name': '本月', flag: false, type: '3'},
    ];
    $scope.RankingFilter3 = [
      {'name': '近三天', flag: true, type: '1'},
      {'name': '本周', flag: false, type: '2'},
      {'name': '本月', flag: false, type: '3'},
    ]
    $scope.RankingData1 = [
      {name: '阿斯顿', 'rate': '1%', count: '1'},
      {name: '阿斯顿', 'rate': '11%', count: '2'},
      {name: '阿斯顿', 'rate': '2%', count: '3'},
      {name: '阿斯顿', 'rate': '12%', count: '4'},
      {name: '阿斯顿', 'rate': '5%', count: '5'},
    ]
    $scope.RankingData2 = [
      {name: '阿斯顿', count: '1'},
      {name: '阿斯顿', count: '2'},
      {name: '阿斯顿', count: '3'},
      {name: '阿斯顿', count: '4'},
      {name: '阿斯顿', count: '5'},
    ]
    $scope.RankingData3 = [
      {name: '阿斯顿', 'rate': '1%', count: '1'},
      {name: '阿斯顿', 'rate': '11%', count: '2'},
      {name: '阿斯顿', 'rate': '2%', count: '3'},
      {name: '阿斯顿', 'rate': '12%', count: '4'},
      {name: '阿斯顿', 'rate': '5%', count: '5'},
    ]
    //单品访客量排行筛选
    $scope.Profilter1 = function (item) {
      $scope.RankingFilter1.forEach(function (o, i) {
        o.flag = false;
      })
      item.flag = !item.flag
    }
    //单品浏览量排行筛选
    $scope.Profilter2 = function (item) {
      $scope.RankingFilter2.forEach(function (o, i) {
        o.flag = false;
      })
      item.flag = !item.flag
    };
    //单品收藏量排行筛选
    $scope.Profilter3 = function (item) {
      $scope.RankingFilter3.forEach(function (o, i) {
        o.flag = false;
      })
      item.flag = !item.flag
    };
    //搜索
    $scope.Search = function () {

    }
    //查看商品
    $scope.lookPro = function (item) {
      $scope.isLook = true;
    }
  }])
  /*采购*/
  app.controller('PurchaseCtrl', ['$scope', '$window', '$location', '$routeParams', '$timeout', '$http', 'erp', 'merchan', '$sce', function ($scope, $window, $location, $routeParams, $timeout, $http, erp, merchan, $sce) {
    console.log('PurchaseCtrl')
    $scope.RankingFilter1 = [
      {'name': '近三天', flag: true, type: '1'},
      {'name': '本周', flag: false, type: '2'},
      {'name': '本月', flag: false, type: '3'},
    ];
    $scope.RankingData1 = []
    $scope.dateType = '1';

    //排行数据1
    function getRanking1() {
      var data = {
        dateType: $scope.dateType
      };
      layer.load(2);
      erp.postFun("erp/disputeInfo/getPurchaseList", data, function (res) {
        layer.closeAll("loading");
        if (res.data.statusCode == 200) {
          $scope.RankingData1 = res.data.result;
        }
      }, function (err) {
        layer.msg('服务器错误')
      });
    }

    getRanking1();
    //采购数量排行筛选
    $scope.Profilter1 = function (item) {
      $scope.RankingFilter1.forEach(function (o, i) {
        o.flag = false;
      })
      item.flag = !item.flag;
      $scope.dateType = item.type;
      getRanking1();
    }
    //Echart图表
    $scope.EchartsDate = '1';

    function getEchartData() {
      var data = {
        dateType: $scope.EchartsDate
      };
      layer.load(2);
      erp.postFun("erp/disputeInfo/getPurchaseChartList", data, function (res) {
        layer.closeAll("loading");
        if (res.data.statusCode == 200) {
          var NumData = [];
          NumData[0] = res.data.result.signFor + res.data.result.unKnown + res.data.result.unSignFor;
          NumData[1] = res.data.result.signFor + res.data.result.unKnown;
          NumData[2] = res.data.result.signFor;
          NumData[3] = res.data.result.erroCun;
          console.log(NumData);
          var myChart = echarts.init(document.getElementById('main'));
          var option = {
            color: ['#4A90E2'],
            //tooltip : {
            //    trigger: 'axis',
            //    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            //        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            //    }
            //},
            grid: {
              left: '3%',
              right: '0',
              bottom: '5%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: ['已付款', '待签收', '已签收', '采购异常'],//signFor+ unKnown + unSignFor,unSignFor+unKnown,signFor,erroCun
                axisTick: {
                  alignWithLabel: true
                },
                name: '',
                axisLabel: {
                  interval: 0,
                  formatter: function (value) {
                    //debugger
                    var ret = "";//拼接加\n返回的类目项
                    var maxLength = 18;//每项显示文字个数
                    var valLength = value.length;//X轴类目项的文字个数
                    var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                    if (rowN > 1)//如果类目项的文字大于3,
                    {
                      for (var i = 0; i < rowN; i++) {
                        var temp = "";//每次截取的字符串
                        var start = i * maxLength;//开始截取的位置
                        var end = start + maxLength;//结束截取的位置
                        //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                        temp = value.substring(start, end) + "\n";
                        ret += temp; //凭借最终的字符串
                      }
                      return ret;
                    }
                    else {
                      return value;
                    }
                  }
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '数量',
              }
            ],
            series: [
              {
                name: '数量',
                type: 'bar',
                barWidth: '75px',
                itemStyle: {
                  normal: {
                    label: {
                      show: true,
                      position: 'top',
                      textStyle: {
                        color: 'black'
                      }
                    }
                  }
                },
                data: NumData
              }
            ]
          };
          myChart.setOption(option);
        }
      }, function (err) {
        layer.msg('服务器错误')
      });
    }

    getEchartData()

    //Echart图表筛选
    $scope.EchartsFilter = function (t) {
      console.log(t)
      $scope.EchartsDate = t;
      getEchartData()
    }
    $scope.ProData = [];
    //搜索
    $scope.SearchType = 'SKU';
    $scope.EnterSearch = function (ev) {
      if (ev.which == '13') {
        $scope.Search();
      }
    }
    $scope.Search = function () {
      $scope.ProData = [];
      if (!$scope.SearchTxt) {
        layer.msg('请输入关键字！')
        return;
      }
      var data = {
        autFlag: "01",
        chargeId: "",
        filter01: $scope.SearchType,
        filter02: $scope.SearchTxt,
        filter03: "",
        filter04: "",
        filter05: "",
        filter06: "",
        filter11: "",
        filter12: "",
        filter21: "",
        filter22: "",
        filter23: "",
        filter24: "",
        flag: "0",
        flag2: "",
        pageNum: "1",
        pageSize: "10000",
        status: "3"
      };
      layer.load(2);
      erp.postFun("pojo/product/list", data, function (res) {
        layer.closeAll("loading");
        if (res.data.statusCode == 200) {
          /*  res.data.result.forEach(function (o,i) {
                o.over = false;
            });*/
          $scope.ProData = JSON.parse(res.data.result).ps;
          console.log($scope.ProData)
        }
      }, function (err) {
        layer.closeAll("loading");
        layer.msg('服务器错误')
      });
    }
    //查看商品
    $scope.lookPro = function (id) {
      var toUrl = window.open();
      erp.getFun('cj/locProduct/rollToken?id=' + id, function (data) {
        var data = data.data;
        if (data.statusCode != 200) {
          console.log(data);
          return;
        }
        var detailToken = data.result;
        console.log(detailToken);
        toUrl.location.href = 'https://app.cjdropshipping.com/product-detail.html?id=' + id + '&token=' + detailToken;
      }, function (err) {
        console.log(err);
      });
    }
  }])
  /*新品*/
  app.controller('NewProductCtrl', ['$scope', '$window', '$location', '$routeParams', '$timeout', '$http', 'erp', 'merchan', '$sce', function ($scope, $window, $location, $routeParams, $timeout, $http, erp, merchan, $sce) {
    console.log('NewProductCtrl');
    $scope.dateArr = [
      {name: '今天', flag: true, 'dateType': '1'},
      {name: '昨天', flag: false, 'dateType': '2'},
      {name: '前天', flag: false, 'dateType': '3'},
    ];
    $scope.pageNum1 = 1;
    $scope.pageSize1 = '20';
    $scope.dateType = '1';
    $scope.dataType = '1';
    $scope.authoritystatus = '';
    $scope.entryname = '';
    $scope.tabType = '1';
    $scope.categoryid = '';
    $scope.dataList = [];
    $scope.addType = true;
    $scope.editType = false;

    function clear() {
      $scope.dateArr = [
        {name: '今天', flag: true, 'dateType': '1'},
        {name: '昨天', flag: false, 'dateType': '2'},
        {name: '前天', flag: false, 'dateType': '3'},
      ];
      $scope.pageNum1 = 1;
      $scope.pageSize1 = '20';
      $scope.dateType = '1';
      $scope.dataType = '1';
      $scope.authoritystatus = '';
      $scope.entryname = '';
      $scope.tabType = '1';
      $scope.categoryid = '';
      $scope.dataList = [];
      $scope.addType = true;
      $scope.editType = false;
      $('#date1').val('');
      $('#date2').val('');
      $('.search-cate-name').find('.text').html('全部');
      $('.search-cate-name').find('.text').attr('id', '');
    }

    //清空
    $scope.clearInput = function () {
      clear();
      getData()
    };
    //
    $scope.dateClick = function (item) {
      $scope.dateArr.forEach(function (o, i) {
        o.flag = false;
      })
      item.flag = !item.flag;
      $scope.dateType = item.dateType;
      $scope.pageNum1 = 1;
      $('#date1').val('');
      $('#date2').val('');
      getData()
    }
    $scope.tabClick = function (type) {
      clear();
      if (type == '1') {
        $scope.addType = true;
        $scope.editType = false;
        $scope.tabType = '1';
      } else if (type == '2') {
        $scope.addType = false;
        $scope.editType = true;
        $scope.tabType = '2';
      }
      getData()
    };
    // $scope.dateFocus = function () {
    //   $scope.dateType = null;
    //   $scope.dateArr.forEach(function (o, i) {
    //     o.flag = false;
    //   })
    // }
    $scope.searchInput = function () {
      $scope.pageNum1 = 1;
      getData()
    };

    function getData() {
      $scope.categoryid = $('.search-cate-name').find('.text').attr('id');
      if($('#date1').val()||$('#date2').val()){
        $scope.dateType = null;
        $scope.dateArr.forEach(function (o, i) {
          o.flag = false;
        })
      }
      var data = {
        "begainDate": $('#date1').val(),
        "endDate": $('#date2').val(),
        "pageNo": $scope.pageNum1.toString(),
        "pageSize": $scope.pageSize1,
        "dateType": $scope.dateType,
        "dataType": $scope.dataType,
        "authoritystatus": $scope.authoritystatus,
        "tabType": $scope.tabType,
        "categoryid": $scope.categoryid,
        "entryname": $scope.entryname
      };
      erp.load();
      erp.postFun("erp/disputeInfo/getNewProductList", data, function (res) {
        layer.closeAll('loading')
        if (res.data.statusCode == 200) {
          $scope.dataList = res.data.result.productNewList;
          $scope.dataList.forEach(function (o, i) {
            o.isOver = false;
          })
          $scope.TotalNum1 = res.data.result.count;
          pageFun1()
        }
      }, function (data) {
        console.log(data)
        layer.closeAll('loading')
      })
    }

    getData()
    //查看视频
    $scope.lookVideo = function (item) {
      console.log(item.material)
      $scope.isLook = true;
      var url = 'https://' + item.material.replace('https://', '').replace('http://', '');
      var vid = document.getElementById('my-video');
      vid.getElementsByTagName('video')[0].setAttribute('src', url);
      vid.getElementsByTagName('video')[0].load();
    }
    $scope.close = function () {
      $scope.isLook = false;
      videojs('my-video').ready(function () {
        var myvideo = this;
        myvideo.currentTime(0);
        myvideo.pause();
      });
    }
    //查看商品
    $scope.lookPro = function (id) {
      window.open('manage.html#/merchandise/show-detail/' + id + '/' + '0' + '/' + '3' + '/' + '0', '_blank', '');
    };
    //可见性点击
    var deleteUserId;
    $scope.showPartUsers = function (item) {
      console.log(item)
      $scope.showUserFlag = true;
      $scope.nowOpeItem = item;
      deleteUserId = [];
      var getUrl;
      if (item.authorityStatus == 1) {
        getUrl = 'pojo/product/getAssignAccount?pid=';
      } else {
        getUrl = 'pojo/product/getAutAcc?pid=';
      }
      erp.getFun(getUrl + item.id, function (data) {
        layer.closeAll('loading');
        console.log(data.data)
        if (item.authorityStatus == 0) {
          if (data.statusCode == 204) {
            layer.msg(data.message);
            return;
          }
          var authUserInfo = data.data.result ? JSON.parse(data.data.result) : [];
          var temArr = [];
          for (var k in authUserInfo) {
            temArr.push(authUserInfo[k]);
          }
          $scope.authUserList = temArr;
          temArr = null;
        } else {
          $scope.authUserList = data.data.result ? JSON.parse(data.data.result) : [];
        }
        console.log($scope.authUserList)
      }, function (err) {
        layer.closeAll('loading');
        layer.msg('网络错误');
      });
    }
    $scope.deleteOneUser = function (item, index) {
      deleteUserId.push(item.id);
      $scope.authUserList.splice(index, 1);
    }
    $scope.goDeleteUser = function () {
      console.log(deleteUserId);
      if (deleteUserId.length > 0 && $scope.nowOpeItem.authorityStatus == 0) {
        var dUserData = {
          pid: $scope.nowOpeItem.id,
          autAccId: deleteUserId.join(',')
        }
        layer.load(2);
        erp.postFun('pojo/product/deleteAuthority', JSON.stringify(dUserData), function (data) {
          layer.closeAll('loading');
          var data = data.data;
          if (data.statusCode != 200) {
            layer.msg('服务器错误，删除失败！');
            return false;
          }
          console.log(data);
          layer.msg('删除成功');
          $scope.showUserFlag = false;
          if ($scope.authUserList.length == 0) {
            $scope.nowOpeItem.authorityStatus = 1;
            $scope.nowOpeItem.autAccId = '{}';
          } else {
            for (var i = 0; i < deleteUserId.length; i++) {
              delete $scope.nowOpeItem.autAccId[deleteUserId[i]];
            }
          }
        }, function (err) {
          layer.closeAll('loading');
          layer.msg('网络错误，删除失败！');
        })
      } else {
        $scope.showUserFlag = false;
      }
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
      var totalPage = Math.ceil($scope.TotalNum1 / $scope.pageSize1);
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
    // 搜索商品类目
    merchan.getCateListOne(function (data) {
      $scope.categoryListOne = data;
    });
    $scope.showCategory = function () {
      $('.cate-list-box').show();
    }
    $scope.hideCategory = function () {
      $('.cate-list-box').hide();
    }
    $scope.selectCategory = function ($event, id) {
      var thirdMenu = $($event.target).html();
      $('.search-cate-name').find('.text').html(thirdMenu);
      if (id) {
        $('.search-cate-name').find('.text').attr('id', id);
      } else {
        $('.search-cate-name').find('.text').attr('id', '');
      }
      $('.cate-list-box').hide();
      //$scope.getSearchList();
    }
  }]);
  /*店铺分析*/
  app.controller('storeCtrl', ['$scope', '$window', '$location', '$routeParams', '$timeout', '$http', 'erp', 'merchan', '$sce', function ($scope, $window, $location, $routeParams, $timeout, $http, erp, merchan, $sce) {
    console.log('店铺分析');
    $scope.dateArr = [
      {name: '近三天', flag: true, 'dateType': 'threeDay'},
      {name: '本周', flag: false, 'dateType': 'weeks'},
      {name: '本月', flag: false, 'dateType': 'month'},
    ];
    $scope.pageNum = '1';
    $scope.pageSize = '20';
    $scope.dateType = 'threeDay';
    $scope.authoritystatus = '';
    $scope.entryname = '';
    $scope.tabType = '1';
    $scope.categoryid = '';
    $scope.dataList = [];
    $scope.addType = true;
    $scope.editType = false;
    $scope.seaType = 'productName';
    $scope.isAct = 'totalOrderCount';
    //
    $scope.dateClick = function (item) {
      $scope.dateArr.forEach(function (o, i) {
        o.flag = false;
      })
      item.flag = !item.flag;
      $scope.dateType = item.dateType;
      $scope.pageNum = '1';
      $('#date1').val('');
      $('#date2').val('');
      getData()
    }
    // $scope.dateFocus = function () {
    //   $scope.dateType = null;
    //   $scope.dateArr.forEach(function (o, i) {
    //     o.flag = false;
    //   })
    // }
    $scope.searchInput = function () {
      $scope.pageNum = '1';
      getData()
    };
    $scope.sortFun = function(type){
      $scope.isAct = type;
      $scope.pageNum = '1';
      getData()
    }
    $scope.stuChange = function(){
      $scope.pageNum = '1';
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
      $scope.pageNum = '1';
      getData()
    }
    function getData() {
      $scope.categoryid = $('.search-cate-name').find('.text').attr('id');
      var seaType = $scope.seaType;
      if ($('#date1').val()||$('#date2').val()) {
        $scope.dateType = null;
        $scope.dateArr.forEach(function (o, i) {
          o.flag = false;
        })
      }
      var data = {
        "startTime": $('#date1').val(),
        "endTime": $('#date2').val(),
        "pageNum": $scope.pageNum,
        "pageSize": $scope.pageSize,
        "timeFlag": $scope.dateType,
        "status": $scope.authoritystatus,
        "orderBy": $scope.isAct
      };
      data[seaType] = $scope.seachVal;
      console.log(data)
      erp.postFun("erp/productpoint/statisticsShopProduct", data, function (res) {
        if (res.data.statusCode == 200) {
          $scope.dataList = res.data.result.list;
          for(let i = 0,len = $scope.dataList.length;i<len;i++){
            $scope.dataList[i]['index'] = $scope.pageSize*($scope.pageNum-1)+i+1
          }
          console.log($scope.dataList)
          $scope.TotalNum = res.data.result.totalNum;
          pageFun1()
        }
      }, function (data) {
        console.log(data)
      },{layer:true})
    }

    getData()
    //查看商品
    $scope.lookPro = function (item) {
      if (item.locId) {
        window.open('manage.html#/merchandise/show-detail/' + item.locId + '/' + '0' + '/' + '3' + '/' + '0', '_blank', '');
      }
      // else{
      //   window.open('https://' + item.shopName +'.myshopify.com')
      // }
    };
    $scope.linkStore = function(item){
        window.open('https://' + item.shopName +'.myshopify.com', '_blank', '');
    }
    $scope.cusDetail = function(item){
        window.open('manage.html#/erpcustomer/customer-detail/' + item.customerId + '/1', '_blank', '');
    }

    //分页
    function pageFun1() {
      if($scope.TotalNum<1){
        return
      }
      $(".pagegroup1").jqPaginator({
        totalCounts: $scope.TotalNum || 1,
        pageSize: $scope.pageSize * 1,
        visiblePages: 5,
        currentPage: $scope.pageNum * 1,
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
          $scope.pageNum = n + '';
          getData()
        }
      });
    }
  }]);
  /*操作统计*/
  app.controller('rankingCtrl', ['$scope', '$window', '$location', '$routeParams', '$timeout', '$http', 'erp', 'merchan', '$sce', 'utils', function ($scope, $window, $location, $routeParams, $timeout, $http, erp, merchan, $sce, utils) {
    var date = new Date();
    let start = new Date(new Date().setDate(new Date().getDate() - 2)).toLocaleDateString().replace(/\//g, '-');
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    let d = date.getDate();
    d = d < 10 ? '0' + d : d;
    $scope.pageNum1 = '1';
    $scope.pageSize1 = '20';
    $scope.dataList = [];
    $scope.nameCn = '';
    $scope.topPage = '';
    $scope.startTime = start;
    $scope.endTime = y + '-' + m + '-' + d;
    $scope.timeNum = 2;
    $scope.sortType = '';
    // 查询
    $scope.searchInput = function () {
      if (new Date($scope.startTime) > new Date(y + '-' + m + '-' + d)) {
        layer.msg('开始时间不能大于当前时间');
      } else if (new Date($scope.startTime) > new Date($scope.endTime)) {
        layer.msg('开始时间不能大于结束时间')
      } else {
        if ($("#c-data-time").val() || $("#cdatatime2").val()) {
          $scope.timeNum = 1;
        } else {
          $scope.timeNum = 2;
        }
        $scope.pageNum1 = '1';
        getData();
      }
    };
    // 表头固定
    // utils.fixedTop({ el: '#fixed-top', offsetTop: 56})
    // 排序
    $scope.sort = function (type) {
      $scope.sortType = type + ' DESC';
      getData();
    };

    // 列表数据
    function getData() {
      let data = {
        topPage: $scope.topPage,
        dbSku: $scope.nameCn,
        startTime: $scope.startTime,
        endTime: $scope.endTime,
        sortType: $scope.sortType,
        pageNo: $scope.pageNum1,
        pageSize: $scope.pageSize1
      }
      erp.load();
      $scope.dataList = [];
      erp.postFun('erp/productpoint/statisticsProduct', JSON.stringify(data), function (res) {
        if (res.status === 200) {
          layer.closeAll('loading')
          $scope.dataList = res.data.dPPointList;
          $scope.TotalNum1 = res.data.total;
          pageFun1()
        }
      }, function (data) {
        layer.closeAll('loading')
      });
    }

    getData();
    //查看商品
    $scope.lookPro = function (id) {
      window.open('manage.html#/merchandise/show-detail/' + id + '/' + '0' + '/' + '3' + '/' + '0', '_blank', '');
    };
    //按时间搜索
    //erp开始日期搜索
    $("#c-data-time").click(function () {
      let erpbeginTime = $("#c-data-time").val();
      let interval = setInterval(function () {
        let endtime2 = $("#c-data-time").val();
        if (endtime2 != erpbeginTime) {
          clearInterval(interval);
          $scope.startTime = endtime2;
          // $scope.pageNum = 1;
          // getData()
        }
      }, 100)
    });
    //erp结束日期搜索
    $("#cdatatime2").click(function () {
      let erpendTime = $("#cdatatime2").val();
      let interval = setInterval(function () {
        let endtime2 = $("#cdatatime2").val();
        if (endtime2 != erpendTime) {
          clearInterval(interval);
          $scope.endTime = endtime2;
          // $scope.pageNum = 1;
          // getData()
        }
      }, 100)
    });
    // 近几天
    $scope.timeFilter = function (num) {
      let startTime = new Date(new Date().setDate(new Date().getDate() - num)).toLocaleDateString().replace(/\//g, '-');
      $scope.timeNum = num;
      $scope.startTime = startTime;
      $scope.endTime = y + '-' + m + '-' + d;
      $("#c-data-time").val('');
      $("#cdatatime2").val('');
      getData();
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
          erp.load();
          $scope.pageNum1 = n + '';
          getData();
        }
      });
    }
  }]);
  //权重
  app.controller('quanZhongCtrl', ['$scope', '$window', '$location', '$routeParams', '$timeout', '$http', 'erp', function ($scope, $window, $location, $routeParams, $timeout, $http, erp) {
    console.log('权重');
    var bs = new Base64();
    var erpLoginName = bs.decode(localStorage.getItem('erploginName') == undefined ? '' : localStorage.getItem('erploginName'));
    if (erpLoginName=='admin') {
      $scope.adminFlag = true;
    } else {
      $scope.adminFlag = false;
    }
    $scope.bianJiFlag1 = false;
    $scope.bianJiFlag2 = false;
    $scope.clearNoNum1 = function (val,key) {
      console.log(val,key)
      val = val.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
      val = val.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
	    val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
      console.log(val)
      if(100<val || val < 0){
        val = val.substring(0,val.length-1)
        layer.msg('请输入0~100之间的数字')
      }
      $scope.jsonInp1[key] = val;
    }
    $scope.clearNoNum2 = function (val,key) {
      console.log(val,key)
      val = val.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
      val = val.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
	    val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
      console.log(val)
      if(1<val || val < 0){
        val = val.substring(0,val.length-1)
        layer.msg('请输入0~1之间的数字')
      }
      $scope.jsonInp2[key] = val;
    }
    $scope.clearNoNum3 = function(val,key,num){
      val = val.replace(/[^\-\d.]/g,"");  //清除“数字”-和“.”以外的字符
      val = val.replace(/\-{2,}/g,"-"); //只保留第一个- 清除多余的
      val = val.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
	    val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
      if(0<val || val < -1){
        val = val.substring(0,val.length-1)
        layer.msg('请输入0~-1之间的数字')
      }
      console.log(val)
      if (num==1) {
        $scope.jsonInp1[key] = val;
      } else {
        $scope.jsonInp2[key] = val;
      }
    }
    $scope.clearNoNum4 = function(val,key,num){
      val = val.replace(/[^\-\d.]/g,"");  //清除“数字”-和“.”以外的字符
      val = val.replace(/\-{2,}/g,"-"); //只保留第一个- 清除多余的
      val = val.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
	    val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
      if(0<val || val < -100){
        val = val.substring(0,val.length-1)
        layer.msg('请输入0~-100之间的数字')
      }
      console.log(val)
      if (num==1) {
        $scope.jsonInp1[key] = val;
      } else {
        $scope.jsonInp2[key] = val;
      }
    }
    function getDataFun(){
      erp.postFun('erp/productweight/productWeightList',{},function (data) {
        console.log(data)
        if (data.data.statusCode==200) {
          let resArr = data.data.result;
          if(resArr&&resArr.length==2){
            if (resArr[0].wtype==2) {
              $scope.json1 = JSON.parse(JSON.stringify(resArr[0]));
              $scope.jsonInp1 = JSON.parse(JSON.stringify(resArr[0]));
              $scope.json2 = JSON.parse(JSON.stringify(resArr[1]));
              $scope.jsonInp2 = JSON.parse(JSON.stringify(resArr[1]));
            } else {
              $scope.json1 = JSON.parse(JSON.stringify(resArr[1]));
              $scope.jsonInp1 = JSON.parse(JSON.stringify(resArr[1]));
              $scope.json2 = JSON.parse(JSON.stringify(resArr[0]));
              $scope.jsonInp2 = JSON.parse(JSON.stringify(resArr[0]));
            }
          }
        }
      },function (data) {
        console.log(data)
      })
    }
    getDataFun()
    $scope.bianJiFun1 = function(){
      if(isObjectValueEqual($scope.json2, $scope.jsonInp2)){
        $scope.bianJiFlag2 = false;
        $scope.bianJiFlag1 = true;
      }else{
        layer.msg('商品权重有修改,请先完成编辑')
      }
    }
    $scope.bianJiFun2 = function(){
      if(isObjectValueEqual($scope.json1, $scope.jsonInp1)){
        $scope.bianJiFlag1 = false;
        $scope.bianJiFlag2 = true;
      }else{
        layer.msg('客户操作商品权重有修改,请先完成编辑')
      }
    }
    $scope.baoCunFun = function(stu){
      $scope.whichStu = stu;
      if (stu=='1') {
        if(isObjectValueEqual($scope.json1, $scope.jsonInp1)){
          $scope.bianJiFlag1 = false;
        }else{
          $scope.isEditFlag = true;
        }
      } else {
        if(isObjectValueEqual($scope.json2, $scope.jsonInp2)){
          $scope.bianJiFlag2 = false;
        }else{
          $scope.isEditFlag = true;
        }
      }
    }
    $scope.quXiaoFun = function(stu){
      $scope.whichStu = stu;
      if (stu=='1') {
        if(isObjectValueEqual($scope.json1, $scope.jsonInp1)){
          $scope.bianJiFlag1 = false;
        }else{
          $scope.isCancelFlag = true;
        }
      } else {
        if(isObjectValueEqual($scope.json2, $scope.jsonInp2)){
          $scope.bianJiFlag2 = false;
        }else{
          // console.log('我们不一样')
          $scope.isCancelFlag = true;
        }
      }
      
    }
    $scope.cancelEditFun = function(){
      $scope.isEditFlag = false;
    }
    $scope.sureEditFun = function(){
      let upJson = {};
      if($scope.whichStu == 1){
        upJson = JSON.parse(JSON.stringify($scope.jsonInp1));
      }else if($scope.whichStu == 2){
        upJson = JSON.parse(JSON.stringify($scope.jsonInp2));
      }
      delete upJson.updatetime;
      upJson.changeflag = '1';
      console.log($scope.whichStu,upJson)
      erp.postFun('erp/productweight/updateDspWeight',upJson,function(data){
        console.log(data)
        layer.msg(data.data.message)
        if (data.data.statusCode==200) {
          $scope.isEditFlag = false;
          if($scope.whichStu == 1){
            $scope.bianJiFlag1 = false;
          }else if($scope.whichStu == 2){
            $scope.bianJiFlag2 = false;
          }
          getDataFun()
        }
      },function(data){
        console.log(data)
      })
    }
    $scope.closeFun = function(){
      $scope.isCancelFlag = false;
    }
    $scope.sureFun = function(){
      if($scope.whichStu=='1'){
        $scope.bianJiFlag1 = false;
      }else{
        $scope.bianJiFlag2 = false;
      }
      $scope.isCancelFlag = false;
      getDataFun()
    }
    function isObjectValueEqual(a, b) {
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);
        if (aProps.length != bProps.length) {
            return false;
        }
        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];
            if (a[propName] !== b[propName]) {
                return false;
            }
        }
        return true;
    }
	
	  // function clearNoNum(obj){
	  //     obj.value = obj.value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
	  //     obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
	  //     obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
	  //     obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
	  //     if(obj.value.indexOf(".")< 0 && obj.value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
	  //         obj.value= parseFloat(obj.value);
	  //     }
    // }
  }]);
  /*商品分值*/
  app.controller('proFenZhiCtrl', ['$scope', '$window', '$location', '$routeParams', '$timeout', '$http', 'erp', 'merchan', '$sce', function ($scope, $window, $location, $routeParams, $timeout, $http, erp, merchan, $sce) {
    console.log('商品分值');
    $scope.dateArr = [
      {name: '近30天', flag: true, 'dateType': '1'},
      {name: '近60天', flag: false, 'dateType': '2'},
      {name: '全部', flag: false, 'dateType': ''},
    ];

    $scope.pageNum = '1';
    $scope.pageSize = '20';
    $scope.dateType = '1';
    $scope.entryname = '';
    $scope.tabType = '1';
    $scope.categoryid = '';
    $scope.dataList = [];
    $scope.addType = true;
    $scope.editType = false;
    $scope.seaType = 'productName';
    $scope.isAct = 'grade';
    //
    $scope.dateClick = function (item) {
      $scope.dateArr.forEach(function (o, i) {
        o.flag = false;
      })
      item.flag = !item.flag;
      $scope.dateType = item.dateType;
      $scope.pageNum = '1';
      $('#date1').val('');
      $('#date2').val('');
      getData()
    }
    $scope.searchInput = function () {
      $scope.pageNum = '1';
      getData()
    };
    $scope.keyUpFun = function(e){
        var keycode = window.event?e.keyCode:e.which;
        if(keycode==13){
            $scope.pageNum = '1';
            getData()
        }
    };
    $scope.sortFun = function(type){
      $scope.isAct = type;
      $scope.pageNum = '1';
      getData()
    }
    $scope.stuChange = function(){
      $scope.pageNum = '1';
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
      $scope.pageNum = '1';
      getData()
    }
    function getData() {
      if($('#date1').val()&&$('#date2').val()){
        let day1 = $('#date1').val(),day2 = $('#date2').val();
        let time1 = new Date(day1).getTime(),time2 = new Date(day2).getTime();
        console.log(time1,time2)
        if(time1>time2){
          layer.msg('开始日期不能大于结束日期')
          return
        }
      }
      $scope.categoryid = $('.search-cate-name').find('.text').attr('id');
      if ($('#date1').val()||$('#date2').val()) {
        $scope.dateType = null;
        $scope.dateArr.forEach(function (o, i) {
          o.flag = false;
        })
      }
      var data = {
        "startDate": $('#date1').val(),
        "endDate": $('#date2').val(),
        "productcate": $scope.spItemId,
        "productName": $scope.seachVal,
        "stype":1,
        "pageNo": $scope.pageNum,
        "pageSize": $scope.pageSize,
        "timeFlag": $scope.dateType,
        "orderBy": $scope.isAct
      };
      console.log(data)
      erp.postFun("erp/productscore/productScorePage", data, function (res) {
        if (res.data.statusCode == 200) {
          $scope.dataList = res.data.result.data;
          for(let i = 0,len = $scope.dataList.length;i<len;i++){
            $scope.dataList[i]['index'] = $scope.pageSize*($scope.pageNum-1)+i+1
          }
          // console.log($scope.dataList)
          $scope.TotalNum = res.data.result.total;
          pageFun1()
        }
      }, function (data) {
        console.log(data)
      },{layer:true})
    }

    getData()
    
    //分页
    function pageFun1() {
      if($scope.TotalNum<1){
        return
      }
      $(".pagegroup1").jqPaginator({
        totalCounts: $scope.TotalNum || 1,
        pageSize: $scope.pageSize * 1,
        visiblePages: 5,
        currentPage: $scope.pageNum * 1,
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
          $scope.pageNum = n + '';
          getData()
        }
      });
    }
    // 搜索商品类目
    merchan.getCateListOne(function (data) {
      $scope.categoryListOne = data;
      console.log(data)
    });
    $scope.showCategory = function () {
      $('.cate-list-box').show();
    }
    $scope.hideCategory = function () {
      $('.cate-list-box').hide();
    }
    $scope.selectCategory = function ($event, id) {
      $scope.spItemId = id;
      var thirdMenu = $($event.target).html();
      $('.search-cate-name').find('.text').html(thirdMenu);
      if (id) {
        $('.search-cate-name').find('.text').attr('id', id);
      } else {
        $('.search-cate-name').find('.text').attr('id', '');
      }
      $('.cate-list-box').hide();
      //$scope.getSearchList();
    }
  }]);
  /*客户分值*/
  app.controller('customerFenZhiCtrl', ['$scope', '$window', '$location', '$routeParams', '$timeout', '$http', 'erp', 'merchan', '$sce', function ($scope, $window, $location, $routeParams, $timeout, $http, erp, merchan, $sce) {
    console.log('客户分值');
    $scope.dateArr = [
      {name: '近30天', flag: true, 'dateType': '1'},
      {name: '近60天', flag: false, 'dateType': '2'},
      {name: '全部', flag: false, 'dateType': ''},
    ];

    $scope.pageNum = '1';
    $scope.pageSize = '20';
    $scope.dateType = '1';
    $scope.entryname = '';
    $scope.tabType = '1';
    $scope.categoryid = '';
    $scope.dataList = [];
    $scope.addType = true;
    $scope.editType = false;
    $scope.seaType = 'productName';
    $scope.dateClick = function (item) {
      $scope.dateArr.forEach(function (o, i) {
        o.flag = false;
      })
      item.flag = !item.flag;
      $scope.dateType = item.dateType;
      $scope.pageNum = '1';
      $('#date1').val('');
      $('#date2').val('');
      getData()
    }
    $scope.searchInput = function () {
      $scope.pageNum = '1';
      getData()
    };
    $scope.keyUpFun = function(e){
        var keycode = window.event?e.keyCode:e.which;
        if(keycode==13){
            $scope.pageNum = '1';
            getData()
        }
    };
    $scope.sortFun = function(type){
      $scope.isAct = type;
      $scope.pageNum = '1';
      getData()
    }
    $scope.stuChange = function(){
      $scope.pageNum = '1';
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
      $scope.pageNum = '1';
      getData()
    }
    function getData() {
      if($('#date1').val()&&$('#date2').val()){
        let day1 = $('#date1').val(),day2 = $('#date2').val();
        let time1 = new Date(day1).getTime(),time2 = new Date(day2).getTime();
        console.log(time1,time2)
        if(time1>time2){
          layer.msg('开始日期不能大于结束日期')
          return
        }
      }
      $scope.categoryid = $('.search-cate-name').find('.text').attr('id');
      if ($('#date1').val()||$('#date2').val()) {
        $scope.dateType = null;
        $scope.dateArr.forEach(function (o, i) {
          o.flag = false;
        })
      }
      var data = {
        "startDate": $('#date1').val(),
        "endDate": $('#date2').val(),
        "custName": $scope.seachVal,
        "pageNo": $scope.pageNum,
        "pageSize": $scope.pageSize,
        "timeFlag": $scope.dateType
      };
      console.log(data)
      erp.postFun("erp/productscore/queryCustomerInfos", data, function (res) {
        if (res.data.statusCode == 200) {
          $scope.dataList = res.data.result.data;
          for(let i = 0,len = $scope.dataList.length;i<len;i++){
            $scope.dataList[i]['index'] = $scope.pageSize*($scope.pageNum-1)+i+1
            if($scope.dataList[i].survey){
              $scope.dataList[i].survey = JSON.parse($scope.dataList[i].survey)
            }
          }
          console.log($scope.dataList)
          $scope.TotalNum = res.data.result.total;
          pageFun1()
        }
      }, function (data) {
        console.log(data)
      },{layer:true})
    }

    getData()
    $scope.detailFun = function(item){
      let id = item.id;
      window.open('#/CommodityAnalysis/customerfzdetail/'+id)
    }
    //分页
    function pageFun1() {
      if($scope.TotalNum<1){
        return
      }
      $(".pagegroup1").jqPaginator({
        totalCounts: $scope.TotalNum || 1,
        pageSize: $scope.pageSize * 1,
        visiblePages: 5,
        currentPage: $scope.pageNum * 1,
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
          $scope.pageNum = n + '';
          getData()
        }
      });
    }
    // 搜索商品类目
    merchan.getCateListOne(function (data) {
      $scope.categoryListOne = data;
      console.log(data)
    });
    $scope.showCategory = function () {
      $('.cate-list-box').show();
    }
    $scope.hideCategory = function () {
      $('.cate-list-box').hide();
    }
    $scope.selectCategory = function ($event, id) {
      $scope.spItemId = id;
      var thirdMenu = $($event.target).html();
      $('.search-cate-name').find('.text').html(thirdMenu);
      if (id) {
        $('.search-cate-name').find('.text').attr('id', id);
      } else {
        $('.search-cate-name').find('.text').attr('id', '');
      }
      $('.cate-list-box').hide();
      //$scope.getSearchList();
    }
  }]);
  /*客户分值详情*/
  app.controller('customerFenZhiDetailCtrl', ['$scope', '$window', '$location', '$routeParams', '$timeout', '$http', 'erp', 'merchan', '$sce', function ($scope, $window, $location, $routeParams, $timeout, $http, erp, merchan, $sce) {
    console.log('客户分值详情');
    $scope.dateArr = [
      {name: '近30天', flag: true, 'dateType': '1'},
      {name: '近60天', flag: false, 'dateType': '2'},
      {name: '全部', flag: false, 'dateType': ''},
    ];
    var cusId = $routeParams.id;
    $scope.pageNum = '1';
    $scope.pageSize = '20';
    $scope.dateType = '1';
    $scope.entryname = '';
    $scope.tabType = '1';
    $scope.categoryid = '';
    $scope.dataList = [];
    $scope.addType = true;
    $scope.editType = false;
    $scope.seaType = 'productName';
    $scope.isAct = 'grade';
    //
    $scope.dateClick = function (item) {
      $scope.dateArr.forEach(function (o, i) {
        o.flag = false;
      })
      item.flag = !item.flag;
      $scope.dateType = item.dateType;
      $scope.pageNum = '1';
      $('#date1').val('');
      $('#date2').val('');
      getData()
    }
    $scope.searchInput = function () {
      $scope.pageNum = '1';
      getData()
    };
    $scope.keyUpFun = function(e){
        var keycode = window.event?e.keyCode:e.which;
        if(keycode==13){
            $scope.pageNum = '1';
            getData()
        }
    };
    $scope.sortFun = function(type){
      $scope.isAct = type;
      $scope.pageNum = '1';
      getData()
    }
    $scope.stuChange = function(){
      $scope.pageNum = '1';
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
      $scope.pageNum = '1';
      getData()
    }
    function getData() {
      if($('#date1').val()&&$('#date2').val()){
        let day1 = $('#date1').val(),day2 = $('#date2').val();
        let time1 = new Date(day1).getTime(),time2 = new Date(day2).getTime();
        console.log(time1,time2)
        if(time1>time2){
          layer.msg('开始日期不能大于结束日期')
          return
        }
      }
      $scope.categoryid = $('.search-cate-name').find('.text').attr('id');
      if ($('#date1').val()||$('#date2').val()) {
        $scope.dateType = null;
        $scope.dateArr.forEach(function (o, i) {
          o.flag = false;
        })
      }
      var data = {
        "startDate": $('#date1').val(),
        "endDate": $('#date2').val(),
        "productcate": $scope.spItemId,
        "productName": $scope.seachVal,
        "stype":2,
        "accountid": cusId,
        "pageNo": $scope.pageNum,
        "pageSize": $scope.pageSize,
        "timeFlag": $scope.dateType,
        "orderBy": $scope.isAct
      };
      console.log(data)
      erp.postFun("erp/productscore/productScorePage", data, function (res) {
        if (res.data.statusCode == 200) {
          $scope.dataList = res.data.result.data;
          for(let i = 0,len = $scope.dataList.length;i<len;i++){
            $scope.dataList[i]['index'] = $scope.pageSize*($scope.pageNum-1)+i+1
          }
          // console.log($scope.dataList)
          $scope.TotalNum = res.data.result.total;
          pageFun1()
        }
      }, function (data) {
        console.log(data)
      },{layer:true})
    }

    getData()
    
    //分页
    function pageFun1() {
      if($scope.TotalNum<1){
        return
      }
      $(".pagegroup1").jqPaginator({
        totalCounts: $scope.TotalNum || 1,
        pageSize: $scope.pageSize * 1,
        visiblePages: 5,
        currentPage: $scope.pageNum * 1,
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
          $scope.pageNum = n + '';
          getData()
        }
      });
    }
    // 搜索商品类目
    merchan.getCateListOne(function (data) {
      $scope.categoryListOne = data;
      console.log(data)
    });
    $scope.showCategory = function () {
      $('.cate-list-box').show();
    }
    $scope.hideCategory = function () {
      $('.cate-list-box').hide();
    }
    $scope.selectCategory = function ($event, id) {
      $scope.spItemId = id;
      var thirdMenu = $($event.target).html();
      $('.search-cate-name').find('.text').html(thirdMenu);
      if (id) {
        $('.search-cate-name').find('.text').attr('id', id);
      } else {
        $('.search-cate-name').find('.text').attr('id', '');
      }
      $('.cate-list-box').hide();
      //$scope.getSearchList();
    }
  }]);
  app.filter("trustUrl", ['$sce', function ($sce) {
    return function (recordingUrl) {
      return $sce.trustAsResourceUrl(recordingUrl);
    };
  }]);
  //组合sku
  app.controller('skuGroupListCtrl', ['$scope', '$window', '$location', '$routeParams', '$timeout', '$http', 'erp', function ($scope, $window, $location, $routeParams, $timeout, $http, erp) {
    console.log('skuGroupListCtrl');
    $scope.searchInfo = '';
    $scope.pageSize = '20';
    $scope.pageNum = '1';

    getGroupSkuList();

    function getGroupSkuList() {
      var sendData = {
        pageSize: $scope.pageSize,
        page: $scope.pageNum,
        searchKey: $scope.searchInfo
      };
      erp.load();
      erp.postFun('pojo/product/chaXunBianTiZuHe', JSON.stringify(sendData), function (data) {
        erp.closeLoad();
        //console.log(data.data);
        if (data.data.statusCode == '200') {
          var result = JSON.parse(data.data.result);
          console.log(result);
          $scope.totalCounts = result.count;
          $scope.groupList = result.resultList;
          pageFun();
        } else {
          layer.msg('查询失败');
        }
      }, function () {
        erp.closeLoad();
      })
    }

    function pageFun() {
      $(".pagegroup").jqPaginator({
        totalCounts: $scope.totalCounts || 1,
        pageSize: $scope.pageSize * 1,
        visiblePages: 5,
        currentPage: $scope.pageNum * 1,
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
          $scope.pageNum = n + '';
          getGroupSkuList();
        }
      });
    }

    //更换每页多少条数据
    $scope.pagesizechange = function (pagesize) {
      //console.log(pagesize)
      // $scope.pagesize=pagesize-0;
      $scope.pageNum = '1';
      getGroupSkuList();
    };
    //手动输入页码GO跳转
    $scope.pagenumchange = function () {
      var pagenum = Number($scope.pageNum);
      var totalpage = Math.ceil($scope.totalCounts / $scope.pageSize);
      if (pagenum > totalpage) {
        layer.msg('错误页码');
        $scope.pageNum = '1';
      } else {
        getGroupSkuList();
      }
    };
    $scope.searchFun = function () {
      $scope.pageNum = '1';
      getGroupSkuList();
    }

    $scope.editGroupSku = function (item) {
      console.log(item.xinBianTiZuHe);
      $scope.mainSku = item.jiuBianTiSku;
      var groupArr = item.xinBianTiZuHe;
      var newArr = [];
      $.each(groupArr, function (i, v) {
        var data = {
          xinBianTiZuHeShuLiang: v.xinBianTiZuHeShuLiang,
          xinBianTiZuHeSku: v.xinBianTiZuHeSku
        }
        newArr.push(data);
      });
      $scope.groupArr = newArr;
      $('.groupZzc').show();
    }
    $scope.addCisku = function () {
      var data = {
        xinBianTiZuHeShuLiang: 0,
        xinBianTiZuHeSku: ''
      };
      $scope.groupArr.push(data);
      //$scope.$apply();
    }
    $scope.removeCisku = function (index) {
      console.log(index);
      $scope.groupArr.splice(index, 1);
    }
    $scope.closeGroup = function () {
      $('.groupZzc').hide();
    }

    $scope.isYanzheng = true;
    $scope.isDisabled = false;

    $scope.submitGroupFun = function () {
      var oldSku = $scope.mainSku;
      if (!$scope.groupArr) {
        return;
      }
      var flag = false;
      var list = $scope.groupArr;
      var data = {};
      $.each(list, function (i, v) {
        if (v.xinBianTiZuHeShuLiang && v.xinBianTiZuHeShuLiang * 1 > 0 && v.xinBianTiZuHeSku && v.xinBianTiZuHeSku != '' && v.xinBianTiZuHeSku != null) {
          data[v.xinBianTiZuHeSku] = v.xinBianTiZuHeShuLiang;
        } else {
          flag = true;
        }
      });
      // console.log(data);
      if (flag) {
        layer.msg('次sku不能为空或者数量必须大于0')
      } else {
        var sendData = {
          jiuBianTiSku: oldSku,
          xinBianTiZuHe: data
        };
        console.log(sendData);
        erp.load();
        erp.postFun('pojo/product/jiaoYanZuHe', JSON.stringify(sendData), function (data) {
          erp.closeLoad();
          // console.log(data);
          if (data.data.statusCode == '200') {
            var result = JSON.parse(data.data.result);
            console.log(result);
            $scope.istongguo = result.tongGuo;
            if (result.tongGuo == '0') {
              layer.msg('组合验证不通过');
              $scope.errMsg = '组合验证未通过，请检查重量'
              $scope.isYanzheng = true;
              $scope.isYanzhengSendData = '';

            } else if (result.tongGuo == '1') {
              layer.msg('组合验证通过');
              $scope.errMsg = '组合验证通过，可以提交';
              $scope.isYanzheng = false;
              $scope.isYanzhengSendData = sendData;
              $scope.isDisabled = true;
            }
            var list = result.list;
            $.each(list, function (i, v) {
              if (v.zu == '1') {
                $scope.zuWeight = '重量:' + v.packweight + ' g';
              } else if (v.zu == '0') {
                var sku = v.sku;
                var weight = v.packweight;
                $.each($scope.groupArr, function (i, v) {
                  var w = weight * v.xinBianTiZuHeShuLiang;
                  var str = '重量:' + w + ' g';
                  if (v.xinBianTiZuHeSku == sku) {
                    v.isweight = str;
                  }
                })
                // $scope.$apply();
              }
            })
          } else {
            layer.msg(data.data.message);
          }
        }, function () {
          erp.closeLoad();
        })

      }
    }
    $scope.gotoBackYanzheng = function () {
      $scope.isDisabled = false;
      $scope.isYanzheng = true;
    }
    $scope.sureSubmitSkuFun = function () {
      erp.load();
      erp.postFun('pojo/product/sheZhiBianTiZuHe', JSON.stringify($scope.isYanzhengSendData), function (data) {
        erp.closeLoad();
        console.log(data.data);
        if (data.data.statusCode == '200') {
          layer.msg('修改成功');
          $('.groupZzc').hide();
          $scope.errMsg = '';
          $scope.isDisabled = false;
          $scope.isYanzheng = true;
          getGroupSkuList();
        } else {
          layer.msg('修改失败')
        }
      }, function () {
        erp.closeLoad();
      })
    }


    $scope.deleteFun = function (id) {

      layer.confirm('确认要删除吗？', {
        btn: ['确定', '取消']//按钮
      }, function (index) {
        layer.close(index);
        //此处请求后台程序，下方是成功后的前台处理……
        var sendData = {
          zuHeSkuId: id
        };
        erp.load();
        erp.postFun('pojo/product/shanChuBianTiZuHe', JSON.stringify(sendData), function (data) {
          erp.closeLoad();
          if (data.data.statusCode == '200') {
            layer.msg('删除成功');
            //$('.groupZzc').hide();
            getGroupSkuList();
          } else {
            layer.msg('删除失败');
          }
        }, function () {
          erp.closeLoad();
        });
      });
    }
    if ($routeParams.skuflag == 'add') {
      $scope.combineSkuFlag = true;
    }
    $scope.ciSkuArr = [{
      sku: '',
      num: ''
    }]
    $scope.addCisku2 = function () {
      $scope.ciSkuArr.push({
        sku: '',
        num: ''
      });
    }
    $scope.removeCisku2 = function (index) {
      $scope.ciSkuArr.splice(index, 1);
    }
    $scope.isYanzheng = true;
    $scope.isDisabled = false;
    $scope.goCombineSku = function () {
      if (!$scope.zhuSKu) return layer.msg('主SKU不能为空');
      for (var x = 0; x < $scope.ciSkuArr.length; x++) {
        if (!$scope.ciSkuArr[x].sku) return layer.msg('次SKU不能为空')
        if (+$scope.ciSkuArr[x].num <= 0) return layer.msg('数量必须大于 0')
      }
      // {"jiuBianTiSku":"CJSJBHIP00107-Orange-Iphone 5 5s se","xinBianTiZuHe":{"CJJJJTJT00195-Frameless":1,"CJNSXZXX00091-Wine Red-3XL":1}}
      var xinBianTiZuHe = {};
      for (var i = 0; i < $scope.ciSkuArr.length; i++) {
        if ($scope.ciSkuArr[i].num && $scope.ciSkuArr[i].num * 1 > 0) {
          xinBianTiZuHe[$scope.ciSkuArr[i].sku] = $scope.ciSkuArr[i].num * 1;
        }
      }
      if (xinBianTiZuHe == {}) return;
      // xinBianTiZuHe = JSON.stringify(xinBianTiZuHe);
      var sendData = {
        jiuBianTiSku: $scope.zhuSKu,
        xinBianTiZuHe: xinBianTiZuHe
      }
      console.log(sendData);
      erp.load();
      erp.postFun('pojo/product/jiaoYanZuHe', JSON.stringify(sendData), function (data) {
        erp.closeLoad();
        // console.log(data);
        if (data.data.statusCode == '200') {
          var result = JSON.parse(data.data.result);
          console.log(result);
          $scope.istongguo = result.tongGuo;
          if (result.tongGuo == '0') {
            layer.msg('组合验证不通过');
            $scope.errMsg = '组合验证未通过，请检查重量'
            $scope.isYanzheng = true;
            $scope.isYanzhengSendData = '';

          } else if (result.tongGuo == '1') {
            layer.msg('组合验证通过');
            $scope.errMsg = '组合验证通过，可以提交';
            $scope.isYanzheng = false;
            $scope.isYanzhengSendData = sendData;
            $scope.isDisabled = true;
          }
          var list = result.list;
          $.each(list, function (i, v) {
            if (v.zu == '1') {
              $scope.zuWeight = '重量:' + v.packweight + ' g';
            } else if (v.zu == '0') {
              var sku = v.sku;
              var weight = v.packweight;
              $.each($scope.ciSkuArr, function (i, v) {
                var w = weight * v.num;
                var str = '重量:' + w + ' g';
                if (v.sku == sku) {
                  v.isweight = str;
                }
              })
              // $scope.$apply();
            }
          })
        } else {
          layer.msg(data.data.message);
        }
      }, function () {
        erp.closeLoad();
      })

    }
    $scope.gotoBackYanzheng = function () {
      $scope.isDisabled = false;
      $scope.isYanzheng = true;
    }
    $scope.gotoSureSKU = function () {
      console.log($scope.isYanzhengSendData);
      layer.load(2);
      erp.postFun('pojo/product/sheZhiBianTiZuHe', JSON.stringify($scope.isYanzhengSendData), function (data) {
        layer.closeAll('loading');
        console.log(data);
        layer.msg(data.data.message);
        if (data.data.statusCode == 200) {
          // $scope.zhuSKu = '';
          // $scope.ciSkuArr = [{ sku: '', num: '' }];
          $scope.errMsg = '';
          $scope.isDisabled = false;
          $scope.isYanzheng = true;
        }
      });
    }
  }]);
  //重复sku
  app.controller('skuRepeatListCtrl', ['$scope', '$window', '$location', '$routeParams', '$timeout', '$http', 'erp', function ($scope, $window, $location, $routeParams, $timeout, $http, erp) {
    console.log('skuRepeatListCtrl');
    $scope.searchInfo = '';
    $scope.pageSize = '20';
    $scope.pageNum = '1';

    getGroupSkuList();

    function getGroupSkuList() {
      var sendData = {
        pageSize: $scope.pageSize,
        pageNum: $scope.pageNum,
        inputStr: $scope.searchInfo
      };
      erp.load();
      erp.postFun('pojo/product/huoQuChongFuLieBiao', JSON.stringify(sendData), function (data) {
        erp.closeLoad();
        //console.log(data.data);
        if (data.data.statusCode == '200') {
          var result = JSON.parse(data.data.result);
          console.log(result);
          console.log(result.total)
          $scope.totalCounts = result.total;
          $scope.groupList = result.list;
          console.log($scope.groupList)
          pageFun();
        } else {
          layer.msg('查询失败');
        }
      }, function () {
        erp.closeLoad();
      })
    }

    function pageFun() {
      $(".pagegroup").jqPaginator({
        totalCounts: $scope.totalCounts || 1,
        pageSize: $scope.pageSize * 1,
        visiblePages: 5,
        currentPage: $scope.pageNum * 1,
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
          $scope.pageNum = n + '';
          getGroupSkuList();
        }
      });
    }

    //更换每页多少条数据
    $scope.pagesizechange = function (pagesize) {
      $scope.pageNum = '1';
      getGroupSkuList();
    };
    $('.search-inp').keypress(function (e) {
      if (e.keyCode == 13) {
        $scope.searchFun()
      }
    })
    //手动输入页码GO跳转
    $scope.pagenumchange = function () {
      var pagenum = Number($scope.pageNum);
      var totalpage = Math.ceil($scope.totalCounts / $scope.pageSize);
      if (pagenum > totalpage) {
        layer.msg('错误页码');
        $scope.pageNum = '1';
      } else {
        getGroupSkuList();
      }
    };
    $scope.searchFun = function () {
      $scope.pageNum = '1';
      getGroupSkuList();
    }

    $scope.editGroupSku = function (item) {
      console.log(item.xinBianTiZuHe);
      $scope.mainSku = item.jiuBianTiSku;
      var groupArr = item.xinBianTiZuHe;
      var newArr = [];
      $.each(groupArr, function (i, v) {
        var data = {
          xinBianTiZuHeShuLiang: v.xinBianTiZuHeShuLiang,
          xinBianTiZuHeSku: v.xinBianTiZuHeSku
        }
        newArr.push(data);
      });
      $scope.groupArr = newArr;
      $('.groupZzc').show();
    }
    $scope.addCisku = function () {
      var data = {
        xinBianTiZuHeShuLiang: 0,
        xinBianTiZuHeSku: ''
      };
      $scope.groupArr.push(data);
      //$scope.$apply();
    }
    $scope.removeCisku = function (index) {
      console.log(index);
      $scope.groupArr.splice(index, 1);
    }
    $scope.closeGroup = function () {
      $('.groupZzc').hide();
    }

    $scope.isYanzheng = true;
    $scope.isDisabled = false;

    $scope.submitGroupFun = function () {
      var oldSku = $scope.mainSku;
      if (!$scope.groupArr) {
        return;
      }
      var flag = false;
      var list = $scope.groupArr;
      var data = {};
      $.each(list, function (i, v) {
        if (v.xinBianTiZuHeShuLiang && v.xinBianTiZuHeShuLiang * 1 > 0 && v.xinBianTiZuHeSku && v.xinBianTiZuHeSku != '' && v.xinBianTiZuHeSku != null) {
          data[v.xinBianTiZuHeSku] = v.xinBianTiZuHeShuLiang;
        } else {
          flag = true;
        }
      });
      // console.log(data);
      if (flag) {
        layer.msg('次sku不能为空或者数量必须大于0')
      } else {
        var sendData = {
          jiuBianTiSku: oldSku,
          xinBianTiZuHe: data
        };
        console.log(sendData);
        erp.load();
        erp.postFun('pojo/product/jiaoYanZuHe', JSON.stringify(sendData), function (data) {
          erp.closeLoad();
          // console.log(data);
          if (data.data.statusCode == '200') {
            var result = JSON.parse(data.data.result);
            console.log(result);
            $scope.istongguo = result.tongGuo;
            if (result.tongGuo == '0') {
              layer.msg('组合验证不通过');
              $scope.errMsg = '组合验证未通过，请检查重量'
              $scope.isYanzheng = true;
              $scope.isYanzhengSendData = '';

            } else if (result.tongGuo == '1') {
              layer.msg('组合验证通过');
              $scope.errMsg = '组合验证通过，可以提交';
              $scope.isYanzheng = false;
              $scope.isYanzhengSendData = sendData;
              $scope.isDisabled = true;
            }
            var list = result.list;
            $.each(list, function (i, v) {
              if (v.zu == '1') {
                $scope.zuWeight = '重量:' + v.packweight + ' g';
              } else if (v.zu == '0') {
                var sku = v.sku;
                var weight = v.packweight;
                $.each($scope.groupArr, function (i, v) {
                  var w = weight * v.xinBianTiZuHeShuLiang;
                  var str = '重量:' + w + ' g';
                  if (v.xinBianTiZuHeSku == sku) {
                    v.isweight = str;
                  }
                })
                // $scope.$apply();
              }
            })
          } else {
            layer.msg(data.data.message);
          }
        }, function () {
          erp.closeLoad();
        })

      }
    }
    $scope.gotoBackYanzheng = function () {
      $scope.isDisabled = false;
      $scope.isYanzheng = true;
    }
    $scope.sureSubmitSkuFun = function () {
      erp.load();
      erp.postFun('pojo/product/sheZhiBianTiZuHe', JSON.stringify($scope.isYanzhengSendData), function (data) {
        erp.closeLoad();
        console.log(data.data);
        if (data.data.statusCode == '200') {
          layer.msg('修改成功');
          $('.groupZzc').hide();
          $scope.errMsg = '';
          $scope.isDisabled = false;
          $scope.isYanzheng = true;
          getGroupSkuList();
        } else {
          layer.msg('修改失败')
        }
      }, function () {
        erp.closeLoad();
      })
    }


    $scope.deleteFun = function (id) {

      layer.confirm('确认要删除吗？', {
        btn: ['确定', '取消']//按钮
      }, function (index) {
        layer.close(index);
        //此处请求后台程序，下方是成功后的前台处理……
        var sendData = {
          zuHeSkuId: id
        };
        erp.load();
        erp.postFun('pojo/product/shanChuBianTiZuHe', JSON.stringify(sendData), function (data) {
          erp.closeLoad();
          if (data.data.statusCode == '200') {
            layer.msg('删除成功');
            //$('.groupZzc').hide();
            getGroupSkuList();
          } else {
            layer.msg('删除失败');
          }
        }, function () {
          erp.closeLoad();
        });
      });
    }
  }]);
  //修改过变体价格的列表
  app.controller('skuChangePriceCtrl', ['$scope', '$window', '$location', '$routeParams', '$timeout', '$http', 'erp', function ($scope, $window, $location, $routeParams, $timeout, $http, erp) {
    console.log('skuChangePriceCtrl');
    var bs = new Base64();
    var erpLoginName = bs.decode(localStorage.getItem('erploginName') == undefined ? '' : localStorage.getItem('erploginName'));
    if (erpLoginName=='admin') {
      $scope.adminFlag = true;
    } else {
      $scope.adminFlag = false;
    }
    let topHeight = $('.skuGroupTop').height();
    console.log(topHeight)
    $('.right-bar').css('margin-top',topHeight+15);
    $scope.searchInfo = '';
    $scope.pageSize = '20';
    $scope.pageNum = '1';

    getGroupSkuList();

    function getGroupSkuList() {
      var sendData = {
        pageSize: $scope.pageSize,
        pageNum: $scope.pageNum,
        inputStr: $scope.searchInfo
      };
      erp.load();
      erp.postFun('pojo/product/gaiJiaList', JSON.stringify(sendData), function (data) {
        erp.closeLoad();
        //console.log(data.data);
        if (data.data.statusCode == '200') {
          var result = JSON.parse(data.data.result);
          console.log(result);
          console.log(result.total)
          $scope.totalCounts = result.total;
          $scope.groupList = result.list;
          console.log($scope.groupList)
          pageFun();
        } else {
          layer.msg('查询失败');
        }
      }, function () {
        erp.closeLoad();
      })
    }

    function pageFun() {
      $(".pagegroup").jqPaginator({
        totalCounts: $scope.totalCounts || 1,
        pageSize: $scope.pageSize * 1,
        visiblePages: 5,
        currentPage: $scope.pageNum * 1,
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
          $scope.pageNum = n + '';
          getGroupSkuList();
        }
      });
    }

    //更换每页多少条数据
    $scope.pagesizechange = function (pagesize) {
      $scope.pageNum = '1';
      getGroupSkuList();
    };
    $('.search-inp').keypress(function (e) {
      if (e.keyCode == 13) {
        $scope.searchFun()
      }
    })
    //手动输入页码GO跳转
    $scope.pagenumchange = function () {
      var pagenum = Number($scope.pageNum);
      var totalpage = Math.ceil($scope.totalCounts / $scope.pageSize);
      if (pagenum > totalpage) {
        layer.msg('错误页码');
        $scope.pageNum = '1';
      } else {
        getGroupSkuList();
      }
    };
    $scope.searchFun = function () {
      $scope.pageNum = '1';
      getGroupSkuList();
    }

    $scope.delBtSkuFun = function (item) {
      $scope.itemId = item.id;
      $scope.isDelFlag = true;
    }
    $scope.sureDelBtFun = function(){
      erp.postFun('pojo/product/shanChuGaiJia',{"id":$scope.itemId},function(data){
        console.log(data)
        if(data.data.statusCode==200){
          $scope.isDelFlag = false;
          layer.msg('删除成功')
          getGroupSkuList();
        }else{
          layer.msg('删除失败')
        }
      },function(data){
        console.log(data)
      },{layer:true})
    }
    $scope.editPriceFun = function(item){
      $scope.itemId = item.id;
      $scope.btId = item.stanproductId;
      $scope.editPriceFlag = true;
    }
    $scope.sureEditFun = function(){
      console.log($scope.newPrice)
      if(!$scope.newPrice){
        layer.msg('请输入价格')
        return
      }
      erp.postFun('pojo/product/gaiJia',{
        "stanproductId":$scope.btId,
        "price":$scope.newPrice,
        "id":$scope.itemId
      },function(data){
        console.log(data)
        if(data.data.statusCode==200){
          $scope.editPriceFlag = false;
          layer.msg('修改成功')
          $scope.newPrice = '';
          getGroupSkuList();
        }else{
          layer.msg('修改失败')
        }
      },function(data){
        console.log(data)
      },{layer:true})
    }
    $scope.isNumFun = function(){
      $scope.newPrice = $scope.newPrice.replace(/[^\d.]/g,'')
      $scope.newPrice = $scope.newPrice.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
      $scope.newPrice = $scope.newPrice.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
    }
  }]);
  
})();

