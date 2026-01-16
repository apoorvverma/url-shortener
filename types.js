/**
 * @file Common JSDoc typedefs shared across the project.
 */

/**
 * A row from the urls table.
 * @typedef {Object} UrlRow
 * @property {string} short_code
 * @property {string} url
 * @property {string | null} [normalized_url]
 * @property {number} visits
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * A row from the urls_visits table.
 * @typedef {Object} UrlVisitRow
 * @property {number} id
 * @property {string} device_id
 * @property {string} short_code
 * @property {number} visit_count
 * @property {string} created_at
 * @property {string} updated_at
 */
