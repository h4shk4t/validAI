import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Chat = () => {
  return (
    <div className='h-full w-full grid grid-cols-10'>
      <div className="col-span-2 bg-muted *:text-sm">
        <div className="">Phala</div>
        <div className="">NetherMind</div>
        <div className="">Near Protocol</div>
      </div>
    </div>
  )
}


export default Chat