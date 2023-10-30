//#region get env variables
require("dotenv").config();
const { AUTH } = process.env;
if (!AUTH) {
  console.error("Set your credentials in .env file properly.");
  process.exit(1);
}
//#endregion

//#region core server code
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

const axios = require("axios");
axios.defaults.baseURL = "https://d3v-signalwire.zendesk.com";
axios.defaults.headers.common["Authorization"] = `basic ${AUTH}`;

const port = 3001;

app.all("*", (req, res, next) => {
  console.log(req.originalUrl);
  next();
});

app.get("/create_ticket", async (req, res) => {
  res.status(200).send("ok");
});

app.post("/add_comment/:ticket_number", async (req, res) => {
  const { ticket_number } = req.params;
  console.log(ticket_number);
  console.log("Adding comment to ticket.");

  const ticket = {};
  ticket.comment = req.body.comment;

  console.log(ticket);

  try {
    await axios.put(`/api/v2/tickets/${ticket_number}`, {
      ticket: {
        comment: {
          body: ticket.comment,
          public: true,
        },
      },
    });
    res.status(200).send("ok");
  } catch (e) {
    res.status(400).send("error");
  }
});

app.post("/create_ticket", async (req, res) => {
  console.log("creating ticket");

  const ticket = {};
  ticket.subject = req.body.subject;
  ticket.body = req.body.body;

  console.log(ticket);

  try {
    const create_request = await axios.post("/api/v2/tickets", {
      ticket: {
        comment: {
          body: ticket.body,
        },
        subject: ticket.subject,
      },
    });
    res.status(200).json({ ticket_number: create_request.data.ticket.id });
  } catch (e) {
    res.status(400).send("error");
  }
});

app.get("/get_ticket/:ticket_number", async (req, res) => {
  const { ticket_number } = req.params;
  console.log(ticket_number);

  try {
    const ticketReq = await axios.get(`/api/v2/tickets/${ticket_number}`);
    res.json(ticketReq.data);
  } catch (e) {
    console.log(e);
    res.status(400).send("error");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
//#endregion
