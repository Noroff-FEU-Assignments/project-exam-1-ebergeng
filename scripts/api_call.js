const postWrapper = document.querySelector(".wrapper");
var mobileSize = window.matchMedia("(max-width: 1000px)");
const morePosts = document.querySelector(".more_posts");
const filter = document.querySelector(".filter");


let posts = []
let pos = 1
let mobile = true

const baseUrl = "https://myflashcard.org/wp-json/";
const postUrl = "wp/v2/posts"
const commentUrl = "wp/v2/comments"
async function apiCall() {
    try {
        let respons = await fetch(baseUrl + postUrl);
        let data = await respons.json()
        
        data.forEach(element => {
            console.log(element)
            
            generate_posts(element)
            
        });
    }
    catch(err) {
        console.log(err)
    }
    
    if(mobileSize.matches) {
        mobile = true
        pos = 1
        filter.style.display = "none"
    }

    else {
        mobile = false
        morePosts.style.display = "none"
        pos = 0
    }
    mobileSize.addListener(check_screen_size)
    add_post_to_page()
}

function generate_posts(data) {
    let post = {}
    post.id = data.id
    post.img = data.yoast_head_json.og_image[0].url;
    post.title = data.title.rendered;
    let sum = ""
    for(let i = 0; i < 150; i++) {
        sum += data.excerpt.rendered[i]
    }
    sum += "..</p>"
    post.sum = sum
    let date = ""
    for(let i = 0; i < 10; i++) {
        date += data.date[i]
    }
    post.date = date
    posts.push(post)
}


function add_post_to_page() {
    const loader = document.querySelector(".big_load");
    const carusel = document.querySelector(".carusel")
    if(!mobile){
        carusel.style.backgroundImage = `url(${posts[pos].img})`
    }
    

    const caruselContent = document.querySelector(".carusel-content")
    let className;
    let headline;
    for(let i = 0; i < 3; i++){
        try {
            if(!mobile) {
                if(i===0) {
                    className = "old"
                    try {
                        headline = `<h3>${posts[pos + i - 1].title}</h3>`
                    }
                    catch(err) {
                        console.log(err)
                    }        
                }
                else if(i===1){
                    className = "current"
                    headline = `<h2>${posts[pos + i - 1].title}</h2>`
                }
                else{
                    className = "next"
                    try {
                        headline = `<h3>${posts[pos + i - 1].title}</h3>`
                    }
                    catch(err) {
                        console.log(err)
                    }
                }
            }
            else {
                headline = `<h2>${posts[pos + i - 1].title}</h2>`
                className = "current"
            }  
        }
        catch(err) {
            console.log("no more posts")
            morePosts.style.display = "none"
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
                                </div>`
            loader.style.display = "none";
                                
        }
        catch(err) {
            caruselContent.innerHTML += `<div class="${className}" style="width:0;"></div>`
        }
        let allCom = document.querySelectorAll(".numOfComments")
        allCom.forEach(e => {
            comments(e)
        })
    }

    if(!mobile) {
        let old = document.querySelector(".old");
        old.addEventListener("click", function() {
            pos -= 1
            caruselContent.innerHTML = ""
            add_post_to_page()
        })

    }

    if(mobile){
        let current = document.querySelectorAll(".current");
        current.forEach(element => {
            element.addEventListener("click", function() {
                window.location.assign(`selected_post.html?id=${element.id}`)
                console.log(element)
            })
        })
    }
    else {
        let current = document.querySelector(".current");
        current.addEventListener("click", function() {
            window.location.assign(`selected_post.html?id=${posts[pos].id}`)
        })
    }


    if(!mobile){
        let next = document.querySelector(".next");
        next.addEventListener("click", function() {
            pos += 1
            caruselContent.innerHTML = ""
            add_post_to_page()
        })
    }
    
}

function check_screen_size(x) {
    location.reload();
}


async function comments(element) {
    let postId = `?post=${element.id}`
    
    try {
        let respons = await fetch(baseUrl + commentUrl + postId);
        let data = await respons.json()
        let len = data.length
        element.innerHTML = len

    }
    catch(err) {
        console.log(err)
    }
}

morePosts.addEventListener("click", function() {
    if(mobile){
        pos += 3
    }
    add_post_to_page()
})



apiCall()