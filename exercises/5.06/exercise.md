# Exercise 5.06: Trying Serverless

## Setup

- Create a new cluster without Traefik

  ```sh
  k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2 --k3s-arg "--disable=traefik@server:0"
  ```

- Follow the instructions at <https://knative.dev/docs/install/yaml-install/serving/install-serving-with-yaml/>

- Verify the installation

  ```sh
  $ kubectl get pods -n knative-serving
  NAME                                      READY   STATUS    RESTARTS   AGE
  activator-794bf4b5f-pprxw                 1/1     Running   0          66s
  autoscaler-678cd4b756-8gvkk               1/1     Running   0          66s
  controller-749fb7bc8b-2w6q4               1/1     Running   0          66s
  net-kourier-controller-6c6b48b764-4j7xw   1/1     Running   0          13s
  webhook-7c7d966789-hhjjh                  1/1     Running   0          66s
  ```

- Don't forget to configure DNS, I used the [no DNS approach](https://knative.dev/docs/install/yaml-install/serving/install-serving-with-yaml/#__tabbed_2_3)

## Examples

### Deploying a Knative Service

```sh
$ kubectl apply -f hello.yaml
Warning: Kubernetes default value is insecure, Knative may default this to secure in a future release: spec.template.spec.containers[0].securityContext.allowPrivilegeEscalation, spec.template.spec.containers[0].securityContext.capabilities, spec.template.spec.containers[0].securityContext.runAsNonRoot, spec.template.spec.containers[0].securityContext.seccompProfile
service.serving.knative.dev/hello created

$ kubectl get ksvc                                                     
NAME    URL                                LATESTCREATED   LATESTREADY   READY   REASON
hello   http://hello.default.example.com   hello-00001     hello-00001   True    

$ curl -H "Host: hello.default.example.com" localhost:8081   
Hello World!
```

### Autoscaling

```sh
$ kubectl get pod -l serving.knative.dev/service=hello
No resources found in default namespace.

$ curl -H "Host: hello.default.example.com" localhost:8081
Hello World!

$ kubectl get pod -l serving.knative.dev/service=hello -w 
NAME                                      READY   STATUS    RESTARTS   AGE
hello-00001-deployment-75488568d9-rndsd   2/2     Running   0          4s
hello-00001-deployment-75488568d9-rndsd   2/2     Terminating   0          63s
hello-00001-deployment-75488568d9-rndsd   1/2     Terminating   0          91s
hello-00001-deployment-75488568d9-rndsd   0/2     Terminating   0          93s
hello-00001-deployment-75488568d9-rndsd   0/2     Terminating   0          93s
hello-00001-deployment-75488568d9-rndsd   0/2     Terminating   0          93s
```

### Traffic splitting

```sh
$ kubectl apply -f hello.yaml
Warning: Kubernetes default value is insecure, Knative may default this to secure in a future release: spec.template.spec.containers[0].securityContext.allowPrivilegeEscalation, spec.template.spec.containers[0].securityContext.capabilities, spec.template.spec.containers[0].securityContext.runAsNonRoot, spec.template.spec.containers[0].securityContext.seccompProfile
service.serving.knative.dev/hello configured

$ curl -H "Host: hello.default.example.com" localhost:8081
Hello Knative!

$ kubectl get revisions  
NAME          CONFIG NAME   GENERATION   READY   REASON   ACTUAL REPLICAS   DESIRED REPLICAS
hello-00001   hello         1            True             0                 0
hello-00002   hello         2            True             1                 1

$ kubectl apply -f hello.yaml
Warning: Kubernetes default value is insecure, Knative may default this to secure in a future release: spec.template.spec.containers[0].securityContext.allowPrivilegeEscalation, spec.template.spec.containers[0].securityContext.capabilities, spec.template.spec.containers[0].securityContext.runAsNonRoot, spec.template.spec.containers[0].securityContext.seccompProfile
service.serving.knative.dev/hello configured

$ kubectl get revisions                                   
NAME          CONFIG NAME   GENERATION   READY   REASON   ACTUAL REPLICAS   DESIRED REPLICAS
hello-00001   hello         1            True             0                 0
hello-00002   hello         2            True             0                 0

$ curl -H "Host: hello.default.example.com" localhost:8081
Hello World!

$ curl -H "Host: hello.default.example.com" localhost:8081
Hello Knative!

$ kubectl get revisions                                   
NAME          CONFIG NAME   GENERATION   READY   REASON   ACTUAL REPLICAS   DESIRED REPLICAS
hello-00001   hello         1            True             1                 1
hello-00002   hello         2            True             1                 1
```
