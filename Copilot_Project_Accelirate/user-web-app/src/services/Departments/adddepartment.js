document.getElementById('add-department-button').addEventListener('click', () => {
    const departmentID = document.getElementById('department-id').value;
    const departmentName = document.getElementById('department-name').value;

    if (departmentID.trim() === '' || departmentName.trim() === '') {
        alert('Please enter both department ID and name.');
        return;
    }

    const newDepartment = {
        DepartmentID: departmentID,
        DEPARTMENT: departmentName
    };

    fetch('https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/insert/Dim_Department', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDepartment)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 200) {
            alert('Department added successfully!');
            window.location.href = 'index.html';
        } else {
            alert('Failed to add department. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error adding department:', error);
        alert('An error occurred. Please try again.');
    });
});
