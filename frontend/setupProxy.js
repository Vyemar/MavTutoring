const fs = require("fs");

process.env.HTTPS = "true"; // Force HTTPS
process.env.NODE_OPTIONS = "--openssl-legacy-provider"; // Ensure legacy provider works