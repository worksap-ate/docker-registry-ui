# Docker Registry UI

This projecct provides a web UI for [docker-registry](https://github.com/dotcloud/docker-registry).

#### How to Use

We already deploy it to [github pages](http://worksap-ate.github.io/docker-registry-ui/#/).

- Please set your docker-registry IP at "Set Registry IP" Button. 
- You can use the Web UI.

#### Features

  1. Toggle button
    * If user wants to see all the images he can do that by using the toggle button to change the view.
  1. Search like docker hub
    * If user wants to search in the entire hub just like the docker hub, then he can use the search option given at the top. The phrase he wants to search for will search in the entire hub.
  1. Filter
    * User can filter at any web page to decrease the list by filtering them by some phrase which he can enter in the box.
  1. Manage Tags
    * User can manage the tags, that is he can edit the name of the tag, delete a tag and also copy the command to pull that image. He can also delete the entire repository if he wants.
  1. Change Registry
    * He can change the registry IP whenever he wants by using the change registry option at the top.
  1. Sort
    * User can use the sort option to sort the items accorsing to the alphabetical order whether it is ascending or decending.
  1. docker-registry IP can set through GET parameter
    * User can input the IP as a GET parameter in the URl like : http://worksap-ate.github.io/docker-registry-ui/#/?IP=xxx.xxx.xxx.xxx
This way user can also bookmark the registry directly and can visit anytime.    
