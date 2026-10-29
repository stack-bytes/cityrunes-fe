import { Quest } from "@/types/quest";

export const MOCK_QUESTS: Quest[] = [
  {
    id: "quest-1",
    placeId: "1",
    type: "QUIZ",
    name: "Revolution Quiz",
    description:
      "Test your knowledge about the Romanian Revolution that started here.",
    reward: 50,
    quiz: {
      question:
        "At what date did the Romanian Revolution start, as it writes on the wall at the entrance?",
      answers: [
        "December 16, 1989",
        "December 20, 1989",
        "December 15, 1989",
        "December 25, 1989",
      ],
      correctAnswer: 2,
    },
  },
  {
    id: "quest-2",
    placeId: "2",
    type: "PHOTO",
    name: "Saint Mary's Statue Timisoara",
    description: "Take a photo with the Saint Mary's Statue Iosefin Timisoara",
    reward: 75,
    quiz: null,
  },
  {
    id: "quest-3",
    placeId: "3",
    type: "QUIZ",
    name: "St. Mary's Cathedral Quiz",
    description:
      "Answer the question about the history of St. Mary's Cathedral.",
    reward: 60,
    quiz: {
      question: "In what year was the Metropolitan Cathedral completed?",
      answers: ["1936", "1941", "1925", "1918"],
      correctAnswer: 1,
    },
  },
  {
    id: "quest-4",
    placeId: "4",
    type: "PHOTO",
    name: "Piața Victoriei",
    description: "Take a photo at Piața Victoriei din Timisoara",
    reward: 70,
    quiz: null,
  },
  {
    id: "quest-5",
    placeId: "5",
    type: "PHOTO",
    name: "Piața Libertătii",
    description: "Take a photo at Piața Libertătii din Timisoara",
    reward: 80,
    quiz: null,
  },
  {
    id: "quest-6",
    placeId: "6",
    type: "PHOTO",
    name: "Cimitirul Eroilor",
    description: "Take a photo at Cimitirul Eroilor din Timisoara",
    reward: 55,
    quiz: null,
  },
  {
    id: "quest-7",
    placeId: "7",
    type: "PHOTO",
    name: "Communist consumer museum",
    description: "Take a photo at the Communist consumer museum from Timisoara",
    reward: 65,
    quiz: null,
  },
  {
    id: "quest-8",
    placeId: "8",
    type: "PHOTO",
    name: "Art Museum",
    description: "Take a photo at the Art Museum from Timisoara",
    reward: 80,
    quiz: null,
  },
  {
    id: "quest-9",
    placeId: "9",
    type: "PHOTO",
    name: "Banat Village Museum",
    description: "Take a photo at the Banat Village Museum from Timisoara",
    reward: 70,
    quiz: null,
  },
];

export function getQuestForPlace(placeId: string): Quest | undefined {
  return MOCK_QUESTS.find((quest) => quest.placeId === placeId);
}
