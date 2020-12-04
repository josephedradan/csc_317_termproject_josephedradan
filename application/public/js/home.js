/* 
Created by Joseph Edradan
Github: https://github.com/josephedradan

Date created: 

Purpose:
    JavaScript for the home page 

Details:

Description:

Notes:

IMPORTANT NOTES:

Explanation:

Reference:

*/

var cardCount = 0;

function addElementCard(title, image, id) {
    document.getElementById("home-images").insertAdjacentHTML(
        "afterbegin",
        `
        <div id="id${id}" class="div-card-container" onclick="fadeElement('id${id}')">
            <div class="card-data-container>
                <div class="card-image-container">
                    <img class="card-image" src="${image}.png" />
                </div> 
                <div class="card-info">
                    <h3 class="title">${title}</h3>
                    <h5 class="date">12/12/2020</h5>
                    <h5 class="author">Author: Square</h5>
                    <h4 class="note">Note: </h4>
                    <h5 class="description">lolrofl</h5>
                </div>
            </div>
        </div>  
        `
    );
}
{/* 

*/}

function fadeElement(elementId) {
    let element = document.getElementById(elementId);
    setInterval(function () {
        if (!element.style.opacity) {
            element.style.opacity = 1;
        }
        if (element.style.opacity > 0) {
            element.style.opacity -= 0.25;
        } else {
            clearInterval(element);
            removeElement(elementId);
        }
    }, 100);
}

function removeElement(elementId) {
    let element = document.getElementById(elementId);
    element.remove();
    cardCount--;
    displaySize(cardCount);

}

async function run() {
    let response = await axios.get("https://jsonplaceholder.typicode.com/albums/2/photos");

    cardCount = response.data.length;
    displaySize(cardCount);

    response.data.forEach(element => {
        addElementCard(element.title, element.url, element.id);
    });
}


function displaySize(size) {
    document.getElementById("count-size").innerHTML = `<p>Number cards: ${size}</p>`;
}

run();
