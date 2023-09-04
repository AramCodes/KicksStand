//products (add a product to array to add to page) all images are from unsplash
const products = [
    {
        name: "Retro Eights",
        id: "main-0",
        price: 200,
        image: "./images/jordanRetro8.jpg",
        quantity: 0
    },
    {
        name: "Air Force Ones",
        id: "main-1",
        price: 120,
        image: "./images/AirForceOnes.jpg",
        quantity: 0
    },
    {
        name: "Nike Huraches",
        id: "main-2",
        price: 150,
        image: "./images/NikeHurache.jpg",
        quantity: 0
    },
    {
        name: "Jordan Retro Ones",
        id: "main-3",
        price: 200,
        image: "./images/jordanRetro1.jpg",
        quantity: 0
    }
]

//code that renders products dynamically
function addProductToCart(productId){   
    const targetShoeObj = products.filter(shoe => {
        return shoe.id === productId
    	})[0]

    if (!cart.find(o => o.name === targetShoeObj.name)){
        targetShoeObj.quantity = 0 // added to prevent weird stacking when item is removed and than re added
        cart.push(targetShoeObj)
        cartTotal()
    }  

    increaseQuantity(targetShoeObj.id);
}

function renderSelection() {
    const productDisplay = document.getElementById("productListings");
    let html = ""
    for (let i = 0 ; i < products.length; i++) {
        html += `
        <div class="product" id="productCard">
            <img src=${products[i].image} alt=${products[i].name} class= "${products[i].name}-image">
            <h4 class="product-name">${products[i].name}</h4>
            <p class="product-price">Price: $ ${products[i].price} </p>
            <button id="addToCartBtn" class="btn" data-add="${products[i].id}">Add To Cart</button>
        </div>
        `    
    }

    productDisplay.innerHTML = html;
}

renderSelection();

//code for cart remove functionality
let cart = [];

function removeItem(productId) {
    cart = cart.filter(shoe => {
    return shoe.id != productId
    })

    cartTotal()
    renderCart();
}

function removeAllItems() {
    //cart.splice(0, cart.length) slower
    cart.length = 0; //abit faster and animation less jaring

    cartTotal()
    renderCart();
}

document.addEventListener('click', function(e) {
    if (e.target.dataset.add) {
        addProductToCart(e.target.dataset.add);
        renderCart();
    }
    else if (e.target.dataset.increase) {
        increaseQuantity(e.target.dataset.increase)
    }
    else if (e.target.dataset.decrease) {
        decreaseQuantity(e.target.dataset.decrease)
    }
    else if (e.target.dataset.remove) {
        removeItem(e.target.dataset.remove)
    }

})

//code to increase and decrease quantity

function increaseQuantity(productId) {
    // const chosenShoeObj = cart.find(shoe => shoe.id === productId);
    const targetShoeObj = cart.filter(shoe => {
        return shoe.id === productId
    })[0]

    if(targetShoeObj.quantity < 10) {
        targetShoeObj.quantity += 1
        renderCart();
        cartTotal()
    }
}

function decreaseQuantity(productId) {
    const chosenShoeObj = cart.find(shoe => shoe.id === productId);

    if(chosenShoeObj.quantity > 1) {
        chosenShoeObj.quantity -= 1
        renderCart();
        cartTotal()
    }
    else if(chosenShoeObj.quantity === 1) {
        chosenShoeObj.quantity -= 1
        removeItem(chosenShoeObj.id)
        renderCart();
        cartTotal()
    }
}

//code to render items in shopping cart
function renderCart(){
    const cartDisplay = document.getElementById("shoppingCart");
    let htmlString = ""
    
    for (let i = 0 ; i < cart.length; i++) {
        
        htmlString += `
            <div class="cart-item" >
                <h4 class="cart-item-name">${cart[i].name}</h4>
                <p class="cart-product-price">Price: ${cart[i].price} </p>
                <p class="product-quantity">Quantity: ${cart[i].quantity}</p>
                <p class="product-total">Total: ${cart[i].price * cart[i].quantity}</p>

                <div class="cart-buttons">

                    <button class="buttns increase-btn" data-increase="${cart[i].id}">
                        +
                    </button>
                    <button class="buttns decrease-btn" data-decrease="${cart[i].id}">
                        -
                    </button>
                    <button id="removeBtn" class="buttns" data-remove="${cart[i].id}">
                        Remove
                    </button>
                </div>
            </div>
            `
    }
   
    if(cart.length >= 1){
        cartDisplay.innerHTML = htmlString;
    }
    else {
        cartDisplay.innerHTML = `<h3>You cart is currently empty</h3>`
    }
}

renderCart();

//adds up bill and displays it in proper locations
const totalDisplay = document.getElementById("cartTotal");

function cartTotal() {
    let orderTotal = 0;
    
    cart.forEach(orderItem => {
        return orderTotal += orderItem.price * orderItem.quantity
    })

    totalDisplay.textContent = "Cart Total: $ " + orderTotal
    return orderTotal
}

//cash input and handling functionality
const submitBtn = document.getElementById("cashSubmit");
const cashDisplay = document.getElementById("cash");
const balance = document.getElementById("remainingBalance");
let remainingBalance =  0;

function pay(amount) {   //number doesn't come negative by design as it doesn't match the text (customer owes -20 dollars) so it is wrapped in 
    //Math.abs (to say customer owes you 20 dollars)to convert it and parse.float and tofixed to handle the decimals
    remainingBalance =  parseFloat(cartTotal()) - parseFloat(amount) 
    remainingBalance = remainingBalance.toFixed(2)

    if (remainingBalance < 0) {
        balance.textContent = `You owe the customer $ ${Math.abs(remainingBalance)}`;
    }
    else if (remainingBalance == 0) {
        balance.textContent = `Balance: $`
        popup(`Have a nice day`);
    }
    else  {
        balance.textContent = `The customer owes you $ ${remainingBalance}`;
    }
}

function editDisplays() {
    const cashTendered = document.getElementById("cashInput").value; //takes in value that is inputed by cashier
    const amount = Number(cashTendered); //convert casTendered to a number

    if (typeof amount === "number") {
        cashDisplay.textContent = `Cash Received: $ ${cashTendered}`
        pay(amount)
    }
    else {
        popup("type in a number")
    }
}

submitBtn.addEventListener("click", editDisplays)

//all credit card and pop up modal features
const overlay = document.getElementById("overlay")
const openBtn = document.getElementById("useCard")
const closeBtn = document.getElementById("close")
const popUp = document.getElementById('popup')
const secondDisplay = document.getElementById('cartTotal1')

function openPopUp() {
    popUp.classList.add("open-popup");
    overlay.classList.add('active')
    secondDisplay.innerHTML = `Customer's Total: $<strong>${remainingBalance}</strong>`
}

function closePopUp(e) {
    //input field values
    const name = document.getElementById('name').value
    const cardNumber = document.getElementById('cardNumber').value
    const cvv = document.getElementById('cvv').value
    //client-side payment validation

    if (name === "" || cardNumber === "" || cvv === "") {
        popup("You need to enter a valid value in each field")
    }
    else {
        e.preventDefault()
    popUp.classList.remove("open-popup");
    overlay.classList.remove('active')

    //once modal is closed make message appear
    
    orderContainer.innerHTML = `<div class="message">Thanks, ${name}! Your order is on the way!</div>` //fix form name into message
    }

}

openBtn.addEventListener('click', openPopUp)
closeBtn.addEventListener('click', closePopUp)

// alert function popup control
const alerts = document.querySelector('.alert');
const messageInput = document.querySelector('.msg');
const closeBttn = document.querySelector('.close-btn');

function popup(message) {
    alerts.classList.remove('hide');
    alerts.classList.add('show');
    alerts.classList.add('showAlert');
    messageInput.textContent = `${message}`
    setTimeout( ()=> {
        closeMsg();
    }, 5000); //hides alert after 5 secs
}

function closeMsg() {
    alerts.classList.add('hide');
    alerts.classList.remove('show');
}

closeBttn.addEventListener("click", closeMsg);