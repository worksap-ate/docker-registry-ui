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
		})
		
		// route for the showImages page
		.when('/showImages', {
			templateUrl : 'pages/showImages.html',
			controller  : 'ImagesController'
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
	$scope.namespacesList=[];
	results=[];
	//namespaces=[];
	//images=[];
	
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
			//namespaces.push(result.name.split('/')[0]);
			//images.push(result.name.split('/')[1]);
			$scope.dictionary[result.name.split('/')[0]].push(result.name.split('/')[1]);
		});	
		angular.forEach($scope.dictionary,function(key,value)
		{
			temp={};
			temp['name']=value;
			$scope.namespacesList.push(temp);
		});
	}).error(function(data){alert('Unable to reuest.')});

});

//Show repositories controller, all JS code for showRepositories page is here
app.controller('RepositoriesController', function($scope,$http,$location,IPService,$window) {
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
			{
				temp={};
				temp['name']=result.name.split('/')[1];
				$scope.repositoriesList.push(temp);
			}
		});		
	}).error(function(data){alert('Unable to request.')});
});

//Show images controller, all JS code for showImages page is here
app.controller('ImagesController', function($scope,$http,$location,IPService,$window) {
	$scope.IP=IPService.getIP();
	//$scope.newTag='';
	$scope.namespace=$location.search()['namespace'];
	$scope.repository=$location.search()['repository'];
	$scope.tagsList=[];
	URL='http://'+$scope.IP+'/v1/repositories/'+$scope.namespace+'/'+$scope.repository+'/tags';
	$scope.deleteTag = function (tag)
	{
			
			$http.delete(URL+'/'+tag).success(function (data)
			{
				alert('Deleted tag : '+tag);
				$window.location.href = "#showImages?namespace="+$scope.namespace+"&repository="+$scope.repository;
			}).error(function(data){alert('Unable to delete.')});;
	};
	
	$scope.changeTag = function (oldTag,newTag)
	{
		alert("tag is " + oldTag);
		$scope.URL2=URL+'/'+oldTag;
		$scope.URL3=URL+'/'+newTag;
		$scope.imageID="";
		console.log('image id fetch url is '+ $scope.URL2);
		console.log('tag putting url is ' + $scope.URL3);
		console.log('new tag is '+ newTag);
		$http({method: 'GET', url: $scope.URL2 }).success(function(data)
		{
			
			$scope.imageID=data.replace(/"/g,'');
			alert("the imageID is " + $scope.imageID);		
		}).error(function(data){console.log('Unable to get image ID for tag')});
		
		$http({method: 'PUT', url: $scope.URL3, data:$scope.imageID}).success(function(data)
		{
			alert("Success ");		
		}).error(function(data){console.log('Unable to set tag for imageID')});
		
		/*
		$http.delete(URL+'/'+tag).success(function (data)
			{
				alert('Deleted tag : '+tag);
				$window.location.href = "#showImages?namespace="+$scope.namespace+"&repository="+$scope.repository;
			}).error(function(data){alert('Unable to delete.')});;
		*/
	}
	
	$http({method: 'GET', url: URL }).success(function(data)
	{
		$scope.results=data;
		angular.forEach($scope.results,function(key,value)
		{
			temp={};
			temp['name']=value;
			$scope.tagsList.push(temp);
		});		
	}).error(function(data){alert('Unable to request.')});
});

