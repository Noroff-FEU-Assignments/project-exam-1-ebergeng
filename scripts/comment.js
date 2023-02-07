const nameLabel = document.querySelector(".name-label");
const emailLabel = document.querySelector(".email-label");
const textLabel = document.querySelector(".text-label");

const form = document.querySelector(".comment-form");
const name = document.querySelector("#name");
const email = document.querySelector("#email");
const text = document.querySelector("#text-area");

const sendtMsg = document.querySelector(".sendt-msg");


function validate() {
    event.preventDefault()
    const validateionList = [false, false, false]

    /**************************************/
    /* checking fullname */
    if(check_lenght(name.value, 2)) {
        if(is_string(name.value)) {
            correct(nameLabel)
            validateionList[0] = true
        }
        else {
            display_error(nameLabel)
            validateionList[0] = false
        }
    }
    else{
        display_error(nameLabel)
        validateionList[0] = false
    }
    /**************************************/
    /* checking email */
    if(check_email(email.value.trim())) {
        correct(emailLabel);
        validateionList[1] = true;
    }
    else {
        display_error(emailLabel);
        validateionList[1] = false;
    }

    /**************************************/
    /* checking text */
    if(check_lenght(text.value, 5)) {
        if(is_string(text.value)) {
            correct(textLabel)
            validateionList[2] = true
        }
        else {
            display_error(textLabel)
            validateionList[2] = false
        }
    }
    else{
        display_error(textLabel)
        validateionList[2] = false
    }
    if(check_validateion_list(validateionList)) {
        sendtMsg.style.display = "inline-block"
        name.value = "";
        email.value = "";
        text.value = "";
    }

}

function display_error(label) {
    label.style.color = "red"
    //errorMsg.style.display = "inline-block"
}

function correct(label) {
    label.style.color = "#444444"
}



function check_lenght(value, minLenght, maxLenght = 100) {
    if(value.trim().length >= minLenght && value.trim().length <= maxLenght) {
        return true;
    }
    else {
        return false;
    }
}

/* check if hole string is str */
function is_string(value) {
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

function check_validateion_list(list) {
    return list.every(function(index) {
        return index
    });
  }

function check_email(email) {
    const regEx = /\S+@\S+\.\S+/;
    const pM = regEx.test(email);
    return pM;
}

function check_validateion_list(list) {
    return list.every(function(index) {
        return index
    });
  }


form.addEventListener("submit", validate)