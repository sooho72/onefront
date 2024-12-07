import BaseEntity from "./BaseEntity";

class Report extends BaseEntity {
  constructor(id, journal, comment, user, reason) {
    super(); // BaseEntity 생성자 호출
    this.id = id; // Report ID
    this.journal = journal; // 신고된 일지 (Journal 객체 또는 null)
    this.comment = comment; // 신고된 댓글 (Comment 객체 또는 null)
    this.user = user; // 신고한 사용자 (User 객체)
    this.reason = reason; // 신고 사유
  }
}

export default Report;
