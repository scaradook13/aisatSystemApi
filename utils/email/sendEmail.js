import { Resend } from "resend";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, templateName, context) => {
  const templatePath = path.join(__dirname, "template", `${templateName}.handlebars`);
  const source = fs.readFileSync(templatePath, "utf8");
  const compiledTemplate = handlebars.compile(source);
  const html = compiledTemplate(context);

  await resend.emails.send({
    from: "AISAT BALIWAG <no-reply@aisatsystem.com>",
    to,
    subject,
    html,
  });
};

export default sendEmail;
