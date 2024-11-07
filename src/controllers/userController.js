import userActivityService from '../services/userActivityService.js';
import userService from '../services/userService.js';
import ErrorResponse from '../utils/ErrorResponse.js';

const findAllUser = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchTerm = req.query.searchTerm || '';

    const response = await userService.getAllUsers(page, limit, searchTerm);

    if (response instanceof ErrorResponse) {
        return res.status(parseInt(response.code)).json(response);
    }

    return res.status(200).json(response);
};

const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await userService.getUserById(id);

        if (response instanceof ErrorResponse) {
            return res.status(parseInt(response.code)).json(response);
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json(new ErrorResponse("500", error.message));
    }
};

const getUserActivitiesByUsername = async (req, res) => {
    const { username } = req.params;

    try {
        const response = await userActivityService.getUserActivitiesByUsername(username);

        if (response instanceof ErrorResponse) {
            return res.status(parseInt(response.code)).json(response);
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json(new ErrorResponse("500", error.message));
    }
};

const aggregateUserActivitiesSortedByDay = async (req, res) => {
    const { username } = req.params;
    
    try {
        const response = await userActivityService.aggregateUserActivitiesSortedByDay(username);
        
        if (response instanceof ErrorResponse) {
            return res.status(parseInt(response.code)).json(response);
        }

        return res.status(200).json(response);
    } catch (error) {        
        return res.status(500).json(new ErrorResponse("500", error.message));
    }
}

export default {
    findAllUser,
    getUserById,
    getUserActivitiesByUsername,
    aggregateUserActivitiesSortedByDay
};
