(function() {
  var app = angular.module('activites-data-view', ['service']);
  app.controller('activityStatisticsNewCtrl', [
    '$scope',
    '$http',
    'erp',
    'merchan',
    'utils',
    function($scope, $http, erp, merchan, utils) {
      // 默认数据
      $scope.tableHeader = [
        { name: '点击量', ascKey: '点击量 asc', descKey: '点击量 desc' },
        { name: '收藏量', ascKey: '收藏量 asc', descKey: '收藏量 desc' },
        { name: '刊登量', ascKey: '刊登量 asc', descKey: '刊登量 desc' },
        { name: '关联', ascKey: '关联 asc', descKey: '关联 desc' },
        { name: '添加SKU', ascKey: '添加SKU asc', descKey: '添加SKU desc' },
        {
          name: '添加购物车',
          ascKey: '添加购物车 asc',
          descKey: '添加购物车 desc'
        },
        { name: '购买', ascKey: '购买 asc', descKey: '购买 desc' },
        { name: '纠纷', ascKey: '纠纷 asc', descKey: '纠纷 desc' }
      ]; // table 部分表头 升降序
      $scope.sortActive = ''; // 选中排序

      $scope.productData = []; // 列表数据
      $scope.activityData = ''; // 活动数据
      $scope.activityName = ''; // 活动名称
      $scope.tabActive = '1'; // 日期tab当前选中
      $scope.productName = ''; // 商品名称
      $scope.productSku = ''; // 商品SKU
      $scope.pageNum = 1; // 当前页
      $scope.pageSize = 20; // 每页多少条

      $scope.showTrend =false

      $scope.startTime = utils.changeTime(
        new Date().setTime(new Date().getTime() - 24 *7* 60 * 60 * 1000)
      );
      $scope.endTime = utils.changeTime(
        new Date().setTime(new Date().getTime())
      );


      $scope.optData={ //选择数据
        click:true,
        publish:true,
        orders:true
      }
      $scope.optDataOri={ //操作数据
        click:true,
        publish:true,
        orders:true
      }
      // 获取活动数据
      function getActivityData() {
        erp.postFun(
          'cj/activity/getActivityNameV1',
          {},
          res => {
            const {
              data: { result, statusCode }
            } = res;
            if (statusCode === '200') {
              $scope.activityData = result;
            }
          },
          error => {
            console.log(error);
          }
        );
      }

      getActivityData();

      // 获取列表数据
      function getList() {
        const parmas = {
          beginDate: $scope.startTime,
          endDate: $scope.endTime,
          pageNum: Number($scope.pageNum),
          pageSize: Number($scope.pageSize),
          activityName: $scope.activityName,
          sku: $scope.productSku,
          productNameEn: $scope.productName,
          orderBy: $scope.sortActive
        };
        erp.postFun(
          'cj/activity/reportActivityProductSum',
          parmas,
          res => {
            if (res.data.statusCode === '200') {
              $scope.productData = res.data.result.rows || []; // 列表数据
              $scope.totalNum = res.data.result.total;
              const totalNum = Math.ceil(
                Number($scope.totalNum) / Number($scope.pageSize)
              );
              $scope.$broadcast('page-data', {
                pageSize: $scope.pageSize.toString(),
                pageNum: $scope.pageNum,
                totalNum: totalNum,
                totalCounts: $scope.totalNum,
                pageList: ['20', '50', '100']
              });
            }
          },
          error => {
            console.log(error);
          },
          { layer: true }
        );
      }
      getList();
      // 排序
      $scope.handleSort = key => {
        $scope.sortActive = key;
        $scope.pageNum = 1;
        getList();
      };

      // 查询
      $scope.hadelSearch = () => {
        $scope.pageNum = 1;
        $scope.startTime = $('#date1').val();
				$scope.endTime = $('#date2').val();
        $scope.graphIsShow = false;
        $scope.count = {
          click: 0, // 点击总量
          mark:0,//收藏量
          publish: 0, // 刊登总量
          relevance: 0, // 关联总数
          addSkuList:0,//添加sku
          addCate:0,//添加购物车
          orders: 0, // 购买总数
          dispute:0//纠纷
        };
        getList();
        getGraphData();
      };

      // 导出数据
      $scope.hadelExprot = () => {
        const parmas = {
          beginDate: $scope.startTime,
          endDate: $scope.endTime,
          activityName: $scope.activityName,
          sku: $scope.productSku,
          productNameEn: $scope.productName,
          orderBy: $scope.sortActive
        };
        erp.postFun(
          'cj/activity/reportActivityProductSumExport',
          parmas,
          res => {
            console.log(res);
            if (res.data.statusCode === '200') {
              window.open(res.data.result);
            }
          },
          error => {
            console.log(error);
          },
          { layer: true }
        );
      };
      //活动数据
      $scope.count = {
        click: 0, // 点击总量
        mark:0,//收藏量
        publish: 0, // 刊登总量
        relevance: 0, // 关联总数
        addSkuList:0,//添加sku
        addCate:0,//添加购物车
        orders: 0, // 购买总数
        dispute:0//纠纷
      };
      const colorLine={
        '点击量':'#F6BD16', 
        '收藏量':'#E8684A',
        '刊登量':'#5B8FF9',
        '关联量':'#5AD8A6',
        '添加SKU':'#5D7092',
        '添加购物车':'#6DC8EC',
        '购买':'#9270CA',
        '纠纷':'#FF9D4D'
      }
      const nameSwitch={
        '点击量':'click', 
        '收藏量':'mark',
        '刊登量':'publish',
        '关联量':'relevance',
        '添加SKU':'addSkuList',
        '添加购物车':'addCate',
        '购买':'orders',
        '纠纷':'dispute'
      }
      function getGraphData() {
        console.log($scope.activityName)
        if (!$scope.activityName) return;
				const parmas = {
          activityName: $scope.activityName,
          beginDate: $scope.startTime,
          endDate: $scope.endTime
				};

				console.log('graph params:', parmas);
        erp.postFun(
          'cj/activity/activityStatistics',
          parmas,
          res => {
            const { result, statusCode} = res.data
            if (statusCode === '200') {
							if (result.length > 0) {
                result.forEach(item => {
                  $scope.count.click += item.click || 0
                  $scope.count.mark += item.mark || 0
                  $scope.count.publish += item.publish || 0
                  $scope.count.relevance += item.relevance || 0
                  $scope.count.addSkuList += item.addSkuList || 0
                  $scope.count.addCate += item.addCate || 0
                  $scope.count.orders += item.orders || 0
                  $scope.count.dispute += item.dispute || 0
                });
                $scope.count.publishLV=Math.round($scope.count.publish/$scope.count.click * 10000) / 100.00
                $scope.count.relevanceLV=Math.round($scope.count.relevance/$scope.count.click * 10000) / 100.00
                $scope.count.addSkuListLV=Math.round($scope.count.addSkuList/$scope.count.click * 10000) / 100.00
              }
              $scope.result=result
              console.log(result)
              getG2map()
            }
          },
          error => {
            console.log(error);
          },
          { layer: true }
        );
      };
      // 图表相关
      function getG2map(){
        if($scope.result.length==0){
          $scope.showTrend = false
        }else{
          $scope.showTrend = true
        }
        const data=[]
        const data2=[]
        $scope.result.forEach(item=>{
          const date=item.date
          const keys=Object.keys(item)
          const values=Object.values(item)
          const arr=[]
          keys.forEach((it,idx)=>{
            let type=""
            for(const k in nameSwitch){
              if(it==nameSwitch[k]){
                type=k
              }
            }
            if(it!='date'){
              const list={
                type,
                value:values[idx],
                date,
                stype:it
              }
              arr.push(list)
            }
          })
          data2.push(...arr)
        })
        console.log(data2)
        const usegro=[]
        for(const k in $scope.optDataOri){
          if($scope.optDataOri[k]){
            usegro.push(k)
          }
        }
        data2.forEach(item=>{
          usegro.forEach(it=>{
            if(item.stype==it){
              data.push(item);
            }
          })
        })
        if(!$scope.linePlot){
          $scope.linePlot = new window.G2Plot.Line(document.getElementById('container'), {
            padding: 'auto',
            forceFit: true,
            data,
            xField: 'date',
            yField: 'value',
            legend: {
              position: 'bottom-center',
              marker:'square'
            },
            tooltip:{
              "g2-tooltip":{
                backgroundColor:'rgba(0,0,0,0.75)',
                color:'#fff',
              }           
            },
            color: (d) => {
              for(const k in colorLine){
                if(k===d){
                  return colorLine[k]
                }
              }
            },
            seriesField: 'type',
            responsive: true,
          });
          
          $scope.linePlot.render();
        }else{
          $scope.linePlot.changeData(data);
        }
      }
      // 分页
      $scope.$on('pagedata-fa', function(d, data) {
        $scope.pageNum = data.pageNum;
        $scope.pageSize = data.pageSize;
        getList();
      });

      $(".mot span").hover(function(){
        $(this).parents(".sbox").find(".sm").show()
      },function(){
        $(this).parents(".sbox").find(".sm").hide()
      })

      $scope.confirmOpts = function(){
        $scope.selectOptFlag = false
        $scope.optDataOri = JSON.parse(JSON.stringify($scope.optData))
        console.log($scope.optDataOri)
        getG2map()
      }
      $scope.cancelOpts = function(){
        $scope.selectOptFlag = false
        $scope.optData = JSON.parse(JSON.stringify($scope.optDataOri))
      }
      
    }
  ]);
})();
