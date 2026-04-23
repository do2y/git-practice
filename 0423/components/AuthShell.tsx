import Link from 'next/link';

interface AuthShellProps {
  badge: string;
  title: string;
  description?: string;
  footerText: string;
  footerHref: string;
  footerLinkText: string;
  children: React.ReactNode;
}

export default function AuthShell({
  badge,
  title,
  description,
  footerText,
  footerHref,
  footerLinkText,
  children,
}: AuthShellProps) {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-header">
          <span className="auth-badge">{badge}</span>
          <h1 className="auth-title">{title}</h1>
          {description ? <p className="auth-description">{description}</p> : null}
        </div>

        {children}

        <p className="auth-footer">
          {footerText} <Link href={footerHref}>{footerLinkText}</Link>
        </p>
      </section>
    </main>
  );
}
