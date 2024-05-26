// import { getAuth } from "firebase-admin/auth";
// import { app } from "../../firebase/firebase.js";
// import { ResponseHandler } from "../../utils/responseHandler.js";
// import responsse from "../../../responsse.js";
// import { config } from "dotenv";
// import User from "../../models/userSchema.js";
// import Cart from "../../models/cartSchema.js";

// const LANG = config(process.cwd, ".env").parsed.LANG;

// const updateFirebaseUser = async (req, res) => {
//   let { email, firstName, lastName, uid, lang } = req.body;
//   console.log(uid);

//   if (!lang || !(lang in responsse)) {
//     lang = LANG;
//   }

//   try {
//     let userExist = await User.findOne({ email });

//     if (!userExist) {
//       Cart.create({})
//         .then(async (resp) => {
//           console.log(resp);
//           let user = await User.create({
//             email,
//             firstName,
//             lastName,
//             cart: resp._id,
//             lang,
//             role: "65a6ee8675aa7a6c6924c260",
//           });

//           if (user) {
//             Cart.findByIdAndUpdate(resp._id, { user: user._id })
//               .then(async (resp) => {
//                 getAuth(app)
//                   .updateUser(uid, {
//                     email,
//                   })
//                   .then((resp) => {
//                     console.log(resp);
//                     return ResponseHandler(res, "common", 200, lang, resp);
//                   })
//                   .catch((err) => {
//                     console.log(err.message);
//                     return ResponseHandler(res, "common", 500, lang);
//                   });
//               })
//               .catch((err) => {
//                 console.log(err.message);
//                 return ResponseHandler(res, "common", 500, lang);
//               });
//           }
//         })
//         .catch((err) => {
//           console.log(err.message);
//           return ResponseHandler(res, "common", 500, lang);
//         });
//     }

//     // console.log(list);
//     getAuth(app)
//       .updateUser(uid, {
//         displayName: firstName + lastName,
//       })
//       .then((resp) => {
//         console.log(resp);
//         return ResponseHandler(res, "common", 200, lang, resp);
//       })
//       .catch((err) => {
//         console.log(err.message);
//         return ResponseHandler(res, "common", 500, lang);
//       });
//   } catch (error) {
//     console.log(error.message);
//     return ResponseHandler(res, "common", 500, lang);
//   }
// };

// export default updateFirebaseUser;
