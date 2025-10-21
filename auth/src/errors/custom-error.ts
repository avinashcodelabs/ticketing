abstract class CustomError extends Error {
    abstract statusCode: number

    // Only because we;re extending a built in class
    constructor(message: string) { // this 'message' is not used by our app code, but for default server logging purpose
        super(message) // this 'message' is not used by our app code, but for default server logging purpose
        // Only because we;re extending a built in class
        Object.setPrototypeOf(this, CustomError.prototype)
    }

    abstract serializeError(): { message: string, field?: string }[]
}

export {
    CustomError
}