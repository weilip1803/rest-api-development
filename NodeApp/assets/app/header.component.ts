import { Component } from "@angular/core";

@Component({
    selector: 'app-header',
	styleUrls: ['./header.components.css'],
    template: `
		<div class="container">
        <header class="row">
            <nav class="col-md-8 col-md-offset-2">
                <ul class="nav nav-pills">
                    <li routerLinkActive="active"><a [routerLink]="['/messages']">Public Diaries</a></li>
                    <li routerLinkActive="active"><a [routerLink]="['/mymessages']">My Diaries</a></li>
                    <li routerLinkActive="active"><a [routerLink]="['/auth']">Authentication</a></li>
                </ul>
            </nav>
        </header>
		</div>
    `
})
export class HeaderComponent {

}