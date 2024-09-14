"use client";

import {fetchCollections, fetchExams, fetchHistory, fetchModules} from "@/app/lib/data";
import ReplayButton from "@/app/ui/ReplayButton";
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {Exam, Module, Collection, History} from "@/app/lib/data";


export default function Page() {
    const { data: session } = useSession()

    const [exams, setExams] = useState<Exam[]>([])
    const [modules, setModules] = useState<Module[]>([])
    const [collections, setCollections] = useState<Collection[]>([])
    const [history, setHistory] = useState<History[]>([])
    const [isLogged, setIsLogged] = useState(false)

    useEffect(() => {
        if (!session) {
            return
        }
        const userEmail = session?.user?.email
        if (!userEmail) {
            return
        }
        setIsLogged(true)

        fetchExams().then(setExams)
        fetchModules().then(setModules)
        fetchCollections().then(setCollections)

        fetchHistory(userEmail).then(history => history.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())).then(setHistory)
    }, [session])

    if (!isLogged) {
        return <div className="flex flex-col items-center justify-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-blueish-100">Connectez-vous pour voir votre historique</h1>
            </main>
        </div>
    }


    return (
        <div
            className="flex flex-col items-center justify-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 items-center">
                <h1 className="sm:text-3xl font-bold text-gray-900 dark:text-blueish-100 text-xl text-center">Connecté en tant que {session?.user?.email}</h1>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-blueish-100">Historique</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {history.map((history) => (
                        <div key={history.id} className="flex flex-col gap-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg justify-between">
                            <div className="flex flex-col gap-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-blueish-100">{exams.find(exam => exam.id === history.examId)?.name}</h3>
                            <h4 className="text-md font-bold text-gray-900 dark:text-blueish-100">{modules.find(module => module.id === history.moduleId)?.name}</h4>
                            <h5 className="text-sm font-bold text-gray-900 dark:text-blueish-100">{collections.find(collection => collection.id === history.collectionId)?.name}</h5>
                            </div>
                            <div className="flex flex-col gap-2">
                            <p className="text-sm text-gray-900 dark:text-blueish-100">Score : {history.score}%</p>
                            <p className="text-sm text-gray-900 dark:text-blueish-100">{new Date(history.datetime).toLocaleString()}</p>
                                <ReplayButton history={history}>Rejouer</ReplayButton>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
