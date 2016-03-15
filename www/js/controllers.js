angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('DialoguesCtrl', function($scope, Dialogues) {
  $scope.dialogues = Dialogues.all();
})

.controller('DialogueDetailCtrl', function($scope, $stateParams, Dialogues) {
  $scope.dialogue = Dialogues.get($stateParams.dialogueId);
})

.controller('SettingCtrl', function($scope) {
})

.controller( 'actionsheetCtl',['$scope','$ionicActionSheet','$timeout' ,function($scope,$ionicActionSheet,$timeout){
    $scope.show = function() {

        var hideSheet = $ionicActionSheet.show({
            /*buttons: [
              { text: 'Move' }
            ],*/
            destructiveText: '<b>确定清除历史记录</b>',
            /*titleText: 'Modify your album',*/
            cancelText: '<b>取消</b>',
            cancel: function() {
                 // add cancel code..
               },
            buttonClicked: function(index) {
              return true;
            }
        });

        /*$timeout(function() {
            hideSheet();
        }, 2000);*/

    };  
}]);

