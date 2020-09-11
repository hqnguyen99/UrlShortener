
var express = require('express');
var router = express.Router();
var {nanoid} = require('nanoid');
let yup = require('yup');
var monk  = require('monk');

var db = monk('localhost:27017/UrlShortener')
const urls = db.get('urls');
urls.createIndex({slug : 1}, {unique : true});


let schema = yup.object().shape({
  url: yup.string().required(),
  slug: yup.string().trim().matches(/^[\w\-]+$/i),
})
/* GET home page. */
router.post('/url', async (req, res, next) => {
  try {
    let {url, slug} = req.body;
    var valid = await schema.validate({url, slug,});
    
    if (!slug) {
      slug = nanoid(5);
    } else {
      const existing = await urls.findOne({ slug });
      if (existing) {
        throw new Error('Slug in use. 🍔');
      }
      console.log(existing);
    }
    
    res.json({
      url,
      slug
    });
  } catch (error) {
    next(error);
  }
  
});
//Redirect 
router.get('/:id', function(req, res, next) {
  res.redirect('/');

});
module.exports = router;
