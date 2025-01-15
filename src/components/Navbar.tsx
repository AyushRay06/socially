import Link from "next/link"
import DesktopNavbar from "./DesktopNavbar"
import MobileNavbar from "./MobileNavbar"
import { currentUser } from "@clerk/nextjs/server"
import { syncUser } from "@/actions/user.action"
import { Code } from "lucide-react"

async function Navbar() {
  //Get the current user from Clerk
  const user = await currentUser()
  if (user) await syncUser() // POST  Request as it saves user data in the pgsh DB

  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-primary font-mono tracking-wider"
            >
              <span className="flex gap-x-2">
                Debug
                <Code />
              </span>
            </Link>
          </div>

          <DesktopNavbar />
          <MobileNavbar />
        </div>
      </div>
    </nav>
  )
}
export default Navbar
