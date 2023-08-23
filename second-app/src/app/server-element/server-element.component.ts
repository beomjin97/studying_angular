import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ContentChild,
  DoCheck,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-server-element',
  templateUrl: './server-element.component.html',
  styleUrls: ['./server-element.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ServerElementComponent
  implements
    OnInit,
    OnChanges,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy
{
  @Input('srvElement') element: { type: string; name: string; content: string };
  @Input() name: string;
  @ViewChild('heading', { static: true }) heading: ElementRef;
  @ContentChild('contentParagraph') paragraph: ElementRef;

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes');
    console.log(changes);
  }

  ngOnInit(): void {
    console.log('init');
    console.log(`text content: ${this.heading.nativeElement.textContent}`);
    console.log(
      `text content of paragraph: ${this.paragraph.nativeElement.textContent}`
    );
  }

  ngDoCheck(): void {
    console.log('do check');
  }

  ngAfterContentInit(): void {
    console.log('after content init');
    console.log(
      `text content of paragraph: ${this.paragraph.nativeElement.textContent}`
    );
  }

  ngAfterContentChecked(): void {
    console.log('after content checked');
  }

  ngAfterViewInit(): void {
    console.log('ater view init');
    console.log(`text content: ${this.heading.nativeElement.textContent}`);
  }

  ngAfterViewChecked(): void {
    console.log('ater view checked');
  }

  ngOnDestroy(): void {
    console.log('destroy');
  }
}
