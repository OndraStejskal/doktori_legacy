const baseApiUrl = 'http://localhost:3000/app-api'; // development
// const baseApiUrl = '/app-api'; // production

async function get(specUrl) {
    return httpRequest('GET', specUrl);
}

async function del(specUrl) {
    return httpRequest('DELETE', specUrl);
}

async function post(specUrl, body) {
    return httpRequest('POST', specUrl, body)
}

async function put(specUrl, body) {
    return httpRequest('PUT', specUrl, body);
}

async function httpRequest(method, specUrl, body=null)
{
    var stringBody = null;
    if (body) {
        stringBody = JSON.stringify(body, replacer)
    }   

    var response = await fetch(baseApiUrl + specUrl, {        
        method: method,
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: stringBody,
    })
    .catch(() => {
        throw new Error('Vyskytla se chyba');
    });

    if (response.status == 200 || response.status == 201 ) {
        return response.json();
    }
    if (response.status == 204) {
        return response.text();
    }
    else {
        var error = await response.json();
        var errorMsg = error.message;
        throw new Error(errorMsg);
    }
}

function replacer(key, value) {
    switch (key) {
        case "wage": case "spaces":
            return +value  
        default:
            return value
    }
}

export default {
    get, post, put, del
}