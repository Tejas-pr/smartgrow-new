import { useState, useEffect } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { Link, useNavigate } from "react-router-dom"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp"
import { Eye, EyeOff, Loader2 } from "lucide-react"

type SignupFormProps = React.ComponentProps<"div">
type Role = "FARM" | "BUYER"

export function SignupForm({ className, ...props }: SignupFormProps) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
    role: "FARM" as Role,
  })
  const [showOtp, setShowOtp] = useState(false)
  const [otp, setOtp] = useState("")

  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (showOtp && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    } else if (resendTimer === 0) {
      setCanResend(true)
    }
    return () => clearInterval(interval)
  }, [showOtp, resendTimer])

  const handleResendOtp = async () => {
    setIsResending(true)
    setTimeout(() => {
      setIsResending(false)
      setResendTimer(60)
      setCanResend(false)
    }, 600)
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }))
      return
    }
    if (!formData.password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }))
      return
    }
    if (formData.password !== formData.confirm_password) {
      setErrors((prev) => ({
        ...prev,
        confirm_password: "Passwords do not match",
      }))
      return
    }

    setIsSigningUp(true)
    setTimeout(() => {
      setIsSigningUp(false)
      setShowOtp(true)
    }, 600)
  }

  const handleVerifyOtp = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (otp.length < 6) {
      alert("Please enter a valid 6-digit OTP")
      return
    }

    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
      navigate("/login")
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
            <h1 className="text-2xl font-bold text-foreground">
              {showOtp ? "Verify OTP" : "Sign up"}
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              {showOtp
                ? "Enter the OTP sent to your email"
                : "Create your account"}
            </p>
          </div>

          {/* ACCOUNT TYPE */}
          {!showOtp && (
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
          )}

          {/* SIGNUP FORM */}
          {!showOtp ? (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </label>

                <div className="relative flex items-center">
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      if (errors.email) {
                        setErrors((prev) => ({ ...prev, email: "" }))
                      }
                    }}
                    className={cn(
                      "w-full rounded-lg border border-border bg-background py-2.5 pr-3 pl-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none",
                      errors.email && "border-red-500 focus:ring-red-500"
                    )}
                    required
                  />
                </div>
                {errors.email && (
                  <span className="pl-1 text-xs font-medium text-red-500">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value })
                      if (errors.password) {
                        setErrors((prev) => ({ ...prev, password: "" }))
                      }
                    }}
                    className={cn(
                      "w-full rounded-lg border border-border bg-background py-2.5 pr-10 pl-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none",
                      errors.password && "border-red-500 focus:ring-red-500"
                    )}
                    required
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
                {errors.password && (
                  <span className="pl-1 text-xs font-medium text-red-500">
                    {errors.password}
                  </span>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="confirm-password"
                  className="text-sm font-medium text-foreground"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirm_password}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        confirm_password: e.target.value,
                      })
                      if (errors.confirm_password) {
                        setErrors((prev) => ({
                          ...prev,
                          confirm_password: "",
                        }))
                      }
                    }}
                    className={cn(
                      "w-full rounded-lg border border-border bg-background py-2.5 pr-10 pl-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none",
                      errors.confirm_password &&
                        "border-red-500 focus:ring-red-500"
                    )}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirm_password && (
                  <span className="pl-1 text-xs font-medium text-red-500">
                    {errors.confirm_password}
                  </span>
                )}
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                disabled={isSigningUp}
                className="mt-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold tracking-wide text-primary-foreground transition-all hover:opacity-90 disabled:opacity-70"
              >
                {isSigningUp ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing up...
                  </>
                ) : (
                  "Sign up"
                )}
              </button>
            </form>
          ) : (
            /* OTP FORM */
            <form className="flex flex-col gap-6" onSubmit={handleVerifyOtp}>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="mt-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold tracking-wide text-primary-foreground transition-all hover:opacity-90 disabled:opacity-70"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>

                <div className="mt-1 text-center">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isResending}
                      className="cursor-pointer text-sm font-semibold text-primary hover:underline disabled:opacity-50"
                    >
                      {isResending ? "Resending..." : "Resend OTP"}
                    </button>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Didn't receive the code? Resend in{" "}
                      <span className="font-medium text-foreground">
                        {resendTimer}s
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </form>
          )}

          {/* Login Link */}
          {!showOtp && (
            <p className="mt-auto pt-2 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          )}
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
