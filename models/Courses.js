const mongoose = require("mongoose");
const schema = mongoose.Schema;

const CourseSchema = new schema({
    kilometres: { type: Number},
    duree: { type: Number},
    date: { type: Date},
    vitesseMoyenne: { type: Number},
    idRunner: { type: String}
})

module.exports = mongoose.model("course", CourseSchema)