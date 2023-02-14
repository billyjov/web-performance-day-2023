import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'app-observer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './observer.component.html',
  styleUrls: ['./observer.component.css'],
})
export class ObserverComponent implements OnInit {
  @ViewChild('observerChildContainer', { read: ViewContainerRef })
  private observerChildContainerRef!: ViewContainerRef;

  @ViewChild('observerChildWrapper', {
    read: ElementRef,
    static: true,
  })
  private observerChildContainerElementRef!: ElementRef;

  ngOnInit(): void {
    this.lazyRenderObserverChild();

  }

  private lazyRenderObserverChild(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        console.log('👀', entry);
        console.log('👀', entry.isIntersecting);

        if (entry.isIntersecting) {
          observer.disconnect();
          this.loadObserverChild();

          // Render CSS
          this.renderCss();
        }
      });
    });

    observer.observe(this.observerChildContainerElementRef.nativeElement);
  }

  private async loadObserverChild(): Promise<void> {
    const { ObserverChildComponent } = await import(
      '../observer-child/observer-child.component'
    );

    this.observerChildContainerRef.createComponent(ObserverChildComponent);
  }

  private renderCss(): void {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = '/assets/css/mobile.css';

    // LOAD EVERYTIME
    // document.head.appendChild(link);


    // LOAD ONLY ONCE
    // if (!document.head.querySelector(`link[href="${link.href}"]`)) {
    //   document.head.appendChild(link);
    // }
  }
}
