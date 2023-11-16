const port = process.env.PORT;

import app from "./app";

app.listen(port, async () => {
    // await connectDb()
    console.log('Server connected, port:', port)
})
