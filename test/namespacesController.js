app.controller("NamespacesController", function($scope,$http)
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
});
