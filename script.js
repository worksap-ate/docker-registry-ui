// Create the module and name it app
var app = angular.module('DockerWebUI', ['ngCookies','ngRoute']);

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
		
		// route for the showNamespacesRepos page
		.when('/showNamespacesRepos', {
			templateUrl : 'pages/showNamespacesRepos.html',
			controller  : 'NamespacesReposController'
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


// create the Main controller (for index.html) and inject Angular's $scope
app.controller('MainController', ['$scope','$route','$window','$cookies',function($scope,$route,$window,$cookies) {
	$scope.inputIP='';
	$scope.setIP=function(inputIP)
	{
		$cookies.IP=inputIP;
		console.log('the IP has been changed to '+$cookies.IP);
		$window.location.href = "#showNamespaces";
		$route.reload();
	}
	$scope.IP=$scope.inputIP;
	if($cookies.IP!==undefined)
	{
		$window.location.href="#showNamespaces";
		$route.reload();
	}
}]);

//Show Namespaces controller, all JS code for showNamespaces page is here
app.controller('NamespacesController', function($rootScope,$scope,$http,$route,$cookies,$window) {
	
	$scope.IP=$cookies.IP;
	if($scope.IP===undefined)
	{
		$window.location.href="#";
		$route.reload();
	}
	else
	{
		console.log('the ip is ' + $scope.IP);
		$scope.num_results=0;
		$scope.dictionary={};
		$scope.namespacesList=[];
		results=[];
		
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
	}
});

//Show NamespacesRepos controller, all JS code for showNamespaces page is here
app.controller('NamespacesReposController', function($rootScope,$scope,$http,$route,$cookies,$location,$window) {
	
	$scope.IP=$cookies.IP;
	if($scope.IP===undefined)
	{
		$window.location.href="#";
		$route.reload();
	}
	else
	{
		$scope.queryAll=$location.search()['queryAll'];
		if($scope.queryAll === undefined || $scope.queryAll === "")
		{
			$scope.IP=$cookies.IP;
			console.log('the ip is ' + $scope.IP);
			$scope.num_results=0;
			$scope.namespacesReposList=[];
			$http({method: 'GET', url: 'http://'+$scope.IP+'/v1/search'}).success(function(data)
			{
				$scope.num_results=data.num_results;
				$scope.namespacesReposList=data.results;
			}).error(function(data){alert('Unable to request.')});
		}
		else
		{
			$scope.IP=$cookies.IP;
			console.log('the ip is ' + $scope.IP);
			$scope.num_results=0;
			$scope.namespacesReposList=[];
			$http({method: 'GET', url: 'http://'+$scope.IP+'/v1/search'}).success(function(data)
			{
				$scope.num_results=data.num_results;
				angular.forEach(data.results,function(result)
				{
					$scope.queryAll = angular.lowercase($scope.queryAll);
					if( result.name.indexOf($scope.queryAll) >= 0 )
						$scope.namespacesReposList.push(result);
				});
			}).error(function(data){alert('Unable to request.')});
			
		}
	}
});

//Show repositories controller, all JS code for showRepositories page is here
app.controller('RepositoriesController', function($scope,$http,$location,$window,$cookies,$route) {
	$scope.IP=$cookies.IP;
	if($scope.IP===undefined)
	{
		$window.location.href="#";
		$route.reload();
	}
	else
	{
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
		deleteRepoURL='http://'+$scope.IP+'/v1/repositories/'+$scope.namespace;
		$scope.deleteRepo = function (repo)
		{
				
				$http.delete(deleteRepoURL+'/'+repo +'/').success(function (data)
				{
					console.log('Deleted Repo : '+repo);
					$window.location.href = "#showRepositories?namespace="+$scope.namespace;
					$route.reload();
				}).error(function(data){});;
		};
	}
});

//Show images controller, all JS code for showImages page is here
app.controller('ImagesController', function($scope,$http,$location,$window,$cookies,$route) {
	
	$scope.IP=$cookies.IP;
	if($scope.IP===undefined)
	{
		$window.location.href="#";
		$route.reload();
	}
	else
	{
		$scope.namespace=$location.search()['namespace'];
		$scope.repository=$location.search()['repository'];
		$scope.tagsList=[];
		URL='http://'+$scope.IP+'/v1/repositories/'+$scope.namespace+'/'+$scope.repository+'/tags';
		
		$scope.setNewTag = function (nTag)
		{
			$scope.newTag=nTag;
		}
		
		$scope.deleteTag = function (tag)
		{
				
				$http.delete(URL+'/'+tag).success(function (data)
				{
					console.log('Deleted tag : '+tag);
					$window.location.href = "#showImages?namespace="+$scope.namespace+"&repository="+$scope.repository;
					$route.reload();
				}).error(function(data){alert('Unable to delete.')});;
		};
		deleteRepoURL='http://'+$scope.IP+'/v1/repositories/'+$scope.namespace+'/'+ $scope.repository;
		$scope.deleteRepo = function ()
		{
				
				$http.delete(deleteRepoURL+'/').success(function (data)
				{
					console.log('Deleted Repo : '+$scope.repository);
					$window.location.href = "#showRepositories?namespace="+$scope.namespace;
					$route.reload();
				}).error(function(data){});;
		};
		
		/*This function gets 2 parameters the old tag before editand the new tag after edit.
		 * This function will delete the old tag after getting the image id attached to it, use this image ID
		 * to put the new tag in the repository, thus having the same effect as editing a tag.
		 */ 
		$scope.changeTag = function (oldTag,newTag)
		{
			$scope.oldTagURL=URL+'/'+oldTag;
			$scope.newTagURL=URL+'/'+newTag;
			$scope.imageID='';
			imageId='\"hello\"';
			console.log('image id fetch url is '+ $scope.oldTagURL);
			console.log('tag putting url is ' + $scope.newTagURL);
			console.log('new tag is '+ newTag);
			if(newTag !== undefined)
			{
				
				$http({method: 'GET', url: $scope.oldTagURL }).success(function(data)
				{
					console.log('Data fetched : '+data);
					imageId='\"'+data.replace(/"/g,'')+'\"';
					if(oldTag !== newTag)
					{
						$http({method: 'PUT', url: $scope.newTagURL, data: imageId , headers: {"Content-Type": "application/json","Accept": "application/json"}}).success(function(data)
						{
							$http.delete($scope.oldTagURL).success(function (data)
							{
								$window.location.href = "#showImages?namespace="+$scope.namespace+"&repository="+$scope.repository;
								$route.reload();
							}).error(function(data){alert('Unable to delete.')});		
						}).error(function(data){
						console.log('Unable to set tag for imageID');
						});
					}
					else
					{
						console.log('OldTag same as newTag ,no action taken');
					}
							
				}).error(function(data){console.log('Unable to get image ID for tag')});
			
			}
			else
			{
				console.log('New tag is empty. Not doing anything');
			}	
			
			
			
		}
		
		$http({method: 'GET', url: URL }).success(function(data)
		{
			$scope.results=data;
			numTags=0;
			angular.forEach($scope.results,function(key,value)
			{
				numTags++;
				temp={};
				temp['name']=value;
				temp['id']=numTags;
				$scope.tagsList.push(temp);
			});		
		}).error(function(data){alert('Unable to request.')});
	}
});

