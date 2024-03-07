
//variable declarations

let userIdCount = localStorage.getItem('userIdCount') || 0;

//classes

class User {
    constructor (id, name, address, mail) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.mail = mail;
    }
}


//validations

function validateString(string, minLength, maxLength) {
    return string.length >= minLength && string.length <= maxLength;
}

function emailValidation (mail) {
    const regex = new RegExp(/^[a-z0-9]{1,20}@[a-z]{1,20}\.[a-z]{1,3}$/)
    return regex.test(mail);
}

//function declarations

function displayErrorMessage(message, element, valid) {
    if (!valid) {
        element.innerText = message;
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
}

function saveUserToLocalStorage (user) {
    const savedUsers = JSON.parse(localStorage.getItem('users'));
    if(savedUsers) {
        savedUsers.push(user);
        localStorage.setItem('users', JSON.stringify(savedUsers));
    } else {
        localStorage.setItem ('users', JSON.stringify([ user ]))
    }
}

//event listeners

const sendFormBtn = document.querySelector('[data-send-button]');
sendFormBtn.addEventListener('click', () => {
    const nameInput = document.getElementById('name');
    const addressInput = document.getElementById('address');
    const mailInput = document.getElementById('email');

    const isNameValid = validateString(nameInput.value, 3, 40);
    const isAddressValid = validateString(addressInput.value, 8, 40)
    const isMailValid = emailValidation(mailInput.value);

    displayErrorMessage('El campo debe contener entre 3 y 40 caracteres.', nameInput.nextElementSibling, isNameValid);
    displayErrorMessage('El campo debe contener entre 8 y 40 caracteres.', addressInput.nextElementSibling, isAddressValid);
    displayErrorMessage('El formato ingresado no es correcto', mailInput.nextElementSibling, isMailValid)

    if(isNameValid && isAddressValid && isMailValid) {
        userIdCount++
        const newUser = new User(userIdCount, nameInput.value, addressInput.value, mailInput.value)
        saveUserToLocalStorage(newUser)
        localStorage.setItem('userIdCount', userIdCount);
        nameInput.value = '';
        addressInput.value = '';
        mailInput.value = '';
        location.reload();
    }
})

document.addEventListener('DOMContentLoaded', () => {
    const users = JSON.parse(localStorage.getItem('users'));
    if(!users || users.length === 0) {
        userIdCount = 0;
        localStorage.setItem('userIdCount', userIdCount);

        const dataContainer = document.querySelector('.data-container');
        dataContainer.style.display = 'none';

        return
    }

    const tableContainer = document.querySelector('[data-table-container]');
    const tableTemplate = document.querySelector('[data-table-template]');

    const table = tableTemplate.content.cloneNode(true).children[0];

    const tableBody = table.querySelector('[data-table-body]');
    
    users.forEach(user => {
        const tableRow = document.createElement('tr');

        const userId = document.createElement('td');
        userId.innerText = user.id;
        
        const userName = document.createElement('td');
        userName.innerText = user.name;
        
        const userAddress = document.createElement('td');
        userAddress.innerText = user.address;

        const userMail = document.createElement('td');
        userMail.innerText = user.mail;

        const deleteUser = document.createElement('td');
        const deleteUserBtn = document.createElement('button');
        deleteUserBtn.innerHTML = '&times;'
        deleteUserBtn.classList.add('deleteUser');
        deleteUserBtn.addEventListener('click', () => {
            const userToRemoveIndex = users.findIndex(user => user.id == userId.innerText);
            users.splice(userToRemoveIndex, 1);
            tableBody.removeChild(tableRow);
            localStorage.setItem('users', JSON.stringify(users));
            location.reload();
        })
        deleteUser.appendChild(deleteUserBtn)
        
        tableRow.appendChild(userId);
        tableRow.appendChild(userName);
        tableRow.appendChild(userAddress);
        tableRow.appendChild(userMail);
        tableRow.appendChild(deleteUser)

        tableBody.appendChild(tableRow)
    })

    tableContainer.appendChild(table)

})