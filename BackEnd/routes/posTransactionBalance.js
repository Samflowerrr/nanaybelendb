const Branch = require('../models/branch');
const posTransactionBalance = require('../models/posTransactionBalance');
const PosTransactionBalance = require('../models/posTransactionBalance');
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


  
/* ===============================
        GET ONLY ONE BRANCH
=============================== */
router.get('/branches', async (req, res) => {

    console.log("branch found")
    const branches = await PosTransactionBalance.find({}).select("branch").limit(0)
  
    res.json({ success: true, branches })

});




/* ===============================
        GET ALL BRANCHES
=============================== */

router.get('/branchesFound', async (req, res) => {
  try {

    console.log("branches found")
    const branches = await PosTransactionBalance.aggregate([
      { $group: { _id: '$branch' } },
      { $project: { _id: 0, branch: '$_id' } }
    ]);

    const branchList = branches.map((item) => item.branch);

    res.json({ success: true, branches: branchList });
  } catch (err) {
    res.json({ success: false, message: 'An error occurred' });
  }
});



/*==================================
            GET CATEGORY
==================================*/
router.get('/category', async (req, res) => {

    console.log("category found")
    const category = await PosTransactionBalance.aggregate([

      { $unwind: { path: "$register", preserveNullAndEmptyArrays: true } },

      {

        $project: {

          _id: 1,
          'branch': '$branch',
          'category': '$register.category',
          'productName': '$register.productName',
          'qty': '$register.qty',
          'price': '$register.price', 
        }

      },

      { $match: { $and: [{ category: "Beverage" }] } },

      
    ]);
  
    res.json({ success: true, category })

});


/*============================================
    GET THE TOTAL SUM UP OF THE ITEMS SOLD
============================================*/
router.get('/sum', async (req, res) => {
  console.log("total amount found")
  const totalAmount = await PosTransactionBalance.aggregate([

    { $unwind: { path: "$register", preserveNullAndEmptyArrays: true } },

    {

      $project: {

        _id: 1,
  
        'amount': { $multiply: ['$register.soldQty', '$register.price'] }
      }

    },

    { $match: { $and: [{}] } },

    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' }
      }
    }
    
  ]);

  res.json({ success: true, totalAmount })

});


/*=================================================================
       GET THE SPECIFIC PRODUCT AND ITS TOTAL IN A SET DATE
=================================================================*/

router.get('/specific', async (req, res) => {
  console.log("amount found");
  const startDate = new Date(req.query.startDate); 
    const endDate = new Date(req.query.endDate);

  const amount = await PosTransactionBalance.aggregate([
    { $unwind: { path: "$register", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        soldQty: '$register.soldQty',
        price: '$register.price',
        category: '$register.category',
        productName: '$register.productName',
        branch: '$branch',
        completionTime: '$completionTime',
        amount: { $multiply: ['$register.soldQty', '$register.price'] }
      }
    },
    {
      $match: {
        category: "Tam-Ison",
        productName: "MAMON",
        branch: "Naga",
        completionTime: {
          $gte: startDate,
          $lte: endDate,
        },
      }
    },
    {
      $group: {
        _id: { branch: '$branch', category: '$category', productName:'$productName' },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);

  res.json({ success: true, amount });
});



/*================================================
      GET THE LEAST SOLD PRODUCT IN A BRANCH
================================================*/


router.get('/Least', async (req, res) => {
  try {
    const branchName = "Basak";
    
    const leastSellingProduct = await PosTransactionBalance.aggregate([
      { $unwind: { path: "$register", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          soldQty: '$register.soldQty',
          productName: '$register.productName',
          branch: '$branch',
        }
      },
      {
        $match: {
          branch: branchName,
        }
      },
      {
        $group: {
          _id: { productName: '$productName' },
          totalSold: { $sum: '$soldQty' },
        }
      },
      {
        $sort: {
          totalSold: 1,
          'productName': 1
        }
      },
      {
        $limit: 1
      },
    ]);

    res.json({ success: true, leastSellingProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
});


/*=======================================================================
    GET ALL THE LIST OF PRODUCTS SOLD PER BRANCH (LEAST TO MOST SOLD)
=======================================================================*/

router.get('/allLeast', async (req, res) => {
  try {
    const branchName = req.query.branchName || 'Opon 1';
    
    const leastSellingProducts = await PosTransactionBalance.aggregate([
      { $unwind: { path: '$register', preserveNullAndEmptyArrays: true } },
      {
        $match: {
          branch: branchName,
         //productName: { $gte: 0
        },
      },
      {
        $group: {
          _id: '$register.productName',
          totalSold: { $sum: '$register.soldQty' },
        },
      },
      {
        $sort: {
          totalSold: 1,
        },
      },
      {
        $group: {
          _id: null,
          leastSellingProducts: { $push: { productName: '$_id', totalSold: '$totalSold' } },
        },
      },
      {
        $project: {
          _id: 0,
          leastSellingProducts: 1,
        },
      },
    ]);

    res.json({ success: true, leastSellingProducts: leastSellingProducts[0]?.leastSellingProducts || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
});




/*============================================================
    GET THE LEAST SOLD PRODUCT IN A BRANCH ON A SET DATES
============================================================*/


router.get('/leastwithDate', async (req, res) => {
  try {
    const branchName = "Tayud";
    const startDate = new Date('2022-05-01'); 
    const endDate = new Date('2022-05-30'); 
    
    const leastSellingProduct = await PosTransactionBalance.aggregate([
      { $unwind: { path: "$register", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          soldQty: '$register.soldQty',
          productName: '$register.productName',
          branch: '$branch',
          completionTime: '$completionTime', 
        }
      },
      {
        $match: {
          branch: branchName,
          completionTime: { 
            $gte: startDate, 
            $lte: endDate
          },
        }
      },
      {
        $group: {
          _id: { completionTime: '$completionTime', productName: '$productName' },
          totalSold: { $sum: '$soldQty' },
        }
      },
      {
        $sort: {
          totalSold: 1,
        }
      },
      {
        $limit: 1
      },
    ]);

    res.json({ success: true, leastSellingProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
});





/*================================================
      GET THE MOST SOLD PRODUCT IN A BRANCH
================================================*/



router.get('/mostSold', async (req, res) => {
  try {
    const branchName = "Tayud";
    
    const mostSoldProduct = await PosTransactionBalance.aggregate([
      { $unwind: { path: "$register", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          soldQty: '$register.soldQty',
          productName: '$register.productName',
          branch: '$branch',
        }
      },
      {
        $match: {
          branch: branchName,
        }
      },
      {
        $group: {
          _id: { productName: '$productName' },
          totalSold: { $sum: '$soldQty' },
        }
      },
      {
        $sort: {
          totalSold: -1,
        }
      },
      {
        $limit: 1
      },
    ]);

    res.json({ success: true, mostSoldProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
});




/*=======================================================================
    GET ALL THE LIST OF PRODUCTS SOLD PER BRANCH (LEAST TO MOST SOLD)
=======================================================================*/

router.get('/allMost', async (req, res) => {
  try {
    const branchName = "Basak"; 
    
    const mostSoldProducts = await PosTransactionBalance.aggregate([
      { $unwind: { path: '$register', preserveNullAndEmptyArrays: true } },
      {
        $match: {
          branch: branchName,
        },
      },
      {
        $group: {
          _id: '$register.productName',
          totalSold: { $sum: '$register.soldQty' },
        },
      },
      {
        $sort: {
          totalSold: -1,
        },
      },
    ]);

    res.json({ success: true, mostSoldProducts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
});







/*============================================================
    GET THE MOST SOLD PRODUCT IN A BRANCH ON A SET DATES
============================================================*/


router.get('/mostSoldwithDate', async (req, res) => {
  try {
    const branchName = "Basak";
    const startDate = new Date(req.query.startDate); 
    const endDate = new Date(req.query.endDate); 
    
    const mostSoldProduct = await PosTransactionBalance.aggregate([
      { $unwind: { path: "$register", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          soldQty: '$register.soldQty',
          productName: '$register.productName',
          branch: '$branch',
          completionTime: '$completionTime',
        }
      },
      {
        $match: {
          branch: branchName,
          completionTime: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { completionTime: '$completionTime', productName: '$productName' },
          totalSold: { $sum: '$soldQty' },
        }
      },
      {
        $sort: {
          totalSold: -1,
        }
      },
      {
        $limit: 1
      },
    ]);

    res.json({ success: true, mostSoldProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
});







/*=========================================================
          DELETE OTHER DATA AND REMAIN 100 DATA
=========================================================*/
router.delete('/deleteTransactionBalance', async (req, res) => {

    console.log("deleted")
    const branches = await PosTransactionBalance.deleteMany({_id: {$lte:"624452ab14ebc75d6275ebc8"}})
    res.json({ success: true, branches })

});



/*=============================================
============DELETE THE ENTIRE ARRAY============
=============================================*/

router.delete('/productsedit', async (req, res) => {
  try {
    const Id = "6222c8db961009fdecc50817"
    const productId = "622356f2961009fdecc50ee1";
    const newSoldQty = 11;

    const result = await posTransactionBalance.updateOne( 
      { _id: Id, register: { $elemMatch: { sku: "8" } } },
      { $pull: { register: {sku: "8"} } }
    );

console.log (result)

    if (result.nModified === 0) {
      return res.status(404).json({ success: false, message: 'No changes will be updated' });
    }

    res.json({ success: true, message: 'Product quantity updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong' });
  } 
}); 





/*============================================
===GET THE TOTAL AMOUNT EVERYDAY FOR A WEEK===
============================================*/

router.get('/sumeveryday', async (req, res) => {
  console.log("total amount found")
  const totalAmount = await PosTransactionBalance.aggregate([
    { $unwind: { path: "$register", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        'amount': { $multiply: ['$register.soldQty', '$register.price'] },
        'dayOfWeek': { $dayOfWeek: "$completionTime" } 
      }
    },
    {
      $match: {
        dayOfWeek: { $in: [1, 2, 3, 4, 5, 6, 7] } 
      }
    },
    {
      $group: {
        _id: "$dayOfWeek", 
        totalAmount: { $sum: '$amount' }
      }
    },
    {
      $sort: {
        totalAmount: 1 
      }
    }
  ]);

  res.json({ success: true, totalAmount });
});





/*=============================================
===GET THE TOTAL AMOUNT PER MONTH PER BRANCH===
=============================================*/

router.get('/summm', async (req, res) => {
  console.log("total amount found")
  const totalAmount = await PosTransactionBalance.aggregate([
    { $unwind: { path: "$register", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        'amount': { $multiply: ['$register.soldQty', '$register.price'] },
        'month': { $month: "$completionTime" }, 
        'branch': '$branch' 
      }
    },
    {
      $group: {
        _id: {
          branch: '$branch', 
          month: '$month' 
        },
        totalAmount: { $sum: '$amount' }
      }
    },
    {
      $group: {
        _id: '$_id.branch', 
        monthlyAmounts: { $push: { month: '$_id.month', totalAmount: '$totalAmount' } } // Collect monthly amounts
      }
    },
    {
      $sort: {
        'monthlyAmounts.totalAmount': 1 
      }
    }
  ]);

  res.json({ success: true, totalAmount });
});





/*=============================================
========UPDATE THE PROUCT SOLD QUANTITY========
=============================================*/

router.put('/productsedit', async (req, res) => {
  try {
    const Id = "6222c8db961009fdecc50817"
    const productId = "622356f2961009fdecc50ee1";
    const newSoldQty = 12;

    const result = await posTransactionBalance.updateOne( 
      { _id: Id, register: { $elemMatch: { sku: "12" } } },
      { $set: { "register.$.soldQty": newSoldQty } }
    );

console.log (result)

    if (result.nModified === 0) {
      return res.status(404).json({ success: false, message: 'No changes will be updated' });
    }

    res.json({ success: true, message: 'Product quantity updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong' });
  } 
}); 



module.exports = router;