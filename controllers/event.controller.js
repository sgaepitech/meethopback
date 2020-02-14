const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/event.model');
const Event = mongoose.model('Event');
const authevent = require('../auth/event.validator');
const auth = require("../auth/auth");

mongoose.set('useFindAndModify', false);

/**
 * @api {post} /:id Create event
 * @apiGroup Event
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
      "waitingList": [],
      "coordinates": [],
      "_id": "5e465a6237e2dc19e3b743f9",
      "title": "culturez vous",
      "description": "destructuration de langue française au travers de l'influence des peintres flamands du 12ème siècle",
      "category": "expo",
      "owner": "5e3aa185acf7411e24690aaf",
      "date": "1970-01-01T00:51:22.020Z",
      "location": "Jouy-en-Josas",
      "participantsNumber": 12,
    }]
 * @apiErrorExample {json} User error
 *    HTTP/1.1 500 Internal Server Error
 */
router.post("/create", auth, (req, res) => {
    const { errors, isValid } = authevent(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const newEvent = new Event({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            owner: req.user._id,
            date: req.body.date,
            participantsNumber: req.body.participantsNumber,
            time: req.body.time,
            location: req.body.location
    });

    newEvent
        .save()
        .then(event => res.json(event))
        .catch(err => console.log(err));
});


/**
 * @api {get} / Get all events
 * @apiGroup Event
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
 *  [[
    {
        "participants": [],
        "waitingList": [
            "5e39985596eb2e1bd6b9db22"
        ],
        "coordinates": [],
        "_id": "5e3d21e23ca6870b0556d172",
        "title": "event de tutu qui fait blih",
        "description": "mais kes tu boi doudou di don",
        "category": "jeux de societe",
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
 *    HTTP/1.1 500 Internal Server Error
 */
router.get("/", auth, (req, res) => {
  Event.find((err, events) => {
    if(err){
      console.log(err);
    }else {
      res.json(events);
    }
  });
});

/**
 * @api {get} /owner Get all events of an event owner
 * @apiGroup Event
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
        "category": "jeux de societe",
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
 *    HTTP/1.1 500 Internal Server Error
 */
router.get("/owner", auth, (req, res) =>{
  Event.find({owner: req.user._id}, (err, events) => {
    if (err){
      console.log(err);
    } else {
      res.json(events)
    }
  })
})

/**
 * @api {get} /id/:id Get event by ID
 * @apiGroup Event
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
      "waitingList": [],
      "coordinates": [],
      "_id": "5e465a6237e2dc19e3b743f9",
      "title": "culturez vous",
      "description": "destructuration de langue française au travers de l'influence des peintres flamands du 12ème siècle",
      "category": "expo",
      "owner": "5e3aa185acf7411e24690aaf",
      "date": "1970-01-01T00:51:22.020Z",
      "location": "Jouy-en-Josas",
      "participantsNumber": 12,
    }]
 * @apiErrorExample {json} User error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get("/id/:id", auth, (req, res) =>{

  Event.findById((req.params.id), (err, events) =>{

    if(err){
      console.log(err);
    } else {
      res.json(events)
    }
  })
})

/**
 * @api {post} /participating/:id Add user to a participants' list
 * @apiGroup Event
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
      "participants": [
        5e3c0fda3325611484e27aed
      ],
      "waitingList": [],
      "coordinates": [],
      "_id": "5e465a6237e2dc19e3b743f9",
      "title": "culturez vous",
      "description": "destructuration de langue française au travers de l'influence des peintres flamands du 12ème siècle",
      "category": "expo",
      "owner": "5e3aa185acf7411e24690aaf",
      "date": "1970-01-01T00:51:22.020Z",
      "location": "Jouy-en-Josas",
      "participantsNumber": 12,
    }]
 * @apiErrorExample {json} User error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get("/participating", auth, (req, res) =>{
  Event.find({participants : req.user._id}, (err, events)=>{
    if(err){
      console.log(err);
    }else {
      res.json(events)
    }
  })
})

/**
 * @api {post} /postulating/:id Add user to a waiting list
 * @apiGroup Event
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
        5e3c0fda3325611484e27aed
      ],
      "coordinates": [],
      "_id": "5e465a6237e2dc19e3b743f9",
      "title": "culturez vous",
      "description": "destructuration de langue française au travers de l'influence des peintres flamands du 12ème siècle",
      "category": "expo",
      "owner": "5e3aa185acf7411e24690aaf",
      "date": "1970-01-01T00:51:22.020Z",
      "location": "Jouy-en-Josas",
      "participantsNumber": 12,
    }]
 * @apiErrorExample {json} User error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get("/postulating", auth, (req, res) =>{
  Event.find({waitingList : req.user._id}, (err, events)=>{
    if(err){
      console.log(err);
    }else {
      res.json(events)
    }
  })
})

/**
 * @api {post} /edit/:id Edit an event by id
 * @apiGroup Event
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
        5e3c0fda3325611484e27aed
      ],
      "coordinates": [],
      "_id": "5e465a6237e2dc19e3b743f9",
      "title": "culturez vous",
      "description": "destructuration de langue française au travers de l'influence des peintres flamands du 12ème siècle",
      "category": "expo",
      "owner": "5e3aa185acf7411e24690aaf",
      "date": "1970-01-01T00:51:22.020Z",
      "location": "Jouy-en-Josas",
      "participantsNumber": 12,
    }]
 * @apiErrorExample {json} User error
 *    HTTP/1.1 500 Internal Server Error
 */
router.put("/edit/:id", auth, (req, res, next) =>{
  Event.findById(req.params.id, (err, event) => {
    if (err)
      return next(err);
    else {
      if(req.body.title) {event.title = req.body.title;}
      if(req.body.description) {event.description = req.body.description;}
      if(req.body.category) {event.category = req.body.category;}
      if(req.user._id) {event.owner = req.user._id;}
      if(req.body.date) {event.date = req.body.date;}
      if(req.body.time) {event.time = req.body.time;}
      if(req.body.location) {event.location = req.body.location;}
      event.save();
      res.status(200).json(event)
    }
  })
})

/**
 * @api {post} /edit/:id Delete an event by id
 * @apiGroup Event
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
        5e3c0fda3325611484e27aed
      ],
      "coordinates": [],
      "_id": "5e465a6237e2dc19e3b743f9",
      "title": "culturez vous",
      "description": "destructuration de langue française au travers de l'influence des peintres flamands du 12ème siècle",
      "category": "expo",
      "owner": "5e3aa185acf7411e24690aaf",
      "date": "1970-01-01T00:51:22.020Z",
      "location": "Jouy-en-Josas",
      "participantsNumber": 12,
    }]
 * @apiErrorExample {json} User error
 *    HTTP/1.1 500 Internal Server Error
 */
router.delete("/delete/:id", auth, (req, res, next) =>{
  Event.findByIdAndRemove(req.params.id, (err, ev) => {
      if (err)
          return next(error);
      else {
          res.status(200).json({msg: ev});
      }
  });
});

/**
 * @api {put} /postulate/:id Update a waiting list
 * @apiGroup Event
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
        5e3c0fda3325611484e27aed
      ],
      "coordinates": [],
      "_id": "5e465a6237e2dc19e3b743f9",
      "title": "culturez vous",
      "description": "destructuration de langue française au travers de l'influence des peintres flamands du 12ème siècle",
      "category": "expo",
      "owner": "5e3aa185acf7411e24690aaf",
      "date": "1970-01-01T00:51:22.020Z",
      "location": "Jouy-en-Josas",
      "participantsNumber": 12,
    }]
 * @apiErrorExample {json} User error
 *    Error: cannot add postulant
 *    Error: already postulating
 *    HTTP/1.1 500 Internal Server Error
 */
router.put("/postulate/:id", auth, (req, res, next) =>{
  Event.findById(req.params.id, (err, event) =>{
    if(err)
      return next(err);

    var postulantExists = event.waitingList.some((postulant) =>{
      return postulant && postulant.equals(req.user._id)
    });

    if (!postulantExists) {
      if (event.participants.length >= event.participants_number)
          return('Event already full');

      const User = mongoose.model('User');
      User.findById(req.user._id, (err, lol) => {
      });

      var objectId = mongoose.Types.ObjectId;
      event.waitingList.push(req.user._id)
      event.save()
      .then((ev) => {
        res.json(ev)
      }).catch((err) =>{
        res.status(500).send('Error : cannot add postulant');
      });
    } else
      res.status(400).send('Error: already postulating');
  })
});

/**
 * @api {put} /unpostulate/:id Remove user from a waiting list
 * @apiGroup Event
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
        5e3c0fda3325611484e27aed
      ],
      "coordinates": [],
      "_id": "5e465a6237e2dc19e3b743f9",
      "title": "culturez vous",
      "description": "destructuration de langue française au travers de l'influence des peintres flamands du 12ème siècle",
      "category": "expo",
      "owner": "5e3aa185acf7411e24690aaf",
      "date": "1970-01-01T00:51:22.020Z",
      "location": "Jouy-en-Josas",
      "participantsNumber": 12,
    }]
 * @apiErrorExample {json} User error
 *    Error: unpostulate failed
 *    HTTP/1.1 500 Internal Server Error
 */
router.put("/unpostulate/:id", auth, (req, res) =>{
  Event.findById(req.params.id, (err, event) =>{
    if(err)
      return next(err);
    else {
      event.waitingList.splice(event.waitingList.indexOf(req.user._id))
      event.save()
      .then((event) =>{
        res.status(200).json(event)
      }).catch((err) => {
        res.status(500).send('Error: unpostulate failed')
      })
    }
  });
})

/**
 * @api {put} /validate/:id Validate user from a waiting list
 * @apiGroup Event
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
        5e3c0fda3325611484e27aed
      ],
      "coordinates": [],
      "_id": "5e465a6237e2dc19e3b743f9",
      "title": "culturez vous",
      "description": "destructuration de langue française au travers de l'influence des peintres flamands du 12ème siècle",
      "category": "expo",
      "owner": "5e3aa185acf7411e24690aaf",
      "date": "1970-01-01T00:51:22.020Z",
      "location": "Jouy-en-Josas",
      "participantsNumber": 12,
    }]
 * @apiErrorExample {json} User error
 *    Error: participation failed
 *    Error: already participating
 *    Error: Event already full
 *    HTTP/1.1 500 Internal Server Error
 */
router.put("/validate/:id", auth, (req, res, next) =>{
  Event.findById(req.params.id, (err, event) =>{
    if(err)
      return next(err);

    var participantExists = event.participants.some((part) =>{
      return part && part.equals(req.body._id)
    });

    if (!participantExists) {
      if(event.participants.length >= event.participants_number)
        return('Error: event already full');
      event.participants.push(req.body._id)
      event.waitingList.splice(event.waitingList.indexOf(req.body._id))
      event.save()
      .then((event) => {
        res.status(200).json(event)
      }).catch((err) => {
        res.status(500).send('Error: participation failed')
      });
    }
    else
      res.status(400).send('Error: already participating');
  });
});

/**
 * @api {put} /unvalidate/:id Unvalidate user from a participants' list
 * @apiGroup Event
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
        5e3c0fda3325611484e27aed
      ],
      "coordinates": [],
      "_id": "5e465a6237e2dc19e3b743f9",
      "title": "culturez vous",
      "description": "destructuration de langue française au travers de l'influence des peintres flamands du 12ème siècle",
      "category": "expo",
      "owner": "5e3aa185acf7411e24690aaf",
      "date": "1970-01-01T00:51:22.020Z",
      "location": "Jouy-en-Josas",
      "participantsNumber": 12,
    }]
 * @apiErrorExample {json} User error
 *    Error: unvalidate unsuccessful
 *    HTTP/1.1 500 Internal Server Error
 */
router.put("/unvalidate/:id", auth, (req, res) =>{
  Event.findById(req.params.id, (err, event) =>{
    if(err)
      return next(err);
    else {
      event.participants.splice( event.participants.indexOf(req.body._id), 1 )
      event.waitingList.push(req.body._id)

          event.save()
          .then((event) => {
            res.status(200).json(event)
          })
          .catch(err =>{
            res.status(400).send('Error: unvalidate unsuccessful')
          });
        }
  })
})

module.exports = router;
