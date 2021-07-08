let displayItems = document.getElementById('cart-item');
const getCartItems = document.getElementsByClassName('cart-items')[0];
const cart_rows = document.getElementsByClassName('row1');
let itemsDisp = document.getElementsByClassName('cartDisplayItems')[0];
let totalCartAmount = document.querySelector('#totalAmount');
const clearAll = document.getElementById('clearAll');
let cartBtns = document.querySelectorAll('.cart-btn');
const cartLength = document.getElementById('myCart');
const item = itemsDisp.querySelectorAll('.cartRows');
cartLength.innerHTML = item.length;

const cart = getCart();
if (cart.length > 0) {
	cart.forEach((cartItem) => {
		addCartToList(cartItem);
		cartListeners(cartItem);
		updateTotal();
	});
}

async function productsData() {
	try {
		let products = await fetch('products.json');
		let result = await products.json();
		let productData = result.products;
		productData = productData.map((data) => {
			let { title, percentageOff, strikedPrice, price, button } =
				data.properties;
			const image = data.properties.image.file.url;
			return { title, percentageOff, strikedPrice, price, button, image };
		});
		return productData;
	} catch (error) {
		console.log(error);
	}
}

function saveProducts(productData) {
	let products = localStorage.setItem('products', JSON.stringify(productData));
}

function displayProducts() {
	let products = JSON.parse(localStorage.getItem('products'));
	let result = '';
	products.forEach((item) => {
		let strikedPrice = +item.strikedPrice;
		let strikedPriceValue = strikedPrice
			.toFixed(2)
			.toString()
			.replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ',');
		// for dollar price format
		// .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		result += `
            <div class="row1 products">
                <div class="card" style="width:350px">
									<div class="inner">
                    <img class="card-img-top" src=${item.image}> </div>                 
                    <div class="card-body">
                        <h4 class="card-title text-center">${item.title}</h4>
                        <hr>
						<div class= "grid grid-2">
                        <p class="strikedPrice text-center"><strike>₹ ${strikedPriceValue}</strike> <span class="card-text ml-2"> ${item.price}</span></p>
						<p class="text-center m-4"><span class="percentageOff" >save ${item.percentageOff}</span> <a href="#" class="cart-btn btn btn-primary btn-sm ml-2" data-number="1" data-text="Add To Cart">${item.button}</a></p>
						</div>                        
                    </div>
                </div>
            </div>            
        `;
		displayItems.innerHTML = result;
	});
}

productsData()
	.then((productData) => {
		saveProducts(productData);
		displayProducts();
	})
	.then(() => cart_items());

function cart_items() {
	if (getCartItems.classList.contains('row')) {
		var i;
		for (i = 0; i < cart_rows.length; i++) {
			var cartLop1 = cart_rows[i];
			const cart_img = cartLop1.getElementsByClassName('card-img-top')[0].src;
			const card_title = cartLop1.querySelectorAll('.card-title')[0].innerText;
			const card_text = cartLop1.getElementsByClassName('card-text')[0];
			var cardText = card_text.innerText;
			var cartVal = [cart_img, card_title, cardText];
			strikedVal(cartLop1, cartVal);
		}
	}
}

function strikedVal(cartLop1, cartVal) {
	let cartList = cartVal;
	let strikedValue =
		cartLop1.getElementsByClassName('strikedPrice')[0].innerText;
	const reg1 = /\d(,)*\d(,|\d)*\d\.[0-9]+/g;
	const regFound1 = strikedValue.match(reg1);
	let strikedReplace = regFound1.toString().split(',').join('');
	let strikedPriceVal = +strikedReplace;
	let cart_button = cartLop1.getElementsByClassName('cart-btn')[0];
	const percentage =
		cartLop1.getElementsByClassName('percentageOff')[0].innerText;
	const reg = /[0-9]+/g;
	const regFound = percentage.match(reg);
	const regNum = parseFloat(regFound);
	let percentageArr = (strikedPriceVal * regNum) / 100;
	// let myFont.innerHTML = `₹`;
	cartList[2] = '₹ ' + (strikedPriceVal - percentageArr).toFixed(2);
	const card_text = cartLop1.getElementsByClassName('card-text')[0];
	card_text.innerText = cartList[2]
		.toString()
		.replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ',');
	// for dollar price format
	// .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

	cartClicked(cart_button, cartList);
}

document.addEventListener('DOMContentLoaded', cartFirst);

function cartFirst() {
	const cart = getCart();
	cart.forEach((cartItem) => {
		addCartToList(cartItem);
		cartListeners(cartItem);
		totalPrice(cartItem);
	});
}

function getCart() {
	let cart;
	if (localStorage.getItem('cart') === null) {
		cart = [];
	} else {
		cart = JSON.parse(localStorage.getItem('cart'));
	}
	return cart;
}

function cartItems(itemsDisplay, button) {
	const cart = getCart();
	let itemsOfCart = {
		image: itemsDisplay[0],
		title: itemsDisplay[1],
		price: itemsDisplay[2],
		total: 0,
		quantity: '1',
		button: button,
	};
	const isInCart =
		cart.filter((cartItem) => cartItem.title === itemsOfCart.title).length > 0;
	if (!isInCart) {
		addCartToList(itemsOfCart);
		cart.push(itemsOfCart);
		cartListeners(itemsOfCart);
		totalPrice(itemsOfCart);
		localStorage.setItem('cart', JSON.stringify(cart));
		updateTotal();
	}
}

function inCart(buttons) {
	let btn1 = buttons;
	btn1.innerHTML = 'in Cart';
	btn1.disabled = true;
}
function totalPrice(cartItem) {
	let cart = getCart();
	cart.forEach((cartItemsList) => {
		const cartTotal = cartItemsList.total
			.toString()
			.replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ',');
		// for dollar price format
		// .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		cartItemsList.total = cartTotal;
		localStorage.setItem('cart', JSON.stringify(cart));
	});
}

function addCartToList(cartItem) {
	const row = document.createElement('tr');
	row.className = 'cartRows';
	let price = cartItem.price
		.toString()
		.replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ',');
	// for dollar price format
	// .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	let number1 = `
        <input type="number" class="number" value=${cartItem.quantity} min="1" style="width:40%">
    `;
	row.innerHTML = `
            <td class="card-img"><img class="card-img-top" src="${cartItem.image}" alt="Card image"></td>
            <td class="card-title">${cartItem.title}</td>
            <td class="card-text"> ${price}</td>
            <td class="num" id="num">${number1}</td>
            <div class="total"><span id="total">₹  ${cartItem.total}</span></div>
			<td class="remove">X</td>
			`;
	itemsDisp.append(row);
}

function cartListeners(cartItem) {
	let cart = getCart();
	const item = itemsDisp.querySelectorAll('.cartRows');
	item.forEach((items) => {
		if (items.querySelector('.card-title').innerText === cartItem.title) {
			if (
				items.querySelector('.number').value !== 1 &&
				items.querySelector('.number').value == 1
			) {
				const total = items.querySelector('#total');
				total.innerText = cartItem.price
					.toString()
					.replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ',');
				// for dollar price format
				// .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
			}
			const title = items.querySelector('.card-title').innerText;
			cartLength.innerHTML = item.length;
			items
				.querySelector('.num')
				.addEventListener('change', () => totalAmount(items, cartItem));
			items
				.querySelector('.remove')
				.addEventListener('click', (e) => itemRemoved(e, title));
			clearAll.addEventListener('click', () =>
				clearCart(cartItem, items, title)
			);
		}
	});
}

function totalAmount(items, cartItem) {
	let num = items.querySelector('.number').value;
	let total = items.querySelector('#total');
	let cart = getCart();
	let count = 0;
	cart.forEach((cartItemsList) => {
		if (cartItemsList.title === cartItem.title) {
			cartItemsList.quantity = num;
			count +=
				parseFloat(cartItemsList.price.replace('₹', '')) *
				cartItemsList.quantity;
			let stringCount = count.toFixed(2);
			let fixedCount = stringCount.toString(2);
			cartItemsList.total = fixedCount;
			let cart_total = cartItemsList.total
				.toString()
				.replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ',');
			// for dollar price format
			// .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
			total.innerText = `₹  ${cart_total}`;
			cartItemsList.total = cart_total;
			localStorage.setItem('cart', JSON.stringify(cart));
			updateTotal();
		}
	});
}

function itemRemoved(e, title) {
	const targetBtn = e.target.parentElement;
	targetBtn.remove();
	let titleText = targetBtn.children[1].innerText;
	let cart = getCart();
	cart = cart.filter((cartItem) => cartItem.title !== titleText);
	localStorage.setItem('cart', JSON.stringify(cart));
	const item = itemsDisp.querySelectorAll('.cartRows');
	cartLength.innerHTML = item.length;
	for (let i = 0; i < cart_rows.length; i++) {
		var cartLop1 = cart_rows[i];
		const cardTitle = cartLop1.querySelectorAll('.card-title')[0].innerText;
		let button = cartLop1.querySelectorAll('.cart-btn')[0];
		if (title === cardTitle) {
			button.innerHTML = 'Add To Cart';
		}
	}
	itemsDisp.lastChild.hasChildNodes()
		? updateTotal()
		: (totalCartAmount.innerText = '₹' + 0);
}

function clearCart(cartItem, items, title) {
	let total = items.querySelector('#total');
	items.remove();
	let cart = getCart();
	cart = cart.filter((cartItem) => cartItem.title === items.title);
	totalCartAmount.innerText = '₹' + 0;
	localStorage.setItem('cart', JSON.stringify(cart));
	const item = itemsDisp.querySelectorAll('.cartRows');
	cartLength.innerHTML = item.length;
	for (let i = 0; i < cart_rows.length; i++) {
		var cartLop1 = cart_rows[i];
		const cardTitle = cartLop1.querySelectorAll('.card-title')[0].innerText;
		let button = cartLop1.querySelectorAll('.cart-btn')[0];
		if (title === cardTitle) {
			button.innerHTML = 'Add To Cart';
		}
	}
}

function updateTotal() {
	const cart = getCart();
	let count = 0;
	cart.forEach((cartItem) => {
		count += cartItem.price.replace('₹', '') * cartItem.quantity;
		let cartAmt = count.toFixed(2);
		let cart_total = cartAmt
			.toString()
			.replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ',');
		// for dollar price format
		// .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		totalCartAmount.innerText = `₹ ${cart_total}`;
	});
}

function cartClicked(cart_button_click, cart_items_list) {
	let button_click = [cart_button_click];
	let items_list = cart_items_list;
	let loop_button = button_click.forEach((buttons) => {
		buttons.addEventListener('click', (e) => {
			e.preventDefault();
			cartItems(items_list, e.target);
			inCart(e.target);
		});
	});
}
