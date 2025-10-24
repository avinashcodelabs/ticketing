import Link from "next/link";

const Header = ({ currentUser }) => {
  // These /auth/sign* links are Next.js page routes not AUTH service links
  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ].filter((v) => v);

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href={"/"} className="navbar-brand">
        ticketing
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {links.map((link) => (
            <li className="nav-item" key={link.label}>
              <Link className="nav-link" href={`${link.href}`}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
