// returns a string that has been striped of all characters that would
// cause errors in dropbox

const cleanString = str =>
  str
    .replace(/\*/g, "")
    .replace(/\|/g, "")
    .replace(/&/g, "")
    .replace(/!/g, "")
    .replace(/@/g, "")
    .replace(/#/g, "")
    .replace(/\$/g, "")
    .replace(/%/g, "")
    .replace(/\^/g, "")
    .replace(/\(/g, "")
    .replace(/\)/g, "")
    .replace(/\+/g, "")
    .replace(/=/g, "")
    .replace(/~/g, "")
    .replace(/`/g, "")
    .replace(/"/g, "")
    .replace(/'/g, "")
    .replace(/;/g, "")
    .replace(/:/g, "")
    .replace(/>/g, "")
    .replace(/</g, "")
    .replace(/\{/g, "")
    .replace(/\}/g, "")
    .replace(/\[/g, "")
    .replace(/\]/g, "")
    .replace(/\?/g, "")

module.exports = cleanString
