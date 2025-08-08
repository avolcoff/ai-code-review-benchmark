const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validateEmail, validatePassword } = require('../utils/validation');
const { logger } = require('../utils/logger');
const { UserModel } = require('../models/user');

class UserService {
    constructor() {
        this.saltRounds = 12;
        this.jwtSecret = process.env.JWT_SECRET;
        this.jwtExpiry = '24h';
    }

    /**
     * Create a new user with proper validation and security
     * @param {Object} userData - User data object
     * @returns {Promise<Object>} Created user object
     */
    async createUser(userData) {
        try {
            // Validate input data
            if (!userData.email || !userData.password) {
                throw new Error('Email and password are required');
            }

            if (!validateEmail(userData.email)) {
                throw new Error('Invalid email format');
            }

            if (!validatePassword(userData.password)) {
                throw new Error('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
            }

            // Check if user already exists
            const existingUser = await UserModel.findOne({ email: userData.email });
            if (existingUser) {
                throw new Error('User already exists');
            }

            // Hash password securely
            const hashedPassword = await bcrypt.hash(userData.password, this.saltRounds);

            // Create user with hashed password
            const user = new UserModel({
                email: userData.email,
                password: hashedPassword,
                name: userData.name || '',
                role: 'user',
                createdAt: new Date(),
                isActive: true
            });

            const savedUser = await user.save();

            // Return user without password
            const { password, ...userWithoutPassword } = savedUser.toObject();
            return userWithoutPassword;

        } catch (error) {
            logger.error('Error creating user:', error);
            throw error;
        }
    }

    /**
     * Authenticate user with secure password comparison
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} Authentication result with JWT token
     */
    async authenticateUser(email, password) {
        try {
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            // Find user by email
            const user = await UserModel.findOne({ email: email.toLowerCase() });
            if (!user) {
                throw new Error('Invalid credentials');
            }

            // Verify password using constant-time comparison
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid credentials');
            }

            if (!user.isActive) {
                throw new Error('Account is deactivated');
            }

            // Generate JWT token
            const token = jwt.sign(
                { 
                    userId: user._id, 
                    email: user.email, 
                    role: user.role 
                },
                this.jwtSecret,
                { expiresIn: this.jwtExpiry }
            );

            // Update last login
            await UserModel.updateOne(
                { _id: user._id },
                { lastLoginAt: new Date() }
            );

            return {
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            };

        } catch (error) {
            logger.error('Authentication error:', error);
            throw error;
        }
    }

    /**
     * Get user by ID with proper authorization
     * @param {string} userId - User ID
     * @param {string} requestingUserId - ID of user making the request
     * @returns {Promise<Object>} User object
     */
    async getUserById(userId, requestingUserId) {
        try {
            if (!userId) {
                throw new Error('User ID is required');
            }

            const user = await UserModel.findById(userId).select('-password');
            if (!user) {
                throw new Error('User not found');
            }

            // Check if user is requesting their own data or is admin
            if (userId !== requestingUserId && !this.isAdmin(requestingUserId)) {
                throw new Error('Unauthorized access');
            }

            return user;

        } catch (error) {
            logger.error('Error getting user by ID:', error);
            throw error;
        }
    }

    /**
     * Update user with validation and security checks
     * @param {string} userId - User ID
     * @param {Object} updateData - Data to update
     * @param {string} requestingUserId - ID of user making the request
     * @returns {Promise<Object>} Updated user object
     */
    async updateUser(userId, updateData, requestingUserId) {
        try {
            if (!userId) {
                throw new Error('User ID is required');
            }

            // Check authorization
            if (userId !== requestingUserId && !this.isAdmin(requestingUserId)) {
                throw new Error('Unauthorized access');
            }

            // Prevent updating sensitive fields
            const allowedFields = ['name', 'email'];
            const filteredData = {};
            
            for (const field of allowedFields) {
                if (updateData[field] !== undefined) {
                    filteredData[field] = updateData[field];
                }
            }

            // Validate email if being updated
            if (filteredData.email && !validateEmail(filteredData.email)) {
                throw new Error('Invalid email format');
            }

            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                { ...filteredData, updatedAt: new Date() },
                { new: true, runValidators: true }
            ).select('-password');

            if (!updatedUser) {
                throw new Error('User not found');
            }

            return updatedUser;

        } catch (error) {
            logger.error('Error updating user:', error);
            throw error;
        }
    }

    /**
     * Delete user with proper cleanup
     * @param {string} userId - User ID
     * @param {string} requestingUserId - ID of user making the request
     * @returns {Promise<boolean>} Success status
     */
    async deleteUser(userId, requestingUserId) {
        try {
            if (!userId) {
                throw new Error('User ID is required');
            }

            // Only allow users to delete their own account or admin to delete any
            if (userId !== requestingUserId && !this.isAdmin(requestingUserId)) {
                throw new Error('Unauthorized access');
            }

            const result = await UserModel.findByIdAndDelete(userId);
            if (!result) {
                throw new Error('User not found');
            }

            logger.info(`User ${userId} deleted by ${requestingUserId}`);
            return true;

        } catch (error) {
            logger.error('Error deleting user:', error);
            throw error;
        }
    }

    /**
     * Check if user is admin
     * @param {string} userId - User ID
     * @returns {Promise<boolean>} Admin status
     */
    async isAdmin(userId) {
        try {
            const user = await UserModel.findById(userId).select('role');
            return user && user.role === 'admin';
        } catch (error) {
            logger.error('Error checking admin status:', error);
            return false;
        }
    }
}

module.exports = { UserService }; 