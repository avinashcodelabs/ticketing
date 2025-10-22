import { CustomError } from "./custom-error";

class BadRequestError extends CustomError {
    statusCode = 400
    message: string
    constructor(message: string) {
        super(message)
        this.message = message

        // Only because we;re extending a built in class
        Object.setPrototypeOf(this, BadRequestError.prototype)
    }

    serializeError() {
        return [{ message: this.message }]
    }
}

export {
    BadRequestError
}