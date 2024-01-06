const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
        },

        content: {
            type: String,
            required: true,
            trim: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
    }
);

module.exports = mongoose.model("Note", NoteSchema);