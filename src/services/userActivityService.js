import UserActivity from '../models/UserActivity.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import Response from '../utils/Response.js';
import formatDate from '../utils/FormatDate.js';

const createUserActivity = async (username, postId, activityType) => {
    try {
        const activity = new UserActivity({ username, postId, activityType });
        await activity.save();
        console.log('User activity saved:', activity);
    } catch (error) {
        console.error('Error saving user activity:', error);
        return new ErrorResponse("500", error.message);
    }
};

const getUserActivitiesByUsername = async (username) => {
    try {
        const activities = await UserActivity.find({ username }).select('-__v');
        // Memformat setiap timestamp di dalam data yang diambil
        console.log("activities:",activities);
        const formattedActivities = activities.map(activity => ({
            ...activity._doc,
            timestamp: formatDate.simpleFormatDate(activity.timestamp),
        }));
        return formattedActivities;
    } catch (error) {
        console.error('Error retrieving user activities:', error);
        return new ErrorResponse("500", error.message);
    }
};

// Fungsi untuk agregasi berdasarkan username dan aktivitas per hari
const aggregateUserActivitiesSortedByDay = async (username) => {
    try {
        const results = await UserActivity.aggregate([
            // Step 1: Filter berdasarkan username
            {
                $match: { username: username }
            },
            // Step 2: Proyeksikan field yang dibutuhkan
            {
                $project: {
                    day: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    activityType: 1
                }
            },
            // Step 3: Group berdasarkan 'day' dan 'activityType', dan hitung jumlah aktivitas
            {
                $group: {
                    _id: { day: "$day", activityType: "$activityType" },
                    activityCount: { $sum: 1 }
                }
            },
            // Step 4: Proyeksikan ulang hasil agregasi
            {
                $project: {
                    day: "$_id.day",
                    activityType: "$_id.activityType",
                    activityCount: 1,
                    _id: 0
                }
            },
            // Step 5: Sort hasil berdasarkan 'day'
            {
                $sort: { day: 1 }
            }
        ]);

        return results;
    } catch (error) {
        console.error("Error aggregating user activities:", error);
        return new ErrorResponse("500", error.message);
    }
};

export default {
    createUserActivity,
    getUserActivitiesByUsername,
    aggregateUserActivitiesSortedByDay
};
