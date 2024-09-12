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

export async function fetchQuestionsCount(examId: number | null, moduleId: number | null): Promise<number> {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/questions/count?`
    examId && (url += `exam_id=${examId}&`)
    moduleId && (url += `module_id=${moduleId}&`)
    const res = await fetch(url);
    return res.json();
}


export async function fetchQuestions(examId: number | null, moduleId: number | null, nQuestions: number): Promise<Question[]> {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/questions?limit=${nQuestions}`
    examId && (url += `&exam_id=${examId}&`)
    moduleId && (url += `&module_id=${moduleId}&`)
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
