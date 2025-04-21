export const SideBarItem = ({
  IconComponent,
  title,
  hasSubItem = false,
  href,
  children,
}) => {
  return (
    <li className="nav-item">
      <a
        className="nav-link"
        href={`#${href}`}
        {...(hasSubItem && {
          "data-toggle": "collapse",
          "aria-expanded": "false",
          "aria-controls": href,
        })}
      >
        <span className="icon-bg">
        {IconComponent && <IconComponent size={20} color="#ffffff" strokeWidth={1.3} /> }
        </span>
        <span className="menu-title">{title}</span>
      </a>
      {hasSubItem && children}
    </li>
  );
};
