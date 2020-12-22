/* 
Created by Joseph Edradan
Github: https://github.com/josephedradan

Date created: 12/18/2020

Purpose:
    Handles postimage.hs js

Details:

Description:

Notes:

IMPORTANT NOTES:

Explanation:

Reference:


*/

// Uncomment this if you want the hinting for axios (This should be uncommented for the developer)
// const axios = require('axios');

function handlerFormPost() {
    const form_block = document.getElementById('post-image');

    form_block.onsubmit = function (event) {
        event.preventDefault(); // Prevent default behavior
        let form_block_body = new FormData(form_block);

        // // Using Fetch
        // fetch('/posts/createPost', {
        //     body: form_block_body,
        //     method: "POST"
        // }).then((data) => {
        //     let message = "Image has been uploaded to the server";
        //     console.log(message);
        //     alert(message);
        //     console.log(data);

        //     // FIXME: Crashes here (don't have a way to fix, just use AXIOS)
        //     return data.json();
        // }).then((dataAsObject) => {
        //     let message = "Data is a json object";
        //     console.log(message);
        //     alert(message);
        //     console.log(dataAsObject);

        //     location.replace(dataAsObject.redirect);

        //     // Alternatively, you can reload 
        //     // location.reload();

        // }).catch(err => {
        //     console.log(err);
        // });


        // Using axios
        axios('/posts/createPost', {
            data: form_block_body,
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
            console.log(`Error: Axios Get Error for ${handlerFormPost.name}`)
            console.log(err);
        });
    }
}
function runPostImage() {
    handlerFormPost();
}
runPostImage();