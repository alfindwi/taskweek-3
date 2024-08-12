const express = require('express')
const app = express()
const port = 3000
const session = require('express-session')
const flash = require('express-flash')
const multer  = require('multer')
const bcrypt = require('bcrypt');

const db = require("./src/lib/db");
const { QueryTypes } = require("sequelize");
const e = require('express');
const { types } = require('pg')

const hbs = require('hbs');

hbs.registerHelper('includes', function(array, value) {
  return array.includes(value);
});


const upload = multer({
  storage: multer.diskStorage({
     destination: (req, file, cb) => {
        cb(null, "uploads/");
     },
     filename: (req, file, cb) => {
        cb(null, Date.now()+ "-" + file.originalname);
     },
  }),
});





app.set('view engine', 'hbs')
app.set('views', 'assets/views')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/assets", express.static("assets"))  
app.use("/uploads", express.static("uploads"))  
app.use(
  session({
     secret: "hungrywhales",
     cookie: { maxAge: 3600000, secure: false, httpOnly: true },
     saveUninitialized: true,
     resave: false,
     store: new session.MemoryStore(),
  })
);
app.use(flash());

app.get("/", renderHome);
app.get("/blog", renderBlog);
app.post("/blog", upload.single('image'), addBlog);
app.get("/contact", renderContact);
app.get("/testimoni", renderTestimonial);
app.get("/blog-detail/:blog_id",  renderBlogDetail);
app.get("/edit-blog/:blog_id", renderEditBlog);
app.post("/edit-blog/:blog_id", upload.single('image'), editBlog);
app.get("/delete-blog/:blog_id", deleteBlog);
app.get("/login", renderLogin);
app.post("/login", login);
app.get("/register", renderRegister);
app.post("/register", register);
app.get("/logout", logout);

const blogs = [{}];


async function renderHome(req, res) {
  try {
    const isLogin = req.session.isLogin;

    let result = [];
    if (isLogin) {
      const query = `SELECT * FROM blog WHERE user_id = ${req.session.user.id};`;
      result = await db.query(query, { type: QueryTypes.SELECT });
    }

    res.render('index', {
      data: result, 
      isLogin: isLogin,
      user: req.session.user,
    });
  } catch (error) {
    console.log(error);
  }
}



function renderBlog(req, res) {
  const isLogin = req.session.isLogin;

  res.render("blog", {
    isLogin: isLogin, 
    user: req.session.user,
  });
}


async function addBlog(req, res) {
  try {

    const duration = calculateDuration(req.body.startDate, req.body.endDate);

    const query = `
      INSERT INTO blog
      (title, content, start_date, end_date, duration, technologies, image, created_at, user_id)
      VALUES
      ("${req.body.title}", "${req.body.content}", "${req.body.startDate}",
      "${req.body.endDate}", "${duration}", "${req.body.technologies}", "${req.file.filename}", NOW(), "${req.session.user.id}")
    `;

    await db.query(query);
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
}




async function renderBlogDetail(req, res){
  const id = req.params.blog_id
  
  const blog = await db.query(`SELECT * FROM blog WHERE id = ${id}`, {
    type: QueryTypes.SELECT,
  });

 res.render("blog-detail", {
    data: blog[0],
 });
}

async function renderEditBlog(req, res) {
  const id = req.params.blog_id;

  try {
    const blog = await db.query(`SELECT * FROM blog WHERE id = ${id}`, {
      type: QueryTypes.SELECT,
    });

    res.render("edit-blog", {
      data: blog[0],
    });

  } catch (error) {
    console.error("Error fetching blog detail:", error);  
  }
}

async function editBlog(req, res) {
  try {
    const id = req.params.blog_id;
    const userId = req.session.user.id;

    const blog = await db.query(
      `SELECT * FROM blog WHERE id = ${id} AND user_id = ${userId}`,
      { type: QueryTypes.SELECT }
    );

    if (blog.length === 0) {
      req.flash("danger", "Anda tidak memiliki izin untuk mengedit proyek ini.");
      return res.redirect("/");
    }

    const newImage = req.file ? req.file.filename : blog[0].image;

    const query = `
      UPDATE blog
      SET
        title = '${req.body.title}',
        content = '${req.body.content}',
        start_date = '${req.body.startDate}',
        end_date = '${req.body.endDate}',
        image = '${newImage}',
        duration = '${calculateDuration(req.body.startDate, req.body.endDate)}',
        technologies = '${req.body.technologies}'
      WHERE id = ${id} AND user_id = ${userId}
    `;

    await db.query(query);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
}

async function deleteBlog(req, res) {
  try {
    const id = req.params.blog_id;
    const userId = req.session.user.id;

    const blog = await db.query(
      `DELETE FROM blog WHERE id = ${id} AND user_id = ${userId}`
    );


    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
}



function renderContact(req, res){
  res.render("contact")
}

function renderTestimonial(req, res){
  res.render("testimoni")
}

function calculateDuration(start, end) {
  let startDate = new Date(start);
  let endDate = new Date(end);
  let diffTime = Math.abs(endDate - startDate);
  let diffDay = Math.ceil(diffTime/ (1000 * 60 * 60 * 24));
  return diffDay + ' Hari';
}

function renderLogin(req, res) {
  const isLogin = req.session.isLogin;
  if (isLogin) {
    req.flash("danger", "Login Terlebih Dahulu");
    return res.redirect("/blog");
  }
  res.render("login")
}

async function login(req, res) {
  try {
    const query = `SELECT * FROM user WHERE email = "${req.body.email}"`;
    const existUser = await db.query(query, { type: QueryTypes.SELECT });

    if (existUser.length === 0) {
      req.flash("danger", "Email atau Password Salah");
      return res.redirect("/login");
    }

    const validPassword = await bcrypt.compare(req.body.password, existUser[0].password);

    if (!validPassword) {
      req.flash("danger", "Email atau Password Salah");
      return res.redirect("/login");
    }

    req.session.user = existUser[0];
    req.session.isLogin = true;
    
    req.flash("info", "Login Berhasil");
    res.redirect("/blog");
  } catch (error) {
    console.log(error);
    res.redirect("/login");
  }
}



function renderRegister(req, res) {
  const isLogin = req.session.isLogin;
  if (isLogin) {
    req.flash("danger", "Login Terlebih Dahulu");
    return res.redirect("/blog");
  }
  res.render("register")
}

async function register(req, res) {
  try {
    const isLogin = req.session.isLogin;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    if (isLogin) {
      req.flash("danger", "Login Terlebih Dahulu");
      return res.redirect("/login");
    }


    const query = `
    insert into user
    (fullname, email, password)
    values
    ("${req.body.fullname}", "${req.body.email}", "${hashedPassword}")`

    await db.query(query, { type: QueryTypes.INSERT });
    console.log("SUKSES REGISTER")
    req.flash("info", "Registrasi Berhasil")
    res.redirect("/register")
  } catch (error) {
    console.log("error",error)
  }
}

function logout(req, res) {
  req.session.destroy();
  res.redirect("/login");
}

app.listen(port, () => {
  console.log(`Server Berjalan di port ${port}`)
})



