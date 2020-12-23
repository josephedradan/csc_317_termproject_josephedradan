/* 
Created by Joseph Edradan
Github: https://github.com/josephedradan

Date created: 12/22/2020

Purpose:
    Handles comments-hbs

Details:

Description:

Notes:

IMPORTANT NOTES:

Explanation:

Reference:


*/

// Uncomment this if you want the hinting for axios (This should be uncommented for the developer)
// const axios = require('axios');

function initializePostComment() {
    let elementButtonSubmitComment = document.getElementById('comment-button');



    elementButtonSubmitComment.onclick = function (event) {

        // console.log("Comment Button!")

        let elementTextareaComment = document.getElementById('comment-box-textarea');

        let commentGiven = elementTextareaComment.value;
    
        let postID = document.location.pathname.match(/\d+/g).map(Number)[0];

        // console.log(commentGiven);

        if (!commentGiven) {
            return;
        }
        // Using axios
        axios('/comments/createComment', {
            data:
            {
                comment_post_id: postID,
                comment_comment: commentGiven,
            },
            method: "POST"
        })
            .then((jsonData) => {

                // Debugging data
                // console.log("DEBUG: data")
                // console.log(data);

                // The data has a a Data key
                let jsonDataData = jsonData.data;

                // Debugging jsonDataData
                // console.log("DEBUG: dataOfData")
                // console.log(dataOfData);

                // alert(jsonDataData.message);

                // Redirect the user based on the response
                location.replace(jsonDataData.redirect);

            }).catch(err => {
                console.log(`Error: Axios Get Error for ${initializePostComment.name}`)
                console.log(err);
            });
    }
}

function runPostComment() {
    // console.log(`Running ${runPostComment.name}`)

    initializePostComment();
}
runPostComment();