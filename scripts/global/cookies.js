window.SETTINGS = null;

window.setSettingsCookie = function (settingsObj) {
    const jsonString = typeof settingsObj === 'string' ? settingsObj : JSON.stringify(settingsObj);
    const base64Value = btoa(jsonString);
    const maxAge = 60 * 60 * 24 * 365;
    document.cookie = `settings=${base64Value}; max-age=${maxAge}; path=/; SameSite=Lax; Secure`;
};

window.getSettingsCookie = function () {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; settings=`);

    if (parts.length === 2) {
        const base64Value = parts.pop().split(';').shift();
        try {
            const jsonString = atob(base64Value);
            return JSON.parse(jsonString);
        } catch (error) {
            console.error("Failed to decode or parse settings cookie:", error);
            return null;
        }
    }
    return null;
};

(function () {
    window.SETTINGS = window.getSettingsCookie();
    if (!window.SETTINGS) {
        window.SETTINGS = { "theme": "light" };
        window.setSettingsCookie(window.SETTINGS);
    }
})();

window.addEventListener("beforeunload", function () {
    window.setSettingsCookie(window.SETTINGS);
});