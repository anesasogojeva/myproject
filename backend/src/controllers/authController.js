const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/mysql/User');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { sendEmail } = require('../utils/emailSender'); 

//Generate ACCESS token
const generateAccessToken = (user) =>{
    return jwt.sign(
        { id:user.id , role: user.role},
        process.env.JWT_SECRET,
        { expiresIn: "1h"}
    );
};

//Generate REFRESH token
const generateRefreshToken = (user) =>{
    return jwt.sign(
       { id: user.id },
       process.env.JWT_REFRESH_SECRET,
       { expiresIn: "7d"}
    );
};

exports.register = async (req,res) =>{
try{
    const{name,email,password} = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    
    const exist = await User.findOne({where: {email}});
    if(exist) return res.status(400).json({message:"This email is already used"});
    const hashed = await bcrypt.hash(password,10);

    const user = await User.create({
        name,
        email,
        password: hashed,
        role: 'user'
    });

    res.json({message: "Registered succesfully", user});
}catch(err){
    res.status(500).json({error:err.message});
}

};

exports.login = async (req,res) =>{
    try{
        const {email,password}= req.body;
        if (!email || !password) {
         return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({where: {email}});
        if(!user) return res.status(404).json({ message: "Upps user not found"});

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({message: "Upps ,wrong password"});

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await user.update({refreshToken});

        res.json({accessToken,refreshToken,user});
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

exports.refresh = async (req,res)=> {
    try {
        const { refreshToken } = req.body;
        if(!refreshToken) return res.status(400).json({message: "No token"});

        const user = await User.findOne({ where: {refreshToken}});
        if(!user) return res.status(403).json({message : "Invalid refresh token"});

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err) =>{
            if(err) return res.status(403).json({message: "Token expired"});
        
            const newAccessToken = generateAccessToken(user);
            res.json({accessToken: newAccessToken});
     } );
        }catch(err){
            res.status(500).json({error: err.message});
        }
    };

exports.logout = async (req,res) => {
    try{
        const {userId} = req.body;

        const user = await User.findByPk(userId);
        if(!user) return res.status(404).json({message :"User not found"});

        await user.update({refreshToken: null});

        res.json({message: "Logged out"});
    }catch(err){
        res.status(500).json({ error: err.message});
    }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate raw reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before storing
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetUrl = `http://localhost:5000/api/auth/reset-password/${resetToken}`;

    // Send email (raw token in URL)
    await sendEmail(
      user.email,
      "Password Reset",
      `Use this link to reset your password: ${resetUrl}`,
      `<p>Click <a href="${resetUrl}">here</a> to reset your password.<br/>This link expires in 1 hour.</p>`
    );

    res.json({ message: "Password reset link sent to your email", resetUrl });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};


// ---------------- RESET PASSWORD ----------------
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and new password required" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { [Op.gt]: Date.now() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await user.update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpire: null
    });

    res.json({ message: "Password reset successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};




// ---------------- CHANGE PASSWORD (Logged-in user) ----------------
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword)
      return res.status(400).json({ message: "Old and new password required" });

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(400).json({ message: "Old password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
