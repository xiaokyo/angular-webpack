(function () {
	var app = angular.module('gxhgys-app',[]);
	app.controller('pod-ord-control',['$scope','$location','erp', function ($scope, $location, erp) {
		console.log('pod-ord-control')
    console.log($location.url());
    var bs = new Base64();
    var erpLoginName = bs.decode(localStorage.getItem('erploginName') == undefined ? '' : localStorage.getItem('erploginName'));
    var curLuyou = $location.url();
    if (curLuyou=='/pod/ord-list') {
      $scope.status = '-1';
    }
    if (curLuyou=='/pod/ord-link-suplier-list') {
      // 已拒绝的订单
      $scope.status = '3'
    }
    if (curLuyou=='/pod/print-sheet') {
      // 已接单
      $scope.status = '1'
    }
		$scope.pageSize = '20';
		$scope.pageNum = '1';
		$scope.search = '';
		$scope.totalNum = 0;
		$scope.totlaPage = 0
		// $scope.status = '';
		$scope.numMap = {};
		function getList () {
			erp.loadPercent($('.table-box'), 600);
			erp.postFun('caigou/soufeel/getCJIndividuationProductList',JSON.stringify({
				pageSize: $scope.pageSize,
				pageNum: $scope.pageNum,
				// searchKey: $scope.search,
				status: $scope.status
			}), function (data) {
				erp.closeLoadPercent($('.table-box'));
				var data = data.data
				console.log(data);
				if (data.statusCode == 200) {
					$scope.list = data.result.orderList;
					$scope.totalNum = data.result.total;
					if ($scope.totalNum == 0) {
              erp.addNodataPic($('.table-box'), 600);
              return
          }
          erp.removeNodataPic($('.table-box'));
          $scope.totlaPage = Math.ceil($scope.totalNum/($scope.pageSize *1));
					pageFun($scope, function (n) {
						$scope.pageNum = n + '';
						getList();
					});
				}
			});
		}
		getList();
    // $scope.suplierList = [];
    // 获取所有供应商
    erp.postFun('caigou/dzgongyingshangpin/listgys',{}, function (data) {
      var data = data.data
      // console.log(data);
      if (data.statusCode == 200) {
        $scope.suplierList = data.result.listgys;
        console.log($scope.suplierList);
      }
    });
		$scope.showFujian = function () {
			$scope.showFujianFlag = true;
		}
		$scope.searchFun = function () {
        getList();
    }
    $scope.enterSearch = function (e) {
        if (e.keyCode == 13) {
            getList();
        }
    }
    $scope.chanPageSize = function () {
    	$scope.pageNum = '1';
    	getList();
    }
    $scope.chanPageNum = function () {
    	if ($scope.topagenum * 1 > $scope.totlaPage) return;
    	$scope.pageNum = $scope.topagenum;
    	getList();
    }
		$scope.chanStatus = function (status) {
    	$scope.status = status;
    	getList();
    }
    $scope.printSheet = function (item,index) {
      $scope.confirmPrintSheetFlag=true;
      $scope.printItem=item;
      $scope.printItem.index = index;
    }
    $scope.goActPrintSheet = function () {
      // 打印面单
     //  layer.load(2);
     //  erp.postFun2("getExpressSheet.json", JSON.stringify({
     //    ids: $scope.printItem.id
     //  }), function (data) {
     //    layer.closeAll('loading');
     //    var data = data.data;
     //    console.log(data);
     //    $scope.miandanArr = data;
     //    $scope.confirmPrintSheetFlag=false;
     //    $scope.showPrintResultFlag = true;
     //    erp.postFun('caigou/dzgongyingshangpin/dadan',JSON.stringify({
     //      dingdanid: $scope.printItem.id
     //    }), function (data) {
     //      var data = data.data;
     //      console.log(data);
     //      if (data.statusCode==200) {
     //        layer.msg('标记为已打单');
     //        $scope.list.splice($scope.printItem.index,1);
     //      } else {
     //        layer.msg('标记为已打单失败');
     //      }
     //    });
     // })
     $scope.confirmPrintSheetFlag=false;
     //物流,商品属性,订单重量,订单id,国家简码
     // daDanFun('China Post Registered Air Mail','','100','181108144047955530D','US')
     // daDanFun('ePacket','电子','100','181108144047955530D','CN')
    }
    function daDanFun(wlName,spShuXing,ordWeight,printIds,countryCode) {
        $scope.ddepackNum = 0;//带电epacket
        $scope.bdepackNum = 0;//不带电epacket
        $scope.oneHcepackNum = 0;//含磁epack
        $scope.oneHfmEpackNum = 0;//含粉末
        $scope.gzepackNum = 0;//膏状E邮宝
        $scope.uspsNum = 0;
        $scope.ddyzxbNum = 0;//带电邮政小包数量
        $scope.bdyzxbNum = 0;//不带电邮政小包数量
        $scope.qtwlordNum = 0;//其它物流
        $scope.uspsPlusNum = 0;//usps+
        
        $scope.showindex = 0;//控制哪种状态可以打印运单
        $scope.ytNum = 0;//云途
        $scope.onedhlddNum = 0;//带电dhl
        $scope.onedhlnotdNum = 0;//不带电dhl
        $scope.dhlGfNum = 0;//dhl官方转
        $scope.dhlOfficialNum = 0;//dhl官方
        $scope.usps2PlusNum = 0;
        $scope.epack2yanwen = 0;
        $scope.toSFGJNum = 0;//符合转顺丰国际
        $scope.toSFTHNum = 0;//符合转顺丰特惠
        $scope.nfSfNum = 0;//南风顺丰的个数
        $scope.ttSfNum = 0;//泰腾顺丰的个数
        $scope.nfOrTtNum = 0;
        $scope.dhl2Bldhl = 0;//转巴林的个数
        $scope.epack2LianbangNum = 0;
        if (wlName == 'ePacket') {
          if (spShuXing.indexOf('电') >= 0) {
            $scope.ddepackNum++;
            $scope.showindex = 1;
            console.log('判断带电的条件')
          } else if (spShuXing.indexOf('膏') >= 0) {
            $scope.gzepackNum++;
            $scope.showindex = 9;
            console.log('判断膏状E邮宝的条件')
          } else if (spShuXing.indexOf('磁') >= 0) {
            $scope.oneHcepackNum++;
            $scope.showindex = 13;
            console.log('判断含磁E邮宝的条件')
          } else {
            $scope.bdepackNum++;
            $scope.showindex = 2;
            console.log('判断e邮宝不带电/磁/膏的条件')
          }
        }
        else if (wlName == 'DHL') {
          if (spShuXing.indexOf('电') >= 0) {
            $scope.onedhlddNum++;
            $scope.showindex = 11;
            console.log('判断带电dhl的条件')
          } else {
            if(ordWeight<1000){
              $scope.dhlGfNum++;
              $scope.showindex = 19;
            }else{
              $scope.onedhlnotdNum++;
              $scope.showindex = 12;
            }
          }
        }
        else if (wlName == 'DHL Official') {
          $scope.dhlOfficialNum++;
          $scope.showindex = 20;
        }
        else if (wlName == 'CJ Normal Express') {
          console.log('cj normal')
          if (ordWeight > 1000 && ordWeight <= 1600) {
            $scope.nfSfNum++;
            $scope.showindex = 15;
          } else if (ordWeight > 1600 || ordWeight <= 1000) {
            $scope.ttSfNum++;
            $scope.showindex = 16;
          }
        }
        else if (wlName == 'USPS') {
          $scope.uspsNum++;
          $scope.showindex = 3;
          usps2uspsPlusIds = item.ID;
          $scope.usps2PlusNum++;
          console.log('判断usps物流的条件')
        }
        else if (wlName == 'China Post Registered Air Mail') {
          if (spShuXing.indexOf('电') >= 0) {
            $scope.ddyzxbNum++;
            $scope.showindex = 5;
            console.log('判断邮政小包带电的条件')
          } else {
            console.log($scope.bdyzxbNum)
            $scope.bdyzxbNum++;
            $scope.showindex = 6;
            console.log('判断邮政小包不带电的条件')
            console.log($scope.bdyzxbNum)
          }
        }
        else if (wlName == 'USPS+') {
          $scope.uspsPlusNum++;
          $scope.showindex = 7;
          console.log('判断usps+物流的条件')
        }
        else if (wlName.indexOf('YunExpress') >= 0) {
          $scope.ytNum++;
          $scope.showindex = 10;
          console.log('判断云途物流的条件')
        }
        else {
          $scope.qtwlordNum++;
          $scope.showindex = 4;
          console.log('判断其它物流的条件')
        }

        $scope.oneisydFlag = true;//单独操作生成运单号的弹框
        $scope.selNfOrTtFun = function () {//南风顺丰
          if ($scope.nfOrTtNum <= 0) {
            layer.msg('订单数为零不能生成订单');
            return;
          }
          if ($('.qd-onesel17').val() == '请选择') {
            layer.msg('请选择物流渠道');
            return;
          }
          if ($('.scyd-btn17').hasClass('btn-active1')) {
            return;
          }
          erp.load();
          var updata = {};
          updata.orderNum = printIds;
          updata.logisticsName = $('.qd-sel17').val();
          updata.enName = 'CJ Normal Express';
          updata.loginName = erpLoginName;
          console.log(JSON.stringify(updata))
          erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
            console.log(data)
            $scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
            if (data.data.result > 0) {
              var ids = {};
              ids.ids = printIds;
              ids.loginName = erpLoginName;
              console.log(JSON.stringify(ids))
              erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
                console.log(data)
                layer.closeAll("loading")
                var result = data.data;
                $scope.sess = 0;//存储成功的个数
                $scope.error = 0;//存储失败的个数
                for (var i = 0; i < result.length; i++) {
                  $scope.sess += result[i].sess;
                  $scope.error += result[i].error;
                }
                if ($scope.sess>0) {
                  var ids = {};
                  ids.ids = printIds;
                  ids.loginName = erpLoginName;
                  console.log(JSON.stringify(ids))
                  erp.postFun2('getExpressSheet.json',JSON.stringify(ids),function (data) {
                    console.log(data)
                    console.log(data.data)
                    // $scope.pdfmdArr = data.data;//生成的面单数组
                    var resMdArr = data.data;
                    layer.closeAll("loading")
                    var resPdfArr = [];
                    if (resMdArr.length>0) {
                      $scope.mdtcFlag = true;
                      for(var i =0,len=resMdArr.length;i<len;i++){
                        resPdfArr.push({
                          printCount:0,
                          printPdf:resMdArr[i]
                        })
                      }
                      $scope.pdfmdArr = resPdfArr;
                      console.log(resPdfArr)
                    } else {
                      layer.msg('生成面单错误')
                    }
                  },function (data) {
                    console.log(data)
                    layer.closeAll("loading")
                    layer.msg('网络错误')
                  })
                } else {
                  layer.msg('运单号生成错误')
                }
              }, function (data) {
                console.log(data)
                layer.closeAll("loading")
              })
            }
          }, function (data) {
            console.log(data)
            layer.closeAll("loading")
          })
        }
        $scope.nfsfFun = function () {//南风顺丰
          if ($('.qd-onesel15').val() == '请选择') {
            layer.msg('请选择物流渠道')
            return;
          }
          erp.load();
          var updata = {};
          updata.orderNum = printIds;
          updata.logisticsName = $('.qd-onesel15').val();
          updata.enName = 'CJ Normal Express';
          updata.loginName = erpLoginName;
          console.log(JSON.stringify(updata))
          erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
            console.log(data)
            $scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
            if (data.data.result > 0) {
              var ids = {};
              ids.ids = printIds;
              ids.loginName = erpLoginName;
              console.log(JSON.stringify(ids))
              erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
                console.log(data)
                layer.closeAll("loading")
                var result = data.data;
                $scope.sess = 0;//存储成功的个数
                $scope.error = 0;//存储失败的个数
                for (var i = 0; i < result.length; i++) {
                  $scope.sess += result[i].sess;
                  $scope.error += result[i].error;
                }
                // if ($scope.sess>0) {
                //   var ids = {};
                //   ids.ids = printIds;
                //   ids.loginName = erpLoginName;
                //   console.log(JSON.stringify(ids))
                //   erp.postFun2('getExpressSheet.json',JSON.stringify(ids),function (data) {
                //     console.log(data)
                //     console.log(data.data)
                //     // $scope.pdfmdArr = data.data;//生成的面单数组
                //     var resMdArr = data.data;
                //     layer.closeAll("loading")
                //     var resPdfArr = [];
                //     if (resMdArr.length>0) {
                //       $scope.mdtcFlag = true;
                //       for(var i =0,len=resMdArr.length;i<len;i++){
                //         resPdfArr.push({
                //           printCount:0,
                //           printPdf:resMdArr[i]
                //         })
                //       }
                //       $scope.pdfmdArr = resPdfArr;
                //       console.log(resPdfArr)
                //     } else {
                //       layer.msg('生成面单错误')
                //     }
                //   },function (data) {
                //     console.log(data)
                //     layer.closeAll("loading")
                //     layer.msg('网络错误')
                //   })
                // } else {
                //   layer.msg('运单号生成错误')
                // }
              }, function (data) {
                console.log(data)
                layer.closeAll("loading")
              })
            }
          }, function (data) {
            console.log(data)
            layer.closeAll("loading")
          })
        }
        $scope.ttsfFun = function () {//泰腾顺丰
          alert('泰腾顺丰')
          if ($('.qd-onesel16').val() == '请选择') {
            layer.msg('请选择物流渠道')
            return;
          }
          erp.load();
          var updata = {};
          updata.orderNum = printIds;
          updata.logisticsName = $('.qd-onesel16').val();
          updata.enName = 'CJ Normal Express';
          updata.loginName = erpLoginName;
          console.log(JSON.stringify(updata))
          erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
            console.log(data)
            $scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
            if (data.data.result > 0) {
              var ids = {};
              ids.ids = printIds;
              ids.loginName = erpLoginName;
              console.log(JSON.stringify(ids))
              erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
                console.log(data)
                layer.closeAll("loading")
                var result = data.data;
                $scope.sess = 0;//存储成功的个数
                $scope.error = 0;//存储失败的个数
                for (var i = 0; i < result.length; i++) {
                  $scope.sess += result[i].sess;
                  $scope.error += result[i].error;
                }
                // if ($scope.sess>0) {
                //   var ids = {};
                //   ids.ids = printIds;
                //   ids.loginName = erpLoginName;
                //   console.log(JSON.stringify(ids))
                //   erp.postFun2('getExpressSheet.json',JSON.stringify(ids),function (data) {
                //     console.log(data)
                //     console.log(data.data)
                //     // $scope.pdfmdArr = data.data;//生成的面单数组
                //     var resMdArr = data.data;
                //     layer.closeAll("loading")
                //     var resPdfArr = [];
                //     if (resMdArr.length>0) {
                //       $scope.mdtcFlag = true;
                //       for(var i =0,len=resMdArr.length;i<len;i++){
                //         resPdfArr.push({
                //           printCount:0,
                //           printPdf:resMdArr[i]
                //         })
                //       }
                //       $scope.pdfmdArr = resPdfArr;
                //       console.log(resPdfArr)
                //     } else {
                //       layer.msg('生成面单错误')
                //     }
                //   },function (data) {
                //     console.log(data)
                //     layer.closeAll("loading")
                //     layer.msg('网络错误')
                //   })
                // } else {
                //   layer.msg('运单号生成错误')
                // }
              }, function (data) {
                console.log(data)
                layer.closeAll("loading")
              })
            }
          }, function (data) {
            console.log(data)
            layer.closeAll("loading")
          })
        }
        $scope.ddepackFun = function () {//带电E邮宝
          if ($('.oneqd-sel1').val() == '请选择') {
            layer.msg('请选择物流渠道')
            return;
          }
          erp.load();
          var updata = {};
          updata.orderNum = printIds;
          updata.logisticsName = $('.oneqd-sel1').val();
          updata.enName = 'epacket';
          updata.loginName = erpLoginName;
          console.log(JSON.stringify(updata))
          erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
            console.log(data)
            $scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
            if (data.data.result > 0) {
              var ids = {};
              ids.ids = printIds;
              ids.loginName = erpLoginName;
              console.log(JSON.stringify(ids))
              erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
                console.log(data)
                // clearInterval(timer);//加载后清除定时器
                // $('#animat-text').text('');//提示消息置为空
                // $scope.endadmateP = true;//让成功失败条数显示起来

                layer.closeAll("loading")
                var result = data.data;
                $scope.sess = 0;//存储成功的个数
                $scope.error = 0;//存储失败的个数
                for (var i = 0; i < result.length; i++) {
                  $scope.sess += result[i].sess;
                  $scope.error += result[i].error;
                }

              }, function (data) {
                console.log(data)
                layer.closeAll("loading")
              })
            }
          }, function (data) {
            console.log(data)
            layer.closeAll("loading")
          })
        }
        $scope.bddepackFun = function () {//不带电E邮宝
          if ($('.oneqd-sel2').val() == '请选择') {
            layer.msg('请选择物流渠道')
            return;
          }
          erp.load();
          var updata = {};
          updata.orderNum = printIds;
          updata.logisticsName = $('.oneqd-sel2').val();
          updata.enName = 'epacket';
          updata.loginName = erpLoginName;
          console.log(JSON.stringify(updata))
          erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
            console.log(data)
            $scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
            if (data.data.result > 0) {
              var ids = {};
              ids.ids = printIds;
              ids.loginName = erpLoginName;
              console.log(JSON.stringify(ids))
              erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
                console.log(data)
                layer.closeAll("loading")
                var result = data.data;
                $scope.sess = 0;//存储成功的个数
                $scope.error = 0;//存储失败的个数
                for (var i = 0; i < result.length; i++) {
                  $scope.sess += result[i].sess;
                  $scope.error += result[i].error;
                }

              }, function (data) {
                console.log(data)
                layer.closeAll("loading")
              })
            }
          }, function (data) {
            console.log(data)
            layer.closeAll("loading")
          })
        }


        $scope.dhlddFun = function () {//带电dhl
          erp.load();
          var updata = {};
          updata.orderNum = printIds;
          updata.logisticsName = "CT02#DHL带电";
          updata.enName = 'DHL';
          updata.loginName = erpLoginName;
          console.log(JSON.stringify(updata))
          erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
            console.log(data)
            $scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
            if (data.data.result > 0) {
              var ids = {};
              ids.ids = printIds;
              ids.loginName = erpLoginName;
              console.log(JSON.stringify(ids))
              erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
                console.log(data)
                layer.closeAll("loading")
                var result = data.data;
                $scope.sess = 0;//存储成功的个数
                $scope.error = 0;//存储失败的个数
                for (var i = 0; i < result.length; i++) {
                  $scope.sess += result[i].sess;
                  $scope.error += result[i].error;
                }

              }, function (data) {
                console.log(data)
                layer.closeAll("loading")
              })
            }
          }, function (data) {
            console.log(data)
            layer.closeAll("loading")
          })
        }
        $scope.dhlbddFun = function () {//不带电dhl
          erp.load();
          var updata = {};
          updata.orderNum = printIds;
          updata.logisticsName = "CT01#DHL不带电";
          updata.enName = 'DHL';
          updata.loginName = erpLoginName;
          console.log(JSON.stringify(updata))
          erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
            console.log(data)
            $scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
            if (data.data.result > 0) {
              var ids = {};
              ids.ids = printIds;
              ids.loginName = erpLoginName;
              console.log(JSON.stringify(ids))
              erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
                console.log(data)
                layer.closeAll("loading")
                var result = data.data;
                $scope.sess = 0;//存储成功的个数
                $scope.error = 0;//存储失败的个数
                for (var i = 0; i < result.length; i++) {
                  $scope.sess += result[i].sess;
                  $scope.error += result[i].error;
                }

              }, function (data) {
                console.log(data)
                layer.closeAll("loading")
              })
            }
          }, function (data) {
            console.log(data)
            layer.closeAll("loading")
          })
        }
        $scope.dhlGfBddFun = function () {//官方不带电dhl
          erp.load();
          var updata = {};
          updata.orderNum = printIds;
          updata.logisticsName = "DHLGF#DHL不带电";
          updata.enName = 'DHL';
          updata.loginName = erpLoginName;
          console.log(JSON.stringify(updata))
          erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
            console.log(data)
            $scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
            if (data.data.result > 0) {
              var ids = {};
              ids.ids = printIds;
              ids.loginName = erpLoginName;
              console.log(JSON.stringify(ids))
              erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
                console.log(data)
                layer.closeAll("loading")
                var result = data.data;
                $scope.sess = 0;//存储成功的个数
                $scope.error = 0;//存储失败的个数
                for (var i = 0; i < result.length; i++) {
                  $scope.sess += result[i].sess;
                  $scope.error += result[i].error;
                }

              }, function (data) {
                console.log(data)
                layer.closeAll("loading")
              })
            }
          }, function (data) {
            console.log(data)
            layer.closeAll("loading")
          })
        }
        $scope.dhlOfficialFun = function () {//官方dhl
          if(!$scope.oneWhereDhl){
            layer.msg('请选择')
            return
          }else{
            var diQu = '';
            if ($scope.oneWhereDhl=='shenZhen') {
              diQu = 'y';
            } else {
              diQu = '';
            }
          }
          erp.load();
          var updata = {};
          updata.orderNum = printIds;
          updata.logisticsName = "DHLGF#DHL不带电";
          updata.enName = 'DHL Official';
          updata.loginName = erpLoginName;
          console.log(JSON.stringify(updata))
          erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
            console.log(data)
            $scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
            if (data.data.result > 0) {
              var ids = {};
              ids.ids = printIds;
              ids.shenzhen = diQu;
              ids.loginName = erpLoginName;
              console.log(JSON.stringify(ids))
              erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
                console.log(data)
                layer.closeAll("loading")
                var result = data.data;
                $scope.sess = 0;//存储成功的个数
                $scope.error = 0;//存储失败的个数
                for (var i = 0; i < result.length; i++) {
                  $scope.sess += result[i].sess;
                  $scope.error += result[i].error;
                }

              }, function (data) {
                console.log(data)
                layer.closeAll("loading")
              })
            }
          }, function (data) {
            console.log(data)
            layer.closeAll("loading")
          })
        }
        $scope.hfmepackFun = function () {//含粉末E邮宝
          erp.load();
          var updata = {};
          updata.orderNum = printIds;
          updata.logisticsName = 'QHPTEUB' + '#' + '启昊莆田E邮宝' + '-' + 'E邮宝带电';
          updata.enName = 'epacket';
          updata.loginName = erpLoginName;
          console.log(JSON.stringify(updata))
          erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
            console.log(data)
            $scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
            if (data.data.result > 0) {
              var ids = {};
              ids.ids = printIds;
              ids.loginName = erpLoginName;
              console.log(JSON.stringify(ids))
              erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
                console.log(data)
                layer.closeAll("loading")
                var result = data.data;
                $scope.sess = 0;//存储成功的个数
                $scope.error = 0;//存储失败的个数
                for (var i = 0; i < result.length; i++) {
                  $scope.sess += result[i].sess;
                  $scope.error += result[i].error;
                }

              }, function (data) {
                console.log(data)
                layer.closeAll("loading")
              })
            }
          }, function (data) {
            console.log(data)
            layer.closeAll("loading")
          })
        }
        $scope.hcepackFun = function () {//含磁E邮宝
          erp.load();
          var updata = {};
          updata.orderNum = printIds;
          updata.logisticsName = 'SZEUB' + '#' + '深圳壹电商深圳E邮宝' + '-' + 'E邮宝带电';
          updata.enName = 'epacket';
          updata.loginName = erpLoginName;
          console.log(JSON.stringify(updata))
          erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
            console.log(data)
            $scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
            if (data.data.result > 0) {
              var ids = {};
              ids.ids = printIds;
              ids.loginName = erpLoginName;
              console.log(JSON.stringify(ids))
              erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
                console.log(data)
                layer.closeAll("loading")
                var result = data.data;
                $scope.sess = 0;//存储成功的个数
                $scope.error = 0;//存储失败的个数
                for (var i = 0; i < result.length; i++) {
                  $scope.sess += result[i].sess;
                  $scope.error += result[i].error;
                }

              }, function (data) {
                console.log(data)
                layer.closeAll("loading")
              })
            }
          }, function (data) {
            console.log(data)
            layer.closeAll("loading")
          })
        }
        $scope.gzepackFun = function () {//膏状E邮宝
          erp.load();
          var updata = {};
          updata.orderNum = printIds;
          updata.logisticsName = 'BJEUB' + '#' + '深圳壹电商北京E邮宝' + '-' + 'E邮宝带电';
          updata.enName = 'epacket';
          updata.loginName = erpLoginName;
          console.log(JSON.stringify(updata))
          erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
            console.log(data)
            $scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
            if (data.data.result > 0) {
              var ids = {};
              ids.ids = printIds;
              ids.loginName = erpLoginName;
              console.log(JSON.stringify(ids))
              erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
                console.log(data)
                layer.closeAll("loading")
                var result = data.data;
                $scope.sess = 0;//存储成功的个数
                $scope.error = 0;//存储失败的个数
                for (var i = 0; i < result.length; i++) {
                  $scope.sess += result[i].sess;
                  $scope.error += result[i].error;
                }

              }, function (data) {
                console.log(data)
                layer.closeAll("loading")
              })
            }
          }, function (data) {
            console.log(data)
            layer.closeAll("loading")
          })
        }
        $scope.uspsFun = function () {//usps
          if ($('.oneqd-sel4').val() == '请选择') {
            layer.msg('请选择物流渠道')
            return;
          }
          erp.load();
          var updata = {};
          updata.orderNum = printIds;
          updata.logisticsName = $('.oneqd-sel4').val();
          updata.enName = 'usps';
          updata.loginName = erpLoginName;
          console.log(JSON.stringify(updata))
          erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
            console.log(data)
            $scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
            if (data.data.result > 0) {
              var ids = {};
              ids.ids = printIds;
              ids.loginName = erpLoginName;
              console.log(JSON.stringify(ids))
              erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
                console.log(data)
                layer.closeAll("loading")
                var result = data.data;
                $scope.sess = 0;//存储成功的个数
                $scope.error = 0;//存储失败的个数
                for (var i = 0; i < result.length; i++) {
                  $scope.sess += result[i].sess;
                  $scope.error += result[i].error;
                }

              }, function (data) {
                console.log(data)
                layer.closeAll("loading")
              })
            }
          }, function (data) {
            console.log(data)
            layer.closeAll("loading")
          })
        }
        $scope.oneqtfsFun = function () {//其它物流方式

          erp.load();
          $scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
          var ids = {};
          ids.ids = printIds;
          ids.loginName = erpLoginName;
          console.log(JSON.stringify(ids))
          erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
            console.log(data)
            layer.closeAll("loading")
            var result = data.data;
            $scope.sess = 0;//存储成功的个数
            $scope.error = 0;//存储失败的个数
            for (var i = 0; i < result.length; i++) {
              $scope.sess += result[i].sess;
              $scope.error += result[i].error;
            }

          }, function (data) {
            console.log(data)
            layer.closeAll("loading")
          })
        }

        $scope.ddyzxbFun = function () {//带电邮政小包
          if ($('.oneqd-sel5').val() == '请选择') {
            layer.msg('请选择物流渠道')
            return;
          }
          erp.load();
          var updata = {};
          updata.orderNum = printIds;
          updata.logisticsName = $('.oneqd-sel5').val();
          updata.enName = 'China Post Registered Air Mail';
          updata.loginName = erpLoginName;
          console.log(JSON.stringify(updata))
          erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
            console.log(data)
            $scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
            if (data.data.result > 0) {
              var ids = {};
              ids.ids = printIds;
              ids.loginName = erpLoginName;
              console.log(JSON.stringify(ids))
              erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
                console.log(data)
                layer.closeAll("loading")
                var result = data.data;
                $scope.sess = 0;//存储成功的个数
                $scope.error = 0;//存储失败的个数
                for (var i = 0; i < result.length; i++) {
                  $scope.sess += result[i].sess;
                  $scope.error += result[i].error;
                }

              }, function (data) {
                console.log(data)
                layer.closeAll("loading")
              })
            }
          }, function (data) {
            console.log(data)
            layer.closeAll("loading")
          })
        }
        $scope.bdyzxbFun = function () {//不带电邮政小包
          if ($('.oneqd-sel6').val() == '请选择') {
            layer.msg('请选择物流渠道')
            return;
          }
          erp.load();
          var updata = {};
          updata.orderNum = printIds;
          updata.logisticsName = $('.oneqd-sel6').val();
          updata.enName = 'China Post Registered Air Mail';
          updata.loginName = erpLoginName;
          console.log(JSON.stringify(updata))
          erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
            console.log(data)
            $scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
            if (data.data.result > 0) {
              var ids = {};
              ids.ids = printIds;
              ids.loginName = erpLoginName;
              console.log(JSON.stringify(ids))
              erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
                console.log(data)
                layer.closeAll("loading")
                var result = data.data;
                $scope.sess = 0;//存储成功的个数
                $scope.error = 0;//存储失败的个数
                for (var i = 0; i < result.length; i++) {
                  $scope.sess += result[i].sess;
                  $scope.error += result[i].error;
                }

              }, function (data) {
                console.log(data)
                layer.closeAll("loading")
              })
            }
          }, function (data) {
            console.log(data)
            layer.closeAll("loading")
          })
        }
        $scope.uspsPlusFun = function () {//usps+ 传送订单
          erp.load();
          var updata = {};
          updata.orderNum = printIds;
          updata.logisticsName = 'Shipstation#Shipstation';
          updata.enName = 'USPS+';
          updata.loginName = erpLoginName;
          console.log(JSON.stringify(updata))
          erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
            console.log(data)
            $scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
            if (data.data.result > 0) {
              var ids = {};
              ids.ids = printIds;
              ids.loginName = erpLoginName;
              console.log(JSON.stringify(ids))
              erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
                console.log(data)
                layer.closeAll("loading")
                var result = data.data;
                $scope.sess = 0;//存储成功的个数
                $scope.error = 0;//存储失败的个数
                for (var i = 0; i < result.length; i++) {
                  $scope.sess += result[i].sess;
                  $scope.error += result[i].error;
                }

              }, function (data) {
                console.log(data)
                layer.closeAll("loading")
              })
            }
          }, function (data) {
            console.log(data)
            layer.closeAll("loading")
          })
        }
        $scope.uspsPluszzhFun = function () {//usps+ 获取追踪号订单
          erp.load();
          var updata = {};
          updata.orderNum = printIds;
          updata.logisticsName = 'Shipstation#Shipstation';
          updata.enName = 'USPS+';
          updata.loginName = erpLoginName;
          console.log(JSON.stringify(updata))
          erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
            console.log(data)
            $scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
            if (data.data.result > 0) {
              var ids = {};
              ids.ids = printIds;
              console.log(JSON.stringify(ids))
              erp.postFun2('getShipstationWaybillNumber.json', JSON.stringify(ids), function (data) {
                console.log(data)
                layer.closeAll("loading")
                var result = data.data;
                $scope.sess = 0;//存储成功的个数
                $scope.error = 0;//存储失败的个数
                for (var i = 0; i < result.length; i++) {
                  $scope.sess += result[i].sess;
                  $scope.error += result[i].error;
                }

              }, function (data) {
                console.log(data)
                layer.closeAll("loading")
              })
            }
          }, function (data) {
            console.log(data)
            layer.closeAll("loading")
          })
        }
        $scope.uspsPlusscydFun = function () {//usps+生成运单号
          erp.load()
          var ids = {};
          ids.ids = printIds;
          console.log(JSON.stringify(ids))
          erp.postFun2('createTrackNumber.json', JSON.stringify(ids), function (data) {
            console.log(data)
            $scope.onesuccscydnumflag = true;
            layer.closeAll("loading")
            var result = data.data;
            $scope.sess = result.sess;//存储成功的个数
            $scope.error = result.error;//存储失败的个数

          }, function (data) {
            console.log(data)
            layer.closeAll("loading")
          })
        }
        $scope.ytFun = function () {//带电E邮宝
          if ($('.oneqd-sel10').val() == '请选择') {
            layer.msg('请选择物流渠道')
            return;
          }
          var whereTarget;
          if ($('.oneqd-sel10').val() == '请选择') {
            layer.msg('请选择物流渠道');
            return;
          } else if ($('.oneqd-sel10').val() == '深圳') {
            whereTarget = 'SZ'
          } else if ($('.oneqd-sel10').val() == '义乌') {
            whereTarget = 'YW'
          }
          var updata = {};
          updata.orderNum = printIds;
          updata.logisticsName = whereTarget;
          updata.enName = 'yuntu';
          updata.loginName = erpLoginName;
          console.log(JSON.stringify(updata))
          erp.postFun('app/erplogistics/updateOrderLogistic', JSON.stringify(updata), function (data) {
            console.log(data)
            $scope.onesuccscydnumflag = true;//单独操作生成运单号成功失败的提示框
            if (data.data.result > 0) {
              var ids = {};
              ids.ids = printIds;
              ids.loginName = erpLoginName;
              console.log(JSON.stringify(ids))
              erp.postFun2('createWaybillNumber.json', JSON.stringify(ids), function (data) {
                console.log(data)
                layer.closeAll("loading")
                var result = data.data;
                $scope.sess = 0;//存储成功的个数
                $scope.error = 0;//存储失败的个数
                for (var i = 0; i < result.length; i++) {
                  $scope.sess += result[i].sess;
                  $scope.error += result[i].error;
                }

              }, function (data) {
                console.log(data)
                layer.closeAll("loading")
              })
            }
          }, function (data) {
            console.log(data)
            layer.closeAll("loading")
          })
        }
    }
    //请求物流渠道
    erp.postFun('app/erplogistics/getLogisticschannel', null, function (data) {
      console.log(data)
      $scope.wlqdArr = data.data;
      $scope.allepackArr = [];//存储所有E邮宝
      $scope.ddepackArr = [];//存储带电E邮宝的数组
      $scope.bdepackArr = [];//存储不带电E邮宝
      $scope.uspsArr = [];//存储物流方式为usps的数组
      $scope.ddyzxbArr = [];//存储带电邮政小包
      $scope.bdyzxbArr = [];//存储不带电邮政小包
      $scope.cjNorArr = [];//存储顺丰
      for (var i = 0; i < $scope.wlqdArr.length; i++) {
        if ($scope.wlqdArr[i].nameen == "ePacket") {
          $scope.allepackArr.push($scope.wlqdArr[i])
          if ($scope.wlqdArr[i].mode.indexOf('不带电') >= 0) {
            $scope.bdepackArr.push($scope.wlqdArr[i]);
          }
          else {
            $scope.ddepackArr.push($scope.wlqdArr[i]);
          }
        } else if ($scope.wlqdArr[i].nameen == "USPS") {
          $scope.uspsArr.push($scope.wlqdArr[i])
        } else if ($scope.wlqdArr[i].nameen == "China Post Registered Air Mail") {
          if ($scope.wlqdArr[i].mode.indexOf('不带电') >= 0) {
            $scope.bdyzxbArr.push($scope.wlqdArr[i]);
          } else {
            $scope.ddyzxbArr.push($scope.wlqdArr[i]);
          }
        } else if ($scope.wlqdArr[i].nameen == "CJ Normal Express") {
          $scope.cjNorArr.push($scope.wlqdArr[i])
        }
      }
    }, function (data) {
      console.log(data)
    })
    // 关联供应商
    $scope.conSupplier = function (item,index) {
      console.log(item.gongyingshang)
      if (!item.gongyingshang) {
        layer.msg('请选择供应商');
        return
      }
      erp.postFun('caigou/soufeel/updateIndividuationSupplier',JSON.stringify({
        cjproductId: item.cjproductId,
        cjorderId: item.cjorderId,
        gysid: item.gongyingshang.id
      }), function (data) {
        var data = data.data;
        console.log(data);
        if (data.statusCode==200) {
          layer.msg('关联成功');
          $scope.list.splice(index,1);
        } else {
          layer.msg('关联失败');
        }
      });
    }
	}])
	app.controller('pod-supplier-list-control',['$scope','erp', function ($scope, erp) {
		console.log('pod-supplier-list-control')
		$scope.pageSize = '20';
    $scope.pageNum = '1';
    $scope.search = '';
    $scope.totalNum = 0;
    $scope.totlaPage = 0
    $scope.status = '';
    $scope.numMap = {};
    function getList () {
      erp.loadPercent($('.table-box'), 600);
      erp.postFun('caigou/dzgongyingshangpin/listgys',JSON.stringify({
        pageSize: $scope.pageSize,
        page: $scope.pageNum,
        gsm:  $scope.search
        // searchKey: $scope.search,
        // status: $scope.status
      }), function (data) {
        erp.closeLoadPercent($('.table-box'));
        var data = data.data
        console.log(data);
        if (data.statusCode == 200) {
          $scope.list = data.result.listgys;
          $scope.totalNum = data.result.count;
          if ($scope.totalNum == 0) {
              erp.addNodataPic($('.table-box'), 600);
              return
          }
          erp.removeNodataPic($('.table-box'));
          $scope.totlaPage = Math.ceil($scope.totalNum/($scope.pageSize *1));
          pageFun($scope, function (n) {
            $scope.pageNum = n + '';
            getList();
          });
        }
      });
    }
    getList();
    $scope.showConlist = function (item) {
      $scope.showConlistFlag = true;
      $scope.tanItem = item;
      getTanList();
    }
    $scope.searchFun = function () {
        getList();
    }
    $scope.enterSearch = function (e) {
        if (e.keyCode == 13) {
            getList();
        }
    }
    $scope.chanPageSize = function () {
      $scope.pageNum = '1';
      getList();
    }
    $scope.chanPageNum = function () {
      if ($scope.topagenum * 1 > $scope.totlaPage) return;
      $scope.pageNum = $scope.topagenum;
      getList();
    }
    $scope.chanStatus = function (status) {
      $scope.status = status;
      getList();
    }
    $scope.pageSizeTan = '7';
    $scope.pageNumTan = '1';
    $scope.totalNumTan = 0;
    $scope.totlaPageTan = 0
    function getTanList () {
      erp.loadPercent($('.table-box-tan'), 500);
      erp.postFun('caigou/dzsupplier/listGysp',JSON.stringify({
        pageSize: $scope.pageSizeTan,
        page: $scope.pageNumTan,
        id: $scope.tanItem.id
      }), function (data) {
        erp.closeLoadPercent($('.table-box-tan'));
        var data = data.data
        console.log(data);
        if (data.statusCode == 200) {
          var shangpinList = data.result.shangpinList;
          for (var i = 0; i < shangpinList.length; i++) {
            shangpinList[i].ZiDongPaiDan = shangpinList[i].ZiDongPaiDan + '';
            if (shangpinList[i].youXianJi * 1 >= 0) {
              shangpinList[i].youXianJi = shangpinList[i].youXianJi + '';
            } else {
              shangpinList[i].youXianJi = '';
            }
            if (shangpinList[i].caiGouPrice * 1 >= 0) {
              shangpinList[i].caiGouPrice = shangpinList[i].caiGouPrice + '';
            } else {
              shangpinList[i].caiGouPrice = '';
            }
          }
          $scope.tanList = shangpinList;
          $scope.tanListOri = JSON.parse(JSON.stringify($scope.tanList));
          $scope.totalNumTan = data.result.count;
          if ($scope.totalNumTan == 0) {
              erp.addNodataPic($('.table-box-tan'), 500);
              return
          }
          erp.removeNodataPic($('.table-box-tan'));
          $scope.totlaPageTan = Math.ceil($scope.totalNumTan/($scope.pageSizeTan *1));
          pageFunTan($scope, function (n) {
            $scope.pageNum = n + '';
            getTanList();
          });
        }
      });
    }
    $scope.updateConPro = function (item, updataItem, index) {
      if (updataItem=='cancelConnect') {
        $scope.guanLianFlag = true;
        $scope.itemId = item.id;
        $scope.itemIndex = index;
      } else {
        var update = {};
        update.id = item.id;
        update[updataItem] = item[updataItem];
        erp.postFun('caigou/dzgongyingshangpin/xgShangpin',JSON.stringify(update), function (data) {
          var data = data.data
          console.log(data);
          if (data.statusCode==200) {
            $scope.tanListOri[index][updataItem] = item[updataItem];
            if(updataItem=='caiGouPrice'){
              layer.msg('保存成功');
            }
          } else {
            layer.msg('操作失败');
            item[updataItem] = $scope.tanListOri[index][updataItem];
          }
        });
      }
    }
    $scope.quXiaoGuanLian = function(){
      erp.postFun('caigou/dzgongyingshangpin/xgShangpin',JSON.stringify({
        id: $scope.itemId,
        status: '2'
      }), function (data) {
        var data = data.data
        console.log(data);
        if (data.statusCode==200) {
          $scope.tanList.splice($scope.itemIndex,1);
          $scope.totlaPageTan--;
          $scope.tanListOri = JSON.parse(JSON.stringify($scope.tanList));
          $scope.guanLianFlag = false;
        } else {
          layer.msg('操作失败');
        }
      });
    }
	}])
	app.controller('pod-ord-link-suplier-list-control',['$scope',function ($scope) {
		console.log('pod-ord-link-suplier-list-control')
		$scope.pageSize = '20';
	}])
	app.controller('pod-print-sheet-control',['$scope',function ($scope) {
		console.log('pod-print-sheet-control')
		$scope.pageSize = '20';
	}])
	app.controller('pod-supplier-product-review-control',['$scope','erp',function ($scope, erp) {
		console.log('pod-supplier-product-review-control')
		$scope.pageSize = '20';
		$scope.pageNum = '1';
		$scope.search = '';
		$scope.totalNum = 0;
		$scope.totlaPage = 0
		$scope.status = '0';
		$scope.numMap = {};
		function getList () {
			erp.loadPercent($('.table-box'), 600);
			erp.postFun('caigou/dzsupplier/list',JSON.stringify({
				pageSize: $scope.pageSize,
				page: $scope.pageNum,
				searchKey: $scope.search,
				status: $scope.status
			}), function (data) {
				erp.closeLoadPercent($('.table-box'));
				var data = data.data
				console.log(data);
				if (data.statusCode == 200) {
					$scope.list = data.result.zhanghuList;
					$scope.totalNum = data.result.count;
					if ($scope.status == '0') {
						$scope.numMap['0'] = data.result.count;
						$scope.numMap['2'] = data.result.otherCount;
					}
					if ($scope.status == '2') {
						$scope.numMap['0'] = data.result.otherCount;
						$scope.numMap['2'] = data.result.count;
					}
					if ($scope.totalNum == 0) {
              erp.addNodataPic($('.table-box'), 600);
              return
          }
          erp.removeNodataPic($('.table-box'));
          $scope.totlaPage = Math.ceil($scope.totalNum/($scope.pageSize *1));
					pageFun($scope, function (n) {
						$scope.pageNum = n + '';
						getList();
					});
				}
			});
		}
		getList();
		$scope.searchFun = function () {
        getList();
    }
    $scope.enterSearch = function (e) {
        if (e.keyCode == 13) {
            getList();
        }
    }
    $scope.chanPageSize = function () {
    	$scope.pageNum = '1';
    	getList();
    }
    $scope.chanPageNum = function () {
    	if ($scope.topagenum * 1 > $scope.totlaPage) return;
    	$scope.pageNum = $scope.topagenum;
    	getList();
    }
    $scope.chanStatus = function (status) {
    	$scope.status = status;
    	getList();
    }
    $scope.pass = function (item,index) {
    	var remark = angular.element('.table-box tr').eq(index+1).find('.shenheyijian0').html();
    	erp.postFun('caigou/dzsupplier/erpaudit',JSON.stringify({
    		id: item.id,
    		status: '1',
    		remark: remark
    	}),function (data) {
    		var data = data.data
    		console.log(data);
    		if (data.statusCode == 200) {
    			layer.msg('操作成功');
    			$scope.list.splice(index,1);
    			$scope.totalNum--;
    			$scope.numMap['0']--;
    		} else if(data.statusCode == 401){
          layer.msg(data.message);
        } else {
    			layer.msg('操作失败');
    		}
    	});
    }
    $scope.nopass = function (item,index) {
    	console.log(angular.element('.table-box tr'));
    	var remark = angular.element('.table-box tr').eq(index+1).find('.shenheyijian0').html();
    	if (!remark || remark == '<br />') {
    		layer.msg('请填写审核意见');
    		return;
    	}
    	erp.postFun('caigou/dzsupplier/erpaudit',JSON.stringify({
    		id: item.id,
    		status: '2',
    		remark: remark
    	}),function (data) {
    		var data = data.data
    		console.log(data);
    		if (data.statusCode == 200) {
    			layer.msg('操作成功');
          angular.element('.table-box tr').eq(index+1).find('.shenheyijian0').html('');
    			$scope.list.splice(index,1);
    			$scope.totalNum--;
    			$scope.numMap['0']--;
    			$scope.numMap['2']++;
    		} else {
    			layer.msg('操作失败');
    		}
    	});
    }
	}])
	//分页
  function pageFun($scope, pagechange) {
      $("#pagination1").jqPaginator({
          totalCounts: $scope.totalNum,
          pageSize: $scope.pageSize * 1,
          visiblePages: 5,
          currentPage: $scope.pageNum * 1,
          activeClass: 'current',
          first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
          prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
          next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
          last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
          page: '<a href="javascript:void(0);">{{page}}<\/a>',
          onPageChange: function (n,type) {
            if (type=='init') return;
            pagechange(n);
          }
      });
  }
  function pageFunTan($scope, pagechange) {
      $("#pagination2").jqPaginator({
          totalCounts: $scope.totalNumTan,
          pageSize: $scope.pageSizeTan * 1,
          visiblePages: 5,
          currentPage: $scope.pageNumTan * 1,
          activeClass: 'current',
          first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
          prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
          next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
          last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
          page: '<a href="javascript:void(0);">{{page}}<\/a>',
          onPageChange: function (n,type) {
            if (type=='init') return;
            pagechange(n);
          }
      });
  }
})()