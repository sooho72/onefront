// src/components/CommentModal.jsx

import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import commentService from '../services/commentService'; // commentService 임포트
import CommentList from '../components/CommentList' ; // CommentList 임포트

const CommentModal = ({ show, handleClose, challengeId, currentUser, onCommentAdded }) => {
    const [content, setContent] = useState('');
    const [commentRefresh, setCommentRefresh] = useState(0); // 댓글 목록 갱신을 위한 상태

    const handleSubmit = async () => {
        if (!currentUser) {
            alert('로그인이 필요합니다.');
            return;
        }

        if (content.trim() === '') {
            alert('댓글 내용을 입력해주세요.');
            return;
        }

        try {
            await commentService.addComment({
                challengeId: challengeId,
                content: content,
            });
            setContent('');
            setCommentRefresh(prev => prev + 1); // 댓글 목록 갱신
            onCommentAdded(); // 부모 컴포넌트에 알림 (필요 시)
        } catch (error) {
            console.error('댓글 추가 중 오류 발생:', error);
            alert('댓글을 추가하는 데 실패했습니다.');
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>응원댓글</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* 댓글 목록 */}
                <CommentList
                    challengeId={challengeId}
                    currentUser={currentUser}
                    refresh={commentRefresh}
                />
                {/* 댓글 작성 폼 */}
                <Form className="mt-3">
                    <Form.Group controlId="commentContent">
                        <Form.Label>댓글 작성</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="응원댓글을 작성하세요..."
                            required
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    취소
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    작성하기
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CommentModal;
