import { Input, Output, EventEmitter, ElementRef, Renderer2, HostListener, Directive } from '@angular/core';

function setProperty(renderer: Renderer2, elementRef: ElementRef, propName: string, propValue: string) {
    renderer.setProperty(elementRef, propName, propValue);
}

@Directive({selector:'[NgTableFiltering]'})
export class NgTableFilteringDirective {
    @Input() public ngTableFiltering: any = {
        filterString: '',
        columnName: 'name'
    };

    @Output() public tableChanged: EventEmitter<any> = new EventEmitter();

    @Input()
    public get config(): any {
        return this.ngTableFiltering;
    }

    public set config(value: any) {
        this.ngTableFiltering = value;
    }

    private element: ElementRef;
    private renderer: Renderer2;

    @HostListener('input', ['$event.target.value'])
    public onChangeFilter(event: any): void {
        this.ngTableFiltering.filterString = event;
        this.tableChanged.emit({ filtering: this.ngTableFiltering });
    }

    public constructor(element: ElementRef, renderer: Renderer2) {
        this.element = element;
        this.renderer = renderer;
        // Set default value for filter
        setProperty(this.renderer, this.element, 'value', this.ngTableFiltering.filterString);
    }
}
  //24-Page Complete
