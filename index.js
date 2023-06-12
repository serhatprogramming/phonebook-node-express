const express = require("express");
const app = express();

app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (req, res) => {
  const htmlResponse = `<p>Phonebook has info for ${
    persons.length
  } people <br /> ${new Date()}</p>`;
  res.send(htmlResponse);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const person = persons.find((person) => person.id === Number(req.params.id));
  if (person) {
    res.json(person);
  } else {
    res.status(404).json({ error: "The person not found!" }).end();
  }
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(400).json({ error: "Name and number are required!" });
  } else {
    if (persons.find((person) => person.name === name)) {
      return res.status(400).json({ error: "name must be unique" });
    } else {
      const newPerson = {
        id: Math.floor(Math.random() * 1000000000),
        name,
        number,
      };
      persons.push(newPerson);
      res.json(newPerson);
    }
  }
});

app.delete("/api/persons/:id", (req, res) => {
  persons = persons.filter((person) => person.id !== Number(req.params.id));
  res.status(204).end();
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
