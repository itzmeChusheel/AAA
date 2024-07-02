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

  app.get('/subscribe', (req, res) => {
    res.render("subscribe.ejs", { message:"Join our AAA - Ascend, Achieve, Aspire community by subscribing today! By signing up, you will receive daily manifestation quotes crafted to inspire and uplift you, keeping your life positive and your goals in focus. Our content is designed to help you harness the power of positive thinking, stay motivated, and achieve your dreams. As a subscriber, you'll gain exclusive access to valuable tips, motivational stories, and personal development insights that will guide you on your journey to success."  ,
       conclusion:"Don't miss out on the opportunity to ascend to new heights, achieve your aspirations, and be part of a community that supports and encourages your growth. Subscribe now and start your journey towards a more fulfilling life!",
       already_present:"",
    });
});

app.post('/subscribe', async (req, res) => {
    console.log(req.body.email);
    try {
        const response=await axios.post(`${API_URL}/subscribe`, req.body);
        let already="";
        if(response.data==null){
          already="You have already registered !";
        }
        res.render("subscribe.ejs", { message: 'Thank you for subscribing to our manifestation journey at AAA - Ascend, Achieve, Aspire! '  , 
          conclusion:"We are thrilled to have you as a part of our community. By joining us, you are taking a powerful step towards a more positive and fulfilling life. Our daily manifestation quotes are designed to inspire and uplift you, helping you to stay focused on your goals and maintain a positive mindset. Together, let's ascend to new heights, achieve our dreams, and aspire to be the best versions of ourselves. Stay tuned for your daily dose of motivation and encouragement!",
          already_present:already,
        });
    } catch (err) {
        console.log(err);
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
