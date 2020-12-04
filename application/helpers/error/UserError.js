class PostError extends Error{
    constructor(message, redirectURl, status){
        supper(meeages);
        this.redirectURl = redirectURl;
        this.status = status;

    }
    getMessage(){
        return this.message;
    }

    getRedirectURL(){
        return this.getRedirectURL;
    }
    getStatus(){
        return this.status;
    }
}
module.exports = PostError;