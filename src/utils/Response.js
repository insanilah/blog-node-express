// src/utils/ApiResponse.js
class Response {
    constructor(code, message, data = null) {
        this.code = code;
        this.message = message;
        this.data = data;
    }
}

export default Response;
