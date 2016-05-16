angular.module('starter.controllers', [])

    .controller('DashCtrl', function($scope,$ionicPopup,ServerData) {
        $scope.model = {message:""};
	    $scope.translate = {message:""};
	    $scope.hideLogo = function(){
		    $scope.logoHide = true;
		    $scope.hasTranslate = false;
	    };
        $scope.showLogo = function(){
            $scope.logoHide = false;
        };
    	$scope.close = function(){
            $scope.model.message = "";
    		$scope.logoHide = false;
    		$scope.hasTranslate = false;
    	};
    	$scope.loadMore = function(){
    	    $scope.$broadcast('scroll.infiniteScrollComplete');
    	};
    	$scope.clear = function(){
    		$scope.model.message = "";
    		$scope.hasTranslate = false;
    		//$scope.close();
    	};
    	$scope.translate = function(){
    		if($scope.model.message.trim() == ''){
    			ServerData.alert('翻译内容不能为空。');
    		}else{
                $scope.translate.message = $scope.model.message;
                //$scope.model.message = "";
                $scope.hasTranslate = true;
                //$scope.logoHide = false;
            };

    	};
    	$scope.resub = function(){
    		$scope.hasTranslate = false;
    	};
    })

    .controller('ChatsCtrl', function ($scope, chatService) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.chats = chatService.all();
        $scope.remove = function (chat) {
            chatService.remove(chat);
        };
    })

    .controller('ChatDetailCtrl', function ($scope, $stateParams, chatService) {
        $scope.chat = chatService.get($stateParams.chatId);
    })

    .controller('DialoguesCtrl', function ($http, $scope, DialogueService) {
        DialogueService.all().success(function (response) {
            DialogueService.setDia(response.results);
            $scope.dialogues = response.results;
        }).error(function () {

        });
    })

    .controller('DialogueDetailCtrl', function ($scope, $stateParams, DialogueService, $timeout) {
        $scope.dialogue = DialogueService.get($stateParams.dialogueId);
        $scope.details = $scope.dialogue.subList;

        var audio = document.getElementById('fr').contentWindow.document.getElementById('audio');
        audio.addEventListener('play', function () {
            $scope.$apply(function () {
                $scope.details[$scope.detail_subid].playing = true;
            })
        }, false);
        audio.addEventListener('ended', function () {
            $scope.$apply(function(){
                $scope.details[$scope.detail_subid].playing = false;
            })
        }, false);
        $scope.playfor = function (id, subAudio) {
            $scope.detail_subid = id;
            audio.src = subAudio;
            audio.play();
        };
        $scope.speedUp = function () {

        };
        $scope.speedDown = function () {

        };


    })

.controller('YuyinCtrl', function($scope,$ionicSideMenuDelegate) {
	//console.log("yuyin controll");
})

.controller('SpeakCtrl', function($scope, $ionicSideMenuDelegate) {
	 /*$scope.toggleLeft = function() {
	        $ionicSideMenuDelegate.toggleLeft();
	      };*/
	
	console.log("SpeakCtrl");
})

    .controller('SettingCtrl', function ($scope) {
    })

    .controller('actionsheetCtl', ['$scope', '$ionicActionSheet', '$timeout', function ($scope, $ionicActionSheet, $timeout) {
        $scope.show = function () {

            var hideSheet = $ionicActionSheet.show({
                /*buttons: [
                 { text: 'Move' }
                 ],*/
                destructiveText: '<b>确定清除历史记录</b>',
                /*titleText: 'Modify your album',*/
                cancelText: '<b>取消</b>',
                cancel: function () {
                    // add cancel code..
                },
                destructiveButtonClicked: function () {
                	console.log("delete historys.");
            	    return true;
                },
                buttonClicked: function (index) {
                    return true;
                }
            });

            /*$timeout(function() {
             hideSheet();
             }, 2000);*/

        };
    }]);

