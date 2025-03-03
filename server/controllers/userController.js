import User from "../models/userModel.js";
import Doctor from "../models/doctorModel.js";
import Booking from "../models/bookingModel.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({ success: true, data: { users } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id).then(
      res
        .status(200)
        .json({ success: true, message: "User deleted successfully" })
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, photo, gender, bloodType, role } = req.body;
    let user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.photo = photo || user.photo;
    user.gender = gender || user.gender;
    user.role = role || user.role;
    user.bloodType = bloodType || user.bloodType;

    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "User Updated Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const { password, ...rest } = user._doc;

    return res.status(200).json({
      success: true,
      message: "Getting Profile Data",
      data: { ...rest },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something Went Wrong" });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId });

    const doctorIds = bookings.map((el) => el.doctor.id);

    const doctors = await Doctor.find({ _id: { $in: doctorIds } }).select(
      "-password"
    );

    return res
      .status(200)
      .json({ success: true, message: "Getting Appointments", data: doctors });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

export {
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
  getUserProfile,
  getMyAppointments
}