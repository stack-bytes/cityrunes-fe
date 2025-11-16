import { Quest } from "@/types/quest";

export const MOCK_QUESTS: Quest[] = [
  {
    status: "UNFINISHED",
    feedback: "POSITIVE",
    quiz: [
      {
        question:
          "At what date did the Romanian Revolution start, as it writes on the wall at the entrance?",
        answers: [
          "December 16, 1989",
          "December 20, 1989",
          "December 15, 1989",
          "December 25, 1989",
        ],
        correct_answer: 2,
      },
    ],
    type: "QUIZ",
    name: "Revolution Quiz",
    description:
      "Test your knowledge about the Romanian Revolution that started here.",
    reward: 100,
  },
  {
    status: "UNFINISHED",
    feedback: "POSITIVE",
    type: "PHOTO",
    name: "Saint Mary's Statue Timisoara",
    description: "Take a photo with the Saint Mary's Statue Iosefin Timisoara",
    reward: 50,
  },
  {
    status: "UNFINISHED",
    feedback: "POSITIVE",
    quiz: [
      {
        question: "In what year was the Metropolitan Cathedral completed?",
        answers: ["1936", "1941", "1925", "1918"],
        correct_answer: 1,
      },
    ],
    type: "QUIZ",
    name: "St. Mary's Cathedral Quiz",
    description:
      "Answer the question about the history of St. Mary's Cathedral.",
    reward: 100,
  },
];
