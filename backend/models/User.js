const bcrypt = require('bcryptjs');
const axios = require('axios');

class User {

    constructor(data = {}) {

        Object.assign(this, data);

        // Convert MySQL/PHP field names to Node.js field names
        if (data.user_type && !data.userType) {
            this.userType = data.user_type;
        }

        if (data.hospital_name && !data.hospitalName) {
            this.hospitalName = data.hospital_name;
        }

        if (data.created_at && !data.createdAt) {
            this.createdAt = data.created_at;
        }

        // MySQL id -> Node _id
        if (data.id && !this._id) {
            this._id = data.id;
        }

        // Create an ID only if PHP/MySQL did not return one
        if (!this._id) {
            this._id =
                `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        }

        if (!this.createdAt) {
            this.createdAt = new Date().toISOString();
        }
    }


    // =========================================================
    // SAVE USER
    // =========================================================

    async save() {

        const phpApiUrl = process.env.PHP_AUTH_API_URL;

        if (!phpApiUrl) {
            throw new Error(
                'PHP_AUTH_API_URL is not configured in .env'
            );
        }

        if (!this.email) {
            throw new Error('Email is required');
        }

        if (!this.password) {
            throw new Error('Password is required');
        }


        // =====================================================
        // HASH PASSWORD
        // =====================================================

        if (!this.password.startsWith('$2')) {

            this.password =
                await bcrypt.hash(this.password, 10);
        }


        // =====================================================
        // DATA SENT TO PHP
        // =====================================================

        const userData = {

            email: this.email,

            password: this.password,

            userType:
                this.userType ||
                this.user_type ||
                null,

            name:
                this.name ||
                null,

            phone:
                this.phone ||
                null,

            specialization:
                this.specialization ||
                null,

            department:
                this.department ||
                null,

            hospitalName:
                this.hospitalName ||
                this.hospital_name ||
                null,

            age:
                this.age ||
                null,

            gender:
                this.gender ||
                null,

            createdAt:
                this.createdAt ||
                new Date().toISOString()
        };


        try {

            // PHP API endpoint
            const url =
                `${phpApiUrl.replace(/\/$/, '')}/users`;


            console.log(
                '======================================'
            );

            console.log(
                'Sending user to PHP/MySQL'
            );

            console.log(
                'PHP API URL:',
                url
            );

            console.log(
                'User email:',
                userData.email
            );

            console.log(
                'User type:',
                userData.userType
            );

            console.log(
                '======================================'
            );


            // =================================================
            // SEND USER TO PHP
            // =================================================

            const response =
                await axios.post(
                    url,
                    userData,
                    {
                        timeout: 10000,

                        headers: {
                            'Content-Type':
                                'application/json'
                        }
                    }
                );


            console.log(
                'PHP API response:',
                response.data
            );


            // =================================================
            // COPY PHP RESPONSE TO NODE USER
            // =================================================

            if (response.data) {

                Object.assign(
                    this,
                    response.data
                );


                // Convert PHP/MySQL names back to Node names

                if (
                    response.data.user_type &&
                    !response.data.userType
                ) {

                    this.userType =
                        response.data.user_type;
                }


                if (
                    response.data.hospital_name &&
                    !response.data.hospitalName
                ) {

                    this.hospitalName =
                        response.data.hospital_name;
                }


                if (
                    response.data.created_at &&
                    !response.data.createdAt
                ) {

                    this.createdAt =
                        response.data.created_at;
                }


                // Convert MySQL id to Node _id

                if (
                    response.data.id &&
                    !this._id
                ) {

                    this._id =
                        response.data.id;
                }
            }


            return this;


        } catch (error) {

            console.error(
                '======================================'
            );

            console.error(
                'PHP API SAVE ERROR'
            );

            console.error(
                '======================================'
            );


            if (error.response) {

                console.error(
                    'HTTP Status:',
                    error.response.status
                );

                console.error(
                    'PHP Response:',
                    error.response.data
                );

            } else {

                console.error(
                    'Error:',
                    error.message
                );
            }


            console.error(
                '======================================'
            );


            let message;

            if (error.response) {

                message =
                    JSON.stringify(
                        error.response.data
                    );

            } else {

                message =
                    error.message;
            }


            throw new Error(
                `PHP API save error: ${message}`
            );
        }
    }


    // =========================================================
    // COMPARE PASSWORD
    // =========================================================

    async comparePassword(candidatePassword) {

        if (!candidatePassword) {
            return false;
        }

        if (!this.password) {
            return false;
        }

        return bcrypt.compare(
            candidatePassword,
            this.password
        );
    }


    // =========================================================
    // FIND ONE USER
    // =========================================================

    static async findOne(query = {}) {

        const phpApiUrl =
            process.env.PHP_AUTH_API_URL;


        if (!phpApiUrl) {

            console.error(
                'PHP_AUTH_API_URL is not configured'
            );

            return null;
        }


        try {

            const url =
                `${phpApiUrl.replace(/\/$/, '')}/users`;


            console.log(
                '======================================'
            );

            console.log(
                'Finding user using PHP/MySQL'
            );

            console.log(
                'PHP API URL:',
                url
            );

            console.log(
                'Search:',
                query
            );

            console.log(
                '======================================'
            );


            const response =
                await axios.get(
                    url,
                    {
                        params: query,

                        timeout: 10000,

                        headers: {
                            'Accept':
                                'application/json'
                        }
                    }
                );


            const data =
                response.data;


            console.log(
                'PHP API findOne response:',
                data
            );


            // PHP returns [] when user does not exist

            if (
                !data ||
                (
                    Array.isArray(data) &&
                    data.length === 0
                )
            ) {

                return null;
            }


            // PHP can return array or object

            const userData =
                Array.isArray(data)
                    ? data[0]
                    : data;


            if (!userData) {
                return null;
            }


            return new User(userData);


        } catch (error) {

            console.error(
                '======================================'
            );

            console.error(
                'PHP API FIND USER ERROR'
            );

            console.error(
                '======================================'
            );


            if (error.response) {

                console.error(
                    'HTTP Status:',
                    error.response.status
                );

                console.error(
                    'PHP Response:',
                    error.response.data
                );

            } else {

                console.error(
                    'Error:',
                    error.message
                );
            }


            console.error(
                '======================================'
            );


            return null;
        }
    }


    // =========================================================
    // DELETE ALL USERS
    // =========================================================

    static async deleteMany() {

        const phpApiUrl =
            process.env.PHP_AUTH_API_URL;


        if (!phpApiUrl) {

            throw new Error(
                'PHP_AUTH_API_URL is not configured'
            );
        }


        try {

            const url =
                `${phpApiUrl.replace(/\/$/, '')}/users`;


            await axios.delete(
                url,
                {
                    timeout: 10000
                }
            );


            console.log(
                'All users deleted successfully'
            );


        } catch (error) {

            console.error(
                'PHP API delete error:',
                error.message
            );


            if (error.response) {

                console.error(
                    'Status:',
                    error.response.status
                );

                console.error(
                    'Response:',
                    error.response.data
                );
            }


            throw new Error(
                'Failed to delete users'
            );
        }
    }
}


module.exports = User;