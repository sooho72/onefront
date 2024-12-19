import BaseEntity from "./BaseEntity";

class Report extends BaseEntity {
  constructor(id, commentId, username, name, reason, user,userId) {
    super(); // BaseEntity 생성자 호출
    this.id = id; // Report ID
    this.username = username; //신고 유저네임
    this.name = name; // 신고 이름
    this.commentId = commentId; // 신고된 댓글 (Comment 객체 또는 null)
    this.user = user; // 신고한 사용자 (User 객체)
    this.reason = reason; // 신고 사유
    this.userId = userId;
  }
}

export default Report;
