//REST client
const apiUrl = 'http://localhost:3000/api/users';
const usersData = document.getElementById('usersData');

async function getUsers() {
    //debugger;
    const response = await fetch(apiUrl);
    const users = await response.json();

    
    usersData.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.city}</td>
            <td>${user.address}</td>
            <td>${user.phone}</td>
            <td>${user.email}</td>
            <td>${user.gender}</td>
            <td>
            <button onClick="deleteUser(${user.id})">Törlés</button>
            </td>
        </tr>
        `).join('');

}

document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    //debugger;
    try {
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    if (!data.firstName || !data.lastName || !data.city || !data.address || !data.phone || !data.email|| !data.gender) {
        alert('Hiányzó adatok!');
    } else {
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const result = await response.json();

    if (response.ok) {
        alert(result.message);
        getUsers();
    } else {
        alert(result.message);
    }
    e.target.reset();
}
}
catch(e) {
    alert(e.message);
}
})

async function deleteUser(id) {
    if (confirm('Valóban törölni akarod a felhasználót?')) {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('A felhasználó törlése megtörtént.');
            getUsers();
        } else {
            alert('A felhasználó adatainak a törlése sikertelen volt!');
        }
    }
}

getUsers();