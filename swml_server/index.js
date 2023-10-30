const fs = require("fs").promises;
const path = require("path");
const express = require("express");
const app = express();
const port = 3500;

app.all("/swml.yaml", async (req, res) => {
  try {
    const subdomain = process?.argv[2] ?? "zdswmlserver";
    console.log(`Assuming ${subdomain} for proxy server`);
    res.setHeader("Content-type", "text/yaml; charset=utf-8");
    res.send(await genYAML(subdomain));
  } catch (e) {
    console.error(e);
    res.status(500).send("Error sending SWML");
  }
});

app.listen(port, () => {
  console.log(`SWML Server app listening on port ${port}`);
});

async function genYAML(subdomain) {
  const yaml = await fs.readFile(
    path.join(__dirname, "YAML", "swml.yaml"),
    "utf-8"
  );

  return yaml.replaceAll("__SUBDOMAIN__", subdomain);
}
