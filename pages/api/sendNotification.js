import fetch from "node-fetch";
import { JWT } from "google-auth-library";

const SERVICE_ACCOUNT_KEY = {
  type: "service_account",
  project_id: "qist-bazaar-mobile-app",
  private_key_id: "51e61a6a869cf1280b1dc23728259c6f8938ca53",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC6BrWpoExDpsvQ\nwyNC5XidRxaJZFVzZwvFnWA8jnfUO1b3ykxDnf8IyvFI2HVpJt54Vdfh+jNpgfwP\nkoRG2UpFEnYeDg8UuhoQswFj1eajQQQBi2h6uCVdPWV7M4fjD0ldCoox4C5pviWM\nwsEfY1IiBzeIgwpolB7AuPZPTJNImpW0WuDpgW8qzj7uT+ipYNytuq1NzdOw7uYz\nGp13cet19twQ4hkSK0I+DFsPB8hb4PrHPhLdhhZWXMYTSOTbJAL4JWfhqjh4x4kV\ndW5LdHD9hT4+cCqH6hD84uLe0cmffXmQVkRy5iaf6WyWkdhUx7vFvamqvAlnFVhv\n4wotZxRzAgMBAAECggEAQitjz+fwaLn6UpIuxztXiV5BcnKJgKidQ9gkZLXqgsfu\nueov8XdQQcDqTZaNQO9t/9DNHxj/055EWgesXIUrCWG1OSCYFa/S2LDLpEbwKI7W\nTXRYoBpDVCSkJcwhIE+OMXWvzWjoKX3U3nph9ne+PdNiWgD+oU9alwPTvUZIN3EF\njIlZjIdBOvtXiO4dUJO5S+F4K6VpfiTsdcN0QrnuEeQau98mfERSR8+5ujXCqIG7\n2bUQzeuasaU+qq4+Gsy3A3V+4mMrZ0E+hP41Xm2OkBXPeVAs0Iqk27UhN++c2wAO\npqyn8/k6vvp99Dd8yVdX4RW/DBGV2v834jBU3/VxVQKBgQDpECVgZYkZmG8l45lW\nP/iW3LfnDL3W3VQwNeEOhU7QwvrakZiKwm1uwGXtY3AWci9xCz4IOc+CdKYI4ZMe\nhR1O9kpJxUKZUQox2Tk5sb/HrZ6UsS98Of7zgxyeDIbMzKCoWkYcmJKxRIwubAVY\nGWRnEno8hRsYsGrk2F5C+G+EBQKBgQDMVYEVKOJsRLJ0SpTEfeB1N8ODhcYpXL1C\nGOCxtNoEjnfjmvOWUtRZXgihwdjcol5XmoHDR9G9WfKbnOoZdMKt1WhKBcgonpqd\nFPIUmo1Xa4QSyyem9Intm6oGUugxZyCk4YiXM02ivfMqcj5YFbKHSzMKSq3y7lH+\nxmcWombYFwKBgESTBpxVY8CPNGzuichx7B/fc5DdE+JrnwDMaZrPKICOTicPXdW+\nHVrP622sq2c/U6wsRaU/9UmKLuxACvyY6CW6m+MW0mCwEpLWOls6bJZBBH71n2Yq\n3lQiCMKMJwGNV9wRK73wOoFEDQb/q5bfacZWDndOJsnd5qXM7/c+h/lNAoGBAMT1\n1otS8Y5zWaEHEwekXmwe6HMqy6yrHDNOT6h8L3sc6SuX/Rz1koLiRWfGtwdV66J9\n6H8YB3CB931Qb8dB6TYu82wGzr14xIiN3BtILt4JYTHMadhg92L2HZoi6HZWdfz4\n+PTmGvu4JWDQ5o95urD3J6fP/ISifJ8dF9mViZTZAoGAC3o4mw4HwVECKY6pnIXj\nGWFIPCzv1a5uszUg4v2ydArvKf3U4tdDqhBTc7Da9a5G3LayrIH9dBU+q9M/1CUo\n40uh1VmAM0jZx4Sv7Cf7hOpwguCnhSnhkCMBbFOj1uWNC4gRsry+uJkJktpYziKa\nOi5yAYjFbcFckgFA8jlgL7k=\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-5op1e@qist-bazaar-mobile-app.iam.gserviceaccount.com",
  client_id: "106448271308975580101",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-5op1e%40qist-bazaar-mobile-app.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

const SCOPES = ["https://www.googleapis.com/auth/firebase.messaging"]; // Scope for FCM

async function getAccessToken() {
  const jwtClient = new JWT(
    SERVICE_ACCOUNT_KEY.client_email,
    null,
    SERVICE_ACCOUNT_KEY.private_key,
    SCOPES
  );
  const tokens = await jwtClient.authorize();
  return tokens.access_token;
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { to, notification, data} = req.body;

    try {
      // Fetch the access token
      const accessToken = await getAccessToken();
      console.log(
        "accessToken",
        accessToken,
        `https://fcm.googleapis.com/v1/projects/${process.env.FIREBASE_PROJECT_ID}/messages:send`
      );


      // Send the push notification
      console.log(to, notification, data);
      const response = await fetch(
        `https://fcm.googleapis.com/v1/projects/${process.env.FIREBASE_PROJECT_ID}/messages:send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            message: {
              topic: to,
              notification, // Notification details
              data, // Optional custom data
            },
          }),
        }
      );

      // Handle the response
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error sending notification: ${error}`);
      }

      const responseData = await response.json();
      res.status(200).json(responseData);
    } catch (error) {
      console.error("Error sending notification:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
