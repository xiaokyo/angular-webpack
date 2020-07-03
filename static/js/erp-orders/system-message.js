(function () {
  var app = angular.module('erp-service',['service']);
  app.controller('sysmessageeditctrl',['$scope','$http','erp',function ($scope,$http) {
      // var bs = new Base64();
      // alert(321)
      // $(function () {
            var yearArr =[2017,2018,2019,2020,2021,2022,2023,2024,2025];
            //var monthArr =[1,2,3,4,5,6,7,8,9,10,11,12];
            //var dateArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,
            //19,20,21,22,23,24,25,26,27,28,29,30,31];
            // 商品描述 富文本编辑器用户输入值
            // var editor = new wangEditor('editor-trigger');
            // editor.config.menus = [
            //             // '|',     // '|' 是菜单组的分割线
            //             'fontsize',
            //             'bold',
            //             'italic',
            //             'underline',
            //             'alignleft',
            //             'aligncenter',
            //             'alignright',
            //             'forecolor',
            //             'image',
            //             'link',
            //             'emoticon'
            //           ];
            // // editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
            // editor.create();
            // $scope.editorContent = editor.$txt.html();
            // alert(121)
            //给定时发送添加事件
            $('.sel-time-btn').click(function () {
                  // alert(666)
                  layer.open({
                      title: null,
                      type: 1,
                      area: ['788px', '292px'],
                      skin: 'layer-tc',
                      closeBtn: 0,
                      content: '<div class="erp-mes-tc">'
                      +  '<div class="erp-tc-top">'
                        +       '<p>定时发送</p>'
                        +'</div>'
                        +'<div class="erp-tc-mid">'
                        +      '<span class="erp-tc-tspan">选择定时发送的时间:</span>'
                        +      '<select class="erp-select-year">'
                                    
                        +      '</select>'
                        +      '<span class="erp-text-s">年</span>'
                        +      '<select class="erp-select-month"></select>'
                        +      '<span class="erp-text-s">月</span>'
                        +      '<select class="erp-select-date"></select>'
                        +      '<span class="erp-text-s">日</span>'
                        +      '<select class="erp-select-hour"></select>'
                        +      '<span class="erp-text-s">时</span>'
                        +      '<select class="erp-select-minute"></select>'
                        +      '<span class="erp-text-s">分</span>'
                        +'</div>'
                        +'<p class="erp-send-time">'
                        +      '<span class="erp-send-s1">本邮件将在</span>'
                        +      '<span class="erp-send-s2">今天</span>'
                        +      '<span class="erp-send-s2">下午3:40</span>'
                        +      '<span class="erp-send-s1">投递到对方收件箱。</span>'
                        +'</p>'
                      +'</div>',
                      btn: ['取消', '发送'],
                      success:function (layero, index) {
                         for(var i = 0;i < yearArr.length;i++){
                              $(layero).find('.erp-select-year').append("<option>"+yearArr[i]+"</option>");
                         }
                         for(var i = 1;i < 13;i++){
                              $(layero).find('.erp-select-month').append("<option>"+i+"</option>");
                         }
                         for(var i = 1;i < 32;i++){
                              $(layero).find('.erp-select-date').append("<option>"+i+"</option>");
                         }
                         for(var i = 1;i < 61;i++){
                              $(layero).find('.erp-select-hour').append("<option>"+i+"</option>");
                         }
                         for(var i = 1;i < 61;i++){
                              $(layero).find('.erp-select-minute').append("<option>"+i+"</option>");
                         }
                      },
                      yes: function(index, layero){
                          layer.close(index);
                        },
                      btn2: function(index, layero){
                          
                          return false //开启该代码可禁止点击该按钮关闭
                        }
                  })
            })
                
      // })

  }])
})()