angular.module('Favorite', ['ngMaterial','angular-google-gapi','ui.router','directive'])
.config(function($mdThemingProvider,$urlRouterProvider,$stateProvider) {
   // $urlRouterProvider.otherwise("/data");
  //
  // Now set up the states
  $stateProvider
    .state('data', {
      // controller:'dataCtrl',
      templateUrl: 'app/data/data.tpl.html'
  });
    
  
  $mdThemingProvider.theme('default')
    .primaryPalette('pink');


})
.run(['GAuth', 'GApi', '$state','$rootScope','$q', function(GAuth, GApi, $state, $rootScope, $q) {
  var CLIENT = '856014502690-aieofe9ldn6605p63vhq4g1fm0n2v7pv';
  var BASE = 'https://myGoogleAppEngine.appspot.com/_ah/api';

  $rootScope.userId = '';

  GAuth.setClient(CLIENT);


   
  GAuth.checkAuth().then(
      function () {
           $rootScope.LoginTrue = true;
           $rootScope.Loginfalse= false;
           $rootScope.userId = $rootScope.gapi.user.id;
           $rootScope.getData('');
          
           // }
      },
      function() {
          $rootScope.Loginfalse= true;
          $rootScope.LoginTrue = false;
           console.log('login falase')
      }
  ) 
;
     
}])
.controller('favoriteController', [
  '$scope', 
  'GAuth', 
  '$state', 
  '$rootScope', 
  '$log', 
  '$timeout', 
  '$mdSidenav', 
  '$mdUtil',
  'favoriteFactory', 
  function myController($scope, GAuth, $state, $rootScope,  $log, $timeout, $mdSidenav, $mdUtil, favoriteFactory) {

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


    $scope.toggleSidenav = function(menuId) {
      $mdSidenav(menuId).toggle();
    };

    $scope.chooesTabMenu = function(number)
    {  
      $scope.tabMenu = $scope.menu[number].name;   
      $scope.number = number;
      $scope.currentPage = 1;
      $scope.page = 0;
      $rootScope.favoriteDatas = [];
      angular.forEach($scope.menu, function(value,key) {
        if(value.tabColor!='' )
        value.tabColor = '';
      });
      $scope.menu[number].tabColor =  'btn-active';

      if(number == 0)
        $rootScope.getData('');
      else
        $rootScope.getData($scope.menuStatus[number-1]);
   
    };

    $scope.default = function()
    {
       $scope.menuStatus = ['work','game','music','picture','other'];
       $scope.menu = 
       [{
          name:'หน้าหลัก',
          icon:'img/home.svg'
        },
         {
          name:'งาน',
          icon:'img/work.svg'
        },
          {
          name:'เกม',
          icon:'img/game.svg'
        },
        {
          name:'เพลง',
          icon:'img/music.svg'
        }, 
        {
          name:'รูปภาพ',
          icon:'img/picture.svg'
        },
      
        {
          name:'อื่นๆๆ',
          icon:'img/other.svg'
        },

      ];
      $scope.currentPage = 1;
      $scope.chooesTabMenu(0); 
      $scope.nameFevorite = '';
      $scope.linkFevorite  = 'https://www.google.com/';
      
    };

    $scope.post = function()
    {

      var check  = $scope.checkInput();
      if(check)
      {
        $scope.loaddingPost = true;
        var data = {
          name:$scope.nameFevorite,
          link:$scope.linkFevorite,
          status:$scope.statusFevorite,
          userId:$rootScope.userId     
        };
        data = {
          data : data
        };
        favoriteFactory.addFavorite(data,function(data, status, headers, config)
        {
            $rootScope.getData($scope.menuStatus[$scope.number-1]);
            $scope.nameFevorite = '';
            $scope.linkFevorite = '';
            $scope.statusFevorite = '';
            $scope.loaddingPost = false;
        });
      }

    };

    $scope.checkInput = function()
    {
      if($scope.nameFevorite == '')
        return false;
      if($scope.linkFevorite  == '') 
        return false;
      else
        return true;
    };

    $scope.padding = function()
    {   
      if($scope.currentPage < $scope.page)
      {
        $scope.loaddingData = true;
        $scope.currentPage++;
        $rootScope.getData();
      }
      
    };

    $rootScope.getData = function(status)
    { 
      $scope.loaddingData = true;
      var data = {
         userId:$rootScope.userId,
         page:$scope.currentPage  
      };

      if(status != '')
      {
        data.status = status;
      }  
      
      favoriteFactory.getFavorite(data,function(data, status, headers, config)
      {
        
        if($scope.currentPage>1)
        {
          angular.forEach(data.data, function(data) {
            $rootScope.favoriteDatas.push(data);
          });
        }         
        else
          $rootScope.favoriteDatas = data.data;

        $scope.path();
        $scope.loaddingData = false;
        $scope.page = data.page;
        console.log($rootScope.favoriteDatas);


      });
    };
    
    $scope.path = function()
    {
      angular.forEach($rootScope.favoriteDatas, function(data) {
        if(data.favorite_status == 'work')
          data.pathStatus = $scope.menu[1].icon;
        else if(data.favorite_status == 'game')
          data.pathStatus = $scope.menu[2].icon;

        else if(data.favorite_status == 'music')
          data.pathStatus = $scope.menu[4].icon;

        else if(data.favorite_status == 'picture')
          data.pathStatus = $scope.menu[3].icon;

        else if( data.favorite_status == 'other')
          data.pathStatus = $scope.menu[5].icon;
      });
    };

    $scope.removeData = function(index)
    {
      $scope.loaddingData = true;
      var data = {
        id:$rootScope.favoriteDatas[index]._id
      };
      favoriteFactory.deleteFavorite(data, function(data, status, headers, config){
        $rootScope.getData('');
      });
    };



}])
.factory('favoriteFactory', ['$http', function($http) {
  return {
    addFavorite:function(data,callback)
    {
      $http({url: '/api/addfavorite',method:'GET',params:data})
      .success(callback)
      .error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
    },
    getFavorite:function(data,callback)
    {
      $http({url: '/api/favorite',method:'GET',params:data})
      .success(callback)
      .error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
    },
    deleteFavorite:function(data,callback)
    {
      $http({url: '/api/delete',method:'GET',params:data})
      .success(callback)
      .error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
    }
  };
}]);
