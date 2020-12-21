class PostError extends Error {
    constructor(status, message, redirectURL) {
        super(message);
        this.redirectURL = redirectURL;
        this.status = status;
    }
    getMessage() {
        return this.message;
    }
    getRedirectURL() {
        return this.redirectURL;
    }
    getStatus() {
        return this.status;
    }
}

module.exports = PostError;
