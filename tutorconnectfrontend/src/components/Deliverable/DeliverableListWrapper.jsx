import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import deliverableService from './deliverableService';
import DeliverableList from './DeliverableList';
const DeliverableListWrapper = () => {
    const { roomId } = useParams();
    const [deliverables, setDeliverables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDeliverables = async () => {
            try {
                setLoading(true);
                const data = await deliverableService.getRoomDeliverables(roomId);
                setDeliverables(data);
            } catch (err) {
                setError(err.message || 'Failed to fetch deliverables');
            } finally {
                setLoading(false);
            }
        };

        fetchDeliverables();
    }, [roomId]);

    const handleDelete = async (id) => {
        try {
            await deliverableService.deleteDeliverable(id);
            setDeliverables(deliverables.filter(d => d.id !== id));
        } catch (err) {
            alert(`Error deleting deliverable: ${err.message}`);
        }
    };

    const handleEdit = (deliverable) => {
        // You might navigate to an edit form here
        console.log('Edit deliverable:', deliverable);
    };

    const handleGrade = async (id, gradeData) => {
        try {
            const response = await deliverableService.gradeDeliverable({
                deliverableId: id,
                ...gradeData
            });
            setDeliverables(deliverables.map(d =>
                d.id === id ? { ...d, ...response } : d
            ));
        } catch (err) {
            alert(`Error grading deliverable: ${err.message}`);
        }
    };

    const handleToggleVisibility = async (id, isVisible) => {
        try {
            const response = await deliverableService.setDeliverableVisibility(id, !isVisible);
            setDeliverables(deliverables.map(d =>
                d.id === id ? { ...d, isVisible: response.isVisible } : d
            ));
        } catch (err) {
            alert(`Error toggling visibility: ${err.message}`);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <DeliverableList
            deliverables={deliverables}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onGrade={handleGrade}
            onToggleVisibility={handleToggleVisibility}
            isTutor={true}
        />
    );
};

export default DeliverableListWrapper;