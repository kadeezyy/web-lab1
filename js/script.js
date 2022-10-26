const x_buttons = document.querySelectorAll(".x");
const x_text = document.querySelector(".value-x");
const y_button = document.querySelector(".y");
const y_text = document.querySelector(".value-y");
const r_buttons = document.querySelectorAll(".r");
const r_text = document.querySelector(".value-r");
const table = document.querySelector("#new-result-table");
const submit_button = document.querySelector("#submit-button");
const clear_button = document.querySelector(".clear-button");
const error_text = document.querySelector("#text-error"); 
const tool = document.querySelector(".tool");

const stats = {
    x: undefined,
    y: undefined,
    r: undefined
};

const SELECTED_COLOR = '#1a73a8';
const BLUR_COLOR = '#000000';
const TEXT_COLOR = 'white';
const HOVER_COLOR = '#2196f3';

let buttons = [];
r_buttons.forEach(button =>{
    button.addEventListener("click", (event) => {
        event.preventDefault();
        stats.r = focusButton(r_buttons, button);
        buttons.push(button.value);
    })
})

function checkX(){
    const xCoordinatesArray = document.querySelectorAll('input[name="x"]:checked');
    if (xCoordinatesArray.length === 1) {
        return setSuccessFor(xCoordinatesArray[0]);
    } else {
        return setErrorFor(document.querySelectorAll('input[name="x"]')[0], "Выберите одно значение Х");
    }
}

function isNumber(s){
    var n = parseFloat(s.replace(',','.'));
    return !isNaN(n) && isFinite(n);
}

function checkY(){
    const y_element = document.querySelector(".y");
    const yVal = y_element.value.replace(',','.');
    if(yVal.includes(".")){
        if(yVal.split('.').length > 2){
            console.log('hello');
            return setErrorFor(y_element, "Данные введены неверно");
        }
        if (yVal.split(".")[1].length > 7){
            return setErrorFor(y_element, "Введите число с разрядностью после запятой меньше 7");
        }
    }
    

    if (!isNumber(yVal) || yVal === "") {
        return setErrorFor(y_element, "Пожалуйста, введите значение Y");
    } else if (parseFloat(yVal) < -5 || parseFloat(yVal) > 5) {
        return setErrorFor(y_element, "Введите значение от -5 до 5");
    } else {
        return setSuccessFor(y_element);
    }
}
function focusButton(buttons, button) {
    for (i = 0; i < buttons.length; i++) {
        if (buttons[i] != button) {
            buttons[i].style.backgroundColor = BLUR_COLOR;
        }
        button.style.backgroundColor = SELECTED_COLOR;
    }
    return button.value;
}
function checkR() {
    const num = buttons.length;
    if (num >= 1){
        return setSuccessFor(buttons[buttons.length - 1]);
    } else {
        return setErrorFor(buttons[buttons.length - 1], "Выберите одно значение радиуса")
    }
}

function validateForm() {
    return checkX() && checkY() && checkR();
}

function setSuccessFor(input) {
    const tool = document.querySelector('.tool');

    tool.innerText = "";


    return true;
}

function setErrorFor(input, message) {
    const tool = document.querySelector('.tool');
    tool.style.color = "red"; 
    tool.innerText = message;
    return false;
}

function blurButton(button, val) {
    if (val != button.value) {
        button.style.backgroundColor = BLUR_COLOR;
    } else {
        button.style.backgroundColor = BLUR_COLOR;
    }
}

function uncheck(button, val) {
    button.checked = false;
    if (val != button.value) {
        button.checked = false;
    } else {
        button.checked = true;
    }
}

$(document).ready(function() {
    $.ajax({
        url: 'php/load.php',
        method: "GET",
        success: function(data){
            $("#new-result-table").html(data);
        },
        error: function(error){
            console.log(error);
        }
    })
})

$("#form").on("submit", function(event) {
    event.preventDefault();
    if(!validateForm()){
        return false;
    }
    y_button.value = y_button.value.replace(',','.');
    console.log($(this).serialize() + "&r=" + buttons[buttons.length - 1] + "&offset=" + (new Date().getTimezoneOffset()));
    $.ajax({
        url : 'php/handler.php',
        method : "GET",
        data : $(this).serialize() + "&r=" + buttons[buttons.length - 1] + "&offset=" + new Date().getTimezoneOffset(),

        success: function(data) { 
            $("#new-result-table").html(data);
        },
        error : function(error){
            console.log(error);
        }
    })
})

$(".clear-button").on("click", function(event) {
    event.preventDefault();

    document.querySelector(".y").value = '';
    var xbuttons = document.querySelectorAll("input[name='x']:checked");
    xbuttons.forEach(button => button.checked = false);
    r_buttons.forEach(button => blurButton(button, stats.r));
    buttons = [];
    $.ajax({
        url : 'php/clear.php',
        method : "GET",
        success: function(data) { 
            console.log(data);
            $("#new-result-table").html(data);
        }
    })
})