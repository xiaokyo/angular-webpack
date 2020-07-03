(function () {
    var app = angular.module('new-store-staff', [])
    // 新绩效规则设置
    app.controller('newJxgzSettingCtrl', ['$scope', 'erp', '$location','$timeout', function ($scope, erp, $location, $timeout) {
        console.log('进入绩效规则设置')
        console.log('url 参数', $location.$$search.islog)

        const TYPE_MAP = {
          // 签收
          '1': [
            {
              label: '包裹数量',
              key: 'packageNum'
            },
            {
              label: 'SKU数量',
              key: 'skuNum'
            },
            {
              label: 'SKU变体数量（个）',
              key: 'variantNum'
            },
            {
              label: '对应采购单数量',
              key: 'caigouOrderNum'
            }
          ],
          // 称重
          '2': [
            {
              label: '批次号',
              key: 'batchNumber'
            },
            {
              label: '称重次数',
              key: 'weighCount'
            },
            {
              label: '修改重量次数',
              key: 'upateWeighCount'
            },
            {
              label: '修改体积次数',
              key: 'updateVolumeCount'
            },
            {
              label: '商品属性修改次数',
              key: 'updatePropertyCount'
            }
          ],
          // 分标
          '3': [
            {
              label: '扫描包裹数量',
              key: 'scanPackageNum'
            },
            {
              label: '分标批次号',
              key: 'markBatchNumber'
            },
            {
              label: 'SKU分标数量',
              key: 'skuMarkNum'
            },
            {
              label: 'SKU变体数量',
              key: 'skuVariantNum'
            },
            {
              label: '到货数量',
              key: 'arrivalGoodsNum'
            },
            {
              label: '合格数量',
              key: 'qualifiedNum'
            },
            {
              label: '次品数量',
              key: 'ungradedProductsNum'
            },
            {
              label: '少货数量',
              key: 'lessGoodsNum'
            },
            {
              label: '多货数量',
              key: 'multipleGoodsNum'
            },
            {
              label: '称重数量',
              key: 'weighNum'
            },
            {
              label: '修改重量次数',
              key: 'updateWeighCount'
            },
            {
              label: '修改体积次数',
              key: 'updateVolumeCount'
            }
          ],
          // 入库
          '4': [
            {
              label: '入库商品总数',
              key: 'productNum'
            },
            {
              label: '批次号数量',
              key: 'batchNumber'
            },
            {
              label: '入库库位数',
              key: 'locationNum'
            },
            {
              label: '入库sku数量',
              key: 'skuNum'
            },
            {
              label: '入库sku变体数量',
              key: 'skuStanNum'
            },
            {
              label: '入库总距离(m)',
              key: 'allDistance'
            },
            {
              label: '入库总重量(g)',
              key: 'allWeight'
            },
            {
              label: '入库总体积(mm³)',
              key: 'allVolume'
            }
          ],
          // 拣货
          '5': [
            {
              label: '单品商品数',
              key: 'danpinProductNum'
            },
            {
              label: '单品波次数',
              key: 'danpinBatchNum'
            },
            {
              label: '单品库位数',
              key: 'danpinLocationNum'
            },
            {
              label: '单品sku数',
              key: 'danpinSkuNum'
            },
            {
              label: '单品sku变体数',
              key: 'danpinStanNum'
            },
            {
              label: '多品商品数',
              key: 'duopinProductNum'
            },
            {
              label: '多品波次数',
              key: 'duopinBatchNum'
            },
            {
              label: '多品库位数',
              key: 'duopinLocationNum'
            },
            {
              label: '多品sku数',
              key: 'duopinSkuNum'
            },
            {
              label: '多品sku变体数',
              key: 'duopinStanNum'
            },
            {
              label: '总距离(米)',
              key: 'allDistance'
            },
            {
              label: '总重量(g)',
              key: 'allWeight'
            },
            {
              label: '总体积(mm³)',
              key: 'allVolume'
            }
          ],
          // 验单
          '6': [
            {
              label: '多品批次号',
              key: 'dopeyBatchNumber'
            },
            {
              label: '多品面单数量',
              key: 'dopeyPdfNum'
            },
            {
              label: '商品数量',
              key: 'dopeySkuNum'
            },
            {
              label: '指定包装数量',
              key: 'dopeyPackingNum'
            },
            {
              label: '单品批次号',
              key: 'singleBatchNumber'
            },
            {
              label: '单品面单数量',
              key: 'singlePdfNum'
            },
            {
              label: '商品数量',
              key: 'singleSkuNum'
            },
            {
              label: '指定包装数量',
              key: 'singlePackingNum'
            },
            {
              label: '验单错误数量',
              key: 'checkErrorNum'
            }
          ],
          // 打包
          '7': [
            {
              label: '打包批次号',
              key: 'batchNumber'
            },
            {
              label: '打包订单数',
              key: 'orderNum'
            },
            {
              label: '打包数量',
              key: 'packingNum'
            },
            {
              label: '体积（立方米）',
              key: 'volume'
            },
            {
              label: '重量（千克）',
              key: 'weigh'
            }
          ],
          // 称重出库
          '8': [
            {
              label: '包裹批次号',
              key: 'packingBatchNumber'
            },
            {
              label: '包裹总数量',
              key: 'packingTotalNum'
            },
            {
              label: '包裹净重（千克）',
              key: 'packingNetWeight'
            },
            {
              label: '包裹毛重（千克）',
              key: 'packingRoughWeight'
            }
          ],
          // 搜品
          '9': [
            {
              label: '现有产品',
              key: 'existingProduct'
            },
            {
              label: '搜品变体',
              key: 'sourceVariant'
            },
            {
              label: '搜品失败',
              key: 'sourceFail'
            },
            {
              label: '搜品SKU数量',
              key: 'sourceSkuNum'
            },
            {
              label: '加班（小时）',
              key: 'overtimeHours'
            }
          ],
          '10': [
            {
              label: '属性错误',
              key: 'baoguo'
            },
            {
              label: '缺货录入',
              key: 'baoguo'
            },
            {
              label: '起批量大录入买不到货',
              key: 'baoguo'
            },
            {
              label: '搜品失败被找到',
              key: 'baoguo'
            },
            {
              label: '变体可以区分用123表示',
              key: 'baoguo'
            },
            {
              label: '抛货轻薄未选',
              key: 'baoguo'
            },
            {
              label: '标题、申报名错误',
              key: 'baoguo'
            },
            {
              label: '尺寸表错误',
              key: 'baoguo'
            },
            {
              label: '供应商不填',
              key: 'baoguo'
            },
            {
              label: '速卖通价格不对',
              key: 'baoguo'
            },
            {
              label: '尺寸大小用S/M/L*用x/没有新增变体',
              key: 'baoguo'
            },
            {
              label: '图片不过关',
              key: 'baoguo'
            },
            {
              label: '详情简单/错误',
              key: 'baoguo'
            },
            {
              label: '变体颜色命名',
              key: 'baoguo'
            },
            {
              label: '变体纯数字',
              key: 'baoguo'
            },
            {
              label: '变体混淆不清',
              key: 'baoguo'
            },
            {
              label: '变体图片不对应',
              key: 'baoguo'
            },
            {
              label: '重量相差大',
              key: 'baoguo'
            },
            {
              label: '插头未分规格',
              key: 'baoguo'
            },
            {
              label: '录入价格贵',
              key: 'baoguo'
            },
            {
              label: '审核人错误未审核到',
              key: 'baoguo'
            },
            {
              label: '跟系统重复录入',
              key: 'baoguo'
            }
          ],
          "11": [
            {
              label: '商品总数量',
              key: 'productAllCount'
            },
            {
              label: '领批次数量',
              key: 'collarBatchCount'
            },
            {
              label: 'sku总数量规则',
              key: 'skuAllCount'
            },
            {
              label: 'sku变体数量',
              key: 'skuStanCount'
            },
            {
              label: '称重次数',
              key: 'weighingCount'
            },
            {
              label: '修改合格次数',
              key: 'modifyQualifiedCount'
            },
            {
              label: '修改重量次数',
              key: 'modifyWeightCount'
            },
            {
              label: '总体积(mm³)',
              key: 'allVolume'
            }
          ]
        };
        
        $scope.isHaveSkus = [ '8', '9' ];
        $scope.islog = $location.$$search.islog // 历史积分记录标识
        $scope.totalNum = 0;
        // 添加搜品弹框
        $scope.souPinCreateModel = false;
        $scope.changeSoupinModelStatus = function(bool) {
          $scope.souPinCreateModel = bool;
          $scope.soupinCreateFrom = { ...defaultSoupinCreateFrom };
        };
        const defaultSoupinCreateFrom = {
          content: '',
          score: '',
        };
        $scope.soupinCreateFrom = { ...defaultSoupinCreateFrom };
        // 分组数据
        $scope.khType = '1';
        // 当前显示的分组数据
        $scope.groupDatas = TYPE_MAP[$scope.khType];
        // 改变请求数据类型
        $scope.khTypeFun = function (v) {
            console.log(v)
            $scope.groupDatas = TYPE_MAP[v];
            getList();
        }
        // 删除数据规则
        $scope.ruleDelete = function (ruleId) {
            layer.confirm('确定删除吗？', function (index) {
              ruleDelete(ruleId, index);
            }, function() {
              console.log('quxiao');
            });
        }
        // 请求列表数据
        function getList(params) {
          const loading = layer.load();
          // /integral/integralEmployeeLog/gettIntegralRule
          erp.postFun(
            'integral/integralEmployeeLog/getIntegralRule',
            {
              group: $scope.khType,
              // status 0 - 在用， 1 - 已删除
              status: $scope.islog ? 1 : 0
            },
            function(res) {
              layer.close(loading);
              if (res.status == 200) {
                // 搜品扣分模儿不做处理
                if ($scope.khType == '10') {
                  $scope.rules = res.data.data;
                  return;
                }
                // 正常处理数据
                $scope.rules = res.data.data.map(item => {
                  const rule = { ...item };
                  console.log($scope.groupDatas);
                  for (const { key } of $scope.groupDatas) {
                    rule[key] = JSON.parse(rule[key]);
                  }
                  rule.editUrl = editUrl(rule);
                  return rule;
                });
                console.log($scope.rules);
              }
            },
            function(err) {
              layer.close(loading);
              console.log(err);
            }
          );
        }
        getList()


        // $timeout(
        //   () =>
        //     $scope.$broadcast('page-data', {
        //       pageSize: 30, //每页条数
        //       pageNum: 1, //页码
        //       totalNum: 12, //总页数
        //       totalCounts: 1111, //数据总条数
        //       pageList: ['10', '20', '30'] //条数选择列表，例：['10','50','100']
        //     }),100
        // );
        
        // 搜品扣分模块编辑
        $scope.onSaveSouPin = function({ id, content, score }) {
          erp.postFun(
            'integral/integralEmployeeLog/setIntegralRule',
            {
              group: $scope.khType,
              rules: {
                id,
                content,
                score
              }
            },
            res => {
              if (res.data.code == 200) {
                layer.msg(id? '修改成功' : '添加成功')
                $scope.changeSoupinModelStatus(false);
                getList()
              } else {
                layer.msg('修改失败')
              }
            },
            err => {
              console.log(err);
              layer.msg('系统错误')
            }
          );
        };


        // 删除规则
        function ruleDelete(id, index) {
          erp.postFun(
            'integral/integralEmployeeLog/removeIntegralRule',
            {
              id,
              group: $scope.khType
            },
            res => {
              if (res.data.code == 200) {
                layer.close(index);
                layer.msg('删除成功')
                getList()
              } else {
                layer.msg('删除失败')
              }
            },
          );
        }

        // 编辑uRL生成
        function editUrl(item) {
            console.log($scope.khType)
            return (
              '#/staff/jxgzadd?editData=' +
              JSON.stringify(item) +
              '&group=' +
              $scope.khType
            );
        }
    }]);
    //仓库绩效统计
    app.controller('newStoreJxtjCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        //客户页面
        console.log(erp.isAdminLogin())
        $scope.isAdminFlag = erp.isAdminLogin()
        $scope.pageSize = '50';
        $scope.pageNum = '1';
        $scope.totalNum = 0;
        $scope.khType = '1';
        $scope.sortType = 'desc'
        // ----------------------------------------------
        $scope.date_option_list = [
            { txt: '今天', type: '0', activeColor: true },
            { txt: '本周', type: '1', activeColor: false },
            { txt: '本月', type: '2', activeColor: false },
            { txt: '三个月', type: '3', activeColor: false }
        ]
        $scope.start_time = ''
        $scope.end_time = ''
        $scope.date_type = $scope.date_option_list[0].type
        $scope.storageId = ''
        $scope.storageName = ''
        // ----------------------------------------------
        let apiUrl = 'integral/integralEmployStatistics/getEmployeeScore';
        // let urlMap = {
        //     "qianShou":"processOrder/employeeStatistics/receiveStatistics",
        //     "chengZhong":"processOrder/employeeStatistics/weighStatistics",
        //     "jianHuo":"storehouse/findGoods/list",
        //     "daBao":"processOrder/employeeStatistics/packageTongji",
        //     "fenBiao":"processOrder/employeeStatistics/distributeStatistics",
        //     "yanDan":"procurement/checkOrder/list",
        //     "ruKu":"procurement/enterStorehouse/pageList",
        //     "zhaoHuo":"storehouse/findGoods/list",
        // }
        $scope.khTypeFun = function(stu){
            console.log(stu)
            $scope.khType = stu;
            //apiUrl = urlMap[stu];
            console.log(apiUrl)
            $scope.pageNum = 1;
            getList()
        }

        $scope.storageCallback = function({item, storageList, allString}){
          console.log('storageItem', item);
          $scope.storageId = item ? item.dataId : "";
          $scope.storageName = item ? item.dataName : "";
          getList();
        }
        
        //getList();
        function getList(item) {
            if(!$scope.storageId || $scope.storageId == ''){
              layer.msg("无数据权限访问,请联系管理员");
              return;
            }
            if ('object' === typeof item) { // 点击背景换色
                $scope.date_option_list = $scope.date_option_list.map(ele => {
                    ele.activeColor = ele === item ? true : false
                    return ele
                })
            }
            $scope.listArr =  [];
            erp.load()
            var upData = {};
            upData.startTime = $scope.start_time
            upData.endTime = $scope.end_time
            upData.timeFlag = $scope.date_type
            upData.sortType = $scope.sortType
            upData.storageId = $scope.storageId
            upData.group = $scope.khType
            erp.postFun(apiUrl,upData, con, err)
            function con(n) {
                console.log(n)
                erp.closeLoad();
                if (n.data.code == 200) {
                    $scope.listArr = n.data.data;
                    pageFun();
                } else {
                    layer.msg(n.data.message)
                }
            }
        }
        $scope.sortFun = function(stu){
            if(stu == $scope.sortType){
                return
            }
            $scope.sortType = stu;
            getList()
        }
        $scope.timeSFun = function () {
            $scope.pageNum = '1'
            $scope.date_type = ''
            $scope.start_time = $('#start-time').val()
            $scope.end_time = $('#end-time').val()
            if (!$scope.start_time) return layer.msg('请选择开始日期')
            else {
                $scope.date_option_list = $scope.date_option_list.map(item => {
                    item.activeColor = false
                    return item
                })
                getList();
            }
        }
        $scope.getListByClick = function (item) {
            $scope.pageNum = '1';
            $scope.start_time = ''
            $scope.end_time = ''
            $('#start-time').val('')
            $('#end-time').val('')
            $scope.date_type = item.type;
            getList(item);
        }

        // 导出表格
        $scope.exportExcel = function (params) {
          if(!$scope.storageId || $scope.storageId == ''){
            layer.msg("无数据权限访问,请联系管理员");
            return;
          }
          const origin =
            window.environment == '##test##'
              ? 'http://127.0.0.1:8098'
              : location.origin;
          const url = `${origin}/integral/integralEmployStatistics/getEmployeeScoreExcel?timeFlag=${$scope.date_type}&startTime=${$scope.start_time}&endTime=${$scope.end_time}&sortType=${$scope.sortType}&group=${$scope.khType}&storageId=${$scope.storageId}`;
          console.log(url)
          window.open(url,'_black')
        }

        $('.sku-inp').keypress(function(event) {
            if(event.keyCode==13){
                $scope.searchFun()
            }
        });
        //分页
        function pageFun() {
            if($scope.totalNum<1){
                return
            }
            $(".pagination2").jqPaginator({
                totalCounts: $scope.totalNum || 1,
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
                    $scope.pageNum = n;
                    getList();
                }
            });
        }
        $scope.changePageSize = function (pageSize) {
            console.log(pageSize)
            $scope.pageNum = '1';
            getList();
        }
        $scope.toSpecifiedPage = function () {
            if ($scope.pageNum>Math.ceil($scope.totalNum / $scope.pageSize)) {
                console.log(Math.ceil($scope.totalNum / $scope.pageSize))
                layer.msg('输入的页码不能大于总页码')
                return
            }
            getList();
        }
        function err() {
            layer.msg('系统异常')
        }
    }])
    //搜品绩效统计
    app.controller('sourcingJxtjCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        //客户页面
        console.log(erp.isAdminLogin())
        $scope.isAdminFlag = erp.isAdminLogin()
        $scope.pageSize = '50';
        $scope.pageNum = '1';
        $scope.totalNum = 0;
        $scope.khType = '1';
        // ----------------------------------------------
        $scope.date_option_list = [
            { txt: '今天', type: '0', activeColor: true },
            { txt: '本周', type: '1', activeColor: false },
            { txt: '本月', type: '2', activeColor: false },
            { txt: '三个月', type: '3', activeColor: false }
        ]
        $scope.start_time = ''
        $scope.end_time = ''
        $scope.date_type = $scope.date_option_list[0].type
        // sortType; desc 降序  asc 升序
        $scope.sortType = 'desc';
        // 扣分记录弹框状态
        $scope.scoreChangeLog = false;
        // ----------------------------------------------
        $scope.khTypeFun = function(stu){
            console.log(stu)
            $scope.khType = stu;
        }
        getList();
        function getList(item) {
            if ('object' === typeof item) { // 点击背景换色
                $scope.date_option_list = $scope.date_option_list.map(ele => {
                    ele.activeColor = ele === item ? true : false
                    return ele
                })
            }
            erp.load()
            var upData = {
              timeFlag: $scope.date_type,
              startTime: $scope.start_time,
              endTime: $scope.end_time,
              sortType: $scope.sortType,
              group: 0
            };
            // upData.userName = $scope.searchSku
            // upData.page = $scope.pageNum
            // upData.pageSize = $scope.pageSize
            erp.postFun(
              'integral/integralEmployStatistics/getEmployeeScore',
              JSON.stringify(upData),
              con,
              err
            );
            function con(n) {
                console.log(n)
                erp.closeLoad();
                if (n.data.code == 200) {
                  $scope.listArr = n.data.data.map(item => ({
                    ...item,
                    overtimeTime_backup: item.overtimeTime,
                  }));
                  console.log($scope.listArr);
                  $scope.totalNum = $scope.listArr.length || 0;
                  if (n.data.totalNum == 0) {
                    $scope.totalpage = 0;
                    $scope.listArr = [];
                  }
                  $scope.totalpage = function() {
                    return Math.ceil(n.data.totalNum / $scope.pageSize);
                  };
                  pageFun();
                } else if (n.data.code == '403') {
                  layer.msg('没有该权限');
                }
            }
        }


        //  修改加班小时
        $scope.changeHour = function({ employeeId, overtimeTime, overtimeTime_backup, employeeName }) {
          // 没修改就跳过不请求
          if (overtimeTime == overtimeTime_backup) return;
          layer.load()
          erp.postFun(
            'integral/integralEmployeeLog/updateOvertime',
            {
              employeeId,
              overtimeTime,
              employeeName
            },
            res => {
              layer.closeAll();
              if (res.data.code == 200) {
                setTimeout(() => getList(), 1000);
                return layer.msg('修改成功');
              }
              layer.msg('修改失败');
            },
            err => {
              layer.closeAll();
              console.log(err);
            }
          );
        };

        // 导出表格
        $scope.exportExcel = function (params) {
          const origin =
            window.environment == '##development##'
              ? 'http://192.168.0.18:8098'
              : location.origin;
          const url = `${origin}/integral/integralEmployStatistics/getEmployeeScoreExcel?timeFlag=${$scope.date_type}&startTime=${$scope.start_time}&endTime=${$scope.end_time}&sortType=${$scope.sortType}&group=0`;
          console.log(url)
          window.open(url,'_black')
        }

        // 扣分记录
        $scope.showPenalties = function (item) {
          erp.load()
          console.log(item)
          erp.postFun(
            'integral/integralEmployeeLog/getScoreLog',
            {
              scoreType: 1,
              employeeId: item.employeeId,
              timeFlag: $scope.date_type,
              pageNum: 1,
              pageSize: 1000
            },
            res => {
              erp.closeLoad();
              console.log(res);
              if (res.data.code == 200) {
                $scope.scoreChangeLog = res.data.data.records;
              }
            },
            err => {
              console.log(err);
              layer.closeAll();
            }
          );

        }







        $scope.timeSFun = function () {
            $scope.pageNum = '1'
            $scope.date_type = ''
            $scope.start_time = $('#start-time').val()
            $scope.end_time = $('#end-time').val()
            if (!$scope.start_time) return layer.msg('请选择开始日期')
            else {
                $scope.date_option_list = $scope.date_option_list.map(item => {
                    item.activeColor = false
                    return item
                })
                getList();
            }
        }
        // $scope.searchFun = function () {
        //     $scope.pageNum = '1';
        //     getList();
        // }
        $scope.getListByClick = function (item) {
            $scope.pageNum = '1';
            $scope.start_time = ''
            $scope.end_time = ''
            $('#start-time').val('')
            $('#end-time').val('')
            $scope.date_type = item.type;
            getList(item);
        }

        $scope.sortFun = function (sortType){
          $scope.sortType = sortType;
          getList();
        }
        $('.sku-inp').keypress(function(event) {
            if(event.keyCode==13){
                $scope.searchFun()
            }
        });
        //分页
        function pageFun() {
            if($scope.totalNum<1){
                return
            }
            $(".pagination2").jqPaginator({
                totalCounts: $scope.totalNum || 1,
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
                    $scope.pageNum = n;
                    getList();
                }
            });
        }
        $scope.changePageSize = function (pageSize) {
            console.log(pageSize)
            $scope.pageNum = '1';
            getList();
        }
        $scope.toSpecifiedPage = function () {
            if ($scope.pageNum>Math.ceil($scope.totalNum / $scope.pageSize)) {
                console.log(Math.ceil($scope.totalNum / $scope.pageSize))
                layer.msg('输入的页码不能大于总页码')
                return
            }
            getList();
        }
        function err() {
            layer.msg('系统异常')
        }
    }])
    //查看详情页
    app.controller('jxtjDetailCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
        //绩效考核详情页
        console.log(erp.isAdminLogin())
        $scope.isAdminFlag = erp.isAdminLogin()
        $scope.pageSize = '50';
        $scope.pageNum = '1';
        $scope.totalNum = 0;
        $scope.khType = '1';
        const employeeId = $location.$$search.id;
        // ----------------------------------------------
        $scope.date_option_list = [
            { txt: '今天', type: '0', activeColor: false },
            { txt: '本周', type: '1', activeColor: false },
            { txt: '本月', type: '2', activeColor: false },
            { txt: '三个月', type: '3', activeColor: false }
        ]
        $scope.start_time = ''
        $scope.end_time = ''
        $scope.date_type = $location.$$search.timeFlag;

        $scope.date_option_list = $scope.date_option_list.map(ele => {
          ele.activeColor = ele.type === $scope.date_type ? true : false
          return ele
      })
        // ----------------------------------------------
        $scope.khTypeFun = function(stu){
            console.log(stu)
            $scope.khType = stu;
        }
        defaultCreateModelFrom = {
          content: '',
          score: ''
        };
        $scope.createModelStatus = false;
        $scope.createModelFrom = defaultCreateModelFrom;
        // 打开/关闭添加弹框
        $scope.changeCreateModelStatus = function(bool) {
          $scope.createModelStatus = bool;
          $scope.createModelFrom = { ...defaultCreateModelFrom };
        };
        // 添加积分变更
        $scope.createModelOk = function () {
          if(!$scope.createModelFrom.content || !$scope.createModelFrom.score){
             layer.msg("积分和原因不能为空");
             return;
          }
          console.log($scope.createModelFrom);
          layer.load()
          erp.postFun('integral/integralEmployeeLog/saveEmployeeLog', {
            type: 9,
            ...$scope.createModelFrom,
            employeeId
          },
          res => {
            layer.closeAll()
            console.log(res)
            if (res.data.error) {
              $scope.changeCreateModelStatus(false);
              layer.msg('添加成功');
              getList()
            } else {
              layer.msg("添加失败");
            }
          });
        }

        getList();
        function getList(item) {
            if ('object' === typeof item) { // 点击背景换色
                $scope.date_option_list = $scope.date_option_list.map(ele => {
                    ele.activeColor = ele === item ? true : false
                    return ele
                })
            }
            erp.load()
            var upData = {};
            upData.startTime = $scope.start_time
            upData.endTime = $scope.end_time
            upData.timeFlag = $scope.date_type;
            upData.pageNum = $scope.pageNum;
            upData.pageSize = $scope.pageSize;
            // upData.page = $scope.pageNum
            // upData.pageSize = $scope.pageSize
            erp.postFun(
              'integral/integralEmployeeLog/getScoreLog',
              {
                employeeId,
                ...upData
              },
              con,
              err
            );
            function con(res) {
              erp.closeLoad()
                console.log(res)
              if (res.data.code == 200) {
                $scope.listArr = res.data.data.records;
                $scope.totalNum = res.data.data.total;
                pageFun();
              }
            }
        }
        $scope.timeSFun = function () {
            $scope.pageNum = '1'
            $scope.date_type = ''
            $scope.start_time = $('#start-time').val()
            $scope.end_time = $('#end-time').val()
            if (!$scope.start_time) return layer.msg('请选择开始日期')
            else {
                $scope.date_option_list = $scope.date_option_list.map(item => {
                    item.activeColor = false
                    return item
                })
                getList();
            }
        }
        // $scope.searchFun = function () {
        //     $scope.pageNum = '1';
        //     getList();
        // }
        $scope.getListByClick = function (item) {
            $scope.pageNum = '1';
            $scope.start_time = ''
            $scope.end_time = ''
            $('#start-time').val('')
            $('#end-time').val('')
            $scope.date_type = item.type;
            getList(item);
        }
        $('.sku-inp').keypress(function(event) {
            if(event.keyCode==13){
                $scope.searchFun()
            }
        });
        //分页
        function pageFun() {
            if($scope.totalNum<1){
                return
            }
            $(".pagination2").jqPaginator({
                totalCounts: Number($scope.totalNum) || 1,
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
                    $scope.pageNum = n;
                    getList();
                }
            });
        }
        $scope.changePageSize = function (pageSize) {
            console.log(pageSize)
            $scope.pageNum = '1';
            getList();
        }
        $scope.toSpecifiedPage = function () {
            if ($scope.pageNum>Math.ceil($scope.totalNum / $scope.pageSize)) {
                console.log(Math.ceil($scope.totalNum / $scope.pageSize))
                layer.msg('输入的页码不能大于总页码')
                return
            }
            getList();
        }
        function err() {
            layer.msg('系统异常')
        }
    }])
})()
