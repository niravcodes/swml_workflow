//#region get env variables
require("dotenv").config();
const { PROJECT_ID, API_TOKEN, SPACE, AI_NUMBER } = process.env;
if (!(PROJECT_ID && API_TOKEN && SPACE && AI_NUMBER)) {
  console.error("Set your credentials in .env file properly.");
  process.exit(1);
}
//#endregion

//#region core server code
const fs = require("fs").promises;
const path = require("path");
const express = require("express");
const app = express();
const port = 3000;

app.get("/", async (req, res) => {
  try {
    res.send(await genHTML());
  } catch (e) {
    console.error(e);
    res.status(500).send("Error generating HTML :(");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
//#endregion

//#region Utility functions
const axios = require("axios");
async function genHTML() {
  const html = await fs.readFile(path.join(__dirname, "caller.html"), "utf-8");
  const token = await getToken();
  if (!token) throw "Couldn't get Relay token";

  return html
    .replaceAll("__SPACE__", SPACE)
    .replaceAll("__PROJECTID__", PROJECT_ID)
    .replaceAll("__TOKEN__", token)
    .replaceAll("__AINUMBER__", AI_NUMBER);
}

async function getToken() {
  const tokenReq = await axios.post(
    `https://${SPACE}.signalwire.com/api/relay/rest/jwt`,
    {},
    { auth: { username: PROJECT_ID, password: API_TOKEN } }
  );
  return tokenReq?.data?.jwt_token;
}
//#endregion
