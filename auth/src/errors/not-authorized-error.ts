import { CustomError } from "./custom-error";

class NotAuthorizedError extends CustomError {
    statusCode = 401
    constructor() {
        super("Not authorized")

        // Only because we;re extending a built in class
        Object.setPrototypeOf(this, NotAuthorizedError.prototype)
    }

    serializeError() {
        return [{ message: "Not authorized" }]
    }
}

export {
    NotAuthorizedError
}