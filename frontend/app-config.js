'use strict';
// GitHub Pages is static; local development and Render use the same-origin API.
const isPublishedPages = location.hostname === 'sotonicolasjnsn.github.io';
globalThis.NUDO_API_BASE = isPublishedPages ? 'https://nudo-botica.onrender.com/' : '';
