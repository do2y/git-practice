"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signupUser } from "@/lib/api";
import type { SignupFormData } from "@/lib/types";
import AuthShell from "./AuthShell";

const INITIAL_FORM: SignupFormData = {
  name: "",
  email: "",
  password: "",
};

export default function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState<SignupFormData>(INITIAL_FORM);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (form.password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      await signupUser(form);
      router.push("/login?created=1");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "회원가입에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      badge="MySQL 사용자"
      title="회원가입"
      footerText="이미 계정이 있으신가요?"
      footerHref="/login"
      footerLinkText="로그인"
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <p className="auth-error">{error}</p>}

        <label className="auth-field">
          <span className="auth-label">이름</span>
          <input
            className="auth-input"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="이름을 입력하세요"
            autoComplete="name"
            required
          />
        </label>

        <label className="auth-field">
          <span className="auth-label">이메일</span>
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
          <span className="auth-label">비밀번호</span>
          <input
            className="auth-input"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="8자 이상 입력하세요"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>

        <label className="auth-field">
          <span className="auth-label">비밀번호 확인</span>
          <input
            className="auth-input"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="비밀번호를 다시 입력하세요"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>

        <button className="auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "가입 중..." : "회원가입"}
        </button>
      </form>
    </AuthShell>
  );
}
