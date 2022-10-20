require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const otpGenerator = require('otp-generator');
const expressAsyncHandler = require('express-async-handler');
const path = require('path');

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist/elas')));

let userSchema = new mongoose.Schema({
    username: { type: String, required: [true, "Username is required!"] },
    password: { type: String, required: [true, "Password is required!"] },
    key: { type: String, required: [true, "Secret key is required!"] },
    otp: { type: Array, default: null }
}, { collection: 'users' });

let User = mongoose.model('user', userSchema);

const timeConverter = (hrs, mins) => {
    return hrs * 60 + mins;
}

app.post('/signup', expressAsyncHandler(async (req, res) => {
    const userDataFromRequest = req.body;
    const userDataFromDB = await User.findOne({ username: userDataFromRequest.username });
    if (userDataFromDB) {
        res.status(200).send({ message: "User already exists! Try with different username." });
    } else {
        const hashedPassword = await bcryptjs.hash(userDataFromRequest.password, Number(process.env.INT_SALT));
        const hashedKey = await bcryptjs.hash(userDataFromRequest.key, Number(process.env.INT_SALT));
        userDataFromRequest.password = hashedPassword;
        userDataFromRequest.key = hashedKey;
        const newUser = new User({ ...userDataFromRequest });
        const user = await newUser.save();
        res.status(200).send({ message: "User created successfully!", payload: user });
    }
}))

app.post('/login', expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        res.status(200).send({ message: "Invalid username! Please, enter the correct username." });
    } else {
        if (!(await bcryptjs.compare(req.body.password, user.password))) {
            res.status(200).send({ message: "Invalid password! Please, enter the correct password." });
        } else {
            const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
            const hashedOTP = await bcryptjs.hash(otp, Number(process.env.LOW_SALT));
            await User.updateOne({ username: req.body.username }, { $set: { otp: [hashedOTP, new Date()] } });
            console.log("Your One Time Password is:", otp);
            res.status(200).send({ message: "Success!" });
        }
    }
}));

app.put('/reAuth', expressAsyncHandler(async (req, res) => {
    if (!(await User.findOne({ username: req.body.username }))) {
        res.status(200).send({ message: "Something went wrong! Please, check username." });
    } else {
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
        const hashedOTP = await bcryptjs.hash(otp, Number(process.env.LOW_SALT));
        await User.updateOne({ username: req.body.username }, { $set: { otp: [hashedOTP, new Date()] } });
        console.log("Your One Time Password is:", otp);
        res.status(200).send({ message: "New OTP generated successfully!" });
    }
}));

app.post('/auth', expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        res.status(200).send({ message: "Something went wrong! Please, check username." });
    } else {
        if (!(await bcryptjs.compare(req.body.key, user.key))) {
            res.status(200).send({ message: "Invalid secret key!" });
        } else {
            if ((await bcryptjs.compare(req.body.otp, user.otp[0])) &&
                (timeConverter(new Date().getHours(), new Date().getMinutes())
                    - timeConverter(user.otp[1].getHours(), user.otp[1].getMinutes())) <= 10) {
                await User.updateOne({ username: req.body.username }, { $set: { otp: null } });
                res.status(200).send({ message: "Authentication successful!" });
            } else {
                res.status(200).send({ message: "Invalid OTP or OTP may be expired! Please, Check or generate new otp and enter again." });
            }
        }
    }
}));


app.use((err, req, res, next) => {
    res.send({ message: err.message });
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/elas/index.html'));
})


mongoose.connect(process.env.DATABASE_URL).then(() => console.log('Database connected successfully!')).catch(err => console.log(err));
app.listen(process.env.PORT, () => console.log(`Server started and listening on port number ${process.env.PORT}`));