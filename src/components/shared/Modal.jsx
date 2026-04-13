export default function Modal({children, isOpen}) { if(!isOpen) return null; return <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center'>{children}</div>; }
