export function GlobeIcon({
  size = 24,
  color = "currentColor",
  strokeWidth = 1,
  ...props
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      enableBackground="new 0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      
      <path fill="none" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" d="M32.001,0.887c17.184,0,31.113,13.929,31.112,31.113
	C63.114,49.185,49.184,63.115,32,63.113C14.815,63.114,0.887,49.185,0.888,32.001C0.885,14.816,14.815,0.887,32.001,0.887z"/>
<line fill="none" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" x1="32" y1="1" x2="32" y2="63"/>
<line fill="none" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" x1="63" y1="32" x2="1" y2="32"/>
<path fill="none" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" d="M30,1c0,0-14,11-14,31s14,31,14,31"/>
<path fill="none" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" d="M34,1c0,0,14,11,14,31S34,63,34,63"/>
<path fill="none" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" d="M8,12c0,0,5,10,24,10s24-10,24-10"/>
<path fill="none" stroke={color} strokeWidth={strokeWidth} strokeMiterlimit="10" d="M8,52c0,0,5-10,24-10s24,10,24,10"/>
    </svg>
  );
}
