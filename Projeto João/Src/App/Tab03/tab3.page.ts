
import { Component } from '@angular/core';
import { SenhaService } from '../core/services/senha.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  relatorio: any;

  constructor(private senhaService: SenhaService) {
    this.relatorio = (this.senhaService as any).getRelatorio();
  }
}