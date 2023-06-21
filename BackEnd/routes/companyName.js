const express = require('express');
const multer = require('multer');
const router = express.Router();
const CompanyName = require('../models/companyName');

const upload = require('../middleware/file-upload');
const singleUpload = upload.single('thumbnail');



/* ===============================================================
 NEW COMPANY
=============================================================== */
router.post('/newCompany', async (req, res) => {
  try {
    singleUpload(req, res, function (err) {
      if (req.fileValidationError) { return res.json({ success: false, message: 'An error occured ' + req.fileValidationError }); }
      const companyName = new CompanyName({
        name: req.body.name,
        tagline: req.body.tagline,
        thumbnail: req.file.location
      });
      companyName.save();
      res.json({ success: true, message: 'Company saved' });
    });
  } catch (err) { res.json({ success: false, message: 'An error occured' }); }
});

/* ===============================================================
 NEW WALLPAPER
=============================================================== */
router.post('/newWallpaper', async (req, res) => {
  try {
    singleUpload(req, res, async (err) => {
      if (req.fileValidationError) { return res.json({ success: false, message: 'An error occured ' + req.fileValidationError }); }
      const companyID = await CompanyName.findOne({}).sort({ _id: -1 });
      const selectedId = companyID._id;
      const wallpaper = await CompanyName.updateOne(
        {_id: selectedId },
        {
          $set: {
            wallpaper: req.file.location,
          }
        },
      )
      res.json({ success: true, message: 'Wallpaper saved' });
    });
  } catch (err) { res.json({ success: false, message: 'An error occured' }); }
});





/* ===============================================================
 GET ALL
=============================================================== */
router.get('/allCompany', async (req, res) => {
  try {
    const accounts = await CompanyName.findOne({}).sort({ _id: 1 });
    res.json({ success: true, accounts })
  } catch (err) { res.json({ success: false, message: 'An error occured' }); }
});


/* ===============================================================
 GET PUBLIC COMPANY
=============================================================== */
router.get('/getPublicCompany', async (req, res) => {
  try {
    const accounts = await CompanyName.findOne({}).sort({ _id: -1 });
    res.json({ success: true, accounts })
  } catch (err) { res.json({ success: false, message: 'An error occured' }); }
});


/* ===============================================================
ABOUT US
=============================================================== */
router.post('/aboutUs', async (req, res) => {
  try {
    const nameId = await CompanyName.findOne({}).sort({ _id: -1 });

    const aboutData = await CompanyName.updateOne(
      { _id: nameId },
      {
        $set: {
          about: req.body.about,
        }
      },
    )
    res.json({ success: true, message: 'About us data updated' })
  } catch (err) { res.json({ success: false, message: 'An error occured' }); }
});




module.exports = router;