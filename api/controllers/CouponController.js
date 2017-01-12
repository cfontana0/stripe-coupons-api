/**
 * CouponController
 *
 * @description :: Server-side logic for managing coupons
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var stripe = require('stripe')('PLEASE ASK');

module.exports = {  
    all: function(req, res) {
        stripe.coupons.list({},
            function(err, coupons) {
                res.json(200, { success: true, data: { coupons: coupons.data } });
            }
        );
    },
    post: function(req, res) {
        if (!req.body.max_redemptions) return res.json(409, { success: false, message: "parameter 'max_redemptions' is required", code: 1001 });
        if (!req.body.expiration_date) return res.json(409, { success: false, message: "parameter 'expiration_date' is required", code: 1002 });
        if (!req.body.amount_off) return res.json(409, { success: false, message: "parameter 'amount_off' is required", code: 1003 });
        stripe.coupons.create({
            id: Math.round(new Date().getTime() / 1000),
            duration: 'once',
            amount_off: req.body.amount_off * 100,
            max_redemptions: req.body.max_redemptions,
            redeem_by: new Date(req.body.expiration_date).getTime() / 1000,
            currency: "USD"
        }, function(err, coupon) {
            if (err) return res.json(409, { success: false, message: "stripe error", "stripe": err, code: 1004 });
            res.json(200, { success: true, data: { coupon } });
        });
    },
    delete: function(req, res) {
        stripe.coupons.del(req.param('id')).then(function (err) {}).catch(function(){});
        res.json(200, { success: true });
    },
};

