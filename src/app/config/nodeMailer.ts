/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer"
import { envVars } from "./env";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes"
import path from "path"
import ejs from "ejs"
// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
  secure: true, // true for 465, false for other ports
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS,
  },
});

export interface ISendEmailOptions {
  to: string,
  subject: string,
  templateName: string,
  templateData?: Record<string, any>,
  attachments?: {
    filename: string,
    content: Buffer | string,
    contentType: string
  }[]
}

const sendEmail = async ({ to, subject, templateName, templateData, attachments }: ISendEmailOptions) => {
  try {
    const templatePath = path.join(__dirname, `../utils/template/${templateName}.ejs`)
    const html = await ejs.renderFile(templatePath, templateData)
    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map(attachment => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType
      }))
    });

    console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
  } catch (err) {
    console.log(err)
    throw new AppError(httpStatus.BAD_REQUEST, "Email Error")
  }
}

export default sendEmail
