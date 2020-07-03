(function(angular) {
  var app = angular.module('VideoORder-app', ['service']);
  app.controller('VideoOrderPaidCtrl', ['$scope', '$window', '$location', '$compile', '$routeParams', '$timeout', '$http', 'merchan', 'erp', '$sce', function($scope, $window, $location, $compile, $routeParams, $timeout, $http, merchan, erp, $sce) {
    var bs = new Base64();
    var userId = localStorage.getItem('userId') == null ? '' : bs.decode(localStorage.getItem('userId'));
    $scope.appHref = erp.getAppUrl();
    $scope.title = '';
    $scope.pagenum = "1";
    $scope.pagesize = "10";
    $scope.pagenumarr = [10, 20, 30, 50];
    $scope.totalNum = 0;
    $scope.isoverTR = true;
    $scope.proList = [];
    $scope.isAdmin = erp.isAdminLogin();
    $scope.salesManData = [];
    console.log($scope.isAdmin);
    $scope.saleManId = '';

    function getList() {
      $scope.proList = []
      var data = {
        saleManId: $scope.saleManId,
        videoDownloadNum: $scope.title,
        status: '10',
        orderBy: '',
        page: $scope.pagenum,
        pageNum: $scope.pagesize,
      };
      erp.postFun('app/businessVideo/selectVideoPurchaseRecordOfErp', data, con, err);

      function con(n) {
        if (n.data.code == 200) {
          $scope.proList = n.data.list;
          $scope.totalNum = n.data.totalNum;
          pageFun();
        } else {
          layer.msg('查询失败')
        }
      }

      function err(n) {
        layer.msg('查询失败')
      }
    }
    getList();
    /*获取业务员*/
    function getyewuyuan() {
      erp.postFun('app/businessVideo/selectVideoDownloadYeWuYuanList', {}, function(res) {
        $scope.salesManData = res.data.List;
      }, function(err) {

      });
    }
    getyewuyuan();
    $scope.usersearch = function() {
      getList();
    }
    $scope.enterSearch = function(e) {
      $scope.searchFlag = true;
      if (e.keyCode == 13) {
        getList();
      }
    }
    $scope.SearchChange = function(SearchStatus) {
      $scope.saleManId = SearchStatus;
      getList();
    }
    //分页
    function pageFun() {
      $(".pagegroup").jqPaginator({
        totalCounts: $scope.totalNum || 1,
        pageSize: $scope.pagesize * 1,
        visiblePages: 5,
        currentPage: $scope.pagenum * 1,
        activeClass: 'current',
        first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
        prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
        next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
        last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
        page: '<a href="javascript:void(0);">{{page}}<\/a>',
        onPageChange: function(n, type) {
          if (type == 'init') {
            return;
          }
          $scope.pagenum = n;
          getList();
        }
      });
    }
    //
    $scope.detal = function(item) {
      console.log(item)
      var toUrl = window.open();
      toUrl.location.href = $scope.appHref + '/product-detail.html?id=' + item.cjproductId;
    }
    $scope.pagechange = function(pagesize) {
      console.log(pagesize)
      $scope.pagenum = 1;
      getList();
    }
    $scope.pagenumchange = function() {
      var pagenum = Number($scope.pagenum)
      var totalpage = Math.ceil($scope.totalNum / $scope.pagesize);
      if (pagenum > totalpage) {
        layer.msg('错误页码')
        $scope.pagenum = 1;
      } else {
        getList();
      }
    }
    //点击行数加样式
    $scope.TrClick = function(i) {
      $scope.focus = i;
    }
    //
    $scope.videosrc = function(url) {
      return $sce.trustAsResourceUrl('https://' + url);
    }
  }]).directive('repeatFinish', function() {
    return {
      link: function($scope, element, attr) {
        // console.log($scope.$index)
        if ($scope.$last == true) {
          // console.log('ng-repeat执行完毕')
          var script = document.createElement("script");
          script.setAttribute("type", "text/javascript");
          script.setAttribute("src", "erp_otweb/js/video.min.js");
          var heads = document.getElementsByTagName("head");
          if (heads.length)
            heads[0].appendChild(script);
          else
            document.documentElement.appendChild(script);
          angular.element(document).ready(function() {
            // console.log(document.getElementsByClassName("vvv")[0])
            var video = document.getElementsByClassName("vvv"); //source
            var vid = document.getElementsByClassName("zzz"); //video
            for (var i = 0; i < video.length; i++) {
              vid[i].addEventListener('ended', function() {
                var index = this.getElementsByClassName('vvv')[0].getAttribute('data-index');
                var a = this.getElementsByClassName('vvv')[0].getAttribute('data-url');
                var b = vid[index].getElementsByTagName('video')[0].getAttribute('src');
                var c = vid[index].getElementsByTagName('source')[0].getAttribute('src');
                // console.log(b)
                // console.log(c)
                if (b == c) {
                  play(a, index)
                } else {
                  vid[index].getElementsByTagName('video')[0].setAttribute('src', 'https://cc-west-usa.oss-us-west-1.aliyuncs.com/15306336/338209605760.mp4');
                  vid[index].getElementsByTagName('video')[0].load();
                }
              }, true);

              function play(a, index) {
                vid[index].getElementsByTagName('video')[0].setAttribute('src', a);
                vid[index].getElementsByTagName('video')[0].load();
                setTimeout(function() {
                  vid[index].getElementsByTagName('video')[0].play();
                }, 50);
              }
            }
          })
        }
      }
    }
  });
  app.controller('VideoOrderUnPaidCtrl', ['$scope', '$window', '$location', '$compile', '$routeParams', '$timeout', '$http', 'merchan', 'erp', '$sce', function($scope, $window, $location, $compile, $routeParams, $timeout, $http, merchan, erp, $sce) {
    var bs = new Base64();
    var userId = localStorage.getItem('userId') == null ? '' : bs.decode(localStorage.getItem('userId'));
    $scope.appHref = erp.getAppUrl();
    $scope.title = '';
    $scope.pagenum = "1";
    $scope.pagesize = "10";
    $scope.pagenumarr = [10, 20, 30, 50];
    $scope.totalNum = 0;
    $scope.isoverTR = true;
    $scope.proList = []

    function getList() {
      $scope.proList = []
      var data = {
        videoDownloadNum: $scope.title,
        status: '3',
        orderBy: '',
        page: $scope.pagenum,
        pageNum: $scope.pagesize,
      };
      erp.postFun('app/businessVideo/selectVideoPurchaseRecordOfErp', data, con, err);

      function con(n) {
        if (n.data.code == 200) {
          $scope.proList = n.data.list;
          $scope.totalNum = n.data.totalNum;
          pageFun();
        } else {
          layer.msg('查询失败')
        }
      }

      function err(n) {
        layer.msg('查询失败')
      }
    }
    getList();
    $scope.usersearch = function() {
      getList();
    }
    $scope.enterSearch = function(e) {
      $scope.searchFlag = true;
      if (e.keyCode == 13) {
        getList();
      }
    }
    //分页
    function pageFun() {
      $(".pagegroup").jqPaginator({
        totalCounts: $scope.totalNum || 1,
        pageSize: $scope.pagesize * 1,
        visiblePages: 5,
        currentPage: $scope.pagenum * 1,
        activeClass: 'current',
        first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
        prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
        next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
        last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
        page: '<a href="javascript:void(0);">{{page}}<\/a>',
        onPageChange: function(n, type) {
          if (type == 'init') {
            return;
          }
          $scope.pagenum = n;
          getList();
        }
      });
    }
    //
    $scope.detal = function(item) {
      console.log(item)
      var toUrl = window.open();
      toUrl.location.href = erp.getAppUrl() + '/product-detail.html?id=' + item.cjproductId;

    }
    $scope.pagechange = function(pagesize) {
      console.log(pagesize)
      $scope.pagenum = 1;
      getList();
    }
    $scope.pagenumchange = function() {
      var pagenum = Number($scope.pagenum)
      var totalpage = Math.ceil($scope.totalNum / $scope.pagesize);
      if (pagenum > totalpage) {
        layer.msg('错误页码')
        $scope.pagenum = 1;
      } else {
        getList();
      }
    }
    //点击行数加样式
    $scope.TrClick = function(i) {
      $scope.focus = i;
    }
    //
    $scope.videosrc = function(url) {
      return $sce.trustAsResourceUrl('https://' + url);
    }
  }]).directive('repeatFinish', function() {
    return {
      link: function($scope, element, attr) {
        // console.log($scope.$index)
        if ($scope.$last == true) {
          // console.log('ng-repeat执行完毕')
          var script = document.createElement("script");
          script.setAttribute("type", "text/javascript");
          script.setAttribute("src", "erp_otweb/js/video.min.js");
          var heads = document.getElementsByTagName("head");
          if (heads.length)
            heads[0].appendChild(script);
          else
            document.documentElement.appendChild(script);
          angular.element(document).ready(function() {
            // console.log(document.getElementsByClassName("vvv")[0])
            var video = document.getElementsByClassName("vvv"); //source
            var vid = document.getElementsByClassName("zzz"); //video
            for (var i = 0; i < video.length; i++) {
              vid[i].addEventListener('ended', function() {
                var index = this.getElementsByClassName('vvv')[0].getAttribute('data-index');
                var a = this.getElementsByClassName('vvv')[0].getAttribute('data-url');
                var b = vid[index].getElementsByTagName('video')[0].getAttribute('src');
                var c = vid[index].getElementsByTagName('source')[0].getAttribute('src');
                // console.log(b)
                // console.log(c)
                if (b == c) {
                  play(a, index)
                } else {
                  vid[index].getElementsByTagName('video')[0].setAttribute('src', 'https://cc-west-usa.oss-us-west-1.aliyuncs.com/15306336/338209605760.mp4');
                  vid[index].getElementsByTagName('video')[0].load();
                }
              }, true);

              function play(a, index) {
                vid[index].getElementsByTagName('video')[0].setAttribute('src', a);
                vid[index].getElementsByTagName('video')[0].load();
                setTimeout(function() {
                  vid[index].getElementsByTagName('video')[0].play();
                }, 50);
              }
            }
          })
        }
      }
    }
  });
  app.directive('onFinishRenderFilters', ['$timeout', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        if (scope.$last === true) {
          $timeout(function() {
            console.log('ng-repeat完成');
            scope.$emit('ngRepeatFinisheds');
          });
        }
      }
    }
  }]);

  // 视频已完成的控制器
  app.controller('VideoOrderCompletedCtrl', ['$scope', '$window', '$location', '$compile', '$routeParams', '$timeout', '$http', 'merchan', 'erp', '$sce', function($scope, $window, $location, $compile, $routeParams, $timeout, $http, merchan, erp, $sce) {
    var bs = new Base64();
    var userId = localStorage.getItem('userId') == null ? '' : bs.decode(localStorage.getItem('userId'));
    $scope.appHref = erp.getAppUrl();
    $scope.title = '';
    $scope.pagenum = "1";
    $scope.pagesize = "10";
    $scope.pagenumarr = [10, 20, 30, 50];
    $scope.totalNum = 0;
    $scope.isoverTR = true;
    $scope.proList = []

    function getList() {
      $scope.proList = []
      var data = {
        videoDownloadNum: $scope.title,
        status: '7',
        orderBy: '',
        page: $scope.pagenum,
        pageNum: $scope.pagesize,
      };
      erp.postFun('app/businessVideo/selectVideoPurchaseRecordOfErp', data, con, err);

      function con(n) {
        if (n.data.code == 200) {
          $scope.proList = n.data.list;
          $scope.totalNum = n.data.totalNum;
          pageFun();
        } else {
          layer.msg('查询失败')
        }
      }

      function err(n) {
        layer.msg('查询失败')
      }
    }
    $scope.$on('ngRepeatFinisheds', function(ngRepeatFinishedEvent) {
      console.log('加载完成');
      console.log($scope.proList);
      $.each($scope.proList, function(i, v) {
        if (v.videoId) {
          var step = 0;
          var step2 = 0;
          // var url = v.videoId;
          var url = 'c5b3f1f16bce4acc9a873ce414135828';
          var send = 'tool/downLoad/getVideoPlayAuth?videoId=' + url;
          var id = 'J_prismPlayer' + (i + 1);
          //var playAuth = data.data.playAuth;
          erp.getFun(send, function(data) {
            console.log(data);
            var playAuth = data.data.playAuth;
            var player = new Aliplayer({
              id: id,
              width: '240px',
              height: '136px',
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

            }, function(player) {});
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
                erp.getFun(send, function(data) {
                  var newPlayAuth = data.data.playAuth;
                  player.replayByVidAndPlayAuth(vid, newPlayAuth);
                  // player.play();
                });
              } else if (step2 == 2) {
                var videoId = 'c5b3f1f16bce4acc9a873ce414135828'
                var send = 'tool/downLoad/getVideoPlayAuth?videoId=' + videoId;
                erp.getFun(send, function(data) {
                  var newPlayAuth = data.data.playAuth;
                  player.replayByVidAndPlayAuth(videoId, newPlayAuth);
                  step2 = 0;
                });
              }


            }
          }, function() {})
        } else {
          var url = v.watermarkViewUrl;
          var id = 'J_prismPlayer' + (i + 1);
          if (url.indexOf('.') != -1) {
            var step = 0;
            var step2 = 0;
            var player = new Aliplayer({
              id: id,
              width: '240px',
              height: '136px',
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

            }, function(player) {});
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
            erp.getFun(send, function(data) {
              var playAuth = data.data.playAuth;
              var player = new Aliplayer({
                id: id,
                width: '240px',
                height: '136px',
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
              }, function(player) {});
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
                  erp.getFun(send, function(data) {
                    var newPlayAuth = data.data.playAuth;
                    player.replayByVidAndPlayAuth(vid, newPlayAuth);
                    // player.play();
                  });
                } else if (step2 == 2) {
                  var videoId = 'c5b3f1f16bce4acc9a873ce414135828'
                  var send = 'tool/downLoad/getVideoPlayAuth?videoId=' + videoId;
                  erp.getFun(send, function(data) {
                    var newPlayAuth = data.data.playAuth;
                    player.replayByVidAndPlayAuth(videoId, newPlayAuth);
                    step2 = 0;
                  });
                }


              }

            }, function() {})
          }

        }

      });
    });
    getList();
    $scope.usersearch = function() {
      getList();
    }
    $scope.enterSearch = function(e) {
      $scope.searchFlag = true;
      if (e.keyCode == 13) {
        getList();
      }
    }
    //分页
    function pageFun() {
      $(".pagegroup").jqPaginator({
        totalCounts: $scope.totalNum || 1,
        pageSize: $scope.pagesize * 1,
        visiblePages: 5,
        currentPage: $scope.pagenum * 1,
        activeClass: 'current',
        first: '<a class="prev" href="javascript:void(0);">&lt;&lt;<\/a>',
        prev: '<a class="prev" href="javascript:void(0);">&lt;<\/a>',
        next: '<a class="next" href="javascript:void(0);">&gt;<\/a>',
        last: '<a class="next" href="javascript:void(0);">&gt;&gt;<\/a>',
        page: '<a href="javascript:void(0);">{{page}}<\/a>',
        onPageChange: function(n, type) {
          if (type == 'init') {
            return;
          }
          $scope.pagenum = n;
          getList();
        }
      });
    }
    //
    $scope.detal = function(item) {
      console.log(item)
      var toUrl = window.open();
      toUrl.location.href = $scope.appHref + '/product-detail.html?id=' + item.cjproductId;
    }
    $scope.pagechange = function(pagesize) {
      console.log(pagesize)
      $scope.pagenum = 1;
      getList();
    }
    $scope.pagenumchange = function() {
      var pagenum = Number($scope.pagenum)
      var totalpage = Math.ceil($scope.totalNum / $scope.pagesize);
      if (pagenum > totalpage) {
        layer.msg('错误页码')
        $scope.pagenum = 1;
      } else {
        getList();
      }
    }
    //点击行数加样式
    $scope.TrClick = function(i) {
      $scope.focus = i;
    }
    $scope.videosrc = function(url) {
      return $sce.trustAsResourceUrl('https://' + url);
    }


    // 重新上传视频
    $scope.isvideo = false // 是否展示重新上传视频
    $scope.chooseVideoOrder = '' // 选择的视频订单
    $scope.uploadObject = '' // 阿里云上传视频对象


    $scope.handleUpdate = function(item) {
      $scope.isvideo = true
      $scope.chooseVideoOrder = item
    }

    function createUploader() {
      var uploader = new AliyunUpload.Vod({
        //阿里账号ID，必须有值 ，值的来源https://help.aliyun.com/knowledge_detail/37196.html
        userId: "1654317246160868",
        //分片大小默认1M，不能小于100K              
        partSize: 1048576,
        //并行上传分片个数，默认5
        parallel: 5,
        //网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        //网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        onUploadstarted: function(uploadInfo) {
          
          if (!uploadInfo.videoId) {
            // var createUrl = 'https://demo-vod.cn-shanghai.aliyuncs.com/voddemo/CreateUploadVideo?Title=testvod1&FileName=aa.mp4&BusinessType=vodai&TerminalType=pc&DeviceModel=iPhone9,2&UUID=59ECA-4193-4695-94DD-7E1247288&AppVersion=1.0.0&VideoId=5bfcc7864fc14b96972842172207c9e6'
            var createUrl = 'https://tools.cjdropshipping.com/tool/downLoad/token'
            layer.load(2);
            $.get(createUrl, {
              type: 1,
              fileName: uploadInfo.file.name,
              title: '123'
            }, function(data) {
              var uploadAuth = data.result.UploadAuth
              var uploadAddress = data.result.UploadAddress
              var videoId = data.result.VideoId
              $scope.newVideoId = videoId
              layer.closeAll("loading")
              uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
            }, 'json')
          } else {
            // 如果videoId有值，根据videoId刷新上传凭证
            var refreshUrl = "https://tools.cjdropshipping.com/tool/downLoad/token";
            layer.load(2);
            $.get(refreshUrl, {
              type: 2,
              videoId: uploadInfo.videoId
            }, function(data) {
              var uploadAuth = data.result.UploadAuth
              var uploadAddress = data.result.UploadAddress
              var videoId = data.result.VideoId
              $scope.newVideoId = videoId
              uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
              layer.closeAll("loading")
            }, 'json')
          }
          
        },
        // 文件上传成功
        onUploadSucceed: function(uploadInfo) {
          const data = {
            videoId: uploadInfo.videoId,
            oldDspBusinessVideoId: $scope.chooseVideoOrder.videoId,
            dspVideoDownloadId: $scope.chooseVideoOrder.id
          }
          layer.load(2);
          erp.postFun('media/orderMedia/reUploadVideo', JSON.stringify(data), function(data) {
            layer.closeAll("loading");
            if (data.data.code == 200) {
              layer.msg('添加成功');
              if (v.id == $scope.videoId) {
                  getList();
              }
            } else {
              layer.msg('添加失败')
            }
            $scope.isvideo = false
            $scope.uploadObject = ''
          }, function(data) {
            layer.closeAll("loading")
            layer.msg('重新上传视频id失败');
          })
          
        },
        // 文件上传失败
        onUploadFailed: function(uploadInfo, code, message) {
          layer.msg('文件上传失败')
          console.log("onUploadFailed: file:" + uploadInfo.file.name + ",code:" + code + ", message:" + message);
        },
        // 文件上传进度，单位：字节
        onUploadProgress: function(uploadInfo, totalSize, loadedPercent) {
          console.log("onUploadProgress:file:" + uploadInfo.file.name + ", fileSize:" + totalSize + ", percent:" + Math.ceil(loadedPercent * 100) + "%");
        },
        // 上传凭证超时
        onUploadTokenExpired: function(uploadInfo) {
          console.log("onUploadTokenExpired");
          //实现时，根据uploadInfo.videoId调用刷新视频上传凭证接口重新获取UploadAuth
          //https://help.aliyun.com/document_detail/55408.html
          //从点播服务刷新的uploadAuth,设置到SDK里    
          var refreshUrl = "https://tools.cjdropshipping.com/tool/downLoad/token";
          $.get(refreshUrl, {
            type: 2,
            videoId: uploadInfo.videoId
          }, function(data) {
            var uploadAuth = data.result.UploadAuth
            var uploadAddress = data.result.UploadAddress
            var videoId = data.result.VideoId
            $scope.newVideoId = videoId
            uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
          }, 'json')
        },
        //全部文件上传结束
        onUploadEnd: function(uploadInfo) {
          console.log("onUploadEnd: uploaded all the files");
        }
      });
      return uploader
    }

    $scope.handleUpdateVideo = function() {
      let oInput = document.createElement('input')
      oInput.type = 'file'
      var userData = '{"Vod":{}}'
      oInput.accept =
        'video/mp4,video/avi,video/wmv,video/mpg,video/mov,video/flv'
      oInput.onchange = ev => {
        let uploader = createUploader();
        console.log(uploader);
        uploader.addFile(ev.target.files[0], null, null, null, userData)
        $scope.uploadObject = uploader;
      }
      oInput.click()
      oInput.remove()
    }


    $scope.uplodvideo2 = function() {
      if (!$scope.uploadObject) {
        layer.msg('请选择上传文件');
        return
      }
      $scope.uploadObject.startUpload();
    }


    // 重新上传图片

    $scope.imgData =[]

    $scope.onUploadImg = () => {
      if($scope.imgData.length>=8){
        layer.msg('最多选择8张图片');
        return
      }
      document.getElementById('uploadImg').click()
    }

    // 点击重新上传图片
    $scope.handleUploadImg = item => {
      $scope.isUploadImg = true;
      $scope.chooseImgItem = item
      getImgData()
    }

    // 获取图片
    function getImgData() {
      const parmas = {
        ids: $scope.chooseImgItem.videoDemandId
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

    $scope.upLoadImgChange = file => {
      erp.ossUploadFile(file, res => {
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
      if ($scope.imgData.length === 0){
        layer.msg('请上传图片')
        return
      }
      const parmas = {
        id: $scope.chooseImgItem.id,
        images: $scope.imgData,
      }
      layer.load(2);
      erp.postFun('media/orderMedia/reUploadPhoto', parmas, ({ data }) => {
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


  }]).directive('repeatFinish', function() {
    return {
      link: function($scope, element, attr) {
        // console.log($scope.$index)
        if ($scope.$last == true) {
          // console.log('ng-repeat执行完毕')
          var script = document.createElement("script");
          script.setAttribute("type", "text/javascript");
          script.setAttribute("src", "erp_otweb/js/video.min.js");
          var heads = document.getElementsByTagName("head");
          if (heads.length)
            heads[0].appendChild(script);
          else
            document.documentElement.appendChild(script);
          angular.element(document).ready(function() {
            // console.log(document.getElementsByClassName("vvv")[0])
            var video = document.getElementsByClassName("vvv"); //source
            var vid = document.getElementsByClassName("zzz"); //video
            for (var i = 0; i < video.length; i++) {
              vid[i].addEventListener('ended', function() {
                var index = this.getElementsByClassName('vvv')[0].getAttribute('data-index');
                var a = this.getElementsByClassName('vvv')[0].getAttribute('data-url');
                var b = vid[index].getElementsByTagName('video')[0].getAttribute('src');
                var c = vid[index].getElementsByTagName('source')[0].getAttribute('src');
                // console.log(b)
                // console.log(c)
                if (b == c) {
                  play(a, index)
                } else {
                  vid[index].getElementsByTagName('video')[0].setAttribute('src', 'https://cc-west-usa.oss-us-west-1.aliyuncs.com/15306336/338209605760.mp4');
                  vid[index].getElementsByTagName('video')[0].load();
                }
              }, true);

              function play(a, index) {
                vid[index].getElementsByTagName('video')[0].setAttribute('src', a);
                vid[index].getElementsByTagName('video')[0].load();
                setTimeout(function() {
                  vid[index].getElementsByTagName('video')[0].play();
                }, 50);
              }
            }
          })
        }
      }
    }
  });
})(angular);