# Exercises

## 1.09

- Build the image and push it to Docker Hub

  ```sh
  $ docker build . -t vkantanen/ping-pong:1.09
  $ docker push vkantanen/ping-pong:1.09
  ```

- Create [`deployment.yaml`](manifests/deployment.yaml) and [`service.yaml`](manifests/service.yaml)

- Update the [ingress](../log-output/manifests/ingress.yaml) of log-output

- Apply the manifests

  ```sh
  $ kubectl apply -f ../log-output/manifests/ingress.yaml
  ingress.networking.k8s.io/log-output-ingress created

  $ kubectl apply -f manifests
  deployment.apps/ping-pong-dep created
  service/ping-pong-svc created
  ```

- Test the application

  ```sh
  $ curl http://localhost:8081/pingpong
  pong 0
  $ curl http://localhost:8081/pingpong
  pong 1
  ```

## 1.11

- Create the directory `/tmp/kube` in the container `k3d-k3s-default-agent-0`

  ```sh
  $ docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube
  ```

- Build new images for `ping-pong` and `log-output-reader` and push them to Docker Hub

  ```sh
  $ docker build . -t vkantanen/ping-pong:1.11
  $ docker push vkantanen/ping-pong:1.11
  $ docker build . -t vkantanen/log-output-reader:1.11
  $ docker push vkantanen/log-output-reader:1.11
  ```

- Add [persistent-volume-claim.yaml](../manifests/persistent-volume-claim.yaml) and [persistent-volume.yaml](../manifests/persistent-volume.yaml) to the manifests

- Update `deployment.yaml` of [`log-output`](../log-output/manifests/deployment.yaml) and [`ping-pong`](manifests/deployment.yaml)

- Apply the manifests

  ```sh
  $ kubectl apply -f ../manifests/
  persistentvolumeclaim/ping-pong-claim created
  persistentvolume/dwk-pv created

  $ kubectl apply -f ../log-output/manifests/
  deployment.apps/log-output-dep created
  ingress.networking.k8s.io/log-output-ingress created
  service/log-output-svc created

  $ kubectl apply -f manifests
  deployment.apps/ping-pong-dep created
  service/ping-pong-svc created
  ```

- Test the application

  ```sh
  $ curl http://localhost:8081/pingpong
  pong 0

  $ curl http://localhost:8081
  2024-09-18T15:37:52.399Z: 1eef5263-ad37-4cf5-a246-ee3321299152
  Ping / Pongs: 1

  $ curl http://localhost:8081
  2024-09-18T15:38:12.421Z: 1eef5263-ad37-4cf5-a246-ee3321299152
  Ping / Pongs: 1
  
  $ curl http://localhost:8081/pingpong
  pong 1
  ```

## 2.01

See the steps from [`log-output/exercises.md`](../log-output/exercises.md#201).
