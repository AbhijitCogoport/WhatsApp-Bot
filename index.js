const express = require("express");
const body_parser = require("body-parser");

const axios = require("axios");
require("dotenv").config();
// const WhatsappCloudAPI = require('whatsappcloudapi_wrapper');

const app = express().use(body_parser.json());

const token = process.env.TOKEN;
const mytoken = process.env.MYTOKEN; //prasath_token
// const Whatsapp = new WhatsappCloudAPI({
//     accessToken: 'EAAQ9Mp7CZCi4BAEBbAz6ZBlPSad0uGMFrZByTiZC9ZBQsZAX2ZCqFdj9ppQOJ71nOZBrUOrGZBFDxNvk5YMtQVUQOkijpKiZAN0LwO4DB5473BHZCos67xH372yZCPOXzMj3TZBmkYjCc9DlH6SFPgZAlN1XvzgkIAEcZC32wB3pZAIfHoRy4veRTDVhNNsNRkEMcUFVlbE07xaBzFTOZAQZDZD',
//     senderPhoneNumberId: '106849635477090',
//     WABA_ID: '103555699146921',
// });

app.listen(process.env.PORT, () => {
  console.log("webhook is listening");
});

//to verify the callback url from dashboard side - cloud api side
app.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let challange = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];

  console.log("mode:", mode, "ch:", challange, "token:", token);
  if (mode && token) {
    if (mode === "subscribe" && token === mytoken) {
      res.status(200).send(challange);
    } else {
      res.status(403);
    }
  }
});

app.post("/webhook", (req, res) => {
  //i want some

  let body_param = req.body;

  //console.log("out side working " ,JSON.stringify(body_param,null,2));

  if (body_param?.object) {
    console.log("inside body param");
    if (
      body_param?.entry &&
      body_param.entry[0].changes &&
      body_param.entry[0].changes[0].value.messages
    ) {
      console.log("deep layer");
      let phon_no_id =
        body_param.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body_param.entry[0].changes[0].value.messages[0].from;
      let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

      console.log("phone number " + phon_no_id);
      console.log("from " + from);
      console.log("boady param " + msg_body);
      msg_body=msg_body.toLowerCase();
      if (msg_body === "hi" || msg_body === "hello" || msg_body.includes("hi") || msg_body.includes("hello")){
        axios({
          method: "POST",
          url:
            "https://graph.facebook.com/v13.0/" +
            phon_no_id +
            "/messages?access_token=" +
            token,
          data: {
            messaging_product: "whatsapp",
            to: from,
            type: "template",
            "template": {
                "name": "hello_world",
                "language": {
                    "code": "en_US"
                }
            }
          },
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      else{
        axios({
            method: "POST",
            url: "https://graph.facebook.com/v13.0/" +phon_no_id +"/messages?access_token=" +token,
            data: {
              messaging_product: "whatsapp",
              recipient_type: "individual",
              to: from,
              type: "template",
              template: {
                  name: "wellcome_cogo",
                  language: {
                      code: "en_US"
                  },
                  components: [
                      {
                          type: "header",
                          parameters: [
                              {
                                  type: "image",
                                  image: {
                                      link: "https://assets-global.website-files.com/5e557f57e065e822f0adb45d/5f0c0b23f9fd064b3d30fd5b_cogoport-logo-black.svg"
                                  }
                              }
                          ],
                      },
                      {
                          type: "body",
                          parameters: [
  
                              {
                                  type: "text",
                                  text: " Wellcome to Cogoport,we help importers and exporters grow their businesses internationally by making trade simpler, effortless and affordable using technology"
                              },
                              
                          ],
                          
                      }
                  ]
              }
            },
            headers: {
              "Content-Type": "application/json",
            },
          });
      }

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
});

app.get("/", (req, res) => {
  res.status(200).send("hello this is webhook setup");
});
