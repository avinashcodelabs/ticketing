# BookMy

Run this command once to create nginx based k8s loadbalancer along with ingress based routing controller.
No need to create or destroy every-time with skaffold dev/stop.
ticketing > `kubectl apply -f ./infra/setup-loadbalancer-ingress-controller.yaml`

OR

Get it from https://kubernetes.github.io/ingress-nginx/deploy/#quick-start

ticketing > `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.13.3/deploy/static/provider/cloud/deploy.yaml`

Start the app using below command (it automatically creates all the k8s objects- Deployments, Services, Pods etc and destroys them when it stopped)
`ticketing > skaffold dev`

Run this command to create all secrets.
ticketing > kubectl create secret generic jwt-secret --from-env-file=./infra/k8s/.env

To update secret (whenver we make change(add/modify/remove) in .env file)
ticketing > kubectl create secret generic jwt-secret --from-env-file=./infra/k8s/.env --dry-run=client -o yaml | kubectl apply -f -

content of .env
JWT_KEY=

## To Update: Stripe key ---

kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=GETITFROMSTRIEDEVELOPERTOOL

STRIPE_KEY=
Access it via process.env.STRIPE_KEY

App UI available at `https://ticketing.dev`
App API available at `https://ticketing.dev/api/users/signup`

NATS Streaming docker image - https://hub.docker.com/_/nats-streaming
NATS Streaming docs - https://nats-io.gitbook.io/legacy-nats-docs/nats-streaming-server-aka-stan/developing-with-stan
NATS Streaming - node.js client - https://www.npmjs.com/package/node-nats-streaming
Stripe - stripe.com

---

Docker Desktop K8S (single-node) -> kind (multi-node)
node -> bun
express -> fastify
express-validator -> zod
skaffold -> tilt.dev or devspace.sh
Nextjs Pages Router -> App Router
Find proper way to automate creating secret in k8s. Helm config can recognize(resolve) .env file keys and skaffold will take care of running yaml file as usual? for now, problem is k8s config files wont recognize from .env keys. or else bash script to generate yaml files on the file by reading .env keys and run that yaml through skaffold.

## NATS monitoring service

- http://localhost:8222/streaming
- http://localhost:8222/streaming/clientsz?subs=1

in order to decrypt the jwt token,

1. take JWT from cookie.
2. use https://www.base64decode.org/ to convert from base64 to utf-8
3. copy 'jwt' key value
4. paste that into https://www.jwt.io/ to decode it and see the payload
