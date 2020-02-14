const Validator = require("validator");
const isEmpty = require("is-empty");
const moment = require("moment");

module.exports = function authRegister(data) {
    let errors = {}; // Convert empty fields to an empty string so we can use validator functions
    data.username = !isEmpty(data.username) ? data.username : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : ""; // username checks
    data.birthdate = !isEmpty(data.birthdate) ? data.birthdate : "";
    data.location = !isEmpty(data.location) ? data.location : "";
    data.interests = !isEmpty(data.interests) ? data.interests : "";

    // username CHECK
    if (Validator.isEmpty(data.username)) {
        errors.username = "Username field is required";
    } else if(!Validator.isLength(data.username, { min: 3, max: 20 })) {
        errors.username = "Username must be between 3 and 20 characters";
    } else if(!Validator.isAlpha(data.username)) {
        errors.username = "Username must be Alpha";
    }
    
    // EMAIL CHECK
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }

    // CHECK PASSWORD
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    } else if(!Validator.isLength(data.password, { min: 4 })) {
        errors.username = "Password must be atleast 8 characters";
    }
    if (Validator.isEmpty(data.confirmPassword)) {
        errors.confirmPassword = "Confirm password field is required";
    }
    if (!Validator.equals(data.password, data.confirmPassword)) {
        errors.confirmPassword = "Passwords must match";
    }

    // CHECK BIRTHDATE
    // if (Validator.isEmpty(data.birthdate)) {
    //     errors.birthdate = "Birthdate field is required";
    // } else if (Validator.isBefore(data.birthdate, toString(data.birthdate - 568025136))) {
    //     errors.birthdate = "You must be 18 or older to register";
    // }

    // CHECK LOCATION
    // if (Validator.isEmpty(data.location)) {
    //     errors.location = "Location field is required";
    // } else if (Validator.isIn(data.location, ["Paris", "Lyon", "Marseille", "Lille"])) {
    //     errors.location = "Location is not allowed";
    // }

    // CHECK INTERESTS
    // if (Validator.isEmpty(toString(data.interests))) {
    //     errors.interests = "Interest field is required";
    // } else if (Validator.isIn(toString(data.interests), ["Musique", "Sport", "Cinéma", "Musée"])) {
    //     errors.interests = "Interest is not allowed";
    // }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};