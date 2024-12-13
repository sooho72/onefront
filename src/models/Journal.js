import BaseEntity from "./BaseEntity";

class Journal extends BaseEntity {
  constructor(id, challengeId, date, content, mood, progress) {
    super(); // BaseEntity 생성자 호출
    this.id = id; // Journal ID
    this.challengeId = challengeId; // Challenge 객체 또는 ID
    this.date = date; // LocalDate (문자열 형식)
    this.content = content; // Journal 내용
    this.mood = mood; // 감정 상태 ("GOOD", "NORMAL", "SAD")
    this.progress = progress; // 달성률
  }
}

export default Journal;
