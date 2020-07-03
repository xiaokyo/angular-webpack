(function(angular) {
  angular.module('manage').component('productDetailGraph', {
    templateUrl:
      'static/components/product-detail-graph/product-detail-graph.html',
    controller: productDetailGraphCtrl,
    bindings: {
      productid: '<',
      vid: '<'
    }
  });
  function productDetailGraphCtrl($scope, erp) {
    const url = {
      getProcurementCycle: 'product/procurement/getProcurementCycle', // 到货时间
      productPv:'product/selectProductPV', // 商品访问量
      shopStatistics: 'product/published/statistics/statistics', // 刊登&关联
      getLocConsiderInfo: 'product/consider/getLocConsiderInfo', // 销量排行
      getCountryRanking: 'product/consider/getCountryRanking' // 商品国家排行
    };
    // ======  销售  =======
    let saleChart = echarts.init(document.getElementById('echartBar'));
    $scope.saleOrPv = 'sale';
    $scope.salesType = -1; // 销售排行类型
    $scope.saleStartDate = '';
    $scope.saleEndDate = '';
    $scope.saleCountryRankList = {};
    // $scope.$watch('salesType', getProductRank);
    $scope.$watch('saleStartDate+saleEndDate', function() {
      if (!$scope.saleStartDate || !$scope.saleEndDate) return;
      $scope.salesType = 0;
      const times = {
        startTime: `${$scope.saleStartDate} 00:00:00`,
        endTime: `${$scope.saleEndDate} 00:00:00`
      };
      getProductRank(times);
    });
    $scope.$watch('saleOrPv', function () {
      console.log($scope.saleOrPv)
      if ($scope.saleOrPv === 'sale') {
        $scope.salesType = -1;
      } else {
        $scope.salesType = 7;
      }
      setTimeout(() => {
        saleChart.resize();
      });
      $scope.changeSaleDateType();
    })
    $scope.changeSaleDateType= function (type = $scope.salesType) {
      $scope.salesType = type;
      if ($scope.saleOrPv === 'sale') {
        getProductRank();
      } else {
        // 访问量
        console.log(type)
        $scope.endTime = moment().format('YYYY-MM-DD');
        $scope.startTime = moment(
          new Date() - moment.duration(type, 'days').valueOf()
        ).format('YYYY-MM-DD');
        getProductRank({
          startTime: $scope.startTime,
          endTime: $scope.endTime
        });
      }
    }


    // ======== 刊登&关联  =============
    $scope.publishType = 0;
    // 缓存源数据
    $scope._source_publish_list = [];
    $scope.publishList = [];

    $scope.publishCount = 0;
    $scope.relatedCount = 0;
    $scope.publishPage = 1;
    $scope.$watch('publishType', getStatistics);
    $scope.changePublishPage = function (page) {
      $scope.publishPage = page;
      if (page === 1) {
        $scope.publishList = $scope._source_publish_list.slice(0, 6);
      } else {
        $scope.publishList = $scope._source_publish_list.slice(6)
      }
    }

    // 限售额&访问量
    function renderSale(keys = [], values = []) {
      // 初始化 限售额&访问量
      var echartBarOption = {
        title: {
          text: $scope.saleOrPv === 'sale' ? '销售量趋势' : '访问量趋势',
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {},
        // legend: {
        //     data:['Sales']
        // },
        // grid: {
        //   left: '30',
        //   right: '30'
        // },
        color: '#1890FF',
        xAxis: {
          type: 'category',
          data: keys
        },
        yAxis: {
          type: 'value',
          minInterval:1
        },
        series: [
          {
            data: values,
            type: 'line'
          }
        ]
      };
      console.log(echartBarOption);
      saleChart.setOption(echartBarOption);
    }
    renderSale();

    // ========  饼图分析 -- 到货时间 ============
    var echartPie = echarts.init(document.getElementById('echartPie'));
    $scope.pieStartTime = ''; // pie startTime
    $scope.pieEndTime = ''; // pie endTime
    function renderPie(_data=[]) {
      // 设置echart数据

      var formatterLegend = function(name) {
        // 自定义legend
        var result = '';
        for (var i = 0; i < _data.length; i++) {
          var item = _data[i];
          if (name == item.days + '天') {
            result =
              name+ '    ' + item.accounted + '%    ' + item.number + '次';
            break;
          }
        }
        return result;
      };

      var getData = function(list) {
        // 从接口返回封装饼图数据data
        var result = [];
        if (list.length == 0 || list instanceof Array == 'false')
          return [{ value: '0', name: '无' }];
        list.forEach(function(item,index) {
          result.push({
            name: item.days + '天',
            value: item.number
          });
        });
        return result;
      };

      var option = {
        title: {
          text: '时间轴',
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}次 ({d}%)'
        },
        color: [
          '#8543E0',
          '#1890FF',
          '#F04864',
          '#FACC14',
          '#2FC25B',
          '#13C2C2'
        ],
        legend: {
          orient: 'vertical',
          x: 'right',
          y: 'center',
          align:'left',
          icon: 'circle',
          itemGap:25,
          itemHeight:10,
          formatter: formatterLegend
        },
        series: [
          {
            name: '到货时间',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['30%', 'center'],
            avoidLabelOverlap: false,
            // selectedMode: 'single',
            label: {
              normal: {
                show: false,
                position: 'center',
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: getData(_data)
          }
        ]
      };
      echartPie.setOption(option);
      setTimeout(function(){
        echartPie.resize()

        var PieIndex = 0
        echartPie.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: 0
        })
        echartPie.on("mouseover", function(e) {
          if (e.dataIndex != PieIndex) {
            echartPie.dispatchAction({
              type: "downplay",
              seriesIndex: 0,
              dataIndex: PieIndex
            });
          }
        });
        echartPie.on("mouseout", function(e) {
          PieIndex = e.dataIndex;
          echartPie.dispatchAction({
            type: "highlight",
            seriesIndex: 0,
            dataIndex: e.dataIndex
          });
        });
      })
    };

    window.onresize = function(){
      console.log('尺寸变化')
      echartPie.resize()
      saleChart.resize()
    }

    $scope.$watch('pieStartTime+pieEndTime', function() {
      // pieTime watch
      if (!$scope.pieStartTime || !$scope.pieEndTime) return false;
      
      const times = {
        startTime: $scope.pieStartTime,
        endTime: $scope.pieEndTime
      }
      console.log(
        'pieStartTime+pieEndTime',
        times
      );
      getProcurementCycle(times);
    });
    renderPie()

    // 获取 到货时间 数据
    function getProcurementCycle(times = {}) {
      const params = Object.assign({
        pid: $scope.pid,
        vid: $scope.vid
      }, times);

      console.log(params);
      layer.load(2)
      erp.postFun(url.getProcurementCycle, JSON.stringify(params), function(
        data
      ) {
        layer.closeAll('loading')
        if (data.data.code != 200) return layer.msg('服务器打盹了,请稍后再试');
        var list = data.data.data;
        console.log('饼图分析', list);
        renderPie(list);
      });
    }

    // 获取 刊登&关联次数 数据
    function getStatistics() {
      console.log($scope.pid);
      const params = {
        pid: $scope.pid,
        vid: $scope.vid,
        dateType: $scope.publishType
      };
      layer.load(2)
      erp.postFun(url.shopStatistics, JSON.stringify(params), ({ data }) => {
        layer.closeAll('loading')
        if (data.code !== 200) return layer.msg('请求失败');
        $scope._source_publish_list = data.data.map((o, i) => ({ ...o, rank: i + 1 }));
        console.log('刊登列表',$scope._source_publish_list);
        const count = $scope._source_publish_list.reduce(
          (pre, cur) => {
            const published = pre[0] + cur.publishedNumber;
            const related = pre[1] + cur.relatedNumber;
            return [published, related];
          },
          [0, 0]
        );
        $scope.publishCount = count[0];
        $scope.relatedCount = count[1];

        if ($scope._source_publish_list.length < 6) {
          $scope.publishList = $scope._source_publish_list
        } else {
          $scope.changePublishPage(1)
        }
      });
    }

    // 获取 商品销量排行 ；默认时间范围不传
    function getProductRank(times = {}) {
      if (!$scope.pid) return;
      const params = Object.assign({
        pid: $scope.pid,
        vid: $scope.vid,
        type: $scope.salesType,
      }, times);
      layer.load(2)
      erp.postFun(
        $scope.saleOrPv === 'sale' ?  url.getLocConsiderInfo : url.productPv,
        JSON.stringify(params),
        ({ data }) => {
          layer.closeAll('loading')
          if (data.code !== 200) return layer.msg('请求失败');
          const keys = Object.keys(data.data);
          const values = Object.values(data.data);
          renderSale(keys, values);
        }
      );
      if ($scope.saleOrPv === 'pv') return;
      // 国家排行
      erp.postFun(url.getCountryRanking, JSON.stringify(params), function({
        data
      }) {
        if (data.code !== 200) return layer.msg('请求失败');
        $scope.saleCountryRankList = data.data;
      });
    }

    // 参数变化后请求数据
    this.$onChanges = () => {
      if (!this.productid) return;
      $scope.pid = this.productid;
      $scope.vid = this.vid;
      console.log($scope.pid, $scope.vid);
      getStatistics();
      getProductRank();
      getProcurementCycle();
    };
  }
})(angular);
