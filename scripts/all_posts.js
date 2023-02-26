import  {comments_amount} from "./functions.js"
const search = document.querySelector("#searchInput");

const wrapper = document.querySelector(".wrapper");
const bigLoader = document.querySelector(".big_load");
const morePosts = document.querySelector(".more-posts");

const baseUrl = "https://myflashcard.org/wp-json/wp/v2/posts?per_page=10&";
let page = 1;
let posts = [];

async function api_call(url) {
    let data = "";
    posts = [];
    try {
        let respons = await fetch(baseUrl + url);
        data = await respons.json();
        if(respons.ok) {
            data.forEach(post => {
                posts.push(post);
            })
            if(posts.length < 10) {
                morePosts.style.display = "none";
            }
            bigLoader.style.display = "none";
            generate_posts();
        }
        else {
            morePosts.style.display = "none";
        }
    }
    catch(err) {
        wrapper.innerHTML = "Looks like there was a problem on our side, pleas try again later";
        console.log(err);
    }
}

function generate_posts () {
    posts.forEach(post => {
        let sum = "";
        for(let i = 0; i < 150; i++) {
            sum += post.excerpt.rendered[i];
        }
        sum += "..</p>";
        
        let html = `<div class="post-wrapper current" id="${post.id}">
                        <h2>${post.title.rendered}</h2>
                        <div class="img-holder"><img src="${post.yoast_head_json.og_image[0].url}" alt=""></div>
                        ${sum +`<p class="read-more">Read more..</p>`}
                        
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
}

morePosts.addEventListener("click", function() {
    page += 1;
    api_call(`page=${page}`);
})

search.addEventListener("input", async function() {

    let searchWord = this.value.toLowerCase();
    
    if(searchWord) {
        let respons = await fetch(baseUrl + `search=${searchWord}`);
        let data = await respons.json();
        posts = [];
        data.forEach(post => {
            let postTitle = post.title.rendered.toLowerCase();
            if(postTitle.includes(searchWord)) {
                posts.push(post);
                wrapper.innerHTML = "";
                generate_posts();
            }
        })   
    }
    else {
        wrapper.innerHTML = ""
        api_call(`page=${1}`);
    }
})

api_call(`page=${page}`);