import jwt from "jsonwebtoken"

export const isLoggedIn = async (req, res, next) => {
    try {
        const token=req.cookies?.token
        // console.log(token)

        if(!token){
            console.log("Token not found")
            return res.status(400).json({
                message:"Authentication failed ",
                success:false
            })
        }

        const decodedData=jwt.verify(token,process.env.JWT_SECRET)
        // console.log(decodedData)
        req.user=decodedData

    } catch (error) {
        return res.status(500).json({
            message:" Auth middleware failure ",
            success:false
        })
    }
  next();
};
