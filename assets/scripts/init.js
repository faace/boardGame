var config = require("config");

if (!CC_BUILD) require("config.debug").append(config);

require('ge')(config);
