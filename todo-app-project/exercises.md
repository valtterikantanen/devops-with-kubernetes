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
