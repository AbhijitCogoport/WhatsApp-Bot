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

//   console.log("user data" ,JSON.stringify(body_param,null,2));

  if (body_param?.object) {
    // console.log("inside body param");
    if (
      body_param.entry &&
      body_param.entry[0]?.changes &&
      body_param.entry[0]?.changes[0]?.value.messages
    ) {
    //   console.log("deep layer");
      let phon_no_id =body_param.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body_param.entry[0].changes[0].value.messages[0].from;
      let msg_id=body_param.entry[0].changes[0].value.messages[0].id;
      let reply_type= body_param.entry[0].changes[0].value.messages[0].type;
      if(reply_type==='text'){
        // this is for wellcome message 
        let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;
        msg_body=msg_body.toLowerCase();
        if (msg_body === "hi" || msg_body === "hello" || msg_body.includes("hi") || msg_body.includes("hello")){
        axios({
          method: "POST",
          url:"https://graph.facebook.com/v13.0/" +phon_no_id +"/messages?access_token=" +token,
            data: {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: from,
                "type": "interactive",
                "interactive": {
                    "type": "button",
                    "body": {
                        "text": "WelCome To CogoportBot ,Our aim to Simplify your logistics and shipments by booking FCL containers, LCL, Air cargo and customs clearance services online. Track your shipments end to end. Are you insterested about the products ?"
                    },
                    "action": {
                        "buttons": [
                            {
                                "type": "reply",
                                "reply": {
                                    "id": "yes_well",
                                    "title": "Yes"
                                }
                            },
                            {
                                "type": "reply",
                                "reply": {
                                    "id": "no_well",
                                    "title": "No"
                                }
                            }
                        ]
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
                to: from,
                type: "text",
                "text": {
                    "preview_url": false,
                    "body": "i am not able to understand. "+msg_body
                }
            },
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
      }
      if(reply_type==='interactive'){

        let msg_btn = body_param.entry[0].changes[0].value.messages[0].interactive.type;
        if(msg_btn==="button_reply"){
            let msg_btn_id= body_param.entry[0].changes[0].value.messages[0].interactive.button_reply.id;
            // console.log(body_param.entry[0].changes[0].value.messages);
            if(msg_btn_id==="yes_well"){
                axios({
                    method: "POST",
                    url: "https://graph.facebook.com/v13.0/" +phon_no_id +"/messages?access_token=" +token,
                    data: {
                        messaging_product: "whatsapp",
                        recipient_type: "individual",
                        to: from,
                        context: {
                            "message_id": msg_id
                        },
                        type: "interactive",
                        "interactive": {
                            "type": "list",
                            "header": {
                                "type": "text",
                                "text": "CogoportBot"
                            },
                            "body": {
                                "text": " Some text for ................"
                            },
                            "footer": {
                                "text": "Menu"
                            },
                            "action": {
                                "button": "Menu",
                                "sections": [
                                    {
                                        "title": "Products",
                                        "rows": [
                                            {
                                                "id": "search-freight_rates",
                                                "title": "Search Freight Rates",
                                                "description": "Freight charges & air cargo prices at your finger tips"    
                                            },
                                            {
                                                "id": "book_shipping_containers",
                                                "title": "Book Shipping Containers",
                                                "description": "Booking Shipping Containers Now"
                                            },
                                            {
                                                "id": "book_air_shipments",
                                                "title": "Book Air Shipments",
                                                "description": "Booking Air Shipment Now"
                                            },
                                            {
                                                "id": "track_containers",
                                                "title": "Track Containers",
                                                "description": "Track Containers Now"
                                            }
                                        ]
                                    },
                                    {
                                        "title": "Services",
                                        "rows": [
                                            {
                                                "id": "fcl_freight",
                                                "title": "FCL Freight",
                                                "description": "Talk to an FCL Expert"
                                            },
                                            {
                                                "id": "lcl_freight",
                                                "title": "LCL Freight",
                                                "description": "Talk to an LCL Expert"
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    },

                    headers: {
                      "Content-Type": "application/json",
                    },
                });

            }
            if(msg_btn_id==="no_well"){
                axios({
                    method: "POST",
                    url: "https://graph.facebook.com/v13.0/" +phon_no_id +"/messages?access_token=" +token,
                    data: {
                        messaging_product: "whatsapp",
                        recipient_type: "individual",
                        to: from,
                        context: {
                            "message_id": msg_id
                        },
                        type: "text",
                        "text": {
                            "preview_url": false,
                            "body": " sorry for distrubing .if you insterested about the com. say here Hi. "  
                        }
                    },
                    headers: {
                      "Content-Type": "application/json",
                    },
                });
            } 
        }
        if(msg_btn==="list_reply") {
            console.log(JSON.stringify(body_param.entry[0].changes[0].value.messages,null,2));
        }
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
