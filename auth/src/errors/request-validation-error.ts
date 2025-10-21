
import type { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

class RequestValidationError extends CustomError {
    errors: ValidationError[];
    statusCode = 400;
    constructor(errors: ValidationError[]) {
        super("Invalid request parameters") // this is not used by our app code, but for default server logging purpose
        this.errors = errors;

        // Only because we;re extending a built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }

    serializeError() {
        const formattedErrors = this.errors.map(error => {
            if (error.type === 'field') {
                return { message: error.msg, field: error.path }
            }
            return { message: error.msg }
        })
        return formattedErrors
    }
}

export {
    RequestValidationError
}