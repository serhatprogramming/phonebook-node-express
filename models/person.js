require("dotenv").config();
const mongoose = require("mongoose");

console.log("connecting to MongoDB...");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB", err.message));

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 3 },
  number: {
    type: String,
    validate: {
      validator: function (value) {
        const regex = /^\d{2,3}-\d+$/; // Regular expression pattern for validation
        return regex.test(value);
      },
      message:
        "The field must be in the format of XX-XXXXXXXX or XXX-XXXXXXXX.",
    },
    minLength: 8,
    required: true,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
