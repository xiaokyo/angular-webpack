(function () {
    var app = angular.module('merchandise');
    app.controller('merchandisePackageCtrl', ['$scope', 'erp', '$routeParams', 'utils', 'merchan', '$location', function ($scope, erp, $routeParams, utils, merchan, $location) {
        (function fn() {
            const { status } = $routeParams;
            if (status === '3') {//代发商品 已上架
                $scope.needOptimisation = true;
                return listOtpimisation();
            }
            setTimeout(() => { $scope.getList(); })
        }());
        function listOtpimisation() {//执行 对应的列表优化 ---  
            const clipboard = new cjUtils.Clipboard();
            clipboard.action((str) => {
                const isMatched = /^BZ/.test(str);//匹配 前切板内容是否 以 BZ开头 
                if (isMatched) {
                    $scope.topSearchVal = str;//匹配 前切板内容是否 以 BZ开头 有则 搜索 字段 改为 剪切板内容
                    $scope.getList();//获取列表 
                    $scope.needOptimisation = false;
                }
            }).catch(msg => {
                $scope.needOptimisation = true;
                console.log('clipboard action failed --->> ', msg)
            })
        }
        $scope.pageSize = '20';
        $scope.pageNum = '1';
        $scope.topSearchKey = 'SKU';
        $scope.topSearchVal = '';
        $scope.authorityStatus = '';
        $scope.status = $routeParams.status ? $routeParams.status : "3"; //3-上架；5-下架；0-回收站
        let bs = new Base64();
        $scope.loginName = localStorage.getItem('erploginName') ? bs.decode(localStorage.getItem('erploginName')) : '';
        $scope.showMoreOptFlag = ['admin', '王慧云', '杨澜', '刘燕燕'].includes($scope.loginName) 
        //进行删除、上下架等操作时传参
        let paramOption = {
            id: "",
            status: "",
            forbidReason: "",
            index: "",
        }
        $scope.getList = function (num, type) {
            console.log(num, type);
            if (type != 'yitusoutu') {
                $scope.resUrl = undefined;
            } else {
                $scope.topSearchVal = '';
            }
            $scope.needOptimisation = false;
            $scope.pageNum = num?1:$scope.pageNum;
            if ($scope.totalPage && $scope.pageNum * 1 > $scope.totalPage || $scope.pageNum==0) return;
            erp.loadPercent($('#merchan-list-all'), 400);
            $scope.packageList = [];
            erp.postFun('erp/PackProduct/getPackProductList', {
                "sku": $scope.topSearchKey == 'SKU' && type != 'yitusoutu' ? $scope.topSearchVal : "",
                "name": $scope.topSearchKey == 'CH' && type != 'yitusoutu' ? $scope.topSearchVal : "",
                "nameen": $scope.topSearchKey == 'EN' && type != 'yitusoutu' ? $scope.topSearchVal : "",
                "pageSize": $scope.pageSize,
                "pageNum": $scope.pageNum,
                "status": $scope.status,
                "authorityStatus": $scope.authorityStatus,
                "imgProductIds": type == 'yitusoutu' ? $scope.imgProductIds : ""
            }, function (data) {
                erp.closeLoadPercent($('#merchan-list-all'));
                console.log(data);
                if (data.data.statusCode == 200) {
                    $scope.totalNum = data.data.result.count;
                    if ($scope.totalNum > 0) {
                        erp.removeNodataPic($('.erp-load-box'), 400);
                        $scope.packageList = data.data.result.list;
                        $scope.totalPage = Math.ceil($scope.totalNum / $scope.pageSize);
                        $scope.$broadcast('page-data', {
                            pageSize: $scope.pageSize,
                            pageNum: $scope.pageNum,
                            totalNum: $scope.totalPage,
                            totalCounts: $scope.totalNum,
                            pageList: ['20', '30', '50']
                        });
                    } else {
                        erp.addNodataPic($('.erp-load-box'), 400);
                    }
                } else {
                    layer.msg('获取数据错误');
                }
            })
        }



        $scope.$on('pagedata-fa', function (d, data) {
            $scope.pageNum = data.pageNum;
            $scope.pageSize = data.pageSize;
            $scope.getList();
        })
        /* goActOffShelves 操作
        **type：1-批量下架；2-批量上架；3-批量刪除
        */
        $scope.goActOffShelves = function (type, item, oindex) {
            
            let opeIds = getBanchIds($scope.packageList);
            let ohtml;
            if (opeIds.length == 0 && item == null) {
                layer.msg('请选择商品！');
                return false;
            }
            if (type == '3' || type == '4') {
                ohtml = '<h5>删除商品</h5><p class="is-concern">确定删除商品?</p>'
            } else if (type == '1') {
                ohtml = $('#off-shelve').html()
            } else if (type == '2') {
                ohtml = '<h5>提交商品</h5><p class="is-concern">确定提交商品?</p>';
            }
            layer.open({
                title: null,
                type: 1,
                area: ['374px', '290px'],
                skin: 'offline-assign-layer forbid-pass-layer',
                closeBtn: 0,
                shade: [0.1, '#000'],
                content: ohtml,
                btn: ['取消', '确认'],
                success: function (layero, index) {
                    if (type == '1' && opeIds.length > 0) {
                        $(layero).find('.pro-info').hide();
                    }else if(type == '1' && opeIds.length == 0){
                        $(layero).find('.pro-img').attr('src',item.BIGIMG);
                        $(layero).find('.pro-name').text(item.nameEn);
                        $(layero).find('.pro-sku').text(item.SKU);
                    }
                },
                yes: function (index, layero) {
                    layer.close(index);
                },
                btn2: function (index, layero) {
                    var forbidReason = $('#off-shelve-reason').val() || '';
                    if (!forbidReason && type == '1') {
                        layer.msg('请输入下架原因');
                        return false;
                    }
                    if (item == null) {
                        paramOption = {
                            id: opeIds.join(','),
                            status: type,
                            forbidReason: forbidReason,
                            index: index,
                        }
                    } else {
                        paramOption = {
                            id: "'" + item.ID + "'",
                            status: type,
                            forbidReason: "",
                            index: index,
                            oindex:oindex //当前商品的index
                        }
                    }
                    operaData(true);
                    return false //开启该代码可禁止点击该按钮关闭
                }
            });
        }

        // 选中所有商品
        $scope.checkAllMerch = function (checkAllMark) {
            merchan.checkAllMerch(checkAllMark, $scope.packageList)
        }

        function getBanchIds(arr) { //获取当前选择id
            var banchIds = [];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].checked == true)
                    banchIds.push("'" + arr[i].ID + "'");
            }
            return banchIds;
        }
        //删除，编辑，上架，下架等操作函数，islayer=true为弹框
        function operaData(islayer) {
            layer.load(2);
            erp.postFun('erp/PackProduct/delPackProduct', {
                "pid": paramOption.id,
                "type": paramOption.status, //1-下架；2-上架；3-回收站；4-彻底删除
                "UNSHELVEEXPLAIN": paramOption.forbidReason
            }, function (data) {
                layer.closeAll('loading');
                if (data.data.statusCode == 200) {
                    if (!islayer) {
                        $scope.packageList.splice(paramOption.oindex, 1);
                    } else {
                        layer.close(paramOption.index);
                    }
                    $scope.getList();
                } else {
                    layer.msg('操作失败');
                }
            })
        }
        //查看下架原因
        $scope.reasonFun = function (item) {
            layer.open({
                title: null,
                type: 1,
                area: ['374px', '290px'],
                skin: 'offline-assign-layer',
                closeBtn: 0,
                shade: [0.1, '#000'],
                content: item.UNSHELVEEXPLAIN,
                btn: ['确认'],
                yes: function (index, layero) {
                    layer.close(index);
                }
            });
        }
        
        $scope.numberInput = function (val) {
            $scope.pageNum = $scope.pageNum.replace(/[^\d]/g, "");
        }
        $scope.showPartUsers = function (item) {
            $scope.nowOpeItem = item;
            deleteUserId = [];
            var getUrl;
            if (item.AUTHORITYSTATUS == 1) {
                getUrl = 'pojo/product/getAssignAccount?pid=';
            } else {
                getUrl = 'pojo/product/getAutAcc?pid=';
            }
            layer.load(2);
            erp.getFun(getUrl + item.ID, function (data) {
                layer.closeAll('loading');
                var data = data.data;
                if (item.AUTHORITYSTATUS == 0) {
                    if (data.statusCode == 204) {
                        layer.msg(data.message);
                        return;
                    }
                    var authUserInfo = JSON.parse(data.result);
                    var temArr = [];
                    for (var k in authUserInfo) {
                        temArr.push(authUserInfo[k]);
                    }
                    $scope.authUserList = temArr;
                    temArr = null;
                } else {
                    $scope.authUserList = JSON.parse(data.result);
                }
                console.log($scope.authUserList)
                $scope.showUserFlag = true;
            }, function (err) {
                layer.closeAll('loading');
                layer.msg('网络错误');
            });
        }
        $scope.deleteOneUser = function (item, index) {
            deleteUserId.push(item.id);
            $scope.authUserList.splice(index, 1);
        }
        $scope.goDeleteUser = function () {
            console.log(deleteUserId);
            if (deleteUserId.length > 0 && $scope.nowOpeItem.AUTHORITYSTATUS == 0) {
                var dUserData = {
                    pid: $scope.nowOpeItem.ID,
                    autAccId: deleteUserId.join(',')
                }
                layer.load(2);
                erp.postFun('pojo/product/deleteAuthority', JSON.stringify(dUserData), function (data) {
                    layer.closeAll('loading');
                    var data = data.data;
                    if (data.statusCode != 200) {
                        layer.msg('服务器错误，删除失败！');
                        return false;
                    }
                    console.log(data);
                    layer.msg('删除成功');
                    $scope.showUserFlag = false;
                    if ($scope.authUserList.length == 0) {
                        $scope.nowOpeItem.AUTHORITYSTATUS = 1;
                        $scope.nowOpeItem.AUTACCID = '{}';
                    } else {
                        for (var i = 0; i < deleteUserId.length; i++) {
                            delete $scope.nowOpeItem.AUTACCID[deleteUserId[i]];
                        }
                    }
                }, function (err) {
                    layer.closeAll('loading');
                    layer.msg('网络错误，删除失败！');
                })
            } else {
                $scope.showUserFlag = false;
            }
        }
        $scope.setPrivForever = function (item, i) {
            item.id=item.ID;
            merchan.opePrivForever(item, '1', function () {
                $scope.packageList[i].isAut = '1';
                $scope.$apply();
            })
        }
        $scope.cancelPrivForever = function (item, i) {
            item.id=item.ID;
            merchan.opePrivForever(item, '0', function () {
                $scope.packageList[i].isAut = '0';
                $scope.$apply();
            })
        }
        $scope.editFun = item =>{
            location.href = `#/merchandise/edit-detail/${item.ID}/0/${$scope.status}/3`;
        }



        /**
         * 上传图片相关
         */
        $scope.upLoadImg4 = function (files) {
            const file = files[0];
            const fileName = file.name;
            // 图片格式 allow: *.jpg/*.png/*.png/*.JPG
            if (!/.png|.jpg|.PNG|.JPG$/.test(fileName)) {
                return layer.msg('Invalid image. Only JPG and PNG supported.');
            }
            erp.ossUploadFile(files, function (data) {
                $('#img-upload').val('');
                if (data.code == 0) {
                    layer.msg('Images Upload Failed');
                    return;
                }
                if (data.code == 2) {
                    layer.msg('Images Upload Incomplete');
                    return;
                }
                $scope.resUrl = data.succssLinks[0];
                $scope.$apply();
            });
            // 查找相似图片  -  以图搜图
            function getSearchImg(file) {
                // layer.load();
                const formData = new FormData();
                formData.append('uploadimg', file);
                erp.upLoadImgPost(
                    'app/picture/searchUpload',
                    formData,
                    res => {
                        if (res.data.statusCode != 200) {
                            return layer.msg('Get the product data error');
                        } else {
                            const resData = JSON.parse(res.data.result);
                            $scope.needOptimisation = false;
                            $scope.imgProductIds = "";
                            if (resData.location.length > 0) {
                                let imgProductIds = []
                                resData.location.forEach(e => {
                                imgProductIds.push(e.id)
                                });
                                $scope.imgProductIds = imgProductIds.join();
                                console.log($scope.imgProductIds);
                                $scope.getList(null, type = 'yitusoutu');
                            } else {
                                $scope.topSearchVal = '';
                                $scope.packageList = [];
                                erp.addNodataPic($('.erp-load-box'), 400);
                            }
                        }
                    },
                    err => { }
                );
            }
            getSearchImg(file);
        };
        $scope.imgClear = () => {
            $scope.resUrl = undefined;
        };
        $scope.$watch('topSearchKey', function(newValue, oldValue) {
            if ($scope.topSearchKey != oldValue) {
                $scope.resUrl = undefined;
            }
        });
    }])
})()