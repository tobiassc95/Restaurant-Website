console.clear();

import { Restaurant } from "./restaurant.js";
const restaurant = new Restaurant();

const title_ = document.querySelector(".home-title");
title_.innerHTML = "RESTAURANTE: MENÚ";

const homeBTN1_ = document.querySelector(".home-btn1"); //Menu.
const homeBTN2_ = document.querySelector(".home-btn2"); //Log in.
const homeBTN3_ = document.querySelector(".home-btn3"); //Orders.
const homeBTN4_ = document.querySelector(".home-btn4"); //Users.

const addBTN_ = document.querySelector(".add-btn");

homeBTN1_.addEventListener("click", (event) => { //Menu.
    event.preventDefault();

    title_.innerHTML = "RESTAURANTE: MENÚ";
    clearButtons();
    homeBTN2_.style.display = "block";
    restaurant.fillMenu();
});

homeBTN2_.addEventListener("click", (event) => { //Log in.
    event.preventDefault();

    title_.innerHTML = "RESTAURANTE: INGRESAR";
    clearButtons();
    homeBTN1_.style.display = "block";
    restaurant.fillLogin();
});

homeBTN3_.addEventListener("click", (event) => { //Orders.
    event.preventDefault();

    title_.innerHTML = "RESTAURANTE: PEDIDOS";
    clearButtons();
    homeBTN1_.style.display = "block";
    homeBTN2_.style.display = "block";
    homeBTN4_.style.display = "block";

    restaurant.fillOrders();
});

homeBTN4_.addEventListener("click", (event) => { //Orders.
    event.preventDefault();

    title_.innerHTML = "RESTAURANTE: USUARIOS";
    clearButtons();
    homeBTN1_.style.display = "block";
    homeBTN2_.style.display = "block";
    homeBTN3_.style.display = "block";

    restaurant.fillUsers();
});

const loginBTN_ = document.querySelector(".login-btn");
const userNAME_ =  document.querySelector(".user-name");
const userPASSWORD_ =  document.querySelector(".user-password");
const userERROR_ = document.querySelector(".user-error");
loginBTN_.addEventListener("click", (event) => {
    event.preventDefault();

    console.log("LOG IN");
    restaurant.checkData(userNAME_.value, userPASSWORD_.value).then((userType) => {
        userERROR_.style.display = "none";
        title_.innerHTML = "RESTAURANTE: PEDIDOS";
        clearButtons();
        homeBTN1_.style.display = "block";
        homeBTN2_.style.display = "block";

        restaurant.fillOrders();

        if (userType == "user") { //User.
            console.log(userType);
            
        }
        else if (userType == "admin") { //Admin.
            console.log(userType);
            homeBTN4_.style.display = "block";
        }
        // else { //Guest.
        //     console.log(userType);
        // }
    }).catch(() => {
        console.log("ERROR");

        userERROR_.style.display = "block";
    });
});

addBTN_.addEventListener("click", (event) => {
    event.preventDefault();

    restaurant.addOrder();
});

function clearButtons() {
    homeBTN1_.style.display = "none";
    homeBTN2_.style.display = "none";
    homeBTN3_.style.display = "none";
    homeBTN4_.style.display = "none";
}