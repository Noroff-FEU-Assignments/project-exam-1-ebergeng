import  { api_call, comments_amount, generate_posts} from "./functions.js"

const search = document.querySelector("#searchInput");

const wrapper = document.querySelector(".wrapper");
const bigLoader = document.querySelector(".big_load");
const morePosts = document.querySelector(".more-posts");

const posts = [];
let displayedPost = []; //a list where i store the posts that are being displayed



async function gett_all_posts() {
    try {
        let data = await api_call();
        data.forEach(element => {
            let post = generate_posts(element);
            posts.push(post);
        });
        posts.reverse();
        add_post_to_page();
    }
    catch(err) {
        console.log(err);
        wrapper.innerHTML = "Looks like there was a problem on our side, pleas try again later";
    }
}

function add_post_to_page() {
    displayedPost = [];
    
    for(let i=0; i < 10; i++) {
        displayedPost.push(posts.pop(i));
    }

    
    bigLoader.style.display = "none";
    displayedPost.forEach(post => {
        if(post.display) {
            let html = `<div class="post-wrapper current" id="${post.id}">
                            <h2>${post.title}</h2>
                            <div class="img-holder"><img src="${post.img}" alt=""></div>
                            ${post.sum +`<p class="read-more">Read more..</p>`}
                            
                            <div class="post-info">
                                <p class="date">Posted: ${post.date}</p>
                                <div class="comments">
                                    <img src="../images/commentv2.png" alt="icon for comments">
                                    <div id="${post.id}" class="numOfComments">
                                        <div class="loading"></div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
            wrapper.innerHTML += html;
        }

    })

    let allCom = document.querySelectorAll(".numOfComments");
    allCom.forEach(async function(element) {
        let numberOfComment = await comments_amount(element);
        element.innerHTML = numberOfComment;
    })

    let current = document.querySelectorAll(".current");
    current.forEach(element => {
        element.addEventListener("click", function() {
            window.location.assign(`selected_post.html?id=${element.id}`);
        })
    })

    if(posts.length === 0) {
        morePosts.style.display = "none";
    }
}

search.addEventListener("input", function() {
    let searchWord = this.value.toLowerCase() ;
    posts.forEach(post => {
        let title = post.title.toLowerCase();
        if(title.includes(searchWord)) {
           post.display = true;
        }
        else {
            post.display = false;
        }
    })

    add_post_to_page();
})



morePosts.addEventListener("click", function() {
    try {
        add_post_to_page();
    }
    catch (err) {
        console.log("no more posts");
    }
})

gett_all_posts()
