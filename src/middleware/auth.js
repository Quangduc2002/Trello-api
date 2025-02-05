const auth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.split(" ")[1]) {
    const token = req.headers.authorization.split(" ")[1];
    console.log("Check token >>>", token);

    next();
  } else {
    return res.status(401).json({
      message: "Bạn chưa truyền Access token",
    });
  }
};
