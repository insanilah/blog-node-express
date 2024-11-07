import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema({
    username: { type: String, required: true },
    activityType: {
        type: String,
        enum: ['CREATE', 'VIEW', 'LIKE', 'COMMENT', 'SHARE', 'EDIT', 'DELETE', 'LOGIN', 'LOGOUT'],
        required: true
    },
    postId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
}, { collection: 'userActivity' });

// Model untuk user activity
const UserActivity = mongoose.model('UserActivity', userActivitySchema);

export default UserActivity;