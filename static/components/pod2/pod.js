(function (angular) {

    angular.module('merchandise')
        .component('podMerchandise2', {
            templateUrl: 'static/components/pod2/pod.html',
            controller: podMerchandiseCtrl,
            bindings: {
                podarray: '=',
                showdetail: '=',
                type: '=',
                onLog: '&',
                showWorkOrder: '&',
                from: '=',
                podimg:'='
            }
        });


    function podMerchandiseCtrl($scope, erp,$routeParams) {
        $scope.from = this.from; //在哪个页面使用
        var canvas = this.__canvas = new fabric.Canvas('canvasImg');
        canvas.lockScalingX = canvas.lockScalingY = true;
        var that = this;
        var addArea = ""; //定制区域图形
        $scope.isLoad = false; //加载中
        $scope.isEdit = false; //当前是否为编辑模式
        $scope.imgHtml; //定制区域图形展示
        $scope.chooseIndex = ""; //当前编辑的item
        $scope.chooseChildIndex = ""; //当前编辑的子集item
        $scope.isShowImgbox = false;//是否显示图片选择
        $scope.colorListChange = [];
        $scope.productType=$routeParams.type||$routeParams.mType;//为3时，是个性包装进入
        console.clear();
        console.log($routeParams)
        that.podarray;
        //定制区域弹出框数据对象
        $scope.custom = {
            areaName: "", //区域名称
            areaNameEn: "",
            img: "",
            imgicon: "",
            podType: "2", //定制区域类型
            fontSize: 12,
            fontSpace: 0,
            scaleX: 1,
            scaleY: 1,
            angle: 0,
            areaType: 1,
            left: 250,
            top: 250,
            type: "", //定制区域类型
            typeName: "", //定制区域类型名称
            backImgList: [], //背景图片
            fscaleX:1,
            fscaleY:1,
            fangle:0,
            fleft: 250,
            ftop: 250,
        };
        $scope.areaList = []; //定制区域列表
        if (Array.isArray(this.podarray)) {
            $scope.areaList = [...that.podarray];
        }
        if($scope.productType==3){//当前为个性包装商品时
            $scope.custom.podType = "3";
            $scope.custom.type = "Text";
        }else{
            if ($scope.areaList.length == 0) {
                $scope.custom.areaName = "Simplified Overall";
                $scope.custom.podType = "2";
                $scope.custom.type = "Picture";
            } else {
                $scope.custom.areaName = "";
                $scope.custom.podType = "1";
                $scope.custom.type = "Text";
            }
        }
        
        //定制区域图形列表
        $scope.graphicsList = [{
            type: 1,
            isShow: true,
        }, {
            type: 2,
            isShow: false,
        }, {
            type: 3,
            isShow: false,
        }, {
            type: 4,
            isShow: false,
        }, {
            type: 5,
            isShow: false,
        }, {
            type: 6,
            isShow: false,
        }]
        $scope.uploadImg = 'file';
        // 定制区域图片上传
        $scope.upLoadCustomImg = function (files) {
            $scope.uploadImg = 'text';
            $scope.$apply();
            createReader(files[0], function (width, height) {
                imgWidth = width;
                imgHeight = height;
                erp.ossUploadFile(files, function (data) {
                    if (data.succssLinks) {
                        $scope.imgHtml = "";
                        $scope.custom.img = data.succssLinks[0];
                        drawArea();
                        $scope.$apply();
                    }
                    $scope.uploadImg = 'file';
                });
            });
        }
        // 定制区域素材图片上传
        $scope.upLoadCustomIconImg = function (files) {
            $scope.uploadImg = 'text';
            $scope.$apply();
            createReader(files[0], function (width, height) {
                imgWidth = width;
                imgHeight = height;
                erp.ossUploadFile(files, function (data) {
                    if (data.succssLinks) {
                        $scope.imgHtml = "";
                        $scope.custom.imgicon = data.succssLinks[0];
                        $scope.uploadImg = 'file';
                        $scope.$apply();
                    }
                });
            });
        }
        // 定制区域选择区域图形chooseArea
        $scope.chooseArea = function (type, index) {
            if ($scope.custom.img) {
                $scope.custom.areaType = type;
                var ochild = $scope.graphicsList;
                for (let i = 0; i < ochild.length; i++) {
                    $scope.graphicsList[i].isShow = false;
                };
                $scope.graphicsList[index].isShow = true;
                areaDate(type);
                drawArea();
                canvas.requestRenderAll();
            } else {
                layer.msg("请先上传图片");
            }
        }
        //画区域
        function drawArea() {
            var activeObj = {
                hasBorders: true,
                transparentCorners: false,
                borderColor: "#F9AE08",
                cornerColor: "#fff",
                cornerStrokeColor: "#F9AE08",
                cornerSize: 10
            }

            if (canvas.item(0)) {
                canvas.remove(canvas.item(0));
                if (canvas.item(0)) {
                    canvas.remove(canvas.item(0));
                }
            }
            if ($scope.custom.podType == 5) {
                var oText = new fabric.Text("默认文字", {
                    fontSize: $scope.custom.fontSize,
                    fill: "#000",
                    left: $scope.custom.fleft?$scope.custom.fleft:250,
                    top: $scope.custom.ftop?$scope.custom.ftop:250,
                    originX: 'center',
                    originY: 'center',
                    scaleX:$scope.custom.fscaleX?$scope.custom.fscaleX:1,
                    scaleY:$scope.custom.fscaleY?$scope.custom.fscaleY:1,
                    angle:$scope.custom.fangle?$scope.custom.fangle:0
                });
                canvas.add(oText);
                canvas.add(addArea).setActiveObject(addArea);
                canvas.item(0).set(activeObj);
                canvas.item(1).set(activeObj);
            } else if ($scope.custom.podType != 2) {
                canvas.add(addArea).setActiveObject(addArea);
                canvas.item(0).set(activeObj);
            }

            if ($scope.custom.podType == 2 || $scope.custom.podType == 4 || $scope.custom.podType == 5) {
                var showImg = canvas.toDataURL("image/jpg");
                $scope.imgHtml = showImg;
            }
            canvas.requestRenderAll();
        }
        // 获取区域图形操作数据
        canvas.on('mouse:up', function (options) {
            if (options.target) {
                if(options.target.hasOwnProperty('text')){
                    $scope.custom.fscaleX = options.target.scaleX;
                    $scope.custom.fscaleY = options.target.scaleY;
                    $scope.custom.fangle = options.target.angle;
                    $scope.custom.fleft = options.target.left;
                    $scope.custom.ftop = options.target.top;
                }else{
                    $scope.custom.scaleX = options.target.scaleX;
                    $scope.custom.scaleY = options.target.scaleY;
                    $scope.custom.angle = options.target.angle;
                    $scope.custom.left = options.target.left;
                    $scope.custom.top = options.target.top; 
                }
                var showImg = canvas.toDataURL("image/jpg");
                $scope.imgHtml = showImg;
            }
        });
        // 弹出框字体减少操作
        $scope.reduceFont = function (type) {
            if (type == 'size') {
                if (parseInt($scope.custom.fontSize) == 12) {
                    return;
                }
                $scope.custom.fontSize = parseInt($scope.custom.fontSize) - 1;
            } else if (type == 'space') {
                $scope.custom.fontSpace = parseInt($scope.custom.fontSpace) - 1;
            }

        }
        // 弹出框字体增加操作
        $scope.addFont = function (type) {
            if (type == 'size') {
                $scope.custom.fontSize = parseInt($scope.custom.fontSize) + 1;
            } else if (type == 'space') {
                $scope.custom.fontSpace = parseInt($scope.custom.fontSpace) + 1;
            }

        }
        $scope.fontBlur = function () {
            if (parseFloat($scope.custom.fontSize) < 12) {
                $scope.custom.fontSize = 12;
            }
        }
        $scope.fontChange = function (val) {
            if (val == 'size') {
                $scope.custom.fontSize = $scope.custom.fontSize.replace(/[^\d]/g, "");
            } else if ("space") {
                $scope.custom.fontSpace = $scope.custom.fontSpace.replace(/[^\d]/g, "");
            }
        }
        // 定制区域区域类型修改
        $scope.changeType = function (val) {
            areaDate($scope.custom.areaType);
            if (canvas.item(1)) {
                canvas.remove(canvas.item(1));
            }
            if (val == 2) { //当前为简化全局时
                $scope.custom.areaName = "Simplified Overall";
                $scope.custom.type = "Picture";
                $scope.custom.typeName = "简化全局";
                canvas.discardActiveObject();
                var showImg = canvas.toDataURL("image/jpg");
                $scope.imgHtml = showImg;
            } else {
                if ($scope.custom.areaName == "Simplified Overall") {
                    $scope.custom.areaName = "";
                }
                var type = "";
                var typeName;
                switch (val) {
                    case '1':
                        type = "Text";
                        typeName = "简化文字";
                        break;
                    case '2':
                        type = "Picture";
                        typeName = "简化全局";
                        break;
                    case '3':
                        type = "Text";
                        typeName = "文字";
                        break;
                    case '4':
                        type = "Picture";
                        typeName = "图片";
                        break;
                    case '5':
                        type = "Picture and Text";
                        typeName = "图片+文字";
                        break;
                }
                $scope.custom.type = type;
                $scope.custom.typeName = typeName;
                if ($scope.custom.img) {
                    drawArea();
                }
            }
            canvas.requestRenderAll();
        }
        $scope.saveFun = function () {
            if (!$scope.custom.areaName) {
                layer.msg("请填写区域名称");
                return false;
            } else if (canvas.toObject().objects.length ==0 && $scope.custom.podType != 2) {
                layer.msg("请选择区域类型");
                return false;
            } else if ($scope.custom.img == "") {
                layer.msg("请上传图片");
                return false;
            } else if (!$scope.custom.imgicon && $scope.custom.podType == 2) {
                layer.msg("请上传素材图片");
                return false;
            } else {
                if (!$scope.isEdit) {
                    $scope.areaList.push($scope.custom);
                } else {
                    $scope.areaList.splice($scope.chooseIndex, 1, $scope.custom);
                }
                $scope.$on('to-pod', function (d, data) {
                    if (data == 'getdata') {
                        that.podarray = $scope.areaList;
                    }
                });
                $scope.showCustom = false;
                $scope.isEdit = false;
            }
        }
        // 新增定制区域
        $scope.addNewArea = function () {
            if ($scope.areaList.length > 8) {
                layer.msg("最多只支持8个定制区域");
            } else {
                if ($scope.areaList.length > 0 && $scope.areaList[0].podType == 2) {
                    layer.msg("全局区域只允许新增一个");
                } else {
                    $scope.showCustom = true;
                    $scope.imgHtml = "";
                    $scope.custom = {
                        areaName: "",
                        areaNameEn: "",
                        type: "",
                        img: "",
                        podType: "",
                        fontSize: 12,
                        fontSpace: 0,
                        scaleX: 1,
                        scaleY: 1,
                        angle: "",
                        areaLength: "",
                        areaWidth: "",
                        left: 250,
                        top: 250,
                        areaType: 1,
                        type: "",
                        backImgList: []
                    };
                    //有区域列表添加
                    if ($scope.areaList.length > 0) {
                        $scope.colorListChange = [];
                        let backImgList = $scope.areaList[0].backImgList;
                        if (backImgList.length > 0) { //当前有颜色的时候
                            for (let i = 0; i < backImgList.length; i++) {
                                var backObj = {
                                    imgsrc: "",
                                    color: backImgList[i].color
                                }
                                $scope.custom.backImgList.push(backObj);
                                $scope.colorListChange.push(backImgList[i].color);
                            }
                        }
                        $scope.custom.areaName = "";
                        $scope.custom.type = "Text";
                        if($scope.productType==3){
                            $scope.custom.podType = "3";
                            $scope.custom.typeName = "文字";
                        }else{
                            $scope.custom.podType = "1";
                            $scope.custom.typeName = "简化文字";
                        }
                    } else {
                        if ($scope.colorListChange.length > 0) {
                            for (let i = 0; i < $scope.colorListChange.length; i++) {
                                var backObj = {
                                    imgsrc: "",
                                    color: $scope.colorListChange[i]
                                }
                                $scope.custom.backImgList.push(backObj);
                            }
                        }
                        
                        if($scope.productType==3){
                            $scope.custom.areaName = "";
                            $scope.custom.podType = "3";
                            $scope.custom.type = "Text";
                            $scope.custom.typeName = "文字";
                        }else{
                            $scope.custom.areaName = "Simplified Overall";
                            $scope.custom.podType = "2";
                            $scope.custom.type = "Picture";
                            $scope.custom.typeName = "简化全局";
                        }
                    }
                    //将数据重绘
                    var ochild = $scope.graphicsList;
                    for (let i = 0; i < ochild.length; i++) {
                        $scope.graphicsList[i].isShow = false;
                    };
                    $scope.graphicsList[0].isShow = true;
                    areaDate(1);
                }
            }
        }
        $scope.upLoadItemImg = function (files) {
            for (let i = 0; i < files.length; i++) {
                if (files[i].size / 1024 / 1024 / 20 > 20) {
                    layer.msg(files[i].name + "超过限定尺寸20m");
                    return;
                }
            }
            erp.ossUploadFile(files, function (data) {
                if(data.succssLinks){
                    $scope.areaList[$scope.chooseIndex].backImgList[$scope.chooseChildIndex].imgsrc = data.succssLinks[0];
                    $scope.$apply();
                    $scope.$on('to-pod', function (d, data) {
                        if (data == 'getdata') {
                            that.podarray = $scope.areaList;
                        }
                    });
                }else{
                    layer.closeAll();
                }
            });
        }
        // 获取当前编辑的区域item
        $scope.getChooseIndex = function (index, childIndex) {
            $scope.chooseIndex = index;
            $scope.chooseChildIndex = childIndex;
        }
        //重新编辑当前区域
        $scope.editFun = function (index) {
            $scope.imgHtml = "";
            canvas.clear().renderAll();
            $scope.chooseIndex = index;
            $scope.showCustom = true;
            $scope.custom = deepClone($scope.areaList[index]);
            console.log($scope.custom)
            $scope.isEdit = true;
            //将数据重绘
            var ochild = $scope.graphicsList;
            for (let i = 0; i < ochild.length; i++) {
                $scope.graphicsList[i].isShow = false;
            };
            let areaIndex = $scope.custom.areaType - 1;
            $scope.graphicsList[areaIndex].isShow = true;
            areaDate($scope.custom.areaType);
            drawArea();
        }
        //深拷贝
        function deepClone(obj) {
            if (!isObject(obj)) {
                throw new Error("不是一个对象")
            }
            let isArray = Array.isArray(obj);
            let cloneArr = isArray ? [] : {};
            for (let key in obj) {
                cloneArr[key] = isObject(obj[key]) ? deepClone(obj[key]) : obj[key];
            }
            return cloneArr;
        }
        function isObject(val) {
            return val != null && typeof val === 'object' && Array.isArray(val) === false;
        };
        //删除当前区域
        $scope.delFun = function (index) {
            $scope.areaList.splice(index, 1);
            $scope.$on('to-pod', function (d, data) {
                if (data == 'getdata') {
                    that.podarray = $scope.areaList.length==0?'':$scope.areaList;
                }
            });
        }
        // 区域类型选择
        function areaDate(val) {
            val = parseInt(val);
            var path;
            var areaObj = {
                width: 100,
                height: 100,
                radius: 50,
                fill: '',
                scaleY: $scope.custom.scaleY,
                scaleX: $scope.custom.scaleX,
                left: $scope.custom.left,
                top: $scope.custom.top,
                angle:$scope.custom.angle,
                originX: 'center',
                originY: 'center',
                stroke: "#f70",
                strokeWidth: 0.5,
                strokeDashArray: [3, 1]
            }
            switch (val) {
                case 3:
                    path = "m0,59l30,-60l30,60-59,0z";
                    break;
                case 4:
                    path = "m0,19l22,0l7,-20l7,20l23,0l-18,13l7,22l-18,-13l-18,13l7,-22l-18,-13z";
                    break;
                case 5:
                    path = "m2,21l30,-21l28,21l-11,35l-36,0l-11,-35l1,-0.5z";
                    break;
                case 6:
                    path = "m30,18c11,-33 56,0 0,42c-56,-42 -11,-75 0,-42z";
                    break;
            }
            if (val == 1) {
                areaObj.scaleX = $scope.custom.scaleX ? $scope.custom.scaleX : 1;
                areaObj.scaleY = $scope.custom.scaleY ? $scope.custom.scaleY : 1;
                addArea = new fabric.Rect(areaObj);
            } else if (val == 2) {
                areaObj.scaleX = $scope.custom.scaleX ? $scope.custom.scaleX : 1;
                areaObj.scaleY = $scope.custom.scaleY ? $scope.custom.scaleY : 1;
                addArea = new fabric.Circle(areaObj);
            } else {
                areaObj.scaleX = $scope.custom.scaleX ? $scope.custom.scaleX : 2;
                areaObj.scaleY = $scope.custom.scaleY ? $scope.custom.scaleY : 2;
                areaObj.strokeWidth = 0.5;
                $scope.custom.path = path;
                addArea = new fabric.Path(path);
                addArea.set(areaObj)
            }
        }
        $scope.numberInput = function (val) {
            if (val == 'width') {
                $scope.custom.areaWidth = $scope.custom.areaWidth.replace(/[^\d.]/g, "");
            } else if (val == 'length') {
                $scope.custom.areaLength = $scope.custom.areaLength.replace(/[^\d.]/g, "");
            }
        }
        //父级颜色及其其他变量
        $scope.$on('to-design-child', function (d, data) {
            $scope.colorListChange = [];
            var areaL = $scope.areaList;
            //读取color列表
            for (let i = 0; i < data.length; i++) {
                if (data[i].nameEn == 'Color') {
                    $scope.colorListChange = [...data[i].banOpeArr];
                }
            }
            console.log($scope.colorListChange)
            if (areaL.length > 0) {
                let imgLen = areaL[0].backImgList.length;
                //每一个定制区域循环赋值
                if (areaL.length > 0) { //已添加过区域
                    for (let i = 0; i < areaL.length; i++) {
                        $scope.areaList[i].backImgList.splice(0, imgLen);
                        for (let j = 0; j < $scope.colorListChange.length; j++) {
                            let colorObj = {
                                imgsrc: "",
                                color: $scope.colorListChange[j]
                            }
                            $scope.areaList[i].backImgList.push(colorObj);
                        }
                    }
                }
            }

        });
        $scope.upLoadAreaItemImg = (index,childIndex)=>{
            $scope.imgList = that.podimg;
            console.log($scope.imgList)
            if(!$scope.imgList||$scope.imgList.length==0){
                return layer.msg('请先上传图片！');
            }
            $scope.isShowImgbox=true;
            $scope.chooseIndex = index;
            $scope.chooseChildIndex = childIndex;
        }
        $scope.chooseAreaImg = item=>{
            $scope.imgList.forEach(_i=>{
                if(item.src!=_i.src){
                    _i.check=false;
                }
            });
            item.check = !item.check;
        }
        $scope.saveAreaImg = ()=>{
            let checkArr = $scope.imgList.filter(item=>{
                if(item.check){
                    return item;
                }
            })
            if(checkArr.length==0){
                layer.msg('请选择对应图片！')
            }else{
                $scope.areaList[$scope.chooseIndex].backImgList[$scope.chooseChildIndex].imgsrc = checkArr[0].src;
                $scope.$on('to-pod', function (d, data) {
                    if (data == 'getdata') {
                        that.podarray = $scope.areaList;
                    }
                });
                $scope.isShowImgbox=false;
            }

        }
    }
    //上传图片处理
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
})(angular);