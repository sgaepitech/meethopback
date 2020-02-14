const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/event.model');
require('../models/category.model');
const Event = mongoose.model('Event');
const Category = mongoose.model('Category');
const authevent = require('../auth/event.validator');
const auth = require("../auth/auth");

mongoose.set('useFindAndModify', false);

/**
 * @api {post} /create Create a category
 * @apiGroup Category
 * @apiSuccess {Object[]} event Elements attached to an event
 * @apiSuccess {Array} event.category Categories of the event
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 *  [{
      "category": ["expo", "sports"]
}]
 * @apiErrorExample {json} User error
 *    Error: category already exists
 *    HTTP/1.1 500 Internal Server Error
 */
router.post("/create", async (req, res) =>{
  Category.findOne(
    {name: req.body.name}
  )
  .then (category =>{
    if(category) {
      return res.status(400).json({name: 'Error: category already exists'});

    } else{
      const newCategory = new Category({
        name: req.body.name
      })
      .save()
      .then(category => res.json(category))
      .catch(err => console.log(err));
    }
  })
});

/**
 * @api {get} /read Get a category
 * @apiGroup Category
 * @apiSuccess {Object[]} event Elements attached to an event
 * @apiSuccess {Array} event.category Categories of the event
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 *  [{
      "category": ["expo"]
}]
 * @apiErrorExample {json} User error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get("/read", auth, async (req, res) => {
    const category = await Category.findOne({name: req.body.name});
    res.json(user);
});

/**
 * @api {put} /update Update a category
 * @apiGroup Category
 * @apiSuccess {Object[]} event Elements attached to an event
 * @apiSuccess {Array} event.category Categories of the event
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 *  [{
      "category": ["expo", "sports"]
}]
 * @apiErrorExample {json} User error
 *    HTTP/1.1 500 Internal Server Error
 */
router.put("/update", auth, (req, res, next) => {
  Category.findById(req.body, (err, category) =>{
    if(err)
      return next(err);
    else {
      if (req.body.name) {category.name = req.body.name;}
      category.save();
      res.status(200).json(category)
    }
  })
})

/**
 * @api {delete} /delete Delete a category
 * @apiGroup Category
 * @apiSuccess {Object[]} event Elements attached to an event
 * @apiSuccess {Array} event.category Categories of the event
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 *  category deleted
 * @apiErrorExample {json} User error
 *    Error: category already exists
 *    HTTP/1.1 500 Internal Server Error
 */
router.delete("/delete", auth, (req, res, next) => {
  Category.findByIdAndRemove(req.body._id, (err, category) => {
    if (err)
      return next(err);
    else {
      res.status(200).json({msg: category});
    }
  })
})

/**
 * @api {get} /:category Get events from a category
 * @apiGroup Category
 * @apiSuccess {Object[]} event Elements attached to an event
 * @apiSuccess {String} event._id events ID
 * @apiSuccess {String} event.owner ID of the owner of the event
 * @apiSuccess {String} event.description Description of the event
 * @apiSuccess {String} event.location Location of the event
 * @apiSuccess {Array} event.coordinates Coordinates of the event (lat, lon)
 * @apiSuccess {Array} event.category Categories of the event
 * @apiSuccess {Array} event.isWaitingForEvent List of users by id who wants to participate but need approval by the owner of the event
 * @apiSuccess {Array} event.isApprovedFromEvent List of users by id who wants to participate and have been approved by the owner of the event
 * @apiSuccess {Date} event.date Date of the event
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 *  [{
        "participants": [],
        "waitingList": [
            "5e39985596eb2e1bd6b9db22"
        ],
        "coordinates": [],
        "_id": "5e3d21e23ca6870b0556d172",
        "title": "event de tutu qui fait blih",
        "description": "mais kes tu boi doudou di don",
        "category": "jeux de societe, expo",
        "owner": "5e3aa185acf7411e24690aaf",
        "date": "1970-01-01T03:37:32.020Z",
        "participantsNumber": 4,
        "__v": 9
    },
    {
        "participants": [],
        "waitingList": [],
        "coordinates": [],
        "_id": "5e417b762361ad044c21213e",
        "title": "I love PostMan",
        "description": "Pour tous ceux qui pensent que le front, en vrai, c'est surtout une histoire de marketeux, et qu'un bon service web, c'est une API... POINT, rien d'autre",
        "category": "expo",
        "owner": "5e3aa185acf7411e24690aaf",
        "date": "1970-01-01T08:03:42.020Z",
        "participantsNumber": 42,
        "__v": 0
    },...]
 * @apiErrorExample {json} User error
 *    Error: category already exists
 *    HTTP/1.1 500 Internal Server Error
 */
router.get("/:category", auth, (req, res, next) => {
  Event.find({category: req.params.category}, (err, events) =>{
    if(err){
      console.log(err);
    } else {
      res.json(events)
    }
  })
})

/**
 * @api {get} /all Get all categories
 * @apiGroup Category
 * @apiSuccess {Object[]} event Elements attached to an event
 * @apiSuccess {Array} event.category Categories of the event
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 *  "category": ["expo", "sports",...]
 * @apiErrorExample {json} User error
 *    Error: category already exists
 *    HTTP/1.1 500 Internal Server Error
 */
router.get("/all", auth, (req, res) =>{
  Category.find((err, cat) =>{
    if(err){
      console.log(err);
    } else {
      res.json(cat);
    }
  })
})

module.exports = router;
