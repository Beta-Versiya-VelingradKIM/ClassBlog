// Import the YAML parser from a CDN
import 'https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js';

export async function GetJSON(url) {
    return await fetch(url)
        .then(response => {
            if (!response.ok) throw Error(`Something went wrong. ${response.status}\n${url}`);
            return response.json();
        })
        .catch(error => { throw error; });
}

export async function GetYAML(url) {
    return await fetch(url)
        .then(response => {
            if (!response.ok) throw Error(`Could not find YAML. ${response.status}\n${url}`);
            return response.text();
        })
        .then(text => {
            return jsyaml.load(text);
        })
        .catch(error => { throw error; });
}