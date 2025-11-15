import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface QuizAnswer {
  id: string;
  text: string;
}

export default function QuizPage() {
  const router = useRouter();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // Mock quiz data - replace with actual data passed from navigation
  const quizQuestion = "What year was this historic monument built?";
  const answers: QuizAnswer[] = [
    { id: "1", text: "1856" },
    { id: "2", text: "1892" },
    { id: "3", text: "1923" },
    { id: "4", text: "1945" },
  ];

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
  };

  const handleSubmit = () => {
    console.log("Selected answer:", selectedAnswer);
    // Implement submit logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
