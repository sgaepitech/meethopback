const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function authevent(data) {
    let errors = {}; // Convert empty fields to an empty string so we can use validator functions
    data.title = !isEmpty(data.title) ? data.title : ""; // Email checks
    data.description = !isEmpty(data.description) ? data.description : ""; // Password checks
    data.category = !isEmpty(data.category) ? data.category : "";
    data.date = !isEmpty(data.date) ? data.date : "";

    if (Validator.isEmpty(data.title)) {
        errors.title = "Title field is required";
    }
    if (Validator.isEmpty(data.description)) {
        errors.description = "Description field is required";
    }
    if (Validator.isEmpty(data.category)) {
        errors.category = "Category field is required";
    }
    if (Validator.isEmpty(data.date)) {
        errors.date = "Date field is required";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};
