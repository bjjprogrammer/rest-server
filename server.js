require('./config/config');
const express = require('express'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      app = express();


//Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes
app.use('/usuario', require('./routes/usuarios'));

//Obj de config de Mongoose
let obj = {

    useNewUrlParser : true, 
    useUnifiedTopology : true, 
    useCreateIndex : true,  
    useFindAndModify: false

}

// Conexion a base de datos.
mongoose.connect(process.env.URLDB, obj, (err, res) => {
  
    if (err) throw err;
    console.log('Database is online.');

});


app.listen(process.env.PORT, () => {
    console.log(`Server on port ${process.env.PORT}.`);
});