angular.module('starter.controllers', [])

    .controller('DashCtrl', function ($scope) {
        $scope.hideLogo = function(){
            $scope.logoHide = true;
        };
        $scope.showLogo = function(){
            $scope.logoHide = false;
        };
        $scope.loadMore = function(){
            //$scope.$broadcast().scroll.__finishInfiniteScroll;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }
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
                buttonClicked: function (index) {
                    return true;
                }
            });

            /*$timeout(function() {
             hideSheet();
             }, 2000);*/

        };
    }]);

