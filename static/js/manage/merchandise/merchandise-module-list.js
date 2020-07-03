(function(angular) {

  var app = angular.module('merchandise');

  app.controller('merchandiseCtrlModuleList', ['$scope', '$window', '$location', '$compile', '$routeParams', '$timeout', '$http', 'erp', 'merchan', '$sce', function($scope, $window, $location, $compile, $routeParams, $timeout, $http, erp, merchan, $sce) {

    $scope.proId = $routeParams.id
    $scope.proSku = $routeParams.sku

    // 模块列表获取
    $scope.pageNum = '1';
    $scope.pageSize = '30';
    $scope.totalNum = 0;
    $scope.erpordTnum = 0; // 分页总条数
    $scope.moduleList = [];

    // 模板数据列表
    function getModuleList() {
      let data = {
        pageNum: String($scope.pageNum),
        pageSize: String($scope.pageSize),
        productId: $scope.proId
      }
      $scope.moduleList = [];
      layer.load(2)
      erp.postFun('erp/loproductLanguage/getLocproductLanguage', JSON.stringify(data), function(res) {
        if (res.data.statusCode == '200') {
          let list = res.data.result

          list.forEach((item, index) => {
            switch (item.language) {
              case 'zh':
                list[index].lang = '中文'
                return
              case 'th':
                list[index].lang = '泰文'
                return
              default:
                list[index].lang = '英文'
                return
            }
          })

          $scope.moduleList = list
          $scope.totalNum = 100
          let totalNum = Math.ceil(Number($scope.totalNum) / Number($scope.pageSize))
          $scope.$broadcast('page-data', {
            pageSize: $scope.pageSize, // 每页条数
            pageNum: $scope.pageNum, // 页码
            totalNum: totalNum, // 总页数
            totalCounts: $scope.totalNum, // 数据总条数
            pageList: ['30', '50', '100'] // 条数选择列表，例：['10','50','100']
          })
        }
        layer.closeAll('loading')
      })
    }
    getModuleList();

    $scope.$on('pagedata-fa', function(d, data) { // page onChange
      $scope.pageNum = data.pageNum
      $scope.pageSize = data.pageSize
      getModuleList()
    });

    // wangEditor
    $scope.editor = new window.wangEditor('#wang-editor');
    $scope.editor.customConfig.uploadImgServer = 'https://erp.cjdropshipping.com/app/ajax/upload';
    $scope.editor.customConfig.uploadFileName = 'file'
    $scope.editor.customConfig.uploadImgHooks = {
      customInsert: function(insertImg, result, editor) {
        console.log(result)
        // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
        // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

        // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
        var imgList = JSON.parse(result.result);
        for (var i = 0; i < imgList.length; i++) {
          imgList[i] = 'https://' + imgList[i];
        }
        if (imgList.length > 0) {
          insertImg(imgList);
        }

        // result 必须是一个 JSON 格式字符串！！！否则报错
      }
    }
    $scope.editor.create();

    // editorDefault
    $scope.editorDefault = new window.wangEditor('#wang-editor-default');
    $scope.editorDefault.customConfig.uploadImgServer = 'https://erp.cjdropshipping.com/app/ajax/upload';
    $scope.editorDefault.customConfig.uploadFileName = 'file'
    $scope.editorDefault.customConfig.uploadImgHooks = {
      customInsert: function(insertImg, result, editor) {
        console.log(result)
        // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
        // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

        // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
        var imgList = JSON.parse(result.result);
        for (var i = 0; i < imgList.length; i++) {
          imgList[i] = 'https://' + imgList[i];
        }
        if (imgList.length > 0) {
          insertImg(imgList);
        }

        // result 必须是一个 JSON 格式字符串！！！否则报错
      }
    }
    $scope.editorDefault.create();

    $scope.defaultProductNameEn = ''
    $scope.defaultProductDescription = ''
    // 禁用编辑功能
    $scope.editorDefault.$textElem.attr('contenteditable', false)
    var getProductInfo = function() { // getProductInfo
      let params = {
        id: $scope.proId
      }

      erp.postFun('erp/loproductLanguage/getLocproductInfo', JSON.stringify(params), function(res) {
        if (res.data.statusCode == '200') {
          $scope.defaultProductNameEn = res.data.result.nameEn
          $scope.defaultProductDescription = res.data.result.description
          $scope.editorDefault.txt.html($scope.defaultProductDescription)
          return
        }

        layer.msg('网络错误')
      })
    }
    getProductInfo()

    // 模板弹窗
    $scope.defaultLang = 'en'
    $scope.showDialog = false
    $scope.isEdit = false
    $scope.currentItem = undefined

    $scope.openDialog = function(item) { // 打开修改和编辑模板弹窗

      $scope.editorDefault.txt.html($scope.defaultProductDescription) // 每次弹窗都修改为原商品详情

      $scope.isEdit = false
      $scope.currentItem = undefined
      $scope.editor.txt.html('')
      $scope.defaultLang = 'en'

      if (item) { // 有item为修改，无则添加
        console.log(item)
        $scope.isEdit = true // 改为编辑
        $scope.currentItem = item
        $scope.editor.txt.html(item.description || '')
        $scope.defaultLang = item.language || 'en'
      }

      $scope.showDialog = true
    }

    $scope.moduleSubmit = function() { // 确认提交添加或修改
      if (!$scope.currentItem || !$scope.currentItem.title) return layer.msg('商品名称不能为空')
      if (!$scope.editor.txt.html() || $scope.editor.txt.html() == '' || $scope.editor.txt.html() == '<p><br></p>') return layer.msg('商品描述不能为空')

      if ($scope.isEdit) {
        updateModule()
        return false
      }

      addModule()
    }

    var addModule = function() { // 添加模板
      let params = {
        productId: $scope.proId,
        title: $scope.currentItem.title,
        description: $scope.editor.txt.html(),
        language: $scope.defaultLang
      }

      layer.load(2)
      erp.postFun('erp/loproductLanguage/addLocproductLanguage', JSON.stringify(params), function(res) {
        layer.closeAll('loading')
        if (res.data.statusCode == '200') {
          $scope.showDialog = false
          layer.msg('添加成功')
          getModuleList()
          return
        }

        layer.msg('网络错误')
      })
    }

    var updateModule = function() { // 编辑模板
      let params = {
        productId: $scope.proId,
        template: $scope.currentItem.template,
        id: $scope.currentItem.id,
        title: $scope.currentItem.title,
        description: $scope.editor.txt.html(),
        language: $scope.defaultLang
      };

      layer.load(2)
      erp.postFun('erp/loproductLanguage/updateLocproductLanguage', JSON.stringify(params), function(res) {
        layer.closeAll('loading')
        if (res.data.statusCode == '200') {
          $scope.showDialog = false
          layer.msg('编辑成功')
          getModuleList()
          return
        }

        layer.msg('网络错误')
      })
    }

    $scope.delModule = function(item) { // 删除模板

      layer.confirm('确认要删除吗？', {
        btn: ['确定', '取消'] //按钮
      }, function(index) {
        layer.close(index);
        let params = {
          id: item.id
        }

        layer.load(2)
        erp.postFun('erp/loproductLanguage/delLocproductLanguage', JSON.stringify(params), function(res) {
          layer.closeAll('loading')
          if (res.data.statusCode == '200') {
            layer.msg('删除成功')
            getModuleList()
            return
          }

          layer.msg('网络错误')
        })
      })
    }

  }]);

})(angular)