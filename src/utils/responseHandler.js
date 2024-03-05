import { config } from "dotenv";
import response from "../../responsse.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export function ResponseHandler(res, type, code, lang, data) {
  const statusCode = Math.floor(code / 100) * 100;

  if (!response[lang][type][code]) {
    if (!data) {
      return res
        .status(statusCode)
        .json({ message: response[LANG][type][code] });
    }
    return res
      .status(statusCode)
      .json({ message: response[LANG][type][code], data });
  }

  if (!data) {
    return res.status(statusCode).json({ message: response[lang][type][code] });
  }

  return res
    .status(statusCode)
    .json({ message: response[lang][type][code], data });
}
