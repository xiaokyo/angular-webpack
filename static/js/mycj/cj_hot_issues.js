(function () {
  var app = angular.module('erp-cjhot', []);
  app.controller('CJhotCtrl', ['$scope', 'erp', '$location', function ($scope, erp, $location) {
    var bs = new Base64();
    var logiName = localStorage.getItem('erploginName') ? bs.decode(localStorage.getItem('erploginName')) : '';
    const sortTypeObj = {
      "pageView": {
        val: '1'   //浏览量排序
      },
      "resolved": {
        val: '2'   // 已解决
      },
      "unsolved": {
        val: '3'  //未解决
      }
    }

    //客户页面
    $scope.search = '';
    $scope.pageSize = '20';
    $scope.pageNum = '1';
    $scope.pageNumarr = [10, 20, 30, 50];
    $scope.totalNum = 0;
    $scope.dataList = [];
    $scope.editFlag = false;
    $scope.removeFlag = false;
    $scope.isAct = '1';
    $scope.status = '';
    $scope.sortType = ''
    $scope.sort = ''


    function getList() {
      var data = {
        "status": $scope.status,
        "type": $scope.isAct,
        "search": $scope.search,
        page: $scope.pageNum,
        limit: $scope.pageSize,
        order: $scope.sort ? $scope.sort : ''
      }
      erp.postFun('app/message/getQuestionListByPage', data, function (res) {
        if (res.data.statusCode == 'CODE_200') {
          $scope.dataList = res.data.result.list;
          $scope.totalNum = res.data.result.count || 0;
          $scope.totalpage = function () {
            return Math.ceil($scope.totalNum / $scope.pageSize)
          }
          pageFun();
        }
      }, function (err) {

      }, {layer: true})
    }
    getList();
    /** 排序 */
    $scope.sortFun = function (sortType) {
      $scope.sortType = sortType
      switch (sortType) {
        case sortTypeObj.pageView.val:
          $scope.sort = 'browse_count  desc'
          break
        case sortTypeObj.resolved.val:
          $scope.sort = 'resolved_count  desc'
          break
        case sortTypeObj.unsolved.val:
          $scope.sort = 'unsolved_count  desc'
          break
        default:
          break
      }
      // console.log($scope.sort)
      getList()
    }
    //
    $scope.tabClick = function (n) {
      $scope.isAct = n;
      $scope.pageNum = '1';
      getList();
    }
    //
    $scope.searchChange = function () {
      console.log($scope.status)
      $scope.pageNum = '1';
      getList();
    }
    //上线or下线
    $scope.upOrdow = function (item, txt) {
      $scope.upOrdowTxt = txt;
      $scope.upOrdowFlag = true;
      $scope.upOrdowY = function () {
        var data = {
          "id":item.id,
          "status": $scope.upOrdowTxt == '上线' ? '1' : '2',
        }
        erp.postFun('app/message/updDspQuestion', data, function (res) {
          if (res.data.statusCode == 'CODE_200') {
            layer.msg('操作成功');
            $scope.upOrdowFlag = false;
            getList();
          }
        }, function (err) {

        }, {layer: true})
      }

    }
    //
    $scope.addData = function () {
      $scope.addOreditFlag = true;
      $scope.addOreditTxt = '新增问题';
      $scope.questionTXt = '';
      $scope.url = '';
      $scope.actClass = '1';
      editor.txt.html('<p>请输入问题答案...</p>')
    };
    //
    $scope.editItem = function (item) {
      console.log(item)
      $scope.addOreditFlag = true;
      $scope.addOreditTxt = '编辑问题';
      $scope.questionTXt = item.question;
      $scope.url = item.url;
      editor.txt.html(item.answer);
      $scope.actClass = item.answer_type;
      $scope.item = item;
    };
    $scope.addOreditFlagY = function () {
      var data;
      var url;
      if (!$scope.questionTXt) {
        layer.msg('请输入问题')
        return;
      }
      if (!editor.txt.text()) {
        layer.msg('请输入答案')
        return;
      }
      data = {
        "type": $scope.isAct,
        "question": $scope.questionTXt,
        "answer": editor.txt.html(),
        "answerType": $scope.actClass,
        // "url": $scope.url,
      }
      if ($scope.addOreditTxt == '新增问题') {
        url = 'app/message/addDspQuestion';
        data.create_user_id = logiName;
      } else if ($scope.addOreditTxt == '编辑问题') {
        url = 'app/message/updDspQuestion';
        data.id = $scope.item.id
      }
      erp.postFun(url, data, function (res) {
        if (res.data.statusCode == 'CODE_200') {
          layer.msg('操作成功');
          $scope.addOreditFlag = false;
          getList();
        }
      }, function (err) {

      }, {layer: true})
    }

    //
    $scope.removeItem = function (item) {
      $scope.removeFlag = true;
      $scope.removeY = function () {
        var data = {
          id: item.id,
        }
        erp.postFun('app/message/delDspQuestion', data, function (res) {
          if (res.data.statusCode == 'CODE_200') {
            layer.msg('删除成功');
            $scope.removeFlag = false;
            getList();
          }
        }, function (err) {

        }, {layer: true})
      }
    };

    //分页
    function pageFun() {
      $(".pagegroup").jqPaginator({
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
          $scope.pageNum = n + '';
          getList();
        }
      });
    }

    $scope.pagechange = function (pagesize) {
      $scope.pageNum = '1';
      getList();
    }
    $scope.pageNumchange = function () {
      console.log($scope.pageNum % 1)
      $scope.pageNum = $(".goyema").val() - 0;
      if ($scope.pageNum < 1 || $scope.pageNum > $scope.totalpage()) {
        layer.msg('错误页码');
        $(".goyema").val(1)
      } else {
        getList();
      }
    }
    //搜索客户
    $scope.searchList = function () {
      $scope.pageNum = '1';
      getList();
    }
    //按下enter搜索
    $scope.enterSearch = function (event) {
      if (event.keyCode === 13 || event.keyCode === 108) {
        $scope.pageNum = '1';
        getList();
      }
    }

    var E = window.wangEditor;
    var editor = new E('#wang');
    editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'image', // 插入图片
      'table', // 表格
      'video', // 插入视频
      'code', // 插入代码
      'undo', // 撤销
      'redo' // 重复
    ];
    editor.customConfig.uploadImgServer = 'https://erp.cjdropshipping.com/app/ajax/upload';
    editor.customConfig.uploadFileName = 'file';
    // 将 timeout 时间改为 30s
    editor.customConfig.uploadImgTimeout = 30000;
    editor.customConfig.uploadImgHooks = {
      customInsert: function(insertImg, result, editor) {
        var imgList = JSON.parse(result.result);
        for (var i = 0; i < imgList.length; i++) {
          imgList[i] = 'https://' + imgList[i];
        }
        if (imgList.length > 0) {
          insertImg(imgList);
        }
      }
    };
    editor.customConfig.uploadImgShowBase64 = true; // 使用 base64 保存图片
    editor.create();
  }]).filter('to_trusted', ['$sce', function($sce) {
    return function(text) {
      return $sce.trustAsHtml(text);
    };
  }]);
})()
