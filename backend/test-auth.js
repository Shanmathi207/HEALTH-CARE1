const User = require('./models/User');
const jwt = require('jsonwebtoken');

(async () => {
  try {
    const user = await User.findOne({ email: 'patient@demo.com', userType: 'patient' });
    console.log('found user:', !!user);
    if (!user) return;
    console.log('user fields:', { email: user.email, userType: user.userType, password: !!user.password, id: user._id });
    const ok = await user.comparePassword('password123');
    console.log('password compare:', ok);
    const token = jwt.sign({ id: user._id, email: user.email, userType: user.userType }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    console.log('jwt token length:', token.length);
  } catch (error) {
    console.error('test error:', error);
    process.exit(1);
  }
})();