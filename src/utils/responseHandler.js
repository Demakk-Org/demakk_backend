import { config } from "dotenv";
import response from "../../responsse.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export function ResponseHandler(res, type, code, lang, data) {
  const statusCode = Math.floor(code / 100) * 100;

  if (
    !response[lang] ||
    !response[lang].response[type] ||
    !response[lang].response[type][code]
  ) {
    if (!data) {
      return res
        .status(statusCode)
        .json({ message: response[LANG].response[type][code] });
    }
    return res
      .status(statusCode)
      .json({ message: response[LANG].response[type][code], data });
  }

  if (!data) {
    return res
      .status(statusCode)
      .json({ message: response[lang].response[type][code] });
  }

  return res
    .status(statusCode)
    .json({ message: response[lang].response[type][code], data });
}
