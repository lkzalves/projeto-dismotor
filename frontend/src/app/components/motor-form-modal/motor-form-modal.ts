import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MotorService } from '../../services/motor';
import { MotorInterface } from '../../interfaces/motor-interface';
import { FabricanteInterface } from '../../interfaces/fabricante';

@Component({
  selector: 'app-motor-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './motor-form-modal.html',
  styleUrl: './motor-form-modal.css',
})
export class MotorFormModal implements OnInit {
  private fb = inject(FormBuilder);
  private motorService = inject(MotorService);

  @Input() motorParaEditar: MotorInterface | null = null;

  @Output() aoFechar = new EventEmitter<void>();
  @Output() aoSalvarSucesso = new EventEmitter<void>();

  salvando: boolean = false;
  mensagemErro: string = '';
  carregandoFabricantes: boolean = false;
  fabricantes: FabricanteInterface[] = [];

  motorForm: FormGroup = this.fb.group({
    codigo: ['', [Validators.required, Validators.maxLength(30)]],
    modelo: ['', [Validators.required, Validators.maxLength(80)]],
    fabricante_id: [null, [Validators.required]],
    potencia_cv: [null, [Validators.required, Validators.min(0.01)]],
    tensao: ['', [Validators.required]],
    frequencia_hz: [60, [Validators.required, Validators.pattern(/^(50|60)$/)]],
    polos: [4, [Validators.required, Validators.pattern(/^(2|4|6|8)$/)]],
    rotacao_rpm: [null, [Validators.required, Validators.min(1)]],
    carcaca: [''],
    grau_protecao: [''],
    preco: [null, [Validators.min(0)]],
  });

  ngOnInit(): void {
    this.carregarFabricantes();
    if (this.motorParaEditar) {
      this.motorForm.patchValue(this.motorParaEditar);
    }
  }

  fecharModal(): void {
    this.aoFechar.emit();
  }

  salvarMotor(): void {
    if (this.motorForm.invalid) {
      console.log('Formulário inválido! Campos com erro:');
      Object.keys(this.motorForm.controls).forEach((campo) => {
        const controle = this.motorForm.get(campo);
        if (controle?.invalid) {
          console.log(`- Campo "${campo}":`, controle.errors);
        }
      });
      this.motorForm.markAllAsTouched();
      return;
    }

    this.salvando = true;
    this.mensagemErro = '';

    const dadosMotor: MotorInterface = this.motorForm.value;

    if (this.motorParaEditar && this.motorParaEditar.id) {
      this.motorService.updateMotor(this.motorParaEditar.id, dadosMotor).subscribe({
        next: () => {
          this.salvando = false;
          this.aoSalvarSucesso.emit();
        },
        error: (err) => this.tratarErro(err),
      });
    } else {
      this.motorService.createMotor(dadosMotor).subscribe({
        next: () => {
          this.salvando = false;
          this.aoSalvarSucesso.emit();
        },
        error: (err) => this.tratarErro(err),
      });
    }
  }

  private tratarErro(err: any): void {
    this.salvando = false;
    if (err.error && err.error.error) {
      const detalhes = err.error.details ? `: ${err.error.details.join(', ')}` : '';
      this.mensagemErro = `${err.error.error}${detalhes}`;
    } else {
      this.mensagemErro = 'Ocorreu um erro ao salvar o motor. Tente novamente.';
    }
  }

  carregarFabricantes(): void {
    this.carregandoFabricantes = true;
    this.motorService.getFabricantes().subscribe({
      next: (dados) => {
        this.fabricantes = dados;
        this.carregandoFabricantes = false;
      },
      error: (err) => {
        console.error('Erro ao carregar fabricantes:', err);
        this.carregandoFabricantes = false;
      },
    });
  }
}
