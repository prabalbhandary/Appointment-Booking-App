import Doctor from "../models/doctorModel.js";
import Booking from "../models/bookingModel.js";

const getAllDoctors = async (req, res) => {
  try {
    const { query } = req.query;
    let doctors;
    if (query) {
      doctors = await Doctor.find({
        isApproved: "approved",
        $or: [
          { name: { $regex: query, $options: "i" } },
          { specialization: { $regex: query, $options: "i" } },
        ],
      }).select("-password");
    } else {
      doctors = await Doctor.find({ isApproved: "approved" }).select(
        "-password"
      );
    }
    return res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const getSingleDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id)
      .populate("reviews")
      .select("-password");
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    return res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const deleteDoctoor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByIdAndDelete(id).then(
      res
        .status(200)
        .json({ success: true, message: "Doctor deleted successfully" })
    );
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, photo, gender, specialization } = req.body;
    let doctor = await Doctor.findById(id);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    doctor.name = name || doctor.name;
    doctor.email = email || doctor.email;
    doctor.photo = photo || doctor.photo;
    doctor.gender = gender || doctor.gender;
    doctor.specialization = specialization || doctor.specialization;

    await doctor.save();
    return res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const getDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.userId;
    const doctor = await Doctor.findById(doctorId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    const { password, ...rest } = doctor._doc;
    const appointments = await Booking.find({ doctor: doctorId });

    return res
      .status(200)
      .json({
        success: true,
        message: "Getting Profile Data",
        data: { ...rest, appointments },
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export {
  getAllDoctors,
  getSingleDoctor,
  deleteDoctoor,
  updateDoctor,
  getDoctorProfile,
};
