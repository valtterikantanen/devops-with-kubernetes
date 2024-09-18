# Exercises

## 1.02

- Build the image and push it to Docker Hub

  ```sh
  $ docker build . -t vkantanen/todo-app-project:1.02
  $ docker push vkantanen/todo-app-project:1.02
  ```

- Create a deployment using the image

  ```sh
  $ kubectl create deployment todo-app-project-dep --image=vkantanen/todo-app-project:1.02
  deployment.apps/todo-app-project-dep created
  ```

- Get the name of the pod and check the logs

  ```sh
  $ kubectl get pods
  NAME                                    READY   STATUS    RESTARTS   AGE
  todo-app-project-dep-7cd65d984d-b42fs   1/1     Running   0          8s

  $ kubectl logs -f todo-app-project-dep-7cd65d984d-b42fs
  Server started in port 3000
  ```

## 1.04

- Create a new deployment

  ```sh
  $ kubectl apply -f manifests/deployment.yaml 
  deployment.apps/todo-app-project-dep created
  ```

- Get the name of the pod and check the logs

  ```sh
  $ kubectl get pods
  NAME                                   READY   STATUS    RESTARTS   AGE
  log-output-dep-6869bc475f-r6nfg        1/1     Running   0          5m8s
  todo-app-project-dep-bfff7d448-9wb8m   1/1     Running   0          16s

  $ kubectl logs -f todo-app-project-dep-bfff7d448-9wb8m
  Server started in port 3000
  ```

## 1.05

- Build a new version of the image and push it to Docker Hub

  ```sh
  $ docker build . -t vkantanen/todo-app-project:1.05
  $ docker push vkantanen/todo-app-project:1.05
  ```

- Update [`manifests/deployment.yaml`](manifests/deployment.yaml) to use the new image

  ```diff
  spec:
    containers:
      - name: todo-app-project
  -     image: vkantanen/todo-app-project:1.02
  +     image: vkantanen/todo-app-project:1.05
  ```

- Update the deployment

  ```sh
  $ kubectl apply -f manifests/deployment.yaml
  deployment.apps/todo-app-project-dep configured
  ```

- Get the name of the pod and check the logs

  ```sh
  $ kubectl get pods
  NAME                                    READY   STATUS        RESTARTS   AGE
  log-output-dep-6869bc475f-r6nfg         1/1     Running       0          25m
  todo-app-project-dep-5bb5897669-d2j54   1/1     Running       0          10s
  todo-app-project-dep-bfff7d448-9wb8m    1/1     Terminating   0          20m

  $ kubectl logs -f todo-app-project-dep-5bb5897669-d2j54
  Server started in port 3000
  ```

- Forward the port

  ```sh
  $ kubectl port-forward todo-app-project-dep-5bb5897669-d2j54 3003:3000
  Forwarding from 127.0.0.1:3003 -> 3000
  Forwarding from [::1]:3003 -> 3000
  ```

- Test the application (in another terminal)

  ```sh
  $ curl http://localhost:3003
  <h1>Hello from Kubernetes!</h1>
  ```

## 1.06

- Add [`manifests/service.yaml`](manifests/service.yaml)

- Delete the old cluster

  ```sh
  $ k3d cluster delete
  INFO[0000] Deleting cluster 'k3s-default'
  ...
  INFO[0001] Successfully deleted cluster k3s-default!
  ```

- Create a new cluster

  ```sh
  $ k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
  INFO[0000] portmapping '8081:80' targets the loadbalancer: defaulting to [servers:*:proxy agents:*:proxy] 
  INFO[0000] Prep: Network                                
  INFO[0000] Created network 'k3d-k3s-default'
  ...
  INFO[0016] Cluster 'k3s-default' created successfully!
  ```

- Create a new deployment

  ```sh
  $ kubectl apply -f manifests/deployment.yaml
  deployment.apps/todo-app-project-dep created
  ```

- Create a new service

  ```sh
  $ kubectl apply -f manifests/service.yaml
  service/todo-app-project-svc created
  ```

- Test the application

  ```sh
  $ curl http://localhost:8082
  <h1>Hello from Kubernetes!</h1>
  ```

## 1.08

- Delete the ingress of log-output

  ```sh
  $ kubectl delete ingress log-output-ingress
  ingress.networking.k8s.io "log-output-ingress" deleted
  ```

- Create [`ingress.yaml`](manifests/ingress.yaml) and update [`service.yaml`](manifests/service.yaml)

- Apply the manifests

  ```sh
  $ kubectl apply -f manifests/
  deployment.apps/todo-app-project-dep unchanged
  ingress.networking.k8s.io/todo-app-project-ingress created
  service/todo-app-project-svc configured
  ```

- Test the application

  ```sh
  $ curl http://localhost:8081
  <h1>Hello from Kubernetes!</h1>
  ```

## 1.12

- Build a new version of the image and push it to Docker Hub

  ```sh
  $ docker build . -t vkantanen/todo-app-project:1.12
  $ docker push vkantanen/todo-app-project:1.12
  ```

- Update [`deployment.yaml`](manifests/deployment.yaml)

- Apply the manifests

  ```sh
  $ kubectl apply -f ../manifests/
  persistentvolumeclaim/ping-pong-claim created
  persistentvolume/dwk-pv created

  $ kubectl apply -f manifests/
  deployment.apps/todo-app-project-dep created
  ingress.networking.k8s.io/todo-app-project-ingress created
  service/todo-app-project-svc created
  ```

- Test the application

  ```sh
  $ curl http://localhost:8081
  <html>
    <body>
      <h1>Hello from Kubernetes!</h1>
      <img src="image.jpg" width="400" height="400" />
    </body>
  </html>
  ```

- Delete and recreate the deployment

  ```sh
  $ kubectl delete deployment todo-app-project-dep
  deployment.apps "todo-app-project-dep" deleted

  $ kubectl apply -f manifests/deployment.yaml
  deployment.apps/todo-app-project-dep created
  ```

- On the browser, we can still see the same picture that was shown before deleting the deployment

## 1.13

- Add an input field, a send button and a list of todos to the application

- Build a new version of the image and push it to Docker Hub

  ```sh
  $ docker build . -t vkantanen/todo-app-project:1.13
  $ docker push vkantanen/todo-app-project:1.13
  ```
