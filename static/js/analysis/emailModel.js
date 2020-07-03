(function() {
  app.controller('emailModelCtrl', ['$scope', 'erp', '$http','utils', function($scope, erp, $http, utils) {
    $scope.pageNum = 1; // 分页 
    $scope.pageSize = 5; // 分页 每页展示几条
    $scope.currentPage = 1; // 当前页
    $scope.pagenumarr = ['5', '20', '30', '50', '100']; // 设置每页展示几条
    $scope.showFLag = false; // 弹窗展示
    $scope.menuList = null; // 所有属性
    $scope.attribute_id = null; // 属性id-筛选项
    $scope.v1 = null; // 模版主题-筛选项
    $scope.send_no = null; // 发送次数-筛选项 
    $scope.currenRow = null; // 当前行数据
    $scope.currenKey = null; // 当前key
    $scope.formVerify = {
      send_no: true,
      condition_no: true,
      v1: true,
    }; // 表单必填验证
    $scope.delshowFLag = false; // 删除弹窗展示
    $scope.batchshowFLag = false; // 批量编辑弹窗展示
    $scope.batchData = null; // 批量编辑数据

    getMenuInfo()// 获取 菜单列表
    getTemplateList() // 初始化列表

    /* 富文本 start*/
    var E = window.wangEditor;
    var editor = new E('#wang'); // 新增/编辑富文本
    var editorBatch = new E('#wangBatch'); // 批量编辑富文本
    let customConfig = {};
    customConfig.menus = [
      'head',  // 标题
      'bold',  // 粗体
      'fontSize',  // 字号
      'fontName',  // 字体
      'italic',  // 斜体
      'underline',  // 下划线
      'strikeThrough',  // 删除线
      'foreColor',  // 文字颜色
      'backColor',  // 背景颜色
      'link',  // 插入链接
      'list',  // 列表
      'justify',  // 对齐方式
      'quote',  // 引用
      'image',  // 插入图片
      'table',  // 表格
      'video',  // 插入视频
      'code',  // 插入代码
      'undo',  // 撤销
      'redo'  // 重复
    ];
    customConfig.uploadImgServer = 'https://erp.cjdropshipping.com/app/ajax/upload';
		customConfig.uploadFileName = 'file';
		// 将 timeout 时间改为 30s
		customConfig.uploadImgTimeout = 30000;
		customConfig.uploadImgHooks = {
			customInsert: function (insertImg, result, editor) {
				console.log("wang",result)
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
    editor.customConfig = customConfig;
    editor.create();
    editorBatch.customConfig = customConfig;
    editorBatch.create();
    /* 富文本 end*/


    // 获取所有属性
    function getMenuInfo() {
      layer.load(2);
      let url = 'erp/userAttribute/getAttributeList';
      erp.mypost(url, {}).then((res) => {
        $scope.menuList = res;
        console.log("menuList",$scope.menuList)
      }).catch(err => {
        console.log('getInfo err---> ', err)
      })
    }
    
    // 模版列表
    function getTemplateList() {
      layer.load(2);
      let url = 'erp/userAttributeEmailTemplate/queryPage';
      let rqData = {
        pageNum:$scope.pageNum,
        pageSize:$scope.pageSize,
      };
      $scope.attribute_id && (rqData.attribute_id = $scope.attribute_id);
      $scope.v1 && (rqData.v1 = $scope.v1);
      $scope.send_no && (rqData.send_no = $scope.send_no);

      erp.mypost(url,rqData).then((res) => {
        const { rows, total } = res;
        rows.forEach(item=>{
          if(item.condition_type == "0"){
            item.conditionType = "没有条件"
          }else if(item.condition_type == "1"){
            item.conditionType = "包含"
          }else{
            item.conditionType = "不包含"
          }
        })
        $scope.templateList = rows;
        $scope.$broadcast('page-data', {
          pageSize: $scope.pageSize.toString(),
          pageNum: $scope.pageNum,
          // totalNum: result.page,
          totalCounts: total,
          pageList: $scope.pagenumarr
        });
      }).catch(err => {
        console.log('getInfo err---> ', err)
      })
    }

    // 分页触发
    $scope.$on('pagedata-fa', function(d, data) {
      $scope.pageNum = parseInt(data.pageNum);
      $scope.pageSize = parseInt(data.pageSize);
      getTemplateList();
    });

    // 搜索
    $scope.searchFun = function(){
      $scope.pageNum = 1;
      getTemplateList();
    }

    // 全选
    $scope.checkAll = function(){
      if($scope.check_All){
        $scope.templateList.forEach(item=>{
          item.check = true
        })
      }else{
        $scope.templateList.forEach(item=>{
          item.check = false
        })
      }
    }

    // 单选
    $scope.checkOne = function (item, index) {
      if (item.check) {
        var num = 0;
        for (var i = 0; i < $scope.templateList.length; i++) {
          if ($scope.templateList[i].check) {
            num++;
          }
        }
        if (num == $scope.templateList.length) {
          $scope.check_All = true;
        }
      } else {
        $scope.check_All = false;
      }
    }

    // 表单验证数据初始化
    $scope.formVerifyInit = function(){
      $scope.formVerify = {
        send_no: true,
        condition_no: true,
        v1: true,
      }
    }

    // 表单验证
    $scope.formVerifyFun = function(){
      let verifyValue = true;
      for (var key in $scope.formVerify) {
        if($scope.currenRow){
          $scope.formVerify[key] = $scope.currenRow[key] === null || $scope.currenRow[key] === undefined || $scope.currenRow[key] === '' ? false : true;
        }else{
          $scope.formVerify[key] = false;
        }
        // console.log(key,'-',$scope.formVerify[key]); 
        if($scope.formVerify[key] === false){
          verifyValue = false;
        }
      }
      
      return verifyValue;
    }

    // 新增/编辑模版
    $scope.editFun = function(key, item){
      $scope.formVerifyInit();
      $scope.currenRow = item === null || item === undefined || item === '' ? null : JSON.parse(JSON.stringify(item));
      $scope.currenKey = key === null || key === undefined || key === '' ? null : key;
      $scope.currenRow && ($scope.currenRow.attribute_id = $scope.currenRow.attribute_id.toString());
      $scope.menuList.forEach((item, index)=>{
        item.curSelected = false;
        if($scope.currenRow){
          if($scope.currenRow.condition_ids){
            let condition_ids_arr_i = $scope.currenRow.condition_ids.split(',');
            if(condition_ids_arr_i.includes(item.id.toString())){
              item.curSelected = true;
            }
          }
        }
      });
      let email_context = $scope.currenRow ? item.email_context : '';
      editor.txt.html(email_context); // 初始化富文本内容
      $scope.showFLag = !$scope.showFLag;
      console.log($scope.currenRow,$scope.menuList)
    }

    // 新增/编辑模版- 保存
    $scope.editFunOk = function(){
      console.log('currenRow',$scope.currenRow,$scope.menuList)
      let verifyResult =  $scope.formVerifyFun();
      console.log("verifyResult",verifyResult)
      if(!verifyResult){
        return;
      }
      let condition_id_arr = [];
      $scope.menuList.forEach((item, index)=>{
        if(item.curSelected === true){
          condition_id_arr.push(item.id);
        }
      });
      if($scope.currenRow.attribute_id === undefined){
        layer.msg("请选择名称");
        return;
      }
      if($scope.currenRow.condition_type === undefined){
        layer.msg("请选择条件");
        return;
      }
      if($scope.currenRow.condition_type != '0' && condition_id_arr.length == 0){
        layer.msg("请选择条件值");
        return;
      }
      let email_context = editor.txt.html();
      console.log('email_context',email_context)
      if(email_context === null || email_context === undefined || email_context === ''){
        layer.msg("请输入邮件文本内容");
        return;
      }

      let rqUrl = $scope.currenRow.id === undefined ? 'erp/userAttributeEmailTemplate/insert' : 'erp/userAttributeEmailTemplate/updateById';
      let rqData = $scope.currenRow;
      rqData.attribute_id = parseInt(rqData.attribute_id);
      rqData.condition_type = parseInt(rqData.condition_type);
      rqData.condition_ids = condition_id_arr.join(',');
      rqData.email_context = email_context;
      rqData.email_type = 'text';
      erp.postFun(rqUrl, rqData, function (data) {
        if(data.data.statusCode == 200){
          layer.msg('操作成功');
          $scope.showFLag = !$scope.showFLag;
          
          // 新增刷新列表
          if($scope.currenRow.id === undefined){
            getTemplateList();
          }else{
            if($scope.currenRow.condition_type == "0"){
              $scope.currenRow.conditionType = "没有条件"
            }else if($scope.currenRow.condition_type == "1"){
              $scope.currenRow.conditionType = "包含"
            }else{
              $scope.currenRow.conditionType = "不包含"
            }
            if($scope.currenKey !== null || $scope.currenKey !== undefined || $scope.currenKey !== ''){
              $scope.templateList[$scope.currenKey] = JSON.parse(JSON.stringify($scope.currenRow));
            }
          }
        }else{
          layer.msg('操作错误，请稍后再试');
        }
      }, function (err) { 
        layer.msg('操作错误，请稍后再试');
      }, { layer: true })
    }

    // 批量编辑
    $scope.batchEditFun = function(){
      let isIds = false;
      $scope.templateList.forEach((item, index)=>{
        if(item.check === true){
          isIds = true;
          return;
        }
      });
      if(!isIds){
        layer.msg('请选择要编辑的行');
        return;
      }
      
      $scope.batchData = null;
      editorBatch.txt.clear()
      $scope.batchshowFLag = !$scope.batchshowFLag;
    }

    // 批量编辑保存
    $scope.batchEditFunOk = function(){
      console.log('batcn',$scope.batchData)
      if($scope.batchData === null || $scope.batchData.v1 === undefined){
        layer.msg("请输入模版主题");
        return;
      }

      let condition_id_arr = [];
      $scope.templateList.forEach((item, index)=>{
        if(item.check === true){
          condition_id_arr.push(item.id);
        }
      });
      if(condition_id_arr.length == 0){
        layer.msg('请选择要编辑的行');
      }
      let rq_ids = condition_id_arr.join(',');

      let email_context = editorBatch.txt.html();
      let rqData = {
        ids: rq_ids,
        email_type: 'text',
        v1: $scope.batchData.v1,
        email_context
      }

      erp.postFun('erp/userAttributeEmailTemplate/updateByIds', rqData, function (data) {
        if(data.data.statusCode == 200){
          layer.msg('操作成功');
          $scope.batchshowFLag = !$scope.batchshowFLag;
          
          // 刷新列表
          getTemplateList();
        }else{
          layer.msg('操作错误，请稍后再试');
          $scope.batchshowFLag = !$scope.batchshowFLag;
        }
      }, function (err) { 
        layer.msg('操作错误，请稍后再试');
        $scope.batchshowFLag = !$scope.batchshowFLag;
      }, { layer: true })
    }

    // 删除
    $scope.delFun = function(item){
      $scope.currenRow = item;
      $scope.delshowFLag = !$scope.delshowFLag;
    }

    // 删除确认
    $scope.delFunOk = function(){
      let rqData = {
        id: $scope.currenRow.id,
      };
      erp.postFun('erp/userAttributeEmailTemplate/deleteById', rqData, function (data) {
        if(data.data.statusCode == 200){
          getTemplateList();
        }else{
          layer.msg('操作错误，请稍后再试');
        }
        $scope.delshowFLag = !$scope.delshowFLag;
      }, function (err) { 
        layer.msg('操作错误，请稍后再试');
        $scope.delshowFLag = !$scope.delshowFLag;
      }, { layer: true })
    }
    
    // 只允许数字输入
    $scope.sendnoFormat = function(item){
      item.send_no = utils.floatLength(item.send_no, 0);
    }
    $scope.conditionnoFormat = function(item){
      item.condition_no = utils.floatLength(item.condition_no, 0);
    }
    
  }]);
})()