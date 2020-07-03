(function (angular) {

    var app = angular.module('merchandise', ['service', 'merchan-service', 'ngDraggable']);

    var chineseReqG = /[\u4E00-\u9FA5]/g;

    var specialChacReqG = new RegExp("[-`!@#$^&*()=|{}':;,\\[\\]<>/?！￥……／～《》（）——|{}【】‘；：”“。，、？]", "gi");


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
    app.filter('stateFil', function () {
        return function (val) {
            try {
                if (val == '1') {
                    return '未上架'
                } else if (val == '2') {
                    return '已上架'
                } else if (val == '3') {
                    return '已下架'
                }
            } catch (e) {
                console.warn(e);
                return val;
            }
        }
    })
    //重复sku
    app.controller('merchandiseRepeatCtrl', ['$scope', "erp", "$routeParams", function ($scope, erp, $routeParams) {
        console.log('下架库存')
        // var loStore = localStorage.getItem('store') == undefined ? '' : localStorage.getItem('store');
        // if (loStore) {
        //     $scope.store = loStore - 0;
        //     $('.kucun-ck-btn').eq($scope.store).addClass('kucun-ck-btn-act');
        // }
        var stuNum = $routeParams.stu || 0;
        $scope.listIndex = stuNum - 0;
        console.log($scope.listIndex)
        //共有仓库 入库
        $scope.pageSize = '50';
        $scope.pageNum = '1';
        $scope.totalNum = 0;
        $scope.totalPageNum = 0;
        $scope.searchTj = '';
        $scope.timeIndex = 1;

        $scope.messageFlag = false;

        function cgListFun() {
            var cgData = {};
            cgData.inputStr = $scope.inputStr;
            cgData.pageSize = $scope.pageSize + '';
            cgData.pageNum = $scope.pageNum + '';
            $scope.piciList = [];
            console.log(cgData)
            erp.load()
            erp.postFun("pojo/product/keNengChongFuLieBiao", JSON.stringify(cgData), bb, err);

            function bb(a) {
                layer.closeAll('loading')
                console.log(a)
                if (a.data.statusCode == 200) {
                    var result = JSON.parse(a.data.result)
                    $scope.piciList = result.list;
                    $scope.totalNum = result.total;
                    let totalNum = Math.ceil(Number($scope.totalNum) / Number($scope.pageSize));
                    $scope.$broadcast('page-data', {
                        pageSize: $scope.pageSize,
                        pageNum: $scope.pageNum,
                        totalNum: totalNum,
                        totalCounts: $scope.totalNum,
                        pageList: ['30', '50', '100']
                    });
                }
            };
        }
        $scope.$on('pagedata-fa', function (d, data) {
            $scope.pageNum = data.pageNum;
            $scope.pageSize = data.pageSize;
            cgListFun();
        })

        function err(a) {
            layer.closeAll('loading')
            layer.msg("失败")
        };
        cgListFun()

        $scope.storeFun = function (ev, stu) {
            $('.kucun-ck-btn').removeClass('kucun-ck-btn-act')
            $(ev.target).addClass('kucun-ck-btn-act')
            $scope.store = stu;
            $scope.pageNum = '1';
            cgListFun(erp, $scope);
        }
        $scope.showSkuFun = function (item) {
            if (item.skus.length > 2) {
                $scope.skuListFlag = true;
                $scope.skuList = item.skus;
            } else {
                layer.msg('该行sku已经全部展示')
            }
        }
        $scope.closeSkuFun = function () {
            $scope.skuListFlag = false;
        }
        //搜索
        $('.top-search-inp').keypress(function (Event) {
            if (Event.keyCode == 13) {
                $scope.searchFun();
            }
        })
        $scope.searchFun = function () {
            $scope.pageNum = '1';
            cgListFun(erp, $scope);
        }
        var selIds;
        $scope.bulkXlXfFun = function () {
            var selCount = 0;
            selIds = '';
            $('#ea-list-table .cor-check-box').each(function () {
                if ($(this).attr('src') == 'static/image/order-img/multiple2.png') {
                    selCount++;
                    selIds += $(this).siblings('.id-text').text() + ',';
                }
            })
            if (selCount > 0) {
                $scope.chuLiFlag = true;
            } else {
                $scope.chuLiFlag = false;
                layer.msg('请先选择Sku')
            }
        }
        $scope.cancelFun = function () {
            $scope.chuLiFlag = false;
        }
        $scope.confirmFun = function () {
            erp.postFun('pojo/product/chuLiChongFu', {
                ids: selIds
            }, function (data) {
                console.log(data)
                if (data.data.statusCode == 200) {
                    $scope.chuLiFlag = false;
                    $scope.pageNum = '1';
                    cgListFun(erp, $scope);
                } else {
                    layer.msg(data.data.message)
                }
            }, function (data) {
                console.log(data)
            })
        }
        $scope.sigChuLiFun = function (item) {
            $scope.itemId = item.id;
            $scope.oneChuLiFlag = true;
        }
        $scope.onecancelFun = function () {
            $scope.oneChuLiFlag = false;
        }
        $scope.oneconfirmFun = function () {
            erp.postFun('pojo/product/chuLiChongFu', {
                ids: $scope.itemId
            }, function (data) {
                console.log(data)
                if (data.data.statusCode == 200) {
                    $scope.oneChuLiFlag = false;
                    $scope.pageNum = '1';
                    cgListFun(erp, $scope);
                } else {
                    layer.msg(data.data.message)
                }
            }, function (data) {
                console.log(data)
            })
        }
        //显示大图
        $('#ea-list-table').on('mouseenter', '.s-img', function () {
            $(this).siblings('.hide-bigimg').show();
        })
        $('#ea-list-table').on('mouseenter', '.hide-bigimg', function () {
            $(this).show();
        })
        $('#ea-list-table').on('mouseleave', '.s-img', function () {
            $(this).siblings('.hide-bigimg').hide();
        })
        $('#ea-list-table').on('mouseleave', '.hide-bigimg', function () {
            $(this).hide();
        })
        //给子订单里面的订单添加选中非选中状态
        var cziIndex = 0;
        $('#ea-list-table').on('click', '.cor-check-box', function () {
            if ($(this).attr('src') == 'static/image/order-img/multiple1.png') {
                $(this).attr('src', 'static/image/order-img/multiple2.png');
                cziIndex++;
                if (cziIndex == $('#ea-list-table .cor-check-box').length) {
                    $('#ea-list-table .c-checkall').attr('src', 'static/image/order-img/multiple2.png');
                }
            } else {
                $(this).attr('src', 'static/image/order-img/multiple1.png');
                cziIndex--;
                if (cziIndex != $('#ea-list-table .cor-check-box').length) {
                    $('#ea-list-table .c-checkall').attr('src', 'static/image/order-img/multiple1.png');
                }
            }
        })
        //全选
        $('#ea-list-table').on('click', '.c-checkall', function () {
            if ($(this).attr('src') == 'static/image/order-img/multiple1.png') {
                $(this).attr('src', 'static/image/order-img/multiple2.png');
                cziIndex = $('#ea-list-table .cor-check-box').length;
                $('#ea-list-table .cor-check-box').attr('src', 'static/image/order-img/multiple2.png');
            } else {
                $(this).attr('src', 'static/image/order-img/multiple1.png');
                cziIndex = 0;
                $('#ea-list-table .cor-check-box').attr('src', 'static/image/order-img/multiple1.png');
            }
        })
    }])
    app.directive('onFinishRenderFilters', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        }
    }]).directive('autoFocus', function(){
        return function(scope, element){
          element[0].focus();
        };
    });
    
    app.controller('merchandiseCtrlHome', ['$scope', '$window', '$location', '$compile', '$routeParams', '$timeout', '$http', 'erp', 'merchan', '$sce', '$location', function ($scope, $window, $location, $compile, $routeParams, $timeout, $http, erp, merchan, $sce, $location) {
        (function fn() {
	        const { status, type } = $routeParams;
	        if (status === '3' && type === 'drop') {//代发商品 已上架
		        $scope.needOptimisation = true;
		        return listOtpimisation();
	        }
	        if (status === '3' && type === 'personalize') {//个性商品 已上架
		        $scope.needOptimisation = true;
		        return listOtpimisation();
	        }
	        setTimeout(() => {
		        $scope.getCurrentFirstList();
	        })
        }());
	
	    function listOtpimisation() {//执行 对应的列表优化 ---
		    const clipboard = new cjUtils.Clipboard();
		    clipboard.action((str) => {
			    const isMatched = /^CJ/.test(str);//匹配 前切板内容是否 以 CJ开头
			    if (isMatched) {
				    $scope.topSearchVal = str;//匹配 前切板内容是否 以 CJ开头 有则 搜索 字段 改为 剪切板内容
				    $scope.getCurrentFirstList();//获取列表
				    $scope.needOptimisation = false;
			    }
		    }).catch(msg => {
			    $scope.needOptimisation = true;
			    console.log('clipboard action failed --->> ', msg)
		    })
	    }
	
	    $('.right-bar').on('click', '.top-nav li', function () {
		    var topNavindex = $(this).index();
		    $(this).addClass('active').siblings().removeClass('active');
	    });
	
	    $('.right-bar').css('min-height', $(window).height() - 90 + 'px');
	
	    $('.left-bar').css('min-height', $(window).height() - 90 + 'px');
	    var bs = new Base64();
	    // $scope.chargeManId = '';
	    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
		    console.log('加载完成');
		    console.log($scope.videoList); //watermarkViewUrl
		    $.each($scope.videoList, function (i, v) {
			    if (v.videoId) {
				    var step = 0;
                    var step2 = 0;
                    var url = 'c5b3f1f16bce4acc9a873ce414135828';
                    // var url = v.videoId;
                    var send = 'tool/downLoad/getVideoPlayAuth?videoId=' + url;
                    var id = 'J_prismPlayer' + (i + 1);
                    //var playAuth = data.data.playAuth;
                    erp.getFun(send, function (data) {
                        console.log(data);
                        var playAuth = data.data.playAuth;
                        var player = new Aliplayer({
                            id: id,
                            width: '300px',
                            height: '200px',
                            autoplay: false,
                            "isLive": false,
                            "rePlay": false,
                            "playsinline": true,
                            "preload": true,
                            "controlBarVisibility": "hover",
                            // "cover":"static/image/home/banner.png",
                            "skinLayout": [{
                                "name": "bigPlayButton",
                                "align": "blabs",
                                "x": 30,
                                "y": 80
                            },
                            {
                                "name": "H5Loading",
                                "align": "cc"
                            },
                            {
                                "name": "errorDisplay",
                                "align": "tlabs",
                                "x": 0,
                                "y": 0
                            },
                            {
                                "name": "infoDisplay"
                            },
                            {
                                "name": "tooltip",
                                "align": "blabs",
                                "x": 0,
                                "y": 56
                            },
                            {
                                "name": "thumbnail"
                            },
                            {
                                "name": "controlBar",
                                "align": "blabs",
                                "x": 0,
                                "y": 0,
                                "children": [{
                                    "name": "progress",
                                    "align": "blabs",
                                    "x": 0,
                                    "y": 44
                                },
                                {
                                    "name": "playButton",
                                    "align": "tl",
                                    "x": 15,
                                    "y": 12
                                },
                                {
                                    "name": "timeDisplay",
                                    "align": "tl",
                                    "x": 10,
                                    "y": 7
                                },
                                {
                                    "name": "fullScreenButton",
                                    "align": "tr",
                                    "x": 10,
                                    "y": 12
                                },
                                {
                                    "name": "setting",
                                    "align": "tr",
                                    "x": 15,
                                    "y": 12
                                },
                                {
                                    "name": "volume",
                                    "align": "tr",
                                    "x": 5,
                                    "y": 10
                                }
                                ]
                            }
                            ],
                            //播放方式二：点播用户推荐
                            vid: url,
                            playauth: playAuth

                        }, function (player) { });
                        player.on('ready', onReady);
                        player.on('ended', endedHandle);

                        function onReady() {
                            // console.log(step);
                            step++;
                            if (step == 2) {
                                player.play();
                                step = 0;
                            }
                        }

                        function endedHandle() {
                            step2++;
                            if (step2 == 1) {
                                var vid = v.videoId;
                                var send = 'tool/downLoad/getVideoPlayAuth?videoId=' + vid;
                                erp.getFun(send, function (data) {
                                    var newPlayAuth = data.data.playAuth;
                                    player.replayByVidAndPlayAuth(vid, newPlayAuth);
                                    // player.play();
                                });
                            } else if (step2 == 2) {
                                var videoId = 'c5b3f1f16bce4acc9a873ce414135828'
                                var send = 'tool/downLoad/getVideoPlayAuth?videoId=' + videoId;
                                erp.getFun(send, function (data) {
                                    var newPlayAuth = data.data.playAuth;
                                    player.replayByVidAndPlayAuth(videoId, newPlayAuth);
                                    step2 = 0;
                                });
                            }


                        }
                    }, function () { })
                } else {
                    var url = v.watermarkViewUrl;
                    var id = 'J_prismPlayer' + (i + 1);
                    if (url.indexOf('.') != -1) {
                        var step = 0;
                        var step2 = 0;
                        var player = new Aliplayer({
                            id: id,
                            width: '300px',
                            height: '200px',
                            autoplay: false,
                            "isLive": false,
                            "rePlay": false,
                            "playsinline": true,
                            "preload": true,
                            "controlBarVisibility": "hover",
                            "skinLayout": [{
                                "name": "bigPlayButton",
                                "align": "blabs",
                                "x": 30,
                                "y": 80
                            },
                            {
                                "name": "H5Loading",
                                "align": "cc"
                            },
                            {
                                "name": "errorDisplay",
                                "align": "tlabs",
                                "x": 0,
                                "y": 0
                            },
                            {
                                "name": "infoDisplay"
                            },
                            {
                                "name": "tooltip",
                                "align": "blabs",
                                "x": 0,
                                "y": 56
                            },
                            {
                                "name": "thumbnail"
                            },
                            {
                                "name": "controlBar",
                                "align": "blabs",
                                "x": 0,
                                "y": 0,
                                "children": [{
                                    "name": "progress",
                                    "align": "blabs",
                                    "x": 0,
                                    "y": 44
                                },
                                {
                                    "name": "playButton",
                                    "align": "tl",
                                    "x": 15,
                                    "y": 12
                                },
                                {
                                    "name": "timeDisplay",
                                    "align": "tl",
                                    "x": 10,
                                    "y": 7
                                },
                                {
                                    "name": "fullScreenButton",
                                    "align": "tr",
                                    "x": 10,
                                    "y": 12
                                },
                                {
                                    "name": "setting",
                                    "align": "tr",
                                    "x": 15,
                                    "y": 12
                                },
                                {
                                    "name": "volume",
                                    "align": "tr",
                                    "x": 5,
                                    "y": 10
                                }
                                ]
                            }
                            ],
                            //播放方式二：点播用户推荐
                            "source": 'https://cc-west-usa.oss-us-west-1.aliyuncs.com/15306336/338209605760.mp4'

                        }, function (player) { });
                        player.on('ready', onReady);
                        player.on('ended', endedHandle);

                        function onReady() {
                            // console.log(step);
                            step++;
                            if (step == 2) {
                                player.play();
                                step = 0;
                            }
                        }

                        function endedHandle() {
                            step2++;
                            console.log(step2)
                            if (step2 == 1) { //https://cc-west-usa.oss-us-west-1.aliyuncs.com/15306336/338209605760.mp4
                                // var vid =url;
                                var newUrl = 'https://' + url;
                                console.log(newUrl)
                                player.loadByUrl(newUrl);
                            } else if (step2 == 2) {
                                var newUrl = 'https://cc-west-usa.oss-us-west-1.aliyuncs.com/15306336/338209605760.mp4';
                                player.loadByUrl(newUrl);
                                step2 = 0;
                            }
                        }
                    } else {
                        var step = 0;
                        var step2 = 0;
                        var lid = 'c5b3f1f16bce4acc9a873ce414135828';
                        var send = 'tool/downLoad/getVideoPlayAuth?videoId=' + lid;
                        erp.getFun(send, function (data) {
                            var playAuth = data.data.playAuth;
                            var player = new Aliplayer({
                                id: id,
                                width: '300px',
                                height: '200px',
                                autoplay: false,
                                "isLive": false,
                                "rePlay": false,
                                "playsinline": true,
                                "preload": true,
                                "controlBarVisibility": "hover",
                                "skinLayout": [{
                                    "name": "bigPlayButton",
                                    "align": "blabs",
                                    "x": 30,
                                    "y": 80
                                },
                                {
                                    "name": "H5Loading",
                                    "align": "cc"
                                },
                                {
                                    "name": "errorDisplay",
                                    "align": "tlabs",
                                    "x": 0,
                                    "y": 0
                                },
                                {
                                    "name": "infoDisplay"
                                },
                                {
                                    "name": "tooltip",
                                    "align": "blabs",
                                    "x": 0,
                                    "y": 56
                                },
                                {
                                    "name": "thumbnail"
                                },
                                {
                                    "name": "controlBar",
                                    "align": "blabs",
                                    "x": 0,
                                    "y": 0,
                                    "children": [{
                                        "name": "progress",
                                        "align": "blabs",
                                        "x": 0,
                                        "y": 44
                                    },
                                    {
                                        "name": "playButton",
                                        "align": "tl",
                                        "x": 15,
                                        "y": 12
                                    },
                                    {
                                        "name": "timeDisplay",
                                        "align": "tl",
                                        "x": 10,
                                        "y": 7
                                    },
                                    {
                                        "name": "fullScreenButton",
                                        "align": "tr",
                                        "x": 10,
                                        "y": 12
                                    },
                                    {
                                        "name": "setting",
                                        "align": "tr",
                                        "x": 15,
                                        "y": 12
                                    },
                                    {
                                        "name": "volume",
                                        "align": "tr",
                                        "x": 5,
                                        "y": 10
                                    }
                                    ]
                                }
                                ],
                                //播放方式二：点播用户推荐
                                vid: lid,
                                playauth: playAuth
                            }, function (player) { });
                            player.on('ready', onReady);
                            player.on('ended', endedHandle);

                            function onReady() {
                                // console.log(step);
                                step++;
                                if (step == 2) {
                                    player.play();
                                    step = 0;
                                }
                            }

                            function endedHandle() {
                                step2++;
                                if (step2 == 1) {
                                    var vid = url;
                                    var send = 'tool/downLoad/getVideoPlayAuth?videoId=' + vid;
                                    erp.getFun(send, function (data) {
                                        var newPlayAuth = data.data.playAuth;
                                        player.replayByVidAndPlayAuth(vid, newPlayAuth);
                                        // player.play();
                                    });
                                } else if (step2 == 2) {
                                    var videoId = 'c5b3f1f16bce4acc9a873ce414135828'
                                    var send = 'tool/downLoad/getVideoPlayAuth?videoId=' + videoId;
                                    erp.getFun(send, function (data) {
                                        var newPlayAuth = data.data.playAuth;
                                        player.replayByVidAndPlayAuth(videoId, newPlayAuth);
                                        step2 = 0;
                                    });
                                }


                            }
                        }, function () { })
                    }

                }

            });
        });

        function createUploader() {
            var uploader = new AliyunUpload.Vod({
                timeout: $('#timeout').val() || 60000,
                partSize: $('#partSize').val() || 1048576,
                parallel: $('#parallel').val() || 5,
                retryCount: $('#retryCount').val() || 3,
                retryDuration: $('#retryDuration').val() || 2,
                region: 'cn-shanghai',
                userId: '1654317246160868',
                // 添加文件成功
                addFileSuccess: function (uploadInfo) {
                    console.log('addFileSuccess')
                    // $('#authUpload').attr('disabled', false)
                    // $('#resumeUpload').attr('disabled', false)
                    // $('#status').text('添加文件成功, 等待上传...')
                    console.log("addFileSuccess: " + uploadInfo.file.name);
                    $('#uploadVideoText').html('选择视频成功!');
                },
                // 开始上传
                onUploadstarted: function (uploadInfo) {
                    // 如果是 UploadAuth 上传方式, 需要调用 uploader.setUploadAuthAndAddress 方法
                    // 如果是 UploadAuth 上传方式, 需要根据 uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress
                    // 如果 uploadInfo.videoId 有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
                    // 注意: 这里是测试 demo 所以直接调用了获取 UploadAuth 的测试接口, 用户在使用时需要判断 uploadInfo.videoId 存在与否从而调用 openApi
                    // 如果 uploadInfo.videoId 存在, 调用 刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)
                    // 如果 uploadInfo.videoId 不存在,调用 获取视频上传地址和凭证接口(https://help.aliyun.com/document_detail/55407.html)
                    if (!uploadInfo.videoId) {
                        // var createUrl = 'https://demo-vod.cn-shanghai.aliyuncs.com/voddemo/CreateUploadVideo?Title=testvod1&FileName=aa.mp4&BusinessType=vodai&TerminalType=pc&DeviceModel=iPhone9,2&UUID=59ECA-4193-4695-94DD-7E1247288&AppVersion=1.0.0&VideoId=5bfcc7864fc14b96972842172207c9e6'
                        var createUrl = 'https://tools.cjdropshipping.com/tool/downLoad/token'
                        $.get(createUrl, {
                            type: 1,
                            fileName: uploadInfo.file.name,
                            title: '123'
                        }, function (data) {
                            var uploadAuth = data.result.UploadAuth
                            var uploadAddress = data.result.UploadAddress
                            var videoId = data.result.VideoId
                            uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
                        }, 'json')
                        //   $('#status').text('文件开始上传...')
                        console.log("onUploadStarted:" + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object)
                    } else {
                        // 如果videoId有值，根据videoId刷新上传凭证
                        // https://help.aliyun.com/document_detail/55408.html?spm=a2c4g.11186623.6.630.BoYYcY
                        //   var refreshUrl = 'https://vod.cn-shanghai.aliyuncs.com/voddemo/RefreshUploadVideo?BusinessType=vodai&TerminalType=pc&DeviceModel=iPhone9,2&UUID=59ECA-4193-4695-94DD-7E1247288&AppVersion=1.0.0&Title=haha1&FileName=xxx.mp4&VideoId=' + uploadInfo.videoId
                        var refreshUrl = "https://tools.cjdropshipping.com/tool/downLoad/token";
                        $.get(refreshUrl, {
                            type: 2,
                            videoId: uploadInfo.videoId
                        }, function (data) {
                            var uploadAuth = data.result.UploadAuth
                            var uploadAddress = data.result.UploadAddress
                            var videoId = data.result.VideoId
                            uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
                        }, 'json')
                    }
                },
                // 文件上传成功
                onUploadSucceed: function (uploadInfo) {
                    // console.log("onUploadSucceed: " + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object)
                    console.log(uploadInfo);
                    var id = uploadInfo.ri;
                    $timeout(function () {
                        $.each($scope.UploadVideoList, function (i, v) {
                            if (v.vid == id) {
                                var data = {
                                    videoNumber: v.videoNumber,
                                    locProductId: v.id,
                                    videoName: v.videoName,
                                    copyrightPrice: v.copyrightPrice,
                                    notCopyrightPrice: v.notCopyrightPrice,
                                    isFree: v.isFree,
                                    videoId: uploadInfo.videoId
                                }
                                console.log(data);
                                erp.load(2);
                                erp.postFun('tool/video/uploadVideo', data, function (data) {
                                    console.log(data)
                                    layer.closeAll("loading");
                                    if (data.data.statusCode == 200) {
                                        // layer.msg('添加成功');
                                        if (v.id == $scope.videoId) {
                                            $scope.videoName = '';
                                            // $scope.videoUrl = '';
                                            $scope.copyrightPrice = '';
                                            $scope.notCopyrightPrice = '';
                                            getvideo();
                                        }
                                    } else {
                                        // layer.msg('添加失败')
                                    }
                                }, function (data) {
                                    layer.closeAll("loading")
                                })
                            }
                        })
                    }, 3000)
                    $('#shangchuanVeido').val('');
                    $('#uploadVideoText').html('视频上传成功!');

                },
                // 文件上传失败
                onUploadFailed: function (uploadInfo, code, message) {
                    console.log("onUploadFailed: file:" + uploadInfo.file.name + ",code:" + code + ", message:" + message)
                    // $('#status').text('文件上传失败!')
                    var id = uploadInfo.ri;
                    var pid = '';
                    $.each($scope.UploadVideoList, function (i, v) {
                        if (v.vid == id) {
                            pid = v.id;
                        }
                    })
                    $.each($scope.merchList, function (i, v) {
                        if (v.id == pid) {
                            v.schedule = '失败';
                        }
                    })
                    $('#shangchuanVeido').val('');
                    $('#uploadVideoText').html('视频上传失败!');
                    // console.log($scope.merchList);
                    $scope.$apply();
                },
                // 取消文件上传
                onUploadCanceled: function (uploadInfo, code, message) {
                    console.log("Canceled file: " + uploadInfo.file.name + ", code: " + code + ", message:" + message)
                    $('#status').text('文件上传已暂停!')
                },
                // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
                onUploadProgress: function (uploadInfo, totalSize, progress) {
                    var progressPercent = Math.ceil(progress * 100);
                    console.log(progressPercent);
                    var id = uploadInfo.ri;
                    var pid = '';
                    $.each($scope.UploadVideoList, function (i, v) {
                        if (v.vid == id) {
                            pid = v.id;
                        }
                    })
                    $.each($scope.merchList, function (i, v) {
                        if (v.id == pid) {
                            v.schedule = progressPercent + '';
                        }
                    })
                    // console.log($scope.merchList);
                    $scope.$apply();
                    // console.log("onUploadProgress:file:" + uploadInfo.file.name + ", fileSize:" + totalSize + ", percent:" + Math.ceil(progress * 100) + "%")
	                //
                    // $('#auth-progress').text(progressPercent)
                    // $('#status').text('文件上传中...')
                },
                // 上传凭证超时
                onUploadTokenExpired: function (uploadInfo) {
                    // 上传大文件超时, 如果是上传方式一即根据 UploadAuth 上传时
                    // 需要根据 uploadInfo.videoId 调用刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)重新获取 UploadAuth
                    // 然后调用 resumeUploadWithAuth 方法, 这里是测试接口, 所以我直接获取了 UploadAuth
                    $('#status').text('文件上传超时!')

                    // let refreshUrl = 'https://vod.cn-shanghai.aliyuncs.com/voddemo/RefreshUploadVideo?BusinessType=vodai&TerminalType=pc&DeviceModel=iPhone9,2&UUID=59ECA-4193-4695-94DD-7E1247288&AppVersion=1.0.0&Title=haha1&FileName=xxx.mp4&VideoId=' + uploadInfo.videoId
                    //http://vod.cn-shanghai.aliyuncs.com/?Action=RefreshUploadVideo&VideoId=93ab850b4f6f44eab54b6e91d24d81d4&Format=JSON&<公共参数>
                    var refreshUrl = "https://tools.cjdropshipping.com/tool/downLoad/token";
                    $.get(refreshUrl, {
                        type: 2,
                        videoId: uploadInfo.videoId
                    }, function (data) {
                        var uploadAuth = data.result.UploadAuth
                        var uploadAddress = data.result.UploadAddress
                        var videoId = data.result.VideoId
                        uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
                    }, 'json')
                },
                // 全部文件上传结束
                onUploadEnd: function (uploadInfo) {
                    // $('#status').text('文件上传完毕!')
                    console.log(uploadInfo);
                    console.log("onUploadEnd: uploaded all the files");

                }
            })
            return uploader
        }

        $scope.UploadVideoList = [];
        $('#uploadVideoBtn').click(function () {
            $('#shangchuanVeido').trigger('click');
        })
        $('#shangchuanVeido').change(function (e) {
            var file = e.target.files[0]
            if (!file) {
                layer.msg("请先选择需要上传的文件!")
                return
            }
            var Title = file.name;
            var userData = '{"Vod":{}}';
            // var uploader = createUploader();
            var isHasFlag = false;
            console.log($scope.videoId);
            $.each($scope.UploadVideoList, function (i, v) {
                if (v.id == $scope.videoId) {
                    isHasFlag = true;
                }
            })
            if (!isHasFlag) {
                var data = {
                    id: $scope.videoId
                }
                $scope.UploadVideoList.push(data);
            }
            $.each($scope.UploadVideoList, function (i, v) {
                if (v.id == $scope.videoId) {
                    var uploader = createUploader();
                    uploader.addFile(file, null, null, null, userData)
                    v.upload = uploader;
                    v.vid = uploader._uploadList[0].ri;
                }
            });
            console.log($scope.UploadVideoList);

        });
        $scope.uplodvideo2 = function () {
            // console.log($scope.videoId);
            if (!$scope.videoName) {
                layer.msg('输入视频名称')
            } else if (!$scope.copyrightPrice || !$scope.notCopyrightPrice) {
                layer.msg('输入视频价格')
            } else {
                $.each($scope.UploadVideoList, function (i, v) {
                    if (v.id == $scope.videoId) {
                        v.videoNumber = $scope.videoNumber;
                        v.videoName = $scope.videoName;
                        v.copyrightPrice = $scope.copyrightPrice;
                        v.notCopyrightPrice = $scope.notCopyrightPrice;
                        v.isFree = $scope.isFree;
                        var uploader = v.upload;
                        $('#shangchuanVeido').val('');
                        console.log($scope.UploadVideoList);
                        uploader.startUpload();
                    }
                })
            }

        }
        /***********僵尸订单*********** */
        $scope.addZombie = function (item) {
            console.log(item);
            layer.confirm('确认要添加到僵尸订单吗？', {
                btn: ['确定', '取消'] //按钮
            }, function (index) {
                layer.close(index);
                var sendData = {
                    id: item.id,
                    sku: item.sku,
                    nameEn: item.nameEn
                }
                erp.postFun('erp/observer/addJiangshiProduct', JSON.stringify(sendData), function (data) {
                    console.log(data.data);
                    if (data.data.statusCode == '200') {
                        layer.msg('添加成功')
                    } else {
                        layer.msg(data.data.message)
                    }

                }, function () { }, {
                    layer: true
                })
            });

        }
        $scope.deleteZombie = function (item) {
            layer.confirm('确认要删除僵尸订单吗？', {
                btn: ['确定', '取消'] //按钮
            }, function (index) {
                layer.close(index);
                var sendData = {
                    sku: item.sku
                }
                erp.postFun('erp/observer/deleteJiangshiProduct', JSON.stringify(sendData), function (data) {
                    console.log(data.data);
                    if (data.data.statusCode == '200') {
                        layer.msg('删除成功');
                    } else {
                        layer.msg(data.data.message)
                    }

                }, function () { }, {
                    layer: true
                })
            });
        }
				/******************** */
				/** 2020-04-07 页面状态整合成顶部tab（服务商品） */
        const serviceTabList = [
					{ key: 3, name: '已上架', href: '#/merchandise/list/service/3', active: true },
					{ key: 1, name: '待提交', href: '#/merchandise/list/service/1', active: false },
					{ key: 2, name: '审核商品', href: '#/merchandise/list/service/2', active: false },
					{ key: 4, name: '审核失败', href: '#/merchandise/list/service/4', active: false },
					{ key: 5, name: '商品已下架', href: '#/merchandise/list/service/5', active: false },
					{ key: 6, name: '变体已下架', href: '#/merchandise/soldOut/service', active: false },
					{ key: 0, name: '回收站', href: '#/merchandise/list/service/0', active: false },
				]
        var Wintype = $routeParams.type;
        $scope.spType = $routeParams.type;
				var Winstatus = $routeParams.status;
				$scope.isDaifaYishangjia = Wintype === 'drop' && Winstatus === '3'
				$scope.serviceTabList = serviceTabList.map(item => {
					item.active = item.key === +Winstatus
					return item
				})
				console.log(Wintype, Winstatus, $scope.serviceTabList);
        if (Winstatus == '5') {
            $scope.isSoldOut = true;
        } else {
            $scope.isSoldOut = false;
        }
        if (Winstatus == '3') {
            $scope.repeatSkuBtnFlag = true;
        } else {
            $scope.repeatSkuBtnFlag = false;
        }
        console.log($scope.isSoldOut);
        $scope.gotoSoldOut = function () {
            location.href = "#/merchandise/soldOut/" + Wintype;
        }

        $scope.loginName = localStorage.getItem('erploginName') ? bs.decode(localStorage.getItem('erploginName')) : '';

        $scope.isAdminLogin = erp.isAdminLogin();

        console.log('admin', $scope.isAdminLogin)

        $scope.chargemanType = '销售';
        getEmployeeList(erp, '销售', function (data) {
            $scope.chargemanList = data;
            $scope.chargemanName = '';
        });

        $scope.changeChargeman = function (id) {
            $scope.currentPage = 1;
            $scope.chargemanName = id;
            console.log($scope.chargemanName);
            $scope.getCurrentFirstList();
        }
        $scope.changeChargemanType = function (type) {
            getEmployeeList(erp, type, function (data) {
                $scope.chargemanList = data;
                $scope.chargemanName = '';
                $scope.currentPage = 1;
                $scope.getCurrentFirstList();
            })
        }

        $scope.userId = localStorage.getItem('erpuserId') == null ? '' : bs.decode(localStorage.getItem('erpuserId'));
        $scope.userName = localStorage.getItem('erpname') == null ? '' : bs.decode(localStorage.getItem('erpname'));
        $scope.token = localStorage.getItem('erptoken') == null ? '' : bs.decode(localStorage.getItem('erptoken'));
        $scope.remark = '';

        $scope.ciSkuArr = [{
            sku: '',
            num: ''
        }]
        $scope.addCisku = function () {
            $scope.ciSkuArr.push({
                sku: '',
                num: ''
            });
        }
        $scope.removeCisku = function (index) {
            $scope.ciSkuArr.splice(index, 1);
        }
        $scope.isYanzheng = true;
        $scope.isDisabled = false;
        $scope.goCombineSku = function () {
            if (!$scope.zhuSKu) return layer.msg('主SKU不能为空');
            for (var x = 0; x < $scope.ciSkuArr.length; x++) {
                if (!$scope.ciSkuArr[x].sku) return layer.msg('次SKU不能为空')
                if (+$scope.ciSkuArr[x].num <= 0) return layer.msg('数量必须大于 0')
            }
            // {"jiuBianTiSku":"CJSJBHIP00107-Orange-Iphone 5 5s se","xinBianTiZuHe":{"CJJJJTJT00195-Frameless":1,"CJNSXZXX00091-Wine Red-3XL":1}}
            var xinBianTiZuHe = {};
            for (var i = 0; i < $scope.ciSkuArr.length; i++) {
                if ($scope.ciSkuArr[i].num && $scope.ciSkuArr[i].num * 1 > 0) {
                    xinBianTiZuHe[$scope.ciSkuArr[i].sku] = $scope.ciSkuArr[i].num * 1;
                }
            }
            if (xinBianTiZuHe == {}) return;
            // xinBianTiZuHe = JSON.stringify(xinBianTiZuHe);
            var sendData = {
                jiuBianTiSku: $scope.zhuSKu,
                xinBianTiZuHe: xinBianTiZuHe
            }
            console.log(sendData);
            erp.load();
            erp.postFun('pojo/product/jiaoYanZuHe', JSON.stringify(sendData), function (data) {
                erp.closeLoad();
                // console.log(data);
                if (data.data.statusCode == '200') {
                    var result = JSON.parse(data.data.result);
                    console.log(result);
                    $scope.istongguo = result.tongGuo;
                    if (result.tongGuo == '0') {
                        layer.msg('组合验证不通过');
                        $scope.errMsg = '组合验证未通过，请检查重量'
                        $scope.isYanzheng = true;
                        $scope.isYanzhengSendData = '';

                    } else if (result.tongGuo == '1') {
                        layer.msg('组合验证通过');
                        $scope.errMsg = '组合验证通过，可以提交';
                        $scope.isYanzheng = false;
                        $scope.isYanzhengSendData = sendData;
                        $scope.isDisabled = true;
                    }
                    var list = result.list;
                    $.each(list, function (i, v) {
                        if (v.zu == '1') {
                            $scope.zuWeight = '重量:' + v.packweight + ' g';
                        } else if (v.zu == '0') {
                            var sku = v.sku;
                            var weight = v.packweight;
                            $.each($scope.ciSkuArr, function (i, v) {
                                var w = weight * v.num;
                                var str = '重量:' + w + ' g';
                                if (v.sku == sku) {
                                    v.isweight = str;
                                }
                            })
                            // $scope.$apply();
                        }
                    })
                } else {
                    layer.msg(data.data.message);
                }
            }, function () {
                erp.closeLoad();
            })

        }
        $scope.gotoBackYanzheng = function () {
            $scope.isDisabled = false;
            $scope.isYanzheng = true;
        }
        $scope.gotoSureSKU = function () {
            console.log($scope.isYanzhengSendData);
            layer.load(2);
            erp.postFun('pojo/product/sheZhiBianTiZuHe', JSON.stringify($scope.isYanzhengSendData), function (data) {
                layer.closeAll('loading');
                console.log(data);
                layer.msg(data.data.message);
                if (data.data.statusCode == 200) {
                    // $scope.zhuSKu = '';
                    // $scope.ciSkuArr = [{ sku: '', num: '' }];
                    $scope.errMsg = '';
                    $scope.isDisabled = false;
                    $scope.isYanzheng = true;
                }
            });
        }

        //重复sku
        $scope.goRepeatSku = function () {
            console.log($scope.skuStr)
            if (!$scope.skuStr) {
                layer.msg('请输入sku')
                return
            } else {
                var skuArr = $scope.skuStr.split(/[,，]/g);
            }
            console.log(skuArr)
            if (!skuArr[skuArr.length - 1]) {
                skuArr.pop()
            }
            if (skuArr.length < 2) {
                layer.msg('至少输入两个sku')
                return
            }
            erp.load()
            console.log(skuArr)
            erp.postFun('pojo/product/huoQuQuanZhong', {
                skus: skuArr
            }, function (data) {
                console.log(data)
                erp.closeLoad()
                if (data.data.statusCode == 200) {
                    $scope.repeatSkuFlag = false;
                    $scope.repeatSkuListFlag = true;
                    $scope.skuStr = '';
                    $scope.repeatSkuList = JSON.parse(data.data.result)
                    console.log($scope.repeatSkuList)
                } else {
                    layer.msg(data.data.message)
                }
            }, function (data) {
                console.log(data)
                erp.closeLoad()
            })
        }
        $scope.selZhuSkuFun = function (item) {
            $scope.baoLiuSku = item.sku;
        }

        $scope.resoveRepeatSku = function () {
            if (!$scope.baoLiuSku) {
                layer.msg('请选择主Sku')
                return
            }
            erp.load()
            var xiaJiaSkuArr = [];
            for (var i = 0, len = $scope.repeatSkuList.length; i < len; i++) {
                if ($scope.repeatSkuList[i].sku != $scope.baoLiuSku) {
                    xiaJiaSkuArr.push($scope.repeatSkuList[i].sku)
                }
                console.log(xiaJiaSkuArr)
            }
            console.log(xiaJiaSkuArr)
            erp.postFun('pojo/product/xiangTongGuanXi', {
                baoLiuSku: $scope.baoLiuSku,
                xiaJiaSku: xiaJiaSkuArr
            }, function (data) {
                erp.closeLoad()
                layer.msg(data.data.message)
                console.log(data)
                if (data.data.statusCode == 200) {
                    $scope.repeatSkuListFlag = false;
                    $scope.baoLiuSku = '';
                    $(".repeat-tab .sel-sturadio").prop("checked", false);
                }
            }, function (data) {
                erp.closeLoad()
                console.log(data)
            })
        }
        //显示大图
        $('.repeat-tbody').on('mouseenter', '.sp-smallimg', function () {
            $(this).siblings('.hide-bigimg').show();
        })
        $('.repeat-tbody').on('mouseenter', '.hide-bigimg', function () {
            $(this).show();
        })
        $('.repeat-tbody').on('mouseleave', '.sp-smallimg', function () {
            $(this).siblings('.hide-bigimg').hide();
        })
        $('.repeat-tbody').on('mouseleave', '.hide-bigimg', function () {
            $(this).hide();
        })

        // 商品列表相关参数
        $scope.merchanStatus = $routeParams.status || '3'; // '3'已上架
        $scope.merchanFlag = $routeParams.flag || '0';
        //缺货商品统计过来的sku
        $scope.sku = $routeParams.sku || '';
        // $scope.merchType -- 备份标记
        if ($routeParams.type == 'service') {
            $scope.merchType = '1';
            $scope.dropFlag = 'service';
        } else if ($routeParams.type == 'personalize') {
            $scope.merchType = '0';
            $scope.dropFlag = '';
            $scope.optType = 'personality';
        } else if ($routeParams.type == 'suplier') {
            // $scope.merchType = '0';
            // $scope.dropFlag = '';
            $scope.suplierFlag = 1;
        } else {
            $scope.merchType = '0';
            $scope.dropFlag = '';
        }
        console.log($scope.merchType);

        $scope.merchList = [];
        $scope.currentPage = 1;
        $scope.specifiedPage = $scope.currentPage;
        $scope.totalNum = '';
        $scope.pageSize = '30';
        $scope.totalPages = '';
        $scope.hasMerch = true;

        // 可见性标记，01-全部，0-私有，1-公有
        $scope.authoFlag = '01';
        $scope.getListUrl = 'pojo/product/list';
        // 搜索
        $scope.topSearchKey = 'SKU';
        $scope.topSearchVal = $scope.sku;
        $scope.searchProperVals = [];
        $scope.searchMateVals = [];
        $scope.$watch('totalNum', function (now) {
            $scope.totalPages = Math.ceil($scope.totalNum / ($scope.pageSize * 1));
        });
        $scope.$watch('pageSize', function (now) {
            $scope.totalPages = Math.ceil($scope.totalNum / ($scope.pageSize * 1));
        });
        $scope.hasGotStorage = true;


        // getItemNums();

        function settleListData(data) {//商品list 数据绑定
            var result = JSON.parse(data.result);
            console.log(result)
            var resultNum;
            var resultList;
            resultNum = result.total;
            resultList = result.ps;
            for (var i = 0; i < resultList.length; i++) {
                if (!$scope.isOffAssMerch) {
                    resultList[i].inventory = JSON.parse(resultList[i].inventory || '{}');
                    resultList[i].autAccId = JSON.parse(resultList[i].autAccId || '{}');
                }
                resultList[i].checked = false;
                resultList[i].countryCode = 'US';
                if (resultList[i].shiSuan && resultList[i].shiSuan.logSet.indexOf('ePacket') == -1) {
                    resultList[i].wuliuway = resultList[i].shiSuan.logSet[0];
                } else {
                    resultList[i].wuliuway = 'ePacket';
                }

                var logName = resultList[i].wuliuway;
                if (resultList[i].shiSuan) {
                    var logList = resultList[i].shiSuan.logistics;
                    for (var j = 0; j < logList.length; j++) {
                        if (logList[j].logisticName == logName) {
                            resultList[i].shiSuanRes = (logList[j].price + '');
                        }
                    }
                    resultList[i].sumPrice = (erp.cacuAmount(resultList[i].shiSuanRes, resultList[i].sellPrice) + '').replace(' -- ', '-');
                }
            }
            $scope.merchList = resultList;
            console.log($scope.merchList);
            $scope.totalNum = resultNum;
            $scope.checkAllMark = false;
        }

        $scope.chanListWuliuway = function (item) {
            var logList = item.shiSuan.logistics;
            var logName = item.wuliuway;
            for (var j = 0; j < logList.length; j++) {
                if (logList[j].logisticName == logName) {
                    item.shiSuanRes = (logList[j].price + '');
                }
            }
            item.sumPrice = (erp.cacuAmount(item.shiSuanRes, item.sellPrice) + '').replace(' -- ', '-');
        }
        $scope.chanListCoun = function (item) {
            layer.load(2);
            erp.postFun('pojo/product/quJianshiSuan', {
                propertyKey: item.propertyKey,
                packWeight: item.packWeight,
                countryCode: item.countryCode,
            }, function (data) {
                layer.closeAll('loading');
                console.log(data);
                item.shiSuan.logSet = data.data.logSet;
                item.shiSuan.logistics = data.data.logistics;
                if (item.shiSuan.logSet.length == 0) {
                    item.shiSuanRes = '0';
                    item.sumPrice = (erp.cacuAmount(item.shiSuanRes, item.sellPrice) + '').replace(' -- ', '-');
                    return;
                }
                if (item.shiSuan.logSet.indexOf('ePacket') == -1) {
                    item.wuliuway = item.shiSuan.logSet[0];
                } else {
                    item.wuliuway = 'ePacket';
                }
                var logList = item.shiSuan.logistics;
                var logName = item.wuliuway;
                console.log(logList, logName)
                for (var j = 0; j < logList.length; j++) {
                    if (logList[j].logisticName == logName) {
                        item.shiSuanRes = (logList[j].price + '');
                    }
                }
                item.sumPrice = (erp.cacuAmount(item.shiSuanRes, item.sellPrice) + '').replace(' -- ', '-');
            });
        }

        function getMerchanList(url, sendData, successCallback, errorCallback) {
            // erp.load();
            erp.loadPercent($('.erp-load-box'), 400);
            erp.postFun(url, JSON.stringify(sendData), function (data) {
                erp.closeLoadPercent($('.erp-load-box'));
                // erp.closeLoad();
                successCallback(data);
            }, function (data) {
                erp.closeLoadPercent($('.erp-load-box'));
                // erp.closeLoad();
                errorCallback(data);
            });
        };

        function getListSendData($scope) {
            $scope.searchCateName = $('.cate-name').attr('id');
            $scope.searchConsName = $('.consumer-name').attr('id');
            $scope.searchPriceLower = $('#search-price-lower').val();
            $scope.searchPriceUpper = $('#search-price-upper').val();
            $scope.searchWeightLower = $('#search-weight-lower').val();
            $scope.searchWeightUpper = $('#search-weight-upper').val();
            $scope.searchStockLower = $('#search-stock-lower').val();
            $scope.searchStockUpper = $('#search-stock-upper').val();
            var sendData = {};
            sendData.flag = $scope.merchanFlag + '';
            sendData.status = $scope.merchanStatus + '';
            sendData.pageNum = $scope.currentPage + '';
            sendData.pageSize = $scope.pageSize + '';
            sendData.filter01 = $scope.topSearchKey || '';
            sendData.filter02 = $scope.topSearchVal || '';
            sendData.filter03 = $scope.searchCateName || '';
            sendData.filter04 = $scope.searchConsName || '';
            sendData.filter05 = $scope.searchProperVals == [] ? '' : $scope.searchProperVals.join(',');
            sendData.filter06 = $scope.searchMateVals == [] ? '' : $scope.searchMateVals.join(',');
            sendData.filter21 = $scope.searchPriceLower || '';
            sendData.filter22 = $scope.searchPriceUpper || '';
            sendData.filter23 = $scope.searchWeightLower || '';
            sendData.filter24 = $scope.searchWeightUpper || '';
            sendData.filter11 = $scope.searchStockLower || '';
            sendData.filter12 = $scope.searchStockUpper || '';
            sendData.autFlag = $scope.authoFlag;
	        sendData.chargeId = $scope.chargemanName;
	        if ($scope.dropFlag) {
		        sendData.flag2 = $scope.dropFlag + '';
	        } else {
		        sendData.flag2 = '';
	        }
	        if ($scope.optType) {
		        // 筛选个性商品
		        sendData.optType = $scope.optType;
	        }
	        return sendData;
        }
	
	    $scope.$on('pagedata-fa', function (d, data) {
		    $scope.currentPage = data.pageNum;
		    $scope.pageSize = data.pageSize;
		    $scope.getCurrentFirstList();
	    })
	
	    $scope.getCurrentFirstList = function (type) {//获取 商品list  http
				console.log(type);
				$scope.isYitusoutu = type === 'yitusoutu'
		    var sendData;
		    sendData = getListSendData($scope)
		    if (type == 'yitusoutu') {
			    $scope.topSearchVal = '';
			    sendData.filter02 = '';
			    sendData.imgProductIds = $scope.imgProductIds;
		    } else {
			    $scope.uploadImgs = []
			    sendData.imgProductIds = '';
		    }
		    $scope.merchList = [];
		    getMerchanList($scope.getListUrl, sendData, function (data) {
			    var data = data.data;
			    if (data.statusCode != 200) {
				    layer.msg(data.message);
				    return false;
			    }
					var result = JSON.parse(data.result);
				  $scope.exportDropParams = JSON.parse(JSON.stringify(sendData))
			    console.log(result);
			    if ($scope.isOffAssMerch) {
				    $scope.totalNum = result.count;
			    } else {
				    $scope.totalNum = result.total;
			    }
			    $scope.totalNum = $scope.totalNum * 1;
			    if ($scope.totalNum == 0) {
				    $scope.hasMerch = false;
				    erp.addNodataPic($('.erp-load-box'), 400);
				    return false;
                }
                erp.removeNodataPic($('.erp-load-box'));
                $scope.hasMerch = true;
                settleListData(data);
                let totalNum = Math.ceil(Number($scope.totalNum) / Number($scope.pageSize));
                $scope.$broadcast('page-data', {
                    pageSize: $scope.pageSize,
                    pageNum: $scope.currentPage,
                    totalNum: totalNum,
                    totalCounts: $scope.totalNum,
                    pageList: ['30', '50', '100']
                });
            }, function () {
                layer.msg('网络错误！');
            });
        }
        
        

        $scope.shoAllDrop = function () {
            // $scope.isDropMerchan = true;
            $scope.merchanStatus == '3';
            $scope.isAutoLinkMerch = false;
            $scope.isListedMerch = false;
            $scope.isOffAssMerch = false;
            $scope.dropFlag = '';
            $scope.currentPage = 1;
            $scope.getCurrentFirstList();
        }
        // 已刊登列表
        $scope.getListListed = function () {
            $scope.isListedMerch = true;
            $scope.isAutoLinkMerch = false;
            $scope.isOffAssMerch = false;
            $scope.dropFlag = 'list';
            $scope.currentPage = 1;
            $scope.getCurrentFirstList();
        }
        // $scope.getCurrentFirstList();

        $scope.getListAuto = function () {
            $scope.isAutoLinkMerch = true;
            $scope.isListedMerch = false;
            $scope.isOffAssMerch = false;
            // $scope.isDropMerchan = false;
            $scope.dropFlag = 'connect';
            $scope.currentPage = 1;
            $scope.getCurrentFirstList();
        }
        $scope.getListOffAss = function () {
            $scope.isOffAssMerch = true;
            $scope.isAutoLinkMerch = false;
            $scope.isListedMerch = false;
            $scope.dropFlag = 'assign';
            $scope.currentPage = 1;
            $scope.getCurrentFirstList();
        }

        // 选中当前商品
        $scope.checkAllMark = false;
        $scope.checkMerchArr = [];
        $scope.checkMerch = function (item, index, e) {
            if (item.checked && $scope.checkMerchArr.length > 0 && item.isCopy != $scope.checkMerchArr[0].isCopy) {
                layer.msg('请选择同类型的商品批量操作');
                e.preventDefault();
                return;
            }
            if (item.checked) {
                $scope.checkMerchArr.push(item);
            } else {
                $scope.checkMerchArr.splice($scope.checkMerchArr.indexOf(item), 1);
            }
            var checkedNum = 0;
            for (var i = 0; i < $scope.merchList.length; i++) {
                if ($scope.merchList[i]['checked'] == true) {
                    checkedNum++;
                }
            }
            // console.log(checkedNum);
            if (checkedNum == $scope.merchList.length) {
                $scope.checkAllMark = true;
            } else {
                $scope.checkAllMark = false;
            }
        }

        // 选中所有商品
        $scope.checkAllMerch = function (checkAllMark, e) {
            if (checkAllMark) {
                var temArr = [];
                for (var i = 0; i < $scope.merchList.length; i++) {
                    if (temArr.indexOf($scope.merchList[i].isCopy) == -1) {
                        temArr.push($scope.merchList[i].isCopy);
                    }
                }
                if (temArr.length > 1) {
                    layer.msg('请选择同类型的商品批量操作');
                    e.preventDefault();
                    return;
                }
                $scope.checkMerchArr = $scope.merchList;
            } else {
                $scope.checkMerchArr = [];
            }
            for (var i = 0; i < $scope.merchList.length; i++) {
                $scope.merchList[i].checked = checkAllMark;
            }

            // merchan.checkAllMerch(checkAllMark, $scope.merchList)
        }

        // 搜索
        $scope.getSearchList = function () {
            $scope.currentPage = 1;
            $scope.needOptimisation = false;
            if ($scope.isListedMerch) {
                $scope.getCurrentFirstList();
                return;
            }
            $scope.getCurrentFirstList();
        }
        setTimeout(()=>{
            document.getElementById('searchVal').focus();
        },0)
        $scope.enterSearch = function (event) {// 回车 搜索 。。
            if (event.keyCode == 13) {
                let regPos = /^\d+$/;
                if($scope.topSearchVal && regPos.test(+$scope.topSearchVal)&&$scope.topSearchVal.length>9){
                    document.getElementById('searchVal').select();
                    $scope.topSearchVal=$scope.topSearchVal.substring(0,$scope.topSearchVal.length-7);
                }
                $scope.getSearchList();
            }
        }
        $scope.selectSearch = function(){
            if (event.keyCode == 13) {
                document.getElementById('searchVal').select();
            }
        }
        $scope.goSearchAuth = function () {
            $scope.getCurrentFirstList();
        }
        // 收起筛选
        $scope.showHideSerch = function ($event) {
            var $this = $($event.currentTarget);
            $(".drop-down-search").slideToggle("normal");
            $this.toggleClass("show");
            if ($this.hasClass("show")) {
                $this.find('.text').html('收起筛选');
                $this.find('.caret').css('transform', 'rotate(180deg)');
            } else {
                $this.find('.text').html('展开筛选');
                $this.find('.caret').css('transform', 'rotate(0deg)');
            }
        }
        $scope.afterGetSearch = function () {
            merchan.getCateListOne(function (data) {
                $scope.categoryListOne = data;
            });
            $('.serch-by-property').find('input[type=checkbox]').click(function () {
                if ($(this).prop('checked') == true) {
                    if ($.inArray($(this).val(), $scope.searchProperVals) == -1) {
                        $scope.searchProperVals.push($(this).val());
                        $scope.getSearchList();
                    }
                } else {
                    if ($.inArray($(this).val(), $scope.searchProperVals) != -1) {
                        $scope.searchProperVals.splice($.inArray($(this).val(), $scope.searchProperVals), 1);
                        $scope.getSearchList();
                    }
                }
            });
            $('.serch-by-material').find('input[type=checkbox]').click(function () {
                if ($(this).prop('checked') == true) {
                    if ($.inArray($(this).val(), $scope.searchMateVals) == -1) {
                        $scope.searchMateVals.push($(this).val());
                        $scope.getSearchList();
                    }
                } else {
                    if ($.inArray($(this).val(), $scope.searchMateVals) != -1) {
                        $scope.searchMateVals.splice($.inArray($(this).val(), $scope.searchMateVals), 1);
                        $scope.getSearchList();
                    }
                }
            });
        }

        // 搜索商品类目
        $scope.showCategory = function () {
            $('.cate-list-box').show();
        }
        $scope.selectCategory = function ($event, id) {
            var thirdMenu = $($event.target).html();
            $('.search-cate-name').find('.text').html(thirdMenu);
            if (id) {
                $('.search-cate-name').find('.text').attr('id', id);
            } else {
                $('.search-cate-name').find('.text').attr('id', '');
            }
            $('.cate-list-box').hide();
            $scope.getSearchList();
        }
        // 搜索消费人群
        $scope.showConsumerList = function () {
            $('.consumer-list-box').show();
            merchan.getCustomerListOne(function (data) {
                $scope.consumerListOne = data;
            });
        }
        $scope.getConsumerSecondList = function (id) {
            merchan.getCustomerListTwo(id, function (data) {
                $scope.consumerListTwo = data;
            });
        }
        $scope.getConsumerThirdList = function (id) {
            merchan.getCustomerListThree(id, function (data) {
                $scope.consumerListThird = data;
                if (data[0] == null) {
                    $('.consumer-list-box').find('.grade-three-ul').hide();
                }
            });
        }
        $scope.selectConsumer = function ($event, id) {
            var thirdMenu = $($event.target).html();
            $('.consumer-group-name').find('.text').html(thirdMenu);
            if (id) {
                $('.consumer-group-name').find('.text').attr('id', id);
            } else {
                $('.consumer-group-name').find('.text').attr('id', '');
            }
            $('.consumer-list-box').hide();
            $scope.getSearchList();
        }

        $scope.changeListStatus = function (listStatus) {
            if (listStatus) {
                $scope.merchanFlag = '1';
                $scope.getCurrentFirstList();
            } else {
                $scope.merchanFlag = '0';
                $scope.getCurrentFirstList();
            }
        }

        $scope.stopPropagation = function (e) {
            e.stopPropagation();
        }
        $scope.dropEdit = function (item) {
            window.open('manage.html#/merchandise/edit-detail/' + item.id + '/' + 1 + '/' + $scope.merchanStatus + '/' + (item.productType || 0), '_blank', '');
        }
        $scope.moduleList = function (item) {// 进入当前商品的多语言模板列表
            window.open('manage.html#/merchandise/module-list/' + item.id + '/' + item.sku, '_blank', '');
        }
        // productDoc
        $scope.proDocBtnShow = false
        // function checkJob(job){return job=='管理' || job=='运营' || job=='销售' || job=='客服'}
        function checkJob(job){return job=='管理'}
        function proDocShow(){// 商品档案按钮权限
            var userInfo = erp.getUserInfo()
            var flag = false
            if(checkJob(userInfo.job)) flag = true
            $scope.proDocBtnShow = flag
        }
        proDocShow()
        $scope.productDoc = function (item) {// 进入当前商品的商品档案
            window.open('manage.html#/merchandise/show-detail-new/' + item.id + '/' + $scope.merchanFlag + '/' + $scope.merchanStatus + '/' + (item.productType || 0), '_blank', '');
        }
        $scope.productPurOrRiv = function (item) {// 进入当前商品的商品档案
            window.open('manage.html#/erppurchase/updateSupplierLink/' + item.id + '/' + $scope.merchanFlag + '/' + $scope.merchanStatus + '/' + (item.productType || 0), '_blank', '');
        }
        $scope.detailEdit = function (item) {
            if (!$scope.isAdminLogin && item.productType == '1') {
                layer.msg('服务商品仅管理员可以修改');
                return;
            }
            if ($scope.merchanStatus == '1') {
                window.open('manage.html#/merchandise/edit-detail/' + item.id + '/' + item.isCopy + '/' + $scope.merchanStatus + '/' + (item.productType || 0), '_blank', '');
            } else {
                window.open('manage.html#/merchandise/edit-detail/' + item.id + '/' + $scope.merchanFlag + '/' + $scope.merchanStatus + '/' + (item.productType || 0), '_blank', '');
            }
        }
        $scope.showDetail = function (item) {
            window.open('manage.html#/merchandise/show-detail/' + item.id + '/' + (item.isCopy || '0') + '/' + $scope.merchanStatus + '/' + (item.productType || 0), '_blank', '');
        }
        $scope.likeDetail = function (item) {
            window.open('manage.html#/merchandise/show-detail/' + item.id + '/' + (item.isCopy || '0') + '/' + $scope.merchanStatus + '/' + (item.productType || 0), '_blank', '');
        }
        $scope.toFrontDetail = function (id) {
            if ($scope.merchanStatus != '3') return;
            var toUrl = window.open();
            if ($scope.merchanStatus == '3') {
                // cj/locProduct/rollToken
                erp.getFun('cj/locProduct/rollToken?id=' + id, function (data) {
                    var data = data.data;
                    if (data.statusCode != 200) {
                        console.log(data);
                        return;
                    }
                    var detailToken = data.result;
                    if (window.environment === '##development##') { //开发
                        toUrl.location.href = 'https://app.cjdropshipping.com/product-detail.html?id=' + id + '&token=' + detailToken;
                    } else if (window.environment === '##test##') { //测试
                        toUrl.location.href = 'http://app.test.com/product-detail.html?id=' + id + '&token=' + detailToken;
                    } else if (window.environment === '##production##') { //线上
                        toUrl.location.href = 'https://app.cjdropshipping.com/product-detail.html?id=' + id + '&token=' + detailToken;
                    } else if (window.environment === '##production-cn##') { //线上
                        toUrl.location.href = 'https://app.cjdropshipping.cn/product-detail.html?id=' + id + '&token=' + detailToken;
                    }

                }, function (err) {
                    console.log(err);
                });
            }
        }

        // 修改类目
        $scope.rListAfterChCate = function (merchId, cateId, cateName) {
            if ($.isArray(merchId)) {
                for (var i = 0; i < merchId.length; i++) {
                    var changeIndex = erp.findIndexByKey($scope.merchList, 'id', merchId[i]);
                    $('.merchan-list-con').eq(changeIndex).find('.li-category').html(cateName);
                    $scope.merchList[changeIndex].categoryId = cateId;
                    if ($scope.searchCateName) {
                        if (cateId != $scope.searchCateName) {
                            $('.merchan-list-con-wrap').eq(changeIndex).remove();
                            $scope.merchList.splice(changeIndex, 1);
                            // console.log(changeIndex);
                        }
                    }
                }
            } else {
                var changeIndex = erp.findIndexByKey($scope.merchList, 'id', merchId);
                $('.merchan-list-con').eq(changeIndex).find('.li-category').html(cateName);
                $scope.merchList[changeIndex].categoryId = cateId;
                if ($scope.searchCateName) {
                    if (cateId != $scope.searchCateName) {
                        $('.merchan-list-con-wrap').eq(changeIndex).remove();
                        $scope.merchList.splice(changeIndex, 1);
                    }
                }
            }
        }
        $scope.changeCate = function (item) {
            merchan.changeCate(item, $scope, '2', function (idsArr, changeCateId, changeCateName) {
                $scope.rListAfterChCate(idsArr, changeCateId, changeCateName);
            });
        }
        $scope.banchChangeCate = function () {
            var changeIds = merchan.getBanchIds($scope.merchList);
            if (changeIds.length == 0) {
                layer.msg('请选择商品！');
                return false;
            }
            merchan.changeCate(changeIds, $scope, '2', function (idsArr, changeCateId, changeCateName) {
                $scope.rListAfterChCate(idsArr, changeCateId, changeCateName);
            });
        }

        $scope.offlineAssign = function (item) {
            merchan.offLineAssign(item, $scope);
        }

        $scope.rListAfterChAuth = function (merchId, flag, userInfo) {
            var changeIndex = erp.findIndexByKey($scope.merchList, 'id', merchId);
            // $('.merchan-list-con').eq(changeIndex).find('.li-authority').html(flag == '1' ? '全部可见' : '部分可见');
            /* if (flag == '1') {
                $('.merchan-list-con').eq(changeIndex).find('.li-authority').html('全部可见').removeClass('add-cursor');
            } else {
                $('.merchan-list-con').eq(changeIndex).find('.li-authority').html('部分可见').addClass('add-cursor');
            } */
            $scope.merchList[changeIndex].authorityStatus = flag * 1;

            if (flag == '1') {
                $scope.merchList[changeIndex].autAccId = {};
            } else {
                var tem = $scope.merchList[changeIndex].autAccId;
                console.log(tem);
                if (tem == '') {
                    tem = {};
                }
                // tem = JSON.parse(tem);
                tem[userInfo.id] = {
                    id: userInfo.id,
                    loginName: userInfo.loginName,
                    name: userInfo.name,
                    operator: $scope.userName,
                    autAccDate: {
                        time: new Date().getTime()
                    }
                }
                $scope.merchList[changeIndex].autAccId = tem;
                $scope.merchList[changeIndex].authorityStatus = 0;
                $scope.$apply();
                // $scope.merchList[changeIndex].autAccId = JSON.stringify(tem);
            }
        }

        $scope.authoOneUser = function (item) {
            merchan.authoOneUser(item, $scope, function (userInfo) {
                $scope.rListAfterChAuth(item.id, '0', userInfo);
            });
        }
        $scope.authoAllUser = function (item) {
            layer.open({
                title: null,
                type: 1,
                area: ['374px', '290px'],
                skin: 'offline-assign-layer',
                closeBtn: 0,
                shade: [0.1, '#000'],
                content: '<h5>全部可见</h5><p class="is-concern">确定全部可见?</p>',
                btn: ['取消', '确认'],
                yes: function (index, layero) {
                    layer.close(index);
                },
                btn2: function (index, layero) {
                    var authoUserData = {
                        productId: item.id,
                        autAccId: '',
                        autAccName: '',
                        autAccPhone: '',
                        flag: '0'
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
                            layer.msg('服务器错误，操作失败！');
                            return false;
                        }
                        layer.msg('操作成功');
                        $scope.rListAfterChAuth(item.id, '1');
                        layer.close(index);
                    });
                    return false //开启该代码可禁止点击该按钮关闭
                }
            });
        }
        // 展示可见用户
        var deleteUserId;
        $scope.showPartUsers = function (item) {
            // if (item.authorityStatus == 1) return;
            $scope.nowOpeItem = item;
            deleteUserId = [];
            var getUrl;
            if (item.authorityStatus == 1) {
                getUrl = 'pojo/product/getAssignAccount?pid=';
            } else {
                getUrl = 'pojo/product/getAutAcc?pid=';
            }
            layer.load(2);
            erp.getFun(getUrl + item.id, function (data) {
                layer.closeAll('loading');
                var data = data.data;
                if (item.authorityStatus == 0) {
                    if (data.statusCode == 204) {
                        layer.msg(data.message);
                        return;
                    }
                    if (!data.result) {
                      layer.msg('还未设定可见用户');
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
            if (deleteUserId.length > 0 && $scope.nowOpeItem.authorityStatus == 0) {
                var dUserData = {
                    pid: $scope.nowOpeItem.id,
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
                        $scope.nowOpeItem.authorityStatus = 1;
                        $scope.nowOpeItem.autAccId = '{}';
                    } else {
                        for (var i = 0; i < deleteUserId.length; i++) {
                            delete $scope.nowOpeItem.autAccId[deleteUserId[i]];
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

        $scope.freshListAfterOpe = function (opeIds, id) {
            if (id == 'deleteall') {
                $('.merchan-list-con-wrap').each(function () {
                    $(this).remove();
                });
                $scope.merchList = [];
                return;
            }
            if ($.isArray(opeIds)) {
                for (var i = 0; i < opeIds.length; i++) {
                    var changeIndex = erp.findIndexByKey($scope.merchList, 'id', opeIds[i]);
                    $('.merchan-list-con-wrap').eq(changeIndex).remove();
                    $scope.merchList.splice(changeIndex, 1);
                }
                if ($scope.checkAllMark) {
                    $scope.checkAllMark = false;
                }
                $scope.checkMerchArr = [];
                console.log($scope.checkMerchArr);
            } else {
                var changeIndex = erp.findIndexByKey($scope.merchList, 'id', id);
                $('.merchan-list-con-wrap').eq(changeIndex).remove();
                $scope.merchList.splice(changeIndex, 1);
            }
        }
        // 提交商品
        $scope.competitorLins = [];
        $scope.removeOneCompeLink = function (i) {
            $scope.competitorLins.splice(i, 1);
        }
        $scope.addOneCompeLink = function () {
            if (!$scope.addCompVal) {
                layer.msg('对手链接不能为空');
                return;
            }
            if (!$scope.addCompPri) {
                layer.msg('对手价格不能为空');
                return;
            }
            $scope.competitorLins.push({
                name: $scope.addCompVal,
                price: $scope.addCompPri
            });
            $scope.addCompVal = '';
            $scope.addCompPri = '';
        }
        $scope.spListCheckAll = function () {
            for (var i = 0; i < $scope.spVlist.length; i++) {
                $scope.spVlist[i].checked = $scope.spListChecked;
            }
        }
        $scope.checkOne = function (check) {
            if (!check) {
                $scope.spListChecked = false;
            } else {
                var checkNum = 0;
                for (var i = 0; i < $scope.spVlist.length; i++) {
                    if ($scope.spVlist[i].checked) {
                        checkNum++;
                    }
                }
                if (checkNum == $scope.spVlist.length) {
                    $scope.spListChecked = true;
                }
            }
        }
        $scope.shiSuanRes = function (arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].logisticName == $scope.wuliuway) {
                    return arr[i].price;
                }
            }

        }
        $scope.updataRivalLink = function () {
            layer.load(2);
            erp.postFun('pojo/product/updateRivalLink', {
                "rivalLink": $scope.competitorLins,
                "pid": $scope.submitItem.id
            }, function (data) {
                layer.closeAll('loading');
                console.log(data);
                if (data.data.statusCode == 200) {
                    layer.msg('操作成功');
                    competitorLinsSave = JSON.parse(JSON.stringify($scope.competitorLins));
                    $scope.submitItem.competSubmit = 1;
                } else {
                    layer.msg('操作失败');
                }
            });
        }
        $scope.goBanSetPrice = function () {
            if (!$scope.banchPrice) return;
            var checkNum = 0;
            for (var i = 0; i < $scope.spVlist.length; i++) {
                if ($scope.spVlist[i].checked) {
                    checkNum++;
                    $scope.spVlist[i].sellPrice = $scope.banchPrice;
                }
            }
            if (checkNum == 0) {
                layer.msg('请勾选需要批量设置价格的变体');
            }
        }
        var competitorLinsSave = []; // 已保存的对手链接数据
        $scope.chanTargetCoun = function () {
            layer.load(2);
            erp.postFun('pojo/product/getSourceVariantAndRival', {
                "pid": $scope.submitItem.id,
                "countryCode": $scope.sourceTargetCoun
            }, function (data) {
                layer.closeAll('loading');
                console.log(data);
                if (data.data.statusCode == 200) {
                    var result = JSON.parse(data.data.result);
                    console.log(result);
                    $scope.setPriceBeforeSubmitFlag = true;
                    $scope.spVlist = result.variants;
                    // $scope.sourceTargetPri = result.variants[0].targetPrice;
                    $scope.competitorLins = result.variants[0].rivalLink || [];
                    competitorLinsSave = JSON.parse(JSON.stringify($scope.competitorLins));
                    $scope.wuliulist = result.logSet;
                    $scope.wuliuway = result.logSet[0];
                    $scope.spListChecked = false;
                }

            });
        }
        $scope.goSetPriceAndSave = function () {
            console.log(competitorLinsSave)
            if (competitorLinsSave && competitorLinsSave.length == 0) {
                layer.msg('请先新增并保存对手链接');
                return;
            }
            var temArr = [];
            for (var i = 0; i < $scope.spVlist.length; i++) {
                if ($scope.spVlist[i].sellPrice == '' || $scope.spVlist[i].sellPrice == '0' || $scope.spVlist[i].sellPrice == 0) {
                    layer.msg('变体价格不能为空或0');
                    console.log(angular.element('#sell-price-list').find('.price-in').eq(i));
                    angular.element('#sell-price-list').find('.price-inp').eq(i).blur().focus();

                    return;
                } else {
                    temArr.push({
                        id: $scope.spVlist[i].id,
                        sellPrice: $scope.spVlist[i].sellPrice
                    });
                }
            }
            var submitData = {};
            submitData.ids = $scope.submitItem.id;
            submitData.flag = '0';
            submitData.variants = temArr;
            layer.load(2);
            erp.postFun('pojo/product/submit', JSON.stringify(submitData), function (data) {
                layer.closeAll('loading');
                var data = data.data;
                if (data.statusCode != 200) {
                    layer.msg('服务器错误，操作失败！');
                    return false;
                }
                layer.msg('提交成功');
                $scope.freshListAfterOpe(undefined, submitData.ids);
                $scope.setPriceBeforeSubmitFlag = false;
                $scope.competitorLins = [];
                $scope.spVlist = [];
                console.log(data);
            });
        }
        erp.postFun('app/logistic/getcountry', null, function (data) {
            if (data.data.statusCode == 200) {
                $scope.countrylist = JSON.parse(data.data.result).countryList;
            }
        })
        $scope.showBigImg = function (img) {
            layer.open({
                area: ['500px', '500px'],
                title: '商品图片',
                content: '<img style="width: 100%; max-width: 100%; max-height: 100%;" src="' + img + '" alt="" />'
            });
        }
        $scope.zhekouList = [];
        $scope.competitorLins = [];
        $scope.goActSubmit = function (item) {
            $scope.submitItem = item;
            if (item && item.isCopy != 1 && item.shangJiaStatus != 1 && (item.origin == '1' || item.origin == '2' || item.origin == '4')) {
                layer.load(2);
                erp.postFun('pojo/product/getSourceVariantAndRival', {
                    "pid": item.id,
                    "countryCode": 'US'
                }, function (data) {
                    layer.closeAll('loading');
                    console.log(data);
                    if (data.data.statusCode == 200) {
                        var zhekouList = localStorage.getItem('zhekouList');
                        if (zhekouList == '' || zhekouList == null || zhekouList == undefined) {
                            var sendData = {
                                param: "",
                                status: '1'
                            }
                            erp.load();
                            erp.postFun('app/erplogistics/queryLogisticMode', JSON.stringify(sendData), function (n) {
                                erp.closeLoad();
                                console.log(n);
                                $scope.zhekouList = n.data.result;
                                localStorage.setItem('zhekouList', JSON.stringify(n.data.result));
                                console.log($scope.zhekouList);
                            }, function () {
                                erp.closeLoad();
                            });
                        } else {
                            $scope.zhekouList = JSON.parse(zhekouList);
                            console.log($scope.zhekouList);
                        }

                        var result = JSON.parse(data.data.result);
                        console.log(result);
                        $scope.setPriceBeforeSubmitFlag = true;
                        for (var i = 0; i < result.variants.length; i++) {
                            result.variants[i].costPrice = erp.REM2USD(result.variants[i].costPrice);
                        }
                        $scope.spVlist = result.variants;
                        $scope.source = result.source;
                        // $scope.sourceTargetPri = result.variants[0].targetPrice;
                        $scope.competitorLins = result.variants[0].rivalLink || [];
                        competitorLinsSave = JSON.parse(JSON.stringify($scope.competitorLins));
                        $scope.wuliulist = result.logSet;
                        if (result.logSet.indexOf('ePacket') != -1) {
                            $scope.wuliuway = 'ePacket';
                        } else {
                            $scope.wuliuway = result.logSet[0];
                        }
                        $scope.submitItem.competSubmit = 0;
                    }

                });
                $scope.sourceTargetCoun = 'US';
                return;
            }

            var opeIds;
            var flag;
            var id;
            if (item == undefined) {
                if ($scope.checkMerchArr.length == 0) {
                    layer.msg('请选择商品！');
                    return false;
                }
                opeIds = [];
                for (var i = 0; i < $scope.checkMerchArr.length; i++) {
                    if ($scope.checkMerchArr[i].isCopy != 1 && $scope.checkMerchArr[i].shangJiaStatus != '1' && ($scope.checkMerchArr[i].origin == '1' || $scope.checkMerchArr[i].origin == '2' || $scope.checkMerchArr[i].origin == '4')) {
                        layer.msg('搜品录入的商品只能单个提交');
                        return;
                    }
                    opeIds.push($scope.checkMerchArr[i].id);
                }
                id = opeIds.join(',');
                if ($scope.merchanStatus == '1') {
                    flag = $scope.checkMerchArr[0].isCopy + '';
                } else {
                    flag = '0';
                }
            } else {
                id = item.id;
                if ($scope.merchanStatus == '1') {
                    flag = item.isCopy + '';
                } else {
                    flag = '0';
                }
            }

            layer.open({
                title: null,
                type: 1,
                area: ['374px', '290px'],
                skin: 'offline-assign-layer',
                closeBtn: 0,
                shade: [0.1, '#000'],
                content: '<h5>提交商品</h5><p class="is-concern">确定提交商品?</p>',
                btn: ['取消', '确认'],
                yes: function (index, layero) {
                    layer.close(index);
                },
                btn2: function (index, layero) {
                    var submitData = {};
                    submitData.ids = id;
                    submitData.flag = flag;
                    erp.postFun('pojo/product/submit', JSON.stringify(submitData), function (data) {
                        var data = data.data;
                        if (data.statusCode != 200) {
                            layer.msg('服务器错误，操作失败！');
                            return false;
                        }
                        layer.msg('提交成功', {
                            time: 1000
                        }, function () {
                            console.log(opeIds);
                            $scope.freshListAfterOpe(opeIds, id);
                            // getItemNums();
                            layer.close(index);
                        });
                        console.log(data);
                    }, function (err) {
                        layer.msg('网络错误');
                    });
                    return false //开启该代码可禁止点击该按钮关闭
                }
            });
        }

        $scope.classChengbenJia = function (arr) {
            // console.log(arr);
            var price;
            $.each(arr, function (i, v) {
                if (v.logisticName == $scope.wuliuway) {
                    // var price = v.price;
                    price = v.price;
                }
            });
            if ($scope.wuliuway == 'ePacket') {
                $scope.isEPacket = true;
                $scope.beijing = (price * 1.06).toFixed(2);
                $scope.yiwu = (price * 0.88).toFixed(2);
                $scope.shenzhen = (price * 0.98).toFixed(2);
            } else {
                $scope.isEPacket = false;

                var discount = 1;
                $.each($scope.zhekouList, function (i, v) {
                    if (v.nameen == $scope.wuliuway) {
                        discount = parseFloat(v.discount) / 100;
                    }
                });
                price = (price / discount).toFixed(2);
                // console.log($scope.zhekouList);
                return price;
            }

        }

        // 审核通过
        $scope.goActPass = function (item) {
            var opeIds;
            var flag;
            var id;
            var productType;
            if (item == undefined) {
                if ($scope.checkMerchArr.length == 0) {
                    layer.msg('请选择商品！');
                    return false;
                }
                opeIds = [];
                for (var i = 0; i < $scope.checkMerchArr.length; i++) {
                    opeIds.push($scope.checkMerchArr[i].id);
                }
                id = opeIds.join(',');
                flag = $scope.checkMerchArr[0].isCopy;
                productType = $scope.checkMerchArr[0].productType || 0;
            } else {
                id = item.id;
                flag = item.isCopy;
                productType = item.productType || 0;
            }
            layer.open({
                title: null,
                type: 1,
                area: ['374px', '290px'],
                skin: 'offline-assign-layer',
                closeBtn: 0,
                shade: [0.1, '#000'],
                content: '<h5>审核商品</h5><p class="is-concern">确定审核通过?</p>',
                btn: ['取消', '确认'],
                yes: function (index, layero) {
                    layer.close(index);
                },
                btn2: function (index, layero) {
                    var passData = {};
                    passData.ids = id;
                    // passData.flag = $scope.merchanFlag;
                    passData.flag = flag;
                    passData.isSuccess = 'true';
                    passData.productType = productType;
                    layer.load(2);
                    // erp.load();
                    erp.postFun('pojo/product/audit', JSON.stringify(passData), function (data) {
                        erp.closeLoad();
                        // $scope.isInAuth = false;
                        var data = data.data;
                        if (data.statusCode != 200) {
                            layer.msg('服务器错误，操作失败！');
                            return false;
                        }
                        layer.close(index);
                        layer.msg('操作成功', {
                            time: 1000
                        }, function () {
                            $scope.freshListAfterOpe(opeIds, id);
                            // getItemNums();
                        });
                    }, function (err) {
                        erp.closeLoad();
                        // $scope.isInAuth = false;
                        layer.msg('网络错误');
                    });
                    return false //开启该代码可禁止点击该按钮关闭
                }
            });

        }
        // 审核不通过
        $scope.goForbidPass = function (item) {
            var opeIds;
            var flag;
            var id;
            if (item == undefined) {
                if ($scope.checkMerchArr.length == 0) {
                    layer.msg('请选择商品！');
                    return false;
                }
                opeIds = [];
                for (var i = 0; i < $scope.checkMerchArr.length; i++) {
                    opeIds.push($scope.checkMerchArr[i].id);
                }
                id = opeIds.join(',');
                flag = $scope.checkMerchArr[0].isCopy;
            } else {
                id = item.id;
                flag = item.isCopy;
            }
            layer.open({
                title: null,
                type: 1,
                area: ['374px', '290px'],
                skin: 'offline-assign-layer forbid-pass-layer',
                closeBtn: 0,
                shade: [0.1, '#000'],
                content: $('#forbid-pass').html(),
                btn: ['取消', '确认'],
                success: function (layero, index) {
                    if (item == undefined) {
                        $(layero).find('.pro-info').hide();
                    } else {
                        $(layero).find('.pro-img').attr('src', item.bigImg)
                        $(layero).find('.pro-name').html(item.nameEn);
                        $(layero).find('.pro-sku').html(item.sku);
                    }
                },
                yes: function (index, layero) {
                    layer.close(index);
                },
                btn2: function (index, layero) {
                    console.log($scope.isInAuth2);
                    var forbidReason = $('#forbid-pass-reason').val() || '';
                    var passData = {};
                    passData.ids = id;
                    passData.flag = flag;
                    // passData.flag = $scope.merchanFlag;
                    passData.isSuccess = 'false';
                    passData.explain = forbidReason;
                    passData.productType = (item.productType || 0);
                    // $scope.isInAuth = true;
                    // erp.load();
                    layer.load(2);
                    erp.postFun('pojo/product/audit', JSON.stringify(passData), function (data) {
                        erp.closeLoad();
                        // $scope.isInAuth = false;
                        var data = data.data;
                        if (data.statusCode != 200) {
                            layer.msg('服务器错误，操作失败！');
                            return false;
                        }
                        layer.close(index);
                        layer.msg('操作成功', {
                            time: 1000
                        }, function () {
                            $scope.freshListAfterOpe(opeIds, id);
                            // getItemNums();
                        });
                    }, function (err) {
                        erp.closeLoad();
                        // $scope.isInAuth = false;
                        layer.msg('网络错误');
                    });
                    return false //开启该代码可禁止点击该按钮关闭
                }
            });
        }
        // 下架商品
        $scope.goActOffShelves = function (item) {
            var opeIds;
            var id;
            if (item == undefined) {
                opeIds = merchan.getBanchIds($scope.merchList);
                console.log(opeIds);
                // return
                if (opeIds.length == 0) {
                    layer.msg('请选择商品！');
                    return false;
                }
                id = opeIds.join(',');
            } else {
                id = item.id;
            }
            layer.open({
                title: null,
                type: 1,
                area: ['374px', '290px'],
                skin: 'offline-assign-layer forbid-pass-layer',
                closeBtn: 0,
                shade: [0.1, '#000'],
                content: $('#off-shelve').html(),
                btn: ['取消', '确认'],
                success: function (layero, index) {
                    if (item == undefined) {
                        $(layero).find('.pro-info').hide();
                    } else {
                        $(layero).find('.pro-img').attr('src', item.bigImg)
                        $(layero).find('.pro-name').html(item.nameEn);
                        $(layero).find('.pro-sku').html(item.sku);
                        if (item.authorityStatus == 1) {
                            layer.load(2);
                            erp.getFun('pojo/product/getAssignAccount?pid=' + item.id, function (data) {
                                layer.closeAll('loading');
                                var data = data.data;
                                var authUserInfo = JSON.parse(data.result);
                                console.log(authUserInfo);
                                if (authUserInfo.length == 0) {
                                    $(layero).find('.warn').hide();
                                } else {
                                    $(layero).find('.warn').html('该商品有指派关系！！').show();
                                }
                            }, function (err) {
                                layer.closeAll('loading');
                                layer.msg('网络错误');
                            });
                        } else {
                            $(layero).find('.warn').html('该商品是私有商品！！').show();
                        }
                        if (item.isClientDesign == '2') {
                            $(layero).find('.warn').html('该商品是客户设计商品！！').show();
                        }
                    }
                },
                yes: function (index, layero) {
                    layer.close(index);
                },
                btn2: function (index, layero) {
                    console.log($scope.isInAuth2);
                    var forbidReason = $('#off-shelve-reason').val() || '';
                    if (!forbidReason) {
                        layer.msg('请输入下架原因');
                        return false;
                    }
                    var passData = {};
                    passData.ids = id;
                    passData.explain = forbidReason;
                    if ($scope.merchType == '1') {
                        // 服务商品下架标记
                        passData.sign = '1';
                    }
                    layer.load(2);
                    erp.postFun('pojo/product/unshelve', JSON.stringify(passData), function (data) {
                        erp.closeLoad();
                        // $scope.isInAuth = false;
                        var data = data.data;
                        if (data.statusCode != 200) {
                            layer.msg('服务器错误，操作失败！');
                            return false;
                        }
                        layer.close(index);
                        layer.msg('操作成功', {
                            time: 1000
                        }, function () {
                            $scope.freshListAfterOpe(opeIds, id);
                            // getItemNums();
                        });
                    }, function (err) {
                        erp.closeLoad();
                        // $scope.isInAuth = false;
                        layer.msg('网络错误');
                    });
                    return false //开启该代码可禁止点击该按钮关闭
                }
            });
        }
        // 回收站
        // pojo/product/clearRecycle
        // {ids,flag}
        // 清空     ids="DELETEALL"  大小写不限    爬虫  flag=0   本地flag=1
        $scope.goActClear = function (id) {
            var opeIds;
            var passIds;
            if (id == undefined) {
                opeIds = merchan.getBanchIds($scope.merchList);
                console.log(opeIds);
                // return
                if (opeIds.length == 0) {
                    layer.msg('请选择商品！');
                    return false;
                }
                passIds = opeIds.join(',');
            } else if (id == 'deleteall') {
                opeIds = [];
                for (var i = 0; i < $scope.merchList.length; i++) {
                    opeIds.push($scope.merchList[i].id);
                }
                passIds = opeIds.join(',');
            } else {
                passIds = id;
            }
            // return console.log(passIds, $scope.merchList)
            layer.open({
                title: null,
                type: 1,
                area: ['374px', '290px'],
                skin: 'offline-assign-layer',
                closeBtn: 0,
                shade: [0.1, '#000'],
                content: id == 'deleteall' ? '<h5>清空回收站</h5><p class="is-concern">确定清空回收站?</p>' : '<h5>删除商品</h5><p class="is-concern">确定删除商品?</p>',
                btn: ['取消', '确认'],
                yes: function (index, layero) {
                    layer.close(index);
                },
                btn2: function (index, layero) {
                    var passData = {};
                    passData.ids = passIds;
                    passData.flag = '1';
                    erp.postFun('pojo/product/clearRecycle', JSON.stringify(passData), function (data) {
                        var data = data.data;
                        if (data.statusCode != 200) {
                            layer.msg('服务器错误，操作失败！');
                            return false;
                        }
                        layer.msg('删除成功', {
                            time: 1000
                        }, function () {
                            $scope.freshListAfterOpe(opeIds, id);
                            // getItemNums();
                            layer.close(index);
                            $scope.getSearchList();
                        });

                    }, function (err) {
                        layer.msg('网络错误');
                    });
                    return false //开启该代码可禁止点击该按钮关闭
                }
            });
        }

        // {ids,flag,explain}
        // 删除商品
        $scope.goActDelete = function (item) {
            var opeIds;
            var flag;
            var id;
            if (item == undefined) {
                var opeMerchs = [];
                for (var i = 0; i < $scope.merchList.length; i++) {
                    if ($scope.merchList[i].checked == true)
                        opeMerchs.push($scope.merchList[i]);
                }
                if (opeMerchs.length == 0) {
                    layer.msg('请选择商品！');
                    return false;
                }
                opeIds = [];
                for (var i = 0; i < opeMerchs.length; i++) {
                    if (opeMerchs[i].authorityStatus == 0 && !$scope.isAdminLogin) {
                        layer.msg('勾选的商品包含指定可见商品，指定可见商品不能删除！');
                        return false;
                    } else {
                        opeIds.push(opeMerchs[i].id);
                    }
                }
                id = opeIds.join(',');
                if ($scope.merchanStatus == '1') {
                    flag = opeMerchs[0].isCopy;
                    console.log(opeMerchs[0], flag);
                } else {
                    flag = $scope.merchanFlag;
                }
            } else {
                if (item.authorityStatus == 0 && !$scope.isAdminLogin) {
                    layer.msg('指定可见商品不能删除！');
                    return false;
                }
                id = item.id;
                if ($scope.merchanStatus == '1') {
                    flag = item.isCopy;
                } else {
                    flag = $scope.merchanFlag;
                }
            }
            layer.open({
                title: null,
                type: 1,
                area: ['374px', '290px'],
                skin: 'offline-assign-layer',
                closeBtn: 0,
                shade: [0.1, '#000'],
                content: '<h5>删除商品</h5><p class="is-concern">确定删除商品?</p>',
                btn: ['取消', '确认'],
                yes: function (index, layero) {
                    layer.close(index);
                },
                btn2: function (index, layero) {
                    var deleteData = {};
                    deleteData.ids = id;
                    // deleteData.flag = $scope.merchanFlag;
                    deleteData.flag = flag;
                    deleteData.explain = '';
                    deleteData = JSON.stringify(deleteData);
                    // console.log(deleteData);
                    erp.postFun('pojo/product/delete', deleteData, function (data) {
                        var data = data.data;
                        // var data = JSON.parse(data.data);
                        console.log(data);
                        if (data.statusCode == 200) {
                            layer.msg('删除成功', {
                                time: 2000
                            }, function () {
                                $scope.freshListAfterOpe(opeIds, id);
                                // getItemNums();
                                layer.close(index);
                            });
                        } else if (data.statusCode == 809) {
                            // alert('809');
                            if (item == undefined) {
                                var cannodeleteids = JSON.parse(data.result);
                                var cannodeletenum = cannodeleteids.length;
                                layer.msg('勾选的商品中有' + cannodeletenum + '个指派商品不能删除，其他删除成功', {
                                    time: 2000
                                }, function () {
                                    for (var i = 0; i < cannodeleteids.length; i++) {
                                        opeIds.splice($.inArray(cannodeleteids[i], opeIds), 1);
                                    }
                                    $scope.freshListAfterOpe(opeIds, id);
                                    // getItemNums();
                                    layer.close(index);
                                });
                            } else {
                                layer.msg('该商品已经指派给客户，不能删除！', {
                                    time: 2000
                                }, function () {
                                    // $scope.freshListAfterOpe(opeIds,id);
                                    // getItemNums();
                                    layer.close(index);
                                });
                            }
                        } else {
                            layer.msg('服务器错误，操作失败！');
                            return false;
                        }

                    }, function () {
                        layer.msg('网络错误！');
                    });
                    layer.close(index);
                    return false //开启该代码可禁止点击该按钮关闭
                }
            });
        }
        $scope.resetFun = function () {
            //console.log($('#searchGys'));
            $('#searchGys').val('');
            $scope.searchInformation = '';
            getSupplierCategory();
        }
        $scope.myfun = function (e) {
            var value = $(e.target).val();
            console.log(value)
            console.log($('.resetBtn'));
            console.log(e.keyCode)

            if (value == '' || value == undefined || value == null) {
                $('.resetBtn').hide();
            } else {
                $('.resetBtn').show();
            }
            if (e.keyCode != 13 && e.keyCode != 16) {
                return
            }
            $scope.searchInformation = value;
            getSupplierCategory();
        };
        // $scope.setSPFlag = true;
        //获取供应商
        //params
        $scope.searchInformation = '';
        getSupplierCategory();

        function getSupplierCategory() {
            console.log($scope.searchInformation)
            var data = {
                "params": $scope.searchInformation
            };
            erp.postFun('caigou/supplier/getSupplierCategory', JSON.stringify(data), function (data) {
                console.log(data.data.result);
                $scope.gysGsList = data.data.result;
            }, function (data) {
                console.log(data)
            })
        }
        $scope.setSupplyPrice = function (item, index) {
            $scope.opeProItem = item;
            $scope.opeProItem.index = index;
            erp.getFun('pojo/supplier/getSupplierPrice?pid=' + item.id, function (data) {
                console.log(data);
                if (data.data.statusCode != 200) {
                    layer.msg('获取供应商信息失败');
                    return;
                }
                $scope.setSPFlag = true;
                console.log(JSON.parse(data.data.result));
                var res = JSON.parse(data.data.result);
                var temArr = [];
                for (var i = 0; i < res.length; i++) {
                    temArr.push(i + 1);
                    res[i].banSetSPKey = 'price';
                    if (res[i].rank == 0) {
                        res[i].rank = String(res[i].rank * 1 + 1);
                    } else {
                        res[i].rank = String(res[i].rank);
                    }
                }
                $scope.buyLinks = res;
                res = null;
                $scope.gradeNums = temArr;
                temArr = null;
                console.log($scope.buyLinks);

            }, err)
        }

        $scope.dropWrapFun = function (index) {
            if ($('.selectWrap').eq(index).hasClass('aaa')) {
                $('.selectWrap').eq(index).removeClass('aaa').hide()
            } else {
                $('.selectWrap').eq(index).addClass('aaa').show();
            }
        }
        $scope.setGysFun = function (item, index) {
            console.log(index)
            console.log($scope.buyLinks[index]);
            $scope.buyLinks[index]['gysId'] = item.id;
            $scope.buyLinks[index]['gysGsName'] = item.gongSiMing;
            console.log($scope.buyLinks);
            $('.selectDropBtn').eq(index).children('span').eq(0).html(item.gongSiMing);
            $('.selectWrap').removeClass('aaa').hide();
        }
        $scope.selGsFun = function (item, index) {
            console.log(item.gysGsModel)
            console.log(index)
            console.log($scope.buyLinks[index])
            $scope.buyLinks[index]['gysId'] = item.gysGsModel.split('#')[1];
            $scope.buyLinks[index]['gysGsName'] = item.gysGsModel.split('#')[0];
            delete $scope.buyLinks[index].gysGsModel
            console.log($scope.buyLinks);

        }
        $scope.cancelSetSPF = function () {
            $scope.setSPFlag = false;
            $scope.buyLinks = [];
            $scope.opeProItem = null;
        }
        //console.log('111111')
        $scope.goSetSPF = function () {
            // erp.load();
            // layer.load(2);
            console.log($scope.buyLinks);
            console.log($scope.spHydModel)
            console.log($.trim($scope.spHydModel))
            if (!$.trim($scope.spHydModel)) {
                layer.msg('请输入货源地')
                return
            }
            var updataBuyLink = JSON.stringify($scope.buyLinks).replace(/"/g, "'");
            //console.log(updataBuyLink);
            //console.log($scope.buyLinks.length)
            for (var i = 0, len = $scope.buyLinks.length; i < len; i++) {
                console.log($scope.buyLinks[i]['gysId'])
                if (!$scope.buyLinks[i]['gysId']) {
                    layer.msg('请选择供应商')
                    return
                }
            }
            erp.postFun('caigou/supplier/bindSupplier', {
                'productId': $scope.opeProItem.id,
                'buyLinks': updataBuyLink
            }, function (data) {
                console.log(data)
            }, function (data) {
                console.log(data)
            })
            erp.postFun('pojo/supplier/setSupplierPrice', {
                'productId': $scope.opeProItem.id,
                'huoYuanDi': $.trim($scope.spHydModel),
                'buyLinks': updataBuyLink
            }, function (data) {
                layer.closeAll('loading');
                console.log(data);
                if (data.data.statusCode == 200) {
                    layer.msg('操作成功');
                    $scope.buyLinks = [];
                    $scope.setSPFlag = false;
                    if ($scope.merchanStatus == '6') {
                        $scope.merchList.splice($scope.opeProItem.index, 1);
                    }
                    // $scope.merchList.splice($scope.opeProItem.index,1);
                    // getItemNums();
                } else {
                    layer.msg('操作失败');
                }
            }, err);

        }
        $scope.checkAllLinkv = function (index, check) {
            for (var i = 0; i < $scope.buyLinks[index].vPrices.length; i++) {
                $scope.buyLinks[index].vPrices[i].checked = check;
            }
        }
        $scope.checkOneLinkv = function (index1, index2, check) {
            $scope.buyLinks[index1].vPrices[index2].checked = check;
            if (getLinkCheckNums($scope.buyLinks[index1].vPrices) == $scope.buyLinks[index1].vPrices.length) {
                $scope.buyLinks[index1].checked = true;
            } else {
                $scope.buyLinks[index1].checked = false;
            }
        }

        function getLinkCheckNums(arr) {
            var temNum = 0;
            console.log(arr);
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].checked == true) {
                    temNum++;
                }
            }
            return temNum;
        }

        $scope.goBanSetSP = function (index1, val, key) {
            console.log(index1, val, key);
            if (getLinkCheckNums($scope.buyLinks[index1].vPrices) == 0) {
                layer.msg('请勾选您需要批量操作的sku');
                return;
            }
            for (var i = 0; i < $scope.buyLinks[index1].vPrices.length; i++) {
                if ($scope.buyLinks[index1].vPrices[i].checked == true) {
                    if (key == 'price') {
                        $scope.buyLinks[index1].vPrices[i].costPrice = val;
                    }
                    if (key == 'number') {
                        $scope.buyLinks[index1].vPrices[i].minCount = val;
                    }
                }
            }
        }
        $scope.addOneLinkV = function (index1, index2, itemv) {
            $scope.buyLinks[index1].vPrices.splice(index2 + 1, 0, {
                variantId: itemv.variantId,
                costPrice: '',
                img: itemv.img,
                minCount: '',
                sku: itemv.sku,
                isSupplier: '0'
            });
        }
        $scope.removeOneLinkV = function (index1, index2, itemv) {
            $scope.buyLinks[index1].vPrices.splice(index2, 1);
        }
        $scope.stopSupply = function (index1, index2, check) {
            console.log(check);
            $scope.buyLinks[index1].vPrices[index2].isSupplier = (check == 0 ? '1' : '0');
            console.log($scope.buyLinks[index1].vPrices[index2].isSupplier);
        }
        $scope.verifyIsNum = function (val, index1, index2, tag) {
            console.log(val);
            if (isNaN(val * 1)) {
                if (index2 >= 0) {
                    if (tag == 'count') {
                        $scope.buyLinks[index1].vPrices[index2].minCount = '';
                    }
                    if (tag == 'price') {
                        $scope.buyLinks[index1].vPrices[index2].costPrice = '';
                    }
                } else {
                    $scope.buyLinks[index1].banSetSPVal = '';
                }
            }
        }
        $scope.linkStars = 5;
        $scope.addLinkStars = 5;
        $scope.changeBuyLinkStar = function (num, index) {
            console.log(index);
            if (index >= 0) {
                $scope.buyLinks[index].star = num;
                temStarNum = null;
                return;
            }
            $scope.addLinkStars = num;
            temAddStarNum = null;
        }
        var temStarNum, temAddStarNum;
        $scope.showYellStar = function (num, index) {
            if (index >= 0) {
                temStarNum = $scope.buyLinks[index].star;
                $scope.buyLinks[index].star = num;
                return;
            }
            temAddStarNum = $scope.addLinkStars;
            $scope.addLinkStars = num;
        }
        $scope.hideYellStar = function (num, index) {
            if (index >= 0) {
                if (temStarNum) {
                    $scope.buyLinks[index].star = temStarNum;
                    temStarNum = null;
                }
            }
            if ($scope.addSupplyFlag) {
                if (temAddStarNum) {
                    $scope.addLinkStars = temAddStarNum;
                    temAddStarNum = null;
                }
            }
        }
        $scope.goAddSupply = function () {
            if (!$scope.addLinkName) {
                layer.msg('采购链接不能为空');
                return;
            }
            // erp.load();
            layer.load(2);
            erp.postFun('pojo/supplier/updateSupplierLink', JSON.stringify({
                supplierLink: $scope.addLinkName,
                star: $scope.addLinkStars,
                pid: $scope.opeProItem.id
            }), function (data) {
                layer.closeAll('loading');
                console.log(data);
                if (data.data.statusCode != 200) {
                    layer.msg('操作失败');
                    return;
                }
                layer.msg('操作成功');
                $scope.addSupplyFlag = false;
                $scope.addLinkStars = 5;
                $scope.addLinkName = '';
                var res = JSON.parse(data.data.result);
                res.vPrices = res.vPrice;
                console.log(res);
                res.rank = '1';
                delete res.vPrice;
                $scope.gradeNums.push($scope.gradeNums.length + 1);
                $scope.buyLinks.unshift(res);
            }, err);
        }
        $scope.removeOneLink = function (item, index) {
            $scope.removeSupply = item;
            $scope.removeSupply.index = index;
            $scope.removeSupplyFlag = true;
        }
        $scope.goRemoveSupply = function () {
            // erp.load();
            layer.load(2);
            erp.postFun('pojo/supplier/deleteSupplier', JSON.stringify({
                supplierLink: $scope.removeSupply.supplierLink,
                pid: $scope.opeProItem.id
            }), function (data) {
                layer.closeAll('loading');
                console.log(data);
                if (data.data.statusCode != 200) {
                    layer.msg('操作失败');
                    return;
                }
                layer.msg('操作成功');
                $scope.removeSupplyFlag = false;
                console.log($scope.gradeNums);
                $scope.gradeNums.splice($scope.gradeNums.length - 1, 1);
                console.log($scope.gradeNums);
                $scope.buyLinks.splice($scope.removeSupply.index, 1);
                for (var i = 0; i < $scope.buyLinks.length; i++) {
                    if ($scope.buyLinks[i].rank * 1 > $scope.gradeNums.length) {
                        $scope.buyLinks[i].rank = $scope.gradeNums.length + '';
                    }
                }
            }, err);
        }

        $scope.setPrivForever = function (item, i) {
            merchan.opePrivForever(item, '1', function () {
                $scope.merchList[i].isAut = '1';
                $scope.$apply();
            })
        }
        $scope.cancelPrivForever = function (item, i) {
            merchan.opePrivForever(item, '0', function () {
                $scope.merchList[i].isAut = '0';
                $scope.$apply();
            })
        }

        function err(err) {
            erp.closeLoad();
            layer.msg('网络错误！');

        }

        //上传视频--------------------------------------------------------------
        //$scope.videoLink = [];
        $scope.videoList = [];
        //$scope.path = '';
        $scope.isFree = '0';
        //$scope.$apply();
        $scope.UploadVideo = function (item) {
            console.log(item)
            $scope.videoId = item.id;
            $scope.videoNumber = item.sku;
            $scope.isvideo = true;
            $('#uploadVideoText').html('');
            //$scope.path = '';
            //$('#upvideo').val('');
            getvideo();
        }

        function getvideo() {
            erp.load();
            erp.postFun('app/businessVideo/selectVideoListByLocProductId', {
                LocProductId: $scope.videoId
            }, function (data) {
                console.log(data)
                layer.closeAll("loading")
                if (data.data.code == 200) {
                    $scope.videoList = data.data.videoList;
                    console.log($scope.videoList)
                } else {
                    layer.msg('加载失败')
                }
            }, function (data) {
                layer.closeAll("loading")
            })
        }

        $scope.uplodvideo = function () {
            if (!$scope.videoUrl) {
                layer.msg('输入视频链接')
            } else if (!$scope.videoName) {
                layer.msg('输入视频名称')
            } else if (!$scope.copyrightPrice || !$scope.notCopyrightPrice) {
                layer.msg('输入视频价格')
            } else {
                var data = {
                    videoNumber: $scope.videoNumber,
                    locProductId: $scope.videoId,
                    videoName: $scope.videoName,
                    copyrightPrice: $scope.copyrightPrice,
                    notCopyrightPrice: $scope.notCopyrightPrice,
                    isFree: $scope.isFree,
                    videoUrl: $scope.videoUrl
                }
                erp.load(2);
                erp.postFun('tool/video/uploadVideo', data, function (data) {
                    console.log(data)
                    layer.closeAll("loading");
                    if (data.data.statusCode == 200) {
                        layer.msg('添加成功');
                        $scope.videoName = '';
                        $scope.videoUrl = '';
                        $scope.copyrightPrice = '';
                        $scope.notCopyrightPrice = '';
                        getvideo();
                    } else {
                        layer.msg('添加失败')
                    }
                }, function (data) {
                    layer.closeAll("loading")
                })
                //erp.loadfile();
                /*   erp.ossFun('upvideo').then((res) => {
                       // 请求成功的结果
                       console.log(res);

                   })*/
            }
        }
        $scope.videoState = function (s) {
            if (s == '0') {
                return '正在上传中'
            } else if (s == '1') {
                return '加水印中'
            } else if (s == '2') {
                return '上传服务器中'
            } else if (s == '3') {
                return '上传完成'
            } else if (s == '4') {
                return '上传失败'
            }
        }
        //
        $scope.videosrc = function (url) {
            return $sce.trustAsResourceUrl('https://' + url);
        }
        //上架or下架
        $scope.Shelves = function (item) {
            console.log(item)
            var state;
            if (item.videoState == 'ON_STATE') {
                console.log('下架')
                state = 'DOWN_STATE'
            } else if (item.videoState == 'DOWN_STATE') {
                console.log('上架')
                state = 'ON_STATE'
            }
            erp.postFun('app/businessVideo/updateVideoById', {
                id: item.id,
                videoState: state
            }, function (data) {
                console.log(data)
                if (data.data.code == 200) {
                    layer.msg('操作成功');
                    getvideo();
                } else {
                    layer.msg('操作失败')
                }
            }, function (data) {
                layer.closeAll("loading")
            })
        }
        //删除
        $scope.removeVideo = function (item) {
            erp.postFun('app/businessVideo/updateVideoById', {
                id: item.id,
                videoState: 'DELETE_STATE'
            }, function (data) {
                console.log(data)
                if (data.data.code == 200) {
                    layer.msg('操作成功');
                    getvideo();
                } else {
                    layer.msg('操作失败')
                }
            }, function (data) {
                layer.closeAll("loading")
            })
        }
        // $scope.similarGoodsShow = false;
        $scope.similarGoods = () => {
            $scope.similarGoodsShow = true;
        }

        /**
         * 上传图片相关
         */
        $scope.upLoadImg4 = function (files) {
            $scope.uploadImgs = []; // 待上传图片列表
            const file = files[0];
            const fileName = file.name;
            // 图片格式 allow: *.jpg/*.png/*.png/*.JPG
            if (!/.png|.jpg|.PNG|.JPG$/.test(fileName)) {
                return layer.msg('Invalid image. Only JPG and PNG supported.');
            }
            // 当前数据容器
            const current = {};
            current.file = file;
            // 上传阿里云
            erp.ossUploadFile(files, function (data) {
                $('#img-upload').val('');
                if (data.code == 0) {
                    layer.msg('Images Upload Failed');
                    return;
                }
                if (data.code == 2) {
                    layer.msg('Images Upload Incomplete');
                }
                const resUrl = data.succssLinks[0];
                current.url = resUrl;
                $scope.uploadImgs.push(current);
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
                            // flag: 1 => list 0 => source
                            if ($scope.similarGoodsShow) {
                                if (resData.location.length > 0) {
                                    current.likes = resData.location;
                                    current.likes.length =
                                    current.likes.length > 10 ? 10 : current.likes.length;
                                } else {
                                    location.href = '#/merchandise/addSKU1///' + ($scope.dropFlag == 'service' ? '1' : ($scope.optType == 'personality' ? '2' : '0'))
                                }
                            } else {
                                $scope.needOptimisation = false;
                                $scope.imgProductIds = "";
                                if (resData.location.length > 0) {
                                    let imgProductIds = []
                                    resData.location.forEach(e => {
                                        imgProductIds.push(e.id)
                                    });
                                    $scope.imgProductIds = imgProductIds.join();
                                    console.log($scope.imgProductIds);
                                    $scope.getCurrentFirstList(type = 'yitusoutu');
                                } else {
                                    $scope.merchList = [];
                                    erp.addNodataPic($('.erp-load-box'), 400);
                                }
                            }
                        }
                    },
                    err => { }
                );
            }
            getSearchImg(file);
        };
        // //删除图片
        // $scope.deleteImgFun = function (index) {
        //     $scope.uploadImgs.splice(index, 1);
        // };
        $scope.imgClear = () => {
            $scope.uploadImgs = []
        };
        $scope.$watch('topSearchKey', function(newValue, oldValue) {
            if ($scope.topSearchKey != oldValue) {
                $scope.uploadImgs = []
            }
        });

        /**
         * 相似图片
         */
        let nums = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 临时长度=10， 记录相似图片的展示index
        $scope.prev = (i, len) => {
            var bedImgs = document.getElementsByClassName('like-products')[i];
            nums[i]--;
            if (nums[i] < 0) {
                nums[i] = len - 5;
            }
            bedImgs.style.transform = `translateX(-${105 * nums[i]}px)`;
        };

        $scope.next = (i, len) => {
            var bedImgs = document.getElementsByClassName('like-products')[i];
            nums[i]++;
            if (nums[i] > len - 5) {
                nums[i] = 0;
            }
            bedImgs.style.transform = `translateX(-${105 * nums[i]}px)`;
				};
				
				/** 代发商品已上架 导出 ps: 按销量按刊登 */
				$scope.exportDrop = type => {
					let	sendData = getListSendData($scope)
		      if ($scope.isYitusoutu) {
			      $scope.topSearchVal = '';
			      sendData.filter02 = '';
			      sendData.imgProductIds = $scope.imgProductIds;
		      } else {
			      $scope.uploadImgs = []
			      sendData.imgProductIds = '';
					}
					sendData.exportType = type + ''
					console.log(sendData)
					erp.load(2)
					erp.postFun('pojo/product/productSalePublishExport', sendData, ({ data }) => {
						const { statusCode, result } = data
						erp.closeLoad()
						if(statusCode === '200') {
							const aElement = document.createElement('a')
							document.body.appendChild(aElement)
							aElement.style.display = 'none'
							aElement.href = result
							aElement.download = ''
							aElement.click();
							document.body.removeChild(aElement)
						} else { lyaer.msg('系统错误') }
					}, _ => layer.msg('系统错误'))
				}
    }])

    app.controller('merchandiseCtrlInquiry', ['$scope', '$window', '$location', '$compile', '$routeParams', '$timeout', '$http', 'merchan', 'erp', function ($scope, $window, $location, $compile, $routeParams, $timeout, $http, merchan, erp) {
        $scope.appHref = erp.getAppUrl();
        $('.right-bar').css('min-height', $(window).height() - 90 + 'px');

        var userId = '';
        var token = '';
        $scope.getListUrl = '';

        // getItemNums();

        var curPath = $location.path();
        if (curPath == '/merchandise/inquiry') {
            $scope.getListUrl = 'app/alibaba/getProducts';
            $scope.isInquiry = true;
            $('.top-taps li').eq(0).addClass('active');
        }
        if (curPath == '/merchandise/inquiry/off-shlves') {
            $scope.getListUrl = 'app/alibaba/getLowerFrameProduct';
            $scope.isOffSheInquiry = true;
            $('.top-taps li').eq(1).addClass('active');
        }
        if (curPath == '/merchandise/inquiry/recycle-bin') {
            $scope.getListUrl = 'app/alibaba/getDeleteProducts';
            $scope.isRecyInquiry = true;
            $('.top-taps li').eq(2).addClass('active');
        }
        console.log(curPath)
        if (curPath == '/merchandise/inquiry/off-Category') {
            $scope.getListUrl = 'app/alibaba/getProductFromPlugIn';
            $scope.isoffCategory = true;
            $('.top-taps li').eq(3).addClass('active');
        }
        // 商品列表相关参数
        $scope.merchList = [];
        $scope.currentPage = 1;
        $scope.totalNum = '';
        $scope.pageSize = '30';
        $scope.searchSKU = '';
        $scope.hasMerch = true;
        $scope.searchVal = '';
        $scope.searchCateId = '';
        $scope.type = 'title';

        function getLIstData() {
            $scope.sendListData = {
                beginPage: $scope.currentPage,
                limit: $scope.pageSize,
                title: $scope.searchVal,
                categoryId: $scope.searchCateId
            }

            if ($scope.type == 'id' && $scope.isInquiry) {
                $scope.sendListData[$scope.type] = parseInt($scope.searchVal)
                $scope.sendListData['title'] = ''
            }

            return $scope.sendListData;
        }
        $scope.$on('pagedata-fa', function (d, data) {
            $scope.currentPage = data.pageNum;
            $scope.pageSize = data.pageSize;
            $scope.getCurrentFirstList();
        })
        $scope.getCurrentFirstList = function () {
            var sendData = getLIstData();
            $scope.alibabaProducts = [];
            merchan.getInquiryList($scope.getListUrl, sendData, function (data) {
                $scope.totalNum = data.count[0];
                console.log($scope.totalNum);
                if ($scope.totalNum == 0) {
                    $scope.alibabaProducts = [];
                    $scope.hasMerch = false;
                    erp.addNodataPic($('.erp-load-box'), 400);
                    return;
                } else {
                    $scope.hasMerch = true;
                    erp.removeNodataPic($('.erp-load-box'));
                    let totalNum = Math.ceil(Number($scope.totalNum) / Number($scope.pageSize));
                    $scope.alibabaProducts = data.data;
                    $scope.$broadcast('page-data', {
                        pageSize: $scope.pageSize,
                        pageNum: $scope.currentPage,
                        totalNum: totalNum,
                        totalCounts: $scope.totalNum,
                        pageList: ['30', '50', '100']
                    });
                }

            });
        }
        $scope.getCurrentFirstList();

        // 搜索
        $scope.getSearchList = function () {
            $scope.currentPage = 1;
            $scope.getCurrentFirstList();
        }
        $scope.enterSearch = function (event) {
            if (event.keyCode == 13) {
                $scope.getSearchList();
            }
        }

        // 搜索商品类目
        merchan.getCateListOne(function (data) {
            $scope.categoryListOne = data;
        });
        $scope.showCategory = function () {
            $('.cate-list-box').show();
        }
        $scope.selectCategory = function ($event, id) {
            var thirdMenu = $($event.target).html();
            $('.search-cate-name').find('.text').html(thirdMenu);
            if (id) {
                $('.search-cate-name').find('.text').attr('id', id);
                $scope.searchCateId = id;
            } else {
                $('.search-cate-name').find('.text').attr('id', '');
                $scope.searchCateId = '';
            }
            $('.cate-list-box').hide();
            $scope.getSearchList();
        }
        $scope.showType = function () {
            $('.type-list-box').show();
        }
        $scope.selectType = function ($event, type) {
            console.log(type)
            $scope.type = type
            var thirdMenu = $($event.target).html();
            $('.search-type-name').find('.text').html(thirdMenu);
            $('.type-list-box').hide();
        }

        // 选中当前商品
        $scope.checkAllMark = false;
        $scope.checkMerch = function (sku, checked) {
            merchan.checkMerch(sku, checked, $scope.alibabaProducts);
            if (!checked) {
                $scope.checkAllMark = checked;
            }
            var checkedNum = 0;
            for (var i = 0; i < $scope.alibabaProducts.length; i++) {
                if ($scope.alibabaProducts[i]['checked'] == true) {
                    checkedNum++;
                }
            }
            if (checkedNum == $scope.alibabaProducts.length) {
                $scope.checkAllMark = true;
            }
        }

        // 选中所有商品
        $scope.checkAllMerch = function (checkAllMark) {
            merchan.checkAllMerch(checkAllMark, $scope.alibabaProducts)
        }

        // 选择每页显示的数目
        $scope.getPageSize = function () {
            $scope.currentPage = 1;
            $scope.getCurrentFirstList();
        }
        // sku搜索
        // $scope.searchSKU = '';
        $scope.topSearchKey = 'chinese';
        $scope.getSearchSKU = function () {
            $scope.currentPage = 1;
            $scope.getCurrentFirstList();
        }

        $scope.isAllInquiry = true;
        $scope.isReqInquiry = false;
        $scope.selectInquiryType = function ($event) {
            var $this = $($event.currentTarget);
            $this.addClass('active').siblings().removeClass('active');
            if ($('.all-inquiry').hasClass('active')) {
                $scope.isAllInquiry = true;
                $scope.isReqInquiry = false;
            } else {
                $scope.isAllInquiry = false;
                $scope.isReqInquiry = true;
            }
        }

        $scope.freshListAfterOpe = function (opeIds, id) {
            if (id == 'deleteall') {
                $('.merchan-list-con-wrap').each(function () {
                    $(this).remove();
                });
                $scope.alibabaProducts = [];
                return;
            }
            console.log(opeIds, $.isArray(opeIds));
            if ($.isArray(opeIds)) {
                for (var i = 0; i < opeIds.length; i++) {
                    var changeIndex = erp.findIndexByKey($scope.alibabaProducts, 'id', opeIds[i]);
                    $('.merchan-list-con-wrap').eq(changeIndex).remove();
                    $scope.alibabaProducts.splice(changeIndex, 1);
                }
                if ($scope.checkAllMark) {
                    $scope.checkAllMark = false;
                }
                $scope.checkMerchArr = [];
                console.log($scope.checkMerchArr);
            } else {
                var changeIndex = erp.findIndexByKey($scope.alibabaProducts, 'id', id);
                console.log(changeIndex);
                $('.merchan-list-con-wrap').eq(changeIndex).remove();
                $scope.alibabaProducts.splice(changeIndex, 1);
                console.log($scope.alibabaProducts);
            }
        }

        $scope.offShelveOpe = function (id) {
            var opeIds;
            if (id == undefined) {
                opeIds = [];
                for (var i = 0; i < $scope.alibabaProducts.length; i++) {
                    if ($scope.alibabaProducts[i].checked == true) {
                        opeIds.push($scope.alibabaProducts[i].id);
                    }
                }
                if (opeIds.length <= 0) {
                    layer.msg('请选择商品！');
                    return false;
                }
                id = opeIds.join(',');
            }
            layer.open({
                title: null,
                type: 1,
                area: ['374px', '290px'],
                skin: 'offline-assign-layer',
                closeBtn: 0,
                shade: [0.1, '#000'],
                content: '<h5>下架商品</h5><p class="is-concern">确定下架商品?</p>',
                btn: ['取消', '确认'],
                yes: function (index, layero) {
                    layer.close(index);
                },
                btn2: function (index, layero) {
                    merchan.opeInquiry('app/alibaba/lowerFrameProducts', {
                        ids: id
                    }, function () {
                        layer.msg('下架成功', {
                            time: 1000
                        }, function () {
                            $scope.freshListAfterOpe(opeIds, id);
                            // getItemNums();
                            layer.close(index);
                        });
                    });
                }
            });

        }

        $scope.deleteOpe = function (id) {
            // console.log(id);
            var opeIds;
            if (id == undefined) {
                opeIds = [];
                for (var i = 0; i < $scope.alibabaProducts.length; i++) {
                    if ($scope.alibabaProducts[i].checked == true) {
                        opeIds.push($scope.alibabaProducts[i].id);
                    }
                }
                if (opeIds.length <= 0) {
                    layer.msg('请选择商品！');
                    return false;
                }
                id = opeIds.join(',');
            }
            layer.open({
                title: null,
                type: 1,
                area: ['374px', '290px'],
                skin: 'offline-assign-layer',
                closeBtn: 0,
                shade: [0.1, '#000'],
                content: '<h5>删除商品</h5><p class="is-concern">确定删除商品?</p>',
                btn: ['取消', '确认'],
                yes: function (index, layero) {
                    layer.close(index);
                },
                btn2: function (index, layero) {
                    merchan.opeInquiry('app/alibaba/deleteProducts', {
                        ids: id
                    }, function () {
                        layer.msg('操作成功', {
                            time: 1000
                        }, function () {
                            $scope.freshListAfterOpe(opeIds, id);
                            // getItemNums();
                            layer.close(index);
                        });
                    });
                }
            });
        }

        $scope.shelveOpe = function (id) {
            var opeIds;
            var arr = [];
            if (id == undefined) {
                opeIds = [];
                for (var i = 0; i < $scope.alibabaProducts.length; i++) {
                    if ($scope.isoffCategory) {
                        if ($scope.alibabaProducts[i].checked == true) {
                            if ($scope.alibabaProducts[i].categoryName) {
                                opeIds.push($scope.alibabaProducts[i].id);
                            } else {
                                $scope.alibabaProducts[i].checked = false;
                                arr.push($scope.alibabaProducts[i].id)
                            }
                        }
                    } else {
                        if ($scope.alibabaProducts[i].checked == true) {
                            opeIds.push($scope.alibabaProducts[i].id);
                        }
                    }
                }
                if (arr.length > 0) {
                    layer.msg(arr.join(',') + '不可上架');
                    return false;
                }
                if (opeIds.length <= 0) {
                    layer.msg('请选择商品！');
                    return false;
                }
                console.log(opeIds)
                id = opeIds.join(',');
            }
            layer.open({
                title: null,
                type: 1,
                area: ['374px', '290px'],
                skin: 'offline-assign-layer',
                closeBtn: 0,
                shade: [0.1, '#000'],
                content: '<h5>上架商品</h5><p class="is-concern">确定上架商品?</p>',
                btn: ['取消', '确认'],
                yes: function (index, layero) {
                    layer.close(index);
                },
                btn2: function (index, layero) {
                    merchan.opeInquiry('app/alibaba/reShelveProducts', {
                        ids: id
                    }, function () {
                        layer.msg('上架成功', {
                            time: 1000
                        }, function () {
                            $scope.freshListAfterOpe(opeIds, id);
                            // getItemNums();
                            layer.close(index);
                        });
                    });
                }
            });

        }

        $scope.clearOpe = function (id) {
            console.log(id)
            var opeIds;
            if (id == undefined) {
                opeIds = [];
                for (var i = 0; i < $scope.alibabaProducts.length; i++) {
                    if ($scope.alibabaProducts[i].checked == true) {
                        opeIds.push($scope.alibabaProducts[i].id);
                    }
                }
                if (opeIds.length <= 0) {
                    layer.msg('请选择商品！');
                    return false;
                }
                id = opeIds.join(',');
            }
            if (id == 'deleteall') { // 清空回收站
                /*   opeIds = [];
                   for (var i = 0; i < $scope.alibabaProducts.length; i++) {
                       opeIds.push($scope.alibabaProducts[i].id);
                   }
                   // console.log($scope.alibabaProducts)
                   id = opeIds.join(',');*/
            }
            layer.open({
                title: null,
                type: 1,
                area: ['374px', '290px'],
                skin: 'offline-assign-layer',
                closeBtn: 0,
                shade: [0.1, '#000'],
                content: id == 'deleteall' ? '<h5>清空回收站</h5><p class="is-concern">确定清空回收站?</p>' : '<h5>删除商品</h5><p class="is-concern">确定删除商品?</p>',
                btn: ['取消', '确认'],
                yes: function (index, layero) {
                    layer.close(index);
                },
                btn2: function (index, layero) {
                    // return console.log(id)
                    // merchan.opeInquiry('pojo/product/clearRecycle', {ids: id, flag: '0'}, function () {
                    var url = id == 'deleteall' ? 'app/alibaba/qingKongHuiShouZhan' : 'app/alibaba/OutDelAlbbProducts';
                    merchan.opeInquiry(url, {
                        ids: id,
                        flag: '0'
                    }, function () {
                        layer.msg('操作成功', {
                            time: 1000
                        }, function () {
                            $scope.freshListAfterOpe(opeIds, id);
                            // getItemNums();
                            layer.close(index);
                            $scope.getSearchList()
                        });
                    });
                }
            });

        }

        $scope.writeInOpe = function (item) {
            $scope.freshListAfterOpe(item.id, item.id);
            window.open('manage.html#/merchandise/addSKU2/inquiry=' + item.id + '/' + item.categoryId + '/0', '_blank', '');
            // location.href = '#/merchandise/addSKU2/inquiry=' + id;
        }

        $scope.rListAfterChCate = function (idsArr, changeCateId, changeCateName) {
            if ($.isArray(idsArr)) {
                for (var i = 0; i < idsArr.length; i++) {
                    var changeIndex = erp.findIndexByKey($scope.alibabaProducts, 'id', idsArr[i]);
                    $('.merchan-list-con-wrap').eq(changeIndex).find('.li-category').html(changeCateName);
                    $scope.alibabaProducts[changeIndex].categoryId = changeCateId;
                    if ($scope.searchCateId) {
                        if (changeCateId != $scope.searchCateId) {
                            $('.merchan-list-con-wrap').eq(changeIndex).remove();
                            $scope.alibabaProducts.splice(changeIndex, 1);
                        }
                    }
                }
            } else {
                var changeIndex = erp.findIndexByKey($scope.alibabaProducts, 'id', idsArr);
                $('.merchan-list-con-wrap').eq(changeIndex).find('.li-category').html(changeCateName);
                $scope.alibabaProducts[changeIndex].categoryId = changeCateId;
                if ($scope.searchCateId) {
                    // console.log(changeCateId != $scope.searchCateId);
                    if (changeCateId != $scope.searchCateId) {
                        // console.log(changeIndex);
                        $('.merchan-list-con-wrap').eq(changeIndex).remove();
                        $scope.alibabaProducts.splice(changeIndex, 1);
                        // console.log($scope.alibabaProducts);
                    }
                }
            }
        }

        $scope.changeCate = function (item) {
            merchan.changeCate(item, $scope, '1', function (idsArr, changeCateId, changeCateName) {
                $scope.rListAfterChCate(idsArr, changeCateId, changeCateName);
                if ($scope.isoffCategory) {
                    $scope.getCurrentFirstList();
                }
            });
        }
        $scope.banchChangeCate = function () {
            var changeIds = merchan.getBanchIds($scope.alibabaProducts);
            if (changeIds.length == 0) {
                layer.msg('请选择商品！');
                return false;
            }
            merchan.changeCate(changeIds, $scope, '1', function (idsArr, changeCateId, changeCateName) {
                $scope.rListAfterChCate(idsArr, changeCateId, changeCateName);
                if ($scope.isoffCategory) {
                    $scope.getCurrentFirstList();
                }
            });
        }

        //删除具体某一个爬虫商品
        $scope.btn_delete114 = function (id) {
            erp.postFun("app/alibaba/deleteProduct", {
                "id": id
            }, function (data) {
                if (data.data.data == "1") {
                    //删除成功后需要直接把这一行在页面上都删掉;;alert就可以去掉了
                    // alert("删除成功");
                    var deleteIndex = erp.findIndexByKey($scope.alibabaProducts, 'id', id)
                    $scope.alibabaProducts.splice(deleteIndex, 1);
                } else {
                    alert("删除失败");
                }
            }, function (data) {
                alert("删除失败");
            });
        }
        /****************************询价商品****END***********************************/

    }]);

    app.controller('merchandiseCtrlPersonalizeinquiry', ['$scope', '$window', '$location', '$compile', '$routeParams', '$timeout', '$http', 'merchan', 'erp', function ($scope, $window, $location, $compile, $routeParams, $timeout, $http, merchan, erp) {

        $('.right-bar').css('min-height', $(window).height() - 90 + 'px');
        $scope.getListUrl = '';

        // getItemNums();

        // 商品列表相关参数
        $scope.merchList = [];
        $scope.currentPage = 1;
        $scope.totalNum = '';
        $scope.pageSize = '20';
        $scope.searchSKU = '';
        $scope.totalPages = '';
        $scope.hasMerch = true;
        $scope.specifiedPage = '';
        $scope.searchVal = '';
        $scope.searchCateId = '';

        function getLIstData() {
            $scope.sendListData = {
                pageNum: $scope.currentPage,
                pageSize: $scope.pageSize,
                // title: $scope.searchVal,
                // categoryId: $scope.searchCateId
            }
            return $scope.sendListData;
        }
        $scope.getCurrentFirstList = function () {
            var sendData = getLIstData();
            $scope.alibabaProducts = [];
            merchan.getInquiryList('caigou/soufeel/getSoufeelList', sendData, function (data) {
                var result = data.result;
                console.log(result)
                $scope.totalNum = result.total;
                console.log($scope.totalNum);
                if ($scope.totalNum == 0) {
                    $scope.alibabaProducts = [];
                    $scope.hasMerch = false;
                    erp.addNodataPic($('.erp-load-box'), 400);
                    return;
                } else {
                    $scope.hasMerch = true;
                    erp.removeNodataPic($('.erp-load-box'));
                    $scope.alibabaProducts = result.ps;
                    console.log($scope.alibabaProducts);
                    let totalNum = Math.ceil(Number($scope.totalNum) / Number($scope.pageSize));
                    $scope.$broadcast('page-data', {
                        pageSize: $scope.pageSize,
                        pageNum: $scope.currentPage,
                        totalNum: totalNum,
                        totalCounts: $scope.totalNum,
                        pageList: ['30', '50', '100']
                    });
                }

            });
        }
        $scope.getCurrentFirstList();

        $scope.$on('pagedata-fa', function (d, data) {
            $scope.currentPage = data.pageNum;
            $scope.pageSize = data.pageSize;
            $scope.getCurrentFirstList();
        })

        // 搜索
        $scope.getSearchList = function () {
            $scope.currentPage = 1;
            $scope.getCurrentFirstList();
        }
        $scope.enterSearch = function (event) {
            if (event.keyCode == 13) {
                $scope.getSearchList();
            }
        }

        // 搜索商品类目
        merchan.getCateListOne(function (data) {
            $scope.categoryListOne = data;
        });
        $scope.showCategory = function () {
            $('.cate-list-box').show();
        }
        $scope.selectCategory = function ($event, id) {
            var thirdMenu = $($event.target).html();
            $('.search-cate-name').find('.text').html(thirdMenu);
            if (id) {
                $('.search-cate-name').find('.text').attr('id', id);
                $scope.searchCateId = id;
            } else {
                $('.search-cate-name').find('.text').attr('id', '');
                $scope.searchCateId = '';
            }
            $('.cate-list-box').hide();
            $scope.getSearchList();
        }

        // 选中当前商品
        $scope.checkAllMark = false;
        $scope.checkMerch = function (sku, checked) {
            merchan.checkMerch(sku, checked, $scope.alibabaProducts);
            if (!checked) {
                $scope.checkAllMark = checked;
            }
            var checkedNum = 0;
            for (var i = 0; i < $scope.alibabaProducts.length; i++) {
                if ($scope.alibabaProducts[i]['checked'] == true) {
                    checkedNum++;
                }
            }
            if (checkedNum == $scope.alibabaProducts.length) {
                $scope.checkAllMark = true;
            }
        }

        // 选中所有商品
        $scope.checkAllMerch = function (checkAllMark) {
            merchan.checkAllMerch(checkAllMark, $scope.alibabaProducts)
        }

        // sku搜索
        $scope.topSearchKey = 'chinese';
        $scope.getSearchSKU = function () {
            $scope.currentPage = 1;
            $scope.getCurrentFirstList();
        }

        $scope.isAllInquiry = true;
        $scope.isReqInquiry = false;
        $scope.selectInquiryType = function ($event) {
            var $this = $($event.currentTarget);
            $this.addClass('active').siblings().removeClass('active');
            if ($('.all-inquiry').hasClass('active')) {
                $scope.isAllInquiry = true;
                $scope.isReqInquiry = false;
            } else {
                $scope.isAllInquiry = false;
                $scope.isReqInquiry = true;
            }
        }

        $scope.freshListAfterOpe = function (opeIds, id) {
            if (id == 'deleteall') {
                $('.merchan-list-con-wrap').each(function () {
                    $(this).remove();
                });
                $scope.alibabaProducts = [];
                return;
            }
            console.log(opeIds, $.isArray(opeIds));
            if ($.isArray(opeIds)) {
                for (var i = 0; i < opeIds.length; i++) {
                    var changeIndex = erp.findIndexByKey($scope.alibabaProducts, 'id', opeIds[i]);
                    $('.merchan-list-con-wrap').eq(changeIndex).remove();
                    $scope.alibabaProducts.splice(changeIndex, 1);
                }
                if ($scope.checkAllMark) {
                    $scope.checkAllMark = false;
                }
                $scope.checkMerchArr = [];
                console.log($scope.checkMerchArr);
            } else {
                var changeIndex = erp.findIndexByKey($scope.alibabaProducts, 'id', id);
                console.log(changeIndex);
                $('.merchan-list-con-wrap').eq(changeIndex).remove();
                $scope.alibabaProducts.splice(changeIndex, 1);
                console.log($scope.alibabaProducts);
            }
        }

        $scope.deleteOpe = function (id) {
            // console.log(id);
            var opeIds;
            if (id == undefined) {
                opeIds = [];
                for (var i = 0; i < $scope.alibabaProducts.length; i++) {
                    if ($scope.alibabaProducts[i].checked == true) {
                        opeIds.push($scope.alibabaProducts[i].id);
                    }
                }
                if (opeIds.length <= 0) {
                    layer.msg('请选择商品！');
                    return false;
                }
                id = opeIds.join(',');
            }
            layer.open({
                title: null,
                type: 1,
                area: ['374px', '290px'],
                skin: 'offline-assign-layer',
                closeBtn: 0,
                shade: [0.1, '#000'],
                content: '<h5>删除商品</h5><p class="is-concern">确定删除商品?</p>',
                btn: ['取消', '确认'],
                yes: function (index, layero) {
                    layer.close(index);
                },
                btn2: function (index, layero) {
                    merchan.opeInquiry('caigou/soufeel/delSoufeelInfo', {
                        "id": id
                    }, function () {
                        layer.msg('操作成功', {
                            time: 1000
                        }, function () {
                            $scope.freshListAfterOpe(opeIds, id);
                            // getItemNums();
                            layer.close(index);
                        });
                    });
                }
            });
        }


        $scope.writeInOpe = function (item) {
            $scope.freshListAfterOpe(item.id, item.id);
            window.open('manage.html#/merchandise/addSKU1/personalize=' + item.id + '//2', '_blank', '');
            // location.href = '#/merchandise/addSKU2/inquiry=' + id;
        }

        //删除具体某一个爬虫商品
        $scope.btn_delete114 = function (id) {
            erp.postFun("app/alibaba/deleteProduct", {
                "id": id
            }, function (data) {
                if (data.data.data == "1") {
                    //删除成功后需要直接把这一行在页面上都删掉;;alert就可以去掉了
                    // alert("删除成功");
                    var deleteIndex = erp.findIndexByKey($scope.alibabaProducts, 'id', id)
                    $scope.alibabaProducts.splice(deleteIndex, 1);
                } else {
                    alert("删除失败");
                }
            }, function (data) {
                alert("删除失败");
            });
        }

    }]);

    // 视频商品控制器
    app.controller('VideoProductShelfCtrl', ['$scope', '$window', '$location', '$compile', '$routeParams', '$timeout', '$http', 'merchan', 'erp', function ($scope, $window, $location, $compile, $routeParams, $timeout, $http, merchan, erp) {
	    (function listOtpimisation() {//执行 对应的列表优化 ---
		    const clipboard = new cjUtils.Clipboard();
		    $scope.needOptimisation = true;
		    clipboard.action((str) => {
			    const isMatched = /^CJ/.test(str);//匹配 前切板内容是否 以 CJ开头
			    if (isMatched) {
				    $scope.title = str;//匹配 前切板内容是否 以 CJ开头 有则 搜索 字段 改为 剪切板内容
				    getList();//获取列表
				    $scope.needOptimisation = false;
			    }
		    }).catch(msg => {
			    $scope.needOptimisation = true;
			    console.log('clipboard action failed --->> ', msg)
		    })
	    }());
	    // getItemNums();
	    $scope.title = '';
	    $scope.pagenum = "1";
	    $scope.pagesize = "30";
	    $scope.totalNum = 0;
	    $scope.dataList = [];
	    $scope.isoverTR = true;
	    $scope.proList = []
	    $scope.isFree = '0';
	
	    function getList(type) {
		    console.log(type);
		    if (type == 'yitusoutu') {
			    $scope.title = '';
		    }
		    $scope.needOptimisation = false;
            $scope.proList = []
            layer.load(2);
            erp.postFun('app/businessVideo/selectVideoDownLoadRecord', {
                'videoState': 'ON_STATE',
                'SKU': $scope.title,
                'pageNum': $scope.pagesize.toString(),
                'page': $scope.pagenum.toString(),
                'imgProductIds': type == 'yitusoutu' ? $scope.imgProductIds : ''
            }, con, err);

            function con(n) {
                if (n.data.code == 200) {
                    $scope.proList = n.data.list;
                    $scope.totalNum = n.data.totalNum;
                    let totalNum = Math.ceil(Number($scope.totalNum) / Number($scope.pagesize));
                    $scope.$broadcast('page-data', {
                        pageSize: $scope.pagesize,
                        pageNum: $scope.pagenum,
                        totalNum: totalNum,
                        totalCounts: $scope.totalNum,
                        pageList: ['30', '50', '100']
                    });
                } else {
                    layer.msg('查询失败')
                }
                layer.closeAll();
            }

            function err(n) {
                layer.closeAll();
                layer.msg('查询失败')
            }
        }
        $scope.$on('pagedata-fa', function (d, data) {
            $scope.pagenum = data.pageNum;
            $scope.pagesize = data.pageSize;
            getList();
        })
        // getList();
        

        $scope.usersearch = function () {
            $scope.resUrl = undefined;
            $scope.pagenum = "1";
            getList();
        }
        $scope.videoState = function (s) {
            if (s == '0') {
                return '正在上传中'
            } else if (s == '1') {
                return '加水印中'
            } else if (s == '2') {
                return '上传服务器中'
            } else if (s == '3') {
                return '上传完成'
            } else if (s == '4') {
                return '上传失败'
            }
        }
        //上架or下架
        $scope.Shelves = function (item) {
            console.log(item)
            $scope.isShow = true;
            $scope.contentTxt = '是否确认下架？'
            $scope.Yclick = function () {
                var state;
                if (item.videoState == 'ON_STATE') {
                    console.log('下架')
                    state = 'DOWN_STATE'
                } else if (item.videoState == 'DOWN_STATE') {
                    console.log('上架')
                    state = 'ON_STATE'
                }
                erp.postFun('app/businessVideo/updateVideoById', {
                    id: item.id,
                    videoState: state
                }, function (data) {
                    console.log(data)
                    if (data.data.code == 200) {
                        layer.msg('操作成功');
                        $scope.isShow = false;
                        getList();
                    } else {
                        layer.msg('操作失败')
                    }
                }, function (data) {
                    layer.closeAll("loading")
                })
            }

        }
        //修改
        $scope.upVideo = function (item) {
            $scope.isupdate = true;
            $scope.item = item;
            console.log(item)
            $scope.copyrightPrice = Number(item.copyrightPrice);
            $scope.notCopyrightPrice = Number(item.notCopyrightPrice);
            $scope.isFree = item.isFree;
        }
        $scope.goclick = function () {
            console.log($scope.item)
            if (!$scope.copyrightPrice || !$scope.notCopyrightPrice) {
                layer.msg('请输入价格')
            } else {
                erp.postFun('app/businessVideo/updateVideoOfPrice', {
                    id: $scope.item.id,
                    isFree: $scope.isFree,
                    copyrightPrice: $scope.copyrightPrice,
                    notCopyrightPrice: $scope.notCopyrightPrice
                }, function (data) {
                    if (data.data.statusCode == 200) {
                        layer.msg('操作成功');
                        $scope.isupdate = false;
                        getList();
                    } else {
                        layer.msg('操作失败')
                    }
                }, function (data) {
                    layer.closeAll("loading")
                })
            }
        }
        //删除
        $scope.removeVideo = function (item) {
            $scope.isShow = true;
            $scope.contentTxt = '是否确认删除？'
            $scope.Yclick = function () {
                erp.postFun('app/businessVideo/updateVideoById', {
                    id: item.id,
                    videoState: 'DELETE_STATE'
                }, function (data) {
                    console.log(data)
                    if (data.data.code == 200) {
                        layer.msg('操作成功');
                        $scope.isShow = false;
                        getList();
                    } else {
                        layer.msg('操作失败')
                    }
                }, function (data) {
                    layer.closeAll("loading")
                })
            }
        }

        //
        $scope.detal = function (item) {
            console.log(item)
            var toUrl = window.open();
            toUrl.location.href = 'https://app.cjdropshipping.com/product-detail.html?id=' + item.id;

        }
        //
        $scope.rowfun = function (item,b) {
            if (item == 1) {
                return 0;
            } else {
                return item;
            }
        }
        console.log($scope.rowfun(1))
        //点击行数加样式
        $scope.TrClick = function (i) {
            $scope.focus = i;
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
                                getList(type = 'yitusoutu');
                            } else {
                                $scope.proList = [];
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
    }])

    app.controller('VideoProductObtainedCtrl', ['$scope', '$window', '$location', '$compile', '$routeParams', '$timeout', '$http', 'merchan', 'erp', function ($scope, $window, $location, $compile, $routeParams, $timeout, $http, merchan, erp) {
        // getItemNums();
        $scope.title = '';
        $scope.pagenum = "1";
        $scope.pagesize = "30";
        $scope.totalNum = 0;
        $scope.dataList = [];
        /*  $scope.lookdata = [];
          $scope.relationId = '';
          $scope.relationId1 = [];
          $scope.isCKstate = false;*/
        $scope.isoverTR = true;
        $scope.proList = []
        $scope.isFree = '0';

        function getList() {
            $scope.proList = [];
            layer.load(2);
            erp.postFun('app/businessVideo/selectVideoDownLoadRecord', {
                'videoState': 'DOWN_STATE',
                'SKU': $scope.title,
                'pageNum': $scope.pagesize.toString(),
                'page': $scope.pagenum.toString()
            }, con, err);

            function con(n) {
                if (n.data.code == 200) {
                    $scope.proList = n.data.list;
                    $scope.totalNum = n.data.totalNum;
                    let totalNum = Math.ceil(Number($scope.totalNum) / Number($scope.pagesize));
                    $scope.$broadcast('page-data', {
                        pageSize: $scope.pagesize,
                        pageNum: $scope.pagenum,
                        totalNum: totalNum,
                        totalCounts: $scope.totalNum,
                        pageList: ['30', '50', '100']
                    });
                } else {
                    layer.msg('查询失败')
                }
                layer.closeAll();
            }

            function err(n) {
                layer.closeAll();
                layer.msg('查询失败')
            }
        }
        $scope.$on('pagedata-fa', function (d, data) {
            $scope.pagenum = data.pageNum;
            $scope.pagesize = data.pageSize;
            getList();
        })
        getList();
        $scope.usersearch = function () {
            $scope.pagenum = "1";
            getList();
        }
        $scope.videoState = function (s) {
            if (s == '0') {
                return '正在上传中'
            } else if (s == '1') {
                return '加水印中'
            } else if (s == '2') {
                return '上传服务器中'
            } else if (s == '3') {
                return '上传完成'
            } else if (s == '4') {
                return '上传失败'
            }
        }
        //上架or下架
        $scope.Shelves = function (item) {
            console.log(item)
            $scope.isShow = true;
            $scope.contentTxt = '是否确认上架？'
            $scope.Yclick = function () {
                var state;
                if (item.videoState == 'ON_STATE') {
                    console.log('下架')
                    state = 'DOWN_STATE'
                } else if (item.videoState == 'DOWN_STATE') {
                    console.log('上架')
                    state = 'ON_STATE'
                }
                erp.postFun('app/businessVideo/updateVideoById', {
                    id: item.id,
                    videoState: state
                }, function (data) {
                    console.log(data)
                    if (data.data.code == 200) {
                        layer.msg('操作成功');
                        $scope.isShow = false;
                        getList();
                    } else {
                        layer.msg('操作失败')
                    }
                }, function (data) {
                    layer.closeAll("loading")
                })
            }

        }
        //修改
        $scope.upVideo = function (item) {
            $scope.isupdate = true;
            $scope.item = item;
            console.log(item)
            $scope.copyrightPrice = Number(item.copyrightPrice);
            $scope.notCopyrightPrice = Number(item.notCopyrightPrice)
            $scope.isFree = item.isFree;
        }
        $scope.goclick = function () {
            console.log($scope.item)
            if (!$scope.copyrightPrice || !$scope.notCopyrightPrice) {
                layer.msg('请输入价格')
            } else {
                erp.postFun('app/businessVideo/updateVideoOfPrice', {
                    id: $scope.item.id,
                    copyrightPrice: $scope.copyrightPrice,
                    isFree: $scope.isFree,
                    notCopyrightPrice: $scope.notCopyrightPrice
                }, function (data) {
                    if (data.data.statusCode == 200) {
                        layer.msg('操作成功');
                        $scope.isupdate = false;
                        getList();
                    } else {
                        layer.msg('操作失败')
                    }
                }, function (data) {
                    layer.closeAll("loading")
                })
            }
        }
        //删除
        $scope.removeVideo = function (item) {
            $scope.isShow = true;
            $scope.contentTxt = '是否确认删除？'
            $scope.Yclick = function () {
                erp.postFun('app/businessVideo/updateVideoById', {
                    id: item.id,
                    videoState: 'DELETE_STATE'
                }, function (data) {
                    console.log(data)
                    if (data.data.code == 200) {
                        layer.msg('操作成功');
                        $scope.isShow = false;
                        getList();
                    } else {
                        layer.msg('操作失败')
                    }
                }, function (data) {
                    layer.closeAll("loading")
                })
            }
        }
	
	    //
	    $scope.detal = function (item) {
		    console.log(item)
		    var toUrl = window.open();
		    toUrl.location.href = 'https://app.cjdropshipping.com/product-detail.html?id=' + item.id;
		
	    }
	    $scope.rowfun = function (item) {
		    if (item == 1) {
			    return 0;
		    } else {
			    return item;
		    }
	    }
	    console.log($scope.rowfun(1))
	    //点击行数加样式
	    $scope.TrClick = function (i) {
		    $scope.focus = i;
	    }
    }])
		app.controller('VideoDemandCtrl', ['$scope', '$window', '$location', '$compile', '$routeParams', '$timeout', '$http', 'merchan', 'erp', '$sce', 'utils', function ($scope, $window, $location, $compile, $routeParams, $timeout, $http, merchan, erp, $sce, utils) {
			var bs = new Base64();
			var userId = localStorage.getItem('userId') == null ? '' : bs.decode(localStorage.getItem('userId'));
			let aliPlayer;
			$scope.searchTxt = '';
			$scope.pageNum = "1";
			$scope.pageSize = "30";
			$scope.totalNum = 0;
			$scope.dataList = [];
			$scope.sourcestatus = '';
			$scope.types = '';
			$scope.searchType = 'number'
			$scope.imgData = []
			
			function createUploader() {
				var uploader = new AliyunUpload.Vod({
					timeout: $('#timeout').val() || 60000,
					partSize: $('#partSize').val() || 1048576,
					parallel: $('#parallel').val() || 5,
					retryCount: $('#retryCount').val() || 3,
					retryDuration: $('#retryDuration').val() || 2,
					region: 'cn-shanghai',
					userId: '1654317246160868',
					// 添加文件成功
					addFileSuccess: function (uploadInfo) {
						console.log('addFileSuccess')
						// $('#authUpload').attr('disabled', false)
						// $('#resumeUpload').attr('disabled', false)
						// $('#status').text('添加文件成功, 等待上传...')
						console.log("addFileSuccess: " + uploadInfo.file.name);
						$('#uploadVideoText').html('选择视频成功!');
					},
					// 开始上传
					onUploadstarted: function (uploadInfo) {
						console.log(uploadInfo)
						// 如果是 UploadAuth 上传方式, 需要调用 uploader.setUploadAuthAndAddress 方法
						// 如果是 UploadAuth 上传方式, 需要根据 uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress
						// 如果 uploadInfo.videoId 有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
						// 注意: 这里是测试 demo 所以直接调用了获取 UploadAuth 的测试接口, 用户在使用时需要判断 uploadInfo.videoId 存在与否从而调用 openApi
						// 如果 uploadInfo.videoId 存在, 调用 刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)
						// 如果 uploadInfo.videoId 不存在,调用 获取视频上传地址和凭证接口(https://help.aliyun.com/document_detail/55407.html)
						if (!uploadInfo.videoId) {
							// var createUrl = 'https://demo-vod.cn-shanghai.aliyuncs.com/voddemo/CreateUploadVideo?Title=testvod1&FileName=aa.mp4&BusinessType=vodai&TerminalType=pc&DeviceModel=iPhone9,2&UUID=59ECA-4193-4695-94DD-7E1247288&AppVersion=1.0.0&VideoId=5bfcc7864fc14b96972842172207c9e6'
							var createUrl = 'https://tools.cjdropshipping.com/tool/downLoad/token'
							$.get(createUrl, {
								type: 1,
								fileName: uploadInfo.file.name,
								title: '123'
							}, function (data) {
								var uploadAuth = data.result.UploadAuth
								var uploadAddress = data.result.UploadAddress
								var videoId = data.result.VideoId
								uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
							}, 'json')
							//   $('#status').text('文件开始上传...')
							console.log("onUploadStarted:" + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object)
						} else {
							// 如果videoId有值，根据videoId刷新上传凭证
							// https://help.aliyun.com/document_detail/55408.html?spm=a2c4g.11186623.6.630.BoYYcY
							//   var refreshUrl = 'https://vod.cn-shanghai.aliyuncs.com/voddemo/RefreshUploadVideo?BusinessType=vodai&TerminalType=pc&DeviceModel=iPhone9,2&UUID=59ECA-4193-4695-94DD-7E1247288&AppVersion=1.0.0&Title=haha1&FileName=xxx.mp4&VideoId=' + uploadInfo.videoId
							var refreshUrl = "https://tools.cjdropshipping.com/tool/downLoad/token";
							$.get(refreshUrl, {
								type: 2,
								videoId: uploadInfo.videoId
							}, function (data) {
								var uploadAuth = data.result.UploadAuth
								var uploadAddress = data.result.UploadAddress
								var videoId = data.result.VideoId
								uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
							}, 'json')
						}
					},
					// 文件上传成功
					onUploadSucceed: function (uploadInfo) {
						// console.log("onUploadSucceed: " + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object)
						console.log(uploadInfo);
						//const videoInfo = $scope.UploadVideoList.filter(o => o.id === uploadInfo.ri)
						const parmas = {
							videoNumber: $scope.item.sku,
							locProductId: $scope.item.cjproductId,
							copyright: $scope.item.copyright,
							videoName: $scope.videoName,
							copyrightPrice: $scope.copyrightPrice,
							notCopyrightPrice: $scope.notCopyrightPrice,
							isFree: $scope.isFree,
							videoId: uploadInfo.videoId,
						}
						erp.postFun('media/orderMedia/uploadVideo', parmas, ({ data }) => {
							layer.closeAll("loading");
							if (data.code === 200) {
								getMediaData();
								layer.msg('视频上传成功')
							} else {
								layer.msg(data.message)
							}
						}, err => {
							console.log(err)
						})
					},
					// 文件上传失败
					onUploadFailed: function (uploadInfo, code, message) {
						console.log("onUploadFailed: file:" + uploadInfo.file.name + ",code:" + code + ", message:" + message)
						// $('#status').text('文件上传失败!')
						layer.closeAll('loading')
						layer.msg('视频上传失败')
					},
					// 取消文件上传
					onUploadCanceled: function (uploadInfo, code, message) {
						console.log("Canceled file: " + uploadInfo.file.name + ", code: " + code + ", message:" + message)
						// $('#status').text('文件上传已暂停!')
						layer.closeAll('loading')
					},
					// 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
					onUploadProgress: function (uploadInfo, totalSize, progress) {
						var progressPercent = Math.ceil(progress * 100);
						console.log(progressPercent);
						var id = uploadInfo.ri;
						var pid = '';
						$.each($scope.UploadVideoList, function (i, v) {
							if (v.vid == id) {
								pid = v.id;
							}
						})
						$.each($scope.proList, function (i, v) {
							if (v.cjproductId == pid) {
								v.schedule = progressPercent + '';
							}
						})
						// console.log($scope.merchList);
						$scope.$apply();
						// console.log("onUploadProgress:file:" + uploadInfo.file.name + ", fileSize:" + totalSize + ", percent:" + Math.ceil(progress * 100) + "%")
						//
						// $('#auth-progress').text(progressPercent)
						// $('#status').text('文件上传中...')
					},
					// 上传凭证超时
					onUploadTokenExpired: function (uploadInfo) {
						// 上传大文件超时, 如果是上传方式一即根据 UploadAuth 上传时
						// 需要根据 uploadInfo.videoId 调用刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)重新获取 UploadAuth
						// 然后调用 resumeUploadWithAuth 方法, 这里是测试接口, 所以我直接获取了 UploadAuth
						var refreshUrl = "https://tools.cjdropshipping.com/tool/downLoad/token";
						$.get(refreshUrl, {
							type: 2,
							videoId: uploadInfo.videoId
						}, function (data) {
							var uploadAuth = data.result.UploadAuth
							var uploadAddress = data.result.UploadAddress
							var videoId = data.result.VideoId
							uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
						}, 'json')
					},
					// 全部文件上传结束
					onUploadEnd: function (uploadInfo) {
						// $('#status').text('文件上传完毕!')
						console.log(uploadInfo);
						console.log("onUploadEnd: uploaded all the files");
						
					}
				})
				return uploader
			}
		
			$scope.isoverTR = true;
			
			$scope.proList = []
			
			function getList() {
				const parmas = {
					pageNum: $scope.pageNum,
					pageSize: $scope.pageSize,
					data: {
						[$scope.searchType]: $scope.searchTxt,
						isErp: true,
						status: $scope.sourcestatus,
						sourceType: $scope.types,
						mediaType: $scope.mediaType ? Number($scope.mediaType) : undefined
					},
				};
				layer.load(2)
				erp.postFun('media/orderMedia/selectMediaDemandList', parmas, res => {
					layer.closeAll('loading')
					if (res.data.code === 200) {
						$scope.proList = res.data.data.list;
						$scope.totalNum = res.data.data.total;
						let totalNum = Math.ceil(Number($scope.totalNum) / Number($scope.pageSize));
						$scope.$broadcast('page-data', {
							pageSize: $scope.pageSize,
							pageNum: $scope.pageNum,
							totalNum: totalNum,
							totalCounts: $scope.totalNum,
							pageList: ['30', '50', '100']
						});
					}
				}, err => {
					console.log(err)
				});
			}
			
			$scope.$on('pagedata-fa', function (d, data) {
				$scope.pageNum = data.pageNum;
				$scope.pageSize = data.pageSize;
				getList();
			})
			
			getList();
			
			$scope.usersearch = function () {
				$scope.pageNum = 1;
				getList();
			}
			
			$scope.enterSearch = function (e) {
				$scope.searchFlag = true;
				if (e.keyCode == 13) {
					$scope.pageNum = 1;
					getList();
				}
			}
			
			//
			$scope.sourcechange = function () {
				$scope.pageNum = 1;
				getList();
			}
			
			//通过
			$scope.pass = function (item) {
				$scope.txt = '是否通过?';
				$scope.ispass = true;
				$scope.item = item;
				$scope.copyrightPrice = '';
				$scope.notCopyrightPrice = '';
			}
			
			//拒绝
			$scope.unpass = function (item) {
				$scope.txt = '是否拒绝?';
				$scope.ispass = true;
				$scope.item = item;
				$scope.refuseReason = ''
			}
			
			//
			$scope.goclick = function () {
				if ($scope.txt == '是否通过?') {
					passFn()
				} else if ($scope.txt == '是否拒绝?') {
					unPassFn()
				}
			}
			
			// 拒绝接口
			function unPassFn() {
				if (!$scope.refuseReason) {
					layer.msg('请填写拒绝理由');
					return;
				}
				const parmas = {
					id: $scope.item.id,
					status: '15',
					refuseExplain: $scope.refuseReason,
					mediaType: $scope.item.mediaType
				}
				layer.load(2)
				erp.postFun('media/orderMedia/updateMediaDemand', parmas, ({ data }) => {
					layer.closeAll('loading')
					$scope.ispass = false;
					layer.msg('操作成功');
					getList();
				}, err => {
					layer.msg('系统异常')
				});
			}
			
			// 通过接口
			function passFn() {
				if (!$scope.copyrightPrice) {
					layer.msg('请填写有版权价格');
					return;
				}
				if (!($scope.copyrightPrice > 0)) {
					layer.msg('有版权价格需大于0');
					return;
				}
				if (!$scope.notCopyrightPrice) {
					layer.msg('请填写无版权价格');
					return;
				}
				if (!($scope.notCopyrightPrice > 0)) {
					layer.msg('无版权价格需大于0');
					return;
				}
				const parmas = {
					id: $scope.item.id,
					status: '16',
					copyrightPrice: $scope.copyrightPrice,
					notCopyrightPrice: $scope.notCopyrightPrice,
					refuseExplain: $scope.refuseReason,
					mediaType: $scope.item.mediaType
				}
				layer.load(2)
				erp.postFun('media/orderMedia/updateMediaDemand', parmas, ({ data }) => {
					layer.closeAll('loading')
					$scope.ispass = false;
					layer.msg('操作成功');
					getList();
				}, err => {
					layer.msg('系统异常')
				});
			}
			
			// 价格输入限制
			$scope.onChangePrice = filds => {
				$scope[filds] = utils.floatLength($scope[filds], 2)
			};
			
			// 上传 / 编辑 视频
			$scope.handleUploadVideo = item => {
				console.log(item)
				$scope.isUploadVideo = true;
				$scope.item = item
				if (item.status === '17') {
					$scope.videoTitle = '上传视频'
					$scope.videoName = ''
					$scope.copyrightPrice = ''
					$scope.notCopyrightPrice = ''
					$scope.isFree = item.copyright === '2' ? '0' : '1'
					$scope.isDisabled = item.copyright === '2'
					$scope.isEdit = false
				} else {
					$scope.videoTitle = '编辑视频'
					$scope.isEdit = true
					$scope.videoName = item.videoName
					$scope.copyrightPrice = item.copyrightPrice
					$scope.notCopyrightPrice = item.notCopyrightPrice
					$scope.isFree = item.isFree
				}
				getMediaData()
			}
			
			$scope.onUploadVideo = () => {
				if (!$scope.isEdit && !$scope.videoName) {
					layer.msg('输入视频名称')
					return
				}
				if (!$scope.isEdit && !$scope.copyrightPrice) {
					layer.msg('有版权价格')
					return;
				}
				if (!$scope.isEdit && !$scope.notCopyrightPrice) {
					layer.msg('无版权价格')
					return;
				}
				document.getElementById('uploadVideo').click()
			}
			
			$scope.upLoadVideoChange = file => {
				const uploader = createUploader();
				uploader.addFile(file[0], null, null, null, '{"Vod":{}}')
				layer.load(2);
				uploader.startUpload();
				document.getElementById('uploadVideo').value = ''
			}
			
			// 选择视频
			$scope.hadleSelectVodeo = item => {
				$scope.videoList = $scope.videoList.map(o => ({ ...o, checked: o.videoId === item.videoId }))
			}
			
			$scope.handleConfirmVideo = () => {
				$scope.videoSelectData = $scope.videoList.filter(o => o.checked)[0]
				console.log($scope.videoSelectData)
				if (!$scope.isEdit && !$scope.videoName) {
					layer.msg('输入视频名称')
					return
				}
				if (!$scope.isEdit && !$scope.copyrightPrice) {
					layer.msg('有版权价格')
					return;
				}
				if (!$scope.isEdit &&!($scope.copyrightPrice > 0)) {
					layer.msg('有版权价格需大于0');
					return;
				}
				if (!$scope.isEdit && !$scope.notCopyrightPrice) {
					layer.msg('无版权价格')
					return;
				}
				if (!$scope.isEdit &&!($scope.notCopyrightPrice > 0)) {
					layer.msg('无版权价格需大于0');
					return;
				}
				if (!$scope.videoSelectData) {
					layer.msg('请选择一个上传的视频')
					return;
				}
				const parmas = {
					id: $scope.item.id,
					mediaType: 0,
					videoId: $scope.videoSelectData.videoId,
					status: '18'
				}
				layer.load(2);
				erp.postFun('media/orderMedia/updateMediaOrder', parmas, ({ data }) => {
					layer.closeAll("loading")
					if (data.code === 200) {
						$scope.isUploadVideo = false;
						getList();
						layer.msg('操作成功')
					} else {
						layer.msg(data.message)
					}
				}, err => {
				
				})
			}
			
			// 上传图片
			$scope.handleUploadImg = item => {
				$scope.isUploadImg = true;
				$scope.item = item
				if (item.status === '17') {
					$scope.isEdit = false
					$scope.imgTitle = '上传图片'
				} else {
					$scope.isEdit = true
					$scope.imgTitle = '编辑图片'
				}
				getImgData()
			}
			
			$scope.onUploadImg = () => {
        if($scope.imgData.length >= 10){
          layer.msg('最多上传10张图片')
					return
        }
				document.getElementById('uploadImg').click()
			}
			
			$scope.upLoadImgChange = file => {
				erp.ossUploadFile(file, res => {
					//console.log(res);
					document.getElementById('uploadImg').value = ''
					if (res.code === 1) {
						$scope.imgData = [...$scope.imgData, res.succssLinks[0]];
					}
					$scope.$apply();
				});
			}
			
			// 删除图片
			$scope.handleRemove = item => {
				$scope.imgData = $scope.imgData.filter(o => o !== item);
			};
			
			$scope.handleConfirmImg = () => {
				console.log($scope.imgData);
				if ($scope.imgData.length === 0){
					layer.msg('请上传图片')
					return
				}
				const parmas = {
					id: $scope.item.id,
					mediaType: 1,
					images: $scope.imgData,
					status: '18'
				}
				layer.load(2);
				erp.postFun('media/orderMedia/updateMediaOrder', parmas, ({ data }) => {
					layer.closeAll("loading")
					if (data.code === 200) {
						$scope.isUploadImg = false;
						getList();
						layer.msg('操作成功')
					} else {
						layer.msg(data.message)
					}
				}, err => {
				
				})
			}
			
			// 获取媒体
			function getMediaData() {
				const parmas = {
					locId: $scope.item.cjproductId,
					mediaDemandId: $scope.item.id
				}
				layer.load(2);
				erp.postFun('media/orderMedia/selectVideoListByLocProductId', parmas, ({ data }) => {
					layer.closeAll("loading")
					if (data.code === 200) {
						$scope.videoList = data.data || []
						console.log($scope.videoList)
					} else {
						layer.msg(data.message)
					}
				}, err => {
				
				})
			}
			
			// 获取图片
			function getImgData() {
				const parmas = {
					ids: $scope.item.id
				}
				layer.load(2);
				erp.postFun('media/orderMedia/selectMediaList', parmas, ({ data }) => {
					layer.closeAll("loading")
					if (data.code === 200) {
						$scope.imgData = data.data.images ? JSON.parse(data.data.images) : []
						console.log($scope.imgData)
					} else {
						layer.msg(data.message)
					}
				}, err => {
				
				})
			}
			
			// 查看视频
			$scope.handleLookVideo = item => {
				console.log(item);
				layer.load(2)
				let { videoId = '' } = item;
				const eleId = 'video-box';
				const sourceUrl = '';
				$scope.isLookVideo = true;
				cjUtils.getVideoInfo({
					eleId,
					videoId,
					sourceUrl,
					configuration: {
						width: '100%',     //视频宽度
						height: '100%',     //视频高度
					},
					callback: player => {
						layer.closeAll('loading')
						aliPlayer = player
						$scope.$apply()
					}
				})
			}
			
			// 关闭视频
			$scope.handleCloseVideo = () => {
				aliPlayer && aliPlayer.pause()
				$scope.isLookVideo = false
            }

            $scope.viewText = text => {
                layer.open({
                  title: '',
                  content: text
                })
            }
		}])

    app.controller('trademarkProductsCtrl', ['$scope', '$window', '$location', '$compile', '$routeParams', '$timeout', '$http', 'merchan', 'erp', function ($scope, $window, $location, $compile, $routeParams, $timeout, $http, merchan, erp) {
	
	    console.log('侵权商品') //erploginName
	    let bs = new Base64(),
		    loginName = localStorage.getItem('erploginName') ? bs.decode(localStorage.getItem('erploginName')) : '',
		    canShowArr = ['admin', '王慧云']
	
	    $scope.canShow = canShowArr.includes(loginName)
	
	    $scope.tortType = '0' // 0 著名品牌 1 其他品牌
	    $scope.limit = '40'
	    $scope.page = '1'
	
	    function getList() {
		    var queryData = {
			    page: $scope.page,
			    limit: $scope.limit,
			    type: $scope.tortType
		    };
		    if ($scope.searchVal) {
			    queryData.name = $scope.searchVal;
		    } else {
			    queryData.name = '';
		    }
		    layer.load(2)
		    erp.postFun('app/trademark/listTrademark', JSON.stringify(queryData), function (data) {
			    layer.closeAll('loading')
			    console.log(data)
			    if (data.data.statusCode == 200) {
				    var result = JSON.parse(data.data.result)
				    $scope.brandList1 = result.list
				    $scope.totalNum = result.count;
				    var totalNum = Math.ceil(Number($scope.totalNum) / Number($scope.limit));
				    $scope.$broadcast('page-data', {
					    pageSize: $scope.limit,//每页条数
					    pageNum: $scope.page,//页码
					    totalNum: totalNum,//总页数
					    totalCounts: result.count,//数据总条数
					    pageList: ['10', '20', '40']//条数选择列表，例：['10','50','100']
				    })
			    } else {
                    layer.msg('查询失败')
                }
            }, function (data) {
                console.log(data)
            })
        }

        $scope.$on('pagedata-fa', function (d, data) {// 分页onchange
			$scope.page = data.pageNum;
			$scope.limit = data.pageSize;
			getList();
		})

        getList()
        $('.tratop-inp').keypress(function (e) {
            if (e.keyCode == 13) {
                getList();
            }
        });
        $scope.searchFun = function () {
            $scope.page = '1'
            getList();
        }
        //复选
        $scope.checkFun1 = function (item, index) {
            console.log(item)
            console.log(item.checked)
            if (item.checked) {
                $scope.brandList1[index].checked = true;
            } else {
                console.log('=======')
                $scope.brandList1[index].checked = false;
            }
            console.log($scope.brandList1[index])
        }
        $scope.checkFun2 = function (item, index) {
            console.log(item)
            if (item.checked) {
                $scope.brandList2[index].checked = true;
            } else {
                $scope.brandList2[index].checked = false;
            }
            console.log($scope.brandList2[index])
        }
        //修改
        // $scope.selBrandFun = function () {
        //     console.log($scope.selBrandVal)
        // }
        $scope.modefyFun = function () {
            if (!$scope.selBrandVal) {
                layer.msg('请选择品牌');
                return;
            }
            if (!$scope.modefyNameen && !$scope.modefyNamecn) {
                layer.msg('中文英文名称至少要有一个')
                return;
            }
            var countSel = 0;
            for (var i = 0; i < $scope.brandList1.length; i++) {
                if ($scope.brandList1[i].checked) {
                    var uid = $scope.brandList1[i].uid;
                }
            }
            $scope.modefyFlag = false;
            var modefyUpdata = {};
            modefyUpdata.uid = uid;
            modefyUpdata.nameen = $scope.modefyNameen;
            modefyUpdata.namecn = $scope.modefyNamecn;
            modefyUpdata.type = $scope.selBrandVal;
            erp.postFun('app/trademark/updateTrademark', JSON.stringify(modefyUpdata), function (data) {
                console.log(data)
                if (data.data.statusCode == 200) {
                    layer.msg('修改成功')
                    $scope.modefyNameen = '';
                    $scope.modefyNamecn = '';
                    $scope.selBrandVal = '';
                    getList();
                } else {
                    layer.msg('修改失败')
                }
            }, function (data) {
                console.log(data)
            })
        }

        $scope.updateFun = function () {
            var countSel = 0;
            for (var i = 0; i < $scope.brandList1.length; i++) {
                if ($scope.brandList1[i].checked) {
                    countSel++;
                    var uid = $scope.brandList1[i].uid;
                }
            }
            console.log(countSel)
            if (countSel < 1) return layer.msg('请选中一个商品')
            if (countSel > 1) return layer.msg('修改只能选中一个')
            $scope.modefyFlag = true;
            var modefyUpdata = {};
            modefyUpdata.uid = uid;
            erp.postFun('app/trademark/getTrademarkById', JSON.stringify(modefyUpdata), function (data) {
                console.log(data)
                var result = JSON.parse(data.data.result);
                if (data.data.statusCode == 200) {
                    $scope.modefyNameen = result.data.nameen;
                    $scope.modefyNamecn = result.data.namecn;
                    $scope.selBrandVal = result.data.type;
                } else {
                    layer.msg('获取商品对应信息失败!');
                }
            }, function (data) {
                console.log(data)
            })
        }

        //新增
        $scope.addFun = function () {
            if (!$scope.selBrandVal) {
                layer.msg('请选择品牌');
                return;
            }
            if (!$scope.modefyNameen && !$scope.modefyNamecn) {
                layer.msg('中文英文名称至少要有一个')
                return;
            }
            $scope.addFlag = false;
            var modefyUpdata = {};
            modefyUpdata.nameen = $scope.modefyNameen;
            modefyUpdata.namecn = $scope.modefyNamecn;
            modefyUpdata.type = $scope.selBrandVal;
            erp.postFun('app/trademark/insertTrademark', JSON.stringify(modefyUpdata), function (data) {
                console.log(data)
                if (data.data.statusCode == 200) {
                    layer.msg('添加成功')
                    $scope.modefyNameen = '';
                    $scope.modefyNamecn = '';
                    $scope.selBrandVal = '';
                    getList();
                } else {
                    layer.msg('添加失败')
                }
            }, function (data) {
                console.log(data)
            })
        }
        //删除
        $scope.deleteFun = function () {
            var countSel = 0;
            var uid = '';
            for (var i = 0; i < $scope.brandList1.length; i++) {
                if ($scope.brandList1[i].checked) {
                    countSel++;
                    uid += $scope.brandList1[i].uid + ',';
                }
            }
            if (countSel < 1) return layer.msg('请选中要删除的商品')
            $scope.deleteFlag = false;
            var modefyUpdata = {};
            modefyUpdata.uids = uid;
            erp.postFun('app/trademark/deleteTrademark', JSON.stringify(modefyUpdata), function (data) {
                console.log(data)
                if (data.data.statusCode == 200) {
                    layer.msg('删除成功')
                    getList();
                } else {
                    layer.msg('删除失败')
                }
            }, function (data) {
                console.log(data)
            })
        }
        $scope.rowfun = function (item) {
            if (item == 1) {
                return 0;
            } else {
                return item;
            }
        }
        console.log($scope.rowfun(1))
        //点击行数加样式
        $scope.TrClick = function (i) {
            $scope.focus = i;
        }
    }])

    app.controller('ProductSettingsCtrl', ['$scope', 'erp', '$filter', function ($scope, erp, $filter) {
        $scope.pageNum = '';
        $scope.isEdit = false;
        $scope.DateTab = [{
            name: 'Trending Products',
            flag: true,
            key: 'Dropshipping'
        },
        {
            name: 'New Products',
            flag: false,
            key: 'month'
        },
        /* {
            name: 'Hot Selling Catagories',
            flag: false,
            key: 'category1'
        }, */
        {
            name: 'Listable Product',
            flag: false,
            key: 'listed'
        },
        {
            name: 'US Warehouse Products',
            flag: false,
            key: 'USAStorage'
        },
        {
            name: 'Video Products',
            flag: false,
            key: 'video'
        },
        {
            name: 'Souring Products',
            flag: false,
            key: 'source'
				},
				{
					name: 'Thailand Warehouse Products',
					flag: false,
					key: 'th'
	      },
				{
					name: 'Print on Demand',
					flag: false,
					key: 'POD'
				}
        ];
        $scope.activeIndex = '0'; //当前tab选项的index
        $scope.type = 1; //1：list页面；2：添加
        $scope.showType = 1; //1:提交确认；2：重复的弹窗提示；3：SKU未找到对应的商品;4:删除；5：下架
        $scope.showConfirmMsg = ''; //弹框提示
        $scope.isShowTip = false; //是否显示提示弹框
        $scope.proList = []; //产品列表
        let productID = '';
        $scope.dataObj = { //查询产品列表参数
            pageNum: 1,
            pageSize: '30',
            positionKey: 'Dropshipping',
            productId: '',
            sku: '',
            startTime: '',
            stopTime: '',
            strOrderBy: '',
            state: ''
        };
        $scope.addObj = { //添加或修改参数
            position: '',
            positionKey: '',
            productId: '',
            sku: '',
            startTime: '',
            stopTime: '',
            sort: '',
            bigImg: '',
            id: ''
        }
        getData(); //数据初始化
        /*DateTab 切换*/
        $scope.changeTab = ($index) => {
            $scope.DateTab.forEach(function (o, i) {
                o.flag = false;
            });
            $scope.DateTab[$index].flag = true;
            $scope.activeIndex = $index;
            $("#starttime").val('');
            $("#endtime").val('');
            $scope.dataObj.sku = '';
            $scope.dataObj.state = '';
            getData();
        };
        $scope.searchFun = () => { //添加是查询sku
            $scope.dataObj.pageNum = $scope.pageNum;
            getData();
        }
        $scope.submitFun = () => { //提交新增或修改确认
            let startTime = $("#starttimeadd").val();
            let stopTime = $("#endtimeadd").val();
            $scope.addObj.startTime = new Date(startTime).getTime();
            $scope.addObj.stopTime = new Date(stopTime).getTime();
            if (!$scope.addObj.sku) {
                layer.msg('请输入商品SKU');
            } else if (!$scope.addObj.positionKey) {
                layer.msg('请选择放置位置');
            } else if (!$scope.addObj.sort) {
                layer.msg('请选择放置顺序');
            } else if (!$scope.addObj.startTime) {
                layer.msg('请选择上架时间');
            } else if (!$scope.addObj.stopTime) {
                layer.msg('请选择下架时间');
            } else if ($scope.addObj.startTime > $scope.addObj.stopTime) {
                layer.msg('上架时间大于下架时间，请重新选择');
            } else if ($scope.addObj.startTime == $scope.addObj.stopTime) {
                layer.msg('上架时间与下架时间相同，请重新选择');
            } else if (!$scope.addObj.productId) {
                $scope.isShowTip = true;
                $scope.showType = 3;
                $scope.showConfirmMsg = '未找到对应的商品，请输入正确的商品SKU';
            } else {
                $scope.DateTab.filter(item => {
                    if (item.key == $scope.addObj.positionKey) {
                        $scope.addObj.position = item.name;
                    }
                })
                $scope.isShowTip = true;
                $scope.showType = 1;
                $scope.showConfirmMsg = '是否确认提交该商品排序？';
            }
        }
        $scope.addProduct = (item) => { //添加或者修改产品
            if (!item) {
                $scope.isEdit = false;
                $scope.addObj = {
                    positionKey: '',
                    productId: '',
                    sku: '',
                    startTime: '',
                    stopTime: '',
                    sort: '',
                    bigImg: '',
                    id: ''
                };
                $('#starttimeadd').val('');
                $('#endtimeadd').val('');
            } else {
                $scope.isEdit = true;
                for (let key in $scope.addObj) {
                    $scope.addObj[key] = item[key] + ''; //数字转为字符串
                }
                $('#starttimeadd').val($filter('date')(item.startTime, 'yyyy-MM-dd HH:mm'));
                $('#endtimeadd').val($filter('date')(item.stopTime, 'yyyy-MM-dd HH:mm'));
            }
            $scope.type = 2;
        }
        $scope.delFun = (item) => { //删除产品
            $scope.isShowTip = true;
            $scope.showType = 4;
            $scope.showConfirmMsg = '是否确认删除该商品排序？';
            productID = item.id;
            for (let key in $scope.addObj) {
                $scope.addObj[key] = item[key];
            }
            $scope.DateTab.filter((item) => {
                if (item.key == $scope.addObj.positionKey) {
                    $scope.addObj.position = item.name;
                }
            })
        }
        $scope.searchSKU = () => { //查找sku
            erp.postFun('erp/manualSorting/getProductBySku', {
                sku: $scope.addObj.sku
            }, (data) => {
                if (data.data.statusCode == '200') {
                    if (data.data.result.length > 0) {
                        $scope.addObj.productId = data.data.result[0].productId;
                        $scope.addObj.bigImg = data.data.result[0].bigImg;
                    } else {
                        $scope.addObj.productId = '';
                        $scope.addObj.bigImg = '';
                    }
                } else {
                    $scope.addObj.productId = '';
                    $scope.addObj.bigImg = '';
                    layer.msg(data.data.message);
                }
            })
        }
        $scope.downFun = (item) => { //下架
            $scope.isShowTip = true;
            $scope.showType = 5;
            $scope.showConfirmMsg = '是否确认下架该商品排序？';
            productID = item.id;
            for (let key in $scope.addObj) {
                $scope.addObj[key] = item[key];
            }
            $scope.DateTab.filter((item) => {
                if (item.key == $scope.addObj.positionKey) {
                    $scope.addObj.position = item.name;
                }
            })
        }
        $scope.sureFun = throttle(sureFun1, 1500);
        function sureFun1() { //弹框确认按钮，最终提交
            if ($scope.showType == 1 || $scope.showType == 2) {
                editAdd();
            } else if ($scope.showType == 3) {
                $scope.isShowTip = false;
            } else if ($scope.showType == 4) {
                delFun();
            } else if ($scope.showType == 5) {
                downFun();
            }
        }
        function editAdd() {
            let paramObj = {
                chongTuXiaJia: false,
                model: $scope.addObj
            }
            let postURL;
            if (!$scope.isEdit) {
                postURL = 'erp/manualSorting/insert';
            } else {
                postURL = 'erp/manualSorting/updateById';
            }
            layer.load(2);
            if ($scope.showType == 2) {
                paramObj.chongTuXiaJia = true;
            } else {
                paramObj.chongTuXiaJia = false;
            }
            erp.postFun(postURL, paramObj, data => {
                layer.closeAll();
                if (data.data.statusCode == '200') {
                    $scope.isShowTip = false;
                    resetIndexData();
                } else if (data.data.statusCode == '509') {
                    $scope.showType = 2;
                    let result = data.data.result
                    let repeatList = result.map(item => {
                        return item.sku
                    })
                    let repeatStr = repeatList.join(',');
                    $scope.showConfirmMsg = '该商品放置时间与商品（' + repeatStr + '）有重合，如果确认提交将在该商品上架时自动下架商品（' + repeatStr + '）';
                } else {
                    layer.msg(data.data.message);
                }
            })
        }

        function delFun() {
            erp.postFun('erp/manualSorting/deleteById', {
                id: productID
            }, function (data) {
                if (data.data.statusCode == '200') {
                    $scope.isShowTip = false;
                    getData();
                } else {
                    layer.msg(data.data.message);
                }
            })
        }

        function downFun() {
            erp.postFun('erp/manualSorting/xiaJia', {
                id: productID
            }, (data) => {
                if (data.data.statusCode == '200') {
                    $scope.isShowTip = false;
										getData();
										// $scope.proList = $scope.proList.map(item => {
										// 	if(item.id === productID) item.state = 3
										// 	return item
										// })
										// $scope.proList = [...$scope.proList.splice($scope.proList.findIndex(_ => _.id === productID), 1), ...$scope.proList]
                } else {
                    layer.msg(data.data.message);
                }

            })
        }

        function resetIndexData() { //新增或修改成功时重新获取页面数据
            $scope.type = 1;
            $scope.DateTab.forEach((item, index) => {
                item.flag = false;
                if (item.key == $scope.addObj.positionKey) {
                    $scope.activeIndex = index;
                }
            })
            $scope.DateTab[$scope.activeIndex].flag = true;
            getData();
        }

        function getData() { //获取产品数据
            let startTime = $("#starttime").val();
            let stopTime = $("#endtime").val();
            $scope.dataObj.startTime = startTime ? new Date(startTime).getTime() : '';
            $scope.dataObj.stopTime = stopTime ? new Date(stopTime).getTime() : '';
            $scope.dataObj.positionKey = $scope.DateTab[$scope.activeIndex].key;
            layer.load(2);
            erp.postFun('erp/manualSorting/queryPage', $scope.dataObj, (data) => {
                layer.closeAll();
                let result = data.data.result;
                $scope.proList = result.rows;
                $scope.totalCounts = result.total;
                $scope.$broadcast('page-data', {
                    pageSize: $scope.dataObj.pageSize,
                    pageNum: $scope.dataObj.pageNum,
                    totalNum: result.pages,
                    totalCounts: $scope.totalCounts,
                    pageList: ['30', '50', '100']
                });
            })
        }
        $scope.$on('pagedata-fa', function (d, data) {
            $scope.dataObj.pageNum = data.pageNum;
            $scope.dataObj.pageSize = data.pageSize;
            getData();
        })
    }]);

    app.controller('merchandiseSoldOutCtrl', ['$scope', '$routeParams', 'erp', function ($scope, $routeParams, erp) {
        console.log('merchandiseSoldOutCtrl');
        $scope.SKUValue = '';

        $scope.pageNum = '1';
        $scope.pageSize = '30';
        $scope.searchInfo = '';

        $scope.xiajiaList = [];
        $scope.totalXiajia = 0;

        //获取下架列表
        getSoldOutList();

        $scope.$on('pagedata-fa', function (d, data) {
            $scope.pageNum = data.pageNum;
            $scope.pageSize = data.pageSize;
            getSoldOutList();
        })

        function getSoldOutList() {
            var sendData = {
                page: $scope.pageNum,
                pageNum: $scope.pageSize,
                sku: $scope.searchInfo
            }
            erp.load();
            erp.postFun('erp/skuSoldOut/getSoldOutSku', JSON.stringify(sendData), function (data) {
                erp.closeLoad();
                console.log(data.data);
                if (data.data.statusCode == '200') {
                    var result = data.data.result;
                    var soldOutSkuList = result.soldOutSkuList;
                    $scope.totalCount = result.count;
                    $scope.soldOutSkuList = soldOutSkuList;
                    if (soldOutSkuList.length < 1) {
                        layer.msg('暂无数据');
                    } else {
                        //CATEGORY: "Jewelry & Watches / Fine Jewelry / 925 Silver Jewelry"
                        $.each($scope.soldOutSkuList, function (i, v) {
                            var cat = v.CATEGORY;
                            var arr = cat.split(' / ');
                            console.log(arr);
                            var newArr = [];
                            $.each(arr, function (i, v) {
                                var data = {
                                    name: v
                                }
                                newArr.push(data);
                            })
                            v.CATEGORY = newArr;
                        });
                        console.log($scope.soldOutSkuList);

                    }
                    // pageFun();
                    let totalNum = Math.ceil(Number($scope.totalCount) / Number($scope.pageSize));
                    $scope.$broadcast('page-data', {
                        pageSize: $scope.pageSize,
                        pageNum: $scope.pageNum,
                        totalNum: totalNum,
                        totalCounts: $scope.totalCount,
                        pageList: ['30', '50', '100']
                    });
                } else {
                    layer.msg('查询失败');
                }
            }, function () {
                erp.closeLoad();
            });
        }
        $scope.searchFun = function () {
            $scope.pageNum = '1';
            getSoldOutList();
        }
        //上架

        $scope.shangjiaFun = function (item) {
            layer.confirm('确认要上架吗？', {
                btn: ['确定', '取消'] //按钮
            }, function (index) {
                layer.close(index);
                var vid = item.vID;
                vid = "'" + vid + "'";
                var data = {
                    vids: vid
                }
                putSku(data);
            });

        }

        function putSku(sendData) {
            erp.load();
            erp.postFun('erp/skuSoldOut/putSkuByVids', JSON.stringify(sendData), function (data) {
                erp.closeLoad();
                if (data.data.result > 0) {
                    var send = {
                        vID: sendData.vids,
                        type: 'del'
                    }
                    erp.postFun('order/order/shuaxinwuliu', JSON.stringify(send), function (data) {
                        console.log(data);
                    }, function () { });
                    layer.msg('上架成功');
                    getSoldOutList();
                } else {
                    layer.msg('上架失败');
                }
            }, function () {
                erp.closeLoad();
            });
        }

        //下架sku、、
        $scope.xiajiaSKU = function () {
            $scope.xiajiaList = [];
            $scope.skuList = [];
            $scope.SKUValue = '';
            $('.zzc').show();
        }
        $scope.cancelXiajiaFun = function () {
            $('.zzc').hide();
        }
        $scope.addXiajiaItem = function (item) {
            var flag = false;
            $.each($scope.xiajiaList, function (i, v) {
                if (v === item) {
                    flag = true;
                }
            })
            if (!flag) {
                console.log($scope.xiajiaList.length);
                if ($scope.xiajiaList.length == 20) {
                    layer.msg('最多批量下架20条');
                } else {
                    $scope.xiajiaList.push(item);
                    console.log($scope.xiajiaList);
                    $scope.totalXiajia = $scope.xiajiaList.length;
                }
            } else {
                layer.msg('该SKU已经加入到下架列表了');
            }

        }
        $scope.deleteXiajia = function (index) {
            console.log(index);
            $scope.xiajiaList.splice(index, 1);
            $scope.totalXiajia = $scope.xiajiaList.length;
            console.log($scope.xiajiaList);
        }
        $scope.sureXiajiaFun = function () {

            if ($scope.xiajiaList.length < 1) {
                layer.msg('请先选择添加需要下架的SKU');
            } else {
                $('.reasonZZC').show();
                $('#xiajiaReason').val('缺货');
            }

        }
        $scope.sureXiajiaReasonFun = function () {
            var str = '';
            var reason = $('#xiajiaReason').val();
            $.each($scope.xiajiaList, function (i, v) {
                var vid = v.ID;
                vid = "'" + vid + "'";
                if (i == 0) {
                    str += vid;
                } else {
                    str += "," + vid;
                }
            })
            var sendData = {
                vids: str,
                soldOutCause: reason
            }
            console.log(sendData);
            erp.load();
            erp.postFun('erp/skuSoldOut/soldOutSkuByVids', JSON.stringify(sendData), function (data) {
                erp.closeLoad();
                console.log(data.data);
                if (data.data.result > 0) {
                    var send = {
                        vID: sendData.vids,
                        type: 'add'
                    }
                    erp.postFun('order/order/shuaxinwuliu', JSON.stringify(send), function (data) {
                        console.log(data);
                    }, function () { });
                    layer.msg('下架成功');
                    $('.zzc').hide();
                    $('.reasonZZC').hide();
                    getSoldOutList();
                } else {
                    layer.msg('下架失败');
                }
            }, function () {
                erp.closeLoad();
            });
        }
        $scope.cancelReason = function () {
            $('.reasonZZC').hide();
        }

        //全选
        $scope.checkAll = function (event) {
            console.log('111');
            var target = $(event.currentTarget);
            if (target.hasClass('checked')) {
                target.removeClass('checked');
                $('.ea-list-table').find('tbody .checkIcon').removeClass('checked');
            } else {
                target.addClass('checked');
                $('.ea-list-table').find('tbody .checkIcon').addClass('checked');
            }
        }
        //单选
        $('.ea-list-table').on('click', 'tbody .checkIcon', function (e) {
            var target = $(e.target);
            if (target.hasClass('checked')) {
                target.removeClass('checked');
            } else {
                target.addClass('checked');
            }
            var checklist = $('.ea-list-table').find('tbody .checkIcon');
            var checked = $('.ea-list-table').find('tbody .checked');
            if (checklist.length == checked.length) {
                $('.checkAllIcon').addClass('checked');
            } else {
                $('.checkAllIcon').removeClass('checked');
            }
        });
        //批量上架
        $scope.piliangshangjiaFun = function () {
            var checked = $('.ea-list-table').find('tbody .checked');
            if (checked.length < 1) {
                layer.msg('请选择需要商家的SKU');
            } else {
                var str = '';
                $.each(checked, function (i, v) {
                    var target = $(v);
                    var vid = target.attr('data-id');
                    console.log(vid);
                    vid = "'" + vid + "'";
                    if (i == 0) {
                        str += vid;
                    } else {
                        str += ',' + vid;
                    }
                })
                layer.confirm('确认要上架吗？', {
                    btn: ['确定', '取消'] //按钮
                }, function (index) {
                    layer.close(index);
                    var data = {
                        vids: str
                    }
                    putSku(data);
                });
            }
        }
        /** */

        $scope.gotoSoldOut = function () {
            var type = $routeParams.type;
            location.href = '#/merchandise/list/' + type + '/5';
        }
        $scope.searchBySKU = function () {
            var sendData = {
                sku: $scope.SKUValue
            }
            erp.load();
            erp.postFun('erp/skuSoldOut/getSkuInfoBySku', JSON.stringify(sendData), function (data) {
                erp.closeLoad();
                console.log(data.data);
                if (data.data.statusCode == '200') {
                    var result = data.data.result;
                    $scope.skuList = result;
                    if ($scope.skuList < 1) {
                        layer.msg('暂无数据');
                    }
                }
            }, function () {
                erp.closeLoad();
            });

        }

        $scope.classCreateTime = function (time, type) {
            var time = new Date(time);
            var year = time.getFullYear();
            var month = time.getMonth() + 1;
            var day = time.getDate();
            var hour = time.getHours();
            var min = time.getMinutes();
            var seconds = time.getSeconds();
            if (month < 10) {
                month = '0' + month;
            }
            if (day < 10) {
                day = '0' + day;
            }
            if (hour < 10) {
                hour = '0' + hour;
            }
            if (min < 10) {
                min = '0' + min;
            }
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
            if (type == 1) {
                return year + '-' + month + '-' + day;
            } else if (type == 2) {
                return hour + ':' + min + ":" + seconds;
            }
        }


    }]);
    app.controller('bannerSettingCtrl', ['$scope', 'erp', '$filter', function ($scope, erp, $filter) {
        $scope.type = 1; //1：列表页面显示；2：编辑或新增
        $scope.showType = 1; //1:提交；2：重合；3：未找到对应的sku；4：删除；5：下架;6:唯一下架
        $scope.showConfirmMsg = '';
        $scope.proList = [];
        let productID = null, putNum = null;//做下架，删除操作时
        $scope.positionList = ['1', '2', '3', '4', '5', '6', '7'];
        $scope.uploadImg = '';
        $scope.dataObj = { //查询产品列表参数
            pageNum: 1,
            pageSize: '30',
            sort: '',
            productId: '',
            sku: '',
            startTime: '',
            endTime: '',
            strOrderBy: '',
            status: ''
        };
        $scope.addObj = { //添加或修改参数
            appImg: '',
            webImg: '',
            urlOrSku: '',
            sort: '',
            putTime: '',
            status: '',
            skipType: '1', //1：不跳转；2：网页跳转；3：商品详情跳转
            bid: '',
            now: 'true',
            productId: '',
            platformType: ''
        }
        getData();
        $scope.searchFun = () => { //添加是查询sku
            getData();
        }
        $scope.submitFun = () => { //提交新增或修改确认
            let reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
            if ($scope.addObj.now == 'true') {
                $scope.addObj.putTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')
            } else {
                let startTime = $("#starttimeadd").val();
                $scope.addObj.putTime = startTime;
            }
            console.log($scope.addObj.platformType)
            if (!$scope.addObj.platformType) {
                layer.msg('请选择banner平台');
            } else if (!$scope.uploadImg && $scope.addObj.platformType == '1') {
                layer.msg('请上传web图片');
            } else if (!$scope.uploadImg && $scope.addObj.platformType == '2') {
                layer.msg('请上传app图片');
            } else if ($scope.addObj.skipType == 2 && !$scope.addObj.urlOrSku) {
                layer.msg('请输入地址');
            } else if ($scope.addObj.skipType == 2 && !reg.test($scope.addObj.urlOrSku)) {
                layer.msg('请输入正确的地址');
            } else if ($scope.addObj.skipType == 3 && !$scope.addObj.urlOrSku) {
                layer.msg('请输入商品SKU');
            } else if (!$scope.addObj.sort) {
                layer.msg('请选择放置顺序');
            } else if (!$scope.addObj.putTime) {
                layer.msg('请选择上架时间');
            } else {
                if ($scope.addObj.platformType == '1') {
                    $scope.addObj.webImg = $scope.uploadImg;
                } else {
                    $scope.addObj.appImg = $scope.uploadImg;
                }
                $scope.isShowTip = true;
                $scope.showType = 1;
                $scope.showConfirmMsg = '是否确认提交该banner设置？';
            }
        }
        $scope.addProduct = (item) => { //添加或者修改产品
            if (!item) {
                $scope.isEdit = false;
                $scope.uploadImg = '';
                $scope.addObj = { //添加或修改参数
                    appImg: '',
                    webImg: '',
                    urlOrSku: '',
                    sort: '',
                    putTime: '',
                    status: '',
                    skipType: '1', //1：不跳转；2：网页跳转；3：商品详情跳转
                    bid: '',
                    now: 'true',
                    productId: ''
                }
                $('#starttimeadd').val('');
            } else {
                $scope.isEdit = true;
                for (let key in $scope.addObj) {
                    $scope.addObj[key] = item[key] + ''; //数字转为字符串
                }
                $scope.addObj.bid = item.id;
                $scope.addObj.now = 'false';
                $('#starttimeadd').val($filter('date')(item.putTime, 'yyyy-MM-dd HH:mm:ss'));
            }
            $scope.type = 2;
        }
        $scope.delFun = (item) => { //删除再次确认
            productID = item.id;
            $scope.showType = 4;
            $scope.showConfirmMsg = '是否确认删除该banner设置？';
            $scope.isShowTip = true;
            for (let key in $scope.addObj) {
                if (key == 'putTime') {
                    $scope.addObj['putTime'] = $filter('date')(item['putTime'], 'yyyy-MM-dd HH:mm:ss');
                } else {
                    $scope.addObj[key] = item[key];
                }
            }
        }
        $scope.downFun = (item) => { //下架再次确认
            $scope.isShowTip = true;
            for (let key in $scope.addObj) {
                if (key == 'putTime') {
                    $scope.addObj['putTime'] = $filter('date')(item['putTime'], 'yyyy-MM-dd HH:mm:ss');
                } else {
                    $scope.addObj[key] = item[key];
                }
            }
            if (putNum == 1) {
                $scope.showType = 6;
                $scope.showConfirmMsg = '该商品为唯一上架banner商品，无法下架！';
            } else {
                $scope.showType = 5;
                $scope.showConfirmMsg = '是否确认下架该banner？';
                productID = item.id;
            }
        }
        $scope.searchSKU = () => { //查找sku,目前不需要
            if ($scope.addObj.skipType == 3) {
                /* erp.postFun('erp/manualSorting/getProductBySku', {
                    sku: $scope.addObj.urlOrSku
                }, (data) => {
                    if (data.data.statusCode == '200') {
                        if (data.data.result.length > 0) {
                            $scope.addObj.productId = data.data.result[0].productId;
                        } else {
                            $scope.addObj.productId = '';
                        }
                    } else {
                        $scope.addObj.productId = '';
                        layer.msg(data.data.message);
                    }
                }) */
            }
        }
        $scope.sureFun = throttle(sureFun1, 1500);
        function sureFun1() {
            if ($scope.showType == 1) {
                erp.postFun('erp/banner/isBannerCoincide', {
                    sort: $scope.addObj.sort,
                    platformType: $scope.addObj.platformType
                }, data => {
                    layer.closeAll();
                    if (data.data.statusCode == '200') {
                        if (data.data.result > 0) {
                            $scope.showType = 2;
                            $scope.showConfirmMsg = '该banner上架时间与其他banner有重合，确认提交后将在该banner上架时，自动下架之前banner';
                        } else {
                            editAdd();
                        }
                    } else {
                        layer.msg(data.data.message);
                    }
                })
            } else if ($scope.showType == 2) {
                editAdd();
            } else if ($scope.showType == 4) {
                delFun();
            } else if ($scope.showType == 5) {
                downFun();
            }
        }
        // 删除请求
        function delFun() {
            erp.postFun('erp/banner/delBanner', {
                id: productID
            }, function (data) {
                if (data.data.statusCode == '200') {
                    $scope.isShowTip = false;
                    getData();
                } else {
                    layer.msg(data.data.message);
                }
            })
        }
        // 下架请求
        function downFun() {
            erp.postFun('erp/banner/outBanner', {
                id: productID
            }, (data) => {
                if (data.data.statusCode == '200') {
                    $scope.isShowTip = false;
                    getData();
                } else {
                    layer.msg(data.data.message);
                }
            })
        }
        // 编辑
        function editAdd() {
            let postURL;
            if (!$scope.isEdit) {
                postURL = 'erp/banner/addBanner';
                if ($scope.addObj.now == 'true') {
                    $scope.addObj.status = 2;
                } else {
                    let otime = new Date().getTime();
                    let putTime = new Date($scope.addObj.putTime).getTime();
                    if (putTime > otime) {
                        $scope.addObj.status = 1;
                    } else {
                        $scope.addObj.status = 2;
                    }
                }
            } else {
                postURL = 'erp/banner/upBanner';
            }
            layer.load(2);
            erp.postFun(postURL, $scope.addObj, data => {
                layer.closeAll();
                if (data.data.statusCode == '200') {
                    $scope.isShowTip = false;
                    $scope.type = 1;
                    getData();
                } else {
                    layer.msg(data.data.message);
                }
            })
        }
        // 上传图片
        $scope.upLoadCustomImg = function (files) {
            createReader(files[0], function () {
                erp.ossUploadFile(files, function (data) {
                    if (data.succssLinks) {
                        $scope.uploadImg = data.succssLinks[0];
                        $scope.$apply();
                    }
                });
            });
        }
        // app端上传图片
        $scope.upLoadCustomappImg = function (files) {
            createReader(files[0], function () {
                erp.ossUploadFile(files, function (data) {
                    if (data.succssLinks) {
                        $scope.addObj.appImg = data.succssLinks[0];
                        $scope.$apply();
                    }
                });
            });
        }
        function getData() { //获取产品数据
            let startTime = $("#starttime").val();
            let endTime = $("#endtime").val();
            $scope.dataObj.startTime = startTime;
            $scope.dataObj.endTime = endTime;
            layer.load(2);
            erp.postFun('erp/banner/getBannerList', $scope.dataObj, (data) => {
                layer.closeAll();
                let result = data.data.result;
                $scope.proList = result.bannerList;
                putNum = result.putNum;
                $scope.totalCounts = result.count;
                let totalNum = Math.ceil(Number($scope.totalCounts) / Number($scope.dataObj.pageSize));
                $scope.$broadcast('page-data', {
                    pageSize: $scope.dataObj.pageSize,
                    pageNum: $scope.dataObj.pageNum,
                    totalNum: totalNum,
                    totalCounts: $scope.totalCounts,
                    pageList: ['30', '50', '100']
                });
            })
        }
        $scope.$on('pagedata-fa', function (d, data) {
            $scope.dataObj.pageNum = data.pageNum;
            $scope.dataObj.pageSize = data.pageSize;
            getData();
        })

        function createReader(file, whenReady) {
            var reader = new FileReader;
            reader.onload = function (evt) {
                var image = new Image();
                image.onload = function () {
                    var width = this.width;
                    var height = this.height;
                    if (whenReady) whenReady(width, height);
                };
                image.src = evt.target.result;
            };
            reader.readAsDataURL(file);
        }
    }]);
	
		// 报关品名
		app.controller('customsNameCtrl', ['$scope', '$window', '$location', '$compile', '$routeParams', '$timeout', '$http', 'merchan', 'erp', function ($scope, $window, $location, $compile, $routeParams, $timeout, $http, merchan, erp) {
			console.log('customsNameCtrl')
			$scope.zh_brandList = []
			$scope.en_brandList = []
			$scope.isEditOrAdd = false;
			$scope.isDelete = false;
			
			// 查询
			$scope.handleSearch = () => {
				getList()
			}
			
			// 获取数据
			function getList() {
				const parmas = {
					sensitiveWord: $scope.searchVal
				}
				layer.load(2)
				erp.postFun('erp/sensitive/selectKeyList', parmas, res => {
					layer.closeAll('loading')
					if (res.data.statusCode === '200') {
						$scope.zh_brandList = res.data.result.zh;
						$scope.en_brandList = res.data.result.us;
					} else {
						layer.msg('查询失败')
					}
				}, err => {
					console.log(err)
				})
			}
			
			getList()
			
			// 选择
			$scope.handleSelect = (item, index, dataList) => {
				if (item.checked) {
					dataList[index].checked = true;
				} else {
					dataList[index].checked = false;
				}
			}
			
			// 新增 / 编辑
			$scope.handleAdd = () => {
				$scope.isEditOrAdd = true;
				$scope.selBrandVal = '1'
				$scope.modefyName = ''
			}
			$scope.handleEdit = () => {
				if (getSelects().ids.length !== 1) {
					layer.msg('请选择一个做修改')
				} else {
					$scope.isEditOrAdd = true;
					$scope.modefyName = getSelects().items[0].sensitiveWord
					$scope.selBrandVal = getSelects().items[0].sensitiveType.toString()
				}
			}
			
			$scope.editOrAddConfirm = () => {
				// /[A-Za-z\u0391-\uFFE5]+/
				const reg = $scope.selBrandVal === '1' ? /^[\u0391-\uFFE5]+$/ : /^[A-Za-z]+$/
				console.log(reg.test($scope.modefyName))
				if(!reg.test($scope.modefyName)){
					layer.msg(`录入${$scope.selBrandVal === '1' ? '中文' : '英文'}品名只可输入${$scope.selBrandVal === '1' ? '中文' : '英文'}字符`)
					return
				}
				const id = getSelects().items[0] ? getSelects().items[0].id : null
				const parmas = {
					id,
					sensitiveWord: $scope.modefyName,
					sensitiveType: Number($scope.selBrandVal),
				}
				layer.load(2)
				erp.postFun('erp/sensitive/editKey ', parmas, res => {
					layer.closeAll('loading')
					if (res.data.statusCode === '200') {
						$scope.isEditOrAdd = false;
						layer.msg('操作成功')
						getList()
					} else {
						layer.msg(res.data.message)
					}
				}, err => {
					console.log(err)
				})
			}
			
			// 删除
			$scope.handleDelete = () => {
				if (getSelects().ids.length > 0) {
					$scope.isDelete = true;
				} else {
					layer.msg('请选择')
				}
			}
			$scope.deleteConfirm = () => {
				const parmas = {
					ids: getSelects().ids.join(','),
				}
				layer.load(2)
				erp.postFun('erp/sensitive/delKey', parmas, res => {
					layer.closeAll('loading')
					if (res.data.statusCode === '200') {
						$scope.isDelete = false;
						layer.msg('操作成功')
						getList()
					} else {
						layer.msg(res.data.message)
					}
				}, err => {
					console.log(err)
				})
			}
			
			// 获取选中id
			function getSelects() {
				const arr1 = $scope.zh_brandList.filter(o => o.checked)
				const arr2 = $scope.en_brandList.filter(o => o.checked)
				return {
					items: [...arr1, ...arr2],
					ids: [...arr1, ...arr2].map(i => i.id)
				}
			}
		}])
		
	function throttle(func, wait) {
        let previous = 0;
        return function () {
            let now = Date.now();
            let context = this;
            let args = arguments;
            if (now - previous > wait) {
                func.apply(context, args);
                previous = now;
            }
        }
    }
})(angular)
