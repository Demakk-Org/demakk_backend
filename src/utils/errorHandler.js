import { config } from "dotenv";
import language from "../../language.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export function ErrorHandler(res, code, lang, data) {
  const statusCode = Math.floor(code / 100) * 100;

  if (!language[lang]?.response[code]) {
    if (!data) {
      return res
        .status(statusCode)
        .json({ message: language[LANG].response[code] });
    }
    return res
      .status(statusCode)
      .json({ message: language[LANG].response[code], data });
  }

  if (!data) {
    return res
      .status(statusCode)
      .json({ message: language[lang].response[code] });
  }

  return res
    .status(statusCode)
    .json({ message: language[lang].response[code], data });
}
