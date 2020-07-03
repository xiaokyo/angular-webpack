(function(angular) {
    angular.module('manage')
        .component('podmesTk', {
            templateUrl: '/static/components/pod-mes/pod-mes.html',
            controller: podShowMesCtral,
            bindings: {
                pro: '=',
                type: '=',
                no: '=',
                plist: '=',
                sparr: '=',
                onLog: '&',
                showWorkOrder: '&'
            },
        });

    function podShowMesCtral($scope, erp) {
        var that = this;
        console.log('POD INFO coming')
        console.log(that)
        var properties = this.pro;
        var properType  = this.type;
        var spItemObj = this.plist;
        var spArrList = this.sparr;
        console.log(spArrList)
        if(properType=='order'){
            $scope.gxhOrdFlag = true;
            console.log(properties)
            var dzList = properties;
            $scope.newCusDesignArr = [];
            console.log(dzList)
            var type0Arr = [];
            var type1Arr = [];
            var type2Arr = [];
            var typeCommon = [];
            for(var i = 0,len=dzList.length;i<len;i++){
                if(dzList[i].cj_custom){
                    typeCommon.push(dzList[i])
                }else if(dzList[i].type==0){
                    type0Arr.push(dzList[i])
                }else if(dzList[i].type==1){
                    type1Arr.push(dzList[i])
                }else if(dzList[i].type==2){
                    type2Arr.push(dzList[i])
                }else if(dzList[i].type==3||dzList[i].type==4){
                    if(dzList[i].customPodDesign){
                        for(let j = 0,jLen = dzList[i].customPodDesign.length;j<jLen;j++){
                            dzList[i].customPodDesign[j]['img'] = dzList[i].customPodDesign[j].links[0];
                            $scope.newCusDesignArr.push(dzList[i].customPodDesign[j])
                        }
                    }else if(dzList[i].customDesign){
                        for(let j = 0,jLen = dzList[i].customDesign.length;j<jLen;j++){
                            dzList[i].customDesign[j]['img'] = dzList[i].customDesign[j].links[0];
                            $scope.newCusDesignArr.push(dzList[i].customDesign[j])
                        }
                    }

                }
                if((!dzList[i].type || dzList[i].type==4) && (dzList[i].image||dzList[i].text)){
                    type2Arr.push(dzList[i])
                }
            }
            console.log(type0Arr,type1Arr,type2Arr)
            if(type0Arr.length>0){
                $scope.type0Arr = type0Arr;
            }
            if(type1Arr.length>0){
                $scope.type1Arr = type1Arr;
            }
            if(type2Arr.length>0){
                $scope.type2Arr = type2Arr;
            }
            if(typeCommon.length>0){
                // 最大列数计算
                $scope.orderColspanNum = 1;
                $scope.maxIndex = 0;
                let cjContentArr = [];
                for (i = 0; i < typeCommon.length; i++) {
                    const temp = Object.keys(typeCommon[i].cj_content[0]).length;
                    if(temp>=$scope.orderColspanNum){
                        $scope.orderColspanNum = temp;
                        $scope.maxIndex = i;
                    }
                    cjContentArr.push(typeCommon[i].cj_content)
                }
                $scope.ordTableTit = typeCommon[$scope.maxIndex].cj_custom;
                $scope.typeCommon = cjContentArr.flat();
                console.log($scope.typeCommon)
            }
        }else if(properType=='product'){
            console.log(Object.prototype.toString.call(properties)=='[object String]')
            // if(Object.prototype.toString.call(properties)=='[object String]'){
            //     $scope.gxhProductFlag = true;
            // }
            $scope.gxhProductFlag = true;
            console.log(spItemObj)
            if(spItemObj){
                $scope.sku = spItemObj.sku;
            }
            console.log(properties);
            console.log(typeof properties==='string')
            if(typeof properties==='string'){
                $scope.properties = JSON.parse(properties);
            }else{
                $scope.properties = properties;
            }
            if($scope.properties.thirdPardMessage){
                if(typeof $scope.properties.thirdPardMessage=='string'){
                    try {
                        $scope.properties.thirdPardMessage = JSON.parse($scope.properties.thirdPardMessage)
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
            if(properties.cj_custom){
                $scope.colspanNum = Object.keys(properties.cj_content[0]).length
                console.log('===='+$scope.colspanNum)
            }
            //var data= JSON.parse(properties);
            $scope.newCusDesignArr = [];
            var arr=[];
            arr.push(properties);
            $scope.dzList=arr;
            try {
                if(typeof properties === "string"){
                    properties = JSON.parse(properties)
                }
                if(properties.type==3||properties.type==4){
                    console.log(properties.customMessgae)
                    if(properties.customPodDesign){
                        for(let i = 0,len = properties.customPodDesign.length;i<len;i++){
                            properties.customPodDesign[i]['img'] = properties.customPodDesign[i].links[0];
                            $scope.newCusDesignArr.push(properties.customPodDesign[i])
                        }
                    }else if(properties.customDesign){
                        for(let i = 0,len = properties.customDesign.length;i<len;i++){
                            properties.customDesign[i]['img'] = properties.customDesign[i].links[0];
                            $scope.newCusDesignArr.push(properties.customDesign[i])
                        }
                    }else if(properties.customMessgae){
                        for(let i = 0,len = properties.customMessgae.length;i<len;i++){
                            properties.customMessgae[i]['img'] = properties.customMessgae[i].backImgList[0].imgsrc;
                            $scope.newCusDesignArr.push(properties.customMessgae[i])
                        }
                    }
                    
                }else{
                    // GXSD200226637530149941
                    console.log(properties)
                }
            } catch (error) {
                console.log(error)
            }
            console.log($scope.newCusDesignArr)
        }
        $scope.tuCengFun = function(arr){
            $scope.tuCengArr = arr;
            $scope.tuCengFlag = true;
            console.log(arr)
        }
        $scope.tuCengCloseFun = function(){
            $scope.tuCengFlag = false;
        }
        $scope.closeZZC = function () {
            $scope.$emit('log-to-father', {closeFlag: false}); 
        } 

        $scope.stopProgFun = function(ev){
            ev.stopPropagation()
        }
        $scope.downLoadImg = function(link){
            var name = link.substring(link.length - 20)
            console.log(name)
            downloadPDF({ url: link, idx: 0, name: name }, function(pdf) {
                console.log(pdf)
            })
        }
        function downloadPDF(pdf, fn) {
            var mime = {
                pdf: 'application/pdf',
                png: 'image/png'
            };
            var x = new XMLHttpRequest();
            x.open("GET", pdf.url);
            x.responseType = "blob";
            x.onload = function (e) {
                console.log(pdf.name.indexOf('pdf') != -1 ? mime.pdf : mime.png)
                console.log(pdf.name, pdf.name.indexOf('pdf'))
                // download(new Blob(["hello world"]), "dlTextBlob.txt", "text/plain");
                download(e.target.response, pdf.name,
                    pdf.name.indexOf('pdf') != -1 ? mime.pdf : mime.png
                );
                fn && fn(pdf);
            };
            x.onerror = function (e) {
                console.log(e);
                layer.msg(e);
            };
            x.send();
        }
        
    }

})(angular);