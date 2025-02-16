function showForm(model) {
    // Oculta todos los formularios
    document.querySelectorAll('.form').forEach(form => {
        form.classList.add('hidden');
    });

    // Muestra el formulario seleccionado
    document.getElementById(`${model}-form`).classList.remove('hidden');
}

async function submitForm(event, endpoint) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {};

    formData.forEach((value, key) => {
        if (key === 'candidate_labels') {
            data[key] = value.split(',').map(label => label.trim());
        } else {
            data[key] = value;
        }
    });

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        document.getElementById('result').innerText = JSON.stringify(result, null, 2);
    } catch (error) {
        document.getElementById('result').innerText = 'Error: ' + error.message;
    }
}
