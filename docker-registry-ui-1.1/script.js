// Create the module and name it app
var app = angular.module('DockerWebUI', ['ngRoute']);

/*
 *This config command configures all $http requests to be send with 'X-Requested-With' header 
 * which is required by docker-registry flask server
 */  
app.config(function($httpProvider){
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

// configure our routes.
/*
 *Using routes we create a single page application(SPA), with index.html as the base template and then loading
 *various views using ng-view, and anchor tags. 
 */ 
app.config(function($routeProvider) {
	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : 'pages/home.html',
			controller  : 'MainController'
		})

		// route for the showNamespaces page
		.when('/showNamespaces', {
			templateUrl : 'pages/showNamespaces.html',
			controller  : 'NamespacesController'
		})

		// route for the showRepositories page
		.when('/showRepositories', {
			templateUrl : 'pages/showRepositories.html',
			controller  : 'RepositoriesController'
		});
});

/*This service is used to define the object which stores the current Docker-registry IP address and defines the getter and setter 
  methods for accessing  and modifyingthe IP address. 
*/
app.service('IPService', function () {
	var IP = '192.168.1.1';
	return {
		getIP: function () {
			return IP;
		},
		setIP: function(value) {
			IP = value;
		}
	};
});

// create the Main controller (for index.html) and inject Angular's $scope
app.controller('MainController', function($scope,IPService,$route,$window) {
	// create a message to display in our view
	$scope.inputIP='';
	$scope.setIP=function(inputIP)
	{
		IPService.setIP(inputIP);
		console.log('the IP has been changed to '+IPService.getIP());
		$window.location.href = "#showNamespaces";
	}
});

//Show Namespaces controller, all JS code for showNamespaces page is here
app.controller('NamespacesController', function($rootScope,$scope,$http,IPService,$route) {
	
	$scope.message = 'shownamespaces page';
	$scope.IP=IPService.getIP();
	console.log('the ip is ' + $scope.IP);
	$scope.num_results=0;
	$scope.dictionary={};
	results=[];
	namespaces=[];
	images=[];
	
	$http({method: 'GET', url: 'http://'+$scope.IP+'/v1/search'}).success(function(data)
	{
		$scope.num_results=data.num_results;
		results=data.results;
		angular.forEach(results,function(result)
		{
			$scope.dictionary[result.name.split('/')[0]]=[];			
		});
		angular.forEach(results,function(result)
		{
			namespaces.push(result.name.split('/')[0]);
			images.push(result.name.split('/')[1]);
			$scope.dictionary[result.name.split('/')[0]].push(result.name.split('/')[1]);
		});		
	}).error(function(data){$scope.num_results=-1;});

});

//Show repositories controller, all JS code for showRepositories page is here
app.controller('RepositoriesController', function($scope,$http,$location,IPService) {
	$scope.IP=IPService.getIP();
	$scope.namespace=$location.search()['namespace'];
	$scope.num_results=0;
	$scope.repositoriesList=[];
	$scope.go = function (path) {
	$location.path(path);
	};
	$http({method: 'GET', url: 'http://'+$scope.IP+'/v1/search'}).success(function(data)
	{
		$scope.num_results=data.num_results;
		results=data.results;
		angular.forEach(results,function(result)
		{
			if(result.name.split('/')[0]===$scope.namespace)
				$scope.repositoriesList.push(result.name.split('/')[1]);
		});		
	}).error(function(data){$scope.num_results=-1;});
});

