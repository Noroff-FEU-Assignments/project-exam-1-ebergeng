import  { api_call, comments_amount, generate_posts} from "./functions.js"

const wrapper = document.querySelector(".wrapper");
const bigLoader = document.querySelector(".big_load");
const posts = []


async function gett_all_posts() {
    try {
        let data = await api_call()
        data.forEach(element => {
            let post = generate_posts(element);
            posts.push(post)
        });
        add_post_to_page()
    }
    catch(err) {
        console.log(err)
        wrapper.innerHTML = "Looks like there was a problem on our side, pleas try again later"
    }
    
}

function add_post_to_page() {
    bigLoader.style.display = "none"
    posts.forEach(post => {
        let html = `<div class="post-wrapper">
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
    wrapper.innerHTML += html
    })

    let allCom = document.querySelectorAll(".numOfComments");
    allCom.forEach(async function(element) {
        let numberOfComment = await comments_amount(element);
        element.innerHTML = numberOfComment
    })

}

gett_all_posts()
