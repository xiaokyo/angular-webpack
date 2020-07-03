(function() {
  var app = angular.module('erp-sourcing-app', ['service', 'ngSanitize']);
  var lang = localStorage.getItem('lang');
  var noData;
  if (lang == null || lang == 'cn') {
    noData = "暂无数据";
  } else if (lang == 'en') {
    noData = "No data";
  }
  // console.log(lang);
  // console.log(noData);


  //客户店铺
  app.controller('estoresourcing-controller', ['$scope', 'erp', '$location', '$routeParams', function($scope, erp, $location, $routeParams) {
    console.log('estoresourcing-controller');
    $scope.soupinType = '1';
    $scope.sortType = '2'; // 2019-11-22 新增排序  1 -- > 按客户等级排序  2 -- > 按提交时间排序
    $scope.whichPage = $routeParams.tabstu; // 2019-11-22 该页面 被哪个模块使用  1 情况下 才有 相似商品 和 搜索条件 加入 客户登记 和 登记时间 
    console.log('whichPage ---> ', $routeParams.tabstu)
    var bs = new Base64();
    $scope.loginJob = localStorage.getItem('job') ? bs.decode(localStorage.getItem('job')) : '';
    console.log($scope.loginJob)
    var orderDate = sessionStorage.getItem('khsp-data-time');
    var orderDate2 = sessionStorage.getItem('khsp-data-time2');
    console.log(orderDate);
    var aDate;
    var enDate;
    $scope.isSetSourceError = false
    let that = this
    // 获取类目
    erp.postFun('erpSupplierSourceProduct/list', {}, res => {
      $scope.categoryList = res.data.data
    })

    $scope.defeated = function(item) {
      $scope.isSetSourceError = true;
      that.no = {
        item,
        type: 'kehu'
      }
    }
    $scope.$on('log-to-father', function(d, flag) {
      console.log(d, flag)
      if (d && flag) {
        $scope.isSetSourceError = flag.closeFlag;
      }
    })
    if (orderDate == null || orderDate == '' || orderDate == undefined) {
      aDate = GetDateStr(-14);
    } else {
      aDate = orderDate
    }
    if (orderDate2 == null || orderDate2 == '' || orderDate2 == undefined) {
      var enDate = GetDateStr(0);
    } else {
      enDate = orderDate2;
      $("#cdatatime2").val(enDate);
    }

    var enDate = GetDateStr(0);
    $("#c-data-time").val(aDate); //关键语句
    //$("#cdatatime2").val(enDate); //关键语句

    $scope.leftDate = $("#c-data-time").val();
    $scope.rightDate = $("#cdatatime2").val();
    console.log($scope.leftDate, $scope.rightDate);
    $scope.pagesize = '10';
    $scope.pagenum = '1';
    $scope.searchinfo = '';
    $scope.statue = '';
    erp.postFun('app/employee/getempbyname', {
      "data": "{'name':'', 'job': '销售'}"
    }, function(data) {
      $scope.salemanList = JSON.parse(data.data.result).list;
      console.log($scope.salemanList);
    });
    erp.postFun('app/account_erp/getAllSalesman', {}, res => {
      $scope.ownerList = JSON.parse(res.data.result)
      console.log($scope.ownerList)
    })
    $scope.changeSaleman = function() {
      $scope.searchinfo = $scope.salemanName;
      $scope.search();
    }
    $scope.changeOwnerName = function() {
      $scope.search();
    }

    $scope.checked = '0'

    function firstRequire() {
      $scope.spsbFlag = false;
      $scope.erpflag = false;
      $scope.erpstuflag = false;
      var ordStatus = $routeParams.tabstu || 0;
      ordStatus = parseInt(ordStatus);
      console.log(ordStatus);
      if (ordStatus == 0) {
        $scope.statue = ''
      }
      if (ordStatus == 1) {
        $scope.statue = '1'
      }
      if (ordStatus == 2) {
        $scope.spsbFlag = true;
        $scope.statue = '2';
      } else {
        $scope.spsbFlag = false;
      }
      if (ordStatus == 3) {
        $scope.statue = '3';
        $scope.erpstuflag = true;
      } else {
        $scope.erpstuflag = false;
      }
      console.log($scope.spsbFlag);
      if (ordStatus == 4) {
        $scope.statue = '8';
        $scope.erpflag = true;
      } else {
        $scope.erpflag = false;
      }
      if (ordStatus == 5) {
        $scope.statue = '-1'
      }
      // 新增等待现有页面
      if (ordStatus == 6) {
        $scope.statue = '6';
      }
      // 新增搜品初审失败页面
      if (ordStatus == 7) {
        $scope.statue = '7';
      }
      console.log($scope.statue);
      var sourceList = {};
      sourceList.data = {};
      sourceList.data.pageSize = $scope.pagesize;
      sourceList.data.pageNum = '1';
      sourceList.data.status = $scope.statue;
      sourceList.data.customerName = $scope.searchinfo;
      // sourceList.data.ownerName = $scope.ownerName;
      // var str=$scope.typearr.join(',');
      sourceList.data.sourcetypes = '0';
      sourceList.data.leftDate = $scope.leftDate;
      sourceList.data.rightDate = $scope.rightDate;
      sourceList.data.type = $scope.soupinType;
      sourceList.data.isFuFei = $scope.checked;
      sourceList.data.sortType = $scope.sortType; // 2019-11-22 新增排序  1 -- > 按客户等级排序  2 -- > 按提交时间排序 
      console.log($scope.checked)
      sourceList.data = JSON.stringify(sourceList.data);
      console.log(JSON.stringify(sourceList));
      layer.load(2);
      erp.postFun('source/sourcing/erpList', JSON.stringify(sourceList), con, function(data) {
        layer.msg('请求失败');
      });

      function con(data) {
        layer.closeAll("loading");
        if (data.data.result) {
          $scope.sourceData = JSON.parse(data.data.result);
        } else {
          layer.msg(noData);
          $scope.sourceDataList = '';
          $scope.countNum = 0; //总条数
          return;
        }
        //$scope.sourceData = JSON.parse(data.data.result);
        console.log($scope.sourceData);
        var date = Date.parse(new Date());
        $scope.sourceData.list.forEach(function(o, i) {
          if (o.jieZhiShiJianStr) {
            var jiezhiDate = (new Date(o.jieZhiShiJianStr.replace(new RegExp("-", "gm"), "/"))).getTime();
            if ((jiezhiDate - date) < 7200000) {
              o.isAct = true;
            }
          }
        })
        $scope.sourceDataList = $scope.sourceData.list.map(item => ({
          ...item,
          calcImg: handleOssImg(item.imageUrl)
        }));
        console.log($scope.sourceDataList);

        // $scope.pagesize = '10';
        if ($scope.sourceData) {
          $scope.countNum = $scope.sourceData.count; //总条数
        } else {
          $scope.countNum = 0;
        }
        $scope.shownum = $scope.countNum;
        // $scope.pagenum=Math.floor($scope.countNum/$scope.pagesize);
        if ($scope.countNum == 0) {
          layer.msg(noData);
          return;
        } else {
          erpsouFun($scope.countNum, $scope.pagesize - 0, 1);
        }
      }
    }

    firstRequire();

    // 供应商报价操作

    $scope.dgzspFlag = false // 单个供应商报价的弹框是否显示
    $scope.plzspFlag = false // 多个供应商报价的弹框是否显示
    $scope.supplierId = ""
    $scope.chooseSource = {}
    $scope.batchChooseSource = [] // 已经选择的搜品
    $scope.supplierList = []
    // 获取供应商列表
    erp.postFun('supplier/user/userInfo/listAccountPage', JSON.stringify({
      pageNum: 1,
      pageSize: 1000
    }), res => {
      $scope.supplierList = res.data.data.list
    })

    // 指派供应商报价操作
    assignSupplier = function(ids, supplierId) {
      layer.load(2);
      const data = {
        ids,
        type: 2,
        supplierId,
      }
      erp.postFun('erpSupplierSourceProduct/updateByIds', JSON.stringify(data), function(res) {
        if (res.data.code == 200) {
          layer.closeAll("loading");
          window.location.reload();
        } else {
          layer.closeAll("loading");
          layer.msg(res.data.error)
        }
      })
    }

    $scope.closeSingleSearch = function() {
      $scope.dgzspFlag = false
    }

    $scope.closeBatchSearch = function() {
      $scope.plzspFlag = false
    }


    $scope.SupplierQuote = function(item) {
      $scope.dgzspFlag = true
      $scope.chooseSource = item
    }

    $scope.hanldeBatchSupplierQuote = function() {
      let num = 0
      let productList = []
      $scope.sourceDataList.map((item) => {
        if (item.checked) {
          productList.push(item)
        }
      })
      $scope.batchChooseSource = productList

      if (productList.length > 0) {
        $scope.plzspFlag = true
      } else {
        layer.msg('请勾选搜品!')
      }
    }

    // 单个的转搜品的确认按钮
    $scope.handleSingleConform = function() {
      if (!$scope.supplierId) {
        layer.msg('请选择供应商!')
        return
      }
      let ids = []
      let supplierId = $scope.supplierId
      ids.push($scope.chooseSource.ID || $scope.chooseSource.id)
      $scope.dgzspFlag = false
      assignSupplier(ids, supplierId)
    }

    // 批量转搜品的确认按钮
    $scope.handleBatchConform = function() {
      if (!$scope.supplierId) {
        layer.msg('请选择供应商!')
        return
      }
      let ids = []
      let supplierId = $scope.supplierId
      $scope.batchChooseSource.map((item) => {
        ids.push(item.ID || item.id)
      })
      $scope.plzspFlag = false
      assignSupplier(ids, supplierId)
    }


    // $scope.xzlmFlag = false;
    // function showCategory(singleItem) {
    //   $scope.xzlmFlag = true
    //   $scope.singleSearchItem = singleItem||'';
    //   $scope.isSingleSearch = singleItem?true:false;
    // } 

    // // 点击单个转供应商报价操作
    // $scope.SupplierQuote = function (item) {
    //   if(item.source_category){
    //     singleToSupplier(item,'')
    //   } else {
    //     showCategory(item)
    //   }
    // }

    // // 点击批量转供应商报价操作
    // $scope.hanldeBatchSupplierQuote = function () {
    //   let num =0
    //   console.log(num,'22222');
    //   $scope.sourceDataList.map((item)=>{
    //     if(item.checked) {
    //       num++
    //     }
    //   })
    //   console.log(num,'33333');
    //   if(num>0) {
    //     showCategory()
    //   }else{
    //     layer.msg('请勾选搜品!')
    //   }
    // }

    // // 选择类目
    // $scope.chooseCateGory = function (id) {
    //   $scope.chooseCateGoryId = id
    // }

    // // 点击取消
    // $scope.closeCategory =function() {
    //   $scope.xzlmFlag = false
    //   $scope.singleSearchItem = '';
    // }

    // // 点击确定
    // $scope.categoryConfirm =function() {
    //   if($scope.chooseCateGoryId){
    //     if($scope.isSingleSearch) {
    //       singleToSupplier($scope.singleSearchItem,$scope.chooseCateGoryId)
    //     }else{
    //       batchToSupplier()
    //     }
    //   }else{
    //      layer.msg("请选择类目")
    //   }
    // }

    // // 多个搜品转供应商
    // function batchToSupplier() {
    //   let productList = []
    //   $scope.sourceDataList.map((item)=>{
    //     if(item.checked) {
    //       productList.push({
    //         categoryId:item.source_category,
    //         sourceProductId:item.ID
    //       })
    //     }
    //   })
    //   const data = {
    //     categoryId:$scope.chooseCateGoryId,
    //     sourceProduct:productList,
    //     sourceProductType:0
    //   }
    //   layer.load(2);
    //   erp.postFun('erpSupplierSourceAllocateRecording/sourceAllocate', JSON.stringify(data), function (res) {
    //     if(res.data.code == 200) {
    //       $scope.xzlmFlag =false
    //       layer.closeAll("loading");
    //       window.location.reload();
    //     }else{
    //       layer.msg(res.data.message)
    //     }
    //   })
    // }

    // // 单个搜品转供应商
    // function singleToSupplier(item,id) {
    //   layer.load(2);
    //   const data = {
    //     categoryId:id,
    //     sourceProduct:[{
    //       categoryId:item.source_category,
    //       sourceProductId:item.ID
    //     }],
    //     sourceProductType:0
    //   }

    //   erp.postFun('erpSupplierSourceAllocateRecording/sourceAllocate', JSON.stringify(data), function (res) {
    //     if(res.data.code == 200) {
    //       $scope.xzlmFlag =false
    //       layer.closeAll("loading");
    //       window.location.reload();
    //     }else{
    //       layer.msg(res.data.message)
    //     }
    //   })
    // }

    // 转供应商报价结束


    //付费客户
    $scope.checkMerch = function(item, e) {
      console.log(item)
      // $scope.checked = !$scope.checked;
      // console.log($scope.checked)
      sourcelist = ''
      if (item.checked == true) {
        // $scope.checked = item.checked
        $scope.checked = '1'
        firstRequire()
      } else {
        $scope.checked = '0'
        firstRequire()
      }
    }

    $scope.selectSoupinType = () => {
      firstRequire();
    }
    $scope.showProName = function(item) {
      if (item.status == '3') {
        window.open('manage.html#/merchandise/show-detail/' + item.CjproductId + '/0/3/0', '_blank', '');
      } else {
        layer.open({
          title: '商品名称',
          content: item.productName
        });
      }
      // layer.open({
      //   title: '商品名称'
      //   ,content: '<span style="margin-right: 20px;">'+item.productName+'</span><a style="font-size: 12px; display: inline-block; width: 100px; height: 24px; line-height: 22px; border: 1px solid #ccc; background: #eee; text-align:center" href="manage.html#/merchandise/show-detail/'+item.CjproductId+'/0/3" target="_blank">查看商品详情</a>'
      // });
    }
    $scope.toShopifyStore = function(shopname) {
      console.log(shopname);
      window.open('https://' + shopname + '.myshopify.com', '_blank', '');
    }




    //描述
    $('.descripte-tankuang').hide();
    $scope.descripteFun = function(item) {
      $scope.word = $(this)[0].sourcelist.description;
      $scope.name = $(this)[0].sourcelist.name;
      $scope.number = $(this)[0].sourcelist.number;

      $('.descripte-tankuang').show();
    }
    $scope.closeDescripte = function() {
      $('.descripte-tankuang').hide();
    }

    //查看失败原因
    $scope.sbtcFlag = false;
    $scope.ckFun = function(item) {
      $scope.sbtcFlag = true;
      $scope.showText = item.failExplain;
    }
    $scope.gbckFun = function() {
      $scope.sbtcFlag = false;
      $scope.showText = '';
    }
    //  搜索
    $(document).keyup(function(event) {
      if (event.keyCode == 13) {
        $("#search").trigger("click");
      }
    });
    //$scope.searchinfo = '';
    //$scope.statue = '';
    $scope.search = function(searchinfo) {
      console.log($scope.statue);
      console.log($scope.searchinfo);
      $scope.pagenum = 1;
      var sourceList = {};
      sourceList.data = {};
      sourceList.data.pageSize = $scope.pagesize;
      sourceList.data.pageNum = $scope.pagenum;
      sourceList.data.status = $scope.statue;
      sourceList.data.customerName = $scope.searchinfo;
      sourceList.data.ownerName = $scope.ownerName;
      // var str=$scope.typearr.join(',');
      sourceList.data.leftDate = $scope.leftDate;
      sourceList.data.rightDate = $scope.rightDate;
      sourceList.data.sourcetypes = '0';
      sourceList.data = JSON.stringify(sourceList.data);
      console.log(JSON.stringify(sourceList));
      layer.load(2);
      erp.postFun('source/sourcing/erpList', JSON.stringify(sourceList), con, function(data) {
        layer.msg('搜索请求失败');
      })

      function con(data) {
        layer.closeAll("loading");
        console.log(data);
        if (data.data.result) {
          $scope.sourceData = JSON.parse(data.data.result);
        } else {
          layer.msg(noData);
          $scope.sourceDataList = '';
          $scope.countNum = 0; //总条数
          return;
        }
        console.log($scope.sourceData);
        var date = Date.parse(new Date());
        $scope.sourceData.list.forEach(function(o, i) {
          if (o.jieZhiShiJianStr) {
            var jiezhiDate = (new Date(o.jieZhiShiJianStr.replace(new RegExp("-", "gm"), "/"))).getTime();
            if ((jiezhiDate - date) < 7200000) {
              o.isAct = true;
            }
          }
        })
        $scope.sourceDataList = $scope.sourceData.list.map(item => ({
          ...item,
          calcImg: handleOssImg(item.imageUrl)
        }));
        console.log($scope.sourceDataList);

        // $scope.pagesize = '10';
        $scope.countNum = $scope.sourceData.count; //总条数
        // erpsouFun($scope.countNum,$scope.pagesize-0,1);
        if ($scope.countNum == 0) {
          layer.msg(noData);
          return;
        } else {
          erpsouFun($scope.countNum, $scope.pagesize - 0, 1);
        }

      }
    }

    //日期搜索
    $scope.dateSearchFun = function() {
      $scope.pagenum = '1';
      $scope.leftDate = $("#c-data-time").val();
      $scope.rightDate = $("#cdatatime2").val();
      sessionStorage.setItem('khsp-data-time', $scope.leftDate);
      sessionStorage.setItem('khsp-data-time2', $scope.rightDate);
      console.log($scope.leftDate, $scope.rightDate);
      var sourceList = {};
      sourceList.data = {};
      $scope.pagenum = '1';
      sourceList.data.pageSize = $scope.pagesize;
      sourceList.data.pageNum = $scope.pagenum;
      sourceList.data.status = $scope.statue;
      sourceList.data.customerName = $scope.searchinfo;
      sourceList.data.ownerName = $scope.ownerName;
      sourceList.data.ownerName = $scope.ownerName;
      sourceList.data.sourcetypes = '0';
      sourceList.data.leftDate = $scope.leftDate;
      sourceList.data.rightDate = $scope.rightDate;
      sourceList.data.type = $scope.soupinType;
      sourceList.data.sortType = $scope.sortType; // 2019-11-22 新增排序  1 -- > 按客户等级排序  2 -- > 按提交时间排序 
      sourceList.data = JSON.stringify(sourceList.data)
      console.log('sortType ---->>> ', $scope.sortType)
      console.log(JSON.stringify(sourceList))
      layer.load(2);
      erp.postFun('source/sourcing/erpList', JSON.stringify(sourceList), con, function(data) {
        layer.msg('请求失败');
      })

      function con(data) {
        layer.closeAll("loading");
        console.log(data);
        if (data.data.result) {
          $scope.sourceData = JSON.parse(data.data.result);
        } else {
          layer.msg(noData);
          $scope.sourceDataList = '';
          $scope.countNum = 0;
          return;
        }
        console.log($scope.sourceData);
        var date = Date.parse(new Date());
        $scope.sourceData.list.forEach(function(o, i) {
          if (o.jieZhiShiJianStr) {
            var jiezhiDate = (new Date(o.jieZhiShiJianStr.replace(new RegExp("-", "gm"), "/"))).getTime();
            if ((jiezhiDate - date) < 7200000) {
              o.isAct = true;
            }
          }
        })
        $scope.sourceDataList = $scope.sourceData.list.map(item => ({
          ...item,
          calcImg: handleOssImg(item.imageUrl)
        }));
        console.log($scope.sourceDataList);

        // $scope.pagesize = '10';
        $scope.countNum = $scope.sourceData.count; //总条数

        if ($scope.countNum == 0) {
          layer.msg(noData);
          return;
        } else {
          erpsouFun($scope.countNum, $scope.pagesize - 0, 1);
        }
      }


    }
    //  切换类目条数
    // $scope.pagesize = 10;
    $scope.pagesizechange = function(n) {
      console.log($scope.pagesize);
      $scope.pagenum = 1;
      var sourceList = {};
      sourceList.data = {};
      sourceList.data.pageSize = $scope.pagesize;
      sourceList.data.pageNum = $scope.pagenum;
      sourceList.data.status = $scope.statue;
      sourceList.data.customerName = $scope.searchinfo;
      sourceList.data.ownerName = $scope.ownerName;
      sourceList.data.sourcetypes = '0';
      sourceList.data.leftDate = $scope.leftDate;
      sourceList.data.rightDate = $scope.rightDate;
      sourceList.data = JSON.stringify(sourceList.data)
      console.log(JSON.stringify(sourceList))
      layer.load(2);
      erp.postFun('source/sourcing/erpList', JSON.stringify(sourceList), con, function() {
        layer.msg('切换类目条数请求失败');
      })

      function con(data) {
        layer.closeAll("loading");
        console.log(data);
        if (data.data.result) {
          $scope.sourceData = JSON.parse(data.data.result);
        } else {
          layer.msg(noData);
          $scope.sourceDataList = '';
          $scope.countNum = 0; //总条数
          return;
        }
        console.log($scope.sourceData);
        var date = Date.parse(new Date());
        $scope.sourceData.list.forEach(function(o, i) {
          if (o.jieZhiShiJianStr) {
            var jiezhiDate = (new Date(o.jieZhiShiJianStr.replace(new RegExp("-", "gm"), "/"))).getTime();
            if ((jiezhiDate - date) < 7200000) {
              o.isAct = true;
            }
          }
        })
        $scope.sourceDataList = $scope.sourceData.list.map(item => ({
          ...item,
          calcImg: handleOssImg(item.imageUrl)
        }));
        console.log($scope.sourceDataList);

        // $scope.pagesize=10;
        $scope.countNum = $scope.sourceData.count; //总条数
        $scope.pagenum = Math.floor($scope.countNum / $scope.pagesize);
        if ($scope.countNum == 0) {
          layer.msg(noData);
          return;
        } else {
          erpsouFun($scope.countNum, $scope.pagesize - 0, 1);
        }
      }
    }
    //跳页
    $scope.num = 1;
    $scope.pagechange = function(num) {
      console.log($scope.num);
      if ($scope.num == "" || $scope.num == null || $scope.num == undefined) {
        layer.msg("错误页码");
        return;
      }
      if ($scope.num == 0) {
        $scope.num = 1;
      }
      $scope.pagenum = $scope.num;
      $scope.searchinfo = '';
      // $scope.statue = '';
      var totalPage = Math.ceil($scope.countNum / $scope.pagesize);
      if ($scope.pagenum > totalPage) {
        layer.msg("错误页码");
        return;
      }
      var sourceList = {};
      sourceList.data = {};
      sourceList.data.pageSize = $scope.pagesize;
      sourceList.data.pageNum = $scope.pagenum;
      sourceList.data.status = $scope.statue;
      sourceList.data.customerName = $scope.searchinfo;
      sourceList.data.ownerName = $scope.ownerName;
      // var str=$scope.typearr.join(',');
      sourceList.data.sourcetypes = '0';
      sourceList.data.leftDate = $scope.leftDate;
      sourceList.data.rightDate = $scope.rightDate;
      sourceList.data = JSON.stringify(sourceList.data)
      console.log(JSON.stringify(sourceList))
      layer.load(2);
      erp.postFun('source/sourcing/erpList', JSON.stringify(sourceList), con, function() {
        layer.msg('跳页请求失败');
      })

      function con(data) {
        layer.closeAll("loading");
        console.log(data);
        if (data.data.result) {
          $scope.sourceData = JSON.parse(data.data.result);
        } else {
          layer.msg(noData);
          $scope.sourceDataList = '';
          $scope.countNum = 0; //总条数
          return;
        }
        console.log($scope.sourceData);
        var date = Date.parse(new Date());
        $scope.sourceData.list.forEach(function(o, i) {
          if (o.jieZhiShiJianStr) {
            var jiezhiDate = (new Date(o.jieZhiShiJianStr.replace(new RegExp("-", "gm"), "/"))).getTime();
            if ((jiezhiDate - date) < 7200000) {
              o.isAct = true;
            }
          }
        })
        $scope.sourceDataList = $scope.sourceData.list.map(item => ({
          ...item,
          calcImg: handleOssImg(item.imageUrl)
        }));
        console.log($scope.sourceDataList);
        // console.log($scope.pagenum);
        // $scope.pagesize = '10';
        $scope.countNum = $scope.sourceData.count; //总条数
        // erpsouFun($scope.countNum,$scope.pagesize-0,1);
        erpsouFun($scope.countNum, $scope.pagesize - 0, $scope.pagenum - 0);
      }
    }


    //录入操作
    $scope.enter = function(item) {
      console.log(item)
      layer.load(2);
      erp.postFun("app/externalPurchase/isEntering", {
        sourceId: item.ID
      }, function(res) {
        layer.closeAll("loading");
        if (res.data.code == 200) {
          sessionStorage.setItem('sourceId', item.ID)
          sessionStorage.setItem('sourcecustomerId', item.customerId)
          sessionStorage.setItem('addkey', 2)
          var customerId = item.customerId + '';
          // 0 表示代发商品
          $location.path('/merchandise/addSKU1/source=' + item.ID + "&sourcecustomer=" + customerId + '//0');
        } else {
          layer.msg(res.data.message)
        }
      }, function(err) {
        layer.msg('服务器错误')
      });
    }
    //失败操作
    $('.action-tankuang').hide();

    // 相似商品
    $scope.showSimilarGoods = function(item) {
      const {
        pids
      } = item;
      console.log('showSimilarGoods item', item)
      if (!pids) return;
      layer.load(2);
      const url = `app/picture/getsourceProducts?pids=${pids}`;
      erp.getFun(url, function({
        data
      }) {
        layer.closeAll('loading');
        console.log('showSimilarGoods ---> data ', data)

        if (data.statusCode === '200') {
          const {
            products
          } = retSaveResult(data.result) || {};
          console.log('showSimilarGoods ---> res ', products)
          products.forEach(item => item.existingWuliu = []); //一开始 选择物流为空 须以空数组 表示 
          $scope.existingPro = products;
          $scope.existingProFun(item) //调用 原先的功能 保留原先功能不变
        }
      }, function() {
        layer.closeAll('loading');
        layer.msg('网络错误')
      })
    }

    //现有商品操作
    $('.existing-tankuang').hide();
    $scope.existingProFun = function(item) {
      console.log(item)

      // 2019-11-21 取消以图搜图功能 (以下代码 git 显示 jerry 操作)
      // let imgUrl = item.imageUrl;
      // let formData = new FormData();
      // formData.append('imgUrl', imgUrl);
      // layer.load(2);
      // erp.upLoadImgPost('app/picture/searchSourceProduct', formData, function (res) {
      //     layer.closeAll("loading");
      //     // console.log(res);
      //     let data = res.data;
      //     if (data.statusCode == '200') {
      //         let searchProducts = JSON.parse(data.result).products;
      //         // console.log(searchProducts);
      //         if (searchProducts.length == 0) {
      //             $scope.existingPro = [];
      //             layer.msg(noData);
      //         } else {
      //             for (var i = 0; i < searchProducts.length; i++) {
      //                 searchProducts[i].existingWuliu = [];
      //             }
      //             $scope.existingPro = searchProducts;
      //             // console.log($scope.existingPro);
      //         }
      //     } else {
      //         layer.msg(data.message);
      //     }
      // })

      $scope.sourceID = item.ID;
      $('.existing-tankuang').show();
      // var selectedExistingNum = 0;
      var selectedExistingPro = null;
      $scope.selectedExisting = function($event, item2) {
        // console.log($(this)[0].item.id)
        // return;
        // $scope.productID = $(this)[0].item.id;
        var existingSrc = $($event.target).attr('src');
        if (existingSrc == 'static/image/public-img/radiobutton1.png') {
          $('.esou-cheked').attr('src', 'static/image/public-img/radiobutton1.png');
          $($event.target).attr('src', 'static/image/public-img/radiobutton2.png');
          // selectedExistingNum++;
          // console.log(selectedExistingNum)
          selectedExistingPro = item2;
        } else {
          $($event.target).attr('src', 'static/image/public-img/radiobutton1.png');
          selectedExistingPro = null;
          // selectedExistingNum--;
          // console.log(selectedExistingNum)
        }
        console.log(selectedExistingPro);
      }
      $scope.existingSearch = function(existinginfo) {
        console.log(existinginfo);
        if (existinginfo == '') {
          layer.msg('请输入SKU或商品名称')
        } else if (existinginfo == undefined) {
          layer.msg('请输入SKU或商品名称')
        } else {

          erp.postFun('app/sourcing/sourceGetProduct', JSON.stringify({
            inputStr: existinginfo,
            accountId: item.customerId
          }), function(res) {
            console.log(res.data);
            console.log(JSON.parse(res.data.result))
            // console.log(res.data.result.products);
            if (res.data.statusCode == 200) {
              var searchproducts = JSON.parse(res.data.result).products;
              if (searchproducts.length == 0) {
                $scope.existingPro = [];
                layer.msg(noData);
              } else {
                for (var i = 0; i < searchproducts.length; i++) {
                  searchproducts[i].existingWuliu = [];
                }
                $scope.existingPro = searchproducts;
                console.log($scope.existingPro);
              }

            } else {
              layer.msg(noData);
            }
          }, function(res) {
            console.log(res)
            layer.msg('网络错误');
          })

        }
      }

      $scope.choseCurWuliu = function(curPro, curIndex) {
        //物流请求
        erp.postFun2('getWayBy.json', {
            "weight": curPro.packWeight,
            "lcharacter": curPro.propertyKey
          },
          function(res) {
            console.log(res)
            // $scope.existingWuliu = res.data;
            // $scope.mylogistics = '请选择';
            const {
              data
            } = res;
            if (data && data instanceof Array && data.length > 0) {
              $scope.existingPro[curIndex].existingWuliu = res.data;
              $scope.existingPro[curIndex].mylogistics = res.data[0].enName;
            } else {
              layer.msg('后台未返回数据')
            }
          },
          function(res) {
            console.log(res)
            layer.msg('网络错误')

          })
      }

      $scope.quxiaoFun = function() {
        $('.existing-tankuang').hide();
        $scope.existingPro = [];
        $scope.existinginfo = '';
      }
      $scope.quedingFun = function() {
        if (selectedExistingPro == null) {
          layer.msg('请选择一个商品')
          return;
        }
        if (!selectedExistingPro.mylogistics) {
          layer.msg('请给选择的商品指定物流方式')
          return;
        }

        erp.postFun('app/sourcing/assignSource', {
            "sourceId": $scope.sourceID,
            "productId": selectedExistingPro.id,
            "logistc": selectedExistingPro.mylogistics
          },
          function(res) {
            console.log(res)
            if (res.data.statusCode == 200) {
              // window.location.reload();
              firstRequire();
            }
          },
          function(res) {
            console.log(res)
          })
        $('.existing-tankuang').hide();

      }

    }

    //处理分页
    function erpsouFun(total, pagesize, current) {
      console.log(total, pagesize, current)
      $("#c-pages-fun").jqPaginator({
        totalCounts: total,
        pageSize: pagesize,
        visiblePages: 6,
        currentPage: current,
        activeClass: 'active',
        prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
        next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
        page: '<a href="javascript:void(0);">{{page}}<\/a>',
        first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
        last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
        onPageChange: function(n, type) {
          // $("#demo3-text").html("当前第" + n + "页")
          $scope.pagenum = n;
          $scope.num = n;
          var sourceList = {};
          sourceList.data = {};
          sourceList.data.pageSize = $scope.pagesize;
          sourceList.data.pageNum = $scope.pagenum;
          sourceList.data.status = $scope.statue;
          sourceList.data.customerName = $scope.searchinfo;
          sourceList.data.ownerName = $scope.ownerName;
          sourceList.data.sourcetypes = '0';
          sourceList.data.leftDate = $scope.leftDate;
          sourceList.data.rightDate = $scope.rightDate;
          sourceList.data = JSON.stringify(sourceList.data);
          console.log(JSON.stringify(sourceList));
          if (type == 'init') {
            return;
          }
          layer.load(2);
          erp.postFun('source/sourcing/erpList', JSON.stringify(sourceList), function(data) {
            layer.closeAll("loading");
            console.log(data);
            if (data.data.result) {
              $scope.sourceData = JSON.parse(data.data.result);
            } else {
              layer.msg(noData);
              $scope.sourceDataList = '';
              $scope.countNum = 0; //总条数
              return;
            }
            console.log($scope.sourceData);
            var date = Date.parse(new Date());
            $scope.sourceData.list.forEach(function(o, i) {
              if (o.jieZhiShiJianStr) {
                var jiezhiDate = (new Date(o.jieZhiShiJianStr.replace(new RegExp("-", "gm"), "/"))).getTime();
                if ((jiezhiDate - date) < 7200000) {
                  o.isAct = true;
                }
              }
            })
            $scope.sourceDataList = $scope.sourceData.list.map(item => ({
              ...item,
              calcImg: handleOssImg(item.imageUrl)
            }));
            $scope.countNum = $scope.sourceData.count; //总条数

          }, function() {
            // alert(2)
          })
        }
      });
    }

    function GetDateStr(AddDayCount) {
      var dd = new Date();
      console.log(dd)
      dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1; //获取当前月份的日期
      var d = dd.getDate();
      return y + "-" + m + "-" + d;
    }
    $scope.toFrontDetail = function(id) {
      var toUrl = window.open();
      erp.getFun('cj/locProduct/rollToken?id=' + id, function(data) {
        var data = data.data;
        if (data.statusCode != 200) {
          console.log(data);
          return;
        }
        var detailToken = data.result;
        console.log(detailToken);
        toUrl.location.href = erp.getAppUrl() + '/product-detail.html?id=' + id + '&token=' + detailToken;
      }, function(err) {
        console.log(err);
      });
    }

    // 等待搜品&初审失败
    function itemRequest(item) {
      //   console.log(item);
      let data = {};
      data.data = {
        "status": (function() {
          if (item.status == "1") { //等待搜品状态
            return "7" // 初审失败传7
          } else if (item.status == "6") { //待现有状态
            return "1" // 等待搜品传1
          }
        })(),
        "id": item.ID
      };
      data.data = JSON.stringify(data.data);
      //   console.log(JSON.stringify(data));

      erp.postFun('app/sourcing/modify1', JSON.stringify(data), res => {
        console.log(res);
        let data = res.data;
        if (data.statusCode != 200) {
          return layer.msg(data.message);
        }
        layer.msg(data.message);
        firstRequire();
      })
    }
    // 等待搜品
    $scope.waitSoupin = (item) => {
      itemRequest(item);
    }
    // 初审失败
    $scope.chushenFall = (item) => {
      itemRequest(item);
    }
    // 批量提交等待搜品
    $scope.batchWaitSoupin = () => {
      let checkedList = $scope.sourceDataList.filter(item => item.checked);
      console.log(checkedList);
      if (checkedList.length === 0) return layer.msg("请勾选要提交的搜品");
      let idList = [];
      checkedList.map(item => {
        idList.push(item.ID);
      })
      idList = JSON.stringify(idList);
      console.log(idList);
      let data = {};
      data.data = {
        "status": "1",
        "id": idList
      };
      data.data = JSON.stringify(data.data);
      erp.postFun('app/sourcing/modify1', data, res => {
        console.log(res);
        let data = res.data;
        if (data.statusCode != 200) {
          return layer.msg(data.message);
        }
        layer.msg(data.message);
        firstRequire();
      })
    }

    // 全选
    $scope.checkAll = () => {
      checkAll($scope);
    }
    // 单选
    $scope.checkOne = (item) => {
      checkOne($scope, item);
    }
  }])
  //个性商品 独有商品
  app.controller('eindividualsourcing-controller', ['$scope', 'erp', '$location', '$routeParams', function($scope, erp, $location, $routeParams) {
    console.log('eindividualsourcing-controller');
    var bs = new Base64();
    $scope.loginJob = localStorage.getItem('job') ? bs.decode(localStorage.getItem('job')) : '';
    console.log($scope.loginJob)
    $scope.soupinType = '1';
    $scope.sortType = '2'; // 2019-11-22 新增排序  1 -- > 按客户等级排序  2 -- > 按提交时间排序
    $scope.whichPage = $routeParams.indivStu; // 2019-11-22 该页面 被哪个模块使用  1 情况下 才有 相似商品 和 搜索条件 加入 客户登记 和 登记时间 
    console.log('whichPage ---> ', $routeParams.indivStu)
    var aDate;
    var enDate;
    var orderDate = sessionStorage.getItem('dysp-data-time');
    var orderDate2 = sessionStorage.getItem('dysp-data-time2');
    if (orderDate == null || orderDate == '' || orderDate == undefined) {
      aDate = GetDateStr(-14);
    } else {
      aDate = orderDate;
    }
    if (orderDate2 == null || orderDate2 == '' || orderDate2 == undefined) {
      enDate = GetDateStr(0);
    } else {
      enDate = orderDate2;
      $("#cdatatime2").val(enDate);
    }

    // 获取类目
    erp.postFun('erpSupplierSourceProduct/list', {}, res => {
      $scope.categoryList = res.data.data
    })

    $scope.isSetSourceError = false
    let that = this

    $scope.defeated = function(item) {
      $scope.isSetSourceError = true;
      that.no = {
        item,
        type: 'duyou'
      }
    }
    $scope.$on('log-to-father', function(d, flag) {
      console.log(d, flag)
      if (d && flag) {
        $scope.isSetSourceError = flag.closeFlag;
      }
    })

    $("#c-data-time").val(aDate); //关键语句
    //$("#cdatatime2").val(enDate); //关键语句
    $scope.pagesize = '10';
    $scope.pagenum = '1';
    $scope.statue = '';
    $scope.searchinfo = '';
    // $scope.ownerName = ''
    //$scope.statue = '';
    $scope.leftDate = $("#c-data-time").val();
    $scope.rightDate = $("#cdatatime2").val();
    console.log($scope.leftDate, $scope.rightDate);
    firstRequire();

    $scope.selectSoupinType = () => {
      firstRequire();
    }

    erp.postFun('app/employee/getempbyname', {
      "data": "{'name':'', 'job': '销售'}"
    }, function(data) {
      $scope.salemanList = JSON.parse(data.data.result).list;
      console.log($scope.salemanList);
    });
    erp.postFun('app/account_erp/getAllSalesman', {}, res => {
      $scope.ownerList = JSON.parse(res.data.result)
      console.log($scope.ownerList)
    })
    $scope.changeSaleman = function() {
      $scope.searchinfo = $scope.salemanName;
      $scope.search();
    };
    $scope.changeOwnerName = function() {
      $scope.search();
    }

    $scope.showProName = function(item) {
      if (item.status == '3') {
        window.open('manage.html#/merchandise/show-detail/' + item.CjproductId + '/0/3/0', '_blank', '');
      } else {
        layer.open({
          title: '商品名称',
          content: item.productName
        });
      }
    };

    // 供应商报价操作

    $scope.dgzspFlag = false // 单个供应商报价的弹框是否显示
    $scope.plzspFlag = false // 多个供应商报价的弹框是否显示
    $scope.supplierId = ""
    $scope.chooseSource = {}
    $scope.batchChooseSource = [] // 已经选择的搜品
    $scope.supplierList = []
    // 获取供应商列表
    erp.postFun('supplier/user/userInfo/listAccountPage', JSON.stringify({
      pageNum: 1,
      pageSize: 1000
    }), res => {
      $scope.supplierList = res.data.data.list
    })

    // 指派供应商报价操作
    assignSupplier = function(ids, supplierId) {
      layer.load(2);
      const data = {
        ids,
        type: 2,
        supplierId,
      }
      erp.postFun('erpSupplierSourceProduct/updateByIds', JSON.stringify(data), function(res) {
        if (res.data.code == 200) {
          layer.closeAll("loading");
          window.location.reload();
        } else {
          layer.closeAll("loading");
          layer.msg(res.data.error)
        }
      })
    }

    $scope.closeSingleSearch = function() {
      $scope.dgzspFlag = false
    }

    $scope.closeBatchSearch = function() {
      $scope.plzspFlag = false
    }


    $scope.SupplierQuote = function(item) {
      $scope.dgzspFlag = true
      $scope.chooseSource = item
    }

    $scope.hanldeBatchSupplierQuote = function() {
      let num = 0
      let productList = []
      $scope.sourceDataList.map((item) => {
        if (item.checked) {
          productList.push(item)
        }
      })
      $scope.batchChooseSource = productList

      if (productList.length > 0) {
        $scope.plzspFlag = true
      } else {
        layer.msg('请勾选搜品!')
      }
    }

    // 单个的转搜品的确认按钮
    $scope.handleSingleConform = function() {
      if (!$scope.supplierId) {
        layer.msg('请选择供应商!')
        return
      }
      let ids = []
      let supplierId = $scope.supplierId
      ids.push($scope.chooseSource.ID || $scope.chooseSource.id)
      $scope.dgzspFlag = false
      assignSupplier(ids, supplierId)
    }

    // 批量转搜品的确认按钮
    $scope.handleBatchConform = function() {
      if (!$scope.supplierId) {
        layer.msg('请选择供应商!')
        return
      }
      let ids = []
      let supplierId = $scope.supplierId
      $scope.batchChooseSource.map((item) => {
        ids.push(item.ID || item.id)
      })
      $scope.plzspFlag = false
      assignSupplier(ids, supplierId)
    }



    // $scope.xzlmFlag = false;
    // function showCategory(singleItem) {
    //   $scope.xzlmFlag = true
    //   $scope.singleSearchItem = singleItem||'';
    //   $scope.isSingleSearch = singleItem?true:false;
    // } 

    // // 点击单个转供应商报价操作
    // $scope.SupplierQuote = function (item) {
    //   if(item.source_category){
    //     singleToSupplier(item,'')
    //   } else {
    //     showCategory(item)
    //   }
    // }

    // // 点击批量转供应商报价操作
    // $scope.hanldeBatchSupplierQuote = function () {
    //   let num =0
    //   console.log(num,'22222');
    //   $scope.sourceDataList.map((item)=>{
    //     if(item.checked) {
    //       num++
    //     }
    //   })
    //   console.log(num,'33333');
    //   if(num>0) {
    //     showCategory()
    //   }else{
    //     layer.msg('请勾选搜品!')
    //   }
    // }

    // // 选择类目
    // $scope.chooseCateGory = function (id) {
    //   $scope.chooseCateGoryId = id
    // }

    // // 点击取消
    // $scope.closeCategory =function() {
    //   $scope.xzlmFlag = false
    //   $scope.singleSearchItem = '';
    // }

    // // 点击确定
    // $scope.categoryConfirm =function() {
    //   if($scope.chooseCateGoryId){
    //     if($scope.isSingleSearch) {
    //       singleToSupplier($scope.singleSearchItem,$scope.chooseCateGoryId)
    //     }else{
    //       batchToSupplier()
    //     }
    //   }else{
    //      layer.msg("请选择类目")
    //   }
    // }

    // // 多个搜品转供应商
    // function batchToSupplier() {
    //   let productList = []
    //   $scope.sourceDataList.map((item)=>{
    //     if(item.checked) {
    //       productList.push({
    //         categoryId:item.source_category,
    //         sourceProductId:item.ID
    //       })
    //     }
    //   })
    //   const data = {
    //     categoryId:$scope.chooseCateGoryId,
    //     sourceProduct:productList,
    //     sourceProductType:1
    //   }
    //   layer.load(2);
    //   erp.postFun('erpSupplierSourceAllocateRecording/sourceAllocate', JSON.stringify(data), function (res) {
    //     if(res.data.code == 200) {
    //       $scope.xzlmFlag =false
    //       layer.closeAll("loading");
    //       window.location.reload();
    //     }else{
    //       layer.msg(res.data.message)
    //     }
    //   })
    // }

    // // 单个搜品转供应商
    // function singleToSupplier(item,id) {
    //   layer.load(2);
    //   const data = {
    //     categoryId:id,
    //     sourceProduct:[{
    //       categoryId:item.source_category,
    //       sourceProductId:item.ID
    //     }],
    //     sourceProductType:1
    //   }

    //   erp.postFun('erpSupplierSourceAllocateRecording/sourceAllocate', JSON.stringify(data), function (res) {
    //     if(res.data.code == 200) {
    //       $scope.xzlmFlag =false
    //       layer.closeAll("loading");
    //       window.location.reload();
    //     }else{
    //       layer.msg(res.data.message)
    //     }
    //   })
    // }

    // 转供应商报价结束


    $scope.checked = '0';

    function firstRequire() {
      $scope.spsbFlag = false;
      $scope.erpflag = false;
      $scope.erpstuflag = false;
      var ordStatus = $routeParams.indivStu || 0;
      ordStatus = parseInt(ordStatus);
      console.log(ordStatus);
      if (ordStatus == 0) {
        $scope.statue = ''
      }
      if (ordStatus == 1) {
        $scope.statue = '1'
      }
      if (ordStatus == 2) {
        $scope.spsbFlag = true;
        $scope.statue = '2';
      } else {
        $scope.spsbFlag = false;
      }
      if (ordStatus == 3) {
        $scope.statue = '3';
        $scope.erpstuflag = true;
      } else {
        $scope.erpstuflag = false;
      }
      if (ordStatus == 4) {
        $scope.statue = '8';
        $scope.erpflag = true;
      } else {
        $scope.erpflag = false;
      }
      if (ordStatus == 5) {
        $scope.statue = '-1';
      }
      // 新增等待现有页面
      if (ordStatus == 6) {
        $scope.statue = '6';
      }
      // 新增搜品初审失败页面
      if (ordStatus == 7) {
        $scope.statue = '7';
      }
      console.log($scope.statue);

      var sourceList = {};
      sourceList.data = {};
      sourceList.data.pageSize = $scope.pagesize;
      sourceList.data.pageNum = '1';
      sourceList.data.status = $scope.statue;
      sourceList.data.customerName = $scope.searchinfo;
      // sourceList.data.ownerName = $scope.ownerName;
      // var str=$scope.typearr.join(',');
      sourceList.data.sourcetypes = '1';
      sourceList.data.leftDate = $scope.leftDate;
      sourceList.data.rightDate = $scope.rightDate;
      sourceList.data.type = $scope.soupinType;
      sourceList.data.isFuFei = $scope.checked;
      sourceList.data.sortType = $scope.sortType; // 2019-11-22 新增排序  1 -- > 按客户等级排序  2 -- > 按提交时间排序 
      console.log('sortType ------>>>> ', $scope.sortType)
      sourceList.data = JSON.stringify(sourceList.data);
      console.log(JSON.stringify(sourceList));
      layer.load(2);
      erp.postFun('source/sourcing/erpList', JSON.stringify(sourceList), con, function(data) {
        layer.msg('请求失败');
      });

      function con(data) {
        layer.closeAll("loading");
        if (data.data.result) {
          $scope.sourceData = JSON.parse(data.data.result);
        } else {
          layer.msg(noData);
          $scope.sourceDataList = '';
          $scope.countNum = 0; //总条数
          return;
        }

        console.log($scope.sourceData);
        var date = Date.parse(new Date());
        $scope.sourceData.list.forEach(function(o, i) {
          if (o.jieZhiShiJianStr) {
            var jiezhiDate = (new Date(o.jieZhiShiJianStr.replace(new RegExp("-", "gm"), "/"))).getTime();
            if ((jiezhiDate - date) < 7200000) {
              o.isAct = true;
            }
          }
        })
        $scope.sourceDataList = $scope.sourceData.list;
        console.log($scope.sourceDataList);
        for (var i = 0; i < $scope.sourceDataList.length; i++) {
          if ($scope.sourceDataList[i].imageUrl) {
            if ($scope.sourceDataList[i].imageUrl.includes(',')) {
              $scope.sourceDataList[i].imageUrl = $scope.sourceDataList[i].imageUrl.split(",");
            } else {
              $scope.sourceDataList[i].imageUrl = [$scope.sourceDataList[i].imageUrl]
            }
          } else {
            $scope.sourceDataList[i].imageUrl = []
          }

        }
        batchingOssImgHandle()
        // console.log($scope.sourceDataList)

        // $scope.pagesize = '10';
        $scope.countNum = $scope.sourceData.count; //总条数
        $scope.shownum = $scope.countNum;
        if ($scope.countNum == 0) {
          layer.msg(noData);
          return;
        } else {
          erpsouFun($scope.countNum, $scope.pagesize - 0, 1);
        }
      }

      //function con(data) {
      //  console.log(data);
      //  if (data.data.result) {
      //    $scope.sourceData = JSON.parse(data.data.result);
      //  } else {
      //    layer.msg(noData);
      //    $scope.sourceDataList = '';
      //    return;
      //  }
      //  console.log($scope.sourceData);
      //  $scope.sourceDataList = $scope.sourceData.list;
      //  console.log($scope.sourceDataList);
      //  for (var i = 0; i < $scope.sourceDataList.length; i++) {
      //    $scope.sourceDataList[i].imageUrl = $scope.sourceDataList[i].imageUrl.split(",");
      //
      //  }
      //  // $scope.pagesize = '10';
      //  $scope.countNum = $scope.sourceData.count; //总条数
      //
      //  if ($scope.countNum == 0) {
      //    layer.msg(noData);
      //    return;
      //  } else {
      //    erpsouFun($scope.countNum, $scope.pagesize - 0, 1);
      //  }
      //
      //}
    }

    // //付费客户

    $scope.checkMerch = function(item, e) {
      console.log(item)
      // console.log($scope.checked)
      sourcelist = ''
      if (item.checked == true) {
        $scope.checked = '1';
        firstRequire()
      } else {
        $scope.checked = '0';
        firstRequire()
      }
    }

    //描述
    $('.descripte-tankuang').hide();
    $scope.descripteFun = function(item) {
      $scope.word = $(this)[0].sourcelist.description;
      $scope.name = $(this)[0].sourcelist.name;
      $scope.number = $(this)[0].sourcelist.number;

      $('.descripte-tankuang').show();
    }
    $scope.closeDescripte = function() {
      $('.descripte-tankuang').hide();
    }

    //查看失败原因
    $scope.sbtcFlag = false;
    $scope.ckFun = function(item) {
      $scope.sbtcFlag = true;
      $scope.showText = item.failExplain;
    }
    $scope.gbckFun = function() {
      $scope.sbtcFlag = false;
      $scope.showText = '';
    }
    //  搜索
    $(document).keyup(function(event) {
      if (event.keyCode == 13) {
        $("#search").trigger("click");
      }
    });
    $scope.searchinfo = '';

    $scope.search = function(searchinfo) {
      console.log($scope.statue);
      console.log($scope.searchinfo);
      $scope.pagenum = 1;
      var sourceList = {};
      sourceList.data = {};
      sourceList.data.pageSize = $scope.pagesize;
      sourceList.data.pageNum = $scope.pagenum;
      sourceList.data.status = $scope.statue;
      sourceList.data.customerName = $scope.searchinfo;
      sourceList.data.ownerName = $scope.ownerName;
      // var str=$scope.typearr.join(',');
      sourceList.data.sourcetypes = '1';
      sourceList.data.leftDate = $scope.leftDate;
      sourceList.data.rightDate = $scope.rightDate;
      sourceList.data = JSON.stringify(sourceList.data);
      console.log(JSON.stringify(sourceList));
      layer.load(2);
      erp.postFun('source/sourcing/erpList', JSON.stringify(sourceList), con, function(data) {
        layer.msg('搜索请求失败');
      })

      function con(data) {
        layer.closeAll("loading");
        console.log(data);
        if (data.data.result) {
          $scope.sourceData = JSON.parse(data.data.result);
        } else {
          layer.msg(noData);
          $scope.sourceDataList = '';
          $scope.countNum = 0; //总条数
          return;
        }
        console.log($scope.sourceData);
        var date = Date.parse(new Date());
        $scope.sourceData.list.forEach(function(o, i) {
          if (o.jieZhiShiJianStr) {
            var jiezhiDate = (new Date(o.jieZhiShiJianStr.replace(new RegExp("-", "gm"), "/"))).getTime();
            if ((jiezhiDate - date) < 7200000) {
              o.isAct = true;
            }
          }
        })
        $scope.sourceDataList = $scope.sourceData.list;
        console.log($scope.sourceDataList);
        for (var i = 0; i < $scope.sourceDataList.length; i++) {
          $scope.sourceDataList[i].imageUrl = $scope.sourceDataList[i].imageUrl.split(",");

        }
        batchingOssImgHandle()
        // $scope.pagesize = '10';
        $scope.countNum = $scope.sourceData.count; //总条数
        // erpsouFun($scope.countNum,$scope.pagesize-0,1);
        if ($scope.countNum == 0) {
          layer.msg(noData);
          return;
        } else {
          erpsouFun($scope.countNum, $scope.pagesize - 0, 1);
        }

      }
    }
    //日期搜索
    $scope.dateSearchFun = function() {
      $scope.pagenum = '1';
      console.log($scope.statue);
      $scope.leftDate = $("#c-data-time").val();
      $scope.rightDate = $("#cdatatime2").val();
      sessionStorage.setItem('dysp-data-time', $scope.leftDate);
      sessionStorage.setItem('dysp-data-time2', $scope.rightDate);
      console.log($scope.leftDate, $scope.rightDate);
      var sourceList = {};
      sourceList.data = {};
      sourceList.data.pageSize = $scope.pagesize;
      sourceList.data.pageNum = $scope.pagenum;
      sourceList.data.status = $scope.statue;
      sourceList.data.customerName = $scope.searchinfo;
      sourceList.data.ownerName = $scope.ownerName;
      sourceList.data.sourcetypes = '1';
      sourceList.data.leftDate = $scope.leftDate;
      sourceList.data.rightDate = $scope.rightDate;
      sourceList.data.type = $scope.soupinType;
      sourceList.data.sortType = $scope.sortType; // 2019-11-22 新增排序  1 -- > 按客户等级排序  2 -- > 按提交时间排序 
      sourceList.data = JSON.stringify(sourceList.data)
      console.log(JSON.stringify(sourceList))
      layer.load(2);
      erp.postFun('source/sourcing/erpList', JSON.stringify(sourceList), con, function(data) {
        layer.msg('请求失败');
      })

      function con(data) {
        layer.closeAll("loading");
        console.log(data);
        if (data.data.result) {
          $scope.sourceData = JSON.parse(data.data.result);
        } else {
          layer.msg(noData);
          $scope.sourceDataList = '';
          $scope.countNum = 0; //总条数
          return;
        }
        console.log($scope.sourceData);
        var date = Date.parse(new Date());
        $scope.sourceData.list.forEach(function(o, i) {
          if (o.jieZhiShiJianStr) {
            var jiezhiDate = (new Date(o.jieZhiShiJianStr.replace(new RegExp("-", "gm"), "/"))).getTime();
            if ((jiezhiDate - date) < 7200000) {
              o.isAct = true;
            }
          }
        })
        $scope.sourceDataList = $scope.sourceData.list;
        console.log($scope.sourceDataList);
        for (var i = 0; i < $scope.sourceDataList.length; i++) {
          $scope.sourceDataList[i].imageUrl = $scope.sourceDataList[i].imageUrl.split(",");

        }
        batchingOssImgHandle()
        // $scope.pagesize = '10';
        $scope.countNum = $scope.sourceData.count; //总条数

        if ($scope.countNum == 0) {
          layer.msg(noData);
          return;
        } else {
          erpsouFun($scope.countNum, $scope.pagesize - 0, 1);
        }
      }


    }
    //  切换类目条数

    $scope.pagesizechange = function(n) {
      console.log($scope.pagesize);
      $scope.pagenum = 1;
      var sourceList = {};
      sourceList.data = {};
      sourceList.data.pageSize = $scope.pagesize;
      sourceList.data.pageNum = $scope.pagenum;
      sourceList.data.status = $scope.statue;
      sourceList.data.customerName = $scope.searchinfo;
      sourceList.data.ownerName = $scope.ownerName;
      sourceList.data.sourcetypes = '1';
      sourceList.data.leftDate = $scope.leftDate;
      sourceList.data.rightDate = $scope.rightDate;
      sourceList.data = JSON.stringify(sourceList.data)
      console.log(JSON.stringify(sourceList))
      layer.load(2);
      erp.postFun('source/sourcing/erpList', JSON.stringify(sourceList), con, function() {
        layer.msg('切换类目条数请求失败');
      })

      function con(data) {
        layer.closeAll("loading");
        console.log(data);
        if (data.data.result) {
          $scope.sourceData = JSON.parse(data.data.result);
        } else {
          layer.msg(noData);
          $scope.sourceDataList = '';
          $scope.countNum = 0; //总条数
          return;
        }
        console.log($scope.sourceData);
        var date = Date.parse(new Date());
        $scope.sourceData.list.forEach(function(o, i) {
          if (o.jieZhiShiJianStr) {
            var jiezhiDate = (new Date(o.jieZhiShiJianStr.replace(new RegExp("-", "gm"), "/"))).getTime();
            if ((jiezhiDate - date) < 7200000) {
              o.isAct = true;
            }
          }
        })
        $scope.sourceDataList = $scope.sourceData.list;
        console.log($scope.sourceDataList);
        for (var i = 0; i < $scope.sourceDataList.length; i++) {
          $scope.sourceDataList[i].imageUrl = $scope.sourceDataList[i].imageUrl.split(",");

        }
        batchingOssImgHandle()
        // $scope.pagesize=10;
        $scope.countNum = $scope.sourceData.count; //总条数
        $scope.pagenum = Math.floor($scope.countNum / $scope.pagesize);
        if ($scope.countNum == 0) {
          layer.msg(noData);
          return;
        } else {
          erpsouFun($scope.countNum, $scope.pagesize - 0, 1);
        }
      }
    }
    //跳页
    $scope.num = 1;
    $scope.pagechange = function(num) {
      console.log($scope.num);
      if ($scope.num == "" || $scope.num == null || $scope.num == undefined) {
        layer.msg("错误页码");
        return;
      }
      if ($scope.num == 0) {
        $scope.num = 1;
      }
      $scope.pagenum = $scope.num;
      $scope.searchinfo = '';
      //$scope.statue = '';
      var totalPage = Math.ceil($scope.countNum / $scope.pagesize);
      if ($scope.pagenum > totalPage) {
        layer.msg("错误页码");
        return;
      }
      var sourceList = {};
      sourceList.data = {};
      sourceList.data.pageSize = $scope.pagesize;
      sourceList.data.pageNum = $scope.pagenum;
      sourceList.data.status = $scope.statue;
      sourceList.data.customerName = $scope.searchinfo;
      sourceList.data.ownerName = $scope.ownerName;
      // var str=$scope.typearr.join(',');
      sourceList.data.sourcetypes = '1';
      sourceList.data.leftDate = $scope.leftDate;
      sourceList.data.rightDate = $scope.rightDate;
      sourceList.data = JSON.stringify(sourceList.data)
      console.log(JSON.stringify(sourceList))
      layer.load(2);
      erp.postFun('source/sourcing/erpList', JSON.stringify(sourceList), con, function() {
        layer.msg('跳页请求失败');
      })

      function con(data) {
        layer.closeAll("loading");
        console.log(data);
        if (data.data.result) {
          $scope.sourceData = JSON.parse(data.data.result);
        } else {
          layer.msg(noData);
          $scope.sourceDataList = '';
          $scope.countNum = 0; //总条数
          return;
        }
        console.log($scope.sourceData);
        var date = Date.parse(new Date());
        $scope.sourceData.list.forEach(function(o, i) {
          if (o.jieZhiShiJianStr) {
            var jiezhiDate = (new Date(o.jieZhiShiJianStr.replace(new RegExp("-", "gm"), "/"))).getTime();
            if ((jiezhiDate - date) < 7200000) {
              o.isAct = true;
            }
          }
        })
        $scope.sourceDataList = $scope.sourceData.list;
        console.log($scope.sourceDataList);
        for (var i = 0; i < $scope.sourceDataList.length; i++) {
          $scope.sourceDataList[i].imageUrl = $scope.sourceDataList[i].imageUrl.split(",");

        }
        batchingOssImgHandle()
        // console.log($scope.pagenum);
        // $scope.pagesize = '10';
        $scope.countNum = $scope.sourceData.count; //总条数
        if ($scope.countNum == 0) {
          layer.msg(noData);
          return;
        } else {
          erpsouFun($scope.countNum, $scope.pagesize - 0, $scope.pagenum * 1);
        }
      }
    }


    //录入操作
    $scope.enter = function(item) {
      console.log(item)
      layer.load(2);
      erp.postFun("app/externalPurchase/isEntering", {
        sourceId: item.ID
      }, function(res) {
        layer.closeAll("loading");
        if (res.data.code == 200) {
          sessionStorage.setItem('sourceId', item.ID)
          sessionStorage.setItem('sourcecustomerId', item.customerId)
          sessionStorage.setItem('addkey', 2)
          var customerId = item.customerId + '';
          // 0 表示代发商品
          $location.path('/merchandise/addSKU1/source=' + item.ID + "&sourcecustomer=" + customerId + '//0');
        } else {
          layer.msg(res.data.message)
        }
      }, function(err) {
        layer.msg('服务器错误')
      });
    }
    //失败操作
    $('.action-tankuang').hide();
    // $scope.defeated = function (item) {
    //     $('.fail-text').val("");
    //     var failReson = '';//存储失败原因
    //     $('.action-tankuang').show();
    //     $scope.noFun = function () {
    //         $('.action-tankuang').hide();

    //     }
    //     $scope.yesFun = function () {
    //         failReson = $('.fail-text').val();
    //         if (!failReson.trim()) {
    //             layer.msg('请填写失败原因！');
    //             return;
    //         }
    //         erp.postFun('app/sourcing/modify', {
    //             // 'data': "{'id':'" + item.ID + "','status':'2'}"
    //             'data': "{'id':'" + item.ID + "','status':'2','failExplain':'" + failReson + "'}"
    //         }, function (n) {
    //             console.log(n);
    //             // alert('成功修改');
    //             $('.action-tankuang').hide();
    //             location.reload();
    //         }, function (n) {
    //             // alert(2)
    //             // alert('操作失败');
    //             layer.msg('网络错误')
    //         })
    //     }

    // }

    // 相似商品
    $scope.showSimilarGoods = function(item) {
      const {
        pids
      } = item;
      console.log('showSimilarGoods item', item)
      if (!pids) return;
      layer.load(2);
      const url = `app/picture/getsourceProducts?pids=${pids}`;
      erp.getFun(url, function({
        data
      }) {
        layer.closeAll('loading');
        console.log('showSimilarGoods ---> data ', data)

        if (data.statusCode === '200') {
          const {
            products
          } = retSaveResult(data.result) || {};
          console.log('showSimilarGoods ---> res ', products)
          products.forEach(item => item.existingWuliu = []); //一开始 选择物流为空 须以空数组 表示 
          $scope.existingPro = products;
          $scope.existingProFun(item) //调用 原先的功能 保留原先功能不变
        }
      }, function() {
        layer.closeAll('loading');
        layer.msg('网络错误')
      })
    }

    //现有商品操作
    $('.existing-tankuang').hide();
    $scope.existingProFun = function(item) {
      console.log(item)

      // 2019-11-21 取消以图搜图功能 (以下代码 git 显示 jerry 操作)
      // let imgUrl = item.imageUrl[0];
      // let formData = new FormData();
      // formData.append('imgUrl', imgUrl);
      // layer.load(2);
      // erp.upLoadImgPost('app/picture/searchSourceProduct', formData, function (res) {
      //     layer.closeAll("loading");
      //     // console.log(res);
      //     let data = res.data;
      //     if (data.statusCode == '200') {
      //         let searchProducts = JSON.parse(data.result).products;
      //         // console.log(searchProducts);
      //         if (searchProducts.length == 0) {
      //             $scope.existingPro = [];
      //             layer.msg(noData);
      //         } else {
      //             for (var i = 0; i < searchProducts.length; i++) {
      //                 searchProducts[i].existingWuliu = [];
      //             }
      //             $scope.existingPro = searchProducts;
      //             // console.log($scope.existingPro);
      //         }
      //     } else {
      //         layer.msg(data.message);
      //     }
      // })

      $scope.sourceID = item.ID;
      $('.existing-tankuang').show();
      var selectedExistingPro = null;
      $scope.selectedExisting = function($event, item2) {
        // console.log($(this)[0].item.id)
        // return;
        // $scope.productID = $(this)[0].item.id;
        var existingSrc = $($event.target).attr('src');
        if (existingSrc == 'static/image/public-img/radiobutton1.png') {
          $('.esou-cheked').attr('src', 'static/image/public-img/radiobutton1.png');
          $($event.target).attr('src', 'static/image/public-img/radiobutton2.png');
          // selectedExistingNum++;
          // console.log(selectedExistingNum)
          selectedExistingPro = item2;
        } else {
          $($event.target).attr('src', 'static/image/public-img/radiobutton1.png');
          selectedExistingPro = null;
          // selectedExistingNum--;
          // console.log(selectedExistingNum)
        }
        console.log(selectedExistingPro);
      }
      // var selectedExistingNum = 0;
      // $scope.selectedExisting = function($event, item) {
      //   console.log($(this)[0].item.id)
      //     // return;
      //   $scope.productID = $(this)[0].item.id;
      //   var existingSrc = $($event.target).attr('src');
      //   if (existingSrc == 'static/image/order-img/multiple1.png') {
      //     $($event.target).attr('src', 'static/image/order-img/multiple2.png');
      //     selectedExistingNum++;
      //     console.log(selectedExistingNum)
      //   } else {
      //     $($event.target).attr('src', 'static/image/order-img/multiple1.png');
      //     selectedExistingNum--;
      //     console.log(selectedExistingNum)
      //   }

      // }
      $scope.existingSearch = function(existinginfo) {
        console.log(existinginfo);
        if (existinginfo == '') {
          layer.msg('请输入SKU或商品名称')
        } else if (existinginfo == undefined) {
          layer.msg('请输入SKU或商品名称')
        } else {

          erp.postFun('app/sourcing/sourceGetProduct', JSON.stringify({
            inputStr: existinginfo,
            accountId: item.customerId
          }), function(res) {
            console.log(res.data);
            console.log(JSON.parse(res.data.result))
            // console.log(res.data.result.products);
            if (res.data.statusCode == 200) {
              var searchproducts = JSON.parse(res.data.result).products;
              if (searchproducts.length == 0) {
                $scope.existingPro = [];
                layer.msg(noData);
              } else {
                for (var i = 0; i < searchproducts.length; i++) {
                  searchproducts[i].existingWuliu = [];
                }
                $scope.existingPro = searchproducts;
                console.log($scope.existingPro);
              }
              // $scope.existingPro = JSON.parse(res.data.result).products;
              // console.log($scope.existingPro);

              // if ($scope.existingPro.length == 0) {
              //   layer.msg('暂无数据');
              // } else {
              //   erp.postFun2('getWayBy.json', {
              //       "weight": $scope.existingPro[0].packWeight,
              //       "lcharacter": $scope.existingPro[0].propertyKey
              //     },
              //     function(res) {
              //       console.log(res)
              //       $scope.existingWuliu = res.data;
              //       console.log($scope.existingWuliu)
              //       $scope.mylogistics = '请选择';
              //     },
              //     function(res) {
              //       console.log(res)

              //     })
              // }
            } else {
              layer.msg(noData);
            }
          }, function(res) {
            console.log(res)
            layer.msg('网络错误');
          })

        }
      }
      $scope.choseCurWuliu = function(curPro, curIndex) {
        //物流请求
        erp.postFun2('getWayBy.json', {
            "weight": curPro.packWeight,
            "lcharacter": curPro.propertyKey
          },
          function(res) {
            console.log(res)
            // $scope.existingWuliu = res.data;
            // $scope.mylogistics = '请选择';
            const {
              data
            } = res;
            if (data && data instanceof Array && data.length > 0) {
              $scope.existingPro[curIndex].existingWuliu = res.data;
              $scope.existingPro[curIndex].mylogistics = res.data[0].enName;
            } else {
              layer.msg('后台未返回数据')
            }

          },
          function(res) {
            console.log(res)
            layer.msg('网络错误')
          })
      }
      $scope.quxiaoFun = function() {
        $('.existing-tankuang').hide();
        $scope.existingPro = [];
        $scope.existinginfo = '';
      }
      $scope.quedingFun = function() {

        if (selectedExistingPro == null) {
          layer.msg('请选择一个商品')
          return;
        }
        if (!selectedExistingPro.mylogistics) {
          layer.msg('请给选择的商品指定物流方式')
          return;
        }

        erp.postFun('app/sourcing/assignSource', {
            "sourceId": $scope.sourceID,
            "productId": selectedExistingPro.id,
            "logistc": selectedExistingPro.mylogistics
          },
          function(res) {
            console.log(res)
            if (res.data.statusCode == 200) {
              // window.location.reload();
              var upJson = {};
              upJson.data = {};
              upJson.data.sourceId = $scope.sourceID;
              upJson.data.productId = selectedExistingPro.id;
              upJson.data.logistc = selectedExistingPro.mylogistics;
              upJson.data.type = '1';
              upJson.data = JSON.stringify(upJson.data)
              erp.postFun('app/locProduct/assign', JSON.stringify(upJson), function(res) {
                  console.log(res)
                },
                function(res) {
                  console.log(res)
                })
              firstRequire();
            }
          },
          function(res) {
            console.log(res)
          })
        $('.existing-tankuang').hide();

        // if (selectedExistingNum > 1 || selectedExistingNum == 0) {
        //   layer.msg('请选择一个商品')
        // } else {
        //   // app/sourcing/assignSource   post    {sourceId,productId,logistc}
        //   erp.postFun('app/sourcing/assignSource', {
        //       "sourceId": $scope.sourceID,
        //       "productId": $scope.productID,
        //       "logistc": $scope.mylogistics
        //     },
        //     function(res) {
        //       console.log(res)
        //       if (res.data.statusCode == 200) {
        //         // window.location.reload();
        //         firstRequire();
        //       }
        //     },
        //     function(res) {
        //       console.log(res)
        //     })
        //   $('.existing-tankuang').hide();
        //   selectedExistingNum = 0;
        // }

      }

    }

    //处理分页
    function erpsouFun(total, pagesize, current) {
      console.log(total, pagesize, current)
      $("#c-pages-fun").jqPaginator({
        totalCounts: total,
        pageSize: pagesize,
        visiblePages: 6,
        currentPage: current,
        activeClass: 'active',
        prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
        next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
        page: '<a href="javascript:void(0);">{{page}}<\/a>',
        first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
        last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
        onPageChange: function(n, type) {
          // $("#demo3-text").html("当前第" + n + "页")
          $scope.pagenum = n;
          $scope.num = n;
          var sourceList = {};
          sourceList.data = {};
          sourceList.data.pageSize = $scope.pagesize;
          sourceList.data.pageNum = $scope.pagenum;
          sourceList.data.status = $scope.statue;
          sourceList.data.customerName = $scope.searchinfo;
          sourceList.data.ownerName = $scope.ownerName;
          sourceList.data.sourcetypes = '1';
          sourceList.data.leftDate = $scope.leftDate;
          sourceList.data.rightDate = $scope.rightDate;
          sourceList.data = JSON.stringify(sourceList.data);
          console.log(JSON.stringify(sourceList));
          if (type == 'init') {
            return;
          }
          layer.load(2);
          erp.postFun('source/sourcing/erpList', JSON.stringify(sourceList), function(data) {
            layer.closeAll("loading");
            console.log(data);
            if (data.data.result) {
              $scope.sourceData = JSON.parse(data.data.result);
            } else {
              layer.msg(noData);
              $scope.sourceDataList = '';
              $scope.countNum = 0; //总条数
              return;
            }
            console.log($scope.sourceData);
            var date = Date.parse(new Date());
            $scope.sourceData.list.forEach(function(o, i) {
              if (o.jieZhiShiJianStr) {
                var jiezhiDate = (new Date(o.jieZhiShiJianStr.replace(new RegExp("-", "gm"), "/"))).getTime();
                if ((jiezhiDate - date) < 7200000) {
                  o.isAct = true;
                }
              }
            })
            $scope.sourceDataList = $scope.sourceData.list;
            for (var i = 0; i < $scope.sourceDataList.length; i++) {
              $scope.sourceDataList[i].imageUrl = $scope.sourceDataList[i].imageUrl.split(",");

            }
            $scope.countNum = $scope.sourceData.count; //总条数
            batchingOssImgHandle()
          }, function(data) {
            // alert(2)
            layer.msg('网络错误');
          })
        }
      });
    }

    function GetDateStr(AddDayCount) {
      var dd = new Date();
      console.log(dd);
      dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1; //获取当前月份的日期
      var d = dd.getDate();
      return y + "-" + m + "-" + d;
    }
    $scope.toFrontDetail = function(id) {
      var toUrl = window.open();
      erp.getFun('cj/locProduct/rollToken?id=' + id, function(data) {
        var data = data.data;
        if (data.statusCode != 200) {
          console.log(data);
          return;
        }
        var detailToken = data.result;
        console.log(detailToken);
        toUrl.location.href = erp.getAppUrl() + '/product-detail.html?id=' + id + '&token=' + detailToken;
      }, function(err) {
        console.log(err);
      });
    }

    function batchingOssImgHandle() {
      $scope.sourceDataList = $scope.sourceDataList.map(item => {
        item.calcImg = item.imageUrl.map(img => ({
          calcImg: handleOssImg(img),
          hover: false,
          img
        }))
        return item;
      })
      console.log('sourceDataList -->> ', $scope.sourceDataList)
    }

    // 等待搜品&初审失败
    function itemRequest(item) {
      //   console.log(item);
      let data = {};
      data.data = {
        "status": (function() {
          if (item.status == "1") { //等待搜品状态
            return "7" // 初审失败传7
          } else if (item.status == "6") { //待现有状态
            return "1" // 等待搜品传1
          }
        })(),
        "id": item.ID
      };
      data.data = JSON.stringify(data.data);
      //   console.log(JSON.stringify(data));

      erp.postFun('app/sourcing/modify1', JSON.stringify(data), res => {
        console.log(res);
        let data = res.data;
        if (data.statusCode != 200) {
          return layer.msg(data.message);
        }
        layer.msg(data.message);
        firstRequire();
      })
    }
    // 等待搜品
    $scope.waitSoupin = (item) => {
      itemRequest(item);
    }
    // 初审失败
    $scope.chushenFall = (item) => {
      itemRequest(item);
    }
    // 批量提交等待搜品
    $scope.batchWaitSoupin = () => {
      let checkedList = $scope.sourceDataList.filter(item => item.checked);
      console.log(checkedList);
      if (checkedList.length === 0) return layer.msg("请勾选要提交的搜品");
      let idList = [];
      checkedList.map(item => {
        idList.push(item.ID);
      })
      idList = JSON.stringify(idList);
      console.log(idList);
      let data = {};
      data.data = {
        "status": "1",
        "id": idList
      };
      data.data = JSON.stringify(data.data);
      erp.postFun('app/sourcing/modify1', data, res => {
        console.log(res);
        let data = res.data;
        if (data.statusCode != 200) {
          return layer.msg(data.message);
        }
        layer.msg(data.message);
        firstRequire();
      })
    }

    // 全选
    $scope.checkAll = () => {
      checkAll($scope);
    }
    // 单选
    $scope.checkOne = (item) => {
      checkOne($scope, item);
    }
  }])

  //平台搜品
  app.controller('ecjsourcing-controller', ['$scope', 'erp', '$location', '$routeParams', function($scope, erp, $location, $routeParams) {
    console.log('ecjsourcing-controller');
    $scope.whichPage = $routeParams.cjStu; // 2019-11-22 该页面 被哪个模块使用  1 情况下 才有 相似商品 
    console.log('whichPage ---> ', $routeParams.cjStu)
    $scope.soupinType = '1';
    erp.postFun('app/employee/getempbyname', {
      "data": "{'name':'', 'job': '销售'}"
    }, function(data) {
      $scope.salemanList = JSON.parse(data.data.result).list;
      console.log($scope.salemanList);
    });
    erp.postFun('app/account_erp/getAllSalesman', {}, res => {
      $scope.ownerList = JSON.parse(res.data.result)
      console.log($scope.ownerList)
    })
    $scope.changeSaleman = function() {
      $scope.searchinfo = $scope.salemanName;
      $scope.pagenum = 1;
      $scope.search();
    }
    $scope.changeOwnerName = function() {
      $scope.pagenum = 1;
      $scope.search();
    }
    var bs = new Base64();
    $scope.loginJob = localStorage.getItem('job') ? bs.decode(localStorage.getItem('job')) : '';
    console.log($scope.loginJob)
    var aDate;
    var enDate;
    var orderDate = sessionStorage.getItem('ptsp-data-time');
    var orderDate2 = sessionStorage.getItem('ptsp-data-time2');
    if (orderDate == null || orderDate == '' || orderDate == undefined) {
      aDate = GetDateStr(-14);
    } else {
      aDate = orderDate;
    }
    if (orderDate2 == null || orderDate2 == '' || orderDate2 == undefined) {
      enDate = GetDateStr(0);
    } else {
      enDate = orderDate2;
      $("#cdatatime2").val(enDate);
    }
    // 获取类目
    erp.postFun('erpSupplierSourceProduct/list', {}, res => {
      $scope.categoryList = res.data.data
    })

    $scope.isSetSourceError = false
    let that = this

    $scope.defeated = function(item) {
      $scope.isSetSourceError = true;
      that.no = {
        item,
        type: 'pingtai'
      }
    }
    $scope.$on('log-to-father', function(d, flag) {
      console.log(d, flag)
      if (d && flag) {
        $scope.isSetSourceError = flag.closeFlag;
      }
    })


    $("#c-data-time").val(aDate); //关键语句
    //$("#cdatatime2").val(enDate);//关键语句

    $scope.leftDate = $("#c-data-time").val();
    $scope.rightDate = $("#cdatatime2").val();
    console.log($scope.leftDate, $scope.rightDate);
    $scope.pagesize = '10';
    $scope.pagenum = 1;
    $scope.statue = '';
    $scope.searchinfo = '';
    // $scope.ownerName = ''

    $scope.spsbFlag = false;
    $scope.erpflag = false;
    $scope.erpstuflag = false;
    var ordStatus = $routeParams.cjStu || 0;
    ordStatus = parseInt(ordStatus);
    console.log(ordStatus);
    $scope.pagenum = 1;

    switch (ordStatus) {
      case 0:
        $scope.statue = '';
        break;

      case 1:
        $scope.statue = 1;
        break;

      case 2:
        $scope.statue = 0;
        break;

      case 3:
        $scope.statue = 2;
        break;
      case 4:
        $scope.statue = 8;
        break;
      case 5:
        $scope.statue = -1;
        break;
      case 6:
        $scope.statue = 6; // 新增等待现有页面
        break;
      case 7:
        $scope.statue = 7; // 新增搜品初审失败页面
        break;
    }
    if (ordStatus == 2) {
      $scope.spsbFlag = true;
    } else {
      $scope.spsbFlag = false;
    }

    function firstRequire() {
      var sourceList = {};
      // sourceList.data = {};
      sourceList.pageSize = $scope.pagesize + '';
      sourceList.pageNum = $scope.pagenum = '';
      sourceList.status = $scope.statue + '';
      sourceList.inputStr = $scope.searchinfo;
      // sourceList.ownerName = $scope.ownerName;
      sourceList.leftDate = $scope.leftDate;
      sourceList.rightDate = $scope.rightDate;
      sourceList.type = $scope.soupinType;

      console.log(JSON.stringify(sourceList))
      $scope.sourceData = '';
      layer.load(2);
      erp.postFun('pojo/product/getSourceErp', JSON.stringify(sourceList), con, function() {
        // alert(2)
        layer.msg('请求失败');
      });

      function con(data) {
        layer.closeAll("loading");
        if (data.data.result) {
          $scope.sourceData = JSON.parse(data.data.result);
        } else {
          layer.msg(noData);
          $scope.sourceDataList = '';
          return;
        }
        console.log($scope.sourceData)
        var date = Date.parse(new Date());
        $scope.sourceData.sources.forEach(function(o, i) {
          if (o.jieZhiShiJianStr) {
            var jiezhiDate = (new Date(o.jieZhiShiJianStr.replace(new RegExp("-", "gm"), "/"))).getTime();
            if ((jiezhiDate - date) < 7200000) {
              o.isAct = true;
            }
          }
        })
        $scope.sourceDataList = $scope.sourceData.sources.map(item => ({
          ...item,
          calcImg: handleOssImg(item.BIGIMG)
        }))
        $scope.countNum = $scope.sourceData.all; //总条数
        if ($scope.countNum == 0) {
          layer.msg(noData);
          return;
        } else {
          erpsouFun($scope.countNum, $scope.pagesize - 0, 1);
        }

      }
    }
    firstRequire();

    // 供应商报价操作

    $scope.dgzspFlag = false // 单个供应商报价的弹框是否显示
    $scope.plzspFlag = false // 多个供应商报价的弹框是否显示
    $scope.supplierId = ""
    $scope.chooseSource = {}
    $scope.batchChooseSource = [] // 已经选择的搜品
    $scope.supplierList = []
    // 获取供应商列表
    erp.postFun('supplier/user/userInfo/listAccountPage', JSON.stringify({
      pageNum: 1,
      pageSize: 1000
    }), res => {
      $scope.supplierList = res.data.data.list
    })

    // 指派供应商报价操作
    assignSupplier = function(ids, supplierId) {
      layer.load(2);
      const data = {
        ids,
        type: 1,
        supplierId,
      }
      erp.postFun('erpSupplierSourceProduct/updateByIds', JSON.stringify(data), function(res) {
        if (res.data.code == 200) {
          layer.closeAll("loading");
          window.location.reload();
        } else {
          layer.closeAll("loading");
          layer.msg(res.data.error)
        }
      })
    }

    $scope.closeSingleSearch = function() {
      $scope.dgzspFlag = false
    }

    $scope.closeBatchSearch = function() {
      $scope.plzspFlag = false
    }


    $scope.SupplierQuote = function(item) {
      $scope.dgzspFlag = true
      $scope.chooseSource = item
    }

    $scope.hanldeBatchSupplierQuote = function() {
      let num = 0
      let productList = []
      $scope.sourceDataList.map((item) => {
        if (item.checked) {
          productList.push(item)
        }
      })
      $scope.batchChooseSource = productList

      if (productList.length > 0) {
        $scope.plzspFlag = true
      } else {
        layer.msg('请勾选搜品!')
      }
    }

    // 单个的转搜品的确认按钮
    $scope.handleSingleConform = function() {
      if (!$scope.supplierId) {
        layer.msg('请选择供应商!')
        return
      }
      let ids = []
      let supplierId = $scope.supplierId
      ids.push($scope.chooseSource.ID || $scope.chooseSource.id)
      $scope.dgzspFlag = false
      assignSupplier(ids, supplierId)
    }

    // 批量转搜品的确认按钮
    $scope.handleBatchConform = function() {
      if (!$scope.supplierId) {
        layer.msg('请选择供应商!')
        return
      }
      let ids = []
      let supplierId = $scope.supplierId
      $scope.batchChooseSource.map((item) => {
        ids.push(item.ID || item.id)
      })
      $scope.plzspFlag = false
      assignSupplier(ids, supplierId)
    }



    // $scope.xzlmFlag = false;
    // function showCategory(singleItem) {
    //   $scope.xzlmFlag = true
    //   $scope.singleSearchItem = singleItem||'';
    //   $scope.isSingleSearch = singleItem?true:false;
    // } 

    // // 点击单个转供应商报价操作
    // $scope.SupplierQuote = function (item) {
    //   if(item.source_category){
    //     singleToSupplier(item,'')
    //   } else {
    //     showCategory(item)
    //   }
    // }

    // // 点击批量转供应商报价操作
    // $scope.hanldeBatchSupplierQuote = function () {
    //   let num =0
    //   console.log(num,'22222');
    //   $scope.sourceDataList.map((item)=>{
    //     if(item.checked) {
    //       num++
    //     }
    //   })
    //   console.log(num,'33333');
    //   if(num>0) {
    //     showCategory()
    //   }else{
    //     layer.msg('请勾选搜品!')
    //   }
    // }

    // // 选择类目
    // $scope.chooseCateGory = function (id) {
    //   $scope.chooseCateGoryId = id
    // }

    // // 点击取消
    // $scope.closeCategory =function() {
    //   $scope.xzlmFlag = false
    //   $scope.singleSearchItem = '';
    // }

    // // 点击确定
    // $scope.categoryConfirm =function() {
    //   if($scope.chooseCateGoryId){
    //     if($scope.isSingleSearch) {
    //       singleToSupplier($scope.singleSearchItem,$scope.chooseCateGoryId)
    //     }else{
    //       batchToSupplier()
    //     }
    //   }else{
    //      layer.msg("请选择类目")
    //   }
    // }

    // // 多个搜品转供应商
    // function batchToSupplier() {
    //   let productList = []
    //   $scope.sourceDataList.map((item)=>{
    //     if(item.checked) {
    //       productList.push({
    //         categoryId:item.source_category,
    //         sourceProductId:item.ID
    //       })
    //     }
    //   })
    //   const data = {
    //     categoryId:$scope.chooseCateGoryId,
    //     sourceProduct:productList,
    //     sourceProductType:2
    //   }
    //   layer.load(2);
    //   erp.postFun('erpSupplierSourceAllocateRecording/sourceAllocate', JSON.stringify(data), function (res) {
    //     if(res.data.code == 200) {
    //       $scope.xzlmFlag =false
    //       layer.closeAll('loading');
    //       window.location.reload();
    //     }else{
    //       layer.msg(res.data.message)
    //     }
    //   })
    // }

    // // 单个搜品转供应商
    // function singleToSupplier(item,id) {
    //   layer.load(2);
    //   const data = {
    //     categoryId:id,
    //     sourceProduct:[{
    //       categoryId:item.source_category,
    //       sourceProductId:item.ID
    //     }],
    //     sourceProductType:2
    //   }

    //   erp.postFun('erpSupplierSourceAllocateRecording/sourceAllocate', JSON.stringify(data), function (res) {
    //     if(res.data.code == 200) {
    //       $scope.xzlmFlag =false
    //       layer.closeAll('loading');
    //       window.location.reload();
    //     }else{
    //       layer.msg(res.data.message)
    //     }
    //   })
    // }


    // 供应商转报价结束



    $scope.selectSoupinType = () => {
      // console.log($scope.soupinType);
      firstRequire();
    }
    //描述
    $('.descripte-tankuang').hide();
    $scope.descripteFun = function(item) {
      $scope.word = $(this)[0].sourcelist.description;
      $scope.name = $(this)[0].sourcelist.name;
      $scope.number = $(this)[0].sourcelist.number;

      $('.descripte-tankuang').show();
    }
    $scope.closeDescripte = function() {
      $('.descripte-tankuang').hide();
    }

    //查看失败原因
    $scope.sbtcFlag = false;
    $scope.ckFun = function(item) {
      $scope.sbtcFlag = true;
      $scope.showText = item.failExplain;
    }
    $scope.gbckFun = function() {
      $scope.sbtcFlag = false;
      $scope.showText = '';
    }

    $scope.showProName = function(item) {
      if (item.STATUS == '2') {
        window.open('manage.html#/merchandise/show-detail/' + item.LOCPID + '/0/3/0', '_blank', '');
      } else {
        layer.open({
          title: '商品名称',
          content: item.NAME
        });
      }
    }


    //录入操作
    $scope.enter = function(item) {
      console.log(item)
      layer.load(2);
      erp.postFun("app/externalPurchase/isEntering", {
        sourceId: item.ID
      }, function(res) {
        layer.closeAll("loading");
        if (res.data.code == 200) {
          if (item.ZFORDERID) {
            window.open('manage.html#/merchandise/addSKU1/orderproduct=' + item.ZFORDERID + '//0', '_blank', '');
          } else {
            sessionStorage.setItem('sourceId', item.ID);
            // sessionStorage.setItem('sourcecustomerId', item.customerId);
            sessionStorage.setItem('addkey', 1);
            // var customerId = item.ACCID + ''
            if (item.categorys) {
              $location.path('/merchandise/addSKU2/cjsource=' + item.ID + '/' + item.categorys['id'] + '/0');
            } else {
              $location.path('/merchandise/addSKU1/cjsource=' + item.ID + '//0');
            }
          }
        } else {
          layer.msg(res.data.message)
        }
      }, function(err) {
        layer.msg('服务器错误')
      });
    }

    //失败操作
    $('.action-tankuang').hide();
    // $scope.defeated = function (item) {
    //     $('.fail-text').val("");
    //     var failReson = '';//存储失败原因
    //     $('.action-tankuang').show();
    //     $scope.noFun = function () {
    //         $('.action-tankuang').hide();
    //     }
    //     $scope.yesFun = function () {
    //         failReson = $('.fail-text').val();
    //         if (!failReson.trim()) {
    //             layer.msg('请填写失败原因！');
    //             return;
    //         }
    //         erp.postFun('app/sourcing/cjModify', {
    //             'sourceId': item.ID, 'failExplain': failReson
    //         }, function (n) {
    //             console.log(n);
    //             $('.action-tankuang').hide();
    //             location.reload();
    //         }, function (n) {
    //             // alert(2)
    //             layer.msg('网络错误');
    //         })
    //     }

    // }


    //  搜索
    $scope.search = function() {
      console.log($scope.searchinfo);
      $scope.pagenum = 1;
      var sourceList = {};
      // sourceList.data = {};
      sourceList.pageSize = $scope.pagesize + '';
      sourceList.pageNum = '1';
      sourceList.status = $scope.statue + '';
      sourceList.inputStr = $scope.searchinfo;
      sourceList.ownerName = $scope.ownerName;
      sourceList.leftDate = $scope.leftDate;
      sourceList.rightDate = $scope.rightDate;

      console.log(JSON.stringify(sourceList))
      $scope.sourceData = '';
      erp.postFun('pojo/product/getSourceErp', JSON.stringify(sourceList), con, function() {
        // alert(2)
      })

      function con(data) {
        if (data.data.result) {
          $scope.sourceData = JSON.parse(data.data.result);
        } else {
          layer.msg(noData);
          $scope.sourceDataList = '';
          return;
        }
        console.log($scope.sourceData);
        var date = Date.parse(new Date());
        $scope.sourceData.sources.forEach(function(o, i) {
          if (o.jieZhiShiJianStr) {
            var jiezhiDate = (new Date(o.jieZhiShiJianStr.replace(new RegExp("-", "gm"), "/"))).getTime();
            if ((jiezhiDate - date) < 7200000) {
              o.isAct = true;
            }
          }
        })
        $scope.sourceDataList = $scope.sourceData.sources.map(item => ({
          ...item,
          calcImg: handleOssImg(item.BIGIMG)
        }))
        $scope.countNum = $scope.sourceData.all; //总条数
        if ($scope.countNum == 0) {
          layer.msg(noData);
          return;
        } else {
          erpsouFun($scope.countNum, $scope.pagesize - 0, 1);
        }

      }
    }

    //日期搜索
    $scope.dateSearchFun = function() {
      $scope.pagenum = '1';
      $scope.leftDate = $("#c-data-time").val();
      $scope.rightDate = $("#cdatatime2").val();
      sessionStorage.setItem('ptsp-data-time', $scope.leftDate);
      sessionStorage.setItem('ptsp-data-time2', $scope.rightDate);
      console.log($scope.leftDate, $scope.rightDate);
      var sourceList = {};
      // sourceList.data = {};
      sourceList.pageSize = $scope.pagesize + '';
      sourceList.pageNum = '1';
      sourceList.status = $scope.statue + '';
      sourceList.inputStr = $scope.searchinfo;
      sourceList.ownerName = $scope.ownerName;
      sourceList.leftDate = $scope.leftDate;
      sourceList.rightDate = $scope.rightDate;
      sourceList.type = $scope.soupinType;

      console.log(JSON.stringify(sourceList))
      $scope.sourceData = '';
      layer.load(2);
      erp.postFun('pojo/product/getSourceErp', JSON.stringify(sourceList), con, function() {
        // alert(2)
      })

      function con(data) {
        layer.closeAll("loading");
        if (data.data.result) {
          $scope.sourceData = JSON.parse(data.data.result);
        } else {
          layer.msg(noData);
          return;
        }
        console.log($scope.sourceData);
        var date = Date.parse(new Date());
        $scope.sourceData.sources.forEach(function(o, i) {
          if (o.jieZhiShiJianStr) {
            var jiezhiDate = (new Date(o.jieZhiShiJianStr.replace(new RegExp("-", "gm"), "/"))).getTime();
            if ((jiezhiDate - date) < 7200000) {
              o.isAct = true;
            }
          }
        })
        $scope.sourceDataList = $scope.sourceData.sources.map(item => ({
          ...item,
          calcImg: handleOssImg(item.BIGIMG)
        }))
        $scope.countNum = $scope.sourceData.all; //总条数
        if ($scope.countNum == 0) {
          layer.msg(noData);
          return;
        } else {
          erpsouFun($scope.countNum, $scope.pagesize - 0, 1);
        }

      }


    }
    //  切换类目条数
    $scope.pagesizechange = function(n) {
      console.log($scope.pagesize)
      $scope.pagenum = 1;
      var sourceList = {};
      // sourceList.data = {};
      sourceList.pageSize = $scope.pagesize + '';
      sourceList.pageNum = $scope.pagenum + '';
      sourceList.status = $scope.statue + '';
      sourceList.inputStr = $scope.searchinfo;
      sourceList.ownerName = $scope.ownerName;
      sourceList.leftDate = $scope.leftDate;
      sourceList.rightDate = $scope.rightDate;
      console.log(JSON.stringify(sourceList))
      $scope.sourceData = '';
      erp.postFun('pojo/product/getSourceErp', JSON.stringify(sourceList), con, function() {
        // alert(2)
      })

      function con(data) {
        if (data.data.result) {
          $scope.sourceData = JSON.parse(data.data.result);
        } else {
          layer.msg(noData);
          return;
        }
        console.log($scope.sourceData)
        var date = Date.parse(new Date());
        $scope.sourceData.sources.forEach(function(o, i) {
          if (o.jieZhiShiJianStr) {
            var jiezhiDate = (new Date(o.jieZhiShiJianStr.replace(new RegExp("-", "gm"), "/"))).getTime();
            if ((jiezhiDate - date) < 7200000) {
              o.isAct = true;
            }
          }
        })
        $scope.sourceDataList = $scope.sourceData.sources.map(item => ({
          ...item,
          calcImg: handleOssImg(item.BIGIMG)
        }))
        $scope.countNum = $scope.sourceData.all; //总条数
        if ($scope.countNum == 0) {
          layer.msg(noData);
          return;
        } else {
          erpsouFun($scope.countNum, $scope.pagesize - 0, 1);
        }

      }
    }
    //跳页
    $scope.num = 1;
    $scope.pagechange = function(num) {
      console.log($scope.num);
      if ($scope.num == "" || $scope.num == null || $scope.num == undefined) {
        layer.msg("错误页码");
        return;
      }
      if ($scope.num == 0) {
        $scope.num = 1;
      }
      $scope.pagenum = $scope.num;
      var totalPage = Math.ceil($scope.countNum / $scope.pagesize);
      if ($scope.pagenum > totalPage) {
        layer.msg("错误页码");
        return;
      }
      var sourceList = {};
      // sourceList.data = {};
      sourceList.pageSize = $scope.pagesize + '';
      sourceList.pageNum = $scope.pagenum + '';
      sourceList.status = $scope.statue + '';
      sourceList.inputStr = $scope.searchinfo;
      sourceList.ownerName = $scope.ownerName;
      sourceList.leftDate = $scope.leftDate;
      sourceList.rightDate = $scope.rightDate;
      console.log(JSON.stringify(sourceList))
      $scope.sourceData = '';
      erp.postFun('pojo/product/getSourceErp', JSON.stringify(sourceList), con, function(res) {
        // alert(2)
        console.log(res);
      })

      function con(data) {
        if (data.data.result) {
          $scope.sourceData = JSON.parse(data.data.result);
        } else {
          layer.msg(noData);
          $scope.sourceDataList = '';
          return;
        }
        console.log($scope.sourceData);
        var date = Date.parse(new Date());
        $scope.sourceData.sources.forEach(function(o, i) {
          if (o.jieZhiShiJianStr) {
            var jiezhiDate = (new Date(o.jieZhiShiJianStr.replace(new RegExp("-", "gm"), "/"))).getTime();
            if ((jiezhiDate - date) < 7200000) {
              o.isAct = true;
            }
          }
        })
        $scope.sourceDataList = $scope.sourceData.sources.map(item => ({
          ...item,
          calcImg: handleOssImg(item.BIGIMG)
        }))
        $scope.countNum = $scope.sourceData.all; //总条数
        if ($scope.countNum == 0) {
          layer.msg(noData);
          return;
        } else {
          erpsouFun($scope.countNum, $scope.pagesize - 0, $scope.pagenum * 1);
        }

      }
    }

    // 相似商品
    $scope.showSimilarGoods = function(item) {
      const {
        pids
      } = item;
      console.log('showSimilarGoods item', item)
      if (!pids) return;
      layer.load(2);
      const url = `app/picture/getsourceProducts?pids=${pids}`;
      erp.getFun(url, function({
        data
      }) {
        layer.closeAll('loading');
        console.log('showSimilarGoods ---> data ', data)

        if (data.statusCode === '200') {
          const {
            products
          } = retSaveResult(data.result) || {};
          console.log('showSimilarGoods ---> res ', products)
          products.forEach(item => item.existingWuliu = []); //一开始 选择物流为空 须以空数组 表示 
          $scope.existingPro = products;
          $scope.existingProFun(item) //调用 原先的功能 保留原先功能不变
        }
      }, function() {
        layer.closeAll('loading');
        layer.msg('网络错误')
      })
    }

    //现有商品操作
    // $('.existing-tankuang').hide();
    $scope.xyspFlag = false;
    $scope.existingProFun = function(item) {
      console.log(item)

      // 2019-11-21 取消以图搜图功能 (以下代码 git 显示 jerry 操作)
      // let imgUrl = 'https://' + item.BIGIMG;
      // let formData = new FormData();
      // formData.append('imgUrl', imgUrl);
      // layer.load(2);
      // erp.upLoadImgPost('app/picture/searchSourceProduct', formData, function (res) {
      //     layer.closeAll("loading");
      //     // console.log(res);
      //     let data = res.data;
      //     if (data.statusCode == '200') {
      //         let searchProducts = JSON.parse(data.result).products;
      //         // console.log(searchProducts);
      //         if (searchProducts.length == 0) {
      //             $scope.existingPro = [];
      //             layer.msg(noData);
      //         } else {
      //             for (var i = 0; i < searchProducts.length; i++) {
      //                 searchProducts[i].existingWuliu = [];
      //             }
      //             $scope.existingPro = searchProducts;
      //             // console.log($scope.existingPro);
      //         }
      //     } else {
      //         layer.msg(data.message);
      //     }
      // })

      $scope.sourceID = item.ID;
      // $('.existing-tankuang').show();
      $scope.xyspFlag = true;
      $scope.isZfOrdId = item.ZFORDERID;
      console.log($scope.isZfOrdId)
      var selectedExistingPro = null;
      $scope.selectedExisting = function($event, item2) {
        // console.log($(this)[0].item.id)
        // return;
        // $scope.productID = $(this)[0].item.id;
        var existingSrc = $($event.target).attr('src');
        if (existingSrc == 'static/image/public-img/radiobutton1.png') {
          $('.esou-cheked').attr('src', 'static/image/public-img/radiobutton1.png');
          $($event.target).attr('src', 'static/image/public-img/radiobutton2.png');
          // selectedExistingNum++;
          // console.log(selectedExistingNum)
          selectedExistingPro = item2;
        } else {
          $($event.target).attr('src', 'static/image/public-img/radiobutton1.png');
          selectedExistingPro = null;
          // selectedExistingNum--;
          // console.log(selectedExistingNum)
        }
        console.log(selectedExistingPro);
      }
      // var selectedExistingNum = 0;
      // $scope.selectedExisting = function($event, item) {
      //   console.log($(this)[0].item.id)
      //     // return;
      //   $scope.productID = $(this)[0].item.id;
      //   var existingSrc = $($event.target).attr('src');
      //   if (existingSrc == 'static/image/order-img/multiple1.png') {
      //     $($event.target).attr('src', 'static/image/order-img/multiple2.png');
      //     selectedExistingNum++;
      //     console.log(selectedExistingNum)
      //   } else {
      //     $($event.target).attr('src', 'static/image/order-img/multiple1.png');
      //     selectedExistingNum--;
      //     console.log(selectedExistingNum)
      //   }
      // }
      $scope.existingSearch = function(existinginfo) {
        console.log(existinginfo);
        if (existinginfo == '') {
          layer.msg('请输入SKU或商品名称')
        } else if (existinginfo == undefined) {
          layer.msg('请输入SKU或商品名称')
        } else {

          // 'app/sourcing/sourceGetProduct?inputStr=' + existinginfo,

          erp.postFun('app/sourcing/sourceGetProduct', JSON.stringify({
            inputStr: existinginfo,
            accountId: item.customerId
          }), function(res) {
            console.log(res.data);
            console.log(JSON.parse(res.data.result))
            // console.log(res.data.result.products);
            if (res.data.statusCode == 200) {
              var searchproducts = JSON.parse(res.data.result).products;
              if (searchproducts.length == 0) {
                $scope.existingPro = [];
                layer.msg(noData);
              } else {
                for (var i = 0; i < searchproducts.length; i++) {
                  searchproducts[i].existingWuliu = [];
                }
                $scope.existingPro = searchproducts;
                console.log($scope.existingPro);
              }
              // $scope.existingPro = JSON.parse(res.data.result).products;
              // console.log($scope.existingPro);

              // if ($scope.existingPro.length == 0) {
              //   layer.msg('暂无数据');
              // } else {
              //   erp.postFun2('getWayBy.json', {
              //       "weight": $scope.existingPro[0].packWeight,
              //       "lcharacter": $scope.existingPro[0].propertyKey
              //     },
              //     function(res) {
              //       console.log(res)
              //       $scope.existingWuliu = res.data;
              //       console.log($scope.existingWuliu)
              //       $scope.mylogistics = '请选择';
              //     },
              //     function(res) {
              //       console.log(res)

              //     })
              // }
            } else {
              layer.msg(noData);
            }
          }, function(res) {
            console.log(res)
            layer.msg('网络错误');
          })

        }
      }
      $scope.choseCurWuliu = function(curPro, curIndex) {
        //物流请求
        erp.postFun2('getWayBy.json', {
            "weight": curPro.packWeight,
            "lcharacter": curPro.propertyKey
          },
          function(res) {
            console.log(res)
            // $scope.existingWuliu = res.data;
            // $scope.mylogistics = '请选择';
            const {
              data
            } = res;
            if (data && data instanceof Array && data.length > 0) {
              $scope.existingPro[curIndex].existingWuliu = res.data;
              $scope.existingPro[curIndex].mylogistics = res.data[0].enName;
            } else {
              layer.msg('后台未返回数据')
            }
          },
          function(res) {
            console.log(res)
            layer.msg('网络错误')
          })
      }
      $scope.quxiaoFun = function() {
        // $('.existing-tankuang').hide();
        $scope.xyspFlag = false;
        $scope.existingPro = [];
        $scope.existinginfo = '';
      }
      $scope.selSkuBtFun = function(item) {
        console.log(item)
        var itemSkuName = item.skuName;
        for (var i = 0, len = $scope.stanProductList.length; i < len; i++) {
          if (itemSkuName == $scope.stanProductList[i].SKU) {
            item['PID'] = $scope.stanProductList[i].PID;
            item['NAMEEN'] = $scope.stanProductList[i].NAMEEN;
            item['NAME'] = $scope.stanProductList[i].NAME;
            item['ENTRYVALUE'] = $scope.stanProductList[i].ENTRYVALUE;
            item['ENTRYCODE'] = $scope.stanProductList[i].ENTRYCODE;
            item['BIGIMG'] = $scope.stanProductList[i].BIGIMG;
            item['ID'] = $scope.stanProductList[i].ID;
          }
        }
        console.log(item)
      }
      $scope.selBtConQuxiaoFun = function() {
        $scope.spBtTkFlag = false;
        $scope.existingPro = [];
      }
      $scope.selBtConfirmFun = function() {
        var upJson = {};
        upJson.stanList = [];
        upJson.ZFOrderId = $scope.isZfOrdId;
        for (var i = 0, len = $scope.spBtList.length; i < len; i++) {
          if (!$scope.spBtList[i].skuName) {
            layer.msg('请选择变体')
            return
          } else {
            console.log($scope.spBtList[i])
            upJson.stanList.push({
              SKU: $scope.spBtList[i].skuName,
              ID: $scope.spBtList[i].ID,
              PID: $scope.spBtList[i].PID,
              NAMEEN: $scope.spBtList[i].NAMEEN,
              NAME: $scope.spBtList[i].NAME,
              ENTRYVALUE: $scope.spBtList[i].ENTRYVALUE,
              ENTRYCODE: $scope.spBtList[i].ENTRYCODE,
              BIGIMG: $scope.spBtList[i].BIGIMG,
              payProductId: $scope.spBtList[i].payProductId
            })
          }
        }
        erp.load()
        console.log(upJson)
        erp.postFun('app/externalPurchase/sysncPayProduct', JSON.stringify(upJson), function(data) {
          console.log(data)
          if (data.data.code == 200) {
            layer.msg('指定成功')
            $scope.spBtTkFlag = false;
            $scope.existingPro = [];
            erp.postFun('app/sourcing/assignSource', {
                "sourceId": $scope.sourceID,
                "productId": selectedExistingPro.id,
                "logistc": selectedExistingPro.mylogistics
              },
              function(res) {
                console.log(res)
                if (res.data.statusCode == 200) {
                  window.location.reload();
                  // firstRequire();
                } else {
                  erp.closeLoad()
                }
              },
              function(res) {
                console.log(res)
                erp.closeLoad()
              })
          } else {
            layer.msg('指定失败')
            erp.closeLoad()
          }
        }, function(data) {
          console.log(data)
          erp.closeLoad()
        })
      }
      $scope.quedingFun = function() {
        if (selectedExistingPro == null) {
          layer.msg('请选择一个商品')
          return;
        }
        if (!selectedExistingPro.mylogistics) {
          layer.msg('请给选择的商品指定物流方式')
          return;
        }
        if ($scope.isZfOrdId) {
          $scope.xyspFlag = false;
          // $scope.spBtTkFlag = true;
          erp.postFun('app/externalPurchase/selectZFOrderOfProductList', {
            'ZFOrderId': $scope.isZfOrdId,
            'locProductId': selectedExistingPro.id,
          }, function(data) {
            console.log(data)
            var result = data.data.Result;
            $scope.spBtList = result.payproductList;
            $scope.stanProductList = result.stanProductList;
            if ($scope.stanProductList && $scope.stanProductList.length > 0) {
              for (var j = 0, jlen = $scope.stanProductList.length; i < jlen; j++) {
                $scope.stanProductList[j].skuName = '';
              }
            }
            $scope.spBtTkFlag = true;
            var skuArr = [];
            var resSkuList = result.stanProductList;
            if (resSkuList && resSkuList.length > 0) {
              for (var i = 0, len = resSkuList.length; i < len; i++) {
                skuArr.push(resSkuList[i].SKU)
              }
            }
            $scope.resSkuBtList = skuArr;
            console.log($scope.resSkuBtList)
          }, function(data) {
            console.log(data)
          }, {
            layer: true
          })
          return
        }
        // sysncPayProduct
        erp.postFun('app/sourcing/assignSource', {
            "sourceId": $scope.sourceID,
            "productId": selectedExistingPro.id,
            "logistc": selectedExistingPro.mylogistics
          },
          function(res) {
            console.log(res)
            if (res.data.statusCode == 200) {
              window.location.reload();
              // firstRequire();
            }
          },
          function(res) {
            console.log(res)
          })
        // $('.existing-tankuang').hide();
        $scope.xyspFlag = false;

        // if (selectedExistingNum > 1 || selectedExistingNum == 0) {
        //   layer.msg('请选择一个商品')
        // } else {
        //   // app/sourcing/assignSource   post    {sourceId,productId,logistc}
        //   erp.postFun('app/sourcing/assignSource', {
        //       "sourceId": $scope.sourceID,
        //       "productId": $scope.productID,
        //       "logistc": $scope.mylogistics
        //     },
        //     function(res) {
        //       console.log(res)
        //       if (res.data.statusCode == 200) {
        //         // window.location.reload();
        //         firstRequire();
        //       }
        //     },
        //     function(res) {
        //       console.log(res)
        //     })
        //   $('.existing-tankuang').hide();
        //   selectedExistingNum = 0;
        // }

      }

    }

    //处理分页
    function erpsouFun(total, pagesize, current) {
      console.log(total, pagesize, current)
      $("#c-pages-fun").jqPaginator({
        totalCounts: total || 1,
        pageSize: pagesize,
        visiblePages: 6,
        currentPage: current,
        activeClass: 'active',
        prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
        next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
        page: '<a href="javascript:void(0);">{{page}}<\/a>',
        first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
        last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
        onPageChange: function(n, type) {
          // $("demo3-text").html("当前第" + n + "页")
          $scope.pagenum = n;
          $scope.num = n;
          var sourceList = {};
          // sourceList.data = {};
          sourceList.pageSize = $scope.pagesize + '';
          sourceList.pageNum = $scope.pagenum + '';
          sourceList.status = $scope.statue + '';
          sourceList.inputStr = $scope.searchinfo;
          sourceList.ownerName = $scope.ownerName;
          sourceList.leftDate = $scope.leftDate;
          sourceList.rightDate = $scope.rightDate;
          console.log(JSON.stringify(sourceList))
          $scope.sourceData = '';
          if (type == 'init') {
            return;
          }
          erp.postFun('pojo/product/getSourceErp', JSON.stringify(sourceList), function(data) {
            console.log(data)
            $scope.sourceData = JSON.parse(data.data.result);
            console.log($scope.sourceData);
            var date = Date.parse(new Date());
            $scope.sourceData.sources.forEach(function(o, i) {
              if (o.jieZhiShiJianStr) {
                var jiezhiDate = (new Date(o.jieZhiShiJianStr.replace(new RegExp("-", "gm"), "/"))).getTime();
                if ((jiezhiDate - date) < 7200000) {
                  o.isAct = true;
                }
              }
            })
            $scope.sourceDataList = $scope.sourceData.sources.map(item => ({
              ...item,
              calcImg: handleOssImg(item.BIGIMG)
            }))
            $scope.countNum = $scope.sourceData.all; //总条数
          }, function() {
            // alert(2)
          })
        }
      });
    }

    function GetDateStr(AddDayCount) {
      var dd = new Date();
      console.log(dd)
      dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1; //获取当前月份的日期
      var d = dd.getDate();
      return y + "-" + m + "-" + d;
    }
    $scope.toFrontDetail = function(id) {
      var toUrl = window.open();
      erp.getFun('cj/locProduct/rollToken?id=' + id, function(data) {
        var data = data.data;
        if (data.statusCode != 200) {
          console.log(data);
          return;
        }
        var detailToken = data.result;
        console.log(detailToken);
        toUrl.location.href = erp.getAppUrl() + '/product-detail.html?id=' + id + '&token=' + detailToken;
      }, function(err) {
        console.log(err);
      });
    }

    // 等待搜品&初审失败
    function itemRequest(item) {
      //   console.log(item);
      let data = {
        "status": (function() {
          if (item.STATUS == "1") { //等待搜品状态
            return "7" // 初审失败传7
          } else if (item.STATUS == "6") { //待现有状态
            return "1" // 等待搜品传1
          }
        })(),
        "sourceId": item.ID
      };

      erp.postFun('app/sourcing/cjModify1', data, res => {
        console.log(res);
        let data = res.data;
        if (data.statusCode != 200) {
          return layer.msg(data.message);
        }
        layer.msg(data.message);
        firstRequire();
      })
    }
    // 等待搜品
    $scope.waitSoupin = (item) => {
      itemRequest(item);
    }
    // 初审失败
    $scope.chushenFall = (item) => {
      itemRequest(item);
    }
    // 批量提交等待搜品
    $scope.batchWaitSoupin = () => {
      let checkedList = $scope.sourceDataList.filter(item => item.checked);
      console.log(checkedList);
      if (checkedList.length === 0) return layer.msg("请勾选要提交的搜品");
      let idList = [];
      checkedList.map(item => {
        idList.push(item.ID);
      })
      idList = JSON.stringify(idList);
      console.log(idList);
      let data = {
        "status": "1",
        "sourceId": idList
      };
      erp.postFun('app/sourcing/cjModify1', data, res => {
        console.log(res);
        let data = res.data;
        if (data.statusCode != 200) {
          return layer.msg(data.message);
        }
        layer.msg(data.message);
        firstRequire();
      })
    }

    // 全选
    $scope.checkAll = () => {
      checkAll($scope);
    }
    // 单选
    $scope.checkOne = (item) => {
      checkOne($scope, item);
    }
  }])

  /*游客搜品*/
  app.controller('cumsourcing-controller', ['$scope', 'erp', '$location', '$routeParams', function($scope, erp, $location, $routeParams) {
    $scope.whichPage = $routeParams.tabstu; // 2019-11-22 该页面 被哪个模块使用  1 情况下 才有 相似商品 
    console.log('whichPage ---> ', $routeParams.tabstu)
    var bs = new Base64();
    $scope.loginJob = localStorage.getItem('job') ? bs.decode(localStorage.getItem('job')) : '';
    console.log($scope.loginJob)
    var aDate;
    var enDate;
    var orderDate = sessionStorage.getItem('ptsp-data-time');
    var orderDate2 = sessionStorage.getItem('ptsp-data-time2');
    if (orderDate == null || orderDate == '' || orderDate == undefined) {
      aDate = GetDateStr(-14);
    } else {
      aDate = orderDate;
    }
    if (orderDate2 == null || orderDate2 == '' || orderDate2 == undefined) {
      enDate = GetDateStr(0);
    } else {
      enDate = orderDate2;
      $("#cdatatime2").val(enDate);
    }

    $scope.isSetSourceError = false
    let that = this

    $scope.defeated = function(item) {
      $scope.isSetSourceError = true;
      that.no = {
        item,
        type: 'youke'
      }
    }
    $scope.$on('log-to-father', function(d, flag) {
      console.log(d, flag)
      if (d && flag) {
        $scope.isSetSourceError = flag.closeFlag;
      }
    })

    // 获取类目
    erp.postFun('erpSupplierSourceProduct/list', {}, res => {
      $scope.categoryList = res.data.data
    })

    erp.postFun('app/employee/getempbyname', {
      "data": "{'name':'', 'job': '销售'}"
    }, function(data) {
      $scope.salemanList = JSON.parse(data.data.result).list;
      console.log($scope.salemanList);
    });
    $scope.changeSaleman = function() {
      $scope.searchinfo = $scope.salemanName;
      $scope.pagenum = 1;
      firstRequire();
    }
    $("#c-data-time").val(aDate); //关键语句
    //$("#cdatatime2").val(enDate);//关键语句

    $scope.leftDate = $("#c-data-time").val();
    $scope.rightDate = $("#cdatatime2").val();
    console.log($scope.leftDate, $scope.rightDate);
    $scope.soupinType = '1';
    $scope.pagesize = '10';
    $scope.pagenum = 1;
    $scope.statue = '';
    $scope.searchinfo = '';
    $scope.spsbFlag = false;
    $scope.erpflag = false;
    $scope.erpstuflag = false;
    $scope.status = $routeParams.tabstu || '';
    console.log($scope.status)
    //ordStatus = parseInt(ordStatus);
    //console.log(ordStatus);
    $scope.pagenum = 1;

    /*     switch (ordStatus) {
                 case 0:
                     $scope.statue = '';
                     break;
     
                 case 1:
                     $scope.statue = 1;
                     break;
     
                 case 2:
                     $scope.statue = 0;
                     break;
     
                 case 3:
                     $scope.statue = 2;
                     break;
                 case 4:
                     $scope.statue = 8;
                     break;
                 case 5:
                     $scope.statue = -1;
                     break;
             }*/
    $scope.sourceData = '';

    function firstRequire() {
      var sourceList = {
        pageSize: $scope.pagesize,
        pageNum: $scope.pagenum,
        filter: {
          empNameCN: $scope.salemanName,
          status: $scope.status
        },
        type: $scope.soupinType
      };
      console.log(JSON.stringify(sourceList))

      layer.load(2);
      erp.postFun('pojo/touristSource/getErpList', JSON.stringify(sourceList), function(data) {
        layer.closeAll("loading");
        if (data.data.result) {
          $scope.sourceData = JSON.parse(data.data.result);
          $scope.sourceDataList = $scope.sourceData.list;
          $scope.sourceDataList.forEach(function(o, i) {
            console.log(o.images)
            o.images = o.images.substring(1, o.images.length - 1).replace(/"/g, "").split(',');
          })
          console.log($scope.sourceData)
          batchingOssImgHandle()
          $scope.countNum = $scope.sourceData.total; //总条数
          if ($scope.countNum == 0) {
            layer.msg(noData);
            return;
          } else {
            erpsouFun($scope.countNum, $scope.pagesize - 0, $scope.pagenum * 1);
          }
        } else {
          layer.msg(noData);
          $scope.sourceDataList = '';
          return;
        }
      }, function() {
        layer.msg('请求失败');
      });
    }
    firstRequire();

    // 供应商报价操作

    $scope.dgzspFlag = false // 单个供应商报价的弹框是否显示
    $scope.plzspFlag = false // 多个供应商报价的弹框是否显示
    $scope.supplierId = ""
    $scope.chooseSource = {}
    $scope.batchChooseSource = [] // 已经选择的搜品
    $scope.supplierList = []
    // 获取供应商列表
    erp.postFun('supplier/user/userInfo/listAccountPage', JSON.stringify({
      pageNum: 1,
      pageSize: 1000
    }), res => {
      $scope.supplierList = res.data.data.list
    })

    // 指派供应商报价操作
    assignSupplier = function(ids, supplierId) {
      layer.load(2);
      const data = {
        ids,
        type: 3,
        supplierId,
      }
      erp.postFun('erpSupplierSourceProduct/updateByIds', JSON.stringify(data), function(res) {
        if (res.data.code == 200) {
          layer.closeAll("loading");
          window.location.reload();
        } else {
          layer.closeAll("loading");
          layer.msg(res.data.error)
        }
      })
    }

    $scope.closeSingleSearch = function() {
      $scope.dgzspFlag = false
    }

    $scope.closeBatchSearch = function() {
      $scope.plzspFlag = false
    }


    $scope.SupplierQuote = function(item) {
      $scope.dgzspFlag = true
      $scope.chooseSource = item
    }

    $scope.hanldeBatchSupplierQuote = function() {
      let num = 0
      let productList = []
      $scope.sourceDataList.map((item) => {
        if (item.checked) {
          productList.push(item)
        }
      })
      $scope.batchChooseSource = productList

      if (productList.length > 0) {
        $scope.plzspFlag = true
      } else {
        layer.msg('请勾选搜品!')
      }
    }

    // 单个的转搜品的确认按钮
    $scope.handleSingleConform = function() {
      if (!$scope.supplierId) {
        layer.msg('请选择供应商!')
        return
      }
      let ids = []
      let supplierId = $scope.supplierId
      ids.push($scope.chooseSource.ID || $scope.chooseSource.id)
      $scope.dgzspFlag = false
      assignSupplier(ids, supplierId)
    }

    // 批量转搜品的确认按钮
    $scope.handleBatchConform = function() {
      if (!$scope.supplierId) {
        layer.msg('请选择供应商!')
        return
      }
      let ids = []
      let supplierId = $scope.supplierId
      $scope.batchChooseSource.map((item) => {
        ids.push(item.ID || item.id)
      })
      $scope.plzspFlag = false
      assignSupplier(ids, supplierId)
    }

    // $scope.xzlmFlag = false;
    // function showCategory(singleItem) {
    //   $scope.xzlmFlag = true
    //   $scope.singleSearchItem = singleItem||'';
    //   $scope.isSingleSearch = singleItem?true:false;
    // } 

    // // 点击单个转供应商报价操作
    // $scope.SupplierQuote = function (item) {
    //   if(item.sourceCategory){
    //     singleToSupplier(item,'')
    //   } else {
    //     showCategory(item)
    //   }
    // }

    // // 点击批量转供应商报价操作
    // $scope.hanldeBatchSupplierQuote = function () {
    //   let num =0
    //   console.log(num,'22222');
    //   $scope.sourceDataList.map((item)=>{
    //     if(item.checked) {
    //       num++
    //     }
    //   })
    //   console.log(num,'33333');
    //   if(num>0) {
    //     showCategory()
    //   }else{
    //     layer.msg('请勾选搜品!')
    //   }
    // }

    // // 选择类目
    // $scope.chooseCateGory = function (id) {
    //   $scope.chooseCateGoryId = id
    // }

    // // 点击取消
    // $scope.closeCategory =function() {
    //   $scope.xzlmFlag = false
    //   $scope.singleSearchItem = '';
    // }

    // // 点击确定
    // $scope.categoryConfirm =function() {
    //   if($scope.chooseCateGoryId){
    //     if($scope.isSingleSearch) {
    //       singleToSupplier($scope.singleSearchItem,$scope.chooseCateGoryId)
    //     }else{
    //       batchToSupplier()
    //     }
    //   }else{
    //      layer.msg("请选择类目")
    //   }

    // }

    // // 多个搜品转供应商
    // function batchToSupplier() {
    //   let productList = []
    //   $scope.sourceDataList.map((item)=>{
    //     if(item.checked) {
    //       productList.push({
    //         categoryId:item.sourceCategory,
    //         sourceProductId:item.id
    //       })
    //     }
    //   })
    //   const data = {
    //     categoryId:$scope.chooseCateGoryId,
    //     sourceProduct:productList,
    //     sourceProductType:3
    //   }
    //   layer.load(2);
    //   erp.postFun('erpSupplierSourceAllocateRecording/sourceAllocate', JSON.stringify(data), function (res) {
    //     if(res.data.code == 200) {
    //       $scope.xzlmFlag =false
    //       layer.closeAll("loading");
    //       window.location.reload();
    //     }else{
    //       layer.msg(res.data.message)
    //     }
    //   })
    // }

    // // 单个搜品转供应商
    // function singleToSupplier(item,id) {
    //   layer.load(2);

    //   const data = {
    //     categoryId:id,
    //     sourceProduct:[{
    //       categoryId:item.sourceCategory,
    //       sourceProductId:item.id
    //     }],
    //     sourceProductType:3
    //   }

    //   erp.postFun('erpSupplierSourceAllocateRecording/sourceAllocate', JSON.stringify(data), function (res) {
    //     if(res.data.code == 200) {
    //       $scope.xzlmFlag =false
    //       layer.closeAll("loading");
    //       window.location.reload();
    //     }else{
    //       layer.msg(res.data.message)
    //     }
    //   })
    // }


    // 转供应商报价结束

    $scope.selectSoupinType = () => {
      firstRequire();
    }
    //描述
    $('.descripte-tankuang').hide();
    $scope.descripteFun = function(item) {
      $scope.word = $(this)[0].sourcelist.description;
      $scope.name = $(this)[0].sourcelist.name;
      $scope.number = $(this)[0].sourcelist.number;

      $('.descripte-tankuang').show();
    }
    $scope.closeDescripte = function() {
      $('.descripte-tankuang').hide();
    }

    //查看失败原因
    $scope.sbtcFlag = false;
    $scope.ckFun = function(item) {
      $scope.sbtcFlag = true;
      $scope.showText = item.failExplain;
    }
    $scope.gbckFun = function() {
      $scope.sbtcFlag = false;
      $scope.showText = '';
    }

    $scope.showProName = function(item) {
      if (item.STATUS == '2') {
        window.open('manage.html#/merchandise/show-detail/' + item.LOCPID + '/0/3/0', '_blank', '');
      } else {
        layer.open({
          title: '商品名称',
          content: item.NAME
        });
      }
    }

    //录入操作
    $scope.enter = function(item) {
      console.log(item)
      layer.load(2);
      erp.postFun("app/externalPurchase/isEntering", {
        sourceId: item.id
      }, function(res) {
        layer.closeAll("loading");
        if (res.data.code == 200) {
          sessionStorage.setItem('sourceId', item.id);
          // sessionStorage.setItem('sourcecustomerId', item.customerId);
          sessionStorage.setItem('addkey', 1);
          // var customerId = item.ACCID + ''
          //$location.path('/merchandise/addSKU2/cjsource=' + item.id + '/' + item.categorys['id'] + '/0');
          $location.path('/merchandise/addSKU1/source=' + item.id + "&sourcecustomer=" + 'touristSourceFlag' + '//0');
        } else {
          layer.msg(res.data.message)
        }
      }, function(err) {
        layer.msg('服务器错误')
      });

    }

    //失败操作
    $('.action-tankuang').hide();
    // $scope.defeated = function (item) {
    //     $('.fail-text').val("");
    //     var failReson = '';//存储失败原因
    //     $('.action-tankuang').show();
    //     $scope.noFun = function () {
    //         $('.action-tankuang').hide();
    //     }
    //     $scope.yesFun = function () {
    //         failReson = $('.fail-text').val();
    //         if (!failReson.trim()) {
    //             layer.msg('请填写失败原因！');
    //             return;
    //         }
    //         erp.postFun('pojo/touristSource/sourceFail', {
    //             'id': item.id, 'failExplain': failReson
    //         }, function (n) {
    //             console.log(n);
    //             $('.action-tankuang').hide();
    //             getData ();
    //         }, function (n) {
    //             // alert(2)
    //             layer.msg('网络错误');
    //         })
    //     }

    // }

    // 相似商品
    $scope.showSimilarGoods = function(item) {
      const {
        pids
      } = item;
      console.log('showSimilarGoods item', item)
      if (!pids) return;
      layer.load(2);
      const url = `app/picture/getsourceProducts?pids=${pids}`;
      erp.getFun(url, function({
        data
      }) {
        layer.closeAll('loading');
        console.log('showSimilarGoods ---> data ', data)

        if (data.statusCode === '200') {
          const {
            products
          } = retSaveResult(data.result) || {};
          console.log('showSimilarGoods ---> res ', products)
          products.forEach(item => item.existingWuliu = []); //一开始 选择物流为空 须以空数组 表示 
          $scope.existingPro = products;
          $scope.existingProFun(item) //调用 原先的功能 保留原先功能不变
        }
      }, function() {
        layer.closeAll('loading');
        layer.msg('网络错误')
      })
    }

    //现有商品操作
    $('.existing-tankuang').hide();
    $scope.existingProFun = function(item) {
      console.log(item)

      // 2019-11-21 取消以图搜图功能 (以下代码 git 显示 jerry 操作)
      // let imgUrl = item.images[0];
      // let formData = new FormData();
      // formData.append('imgUrl', imgUrl);
      // layer.load(2);
      // erp.upLoadImgPost('app/picture/searchSourceProduct', formData, function (res) {
      //     layer.closeAll("loading");
      //     // console.log(res);
      //     let data = res.data;
      //     if (data.statusCode == '200') {
      //         let searchProducts = JSON.parse(data.result).products;
      //         // console.log(searchProducts);
      //         if (searchProducts.length == 0) {
      //             $scope.existingPro = [];
      //             layer.msg(noData);
      //         } else {
      //             for (var i = 0; i < searchProducts.length; i++) {
      //                 searchProducts[i].existingWuliu = [];
      //             }
      //             $scope.existingPro = searchProducts;
      //             // console.log($scope.existingPro);
      //         }
      //     } else {
      //         layer.msg(data.message);
      //     }
      // })

      $scope.sourceID = item.id;
      $('.existing-tankuang').show();
      var selectedExistingPro = null;
      $scope.selectedExisting = function($event, item2) {
        // console.log($(this)[0].item.id)
        // return;
        // $scope.productID = $(this)[0].item.id;
        var existingSrc = $($event.target).attr('src');
        if (existingSrc == 'static/image/public-img/radiobutton1.png') {
          $('.esou-cheked').attr('src', 'static/image/public-img/radiobutton1.png');
          $($event.target).attr('src', 'static/image/public-img/radiobutton2.png');
          // selectedExistingNum++;
          // console.log(selectedExistingNum)
          selectedExistingPro = item2;
        } else {
          $($event.target).attr('src', 'static/image/public-img/radiobutton1.png');
          selectedExistingPro = null;
          // selectedExistingNum--;
          // console.log(selectedExistingNum)
        }
        console.log(selectedExistingPro);
      }
      $scope.existingSearch = function(existinginfo) {
        console.log(existinginfo);
        if (existinginfo == '') {
          layer.msg('请输入SKU或商品名称')
        } else if (existinginfo == undefined) {
          layer.msg('请输入SKU或商品名称')
        } else {

          // 'app/sourcing/sourceGetProduct?inputStr=' + existinginfo,

          erp.postFun('app/sourcing/sourceGetProduct', JSON.stringify({
            inputStr: existinginfo,
            accountId: item.customerId
          }), function(res) {
            console.log(res.data);
            console.log(JSON.parse(res.data.result))
            // console.log(res.data.result.products);
            if (res.data.statusCode == 200) {
              var searchproducts = JSON.parse(res.data.result).products;
              if (searchproducts.length == 0) {
                $scope.existingPro = [];
                layer.msg(noData);
              } else {
                for (var i = 0; i < searchproducts.length; i++) {
                  searchproducts[i].existingWuliu = [];
                }
                $scope.existingPro = searchproducts;
                console.log($scope.existingPro);
              }
            } else {
              layer.msg(noData);
            }
          }, function(res) {
            console.log(res)
            layer.msg('网络错误');
          })

        }
      }
      $scope.choseCurWuliu = function(curPro, curIndex) {
        //物流请求
        erp.postFun2('getWayBy.json', {
            "weight": curPro.packWeight,
            "lcharacter": curPro.propertyKey
          },
          function(res) {
            console.log(res)
            // $scope.existingWuliu = res.data;
            // $scope.mylogistics = '请选择';
            const {
              data
            } = res;
            if (data && data instanceof Array && data.length > 0) {
              $scope.existingPro[curIndex].existingWuliu = res.data;
              $scope.existingPro[curIndex].mylogistics = res.data[0].enName;
            } else {
              layer.msg('后台未返回数据')
            }
          },
          function(res) {
            console.log(res)
            layer.msg('网络错误')
          })
      }
      $scope.quxiaoFun = function() {
        $('.existing-tankuang').hide();
        $scope.existingPro = [];
        $scope.existinginfo = '';
      }
      $scope.quedingFun = function() {

        if (selectedExistingPro == null) {
          layer.msg('请选择一个商品')
          return;
        }
        if (!selectedExistingPro.mylogistics) {
          layer.msg('请给选择的商品指定物流方式')
          return;
        }

        erp.postFun('app/sourcing/assignSourceTourise', {
            "sourceId": $scope.sourceID,
            "productId": selectedExistingPro.id,
            "logistc": selectedExistingPro.mylogistics
          },
          function(res) {
            console.log(res)
            if (res.data.statusCode == 200) {
              window.location.reload();
              // firstRequire();
            }
          },
          function(res) {
            console.log(res)
          })
        $('.existing-tankuang').hide();
      }

    }

    //处理分页
    //跳页
    $scope.num = 1;
    $scope.pagechange = function(num) {
      if ($scope.num == "" || $scope.num == null || $scope.num == undefined) {
        layer.msg("错误页码");
        return;
      }
      if ($scope.num == 0) {
        $scope.num = 1;
      }
      $scope.pagenum = $scope.num;
      var totalPage = Math.ceil($scope.countNum / $scope.pagesize);
      if ($scope.pagenum > totalPage) {
        layer.msg("错误页码");
        return;
      }
      firstRequire();
    }
    $scope.pagesizechange = function(n) {
      console.log($scope.pagesize)
      $scope.pagenum = 1;
      firstRequire();
    }

    function erpsouFun(total, pagesize, current) {
      console.log(total, pagesize, current)
      $("#c-pages-fun").jqPaginator({
        totalCounts: total,
        pageSize: pagesize,
        visiblePages: 6,
        currentPage: current,
        activeClass: 'active',
        prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
        next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
        page: '<a href="javascript:void(0);">{{page}}<\/a>',
        first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
        last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
        onPageChange: function(n, type) {
          $scope.pagenum = n;
          $scope.num = n;
          var sourceList = {
            pageSize: $scope.pagesize,
            pageNum: $scope.pagenum,
            filter: {
              status: $scope.status
            }
          };
          console.log(JSON.stringify(sourceList))
          if (type == 'init') {
            return;
          }
          erp.postFun('pojo/touristSource/getErpList', JSON.stringify(sourceList), function(data) {
            $scope.sourceData = JSON.parse(data.data.result);
            console.log($scope.sourceData);
            $scope.sourceDataList = $scope.sourceData.list;
            $scope.sourceDataList.forEach(function(o, i) {
              console.log(o.images)
              o.images = o.images.substring(1, o.images.length - 1).replace(/"/g, "").split(',');
            })
            batchingOssImgHandle()
            $scope.countNum = $scope.sourceData.total; //总条数
          }, function() {
            // alert(2)
          })
        }
      });
    }

    function GetDateStr(AddDayCount) {
      var dd = new Date();
      console.log(dd)
      dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1; //获取当前月份的日期
      var d = dd.getDate();
      return y + "-" + m + "-" + d;
    }
    $scope.toFrontDetail = function(id) {
      var toUrl = window.open();
      erp.getFun('cj/locProduct/rollToken?id=' + id, function(data) {
        var data = data.data;
        if (data.statusCode != 200) {
          console.log(data);
          return;
        }
        var detailToken = data.result;
        console.log(detailToken);
        toUrl.location.href = erp.getAppUrl() + '/product-detail.html?id=' + id + '&token=' + detailToken;
      }, function(err) {
        console.log(err);
      });
    }

    function batchingOssImgHandle() {
      $scope.sourceDataList = $scope.sourceDataList.map(item => {
        item.calcImg = item.images.map((img) => ({
          calcImg: handleOssImg(img),
          hover: false,
          img
        }))
        return item;
      })
      console.log('sourceDataList -->> ', $scope.sourceDataList)
    }

    // 等待搜品&初审失败
    function itemRequest(item) {
      //   console.log(item);
      let data = {
        "status": (function() {
          if (item.status == "1") { //等待搜品状态
            return "7" // 初审失败传7
          } else if (item.status == "6") { //待现有状态
            return "1" // 等待搜品传1
          }
        })(),
        "id": item.id
      };

      erp.postFun('pojo/touristSource/sourceFail1', data, res => {
        console.log(res);
        let data = res.data;
        if (data.statusCode != 200) {
          return layer.msg(data.message);
        }
        layer.msg(data.message);
        firstRequire();
      })
    }
    // 等待搜品
    $scope.waitSoupin = (item) => {
      itemRequest(item);
    }
    // 初审失败
    $scope.chushenFall = (item) => {
      itemRequest(item);
    }

    // 批量提交等待搜品
    $scope.batchWaitSoupin = () => {
      let checkedList = $scope.sourceDataList.filter(item => item.checked);
      console.log(checkedList);
      if (checkedList.length === 0) return layer.msg("请勾选要提交的搜品");
      let idList = [];
      checkedList.map(item => {
        idList.push(item.id);
      })
      idList = JSON.stringify(idList);
      console.log(idList);
      let data = {
        "status": "1",
        "id": idList
      };
      erp.postFun('pojo/touristSource/sourceFail1', data, res => {
        console.log(res);
        let data = res.data;
        if (data.statusCode != 200) {
          return layer.msg(data.message);
        }
        layer.msg(data.message);
        firstRequire();
      })
    }

    // 全选
    $scope.checkAll = () => {
      checkAll($scope);
    }
    // 单选
    $scope.checkOne = (item) => {
      checkOne($scope, item);
    }
  }])

  //供应商搜品
  app.controller('supplierSourcing-controller', ['$scope', 'erp', '$location', '$routeParams', function($scope, erp, $location, $routeParams) {
    var aDate;
    var enDate;
    var orderDate = sessionStorage.getItem('ptsp-data-time');
    var orderDate2 = sessionStorage.getItem('ptsp-data-time2');
    if (orderDate == null || orderDate == '' || orderDate == undefined) {
      aDate = GetDateStr(-14);
    } else {
      aDate = orderDate;
    }
    if (orderDate2 == null || orderDate2 == '' || orderDate2 == undefined) {
      enDate = GetDateStr(0);
    } else {
      enDate = orderDate2;
      $("#cdatatime2").val(enDate);
    }
    $("#c-data-time").val(aDate); //关键语句
    $("#cdatatime2").val(enDate); //关键语句

    $scope.leftDate = $("#c-data-time").val();
    $scope.rightDate = $("#cdatatime2").val();

    var ordStatus = $routeParams.status || null;
    $scope.status = parseInt(ordStatus);

    function batchingOssImgHandle() {
      $scope.list = $scope.list.map(item => {
        item.calcImg = item.imageUrl.map(img => ({
          calcImg: handleOssImg(img),
          hover: false,
          img
        }))
        return item;
      })
    }
    $scope.pageNum = 1;
    $scope.pageSize = 10;

    function getList() {
      var params = {};
      params.currentNum = $scope.pageNum;
      params.pageSize = $scope.pageSize;
      params.startDate = $scope.leftDate;
      params.endDate = $scope.rightDate;
      params.name = $scope.searchinfo;
      params.status = $scope.status;
      layer.load(2);
      erp.postFun('erpSupplierSourceProduct/selectSourceProductPage', params, function(res) {
        $scope.list = res.data.data.list;
        $scope.$broadcast('page-data', {
          pageSize: $scope.pageSize.toString(),
          pageNum: $scope.pageNum,
          totalCounts: res.data.data.total,
          pageList: ['10', '20', '50']
        });
        $scope.list.forEach(function(o, i) {
          o.imageUrl = o.imageUrl.substring(0, o.imageUrl.length).replace(/"/g, "").split(',');
        })
        batchingOssImgHandle();
        console.log($scope.list, '供应搜品列表')
        layer.closeAll('loading');
      }, function() {
        layer.msg('请求失败');
        layer.closeAll('loading');
      });
      layer.closeAll('loading');
    }
    getList();

    // 分页触发
    $scope.$on('pagedata-fa', function(d, data) {
      $scope.pageNum = parseInt(data.pageNum);
      $scope.pageSize = parseInt(data.pageSize);
      getList();
    });


    //描述
    $('.descripte-tankuang').hide();
    $scope.descripteFun = function(item) {
      $scope.word = $(this)[0].sourcelist.description;
      $scope.name = $(this)[0].sourcelist.name;
      $scope.number = $(this)[0].sourcelist.number;

      $('.descripte-tankuang').show();
    }
    $scope.closeDescripte = function() {
      $('.descripte-tankuang').hide();
    }

    //日期搜索
    $scope.dateSearchFun = function() {
      $scope.pageNum = 1;
      $scope.pageSize = 10;
      $scope.leftDate = $("#c-data-time").val();
      $scope.rightDate = $("#cdatatime2").val();
      getList();
    }

    function GetDateStr(AddDayCount) {
      var dd = new Date();
      console.log(dd)
      dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1; //获取当前月份的日期
      var d = dd.getDate();
      return y + "-" + m + "-" + d;
    }
  }])
  app.filter('sourceType', function() {
    return function(value) {
      switch (value) {
        case 0:
          return "cj分配"
        case 1:
          return "客户录入"
        default:
          return "cj分配";
      }
    }
  })

  // 供应商搜品回收
  app.controller('sourceRecycle-controller', ['$scope', 'erp', '$location', '$routeParams', function($scope, erp, $location, $routeParams) {
    const api = { 
      listUrl:'pojo/sourceTimeout/list', // { pageNum: 1,pageSize: 10, model: { name:"", number:"", startDate:"", endDate:"" } } 
      supplierListUrl:'supplier/user/userInfo/listAccountPage', // { pageNum:1,pageSize:10 }
      failUrl: 'erpSupplierSourceProduct/updateToFail', // { id:"", type: 1 }  type 1-平台 2-客户 3-游客
      recycleUrl: 'pojo/sourceTimeout/recovery', // { id:"", type: 1 }  type 1-平台 2-客户 3-游客
      tranSupplierUrl:'erpSupplierSourceProduct/updateByIds', // { ids:[], type:1,supplierId:111111 }
    }

    $scope.param = {
      name: '',
			number: '',
			startDate: '',
			endDate: '',
			pageNum: '1',
			pageSize: '10',
			total: 0
    } 
    $scope.chooseSupplierFlag = false // 转供应商弹窗
    $scope.sourceFailedFlag = false // 搜品失败弹窗
    $scope.sourceRecycleFlag = false  // 回收搜品弹窗
    $scope.chooseItem = {}  // 操作选择元素
    $scope.supplierId = ""  // 转供应商的id
    $scope.supplierList = []  // 供应商列表
    // 点击操作
    $scope.handleOption = handleOption
    $scope.handleChooseSupplier = handleConformChooseSupplier
    $scope.handleRecycle = handleConfirmRecycle
    $scope.handleFail = handleConfirmFail

    init()

    /* 初始化 */ 
    function init() {
      getList();
      getSupplierList();
      initPageChange();
      initPage();
    }


    /* 初始化弹窗 */
    function initFlag() {
      $scope.chooseItem = {}
      $scope.supplierId = ""
      $scope.chooseSupplierFlag = false // 转供应商弹窗
      $scope.sourceFailedFlag = false // 搜品失败弹窗
      $scope.sourceRecycleFlag = false  // 回收搜品弹窗
    } 



    /* page & search */ 
    function getList() {
      const params = {};
      const url = api.listUrl
      params.pageNum = $scope.param.pageNum;
      params.pageSize = $scope.param.pageSize;
      params.model = {
        name:$scope.param.name,
        startDate:$scope.param.startDate,
        endDate:$scope.param.endDate,
        number:$scope.param.number
      }
      layer.load(2);
      erp.postFun('pojo/sourceTimeout/list', params, function(res) {
        console.log("TPL ==>listUrl: res",res);
        $scope.list = res.data.data.list;
        initPage()
        $scope.list.forEach(function(o, i) {
          console.log(dealDirtyImg(o.imageUrl),'222222');
          o.imageUrl = dealDirtyImg(o.imageUrl)
        })
        batchingOssImgHandle();
      }, function() {
        layer.msg('请求失败');
      });
      layer.closeAll('loading');
    }

    // 搜索函数
    $scope.handleSearch = function() {
      $scope.param.pageNum = 1;
      $scope.param.pageSize = 10;
      $scope.param.startDate = $("#c-data-time").val();
      $scope.param.endDate = $("#cdatatime2").val();
      $scope.param.name = $scope.queryName
      $scope.param.number = $scope.queryId
      getList();
    }    



    /* option */ 
    // 获取供应商列表 (暂时，等数量上去了，肯定不能用人工去选供应商的方法，1000多个一个个去找也不现实)
    function getSupplierList() {
      const url = api.supplierListUrl
      erp.postFun(url, JSON.stringify({
        pageNum: 1,
        pageSize: 1000
      }), res => {
        $scope.supplierList = res.data.data.list
      })
    }

    function handleOption(key,item) {
      $scope.chooseItem = item
      switch (key) {
        case "fail":
          $scope.sourceFailedFlag = true
          break;
        case "recycle":
          $scope.sourceRecycleFlag = true
          break;
        case "tranSupplier":
          $scope.chooseSupplierFlag = true
          break;
        default:
          break;
      }
    }


    /* 弹窗方法 */ 
    function handleConformChooseSupplier() {
      const url = api.tranSupplierUrl
      const params = {
        ids:[$scope.chooseItem.id],
        type:$scope.chooseItem.type,
        supplierId:$scope.supplierId
      }
      layer.load(2);
      erp.postFun(url, JSON.stringify(params), res => {
        console.log("TPC:recycleUrl => res",res);
        const { data:{ code } } = res
        if(code==200){
          layer.msg('操作成功');
          getList()
        }else{
          layer.msg('操作失败');
        }
        layer.closeAll('loading');
        initFlag()
      })
      
    }

    function handleConfirmRecycle() {
      const url = api.recycleUrl
      const params = {
        id:$scope.chooseItem.id,
        type:$scope.chooseItem.type
      }
      layer.load(2);
      erp.postFun(url, JSON.stringify(params), res => {
        console.log("TPC:recycleUrl => res",res);
        const { data:{code} } = res
        if(code==200){
          layer.msg('操作成功');
          getList()
        }else{
          layer.msg('操作失败');
        }
        layer.closeAll('loading');
        initFlag()
      })
    }

    function handleConfirmFail() {
      const url = api.failUrl
      const params = {
        id:$scope.chooseItem.id,
        type:$scope.chooseItem.type
      }
      layer.load(2);
      erp.postFun(url, JSON.stringify(params), res => {
        console.log("TPC:failUrl => res",res);
        const { data:{code} } = res
        if(code==200){
          layer.msg('操作成功');
          getList()
        }else{
          layer.msg('操作失败');
        }
        layer.closeAll('loading');
        initFlag()
      })
      
    }


    
    /* page */
    function initPage() {
      const { page: pageNum, pageSize, total: totalNum } = $scope.param;
      $scope.$broadcast('page-data', {
				pageSize,//每页条数
				pageNum,//页码
				totalNum,//总页数
				totalCounts: totalNum,//数据总条数
				pageList: ['10', '20', '30']//条数选择列表，例：['10','50','100']
			})
    }

    function initPageChange(){
      $scope.$on('pagedata-fa', function(d, data) {
      $scope.param.pageNum = parseInt(data.pageNum);
      $scope.param.pageSize = parseInt(data.pageSize);
        getList();
      });
    }



    /* 公共方法 */
    function batchingOssImgHandle() {
      $scope.list = $scope.list.map(item => {
        item.calcImg =[{
          calcImg: handleOssImg(item.imageUrl),
          hover: false,
          img:item.imageUrl
        }]
        return item;
      })
    } 

    function dealDirtyImg(imgurl) {
      if (imgurl) {
        if (imgurl.startsWith('cc')) {
          const arr = imgurl.split(',')
          return `http://${arr[0]}`
        }
        if (imgurl.startsWith('[')) {
          const imgStr = JSON.parse(imgurl)
          return imgStr[0]
        }
        return imgurl.split(',')[0]
      }
      return imgurl
    }

  }])


  //供应商搜品
  app.controller('distRecord-controller', ['$scope', 'erp', '$location', '$routeParams', function($scope, erp, $location, $routeParams) {
    var aDate;
    var enDate;
    var orderDate = sessionStorage.getItem('ptsp-data-time');
    var orderDate2 = sessionStorage.getItem('ptsp-data-time2');
    if (orderDate == null || orderDate == '' || orderDate == undefined) {
      aDate = GetDateStr(-14);
    } else {
      aDate = orderDate;
    }
    if (orderDate2 == null || orderDate2 == '' || orderDate2 == undefined) {
      enDate = GetDateStr(0);
    } else {
      enDate = orderDate2;
      $("#cdatatime2").val(enDate);
    }

    $("#c-data-time").val(aDate); //关键语句

    $scope.leftDate = $("#c-data-time").val();
    $scope.rightDate = $("#cdatatime2").val();
    console.log($scope.leftDate, $scope.rightDate);

    var ordStatus = $routeParams.status || null;
    $scope.status = parseInt(ordStatus);


    $scope.pageNum = 1;
    $scope.pageSize = 10;

    function getList() {
      var params = {};
      params.pageNum = $scope.pageNum;
      params.pageSize = $scope.pageSize;
      params.beginTime = $scope.rightDate;
      params.supplierCompanyName = $scope.supplierName;
      params.supplierSn = $scope.supplierId;
      params.standardWhether = $scope.status === "" ? null : parseInt($scope.status);
      layer.load(2);
      erp.postFun('erpSupplierSourceAllocateRecording/sourceAllocateList', params, function(res) {
        $scope.list = res.data.data;
        $scope.$broadcast('page-data', {
          pageSize: $scope.pageSize.toString(),
          pageNum: $scope.pageNum.toString(),
          totalCounts: res.data.data.length,
          pageList: ['10', '20', '50']
        });
        console.log($scope.list, '供应搜品列表')
        layer.closeAll('loading');
      }, function() {
        layer.msg('请求失败');
        layer.closeAll('loading');
      });
    }
    getList();

    // 分页触发
    $scope.$on('pagedata-fa', function(d, data) {
      $scope.pageNum = parseInt(data.pageNum);
      $scope.pageSize = parseInt(data.pageSize);
      getList();
    });

    $scope.distSource = function(id) {
      layer.confirm('确认后将会从等待搜品及搜品失败记录中补齐当前用户所需搜品数量，请谨慎操作。', {
        title: '分配搜品'
      }, function(index) {
        layer.load(2);
        erp.postFun('erpSupplierSourceAllocateRecording/sourceAllocateFetchUp', {
          "allocateRecordId": id,
        }, function(res) {
          console.log(res)
          if (res.data.code === 200) {
            layer.msg("分配成功")
            getList();
            layer.close(index);
          } else {
            layer.msg(res.data.error)
            return false;
          }
          layer.closeAll('loading');
        }, function() {
          layer.closeAll('loading');
        })
        // layer.close(index);
      });
    }


    //描述
    $('.descripte-tankuang').hide();
    $scope.descripteFun = function(item) {
      $scope.word = $(this)[0].sourcelist.description;
      $scope.name = $(this)[0].sourcelist.name;
      $scope.number = $(this)[0].sourcelist.number;

      $('.descripte-tankuang').show();
    }
    $scope.closeDescripte = function() {
      $('.descripte-tankuang').hide();
    }

    //日期搜索
    $scope.searchInput = function() {
      $scope.pageNum = 1;
      $scope.pageSize = 10;
      $scope.leftDate = $("#c-data-time").val();
      $scope.rightDate = $("#cdatatime2").val();
      getList();
    }

    function GetDateStr(AddDayCount) {
      var dd = new Date();
      console.log(dd)
      dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1; //获取当前月份的日期
      var d = dd.getDate();
      return y + "-" + m + "-" + d;
    }
  }])

  function retSaveResult(str) { //处理 返回data 为 json 情况 
    try {
      str = JSON.parse(str)
    } catch (err) {
      console.log('retSaveResult err', err)
    }
    return str;
  }

  function handleOssImg(url) { //处理 阿里云地址 尺寸 问题 
    if (!url) return '';
    return url.includes('aliyuncs.com') ? `${url}?x-oss-process=image/resize,w_40,h_40` : url;
  }

  // 全选
  function checkAll($scope) {
    $scope.checkAllFlag = !$scope.checkAllFlag;
    $scope.sourceDataList = $scope.sourceDataList.map(item => {
      item.checked = $scope.checkAllFlag;
      return item;
    })
  }

  // 单选
  function checkOne($scope, item) {
    console.log(item);
    item.checked = !item.checked;
    const len = $scope.sourceDataList.filter(item => item.checked).length;
    $scope.checkAllFlag = len === $scope.sourceDataList.length;
  }

})()