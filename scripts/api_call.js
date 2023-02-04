const postWrapper = document.querySelector(".wrapper");
var mobileSize = window.matchMedia("(max-width: 1000px)");


let posts = []
let pos = 0


const baseUrl = "https://myflashcard.org/wp-json/";
const postUrl = "wp/v2/posts"
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
        updatePage_mobile()
    }

    else {
        updatePage_desktop()
    }


    mobileSize.addListener(check_screen_size)


    
}

function generate_posts(data) {
    let post = {}
    let id = data.id
    let img = data.yoast_head_json.og_image[0].url;
    let title = data.title.rendered;
    let sum = ""
    for(let i = 0; i < 150; i++) {
        sum += data.excerpt.rendered[i]
    }
    sum += "</p>"

    let date = ""
    for(let i = 0; i < 10; i++) {
        date += data.date[i]
    }

    post.id = id
    post.img = img
    post.title =  title
    post.sum = sum
    post.date = date
    posts.push(post)

}


function createHTML(img, title, sum, date) {
    let HTML = `<a href="index.html" class="post-wrapp">
                    <div class="img-holder">
                        <img src="${img}" alt="">
                    </div>
                    <div class="text-holder">
                        <h1>${title}</h1>
                        ${sum}
                        <p class="date">${date}</p>
                    </div>
                </a>`
                
    return HTML
}




function updatePage_mobile() {

    try {
        for(let i = pos; i < pos + 3; i++) {
            postWrapper.innerHTML += createHTML(posts[i].img, posts[i].title, posts[i].sum, posts[i].date)
        }
    }
    catch(err) {
        console.log("no more posts")
    } 
}



function updatePage_desktop() {
    postWrapper.innerHTML = `<div class="carusel">
                                <div class="filter"></div>
                                <div class="carusel-content"></div>
                            </div>`
    const carusel = document.querySelector(".carusel")
    carusel.style.backgroundImage = `url(${posts[pos].img})`

    const caruselContent = document.querySelector(".carusel-content")
    let className;
    let headline;
    for(let i = 0; i < 3; i++){ 
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

        try{
            caruselContent.innerHTML += `<div class="text-holder ${className}">
                                    ${headline}
                                    <div class="img-holder"><img src="${posts[pos + i - 1].img}" alt=""></div>
                                    ${posts[pos + i - 1].sum}</p>
                                    <p class="date">Posted: ${posts[pos + i - 1].date}</p>
                                </div>`
        }
        catch(err) {
            caruselContent.innerHTML += `<div class="${className}" style="width:0;"></div>`
        }
    }

    let old = document.querySelector(".old");
    old.addEventListener("click", function() {
        pos -= 1
        updatePage_desktop()
    })

    let current = document.querySelector(".current");
    current.addEventListener("click", function() {
        console.log("you clicked me")
    })
    let next = document.querySelector(".next");
    next.addEventListener("click", function() {
        pos += 1
        updatePage_desktop()
    })

    
}







function check_screen_size(x) {
    if(x.matches) {
        postWrapper.innerHTML = ""
        pos = 0
        updatePage_mobile()
    }
    else{
        postWrapper.innerHTML = ""
        updatePage_desktop()
    }
}



apiCall()