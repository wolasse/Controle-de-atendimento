// src/app/core/services/senha.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Senha, Guiche } from '../models/senha.model';

@Injectable({
  providedIn: 'root'
})
export class SenhaService {
  private senhasSP = new BehaviorSubject<Senha[]>([]);
  private senhasSG = new BehaviorSubject<Senha[]>([]);
  private senhasSE = new BehaviorSubject<Senha[]>([]);
  private guiches = new BehaviorSubject<Guiche[]>([
    { id: 1, nome: 'Guichê 1', ocupado: false },
    { id: 2, nome: 'Guichê 2', ocupado: false },
    { id: 3, nome: 'Guichê 3', ocupado: false }
  ]);
  private ultimasChamadas = new BehaviorSubject<Senha[]>([]);
  private sequencia = { SP: 1, SG: 1, SE: 1 };

  constructor() {
    this.simularEmissoes();
  }

  getSenhasSP$(): Observable<Senha[]> { return this.senhasSP.asObservable(); }
  getSenhasSG$(): Observable<Senha[]> { return this.senhasSG.asObservable(); }
  getSenhasSE$(): Observable<Senha[]> { return this.senhasSE.asObservable(); }
  getGuiches$(): Observable<Guiche[]> { return this.guishes.asObservable(); }
  getUltimasChamadas$(): Observable<Senha[]> { return this.ultimasChamadas.asObservable(); }

  emitirSenha(tipo: 'SP' | 'SG' | 'SE'): Senha {
    const hoje = new Date();
    const data = hoje.toISOString().slice(2, 10).replace(/-/g, '');
    const numero = `${data}-${tipo}${this.sequencia[tipo].toString().padStart(2, '0')}`;
    
    const senha: Senha = {
      numero,
      tipo,
      dataEmissao: new Date().toISOString(),
      atendida: false
    };

    // Adiciona 5% chance de não ser atendida
    if (Math.random() < 0.05) {
      senha.atendida = false;
      this.descartarSenha(senha);
      return senha;
    }

    // Adiciona na fila correta
    switch (tipo) {
      case 'SP': this.senhasSP.value.push(senha); break;
      case 'SG': this.senhasSG.value.push(senha); break;
      case 'SE': this.senhasSE.value.push(senha); break;
    }
    this.sequencia[tipo]++;

    this.senhasSP.next([...this.senhasSP.value]);
    this.senhasSG.next([...this.senhasSG.value]);
    this.senhasSE.next([...this.senhasSE.value]);

    return senha;
  }

  chamarProximaSenha(): Senha | null {
    const guicheLivre = this.guishes.value.find(g => !g.ocupado);
    if (!guicheLivre) return null;

    let proximaSenha: Senha | null = null;

    // Prioridade: SP > SE > SG
    if (this.senhasSP.value.length > 0) {
      proximaSenha = this.senhasSP.value[0];
      this.senhasSP.next(this.senhasSP.value.slice(1));
    } else if (this.senhasSE.value.length > 0) {
      proximaSenha = this.senhasSE.value[0];
      this.senhasSE.next(this.senhasSE.value.slice(1));
    } else if (this.senhasSG.value.length > 0) {
      proximaSenha = this.senhasSG.value[0];
      this.senhasSG.next(this.senhasSG.value.slice(1));
    }

    if (proximaSenha) {
      this.atribuirGuiche(proximaSenha, guicheLivre);
      this.ultimasChamadas.next([proximaSenha, ...this.ultimasChamadas.value.slice(0, 4)]);
    }

    return proximaSenha;
  }

  private atribuirGuiche(senha: Senha, guiche: Guiche) {
    const tm = this.calcularTempoMedio(senha.tipo);
    const tempoFim = Date.now() + (tm + (Math.random() - 0.5) * 10) * 60000;

    guiche.ocupado = true;
    guiche.senhaAtual = senha;
    guiche.tempoFim = tempoFim;
    senha.dataAtendimento = new Date().toISOString();
    senha.guiche = guiche.nome;
    senha.tempoAtendimento = tm;
    senha.atendida = true;

    this.guishes.next([...this.guishes.value]);
    
    // Simula fim do atendimento
    setTimeout(() => {
      guiche.ocupado = false;
      guiche.senhaAtual = undefined;
      guiche.tempoFim = undefined;
      this.guishes.next([...this.guishes.value]);
    }, (tm * 60000));
  }

  private calcularTempoMedio(tipo: 'SP' | 'SG' | 'SE'): number {
    switch (tipo) {
      case 'SP': return 15 + (Math.random() - 0.5) * 10; // 15 ± 5 min
      case 'SG': return 5 + (Math.random() - 0.5) * 2;   // 5 ± 1 min
      case 'SE': 
        return Math.random() < 0.95 ? 1 : 5;             // 1 min (95%) ou 5 min (5%)
      default: return 5;
    }
  }

  private descartarSenha(senha: Senha) {
    console.log(`Senha ${senha.numero} descartada automaticamente`);
  }

  private simularEmissoes() {
    setInterval(() => {
      const tipos = ['SP', 'SG', 'SE'] as const;
      const tipoAleatorio = tipos[Math.floor(Math.random() * tipos.length)];
      this.emitirSenha(tipoAleatorio);
    }, 10000); // 1 senha a cada 10s
  }

  getRelatorio(): any {
    const todasSenhas = [
      ...this.senhasSP.value,
      ...this.senhasSG.value,
      ...this.senhasSE.value
    ];
    return {
      totalEmitidas: todasSenhas.length,
      totalAtendidas: todasSenhas.filter(s => s.atendida).length,
      porTipo: {
        SP: { emitidas: this.senhasSP.value.length, atendidas: this.senhasSP.value.filter(s => s.atendida).length },
        SG: { emitidas: this.senhasSG.value.length, atendidas: this.senhasSG.value.filter(s => s.atendida).length },
        SE: { emitidas: this.senhasSE.value.length, atendidas: this.senhasSE.value.filter(s => s.atendida).length }
      }
    };
  }
}