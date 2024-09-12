"use client";

import Dropdown from "@/app/ui/Dropdown";
import {fetchExamClasses, fetchModules, fetchQuestionsCount} from "@/app/lib/data";
import {useEffect, useState} from "react";
import Button from "@/app/ui/Button";
import Input from "@/app/ui/Input";
import {redirect} from "next/navigation";
import Link from "next/link";


export default function Page() {

    const [examClasses, setExamClasses] = useState<{id: number, name: string}[]>([])
    const [modules, setModules] = useState<{id: number, name: string, exam_class_id: number}[]>([])
    const [moduleOptions, setModuleOptions] = useState<string[]>([])

    const [selectedExamClass, setSelectedExamClass] = useState<number | null>(null)
    const [selectedModule, setSelectedModule] = useState<number | null>(null)
    const [numberOfQuestions, setNumberOfQuestions] = useState<number | null>(null)

    const [questionsCount, setQuestionsCount] = useState<number | null>(null)

    useEffect(() => {
        fetchExamClasses().then(setExamClasses)
        fetchModules().then(setModules)
    }, [])

    useEffect(() => {
        if (selectedExamClass !== null) {
            fetchQuestionsCount(selectedExamClass, selectedModule).then(setQuestionsCount)
        }
    }, [selectedExamClass, selectedModule])

    const handleSelectExamClass = (value: string) => {
        const examClass = examClasses.find(exam => exam.name === value)

        if (examClass) {
            setSelectedExamClass(examClass.id)
            const filteredModules = modules.filter(module => module.exam_class_id === examClass.id)
            setModuleOptions(filteredModules.length !== 0 ? ['Tous', ...filteredModules.map(module => module.name)] : [])
            setSelectedModule(null)
        }
    }

    const handleSelectModule = (value: string) => {
        const module = modules.find(module => module.name === value)
        if (module) {
            setSelectedModule(module.id)
        }
        if (value === 'Tous') {
            setSelectedModule(-1)
        }
    }

    const getSelectedExamClassName = () => {
        return examClasses.find(exam => exam.id === selectedExamClass)?.name
    }

    const getSelectedModuleName = () => {
        return modules.find(module => module.id === selectedModule)?.name || 'Tous'
    }

    const getHref = function() {
        let href = '/qcm?'
        selectedExamClass && (href += `exam=${selectedExamClass}`)
        selectedModule && selectedModule > -1 && (href += `&module=${selectedModule}`)
        numberOfQuestions && (href += `&questions=${numberOfQuestions}`)
        return href
    }

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <Dropdown options={examClasses.map(exam => exam.name)} onSelect={handleSelectExamClass} placeholder={'Choisissez un examen'} selected={selectedExamClass ? getSelectedExamClassName() : undefined} />
                {moduleOptions.length !== 0 && <Dropdown options={moduleOptions} onSelect={handleSelectModule} placeholder={'Choisissez un module'} selected={selectedModule ? getSelectedModuleName() : undefined} />}
                <Input type="number" placeholder="Nombre de questions" onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))} value={numberOfQuestions?.toString() || ''} />
                {questionsCount !== null && <p>Nombre de questions disponibles: {questionsCount}</p>}
                <Link href={getHref()}><Button onClick={() => {}} disabled={selectedExamClass === null || numberOfQuestions === null}>Commencer</Button></Link>
            </main>
        </div>
    );
}
