var app = angular.module('DockerWebUI',[]);

app.config(function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

/*app.config(function($locationProvider){
    $locationProvider.html5Mode(true);
});*/

/*app.config(function($rootScopeProvider){
     $rootScopeProvider.digestTtl(1000); 
});*/
