const jwt = require('jsonwebtoken');
const secret = "efuhpBjqkzx2zE84IoqSVwzNakAL0McwYDMrkxVfkAyoyt0Cf9rjDwVFvwwmCYWh55ciD7HYPU5EC4cYxWMDhrZ5cnLBMgJrFBDHLzAW3ReYrQsLUd2qr6picKFl5oHxybeJU8RJRSKm8qY9ZC5NXNCZGOVSS8qAju2kQLwA9haBEWgD17QZOxbU/WY1qVM1xUfYzBIzs76oEq7x4gku6PLsnAW9oMfml0wPB2aQKIxWZjso5iWvDswLiorDnfv9hUMgjcZ5Dm4V1ciMkfu+zMrfNyRkdQZHao/aW0Zkz2hvaueAhx+n/lFZuMi0yhyOlXmHom8W3H4YhPlUztyyIw=="
const authVerify=(req, res, next)=> {
    const token = req.headers.authorization;
    // console.log("here")
    // console.log({ token })
    try {
      const decoded = jwt.verify(token, secret);
      req.user = { userID: decoded.userData._id};
      return next();
    } catch (error) {
      console.log(error)
      return res.status(401).json({ message: "Unauthorised access, please add the token"})
    }
  }
module.exports={authVerify}