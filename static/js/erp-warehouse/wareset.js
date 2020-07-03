;
(function() {
  let app = angular.module('warehouse-app');
  app.controller('waresetCtrl', ['$scope', "erp", '$location', function($scope, erp, $location) {
    /* 获取配置列表 */
    function getList() {
        layer.load(2)
        erp.postFun('storage/storageBasic/getStorageDeployInfo', {}, function(data) {
            layer.closeAll();
            $scope.wareSetList = data.data.result;
        })
    }
    getList();

    /* 获取仓库列表 */
    function getwareList() {
      erp.postFun('warehouseBuildWeb/management/selectStorageDoList', {}, function(data) {
        let odata = data.data;
        if (odata.code != 200) {
          layer.msg('获取列表错误');
          return;
        }
        $scope.wareList = odata.data.list.map(item => {
          item.check = false;
          return item;
        });
      })
    }
    getwareList();
    
    $scope.countryList = [
      { val:'CHINA',name:'中国'},
      { val:'USA',name:'美国'},
      { val:'TH',name:'泰国'},
    ]

    /* 增加仓库配置 */
    $scope.addObj = {
      name: '',
      name_en: '',
      relevance_storage_id: '',
      relevance_storage_name: ''
    }
    $scope.addWareFlag = false;
    $scope.addNewFun = () => {
      $scope.addWareFlag = true;
      $scope.addObj = {
        name: '',
        name_en: '',
        relevance_storage_id: '',
        relevance_storage_name: '',
        affiliation_state:''
      }
      $scope.checkWarelist=[];
    }
    $scope.chooseWareFun = (item) => {
      item.check = !item.check;
      $scope.checkWarelist = $scope.wareList.filter(item => {
        if (item.check) {
          return item;
        }
      })
    }
    $scope.cancelAddFun = () => {
      $scope.addWareFlag = false;
    }
    $scope.removeCheckFun = (index,ev) => {
        ev && ev.stopPropagation();
        $scope.checkWarelist.splice(index,1);
        $scope.wareList = $scope.wareList.map(item=>{
            item.check=false;
            if($scope.checkWarelist.indexOf(item)!=-1){
                item.check=true;
            }
            return item;
        })
    }
    /* 关闭仓库弹框 */
    function clickCloseList(ev) {
      let rectObj = document.getElementById('wareList').getBoundingClientRect();
      if (rectObj.left > ev.clientX || rectObj.right < ev.clientX ||
        rectObj.top > ev.clientY || rectObj.bottom < ev.clientY) {
        document.getElementById('selectList').click();
      }
    }
    $scope.showWareList = false;
    $scope.toggleWareListFun = (ev) => {
      ev && ev.stopPropagation();
      $scope.showWareList = !$scope.showWareList;
      if ($scope.showWareList) {
        document.documentElement.addEventListener('click', clickCloseList);
      } else {
        document.documentElement.removeEventListener('click', clickCloseList);
      }
    }
    $scope.confirmAddFun = () => {
        let ids=[],names=[];
        $scope.checkWarelist.forEach(item=>{
            ids.push(`'${item.id}'`);
            names.push(item.storageName);
        })
        $scope.addObj.relevance_storage_id = ids.join(',');
        $scope.addObj.relevance_storage_name = names.join(',');
        let postURL;
        if(!$scope.addObj.ID){
            postURL = 'storage/storageBasic/addStorageDeploy'
        }else{
            postURL = 'storage/storageBasic/upStorageDeploy';
        }
        if(!$scope.addObj.name){
            return layer.msg('请输入仓库名');
        }else if(!$scope.addObj.name_en){
            return layer.msg('请输入仓库英文名');
        }else if(!$scope.addObj.affiliation_state){
            return layer.msg('请选择国家');
        }else if(!$scope.addObj.relevance_storage_id){
          return layer.msg('请选择关联仓库');
      }
        erp.postFun(postURL, $scope.addObj, function(data) {
            $scope.wareList = $scope.wareList.map(item=>{
                item.check=false;
                return item;
            })
            $scope.addWareFlag = false;
            getList();
        })
    }
    /* 编辑仓库信息 */
    $scope.editOneWare = (item)=>{
        $scope.addWareFlag = true;
        $scope.addObj.name = item.name;
        $scope.addObj.name_en = item.name_en;
        $scope.addObj.ID = item.ID;
        $scope.addObj.status = '0';
        $scope.checkWarelist = [];
        /* 将当前的仓库信息显示 */
        $scope.wareList = $scope.wareList.map(_item=>{
            _item.check=false;
            if((item.relevance_storage_id).indexOf(_item.id)!=-1){
                _item.check=true;
            }
            return _item;
        })
        $scope.checkWarelist = $scope.wareList.filter(_item => {
            if (_item.check) {
              return _item;
            }
        })
        console.log($scope.countryList)
        $scope.countryList = $scope.countryList.map(_item=>{
          _item.check=false;
          if(item.affiliation_state==_item.val){
             _item.check=true;
             $scope.addObj.affiliation_state=_item.val;
          }
          return _item;
        })
    }
    $scope.freezeOneWare = (item,type)=>{
        $scope.addObj.name = item.name;
        $scope.addObj.name_en = item.name_en;
        $scope.addObj.relevance_storage_id = item.relevance_storage_id;
        $scope.addObj.relevance_storage_name = item.relevance_storage_name;
        $scope.addObj.ID = item.ID;
        $scope.addObj.status = type;
        erp.postFun('storage/storageBasic/upStorageDeploy', $scope.addObj, function(data) {
            $scope.wareList = $scope.wareList.map(_item=>{
                _item.check=false;
                return _item;
            })
            getList();
        })
    }
    $scope.nameChange = ()=>{
      $scope.addObj.name =  $scope.addObj.name.replace(/[^\u2E80-\u9FFF]/g,'')
    }
    $scope.nameEnChange = ()=>{
      $scope.addObj.name_en = $scope.addObj.name_en.replace(/[^A-Za-z\s]*/g,'');
    }

    /* 关闭归属国家弹框 */
    function clickCloseCountry(ev) {
      let rectObj = document.getElementById('countryList').getBoundingClientRect();
      if (rectObj.left > ev.clientX || rectObj.right < ev.clientX ||
        rectObj.top > ev.clientY || rectObj.bottom < ev.clientY) {
        document.getElementById('selectCountryList').click();
      }
    }
    /* 选择国家 */
    $scope.toggleCountryFun = (ev)=>{
      ev && ev.stopPropagation();
      $scope.showCountryList = !$scope.showCountryList;
      $scope.showWareList = false;
      if ($scope.showCountryList) {
        document.documentElement.addEventListener('click', clickCloseCountry);
      } else {
        document.documentElement.removeEventListener('click', clickCloseCountry);
      }
    }
    $scope.chooseCountryFun = (item) => {
      $scope.countryList.forEach(item=>{
        item.check=false;
      })
      item.check = !item.check;
      $scope.addObj.affiliation_state=item.val;
    }
  }])
})();