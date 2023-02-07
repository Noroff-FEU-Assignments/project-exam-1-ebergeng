const baseUrl = "https://myflashcard.org/wp-json/";
const postUrl = "wp/v2/posts";
const commentUrl = "wp/v2/comments";

export async function api_call() {
    try {
        let respons = await fetch(baseUrl + postUrl);
        let data = await respons.json();
        
        return data
    }
    catch(err) {
        console.log(err);
        return false
    }
}

export function generate_posts(data) {
    let post = {};
    post.id = data.id;
    post.img = data.yoast_head_json.og_image[0].url;
    post.title = data.title.rendered;
    let sum = "";
    for(let i = 0; i < 150; i++) {
        sum += data.excerpt.rendered[i];
    }
    sum += "..</p>";
    post.sum = sum;
    let date = "";
    for(let i = 0; i < 10; i++) {
        date += data.date[i];
    }
    post.date = date;
    return post
}


export async function comments_amount(element) {
    let postId = `?post=${element.id}`;
    
    try {
        let respons = await fetch(baseUrl + commentUrl + postId);
        let data = await respons.json();
        let len = data.length;
        return len

    }
    catch(err) {
        console.log(err);
    }
}