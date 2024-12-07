class BaseEntity {
    constructor() {
      this.createdAt = new Date().toISOString(); // 생성 시간
      this.updatedAt = new Date().toISOString(); // 갱신 시간
    }
  
    prePersist() {
      this.createdAt = new Date().toISOString();
      this.updatedAt = new Date().toISOString();
    }
  
    preUpdate() {
      this.updatedAt = new Date().toISOString();
    }
  }
  
  export default BaseEntity;
  