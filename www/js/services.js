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
    
    .factory('$localstorage', ['$window', function ($window) {
        return {
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                console.log('key '+$window.localStorage[key]);
                return JSON.parse($window.localStorage[key] || null);
            }
        }
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
    
    .factory('Luyin',function($ionicPopup){
	var data = [];
	var params = null;
	var file = "../data/audio/nihao.wav";
	var reader = new FileReader();
	

	params = {
		"headers": {
		          'Content-Type': 'audio/amr; rate=8000'
		        },	
        "format": "wav",
        "rate": 8000,
        "channel": 1,
        cuid: "com.test.myapp",
        token: "24.cac3afd6cb4710204df36be96702458c.2592000.1465613998.282335-8114838",
        speech: temp,
        len: file.size,
        lan: "ct"
    };
	return{
		postMedia: function() {
	      data = $http.post("http://vop.baidu.com/server_api", params);
	      console.log("data="+data);
	      return data;
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
