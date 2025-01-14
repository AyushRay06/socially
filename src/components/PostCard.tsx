"use client"

import { createComment, getPosts } from "@/actions/post.action"
import { SignInButton, useUser } from "@clerk/nextjs"
import { useState } from "react"
import toast from "react-hot-toast"
import { Card, CardContent } from "./ui/card"
import Link from "next/link"
import { Avatar, AvatarImage } from "./ui/avatar"
// import { formatDistanceToNow } from "date-fns";
// import { DeleteAlertDialog } from "./DeleteAlertDialog";
import { Button } from "./ui/button"
import { HeartIcon, LogInIcon, MessageCircleIcon, SendIcon } from "lucide-react"
import { Textarea } from "./ui/textarea"

type Posts = Awaited<ReturnType<typeof getPosts>>
type Post = Posts[number]

interface PostCardProps {
  post: Post
  dbUserId: string | null
}

function PostCard({ post, dbUserId }: PostCardProps) {
  const { user } = useUser()
  const [newComment, setNewComment] = useState("")
  const [isCommenting, setIsCommenting] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [hasLiked, setHasLiked] = useState(
    post.likes.some((like) => like.userId === dbUserId)
  )
  const [optimisticLikes, setOptmisticLikes] = useState(post._count.likes) //gets teh like no.
  const [showComments, setShowComments] = useState(false)

  //-------------------Handle Like------------------------
  const handleLike = async () => {
    //If to avoid continious press of like button and only register one Like
    if (isLiking) return
    try {
      setIsLiking(true)
      setHasLiked((prev) => !prev)
      setOptmisticLikes((prev) => prev + (hasLiked ? -1 : 1))
      // await toggleLike(post.id)
    } catch (error) {
      setOptmisticLikes(post._count.likes)
      setHasLiked(post.likes.some((like) => like.userId === dbUserId))
    } finally {
      setIsLiking(false)
    }
  }

  //---------------------Handle Add Comment----------------

  const handleAddComment = async () => {
    if (!newComment.trim() || isCommenting) return
    try {
      setIsCommenting(true)
      const result = await createComment(post.id, newComment)
      if (result?.success) {
        toast.success("Comment posted successfully")
        setNewComment("")
      }
    } catch (error) {
      toast.error("Failed to add comment")
      console.log("Errorr in handleComment!!!:", error)
    } finally {
      setIsCommenting(false)
    }
  }

  //----------------------Handle Delete Post------------------

  return <div></div>
}

export default PostCard
