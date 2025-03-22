function xorEncrypt(data, key) {
    let encrypted = "";
    key = key + "wE2thvDu4n";
    for (let i = 0; i < data.length; i++) {
        encrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return encrypted;
}

function calculateEncryptedCookie(data, cookieGuard) {
    if (cookieGuard.length < 8) {
        throw new Error("Invalid cookie guard length");
    }
    const key = cookieGuard.slice(0, 8);
    const encrypted = xorEncrypt(data, key);
    return btoa(encrypted);
}

function jsValue(timeNumPlain) {
    if (typeof timeNumPlain === 'string') {
        timeNumPlain = parseInt(timeNumPlain);
    }
    const result1 = timeNumPlain - 2;
    const result2 = result1 + 18;
    return (result2 + timeNumPlain).toString();
}

async function fetchGuardFromResponse(url) {
    try {
        const response = await fetch(url, { method: 'GET', credentials: 'include' });
        const cookies = response.headers.get('Set-Cookie');
        if (cookies) {
            const guardMatch = cookies.match(/guard=([^;]+)/);
            if (guardMatch && guardMatch[1]) {
                return guardMatch[1];
            }
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function fetchGuardokWithEncryptedCookie(url, encryptedCookie, originalGuard) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Cookie': `guard=${originalGuard}; guardret=${encryptedCookie}`
            },
            credentials: 'include',
        });
        const cookies = response.headers.get('Set-Cookie');
        if (cookies) {
            const guardokMatch = cookies.match(/guardok=([^;]+)/);
            if (guardokMatch && guardokMatch[1]) {
                return guardokMatch[1];
            }
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

(async function() {
    const url = 'https://www.h-acker.cn/';
    const guard = await fetchGuardFromResponse(url);
    console.log(`guard: ${guard}`);
    if (guard === null) {
        console.log("Failed to retrieve guard value.");
        return;
    }

    const data = jsValue(guard.slice(-2));
    const encryptedCookie = calculateEncryptedCookie(data, guard);
    console.log("guardret:", encryptedCookie);
})();


//新版本cdnfly通杀密钥 wE2thvDu4n
//旧版本为PTNo2n3Ev5
