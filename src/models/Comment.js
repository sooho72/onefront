import BaseEntity from "./BaseEntity"; // BaseEntity.js에서 가져오기

class Comment extends BaseEntity {
  constructor(id,user, content, challengeId) {
    super(); // BaseEntity의 생성자 호출
    this.id = id; // Comment ID
    this.user = user; // User 객체 또는 ID
    this.content = content; // 댓글 내용
    this.challengeId=challengeId
  }
}

export default Comment;
