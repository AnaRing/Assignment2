const products = [];
document.addEventListener('DOMContentLoaded', function() {

// date to - iso convertion

document.querySelector('#expiryDate').addEventListener('change', function() {
    const dateInput = this.value;

    const isoDate = new Date(dateInput).toISOString();

    console.log(isoDate);
});

// selecting elements from the dom

const productName = document.querySelector('.product__name');
const productID = document.querySelector('.product__id');
const manufacturer = document.querySelector('.product__manufacturer');
const productExpiry = document.querySelector('.product__expiry');
const productQuantity = document.querySelector('.product__quantity');
const storageUl = document.querySelector('.storage__list');

const positiveToast = document.querySelector('.submit__toast');
const negativeToast = document.querySelector('.submit__negative__toast');
const errorToast = document.querySelector('#errorID');

const inputForm = document.querySelector('.pharmacy__storage__form')
const displayStorage = document.querySelector('.display__storage__container');

loadFormData();
// adding eventlisteners

/* inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let newProduct;
    if(selectElement.value) */

// toast function
document.addEventListener('DOMContentLoaded', function(){
    inputForm.addEventListener('submit', function (event) {
        event.preventDefault();

        if (isFormFilledOut(inputForm)) {
            saveFormData();
            positiveToast.style.display = 'block';
            negativeToast.style.display = 'none';
            errorToast.style.display = 'none';
            displayFormData();
            setTimeout(function () {
                positiveToast.style.display = 'none';
                inputForm.reset();
            }, 2000);
        } else {
            if (productIDExists(productID.value)) {
                errorToast.style.display = 'block';
                negativeToast.style.display = 'none';
            } else {
                errorToast.style.display = 'none';
                negativeToast.style.display = 'block';
            }
        }
    });
});

// isFormFilledOut function
function isFormFilledOut(inputForm) {
    const formInputs =  inputForm.querySelectorAll('input[required]');
    for (const input of formInputs) {
        if(!input.value.trim()) {
            return false;
        }
    }
    return true;
}

// does ID exist
/* function productIDExists(id) {
    // function will check if the ID exists within the local storage
} */

function saveFormData() {
    const formData = {
        productName: productName.value,
        productID: productID.value,
        manufacturer: manufacturer.value,
        productExpiry: productExpiry.value,
        productQuantity: productQuantity.value
    };

    localStorage.setItem('formData', JSON.stringify(formData));
}

function loadFormData() {
    const storedData = localStorage.getItem('formData');
    if (storedData) {
        const parsedData =  JSON.parse(storedData);
        productName.value =parsedData.productName || '';
        productID.value= parsedData.productID || '';
        manufacturer.value = parsedData.manufacturer|| '';
        productExpiry.value = parsedData.productExpiry || '';
        productQuantity.value = parsedData.productQuantity || '';
    }
}
});

// declaring the Product class

class Product {
    constructor (name, id, manu, expDate, quantity){
        this.product_name = name;
        this.prod_id = id;
        this.manufacture = manu;
        this.expiration_date = new Date(expDate).toISOString().substr(0,10); 
        this.quantity= quantity;
} 
static addProduct(product)