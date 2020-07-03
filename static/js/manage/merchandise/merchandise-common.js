var app = angular.module('merchan-service',['service']);
app.service('merchan', ['$http', '$compile', 'erp', function($http, $compile, erp){

	var merchan = this;
	var chineseReqG = /[\u4E00-\u9FA5]/g;
 
	this.getItemNums = function (scb) {
		erp.getFun('pojo/product/countAllList', function (data) {
			var data = data.data;
			if (data.statusCode != 200) {
				layer.msg('服务器错误');
				return false;
			}
			var result = JSON.parse(data.result);
			scb(result);
			console.log(result);
		}, function (err) {
			layer.msg('网络错误');
		});
	}
	
	
	


	// 选中当前商品
	this.checkMerch = function (sku, checked, arr) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i]['sku'] == sku) {
				arr[i]['checked'] == !checked;
				break;
			}
		}
	}
	// 选中所有商品
	this.checkAllMerch = function (checkAllMark, arr) {
		for (var i = 0; i < arr.length; i++) {
			arr[i].checked = checkAllMark;
		}
	}

	// 获取选中的id
	this.getBanchIds = function (arr) {
		var banchIds = [];
		for (var i = 0; i < arr.length; i++) {
			if(arr[i].checked == true)
			banchIds.push(arr[i].id);
		}
		return banchIds;
	}

	// 修改类目弹框
	this.changeCate = function (item, $scope, flag, scb) {
		layer.open({
	    title: null,
	    type: 1,
	    area: ['374px', '310px'],
	    skin: 'offline-assign-layer change-cate-layer',
	    closeBtn: 0,
	    shade: [0.1, '#000'],
	    content: $('#change-cate').html(),
	    btn: ['取消', '确认'],
	    success: function (layero, index) {
	    	if ($.isArray(item)) {
	    		$(layero).find('.pro-info').hide();
	    	} else {
	    		$(layero).find('.pro-name').html(item.name || item.english);
					$(layero).find('.pro-sku').html(item.sku);
					$(layero).find('.pro-img').attr('src','https://' + item.bigImg.replace('http://','').replace('https://', ''));
	    	}
				console.log($scope.categoryListOne);
				var cateListOne = [];
				for (var i = 0; i < $scope.categoryListOne.length; i++) {
					cateListOne.push('<option value="'+ $scope.categoryListOne[i].id +'">'+ $scope.categoryListOne[i].name +'</option>')
				}
				$(layero).find('#change-cate-sele1').append(cateListOne.join(''));
				var cateTwoIndex;
				$(layero).find('#change-cate-sele1').on('change', function () {
					if ($(this).val()) {
						cateTwoIndex = erp.findIndexByKey($scope.categoryListOne, 'id', $(this).val());
						// console.log(cateTwoIndex);
						var curCateTwo = $scope.categoryListOne[cateTwoIndex].children;
						var cateListTwo = [];
						for (var i = 0; i < curCateTwo.length; i++) {
							cateListTwo.push('<option value="'+ curCateTwo[i].id +'">'+ curCateTwo[i].name +'</option>');
						}
						$(layero).find('#change-cate-sele2').html('<option value="">请选择</option>' + cateListTwo.join(''));
					} else {
						$(layero).find('#change-cate-sele2').html('<option value="">请选择</option>');
					}
					$(layero).find('#change-cate-sele3').html('<option value="">请选择</option>');
				});
				var cateThreeIndex;
				$(layero).find('#change-cate-sele2').on('change', function () {
					if ($(this).val()) {
						cateThreeIndex = erp.findIndexByKey($scope.categoryListOne[cateTwoIndex].children, 'id', $(this).val());
						// console.log(cateThreeIndex);
						var curCateThree = $scope.categoryListOne[cateTwoIndex].children[cateThreeIndex].children;
						var cateListThree = [];
						for (var i = 0; i < curCateThree.length; i++) {
							cateListThree.push('<option value="'+ curCateThree[i].id +'" name="'+ curCateThree[i].nameEn +'">'+ curCateThree[i].name +'</option>');
						}
						$(layero).find('#change-cate-sele3').html('<option value="">请选择</option>' + cateListThree.join(''));
					} else {
						$(layero).find('#change-cate-sele3').html('<option value="">请选择</option>');
					}
				});
	    },
	    yes: function(index, layero){
	        layer.close(index);
	      },
	    btn2: function(index, layero){
	    	// pojo/product/updateProductCategory
	    	// {ids,categoryId,flag}
	    	var changeCateId = $(layero).find('#change-cate-sele3').val();
	    	var changeCateName = $(layero).find('#change-cate-sele3')[0].selectedOptions[0].innerHTML;
	    	// var changeCateName = $(layero).find('#change-cate-sele3')[0].selectedOptions[0].getAttribute('name');
	     	if (changeCateId) {
	     		var changeCateData = {};
	     		if ($.isArray(item)) {
	     			changeCateData.ids = item.join(',');
	     		} else {
	     			changeCateData.ids = item.id;
	     		}
	     		changeCateData.categoryId = changeCateId;
	     		changeCateData.flag = flag;
	     		console.log(changeCateData);
	     		erp.postFun('pojo/product/updateProductCategory', JSON.stringify(changeCateData), function (data) {
	     			var data = data.data;
	     			if (data.statusCode != 200) {
	     				layer.msg('服务器错误');
	     				return false
	     			}
	     			layer.msg('类目修改成功！',{
	     				time: 1000
	     			}, function () {
	     				layer.close(index);
	     				if ($.isArray(item)) {
	     					scb(item, changeCateId, changeCateName);
			     		} else {
			     			scb(item.id, changeCateId, changeCateName);
			     		}
	     				// scb(item.id, changeCateId, changeCateName);
	     				// $scope.rListAfterChCate(item.id, changeCateId, changeCateName);
	     			});
	     		}, function () {
	     			layer.msg('网络错误');
	     		});
	     	} else {
	     		layer.msg('请选择三级类目！');
	     	}
	      // layer.close(index);
	      return false;
	      }
	  });
	}

	// 线下指派弹框
	this.offLineAssign = function (item, $scope) {
		layer.open({
      title: null,
      type: 1,
      area: ['374px', '290px'],
      skin: 'offline-assign-layer offline-assign-layer-',
      closeBtn: 0,
      // shade: 0,
      shade: [0.1, '#000'],
      content: $('#offline-assign').html(),
      btn: ['取消', '确认'],
      success: function (layero, index) {
      	//获取物流方式
        var getWayData = {};
        getWayData.weight = item.packweight || item.weight;
        getWayData.lcharacter = item.propertyKey;
      	erp.postFun2('getWayBy.json',JSON.stringify(getWayData), function (data) {
					var logisticArr = data.data;
					console.log(logisticArr);
					var logisticOption = [];
					for (var i = 0; i < logisticArr.length; i++) {
						logisticOption.push('<option value="'+ logisticArr[i].enName +'">'+ logisticArr[i].enName +'</option>');
						// logisticOption.push('<option value="'+ logisticArr[i].id +'">'+ logisticArr[i].enName +'</option>');
					}
					$('#assign-ship-sele').html(logisticOption.join(''));
				}, function (err) {
					layer.msg('网络错误');
				});
      	$(layero).find('#offline-assign-img').attr('src',item.bigImg)
				$(layero).find('.pro-name').html(item.nameEn);
				$(layero).find('.pro-sku').html(item.sku);
				var $userIdInp = $(layero).find('#offline-assign-inp');
				var $removeAssign = $(layero).find('#remove-assign');
				var $hasresultWrap = $(layero).find('.search-res-wrap');
				var $hasresult = $(layero).find('.search-res-ul');
				var $noresult = $(layero).find('.search-res-box');
				var assignUserId = '';
				var custListTimer = null;
				function goActSerchUser() {
					// alert(1);
					// var searchStr = $(this).val();
					custListTimer && clearTimeout(custListTimer)
					custListTimer = setTimeout(function() {
              console.log($userIdInp.val());
							if ($userIdInp.val() == '') {
								$hasresultWrap.hide();
								$hasresult.html('');
								$noresult.attr('data','1').hide();
								$removeAssign.hide();
								return;
							}
							$removeAssign.show();
							var searchUserData = {};
							// searchUserData.userId = $scope.userId;
							searchUserData.token = $scope.token;
							searchUserData.data = JSON.stringify({
								inputStr: $userIdInp.val()
							});
							erp.postFun('app/account/proList', JSON.stringify(searchUserData), function (data) {
								var data = data.data;
								if (data.statusCode != 200) {
									layer.msg('服务器错误');
									return false;
								}
								var result = JSON.parse(data.result);
								console.log(result);
								if (result[0] != null) {
									$noresult.attr('data','1').hide();
									$hasresultWrap.show();
									// if (result.length > 4) {
									// 	result = result.slice(0, 4);
									// }
									var usrListLis = [];
									for (var i = 0; i < result.length; i++) {
										usrListLis.push('<li name="'+ result[i].id +'" user="'+ result[i].name +'">'+ result[i].num + '-' + result[i].name +'</li>');
									}
									$hasresult.html(usrListLis.join(''));
								} else {
									$hasresult.html('');
									$hasresultWrap.hide();
									$noresult.attr('data','0').show();
								}
							}, function () {
								layer.msg('网络错误');
							});
          }, 1000);
				}
				$userIdInp.on('input', goActSerchUser);
				$userIdInp.focus(goActSerchUser);
				$hasresult.on('click', 'li', function () {
					$userIdInp.val($(this).attr('user')).attr('name',$(this).attr('name')).attr('user',$(this).attr('user'));
					$hasresult.html('');
					$hasresultWrap.hide();
					$removeAssign.show();
				});
				$removeAssign.click(function () {
					$hasresult.html('');
					$hasresultWrap.hide();
					$noresult.attr('data','1').hide();
					$(this).hide();
					$userIdInp.val('').attr('name','').focus().attr('user','');
				});
				$(layero).click(function () {
					$hasresult.html('');
					$hasresultWrap.hide();
					$noresult.attr('data','1').hide();
				});
				$(layero).find('.default-con').click(function () {
					return false;
				});
      },
      yes: function(index, layero){
        layer.close(index);
      },
      btn2: function(index, layero){
      	
      	 // 接口 app/locProduct/assign 参数： {"data": "{ 'productId': '{33F18921-8FE3-4963-801A-3BE3624C8BD9}','userId':'{8DA0EC3E-E4A7-4D9B-8876-2A025515EBE0}','shopMethod':'EMS'}"}
      	var isNoRes = $(layero).find('.search-res-box').attr('data');
      	var curUserName = $(layero).find('#offline-assign-inp').attr('user');
      	// console.log(isNoRes);
      	var shopMethod = $(layero).find('#assign-ship-sele').val();
      	var assignUserId = $(layero).find('#offline-assign-inp').attr('name');
      	var assignUserName = $(layero).find('#offline-assign-inp').val();
      	if (shopMethod == '') {
      		layer.msg('请选择物流方式');
      		return false;
      	}
      	// if (assignUserName == '') {
      	// 	layer.msg('请输入指派用户名');
      	// 	return false;
      	// }
      	// console.log(assignUserName);
      	// console.log(curUserName);
      	if (assignUserId == '' || assignUserName != curUserName) {
      		layer.msg('请从搜索结果中选取用户');
      		return false;
      	}
      	var assignData = {};
      	assignData.data = JSON.stringify({
      		productId: item.id,
      		userId: assignUserId,
      		shopMethod: shopMethod
      	});
      	console.log(JSON.stringify(assignData));
      	erp.postFun('app/locProduct/assign', JSON.stringify(assignData), function (data) {
      		var data = data.data;
      		console.log(data);
      		if (data.statusCode == 702) {
      			layer.msg('商品已经指派给该用户，不能重复指派！');
      			return false;
      		}
      		if (data.statusCode == 200) {
      			layer.msg('指派成功！', {
              time: 1000
            }, function () {
      				layer.close(index);
      			});
						var parms = {
								type: '0',
								pid: item.id,
								userid: assignUserId
						}
						erp.postFun('erp/publish/Calculation', parms, function() {})

      			return;
      		}
      		layer.msg('服务器错误');
      	}, function (err) {
      		layer.msg('网络错误');
      	});
        // layer.close(index);
        return false;
      }
    });
	}
	// 指定用户弹框
	this.authoOneUser = function (item, $scope, scb) {
		layer.open({
      title: null,
      type: 1,
      area: ['374px', '290px'],
      skin: 'offline-assign-layer offline-assign-layer-',
      closeBtn: 0,
      // shade: 0,
      shade: [0.1, '#000'],
      content: $('#autho-users').html(),
      btn: ['取消', '确认'],
      success: function (layero, index) {
				if (item.authorityStatus == 1) {
					$(layero).find('h5').html('部分可见');
				}
      	//获取物流方式
        var getWayData = {};
        getWayData.weight = item.packweight || item.weight;
        getWayData.lcharacter = item.propertyKey;
      	erp.postFun2('getWayBy.json',JSON.stringify(getWayData), function (data) {
					var logisticArr = data.data;
					console.log(logisticArr);
					var logisticOption = [];
					for (var i = 0; i < logisticArr.length; i++) {
						logisticOption.push('<option value="'+ logisticArr[i].enName +'">'+ logisticArr[i].enName +'</option>');
						// logisticOption.push('<option value="'+ logisticArr[i].id +'">'+ logisticArr[i].enName +'</option>');
					}
					$('.assign-ship-sele').html(logisticOption.join(''));
				}, function (err) {
					layer.msg('网络错误');
				});
      	$(layero).find('#autho-users-img').attr('src',item.bigImg)
				$(layero).find('.pro-name').html(item.nameEn);
				$(layero).find('.pro-sku').html(item.sku);
				var $userIdInp = $(layero).find('#autho-users-inp');
				var $removeAssign = $(layero).find('#remove-autho-users');
				var $hasresultWrap = $(layero).find('.search-res-wrap');
				var $hasresult = $(layero).find('.search-res-ul');
				var $noresult = $(layero).find('.search-res-box');
				var assignUserId = '';
				var custListTimer = null;
				function goActSerchUser() {
					custListTimer && clearTimeout(custListTimer)
					custListTimer = setTimeout(function () {
						if ($userIdInp.val() == '') {
							$hasresultWrap.hide();
							$hasresult.html('');
							$noresult.attr('data','1').hide();
							$removeAssign.hide();
							return;
						}
						$removeAssign.show();
						var searchUserData = {};
						// searchUserData.userId = $scope.userId;
						searchUserData.token = $scope.token;
						searchUserData.data = JSON.stringify({
							inputStr: $userIdInp.val()
						});
						erp.postFun('app/account/proList', JSON.stringify(searchUserData), function (data) {
							var data = data.data;
							if (data.statusCode != 200) {
								layer.msg('服务器错误');
								return false;
							}
							var result = JSON.parse(data.result);
							console.log(result);
							if (result[0] != null) {
								$noresult.attr('data','1').hide();
								$hasresultWrap.show();
								// if (result.length > 4) {
								// 	result = result.slice(0, 4);
								// }
								var usrListLis = [];
								for (var i = 0; i < result.length; i++) {
									usrListLis.push('<li name="'+ result[i].id +'" user="'+ result[i].name +'" phone="'+ result[i].phone +'" login-name="'+ result[i].loginName +'">'+ result[i].num + '-' + result[i].name +'</li>');
								}
								$hasresult.html(usrListLis.join(''));
							} else {
								$hasresult.html('');
								$hasresultWrap.hide();
								$noresult.attr('data','0').show();
							}
						}, function () {
							layer.msg('网络错误');
						});
					}, 1000)
				}
				$userIdInp.on('input', goActSerchUser);
				$userIdInp.focus(goActSerchUser);
				$hasresult.on('click', 'li', function () {
					$userIdInp.val($(this).attr('user')).attr('name',$(this).attr('name')).attr('user',$(this).attr('user')).attr('phone', $(this).attr('phone')).attr('login-name', $(this).attr('login-name'));
					$hasresult.html('');
					$hasresultWrap.hide();
					$removeAssign.show();
				});
				$removeAssign.click(function () {
					$hasresult.html('');
					$hasresultWrap.hide();
					$noresult.attr('data','1').hide();
					$(this).hide();
					$userIdInp.val('').attr('name','').focus().attr('user','').attr('phone','');
				});
				$(layero).click(function () {
					$hasresult.html('');
					$hasresultWrap.hide();
					$noresult.attr('data','1').hide();
				});
				$(layero).find('.default-con').click(function () {
					return false;
				});
      },
      yes: function(index, layero){
        layer.close(index);
      },
      btn2: function(index, layero){
      	// pojo/product/changeAut
      	// {productId,autAccId,autAccName,autAccPhone,flag}
      	// 0公开权限   1添加权限用户
      	// {商品id,权限客户id,权限客户名,权限客户电话,标记}
      	var isNoRes = $(layero).find('.search-res-box').attr('data');
      	var curUserName = $(layero).find('#autho-users-inp').attr('user') || '';
      	var curUserPhone = $(layero).find('#autho-users-inp').attr('phone');
      	var assignUserId = $(layero).find('#autho-users-inp').attr('name');
      	var assignUserLoginName = $(layero).find('#autho-users-inp').attr('login-name');
      	var assignUserName = $(layero).find('#autho-users-inp').val() || '';
      	var shopMethod = $(layero).find('.assign-ship-sele').val();
      	// if (assignUserName == '') {
      	// 	layer.msg('请输入指派用户名');
      	// 	return false;
      	// }
      	// if (assignUserId == '' || assignUserName != curUserName) {
      	// 	layer.msg('请从搜索结果中选取用户');
      	// 	return false;
				// }
				if (assignUserName != curUserName) {
					layer.msg('请从搜索结果中选取用户');
					return false;
				}
      	var authoUserData = {
      		productId: item.id,
      		autAccId: assignUserId,
      		autAccName: curUserName,
      		autAccPhone: curUserPhone,
      		flag: '1',
      		logistic: shopMethod
      	};
				console.log(JSON.stringify(authoUserData));
				layer.load(2);
      	erp.postFun('pojo/product/changeAut', JSON.stringify(authoUserData), function (data) {
					layer.closeAll('loading');
      		var data = data.data;
      		console.log(data);
      		if (data.statusCode != 200) {
      			if (data.statusCode == 204) {
      				layer.msg('请登录后操作！');
      				return false;
      			}
      			layer.msg('服务器错误，指定失败！');
      			return false;
      		}
      		layer.msg('指定成功',{
      			time: 1000
      		}, function () {
      			layer.close(index);
      			scb({
      				id: assignUserId,
      				loginName:  assignUserLoginName,
      				name: curUserName
      			});
      		});
      	});
        // layer.close(index);
        return false;
      }
    });
	}

	// 上架／下架
	// {"userId":"{ABCEAFC1-5EEE-40F2-800D-3B65C9C6E135}","token":"","data":"{\"operator\":\"李四\",\"ids\":\"{FFDC55CB-6EAB-4410-B12E-D22A5CF1D117},{C2A34062-4901-4755-BB38-927A12BF7134}\",\"operate\":\"SHELVE\"}"}
	// userId, token, operate 是字符串格式  data 是对象格式
	this.selvesOperate = function (id, $scope, scb) {
		layer.open({
      title: null,
      type: 1,
      area: ['374px', '290px'],
      skin: 'offline-assign-layer',
      closeBtn: 0,
      shade: [0.1, '#000'],
      content: '<h5>下架商品</h5><p class="is-concern">确定下架此商品吗?</p>',
      btn: ['取消', '确认'],
      yes: function(index, layero){
          layer.close(index);
        },
      btn2: function(index, layero){
      	var offShelvesData = {};
				offShelvesData.operator = $scope.userName;
				offShelvesData.operatorId = $scope.userId;
				offShelvesData.remark = $scope.remark;
				offShelvesData.flag = $scope.merchanFlag;
				offShelvesData.oid = id;
				offShelvesData.status = $scope.merchanStatus;
				offShelvesData = JSON.stringify(offShelvesData);
				console.log(offShelvesData);
				erp.postFun('/pojo/product/unshelve', offShelvesData, function (data) {
					var data = data.data;
					if (data.statusCode != 200) {
						layer.msg('服务器错误');
						return false;
					}
					layer.close(index);
					scb(data);
				}, function () {
					layer.msg('网络错误！');
				});
        return false //开启该代码可禁止点击该按钮关闭
      }
    });
		
	}

	this.opePrivForever = function (item,flag,scb) {
		console.log(item)
		var str;
		if (flag=='1') {
			str = '确定设置为永久私有';
		}
		if (flag=='0') {
			str = '确定取消永久私有';
		}
		layer.open({
        title: null,
        type: 1,
        area: ['374px', '290px'],
        skin: 'offline-assign-layer',
        closeBtn: 0,
        shade: [0.1, '#000'],
        content: '<h5>永久私有</h5><p class="is-concern">'+str+'?</p>',
        btn: ['取消', '确认'],
        yes: function (index, layero) {
            layer.close(index);
        },
        btn2: function (index, layero) {
            erp.postFun('pojo/product/changeIsAut', JSON.stringify({
                id: item.id,
                isAut: flag
            }), function (data) {
                var data = data.data;
                if (data.statusCode != 200) {
                    layer.msg('服务器错误，操作失败！');
                    return false;
                }
                layer.msg('操作成功', {time: 1000}, function () {
                    layer.close(index);
                    scb();
                });

            }, function (err) {
                layer.msg('网络错误');
            });
            return false //开启该代码可禁止点击该按钮关闭
        }
    });
	}


	this.getInquiryList = function (url, sendData, scb) {
		erp.loadPercent($('.erp-load-box'),400);
		erp.postFun(url,JSON.stringify(sendData),function (data){
			// erp.closeLoad();
			erp.closeLoadPercent($('.erp-load-box'));
			var data = data.data;
    	// console.log(data);
    	scb(data);
    	// console.log(data.count);//总页数.分页用
    },function (data){
    	// erp.closeLoad();
    	erp.closeLoadPercent($('.erp-load-box'));
    	alert("查询失败");
    });
	}

	this.opeInquiry = function (url, opeData, scb){
  	erp.postFun(url,JSON.stringify(opeData),function (data){
  			if (data.data.statusCode == 200) {
  				scb(data);
  			} else if(data.data.data=="1"){
      		scb(data);
      	}else{
      		layer.msg("服务器错误，操作失败！");
      	}
      },function (data){
      	layer.msg("网络错误");
      });
  }
	//下架的方法
  this.offShelveInquiry = function (url, offsheData, scb){
  	erp.postFun(url,JSON.stringify(offsheData),function (data){
  		if (data.data.statusCode == 200) {
  			scb();
  		} else if(data.data.data=="1"){
    		scb();
    	}else{
    		layer.msg("下架失败");
    	}
    },function (data){
      layer.msg("下架失败");
    });
  }
  //删除具体某一个爬虫商品
  this.deleteInquiry = function (url, deleteData, scb){
  	erp.postFun(url,JSON.stringify(deleteData),function (data){
      	if(data.data.data=="1"){
      		scb();
      	}else{
      		layer.msg("删除失败");
      	}
      },function (data){
      	layer.msg("删除失败");
      });
  }
	// 选择商品类目和修改商品类目
	// 获取商品类目列表
	this.getCateListOne = function (scb) {
		erp.getCateList().then(res =>{
			scb(res)
		})
	}
	// 通过三级类目id获取类目英文名
	this.getCateNameByCateId = function (id, scb) {
		erp.postFun('app/product/findParentsById', JSON.stringify({cid: id}),function (data) {
			var data = data.data;
			if (data.statusCode != 200) {
				layer.msg('服务器错误');
				$scope.hasSearchCateRes = false;
				$scope.NoSearchCateRes = true;
				return false;
			}
			var result = JSON.parse(data.result);
			scb(result);
		}, function () {
			layer.msg('网络错误');
		});
	}

	// 商品录入和修改
	// 上传图片
	// this.upLoadImg = function (formData,scb, index) {
	// 	// 低版本浏览器不兼容
	// 	// var formData = new FormData($("#uploadimg")[0]);

	// 	erp.upLoadImgPost('app/ajax/upload', formData, function(data) {
 //      	var data = data.data;
 //      	if (data.statusCode != 200) {
 //      		layer.msg('服务器错误');
 //      		layer.close(index);
 //      		return false;
 //      	}
 //      	scb(JSON.parse(data.result));
 //      }, function () {
 //      	layer.close(index);
 //      	layer.msg('网络错误');
 //      });
	// }
	// 预览图片
	this.previewPic = function (picSrc) {
		// var picSrc = $($event.target).parent().parent().parent().find('img').attr('src');
		layer.open({
      title: null,
      type: 1,
      area: ['620px', 'auto'],
      skin: 'preview-pic-layer',
      closeBtn: 0,
      content: '<div class="img-box"><img id="img-tag" src="" alt="" /></div>',
      success: function(layero, index){
        $(layero).find('#img-tag').attr('src', picSrc);
      },
      btn: ['确认'],
      yes: function(index, layero){
          layer.close(index);
      }
    });
	}

	// 显示大图
	this.previewPicTwo = function(picSrc){
		const json = {
			"title": "", //相册标题
			"id": new Date().getTime(), //相册id
			"start": 0, //初始显示的图片序号，默认0
			"data": [   //相册包含的图片，数组格式
				{
					"alt": "",
					"pid": 666, //图片id
					"src": picSrc, //原图地址
					"thumb": picSrc //缩略图地址
				}
			]
		}

		layer.photos({
			shade: 0.5,
			photos: json
			,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
		});
	}
	// function blobToBase64(blob, callback) {// blob转换成base64
  //   let a = new FileReader();
  //   a.onload = function (e) { callback(e.target.result); }
  //   a.readAsDataURL(blob);
	// }

	function Base64toFile(dataurl, filename) {// 将base64转换为文件
		var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
		while(n--){
				u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], filename, {type:mime});
	}

	function Img2base64(url,fn,fnerr){ // img元素转base64
		var img = new Image()
		img.crossOrigin = ''
		img.src = url
		img.onload = function(){
			console.log('img onload')
			var canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
	
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0, img.width, img.height);
			var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
			var dataURL = canvas.toDataURL("image/" + ext);
			fn(dataURL)
		}

		img.onerror = function(){
			console.log('img onerror')
			fnerr()
		}
	}

	function UploadOssk(file,cb){// 上传oss
		var files = []
		files.push(file)
		erp.ossUploadFile(files, function (data) {
			if (data.code == 0) {
					layer.msg('上传失败');
					return;
			}
			if (data.code == 2) {
					layer.msg('部分图片上传失败，请等待图片加载。');
			}
			if (data.code == 1) {
					layer.msg('上传成功，请等待图片加载。');
			}
			var result = data.succssLinks;
			cb(result[0])
	});
	}

	function loadDown(url) {
		// 下载文件
		var xhr = new XMLHttpRequest()
		xhr.open('GET', url, true) // 也可以使用POST方式，根据接口
		xhr.responseType = 'blob'
		xhr.onload = function() {
			if (this.status === 200) {
				var content = this.response
				var aTag = document.createElement('a')
				var blob = new Blob([content])
				var headerName = xhr.getResponseHeader('Content-disposition')
				var fileName = decodeURIComponent(headerName).substring(20)
				aTag.download = fileName
				// eslint-disable-next-line compat/compat
				aTag.href = URL.createObjectURL(blob)
				aTag.click()
				// eslint-disable-next-line compat/compat
				URL.revokeObjectURL(blob)
		 }
	 }
	xhr.send()
 }

 function downloadImage(src) {
	var a = $("<a></a>").attr("href", src).attr("target", "_blank").appendTo("body");

	a[0].click();
	a.remove();
}

	// 添加图片url
	this.addUrlPic = function (scb) {
		var vImgRes = false;
		layer.open({
      title: null,
      type: 1,
      area: ['993px', '265px'],
      skin: 'add-pic-layer',
      closeBtn: 0,
      shade: [0.1, '#000'],
      content: $('#add-pic').html(),
      btn: ['取消', '确认'],
      success: function (layero, index) {
				$(layero).find('#add-img-url').focus();
				$(layero).find('#verify-img-url').on('click', function () {
					var verifyImgUrl = $(layero).find('#add-img-url').val();
					if (verifyImgUrl) {
						var imgBox = $(layero).find('#show-verify-img');
						imgBox.attr('src',verifyImgUrl);
            imgBox.on({
            	'load': function () {
            		layer.msg('验证成功',{time: 1000});
								vImgRes = true;
            	},
            	'error': function() {
                 layer.msg('验证失败',{time: 1000});
                 vImgRes = false;
              }
            });
					} else {
						layer.msg('请输入图片链接');
					}
				});

				$(layero).find('#download-img').on('click', function () {
					if (!vImgRes) {
						layer.msg('请先验证图片链接');
						return false;
					}
					var imgBox = $(layero).find('#show-verify-img')[0];
					downloadImage(imgBox.src)
				})
      },
      yes: function(index, layero){
          layer.close(index);
        },
      btn2: function(index, layero){
      		var verifyResUrl = $(layero).find('#show-verify-img').attr('src');
         	if (!vImgRes) {
         		layer.msg('请先验证图片链接');
         		return false;
         	}
	      	var shadeIndex = layer.load(0, {
						shade: [0.2, '#000']
					});

					Img2base64(
						verifyResUrl,
						function(data){
							let imgFile = Base64toFile(data,'jpg')
							UploadOssk(imgFile,scb)
							layer.close(shadeIndex)
							layer.close(index);
						},
						function(){
							layer.msg('上传失败，请点击手动下载到本地，使用《添加本地图片》功能');
							layer.close(shadeIndex)
						}
					)

          return false;
        }
    });
	}
	
	// 获取仓库信息
	this.getStorage = function(scb) {
		erp.getFun('app/storage/getStorage', function (data) {
			var data = data.data;
			if (data.statusCode != 200) {
				layer.msg('获取仓库信息失败');
				return false;
			} else {
				scb(JSON.parse(data.result));
				// renderStorage(JSON.parse(data.result), dom1, dom2, dom3, $scope);
			}
		}, function () {
			layer.msg('网络错误');
		});
	}
	// 渲染仓库信息
	this.renderStorage = function (data, dom1, dom2, dom3, $scope) {
		var storageHeadArr = [];
		var storageConArr = [];
		var storageBanchArr = [];
		for (var i = 0; i < data.length; i++) {
			// 服务商品美国东不编辑
			if ($scope.productType == '1' && data[i].storage == '美国东') continue;
			storageHeadArr.push('<li class="li-storage">' + data[i].storage + '</li>');
			if (!$scope.isAdminLogin && data[i].storage== '美国西') {
				storageConArr.push('<li class="li-storage can-edit" storagetype="'+data[i].storage+'" storageid="'+data[i].id+'">'
                        + '<input type="text" class="edit-inp edit-'+ data[i].storageEn +'" name="'+ data[i].id +'" value="" placeholder="0" ng-focus="addGrayBg($event)" ng-blur="checkIsNum($event)" disabled="disabled" title="只有管理员可以编辑美国仓库存">'
                       	+ '</li>');
			} else {
				storageConArr.push('<li class="li-storage can-edit" storagetype="'+data[i].storage+'" storageid="'+data[i].id+'">'
                        + '<input type="text" class="edit-inp edit-'+ data[i].storageEn +'" name="'+ data[i].id +'" value="" placeholder="0" ng-focus="addGrayBg($event)" ng-blur="checkIsNum($event)">'
                       	+ '</li>');
			}
			storageBanchArr.push('<option value="banch-'+ data[i].storageEn +'">'+ data[i].storage +'</option>');
		}
		dom1.append(storageBanchArr.join(''));
		dom2.html(storageHeadArr.join(''));
		var html = storageConArr.join('');
		var template = angular.element(html);
		var mobileDialogElement = $compile(template)($scope);
		dom3.html(mobileDialogElement);
	}
	// 渲染商品列表仓库信息
	this.renderMerchListStorage = function (data, dom1, dom2) {
		var storageHeadArr = [];
		var storageConArr = [];
		for (var i = 0; i < data.length; i++) {
			storageHeadArr.push('<span>' + data[i].storage + '</span>');
			storageConArr.push('<span name="'+ data[i].id +'"></span>');
		}
		dom1.html(storageHeadArr.join(''));
		dom2.html(storageConArr.join(''));
	}

	// 实时显示每个变量对应的sku
	this.showChildSKU = function (id, $scope) {
		var varibleNewArr = [];
		$('#' + id).find('.varible-new input').each(function () {
			if ($(this).val().trim()) {
				varibleNewArr.push($(this).val());
			}
		});
		var currentSKU = $scope.addGoodsAutoSKU + '-' + varibleNewArr.join('-');
		$('#' + id).find('.span-SKU').html(currentSKU);
		if ($scope.originalSKU && $scope.merchanFlag == '1') {
			var skuId = $('#' + id).attr('name');
			// var skuIndex = erp.findIndexByKey($scope.originalSKU, 'skuId', skuId);
			var $skuDom = $('#' + id).find('.edit-sku-aname');
			if (currentSKU != $scope.originalSKU[skuId]) {
				var skuAnameArr = $skuDom.val() ? $skuDom.val().split(',') : [];
				if (skuAnameArr.indexOf($scope.originalSKU[skuId]) != -1) return;
				skuAnameArr.push($scope.originalSKU[skuId]);
				$skuDom.val(skuAnameArr.join(','));
				console.log('add sku to sku别名');
			} else {
				var skuAnameArr = $skuDom.val().split(',');
				var index = skuAnameArr.indexOf($scope.originalSKU[skuId]);
				if (index != -1) {
					skuAnameArr.splice(index, 1);
					$skuDom.val(skuAnameArr.join(','));
					console.log('remove sku from sku别名');
				}
			}
		}
	}

	// 渲染变量值到页面上
	this.renderVarible = function (dom1, dom2, $scope, tempVaribleObj) {
		// var width = $('.merch-varible-box').width();
		// console.log(width,$scope.varibleAtrrs.length,$scope.storages.length)
		// $('.merch-varible-box').css('width',width + 80 * $scope.varibleAtrrs.length + 80 * $scope.storages.length);
		var varibleHeadArr = [];
		for (var i = 0; i < $scope.varibleAtrrs.length; i++) {
			varibleHeadArr.push('<li class="li-new" name="'+ $scope.varibleAtrrs[i].nameEn +'">' + $scope.varibleAtrrs[i].name + '</li>');
		}
		dom1.html(varibleHeadArr.join(''));
		dom2.each(function (index) {
			var varibleConArr = [];
			var temStr;
			var temVarStrs = '';
			for (var i = 0; i < $scope.varibleAtrrs.length; i++) {
				// console.log($scope.varibleAtrrs[i]);
				temStr = tempVaribleObj == undefined ? '' : tempVaribleObj[$scope.varibleAtrrs[i].nameEn] == undefined ? '' : tempVaribleObj[$scope.varibleAtrrs[i].nameEn][index];
				if ($scope.fobidEditPrice || (!$scope.isAdminLogin && ($scope.saleStatus == '3' || $scope.merchanFlag == '1'))) {
					// 已产生订单或者已上架的商品只有管理员可以修改变体
					varibleConArr.push('<li class="li-new can-edit">'
	                        + '<input type="text" class="edit-inp edit-new no-empty" name="'+ $scope.varibleAtrrs[i].nameEn +'" value="'+ temStr +'" placeholder="'+ $scope.varibleAtrrs[i].nameEn +'" ng-focus="addGrayBg($event)" ng-blur="removeGrayBg($event)">'
	                        + '<span class="edit-new-span" style="display:none;" name="'+ $scope.varibleAtrrs[i].nameEn +'"></span>'
	                       	+ '</li>');
				} else {
					varibleConArr.push('<li class="li-new can-edit">'
	                        + '<input type="text" class="edit-inp edit-new no-empty" name="'+ $scope.varibleAtrrs[i].nameEn +'" value="'+ temStr +'" placeholder="'+ $scope.varibleAtrrs[i].nameEn +'" ng-focus="addGrayBg($event)" ng-blur="removeGrayBg($event)">'
	                       	+ '</li>');
				}
				if (temStr) {
					temVarStrs = temVarStrs + '-' + temStr;
				}
			}
			var html = varibleConArr.join('');
			var template = angular.element(html);
			var mobileDialogElement = $compile(template)($scope);
			$(this).find('.varible-new').html(mobileDialogElement);
			$(this).find('.span-SKU').html($scope.addGoodsAutoSKU + temVarStrs);
		});
	}

	// 批量设置变量
	this.banchSetAttr = function (key, $scope) {
		if ($scope.banchSetVal) {
			var currentKey = key.slice(6);
			$('.merch-varible-tbody').each(function () {
				if ($(this).find('.check-inp') && $(this).find('.check-inp').prop('checked')) {
					if (currentKey == 'punit' || currentKey == 'sku-aname' || currentKey == 'basic-color') {
						$(this).find('.edit-' + currentKey).val($scope.banchSetVal);
					} else {
						if (!isNaN($scope.banchSetVal * 1)) {
							if (currentKey == 'pprice' || currentKey =='declarevalue'
									|| currentKey =='storage-charge' || currentKey == 'pprice'
									|| currentKey == 'process-charge' || currentKey == 'unload-charge'
                                    || currentKey == 'send-charge' || currentKey == 'CNTOUSA-charge'
							) {
								$(this).find('.edit-' + currentKey).val('$ ' + $scope.banchSetVal);
							} else if (currentKey == 'buyprice') {
								$(this).find('.edit-' + currentKey).val('¥ ' + $scope.banchSetVal);
							} else {
								$(this).find('.edit-' + currentKey).val($scope.banchSetVal);
							}
						} else {
							layer.msg('请输入数字');
							$scope.banchSetVal = '';
							return;
						}
					}
				}
			})
			$scope.banchSetVal = '';
		}
	}

	// 增加一行
	// var varibleLineIndex = 0;
	this.addVaribleLine = function (varibleLineIndex, dom, $scope, arr) {
		if ($scope.varibleAtrrs.length == 0) {
			layer.msg('请先增加变量');
			return false;
		}
		// varibleLineIndex++;
		// '<ul class="pull-left"><li class="li-remove"><a href="javascript: void(0);" ng-click="removeVaribleTr($event)">删除</a></li></ul>'
		var newAddFlag;
		if ($scope.newAddFlag) {
			newAddFlag = 1;
			$scope.newAddFlag = 0;
		} else {
			newAddFlag = 0;
		}
	  var html = '<div class="merch-varible-tbody clearfix" ng-mouseenter="showCanEditTd($event)" ng-mouseleave="hideCanEditTd($event)" id="varible-line-'+ varibleLineIndex +'" newAddFlag="'+newAddFlag+'">' + $('.merch-varible-tbody').html() + '</div>';
		var template = angular.element(html);
		var mobileDialogElement = $compile(template)($scope);
		dom.append(mobileDialogElement);
		$('#varible-line-' + varibleLineIndex).find('.edit-pprice').show();
		$('#varible-line-' + varibleLineIndex).find('.price-span').hide();
		$('#varible-line-' + varibleLineIndex).find('.edit-pweight').show();
		$('#varible-line-' + varibleLineIndex).find('.weight-span').hide();
		$('#varible-line-' + varibleLineIndex).find('.weight-span-gray').hide();
		$('#varible-line-' + varibleLineIndex).find('.edit-postweight').show();
		$('#varible-line-' + varibleLineIndex).find('.postweight-span').hide();
		$('#varible-line-' + varibleLineIndex).find('.postweight-span-gray').hide();
		$('#varible-line-' + varibleLineIndex).find('.edit-buyprice').show();
		$('#varible-line-' + varibleLineIndex).find('.buyprice-span').hide();
		$('#varible-line-' + varibleLineIndex).find('.merch-variable-pic').attr('src','#');
		if ($scope.orderproduct) {
			// 订单录入-新增-显示删除按钮
			$('#varible-line-' + varibleLineIndex).find('.li-remove').show();
		}
		// console.log(arr);
		$('#varible-line-' + varibleLineIndex).find('.edit-new').each(function () {
			$(this).show();
			if (arr) {
				for (var i = 0; i < arr.length; i++) {
					if ($(this).attr('name') == arr[i].key) {
						$(this).val(arr[i].val);
					}
				}
			} else {
				$(this).val('');
			}
		});
		$('#varible-line-' + varibleLineIndex).find('.edit-new-span').each(function () {
			$(this).hide();
		});
		merchan.showChildSKU('varible-line-' + varibleLineIndex, $scope);
	}
	
	// 编辑sku别名弹框
	this.editSKUAname = function (tempVaribleAtrrs, scb) {
		layer.open({
      title: null,
      type: 1,
      area: ['800px', '350px'],
      skin: 'add-pic-layer add-varible-layer edit-skuAname-layer',
      closeBtn: 0,
      shade: [0.1, '#000'],
      content: $('#asj-sku-aname').html(),
      btn: ['取消', '确认'],
      success: function(layero, index){
          function renderShowVarible () {
          	var lisArr = [];
            for (var i = 0; i < tempVaribleAtrrs.length; i++) {
            	lisArr.push('<li><span class="varible-name">'+ tempVaribleAtrrs[i] +'</span><span class="remove-sku-aname">x</span></li>')
            }
            $(layero).find('.show-current-sku-aname').html(lisArr.join(''));
          }
          renderShowVarible();
          // console.log($(layero).find('#add-sku-aname-inp'));
          $(layero).find('#add-sku-aname-inp').focus();
          $('.show-current-sku-aname').on('click', 'span.remove-sku-aname', function () {
          	var removeVarible = $(this).parent().find('span.varible-name').html();
          	console.log($.inArray(removeVarible, tempVaribleAtrrs))
          	tempVaribleAtrrs.splice($.inArray(removeVarible, tempVaribleAtrrs),1);
          	renderShowVarible();
          });

          $('.add-sku-aname-btn').on('click', function () {
          	var addVaribleName = $(layero).find('#add-sku-aname-inp').val();
          	if (addVaribleName) {
          		if ($.inArray(addVaribleName, tempVaribleAtrrs) != -1) {
          			layer.msg('该变量已存在');
          			return false;
          		} else {
          			tempVaribleAtrrs.push(addVaribleName);
	            	renderShowVarible();
	            	$(layero).find('#add-sku-aname-inp').val('');
          		}
          	} else {
          		layer.msg('输入值不能为空');
          	}
          });
        },
      yes: function(index, layero){
          layer.close(index);
        },
      btn2: function(index, layero){
          layer.close(index);
          scb(tempVaribleAtrrs);
          return false;
        }
    });
	}
	// 选择变量对应图片
	this.choseVariblePic = function (targetElement, $scope, getSelectUrl) {
		if ($scope.picContainer.length == 0) {
			layer.msg('请先上传图片！');
			return false;
		}
		layer.open({
      title: null,
      type: 1,
      area: ['900px', '465px'],
      skin: 'add-pic-layer chose-varible-pic',
      closeBtn: 0,
      shade: [0.1, '#000'],
      content: $('#chose-varible-pic').html(),
      btn: ['取消', '确认'],
      success: function(layero, index){
          var lisArr = [];
          for (var i = 0; i < $scope.picContainer.length; i++) {
          	lisArr.push('<li><img src="'+ $scope.picContainer[i].src +'" /></li>')
          }
          $(layero).find('.chose-pic-box').html(lisArr.join(''));
          $(layero).find('.chose-pic-box').on('click', 'li', function () {
          	$(this).addClass('selected').siblings().removeClass('selected');
          });
        },
      yes: function(index, layero){
          layer.close(index);
        },
      btn2: function(index, layero){
          var selectedImg = $(layero).find('li.selected img');
          if (selectedImg.length == 0) {
          	layer.msg('请选择图片');
          	return false;
          }
          var $currentImg = $(targetElement).find('.merch-variable-pic');
          var isFirst = $(targetElement).parent().parent().prev().hasClass('merch-varible-thead');
          var otherLines = $(targetElement).parent().parent().siblings();
          var isHasColor = (erp.findIndexByKey($scope.varibleAtrrs,'name','颜色') != -1);
          $currentImg.show();
          $currentImg.attr('src', selectedImg.attr('src'));
          // console.log(isFirst,isHasColor)
          // console.log(otherLines);
          if (!$scope.setOneFlg && isHasColor) {
          	otherLines.each(function () {
          		// console.log($(this).find('input[name=colour]').val());
          		// console.log($(targetElement).find('input[name=colour]').val());
          		// console.log($(this).find('.merch-variable-pic'))
          		if ($(this).find('input[name=Color]').val() && ($(this).find('input[name=Color]').val() == $(targetElement).parent().parent().find('input[name=Color]').val())) {
          			$(this).find('.merch-variable-pic').show().attr('src', selectedImg.attr('src'));
          		}
          		if ($(this).find('input[name=colour]').val() && ($(this).find('input[name=colour]').val() == $(targetElement).parent().parent().find('input[name=colour]').val())) {
          			$(this).find('.merch-variable-pic').show().attr('src', selectedImg.attr('src'));
          		}
          	});
					}
					getSelectUrl && getSelectUrl(selectedImg.attr('src'))
          layer.close(index);
          return false;
        }
    });
	}

	// 变量行内输入框美元符号处理
	this.addSpecialIcon = function ($event, icon) {
		var targetElement = $event.target;
		$(targetElement).css('background', '#fff');
		$(targetElement).val($(targetElement).val().replace(/\s+/g,""));
		var val = $(targetElement).val() * 1;
		if (!isNaN(val) && val > 0) {
			if (icon == 'g') {
				$(targetElement).val(val + ' ' + icon);
				return;
			}
			$(targetElement).val(icon + ' ' + val);
		} else {
			var serviceFeeFlag = $(targetElement).hasClass('service-fee') || $(targetElement).hasClass('edit-storage-charge');
			if (serviceFeeFlag) {
				if (isNaN(val)) {
					layer.msg('请输入数字');
					$(targetElement).val('');
					return;
				}
				if (val < 0) {
					layer.msg('请输入大于等于0的数字');
					$(targetElement).val('');
					return;
				}
				$(targetElement).val(icon + ' ' + val);
			} else {
				layer.msg('请输入大于0的数字');
				$(targetElement).val('');
			}
			
		}
	}
	this.removeSpecialIcon = function ($event, icon) {
		var targetElement = $event.target;
		$(targetElement).css('background', '#eee');
		// if ($(targetElement).val().charAt(0) == icon) {
		// 	$(targetElement).val($(targetElement).val().slice(2));
		// }
		if (icon == 'g') {
			$(targetElement).val($(targetElement).val().slice(0, -2));
			return;
		}
		$(targetElement).val($(targetElement).val().slice(2));
	}
	this.alertEditSkuAname = function (currentSKUAname,targetElement) {
		layer.open({
		  title: 'SKU别名',
		  area: ['400px', '280px'],
      skin: 'add-skuaname-layer',
		  // shadeClose:true,
		  btn: [],
		  content: '<textarea style="width: 360px; height: 152px; border: 1px solid #eee; padding: 10px;" name="" id="asj-skuAname-textinp" cols="30" rows="10"></textarea>',
		  closeBtn: 0,
      shade: [0.1, '#000'],
      btn: ['确定'],
      success: function (layero, index) {
      	currentSKUAname = $(targetElement).val();
      	$(layero).find('#asj-skuAname-textinp').val(currentSKUAname).focus();
      },
      yes: function(index, layero){
      	currentSKUAname = $(layero).find('#asj-skuAname-textinp').val();
      	$(targetElement).val(currentSKUAname);
        layer.close(index);
      }
		});
	}
	// 获取页面上变量信息
	this.getVaribleInfo = function ($dom, $scope) {
		$scope.varibleImgs = [];
		if ($scope.variblesTem) {
			$scope.varibles = JSON.parse(JSON.stringify($scope.variblesTem));
		} else {
			$scope.varibles = [];
		}
		for (var k in $scope.inventory) {
			$scope.inventory[k] = 0;
		}
		$dom.each(function (i,e) {
			var currentVarible = {};
			// var id = $(this).attr('id');
			// console.log(i);
			var variblesSumArr = [];
			// $(this).find('.varible-new input').each(function () {
			// 	if ($(this).val().trim()) {
			// 		variblesSumArr.push($(this).val().trim());
			// 	} else {
			// 		variblesSumArr.push('null');
			// 	}
			// });
			var $thisLine = $(this);
			$(this).find('.li-new').each(function () {
				var input = $(this).find('.edit-new');
				var span = $(this).find('.edit-new-span');
				if (input.is(':visible') && input.val().trim()) {
					if ($scope.addProType && input.attr('name')=='Quantity' && isNaN(input.val().trim() * 1) && input.val().trim().charAt(0) != 'Q') {
						// 新增商品时，数量前面加Q
						input.val('Q' + input.val().trim());
						// if ($thisLine.find('.edit-sku-aname').val()) {
						// 	$thisLine.find('.edit-sku-aname').val($thisLine.find('.edit-sku-aname').val()+',' + $thisLine.find('.span-SKU').html())
						// } else {
						// 	$thisLine.find('.edit-sku-aname').val($thisLine.find('.span-SKU').html())
						// }
						var nowskuArr = $thisLine.find('.span-SKU').html().split('-');
						var Qindex = erp.findIndexByKey($scope.varibleAtrrs,'nameEn','Quantity');
						nowskuArr[1+Qindex] = 'Q' + nowskuArr[1+Qindex];
						$thisLine.find('.span-SKU').html(nowskuArr.join('-'));
					}
					variblesSumArr.push(input.val().trim());
				} else if (span.is(':visible') && span.html().trim()) {
					variblesSumArr.push(span.html().trim());
				} else {
					variblesSumArr.push('null');
				}
			});
			var variblesSum = variblesSumArr.join('-');
			var variblesInfo = {};
			if ($(this).attr('name')) {
				variblesInfo['id'] = $(this).attr('name');
			} else {
				variblesInfo['id'] = '';
			}
			if ($(this).attr('specId')) {
				// 录入1688导入商品
				variblesInfo['specId'] = $(this).attr('specId');
			}
			
			// 加时间戳，用于变体排序
			variblesInfo['createDate'] = new Date().getTime() + i*10000;
			// 订单商品录入
			if ($(this).attr('payproductid')) {
				variblesInfo['payProductId'] = $(this).attr('payproductid');
			} else {
				variblesInfo['payProductId'] = '';
			}
			// 个性商品录入
			// if ($scope.personalizePro) {
			// 	variblesInfo['customMessage'] = $(this).find('.edit-basic-color').val();
			// }
			variblesInfo['img'] = $(this).find('.merch-variable-pic').attr('src');
			$scope.varibleImgs.push(variblesInfo['img']);
			if ($(this).find('.edit-pweight').is(':visible')) {
				variblesInfo['weight'] = $(this).find('.edit-pweight').val();
			}
			if ($(this).find('.weight-span').is(':visible')) {
				variblesInfo['weight'] = $(this).find('.weight-span').html();
			}
			if ($(this).find('.weight-span-gray').is(':visible')) {
				variblesInfo['weight'] = $(this).find('.weight-span-gray').html();
			}
			// variblesInfo['weight'] = $(this).find('.edit-pweight').val();
			// variblesInfo['packWeight'] = $(this).find('.edit-postweight').val();
			if ($(this).find('.edit-postweight').is(':visible')) {
				// console.log($(this).find('.edit-postweight').val());
				variblesInfo['packWeight'] = $(this).find('.edit-postweight').val();
			}
			if ($(this).find('.postweight-span').is(':visible')) {
				variblesInfo['packWeight'] = $(this).find('.postweight-span').html();
			}
			if ($(this).find('.postweight-span-gray').is(':visible')) {
				variblesInfo['packWeight'] = $(this).find('.postweight-span-gray').html();
			}
			if ($scope.addProType == 'package' || $scope.productType == '3') {
				variblesInfo['packWeight'] = 0;
			}
			if ($scope.addProType=='drop' && ($scope.addSourceId || $scope.addCJsourceId)) {
				variblesInfo['sellPrice'] = 0;
			}
			if ($(this).find('.edit-pprice').is(':visible')) {
				// console.log('inp-price')
				variblesInfo['sellPrice'] = $(this).find('.edit-pprice').val().slice(2);
			}
			if ($(this).find('.price-span').is(':visible')) {
				// console.log('span-price')
				variblesInfo['sellPrice'] = $(this).find('.price-span').html().slice(2);
			}
			variblesInfo['childSku'] = $(this).find('.span-SKU').html();
			if ($(this).find('.edit-buyprice').is(':visible') && $(this).find('.edit-buyprice').val()) {
				variblesInfo['buyPrice'] = $(this).find('.edit-buyprice').val().slice(2);
			}
			if ($(this).find('.buyprice-span').is(':visible') && $(this).find('.buyprice-span').html()) {
				variblesInfo['buyPrice'] = $(this).find('.buyprice-span').html().slice(2);
			}
			// variblesInfo['unit'] = $(this).find('.edit-punit').val();
			variblesInfo['entryValue'] = $(this).find('.edit-declarevalue').val().slice(2);
			variblesInfo['standard'] = 'long=' +  ($(this).find('.edit-length').val() || '') + ',' + 'width=' + ($(this).find('.edit-width').val() || '') + ',' + 'height=' + ($(this).find('.edit-height').val() || '');
			variblesInfo['storages'] = {};
			$(this).find('.storage-con .li-storage').each(function () {
				var storage = $(this).find('input').val() || 0;
				variblesInfo['storages'][$(this).attr('storageid')] = storage
				$scope.inventory[$(this).attr('storageid')] += (storage * 1);
				storage = null;
			});
			
			variblesInfo['storages'] = JSON.stringify(variblesInfo['storages']);
			variblesInfo['operate'] = '';
			// 新增sku别名
			if ($scope.addProType=='drop' || $scope.productType == '0') {
				variblesInfo['skuAlisa'] = $(this).find('.edit-sku-aname').val().replace(/，/g, ",") || '';
			}
			if ($scope.addProType == 'package' || $scope.productType == '3') {
				variblesInfo['skuAlisa'] = 0;
			}
			if ($scope.addProType=='service' || $scope.productType == '1') {
				if ($(this).find('.edit-storage-charge').val()) {
					variblesInfo['storageCharge'] = $(this).find('.edit-storage-charge').val().slice(2);
				} else {
					variblesInfo['storageCharge'] = 0;
				}
				if ($(this).find('.edit-process-charge').val()) {
					variblesInfo['processCharge'] = $(this).find('.edit-process-charge').val().slice(2);
				} else {
					variblesInfo['processCharge'] = 0;
				}
				if ($(this).find('.edit-unload-charge').val()) {
					variblesInfo['unloadCharge'] = $(this).find('.edit-unload-charge').val().slice(2);
				} else {
					variblesInfo['unloadCharge'] = 0;
				}
				// variblesInfo['sendCharge'] = $(this).find('.edit-send-charge').val().slice(2);
				if ($(this).find('.edit-CNTOUSA-charge').val()) {
					variblesInfo['CNToUSACharge'] = $(this).find('.edit-CNTOUSA-charge').val().slice(2);
				} else {
					variblesInfo['CNToUSACharge'] = 0;
				}
			}
			if ($scope.editMerchFlag && variblesSum == '') {
				variblesSum = 'default';
			} else if (variblesSum == '' && $(this).find('.span-SKU').html().indexOf('default') == -1) {
				variblesSum = 'default';
				variblesInfo['childSku'] = $(this).find('.span-SKU').html() + '-default';
			}
			currentVarible[variblesSum] = variblesInfo;
			// console.log(i, currentVarible);
			// console.log('变体arr', $scope.varibles);
			$scope.varibles.push(currentVarible);
			
		});
		// console.log('finall变体', $scope.varibles);
		return $scope.varibles;
	}
	// 获取多选框信息
	this.getCheckBoxInfo = function ($event, $scopeArr) {
		var currentCheckbox = $($event.target);
		if (currentCheckbox.prop('checked')) {
			$scopeArr.push(currentCheckbox.attr('name'));
		} else {
			$scopeArr.splice($.isArray(currentCheckbox, $scopeArr), 1);
		}
	}
	// 获取消费人群列表
	this.getCustomerListOne = function (scb) {
		erp.postFun('app/locProduct/cusTaglist', JSON.stringify({id: ''}),function (data) {
			var data = data.data;
			if(data.statusCode != 200) {
				layer.msg('服务器错误');
				return false;
			} else {
				scb(JSON.parse(data.result).root);
				// $scope.consumerListOne = JSON.parse(data.result).root;
				// $scope.consOneVal = $scope.consumerListOne[0].id;
			}
		}, function () {
			layer.msg('网络错误');
		});
	}
	this.getCustomerListTwo = function (id, scb) {
		erp.postFun('app/locProduct/cusTaglist', JSON.stringify({id: id}), function (data) {
			var data = data.data;
			if(data.statusCode != 200) {
				layer.msg('服务器错误');
				return false;
			}
			scb(JSON.parse(data.result).root);
		}, function () {
			layer.msg('网络错误');
		});
	}
	this.getCustomerListThree = function (id, scb) {
		erp.postFun('app/locProduct/cusTaglist', JSON.stringify({id: id}), function (data) {
			var data = data.data;
			if(data.statusCode != 200) {
				layer.msg('服务器错误');
				return false;
			}
			scb(JSON.parse(data.result).root);
		}, function () {
			layer.msg('网络错误');
		});
	}
	// 搜索可见用户
	this.searchByUserName = function (username, $scope , token) {
		if (username) {
			var searchUserData = {};
			searchUserData.userId = $scope.chargeSaleman ? $scope.chargeSaleman.split('_')[0] : '';
			// searchUserData.userId = '2';
			searchUserData.token = token;
			searchUserData.data = JSON.stringify({
				inputStr: username
			});
			erp.postFun('app/account/proList', JSON.stringify(searchUserData), function (data) {
				var data = data.data;
				if (data.statusCode != 200) {
					layer.msg('服务器错误');
					return false;
				}
				$scope.searchUserRes = JSON.parse(data.result);
				console.log('userlist',$scope.searchUserRes)
				if ($scope.searchUserRes[0] != null) {
					$scope.hasSearchUserRes = true;
					$scope.noSearchUserRes = false;
				} else {
					$scope.hasSearchUserRes = false;
					$scope.noSearchUserRes = true;
				}
			}, function () {
				layer.msg('网络错误');
			});
		} else {
			$scope.hasSearchUserRes = false;
			$scope.noSearchUserRes = false;
		}
	}
	this.selectSearchUser = function (uid, $scope) {
		if (erp.findIndexByKey($scope.authorityUsers, 'id', uid) != -1) {
			layer.msg('您已添加该用户！');
			return false;
		}
		var selectIndex = erp.findIndexByKey($scope.searchUserRes,'id',uid);
		var selectUser = $scope.searchUserRes[selectIndex];
		selectUser.type = 1;

		$scope.hasSearchUserRes = false;
		$scope.noSearchUserRes = false;
		$scope.authorityUsers.push(selectUser);
		$scope.searchUserName = '';
	}
	this.removeAuthUser = function (uid, $scope) {
		var removeUserIndex = erp.findIndexByKey($scope.authorityUsers, 'id', uid);
		$scope.authorityUsers.splice(removeUserIndex, 1);
	}
	// 点击查看供应商收款信息
	this.showReceiveInfo = function (showId, $scope) {
		var currentSupplierIndex = erp.findIndexByKey($scope.suppliers, 'id', showId);
		var currentReceiveInfo = $scope.suppliers[currentSupplierIndex].payDetail;
		// console.log(currentReceiveInfo);
		layer.open({
      title: null,
      type: 1,
      area: ['620px', '480px'],
      skin: 'add-pic-layer show-receive-info',
      closeBtn: 0,
      shade: [0.1, '#000'],
      content: $('#show-receive-info').html(),
      btn: ['确认'],
      success: function(layero, index){
      	$scope.showReceiveInfoClick = false;
      	 // console.log(currentReceiveInfo);
      },
      yes: function(index, layero){
        //按钮【按钮一】的回调
        $scope.showReceiveInfoClick = true;
        layer.close(index);
      }
    });
	}
	// 删除供应商
  this.removeSupplier = function (id, $scope) {
  	var deleteSupplierIndex = erp.findIndexByKey($scope.suppliers,'id', id);
  	if (deleteSupplierIndex != -1) {
  	 	$scope.suppliers.splice(deleteSupplierIndex, 1);
  	}
  }
  // 搜索供应商
  this.searchBySupplierName = function (supplierName, $scope, userId, token) {
		if (supplierName) {
			var searchSupplierData = {};
			searchSupplierData.userId = userId;
			searchSupplierData.token = token;
			searchSupplierData.data = JSON.stringify({
				inputStr: supplierName,
				status: '1'
			});
			erp.postFun('app/supplier/proList', JSON.stringify(searchSupplierData), function (data) {
				var data = data.data;
				if (data.statusCode != 200) {
					layer.msg('服务器错误');
					return false;
				}
				$scope.searchSupplierRes = JSON.parse(data.result);
				if ($scope.searchSupplierRes[0] != null) {
					$scope.hasSearchSupplierRes = true;
					$scope.noSearchSupplierRes = false;
				} else {
					$scope.hasSearchSupplierRes = false;
					$scope.noSearchSupplierRes = true;
				}
			}, function () {
				layer.msg('网络错误');
			});
		} else {
			$scope.hasSearchSupplierRes = false;
			$scope.noSearchSupplierRes = false;
		}
	}
	// 选中供应商
	this.selectSearchSupplier = function (sid, $scope) {
		if (erp.findIndexByKey($scope.suppliers, 'id', sid) != -1) {
			layer.msg('您已添加该供应商！');
			return false;
		}
		var selectIndex = erp.findIndexByKey($scope.searchSupplierRes,'id',sid);
		var selectSupplier = $scope.searchSupplierRes[selectIndex];

		$scope.hasSearchSupplierRes = false;
		$scope.noSearchSupplierRes = false;
		$scope.suppliers.push(selectSupplier);
		$scope.searchSupplierName = '';
	}
	// 新增商品和编辑商品发送数据处理
  this.settleSendData = function  ($scope, userId, token, userName, operate,id,customerId) {
    $scope.suppliers = $scope.getAddSupplierInfo();
    $scope.varibles = this.getVaribleInfo($('.merch-varible-tbody'), $scope);
	$scope.chineseName = $scope.getChineseName();
    var saveData = {};
    saveData.userId = userId;
	saveData.token = token;
	if($scope.isFromFwFlag){
		saveData.serveSign = 1;
	}
    if ($scope.addProType=='service') {
    	// 新增服务商品
    	saveData.flag = '0';
    }
    if ($scope.addInquiryId) {
    	// 标记新增爬虫商品
    	saveData.flag = '1';
    	saveData.repId = $scope.addInquiryId;
    	console.log('爬虫商品+1');
    }
    // 标记是否备份 $scope.merchanFlag=1--备份 $scope.merchanFlag=0--不是备份
    if ($scope.merchanFlag) {
    	// 标记修改商品的状态
      saveData.flag = $scope.merchanFlag;
    }
    console.log('productType'+$scope.productType);
    if ($scope.productType=='1') {
			// 编辑爬虫商品
    	saveData.productType ='1'
    }
    // 录入淘宝订单商品
    if ($scope.orderproduct) {
    	saveData.orderId = $scope.orderproduct.replace('orderproduct=','');
		}
    // 录入个性商品
    if ($scope.personalizePro) {
    	saveData.customMessage = $scope.customMessage?JSON.stringify($scope.customMessage):'';
    }
		saveData.data = {};
		// 录入1688导入商品
		if ($scope.good1688Info && $scope.good1688Info.productID) {
			saveData.data.productID = $scope.good1688Info.productID;
		}
    if ($scope.addSourceId || $scope.addCJsourceId) {
    	saveData.data.sourceId=id;
    	saveData.data.customerId=customerId;
    	if ($scope.addSourceId) {
    		console.log('独有搜品商品+1', id, customerId)
    	}
    	if ($scope.addCJsourceId) {
    		console.log('cj搜品商品+1', id, customerId)
    	}
    }
    if ($scope.pid) {
      saveData.data.id = $scope.pid;
    }
    if ($scope.saleStatus) {
    	// 标记修改商品的状态
      saveData.data.saleStatus = $scope.saleStatus;
    }
    if ($scope.chargeSaleman) {
    	saveData.data.shelve = $scope.chargeSaleman.split('_')[1];
    	saveData.data.shelveId = $scope.chargeSaleman.split('_')[0];
    } else {
    	saveData.data.shelve = '';
    	saveData.data.shelveId = '';
    }
    saveData.data.nameEn = $scope.merchanName;
    saveData.data.sku = $scope.addGoodsAutoSKU;
    saveData.data.description = $scope.editorContent;
    if ($scope.addProType) {
    	saveData.data.xiaoShouJianYi = $scope.editorContent2;
    }
    saveData.data.unit = $scope.merchanUnit;
		if ($scope.goodsCategoryId == 'package' || $scope.productType == '3') {
			saveData.data.categoryId = 0;
			saveData.data.category = 0;
		} else {
			saveData.data.category = $scope.goodsCategory;
			saveData.data.categoryId = $scope.goodsCategoryId;
		}
    saveData.data.name = $scope.chineseName.join(',');
    saveData.data.entryCode = $scope.customsCode || '';
    saveData.data.entryName = $scope.entryName;
    saveData.data.entryNameEn = $scope.entryNameEn;
    saveData.data.material = $scope.material.join(',');
    saveData.data.packing = $scope.packing.join(',');
    saveData.data.property = $scope.property.join(',');
    saveData.data.buyTime = $scope.ArrivalCycle || '';
    var customers = {};
    for (var i = 0; i < $scope.selectConsumer.length; i++) {
        customers[$scope.selectConsumer[i].id] = {
            id: $scope.selectConsumer[i].id,
            name: $scope.selectConsumer[i].name
        };
    }
    saveData.data.customers = JSON.stringify(customers);
    saveData.data.remark = $scope.remarkInfo;
    saveData.data.authorityStatus = $scope.authority.satus;
    var sendAutAccIdsData = {};
    if ($scope.authority.satus == 0) {
        for (var i = 0; i < $scope.authorityUsers.length; i++) {
            sendAutAccIdsData[$scope.authorityUsers[i].id] = {
                id: $scope.authorityUsers[i].id,
                name: $scope.authorityUsers[i].name,
                num: $scope.authorityUsers[i].num
            }
        }
		}
    saveData.data.autAccIds = JSON.stringify(sendAutAccIdsData);
    var sendSupplierData = {};
    for (var i = 0; i < $scope.suppliers.length; i++) {
        sendSupplierData[$scope.suppliers[i].id] = $scope.suppliers[i];
    }
    saveData.data.supplier = JSON.stringify(sendSupplierData);
    saveData.data.operator = userName;
    saveData.data.operate = operate;
    saveData.data.variantKey = '';
    saveData.data.variantKeyEn = '';
    var varibleNameArr = [];
    var varibleNameEnArr = [];
    for (var i = 0; i < $scope.varibleAtrrs.length; i++) {
        varibleNameArr.push($scope.varibleAtrrs[i].name);
        varibleNameEnArr.push($scope.varibleAtrrs[i].nameEn);
    }
    saveData.data.variantKey = varibleNameArr == [] ? '': varibleNameArr.join('-');
    saveData.data.variantKeyEn = varibleNameEnArr == [] ? '' : varibleNameEnArr.join('-');
	saveData.data.variants = {};
	console.log($scope.varibles);
    for (var i = 0; i < $scope.varibles.length; i++) {
        for (var k in $scope.varibles[i]) {
            saveData.data.variants[k] = $scope.varibles[i][k];
        }
    }
    saveData.data.variants = JSON.stringify(saveData.data.variants);
    var sendDataImg = [];
    var filterPic = JSON.parse(JSON.stringify($scope.picContainer));
    filterPic.splice(0,1);
    for (var i = 0; i < $scope.varibleImgs.length; i++) {
        var deleteIndex = erp.findIndexByKey(filterPic, 'src', $scope.varibleImgs[i]);
        if (deleteIndex != -1) {
            filterPic.splice(deleteIndex, 1);
            continue;
        }
    }
    var filterPicArr = [];
    for (var i = 0; i < filterPic.length; i++) {
        if (filterPic[i].src) {
            filterPicArr.push(filterPic[i].src);
        }
    }
    if (filterPicArr.length <= 0) {
        saveData.data.img = $scope.picContainer[0].src;
    } else {
        saveData.data.img = $scope.picContainer[0].src + ',' + filterPicArr.join(',');
		}
    saveData.data.inventory = JSON.stringify($scope.inventory);
    saveData.data.supplierLink = $scope.merchBuyLinks;
	saveData.data.rivalLink = $scope.rivalLink;
	// console.log($scope.merchInfo);//videoUrl
	if($scope.merchInfo){
		if($scope.merchInfo.videoUrl){
			saveData.data.videoUrl = $scope.merchInfo.videoUrl
		}
	}
    if(customerId == 'touristSourceFlag'){
      saveData.data.touristSource = '001';
    }
	  if ($scope.addProType === 'package' || $scope.productType === '3'){
		  saveData.data.discountInfo = $scope.discountStatus === '1' ? $scope.discountData.map(o =>({
			  ...o,
			  lowNum: Number(o.lowNum),
			  highNum: o.highNum ? Number(o.highNum) : -1,
			  discount: Number(o.discount)
		  })) : ''
		  saveData.data.discountStatus = $scope.discountStatus
	  }
     console.log('录入提交的数据', saveData.data);
    saveData.data = JSON.stringify(saveData.data);
  
	  // console.log('录入提交的json数据', JSON.stringify(saveData));
    return JSON.stringify(saveData);
  }
  // 录入商品成功和修改商品成功后的处理函数
  this.successSubmit = function (data, $scope) {
		layer.closeAll('loading');
		var data = data.data;
		console.log('提交后返回的data',data);
		// {"message":"成功","result":"{\"id\":\"7323DAA7-DA8C-46C6-8506-AD0047C7A306\",\"propertyKey\":\"COMMON\",\"packWeight\":\"1.0\"}","statusCode":"200"}
		// 展示可见用户
		function seleUsersShipMethod (res) {
			var deleteUserId = [];
			layer.open({
        title: null,
        type: 1,
        area: ['560px', '330px'],
        skin: 'offline-assign-layer show-users-layer',
        closeBtn: 0,
        shade: [0.1, '#000'],
        content: $('#sele-users-ship').html(),
        btn: ['确认'],
        success: function (layero, index) {
        	var authInfo = JSON.parse(res.autAccId);
        	var pWight = res.packWeight;
        	var pProperty = res.propertyKey;
        	var getWayData = {};
          getWayData.weight = pWight;
          getWayData.lcharacter = pProperty;
        	erp.postFun2('getWayBy.json',JSON.stringify(getWayData),function (n) {
              console.log('物流',n)
              var wuliulist=n.data;
              var optionDomArr = [];
              for (var i = 0; i < wuliulist.length; i++) {
              	optionDomArr.push('<option value="'+wuliulist[i].enName+'">'+wuliulist[i].enName+'</option>');
              }
              var trDomArr = [];
              for (var k in authInfo) {
              	if (authInfo[k].shopMethod) continue;
          			var tdUserCode = '<td><span>'+ authInfo[k].num +'</span></td>';
          			var tdUserName = '<td><span>'+ authInfo[k].name +'</span></td>';
          			var selectShipDom = '<td><select class="sele-ship" userId="'+authInfo[k].id+'">'+optionDomArr.join('')+'</select></td>';
          			trDomArr.push('<tr class="la_tr la_tr01">'+tdUserCode+tdUserName+selectShipDom+'</tr>');
              }
              $(layero).find('.ea-list-table tbody').html(trDomArr.join(''));
          },err)
        },
        yes: function(index, layero){
     //    	pojo/product/privateLogistic   post    {autAccId,productId}
					// autAccId:{用户id:物流}
					var sendAuthInfo = {};
					$(layero).find('.sele-ship').each(function () {
						sendAuthInfo[$(this).attr('userId')] = $(this).val();
					});
					var setShipData = {
						autAccId: JSON.stringify(sendAuthInfo),
						productId: res.id
					};
					console.log('保存可见用户的信息（包含物流）',setShipData);
					layer.load(2);
					erp.postFun('pojo/product/privateLogistic', JSON.stringify(setShipData),function (data) {
						console.log(data);
						layer.closeAll('loading');
						layer.close(index);
						if ($scope.addSuccess) {
							// location.href = 'manage.html#/merchandise/list/drop/6';
							if ($scope.personalizePro) {
								location.href = "manage.html#/merchandise/list/personalize/6";
							} else {
								location.href = "manage.html#/merchandise/list/drop/6";
							}
						}
						if ($scope.editSuccess) {
							if ($scope.skuCombineFlag) {
								// location.href = "manage.html#/merchandise/SkuGroupList/add";
								angular.element('#add-pro-btn').hide();
								window.open("manage.html#/merchandise/SkuGroupList/add", '_blank', '');
								return;
							}
							if ($scope.personalizePro) {
								location.href = 'manage.html#/merchandise/list/personalize/' + $scope.merchanStatus;
							} else {
								location.href = 'manage.html#/merchandise/list/drop/' + $scope.merchanStatus;
							}
						}
					},err);
        	return false;
          // layer.close(index);
        }
      });
		}

		if (data.statusCode != 200) {
			if (data.statusCode == 406 && $scope.editSuccess) {
				layer.msg('商品正在审核中，不能修改，请到审核中的副本列表查看！');
				return false;
			}
			$scope.hasSavedData = false;
			for (var k in $scope.inventory) {
				$scope.inventory[k] = 0;
			}
			layer.msg(data.message);
			$scope.hasSavedInfo = false;
			console.log('fei200',$scope.hasSavedInfo)
			return false;
		}
		// 清除本地缓存的图片
		sessionStorage.removeItem('addMerchImgs');
		sessionStorage.removeItem('lastAddImgTime')
		console.log('200',$scope.hasSavedInfo);
		if (data.result != '') {
			console.log($scope.isFromFwFlag)
			if($scope.isFromFwFlag){
				//保存服务费用  result.id
				var upArr = $scope.cnMoneyList.concat($scope.enMoneyList,$scope.thMoneyList,$scope.deMoneyList,$scope.inMoneyList);
				// {productId}/{userId}/{cnDay}/{usDay}/{spId
				var upJson = {};
				console.log($scope.cnDays,$scope.enDays)
				var url = 'erp/serveProduct/addServeMoney/'+ data.result +'/' + $scope.userId + '/'+$scope.cnDays+','+$scope.enDays+','+$scope.thDays+','+$scope.deDays+','+$scope.inDays+'/'+$scope.listItemId
				console.log(url)
				erp.postFun(url,upArr,function(data){
					console.log(data)
					layer.msg(data.data.message)
					if(data.data.statusCode==200){
					
					}
				},function(data){
					console.log(data)
				})
			}else{
				var result = JSON.parse(data.result);
				console.log('录入成功返回的res',result);
				if ($scope.addSuccess && $scope.taskId) {
					erp.postFun('erp/pieceworkAssessment/updateTask', JSON.stringify({
						locproductId: result.id,
						taskId: $scope.taskId.replace('taskid=','')
					}),function (data) {
						console.log('标识找货-录入成功',data);
					});
				}
			}
			
		}
		if ($scope.addInquiryId) {
			console.log($scope.addInquiryId);
			merchan.opeInquiry('app/alibaba/deleteProducts',  {ids: $scope.addInquiryId}, function (data) {
					console.log('删除一个询价商品',data);
			});
		}
		if ($scope.addProType && $scope.personalizeId) {
			// 从爬虫数据新增个性商品
			merchan.opeInquiry('caigou/soufeel/delSoufeelInfo', {"id": $scope.personalizeId.replace('personalize=','')}, function (data) {
         	console.log('删除一个个性爬虫商品',data);
      });
		}
		if ($scope.addSuccess) {
			layer.msg('录入成功');
			if ($scope.authority.satus == 0 && $scope.addProType=='drop') {
				seleUsersShipMethod(result);
			} else if ($scope.addProType=='service'){
				if($scope.isFromFwFlag){//新的服务商品
					location.href = "manage.html#/merchandise/fuwuShenHeZhong"; //审核中
				}else{
					location.href = "manage.html#/merchandise/list/service/1"; //19-7-5成功后的跳转
				}
			}else {
				// $location.path("/merchandise/wait-submit");
				console.log($scope.skuCombineFlag)
				if ($scope.skuCombineFlag) {
					angular.element('#add-pro-btn').hide();
					window.open("manage.html#/merchandise/SkuGroupList/add", '_blank', '');
					// location.href = "manage.html#/merchandise/SkuGroupList/add";
					return;
				}
				if ($scope.personalizePro) {
					location.href = "manage.html#/merchandise/list/personalize/6";
				} else {
					location.href = "manage.html#/merchandise/list/drop/6";
				}
			}
		}
		if ($scope.editSuccess) {
			console.log($scope.authority.satus);
			console.log($scope.authority.satus == 0)
			layer.msg('修改成功');
			if ($scope.authority.satus == 0 && $scope.productType=='0') {
				var authInfo = JSON.parse(result.autAccId);
				var actWuliuTan;
				for (var k in authInfo) {
					if (authInfo[k].shopMethod == '') {
						actWuliuTan = true;
						console.log(actWuliuTan,k);
					}
				}
				if (actWuliuTan) {
					seleUsersShipMethod(result);
				} else {
					toPageAfterEdit();
				}
			} else {
				toPageAfterEdit();
			}

			function toPageAfterEdit () {
				if ($scope.productType=='1') {
            location.href = 'manage.html#/merchandise/list/service/' + $scope.merchanStatus;
        } else {
        		if ($scope.personalizePro) {
							location.href = 'manage.html#/merchandise/list/personalize/' + $scope.merchanStatus;
						} else {
							location.href = 'manage.html#/merchandise/list/drop/' + $scope.merchanStatus;
						}
        }
			}
		}
	}

	function err (err) {
		layer.closeAll('loading');
		console.log(err);
	}

	// 渲染变体信息到页面上
	var userInfo = erp.getUserInfo();
	this.renderVariantToPage = function ($scope, variblesInfo) {
		// 记录原始sku $scope.originalSKU
		console.log(variblesInfo);
		$scope.originalSKU = {};
		$('.merch-varible-tbody').each(function (index) {
			// console.log(index);
			// console.log(variblesInfo[index]);
			var $this = $(this);
			//下架上架按钮
			var id = variblesInfo[index].id ? variblesInfo[index].id :variblesInfo[index].ID;
			if(variblesInfo[index].isSoldOut){
				if(variblesInfo[index].isSoldOut==0){
					$this.find('.li-xiaji').show().attr('data-id',id);
					$this.find('.li-shangjia').hide().attr('data-id',id);
				}else if(variblesInfo[index].isSoldOut==1){
					$this.find('.li-xiaji').hide().attr('data-id',id);
					$this.find('.li-shangjia').show().attr('data-id',id);
					$this.addClass('xiajia');
					$this.find('input').attr('disabled',true).css('color',"#CDC9C9");
					$this.find('select').attr('disabled',true);
				}
			}else{
				$this.find('.li-xiaji').show().attr('data-id',id);
				$this.find('.li-shangjia').hide().attr('data-id',id);
			}
			

			// 记录原始id(删除用)
			$this.attr('name', variblesInfo[index].id || variblesInfo[index].ID);
			// 记录1688skuid(录入1688导入商品用)
			$this.attr('specId', variblesInfo[index].specId);
			// 记录原始sku(删除用)
			$this.attr('osku', variblesInfo[index].variantKey);
			if ($scope.orderproduct) {
				// 订单商品录入专用
				$this.attr('payproductid', variblesInfo[index].payProductId);
			}
			$this.find('.merch-variable-pic').show().attr('src', variblesInfo[index].img || variblesInfo[index].IMG);
			$this.find('.variable-pic-big').attr('src', variblesInfo[index].img || variblesInfo[index].IMG);
			var variantKey = variblesInfo[index].variantKey || variblesInfo[index].VARIANTKEY;
			var variantKeyArr = variantKey == 'default' ? [] : variantKey == null ? []: variantKey.split('-');
			if (variantKeyArr.length > 0) {
				for (var i = 0; i < variantKeyArr.length; i++) {
					// $this.find('.edit-new').eq(i).val(variantKeyArr[i] == 'null' ? '' : variantKeyArr[i]);
					if ($scope.fobidEditPrice || (!$scope.isAdminLogin && ($scope.saleStatus == '3' || $scope.merchanFlag == '1'))) {
						// 已产生订单或者已上架的商品只有管理员可以修改变体
						$this.find('.edit-new').eq(i).hide();
						$this.find('.edit-new-span').eq(i).show().html(variantKeyArr[i] == 'null' ? '' : variantKeyArr[i]);
						$this.find('.edit-new-span').eq(i).attr('title',variantKeyArr[i]);
					} else {
						$this.find('.edit-new-span').eq(i).hide();
						$this.find('.edit-new').eq(i).show().val(variantKeyArr[i] == 'null' ? '' : variantKeyArr[i]);
					}
				}
			}
			$this.find('.weight-span-gray').hide()
			$this.find('.weight-span').hide();
			$this.find('.edit-pweight').show().val(variblesInfo[index].weight || variblesInfo[index].WEIGHT);
			$this.find('.postweight-span').hide();
			$this.find('.postweight-span-gray').hide()
			$this.find('.edit-postweight').show().val(variblesInfo[index].packWeight || variblesInfo[index].PACKWEIGHT);
			var changW = variblesInfo[index].isChangeWeight;
			if (changW && changW == '1') {
				$this.find('.weight-span-gray').hide()
				$this.find('.edit-pweight').hide();
				$this.find('.weight-span').show().html(variblesInfo[index].weight || variblesInfo[index].WEIGHT);
				$this.find('.edit-postweight').hide();
				$this.find('.postweight-span-gray').hide()
				$this.find('.postweight-span').show().html(variblesInfo[index].packWeight || variblesInfo[index].PACKWEIGHT);
			}
			
			if ($scope.fobidEditPrice) {
				$this.find('.weight-span').hide();
				$this.find('.edit-pweight').hide();
				$this.find('.weight-span-gray').show().html(variblesInfo[index].weight || variblesInfo[index].WEIGHT);
				$this.find('.edit-postweight').hide();
				$this.find('.postweight-span').hide();
				$this.find('.postweight-span-gray').show().html(variblesInfo[index].packWeight || variblesInfo[index].PACKWEIGHT);
			}
			if (erp.isAdminLogin() || (userInfo && userInfo.job == '配货') || ['王慧云', '郭慧琪'].includes(userInfo.erploginName)) {
				$this.find('.weight-span-gray').hide()
				$this.find('.weight-span').hide();
				$this.find('.edit-pweight').show().val(variblesInfo[index].weight || variblesInfo[index].WEIGHT);
				$this.find('.postweight-span').hide();
				$this.find('.postweight-span-gray').hide()
				$this.find('.edit-postweight').show().val(variblesInfo[index].packWeight || variblesInfo[index].PACKWEIGHT);
			}
			
			if ($scope.fobidEditPrice) {
				$this.find('.edit-pprice').hide();
				$this.find('.price-span').show().html('$ ' + variblesInfo[index].sellPrice);
			} else {
				$this.find('.edit-pprice').show();
				// console.log(variblesInfo[index].sellPrice);
				$this.find('.edit-pprice').val('$ ' + variblesInfo[index].sellPrice);
			}
			if ($scope.forbidChanBuyPrice) {
				$this.find('.edit-buyprice').hide();
				$this.find('.buyprice-span').show().html('¥ ' + variblesInfo[index].costPrice);
			} else {
				$this.find('.buyprice-span').hide();
				$this.find('.edit-buyprice').show().val('¥ ' + variblesInfo[index].costPrice);
			}
			// $this.find('.edit-buyprice').val('¥ ' + variblesInfo[index].costPrice);
			$this.find('.span-SKU').html(variblesInfo[index].sku || variblesInfo[index].SKU);
			$scope.originalSKU[variblesInfo[index].id] = variblesInfo[index].sku || variblesInfo[index].SKU;
			// console.log(variblesInfo[index].skuAlisa);
			$this.find('.edit-sku-aname').val(variblesInfo[index].skuAlisa);
			$this.find('.edit-declarevalue').val('$ ' + (variblesInfo[index].entryValue || variblesInfo[index].ENTRYVALUE || 0));
			var standard = variblesInfo[index].standard || variblesInfo[index].STANDARD;
			if (standard) {
				var standardInfo = standard.split(',');
				$this.find('.edit-length').val(standardInfo[0].replace('long=', ''));
				$this.find('.edit-width').val(standardInfo[1].replace('width=', ''));
				$this.find('.edit-height').val(standardInfo[2].replace('height=', ''));
			} else {
				$this.find('.edit-length').val('');
				$this.find('.edit-width').val('');
				$this.find('.edit-height').val('');
			}
			var invsInfo = variblesInfo[index].invs;
			if (invsInfo) {
				$this.find('.storage-con .li-storage').each(function () {
					var storageId = $(this).attr('storageid');
					var storageIndex = erp.findIndexByKey(invsInfo, 'storageId', storageId);
					if (storageIndex != -1) {
						$(this).find('input').val(invsInfo[storageIndex].inventory);
					}
				});
			}
			$this.find('.edit-storage-charge').val('$ ' + variblesInfo[index].STORAGECHARGE);
			$this.find('.edit-process-charge').val('$ ' + variblesInfo[index].PROCESSCHARGE);
			$this.find('.edit-unload-charge').val('$ ' + variblesInfo[index].UNLOADCHARGE);
			// $this.find('.edit-send-charge').val('$ ' + variblesInfo[index].sendCharge);
			$this.find('.edit-CNTOUSA-charge').val('$ ' + variblesInfo[index].CNTOUSACHARGE);
			if ($scope.orderproduct) {
				// 订单录入不可以删除默认变体
				$this.find('.li-remove').hide();
			}
			// if ($scope.personalizePro) {
			// 	$this.find('.edit-basic-color').val(variblesInfo[index].customMessage);
			// }
		});
		console.log('原始sku',$scope.originalSKU);
	}

	// 验证函数
	function VMerchName($scope) {
      if ($scope.merchanName == '') {
          $scope.verifyMerchName = true;
      } else {
          $scope.verifyMerchName = false;
      }
  }
  function VMerchDesc($scope) {
      if ($scope.editor.txt.text() == '') {
          $scope.verifyMerchDesc = true;
      } else {
          $scope.verifyMerchDesc = false;
      }
  }
  function VMerchPic($scope) {
      if ($scope.picContainer.length == 0) {
          $scope.verifyMerchPic = true;
      } else {
          $scope.verifyMerchPic = false;
      }
  }
  // 变量部分非空验证
  function verifyVeribleEmpty($scope) {
      $scope.verifyVeribleRes = false;
      var skuArr = [];
      $('.merch-varible-tbody').each(function () {
				var $thisLine = $(this);
				if(!$thisLine.hasClass('xiajia')){
					$thisLine.css('background', '#fff');
					if ($thisLine.find('.merch-variable-pic').attr('src') == '#') {
							layer.msg('变体信息：图片必选');
						$scope.verifyVeribleRes = true;
						$thisLine.css('background', '#fcd9af');
						return false;
					}
					$thisLine.find('.no-empty').each(function () {
						if ($(this).is(':visible') && $(this).val() == '') {
								layer.msg('变体信息：请查看必填项');
							$scope.verifyVeribleRes = true;
							$thisLine.css('background', '#fcd9af');
							console.log($(this));
							return false;
						}
					});
					if ($scope.addProType=='service' || $scope.productType=='1') {
						var temArr=[];
									$thisLine.find('.service-fee').each(function (i) {
										console.log($(this).val(),i);
										if (!$(this).val() || ($(this).val() && ($(this).val().slice(2) * 1) == 0)) {
											temArr.push($(this).val());
											console.log(temArr,i);
										}
									});
									if (temArr.length == 3) {
										layer.msg('处理费、卸货费、国内运输费不能全部为0');
										$scope.verifyVeribleRes = true;
							$thisLine.css('background', '#fcd9af');
							console.log($(this));
							return false;
									}
					}
					$thisLine.find('.edit-new').each(function () {
						if ($(this).val().indexOf('-') != -1 || $(this).val().indexOf('&') != -1 || $(this).val().indexOf('^') != -1 || $(this).val().indexOf('#') != -1) {
							$scope.verifyVeribleRes = true;
							$thisLine.css('background', '#fcd9af');
							return false;
						}
					});
					var sellPrice = $thisLine.find('.edit-pprice') && $thisLine.find('.edit-pprice').val();
					if (sellPrice && sellPrice.indexOf('.') > -1 && (sellPrice.length - sellPrice.indexOf('.') - 1 > 2)) {
						layer.msg('商品价格最多两位小数');
						$scope.verifyVeribleRes = true;
						$thisLine.css('background', '#fcd9af');
						return false;
					}
					var currentSKU = $thisLine.find('.span-SKU').html();
					if (currentSKU.length > 39) {
							layer.msg('sku过长');
							$scope.verifyVeribleRes = true;
							$thisLine.css('background', '#fcd9af');
							return false;
					}
					skuArr.push($(this).find('.span-SKU').html().toLowerCase());
					$thisLine.find('.span-SKU').css('color', '#3d3d3d');
					if ($scope.property.indexOf('OVERSIZE') != -1) {
						if (!$thisLine.find('.edit-length').val() || !$thisLine.find('.edit-width').val() || !$thisLine.find('.edit-height').val()) {
							$scope.verifyVeribleRes = true;
							$thisLine.css('background', '#fcd9af');
							layer.msg('抛货商品必须填长宽高')
							return false
						}
					}
					// 包装商品必须填长宽高
					if ($scope.merchType == '3'
						|| $scope.productType == '3') {
						if (!$thisLine.find('.edit-length').val() || !$thisLine.find('.edit-width').val() || !$thisLine.find('.edit-height').val()) {
							$scope.verifyVeribleRes = true;
							$thisLine.css('background', '#fcd9af');
							layer.msg('包装商品必须填长宽高')
							return false
						}
					}
				}
      });
      if (erp.testIsRepeatInArr(skuArr).isrepeat) {
      		layer.msg('变体重复');
          $scope.verifyVeribleRes = true;
          var repeatSku = erp.testIsRepeatInArr(skuArr).repeatstr;
          for (var i = 0; i < skuArr.length; i++) {
              if (skuArr[i] == repeatSku) {
                  $('.merch-varible-tbody').eq(i).find('.span-SKU').css('color', '#a94442');
              }
          }
          return false;
			}
		if (skuArr.length > 100) {
			layer.msg('变体不能超过100');
			$scope.verifyVeribleRes = true;
			return false;
		}
  }
  function verifyChineseName($scope) {
      $('#chinese-name').find('.top-three').each(function () {
          if ($(this).val() == '') {
              $scope.verifyChineseNameRes = true;
              $('#chinese-name').find('.chinese-name-tip').css('color', '#a94442');
              return false;
          } else {
              $scope.verifyChineseNameRes = false;
              $('#chinese-name').find('.chinese-name-tip').css('color', '#69696c');
          }
      });
	}
	
	function VCustomsCode ($scope) {
		if ($scope.customsCode && $scope.customsCode.length > 20) {
			$scope.verifyCustomsCode = true;
		} else {
			$scope.verifyCustomsCode = false;
		}
	}
  function VEntryName($scope) {
      if ($scope.entryNameEn == '') {
          $scope.verifyEntryName = true;
      } else if ($scope.entryNameEn.length > 20) {
          $scope.verifyEntryName = true;
      } else {
          var content = $scope.entryNameEn;
          var re = chineseReqG;
          if (re.test(content)) {
              $scope.verifyEntryName = true;
          } else {
              $scope.verifyEntryName = false;
          }
      }
  }
  function VEntryNameEn($scope) {
      if ($scope.entryName == '') {
          $scope.verifyEntryNameEn = true;
      } else if ($scope.entryName.length > 10) {
          $scope.verifyEntryNameEn = true;
      } else {
          var content = $scope.entryName;
          var re = chineseReqG;
          if (re.test(content)) {
              //返回中文的个数
              if (content.match(re).length >= 2) {
                  $scope.verifyEntryNameEn = false;
              } else {
                  $scope.verifyEntryNameEn = true;
              }
          } else {
              $scope.verifyEntryNameEn = true;
          }
          // $scope.verifyEntryNameEn = false;
      }
  }
  function VPacking($scope) {
      if ($scope.packing.length == 0) {
          $scope.verifyPacking = true;
      } else {
          $scope.verifyPacking = false;
      }
  }
  function VProperty($scope) {
      if ($scope.property.length == 0) {
          $scope.verifyProperty = true;
      } else {
          $scope.verifyProperty = false;
      }
  }
  function VMaterial($scope) {
      if ($scope.material.length == 0) {
          $scope.verifyMaterial = true;
      } else {
          $scope.verifyMaterial = false;
      }
  }
  function VArrivalCycle($scope) {
      // console.log($scope.ArrivalCycle,$scope.ArrivalCycle.trim())
      if ($scope.ArrivalCycle.trim() == '') {
          $scope.verifyArrivalCycle = true;
      } else {
          $scope.verifyArrivalCycle = false;
      }
  }
  function VConsumersGroup($scope) {
      if ($scope.selectConsumer.length == 0) {
          $scope.verifyConsumersGroup = true;
      } else {
          $scope.verifyConsumersGroup = false;
      }
  }
  function VAuthUser($scope) {
      if ($scope.authority.satus == 1) {
          $scope.verifyAuthUser = false;
          return false;
      }
      if ($scope.authority.satus == 0 && $scope.authorityUsers.length == 0) {
          $scope.verifyAuthUser = true;
      } else {
          $scope.verifyAuthUser = false;
      }
  }
  function VBuylink($scope) {
      if ($scope.merchBuyLinks.length == 0) {
          $scope.verifyBuylink = true;
      } else {
          $scope.verifyBuylink = false;
      }
  }
  function VRivallink($scope) {
      if ($scope.rivalLink.length == 0) {
          $scope.verifyRivallink = true;
      } else {
          $scope.verifyRivallink = false;
      }
  }
function VsetNum($scope) {
	if (!$scope.setNum) {
		$scope.verifySetNum = true;
	} else {
		$scope.verifySetNum = false;
	}
}
// 验证折扣区间
function Vdiscount($scope) {
		$scope.verifyDiscountMsg = $scope.discountStatus === '1' && !!($scope.discountData.find(o => !o.discount))
}


  this.isLeagalVerify = function ($scope) {
      VMerchName($scope);
      if ($scope.verifyMerchName == true) {
          $('#merchan-name').focus();
          console.log(1);
          return false;
      }
			if (
				$scope.merchType == '0'
				|| $scope.merchType == '2'
				|| $scope.merchType == '3'
				|| $scope.productType=='0'
				|| $scope.productType == '3'
			) {
      	VMerchDesc($scope);
	      if ($scope.verifyMerchDesc == true) {
	      	$("html,body").animate({scrollTop:$(".merchan-desc").offset().top},500);
	      	return false;
	      }
      }
      VMerchPic($scope);
      if ($scope.verifyMerchPic == true) {
          $("html,body").animate({scrollTop: $(".merch-pics-title").offset().top - 100}, 500);
          console.log(2);
          return false;
      }
      verifyVeribleEmpty($scope);
      if ($scope.verifyVeribleRes == true) {
          $("html,body").animate({scrollTop: $(".merch-variable").offset().top - 100}, 500);
          console.log(3);
          return false;
			}
			if (
				$scope.merchType == '0'
				|| $scope.merchType == '2'
				|| $scope.productType == '0'
			) {
				verifyChineseName($scope);
				if ($scope.verifyChineseNameRes == true) {
					$("html,body").animate({ scrollTop: $(".chinese-name").offset().top - 100 }, 500);
					console.log(4);
					return false;
				}
			}
			// 验证海关编码start
			VCustomsCode($scope)
			if ($scope.verifyCustomsCode == true) {
				$('#customs-code').focus();
				return false;
			}
			// 验证海关编码end
			if (
				$scope.merchType == '0'
				|| $scope.merchType == '2'
				|| $scope.productType == '0'
			) {
				VEntryName($scope);
				if ($scope.verifyEntryName == true) {
					$('#entry-name-en').focus();
					console.log(5);
					return false;
				}
				VEntryNameEn($scope);
				if ($scope.verifyEntryNameEn == true) {
					$('#entry-name').focus();
					console.log(6);
					return false;
				}
			}
			VPacking($scope);
			if ($scope.verifyPacking == true) {
				$("html,body").animate({ scrollTop: $("#merchan-packing").offset().top - 100 }, 500);
				console.log(7);
				return false;
			}
      VProperty($scope);
      if ($scope.verifyProperty == true) {
          $("html,body").animate({scrollTop: $("#merchan-property").offset().top - 100}, 500);
          console.log(8);
          return false;
      }
	if (
		$scope.merchType == '0'
		|| $scope.merchType == '2'
		|| $scope.productType == '0'
	) {
		VMaterial($scope);
		if ($scope.verifyMaterial == true) {
			$("html,body").animate({ scrollTop: $("#merchan-material").offset().top - 100 }, 500);
			console.log(9);
			return false;
		}
		VArrivalCycle($scope);
		if ($scope.verifyArrivalCycle) {
			$('#arrival-cycle').focus();
			console.log(10);
			return false;
		}
		VConsumersGroup($scope);
		if ($scope.verifyConsumersGroup == true) {
			$("html,body").animate({ scrollTop: $(".consumers-group").offset().top - 100 }, 500);
			console.log(11);
			return false;
		}
		VAuthUser($scope);
		if ($scope.verifyAuthUser == true) {
			$("html,body").animate({ scrollTop: $("#authrity-users").offset().top - 100 }, 500);
			console.log(12);
			return false;
		}
	}

	if( $scope.merchType == '3'||$scope.productType == '3'){
		VsetNum($scope);
		if($scope.verifySetNum){
			$("html,body").animate({ scrollTop: $("#vsetNum").offset().top - 100 }, 500);
			return false;
		}
	}
	
	  // 折扣区间
	  if($scope.addProType === 'package' || $scope.productType === '3'){
		  Vdiscount($scope)
		  if ($scope.verifyDiscountMsg){
			  $("html,body").animate({ scrollTop: $("#discount-warp").offset().top - 100 }, 500);
			  return false
		  }
	  }
	
      if (
				$scope.merchType == '0'
				|| $scope.merchType == '2'
				|| $scope.merchType == '3'
				|| $scope.productType == '0'
				|| $scope.productType == '3'
			) {
          VBuylink($scope);
          if ($scope.verifyBuylink) {
          	$('#buy-link-inp').focus();
	          console.log(13);
	          return false;
          }
          if ($scope.addSourceId || $scope.addCJsourceId) {
          	VRivallink($scope);
          	if ($scope.verifyRivallink) {
          		$('#rival-link-inp').focus();
		          console.log(14);
		          return false;
          	}
          }
      }
      return true;
  }
	
}]);
