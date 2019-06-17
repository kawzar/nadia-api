const express = require('express');
const router = express.Router();
const documents = require('../models/document');
const passport = require('passport');

router.get('/', (req, res) => {
    documents.getAll((err, documentList) => {
        if(err){
            res.json({ success: false, message: 'Failed to load all songs. Error: ' + err});
        } else {
            res.write(JSON.stringify(documentList, null, 2));
            res.end();
        }
    });
});

router.get('/:id', (req, res) => {
    const id = req.params['id'];
    documents.getById(id, (err, document) => {
        if(err){
            res.json({ success: false, message: 'Failed to load song. Error: ' + err});
        } else {
            res.write(JSON.stringify(document, null, 2));
            res.end();
        }
    });
});


router.post('/filter/', (req, res) => {
  const searchStr = req.body.searchStr;
  documents.getByFilter(searchStr, (err, document) => {
      if(err){
          res.json({ success: false, message: 'Failed to load song. Error: ' + err});
      } else {
          res.write(JSON.stringify(document, null, 2));
          res.end();
      }
  });
});

router.post('/', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      var newDocument = new documents({
        title: req.body.title,
        content: req.body.content,
      });
  
      newDocument.save(function(err) {
        if (err) {
          return res.json({success: false, msg: 'Save document failed.'});
        }
        res.json({success: true, msg: 'Successful created new document.'});
      });
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });

  router.put('/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      const id = req.params['id'];
      documents.findByIdAndUpdate(
        id,
        req.body,
        {new: true},
        (err, document) => {
        if (err) {
          return res.json({success: false, msg: 'Save document failed.'});
        }
        res.json({success: true, msg: 'Successful created new document.'})}
      )
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });

  router.delete('/:id', (req, res) => {
    const id = req.params['id'];
    var token = getToken(req.headers);
    if (token) {
    documents.findByIdAndDelete(id, (err, document) => {
      if(err){
        res.json({ success: false, message: 'Failed to delete document. Error: ' + err});
      } else {
        res.write(JSON.stringify({success: true, documentId: id}, null, 2));
        res.end();
    }
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

module.exports = router;