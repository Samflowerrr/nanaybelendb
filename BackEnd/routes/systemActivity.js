const express = require('express');
const router = express.Router();
const SystemActivity = require('../models/systemActivity');
const Borrower = require('../models/borrower');
const { ObjectId } = require('mongodb');

/* ============================================================
CREATE NEW ACTIViTY
=============================================================== */
router.post('/newActivity', async (req, res) => {
  try {
    const activity = new SystemActivity(req.body);
    await activity.save();
    res.json({ success: true, message: 'New Activity Saved' });
  } catch (err) {  res.json({ success: false, message: 'An error occurred' });  }
});



/* ============================================================
LOGIN ACTIVITIES
=============================================================== */
  router.post('/loginActivities', async (req, res) => {

    const { eeid, branch, department, sku, position, page, pageSizeOne, search, sortField, sortDirection } = req.body;
    const activityData = {};
  
    if (position === 'Admin' || position === 'Auditor' ) {
      activityData.mainActivity = { $in : ['Login', 'Logout']};
    } else if (position === 'Branch Manager') {
      activityData.branch = branch;
      activityData.mainActivity = { $in : ['Login', 'Logout']};
    }  else if (position !== 'Admin' && position !== 'Auditor' && position !== 'Branch Manager' ) {
      activityData.branch = branch;
      activityData.eeid = eeid;
      activityData.mainActivity = { $in : ['Login', 'Logout']};
    } 
  
    if (search) {
      const regex = new RegExp(search, 'i');
      activityData.$or = [
        { branch: regex },
        { employeeFirstName: regex },
        { employeeLastName: regex }, 
        { eeid: regex }, 
      ];
    }
  

    try {
      let sort = { _id: -1, };
      if (sortField) {
        sort = {};
        sort[sortField] = sortDirection === 'desc' ? -1 : 1;
      }
      const transactionData = await SystemActivity.aggregate([
       // { $unwind: { path: "$register", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            eeid: 1,
            employeeFirstName: 1,
            employeeLastName: 1,
            branch: 1,
            position: 1,
            date: 1,
            mainActivity: 1,
          }
        },
        { $match: { $and: [activityData] } },
        { $sort: sort },
        { $skip: (page - 1) * pageSizeOne },
        { $limit: pageSizeOne },
      ])
  
      const totalRecords = await SystemActivity.countDocuments(activityData);
  
      res.json({ success: true, transactionData, totalRecords })
    } catch (err) { res.json({ success: false, message: 'Something went wrong. Try reloading' }); }
  
  });
  


/* ============================================================
STATUS CHANGE ACTIVITIES
=============================================================== */
  router.post('/statusChangeActivities', async (req, res) => {

    const { eeid, branch, department, sku, position, page, pageSizeTwo, search, sortField, sortDirection } = req.body;
    const activityData = {};
  
    if (position === 'Admin' || position === 'Auditor' ) {
      activityData.mainActivity = 'Status Update';
    } else if (position === 'Branch Manager') {
      activityData.branch = branch;
      activityData.mainActivity = 'Status Update';
    }  else if (position !== 'Admin' && position !== 'Auditor' && position !== 'Branch Manager' ) {
      activityData.branch = branch;
      activityData.eeid = eeid;
      activityData.mainActivity = 'Status Update';
    } 
  
    if (search) {
      const regex = new RegExp(search, 'i');
      activityData.$or = [
        { branch: regex },
        { position: regex },
        { employeeFirstName: regex },
        { employeeLastName: regex }, 
        { eeid: regex }, 
        { additionalInfo: regex }, 
      ];
    }
  
    try {
      let sort = { _id: -1, };
      if (sortField) {
        sort = {};
        sort[sortField] = sortDirection === 'desc' ? -1 : 1;
      }
      const transactionData = await SystemActivity.aggregate([
       // { $unwind: { path: "$register", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            eeid: 1,
            mainId: 1,
            employeeFirstName: 1,
            employeeLastName: 1,
            branch: 1,
            position: 1,
            date: 1,
            mainActivity: 1,
            additionalInfo: 1,
            remarks: 1,
          },
          
        },
        { $match: { $and: [activityData] } },
        {
          $lookup: {
            from: "borrowers",
            let: { main_id: { $toObjectId: "$mainId" } },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$main_id"] } } },
            ],
            as: "lookUp",
          },
        },
        { $unwind: { path: "$lookUp", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            'eeid': "$eeid",
            'mainId': "$mainId",
            'employeeFirstName': "$employeeFirstName",
            'employeeLastName': "$employeeLastName",
            'branch': "$branch",
            'position': "$position",
            'additionalInfo': "$additionalInfo",
            'date': "$date",
            'remarks': "$remarks",
            'applicantFirstName': "$lookUp.applicantFirstName",
            'applicantFamilyName': "$lookUp.applicantFamilyName",
          }
        }, 

        { $sort: sort },
        { $skip: (page - 1) * pageSizeTwo },
        { $limit: pageSizeTwo },
      ])
  
      const totalRecords = await SystemActivity.countDocuments(activityData);

  
      res.json({ success: true, transactionData, totalRecords })
    } catch (err) { res.json({ success: false, message: 'Something went wrong. Try reloading' }); }
  
  });
  



/* ============================================================
COLLECTION ACTIVITIES
=============================================================== */
  router.post('/collectionActivities', async (req, res) => {

    const { eeid, branch, department, sku, position, page, pageSizeThree, search, sortField, sortDirection } = req.body;
    const activityData = {};
  
    if (position === 'Admin' || position === 'Auditor' ) {
      activityData.mainActivity = 'Loan Payment';
    } else if (position === 'Branch Manager') {
      activityData.branch = branch;
      activityData.mainActivity = 'Loan Payment';
    }  else if (position !== 'Admin' && position !== 'Auditor' && position !== 'Branch Manager' ) {
      activityData.branch = branch;
      activityData.eeid = eeid;
      activityData.mainActivity = 'Loan Payment';
    } 
  
    if (search) {
      const regex = new RegExp(search, 'i');
      activityData.$or = [
        { branch: regex },
        { position: regex },
        { employeeFirstName: regex },
        { employeeLastName: regex }, 
        { eeid: regex }, 
        { additionalInfo: regex }, 
      ];
    }
  
    try {
      let sort = { _id: -1, };
      if (sortField) {
        sort = {};
        sort[sortField] = sortDirection === 'desc' ? -1 : 1;
      }
      const transactionData = await SystemActivity.aggregate([
        {
          $project: {
            _id: 1,
            eeid: 1,
            mainId: 1,
            employeeFirstName: 1,
            employeeLastName: 1,
            branch: 1,
            position: 1,
            date: 1,
            mainActivity: 1,
            additionalInfo: 1,
            remarks: 1,
            latitude: 1,
            longitude: 1,
            amount: 1,
          },          
        },
        { $match: { $and: [activityData] } },
        {
          $lookup: {
            from: "borrowers",
            let: { main_id: { $toObjectId: "$mainId" } },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$main_id"] } } },
            ],
            as: "lookUp",
          },
        }, 
        { $unwind: { path: "$lookUp", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            'eeid': "$eeid",
            'mainId': "$mainId",
            'employeeFirstName': "$employeeFirstName",
            'employeeLastName': "$employeeLastName",
            'branch': "$branch",
            'position': "$position",
            'additionalInfo': "$additionalInfo",
            'date': "$date",
            'remarks': "$remarks",
            'latitude': "$latitude",
            'longitude': "$longitude",
            'amount': "$amount",
            'applicantFirstName': "$lookUp.applicantFirstName",
            'applicantFamilyName': "$lookUp.applicantFamilyName",
          }
        }, 
        { $sort: sort },
        { $skip: (page - 1) * pageSizeThree },
        { $limit: pageSizeThree },
      ])
  
      const totalRecords = await SystemActivity.countDocuments(activityData);
  
      res.json({ success: true, transactionData, totalRecords })
    } catch (err) { res.json({ success: false, message: 'Something went wrong. Try reloading' }); }
  
  });
  



/* ============================================================
WITHDRAWAL ACTIVITIES
=============================================================== */
  router.post('/withdrawalActivities', async (req, res) => {

    const { eeid, branch, department, sku, position, page, pageSizeFour, search, sortField, sortDirection } = req.body;
    const activityData = {};
  
    if (position === 'Admin' || position === 'Auditor' ) {
      activityData.mainActivity = 'Withdrawal';
    } else if (position === 'Branch Manager') {
      activityData.branch = branch;
      activityData.mainActivity = 'Withdrawal';
    }  else if (position !== 'Admin' && position !== 'Auditor' && position !== 'Branch Manager' ) {
      activityData.branch = branch;
      activityData.eeid = eeid;
      activityData.mainActivity = 'Withdrawal';
    } 
  
    if (search) {
      const regex = new RegExp(search, 'i');
      activityData.$or = [
        { branch: regex },
        { position: regex },
        { employeeFirstName: regex },
        { employeeLastName: regex }, 
        { eeid: regex }, 
        { additionalInfo: regex }, 
      ];
    }
  
    try {
      let sort = { _id: -1, };
      if (sortField) {
        sort = {};
        sort[sortField] = sortDirection === 'desc' ? -1 : 1;
      }
      const transactionData = await SystemActivity.aggregate([
        {
          $project: {
            _id: 1,
            eeid: 1,
            mainId: 1,
            employeeFirstName: 1,
            employeeLastName: 1,
            branch: 1,
            position: 1,
            date: 1,
            mainActivity: 1,
            additionalInfo: 1,
            remarks: 1,
            latitude: 1,
            longitude: 1,
            amount: 1,
          },          
        },
        { $match: { $and: [activityData] } },
        {
          $lookup: {
            from: "borrowers",
            let: { main_id: { $toObjectId: "$mainId" } },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$main_id"] } } },
            ],
            as: "lookUp",
          },
        }, 
        { $unwind: { path: "$lookUp", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            'eeid': "$eeid",
            'mainId': "$mainId",
            'employeeFirstName': "$employeeFirstName",
            'employeeLastName': "$employeeLastName",
            'branch': "$branch",
            'position': "$position",
            'additionalInfo': "$additionalInfo",
            'date': "$date",
            'remarks': "$remarks",
            'latitude': "$latitude",
            'longitude': "$longitude",
            'amount': "$amount",
            'applicantFirstName': "$lookUp.applicantFirstName",
            'applicantFamilyName': "$lookUp.applicantFamilyName",
          }
        }, 
        { $sort: sort },
        { $skip: (page - 1) * pageSizeFour },
        { $limit: pageSizeFour },
      ])
  
      const totalRecords = await SystemActivity.countDocuments(activityData);
  
      res.json({ success: true, transactionData, totalRecords })
    } catch (err) { res.json({ success: false, message: 'Something went wrong. Try reloading' }); }
  
  });
  




/* ============================================================
DEPOSIT ACTIVITIES
=============================================================== */
  router.post('/depositActivities', async (req, res) => {
    const { eeid, branch, department, sku, position, page, pageSizeFive, search, sortField, sortDirection } = req.body;
    const activityData = {};
  
    if (position === 'Admin' || position === 'Auditor' ) {
      activityData.mainActivity = 'Savings Deposit';
    } else if (position === 'Branch Manager') {
      activityData.branch = branch;
      activityData.mainActivity = 'Savings Deposit';
    }  else if (position !== 'Admin' && position !== 'Auditor' && position !== 'Branch Manager' ) {
      activityData.branch = branch;
      activityData.eeid = eeid;
      activityData.mainActivity = 'Savings Deposit';
    } 
  
    if (search) {
      const regex = new RegExp(search, 'i');
      activityData.$or = [
        { branch: regex },
        { position: regex },
        { employeeFirstName: regex },
        { employeeLastName: regex }, 
        { eeid: regex }, 
        { additionalInfo: regex }, 
      ];
    }
  
    try {
      let sort = { _id: -1, };
      if (sortField) {
        sort = {};
        sort[sortField] = sortDirection === 'desc' ? -1 : 1;
      }
      const transactionData = await SystemActivity.aggregate([
        {
          $project: {
            _id: 1,
            eeid: 1,
            mainId: 1,
            employeeFirstName: 1,
            employeeLastName: 1,
            branch: 1,
            position: 1,
            date: 1,
            mainActivity: 1,
            additionalInfo: 1,
            remarks: 1,
            latitude: 1,
            longitude: 1,
            amount: 1,
          },          
        },
        { $match: { $and: [activityData] } },
        {
          $lookup: {
            from: "borrowers",
            let: { main_id: { $toObjectId: "$mainId" } },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$main_id"] } } },
            ],
            as: "lookUp",
          },
        }, 
        { $unwind: { path: "$lookUp", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            'eeid': "$eeid",
            'mainId': "$mainId",
            'employeeFirstName': "$employeeFirstName",
            'employeeLastName': "$employeeLastName",
            'branch': "$branch",
            'position': "$position",
            'additionalInfo': "$additionalInfo",
            'date': "$date",
            'remarks': "$remarks",
            'latitude': "$latitude",
            'longitude': "$longitude",
            'mainActivity': "$mainActivity",
            'amount': "$amount",
            'applicantFirstName': "$lookUp.applicantFirstName",
            'applicantFamilyName': "$lookUp.applicantFamilyName",
          }
        }, 
        { $sort: sort },
        { $skip: (page - 1) * pageSizeFive },
        { $limit: pageSizeFive },
      ])
  
      const totalRecords = await SystemActivity.countDocuments(activityData);
  
      res.json({ success: true, transactionData, totalRecords })
    } catch (err) { res.json({ success: false, message: 'Something went wrong. Try reloading' }); }
  
  });
  


/* ============================================================
MASTERLIST ACTIVITIES
=============================================================== */
  router.post('/masterlistActivities', async (req, res) => {
    const { eeid, branch, department, sku, position, page, pageSizeSix, search, sortField, sortDirection } = req.body;
    const activityData = {};
  
    if (position === 'Admin' || position === 'Auditor' ) {
     // activityData.mainActivity = 'Savings Deposit';
    } else if (position === 'Branch Manager') {
      activityData.branch = branch;
     // activityData.mainActivity = 'Savings Deposit';
    }  else if (position !== 'Admin' && position !== 'Auditor' && position !== 'Branch Manager' ) {
      activityData.branch = branch;
      activityData.eeid = eeid;
    //  activityData.mainActivity = 'Savings Deposit';
    } 
  
    if (search) {
      const regex = new RegExp(search, 'i');
      activityData.$or = [
        { branch: regex },
        { position: regex },
        { employeeFirstName: regex },
        { employeeLastName: regex }, 
        { eeid: regex }, 
        { additionalInfo: regex }, 
      ];
    }
  
    try {
      let sort = { _id: -1, };
      if (sortField) {
        sort = {};
        sort[sortField] = sortDirection === 'desc' ? -1 : 1;
      }
      const transactionData = await SystemActivity.aggregate([
        {
          $project: {
            _id: 1,
            eeid: 1,
            mainId: 1,
            employeeFirstName: 1,
            employeeLastName: 1,
            branch: 1,
            position: 1,
            date: 1,
            mainActivity: 1,
            additionalInfo: 1,
            remarks: 1,
            latitude: 1,
            longitude: 1,
            amount: 1,
          },          
        },
        { $match: { $and: [activityData] } },
        {
          $lookup: {
            from: "borrowers",
            let: { main_id: { $toObjectId: "$mainId" } },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$main_id"] } } },
            ],
            as: "lookUp",
          },
        }, 
        { $unwind: { path: "$lookUp", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            'eeid': "$eeid",
            'mainId': "$mainId",
            'employeeFirstName': "$employeeFirstName",
            'employeeLastName': "$employeeLastName",
            'branch': "$branch",
            'position': "$position",
            'additionalInfo': "$additionalInfo",
            'date': "$date",
            'remarks': "$remarks",
            'latitude': "$latitude",
            'longitude': "$longitude",
            'mainActivity': "$mainActivity",
            'amount': "$amount",
            'applicantFirstName': "$lookUp.applicantFirstName",
            'applicantFamilyName': "$lookUp.applicantFamilyName",
          }
        }, 
        { $sort: sort },
        { $skip: (page - 1) * pageSizeSix },
        { $limit: pageSizeSix },
      ])
  
      const totalRecords = await SystemActivity.countDocuments(activityData);
  
      res.json({ success: true, transactionData, totalRecords })
    } catch (err) { res.json({ success: false, message: 'Something went wrong. Try reloading' }); }
  
  });
  




/* ============================================================
BACKUP ACTIVITIES
=============================================================== */
  router.post('/backupActivities', async (req, res) => {
    const { eeid, branch, department, sku, position, page, pageSizeSeven, search, sortField, sortDirection } = req.body;
    const activityData = {};
  
    if (position === 'Admin' || position === 'Auditor' ) {
      activityData.mainActivity = 'Backup';
    } else if (position === 'Branch Manager') {
      activityData.branch = branch;
      activityData.mainActivity = 'Backup';
    }  else if (position !== 'Admin' && position !== 'Auditor' && position !== 'Branch Manager' ) {
      activityData.branch = branch;
      activityData.eeid = eeid;
      activityData.mainActivity = 'Backup';
    } 
  
    if (search) {
      const regex = new RegExp(search, 'i');
      activityData.$or = [
        { branch: regex },
        { position: regex },
        { employeeFirstName: regex },
        { employeeLastName: regex }, 
        { eeid: regex }, 
        { additionalInfo: regex }, 
      ];
    }
  
    try {
      let sort = { _id: -1, };
      if (sortField) {
        sort = {};
        sort[sortField] = sortDirection === 'desc' ? -1 : 1;
      }
      const transactionData = await SystemActivity.aggregate([
        {
          $project: {
            _id: 1,
            eeid: 1,
            mainId: 1,
            employeeFirstName: 1,
            employeeLastName: 1,
            branch: 1,
            position: 1,
            date: 1,
            mainActivity: 1,
            additionalInfo: 1,
            remarks: 1,
            latitude: 1,
            longitude: 1,
            amount: 1,
          },          
        },
        { $match: { $and: [activityData] } },
        {
          $lookup: {
            from: "borrowers",
            let: { main_id: { $toObjectId: "$mainId" } },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$main_id"] } } },
            ],
            as: "lookUp",
          },
        }, 
        { $unwind: { path: "$lookUp", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            'eeid': "$eeid",
            'mainId': "$mainId",
            'employeeFirstName': "$employeeFirstName",
            'employeeLastName': "$employeeLastName",
            'branch': "$branch",
            'position': "$position",
            'additionalInfo': "$additionalInfo",
            'date': "$date",
            'remarks': "$remarks",
            'latitude': "$latitude",
            'longitude': "$longitude",
            'mainActivity': "$mainActivity",
            'amount': "$amount",
            'applicantFirstName': "$lookUp.applicantFirstName",
            'applicantFamilyName': "$lookUp.applicantFamilyName",
          }
        }, 
        { $sort: sort },
        { $skip: (page - 1) * pageSizeSeven },
        { $limit: pageSizeSeven },
      ])
  
      const totalRecords = await SystemActivity.countDocuments(activityData);
  
      res.json({ success: true, transactionData, totalRecords })
    } catch (err) { res.json({ success: false, message: 'Something went wrong. Try reloading' }); }
  
  });
  





module.exports = router;