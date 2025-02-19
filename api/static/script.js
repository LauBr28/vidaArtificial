function showForm(model) {
    // Oculta todos los formularios
    document.querySelectorAll('.form').forEach(form => {
        form.classList.add('hidden');
    });

    // Muestra el formulario seleccionado
    document.getElementById(`${model}-form`).classList.remove('hidden');
}

function formatResult(model, result) {
    let formattedResult = "";

    switch (model) {
        case "sentiment-analysis":
            formattedResult = `Sentimiento: ${result[0].label}\nConfianza: ${(result[0].score * 100).toFixed(2)}%`;
            break;

        case "zero-shot-classification":
            formattedResult = "Clasificación:\n";
            result.labels.forEach((label, index) => {
                formattedResult += `${label}: ${(result.scores[index] * 100).toFixed(2)}%\n`;
            });
            break;

        case "text-generation":
            formattedResult = "Texto generado:\n";
            result.forEach((text, index) => {
                formattedResult += `${index + 1}. ${text.generated_text}\n`;
            });
            break;

        case "fill-mask":
            formattedResult = "Opciones completadas:\n";
            result.forEach((option, index) => {
                formattedResult += `${index + 1}. ${option.sequence} (Confianza: ${(option.score * 100).toFixed(2)}%)\n`;
            });
            break;

        case "ner":
            formattedResult = "Entidades reconocidas:\n";
            result.forEach((entity, index) => {
                formattedResult += `${index + 1}. ${entity.word} (${entity.entity_group}): ${(entity.score * 100).toFixed(2)}%\n`;
            });
            break;

        case "question-answering":
            formattedResult = `Respuesta: ${result.answer}\nConfianza: ${(result.score * 100).toFixed(2)}%`;
            break;

        case "summarization":
            formattedResult = `Resumen: ${result[0].summary_text}`;
            break;

        case "translation":
            formattedResult = `Traducción: ${result[0].translation_text}`;
            break;

        default:
            formattedResult = JSON.stringify(result, null, 2);
    }

    return formattedResult;
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

        // Obtener el nombre del modelo desde el endpoint
        const model = endpoint.split('/')[1];

        // Formatear el resultado
        const formattedResult = formatResult(model, result.result);

        // Mostrar el resultado formateado
        document.getElementById('result').innerText = formattedResult;
    } catch (error) {
        document.getElementById('result').innerText = 'Error: ' + error.message;
    }
}
