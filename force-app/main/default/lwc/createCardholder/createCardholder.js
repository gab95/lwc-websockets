import { LightningElement } from "lwc";
import addCardholder from "@salesforce/apex/Cardholder.addCardholder";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class CreateCardholder extends LightningElement {
  name;
  cardId;

  inputForm = {};

  wsSocket;

  connectedCallback() {
    this.wsSocket = new WebSocket(
      "wss://backend-websocket-production.up.railway.app/api/idcard"
    );

    this.wsSocket.addEventListener("open", () => {
      console.log("connected to the websocket server");
    });

    this.wsSocket.addEventListener("message", (event) => {
      const payload = event.data;
      console.log("payload ------------- ", payload);
      this.cardId = payload;
      this.inputForm.cardId = payload
    });
  }

  handleChange(event) {
    this.inputForm[event.target.name] = event.target.value;
  }

  handleSubmit() {
    let cardholderSubmitForm = {
      name: this.inputForm.name,
      cardId: this.inputForm.cardId
    };
    addCardholder({
      name: cardholderSubmitForm.name,
      cardId: cardholderSubmitForm.cardId
    })
      .then((response) => {
        if (response) {
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Success",
              message: "Cardholder created successfully",
              variant: "success"
            })
          );
        } else {
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Error",
              message: "Something went wrong :(",
              variant: "Error"
            })
          );
        }

        this.template.querySelectorAll("lightning-input").forEach((element) => {
          element.value = null;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
