~(function(){
    var app = angular.module('purchase-app');
    //erp采购订单
	app.controller('purchaseOrdCtrl', ['$scope', 'erp', '$routeParams', '$timeout', function ($scope, erp, $routeParams, $timeout) {
		console.log('erp采购订单22222222222222')
		const currentApi = {
			caigouGuanlian_old: 'caigou/alProduct/chaXunCaiGouGuanLian',//
			caigouGuanlian: 'procurement/dealWith/getPurchaseRelatedInformation',//
		}
		$scope.status = $routeParams.stu;
		$scope.isNewFlag = $routeParams.new;
		$scope.pageNum = '1';
		$scope.pageSize = '50';
		$scope.startTime = '';
		$scope.endTime = '';
		if($scope.status == '2'){
            $scope.startTime = '2020-05-07';//moment().add(-2, 'd').format('YYYY-MM-DD')
            $('#c-data-time').val($scope.startTime);
		}
		var online = 0;
		$scope.sta = true;
		if ($scope.status != '2' && $scope.status != '3' && $scope.status != '4' && $scope.status != '11' && $scope.status != '12') {
			$('#searchInfo').attr('placeholder', '请输入1688订单号/创建人')
		} else if ($scope.status == '11' || $scope.status == '12') {
			$('#searchInfo').attr('placeholder', '采购人')
		}
		else {
			console.log('1111');
			$('#searchInfo').attr('placeholder', '')
		}
		$('.pur-chuli').eq(0).addClass('pur-chuli-act');
		$('.pur-tuihuo').eq(0).addClass('pur-chuli-act');
		$scope.yiChangStu = 0;
		$scope.wuLiuVal = 'y';
		$scope.btnVal = "有物流"
		$scope.wuLiuBtnFlag = true;
		$scope.payStatus = "0"
		$scope.is1688 = "0"
		$scope.nbcgPayStu = '0';
		function getListFun() {
			if ($scope.status != 10 && $scope.status != 11 && $scope.status != 12) {
				getOrdListFun()
			}
			else if ($scope.status == 11) {
				expenditureListFun()
			}
			else if ($scope.status == 12) {
				refundListFun()
			}
			// 退货单 - 1.04 退货单 功能
			else if ($scope.status == 'r-10' || $scope.status == 'r-11') {
				getOrdListFun()
			}
			else {
				glGetListFun()
			}
		}
		$scope.tabList = function (i) {
			$scope.payStatus = i
			$scope.is1688 = i
			if ($scope.status == 8 || $scope.status == 0) {
				getOrdListFun()
			} else if ($scope.status == 11) {
				expenditureListFun()
			}
			if (i == 0) {
				$scope.sta = true
			} else if (i == 1) {
				$scope.sta = false
			}
		}
		function getOrdListFun() {
			erp.load()
			var printData = {},data = {};
			let url = 'procurement/order/queryOrderSignList'
			printData.pageNum = $scope.pageNum + '';
			printData.pageSize = $scope.pageSize;
			printData.beginDate = $scope.startTime
			printData.endDate = $scope.endTime

			if($scope.status == 2) data.anWuLiuFen = $scope.wuLiuVal
			data.biantiSku = $scope.biantiSku;//变体sku
			data.orderId = $scope.orderId;//1688订单号
			data.caigouren = $scope.caigouren;//采购人
			data.fuKuanRen = $scope.fuKuanRen;//付款人
			data.gongHuoGongSi = $scope.gongHuoGongSi;//供货公司
			data.zhuiZongHao = $scope.zhuiZongHao;//追踪号
			data.status = $scope.status;
			data.ri = $scope.ri;
			data.yiChangZhuangTai = $scope.yiChangStu;
			if ($scope.status == 7) {// 采购异常
				url = 'caigou/procurement/caiGouDingDanLieBiao'
				data.chuLiFangShiType = '2';
				data.yiChangLeiXing = $scope.ycStuVal;
				data.caiGouZhangHu = $scope.ycCgZhVal;
			} else if ($scope.status == 9) {//采购退款
				data.chuLiFangShiType = '1';
			} else if ($scope.status == 8) {

				data.payStatus = $scope.payStatus;
				console.log("02", $scope.payStatus)
				data.caigouType = "2";
			} else if ($scope.status == 0) {
				data.is1688 = $scope.is1688;
				console.log("01", $scope.is1688)
			} else if ($scope.status == 13) {//内部采购
				data.caigouType = '1';
				data.payStatus = $scope.nbcgPayStu;
			} else if ($scope.status == 'r-10' || $scope.status == 'r-11') { // 传参兼容 - 1.04 退货单 功能
				data.status = $scope.status.replace('r-','')
			}

			printData.data = data
			if($scope.status == 7){// 签收异常
				printData = Object.assign(printData,printData.data)
				delete printData.data
				console.log(printData,'22222222222222222222222222222222222')
			}
			erp.postFun(url, JSON.stringify(printData), function (data) {
				console.log("data", data)
				// console.log("data.result",data.data.result)
				var obj = data.data.data || JSON.parse(data.data.result);
				console.log('obj',obj)
				layer.closeAll('loading')
				if (obj) {
					// obj = JSON.parse(obj)
					$scope.erpordTnum = obj.total;
					$scope.erporderList = obj.list || obj.result;

					if(obj.list){
						$scope.erporderList.forEach(function(item,i){
							$scope.erporderList[i].zhuiZongHao = JSON.parse(item.zhuiZongHao)
							$scope.erporderList[i].yiQianShouZhuiZongHao = JSON.parse(item.yiQianShouZhuiZongHao)
						})
					}

					console.log($scope.erporderList)
					console.log($scope.erpordTnum)
					if ($scope.status == 0 || $scope.status == 1) {
						for (let i = 0, iLen = $scope.erporderList.length; i < iLen; i++) {
							if ($scope.erporderList[i].cgsps && $scope.erporderList[i].cgsps.length > 0) {
								for (let j = 0, jLen = $scope.erporderList[i].cgsps.length; j < jLen; j++) {
									try {
										$scope.erporderList[i].cgsps[j].tijiaoren = JSON.parse($scope.erporderList[i].cgsps[j].tijiaoren)
									} catch (error) {
										console.log(error)
									}
								}
							}
						}
					}
					dealpage()
				} else {
					layer.msg('网络错误')
				}
			}, function (data) {
				layer.closeAll('loading')
				console.log(data)
			})
		}
		$scope.seachKey = 'stanSku';
		function glGetListFun() {
			var printData = {};
			printData.pageNo = $scope.pageNum + '';
			printData.pageSize = $scope.pageSize;
			printData[$scope.seachKey] = $scope.searchVal;
			const url = currentApi.caigouGuanlian;
			erp.mypost(url, printData).then(({list, total}) => {
				$scope.erpordTnum = total;
				$scope.erporderList = list;
				dealpage()
			})
		}
		let that = this;
		$scope.LookLog = function (list,type, ev) {
			console.log(list)
			$scope.isLookLog = true;
			that.list = list;
			that.type = type;
			ev.stopPropagation()
		}
		$scope.$on('log-to-father', function (d, flag) {
			if (d && flag) {
				$scope.isLookLog = false;
			}
		})

		//split img
		function splitImgs(payVoucher) {
			let arr = payVoucher.split(","); //字符分割
			console.log("2arr", arr)
			return arr
		}

		//支出列表
		function expenditureListFun() {
			var printData = {};
			printData.pageNo = $scope.pageNum + '';
			printData.pageSize = $scope.pageSize;
			printData[$scope.seachKey] = $scope.searchVal;
			printData.caigouRen = $scope.caigouRen
			printData.begainDate = $scope.begainDate
			printData.payStatus = $scope.payStatus
			erp.postFun('erp/finance/queryErpFinancePage', JSON.stringify(printData), function (data) {
				console.log("DIN:", data)
				var obj = data.data;
				console.log("DINs:", obj)
				if (obj) {
					$scope.erpordTnum = obj.totle;
					$scope.erporderList = obj.data;
					for (let i = 0, iLen = $scope.erporderList.length; i < iLen; i++) {
						let arr = $scope.erporderList[i].payVoucher
						$scope.erporderList[i].payVouchers = splitImgs(arr)
						console.log("sss", $scope.erporderList[i].payVouchers)
					}
					dealpage()
				} else {
					layer.msg('网络错误')
				}
			}, function (data) {
				console.log(data)
			})
		}

		$scope.fuKuanAdd = function (item, index, ev) {
			$scope.fKid = item.id;//处理数据id
			$scope.fKpayAmount = item.payAmount;//预付金额
			$scope.fKpayTotoleAmount = item.payTotoleAmount; //总付款金额
			$scope.fKresidualPaymentAmount = $scope.fKpayTotoleAmount - $scope.fKpayAmount; //剩余付款金额
			$scope.orderId = item.orderId
			$scope.fuKuan = true;
			$scope.payAccount = "6230********6837"
			$scope.payObject = "周理志"
			$scope.payType = "4"
			console.log("sheng", $scope.fKresidualPaymentAmount)
			$('#timelist').val(GetDateStr(0))
		}

		$scope.certificate = function (item, index, ev) {
			$scope.cerid = item.id;//处理数据id
			$scope.orderId = item.orderId
			$scope.cer = true;
			$scope.payAccount = "6230********6837"
			$scope.payObject = "周理志"
			$scope.payType = "4"
			$scope.type = "1";
			console.log("type", $scope.type)
			$('#timelist').val(GetDateStr(0))
		}
		function GetDateStr(AddDayCount) {
			var dd = new Date();
			dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天
			//后的日期
			var y = dd.getFullYear();
			var m = dd.getMonth() + 1;//获取当前月份的日期
			var d = dd.getDate();
			var h = dd.getHours();
			h = h < 10 ? ('0' + h) : h;
			var minute = dd.getMinutes();
			minute = minute < 10 ? ('0' + minute) : minute;
			var second = dd.getSeconds();
			second = second < 10 ? ('0' + second) : second;
			if (m < 10) {
				m = '0' + m
			}
			if (d < 10) {
				d = '0' + d
			}
			return y + "-" + m + "-" + d + ' ' + h + ':' + minute + ':' + second;
		}
		$scope.disputes = function (item, index, ev) {
			$scope.orderId = item.orderId;//处理数据id
			$scope.caigouRen = item.caigouRen
			$scope.dispute = true;

		}
		$scope.disputeAdd = function () {
			let payVoucher = $scope.imgArr.join(",");
			var Data = {};
			Data.orderId = $scope.orderId;
			Data.refundVoucher = payVoucher;
			Data.refundAmount = $scope.refundAmount;
			Data.refundRemark = $scope.refundRemark;
			Data.refundRen = $scope.refundRen;
			Data.caigouRen = $scope.caigouRen
			if ($scope.status == 8) {
				Data.caigouType = "2";
			} else if ($scope.status == 13) {
				Data.caigouType = "1";
			}
			erp.postFun('caigou/procurement/saveCaigouRefundRecord', Data, function (data) {
				if (data.data.statusCode == 200) {
					layer.msg(data.data.message)
					$scope.dispute = false
					getOrdListFun()
					Empty()
				} else {
					layer.msg(data.data.message)
				}
			})
		}
		$scope.selected = function () {
			console.log("支付宝")
			if ($scope.payType == "0") {
				$scope.payAccount = "15000616778"
				$scope.payObject = "涂宏名"
			} else if ($scope.payType == "1") {
				$scope.payAccount = "zlzshadow@outlook.com"
				$scope.payObject = "周理志"
			} else if ($scope.payType == "2") {
				$scope.payAccount = ""
				$scope.payObject = ""
			} else if ($scope.payType == "3") {
				$scope.payAccount = "622908********5417"
				$scope.payObject = "周理志"
			} else if ($scope.payType == "4") {
				$scope.payAccount = "6230********6837"
				$scope.payObject = "周理志"
			} else if ($scope.payType == "5") {
				$scope.payAccount = "6217********5395"
				$scope.payObject = "涂宏名"
			}
		}

		$scope.cerAdd = function () {
			let payVoucher = $scope.imgArr.join(",");
			$scope.timelist = $('#timelist').val()
			console.log("付款时间", $('#timelist').val())
			var Data = {};
			Data.id = $scope.cerid;//处理数据id
			Data.payVoucher = payVoucher;//付款凭证，
			Data.payTime = $scope.timelist;//付款时间

			if ($scope.payType == "0") {
				$scope.payType = "1"
				Data.payType = $scope.payType;//支付方式
			} else if ($scope.payType == "4" || $scope.payType == "5") {
				$scope.payType = "3"
				Data.payType = $scope.payType;//支付方式
			}
			Data.payAccount = $scope.payAccount;//支付账号
			Data.payObject = $scope.payObject;//支付对象
			Data.payAmount = $scope.cerpayAmount;//预付金额
			Data.type = $scope.type;//1-全部付款,2-部分付款
			Data.payTotoleAmount = $scope.cta;//总付款金额
			Data.residualPaymentAmount = $scope.rpa;//剩余付款金额
			Data.collectionRen = $scope.collectionRen;//收款人s
			Data.orderId = $scope.orderId;
			Data.remark = $scope.remark;//备注
			Data.caigouType = '2';//采购类型
			if ($scope.status == 0) {
				console.log("进入")
				Data.orderType = '1';
				console.log("进入2", Data.orderType)
			} else {
				Data.orderType = '2';
			}
			erp.postFun('caigou/procurement/updateCaiGouXianXia', Data, function (data) {
				if (data.data.statusCode == 200) {
					layer.msg(data.data.message)
					$scope.cer = false
					getOrdListFun()
					Empty()
				} else {
					layer.msg(data.data.message)
				}
			})
		}
		//清空
		function Empty() {
			console.log("进入")
			$scope.imgArr = [];
			$scope.payTime = '';
			$scope.payType = '';
			$scope.payAccount = '';
			$scope.payObject = '';
			$scope.cerpayAmount = '';
			$scope.cerpayTotoleAmount = '';
			$scope.residualPaymentAmount = '';
			$scope.collectionRen = '';
			$scope.remark = '';
			$scope.caigouType = '';
			$scope.fKpayAmount = '';
			$scope.fKpayTotoleAmount = '';
			$scope.fKresidualPaymentAmount = '';
			$scope.payId = '';
			$scope.refundRen = '';
			$scope.refundRemark = '';
			$scope.refundAmount = '';
		}

		// 提交到已付款
		$scope.submitAdd = function () {
			console.log("1047", $scope.fKid)
			var payVoucher = $scope.imgArr.join(",");
			$scope.timelist = $('#timelist').val()
			var printData = {};
			printData.id = $scope.fKid;
			printData.payVoucher = payVoucher;
			printData.payTime = $scope.timelist;
			printData.payType = $scope.payType;
			printData.payAccount = $scope.payAccount;
			printData.payObject = $scope.payObject;
			printData.payAmount = $scope.fKpayAmount;
			printData.type = "2";
			printData.payTotoleAmount = $scope.fKpayTotoleAmount;
			printData.residualPaymentAmount = $scope.fKresidualPaymentAmount;
			printData.collectionRen = $scope.collectionRen;
			printData.orderId = $scope.orderId;
			printData.remark = $scope.remark;
			printData.caigouType = "2";
			printData.payId = $scope.payId;
			erp.postFun('erp/finance/financialTransaction', printData, function (data) {
				if (data.data.statusCode == 200) {
					layer.msg(data.data.message)
					$scope.fuKuan = false
					expenditureListFun()
				} else {
					layer.msg(data.data.message)
				}
			})
		}

		//退款列表
		function refundListFun() {
			var printData = {};
			printData.pageNo = $scope.pageNum + '';
			printData.pageSize = $scope.pageSize;
			printData[$scope.seachKey] = $scope.searchVal;
			printData.caigouRen = $scope.caigouRen
			printData.caigouRen = $scope.begainDate
			erp.postFun('erp/finance/queryErpRefundPage', JSON.stringify(printData), function (data) {
				console.log("DIN:", data)
				var obj = data.data;
				console.log("DINs:", obj)
				if (obj) {
					$scope.erpordTnum = obj.totle;
					$scope.erporderList = obj.data;
					for (let i = 0, iLen = $scope.erporderList.length; i < iLen; i++) {
						try {
							let arr = $scope.erporderList[i].refundVoucher
							var strs = new Array(); //定义一数组
							strs = arr.split(","); //字符分割
							$scope.imgs = strs
						} catch (error) {
							console.log(error)
						}
					}
					dealpage()
				} else {
					layer.msg('网络错误')
				}
			}, function (data) {
				console.log(data)
			})
		}
		getListFun();
		$scope.nbcgActFun = function (stu) {
			$scope.nbcgPayStu = stu;
			$scope.pageNum = 1;
			getOrdListFun()
		}
		$scope.nbcgImportFun = function () {
			$scope.nbcgImportFlag = true;
		}
		$scope.nbcgExcelFun = function () {
			var file = $("#nbcgUpLoadInp").val();
			var index = file.lastIndexOf(".");
			var ext = file.substring(index + 1, file.length);
			if (ext != "xlsx" && ext != "xls") {
				layer.msg('请上传excel')
				return;
			}
			erp.load()
			var formData = new FormData();
			formData.append('file', $("#nbcgUpLoadInp")[0].files[0]);
			formData.append('type', 1)
			erp.upLoadImgPost('caigou/procurement/importExcel', formData, function (data) {
				layer.closeAll('loading')
				$("#nbcgUpLoadInp").val('')
				$scope.nbcgImportFlag = false;
				if (data.data.statusCode == 200) {
					layer.msg('上传成功')
					$scope.pageNum = '1';
					getOrdListFun()
				} else if (data.data.statusCode == 505) {
					$scope.importExErrFlag = true;
					let mesStr = JSON.parse(data.data.message)
					for (let key in mesStr) {
						mesStr[key] = JSON.parse(mesStr[key])
					}
					$scope.mesErrObj = mesStr;
				} else (
					layer.msg(data.data.message)
				)
			}, function (data) {
				layer.closeAll('loading')
			})
		}
		// 监听status变化 修改是否为退货状态 - 1.04 退货单 功能
		$scope.$watch('status', function () {
			if ($scope.status == 'r-10' || $scope.status=='r-11' || $scope.status==9) {
				$scope.isReturnStatus = true
			}
		})
		$scope.changeTuiHuo = function(type, ev) {
			$('.pur-tuihuo').removeClass('pur-chuli-act');
			$(ev.target).addClass('pur-chuli-act')
			if (type == '仅退款') {
				$scope.status = 9
			} else {
				$scope.status = 'r-10'
			}
			$scope.pageNum = '1';
			getListFun();
		}
		$scope.chuLiStuFun = function (stu, ev) {
			$('.pur-chuli').removeClass('pur-chuli-act');
			$(ev.target).addClass('pur-chuli-act')
			$scope.yiChangStu = stu;
			// 兼容 10|11 退货状态 - 1.04 退货单 功能
				console.log('========', $scope.status)
			if (/r/.test($scope.status)) {
				$scope.status = stu == 0 ? 'r-10' : 'r-11'
			}
			$scope.pageNum = '1';
			getListFun();
		}
		$scope.ycyyChangeFun = function () {
			$scope.pageNum = '1';
			getListFun();
		}
		$scope.zhChangeFun = function () {
			$scope.pageNum = '1';
			getListFun();
		}
		function dealpage() {
			erp.load();
			$('#c-zi-ord .c-checkall').attr("src", "static/image/order-img/multiple1.png")
			console.log($scope.erpordTnum)
			if (!$scope.erpordTnum || $scope.erpordTnum <= 0) {
				layer.msg('未找到订单')
				layer.closeAll("loading")
				return;
			}
			console.log($scope.erpordTnum)
			$("#c-pages-fun").jqPaginator({
				totalCounts: $scope.erpordTnum,//设置分页的总条目数
				pageSize: $scope.pageSize * 1,//设置每一页的条目数
				visiblePages: 5,//显示多少页
				currentPage: $scope.pageNum * 1,
				activeClass: 'active',
				prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
				next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
				page: '<a href="javascript:void(0);">{{page}}<\/a>',
				first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
				last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
				onPageChange: function (n, type) {
					console.log(n)
					console.log(n, type)
					// alert(33333333333)
					if (type == 'init') {
						layer.closeAll("loading")
						return;
					}
					layer.load(2)
					$scope.pageNum = n;
					getListFun()
				}
			});
		}
		$(window).scroll(function () {
			var before = $(window).scrollTop();
			if (before > 60) {
				$('.tit-box').css({
					"position": "fixed",
					"top": 0
				})
			} else {
				$('.tit-box').css({
					"position": "static",
					"top": 0
				})
			}
		});
		//查看大图
		$scope.showBigImgFun = function (img) {
			$scope.bigImgLink = img;
			$scope.bigImgFlag = true;
		}
		$scope.modfyOrdNumFun = function (item, index, ev) {
			ev.stopPropagation()
			$scope.modefyOrdNumFlag = true;
			$scope.orderId = item.orderId;
			$scope.outIndex = index;
			$scope.new1688OrdNum = item.orderId;
		}
		$scope.sureModOrdFun = function () {
			if (!$scope.new1688OrdNum) {
				layer.msg('请输入新的订单号')
				return
			}
			var upJson = {};
			upJson.xinDingDanHao = $scope.new1688OrdNum;
			upJson.jiuDingDanHao = $scope.orderId;
			erp.postFun('caigou/procurement/xiuGaiDingDanHao', JSON.stringify(upJson), function (data) {
				console.log(data)
				layer.msg(data.data.message)
				if (data.data.statusCode == 200) {
					$scope.erporderList[$scope.outIndex].orderId = $scope.new1688OrdNum;
					$scope.new1688OrdNum = '';
					$scope.modefyOrdNumFlag = false;
				}
			}, function (data) {
				console.log(dataa)
			})
		}
		$scope.spBtCountNum = 0;
		$scope.addSkuFun = function (item, index, ev) {
			event.stopPropagation()
			console.log(item)
			$scope.spBtCountNum = 0;
			$scope.cgspList = item.cgsps;
			for (var i = 0, len = $scope.cgspList.length; i < len; i++) {
				$scope.spBtCountNum += $scope.cgspList[i].shuLiang - 0;
				if (!$scope.cgspList[i].cjSku) {
					layer.msg('请给所有变体添加SKU')
					return;
				}
			}
			$scope.orderId = item.orderId;
			$scope.skuListFlag = true;
			console.log($scope.spBtCountNum)
		}
		$scope.addCountFun = function (item, index) {
			console.log(item.shuLiang)
			$scope.cgspList[index]['shuLiang'] = item.shuLiang;
			console.log($scope.cgspList[index])
		}
		$scope.sureAddSku = function () {
			erp.load()
			var addCountNum = 0;
			var jsonObj = {}
			jsonObj.skuNums = [];
			for (var i = 0, len = $scope.cgspList.length; i < len; i++) {
				var btObj = {};
				btObj.id = $scope.cgspList[i].id || '';
				btObj.cjImg = $scope.cgspList[i].cjImg;
				btObj.cjProductId = $scope.cgspList[i].cjProductId;
				btObj.cjShortSku = $scope.cgspList[i].cjShortSku;
				btObj.cjSku = $scope.cgspList[i].cjSku;
				btObj.cjStanproductId = $scope.cgspList[i].cjStanproductId;
				if ($scope.cgspList[i]['shuLiang'] > 0) {
					addCountNum += $scope.cgspList[i]['shuLiang'] - 0
				} else {
					layer.msg('请为所有变体添加数量')
					return
				}
				btObj.shuLiang = $scope.cgspList[i].shuLiang;
				btObj.cjHuoWuBiaoTi = $scope.cgspList[i].cjHuoWuBiaoTi;
				jsonObj.skuNums.push(btObj)
			}
			console.log($scope.spBtCountNum, addCountNum)
			if ($scope.spBtCountNum != addCountNum) {
				layer.msg('拆分后跟之前的总数量不一致,请检查')
				return
			}

			jsonObj.orderId = $scope.orderId;
			console.log(jsonObj)
			// jsonObj.shuLiang = $scope.addCountVal;
			// jsonObj.zhiFu = $scope.addSjzfVal;
			// jsonObj.cjsku = $scope.addSkuVal;
			// jsonObj.danJia = $scope.addDjVal;
			erp.postFun('caigou/procurement/jiaSku2', JSON.stringify(jsonObj), function (data) {
				console.log(data)
				layer.msg(data.data.message)
				if (data.data.statusCode == 200) {
					$scope.skuListFlag = false;
					$scope.pageNum = '1';
					getListFun()
				} else {
					erp.closeLoad();
				}
			}, function (data) {
				console.log(data)
				erp.closeLoad();
			})
		}
		//匹配sku
		$scope.piPeiSkuFun = function (item, pIndex, index, ev) {
			ev.stopPropagation()
			$scope.outIndex = pIndex;
			$scope.cgspIndex = index;
			$scope.piPeiSkuFlag = true;
			$scope.orderId = item.orderId;
		}
		$scope.surePiPeiSku = function () {
			// orderId 当前订单的orderId  测试:283635714967418614
			// sku 填写的商品sku  测试:CJBHNSNS03334
			if (!$scope.piPeiSkuVal) {
				layer.msg('请填写sku')
				return
			}
			erp.load()
			var piPeiJson = {};
			piPeiJson.orderId = $scope.orderId;
			piPeiJson.sku = $scope.piPeiSkuVal;
			erp.postFun('caigou/procurement/ziDongPiPei', JSON.stringify(piPeiJson), function (data) {
				console.log(data)
				erp.closeLoad()
				layer.msg(data.data.message)
				if (data.data.statusCode == 200) {
					$scope.piPeiSkuFlag = false;
					$scope.piPeiSkuVal = '';
					$scope.erporderList[$scope.outIndex].cgsps = JSON.parse(data.data.result)
					console.log($scope.erporderList[$scope.outIndex].cgsps)
				}
			}, function (data) {
				console.log(data)
				erp.closeLoad()
			})
		}
		$scope.addOneFun = function () {
			console.log($scope.newAddSku)
			for (var i = 0, len = $scope.cgspList.length; i < len; i++) {
				if ($scope.newAddSku == $scope.cgspList[i].cjSku) {
					layer.msg("该SKU重复")
					return
				}
			}
			$scope.addOneSkuFlag = true;
		}
		$scope.closeOneAddFun = function () {
			$scope.addOneSkuFlag = false;
			$scope.newAddSku = '';
		}
		$scope.sureOneAddSkuFun = function () {
			erp.postFun('caigou/procurement/jiaoYanSku', {
				sku: $scope.newAddSku
			}, function (data) {
				console.log(data)
				layer.msg(data.data.message)
				if (data.data.statusCode == 200) {
					$scope.addOneSkuFlag = false;
					$scope.newAddSku = '';
					$scope.addOneSkuArr = JSON.parse(data.data.result);
					$scope.cgspList.push($scope.addOneSkuArr)
					console.log($scope.addOneSkuArr)
					console.log($scope.cgspList)
				}
			}, function (data) {
				console.log(data)
			})
		}
		//录入追踪号
		$scope.addZzhList = [{ 'wlgsName': '', 'zzhVal': '' }];
		$scope.addLabelFun = function () {
			$scope.addZzhList.push({ 'wlgsName': '', 'zzhVal': '' });
			console.log($scope.addZzhList)
		}
		$scope.delLabelFun = function (index) {
			$scope.addZzhList.splice(index, 1)
			console.log($scope.addZzhList)
		}
		$scope.addZzhFun = function (item, index, ev) {
			$scope.luruZzhFlag = true;
			$scope.itemId = item.id;
		}
		// $scope.wlgsFun = function(index){
		//     $scope.addZzhList[index].wlgsName = 
		// }
		$scope.sureLrZzhFun = function () {
			console.log($scope.addZzhList)
			// var zhuiZongHao = [];
			var zhuiZongHao = {};
			for (var i = 0, len = $scope.addZzhList.length; i < len; i++) {
				var objJson = {};
				if ($scope.addZzhList[i].wlgsName && $scope.addZzhList[i].zzhVal) {
					var key1 = $scope.addZzhList[i]['wlgsName'];
					var val = $scope.addZzhList[i]['zzhVal']
					zhuiZongHao[val] = key1;
					console.log(zhuiZongHao)
				} else if ($scope.addZzhList[i].wlgsName || $scope.addZzhList[i].zzhVal) {
					layer.msg('物流公司跟追踪号必须同时存在')
					return
				}
			}
			if (JSON.stringify(zhuiZongHao) == "{}") {
				layer.msg('请输入物流公司和运单号')
				return
			}
			erp.load()
			var upJson = {};
			upJson.id = $scope.itemId;
			upJson.zhuiZongHao = zhuiZongHao;
			// console.log(upJson)
			erp.postFun('caigou/procurement/tianZhuiZongHao', JSON.stringify(upJson), function (data) {
				erp.closeLoad()
				if (data.data.statusCode == 200) {
					$scope.luruZzhFlag = false;
					$scope.addZzhList = [{ 'wlgsName': '', 'zzhVal': '' }];
					getListFun()
				} else {
					layer.msg(data.data.message)
				}
			}, function (data) {
				console.log(data)
				erp.closeLoad()
			})
		}
		//线下采购 填写完追踪号 提交到待签收
		$scope.addDqsFun = function (item, index, ev) {
			var idsArr = [];
			idsArr.push(item.id)
			$scope.tjdqsArr = idsArr;
			console.log(item.zhuiZongHao)
			if (JSON.stringify(item.zhuiZongHao) == "{}") {
				layer.msg('请录入追踪号')
			} else {
				$scope.addDqsFlag = true;
			}
		}
		$scope.zzhBulkAddDqsFun = function () {
			var countNum = 0;
			tjDqsArr = [];
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
					var zzhTextVal = $(this).siblings('.zzh-text').text()
					if (zzhTextVal != "{}") {
						tjDqsArr.push($(this).siblings('.cg-id').text())
						countNum++;
					}
				}
			})
			console.log(tjDqsArr)
			if (countNum < 1) {
				layer.msg('请选择订单')
			} else {
				$scope.addDqsFlag = true;
				$scope.tjdqsArr = tjDqsArr;
			}
		}
		$scope.sureaddDqsFun = function () {
			erp.load()
			var upJson = {};
			upJson.chuDanCaiGouIds = $scope.tjdqsArr
			erp.postFun('caigou/procurement/tianWanZhuiZongHaoTiJiao', JSON.stringify(upJson), function (data) {
				console.log(data)
				erp.closeLoad()
				if (data.data.statusCode == 200) {
					$scope.addDqsFlag = false;
					$scope.tjdqsArr = [];
					getListFun()
				} else {
					layer.msg(data.data.message)
				}
			}, function (data) {
				console.log(data)
				erp.closeLoad()
			})
		}
		// 时间查询
		$scope.timeClickFun = function (ev, stu) {
			// $('#c-data-time').val('');
			// $('#cdatatime2').val('');
            $('.time-click').removeClass('time-act');
            if(ev)$(ev.target).addClass('time-act');
			// $scope.startTime = '';
			// $scope.endTime = '';
			$scope.pageNum = '1';
			$scope.biantiSku = '';
			$scope.orderId = '';
			$scope.caigouren = '';
			$scope.fuKuanRen = '';
			$scope.gongHuoGongSi = '';
			$scope.zhuiZongHao = '';
			$scope.ri = stu;
			$scope.searchVal = '';
			getListFun()
		}
		$('.c-seach-inp').keypress(function (ev) {
			if (ev.keyCode == 13) {
				$scope.searchFun()
			}
		})
		$scope.searchFun = function () {
			$('.time-click').removeClass('time-act')
			$scope.ri = undefined;
			$scope.pageNum = '1';
			$scope.startTime = $('#c-data-time').val();
			$scope.endTime = $('#cdatatime2').val();
			var val = $('#selectSearch').val();
			if ($scope.status == '2' || $scope.status == '3' || $scope.status == '4') {
				if (val == '0') {
					$scope.biantiSku = '';
					$scope.orderId = $scope.searchVal;
					$scope.caigouren = '';
					$scope.fuKuanRen = '';
					$scope.gongHuoGongSi = '';
					$scope.zhuiZongHao = '';
				} else if (val == '1') {
					$scope.biantiSku = '';
					$scope.orderId = '';
					$scope.caigouren = $scope.searchVal;
					$scope.fuKuanRen = '';
					$scope.gongHuoGongSi = '';
					$scope.zhuiZongHao = '';
				} else if (val == '2') {
					$scope.biantiSku = '';
					$scope.orderId = '';
					$scope.caigouren = '';
					$scope.fuKuanRen = $scope.searchVal;
					$scope.gongHuoGongSi = '';
					$scope.zhuiZongHao = '';
				} else if (val == '3') {
					$scope.biantiSku = '';
					$scope.orderId = '';
					$scope.caigouren = '';
					$scope.fuKuanRen = '';
					$scope.gongHuoGongSi = $scope.searchVal;
					$scope.zhuiZongHao = '';
				} else if (val == '4') {
					$scope.biantiSku = '';
					$scope.orderId = '';
					$scope.caigouren = '';
					$scope.fuKuanRen = '';
					$scope.gongHuoGongSi = '';
					$scope.zhuiZongHao = $scope.searchVal;
				} else if (val == '5') {
					$scope.biantiSku = $scope.searchVal;
					$scope.orderId = '';
					$scope.caigouren = '';
					$scope.fuKuanRen = '';
					$scope.gongHuoGongSi = '';
					$scope.zhuiZongHao = '';
				}
			} else {
				$scope.biantiSku = '';
				$scope.orderId = '';
				$scope.caigouren = '';
				$scope.fuKuanRen = '';
				$scope.gongHuoGongSi = '';
				$scope.zhuiZongHao = '';
			}

			getListFun()
		}
		$scope.pageChange = function () {
			$scope.pageNum = '1';
			getListFun()
		}
		$scope.gopageFun = function () {
			if (!(/(^[1-9]\d*$)/.test($scope.pageNum)) || $scope.pageNum > Math.ceil($scope.erpordTnum / $scope.pageSize)) {
				$scope.pageNum = '1';
				layer.msg('请输入正确页码')
				return;
			}
			layer.load(2)
			getListFun()
		}
		$scope.yfkFun = function () {
			var countNum = 0;
			ids = '';
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
					countNum++;
					ids += $(this).siblings('.cg-id').text() + ',';
				}
			})
			if (countNum < 1) {
				layer.msg('请选择订单')
			} else {
				$scope.tjddfkFlag = true;
			}
		}
		$scope.sureYfkFun = function () {
			$scope.tjddfkFlag = false;
			erp.load()
			erp.postFun('caigou/procurement/gaiChengDaiFuKuan', {
				ids: ids
			}, function (data) {
				console.log(data)
				if (data.data.statusCode == 200) {
					$scope.pageNum = '1';
					getListFun()
				} else {
					layer.msg('提交失败')
					layer.closeAll('loading')
				}
			}, function (data) {
				console.log(data)
				layer.closeAll('loading')
			})
		}
		var ids = '';
		$scope.piLiangTJFun = function () {
			var countNum = 0;
			ids = '';
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
					countNum++;
					ids += $(this).siblings('.cg-id').text() + ',';
				}
			})
			if (countNum < 1) {
				layer.msg('请选择订单')
			} else {
				$scope.pltjFlag = true;
			}
		}
		$scope.surePltjFun = function () {
			$scope.pltjFlag = false;
			erp.load()
			erp.postFun('caigou/procurement/gaiChengYiFuKuan', {
				ids: ids
			}, function (data) {
				console.log(data)
				if (data.data.statusCode == 200) {
					$scope.pageNum = '1';
					getListFun()
				} else {
					layer.msg('提交失败')
					layer.closeAll('loading')
				}
			}, function (data) {
				console.log(data)
				layer.closeAll('loading')
			})
		}
		$scope.piLiangDelFun = function () {
			var countNum = 0;
			ids = '';
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
					countNum++;
					ids += $(this).siblings('.id1688').text() + ',';
				}
			})
			if (countNum < 1) {
				layer.msg('请选择订单')
			} else {
				$scope.plDelFlag = true;
			}
		}
		$scope.surePlDelFun = function () {
			$scope.plDelFlag = false;
			erp.load()
			erp.postFun('caigou/procurement/shanChuDingDan', {
				orderIds: ids,
				status: $scope.status
			}, function (data) {
				console.log(data)
				if (data.data.statusCode == 200) {
					$scope.pageNum = '1';
					getListFun()
				} else {
					layer.msg('删除失败')
					layer.closeAll('loading')
				}
			}, function (data) {
				console.log(data)
				layer.closeAll('loading')
			})
		}
		var tjDqsArr = [];
		$scope.tjdDqsFun = function () {
			var countNum = 0;
			tjDqsArr = [];
			var skuFlag = false;
			$('#c-zi-ord .cor-check-box').each(function () {
				if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
					var $skuDom = $(this).parent().parent().siblings('.erpd-toggle-tr').find('.hide-sku')
					console.log($skuDom)
					console.log($skuDom.length)
					for (var i = 0; i < $skuDom.length; i++) {
						console.log($skuDom.eq(i).text())
						if (!$skuDom.eq(i).text()) {
							skuFlag = true;
							break;
						}
					}
					if (skuFlag) {
						layer.msg('请输入SKU')
						return false;
					}
					countNum++;
					tjDqsArr.push($(this).siblings('.id1688').text())
				}
			})
			if (skuFlag) {
				layer.msg('请输入SKU并确认提交', { time: 2000 })
				return
			}
			console.log(tjDqsArr)
			if (countNum < 1) {
				layer.msg('请选择订单')
			} else {
				$scope.tjdDqsFlag = true;
			}
		}
		$scope.sureTjDqsFun = function () {
			erp.load()
			var tjData = {};
			tjData.chuDanCaiGouIds = tjDqsArr;
			erp.postFun('caigou/procurement/tianWanSkuTiJiao', JSON.stringify(tjData), function (data) {
				console.log(data)
				layer.closeAll('loading')
				if (data.data.statusCode == 200) {
					layer.msg('提交成功')
					$scope.tjdDqsFlag = false;
					$scope.pageNum = '1';
					getListFun()
				} else {
					layer.msg('提交失败')
				}
			}, function (data) {
				console.log(data)
				layer.closeAll('loading')
			})
		}
		
		$scope.addNewWlFun = function(item,index){
			$scope.addNewYdhFlag = true;
			let zzhObj = item.zhuiZongHao;
			$scope.hisYdhList = [];
			$scope.newYdhList = [{'wlgsName':'',"wlYdh":''}]
			$scope.itemOrdId = item.id;
			$scope.addDhjsNum = item.packageNum;
			let arr = [];
			if(JSON.stringify(zzhObj) != "{}"){
				for(let key in zzhObj){
					console.log(key)
					arr.push({
						"wlgsName":zzhObj[key],
						"wlYdh": key
					})
				}
				$scope.hisYdhList = arr;
			}
		}
		$scope.addWlgsFun = function(){
			$scope.newYdhList.push({'wlgsName':'',"wlYdh":''})
		}
		$scope.delWlgsFun = function(index){
			$scope.newYdhList.splice(index,1)
		}
		function arrToObj(arr){
			let targetObj = {};
			for(let i = 0,len = arr.length;i<len;i++){
				if(arr[i].wlgsName&&arr[i].wlYdh){
					targetObj[arr[i].wlYdh] = arr[i].wlgsName;
				}else if(arr[i].wlgsName||arr[i].wlYdh){
					return false
				}
			}
			return targetObj;
		}
		$scope.sureAddDhjsFun = function(){
			if(!$scope.addDhjsNum){
				layer.msg('请输入到货件数')
				return
			}
			let upJson = {};
			upJson.id = $scope.itemOrdId;
			upJson.num = $scope.addDhjsNum;
			erp.postFun('caigou/procurement/packageNum',upJson,function(data){
				if(data.data.statusCode==200){
					$scope.addNewYdhFlag = false;
					getListFun()
				}else{
					layer.msg('修改失败')
				}
			},function(data){
				console.log(data)
			},{layer:true})
		}
		$scope.sureAddNewYdhFun = function(){
			let upJson = {};
			upJson.id = $scope.itemOrdId;
			upJson.zhuiZongHao = {};
			if($scope.hisYdhList.length){
				if(!arrToObj($scope.hisYdhList)){
					layer.msg('原追踪号跟物流公司必须成对出现')
					return
				}
				upJson.zhuiZongHao = Object.assign({},arrToObj($scope.hisYdhList))
			}
			if($scope.newYdhList.length){
				if(!arrToObj($scope.newYdhList)){
					layer.msg('新增追踪号跟物流公司必须成对出现')
					return
				}
				upJson.zhuiZongHao = Object.assign(upJson.zhuiZongHao,arrToObj($scope.newYdhList))
			}
			erp.postFun('caigou/procurement/trackingNum',upJson,function(data){
				console.log(data)
				if(data.data.statusCode==200){
					$scope.addNewYdhFlag = false;
					getListFun()
				}else{
					layer.msg('新增失败')
				}
			},function(data){
				console.log(data)
			},{layer:true})
		}
		$scope.imgArr = [];       // 读取本地地址----速度快
		let loadList = {
			img: ['png', 'jpg', 'jpeg', 'gif', "PNG", "JPG", "JPEG", "GIF"]
		};
		// 上传图片
		$scope.upLoadImg5 = function (files) {
			let file = files[0];
			console.log(files)
			let fileName = file.name.substring(file.name.lastIndexOf('.') + 1);
			console.log(fileName)
			if (!loadList.img.includes(fileName)) {
				layer.msg('图片格式错误');
				return;
			}
			// let validFileArr = [];
			// if(files){
			//     let fileType,fileName;
			//     for(let i = 0,len = files.length;i<len;i++){
			//         fileName = files[i].name;
			//         fileType = fileName.substring(fileName.lastIndexOf('.')+1,fileName.length)
			//         console.log(fileName,fileType)
			//         if(loadList.img.includes(fileType)){
			//             validFileArr.push(files[i])
			//         }
			//     }
			//     console.log(validFileArr)
			// }
			// if(validFileArr.length<1&&files.length>0){
			//     layer.msg('图片格式不正确')
			//     return
			// }
			erp.ossUploadFile(files, function (data) {
				console.log(data)
				if (data.code == 0) {
					layer.msg('图片上传失败');
					return;
				}
				let result = data.succssLinks;
				$scope.imgArr = [];
				// for(let i = 0,len = result.length;i<len;i++){
				//     $scope.imgArr.push(result[i])
				// }
				$scope.imgArr.push(result[0]);
				$('.upload_file').val('')
				$scope.$apply();
				console.log($scope.imgArr)
			})
		};
		// 删除上传的图片
		$scope.delImg = (index, event) => {
			event.stopPropagation();
			$scope.imgArr.splice(index, 1);
		};
		$scope.upLoadImg4 = function (files) {
			console.log(files)
			var file = $("#upLoadInp").val();
			var index = file.lastIndexOf(".");
			console.log(file)
			var ext = file.substring(index + 1, file.length);
			console.log(ext)
			if (ext != "xlsx" && ext != "xls") {
				layer.msg('请上传excel')
				return;
			}
			erp.load()
			var formData = new FormData();
			formData.append('file', $("#upLoadInp")[0].files[0]);
			console.log(formData);
			erp.upLoadImgPost('caigou/procurement/shangChuanExcel2', formData, function (data) {
				console.log(data)
				layer.closeAll('loading')
				$("#upLoadInp").val('')
				if (data.data.statusCode == 200) {
					layer.msg('上传成功')
					// $scope.pageNum = '1';
					// getListFun()
				} else if (data.data.statusCode == 201 || data.data.statusCode == 202) {
					$scope.excelLink = data.data.result;
					console.log($scope.excelLink)
					$scope.excelFlag = true;
					layer.msg(data.data.message)
				} else (
					layer.msg(data.data.message)
				)
			}, function (data) {
				console.log(data)
				layer.closeAll('loading')
			})
		}
		$('#upLoadInp').hover(function () {
			$('#up-btn').css({
				backgroundColor: '#5dbdf2',
				color: '#fff'
			})
		}, function () {
			$('#up-btn').css({
				backgroundColor: '#fff',
				color: '#5dbdf2'
			})
		});
		$('.orders-table').on('click', '.erporder-detail', function (event) {
			if ($(event.target).hasClass('cor-check-box') || $(event.target).hasClass('qtcz-sel') || $(event.target).hasClass('stop-prop') || $(event.target).hasClass('ordlist-fir-td')) {
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

		$scope.wuLiuStuFun = function () {
			$scope.wuLiuBtnFlag = !$scope.wuLiuBtnFlag;
			if ($scope.wuLiuBtnFlag) {
				$scope.wuLiuVal = 'y';
				$scope.btnVal = '有物流';
			} else {
				$scope.wuLiuVal = 'n';
				$scope.btnVal = '无物流';
			}
			getListFun()
		}
		$scope.downLoadFun = function () {
			location.href = "https://cc-west-usa.oss-us-west-1.aliyuncs.com/caigou/aaa.xls"
		}
		var itemSku = '';
		var putSkuArr = [];
		var gpIndex, itemIndex;
		$scope.putSkuFun = function (item, ev, pIndex, index) {
			console.log(pIndex, index)
			console.log($(ev.target).siblings('.sku-val').val())
			putSkuArr = [];
			putSkuArr.push(item.id)
			gpIndex = pIndex;
			console.log(gpIndex)
			itemIndex = index;
			itemSku = $.trim($(ev.target).siblings('.sku-val').val());
			console.log(itemSku)
			// $scope.putSkuFlag = true;
			if (!itemSku) {
				layer.msg('请输入sku')
				return
			} else {
				if (!itemSku) {
					layer.msg('请输入sku')
					return
				} else {
					erp.load()
					var csData = {};
					csData.chuDanCaiGouIds = putSkuArr;
					csData.dingDanHao = itemSku;
					erp.postFun('caigou/procurement/gaiSku', JSON.stringify(csData), function (data) {
						console.log(data)
						erp.closeLoad()
						layer.msg(data.data.message)
						if (data.data.statusCode == 200) {
							item.isupSucFlag = true;
							$scope.putSkuFlag = false;
							$scope.erporderList[gpIndex].cgsps[itemIndex].cjSku = itemSku;
							console.log($scope.erporderList[gpIndex].cgsps[itemIndex])
						}
					}, function (data) {
						console.log(data)
						erp.closeLoad()
					})
				}
			}
		}
		var delItemId = '';
		$scope.delSkuFun = function (item, ev, pIndex, index) {
			delItemId = item.id;
			gpIndex = pIndex;
			itemIndex = index;
			$scope.delSkuFlag = true;
		}
		$scope.sureDelSkuFun = function () {
			erp.postFun('caigou/procurement/shanSku', {
				cjsku: delItemId
			}, function (data) {
				console.log(data)
				layer.msg(data.data.message)
				if (data.data.statusCode == 200) {
					console.log($scope.erporderList[gpIndex].cgsps)
					$scope.delSkuFlag = false;
					$scope.erporderList[gpIndex].cgsps.splice(itemIndex, 1);
					console.log($scope.erporderList[gpIndex].cgsps)
				}
			}, function (data) {
				console.log(data)
			})
		}
		//异常
		if ($scope.status == 2) {
			$scope.ycYyVal = '1';
		} else if ($scope.status == 3) {
			$scope.ycYyVal = '3';
		}
		var itemYcId;
		$scope.yiChangFun = function (item, ev, pIndex, index) {
			itemYcId = '';
			$scope.ycCount = 0;
			console.log(item)
			$scope.ycYyFlag = true;
			$scope.ycCount = item.shuLiang - 0;
			itemYcId = item.id;
		}
		$scope.sureYcFun = function () {
			if ($scope.ycCount <= 0 || !$scope.ycCount) {
				layer.msg('请输入数量')
				return
			}
			if ($scope.ycYyVal == '4') {
				if (!$scope.newQsYcReson) {
					layer.msg('请输入异常原因')
					return
				}
			}
			erp.load()
			var ycUpJoson = {};
			ycUpJoson.id = itemYcId;
			ycUpJoson.yuanYin = $scope.newQsYcReson;
			ycUpJoson.shuLiang = $scope.ycCount;
			ycUpJoson.leiXing = $scope.ycYyVal;
			const url = 'procurement/dealWith/yiChang';//接口更改 
			erp.mypost(url, ycUpJoson).then(() => {
				$scope.ycYyFlag = false;
				$scope.pageNum = '1';
				getListFun()
			})
		}
		//更多操作人
		$scope.showMoreCzrFun = function (czrList) {
			$scope.moreCzrFlag = true;
			$scope.carList = czrList;
		}
		$scope.go1688Fun = function () {
			window.open('https://trade.1688.com/order/buyer_order_list.htm?spm=a360q.8274423.1130995625.1.49c84c9aRvNusT&scene_type=&source=')
		}
		//处理异常
		$scope.chuLiFs = '0';
		$scope.wlGsList = [
			{ name: '顺丰速运', code: 'SF' },
			{ name: '圆通速递', code: 'YTO' },
			{ name: '中通快递', code: 'ZTO' },
			{ name: '申通快递', code: 'STO' },
			{ name: '韵达速递', code: 'YD' },
			{ name: '天天快递', code: 'HHTT' },
			{ name: '百世快递', code: 'HTKY' },
			{ name: '速尔快递', code: 'SURE' },
			{ name: '邮政快递包裹', code: 'YZPY' },
			{ name: 'EMS', code: 'EMS' },
			{ name: '京东快递', code: 'JD' },
			{ name: '优速快递', code: 'UC' },
			{ name: '德邦快递', code: 'DBL' }
		]
		$scope.selNFun = function () {
			console.log($scope.wlGsInfo)
		}
		$scope.chuLiYcFun = function (item, pIndex, index, ev) {
			ev.stopPropagation()
			$scope.itemId = item.id;
			$scope.chuliYcFlag = true;
			$scope.pIndex = pIndex;
			$scope.index = index;
			console.log("1欧尼:", $scope.itemId)
			console.log(pIndex, index)
			$scope.chuLiFs = '0';
		}
		$scope.jiLuFun = function (item, index, ev, pItem) {
			$scope.jiLuList = [];
			$scope.itemId = item.id;
			console.log("2欧尼:", $scope.itemId)
			erp.postFun('caigou/procurement/selectRecord', {
				id: $scope.itemId
			}, function (data) {
				if (data.data.statusCode == 200) {
					$scope.jiLu = true;
					let result = data.data.result;
					$scope.jiLuList = result;
					console.log($scope.jiLuList)
				} else {
					layer.msg(data.data.message)
				}
			})
		}

		$scope.chuLiChaFun = function () {
			if ($scope.chuLiFs == 1 || $scope.chuLiFs == 2) {
				$scope.imgArr = [];//上传的图片置为空
			}
		}
		$scope.feiyongchengdanfang = '卖家';
		$scope.yufeishengqingfangshi = '线上申请';
		$scope.youjizhongliang = '首重';
		$scope.sureChuLiFun = function () {
			console.log($scope.chuLiFs, $scope.wlGsInfo)
			if ($scope.chuLiFs == 0) {
				$scope.chuLiReson = $scope.chuLiReson0;
			} else if ($scope.chuLiFs == 1) {
				$scope.chuLiReson = $scope.chuLiReson1;
			} else if ($scope.chuLiFs == 2) {
				$scope.chuLiReson = $scope.chuLiReson2;
			} else if ($scope.chuLiFs == 3) {
				$scope.chuLiReson = $scope.chuLiReson3;
			}
			if ($scope.chuLiFs == 0 || $scope.chuLiFs == 2) {
				if (!$scope.wlGsInfo) {
					layer.msg('补发退货必须选择物流公司')
					return
				}
			}
			console.log($scope.chuLiReson)
			if (!$scope.chuLiReson) {
				layer.msg('输入框不能为空')
				return
			}
			var upJson = {};
			upJson.id = $scope.itemId;
			upJson.chuLiFangShi = $scope.chuLiFs;
			upJson.zhuiZongHao = $scope.chuLiReson;
			if ($scope.chuLiFs == 1) {
				upJson.tuikuanpingzheng = $scope.imgArr[0];
			} else if ($scope.chuLiFs == 2) {
				upJson.zhuangzhangpingzheng = $scope.imgArr[0];
				upJson.tuihuodizhi = $scope.tuihuodizhi;
				upJson.feiyongchengdanfang = $scope.feiyongchengdanfang;
				upJson.yunfeijine = $scope.yunfeijine;
				upJson.yufeishengqingfangshi = $scope.yufeishengqingfangshi;
				upJson.youjizhongliang = $scope.youjizhongliang;
			}

			if ($scope.chuLiFs == 0 || $scope.chuLiFs == 2) {
				upJson.wuliugongsi = $scope.wlGsInfo.split('#')[0];
				upJson.wuliugongsiBianma = $scope.wlGsInfo.split('#')[1]
			}
			erp.postFun('caigou/procurement/yiChangChuLi', JSON.stringify(upJson), function (data) {
				console.log("name", data)
				if (data.data.statusCode == 200) {
					$scope.chuliYcFlag = false;
					var chuLifangShi;
					if ($scope.chuLiFs == 0) {
						chuLifangShi = '补发'
					} else if ($scope.chuLiFs == 1) {
						chuLifangShi = '退款'
					} else if ($scope.chuLiFs == 2) {
						chuLifangShi = '退件'
					} else if ($scope.chuLiFs == 3) {
						chuLifangShi = $scope.chuLiReson;
					}
					// $scope.erporderList[$scope.pIndex].cgsps[$scope.index].chuLiFangShi = chuLifangShi;
					// $scope.erporderList[$scope.pIndex].cgsps[$scope.index].yiChangZhuangtai = $scope.erporderList[$scope.pIndex].cgsps[$scope.index].yiChangZhuangtai-0+1;
					$scope.chuLiReson0 = undefined;
					$scope.chuLiReson1 = undefined;
					$scope.chuLiReson2 = undefined;
					$scope.chuLiReson3 = undefined;
					getListFun()
				}
			}, function (data) {
				console.log(data)
			})
		}
		$scope.chuLiYcWcFun = function (item, pIndex, index, ev) {
			erp.load()
			erp.postFun('caigou/procurement/yiChangWanCheng', {
				id: item.id
			}, function (data) {
				console.log(data)
				erp.closeLoad()
				layer.msg(data.data.message)
				if (data.data.statusCode == 200) {
					$scope.erporderList[$scope.pIndex].cgsps[$scope.index].yiChangZhuangtai = 2;
				}
			}, function (data) {
				console.log(data)
				erp.closeLoad()
			})
		}
		//物流信息
		$scope.hqwlMesFun = function (item, pIndex, index, ev) {
			$scope.wlMsgList = [];
			let csJson = {};
			if (item.chuLiFangShi == '补发') {
				csJson.orderNum = item.orderId;
				csJson.expCode = item.bufakuaidigongsibm;
				csJson.expNo = item.buFaZhuiZongHao;
				csJson.zhuizhongType = item.chuLiFangShiType;
				csJson.wuliugongsi = item.bufakuaidigongsi;
			} else {
				csJson.orderNum = item.orderId;
				csJson.expCode = item.tuijiankuaidigongsibm;
				csJson.expNo = item.tuiJianZhuiZongHao;
				csJson.zhuizhongType = item.chuLiFangShiType;
				csJson.wuliugongsi = item.tuijiankuaidigongsi;
			}

			console.log(csJson)
			console.log(item)
			erp.postFun('caigou/dispute/getWuLiu', csJson, function (data) {
				console.log(data)
				if (data.data.statusCode == 200) {
					$scope.wlMesFlag = true;
					let result = data.data.result;
					$scope.wlMsgList = result.Traces;
				} else {
					layer.msg(data.data.message)
				}
			}, function (data) {
				console.log(data)
			})
		}
		//待签收获取物流信息
		$scope.dqsHqwlXxFun = function (item, index, ev) {
			$scope.wlMsgList = [];
			erp.postFun('caigou/dispute/getWuLiu', {
				"orderNum": item.orderId,
				"zhuizhongType": "3"
			}, function (data) {
				console.log(data)
				if (data.data.statusCode == 200) {
					let result = data.data.result;
					if (result.success) {
						if (result.errorMessage) {
							layer.msg(result.errorMessage)
						} else {
							$scope.qsWlMesFlag = true;
							$scope.wlMsgList = result.logisticsTrace[0].logisticsSteps;
						}
					} else {
						layer.msg(result.errorMessage)
					}
				} else {
					layer.msg(data.data.message)
				}
			}, function (data) {
				console.log(data)
			})
		}
		//提交订单
		$scope.submitOrdFun = function (zddlist, index, ev) {
			$scope.itemCgOrdId = zddlist.ID;
			$scope.ordSpBtList = zddlist.caiGouGuanLianList;
			erp.postFun('caigou/alProduct/getCaiGouAdressAndInvoiceBill', { "cargoParamList": JSON.stringify($scope.ordSpBtList) }, function (data) {
				console.log(data)
				if (data.data.statusCode == 200) {
					if (data.data.result) {
						$scope.addressList = data.data.result.adresses;
						$scope.invoiceBills = data.data.result.invoiceBills;
						$scope.ordMesBtList = data.data.result.cargoParamList;
						if ($scope.ordMesBtList && $scope.ordMesBtList.length > 0) {
							for (let i = 0, len = $scope.ordMesBtList.length; i < len; i++) {//先赋给一个不传参的变量 点击保存成功后再赋值
								$scope.ordMesBtList[i]['spNum'] = $scope.ordMesBtList[i].quantity;
							}
						}
						qplNum()
						for (let i = 0, len = $scope.addressList.length; i < len; i++) {
							if ($scope.addressList[i].isDefault) {
								$scope.defaultAddObj = $scope.addressList[i];
								break;
							}
						}
						$scope.invoiceObj = $scope.invoiceBills[0];
						$scope.ordDelFlag = true;
						$scope.isFxFlag = data.data.result.isFenXiao;
						$scope.ordType = $scope.isFxFlag ? 'saleproxy' : 'general';
					} else {
						layer.msg(data.data.message)
					}
				} else {
					layer.msg(data.data.message)
				}
			}, function (data) {
				console.log(data)
			}, { layer: true })
		}
		$scope.checkAddressFun = function (item) {
			for (let i = 0, len = $scope.addressList.length; i < len; i++) {
				$scope.addressList[i].isDefault = false;
			}
			item.isDefault = true;
			console.log(item)
			$scope.defaultAddObj = item;
		}
		$scope.checkYouHuiFun = function (item) {
			for (let i = 0, len = $scope.resJson.cargoList[0].cargoPromotionList.length; i < len; i++) {
				$scope.resJson.cargoList[0].cargoPromotionList.selected = false;
			}
			item.selected = true;
		}
		$scope.isNumFun = function (item, key, val) {
			console.log(key, val)
			val = val.replace(/[^\d]/g, '');
			if (val < 0) {
				val = 0;
			}
			item[key] = val;
		}
		$scope.delItemSpFun = function (item, index) {
			$scope.ordMesBtList.splice(index, 1)
		}
		$scope.baoCunNumFun = function (item) {
			erp.postFun('caigou/alProduct/updateCaiGouGuanLian', {
				"id": item.ID,
				"quantity": item.spNum
			}, function (data) {
				console.log(data)
				layer.msg(data.data.message)
				if (data.data.statusCode == 200) {
					item.quantity = item.spNum;
				}
			}, function (data) {
				console.log(data)
			}, { layer: true })
		}
		$scope.ordType = 'general';
		function qplNum() {
			let obj = {}
			for (let i = 0, len = $scope.ordMesBtList.length; i < len; i++) {
				if (obj[$scope.ordMesBtList[i].offerId]) {
					obj[$scope.ordMesBtList[i].offerId] = $scope.ordMesBtList[i].quantity + obj[$scope.ordMesBtList[i].offerId]
				} else {
					obj[$scope.ordMesBtList[i].offerId] = $scope.ordMesBtList[i].quantity
				}
			}
			console.log(obj)
			for (key in obj) {
				console.log(key)
				for (let i = 0, len = $scope.ordMesBtList.length; i < len; i++) {
					if ($scope.ordMesBtList[i].offerId == key) {
						$scope.ordMesBtList[i].btCgCountNum = obj[key]
					}
				}
			}
			console.log($scope.ordMesBtList)
		}
		//订单预览
		$scope.ordYuLan = function () {
			// for(let i = 0,len = $scope.ordMesBtList.length;i<len;i++){
			//     if($scope.ordMesBtList[i].minOrderQuantity!=0 && $scope.ordMesBtList[i].spNum > $scope.ordMesBtList[i].amountOnSale){
			//         layer.msg('购买数量大于库存,无法下单')
			//         return
			//     }
			//     if($scope.ordMesBtList[i].minOrderQuantity!=0 && $scope.ordMesBtList[i].spNum < $scope.ordMesBtList[i].minOrderQuantity){
			//         layer.msg('购买数量小于起批量,无法下单')
			//         return
			//     }
			// }
			if (!$scope.ordSpBtList) {
				layer.msg('该商品没有变体')
				return
			}
			// if (!$scope.defaultAddObj) {
			//     for (let i = 0, len = $scope.addressList.length; i < len; i++) {
			//         if ($scope.addressList[i].isDefault) {
			//             $scope.defaultAddObj = $scope.addressList[i];
			//             break;
			//         }
			//     }
			// }
			$scope.defaultAddObj['addressId'] = $scope.defaultAddObj.id;
			$scope.defaultAddObj['phone'] = $scope.defaultAddObj.mobile;
			erp.postFun('caigou/alProduct/createOrderPreview', {
				"addressParam": $scope.defaultAddObj,
				"cargoParamList": $scope.ordMesBtList,
				"invoiceParam": $scope.invoiceObj,
				"flow": $scope.ordType
			}, function (data) {
				console.log(data)
				let resResult = data.data.result;
				if (data.data.statusCode == 200) {//请求接口成功
					if (resResult.success) {//请求1688成功
						$scope.resJson = resResult.orderPreviewResuslt[0];
						let cargoList = $scope.resJson.cargoList;
						$scope.ordSpBtList = piPeiFun($scope.ordMesBtList, cargoList);
						$scope.xiaDanFlag = true;
					} else {
						try {
							layer.msg(resResult.errorMsg, { time: 6000 })
						} catch (error) {
							layer.msg(resResult.errorMsg.errorMessage, { time: 6000 })
						}

					}
				} else {
					layer.msg(data.data.message)
				}

			}, function (data) {
				console.log(data)
			}, { layer: true })
		}
		//创建订单
		$scope.chuangJianOrdFun = function () {
			console.log($scope.mesTo1688)
			$scope.defaultAddObj['addressId'] = $scope.defaultAddObj.id;
			$scope.defaultAddObj['phone'] = $scope.defaultAddObj.phone;
			$scope.defaultAddObj['mobile'] = $scope.defaultAddObj.mobile;
			$scope.defaultAddObj['postCode'] = $scope.defaultAddObj.addressCode;
			$scope.defaultAddObj['districtCode'] = $scope.defaultAddObj.addressCode;
			$scope.defaultAddObj['provinceText'] = $scope.defaultAddObj.addressCodeText.split(' ')[0];
			$scope.defaultAddObj['cityText'] = $scope.defaultAddObj.addressCodeText.split(' ')[1];
			$scope.defaultAddObj['areaText'] = $scope.defaultAddObj.addressCodeText.split(' ')[2];
			// 'caigou/alProduct/createCrossOrder' {addressParam: '', cargoParamList: '', flow: '', message: ''}  ---> 'procurement/order/createCrossOrder'  
			erp.postFun('caigou/alProduct/createCrossOrder', {
				"addressParam": $scope.defaultAddObj,
				"cargoParamList": $scope.ordMesBtList,
				"flow": $scope.ordType,
				"message": $scope.mesTo1688
			}, function ({data}) {
				console.log(data)
				if (data.code == 200 && data.data) {
					$scope.payUrlLink = data.data;
					$scope.xiaDanFlag = false;
					$scope.ordDelFlag = false;
					$scope.payUrlFlag = true;
					$scope.mesTo1688 = '';
					getListFun()
				} else {
					layer.msg(data.data.message || '生成1688订单失败')
				}
			}, function (data) {
				console.log(data)
			})
		}
		$scope.fuKuanStuFun = function (stu) {
			$scope.fuKuanStuVal = stu;
			$scope.payResultFlag = true;
		}
		$scope.fuKuanResFun = function (stu) {
			if (stu == 1) {//付款成功按钮
				erp.postFun('caigou/alProduct/updateCaiGouDingDan', {
					"id": $scope.itemCgOrdId,
					"payStatus": "1",
					"status": "1"
				}, function (data) {
					console.log(data)
					layer.msg(data.data.message)
					if (data.data.statusCode == 200) {
						$scope.payResultFlag = false;
						$scope.payUrlFlag = false;
						getListFun()
					}
				}, function (data) {
					console.log(data)
				})
			} else {//付款失败
				erp.postFun('caigou/alProduct/updateCaiGouDingDan', {
					"id": $scope.itemCgOrdId,
					"payStatus": "2",
					"status": "0"
				}, function (data) {
					layer.msg(data.data.message)
					if (data.data.statusCode == 200) {
						$scope.payResultFlag = false;
						$scope.payUrlFlag = false;
					}
				}, function (data) {
					console.log(data)
				})
			}
		}
		$scope.fuKuanFun = function (item, index, ev) {
			$scope.itemCgOrdId = item.id;
			erp.postFun('caigou/alProduct/getAlibabaAlipayUrl', {
				"orderid": item.orderId,
				"id": item.id
			}, function (data) {
				if (data.data.statusCode == 200) {
					let resResult = data.data.result;
					// window.open(resResult.payUrl)
					$scope.payUrlFlag = true;
					$scope.payUrlLink = resResult.payUrl;
				} else {
					layer.msg(data.data.message)
				}
			}, { layer: true })
		}
		$scope.tongBuDiZhiFun = function () {
			erp.postFun('caigou/alProduct/shuaXinShouHuoDiZhi', {}, function (data) {
				layer.msg(data.data.message)
				if (data.data.statusCode == 200) {
					$scope.tongBuDiZhiFlag = false;
				}
			}, function (data) {
				console.log(data)
			}, { layer: true })
		}
		function piPeiFun(arr1, arr2) {
			if (arr1 && arr1.length > 0 && arr2 && arr2.length > 0) {
				for (let i = 0, len = arr1.length; i < len; i++) {
					for (let j = 0, jlen = arr2.length; j < jlen; j++) {
						console.log(arr2[j].specId, arr2[j].specId == null)
						if ((arr1[i].offerId == arr2[j].offerId && arr1[i].specId == arr2[j].specId) || (arr1[i].offerId == arr2[j].offerId && arr2[j].specId == undefined)) {
							console.log(i)
							arr1[i]['bt1688Price'] = arr2[j].finalUnitPrice;
							arr1[i]['bt1688Amount'] = arr2[j].amount;
							console.log(arr2[j])
							console.log(arr1[i])
							break;
						} else {
							console.log(arr1[i].offerId, arr2[j].skuId, arr1[i].offerId == arr2[j].skuId)
						}
					}
				}
				return arr1;
			} else {
				return false
			}
		}
		//财务页面的退款
		$scope.tuiKuanFun = function (item, pIndex, index, ev) {
			ev.stopPropagation()
			console.log(item)
			$scope.tuiKuanCount = item.tuiKuanJinE;
			$scope.itemId = item.id;
			$scope.cwTuiKuanFlag = true;
		}
		$scope.sureTuiKuanFun = function () {
			erp.postFun('caigou/procurement/yiChangWanCheng', { "id": $scope.itemId }, function (data) {
				console.log(data)
				layer.msg(data.data.message)
				if (data.data.statusCode == 200) {
					$scope.cwTuiKuanFlag = false;
					getListFun()
				}
			}, function (data) {
				console.log(data)
			})
		}
		//给子订单里面的订单添加选中非选中状态
		var cziIndex = 0;
		$('#c-zi-ord').on('click', '.cor-check-box', function () {
			if ($(this).attr('src') == 'static/image/order-img/multiple1.png') {
				$(this).attr('src', 'static/image/order-img/multiple2.png');
				cziIndex++;
				if (cziIndex == $('#c-zi-ord .cor-check-box').length) {
					$('#purch-box .c-checkall').attr('src', 'static/image/order-img/multiple2.png');
				}
			} else {
				$(this).attr('src', 'static/image/order-img/multiple1.png');
				cziIndex--;
				if (cziIndex != $('#c-zi-ord .cor-check-box').length) {
					$('#purch-box .c-checkall').attr('src', 'static/image/order-img/multiple1.png');
				}
			}
		})
		//全选
		$('#purch-box').on('click', '.c-checkall', function () {
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
		$scope.checkAllFun = function (checkFlag) {
			console.log($scope.checkAllMark)
			for (let i = 0, len = $scope.erporderList.length; i < len; i++) {
				$scope.erporderList[i].checked = checkFlag;
			}
		}
		$scope.checkFun = function (item, checked, e) {
			e.stopPropagation();
			if (item.checked) {
				let checkCount = 0;
				for (let i = 0, len = $scope.erporderList.length; i < len; i++) {
					if ($scope.erporderList[i].checked) {
						checkCount++
					}
				}
				if (checkCount == $scope.erporderList.length) {
					$scope.checkAllMark = true;
				} else {
					$scope.checkAllMark = false;
				}
			} else {
				$scope.checkAllMark = false;
			}
		}
		$scope.bulkTjFun = function () {
			let checkCount = 0;
			let orginArr = [];
			for (let i = 0, len = $scope.erporderList.length; i < len; i++) {
				if ($scope.erporderList[i].checked) {
					checkCount++
					orginArr.push($scope.erporderList[i].caiGouGuanLianList)
					console.log($scope.erporderList[i].caiGouGuanLianList)
				}
			}
			if (checkCount > 0) {
				console.log(orginArr)
				$scope.ordSpBtList = orginArr.flat();
				console.log($scope.ordMesBtList)
				// $scope.ordDelFlag = true;
				erp.postFun('caigou/alProduct/getCaiGouAdressAndInvoiceBill', { "cargoParamList": JSON.stringify($scope.ordSpBtList) }, function (data) {
					console.log(data)
					if (data.data.statusCode == 200) {
						if (data.data.result) {
							$scope.addressList = data.data.result.adresses;
							$scope.invoiceBills = data.data.result.invoiceBills;
							$scope.ordMesBtList = data.data.result.cargoParamList;
							if ($scope.ordMesBtList && $scope.ordMesBtList.length > 0) {
								for (let i = 0, len = $scope.ordMesBtList.length; i < len; i++) {//先赋给一个不传参的变量 点击保存成功后再赋值
									$scope.ordMesBtList[i]['spNum'] = $scope.ordMesBtList[i].quantity;
								}
							}
							$scope.invoiceObj = $scope.invoiceBills[0];
							$scope.ordDelFlag = true;
						} else {
							layer.msg(data.data.message)
						}
					} else {
						layer.msg(data.data.message)
					}
				}, function (data) {
					console.log(data)
				}, { layer: true })
			} else {
				layer.msg('请选择商品')
			}
		}
		let delArr = [];
		$scope.bulkDelFun = function () {
			delArr = [];
			let checkCount = 0;
			for (let i = 0, len = $scope.erporderList.length; i < len; i++) {
				if ($scope.erporderList[i].checked) {
					checkCount++
					if ($scope.erporderList[i].caiGouGuanLianList) {
						for (let k = 0, kLen = $scope.erporderList[i].caiGouGuanLianList.length; k < kLen; k++) {
							let obj = {
								"ID": $scope.erporderList[i].caiGouGuanLianList[k].ID
							};
							console.log(obj)
							delArr.push(obj)
						}
					}
				}
			}
			if (checkCount > 0) {
				$scope.isDelFlag = true;
			} else {
				layer.msg('请选择商品')
			}
		}
		$scope.spDelFun = function (item, e) {
			e.stopPropagation()
			delArr = [];
			$scope.isDelFlag = true;
			for (let k = 0, kLen = item.caiGouGuanLianList.length; k < kLen; k++) {
				let obj = {
					"ID": item.caiGouGuanLianList[k].ID
				};
				delArr.push(obj)
			}
		}
		$scope.sureDelFun = function () {
			console.log({ 'caiGouGuanLianList': delArr })
			erp.postFun('caigou/alProduct/deleteCaiGouGuanLian', { 'caiGouGuanLianList': delArr }, function (data) {
				console.log(data)
				if (data.data.statusCode == 200) {
					$scope.isDelFlag = false;
					layer.msg('删除成功')
					getListFun()
				} else {
					layer.msg('删除失败')
				}
			}, function (data) {
				console.log(data)
			})
		}
		// $('.orders-table').on('mouseenter','.ordlist-fir-td',function () {
		//     $(this).parent('.erporder-detail').next().hide();
		// })
		$('.orders-table').on('mouseenter', '.erporder-detail>td', function () {
			if ($(this).hasClass('ordlist-fir-td')) {
				return
			}
			$(this).parent('.erporder-detail').next().show();
			$('.orders-table .erporder-detail').removeClass('erporder-detail-active');
			$(this).parent('.erporder-detail').addClass('erporder-detail-active');
		})

		$('.orders-table').on('mouseleave', '.erporder-detail', function () {
			$(this).next().hide();
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
		$scope.navQueryPackage = navQueryPackage;// 新老页面用同一套 查询包裹 跳转页面不一致 
		function navQueryPackage() {
			const url = $scope.isNewFlag === 'new' ? '/query_package.html' : '/query-parcel.html';
			erp.navTo(url, '_blank')
		}

		/* 待签收增加关闭功能 status=2 881385250019418614*/
		$scope.waybillObj = {
			show:false

		}
		/* 编辑运单号 */
		$scope.editWaybill = (item,index,e)=>{
			e.stopPropagation();
			const zhuiZongHao = item.zhuiZongHao;
			let list = [];
			if(!zhuiZongHao || Object.keys(zhuiZongHao).length==0){//当前不存在追踪号时
				list.push({
					logisticsCompany:'',
					trackingNumber:'',
					orderId:item.orderId
				})
			}else{
				for(let key in zhuiZongHao){
					list.push({
						logisticsCompany:zhuiZongHao[key],
						trackingNumber:key,
						orderId:item.orderId
					})
				}
			}
			$scope.waybillObj.list = list;
			$scope.waybillObj.show = true;
		}
		$scope.addWaybillItem=()=>{
			$scope.waybillObj.list.push({
				logisticsCompany:'',
				trackingNumber:'',
				orderId:$scope.waybillObj.list[0].orderId
			})
		}
		$scope.deleteWaybillItem=(index)=>{
			if($scope.waybillObj.list.length==1) return layer.msg('必须保留一个运单号')
			$scope.waybillObj.list.splice(index,1);
		}
		/* 确定提交运单号编辑 */
		$scope.editWaybillSure = ()=>{
			let isError = false;
			$scope.waybillObj.list.forEach(item=>{
				item.active=false;
				if(!item.logisticsCompany || !item.trackingNumber){
					item.active=true;
					isError=true;
				}
			})
			if(isError) return layer.msg('请填写相关信息');
			erp.postFun('procurement/caigouDingdan/saveTrackingNumber', $scope.waybillObj.list, function ({data}) {
				if(data.code==200){
					layer.msg('提交成功')
					$scope.waybillObj.show = false;
					getOrdListFun();
				}
			})
		}
		/* 关闭订单 */
		$scope.closeOrderShow = (item,index,e)=>{
			e.stopPropagation();
			$scope.closeOrderObj = {
				show:true,
				remark:'',
				orderId:item.orderId,index
			}
		}
		$scope.closeOrder = ()=>{
			const {orderId,remark,index}=$scope.closeOrderObj;
			const param = {
				orderId:orderId,
				remark:remark
			}
			erp.postFun('procurement/caigouDingdan/closeOrder', param, function ({data}) {
				if(data.code==200){
					layer.msg('提交成功');
					$scope.closeOrderObj.show=false;
					$scope.erporderList.splice(index,1);
				}
			})
		}
	}])
})();