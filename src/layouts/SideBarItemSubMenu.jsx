import { Link } from "react-router-dom";

export const SideBarItemSubMenu = ({ title, path }) => {
  return (
    <li className="nav-item">
      <Link className="nav-link" to={path}>
        {title}
      </Link>
    </li>
  );
};
