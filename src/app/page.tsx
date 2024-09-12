"use client";

import Dropdown from "@/app/ui/Dropdown";
import {fetchExams, fetchModules, fetchQuestionsCount} from "@/app/lib/data";
import {useEffect, useState} from "react";
import Button from "@/app/ui/Button";
import Input from "@/app/ui/Input";
import Link from "next/link";
import {Module, Exam} from "@/app/lib/data";
import Loading from "@/app/ui/Loading";

export default function Page() {
    // API data
    const [exams, setExams] = useState<Exam[]>([]);
    const [modules, setModules] = useState<Module[]>([]);
    const [questionsCount, setQuestionsCount] = useState<number | null>(null);
    const [moduleOptions, setModuleOptions] = useState<string[]>([]);

    // Form data
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [nQuestions, setNQuestions] = useState<number | null>(null);

    // Fetch data on mount with retry mechanism
    useEffect(() => {
        const fetchData = async () => {
            try {
                setExams(await fetchExams());
                setModules(await fetchModules());
            } catch (err) {
                setTimeout(fetchData, 10000);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchCount = async () => {
            if (selectedExam !== null) {
                const examId = selectedExam.id;
                const moduleId = selectedModule ? (selectedModule.id === -1 ? null : selectedModule.id) : null;

                try {
                    const count = await fetchQuestionsCount(examId, moduleId);
                    setQuestionsCount(count);
                } catch (err) {
                    setTimeout(fetchCount, 10000);
                }
            }
        };

        fetchCount();
    }, [selectedExam, selectedModule]);

    const handleSelectExamClass = (value: string) => {
        const selectedExam = exams.find(exam => exam.name === value);

        if (selectedExam) {
            const examModules = modules.filter(module => module.examId === selectedExam.id);
            const moduleOptions = examModules.length !== 0 ? ['Tous', ...examModules.map(module => module.name)] : [];

            setSelectedExam(selectedExam);
            setSelectedModule(null);  // Reset the selected module
            setModuleOptions(moduleOptions);
        }
    };

    const handleSelectModule = (value: string) => {
        const selectedModule = modules.find(module => module.name === value);

        if (selectedModule) {
            setSelectedModule(selectedModule);
        }
        if (value === 'Tous') {
            setSelectedModule({id: -1, name: 'Tous', examId: -1});
        }
    };

    const getQcmGenerationHref = function() {
        let href = '/qcm?';
        selectedExam && (href += `examId=${selectedExam.id}`);
        selectedModule && selectedModule.id > -1 && (href += `&moduleId=${selectedModule.id}`);
        nQuestions && (href += `&nQuestions=${nQuestions}`);
        return href;
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 items-center">
                {exams.length === 0 ? <Loading />
                    : <>
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
                    </>}
            </main>
        </div>
    );
}
