/**
 * Card Component
 * @component
 * @returns {React.ReactElement} The rendered component
 */
export default function Card({children, className=''}) { return <div className={`card ${className}`}>{children}</div>; }
