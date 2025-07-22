// pages/api/login.js

import { loginOMS } from "~/api/OMSService";
import { loginUser } from "~/api/userService";
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.MAGIC_LINK_SECRET_KEY; 
const decryptData = (encryptedData) => {
  try {
    const decodedData = Buffer.from(encryptedData, "base64").toString("utf8"); // Decode Base64
    const bytes = CryptoJS.AES.decrypt(decodedData, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Decryption error:", error.message);
    return null;
  }
};


const encryptData = (data) => {
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  return Buffer.from(encrypted).toString("base64"); // Use Base64 encoding
};

async function SAPLogin() {
  const sap_base_url = "https://boms.qistbazaar.pk/api/sapcontroller";
  const user = {
    UserName: "apiuser",
    Password:
      "6f791e2dea8805ec12bc4cfdd047810809e24e292432e520ac1ba2721f0dd0cd9GiSqCQb7OaZ3XdnQlbtAA==",
  };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1500);
  const response = await fetch(sap_base_url + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(user),
    signal: controller.signal,
  });
  clearTimeout(timeout);
  return response;
}
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {

      let { email, password, magicLink } = req.body;
 
      if (magicLink) {
        const decryptedData = decryptData(magicLink);
        if (decryptedData) {
          email = decryptedData.email;
          password = decryptedData.password;
        } else {
          return res.status(400).json({ error: "Invalid magic link" });
        }
      } else {
        const encrypted = encryptData({ email, password });
        console.log(`Generated Magic Link: /login?magic-login=${encrypted}`);
      }
      //here check for email if it includes email fromat make it email if it 
      const response = await loginUser(email,password);
 
      if(response.status === 200 || response?.data){
        const { token, fullName, roleID,  } = response?.data;
        const responseOMS = await loginOMS("arif", "qB(*&^%2aAi42907");
        const omsToken = responseOMS?.data?.token;
        let tokenF;
        try {
          const sapLogin = await SAPLogin();
          if (!sapLogin.ok) {}
          const sapResponse = await sapLogin.json();
          tokenF = sapResponse?.data?.access_token;
          console.log(
            "response?.data:",

            response?.data
          );
        } catch (e) {}

       
        res.status(200).json({
          token,
          fullName,
          roleID,
          omsToken,
          loginAttempt: response?.data?.loginAttempt,
          fdetail: response?.data?.financialDetail,
          tokenF,
        });
      }else{
        res.status(response?.status || 500).json({ error: response.message });
      }
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
