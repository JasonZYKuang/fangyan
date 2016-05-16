// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','starter.nav', 'starter.services'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $ionicConfigProvider.platform.ios.tabs.style('standard');
        $ionicConfigProvider.platform.ios.tabs.position('bottom');
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('standard');

        $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
        $ionicConfigProvider.platform.android.navBar.alignTitle('left');

        $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
        $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

        $ionicConfigProvider.platform.ios.views.transition('ios');
        $ionicConfigProvider.platform.android.views.transition('android');


        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

        //setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })

            // Each tab has its own nav history stack:

            .state('tab.dash', {
                url: '/dash',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-dash.html',
                        controller: 'DashCtrl'
                    }
                }
            })

.state('tab.yuyin', {
    url: '/yuyin',
    views: {
      'tab-yuyin': {
        templateUrl: 'templates/tab-yuyin.html',
        controller: 'YuyinCtrl'
      }
    }
  })
  
            .state('tab.chats', {
                url: '/chats',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/tab-chats.html',
                        controller: 'ChatsCtrl'
                    }
                }
            })


            .state('tab.chat-detail', {
                url: '/chats/:chatId',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/chat-detail.html',
                        controller: 'ChatDetailCtrl'
                    }
                }
            })

            .state('tab.dialogues', {
                url: '/dialogues',
                views: {
                    'tab-dialogues': {
                        templateUrl: 'templates/tab-dialogues.html',
                        controller: 'DialoguesCtrl'
                    }
                }
            })
            .state('tab.dialogue-detail', {
                url: '/dialogue/:dialogueId',
                views: {
                    'tab-dialogues': {
                        templateUrl: 'templates/dialogue-detail.html',
                        controller: 'DialogueDetailCtrl'
                    }
                }
            })

            .state('tab.setting', {
                url: '/setting',
                views: {
                    'tab-setting': {
                        templateUrl: 'templates/tab-setting.html',
                        controller: 'SettingCtrl'
                    }
                }
            })

            .state('tab.help', {
                url: '/setting/help',
                views: {
                    'tab-setting': {
                        templateUrl: 'templates/help.html'
                        //controller: 'SettingCtrl'
                    }
                }
            })

            .state('tab.about', {
                url: '/setting/about',
                views: {
                    'tab-setting': {
                        templateUrl: 'templates/about.html'
                        //controller: 'SettingCtrl'
                    }
                }
            })
        ;

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/dash');

    })

    .filter('to_trusted', ['$sce', function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    }])

    .directive('hideTabs',function($rootScope){
        return {
            restrict: 'A',
            link: function($scope,$el){
                $rootScope.hideTabs = 'tabs-item-hide';
                $scope.$on('$destroy',function(){
                    $rootScope.hideTabs = '';
                });
            }
        };
    })
;
