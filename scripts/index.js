import  { api_call, comments_amount, generate_posts} from "./functions.js"

const postWrapper = document.querySelector(".wrapper");
let mobileSize = window.matchMedia("(max-width: 900px)");//set the max with of mobile size screen
const morePosts = document.querySelector(".more-posts");
const filter = document.querySelector(".filter");
const search = document.querySelector("#searchInput");
const loader = document.querySelector(".big_load");
const carusel = document.querySelector(".carusel");
const caruselContent = document.querySelector(".carusel-content");
const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");



let posts = []; /*a list where i store all the posts*/ 
let displayedPost = []; //a list where i store the posts that are being displayed
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
        if(mobileSize.matches) { //checking the size of the screen
            mobile = true;
            pos = 1;
            filter.style.display = "none"; //if its mobile size i dont use filter over the backround img in the carusel.
        }
        else {
            mobile = false;
            morePosts.style.display = "none";
            pos = 0;
        }

        mobileSize.addListener(check_screen_size);//this will call the function check_screen_size if the screen size change from mobil to desktop
        add_post_to_page();
    }

    //if data retuns emty this will display for the user
    else {
        postWrapper.innerHTML = "Looks like there was a problem on our side, pleas try again later"
    }
}


//function that add posts to the display
function add_post_to_page() {
    if(!mobile) {
        caruselContent.innerHTML = "";
    }
    displayedPost = []

    //each post hava ether display = true of false, if its false it will not ho in the list for displayed posts
    posts.forEach(post => {
        if(post.display) {
            displayedPost.push(post)
        }
    })

    if(!mobile) {
        if(pos === 0){
            leftArrow.style.display = "none"
            rightArrow.style.display = "inline-block"
        }
        else if(pos === displayedPost.length - 1) {
            rightArrow.style.display = "none"
            
        }
        else {
            leftArrow.style.display = "inline-block"
            rightArrow.style.display = "inline-block"
        }
    }

    morePosts.style.display = "block"
    let className;
    let headline;
    let sum;

    if(!mobile && displayedPost.length > 0){
        carusel.style.backgroundImage = `url(${displayedPost[pos].img})`;
        morePosts.style.display = "none"
    }

    if(displayedPost.length === 0) {
        carusel.style.backgroundImage = "none"
        caruselContent.innerHTML = `<div class="no-search-resoult">Sorry, No posts matching your search</div>`
    }

    // for loop thats display 3 of the posts in the list, one that are in focus, one older and one new post. exept when u first enter the site. there is only 2 post, one in focues and one older post
    for(let i = 0; i < 3; i++){

        try{ //add the html for each posts
            caruselContent.innerHTML += `<div class="post-wrapper current" id="${displayedPost[pos + i].id}" data-id="${pos + i}">
                                    <h2>${displayedPost[pos + i].title}</h2>
                                    <div class="img-holder"><img src="${displayedPost[pos + i].img}" alt=""></div>
                                    ${displayedPost[pos + i].sum}
                                    <p class="read-more">Read more..</p>
                                    <div class="post-info">
                                        <p class="date">Posted: ${displayedPost[pos + i].date}</p>
                                        
                                        <div class="comments">
                                            <img src="../images/commentv2.png" alt="icon for comments">
                                            <div id="${displayedPost[pos + i].id}" class="numOfComments">
                                                <div class="loading"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
            loader.style.display = "none";
                                
        }
        catch(err) {
            rightArrow.style.display = "none"
            
        }

        //gets the amount of comments, diplayed in the right bottom corner of the post
        let allCom = document.querySelectorAll(".numOfComments");
        allCom.forEach(async function(element) {
            let numberOfComment = await comments_amount(element);
            element.innerHTML = numberOfComment
        })


    }

   //on mobile screen, all the post are links to there own page witch will display the full post
    let current = document.querySelectorAll(".current");
    current.forEach(element => {
        element.addEventListener("click", function() {
            window.location.assign(`selected_post.html?id=${element.id}`);
        })
        if(!mobile) {
            element.addEventListener("mouseover", function() {
                carusel.style.backgroundImage = `url(${displayedPost[this.dataset["id"]].img})`;
                current.forEach(element => {
                    element.className = "post-wrapper current"
                })
                this.className = "post-wrapper current focus"
            })
        }

    })
}

leftArrow.addEventListener("click", function() {
    pos -= 3 
    add_post_to_page()
})

rightArrow.addEventListener("click", function() {
    pos += 3
    if(posts.length <= pos) {
        pos -= 3
        rightArrow.style.display = "none"
    }
    else {
        add_post_to_page()
    }  
})

//function that will reload the page
function check_screen_size() {
    location.reload();
}

//function for the more post button at the bottom of the page in mobile veiw
morePosts.addEventListener("click", function() {
    if(mobile){
        pos += 3;
    }
    add_post_to_page();
})

//searchfunction that change the post.displayed based on what you write in the searchinput
search.addEventListener("input", function() {
    pos = 0  
    let searchWord = this.value.toLowerCase()
    posts.forEach(post => {
        let title = post.title.toLowerCase()
        if(title.includes(searchWord)) {
            post.display = true;
        }
        else {
            post.display = false;
        }
    })
    caruselContent.innerHTML = "";
    add_post_to_page();   
})

get_all_posts();