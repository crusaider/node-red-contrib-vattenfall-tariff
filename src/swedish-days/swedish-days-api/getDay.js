const fetch = require("node-fetch");

/**
 * @see https://api.dryg.net/
 *
 * @returns {Promise<SwedishDay>}
 */
const getDay = async ({ year, month, day }) => {
  const url = `https://sholiday.faboul.se/dagar/v2.1/${year}/${month}/${day}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return await response.json();
};

module.exports = { getDay };

/*
{"cachetid":"2023-08-29 13:54:41","version":"2.1","uri":"\/dagar\/v2.1\/2015\/01\/06","startdatum":"2015-01-06","slutdatum":"2015-01-06","dagar":[{"datum":"2015-01-06","veckodag":"Tisdag","arbetsfri dag":"Ja","r\u00f6d dag":"Ja","vecka":"02","dag i vecka":"2","helgdag":"Trettondedag jul","namnsdag":["Kasper","Melker","Baltsar"],"flaggdag":""}]}
*/
