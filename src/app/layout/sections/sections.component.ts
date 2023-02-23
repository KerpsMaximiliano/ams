import { Component } from '@angular/core';
import { LayoutService } from 'src/app/core/services/layout.service';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss']
})
export class SectionsComponent {

  public navHidden:boolean = false;

  constructor(private layoutService: LayoutService) { }

  ngOnInit(): void {

    this.layoutService.navHidden.subscribe({
      next: () => this.navHidden = !this.navHidden
    });
  }

}
