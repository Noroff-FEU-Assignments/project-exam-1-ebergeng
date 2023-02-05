const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const queryId = params.get("id")
const wrapper = document.querySelector(".wrapper");


const url = `https://myflashcard.org/wp-json/wp/v2/posts/${queryId}`;
const commentUrl = "wp/v2/comments"
async function apiCall() {
    try {
        let respons = await fetch(url);
        let data = await respons.json();
        wrapper.innerHTML =data.content.rendered

    }
    catch(err) {
        console.log(err)
    }
}

apiCall()
