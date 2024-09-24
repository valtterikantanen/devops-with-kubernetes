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

## 1.03

- Create a new deployment

  ```sh
  $ kubectl apply -f manifests/deployment.yaml 
  deployment.apps/log-output-dep created
  ```

- Get the name of the pod and check the logs

  ```sh
  $ kubectl get pods
  NAME                              READY   STATUS    RESTARTS   AGE
  log-output-dep-6869bc475f-r6nfg   1/1     Running   0          25s

  $ kubectl logs -f log-output-dep-6869bc475f-r6nfg
  2024-09-17T18:37:31.823Z: 2081b03b-d2fd-4fc0-a302-3621cd929ddc
  2024-09-17T18:37:36.831Z: 2081b03b-d2fd-4fc0-a302-3621cd929ddc
  ...
  ```

## 1.07

- Build a new version of the image and push it to Docker Hub

  ```sh
  $ docker build . -t vkantanen/log-output:1.07
  $ docker push vkantanen/log-output:1.07
  ```

- Update [`deployment.yaml`](manifests/deployment.yaml) to use the new image

  ```diff
  spec:
    containers:
      - name: log-output
  -     image: vkantanen/log-output:1.01
  +     image: vkantanen/log-output:1.07
  ```

- Create [`ingress.yaml`](manifests/ingress.yaml) and [`service.yaml`](manifests/service.yaml)

- Apply the manifests

  ```sh
  $ kubectl apply -f manifests/
  deployment.apps/log-output-dep created
  ingress.networking.k8s.io/log-output-ingress created
  service/log-output-svc created
  ```

- Test the application

  ```sh
  $ curl http://localhost:8081
  2024-09-17T20:33:07.627Z: aa0d0a80-f183-420f-aa95-7172eaca12e3
  ```

## 1.10

- Split the original *Log output* application into two applications: `log-output-generator` and `log-output-reader`
  - `log-output-generator` generates a new timestamp every 5 seconds and writes it to a file `timestamp.txt`
  - `log-output-reader` generates a UUID when the server is started and reads the content of `timestamp.txt`. It logs the timestamp and the UUID every 5 seconds and also sends the data in the response when the root path is accessed

- Build new images and push them to Docker Hub

  ```sh
  $ docker build . -t vkantanen/log-output-generator:1.10
  $ docker push vkantanen/log-output-generator:1.10
  $ docker build . -t vkantanen/log-output-reader:1.10
  $ docker push vkantanen/log-output-reader:1.10
  ```

- Update [`deployment.yaml`](manifests/deployment.yaml)

- Apply the manifests

  ```sh
  $ kubectl apply -f manifests/
  deployment.apps/log-output-dep created
  ingress.networking.k8s.io/log-output-ingress created
  service/log-output-svc created
  ```

- Check the logs

  ```sh
  $ kubectl get pods
  NAME                              READY   STATUS    RESTARTS   AGE
  log-output-dep-579fc88cd6-dwvw8   2/2     Running   0          8s
  
  $ kubectl logs log-output-dep-579fc88cd6-dwvw8 --all-containers=true --prefix
  [pod/log-output-dep-579fc88cd6-dwvw8/log-output-reader] Server started in port 3000
  [pod/log-output-dep-579fc88cd6-dwvw8/log-output-reader] File not found: /usr/src/app/files/timestamp.txt
  [pod/log-output-dep-579fc88cd6-dwvw8/log-output-reader] 2024-09-18T13:28:53.234Z: e63c17ac-968a-4df3-b4ee-8c046c4a0772
  [pod/log-output-dep-579fc88cd6-dwvw8/log-output-reader] 2024-09-18T13:28:58.241Z: e63c17ac-968a-4df3-b4ee-8c046c4a0772
  ```

- Test the application

  ```sh
  $ curl http://localhost:8081
  2024-09-18T13:29:13.254Z: e63c17ac-968a-4df3-b4ee-8c046c4a0772
  ```

## 1.11

See the steps from [`ping-pong/exercises.md`](../ping-pong/exercises.md#1.11).

## 2.01

- Build new images and push them to Docker Hub

  ```sh
  $ docker build . -t vkantanen/log-output-reader:2.01
  $ docker push vkantanen/log-output-reader:2.01
  $ docker build . -t vkantanen/ping-pong:2.01
  $ docker push vkantanen/ping-pong:2.01
  ```

- Update `deployment.yaml` of [`log-output`](manifests/deployment.yaml) and [`ping-pong`](../ping-pong/manifests/deployment.yaml)

- Apply the manifests

  ```sh
  $ kubectl apply -f manifests/deployment.yaml
  deployment.apps/log-output-dep configured
  $ kubectl apply -f ../ping-pong/manifests/deployment.yaml
  deployment.apps/ping-pong-dep configured
  ```

- Test the application

  ```sh
  $ curl http://localhost:8081
  2024-09-24T12:16:42.185Z: 00377b70-068b-4bf2-aec8-4e7848f5fe3d
  Ping / Pongs: 0
  $ curl http://localhost:8081/pingpong
  pong 0
  $ curl http://localhost:8081
  2024-09-24T12:17:32.245Z: 00377b70-068b-4bf2-aec8-4e7848f5fe3d
  Ping / Pongs: 1
  ```
