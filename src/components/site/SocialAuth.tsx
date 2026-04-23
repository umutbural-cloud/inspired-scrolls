/* Sosyal giriş butonları — backend bağlanınca aktive olur */

const GoogleMark = () => (
  <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.6.27-3.14.74-4.59l-7.98-6.19A23.94 23.94 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const AppleMark = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden fill="currentColor">
    <path d="M16.365 1.43c0 1.14-.46 2.23-1.21 3.03-.81.86-2.14 1.53-3.24 1.45-.13-1.12.42-2.27 1.16-3.04.83-.86 2.26-1.5 3.29-1.44zm4.13 16.23c-.66 1.46-.97 2.11-1.83 3.4-1.18 1.79-2.85 4.02-4.92 4.04-1.84.02-2.31-1.2-4.81-1.18-2.5.02-3.02 1.2-4.86 1.18-2.07-.02-3.65-2.04-4.83-3.83C-1.97 18.22-2.7 12.3.46 9.27c1.14-1.09 2.7-1.78 4.34-1.78 1.74 0 2.83 1.2 4.69 1.2 1.8 0 2.9-1.2 4.92-1.2 1.46 0 3.01.79 4.12 2.16-3.62 1.98-3.03 7.15.96 8z"/>
  </svg>
);

export const SocialAuth = ({ mode }: { mode: "signin" | "signup" }) => {
  const verb = mode === "signup" ? "kayıt ol" : "giriş yap";
  return (
    <div className="grid gap-2.5">
      <button
        type="button"
        className="flex items-center justify-center gap-2.5 h-11 border border-hairline hover:border-foreground/40 hover:bg-surface-sunken transition-colors text-sm"
      >
        <GoogleMark />
        Google ile {verb}
      </button>
      <button
        type="button"
        className="flex items-center justify-center gap-2.5 h-11 border border-foreground bg-foreground text-background hover:bg-foreground/90 transition-colors text-sm"
      >
        <AppleMark />
        Apple ile {verb}
      </button>
    </div>
  );
};