"use server"
//RUns on the server

import prisma from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
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

export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({
    where: {
      clerkId,
    },
    //for related data use include
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  })
}

//This function helps us fetch ClerkId and then use ClerkId in getUserBtClerkId to
//to get the user Id in the postgresh DB so that we can use the actal DB ID rather than clerk's

export async function getDbUserId() {
  //Destructuring and Renaming userId as clerkId
  const { userId: clerkId } = await auth()

  if (!clerkId) return null
  const user = await getUserByClerkId(clerkId)

  if (!user) throw new Error("User not found")

  return user.id
}

export async function getRandomUsers() {
  try {
    const userId = await getDbUserId()

    if (!userId) return []
    //Get Three random users
    const randomUsers = await prisma.user.findMany({
      where: {
        //AND is used to apply 2 condition
        //1 not the self user(current user itself)
        //not the users that the current user alreay follows
        AND: [
          { NOT: { id: userId } },
          {
            NOT: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
        ],
      },
      //seleting the fields that we need from the users
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      //signifies that we need 3 users
      take: 3,
    })
    return randomUsers
  } catch (error) {
    console.log("Error In getTRandomUser!!!:", error)
    return []
  }
}

export async function toggleFollow(targetUserId: string) {
  try {
    const userId = await getDbUserId()
    if (!userId) return

    if (userId === targetUserId) throw new Error("You cannot follow yourself")

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    })

    if (existingFollow) {
      //unfollow
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetUserId,
          },
        },
      })
    } else {
      //follow

      //Definition: $transaction in Prisma allows you to perform
      //multiple database operations atomically. This means either all
      //operations succeed together, or none of them are applied if
      //any of them fail.
      //In this case we create the follower & craete notification
      await prisma.$transaction([
        prisma.follows.create({
          data: {
            followerId: userId,
            followingId: targetUserId,
          },
        }),

        prisma.notification.create({
          data: {
            type: "FOLLOW",
            userId: targetUserId, //user being followed recives the notificatoin
            creatorId: userId,
          },
        }),
      ])
    }

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.log("Error in toggleFollow!!!", error)
    return { success: false }
  }
}
