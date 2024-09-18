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
