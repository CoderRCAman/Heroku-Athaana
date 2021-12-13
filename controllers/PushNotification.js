const User = require("../models/userModel");
const PushCtrl = {
  AcceptSubscription: async (req, res) => {
    try {
      const _id = req.body.user_id; //holding user detail
      // Check the request body has at least an endpoint.
      if (!req.body || !req.body.pushSubscription) {
        // Not a valid subscription.
        res.status(400);
        res.setHeader("Content-Type", "application/json");
        res.send(
          JSON.stringify({
            error: {
              id: "no-endpoint",
              message: "Subscription must have an endpoint.",
            },
          })
        );
        return false;
      }
      const updatedUser = await User.findOneAndUpdate(
        { $and: [{ _id: { $eq: _id } }, { role: { $eq: 1 } }] },
        { isSubscribed: true, subcriptionOptions: req.body.pushSubscription },
        { new: true }
      );
      if (updatedUser)
        return res.status(200).json({ msg: "Push-Notification enabled" });
      return res.status(400).json({ msg: "Something Went Wrong" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "INTERNAL SERVER ERROR" });
    }
  },
  DeleteSubscription : async (req,res) => {
   try {
    const user_id = req.params.id ; 
    if(!user_id) {
      return res.status(400).json({msg:"INVALID ID"}) ;
    }
    const updatedAdmin = await User.findByIdAndUpdate(user_id , {subcriptionOptions:{}}) ; 
    if(updatedAdmin) return res.status(200).json({msg:'SUCCESSFULLY UNSUBSCRIBED'});
    return res.status(400).json({msg:'UNABLE TO UNSUBSCRIBE'}) ;
   } catch (error) {
     console.log(error) ; 
     return res.status(500).json({msg:"INTERNAL SERVER ERROR"});
   }
  }
};

module.exports = PushCtrl;
