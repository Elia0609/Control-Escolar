import { Component, OnInit, HostBinding } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../Servicios/login.service';
import { DocumentData } from 'src/app/Modelos/interfaz';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  matchingDocuments: DocumentData[] = [];
  rol: string = "Alumno";
  id: any;

  constructor(private auth: LoginService, private router: Router, private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required]
    });
  }

  setupNavLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    const inputField = document.getElementById('usuario') as HTMLInputElement;

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.forEach(link => {
          link.classList.remove('active');
        });
        link.classList.add('active');
        this.rol = link.textContent?.trim() || 'Alumno';
        if (this.rol === 'Administrador') {
          inputField.placeholder = 'Ingresa tu usuario';
        } else if (this.rol === 'Profesor') {
          inputField.placeholder = 'Ingresa tu cédula';
        } else if (this.rol === 'Alumno') {
          inputField.placeholder = 'Ingresa tu matrícula';
        }
      });
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { usuario, contrasena } = this.loginForm.value;
      this.auth.getDocument(usuario, contrasena, this.rol)
        .subscribe(docId => {
          if (docId) {
            this.id = docId;
            this.router.navigate(['/ListaAlumnos']);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error de inicio de sesión',
              text: 'Usuario, rol y/o contraseña incorrectos'
            });
            this.loginForm.reset();
          }
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility() {
    const passwordInput = document.getElementById('contraseña') as HTMLInputElement;
    const togglePassword = document.getElementById('ver');

    if (passwordInput && togglePassword) {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      togglePassword.classList.toggle('fa-eye');
      togglePassword.classList.toggle('fa-eye-slash');
    }
  }

  ngOnInit(): void {
    this.setupNavLinks();
  }
}
