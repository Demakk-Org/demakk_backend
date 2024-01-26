import language from "../../language.js";

const QueryByType = (account, lang) => {
  if (
    account.match(/^2519(?:(-|\s)?)?\d{2}(?:(-|\s)?)?\d{2}(?:(-|\s)?)?\d{4}$/)
  ) {
    return {
      status: 200,
      type: "phoneNumber",
      searchQuery: { phoneNumber: account },
      account,
    };
  } else if (
    account.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  ) {
    return {
      status: 200,
      type: "email",
      searchQuery: { email: account },
      account,
    };
  } else {
    return {
      status: 400,
      message: language[lang].response[403],
    };
  }
};

export default QueryByType;
