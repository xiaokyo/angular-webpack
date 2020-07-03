;
~(function() {
  let app = angular.module('erp-service');
  app.controller('superdealListCtrl', ['$scope', 'erp', '$filter','$routeParams', function($scope, erp, $filter,$routeParams) {
    const bs = new Base64();
    const erpLoginName = bs.decode(localStorage.getItem('erploginName') == undefined ? '' : localStorage.getItem('erploginName'));
    $scope.type = 1; //1：所有列表；2：sku列表
    $scope.productObj = {};
    $scope.storeList = [
        { 'storeName': '全部', 'store': ''}, 
        { 'storeName': '义乌仓', 'store': 0}, 
        { 'storeName': '深圳仓', 'store': 1}, 
        { 'storeName': '美西奇诺仓', 'store': 2}, 
        { 'storeName': '美东新泽西仓', 'store': 3}, 
        { 'storeName': '泰国仓', 'store': 4}
    ]
    
    // 列表请求参数
    $scope.listParam={
      storageDoId:'',
      pageSize:'10',
      pageNum:'1',
      sku:'',
      discountStatus:+$routeParams.type,
      status:'1'
    }
    let getHouse = ()=>{
      let parmas = {
        useStorageType:'1'
      };
      erp.postFun('storehouse/WarehousInfo/getStorehouse', parmas, ({ data }) => {
        $scope.storeList= data.code == 200 ? (data.data.length>0?data.data:[]):[];
        console.log($scope.storeList)
      })
    }
    getHouse();//获取仓库信息
    $scope.storeHouseFilter = (val)=>{
      if($scope.storeList.length>0){
        let storageName;
        $scope.storeList.forEach(item=>{
          if(val==item.id){
            storageName=item.storageName;
          }
        })
        return storageName;
      }
    }
    $scope.getList=()=> {
      layer.load(2);
      erp.postFun('erp/unsold/product/listPage', $scope.listParam, ({data}) => {
        layer.closeAll();
        let obj = data.result;
        $scope.superList = obj.rows.map(item=>{
          item.originalPrice = item.originalPrice.replace('--','-');
          return item;
        });

        $scope.totalNum = obj.total;
        let pagetol = Math.ceil($scope.totalNum / (+$scope.listParam.pageSize))
        $scope.$broadcast('page-data', {
          pageSize: $scope.listParam.pageSize, //每页条数
          pageNum: $scope.listParam.pageNum, //页码
          totalNum: pagetol, //总页数
          totalCounts: $scope.totalNum, //数据总条数
          pageList: ['10', '30', '50'] //条数选择列表，例：['10','50','100']
        })
      }, (err) => {
        layer.closeAll();
        layer.msg('网络错误');
      })
    }
    $scope.getList();
    $scope.$on('pagedata-fa', function(_,{pageNum,pageSize}) { // 分页onchange
      $scope.listParam.pageNum = pageNum;
      $scope.listParam.pageSize = pageSize;
      $scope.getList();
    })
    let getSKUList=(obj,callback)=>{
      layer.load(2);
      let params = {
        pid:obj.productId
      }
      erp.postFun('erp/unsold/variant/getVariantsByProductId', params, ({data}) => {
        layer.closeAll();
        if(data.statusCode=='200'){
          callback(data.result)
        }else{
          callback([])
          layer.msg('获取sku列表失败')
        }
      })
    }
    $scope.showSkuList = item => {
      item.showItemDetail = !item.showItemDetail;
      if(item.showItemDetail&&!item.detailList){
        let sendObj = {productId:item.productId};
        getSKUList(sendObj,(data)=>{
          item.detailList=data;
          item.showItemDetail=true;
        })
      }
    }
    $scope.editFun = (item) => {
      $scope.productObj.sku = item.sku;
      $scope.productObj.category = item.productCategory;
      $scope.productId = item.productId;
      if(item.detailList){
        $scope.superSKUList = item.detailList;
        $scope.type = 2;
      }else{
        let sendObj = {productId:item.productId};
        getSKUList(sendObj,(data)=>{
          $scope.superSKUList = data;
          item.detailList = data;//在查看的时候顺便赋值
          $scope.type = 2;
        })
      }
    }
    $scope.editEasy = () => {
      $scope.showSetPrice = true;
      $scope.priceParam.val='';
    }
    $scope.storeChange = item=>{
        $scope.listParam.store=item.store;
        $scope.getList();
    }
    $scope.editEasyFun =()=>{
      if(!$scope.priceParam.val){
        return layer.msg('请输入数字');
      }else if(+$scope.priceParam.val>1||+$scope.priceParam.val==0){
        return layer.msg('只能设置0到1之前数字，包括1不包括0');
      }
      $scope.superSKUList.map(item=>{
        item.nowPrice=(item.originalPrice*(+$scope.priceParam.val)).toFixed(2);
        return item;
      })
      $scope.showSetPrice = false;
    }
    $scope.skuEditPriceFun = ()=>{
      $scope.showSkuListConfirm=false;
      let priceL = [];
      let ovariants = $scope.superSKUList.map(item=>{
        priceL.push(item.nowPrice);
        let newItem = {
          vid:item.variantId,
          discountVal:'',
          nowPrice:item.nowPrice,
          originalPrice:item.originalPrice
        };
        return newItem;
      });
      let maxPrice = Math.max(...priceL);
      let minPrice = Math.min(...priceL);
      let odiscountVal = maxPrice==minPrice?maxPrice:`${minPrice}-${maxPrice}`;
      let params = {
        pid:$scope.productId,
        discountVal:'',
        nowPrice:odiscountVal,
        variants:ovariants,
        updateBy:erpLoginName
      }
      erp.postFun('erp/unsold/variant/updateDiscount', params, ({data}) => {
        layer.closeAll();
        if(data.statusCode=='200'){
          $scope.type=1;
          $scope.getList();
        }else{
          layer.msg('修改价格失败')
        }
      })
    }
    $scope.showSKUPrice = ()=>{
      let num=0;
      $scope.superSKUList.forEach(item=>{
        item.blur=false;
        if(+item.nowPrice>+item.originalPrice){
          item.blur=true;
          num++;
        }else if(item.nowPrice==0){
          item.blur=true;
          num++;
        }
      });
      if(num>0) return layer.msg(`商品的现售价不能大于原售价并且现售价不能为0，请重新编辑`);
      $scope.showSkuListConfirm=true;
    }
    $scope.numberInput = (item,type)=>{
      let regStrs = [
        ['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0
        ['[^\\d\\.]+$', ''], //禁止录入任何非数字和点
        ['\\.(\\d?)\\.+', '.$1'], //禁止录入两个以上的点
        ['^(\\d+\\.\\d{2}).+', '$1'] //禁止录入小数点后两位以上
      ]
      regStrs.forEach(_item=>{
        var reg = new RegExp(_item[0]);
        if(type==1){
          item.nowPrice=item.nowPrice.replace(reg, _item[1]);
        }else if(type==2){
          $scope.priceParam.val=$scope.priceParam.val.replace(reg, _item[1]);
        }
      })
    }
    $scope.viewInverntory = item =>{
      // if(item.oldInventory) return false;
      let params = {
        pid:item.variantId?'':item.productId,
        vid:item.variantId
      }
      $scope.productObj.sku = item.sku;
      $scope.productObj.category = item.productCategory;
      layer.load(2);
      erp.postFun('erp/unsold/product/getProductInventorys', params, ({data}) => {
        layer.closeAll();
        if(data.statusCode=='200'){
          $scope.inverntoryList = data.result;
          $scope.showWareDetail=true;
        }else{
          layer.msg('获取库存失败')
        }
      })
    }
  }])


})();