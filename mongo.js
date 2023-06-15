const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.error("Please provide password as an argument");
  process.exit(1);
}

const password = process.argv[2];

const connectionUrl = `mongodb+srv://fshelsinki:${password}@fshelsinki.zr3q5xl.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

mongoose.connect(connectionUrl);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((persons) => {
    console.log("phonebook:");
    persons.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length > 3) {
  const [, , , name, number] = process.argv;
  const person = new Person({ name, number });
  person.save().then((savedPerson) => {
    console.log(
      `added ${savedPerson.name} number ${savedPerson.number} to phonebook`
    );
    mongoose.connection.close();
  });
}
