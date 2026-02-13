export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SCALE_1_5' | 'OPEN_TEXT' | string

export function compareAnswers(
    userAnswer: any,
    correctAnswer: any,
    questionType: QuestionType
): boolean {
    if (userAnswer === null || userAnswer === undefined) return false
    if (correctAnswer === null || correctAnswer === undefined) return false

    switch (questionType) {
        case 'MULTIPLE_CHOICE':
        case 'TRUE_FALSE':
            // Ensure we compare strings if they match generally
            return String(userAnswer).trim() === String(correctAnswer).trim()
        case 'SCALE_1_5':
            return parseInt(String(userAnswer)) === parseInt(String(correctAnswer))
        case 'OPEN_TEXT':
            // Open text requires manual review, so automatic comparison is always false (or true if we trust string match, but prompt said "Requiere revisión manual")
            // User Prompt says: "return false" for OPEN_TEXT
            return false
        default:
            return String(userAnswer).trim() === String(correctAnswer).trim()
    }
}
