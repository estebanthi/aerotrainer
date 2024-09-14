interface ExamApi {
    id: number;
    name: string;
}

interface ModuleApi {
    id: number;
    name: string;
    exam_class_id: number;
}

interface QuestionApi {
    no_question: number;
    text: string;
    explication: string;
    good_answer: string;
    wrong_answers: string[];
    image_url: string | null;
}

interface CollectionApi {
    id: number;
    name: string;
    exam_class_id: number;
    module_id: number;
}

interface HistoryApi {
    id: number;
    user_email: string;
    exam_id: number;
    module_id: number | null;
    collection_id: number | null;
    questions: number[];
    answers: string[];
    score: number;
    datetime: string;
}

export interface Exam {
    id: number;
    name: string;
}

export interface Module {
    id: number;
    name: string;
    examId: number;
}

export interface Question {
    noQuestion: number;
    text: string;
    explication: string;
    goodAnswer: string;
    wrongAnswers: string[];
    imageUrl: string | null;
}

export interface Collection {
    id: number;
    name: string;
    examId: number;
    moduleId: number;
}

export interface History {
    id: number;
    userEmail: string;
    examId: number;
    moduleId: number | null;
    collectionId: number | null;
    questions: number[];
    answers: string[];
    score: number;
    datetime: string;
}


export async function fetchExams(): Promise<Exam[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exams`);
    return res.json().then((exams: ExamApi[]) => {
        return exams.map(exam => {
            return {
                id: exam.id,
                name: exam.name
            }
        })
    })
}

export async function fetchModules(): Promise<Module[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/modules`);
    return res.json().then((modules: ModuleApi[]) => {
        return modules.map(module => {
            return {
                id: module.id,
                name: module.name,
                examId: module.exam_class_id
            }
        })
    })
}

export async function fetchQuestionsCount(examId: number | null, moduleId: number | null, collectionId: number | null): Promise<number> {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/questions/count?`
    examId && (url += `exam_id=${examId}&`)
    moduleId && (url += `module_id=${moduleId}&`)
    collectionId && (url += `collection_id=${collectionId}&`)
    const res = await fetch(url);
    return res.json();
}


export async function fetchQuestions(examId: number | null, moduleId: number | null, collectionId: number | null, nQuestions: number | null, questionsFromHistory: number[] | null = null): Promise<Question[]> {
    let url = nQuestions ? `${process.env.NEXT_PUBLIC_API_URL}/questions?limit=${nQuestions}` : `${process.env.NEXT_PUBLIC_API_URL}/questions?`
    examId && (url += `&exam_id=${examId}&`)
    moduleId && (url += `&module_id=${moduleId}&`)
    collectionId && (url += `&collection_id=${collectionId}&`)
    questionsFromHistory && (url += `&questions=${questionsFromHistory.join(',')}`)
    const res = await fetch(url);
    return res.json().then((questions: QuestionApi[]) => {
        return questions.map(question => {
            return {
                noQuestion: question.no_question,
                text: question.text,
                explication: question.explication,
                goodAnswer: question.good_answer,
                wrongAnswers: question.wrong_answers,
                imageUrl: question.image_url
            }
        })
    })
}

export async function fetchCollections(): Promise<Collection[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections`);
    return res.json().then((collections: CollectionApi[]) => {
        return collections.map(collection => {
            return {
                id: collection.id,
                name: collection.name,
                examId: collection.exam_class_id,
                moduleId: collection.module_id
            }
        })
    })
}


export async function saveAnswers(user_email: string, exam_id: number, module_id: number | null, collection_id: number | null, questions: number[], answers: string[], score: number): Promise<void> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/history`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_email,
            exam_id,
            module_id,
            collection_id,
            questions,
            answers,
            score
        })
    });
    return res.json();
}


export async function fetchHistory(userEmail: string): Promise<History[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/history?user_email=${userEmail}`);
    return res.json().then((histories: HistoryApi[]) => {
        return histories.map(history => {
            return {
                id: history.id,
                userEmail: history.user_email,
                examId: history.exam_id,
                moduleId: history.module_id,
                collectionId: history.collection_id,
                questions: history.questions,
                answers: history.answers,
                score: history.score,
                datetime: history.datetime
            }
        })
    })
}
