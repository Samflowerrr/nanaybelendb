const Branch = require('../models/branch');
var express = require('express');
var router = express.Router();;



/* ===============================================================
CREATE NEW BRANCH
=============================================================== */
router.post('/newBranch', async (req, res) => {
  if (!req.body.branch) return res.json({ success: false, message: 'Branch  is required.' });
  if (req.body.area.length == 0) return res.json({ success: false, message: 'Area is required.' });
  if (!req.body.code) return res.json({ success: false, message: 'Branch Code is required.' });

  const branchFound = await Branch.findOne({code: req.body.code});
  if (branchFound) return res.json({ success: false, message: 'Duplicate branch code.' });

  try {
    const register = new Branch({
      branch: req.body.branch,
      address: req.body.address,
      code: req.body.code,
      city: req.body.city,
      area: req.body.area,
    });

    await register.save();
    res.json({ success: true, message: 'Branch Created' });

  } catch (err) { res.json({ success: false, message: 'An error occured' }); }
});





/* ===============================================================
GET ALL BRANCHES
=============================================================== */
router.get('/allBranches', async (req, res) => {
  try {
    const branches = await Branch.find().sort({ 'branch': 1, 'department': 1, });
    res.json({ success: true, branches })
  } catch (err) { res.json({ success: false, message: 'An error occured' }); }
});


/* ===============================================================
GET COVERAGE CITY INFO
=============================================================== */
router.get('/cityInfo/:branch/:position', async (req, res) => {

  if (req.params.position == 'Loan Officer') { cityData = {  branch: req.params.branch } };
  if (req.params.position == 'Credit Investigator') { cityData = {  branch: req.params.branch } };
  if (req.params.position == 'Collector') { cityData = {  branch: req.params.branch } };
  if (req.params.position == 'Loan Approver')  { cityData = {  branch: req.params.branch } };
  if (req.params.position == 'Auditor')  { cityData = {  branch: req.params.branch } };
  if (req.params.position == 'Treasurer')  { cityData = {  branch: req.params.branch } };
  if (req.params.position == 'Admin') { cityData = { } };
  if (req.params.position == 'Processing Clerk')  { cityData = {  branch: req.params.branch } };
  if (req.params.position == 'Branch Manager')  { cityData = {  branch: req.params.branch } };
  
  try {
    const city = await Branch.findOne({branch: req.params.branch}).select('city area');
    res.json({ success: true, city })
  } catch (err) { res.json({ success: false, message: 'An error occured' }); }
});




/* ===============================================================
GET BRANCH
=============================================================== */
router.get('/branchInfo/:branch/:position', async (req, res) => {

  if (req.params.position == 'Loan Officer') { cityData = {  branch: req.params.branch } };
  if (req.params.position == 'Credit Investigator') { cityData = {  branch: req.params.branch } };
  if (req.params.position == 'Collector') { cityData = {  branch: req.params.branch } };
  if (req.params.position == 'Loan Approver')  { cityData = {  branch: req.params.branch } };
  if (req.params.position == 'Auditor')  { cityData = {  branch: req.params.branch } };
  if (req.params.position == 'Treasurer')  { cityData = {  branch: req.params.branch } };
  if (req.params.position == 'Admin') { cityData = { } };
  if (req.params.position == 'Processing Clerk')  { cityData = {  branch: req.params.branch } };
  if (req.params.position == 'Branch Manager')  { cityData = { } };
  
  try {
    const branch = await Branch.find(cityData).select('branch');
    res.json({ success: true, branch })
  } catch (err) { res.json({ success: false, message: 'An error occured' }); }
});



/* ===============================================================
GET COVERAGE CITY INFO
=============================================================== */
router.post('/postmanPushBranch', async (req, res) => {
  


  try {
    const branchPush = await Borrower.updateOne(
      { branch: req.body.branch },
      {
        $push:
        {
          "area":
          {
            name: req.body.name,
          }
        }
      },
    )
    res.json({ success: true, message: 'Branch Added' });
  } catch (err) { res.json({ success: false, message: 'An error occured' }); }

});













/* ===============================================================
GET BRANCH PER POSITION
=============================================================== */
router.get('/branchPerPosition/:branch/:department/:position', async (req, res) => {

  if (req.params.position == 'Level 3') { data = {} }
  if (req.params.position == 'Level 2') { data = { branch: req.params.branch } }
  if (req.params.position == 'Level 1') { data = { branch: req.params.branch } }

  try {
    const branches = await Branch.find(data).sort({ 'branch': 1, 'department': 1, });
    res.json({ success: true, branches })
  } catch (err) { res.json({ success: false, message: 'An error occured' }); }

});


/* ===============================================================
GET BRANCH COUNT
=============================================================== */
router.get('/branchCount', async (req, res) => {
  try {
    const branches = await Branch.find().countDocuments();
    res.json({ success: true, branches })
  } catch (err) { res.json({ success: false, message: 'An error occured' }); }
});


/* ===============================================================
GET BRANCH COUNT
=============================================================== */
router.get('/departmentCount', async (req, res) => {
  try {
    const departments = await Branch.aggregate([
      { $unwind: { path: "$departments", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          'name': '$departments.name',
        },
      },
      { $group: { _id: { departments: "$name" }, } },
      { $group: { _id: 1, count: { $sum: 1 } } },
      {
        $project: {
          _id: 0,
          'count': '$count',
        },
      },
    ]);

    res.json({ success: true, departments })
  } catch (err) { res.json({ success: false, message: 'An error occured' }); }
});



/* ===============================================================
GET BRANCH CODE
=============================================================== */
router.get('/branchCode/:branch', async (req, res) => {
  try {
    const branchCode = await Branch.findOne({branch: req.params.branch}).select('branchCode');
    res.json({ success: true, branchCode })
  } catch (err) { res.json({ success: false, message: 'An error occured' }); }
});



module.exports = router;