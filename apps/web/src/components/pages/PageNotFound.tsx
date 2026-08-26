import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function PageNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center text-foreground">
      <h1 className="text-6xl font-extrabold text-primary">404</h1>
      <h2 className="mt-2 text-xl font-bold">Page Not Found</h2>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="mt-6">
        <button className="btn-primary gap-2 px-4 py-2 text-xs font-semibold">
          <ArrowLeft size={14} />
          <span>Return Home</span>
        </button>
      </Link>
    </div>
  )
}
