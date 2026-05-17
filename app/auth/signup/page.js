'use client';

import { Suspense } from 'react';
import SignupForm from './SignupForm';

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-arabic">إنشاء حساب</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Loading...</p>
        </div>
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
