const express = require('express');
const cors = require('cors');
const app = express();

app.set('port', process.env.PORT || 3001);

//middlewers
app.use(express.json());
app.use(cors());

//routes
app.use('/user', require('./routes/user'))
app.use('/transactions', require('./routes/transactions'))

//app listener
app.listen(app.get('port'), () => {
    console.log(`Server runing on port `, app.get('port'));
})

