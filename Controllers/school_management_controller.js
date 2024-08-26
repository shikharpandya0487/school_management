const db = require('../ConnectDb/db');

//Referred from web
// Haversine formula to calculate the distance between two coordinates
const calculateGeographicalDistance = (lat1, lon1, lat2, lon2) => {
    const earthRadiusKm = 6371;
    const deltaLatitude = (lat2 - lat1) * Math.PI / 180;
    const deltaLongitude = (lon2 - lon1) * Math.PI / 180;
    const haversineA =
        0.5 - Math.cos(deltaLatitude) / 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * (1 - Math.cos(deltaLongitude)) / 2;
    return earthRadiusKm * 2 * Math.asin(Math.sqrt(haversineA));
};

// Add school controller
const addSchoolController = async (req, res) => {
    try {
        const { name, address, latitude, longitude } = req.body;

        // Validating that all fields are provided
        if (!name || !address || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ message: "All fields (name, address, latitude, longitude) are required." });
        }

        // Validating that name and address are strings and not empty
        if (typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ message: "Name must be a non-empty string." });
        }

        if (typeof address !== 'string' || address.trim() === '') {
            return res.status(400).json({ message: "Address must be a non-empty string." });
        }

        // Validating that latitude and longitude are numbers
        const latitudeNumber = parseFloat(latitude);
        const longitudeNumber = parseFloat(longitude);

        if (isNaN(latitudeNumber) || latitudeNumber < -90 || latitudeNumber > 90) {
            return res.status(400).json({ message: "Latitude must be a valid number between -90 and 90." });
        }

        if (isNaN(longitudeNumber) || longitudeNumber < -180 || longitudeNumber > 180) {
            return res.status(400).json({ message: "Longitude must be a valid number between -180 and 180." });
        }

        // Inserting data into the database
        const [result] = await db.query(
            `INSERT INTO school (name, address, latitude, longitude) VALUES (?, ?, ?, ?)`,
            [name, address, latitudeNumber, longitudeNumber]
        );

        if (!result.affectedRows) {
            return res.status(500).json({ message: "Failed to add the school. Please check your input and try again." });
        }

        // Respond with success
        res.status(201).json({ message: "School added successfully", schoolId: result.insertId });

    } catch (error) {
        console.error("Error adding new school:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// List schools
const listAllSchools = async (req, res) => {
    try {
        const { latitude, longitude } = req.query;

        // Validating input and convert to numbers
        const latitudeNumber = parseFloat(latitude);
        const longitudeNumber = parseFloat(longitude);

        if (isNaN(latitudeNumber) || isNaN(longitudeNumber)) {
            return res.status(400).json({ message: "Invalid input data. Latitude and Longitude should be numbers." });
        }

        // Fetching schools from the database
        const [schoolRecords] = await db.execute('SELECT * FROM school');

        // Calculate distances and sort
        const schoolsSortedByProximity = schoolRecords.map(school => {
            const distance = calculateGeographicalDistance(latitudeNumber, longitudeNumber, school.latitude, school.longitude);
            return {
                ...school,
                distance
            };
        }).sort((schoolA, schoolB) => schoolA.distance - schoolB.distance);

        res.status(200).json(schoolsSortedByProximity);

    } catch (error) {
        console.error("Error fetching schools:", error);
        res.status(500).json({ message: 'Database error', details: error.message });
    }
};


//Update school details
const updateSchoolInfo = async (req, res) => {
    try {
        const schoolId = req.params.id;

        // Validate school ID
        if (!schoolId) {
            return res.status(400).send({
                message: "Please provide a valid school ID to update."
            });
        }

        const { name, address, latitude, longitude } = req.body;

        // Convert latitude and longitude to numbers
        let latitudeNumber = parseFloat(latitude);
        let longitudeNumber = parseFloat(longitude);

        // Validate fields
        if (!name || !address || latitude === undefined || longitude === undefined) {
            return res.status(400).send({
                message: "All fields (name, address, latitude, longitude) are required."
            });
        }

        if (name.trim() === '') {
            return res.status(400).send({
                message: "Name must be a non-empty string."
            });
        }

        if (address.trim() === '') {
            return res.status(400).send({
                message: "Address must be a non-empty string."
            });
        }

        if (isNaN(latitudeNumber) || latitudeNumber < -90 || latitudeNumber > 90) {
            return res.status(400).send({
                message: "Latitude must be a valid number between -90 and 90."
            });
        }

        if (isNaN(longitudeNumber) || longitudeNumber < -180 || longitudeNumber > 180) {
            return res.status(400).send({
                message: "Longitude must be a valid number between -180 and 180."
            });
        }

        // Update the school info in the database
        const [result] = await db.query(
            `UPDATE school SET name = ?, address = ?, latitude = ?, longitude = ? WHERE id = ?`,
            [name, address, latitudeNumber, longitudeNumber, schoolId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send({
                message: "No school found with the provided ID."
            });
        }

        // Respond with success
        res.status(200).send({
            message: "School information updated successfully"
        });

    } catch (error) {
        console.error("Error updating school information:", error);
        res.status(500).send({
            message: "Could not complete the update operation for the provided School ID",
            error: error.message
        });
    }
};


const deleteSchoolInfo = async (req, res) => {
    try {
        const schoolId = req.params.id;

        // Validating school ID
        if (!schoolId) {
            return res.status(400).send({
                message: "Please provide a valid school ID to delete."
            });
        }

        // Deleting from the school from the database
        const [result] = await db.query(
            `DELETE FROM school WHERE id = ?`,
            [schoolId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send({
                message: "No school found with the provided ID."
            });
        }

        res.status(200).send({
            message: "School deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting school:", error);
        res.status(500).send({
            message: "Could not complete the deletion operation for the provided School ID",
            error: error.message
        });
    }
};




module.exports = { addSchoolController, listAllSchools,updateSchoolInfo,deleteSchoolInfo };
