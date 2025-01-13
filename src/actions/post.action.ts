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

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc", //latest post first
      },
      //post should inclued these fields
      //used include insted of select as these fields are from related table and not from the native one
      include: {
        author: {
          //fields of author ie from user table
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc", //new comments up
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })

    return posts
  } catch (error) {
    console.log("Error in getPosts", error)
    throw new Error("Failed to fetch posts")
  }
}
