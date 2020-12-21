/* 
Created by Joseph Edradan
Github: https://github.com/josephedradan

Date created: 12/18/2020

Purpose:
    Handles js related to the page being fully loaded

Details:

Description:

Notes:

IMPORTANT NOTES:

Explanation:

Reference:
    *** How to loop through an array containing objects and access their properties
        https://stackoverflow.com/questions/16626735/how-to-loop-through-an-array-containing-objects-and-access-their-properties
            Notes:
                myArray.forEach((element, index, array) => {
                    console.log(element.x); // 100, 200, 300
                    console.log(index); // 0, 1, 2
                    console.log(array); // same myArray object 3 times
                });
*/
// Uncomment this if you want the hinting for axios (This should be uncommented for the developer)
// const axios = require('axios');


function getHTMLHomeCards(arrayObjects) {

    let baseHTML = ""

    arrayObjects.forEach((element, key, value) => {
        console.log(element);

        let tempString =
        `
        <div id="id_${element.posts_id}" class="card-container-parent">
        <div class="card-container-body-media">
            <a href="/post/${element.posts_id}">
                <img class="card-content-body-media" src="${element.posts_path_thumbnail}" />
            </a>
        </div>
        <div class="card-container-body">
            <h3 class="card-content-title">${element.posts_title}</h3>
            <h5 class="card-content-date-created">${element.posts_created}</h5>
            <h5 class="card-content-author">Author: ${element.users_username}</h5>
            <h4 class="card-content-description">Description: </h4>
            <h5 class="card-content-description">${element.posts_description}</h5>
            <a href="/post/${element.posts_id}" class="anchor-button">More Details</a>
        </div>
        </div>
        `
        baseHTML = baseHTML.concat(tempString);
    });


    return baseHTML;
}


function executeSearch() {
    /* 
    Get the results of a searched term from the server then return it back to the user by overwriting the content of the
    div with id="home-images"
    
    */
    let textTemSearched = document.getElementById('input-search-text').value;
    if (!textTemSearched) {

        // Reload the page that resets the session data
        location.replace('/');
        return;
    }
    let elementParent = document.getElementById('home-cards');
    let URLSearch = `posts/search?search=${textTemSearched}`;

    axios.get(URLSearch)
        .then((jsonData) => {
            // console.log(dataJson);

            // Axios data is should already be json so you just need the value from the data key
            let jsonDataData = jsonData.data;

            // Get the data from teh resultsSearch key
            let SQLQueryResults = jsonDataData.resultsSearch
            // console.log(SQLQueryResults);

            let HTMLHomeCards = getHTMLHomeCards(SQLQueryResults);
            // console.log(HTMLHomeCards);

            // You are assigning the main content not concatenating which will overwrite what's inside 
            elementParent.innerHTML = HTMLHomeCards;

        })
        .catch((err) => {
            console.log(`Error: Axios Get Error for ${executeSearch.name}`)
            console.log(err);
        });
}

function initializeSearchButton() {
    let buttonSearch = document.getElementById("button-search");
    if (buttonSearch) {
        buttonSearch.onclick = executeSearch;
    }
}


function initializeLogoutButton() {
    /* 
    Apply JS to the log out button,

    Notes:
        There is no such thing as a logout page so this is the CORRECT place to place
        this function
    
    */
    let element = document.getElementById("link-logout");
    if (element) {
        element.onclick = (value) => {
            fetch(
                "/users/logout",
                {
                    method: "POST"
                }
            ).then((data) => {
                location.replace("/");
            })
        };
    };
}


function runPageLoadPost() {
    /* 
    Load any essential JS on the page
    
    */

    // Apply JS to the logout button
    initializeLogoutButton();

    // Apply JS to search button
    initializeSearchButton()


}

runPageLoadPost();