'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from 'lucide-react'
import { format } from "date-fns"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function CreateUser() {
  const [date, setDate] = useState<Date>()
  const router = useRouter()

  return (
    <div className="max-w-5xl mx-auto p-6">
      <form className="space-y-6 bg-[#f8f9fc] p-6 rounded-lg">
        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-700">
                Full name <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="fullName" 
                placeholder="Type a name..." 
                className="bg-white"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob" className="text-gray-700">D.O.B</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy") : "DD/MM/YYYY"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700">Phone number</Label>
              <Input 
                id="phone" 
                placeholder="Type a number..." 
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="roles" className="text-gray-700">
                Roles <span className="text-red-500">*</span>
              </Label>
              <Select required>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select a position... ex. Backend developer, ..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="backend">Backend Developer</SelectItem>
                  <SelectItem value="frontend">Frontend Developer</SelectItem>
                  <SelectItem value="fullstack">Fullstack Developer</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-gray-700">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select required>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Type an email..." 
                className="bg-white"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-gray-700">Address</Label>
              <Input 
                id="address" 
                placeholder="Type an address..." 
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-gray-700">
                Gender <span className="text-red-500">*</span>
              </Label>
              <Select required>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select a gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-gray-700">
                Department <span className="text-red-500">*</span>
              </Label>
              <Select required>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Type a department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note" className="text-gray-700">Note</Label>
              <Input 
                id="note" 
                placeholder="N/A" 
                className="bg-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Button type="submit" className="w-24">
            Submit
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="w-24"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

