import React, { useState, useEffect } from 'react';
import { Form, Button, ListGroup, Spinner } from 'react-bootstrap';
import { FiSend, FiUser, FiMessageSquare } from 'react-icons/fi';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../api/ContextProvider';

const CommentsSection = ({ deliverableId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { currentUser } = useAuth();

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(`/deliverables/${deliverableId}/comments`);
            setComments(response.data);
            setError('');
        } catch (err) {
            setError('Failed to load comments');
            console.error('Error fetching comments:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [deliverableId]);

    const handleSubmitComment = async (e) => {
        e.preventDefault();

        if (!newComment.trim()) return;

        try {
            setSubmitting(true);
            const response = await axiosClient.post(`/deliverables/${deliverableId}/comments`, {
                content: newComment,
            });

            setComments([...comments, response.data]);
            setNewComment('');
            setError('');
        } catch (err) {
            setError('Failed to post comment');
            console.error('Error posting comment:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-body">
                <div className="d-flex align-items-center mb-4">
                    <FiMessageSquare className="text-primary me-2" size={20} />
                    <h5 className="card-title fw-bold mb-0">Comments</h5>
                </div>

                {error && (
                    <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
                        {error}
                        <button type="button" className="btn-close" onClick={() => setError('')}></button>
                    </div>
                )}

                <div className="comments-container mb-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {loading ? (
                        <div className="d-flex justify-content-center py-4">
                            <Spinner animation="border" size="sm" role="status" />
                            <span className="ms-2">Loading comments...</span>
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="text-center py-4 text-muted">
                            <FiMessageSquare size={24} className="mb-2" />
                            <p>No comments yet. Be the first to comment!</p>
                        </div>
                    ) : (
                        <ListGroup variant="flush">
                            {comments.map((comment) => (
                                <ListGroup.Item key={comment.id} className="border-bottom py-3">
                                    <div className="d-flex">
                                        <div className="comment-avatar me-3">
                                            {comment.authorAvatar ? (
                                                <img
                                                    src={comment.authorAvatar}
                                                    alt={comment.authorName}
                                                    className="rounded-circle"
                                                    width="40"
                                                    height="40"
                                                />
                                            ) : (
                                                <div className="d-flex justify-content-center align-items-center bg-light rounded-circle"
                                                     style={{ width: '40px', height: '40px' }}>
                                                    <FiUser />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <h6 className="mb-0 fw-bold">{comment.authorName}</h6>
                                                <small className="text-muted">{formatDate(comment.createdAt)}</small>
                                            </div>
                                            <p className="mb-0">{comment.content}</p>
                                            {comment.authorId === currentUser?.id && (
                                                <div className="mt-2">
                                                    <button
                                                        className="btn btn-sm text-danger"
                                                        onClick={async () => {
                                                            try {
                                                                await axiosClient.delete(`/deliverables/${deliverableId}/comments/${comment.id}`);
                                                                setComments(comments.filter(c => c.id !== comment.id));
                                                            } catch (err) {
                                                                setError('Failed to delete comment');
                                                            }
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </div>

                <Form onSubmit={handleSubmitComment}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            as="textarea"
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows={3}
                            disabled={submitting}
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={!newComment.trim() || submitting}
                        >
                            {submitting ? (
                                <>
                                    <Spinner animation="border" size="sm" role="status" className="me-2" />
                                    Posting...
                                </>
                            ) : (
                                <>
                                    <FiSend className="me-1" /> Post Comment
                                </>
                            )}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default CommentsSection;