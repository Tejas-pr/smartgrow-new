import { useState } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Loader2 } from "lucide-react"

type LoginFormProps = React.ComponentProps<"div">

type Role = "FARM" | "BUYER"

export function LoginForm({ className, ...props }: LoginFormProps) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "FARM" as Role,
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      alert("Please fill in all fields.")
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      navigate("/")
    }, 600)
  }

  return (
    <div
      className={cn(
        "flex min-h-svh items-center justify-center bg-muted p-6 font-sans",
        className
      )}
      {...props}
    >
      <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
        {/* LEFT PANEL */}
        <div className="flex min-w-0 flex-1 flex-col gap-5 p-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/smm.png" alt="SmartGrow Logo" width={150} height={150} />
          </div>

          {/* Heading */}
          <div className="-mt-1">
            <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Welcome back! Please enter your details
            </p>
          </div>

          {/* Account type toggle */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Account type
            </label>

            <div className="flex gap-0.5 overflow-hidden rounded-lg border border-border bg-muted p-0.5">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "FARM" })}
                className={cn(
                  "flex-1 cursor-pointer rounded-md py-2 text-sm font-medium transition-all duration-200",
                  formData.role === "FARM"
                    ? "bg-primary font-semibold text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-background"
                )}
              >
                Farm
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "BUYER" })}
                className={cn(
                  "flex-1 cursor-pointer rounded-md py-2 text-sm font-medium transition-all duration-200",
                  formData.role === "BUYER"
                    ? "bg-primary font-semibold text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-background"
                )}
              >
                Buyer
              </button>
            </div>
          </div>

          {/* FORM */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full rounded-lg border border-border bg-background py-2.5 pr-3 pl-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="w-full rounded-lg border border-border bg-background py-2.5 pr-10 pl-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* SIGN IN BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold tracking-wide text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* SIGNUP LINK */}
          <p className="mt-auto pt-2 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden w-[430px] shrink-0 items-center p-4 pl-0 md:flex">
          <img
            src="/farm.png"
            alt="Hydroponic farm"
            className="h-full min-h-[440px] w-full rounded-xl object-cover"
          />
        </div>
      </div>
    </div>
  )
}
