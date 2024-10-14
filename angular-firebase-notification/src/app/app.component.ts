import { Component, OnInit } from '@angular/core';
import { environment } from "../environments/environment";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Angular Firebase Notification';
  message:any = null;
  constructor() {}
  ngOnInit(): void {
    this.requestPermission();
    this.listen();
  }
  requestPermission() {

    const messaging = getMessaging();

    getToken(messaging, { vapidKey: environment.firebaseConfig.vapidKey }).then((currentToken) => {
      if (currentToken) {
        console.log("Notification Token: ")
        console.log(currentToken);
      } else {
        console.log('No token available. Generate Token first!');
      }
    }).catch((err) => {
      console.log('An error occurred while generating token. ', err);
    });

  }
  
  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      this.message=payload;
    });
  }
}