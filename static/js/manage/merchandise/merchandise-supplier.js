(function() {
  var app = angular.module('merchandise');
  var getEmployeeUrl = 'app/employee/getempbyname';

  // getSalemanList
  function getEmployeeList(erp, job, scb) {
    erp.postFun(
      getEmployeeUrl,
      {
        data: JSON.stringify({
          name: '',
          job: job
        })
      },
      function(data) {
        // console.log(JSON.parse(data.data.result).list);
        scb(JSON.parse(data.data.result).list);
      }
    );
  }
  app.controller('merchandiseSupplierCtrl', [
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
      $('.right-bar').on('click', '.top-nav li', function() {
        var topNavindex = $(this).index();
        $(this)
          .addClass('active')
          .siblings()
          .removeClass('active');
      });

      $('.right-bar').css('min-height', $(window).height() - 90 + 'px');

      $('.left-bar').css('min-height', $(window).height() - 90 + 'px');
      var bs = new Base64();

      console.log($scope.isSoldOut);
      $scope.gotoSoldOut = function() {
        location.href = '#/merchandise/soldOut/' + Wintype;
      };

      $scope.loginName = localStorage.getItem('erploginName')
        ? bs.decode(localStorage.getItem('erploginName'))
        : '';

      $scope.isAdminLogin = erp.isAdminLogin();

      console.log('admin', $scope.isAdminLogin);

      $scope.chargemanType = '销售';
      getEmployeeList(erp, '销售', function(data) {
        $scope.chargemanList = data;
        $scope.chargemanName = '';
      });

      $scope.changeChargeman = function(id) {
        $scope.currentPage = 1;
        $scope.chargemanName = id;
        console.log($scope.chargemanName);
        $scope.getCurrentFirstList();
      };
      $scope.changeChargemanType = function(type) {
        getEmployeeList(erp, type, function(data) {
          $scope.chargemanList = data;
          $scope.chargemanName = '';
          $scope.currentPage = 1;
          $scope.getCurrentFirstList();
        });
      };

      $scope.userId =
        localStorage.getItem('erpuserId') == null
          ? ''
          : bs.decode(localStorage.getItem('erpuserId'));
      $scope.userName =
        localStorage.getItem('erpname') == null
          ? ''
          : bs.decode(localStorage.getItem('erpname'));
      $scope.token =
        localStorage.getItem('erptoken') == null
          ? ''
          : bs.decode(localStorage.getItem('erptoken'));
      $scope.remark = '';

      // 商品列表相关参数
      $scope.merchanStatus = $routeParams.status || '3'; // '3'已上架
      // $scope.merchanFlag = $routeParams.flag || '0';
      //缺货商品统计过来的sku
      $scope.sku = $routeParams.sku || '';
      // $scope.merchType -- 备份标记
      if ($routeParams.type == 'service') {
        $scope.merchType = '1';
        $scope.dropFlag = 'service';
      } else if ($routeParams.type == 'personalize') {
        $scope.merchType = '0';
        $scope.dropFlag = '';
        $scope.optType = 'personality';
      } else if ($routeParams.type == 'suplier') {
        // $scope.merchType = '0';
        // $scope.dropFlag = '';
        $scope.suplierFlag = 1;
      } else {
        $scope.merchType = '0';
        $scope.dropFlag = '';
      }
      console.log($scope.merchType);

      $scope.merchList = [];
      $scope.currentPage = 1;
      $scope.specifiedPage = $scope.currentPage;
      $scope.totalNum = '';
      $scope.pageSize = '30';
      $scope.totalPages = '';
      $scope.hasMerch = true;

      // 可见性标记，01-全部，0-私有，1-公有
      $scope.authoFlag = '01';
      $scope.getListUrl = 'supplier/product/getProdcutPage'; // 商品列表 url
      $scope.updateUrl = 'supplier/product/updateProductInfo'; // 更改商品 url
      $scope.deleteUrl = 'supplier/product/deleteProcutByIds'; // 删除商品 url
      $scope.recoverProductUrl = 'supplier/product/recoverProduct'; // 恢复商品 url
      $scope.realDeleteUrl = 'supplier/product/realDeleted'; // 永久删除商品 url
      $scope.recycleBinUrl = 'supplier/product/getProdcutRecyclePage'; // 回收站商品 url : $scope.getBanchIds

      // 搜索
      $scope.topSearchKey = 'sku';
      $scope.topSearchVal = $scope.sku;
      // $scope.salesType = undefined; // 销售类型
      $scope.searchProperVals = []; // 已勾选属性
      $scope.searchMateVals = []; // 已勾选材质
      $scope.$watch('totalNum', function(now) {
        $scope.totalPages = Math.ceil($scope.totalNum / ($scope.pageSize * 1));
      });
      $scope.$watch('pageSize', function(now) {
        $scope.totalPages = Math.ceil($scope.totalNum / ($scope.pageSize * 1));
      });
      $scope.hasGotStorage = true;

      // getItemNums();

      function settleListData(data) {
        var result = JSON.parse(data.result);
        console.log(result);
        var resultNum;
        var resultList;
        resultNum = result.total;
        resultList = result.ps;
        for (var i = 0; i < resultList.length; i++) {
          if (!$scope.isOffAssMerch) {
            resultList[i].inventory = JSON.parse(
              resultList[i].inventory || '{}'
            );
            resultList[i].autAccId = JSON.parse(resultList[i].autAccId || '{}');
          }
          resultList[i].checked = false;
          resultList[i].countryCode = 'US';
          if (
            resultList[i].shiSuan &&
            resultList[i].shiSuan.logSet.indexOf('ePacket') == -1
          ) {
            resultList[i].wuliuway = resultList[i].shiSuan.logSet[0];
          } else {
            resultList[i].wuliuway = 'ePacket';
          }

          var logName = resultList[i].wuliuway;
          if (resultList[i].shiSuan) {
            var logList = resultList[i].shiSuan.logistics;
            for (var j = 0; j < logList.length; j++) {
              if (logList[j].logisticName == logName) {
                resultList[i].shiSuanRes = logList[j].price + '';
              }
            }
            resultList[i].sumPrice = (
              erp.cacuAmount(
                resultList[i].shiSuanRes,
                resultList[i].sellPrice
              ) + ''
            ).replace(' -- ', '-');
          }
        }
        $scope.merchList = resultList;
        console.log($scope.merchList);
        $scope.totalNum = resultNum;
        $scope.checkAllMark = false;
      }

      $scope.chanListWuliuway = function(item) {
        var logList = item.shiSuan.logistics;
        var logName = item.wuliuway;
        for (var j = 0; j < logList.length; j++) {
          if (logList[j].logisticName == logName) {
            item.shiSuanRes = logList[j].price + '';
          }
        }
        item.sumPrice = (
          erp.cacuAmount(item.shiSuanRes, item.sellPrice) + ''
        ).replace(' -- ', '-');
      };
      $scope.chanListCoun = function(item) {
        layer.load(2);
        erp.postFun(
          'pojo/product/quJianshiSuan',
          {
            propertyKey: item.propertyKey,
            packWeight: item.packWeight,
            countryCode: item.countryCode
          },
          function(data) {
            layer.closeAll('loading');
            console.log(data);
            item.shiSuan.logSet = data.data.logSet;
            item.shiSuan.logistics = data.data.logistics;
            if (item.shiSuan.logSet.length == 0) {
              item.shiSuanRes = '0';
              item.sumPrice = (
                erp.cacuAmount(item.shiSuanRes, item.sellPrice) + ''
              ).replace(' -- ', '-');
              return;
            }
            if (item.shiSuan.logSet.indexOf('ePacket') == -1) {
              item.wuliuway = item.shiSuan.logSet[0];
            } else {
              item.wuliuway = 'ePacket';
            }
            var logList = item.shiSuan.logistics;
            var logName = item.wuliuway;
            console.log(logList, logName);
            for (var j = 0; j < logList.length; j++) {
              if (logList[j].logisticName == logName) {
                item.shiSuanRes = logList[j].price + '';
              }
            }
            item.sumPrice = (
              erp.cacuAmount(item.shiSuanRes, item.sellPrice) + ''
            ).replace(' -- ', '-');
          }
        );
      };

      function getMerchanList(url, sendData, successCallback, errorCallback) {
        // erp.load();
        erp.loadPercent($('.erp-load-box'), 400);
        erp.postFun(
          url,
          JSON.stringify(sendData),
          function(data) {
            erp.closeLoadPercent($('.erp-load-box'));
            // erp.closeLoad();
            successCallback(data);
          },
          function(data) {
            erp.closeLoadPercent($('.erp-load-box'));
            // erp.closeLoad();
            errorCallback(data);
          }
        );
      }

      function getListSendData() {
        // var sendDemo = {
        // "beginTime": "string",
        // "categoryId": "string",
        // "consumerGroups": "string",
        // "customerId": 0,
        // "endPrice": 0,
        // "endProductGrams": 0,
        // "endTime": "string",
        // "id": 0,
        // "pageNum": 0,
        // "pageSize": 0,
        // "shopId": 0,
        // "sku": "string",
        // "sortType": "string",
        // "startPrice": 0,
        // "startProductGrams": 0,
        // "status": 0,
        // "title": "string"
        // }
        var sendData = {};
        // sendData.beginTime = '';
        sendData.categoryId = $('.cate-name').attr('id');
        sendData.consumerGroupIds = $('.consumer-name').attr('id');
        if (sendData.consumerGroupIds) {
          sendData.consumerGroupIds = sendData.consumerGroupIds.replace(
            /\{|\}/g,
            ''
          );
        }
        // sendData.customerId = 0;
        sendData.endPrice = $('#search-price-upper').val() || '';
        sendData.endProductGrams = $('#search-weight-upper').val() || '';
        // sendData.endTime = '';
        // sendData.id = 0;
        sendData.pageNum = $scope.currentPage + '';
        sendData.pageSize = $scope.pageSize + '';
        // sendData.shopId = 0;
        // sendData.sku =
        //   $scope.topSearchKey == 'SKU' ? $scope.topSearchVal || '' : '';
        // sendData.sortType = '';
        sendData.startPrice = $('#search-price-lower').val() || '';
        sendData.startProductGrams = $('#search-weight-lower').val() || '';
        sendData.status = $scope.merchanStatus + '';
        // sendData.title =
        //   $scope.topSearchKey == ('CH' || 'EN')
        //     ? $scope.topSearchVal || ''
        //     : '';
        sendData.attribute = $scope.searchProperVals.join(); // 属性
        sendData.material = $scope.searchMateVals.join(); // 材质

        // topsearch
        sendData[$scope.topSearchKey] = $scope.topSearchVal || '';
        // 销售类型
        // sendData.salesType = $scope.salesType
        return sendData;
      }

      $scope.$on('pagedata-fa', function(d, data) {
        $scope.currentPage = data.pageNum;
        $scope.pageSize = data.pageSize;
        $scope.getCurrentFirstList();
      });

      // 请求商品列表
      $scope.getCurrentFirstList = function() {
        const sendData = getListSendData();
        let requestUrl = $scope.getListUrl;
        if ($scope.merchanStatus == '6') {
          // 回收站和其他列表 请求区分
          requestUrl = $scope.recycleBinUrl;
          sendData.status = undefined;
        }
        getMerchanList(
          requestUrl,
          sendData,
          function(data) {
            var data = data.data;
            if (data.code != 200) {
              layer.msg(data.error);
              return false;
            }
            var result = data.data;
            $scope.totalNum = +result.total;
            if ($scope.totalNum == 0) {
              $scope.hasMerch = false;
              $scope.merchList = [];
              erp.addNodataPic($('.erp-load-box'), 400);
              return false;
            }
            erp.removeNodataPic($('.erp-load-box'));
            $scope.hasMerch = true;
            $scope.merchList = result.list;
            // $scope.totalNum = resultNum;
            $scope.checkAllMark = false;

            // settleListData(data);
            $scope.$broadcast('page-data', {
              pageSize: $scope.pageSize,
              pageNum: $scope.currentPage,
              // totalNum: result.page,
              totalCounts: $scope.totalNum,
              pageList: ['30', '50', '100']
            });
          },
          function() {
            layer.msg('网络错误！');
          }
        );
      };
      $scope.getCurrentFirstList();

      // 选中当前商品
      $scope.checkAllMark = false;
      $scope.checkMerchArr = [];
      $scope.checkMerch = function(item, index, e) {
        console.log(item.checked);
        console.log(item.isCopy);
        if (
          item.checked &&
          $scope.checkMerchArr.length > 0 &&
          item.isCopy != $scope.checkMerchArr[0].isCopy
        ) {
          layer.msg('请选择同类型的商品批量操作');
          e.preventDefault();
          return;
        }
        if (item.checked) {
          $scope.checkMerchArr.push(item);
        } else {
          $scope.checkMerchArr.splice($scope.checkMerchArr.indexOf(item), 1);
        }
        console.log($scope.checkMerchArr);
        var checkedNum = 0;
        for (var i = 0; i < $scope.merchList.length; i++) {
          if ($scope.merchList[i]['checked'] == true) {
            checkedNum++;
          }
        }
        // console.log(checkedNum);
        if (checkedNum == $scope.merchList.length) {
          $scope.checkAllMark = true;
        } else {
          $scope.checkAllMark = false;
        }
      };

      // 选中所有商品
      $scope.checkAllMerch = function(checkAllMark, e) {
        // $scope.checkMerchArr = [];
        if (checkAllMark) {
          var temArr = [];
          for (var i = 0; i < $scope.merchList.length; i++) {
            if (temArr.indexOf($scope.merchList[i].isCopy) == -1) {
              temArr.push($scope.merchList[i].isCopy);
            }
          }
          if (temArr.length > 1) {
            layer.msg('请选择同类型的商品批量操作');
            e.preventDefault();
            return;
          }
          $scope.checkMerchArr = $scope.merchList;
          console.log($scope.checkMerchArr);
        } else {
          $scope.checkMerchArr = [];
          console.log($scope.checkMerchArr);
        }
        for (var i = 0; i < $scope.merchList.length; i++) {
          $scope.merchList[i].checked = checkAllMark;
        }

        // merchan.checkAllMerch(checkAllMark, $scope.merchList)
      };

      // 搜索
      $scope.getSearchList = function() {
        $scope.currentPage = 1;
        $scope.getCurrentFirstList();
      };
      $scope.enterSearch = function(event) {
        if (event.keyCode == 13) {
          $scope.getSearchList();
        }
      };

      $scope.goSearchAuth = function() {
        $scope.getCurrentFirstList();
      };
      // 收起筛选
      $scope.showHideSerch = function($event) {
        var $this = $($event.currentTarget);
        $('.drop-down-search').slideToggle('normal');
        $this.toggleClass('show');
        if ($this.hasClass('show')) {
          $this.find('.text').html('收起筛选');
          $this.find('.caret').css('transform', 'rotate(180deg)');
        } else {
          $this.find('.text').html('展开筛选');
          $this.find('.caret').css('transform', 'rotate(0deg)');
        }
      };
      $scope.afterGetSearch = function() {
        merchan.getCateListOne(function(data) {
          $scope.categoryListOne = data;
        });
        $('.serch-by-property')
          .find('input[type=checkbox]')
          .click(function() {
            if ($(this).prop('checked') == true) {
              if ($.inArray($(this).val(), $scope.searchProperVals) == -1) {
                $scope.searchProperVals.push($(this).val());
                $scope.getSearchList();
              }
            } else {
              if ($.inArray($(this).val(), $scope.searchProperVals) != -1) {
                $scope.searchProperVals.splice(
                  $.inArray($(this).val(), $scope.searchProperVals),
                  1
                );
                $scope.getSearchList();
              }
            }
          });
        $('.serch-by-material')
          .find('input[type=checkbox]')
          .click(function() {
            if ($(this).prop('checked') == true) {
              if ($.inArray($(this).val(), $scope.searchMateVals) == -1) {
                $scope.searchMateVals.push($(this).val());
                $scope.getSearchList();
              }
            } else {
              if ($.inArray($(this).val(), $scope.searchMateVals) != -1) {
                $scope.searchMateVals.splice(
                  $.inArray($(this).val(), $scope.searchMateVals),
                  1
                );
                $scope.getSearchList();
              }
            }
          });
      };

      // 搜索商品类目
      $scope.showCategory = function() {
        $('.cate-list-box').show();
      };
      $scope.selectCategory = function($event, id) {
        var thirdMenu = $($event.target).html();
        $('.search-cate-name')
          .find('.text')
          .html(thirdMenu);
        if (id) {
          $('.search-cate-name')
            .find('.text')
            .attr('id', id);
        } else {
          $('.search-cate-name')
            .find('.text')
            .attr('id', '');
        }
        $('.cate-list-box').hide();
        $scope.getSearchList();
      };
      // 搜索消费人群
      $scope.showConsumerList = function() {
        $('.consumer-list-box').show();
        merchan.getCustomerListOne(function(data) {
          $scope.consumerListOne = data;
        });
      };
      $scope.getConsumerSecondList = function(id) {
        merchan.getCustomerListTwo(id, function(data) {
          $scope.consumerListTwo = data;
        });
      };
      $scope.getConsumerThirdList = function(id) {
        merchan.getCustomerListThree(id, function(data) {
          $scope.consumerListThird = data;
          if (data[0] == null) {
            $('.consumer-list-box')
              .find('.grade-three-ul')
              .hide();
          }
        });
      };
      $scope.selectConsumer = function($event, id) {
        var thirdMenu = $($event.target).html();
        $('.consumer-group-name')
          .find('.text')
          .html(thirdMenu);
        if (id) {
          $('.consumer-group-name')
            .find('.text')
            .attr('id', id);
        } else {
          $('.consumer-group-name')
            .find('.text')
            .attr('id', '');
        }
        $('.consumer-list-box').hide();
        $scope.getSearchList();
      };

      $scope.changeListStatus = function(listStatus) {
        if (listStatus) {
          $scope.merchanFlag = '1';
          $scope.getCurrentFirstList();
        } else {
          $scope.merchanFlag = '0';
          $scope.getCurrentFirstList();
        }
      };

      $scope.stopPropagation = function(e) {
        e.stopPropagation();
      };
      $scope.dropEdit = function(item) {
        window.open(
          'manage.html#/merchandise/edit-detail/' +
            item.id +
            '/' +
            1 +
            '/' +
            $scope.merchanStatus +
            '/' +
            (item.productType || 0),
          '_blank',
          ''
        );
      };
      $scope.detailEdit = function(item) {
        if (!$scope.isAdminLogin && item.productType == '1') {
          layer.msg('服务商品仅管理员可以修改');
          return;
        }
        if ($scope.merchanStatus == '1') {
          window.open(
            'manage.html#/merchandise/edit-detail/' +
              item.id +
              '/' +
              item.isCopy +
              '/' +
              $scope.merchanStatus +
              '/' +
              (item.productType || 0),
            '_blank',
            ''
          );
        } else {
          window.open(
            'manage.html#/merchandise/edit-detail/' +
              item.id +
              '/' +
              $scope.merchanFlag +
              '/' +
              $scope.merchanStatus +
              '/' +
              (item.productType || 0),
            '_blank',
            ''
          );
        }
      };
      $scope.showDetail = function(item) {
        window.open(
          'manage.html#/merchandise/show-detail/' +
            item.id +
            '/' +
            (item.isCopy || '0') +
            '/' +
            $scope.merchanStatus +
            '/' +
            (item.productType || 0),
          '_blank',
          ''
        );
      };

      $scope.toFrontDetail = function(id) {
        if ($scope.merchanStatus != '3') return;
        var toUrl = window.open();
        if ($scope.merchanStatus == '3') {
          // cj/locProduct/rollToken
          erp.getFun(
            'cj/locProduct/rollToken?id=' + id,
            function(data) {
              var data = data.data;
              if (data.code != 200) {
                console.log(data);
                return;
              }
              var detailToken = data.result;
              if (window.environment === '##development##') {
                //开发
                toUrl.location.href =
                  'https://app.cjdropshipping.com/product-detail.html?id=' +
                  id +
                  '&token=' +
                  detailToken;
              } else if (window.environment === '##test##') {
                //测试
                toUrl.location.href =
                  'http://app.test.com/product-detail.html?id=' +
                  id +
                  '&token=' +
                  detailToken;
              } else if (window.environment === '##production##') {
                //线上
                toUrl.location.href =
                  'https://app.cjdropshipping.com/product-detail.html?id=' +
                  id +
                  '&token=' +
                  detailToken;
              }
            },
            function(err) {
              console.log(err);
            }
          );
        }
      };

      // 修改类目
      $scope.rListAfterChCate = function(merchId, cateId, cateName) {
        if ($.isArray(merchId)) {
          for (var i = 0; i < merchId.length; i++) {
            var changeIndex = erp.findIndexByKey(
              $scope.merchList,
              'id',
              merchId[i]
            );
            $('.merchan-list-con')
              .eq(changeIndex)
              .find('.li-category')
              .html(cateName);
            $scope.merchList[changeIndex].categoryId = cateId;
            if ($scope.searchCateName) {
              if (cateId != $scope.searchCateName) {
                $('.merchan-list-con-wrap')
                  .eq(changeIndex)
                  .remove();
                $scope.merchList.splice(changeIndex, 1);
                // console.log(changeIndex);
              }
            }
          }
        } else {
          var changeIndex = erp.findIndexByKey($scope.merchList, 'id', merchId);
          $('.merchan-list-con')
            .eq(changeIndex)
            .find('.li-category')
            .html(cateName);
          $scope.merchList[changeIndex].categoryId = cateId;
          if ($scope.searchCateName) {
            if (cateId != $scope.searchCateName) {
              $('.merchan-list-con-wrap')
                .eq(changeIndex)
                .remove();
              $scope.merchList.splice(changeIndex, 1);
            }
          }
        }
      };
      $scope.changeCate = function(item) {
        merchan.changeCate(item, $scope, '2', function(
          idsArr,
          changeCateId,
          changeCateName
        ) {
          $scope.rListAfterChCate(idsArr, changeCateId, changeCateName);
        });
      };
      $scope.banchChangeCate = function() {
        var changeIds = merchan.getBanchIds($scope.merchList);
        if (changeIds.length == 0) {
          layer.msg('请选择商品！');
          return false;
        }
        merchan.changeCate(changeIds, $scope, '2', function(
          idsArr,
          changeCateId,
          changeCateName
        ) {
          $scope.rListAfterChCate(idsArr, changeCateId, changeCateName);
        });
      };

      $scope.offlineAssign = function(item) {
        merchan.offLineAssign(item, $scope);
      };

      $scope.rListAfterChAuth = function(merchId, flag, userInfo) {
        var changeIndex = erp.findIndexByKey($scope.merchList, 'id', merchId);
        // $('.merchan-list-con').eq(changeIndex).find('.li-authority').html(flag == '1' ? '全部可见' : '部分可见');
        if (flag == '1') {
          $('.merchan-list-con')
            .eq(changeIndex)
            .find('.li-authority')
            .html('全部可见')
            .removeClass('add-cursor');
        } else {
          $('.merchan-list-con')
            .eq(changeIndex)
            .find('.li-authority')
            .html('部分可见')
            .addClass('add-cursor');
        }
        $scope.merchList[changeIndex].authorityStatus = flag * 1;

        if (flag == '1') {
          $scope.merchList[changeIndex].autAccId = {};
        } else {
          var tem = $scope.merchList[changeIndex].autAccId;
          console.log(tem);
          if (tem == '') {
            tem = {};
          }
          // tem = JSON.parse(tem);
          tem[userInfo.id] = {
            id: userInfo.id,
            loginName: userInfo.loginName,
            name: userInfo.name,
            operator: $scope.userName,
            autAccDate: {
              time: new Date().getTime()
            }
          };
          $scope.merchList[changeIndex].autAccId = tem;
          // $scope.merchList[changeIndex].autAccId = JSON.stringify(tem);
        }
      };

      $scope.authoOneUser = function(item) {
        merchan.authoOneUser(item, $scope, function(userInfo) {
          $scope.rListAfterChAuth(item.id, '0', userInfo);
        });
      };
      $scope.authoAllUser = function(item) {
        var authoUserData = {
          productId: item.id,
          autAccId: '',
          autAccName: '',
          autAccPhone: '',
          flag: '0'
        };
        console.log(JSON.stringify(authoUserData));
        erp.postFun(
          'pojo/product/changeAut',
          JSON.stringify(authoUserData),
          function(data) {
            var data = data.data;
            console.log(data);
            if (data.code != 200) {
              if (data.code == 204) {
                layer.msg('请登录后操作！');
                return false;
              }
              layer.msg(data.error || '服务器错误，操作失败！');
              return false;
            }
            layer.msg('操作成功');
            $scope.rListAfterChAuth(item.id, '1');
          },
          function(err) {
            layer.msg('网络错误');
          }
        );
      };
      // 展示可见用户
      var deleteUserId;
      $scope.showPartUsers = function(item) {
        // if (item.authorityStatus == 1) return;
        $scope.nowOpeItem = item;
        deleteUserId = [];
        var getUrl;
        if (item.authorityStatus == 1) {
          getUrl = 'pojo/product/getAssignAccount?pid=';
        } else {
          getUrl = 'pojo/product/getAutAcc?pid=';
        }
        layer.load(2);
        erp.getFun(
          getUrl + item.id,
          function(data) {
            layer.closeAll('loading');
            var data = data.data;
            if (item.authorityStatus == 0) {
              if (data.code == 204) {
                layer.msg(data.message);
                return;
              }
              var authUserInfo = JSON.parse(data.result);
              var temArr = [];
              for (var k in authUserInfo) {
                temArr.push(authUserInfo[k]);
              }
              $scope.authUserList = temArr;
              temArr = null;
            } else {
              $scope.authUserList = JSON.parse(data.result);
            }
            console.log($scope.authUserList);
            $scope.showUserFlag = true;
          },
          function(err) {
            layer.closeAll('loading');
            layer.msg('网络错误');
          }
        );
      };
      $scope.deleteOneUser = function(item, index) {
        deleteUserId.push(item.id);
        $scope.authUserList.splice(index, 1);
      };
      $scope.goDeleteUser = function() {
        console.log(deleteUserId);
        if (deleteUserId.length > 0 && $scope.nowOpeItem.authorityStatus == 0) {
          var dUserData = {
            pid: $scope.nowOpeItem.id,
            autAccId: deleteUserId.join(',')
          };
          layer.load(2);
          erp.postFun(
            'pojo/product/deleteAuthority',
            JSON.stringify(dUserData),
            function(data) {
              layer.closeAll('loading');
              var data = data.data;
              if (data.code != 200) {
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
            },
            function(err) {
              layer.closeAll('loading');
              layer.msg('网络错误，删除失败！');
            }
          );
        } else {
          $scope.showUserFlag = false;
        }
      };

      $scope.freshListAfterOpe = function(opeIds, id) {
        if (id == 'deleteall') {
          $('.merchan-list-con-wrap').each(function() {
            $(this).remove();
          });
          $scope.merchList = [];
          return;
        }
        if ($.isArray(opeIds)) {
          for (var i = 0; i < opeIds.length; i++) {
            var changeIndex = erp.findIndexByKey(
              $scope.merchList,
              'id',
              opeIds[i]
            );
            $('.merchan-list-con-wrap')
              .eq(changeIndex)
              .remove();
            $scope.merchList.splice(changeIndex, 1);
          }
          // 重置状态
          if ($scope.checkAllMark) {
            $scope.checkAllMark = false;
            $scope.merchList.forEach(i => (i.checked = false));
            $scope.$apply();
          }
          $scope.checkMerchArr = [];
          console.log($scope.checkMerchArr);
        } else {
          var changeIndex = erp.findIndexByKey($scope.merchList, 'id', id);
          $('.merchan-list-con-wrap')
            .eq(changeIndex)
            .remove();
          $scope.merchList.splice(changeIndex, 1);
        }
      };
      // erp.postFun('app/logistic/getcountry', null, function (data) {
      //     if (data.data.code == 200) {
      //         $scope.countrylist = JSON.parse(data.data.result).countryList;
      //     }
      // })

      // 审核通过
      $scope.goActPass = function(item) {
        var opeIds;
        var flag;
        var id;
        var productType;
        if (item == undefined) {
          if ($scope.checkMerchArr.length == 0) {
            layer.msg('请选择商品！');
            return false;
          }
          opeIds = [];
          for (var i = 0; i < $scope.checkMerchArr.length; i++) {
            opeIds.push($scope.checkMerchArr[i].id);
          }
          id = opeIds.join(',');
          flag = $scope.checkMerchArr[0].isCopy;
          productType = $scope.checkMerchArr[0].productType || 0;
        } else {
          id = item.id;
          flag = item.isCopy;
          productType = item.productType || 0;
        }
        layer.open({
          title: null,
          type: 1,
          area: ['374px', '290px'],
          skin: 'offline-assign-layer',
          closeBtn: 0,
          shade: [0.1, '#000'],
          content: '<h5>审核商品</h5><p class="is-concern">确定审核通过?</p>',
          btn: ['取消', '确认'],
          yes: function(index, layero) {
            layer.close(index);
          },
          btn2: function(index, layero) {
            var passData = {};
            passData.ids = id;
            // passData.flag = $scope.merchanFlag;
            passData.flag = flag;
            passData.isSuccess = 'true';
            passData.productType = productType;
            layer.load(2);
            // erp.load();
            erp.postFun(
              'pojo/product/audit',
              JSON.stringify(passData),
              function(data) {
                erp.closeLoad();
                // $scope.isInAuth = false;
                var data = data.data;
                if (data.code != 200) {
                  layer.msg(data.error || '服务器错误，操作失败！');
                  return false;
                }
                layer.close(index);
                layer.msg(
                  '操作成功',
                  {
                    time: 1000
                  },
                  function() {
                    $scope.freshListAfterOpe(opeIds, id);
                    // getItemNums();
                  }
                );
              },
              function(err) {
                erp.closeLoad();
                // $scope.isInAuth = false;
                layer.msg('网络错误');
              }
            );
            return false; //开启该代码可禁止点击该按钮关闭
          }
        });
      };
      // 审核不通过
      $scope.goForbidPass = function(item) {
        var opeIds;
        var flag;
        var id;
        if (item == undefined) {
          if ($scope.checkMerchArr.length == 0) {
            layer.msg('请选择商品！');
            return false;
          }
          opeIds = [];
          for (var i = 0; i < $scope.checkMerchArr.length; i++) {
            opeIds.push($scope.checkMerchArr[i].id);
          }
          id = opeIds.join(',');
          flag = $scope.checkMerchArr[0].isCopy;
        } else {
          id = item.id;
          flag = item.isCopy;
        }
        layer.open({
          title: null,
          type: 1,
          area: ['374px', '290px'],
          skin: 'offline-assign-layer forbid-pass-layer',
          closeBtn: 0,
          shade: [0.1, '#000'],
          content: $('#forbid-pass').html(),
          btn: ['取消', '确认'],
          success: function(layero, index) {
            if (item == undefined) {
              $(layero)
                .find('.pro-info')
                .hide();
            } else {
              $(layero)
                .find('.pro-img')
                .attr('src', item.bigImg);
              $(layero)
                .find('.pro-name')
                .html(item.nameEn);
              $(layero)
                .find('.pro-sku')
                .html(item.sku);
            }
          },
          yes: function(index, layero) {
            layer.close(index);
          },
          btn2: function(index, layero) {
            console.log($scope.isInAuth2);
            var forbidReason = $('#forbid-pass-reason').val() || '';
            var passData = {};
            passData.ids = id;
            passData.flag = flag;
            // passData.flag = $scope.merchanFlag;
            passData.isSuccess = 'false';
            passData.explain = forbidReason;
            passData.productType = item.productType || 0;
            // $scope.isInAuth = true;
            // erp.load();
            layer.load(2);
            erp.postFun(
              'pojo/product/audit',
              JSON.stringify(passData),
              function(data) {
                erp.closeLoad();
                // $scope.isInAuth = false;
                var data = data.data;
                if (data.code != 200) {
                  layer.msg(data.error || '服务器错误，操作失败！');
                  return false;
                }
                layer.close(index);
                layer.msg(
                  '操作成功',
                  {
                    time: 1000
                  },
                  function() {
                    $scope.freshListAfterOpe(opeIds, id);
                    // getItemNums();
                  }
                );
              },
              function(err) {
                erp.closeLoad();
                // $scope.isInAuth = false;
                layer.msg('网络错误');
              }
            );
            return false; //开启该代码可禁止点击该按钮关闭
          }
        });
      };
      // 获取选中的id
      function getBanchIds(arr) {
        var banchIds = [];
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].checked == true) banchIds.push(arr[i].id);
        }
        return banchIds;
      }
      // 下架商品
      $scope.goActOffShelves = function(item) {
        $scope.currentProduct = item;
        var opeIds;
        var id;
        if (item == undefined) {
          opeIds = merchan.getBanchIds($scope.merchList);
          // return
          if (opeIds.length == 0) {
            layer.msg('请选择商品！');
            return false;
          }
          id = opeIds.join(',');
        } else {
          id = item.id;
        }
        layer.open({
          title: null,
          type: 1,
          area: ['374px', '290px'],
          skin: 'offline-assign-layer forbid-pass-layer',
          closeBtn: 0,
          shade: [0.1, '#000'],
          content: $('#off-shelve').html(),
          btn: ['取消', '确认'],
          success: function(layero, index) {
            if (item == undefined) {
              $(layero)
                .find('.pro-info')
                .hide();
            } else {
              $(layero)
                .find('.pro-img')
                .attr('src', item.imageUrl);
              $(layero)
                .find('.pro-name')
                .html(item.title);
              $(layero)
                .find('.pro-sku')
                .html(item.sku);
              if (item.authorityStatus == 1) {
                layer.load(2);
                erp.getFun(
                  'pojo/product/getAssignAccount?pid=' + item.id,
                  function(data) {
                    layer.closeAll('loading');
                    var data = data.data;
                    var authUserInfo = JSON.parse(data.result);
                    if (authUserInfo.length == 0) {
                      $(layero)
                        .find('.warn')
                        .hide();
                    } else {
                      $(layero)
                        .find('.warn')
                        .html('该商品有指派关系！！')
                        .show();
                    }
                  },
                  function(err) {
                    layer.closeAll('loading');
                    layer.msg('网络错误');
                  }
                );
              } else {
                $(layero)
                  .find('.warn')
                  .html('该商品是私有商品！！')
                  .show();
              }
              if (item.isClientDesign == '2') {
                $(layero)
                  .find('.warn')
                  .html('该商品是客户设计商品！！')
                  .show();
              }
            }
          },
          yes: function(index, layero) {
            layer.close(index);
          },
          btn2: function(index, layero) {
            var forbidReason = $('#off-shelve-reason').val() || '';
            if (!forbidReason) {
              layer.msg('请输入下架原因');
              return false;
            }
            var passData = {};
            passData.ids = opeIds || [id];
            passData.reason = forbidReason;
            passData.status = 4;
            if ($scope.merchType == '1') {
              // 服务商品下架标记
              passData.sign = '1';
            }
            layer.load(2);
            updateProduct(passData, index, [passData.ids]);
            return false; //开启该代码可禁止点击该按钮关闭
          }
        });
      };
      // 上架商品
      $scope.goActOnShelves = function(item) {
        const selected = $scope.checkMerchArr.map(i => i.id);
        if (!item && selected.length < 1) {
          return layer.msg('请先选择商品');
        }
        layer.confirm(
          '<p style="font-weight: 900;">是否确认上架该商品？</p><p style="color:#999;">通过后则商户商品将在其商店正常展示，请谨慎操作</p>',
          {
            icon: 3,
            title: '提示'
          },
          function(index) {
            const query = {
              status: '1'
            };
            query.ids = item ? [item.id] : selected;
            const params = {
              count: 1,
              supplierId: item.supplierId
            }
            erp.postFun("erpSupplierPlan/checkSupplierPlan", params, function(res) {
              console.log(res);
              if (res.data.code === 200) {
                updateProduct(query, index, [query.ids]);
                
              } else {
                layer.confirm(
                  '<p style="font-weight: 900;">警告！</p><p style="color:#999;">如果同意上架该产品，则会超出该供应商能上传商品最大数，是否确定上架该商品。</p>',
                  {
                    icon: 2,
                    title: '提示'
                  },function(index2) {
                    updateProduct(query, index, [query.ids], index2);
                  }
                )
              }})
          }
        );
      };
      // 商品恢复
      $scope.productRepublish = function(item) {
        const selected = $scope.checkMerchArr.map(i => i.id);
        if (!item && selected.length < 1) {
          return layer.msg('请先选择商品');
        }
        layer.confirm(
          '<p style="font-weight: 900;">是否确认恢复该商品？</p><p style="color:#999;">确认后该商品将会被移入已下架菜单中，请谨慎操作。</p>',
          {
            icon: 3,
            title: '提示'
          },
          function(index) {
            const query = {
              ids: item ? [item.id] : selected
            };
            layer.load();
            erp.postFun(
              $scope.recoverProductUrl,
              JSON.stringify(query),
              function(data) {
                erp.closeLoad();
                var data = data.data;
                if (data.code != 200) {
                  layer.msg(data.error || '服务器错误，操作失败！');
                  return false;
                }
                layer.close(index);
                layer.msg(
                  '操作成功',
                  {
                    time: 1000
                  },
                  function() {
                    $scope.freshListAfterOpe(query.ids);
                  }
                );
              },
              function(err) {
                erp.closeLoad();
                layer.msg('网络错误');
              }
            );
          }
        );
      };
      // 商品永久删除
      $scope.productDelete = function(item) {
        const selected = $scope.checkMerchArr.map(i => i.id);
        if (!item && selected.length < 1) {
          return layer.msg('请先选择商品');
        }
        layer.confirm(
          '<p style="font-weight: 900;">是否永久删除该商品？</p><p style="color:#999;">确认后该商品将会被永久删除，请谨慎操作。</p>',
          {
            icon: 3,
            title: '提示'
          },
          function(index) {
            const query = {
              ids: item ? [item.id] : selected
            };
            layer.load();
            erp.postFun(
              $scope.realDeleteUrl,
              JSON.stringify(query),
              function(data) {
                erp.closeLoad();
                var data = data.data;
                if (data.code != 200) {
                  layer.msg(data.error || '服务器错误，操作失败！');
                  return false;
                }
                layer.close(index);
                layer.msg(
                  '操作成功',
                  {
                    time: 1000
                  },
                  function() {
                    $scope.freshListAfterOpe(query.ids);
                  }
                );
              },
              function(err) {
                erp.closeLoad();
                layer.msg('网络错误');
              }
            );
          }
        );
      };

      // 批量操作
      // $scope.batchAction = function (action) {
      //     const actions = {
      //         'onShelves': '',
      //         'offShelves': '',
      //     }
      // }

      /**
       * 更新商品请求
       * @param {obj} query 修改商品的参数
       * @param {*} index layer弹窗标识
       * @param {array} freshParams 刷新列表的参数 [ids,isDelateAll?]
       */
      function updateProduct(query, index, freshParams, index2) {
        layer.load();
        erp.postFun(
          $scope.updateUrl,
          JSON.stringify(query),
          function(data) {
            erp.closeLoad();
            var data = data.data;
            if (data.code != 200) {
              layer.msg(data.error || '服务器错误，操作失败！');
              return false;
            }
            layer.close(index);
            layer.close(index2);
            layer.msg(
              '操作成功',
              {
                time: 1000
              },
              function() {
                $scope.freshListAfterOpe(...freshParams);
              }
            );
          },
          function(err) {
            erp.closeLoad();
            layer.msg('网络错误');
          }
        );
      }

      // 回收站
      // pojo/product/clearRecycle
      // {ids,flag}
      // 清空     ids="DELETEALL"  大小写不限    爬虫  flag=0   本地flag=1
      $scope.goActClear = function(id) {
        var opeIds;
        var passIds;
        if (id == undefined) {
          opeIds = merchan.getBanchIds($scope.merchList);
          console.log(opeIds);
          // return
          if (opeIds.length == 0) {
            layer.msg('请选择商品！');
            return false;
          }
          passIds = opeIds.join(',');
        } else if (id == 'deleteall') {
          opeIds = [];
          for (var i = 0; i < $scope.merchList.length; i++) {
            opeIds.push($scope.merchList[i].id);
          }
          passIds = opeIds.join(',');
        } else {
          passIds = id;
        }
        // return console.log(passIds, $scope.merchList)
        layer.open({
          title: null,
          type: 1,
          area: ['374px', '290px'],
          skin: 'offline-assign-layer',
          closeBtn: 0,
          shade: [0.1, '#000'],
          content:
            id == 'deleteall'
              ? '<h5>清空回收站</h5><p class="is-concern">确定清空回收站?</p>'
              : '<h5>删除商品</h5><p class="is-concern">确定删除商品?</p>',
          btn: ['取消', '确认'],
          yes: function(index, layero) {
            layer.close(index);
          },
          btn2: function(index, layero) {
            var passData = {};
            passData.ids = passIds;
            passData.flag = '1';
            erp.postFun(
              'pojo/product/clearRecycle',
              JSON.stringify(passData),
              function(data) {
                var data = data.data;
                if (data.code != 200) {
                  layer.msg(data.error || '服务器错误，操作失败！');
                  return false;
                }
                layer.msg(
                  '删除成功',
                  {
                    time: 1000
                  },
                  function() {
                    $scope.freshListAfterOpe(opeIds, id);
                    // getItemNums();
                    layer.close(index);
                    $scope.getSearchList();
                  }
                );
              },
              function(err) {
                layer.msg('网络错误');
              }
            );
            return false; //开启该代码可禁止点击该按钮关闭
          }
        });
      };

      // {ids,flag,explain}
      // 删除商品
      $scope.goActDelete = function(item) {
        var opeIds;
        var flag;
        var id;
        if (item == undefined) {
          var opeMerchs = [];
          for (var i = 0; i < $scope.merchList.length; i++) {
            if ($scope.merchList[i].checked == true)
              opeMerchs.push($scope.merchList[i]);
          }
          if (opeMerchs.length == 0) {
            layer.msg('请选择商品！');
            return false;
          }
          opeIds = [];
          for (var i = 0; i < opeMerchs.length; i++) {
            if (opeMerchs[i].authorityStatus == 0 && !$scope.isAdminLogin) {
              layer.msg('勾选的商品包含指定可见商品，指定可见商品不能删除！');
              return false;
            } else {
              opeIds.push(opeMerchs[i].id);
            }
          }
          id = opeIds;
          if ($scope.merchanStatus == '1') {
            flag = opeMerchs[0].isCopy;
            console.log(opeMerchs[0], flag);
          } else {
            flag = $scope.merchanFlag;
          }
        } else {
          if (item.authorityStatus == 0 && !$scope.isAdminLogin) {
            layer.msg('指定可见商品不能删除！');
            return false;
          }
          id = [item.id];
          if ($scope.merchanStatus == '1') {
            flag = item.isCopy;
          } else {
            flag = $scope.merchanFlag;
          }
        }
        layer.open({
          title: null,
          type: 1,
          area: ['374px', '290px'],
          skin: 'offline-assign-layer',
          closeBtn: 0,
          shade: [0.1, '#000'],
          content: '<h5>删除商品</h5><p class="is-concern">确定删除商品?</p>',
          btn: ['取消', '确认'],
          yes: function(index, layero) {
            layer.close(index);
          },
          btn2: function(index, layero) {
            var deleteData = {};
            deleteData.ids = id;
            // deleteData.flag = $scope.merchanFlag;
            deleteData.flag = flag;
            deleteData.explain = '';
            deleteData = JSON.stringify(deleteData);
            // console.log(deleteData);
            erp.postFun(
              $scope.deleteUrl,
              deleteData,
              function(data) {
                var data = data.data;
                // var data = JSON.parse(data.data);
                console.log(data);
                if (data.code == 200) {
                  layer.msg(
                    '删除成功',
                    {
                      time: 2000
                    },
                    function() {
                      $scope.freshListAfterOpe(opeIds, id);
                      // getItemNums();
                      layer.close(index);
                    }
                  );
                } else if (data.code == 809) {
                  // alert('809');
                  if (item == undefined) {
                    var cannodeleteids = JSON.parse(data.result);
                    var cannodeletenum = cannodeleteids.length;
                    layer.msg(
                      '勾选的商品中有' +
                        cannodeletenum +
                        '个指派商品不能删除，其他删除成功',
                      {
                        time: 2000
                      },
                      function() {
                        for (var i = 0; i < cannodeleteids.length; i++) {
                          opeIds.splice(
                            $.inArray(cannodeleteids[i], opeIds),
                            1
                          );
                        }
                        $scope.freshListAfterOpe(opeIds, id);
                        // getItemNums();
                        layer.close(index);
                      }
                    );
                  } else {
                    layer.msg(
                      '该商品已经指派给客户，不能删除！',
                      {
                        time: 2000
                      },
                      function() {
                        // $scope.freshListAfterOpe(opeIds,id);
                        // getItemNums();
                        layer.close(index);
                      }
                    );
                  }
                } else {
                  layer.msg(data.error || '服务器错误，操作失败！');
                  return false;
                }
              },
              function() {
                layer.msg('网络错误！');
              }
            );
            layer.close(index);
            return false; //开启该代码可禁止点击该按钮关闭
          }
        });
      };

      $scope.setPrivForever = function(item, i) {
        merchan.opePrivForever(item, '1', function() {
          $scope.merchList[i].isAut = '1';
          $scope.$apply();
        });
      };
      $scope.cancelPrivForever = function(item, i) {
        merchan.opePrivForever(item, '0', function() {
          $scope.merchList[i].isAut = '0';
          $scope.$apply();
        });
      };

      $scope.viewSaleType = function (type) {
        console.log(type)
        return +type === 0 ? '现货' : '预售';
      }
    }
  ]);
})();
