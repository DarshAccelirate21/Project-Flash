document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const employeeID = urlParams.get('EmployeeID');
    if (employeeID) {
        fetchEmployeeData(employeeID);
    }
});

function fetchEmployeeData(employeeID) {
    fetch(`https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/select/Dim_Employee?EmployeeID=${employeeID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 200 && data.data) {
            const employee = data.data[0];
            displayEmployeeData(employee);
        } else {
            console.error('Invalid API response:', data);
        }
    })
    .catch(error => console.error('Error fetching employee data:', error));
}

function displayEmployeeData(employee) {
    const container = document.getElementById('edit-container');
    if (container) {
        container.innerHTML = `
            <div class="user-card">
                <h2>${employee.FIRST_NAME} ${employee.LAST_NAME}</h2>
                <h3>Employee ID: ${employee.EmployeeID}</h3>
                <h3>Hire Date: ${new Date(employee.HIRE_DATE).toLocaleDateString()}</h3>
                <p class="status ${employee.Employee_Status === 'ACTIVE' ? 'active' : 'inactive'}">Status: ${employee.Employee_Status}</p>
            </div>
            <form id="edit-form">
                <label for="first-name">First Name:</label>
                <input type="text" id="first-name" name="FIRST_NAME" value="${employee.FIRST_NAME}">
                <label for="last-name">Last Name:</label>
                <input type="text" id="last-name" name="LAST_NAME" value="${employee.LAST_NAME}">
                <label for="hire-date">Hire Date:</label>
                <input type="date" id="hire-date" name="HIRE_DATE" value="${new Date(employee.HIRE_DATE).toISOString().split('T')[0]}">
                <label for="status">Status:</label>
                <select id="status" name="Employee_Status">
                    <option value="ACTIVE" ${employee.Employee_Status === 'ACTIVE' ? 'selected' : ''}>ACTIVE</option>
                    <option value="INACTIVE" ${employee.Employee_Status === 'INACTIVE' ? 'selected' : ''}>INACTIVE</option>
                </select>
                <label for="is-manager">Manager:</label>
                <select id="is-manager" name="IsManager">
                    <option value="1" ${employee.IsManager ? 'selected' : ''}>Yes</option>
                    <option value="0" ${!employee.IsManager ? 'selected' : ''}>No</option>
                </select>
                <button type="submit">Save Changes</button>
            </form>
        `;

        const form = document.getElementById('edit-form');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            updateEmployeeData(employee.EmployeeID);
        });
    }
}

function updateEmployeeData(employeeID) {
    const form = document.getElementById('edit-form');
    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
        if (value) {
            data[key] = value;
        }
    });

    fetch(`https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/update/Dim_Employee/${employeeID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 200) {
            alert('Employee data updated successfully');
            window.location.href = 'index.html';
        } else {
            console.error('Error updating employee data:', data);
        }
    })
    .catch(error => console.error('Error updating employee data:', error));
}
