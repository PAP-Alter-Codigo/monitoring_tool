/**
 * Módulo centralizado de validaciones reutilizables.
 * HR-08, HR-09 — Auditoría Técnica de Base de Datos
 */

/**
 * Valida que un nombre sea un string no vacío y sin solo espacios.
 * @param {string} name
 * @returns {boolean}
 */
const isValidName = (name) =>
  typeof name === 'string' && name.trim().length > 0;

/**
 * Valida que una fecha tenga formato DD/MM/YYYY.
 * @param {string} date
 * @returns {boolean}
 */
const isValidDate = (date) =>
  typeof date === 'string' &&
  /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(date);

/**
 * Valida que las coordenadas geográficas estén dentro de rangos válidos.
 * Latitud: -90 a 90 / Longitud: -180 a 180
 * @param {number[]} geolocation - Array [lat, lon]
 * @returns {boolean}
 */
const isValidGeoRange = (geolocation) => {
  if (!Array.isArray(geolocation) || geolocation.length !== 2) return false;
  const [lat, lon] = geolocation;
  return (
    typeof lat === 'number' &&
    typeof lon === 'number' &&
    lat >= -90 && lat <= 90 &&
    lon >= -180 && lon <= 180
  );
};

module.exports = { isValidName, isValidDate, isValidGeoRange };