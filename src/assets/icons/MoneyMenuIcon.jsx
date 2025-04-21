export function MoneyMenuIcon({
  size = 24,
  color = "currentColor",
  strokeWidth = 1,
  ...props
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 3V21M15.679 6.63439C14.063 4.2691 7.94541 4.02196 7.94541 8.16745C7.94541 12.3129 16.7524 10.33 16.2439 15.2118C15.8199 19.2823 9.19299 19.3384 7.21094 16.0891"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}
