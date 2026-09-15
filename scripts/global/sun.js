import * as FETCH from "../utility/fetch.js";
import * as COLOR from "../utility/color.js";

const bgVariables = [
    '--background',
    '--nav-background',
    '--about-background',
    '--content-background',
    '--post-card-background'
];

let solarCoords = { lat: 0, lon: 0, orientation: 0 };

function getSolarPosition(date, lat, lon) {
    const root = document.documentElement;
    const deg2rad = Math.PI / 180;
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
    const declination = 23.44 * Math.sin(deg2rad * (360 / 365) * (dayOfYear + 284));

    // Using local 24h as discussed
    const localHour = date.getHours() + (date.getMinutes() / 60);
    const solarNoon = 12 - (lon / 15);
    const hourAngle = (localHour - solarNoon) * 15;

    const altRad = Math.asin(
        Math.sin(lat * deg2rad) * Math.sin(declination * deg2rad) +
        Math.cos(lat * deg2rad) * Math.cos(declination * deg2rad) * Math.cos(hourAngle * deg2rad)
    );

    const azRad = Math.atan2(
        Math.sin(hourAngle * deg2rad),
        Math.cos(hourAngle * deg2rad) * Math.sin(lat * deg2rad) - Math.tan(declination * deg2rad) * Math.cos(lat * deg2rad)
    );

    if (dark(localHour)) root.dataset.theme = "dark";
    else root.dataset.theme = "light";
    console.log(root.dataset.theme, dark(localHour));

    return { altitude: altRad / deg2rad, azimuth: azRad / deg2rad };
}

function updateShadow(pos) {
    console.log("update shadow");
    const root = document.documentElement;
    const intensity = 15;

    if (pos.altitude < 0) {
        root.style.setProperty('--shadow', `0px 0px 20px var(--shadow-color)`);
        return;
    }

    const adjustedAzimuth = pos.azimuth - solarCoords.orientation;
    const shadowAngleRad = (adjustedAzimuth + 180) * (Math.PI / 180);
    const length = intensity * (1 - (pos.altitude / 90));

    const x = Math.round(Math.sin(shadowAngleRad) * length);
    const y = Math.round(Math.cos(shadowAngleRad) * -length);
    const blur = Math.max(4, Math.round(15 - pos.altitude / 3));

    root.style.setProperty('--shadow', `${x}px ${y}px ${blur}px var(--shadow-color)`);
}

function tick() {
    const root = document.documentElement;
    if (root.dataset.themeMode != "time") return;
    console.log("sun tick");

    const now = new Date();
    const pos = getSolarPosition(now, solarCoords.lat, solarCoords.lon);

    console.log(pos);

    updateShadow(pos);
}

function startAtZero() {
    console.log("start sun");
    tick();
    const now = new Date();
    const nextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

    setTimeout(() => {
        tick();
        setInterval(tick, 60000);
    }, nextMinute);
}

// Initialization
try {
    const data = await FETCH.GetYAML('../../_data/locations.yml');
    solarCoords.lat = data.blog.lat;
    solarCoords.lon = data.blog.lon;
    solarCoords.orientation = data.blog.deg || 0;
    startAtZero();
} catch (error) {
    console.error("Sun Failed:", error);
}