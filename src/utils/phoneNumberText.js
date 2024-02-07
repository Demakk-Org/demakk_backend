import { config } from "dotenv";
import response from "../../response.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const phoneNumberText = (code, lang) => {
  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  return response[lang].message.text + code;
};
