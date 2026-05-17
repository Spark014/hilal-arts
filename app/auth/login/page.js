'use client';

import { Suspense } from 'react';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-arabic">تسجيل الدخول</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
