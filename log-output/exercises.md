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
