import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // Add ReactiveFormsModule here
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Custom Validator to check if password and confirmPassword match
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { match: true };
  }

  get name() {
    return this.registerForm?.get('name');
  }

  get email() {
    return this.registerForm?.get('email');
  }

  get password() {
    return this.registerForm?.get('password');
  }

  get confirmPassword() {
    return this.registerForm?.get('confirmPassword');
  }

  // Register method
  onRegister(event: Event): void {
    event.preventDefault();  // Prevent the form from submitting and reloading the page
    console.log('Register method triggered'); // Debugging line

    if (this.registerForm.invalid) {
      // Check for specific validation errors and show toasts
      if (this.name?.errors?.['required']) {
        this.toastr.warning('Name is required.', 'INFO');
        return
      }

      if (this.email?.errors?.['required']) {
        this.toastr.warning('Email is required.', 'INFO');
        return
      } else if (this.email?.errors?.['email']) {
        this.toastr.warning('Please enter a valid email address.', 'INFO');
        return
      }
  
      if (this.password?.errors?.['required']) {
        this.toastr.warning('Password is required.', 'INFO');
        return
      } else if (this.password?.errors?.['minlength']) {
        this.toastr.warning('Password must be at least 6 characters long.', 'INFO');
        return
      }
  
      if (this.confirmPassword?.errors?.['required']) {
        this.toastr.warning('Confirm password is required.', 'INFO');
        return
      } else if (this.confirmPassword?.errors?.['match']) {
        this.toastr.warning('Passwords do not match.', 'INFO');
        return
      }
  
      return;
    }
  
    this.isLoading = true;
    const { name, email, password } = this.registerForm.value;
  
    var user = {
      username : name,
      email,
      password
    };
    
    // Simulate registration process
    this.authService.register([user]).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.toastr.success('Registration successful!', 'SUCCESS');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Registration failed, please try again.', 'ERROR');
      },
    });
  }
}
