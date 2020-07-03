(function () {
	var app = angular.module('analysis');
/*成交额*/
    app.controller('TurnoverCtrl', ['$scope', '$window', '$location', '$routeParams', '$timeout', '$http', 'erp', 'merchan', '$sce', function ($scope, $window, $location, $routeParams, $timeout, $http, erp, merchan, $sce) {
        console.log('TurnoverCtrl')
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
        $scope.RankingFilter4 = [
				{'name': '一天', flag: true, type: '1'},
				{'name': '近三天', flag: true, type: '3'},
        {'name': '近七天', flag: false, type: '7'},
				{'name': '十五天', flag: false, type: '15'},
				{'name': '近一个月', flag: false, type: '30'},
				{'name': '近一季度', flag: false, type: '90'},
				{'name': '近一年', flag: false, type: '360'},
				{ name: "自定义", flag: false, type: 'custom' }
        ]
        $scope.RankingFilter5 = [
        {'name': '一天', flag: true, type: '1'},
        {'name': '七天', flag: false, type: '7'},
        {'name': '十五天', flag: false, type: '15'},
				]
				const exportModal = {
					danpinjine: { key: 'P1', name: '单品成交金额排行' },
					danpinshuliang: { key: 'P2', name: '单品成交数量排行' },
					remensousuo: { key: 'P3', name: '热门搜索排行' },
					remenshangpin: { key: 'P4', name: '热门商品排行' },
					kedanjia: { key: 'P5', name: '客单价排行' },
				}

        $scope.RankingData1 = []
        $scope.RankingData2 = []
        $scope.RankingData3 = []
        $scope.RankingData4 = []
        $scope.RankingData5 = []
        $scope.dateType1 = '1';
        $scope.dateType2 = '1';
        $scope.dateType3 = '1';
        $scope.dateType4 = '1';
        $scope.dateType5 = '1';
        $scope.pageNum1 = 1;
        $scope.pageSize1 = '5';
        $scope.TotalNum1 = null;
        $scope.pageNum2 = 1;
        $scope.pageSize2 = '5';
        $scope.TotalNum2 = null;
        $scope.pageNum3 = 1;
        $scope.pageSize3 = '5';
        $scope.TotalNum3 = null;
        $scope.pageNum4 = 1;
        $scope.pageSize4 = '5';
        $scope.TotalNum4 = null;
        $scope.pageNum5 = 1;
        $scope.pageSize5 = '5';
        $scope.TotalNum5 = null;

        $scope.keywords = ''
        // 日期(获取前几天)
        function fun_date(d){
        var date1 = new Date(),
        time1=date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();//time1表示当前时间
        var date2 = new Date(date1);
        date2.setDate(date1.getDate()+d);
        var time2 = date2.getFullYear()+"-"+(date2.getMonth()+1)+"-"+date2.getDate();
        return time2
    }
        //获取系统当前时间
        var nowTime = new Date();
        var y = nowTime.getFullYear();
        var m = nowTime.getMonth()+1;
        var d = nowTime.getDate();
        var formatNowDate = y+'-'+m+'-'+d;
        //获取系统前一周的时间
        var oneWeekDate = new Date(nowTime-7*24*3600*1000);
        var y = oneWeekDate.getFullYear();
        var m = oneWeekDate.getMonth()+1;
        var d = oneWeekDate.getDate();
        var formatWDate = y+'-'+m+'-'+d;
        //获取系统前一个月的时间
        nowTime.setMonth(nowTime.getMonth()-1);
        var y = nowTime.getFullYear();
        var m = nowTime.getMonth()+1;
        var d = nowTime.getDate();
        var formatMDate = y+'-'+m+'-'+d;
        $scope.startTime = fun_date(-1);
        $scope.endTime = formatNowDate;

				/** 2020-04-11 时间删选组件 */
				$scope.$on('search-by-turnover', (_, res) => {
					const { id, item } = res
					switch(id) {
						case 'oneProductRanking':
							$scope.Profilter1(item)
							break
						case 'oneCountRanking':
							$scope.Profilter2(item)
							break
						case 'hotSearch':
						  $scope.Profilter4(item)
							break;
						case 'hotProduct':
							$scope.Profilter5(item)
							break
						case 'keOnePrice':
							$scope.Profilter3(item)
							break
					}
				})
				//导出
				$scope.exportFn = (type) => {
          let params = { type } 
          let noDataFlag = false
					switch (type) {
						case 'danpinjine':
              params = Object.assign(params, { startTime: $scope.startTime1, endTime: $scope.endTime1, orderBy: "productMoney" })
              noDataFlag = $scope.RankingData1.length > 0
							break
						case 'danpinshuliang':
              params = Object.assign(params, { startTime: $scope.startTime2, endTime: $scope.endTime2,  orderBy: "productCount" })
              noDataFlag = $scope.RankingData2.length > 0
							break
						case 'remensousuo':
              params = Object.assign(params, { startTime: $scope.startTime4, endTime: $scope.endTime4 })
              noDataFlag = $scope.RankingData4.length > 0
							break
						case 'remenshangpin':
              params = Object.assign(params, { startTime: $scope.startTime5, endTime: $scope.endTime5 })
              noDataFlag = $scope.RankingData5.length > 0
							break
						case 'kedanjia':
              params = Object.assign(params, { startTime: $scope.startTime3, endTime: $scope.endTime3 })
              noDataFlag = $scope.RankingData3.length > 0
							break
					}
					const isBig90 = disposeExportTime(params.startTime, params.endTime)
          console.log(isBig90)
          if(!noDataFlag) {
            layer.msg('暂时没有可以导出的数据')
            return
          }
					isBig90 ? layer.msg('导出时间间隔不能超出90天') : $scope.export(params)
				}

				function disposeExportTime(startTime, endTime) {
					console.log(startTime, endTime)
					const start = new Date(startTime).getTime()
					const end = new Date(endTime).getTime()
					return end - start > 90*24*3600*1000
				}

        //排行数据1
        function getRanking1() {
					$scope.productRankType = 'productMoney'
					$scope.startTime1 = $scope.startTime
					$scope.endTime1 = $scope.endTime
					const params = {
						pageNum: +$scope.pageNum1,
            pageSize: +$scope.pageSize1,
						startTime: $scope.startTime,
						endTime: $scope.endTime,
						orderBy: 'productMoney'
					}
					getProductNumListFn(params)
        }

        getRanking1();

        //排行数据2
        function getRanking2() {
					$scope.productRankType = 'productCount'
					$scope.startTime2 = $scope.startTime
					$scope.endTime2 = $scope.endTime
					const params = {
						pageNum: +$scope.pageNum2,
            pageSize: +$scope.pageSize2,
						startTime: $scope.startTime,
						endTime: $scope.endTime,
						orderBy: 'productCount'
					}
					getProductNumListFn(params)

        }

				getRanking2();
				
				function getProductNumListFn(params) {
          layer.load(2);
          erp.postFun("erp/productpoint/statisProductSale", params, ({data, status}) => {
						layer.closeAll("loading")
						if(status  === 200 ) {
							console.log('result =>', data)
							if ($scope.productRankType === 'productMoney') {
								$scope.TotalNum1 = data.count;
								$scope.RankingData1 = data.list;
								pageFun1();
							} else if ($scope.productRankType === 'productCount') {
								$scope.TotalNum2 = data.count;
								$scope.RankingData2 = data.list;
								pageFun2();
							}
						
						}
					}, function (err) {
            layer.msg('服务器错误')
          });
				}

        //排行数据3
        function getRanking3() {
          var data = {
            pageNum: $scope.pageNum3.toString(),
            pageSize: $scope.pageSize3,
						startTime: $scope.startTime,
						endTime: $scope.endTime
					};
					$scope.startTime3 = $scope.startTime
					$scope.endTime3 = $scope.endTime
          layer.load(2);
          erp.postFun("erp/disputeInfo/getCustomerPriceList", data, function (res) {
            layer.closeAll("loading");
            if (res.data.statusCode == 200) {
            $scope.TotalNum3 = res.data.result.count;
            $scope.RankingData3 = res.data.result.customerList;
            pageFun3();
            }
          }, function (err) {
            layer.msg('服务器错误')
          });
        }

        getRanking3();

        // 热门搜索
        function getRanking4() {
					if($scope.dateType4 === '1'){
            $scope.startTime = fun_date(-7);
          }
          var data = {
            pageNum: $scope.pageNum4.toString(),
            pageSize: $scope.pageSize4,
					};
					data = Object.assign(data, $scope.dateType4 === 'custom' 
						? { startTime: $scope.startTime, endTime: $scope.endTime }
						: { days: $scope.dateType4 })
					
					$scope.startTime4 = $scope.dateType4 === 'custom' ? $scope.startTime : fun_date(+$scope.dateType4 * -1)
					$scope.endTime4 = $scope.endTime
          layer.load(2);
          erp.postFun("erp/keywordsSearch/getDaysGroupInfo", data, function (res) {
            console.log(res);
            layer.closeAll("loading");
            if (res.data.statusCode == 200) {
            $scope.TotalNum4 = res.data.result.total;
            $scope.RankingData4 = res.data.result.rows;
            // keywords
            if($scope.RankingData4){
                for(i=0;i<$scope.RankingData4.length;i++){
                $scope.keywords =  $scope.RankingData4[0].keywords
                }
            }
            pageFun4();
            console.log($scope.keywords)
            $scope.RankingData4.length > 0 && remenSearchChart()
            }
          }, function (err) {
            layer.msg('服务器错误')
          });
        }

        getRanking4();

        // 热门商品
        function getRanking5() {
					if($scope.dateType5 === '1'){
            $scope.startTime = fun_date(-3);
          }else if($scope.dateType5=='7'){
            $scope.startTime = formatWDate;
          }else if($scope.dateType5=='15'){
            $scope.startTime = formatMDate;
          }
          var data = {
            pageNum: $scope.pageNum5.toString(),
            pageSize: $scope.pageSize5,
            // days: $scope.dateType5
					};
					data = Object.assign(data, $scope.dateType5 === 'custom' 
					  ? { startTime: $scope.startTime, endTime: $scope.endTime }
						: { days: $scope.dateType5 })
					
					$scope.startTime5 = $scope.dateType5 === 'custom' ? $scope.startTime : fun_date(+$scope.dateType5 * -1)
					$scope.endTime5 = $scope.endTime
          layer.load(2);
          erp.postFun("erp/xiaoLiang/getDaysGroupInfo", data, function (res) {
            console.log(res)
            layer.closeAll("loading");
            if (res.data.statusCode == 200) {
            $scope.TotalNum5 = res.data.result.total;
            $scope.RankingData5 = res.data.result.rows;
            if($scope.RankingData5){
                for(i=0;i<$scope.RankingData5.length;i++){
	                $scope.product_id = $scope.RankingData5[0].product_id
	                $scope.skus = $scope.RankingData5[0].sku
                }
            }
            $scope.RankingData5.length > 0 && remenShopChart()
            pageFun5();
            }
          }, function (err) {
            layer.msg('服务器错误')
          });
        }

        getRanking5();

        //单品成交金额排行筛选
        $scope.Profilter1 = function (item) {
          $scope.dateType1 = item.type || '1';
					$scope.pageNum1 = 1;
					disposeSelectTime(item)
          getRanking1();
        }
        //单品成交数量排行筛选
        $scope.Profilter2 = function (item) {
          $scope.dateType2 = item.type;
					$scope.pageNum2 = 1;
					disposeSelectTime(item)
          getRanking2();
        };
        //客单价排行筛选
        $scope.Profilter3 = function (item) {
          $scope.dateType3 = item.type;
				  $scope.pageNum3 = '1';
				  disposeSelectTime(item)
          getRanking3();
        };
        // 热门搜索
        $scope.Profilter4 = function (item) {
          $scope.dateType4 = item.type;
					$scope.pageNum4 = 1;
					disposeSelectTime(item)
          getRanking4();
        };
        // 热门商品
        $scope.Profilter5 = function (item) {
          $scope.dateType5 = item.type;
				  $scope.pageNum5 = 1;
				  disposeSelectTime(item)
          getRanking5();
				};
				
				//对时间筛选组件自定义时间进行处理
				function disposeSelectTime (item) {
					if (item.type === 'custom') {
						$scope.startTime = item.startTime
						$scope.endTime = item.endTime
					} else {
						$scope.startTime = fun_date(+item.type * -1);
					  $scope.endTime = formatNowDate;
					}
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
        //商品详情
        $scope.RankinglookPro = function (item, ev) {
        console.log(ev)
        $("body").css("overflow", "hidden");
        $('body').bind("touchmove", function (e) {
            e.preventDefault();
        });
        $scope.isLook = true;
        var data = {
            orderId: item.cjOrderId
        }
        layer.load(2);
        erp.postFun("erp/disputeInfo/getCustomerPriceDetail", data, function (res) {
            layer.closeAll("loading");
            if (res.data.statusCode == 200) {
            $scope.ProDetail = res.data.result.productList;
            $scope.sumPrice = res.data.result.sumPrice;
            $scope.sumPrice = res.data.result.sumPrice;
            $scope.PaidPrice = item.copeMoney;
            //$scope.RankingData3 = res.data.result;
            }
        }, function (err) {
            layer.msg('服务器错误')
        });
        }
        $scope.lookProclose = function () {
        $("body").unbind("touchmove");
        $("body").css("overflow", "auto");
        $scope.isLook = false;
        };
        //查看商品
        $scope.lookPro = function (id) {
            window.open('manage.html#/merchandise/show-detail/' + id + '/' + '0' + '/' + '3' + '/' + '0', '_blank', '');
        }
        $scope.toAppDetail = (item,type)=>{
            let proId = type==1?item.product_id:item.productId;
            erp.toAppDetail({id:proId})
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
            getRanking1();
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
        getRanking1();
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
            getRanking2()
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
        getRanking2();
        }

        function pageFun3() {
        $(".pagegroup3").jqPaginator({
            totalCounts: $scope.TotalNum3 || 1,
            pageSize: $scope.pageSize3 * 1,
            visiblePages: 5,
            currentPage: $scope.pageNum3 * 1,
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
            $scope.pageNum3 = n;
            getRanking3()
            }
        });
        }

        $scope.toPage3 = function () {
        var pageNum = Number($scope.pageNum3);
        var totalPage = Math.ceil($scope.TotalNum3 / $scope.pageSize3);
        if (!pageNum) {
            layer.msg('请输入页码');
            return;
        }
        if (pageNum > totalPage) {
            layer.msg('总计' + totalPage + '页，所输入数字应小于' + totalPage);
            $scope.pageNum3 = 1;
            return;
        }
        getRanking3();
        }

        function pageFun4() {
        $(".pagegroup4").jqPaginator({
            totalCounts: $scope.TotalNum4 || 1,
            pageSize: $scope.pageSize4 * 1,
            visiblePages: 5,
            currentPage: $scope.pageNum4 * 1,
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
            $scope.pageNum4 = n;
            getRanking4()
            }
        });
        }

        $scope.toPage4 = function () {
        var pageNum = Number($scope.pageNum4);
        var totalPage = Math.ceil($scope.TotalNum4 / $scope.pageSize4);
        if (!pageNum) {
            layer.msg('请输入页码');
            return;
        }
        if (pageNum > totalPage) {
            layer.msg('总计' + totalPage + '页，所输入数字应小于' + totalPage);
            $scope.pageNum4 = 1;
            return;
        }
        getRanking4();
        }

        function pageFun5() {
        $(".pagegroup5").jqPaginator({
            totalCounts: $scope.TotalNum5 || 1,
            pageSize: $scope.pageSize5 * 1,
            visiblePages: 5,
            currentPage: $scope.pageNum5 * 1,
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
            $scope.pageNum5 = n;
            getRanking5()
            }
        });
        }

        $scope.toPage5 = function () {
        var pageNum = Number($scope.pageNum5);
        var totalPage = Math.ceil($scope.TotalNum5 / $scope.pageSize5);
        if (!pageNum) {
            layer.msg('请输入页码');
            return;
        }
        if (pageNum > totalPage) {
            layer.msg('总计' + totalPage + '页，所输入数字应小于' + totalPage);
            $scope.pageNum5 = 1;
            return;
        }
        getRanking5();
        }

        $scope.lookChart1 = function(key){
        $scope.keywords = key
        remenSearchChart()
        }

        $scope.lookChart2 = function(key,sk){
        $scope.product_id = key
        $scope.skus = sk
        remenShopChart()
        }

        // 图表1
        function remenSearchChart(){
        var parms = {
            keywords: $scope.keywords,
            beginDate: $scope.startTime,
            endDate: $scope.endTime,
        };
        layer.load(2);
        erp.postFun("erp/keywordsSearch/getDayList", parms, function (res) {
            layer.closeAll("loading");
            console.log(res)
            if(res.data.statusCode ==200){
            $scope.listChart = res.data.result;
            var dateArr = []
            var countArr = []
            if($scope.listChart){
                for(i=0;i<$scope.listChart.length;i++){
                    dateArr.push($scope.listChart[i].search_date)
                    countArr.push($scope.listChart[i].search_count)
                }
                var myChart1 = echarts.init(document.getElementById('echartsMain1'));
                option = {
                tooltip : {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                xAxis: {
                    type: 'category',
                    data: dateArr
                },
                yAxis: {
                    type: 'value'
                },
                grid: {
                    // left: '3%',
                    right: '4%',
                    top: '2%',
                    height:'280',
                    containLabel: true
                },
                dataZoom: [{
                    // startValue: $scope.keywords == '' ? null :  res.data.result.data
                    // startValue:  res.data.result.data
                    type: 'slider',
                    bottom: '0'
                }],
                series: [{
                    data: countArr,
                    type: 'line',
                }]
                };
                myChart1.setOption(option);
            }
            
            }
        },function(){
            layer.closeAll("loading");
        })
        }

    
        // 图表
        function remenShopChart(){
        var parms = {
            product_id: $scope.product_id,
            beginDate: $scope.startTime,
            endDate: $scope.endTime,
            sku:$scope.skus
        };
        layer.load(2);
        erp.postFun("erp/xiaoLiang/getDayList",parms,function(res){
            layer.closeAll("loading");
            if(res.data.statusCode ==200){
            $scope.listChart5 = res.data.result;
            var dateShopArr = []
            var countShopArr = []
            if($scope.listChart){
                for(i=0;i<$scope.listChart5.length;i++){
                dateShopArr.push($scope.listChart5[i].order_date)
                countShopArr.push($scope.listChart5[i].product_count)
            }
            var myChart2 = echarts.init(document.getElementById('echartsMain2'));
            option2 = {
	            tooltip: {
		            trigger: 'axis',
		            axisPointer: {
			            type: 'cross',
			            label: {
				            backgroundColor: '#6a7985'
			            }
		            }
	            },
	            xAxis: {
		            type: 'category',
		            data: dateShopArr
	            },
	            yAxis: {
		            type: 'value'
	            },
	            grid: {
		            // left: '3%',
		            right: '4%',
		            top: '10%',
		            height: '240'
		            // containLabel: true
	            },
	
	            dataZoom: [{
		            // startValue: $scope.keywords == '' ? null :  res.data.result.data
		            // startValue:  res.data.result.data
		            type: 'slider',
		            bottom: '0'
	            }],
	            series: [{
		            data: countShopArr,
		            type: 'line',
	            }]
            };
	            myChart2.setOption(option2);
            }
            }
	
        }, function () {
	        layer.closeAll("loading");
        })
        }
	
	    // 出售商品类目统计
	    erp.getCateList().then(res => {
		    $scope.categoryData = res
	    })
	    $scope.yearData = [2020, 2019]
	    $scope.quarterData = ['第一季度', '第二季度', '第三季度', '第四季度']
	    $scope.monthData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
	    $scope.yearVal = $scope.yearData[0]
	    $scope.quarterVal = ''
	    $scope.monthVal = ''
	    $scope.categoryId = ''
	
	    // 筛选
	    $scope.handleFilterCate = (id) => {
		    if (id) {
			    $scope.categoryId = id || ''
		    } else {
			    $scope.secondaryData = $scope.firstItem ? $scope.firstItem.children : []
			    $scope.categoryId = $scope.firstItem ? $scope.firstItem.id : ''
		    }
		    console.log($scope.categoryId)
		    filterFun()
	    }
	    
	    $scope.handleFilterDate = () =>{
		    console.log($scope.categoryId)
		    filterFun()
	    }
	
	    // 查询数据
	    function filterFun() {
		    let month = undefined;
		    if (!$scope.quarterVal) {
			    $scope.monthData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
		    } else if ($scope.quarterVal === '第一季度') {
			    month = `'${$scope.yearVal}-01','${$scope.yearVal}-02','${$scope.yearVal}-03'`
			    $scope.monthData = [1, 2, 3]
		    } else if ($scope.quarterVal === '第二季度') {
			    month = `'${$scope.yearVal}-04','${$scope.yearVal}-05','${$scope.yearVal}-06'`
			    $scope.monthData = [4, 5, 6]
		    } else if ($scope.quarterVal === '第三季度') {
			    month = `'${$scope.yearVal}-07','${$scope.yearVal}-08','${$scope.yearVal}-09'`
			    $scope.monthData = [7, 8, 9]
		    } else if ($scope.quarterVal === '第四季度') {
			    month = `'${$scope.yearVal}-10','${$scope.yearVal}-11','${$scope.yearVal}-12'`
			    $scope.monthData = [10, 11, 12]
		    }
		    if ($scope.monthVal) {
			    month = $scope.monthVal > 9 ? `'${$scope.yearVal}-${$scope.monthVal}'` : `'${$scope.yearVal}-0${$scope.monthVal}'`
		    }
		    const parmas = {
			    month,
			    categoryId: $scope.categoryId ? $scope.categoryId : null,
			    year: !month ? $scope.yearVal.toString() : undefined
		    }
		    console.log($scope.monthVal)
		    console.log(parmas)
		    layer.load(2);
		    erp.postFun("app/product/getProductCategoryStatistics", parmas, ({ data }) => {
			    console.log(data)
			    layer.closeAll('loading')
			    if (data.statusCode === '200') {
				    const dataList = data.list || []
				    const piechartData = dataList.map(o => ({ name: o.NAME, value: o.count }))
				    const xData = dataList.map(o => o.NAME)
				    const yData = dataList.map(o => o.count)
				    salesCategoryHistogramFun(xData, yData)
				    salesCategoryPiechartFun(piechartData)
			    }
		    }, err => {
			    console.log(err)
		    })
	    }
	
	    // 柱状图
	    function salesCategoryHistogramFun(xData = [], yData = []) {
		    const salesCategoryHistogram = echarts.init(document.getElementById('sales-category-histogram'));
		    const option = {
			    color: ['#3398DB'],
			    tooltip: {
				    trigger: 'axis',
				    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
					    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				    }
			    },
			    grid: {
				    left: '1%',
				    right: '5%',
				    bottom: '3%',
				    containLabel: true
			    },
			    xAxis: [
				    {
					    name: '类目',
					    type: 'category',
					    data: xData,
					    axisLabel: {
						    interval: 'auto',    //强制文字产生间隔
						    rotate: 45,     //文字逆时针旋转45°
						    formatter(v) {
							    let text = v
							    return text.length < 4
								    ? text
								    : `${text.slice(0, 4)}\n${text.slice(4)}`
						    }
					    }
				    }
			    ],
			    yAxis: [
				    {
					    name: '数量',
					    type: 'value'
				    }
			    ],
			    series: [
				    {
					    name: '数量',
					    type: 'bar',
					    barWidth: '60%',
					    data: yData,
				    },
			
			    ],
		    };
		    salesCategoryHistogram.setOption(option);
	    }
	
	    // 饼状图
	    function salesCategoryPiechartFun(piechartData = []) {
		    const salesCategoryPiechart = echarts.init(document.getElementById('sales-category-piechart'));
		    const option = {
			    title: {
				    text: '饼状图显示占比',
				    left: 'center'
			    },
			    tooltip: {
				    trigger: 'item',
				    formatter: '{a} <br/>{b} : {c} ({d}%)'
			    },
			    series: [
				    {
					    name: '',
					    type: 'pie',
					    radius: '55%',
					    center: ['50%', '60%'],
					    data: piechartData,
					    emphasis: {
						    itemStyle: {
							    shadowBlur: 10,
							    shadowOffsetX: 0,
							    shadowColor: 'rgba(0, 0, 0, 0.5)'
						    }
					    },
					    label: {
						    normal: {
							    fontSize: 12,
							    formatter(v) {
								    let text = v.name
								    return text.length < 4
									    ? text
									    : `${text.slice(0, 4)}\n${text.slice(4)}`
							    }
						    }
					    },
				    }
			    ]
		    };
		    salesCategoryPiechart.setOption(option);
	    }
	
			filterFun()
			
			//导出
		  $scope.export = ({ type, startTime, endTime, orderBy }) => {
			  let sendData = {
					startTime, endTime, orderBy,
					excelType: exportModal[type].key
				}
				  , url = 'erp/excel/product'
				  , params = []
				  , link = document.createElement('a')
				  , excelIp
				  , environment = window.environment

			  for (let k in sendData) {
				  sendData[k] && params.push(`${k}=${sendData[k]}`)
			  }
		  	url = `${url}?${params.join('&')}`
			  if (/development/.test(environment)) {
				  excelIp = 'http://erp1.test.com/'  //192.168.5.106:8080/ROOT/
		  	} else if (/test/.test(environment)) {
				  excelIp = 'http://erp1.test.com/'
				  // excelIp = 'http://192.168.5.190:8080/ROOT/'
		  	} else if (/production-cn##$/.test(environment)) {
					excelIp = 'https://erp.cjdropshipping.cn/'
				} else if (/production##$/.test(environment)) {
			  	excelIp = 'https://erp1.cjdropshipping.com/'
			  }

				link.href = excelIp + url
				console.log(link.href)
			  // link.setAttribute("target","_blank")
			  link.click()
		  }
	
  }])
})();
