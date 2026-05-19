const LEAD_API_URL = 'https://api.raunirp.com/api/leads/integration';

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
    }, 5000);
}

function collectFormData(form) {
    const formData = {
        name: form.querySelector('#name').value,
        email: form.querySelector('#email').value,
        phone: form.querySelector('#phone').value,
        alternatePhone: form.querySelector('#alternatePhone')?.value || '',
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
            showMessage(messageDiv, 'Form submitted successfully!', false);
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

document.addEventListener('DOMContentLoaded', function () {
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
