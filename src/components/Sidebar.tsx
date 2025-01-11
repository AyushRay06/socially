// import { getUserByClerkId } from "@/actions/user.action"

import { currentUser } from "@clerk/nextjs/server"
import { SignInButton, SignUpButton } from "@clerk/nextjs"

import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Separator } from "./ui/separator"

import { LinkIcon, MapPinIcon } from "lucide-react"
import Link from "next/link"

//Note:

// currentUser() returns a Promise instead of its resolved value.
// The if (!authUser) check evaluates the Promise object itself, not the resolved value.
// A Promise is always truthy, so the condition if (!authUser) is never true, regardless of whether the user is authenticated or not.

const Sidebar = async () => {
  const authUser = await currentUser()
  //Check if user exist. If do not then show them the UnAuthenticatedSidebar
  if (!authUser) {
    return <UnAuthenticatedSidebar />
  } else {
    return <div>gdcwyegvcg</div>
  }

  // const user = await
}

export default Sidebar

const UnAuthenticatedSidebar = () => (
  <div className="sticky top-20">
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-xl font-semibold">
          Welcome Back!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground mb-4">
          Login to access your profile and connect with others.
        </p>
        <SignInButton mode="modal">
          <Button className="w-full" variant="outline">
            Login
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button className="w-full mt-2" variant="default">
            Sign Up
          </Button>
        </SignUpButton>
      </CardContent>
    </Card>
  </div>
)
