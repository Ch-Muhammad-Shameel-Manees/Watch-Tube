const Button = ({ onClick, type = "button", className, disabled = false, children, ...props }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${className} ${disabled ? "bg-gray-400 cursor-not-allowed text-black" : "bg-gray-900 cursor-pointer text-gray-200"}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;

