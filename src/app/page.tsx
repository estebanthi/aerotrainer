"use client";

import Dropdown from "@/app/ui/Dropdown";
import {fetchExams, fetchModules, fetchQuestionsCount, fetchCollections, Collection} from "@/app/lib/data";
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
    const [collections, setCollections] = useState<Collection[]>([]);
    const [moduleOptions, setModuleOptions] = useState<string[]>([]);
    const [collectionOptions, setCollectionOptions] = useState<string[]>([]);

    // Form data
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
    const [nQuestions, setNQuestions] = useState<number | null>(null);

    // Fetch data on mount with retry mechanism
    useEffect(() => {
        const fetchData = async () => {
            try {
                setExams(await fetchExams());
                setModules(await fetchModules());
                setCollections(await fetchCollections());
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
                const collectionId = selectedCollection ? (selectedCollection.id === -1 ? null : selectedCollection.id) : null;

                try {
                    const count = await fetchQuestionsCount(examId, moduleId, collectionId);
                    setQuestionsCount(count);
                } catch (err) {
                    setTimeout(fetchCount, 10000);
                }
            }
        };

        fetchCount();
    }, [selectedExam, selectedModule, selectedCollection]);

    const handleSelectExamClass = (value: string) => {
        const selectedExam = exams.find(exam => exam.name === value);

        if (selectedExam) {
            const examModules = modules.filter(module => module.examId === selectedExam.id);
            const moduleOptions = examModules.length !== 0 ? ['Tous', ...examModules.map(module => module.name)] : [];

            if (examModules.length === 0) {
                const examCollections = collections.filter(collection => collection.examId === selectedExam.id);
                const collectionOptions = examCollections.length !== 0 ? ['-', ...examCollections.map(collection => collection.name)] : [];

                setCollectionOptions(collectionOptions);
            }

            setSelectedExam(selectedExam);
            setSelectedModule(null);  // Reset the selected module
            setModuleOptions(moduleOptions);
            setSelectedCollection(null);  // Reset the selected collection
        }
    };

    const handleSelectModule = (value: string) => {
        const selectedModule = modules.find(module => module.name === value);

        if (selectedModule) {
            const moduleCollections = collections.filter(collection => collection.moduleId === selectedModule.id);
            const collectionOptions = moduleCollections.length !== 0 ? ['-', ...moduleCollections.map(collection => collection.name)] : [];

            setSelectedModule(selectedModule);
            setCollectionOptions(collectionOptions);
            setSelectedCollection(null);  // Reset the selected collection
        }
        if (value === 'Tous') {
            setSelectedModule({id: -1, name: 'Tous', examId: -1});
            setCollectionOptions([]);
            setSelectedCollection(null);  // Reset the selected collection
        }
    };

    const handleSelectCollection = (value: string) => {
        const selectedCollection = collections.find(collection => collection.name === value);

        if (selectedCollection) {
            setSelectedCollection(selectedCollection);
        }
        if (value === '-') {
            setSelectedCollection(null);
        }
    }

    const getQcmGenerationHref = function() {
        let href = '/qcm?';
        selectedExam && (href += `examId=${selectedExam.id}`);
        selectedModule && selectedModule.id > -1 && (href += `&moduleId=${selectedModule.id}`);
        selectedCollection && selectedCollection.id > -1 && (href += `&collectionId=${selectedCollection.id}`);
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
                        {collectionOptions.length !== 0 &&  // Only show the collection dropdown if there are collections
                            <Dropdown
                                options={collectionOptions}
                                placeholder={'(Optionel) Choisissez une collection'}
                                onSelect={handleSelectCollection}
                                selected={selectedCollection ? selectedCollection.name : undefined}
                                textColor="text-gray-500 dark:text-blueish-900"
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
                                onClick={() => {console.log(nQuestions)}}
                                disabled={selectedExam === null || Number.isNaN(nQuestions) || nQuestions === 0}
                            >
                                Commencer
                            </Button>
                        </Link>
                    </>}
            </main>
        </div>
    );
}
