import express, { response } from "express";
import bodyParser from "body-parser";
import axios from "axios";
const app = express();
const port = 3000;
const API_URL="http://localhost:4000";

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));



app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/feed" , async (req , res)=>{
    try{
        const result=await axios.get(`${API_URL}/posts`);
        res.render("feed.ejs",{posts:result.data});
    }catch(error){
        res.status(500).json({message:"Error fetching all posts"});
    }
})

app.get("/new", (req, res) => {
    res.render("modify.ejs", { heading: "New Post", submit: "Create Post" });
  });

app.get("/api/posts/:id" , async(req , res)=>{
    console.log("called");
    try{
        const response=await axios.get(`${API_URL}/posts/${req.params.id}`);
        console.log(response.data);
        res.render("getstory.ejs" , {post:response.data});
    } catch(error){
        res.status(500).json({message :"Error fetching posts"});
    }
})

app.get("/edit/:id", async (req, res) => {
    try {
      const response = await axios.get(`${API_URL}/posts/${req.params.id}`);
      const result=response.data;
      res.render("modify.ejs", {
        heading: "Edit Post",
        post: result[0],
        submit: "Update Post",
        
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching post" });
    }
  });

  app.post("/api/posts", async (req, res) => {
    try {
      const response = await axios.post(`${API_URL}/posts`, req.body);
      console.log(response.data);
      res.redirect("/feed");
    } catch (error) {
      res.status(500).json({ message: "Error creating post" });
    }
  });
  
  app.post("/api/posts/:id", async (req ,res)=>{
        try{
            const response=await axios.patch(`${API_URL}/posts/${req.params.id}`, req.body);
            console.log(response.data);
            res.redirect("/feed");
        }catch(error){
            res.status(500).json({message:"Error updating post"});
        }
    });

    app.get("/api/posts/delete/:id" ,async (req , res)=>{
        try{
            const response=await axios.delete(`${API_URL}/posts/${req.params.id}`);
            res.redirect("/feed");
        }catch(error){
            res.status(500).json({message:"Error deleting post"});
        }
    })
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
