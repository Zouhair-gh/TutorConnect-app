import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../../../api/axiosClient';

const SessionResources = () => {
    const { sessionId } = useParams();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await axiosClient.get(`/sessions/${sessionId}/resources`);
                setResources(response.data);
            } catch (err) {
                setError('Failed to load resources. Please try again later.');
                console.error('Error fetching resources:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, [sessionId]);

    const handleDownload = (resourceId, filename) => {
        // Implement download logic
        console.log(`Downloading ${filename} (ID: ${resourceId})`);
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading session resources...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h3>Session Resources</h3>
                            <p className="mb-0 text-muted">
                                Materials for Session #{sessionId}
                            </p>
                        </div>
                        <div className="card-body">
                            {resources.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="bi bi-folder-x" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                                    <h5 className="mt-3">No resources available for this session</h5>
                                    <p className="text-muted">
                                        Check back later or contact your tutor for materials.
                                    </p>
                                </div>
                            ) : (
                                <div className="list-group">
                                    {resources.map((resource) => (
                                        <div key={resource.id} className="list-group-item">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h5 className="mb-1">{resource.name}</h5>
                                                    <small className="text-muted">
                                                        {resource.type} • {resource.size} • Uploaded on{' '}
                                                        {new Date(resource.uploadDate).toLocaleDateString()}
                                                    </small>
                                                </div>
                                                <div>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary me-2"
                                                        onClick={() => handleDownload(resource.id, resource.name)}
                                                    >
                                                        <i className="bi bi-download me-1"></i> Download
                                                    </button>
                                                    {resource.previewable && (
                                                        <button className="btn btn-sm btn-outline-secondary">
                                                            <i className="bi bi-eye me-1"></i> Preview
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionResources;