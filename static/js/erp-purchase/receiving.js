; ~function () {
    var app = angular.module('receiving', ['service']);
    app.controller('receivingCtrl', ['$scope', 'erp', '$q', function ($scope, erp, $q) {
        const productAttributes = [
            { label: '普货', value: '普货' },
            { label: '液体', value: '液体' },
            { label: '电池', value: '电池' },
            { label: '尖锐', value: '尖锐' },
            { label: '膏体', value: '膏体' },
            { label: '粉末', value: '粉末' },
            { label: '其他', value: '其他' }
        ];
        const api = {
            listUrl: 'procurement/order/getMarkupList',//post {barCod: ''}
            oldListUrl: 'caigou/procurementProduct/getMarkupList',//分标列表 post {cjproperty : '追踪号'} list item status === 2 确认按钮 不能点击
            confirmUrl_old: 'caigou/procurementProduct/splitMark',//分标 {post receiveNun: '到货数量',qualifiedNum: '合格数量', defectiveNum: '次品数量', lackNum: '缺少数量', moreNum: '多出数量',  realNum: '正品数量', realWeight: '实际重量', productL: '长', productW: '宽', productH: '高', id: '', sku: '', type: '1 - 分标 2 - 质检'}
            confirmUrl: 'warehousereceipt/caigouShangpintiansku/update',// ++ trackingNumber  procurementOrderId
            printUrl: 'caigou/procurementProduct/printingBarCode',//打印 {post {cjSku, cjShortSku, id, type: 6, qualifiedNum, moreNum, defectiveNum} }  原字段修改 realNum --> qualifiedNum
            // 1正品，2分标次品，3多货，4质检次品，5质检多货 ,6分标全部，7质检全部
            err_old: 'caigou/procurement/yiChang',//{post id: 'caiGouShangPinid', leiXing: '异常原因', shuLiang: '', yuanYin: '原因文本'}
            // realNum ---> 实际重量 weight ---> 系统重量 package 邮寄重量/包裹重量 ---> packWeight
            err: 'procurement/dealWith/yiChang',//{post id: 'caiGouShangPinid', leiXing: '异常原因', shuLiang: '', yuanYin: '原因文本'}
            actualWeight: 'caigou/procurementProduct/addWeightRecord',// 添加 修改实际重量记录 {post newWeight: '', oldWeight: '', productId: '', variantId: ''} { newweight:'cjskss', oldweight: 135666, productid: 15, variantid: 1 }

            packageWeight: 'pojo/procurement/changePackWeight',//修改邮寄重量 {post newWeight: '', oldWeight: '', productId: '', variantId: ''}
        }

        $scope.statusList = [
            { name: '全部', val: '' },
            { name: '待分标', val: 0 },
            { name: '已分标', val: 1 }
        ]
        $scope.purchaseList = [
            { name: '全部', val: '' },
            { name: '1688非API', val: '0' },
            { name: '1688API', val: '1' },
            { name: '淘宝', val: '2' },
            { name: '天猫', val: '3' },
            { name: '线下', val: '4' }
        ]
        $scope.storeList = erp.getWarehouseType();
        $scope.filterObj = {
            procurementType: '',
            store: ''
        }
        $scope.breakupObj = {
            show:false
        }
        function init() {
            initModule()
            initClipboard()//初始化 剪切板功能
        }
        init()

        function initModule() {
            $scope.list = [];//产品列表
            $scope.info = { show: false, img: '', variant: '', count: '', sku: '' }
            $scope.errList = [];//缺货列表
            $scope.params = {
                waybillNumber: '',//运单号  -- 订单号 or 运单号
                sku: '',// 核对 列表 商品   -- sku or shortsku
                productAttribute: '',//产品属性
            }
            $scope.errParams = {//提交异常参数
                id: '',
                leiXing: '3',
                shuLiang: 0,
                yuanYin: ''
            }
            /*重量 处理区域*/
            initRecordWeightParams()
            initPackageWeightParams()
            $scope.handleActualWeight = handleActualWeight;
            $scope.hideRecordWeightBox = initRecordWeightParams;
            $scope.submitRecordWeight = submitRecordWeight;
            $scope.submitPackageWeight = submitPackageWeight;
            $scope.hidePackageWeightBox = initPackageWeightParams;


            $scope.productAttributes = productAttributes;// 产品属性列表
            $scope.handleSearch = handleSearch;//enter or 扫码 搜索 列表
            $scope.handleSearchSku = handleSearchSku;// enter or 扫码 核对 信息
            $scope.handleConfirm = handleConfirm;//确认
            $scope.handlePrint = handlePrint; //打印
            $scope.hideInfoBox = initInfoBox;//隐藏 信息弹框
            $scope.handleInputReceivedNum = handleInputReceivedNum;//computed depend 到货数量
            $scope.handleInputQualifiedNum = handleInputQualifiedNum;//computed depend 合格数量
        }

        const inputWaybill = document.getElementById('inputWaybill')
        const inputSku = document.getElementById('inputSku')
        inputWaybill.focus() // 初始页面物流焦点input

        // 当前运单号是否是多品
        $scope.ishasManyVariants = false

        // sku正确次数
        $scope.variantsSubmitNum = 0

        function handleInputReceivedNum(item) {//改变到货数量，少货，多货、合格数量同时改变
            let { shuLiang, receiveNun } = item;
            shuLiang = +shuLiang || 0;
            receiveNun = +receiveNun || 0;
            const dis = shuLiang - receiveNun;
            item.moreNum = dis > 0 ? 0 : -dis;
            item.lackNum = dis > 0 ? dis : 0;
            item.qualifiedNum = receiveNun;
        }
        function handleInputQualifiedNum(item) {//合格数量不能大于实际数量
            let { receiveNun, qualifiedNum} = item;
            item.qualifiedNum=+qualifiedNum>+receiveNun?receiveNun:qualifiedNum;
        }
        $scope.filtergetData = ()=>{
            getList()
        }

        function getList() {//签收 获取 列表接口
            const barCod = $scope.params.waybillNumber;
            if (!barCod) return layer.msg('请输入/扫描运单号');
            const url = api.listUrl;
            const {store,procurementType} = $scope.filterObj
            let param = {
                barCod,
                store,
                procurementType
            }
            erp.mypost(url, param).then(res => {// status === 2 确认按钮 不能点击
                console.log("TCL: getList -> res", res)
                res = res || [];// res 可能 为  null

                const len = res.length
                if (len <= 0) {
                    inputWaybill.select();
                    $scope.list = [];
                    return;
                }
                inputSku.focus()
                $scope.variantsSubmitNum = 0 // 清空sku确认次数

                // 是否是多品
                $scope.ishasManyVariants = false
                if (len > 1) $scope.ishasManyVariants = true

                const list = res.map(item => {
                    let { qualifiedNum, defectiveNum, lackNum, moreNum, receiveNun, shuLiang, realWeight, weight, productH, productL, productW } = item;
                    const obj = { qualifiedNum, defectiveNum, lackNum, moreNum, receiveNun, shuLiang, realWeight, weight, productH, productL, productW };
                    for (const key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            const val = obj[key];
                            !val && (item[key] = 0)
                        }
                    }
                    item.qualifiedNum = qualifiedNum || +shuLiang;
                    item.receiveNun = receiveNun || +shuLiang;
                    item.realWeight = realWeight || +weight;
                    return item;
                });
                $scope.list = sortList(list)
                $scope.info = { show: false, img: '', variant: '', count: '', sku: '' }
                autoShowFirst()
            })
        }

        /* 2-26 需求 若只有一条数据 则显示该条数据大图 start */
        function autoShowFirst() {
            const list = $scope.list;
            if (!list || list.length === 0 || list.length > 1) return;
            const { cjImg: img, cjShortSku, cjSku: sku, shuLiang: count } = list[0];
            const variant = sliceShortSku(sku);
            $scope.info = { show: true, img, variant, count, sku }
        }
        /* 2-26 需求 若只有一条数据 则显示该条数据大图 end */

        /* 2-26 需求 核对商品 置顶 已确认商品 下方 未确认需求 上方 start */
        function sortList(list, sku) {// 确认的选项 靠后排列
            if (!list || list.length === 1) return list;
            list = list.slice();
            list.forEach(item => {
                item.sortNum = item.status === 2 ? 0 : 1;
                item.cjSku === sku && (item.sortNum = 2);
            })
            let newList = list.sort((prev, next) => next.sortNum - prev.sortNum)
            return newList;
        }
        /* 2-26 需求 核对商品 默认置顶 end */

        /*  回车 搜索 逻辑  旧版逻辑仅一个输入框时  (存在bug)  
          1. if       list 未存在 则 默认 getList
          2. else if 搜索内容 含 CJ  则为 变体 搜索  列表信息  有则 弹出对应 信息 没有则 viod
          3. else    默认搜索 列表对应信息 是否匹配  不匹配 则 getList 
        */
        /* 搜索 start */
        function handleSearch(ev) {//搜索 列表  扫描运单号获取 列表
            if (ev.keyCode !== 13) return;
            ev.target.blur()//主动失去焦点
            const val = $scope.params.waybillNumber;
            getList()
        }

        function handleSearchSku(ev) {//核对商品
            if (ev.keyCode !== 13) return;
            if ($scope.list.length === 0) return layer.msg('请先扫描包裹 获取确认列表')
            const val = $scope.params.sku;
            if (val.includes('CJ')) return findInfoBySku('sku', val);
            const shortSku = sliceSku(val);
            findInfoBySku('shortSku', shortSku)
            inputSku.select()

            function sliceSku(str) {// 与后端 约定 -->> 条形码 短码+批次号  后七位 为批次号
                if (!str) return '';
                if (str.length < 7) return str;
                str = str + '';
                try {
                    str = str.split('').reverse().slice(7).reverse().join('');
                } catch (err) {
                    console.log('sliceSku', err)
                }
                return str;
            }
        }

        function findInfoBySku(type = 'shortSku', sku) {// 
            let info = null
            if (type == 'shortSku') info = $scope.list.find(item => item.cjShortSku === sku)
            if (type == 'sku') info = $scope.list.find(item => item.cjSku === sku)
            if (!info) {
                $scope.info = { show: false, img: '', variant: '', count: '', sku: '' }
                return layer.msg('未找到 对应的sku 数据,请重新扫描sku或短码');
            }
            info && setInfoBox(info)
        }
        function setInfoBox(info) {//设置 右侧 图片区域
            // $scope.params.sku = '';
            const { cjImg: img, cjShortSku, cjSku: sku, shuLiang: count } = info;
            const variant = sliceShortSku(sku);
            $scope.info = { show: true, img, variant, count, sku }
            $scope.list = sortList($scope.list, sku)
            console.log("TCL: setInfoBox -> $scope.info", $scope.info)
        }

        function initInfoBox() {// 初始化 弹框信息 or 关闭 弹框
            $scope.info = { show: false, img: '', variant: '', count: '' }
        }
        /* 搜索 end */


        /* 重量处理 end */
        function handleActualWeight(item) {// 处理 实际重量 记录接口调用 { newweight:'cjskss', oldweight: 135666, productid: 15, variantid: 1 }
            const { realWeight: newweight, weight: oldweight, cjProductId: productid, cjStanproductId: variantid, packWeight } = item;
            if (newweight === oldweight) return;
            $scope.recordWeightParams = { newweight, oldweight, productid, variantid, show: false }
            // if (newweight > packWeight) return handlePackageWeight(item);
            if((+newweight-(+oldweight))>10)$scope.recordWeightParams.show = true;
            // submitRecordWeight(params)
        }
        function initRecordWeightParams() {
            $scope.recordWeightParams = { newweight: 0, oldweight: 0, productid: '', variantid: '', show: false }
        }
        function submitRecordWeight() {// http 提交 实际重量 修改记录
            const url = api.actualWeight;
            const params = $scope.recordWeightParams;
            console.log("TCL: submitRecordWeight -> params", params)
            $scope.recordWeightParams.show = false;
            erp.mypost(url, params).then(() => {
            })
        }

        function handlePackageWeight(item) {// 处理 邮寄重量、 包裹重量
            const { realWeight, packWeight, cjProductId: productId, cjStanproductId: variantId } = item;
            $scope.packageWeightParams = { realWeight, newWeight: packWeight, oldWeight: packWeight, productId, variantId, show: true }
        }
        function initPackageWeightParams() {
            $scope.packageWeightParams = { realWeight: 0, newWeight: 0, oldWeight: 0, productId: '', variantId: '', show: false }
        }
        function submitPackageWeight() {// http 修改 邮寄重量
            const params = $scope.packageWeightParams;
            if (params.realWeight > params.newWeight) return layer.msg('邮寄重量不得小于 实际重量')
            console.log("TCL: submitPackageWeight -> params", params)
            const url = api.packageWeight;
            submitRecordWeight()
            $scope.packageWeightParams.show = false;
            erp.mypost(url, params).then(() => {
                // layer.msg('')
            })

        }

        /* 重量处理 end */


        /* 确认 start */
        function handleConfirm(item) {//确认
            if (item.status === 2) return layer.msg('仅允许确认一次');
            const pass = validate(item);
            if (pass !== 'ok') return layer.msg(pass);
            let { receiveNun, qualifiedNum, defectiveNum, lackNum, moreNum, realWeight, productL, productW, productH, id, cjSku, shuLiang: shuLiang, cjShortSku: cjShortSku, cjStanproductId: cjStanproductId, zhuiZongHao, orderId: procurementOrderId, cjProductId: ID } = item;
            const type = '1';//type: '1 - 分标 2 - 质检'
            const trackingNumber = Object.keys(JsonPares(zhuiZongHao)).join(',') || "CJ10001";//zhuiZongHao {123123: '中通'}
            const params = { receiveNun, qualifiedNum, defectiveNum:0, lackNum, moreNum, realWeight, productL, productW, productH, id, cjSku, shuLiang, cjShortSku, cjStanproductId, trackingNumber, type, procurementOrderId, ID }
            console.log("TCL: handleConfirm -> params", params)
            const url = api.confirmUrl;
            erp.postFun(url, params, function ({ data }) {
                layer.closeAll('loading');
                if (data.code !== 200) return layer.msg('网络错误');
                layer.msg('确认成功')
                inputSku.focus()
                inputSku.select()
                $scope.variantsSubmitNum += 1 // 确认成功后加一次记录
                if ($scope.variantsSubmitNum >= $scope.list.length) {
                    $scope.params.waybillNumber = ''
                    inputWaybill.focus()
                    inputWaybill.select()
                }
                handleErr({ defectiveNum, lackNum, moreNum, id })
                item.status=2;
            }, function () {
                layer.closeAll('loading');
            }, { layer: true })
        }

        function validate(item) {
            let { receiveNun, qualifiedNum, shuLiang,productH,productL,productW,realWeight } = item;
            receiveNun = +receiveNun;
            qualifiedNum = +qualifiedNum;
            shuLiang = +shuLiang;
            if (receiveNun === '') return '请填写 实际数量';
            // if ( !/^\d+$/.test(receiveNun)) return '异常数量填写需为 数字';
            if (isNaN(receiveNun)) return '异常数量填写需为 数字';
            
            //当前是抛货的订单，必须要填写长宽高
            if(item.overSizeFlag){
                if(!productH || !productL || !productW){
                    return '请填写长宽高'
                }
            }
            if(!realWeight) return '请填写实际重量';
            return 'ok';
        }
        /* 确认 end */

        /* 异常处理 start */
        function handleErr({ defectiveNum, lackNum, moreNum, id }) {//异常处理
            let shuLiang = defectiveNum + lackNum + moreNum, leiXing = '';
            if (defectiveNum === 0 && lackNum === 0 && moreNum === 0) return;
            ; (function fn() {
                if (defectiveNum > 0 && (lackNum > 0 || moreNum > 0)) return leiXing = '7'; //异常类型:  7 -- 其他
                if (defectiveNum > 0) return leiXing = '3';//异常类型:  3 -- 质量问题
                if (lackNum > 0 || moreNum > 0) leiXing = '4';//异常类型:  4 -- 数量问题 
            })();
            $scope.errParams = { id, leiXing, shuLiang, yuanYin: '' }
            submitError()
        }

        function submitError() {//提交 异常 
            const url = api.err;
            const params = $scope.errParams;
            console.log("TCL: submitError -> params", params)
            erp.mypost(url, params).then(res => {
                // layer.msg('异常提交成功')
            })
        }
        /* 异常处理 end */


        /* 打印处理 start */
        function handlePrint(item, type, dyType) {//  打印 // 1正品，2分标次品，3多货，4质检次品，5质检多货 ,6分标全部，7质检全部
            if (item.status !== 2) return layer.msg('请先确认生成批次号 再打印');
            const { qualifiedNum, defectiveNum, moreNum, cjSku: cjsku, cjShortSku: cjshortsku, id,receiveNun } = item;
            if (isNaN(qualifiedNum) || isNaN(moreNum) || isNaN(defectiveNum)) return layer.msg('请检查 填写数量');
            const params = { cjsku, cjshortsku, id, type, qualifiedNum:receiveNun, moreNum, defectiveNum }
            print(params, dyType);
        }

        function print(params, dyType) {//打印
            const url = api.printUrl;// {post {cjSku: 'sku', cjshortsku: 'shortSku' batchNum: 135666, shuLiang:15, type:1,} } 
            erp.mypost(url, params).then(url => {
                handlePrintLink(url, dyType);
            })
        }

        function handlePrintLink(link, dyType) {//{ post skuMap {shortSku: {sku: '', sum: '数量'}} }
            if (!link) return;
            link = 'https://cc-west-usa.oss-accelerate.aliyuncs.com' + link.split('.com')[1]
            if (dyType == 'sd') {
                erp.navTo(link, '_blank');// 跳转页面 打印
            } else {
                PrintCode(link)
            }
        }
        function PrintCode(url) {
            console.log(url)
            $.ajax({
                url: 'http://127.0.0.1:9999/marking?url=' + url,
                async: true,
                cache: false,
                dataType: 'text',
                error: function (xhr) {
                    $scope.downLoadFlag = true;
                    $scope.$apply()
                    console.log($scope.downLoadFlag)
                },
                success: function (data) {
                    data = data.constructor === Boolean ? data : data === 'true'
                    if (!data) {
                        $scope.zddyFalseFlag = true;
                        $scope.zddyErrorPdfLink = url;
                        $scope.$apply()
                    }
                }
            })
        }
        /* 打印处理 end */

        function sliceShortSku(sku) {
            let str = sku || '';
            try {
                str = sku.split('-').slice(1).join('-');
            } catch (err) {
                console.log('sliceShortSku err', err)
            }
            return str;
        }

        function initClipboard() {//初始化 剪切板功能
            window.onload = function () {
                const clipboard = new window.cjUtils.Clipboard();
                $scope.handleCopy = handleCopy;
                function handleCopy(content) {
                    clipboard.set(content).then(() => {
                        layer.msg('复制成功')
                    }).catch(err => { console.log('handleCopy failed err -->> ', err) })
                }
            }
        }

        function JsonPares(val) {//基于 全局 JSON parse重写 基础上 
            const newVal = JSON.parse(val);
            if (val === null) return val;
            if (typeof newVal !== 'object') return val;
            if (newVal.error) return val;
            return newVal;
        }
        /* 拆分功能 ---start */
        //展示当前拆分组
        $scope.showBreakup = (item)=>{
            if(item.status === 2) return;
            $scope.breakupObj.show=true;
            $scope.breakupObj.id = item.id;
            $scope.breakupObj.list = [
                {
                    sku:item.cjSku,
                    shuLiang:item.shuLiang,
                    receiveNun:item.receiveNun,
                    num:+item.receiveNun,
                    unnum:(+item.shuLiang)-(+item.receiveNun)
                }
            ]
        }
        //添加或删除给每组数据赋值，不整除时默认将多余值给最后一项
        let breakupFun=(type)=>{
            let len;
            if(type=='add'){
                len = $scope.breakupObj.list.length+1;
            }else{
                len = $scope.breakupObj.list.length;
            }
            let list = $scope.breakupObj.list;
            let newList=[];
            for(let i=0;i<len;i++){
                let obj = {
                    id:i,
                    sku:list[0].sku,
                    shuLiang:list[0].shuLiang,
                    receiveNun:list[0].receiveNun,
                    num:Math.floor(list[0].receiveNun/len),
                    unnum:0
                }
                //多余的放在最后一组
                if(i==len-1){
                    obj.num=obj.num+(list[0].receiveNun%len);
                }
                newList.push(obj);
            }
            $scope.breakupObj.list=newList;
        }
        //添加组
        $scope.addBreakupItem = ()=>{
            if($scope.breakupObj.list.length==$scope.breakupObj.list[0].shuLiang){
                 return layer.msg("不可拆分了，已是最大拆分数")
            }
            breakupFun('add');
        }
        //获取当前组数量，方便错误数据数组自动填写
        $scope.focusBreakupItem = (item)=>{
            $scope.breakupItem = angular.copy(item);
        }
        //修改组商品数量
        $scope.changeBreakupItem = (item)=>{
            let num = $scope.breakupItem.num;
            console.log(num)
            if(item.num && (!/^\d+$/.test(+item.num) || item.num==0)){
                item.num = num;
                item.unnum=0;
            }else if(+item.num>+item.receiveNun) {
                item.num = num;
                item.unnum=0;
            }else{
                item.unnum = num-item.num;
            }
        }
        //删除某项
        $scope.delBreakupItem = (item,index)=>{
            if($scope.breakupObj.list.length > 1){
                $scope.breakupObj.list.splice(index,1);
                breakupFun('reduce');
            }
        }
        //提交当前配置
        $scope.confirmBreakup = ()=>{
            if($scope.breakupObj.list.length==1) return layer.msg('数量为1，不可拆分')
            let allnum=+$scope.breakupObj.list[0].receiveNun;
            let newnum=0,skuCountList=[],unnum=0;
            $scope.breakupObj.list.forEach(item=>{
                newnum+=+item.num;
                if(+item.unnum<0){
                    unnum=+item.unnum;
                }
                skuCountList.push(item.num)
            })
            if(unnum<0){
                return layer.msg('组数量超过最大值，请重新输入');
            }
            if(allnum-newnum>0){
                return layer.msg(`当前有${allnum-newnum}件未分配数量`);
            }
            let params = {
                id:$scope.breakupObj.id,
                skuCountList:skuCountList
            }
            layer.load(2);
            erp.postFun('warehousereceipt/caigouShangpintiansku/splitSkuCount', params, function ({ data }) {
                layer.closeAll();
                if(data.code==200){
                    getList();
                    $scope.breakupObj.show=false;
                }
            })
        }
        /* 拆分功能 ---end */
    }]).filter('storeFilter', function () {
        return function(val) {
              let name;
              switch(+val){
            case 0:
              name='义乌仓';
              break;
            case 1:
              name='深圳仓';
              break;
            case 2:
              name='美西仓';
              break;
            case 3:
              name='美东仓';
              break;
            case 4:
              name='泰国仓';
              break;
            case 5:
              name='金华仓';
              break;
              }
              return name;
            }
      }).filter('procurementFilter', function () {
        return function(val) {
          let name = '';
              switch(+val){
            case 0:
              name='1688非API';
              break;
            case 1:
              name='1688API';
              break;
            case 2:
              name='淘宝';
              break;
            case 3:
              name='天猫';
              break;
            case 4:
              name='线下';
              break;
            }
            return name;
          }
      })

}();