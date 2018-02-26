import {Http, Response, Headers} from "@angular/http";
import {Injectable, EventEmitter} from "@angular/core";
import 'rxjs/Rx';
import {Observable} from "rxjs";

import {Message} from "./message.model";

@Injectable()
export class MessageService {
    private messages: Message[] = [];
    messageIsEdit = new EventEmitter<Message>();
    refreshMessage = new EventEmitter<Message[]>();
    refreshMyMessage = new EventEmitter<Message[]>();
    constructor(private http: Http) {
    }

    addMessage(message: Message) {
        message["token"] = localStorage.getItem('token');
        const body = JSON.stringify(message);
        const headers = new Headers({'Content-Type': 'application/json'});
        console.log(body);

        // const token = localStorage.getItem('token')
        //     ? '?token=' + localStorage.getItem('token')
        //     : '';
        return this.http.post('http://localhost:8080/diary/create', body, {headers: headers})
            .map((response: Response) => {
                const result = response.json();
                if (result.status == true) {
                    //Refresh the page with new data
                    this.getMessages().subscribe((data)=>{
                        this.refreshMessage.next(data);
                    });
                    return message;
                } else {
                }
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    getMessages() {
        //asd
        return this.http.get('http://localhost:8080/diary')
            .map((response: Response) => {
                // console.log(response.json());
                const messages = response.json().result;
                let transformedMessages: Message[] = [];
                for (let message of messages) {
                    let msg = new Message();
                    msg.text = message.text;
                    msg.title = message.title;
                    msg.author = message.author;
                    msg.publish_date = message.publish_date;
                    msg.public = message.public;
                    msg.id = message.id;
                    transformedMessages.push(msg);
                }
                this.messages = transformedMessages;
                return transformedMessages;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }
////
    getMyMessages() {
        const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token')
            ? localStorage.getItem('token')
            : '';
        const body = {"token": token};

        return this.http.post('http://localhost:8080/diary', body, {headers: headers})
            .map((response: Response) => {
                // console.log(response.json());
                const messages = response.json().result;
                let transformedMessages: Message[] = [];
                for (let message of messages) {
                    let msg = new Message();
                    msg.text = message.text;
                    msg.title = message.title;
                    msg.author = message.author;
                    msg.publish_date = message.publish_date;
                    msg.public = message.public;
                    msg.id = message.id;
                    transformedMessages.push(msg);
                }
                this.messages = transformedMessages;
                return transformedMessages;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }


    editMessage(message: Message) {
        this.messageIsEdit.emit(message);
    }

    // updateMessage(message: Message) {
    //     const body = JSON.stringify(message);
    //     const headers = new Headers({'Content-Type': 'application/json'});
    //     const token = localStorage.getItem('token')
    //         ? '?token=' + localStorage.getItem('token')
    //         : '';
    //     return this.http.patch('http://localhost:8080/diary/', body, {headers: headers})
    //         .map((response: Response) => response.json())
    //         .catch((error: Response) => Observable.throw(error.json()));
    // }
    updatePermission(message : Message){
        const body = {
            "token": localStorage.getItem('token'),
            "id": message.id,
            "private": message.public
        };
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:8080/diary/permission', body, {headers: headers})
            .map((response: Response) => {
                console.log("Update Permission Response:" + response);
                this.getMyMessages().subscribe((data)=>{
                    this.refreshMyMessage.next(data);
                });
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }


    deleteMessage(message: Message) {
        const body = {
                "token": localStorage.getItem('token'),
                "id": message.id};
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:8080/diary/delete', body, {headers: headers})
            .map((response: Response) => {
                if (response.json().status == true) {
                    this.messages.splice(this.messages.indexOf(message), 1);
                }
                this.getMyMessages().subscribe((data)=>{
                    this.refreshMyMessage.next(data);
                });
                response.json();
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }
}