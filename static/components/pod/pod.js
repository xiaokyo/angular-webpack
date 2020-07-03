(function(angular) {

    angular.module('merchandise')
        .component('podMerchandise', {
            templateUrl: 'static/components/pod/pod.html',
            controller: podMerchandiseCtrl,
            bindings: {
                podarray: '=',
                showdetail: '=',
                type: '=',
                onLog: '&',
                showWorkOrder: '&'
            },
            // controllerAs: 'vm',
        });

    function podMerchandiseCtrl($scope, erp) {
        // console.log(dsp.getQueryString())
        // $scope.text = '';

        // this.testObj = 10;
        // console.log($ctrl.hero);

        // this.podarray = 10;
        var that = this;

        console.log(this.podarray);

        if (this.showdetail) {
            $scope.showdetail = true;
        }

        $scope.podType = this.type;
        // $scope.onLog = function() {
        //     ctrl.onLog({ text: $scope.text });
        // }

        $scope.$on('to-pod', function(d,data) {  
            console.log(data);         //子级能得到值  
            if (data == 'getdata') {
               // getData(); 
               that.podarray = getData(); 
               console.log(that.podarray)
               // $scope.$emit('to-addpro', 'hasgetdata');
            }
        }); 

        function getData () {

            var data = {};

            data.podType = $scope.podType;

            if ($scope.podType=='1') {
                if ($scope.podColors.length > 0) {
                    if (!$scope.basicColor) {
                        layer.msg('请输入基础色值');
                        return false;
                    }
                    if (!$scope.colorRange) {
                        layer.msg('请输入色差范围');
                        return false;
                    }
                    data.color = {
                        basic: $scope.basicColor,
                        range: $scope.colorRange,
                        colors: $scope.podColors
                    }
                }
                if ($scope.frontEditImgSrc) {
                    if ($scope.backEditImgSrc) {
                        data.zone = {
                            front: {
                                showimgurl: $scope.frontShowImgSrc,
                                editimgurl: $scope.frontEditImgSrc,
                                podtype: $scope.frontEditType
                            },
                            back: {
                                showimgurl: $scope.backShowImgSrc,
                                editimgurl: $scope.backEditImgSrc,
                                podtype: $scope.backEditType
                            }
                        }
                    } else {
                        data.zone = {
                            front: {
                                showimgurl: $scope.frontShowImgSrc,
                                editimgurl: $scope.frontEditImgSrc,
                                podtype: $scope.frontEditType
                            }
                        }
                    }
                }
            }

            if ($scope.podType=='2') {
                data.pureTextNum = $scope.pureTextNum;
            }
            
            console.log(data);

            return data;

        }

        // $scope.podColors = [];
        $scope.addPodColor = function () {
            if (!$scope.podColorNameCn || !$scope.podColorNameEn || !$scope.podColorValue) {
                layer.msg('输入值不能为空');
                return;
            }
            $scope.podColors.push({
                nameCn: $scope.podColorNameCn,
                nameEn: $scope.podColorNameEn,
                value: $scope.podColorValue
            });
            $scope.preColorVal = $scope.podColors[0].value;
            // that.podarray = $scope.podColors;
            $scope.podColorNameCn = '';
            $scope.podColorNameEn = '';
            $scope.podColorValue = '';
        }
        $scope.deletePodColor = function (index) {
            $scope.podColors.splice(index,1);
            if ($scope.podColors.length > 0) {
                $scope.preColorVal = $scope.podColors[0].value;
            } 
        }
        // $scope.$watch('podColors', function () {
        //     $scope.preColorVal = $scope.podColors[0].value;
        // });

        // $scope.showBackImg = true;
        $scope.toggleBackImg = function () {
            $scope.showBackImg=!$scope.showBackImg;
            if (!$scope.showBackImg) {
                $scope.editBackImg=false;
            }
        }

        // $scope.previewColorFlag = true;
        $scope.preColorFace = '1';
        $scope.previewColor = function () {
            if ($scope.podColors.length == 0 || !$scope.basicColor || !$scope.colorRange) return;
            $scope.preColorVal = $scope.podColors[0].value;
            if (!$scope.showBackImg) {
               $scope.preColorFace = '1'; 
            }
            if ($scope.preColorFace == '1') {
                if (!$scope.frontShowImgSrc) return;
            }
            if ($scope.preColorFace == '2') {
                if (!$scope.backShowImgSrc) return;
            }
            $scope.previewColorFlag=true;
            $scope.changeColor();
        }
        var preColorCvs = document.getElementById("pre-color-canvas")
        var preColorCxs=preColorCvs.getContext("2d")
        var imgDataOri, imgDataResultFront, imgDataOriBack, imgDataResultBack;
        $scope.changeColor = function () {
              // console.log(oricolor, newColor)
              var oricolor = hexToRGB($scope.basicColor);
              var newColor = hexToRGB($scope.preColorVal);
              var flag = $scope.preColorFace;
              console.log(oricolor, newColor, flag)
              var rgba=[];
              for (var k in oricolor) {
                  rgba.push(oricolor[k]);
              }
              var tolerance = $scope.colorRange * 1;
              console.log(tolerance)
              var newColorArr=[];
              for (var k in newColor) {
                  newColorArr.push(newColor[k]);
              }
              if (flag == '1') {
                for (var index = 0; index < imgDataOri.data.length; index += 4) {
                    var r = imgDataOri.data[index];
                    var g = imgDataOri.data[index + 1];
                    var b = imgDataOri.data[index + 2];
                    
                    if (Math.sqrt(
                        (r - rgba[0]) * (r - rgba[0]) + 
                        (g - rgba[1]) * (g - rgba[1]) + 
                        (b - rgba[2]) * (b - rgba[2])) <= tolerance
                    ) {
                        imgDataResultFront.data[index] = (newColorArr[0] + r - rgba[0]);
                        imgDataResultFront.data[index + 1] = (newColorArr[1] + g - rgba[1]);
                        imgDataResultFront.data[index + 2] = (newColorArr[2] + b - rgba[2]);
                        imgDataResultFront.data[index + 3] = imgDataOri.data[index + 3];
                    } else {
                        imgDataResultFront.data[index] = r;
                        imgDataResultFront.data[index + 1] = g;
                        imgDataResultFront.data[index + 2] = b;
                        imgDataResultFront.data[index + 3] = imgDataOri.data[index + 3];
                    }
                }
                // put数据
                // console.log(imgDataResultFront)
                // contextResultFront.clearRect(0, 0,534,534);
                // contextResultFront.putImageData(imgDataResultFront, 0, 0);
                preColorCxs.clearRect(0, 0, comWidth, comHeight);
                preColorCxs.putImageData(imgDataResultFront,0,0,0,0,comWidth,comHeight);
                // $scope.currentImgB64 = canvasTem.toDataURL("image/png");
                // return imgDataResultFront;
            } else if (flag == '2') {
                for (var index = 0; index < imgDataOriBack.data.length; index += 4) {
                    var r = imgDataOriBack.data[index];
                    var g = imgDataOriBack.data[index + 1];
                    var b = imgDataOriBack.data[index + 2];
                    
                    if (Math.sqrt(
                        (r - rgba[0]) * (r - rgba[0]) + 
                        (g - rgba[1]) * (g - rgba[1]) + 
                        (b - rgba[2]) * (b - rgba[2])) <= tolerance
                    ) {
                        imgDataResultBack.data[index] = (newColorArr[0] + r - rgba[0]);
                        imgDataResultBack.data[index + 1] = (newColorArr[1] + g - rgba[1]);
                        imgDataResultBack.data[index + 2] = (newColorArr[2] + b - rgba[2]);
                        imgDataResultBack.data[index + 3] = imgDataOriBack.data[index + 3];
                    } else {
                        imgDataResultBack.data[index] = r;
                        imgDataResultBack.data[index + 1] = g;
                        imgDataResultBack.data[index + 2] = b;
                        imgDataResultBack.data[index + 3] = imgDataOriBack.data[index + 3];
                    }
                }
                // put数据
                // contextResultBack.putImageData(imgDataResultBack, 0, 0);
                // return imgDataResultBack;
                preColorCxs.clearRect(0, 0,comWidth, comHeight);
                preColorCxs.putImageData(imgDataResultBack,0,0,0,0,comWidth, comHeight);
                // $scope.currentImgB64Back = canvasTem.toDataURL("image/png");
            }
        }
        
        function getPixels2(flag) {
            if (flag == '1') {
                var temCanvas = document.createElement('canvas');
                temCanvas.width = 400;
                temCanvas.height = 400;
                var temContext = temCanvas.getContext("2d");
                downloadedImg = new Image;
                downloadedImg.crossOrigin = "Anonymous";
                downloadedImg.addEventListener("load", imageReceived, false);
                downloadedImg.src = $scope.frontShowImgSrc + '?time=' + new Date().getTime();
                function imageReceived() {
                    console.log(this);
                    if (this.width / this.height > 1) {
                        comWidth = 400;
                        comHeight = Math.floor(this.height / this.width * comWidth);
                    } else {
                        comHeight = 400;
                        comWidth = Math.floor(this.width / this.height * comHeight);
                    }
                    temContext.clearRect(0, 0,comWidth, comHeight);
                    temContext.drawImage(this, 0, 0,comWidth, comHeight);
                    // 获取像素信息数据
                    // imgData = quseContext.getImageData(0, 0,300,300);
                    imgDataOri = temContext.getImageData(0, 0,comWidth, comHeight);
                    imgDataResultFront = temContext.getImageData(0, 0,comWidth, comHeight);
                }
            } else if (flag=='2') {
                var temCanvas = document.createElement('canvas');
                temCanvas.width = 400;
                temCanvas.height = 400;
                var temContext = temCanvas.getContext("2d");
                downloadedImg = new Image;
                downloadedImg.crossOrigin = "Anonymous";
                downloadedImg.addEventListener("load", imageReceived, false);
                downloadedImg.src = $scope.backShowImgSrc + '?time=' + new Date().getTime();
                function imageReceived() {
                    console.log(this);
                    if (this.width / this.height > 1) {
                        comWidth = 400;
                        comHeight = Math.floor(this.height / this.width * comWidth);
                    } else {
                        comHeight = 400;
                        comWidth = Math.floor(this.width / this.height * comHeight);
                    }
                    temContext.clearRect(0, 0,comWidth, comHeight);
                    temContext.drawImage(this, 0, 0,comWidth, comHeight);
                    // 获取像素信息数据
                    // imgData = quseContext.getImageData(0, 0,300,300);
                    imgDataOriBack = temContext.getImageData(0, 0,comWidth, comHeight);
                    imgDataResultBack = temContext.getImageData(0, 0,comWidth, comHeight);
                } 
            }
        }
        function hexToRGB(hex){
            var long = parseInt(hex.replace(/^#/, ""), 16);
            return {
                R: (long >>> 16) & 0xff,
                G: (long >>> 8) & 0xff,
                B: long & 0xff
            };
        }
        

        

        var fronteditCvs = document.getElementById('frontedit-cvs');
        var fronteditCtx = fronteditCvs.getContext("2d");
        var fronteditXs = null;
        var backeditCvs = document.getElementById('backedit-cvs');
        var backeditCtx = backeditCvs.getContext("2d");
        var backeditXs = null;

        var fronteditCvsShow = document.getElementById('frontedit-cvs-show');
        var fronteditCtxShow = fronteditCvsShow.getContext("2d");
        var backeditCvsShow = document.getElementById('backedit-cvs-show');
        var backeditCtxShow = backeditCvsShow.getContext("2d");

        var emptyIndexArrFront, emptyIndexArrBack;
        $scope.posiArrFront = [];
        $scope.posiArrBack = [];

        $scope.$on('receivedata', function(d,png) {  
            console.log(png);         //子级能得到值  
            $scope.frontShowImgSrc = png;
            $scope.frontEditImgSrc = png;
            $scope.frontEditType = 'pic';
            getEditData(1);
            getPixels2('1');
        }); 

        if (this.podarray) {
            renderDefault()
        } else {
            $scope.podColors = [];
            $scope.showBackImg = false;
            $scope.frontEditType = 'pic';
            $scope.backEditType = 'text';
        }
        function renderDefault () {
            $scope.podColors = [];
            var podarray = that.podarray;
            if (podarray.color) {
                $scope.podColors = podarray.color.colors;
                $scope.basicColor = podarray.color.basic;
                $scope.preColorVal = $scope.podColors[0].value;
            }
            if (podarray.color) {
                $scope.colorRange = podarray.color.range;
            }
            if (podarray.zone) {
                $scope.frontShowImgSrc = podarray.zone.front.showimgurl;
                $scope.frontEditImgSrc = podarray.zone.front.editimgurl;
                $scope.frontEditType = podarray.zone.front.podtype;
                if ($scope.showdetail) {
                    getEditData(1,'showdetail');
                } else {
                    getEditData(1);
                }
                getPixels2('1');
                if (podarray.zone.back) {
                    $scope.showBackImg = true;
                    $scope.backShowImgSrc = podarray.zone.back.showimgurl;
                    $scope.backEditImgSrc = podarray.zone.back.editimgurl;
                    $scope.backEditType = podarray.zone.back.podtype;
                    if ($scope.showdetail) {
                        getEditData(0,'showdetail');
                    } else {
                        getEditData(0);
                    }
                    getPixels2('2');
                }
            }
        } 

        // $scope.frontShowImgSrc='https://cc-west-usa.oss-us-west-1.aliyuncs.com/20180926/1201082410892.png';
        // $scope.frontEditImgSrc='https://cc-west-usa.oss-us-west-1.aliyuncs.com/20180926/5194378551661.png';
        // $scope.frontEditImgSrc='https://www.soufeel.com/skin/frontend/smartwave/default/photo/images/base/C216.png';
        // $scope.backShowImgSrc='https://cc-west-usa.oss-us-west-1.aliyuncs.com/20180926/1127475283188.png';
        // $scope.backEditImgSrc='https://cc-west-usa.oss-us-west-1.aliyuncs.com/20180926/4919805420316.png';
        // getEditData(1);
        // getEditData(0);
        // getPixels2('1');
        // getPixels2('2');
        
        // $scope.frontShowImgSrc='https://cc-west-usa.oss-us-west-1.aliyuncs.com/2059/979819934391.png';
        // $scope.frontEditImgSrc='https://cc-west-usa.oss-us-west-1.aliyuncs.com/2059/1374335278223.png';
        // getEditData(1);
        // getPixels2('1');
        // $scope.$emit('pod-to-father', {img: $scope.frontShowImgSrc});

        var length = 400;
        var comWidth, comHeight;

        function getEditData (flag1, flag2) {
            // flag 1-正面 0-背面
            var r, g, b, a, xMax, xMin, yMax, yMin;
            var imgsrc,temXs, temCvs, temCtx, temPosiArr;
            if (flag1) {
                imgsrc = $scope.frontEditImgSrc;
                temPosiArr = $scope.posiArrFront;
            } else {
                imgsrc = $scope.backEditImgSrc;
                temPosiArr = $scope.posiArrBack;
            }   
            if (flag2) {
                if (flag1) {
                    temCvs = fronteditCvsShow;
                    temCtx = fronteditCtxShow;
                } else {
                    temCvs = backeditCvsShow;
                    temCtx = backeditCtxShow;
                }
            } else {
                if (flag1) {
                    temCvs = fronteditCvs;
                    temCtx = fronteditCtx;
                } else {
                    temCvs = backeditCvs;
                    temCtx = backeditCtx;
                }
            }
            console.log(temCtx)
            downloadedImg = new Image;
            downloadedImg.crossOrigin = "Anonymous";
            downloadedImg.addEventListener("load", imageReceived, false);
            downloadedImg.src = imgsrc + '?time=' + new Date().getTime();
            function imageReceived() {
                console.dir(this);
                if (this.width / this.height > 1) {
                    comWidth = 400;
                    comHeight = Math.floor(this.height / this.width * comWidth);
                } else {
                    comHeight = 400;
                    comWidth = Math.floor(this.width / this.height * comHeight);
                }
                temCvs.width = comWidth;
                temCvs.height = comHeight;
                temCtx.clearRect(0, 0, comWidth, comHeight);
                temCtx.drawImage(this, 0, 0, comWidth, comHeight);
                // 获取像素信息数据
                temXs = temCtx.getImageData(0, 0,comWidth,comHeight);
                console.log(temXs);
                emptyIndexArrFront = [];
                var xArr = [];
                var yArr = [];
                var realIndex;
                for (var index = 0; index < temXs.data.length; index += 4) {
                    r = temXs.data[index];
                    g = temXs.data[index + 1];
                    b = temXs.data[index + 2];
                    a = temXs.data[index + 3];
                    if (r==0 && g==0 && b==0 && a==0) {
                        realIndex = index / 4;
                        emptyIndexArrFront.push(index);
                        xArr.push(realIndex%comWidth)
                        yArr.push(Math.floor(realIndex/comWidth))
                    }
                    // posiArr.push([r,g,b,a]);
                }
                function sortNumber(a,b){
                    return a - b
                }
                // console.log(xArr)
                // console.log(yArr)
                xArr.sort(sortNumber);
                yArr.sort(sortNumber);
                // console.log(xArr)
                // console.log(yArr)
                xMax = xArr[xArr.length - 1]+2;
                xMin = xArr[0]-1;
                yMax = yArr[yArr.length - 1]+2;
                yMin = yArr[0]-1;
                temPosiArr = [xMin, yMin, xMax-xMin, yMax-yMin];
                console.log(temPosiArr);
                temCtx.fillStyle = "rgba(0,255,0,0.2)";
                temCtx.fillRect(xMin, yMin, xMax-xMin, yMax-yMin);
                // put数据
                // contextResultBack.putImageData(imgDataResultBack, 0, 0);
            }
        }

        function createReader (file, whenReady) {
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

        var dingzhiW,dingzhiH;
        $scope.upLoadImg2 = function (files, flag) {
            console.log(files[0])
            createReader(files[0], function (w, h) {
                // if (w==h & w > 600) {
                    if (dingzhiW && w!=dingzhiW) {
                        layer.msg('所有展示图片和定制图片需保持尺寸一致，刚刚上传的图片尺寸为'+ dingzhiW + 'x' + dingzhiH);
                        if (flag == 'front1') {
                            $('#front-show-img').val('');
                        }
                        if (flag == 'front2') {
                            $('#front-edit-img').val('');
                        }
                        if (flag == 'back1') {
                            $('#back-show-img').val('');
                        }
                        if (flag == 'back2') {
                            $('#back-edit-img').val('');
                        }
                        return;
                    }
                    if (dingzhiH && h!=dingzhiH) {
                        layer.msg('所有展示图片和定制图片需保持尺寸一致，刚刚上传的图片尺寸为'+ dingzhiW + 'x' + dingzhiH);
                        if (flag == 'front1') {
                            $('#front-show-img').val('');
                        }
                        if (flag == 'front2') {
                            $('#front-edit-img').val('');
                        }
                        if (flag == 'back1') {
                            $('#back-show-img').val('');
                        }
                        if (flag == 'back2') {
                            $('#back-edit-img').val('');
                        }
                        return;
                    }
                    dingzhiW = w;
                    dingzhiH = h;
                    erp.ossUploadFile(files, function (data) {
                        console.log(data);
                        if (data.code == 0) {
                            layer.msg('上传失败');
                            if (flag == 'front1') {
                                $('#front-show-img').val('');
                            }
                            if (flag == 'front2') {
                                $('#front-edit-img').val('');
                            }
                            if (flag == 'back1') {
                                $('#back-show-img').val('');
                            }
                            if (flag == 'back2') {
                                $('#back-edit-img').val('');
                            }
                            return;
                        }
                        if (data.code == 1) {
                            layer.msg('上传成功，请等待图片加载。');
                        }
                        var result = data.succssLinks[0];
                        if (flag == 'front1') {
                            $scope.frontShowImgSrc = result;
                            $('#front-show-img').val('');
                            getPixels2('1');
                            $scope.$emit('pod-to-father', {img: result});
                            console.log('emit');
                        }
                        if (flag == 'front2') {
                            $scope.frontEditImgSrc = result;
                            $('#front-edit-img').val('');
                            getEditData(1);
                        }
                        if (flag == 'back1') {
                            $scope.backShowImgSrc = result;
                            $('#back-show-img').val('');
                            getPixels2('2');
                            $scope.$emit('pod-to-father', {img: result});
                            console.log('emit');
                        }
                        if (flag == 'back2') {
                            $scope.backEditImgSrc = result;
                            $('#back-edit-img').val('');
                            getEditData(0);
                        }
                        $scope.$apply();
                    });
                // } else {
                    // layer.msg('请上传大于600x600的正方形图');
                // }
            });
            
        }

        $scope.deletePic2 = function (flag) {
            layer.confirm('确认删除图片?', {icon: 3, title: '提示'}, function (index) {
                //do something
                if (flag == 'front1') {
                    $scope.frontShowImgSrc = null;
                }
                if (flag == 'front2') {
                    $scope.frontEditImgSrc = null;
                    fronteditCtx.clearRect(0, 0, 600, 600);
                }
                if (flag == 'back1') {
                    $scope.backShowImgSrc = null;
                }
                if (flag == 'back2') {
                    $scope.backEditImgSrc = null;
                    backeditCtx.clearRect(0, 0, 600, 600);
                }
                if (!$scope.frontShowImgSrc && !$scope.frontEditImgSrc && !$scope.backShowImgSrc && !$scope.backEditImgSrc) {
                    dingzhiW = null;
                    dingzhiH = null;
                }
                $scope.$apply();
                layer.close(index);
            });

        }

        // $scope.ticket = function() {
        // var marginL = -$('.hnj-SupportCenterWrap').width() / 2;
        // $('.hnj-SupportCenterWrap').stop().animate({
        //     left: '50%',
        //     marginLeft: marginL
        // }, 500);

        // $scope.inputStr = $('#inputstr').val();
        // Support Center 划出Ticket


        $scope.choseBasicColor = function (event) {
            // $currentLine = $(event.target).parent().parent().parent();
            // console.log($currentLine);
            // var imgsrc = $currentLine.find('.merch-variable-pic').attr('src');
            var imgsrc = $scope.frontShowImgSrc;
            if (imgsrc) {
                $scope.choseBasicColorFlag = true;
                if ($scope.basicColor) {
                    basicColorEle.value = $scope.basicColor;
                    document.getElementById('basic-color-result').style.backgroundColor = $scope.basicColor;
                }
                getPixels3(imgsrc); 
            } else {
                layer.msg('请先选择图片');
            }
        }
        $scope.goSaveBasicColor = function () {
            if (basicColorHex == '#') {
                layer.msg('请点击左侧图片选取基础色值');
                return;
            }
            $scope.choseBasicColorFlag = false;
            $scope.basicColor = basicColorHex;
            // $currentLine.find('.edit-basiccolor').val(basicColorHex);
        }
        var basicColorQuseCanvas = document.querySelector('#basic-color-quse');
        // console.log(basicColorQuseCanvas)
        var basicColorQuseContext;
        if (basicColorQuseCanvas) {
            basicColorQuseContext = basicColorQuseCanvas.getContext('2d'); 
        }
        function getPixels3(imgsrc) {
            downloadedImg = new Image;
            downloadedImg.crossOrigin = "Anonymous";
            downloadedImg.addEventListener("load", imageReceived, false);
            downloadedImg.src = imgsrc + '?time=' + new Date().getTime();
            // console.log('getPixels3');
            function imageReceived() {
                // console.log(this);
                basicColorQuseContext.clearRect(0, 0,comWidth,comHeight);
                basicColorQuseContext.drawImage(this, 0, 0,comWidth,comHeight);
                // 获取像素信息数据
                // imgData = quseContext.getImageData(0, 0,300,300);
                // imgDataOri = basicColorQuseContext.getImageData(0, 0,600,600);
                // imgDataResultFront = basicColorQuseContext.getImageData(0, 0,600,600);
            }
        }
        var basicColorEle = document.getElementById('basic-color');
        var basicColorRgbaPicker = '[0,0,0,255]';
        var basicColorHex;
        function getColor3(event) {
            var rect = this.getBoundingClientRect();
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;
            basicColorRgbaPicker = basicColorQuseContext.getImageData(x, y, 1, 1).data;
            // color输入框变化
            basicColorHex = '#';
            for (var i = 0; i < basicColorRgbaPicker.length - 1; i++) {
                var hex = basicColorRgbaPicker[i].toString(16);
                if (hex.length < 2) {
                    hex = '0' + hex;    
                }
                basicColorHex += hex;
            }
            console.log(basicColorHex)
            basicColorEle.value = basicColorHex;
            document.getElementById('basic-color-result').style.backgroundColor = basicColorHex;
        }
        basicColorQuseCanvas.addEventListener('click', getColor3);


        // 其他（备份）
        // $scope.choseImgFlag = true;
        $scope.choseImgType = 'print';
        var opeLine;
        $scope.choseVariblePic2 = function (event) {
            if (!$scope.frontShowImgSrc) {
                layer.msg('请先上传正面展示图片');
                return;
            }
            if ($scope.showBackImg && !$scope.backShowImgSrc) {
                layer.msg('请先上传背面展示图片');
                return;
            }
            opeLine = angular.element(event.currentTarget).parent().parent();
            $scope.nowcolor = opeLine.find('input[name=Color]').val();
            $scope.choseImgFlag = true;
            actFrontChange = 0;
            actBackChange = 0;
            getPixels2();
        }
        // var frontMug = document.getElementById("mug-front");
        // var backMug = document.getElementById("mug-back");
        var createCanvas = document.createElement("canvas");
        var createCtx = createCanvas.getContext("2d");
        var originalPixels = null;
        var originalPixelsBack = null;
        var currentPixels = null;
        var currentPixelsBack = null;

        /**
         * by zhangxinxu(.com)
         * 更多介绍：http://www.zhangxinxu.com/wordpress/?p=7510
         * MIT协议，可以任意复制，编辑，但需保留版权信息
        */
        var quseCanvas = document.querySelector('#canvas-quse');
        if (quseCanvas) {
           var quseContext = quseCanvas.getContext('2d'); 
        }
        // 结果canvas
        var canvasResultFront = document.querySelector('#canvas-show');
        if (canvasResultFront) {
            var contextResultFront = canvasResultFront.getContext('2d');
        }
        // 图片数据
        // var imgData = null, imgDataResultFront = null, imgDataOri=null;
        // 尺寸数据
        var w = 165, h = 165;
        var canvasBack = document.querySelector('#canvas-quse-back');
        if (canvasBack) {
            var contextBack = canvasBack.getContext('2d');
        }
        // 结果canvas
        var canvasResultBack = document.querySelector('#canvas-show-back');
        if (canvasResultBack) {
            var contextResultBack = canvasResultBack.getContext('2d');
        }
        // 图片数据
        var imgDataBack = null, imgDataResultBack = null, imgDataOriBack=null;

        // 取色
        var rgbaPicker = '[0,0,0,255]';
        // quseCanvas.addEventListener('click', getColor);
        // canvasBack.addEventListener('click', getColor);
        function getColor(event) {
            var rect = this.getBoundingClientRect();
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;
            if ($scope.choseBackImg) {
               rgbaPicker = contextBack.getImageData(x, y, 1, 1).data; 
            } else {
                rgbaPicker = quseContext.getImageData(x, y, 1, 1).data;
            }
            // color输入框变化
            var strHex = '#';
            for (var i = 0; i < rgbaPicker.length - 1; i++) {
                var hex = rgbaPicker[i].toString(16);
                if (hex.length < 2) {
                    hex = '0' + hex;    
                }
                strHex += hex;
            }
            eleColor.value = strHex;
        }

        // 后面重新写入
        var eleColor = document.getElementById('color');
        var eleTolerance = document.getElementById('tolerance');
        var eleButton = document.getElementById('huanse-button');
        var eleNewColor = document.getElementById('color-picker');

        var actFrontChange, actBackChange;

        if (eleButton && eleTolerance) {
            eleButton.onclick = function () {
                // 像素点色值
                var rgba = rgbaPicker;
                // 容差大小
                var tolerance = eleTolerance.value;

                var newColor = hexToRGB(eleNewColor.value);
                console.log(newColor);
                var newColorArr=[];
                for (var k in newColor) {
                    newColorArr.push(newColor[k]);
                }
                console.log(newColorArr);
                // 基于原始图片数据处理
                if ($scope.choseBackImg) {
                    actBackChange = 1;
                    for (var index = 0; index < imgDataOriBack.data.length; index += 4) {
                        var r = imgDataOriBack.data[index];
                        var g = imgDataOriBack.data[index + 1];
                        var b = imgDataOriBack.data[index + 2];
                        
                        if (Math.sqrt(
                            (r - rgba[0]) * (r - rgba[0]) + 
                            (g - rgba[1]) * (g - rgba[1]) + 
                            (b - rgba[2]) * (b - rgba[2])) <= tolerance
                        ) {
                            imgDataResultBack.data[index] = (newColorArr[0] + r - rgba[0]);
                            imgDataResultBack.data[index + 1] = (newColorArr[1] + g - rgba[1]);
                            imgDataResultBack.data[index + 2] = (newColorArr[2] + b - rgba[2]);
                            imgDataResultBack.data[index + 3] = imgDataOriBack.data[index + 3];
                        } else {
                            imgDataResultBack.data[index] = r;
                            imgDataResultBack.data[index + 1] = g;
                            imgDataResultBack.data[index + 2] = b;
                            imgDataResultBack.data[index + 3] = imgDataOriBack.data[index + 3];
                        }
                    }
                    // put数据
                    contextResultBack.putImageData(imgDataResultBack, 0, 0);

                } else {
                    actFrontChange = 1;
                    for (var index = 0; index < imgDataOri.data.length; index += 4) {
                        var r = imgDataOri.data[index];
                        var g = imgDataOri.data[index + 1];
                        var b = imgDataOri.data[index + 2];
                        
                        if (Math.sqrt(
                            (r - rgba[0]) * (r - rgba[0]) + 
                            (g - rgba[1]) * (g - rgba[1]) + 
                            (b - rgba[2]) * (b - rgba[2])) <= tolerance
                        ) {
                            // imgDataResultFront.data[index] = 0;
                            // imgDataResultFront.data[index + 1] = 0;
                            // imgDataResultFront.data[index + 2] = 0;
                            // imgDataResultFront.data[index + 3] = 0;
                            imgDataResultFront.data[index] = (newColorArr[0] + r - rgba[0]);
                            imgDataResultFront.data[index + 1] = (newColorArr[1] + g - rgba[1]);
                            imgDataResultFront.data[index + 2] = (newColorArr[2] + b - rgba[2]);
                            imgDataResultFront.data[index + 3] = imgDataOri.data[index + 3];
                        } else {
                            imgDataResultFront.data[index] = r;
                            imgDataResultFront.data[index + 1] = g;
                            imgDataResultFront.data[index + 2] = b;
                            imgDataResultFront.data[index + 3] = imgDataOri.data[index + 3];
                        }
                    }
                    // put数据
                    contextResultFront.putImageData(imgDataResultFront, 0, 0);
                }
                
            };
        }

        
        angular.element('#color-picker').on('change', function () {
            console.log('change color');
            // changeColor(angular.element('#color-picker').val());
        });
        $scope.selectImg = function (item, flag) {
            if (flag=='front') {
                $scope.seleFrontImg = item;
            }
            if (flag=='back') {
                $scope.seleBackImg = item;
            }
        }
        $scope.changeFace = function (flag) {
            if (flag=='front') {
                $scope.choseBackImg = false;
            }
            if (flag=='back') {
                $scope.choseBackImg = true;
            }
            // angular.element(eleButton).trigger('click');
            // if (angular.element('#color-picker').val() != 'FFFFFF') {
            //     changeColor(angular.element('#color-picker').val());
            // }
        }
        $scope.goSaveSeleImg = function () {
            if ($scope.choseImgType=='print') {
                // console.log(canvasResultBack.toDataURL("image/png"));
                var saveNum = 0;
                var succSaveNum = 0;
                var failSaveNum = 0;
                var succSaveObj = {};
                if (actFrontChange) {
                    saveNum = saveNum + 2;
                    koutuThenSave2 (imgDataResultFront,[],function (data) {
                        console.log('正面图',data);
                        if (data.code == 1) {
                            succSaveNum++;
                            succSaveObj.frontshow = data.succssLinks[0];
                            // opeLine.find('.merch-variable-pic-back').attr('src',data.succssLinks[0]);
                        } else {
                            failSaveNum++;
                        }
                    });
                    koutuThenSave2 (imgDataResultFront,emptyIndexArrFront,function (data) {
                        console.log('扣好的正面图',data);
                        if (data.code == 1) {
                            succSaveNum++;
                            succSaveObj.frontedit = data.succssLinks[0];
                        } else {
                            failSaveNum++;
                        }
                    });
                }
                if (actBackChange) {
                    saveNum = saveNum + 2;
                    // opeLine.find('.merch-variable-pic-front').attr('src',canvasResultFront.toDataURL("image/png"));
                    koutuThenSave2 (imgDataResultBack,[],function (data) {
                        console.log('背面图',data);
                        if (data.code == 1) {
                            succSaveNum++;
                            succSaveObj.backshow = data.succssLinks[0];
                        } else {
                            failSaveNum++;
                        }
                    });
                    koutuThenSave2 (imgDataResultBack,emptyIndexArrBack,function (data) {
                        console.log('扣好的背面图',data);
                        if (data.code == 1) {
                            succSaveNum++;
                            succSaveObj.backedit = data.succssLinks[0];
                        } else {
                            failSaveNum++;
                        }
                    });
                }
                if (!actBackChange && !actFrontChange) {
                   saveNum = 0; 
                }
                if (saveNum) {
                    $scope.uploadBase64Timer = $interval(function () {
                        if (succSaveNum==saveNum) {
                            $interval.cancel($scope.uploadBase64Timer);
                            opeLine.find('.merch-variable-pic-front').attr('src',succSaveObj.frontshow);
                            opeLine.find('.merch-variable-pic-front').attr('editimg',succSaveObj.frontedit);
                            opeLine.find('.merch-variable-pic-back').attr('src',succSaveObj.backshow);
                            opeLine.find('.merch-variable-pic-back').attr('editimg',succSaveObj.backedit);
                            $scope.choseImgFlag = false;
                        } else if (succSaveNum + failSaveNum == saveNum) {
                            $interval.cancel($scope.uploadBase64Timer);
                            layer.msg('保存失败');
                        }
                    }, 100);
                }
            }
            if ($scope.choseImgType=='chose') {
                opeLine.find('.merch-variable-pic-front').attr('src',$scope.seleFrontImg.src);
                opeLine.find('.merch-variable-pic-back').attr('src',$scope.seleBackImg.src);
            }
        }

        function koutuThenSave (src,emptyIndexArr,scb) {
            downloadedImg = new Image;
            downloadedImg.crossOrigin = "Anonymous";
            downloadedImg.addEventListener("load", imageReceived, false);
            downloadedImg.src = src + '?time=' + new Date().getTime();
            // var emptyIndexArrFront;
            function imageReceived() {
                console.log(this);
                var canvas2 = document.createElement("canvas")
                var cxt2=canvas2.getContext("2d")
                canvas2.width = 600;
                canvas2.height = 600;
                cxt2.drawImage(this, 0, 0, 600, 600);
                var kouTuXs = cxt2.getImageData(0, 0,600,600);
                // console.log(kouTuXs.data);
                // console.log(emptyIndexArrFront);
                for (var i = 0; i < emptyIndexArr.length; i++) {
                    kouTuXs.data[emptyIndexArr[i]] = 0;
                    kouTuXs.data[emptyIndexArr[i]+1] = 0;
                    kouTuXs.data[emptyIndexArr[i]+2] = 0;
                    kouTuXs.data[emptyIndexArr[i]+3] = 0;
                }
                cxt2.clearRect(0, 0, 600, 600);
                cxt2.putImageData(kouTuXs,0,0,0,0,canvas2.width,canvas2.height)
                $scope.kouTuSrc = canvas2.toDataURL("image/png");
                console.log($scope.kouTuSrc)
                if (canvas2.toBlob) {
                    canvas2.toBlob(
                        function (blob) {
                            // Do something with the blob object,
                            // e.g. creating a multipart form for file uploads:
                            var formData = new FormData();
                            formData.append('file', blob);
                            blob.name = new Date().getTime() + '.png';
                            console.log(blob);
                            console.log(formData)
                            var fileList = {};
                            fileList.length = 1;
                            fileList[0] = blob;
                            erp.ossUploadFile(fileList,function(data) {
                                console.log(data);
                                scb(data);
                            })
                            /* ... */
                        },
                        'image/png'
                    );
                }
            }
        }

        function koutuThenSave2 (kouTuXs,emptyIndexArr,scb) {
            var canvas2 = document.createElement("canvas")
            var cxt2=canvas2.getContext("2d")
            canvas2.width = 600;
            canvas2.height = 600;
            // cxt2.drawImage(this, 0, 0, 600, 600);
            // var kouTuXs = cxt2.getImageData(0, 0,600,600);
            // console.log(kouTuXs.data);
            // console.log(emptyIndexArrFront);
            if (emptyIndexArr.length > 0) {
                for (var i = 0; i < emptyIndexArr.length; i++) {
                    kouTuXs.data[emptyIndexArr[i]] = 0;
                    kouTuXs.data[emptyIndexArr[i]+1] = 0;
                    kouTuXs.data[emptyIndexArr[i]+2] = 0;
                    kouTuXs.data[emptyIndexArr[i]+3] = 0;
                }
            }
            cxt2.clearRect(0, 0, 600, 600);
            cxt2.putImageData(kouTuXs,0,0,0,0,canvas2.width,canvas2.height)
            // $scope.kouTuSrc = canvas2.toDataURL("image/png");
            // console.log($scope.kouTuSrc)
            if (canvas2.toBlob) {
                canvas2.toBlob(
                    function (blob) {
                        // Do something with the blob object,
                        // e.g. creating a multipart form for file uploads:
                        var formData = new FormData();
                        formData.append('file', blob);
                        blob.name = new Date().getTime() + '.png';
                        console.log(blob);
                        console.log(formData)
                        var fileList = {};
                        fileList.length = 1;
                        fileList[0] = blob;
                        erp.ossUploadFile(fileList,function(data) {
                            console.log(data);
                            scb(data);
                        })
                        /* ... */
                    },
                    'image/png'
                );
            }
        }

    }

})(angular);