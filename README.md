# Docker Registry UI

#### What is Docker?

 * Docker is an open platform for developers and sysadmins to build, ship, and run distributed applications.
 * Consisting of Docker Engine, a portable, lightweight runtime and packaging tool, and Docker Hub, a cloud service for sharing applications and automating workflows.
 * Docker enables apps to be quickly assembled from components and eliminates the friction between development, QA, and production environments.

#### Steps to Install

 * Set up git on your pc if you have not already. Visit [github help](https://help.github.com/articles/set-up-git)
 * Open terminal and enter the command:
```  
git clone https://github.com/worksap-ate/docker-registry-ui.git
```
  	OR

  	Download the code from [here](https://github.com/worksap-ate/docker-registry-ui)

 
 * Install the latest version of docker using the commands below:

 ```
$ sudo apt-get update
$ sudo apt-get -y install docker.io
$ curl https://get.docker.io/builds/Linux/x86_64/docker-latest -o /usr/local/bin/docker
$ chmod +x /usr/local/bin/docker
$ sudo sed -i.bk 's/DOCKER=\/usr\/bin\/\$UPSTART_JOB/DOCKER=\/usr\/local\/bin\/docker/' /etc/init/docker.io.conf
$ sudo restart docker.io
$ sudo passwd -a <USER> docker

 ```

 * Now build the docker-registry using the command below:
```
docker build -t registry .
```
 * Now once you have your docker-registry installed, run the registry using following command :
```
sudo mkdir /srv/docker; docker run -d -e HOME=/root -e HOME=/root -e SETTINGS_FLAVOR=local -e STORAGE_PATH=/srv/docker/prod -e SEARCH_BACKEND=sqlalchemy -p 80:5000 -p 22 -v /srv/docker:/srv/docker registry
```
 * You can check if the registry is running either by :
```
docker ps
```
or by visiting the url : <RegistryIP>/v1/_ping

 * Now you can download the source code of the docker-registry UI from [here](https://github.com/worksap-ate/docker-registry-ui) and host it on a server.
So now you have your docker-registry web UI up and running.

#### Workflow And Instructions
Here we will explain about the user case now :
* User enters the application, he encounters a home page with Set Registry option in which he can input the IP.
* Then he visits showNamespaces page where he can view all the namepspaces as tiles and he can also toggle the view by clicking the Toggle button.
*  He can click any of the namespace to view its repositories and further the tags. He can also manage tags by editing or deleting them.

#### Features
  1. IP through GET parameter
    * User can input the IP as a GET parameter in the URl like : <RegistryIP>/#/?IP=xxx.xxx.xxx.xxx
This way user can also bookmark the registry directly and can visit anytime.
  2. Toggle button
    * If user wants to see all the images he can do that by using the toggle button to change the view.
  3. Search like docker hub
    * If user wants to search in the entire hub just like the docker hub, then he can use the search option given at the top. The phrase he wants to search for will search in the entire hub.
  4. Filter
    * User can filter at any web page to decrease the list by filtering them by some phrase which he can enter in the box.
  5. Manage Tags
    * User can manage the tags, that is he can edit the name of the tag, delete a tag and also copy the command to pull that image. He can also delete the entire repository if he wants.
  6. Change Registry
    * He can change the registry IP whenever he wants by using the change registry option at the top.
  7. Sort
    * User can use the sort option to sort the items accorsing to the alphabetical order whether it is ascending or decending.
    
