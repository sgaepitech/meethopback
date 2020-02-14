const mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['concert', 'sport', 'plein air', 'cinéma', 'théatre', 'expo', 'nautique', 'shopping', 'jeux de société', 'foire et salons'],
    required: true
  }
})

module.exports = mongoose.model('Category', categorySchema);
