class apiError extends Error{
    constructor(statusCode, message, stack){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.success = false

        if (stack) {
            this.stack = stack
        }
    }
}

export {
    apiError
}