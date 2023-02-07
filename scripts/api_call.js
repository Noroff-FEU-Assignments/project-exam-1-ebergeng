import  { api_call, comments_amount, generate_posts} from "./functions.js"

const postWrapper = document.querySelector(".wrapper");
var mobileSize = window.matchMedia("(max-width: 1000px)");
const morePosts = document.querySelector(".more-posts");
const filter = document.querySelector(".filter");


let posts = []; /*a list where i store all the posts*/ 
let pos = 1; // pos = position, to know what post are in focus in the carusell
let mobile = true; //if screensize is for mobilephone


//api-call to wordpress api, gitting all the posts
async function get_all_posts() {
    let data = await api_call()

    if(data){
        data.forEach(element => {  
            let post = generate_posts(element);//sending each post to function that will gather the data i need for my site, and then put it in the posts list.          
            posts.push(post)
        });
    if(mobileSize.matches) {
        mobile = true;
        pos = 1;
        filter.style.display = "none";
    }

    else {
        mobile = false;
        morePosts.style.display = "none";
        pos = 0;
    }
    mobileSize.addListener(check_screen_size);
    add_post_to_page();
    }

    else {
        postWrapper.innerHTML = "Looks like there was a problem on our side, pleas try again later"
    }
}

function add_post_to_page() {

    morePosts.style.display = "block"
    const loader = document.querySelector(".big_load");
    const carusel = document.querySelector(".carusel");
    const caruselContent = document.querySelector(".carusel-content");
    let className;
    let headline;

    if(!mobile){
        carusel.style.backgroundImage = `url(${posts[pos].img})`;
        morePosts.style.display = "none"
    }


    for(let i = 0; i < 3; i++){
        try {
            if(!mobile) {
                if(i===0) {
                    className = "old";
                    try {
                        headline = `<h3>${posts[pos + i - 1].title}</h3>`;
                    }

                    catch(err) {
                        console.log(err);
                    }        
                }

                else if(i===1){
                    className = "current"
                    headline = `<h2>${posts[pos + i - 1].title}</h2>`;
                }

                else{
                    className = "next"
                    try {
                        headline = `<h3>${posts[pos + i - 1].title}</h3>`;
                    }
                    catch(err) {
                        console.log(err)
                    }
                }
            }

            else {
                headline = `<h2>${posts[pos + i - 1].title}</h2>`;
                className = "current";
            }  
        }

        catch(err) {
            morePosts.style.display = "none";
        }

        try{
            caruselContent.innerHTML += `<div class="post-wrapper ${className}" id="${posts[pos + i - 1].id}">
                                    ${headline}
                                    <div class="img-holder"><img src="${posts[pos + i - 1].img}" alt=""></div>
                                    ${posts[pos + i - 1].sum +`<p class="read-more">Read more..</p>`}
                                    
                                    <div class="post-info">
                                        <p class="date">Posted: ${posts[pos + i - 1].date}</p>
                                        <div class="comments">
                                            <img src="../images/commentv2.png" alt="icon for comments">
                                            <div id="${posts[pos + i - 1].id}" class="numOfComments">
                                                <div class="loading"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
            loader.style.display = "none";
                                
        }
        catch(err) {
            caruselContent.innerHTML += `<div class="${className}" style="width:0;"></div>`;
        }
        let allCom = document.querySelectorAll(".numOfComments");
        allCom.forEach(async function(element) {
            let numberOfComment = await comments_amount(element);
            element.innerHTML = numberOfComment
        })
    }

    if(!mobile) {
        let old = document.querySelector(".old");
        old.addEventListener("click", function() {
            pos -= 1;
            caruselContent.innerHTML = "";
            add_post_to_page();
        })
    }

    if(mobile){
        let current = document.querySelectorAll(".current");
        current.forEach(element => {
            element.addEventListener("click", function() {
                window.location.assign(`selected_post.html?id=${element.id}`);
            })
        })
    }

    else {
        let current = document.querySelector(".current");
        current.addEventListener("click", function() {
            window.location.assign(`selected_post.html?id=${posts[pos].id}`);
        })
    }

    if(!mobile){
        let next = document.querySelector(".next");
        next.addEventListener("click", function() {
            pos += 1;
            caruselContent.innerHTML = "";
            add_post_to_page();
        })
    }   
}

function check_screen_size() {
    location.reload();
}

morePosts.addEventListener("click", function() {
    if(mobile){
        pos += 3;
    }
    add_post_to_page();
})

get_all_posts();