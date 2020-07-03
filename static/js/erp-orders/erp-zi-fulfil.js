(function () {
  var app = angular.module('custom-fulfil-app', ['service']);
  app.controller('custom-zifulfil-controller', ['$scope', '$http', 'erp', '$routeParams', '$compile', '$timeout', function ($scope, $http, erp, $routeParams, $compile, $timeout) {
		$scope.showStoreName = erp.showStoreName
		var muId = '';
    // var muordstu = '';
    var bs = new Base64();
    // var nowTime = new Date().getTime();
    // var localuspsTime = localStorage.getItem('uspsTime') == undefined ? '' : localStorage.getItem('uspsTime');
	// var getCsObj = localStorage.getItem('ziCs') == undefined ? '' : JSON.parse(localStorage.getItem('ziCs'));
	const job = localStorage.getItem('job') ? bs.decode(localStorage.getItem('job')) : '';
    var erpLoginName = bs.decode(localStorage.getItem('erploginName') == undefined ? '' : localStorage.getItem('erploginName'));
    $scope.isAnalysis=false;
    //履行列表
    $scope.selstu = 3;
    $scope.pageNum = 1;
    $scope.pageSize = '100';
    $scope.store = 0;
    $scope.isSelJqcz = '业务员';
    $scope.erpordTnum = 0;      //存储订单的条数
    $scope.storeNumFlag = false;
    $scope.fulfilStatus = '';
    $scope.ordType = '';
	$('#page-sel').val('100');
	const tongBuAdminFlagArr = ['admin', '虞雅婷', '刘思梦', '金仙娟', '王波', '赵炜', '石晶', '刘依', '张俊佩', '赵珍珍', '叶璐云', '杨梦琴', '陆昌兰', '李铭辉', '张文靖', '王月', '金晓霞', '徐群群', '郑跃飞', '朱燕', '赵炜', '吴梦茹', '方丁丁', '杨艳芬', '洪颖锐', '盛超', '陈小琴', '打单1', '唐贵花']
	$scope.tongBuAdminFlag = ['打单'].includes(job) || tongBuAdminFlagArr.includes(erpLoginName)
	
    if (erpLoginName=='admin'||erpLoginName=='金仙娟'||erpLoginName=='李贞'||erpLoginName=='刘依') {
			$scope.cxclAdminShowFlag = true;
		} else {
			$scope.cxclAdminShowFlag = false;
		}

		$scope.storeList = window.warehouseList
    //义乌 深圳 美国
		$scope.storeFun = function (ev, num) {
      $scope.store = num;
			if ($(ev.target).hasClass('two-ck-activebtn')) {
				$(ev.target).removeClass('two-ck-activebtn')
				$scope.store = '';
				localStorage.removeItem('store')
			} else {
				$('.two-ck-btn').removeClass('two-ck-activebtn')
				$(ev.target).addClass('two-ck-activebtn');
				localStorage.setItem('store', 0)
			}
      getNumFun();
      getOrdListFun()
			$scope.storeNumFlag = false;
			if($scope.isSelJqcz=='母订单号'){
				$scope.storeNumFlag = true;
			}
			if(muId||$scope.storeNumFlag){
				var inpVal = $.trim($('.c-seach-inp').val())
				if(inpVal){
					getMuNumFun(inpVal,$scope.store)
				} else {
					getMuNumFun(muId,$scope.store)
				}
			}
    }
    //按时间搜索
		//erp开始日期搜索
		$("#c-data-time").click(function () {
			var erpbeginTime = $("#c-data-time").val();
			var interval = setInterval(function () {
				var endtime2 = $("#c-data-time").val();
				if (endtime2 != erpbeginTime) {
					clearInterval(interval);
					$scope.pageNum = 1;
					getOrdListFun()
				}
			}, 100)
		});
		//erp结束日期搜索
		$("#cdatatime2").click(function () {
			var erpendTime = $("#cdatatime2").val();
			var interval = setInterval(function () {
				var endtime2 = $("#cdatatime2").val();
				if (endtime2 != erpendTime) {
					clearInterval(interval);
					$scope.pageNum = 1;
					getOrdListFun()
				}
			}, 100)
    });
    // 订单下拉筛选
    $scope.selOrdTypeFun = function(){
			$scope.pageNum = 1;
			getOrdListFun()
		}
	// 同步失败
	$scope.defeated = function(list) {
		let arr = [], curr = 0, status = false, imgs;
		for(let i = 0; i < list.length; i++) {
		  imgs = $('#c-zi-ord').find('.c-ord-tbody').eq(i).find('tr').eq(0).find('td').eq(0).find('.cor-check-box').attr('src');
		  if (imgs.indexOf('multiple2') > 0) {
			curr++;
			if (list[i].order.fulfillmentStatus == 3) {
			  arr.push(list[i].order.ID);
			} else {
			  status = true
			}
		  }
		}
		if (curr < 1) {
		  layer.msg('至少要选中一项')
		} else if (status) {
		  layer.msg('必须是履行失败')
		}else {
		  erp.postFun('app/order/fulfillmentErrorSendEmail', JSON.stringify({ids: arr.join(',')}), function (res) {
			if (res.data.statusCode === '200') {
			  layer.msg('邮件发送成功')
			  getOrdListFun();
			} else {
			  layer.msg('邮件发送失败')
			}
		  })
		}
	}
    // $scope.defeated = function(list) {
    //   let arr = [], curr = 0, status = false, imgs;
    //   for(let i = 0; i < list.length; i++) {
    //     imgs = $('#c-zi-ord').find('.c-ord-tbody').eq(i).find('tr').eq(0).find('td').eq(0).find('.cor-check-box').attr('src');
    //     if (imgs.indexOf('multiple2') > 0) {
    //       curr++;
    //       if (list[i].order.fulfillmentStatus == 3) {
    //         arr.push(list[i].order.ID);
    //       } else {
    //         status = true
    //       }
    //     }
    //   }
    //   if (curr < 1) {
    //     layer.msg('至少要选中一项')
    //   } else if (status) {
    //     layer.msg('必须是履行失败')
    //   }else {
    //     erp.postFun('processOrder/fulfilOrder/fulfillmentErrorSendEmail', JSON.stringify({ids: arr}), function (res) {
    //       if (res.data.code === '200') {
    //         layer.msg('邮件发送成功')
    //         getOrdListFun();
    //       } else {
    //         layer.msg('邮件发送失败')
    //       }
    //     })
    //   }
    // }
    var that = this;
		// /*查看日志*/
		$scope.isLookLog = false;
		$scope.LookLog = function (No,ev) {
      $scope.isLookLog = true;
      that.no = No;
      ev.stopPropagation()
    }
    $scope.$on('log-to-father',function (d,flag) {
        if (d && flag) {
            $scope.isLookLog = false;
            $scope.gxhOrdFlag = false;
            $scope.gxhProductFlag = false;
        }
    })
    $scope.openZZC2 = function(list,e,type){
      $scope.gxhOrdFlag = true;
      that.pro = list;
      that.type = type;
      e.stopPropagation()
    }
    $scope.openZZC = function(list,e,type){
      $scope.gxhProductFlag = true;
      that.pro = list;
      that.type = type;
      e.stopPropagation()
    }
    //给子订单里面的订单添加选中非选中状态
		var cziIndex = 0;
		$('#c-zi-ord').on('click', '.cor-check-box', function () {
			if ($(this).attr('src') == 'static/image/order-img/multiple1.png') {
        $(this).attr('src', 'static/image/order-img/multiple2.png')
				cziIndex++;
				if (cziIndex == $('#c-zi-ord .cor-check-box').length) {
					$('#c-zi-ord .c-checkall').attr('src', 'static/image/order-img/multiple2.png');
				}
			} else {
        $(this).attr( 'src', 'static/image/order-img/multiple1.png')
				cziIndex--;
				if (cziIndex != $('#c-zi-ord .cor-check-box').length) {
					$('#c-zi-ord .c-checkall').attr('src', 'static/image/order-img/multiple1.png');
				}
			}
		})
		//全选
		$('#c-zi-ord').on('click', '.c-checkall', function () {
			if ($(this).attr('src') == 'static/image/order-img/multiple1.png') {
				$(this).attr('src', 'static/image/order-img/multiple2.png');
				cziIndex = $('#c-zi-ord .cor-check-box').length;
				$('#c-zi-ord .cor-check-box').attr('src', 'static/image/order-img/multiple2.png');
			} else {
				$(this).attr('src', 'static/image/order-img/multiple1.png');
				cziIndex = 0;
				$('#c-zi-ord .cor-check-box').attr('src', 'static/image/order-img/multiple1.png');
			}
    })
    //鼠标划过事件
		//点击事件
		$('.orders-table').on('click', '.erporder-detail', function (event) {
			if ($(event.target).hasClass('cor-check-box') || $(event.target).hasClass('qtcz-sel') || $(event.target).hasClass('stop-prop')) {
				return;
			}
			if ($(this).hasClass('order-click-active')) {
				$(this).next().hide();
				$(this).removeClass('order-click-active');
				//$('.orders-table .erporder-detail').removeClass('order-click-active');
			} else {
				//$('.orders-table .erpd-toggle-tr').hide();//隐藏所有的商品
				$(this).next().show();
				//$('.orders-table .erporder-detail').removeClass('order-click-active');
				$(this).addClass('order-click-active');
      }
    })
		$('.orders-table').on('mouseenter', '.ordlist-fir-td', function () {
			// $(this).parent('.erporder-detail').next().hide();
			if ($(this).parent('.erporder-detail').next().hasClass('erporder-detail-active')) {
				$(this).parent('.erporder-detail').next().show()
			} else {
				$(this).parent('.erporder-detail').next().hide()
			}
		})
		$('.orders-table').on('mouseenter', '.moshow-sp-td', function () {
			$(this).parent('.erporder-detail').next().show();
			$('.orders-table .erporder-detail').removeClass('erporder-detail-active');
			$(this).parent('.erporder-detail').addClass('erporder-detail-active');
		})
		$('.orders-table').on('mouseleave', '.erporder-detail', function () {
			// $(this).next().hide();
			if ($(this).hasClass('order-click-active')) {
				$(this).next().show();
			} else {
				$(this).next().hide();
			}
		})
		$('.orders-table').on('mouseenter', '.erpd-toggle-tr', function () {
			$(this).show();
		})
		$('.orders-table').on('mouseleave', '.erpd-toggle-tr', function () {
			// $(this).hide();
			if ($(this).prev().hasClass('order-click-active')) {
				$(this).show();
			} else {
				$(this).hide();
			}
		})
		$('.orders-table').mouseleave(function () {
			$('.orders-table .erporder-detail').removeClass('erporder-detail-active');
    })
    //批量同步至店铺 -- 履行列表
    var tbcsArr;
	$scope.BatchSynchronization = function(list){
      let arr = [], curr = 0, status = false, imgs;
      for(let i = 0; i < list.length; i++) {
        imgs = $('#c-zi-ord').find('.c-ord-tbody').eq(i).find('tr').eq(0).find('td').eq(0).find('.cor-check-box').attr('src');
        if (imgs.indexOf('multiple2') > 0) {
          curr++;
          if (list[i].order.fulfillmentStatus == 0 || list[i].order.fulfillmentStatus == 2) {
            arr.push(list[i].order.ID);
          } else {
            status = true
          }
        }
      }
      if (curr < 1) {
        layer.msg('请先选择等待履行状态的订单')
      } else if (status) {
        layer.msg('只有等待履行状态的订单才可操作')
      }else {
        tbcsArr = arr;
        $scope.isTongBuFlag = true;
      }


			// var arr = [];
			// var isSelect = false;
      // $('#c-zi-ord .cor-check-box').each(function () {
      //   if (imgs.indexOf('multiple2') > 0) {
      //     curr++;
      //     if (list[i].order.fulfillmentStatus == 3) {
      //       arr.push(list[i].order.ID);
      //     } else {
      //       status = true
      //     }
      //   }
      //   if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
      //     var type = $(this).attr('data-type');
      //     var id = $(this).attr('data-id');
      //     isSelect = true;
      //     if(type !== '0'){
      //       layer.msg('只有等待履行状态的订单才可操作');
      //       return false;
      //     }else {
      //       arr.push(id)
      //     }
      //   }
      // })
			// if(!isSelect){
      //   layer.msg('请先选择等待履行状态的订单');
			// 	return;
      // }
			// if(arr.length>0){
			// 	var data = {
      //     ids:arr.join(',')
			// 	};
        // erp.postFun('fulfillment/activeFulfillment', data, function (res) {
        //   if (res.data.statusCode == 200) {
        //     layer.msg('同步成功');
        //     $scope.fulfillment = '1';
        //     getOrdListFun();
        //   }
        // }, function (err) {
        //     layer.msg('系统异常')
        // })
      // }
		}
		//同步至店铺 -- 履行列表
		$scope.Synchronization = function(item){
      var data = {
        ids:item.ID
      };
      erp.postFun('fulfillment/activeFulfillment', data, function (res) {
        if (res.data.statusCode == 200) {
            layer.msg('同步成功');
            $scope.fulfillment = '1';
            getOrdListFun();
        }
      }, function (err) {
        layer.msg('系统异常')
      })
    }
    $scope.sureTongBuFun = function(){
    	console.log(tbcsArr)
    	erp.postFun('fulfillment/activeFulfillment', {ids: tbcsArr.join(',')}, function (res) {
    	  if (res.data.statusCode == 200) {
    	    layer.msg('同步成功');
    	    $scope.isTongBuFlag=false;
    	    $scope.fulfillment = '1';
    	    getOrdListFun();
    	  }
    	}, function (err) {
    	    layer.msg('系统异常')
    	})
    }
    $scope.curTime = new Date().getTime();
    $scope.dayFun = function (day1, day2) {
			return Math.ceil((day2 - day1) / 86400000)
    }
    //编辑弹框
		$scope.editFlag = false;
		$scope.editFun = function (item, $event, index) {
			$scope.itemIndex = index;
			$event.stopPropagation();
			$scope.editFlag = true;
			$scope.itemData = item;
			$scope.customerName = item.CUSTOMER_NAME;
			$scope.countryCode = item.COUNTRY_CODE;
			$scope.province = item.PROVINCE;
			$scope.city = item.CITY;
			$scope.shipAddress1 = item.SHIPPING_ADDRESS;
			$scope.shipAddress2 = item.shippingAddress2;
			$scope.zip = item.ZIP;
			$scope.phone = item.PHONE;
			$scope.logisticName = item.LOGISTIC_NAME;
			$scope.eMail = item.email;
    }
    //取消按钮
		$scope.closeFun = function () {
			$scope.editFlag = false;
		}
		//确定按钮
		$scope.confirmEditFun = function () {
			// erp.load();
			if($scope.countryCode&&$scope.countryCode.length>2){
				layer.msg('请填写二字简码')
				return
			}
			var pushData = {};
			pushData.id = $scope.itemData.ID;
			pushData.salesman = $scope.itemData.salesman;
			pushData.customerName = $scope.customerName;
			pushData.country = $scope.countryName||'';
			pushData.countryCode = $scope.countryCode;
			pushData.province = $scope.province;
			pushData.city = $scope.city;
			pushData.shipAddress1 = $scope.shipAddress1;
			pushData.shipAddress2 = $scope.shipAddress2;
			pushData.zip = $scope.zip;
			pushData.phone = $scope.phone;
			pushData.logisticName = $scope.logisticName;
			pushData.email = $scope.eMail;
			erp.postFun('app/order/updateERPOrder', JSON.stringify(pushData), function (data) {
				layer.closeAll("loading")
				$scope.editFlag = false;
				if (data.data.result == 1) {
					layer.msg('修改成功')
					$scope.erporderList[$scope.itemIndex].order.CUSTOMER_NAME = $scope.customerName;
					$scope.erporderList[$scope.itemIndex].order.COUNTRY_CODE = $scope.countryCode;
					$scope.erporderList[$scope.itemIndex].order.PROVINCE = $scope.province;
					$scope.erporderList[$scope.itemIndex].order.CITY = $scope.city;
					$scope.erporderList[$scope.itemIndex].order.SHIPPING_ADDRESS = $scope.shipAddress1;
					$scope.erporderList[$scope.itemIndex].order.shippingAddress2 = $scope.shipAddress2;
					$scope.erporderList[$scope.itemIndex].order.ZIP = $scope.zip;
					$scope.erporderList[$scope.itemIndex].order.PHONE = $scope.phone;
				} else {
					layer.msg('修改失败')
				}
			}, function (data) {
				layer.closeAll("loading")
				layer.msg('修改响应失败')
			})
    }
    // 履行下拉表筛选
    $scope.selfulfilStatus = function () {
      $scope.pageNum = 1;
      getOrdListFun()
    }
    // 客户订单数据分析
    $scope.openAnalysis=function(id,name){
			//$('.khzzc').show();
			$scope.isAnalysis=true;
			that.no = {
				id:id,
				name:name
			};
			that.username=name;
    };
    $scope.$on('log-to-father',function (d,flag) {
			// {closeFlag: false}
			if (d && flag) {
				$scope.isAnalysis = false;
			}
    })
    $scope.editFlag = false;
    //客户订单数据取消按钮
		$scope.closeFun = function () {
			$scope.editFlag = false;
    }
    $scope.lrFun = function (item, ev, index) {
			// ev.stopPropagation();
			// var $lrbtnObj = $(ev.target);
			// $lrbtnObj.hide();
			// $lrbtnObj.siblings().show();
			$scope.lrIndex = index;
			$scope.lrId = item.ID;
			$scope.zzhChaFlag = true;
		}
    //编辑sku
		$scope.bjSkuFun = function (ev) {
			$(ev.target).hide();//把自己隐藏掉
			$(ev.target).siblings('.bj-spsku').removeAttr('disabled');
			// $('#c-zi-ord .edit-inp').removeAttr('disabled');
			$(ev.target).siblings('.bjsame-btn').show();
		}
    //编辑海关号
		$scope.bjHghFun = function (ev) {
			$(ev.target).hide();//把自己隐藏掉
			$(ev.target).siblings('.bj-spsku').removeAttr('disabled');
			$(ev.target).siblings('.bjsame-btn').show();
    }
    $scope.bjSkuQxFun = function (ev) {
			//隐藏保存 取消的按钮
			$(ev.target).parent().find('.bjsame-btn').hide();
			//显示编辑按钮
			$(ev.target).siblings('.xg-spskubtn').show();
			var skuText = $(ev.target).siblings('.spsku-text').text();
			//获取隐藏域中的值填入输入框
			$(ev.target).siblings('.bj-spsku').val(skuText);
			//给这条商品设置禁止输入
			$(ev.target).siblings('.bj-spsku').attr('disabled', 'true');
		}
    $scope.bjSkuSureFun = function (ev, item) {
			var bjSkuInpVal = $.trim($(ev.target).siblings('.bj-spsku').val());
			//var id = item.CJOrderId;
			var upData = {};
			upData.id = item.ID;
			upData.sku = bjSkuInpVal;
			var senData={
				ids:item.CJOrderId
			}
			// return;
			erp.postFun('app/order/shifangkucun',JSON.stringify(senData),function(data){
				erp.postFun('app/order/updateSku', JSON.stringify(upData), function (data) {
					if (data.data.result == 1) {
						erp.closeLoad();
						layer.msg('修改成功')
						$(ev.target).siblings('.spsku-text').text(bjSkuInpVal);
						//显示编辑按钮
						$(ev.target).siblings('.xg-spskubtn').show();
						//隐藏保存 取消的按钮
						$(ev.target).parent().find('.bjsame-btn').hide();
						//给这条商品设置禁止输入
						$(ev.target).siblings('.bj-spsku').attr('disabled', 'true');
					} else {
						erp.closeLoad();
						layer.msg('保存失败')
					}
				}, function (data) {
					erp.closeLoad();
					console.log(data)
				});
			},function(){
				erp.closeLoad();
			});

		}
    $scope.bjHghQxFun = function (ev) {
			//隐藏保存 取消的按钮
			$(ev.target).parent().find('.bjsame-btn').hide();
			//显示编辑按钮
			$(ev.target).siblings('.xg-spskubtn').show();
			var skuText = $(ev.target).siblings('.spsku-text').text();
			//获取隐藏域中的值填入输入框
			$(ev.target).siblings('.bj-spsku').val(skuText);
			//给这条商品设置禁止输入
			$(ev.target).siblings('.bj-spsku').attr('disabled', 'true');
    }
    // 上传
    $scope.upLoadImg4 = function (files) {
			erp.ossUploadFile($('#file')[0].files, function (data) {
				console.log(data)
				if (data.code == 0) {
					layer.msg('Upload Failed');
					return;
				}
				if (data.code == 2) {
					layer.msg('Upload Incomplete');
				}
				var result = data.succssLinks;
				var srcList = result[0].split('.');
				var fileName = srcList[srcList.length - 1].toLowerCase();
				console.log(fileName)
				if (fileName == 'pdf') {
					$scope.lrHref = result[0];
					$('#file').val('')
				} else {
					layer.msg('请上传pdf格式')
				}
				console.log(result)
				console.log($scope.lrHref)
				$scope.$apply();
			})
    }
    // 上传确定
    $scope.sureChaZzhFun = function () {
			erp.load();
			// var $lrbtnObj = $(ev.target);
			// var lrordId,inpVal;
			// lrordId = item.ID;
			// inpVal = $lrbtnObj.siblings('.zzh-inp').val();
			var lrData = {};
			lrData.logisticsNumber = $scope.lrzzhNum;
			lrData.id = $scope.lrId;
			lrData.href = $scope.lrHref;
			console.log(JSON.stringify(lrData))
			erp.postFun('app/order/upLogisticsNumber', JSON.stringify(lrData), function (data) {
				console.log(data)
				layer.closeAll("loading")
				$scope.zzhChaFlag = false;
				if (data.data.result > 0) {
					if ($scope.selstu == 1) {
						$scope.erporderList.splice($scope.lrIndex, 1);
						$scope.erpordTnum--;
						countMFun($scope.erporderList);
						layer.msg('添加追踪号成功')
					} else {
						layer.msg('修改追踪号成功')
						// $lrbtnObj.siblings('.lr-zzhbtn').siblings().hide();
						// $lrbtnObj.siblings('.lr-zzhbtn').show();
						// $lrbtnObj.siblings('.zzh-inp').val('');
						$scope.erporderList[$scope.lrIndex].order.TRACKINGNUMBER = $scope.lrzzhNum;
						$scope.erporderList[$scope.lrIndex].order.TRACKINGNUMBERHISTORY = $scope.lrzzhNum + ',' + $scope.erporderList[$scope.lrIndex].order.TRACKINGNUMBERHISTORY;
					}
					$scope.lrzzhNum = '';
					$scope.lrHref = '';
				} else {
					layer.msg('添加追踪号失败')
				}
			}, function (data) {
				layer.closeAll("loading")
				console.log(data)
			})
    }
    // 上传取消
    $scope.canLrFun = function () {
			$scope.zzhChaFlag = false;
			$scope.lrzzhNum = '';
			$scope.lrHref = '';
		}
		$scope.bjHghSureFun = function (ev, item) {
			var bjSkuInpVal = $.trim($(ev.target).siblings('.bj-spsku').val());
			// console.log(bjSkuInpVal)
			console.log(item)
			var id = item.ID;
			var upData = {};
			upData.id = id;
			upData.cjProductId = item.cjProductId;
			upData.entrycode = bjSkuInpVal;
			console.log(JSON.stringify(upData));
			// return;
			erp.postFun('app/order/updateEntryCode', JSON.stringify(upData), function (data) {
				console.log(data)
				if (data.data.result == 1) {
					erp.closeLoad();
					layer.msg('修改成功')
					$(ev.target).siblings('.spsku-text').text(bjSkuInpVal);
					//显示编辑按钮
					$(ev.target).siblings('.xg-spskubtn').show();
					//隐藏保存 取消的按钮
					$(ev.target).parent().find('.bjsame-btn').hide();
					//给这条商品设置禁止输入
					$(ev.target).siblings('.bj-spsku').attr('disabled', 'true');
				} else {
					erp.closeLoad();
					layer.msg('保存失败')
				}
			}, function (data) {
				erp.closeLoad();
				console.log(data)
			})
		}
    // 查看包装
		$scope.imgArr = [];
		$scope.packArr = [];
		$scope.ckBzFun = function(item,index,e){
			e.stopPropagation()
			$('#ckbz-box .check-box input').each(function(){
				$(this).prop('checked',false)
			})
			$scope.packArr = [];
			$scope.imgArr = [];
			$scope.bzFlag = true;
			$scope.zordItemId = item.ID;
			$scope.zordItemIndex = index;
			if(item.isPack){
				var packKey = item.pack?item.pack:[];
				var bzImgs = item.imgs?item.imgs:[];
				$scope.packArr = JSON.parse(JSON.stringify(packKey));
				$scope.imgArr = JSON.parse(JSON.stringify(bzImgs));
				$('#ckbz-box .check-box input').each(function(){
					for(var i = 0,len=packKey.length;i<len;i++){
						if(packKey[i]==$(this).attr('name')){
							$(this).prop('checked',true)
						}
					}
				})
			}
		}

    //复制参考号
    $scope.fzZdhFun = function (ev) {
			var fzVal = $(ev.target).siblings('.zdh-val')[0];
			console.log(fzVal)
			fzVal.select(); // 选中文本
			document.execCommand("copy"); // 执行浏览器复制命令
			layer.msg('复制成功')
    }
    //给报关名字做修改
		$scope.speditFun = function (item, $event) {
			$($event.target).hide();//把自己隐藏掉
			$($event.target).parent().siblings('.edit-inp').removeAttr('disabled');;
			$($event.target).siblings('.sp-par-p').show();
    }
    $scope.spcnsaveFun = function (item, $event) {
			erp.load();
			//获取中文报关名称
			var nameCn = $($event.target).parent().siblings('.edit-inp').val();
			// $scope.bgnameen = item.cjproductnameen;
			//获取英文报关名称
			//var nameEn = $($event.target).parent().parent().parent().siblings('.sp-sec-tr').children('.nameen-td').children('.edit-inp').val();
			var nameEn = item.cjproductnameen;
			var id = item.ID;
			// alert(nameCn+'==='+nameEn+'---'+id)
			var upData = {};
			upData.id = id;
			upData.type = 'cn';
			upData.nameen = nameEn;
			upData.namecn = nameCn;
			upData.cjProductId = item.cjProductId;
			// nameen,namecn,id
			console.log(upData)
			console.log(JSON.stringify(upData));
			// return;
			erp.postFun('app/order/updateEnterName', JSON.stringify(upData), function (data) {
				console.log(data)
				// erp.closeLoad();
				if (data.data.result == 1) {
					layer.msg('修改成功')
					$($event.target).parent().siblings('.hideinp-val').text(nameCn)
					erp.closeLoad();
					//显示编辑按钮
					$($event.target).siblings('.sp-cnedit-btn').show();
					//隐藏保存 取消的按钮
					$($event.target).siblings('.sp-par-p').hide();
					$($event.target).hide();
					//给这条商品设置禁止输入
					$($event.target).parent().siblings('.edit-inp').attr('disabled', 'true');

				} else {
					erp.closeLoad();
					layer.msg('保存失败')
				}
			}, function (data) {
				erp.closeLoad();
				console.log(data)
			})
    }
    $scope.spensaveFun = function (item, $event) {
			erp.load();
			//获取中文报关名称
			var nameCn = item.cjproductnamecn;
			//获取英文报关名称
			//var nameEn = $($event.target).parent().parent().parent().siblings('.sp-sec-tr').children('.nameen-td').children('.edit-inp').val();
			var nameEn = $($event.target).parent().siblings('.edit-inp').val();
			var id = item.ID;
			// alert(nameCn+'==='+nameEn+'---'+id)
			var upData = {};
			upData.id = id;
			upData.type = 'en';
			upData.nameen = nameEn;
			upData.namecn = nameCn;
			upData.cjProductId = item.cjProductId;
			// nameen,namecn,id
			console.log(upData)
			console.log(JSON.stringify(upData));
			// return;
			erp.postFun('app/order/updateEnterName', JSON.stringify(upData), function (data) {
				console.log(data)
				// erp.closeLoad();
				if (data.data.result == 1) {
					erp.closeLoad();
					layer.msg('保存成功')
					$($event.target).parent().siblings('.hideinp-val').text(nameEn)
					//显示编辑按钮
					$($event.target).siblings('.sp-cnedit-btn').show();
					//隐藏保存 取消的按钮
					$($event.target).siblings('.sp-par-p').hide();
					$($event.target).hide();
					//给这条商品设置禁止输入
					$($event.target).parent().siblings('.edit-inp').attr('disabled', 'true');

				} else {
					erp.closeLoad();
					layer.msg('保存失败')
				}
			}, function (data) {
				erp.closeLoad();
				console.log(data)
			})
		}
		$scope.spenqxFun = function (item, $event) {
			//显示编辑按钮
			$($event.target).siblings('.sp-cnedit-btn').show();
			//获取中文报关名称
			//var nameCn = $($event.target).parent().siblings('.hideinp-val').text();
			var nameEn = $($event.target).parent().siblings('.hideinp-val').text();
			//获取隐藏域中的值填入输入框
			// alert(nameCn+'==='+nameEn)
			$($event.target).parent().siblings('.edit-inp').val(nameEn);
			//$($event.target).parent().parent().parent().siblings('.sp-sec-tr').children('.nameen-td').children('.edit-inp').val(nameEn);
			//给这条商品设置禁止输入
			$($event.target).parent().siblings('.edit-inp').attr('disabled', 'true');
			//隐藏保存 取消的按钮
			$($event.target).siblings('.sp-par-p').hide();
			$($event.target).hide();
    }
    $scope.openZZC = function(list,e,type){
      $scope.gxhProductFlag = true;
      that.pro = list;
      that.type = type;
      e.stopPropagation()
    }
    // 履行列表数据
    function getOrdListFun() {
      erp.load();
      var erpData = {};
      erpData.trackingnumberType = 'all';
      erpData.status = '10';
      seltjFun(erpData);
      erpData.page = $scope.pageNum;
      erpData.limit = $scope.pageSize;
      erpData.ydh = 'y';
      erpData.fulfillment = '1';
      erpData.fulfillmentSign = '1';
      erpData.serarchPod = $scope.ordType;
      erpData.fulfillmentStatus = $scope.fulfilStatus;
      $scope.erporderList = [];
      erp.postFun('app/order/getERPShipmentsOrder', JSON.stringify(erpData), function (data) {
        layer.closeAll("loading")
        var erporderResult = data.data;//存储订单的所有数据
        $scope.erpordTnum = erporderResult.orderCount;
        $scope.erporderList = erporderResult.ordersList;
        if ($scope.erpordTnum < 1) {
          layer.msg('未找到订单')
        }
        getNumFun()
        countMFun($scope.erporderList);
        dealpage()
      }, function () {
        layer.closeAll("loading")
        layer.msg('订单获取列表失败')
      })
    }
    getOrdListFun()
    // function getListFun() {
		// 	erp.load();
		// 	var erpData = {};
		// 	seltjFun(erpData);
		// 	erpData.status = '10';
		// 	erpData.page = 1;
    //   erpData.ydh = 'y';
    //   erpData.trackingnumberType = 'all';
		// 	erpData.cjOrderDateBegin = $('#c-data-time').val();
		// 	erpData.cjOrderDateEnd = $('#cdatatime2').val();
    //   erpData.limit = $('#page-sel').val() - 0;
    //   erpData.fulfillment = '1';
    //   erpData.fulfillmentSign = '1';
    //   erpData.serarchPod = $scope.ordType;
    //   erpData.fulfillmentStatus = $scope.fulfilStatus;
		// 	console.log(JSON.stringify(erpData))
		// 	erp.postFun('app/order/getERPShipmentsOrder', JSON.stringify(erpData), function (data) {
		// 		console.log(data)
		// 		layer.closeAll("loading")
		// 		var erporderResult = data.data;//存储订单的所有数据
		// 		// erporderResult = JSON.parse(data.data.orderList)
		// 		$scope.erpordTnum = erporderResult.orderCount;
		// 		$scope.erporderList = erporderResult.ordersList;
		// 		countMFun($scope.erporderList);
		// 		dealpage()
		// 	}, function () {
		// 		layer.closeAll("loading")
		// 		layer.msg('订单获取列表失败')
		// 		// alert(2121)
		// 	})
    // }
    // getListFun()
		//分页选择框的切换
		$('#page-sel').change(function () {
			erp.load();
      var showList = $(this).val() - 0;
      $scope.pageSize = showList;
			if ($scope.erpordTnum < 1) {
				erp.closeLoad();
				return;
			}
			$scope.currtpage = 1;
			$("#c-pages-fun").jqPaginator({
				totalCounts: $scope.erpordTnum,//设置分页的总条目数
				pageSize: showList,//设置每一页的条目数
				visiblePages: 5,//显示多少页
				currentPage: $scope.currtpage * 1,
				activeClass: 'active',
				prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
				next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
				page: '<a href="javascript:void(0);">{{page}}<\/a>',
				first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
				last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
				onPageChange: function (n) {
          $('#c-zi-ord .c-checkall').attr("src", "static/image/order-img/multiple1.png")
          getOrdListFun()
					// $scope.currtpage = n;
					// erp.load();
					// var erpData = {};
					// erpData.status = '10';
					// seltjFun(erpData);
					// erpData.cjOrderDateBegin = $('#c-data-time').val();
					// erpData.cjOrderDateEnd = $('#cdatatime2').val();
          // erpData.page = n;
          // erpData.ydh = 'y';
          // erpData.limit = showList;
          // erpData.fulfillment = '1';
          // erpData.fulfillmentSign = '1';
          // erpData.fulfillmentStatus = $scope.fulfilStatus;
					// console.log(erpData)
					// erp.postFun('app/order/getERPShipmentsOrder', JSON.stringify(erpData), function (data) {
					// 	console.log(data)
					// 	layer.closeAll("loading")
					// 	var erporderResult = data.data;//存储订单的所有数据
					// 	$scope.erpordTnum = erporderResult.orderCount;
					// 	$scope.erporderList = erporderResult.ordersList;
					// 	if ($scope.erpordTnum < 1) {
					// 		layer.msg('未找到订单')
					// 	}
					// 	countMFun($scope.erporderList);
					// 	dealpage()
					// }, function () {
					// 	layer.closeAll("loading")
					// 	layer.msg('订单获取列表失败')
					// })
				}
			});
		})
    //跳页的查询
		$scope.gopageFun = function () {
      erp.load();
      var pageNum = $('#inp-num').val()-0;
			if (!pageNum || pageNum<1) {
				layer.closeAll("loading")
				layer.msg('跳转页数必须大于1!');
				return;
			}
			var countN = Math.ceil($scope.erpordTnum / $scope.pageSize);
			if (pageNum > countN) {
				layer.closeAll("loading")
				layer.msg('选择的页数大于总页数.');
				return;
			}
			getOrdListFun();
		}
    //批量提交到拦截
		$scope.addLanJieFun = function(){
			let addyfhCount = 0;
			let checdedIds = '';
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
					addyfhCount++;
					checdedIds += $(this).siblings('.hide-order-id').text() + ',';
				}
			})
			if (addyfhCount > 0) {
				$scope.isaddLjzFlag = true;
			} else {
				$scope.isaddLjzFlag = false;
				layer.msg('请选择订单')
			}
    }
		$scope.changeWLFun = function () {
      let	selIds = '';
			let selCount = 0;
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
					selCount++;
					selIds += $(this).siblings('.hide-order-id').text() + ',';
				}
			})
			if (selCount < 1) {
				layer.msg('请选择订单')
				return;
			} else {
				$scope.chengeWlFlag = true;
			}
    }
    //批量修改仓库
		$scope.bulkChangeCk = function () {
			let cxclNum = 0;
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					cxclNum++;
				}
			})
			if (cxclNum<1) {
				layer.msg('请选择订单')
			} else {
				$scope.changeCkFlag = true;
			}
    }
    // 批量修改仓库确定
    $scope.sureChangeCkFun = function () {
			erp.load();
			var cxclids = '';
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src')=='static/image/order-img/multiple2.png') {
					cxclids+=$(this).siblings('.hide-order-id').text()+',';
				}
			})
			var cxclData = {};
			cxclData.ids = cxclids;
			cxclData.store = $('.sel-ck-num').val();
			erp.postFun('pojo/procurement/changeCjOrderStore',JSON.stringify(cxclData),function (data) {
				$scope.changeCkFlag = false;
				if(data.data.statusCode=='200'){
					var erpData = {};
					erpData.status = '10';
					seltjFun(erpData);
					erpData.cjOrderDateBegin = $('#c-data-time').val();
					erpData.cjOrderDateEnd = $('#cdatatime2').val();
					erpData.page = 1;
          erpData.limit = $('#page-sel').val() - 0;
          erpData.ydh = 'y';
          erpData.fulfillment = '1';
          erpData.fulfillmentSign = '1';
					erp.postFun('app/order/getERPShipmentsOrder', JSON.stringify(erpData), function (data) {
						layer.closeAll("loading")
						var erporderResult = data.data;//存储订单的所有数据
						// erporderResult = JSON.parse(data.data.orderList)
						$scope.erpordTnum = erporderResult.orderCount;
						$scope.erporderList = erporderResult.ordersList;
						if ($scope.erpordTnum < 1) {
							layer.msg('未找到订单')
						}
						countMFun($scope.erporderList);
						if(muId||$scope.storeNumFlag||$scope.isSelJqcz=='母订单号'){
							var inpVal = $.trim($('.c-seach-inp').val())
							if(inpVal){
								getMuNumFun(inpVal,$scope.store)
							} else {
								getMuNumFun(muId,$scope.store)
							}
						}
					}, function () {
						layer.closeAll("loading")
						layer.msg('订单获取列表失败')
					})
				}else{
					layer.closeAll("loading")
					layer.msg('修改仓库失败')
				}
			},function (data) {
				layer.closeAll("loading")
				layer.msg('网络错误')
			})
		}

		// storageTab components async message

		$scope.storageCallback = function({item, allString}){
			let store = allString
			if(!!item) store = item.dataId
			$scope.store = store
			$scope.searchFun()
		}

    // 搜索
    $scope.searchFun = function () {
			$scope.currtpage = 1;
			erp.load();
			var selVal = $('.c-seach-country').val();
			var inpVal = $.trim($('.c-seach-inp').val());
			if (selVal == '追踪号' && inpVal.length > 22) {
				var subResStr = inpVal.substring(inpVal.length - 22)
				if (subResStr.substring(0, 1) == '9') {
					inpVal = subResStr;
					$('.c-seach-inp').val(inpVal);
				}
			}
			// alert(selVal)
			var erpData = {};
			erpData.status = '10';
			if (muId != '') {
				erpData.shipmentsOrderId = muId;
			} else {
				erpData.shipmentsOrderId = '';
			}

			if ($scope.selstu == 1) {
				erpData.trackingnumberType = 'all';
			} else if($scope.selstu == 5){
				erpData.auto = 'y';
			} else {
				if ($('.seach-ordnumstu').is(':checked')) {
					erpData.trackingnumberType = 1;
				} else {
					erpData.trackingnumberType = 'all';
				}
      erpData.ydh = 'y';
			erpData.cjOrderDateBegin = $('#c-data-time').val();
			erpData.cjOrderDateEnd = $('#cdatatime2').val();
			erpData.page = 1;
			erpData.store = $scope.store;
			erpData.limit = $('#page-sel').val() - 0;
      erpData.serarchPod = $scope.ordType;
      erpData.fulfillmentStatus = $scope.fulfilStatus;
      erpData.fulfillmentSign = 1;
      erpData.fulfillment = '1';
      $scope.storeNumFlag = false;
      $scope.erporderList = [];

      erpData = AssembleSearchData(erpData, selVal, inpVal);
      console.log(erpData);
			erp.postFun('app/order/getERPShipmentsOrder', JSON.stringify(erpData), function (data) {
				layer.closeAll("loading")
				var erporderResult = data.data;//存储订单的所有数据
				$scope.erpordTnum = erporderResult.orderCount;
				$scope.erporderList = erporderResult.ordersList;
				countMFun($scope.erporderList);
				dealpage();
			}, function () {
				layer.closeAll("loading")
				layer.msg('订单获取列表失败')
			})
			if($scope.isSelJqcz=='母订单号'&&inpVal){
				getMuNumFun(inpVal,$scope.store)
			}
    }
    }
    function countMFun(val) {
      var len = val.length;
      var count = 0;
      for (var i = 0; i < len; i++) {
        count += val[i].order.AMOUNT;
      }
      $scope.countMoney = count.toFixed(2)
    }
    //获取数量
    function getNumFun() {
      erp.postFun('app/order/getOrderCount10', {
        'store': $scope.store,
        'pod': 'pod'
      }, function (data) {
        if (data.data.statusCode == 200) {
          var resResult = JSON.parse(data.data.result);
          $scope.dYi = resResult.mei;
          $scope.dEr = resResult.you;
          $scope.dSan = resResult.jiufen;
        }
      }, function (data) {
        console.log(data)
      })
    }
    //处理分页
		function dealpage() {
			$('#c-zi-ord .c-checkall').attr("src", "static/image/order-img/multiple1.png")
			if ($scope.erpordTnum <= 0) {
				layer.msg('未找到订单')
				layer.closeAll("loading")
				return;
			}
			$("#c-pages-fun").jqPaginator({
				totalCounts: $scope.erpordTnum,//设置分页的总条目数
				pageSize: $scope.pageSize-0,//设置每一页的条目数
				visiblePages: 5,//显示多少页
				currentPage: $scope.pageNum * 1,
				activeClass: 'active',
				prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
				next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
				page: '<a href="javascript:void(0);">{{page}}<\/a>',
				first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
				last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
				onPageChange: function (n, type) {
					if (type == 'init') {
						layer.closeAll("loading")
						return;
					}
					$scope.pageNum = n;
					getOrdListFun()
				}
			});
		}
    //按条件搜索
    function seltjFun(data) {
      if ($scope.selstu == 1) {
				data.trackingnumberType = 'all';
			} else {
				if ($('.seach-ordnumstu').is(':checked')) {
					data.trackingnumberType = 1;
				} else {
					data.trackingnumberType = 'all';
				}
				if ($scope.selstu == 3) {
					data.disputeId = '';
				} else {
					data.disputeId = 'dispute';
				}
			}
			data.store = $scope.store;
			if (muId) {
				data.shipmentsOrderId = muId;
			} else {
				data.shipmentsOrderId = '';
			}
			data.cjOrderDateBegin = $('#c-data-time').val();
			data.cjOrderDateEnd = $('#cdatatime2').val();
			var selVal = $('.c-seach-country').val();
			var inpVal = $.trim($('.c-seach-inp').val());

      return AssembleSearchData(data, selVal, inpVal);
    }
    function AssembleSearchData(data, selVal, inpVal) {
      var mergeData = function (json) {
        return Object.assign(data, {
          orderNumber: '',
          shopName: '',
          sku: '',
          cjProductName: '',
          consumerName: '',
          salesmanName: '',
          shipmentsOrderId: '',
          customerName: '',
          split: '',
        }, json);
      };

      switch (selVal) {
        case '子订单号':
          data = mergeData({ orderNumber: inpVal });
          break;
        case '店铺名称':
          data = mergeData({ shopName: inpVal });
          break;
        case '商品SKU':
          data = mergeData({ sku: inpVal });
          break;
        case '商品名称':
          data = mergeData({ cjProductName: inpVal });
          break;
        case '客户名称':
          data = mergeData({ consumerName: inpVal });
          break;
        case '业务员':
          data = mergeData({ salesmanName: inpVal });
          break;
        case '群主':
          data = mergeData({ ownerName: inpVal });
          break;
        case '母订单号':
          data = mergeData({ shipmentsOrderId: inpVal });
          break;
        case '追踪号':
          if ($scope.selstu == 3) {
            if (inpVal) {
              data = mergeData({ ydh: inpVal });
            } else {
              data = mergeData({ ydh: 'y' });
            }
          } else {
            data = mergeData({ ydh: '' });
          }
          console.log(inpVal)
          break;
        case '历史追踪号':
          if ($scope.selstu == 1) {
            if (inpVal) {
              data = mergeData({ ydh: inpVal });
            } else {
              data = mergeData({ ydh: '' });
            }
          }
          console.log(inpVal)
          break;
        case '收件人':
          data = mergeData({ customerName: inpVal });
          break;
        case '客户订单号':
          data = mergeData({ orderNumber: inpVal });
          break;
        case '参考号':
          data = mergeData({ split: inpVal });
          break;
      }

      return data;
    }
  }])
})();