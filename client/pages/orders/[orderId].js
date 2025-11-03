import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import StripeCheckout from "react-stripe-checkout";
import { useRequest } from "../../hooks/use-request";

const OrderShow = ({ order, currentUser }) => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "POST",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => {
      console.log(payment);
      router.push("/orders");
    },
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft(); // this starts the timer from 0th second, because setinterval gets called only after 1second
    const timer = setInterval(findTimeLeft, 1000); // this after 2 sec and every 1second

    return () => {
      clearInterval(timer);
    };
  }, []);

  if (timeLeft < 0) {
    return <div>Order expired</div>;
  }

  return (
    <div>
      Time left to pay: {timeLeft} seconds.
      <StripeCheckout
        // Send this token id to backend to in order to complete the payment
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51SP0LKFVrpgVxuSv10plEqzteJ5ANBJL3yXm12XClW24yCdrri0WTCJG1m6Xc3IG2YoNLs5l4mnz3Z1t7ji1gf8c00kgMCtDoF"
        amount={order.ticket.price}
        email={currentUser.email}
      />
      <>{errors}</>
    </div>
  );
};

OrderShow.getInitialProps = async (ctx, client, currentUser) => {
  const { orderId } = ctx.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;
