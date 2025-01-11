"use server"

import prisma from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"
//we are calling the syncUser() to save the user data from clerk to postgresh
//we are calling the syncUser() in Navbar 
export async function syncUser() {
  try {
    //Get the userId and user from clerk
    const { userId } = await auth()
    const user = await currentUser()

    //return if user and userId not found
    if (!userId || !user) return

    //check if user already exist where clerkId is userId
    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    })

    if (existingUser) return existingUser

    //if the user do not exist add it to the postgresg DB
    //we ask for both the user and userId as userId is stored as clerkId
    //and user is used to access other fields like firstName  image url etc

    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    })

    return dbUser
  } catch (error) {
    console.log("Error in syncUser", error)
  }
}
