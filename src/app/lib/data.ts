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

interface UserApi {
    id: number;
    username: string;
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

export interface User {
    id: string;
    email: string;
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


export async function fetchQuestions(examId: number | null, moduleId: number | null, collectionId: number | null, nQuestions: number): Promise<Question[]> {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/questions?limit=${nQuestions}`
    examId && (url += `&exam_id=${examId}&`)
    moduleId && (url += `&module_id=${moduleId}&`)
    collectionId && (url += `&collection_id=${collectionId}&`)
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


export async function login(username: string, password: string): Promise<User | null> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    return res.status === 200 ? res.json().then((user: UserApi) => {
        return {
            id: user.id.toString(),
            email: user.username
        }
    }) : null
}


export async function register(email: string, password: string): Promise<User | string> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    if (res.status === 200) {
        return res.json().then((user: UserApi) => {
            return {
                id: user.id.toString(),
                email: user.username
            }
        })
    }
    else {
        throw Error(await res.json().then(error => error.error))
    }
}