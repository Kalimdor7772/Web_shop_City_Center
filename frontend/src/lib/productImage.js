const TRANSPARENT_GIF =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

const encodeSvg = (svg) =>
    `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

export const getProductImageFallback = (label = "Product") =>
    encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff8ef" />
      <stop offset="100%" stop-color="#f1e7d4" />
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#bg)" />
  <circle cx="400" cy="280" r="120" fill="#ffffff" opacity="0.7" />
  <rect x="240" y="360" rx="36" ry="36" width="320" height="180" fill="#ffffff" opacity="0.88" />
  <path d="M320 360c0-44 36-80 80-80s80 36 80 80" fill="none" stroke="#1f9d68" stroke-width="28" stroke-linecap="round"/>
  <text x="400" y="620" text-anchor="middle" font-family="Arial, sans-serif" font-size="38" font-weight="700" fill="#5c5346">
    ${String(label).slice(0, 28)}
  </text>
</svg>`);

export const normalizeProductImage = (src, label) => {
    if (typeof src === "string" && src.trim()) {
        return src.trim();
    }

    return getProductImageFallback(label);
};

export const getSafeImageSrc = (src, label) => normalizeProductImage(src, label) || TRANSPARENT_GIF;
