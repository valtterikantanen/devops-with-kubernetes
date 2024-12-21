## 5.04

- Create [`deployment.yaml`](./manifests/deployment.yaml), [`service.yaml`](./manifests/service.yaml), and [`ingress.yaml`](./manifests/ingress.yaml)

- Apply the manifests to the cluster

    ```bash
    kubectl apply -f manifests/
    ```

- Test the application by visiting <http://localhost:8081>. Random page will be available at <http://localhost:8081/random.html> after the first download.