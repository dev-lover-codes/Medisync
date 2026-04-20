/**
 * Button Component
 * @component
 * @returns {React.ReactElement} The rendered component
 */
export default function Button({children, variant='primary', className='', ...props}) { return <button className={`btn btn-${variant} ${className}`} {...props}>{children}</button>; }
