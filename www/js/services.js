angular.module('starter.services', [])

    .factory('localStorageService', [function () {
        return {
            get: function localStorageServiceGet(key, defaultValue) {
                var stored = localStorage.getItem(key);
                try {
                    stored = angular.fromJson(stored);
                } catch (error) {
                    stored = null;
                }
                if (defaultValue && stored === null) {
                    stored = defaultValue;
                }
                return stored;
            },
            update: function localStorageServiceUpdate(key, value) {
                if (value) {
                    localStorage.setItem(key, angular.fromJson(value));
                }
            },
            clear: function localStorageServiceClear(key) {
                localStorage.removeItem(key);
            }
        };
    }])

    .factory('chatService', function () {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var chats = [{
            id: 0,
            name: 'Ben Sparrow',
            lastText: 'You on your way?',
            face: 'img/ben.png'
        }, {
            id: 1,
            name: 'Max Lynx',
            lastText: 'Hey, it\'s me',
            face: 'img/max.png'
        }, {
            id: 2,
            name: 'Adam Bradleyson',
            lastText: 'I should buy a boat',
            face: 'img/adam.jpg'
        }, {
            id: 3,
            name: 'Perry Governor',
            lastText: 'Look at my mukluks!',
            face: 'img/perry.png'
        }, {
            id: 4,
            name: 'Mike Harrington',
            lastText: 'This is wicked good ice cream.',
            face: 'img/mike.png'
        }];

        return {
            all: function () {
                return chats;
            },
            remove: function (chat) {
                chats.splice(chats.indexOf(chat), 1);
            },
            get: function (chatId) {
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i].id === parseInt(chatId)) {
                        return chats[i];
                    }
                }
                return null;
            }
        };
    })

    .factory('ServerData',function($ionicPopup){
    	return{
    		//弹出信息框
    		alert:function(msg){
    			$ionicPopup.alert({
    				template: msg,
    				title: '提示信息'
    			});
    		}
    	};
    })
    
    .factory('DialogueService', function ($http, $q) {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var dialogues = [];
        /*var dialogues =
         $http.get("data/json/dialogues.json").success(function(response){
         //dialogues = response.data.results;
         });*/

        return {
            setDia: function (data) {
                dialogues = data;
            },
            getDia: function () {
                return dialogues;
            },
            init: function () {
                var defer = $q.defer();
                $http.get('data/json/dialogues.json', {
                    catch: true
                }).success(function (data) {
                    defer.resolve(data);
                }).error(function (err) {
                    defer.reject(err);
                });
            },
            all: function () {
                dialogues = $http.get("data/json/dialogues.json", {cache: true});
                return dialogues;
            },
            get: function (dialogueId) {
                // Simple index lookup
                return dialogues[dialogueId];
            }
        };
    });
