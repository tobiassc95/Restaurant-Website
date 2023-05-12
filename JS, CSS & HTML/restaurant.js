const URL_ = "https://maf2qxs1f6.execute-api.us-east-1.amazonaws.com/prod";

const menuPAGE_ = document.querySelector(".menu-page");
const loginPAGE_ = document.querySelector(".login-page");
const ordersPAGE_ = document.querySelector(".orders-list");
const ordersPAGE__ = document.querySelector(".orders-form");
const usersPAGE_ = document.querySelector(".users-page");

const orderINTPUT_ = document.querySelector(".orders-data");
const tableSELECT_ = document.querySelector(".tables-select");

import { User } from "./user.js";

const user = new User();

export class Restaurant {
    constructor() {
        this.fillMenu();
    }

    //MENU PAGE METHODS
    async fillMenu() { //The page is filled with images of meals.
        this.#cleanPages();
        user.type = "guest";

        //First, extract all the information needed from the API.
        const menuInfo = await fetch(URL_ + "/api/menus");
        const menu = await menuInfo.json();

        //Then, use all the information to make the page.
        for (let i = 0; i < (Object.keys(menu)).length; i++) {
            const newElem = document.createElement("div"); newElem.className = "category "+Object.keys(menu)[i];
            newElem.innerHTML += "<h2>"+(Object.keys(menu)[i]).toUpperCase()+"</h2>";
            newElem.innerHTML += "<hr>";
            menuPAGE_.appendChild(newElem);
            this.#updateItems(menu, i, false);
        }

        this.menuBTNS = [];
        for (let i = 0; i < (Object.keys(menu)).length; i++) {
            if ((Object.values(menu)[i]).length > 3) {
                this.menuBTNS[i] = document.querySelector('.'+Object.keys(menu)[i]+"-btn"); 
                this.menuBTNS[i].addEventListener("click", (event) => {
                    event.preventDefault();
                    
                    if (this.menuBTNS[i].innerHTML == "Más") {
                        this.menuBTNS[i].innerHTML = "Menos"

                        this.#updateItems(menu, i, true);
                    }
                    else {
                        this.menuBTNS[i].innerHTML = "Más"

                        const category_ = document.querySelector('.'+Object.keys(menu)[i]);
                        category_.removeChild(category_.lastChild);
                    }
                    //console.log(Object.keys(menu)[i]);
                });
            }
        }
    }

    #updateItems(menu, i, more) { //Private.
        const category_ = document.querySelector('.'+Object.keys(menu)[i]);

        let newElem;
        if (more) {
            newElem = document.createElement("section"); newElem.className = "items-more";
            more = 3;
        }
        else {
            newElem = document.createElement("section"); newElem.className = "items";
            more = 0;
        }

        // menuPAGE_.appendChild(newElem);
        for (let j = more; (j < (Object.values(menu)[i]).length) && (j < 3+more); j++) {
            const newElem2 = document.createElement("div"); newElem2.className = "item";
            newElem2.innerHTML += "<h3 class=\"item-name\">"+(Object.values(menu)[i])[j].name+"</h3>";
            newElem2.innerHTML += "<img src=\""+(Object.values(menu)[i])[j].img+"\" width=\"250px\" height=\"200px\" alt=\"\">";
            newElem.appendChild(newElem2);
        }
        category_.appendChild(newElem);
        if (!more) {
            if ((Object.values(menu)[i]).length > 3) {
                newElem = document.createElement("div"); newElem.className = "more-event";
                newElem.innerHTML = "<button class=\"more-btn "+Object.keys(menu)[i]+"-btn\">Más</button>";
                menuPAGE_.appendChild(newElem);
            }
        }
    }

    //LOGIN PAGE METHODS
    fillLogin() {
        this.#cleanPages();
        user.type = "guest";
        
        loginPAGE_.style.display = "block";
    }

    async checkData(userNAME_, userPASSWORD_) { //Checks authentication.
        const bearerToken = await fetch(URL_+"/oauth/token", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer Token"
            },
            body: JSON.stringify ({ //PHOTO
                "client_id": userNAME_,
                "client_secret": userPASSWORD_,
                "audience": "https://escalab.academy",
                "grant_type": "client_credentials"
            })
        });
        const token = await bearerToken.json(); //To turn JSON format into JS data.

        if (token != undefined) { //If token is undefined, then there is an error.
            this.tokenAccess = token.access_token;
            const usersInfo = await fetch(URL_+"/api/users", {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+this.tokenAccess
                }
            });
            const users = await usersInfo.json(); //To turn JSON format into JS data.

            for (let i = 0; i < users.length; i++) {
                if (users[i].username == userNAME_) {
                    user.type = users[i].roles;
                    user.ID = users[i].id;
                    // if(user.type == "user") { //user
                    //     console.log("user");
                    // }
                    // else { //admin
                    //     console.log("admin");
                    // }
                }
            }
        }
        else {
            user.type = "guest";
        }

        return user.type; 
    }

    //ORDERS PAGE METHODS
    async fillOrders() {
        this.#cleanPages();

        const menuInfo = await fetch(URL_ + "/api/menus");
        const menu = await menuInfo.json();
        //console.log(menu);

        //First, extract all the information needed from the API.
        const usersInfo = await fetch(URL_+"/api/users", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer "+this.tokenAccess
            }
        });
        const users = await usersInfo.json(); //To turn JSON format into JS data.
        //console.log(users);

        const ordersInfo = await fetch(URL_+"/api/orders", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer "+this.tokenAccess
            }
        });
        const orders = await ordersInfo.json();
        //console.log(orders);

        const tablesInfo = await fetch(URL_+"/api/tables", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer "+this.tokenAccess
            }
        });
        const tables = await tablesInfo.json();
        //console.log(tables);

        //Then, use all the information to make the page.
        for (let i = 0; i < orders.length; i++) {
            const newElem = document.createElement("section"); newElem.className = "orders";
            let newElem2 = document.createElement("div"); newElem2.className = "order-user";
            newElem2.innerHTML = "<img src=\""+users[orders[i].waiter-1].img+"\" width=\"250px\" height=\"200px\" alt=\"\">";
            const date = new Date(orders[i].created_at);
            newElem2.innerHTML += "<h4>"+users[orders[i].waiter-1].name+" | ID: "+orders[i].id+" | "+date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+"</h4>";
            newElem.appendChild(newElem2);

            newElem2 = document.createElement("div"); newElem2.className = "order-item";
            newElem2.innerHTML = "<h3>"+tables[orders[i].table-1].name+"</h3>";
            newElem2.innerHTML += "<hr>";
            for (let j = 0; j < orders[i].order.length; j++) {
                for (let k = 0; k < (Object.keys(menu)).length; k++) {
                    for (let l = 0; l < (Object.values(menu)[k]).length; l++) {
                        if (orders[i].order[j].product == (Object.values(menu)[k])[l].id) {
                            newElem2.innerHTML += "<h4>"+(Object.values(menu)[k])[l].name+": "+(orders[i].order[j].quantity).toString()+"</h4>";
                        }
                    }
                }
            }
            newElem.appendChild(newElem2);
            ordersPAGE_.appendChild(newElem);
        }

        ordersPAGE__.style.display = "block"; //To show the form.
        
        tableSELECT_.innerHTML = "";
        for(let i = 0; i < tables.length; i++) { //Fills the options for table-select.
            if (tables[i].available) {
                tableSELECT_.innerHTML += "<option value=\""+(tables[i].name.replace(" ", "")).toLowerCase()+"\">"+tables[i].name+"</option>";
            }
        }

        this.orderSELECT_ = [];
        this.addOrder(); //Fills the options for order-select.
    }

    async addOrder() {
        const menuInfo = await fetch(URL_ + "/api/menus");
        const menu = await menuInfo.json();

        const newElem = document.createElement("div"); newElem.className = "order-data";
        newElem.innerHTML = "<select class=\"order-select"+(this.orderSELECT_.length+1).toString()+" form-select\"></select>";
        newElem.innerHTML += "<input class=\"order-quantity"+(this.orderSELECT_.length+1).toString()+" form-input\" type=\"number\" placeholder=\"Cantidad\"></input>";
        orderINTPUT_.appendChild(newElem);

        this.orderSELECT_[this.orderSELECT_.length] = document.querySelector(".order-select"+(this.orderSELECT_.length+1).toString());

        this.orderSELECT_[this.orderSELECT_.length-1].innerHTML = "";
        for (let i = 0; i < (Object.keys(menu)).length; i++) {
            for (let j = 0; j < (Object.values(menu)[i]).length; j++) {
                this.orderSELECT_[this.orderSELECT_.length-1].innerHTML += "<option value=\""+((Object.values(menu)[i])[j].name).toLowerCase()+"\">"+(Object.values(menu)[i])[j].name+"</option>";
            }
        }
    }

    //USERS PAGE METHODS
    async fillUsers () {
        this.#cleanPages();

        //First, extract all the information needed from the API.
        const usersInfo = await fetch(URL_+"/api/users", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer "+this.tokenAccess
            }
        });
        const users = await usersInfo.json(); //To turn JSON format into JS data.

        //Then, use all the information to make the page.
        for (let i = 0; i < users.length; i++) {
            const newElem = document.createElement("section"); newElem.className = "users";
            let newElem2 = document.createElement("div"); newElem2.className = "user-img";
            newElem2.innerHTML = "<img src=\""+users[i].img+"\" width=\"250px\" height=\"200px\" alt=\"\">";
            newElem.appendChild(newElem2);

            newElem2 = document.createElement("div"); newElem2.className = "user-info";
            newElem2.innerHTML += "<h2>"+users[i].name+"</h2>";
            if (users[i].roles == "user")
                newElem2.innerHTML += "<h4>Usuaria</h4>";
            else
                newElem2.innerHTML += "<h4>Administradora</h4>";
            newElem2.innerHTML += "<h4>"+users[i].email+"</h4>";
            const date = new Date(users[i].birthday);
            newElem2.innerHTML += "<h4>Cumpleaños: "+date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+"</h4>";

            newElem.appendChild(newElem2);
            usersPAGE_.appendChild(newElem);
        }
    }

    ///
    #cleanPages() { //Deletes every child inside .menu-page DOM.
        let child = menuPAGE_.lastChild; 
        while (child) {
            menuPAGE_.removeChild(child);
            child = menuPAGE_.lastChild;
        }
        child = ordersPAGE_.lastChild; 
        while (child) {
            ordersPAGE_.removeChild(child);
            child = ordersPAGE_.lastChild;
        }
        child = usersPAGE_.lastChild; 
        while (child) {
            usersPAGE_.removeChild(child);
            child = usersPAGE_.lastChild;
        }
        loginPAGE_.style.display = "none";
        ordersPAGE__.style.display = "none";
    }
}

//console.log(users);
// let date = new Date(users[1].birthday);
// console.log("Date: "+date.getDate()+
//         "/"+(date.getMonth()+1)+
//         "/"+date.getFullYear()+
//         " "+date.getHours()+
//         ":"+date.getMinutes()+
//         ":"+date.getSeconds());
// let today = new Date();
// console.log(today);