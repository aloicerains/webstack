import { Component, OnInit } from '@angular/core';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  faLinkedin = faLinkedin;
  github = faGithub;
  date = new Date().getFullYear();
  constructor() { }

  ngOnInit(): void {

  }

}
