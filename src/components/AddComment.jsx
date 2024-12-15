// src/components/AddComment.jsx

import React, { useState, useContext } from "react";
import CommentService from "../services/commentService";
import { AuthContext } from "../context/AuthContext";

const AddComment = ({ challengeId, onCommentAdded }) => {
    const { currentUser } = useContext(AuthContext);
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("댓글 추가 시도: challengeId =", challengeId, ", content =", content); // 디버깅 로그
        if (!content.trim()) {
            setError("댓글 내용을 입력해주세요.");
            return;
        }

        setLoading(true);
        setError("");

        const commentData = {
            challengeId: challengeId, // 올바른 challengeId 전달
            content: content.trim(),
            // isPositive 필드 제거
        };

        try {
            await CommentService.addComment(commentData);
            setContent("");
            if (onCommentAdded) {
                onCommentAdded(); // 댓글이 추가된 후 부모 컴포넌트에 알림
            }
        } catch (err) {
            console.error("댓글 추가 중 오류 발생:", err);
            setError(err.message || "댓글 추가 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) return null; // 로그인하지 않은 사용자는 댓글 추가 불가

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                    rows="4"
                    cols="50"
                />
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div>
                <button type="submit" disabled={loading}>
                    {loading ? "추가 중..." : "댓글 추가"}
                </button>
            </div>
        </form>
    );
};

export default AddComment;
