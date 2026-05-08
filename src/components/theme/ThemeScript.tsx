export function ThemeScript() {
  const code = `
    (() => {
      try {
        const stored = localStorage.getItem("skilli-theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const theme = stored || (prefersDark ? "dark" : "light");
        document.documentElement.classList.toggle("dark", theme === "dark");
        document.documentElement.dataset.theme = theme;
      } catch {}
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
