const mongoose = require("mongoose");
const config   = require("config");
mongoose.set('useFindAndModify', false);


const connectDB = () => {
  mongoose
    .connect(config.get("MONGOURI"), {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => console.log("mongoose connected"))
    .catch((err) => console.log("erreur"));
};

module.exports = connectDB;
