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
    tensao: ['', [Validators.required, Validators.maxLength(30)]],
    frequencia_hz: ['', [Validators.required, Validators.pattern(/^(50|60)$/)]],
    polos: ['', [Validators.required, Validators.pattern(/^(2|4|6|8)$/)]],
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
    // Se o formulário estiver inválido, descobre e lista os campos exatos com erro no alert
    if (this.motorForm.invalid) {
      this.motorForm.markAllAsTouched();

      const errosDetalhados: string[] = [];

      // Mapeamento de nomes técnicos para rótulos legíveis
      const nomesCampos: { [key: string]: string } = {
        codigo: 'Código',
        modelo: 'Modelo',
        fabricante_id: 'Fabricante',
        potencia_cv: 'Potência (CV)',
        tensao: 'Tensão',
        frequencia_hz: 'Frequência (Hz)',
        polos: 'Polos',
        rotacao_rpm: 'Rotação (RPM)',
        carcaca: 'Carcaça',
        grau_protecao: 'Grau de Proteção',
        preco: 'Preço',
      };

      Object.keys(this.motorForm.controls).forEach((nomeCampo) => {
        const controle = this.motorForm.get(nomeCampo);

        if (controle && controle.invalid) {
          const nomeExibicao = nomesCampos[nomeCampo] || nomeCampo;
          const detalhes: string[] = [];

          if (controle.errors?.['required']) {
            detalhes.push('preenchimento obrigatório');
          }
          if (controle.errors?.['maxlength']) {
            const max = controle.errors['maxlength'].requiredLength;
            const digitados = controle.errors['maxlength'].actualLength;
            detalhes.push(`ultrapassou ${max} caracteres (digitados: ${digitados})`);
          }
          if (controle.errors?.['min']) {
            const min = controle.errors['min'].min;
            detalhes.push(`valor mínimo aceito é ${min}`);
          }
          if (controle.errors?.['pattern']) {
            if (nomeCampo === 'frequencia_hz') {
              detalhes.push('deve ser 50 ou 60 Hz');
            } else if (nomeCampo === 'polos') {
              detalhes.push('deve ser 2, 4, 6 ou 8');
            } else {
              detalhes.push('formato inválido');
            }
          }

          errosDetalhados.push(`• ${nomeExibicao}: ${detalhes.join(', ')}`);
        }
      });

      // Dispara o popup alert com todos os detalhes listados
      alert(
        `Formulário Inválido!\n\nVerifique os seguintes campos:\n\n${errosDetalhados.join('\n')}`,
      );
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
          alert('Motor atualizado com sucesso!');
        },
        error: (err) => this.tratarErro(err),
      });
    } else {
      this.motorService.createMotor(dadosMotor).subscribe({
        next: () => {
          this.salvando = false;
          this.aoSalvarSucesso.emit();
          alert('Motor criado com sucesso!');
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

  obterMensagemErro(nomeCampo: string): string {
    const controle = this.motorForm.get(nomeCampo);
    if (!controle || !controle.errors) return '';

    const erros = controle.errors;

    // Trata o erro de campo obrigatório
    if (erros['required']) {
      return 'Este campo é obrigatório.';
    }

    // Trata o erro de limite de caracteres excedido (maxLength)
    if (erros['maxlength']) {
      const limite = erros['maxlength'].requiredLength; // Retorna 30
      const digitados = erros['maxlength'].actualLength; // Quantos o usuário digitou
      return `O limite desse campo é de ${limite} caracteres (você digitou ${digitados}).`;
    }

    return 'Campo inválido.';
  }

  campoInvalido(nomeCampo: string): boolean {
    const controle = this.motorForm.get(nomeCampo);
    return !!(controle && controle.invalid && (controle.touched || controle.dirty));
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
