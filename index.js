require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

morgan.token("code", function (req, res) {
  return res.statusCode;
});

app.use(morgan(":method :url :code - :response-time ms :body "));

app.get("/info", async (req, res) => {
  const persons = await Person.find({});

  const htmlResponse = `<p>Phonebook has info for ${
    persons.length
  } people <br /> ${new Date()}</p>`;
  res.send(htmlResponse);
});

app.get("/api/persons", async (req, res) => {
  const persons = await Person.find({});
  res.json(persons);
});

app.get("/api/persons/:id", async (req, res) => {
  const person = await Person.findOne({ id: req.params.id });
  console.log("person:", person);
  if (person) {
    res.json(person);
  } else {
    res.status(404).json({ error: "The person not found!" }).end();
  }
});

app.post("/api/persons", async (req, res) => {
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(400).json({ error: "Name and number are required!" });
  } else {
    if (await Person.findOne({ name: name })) {
      return res.status(400).json({ error: "name must be unique" });
    } else {
      const newPerson = new Person({
        name,
        number,
      });
      newPerson.save();
      res.json(newPerson);
    }
  }
});

app.delete("/api/persons/:id", async (req, res) => {
  try {
    const result = await Person.findByIdAndRemove(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(404).json({
      error: `There is no person with the id ${req.params.id}`,
      errorMessage: error.message,
    });
  }
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
