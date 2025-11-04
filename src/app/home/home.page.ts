import { Component, inject, OnInit, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface Fruta {
  id?: string;
  nome: string;
  preco: number;
  fornecedor: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage implements OnInit {
  private firestore: Firestore = inject(Firestore);
  
  frutas$: Observable<Fruta[]>;
  novaFruta = signal({
    nome: '',
    preco: 0,
    fornecedor: ''
  });
  
  editando = signal(false);
  frutaEditandoId = signal<string | null>(null);

  constructor() {
    const frutasCollection = collection(this.firestore, 'frutas');
    this.frutas$ = collectionData(frutasCollection, { idField: 'id' }) as Observable<Fruta[]>;
  }

  ngOnInit() {}

  async adicionarFruta() {
    if (this.novaFruta().nome.trim() === '') return;

    const frutasCollection = collection(this.firestore, 'frutas');
    
    try {
      await addDoc(frutasCollection, {
        nome: this.novaFruta().nome,
        preco: this.novaFruta().preco,
        fornecedor: this.novaFruta().fornecedor
      });
      
      this.limparFormulario();
    } catch (error) {
      console.error('Erro ao adicionar fruta:', error);
    }
  }

  async editarFruta(fruta: Fruta) {
    this.editando.set(true);
    this.frutaEditandoId.set(fruta.id!);
    this.novaFruta.set({
      nome: fruta.nome,
      preco: fruta.preco,
      fornecedor: fruta.fornecedor
    });
  }

  async atualizarFruta() {
    if (!this.frutaEditandoId()) return;

    const frutaDoc = doc(this.firestore, 'frutas', this.frutaEditandoId()!);
    
    try {
      await updateDoc(frutaDoc, {
        nome: this.novaFruta().nome,
        preco: this.novaFruta().preco,
        fornecedor: this.novaFruta().fornecedor
      });
      
      this.cancelarEdicao();
    } catch (error) {
      console.error('Erro ao atualizar fruta:', error);
    }
  }

  async excluirFruta(id: string) {
    const frutaDoc = doc(this.firestore, 'frutas', id);
    
    try {
      await deleteDoc(frutaDoc);
    } catch (error) {
      console.error('Erro ao excluir fruta:', error);
    }
  }

  cancelarEdicao() {
    this.editando.set(false);
    this.frutaEditandoId.set(null);
    this.limparFormulario();
  }

  private limparFormulario() {
    this.novaFruta.set({
      nome: '',
      preco: 0,
      fornecedor: ''
    });
  }
}