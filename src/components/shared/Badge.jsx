/**
 * Badge Component
 * @component
 * @returns {React.ReactElement} The rendered component
 */
export default function Badge({children}) { return <span className='px-2 py-1 text-xs rounded-full bg-secondary-container text-primary-fixed-variant'>{children}</span>; }
