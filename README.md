# Docker Registry UI

[![wercker status](https://app.wercker.com/status/6a4a2e14de08a4e0e359285300cf1965/s/master "wercker status")](https://app.wercker.com/project/bykey/6a4a2e14de08a4e0e359285300cf1965)

This project provides a web UI for [docker-registry](https://github.com/dotcloud/docker-registry) ([library/registry](https://registry.hub.docker.com/u/library/registry/) (>= 9.0)).

* This application is written in JavaScript, and you can deploy this application easily.
* This application doesn't store any user data.
* You can find the necessary information simply from the Docker Registry [documentation](https://docs.docker.com/reference/api/registry_api/).


#### How to Use

- Prepare CORS supported docker-registry.

```
docker run -d -e CORS_ORIGINS=[\'*\'] registry
```

We have already deployed this web-ui to our [github pages](http://worksap-ate.github.io/docker-registry-ui/#/).

- Please set your docker-registry IP at "Set Registry IP" option. 
- And you can use the Web UI.

#### How to Install to your own server

Download the source code and put these files to a web server.

#### Features

  1. Show all repositories.
    * Application shows all namespaces by default. Click the "Toggle" button shows all repositories. 
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
