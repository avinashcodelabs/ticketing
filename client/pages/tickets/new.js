import { useState } from "react";
import { useRouter } from "next/router";
import { useRequest } from "../../hooks/use-request";

const NewTicket = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "POST",
    body: { title, price },
    onSuccess: (ticket) => {
      router.push("/");
      console.log(ticket);
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Create a Ticket</h1>
      <div className="form-group my-3">
        <label>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group my-3">
        <label>Price</label>
        <input
          value={price}
          onBlur={onBlur}
          onChange={(e) => setPrice(e.target.value)}
          className="form-control"
        />
      </div>
      <>{errors}</>
      <button className="btn btn-primary">Submit</button>
    </form>
  );
};

export default NewTicket;
