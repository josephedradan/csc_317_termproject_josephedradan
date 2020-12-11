/* 
Created by Joseph Edradan
Github: https://github.com/josephedradan

Date created: 12/9/2020

Purpose:

Details:

Description:

Notes:

IMPORTANT NOTES:

Explanation:

Reference:


*/
function fadeThenDeleteElementByID(elementId, delay = 2000, speed = 100, step = 0.1) {
    /* 
    Fade an element given the element id
    
    */
    let element = document.getElementById(elementId);

    let fadeElement = () => {
        if (!element.style.opacity) {
            element.style.opacity = 1;
        }
        if (element.style.opacity > 0) {
            element.style.opacity -= step;
        } else {
            clearInterval(element);
            element.remove();
        };
    };

    let fader =()=>{
        setInterval(fadeElement, speed);
    }

    setTimeout(fader, delay);
}
