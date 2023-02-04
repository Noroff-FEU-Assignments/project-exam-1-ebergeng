const header = document.querySelector(".header-menu");
const hamburger = document.querySelector(".hamburger");


let openMenu = false;
hamburger.addEventListener("click", function() {
    if(openMenu) {
        header.style.height = "60px"
        openMenu = false;
        hamburger.innerHTML = `<img src="/images/haburger_icon.png" alt="icon for open haborgermenu"></img>`

    }
    else {
        header.style.height = "60vh"
        openMenu = true;
        hamburger.innerHTML = `<img src="/images/close_haburger_icon.png" alt="icon for close haborgermenu"></img>`
    }
})