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

### Cfor development
```
npm run dev
```