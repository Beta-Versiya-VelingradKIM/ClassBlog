export function adjustColor(color, factor) {
    const tempEl = document.createElement("div");
    tempEl.style.color = color;
    document.body.appendChild(tempEl);

    const computed = getComputedStyle(tempEl).color;
    document.body.removeChild(tempEl);

    // Capture all 4 values if available (r, g, b, a)
    const rgba = computed.match(/[\d.]+/g).map(Number);
    let [r, g, b] = rgba.slice(0, 3).map(v => v / 255);
    // Capture the original alpha; default to 1 if it's just rgb()
    const alpha = rgba[3] !== undefined ? rgba[3] : 1;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    const newL = Math.max(0, l * factor);

    // Return HSLA so alpha is preserved
    return `hsla(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(newL * 100)}%, ${alpha})`;
}