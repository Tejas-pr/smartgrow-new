import { useEffect, useMemo, useState } from "react"
import { flushSync } from "react-dom"
import { type Theme, ThemeProviderContext } from "./ThemeContext"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      setTheme: (newTheme: Theme) => {
        // No-op if already on this theme — prevents flicker on same-mode select
        if (newTheme === theme) return

        // Fallback: no animation for unsupported browsers or reduced-motion
        if (
          !document.startViewTransition ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
          localStorage.setItem(storageKey, newTheme)
          setTheme(newTheme)
          return
        }

        const transition = document.startViewTransition(() => {
          flushSync(() => {
            localStorage.setItem(storageKey, newTheme)
            setTheme(newTheme)
          })
        })

        // Unified animation: new theme always slides in from the right.
        // Works identically for Light→Dark and Dark→Light
        transition.ready.then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                "inset(0 100% 0 0)", // starts hidden off-right
                "inset(0 0% 0 0)", // reveals fully left-to-right
              ],
            },
            {
              duration: 450,
              easing: "cubic-bezier(0.76, 0, 0.24, 1)",
              pseudoElement: "::view-transition-new(root)",
            }
          )
        })
      },
    }),
    [storageKey, theme]
  )

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}
