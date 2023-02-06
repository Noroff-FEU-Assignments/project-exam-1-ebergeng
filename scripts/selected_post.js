const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const queryId = params.get("id")
const wrapper = document.querySelector(".wrapper");


const baseUrl = "https://myflashcard.org/wp-json/";
const postUrl = "wp/v2/posts"
const commentUrl = "wp/v2/comments"

const url = `https://myflashcard.org/wp-json/wp/v2/posts/${queryId}`;
async function apiCall() {
    try {
        let respons = await fetch(url);
        let data = await respons.json();
        wrapper.innerHTML = ""
        wrapper.innerHTML += `<h1>${data.title.rendered}</h1>`
        wrapper.innerHTML += data.content.rendered
        console.log(data)
    }
    catch(err) {
        console.log(err)
    }
}




const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

async function comments() {
    let postId = `?post=${queryId}`
    
    try {
        let respons = await fetch(baseUrl + commentUrl + postId);
        let data = await respons.json()
        data.forEach(comment => {
            generate_comments(comment)
        });

    }
    catch(err) {
        console.log(err)
    }
}

const commentWrap = document.querySelector(".comments-wrap")
let commentList = []
function generate_comments (comment) {
    console.log(comment)
    let authorName = comment.author_name
    let date  = comment.date
    let month;
    let day;

    if (date[8] === "0") {
        day = date[9]
    }
    else {
        day = date[8] + date[9];
    }

    if (date[5] === "0") {
        month = parseInt(date[6] - 1)
    }
    else {
        month = date[5] + date[6];
        month = parseInt(month - 1)
    }
    let content = comment.content.rendered

    let HTML = `<div class="comments">
                    <div class="profile">
                        <figure class="profile_img">
                            <img src="/images/no_img.png" alt="">
                        </figure>
                        <div class="comment_data">
                            ${authorName}
                            <p>${months[month]}
                            ${day}.</p>
                        </div>
                    </div>
                    ${content}
                </div>`
    commentWrap.innerHTML += HTML    
}







apiCall()
comments()
