// features/auth/utils/validators.ts

export class AuthValidators {
  
  static validateEmail(email: string): string | null {
    if (!email) {
      return "Email is required";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    
    return null;
  }

  static validatePassword(password: string): string | null {
    if (!password) {
      return "Password is required";
    }
    
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    
    if (password.length > 100) {
      return "Password is too long (max 100 characters)";
    }

    
    return null;
  }

  static validatePasswordMatch(password: string, confirmPassword: string): string | null {
    if (password !== confirmPassword) {
      return "Passwords don't match";
    }
    return null;
  }

  static validateUsername(username: string): string | null {
    if (!username) {
      return "Username is required";
    }
    
    if (username.length < 3) {
      return "Username must be at least 3 characters";
    }
    
    if (username.length > 30) {
      return "Username is too long (max 30 characters)";
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return "Username can only contain letters, numbers, underscore, and hyphen";
    }
    
    return null;
  }

  static validateFullName(fullName: string): string | null {
    if (!fullName) {
      return "Full name is required";
    }
    
    if (fullName.length < 2) {
      return "Full name must be at least 2 characters";
    }
    
    if (fullName.length > 100) {
      return "Full name is too long (max 100 characters)";
    }
    
    return null;
  }

  static validateOtp(otp: string): string | null {
    if (!otp) {
      return "OTP is required";
    }
    
    if (!/^\d{6}$/.test(otp)) {
      return "OTP must be 6 digits";
    }
    
    return null;
  }
}