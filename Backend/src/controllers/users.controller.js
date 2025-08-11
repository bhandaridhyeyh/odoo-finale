// src/controllers/user.controller.js
import User from "../models/User.model.js";

// Get current user's profile
export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Update current user's profile
export const updateMyProfile = async (req, res) => {
    try {
        const allowedUpdates = ["firstName", "lastName", "phone", "city", "country", "avatarUrl"];
        const updates = {};

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        const updatedUser = await User.findByIdAndUpdate(
            req.user.sub,
            { $set: updates },
            { new: true, runValidators: true, select: "-password" }
        );

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.json(updatedUser);
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get user by ID (admin or self)
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// List all users (admin only)
export const listUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find().select("-password").skip(skip).limit(limit).sort({ createdAt: -1 }),
            User.countDocuments()
        ]);

        res.json({
            users,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error("Error listing users:", err);
        res.status(500).json({ message: "Server error" });
    }
};
