const resetPasswordText = (name, id) => {
  return `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Demakk Ecommerce Site</a>
    </div>
    <p style="font-size:1.25em">Hi, ${name}</p>
    <p>Your Demmakk password can be reset by clicking the button below. It expires in 10 minutes. If you did not request a new password, please ignore this email.</p>
    <a href='https://demakk.com/user/resetPassword/${id}' style="background: #00466a;margin: 0 auto;width: max-content;padding: 5px 10px;font-size:1rem;color: #fff;border-radius: 4px;cursor:pointer;text-decoration:none">Reset Password</a>
    <p style="font-size:0.9em;">Regards,<br />Demakk</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Demakk Printing Enterprise</p>
      <p>Ethiopia, Addis Ababa,</p>
      <p>Atena-tera, BY Bldg.</p>
    </div>
  </div>
</div>`;
};

export default resetPasswordText;
