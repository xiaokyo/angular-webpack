(function() {
  var app = angular.module("merchandise");
  var getEmployeeUrl = "app/employee/getempbyname";

  // getSalemanList
  function getEmployeeList(erp, job, scb) {
    erp.postFun(
      getEmployeeUrl,
      {
        data: JSON.stringify({
          name: "",
          job: job
        })
      },
      function(data) {
        // console.log(JSON.parse(data.data.result).list);
        scb(JSON.parse(data.data.result).list);
      }
    );
  }

  app.controller("merchandiseDetailCtrl", [
    "$scope",
    "$window",
    "$location",
    "$compile",
    "$routeParams",
    "$timeout",
    "$http",
    "erp",
    "merchan",
    "$sce",
    function(
      $scope,
      $window,
      $location,
      $compile,
      $routeParams,
      $timeout,
      $http,
      erp,
      merchan,
      $sce
    ) {
      // console.log($routeParams.id, $routeParams.flag);
      var bs = new Base64();
      var userId =
        localStorage.getItem("erpuserId") == null
          ? ""
          : bs.decode(localStorage.getItem("erpuserId"));
      var token = "";
      var userName =
        localStorage.getItem("erpname") == null
          ? ""
          : bs.decode(localStorage.getItem("erpname"));
      var token =
        localStorage.getItem("erptoken") == null
          ? ""
          : bs.decode(localStorage.getItem("erptoken"));
      var operate = "UPDATE";

      var userInfo = erp.getUserInfo();
      $scope.isCN = localStorage.getItem("lang") === "cn";

      $scope.setOneFlg = true; // 单个设置图片/重量/邮寄重量

      $scope.getData = false;
      $scope.isHasThirdBtn = false;

      $scope.isDetail = $location.$$search.isDetail; // 是否为详情界面

      /**----- */
      //变体排序
      var mx = 0,
        my = 0; //鼠标x、y轴坐标（相对于left，top）
      var isDragingPro = false;
      var moveLine;
      //鼠标按下
      $(".merch-varible-box").on("mousedown", ".li-check", function(e) {
        e.preventDefault();
        e = e || window.event;
        mx = e.pageX; //点击时鼠标X坐标
        my = e.pageY; //点击时鼠标Y坐标
        isDragingPro = true; //标记对话框可拖动
        moveLine = $(this)
          .parent()
          .parent();
        // console.log('down')
      });
      //鼠标移动
      var moveX, moveY;
      var changeFlag;
      $(document).mousemove(function(e) {
        var e = e || window.event;
        var x = e.pageX; //移动时鼠标X坐标
        var y = e.pageY; //移动时鼠标Y坐标
        if (isDragingPro) {
          //判断对话框能否拖动
          //console.log(x+','+y);
          moveX = x - mx; //移动后对话框新的left值
          moveY = y - my; //移动后对话框新的top值
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
      $(".merch-varible-box").on("mouseup", ".li-check", function() {
        isDragingPro = false;
        moveLine = null;
        changeFlag = null;
      });
      $scope.reason = null;

      var productInfo;

      $scope.productId = $routeParams.id;
      $scope.saleStatus = "";
      $scope.merchanFlag = $routeParams.flag;
      $scope.productType = $routeParams.type; //0：；1:服务商品；2:；3：个性包装
      if ($scope.productType == "1") {
        // 1--服务商品
        $scope.authorityPart = true;
        $("#authority-type").prop("checked", false);
        $("#authority-type").prop("disabled", true);
        $("#authority-type2").prop("checked", true);
      }
      $scope.isAdminLogin = erp.isAdminLogin();
      $scope.merchanStatus = $routeParams.status;
      // 商品状态  0审核中 1上架 2用户下架 3审核失败，4平台下架，5待上架
      $scope._status = [
        "审核中",
        "上架",
        "用户下架",
        "审核失败",
        "平台下架",
        "待上架",
        "待提交"
      ];
      // {
      //   0 审核中 1上架 2用户下架 3审核失败，4平台下架，5待上架，6待提交
      // }
      // 标记当前controller状态
      $scope.editMerchFlag = true;
      layer.load(2);
      /**
       * ================
       * == 详情数据请求 ==
       * ================
       */
      function initLoad(params) {
        erp.postFun(
          "supplier/product/getProdcutInfo",
          JSON.stringify({
            id: $scope.productId
          }),
          function(data) {
            layer.closeAll("loading");
            var data = data.data;
            if (data.code != 200) {
              layer.msg(data.error);
              return false;
            }
            productInfo = data.data;
            // 初始化详情数据
            $scope.productInfo = data.data; // 商品详情
            $scope.accountInfo = $scope.productInfo.accountInfo; // 账户详情
            $scope.getData = true;
            // 默认 到货周期
            $scope.productInfo.arrivalDay = data.data.arrivalDay || 7;
            // 默认销售类型
            // $scope.productInfo.salesType = $scope.productInfo.salesType || 0;
            $scope.merchanStatus = $scope.productInfo.status; // 商品状态
            // 文本赋值到富文本编辑器
            $scope.editor.txt.html($scope.productInfo.bodyHtml);
            // 商品图片展示处理
            $scope.getMerchanImgs();

            // 详情界面disable 所有交互元素
            if ($scope.isDetail == 1) {
              setTimeout(() =>
                $("input,select,textarea").attr("disabled", true)
              );
            }
          },
          function() {
            layer.closeAll("loading");
            layer.msg("网络错误");
          }
        );
      }
      initLoad();
      // 变量sku fommat
      function concatSku(i) {
        return [$scope.productInfo.sku, i.option1, i.option2, i.option3]
          .filter(v => v)
          .join("-");
      }
      $scope.optionChange = function(value, key, obj, e) {
        if (value) {
          const success = /^[a-zA-Z0-9.]*((?<=[a-zA-Z0-9.])\s[a-zA-Z0-9.]*)*[a-zA-Z0-9.]$/g.test(
            value.trim()
          );
          if (!success) {
            e.target.focus();

            return layer.msg(
              "变量允许输入数字空格英文字母，并且不能以空格开头或结尾.请重新输入!"
            );
          }
        }
      };
      // 英文描述富文本
      $scope.editor = new window.wangEditor("#wang-editor");
      $scope.editor.customConfig.uploadImgServer =
        "https://erp.cjdropshipping.com/app/ajax/upload";
      $scope.editor.customConfig.uploadFileName = "file";
      // 失去焦点将修改的内容修改到商品信息中
      $scope.editor.customConfig.onblur = function(html) {
        $scope.productInfo.bodyHtml = html;
      };
      $scope.editor.customConfig.uploadImgHooks = {
        customInsert: function(insertImg, result, editor) {
          console.log(result);
          // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

          // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
          var imgList = JSON.parse(result.result);
          for (var i = 0; i < imgList.length; i++) {
            imgList[i] = "https://" + imgList[i];
          }
          if (imgList.length > 0) {
            insertImg(imgList);
          }

          // result 必须是一个 JSON 格式字符串！！！否则报错
        }
      };
      $scope.editor.create();

      /**
       * ============================
       * ====== 图片相关 =============
       * ============================
       */
      $scope.picContainer = [];
      var picIdIndex = 0;
      $scope.getMerchanImgs = function() {
        var imgs = productInfo.imageUrls;
        var variantImgs = [];

        var stanProducts = productInfo.variantList;
        for (var i = 0; i < stanProducts.length; i++) {
          if ($.inArray(stanProducts[i].imageUrl, variantImgs) == -1) {
            variantImgs.push(stanProducts[i].imageUrl);
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
      };
      /** 拖拽成功触发方法
       *   index 拖拽后落下时的元素的序号（下标）
       *   obj 被拖动数据对象
       */
      $scope.dropComplete = function(index, obj) {
        var idx = $scope.picContainer.indexOf(obj);
        $scope.picContainer[idx] = $scope.picContainer[index];
        $scope.picContainer[index] = obj;
      };

      $scope.upLoadImg = function() {
        erp.ossUploadFile($("#upload-img")[0].files, function(data) {
          $("#upload-img").val("");
          console.log(data);
          if (data.code == 0) {
            layer.msg("上传失败");
            return;
          }
          if (data.code == 2) {
            layer.msg("部分图片上传失败，请等待图片加载。");
          }
          if (data.code == 1) {
            layer.msg("上传成功，请等待图片加载。");
          }
          var result = data.succssLinks;
          for (var i = 0; i < result.length; i++) {
            picIdIndex++;
            $scope.picContainer.push({
              pid: "pic" + picIdIndex,
              // src: result[i]
              src: result[i]
            });
          }
          console.log($scope.picContainer);
          $scope.$apply();
        });
      };
      $scope.deletePic = function(pid) {
        var deleteIndex = erp.findIndexByKey($scope.picContainer, "pid", pid);
        $(".merch-varible-tbody .merch-variable-pic").each(function() {
          if ($(this).attr("src") == $scope.picContainer[deleteIndex].src) {
            $(this).attr("src", "#");
          }
        });
        $scope.picContainer.splice(deleteIndex, 1);
      };
      $scope.previewPic = function($event) {
        var picSrc = $($event.target)
          .parent()
          .parent()
          .parent()
          .find("img")
          .attr("src");
        merchan.previewPic(picSrc);
      };
      $scope.mannualRefresh = function(newpic) {
        // picIdIndex++;
        $scope.picContainer.push(newpic);
      };
      $scope.addPic = function() {
        merchan.addUrlPic(function(data) {
          picIdIndex++;
          $scope.mannualRefresh({
            pid: "pic" + picIdIndex,
            // src: data
            src: "https://" + data
          });
        });
      };
      /**
       * >>>>>>>>>  图片结束 <<<<<<<<
       */

      $scope.$watch("getData", function(now, old) {
        if (now === old) {
          return;
        }

        // $scope.accountInfo = productInfo.accountInfo;
        // $scope.merchanName = productInfo.title;
        // $scope.addGoodsAutoSKU = productInfo.sku;
        // $scope.forbiddenChineseInp = function (merchanName) {
        //     $scope.merchanName = merchanName.replace(chineseReqG, '');
        // }

        //   $scope.editorContent = productInfo.bodyHtml;
        //   $scope.editor.txt.html(productInfo.bodyHtml);

        // 商品图片
        // $scope.picContainer = [];
        // var picIdIndex = 0;
        // $scope.getMerchanImgs = function () {
        //   var imgs = productInfo.imageUrls;
        //   var variantImgs = [];
        //   var stanProducts = productInfo.variantList;
        //     for (var i = 0; i < stanProducts.length; i++) {
        //         if ($.inArray(stanProducts[i].imageUrl, variantImgs) == -1) {
        //             variantImgs.push(stanProducts[i].imageUrl);
        //         }
        //     }
        //     var imgSum = imgs.concat(variantImgs);
        //     imgSum = erp.uniqueArray(imgSum);
        //     for (var i = 0; i < imgSum.length; i++) {
        //         picIdIndex++;
        //         $scope.picContainer.push({
        //             pid: picIdIndex,
        //             src: imgSum[i]
        //         });
        //     }
        //     console.log($scope.picContainer)
        // }
        // $scope.getMerchanImgs();

        // $scope.verifyMerchPic = false;

        /** 拖拽成功触发方法
         *   index 拖拽后落下时的元素的序号（下标）
         *   obj 被拖动数据对象
         */
        // $scope.dropComplete = function (index, obj) {
        //     var idx = $scope.picContainer.indexOf(obj);
        //     $scope.picContainer[idx] = $scope.picContainer[index];
        //     $scope.picContainer[index] = obj;
        // };

        // $scope.upLoadImg = function () {
        //     erp.ossUploadFile($('#upload-img')[0].files, function (data) {
        //         $('#upload-img').val('');
        //         console.log(data);
        //         if (data.code == 0) {
        //             layer.msg('上传失败');
        //             return;
        //         }
        //         if (data.code == 2) {
        //             layer.msg('部分图片上传失败，请等待图片加载。');
        //         }
        //         if (data.code == 1) {
        //             layer.msg('上传成功，请等待图片加载。');
        //         }
        //         var result = data.succssLinks;
        //         for (var i = 0; i < result.length; i++) {
        //             picIdIndex++;
        //             $scope.picContainer.push({
        //                 pid: 'pic' + picIdIndex,
        //                 // src: result[i]
        //                 src: result[i]
        //             });
        //         }
        //         console.log($scope.picContainer);
        //         $scope.$apply();
        //     });
        // }
        // $scope.deletePic = function (pid) {
        //     var deleteIndex = erp.findIndexByKey($scope.picContainer, 'pid', pid);
        //     $('.merch-varible-tbody .merch-variable-pic').each(function () {
        //         if ($(this).attr('src') == $scope.picContainer[deleteIndex].src) {
        //             $(this).attr('src', '#');
        //         }
        //     });
        //     $scope.picContainer.splice(deleteIndex, 1);
        // }
        // $scope.previewPic = function ($event) {
        //     var picSrc = $($event.target).parent().parent().parent().find('img').attr('src');
        //     merchan.previewPic(picSrc);
        // }
        // $scope.mannualRefresh = function (newpic) {
        //     // picIdIndex++;
        //     $scope.picContainer.push(newpic);
        // }
        // $scope.addPic = function () {
        //     merchan.addUrlPic(function (data) {
        //         picIdIndex++;
        //         $scope.mannualRefresh({
        //             pid: 'pic' + picIdIndex,
        //             // src: data
        //             src: 'https://' + data
        //         });
        //     });
        // }

        // 变量部分
        // $scope.merchanUnit = 'unit(s)';
        $scope.varibles = [];
        $scope.verifyVeribleRes = false;
        $scope.varibleAtrrs = [];
        if (productInfo.variantKey) {
          var temArr = productInfo.variantKey.split("-");
          var temArrEn =
            productInfo.variantKeyEn == undefined
              ? []
              : productInfo.variantKeyEn.split("-");
          for (var i = 0; i < temArr.length; i++) {
            if (temArrEn[i]) {
              $scope.varibleAtrrs.push({
                name: temArr[i],
                nameEn: temArrEn[i]
              });
            }
          }
        }
        
            // 可见用户
            $scope.authority = {};
            $scope.authority.satus = productInfo.visibilityType;
            $scope.authorityPart = false;
            if($scope.authority.satus === null) {
              $scope.authority.satus = 1
            }
            if ($scope.authority.satus == 2 || $scope.authority.satus == 0) {

                $('#authority-type2').prop('checked', 'checked');
                $scope.authorityPart = true;
            } else {
                $('#authority-type').prop('checked', 'checked');
                $scope.authorityPart = false;
            }
            $scope.verifyAuthUser = false;

            $scope.authorityUsers = [];
            if(productInfo.supplierProductVisibleUserList && productInfo.supplierProductVisibleUserList.length !== 0) {
              $scope.authorityUsers = productInfo.supplierProductVisibleUserList.map(item => {
                return {
                  id: item.dspAccountId,
                  name: item.name,
                  num: item.num
                }
              });
            }
            
            $scope.searchUserName = '';
            $scope.searchUserRes = [];
            $scope.hasSearchUserRes = false;
            $scope.noSearchUserRes = false;
            $scope.choseAuthorityType = function () {
                var authVal = $('#authority-type').prop('checked');
                console.log(authVal)
                $scope.authority.satus = authVal ? 1 : 2;
                if ($scope.authority.satus == 2) {
                    $scope.authorityPart = true;
                } else {
                    $scope.authorityPart = false;
                }
            }
            var debounceGetList = erp.deBounce(merchan.searchByUserName,1000)
            $scope.searchByUserName = function (username) {
              
                debounceGetList(username, $scope, userId, token);
            }
            $scope.selectSearchUser = function (uid) {
                merchan.selectSearchUser(uid, $scope);
                console.log($scope.authorityUsers)
            }
            $scope.removeAuthUser = function (uid) {
                merchan.removeAuthUser(uid, $scope);
            }

        // 如果有邮寄重量就不变，如果没有，将商品重量赋值给邮寄重量
        let NewvariantList = productInfo.variantList.map( (item) => {
          if(!item.weight){
            item.weight = item.grams
          }
          return item
        })
        
        $scope.variantList = NewvariantList;
        // 变体的sku显示
        $scope.concatSku = concatSku;
        console.log($scope.variantList,'11111111');
        

        // $scope.merchanUnit = productInfo.unit;

        // 实时显示每个变量对应的sku
        // $('.merch-varible-box').on('input', '.edit-new', function () {
        //     if ($(this).val()) {
        //         $(this).val($(this).val().replace(/\s{2,}/g, ' ').replace(' ~ ', '~').replace(' ~', '~').replace('~ ', '~'));
        //     }
        //     if (specialChacReqG.test($(this).val())) {
        //         layer.msg('特殊字符只能输入英文状态下的"～"');
        //         $(this).val($(this).val().replace(specialChacReqG, ''));
        //     }
        //     if (chineseReqG.test($(this).val())) {
        //         layer.msg('变量值不能输入中文字符');
        //         $(this).val($(this).val().replace(chineseReqG, ''));
        //     }
        //     var currentVaribleId = $(this).parent().parent().parent().attr('id');
        //     var varibleNewArr = [];
        //     $('#' + currentVaribleId).find('.varible-new input').each(function () {
        //         if ($(this).val().trim()) {
        //             varibleNewArr.push($(this).val());
        //         }
        //     });
        //     merchan.showChildSKU(currentVaribleId, $scope);
        // });
        // 渲染变量值到页面上
        // merchan.renderVarible($('#varible-new'), $('.merch-varible-tbody'), $scope);
        // merchan.renderVarible($('#varible-new'), $('.varible-new'), $scope);

        // 批量设置变量
        $scope.banchSetAttr = function(key, value) {
          if (checkNum == 0) {
            layer.msg("请先勾选需要批量设置的变体");
            return;
          }
          $scope.variantList.forEach(e => (e[key] = value));
        };
        // 增加一行
        var varibleLineIndex = 0;
        // 给变量行加鼠标进入事件
        $scope.showCanEditTd = function($event) {
          $($event.currentTarget)
            .find(".can-edit")
            .addClass("editing");
        };
        // 给变量行加鼠标离开事件
        $scope.hideCanEditTd = function($event) {
          $($event.currentTarget)
            .find(".can-edit")
            .removeClass("editing");
        };
        // 全选
        var checkNum = 0;
        $scope.checkOneLine = function() {
          checkNum = 0;
          $(".merch-varible-tbody").each(function() {
            if (
              $(this)
                .find(".check-inp")
                .prop("checked")
            ) {
              checkNum++;
            }
          });
          if (
            $(".merch-varible-tbody").length -
              $(".merch-varible-tbody.xiajia").length ==
            checkNum
          ) {
            $scope.checkAllMark = true;
          } else {
            $scope.checkAllMark = false;
          }
          console.log(checkNum);
        };
        $scope.checkAllMerch = function(flag) {
          $(".merch-varible-tbody").each(function() {
            if (!$(this).hasClass("xiajia")) {
              $(this)
                .find(".check-inp")
                .prop("checked", flag);
            }
          });
          flag
            ? (checkNum = $(".merch-varible-tbody .check-inp:checked").length)
            : (checkNum = 0);
        };
        // 选择变量对应图片
        $scope.choseVariblePic = function($event, item) {
          var targetElement = $event.currentTarget;
          var parent = $(targetElement)
            .parent()
            .parent();
          if (parent.hasClass("xiajia")) {
            layer.msg("不能对已下架的变体进行编辑");
          } else if ($scope.yishangjiaFeiAdmin && parent.attr("name")) {
            // 已上架商品变体图片不可修改
            layer.msg("已上架商品变体图片不可修改");
          } else {
            var $currentImg = $(targetElement).find(".merch-variable-pic");
            merchan.choseVariblePic(targetElement, $scope, function(src) {
              item.imageUrl = src;
            });
            // merchan.choseVariblePic($currentImg, $scope);
          }
        };
        // 变量行内输入框获取焦点事件
        $scope.addGrayBg = function($event) {
          var targetElement = $event.target;
          $(targetElement).css("background", "#eee");
        };
        // 变量行内输入框失去焦点事件
        $scope.removeGrayBg = function($event) {
          var targetElement = $event.target;
          $(targetElement).css("background", "#fff");
          if ($(targetElement).hasClass("edit-new")) {
            var str = $(targetElement)
              .val()
              .replace(/(^\s*)|(\s*$)/g, "");
            str = str.substring(0, 1).toUpperCase() + str.substring(1);
            $(targetElement).val(str);
            var currentVaribleId = $(targetElement)
              .parent()
              .parent()
              .parent()
              .attr("id");
            merchan.showChildSKU(currentVaribleId, $scope);
          }
        };
        $scope.checkIsNum = function($event, flag) {
          var targetElement = $event.target;
          $(targetElement).css("background", "#fff");
          $(targetElement).val(
            $(targetElement)
              .val()
              .replace(/\s+/g, "")
          );
          var val = $(targetElement).val() * 1;
          if (isNaN(val)) {
            layer.msg("请输入数字");
            $(targetElement).val("");
            return;
          }
          if (flag == "weight") {
            var thisLine = $(targetElement)
              .parent()
              .parent()
              .parent();
            var weight = thisLine.find(".edit-pweight").val();
            var postweight = thisLine.find(".edit-postweight").val();
            if (weight && postweight && postweight * 1 <= weight * 1) {
              layer.msg("请保证商品邮寄重量大于商品重量");
              $(targetElement).val("");
              thisLine.find(".weight-tip").css("visibility", "visible");
            } else {
              thisLine.find(".weight-tip").css("visibility", "hidden");
            }
          }
        };
        // 变量行内输入框美元符号处理
        $scope.addDollarIcon = function($event) {
          merchan.addSpecialIcon($event, "$");
        };
        $scope.removeDollarIcon = function($event) {
          merchan.removeSpecialIcon($event, "$");
        };
        // 变量行内人民币符号处理
        $scope.addRMBIcon = function($event) {
          merchan.addSpecialIcon($event, "¥");
        };
        $scope.removeRMBIcon = function($event) {
          merchan.removeSpecialIcon($event, "¥");
        };
        // 变量行内重量处理
        $scope.addGUnit = function($event) {
          merchan.addSpecialIcon($event, 'g');
        };
        $scope.removeGUnit = function($event) {
          merchan.removeSpecialIcon($event, 'g');
        };
        // sku别名弹框
        $scope.alertEditSkuAname = function($event, item) {
          var targetElement = $event.target;
          $(targetElement).css("background", "#eee");
          const currentSKUAname = item.skuAlisa;
          var tempVaribleAtrrs =
            currentSKUAname == "" ? [] : currentSKUAname.split(",");
          merchan.editSKUAname(tempVaribleAtrrs, function(skuArr) {
            item.skuAlisa = skuArr.join(",");
          });
        };

        // 获取变量提交信息$scope.varibles
        $scope.varibleImgs = [];
        $scope.getVaribleInfo = function() {
          merchan.getVaribleInfo($(".merch-varible-tbody"), $scope);
        };

        var variblesInfo = productInfo.stanProducts;

        var sockArr = variblesInfo;
        var arr1 = [];
        $.each(sockArr, function(i, v) {
          if (!v.isSoldOut || v.isSoldOut == 0) {
            arr1.push(v);
          }
        });
        $.each(sockArr, function(i, v) {
          if (v.isSoldOut == 1) {
            arr1.push(v);
          }
        });
        console.log(arr1);
        variblesInfo = arr1;
        for (var i = 0; i < variblesInfo.length - 1; i++) {
          varibleLineIndex++;
          merchan.addVaribleLine(
            varibleLineIndex,
            $(".merch-varible-box"),
            $scope
          );
        }
        // 获取仓库信息并渲染变体信息
        // $scope.hasGotStorage = false;
        // $scope.inventory = {};
        // $scope.storages = [];
        // merchan.getStorage(function (data) {
        //     // console.log(data);
        //     // 美国东和美国西仓库不可编辑
        //     var temArr = [];
        //     for (var i = 0; i < data.length; i++) {
        //         if (data[i].storage != '美国东' && data[i].storage != '美国西') {
        //             temArr.push(data[i]);
        //         }
        //     }
        //     console.log(temArr)
        //     $scope.storages = temArr;
        //     temArr = null;
        //     merchan.renderVarible($('#varible-new'), $('.merch-varible-tbody'), $scope);
        //     merchan.renderStorage($scope.storages, $('#batch-select'), $('#storage-name'), $('.storage-con'), $scope);
        //     for (var i = 0; i < data.length; i++) {
        //         // 服务商品美国东不编辑
        //         if ($scope.productType == '1' && data[i].storage == '美国东') continue;
        //         $scope.inventory[data[i].id] = 0;
        //     }
        //     // 获取到仓库信息后渲染变体信息
        //     console.log($scope.fobidEditPrice)
        //     merchan.renderVariantToPage($scope, variblesInfo);
        //     $scope.hasGotStorage = true;
        // });

        // 中文名称
        $scope.chineseName = productInfo.name && productInfo.name.split(",");
        $scope.chineseNameDom = $(".chinese-name-inp");
        // 显示
        $scope.chineseName.forEach((v, i) => {
          $scope.chineseNameDom[i].value = v;
        });
        // 修改
        $scope.chineseNameChange = function(v, i) {
          $scope.chineseName[i] = v;
        };
        // $('#chinese-name').find('.chinese-name-inp').each(function () {
        //     $(this).val($scope.chineseName[$(this).index()]);
        // });
        $scope.verifyChineseNameRes = false;

        $scope.getChineseName = function() {
          $scope.chineseName = [];
          $("#chinese-name")
            .find(".chinese-name-inp")
            .each(function() {
              if ($(this).val()) {
                $scope.chineseName.push($(this).val());
              }
            });
          return $scope.chineseName;
        };

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
        $scope.packing =
          productInfo.packing == "" ? [] : productInfo.packing.split(",");
        $scope.verifyPacking = false;
        $("#merchan-packing")
          .find("input[type=checkbox]")
          .each(function() {
            if ($.inArray($(this).attr("name"), $scope.packing) != -1) {
              $(this).prop("checked", "checked");
            }
          });

        $scope.getPackingInfo = function($event) {
          merchan.getCheckBoxInfo($event, $scope.packing);
        };

        // 属性
        $scope.property =
          productInfo.attribute == "" ? [] : productInfo.attribute.split(",");
        $scope.verifyProperty = false;
        $("#merchan-property")
          .find("input[type=checkbox]")
          .each(function() {
            if ($.inArray($(this).attr("name"), $scope.property) != -1) {
              $(this).prop("checked", "checked");
            }
          });

        $scope.getPropertyInfo = function($event) {
          merchan.getCheckBoxInfo($event, $scope.property);
        };

        // 材质
        $scope.material =
          productInfo.material == "" ? [] : productInfo.material.split(",");
        $scope.verifyMaterial = false;
        $("#merchan-material")
          .find("input[type=checkbox]")
          .each(function() {
            if ($.inArray($(this).attr("name"), $scope.material) != -1) {
              $(this).prop("checked", "checked");
            }
          });

        $scope.getMaterialInfo = function($event) {
          merchan.getCheckBoxInfo($event, $scope.material);
        };

        // 到货日期
        $scope.ArrivalCycle = productInfo.buyTime || "";
        $scope.verifyArrivalCycle = false;

        // 消费人群
        $scope.consumerListOne = [];
        $scope.consumerListTwo = [];
        $scope.consumerListThree = [];
        $scope.consOneVal = "";
        $scope.consTwoVal = "";
        $scope.consThreeVal = "";
        $scope.hasSecondCon = false;
        $scope.hasThirdCon = false;
        try {
          // 当前选择的消费人群
          $scope.selectConsumer =
            typeof $scope.productInfo.consumerGroups === "string"
              ? Object.values(
                  JSON.parse($scope.productInfo.consumerGroups) || {}
                )
              : [];
        } catch (error) {
          $scope.selectConsumer = [];
          console.error(error);
        }

        merchan.getCustomerListOne(function(data) {
          $scope.consumerListOne = data;
          // $scope.consOneVal = $scope.consumerListOne[0].id;
        });
        $scope.getSeconeConList = function(id) {
          merchan.getCustomerListTwo(id, function(data) {
            if (data[0] != null) {
              $scope.hasSecondCon = true;
              $scope.consumerListTwo = data;
              // $scope.consTwoVal = $scope.consumerListTwo[0].id;
            } else {
              $scope.hasSecondCon = false;
            }
          });
        };
        $scope.getThirdConList = function(id) {
          merchan.getCustomerListThree(id, function(data) {
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
                    name: $scope.consumerListTwo[i].name,
                    nameEn: $scope.consumerListTwo[i].nameEn
                  });
                  break;
                }
              }
            }
          });
        };
        $scope.setConsItem = function(id) {
          var removeIndex = erp.findIndexByKey(
            $scope.consumerListThree,
            "id",
            id
          );
          $scope.selectConsumer.push({
            id: id,
            name: $scope.consumerListThree[removeIndex].name,
            nameEn: $scope.consumerListThree[removeIndex].nameEn
          });
        };
        $scope.removeOneConsumer = function(id) {
          var removeIndex = erp.findIndexByKey($scope.selectConsumer, "id", id);
          $scope.selectConsumer.splice(removeIndex, 1);
        };

        // 点击页面隐藏搜索
        $scope.hideSearchRes = function() {
          // 搜索供应商
          $scope.searchSupplierName = "";
          $scope.hasSearchSupplierRes = false;
          $scope.noSearchSupplierRes = false;
          // 搜索用户
          $scope.searchUserName = "";
          $scope.hasSearchUserRes = false;
          $scope.noSearchUserRes = false;
        };
        $scope.stopPropagation = function(e) {
          e.stopPropagation();
        };

        // 首选业务员
        getEmployeeList(erp, "销售", function(data) {
          $scope.salemanList = data;
        });
        // if (productInfo.salesmanId && productInfo.shelve) {
        //   $scope.salesmanId = productInfo.salesmanId + '_' + productInfo.shelve;
        // } else {
        //   $scope.salesmanId = '';
        // }
        // 记录初始值
        // $scope.$watch('hasGotStorage', function (now, old) {
        //     if (now == old) return;
        //     if (now == true) {
        //         $scope.editorContent = $scope.editor.txt.html();
        //         $scope.originalData = merchan.settleSendData($scope, userId, token, userName, operate);
        //         // console.log($scope.originalData);
        //     }
        // });

        $scope.numberInput = function(type) {
          if ((type = "setNum")) {
            $scope.setNum = $scope.setNum.replace(/[^\d]/g, "");
          }
        };

        // 备注信息
        $scope.remarkInfo = productInfo.remark || "";
        $scope.verifyRemarkInfo = false;
      });
      // 审核前验证信息
      let updateDataForAudit;
      $scope.saveInfo = function() {
        let action; // 通过或拒绝
        $("input[name=audit]").each((i, e) => {
          if (e.checked) {
            action = e.id;
          }
        });
        if (!action) {
          return layer.msg("请选择审核通过或失败");
        }
        $scope.action = action; // 保存用于文字显示
        updateDataForAudit = getUploadData();
        if (action == "reject") {
          if (!$scope.reason) return layer.msg("拒绝请填写备注");
          updateDataForAudit.status = 3;
          updateDataForAudit.reason = $scope.reason;
          // 打开确认弹框
          $scope.shenheConfirm = 1;
          return;
        }
        if (checkUpdateData(updateDataForAudit)) {
          updateDataForAudit.status = 1;
          updateDataForAudit.reason = $scope.reason;
          // 打开确认弹框
          $scope.shenheConfirm = 1;
        }
      };

      // 编辑保存功能
      $scope.onUpdateData = function() {
        const uploadData = getUploadData();
        // 对提交数据进行验证
        if (checkUpdateData(uploadData)) {
          // 重新上架功能
          if (
            $scope.productInfo.status == "2" ||
            $scope.productInfo.status == "4"
          ) {
            return layer.confirm(
              '<p style="font-weight: 900;">是否确认重新上架该商品？</p><p style="color:#999;">通过后则商户商品将在其商店正常展示，请谨慎操作。</p>',
              {
                icon: 3,
                title: "提示"
              },
              function(index) {
                uploadData.status = 1;
                const params = {
                  count: 1,
                  supplierId: $scope.productInfo.supplierId
                }
                erp.postFun("erpSupplierPlan/checkSupplierPlan", params, function(res) {
                console.log(res);
                if (res.data.code === 200) {
                  uploadDataFn(uploadData, function() {
                  layer.close(index);
                  setTimeout(() => window.close(), 500);
                });
                } else {
                    layer.confirm(
                    '<p style="font-weight: 900;">警告！</p><p style="color:#999;">如果同意上架该产品，则会超出该供应商能上传商品最大数，是否确定上架该商品。</p>',
                    {
                      icon: 2,
                      title: '提示'
                    },function(index2) {
                        uploadDataFn(uploadData, function() {
                        layer.close(index2);
                        // setTimeout(() => window.close(), 500);
                      });
                    }
                  )
                }})
                
              }
            );
          }
          // 编辑提交数据
          uploadDataFn(uploadData, () => setTimeout(() => window.close(), 500));
        }
      };
      // 审核商品
      $scope.goActPass = function() {
        const params = {
          supplierId: $scope.productInfo.supplierId,
          count: 1
        };
        if (updateDataForAudit.status === 1) {
          erp.postFun("erpSupplierPlan/checkSupplierPlan", params, function(
            res
          ) {
            console.log(res);
            if (res.data.code === 200) {
              uploadDataFn(updateDataForAudit, function() {
                $scope.shenheConfirm = 0;
                // 审核成功关闭页面
                // setTimeout(() => window.close(), 500);
              });
            } else {
              layer.confirm(
                  '<p style="font-weight: 900;">警告！</p><p style="color:#999;">如果同意通过该产品，则会超出该供应商能上传商品最大数，是否确定上架该商品。</p>',
                  {
                    icon: 2,
                    title: '提示'
                  },function(index2) {
                      uploadDataFn(updateDataForAudit, function() {
                      $scope.shenheConfirm = 0;
                      // 审核成功关闭页面
                      setTimeout(() => window.close(), 500);
                    });
                  }
                )
            }
          });
        } else {
          uploadDataFn(updateDataForAudit, function() {
            $scope.shenheConfirm = 0;
            // 审核成功关闭页面
            setTimeout(() => window.close(), 500);
          });
        }
      };

      // 获取提交数据
      function getUploadData() {
        const uploadDataStore = {
          ...$scope.productInfo,
          accountInfo: undefined,
          variantList: undefined
        };
        // 变体数据相关
        const _grams = []; // 缓存重量
        const _weight = []; // 缓存邮寄重量
        const _price = []; // 缓存价格
        uploadDataStore.variantUpdateList = $scope.variantList.map(i => {
          _grams.push(i.grams);
          _weight.push(i.weight);
          _price.push(i.price);
          return {
            ...i,
            sku: concatSku(i) // 对sku的空变量值过滤
          };
        });
        const minGrams = Math.min(..._grams);
        const maxGrams = Math.max(..._grams);
        const minWeight = Math.min(..._weight);
        const maxWeight = Math.max(..._weight);
        const minPrice = Math.min(..._price);
        const maxPrice = Math.max(..._price);
        uploadDataStore.sellPrice = Math.min(..._price); // 商品最低价格
        uploadDataStore.productGrams = minGrams; // 最小商品重量
        uploadDataStore.grams = // 商品重量区间
          minGrams == maxGrams ? maxGrams : `${minGrams}-${maxGrams}`;
        uploadDataStore.weight = // 商品邮寄重量区间
          minWeight == maxWeight ? maxWeight : `${minWeight}-${maxWeight}`;
        uploadDataStore.price = // 商品价格区间
          minPrice == maxPrice ? maxPrice : `${minPrice}-${maxPrice}`;

        uploadDataStore.packing = $scope.packing.join(); // 包装
        uploadDataStore.attribute = $scope.property.join(); // 属性
        uploadDataStore.material = $scope.material.join(); // 材质

        uploadDataStore.option1 =
          productInfo.option1 && productInfo.option1.split("#_");
        uploadDataStore.option2 =
          productInfo.option2 && productInfo.option2.split("#_");
        uploadDataStore.option3 =
          productInfo.option3 && productInfo.option3.split("#_");
        // 消费人群
        uploadDataStore.consumerGroups = {};
        $scope.selectConsumer.forEach(e => {
          uploadDataStore.consumerGroups[e.id] = e;
        });
        uploadDataStore.consumerGroups =
          $scope.selectConsumer.length > 0
            ? JSON.stringify(uploadDataStore.consumerGroups)
            : undefined;
        uploadDataStore.visibilityType = $scope.authority.satus;
        uploadDataStore.accountIdList = $scope.authorityUsers.map(item => 
        
           item.id
        )
        // 中文名称
        uploadDataStore.name = $scope.chineseName.join();
        return uploadDataStore;
      }

      //  提交数据到服务器
      function uploadDataFn(uploadData, cb) {
        const loading = layer.load();
        erp.postFun("supplier/product/updateProduct", uploadData, function(
          res
        ) {
          layer.closeAll();
          const data = res.data;
          if (data.code == 200) {
            layer.msg("操作成功");
            cb && cb();
          } else {
            layer.msg("操作失败");
          }
        });
      }

      /**
       *  编辑规则 如下
       *
       * 可批量设置：重量、邮寄重量、价格、申报价值、长宽高
       *
       * 编辑必填项：
       * 商品-商品英文名称、英文描述、商品图片、中文名称至少三组、申报品名（英文）、申报品名（中文）、包装、材质、属性、消费人群
       * 变体-图片、变量、重量、邮寄重量、价格、申报价值、长宽高
       *
       * 其他限制：
       * 价格、申报价值、重量、邮寄重量必须数字
       * 邮寄重量必须大于重量
       * 变体sku不能重复
       * 申报品名中文字符不能少于两个
       * 申报品名英文字符不能超过20个
       */
      /**
       * 验证上传值是否符合规则
       * @param {Object} 提交到服务端的数据
       * @returns {boolen} 返回验证结果 ture|flase
       */
      function checkUpdateData(uploadData) {
        console.log("uploadData=====>>>>>>>", uploadData);
        // 中文名称至少3组
        const _chineseName = uploadData.name.split(",").filter(n => n);
        if (
          _chineseName.length < 3 
          // ||
          // !_chineseName.every(word =>
          //   word.split("").every(i => /[\u4e00-\u9fa5]/.test(i))
          // )
        ) {
          layer.msg("中文名称至少3组");
          return false;
        }

        // 商品必填项
        const productRequiers = [
          {
            key: "bodyHtml",
            value: "英文描述"
          },
          {
            key: "packing",
            value: "包装"
          },
          {
            key: "material",
            value: "材质"
          },
          {
            key: "attribute",
            value: "属性"
          },
          {
            key: "title",
            value: "商品名称"
          },
          {
            key: "entryCode",
            value: "海关编码"
          }
        ];
        const _lostRequireArray = [];
        productRequiers.forEach(({ key, value }) => {
          console.log(key, value);
          if (!uploadData[key]) {
            _lostRequireArray.push(value);
          }
        });

        // if (productRequiers.some(k => !uploadData[k])) {
        //   layer.msg('请检查商品必填项');
        //   return false;
        // }
        // 变体必选项
        const varibleRequiers = [
          { key: "imageUrl", value: "商品图片" },
          { key: "grams", value: "商品重量" },
          { key: "weight", value: "邮寄重量" },
          { key: "plong", value: "长" },
          { key: "pwidth", value: "宽" },
          { key: "pheight", value: "高" },
          { key: "price", value: "价格" },
          { key: "customsValue", value: "申报价值" }
        ];
        if ($scope.productInfo.option1) {
          const o = $scope.productInfo.option1.split("#_");
          varibleRequiers.push({
            key: "option1",
            value: o[0]
          });
        }
        if ($scope.productInfo.option2) {
          const o = $scope.productInfo.option2.split("#_");
          varibleRequiers.push({
            key: "option2",
            value: o[0]
          });
        }
        if ($scope.productInfo.option3) {
          const o = $scope.productInfo.option3.split("#_");
          varibleRequiers.push({
            key: "option3",
            value: o[0]
          });
        }
        varibleRequiers.forEach(({ key, value }) => {
          uploadData.variantUpdateList.forEach(pro => {
            if (!pro[key]) {
              _lostRequireArray.push(value);
            }
          });
        });
        console.log([...new Set(_lostRequireArray)].join(","));
        if (_lostRequireArray.length > 0) {
          layer.msg(
            `${[...new Set(_lostRequireArray)].join(
              ","
            )}为必填项;请确认填写正确后进行操作.`
          );

          return false;
        }
        // if (
        //   varibleRequiers.some(k =>
        //     uploadData.variantUpdateList.some(o => !o[k])
        //   )
        // ) {
        //   layer.msg('请检查变体必填项');
        //   return false;
        // }

        // 价格、申报价值、重量、邮寄重量必须数字
        const isNumbers = ["price", "customsValue", "weight", "grams"];
        if (
          isNumbers.some(k =>
            uploadData.variantUpdateList.some(o => isNaN(+o[k]))
          )
        ) {
          layer.msg("价格、申报价值、重量、邮寄重量必须为数字");
          return false;
        }
        // 邮寄重量必须大于重量
        if (uploadData.variantUpdateList.some(o => o.weight < o.grams)) {
          layer.msg("邮寄重量不能小于重量");
          return false;
        }

        // sku 不能重复=====
        const _sku_arr = [];
        for (let i = 0; i < uploadData.variantUpdateList.length; i++) {
          const item = uploadData.variantUpdateList[i];
          if (_sku_arr.includes(item.sku)) {
            layer.msg("变体sku不能重复");
            return false;
          }
          _sku_arr.push(item.sku);
        }
        // 海关编码
        if (!uploadData.entryCode.split("").every(i => /[a-zA-Z0-9]/.test(i))) {
          layer.msg("海关编码只能为英文字母或数字");
          return false;
        }

        // 申报品名中文字符不能少于两个
        if (
          uploadData.entryName.length < 2 ||
          !uploadData.entryName.split("").every(i => /[\u4e00-\u9fa5]/.test(i))
        ) {
          layer.msg("申报品名(中文)只能为中文且字符不能少于两个");
          return false;
        }
        // 申报品名英文字符不能超过20个
        if (
          uploadData.entryNameEn.length > 20 ||
          !uploadData.entryNameEn.split("").every(i => /[a-zA-Z ]/.test(i))
        ) {
          layer.msg("申报品名(英文)只能为英文且字符不能超过20个");
          return false;
        }
        if($scope.authority.satus == 2 && $scope.authorityUsers.length === 0) {
          layer.msg("请选择可以可见人群");
          return false;
        }

        return true;
      }
    }
  ]);
})();
