export type Task = {
  id: string;
  titulo: string;
  descricao: string | null;
  dataCriacao: Date;
  completed: boolean;
};

const mockTasks: Task[] = [
  {
    id: "1d3b0e9a-4f5b-4ab9-8a9b-2e74318a4f10",
    titulo: "Do the weekly groceries",
    descricao: "Buy fruits, vegetables, milk, and cleaning supplies",
    dataCriacao: new Date("2025-10-20T10:15:00Z"),
    completed: false,
  },
  {
    id: "2a1b6e91-bd3f-4e7b-8392-814dee793f20",
    titulo: "Call the dentist",
    descricao: "Schedule a cleaning appointment for next week",
    dataCriacao: new Date("2025-10-21T09:00:00Z"),
    completed: false,
  },
  {
    id: "3c42afd3-d3c7-40be-b523-7cf77b125b09",
    titulo: "Clean the living room",
    descricao: "Vacuum the carpet and organize cushions",
    dataCriacao: new Date("2025-10-21T13:30:00Z"),
    completed: false,
  },
  {
    id: "4e5f68b2-58b8-4f5e-a529-956909a00ae2",
    titulo: "Prepare lunch boxes",
    descricao: "Cook rice, chicken, and pack for two days",
    dataCriacao: new Date("2025-10-21T17:00:00Z"),
    completed: true,
  },
  {
    id: "5f718a85-6a8a-493b-bc2e-0a31738eea67",
    titulo: "Water the plants",
    descricao: "Front porch and balcony plants need watering",
    dataCriacao: new Date("2025-10-22T08:00:00Z"),
    completed: false,
  },
  {
    id: "6a2d23b2-1b10-48c9-9348-fc6dcdeb18a9",
    titulo: "Do a 30-minute workout",
    descricao: "Stretching + cardio session",
    dataCriacao: new Date("2025-10-22T10:00:00Z"),
    completed: true,
  },
  {
    id: "7dc3f0c9-1276-4789-a3e6-b07ea885b83b",
    titulo: "Reply to pending emails",
    descricao: "Answer messages from HR and project manager",
    dataCriacao: new Date("2025-10-22T12:45:00Z"),
    completed: false,
  },
  {
    id: "8ea5b5da-2174-4ff3-a0cb-042cd10f107d",
    titulo: "Walk the dog",
    descricao: "Take Bruno for a walk around the block",
    dataCriacao: new Date("2025-10-22T15:30:00Z"),
    completed: false,
  },
  {
    id: "9f83cba2-c995-44b9-bbf4-a4a364a85570",
    titulo: "Pay electricity bill",
    descricao: "Check the due date and make the payment online",
    dataCriacao: new Date("2025-10-23T09:00:00Z"),
    completed: false,
  },
  {
    id: "10b67f08-7a0d-4a4e-8ae3-93ef8e5d003e",
    titulo: "Organize photo gallery",
    descricao: "Delete duplicates and back up to cloud storage",
    dataCriacao: new Date("2025-10-23T11:30:00Z"),
    completed: false,
  },
  {
    id: "11bbc608-a12c-4abc-8989-879ff9fdf526",
    titulo: "Read the new book chapter",
    descricao: "Continue reading 'Clean Code', chapter 5",
    dataCriacao: new Date("2025-10-23T19:20:00Z"),
    completed: false,
  },
  {
    id: "12dc28b3-7d8b-4ab1-ab0c-13657b661617",
    titulo: "Backup project files",
    descricao: "Zip and upload to Google Drive",
    dataCriacao: new Date("2025-10-24T07:00:00Z"),
    completed: false,
  },
  {
    id: "13d234b3-9a7a-4b36-a5fb-2b4ebd751333",
    titulo: "Watch a tech talk",
    descricao: "View 'React Performance' talk on YouTube",
    dataCriacao: new Date("2025-10-24T10:30:00Z"),
    completed: false,
  },
  {
    id: "14e43b45-448a-4605-8228-1be10ca90318",
    titulo: "Write grocery list",
    descricao: "Make a list for next week's meals",
    dataCriacao: new Date("2025-10-24T14:15:00Z"),
    completed: false,
  },
  {
    id: "15f57383-64c4-4e24-b264-b2e25a9ec99b",
    titulo: "Book car service",
    descricao: "Oil change and tire inspection needed",
    dataCriacao: new Date("2025-10-24T17:45:00Z"),
    completed: false,
  },
  {
    id: "16a45395-b9f1-472d-b337-73ebccf48234",
    titulo: "Clean bedroom",
    descricao: "Change bedsheets and organize closet",
    dataCriacao: new Date("2025-10-25T09:15:00Z"),
    completed: false,
  },
  {
    id: "17b274aa-af2e-4af7-926d-4a2c2512c2f3",
    titulo: "Water indoor plants",
    descricao: "Mini cactus and bonsai need watering",
    dataCriacao: new Date("2025-10-25T11:30:00Z"),
    completed: true,
  },
  {
    id: "18c159d9-7184-4bef-9984-9392bd568ec2",
    titulo: "Take out trash",
    descricao: "Dispose recycling and general garbage",
    dataCriacao: new Date("2025-10-25T13:00:00Z"),
    completed: false,
  },
  {
    id: "19d245aa-802e-4d72-8d21-7063463f282f",
    titulo: "Meditate 10 minutes",
    descricao: "Evening relaxation session",
    dataCriacao: new Date("2025-10-25T20:00:00Z"),
    completed: false,
  },
  {
    id: "20e341c2-5a0b-40a8-b008-3aa234915d21",
    titulo: "Plan weekend trip",
    descricao: "Research places to visit near the city",
    dataCriacao: new Date("2025-10-26T08:30:00Z"),
    completed: false,
  },
];

export const tasksList: Task[] =
  process.env.USE_MOCK_DATA === "true" ? [...mockTasks] : [];
