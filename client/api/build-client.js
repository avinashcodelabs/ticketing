import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    // It is server
    // http://service-name-find-in-service-pods.namspace-name-which-this-serivce-created.svc.cluster.local
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: {
        ...req.headers,
        Host: "ticketing.dev",
      },
    });
  } else {
    // It is browser
    return axios.create({
      baseURL: "",
    });
  }
};
export { buildClient };
