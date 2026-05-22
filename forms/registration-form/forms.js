const LEAD_API_URL = 'https://api.rafunirp.com/api/leads/integration';

function getEndpoint(source) {
    const endpoints = {
        'facebook': 'Facebook',
        'instagram': 'Instagram',
        'website': 'Website',
        'google': 'GoogelForm'
    };
    return endpoints[source] || source;
}

function showMessage(element, message, isError = false) {
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
    }, 8000);
}

function collectFormData(form) {
    const formData = {
        name: form.querySelector('#name').value,
        email: form.querySelector('#email').value,
        address: "Neemrana Rajasthan", // Hardcoded as per requested format
        phones: [form.querySelector('#phone').value], // Wrapping phone in an array
        course: form.querySelector('#course').value
    };
    return formData;
}

async function submitForm(form, source) {
    const formData = collectFormData(form);
    const endpoint = getEndpoint(source);
    const messageDiv = form.querySelector('.success-message, .error-message') || createMessageDiv(form);

    try {
        const response = await fetch(`${LEAD_API_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            showMessage(messageDiv, 'Thank you! We will contact you as soon as possible.', false);
            form.reset();
        } else {
            const error = await response.text();
            showMessage(messageDiv, `Error: ${error}`, true);
        }
    } catch (error) {
        showMessage(messageDiv, `Connection error: ${error.message}`, true);
    }
}

function createMessageDiv(form) {
    const div = document.createElement('div');
    div.className = 'success-message';
    form.appendChild(div);
    return div;
}

async function populateCourseDropdown() {
    const courseSelect = document.getElementById('course');
    if (!courseSelect) return;

    try {
        const response = await fetch('https://api.rafunirp.com/api/course/name');
        if (response.ok) {
            const json = await response.json();
            if (json.success && Array.isArray(json.data)) {
                // Clear existing options
                courseSelect.innerHTML = '';

                // Add the default select option
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Select Course';
                courseSelect.appendChild(defaultOption);

                // Populate options from API
                json.data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.course;
                    option.textContent = item.course;
                    courseSelect.appendChild(option);
                });
            }
        } else {
            console.error('Failed to fetch courses:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Populate course dropdown dynamically from API
    populateCourseDropdown();

    const facebookForm = document.getElementById('facebookForm');
    if (facebookForm) {
        facebookForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitForm(facebookForm, 'facebook');
        });
    }

    const instagramForm = document.getElementById('instagramForm');
    if (instagramForm) {
        instagramForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitForm(instagramForm, 'instagram');
        });
    }

    const websiteForm = document.getElementById('websiteForm');
    if (websiteForm) {
        websiteForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitForm(websiteForm, 'website');
        });
    }

    const googleForm = document.getElementById('googleForm');
    if (googleForm) {
        googleForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitForm(googleForm, 'google');
        });
    }
});
