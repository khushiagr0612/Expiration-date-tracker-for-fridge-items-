const form = document.getElementById('item-form');
const itemList = document.getElementById('item-list');
const EXPIRY_WARNING_DAYS = 3; // Notify 3 days before expiration

// Load items from localStorage on page load
document.addEventListener('DOMContentLoaded', loadItems);

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('item-name').value;
    const quantity = document.getElementById('item-quantity').value;
    const expiry = document.getElementById('item-expiry').value;

    if(name && quantity && expiry) {
        const item = { name, quantity, expiry };
        addItemToList(item);
        saveItem(item);
        form.reset();
    }
});

function addItemToList(item) {
    const li = document.createElement('li');

    const today = new Date();
    const expiryDate = new Date(item.expiry);
    const timeDiff = expiryDate - today;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if(daysLeft < 0) {
        li.classList.add('expired'); // Already expired
    } else if(daysLeft <= EXPIRY_WARNING_DAYS) {
        li.style.backgroundColor = '#f1c40f'; // Expiring soon (yellow)
        li.style.color = '#000';
        li.title = `Expires in ${daysLeft} day(s)!`; // Tooltip
    }

    li.innerHTML = `
        <span>${item.name} - ${item.quantity} pcs - Expires: ${item.expiry}</span>
        <button class="delete-btn">Delete</button>
    `;

    li.querySelector('.delete-btn').addEventListener('click', () => {
        li.remove();
        removeItem(item);
    });

    itemList.appendChild(li);

    // Optional: alert for expiring soon items
    if(daysLeft > 0 && daysLeft <= EXPIRY_WARNING_DAYS) {
        alert(`⚠️ "${item.name}" is expiring in ${daysLeft} day(s)!`);
    }
}

function saveItem(item) {
    let items = JSON.parse(localStorage.getItem('fridgeItems')) || [];
    items.push(item);
    localStorage.setItem('fridgeItems', JSON.stringify(items));
}

function loadItems() {
    let items = JSON.parse(localStorage.getItem('fridgeItems')) || [];
    items.forEach(item => addItemToList(item));
}

function removeItem(itemToRemove) {
    let items = JSON.parse(localStorage.getItem('fridgeItems')) || [];
    items = items.filter(item => !(item.name === itemToRemove.name && item.expiry === itemToRemove.expiry));
    localStorage.setItem('fridgeItems', JSON.stringify(items));
}
