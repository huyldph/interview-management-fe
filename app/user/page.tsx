'use client';

import '../css/style.css'
import {Search} from 'lucide-react';
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Input} from "@/components/ui/input";
import Link from 'next/link';

interface User {
    userId: number;
    userName: string;
    email: string;
    role: string;
    phone: string;
    status: boolean;
}

export default function Page() {
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchUsers().then(r => console.log(r))
    }, [page])

    const fetchUsers = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch(`http://localhost:8080/api/users?page=${page}`)
            if (!response.ok) {
                throw new Error('Failed to fetch users')
            }
            const data = await response.json()
            setUsers(data.content)
            setTotalPages(data.totalPages)
        } catch (err) {
            setError("An error occurred while fetching users")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handlePrevPage = () => {
        setPage((prevPage) => Math.max(0, prevPage - 1))
    }

    const handleNextPage = () => {
        setPage((prevPage) => prevPage + 1)
    }

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>
    }

    return (
        <div className="container mx-auto p-4">
            {/* Search and Filter */}
            <div className="mb-4 flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                    <Input placeholder="Search" className="pl-8"/>
                </div>
                <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="waiting">Waiting for interview</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="interviewed">Interviewed</SelectItem>
                        <SelectItem value="offered">Offered</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="rejected">Offer rejected</SelectItem>
                        <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                </Select>
                <Button className="bg-primary text-primary-foreground">Search</Button>
                <div className="flex-1"/>
                <Link href="/user/create" passHref>
                    <Button className="bg-primary text-primary-foreground">Add new</Button>
                </Link>
            </div>

            {/* Table */}
            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone No</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.userId}>
                                <TableCell>{user.userName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.status ? 'Active' : 'Deactivated'}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <svg
                                            className=" h-4 w-4"
                                            fill="none"
                                            height="24"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            width="24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <svg
                                            className=" h-4 w-4"
                                            fill="none"
                                            height="24"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            width="24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                                        </svg>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-end gap-4 text-sm">
                <div>{`${page + 1}/${totalPages} pages`}</div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handlePrevPage}
                        disabled={page === 0}
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="m15 18-6-6 6-6"/>
                        </svg>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleNextPage}
                        disabled={page === totalPages - 1}
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="m9 18 6-6-6-6"/>
                        </svg>
                    </Button>
                </div>
            </div>
        </div>
    );
}

