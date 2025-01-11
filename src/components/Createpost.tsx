"use client"

import { createPost } from "@/actions/post.action"

// import ImageUpload from "./ImageUpload"

import { useUser } from "@clerk/nextjs"
import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"

import toast from "react-hot-toast"
import { useState } from "react"
import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react"

const Createpost = () => {
  return <div>Createpost</div>
}

export default Createpost
