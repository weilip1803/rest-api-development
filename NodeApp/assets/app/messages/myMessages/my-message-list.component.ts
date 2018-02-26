import { Component, OnInit } from "@angular/core";
import {Message} from "../message.model";
import {MessageService} from "../message.service";


@Component({
    selector: 'app-my-message-list',
    template: `
        <div class="col-md-8 col-md-offset-2">
            <app-my-message
                   [message]="message"
                    *ngFor="let message of messages"></app-my-message>
        </div>
    `
})
export class MyMessageListComponent implements OnInit {
    messages: Message[];

    constructor(private messageService: MessageService) {}

    ngOnInit() {
        this.messageService.getMyMessages()
            .subscribe(
                (messages: Message[]) => {
                    this.messages = messages;
                }
            );
        this.messageService.refreshMyMessage.subscribe((data: Message[])=>{
            this.messages = data;
        });
    }
}
//