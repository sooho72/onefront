import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Mood from "../../models/Mood";
import JournalModel from "../../models/Journal";
import journalService from "../../services/journalService";
import challengeService from "../../services/challengeService"; 
import '../../pages/journal/Journal.css';

const Journal = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  
  const [challenge, setChallenge] = useState(null);
  const [journals, setJournals] = useState([]);
  const [selectedJournal, setSelectedJournal] = useState(null);
  
  // 오늘 날짜를 "YYYY-MM-DD" 형태로 포맷
  const today = new Date().toISOString().split('T')[0];

  const [newJournalData, setNewJournalData] = useState({
    challenge: Number(challengeId),
    date: today, // 오늘 날짜 기본값 설정
    content: "",
    mood: Mood.UNDEFINED,
    progress: 0,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // 해당 챌린지 정보 가져오기 (필요하다면 유지)
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const cData = await challengeService.getChallengeById(challengeId);
        setChallenge(cData);
      } catch (error) {
        console.error("Error fetching challenge:", error);
      }
    };
    fetchChallenge();
  }, [challengeId]);

  // 해당 챌린지의 Journal 목록 가져오기
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

  const handleSelectJournal = async (journalId) => {
    try {
      const journal = await journalService.getJournalById(journalId);
      setSelectedJournal(journal);
    } catch (error) {
      console.error("Error fetching journal:", error);
    }
  };

  const handleCreateJournal = async (e) => {
    e.preventDefault();
    try {
      const newJournal = new JournalModel(
        null,
        newJournalData.challenge,
        newJournalData.date,
        newJournalData.content,
        newJournalData.mood,
        newJournalData.progress
      );

      const created = await journalService.createJournal(newJournal);
      const updatedList = await journalService.getJournalsByChallengeId(challengeId);
      setJournals(updatedList);

      // 폼 초기화
      setNewJournalData({
        challenge: Number(challengeId),
        date: today,
        content: "",
        mood: Mood.UNDEFINED,
        progress: 0,
      });
      setSelectedJournal(created);
    } catch (error) {
      console.error("Error creating journal:", error);
    }
  };

  const handleDeleteJournal = async () => {
    if (!selectedJournal) return;
    try {
      await journalService.deleteJournal(selectedJournal.id);
      setSelectedJournal(null);

      const updatedList = await journalService.getJournalsByChallengeId(challengeId);
      setJournals(updatedList);
    } catch (error) {
      console.error("Error deleting journal:", error);
    }
  };

  return (
    <div className="JournalContainer">
      <div className="JournalContentWrapper">
        {challenge && (
          <div className="ChallengeHeader">
            <h1>{challenge.title}</h1>
            <p>{challenge.description}</p>
          </div>
        )}
        {loading && <p className="loading-message">기록을 불러오는 중입니다...</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {!loading && journals.length === 0 && <p className="empty-message">등록된 기록이 아직 없습니다.</p>}

        <div className="JournalContent">
          {/* Journal 목록 */}
          <div className="JournalList">
            <ul>
              {journals.map((journal) => (
                <li 
                  key={journal.id} 
                  onClick={() => handleSelectJournal(journal.id)} 
                >
                  <div className="journal-item">
                    <span className="journal-date"><strong>Date:</strong> {journal.date}</span>
                    <span className="journal-preview"><strong>Content:</strong> {journal.content.substring(0, 20)}...</span>
                    <span className="journal-mood"><strong>Mood:</strong> {journal.mood}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Journal 상세보기 */}
          <div className="JournalDetails">
            {selectedJournal && (
              <div className="JournalEntry">
                <h2>Diary Entry</h2>
                <div className="JournalView">
                  <p><strong>Date:</strong> {selectedJournal.date}</p>
                  <p><strong>Content:</strong> {selectedJournal.content}</p>
                  <p><strong>Mood:</strong> {selectedJournal.mood}</p>
                  <p><strong>Progress:</strong> {selectedJournal.progress}%</p>
                  <div className="button-group">
                    <button onClick={handleDeleteJournal}>Delete</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 새로운 Journal 생성 폼 */}
          <div className="NewJournal">
            <h2>Write a new Diary Entry</h2>
            <form onSubmit={handleCreateJournal}>
              <div>
                <label>Date:</label>
                <input
                  type="text"
                  value={newJournalData.date}
                  onChange={(e) => setNewJournalData({ ...newJournalData, date: e.target.value })}
                />
              </div>
              <div>
                <label>Content:</label>
                <textarea
                  value={newJournalData.content}
                  onChange={(e) => setNewJournalData({ ...newJournalData, content: e.target.value })}
                />
              </div>
              <div>
                <label>Mood:</label>
                <select
                  value={newJournalData.mood}
                  onChange={(e) => setNewJournalData({ ...newJournalData, mood: e.target.value })}
                >
                  {Object.values(Mood).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div className="progress-edit">
                <label>Progress:</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newJournalData.progress}
                  onChange={(e) =>
                    setNewJournalData({ ...newJournalData, progress: Number(e.target.value) })
                  }
                />
                <span>{newJournalData.progress}%</span>
              </div>
              <button type="submit">Create Entry</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Journal;
