import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { User } from "./user.model";
import { AuthService } from "./auth.service";

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html'
})
export class SigninComponent {
    myForm: FormGroup;

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit() {
        const user = new User(this.myForm.value.username, this.myForm.value.password);
        this.authService.signin(user)
            .subscribe(
                data => {
                    if(data.status == false){
                        console.log("Log in Fai led");
                        return;
                    }

                    localStorage.setItem('token', data.token);
                    // localStorage.setItem('userId', data.userId);
                    console.log("asd");
                    this.authService.getInfo().subscribe();
                    this.router.navigateByUrl('/');
                },
                error => console.error(error)
            );

        this.myForm.reset();
    }

    ngOnInit() {
        this.myForm = new FormGroup({
            username: new FormControl(null, Validators.required),
            password: new FormControl(null, Validators.required)
        });
    }
}