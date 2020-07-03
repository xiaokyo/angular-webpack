(function (angular) {
    angular.module('manage')
        .component('sendEmail', {
            templateUrl: 'static/components/send-mail/send-mail.html',
            controller: sendEmailCtrl,
            bindings: {
                podarray: '=',
                showdetail: '=',
                no: '=',
                onLog: '&',
                showWorkOrder: '&',
                username: '=',
                gdId: '<'   //是否是邮件工单过来 如果是 则要多请求将订单改为已解决 
            }
        });

    function sendEmailCtrl($scope, erp) {
        console.log('sendEmailCtrl');
        console.log(this.no)
        console.log(this.gdId)

        var E = window.wangEditor;
        var editor = new E('#wang');

        $scope.email = this.no.email || ''
        $scope.gdId = this.gdId || ''
        initFun($scope.email);
        editor.customConfig.menus = [
            'head',  // 标题
            'bold',  // 粗体
            'fontSize',  // 字号
            'fontName',  // 字体
            'italic',  // 斜体
            'underline',  // 下划线
            'strikeThrough',  // 删除线
            'foreColor',  // 文字颜色
            'backColor',  // 背景颜色
            'link',  // 插入链接
            'list',  // 列表
            'justify',  // 对齐方式
            'quote',  // 引用
            'image',  // 插入图片
            'table',  // 表格
            'video',  // 插入视频
            'code',  // 插入代码
            'undo',  // 撤销
            'redo'  // 重复
        ]

        editor.customConfig.uploadImgServer = 'https://erp.cjdropshipping.com/app/ajax/upload';
		editor.customConfig.uploadFileName = 'file';
		// 将 timeout 时间改为 30s
		editor.customConfig.uploadImgTimeout = 30000;
		editor.customConfig.uploadImgHooks = {
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
		}
        editor.create();
        getModelList();

        //获取模板列表
        function getModelList() {
            var data = {
                "startDate": '',
                "endDate": '',
                "templateName": '',
                "pageSize": '9999',
                "pageNum": '1',
                "state": '0'
            };
            //erp.load();
            erp.postFun('app/modelEmail/getPageTemplate', JSON.stringify(data), function (data) {
                //console.log(data);
                if (data.data.code === '200') {
                    $scope.modelList = data.data.list;
                }
            }, function () {
                layer.msg('Network error, please try again later');
            });
        }
        //客户状态选择判断不同客户名称
        $('.khzt input[type="radio"]').change(function () {
            var val = $(this).val();
            console.log(val);
            if (val == '6') {
                $('.khmc01').show();
                $('.khmc02').hide();
                $('.khmc03').hide();
                $('.emailCanshu').hide();
            } else if (val == '5') {
                $('.khmc01').hide();
                $('.khmc02').hide();
                $('.khmc03').css('display', 'flex');
                $('.emailCanshu').hide();
                var text = $('.selectTypeBtnGroup').find('.act').html();
                if (text.trim() == '文本邮件') {
                    $('.emailCanshu').show();
                    $('.emailCanshu').find('.canshubtn').hide().eq(3).show();
                }
            } else {
                $('.khmc01').hide();
                $('.khmc02').show();
                $('.khmc03').hide();
                var text = $('.selectTypeBtnGroup').find('.act').html();
                if (text.trim() == '文本邮件') {
                    $('.emailCanshu').show();
                    $('.emailCanshu').find('.canshubtn').show();
                }

            }
        });

        $('.khmc02 input[type="radio"]').change(function () {
            var val = $(this).val();
            if (val != '0') {
                $('#customerUserName').show();
            } else {
                $('#customerUserName').hide();
            }
        });
        $('.khmc03 input[type="radio"]').change(function () {
            var val = $(this).val();
            if (val != '0') {
                $('#YoukeName').show();
            } else {
                $('#YoukeName').hide();
            }
        });
        //选择本地上传 or 图片链接
        $('#thtp input[type="radio"]').change(function () {
            var val = $(this).val();
            if (val == '0') {
                $('#tplj').hide();
                $('#bdsc').show();
            } else if (val == '1') {
                $('#tplj').show();
                $('#bdsc').hide();
            }
        });

        //选择不同邮件
        $('.selectTypeBtnGroup').on('click', 'button', function () {
            var target = $(this);
            target.addClass('act').siblings('.act').removeClass('act');
            var index = target.index();
            console.log(index);
            if (index == 0) {
                $('.yjmb01').addClass('act');
                $('.yjmb02').removeClass('act');
                $('.yjmb.email').removeClass('act');
                $('.emailCanshu').hide();
            } else if (index == 1) {
                $('.yjmb02').addClass('act');
                $('.yjmb01').removeClass('act');
                $('.yjmb.email').addClass('act');
                var val = $('.khzt input[type="radio"]:checked').val();
                console.log(val);
                if (val == '5') {
                    $('.emailCanshu').show();
                    $('.emailCanshu').find('.canshubtn').hide().eq(3).show();
                } else if (val == '6') {
                    $('.emailCanshu').hide();
                } else {
                    $('.emailCanshu').show();
                    $('.emailCanshu').find('.canshubtn').show();
                }

            }
        });
        //打开预览
        $scope.yulan = function (code) {
            //console.log(code);
            var opt = $('#modelNameSelect option:selected');
            //console.log(opt.val());
            if (opt.val() == '') {
                layer.msg('请选择模板');
            } else {
                var editcode = opt.attr('data-edit');
                //console.log(editcode);
                var code = opt.attr('data-code');
                var html = '';
                var num = '';
                if (editcode == '' || editcode == null || editcode == undefined) {
                    html = code;
                    num = 'old';
                } else {
                    html = editcode;
                    num = 'new';
                }
                console.log(num);
                $('.zzc2').show().find('.previewWrap>h2').html('预览');
                var target = $('.preview');
                target.html(html);
                target.find('.bannerBtn').css('display', 'none');
                target.find('.textBtn').css('display', 'none');
                target.find('.categoryBtn').css('display', 'none');
                //target.find('#categoryBtn2').css('display','inline-block');
                target.find('.productBtn').css('display', 'none');
                $('.saveBtn').hide();
                $('.zzc3').hide();

            }
        };
        // 邮件预览
        $scope.emailYulan = function () {
            var email = editor.txt.html()
            $('.zzc2').show().find('.previewWrap>h2').html('预览');
            $('.saveBtn').hide();
            //$('.previewWin').hide();
            $('.preview').html(email);
        }
        //打开编辑
        $scope.openEidt = function () {
            var opt = $('#modelNameSelect option:selected');
            //console.log(opt.val());
            if (opt.val() == '') {
                layer.msg('请选择模板');
            } else {
                var editcode = opt.attr('data-edit');
                //console.log(editcode);
                var code = opt.attr('data-code');
                var html = '';
                var num = '';
                if (editcode == '' || editcode == null || editcode == undefined) {
                    html = code;
                    num = 'old';
                } else {
                    html = editcode;
                    num = 'new';
                }
                console.log(num);
                //console.log(code);
                $('.zzc2').show().find('.previewWrap>h2').html('编辑');
                var target = $('.preview');
                target.html(html);
                target.find('.bannerBtn').css('display', 'block');
                target.find('.textBtn').css('display', 'block');
                target.find('.categoryBtn').css('display', 'inline-block');
                //target.find('#categoryBtn2').css('display','inline-block');
                target.find('.productBtn').css('display', 'block');
                $('.saveBtn').show();
                $('.zzc3').hide();
            }
        };

        $('.preview').on('click', '.mailBtn', function () {
            $('.zzc3').show();
            var btnName = $(this).html();
            //console.log(btnName);
            if (btnName.trim() == "替换链接") {
                $('.previewWin').css('width', '350px');
                $('.winWrap').hide();
                $('#bjlj').show();
                $('#bjljLink').val('');
            } else if (btnName.trim() == "替换图片") {
                $('.previewWin').css('width', '350px');
                $('.winWrap').hide();
                $('#thtp').show().find('input[type="radio"]').prop('checked', false);
                $('#thtp').find('.radioWrap:nth-child(1) input[type="radio"]').prop('checked', true);
                $('#tplj').hide();
                $('#bdsc').show();
                $('#piclink2').val('');
                $('#submitPic').val('');
            } else if (btnName.trim() == "替换文本") {
                $('.winWrap').hide();
                $('#bjwa').show();
                $('.previewWin').css({
                    "width": "490px",
                    "margin": "200px auto"
                });
                var test = $(this).parent().prev('p').html();
                $('#bjwaTextarea').val(test).css('width', '400px');
            } else if (btnName.trim() == "替换类目") {
                $('.previewWin').css('width', '350px');
                $('.winWrap').hide();
                $('#bjlm').show();
                var id = $(this).parent().prev().attr('id');
                //console.log(id);
                $('#bjlmBtn').attr('data-id', id);
                $('#bjlmText').val('');
            } else if (btnName.trim() == "替换商品") {
                $('.previewWin').css('width', '350px');
                $('.winWrap').hide();
                $('#thsp').show();
                var id = $(this).parent().parent().attr('id');
                $('#thspBtn').attr('data-id', id);
                $('#thspSKU').val('');
            }
        });

        //确认编辑文案
        $('#bjwaBtn').click(function () {
            var text = $('#bjwaTextarea').val();
            var target = $('.preview').find('.p-text>p');
            target.html(text);
            $scope.closeWin();
        });
        //确认编辑类目
        $('#bjlmBtn').click(function () {
            var text = $('#bjlmText').val();
            var id = '#' + $(this).attr('data-id');
            var target = $('.preview').find(id);
            target.html(text);
            $scope.closeWin();
        });
        //确认替换连接
        $('#bjljBtn').click(function () {
            var link = $('#bjljLink').val();
            var target = $('.preview').find('.p-banner>a');
            target.attr('href', link);
            $scope.closeWin();
        });
        //上传图片
        $('#submitPic').change(function () {
            var target = $(this);
            var id = $(this).attr('id');
            erp.ossUploadFile($('#submitPic')[0].files, function (data) {
                console.log(data);
                if (data.code == 0) {
                    layer.msg('上传失败');
                    return;
                }
                if (data.code == 2) {
                    layer.msg('部分图片上传失败');
                }
                var result = data.succssLinks;
                console.log(result);
                var imgArr = [];
                for (var j = 0; j < result.length; j++) {
                    var srcList = result[j].split('.');
                    var fileName = srcList[srcList.length - 1].toLowerCase();
                    console.log(fileName);
                    if (fileName == 'png' || fileName == 'jpg' || fileName == 'jpeg' || fileName == 'gif') {
                        imgArr.push(result[j]);
                        $('#submitPic').val('');
                    }
                }
                console.log(imgArr);
                var link = imgArr[0];
                target.next('p').show().attr('data-link', link);
                //$scope.$apply();
            });

        });
        //确认替换图片
        $('#thtpBtn').click(function () {
            var val = $('#thtp input[type="radio"]:checked').val();
            var target = $('.preview').find('.p-banner>a>img');
            console.log(val);
            if (val == '0') {
                var link = $('#submitPic').next('p').attr('data-link');
                target.attr('src', link);
                $scope.closeWin();
                $('#submitPic').next('p').hide();
            } else if (val == '1') {
                var link = $('#piclink2').val();
                target.attr('src', link);
                $scope.closeWin();
            }
        });
        //确认替换商品 pojo/product/list
        $('#thspBtn').click(function () {
            var target = $(this);
            var sku = $('#thspSKU').val();
            var data = {
                "flag": "0",
                "status": "3",
                "pageNum": "1",
                "pageSize": "20",
                "filter01": "SKU",
                "filter02": sku,
                "filter03": "",
                "filter04": "",
                "filter05": "",
                "filter06": "",
                "filter21": "",
                "filter22": "",
                "filter23": "",
                "filter24": "",
                "filter11": "",
                "filter12": "",
                "autFlag": "01",
                "chargeId": "",
                "flag2": ""
            };
            erp.load();
            erp.postFun('pojo/product/list', JSON.stringify(data), function (data) {
                erp.closeLoad();
                //CJYDYDYD00110
                if (data.data.statusCode == '200') {

                    var result = JSON.parse(data.data.result);
                    console.log(result);
                    if (result.ps.length == 0) {
                        layer.msg('未找到商品，请检查SKU');
                    } else {
                        layer.msg('查询成功');
                        var sp = result.ps[0];
                        console.log(sp);
                        var aut = sp.authorityStatus;
                        if (aut == '1') {
                            //共有
                            var name = sp.nameEn;
                            var imgUrl = sp.bigImg;
                            var price = sp.sellPrice;
                            var picId = sp.id;
                            var id = '#' + target.attr('data-id');
                            var parent = $('.preview').find(id);
                            var product = parent.find('.product');
                            console.log(product);
                            var imgele = product.find('.product-img>a>img');
                            imgele.attr('src', imgUrl);
                            imgele.attr('title', name);
                            imgele.attr('alt', 'Product Picture');
                            var str = "https://app.cjdropshipping.com/product-detail.html?id=" + picId;
                            imgele.parent().attr('href', str);
                            product.find('.product-name>p').html(name);
                            product.find('.product-bottom .product-price>span').html(price);
                            $scope.closeWin();
                        } else {
                            layer.msg('不能推送私有商品');
                        }
                    }
                } else {
                    layer.msg('查询失败');
                }
            }, function () {
                erp.closeLoad();
                layer.msg('Network error, please try again later');
            });
        });
        //保存编辑
        $('.saveBtn').click(function () {
            $('.zzc2').hide();
            var target = $('.preview');
            target.find('.bannerBtn').css('display', 'none');
            target.find('.textBtn').css('display', 'none');
            target.find('.categoryBtn').css('display', 'none');
            //target.find('#categoryBtn2').css('display','inline-block');
            target.find('.productBtn').css('display', 'none');
            var code = $('.preview').html();
            var opt = $('#modelNameSelect option:selected');
            opt.attr('data-edit', code);
        });

        //关闭遮罩层2
        $scope.closeZzc2 = function () {
            $('.zzc2').hide();
        }

        //关闭编辑弹窗
        $scope.closeWin = function () {
            $('.zzc3').hide();
        }
        $scope.closeFun = function () {
            $('#modelNameSelect').find('option:selected').attr('data-edit', '');
            $scope.$emit('log-to-father', { closeFlag: false });
        }
        var cursorPosition = {
            get: function (textarea) {
                var rangeData = { text: "", start: 0, end: 0 };

                if (textarea.setSelectionRange) { // W3C
                    textarea.focus();
                    rangeData.start = textarea.selectionStart;
                    rangeData.end = textarea.selectionEnd;
                    rangeData.text = (rangeData.start != rangeData.end) ? textarea.value.substring(rangeData.start, rangeData.end) : "";
                } else if (document.selection) { // IE
                    textarea.focus();
                    var i,
                        oS = document.selection.createRange(),
                        // Don't: oR = textarea.createTextRange()
                        oR = document.body.createTextRange();
                    oR.moveToElementText(textarea);

                    rangeData.text = oS.text;
                    rangeData.bookmark = oS.getBookmark();

                    // object.moveStart(sUnit [, iCount])
                    // Return Value: Integer that returns the number of units moved.
                    for (i = 0; oR.compareEndPoints('StartToStart', oS) < 0 && oS.moveStart("character", -1) !== 0; i++) {
                        // Why? You can alert(textarea.value.length)
                        if (textarea.value.charAt(i) == '\r') {
                            i++;
                        }
                    }
                    rangeData.start = i;
                    rangeData.end = rangeData.text.length + rangeData.start;
                }

                return rangeData;
            },

            set: function (textarea, rangeData) {
                var oR, start, end;
                if (!rangeData) {
                    alert("You must get cursor position first.")
                }
                textarea.focus();
                if (textarea.setSelectionRange) { // W3C
                    textarea.setSelectionRange(rangeData.start, rangeData.end);
                } else if (textarea.createTextRange) { // IE
                    oR = textarea.createTextRange();

                    // Fixbug : ues moveToBookmark()
                    // In IE, if cursor position at the end of textarea, the set function don't work
                    if (textarea.value.length === rangeData.start) {
                        //alert('hello')
                        oR.collapse(false);
                        oR.select();
                    } else {
                        oR.moveToBookmark(rangeData.bookmark);
                        oR.select();
                    }
                }
            },

            add: function (textarea, rangeData, text) {
                var oValue, nValue, oR, sR, nStart, nEnd, st;
                this.set(textarea, rangeData);

                if (textarea.setSelectionRange) { // W3C
                    oValue = textarea.value;
                    nValue = oValue.substring(0, rangeData.start) + text + oValue.substring(rangeData.end);
                    nStart = nEnd = rangeData.start + text.length;
                    st = textarea.scrollTop;
                    textarea.value = nValue;
                    // Fixbug:
                    // After textarea.values = nValue, scrollTop value to 0
                    if (textarea.scrollTop != st) {
                        textarea.scrollTop = st;
                    }
                    textarea.setSelectionRange(nStart, nEnd);
                } else if (textarea.createTextRange) { // IE
                    sR = document.selection.createRange();
                    sR.text = text;
                    sR.setEndPoint('StartToEnd', sR);
                    sR.select();
                }
            }
        };
        //参数添加到内容
        $('.canshuGroup').on('click', 'span.canshubtn', function () {
            var target = $(this);
            var text = target.attr('data-en');
            text = "${" + text + "}";
            var tx = $('#mailContent')[0];
            var pos = cursorPosition.get(tx);

            cursorPosition.add(tx, pos, text);
            //var html = $('#mailContent').val();
            //html+=text;
            //$('#mailContent').val(html);
        });
        //富文本
        $('.tool').on('click', 'span', function () {
            var target = $(this);
            var btn = target.html();
            var parent = target.parent();
            var textArea = parent.next('textarea').attr('id');
            var textAreaId = '#' + textArea;
            console.log(textAreaId);
            var text;
            var tx = $(textAreaId)[0];
            var pos = cursorPosition.get(tx);
            if (btn.trim() == '换行') {
                text = '<br>';
                cursorPosition.add(tx, pos, text);
            } else if (btn.trim() == '空格') {
                text = '&nbsp;';
                cursorPosition.add(tx, pos, text);
            } else if (btn.trim() == '加粗') {
                var content = $(textAreaId).val();
                var n = getSelectText(textArea);
                console.log(n);
                console.log(content);
                var newtext = '<b>' + n + '</b>';
                console.log(newtext);
                var str = content.replace(n, newtext);
                $(textAreaId).val(str);
            }

        });

        function getSelectText(id) {
            var t = document.getElementById(id);
            if (window.getSelection) {
                if (t.selectionStart != undefined && t.selectionEnd != undefined) {
                    return t.value.substring(t.selectionStart, t.selectionEnd);
                } else {
                    return "";
                }
            } else {
                return document.selection.createRange().text;
            }
        }

        //发送邮件
        $scope.sendFun = function () {
            var checked = $('.khzt input[type="radio"]:checked');
            var val = checked.val();
            //console.log(val);
            var msgName = $('#mailTitle').val();
            var emailType = $('#selectMailType').val().toLowerCase();
            //console.log(emailType);
            $scope.editFlag = 'edit';
            $scope.emailType = emailType;
            if (msgName == null || msgName == '' || msgName == undefined) {
                layer.msg('邮件标题不能为空');
            } else {
                $scope.msgName = msgName;
                var html = $('.selectTypeBtnGroup .act').html();
                var msgContent = '';
                var modeName = '';
                if (html.trim() == '模板邮件') {
                    var opt = $('#modelNameSelect option:selected');
                    modeName = opt.html();
                    var editcode = opt.attr('data-edit');
                    var code = opt.attr('data-code');
                    if (editcode == '' || editcode == null || editcode == undefined) {
                        msgContent = code;
                    } else {
                        msgContent = editcode;
                    }
                    $scope.id = opt.attr('data-id');
                } else if (html.trim() == '文本邮件') {
                    // msgContent = $('#mailContent').val();
                    msgContent = editor.txt.html();
                    $scope.id = '';
                }
                $scope.modeName = modeName;
                if (msgContent == '' || msgContent == null || msgContent == undefined) {
                    layer.msg('邮件内容不能为空');
                } else {
                    $scope.msgContent = msgContent;
                    if (val == '6') {
                        //自定义
                        var address = $('#customerAdress').val();
                        var reg = /^[a-zA-Z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
                        if (address == '' || address == null || address == undefined) {
                            layer.msg('发送地址不能为空');
                        } else if (!reg.test(address)) {
                            layer.msg('邮箱格式不正确');
                            console.log(reg.test(address))
                        } else {
                            $scope.modelType = '102';
                            $scope.toAddress = address;
                            $scope.nameKey = '';
                            $scope.nameValue = '';
                            var data = {
                                "modeName": $scope.modeName,
                                "msgName": $scope.msgName,
                                "msgContent": $scope.msgContent,
                                "id": $scope.id,
                                "editFlag": $scope.editFlag,
                                "modelType": $scope.modelType,
                                "toAddress": $scope.toAddress,
                                "nameValue": $scope.nameValue,
                                "nameKey": $scope.nameKey,
                                "emailType": $scope.emailType
                            };
                            sendMail(data);
                        }
                    } else if (val == '5') {
                        //游客
                        var cn = $('.khmc03 input[type="radio"]:checked').val();
                        var nameValue = $('#YoukeName').val();
                        $scope.modelType = '103';
                        $scope.toAddress = '';
                        if (cn == '0') {
                            $scope.nameValue = '';
                            $scope.nameKey = '';
                            var data = {
                                "modeName": $scope.modeName,
                                "msgName": $scope.msgName,
                                "msgContent": $scope.msgContent,
                                "id": $scope.id,
                                "editFlag": $scope.editFlag,
                                "modelType": $scope.modelType,
                                "toAddress": $scope.toAddress,
                                "nameValue": $scope.nameValue,
                                "nameKey": $scope.nameKey,
                                "emailType": $scope.emailType
                            };
                            sendMail(data);
                        } else {
                            if (nameValue == '' || nameValue == undefined || nameValue == null) {
                                layer.msg('游客邮箱不能为空');
                            } else {
                                if (cn == '1') {
                                    $scope.nameValue = nameValue;
                                    $scope.nameKey = 'in';
                                } else if (cn == '2') {
                                    $scope.nameValue = nameValue;
                                    $scope.nameKey = 'out';
                                }
                                var data = {
                                    "modeName": $scope.modeName,
                                    "msgName": $scope.msgName,
                                    "msgContent": $scope.msgContent,
                                    "id": $scope.id,
                                    "editFlag": $scope.editFlag,
                                    "modelType": $scope.modelType,
                                    "toAddress": $scope.toAddress,
                                    "nameValue": $scope.nameValue,
                                    "nameKey": $scope.nameKey,
                                    "emailType": $scope.emailType
                                    //"userStatus":$scope.userStatus
                                };
                                sendMail(data);
                            }
                        }
                    } else {
                        //指定  userStatus
                        var cn = $('.khmc02 input[type="radio"]:checked').val();
                        var nameValue = $('#customerUserName').val();
                        $scope.modelType = '101';
                        $scope.toAddress = '';
                        console.log(cn);
                        if (cn == '0') {
                            //默认
                            $scope.nameValue = '';
                            $scope.nameKey = '';
                            if (val == '0') {
                                $scope.userStatus = '0,1,2,3,4';
                            } else {
                                $scope.userStatus = (val - 1).toString();
                            }
                            var data = {
                                "modeName": $scope.modeName,
                                "msgName": $scope.msgName,
                                "msgContent": $scope.msgContent,
                                "id": $scope.id,
                                "editFlag": $scope.editFlag,
                                "modelType": $scope.modelType,
                                "toAddress": $scope.toAddress,
                                "nameValue": $scope.nameValue,
                                "nameKey": $scope.nameKey,
                                "userStatus": $scope.userStatus,
                                "emailType": $scope.emailType
                            };
                            sendMail(data);
                        } else {
                            if (nameValue == '' || nameValue == undefined || nameValue == null) {
                                layer.msg('客户名称不能为空');
                            } else {
                                if (cn == '1') {
                                    $scope.nameValue = nameValue;
                                    $scope.nameKey = 'in';
                                } else if (cn == '2') {
                                    $scope.nameValue = nameValue;
                                    $scope.nameKey = 'out';
                                }
                                if (val == '0') {
                                    $scope.userStatus = '0,1,2,3,4';
                                } else {
                                    $scope.userStatus = (val - 1).toString();
                                }
                                var data = {
                                    "modeName": $scope.modeName,
                                    "msgName": $scope.msgName,
                                    "msgContent": $scope.msgContent,
                                    "id": $scope.id,
                                    "editFlag": $scope.editFlag,
                                    "modelType": $scope.modelType,
                                    "toAddress": $scope.toAddress,
                                    "nameValue": $scope.nameValue,
                                    "nameKey": $scope.nameKey,
                                    "userStatus": $scope.userStatus,
                                    "emailType": $scope.emailType
                                };
                                sendMail(data);

                            }
                        }


                    }
                }
            }
        }
        function sendMail(data) {
            // console.log(data);
            var status;
            var includeCustomerNames = '';
            var notIncludeCustomerNames = '';
            if ($scope.userStatus) {
                status = $scope.userStatus;
            } else {
                status = '';
            }
            if (data.nameKey == '') {
                includeCustomerNames = '';
                notIncludeCustomerNames = '';
            } else if (data.nameKey == 'in') {
                includeCustomerNames = data.nameValue;
                notIncludeCustomerNames = '';
            } else if (data.nameKey == 'out') {
                includeCustomerNames = '';
                notIncludeCustomerNames = data.nameValue;
            }
            data.templateName = data.modeName;
            data.emailTitle = data.msgName;
            data.pageSourceCode = data.msgContent;
            data.customerStatus = status;
            data.includeCustomerNames = includeCustomerNames;
            data.notIncludeCustomerNames = notIncludeCustomerNames;
            data.designatedCustomerEmail = data.toAddress;
            console.log(data);
            layer.confirm('邮件每天限发送10000封，确认要发送吗？', {
                btn: ['确定', '取消']//按钮
            }, function (index) {
                layer.close(index);
                erp.load();
                erp.postFun('app/modelEmail/sendCustomModelMail', JSON.stringify(data), function (data) {
                    erp.closeLoad();
                    console.log(data);
                    if (data.data.code == '200') {
                        layer.msg('发送成功');
                        $('.zzc1').hide();
                        editor.txt.clear();
                        // getHistoryList1();
                        //erp.postFun('app/modelEmail/addEmailHistoricalRecords',JSON.stringify(addData),function(data){
                        //    console.log(data);
                        //    getHistoryList();
                        //},function(){
                        //
                        //})

                        //判断是否是从邮件工单过来的，如果是 执行下面方法
                        if($scope.gdId != ''){
                            changeStatusFun();
                        }

                    } else {
                        layer.alert(data.data.message);
                    }
                }, function (n) {
                    erp.closeLoad();
                    console.log(n);
                });
            });
        }

         function changeStatusFun() {
             console.log(0000)
            //var sendData={
            //    id:$scope.updateId,
            //    disposeStatus:type
            //}
            erp.getFun('pojo/issue/dispose?id=' + $scope.gdId + '&disposeStatus=1', function (data) {
                console.log(data.data);
                if (data.data.statusCode == '200') {
                    layer.msg('工单已解决');
                    //$scope.closRrecordMsgFun();
                    //getIssueList();
                } else {
                    layer.msg('操作失败')
                }

            }, function () {
                layer.msg('网络错误');
            });
        }

    }
    function initFun(email) {
        // $('.zzc1').show();
        $(' input[type="radio"]').prop('checked', false);
        $('.radioTop .radioWrap:nth-child(1) input[type="radio"]').prop('checked', true);
        $('.khmc02 .radioWrap:nth-child(1) input[type="radio"]').prop('checked', true);
        $('.khmc03 .radioWrap:nth-child(1) input[type="radio"]').prop('checked', true);
        $('.otherzt .radioWrap:nth-child(2) input[type="radio"]').prop('checked', true);
        $('.khmc01').show();
        $('.khmc02').hide();
        $('.btn01').addClass('act');
        $('.btn02').removeClass('act');
        $('.yjmb01').addClass('act');
        $('.yjmb02').removeClass('act');
        $('#modelNameSelect').val('');
        $('#mailContent').val('');
        $('#mailTitle').val('');
        $('#customerAdress').val(email);
        $('#customerUserName').val('').hide();//customerUserName
        $('#YoukeName').val('').hide();//customerUserName
    }



})(angular);