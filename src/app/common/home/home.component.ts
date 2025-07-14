import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Utils } from 'src/app/utils/utils';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true
})
export class HomeComponent implements OnInit {

  public slideIndex: number = 1;

  constructor(public utils: Utils, private router: Router) { }

  ngOnInit(): void {
    //It forces the first image will be shown when page starts
    var slides = document.getElementsByClassName("mySlides") as HTMLCollectionOf<HTMLDivElement>;
    var dots = document.getElementsByClassName("dot");
    slides[this.slideIndex-1].style.display = "block";  
    dots[this.slideIndex-1].className += " active";

    this.sliderTimer();
  } 

  sliderTimer() {  
    setTimeout (() => {
        this.showSlides();
      }, 3500);
 
  }

  showSlides(){
    var i;
    var slides = document.getElementsByClassName("mySlides") as HTMLCollectionOf<HTMLDivElement>;
    var dots = document.getElementsByClassName("dot");
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
    }
    this.slideIndex++;
    if (this.slideIndex > slides.length) {this.slideIndex = 1}    
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }

    if(slides[this.slideIndex-1]!=undefined){
      slides[this.slideIndex-1].style.display = "block";  
      dots[this.slideIndex-1].className += " active";
      this.sliderTimer();
    }

  }

  showSchedule(){
    if(!this.utils.isThereALoggedUser()) return;
    this.router.navigate(['reserve']);
  }

}
