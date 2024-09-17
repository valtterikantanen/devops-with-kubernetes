# Exercises

## 1.01

- Build the image and push it to Docker Hub

  ```sh
  $ docker build . -t vkantanen/log-output:1.01
  $ docker push vkantanen/log-output:1.01
  ```

- Create a deployment using the image

  ```sh
  $ kubectl create deployment log-output-dep --image=vkantanen/log-output:1.01
  deployment.apps/log-output-dep created
  ```

- Get the name of the pod and check the logs

  ```sh
  $ kubectl get pods
  NAME                              READY   STATUS    RESTARTS   AGE
  log-output-dep-64b584cb6c-q6m9r   1/1     Running   0          9s

  $ kubectl logs -f log-output-dep-64b584cb6c-q6m9r
  2024-09-17T17:52:18.190Z: 50e9e4da-b25a-49b8-aef5-8e73502541b1
  2024-09-17T17:52:23.198Z: 50e9e4da-b25a-49b8-aef5-8e73502541b1
  ...
  ```
