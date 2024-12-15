// src/components/Journal.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Mood from "../../models/Mood";
import JournalModel from "../../models/Journal";
import journalService from "../../services/journalService";
import challengeService from "../../services/challengeService"; 
import '../../pages/journal/Journal.css';
import Navsidebar from "../../components/Navsidebar";

const Journal = () => {
  const { challengeId } = useParams();

  const [challenge, setChallenge] = useState(null);
  const [journals, setJournals] = useState([]);

  const [newJournalData, setNewJournalData] = useState({
    challenge: Number(challengeId),
    content: "",
    mood: Mood.UNDEFINED,
    progress: 0,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, journalId: null });

  // Mood를 이모티콘으로 매핑
  const moodEmojis = {
    [Mood.UNDEFINED]: "🤔",
    HAPPY: "😊",
    SAD: "😢",
    ANGRY: "😠",
    NEUTRAL: "😐",
    EXCITED: "🤩",
    // 필요한 경우 더 추가 가능
  };

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const cData = await challengeService.getChallengeById(challengeId);
        setChallenge(cData);
      } catch (error) {
        console.error("Error fetching challenge:", error);
        setErrorMessage("챌린지 정보를 불러오는 중 문제가 발생했습니다.");
      }
    };
    fetchChallenge();
  }, [challengeId]);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const data = await journalService.getJournalsByChallengeId(challengeId);
        setJournals(data);
      } catch (error) {
        setErrorMessage("기록을 불러오는 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchJournals();
  }, [challengeId]);

  const handleCreateJournal = async (e) => {
    e.preventDefault();
    if (!newJournalData.content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    try {
      const today = new Date().toISOString().split('T')[0]; // 현재 날짜 설정

      const newJournal = new JournalModel(
        null,
        newJournalData.challenge,
        null, // date는 서버에서 설정
        newJournalData.content,
        newJournalData.mood,
        newJournalData.progress
      );

      const createdJournal = await journalService.createJournal(newJournal);
      setJournals([createdJournal, ...journals]); // 새로 생성된 기록을 목록에 추가

      // 폼 초기화
      setNewJournalData({
        challenge: Number(challengeId),
        content: "",
        mood: Mood.UNDEFINED,
        progress: 0,
      });
    } catch (error) {
      console.error("Error creating journal:", error);
      setErrorMessage("기록을 생성하는 중 문제가 발생했습니다.");
    }
  };

  const handleDeleteJournal = async () => {
    const { journalId } = deleteModal;
    try {
      await journalService.deleteJournal(journalId);
      const updatedList = await journalService.getJournalsByChallengeId(challengeId);
      setJournals(updatedList);
      setDeleteModal({ isOpen: false, journalId: null });
    } catch (error) {
      console.error("Error deleting journal:", error);
      setErrorMessage("기록을 삭제하는 중 문제가 발생했습니다.");
      setDeleteModal({ isOpen: false, journalId: null });
    }
  };

  // byte[]를 Base64로 변환하는 헬퍼 함수 (현재 사용되지 않음)
  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  return (
    <div className="journal-container">
      <Navsidebar />

      {/* 챌린지 헤더 */}
      {challenge && (
        <div className="challenge-header">
          <h1>제목:{challenge.title}</h1>
          <p>달성률:{challenge.progress}%</p>
          <p>날짜:{challenge.startDate}~{challenge.endDate}</p>
          <p>내용:{challenge.description}</p>
        </div>
      )}

      {/* 로딩 상태 */}
      {loading && <p className="loading-message">기록을 불러오는 중입니다...</p>}

      {/* 에러 메시지 */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* 챌린지 없을 때 메시지 */}
      {!loading && journals.length === 0 && <p className="empty-message">등록된 기록이 아직 없습니다.</p>}

      {/* 기록 목록 */}
      {!loading && journals.length > 0 && (
        <div className="journal-list">
          <h2>기록 목록</h2>
          <ul>
            {journals.map((journal) => (
              <li key={journal.id} className="journal-item">
                <div className="journal-details">
                  <span className="journal-date"><strong>날짜:</strong> {new Date(journal.createdAt).toLocaleDateString()}</span>
                  <span className="journal-content"><strong>내용:</strong> {journal.content.length > 100 ? `${journal.content.substring(0, 100)}...` : journal.content}</span>
                  <span className="journal-mood"><strong>기분:</strong> {moodEmojis[journal.mood] || moodEmojis[Mood.UNDEFINED]}</span>
                  <span className="journal-progress"><strong>진행률:</strong> {journal.progress === 100 ? "달성 완료" : `${journal.progress}% 달성`}</span>
                </div>
                <div className="journal-actions">
                  <button className="delete-btn" onClick={() => setDeleteModal({ isOpen: true, journalId: journal.id })}>
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 새 기록 작성 */}
      <div className="new-journal">
        <h2>새 기록 작성</h2>
        <form onSubmit={handleCreateJournal} className="journal-form">
          {/* 날짜 입력 필드 제거 */}
          <div className="form-group">
            <label htmlFor="content">내용:</label>
            <textarea
              id="content"
              value={newJournalData.content}
              onChange={(e) => setNewJournalData({ ...newJournalData, content: e.target.value })}
              placeholder="오늘의 기록을 작성해주세요..."
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="mood">기분:</label>
            <select
              id="mood"
              value={newJournalData.mood}
              onChange={(e) => setNewJournalData({ ...newJournalData, mood: e.target.value })}
            >
              {Object.keys(moodEmojis).map((m) => (
                <option key={m} value={m}>
                  {moodEmojis[m]} {m}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="progress">진행률:</label>
            <input
              type="range"
              id="progress"
              min="0"
              max="100"
              value={newJournalData.progress}
              onChange={(e) =>
                setNewJournalData({ ...newJournalData, progress: Number(e.target.value) })
              }
            />
            <span className="progress-value">{newJournalData.progress}%</span>
          </div>
          <button className="create-btn" type="submit">
            기록 추가
          </button>
        </form>
      </div>

      {/* 삭제 확인 모달 */}
      {deleteModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>기록 삭제</h3>
            <p>기록을 정말로 삭제하시겠습니까?</p>
            <div className="modal-actions">
              <button onClick={handleDeleteJournal} className="confirm-btn">삭제</button>
              <button onClick={() => setDeleteModal({ isOpen: false, journalId: null })} className="cancel-btn">취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Journal;
