import { config } from "dotenv";

const LANG = config(process.cwd, ".env");

const getNameFromLanguage = ({ type, lang }) => {
  console.log(type);
  return type[lang]
    ? type[lang]
    : type[LANG]
    ? type[LANG]
    : type["en"]
    ? type["en"]
    : "no name";
};

export default getNameFromLanguage;
