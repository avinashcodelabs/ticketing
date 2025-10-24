import { buildClient } from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  return <h1>{currentUser ? "You are signed in" : "You are NOT signed in"}</h1>;
};

LandingPage.getInitialProps = async (ctx) => {
  const axios = buildClient(ctx);
  const { data } = await axios.get("/api/users/currentuser");
  return data;
};

export default LandingPage;
