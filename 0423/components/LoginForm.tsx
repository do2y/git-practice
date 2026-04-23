"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser } from "@/lib/api";
import type { LoginFormData } from "@/lib/types";
import AuthShell from "./AuthShell";

const INITIAL_FORM: LoginFormData = {
  email: "",
  password: "",
};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<LoginFormData>(INITIAL_FORM);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showSignupSuccess = searchParams.get("created") === "1";

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await loginUser(form);
      router.replace("/dashboard");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "로그인 실패.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      badge="JWT Auth"
      title="로그인"
      footerText="계정이 필요하세요?"
      footerHref="/signup"
      footerLinkText="회원가입"
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {showSignupSuccess && (
          <p className="auth-success">
            회원가입이 완료되었습니다. 로그인해주세요.
          </p>
        )}
        {error && <p className="auth-error">{error}</p>}

        <label className="auth-field">
          <span className="auth-label">Email</span>
          <input
            className="auth-input"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </label>

        <label className="auth-field">
          <span className="auth-label">Password</span>
          <input
            className="auth-input"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요..."
            autoComplete="current-password"
            required
          />
        </label>

        <button className="auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </AuthShell>
  );
}
