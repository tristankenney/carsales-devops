'use strict';

const endpoint = 'https://yuddsc8qj8.execute-api.us-east-1.amazonaws.com';

async function renderRoutes() {
    const response = await fetch(endpoint + '/prod/route');
    const json = await response.json()
    const body = document.getElementById('routes');
    json.records.forEach((record) => {
        body.insertAdjacentHTML('beforebegin', `
            <tr>
                <td>${record.name}</td>
                <td>${record.type}</td>
                <td>${record.value}</td>
                <td>${record.ttl}</td>
            </tr>
        `);
    });
}

renderRoutes();