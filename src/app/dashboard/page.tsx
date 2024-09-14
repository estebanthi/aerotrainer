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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-blueish-100">Connecté en tant que {session?.user?.email}</h1>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-blueish-100">Historique</h2>
                <table className="table-auto">
                    <thead>
                    <tr>
                        <th className="px-4 py-2">Examen</th>
                        <th className="px-4 py-2">Module</th>
                        <th className="px-4 py-2">Collection</th>
                        <th className="px-4 py-2">Score (%)</th>
                        <th className="px-4 py-2">Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {history.map((entry) => (
                        <tr key={entry.id}>
                            <td className="border px-4 py-2">{exams.find(exam => exam.id === entry.examId)?.name}</td>
                            <td className="border px-4 py-2">{modules.find(module => module.id === entry.moduleId)?.name}</td>
                            <td className="border px-4 py-2">{collections.find(collection => collection.id === entry.collectionId)?.name}</td>
                            <td className="border px-4 py-2">{entry.score}</td>
                            <td className="border px-4 py-2">{new Date(entry.datetime).toLocaleString()}</td>
                            <td className="border px-4 py-2">
                                <ReplayButton history={entry}>Rejouer</ReplayButton>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </main>
        </div>
    )
}
