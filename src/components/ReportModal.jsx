import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import reportService from '../services/reportService';

const ReportModal = ({ show, onHide, commentId }) => {
    const [reason, setReason] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reason.trim()) {
            alert("신고 사유를 입력해주세요.");
            return;
        }

        try {
            await reportService.createReport(commentId, reason);
            alert("신고가 접수되었습니다.");
            setReason("");
            onHide(); // 모달 닫기
        } catch (error) {
            console.error("신고 등록 중 오류 발생:", error);
            alert("신고 등록에 실패했습니다.");
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>댓글 신고</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="reportReason">
                        <Form.Label>신고 사유</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="신고 사유를 입력해주세요."
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-end mt-3">
                        <Button variant="secondary" onClick={onHide} className="me-2">
                            취소
                        </Button>
                        <Button variant="danger" type="submit">
                            신고하기
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ReportModal;