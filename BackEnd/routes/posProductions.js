const Branch = require('../models/branch');
const PosProductions = require('../models/posProductions');
var express = require('express');
var router = express.Router();;
const MongoClient = require('mongodb').MongoClient;

/*=======================================
      DELETE THE FIRST 20,000 DATA
=======================================*/


router.delete('/deleteProductions', async (req, res) => {
    //try {
      console.log("city found")
      const branches = await PosProductions.deleteMany({_id: {$lte:"628e92ad04a8dd402e173069"}})
      res.json({ success: true, branches })
    //} catch (err) { res.json({ success: false, message: 'An error occured' }); }
  });


module.exports = router;


/*===========================================================================
    GET THE TOTALS OF PRODUCTIONS FOR EACH PRODUCT EVERYDAY ON A SET DATE
===========================================================================*/

router.get('/productsByBranch', async (req, res) => {
  try {
    const branchName = "Basak";
    const startDate = new Date('2022-07-01');
    const endDate = new Date('2022-07-30'); 

    const products = await PosProductions.aggregate([
      {
        $match: {
          branch: branchName,
          completionDate: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: { product: '$product', completionDate: { $dateToString: { format: "%Y-%m-%d", date: "$completionDate" } } },
          qtyAccepted: { $sum: '$qtyAccepted' },
        },
      },
      {
        $group: {
          _id: '$_id.completionDate',
          Products: { $push: { product: '$_id.product', qtyAccepted: '$qtyAccepted' } },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          Products: 1,
        },
      },
      { $sort: { date: 1 } }, // Sort the results by date in ascending order
    ]);

    const result = products.map(({ date, Products }) => {
      const formattedProducts = Products.reduce((result, item) => {
        result[item.product] = item.qtyAccepted;
        return result;
      }, {});

      return { date, Products: formattedProducts };
    });

    res.json({ success: true, result });
  } catch (err) {
    res.json({ success: false, message: 'An error occurred' });
  }
});



module.exports = router;

