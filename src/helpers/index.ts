export function isNullOrWhitespace(input: string) {
    if (typeof input === "undefined" || input == null) return true;
    return input.replace(/\s/g, "").length < 1;
}

export function validateUrl(input: string) {
    try {
        return Boolean(new URL(input));
    }
    catch(e){
        return false;
    }
}

export function getRandomHash() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}