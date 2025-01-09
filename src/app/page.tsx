import ModeToggle from "@/components/ModeToggle"
import { Button } from "@/components/ui/button"
import { SignedIn, SignInButton, UserButton, SignedOut } from "@clerk/nextjs"
export default function Home() {
  return (
    <div>
      <SignedOut>
        <SignInButton mode="modal">
          <Button>SignIn</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <ModeToggle />
    </div>
  )
}
