import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { AuthService } from "./auth.service";
import { User } from "./user.model";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
    myForm: FormGroup;

    constructor(private authService: AuthService) {
        console.log("started");
    }

    onSubmit() {
        console.log("cdcacsdjnajk");
        console.log("alods lol");
        const user = new User(
            this.myForm.value.username,
            this.myForm.value.password,
            this.myForm.value.fullname,
            this.myForm.value.age
        );
        console.log("alods lvol");
        this.authService.signup(user)
            .subscribe(
                data => console.log(data),
                error => console.error(error)
            );
        this.myForm.reset();
    }

    ngOnInit() {
        this.myForm = new FormGroup({
            fullname: new FormControl(null, Validators.required),
            age: new FormControl(null, Validators.required),
            username: new FormControl(null, Validators.required),
            // email: new FormControl(null, [
            //     Validators.required,
            //     Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
            // ]),
            password: new FormControl(null, Validators.required)
        });
    }
}