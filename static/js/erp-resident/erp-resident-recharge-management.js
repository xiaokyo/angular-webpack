(function(){
    var app = angular.module('erp-resident');
    app.controller('RechargeManagementCtrl',[
        "$scope",
        "erp",
        "$routeParams",
        "utils",
        "$location",
        "$filter",
        function($scope,erp,$routeParams,utils,$location,$filter){
            console.log('RechargeManagementCtrl') 
     
            //
            $scope.dataList = [];
            $scope.pageSize = '20';
            $scope.pageNum = 1;
            $scope.val='1'
            $scope.tabArr = [
                {'name':'待处理','val':'1','isActive':'true' },
                {'name':'已确认','val':'2','isActive':''},
                {'name':'审核异常','val':'3','isActive':''},
             ];
             $scope.searVal = '' ;       //搜索
             $scope.startTime = '';
             $scope.endTime = '';
             $scope.imgArr = []
            //  $scope.moneyType = 'USD';   //币种展示
             $scope.seaType = '0' ;   //个体企业

            //文件上传文件
            $scope.file = ''
            //弹框
            $scope.isConfirm = false;
            $scope.isRefuse = false;
            
             $scope.selectVal = ''
             $scope.remarks = ''

             //搜索
            //  $scope.id = []
             $scope.searchId = ''
             $scope.name = ''
             $scope.changed = false;
     
             
            //切换tab
            $scope.checkTab = function(item){
                 console.log(item)
                 for(i=0;i<$scope.tabArr.length;i++){
                     $scope.tabArr[i].isActive = '';
                 }
                 item.isActive = true;
                 $scope.val = item.val;
                 $scope.searchShowList = []
                 $scope.searchId = ''
                 clear()
                 getData()
            }
            
     
              //获取系统当前时间
              var nowTime = new Date();
              var y = nowTime.getFullYear();
              var m = nowTime.getMonth()+1;
              var d = nowTime.getDate();
              var formatNowDate = y+'-'+m+'-'+d;
              //获取系统前一周的时间
              var oneWeekDate = new Date(nowTime-7*24*3600*1000);
              var y = oneWeekDate.getFullYear();
              var m = oneWeekDate.getMonth()+1;
              var d = oneWeekDate.getDate();
              var formatWDate = y+'-'+m+'-'+d;
              //获取系统前一个月的时间
              nowTime.setMonth(nowTime.getMonth()-1);
              var y = nowTime.getFullYear();
              var m = nowTime.getMonth()+1;
              var d = nowTime.getDate();
              var formatMDate = y+'-'+m+'-'+d;
              $scope.startTime = formatWDate;
              $scope.endTime = formatNowDate;
              $('#date1').val(formatWDate)
              $('#date2').val(formatNowDate)
              console.log($scope.startTime)
              console.log($scope.endTime)



            //清空
            function clear(){
                 $('#date1').val(formatWDate)
                 $('#date2').val(formatNowDate)
                 $scope.searVal = ''
                 $scope.pageNum = 1
                 $scope.searchShowList = []
                 $scope.searchId = ''
             }
            //切换下拉选择框
            // $scope.selectArr = [
            //     {'name':'运费',val:'productFee',activeVal:'1'},
            //     {'name':'供应商佣金',val:'payFee',activeVal:'2'},
            // ]
           
     
            // $scope.checkSelect = function(){
            //      console.log($scope.seaType)
            //      clear()
            //      getData()
            // }
     
            //搜索
            $scope.searchInput = function(){
              console.log($scope.searchId)
                $scope.pageNum = 1
                $scope.searchShowList = []
                if( $scope.searVal!='' && $scope.searchId== ''){
                  $scope.searchId = $scope.searchList.map(ele=>ele.id).toString();
                  console.log($scope.searchId)
                }else if($scope.searVal ==''){
                  $scope.searchId = ''
                }
                console.log($scope.searchId)
                getData();
            }
     
            //获取供应商列表
            $scope.searchList = []
            $scope.searchShowList = []
            // $('#searShop').on('propertychange change input ',function(){
            $('#searShop').on('input propertychange',function(){
              console.log($(this).val())
              $scope.searVal = $(this).val()
              console.log($scope.searVal)
              if($(this).val().trim() !=''){
                    var data = {
                        "pageNum": 1,
                        "pageSize": 5,
                        "name": $scope.searVal,
                        "accountType": $scope.seaType *1
                      };
                      // layer.closeAll("loading")
                      erp.postFun("supplier/supplierLogistics/findSupplierId", data, function (res) {
                          $scope.searchList = []
                          $scope.searchShowList = []
                          if (res.data.code == 200) {
                            $scope.searchId = ''
                            $scope.searchList = res.data.data.records;
                            var TotalNum = res.data.data.total;
                            if(TotalNum > 0){
                                // $scope.searchShowList = $scope.searchList.length >5 ? $scope.searchList.splice(0,5) : $scope.searchList;
                                $scope.searchShowList = $scope.searchList;
                                for(i=0;i<$scope.searchShowList.length;i++){
                                    $scope.searchShowList[i]['changed'] = false;
                                }
                            }
                            console.log($scope.searchShowList)
                            // $scope.TotalNum1 = res.data.result.total;
                            pageFun1()
                          }
                        }, function (data) {
                          console.log(data)
                        },{layer:true})
              }else{
                $scope.searchId = ''
                // getData()
              }
             
            })
            //点击li选中
            
            $scope.selectName = function(item){
              // console.log(item)
              var arr=[1,2,3,4,5,6,7]
              console.log(arr.slice())
              item.changed = !item.changed
              $scope.searVal = item.name
              $scope.searchId = item.id
              console.log($scope.searchId)
              if($scope.searchId!=''){
                  $scope.searchShowList = []
              }
            }

           


          
        //图片上传
            
        $scope.upLoadImg4 = function (files) {
          // erp.ossUploadFile($('#uploadInp')[0].files, function (data) {
            // var index = files[0].name.lastIndexOf(".");
            // var ext = files[0].name.substring(index + 1, files[0].name.length).toUpperCase();
            // // var ext = files[0].name.substring(0,index).toUpperCase();
            // console.log(ext)       //后缀名
            // if(ext != "PNG" && ext != "JPG" && ext != "JPEG" && ext != "GIF") {
            //   layer.msg('请上传图片')
            //   return;
            // }
          erp.ossUploadFile(files, function (data) {
              console.log(data)
              if (data.code == 0) {
                  layer.msg('上传失败');
                  return;
              }
              if (data.code == 2) {
                  layer.msg('图片上传失败');
              }
              var result = data.succssLinks;
              console.log(result)
              var filArr = [];
              for (var j = 0; j < result.length; j++) {
                  var srcList = result[j].split('.');
                  var fileName = srcList[srcList.length - 1].toLowerCase();
                  console.log(fileName)
                  if (fileName == 'png' || fileName == 'jpg' || fileName == 'jpeg' || fileName == 'gif') {
                      $scope.imgArr.push(result[j]);
                      $('#uploadInp').val('');
                  }else{
                    layer.msg('请上传图片')
                    $('#uploadInp').val('');
                  }
              }
              console.log($scope.imgArr)
              $scope.$apply();
          })
      }
        $scope.deletImgFun = function (index) {
          $scope.imgArr.splice(index,1)
        }
        $scope.id = ''
        $scope.supplierShopId = ''
        $scope.tradeAmount = ''


     
            //获取列表
            function getData() {
              console.log($scope.pageNum)
              var data = {
                "pageNum": $scope.pageNum *1,
                "pageSize": $scope.pageSize *1,
                "supplierId": $scope.searchId,
                "beginTime": $('#date1').val(),
                "endTime": $('#date2').val(),
                "approveStatus": $scope.val,
              };
              erp.postFun("supplier/supplierLogistics/getList", data, function (res) {
              //  erp.postFun(url, data, function (res) {
                console.log(res)
                // if (res.data.statusCode == 200) {
                if (res.data.code == 200) {
                  // $scope.dataList = res.data.result.rows;
                  $scope.dataList = res.data.data.list;
                  if($scope.dataList){
                      for(let i = 0,len = $scope.dataList.length;i<len;i++){
                        $scope.dataList[i]['index'] = $scope.pageSize*($scope.pageNum-1)+i+1
                        if($scope.dataList[i]['comeFrom'] =='1'){
                          $scope.dataList[i]['comeFrom'] = '供应商平台'
                        }
                        if($scope.dataList[i]['payType'] == 1){
                          $scope.dataList[i]['payType'] = "支付宝支付"
                        }
                        if($scope.dataList[i]['payType'] == 2){
                          $scope.dataList[i]['payType'] = "微信支付"
                        }
                        if($scope.dataList[i]['payType'] == 3){
                          $scope.dataList[i]['payType'] = "汇款支付"
                        }
                        if($scope.dataList[i]['proofImgUrl']){
                          $scope.dataList[i]['proofImgUrl'] = $scope.dataList[i]['proofImgUrl'].split(',')
                        }
                    }
                  }
                  console.log($scope.dataList)
                  // $scope.TotalNum1 = res.data.result.total;
                  $scope.TotalNum = res.data.data.total;
                  console.log($scope.TotalNum)
                  pageFun1()
                }
              }, function (data) {
                console.log(data)
              },{layer:true})
            }
           
             getData();
           
           //分页
           function pageFun1() {
             $(".pagegroup1").jqPaginator({
               totalCounts: $scope.TotalNum || 1,
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
                 };
                 erp.load();
                 $scope.pageNum = n;
                 console.log($scope.pageNum,typeof $scope.pageNum)
                 getData()
               }
             });
           }
           $scope.toPage1 = function () {
             var pageNum = Number($scope.pageNum);
             var pageNumtotal = Number($scope.TotalNum);
             var pageSize1 = Number($scope.pageSize);
             // var totalPage = Math.ceil($scope.TotalNum1 / Number($scope.pageSize1));
             var totalPage =  Math.ceil(pageNumtotal / pageSize1);
             console.log(typeof pageNum)
             console.log(typeof Number($scope.pageSize))
             console.log(totalPage)
             if (!pageNum) {
               layer.msg('请输入页码');
               return;
             }
             if (pageNum > totalPage) {
               layer.msg('总计' + totalPage + '页，所输入数字应小于' + totalPage);
               $scope.pageNum1 = 1;
               return;
             }
             getData();
           };
           $scope.pagechange = function(pageSize){
               console.log($scope.pageSize)
               console.log(pageSize)
               $scope.pageNum = 1;
               getData()
           }

           //文件上传
           $scope.upLoadExcelFun = function (item) {
            console.log(item)      //Filelist
            console.log(item[0])      //file
            var file = $("#document2").val();
            console.log(file)     //文件路径
            var index = file.lastIndexOf(".");
            var ext = file.substring(index + 1, file.length);
            console.log(ext)       //后缀名
            if(ext != "xlsx" && ext != "xls") {
              layer.msg('请上传excel文件')
              return;
            }
            erp.load();
            var formData = new FormData($("#uploadimg2")[0]);
            console.log($("#uploadimg2")[0])
            formData.append("file",item[0]);
            console.log(formData)
            $scope.file = formData;
            erp.upLoadImgPost('erp/orderResend/uploadExcel',formData,function (data) {
              console.log(data)
              layer.closeAll("loading")
              // if (data.data.result==true) {
              if (data.data.statusCode==200) {
                layer.msg('上传成功');
                $('#document2').val('') // 注意1
                // data.data.result 数据
                //上传Excel解析弹窗
              } else {
                $('#document2').val('') // 注意1
                layer.msg(data.data.message) 
              }
            },function (data) {
              // console.log(data)
              layer.closeAll("loading")
            })
          }

            //同意
            $scope.confirmTixian = function(item){
              console.log(item)
             $scope.isConfirm = true;
             $scope.id = item.id
             $scope.payId = item.payId
             $scope.supplierShopId = item.supplierShopId
             $scope.tradeAmount = item.tradeAmount
         }
         //同意确定
          $scope.sureConfirm = function(item){
              console.log(item)
              // $scope.remarks = item;
              console.log($scope.remarks);
              console.log( $scope.imgArr.toString())
              $scope.file = $scope.imgArr.toString()
              console.log($scope.id,typeof($scope.id))
              console.log(parseInt($scope.id,10))
              console.log(Number($scope.id))
              if($scope.remarks == ''){
                layer.msg('请填写备注')
              }else if($scope.remarks.length>200){
                layer.msg('输入的字符不能超过200个')
              }else{
                  var data = {
                    "remarks": $scope.remarks,
                    "proofImgUrl":$scope.file,
                    "id": $scope.id,
                    "payId": $scope.payId
                }
                erp.postFun('supplier/supplierLogistics/auditPass', data, function (res) {
                    console.log(res)
                    // if (res.data.statusCode == 200) {
                    if (res.data.code == 200) {
                        $scope.isConfirm = false;
                        $scope.deletImgFun()
                        $scope.imgArr = []
                        $scope.remarks = ''
                        getData()
                    }else{
                      layer.msg(res.data.error)
                    }
                  }, function (data) {
                    console.log(data)
                  },{layer:true})
              }
              
          }

          //取消同意
          $scope.cancelTixian = function(){
              $scope.isConfirm = false
              $scope.remarks = ''
              $scope.deletImgFun()
              $scope.imgArr = []
          }

          //拒绝
              $scope.refuseTixian = function(item){
              $scope.isRefuse = true;
              $scope.id = item.id
              $scope.payId = item.payId
              $scope.supplierShopId = item.supplierShopId
              $scope.tradeAmount = item.tradeAmount
          }
          //拒绝确定
          $scope.sureConfirm1 = function(item){
              console.log(item)
              $scope.remarks = item;
              $scope.file = $scope.imgArr.toString()
              console.log($scope.remarks);
              if($scope.remarks.length<5){
                  layer.msg('请输入至少5个字符')
              }else if($scope.remarks.length>200){
                layer.msg('输入的字符不能超过200个')
              }else{
                  var data = {
                    "remarks": $scope.remarks,
                    // "proofImgUrl":$scope.file,
                    "id": $scope.id,
                    "payId": $scope.payId
                  }
                  erp.postFun('supplier/supplierLogistics/auditFailed', data, function (res) {
                      console.log(res)
                      // if (res.data.statusCode == 200) {
                      if (res.data.code == 200) {
                        $scope.isRefuse = false;
                        $scope.deletImgFun()
                        $scope.remarks = ''
                        getData()
                      }
                  }, function (data) {
                      console.log(data)
                  },{layer:true})
              }
          }

          //取消拒绝
          $scope.cancelTixian1 = function(){
              $scope.isRefuse = false
              $scope.remarks = ''
              $scope.imgArr = []
              $scope.deletImgFun()
          }
              
          //关闭所有弹框
          $scope.closeAlltan = function(){
              $scope.isConfirm = false;
              $scope.isRefuse = false;
              $scope.imgArr = []
              $scope.remarks = ''
              $scope.deletImgFun()
          }
        }]
    )
    app.filter("rentalTrans", function() {
      return function(value) {
        if(value === -1) {
          return "永久"
        } else {
          return value + "个月"
        }
      }
    })
})() 