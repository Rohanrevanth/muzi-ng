import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,  // Mark as standalone
  imports: [ReactiveFormsModule], // Add ReactiveFormsModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      // Check for specific errors and show corresponding toast messages
      if (this.loginForm.controls['email'].errors?.['required']) {
        this.toastr.warning('Email is required.', 'INFO');
      } else if (this.loginForm.controls['email'].errors?.['email']) {
        this.toastr.warning('Please enter a valid email address.', 'INFO');
      }
  
      if (this.loginForm.controls['password'].errors?.['required']) {
        this.toastr.warning('Password is required.', 'INFO');
      } else if (this.loginForm.controls['password'].errors?.['minlength']) {
        const minLength = this.loginForm.controls['password'].errors['minlength'].requiredLength;
        this.toastr.warning(`Password must be at least ${minLength} characters long.`, 'INFO');
      }
  
      return;
    }

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    // Simulate the login process
    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.toastr.success('Login successful!', 'SUCCESS');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Invalid credentials', 'ERROR');
      },
    });
  }
}
