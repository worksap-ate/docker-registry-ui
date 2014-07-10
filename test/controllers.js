//app.controller("NamespacesController", function($scope,$http)
var NamespacesController = function ($scope,$http,$rootScope)
{
	$scope.num_results=0;
	$scope.dictionary={};
	results=[];
	namespaces=[];
	images=[];
	$http({method: 'GET', url: 'http://192.168.1.4/v1/search'}).success(function(data)
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
}
//});

//app.controller("RepositoriesController", function($scope,$http,$location)
var RepositoriesController = function ($scope,$http,$location,$rootScope)
{
	$scope.namespace=$location.search()['namespace'];
	$scope.num_results=0;
	$scope.repositoriesList=[];
	$scope.go = function (path) {
	$location.path(path);
	};
	$http({method: 'GET', url: 'http://192.168.1.4/v1/search'}).success(function(data)
	{
		$scope.num_results=data.num_results;
		results=data.results;
		angular.forEach(results,function(result)
		{
			if(result.name.split('/')[0]===$scope.namespace)
				$scope.repositoriesList.push(result.name.split('/')[1]);
		});		
	}).error(function(data){$scope.num_results=-1;});
}
//});

//app.controller("ImagesController", function($scope,$http,$location)
var ImagesController = function ($scope,$http,$rootScope)
{
	/*$scope.namespace=$location.search()['namespace'];
	$scope.repository=$location.search()['repository'];
	$scope.data=0;
	$http({method: 'GET', url: 'http://192.168.1.4/v1/repositories/{{namespace}}/{{repository}}/tags'  }).success(function(data)
	{
		$scope.data=data;	
	}).error(function(data){$scope.num_results=-1;});*/
}
//});



