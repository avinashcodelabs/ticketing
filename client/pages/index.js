import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {
  return (
    <div>
      {/* <h1>{currentUser ? "You are signed in" : "You are NOT signed in"}</h1> */}
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => {
            return (
              <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>{ticket.price}</td>
                <td>
                  <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                    View
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (ctx, client, currentUser) => {
  const { data } = await client.get("/api/tickets");
  return { tickets: data };
};

export default LandingPage;
