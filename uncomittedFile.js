response:{
  common:{
    200:"Creation completed successfully",
    201:"Update completed successfully",
    202:"Deletion completed successfully",
    203:"Deletion completed successfully",
    400: "Missing required fields",

  },
  auth:{
    204:"Logged in successfilly",
    205:"Logged out successfilly",
    206:"OTP has been sent to your email",
    207:"Reset message is sent",
    208:"",
    400: "Account already exists",
    401: "Request has expired, Please try again!",
    402: "Your email is already verified",
    403: "Your phone number is already verified",
    414: "Your OTP has expired",
    
    },
  user: {
    201: "User is blocked",
    202: "User is unblocked",

    400: "Please provide user id",
    401: "User not found",
    402: "Invalid user id",
    403: "User is already blocked",
  }
}