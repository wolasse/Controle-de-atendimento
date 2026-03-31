
import { Component } from '@angular/core';
import { SenhaService } from '../core/services/senha.service';
import { Senha } from '../core/models/senha.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  guiches$ = this.senhaService.getGuiches$();
  ultimasChamadas$ = this.senhaService.getUltimasChamadas$();
  relatorio$ = { ...(this.senhaService as any).getRelatorio() };

  constructor(private senhaService: SenhaService) {}

  chamarProxima() {
    const senha = this.senhaService.chamarProximaSenha();
    if (senha) {
      alert(`Chamando: ${senha.numero} → Próximo guichê disponível!`);
    } else {
      alert('Nenhuma senha na fila!');
    }
  }
}