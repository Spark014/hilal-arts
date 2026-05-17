'use client';

import { Suspense } from 'react';
import ForgotPasswordForm from './ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-arabic">إعادة تعيين</div>
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">Loading...</p>
        </div>
      </div>
    }>
      <ForgotPasswordForm />
    </Suspense>
  );
}
