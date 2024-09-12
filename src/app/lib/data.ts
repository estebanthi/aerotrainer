// fetch data from the server (Next.js)

interface ExamClass {
    id: number;
    name: string;
}


export async function fetchExamClasses(): Promise<ExamClass[]> {
  const res = await fetch('http://localhost:3001/exam_classes');
  return res.json();
}

interface ExamClassModule {
    id: number;
    name: string;
    exam_class_id: number;
}

export async function fetchModules(): Promise<ExamClassModule[]> {
  const res = await fetch('http://localhost:3001/modules');
  return res.json();
}

export async function fetchQuestionsCount(examClassId: number | null, moduleId: number | null): Promise<number> {
    let url = 'http://localhost:3001/questions/count'
  if (examClassId) {
      url = `http://localhost:3001/questions/count?exam_class_id=${examClassId}`
  }
  if (moduleId !== null && moduleId !== -1) {
      url = `http://localhost:3001/questions/count?module_id=${moduleId}`
  }
  const res = await fetch(url);
  console.log(res)
  return res.json();
}

export async function fetchQuestions(examClassId: number | null, moduleId: number | null, numberOfQuestions: number | null): Promise<any> {
    let url = 'http://localhost:3001/questions'
  if (examClassId) {
      url = `http://localhost:3001/questions?exam_class_id=${examClassId}`
  }
  if (moduleId !== null && moduleId !== -1) {
      url = `http://localhost:3001/questions?module_id=${moduleId}`
  }
  url += `&limit=${numberOfQuestions}`
  const res = await fetch(url);
  return res.json();
}