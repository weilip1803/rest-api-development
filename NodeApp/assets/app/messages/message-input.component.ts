import {Component, OnInit} from "@angular/core";
import {NgForm} from "@angular/forms";

import {MessageService} from "./message.service";
import {Message} from "./message.model";

@Component({
    selector: 'app-message-input',
    templateUrl: './message-input.component.html'
})
export class MessageInputComponent implements OnInit {
    message: Message;

    constructor(private messageService: MessageService) {
    }

    onSubmit(form: NgForm) {
        // if (this.message) {
        //     // Edit
        //     this.message.text = form.value.text;
        //     this.messageService.updateMessage(this.message)
        //         .subscribe(
        //             result => console.log(result)
        //         );
        //     this.message = null;
        // } else {
        let formPublic = false;
        if (form.value.public) formPublic = true;
        console.log(formPublic);
        // Create
        const message = new Message(form.value.title, formPublic, form.value.text);
        this.messageService.addMessage(message)
            .subscribe(
                data => console.log(JSON.stringify(data)),
                error => console.error(error)
            );
        // }
        form.resetForm();
    }

    onClear(form: NgForm) {
        this.message = null;
        form.resetForm();
    }

    ngOnInit() {
        this.messageService.messageIsEdit.subscribe(
            (message: Message) => this.message = message
        );
    }
}