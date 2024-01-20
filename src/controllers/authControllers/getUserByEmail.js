import admin from "firebase-admin";

const getUserByEmail = async (req, res) => {
  const email = req.body.email;
  await admin
    .auth()
    .getUserByP(email)
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log(`Successfully fetched user data: ${userRecord}`);
      res.json(userRecord);
    })
    .catch((error) => {
      console.log("Error fetching user data:", error);
    });

    
};

export default getUserByEmail;
