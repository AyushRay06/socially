"use server"

import prisma from "@/lib/prisma"
import { getDbUserId } from "./user.action"
import { revalidatePath } from "next/cache"

export async function createPost(content: string, image: string) {
  try {
    const userId = await getDbUserId()
    if (!userId) return
    const post = await prisma.post.create({
      data: {
        content,
        image,
        authorId: userId, //as we need authorId in schema
      },
    })

    revalidatePath("/") //delete the cache from the target page
    return { success: true, post }
  } catch (error) {
    console.error("Failed to create post:", error)
    return { success: false, error: "Failed to create post" }
  }
}
