document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const departmentID = urlParams.get('DepartmentID');
    if (departmentID) {
        fetchDepartmentData(departmentID);
    }

    document.getElementById('edit-department-button').addEventListener('click', () => {
        const departmentName = document.getElementById('department-name').value;

        if (departmentName.trim() === '') {
            alert('Please enter a department name.');
            return;
        }

        const updatedDepartment = {
            DepartmentID: departmentID,
            DEPARTMENT: departmentName
        };

        fetch(`https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/update/Dim_Department/${departmentID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedDepartment)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                alert('Department updated successfully!');
                window.location.href = 'index.html';
            } else {
                alert('Failed to update department. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error updating department:', error);
            alert('An error occurred. Please try again.');
        });
    });
});

function fetchDepartmentData(departmentID) {
    fetch(`https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/select/Dim_Department?DepartmentID=${departmentID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 200 && data.data) {
            const department = data.data[0];
            document.getElementById('department-id').value = department.DepartmentID;
            document.getElementById('department-name').value = department.DEPARTMENT;
        } else {
            alert('Failed to load department data. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error fetching department data:', error);
        alert('Failed to load department data. Please try again.');
    });
}
