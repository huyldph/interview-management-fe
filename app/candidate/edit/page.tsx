'use client'

import React, {useEffect, useState} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Paperclip} from 'lucide-react'
import {Autocomplete, TextField} from "@mui/material";
import {format} from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Button} from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"


const skillsObject = [
    {code: 'java', label: 'Java'},
    {code: 'flutter', label: 'Flutter'},
    {code: 'nodejs', label: 'NodeJS'},
    {code: 'system design', label: 'System design'},
    {code: 'react', label: 'React'},
    {code: 'angular', label: 'Angular'},
    {code: 'python', label: 'Python'},
    {code: 'c++', label: 'C++'},
    {code: 'c#', label: 'C#'},
    {code: 'php', label: 'PHP'},
    {code: 'javaScript', label: 'JavaScript'},
    {code: 'typeScript', label: 'TypeScript'},
];

interface User {
    userId: number;
    userName: string;
    email: string;
    role: string;
    phone: string;
    status: boolean;
}

interface Candidate {
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
    skills: string[];
    yearsOfExperience: number;
    userId: number;
    highestEducation: string;
}

export default function UpdateCandidate() {
    const router = useRouter()
    const [multiple, setMultiple] = useState([]);
    const [fileName, setFileName] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const searchParams = useSearchParams()
    const [startDate, setStartDate] = useState(new Date());
    const id = searchParams.get('id')
    const [formData, setFormData] = useState<Candidate>({
        fullName: '',
        email: '',
        address: '',
        phoneNumber: '',
        gender: '',
        dob: new Date(),
        cvFilePath: fileName,
        note: '',
        currentPosition: '',
        status: '',
        skills: multiple,
        yearsOfExperience: 0,
        userId: 0,
        highestEducation: ''
    });

    const { toast } = useToast()

    const fetchCandidates = async () => {
        const response = await fetch(`http://localhost:8080/api/users`)
        if (!response.ok) {
            throw new Error('Failed to fetch users')
        }
        const data = await response.json()
        setUsers(data.content)
    };

    const fetchCandidateData = async (candidateId: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/candidates/${candidateId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch candidate data');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching candidate data:', error);
            return null;
        }
    };

    useEffect(() => {
        const loadData = async () => {
            if (id) {
                const candidateData = await fetchCandidateData(id);
                if (candidateData) {
                    setFormData({
                        fullName: candidateData.fullName || '',
                        email: candidateData.email || '',
                        address: candidateData.address || '',
                        phoneNumber: candidateData.phoneNumber || '',
                        gender: candidateData.gender || '',
                        dob: candidateData.dob ? new Date(candidateData.dob) : new Date(),
                        cvFilePath: candidateData.cvFilePath || '',
                        note: candidateData.note || '',
                        currentPosition: candidateData.currentPosition || '',
                        status: candidateData.status || '',
                        skills: candidateData.skills || [],
                        yearsOfExperience: candidateData.yearsOfExperience || 0,
                        userId: candidateData.userId || 0,
                        highestEducation: candidateData.highestEducation || ''
                    });
                    setStartDate(candidateData.dob ? new Date(candidateData.dob) : new Date());
                    setMultiple(candidateData.skills || []);
                    setFileName(candidateData.cvFilePath ? candidateData.cvFilePath.split('/').pop() : '');
                }
            }
            await fetchCandidates();
        };

        loadData();
    }, [id]);

    //upload file
    const handleFileUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8080/api/files/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.text();
                console.log(data);
                setFormData(prev => ({
                    ...prev,
                    cvFilePath: data
                }));
            } else {
                const error = await response.text();
                console.error('Error uploading file:', error);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            handleFileUpload(file);
        }
    };

    const handleMultipleChange = (event: any, value: any) => {
        const selectedSkills = value.map((option: any) => option.code);
        setMultiple(selectedSkills);
        setFormData(prev => ({
            ...prev,
            skills: selectedSkills,
        }));
    };

    // Hàm xử lý thay đổi input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Hàm xử lý thay đổi select
    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: name === 'userId' ? Number(value) : value
        }));
    };

    const handleDateChange = (date: Date | null) => {
        setStartDate(date || new Date());
        setFormData(prev => ({
            ...prev,
            dob: date || new Date(),
        }));
    }

    // Hàm xử lý submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const candidateData = {
                ...formData,
                skills: multiple, // Send the skills array directly, not as a JSON string
                dob: formData.dob ? format(formData.dob, "yyyy-MM-dd") : null,
            };

            const response = await fetch(`http://localhost:8080/api/candidates/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(candidateData),
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Candidate updated successfully!",
                    duration: 3000,
                });
            } else {
                const errorData = await response.text();
                throw new Error(errorData);
            }
        } catch (error) {
            console.error('Error updating candidate:', error);
            toast({
                title: "Error",
                description: "Failed to update candidate. Please try again.",
                variant: "destructive",
                duration: 3000,
            });
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-6">
                <div className="flex items-center gap-2 text-lg">
                    <button
                        onClick={() => router.push('/candidate')}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        Candidate List
                    </button>
                    <span className="text-gray-400">›</span>
                    <span>Create candidate</span>
                </div>
            </div>

            <form className="space-y-8 bg-[#f8f9fc] p-6 rounded-lg" onSubmit={handleSubmit}>
                <div>
                    <h2 className="text-lg font-semibold mb-4">I. Personal information</h2>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">
                                Full name <span className="text-red-500">*</span>
                            </Label>
                            <Input id="fullName" placeholder="Type a name..." className="bg-white" name="fullName"
                                   value={formData.fullName} onChange={handleInputChange}/>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email <span className="text-red-500">*</span>
                            </Label>
                            <Input id="email" type="email" placeholder="Type an email..." className="bg-white"
                                   name="email"
                                   value={formData.email} onChange={handleInputChange}/>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dob">D.O.B</Label>
                            <DatePicker
                                className="bg-white"
                                showIcon
                                selected={startDate}
                                onChange={handleDateChange}
                                dateFormat="yyyy-MM-dd"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" placeholder="Type an address..." className="bg-white" name="address"
                                   value={formData.address} onChange={handleInputChange}/>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone number</Label>
                            <Input id="phone" placeholder="Type a number..." className="bg-white" name="phoneNumber"
                                   value={formData.phoneNumber} onChange={handleInputChange}/>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gender">
                                Gender <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.gender}
                                    onValueChange={(value) => handleSelectChange("gender", value)}>
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select a gender"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-4">II. Professional information</h2>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="cv">CV attachment</Label>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="bg-white"
                                    onClick={() => {
                                        document.getElementById('cv').click();
                                    }}
                                >
                                    <Paperclip className="mr-2 h-4 w-4"/>
                                    {fileName || 'Choose file'}
                                </Button>

                                <input
                                    id="cv"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="hidden"
                                    name="cvFilePath"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="note">Note</Label>
                            <Input id="note" placeholder="N/A" className="bg-white" name="note"
                                   value={formData.note} onChange={handleInputChange}/>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="position">
                                Position <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.currentPosition}
                                onValueChange={(value) => handleSelectChange("currentPosition", value)}>
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select a position... ex. Backend developer, ..."/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="backend">Backend Developer</SelectItem>
                                    <SelectItem value="frontend">Frontend Developer</SelectItem>
                                    <SelectItem value="fullstack">Fullstack Developer</SelectItem>
                                    <SelectItem value="mobile">Mobile Developer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">
                                Status <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.status}
                                    onValueChange={(value) => handleSelectChange("status", value)}>
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select a status"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="reviewing">Reviewing</SelectItem>
                                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="skills">
                                Skills <span className="text-red-500">*</span>
                            </Label>
                            <Autocomplete
                                multiple
                                options={skillsObject}
                                getOptionLabel={(option) => option.label}
                                value={skillsObject.filter((skill) => multiple.includes(skill.code))}
                                onChange={handleMultipleChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Choose skills"
                                        variant="outlined"
                                        className="bg-white"
                                    />
                                )}
                            />
                        </div>


                        <div className="space-y-2">
                            <Label htmlFor="experience">Year of Experience</Label>
                            <Input
                                type="number"
                                min={0}
                                id="experience"
                                placeholder="Type a number"
                                className="bg-white"
                                name="yearsOfExperience"
                                value={formData.yearsOfExperience}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="recruiter">
                                Recruiter <span className="text-red-500">*</span>
                            </Label>
                            <Select value={String(formData.userId)}
                                    onValueChange={(value) => handleSelectChange("userId", value)}>
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Recruiter name"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="assign">Assign me</SelectItem>
                                    {users.map((user) => (
                                        <SelectItem key={user.userId} value={String(user.userId)}>
                                            {user.userName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="education">
                                Highest level <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.highestEducation}
                                    onValueChange={(value) => handleSelectChange("highestEducation", value)}>
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select highest level..."/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="high-school">High School</SelectItem>
                                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                                    <SelectItem value="master">Master's Degree</SelectItem>
                                    <SelectItem value="phd">Ph.D.</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-4 pt-4">
                    <Button type="submit">Submit</Button>
                    <Button
                        type="button"
                        onClick={() => router.push('/candidate')}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
            <Toaster />
        </div>
    )
}

