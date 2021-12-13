const Users = require("../models/userModel");
const Payments = require("../models/paymentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const Address = require("../models/AddressModel");
const Order = require("../models/OrderModel");
const Products = require("../models/productModel");
const webpush = require("web-push");
const PRIVATE_KEY = Bzlfe7INhiLk67fAiQJpOw5opRzMejgl53_7_ftoGl4
const PUBLIC_KEY = BNv2C2R7Fs7o0OVxHNmDHGKqf5fKNPinye_1ZW031g5mmApEyZzlf-g3TVUX0KzQgZepjBkg7A6LZOzIZBzgi4Q
const VAPID_KEY = {
  PUBLIC_KEY: PUBLIC_KEY,
  PRIVATE_KEY: PRIVATE_KEY
};

const crypto = require("crypto");
const fetch = require("node-fetch");

const sendMail = require("./sendMail");
const { addressSchema } = require("../validations/AddressValidation");

const { OAuth2 } = google.auth;
const client = new OAuth2(
  "937595677003-lbr7kdrtbvvsr93jn43pmtggj8kk590s.apps.googleusercontent.com"
);

const { CLIENT_URL } = "https://www.athaana.com";

// const accountSid = "ACf596d2d2f6df29f63bf8416f9a628169";
// const authToken = "3d7dcaeb23df4dd777c3e8851c63999e";
// const clientTwilio = require('twilio')(accountSid, authToken);

// const smsKey = process.env.SMS_SECRET_KEY;

const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password)
        return res.status(400).json({ msg: "Please fill in all fields." });

      if (!validateEmail(email))
        return res.status(400).json({ msg: "Invaild emails." });

      const user = await Users.findOne({ email });
      if (user)
        return res.status(400).json({ msg: "This email already exists " });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password must be at least 6 characters." });

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = {
        name,
        email,
        password: passwordHash,
      };
      const activation_token = createActivationToken(newUser);

      const url = `https://www.athaana.com/user/activate/${activation_token}`;
      sendMail(email, url, "Verify your email address");

      res.json({
        msg: "Register Success! Please activate your email to start.",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  activateEmail: async (req, res) => {
    try {
      const { activation_token } = req.body;
      const user = jwt.verify(
        activation_token,
        "qwertyuiop0987654321234567890poiuytrewqasdfghjkl1234567890dasdasdasdasdassadasd"
      );

      const { name, email, password } = user;

      const check = await Users.findOne({ email });
      if (check)
        return res.status(400).json({ msg: "This email already exists." });

      const newUser = new Users({
        name,
        email,
        password,
      });

      await newUser.save();

      res.json({ msg: "Account has been activated!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email });
      if (!user)
        return res.status(400).json({ msg: "This email does not exist." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: "Password is incorrect." });

      const refresh_token = createRefreshToken({ id: user._id });
      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/user/refresh",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({ msg: "Login success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAccessToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) return res.status(400).json({ msg: "Please login now!" });

      jwt.verify(
        rf_token,
        "qwertyuiop0987654321234567890poiuytrewqasdfghjkl1234567890",
        (err, user) => {
          if (err) return res.status(400).json({ msg: "Please login now!" });

          const access_token = createAccessToken({ id: user.id });
          res.json({ access_token });
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await Users.findOne({ email });
      if (!user)
        return res.status(400).json({ msg: "This email does not exist." });

      const access_token = createAccessToken({ id: user._id });
      const url = `https://www.athaana.com/user/reset/${access_token}`;

      sendMail(email, url, "Reset your password");
      res.json({ msg: "Re-send the password, please check your email." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { password } = req.body;

      const passwordHash = await bcrypt.hash(password, 12);

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          password: passwordHash,
        }
      );

      res.json({ msg: "Password successfully changed!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUserInfor: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id)
        .select("-password")
        .populate("order");

      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUsersAllInfor: async (req, res) => {
    try {
      const users = await Users.find().select("-password");

      res.json(users);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  googleLogin: async (req, res) => {
    try {
      const { tokenId } = req.body;

      const verify = await client.verifyIdToken({
        idToken: tokenId,
        audience:
          "937595677003-lbr7kdrtbvvsr93jn43pmtggj8kk590s.apps.googleusercontent.com",
      });

      const { email_verified, email, name } = verify.payload;

      const password =
        email +
        "dasdasdasd>dasdas.daasdasdasdsdoovydnjadaya123sdqwd<>sdasdasdf";

      const passwordHash = await bcrypt.hash(password, 12);

      if (!email_verified)
        return res.status(400).json({ msg: "Email verification failed." });

      const user = await Users.findOne({ email: email });

      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({ msg: "Password is incorrect." });

        // const accesstoken = createAccessToken({id: user._id})
        const refresh_token = createRefreshToken({ id: user._id });
        res.cookie("refreshtoken", refresh_token, {
          httpOnly: true,
          path: "/user/refresh",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
        });

        // res.json({accesstoken})
        res.json({ msg: "Login success!" });
      } else {
        const newUser = new Users({
          name,
          email,
          password: passwordHash,
        });

        await newUser.save();

        // const accesstoken = createAccessToken({id: user._id})
        const refresh_token = createRefreshToken({ id: newUser._id });
        res.cookie("refreshtoken", refresh_token, {
          httpOnly: true,
          path: "/user/refresh",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
        });

        // res.json({accesstoken})
        res.json({ msg: "Login success!" });
      }
    } catch (err) {
      return res.status(500);
    }
  },
  // facebookLogin: async (req, res) => {
  //   try {
  //     const { accessToken, userID } = req.body;
  //     console.log(req.body);

  //     const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`;

  //     const data = await fetch(URL)
  //       .then((res) => res.json())
  //       .then((res) => {
  //         return res;
  //       });

  //     const { email, name } = data;

  //     const password = email + process.env.FACEBOOK_SECRET;

  //     const passwordHash = await bcrypt.hash(password, 12);

  //     const user = await Users.findOne({ email });

  //     if (user) {
  //       const isMatch = await bcrypt.compare(password, user.password);
  //       if (!isMatch)
  //         return res.status(400).json({ msg: "Password is incorrect." });

  //       const refresh_token = createRefreshToken({ id: user._id });
  //       res.cookie("refreshtoken", refresh_token, {
  //         httpOnly: true,
  //         path: "/user/refresh",
  //         maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  //       });

  //       res.json({ msg: "Login success!" });
  //     } else {
  //       const newUser = new Users({
  //         name,
  //         email,
  //         password: passwordHash,
  //       });

  //       await newUser.save();

  //       const refresh_token = createRefreshToken({ id: newUser._id });
  //       res.cookie("refreshtoken", refresh_token, {
  //         httpOnly: true,
  //         path: "/user/refresh",
  //         maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  //       });

  //       res.json({ msg: "Login success!" });
  //     }
  //   } catch (err) {
  //     return res.status(500).json({ msg: err.message });
  //   }
  // },

  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/user/refresh" });
      return res.json({ msg: "Logged out" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({ msg: "Please Login or Register" });

      jwt.verify(
        rf_token,
        "qwertyuiop0987654321234567890poiuytrewqasdfghjkl1234567890",
        (err, user) => {
          if (err)
            return res.status(400).json({ msg: "Please Login or Register" });

          const accesstoken = createAccessToken({ id: user.id });

          res.json({ accesstoken });
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id)
        .populate("address")
        .populate("order")
        .populate("cart.product")
        .select("-password")
        .exec();
      if (!user) return res.status(400).json({ msg: "User does not exist." });
      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  addCart: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: "User does not exist." });
      console.log(req.body);
      const result = await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          $addToSet: { cart: req.body },
        }
      );

      if (result) return res.json({ msg: "Added to cart" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateCart: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) return res.status(400).json({ msg: "User does not exist." });
      console.log(req.body);
      const result = await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          cart: req.body.cart,
        }
      );

      if (result) return res.status(200).json({ msg: "Added to cart" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  history: async (req, res) => {
    try {
      const history = await Payments.find({ user_id: req.user.id });

      res.json(history);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  addAddress: (req, res) => {
    const validateAddress = addressSchema.validate(req.body);

    const user_id = req.params.id;
    if (validateAddress.error) {
      console.log(validateAddress.error.details);
      return res.status(400).json({ msg: "Invalid form detail" });
    }
    const newAddress = new Address(req.body);
    newAddress
      .save()
      .then((savedAddress) => {
        //address was saved successfully
        return Users.findOneAndUpdate(
          { _id: user_id },
          {
            $addToSet: { address: savedAddress._id },
          }
        )
          .then((response) => {
            console.log(savedAddress);
            if (response) return res.status(200).json(savedAddress);
          })
          .catch((err) => {
            return res.status(401).json(err);
          });
      })
      .catch((err) => {
        if (err) {
          console.log(err);
          return res.status(400).json({ msg: "Unable to save address" });
        }
      });
  },
  deteleAddress: async (req, res) => {
    try {
      const address = await Address.findByIdAndDelete(req.params.id);
      if (!address)
        return res.status(400).json({ msg: "Address does not exist" });

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          $pull: { address: req.params.id },
        }
      );

      return res.json({ msg: "Address deleted" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  order: (req, res) => {
    const _id = req.params.id;
    const newOrder = new Order(req.body);
    req.body.products.forEach(async (product) => {
      await Products.findByIdAndUpdate(product.product._id, {
        sold: product.product.sold + product.quantity,
      });
    });
    newOrder
      .save()
      .then((successOrder) => {
        Users.findByIdAndUpdate(
          _id,
          {
            $addToSet: { order: successOrder._id },
            $set: { cart: [] },
          },

          { new: true }
        )
          .populate("order")
          .then((response) => {
            //when order success send PUSH NOTIFICATION to all Subscribed Admins
            Users.find({ isSubscribed: true }, (err, admins) => {
              if (err || !admins) {
                return false;
              }
              webpush.setVapidDetails(
                "mailto:bikrantnath60@gmail.com",
                VAPID_KEY.PUBLIC_KEY,
                VAPID_KEY.PRIVATE_KEY
              );
              admins.forEach((admin) => {
                if (admin.subcriptionOptions?.endpoint) {
                  const pushSubscription = {
                    endpoint: admin.subcriptionOptions.endpoint,
                    keys: {
                      p256dh: admin.subcriptionOptions.keys.p256dh,
                      auth: admin.subcriptionOptions.keys.auth,
                    },
                  };
                  trigerPush(pushSubscription, successOrder.order_id);
                }
              });
            });
            return res.status(200).json("Order Success");
          })
          .catch((err) => {
            return res.status(400).json("Order failed");
          });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json("Order failed");
      });
  },
  status: (req, res) => {
    Order.find()
      .then((response) => {
        return res.status(200).json(response);
      })
      .catch((err) => {
        console.log(err);
        return res.status(404).json({ msg: "No status" });
      });
  },
  updateStatus: (req, res) => {
    const _id = req.params.id;

    const order_status = req.body;
    Order.findByIdAndUpdate(
      _id,
      {
        status: order_status.status,
      },
      { new: true }
    )
      .then((success) => {
        return res.status(200).json(success);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ msg: "something went wrong" });
      });
  },
  // sendOTP: (req, res) => {
  //   const phone = req.body.phone;
  //   const otp = Math.floor(100000 + Math.random() * 900000);
  //   const ttl = 2 * 60 * 1000;
  //   const expires = Date.now() + ttl;
  //   const data = `${phone}.${otp}.${expires}`;
  //   const hash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
  //   const fullHash = `${hash}.${expires}`;

  //   clientTwilio.messages
  //      .create({
  //       body: `Your One Time Login Password For Athaana is ${otp}`,
  //       from: +15164077621,
  //       to: '+91' + phone,
  //       channel: 'sms',
  //     })
  //     .then((messages) => console.log(messages))
  //     .catch((err) => console.error(err));

  //   // res.status(200).send({ phone, hash: fullHash, otp });  // this bypass otp via api only for development instead hitting twilio api all the time
  //   res.status(200).json({ phone, hash: fullHash,otp });
  // },

  // verifyOTP: async (req, res) => {
  //   const phone = req.body.phone;
  //   const hash = req.body.hash;
  //   console.log(hash)
  //   const otp = req.body.otp;
  //   let [hashValue, expires] = hash.split('.');

  //   let now = Date.now();
  //   if (now > parseInt(expires)) {
  //     return res.status(504).json({ msg: 'Timeout. Please try again' });

  //   }
  //   const data = `${phone}.${otp}.${expires}`;
  //   const newCalculatedHash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
  //   if (newCalculatedHash === hashValue) {

  //     // const accessToken = jwt.sign({ phone }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '11m' });
  //     // const refreshToken = jwt.sign({ phone }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

  //     const user = await Users.findOne({ phone: phone });
  //     console.log(`user is`) ;
  //     console.log(user) ;
  //     if (user==null) {
  //       console.log("second Stagae")
  //       const newUser = new Users({ phone: phone });
  //       newUser.save()
  //        .then(async(user) => {
  //           console.log("first stage")

  //           const refresh_token = await  createRefreshToken({ id:newUser._id });
  //           console.log(refresh_token)
  //           res
  //            .cookie('refreshtoken', refresh_token, {
  //              httpOnly: true,
  //              path: "/user/refresh",
  //              expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)

  //            })

  //          return res.status(200).json({ user,msg: 'OTP verified' });
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //           return res.status(500).json({ msg: 'Something went wrong' });
  //         });
  //     } else{
  //       const refresh_token = await createRefreshToken({ id: user._id });

  //     res
  //      .cookie('refreshtoken', refresh_token, {
  //        httpOnly: true,
  //        path: "/user/refresh",
  //        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  //     })
  //       console.log("dasd")
  //       return res.status(200).json({ user,msg: 'OTP verified' });
  //   }

  // res
  //   .status(202)
  //   .cookie('accessToken', accessToken, {
  //     expires: new Date(new Date().getTime() + 30 * 1000),
  //     sameSite: 'strict',
  //     httpOnly: true
  //   })
  //   .cookie('refreshToken', refreshToken, {
  //     expires: new Date(new Date().getTime() + 31557600000),
  //     path: "/user/refresh",
  //     sameSite: 'strict',
  //     httpOnly: true
  //   })
  // .cookie('authSession', true, { expires: new Date(new Date().getTime() + 30 * 1000), sameSite: 'strict' })
  // .cookie('refreshTokenID', true, {
  //   expires: new Date(new Date().getTime() + 31557600000),
  //   sameSite: 'strict'
  // })
  // res.send({ msg: 'Device verified' });

  //   }

  //   else {

  //     return res.status(500).json({verification:false, msg: 'OTP not verified' });

  //   }
  // }
};
const createAccessToken = (user) => {
  return jwt.sign(user, "asdfghjklkjhgfdsa1234567890987654321", {
    expiresIn: "11m",
  });
};
const createRefreshToken = (user) => {
  return jwt.sign(
    user,
    "qwertyuiop0987654321234567890poiuytrewqasdfghjkl1234567890",
    { expiresIn: "7d" }
  );
};
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
const createActivationToken = (user) => {
  return jwt.sign(
    user,
    "qwertyuiop0987654321234567890poiuytrewqasdfghjkl1234567890dasdasdasdasdassadasd",
    {
      expiresIn: "5m",
    }
  );
};
``;
const trigerPush = (subscription, dataToSend) => {
  return webpush
    .sendNotification(subscription, dataToSend)
    .catch((err) => {
      if (err.statusCode === 404 || err.statusCode === 410) {
        console.log("Subscription has expired or is no longer valid: ", err);
        return false;
      } else {
        console.log(err);
        return false;
      }
    });
};

module.exports = userCtrl;
