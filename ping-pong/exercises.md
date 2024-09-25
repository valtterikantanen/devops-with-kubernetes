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

## 2.03

- Create a namespace `dwk-exercises`

  ```sh
  $ kubectl create namespace dwk-exercises
  namespace/dwk-exercises created
  ```

- Update the manifests to use the namespace `dwk-exercises`

## 2.07

- Build a new image for `ping-pong` and push it to Docker Hub

  ```sh
  $ docker build . -t vkantanen/ping-pong:2.07
  $ docker push vkantanen/ping-pong:2.07
  ```

- Create a key pair with `age` and save it where `sops` can find it

  ```sh
  $ mkdir -p ~/.config/sops/age
  $ age-keygen -o ~/.config/sops/age/keys.txt
  Public key: age1ng3clrslk9jrqhjtp4yev3x33qwlt2tp58j5na5qm6mevej6hdxslhcqq2
  ```

- Create `secret.yaml` and [`postgres.yaml`](./manifests/postgres.yaml) and update [`deployment.yaml`](./manifests/deployment.yaml)

- Encrypt the `secret.yaml` with `sops` and delete the original file

  ```sh
  $ sops --encrypt \
         --age age1ng3clrslk9jrqhjtp4yev3x33qwlt2tp58j5na5qm6mevej6hdxslhcqq2 \
         --encrypted-regex '^(data)$' \
         manifests/secret.yaml > manifests/secret.enc.yaml
  $ rm manifests/secret.yaml
  ```

- Apply the manifests

  ```sh
  $ sops --decrypt manifests/secret.enc.yaml | kubectl apply -f -
  secret/postgres-secret created

  $ kubectl apply -f manifests/deployment.yaml,manifests/postgres.yaml,manifests/service.yaml
  deployment.apps/ping-pong-dep created
  statefulset.apps/postgres-sts created
  service/postgres-svc created
  service/ping-pong-svc created
  ```

- Test the application

  ```sh
  $ curl http://localhost:8081/
  file content: This text is from a file

  env variable: MESSAGE=Hello, World!
  2024-09-25T18:39:15.619Z: b5dc2195-4d8d-481e-b648-3a18f2d35848
  Ping / Pongs: 0

  $ curl http://localhost:8081/pingpong
  pong 1

  $ curl http://localhost:8081/
  file content: This text is from a file

  env variable: MESSAGE=Hello, World!
  2024-09-25T18:39:35.644Z: b5dc2195-4d8d-481e-b648-3a18f2d35848
  Ping / Pongs: 1

  $ kubectl delete -f manifests/
  deployment.apps "ping-pong-dep" deleted
  statefulset.apps "postgres-sts" deleted
  service "postgres-svc" deleted
  secret "postgres-secret" deleted
  service "ping-pong-svc" deleted

  $ sops --decrypt manifests/secret.enc.yaml | kubectl apply -f -
  secret/postgres-secret created

  $ kubectl apply -f manifests/deployment.yaml,manifests/postgres.yaml,manifests/service.yaml
  deployment.apps/ping-pong-dep created
  statefulset.apps/postgres-sts created
  service/postgres-svc created
  service/ping-pong-svc created

  $ curl http://localhost:8081/pingpong
  pong 2

  $ kubectl get pods
  NAME                              READY   STATUS    RESTARTS   AGE
  log-output-dep-7559b48b44-9x4bs   2/2     Running   0          3m30s
  ping-pong-dep-665c7747-c44lc      1/1     Running   0          61s
  postgres-sts-0                    1/1     Running   0          60s

  $ kubectl exec postgres-sts-0 -- psql -U postgres -c "SELECT * FROM pongs"
   id | count 
  ----+-------
    1 |     2
  (1 row)
  ```
