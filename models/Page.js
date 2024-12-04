const mongoose = require('mongoose');

const Page = mongoose.model("Page", {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Relaciona com o esquema User
        required: true
    },
    number: Number,
    content: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = Page;
