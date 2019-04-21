let express = require('express');
const mongoose = require('mongoose');
var Users = require('./db/user');
var News = require('./db/new');
var bodyParser = require("body-parser");
let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// const jwt = require('jsonwebtoken');
// const secretKey = 'My Secret';

// Setup server port
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('./public'));
var port = process.env.PORT || 8080;
//connect
const uri = 'mongodb://localhost:27017/new'
mongoose.connect(uri);
mongoose.connection.once('open', () => {
  app.listen(port, function () {
    console.log('working in ' + port);
  })
})

app.get('/', async (req, res) => {
  let dataNewSpecel   = await News.find().limit(2);
  let dataNewSport    = await News.find({ type: 'Thể Thao' });
  let dataNewWorld    = await News.find({ type: 'Thế Giới' });
  let dataNewBusiness = await News.find({ type: 'Kinh Doanh' });
  res.render('template/ltr/index', { data: dataNewSpecel, dataNewSport: dataNewSport, dataNewWorld: dataNewWorld
  ,dataNewBusiness: dataNewBusiness });
})
app.get('/get-new/:id', async (req, res) => {
  const id = req.params;
  try {
    let dataNews = await News.findById(id.id);
    //console.log(dataNews.content)
    res.render('template/ltr/posts-mixed', { data: dataNews.content })
    //res.json(dataNews);

  } catch (error) {
    console.log(error)
  }
})

app.post('/create-new', async (req, res) => {
  const { title, content, author, image } = req.body;
  //console.log(title +"content: "+content+" authour : "+author+" "+ image + " ");
  let infoNews = News({
    title, content, author, image
  })

  let inforNewsInserted = await infoNews.save();
  console.log({ inforNewsInserted });
})

app.post('/update-new', async (req, res) => {
  const { title, idP, content, author, image } = req.body;
  console.log(idP, title)
  let updateStatus = await News.findByIdAndUpdate(idP, { title: title }, { new: true });
  console.log(updateStatus);
})

app.post('/delete-new/:id', async (req, res) => {
  var id = req.params;
  var result = await News.findByIdAndRemove(id.id);
  console.log(result)

})

app.post('/login', async (req, res) => {
  var { username, password }  =   req.body;
  console.log(username +"  "+password)
  const newLocal = await Users.findOne({ username:username, password: password });
  console.log(newLocal);
  // let dataNewSpecel         = await News.find().limit(2);
  // let dataNewSport          = await News.find({ title:'Thể Thao' });
  // res.render('template/ltr/index',{ data:dataNewSpecel, dataNewSport : dataNewSport });
})
app.post('/register', async (req, res) => {
{
  const { username, password }    =   req.body;
  var role = 1;
  try {
    let inforUser = new Users({username, role, password});
  
    Users.find({"username":username}).then(data =>{
          if(data.length > 0)
          {
                console.log("name too short");
          }
    })
    var saveInfoUswe = await inforUser.save();
   
    console.log(saveInfoUswe);
 } catch (error) {
    console.log("can't create " + error);
 }
}
});