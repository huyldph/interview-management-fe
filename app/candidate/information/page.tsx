'use client'

import {useEffect, useState} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"

interface Candidate {
    candidateId: number;
    fullName: string;
    email: string;
    address: string;
    phoneNumber: string;
    gender: string;
    dob: Date;
    cvFilePath: string;
    note: string;
    currentPosition: string;
    status: string;
    skills: string;
    yearsOfExperience: number;
    highestEducation: string;
    userName: string;
}

export default function CandidateInformation() {
    const [candidate, setCandidate] = useState<Candidate | null>(null)
    const searchParams = useSearchParams() // Hook để lấy query params
    const router = useRouter()
    const id = searchParams.get('id') // Truy xuất 'id' từ query params

    const fetchCandidate = async () => {
        if (!id) return
        try {
            const response = await fetch(`http://localhost:8080/api/candidates/${id}`)
            if (!response.ok) {
                throw new Error('Failed to fetch candidate')
            }
            const data = await response.json()
            setCandidate(data)
        } catch (error) {
            console.error('Error fetching candidate:', error)
        }
    }

    useEffect(() => {
        fetchCandidate()
    }, [id])

    const renderField = (label: string, value: string | undefined) => (
        <div className="flex flex-row gap-2 items-center">
            <Label htmlFor={label.toLowerCase()}>{label}</Label>
            <span className="text-red-500">{value || 'N/A'}</span>
        </div>
    )

    if (!candidate) {
        return <div>Loading...</div>
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-6">
                <div className="flex items-center gap-2 text-lg">
                    <button
                        onClick={() => router.push('/candidate')}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        Candidate list
                    </button>
                    <span className="text-gray-400">›</span>
                    <span>Candidate information</span>
                </div>
            </div>

            <form>
                <div className="space-y-8 p-6 rounded-lg bg-[#f8f9fc]">
                    <div>
                        <h2 className="text-lg font-semibold mb-4">I. Personal information</h2>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                            {renderField("Full name", candidate.fullName)}
                            {renderField("Email", candidate.email)}
                            {renderField("D.O.B", String(candidate.dob))}
                            {renderField("Address", candidate.address)}
                            {renderField("Phone number", candidate.phoneNumber)}
                            {renderField("Gender", candidate.gender)}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-4">II. Professional information</h2>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                            {renderField("CV attachment", candidate.cvFilePath)}
                            {renderField("Note", candidate.note)}
                            {renderField("Position", candidate.currentPosition)}
                            {renderField("Status", candidate.status)}
                            {renderField("Skills", candidate.skills)}
                            {renderField("Year of Experience", String(candidate.yearsOfExperience))}
                            {renderField("Recruiter", candidate.userName)}
                            {renderField("Highest Education", candidate.highestEducation)}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-10 pt-4">
                    <Button type="button" className="w-24"
                            onClick={() => router.push(`/candidate/edit/${candidate.candidateId}`)}>Edit</Button>
                    <Button
                        type="button"
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
