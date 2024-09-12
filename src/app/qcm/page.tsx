'use client';

import QCM from "@/app/ui/QCM";
import {redirect, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {fetchExamClasses, fetchModules, fetchQuestions} from "@/app/lib/data";
import Button from "@/app/ui/Button";
import Link from "next/link";
import * as querystring from "node:querystring";


export default function Page() {

    const [questions, setQuestions] = useState<{no_question: number, text: string, explication: string, good_answer: string, wrong_answers: string[], image_url: string | null}[]>([])
    const [examClasses, setExamClasses] = useState<{id: number, name: string}[]>([])
    const [modules, setModules] = useState<{id: number, name: string, exam_class_id: number}[]>([])
    const searchParams = useSearchParams()

    const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: string}>({})

    const [correctionMode, setCorrectionMode] = useState<boolean>(false)

    useEffect(() => {
        const examClassId = searchParams.get('exam') ? parseInt(searchParams.get('exam') as string) : null
        const moduleId = searchParams.get('module') ? parseInt(searchParams.get('module') as string) : null
        const numberOfQuestions = searchParams.get('questions') ? parseInt(searchParams.get('questions') as string) : null
        fetchQuestions(examClassId, moduleId, numberOfQuestions).then(setQuestions)

        fetchExamClasses().then(setExamClasses)
        fetchModules().then(setModules)
    }, [])

    const handleSelect = (questionNo: number, selectedAnswer: string) => {
        setSelectedAnswers((prevSelectedAnswers) => ({
            ...prevSelectedAnswers,
            [questionNo]: selectedAnswer,
        }));
    };

    const validateAnswers = () => {
        window.scrollTo({top: 0, behavior: 'smooth'})
        setCorrectionMode(true)
    }

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-2/3">
                <h1 className="text-2xl sm:text-3xl">{examClasses.find(exam => exam.id === parseInt(searchParams.get('exam') as string))?.name}</h1>
                {modules.length !== 0 && <h2 className="text-xl sm:text-2xl">{modules.find(module => module.id === parseInt(searchParams.get('module') as string))?.name}</h2>}
                {correctionMode && <div className="text-lg font-semibold mb-4">
                    <span className="text-blue-600">Score:</span> {Object.keys(selectedAnswers).filter((questionNo) => selectedAnswers[parseInt(questionNo)] === questions.find(qcm => qcm.no_question === parseInt(questionNo))?.good_answer).length}/{questions.length}
                    <button className="bg-blue-600 text-white p-2 rounded-lg ml-4" onClick={() => {
                        setSelectedAnswers({})
                        setCorrectionMode(false)
                    }}>Recommencer cettes série</button>
                    <button className="bg-blue-600 text-white p-2 rounded-lg ml-4" onClick={() => window.location.reload()}>Nouvelle série</button>
                </div>}
                <div className="grid grid-cols-1 gap-8">
                    {questions.map((qcm) => (
                        <QCM
                            key={qcm.no_question}
                            question={qcm.text}
                            number={qcm.no_question}
                            explanation={qcm.explication}
                            options={[qcm.good_answer, ...qcm.wrong_answers]}
                            image_url={qcm.image_url}
                            onSelect={(selectedAnswer) => handleSelect(qcm.no_question, selectedAnswer)}
                            selectedAnswer={selectedAnswers[qcm.no_question] || null}
                            correctionMode={correctionMode}
                        />
                    ))}
                </div>
                {!correctionMode && <div className="fixed bottom-0 right-0 bg-white border border-gray-300 rounded-lg shadow-md p-4">
                    <div className="text-lg font-semibold mb-4">
                        <span className="text-blue-600">Progression:</span> {Object.keys(selectedAnswers).length}/{questions.length}
                    </div>
                    <button className="bg-blue-600 text-white p-2 rounded-lg" onClick={validateAnswers}>Valider</button>
                </div>}
            </main>
        </div>
    );
}