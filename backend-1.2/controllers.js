var NamespacesController = function ($scope,$http)
{
	$scope.num_results=0;
	$scope.dictionary={};
	results=[];
	namespaces=[];
	images=[];
	$http({method: 'GET', url: 'http://192.168.1.15/v1/search'}).success(function(data)
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


var RepositoriesController = function ($scope,$http,$location)
{
	$scope.namespace=$location.search()['namespace'];
	$scope.num_results=0;
	$scope.repositoriesList=[];
	$http({method: 'GET', url: 'http://192.168.1.15/v1/search'}).success(function(data)
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


var ImagesController = function ($scope,$http,$location)
{
	$scope.namespace=$location.search()['namespace'];
	$scope.repository=$location.search()['repository'];
	$scope.tagsList=[];
	URL='http://192.168.1.15/v1/repositories/'+$scope.namespace+'/'+$scope.repository+'/tags';
	$scope.deleteTag = function (tag)
	{
			$http.delete(URL+'/'+tag).success(function (data)
			{
				alert('Deleted tag : '+tag);
			}).error(function(data){alert('Unable to delete.')});;
	};
	$http({method: 'GET', url: URL }).success(function(data)
	{
		$scope.results=data;
		angular.forEach($scope.results,function(key,value)
		{
			$scope.tagsList.push(value);
		});		
	}).error(function(data){$scope.num_results=-1;});
}



