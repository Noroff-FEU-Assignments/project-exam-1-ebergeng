import { check_email, is_string, check_lenght, check_validateion_list } from "./functions.js";

const form = document.querySelector(".contact-form");
const name = document.querySelector("#name");
const subject = document.querySelector("#subject");
const email = document.querySelector("#email");
const text = document.querySelector("#text-area");

const nameLabel = document.querySelector(".name-label");
const emailLabel = document.querySelector(".email-label");
const subLabel = document.querySelector(".subject-label");
const textLabel = document.querySelector(".text-label");
const errorMsg = document.querySelector(".error-msg");
const sendtMsg = document.querySelector(".sendt-msg");

function validate() {
    event.preventDefault()
    const validateionList = [false, false, false, false]

    /**************************************/
    /* checking fullname */
    if(check_lenght(name.value, 5)) {
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

    /* checking subject */
    if(check_lenght(subject.value, 15)) {
        if(is_string(subject.value)) {
            correct(subLabel)
            validateionList[2] = true
        }
        else {
            display_error(subLabel)
            validateionList[2] = false
        }
    }
    else{
        display_error(subLabel)
        validateionList[2] = false
    }

    /* checking text */
    if(check_lenght(text.value, 25)) {
        if(is_string(text.value)) {
            correct(textLabel)
            validateionList[3] = true
        }
        else {
            display_error(textLabel)
            validateionList[3] = false
        }
    }
    else{
        display_error(textLabel)
        validateionList[3] = false
    }
    if(check_validateion_list(validateionList)) {
        console.log("jey")
        errorMsg.style.display = "none"
        sendtMsg.style.display = "inline-block"
        name.value = "";
        email.value = "";
        subject.value = "";
        text.value = "";
    }

}

function display_error(label) {
    label.style.color = "red"
    errorMsg.style.display = "inline-block"
}

function correct(label) {
    label.style.color = "black"
}

form.addEventListener("submit", validate)