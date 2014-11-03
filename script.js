/*
 * Copyright 2014 Works Applications Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var app = angular.module('DockerWebUI', ['ngCookies','ngRoute','ngClipboard']);
app.config(['ngClipProvider', function(ngClipProvider) { ngClipProvider.setPath("includes/bower_components/zeroclipboard/dist/ZeroClipboard.swf"); }]);
app.config(function($httpProvider){
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl : 'pages/home.html',
			controller  : 'MainController'
		})
		.when('/showNamespaces', {
			templateUrl : 'pages/showNamespaces.html',
			controller  : 'NamespacesController'
		})
		.when('/showNamespacesRepos', {
			templateUrl : 'pages/showNamespacesRepos.html',
			controller  : 'NamespacesReposController'
		})
		.when('/showRepositories', {
			templateUrl : 'pages/showRepositories.html',
			controller  : 'RepositoriesController'
		})
		.when('/showImages', {
			templateUrl : 'pages/showImages.html',
			controller  : 'ImagesController'
		});
});
app.controller('MainController', ['$scope','$route','$window','$cookies','$location',function($scope,$route,$window,$cookies,$location) {
	var paramIP = $location.search()['IP'] || '';
	var paramProtocol = $location.search()['protocol'] || 'http';
	if(paramIP!=='')
	{
		$cookies.IP=paramIP;
		$cookies.protocol=paramProtocol;
		console.log('the ip has been changed to ' + $cookies.protocol + '://' + $cookies.IP);
		$window.location.href = "#showNamespaces";
		$route.reload();
	}
	$scope.ip = paramIP;
	$scope.protocol = paramProtocol;
	$scope.getIP=function()
	{
		$scope.ip = $cookies.IP || '';
		$scope.protocol = $cookies.protocol || 'http';
		console.log('getIP the current IP has been to '+$cookies.IP);
	}
	$scope.setIP=function()
	{
		$cookies.IP=$scope.ip;
		$cookies.protocol=$scope.protocol;
		console.log('the IP has been changed to '+$cookies.IP);
		console.log('the protocol has been changed to '+$cookies.protocol);
		$window.location.href = "#showNamespaces";
		$route.reload();
	}
}]);
app.controller('NamespacesController', function($rootScope,$scope,$http,$route,$cookies,$window,$location) {
	$scope.IP=$cookies.IP;
	$scope.protocol=$cookies.protocol;
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
		$http({method: 'GET', url: $scope.protocol+'://'+$scope.IP+'/v1/search'}).success(function(data)
		{
			$scope.num_results=data.num_results;
			results=data.results;
			angular.forEach(results,function(result)
			{
				$scope.dictionary[result.name.split('/')[0]]=[];			
			});
			angular.forEach(results,function(result)
			{
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
app.controller('NamespacesReposController', function($rootScope,$scope,$http,$route,$cookies,$location,$window) {
	$scope.IP=$cookies.IP;
	$scope.protocol=$cookies.protocol;
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
			$scope.num_results=0;
			$scope.namespacesReposList=[];
			$http({method: 'GET', url: $scope.protocol+'://'+$scope.IP+'/v1/search'}).success(function(data)
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
			$http({method: 'GET', url: $scope.protocol+'://'+$scope.IP+'/v1/search'}).success(function(data)
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
app.controller('RepositoriesController', function($scope,$http,$location,$window,$cookies,$route) {
	$scope.IP=$cookies.IP;
	$scope.protocol=$cookies.protocol;
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
		$http({method: 'GET', url: $scope.protocol+'://'+$scope.IP+'/v1/search'}).success(function(data)
		{
			$scope.num_results=data.num_results;
			results=data.results;
			numRepos=0;
			angular.forEach(results,function(result)
			{
				if(result.name.split('/')[0]===$scope.namespace)
				{
					temp={};
					numRepos++;
					temp['name']=result.name.split('/')[1];
					temp['id']=numRepos;
					$scope.repositoriesList.push(temp);
				}
			});		
		}).error(function(data){alert('Unable to request.')});
		deleteRepoURL=$scope.protocol+'://'+$scope.IP+'/v1/repositories/'+$scope.namespace;
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
app.controller('ImagesController', function($scope,$http,$location,$window,$cookies,$route) {
	$scope.IP=$cookies.IP;
	$scope.protocol=$cookies.protocol;
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
		URL=$scope.protocol+'://'+$scope.IP+'/v1/repositories/'+$scope.namespace+'/'+$scope.repository+'/tags';
		 $scope.getTextToCopy = function(tag_name) {
			return "docker pull "+$scope.IP+"/"+$scope.namespace+"/"+$scope.repository+":"+tag_name;
		}
		$scope.doSomething = function () {
			console.log("Text copied");
		}
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
		deleteRepoURL=$scope.protocol+'://'+$scope.IP+'/v1/repositories/'+$scope.namespace+'/'+ $scope.repository;
		$scope.deleteRepo = function ()
		{
				$http.delete(deleteRepoURL+'/').success(function (data)
				{
					console.log('Deleted Repo : '+$scope.repository);
					$window.location.href = "#showRepositories?namespace="+$scope.namespace;
					$route.reload();
				}).error(function(data){});;
		};
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
		}).error(function(data){alert('Unable to request. Maybe target server is not supported CORS tag APIs.')});
	}
});
