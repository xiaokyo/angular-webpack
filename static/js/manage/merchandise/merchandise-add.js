(function (angular) {

    var app = angular.module('merchandise');

    app.directive('imageonload', function () {
        return {
            restrict: 'A', link: function (scope, element, attrs) {
                element.bind('load', function () {
                    //call the function that was passed
                    scope.$apply(attrs.imageonload);
                });
            }
        };
    })

    var chineseReqG = /[\u4E00-\u9FA5]/g;
    // const specialChacReqG = /[-`!@#\$\^&\*\(\)=\|\{\}':;,\[\]<>\?！￥……\／\\～《》（）——【】‘；：”“。，、？~]/g;
    // var legalVariableReg = /^[a-zA-Z0-9]*((?<=[a-zA-Z0-9])\s[a-zA-Z0-9]*)*[a-zA-Z0-9]$/g;
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

    app.controller('merchandiseCtrlAddSKU1', ['$scope', '$window', '$location', '$compile', '$routeParams', '$timeout', '$interval', '$http', 'erp', 'merchan', function ($scope, $window, $location, $compile, $routeParams, $timeout, $interval, $http, erp, merchan) {
        console.log('商品类目选择')
        // 参数过来的id
        $scope.addMerchId = $routeParams.id || '';
        $scope.selectedCategoryId = $routeParams.cateId || '';
        $scope.merchType = $routeParams.mType;
        $scope.isFromFwFlag = $routeParams.fwType || '';
        $scope.userId = $routeParams.userId || '';
        $scope.listItemId = $routeParams.itemId || '';
        if ($scope.selectedCategoryId) {
            merchan.getCateNameByCateId($scope.selectedCategoryId, function (result) {
                $('#show-selected-category').html(result[0].nameEn + ' / ' + result[1].nameEn + ' / ' + result[2].nameEn);
            });
        }
        if ($scope.addMerchId.indexOf('inquiry=') != -1) {
            $scope.addInquiryId = $scope.addMerchId.replace('inquiry=', '') || '';
        }
        if ($scope.addMerchId.indexOf('cjsource=') != -1) {
            $scope.addCJsourceId = $scope.addMerchId.replace('cjsource=', '') || '';
        }
        if ($scope.addMerchId.indexOf('source=') != -1) {
            $scope.addSourceId = $scope.addMerchId
        }
        if ($scope.addMerchId.indexOf('orderproduct=') != -1) {
            $scope.orderproduct = $scope.addMerchId;
        }
        if ($scope.addMerchId.indexOf('taskid=') != -1) {
            $scope.taskId = $scope.addMerchId;
        }
        if ($scope.addMerchId.indexOf('personalize=') != -1) {
            $scope.personalizeId = $scope.addMerchId;
        }
        // 获取商品目录列表
        $scope.categoryListOne = [];
        $scope.categoryListTwo = [];
        $scope.categoryListThird = [];
        $scope.searchCategoryRes = [];
        // 获取商品目录列表
        merchan.getCateListOne(function (data) {
             console.log(data);
            $scope.categoryListOne = data;
        });

        // 从列表选中商品类目
        $scope.selectCategory = function ($event, id) {
            var thirdMenu = $($event.target).siblings('span').html();
            var secondMenu = $($event.target).parent().parent().siblings('span').html();
            var firstMenu = $($event.target).parent().parent().parent().parent().siblings('span').html();
            // $scope.selectedGoodsCategory = firstMenu + '/' + secondMenu + '/' + secondMenu;
            $('#show-selected-category').html(firstMenu + ' / ' + secondMenu + ' / ' + thirdMenu);
            layer.msg('已选择：' + firstMenu + ' / ' + secondMenu + ' / ' + thirdMenu);
            $scope.selectedCategoryId = id;
            $("html,body").animate({scrollTop: $(".footer-btns").offset().top}, 500);
        }
        // 搜索商品类目部分交互
        $scope.hasSearchCateRes = false;
        $scope.NoSearchCateRes = false;
        $scope.serchCategory = function (searchstr) {
            if (searchstr) {
                erp.postFun('app/product/findCategoryByInput', JSON.stringify({inputStr: searchstr}), function (data) {
                    var data = data.data;
                    if (data.statusCode != 200) {
                        layer.msg('服务器错误');
                        $scope.hasSearchCateRes = false;
                        $scope.NoSearchCateRes = true;
                        return false;
                    }
                    $scope.searchCategoryRes = JSON.parse(data.result);
                    if ($scope.searchCategoryRes.length > 0) {
                        $scope.hasSearchCateRes = true;
                        $scope.NoSearchCateRes = false;
                    } else {
                        $scope.hasSearchCateRes = false;
                        $scope.NoSearchCateRes = true;
                    }

                }, function () {
                    layer.msg('网络错误');
                });
            } else {
                $scope.searchCategoryRes = [];
                $scope.hasSearchCateRes = false;
                $scope.NoSearchCateRes = false;
            }
        }
        $scope.hideSearchCateRes = function () {
            $scope.searchCategoryVal = '';
            $scope.hasSearchCateRes = false;
            $scope.NoSearchCateRes = false;
        }
        $scope.stopPropagation = function (e) {
            e.stopPropagation();
        }

        // 从搜索框选中商品类目
        $scope.selectSearchCate = function (id) {
            merchan.getCateNameByCateId(id, function (result) {
                $('#show-selected-category').html(result[0].nameEn + ' / ' + result[1].nameEn + ' / ' + result[2].nameEn);
                layer.msg('已选择: ' + result[0].nameEn + ' / ' + result[1].nameEn + ' / ' + result[2].nameEn);
                $scope.selectedCategoryId = id;
                $("html,body").animate({scrollTop: $(".footer-btns").offset().top}, 500);
                $scope.searchCategoryVal = '';
                $scope.hasSearchCateRes = false;
                $scope.NoSearchCateRes = false;
            });
        }
        // 跳转到录入产品界面
        $scope.goAddMerchanTwo = function () {
            if ($scope.selectedCategoryId) {
                if ($scope.addInquiryId) {
                    $location.path("/merchandise/addSKU2/inquiry=" + $scope.addInquiryId + '/' + $scope.selectedCategoryId + '/' + $scope.merchType);
                } else if ($scope.addCJsourceId) {
                    $location.path("/merchandise/addSKU2/" + $scope.addMerchId + '/' + $scope.selectedCategoryId + '/' + $scope.merchType);
                } else if ($scope.addSourceId) {
                    $location.path("/merchandise/addSKU2/" + $scope.addMerchId + '/' + $scope.selectedCategoryId + '/' + $scope.merchType);
                } else if ($scope.orderproduct) {
                    $location.path("/merchandise/addSKU2/" + $scope.addMerchId + '/' + $scope.selectedCategoryId + '/' + $scope.merchType);
                } else if ($scope.taskId) {
                    $location.path("/merchandise/addSKU2/" + $scope.addMerchId + '/' + $scope.selectedCategoryId + '/' + $scope.merchType);
                } else if ($scope.personalizeId) {
                    $location.path("/merchandise/addSKU2/" + $scope.addMerchId + '/' + $scope.selectedCategoryId + '/' + $scope.merchType);
                } else if($scope.isFromFwFlag){//服务商品跳过来
                    $location.path("/merchandise/addSKU2" + '//' + $scope.selectedCategoryId + '/' + $scope.merchType + '/' + $scope.isFromFwFlag + '/'+$scope.userId+'/'+$scope.listItemId);
                }
                else {
                    $location.path("/merchandise/addSKU2" + '//' + $scope.selectedCategoryId + '/' + $scope.merchType);
                }

            } else {
                layer.msg('请选择商品类目');
            }
        }
        $scope.cancelAdd = function () {
            console.log(document.referer)
            window.history.go(-1);
            //location.href = 'manage.html#/merchandise';
        }

    }]);

    app.controller('merchandiseCtrlAddSKU2', ['$scope', '$window', '$location', '$compile', '$routeParams', '$timeout', '$interval', '$http', 'erp', 'merchan', '$sce','utils', function ($scope, $window, $location, $compile, $routeParams, $timeout, $interval, $http, erp, merchan, $sce,utils) {
        console.log('录入服务商品')
        var bs = new Base64();
        var userId = localStorage.getItem('erpuserId') == null ? '' : bs.decode(localStorage.getItem('erpuserId'));
        var token = '';
        var userName = localStorage.getItem('erpname') == null ? '' : bs.decode(localStorage.getItem('erpname'));
        var token = localStorage.getItem('erptoken') == null ? '' : bs.decode(localStorage.getItem('erptoken'));
        var operate = 'ADD';
        $scope.setNum=1;
        $scope.isFromFwFlag = $routeParams.fwType || '';
        $scope.userId = $routeParams.userId || '';
        $scope.listItemId = $routeParams.itemId || '';
        $scope.isAdminLogin = erp.isAdminLogin();
        console.log($scope.isAdminLogin)
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

        $scope.closeSetVariantFun = function(){
            $scope.setVariantFlag=false;
            $scope.seleVariant = '';
        }
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
                    var prev=moveLine.prev();
                    if(moveLine.index()>1) {
                        moveLine.insertBefore(prev);
                        changeFlag = true;
                    }
                }
                if (moveY > 0 && Math.abs(moveY) > 60 && !changeFlag) {
                    var next=moveLine.next();
                    if(next) {
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

        // $scope.podType = '1';
        // this.podarray = 1;
        // console.log(this.podarray)

        var that = this;

        $scope.getHero = function() {
            console.log(that.podarray);
            $scope.$broadcast('to-pod', 'getdata');
            $timeout(function () {
                console.log(that.podarray);
            })
        }

        $scope.$on('pod-to-father', function (d,data) {
            console.log(data);
            if (data && data.img) {
                picIdIndex++;
                $scope.picContainer.push({
                    pid: 'pic' + picIdIndex,
                    // src: result[i]
                    src: data.img
                });
                saveImgToSession();
            }
        });

        $scope.merchType = $routeParams.mType;
        $scope.authority = {};
        if ($scope.merchType=='1') {
            // 1--服务商品
            $scope.addProType = 'service';
            $scope.authority.satus = 0;
            $scope.authorityPart = true;
            $('#authority-type').prop('checked', false);
            $('#authority-type').prop('disabled', true);
            $('#authority-type2').prop('checked', true);
            // 首选业务员-获取业务员列表
            getEmployeeList(erp, '销售', function (data) {
                $scope.salemanList = data;
            });
        } else if ($scope.merchType == '2') {
            // 2--个性商品
            $scope.addProType = 'drop';
            $scope.personalizePro = true;
            $scope.podType = '1'
            $scope.authority.satus = 1;
            $scope.authorityPart = false;
            $('#authority-type').prop('checked', true);
            $('#authority-type').prop('disabled', false);
            $('#authority-type2').prop('checked', false);
            // 首选业务员-获取业务员列表
            getEmployeeList(erp, '销售', function (data) {
                $scope.salemanList = data;
            });
            $scope.podVersion = '2';
        } else if ($scope.merchType == '3') {
            // 2--个性商品
            $scope.authority.satus = 1;
            $('#authority-type').prop('checked', true);
            $('#authority-type').prop('disabled', false);
            $('#authority-type2').prop('checked', false);
            $scope.personalizePro = true;
            $scope.addProType = 'package';
            $scope.podVersion = '2';
        } else {
            $scope.merchType == '0';
            // 0或者null--普通代发商品
            $scope.addProType = 'drop';
            $scope.normalPro = true;
            $scope.authority.satus = 1;
            $scope.authorityPart = false;
            $('#authority-type').prop('checked', true);
            $('#authority-type').prop('disabled', false);
            $('#authority-type2').prop('checked', false);
            // 首选业务员-获取业务员列表
            getEmployeeList(erp, '销售', function (data) {
                $scope.salemanList = data;
            });
        }

        // 参数过来的id
        $scope.addMerchId = $routeParams.id || '';
        $scope.goodsCategoryId = $routeParams.cateId || '';
        if ($scope.goodsCategoryId != 'package') { // 包装商品不需要类目
            merchan.getCateNameByCateId($scope.goodsCategoryId, function (result) {
                $scope.goodsCategory = result[0].nameEn + ' / ' + result[1].nameEn + ' / ' + result[2].nameEn;
                $scope.goodsCategoryName = result[2].nameEn;
                $('#show-selected-category').html($scope.goodsCategory);
            });
            erp.postFun('app/ajax/autoSku', JSON.stringify({ cid: $scope.goodsCategoryId }), function (data) {
                var data = data.data;
                if (data.statusCode != 200) {
                    layer.msg('服务器错误');
                    return false;
                }
                $scope.addGoodsAutoSKU = data.result;
                $('.merch-varible-tbody').find('.span-SKU').html($scope.addGoodsAutoSKU);
            }, function () {
                layer.msg('网络错误');
            });
        } else {
            // 包装商品生成sku
            erp.postFun('erp/PackProduct/getPackSku', {"sku":""}, function (data) {
                var data = data.data;
                if (data.statusCode != 200) {
                    layer.msg('服务器错误');
                    return false;
                }
                $scope.addGoodsAutoSKU = data.result;
                $('.merch-varible-tbody').find('.span-SKU').html($scope.addGoodsAutoSKU);
            }, function () {
                layer.msg('网络错误');
            });
        }
        if (!$scope.goodsCategoryId) {
            $location.path('/merchandise/addSKU1///'+ $scope.merchType);
            return false;
        }
        

        $scope.picContainer1688 = [];
        $scope.pic1688Loading = [];
        $scope.getFrom1688 = function () {
            if (!$scope.link1688) {
                layer.msg('请输入1688商品链接');
                return;
            }
            if (!$scope.addGoodsAutoSKU || !$scope.goodsCategoryName || !$scope.storages) {
                layer.msg('正在请求数据，请稍后再试');
                return;
            }
            layer.load(2);
            // 'pojo/product/importProductFromAli'
            erp.postFun('caigou/alProduct/getAlProduct', JSON.stringify({
                url: $scope.link1688,
                sku: $scope.addGoodsAutoSKU,
                categoryId: $scope.goodsCategoryId,
                category: $scope.goodsCategoryName
            }), function (data) {
                layer.closeAll('loading');
                var data = data.data;
                if (data.statusCode != 200) {
                    layer.msg('读取商品信息失败');
                    return false;
                }
                $scope.good1688Info = data.result.product[0];
                $scope.merchBuyLinks.push({
                    name: $scope.link1688,
                    star: 5,
                    beiZhu: ''
                });
                render1688ToPage();
            });
        }
        $scope.numberInput = function(type){
            if(type='setNum'){
                $scope.setNum = $scope.setNum.replace(/[^\d]/g,'');
            }
        }
        function render1688ToPage () {
            console.log($scope.good1688Info);
            $scope.merchanName = $scope.good1688Info.nameEn;
            $scope.editor.txt.html($scope.good1688Info.description);
            $scope.img1688 = $scope.good1688Info.img.split(',');
            // 标记
            for (var i = 0; i < $scope.img1688.length; i++) {
                autoUploadImg($scope.img1688[i]);
            }
            // 标记
            $scope.pic1688Loading = JSON.parse(JSON.stringify($scope.img1688));
            $scope.varibleAtrrs = [];
            if ($scope.good1688Info.variantKey) {
                var temArr = $scope.good1688Info.variantKey.split('-');
                var temArrEn = $scope.good1688Info.variantKeyEn == undefined ? [] : $scope.good1688Info.variantKeyEn.split('-');
                for (var i = 0; i < temArr.length; i++) {
                    if (temArrEn[i]) {
                        $scope.varibleAtrrs.push({
                            name: temArr[i],
                            nameEn: temArrEn[i]
                        })
                    }
                }
            }
            merchan.renderVarible($('#varible-new'), $('.merch-varible-tbody'), $scope);
            merchan.renderStorage($scope.storages, $('#batch-select'), $('#storage-name'), $('.storage-con'), $scope);
            for (var i = 0; i < $scope.good1688Info.stanProducts.length; i++) {
                $scope.good1688Info.stanProducts[i].sellPrice = ($scope.good1688Info.stanProducts[i].sellPrice * 1).toFixed(2);
            }
            for (var i = 0; i < $scope.good1688Info.stanProducts.length - 1; i++) {
                varibleLineIndex++;
                merchan.addVaribleLine(varibleLineIndex, $('.merch-varible-box'), $scope);
            }
            if ($scope.good1688Info.supplierLink) {
                $scope.merchBuyLinks.push({
                    name: $scope.good1688Info.supplierLink,
                    star: 5,
                    beiZhu: ''
                });
            }
            
            // 获取到仓库信息后渲染变体信息
            merchan.renderVariantToPage($scope, $scope.good1688Info.stanProducts);
        }

        if ($scope.addMerchId.indexOf('inquiry=') != -1) {
            $scope.addInquiryId = $scope.addMerchId.replace('inquiry=', '') || '';
        } else if ($scope.addMerchId.indexOf('cjsource=') != -1) {
            $scope.addCJsourceId = $scope.addMerchId.replace('cjsource=', '') || '';
        } else if ($scope.addMerchId.indexOf('source=') != -1) {
            $scope.addSourceId = $scope.addMerchId;
        } else if ($scope.addMerchId.indexOf('orderproduct=') != -1) {
            $scope.orderproduct = $scope.addMerchId;
            console.log($scope.orderproduct)
        } else if ($scope.addMerchId.indexOf('taskid=') != -1) {
            $scope.taskId = $scope.addMerchId;
            console.log($scope.taskId);
        } else if ($scope.addMerchId.indexOf('personalize=') != -1) {
            $scope.personalizeId = $scope.addMerchId;
            console.log($scope.personalizeId);
        }
        
        $scope.reChoseCate = function () {
            if ($scope.addInquiryId) {
                location.href = 'manage.html#/merchandise/addSKU1/inquiry=' + $scope.addInquiryId + '/' + $scope.goodsCategoryId+'/'+$scope.merchType;
            } else if ($scope.addCJsourceId) {
                location.href = 'manage.html#/merchandise/addSKU1/' + $scope.addMerchId + '/' + $scope.goodsCategoryId+'/'+$scope.merchType;
            } else if ($scope.addSourceId) {
                location.href = 'manage.html#/merchandise/addSKU1/' + $scope.addMerchId + '/' + $scope.goodsCategoryId+'/'+$scope.merchType;
            } else if ($scope.orderproduct) {
                location.href = 'manage.html#/merchandise/addSKU1/' + $scope.addMerchId + '/' + $scope.goodsCategoryId+'/'+$scope.merchType;
            } else if ($scope.taskId) {
                location.href = 'manage.html#/merchandise/addSKU1/' + $scope.addMerchId + '/' + $scope.goodsCategoryId+'/'+$scope.merchType;
            } else if ($scope.personalizeId) {
                location.href = 'manage.html#/merchandise/addSKU1/' + $scope.addMerchId + '/' + $scope.goodsCategoryId+'/'+$scope.merchType;
            } else {
                location.href = 'manage.html#/merchandise/addSKU1' + '//' + $scope.goodsCategoryId+'/'+$scope.merchType;
            }
        }

        if ($scope.orderproduct) {
            var orderproductId = $scope.orderproduct.replace('orderproduct=','');
            $scope.$watch('addGoodsAutoSKU', function (now, old) {
                if (now == old) return;
                if (now) {
                    erp.postFun('app/externalPurchase/importProductForPayOrder', JSON.stringify({
                        orderId: orderproductId,
                        sku: $scope.addGoodsAutoSKU,
                        categoryId: $scope.goodsCategoryId,
                        category: $scope.goodsCategoryName
                    }),function (data) {
                        console.log(data.data);
                        if (data.data.statusCode == 200) {
                            $scope.good1688Info = JSON.parse(data.data.result).product[0];
                            render1688ToPage();
                        }
                        
                    });
                }
            });
        }

        // 商品名称
        $scope.merchanName = '';
        $scope.verifyMerchName = false;
        $scope.forbiddenChineseInp = function (merchanName) {
            $scope.merchanName = merchanName.replace(chineseReqG, '');
        }

        // 商品描述 富文本编辑器用户输入值
        $scope.editor = new window.wangEditor('#wang-editor');

        $scope.editor.customConfig.uploadImgServer = 'https://erp.cjdropshipping.com/app/ajax/upload';
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
        // 将 timeout 时间改为 30s
        $scope.editor.customConfig.uploadImgTimeout = 30000;
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
        $scope.editorContent = '';
        $scope.verifyMerchDesc = false;

        var editor2 = new window.wangEditor('#wang-editor-2');
        editor2.customConfig.uploadImgServer = 'https://erp.cjdropshipping.com/app/ajax/upload';
        editor2.customConfig.uploadFileName = 'file';
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
        // 将 timeout 时间改为 30s
        editor2.customConfig.uploadImgTimeout = 30000;
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
        $scope.editorContent2 = '';

        // 商品图片
        var nowTime = new Date().getTime();
        var lastAddImgTime = sessionStorage.getItem('lastAddImgTime');
        if (lastAddImgTime && nowTime - lastAddImgTime < 1800000 && sessionStorage.getItem('addMerchImgs')) {
            $scope.picContainer = JSON.parse(sessionStorage.getItem('addMerchImgs'));
            console.log($scope.picContainer)
        } else {
            $scope.picContainer = [];
            // 书签
            sessionStorage.removeItem('addMerchImgs');
            sessionStorage.removeItem('lastAddImgTime');
        }
        $scope.verifyMerchPic = false;

        /** 拖拽成功触发方法
         *   index 拖拽后落下时的元素的序号（下标）
         *   obj 被拖动数据对象
         */
        $scope.dropComplete = function (index, obj) {
            var idx = $scope.picContainer.indexOf(obj);
            $scope.picContainer[idx] = $scope.picContainer[index];
            $scope.picContainer[index] = obj;
            // console.log($scope.picContainer[0]);
        };
        // 添加图片
	      $scope.handleUploadImg = () =>{
		      //document.getElementById('upload-img').click()
	      }
        
        var picIdIndex = 0;
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
			        saveImgToSession();
		        }
		        console.log($scope.picContainer);
		        $scope.$apply();
	        });
        }

        function saveImgToSession() {
            sessionStorage.setItem('addMerchImgs', JSON.stringify($scope.picContainer));
            sessionStorage.setItem('lastAddImgTime', new Date().getTime());
        }

        $scope.deletePic = function (pid) {
            layer.confirm('确认删除图片?', {icon: 3, title: '提示'}, function (index) {
                //do something
                var deleteIndex = erp.findIndexByKey($scope.picContainer, 'pid', pid);
                $('.merch-varible-tbody .merch-variable-pic').each(function () {
                    if ($(this).attr('src') == $scope.picContainer[deleteIndex].src) {
                        $(this).attr('src', '#');
                    }
                });
                $scope.picContainer.splice(deleteIndex, 1);
                saveImgToSession();
                layer.close(index);
                $scope.$apply();
            });

        }
        $scope.previewPic = function ($event) {
            var picSrc = $($event.target).parent().parent().parent().find('img').attr('src');
            merchan.previewPic(picSrc);
        }

        function autoUploadImg(img) {
            erp.getFun('app/ajax/imgUrl?inputUrl=' + img, function (data) {
                layer.closeAll('loading');
                var data = data.data;
                $scope.pic1688Loading.splice($scope.pic1688Loading.indexOf(img), 1);
                if (data.statusCode != 200) {
                    $scope.picContainer1688.push(img);
                } else {
                    picIdIndex++;
                    $scope.mannualRefresh({
                        pid: 'pic' + picIdIndex,
                        // src: data
                        src: 'https://' + data.result
                    });
                }
            }, function (err) {
                $scope.pic1688Loading.splice($scope.pic1688Loading.indexOf(img), 1);
                $scope.picContainer1688.push(img);
            });
        }

        $scope.delete1688Img = function ($index) {
            // $scope.delete1688Index = index;
            layer.confirm('确认删除图片?', {icon: 3, title: '提示'}, function (index) {
                //do something
                $scope.picContainer1688.splice($index, 1);
                layer.close(index);
                $scope.$apply();
            });
        }

        $scope.saveAsErpImg = function ($index) {
            layer.load(2);
            erp.getFun('app/ajax/imgUrl?inputUrl=' + $scope.picContainer1688[$index], function (data) {
                layer.closeAll('loading');
                var data = data.data;
                if (data.statusCode != 200) {
                    layer.msg(data.message);
                } else {
                    $scope.picContainer1688.splice($index, 1);
                    picIdIndex++;
                    $scope.mannualRefresh({
                        pid: 'pic' + picIdIndex,
                        // src: data
                        src: 'https://' + data.result
                    });
                }
            });
        }
        $scope.mannualRefresh = function (newpic) {
            // picIdIndex++;
            $scope.picContainer.push(newpic);
            saveImgToSession();
        }
        $scope.addPic = function () {
            merchan.addUrlPic(function (data) {
                picIdIndex++;
                $scope.mannualRefresh({
                    pid: 'pic' + picIdIndex,
                    // src: data
                    src: 'https://' + data
                });
            });
        }

        // 变量部分
        $scope.varibles = [];
        $scope.verifyVeribleRes = false;
        $scope.varibleAtrrs = [];
        $scope.merchanUnit = 'unit(s)';

        $scope.storages = [];
        $scope.inventory = {};
        // merchan.getAndRenderStorage($('#batch-select'), $('#storage-name'), $('.storage-con'), $scope)
        merchan.getStorage(function (data) {
            // 渲染变量值到页面上
            // $('.varible-new')
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
                $scope.inventory[data[i].id] = 0;
            }
        });

        // 实时显示每个变量对应的sku
        $('.merch-varible-box').on('input', '.edit-new', function () {
            var val = $(this).val();
            if (val) {
                $(this).val(val.replace(/\s{2,}/g,' '));
            }
            if (chineseReqG.test(val)) {
                layer.msg('变量值不能输入中文字符');
                $(this).val(val.replace(chineseReqG, ''));
            }
            var currentVaribleId = $(this).parent().parent().parent().attr('id');
            var varibleNewArr = [];
            $('#' + currentVaribleId).find('.varible-new input').each(function () {
                if (val.trim()) {
                    varibleNewArr.push(val);
                }
            });
            merchan.showChildSKU(currentVaribleId, $scope);
        });
        // 渲染变量值到页面上
        // 批量设置变量
        $scope.banchSetAttr = function (key) {
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
        $scope.removeVaribleTr = function ($event) {
            if ($('.merch-varible-tbody').length == 1) {
                layer.msg('请至少保留一个变体');
                return;
            }
            var targetElement = $event.target;
            var $removeLine = $(targetElement).parent().parent().parent();
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

        // 获取页面已填的变体信息
        function getWriteVar() {
            var tempVaribleObj = {};
            $('.merch-varible-thead').find('.li-new').each(function () {
                tempVaribleObj[$(this).attr('name')] = [];
            })
            $('.merch-varible-tbody').each(function () {
                $(this).find('.edit-new').each(function () {
                    tempVaribleObj[$(this).attr('name')].push($(this).val());
                });
            });
            return tempVaribleObj;
        }

        // 编辑变量弹框
        var tempVaribleObj;
        $scope.editVarible = function () {
            $scope.varibleAtrrsTem = JSON.parse(JSON.stringify($scope.varibleAtrrs));
            $scope.variantBigTem = JSON.parse(JSON.stringify(variantBig));
            tempVaribleObj = getWriteVar();
            $scope.setVariantFlag = true;
        }
        $scope.varibleAtrrsTem = [];
        $scope.variantBigTem = [];
        var variantBig = [];
        $scope.seleVariant = '';
        $scope.choseVariant = function () {
            if ($scope.seleVariant == '') {
                return;
            }
            var selectVarible = $scope.seleVariant.split('-');
            if (selectVarible) {
                if (selectVarible == 'customize') {
                    $scope.addCustomize = true;
                    return;
                }
                $scope.addCustomize = false;
                // $.inArray(selectVarible, tempVaribleAtrrs)
                if ($scope.varibleAtrrsTem && $scope.varibleAtrrsTem.length > 0 && erp.findIndexByKey($scope.varibleAtrrsTem, 'name', selectVarible[0]) != -1) {
                    layer.msg('该变量已存在');
                    $scope.seleVariant = '';
                    return false;
                } else if ($scope.varibleAtrrsTem && $scope.varibleAtrrsTem.length >= 3) {
                    layer.msg('变量不能超过3个');
                    $scope.seleVariant = '';
                    return false;
                  } else {
                    $scope.varibleAtrrsTem.push({
                        name: selectVarible[0],
                        nameEn: selectVarible[1]
                    });
                    $scope.variantBigTem.push({
                        name: selectVarible[0],
                        nameEn: selectVarible[1],
                        newAddSet: [],
                        defaultSet: $scope[selectVarible[1] + 'Set'] || [],
                        banOpeArr: []
                    })
                    // console.log($scope.varibleAtrrsTem);
                }
            }

        }
        $scope.addCustomizeVal = function () {
            if (!$scope.customizeName) {
                layer.msg('请输入自定义变量中文名');
                return;
            }
            if (!$scope.customizeNameEn) {
                layer.msg('请输入自定义变量英文名');
                return;
            }
            if ($scope.varibleAtrrsTem && $scope.varibleAtrrsTem.length > 0 && erp.findIndexByKey($scope.varibleAtrrsTem, 'name', $scope.customizeName) != -1) {
                layer.msg('该变量已存在');
                return;
            } else if ($scope.varibleAtrrsTem && $scope.varibleAtrrsTem.length >= 3) {
                layer.msg('变量不能超过3个');
                return;
            } else {
                if ($scope.personalizePro && $scope.varibleAtrrsTem.length >= 2) {
                    // pod-v1 只能两个变量
                    layer.msg('当前版本POD不能超过两个变量')
                    return
                }
                $scope.customizeNameEn = $scope.customizeNameEn.replace(/(^\s*)|(\s*$)/g, "");
                $scope.customizeNameEn = $scope.customizeNameEn.substring(0, 1).toUpperCase() + $scope.customizeNameEn.substring(1);
                $scope.varibleAtrrsTem.push({
                    name: $scope.customizeName,
                    nameEn: $scope.customizeNameEn
                });
                $scope.variantBigTem.push({
                    name: $scope.customizeName,
                    nameEn: $scope.customizeNameEn,
                    newAddSet: [],
                    defaultSet: $scope[$scope.customizeNameEn + 'Set'] || [],
                    banOpeArr: []
                })
                // renderShowVarible();
                // $(this).val('');
                console.log($scope.varibleAtrrsTem);
                $scope.customizeName = '';
                $scope.customizeNameEn = '';
            }
        }
        $scope.removeOneVar = function (index) {
            $scope.varibleAtrrsTem.splice(index, 1);
            $scope.variantBigTem.splice(index, 1);
        }
        $scope.addVariantVal = function (item) {
            if (!item.input) return;
            var addVal = item.input.replace(/(^\s*)|(\s*$)/g, "");
            var legalVariableReg = /^[a-zA-Z0-9.]*((?<=[a-zA-Z0-9.])\s[a-zA-Z0-9.]*)*[a-zA-Z0-9.]$/g;
            const bool = legalVariableReg.test(addVal);
            if (!bool) {
                layer.msg('请不要使用特殊字符');
                return
            }
            addVal = addVal.substring(0, 1).toUpperCase() + addVal.substring(1);
            // console.log('newAdd'+item.nameEn+'Set');
            item.newAddSet.push({
                checked: true,
                name: addVal
            });
            item.banOpeArr.push(addVal);
            item.input = ''
            // addinput.val('');
        }
        $scope.checkOpeItem2 = function (e, item) {
            if (e.target.checked) {
                item.banOpeArr.push(e.target.value);
            } else {
                if (item.banOpeArr.indexOf(e.target.value) != -1) {
                    item.banOpeArr.splice(item.banOpeArr.indexOf(e.target.value), 1);
                }
            }
        }
        $scope.goSaveVariant = function () {
            $scope.varibleAtrrs = JSON.parse(JSON.stringify($scope.varibleAtrrsTem));
            variantBig = JSON.parse(JSON.stringify($scope.variantBigTem));
            merchan.renderVarible($('#varible-new'), $('.merch-varible-tbody'), $scope, tempVaribleObj);
            tempVaribleObj = null;
            if ($scope.varibleAtrrs.length == 0) return;
            if (variantBig.length == 1) {
                for (var i = 0; i < variantBig[0].banOpeArr.length; i++) {
                    varibleLineIndex++;
                    merchan.addVaribleLine(varibleLineIndex, $('.merch-varible-box'), $scope, [
                        {
                            key: variantBig[0].nameEn,
                            val: variantBig[0].banOpeArr[i]
                        }
                    ]);
                }
            }
            if (variantBig.length == 2) {
                for (var i = 0; i < variantBig[0].banOpeArr.length; i++) {
                    for (var j = 0; j < variantBig[1].banOpeArr.length; j++) {
                        varibleLineIndex++;
                        merchan.addVaribleLine(varibleLineIndex, $('.merch-varible-box'), $scope, [
                            {
                                key: variantBig[0].nameEn,
                                val: variantBig[0].banOpeArr[i]
                            },
                            {
                                key: variantBig[1].nameEn,
                                val: variantBig[1].banOpeArr[j]
                            }
                        ]);
                    }
                }
            }
            if (variantBig.length == 3) {
                for (var i = 0; i < variantBig[0].banOpeArr.length; i++) {
                    for (var j = 0; j < variantBig[1].banOpeArr.length; j++) {
                        for (var k = 0; k < variantBig[2].banOpeArr.length; k++) {
                            varibleLineIndex++;
                            merchan.addVaribleLine(varibleLineIndex, $('.merch-varible-box'), $scope, [
                                {
                                    key: variantBig[0].nameEn,
                                    val: variantBig[0].banOpeArr[i]
                                },
                                {
                                    key: variantBig[1].nameEn,
                                    val: variantBig[1].banOpeArr[j]
                                },
                                {
                                    key: variantBig[2].nameEn,
                                    val: variantBig[2].banOpeArr[k]
                                }
                            ]);
                        }
                    }
                }
            }
            $scope.setVariantFlag = false;
            if (angular.element('.merch-varible-tbody').length > 1) {
                var delFlag = true;
                angular.element('.merch-varible-tbody').eq(0).find('.edit-new').each(function () {
                    if ($(this).val()) {
                        delFlag = false;
                    }
                });
                if (delFlag) {
                    angular.element('.merch-varible-tbody')[0].remove();
                }
            }
            $scope.$broadcast('to-design-child', variantBig);
        }
        // 批量操作
        $scope.ColorSet = ['Grey', 'Light Grey', 'Dark Grey', 'Deep Grey', 'Blue', 'Light Blue', 'Navy Blue', 'Sky Blue', 'Royal Blue', 'Dark Blue', 'Peacock Blue', 'Water Blue', 'White', 'Silver', 'Antique Silver', 'Beige', 'Khaki', 'Red', 'Rose Red', 'Pink', 'Wine Red', 'Claret Red', 'Bordeaux', 'Orange Red', 'Green', 'Light Green', 'Forest Green', 'Army Green', 'Turquoise', 'Mint', 'Olive Green ', 'Camouflage', 'Yellow', 'Gold', 'Bronze', 'Antique Brass', 'Antique Gold', 'Orange', 'Purple', 'Violet', 'Dark Purple', 'Light Purple', 'Lavender', 'Brown', 'Light Brown', 'Tan', 'Coffee', 'Maroon', 'Chocolate', 'Black', 'Rose Gold', 'Apricot Color', 'Dark Red', 'Watermelon Red', 'Lemon Green', 'Naked Color', 'Turmeric'];
        $scope.ModelSet = ['iPhoneX', 'iPhone8', 'iPhone7', 'iPhone8 plus', 'iPhone7 plus', 'iPhone6 plus', 'iPhone6s plus', 'iPhone6', 'iPhone6s', 'iPhone5', 'iPhone5s', 'S9plus', 'S9', 'S8 plus', 'S8', 'S7 edge', 'S7', 'S6 edge', 'S6', 'P10plus', 'P10', 'Nova2i', 'Note8', 'Note5', 'Note4', 'Note3', 'Note 2', 'Mate9', 'Mate10pro', 'Mate10', 'Galaxy A5', 'G710', 'G600', 'G550', 'G530', 'G360', 'J330', 'J730', 'J530', 'A7', 'A5', 'J5 2017', 'J3 2017', 'J7 2017 ', 'A3 2015', 'A3 2016', 'A3 2017', 'A5 2015', 'A5 2016', 'A5 2017', 'A7 2015', 'A7 2016', 'A7 2017', 'A8 2018', 'A8 Plus 2018'];
        $scope.StyleSet = ['1','2','3','4','5','6', '7', '8', '9', '10', '11','12','13','14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40'];
        $scope.SizeSet = ['USA XXS', 'USA XS', 'USA S', 'USA M', 'USA L', 'USA XL', 'USA XXL', 'USA 3XL', 'USA 4XL', 'USA 5XL', 'USA 6XL', 'USA 7XL', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL', '7XL', '4','5','6', '7', '8', '9', '10', '11','12','13','14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45',  '46', '47', '48', '70cm', '80cm', '90cm', '100cm', '110cm', '120cm', '10cm', '11cm', '12cm', '13cm'];
        $scope.sizeSet = [
            {
                type: '美国衣服',
                childset: ['USA XXS', 'USA XS', 'USA S', 'USA M', 'USA L', 'USA XL', 'USA XXL', 'USA 3XL', 'USA 4XL', 'USA 5XL', 'USA 6XL', 'USA 7XL']
            },
            {
                type: '衣服',
                childset: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL', '7XL']
            },
            {
                type: '鞋子',
                childset: ['21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45',  '46', '47', '48']
            },
            {
                type: '小孩衣服',
                childset: ['70cm', '80cm', '90cm', '100cm', '110cm', '120cm']
            },
            {
                type: '童鞋',
                childset: ['10cm', '11cm', '12cm', '13cm']
            },
            {
                type: '戒指尺寸',
                childset: ['4','5','6', '7', '8', '9', '10', '11','12','13','14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']
            }
        ]
        $scope.QuantitySet = [];

        // 全选
        var checkNum = 0;
        $scope.checkOneLine = function () {
            checkNum = 0;
            $('.merch-varible-tbody').each(function () {
                if ($(this).find('.check-inp').prop('checked')) {
                    checkNum++;
                }
            })
            if ($('.merch-varible-tbody').length == checkNum) {
                $scope.checkAllMark = true;
            } else {
                $scope.checkAllMark = false;
            }
            console.log(checkNum);
        }
        $scope.checkAllMerch = function (flag) {
            $('.merch-varible-tbody').each(function () {
                $(this).find('.check-inp').prop('checked', flag);
            });
            flag ? (checkNum = $('.merch-varible-tbody').length) : (checkNum = 0);
        }
        // 选择变量对应图片
        $scope.choseVariblePic = function ($event) {
            var targetElement = $event.currentTarget;
            var $currentImg = $(targetElement).find('.merch-variable-pic');
            merchan.choseVariblePic(targetElement, $scope);
            // merchan.choseVariblePic($currentImg, $scope);
        }
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
                // $(targetElement).val($(targetElement).val().replace(/(^\s*)|(\s*$)/g, ""));
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
            }
            if (flag=='weight') {
                var thisLine = $(targetElement).parent().parent().parent();
                var weight = thisLine.find('.edit-pweight').val();
                var postweight = thisLine.find('.edit-postweight').val();
                if (weight && postweight && postweight * 1 <= weight * 1) {
                    layer.msg('请保证商品邮寄重量大于商品重量');
                    $(targetElement).val('');
                    disposeWeight($(targetElement), $(targetElement).attr('class').includes('edit-postweight') ? '.edit-postweight' : '.edit-pweight', true)
                    thisLine.find('.weight-tip').css('visibility','visible');
                } else {
                    thisLine.find('.weight-tip').css('visibility','hidden');
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

        // merchan.getVaribleInfo($('.merch-varible-tbody'), $scope);

        // 中文名称
        $scope.chineseName = [];
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
        $scope.customsCode = '';
        $scope.verifyCustomsCode = false;

        // 申报品名（英文）
        $scope.entryNameEn = '';
        $scope.verifyEntryName = false;

        // 申报品名（中文）
        $scope.entryName = '';
        $scope.verifyEntryNameEn = false;

        // 包装
        $scope.packing = [];
        $scope.verifyPacking = false;

        $scope.getPackingInfo = function ($event) {
        	if($scope.addProType === 'package' && $($event.target).prop('checked') && $scope.packing.length > 2){
        		$event.preventDefault()
		        layer.msg('您最多选择3个包装材质')
        		return
	        }
	        merchan.getCheckBoxInfo($event, $scope.packing);
        }

        // 属性
        $scope.property = [];
        $scope.verifyProperty = false;

        $scope.getPropertyInfo = function ($event) {
            merchan.getCheckBoxInfo($event, $scope.property);
        }

        // 材质
        $scope.material = [];
        $scope.verifyMaterial = false;

        $scope.getMaterialInfo = function ($event) {
	        merchan.getCheckBoxInfo($event, $scope.material);
        }
        
        // 采购数量区间折扣
	      $scope.discountStatus = '0'
        $scope.discountData = [
	        { name: '1', lowNum: 1, highNum: null, discount: null},
        ]
	
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
				      name: (Number(item.name) + 1).toString(),
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
        $scope.ArrivalCycle = '';
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

        // 可见用户
        // $scope.authority = {};
        // $scope.authority.satus = 1;
        // $scope.authority.authIds = [];
        $scope.verifyAuthUser = false;
        $scope.authorityUsers = [];
        // $scope.authorityPart = false;
        $scope.searchUserName = '';
        $scope.searchUserRes = [];
        $scope.hasSearchUserRes = false;
        $scope.noSearchUserRes = false;
        // $('#authority-type').prop('checked', true);
        $scope.choseAuthorityType = function (flag) {
            if (flag == 0 && $scope.addSourceId) {
                $('#authority-type').prop('checked', false);
                $('#authority-type2').prop('checked', true);
                return;
            }
            var authVal = $('#authority-type').prop('checked');
            $scope.authority.satus = authVal ? 1 : 0;
            if ($scope.authority.satus == 0) {
                $scope.authorityPart = true;
            } else {
                $scope.authorityPart = false;
                $scope.authorityUsers = [];
            }
        }
        let timer = null;
        $scope.searchByUserName = function (username) {
            if(timer!==null){
                clearTimeout(timer)
            }
            timer = setTimeout(function(){
                merchan.searchByUserName(username, $scope, userId, token)
            },300);
        }
        $scope.selectSearchUser = function (uid) {
            merchan.selectSearchUser(uid, $scope);
        }
        $scope.removeAuthUser = function (uid) {
            merchan.removeAuthUser(uid, $scope);
        }

        // 采购链接
        $scope.merchBuyLinks = [];
        $scope.verifyBuylink = false;

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

        // 对手链接
        $scope.rivalLink = [];
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
           $scope.rivalLink.splice(i,1);
        }

        // 供应商信息
        $scope.suppliers = [];
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
                $scope.suppliers[$supplierIndex].productLink = $(this).find('.supplier-plink').val();
                $scope.suppliers[$supplierIndex].supplyPrice = $(this).find('.supplier-pprice').val();
            });
            return $scope.suppliers;
        }

        // 备注信息
        $scope.remarkInfo = '';
        $scope.verifyRemarkInfo = false;

        // 操作日志
        $scope.operateLogs = [];
        $scope.operateLogs.unshift({
            operate: '商品录入',
            operator: userName,
            operateDate: {
                time: new Date()
            }
        });

        // 展示询价商品
        $scope.renderMerchInfo = function (merchInfo) {
            $scope.merchanName = merchInfo.english || '';
            for (var i = 0; i < merchInfo.stanProducts.length; i++) {
                picIdIndex++;
                $scope.picContainer.push({
                    pid: 'pic' + picIdIndex,
                    src: 'https://' + merchInfo.stanProducts[i].bigImg.replace('.400x400', '').replace('.60x60', '').replace('.32x32', '')
                });
            }
            $scope.originalMerchName = merchInfo.title;
            $scope.merchBuyLinks.push({
                name: merchInfo.href,
                star: 5
            });
        }
        $scope.isInquiryMerch = false;
        if ($scope.addInquiryId) {
            $scope.isInquiryMerch = true;
            console.log($scope.addInquiryId);
            // erp.load();
            layer.load(2);
            erp.getFun('app/locProduct/reptile?id=' + $scope.addInquiryId, function (data) {
                layer.closeAll('loading');
                var data = data.data;
                if (data.statusCode != 200) {
                    layer.msg('获取商品详情失败！');
                    return false;
                }
                $scope.merchInfo = JSON.parse(data.result).product[0];
                if (!$scope.merchInfo) {
                    layer.msg('商品不存在');
                    return;
                }
                console.log($scope.merchInfo);
                $scope.renderMerchInfo($scope.merchInfo);
            }, function () {
                layer.closeAll('loading');
                layer.msg('网络错误');
            });
        }

        if ($scope.personalizeId) {
            erp.postFun('caigou/soufeel/getSoufeelInfo', {"id":$scope.personalizeId.replace('personalize=','')},function (data) {
                console.log(data.data);
                if (data.data.statusCode == 200) {
                    var result = data.data.result;
                    $scope.merchanName = result.title || '';
                    $scope.pic1688Loading = JSON.parse(JSON.stringify(result.picList));
                    for (var i = 0; i < result.picList.length; i++) {
                        autoUploadImg(result.picList[i]);
                        // picIdIndex++;
                        // $scope.picContainer.push({
                        //     pid: 'pic' + picIdIndex,
                        //     src: result.picList[i]
                        // });
                    }
                    $scope.detailLink = result.detailLink;
                    $scope.editor.txt.html(result.Description);
                    // that.podarray = {}
                    // that.podarray.zone = {};
                    // that.podarray.zone.front = {};
                    // that.podarray.zone.front.frontShowImgSrc = result.defaultImg;
                    // that.podarray.zone.front.frontEditImgSrc = result.png;
                    // that.podarray.zone.front.podtype = 'pic';
                    erp.getFun('app/ajax/imgUrl?inputUrl=' + result.png, function (data) {
                        var data = data.data;
                        if (data.statusCode != 200) {
                            layer.msg(data.message);
                        } else {
                            $scope.$broadcast('receivedata', 'https://' + data.result);
                        }
                    });
                    // $http.get('https://erp.cjdropshipping.com/app/ajax/imgUrl?inputUrl='+result.png, {headers: {'token': '4a0b7187d510980cf46b56e64685d372'}}).then(function (data) {
                    //     var data = data.data;
                    //     if (data.statusCode != 200) {
                    //         layer.msg(data.message);
                    //     } else {
                    //         $scope.$broadcast('receivedata', 'https://' + data.result);
                    //     }
                    // }, function (backdata) {
                    
                    // });
                    
                    // $scope.originalMerchName = merchInfo.title;
                    // $scope.merchBuyLinks.push({
                    //     name: merchInfo.href,
                    //     star: 5
                    // });
                }
            });
        }



        

        $scope.hasSavedInfo = false;
        $scope.saveInfo = function () {
            // 标记
            if($scope.isFromFwFlag&&(!isEmpatyFun($scope.cnMoneyList)||!isEmpatyFun($scope.enMoneyList)||!isEmpatyFun($scope.thMoneyList)||!isEmpatyFun($scope.deMoneyList)||!isEmpatyFun($scope.inMoneyList))){
                layer.msg('请填写服务费')
                $scope.fwfSetFlag = true;
                return
            }
            console.log($scope.zhiLiuList)
            console.log($scope.cnMoneyList,$scope.thMoneyList)
            if($scope.isFromFwFlag){//服务商品的标记
                for(let i = 0,len = $scope.zhiLiuList.length;i<len;i++){
                    if($scope.zhiLiuList[i].storeId==1){
                        $scope.cnDays = $scope.zhiLiuList[i].days;
                    }else if($scope.zhiLiuList[i].storeId==2){
                        $scope.enDays = $scope.zhiLiuList[i].days;
                    }else if($scope.zhiLiuList[i].storeId==3){
                        $scope.thDays = $scope.zhiLiuList[i].days;
                    }else if($scope.zhiLiuList[i].storeId==4){
                        $scope.deDays = $scope.zhiLiuList[i].days;
                    }else if($scope.zhiLiuList[i].storeId==5){
                        $scope.inDays = $scope.zhiLiuList[i].days;
                    }
                }
            }
            console.log($scope.cnMoneyList,$scope.enMoneyList,$scope.thMoneyList)
            if (merchan.isLeagalVerify($scope)) {//$scope.addProType == 'drop' || $scope.addProType == 'service'
		            const parmas = {
			            nameEn:$scope.merchanName,
			            usname: $scope.entryNameEn,
			            zhname: $scope.entryName,
		            }
	              layer.load(2);
                erp.postFun('pojo/product/checkProdcutName', parmas, function (data) {
                    console.log(data);
	                layer.closeAll('loading');
	                if (data.data.statusCode == 200) {
                    for(let i=0;i<$scope.merchBuyLinks.length;i++){
                        $scope.merchBuyLinks[i].setNum = $scope.setNum;
                    }
                    //张文静的搜品添加商品
                    if ($scope.addSourceId) {
                        console.log('这可是搜品的添加商品', $scope.addSourceId)
                        var str = $scope.addSourceId + ''
                        // console.log('这可是搜品的添加商品',str)
                        $scope.arr = str.split('&');
                        // console.log($scope.arr)
                        var sourceid = $scope.arr[0].replace('source=', '');
                        var customerId = $scope.arr[1].replace('sourcecustomer=', '');
                        $scope.editorContent = $scope.editor.txt.html();
                        if (editor2.txt.text()) {
                            $scope.editorContent2 = editor2.txt.html();
                        }
                        $scope.addMerchanData = merchan.settleSendData($scope, userId, token, userName, operate, sourceid, customerId);
                        // console.log($scope.addMerchanData);
                        // if ($scope.hasSavedInfo) return;
                        $scope.hasSavedInfo = true;
                        layer.load(2);
                        erp.postFun('app/locProduct/addBySource', $scope.addMerchanData, function (data) {
                            layer.closeAll('loading');
                            $scope.addSuccess = true;
                            merchan.successSubmit(data, $scope);
                        }, function () {
                            layer.closeAll('loading');
                            $scope.hasSavedInfo = false;
                            for (var k in $scope.inventory) {
                                $scope.inventory[k] = 0;
                            }
                            layer.msg('网络错误');
                        });
                        return
                    } else if ($scope.addCJsourceId) { //这里是平台商品搜品
                        console.log('cj的搜品', $scope.addCJsourceId)
                        var sourceid = $scope.addCJsourceId;
                        $scope.editorContent = $scope.editor.txt.html();
                        if (editor2.txt.text()) {
                            $scope.editorContent2 = editor2.txt.html();
                        }
                        $scope.addMerchanData = merchan.settleSendData($scope, userId, token, userName, operate, sourceid, '');
                        // console.log($scope.addMerchanData);
                        // if ($scope.hasSavedInfo) return;
                        $scope.hasSavedInfo = true;
                        layer.load(2);
                        erp.postFun('pojo/product/sourceAdd', $scope.addMerchanData, function (data) {
                            layer.closeAll('loading');
                            $scope.addSuccess = true;
                            merchan.successSubmit(data, $scope);
                        }, function () {
                            layer.closeAll('loading');
                            $scope.hasSavedInfo = false;
                            for (var k in $scope.inventory) {
                                $scope.inventory[k] = 0;
                            }
                            layer.msg('网络错误');
                        });
                        return
                    }
                    if ($scope.personalizePro) { // 个性商品录入
                        $scope.$broadcast('to-pod', 'getdata');
                        $timeout(function () {
                            $scope.editorContent = $scope.editor.txt.html();
                            if (editor2.txt.text()) {
                                $scope.editorContent2 = editor2.txt.html();
                            }
                            $scope.addMerchanData = merchan.settleSendData($scope, userId, token, userName, operate);
                            $scope.customMessage = that.podarray;
                            var addMerchanData = JSON.parse($scope.addMerchanData);
                            var odata = JSON.parse(addMerchanData.data);
                            let ovariants = JSON.parse(odata.variants);
                            if((!$scope.customMessage &&$scope.addProType != 'package')||($scope.addProType != 'package' && $scope.customMessage.length==0)){
                                layer.closeAll('loading');
                                $("html,body").animate({scrollTop:$(".merch-pics").offset().top},500);
                                layer.msg('请添加定制区域');
                                return false;
                            }else if($scope.customMessage && $scope.customMessage.length>0){
                                let backimgFlag=true;
                                let colori=10;//最多有三个变量，为10时则没有颜色变体
                                for(let i=0;i<$scope.varibleAtrrs.length;i++){
                                    if($scope.varibleAtrrs[i].nameEn == 'Color'){
                                        colori=i;
                                    }
                                }
                                let colorArr=[];
                                let variantsArr = Object.keys(ovariants);//变量列表
                                if(variantsArr[0]=='default' || colori==10){//没有变量或没有颜色变量
                                    colorArr=[];
                                }else{
                                    let variantsArrL=variantsArr.length;
                                    for(let i=0;i<variantsArrL;i++){
                                        if(colori==0 && $scope.varibleAtrrs.length==1){//当前只有颜色一个变体
                                            colorArr = Object.keys(JSON.parse(odata.variants));
                                        }else{//有多个变体有颜色
                                            let newObj = variantsArr[i].split('-');
                                            colorArr.push(newObj[colori]);
                                        }
                                    }
                                }
                                let backColorArr = [];//当前添加的背景图片颜色列表
                                let newColorArr = [];//编辑变量新增的颜色列表
                                let delColorArr = [];//被删除的列表
                                for(let j=0;j<$scope.customMessage[0].backImgList.length;j++){
                                    backColorArr.push($scope.customMessage[0].backImgList[j].color);
                                }
                                for(let i=0;i<colorArr.length;i++){
                                    if(backColorArr.indexOf(colorArr[i])==-1 && newColorArr.indexOf(colorArr[i])==-1){
                                        newColorArr.push(colorArr[i]);
                                    }
                                }
                                for(let i=0;i<backColorArr.length;i++){
                                    if(colorArr.indexOf(backColorArr[i])==-1){
                                        delColorArr.push(backColorArr[i]);
                                    }
                                }
                                console.log('newColorArr===='+newColorArr)
                                console.log('delColorArr===='+delColorArr)
                                if(newColorArr.length>0 ||delColorArr.length>0){
                                    for(let i=0;i<$scope.customMessage.length;i++){
                                        for(let j=0;j<newColorArr.length;j++){
                                            let newObj ={
                                                color:newColorArr[j],
                                                imgsrc:""
                                            }
                                            $scope.customMessage[i].backImgList.push(newObj);
                                        }
                                        for(let j=0;j<delColorArr.length;j++){
                                            for(let k=0;k<$scope.customMessage[i].backImgList.length;k++){
                                                if(delColorArr[j]==$scope.customMessage[i].backImgList[k].color){
                                                    $scope.customMessage[i].backImgList.splice(k,1);
                                                }
                                            }
                                        }
                                    }
                                }
                                
                                for(let i=0;i<$scope.customMessage.length;i++){
                                    let backImglen = $scope.customMessage[0].backImgList.length
                                    for(let j=0;j<backImglen;j++){
                                        if(!$scope.customMessage[i].backImgList[j].imgsrc){
                                            backimgFlag = false;
                                        }
                                    }
                                }
                                console.log($scope.customMessage)
                                if(!backimgFlag){
                                    layer.closeAll('loading');
                                    $("html,body").animate({scrollTop:$(".merch-pics").offset().top},500);
                                    layer.msg('请上传区域图片');
                                    return false;
                                }
                            }
                            
                            postFun();

                        });
                        return;
                    }
                    $scope.editorContent = $scope.editor.txt.html();
                    if (editor2.txt.text()) {
                        $scope.editorContent2 = editor2.txt.html();
                    }
                    postFun();
                  }else if(data.data.statusCode == 401){
                        layer.closeAll('loading');
                      layer.msg(data.data.message);
                  } else {
                        layer.closeAll('loading');
	                    layer.msg('商品名称包含侵权词汇' + data.data.message + '，请修改后操作');
                  }
                });
                
            }
        }
        
        // 最终提交
        function postFun(){
            $scope.addMerchanData = merchan.settleSendData($scope, userId, token, userName, operate);
            //console.log($scope.addMerchanData);
            // if ($scope.hasSavedInfo) return;
            $scope.hasSavedInfo = true;
            layer.load(2);
            var addUrl;
            if ($scope.orderproduct) {
                addUrl = 'app/externalPurchase/addPorductByPayOrder';
            } else {
                addUrl = 'app/locProduct/add';
            }
            if($scope.addProType == 'package'){
                addUrl='erp/PackProduct/addPackProductInfo'
            }
            erp.postFun(addUrl, $scope.addMerchanData, function (data) {
                layer.closeAll('loading');
                $scope.addSuccess = true;
                if($scope.addProType == 'drop' || $scope.addProType == 'service'){
                    merchan.successSubmit(data, $scope);
                }else if($scope.addProType == 'package'){
                    location.href = "manage.html#/merchandise/package/3";
                }
                
            }, function () {
                layer.closeAll('loading');
                if($scope.addProType == 'drop' || $scope.addProType == 'service'){
                    $scope.hasSavedInfo = false;
                    for (var k in $scope.inventory) {
                        $scope.inventory[k] = 0;
                    }
                }
                
                layer.msg('网络错误');
            });
        }
        $scope.cancelAdd = function () {
            history.back();
            // 清除本地缓存的图片
            sessionStorage.removeItem('addMerchImgs');
            sessionStorage.removeItem('lastAddImgTime')
        }
        //zwj 搜品平台商品
        // var zwjsourceid=$scope.addCJsourceId;
        if ($scope.addCJsourceId) {

            erp.getFun('pojo/product/getSourceById?id=' + $scope.addCJsourceId, zwjcon, function (err) {
                layer.msg('Network error, please try again later');
            });
        }
        if ($scope.addSourceId) {
            // source/sourcing/detailForErp?sourceId=
            var str = $scope.addSourceId + ''
            console.log('这可是搜品的添加商品', str)
            $scope.arr = str.split('&');
            console.log($scope.arr)
            var sourceid = $scope.arr[0].replace('source=', '');
            var customerId = $scope.arr[1].replace('sourcecustomer=', '');
            if (customerId == 'touristSourceFlag') return;
            // var customerId=$scope.arr[1].replace('sourcecustomer=','');
            // return;
            // var loadLayer = layer.open({
            //     area: ['320px', '120px'],
            //     // time:1000,
            //     title: null,
            //     closeBtn: 0,
            //     btn: [],
            //     shadeClose: false,
            //     skin: '',
            //     shade: [0.1, '#000'],
            //     content: '<div><img style="display: block; margin: 0 auto;" src="./static/image/public-img/loading-2.gif" alt="" /><p style="text-align: center; font-size: 12px; margin-top: 10px;">读取商品图片可能需要较长的时间，请耐心等待！</p></div>'
            // });
            // return;
            layer.load(2);
            erp.getFun('source/sourcing/detailForErp?sourceId=' + sourceid, zwjcon2, function (err) {
                layer.closeAll('loading');
                layer.msg('Network error, please try again later');
            });
        }

        function zwjcon(data) {
            console.log(data.data)
            var obj = JSON.parse(data.data.result)
            console.log(obj);
            $scope.picContainer = []
            $scope.merchanName = obj.nameEn;
            var arr = obj.img.split(',');
            for (var i = 0; i < arr.length; i++) {
                $scope.picContainer.push({
                    pid: 'pic' + i,
                    // src: result[i]
                    src: 'https://' + arr[i]
                });
            }
            $scope.chineseName = obj.name.split(' ');
            $('#chinese-name').find('.chinese-name-inp').each(function (i) {
                $(this).val($scope.chineseName[i])
            });
            $scope.merchBuyLinks.push({
                name: obj.href,
                star: 5
            });
        }

        function zwjcon2(data) {
            layer.closeAll('loading');
            console.log(data.data)
            var obj = JSON.parse(data.data.result).source;
            console.log(obj);
            if (obj.sourceType == 0) {
                console.log('渲染店铺搜品详情');
                $scope.merchanName = obj.productname;
                // $scope.picContainer = []
                // $scope.pic1688Loading = [];
                // $scope.img1688 = obj.img;
                // for (var i = 0; i < $scope.img1688.length; i++) {
                //     autoUploadImg($scope.img1688[i]);
                // }
                // $scope.pic1688Loading = JSON.parse(JSON.stringify($scope.img1688));
                // for (var i = 0; i < obj.img.length; i++) {
                //     // $scope.picContainer.push({
                //     //     pid: 'pic' + i,
                //     //     // src: result[i]
                //     //     src: 'https://' + obj.img[i]
                //     // });
                // }
            }
            console.log('置为指定可见')
            $scope.authority.satus = 0;
            $scope.authorityPart = true;
            $('#authority-type').prop('checked', false);
            $('#authority-type').prop('disabled', true);
            $('#authority-type2').prop('checked', true);
            for (var k in obj.autAccId) {
                obj.autAccId[k].type = 0;
                $scope.authorityUsers.push(obj.autAccId[k]);
            }
        }


        // 服务商品 服务费
        $scope.isNumFun = function (item,val) {
            val = val.replace(/[^\d.]/g,'');
            val = val.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
            val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
            item.moneys = val;
        }
        $scope.dayIsNumFun = function (item,key,val) {
            val = val.replace(/[^\d.]/g,'');
            val = val.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
            val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
            item[key] = val;
        }
        //服务费
        function fuWuFeiList () {
            erp.postFun('erp/serveProduct/moneyTypeList',{"dbProductId":'','storeTypeList':[1,2,3,4,5]},function (data) {
                if (data.data.statusCode==200) {
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
                                // itemArr.push()
                            }else if(result[i].storeType==3){
                                thArr.push(result[i])
                                thArr1.push(result[i])
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
            },function (data) {
                console.log(data)
            })

            
        }
        function getZltsFun(){
            erp.postFun('erp/serveProduct/getRetention',{
                'dbProductId': '',
                'userId': ''
            },function(data){
                console.log(data)
                if(data.data.statusCode==200){
                    if(data.data.result.length>0){
                        $scope.zhiLiuList = data.data.result;
                    }else{
                        $scope.zhiLiuList = [
                            {"id":'',"dbProductId":'',"userId":$scope.userId ,"storeId":1,"days":0,},
                            {"id":'',"dbProductId":'',"userId":$scope.userId ,"storeId":2,"days":0,},
                            {"id":'',"dbProductId":'',"userId":$scope.userId ,"storeId":3,"days":0,},
                            {"id":'',"dbProductId":'',"userId":$scope.userId ,"storeId":4,"days":0,},
                            {"id":'',"dbProductId":'',"userId":$scope.userId ,"storeId":5,"days":0,},
                        ]
                    }
                }else{
                    layer.msg(data.data.message)
                }
                
            },function(data){
                console.log(data)
            })
        }
        
        if($scope.isFromFwFlag){
            fuWuFeiList ()
            getZltsFun()
        }
        //保存
        $scope.baoCunFun = function (store) {
            var upArr = [];
            if(store=='cn'){
                upArr = $scope.cnMoneyList;
            }else{
                upArr = $scope.enMoneyList;
            }
            if(JSON.stringify(upArr)!='[]'&&!isEmpatyFun(upArr)){
                layer.msg('费用不能全部为空')
                return
            }
            for(let i = 0,len=upArr.length;i<len;i++){
                upArr[i]['dbProductId']=spId
            }
            erp.postFun('erp/serveProduct/editServeMoney',upArr,function(data){
                console.log(data)
                layer.msg(data.data.message)
                if(data.data.statusCode==200){
                    fuWuFeiList ()
                    // getZltsFun()
                }
            },function (data) {
                console.log(data)
            },{layer:true})
            // 滞留天数
            erp.postFun('erp/serveProduct/updateRetention',$scope.zhiLiuList,function(data){
                console.log(data)
                if(data.data.statusCode==200){
                    getZltsFun()
                }
            },function(data){
                console.log(data)
            })
        }
        //提交审核
        $scope.tiJiaoShFun = function(){
            console.log($scope.cnMoneyList,$scope.cnMoneyList1)
            if(arrIsEqual($scope.cnMoneyList,$scope.cnMoneyList1)){
                layer.msg('请保存中国仓的修改')
                return
            }
            if(arrIsEqual($scope.enMoneyList,$scope.enMoneyList1)){
                layer.msg('请保存美国仓的修改')
                return
            }
            if(arrIsEqual($scope.thMoneyList,$scope.thMoneyList1)){
                layer.msg('请保存泰国仓的修改')
                return
            }
            if(!isEmpatyFun($scope.cnMoneyList)){
                layer.msg('中国仓的费用不能全部为空')
                return
            }
            if(!isEmpatyFun($scope.enMoneyList)){
                layer.msg('美国仓的费用不能全部为空')
                return
            }
            if(!isEmpatyFun($scope.thMoneyList)){
                layer.msg('泰国仓的费用不能全部为空')
                return
            }
            var upJson = {};
            upJson.dbSku = fwSpSku;
            upJson.status = fuWuSpStu;
            erp.postFun('erp/serveProduct/updateServeStatus',JSON.stringify(upJson),function(data){
                console.log(data)
                layer.msg(data.data.message)
            },function(data){
                console.log(data)
            },{layer:true})
        }
        function arrIsEqual (arr1,arr2){
            for(let i = 0,len = arr1.length;i < len;i++){
                console.log(!isObjectValueEqual(arr1[i],arr2[i]))
                if(!isObjectValueEqual(arr1[i],arr2[i])){
                    return true
                }
            }
            return false;
        }
        function isObjectValueEqual(a, b) {
            var aProps = Object.getOwnPropertyNames(a);
            var bProps = Object.getOwnPropertyNames(b);
            console.log(aProps,bProps)
            for (var i = 0; i < aProps.length; i++) {
                var propName = aProps[i];
                console.log(a['moneys'],b['moneys'])
                if ((a['moneys']||b['moneys']) && a['moneys'] != b['moneys']) {
                    return false;
                }
            }
            return true;
        }
        function isEmpatyFun(arr) {
            let flag = false;
            for(let i = 0,len = arr.length;i<len;i++){
                if(arr[i].moneys>0){
                    flag = true;
                    break;
                }
                if(i==len-1){
                    flag = false;
                }
            }
            return flag;
        }

        $scope.skuCombineFlag = true;

        //--------商品视频--------------------------------------------
        //////
    }]);

})(angular)
