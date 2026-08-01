import { forwardRef } from "react";

const Input = forwardRef(({ label, type= "text", error, className, containerClassName, placeholder, ...props }, ref) => {
  return (
    <div className={`flex flex-col gap-1 ${containerClassName}`}>
        <label className="text-lg font-medium text-gray-200">{label}</label>
        <input
            ref={ref}
            type={type}
            className={ className ? className : `border rounded-md py-2 px-3 focus:outline-none ${error ? 'border-red-500' : 'border-gray-300'}`}
            placeholder={placeholder}
            {...props}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
});

export default Input;