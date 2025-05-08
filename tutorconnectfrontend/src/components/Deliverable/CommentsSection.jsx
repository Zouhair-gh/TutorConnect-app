import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { FiUser, FiMessageSquare, FiSend } from "react-icons/fi";
import { Form, Button, ListGroup, Badge } from "react-bootstrap";
import moment from "moment";

const CommentsSection = ({ deliverableId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchComments = async () => {
        try {
            const response = await axiosClient.get(`/deliverables/${deliverableId}/comments`);
            setComments(response.data);
        } catch (err) {
            setError("Failed to load comments");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            setLoading(true);
            await axiosClient.post(`/deliverables/${deliverableId}/comments`, newComment, {
                headers: {
                    'Content-Type': 'text/plain'
                }
            });
            setNewComment("");
            fetchComments();
        } catch (err) {
            setError("Failed to post comment");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [deliverableId]);

    return (
        <div className="card border-0 shadow-sm mt-4">
            <div className="card-body">
                <h5 className="fw-bold mb-4">
                    <FiMessageSquare className="me-2" /> Discussion ({comments.length})
                </h5>

                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {error}
                        <button type="button" className="btn-close" onClick={() => setError("")}></button>
                    </div>
                )}

                <ListGroup variant="flush">
                    {comments.map(comment => (
                        <ListGroup.Item key={comment.id} className="border-0 px-0 py-3">
                            <div className="d-flex">
                                <div className="flex-shrink-0">
                                    <div className="bg-light rounded-circle p-2">
                                        <FiUser className="text-primary" />
                                    </div>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <h6 className="mb-0 fw-bold">
                                            {comment.userName}
                                            {comment.userRole === 'TUTOR' && (
                                                <Badge bg="primary" className="ms-2">Tutor</Badge>
                                            )}
                                        </h6>
                                        <small className="text-muted">
                                            {moment(comment.createdAt).fromNow()}
                                        </small>
                                    </div>
                                    <p className="mb-0">{comment.content}</p>
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))}

                    {comments.length === 0 && (
                        <ListGroup.Item className="border-0 px-0 py-3 text-center text-muted">
                            No comments yet. Be the first to comment!
                        </ListGroup.Item>
                    )}
                </ListGroup>

                <Form onSubmit={handleSubmit} className="mt-4">
                    <div className="d-flex align-items-center">
                        <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-grow-1 me-2"
                        />
                        <Button
                            type="submit"
                            variant="primary"
                            className="rounded-circle p-2"
                            style={{ width: '40px', height: '40px' }}
                            disabled={loading || !newComment.trim()}
                        >
                            {loading ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                                <FiSend />
                            )}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default CommentsSection;