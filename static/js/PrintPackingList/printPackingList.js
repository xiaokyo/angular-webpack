(function () {
    var app = angular.module('PrintPackingList', ['service']);
    app.controller('PrintPackingListCtrl', ['$scope', 'erp', '$sce', '$http', function ($scope, erp, $sce, $http) {
        function ready() {
            $('.yundanhao').focus();
            $scope.form = {
                No: '',
                OriginalWarehouse: '',
                DestinatonWarehouse: '',
                ShipDate: '',
                ShippingCompany: '',
                Quantity: '',
                TrackingNumber: '',
                TransferNumber: ''
            };
            $scope.formArr = [];
        }

        ready();
        $scope.isHttp = false;
        $scope.saomiao = function (e) {
            if (e.which == 13) {
            /*    $scope.formArr = [1,2,3,4,5,6]
                $scope.tepArr1 = [];
                $scope.tepArr2 = [];
                $scope.formArr.forEach(function (o,i) {
                    if(i < 2){
                        $scope.tepArr1.push(o);
                    }else {
                        $scope.tepArr2.push(o);
                    }
                })
                $scope.tepArr2 = sliceArray($scope.tepArr2, 3);
                console.log($scope.tepArr1)
                console.log($scope.tepArr2)*/
                getList();
            }
        }
        function getList() {
            layer.load(2);
            $scope.isHttp = false;
            erp.postFun('app/dispatcherTask/getZhuanXiangDanInfo', {
                'trackingNumber': $('.yundanhao').val(),
            }, function (res) {
                layer.closeAll('loading');
                if (res.data.code == 'CODE_200') {
                    layer.closeAll('loading');
                    $scope.isHttp = true;
                    var data = res.data.parcel;
                    $scope.form = {
                        No: data.parcelNumber,
                        OriginalWarehouse: data.originalWarehouse,
                        DestinatonWarehouse: data.arrivedWarehouse,
                        ShipDate: data.shipDate,
                        ShippingCompany: data.forwarderName,
                        Quantity: data.quantity,
                        TrackingNumber: data.tracking_number,
                        TransferNumber: data.transfer_number
                    };
                    $scope.formArr = data.skuList;
                    console.log($scope.formArr)
                    $scope.tepArr1 = [];
                    $scope.tepArr2 = [];
                    $scope.formArr.forEach(function (o,i) {
                        if(i < 2){
                            $scope.tepArr1.push(o);
                        }else {
                            $scope.tepArr2.push(o);
                        }
                    })
                    $scope.tepArr2 = sliceArray($scope.tepArr2, 4);
                    console.log($scope.tepArr1)
                    console.log($scope.tepArr2)
                    $scope.renderFinish = function () {
                        var img = $('img');
                        var n = 0;
                        for (var i = 0; i < img.length; i++) {
                            img[i].onload = function (e) {
                                e.stopPropagation();
                                n++;
                                if (n == img.length) {
                                    doPrint1();
                                }
                            }
                        }
                    }

           /*         if($scope.tepArr2.length>1){
                        $scope.renderFinish = function () {
                            var img = $('img');
                            var n = 0;
                            for (var i = 0; i < img.length; i++) {
                                img[i].onload = function (e) {
                                    e.stopPropagation();
                                    n++;
                                    if (n == img.length) {
                                        doPrint();
                                    }
                                }
                            }
                        }
                    }else {
                        var img = $('img');
                        img[0].onload = function (e) {
                            e.stopPropagation();
                            doPrint();
                        }
                    }*/
                } else {
                    layer.msg("The shiping number can't suppose to print the pack list", {
                        time: 1500
                    })
                }
            }, function (err) {
                layer.closeAll('loading');
            });
        }
        function doPrint() {
            $('.title').hide();
            $('.yundanhao').hide();
            window.print();
            $('.title').show();
            $('.yundanhao').show();
            $('.yundanhao').val('');
            $('.yundanhao').focus();
        }

        function doPrint1() {
          /*  var bdhtml = window.document.body.innerHTML;
            var sprnstr = "<!--startprint-->"; //开始打印标识字符串有17个字符
            var eprnstr = "<!--endprint-->"; //结束打印标识字符串
            var prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 17); //从开始打印标识之后的内容
            prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr)); //截取开始标识和结束标识之间的内容
            window.document.body.innerHTML = prnhtml; //把需要打印的指定内容赋给body.innerHTML
            var html = document.getElementsByTagName('html')[0].innerHTML;
            console.log(html)
            html.replace('ng-repeat="item in tepArr"', '').replace('ng-repeat="itemc in item"', '');
            window.print(); //调用浏览器的打印功能打印指定区域
            window.document.body.innerHTML = bdhtml; // 最后还原页面*/


            var bdhtml = document.getElementsByTagName('html')[0].innerHTML;
            var a = ['<h3 class="title">打印装箱单/Print pack list</h3>'].join("");
            var b = ['<input class="yundanhao" type="text" placeholder="扫描运单号/Scan shipping pabel" ng-keypress="saomiao($event)">'].join("");
            var c = ['ng-show="isHttp"'].join("");
            bdhtml = bdhtml.replace(a, "").replace(b, "").replace(c, "").replace('<script src="static/angular-1.5.8/angular.min.js"></script>','');
            bdhtml = '<html lang="en" id="right">' + bdhtml + '</html>'
            //console.log(bdhtml)
            erp.postFun('tool/invoiceBill/downloadInvoiceBill', {htmlFile: bdhtml}, function (data) {
                console.log(data)
                if (data.data.code == 200) {
                    var url = 'https://' + data.data.pdfFile;
                    PrintCode(url)
                }
            }, function (res) {

            })
        }
        /*调用田宇宇的*/
        function PrintCode(url) {
            $.ajax({
                url: 'http://127.0.0.1:8808?number='+url,
                async: true,
                cache: false,
                dataType: 'text',
                error: function (xhr) {

                },
                success: function (data) {
                    $('.yundanhao').val('');
                    $('.yundanhao').focus();
                }
            })
        }
        function sliceArray(array, size) {
            var result = [];
            for (var x = 0; x < Math.ceil(array.length / size); x++) {
                var start = x * size;
                var end = start + size;
                result.push(array.slice(start, end));
            }
            return result;
        }
    }])
    //执行完毕执行
    app.directive('repeatFinish', function () {
        return {
            link: function (scope, element, attr) {
                console.log(scope.$index)
                if (scope.$last == true) {
                    console.log('ng-repeat执行完毕')
                    scope.$eval(attr.repeatFinish)
                }
            }
        }
    });
})()