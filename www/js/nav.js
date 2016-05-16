angular.module('starter.nav', [])

.controller('NavController', function($scope, $ionicSideMenuDelegate,Luyin) {
	//var vm = this;
	//vm.luyin = Luyin;
	//console.log("NavController"+luyin.lan);
      $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
      };
      
      Luyin.postMedia().success(function(response) {
      	console.log(response.results); 
        }).error(function(){
      	  
       });
      
      
      $scope.file0 = "../data/audio/nihao.wav";
      $scope.postMedia = function($scope){
    	  var reader = new FileReader();
    	  reader.onload = function(e){
    	    console.log("about to encode");
    	    $scope.encoded_file = btoa(e.target.result.toString());  
    	  };
    	  reader.readAsBinaryString($scope.file0);
    	};
      
})

;
