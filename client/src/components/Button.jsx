export default function Button({as:Comp='a', className='', children, ...props}){
    return (
    <Comp className={`px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 transition-colors shadow-glow ${className}`} {...props}>
    {children}
    </Comp>
    )
    }