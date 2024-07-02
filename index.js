import env from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
env.config();
const db=new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();
const app = express();
const port = 4000;

// In-memory data store


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// GET all posts
app.get("/posts", async(req, res) => {
  const posts=await db.query("SELECT * FROM public.aaa");

  console.log(posts.rows);
  res.json(posts.rows);
});

// GET a specific post by id
app.get("/posts/:id", async(req, res) => { 
  const id = req.params.id;
  const p = await db.query("SELECT * FROM public.aaa WHERE aaa.id = $1", [id]);
  const post = p.rows;
  console.log(post);
  if (!post || post.length === 0) return res.status(404).json({ message: "Post not found" });
  res.json(post);
});

// POST a new post
app.post("/posts", async (req, res) => {
  
  const title=req.body.title;
  const content=req.body.content;
  const author=req.body.author;
  const posted=new Date();
  const posted_on=posted.toDateString();

  try {
    await db.query(
      "INSERT INTO public.aaa (title , content , author , posted_on) VALUES ($1 , $2 , $3,$4)" , [title ,content, author , posted_on]
    );

  } catch (err) {
    console.log(err);
  }
  const posts=await db.query("SELECT * FROM public.aaa");
  res.status(201).json(posts.rows);
});
//getting email 

app.post("/subscribe" , async(req , res)=>{

  const useremail=req.body.email;
  console.log(useremail);
  
  try{
    const all_emails=await db.query("SELECT * FROM public.users WHERE users.email=$1" ,[useremail]);
    if(all_emails.rows.length===0){
      try{
        await db.query("INSERT INTO public.users (email) VALUES ($1)  " , [useremail]);
        res.status(201).json(useremail);
      }catch(err){
        console.log(err);
      }
    }else{
      res.status(201).json(null);
    }
  }catch(err){
    console.log(err);
  }
  
})

// PATCH a post when you just want to update one parameter
app.patch("/posts/:id", async(req, res) => {
  const id = req.params.id;
  const p = await db.query("SELECT * FROM public.aaa  where aaa.id = $1", [id]);
  const post = p.rows[0]; // Assuming there's only one post with the given id
  if (!post) return res.status(404).json({ message: "Post not found" });

  if (req.body.title) post.title = req.body.title;
  if (req.body.content) post.content = req.body.content;
  if (req.body.author) post.author = req.body.author;

  // You should update the post in the database here
  await db.query("UPDATE public.aaa SET title = $1, content = $2, author = $3 WHERE id = $4", 
                 [post.title, post.content, post.author, id]);

  res.json(post);
});

// DELETE a specific post by providing the post id
app.delete("/posts/:id", async (req, res) => {
  const id=req.params.id;
  try{
    await db.query("DELETE FROM public.aaa where aaa.id=$1" , [id]);
    res.json({ message: "Post deleted" });
  }catch(err){
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});







// const posts = [
//   {
//       id: 1,
//       title: "Heartbreak: Finding Peace After a Painful Separation",
//       content: "The breakup shattered me, leaving me with a hollow ache in my chest. We had been together for seven years, and I thought we were building a future. But one day, everything changed. He told me he needed space, that he wasn't sure about us anymore. I pleaded, I cried, but it was futile. Slowly, I learned to heal. I found solace in reconnecting with friends, diving deep into hobbies I had neglected, and exploring new passions. It wasn't easy; there were nights I couldn't sleep, replaying our memories and questioning where it all went wrong. But each day, I took a small step forward. I started therapy to work through my emotions and rediscover my self-worth. Time became my ally as I realized that endings are also opportunities for growth. Today, I am stronger and more resilient. The experience taught me about the importance of self-love and personal growth. It was a journey of rediscovery and understanding. I realized that endings are also new beginnings, and every setback is a lesson. Through this pain, I discovered my inner strength and the power of letting go. Moving forward, I cherish the lessons learned and look ahead with hope.",
//       author: "Anonymous",
//       date: "Thu June 15 2023"
//   },
//   {
//       id: 2,
//       title: "Overcoming Addiction: A Journey to Sobriety",
//       content: "My battle with addiction began in my teenage years. What started as experimentation quickly spiraled into a full-blown addiction. Drugs became my escape from reality, numbing the pain temporarily but wreaking havoc on my life. Relationships shattered, trust eroded, and my health deteriorated. It wasn't until I hit rock bottom that I realized I needed help. With determination and support, I sought treatment. Rehab was tough; every day was a struggle against cravings and temptation. But I persevered. Therapy sessions unlocked buried emotions and helped me understand the root causes of my addiction. Slowly, I embraced a sober lifestyle, one day at a time. Sobriety brought clarity and a renewed sense of purpose. Today, I celebrate each milestone – from rebuilding relationships to pursuing new passions. My journey is ongoing, but I'm grateful for the strength and resilience that led me to recovery.",
//       author: "John Doe",
//       date: "Fri May 20 2022"
//   },
//   {
//       id: 3,
//       title: "Navigating Academic Stress: Balancing Pressure and Mental Health",
//       content: "College life was a whirlwind of deadlines, exams, and expectations. As a high achiever, I pushed myself to excel academically, but the pressure took its toll on my mental health. Sleepless nights and constant stress became my norm. It wasn't sustainable. Seeking help from counselors was my first step towards managing academic stress. I learned effective study habits and prioritized self-care. It was a journey of self-discovery and resilience. I surrounded myself with supportive friends and found solace in creative outlets. Balancing academics and mental well-being became my priority. Today, I advocate for mental health awareness on campus and support systems that empower students to thrive.",
//       author: "Jane Smith",
//       date: "Mon April 5 2021"
//   },
//   {
//       id: 4,
//       title: "Strength in Memories: Finding Comfort in the Past",
//       content: "Memories of loved ones and cherished moments became my anchor during the darkest times of my life. Growing up, my family faced financial hardships and personal struggles. But amidst the challenges, we found joy in simple moments – shared meals, laughter, and unconditional love. Those memories sustained me when life threw its toughest punches. Reflecting on the lessons learned and values instilled by my parents became my guiding light. Their resilience in the face of adversity inspired me to never give up. Today, I carry these memories as a source of strength and inspiration. They remind me of the power of resilience and the bonds that endure. In moments of doubt, I draw strength from the memories that shaped who I am today.",
//       author: "Emily Brown",
//       date: "Wed July 10 2020"
//   },
//   {
//       id: 5,
//       title: "Silent Struggles: Overcoming the Trauma of Sexual Harassment",
//       content: "The trauma of sexual harassment left me feeling powerless and silenced. It started in my workplace, where a colleague's inappropriate advances and comments escalated into a nightmare. Fear consumed me, affecting my work and personal life. But silence was not an option. With courage and support from loved ones, I confronted the harasser and reported the incident. Therapy became my safe space to process the trauma and reclaim my sense of self-worth. Legal avenues provided justice and closure. It was a long journey of healing – navigating triggers, rebuilding trust, and finding my voice again. Today, I stand stronger, advocating for workplace policies that protect others from similar experiences. My story is a testament to resilience and the power of speaking out against injustice.",
//       author: "Grace Johnson",
//       date: "Tue September 3 2019"
//   },
//   {
//       id: 6,
//       title: "Finding Inner Strength: A Journey of Personal Growth and Resilience",
//       content: "Life's journey has been a series of highs and lows, each moment shaping my resilience and inner strength. From childhood struggles to adulthood challenges, every setback became an opportunity for growth. I faced financial hardships, health crises, and personal losses that tested my resolve. But through it all, I discovered my capacity for resilience. Family support, faith, and self-reflection became pillars of strength. I learned to embrace vulnerability as a source of growth and compassion. Each experience taught me valuable lessons in empathy and perseverance. Today, I navigate life with gratitude and optimism, knowing that resilience is not just about bouncing back but thriving despite adversity. My journey continues to unfold, filled with new chapters of growth and self-discovery.",
//       author: "Anonymous",
//       date: "Sun December 12 2018"
//   }
// ];
