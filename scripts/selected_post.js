const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const queryId = params.get("id")


const loader = document.querySelector(".big_load")
const wrapper = document.querySelector(".wrapper");
const carusel = document.querySelector(".carusel");
const headline = document.querySelector(".headline");
const postDate = document.querySelector(".date");
const postContent = document.querySelector(".post-content");
const siteName = document.querySelector(".site-name");
const siteTitle = document.querySelector("title")
const commentForm = document.querySelector(".comment-form");

const baseUrl = "https://myflashcard.org/wp-json/";
const postUrl = "wp/v2/posts"
const commentUrl = "wp/v2/comments"

const url = `https://myflashcard.org/wp-json/wp/v2/posts/${queryId}`;
async function apiCall() {
    try {
        let respons = await fetch(url);
        let data = await respons.json();
        loader.style.display = "none"
        carusel.style.backgroundImage = `url(${data.yoast_head_json.og_image[0].url})`
        headline.innerHTML = data.title.rendered
        postDate.innerHTML = `Posted: ${data.date.slice(0, 10)}`
        postContent.innerHTML = data.content.rendered
        siteName.innerHTML = data.title.rendered
        siteTitle.innerHTML = data.title.rendered
    }
    catch(err) {
        console.log(err)
        wrapper.innerHTML = "Looks like there was a problem on our side, pleas try again later"
        commentForm.innerHTML = ""
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
    let authorName = comment.author_name;
    let date  = comment.date;
    let month;
    let day;

    if (date[8] === "0") {
        day = date[9];
    }
    else {
        day = date[8] + date[9];
    }

    if (date[5] === "0") {
        month = parseInt(date[6] - 1);
    }
    else {
        month = date[5] + date[6];
        month = parseInt(month - 1);
    }
    let content = comment.content.rendered;

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
    commentWrap.innerHTML += HTML;
}
apiCall();
comments();
