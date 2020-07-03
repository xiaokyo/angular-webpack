(function(){
    var app = angular.module('erp-receipt',[]);
    app.controller("abnormalReceiptCtrl",[
      "$scope",
      "erp",
      "$routeParams",
      "utils",
      "$location",
      "$filter",
      "$http",
      function($scope, erp, $routeParams, utils, $location, $filter,$http){
          console.log("abnormalReceiptCtrl")

          $scope.pageNum = 1;
            $scope.pageSize = '50';
            $scope.searchVal = ''
            $scope.startTime = '';
            $scope.endTime = '';
            $scope.yiChangStu = '0'
            $scope.dingdanhaoType = ''
            $scope.biantiSku = '';
            $scope.orderId = '';
            $scope.caigouren = '';
            $scope.fuKuanRen = '';
            $scope.gongHuoGongSi = '';
            $scope.zhuiZongHao = '';
            $scope.returnNun = ''

            var online = 0;
            $scope.sta = true;
            $scope.tabArr = [
                {name:'待处理',val:'0',isActive:true,},
                {name:'处理中',val:'1',isActive:false,},
                {name:'已完成',val:'2',isActive:false,},
            ]
            $scope.chuLiStuFun = function (item) {
                for(i=0;i<$scope.tabArr.length;i++){
                    $scope.tabArr[i].isActive = '';
                }
                item.isActive = true;
                $scope.val = item.val;
                // $scope.yiChangStu = stu;
                $scope.yiChangStu = item.val;
                $scope.pageNum = '1';
                getListFun();
            }
           
            function getListFun() {
                getOrdListFun()
            }
            console.log($scope.dingdanhaoType)
            getListFun()
            function getOrdListFun() {
                erp.load()
                var printData = {};
                console.log($scope.dingdanhaoType)
                if($scope.dingdanhaoType=='' || $scope.dingdanhaoType=='1'){
                    printData.inputStr = $scope.searchVal;
                }else{
                    printData.batchNum = $scope.searchVal;
                }
                printData.pageNum = $scope.pageNum + '';
                printData.pageSize = $scope.pageSize;
                // printData.inputStr = $scope.searchVal;
                // printData.biantiSku = $scope.biantiSku;//变体sku
                // printData.orderId = $scope.orderId;//1688订单号
                // printData.caigouren = $scope.caigouren;//采购人
                // printData.fuKuanRen = $scope.fuKuanRen;//付款人
                // printData.gongHuoGongSi = $scope.gongHuoGongSi;//供货公司
                // printData.zhuiZongHao = $scope.zhuiZongHao;//追踪号
                printData.status = 7;
                printData.startTime = $scope.startTime;
                
                
                printData.endTime = $scope.endTime;
                printData.yiChangZhuangTai = $scope.yiChangStu;
                    printData.chuLiFangShiType = '2';
                    printData.yiChangLeiXing = $scope.ycStuVal;
                    printData.caiGouZhangHu = $scope.ycCgZhVal;
                erp.postFun('caigou/procurement/caiGouDingDanLieBiao', JSON.stringify(printData), function (data) {
                    console.log("data", data)
                    // console.log("data.result",data.data.result)
                    var obj = data.data.result;
                    layer.closeAll('loading')
                    if (obj) {
                        obj = JSON.parse(obj)
                        console.log('异常列表',obj)
                        $scope.erpordTnum = obj.total;
                        $scope.erporderList = obj.result;
                        dealpage()
                    } else {
                        layer.msg('网络错误')
                    }
                }, function (data) {
                    layer.closeAll('loading')
                    console.log(data)
                })
            }
            $scope.searchFun = function () {
                $('.time-click').removeClass('time-act')
                $scope.ri = undefined;
                $scope.pageNum = '1';
                $scope.startTime = $('#c-data-time').val();
                $scope.endTime = $('#cdatatime2').val();
                console.log($scope.dingdanhaoType)
                // if($scope.dingdanhaoType=='' || $scope.dingdanhaoType=='1'){
                //     printData.batchNum = $scope.searchVal;
                // }else{
                //     printData.inputStr = $scope.searchVal;
                // }
                var val = $('#selectSearch').val();
                    $scope.biantiSku = '';
                    $scope.orderId = '';
                    $scope.caigouren = '';
                    $scope.fuKuanRen = '';
                    $scope.gongHuoGongSi = '';
                    $scope.zhuiZongHao = '';
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

            $scope.ycyyChangeFun = function () {
                $scope.pageNum = '1';
                getListFun();
            }
            $scope.zhChangeFun = function () {
                $scope.pageNum = '1';
                getListFun();
            }

        //查看大图
		$scope.showBigImgFun = function (img) {
			$scope.bigImgLink = img;
			$scope.bigImgFlag = true;
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
            // 批量删除
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
                    status: 7
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

            // 去1688
            $scope.go1688Fun = function () {
                window.open('https://trade.1688.com/order/buyer_order_list.htm?spm=a360q.8274423.1130995625.1.49c84c9aRvNusT&scene_type=&source=')
            }

            $scope.purchaseType = '0'// 采购方式 0 1688非API 1 1688API 2 淘宝 3 天猫 4 线下
            $scope.purchaseTypeObj = {// 采购方式
                '0': '线上',
                '4': '线下',
            }
            $scope.purchaseTypeChange = function(){
                if($scope.purchaseType == 4) location.href = '#/erppurchase/abnormal-list'
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
        
        // 处理
        $scope.bufakuaidigongsi = ''
        $scope.bufazhuizonghao = ''
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
        
        // 记录
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
        
        // 完成
        $scope.chuLiYcWcFun = function (item, pIndex, index, ev) {
			erp.load()
			erp.postFun('caigou/procurement/yiChangWanCheng', {
				id: item.id
			}, function (data) {
				console.log(data)
				erp.closeLoad()
				layer.msg(data.data.message)
				if (data.data.statusCode == 200) {
					// getListFun()
					$scope.erporderList[$scope.pIndex].cgsps[$scope.index].yiChangZhuangtai = 2;
				}
			}, function (data) {
				console.log(data)
				erp.closeLoad()
			})
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
        // 图片上传
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
	
        $scope.feiyongchengdanfang = '卖家';
		$scope.yufeishengqingfangshi = '线上申请';
        $scope.youjizhongliang = '首重';
       
		$scope.sureChuLiFun = function () {
            var upJson = {};
			console.log($scope.chuLiFs, $scope.wlGsInfo)
			if ($scope.chuLiFs == 0) {
				$scope.chuLiReson = $scope.chuLiReson0;
			} else if ($scope.chuLiFs == 1) {
                $scope.chuLiReson = $scope.chuLiReson1;
                // $scope.refundAmount = $scope.chuLiReson1;
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
			if ($scope.chuLiFs != 6) {
                upJson.zhuiZongHao = $scope.chuLiReson;
                if(!$scope.chuLiReson ){
                    layer.msg('输入框不能为空')
				    return
                }
            }else if($scope.chuLiFs == 6){
                console.log($scope.refundAmount)
                console.log($scope.bufazhuizonghao)
                console.log($scope.bufakuaidigongsi)
                if(!$scope.refundAmount || !$scope.bufazhuizonghao || !$scope.bufakuaidigongsi){
                    layer.msg('输入框不能为空')
				    return
                }
            }
			upJson.id = $scope.itemId;
            upJson.chuLiFangShi = $scope.chuLiFs;
			
			if ($scope.chuLiFs == 1) {
                upJson.tuikuanpingzheng = $scope.imgArr[0];
                upJson.refundAmount = $scope.refundAmount
			} else if ($scope.chuLiFs == 2) {
				upJson.zhuangzhangpingzheng = $scope.imgArr[0];
				upJson.tuihuodizhi = $scope.tuihuodizhi;
				upJson.feiyongchengdanfang = $scope.feiyongchengdanfang;
				upJson.yunfeijine = $scope.yunfeijine;
				upJson.yufeishengqingfangshi = $scope.yufeishengqingfangshi;
				upJson.youjizhongliang = $scope.youjizhongliang;
				upJson.returnNun = $scope.returnNun;
            } else if( $scope.chuLiFs == 6){
                upJson.zhuangzhangpingzheng = $scope.imgArr[0];
				upJson.tuihuodizhi = $scope.tuihuodizhi;
				upJson.feiyongchengdanfang = $scope.feiyongchengdanfang;
				upJson.yunfeijine = $scope.yunfeijine;
				upJson.yufeishengqingfangshi = $scope.yufeishengqingfangshi;
                upJson.youjizhongliang = $scope.youjizhongliang;
                upJson.tuikuanpingzheng = $scope.imgArr[0];
                upJson.refundAmount = $scope.refundAmount
                upJson.bufazhuizonghao = $scope.bufazhuizonghao;
                upJson.bufakuaidigongsi = $scope.bufakuaidigongsi;
                upJson.wuliugongsi = $scope.wlGsInfo.split('#')[0];
                $scope.refundAmount = $scope.chuLiReson1;
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
    }
    ])
})()