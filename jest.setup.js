// crypto is a std web library available in all modern browsers
// it is also available in node v19+
// it is not however available at jest runtime
// jest uses jsdom which does not yet support the web crypto api
global.crypto = require("crypto");
