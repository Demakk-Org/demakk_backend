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
        407: "Prices are type of number and greater than zero! ",

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
        419: "Your email is already verified",
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
        404: "Cart not found",
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
        407: "Invalid price range values ",
        408: "Invalid stock variety list values",
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
        402: "Invalid order item id!",
        403: "Invalid order items value!",
        404: "Order item not found",
        405: "Order item can not be empty",
        406: "Quantity is a type of number",
      },
      coupon: {
        401: "Invalid coupon name",
        402: "Invalid coupon code id!",
        404: "Coupon not found",
        405: "Coupon code is already exists",
      },
      orderStatus: {
        401: "Invalid order status name",
        404: "Order status not found",
      },
      review: {
        402: "Invalid review Id",
        403: "Rating is a type of number",
        404: "Review not found",
        405: "Review text is a value of type string",
        406: "A review has already been registered by this user",
        407: "Rating is between 1 and 5",
        408: "Specify the correct type of review",
      },
      discountType: {
        401: "Discount type name is invalid",
        402: "Invalid discount type id",
        404: "Discount type is not found",
        405: "Discount amount is a type of number and greater than zero",
        406: "Discount type already exists",
      },
      image: {
        401: "Image name is a type of string",
        402: "Invalid images id",
        403: "Image description is a type of string",
        404: "Images not found",
        406: "Primary is a type of number",
        407: "Invalid Primary image value",
        408: "Invalid image file",
        409: "Invalid images type value",
      },
      stockVariety: {
        402: "Invalid stock variety id",
        404: "Stock variety not found",
        407: "Number of available stock variety is type of number!",
        408: "Invalid stock variety value",
        409: "Stock variety for this product already exists",
        410: "Type is type of string, 'main' or 'sub'",
        411: "Invalid sub variants value",
        412: "Invalid image value, it's type of string",
      },
      stockVarietyType: {
        401: "Invalid stock variety type name",
        402: "Invalid stock variety type id",
        404: "stock variety type not found",
        406: "Stock variety type already exists",
      },
      dealType: {
        401: "Invalid deal type name",
        402: "Invalid deal type id",
        404: "Deal type not found",
        406: "Deal type already exists",
        407: "Invalid deal subtitle value",
      },
      deal: {
        401: "Invalid deal subtitle value",
        402: "Invalid deal id",
        404: "deal not found",
        406: "Invalid discounts list",
        407: "Discount list cannot be empty",
        408: "The discount already exists in another deal",
        409: "Invalid deal status value",
      },
      discount: {
        401: "Invalid discount name",
        402: "Invalid discount id",
        404: "Discount not found",
        405: "Discount amount is a type of number and greater than zero",
        406: "Invalid discount amount",
        407: "Invalid discount type",
        408: "Invalid lists of product",
        409: "Invalid discount status",
        410: "A product already exists in another discount",
      },
      productVariant: {
        402: "Invalid variant id",
        404: "Product variant not found",
        405: "Number of Available variants is type of number",
        406: "Index of image is type of number",
        407: "Stock varieties is a list",
        408: "Invalid stock varieties provided",
        409: "There is a missing stock variety type for this product",
        410: "This product does not accept product variants, Please update the product first!",
        411: "This variant already exists in this product",
        412: "Stock variety list cannot be empty",
      },
    },
    message: {
      text: "Demakk: Your verification code is: ",
      title: "Demakk e-commerce site",
      greetings: "Hi",
      body: "Your Demakk password can be reset by clicking the button below. It expires in 10 minutes. If you did not request a new password, please ignore this email.",
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
        406: "ልክ ያልሆነ ግቤት",
        407: "ዋጋዎች የቁጥር አይነት ናቸው!",

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
        408: "ስልክ ቁጥሩ አስቀድሞ ጥቅም ላይ ውሏል",
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
        419: "ኢሜይልህ አስቀድሞ ተረጋግጧል",
      },
      user: {
        201: "ተጠቃሚ ታግዷል",
        202: "ተጠቃሚው እገዳው ተነስቷል",

        400: "እባክዎ የተጠቃሚ መታወቂያ ያቅርቡ",
        402: "የተሳሳተ የተጠቃሚ መታወቂያ",
        404: "ተጠቃሚ አልተገኘም",
        405: "ተጠቃሚ አስቀድሞ ታግዷል",
        406: "ተጠቃሚ አስቀድሞም እገዳው ተነስቷ",
      },
      cart: {
        400: "ጋሪ አልተገኘም",
      },
      product: {
        200: "ይህን ምርት ወደውታል",
        201: "ይህን ምርት አልወደዱትም",

        400: "የእቃው ስም ልክ አይደለም",
        402: "ልክ ያልሆነ የምርት መታወቂያ",
        403: "ልክ ያልሆነ የምርት መግለጫ ዋጋ!",
        404: "ምርቱ አልተገኘም",
        405: "ልክ ያልሆነ የመለያ ዋጋ",
        406: "ቢያንስ አንድ መለያ ያስፈልጋል",
      },
      address: {
        402: "ልክ ያልሆነ የአድራሻ መታወቂያ",
        404: "አድራሻ አልተገኘም",
        405: "ይህ አድራሻ የዚህ ተጠቃሚ አይደለም", //----
      },
      stockType: {
        401: "የክምችቱ አይነት ስም ልክ ያልሆነ ነው",
        402: "ልክ ያልሆነ ክምችቱ አይነት መታወቂያ",
        404: "የክምችቱ አይነት አልተገኘም",
      },
      role: {
        401: "የሚና ስም የሕብረቁምፊ ዓይነት ነው",
        402: "ልክ ያልሆነ የሚና መታወቂያ",
        404: "ሚና አልተገኘም",
        405: "ሚናው አስቀድሞ አለ",
      },
      stockItem: {
        401: "የእቃው ስም ልክ አይደለም",
        402: "የእቃው መታወቂያ ልክ አይደለም",
        404: "እቃው አልተገነም",
      },
      productCategory: {
        401: "ልክ ያልሆነ የምርት ምድብ ስም ዋጋ!",
        402: "ልክ ያልሆነ የምርት ምድብ መታወቂያ",
        404: "የምርት ምድብ አልተገኘም",
      },
      order: {
        402: "የትዕዛዝ መታወቂያው ልክ ያልሆነ ነው",
        404: "ትዕዛዝ አልተገኘም",
        405: "ይህ ትዕዛዝ የዚህ ተጠቃሚ አይደለም",
      },
      orderItem: {
        401: "ልክ ያልሆነ የትዕዛዝ ዋጋ!",
        402: "ልክ ያልሆነ የትዕዛዝ ንጥል መታወቂያ ዋጋ!",
        404: "የትዕዛዝ ንጥል ነገር አልተገኘም",
        405: "የትዕዛዝ ንጥል ባዶ ሊሆን አይችልም",
        406: "ብዛት የቁጥር አይነት ነው",
      },
      coupon: {
        401: "ልክ ያልሆነ የኩፖን ስም",
        402: "ልክ ያልሆነ የኩፖን መታወቂያ!",
        404: "ኩፖን አልተገኘም",
      },
      orderStatus: {
        401: "ልክ ያልሆነ የትዕዛዝ ሁኔታ ስም",
        404: "የትዕዛዝ ሁኔታ አልተገኘም",
      },
      review: {
        403: "ደረጃ የቁጥር አይነት ነው",
        405: "የግምገማ ጽሑፍ የሕብረቁምፊ ዓይነት ዋጋ ነው",
        406: "ግምገማ አስቀድሞ በዚህ ተጠቃሚ ተመዝግቧል",
        407: "ደረጃ አሰጣጥ በ1 እና 5 መካከል ነው",
        408: "የግምገማውን አይነት ይግለጹ",
      },
      discountType: {
        401: "የቅናሽ አይነት ስም ልክ ያልሆነ ነው።",
        402: "ልክ ያልሆነ የቅናሽ አይነት መታወቂያ",
        404: "የቅናሽ አይነት አልተገኘም።",
        405: "የቅናሽ መጠን የቁጥር አይነት ነው",
        406: "የቅናሽ አይነት አስቀድሞ አለ።",
      },
      image: {
        401: "የምስል ስም የሕብረቁምፊ አይነት ነው",
        402: "ልክ ያልሆኑ ምስሎች መታወቂያ",
        403: "የምስል መግለጫ የሕብረቁምፊ አይነት ነው",
        406: "ቀዳሚ የቁጥር አይነት ነው",
        404: "ምስሎች አልተገኙም።",
        407: "ልክ ያልሆነ ቀዳሚ ምስል ዋጋ",
        408: "ልክ ያልሆነ የምስል ፋይል",
      },
      stockVariety: {},
      stockVarietyType: {},
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
