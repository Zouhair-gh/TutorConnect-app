import axiosClient from '../../api/axiosClient';
// Service for handling deliverable-related API calls
const deliverableService = {
    // Get all deliverables for a room
    getRoomDeliverables: async (roomId) => {
        try {
            const response = await axiosClient.get(`/deliverables/room/${roomId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching room deliverables:', error);
            throw error;
        }
    },

    // Get a single deliverable by ID
    getDeliverableById: async (deliverableId) => {
        try {
            const response = await axiosClient.get(`/deliverables/${deliverableId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching deliverable ${deliverableId}:`, error);
            throw error;
        }
    },

    // Create a new deliverable
    createDeliverable: async (deliverableData) => {
        try {
            const request = {
                roomId: deliverableData.roomId,
                title: deliverableData.title,
                description: deliverableData.description,
                deadline: deliverableData.deadline,
                maxPoints: deliverableData.maxPoints,
                attachmentUrl: deliverableData.attachmentUrl,
                isVisible: deliverableData.isVisible,
                participantIds: deliverableData.assignedParticipantIds
            };

            const response = await axiosClient.post('/deliverables', request);
            return response.data;
        } catch (error) {
            console.error('Error creating deliverable:', error);
            throw error;
        }
    },

    // Update an existing deliverable
    updateDeliverable: async (deliverableId, deliverableData) => {
        try {
            const request = {
                id: deliverableId,
                roomId: deliverableData.roomId,
                title: deliverableData.title,
                description: deliverableData.description,
                deadline: deliverableData.deadline,
                maxPoints: deliverableData.maxPoints,
                attachmentUrl: deliverableData.attachmentUrl,
                isVisible: deliverableData.isVisible,
                participantIds: deliverableData.assignedParticipantIds
            };

            const response = await axiosClient.put(`/deliverables/${deliverableId}`, request);
            return response.data;
        } catch (error) {
            console.error(`Error updating deliverable ${deliverableId}:`, error);
            throw error;
        }
    },

    // Delete a deliverable
    deleteDeliverable: async (deliverableId) => {
        try {
            await axiosClient.delete(`/deliverables/${deliverableId}`);
        } catch (error) {
            console.error(`Error deleting deliverable ${deliverableId}:`, error);
            throw error;
        }
    },

    // Submit a deliverable
    submitDeliverable: async (submissionData, files) => {
        try {
            const formData = new FormData();

            // Add JSON data as a blob
            const requestBlob = new Blob([JSON.stringify(submissionData)], {
                type: 'application/json'
            });
            formData.append('request', requestBlob);

            // Add files if present
            if (files && files.length > 0) {
                files.forEach(file => {
                    formData.append('files', file);
                });
            }

            const response = await axiosClient.post('/deliverables/submit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error submitting deliverable:', error);
            throw error;
        }
    },

    // Grade a deliverable
    gradeDeliverable: async (gradeData) => {
        try {
            const response = await axiosClient.post('/deliverables/grade', gradeData);
            return response.data;
        } catch (error) {
            console.error('Error grading deliverable:', error);
            throw error;
        }
    },

    // Add a comment to a deliverable
    addComment: async (deliverableId, content) => {
        try {
            const response = await axiosClient.post(
                `/deliverables/${deliverableId}/comments`,
                content
            );
            return response.data;
        } catch (error) {
            console.error(`Error adding comment to deliverable ${deliverableId}:`, error);
            throw error;
        }
    },

    // Get comments for a deliverable
    getDeliverableComments: async (deliverableId) => {
        try {
            const response = await axiosClient.get(`/deliverables/${deliverableId}/comments`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching comments for deliverable ${deliverableId}:`, error);
            throw error;
        }
    },

    // Set deliverable visibility
    setDeliverableVisibility: async (deliverableId, visible) => {
        try {
            const response = await axiosClient.patch(
                `/deliverables/${deliverableId}/visibility?visible=${visible}`
            );
            return response.data;
        } catch (error) {
            console.error(`Error setting visibility for deliverable ${deliverableId}:`, error);
            throw error;
        }
    },

    // Get deliverables for a participant
    getParticipantDeliverables: async (participantId) => {
        try {
            const response = await axiosClient.get(`/deliverables/participant/${participantId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching deliverables for participant ${participantId}:`, error);
            throw error;
        }
    },

    // Get deliverables for a tutor
    getTutorDeliverables: async () => {
        try {
            const response = await axiosClient.get('/deliverables/tutor');
            return response.data;
        } catch (error) {
            console.error('Error fetching tutor deliverables:', error);
            throw error;
        }
    }
};

export default deliverableService;