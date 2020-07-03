(function () {
  var app = angular.module('erp-analysis', ['service']);

  app.controller('personalCtrl', ['$scope', 'erp', '$http', function ($scope, erp, $http) {
    //侧边维度 --->> console.log(' ---> ', )
    $scope.menuList = [];//侧边 维度列表
    $scope.menuIndex = -1;//侧边 维度 当前操作项
    $scope.pageNum = "1"
    $scope.pageSize = "10",
    $scope.isBlackList = false
    getMenuInfo()//获取 菜单列表
    function getMenuInfo() {//获取 菜单列表
      layer.load(2);
      let url = 'erp/userAttribute/getAttributeList';
      erp.mypost(url, {}).then((res) => {
        // const { data, code } = res;
        console.log('getInfo res---> ', res)
        $scope.menuList = formatMenuData(res);
      }).catch(err => {
        console.log('getInfo err---> ', err)
      })
    }
    /**
     * checked 代办选择的维度 value 筛选时所需传递的值 (选择 输入 范围 --> 待定)
     * type bool 下拉 /eq 输入 /range区间
     */
    function formatMenuData(arr) {//获取的维度数据  添加状态 映射对应的功能
      const result = arr.map(item => {
        let { options, type } = { ...handleJsonParse(item.items) } || {};
        let value = '', text = '';
        if (type === 'bool') {
          value = options[0] ? options[0].value : '';
          text = options[0] ? options[0].text : '';
        }
        return { ...item, checked: false, text, value, options, type }
      });
      console.log('formatMenuData', result)
      return result;
    }
    function handleJsonParse(str) {
      try {
        str = JSON.parse(str)
      } catch (err) {
        console.log('handleJsonParse --> err', err)
      }
      return str;
    }
    $scope.handleMenuSelect = function (i) {//选择、点击 菜单项
      // console.log('handleMenuSelect ev ---> ', i)
      $scope.menuIndex = i;
      showBox()
    }

    // 侧边维度 << --- 



    // 筛选区域 --->> 
    $scope.checkedList = [];//所选条件列表 依赖 $scope.menuList 和 item.checked  
    $scope.handleDelMenu = handleDelMenu;//取消当前筛选条件
    const handleThrottleSearch = throttle(handleSearch)
    const handleThrottleExportExcel = throttle(handleExportExcel)
    $scope.handleSearch = handleThrottleSearch;// 搜索 列表
    $scope.handleExportExcel = handleThrottleExportExcel;
    function handleDelMenu(id) {//取消当前筛选条件
      $scope.menuList = $scope.menuList.map((item) => item.id === id ? { ...item, checked: false } : item)
      initCheckedList()//刷新 筛选条件 依赖 $scope.menuList 和 item.checked 
    }
    function initCheckedList() {//刷新 同步 筛选条件 依赖 $scope.menuList 和 item.checked 
      $scope.checkedList = $scope.menuList.filter(({ checked }) => checked)
    }
    function retParams() {
      const attributes = $scope.checkedList.map(({ id, type, value }) => ({ id, type, value }))
      const { pageNum, pageSize } = $scope;
      return {
        pageNum,
        pageSize: +pageSize,
        attributes
      }
    }
    handleSearch()
    function handleSearch() {// 搜索 用户 列表
      getUserInfo(retParams())
      $scope.isBlackList = false
    }

    function handleExportExcel() {
      layer.load(2);
      let url = 'erp/userAttribute/getUserPageExport';
      erp.mypost(url, retParams()).then(href => {
        console.log('getHttpExcel href---> ', href)
        downloadExcel(href)
      }).catch(err => {
        console.log('getHttpExcel err---> ', err)
      })
    }
    function downloadExcel(href) {
      if (!href) return;
      let a = document.createElement('a');
      a.href = href;
      a.click()
      a = null;
    }
    // 侧边维度 << --- 

    // tabel 用户列表区域 --->>
    function getUserInfo(params) {
      layer.load(2);
      let url = 'erp/userAttribute/getUserPage';
      erp.mypost(url, params).then((res) => {
        console.log('userInfo res---> ', res)
        const { rows, total } = res;
        // console.log('userInfo rows---> ', rows)
        if (total > 0) {//初始化 页码 操作
          $scope.pageTotal = total;
          handlePagination()
        }
        $scope.userList = rows;
      }, err => {
        console.log('userInfo err---> ', err)
      })
    }
    $scope.param = {
      pageNum: '',
      pageSize: 30,
      attributes: []// {id, type, value: '下拉选择 或 输入的值', value2: '范围值 待定'}
    }
    $scope.userList = [];

    // tabel 用户列表区域 << ---  

    //处理分页 --->> 

    $scope.pageNum = 1;
    $scope.pageSize = '10';
    $scope.pageTotal = 0;
    $scope.goPageNum = 1;

    function handlePagination() {//加载分页器
      const { pageNum, pageSize, pageTotal } = $scope;
      if (!pageTotal) return;
      console.log(pageTotal, pageSize, pageNum)
      $("#page").jqPaginator({
        currentPage: pageNum,
        pageSize: +pageSize,
        totalCounts: pageTotal,
        visiblePages: 5,
        activeClass: 'active',
        prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
        next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
        page: '<a href="javascript:void(0);">{{page}}<\/a>',
        first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
        last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
        onPageChange: function (n, type) {// n --> 页 type --> 切换方式  init change
          if (type === 'change') {
            $scope.pageNum = n;
            handleThrottleSearch()
            $scope.check_All = false
          }
        }
      });
    }
    $scope.changePageSize = function () {
      handleThrottleSearch()
    }
    $scope.pageNav = function () {
      let pageNum = $scope.goPageNum;
      console.log('pageNav ---> ', pageNum)
      $scope.pageNum = +pageNum;
      handleThrottleSearch()
    }
    //处理分页 <<--- 

    /**
     * 弹框处理区域
     */
    $scope.boxInfo = {
      hasShow: false,
      title: '',
      desc: '',
      list: [],
      value: '',
      text: ''//记录选择框的 文本
    }
    $scope.hideBox = hideBox;//隐藏弹窗
    $scope.showBox = showBox;//显示 弹窗 + 设置弹窗
    $scope.handleBoxSelect = handleBoxSelect;//弹窗 下拉选择
    $scope.handleBoxConfirm = handleBoxConfirm;//弹窗确认 筛选条件
    function handleBoxSelect() {//弹窗 下拉选择
      const { value, list } = $scope.boxInfo;
      const item = list.find((item) => item.value === value) || null;
      const text = item ? item.text : '';
      $scope.boxInfo.text = text;
    }
    function hideBox() {//隐藏弹窗
      $scope.boxInfo.hasShow = false;
    }
    function showBox() {//显示 弹窗 + 设置弹窗
      setBoxInfo()
      $scope.boxInfo.hasShow = true;
    }
    function setBoxInfo() {//设置弹窗信息
      const { menuIndex, menuList } = $scope;
      const { options = [], desc_cn, name_cn, value, text } = menuList[menuIndex] || {};
      $scope.boxInfo = {
        list: options,
        title: name_cn,
        desc: desc_cn,
        value,
        text
      }
    }
    function handleBoxConfirm() {//弹窗确认 筛选条件
      const { menuIndex, menuList } = $scope;
      const { value, text } = $scope.boxInfo;
      $scope.menuList = menuList.map((item, i) => {
        return menuIndex === i ? { ...item, text, value, checked: true } : item;
      })
      initCheckedList();//刷新 筛选条件 依赖 $scope.menuList 和 item.checked 
      hideBox()
    }
    function throttle(fn, wait = 1) {
      let lastTime = Date.now();
      return function () {
        let currentTime = Date.now();
        if (currentTime - lastTime > wait * 1000) {
          lastTime = currentTime;
          fn.apply(this, arguments);
        }
      }
    }

    $scope.checkAll = function(){
      if($scope.check_All){
        $scope.userList.forEach(item=>{
          item.check = true
        })
      }else{
        $scope.userList.forEach(item=>{
          item.check = false
        })
      }
    }
    $scope.checkOne = function (item, index) {
      if (item.check) {
        var num = 0;
        for (var i = 0; i < $scope.userList.length; i++) {
          if ($scope.userList[i].check) {
            num++;
          }
        }
        if (num == $scope.userList.length) {
          $scope.check_All = true;
        }
      } else {
        $scope.check_All = false;
      }
    }

    $scope.toBlackList=function(){
      parma={
        pageNum:1,
        pageSize:10,       
      }
      erp.postFun("erp/userAttributeNoEmail/queryPage",parma,
        function(data){
          if(data.data.statusCode=="200"){
            console.log(data)
            const {result} = data.data
            $scope.userList = result.rows
            $scope.pageNum = result.pageNum
            $scope.pageSize = result.pageSize
            $scope.pageTotal = result.total

          }
        },function(err){
          console.log(err)
        })
      $scope.isBlackList = true
    }

    $scope.stopSend=function(){
      const list=[]
      console.log($scope.checkedList)
      const ids=[]
      $scope.checkedList.forEach(item=>{
        ids.push(item.id)
      })
      ids.forEach(item=>{
        $scope.userList.forEach(it=>{
          if(it.check){
            const obj={
              "attribute_id":item,
              "user_id": it.accountId
            }
            list.push(obj)
          }
        })
      })
      if(ids.length>0 && list.length>0){
        erp.postFun("erp/userAttributeNoEmail/insert",list,
        function(data){
          if(data.data.statusCode=="200"){
            handleSearch()
            layer.msg("设置成功！")
          }
        },function(err){
          console.log(err)
        })
      }else{
        layer.msg("请先选择筛选条件和数据")
      }

    }


  }])
})()