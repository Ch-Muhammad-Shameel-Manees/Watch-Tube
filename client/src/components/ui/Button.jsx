const Button = ({ onClick, type = "button", className, disabled = false, children, ...props }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`cursor-pointer ${className} ${disabled ? "bg-gray-400 cursor-wait text-black" : "bg-gray-900 text-gray-200"}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;

