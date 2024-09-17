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
