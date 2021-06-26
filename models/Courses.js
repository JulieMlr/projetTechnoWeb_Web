const mongoose = require("mongoose");
const schema = mongoose.Schema;

const CourseSchema = new schema({
    metres: { type: Number},
    duree: { type: Number},
    date: { type: Date},
    idRunner: { type: String}
})

module.exports = mongoose.model("course", CourseSchema)