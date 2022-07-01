# This is the Nethopper Demo App repo
# The demo app is used to demostrate conectivity between a frontend and backend
# this is an nodejs project that does the folowing:
1) reads ENV variables to determine which cluster it is install in
2) reqests to backend:8080/api to get the cluster name it is installed in
3) uses a nodejs http server, responds to GET requests at /api with the name of its cluster and the backend cluster
4) keeps an open socker with its JS clients to dynamically update the UI with the name of the frontend and backend cluster

## Project setup
```
npm install
```

### development and test process
pick two VMs (or hosts) on which to test:
- on each, set ENV:
```
export MYCLUSTERNAME=VM1
export MYCLUSTERNAME=VM2
```
- on each, run the nodejs
```
npm run dev
```
Open a browser to port 8080 on each VM, and you should see  a web page whic shows the ENVs.
Run an end to end test using 2 Kubernetes clusters

# Docker Build Process
- Build a docker container
  - sudo usermod -aG docker $USER
  - sudo npm run build
  - NOTE: this will create a container, and upload it to nethopper's dockerhub.
  
# Docker Push process
  - sudo npm run push
  - NOTE: after building the container, this pushes it to nethoppers dockerhub as the current version (ie 1.0.2)

# Docker Publish process
  - sudo npm run publish
  - NOTE: after testing the container, this pushes it to nethoppers dockerhub as the LATEST version