export default {
  en: {
    response: {
      common: {
        200: "OK",
        201: "Creation completed successfully",
        202: "Update completed successfully",
        203: "Deletion completed successfully",

        400: "Missing required fields",
        401: "Unauthorized",
        404: "Not Found",
        405: "Invalid date provided",
        406: "Invalid input",
        407: "provide proper lang",
        408: "lang must en or am",

        500: "Internal Server Error, please try again!",
        501: "Not Implemented: it is under development",
      },
      auth: {
        200: "Logged in successfully",
        201: "Logged out successfully",
        202: "OTP has been sent to your email",
        203: "Reset message is sent",
        204: "Your email is verified",
        205: "OTP has been sent to your phone number",
        206: "Your phone number is verified",
        207: "Your email is already verified",

        400: "Account already exists",
        401: "Request has expired, Please try again!",
        403: "Your phone number is already verified",
        404: "Passwords don't match",
        405: "Please enter valid phone number or email address!",
        406: "OTP doesn't match",
        407: "Your OTP has expired",
        408: "The phone number is already in use",
        409: "Invalid OTP id",
        410: "The password is incorrect!",
        411: "Authentication failed: No token provided",
        412: "Authentication failed: Invalid token",
        413: "Authentication failed: Token has expired",
        414: "Authentication failed: User not admin",
        415: "Phone number is not registered in your account",
        416: "Email address is not registered in your account",
        417: "Message was not sent successfully",
        418: "The email is already in use",
        419: "Phone number is already in use",
      },
      user: {
        201: "User is blocked",
        202: "User is unblocked",

        400: "Please provide user id",
        402: "Invalid user id",
        404: "User not found",
        405: "User is already blocked",
        406: "User is already unblocked",
      },
      cart: {
        400: "Cart not found",
      },
      product: {
        200: "You liked this product",
        201: "You unliked this product",

        401: "Invalid product name value!",
        402: "Invalid product id",
        403: "Invalid product description value!",
        404: "Product is not found",
        405: "Invalid tag value",
        406: "At least one tag is required",
        407: "Product price is number",
      },
      address: {
        402: "Invalid address id",
        404: "Address is not found",
        405: "This address does not belong to this user", //----
      },
      stockType: {
        401: "Stock type name is invalid",
        402: "Invalid stock type id",
        404: "Stock type is not found",
        408: "Invalid stock type name",
      },
      role: {
        401: "Role name is type of string",
        402: "Invalid role id",
        404: "Role is not found",
        405: "The role already exists",
      },
      stockItem: {
        401: "Stock item name is invalid",
        402: "Invalid stock item id",
        404: "Stock item is not found",
        405: "stock item price is a number",
      },
      productCategory: {
        401: "Invalid product category name value!",
        402: "Invalid product category id",
        404: "Product category is not found",
      },
      order: {
        402: "Invalid order id",
        404: "Order not found",
        405: "This order does not belong to this user",
      },
      orderItem: {
        401: "Invalid order items value!",
        402: "Invalid order item id!",
        404: "Order item not found",
        404: "Quantity is a type of number",
        405: "Order item can not be empty",
      },
      coupon: {
        401: "Invalid coupon name",
        402: "Invalid coupon code id!",
        404: "Coupon not found",
      },
      orderStatus: {
        401: "Invalid order status name",
        404: "Order status not found",
      },
      review: {
        402: "Invalid review Id",
        404: "Rating is a type of number",
        405: "Review text is a value of type string",
        406: "A review has already been registered by this user",
        407: "Rating is between 1 and 5",
        408: "Specify the correct type of review",
        409: "Review not found",
      },
      discountType: {
        401: "Discount type name is invalid",
        402: "Invalid discount type id",
        404: "Discount type is not found",
        405: "Discount amount is a type of number",
      },
      image: {
        401: "Image name is a type of string",
        402: "Invalid images id",
        404: "Images not found",
        405: "Image description is a type of string",
        406: "Primary is a type of number",
        407: "Invalid Primary image value",
        408: "Invalid image file",
      },
      stockVariety: {
        404: "StockVariety not found",
        407: "Invalid stockVariety id",
        408: "Invalid stockVariety value",
      },
      stockVarietyType: {
        404: "stockVarietyType not found",
        406: "StockVarietyType already exists",
        407: "Invalid stockVarietyType id",
        408: "Invalid stockVarietyType name",
      },
    },
    message: {
      text: "Demakk: Your verification code is: ",
      title: "Demakk ecommerce site",
      greetings: "Hi",
      body: "Your Demmakk password can be reset by clicking the button below. It expires in 10 minutes. If you did not request a new password, please ignore this email.",
      button: "Reset Password",
      regards: "Regards, ",
      name: "Demakk",
      company: "Demakk Printing Enterprise",
      location1: "Ethiopia, Addis Ababa,",
      location2: "Atena-tera, BY Bldg.",
      message: "Use this link to reset your password, ",
      content:
        "Thank you for choosing our Brand. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes",
    },
  },
  am: {
    response: {
      common: {
        200: "እሺ",
        201: "ምስረታ ተሳክቷል",
        202: "ማስተካከል ተሳክቷል",
        203: "ማጥፋት ተሳክቷል",

        400: "አስፈላጊ መረጃ ይጎድላል",
        401: "ያልተፈቀደ",
        404: "አልተገኘም",
        405: "ልክ ያልሆነ ቀን ቀርቧል",

        500: "የመረብ ብልሽት ተከስቷል፡ እባክዎን ትንሽ ቆይተው እንደገና ይሞክሩ!",
        501: "አልተተገበረም።: ልማት ላይ ነው።",
      },
      auth: {
        200: "በተሳካ ሁኔታ ገብቷል",
        201: "በተሳካ ሁኔታ ወጥቷል",
        202: "OTP ወደ ኢሜልዎ ተልኳል",
        203: "ማደሻ መልእክት ተልኳል",
        204: "መለያህ ተረጋግጧል",
        205: "OTP ወደ ስልክ ቁጥርዎ ተልኳል",
        206: "ስልክ ቁጥርህ ተረጋግጧል",

        400: "መለያ አስቀድሞ አለ",
        401: "ጥያቄው ጊዜው አልፎበታል፣ እባክዎ እንደገና ይሞክሩ!",
        403: "ስልክ ቁጥርህ አስቀድሞ ተረጋግጧል",
        404: "የይለፍ ቃሎች አይዛመዱም",
        405: "እባክዎ የሚሰራ ስልክ ቁጥር ወይም ኢሜይል አድራሻ ያስገቡ!",
        406: "OTP አይዛመድም",
        407: "የእርስዎ OTP ጊዜው አልፎበታል",
        409: "ልክ ያልሆነ OTP መታወቂያ",
        410: "የይለፍ ቃሉ የተሳሳተ ነው!",
        411: "ማረጋገጥ አልተሳካም፡ ምንም ማስመሰያ አልቀረበም!",
        412: "ማረጋገጥ አልተሳካም፡ ልክ ያልሆነ ማስመሰያ!",
        413: "ማረጋገጥ አልተሳካም፡ ማስመሰያ ጊዜው አልፎበታል!",
        414: "ማረጋገጥ አልተሳካም፡ ተጠቃሚ አስተዳዳሪ አይደለም!",
        415: "ስልክ ቁጥር በመለያዎ ውስጥ አልተመዘገበም",
        416: "ኢሜል በመለያዎ ውስጥ አልተመዘገበም",
        417: "መልእክት በተሳካ ሁኔታ አልተላከም",
        418: "ኢሜይሉ አስቀድሞ ጥቅም ላይ ውሏል",
        419: "ስልክ ቁጥሩ አስቀድሞ ጥቅም ላይ ውሏል",
        420: "ኢሜይልህ አስቀድሞ ተረጋግጧል",
      },
      user: {
        201: "ተጠቃሚ ታግዷል",
        202: "ተጠቃሚው እገዳው ተነስቷል",

        400: "እባክዎ የተጠቃሚ መታወቂያ ያቅርቡ",
        402: "የተሳሳተ የተጠቃሚ መታወቂያ",
        403: "ተጠቃሚ አስቀድሞ ታግዷል",
        404: "ተጠቃሚ አልተገኘም",
        405: "ተጠቃሚ አስቀድሞም እገዳው ተነስቷ",
      },
      cart: {
        400: "ጋሪ አልተገኘም",
      },
      product: {
        200: "ይህን ምርት ወደውታል",
        201: "ይህን ምርት አልወደዱትም",

        402: "ልክ ያልሆነ የምርት መታወቂያ",
        400: "የእቃው ስም ልክ አይደለም",
        401: "ልክ ያልሆነ የምርት መግለጫ ዋጋ!",
        404: "ምርቱ አልተገኘም",
        405: "ልክ ያልሆነ የመለያ ዋጋ",
        406: "ቢያንስ አንድ መለያ ያስፈልጋል",
      },
      address: {
        400: "አድራሻ አልተገኘም",
        401: "ልክ ያልሆነ የአድራሻ መታወቂያ",
        407: "ይህ አድራሻ የዚህ ተጠቃሚ አይደለም", //----
      },
      stockType: {
        400: "የክምችቱ አይነት ስም ልክ ያልሆነ ነው",
        401: "ልክ ያልሆነ ክምችቱ አይነት መታወቂያ",
        404: "የክምችቱ አይነት አልተገኘም",
      },
      role: {
        400: "ልክ ያልሆነ የሚና መታወቂያ",
        401: "ሚናው አስቀድሞ አለ",
        402: "የሚና ስም የሕብረቁምፊ ዓይነት ነው",
        404: "ሚና አልተገኘም",
      },
      stockItem: {
        400: "የእቃው መታወቂያ ልክ አይደለም",
        401: "የእቃው ስም ልክ አይደለም",
        404: "እቃው አልተገነም",
      },
      productCategory: {
        400: "ልክ ያልሆነ የምርት ምድብ መታወቂያ",
        402: "ልክ ያልሆነ የምርት ምድብ ስም ዋጋ!",
        404: "የምርት ምድብ አልተገኘም",
      },
      order: {
        400: "የትዕዛዝ መታወቂያው ልክ ያልሆነ ነው",
        401: "ትዕዛዝ አልተገኘም",
        405: "ይህ ትዕዛዝ የዚህ ተጠቃሚ አይደለም",
      },
      orderItem: {
        400: "ልክ ያልሆነ የትዕዛዝ ዋጋ!",
        401: "ልክ ያልሆነ የትዕዛዝ ንጥል መታወቂያ ዋጋ!",
        402: "ብዛት የቁጥር አይነት ነው",
        403: "የትዕዛዝ ንጥል ባዶ ሊሆን አይችልም",
        404: "የትዕዛዝ ንጥል ነገር አልተገኘም",
      },
      coupon: {
        400: "ልክ ያልሆነ የኩፖን መታወቂያ!",
        401: "ልክ ያልሆነ የኩፖን ስም",
        404: "ኩፖን አልተገኘም",
      },
      orderStatus: {
        400: "ልክ ያልሆነ የትዕዛዝ ሁኔታ ስም",
        401: "የትዕዛዝ ሁኔታ አልተገኘም",
      },
      review: {
        400: "ደረጃ የቁጥር አይነት ነው",
        401: "የግምገማ ጽሑፍ የሕብረቁምፊ ዓይነት ዋጋ ነው",
        402: "ግምገማ አስቀድሞ በዚህ ተጠቃሚ ተመዝግቧል",
        403: "ደረጃ አሰጣጥ በ1 እና 5 መካከል ነው",
        404: "የግምገማውን አይነት ይግለጹ",
      },
      discountType: {
        400: "የቅናሽ አይነት ስም ልክ ያልሆነ ነው።",
        401: "ልክ ያልሆነ የቅናሽ አይነት መታወቂያ",
        402: "የቅናሽ መጠን የቁጥር አይነት ነው",
        404: "የቅናሽ አይነት አልተገኘም።",
      },
      image: {
        400: "የምስል ስም የሕብረቁምፊ አይነት ነው",
        401: "የምስል መግለጫ የሕብረቁምፊ አይነት ነው",
        402: "ቀዳሚ የቁጥር አይነት ነው",
        403: "ልክ ያልሆነ ቀዳሚ ምስል ዋጋ",
        404: "ምስሎች አልተገኙም።",
        405: "ልክ ያልሆኑ ምስሎች መታወቂያ",
      },
    },
    message: {
      text: "ደማቅ፡ ይህ የእርሶ የማረጋገጫ ኮድ ነው: ",
      title: "ደማቅ ኢ-ንግድ ጣቢያ",
      greetings: "ሰላም",
      body: "የደማቅ ይለፍ ቃል ከዚህ በታች ያለውን ቁልፍ ጠቅ በማድረግ ዳግም ማስጀመር ይቻላል። በ 10 ደቂቃዎች ውስጥ ጊዜው ያበቃል. አዲስ የይለፍ ቃል ካልጠየቁ፣ እባክዎ ይህን ኢሜይል ችላ ይበሉ።",
      button: "የይለፍ ቃል ዳግም አስጀምር",
      regards: "ከሰላምታ ጋር, ",
      name: "ደማቅ",
      company: "ደማቅ ማተሚያ ድርጅት",
      location1: "ኢትዮጵያ, አዲስ አበባ",
      location2: "አጠና-ተራ, ቢዋይ ህንጻ",
      message: "የይለፍ ቃልዎን እንደገና ለማስጀመር ይህንን ሊንክ ይጠቀሙ, ",
      content:
        "የእኛን የምርት ስም ስለመረጡ እናመሰግናለን። የመመዝገቢያ ሂደቶችን ለማጠናቀቅ የሚከተለውን OTP ይጠቀሙ። OTP የሚሰራው ለ 5 ደቂቃዎች ነው።",
    },
  },
};
