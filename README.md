# book-it

## Follow the below steps to run the app local machine (macOS)

1. Install Docker Desktop (https://www.docker.com/get-started/)
2. Make sure Docker Desktop installed - `docker version`
3. Setup Kubernetes Cluster on Docker Desktop (https://www.docker.com/blog/how-to-set-up-a-kubernetes-cluster-on-docker-desktop/) or minikube also could be used.
4. Ensure kubectl works - `kubectl version`
5. Install `skaffold` - https://skaffold.dev/docs/install/
6. Ensure skaffold works - `skaffold version`
7. Clone the repo - `git clone https://github.com/avinashcodelabs/ticketing.git`
8. Build docker image of each microservice and push them to Docker Hub (https://hub.docker.com/repositories/avinashcodelabs)
   1. `docker build -t avinashcodelabs/auth auth  && docker push avinashcodelabs/auth`
   2. `docker build -t avinashcodelabs/client client && docker push avinashcodelabs/client`
   3. `docker build -t avinashcodelabs/expiration expiration && docker push avinashcodelabs/expiration`
   4. `docker build -t avinashcodelabs/orders orders && docker push avinashcodelabs/orders`
   5. `docker build -t avinashcodelabs/payments payments && docker push avinashcodelabs/payments`
   6. `docker build -t avinashcodelabs/tickets tickets && docker push avinashcodelabs/tickets`
9. Modify hosts file to redirect `127.0.0.1 ticketing.dev` to have k8s loadbalancer domain name.
10. Create k8s load balancer, ingress-nginx `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.13.3/deploy/static/provider/cloud/deploy.yaml` from https://kubernetes.github.io/ingress-nginx/deploy/#quick-start.
11. Same script has been downloaded and will run as part of `skaffold dev` stored at => infra/k8s-dev/setup-loadbalancer-ingress-controller.yaml . This setup will create and destroy every time I start and stop the skaffold. Better to follow the point 11 and delete this script from the directory.
12. Create 2 secrets
    1. `kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=GETITFROMSTRIEDEVELOPERTOOLAPIKEYS`
    2. `kubectl create secret generic jwt-secret --from-literal JWT_KEY=ITCOULDBEANYTHING`
13. Start the app using below command (it automatically creates all the k8s objects - Deployments, Services, Pods etc and destroys them when it stopped)
    `ticketing > skaffold dev`
14. App UI available at `https://ticketing.dev`
15. App API available at `https://ticketing.dev/api/users/signup`

## REST APIs spec

Postman API collection at ticketing/ticketing.postman_collection.json

## NATS Streaming Server

1. NATS Streaming docker image - https://hub.docker.com/_/nats-streaming
2. NATS Streaming docs - https://nats-io.gitbook.io/legacy-nats-docs/ nats-streaming-server-aka-stan/developing-with-stan
3. NATS Streaming - node.js client - https://www.npmjs.com/package/node-nats-streaming

### NATS monitoring service

1. http://localhost:8222/streaming
2. http://localhost:8222/streaming/clientsz?subs=1

## Stripe integration - stripe.com

1. Test credit card numbers = https://docs.stripe.com/testing#cards
2. Stripe checkout component - https://www.npmjs.com/package/react-stripe-checkout
3. Enable this => Enable card data collection with a publishable key without using Stripe's pre-built UI elements at https://dashboard.stripe.com/settings/integration in order above component to work.
4. To test ticketing payment in Postman, we can use test token `tok_visa` this always works.

## Debug

In order to decrypt the jwt token,

1. Take JWT from cookie.
2. Use https://www.base64decode.org/ to convert from base64 to utf-8 string
3. Copy 'jwt' key value from it.
4. Paste that into https://www.jwt.io/ to decode it and see the payload

## Miscellaneous

1. Docker Desktop K8S (single-node) -> kind (multi-node)
2. node -> bun
3. express -> fastify
4. express-validator -> zod
5. skaffold -> tilt.dev or devspace.sh
6. Nextjs Pages Router -> App Router
7. Find proper way to automate creating secret in k8s. Helm config can recognize(resolve) .env file keys and skaffold will take care of running yaml file as usual? for now, problem is k8s config files wont recognize from .env keys. or else bash script to generate yaml files on the file by reading .env keys and run that yaml through skaffold
8. Add dev and prod mode config files like watch files in dev mode and build in prod mode etc
9. Add one more microservice as notification service(SMS or Email).
10. POSTMAN collection to Swagger UI or any other OpenAPI standards UI.
