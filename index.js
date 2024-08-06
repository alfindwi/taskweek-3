const express = require('express')
const app = express()
const port = 3000

const db = require("./src/lib/db");
const { QueryTypes } = require("sequelize");
const e = require('express');

app.set('view engine', 'hbs')
app.set('views', 'assets/views')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/assets", express.static("assets"))  

app.get("/", renderHome);
app.get("/blog", renderBlog);
app.post("/blog", addBlog);
app.get("/contact", renderContact);
app.get("/testimoni", renderTestimonial);
app.get("/blog-detail/:blog_id", renderBlogDetail);
app.get("/edit-blog/:blog_id", renderEditBlog);
app.post("/edit-blog/:blog_id", editBlog);
app.get("/delete-blog/:blog_id", deleteBlog);

const blogs = [{}];


async function renderHome(req, res) {
  try {
    const query = `SELECT * FROM blog;`;
    const result = await db.query(query, { type: QueryTypes.SELECT });

    res.render('index', { data: result });
  } catch (error) {
    console.log(error);
  }
}

function renderBlog(req, res) {
  res.render("blog");
}


async function addBlog(req, res) {
  try {
    console.log(req.body);
    const duration = calculateDuration(req.body.startDate, req.body.endDate);

    const query = `
      INSERT INTO blog
      (title, content, start_date, end_date, duration, technologies, created_at)
      VALUES
      ("${req.body.title}", "${req.body.content}", "${req.body.startDate}",
      "${req.body.endDate}", "${duration}", "${req.body.technologies}", NOW())
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

async function renderEditBlog(req, res){
  const id = req.params.blog_id

    const blog = await db.query(`SELECT * FROM blog WHERE id = ${id}`, {
      type: QueryTypes.SELECT,
  });

  res.render("edit-blog", {
      data: blog[0],
  });
}
  
async function editBlog(req, res){
  try {
    const id = req.params.blog_id

    const newBlog = {
    id: id,
    title: req.body.title,
    content: req.body.content,
    start_date: req.body.startDate,
    end_date: req.body.endDate,
    duration: calculateDuration(req.body.startDate, req.body.endDate),
  };

  const query = `
    UPDATE blog
    set
    title = '${newBlog.title}',
    content = '${newBlog.content}',
    start_date = '${newBlog.start_date}',
    end_date = '${newBlog.end_date}',
    duration = '${newBlog.duration}'
    where id = ${id}
  `

  await db.query(query);
  
  res.redirect("/")
  } catch (error) {
    console.log(error)
  }
}

async function deleteBlog(req, res){
  const id = req.params.blog_id;

  // const index = blogs.findIndex((blog) => blog.id == id);
  
  // blogs.splice(index, 1);
  
  const query = `DELETE FROM blog WHERE id = ${id}`;
  await db.query(query);
  res.redirect("/")
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

app.listen(port, () => {
  console.log(`Server Berjalan di port ${port}`)
})



