// ApiError ek custom error class hai
// jo JavaScript ki built-in Error class ko extend karti hai
class ApiError extends Error {
    
    // constructor tab automatically call hota hai
    // jab hum `new ApiError()` likhte hain
    constructor(
        statusCode,                         // HTTP status code (400, 401, 404, 500 etc.)
        message = "Something went wrong",   // error message (default diya gaya hai)
        errors = [],                        // extra error details (mostly validation errors)
        stack = ""                          // stack trace (optional, usually empty rehta hai),aur ye kaha kaha error ho rahe vo track krta hai
    ) {

        // super(message) parent Error class ka constructor call karta hai
        // bina iske `this` use nahi kar sakte
        // In JavaScript, when a class extends another class, you must call super() before using this.
        super(message);

        // HTTP status code ko object me store kar rahe hain
        this.statusCode = statusCode;

        // response me koi data nahi bhejna error case me
        this.data = null;

        // error message set kar rahe hain
        this.message = message;

        // agar multiple errors hain (jaise validation errors)
        // to unhe yahan store karenge
        this.errors = errors;

        // error response me success hamesha false hota hai
        this.success = false;

        // agar manually stack trace diya gaya ho
        if (stack) {
            // to usi stack trace ko assign kar do
            this.stack = stack;
        } 
        else {
            // warna JavaScript khud se
            // current class ka proper stack trace generate karegi
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// is class ko export kar rahe hain
// taaki Express controllers / middleware me use kar saken
export default ApiError;
