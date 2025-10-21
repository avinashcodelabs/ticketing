import { CustomError } from "./custom-error";

class NotFoundError extends CustomError {
    statusCode = 404;
    constructor() {
        super('Route not found') // this is not used by our app code, but for default server logging purpose

        // Only because we;re extending a built in class
        Object.setPrototypeOf(this, NotFoundError.prototype)
    }

    serializeError() {
        return [{ message: "Not found" }]
    }
}

export {
    NotFoundError
}