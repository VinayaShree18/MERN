const UserDetails = require('../models/UserDetails');

const saveUserDetails = async (req, res) => {
    const { id, user } = req.body;

    try {
        const updatedUserDetails = await UserDetails.findByIdAndUpdate(id, user, { new: true, upsert: true });
        res.status(200).json({ success: true, userDetails: updatedUserDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to save user details', error });
    }
};

const getUserDetailsById = async (req, res) => {
    const { userId } = req.params;

    try {
        const userDetails = await UserDetails.findById(userId);
        if (!userDetails) {
            return res.status(404).json({ success: false, message: 'User details not found' });
        }
        res.status(200).json({ success: true, userDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch user details', error });
    }
};

module.exports = {
    saveUserDetails,
    getUserDetailsById,
};
