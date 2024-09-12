"use client";

import Dropdown from "@/app/ui/Dropdown";
import {fetchExams, fetchModules, fetchQuestionsCount} from "@/app/lib/data";
import {useEffect, useState} from "react";
import Button from "@/app/ui/Button";
import Input from "@/app/ui/Input";
import Link from "next/link";
import {Module, Exam} from "@/app/lib/data";


export default function Page() {

    // API data
    const [exams, setExams] = useState<Exam[]>([])
    const [modules, setModules] = useState<Module[]>([])
    const [questionsCount, setQuestionsCount] = useState<number | null>(null)
    const [moduleOptions, setModuleOptions] = useState<string[]>([])

    // Form data
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null)
    const [selectedModule, setSelectedModule] = useState<Module | null>(null)
    const [nQuestions, setNQuestions] = useState<number | null>(null)

    // Fetch data on mount
    useEffect(() => {
        fetchExams().then(setExams)
        fetchModules().then(setModules)
    }, [])

    // Update the questions count when the selected exam or module changes
    useEffect(() => {
        if (selectedExam !== null) {
            const examId = selectedExam.id

            // If the selected module is 'Tous', set the moduleId to null
            const moduleId = selectedModule ? (selectedModule.id === -1 ? null : selectedModule.id) : null

            fetchQuestionsCount(examId, moduleId).then(setQuestionsCount)
        }
    }, [selectedExam, selectedModule])

    // When the selected exam changes, update the module options
    const handleSelectExamClass = (value: string) => {
        const selectedExam = exams.find(exam => exam.name === value)

        if (selectedExam) {
            const examModules = modules.filter(module => module.examId === selectedExam.id)
            const moduleOptions = examModules.length !== 0 ? ['Tous', ...examModules.map(module => module.name)] : []

            setSelectedExam(selectedExam)
            setSelectedModule(null)  // Reset the selected module
            setModuleOptions(moduleOptions)
        }
    }

    const handleSelectModule = (value: string) => {
        const selectedModule = modules.find(module => module.name === value)

        if (selectedModule) {
            setSelectedModule(selectedModule)
        }
        if (value === 'Tous') {
            setSelectedModule({id: -1, name: 'Tous', examId: -1})
        }
    }

    const getQcmGenerationHref = function() {
        let href = '/qcm?'
        selectedExam && (href += `examId=${selectedExam.id}`)
        selectedModule && selectedModule.id > -1 && (href += `&moduleId=${selectedModule.id}`)
        nQuestions && (href += `&nQuestions=${nQuestions}`)
        return href
    }

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center">
                <Dropdown
                    options={exams.map(exam => exam.name)}
                    onSelect={handleSelectExamClass}
                    placeholder={'Choisissez un examen'}
                    selected={selectedExam ? selectedExam.name : undefined}
                />
                {moduleOptions.length !== 0 &&  // Only show the module dropdown if there are modules
                    <Dropdown
                        options={moduleOptions}
                        onSelect={handleSelectModule}
                        placeholder={'Choisissez un module'}
                        selected={selectedModule ? selectedModule.name : undefined}
                    />
                }
                <Input
                    type="number"
                    placeholder="Nombre de questions"
                    onChange={(e) => setNQuestions(parseInt(e.target.value))}
                    value={nQuestions?.toString() || ''}
                />
                {questionsCount !== null &&
                    <p>Nombre de questions disponibles: {questionsCount}</p>
                }
                <Link
                    href={getQcmGenerationHref()}
                >
                    <Button
                        onClick={() => {}}
                        disabled={selectedExam === null || nQuestions === null}
                    >
                        Commencer
                    </Button>
                </Link>
            </main>
        </div>
    );
}
