(function () {
    var app = angular.module('erppurchaseAbnormal', [])

    var APIS = {
        getList: 'procurement/dealWith/getUnderlineExceptionList',// 获取列表
        handleItem:'procurement/dealWith/updateDealException',// 处理异常
        doneHandle:'procurement/dealWith/updateFinishException',// 完成 提交
    }

    const inputShowWay = {// 对应字段在对应处理方式的时候显示
        wlGsInfo: ['7', '9', '2', '0', '6', '12', '13'],// 物流公司
        zhuiZongHao: ['7', '9', '2', '0', '6', '12', '13'],// 追踪号
        tuihuozhuiZongHao: ['2', '6', '7', '9', '12', '13'],// 退货追踪号
        tuihuodizhi: ['7', '9', '2', '6', '12', '13'],// 退货地址
        returnNun: ['2'],// 退货数量
        feiyongchengdanfang: ['7', '9', '6', '2', '12', '13'],// 退货运费承担方
        yunfeijine: ['7', '9', '6', '2', '12', '13'],// 运费金额
        refundAmount: ['7', '8', '6', '1'],// 退款金额
        yufeishengqingfangshi: ['7', '9', '6', '2', '12', '13'],// 运费申请方式
        youjizhongliang: ['7', '9', '6', '2', '12', '13'],// 邮寄重量
        bufakuaidigongsi: ['6'],// 补发快递公司
        bufazhuizonghao: ['0'], // 补发追踪号
        huanhuogongsi: ['6'],// 换货物流公司
        huanhuozhuizonghao: ['6'],// 换货追踪号 
        tuikuanpingzheng: ['1', '2', '6', '7', '8', '9', '12', '13'], // 退款凭证
        beizhu:['2','6','15']
    }
    var ctrlAbnormal = function ($scope, erp, $routeParams, $timeout) {
        console.log("abnormalReceiptCtrl")

        $scope.pageNum = 1;
        $scope.pageSize = '50';
        $scope.searchVal = ''
        $scope.startTime = '';
        $scope.endTime = '';
        $scope.yiChangStu = '0'
        $scope.dingdanhaoType = 'orderId'
        $scope.biantiSku = '';
        $scope.orderId = '';
        $scope.caigouren = '';
        $scope.fuKuanRen = '';
        $scope.gongHuoGongSi = '';
        $scope.zhuiZongHao = '';
        $scope.returnNun = ''

        $scope.sta = true;
        $scope.tabArr = [
            { name: '待处理', val: '0', isActive: true, },
            { name: '处理中', val: '1', isActive: false, },
            { name: '已完成', val: '2', isActive: false, },
        ]
        $scope.errorType = {
            3:'质量问题',
            4:'数量问题',
            5:'颜色问题',
            6:'尺寸问题',
            7:'其它',
        }
        $scope.getErrorType = (val)=>{
            return $scope.errorType[val];
        }
        $scope.chuLiStuFun = function (item) {
            for (i = 0; i < $scope.tabArr.length; i++) {
                $scope.tabArr[i].isActive = '';
            }
            item.isActive = true;
            $scope.val = item.val;
            $scope.yiChangStu = item.val;
            $scope.sendParams.chuLiStatus = item.val
            $scope.sendParams.pageNum = '1';
            getListFun();
        }

        let searchArr = ['orderId','sku']
        $scope.sendParams = {
            pageNum: '1',
            pageSize: '10',
            payType: $scope.payWay || '', // 1 预付订金 2 先付款后发货 3 先发货后付款
            chuLiStatus: '0',// 处理状态    0-待处理，1-处理中，2-已完成
            orderId: '',// 采购订单号
            yiChangLeiXing: '',// 异常类型 1-未发货，2-未收到，3-质量问题，4-数量问题，5-颜色问题，6-尺寸问题，7-其他
            batchNum: '',// 批次号
            beginDate: '2020-05-07',//moment().add(-2, 'd').format('YYYY-MM-DD')
            endDate: '',
            procurementType:''
        }
        $('#c-data-time').val($scope.sendParams.beginDate)
        function getListFun() {
            erp.load()
            const printData = angular.copy($scope.sendParams);
            searchArr.forEach(item=>{
                printData[item]='';
            })
            printData[$scope.dingdanhaoType]=$scope.searchVal;
            printData.procurementType=$scope.purchaseType?+$scope.purchaseType:'';
            printData.payType = $scope.payWay
            printData.beginDate = $('#c-data-time').val()
            printData.endDate = $('#cdatatime2').val()

            const setObj = () => {// 格式化字符为js对象
                const list = erp.deepClone($scope.erporderList)
                list.forEach(function (_, i) {
                    list[i].zhuiZongHao = JSON.parse(_.zhuiZongHao)
                    list[i].yiQianShouZhuiZongHao = JSON.parse(_.yiQianShouZhuiZongHao)
                })
                $scope.erporderList = list;
            }

            erp.postFun(APIS.getList, JSON.stringify(printData), function (data) {
                layer.closeAll('loading')
                console.log("data", data)
                if (data.data.code != 200) return layer.msg(data.data.message || '服务器出错了')
                const obj = data.data.data;
                // $scope.erpordTnum = obj.total;
                $scope.erporderList = obj.list
                setObj()
                $scope.pageObj = {
                    pageSize: $scope.pageSize,//每页条数
                    pageNum: $scope.pageNum,//页码
                    totalNum: Math.ceil(Number(obj.total) / Number($scope.pageSize)),//总页数
                    totalCounts: obj.total,//数据总条数
                    pageList: ['10', '20', '50']//条数选择列表，例：['10','50','100']
                }
            })
        }
        getListFun()

        $scope.$on('pagedata-fa', function (d, data) {// 分页onchange
            $scope.sendParams.pageNum = data.pageNum
            $scope.sendParams.pageSize = data.pageSize
            getListFun()
        })

        $scope.searchFun = function () {
            $('.time-click').removeClass('time-act')
            const params = angular.copy($scope.sendParams)
            // params.beginDate = $('#c-data-time').val()
            // params.endDate = $('#cdatatime2').val()
            $scope.sendParams.pageNum = '1'

            $scope.biantiSku = '';
            $scope.orderId = '';
            $scope.caigouren = '';
            $scope.fuKuanRen = '';
            $scope.gongHuoGongSi = '';
            $scope.zhuiZongHao = '';
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
        let initUpdateParams = {// 修改状态
            chuLiFangShiType: "0", // 处理方式
            tuijiankuaidigongsibm: "",// 退货公司编码
            tuiJianZhuiZongHao: "",// 退货追踪号
            tuihuodizhi: "",// 退货地址
            feiyongchengdanfang: "卖家",// 费用承担方 
            youjizhongliang: "首重",// 邮寄重量
            tuiKuanJinE: "",// 退款金额
            bufakuaidigongsibm: "",// 补发快递公司编码
            buFaZhuiZongHao: "",// 补发快递追踪号
            returnNun:'',// 退款数量
            zhuangzhangpingzheng:'',// 上传凭证
            yufeishengqingfangshi:'线上申请',// 运费申请方式
            caiGouShangPinTianSkuId: '',// 商品id
            remark:''
        }
        const getDealDetail = ()=>{
            layer.load(2);
            let param = {caiGouShangPinTianSkuId:$scope.currentItem.caigoushangpintianskuid};                
            erp.postFun('procurement/dealWith/getfinal ',param,function({data}){
                layer.closeAll();
                let odata = data.data;
                odata.yiChangLeiXing = odata.yiChangLeiXing+'';
                odata.yunfeijine=+odata.yunfeijine;
                odata.refundAmount=+odata.tuiKuanJinE;
                odata.returnNun = +odata.shuLiang;
                $scope.updateParams = erp.deepClone(odata);
                if($scope.sendParams.chuLiStatus==2){
                    $scope.handleWay.filter(item=>{
                        if($scope.updateParams.chuLiFangShiType==item.value)$scope.updateParams.chuLiFangShiName=item.name;
                    })
                    $scope.wlGsList.filter(item=>{
                        if(odata.bufakuaidigongsibm==item.code)$scope.updateParams.bufakuaidigongsi=item.name;
                        if(odata.tuijiankuaidigongsibm==item.code)$scope.updateParams.tuijiankuaidigongsi=item.name;
                    })
                }
                if($scope.currentItem.zhuangzhangpingzheng) $scope.imgArr.push($scope.currentItem.zhuangzhangpingzheng);
            })
        }
        //将处理信息处理（待处理:置空；处理中、已完成：信息写入）
        const initUpdateParamsFun = function(){
            $scope.imgArr = [];
            if($scope.sendParams.chuLiStatus==1||$scope.sendParams.chuLiStatus==2){
                getDealDetail();
            }else{
                let unkey = ['chuLiFangShiType','feiyongchengdanfang','youjizhongliang','yufeishengqingfangshi'];
                for(let key in initUpdateParams){
                    if(!unkey.includes(key)){
                        initUpdateParams[key]='';
                    }
                }
                $scope.updateParams = erp.deepClone(initUpdateParams);
            }
        }
        initUpdateParamsFun()

        $scope.handelFun = function () {// 处理异常接口
            for(let key in initUpdateParams){
                initUpdateParams[key] = $scope.updateParams[key];
                initUpdateParams.tuiKuanJinE=$scope.updateParams.refundAmount;
                initUpdateParams.yunfeijine=$scope.updateParams.yunfeijine;
            }
            const params = erp.deepClone(initUpdateParams)
            params.zhuangzhangpingzheng = $scope.imgArr[0]
            params.caiGouShangPinTianSkuId = $scope.currentItem.caigoushangpintianskuid

            layer.load(2)
            erp.postFun(
                APIS.handleItem, 
                JSON.stringify(params), 
                function (res) {
                    layer.closeAll('loading')
                    if(res.data.code != 200) return layer.msg(res.data.message || '服务器错误')
                    layer.msg('操作成功')
                    $scope.chuliYcFlag = false
                    getListFun()
            })
        }

        $scope.chuLiYcFun = function (item, pIndex, index, ev) {// 打开异常处理窗口
            ev.stopPropagation()
            $scope.currentItem = item

            $scope.itemId = item.id;
            $scope.chuliYcFlag = true;
            $scope.pIndex = pIndex;
            $scope.index = index;
            $scope.chuLiFs = $scope.sendParams.chuLiStatus==1? item.chuLiFangShiType+'' : '0';
            initUpdateParamsFun()
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

        // 记录
        $scope.jiLuFun = function (item, index, ev, pItem) {
            $scope.jiLuList = [];
            $scope.itemId = item.id;
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
            erp.postFun(APIS.doneHandle, {
                caiGouShangPinTianSkuId: item.caigoushangpintianskuid
            }, function (data) {
                erp.closeLoad()
                console.log(data)
                
                if (data.data.code != 200) return layer.msg(data.data.message || '服务器错误')
                getListFun()
                layer.msg('操作成功')
            })
        }
        //处理异常
        $scope.chuLiFs = '0';// 处理方式
        $scope.handleWay = [// 处理方式列表
            { name: '仅补发', value: '0' },
            { name: '仅退款', value: '1' },
            { name: '退货退款', value: '2' },
            { name: '退货换货', value: '6' },

            { name: '退货退预付订金', value: '7' },
            { name: '不退货退预付订金', value: '8' },
            { name: '退货并支付部分尾款', value: '9' },
            { name: '不退货支付部分尾款', value: '10' },

            { name: '不退货部分打款', value: '11' },
            { name: '退货并部分打款', value: '12' },
            { name: '仅退货', value: '13' },

            { name: '其它', value: '3' },
            { name: '合格', value: '14' },
            { name: '采购错误', value: '15'}
        ]
        $scope.getHandleWayForPayWay = function () {// 针对payWay 付款方式 获取当前可操作的处理方式列表
            const payWay = $scope.payWay || '2'
            const handleList = $scope.handleWay
            const payWayList = {// 对应支付方法对应的处理方式列表
                '1': ['0', '6', '7', '8', '9', '10', '3','14','15'],
                '2': ['0', '1', '2', '6', '3','14','15'],
                '3': ['0', '6', '13', '11', '12', '3','14','15'],
            }

            const currentHandleList = payWayList[payWay]
            const retList = []
            handleList.forEach(function (item) {
                currentHandleList.forEach(function (i) {
                    if (i == item.value) {
                        retList.push(item)
                    }
                })
            })

            return retList
        }

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

        // 新字段采购类型方式的处理
        $scope.purchaseType = ''// 采购方式 0 1688非API 1 1688API 2 淘宝 3 天猫 4 线下
        $scope.purchaseList = [
            { name: '全部', val: '' },
            { name: '1688非API', val: 0 },
            { name: '1688API', val: 1 },
            { name: '淘宝', val: 2 },
            { name: '天猫', val: '3' },
            { name: '线下', val: '4' }
        ]
        $scope.purchaseTypeChange = function () {
            getListFun();
        }

        $scope.payWay = '' // 付款方式  1 预付订金 2 先付款后发货 3 先发货后付款
        $scope.payWayObj = {// 付款方式
            '1': '预付订金',
            '2': '先付款后发货',
            '3': '先发货后付款',
        }

        $scope.changePaytype = function(){
            getListFun()
        }

        $scope.showInputs = function (name) {// 是否显示字段
            const handleWay = $scope.updateParams.chuLiFangShiType
            const theShowList = inputShowWay[name]
            if (!theShowList || theShowList.length <= 0) return false
            const isShow = theShowList.includes(handleWay)
            return isShow
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
        //提交处理
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
                if (!$scope.chuLiReson) {
                    layer.msg('输入框不能为空')
                    return
                }
            } else if ($scope.chuLiFs == 6) {
                console.log($scope.refundAmount)
                console.log($scope.bufazhuizonghao)
                console.log($scope.bufakuaidigongsi)
                if (!$scope.refundAmount || !$scope.bufazhuizonghao || !$scope.bufakuaidigongsi) {
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
            } else if ($scope.chuLiFs == 6) {
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
                    $scope.chuLiReson0 = undefined;
                    $scope.chuLiReson1 = undefined;
                    $scope.chuLiReson2 = undefined;
                    $scope.chuLiReson3 = undefined;
                    getListFun()
                }
            }, function (data) {
                console.log(data)
            })
        };
        //处理显示
        $scope.showDealDetail = function (item, pIndex, index, ev) {// 打开异常处理窗口
            ev.stopPropagation()
            $scope.currentItem = item;
            $scope.itemId = item.id;
            $scope.dealDetailFlag = true;
            $scope.pIndex = pIndex;
            $scope.index = index;
            $scope.chuLiFs = $scope.sendParams.chuLiStatus==1? item.chuLiFangShiType+'' : '0';
            initUpdateParamsFun()
        }
        $scope.inputDom = document.getElementById('searchInfo');
        $scope.inputDom.focus();
        $scope.changeSearchType = ()=>{
            if($scope.dingdanhaoType=='sku') $scope.inputDom.focus();
        }
        //扫描枪事件
        $scope.handleSearch = (ev)=>{
            if (ev.keyCode !== 13) return;
            if($scope.dingdanhaoType=='sku'){
                let val = $scope.searchVal;
                $scope.searchVal = erp.sliceSku(val);
                getListFun();
            }else if($scope.searchVal){
                getListFun();
            }
        }
        
    }
    app.controller('ctrlAbnormal', ['$scope', 'erp', '$routeParams', '$timeout', ctrlAbnormal]) // 退货列表   
})()
