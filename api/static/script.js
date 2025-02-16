document.getElementById('sentimentForm').onsubmit = async function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const text = formData.get('text');

    try {
        const response = await fetch('/sentiment-analysis/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text }),
        });
        const result = await response.json();
        document.getElementById('result').innerText = JSON.stringify(result, null, 2);
    } catch (error) {
        document.getElementById('result').innerText = 'Error: ' + error.message;
    }
};
