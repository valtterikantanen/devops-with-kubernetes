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
