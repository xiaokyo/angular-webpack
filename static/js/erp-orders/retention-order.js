
/**
 * 滞留订单
 * 19-03-28 wjw
 */

; (function () {
  var Gscope = null;

  function assembleRepositoryOptions(d) {
    (Gscope.options1 = d).forEach(json => {
      if (json.storageName === '义乌仓') {
        Gscope.storageID = json.id; // 默认义乌仓
        getStorageRetentionInfo(json.id);
      }
    });
  }

  function getStorageRetentionInfo(id, page) {
    Gscope.apiStorage.getStorageRetentionInfo(id)
      .then(res => Gscope.topBarAmount = res)
      .then(_ => getSkuStorageRetentionInfo({ page: Gscope.page = page || Gscope.page }));
  }

  function getSkuStorageRetentionInfo(json = {}) {
    if (Gscope.date.s || Gscope.date.e) changeDayFn({}); // 有时间区间时，范围天数重置

    Gscope.apiStorage.getSkuStorageRetentionInfo(Object.assign({
      stroageType: Gscope.storageType, // 库存类型
      endSales: Gscope.salesVolume.e, // 结束销量
      startSales: Gscope.salesVolume.s, // 开始销量
      endStroageNum: Gscope.existInventory.e, // 结束库存数量
      startStroageNum: Gscope.existInventory.s, // 开始库存数量
      endRetention: Gscope.retentionRate.e, // 结束滞留率
      startRetention: Gscope.retentionRate.s, // 开始滞留率
      endRetentionDay: Gscope.retentionDays.e, // 结束滞留率天数
      startRetentionDay: Gscope.retentionDays.s, // 开始滞留率天数
      storageID: Gscope.storageID, //仓库编号
      page: Gscope.page.toString(), // 当前页
      pageNum: Gscope.pageSize.toString(), // 条数
      name: Gscope.searchStr, // SKU以及商品名称
      days: (function () { for (var x = 0; x < Gscope.days.length; x++) if (Gscope.days[x].active) return Gscope.days[x].val.toString(); }()), // 多少天之内
      startTime: Gscope.date.s, // 开始时间
      endTime: Gscope.date.e, // 结束时间
    }), json)
      .then(res => {
          Gscope.tableData = res;
          Gscope.topBarAmount.ZlMoney = res.ZlMoney; // 19-04-09 滞留金额从下面的请求取得
      })
      .then(_ => {
        // ---------------------------分页
        if (Gscope.tableData.count < 1) return;

        $("#c-pages-fun").jqPaginator({
          totalCounts: +Gscope.tableData.count || 0,//设置分页的总条目数
          pageSize: +Gscope.pageSize,//设置每一页的条目数
          visiblePages: 5,//显示多少页
          currentPage: Gscope.page * 1,
          activeClass: 'active',
          prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
          next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
          page: '<a href="javascript:void(0);">{{page}}<\/a>',
          first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
          last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
          onPageChange: function (n, type) {
            if (type == 'init') {
              return;
            }
            getSkuStorageRetentionInfo({ page: Gscope.page = n });
          }
        });
        // ---------------------------分页
      }).then(sortTable);
  }

  function changePageFun() {
    Gscope.page = 1;
    getSkuStorageRetentionInfo();
  }

  function gopageFun() {
    if (Gscope.page > Gscope.tableData.count / Gscope.pageSize || Gscope.page < 1) return;
    getSkuStorageRetentionInfo();
  }

  function changeDayFn(item) {
    Gscope.days.forEach(json => {
      if (json === item) {
        json.active = true;
        Gscope.date.s = Gscope.date.e = '';
        getSkuStorageRetentionInfo({ page: Gscope.page = 1 });
      } else {
        json.active = false;
      }
    })
  }

  function cleanCondition() {
    Gscope.date = { s: '', e: '' };
    Gscope.retentionDays = { s: '', e: '' };
    Gscope.retentionRate = { s: '', e: '' };
    Gscope.existInventory = { s: '', e: '' };
    Gscope.salesVolume = { s: '', e: '' };
  }

  function sortTable(field = '', position = -1) {
    // 按钮显示
    for (var key in Gscope.sort) Gscope.sort[key].forEach((json, idx) => json.active = key === field && idx === position);

    // 排序
    if (field && position >= 0) Gscope.tableData.list.sort((a, b) => b[Gscope.sort[field][position].field] - a[Gscope.sort[field][position].field]);
  }

  function skipToCJ(item) {
    Gscope.api.toFrontDetail(item.ID);
  }

  function showErpDetail(item) {
    item.merchanStatus = '3'; // '3'已上架，滞留商品当作已上架
    Gscope.api.showErpDetail(item);
  }

  angular
    .module('retention-order', ['api', 'api-storage', 'utils'])
    .controller('retention-order', ['$scope', 'api', 'api-storage', 'utils', function ($scope, api, apiStorage, utils) {
      var oHeader = document.querySelector('#table-header');

      Gscope = $scope;
      Gscope.api = api;
      Gscope.apiStorage = apiStorage;

      $scope.storageID = '';
      $scope.options1 = [];
      $scope.searchStr = '';
      $scope.topBarAmount = {}; // {CkMoney: "0.00", ZlMoney: "-17.00", DckMoney: "17.00", dikouMoney: "0.00"}
      $scope.storageType = 'public';
      $scope.storageOptions = [
        { val: 'public', tag: '公有' },
        { val: 'private', tag: '私有' },
      ];
      $scope.operate1 = '-';
      $scope.operate2 = '-';
      $scope.operate3 = '-';
      $scope.operator = [
        { val: '-', tag: '-' },
        { val: 1, tag: '>' },
        { val: 0, tag: '=' },
        { val: -1, tag: '<' },
      ];
      $scope.date = { s: '', e: '' };
      /*
      $scope.showRange = 'sy';
      $scope.options3 = [
        { val: 'sy', tag: '所有' },
        { val: 'qu', tag: '全部' },
        { val: 'bf', tag: '部分' },
      ];
      */
      $scope.days = [
        { val: 15, active: true, tag: 15 },
        { val: 30, active: false, tag: 30 },
        { val: '', active: false, tag: '全部' },
      ];
      $scope.disable = {
        select: false,
        range: false,
      };
      $scope.retentionDays = { s: '', e: '' };  // 滞留天数
      $scope.retentionRate = { s: '', e: '' };  // 滞留率
      $scope.existInventory = { s: '', e: '' }; // 现有库存
      $scope.salesVolume = { s: '', e: '' };    // 销量
      $scope.sort = {
        existInventory: [
          { active: false, field: 'public' },
          { active: false, field: 'private' }
        ],
        retentionDays: [
          { active: false, field: 'pulRetentionDay' },
          { active: false, field: 'priRetentionDay' }
        ],
        salesVolume: [
          { active: false, field: 'pulSales' },
          { active: false, field: 'priSales' }
        ],
        retentionRate: [
          { active: false, field: 'pulRetention' },
          { active: false, field: 'priRetention' }
        ],
      };
      $scope.page = 1;
      $scope.pageSize = '30';
      $scope.tableData = [];
      $scope.getSkuStorageRetentionInfo = getSkuStorageRetentionInfo;
      $scope.changePageFun = changePageFun;
      $scope.gopageFun = gopageFun;
      $scope.changeDayFn = changeDayFn;
      $scope.getStorageRetentionInfo = getStorageRetentionInfo;
      $scope.cleanCondition = cleanCondition;
      $scope.sortTable = sortTable;
      $scope.skipToCJ = skipToCJ;
      $scope.showErpDetail = showErpDetail;

      api.getStorage().then(res => assembleRepositoryOptions(res));
      $scope.$watch('salesVolume.e', _ => {
        if ($scope.salesVolume.e < $scope.salesVolume.s) $scope.salesVolume.e = $scope.salesVolume.s;
      });
      utils.fixedTop({ el: '#table-header' });
      $scope.copySkuFun = function(sku){
        copyToClipboard (sku)
      }
      function copyToClipboard (text) {
        var textArea = document.createElement("textarea");
          textArea.style.position = 'fixed';
          textArea.style.top = '0';
          textArea.style.left = '0';
          textArea.style.width = '2em';
          textArea.style.height = '2em';
          textArea.style.padding = '0';
          textArea.style.border = 'none';
          textArea.style.outline = 'none';
          textArea.style.boxShadow = 'none';
          textArea.style.background = 'transparent';
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.select();
    
          try {
            var successful = document.execCommand('copy');
            if(successful){
                layer.msg('拷贝成功');
            }
          } catch (err) {
            console.log('该浏览器不支持点击复制到剪贴板');
          }
    
          document.body.removeChild(textArea);
    }
    }]);
}());
