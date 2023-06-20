export function validEmail(email) {
    const regexEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email || !regexEmail.test(email)) {
        return false;
    }
    return true;
}

export function validPhone(phone) {
    const regexMobie = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
    if (!phone || !regexMobie.test(phone)) {
        return false;
    }
    return true;
}

export const regexEmaill = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const regexMobie = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;