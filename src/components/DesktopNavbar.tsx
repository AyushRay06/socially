import { BellIcon, HomeIcon, UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SignInButton, UserButton } from "@clerk/nextjs"
import ModeToggle from "@/components/ModeToggle"
import { currentUser } from "@clerk/nextjs/server"

async function DesktopNavbar() {
  //Get the current user from Clerk
  const user = await currentUser()

  return (
    //Hidden on mobile
    <div className="hidden md:flex items-center space-x-4">
      <ModeToggle />

      <Button variant="ghost" className="flex items-center gap-2" asChild>
        <Link href="/">
          <HomeIcon className="w-4 h-4" />
          {/* Text description eg: Home hidden on md block on lg */}
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      {/* IF USER IS SIGNEDIN ie USER INFO IS AVAILABLE THEN DISPLAY THIS ELSE DISPLAY SIGNINBUTTON */}
      {user ? (
        <>
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link href="/notifications">
              <BellIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Notifications</span>
            </Link>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link
            // for the path to the profile page, we check if the user has a username, if not we use the first part of the email address
              href={`/profile/${
                user.username ??
                user.emailAddresses[0].emailAddress.split("@")[0]
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Profile</span>
            </Link>
          </Button>
          <UserButton />
        </>
      ) : (
        <SignInButton mode="modal">
          <Button variant="default">Sign In</Button>
        </SignInButton>
      )}
    </div>
  )
}
export default DesktopNavbar
