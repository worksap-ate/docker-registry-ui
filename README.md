# Docker Registry UI

This projecct provides a web UI for [docker-registry](https://github.com/dotcloud/docker-registry).

#### How to Use

We already deploy it to [github pages](http://worksap-ate.github.io/docker-registry-ui/#/).

- Please set your docker-registry IP at "Set Registry IP" Button. 
- You can use the Web UI.

#### Features

  1. Show all repositories.
    * application shows all namespace by default. Click the "Toggle" button shows all repository. 
  1. Search like docker hub
    * If user wants to search in the entire hub just like the docker hub, then he can use the search option given at the top. The phrase he wants to search for will search in the entire hub.
  1. Filter by word
  1. Manage Tags
    * rename
    * delete
    * copy the pull command to clipboard.
  1. Change Registry
    * He can change the registry IP whenever he wants by using the change registry option at the top.
  1. Sort
    * User can use the sort option to sort the items accorsing to the alphabetical order whether it is ascending or decending.
  1. Registry can be set through query parameter
    * User can input the regitsty IP as a query parameter like : http://worksap-ate.github.io/docker-registry-ui/#/?IP=xxx.xxx.xxx.xxx
      This way user can bookmark the registry directly.    
