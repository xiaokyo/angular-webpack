(function (angular) {
	var app = angular.module('app',[]);
	app.controller('registerCtrl',['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
		$timeout(function () {
		$scope.webphoneType = 'Skype'
		var survey = {}
		// 记录单选框的值
		$scope.radioText = "";//记录单选框的值
		$('.orders-radio').click(function(){
			$('.orders-radio').attr('src','./static/image/login/radiobutton1.png');
			$(this).attr('src','./static/image/login/radiobutton2.png');
			$scope.radioText = $(this).next().text();
			survey.orderNumber = $scope.radioText || '';
			console.log(survey);
		})
		//给平台添加选中未选中状态
		survey.platforms = [];
		$('.platform input').click(function () {
			if ($(this).prop("checked")) {
				$(this).siblings('img').attr('src','./static/image/login/multiple2.png');
				survey.platforms.push($(this).siblings('span').text());
				console.log(survey);
			}else{
				$(this).siblings('img').attr('src','./static/image/login/multiple1.png');
				survey.platforms.splice($.inArray($(this).siblings('span').text(),survey.platforms),1);
				console.log(survey);
			}
		});
		//给经营类别添加选中未选中状态
		survey.markets = [];
		$('.marketing input').click(function () {
			if ($(this).prop("checked")) {
				$(this).siblings('img').attr('src','./static/image/login/multiple2.png');
				survey.markets.push($(this).siblings('span').text());
				console.log(survey);
			}else{
				$(this).siblings('img').attr('src','./static/image/login/multiple1.png');
				survey.markets.splice($.inArray($(this).siblings('span').text(),survey.markets),1);
				console.log(survey);
			}
		});
		// 验证表单
		var icon = {
	        valid: 'glyphicon glyphicon-ok',
	        invalid: 'glyphicon glyphicon-remove',
	        validating: 'glyphicon glyphicon-refresh'
	    }
		$("#registerForm").bootstrapValidator({
	        feedbackIcons: icon,   //加载图标
	        /* 生效规则
	         * enabled:字段值发生变化就触发验证
	         * disabled/submitted:点击提交时触发验证
	         */
	        live: 'enabled', 
	        //表单域配置
	        fields: {
	            user: {//username为input标签name值
	                validators: {
	                    notEmpty: {message: '请输入用户名'},    //非空提示
	                    stringLength: {    //长度限制
	                          min: 4,
	                          max: 8,
	                          message: '用户名长度必须在4到8之间'
	                    }, 
	                    regexp: {//匹配规则
	                          regexp: /^[a-zA-Z0-9_\\u4e00-\\u9fa5]+$/,  //正则表达式
	                          message:'用户名仅支持汉字、字母、数字、下划线的组合'
	                    }
	                    // ,
	                    // remote: { //ajax校验，获得一个json数据（{'valid': true or false}）
	                    //       url: 'user.php',                  //验证地址
	                    //       message: '用户已存在',   //提示信息
	                    //       type: 'POST',                   //请求方式
	                    //       data: function(validator){  //自定义提交数据，默认为当前input name值
	                    //         return {
	                    //             act: 'is_registered',
	                    //             username: $("input[name='username']").val()
	                    //         }
	                    //     }
	                    // }
	                }
	            },
	            pass: {
	                validators: {
	                   notEmpty: {message: '请输入密码'},
	                   different: {  //比较
	                        field: 'username', //需要进行比较的input name值
	                        message: '密码不能与用户名相同'
	                   },
	                   stringLength: {    //长度限制
	                          min: 6,
	                          max: 20,
	                          message: '密码太短，不安全'
	                    }
	                }
	            },
	            confirmPass: {
	                validators: {
	                    notEmpty: {message: '请再次输入密码'},
	                    identical: {  //比较是否相同
	                           field: 'pass',  //需要进行比较的input name值
	                           message: '两次密码不一致'
	                    }
	                }
	            },
	            email: {
	                validators: {
	                    notEmpty: {message: '请输入邮箱'},
	                    emailAddress: {message: '请输入正确的邮件地址'}
	                }
	            },
	            telephone: {
	            	validators: {
	            		notEmpty: {message: '请输入手机号'},
	            		regexp: {
	            			regexp: /^(13[0-9]{8}|14[57][0-9]{8}|15[012356789][0-9]{8}|17[78][0-9]{8}|18[0123456789][0-9]{8}$)/,
	            			message: '手机号格式不正确'
	            		}
	            	}
	            },
	            webphoneNum: {
	            	validators: {
	            		notEmpty: {message: '请选择类型并填写信息'}
	            	}
	            },
	            address: {
	            	validators: {
	            		notEmpty: {message: '请填写详细地址信息'}
	            	}
	            },
	            storeLink: {
	            	validators: {
	            		notEmpty: {message: '请填写店铺链接信息'}
	            	}
	            } //最后一个没有逗号
	        }
	    }).on('success.form.bv', function(e) {

				e.preventDefault();//防止表单提交

				//这里处理ajxa提交
				var registerInfo = {};
	    	registerInfo.name = $scope.firstname + ' ' + $scope.lastname;
	    	registerInfo.loginName = $scope.user;
	    	registerInfo.passwd = $scope.pass;
	    	registerInfo.email = $scope.email;
	    	registerInfo.phone = $scope.telephone;
	    	registerInfo.contactID = {};
	    	registerInfo.contactID[$scope.webphoneType] = $scope.webphoneNum;
	    	// registerInfo.contactID = JSON.stringify(registerInfo.contactID);
	    	registerInfo.country = '中国';
	    	registerInfo.address = $scope.address;
	    	registerInfo.storeLink = $scope.storeLink;
	    	// registerInfo.survey = survey;
	    	var data = {};
	    	data.data = JSON.stringify(registerInfo);
	    	console.log(JSON.stringify(data));

	      $http.post('guest', JSON.stringify(data), {
          headers : {'contentType' : 'application/json','url-mapping' : '/app/account/register'}
          }).success(function(data, status, headers, config) { 
          	var code = data.statusCode;
          	if (code != 200) {
          		console.log(data);
          		layer.msg('服务器出错啦！');
          	} else {
          		console.log(data);
          		window.location = 'register-success.html';
          	}
          }).error(function(data, status, headers, config ) {
          		layer.msg('网络错误！');
        });

		});
	    
	  },0)
		
	}])
})(angular)