angular.module('Favorite', ['angular-google-gapi','ui.router','sidenavDemo1','Favorite.data'])
.config(function($mdThemingProvider,$urlRouterProvider,$stateProvider) {



   $urlRouterProvider.otherwise("/data");
  //
  // Now set up the states
  $stateProvider
    .state('data', {
      url: "/data",
      controller: 'dataCtrl',
      templateUrl: 'app/data/data.tpl.html'
  });
    
  
  $mdThemingProvider.theme('default')
    .primaryPalette('pink');


})
.run(['GAuth', 'GApi', '$state','$rootScope', function(GAuth, GApi, $state, $rootScope) {

    var CLIENT = '856014502690-aieofe9ldn6605p63vhq4g1fm0n2v7pv';
    var BASE = 'https://myGoogleAppEngine.appspot.com/_ah/api';
  

    GAuth.setClient(CLIENT);

    GAuth.checkAuth().then(
        function () {
             $rootScope.LoginTrue = true;
             $rootScope.Loginfalse= false;

        },
        function() {
            $rootScope.Loginfalse= true;
             $rootScope.LoginTrue = false;
             console.log('login falase')
        }
    );

}])
.controller('favoriteController', ['$scope', 'GAuth', '$state', '$mdSidenav', '$rootScope', '$log', '$http', function myController($scope, GAuth, $state, $mdSidenav, $rootScope,  $log, $http) {


  $scope.doSingup = function() {
    GAuth.login().then(
        function () {
             $rootScope.LoginTrue = true;
             $rootScope.Loginfalse= false;

        },
        function() {
            $rootScope.Loginfalse= true;
            $rootScope.LoginTrue = false;
        }
    );
  };

   $scope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });

    };

  $scope.logOut = function() {
    GAuth.logout().then(function(){
        console.log('login true');
    }, function() {
        console.log('login fail');
    });
  };

  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };

  $scope.chooesTabMenu = function(number)
  {

    var menu = ['','หน้าหลัก','งาน','เกม','เพลง','รูปภาพ']
    $scope.tabMenu = menu[number];
    $scope.tabColor =  number;
    $scope.close();
  };

}]);