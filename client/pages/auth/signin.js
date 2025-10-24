import { useState } from "react";
import { useRouter } from "next/router";
import { useRequest } from "../../hooks/use-request";

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signin",
    method: "POST",
    body: { email, password },
    onSuccess: (res) => {
      router.push("/");
      console.log(res);
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign In</h1>
      <div className="form-group my-3">
        <label>Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group my-3">
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="form-control"
        />
      </div>
      <>{errors}</>
      <button className="btn btn-primary">Sign In</button>
    </form>
  );
};

export default SignIn;
