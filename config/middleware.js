const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const tokenSecretKey = process.env.SECRET_KEY || "s0m3s3cr37";