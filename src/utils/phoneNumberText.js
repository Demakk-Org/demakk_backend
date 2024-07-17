import { config } from "dotenv";
import responsse from "../../responsse.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const phoneNumberText = (code, lang) => {
  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  return responsse[lang].message.text + code;
};
