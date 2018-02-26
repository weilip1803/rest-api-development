import { Component, Input } from "@angular/core";
import {MessageService} from "../message.service";
import {Message} from "../message.model";


@Component({
    selector: 'app-my-message',
    templateUrl: './my-message.component.html',
    styles: [`
        .author {
            display: inline-block;
            font-style: italic;
            font-size: 12px;
            width: 80%;
        }
        .config {
            display: inline-block;
            text-align: right;
            font-size: 12px;
            width: 19%;
        }
    `]
})
export class MyMessageComponent {

    @Input() message: Message;
    constructor(private messageService: MessageService) {
        console.log(this.message);
    }

    onEdit() {
        this.messageService.editMessage(this.message);
    }

    onDelete() {
        console.log(this.message);
        this.messageService.deleteMessage(this.message)
            .subscribe(
                result => console.log(result)
            );
    }
    test(message){
        console.log(message);
    }
    updatePermission(message : Message){
        // console.log("SE ME");
        this.messageService.updatePermission(message).subscribe();

    }

}