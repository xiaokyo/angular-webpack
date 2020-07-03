(function () {
    var app = angular.module('SalesmanManagement', ['service']);
    /*数据统计*/
    app.controller('DataStatisticsCtrl', ['$scope', '$window', '$location', '$routeParams', '$timeout', '$http', 'erp', 'merchan', '$sce', function ($scope, $window, $location, $routeParams, $timeout, $http, erp, merchan, $sce) {
        console.log('DataStatisticsCtrl')
        var base64 = new Base64();
        var job = localStorage.getItem('job') ? base64.decode(localStorage.getItem('job')) : '';
        $scope.salesmanName = '';
        $scope.dateType = '日';
        $scope.level = null;
        $scope.dataList = [];
        if (['运营', '管理'].includes(job)) {
            $scope.level = 'admin';
            getSalesman('admin');
        } else {
            getLevel();
        }
        //日期筛选
        $scope.dateChange = function () {
            getData();
        };
        //业务员筛选
        $scope.salesmanChange = function () {
            if ($scope.level == 'admin' && !$scope.salesmanName) {
                $scope.salesmanIds = 'all';
            } else if ($scope.level == '1' && !$scope.salesmanName) {
                //$scope.salesmanIds = $scope.salesmanData;
                var arr = [];
                $scope.salesmanData.forEach(function (o, i) {
                    arr.push("'" + o.salesmanID + "'")
                })
                $scope.salesmanIds = arr.join(',');
            } else {
                $scope.salesmanIds = "'" + $scope.salesmanName + "'";
            }
            getData();
        };

        //获取职位
        function getLevel() {
            var data = {};
            layer.load(2);
            erp.postFun("erp/salesmanDateStat/getPositionBySalesmanID", data, function (res) {
                layer.closeAll("loading");
                if (res.data.statusCode == 200) {
                    $scope.level = res.data.result ? res.data.result.position : null;
                    if ($scope.level == '1' || $scope.level == '0' || $scope.level == '2') {
                        //组长 - 组员 - 个体
                        getSalesman($scope.level)
                    } else {
                        layer.msg('当前登陆人未设置职位不可查看！')
                    }
                }
            }, function (err) {
                layer.msg('服务器错误')
            });
        }

        //获取业务员
        function getSalesman(level) {
            var data = level == 'admin' ? {} : {position: level};
            layer.load(2);
            $scope.salesmanData = [];
            erp.postFun("erp/salesmanDateStat/getSalesmanInfo ", data, function (res) {
                layer.closeAll("loading");
                if (res.data.statusCode == 200) {
                    $scope.salesmanData = res.data.result;
                    var arr = [];
                    if (level == 'admin') {
                        $scope.salesmanIds = 'all';
                    } else {
                        $scope.salesmanData.forEach(function (o, i) {
                            arr.push("'" + o.salesmanID + "'")
                        })
                        $scope.salesmanIds = arr.join(',');
                    }
                    getData();
                }
            }, function (err) {
                layer.msg('服务器错误')
            });
        }

        //获取数据
        function getData() {
            var data = {
                salesmanIds: $scope.salesmanIds,
                dateType: $scope.dateType
            };
            layer.load(2);
            erp.postFun("erp/salesmanDateStat/salesmanDataStat", data, function (res) {
                layer.closeAll("loading");
                if (res.data.statusCode == 200) {
                    $scope.dataList = res.data.result;
                    console.log($scope.dataList)
                    drawing($scope.dataList);
                }
            }, function (err) {
                layer.msg('服务器错误')
            });
        }

        function drawing(allData) {
            var startDate = allData.startDate;//起始日期
            var dateArr = allData.date;//日期
            var data1 = allData.arr1 || [];//销售金额
            var data2 = allData.arr3 || [];//利润
            var data3 = allData.arr4 || [];//利润率
            var data4 = allData.arr2 || [];//订单数量
            var zuyuan = [];//组员
            var seriesData1 = [];
            var seriesData2 = [];
            var seriesData3 = [];
            var seriesData4 = [];
            console.log(data1)
            data1.forEach(function (o, i) {
                zuyuan.push(o.name);//组员
                seriesData1.push(
                        {
                            name: o.name,
                            type: 'line',
                            symbol: 'none',
                            data: o.number,
                            markLine: {
                                silent: true,
                                data: [{
                                    name: '平均线',
                                    type: 'average',
                                }]
                            },
                        }
                )
            });
            console.log(zuyuan)
            console.log(seriesData1)

            data2.forEach(function (o, i) {
                zuyuan.push(o.name);//组员
                seriesData2.push(
                        {
                            name: o.name,
                            type: 'line',
                            symbol: 'none',
                            data: o.number,
                            markLine: {
                                silent: true,
                                data: [{
                                    name: '平均线',
                                    type: 'average',
                                }]
                            }
                        }
                )
            });
            data3.forEach(function (o, i) {
                zuyuan.push(o.name);//组员
                seriesData3.push(
                        {
                            name: o.name,
                            type: 'line',
                            symbol: 'none',
                            data: o.number,
                            markLine: {
                                silent: true,
                                data: [{
                                    name: '平均线',
                                    type: 'average',
                                }]
                            }
                        }
                )
            });
            data4.forEach(function (o, i) {
                zuyuan.push(o.name);//组员
                seriesData4.push(
                        {
                            name: o.name,
                            type: 'line',
                            symbol: 'none',
                            data: o.number,
                            markLine: {
                                silent: true,
                                data: [{
                                    name: '平均线',
                                    type: 'average',
                                }]
                            }
                        }
                )
            });
            var option1 = {
                color: ['#4A90E2', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
                tooltip: {
                    trigger: 'axis',
                    showDelay: 0             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
                },
                legend: {
                    data: zuyuan
                },
                toolbox: {
                    y: -30,
                    show: false,
                    feature: {
                        mark: {show: true},
                        dataZoom: {show: true},
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                dataZoom: {
                    y: 200,
                    show: false,
                    realtime: true,
                    start: 50,
                    end: 100
                },
                grid: {
                    right: '8%',
                    left: '5%',
                    containLabel: false
                },
                xAxis: [
                    {
                        type: 'category',
                        position: 'bottom',
                        boundaryGap: true,
                        axisTick: {onGap: false},
                        splitLine: {show: false},
                        data: dateArr
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '销售金额(美元)',
                        /*      scale: true,
                              splitNumber: 3,
                              boundaryGap: [0.05, 0.05],
                              axisLabel: {
                                  formatter: function (v) {
                                      return Math.round(v / 10000) + ' 万'
                                  }
                              },*/
                        splitArea: {show: false},
                        splitLine: {
                            show: false
                        }
                    }
                ],
                series: seriesData1
            };
            var option2 = {
                color: ['#4A90E2', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
                tooltip: {
                    trigger: 'axis',
                    showDelay: 0             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
                },
                legend: {
                    y: -30,
                    data: zuyuan
                },
                toolbox: {
                    y: -30,
                    show: false,
                    feature: {
                        mark: {show: true},
                        dataZoom: {show: true},
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                dataZoom: {
                    height: 30,
                    y: 320,
                    show: true,
                    realtime: true,
                    //start : 50,
                    //end : 100
                    startValue: startDate
                },
                grid: {
                    right: '8%',
                    left: '5%',
                    containLabel: false
                },
                xAxis: [
                    {
                        type: 'category',
                        position: 'bottom',
                        boundaryGap: true,
                        axisTick: {onGap: false},
                        splitLine: {show: false},
                        data: dateArr
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '利润(美元)',
                        /*       scale: true,
                               splitNumber: 3,
                               boundaryGap: [0.05, 0.05],
                               axisLabel: {
                                   formatter: function (v) {
                                       return Math.round(v / 10000) + ' 万'
                                   }
                               },*/
                        splitArea: {show: false},
                        splitLine: {
                            show: false
                        }
                    }
                ],
                series: seriesData2
            };
            var option3 = {
                color: ['#4A90E2', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
                tooltip: {
                    trigger: 'axis',
                    showDelay: 0,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
                    formatter: function (params) {
                        return '<div><p>'+params[0].name+'</p><p>'+params[0].value+'%</p></div>'
                    }
                },
                legend: {
                    y: -30,
                    data: zuyuan
                },
                toolbox: {
                    y: -30,
                    show: false,
                    feature: {
                        mark: {show: true},
                        dataZoom: {show: true},
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                dataZoom: {
                    y: 200,
                    show: false,
                    realtime: true,
                    start: 50,
                    end: 100
                },
                grid: {
                    right: '8%',
                    left: '5%',
                    containLabel: false
                },
                xAxis: [
                    {
                        type: 'category',
                        position: 'bottom',
                        boundaryGap: true,
                        axisTick: {onGap: false},
                        splitLine: {show: false},
                        data: dateArr
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '利润率',
                        scale: true,
                        splitNumber: 3,
                        boundaryGap: [0.05, 0.05],
                        axisLabel: {
                            formatter: function (v) {
                                return Math.round(v) + '%'
                            }
                        },
                        splitArea: {show: false},
                        splitLine: {
                            show: false
                        }
                    }
                ],
                series: seriesData3
            };
            var option4 = {
                color: ['#4A90E2', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
                tooltip: {
                    trigger: 'axis',
                    showDelay: 0             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
                },
                legend: {
                    y: -30,
                    data: zuyuan
                },
                toolbox: {
                    y: -30,
                    show: false,
                    feature: {
                        mark: {show: true},
                        dataZoom: {show: true},
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                dataZoom: {
                    y: 200,
                    show: false,
                    realtime: true,
                    start: 50,
                    end: 100
                },
                grid: {
                    right: '8%',
                    left: '5%',
                    containLabel: false
                },
                xAxis: [
                    {
                        type: 'category',
                        position: 'bottom',
                        boundaryGap: true,
                        axisTick: {onGap: false},
                        splitLine: {show: false},
                        data: dateArr
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '订单数量',
                        /*    scale: true,
                            splitNumber: 3,
                            boundaryGap: [0.05, 0.05],
                            axisLabel: {
                                formatter: function (v) {
                                    return Math.round(v / 10000) + ' 万'
                                }
                            },*/
                        splitArea: {show: false},
                        splitLine: {
                            show: false
                        }
                    }
                ],
                series: seriesData4
            };
            var myChart1 = echarts.init(document.getElementById('main1'));
            var myChart2 = echarts.init(document.getElementById('main2'));
            var myChart3 = echarts.init(document.getElementById('main3'));
            var myChart4 = echarts.init(document.getElementById('main4'));

            myChart1.setOption(option1, true);
            myChart2.setOption(option2, true);
            myChart3.setOption(option3, true);
            myChart4.setOption(option4, true);
            echarts.connect([myChart1, myChart2, myChart3, myChart4]);
        }
    }]);
    /*订单查询*/
    app.controller('OrderTrackingCtrl', ['$scope', '$window', '$location', '$routeParams', '$timeout', '$http', 'erp', 'merchan', '$sce', function ($scope, $window, $location, $routeParams, $timeout, $http, erp, merchan, $sce) {
        console.log('OrderTrackingCtrl')
        $scope.parentOrder = true;
        $scope.directOrder = false;
        $scope.orderTabClick = function (type) {
            if (type == '1') {
                $scope.parentOrder = true;
                $scope.directOrder = false;
            } else if (type == '2') {
                $scope.parentOrder = false;
                $scope.directOrder = true;
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
                    $scope.pageNum1 = n + '';
                    //getProranking1()
                }
            });
        }

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
                    $scope.pageNum2 = n + '';
                    //getProranking2()
                }
            });
        }
    }]);
    /*业务员设置*/
    app.controller('SalesmanSettingCtrl', ['$scope', '$window', '$location', '$routeParams', '$timeout', '$http', 'erp', 'merchan', '$sce', function ($scope, $window, $location, $routeParams, $timeout, $http, erp, merchan, $sce) {
        console.log('SalesmanSettingCtrl');
        $scope.isAdmin = erp.isAdminLogin();
        $scope.level = '';//职位
        $scope.isPermission = false;
        /*业务员*/
        $scope.salesmanArr = [];
        $scope.salesman = '';
        /*组长*/
        $scope.leaderArr = [];
        $scope.leader = '';
        /**/
        $scope.page = '1';
        $scope.pageSize = '20';
        $scope.searchLeader = '';
        $scope.dataList = [];
        /*查询*/
        $scope.searchInput = function () {
            $scope.page = '1';
            getData();
        };

        //获取职位
        function getLevel() {
            var data = {};
            layer.load(2);
            erp.postFun("erp/salesmanDateStat/getPositionBySalesmanID", data, function (res) {
                layer.closeAll("loading");
                if (res.data.statusCode == 200) {
                    var level = res.data.result ? res.data.result.position : null;
                    if ($scope.isAdmin || level == '1') {
                        $scope.isPermission = true;
                    } else {
                        $scope.isPermission = false;
                    }
                }
            }, function (err) {
                layer.msg('服务器错误')
            });
        }

        getLevel();

        /*获取列表数据*/
        function getData() {
            layer.load(2);
            $scope.dataList = [];
            var data = {
                page: $scope.page,
                pageSize: $scope.pageSize,
                headmanID: $scope.searchLeader ? JSON.parse($scope.searchLeader).headmanID : '',
                salesmanName: $scope.salesmanName,
            };
            erp.postFun("erp/salesmanAllot/getSalesmanAllotInfo", data, function (res) {
                layer.closeAll("loading");
                if (res.data.statusCode == 200) {
                    $scope.dataList = res.data.result.salesmanAllotInfoList;
                    $scope.TotalNum = res.data.result.count;
                    console.log($scope.dataList)
                    pageFun()
                }
            }, function (err) {
                layer.msg('服务器错误')
            });
        }

        getLeader();
        getData();
        /*新增*/
        $scope.addSalesman = function () {
            $scope.isAddOrEdit = true;
            $scope.dialogTxt = '新增业务员';
            $scope.flag = '0';
            $scope.level = '0';
            /*业务员*/
            $scope.salesmanArr = [];
            $scope.salesman = '';
            /*组长*/
            $scope.leaderArr = [];
            $scope.leader = '';
            getSalesman($scope.level);
            getLeader();
        };

        /*获取业务员*/
        function getSalesman(level) {
            layer.load(2);
            erp.postFun("erp/salesmanAllot/getEmployeeInfo", {position: level}, function (res) {
                layer.closeAll("loading");
                if (res.data.statusCode == 200) {
                    $scope.salesmanArr = res.data.result;
                    console.log($scope.salesmanArr)
                }
            }, function (err) {
                layer.msg('服务器错误')
            });
        }

        /*获取组长*/
        function getLeader() {
            layer.load(2);
            erp.postFun("erp/salesmanAllot/getheadmanInfo", {}, function (res) {
                layer.closeAll("loading");
                if (res.data.statusCode == 200) {
                    $scope.leaderArr = res.data.result;
                    console.log($scope.leaderArr)
                    if ($scope.flag == '1') {
                        console.log($scope.editItem.headmanMap)
                        $scope.leader = JSON.stringify($scope.editItem.headmanMap);
                        if ($scope.level == '1') {
                            $scope.leaderArr.forEach(function (o, i) {
                                if ($scope.salesman == o.headmanName) {
                                    $scope.leaderArr.splice(i, 1)
                                }
                            })
                        }
                    }
                    console.log($scope.leaderArr)
                }
            }, function (err) {
                layer.msg('服务器错误')
            });
        }

        /*职位选择*/
        $scope.levelChange = function () {
            getSalesman($scope.level)
            $scope.leader = '';
        }
        /*编辑*/
        $scope.edit = function (item) {
            console.log(item)
            $scope.editItem = item;
            $scope.isAddOrEdit = true;
            $scope.dialogTxt = '编辑业务员';
            $scope.flag = '1';
            $scope.level = item.position;
            /*业务员*/
            $scope.salesmanArr = [];
            $scope.salesman = item.salesmanName;
            /*组长*/
            $scope.leaderArr = [];
            $scope.leader = '';
            //getSalesman ($scope.level);
            getLeader();
            console.log($scope.salesmanArr)
            console.log($scope.leaderArr)
        };
        /*确定*/
        $scope.confirm = function () {
            if ($scope.flag == '0') {
                if (!$scope.salesman) {
                    layer.msg('请选择业务员');
                    return;
                }
                if ($scope.level == '0' && !$scope.leader) {
                    layer.msg('请选择组长');
                    return;
                }
                var data = {
                    "position": $scope.level,
                    "salesmanID": JSON.parse($scope.salesman).ID,
                    "salesmanName": JSON.parse($scope.salesman).NAME,
                    "headmanID": $scope.leader ? JSON.parse($scope.leader).headmanID : '',
                    "headmanName": $scope.leader ? JSON.parse($scope.leader).headmanName : ''
                };
                console.log(data)
                layer.load(2);
                erp.postFun("erp/salesmanAllot/AddSalesmanAllotInfo", data, function (res) {
                    layer.closeAll("loading");
                    if (res.data.statusCode == 200) {
                        layer.msg('新增成功');
                        $scope.isAddOrEdit = false;
                        getData();
                    }
                }, function (err) {
                    layer.msg('服务器错误')
                });
            } else if ($scope.flag == '1') {
                console.log($scope.level)
                console.log($scope.leader)
                console.log($scope.editItem)
                if ($scope.level == $scope.editItem.position && JSON.parse($scope.leader).headmanName == $scope.editItem.headmanName) {
                    layer.msg('请做出修改再提交！')
                } else {
                    layer.load(2);
                    var data = {
                        "ID": $scope.editItem.ID,
                        "position": $scope.editItem.position,
                        "newPosition": $scope.level,
                        "salesmanID": $scope.editItem.salesmanMap.salesmanID,
                        "salesmanName": $scope.editItem.salesmanMap.salesmanName,
                        "headmanID": $scope.leader ? JSON.parse($scope.leader).headmanID : '',
                        "headmanName": $scope.leader ? JSON.parse($scope.leader).headmanName : ''
                    }
                    console.log(data)
                    erp.postFun("erp/salesmanAllot/upSalesmanAllotInfo", data, function (res) {
                        layer.closeAll("loading");
                        if (res.data.statusCode == 200) {
                            layer.msg('编辑成功');
                            $scope.isAddOrEdit = false;
                            getData();
                        }
                    }, function (err) {
                        layer.msg('服务器错误')
                    });
                }
            }
        }
        /*删除*/
        $scope.remove = function (item) {
            $scope.isRemove = true;
            $scope.removeItem = item;
            console.log(item)
        };
        $scope.removeConfirm = function () {
            layer.load(2);
            var data = {
                "ID": $scope.removeItem.ID,
                "salesmanID": $scope.removeItem.salesmanID,
                "position": $scope.removeItem.position,
            };
            erp.postFun("erp/salesmanAllot/delSalesmanAllotInfo", data, function (res) {
                layer.closeAll("loading");
                if (res.data.statusCode == 200) {
                    layer.msg('删除成功');
                    $scope.isRemove = false;
                    getData();
                }
            }, function (err) {
                layer.msg('服务器错误')
            });
        }

        /*分页*/
        function pageFun() {
            $(".pagegroup").jqPaginator({
                totalCounts: $scope.TotalNum || 1,
                pageSize: $scope.pageSize * 1,
                visiblePages: 5,
                currentPage: $scope.page * 1,
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
                    $scope.page = n + '';
                    getData()
                }
            });
        }
    }]);
})();