require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

// morgan logger middleware
morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});
morgan.token("code", function (req, res) {
  return res.statusCode;
});
app.use(morgan(":method :url :code - :response-time ms :body \n---"));
// error handler middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(error);
};
// unknown endpoint middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

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

app.get("/api/persons/:id", async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id);
    console.log("person:", person);
    if (person) {
      res.json(person);
    } else {
      res.status(404).json({ error: "The person not found!" }).end();
    }
  } catch (error) {
    next(error);
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

app.delete("/api/persons/:id", async (req, res, next) => {
  try {
    const result = await Person.findByIdAndRemove(req.params.id);
    if (result) {
      console.log("result: " + result);
      res.status(204).end();
    } else {
      res.status(404).json({ error: "person not found" }).end();
    }
  } catch (error) {
    next(error);
  }
});

app.put("/api/persons/:id", async (req, res, next) => {
  const { name, number } = req.body;

  try {
    // only update the number not the name
    const person = await Person.findById(req.params.id);
    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      { name: person.name, number },
      {
        new: true,
      }
    );
    res.json(updatedPerson);
  } catch (error) {
    next(error);
  }
});

// handler of requests with unknown endpoint
app.use(unknownEndpoint);
// error handling middleware implementation
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
