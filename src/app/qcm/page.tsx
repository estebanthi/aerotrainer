'use client';

import QCM from "@/app/ui/QCM";
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {fetchExams, fetchModules, fetchQuestions, saveAnswers} from "@/app/lib/data";
import {Question, Exam, Module} from "@/app/lib/data";
import Button from "@/app/ui/Button";
import Loading from "@/app/ui/Loading";
import Link from "next/link";
import {useSession} from "next-auth/react";


export default function Page() {
    const { data: session } = useSession()
    const [loggedUser, setLoggedUser] = useState<string>("")

    useEffect(() => {
        if (session) {
            setLoggedUser(session.user?.email || "")
        }
    }, [session])

    // API data
    const [questions, setQuestions] = useState<Question[]>([])
    const [exams, setExams] = useState<Exam[]>([])
    const [modules, setModules] = useState<Module[]>([])
    const searchParams = useSearchParams()

    const examId = searchParams.get('examId') ? parseInt(searchParams.get('examId') as string) : null
    const moduleId = searchParams.get('moduleId') ? parseInt(searchParams.get('moduleId') as string) : null
    const collectionId = searchParams.get('collectionId') ? parseInt(searchParams.get('collectionId') as string) : null
    const nQuestions = searchParams.get('nQuestions') ? parseInt(searchParams.get('nQuestions') as string) : null
    const questionsFromHistory = searchParams.get('questions') ? searchParams.get('questions')?.split(',').map(Number) : null

    const exam = exams.find(exam => exam.id === examId)
    const module_ = modules.find(module => module.id === moduleId)

    // State
    const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: string}>({})
    const [correctionMode, setCorrectionMode] = useState<boolean>(false)

    // Fetch questions, exams and modules on page load with retry mechanism
    useEffect(() => {

        async function fetchData() {
            try {
                examId && setQuestions(await fetchQuestions(examId, moduleId, collectionId, nQuestions, questionsFromHistory))
                setExams(await fetchExams())
                setModules(await fetchModules())
            } catch (err) {
                setTimeout(fetchData, 10000)
            }
        }

        fetchData()
    }, [examId, moduleId, collectionId, nQuestions, questionsFromHistory])

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

    const validateAnswers = async () => {
        window.scrollTo({top: 0, behavior: 'smooth'})
        setCorrectionMode(true)
    }

    const handleClickOnRetry = () => {
        setSelectedAnswers({})
        setCorrectionMode(false)
    }

    useEffect(() => {
        async function saveAnswersToDB() {
            if (loggedUser !== "") {
                const questionsNumbers = questions.map(qcm => qcm.noQuestion)
                const answers = questionsNumbers.map(questionNo => selectedAnswers[questionNo] || "")
                const scorePercentage = Math.round(questionsNumbers.filter((questionNo) => selectedAnswers[questionNo] === questions.find(qcm => qcm.noQuestion === questionNo)?.goodAnswer).length / questionsNumbers.length * 100)
                if (examId) await saveAnswers(loggedUser, examId, moduleId, collectionId, questionsNumbers, answers, scorePercentage)
            }
        }

        if (correctionMode) {
            saveAnswersToDB()
        }
    }, [correctionMode, selectedAnswers, questions, loggedUser, examId, moduleId, collectionId])


    return (
        <div className="flex flex-col items-center justify-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 items-center">
                    {
                        exams.length === 0 ? <Loading/> : (questions.length === 0 ? <p className="text-lg">Aucune question chargée, veuillez réessayer. Retournez à l&apos;accueil en cliquant <Link href="/" className="text-blue-600 dark:text-blueish-200">ici</Link>.</p> : <>

                            {/* Display exam and module names */}
                            <h1 className="text-2xl sm:text-3xl">{exam?.name}</h1>
                            {module_ &&
                                <h2 className="text-lg sm:text-xl">{module_.name}</h2>
                            }

                            {/* Display score and retry button */}
                            {correctionMode &&
                                <div className="text-lg font-semibold mb-4 flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                                    <div>
                                        <span
                                            className="text-blue-600 dark:text-blueish-200">
                                            Score:</span> {Object.keys(selectedAnswers).filter((questionNo) => selectedAnswers[parseInt(questionNo)] === questions.find(qcm => qcm.noQuestion === parseInt(questionNo))?.goodAnswer).length}/{questions.length} ({Math.round(Object.keys(selectedAnswers).filter((questionNo) => selectedAnswers[parseInt(questionNo)] === questions.find(qcm => qcm.noQuestion === parseInt(questionNo))?.goodAnswer).length / questions.length * 100)}%)
                                    </div>
                                    <button
                                        className="bg-blue-600 text-white p-2 rounded-lg ml-4 hover:bg-blue-700 transition-colors dark:bg-blueish-600 dark:hover:bg-blueish-700"
                                        onClick={handleClickOnRetry}
                                    >Recommencer cette série
                                    </button>
                                    <button
                                        className="bg-blue-600 text-white p-2 rounded-lg ml-4 hover:bg-blue-700 transition-colors dark:bg-blueish-600 dark:hover:bg-blueish-700"
                                        onClick={() => window.location.reload()}
                                    >Nouvelle série
                                    </button>
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
                            {!correctionMode && <div
                                className="fixed bottom-0 right-0 bg-white border border-gray-300 rounded-lg shadow-md p-4">
                                <div className="text-lg font-semibold mb-4 dark:text-blueish-300">
                                    <span
                                        className="text-blue-600 dark:text-blueish-200">
                                        Progression:</span> {Object.keys(selectedAnswers).length}/{questions.length}
                                </div>
                                <Button onClick={validateAnswers}>Valider</Button>
                            </div>}
                        </>)
                    }
                </main>
        </div>
);
}