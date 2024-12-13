import BaseEntity from "./BaseEntity";

class Challenge extends BaseEntity {
  constructor(
    id,
    name,
    username,
    title,
    description,
    startDate,
    endDate,
    progress,
    isCompleted,
    isPublic
  ) {
    super(); // BaseEntity 생성자 호출
    this.id = id;
    this.name=name;
    this.username = username;
    this.title = title;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.progress = progress;
    this.isCompleted = isCompleted;
    this.isPublic = isPublic;
  }
}

export default Challenge;
