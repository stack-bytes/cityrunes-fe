import { RootState } from "@/store";
import { addPoints } from "@/store/slices/leaderboardSlice";
import { addCoins, completePlace } from "@/store/slices/userSlice";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

interface QuizAnswer {
  id: string;
  text: string;
}

export default function QuizPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useLocalSearchParams();
  const currentUser = useSelector((state: RootState) => state.user);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const quizQuestion =
    (params.question as string) ||
    "What year was this historic monument built?";
  const placeName = (params.placeName as string) || "";
  const placeId = (params.placeId as string) || "";
  const trackId = (params.trackId as string) || "";
  const reward = params.reward ? Number(params.reward) : 0;
  const correctAnswerIndex = params.correctAnswer
    ? Number(params.correctAnswer)
    : 0;
  const answersData = params.answers
    ? JSON.parse(params.answers as string)
    : ["1856", "1892", "1923", "1945"];
  const answers: QuizAnswer[] = answersData.map(
    (answer: string, index: number) => ({
      id: String(index),
      text: answer,
    })
  );

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const selectedIndex = Number(selectedAnswer);
    const correct = selectedIndex === correctAnswerIndex;

    if (correct) {
      dispatch(completePlace(placeId));
      dispatch(addCoins(reward));
      if (trackId) {
        dispatch(
          addPoints({ userId: currentUser.id, trackId, points: reward })
        );
      }
      Alert.alert(
        "Correct! 🎉",
        `Great job! You got it right! +${reward}G`,
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert("Wrong Answer ❌", "That's not quite right. Try again!", [
        {
          text: "Try Again",
          style: "default",
        },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {placeName && <Text style={styles.placeTitle}>{placeName}</Text>}
        <Text style={styles.questionTitle}>{quizQuestion}</Text>

        <View style={styles.answersContainer}>
          {answers.map((answer) => (
            <TouchableOpacity
              key={answer.id}
              style={styles.answerRow}
              onPress={() => handleAnswerSelect(answer.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.bulletPoint,
                  selectedAnswer === answer.id && styles.bulletPointSelected,
                ]}
              >
                {selectedAnswer === answer.id && (
                  <View style={styles.bulletPointInner} />
                )}
              </View>
              <Text
                style={[
                  styles.answerText,
                  selectedAnswer === answer.id && styles.answerTextSelected,
                ]}
              >
                {answer.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            !selectedAnswer && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!selectedAnswer}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: "space-between",
  },
  placeTitle: {
    fontFamily: "SilkscreenBold",
    fontSize: 20,
    color: "#118CF7",
    opacity: 0.7,
    marginBottom: 16,
    textAlign: "center",
  },
  questionTitle: {
    fontFamily: "SilkscreenBold",
    fontSize: 28,
    color: "#118CF7",
    marginBottom: 60,
    lineHeight: 36,
  },
  answersContainer: {
    flex: 1,
    justifyContent: "center",
  },
  answerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    paddingVertical: 8,
  },
  bulletPoint: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#118CF7",
    marginRight: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  bulletPointSelected: {
    borderColor: "#118CF7",
  },
  bulletPointInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#118CF7",
  },
  answerText: {
    fontFamily: "SilkscreenBold",
    fontSize: 20,
    color: "#118CF7",
    flex: 1,
  },
  answerTextSelected: {
    color: "#118CF7",
  },
  submitButton: {
    backgroundColor: "#118CF7",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  submitButtonDisabled: {
    backgroundColor: "#A0D5FF",
    opacity: 0.5,
  },
  submitButtonText: {
    fontFamily: "SilkscreenBold",
    fontSize: 20,
    color: "#FFFFFF",
  },
});
