const express = require("express")
const ConnectToMongo = require("./db")
ConnectToMongo()
const cors = require("cors")
const app = express()
app.use(express.json())
app.use(cors())

const PORT = 7000;
app.use("/admin", require("./Routes/admin_routes"))
app.use("/customer", require("./Routes/customer_routes"))
//uploads
app.use("/uploads/customer", express.static("./uploads/customer"))
app.use("/uploads/admin", express.static("./uploads/admin"))
app.use("/uploads/category", express.static("./uploads/category"))
app.use("/uploads/product", express.static("./uploads/product"))


app.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`)
})