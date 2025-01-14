"user server"

import prisma from "@/lib/prisma"
import { getDbUserId } from "./user.action"

//--------------------Get Notification--------------------------

export async function getNotifications() {
  try {
    const userId = await getDbUserId()
    if (!userId) return []

    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      //Check Notification's related tables section to understand or recall it better(easy).
      //to get field from related table
      include: {
        creator: {
          // the person who Like||Commented||Follow
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        post: {
          //Notification related to the post
          select: {
            id: true,
            content: true,
            image: true,
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return notifications
  } catch (error) {
    console.error("Error fetching notifications:", error)
    throw new Error("Failed to fetch notificatios")
  }
}

//----------------------------Mark As Read-----------------------

export async function markNotificationsAsRead(notificationIds: string[]) {
  try {
    await prisma.notification.updateMany({
      where: {
        id: {
          in: notificationIds,
        },
      },
      data: {
        read: true,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Error marking notifications as read:", error)
    return { success: false }
  }
}