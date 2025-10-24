import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    // It is server
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
