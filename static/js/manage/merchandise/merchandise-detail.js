(function (angular) {

    var app = angular.module('merchandise');

    var chineseReqG = /[\u4E00-\u9FA5]/g;

    var specialChacReqG = new RegExp("[-`!@#$^&*()=|{}':;,\\[\\]<>/?！￥……／～《》（）——|{}【】‘；：”“。，、？~]", "gi");

    var legalVariableReg = /^[a-zA-Z0-9.]*((?<=[a-zA-Z0-9.])\s[a-zA-Z0-9.]*)*[a-zA-Z0-9.]$/g;


    var getEmployeeUrl = 'app/employee/getempbyname';

    // getSalemanList
    function getEmployeeList(erp, job, scb) {
        erp.postFun(getEmployeeUrl, {
            "data": JSON.stringify({
                name: '',
                job: job
            })
        }, function (data) {
            // console.log(JSON.parse(data.data.result).list);
            scb(JSON.parse(data.data.result).list);
        });
    }

    app.controller('merchandiseCtrlDetailEdit', ['$scope', '$window', '$location', '$compile', '$routeParams', '$timeout', '$http', 'erp', 'merchan', '$sce', 'utils', function ($scope, $window, $location, $compile, $routeParams, $timeout, $http, erp, merchan, $sce, utils) {
        // console.log($routeParams.id, $routeParams.flag);
        // 商品操作日志
        $scope.logShow = true;
        $scope.model = false;
        $scope.consultList = [];
        $scope.pageNum = 1;
        $scope.pageSize = 10;
        $scope.erpordTnum = 0;      //分页总条数
        $scope.detailList = [];
        // 导航切换
        $scope.navTab = function (state) {
            state == 1 ? $scope.logShow = true : $scope.logShow = false;
        };
        // 详情
        $scope.detail = function (item) {
            $scope.model = true;
            let data = {
                productId: item.productId,
                consulting_id: item.consulting_id
            }
            let name = item.user_name;
            $scope.detailList = [];
            erp.postFun('erp/consulting/getConsultinginfo', JSON.stringify(data), function (res) {
                if (res.data.statusCode == '200') {
                    $scope.detailList.push(res.data.result[0]);
                    $scope.detailList[0].imageName = $scope.detailList[0].user_name.slice(0, 1).toUpperCase();
                    if (res.data.result[0].replycount > 0) {
                        $scope.detailList = $scope.detailList.concat(res.data.result[0].reply);
                        for (let i = 1; i < $scope.detailList.length; i++) {
                            if ($scope.detailList[i].state < 3) {
                                if ($scope.detailList[i].user_name == 'CJ') {
                                    $scope.detailList[i].user_name = $scope.detailList[i].user_name + ' 回复' + name;
                                } else {
                                    if ($scope.detailList[i].state > 1) {
                                        $scope.detailList[i].user_name = $scope.detailList[i].user_name + '回复 CJ';
                                    }
                                }
                                // 没有图像，首字母大写
                                $scope.detailList[i].imageName = $scope.detailList[i].user_name.slice(0, 1).toUpperCase();
                            }
                        }
                    }
                }
            });
        }
        // 关闭
        $scope.cancel = function () {
            $scope.model = false;
        };
        // 商品数据列表
        function logList() {
            let data = {
                pageNum: String($scope.pageNum),
                pageSize: String($scope.pageSize),
                productId: $routeParams.id
            }
            $scope.consultList = [];
            erp.postFun('erp/consulting/getConsultingList', JSON.stringify(data), function (res) {
                if (res.data.statusCode == '200') {
                    $scope.consultList = res.data.result;
                    $scope.erpordTnum = $scope.consultList.total;
                    for (let i = 0; i < res.data.result.list.length; i++) {
                        let id = res.data.result.list[i].user_id;
                        $scope.consultList.list[i].commodityId = id.slice(1, id.indexOf('}'))
                    }
                    dealpage();
                }
            })
        }
        logList();
        //处理分页
        function dealpage() {
            if ($scope.erpordTnum <= 0) {
                layer.closeAll("loading")
                return;
            }
            $("#c-pages-fun").jqPaginator({
                totalCounts: $scope.erpordTnum,//设置分页的总条目数
                pageSize: $scope.pageSize - 0,//设置每一页的条目数
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
                    logList()
                }
            });
        };
        //分页选择框的切换
        // $('#page-sel').change(function () {
        //   erp.load();
        //   var showList = $(this).val() - 0;
        //   $scope.pageSize = showList;
        //   if ($scope.erpordTnum < 1) {
        //     erp.closeLoad();
        //     return;
        //   }
        //   $("#c-pages-fun").jqPaginator({
        //     totalCounts: $scope.erpordTnum,//设置分页的总条目数
        //     pageSize: showList,//设置每一页的条目数
        //     visiblePages: 5,//显示多少页
        //     currentPage: $scope.pageNum * 1,
        //     activeClass: 'active',
        //     prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
        //     next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
        //     page: '<a href="javascript:void(0);">{{page}}<\/a>',
        //     first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
        //     last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
        //     onPageChange: function () {
        //       logList();
        //     }
        //   });
        // });
        //跳页的查询
        $scope.gopageFun = function () {
            let pageNum = $('#inp-num').val() - 0;
            var countN = Math.ceil($scope.erpordTnum / $scope.pageSize);
            erp.load();
            if (!pageNum || pageNum < 1) {
                layer.closeAll("loading")
                layer.msg('跳转页数不能为空!');
                return;
            }
            if (pageNum > countN) {
                layer.closeAll("loading")
                layer.msg('选择的页数大于总页数.');
                return;
            }
            logList();
        };
        var bs = new Base64();
        var userId = localStorage.getItem('erpuserId') == null ? '' : bs.decode(localStorage.getItem('erpuserId'));
        var token = '';
        var userName = localStorage.getItem('erpname') == null ? '' : bs.decode(localStorage.getItem('erpname'));
        var token = localStorage.getItem('erptoken') == null ? '' : bs.decode(localStorage.getItem('erptoken'));
        var operate = 'UPDATE';

        var userInfo = erp.getUserInfo();
        $scope.userInfo = erp.getUserInfo();
        //变体下架 权限 admin，王慧云，甘秋华
        $scope.biantiXiajiaFlag = ['admin', '王慧云', '甘秋华'].includes(userInfo.erploginName)

        $scope.setOneFlg = false; // 单个设置图片/重量/邮寄重量

        $scope.getData = false;
        $scope.isHasThirdBtn = false;

        // 根据尺寸决定重量和邮寄重量
        $('.merch-varible-box-wrap').on('input','.edit-pweight', function () {
            disposeWeight($(this), '.edit-pweight')
        });
        $('.merch-varible-box-wrap').on('input','.edit-postweight', function () {
            disposeWeight($(this), '.edit-postweight')
        });
        function disposeWeight($dom, targetStr, isNull) {
            const isHasSize = (erp.findIndexByKey($scope.varibleAtrrs,'nameEn','Size') != -1);
            const $thisLine = $dom.parent().parent().parent();
            console.log($dom, $thisLine)
            if (!$scope.setOneFlg && isHasSize) {
                $thisLine.siblings().each(function () {
                    if ($(this).find('input[name=Size]').val() && ($(this).find('input[name=Size]').val() == $thisLine.find('input[name=Size]').val())) {
                        $(this).find(targetStr).val(isNull ? '' : $thisLine.find(targetStr).val());
                    }
                });
            }
        }

        /**----- */
        //下架
        $scope.xiajiaFun = function (event) {
            if ($('.merch-varible-tbody').length - $('.xiajia').length == 1) {
                layer.msg('请至少保留一个变体');
                return;
            }
            var target = $(event.target);
            var vid = target.parent().attr('data-id');//li
            vid = "'" + vid + "'";
            var list = [];
            list.push(vid);
            // var sendData = {
            //     vids: vid
            // }
            var body = target.parent().parent().parent();
            console.log(body.index());
            var indexlist = [];
            indexlist.push(body.index() - 1);
            var data = {
                vids: list,
                index: indexlist
            }
            $('.xiajiazzc').find('.xiajiaBottom').attr('data-id', JSON.stringify(data));
            $('.xiajiazzc').show();
            // body.addClass('xiajia');
            // body.find('input').attr('readOnly',true);
            // body.find('select').attr('readOnly',true);

        }
        $scope.surexiajiFun = function () {
            var e = $('.xiajiazzc').find('.xiajiaBottom').attr('data-id');
            e = JSON.parse(e);
            var indexlist = e.index;

            var idlist = e.vids;
            var reason = $('#xiajiaReason').val();
            var id = "";
            $.each(idlist, function (i, v) {
                if (i == 0) {
                    id += v;
                } else {
                    id += ',' + v;
                }
            });
            var sendData = {
                vids: id,
                soldOutCause: reason
            }
            console.log(sendData);

            erp.load();
            erp.postFun('erp/skuSoldOut/soldOutSkuByVids', JSON.stringify(sendData), function (data) {
                erp.closeLoad();
                console.log(data.data);
                if (data.data.result > 0) {
                    var send = {
                        vID: id,
                        type: 'add'
                    }
                    erp.postFun('order/order/setSkuSoldOutMap', JSON.stringify(send), function (data) {
                    }, function () {
                    });
                    layer.msg('下架成功');
                    $.each(indexlist, function (i, v) {
                        var index = v;
                        console.log(index);
                        var ele = $('.merch-varible-tbody').eq(index);
                        ele.addClass('xiajia');
                        // console.log
                        // ele.find('input').attr('readOnly',true);
                        ele.find('select').attr('disabled', true);
                        ele.find('.li-xiaji').hide();
                        ele.find('.li-shangjia').show();
                        ele.find('input').attr('disabled', true).css('color', "#CDC9C9");
                        ele.find('input[type="checkbox"]').prop('checked', false);
                        // $('.merch-varible-box').append(ele);
                    });
                    var xiajialist = $('.merch-varible-box .xiajia');
                    $.each(xiajialist, function (i, v) {
                        var t = $(v);
                        $('.merch-varible-box').append(t);
                    })
                } else {
                    layer.msg('下架失败');
                }
                $('.xiajiazzc').hide();

            }, function () {
                erp.closeLoad();
            });
        }
        $scope.closexiajiaFun = function () {
            $('.xiajiazzc').hide();
            $('.xiajiazzc').find('.xiajiaBottom').attr('data-id', '');
        }
        //批量下架
        $scope.piliangxiajiaFun = function () {
            
            var tbody = $('.merch-varible-tbody');
            // console.log(tbody);
            var checklist = tbody.find('.check-inp:checked');
            console.log(checklist);
            if (checklist.length > 0) {
                if ($('.merch-varible-tbody').length - checklist.length == 0) {
                    layer.msg('请至少保留一个变体');
                    return;
                }
                var list = [];
                var indexList = [];
                $.each(checklist, function (i, v) {
                    var parent = $(v).parent().parent().parent().parent();
                    console.log(parent);
                    if (!parent.hasClass('xiajia')) {
                        // list.push(v);
                        var vid = parent.find('.li-xiaji').attr('data-id');
                        vid = "'" + vid + "'";
                        list.push(vid);
                        var index = parent.index() - 1;
                        indexList.push(index);
                    }
                });
                console.log(indexList);
                var v = {
                    vids: list,
                    index: indexList
                }
                $('.xiajiazzc').find('.xiajiaBottom').attr('data-id', JSON.stringify(v));
                $('.xiajiazzc').show();
            } else {
                layer.msg('请选择需要下架的变体商品');
            }

        }
        //上架
        $scope.shangjiaFun = function (event) {
            layer.confirm('确认要上架吗？', {
                btn: ['确定', '取消']//按钮
            }, function (index) {
                layer.close(index);
                var target = $(event.target);
                var vid = target.parent().attr('data-id');//li
                var body = target.parent().parent().parent();
                vid = "'" + vid + "'";
                var sendData = {
                    vids: vid
                }
                erp.load();
                erp.postFun('erp/skuSoldOut/putSkuByVids', JSON.stringify(sendData), function (data) {
                    erp.closeLoad();
                    if (data.data.result > 0) {
                        var send = {
                            vID: vid,
                            type: 'del'
                        }
                        erp.postFun('order/order/setSkuSoldOutMap', JSON.stringify(send), function (data) {
                        }, function () {
                        });
                        layer.msg('上架成功');
                        body.removeClass('xiajia');
                        body.find('select').attr('disabled', false);
                        body.find('.li-xiaji').show();
                        body.find('.li-shangjia').hide();
                        body.find('input').attr('disabled', false).css('color', "#333");

                        var xiajalist = $('.merch-varible-box .xiajia');
                        $.each(xiajalist, function (i, v) {
                            var t = $(v);
                            $('.merch-varible-box').append(t);
                        })
                    } else {
                        layer.msg('上架失败');
                    }
                }, function () {
                    erp.closeLoad();
                })





            });
        }

        /**----- */
        //变体排序
        var mx = 0, my = 0;      //鼠标x、y轴坐标（相对于left，top）
        var isDragingPro = false;
        var moveLine;
        //鼠标按下
        $('.merch-varible-box').on('mousedown', '.li-check', function (e) {
            e.preventDefault();
            e = e || window.event;
            mx = e.pageX;     //点击时鼠标X坐标
            my = e.pageY;     //点击时鼠标Y坐标
            isDragingPro = true;      //标记对话框可拖动
            moveLine = $(this).parent().parent();
            // console.log('down')
        });
        //鼠标移动
        var moveX, moveY;
        var changeFlag;
        $(document).mousemove(function (e) {
            var e = e || window.event;
            var x = e.pageX;      //移动时鼠标X坐标
            var y = e.pageY;      //移动时鼠标Y坐标
            if (isDragingPro) {        //判断对话框能否拖动
                //console.log(x+','+y);
                moveX = x - mx;      //移动后对话框新的left值
                moveY = y - my;      //移动后对话框新的top值
                // console.log(moveY);
                if (moveY < 0 && Math.abs(moveY) > 60 && !changeFlag) {
                    var prev = moveLine.prev();
                    if (moveLine.index() > 1) {
                        moveLine.insertBefore(prev);
                        changeFlag = true;
                    }
                }
                if (moveY > 0 && Math.abs(moveY) > 60 && !changeFlag) {
                    var next = moveLine.next();
                    if (next) {
                        moveLine.insertAfter(next);
                        changeFlag = true;
                    }
                }
            }
        });
        //鼠标离开
        $('.merch-varible-box').on('mouseup', '.li-check', function () {
            isDragingPro = false;
            moveLine = null;
            changeFlag = null;
        });

        var productInfo;

        $scope.pid = $routeParams.id;
        $scope.saleStatus = '';
        $scope.merchanFlag = $routeParams.flag;
        $scope.productType = $routeParams.type;//0：；1:服务商品；2:；3：个性包装
        if ($scope.productType == '1') {
            // 1--服务商品
            $scope.authorityPart = true;
            $('#authority-type').prop('checked', false);
            $('#authority-type').prop('disabled', true);
            $('#authority-type2').prop('checked', true);
        }
        $scope.isAdminLogin = erp.isAdminLogin();
        $scope.merchanStatus = $routeParams.status;
        // 标记当前controller状态
        $scope.editMerchFlag = true;
        $scope.$on('pod-to-father', function (d, data) {
            console.log(data);
            if (data && data.img) {
                picIdIndex++;
                $scope.picContainer.push({
                    pid: 'pic' + picIdIndex,
                    // src: result[i]
                    src: data.img
                });
            }
        });
        layer.load(2);
        erp.postFun('pojo/product/detailNew', JSON.stringify({
            id: $scope.pid,
            flag: $scope.merchanFlag,
            productType: $scope.productType
        }), function (data) {
            layer.closeAll('loading');
            var data = data.data;
            if (data.statusCode != 200) {
                layer.msg(data.message);
                return false;
            }
            if (JSON.parse(data.result).product) {
                productInfo = JSON.parse(data.result).product[0];
            } else {
                productInfo = JSON.parse(data.result);
                console.log('detail- >>>>>', productInfo);
            }
            $scope.setNum = productInfo && productInfo.supplierLink && productInfo.supplierLink[0] && productInfo.supplierLink[0].setNum;
            $scope.getData = true;
            console.log(productInfo);
	          $scope.discountStatus = productInfo.discountStatus ? productInfo.discountStatus.toString() : '0'
		        $scope.discountData = productInfo.discountInfo ?
			        JSON.parse(productInfo.discountInfo).map(o =>({...o, highNum: o.highNum === -1 ? null : o.highNum})) :
			        [{ name: '1', lowNum: 1, highNum: null, discount: null}]
            console.log($scope.discountData);
            if (productInfo.shangjiaStatus == 0 && !$scope.isAdminLogin) {
                // 表示已产生过订单
                $scope.fobidEditPrice = true;
                console.log('普通人禁止修改价格');
            }

            if (productInfo.shangjiaStatus == 0) {
                if (userInfo.erploginName == 'admin' || userInfo.job == '采购' || userInfo.job == '财务') {
                    $scope.forbidChanBuyPrice = false;
                } else {
                    $scope.forbidChanBuyPrice = true;
                }
            } else {
                $scope.forbidChanBuyPrice = false;
            }

            if ($scope.saleStatus == '3' && !$scope.isAdminLogin) {
                $scope.yishangjiaFeiAdmin = true;
            }
            if ($scope.merchanFlag == '1' && !$scope.isAdminLogin) {
                $scope.yishangjiaFeiAdmin = true;
            }
            // 请求扣分原因
            if (productInfo.sku) {
                getResons();
            }

        }, function () {
            layer.closeAll('loading');
            layer.msg('网络错误');
        });

        // 操作日志
        $scope.operateLogs = [];
        function getLogInfoList(){// 获取操作日志
            var params = {id:$scope.pid}
            var url = 'pojo/product/detailLogInfo'
            layer.load(2)
            erp.postFun(url,JSON.stringify(params),function(data){
                layer.closeAll('loading')
                console.log('operation',data)
                if(data.data.statusCode!='200') return layer.msg('服务器打盹了，请稍后再试！')
                var operList = JSON.parse(data.data.result)
                for (var i = 0; i < operList.length; i++) {
                    $scope.operateLogs.unshift(operList[i])
                }
                $scope.operateLogs.unshift({
                    operate: '商品修改',
                    operator: userName,
                    operateDate: {
                        time: new Date()
                    }
                })
            })
        }
        getLogInfoList()

        
        $scope.editor = new window.wangEditor('#wang-editor');
        // $scope.editor.customConfig.uploadImgServer = 'https://erp.cjdropshipping.com/app/ajax/upload';
        $scope.editor.customConfig.uploadFileName = 'file';
        $scope.editor.customConfig.customUploadImg = function (files, insert) {
            // files 是 input 中选中的文件列表
            // insert 是获取图片 url 后，插入到编辑器的方法
            Array.from(files).forEach((file) => {
                cjUtils.uploadFileToOSS({ file, signatureURL: 'https://app.cjdropshipping.com/app/oss/policy' })
                    .then(link => {
                        console.log('图片链接 ->', link);
                        insert(link);
                    });
            });
        };
        /* $scope.editor.customConfig.uploadImgHooks = {
            customInsert: function (insertImg, result, editor) {
                console.log(result)
                // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
                // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

                // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
                var imgList = JSON.parse(result.result);
                for (var i = 0; i < imgList.length; i++) {
                    imgList[i] = 'https://' + imgList[i];
                }
                if (imgList.length > 0) {
                    insertImg(imgList);
                }

                // result 必须是一个 JSON 格式字符串！！！否则报错
            }
        } */
        $scope.editor.create();

        var editor2 = new window.wangEditor('#wang-editor-2');
        editor2.customConfig.uploadImgServer = 'https://erp.cjdropshipping.com/app/ajax/upload';
        editor2.customConfig.uploadFileName = 'file';
        // 将 timeout 时间改为 30s
        editor2.customConfig.uploadImgTimeout = 30000;
        editor2.customConfig.customUploadImg = function (files, insert) {
            // files 是 input 中选中的文件列表
            // insert 是获取图片 url 后，插入到编辑器的方法
            Array.from(files).forEach((file) => {
                cjUtils.uploadFileToOSS({ file, signatureURL: 'https://app.cjdropshipping.com/app/oss/policy' })
                    .then(link => {
                        console.log('图片链接 ->', link);
                        insert(link);
                    });
            });
        };
        /* editor2.customConfig.uploadImgHooks = {
            customInsert: function (insertImg, result, editor) {
                console.log(result)
                // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
                // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

                // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
                var imgList = JSON.parse(result.result);
                for (var i = 0; i < imgList.length; i++) {
                    imgList[i] = 'https://' + imgList[i];
                }
                if (imgList.length > 0) {
                    insertImg(imgList);
                }

                // result 必须是一个 JSON 格式字符串！！！否则报错
            }
        } */
        editor2.create();

        var that = this;

        $scope.$watch('getData', function (now, old) {
            if (now === old) {
                return
            }

            if (productInfo.customMessage) {
                console.log(productInfo.customMessage);
                if (Array.isArray(JSON.parse(productInfo.customMessage))) {
                    $scope.podVersion = '2';
                } else {
                    $scope.podVersion = '1';
                }
                $scope.personalizePro = true;
                $scope.podType = '1'
                that.podarray = JSON.parse(productInfo.customMessage);
            }
            if (productInfo.customeDesign) {
                console.log(productInfo.customeDesign)
                $scope.customeDesign = JSON.parse(productInfo.customeDesign);
                $scope.oldSku = productInfo.oldSku;
                console.log($scope.customeDesign)
                // $scope.customeDesignPro = true;
            }

            $scope.saleStatus = productInfo.saleStatus;

            $scope.merchanName = productInfo.nameEn;
            $scope.addGoodsAutoSKU = productInfo.sku;
            $scope.forbiddenChineseInp = function (merchanName) {
                $scope.merchanName = merchanName.replace(chineseReqG, '');
            }

            var regAndIcon = /&amp;/g;
            $scope.goodsCategory = (productInfo.catagory || productInfo.category).replace(regAndIcon, '&');
            $scope.goodsCategoryId = productInfo.categoryId;

            $scope.editorContent = productInfo.description;
            $scope.editor.txt.html(productInfo.description);

            var xiaoShouJianYi = productInfo.xiaoShouJianYi
            editor2.txt.html(xiaoShouJianYi);
            if (xiaoShouJianYi) {
                $('#wang-editor-2-show').html(xiaoShouJianYi);
            } else {
                $('#wang-editor-2-show').html('无');
            }
            $scope.cancelEditXSJY = function () {
                editor2.txt.html(xiaoShouJianYi);
            }
            $scope.goEditXSJY = function () {
                var xiaoShouJianYiNew;
                if (editor2.txt.text()) {
                    xiaoShouJianYiNew = editor2.txt.html();
                } else {
                    xiaoShouJianYiNew = '';
                }
                erp.postFun('pojo/product/xiuGaiXiaoShouJianYi', { "xiaoShouJianYi": xiaoShouJianYiNew, "pid": $scope.pid }, function (data) {
                    // console.log(data);
                    if (data.data.statusCode == 200) {
                        layer.msg('销售建议修改成功');
                        $('#wang-editor-2-show').html(xiaoShouJianYiNew);
                        $scope.editXSJY = false;
                    } else {
                        layer.msg('销售建议修改失败');
                    }
                });
            }

            // 商品图片
            $scope.picContainer = [];
            var picIdIndex = 0;
            $scope.getMerchanImgs = function () {
                var imgs = productInfo.img.split(',');
                var variantImgs = [];
                var stanProducts = productInfo.stanProducts;
                for (var i = 0; i < stanProducts.length; i++) {
                    if ($.inArray(stanProducts[i].img, variantImgs) == -1) {
                        variantImgs.push(stanProducts[i].img || stanProducts[i].IMG);
                    }
                }
                var imgSum = imgs.concat(variantImgs);
                imgSum = erp.uniqueArray(imgSum);
                for (var i = 0; i < imgSum.length; i++) {
                    picIdIndex++;
                    $scope.picContainer.push({
                        pid: picIdIndex,
                        src: imgSum[i]
                    });
                }
                console.log($scope.picContainer)
            }
            $scope.getMerchanImgs();

            $scope.verifyMerchPic = false;

            /** 拖拽成功触发方法
             *   index 拖拽后落下时的元素的序号（下标）
             *   obj 被拖动数据对象
             */
            $scope.dropComplete = function (index, obj) {
                var idx = $scope.picContainer.indexOf(obj);
                $scope.picContainer[idx] = $scope.picContainer[index];
                $scope.picContainer[index] = obj;
            };

            $scope.upLoadImg = function () {
	            erp.ossUploadFile($('#upload-img')[0].files, function (data) {
		            $('#upload-img').val('');
		            console.log(data);
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
		            for (var i = 0; i < result.length; i++) {
			            picIdIndex++;
			            $scope.picContainer.push({
				            pid: 'pic' + picIdIndex,
				            src: result[i]
				            //src: `${result[i]}?x-oss-process=image/resize,m_fill,w_800,h_800`
			            });
		            }
		            console.log($scope.picContainer);
		            $scope.$apply();
	            });
            }
            $scope.deletePic = function (pid) {
                var deleteIndex = erp.findIndexByKey($scope.picContainer, 'pid', pid);
                $('.merch-varible-tbody .merch-variable-pic').each(function () {
                    if ($(this).attr('src') == $scope.picContainer[deleteIndex].src) {
                        $(this).attr('src', '#');
                    }
                });
                $scope.picContainer.splice(deleteIndex, 1);
            }
            $scope.previewPic = function ($event) {
                var picSrc = $($event.target).parent().parent().parent().find('img').attr('src');
                merchan.previewPic(picSrc);
            }
            $scope.mannualRefresh = function (newpic) {
                // picIdIndex++;
                $scope.picContainer.push(newpic);
            }
            $scope.addPic = function () {
                merchan.addUrlPic(function (data) {
                    picIdIndex++;
                    $scope.mannualRefresh({
                        pid: 'pic' + picIdIndex,
                        // src: data
                        src: data
                    });
                    $scope.$apply();
                });
            }
            console.log($scope.picContainer)
            $scope.downloadPic = function () {
                if ($scope.picContainer.length < 1) {
                    layer.msg('请等待图片加载完毕')
                    return
                }
                let imgSrcArr = [];
                for (let i = 0, len = $scope.picContainer.length; i < len; i++) {
                    imgSrcArr.push($scope.picContainer[i].src)
                }
                imgSrcArr = Array.from(new Set(imgSrcArr))
                imgSrcArr = encodeURI(imgSrcArr)
                console.log(imgSrcArr)
                let url = "https://erp1.cjdropshipping.com/erp/downloadImg/filesdown?imgs=" + imgSrcArr + '&sku=' + $scope.addGoodsAutoSKU;
                window.open(url)
                console.log(url)
            }
            // 变量部分
            $scope.merchanUnit = 'unit(s)';
            $scope.varibles = [];
            $scope.verifyVeribleRes = false;
            $scope.varibleAtrrs = [];
            if (productInfo.variantKey) {
                var temArr = productInfo.variantKey.split('-');
                var temArrEn = productInfo.variantKeyEn == undefined ? [] : productInfo.variantKeyEn.split('-');
                for (var i = 0; i < temArr.length; i++) {
                    if (temArrEn[i]) {
                        $scope.varibleAtrrs.push({
                            name: temArr[i],
                            nameEn: temArrEn[i]
                        })
                    }
                }
            }

            $scope.merchanUnit = productInfo.unit;

            // 实时显示每个变量对应的sku
            $('.merch-varible-box').on('input', '.edit-new', function () {
                // var currentVaribleId = $(this).parent().parent().parent().attr('id');
                // merchan.showChildSKU(currentVaribleId, $scope);
                if ($(this).val()) {
                    $(this).val($(this).val().replace(/\s{2,}/g, ' '));
                }
                if (chineseReqG.test($(this).val())) {
                    layer.msg('变量值不能输入中文字符');
                    $(this).val($(this).val().replace(chineseReqG, ''));
                }
                var currentVaribleId = $(this).parent().parent().parent().attr('id');
                var varibleNewArr = [];
                $('#' + currentVaribleId).find('.varible-new input').each(function () {
                    if ($(this).val().trim()) {
                        varibleNewArr.push($(this).val());
                    }
                });
                // var currentSKU = $scope.addGoodsAutoSKU + '-' + varibleNewArr.join('-');
                // if (currentSKU.length > 49) {
                //     layer.msg('sku过长');
                //     $(this).val('');
                //     merchan.showChildSKU(currentVaribleId, $scope);
                //     return;
                // }
                merchan.showChildSKU(currentVaribleId, $scope);
            });
            // 渲染变量值到页面上
            // merchan.renderVarible($('#varible-new'), $('.merch-varible-tbody'), $scope);
            // merchan.renderVarible($('#varible-new'), $('.varible-new'), $scope);
            // 批量设置变量
            $scope.banchSetAttr = function (key) {
                console.log(key)
                if (checkNum == 0) {
                    layer.msg('请先勾选需要批量设置的变体');
                    return
                }
                merchan.banchSetAttr(key, $scope);
            }
            // 增加一行
            var varibleLineIndex = 0;
            $scope.addVaribleLine = function () {
                varibleLineIndex++;
                $scope.newAddFlag = 1;
                merchan.addVaribleLine(varibleLineIndex, $('.merch-varible-box'), $scope);
                $scope.checkAllMark = false;
            }
            $scope.addLineNum = '1';
            $scope.goAddVaribleLine = function () {
                var addNum = $scope.addLineNum * 1;
                if (isNaN(addNum) || addNum < 1) {
                    layer.msg('请输入大于0的数字');
                    return;
                }
                for (var i = 0; i < addNum; i++) {
                    $scope.addVaribleLine();
                }
                $scope.addLineNum = '1';
            }
            // 删除新增行
            $scope.variblesTem = [];
            $scope.removeVaribleTr = function ($event) {
                var targetElement = $event.target;
                var $removeLine = $(targetElement).parent().parent().parent();
                if ($removeLine.attr('newAddFlag') == '0' && $scope.yishangjiaFeiAdmin) {
                    layer.msg('已上架的商品，只有管理员可以删除变体！');
                    return;
                }
                // if ($scope.fobidEditPrice) {
                //     layer.msg('已产生订单的商品，只有管理员可以删除变体！');
                //     return;
                // }
                if ($('.merch-varible-tbody').length == 1) {
                    layer.msg('请至少保留一个变体');
                    return;
                }
                if ($removeLine.attr('name')) {
                    var deleteVarible = {};
                    deleteVarible[$removeLine.attr('osku')] = {
                        id: $removeLine.attr('name'),
                        operate: 'DELETE'
                    }
                    $scope.variblesTem.push(deleteVarible);
                }
                $removeLine.remove();
            }
            // 给变量行加鼠标进入事件
            $scope.showCanEditTd = function ($event) {
                $($event.currentTarget).find('.can-edit').addClass('editing');
            }
            // 给变量行加鼠标离开事件
            $scope.hideCanEditTd = function ($event) {
                $($event.currentTarget).find('.can-edit').removeClass('editing');
            }
            // 编辑变量弹框
            $scope.editVarible = function () {
                if ($scope.yishangjiaFeiAdmin) {
                    layer.msg('已上架的商品，只有管理员可以编辑变量！');
                    return;
                }
                // if ($scope.fobidEditPrice) {
                //     layer.msg('已经产生订单的商品，不能编辑变量');
                //     return;
                // }
                var tempVaribleAtrrs = JSON.parse(JSON.stringify($scope.varibleAtrrs));
                var tempVaribleObj = {};
                $('.merch-varible-thead').find('.li-new').each(function () {
                    tempVaribleObj[$(this).attr('name')] = [];
                })
                $('.merch-varible-tbody').each(function () {
                    $(this).find('.edit-new').each(function () {
                        tempVaribleObj[$(this).attr('name')].push($(this).val());
                    });
                });
                console.log(tempVaribleObj);
                layer.open({
                    title: null,
                    type: 1,
                    area: ['800px', '350px'],
                    skin: 'add-pic-layer add-varible-layer',
                    closeBtn: 0,
                    shade: [0.1, '#000'],
                    content: $('#add-varible').html(),
                    btn: ['取消', '确认'],
                    success: function (layero, index) {
                        function renderShowVarible() {
                            var lisArr = [];
                            for (var i = 0; i < tempVaribleAtrrs.length; i++) {
                                lisArr.push('<li><span class="varible-name">' + tempVaribleAtrrs[i].name + '</span><span class="remove-varible">x</span></li>')
                            }
                            $(layero).find('.show-current-varible').html(lisArr.join(''));
                        }
                        renderShowVarible();
                        $('.show-current-varible').on('click', 'span.remove-varible', function () {
                            var removeVarible = $(this).parent().find('span.varible-name').html();
                            var removeIndex = erp.findIndexByKey(tempVaribleAtrrs, 'name', removeVarible);
                            tempVaribleAtrrs.splice(removeIndex, 1);
                            // tempVaribleAtrrs.splice($.inArray(removeVarible, tempVaribleAtrrs),1);
                            renderShowVarible();
                        });
                        $('#default-varible').on('change', function () {
                            if ($(this).val() == '') {
                                return;
                            }
                            var selectVarible = $(this).val().split('-');
                            // console.log($(this));
                            if (selectVarible) {
                                if (selectVarible == 'customize') {
                                    $('#add-varible-inp').show();
                                    $('#add-varibleEn-inp').show();
                                    $('.add-varible-btn').show();
                                    return;
                                }
                                $('#add-varible-inp').hide();
                                $('#add-varibleEn-inp').hide();
                                $('.add-varible-btn').hide();
                                // $.inArray(selectVarible, tempVaribleAtrrs)
                                if (erp.findIndexByKey(tempVaribleAtrrs, 'name', selectVarible[0]) != -1) {
                                    layer.msg('该变量已存在');
                                    return false;
                                } else if (tempVaribleAtrrs.length >= 3) {
                                    layer.msg('变量不能超过3个');
                                    return false;
                                } else {
                                    if ($scope.personalizePro && tempVaribleAtrrs.length >= 2 && $scope.podVersion == '1') {
                                        // pod-v1 只能两个变量
                                        layer.msg('当前版本POD不能超过两个变量')
                                        return;
                                    }
                                    tempVaribleAtrrs.push({
                                        name: selectVarible[0],
                                        nameEn: selectVarible[1]
                                    });
                                    renderShowVarible();
                                    $(this).val('');
                                    console.log(tempVaribleAtrrs);
                                }
                            }
                        })
                        $('.add-varible-btn').on('click', function () {
                            var addVaribleName = $(layero).find('#add-varible-inp').val();
                            var addVaribleNameEn = $(layero).find('#add-varibleEn-inp').val();
                            if (addVaribleName && addVaribleNameEn) {
                                if ($.inArray(addVaribleName, tempVaribleAtrrs) != -1) {
                                    layer.msg('该变量已存在');
                                    return false;
                                } else if (tempVaribleAtrrs.length >= 3) {
                                    layer.msg('变量不能超过3个');
                                    return false;
                                } else {
                                    if ($scope.personalizePro && tempVaribleAtrrs.length >= 2 && $scope.podVersion == '1') {
                                        // pod-v1 只能两个变量
                                        layer.msg('当前版本POD不能超过两个变量')
                                        return
                                    }
                                    tempVaribleAtrrs.push({
                                        name: addVaribleName,
                                        nameEn: addVaribleNameEn
                                    });
                                    renderShowVarible();
                                    $(layero).find('#add-varible-inp').val('');
                                    $(layero).find('#add-varibleEn-inp').val('');
                                }
                            } else {
                                layer.msg('输入值不能为空');
                            }
                        });
                    },
                    yes: function (index, layero) {
                        layer.close(index);
                    },
                    btn2: function (index, layero) {
                        layer.close(index);
                        $scope.varibleAtrrs = JSON.parse(JSON.stringify(tempVaribleAtrrs));
                        merchan.renderVarible($('#varible-new'), $('.merch-varible-tbody'), $scope, tempVaribleObj);
                        $('.merch-varible-tbody.xiajia').find('input').attr('disabled', true).css('color', 'rgb(205, 201, 201)');
                        return false;
                    }
                });
            }
            // 全选
            var checkNum = 0;
            $scope.checkOneLine = function () {
                checkNum = 0;
                $('.merch-varible-tbody').each(function () {
                    if ($(this).find('.check-inp').prop('checked')) {
                        checkNum++;
                    }
                })
                if (($('.merch-varible-tbody').length - $('.merch-varible-tbody.xiajia').length) == checkNum) {
                    $scope.checkAllMark = true;
                } else {
                    $scope.checkAllMark = false;
                }
                console.log(checkNum);
            }
            $scope.checkAllMerch = function (flag) {
                $('.merch-varible-tbody').each(function () {
                    if (!$(this).hasClass('xiajia')) {
                        $(this).find('.check-inp').prop('checked', flag);
                    }

                });
                flag ? (checkNum = $('.merch-varible-tbody .check-inp:checked').length) : (checkNum = 0);
            }
            // 选择变量对应图片
            $scope.choseVariblePic = function ($event) {
                var targetElement = $event.currentTarget;
                var parent = $(targetElement).parent().parent();
                if (parent.hasClass('xiajia')) {
                    layer.msg('不能对已下架的变体进行编辑');
                } else if ($scope.yishangjiaFeiAdmin && parent.attr('name')) {
                    // 已上架商品变体图片不可修改
                    layer.msg('已上架商品变体图片不可修改');
                } else {
                    var $currentImg = $(targetElement).find('.merch-variable-pic');
                    merchan.choseVariblePic(targetElement, $scope);
                    // merchan.choseVariblePic($currentImg, $scope);
                }

            }
            // 变量行内输入框获取焦点事件
            $scope.addGrayBg = function ($event) {
                var targetElement = $event.target;
                $(targetElement).css('background', '#eee');
            }
            // 变量行内输入框失去焦点事件
            $scope.removeGrayBg = function ($event) {
                var targetElement = $event.target;
                $(targetElement).css('background', '#fff');
                if ($(targetElement).hasClass('edit-new')) {
                    var str = $(targetElement).val().replace(/(^\s*)|(\s*$)/g, "");
                    var legalVariableReg = /^[a-zA-Z0-9.]*((?<=[a-zA-Z0-9.])\s[a-zA-Z0-9.]*)*[a-zA-Z0-9.]$/g;
                    if (!legalVariableReg.test(str)) {
                        layer.msg('请不要使用特殊字符');
                        $(targetElement).val('');
                        return;
                    }
                    str = str.substring(0, 1).toUpperCase() + str.substring(1);
                    $(targetElement).val(str);
                    var currentVaribleId = $(targetElement).parent().parent().parent().attr('id');
                    merchan.showChildSKU(currentVaribleId, $scope);
                }
            }
            $scope.checkIsNum = function ($event, flag) {
                var targetElement = $event.target;
                $(targetElement).css('background', '#fff');
                $(targetElement).val($(targetElement).val().replace(/\s+/g, ""));
                var val = $(targetElement).val() * 1;
                if (isNaN(val)) {
                    layer.msg('请输入数字');
                    $(targetElement).val('');
                    return;
                }
                if (flag == 'weight') {
                    console.log($(targetElement).attr('class'))
                    var thisLine = $(targetElement).parent().parent().parent();
                    var weight = thisLine.find('.edit-pweight').val();
                    var postweight = thisLine.find('.edit-postweight').val();
                    if (weight && postweight && postweight * 1 <= weight * 1) {
                        layer.msg('请保证商品邮寄重量大于商品重量');
                        $(targetElement).val('');
                        disposeWeight($(targetElement), $(targetElement).attr('class').includes('edit-postweight') ? '.edit-postweight' : '.edit-pweight', true)
                        thisLine.find('.weight-tip').css('visibility', 'visible');
                    } else {
                        thisLine.find('.weight-tip').css('visibility', 'hidden');
                    }
                }
            }
            // 变量行内输入框美元符号处理
            $scope.addDollarIcon = function ($event) {
                merchan.addSpecialIcon($event, '$');
            }
            $scope.removeDollarIcon = function ($event) {
                merchan.removeSpecialIcon($event, '$');
            }
            // 变量行内人民币符号处理
            $scope.addRMBIcon = function ($event) {
                merchan.addSpecialIcon($event, '¥');
            }
            $scope.removeRMBIcon = function ($event) {
                merchan.removeSpecialIcon($event, '¥');
            }
            // 变量行内重量处理
            $scope.addGUnit = function ($event) {
                merchan.addSpecialIcon($event, 'g');
            }
            $scope.removeGUnit = function ($event) {
                merchan.removeSpecialIcon($event, 'g');
            }
            // sku别名弹框
            var currentSKUAname = '';
            $scope.alertEditSkuAname = function ($event) {
                var targetElement = $event.target;
                $(targetElement).css('background', '#eee');
                // merchan.alertEditSkuAname(currentSKUAname, targetElement);
                currentSKUAname = $(targetElement).val();
                var tempVaribleAtrrs = currentSKUAname == '' ? [] : currentSKUAname.split(',');
                merchan.editSKUAname(tempVaribleAtrrs, function (tempVaribleAtrrs) {
                    $(targetElement).val(tempVaribleAtrrs.join(','));
                });
            }

            // 获取变量提交信息$scope.varibles
            $scope.varibleImgs = [];
            $scope.getVaribleInfo = function () {
                merchan.getVaribleInfo($('.merch-varible-tbody'), $scope);
            }

            var variblesInfo = productInfo.stanProducts;

            // console.log(variblesInfo);
            var sockArr = variblesInfo;
            // console.log('变体列表'+variblesInfo);
            var arr1 = [];
            $.each(sockArr, function (i, v) {
                if (!v.isSoldOut || v.isSoldOut == 0) {
                    arr1.push(v);
                }
            });
            $.each(sockArr, function (i, v) {
                if (v.isSoldOut == 1) {
                    arr1.push(v);
                }
            });
            console.log(arr1);
            variblesInfo = arr1;
            for (var i = 0; i < variblesInfo.length - 1; i++) {
                varibleLineIndex++;
                merchan.addVaribleLine(varibleLineIndex, $('.merch-varible-box'), $scope);
            }
            // 获取仓库信息并渲染变体信息
            $scope.hasGotStorage = false;
            $scope.inventory = {};
            $scope.storages = [];
            merchan.getStorage(function (data) {
                // console.log(data);
                // 美国东和美国西仓库不可编辑
                var temArr = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].storage != '美国东' && data[i].storage != '美国西') {
                        temArr.push(data[i]);
                    }
                }
                console.log(temArr)
                $scope.storages = temArr;
                temArr = null;
                merchan.renderVarible($('#varible-new'), $('.merch-varible-tbody'), $scope);
                merchan.renderStorage($scope.storages, $('#batch-select'), $('#storage-name'), $('.storage-con'), $scope);
                for (var i = 0; i < data.length; i++) {
                    // 服务商品美国东不编辑
                    if ($scope.productType == '1' && data[i].storage == '美国东') continue;
                    $scope.inventory[data[i].id] = 0;
                }
                // 获取到仓库信息后渲染变体信息
                console.log($scope.fobidEditPrice)
                merchan.renderVariantToPage($scope, variblesInfo);
                $scope.hasGotStorage = true;
            });

            // 中文名称
            $scope.chineseName = productInfo.name.split(',');
            $('#chinese-name').find('.chinese-name-inp').each(function () {
                $(this).val($scope.chineseName[$(this).index()]);
            });
            $scope.verifyChineseNameRes = false;

            $scope.getChineseName = function () {
                $scope.chineseName = [];
                $('#chinese-name').find('.chinese-name-inp').each(function () {
                    if ($(this).val()) {
                        $scope.chineseName.push($(this).val());
                    }
                });
                return $scope.chineseName;
            }

            // 海关编码
            $scope.customsCode = productInfo.entryCode;
            $scope.verifyCustomsCode = false;

            // 申报品名（英文）
            $scope.entryNameEn = productInfo.entryNameEn;
            $scope.verifyEntryName = false;

            // 申报品名（中文）
            $scope.entryName = productInfo.entryName;
            $scope.verifyEntryNameEn = false;

            // 包装
            $scope.packing = productInfo.packingKey == '' ? [] : productInfo.packingKey.split(',');
            $scope.verifyPacking = false;
            $('#merchan-packing').find('input[type=checkbox]').each(function () {
                if ($.inArray($(this).attr('name'), $scope.packing) != -1) {
                    $(this).prop('checked', 'checked');
                }
            });

            $scope.getPackingInfo = function ($event) {
	            if($scope.productType === '3' && $($event.target).prop('checked') && $scope.packing.length > 2){
		            $event.preventDefault()
		            layer.msg('您最多选择3个包装材质')
		            return
	            }
	            merchan.getCheckBoxInfo($event, $scope.packing);
            }

            // 属性
            $scope.property = productInfo.propertyKey == '' ? [] : productInfo.propertyKey.split(',');
            $scope.verifyProperty = false;
            $('#merchan-property').find('input[type=checkbox]').each(function () {
                if ($.inArray($(this).attr('name'), $scope.property) != -1) {
                    $(this).prop('checked', 'checked');
                }
            });

            $scope.getPropertyInfo = function ($event) {
                merchan.getCheckBoxInfo($event, $scope.property);
            }

            // 材质
            $scope.material = productInfo.materialKey == '' ? [] : productInfo.materialKey.split(',');
            $scope.verifyMaterial = false;
            $('#merchan-material').find('input[type=checkbox]').each(function () {
                if ($.inArray($(this).attr('name'), $scope.material) != -1) {
                    $(this).prop('checked', 'checked');
                }
            });

            $scope.getMaterialInfo = function ($event) {
                merchan.getCheckBoxInfo($event, $scope.material);
            }
	
	
		        // 采购数量区间折扣 - 添加
		        $scope.handleAddDiscount = (item,idx) =>{
			        if ($scope.discountData.length === 3) return
			        if (idx > 0 && !$scope.discountData[idx - 1].highNum) {
				        layer.msg('请输入大于起止数的终止数')
				        return;
			        }
			        if (Number($scope.discountData[idx].discount) >= 1 || Number($scope.discountData[idx].discount) === 0) {
				        layer.msg('请输入0～1区间折扣值')
				        return;
			        }
			        $scope.discountData = [
				        ...$scope.discountData,
				        {
					        name: (Number(item.name)+1).toString(),
					        lowNum: null,
					        highNum: null,
					        discount: null
				        }
			        ]
		        }
		
		        // 采购数量区间折扣 - 删除
		        $scope.handleRemoveDiscount = (item,idx) =>{
			        if ($scope.discountData.length === 1) return
			        $scope.discountData = $scope.discountData.filter(o => o.name !== item.name)
			        $scope.discountData[idx - 1].highNum = null
		        }
		
		        // 采购数量区间折扣 - 改变折扣/数量
		        $scope.handleChangeDiscount = (item, field, len,) =>{
			        item[field] = utils.floatLength(item[field], len)
		        }
		
		        // 采购数量区间折扣 - 改变折扣/数量失焦
		        $scope.handleBlurDiscount = (item, field, idx) =>{
			        console.log(item[field])
			        if(field === 'highNum'){
				        if (Number(item[field]) <= Number($scope.discountData[idx].lowNum)){
					        item[field] = null
					        layer.msg('请输入大于起止数的终止数')
					        return
				        }
				        $scope.discountData[idx + 1].lowNum = Number($scope.discountData[idx].highNum) + 1
			        }
			        if (field === 'discount' && (Number(item[field]) > 1 || Number(item[field]) === 0)){
				        item[field] = null
				        layer.msg('请输入0～1区间折扣值')
			        }
		        }
            
            
            
            

            // 到货日期
            $scope.ArrivalCycle = productInfo.buyTime || '';
            $scope.verifyArrivalCycle = false;

            // 消费人群
            $scope.consumerListOne = [];
            $scope.consumerListTwo = [];
            $scope.consumerListThree = [];
            $scope.consOneVal = '';
            $scope.consTwoVal = '';
            $scope.consThreeVal = '';
            $scope.hasSecondCon = false;
            $scope.hasThirdCon = false;
            $scope.selectConsumer = [];
            $scope.verifyConsumersGroup = false;
            var customers = productInfo.customerTags;
            if (typeof customers != 'object') {
                customers = JSON.parse(customers);
            }
            for (var k in customers) {
                $scope.selectConsumer.push(customers[k]);
            }

            merchan.getCustomerListOne(function (data) {
                $scope.consumerListOne = data;
                // $scope.consOneVal = $scope.consumerListOne[0].id;
            });
            $scope.getSeconeConList = function (id) {
                merchan.getCustomerListTwo(id, function (data) {
                    if (data[0] != null) {
                        $scope.hasSecondCon = true;
                        $scope.consumerListTwo = data;
                        // $scope.consTwoVal = $scope.consumerListTwo[0].id;
                    } else {
                        $scope.hasSecondCon = false;
                    }
                });
            }
            $scope.getThirdConList = function (id) {
                merchan.getCustomerListThree(id, function (data) {
                    if (data[0] != null) {
                        $scope.hasThirdCon = true;
                        $scope.consumerListThree = data;
                        // $scope.consThreeVal = $scope.consumerListThree[0].id;
                    } else {
                        $scope.hasThirdCon = false;
                        for (var i = 0; i < $scope.consumerListTwo.length; i++) {
                            if ($scope.consumerListTwo[i].id == id) {
                                $scope.selectConsumer.push({
                                    id: id,
                                    name: $scope.consumerListTwo[i].nameEn
                                });
                                break;
                            }
                        }
                    }
                });
            }
            $scope.setConsItem = function (id) {
                var removeIndex = erp.findIndexByKey($scope.consumerListThree, 'id', id);
                $scope.selectConsumer.push({
                    id: id,
                    name: $scope.consumerListThree[removeIndex].nameEn
                });
            }
            $scope.removeOneConsumer = function (id) {
                var removeIndex = erp.findIndexByKey($scope.selectConsumer, 'id', id);
                $scope.selectConsumer.splice(removeIndex, 1);
            }

            // 点击页面隐藏搜索
            $scope.hideSearchRes = function () {
                // 搜索供应商
                $scope.searchSupplierName = '';
                $scope.hasSearchSupplierRes = false;
                $scope.noSearchSupplierRes = false;
                // 搜索用户
                $scope.searchUserName = '';
                $scope.hasSearchUserRes = false;
                $scope.noSearchUserRes = false;
            }
            $scope.stopPropagation = function (e) {
                e.stopPropagation();
            }

            // 首选业务员
            getEmployeeList(erp, '销售', function (data) {
                $scope.salemanList = data;
            });
            if (productInfo.shelveId && productInfo.shelve) {
                $scope.chargeSaleman = productInfo.shelveId + '_' + productInfo.shelve;
            } else {
                $scope.chargeSaleman = '';
            }
            // 记录初始值
            $scope.$watch('hasGotStorage', function (now, old) {
                if (now == old) return;
                if (now == true) {
                    $scope.editorContent = $scope.editor.txt.html();
                    $scope.originalData = merchan.settleSendData($scope, userId, token, userName, operate);
                    // console.log($scope.originalData);
                }
            });

            // 可见用户
            $scope.authority = {};
            $scope.authority.satus = productInfo.authorityStatus || 1;
            $scope.authorityPart = false;
            if ($scope.authority.satus == 0) {
                $('#authority-type2').prop('checked', 'checked');
                $scope.authorityPart = true;
            } else {
                $('#authority-type').prop('checked', 'checked');
                $scope.authorityPart = false;
            }
            $scope.verifyAuthUser = false;

            $scope.authorityUsers = [];
            $scope.authority.users = productInfo.autAccId;
            if ($scope.authority.users && typeof $scope.authority.users != 'object') {
                $scope.authority.users = JSON.parse($scope.authority.users);
            } else {
                $scope.authority.users = $scope.authority.users;
            }
            for (var k in $scope.authority.users) {
                $scope.authorityUsers.push($scope.authority.users[k]);
            }
            $scope.searchUserName = '';
            $scope.searchUserRes = [];
            $scope.hasSearchUserRes = false;
            $scope.noSearchUserRes = false;
            $scope.choseAuthorityType = function () {
                var authVal = $('#authority-type').prop('checked');
                $scope.authority.satus = authVal ? 1 : 0;
                if ($scope.authority.satus == 0) {
                    $scope.authorityPart = true;
                } else {
                    $scope.authorityPart = false;
                }
            }
            $scope.searchByUserName = function (username) {
                merchan.searchByUserName(username, $scope, userId, token);
            }
            $scope.selectSearchUser = function (uid) {
                merchan.selectSearchUser(uid, $scope);
            }
            $scope.removeAuthUser = function (uid) {
                merchan.removeAuthUser(uid, $scope);
            }

            // 采购链接
            $scope.merchBuyLinks = productInfo.supplierLink || [];
            $scope.verifyBuylink = false;

            // 对手链接
            if (productInfo.rivalLink) {
                $scope.rivalLink = JSON.parse(productInfo.rivalLink)
            } else {
                $scope.rivalLink = [];
            }
            $scope.verifyRivallink = false;
            $scope.addRivalLink = function () {
                if (!$scope.addRivalVal) {
                    layer.msg('对手链接不能为空');
                    return;
                }
                if (!$scope.addRivalPrice) {
                    layer.msg('对手价格不能为空');
                    return;
                }
                $scope.rivalLink.push({
                    name: $scope.addRivalVal,
                    price: $scope.addRivalPrice
                });
                $scope.addRivalVal = '';
                $scope.addRivalPrice = '';
            }
            $scope.deleteRivalLink = function (i) {
                $scope.rivalLink.splice(i, 1);
            }


            $scope.merchBuyLink = '';
            $scope.addBuylink = function () {
                if ($scope.merchBuyLink.trim()) {
                    $scope.merchBuyLinks.push({
                        name: $scope.merchBuyLink,
                        star: 5,
                        beiZhu: $scope.merchBuyLinkBeizhu || ''
                    });
                    $scope.merchBuyLink = '';
                } else {
                    layer.msg('输入值不能为空');
                }
            }
            $scope.deleteBuyLink = function (name) {
                var deleteIndex = erp.findIndexByKey($scope.merchBuyLinks, 'name', name);
                $scope.merchBuyLinks.splice(deleteIndex, 1);
            }
            $scope.changeBuyLinkStar = function (name, $event) {
                var $this = $($event.currentTarget);
                var changeIndex = erp.findIndexByKey($scope.merchBuyLinks, 'name', name);
                $scope.merchBuyLinks[changeIndex].star = $this.attr('data');
                $this.attr("index", "10").siblings("span").removeAttr("index");
            }
            $scope.showYellStar = function ($event) {
                var $this = $($event.currentTarget);
                $this.addClass('star').prevAll("span").addClass("star").end().nextAll("span").removeClass("star");
            }
            $scope.hideYellStar = function ($event) {
                var $this = $($event.currentTarget);
                $this.removeClass('star').prevAll("span").removeClass("star");
                $this.parent().find("span[index=10]").addClass("star").prevAll("span").addClass("star");
            }

            $scope.numberInput = function (type) {
                if (type = 'setNum') {
                    $scope.setNum = $scope.setNum.replace(/[^\d]/g, '');
                }
            }
            // 供应商信息
            $scope.suppliers = [];
            for (var k in productInfo.supplier) {
                $scope.suppliers.push(productInfo.supplier[k]);
            }
            $scope.verifySupplier = false;

            $scope.showReceiveInfoClick = true;
            $scope.showReceiveInfo = function (showId) {
                if ($scope.showReceiveInfoClick) {
                    merchan.showReceiveInfo(showId, $scope);
                }
            }

            // 删除供应商
            $scope.removeSupplier = function (id) {
                merchan.removeSupplier(id, $scope);
            }
            // 搜索供应商
            $scope.searchSupplierName = '';
            $scope.searchSupplierRes = [];
            $scope.hasSearchSupplierRes = false;
            $scope.noSearchSupplierRes = false;
            $scope.searchBySupplierName = function (supplierName) {
                merchan.searchBySupplierName(supplierName, $scope, userId, token);
            }
            $scope.selectSearchSupplier = function (sid) {
                merchan.selectSearchSupplier(sid, $scope);
            }
            $scope.getAddSupplierInfo = function () {
                $('.supplier-info-table').each(function () {
                    var $supplierId = $(this).attr('id');
                    var $supplierIndex = erp.findIndexByKey($scope.suppliers, 'id', $supplierId);
                    if ($supplierIndex == -1) return;
                    $scope.suppliers[$supplierIndex].productLink = $(this).find('.supplier-plink').val();
                    $scope.suppliers[$supplierIndex].supplyPrice = $(this).find('.supplier-pprice').val();
                });
                return $scope.suppliers;
            }
            // 备注信息
            $scope.remarkInfo = productInfo.remark || '';
            $scope.verifyRemarkInfo = false;

            // 提交信息
            $scope.hasSavedData = false;
            $scope.saveInfo = function () {
                console.log($scope.checkedResons)
	            if (merchan.isLeagalVerify($scope)) {
                const parmas = {
                  nameEn: $scope.merchanName,
                  usname: $scope.entryNameEn,
                  zhname: $scope.entryName
                };
                layer.load(2);
                erp.postFun('pojo/product/checkProdcutName', parmas, function (data) {
	                // layer.closeAll('loading');
	                  if (data.data.statusCode == 200) {
                      for (let i = 0; i < $scope.merchBuyLinks.length; i++) {
                          if ($scope.merchBuyLinks[i]) {
                              $scope.merchBuyLinks[i].setNum = $scope.setNum;
                          }
                      }
                      if ($scope.personalizePro) { // 个性商品
                          $scope.$broadcast('to-pod', 'getdata');
                          $timeout(function () {
                              $scope.customMessage = that.podarray;
                              $scope.editorContent = $scope.editor.txt.html();
                              $scope.newEditData = merchan.settleSendData($scope, userId, token, userName, operate);
                              console.log($scope.newEditData)
                              var isHasChange = ($scope.newEditData == $scope.originalData);
                              if (isHasChange) {
                                  layer.closeAll('loading');
                                  layer.msg('商品信息未修改，不能提交！');
                                  return false;
                              }
                              var onewEditData = JSON.parse($scope.newEditData);
                              console.log(JSON.parse(onewEditData.data));
                              console.log($scope.varibleAtrrs)
                              var odata = JSON.parse(onewEditData.data);
                              let ovariants = JSON.parse(odata.variants)
                              let newVariants = {};
                              for (let key in ovariants) {
                                  if (ovariants[key].operate != 'DELETE') {
                                      newVariants[key] = ovariants[key];
                                  }
                              }
                              if ($scope.customMessage) {
                                  let backimgFlag = true;
                                  let colori = 10;//最多有三个变量，为10时则没有颜色变体
                                  for (let i = 0; i < $scope.varibleAtrrs.length; i++) {
                                      if ($scope.varibleAtrrs[i].nameEn == 'Color') {
                                          colori = i;
                                      }
                                  }
                                  if (Array.isArray($scope.customMessage)) {//pod2数据格式是数组
                                      if ($scope.customMessage.length > 0) {
                                          let colorArr = [];
                                          let variantsArr = Object.keys(newVariants);//变量列表
                                          if (variantsArr[0] == 'default' || colori == 10) {//没有变量时信息
                                              colorArr = [];
                                          } else {
                                              let variantsArrL = variantsArr.length;
                                              for (let i = 0; i < variantsArrL; i++) {
                                                  if (colori == 0 && $scope.varibleAtrrs.length == 1) {//当前只有颜色一个变体
                                                      colorArr = Object.keys(JSON.parse(odata.variants));
                                                  } else {//有多个变体有颜色
                                                      let newObj = variantsArr[i].split('-');
                                                      colorArr.push(newObj[colori]);
                                                  }
                                              }
                                          }
                                          let backColorArr = [];//当前添加的背景图片颜色列表
                                          let newColorArr = [];//编辑变量新增的颜色列表
                                          let delColorArr = [];//被删除的列表
                                          for (let j = 0; j < $scope.customMessage[0].backImgList.length; j++) {
                                              backColorArr.push($scope.customMessage[0].backImgList[j].color);
                                          }
                                          for (let i = 0; i < colorArr.length; i++) {
                                              if (backColorArr.indexOf(colorArr[i]) == -1 && newColorArr.indexOf(colorArr[i]) == -1) {
                                                  newColorArr.push(colorArr[i]);
                                              }
                                          }
                                          for (let i = 0; i < backColorArr.length; i++) {
                                              if (colorArr.indexOf(backColorArr[i]) == -1) {
                                                  delColorArr.push(backColorArr[i]);
                                              }
                                          }
                                          console.log('newColorArr====' + newColorArr)
                                          console.log('delColorArr====' + delColorArr)
                                          if (newColorArr.length > 0 || delColorArr.length > 0) {
                                              for (let i = 0; i < $scope.customMessage.length; i++) {
                                                  for (let j = 0; j < newColorArr.length; j++) {
                                                      let newObj = {
                                                          color: newColorArr[j],
                                                          imgsrc: ""
                                                      }
                                                      $scope.customMessage[i].backImgList.push(newObj);
                                                  }
                                                  for (let j = 0; j < delColorArr.length; j++) {
                                                      for (let k = 0; k < $scope.customMessage[i].backImgList.length; k++) {
                                                          if (delColorArr[j] == $scope.customMessage[i].backImgList[k].color) {
                                                              $scope.customMessage[i].backImgList.splice(k, 1);
                                                          }
                                                      }
                                                  }
                                              }
                                          }

                                          for (let i = 0; i < $scope.customMessage.length; i++) {
                                              let backImglen = $scope.customMessage[0].backImgList.length
                                              for (let j = 0; j < backImglen; j++) {
                                                  if (!$scope.customMessage[i].backImgList[j].imgsrc) {
                                                      backimgFlag = false;
                                                  }
                                              }
                                          }
                                          console.log($scope.customMessage)
                                          if (!backimgFlag && $scope.customMessage[0].backImgList.length > 0) {
                                              layer.closeAll('loading');
                                              $("html,body").animate({ scrollTop: $(".pod-box").offset().top }, 500);
                                              layer.msg('请上传区域图片');
                                              return false;
                                          }
                                      } else {
                                          layer.closeAll('loading');
                                          $("html,body").animate({ scrollTop: $(".pod-box").offset().top }, 500);
                                          layer.msg('请添加定制区域');
                                          return false;
                                      }
                                  } else {
                                      if (!$scope.customMessage.zone) {
                                          layer.closeAll('loading');
                                          layer.msg('请编辑定制区域信息')
                                          return;
                                      }
                                  }
                              }
                              postFun();
                          }, 0);
                          return;
                      } else {
                          postFun();
                      }
                    }else if (data.data.statusCode == 401){
                        layer.closeAll('loading');
                        layer.msg(data.data.message);
                    } else {
                        layer.closeAll('loading');
                        layer.msg('商品名称包含侵权词汇' + data.data.message + '，请修改后操作');
                    }
                });
              }
            }
            function postFun() {
                $scope.editorContent = $scope.editor.txt.html();
                $scope.newEditData = merchan.settleSendData($scope, userId, token, userName, operate);//改变后的值重新读取
                console.log('update',JSON.parse($scope.newEditData));
                // //////\\\\\\\新增编辑商品添加 扣分原因 逻辑 /////////// shite
                const updateData = JSON.parse($scope.newEditData);
                updateData.data = JSON.parse(updateData.data)
                updateData.data.deductPointsReasonIds = $scope.checkedResons.map(i => i.id).join(); // 添加扣分原因;
                updateData.data = JSON.stringify(updateData.data);
                $scope.newEditData = JSON.stringify(updateData);
                // /////////////////////////////\\\\\\\\\\\\\\\\\\\
                var isHasChange = ($scope.newEditData == $scope.originalData);
                if (isHasChange) {
                    layer.closeAll('loading');
                    layer.msg('商品信息未修改，不能提交！');
                    return false;
                }
                if ($scope.hasSavedData) return;
                $scope.hasSavedData = true;
                let postURL;
                if ($scope.productType == '3') {//包装商品
                    postURL = 'erp/PackProduct/updatePackProduct';
                    $scope.newEditData.data = JSON.stringify($scope.newEditData.data);
                } else {
                    postURL = 'pojo/product/update';
                }
                erp.postFun(postURL, $scope.newEditData, function (data) {
                    layer.closeAll('loading');
                    $scope.hasSavedData = false;
                    if (data.data.statusCode !== '200'){
	                    layer.msg('操作失败');
	                    return
                    }
                    if ($scope.productType == '3') {
                        layer.msg('操作成功');
                        location.href = "manage.html#/merchandise/package/3";
                    } else {
                        $scope.editSuccess = true;
                        merchan.successSubmit(data, $scope);
                    }
                }, function () {
                    layer.closeAll('loading');
                    layer.msg('网络错误');
                    $scope.hasSavedData = false;
                });
            }
            $scope.cancelAdd = function () {
                if ($scope.productType == '1') {
                    location.href = 'manage.html#/merchandise/list/service/' + $scope.merchanStatus;
                } else if ($scope.productType == '3') {
                    location.href = "manage.html#/merchandise/package/3";
                } else {
                    location.href = 'manage.html#/merchandise/list/drop/' + $scope.merchanStatus;
                }

            }

            
        });
        //  获取扣分原因
        function getResons() {
            erp.postFun(
              'integral/integralSourceProductReason/getAllDeductScoreReason',
              {
                  sku: productInfo.sku
              },
              res => {
                if (res.data.code == 200) {
                    $scope.resonArr = res.data.data.list;
                    $scope.checkedResonsHis = res.data.data.reasonName;
                } else {
                    layer.msg('获取扣分原因列表失败!')
                }
            
              }
            );
        }
        // 选择原因OK
        $scope.addResonFun = function(){
            const checkeds = $scope.resonArr.filter(i => i.checked);
            $scope.checkedResons = checkeds;
            $scope.kouFenFlag = false;
            console.log('checked' ,checkeds);
        }
        // 已选择 原因
        $scope.checkedResons = [];
        $scope.removeCheckedReson = function(id) {
            $scope.checkedResons = $scope.checkedResons.filter(i => i.id !== id);
        };

        let spId = $routeParams.id;
        let fwUserId = $routeParams.fwUserId;
        $scope.isNumFun = function (item, val) {
            val = val.replace(/[^\d.]/g, '');
            val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
            val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
            item.moneys = val;
        }
        $scope.dayIsNumFun = function (item, key, val) {
            val = val.replace(/[^\d.]/g, '');
            val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
            val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
            item[key] = val;
        }
        //服务费
        function fuWuFeiList() {
            erp.postFun('erp/serveProduct/moneyTypeList', { "dbProductId": spId,'storeTypeList':[1,2,3,4,5] }, function (data) {
                if (data.data.statusCode == 200) {
                    var result = data.data.result;
                    var cnArr = [],enArr = [],cnArr1 = [],enArr1 = [],thArr = [],thArr1 = [],deArr = [],deArr1 = [],inArr = [],inArr1 = [];
                    if(result&&JSON.stringify(result)!='[]'){
                        for(let i = 0,len = result.length;i<len;i++){
                            if(result[i].storeType==1){
                                cnArr.push(result[i])
                                cnArr1.push(result[i])
                            }else if(result[i].storeType==2){
                                enArr.push(result[i])
                                enArr1.push(result[i])
                            }else if(result[i].storeType==3){
                                thArr.push(result[i])
                                thArr1.push(result[i])
                            }else if(result[i].storeType==4){
                                deArr.push(result[i])
                                deArr1.push(result[i])
                            }else if(result[i].storeType==5){
                                inArr.push(result[i])
                                inArr1.push(result[i])
                            }else if(result[i].storeType==4){
                                deArr.push(result[i])
                                deArr1.push(result[i])
                            }else if(result[i].storeType==5){
                                inArr.push(result[i])
                                inArr1.push(result[i])
                            }
                        }
                    }

                } else {
                    // layer.msg(data.data.message)
                }
                $scope.cnMoneyList = cnArr;
                $scope.enMoneyList = enArr;
                $scope.thMoneyList = thArr;
                $scope.deMoneyList = deArr;
                $scope.inMoneyList = inArr;
                $scope.cnMoneyList1 = JSON.parse(JSON.stringify(cnArr1));
                $scope.enMoneyList1 = JSON.parse(JSON.stringify(enArr1));
                $scope.thMoneyList1 = JSON.parse(JSON.stringify(thArr1));
                $scope.deMoneyList1 = JSON.parse(JSON.stringify(deArr1));
                $scope.inMoneyList1 = JSON.parse(JSON.stringify(inArr1));
            }, function (data) {
                console.log(data)
            })
        }
        function getZltsFun() {
            erp.postFun('erp/serveProduct/getRetention', {
                'dbProductId': spId,
                'userId': fwUserId
            }, function (data) {
                console.log(data)
                if (data.data.statusCode == 200) {
                    if (data.data.result.length > 0) {
                        $scope.zhiLiuList = data.data.result;
                    }else{
                        $scope.zhiLiuList = [
                            {"id":'',"dbProductId":spId,"userId":fwUserId,"storeId":1,"days":0,},
                            {"id":'',"dbProductId":spId,"userId":fwUserId,"storeId":2,"days":0,},
                            {"id":'',"dbProductId":spId,"userId":fwUserId,"storeId":3,"days":0,},
                            {"id":'',"dbProductId":spId,"userId":fwUserId ,"storeId":4,"days":0,},
                            {"id":'',"dbProductId":spId,"userId":fwUserId ,"storeId":5,"days":0,},
                        ]
                    }
                } else {
                    layer.msg(data.data.message)
                }

            }, function (data) {
                console.log(data)
            })
        }
        fuWuFeiList()
        getZltsFun()
        //保存
        $scope.baoCunFun = function () {
            var upArr = [];
            upArr = upArr.concat($scope.cnMoneyList,$scope.enMoneyList,$scope.thMoneyList,$scope.deMoneyList,$scope.inMoneyList)
            if (JSON.stringify(upArr) != '[]' && !isEmpatyFun(upArr)) {
                layer.msg('费用不能全部为空')
                fuWuFeiList()
                return
            }
            for (let i = 0, len = upArr.length; i < len; i++) {
                upArr[i]['dbProductId'] = spId
            }
            // moneyType,itemName,createTime,dbProductId,id,moneys,storeType
            erp.postFun('erp/serveProduct/editServeMoney', upArr, function (data) {
                console.log(data)
                layer.msg(data.data.message)
                if (data.data.statusCode == 200) {
                    fuWuFeiList()
                    // getZltsFun()
                }
            }, function (data) {
                console.log(data)
            }, { layer: true })
            // 滞留天数
            erp.postFun('erp/serveProduct/updateRetention', $scope.zhiLiuList, function (data) {
                console.log(data)
                if (data.data.statusCode == 200) {
                    getZltsFun()
                }
            }, function (data) {
                console.log(data)
            })
        }

        //提交审核
        $scope.tiJiaoShFun = function () {
            if (arrIsEqual($scope.cnMoneyList, $scope.cnMoneyList1)) {
                layer.msg('请保存中国仓的修改')
                return
            }
            if (arrIsEqual($scope.enMoneyList, $scope.enMoneyList1)) {
                layer.msg('请保存美国仓的修改')
                return
            }
            if(arrIsEqual($scope.thMoneyList,$scope.thMoneyList1)){
                layer.msg('请保存泰国仓的修改')
                return
            }
            if(arrIsEqual($scope.deMoneyList,$scope.deMoneyList1)){
                layer.msg('请保存德国仓的修改')
                return
            }
            if(arrIsEqual($scope.inMoneyList,$scope.inMoneyList1)){
                layer.msg('请保存印尼仓的修改')
                return
            }

            if (!isEmpatyFun($scope.cnMoneyList)) {
                layer.msg('中国仓的费用不能全部为空')
                return
            }
            if (!isEmpatyFun($scope.enMoneyList)) {
                layer.msg('美国仓的费用不能全部为空')
                return
            }
            if(!isEmpatyFun($scope.thMoneyList)){
                layer.msg('泰国仓的费用不能全部为空')
                return
            }
            if(!isEmpatyFun($scope.deMoneyList)){
                layer.msg('德国仓的费用不能全部为空')
                return
            }
            if(!isEmpatyFun($scope.inMoneyList)){
                layer.msg('印尼仓的费用不能全部为空')
                return
            }
            var upJson = {};
            upJson.dbSku = fwSpSku;
            upJson.status = fuWuSpStu;
            erp.postFun('erp/serveProduct/updateServeStatus', JSON.stringify(upJson), function (data) {
                console.log(data)
                layer.msg(data.data.message)
            }, function (data) {
                console.log(data)
            }, { layer: true })
        }
        function arrIsEqual(arr1, arr2) {
            for (let i = 0, len = arr1.length; i < len; i++) {
                console.log(!isObjectValueEqual(arr1[i], arr2[i]))
                if (!isObjectValueEqual(arr1[i], arr2[i])) {
                    return true
                }
            }
            return false;
        }
        function isObjectValueEqual(a, b) {
            var aProps = Object.getOwnPropertyNames(a);
            var bProps = Object.getOwnPropertyNames(b);
            console.log(aProps, bProps)
            for (var i = 0; i < aProps.length; i++) {
                var propName = aProps[i];
                console.log(a['moneys'], b['moneys'])
                if ((a['moneys'] || b['moneys']) && a['moneys'] != b['moneys']) {
                    return false;
                }
            }
            return true;
        }
        function isEmpatyFun(arr) {
            let flag = false;
            for (let i = 0, len = arr.length; i < len; i++) {
                if (arr[i].moneys > 0) {
                    flag = true;
                    break;
                }
                if (i == len - 1) {
                    flag = false;
                }
            }
            return flag;
        }
        //--------商品视频--------------------------------------------

        //////
    }]);

    //商品详情
    app.controller('merchandiseCtrlDetailShow', ['$scope', '$window', '$location', '$compile', '$routeParams', '$timeout', '$http', 'erp', 'merchan', '$sce', function ($scope, $window, $location, $compile, $routeParams, $timeout, $http, erp, merchan, $sce) {
        var bs = new Base64();
        var loginName = localStorage.getItem('erploginName') ? bs.decode(localStorage.getItem('erploginName')) : '';

        // 商品操作日志
        $scope.logShow = true;
        $scope.model = false;
        $scope.consultList = [];
        $scope.pageNum = 1;
        $scope.pageSize = 10;
        $scope.erpordTnum = 0;      //分页总条数
        $scope.detailList = [];
        // 导航切换
        $scope.navTab = function (state) {
            state == 1 ? $scope.logShow = true : $scope.logShow = false;
        };
        var spId = $routeParams.id, fuWuSpId = $routeParams.fuspId, fuWuSpStu = $routeParams.fuspStu, fwSpSku = $routeParams.sku, fwUserId = $routeParams.userId;
        $scope.fuWuSpStu = fuWuSpStu;
        if (loginName != 'admin' && fwSpSku && $scope.fuWuSpStu == 1) {
            $scope.adminFlag = true;
        } else if (loginName == 'admin' && fwSpSku) {
            $scope.adminFlag = true;
        }
        console.log($scope.adminFlag)
        $scope.isNumFun = function (item, val) {
            val = val.replace(/[^\d.]/g, '');
            val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
            val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
            item.moneys = val;
        }
        $scope.dayIsNumFun = function (item, key, val) {
            val = val.replace(/[^\d.]/g, '');
            val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
            val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
            item[key] = val;
        }
        //服务费
        function fuWuFeiList() {
            erp.postFun('erp/serveProduct/moneyTypeList', { "dbProductId": spId,'storeTypeList':[1,2,3,4,5] }, function (data) {
                if (data.data.statusCode == 200) {
                    var result = data.data.result;
                    var cnArr = [],enArr = [],cnArr1 = [],enArr1 = [],thArr = [],thArr1 = [],deArr = [],deArr1 = [],inArr = [],inArr1 = [];
                    if(result&&JSON.stringify(result)!='[]'){
                        for(let i = 0,len = result.length;i<len;i++){
                            if(result[i].storeType==1){
                                cnArr.push(result[i])
                                cnArr1.push(result[i])
                            }else if(result[i].storeType==2){
                                enArr.push(result[i])
                                enArr1.push(result[i])
                            }else if(result[i].storeType==3){
                                thArr.push(result[i])
                                thArr1.push(result[i])
                            }else if(result[i].storeType==4){
                                deArr.push(result[i])
                                deArr1.push(result[i])
                            }else if(result[i].storeType==5){
                                inArr.push(result[i])
                                inArr1.push(result[i])
                            }else if(result[i].storeType==4){
                                deArr.push(result[i])
                                deArr1.push(result[i])
                            }else if(result[i].storeType==5){
                                inArr.push(result[i])
                                inArr1.push(result[i])
                            }
                        }
                    }

                } else {
                    // layer.msg(data.data.message)
                }
                $scope.cnMoneyList = cnArr;
                $scope.enMoneyList = enArr;
                $scope.thMoneyList = thArr;
                $scope.deMoneyList = deArr;
                $scope.inMoneyList = inArr;
                $scope.cnMoneyList1 = JSON.parse(JSON.stringify(cnArr1));
                $scope.enMoneyList1 = JSON.parse(JSON.stringify(enArr1));
                $scope.thMoneyList1 = JSON.parse(JSON.stringify(thArr1));
                $scope.deMoneyList1 = JSON.parse(JSON.stringify(deArr1));
                $scope.inMoneyList1 = JSON.parse(JSON.stringify(inArr1));
            }, function (data) {
                console.log(data)
            })


        }
        function getZltsFun() {
            erp.postFun('erp/serveProduct/getRetention', {
                'dbProductId': spId,
                'userId': fwUserId
            }, function (data) {
                console.log(data)
                if (data.data.statusCode == 200) {
                    if (data.data.result.length > 0) {
                        $scope.zhiLiuList = data.data.result;
                    }else{
                        $scope.zhiLiuList = [
                            {"id":'',"dbProductId":spId,"userId":fwUserId,"storeId":1,"days":0,},
                            {"id":'',"dbProductId":spId,"userId":fwUserId,"storeId":2,"days":0,},
                            {"id":'',"dbProductId":spId,"userId":fwUserId,"storeId":3,"days":0,},
                            {"id":'',"dbProductId":spId,"userId":fwUserId ,"storeId":4,"days":0,},
                            {"id":'',"dbProductId":spId,"userId":fwUserId ,"storeId":5,"days":0,},
                        ]
                    }
                } else {
                    layer.msg(data.data.message)
                }

            }, function (data) {
                console.log(data)
            })
        }
        if ($scope.adminFlag) {
            fuWuFeiList()
            getZltsFun()
        }
        //保存
        $scope.baoCunFun = function () {
            var upArr = [];
            console.log($scope.cnMoneyList)
            upArr = upArr.concat($scope.cnMoneyList,$scope.enMoneyList,$scope.thMoneyList,$scope.deMoneyList,$scope.inMoneyList)
            console.log(upArr)
            if (JSON.stringify(upArr) != '[]' && !isEmpatyFun(upArr)) {
                layer.msg('费用不能全部为空')
                fuWuFeiList()
                return
            }
            for (let i = 0, len = upArr.length; i < len; i++) {
                upArr[i]['dbProductId'] = spId
            }
            // moneyType,itemName,createTime,dbProductId,id,moneys,storeType
            erp.postFun('erp/serveProduct/editServeMoney', upArr, function (data) {
                console.log(data)
                layer.msg(data.data.message)
                if (data.data.statusCode == 200) {
                    fuWuFeiList()
                    // getZltsFun()
                }
            }, function (data) {
                console.log(data)
            }, { layer: true })
            // 滞留天数
            erp.postFun('erp/serveProduct/updateRetention', $scope.zhiLiuList, function (data) {
                console.log(data)
                if (data.data.statusCode == 200) {
                    getZltsFun()
                }
            }, function (data) {
                console.log(data)
            })
        }

        //提交审核
        $scope.tiJiaoShFun = function () {
            if (arrIsEqual($scope.cnMoneyList, $scope.cnMoneyList1)) {
                layer.msg('请保存中国仓的修改')
                return
            }
            if (arrIsEqual($scope.enMoneyList, $scope.enMoneyList1)) {
                layer.msg('请保存美国仓的修改')
                return
            }
            if(arrIsEqual($scope.thMoneyList,$scope.thMoneyList1)){
                layer.msg('请保存泰国仓的修改')
                return
            }
            if(arrIsEqual($scope.deMoneyList,$scope.deMoneyList1)){
                layer.msg('请保存德国仓的修改')
                return
            }
            if(arrIsEqual($scope.inMoneyList,$scope.inMoneyList1)){
                layer.msg('请保存印尼仓的修改')
                return
            }

            if (!isEmpatyFun($scope.cnMoneyList)) {
                layer.msg('中国仓的费用不能全部为空')
                return
            }
            if (!isEmpatyFun($scope.enMoneyList)) {
                layer.msg('美国仓的费用不能全部为空')
                return
            }
            if(!isEmpatyFun($scope.thMoneyList)){
                layer.msg('泰国仓的费用不能全部为空')
                return
            }
            if(!isEmpatyFun($scope.deMoneyList)){
                layer.msg('德国仓的费用不能全部为空')
                return
            }
            if(!isEmpatyFun($scope.inMoneyList)){
                layer.msg('印尼仓的费用不能全部为空')
                return
            }
            var upJson = {};
            upJson.dbSku = fwSpSku;
            upJson.status = fuWuSpStu;
            upJson.id = fuWuSpId;
            erp.postFun('erp/serveProduct/updateServeStatus', JSON.stringify(upJson), function (data) {
                console.log(data)
                layer.msg(data.data.message)
            }, function (data) {
                console.log(data)
            }, { layer: true })
        }
        function arrIsEqual(arr1, arr2) {
            for (let i = 0, len = arr1.length; i < len; i++) {
                console.log(!isObjectValueEqual(arr1[i], arr2[i]))
                if (!isObjectValueEqual(arr1[i], arr2[i])) {
                    return true
                }
            }
            return false;
        }
        function isObjectValueEqual(a, b) {
            var aProps = Object.getOwnPropertyNames(a);
            var bProps = Object.getOwnPropertyNames(b);
            console.log(aProps, bProps)
            for (var i = 0; i < aProps.length; i++) {
                var propName = aProps[i];
                console.log(a['moneys'], b['moneys'])
                if ((a['moneys'] || b['moneys']) && a['moneys'] != b['moneys']) {
                    return false;
                }
            }
            return true;
        }
        function isEmpatyFun(arr) {
            let flag = false;
            for (let i = 0, len = arr.length; i < len; i++) {
                if (arr[i].moneys > 0) {
                    flag = true;
                    break;
                }
                if (i == len - 1) {
                    flag = false;
                }
            }
            return flag;
        }
        // 详情
        $scope.detail = function (item) {
            $scope.model = true;
            let data = {
                productId: item.productId,
                consulting_id: item.consulting_id
            }
            let name = item.user_name;
            $scope.detailList = [];
            erp.postFun('erp/consulting/getConsultinginfo', JSON.stringify(data), function (res) {
                if (res.data.statusCode == '200') {
                    $scope.detailList.push(res.data.result[0]);
                    $scope.detailList[0].imageName = $scope.detailList[0].user_name.slice(0, 1).toUpperCase();
                    if (res.data.result[0].replycount > 0) {
                        $scope.detailList = $scope.detailList.concat(res.data.result[0].reply);
                        for (let i = 1; i < $scope.detailList.length; i++) {
                            if ($scope.detailList[i].state < 3) {
                                if ($scope.detailList[i].user_name == 'CJ') {
                                    $scope.detailList[i].user_name = $scope.detailList[i].user_name + ' 回复' + name;
                                } else {
                                    if ($scope.detailList[i].state > 1) {
                                        $scope.detailList[i].user_name = $scope.detailList[i].user_name + '回复 CJ';
                                    }
                                }
                                // 没有图像，首字母大写
                                $scope.detailList[i].imageName = $scope.detailList[i].user_name.slice(0, 1).toUpperCase();
                            }
                        }
                    }
                }
            });
        }
        // 关闭
        $scope.cancel = function () {
            $scope.model = false;
        };
        // 商品数据列表
        function logList() {
            let data = {
                pageNum: String($scope.pageNum),
                pageSize: String($scope.pageSize),
                productId: $routeParams.id
            }
            $scope.consultList = [];
            erp.postFun('erp/consulting/getConsultingList', JSON.stringify(data), function (res) {
                if (res.data.statusCode == '200') {
                    $scope.consultList = res.data.result;
                    console.log($scope.consultList);
                    $scope.erpordTnum = $scope.consultList.total;
                    for (let i = 0; i < res.data.result.list.length; i++) {
                        let id = res.data.result.list[i].user_id;
                        $scope.consultList.list[i].commodityId = id.slice(1, id.indexOf('}'))
                    }
                    dealpage();
                }
            })
        }
        logList();
        //处理分页
        function dealpage() {
            if ($scope.erpordTnum <= 0) {
                layer.closeAll("loading")
                return;
            }
            $("#c-pages-fun").jqPaginator({
                totalCounts: $scope.erpordTnum,//设置分页的总条目数
                pageSize: $scope.pageSize - 0,//设置每一页的条目数
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
                    logList()
                }
            });
        };
        //分页选择框的切换
        // $('#page-sel').change(function () {
        //   erp.load();
        //   var showList = $(this).val() - 0;
        //   $scope.pageSize = showList;
        //   if ($scope.erpordTnum < 1) {
        //     erp.closeLoad();
        //     return;
        //   }
        //   $("#c-pages-fun").jqPaginator({
        //     totalCounts: $scope.erpordTnum,//设置分页的总条目数
        //     pageSize: showList,//设置每一页的条目数
        //     visiblePages: 5,//显示多少页
        //     currentPage: $scope.pageNum * 1,
        //     activeClass: 'active',
        //     prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
        //     next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
        //     page: '<a href="javascript:void(0);">{{page}}<\/a>',
        //     first: '<a class="prev" href="javascript:void(0);">&lt&lt;<\/a>',
        //     last: '<a class="prev" href="javascript:void(0);">&gt&gt;<\/a>',
        //     onPageChange: function () {
        //       logList();
        //     }
        //   });
        // });
        //跳页的查询
        $scope.gopageFun = function () {
            let pageNum = $('#inp-num').val() - 0;
            var countN = Math.ceil($scope.erpordTnum / $scope.pageSize);
            erp.load();
            if (!pageNum || pageNum < 1) {
                layer.closeAll("loading")
                layer.msg('跳转页数不能为空!');
                return;
            }
            if (pageNum > countN) {
                layer.closeAll("loading")
                layer.msg('选择的页数大于总页数.');
                return;
            }
            logList();
        };
        $scope.getData = false;
        $scope.isUnderReviewMerch = false;
        $scope.isOffShelveMerch = false;

        var userId = '{18D58634-9C91-45AA-9E46-503D5167FDB0}';
        var token = '';
        var userName = '王艳';
        var operate = 'UPDATE';

        var productInfo;

        $scope.pid = $routeParams.id;
        // 是否备份
        $scope.merchanFlag = $routeParams.flag;
        $scope.saleStatus = '';
        // 商品状态
        $scope.merchanStatus = $routeParams.status;
        // 商品类型
        $scope.productType = $routeParams.type;//0-;1-服务商品；2-；3-包装商品
        console.log($routeParams)
        layer.load(2);
        erp.postFun('pojo/product/detailNew', JSON.stringify({
            id: $scope.pid,
            flag: $scope.merchanFlag,
            productType: $scope.productType
        }), function (data) {
            layer.closeAll('loading');
            var data = data.data;
            if (data.statusCode != 200) {
                layer.msg(data.message);
                return false;
            }
            if (JSON.parse(data.result).product) {
                productInfo = JSON.parse(data.result).product[0];
            } else {
                productInfo = JSON.parse(data.result);
            }
            $scope.getData = true;
            console.log(productInfo);
	        $scope.discountStatus = productInfo.discountStatus ? productInfo.discountStatus.toString() : '0'
	        $scope.discountData = productInfo.discountInfo ?
		        JSON.parse(productInfo.discountInfo).map(o =>({...o, highNum: o.highNum === -1 ? null : o.highNum})) :
		        [{ name: '1', lowNum: 1, highNum: null, discount: null}]
	        console.log($scope.discountData);

        }, function () {
            layer.closeAll('loading');
            layer.msg('网络错误');
        });

        // 操作日志
        $scope.operateLogs = [];
        function getLogInfoList(){// 获取操作日志
            var params = {id:$scope.pid}
            var url = 'pojo/product/detailLogInfo'
            layer.load(2);
            erp.postFun(url,JSON.stringify(params),function(data){
                layer.closeAll('loading')
                console.log('operation',data)
                if(data.data.statusCode!='200') return layer.msg('服务器打盹了，请稍后再试！')
                var operList = JSON.parse(data.data.result)
                for (var i = 0; i < operList.length; i++) {
                    $scope.operateLogs.unshift(operList[i])
                }
            })
        }
        getLogInfoList()

        var that = this;
        // --- 商品描述 --- echarts  ----- >>
        $scope.chartShow = false;
        function getPeriodInfo() {//获取商品周期数据
            const pId = $scope.pid
            console.log()
            // const pId = '530C216E-EE62-4C22-BE6E-C911410289B5'
            erp.mypost('erp/arrival/getCaigouArrival', { pId }).then(({ data }) => {
                console.log('getPeriodInfo', data)
                if (data) {//数组 无数据 则返回null
                    if (data && data.length > 0) {
                        $scope.chartShow = true;
                        $timeout(() => {
                            initPieChart(data.slice(0, 10))
                        }, 0)//限制10组数据
                    }
                }
            })
        }
        getPeriodInfo()
        function getInfo() {//假数据
            return [
                { arrivalPeriod: '23', productName: 'Classic Fashion HoodieClassic Fashion Hoodie Black XXL' },
                { arrivalPeriod: '10', productName: 'Classic Fashion HoodieClas' },
                { arrivalPeriod: '5', productName: 'Classic Fashi' },
                { arrivalPeriod: '23', productName: 'Classic Fashion HoodieClasc Fashion Hoodie Black XXL' },
                { arrivalPeriod: '10', productName: 'Classic Fashion HoodieClc' },
                { arrivalPeriod: '5', productName: 'Classic Fashon' },
                { arrivalPeriod: '23', productName: 'Classic Fashion HdieClassic Fashion Hoodie Black XXL' },
                { arrivalPeriod: '10', productName: 'Classic shion HoodieClassic' },
                { arrivalPeriod: '5', productName: 'Classiashion' },
                { arrivalPeriod: '8', productName: 'Classic Fashion HoodieClassic Fashion Black XXL' }
            ]
        }
        function initPieChart(data) {
            const colorArr = ['#7ED321', '#A3A0FB', '#FF8373', '#4A90E2', '#F76B1C', '#FDD3A0'];
            const pieData = {
                legend: data.map(({ productName: name, arrivalPeriod: value }) => ({ name: `${name}: ${value} 天`, icon: 'circle' })),
                series: data.map(({ productName: name, arrivalPeriod: value }, i) => ({ name: `${name}: ${value} 天`, value, itemStyle: { color: colorArr[i] } }))
            }
            console.log('pieData', pieData)
            const option = {
                title: {
                    text: '商品到货时间',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}  ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: pieData.legend
                },
                series: [
                    {
                        name: '到货时间',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: pieData.series,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            const myChart = echarts.init(document.getElementById('pie-chart'));
            myChart.setOption(option);
            window.onresize = function () {
                myChart.resize();
            }
        }
        // --- 商品描述 --- echarts   ------------------------ ---------------////
        $scope.$watch('getData', function (now, old) {
            if (now === old) {
                return
            }

            if (productInfo.customMessage) {
                console.log(JSON.parse(productInfo.customMessage));
                if (Array.isArray(JSON.parse(productInfo.customMessage))) {
                    $scope.podVersion = '2';
                } else {
                    $scope.podVersion = '1';
                }
                $scope.personalizePro = true;
                $scope.podType = '1'
                that.podarray = JSON.parse(productInfo.customMessage);
                that.showdetail = '1';
            }
            if (productInfo.customeDesign) {
                console.log(productInfo.customeDesign)
                $scope.customeDesign = JSON.parse(productInfo.customeDesign);
                $scope.oldSku = productInfo.oldSku;
                console.log($scope.customeDesign)
                // $scope.customeDesignPro = true;
            }

            $scope.saleStatus = productInfo.saleStatus;

            $scope.merchanName = productInfo.nameEn;
            $scope.addGoodsAutoSKU = productInfo.sku;

            var regAndIcon = /&amp;/g
            $scope.goodsCategory = (productInfo.catagory || productInfo.category).replace(regAndIcon, '&');
            $scope.goodsCategoryId = productInfo.categoryId;

            $scope.editorContent = productInfo.description;
            $('#wang-editor').html($scope.editorContent);
            if (productInfo.xiaoShouJianYi) {
                $('#wang-editor-2-show').html(productInfo.xiaoShouJianYi);
            } else {
                $('#wang-editor-2-show').html('无');
            }
            // 商品图片
            $scope.picContainer = [];
            var picIdIndex = 0;
            $scope.getMerchanImgs = function () {
                var bigImgs = productInfo.img.split(',');
                var variantImgs = [];
                var stabProducts = productInfo.stanProducts;
                for (var i = 0; i < stabProducts.length; i++) {
                    if ($.inArray(stabProducts[i].img, variantImgs) == -1) {
                        variantImgs.push(stabProducts[i].img);
                    }
                }
                var imgSum = bigImgs.concat(variantImgs);
                imgSum = $.unique(imgSum);
                for (var i = 0; i < imgSum.length; i++) {
                    picIdIndex++;
                    $scope.picContainer.push({
                        pid: picIdIndex,
                        src: imgSum[i]
                    });
                }
            }
            $scope.getMerchanImgs();
            console.log($scope.picContainer)
            $scope.downloadPic = function () {
                if ($scope.picContainer.length < 1) {
                    layer.msg('请等待图片加载完毕')
                    return
                }
                let imgSrcArr = [];
                for (let i = 0, len = $scope.picContainer.length; i < len; i++) {
                    imgSrcArr.push($scope.picContainer[i].src)
                }
                imgSrcArr = Array.from(new Set(imgSrcArr))
                imgSrcArr = encodeURI(imgSrcArr)
                console.log(imgSrcArr)
                let url = "https://erp1.cjdropshipping.com/erp/downloadImg/filesdown?imgs=" + imgSrcArr + '&sku=' + $scope.addGoodsAutoSKU;
                window.open(url)
                console.log(url)
            }
            /** 拖拽成功触发方法
             *   index 拖拽后落下时的元素的序号（下标）
             *   obj 被拖动数据对象
             */

            $scope.previewPic = function ($event) {
                var picSrc = $($event.target).parent().parent().parent().find('img').attr('src');
                merchan.previewPic(picSrc);
            }

            // 变量部分
            $scope.varibles = [];
            $scope.varibleAtrrs = productInfo.variantKey == '' ? [] : productInfo.variantKey.split('-');
            $scope.merchanUnit = productInfo.unit;
            $scope.storages = [];


            // 渲染变量值到页面上
            var varibleHeadArr = [];
            var varibleConArr = [];
            // $('.merch-varible-box').css('width', 1160 + 80 * $scope.varibleAtrrs.length);
            console.log($scope.varibleAtrrs)
            for (var i = 0; i < $scope.varibleAtrrs.length; i++) {
                varibleHeadArr.push('<li class="li-new" title="' + $scope.varibleAtrrs[i] + '">' + $scope.varibleAtrrs[i] + '</li>');
                varibleConArr.push('<li class="li-new can-edit">'
                    + '<a class="edit-inp edit-new"></a>'
                    + '</li>');
            }
            console.log(varibleHeadArr)
            $('#varible-new').html(varibleHeadArr.join(''));
            $('.varible-new').html(varibleConArr.join(''));
            // merchan.renderVarible($('#varible-new'), $('.varible-new'), $scope);

            var variblesInfo = productInfo.stanProducts;
            var varibleLineIndex = 0;
            for (var i = 0; i < variblesInfo.length - 1; i++) {
                // merchan.addVaribleLine(varibleLineIndex, $('.merch-varible-box'), $scope);
                varibleLineIndex++;
                var html = '<div class="merch-varible-tbody clearfix" id="varible-line-' + varibleLineIndex + '">' + $('.merch-varible-tbody').html() + '</div>';
                var template = angular.element(html);
                var mobileDialogElement = $compile(template)($scope);
                $('.merch-varible-box').append(mobileDialogElement);
            }
            // 获取仓库信息并渲染变体信息
            merchan.getStorage(function (data) {
                // 美国东和美国西仓库不可编辑
                var temArr = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].storage != '美国东' && data[i].storage != '美国西') {
                        temArr.push(data[i]);
                    }
                }
                console.log(temArr)
                $scope.storages = temArr;
                // var width = $('.merch-varible-box').width();
                // $('.merch-varible-box').css('width', 1140 + 80 * $scope.varibleAtrrs.length + 80 * $scope.storages.length);
                // 渲染变量值到页面上
                var storageHeadArr = [];
                var storageConArr = [];
                for (var i = 0; i < $scope.storages.length; i++) {
                    storageHeadArr.push('<li class="li-storage">' + $scope.storages[i].storage + '</li>');
                    storageConArr.push('<li class="li-storage can-edit">'
                        + '<span class="edit-inp edit-' + $scope.storages[i].storageEn + '" name="' + $scope.storages[i].id + '"> </span>'
                        + '</li>');
                }
                $('#storage-name').html(storageHeadArr.join(''));
                $('.storage-con').html(storageConArr.join(''));
                // 获取到仓库信息后渲染变体信息
                $('.merch-varible-tbody').each(function (index) {
                    var $this = $(this);
                    // var $index = $(this).index() - 1;
                    // console.log(index);
                    $this.attr('name', variblesInfo[index].id || variblesInfo[index].ID);
                    $this.find('.merch-variable-pic').show().attr('src', variblesInfo[index].img || variblesInfo[index].IMG);
                    $this.find('.variable-pic-big').attr('src', variblesInfo[index].img || variblesInfo[index].IMG);
                    var variantKey = variblesInfo[index].variantKey || variblesInfo[index].VARIANTKEY;
                    var variantKeyArr = variantKey == 'default' ? [] : variantKey == null ? [] : variantKey.split('-');
                    if (variantKeyArr.length > 0) {
                        for (var i = 0; i < variantKeyArr.length; i++) {
                            $this.find('.edit-new').eq(i).html(variantKeyArr[i] == 'null' ? '' : variantKeyArr[i]).attr('title', (variantKeyArr[i] == 'null' ? '' : variantKeyArr[i]));
                        }
                    }
                    var changW = variblesInfo[index].isChangeWeight;
                    if (changW == '1') {
                        $this.find('.edit-pweight').html(variblesInfo[index].weight || variblesInfo[index].WEIGHT).css('color', '#04a452');
                    } else {
                        $this.find('.edit-pweight').html(variblesInfo[index].weight || variblesInfo[index].WEIGHT);
                    }
                    $this.find('.edit-postweight').html(variblesInfo[index].packWeight || variblesInfo[index].PACKWEIGHT);
                    $this.find('.edit-pprice').html('$ ' + variblesInfo[index].sellPrice);
                    $this.find('.edit-buyprice').html('¥ ' + variblesInfo[index].costPrice);
                    $this.find('.span-SKU').html(variblesInfo[index].sku || variblesInfo[index].SKU);
                    $this.find('.edit-sku-aname').html(variblesInfo[index].skuAlisa || variblesInfo[index].NUM); // 服务商品NUM，其他商品skuAlisa
                    $this.find('.edit-declarevalue').html('$ ' + (variblesInfo[index].entryValue || variblesInfo[index].ENTRYVALUE));
                    $this.find('.li-unit span').html($scope.merchanUnit);
                    var standard = variblesInfo[index].standard || variblesInfo[index].STANDARD;
                    var standardInfo = standard.split(',');
                    $this.find('.edit-length').html(standardInfo[0].replace('long=', ''));
                    $this.find('.edit-width').html(standardInfo[1].replace('width=', ''));
                    $this.find('.edit-height').html(standardInfo[2].replace('height=', ''));
                    var invsInfo = variblesInfo[index].invs;
                    $this.find('.storage-con .edit-inp').each(function () {
                        var storageId = $(this).attr('name');
                        var storageIndex = erp.findIndexByKey(invsInfo, 'storageId', storageId);
                        if (storageIndex != -1) {
                            $(this).html(invsInfo[storageIndex].inventory);
                        }
                    });
                    $this.find('.edit-storage-charge').html('$ ' + variblesInfo[index].STORAGECHARGE);
                    $this.find('.edit-process-charge').html('$ ' + variblesInfo[index].PROCESSCHARGE);
                    $this.find('.edit-unload-charge').html('$ ' + variblesInfo[index].UNLOADCHARGE);
                    // $this.find('.edit-send-charge').html('$ ' + variblesInfo[index].sendCharge);
                    $this.find('.edit-CNTOUSA-charge').html('$ ' + variblesInfo[index].CNTOUSACHARGE);
                    // if ($scope.personalizePro) {
                    //     $this.find('.edit-basic-color').html(variblesInfo[index].customMessage);
                    // }
                });
            });

            // sku别名弹框
            var currentSKUAname = '';
            $scope.alertSkuAname = function ($event) {
                var targetElement = $event.target;
                currentSKUAname = $(targetElement).html();
                var tempVaribleAtrrs = currentSKUAname == '' ? [] : currentSKUAname.split(',');
                layer.open({
                    title: null,
                    type: 1,
                    area: ['800px', '350px'],
                    skin: 'add-pic-layer add-varible-layer edit-skuAname-layer',
                    closeBtn: 0,
                    shade: 0,
                    content: $('#asj-sku-aname').html(),
                    btn: ['确认'],
                    success: function (layero, index) {
                        function renderShowVarible() {
                            var lisArr = [];
                            for (var i = 0; i < tempVaribleAtrrs.length; i++) {
                                lisArr.push('<li><span class="varible-name">' + tempVaribleAtrrs[i] + '</li>')
                            }
                            $(layero).find('.show-current-sku-aname').html(lisArr.join(''));
                        }

                        renderShowVarible();
                    },
                    yes: function (index, layero) {
                        layer.close(index);
                    }
                });
            }

            // 中文名称
            $scope.chineseName = productInfo.name.split(',');
            $('#chinese-name').find('.chinese-name-inp').each(function () {
                $(this).html($scope.chineseName[$(this).index()]);
            });

            // sku别名
            // $scope.skuAnameSet = productInfo.skuAlisa == '' ? [] : productInfo.skuAlisa.split(',');

            // 海关编码
            $scope.customsCode = productInfo.entryCode;

            // 申报品名（英文）
            $scope.entryNameEn = productInfo.entryNameEn;

            // 申报品名（中文）
            $scope.entryName = productInfo.entryName;

            // 包装
            $scope.packing = productInfo.packing.split(',');
            if ($scope.packing[0] == '') {
                $scope.packing.splice(0, 1);
            }

            // 属性
            $scope.property = productInfo.property.split(',');
            if ($scope.property[0] == '') {
                $scope.property.splice(0, 1);
            }

            // 材质
            $scope.material = productInfo.material.split(',');
            if ($scope.material[0] == '') {
                $scope.material.splice(0, 1);
            }

            // 到货日期
            $scope.ArrivalCycle = productInfo.buyTime || '';
            $scope.verifyArrivalCycle = false;

            // 消费人群
            $scope.selectConsumer = [];
            var customers = productInfo.customerTags;
            if (typeof customers != 'object') {
                customers = JSON.parse(customers);
            }
            for (var k in customers) {
                $scope.selectConsumer.push(customers[k]);
            }

            // 首选业务员
            $scope.shelve = productInfo.shelve;

            // 可见用户
            $scope.authority = {};
            $scope.authority.satus = productInfo.authorityStatus;
            $scope.authorityPart = false;
            if ($scope.authority.satus == 0) {
                $('.all-see').hide();
                $scope.authorityPart = true;
            } else {
                $('.part-see').hide();
                $scope.authorityPart = false;
            }

            $scope.authorityUsers = [];
            $scope.authority.users = productInfo.autAccId;
            if ($scope.authority.users && typeof $scope.authority.users != 'object') {
                $scope.authority.users = JSON.parse($scope.authority.users);
            } else {
                $scope.authority.users = $scope.authority.users;
            }
            for (var k in $scope.authority.users) {
                $scope.authorityUsers.push($scope.authority.users[k]);
            }

            // 采购链接
            $scope.merchBuyLinks = productInfo.supplierLink || [];

            // 对手链接
            if (productInfo.rivalLink) {
                $scope.rivalLink = JSON.parse(productInfo.rivalLink)
            } else {
                $scope.rivalLink = [];
            }

            // 供应商信息
            $scope.suppliers = [];
            for (var k in productInfo.supplier) {
                $scope.suppliers.push(productInfo.supplier[k]);
            }

            $scope.showReceiveInfoClick = true;
            $scope.showReceiveInfo = function (showId) {
                if ($scope.showReceiveInfoClick) {
                    merchan.showReceiveInfo(showId, $scope);
                }
            }

            // 备注信息
            $scope.remarkInfo = productInfo.remark || '';
            $scope.verifyRemarkInfo = false;

            // // 操作日志
            // $scope.operateLogs = [];
            // for (var i = 0; i < productInfo.opeProduct.length; i++) {
            //     $scope.operateLogs.unshift(productInfo.opeProduct[i]);
            // }

            $scope.cancelAdd = function () {
                if ($scope.productType == '1') {
                    location.href = 'manage.html#/merchandise/list/service/' + $scope.merchanStatus;
                } else if ($scope.productType == '3') {
                    location.href = 'manage.html#/merchandise/package/' + $scope.merchanStatus;
                } else {
                    location.href = 'manage.html#/merchandise/list/drop/' + $scope.merchanStatus;
                }
            }

        });
        
        //12-18 修改原有 copy功能  ------------>>
        const clipboard = new cjUtils.Clipboard();
        $scope.handleCopySku = function (event) {
            let sku = $(event.currentTarget).siblings('.span-SKU').text();
            console.log('sku ------------------' , sku)
            clipboard.set(sku).then((res) => {
                console.log(res)
                layer.msg('复制成功');
            }).catch(err => {
                console.log('copy fialed -->> ', err)
            })
        }
        //12-18 修改原有 copy功能 <<-------------

        $scope.copySku = function (event) {
            console.log(event);
            var sku = $(event.currentTarget).siblings('.span-SKU').text();
            console.log(sku);
            var Url1;
            Url1 = document.createElement('input');
            Url1.setAttribute('readonly', 'readonly');
            Url1.setAttribute('value', sku);
            document.body.appendChild(Url1);
            //console.log(Url1.value);
            Url1.select(); //选择对象
            document.execCommand("Copy");
            var tag = document.execCommand("Copy"); //执行浏览器复制命令
            if (tag) {
                layer.msg('复制成功');
            }
            document.body.removeChild(Url1);
        }
        //--------商品视频--------------------------------------------
        //video 设置
        /*      var myPlayer = videojs('my-video',{
                  width:300,
                  height:200,
                  autoplay: false,
                  //fluid: true,
                  techOrder: ['html5', 'flash'],
                  "preload": "auto",
              },function () {
                  //var myPlayer = this;
                  //myPlayer.play();
              });*/

    }]);

    //商品详情 新带商品分析
    app.controller('merchandiseCtrlDetailShowNew', ['$scope', '$window', '$location', '$compile', '$routeParams', '$timeout', '$http', 'erp', 'merchan', '$sce', function ($scope, $window, $location, $compile, $routeParams, $timeout, $http, erp, merchan, $sce) {
        
        // :id/:flag/:status/:type/
        $scope.productId = $routeParams.id // 商品id
        $scope.productFlag = $routeParams.flag //
        $scope.productStatus = $routeParams.status // 商品状态
        $scope.productType = $routeParams.type// 商品类型 0

        $scope.detail = undefined // 详情

        var API = {
            getDetail:'pojo/product/detailNew',// 商品详情
            getDetailLog:'pojo/product/detailLogInfo',// 商品操作日志
            getWarehouseList:'app/storage/getStorage',// 获取仓库列表
            // 商品档案新接口
            getVideos:'product/consider/getLocProductVideoList',// 获取视频列表
            getConsultCount:'product/consult/getProductConsultById',// 商品咨询次数
            getIndexShowCount:'product/display/getProductDisplayById',// 商品首次展示次数
            getPushCount:'product/published/statistics/getAppPushCount',// 商品推送次数
            getPurchaseCount:'product/procurement/getProcurementNumByProduct',// 商品采购次数
            getPurchasingDifficulty:'product/getProductProcurementScore',// 商品采购难度
            getProductSuppliers:'product/gongyingshang/productSuppliers',// 供应商数
            getCheckSupplier:'supplier/user/userInfo/check_supplier',// 是否有供应商入驻
            getFristOderTime:'product/cod/message/getVariantFirstTime',// 首次下单时间
            getDiputesRate:'product/dispute/variantDisputes',// 纠纷率
            getDefective:'product/procurement/getProcurementInfo',// 次品率和最近采购时间
            getCountCustomerCount:'product/consider/getCountCustomerOrderQuantity',// 客户数量
            getInventoryNum:'product/consult/getVariantInventoryInfo',// 获取仓库库存
        }

        // request-查询详情
        function getDetail(){
            var params = {
                id: $routeParams.id,
                flag: $routeParams.flag,
                productType: $routeParams.type
            }
            layer.load(2);
            erp.postFun(API.getDetail, JSON.stringify(params), function (data) {
                layer.closeAll('loading')
                var result = data.data.result
                if(data.data.statusCode != '200') return layer.msg('服务器打盹了,请刷新页面重试')
                $scope.detail = JSON.parse(result)
                getMerchanImgs() // 获取变体里的图片保存到全局变量
                getCustumer() // 遍历消费人群
                getPartSee() // 部分可见人群
                getRivalList() // 对手链接
                var _isHasSizeField = $scope.formatColorSize($scope.detail.stanProducts[0].variantKey || $scope.detail.stanProducts[0].VARIANTKEY,'size')
                console.log('是否有尺寸字段',_isHasSizeField)
                if(_isHasSizeField == undefined) $scope.isHasSizeField = false
                console.log('详情数据',$scope.detail)
            })
        }

        // 商品图片
        $scope.picContainer = [];
        function getMerchanImgs() {
            var productInfo = $scope.detail
            var imgs = productInfo.img.split(',');
            var variantImgs = [];
            var stanProducts = productInfo.stanProducts;
            for (var i = 0; i < stanProducts.length; i++) {
                if ($.inArray(stanProducts[i].img, variantImgs) == -1) {
                    variantImgs.push(stanProducts[i].img || stanProducts[i].IMG);
                }
            }
            var imgSum = imgs.concat(variantImgs);
            imgSum = erp.uniqueArray(imgSum);
            for (var i = 0; i < imgSum.length; i++) {
                $scope.picContainer.push({
                    pid: i,
                    src: imgSum[i]
                });
            }
            console.log('商品图片',$scope.picContainer)
        }

        // 大图预览
        $scope.previewPic = function (src) {merchan.previewPic(src)}

        // 详情弹窗
        $scope.detailBubbleShow = false

        // request-操作日志
        $scope.operateLogs = [];
        function getLogInfoList(){// 获取操作日志
            var params = {id:$routeParams.id}
            layer.load(2)
            erp.postFun(API.getDetailLog,JSON.stringify(params),function(data){
                layer.closeAll('loading')
                if(data.data.statusCode!='200') return layer.msg('服务器打盹了，请稍后再试！')
                var operList = JSON.parse(data.data.result)
                console.log('操作日志',operList)
                for (var i = 0; i < operList.length; i++) {
                    $scope.operateLogs.unshift(operList[i])
                }
            })
        }
        getLogInfoList()

        // request-仓库列表
        $scope.warehouseList = []
        function getWarehouseList(){
            layer.load(2)
            erp.getFun(API.getWarehouseList,function(data){
                layer.closeAll('loading')
               if(data.data.statusCode != '200') return layer.msg('服务器打盹了，请重新尝试')
               var result = JSON.parse(data.data.result)
               $scope.warehouseList = result
                console.log('仓库列表',result)
            })
        }
        getWarehouseList()
        $scope.$watch('warehouseList',function(){// 监听仓库列表是否获取到
            console.log('warehouseList change')
            if($scope.warehouseList.length>0){// 获取仓库后再获取详情
                getDetail()
            }
        })
        
        // 消费人群
        function getCustumer(){
            var productInfo = $scope.detail
            $scope.detail.selectConsumer = []
            var customers = productInfo.customerTags;
            if (typeof customers != 'object') {
                customers = JSON.parse(customers);
            }
            for (var k in customers) {
                $scope.detail.selectConsumer.push(customers[k]);
            }
        }

        // 部分可见
        function getPartSee(){
            var productInfo = $scope.detail
            $scope.detail.authorityUsers = []
            var authUsers = productInfo.autAccId
            if(authUsers && typeof authUsers != 'object'){
                authUsers = JSON.parse(authUsers)
            }
            for (var k in authUsers) {
                $scope.detail.authorityUsers.push(authUsers[k]);
            }
        }

        // 对手链接
        function getRivalList(){
            var rivalLink = $scope.detail.rivalLink
            $scope.detail.rivalLinkList = []
            if (rivalLink) {
                $scope.detail.rivalLinkList = JSON.parse(rivalLink)
            }
        }

        // 重量高度长度格式化
        $scope.formatStandard = function(val){
            if(!val) return ''
            var arr = val.split(',')
            var length = arr[0].replace('long=', '') || 0
            var width = arr[1].replace('width=', '') || 0
            var height = arr[2].replace('height=', '') || 0
            return length+'*'+width+'*'+height
        }

        // 颜色和尺寸格式化
        $scope.isHasSizeField = true
        $scope.formatColorSize = function(val,type){
            var _type = typeof type == 'undefined'?'color':type // color/size
            var result = val.split('-')[0]
            if(_type == 'size') result = val.split('-')[1]
            return result
        }

        // 获取变体仓库总数
        $scope.getInventorySum = function(item){
            var inventorys = item.inventoryNumArr || []
            var sum = 0
            for(var i=0;i<inventorys.length;i++){
                sum += inventorys[i].goodsNum
            }
            return sum
        }

        // 获取仓库名称
        $scope.formatInventory = function(id){
            var result = ''
            var warehouseList = $scope.warehouseList
            if(warehouseList.length<=0) return result
            for(var i=0;i<warehouseList.length;i++){
                if(id==warehouseList[i].id){
                    result = warehouseList[i].storage
                    break
                }
            }
            return result
        }

        // 复制sku
        const clipboard = new cjUtils.Clipboard();
        $scope.handleCopySku = function (sku) {
            clipboard.set(sku).then((res) => {
                console.log(res)
                layer.msg('复制成功');
            }).catch(err => {
                console.log('copy fialed -->> ', err)
            })
        }

        // request-获取视频
        $scope.videos = []
        function getVideos(){
            var params ={
                pid:$routeParams.id
            }
            erp.postFun(API.getVideos,JSON.stringify(params),function(data){
                if(data.data.code!='200') return false
                var result = data.data.data
                $scope.videos = result
                console.log('视频列表',$scope.videos)
            })
        }
        getVideos()

        // 播放视频
        $scope.videoFlag = false // 视频弹窗
        $scope.playVideo = function(id){
            $scope.videoFlag = true
            cjUtils.getVideoInfo({
                eleId: 'J_prismPlayer',
                hasWater: false,
                videoId: id,
                configuration: {
                    width: '100%',
                    height: '320px',
                },
                callback: player => {
                    player.on('ready', () => {
                    console.log('视频加载完成后回调')
                    })
                    player.on('ended', () => {
                    console.log('视频播放完成后回调')
                    })
                }
                })
        }

        // request-商品咨询次数
        $scope.consultCount = 0
        function getProductConsultCount(){
            var params = {
                pid:$routeParams.id
            }
            erp.postFun(API.getConsultCount,JSON.stringify(params),function(data){
                if(data.data.code!='200') return false
                var result = data.data.data
                $scope.consultCount = result
                console.log('商品咨询次数',result)
            })
        }
        getProductConsultCount()

        // request-商品首页展示次数
        $scope.IndexShowCount = 0
        function getIndexShowCount(){
            var params = {
                pid:$routeParams.id
            }
            erp.postFun(API.getIndexShowCount,JSON.stringify(params),function(data){
                if(data.data.code!='200') return false
                var result = data.data.data
                $scope.IndexShowCount = result
                console.log('首页展示次数',result)
            })
        }
        getIndexShowCount()

        // request-商品推送次数
        $scope.pushCount = 0
        function getAppPushCount(){
            var params = {
                pid:$routeParams.id
            }
            erp.postFun(API.getPushCount,JSON.stringify(params),function(data){
                if(data.data.code != '200') return false
                var result = data.data.data
                $scope.pushCount = result
                console.log('推送次数',result)
            })
        }
        getAppPushCount()

        // request-商品采购次数
        $scope.purchaseCount = 0
        function getPurchaseCount(){
            var params = {
                pid:$routeParams.id
            }
            erp.postFun(API.getPurchaseCount,JSON.stringify(params),function(data){
                if(data.data.code != '200') return false
                var result = data.data.data
                $scope.purchaseCount = result.purchaseNum
                console.log('采购次数',result)
            })
        }
        getPurchaseCount()

        // request-商品采购难度
        $scope.purchasingDifficulty={
            score:'0',// 链接数
            buyTimeAvg:'0',// 平均到货周期
            linkCount:'0'// 采购难度分
        }
        function getPurchasingDifficultyData(){
            var params = {
                pid:$routeParams.id
            }
            erp.postFun(API.getPurchasingDifficulty,JSON.stringify(params),function(data){
                if(data.data.code!='200') return false
                var result = data.data.data
                $scope.purchasingDifficulty = result
                console.log('采购难度',$scope.purchasingDifficulty)
            })
        }
        getPurchasingDifficultyData()
        // 格式化采购难度
        $scope.formatPurchasing = function(val){
            if(val<=0) return '0'
            if(val>=100) return '100'
            return val
        }

        // request-获取供应商数并请求是否有供应商入住
        $scope.suppliers = [] // 供应商数
        function getSuppliers(){
            var params = {
                pid:$routeParams.id
            }
            erp.postFun(API.getProductSuppliers,JSON.stringify(params),function(data){
                if(data.data.code!='200') return false
                var result = data.data.data
                $scope.suppliers = result.list || []
                console.log('供应商',$scope.suppliers)
                isSupplierIn() // 是否供应商入住
            })
        }
        getSuppliers()

        // request-是否有供应商入住
        $scope.hasSupplierIn = false
        function isSupplierIn(){
            var names = ''
            var arr = $scope.suppliers || []
            for(var i=0;i<arr.length;i++){
                names+=arr[i].gongSiMing
            }
            var params = {
                companyName:names
            }
            erp.postFun(API.getCheckSupplier,JSON.stringify(params),function(data){
                if(data.data.code!='200') return false
                var result = data.data.data
                $scope.hasSupplierIn = result
                console.log('供应商是否入住',$scope.hasSupplierIn)
            })
        }

        // 变体分析
        $scope.variantsBubble = false
        $scope.$watch('variantsBubble',function(data){
            if(!$scope.variantsBubble) return false
            var stanProducts = $scope.detail.stanProducts
            if(stanProducts.length<=0) return false
            getFristOrderTime() // 首次下单时间
            getDefective() // 次品率和最近采购时间
            getInventoryNum() // 获取库存信息
            getDiputesRate()// 纠纷率
            getCountCustomerCount()// 客户数量
        })

        // request-变体列表-首次下单时间
        function getFristOrderTime(){
            var params = {
                pid:$routeParams.id
            }
            erp.postFun(API.getFristOderTime,JSON.stringify(params),function(data){
                if(data.data.code!='200') return false
                var result = data.data.data
                assignStanVariantInfo(result)
                console.log('变体-首次下单时间',result)

            })
        }

        // request-变体列表-纠纷率
        function getDiputesRate(){
            var params = {
                pid:$routeParams.id
            }
            erp.postFun(API.getDiputesRate,JSON.stringify(params),function(data){
                if(data.data.code!='200') return false
                var result = data.data.data
                assignStanVariantInfo(result)
                console.log('变体-纠纷率',result)

            })
        }

        // request-变体列表-次品率和最近采购时间
        function getDefective(){
            var params = {
                pid:$routeParams.id
            }
            erp.postFun(API.getDefective,JSON.stringify(params),function(data){
                if(data.data.code!='200') return false
                var result = data.data.data
                assignStanVariantInfo(result)
                console.log('变体-次品率和最近采购时间',result)
            })
        }

        // request-变体列表-客户数量
        function getCountCustomerCount(){
            var params = {
                pid:$routeParams.id
            }
            erp.postFun(API.getCountCustomerCount,JSON.stringify(params),function(data){
                if(data.data.code!='200') return false
                var result = data.data.data
                assignStanVariantInfo(result,'customerNum')
                console.log('变体-客户数量',result)
            })
        }

        // request-变体列表-仓库库存
        function getInventoryNum(){
            var params = {
                pid:$routeParams.id
            }
            erp.postFun(API.getInventoryNum,JSON.stringify(params),function(data){
                if(data.data.code!='200') return false
                var result = data.data.data
                assignStanVariantInfo(result)
                console.log('变体-库存信息',result)
            })
        }

        // 组合变体信息
        function assignStanVariantInfo(arr,key){
            var variants = $scope.detail.stanProducts
            
            if(typeof arr == 'object'){
                console.log('object assign')
                var _key = typeof key == 'string'?key:'inventoryNumArr'
                for(var i=0;i<variants.length;i++){
                    if(arr.hasOwnProperty(variants[i].id)){
                        var obj = {}
                        if(_key=='inventoryNumArr') obj = {inventoryNumArr:arr[variants[i].id]}
                        if(_key=='customerNum') obj = {customerNum:arr[variants[i].id]}
                        variants[i] = Object.assign($scope.detail.stanProducts[i],obj)
                    }
                }
            }
            
            if(arr instanceof Array){
                console.log('array assign')
                for(var i=0;i<variants.length;i++){
                    for(var j=0;j<arr.length;j++){
                        if(arr[j].vid==variants[i].id){
                            variants[i] = Object.assign($scope.detail.stanProducts[i],arr[j])
                            break
                        }
                    }
                }
            }
            $scope.detail.stanProducts = variants
            console.log('变体发生改变',$scope.detail.stanProducts)
        }

        // 获取商品类型
        $scope.getProductType = function(){// 0 代发商品 1 服务商品 3 包装商品 4 供应商商品
            var type = $routeParams.type || ''
            switch(type){
                case '0':
                    return '代发商品'
                case '1':
                    return '服务商品'
                case '3':
                    return '包装商品'
                case '4':
                    return '供应商商品'
                default:
                    return ''
            }
        }

        // 视频滚动swiper
        var swiper = new Swiper('.swiper-container', {
                observer: true, //修改swiper自己或子元素时，自动初始化swiper
                observeParents: true,
                pagination: '.swiper-pagination',
                paginationClickable: true
            });

    }]);
    
    // 变体分析详情
    app.controller('merchandiseCtrlDetailShowVariantNew', ['$scope', '$window', '$location', '$compile', '$routeParams', '$timeout', '$http', 'erp', 'merchan', '$sce', function ($scope, $window, $location, $compile, $routeParams, $timeout, $http, erp, merchan, $sce) {
        // $routeParams

        $scope.productId = $routeParams.pid // 商品id
        $scope.variantId = $routeParams.vid // 变体id
        $scope.productFlag = $routeParams.flag //
        $scope.productStatus = $routeParams.status // 商品状态
        $scope.productType = $routeParams.type// 商品类型 0

        var API = {
            getDetail:'product/selectStanDetails',// 变体详情
            getPurchasingDifficulty:'product/getProductProcurementScore',// 商品采购难度
            getPurchaseCount:'product/procurement/getProcurementNumByVariant',// 商品采购次数
            getIndexShowCount:'product/display/getProductDisplayById',// 首页展示次数
            getPushCount:'product/published/statistics/getAppPushCount',// 商品推送次数
        }

        $scope.detail = {} // 变体详情
        function getDetail(){
            var params = {
                vid:$scope.variantId
            }
            layer.load(2)
            erp.postFun(API.getDetail,JSON.stringify(params),function(data){
                layer.closeAll('loading')
                if(data.data.code!='200') return layer.msg('服务器打盹了，请稍后再试')
                var result = data.data.data
                $scope.detail = result
                console.log('变体详情',$scope.detail)
            })
        }
        getDetail()

        // 获取商品类型
        $scope.getProductType = function(){// 0 代发商品 1 服务商品 3 包装商品 4 供应商商品
            var type = $scope.detail.producttype || ''
            switch(type){
                case '0':
                    return '代发商品'
                case '1':
                    return '服务商品'
                case '3':
                    return '包装商品'
                case '4':
                    return '供应商商品'
                default:
                    return ''
            }
        }

        // request-商品采购难度
        $scope.purchasingDifficulty={
            score:'0',// 链接数
            buyTimeAvg:'0',// 平均到货周期
            linkCount:'0'// 采购难度分
        }
        function getPurchasingDifficultyData(){
            var params = {
                pid:$routeParams.pid
            }
            erp.postFun(API.getPurchasingDifficulty,JSON.stringify(params),function(data){
                if(data.data.code!='200') return false
                var result = data.data.data
                $scope.purchasingDifficulty = result
                console.log('采购难度',$scope.purchasingDifficulty)
            })
        }
        getPurchasingDifficultyData()
        // 格式化采购难度
        $scope.formatPurchasing = function(val){
            if(val<=0) return '0'
            if(val>=100) return '100'
            return val
        }

        // request-商品采购次数
        $scope.purchaseCount = 0
        function getPurchaseCount(){
            var params = {
                pid:$routeParams.pid,
                vid:$routeParams.vid
            }
            erp.postFun(API.getPurchaseCount,JSON.stringify(params),function(data){
                if(data.data.code != '200') return false
                var result = data.data.data
                $scope.purchaseCount = result.purchaseNum
                console.log('采购次数',result)
            })
        }
        getPurchaseCount()

        // request-商品首页展示次数
        $scope.IndexShowCount = 0
        function getIndexShowCount(){
            var params = {
                pid:$routeParams.pid
            }
            erp.postFun(API.getIndexShowCount,JSON.stringify(params),function(data){
                if(data.data.code!='200') return false
                var result = data.data.data
                $scope.IndexShowCount = result
                console.log('首页展示次数',result)
            })
        }
        getIndexShowCount()

        // request-商品推送次数
        $scope.pushCount = 0
        function getAppPushCount(){
            var params = {
                pid:$routeParams.pid
            }
            erp.postFun(API.getPushCount,JSON.stringify(params),function(data){
                if(data.data.code != '200') return false
                var result = data.data.data
                $scope.pushCount = result
                console.log('推送次数',result)
            })
        }
        getAppPushCount()

    }])

})(angular)
