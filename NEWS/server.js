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
  let dataNewSpecel = await News.find().limit(2);
  let dataNewSport = await News.find({ type: 'Thể Thao' });
  let dataNewWorld = await News.find({ type: 'Thế Giới' });
  let dataNewBusiness = await News.find({ type: 'Kinh Doanh' });
  res.render('template/ltr/index', {
    data: dataNewSpecel, dataNewSport: dataNewSport, dataNewWorld: dataNewWorld
    , dataNewBusiness: dataNewBusiness
  });
})

app.get('/registerform', async (req, res) => {
  res.render('template/login/register8')
});

app.get('/get-view-create-news', async (req, res) => {
  res.render('template/dasboad/email-compose')
});
app.get('/loginForm', async (req, res) => {
  res.render('template/login/index')
});
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
  const { title, content,type, author, image } = req.body;
  if(content != null && type != null && title!= null){

  
  //console.log(title +"content: "+content+" authour : "+author+" "+ image + " ");
  let infoNews = News({
    title, content,type, author, image
  })

  let inforNewsInserted = await infoNews.save();
  if(inforNewsInserted)
  {
    res.json({data:"thanhcong"});
  }
}
  
})

app.post('/update-new', async (req, res) => {
  const { title, idP, content, author, image, type } = req.body;
  console.log(idP, title,author,image,type)
  let updateStatus = await News.findByIdAndUpdate(idP, { title: title, content: content, author: author, image: image,type: type }, { new: true });
  
  if(updateStatus)
{
  res.json({data:"updated!"})
}
})

app.post('/delete-new/:id', async (req, res) => {
  var id = req.params;
  var result = await News.findByIdAndRemove(id.id);
  console.log(result)
  res.json({ data: "deleted" });

})

app.get('/index-author', async (req, res) => {
  let dataNewSpecel = await News.find().limit(2);
  let dataNewSport = await News.find({ type: 'Thể Thao' });
  let dataNewWorld = await News.find({ type: 'Thế Giới' });
  let dataNewBusiness = await News.find({ type: 'Kinh Doanh' });
  res.render('template/ltr/index-author', {
    data: dataNewSpecel, dataNewSport: dataNewSport, dataNewWorld: dataNewWorld
    , dataNewBusiness: dataNewBusiness
  });

})

app.get('/get-dasboad', async (req, res) => {
  res.render('template/dasboad/index');

})

app.get('/get-view-update-new/:id', async (req, res) => {
  let id = req.params;
  let inforNew =  await News.findById(id.id)
  if(inforNew){
    res.render('template/dasboad/update-new-views', {data:inforNew
    });
  }
  
})


app.get('/get-all-infor-news-one-user/:author', async (req, res) => {
  let author = req.params;
  console.log(author)
  let dataNew = await News.find({author : author.author});
  
  res.json(dataNew);
})
app.get('/get-all-infor-news', async (req, res) => {
  let dataNew = await News.find();
  console.log(dataNew)
  res.json(dataNew);
})
app.get('/get-all-infor-user', async (req, res) => {
  let dataNew = await Users.find();
  console.log(dataNew)
  res.json(dataNew);
})

app.get('/get-view-list-news', async (req, res) => {
  res.render('template/dasboad/data-tables');
})

app.get('/get-view-list-user', async (req, res) => {
  res.render('template/dasboad/list-all-user');
})
app.get('/get-view-list-news-admin', async (req, res) => {
  res.render('template/dasboad/data-tables-admin');
})

app.get('/get-view-admin', async (req, res) => {
  res.render('template/dasboad/admin');
})

app.post('/login', async (req, res) => {
  var { username, password,role } = req.body;
    console.log(role)
    const resultLogin = await Users.findOne({ username: username, password: password, role:role });

    console.log(resultLogin)
  if (resultLogin) {
    if(role === "1")
    {
      res.json({ result: "1"});
    }else{
      res.json({ result: "2"});
    }
  };
  // let dataNewSpecel         = await News.find().limit(2);
  // let dataNewSport          = await News.find({ title:'Thể Thao' });
  // res.render('template/ltr/index',{ data:dataNewSpecel, dataNewSport : dataNewSport });
})
app.post('/register', async (req, res) => {
  {
    const { username, password } = req.body;
    var role = 1;
    try {
      let inforUser = new Users({ username, role, password });

      Users.find({ "username": username }).then(data => {
        if (data.length > 0) {
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