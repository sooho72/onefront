// src/components/CommentList.jsx

import React, { useState, useEffect } from "react";
import CommentService from "../services/commentService";

const CommentList = ({ challengeId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!challengeId) {
            setError("챌린지 ID가 없습니다.");
            setLoading(false);
            return;
        }

        const fetchComments = async () => {
            try {
                const response = await CommentService.getCommentsByChallengeId(challengeId);
                setComments(response.data);
            } catch (err) {
                console.error("댓글을 불러오는 중 오류 발생:", err);
                setError("댓글을 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [challengeId]);

    if (loading) return <p>댓글을 불러오는 중...</p>;
    if (error) return <p>{error}</p>;
    if (comments.length === 0) return <p>댓글이 없습니다.</p>;

    return (
        <div>
            <h3>댓글 목록</h3>
            <ul>
                {comments.map(comment => (
                    <li key={comment.id}>
                        <strong>{comment.username}</strong>: {comment.content}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CommentList;
