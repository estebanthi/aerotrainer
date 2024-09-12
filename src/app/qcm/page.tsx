'use client';

import QCM from "@/app/ui/QCM";
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {fetchExams, fetchModules, fetchQuestions} from "@/app/lib/data";
import {Question, Exam, Module} from "@/app/lib/data";
import Button from "@/app/ui/Button";


export default function Page() {

    // API data
    const [questions, setQuestions] = useState<Question[]>([])
    const [exams, setExams] = useState<Exam[]>([])
    const [modules, setModules] = useState<Module[]>([])
    const searchParams = useSearchParams()

    const examId = searchParams.get('examId') ? parseInt(searchParams.get('examId') as string) : null
    const moduleId = searchParams.get('moduleId') ? parseInt(searchParams.get('moduleId') as string) : null
    const nQuestions = searchParams.get('nQuestions') ? parseInt(searchParams.get('nQuestions') as string) : 0

    const exam = exams.find(exam => exam.id === examId)
    const module = modules.find(module => module.id === moduleId)

    // State
    const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: string}>({})
    const [correctionMode, setCorrectionMode] = useState<boolean>(false)

    // Fetch questions, exams and modules on page load
    useEffect(() => {
        fetchQuestions(examId, moduleId, nQuestions).then(setQuestions)
        fetchExams().then(setExams)
        fetchModules().then(setModules)
    }, [])

    const handleAnswerSelect = (noQuestion: number, selectedAnswer: string) => {
        if (selectedAnswer === "") {  // if the answer is unselected, remove it from the selected answers
            setSelectedAnswers((prevState) => {
                const newState = {...prevState}
                delete newState[noQuestion]
                return newState
            })
        }
        // else add the answer
        else {
            setSelectedAnswers((prevState) => ({...prevState, [noQuestion]: selectedAnswer}))
        }
    };

    const validateAnswers = () => {
        window.scrollTo({top: 0, behavior: 'smooth'})
        setCorrectionMode(true)
    }

    const handleClickOnRetry = () => {
        setSelectedAnswers({})
        setCorrectionMode(false)
    }

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-2/3">

                {/* Display exam and module names */}
                <h1 className="text-2xl sm:text-3xl">{exam?.name}</h1>
                {module &&
                    <h2 className="text-lg sm:text-xl">{module.name}</h2>
                }

                {/* Display score and retry button */}
                {correctionMode &&
                    <div className="text-lg font-semibold mb-4">
                        <span className="text-blue-600">Score:</span> {Object.keys(selectedAnswers).filter((questionNo) => selectedAnswers[parseInt(questionNo)] === questions.find(qcm => qcm.noQuestion === parseInt(questionNo))?.goodAnswer).length}/{questions.length}
                        <button
                            className="bg-blue-600 text-white p-2 rounded-lg ml-4 hover:bg-blue-700 transition-colors"
                            onClick={handleClickOnRetry}
                        >Recommencer cettes série</button>
                        <button
                            className="bg-blue-600 text-white p-2 rounded-lg ml-4 hover:bg-blue-700 transition-colors"
                            onClick={() => window.location.reload()}
                        >Nouvelle série</button>
                </div>}

                {/* Display questions */}
                <div className="grid grid-cols-1 gap-8">
                    {questions.map((qcm) => (
                        <QCM
                            key={qcm.noQuestion}
                            question={qcm.text}
                            number={qcm.noQuestion}
                            explanation={qcm.explication}
                            options={[qcm.goodAnswer, ...qcm.wrongAnswers]}
                            image_url={qcm.imageUrl}
                            onSelect={(selectedAnswer) => handleAnswerSelect(qcm.noQuestion, selectedAnswer)}
                            selectedAnswer={selectedAnswers[qcm.noQuestion] || null}
                            correctionMode={correctionMode}
                        />
                    ))}
                </div>

                {/* Display progression and validate button */}
                {!correctionMode && <div className="fixed bottom-0 right-0 bg-white border border-gray-300 rounded-lg shadow-md p-4">
                    <div className="text-lg font-semibold mb-4">
                        <span className="text-blue-600">Progression:</span> {Object.keys(selectedAnswers).length}/{questions.length}
                    </div>
                    <Button onClick={validateAnswers}>Valider</Button>
                </div>}

            </main>
        </div>
    );
}