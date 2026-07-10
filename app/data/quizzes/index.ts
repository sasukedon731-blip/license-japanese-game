// app/data/quizzes/index.ts
import { gaikokuQuiz } from "./gaikoku-license"
import { roadSignsQuiz } from "./road-signs"
import { japaneseN4Quiz } from "./japanese-n4"
import { japaneseN3Quiz } from "./japanese-n3"
import { japaneseN2Quiz } from "./japanese-n2"
import { genbaListening } from "./genba-listening"
import { genbaPhrasebook } from "./genba-phrasebook"
import { dialectListeningQuiz } from "./dialect-listening"
import { kansaiListeningQuiz } from "./kansai-listening"
import { dialectMeaningQuiz } from "./dialect-meaning"
import { confusingJapaneseQuiz } from "./confusing-japanese"

export const quizzes = {
  "gaikoku-license": gaikokuQuiz,
  "road-signs": roadSignsQuiz,
  "japanese-n4": japaneseN4Quiz,
  "japanese-n3": japaneseN3Quiz,
  "japanese-n2": japaneseN2Quiz,
  "genba-listening": genbaListening,
  "genba-phrasebook": genbaPhrasebook,
  "dialect-listening": dialectListeningQuiz,
  "kansai-listening": kansaiListeningQuiz,
  "dialect-meaning": dialectMeaningQuiz,
  "confusing-japanese": confusingJapaneseQuiz,
} as const
