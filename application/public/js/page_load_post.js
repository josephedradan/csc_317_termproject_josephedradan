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


*/

function handlerLogoutButton() {
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

function runPageLoadPost(){
    /* 
    Load any essential JS on the page
    
    */

    // Apply JS to the logout button
    handlerLogoutButton();
}

runPageLoadPost();