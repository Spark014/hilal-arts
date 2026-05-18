'use client';

import { Suspense } from 'react';
import LoginForm from './LoginForm';
import styles from './LoginForm.module.css';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className={styles.authPage}>
        <div className={styles.authContainer}>
          <div className={styles.authArabic}>تسجيل الدخول</div>
          <h1 className={styles.authTitle}>Welcome Back</h1>
          <p className={styles.authSubtitle}>Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
