app.controller("RepositoriesController", function($scope,$http,$location)
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
});
