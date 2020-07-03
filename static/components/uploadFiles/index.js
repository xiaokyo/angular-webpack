(function (angular) {

    angular.module('manage')
        .component('uploadfiles', {
            templateUrl: '/static/components/uploadFiles/index.html',
            controller: uploadFilesCtrl,
            controllerAs: 'vm',
            bindings: {
                callback: '<',// 上传后的回调
                maxSize: '<',// 最大上传个数
                id: '<', // 组件id
                initFiles: '<',// 初始展示用的文件数组
                showComponent: '<',// 是否是展示组件
            }
        })

    function uploadFilesCtrl($scope, erp, merchan, $timeout) {
        console.log('uploadFiles components')
        // $scope.certPic = []
        // $scope.MAX_SIZE = 3
        $scope.upLoadImg = function () {// 上传凭证
            let files = $('#' + $scope.id)[0].files
            uploadFile(files)
        }

        function uploadFile(files) {
            if ($scope.showComponent) return
            if ($scope.certPic.length + files.length > $scope.MAX_SIZE) return layer.msg('限制' + $scope.MAX_SIZE + '次上传')
            erp.ossUploadFile(files, function (data) {
                $('#' + $scope.id).val('');
                // console.log(data);
                if (data.code == 0) return layer.msg('上传失败');
                if (data.code == 2) layer.msg('部分上传失败。');
                if (data.code == 1) layer.msg('上传成功，请等待。');
                let result = data.succssLinks;
                for (let i = 0; i < result.length; i++) {
                    $scope.certPic.push(result[i])
                }
                $scope.$apply()
                callback()
            });
        }

        function previewPic(src) {// 预览凭证
            if (!isImage(src)) return erp.navTo(src, '_blank')
            merchan.previewPicTwo(src);
        }
        function deletePic(index) {// 删除上传凭证
            $scope.certPic.splice(index, 1);
            callback()
        }

        function callback() { // 上传成功和删除 回调
            $scope.callback && $scope.callback({ pics: $scope.certPic })
        }

        const IMG_PATH = { // 除图片需要显示的文件icon
            'xls': './static/components/uploadFiles/images/excel.png',
            'doc': './static/components/uploadFiles/images/word.png',
            'pdf': './static/components/uploadFiles/images/pdf.png',
        }

        // 获取除图片以外文件的图片显示
        function getImgUrl(url) {
            const arr = url.split('.')
            const len = arr.length
            // console.log('arr', arr)
            let endSuffix = arr[len - 1]
            // console.log('endSuffix', endSuffix)
            if (endSuffix == 'xlsx') endSuffix = 'xls'
            if (endSuffix == 'docx') endSuffix = 'doc'
            return IMG_PATH[endSuffix] || erp.getThumpPic(url)
        }

        // 是否是图片 jpg, gif, jpeg, png, jfif
        const IMG_SUFFIX_ARRAY = ['jpeg', 'png', 'gif', 'jpg', 'JPG', 'jfif']
        function isImage(url) {
            const arr = url.split('.')
            const len = arr.length
            // console.log('arr', arr)
            const endSuffix = arr[len - 1]
            return IMG_SUFFIX_ARRAY.includes(endSuffix)
        }

        // 可预览的文件格式
        const PERVIEW_SUFFIX_ARRAY = IMG_SUFFIX_ARRAY.concat(['pdf'])
        function canPerview(url) {
            const arr = url.split('.')
            const len = arr.length
            // console.log('arr', arr)
            const endSuffix = arr[len - 1]
            return PERVIEW_SUFFIX_ARRAY.includes(endSuffix)
        }

        function setOndragover() {
            const box = document.getElementById($scope.id + 'box')
            // console.log('box', box)

            document.ondrop = function (e) {
                e.preventDefault()
            }

            document.ondragover = function (e) {
                e.preventDefault()
            }

            box.ondragenter = function () {
                console.log('请释放鼠标')
            }

            box.ondragover = function () {
                return false
            }

            box.ondragleave = function () {
                console.log('拖拽区域不对')
            }

            box.ondrop = function (ev) {
                const oFile = ev.dataTransfer.files[0]
                // const reader = new FileReader()
                uploadFile([oFile])
                // reader.onload = function () {
                //     console.log('reader onload', oFile)

                // }

                // reader.onloadstart = function () {
                //     // console.log('reader start')
                // }

                // reader.onloadend = function () {
                //     // console.log('reader end')
                // }

                // reader.onabort = function () {
                //     // console.log('reader abort')
                // }

                // reader.onerror = function () {
                //     // console.log('reader fail')
                // }

                // reader.onprogress = function(ev){
                //     const scale = ev.loaded / ev.total
                //     if(scale >= 0.5){
                //         alert(1)
                //         reader.abort()
                //     }
                // }
                // reader.readAsDataURL(oFile, 'base64');
            }

        }

        $timeout(function () {
            !$scope.showComponent && setOndragover()
        }, 0)

        // 将方法加到scope
        function addScopeFun() {
            $scope.isImage = isImage
            $scope.getImgUrl = getImgUrl
            $scope.previewPic = previewPic
            $scope.deletePic = deletePic
            $scope.canPerview = canPerview
        }
        addScopeFun()

        function setCert(initFiles) {
            if (!initFiles) return $scope.certPic = []
            if (initFiles instanceof Array) {
                $scope.certPic = initFiles
            } else {
                $scope.certPic = [initFiles]
            }
        }

        // 初始化组件
        this.$onInit = function () {
            console.log('this', this)
            $scope.MAX_SIZE = this.maxSize || 5
            $scope.id = this.id || 'uploadFiles'
            $scope.callback = this.callback
            // $scope.certPic = this.initFiles
            setCert(this.initFiles)
            $scope.showComponent = this.showComponent
        }

        this.$onChanges = function (obj) {
            console.log('change', obj)
            // $scope.certPic = obj.initFiles.currentValue
            setCert(obj.initFiles.currentValue)
        }

    }
})(angular);