
import { Component } from '@angular/core';
import { SenhaService } from '../core/services/senha.service';
import { Senha } from '../core/models/senha.model';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  senhasSP$ = this.senhaService.getSenhasSP$();
  senhasSG$ = this.senhaService.getSenhasSG$();
  senhasSE$ = this.senhaService.getSenhasSE$();

  constructor(private senhaService: SenhaService) {}

  emitirSenha(tipo: 'SP' | 'SG' | 'SE') {
    const senha = this.senhaService.emitirSenha(tipo);
    alert(`Senha emitida: ${senha.numero}`);
  }
}