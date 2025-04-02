document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('adduser-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        addNewEmployee();
    });
});

function addNewEmployee() {
    const form = document.getElementById('adduser-form');
    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });

    fetch('http://localhost:2024/api/insert/Dim_Employee', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 200) {
            alert('Employee added successfully');
            window.location.href = 'index.html';
        } else {
            alert('Error adding employee: ' + data.message);
            console.error('Error adding employee:', data);
        }
    })
    .catch(error => {
        alert('Error adding employee: ' + error.message);
        console.error('Error adding employee:', error);
    });
}
