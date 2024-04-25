const router = require("express").Router()
const ctl = require("../controllers/user")

router.post("/create", ctl.created)
router.get("/get-user", ctl.getUser)
router.get("/get-detail-user/:id", ctl.getDetailUser)
router.delete("/delete-user/:id", ctl.deleteUser)
router.put("/update-user/:id", ctl.updateUser)

module.exports = router