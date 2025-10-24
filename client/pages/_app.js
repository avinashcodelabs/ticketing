import { buildClient } from "../api/build-client";
import "bootstrap/dist/css/bootstrap.css";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser}></Header>
      <Component {...pageProps} />;
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const axios = buildClient(appContext.ctx);
  const { data } = await axios.get("/api/users/currentuser");

  // why are we invoking  getInitialProps of index.js like this?
  // because when we put getInitialProps on _app.js next.js in
  // not calling the currently running page i.e. index.js
  // that why this workaround
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return { pageProps, ...data };
};

export default AppComponent;
