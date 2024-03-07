import { config } from "dotenv";
import library from "../../responsse.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export function ResponseHandler(res, type, code, lang, data) {
  const statusCode = Math.floor(code / 100) * 100;

  if (
    !library[lang] ||
    !library[lang].response[type] ||
    !library[lang].response[type][code]
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
