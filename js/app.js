// reuseable function
const getElement = (id) => {
    return document.getElementById(id);
}
// elements
const productsContainer = getElement('products_container');
const addToCartContainer = getElement('addtocart_container');
const totalPriceContainer = getElement('total_price');
const searchBtn = getElement('search_btn');
const searchInput = getElement('search_input');
const homeBtn = getElement('home_btn');
const mobileBtn = getElement('mobile_btn');
const mobileMenu = getElement('mobile_menu');
const cartBtn = getElement('cart_btn');
const cartBody = getElement('cart_body');
const cartCount = getElement('total_cart');
// load data from api
let allProducts;
const loadApiData = async () => {
    try {
        const url = 'https://dummyjson.com/products';
        const response = await fetch(url);
        const data = await response.json();
        allProducts = data.products;
        showProducts(allProducts);
    } catch (error) {
        console.log(error);
    }
}
loadApiData();
// show product on ui
const showProducts = (products) => {
    productsContainer.innerHTML = '';
    products.forEach(element => {
        productsContainer.innerHTML += `
        <div class="bg-gray-800 duration-300 border border-gray-700">
        <div class="overflow-hidden">
        <img class="w-full bg-gray-100 duration-300 hover:scale-110"
        src="${element.images[0]}" alt="">
        </div>
        <div class="text-center p-2">
        <h4 class="text-xl font-medium line-clamp-1">${element.title}</h4>
        <p class="font-semibold text-xl">$<span>${element.price}</span></p>
        </div>
        <button id="${element.id}"
        class="w-full bg-gray-100 text-gray-800 py-2 cursor-pointer font-medium border border-gray-100  duration-300 hover:bg-gray-800 hover:text-gray-100">কার্টে
        যোগ করুন</button>
        </div>
        `;
    });
}

// add to cart
let totalCart = JSON.parse(localStorage.getItem('cart')) || [];
productsContainer.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        const id = event.target.id;
        const image = event.target.parentNode.children[0].children[0].src;
        const title = event.target.parentNode.children[1].children[0].innerText;
        const price = event.target.parentNode.children[1].children[1].children[0].innerText;
        const object = { id, image, title, price, quantity: 1 }
        const idchek = totalCart.find(item => item.id === id);
        if (idchek) {
            idchek.quantity++;
        } else {
            totalCart.push(object);
        }
    }
    showCart(totalCart);
    localStorage.setItem('cart', JSON.stringify(totalCart));
    emptyCart()
})
// show add to cart 
const showCart = (carts) => {
    let total = 0;
    addToCartContainer.innerHTML = '';
    totalPriceContainer.innerHTML = '';
    carts.forEach(item => {
        addToCartContainer.innerHTML += `
            <div class="bg-gray-800 border border-gray-700">
                <div class="flex gap-2 items-center">
                    <img class="bg-gray-100 w-20" src="${item.image}" alt="">
                    <div class="space-y-1">
                        <h4 class="font-medium text-xl">${item.title}</h4>
                        <p class="">$<span>${item.price}</span> × <span>${item.quantity}</span></p>
                    </div>
                    <button onclick="removeFrom(${item.id})" class="cursor-pointer text-red-500 ml-auto"><i class="fa-solid fa-xmark"></i></button>
                    <button></button>
                </div>
            </div>
            `;
        total += Number(item.price * item.quantity);
        if (totalCart.length > 0) {
            totalPriceContainer.innerHTML = `
            <h4 class="text-xl font-medium bg-gray-800 px-5 py-2 border border-gray-700">সর্বমোট দামঃ $<span>${total.toFixed(2)}</span></h4>
            `;
        }
    })
}
showCart(totalCart)
// remove from cart
const removeFrom = (id) => {
    const filterData = totalCart.filter(item => item.id != id);
    totalCart = filterData;
    showCart(totalCart);
    localStorage.setItem('cart', JSON.stringify(totalCart));
    emptyCart();
}
// empty cart display
const emptyCart = () => {
    if (totalCart.length <= 0) {
        totalPriceContainer.innerHTML = `
        <h4 class="text-xl font-medium bg-gray-800 px-5 py-2 border border-gray-700">কার্ট ফাঁকা, কেনাকাটা শুরু করুন</h4>
        `;
    }
    cartCount.innerHTML=totalCart.length;
}
emptyCart();
// Search funcnalaty
searchBtn.addEventListener('click',()=>{
    const searchValue = searchInput.value.toLowerCase().trim();
    const searchData = allProducts.filter(item=>item.title.toLowerCase().includes(searchValue));
    searchInput.value='';
    if (searchData.length <=0) {
        return alert('খুঁজে পাওয়া যায়নি')
    }
    showProducts(searchData);
});
// Home
homeBtn.addEventListener('click',()=>{
    showProducts(allProducts);
});
// mobile menu toggole
mobileBtn.addEventListener('click',()=>{
    mobileMenu.classList.toggle('hidden');
})
// Add to cart body toogle
cartBtn.addEventListener('click',()=>{
    cartBody.classList.toggle('hidden')
})