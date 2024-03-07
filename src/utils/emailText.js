import { config } from "dotenv";
import responsse from "../../responsse";

const LANG = config(process.cwd, ".env").parsed.LANG;

const emailText = (value, lang) => {
  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  return `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">${responsse[lang].message.title}</a>
    </div>
    <p style="font-size:1.1em">${responsse[lang].message.greetings},</p>
    <p>${responsse[lang].message.content}</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${value}</h2>
    <p style="font-size:0.9em;">${responsse[lang].message.regards}<br />${responsse[lang].message.name}</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>${responsse[lang].message.company}</p>
      <p>${responsse[lang].message.location1}</p>
      <p>${responsse[lang].message.location2}</p>
    </div>
  </div>
</div>`;
};

export default emailText;
