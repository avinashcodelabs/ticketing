import { CustomError } from "./custom-error";

class DatabaseConnectionError extends CustomError {
    reason = 'Error connecting to database';
    statusCode = 500;
    constructor() {
        super('Error connecting to database') // this is not used by our app code, but for default server logging purpose

        // Only because we;re extending a built in class
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }

    serializeError() {
        return [{ message: this.reason }]
    }
}

export {
    DatabaseConnectionError
}