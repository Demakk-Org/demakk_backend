import { config } from "dotenv";
import responsse from "../../responsse.js";

const DEMAKK_URL = config(process.cwd, ".env").parsed.DEMAKK_URL;

const resetPasswordText = (name, id, type, lang) => {
  if (type === "phoneNumber") {
    return `${responsse[lang].message.greetings}, ${name}: ${responsse[lang].message.title}, ${responsse[lang].message.message}https://demakk.com/user/resetPassword/${id}`;
  }

  if (type === "email") {
    return `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">${responsse[lang].message.title}</a>
      </div>
      <p style="font-size:1.25em">${responsse[lang].message.greetings}, ${name}</p>
      <p>${responsse[lang].message.body}</p>
      <a href='${DEMAKK_URL}/user/resetPassword/${id}' style="background: #00466a;margin: 0 auto;width: max-content;padding: 5px 10px;font-size:1rem;color: #fff;border-radius: 4px;cursor:pointer;text-decoration:none">${responsse[lang].message.button}</a>
      <p style="font-size:0.9em;">${responsse[lang].message.regards},<br />${responsse[lang].message.name}</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>${responsse[lang].message.company}</p>
        <p>${responsse[lang].message.location1}</p>
        <p>${responsse[lang].message.location2}</p>
      </div>
    </div>
  </div>`;
  }
};

export default resetPasswordText;
