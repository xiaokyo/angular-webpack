(function(angular) {
  var app = angular.module('sptree-staff', []);
  //领取任务
  app.controller('newSpAddTreeCtrl', [
    '$scope',
    'erp',
    '$routeParams',
    '$location',
    '$timeout',
    function($scope, erp, $routeParams, $location, $timeout) {
      console.log('设置绩效');
      $scope.selectedFirstId = '';
      $scope.selectedSecondId = '';
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
      let editData;
        // 添加页面
      console.log('初始化添加页面');
      $scope.notTypeData = [ '8', '9', '10' ];
      // 当前分组的规则数组
      $scope.group = '1';
      $scope.type = '1';
      $scope.categoryId = '';
      $scope.sku = '';
      $scope.testArr = TYPE_MAP[$scope.group];
      //积分试算数据载入
      $scope.intervalTest = {
          start: 1,
          end: 100,
          interval: 1,
          startPoints: 1,
          intervalPoints: 1,
        };

      $scope.resultTest = [
        {
          param: "",
          result: ""
        }

      ];

      // 规则数据结构初始化
      $scope.params = paramsCreate();
      // 进入编辑页面
      if ($location.$$search.editData) {
        editData = JSON.parse($location.$$search.editData);
        console.log('进入编辑页面：', $location.$$search);
        console.log('editDate：', editData);
        console.log('group', $location.$$search.group);
        $scope.isEdit = true;
        // 分组回显
        $scope.group = $location.$$search.group;
        $scope.testArr = TYPE_MAP[$scope.group];
        // 类目回显 1-分类 2-sku 3-通用`
        $scope.type = editData.type + '';
        // rule 回显
        if (editData.type == 1) {
          $scope.categoryId = editData.categorySku;
        } else {
          $scope.sku = editData.categorySku;
        }
        $scope.params = paramsEditFormat(editData);
      }
      // 添加规则时初始化rule
      function paramsCreate() {
        const params = {};
        console.log($scope.testArr);
        for (const { key } of $scope.testArr) {
          console.log(key);
          params[key] = {
            start: 0,
            end: 0,
            interval: 0,
            startPoints: 0,
            intervalPoints: 0
          };
        }
        return params;
      }
      // 编辑规则时格式转换
      function paramsEditFormat(data) {
        const params = {};
        for (const { key } of $scope.testArr) {
          params[key] = data[key];
        }
        return params;
      }
      console.log('params---', $scope.params);
      // 分组改变切换 规则数组并重新生成 rules
      $scope.khTypeFun = function(type) {
        $scope.testArr = TYPE_MAP[type];
        $scope.params = paramsCreate();
      };
      // 获取类目
      getCatory();
      function getCatory() {
        erp.load();
        erp.getFun(
          'erp/pieceworkAssessment/categorylist?pid=',
          function(data) {
            erp.closeLoad();
            //console.log(data);
            if (data.data.code == '200') {
              var result = data.data.data;
              console.log(result);
              $scope.FirstList = result;
              // 编辑时类目回显
              if ($scope.isEdit) {
                console.log($scope.categoryId);
                findCategory($scope.FirstList, $scope.categoryId);
              }
            } else {
              layer.msg('Get the category list error');
            }
          },
          function() {
            erp.closeLoad();
            layer.msg('Network error, please try again later');
          }
        );
      }
      // 类目点击操作
      $scope.changeCategory = function(cate, key) {
        console.log(cate);
        if (key == 'categoryId') {
          $scope[key] = cate.ID;
          $scope.categorySkuName = cate.NAME;
        } else {
          $scope[key] = cate.id;
        }
      }
      // $timeout(function() {
      //   $('.firstNav').on('click', 'li', function(e) {
      //     e.stopPropagation();
      //     e.preventDefault();
      //     var target = $(this);
      //     var type = target.attr('data-type');
      //     target
      //       .addClass('act')
      //       .siblings('.act')
      //       .removeClass('act');
      //     if (type == '1') {
      //       $scope.onecategory = target.attr('data-id');
      //       $scope.twocategory = '';
      //       $scope.categoryId = '';
      //       target.find('.secondNav>li.actcategorySkuName').removeClass('act');
      //     } else if (type == '2') {
      //       $scope.twocategory = target.attr('data-id');
      //       $scope.onecategory = '';
      //       $scope.categoryId = '';
      //     } else if (type == '3') {
      //       $scope.onecategory = '';
      //       $scope.twocategory = '';
      //       $scope.categoryId = target.attr('data-id');
      //     }
      //     console.log($scope.categoryId);
      //   });
      // });
      // 提交添加规则
      $scope.submit = function() {
        const params = {
          group: $scope.group,
          rules: $scope.params
        };
        if ($scope.type === '1' && !$scope.categoryId)
          return layer.msg('请选择类目(类目需确定到最后一级)');
        if ($scope.type === '2' && !$scope.sku) return layer.msg('请确定SKU');
        console.log($scope.params);
        // 规则非空校验
        // 规则现在是默认为0， 没有其他限制
        // for (const [key, value] of Object.entries($scope.params)) {
        //   if (typeof value !== 'object') {
        //     continue;
        //   }
        //   for (const [_key, _value] of Object.entries(value)) {
        //     console.log(key, _key, _value);
        //     if (_value !== 0 && !_value) { // 规则设置可以为0
        //       // 提示信息后续改
        //       return layer.alert(`缺少${key}-${_key}参数`);
        //     }
        //   }
        // }
        params.rules.type = $scope.type;
        if($scope.type === '1'){
          params.rules.categorySku = $scope.categoryId;
        } else if ($scope.type === '2') {
          params.rules.categorySku = $scope.sku;
        }  
        params.rules.id = $scope.isEdit ? editData.id : undefined
        params.rules.categorySkuName = $scope.categorySkuName;

        console.log('提交参数：', params);
        console.log(JSON.stringify(params));
        layer.load();
        erp.postFun(
          'integral/integralEmployeeLog/setIntegralRule',
          params,
          function(res) {
            layer.closeAll();
            if (res.data.code === 200) {
              layer.msg($scope.isEdit ? '已修改' : '添加成功！');
              location.hash = '#staff/jxgzSetting'
            }
            console.log(res);
          },
          function(err) {
            layer.closeAll();
            console.log(err);
          }
        );
      };

      $scope.cancel = function() {
        window.history.back(-1);
      }

      $scope.intervalBlur = function(val, key) {
        if(val == 0){
          layer.msg("间距值不能0");
          $scope.params[key].interval = 1;
        }
      }

      function setFocus(key) {
        document.getElementById('testParam' + key).focus();
      }

      $scope.intervalTestSub = function(key){
        if(!$scope.resultTest[key].param){
            layer.msg("参数不能为空");
            return;
        }
        const params = {
          param: $scope.resultTest[key].param,
          rule: $scope.intervalTest
        };
        layer.load();
        erp.postFun(
          'integral/integralEmployStatistics/getScoreTest',
          params,
          function(res) {
            layer.closeAll();
            if (res.data.code === 200) {
              $scope.resultTest[key].result = res.data.data;
              if(key == $scope.resultTest.length - 1){
                $scope.resultTest.push({
                  param: "",
                  result: ""
                });
              }
              
            }
            console.log(res);
          },
          function(err) {
            layer.closeAll();
            console.log(err);
          }
        );
      }

      // 确定sku值
      $scope.skuOk = function() {
        if ($scope.productList.length < 1) return;
        $scope.sku = $scope.productList[0].sku;
        $scope.categorySkuName = $scope.productList[0].nameEn;
        layer.msg(`已选择SKU: ${$scope.sku}`);
      };
      // 取消sku
      $scope.skuCancel = function() {
        $scope.sku = '';
        $scope.productList = [];
      };
      // SKU 搜索
      $scope.searchSku = function() {
        console.log($scope.sku);
        searchSku($scope.sku);
      };
      function searchSku(sku) {
        if (!sku) return;
        layer.load();
        erp.postFun(
          'pojo/product/list',
          {
            flag: '0',
            status: '3',
            filter01: 'SKU',
            autFlag: '01',
            pageNum: '1',
            pageSize: '1',
            filter03: '',
            filter04: '',
            filter05: '',
            filter06: '',
            filter21: '',
            filter22: '',
            filter23: '',
            filter24: '',
            filter11: '',
            filter12: '',
            autFlag: '01',
            chargeId: '',
            flag2: '',
            imgProductIds: '',
            // 以上参数 是从商品列表扒的 不知道干啥用
            filter02: sku
          },
          res => {
            layer.closeAll();
            if (res.data.statusCode == 200) {
              const data = JSON.parse(res.data.result);
              const { ps: productList } = data;
              $scope.productList = productList;
              console.log(productList);
            }
            console.log(res);
          },
          err => {
            layer.closeAll();
            console.log(err);
          }
        );
      }
      // 循环找出 1、2、3级类目
      function findCategory(categorys, thirdId) {
        let firstId, secondId;
        categorys:
        for (const first of categorys) {
          for (const second of first.children) {
            for (const third of second.children) {
              if (third.ID == thirdId) {
                $scope.selectedFirstId = first.id;
                $scope.selectedSecondId = second.id;
                break categorys;
              }
            }
          }
        }
      }
    }
  ]);
})(angular);
