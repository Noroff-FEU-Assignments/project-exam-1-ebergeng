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
    post.display = true
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


export function display_error(label) {
    label.style.color = "red"
    //errorMsg.style.display = "inline-block"
}

export function correct(label) {
    label.style.color = "#444444"
}



export function check_lenght(value, minLenght, maxLenght = 100) {
    if(value.trim().length >= minLenght && value.trim().length <= maxLenght) {
        return true;
    }
    else {
        return false;
    }
}

/* check if hole string is str */
export function is_string(value) {
    for(let i = 0; i < value.length; i++){
        let num = parseInt(value[i])
        if(Number.isInteger(num)) {
            return false
        }
        else {
            continue
    }
    }
    return true
}

export function check_validateion_list(list) {
    return list.every(function(index) {
        return index
    });
  }

export function check_email(email) {
    const regEx = /\S+@\S+\.\S+/;
    const pM = regEx.test(email);
    return pM;
}
