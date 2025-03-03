import Review from "../models/reviewModel.js";
import Doctor from "../models/doctorModel.js";

const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json({ success: true, message: 'Successful', data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
const createReview = async (req, res) => {
    try {
        // Extract data from the request
        if(!req.body.doctor) req.body.doctor = req.params.doctorId
        if(!req.body.user) req.body.user = req.userId
        // Validate request body
        
        // Create a new review instance
        const newReview = new Review(req.body);

        try {
            const savedReview = await newReview.save();
            await Doctor.findByIdAndUpdate(req.body.doctor, {
                $push: { reviews: savedReview._id }
            }).then(res.status(201).json({ success: true, message: 'Review submitted successfully', data: savedReview }))
            .catch(err => console.log(err))
            
        } catch (error) {
            console.error(error.message);
        return res.status(500).json({ success: false, message: 'Server error' });
        }
        // Save the new review to the database
        newReview.save();

        // Update the corresponding doctor document with the new review
        const doctor = await Doctor.findById(req.body.doctor);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        doctor.reviews.push(newReview);
        await doctor.save();

        // Send a success response
        return res.status(201).json({ success: true, message: 'Review submitted successfully', data: newReview });
        
    } catch (error) {
        // Handle errors
        console.error(error.message);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

export { getAllReviews, createReview };