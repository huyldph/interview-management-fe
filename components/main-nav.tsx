"use client"

import {usePathname} from 'next/navigation'
import Link from 'next/link'
import {cn} from '@/lib/utils'
import {useTitle} from "@/contexts/TitleContext"
import {Home, Users, Briefcase, Calendar, FileText, UserCog} from 'lucide-react'

const navItems = [
    {title: "Homepage", href: "/", icon: Home},
    {title: "Candidates", href: "/candidate", icon: Users},
    {title: "Jobs", href: "/job", icon: Briefcase},
    {title: "Interviews", href: "/interview", icon: Calendar},
    {title: "Offers", href: "/offer", icon: FileText},
    {title: "Users", href: "/user", icon: UserCog},
]

export function MainNav() {
    const pathname = usePathname()
    const {setTitle} = useTitle()

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b">
                <span className="font-bold">DEV IMS</span>
            </div>
            <nav className="flex flex-col flex-grow">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive =
                        item.href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ease-in-out",
                                isActive
                                    ? "bg-black text-white"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            )}
                            onClick={() => setTitle(item.title)}
                        >
                            <Icon className="mr-2 h-4 w-4"/>
                            <span>{item.title}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}

