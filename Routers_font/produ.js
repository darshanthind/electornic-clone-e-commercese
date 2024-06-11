const express=require("express");
const routing=express.Router();
const bodyparser = require('body-parser');
const product_collection=require("../model/admin_product")
const users_D=require("../model/user_mod")
const  upload=require("../model/multer");
const session=require("express-session");
const carts=require("../model/products_cart");
const {v4:uuidv4}=require("uuid");
const Purch=require("../model/Purches_collection");
const Status=require("../model/status");
const stripe = require('stripe')('sk_test_51Op3E4SAl2jL9UlyWvc9OChUXey5GV7GnQFK91rlG88J808h6XjngPoiiTlNGpcdaqa8BRzUUPs5Tsw0unNG2LMa00t2rjkgOV');

routing.use(bodyparser.urlencoded({ extended: true }));
routing.use(bodyparser.json());
routing.use(session({
    secret:"abs",
    resave:false,
    saveUninitialized:true
}));

routing.use(function (req, res, next) {

    res.locals.a=req.session.login;
    res.locals.active=req.session.activeid;
    res.locals.idu=req.session.idu;
    res.locals.name=req.session.name;
    res.locals.cartlength=req.session.cartl;
    next()
  });
   function product_S(ids){
    let  p=[];
    let L=0;
    


    

    
    // return p.length;

    


    
 
 }
routing.get("/",(req,res)=>{
    //    let a=false;
    //     if(req.query.p){
    //        a=true;
    //     }
    // let login;
    // if(req.query.login){
    //     login="page"
    // }
    console.log(res.locals.cartlength);
    let q,not,v;
    if(req.query.login){
        q="page";
    }
    if(req.query.not){
        not="0";
    }

    if(req.query.ac){
        v="nv";
    }

    product_collection.find()
    .then(d=>{
        // console.log(d);
      
        res.render("home",{d,q,not,v});
    })
});

const auth=function(req,res,next){
    if('idu' in req.session){
        return next();

    }else {
        res.redirect("/")
    }
}
routing.get("/signup",(req,res)=>{
    res.render("sigup_page");
});
routing.post("/user_stores",(req,res)=>{
    console.log(req.body);
   
    // console.log("have a nice day");
    let data=req.body;
    data["isActive"]=false;
    data["ids"]=uuidv4();
    const b=new users_D(data);
    req.session.activeid=data.ids;
    b.save();
    res.json({ redirectUrl: "/after_s" });
    // res.redirect("/after_s");
//    try{

//     let config = {
//         service: "gmail", // your email domain
//         auth: {
//             user: "gurpreetsinghthind1001@gmail.com",   // your email address
//             pass: "mlcs qtah nllp hyxq" // your password
//         }
//     }index.js
//     let transporter = nodemailer.createTransport(config);
//     let message = {
//         from: "gurpreetsinghthind1001@gmail.com", // sender address
//         to: data.Email, // list of receivers
//         subject: `Hi ${data.Username}`, // Subject line
//         html: `<a href="http://localhost:2002/active/?id=${data.ids}">verify account</a>`, // html body
//         // attachments: [ // use URL as an attachment
//         //     {
//         //       filename: 'receipt_test.pdf',
//         //       path: 'receipt_test.pdf',
//         //       cid: 'uniqreceipt_test.pdf' 
//         //     }
//         // ]
//     };

//      transporter.sendMail(message).then((info)=>{
        
    
//          res.redirect("/Login_page");
//      })
//     }catch(Error){
//         console.log(Error);
//     }
    
});
routing.get("/active",(req,res)=>{
    console.log(req.query);
    let ids=req.query.id;
    
   users_D.findOneAndUpdate({ids:ids},{
          isActive:true
     })
      .then(d=>{
         if(d!==null){
            res.redirect("/Login_page");
          }
      })
});
routing.get("/Login_page",(req,res)=>{
    // let a=true;
    // let not_exist=true;
    // if(req.query.ac){
    //  a=false;
    // }else if(req.query.not){
    //    not_exist=0;
    
    res.redirect("/");
    // res.redirect("/?login=page")
})
routing.get("/outlogin_page",(req,res)=>{
    res.redirect("/");
})
routing.post("/Login_id", async(req,res)=>{
    // users_D.findOne({Password:req.body.Password,Email:req.body.Email})
    // .then(d=>{
        // if(d!==null && d.isActive==true){
            req.session.login=true;
            req.session.idu=req.body.ids;
            req.session.name=req.body.Username;
          await  carts.findOne({User_id:req.session.idu})
        .then( (d)=>{
           if(d!==null){
           console.log(d.Products.length);

              req.session.cartl= d.Products.length;

               // d.Products;
           }
        // //     return p.len;
        //    //    return d.Products.length;
        })
    //    return L;

        //   let le=await product_S(req.body.ids);
        //   console.log(le);
        //   req.session.cartl=le;

            res.redirect("/");
    //     }else if(d!==null && d.isActive==false){
    //         res.redirect("/?login=page&ac=false");
    //     }else{
    //         res.redirect("/?login=page&not=0")
    //     }
    // })
    

});
routing.get("/Login_Out",(req,res)=>{
    req.session.destroy();
    res.redirect("/");
})
routing.get("/after_s",(req,res)=>{
    res.render("after_signup");
})
routing.get("/about",(req,res)=>{

    res.render("about");
})
routing.get("/product",(req,res)=>{
    product_collection.find()
    .then(d=>{
            
        res.render("products",{d});
    })
    
    
})
routing.get("/admin/productadd",(req,res)=>{
    res.render("bak_Files/product_add");
});
routing.post("/admin/productstore",upload.single('img'),(req,res)=>{
  const b=new product_collection({
    Productname:req.body.Productname,
    Description:req.body.Description,
    Price:req.body.Price,
    Discount:req.body.Discount,
    Ranking:req.body.Ranking,
    Categories:req.body.Categories,
    ProductCount:req.body.Count,
    img:req.file.filename


  });
  b.save();
  res.redirect("/admin/productadd");

});
routing.get("/productcard/:id",auth, async(req,res)=>{
    const id=req.params.id;
    console.log(res.locals.idu);
    let totals=0;
    let price=0;
    await product_collection.findById(id)
    
    .then(async(d)=>{
       price= d.Price;
       Dis=d.Discount;
        await carts.findOne({User_id:res.locals.idu})
        .then(async(dd)=>{
            let k=((price)-((price)*((Dis)/100)))
            if(dd!==null){
          totals=dd.Total;
                await carts.findOneAndUpdate({_id:dd._id}, {$push:{
                    Products:[
                        {Productname:d.Productname,
                        Quentity:1,
                        Description:d.Description,
                         Price:d.Price,
                         Discount:d.Discount,
                         Categories:d.Categories,
                         img:d.img

                        }
                     ],
                    
                    
                }})
                .then(async(g)=>{
                    // console.log(g);
                    // let practa=
                   await carts.findOneAndUpdate({_id:dd._id},{
                        Total:totals+k
                    }
                ).then(da=>{
                    // console.log(da);
                })
            })

            }else{
                const b=new carts({
                    Product_id:d._id,
                    User_id:res.locals.idu,
                    Username:req.session.name,
                    Products:[
                       {Productname:d.Productname,
                       Description:d.Description,
                       Quentity:1,
                        Price:d.Price,
                        Discount:d.Discount,
                        Categories:d.Categories,
                        img:d.img
                    }
                    ],
                    Total:k
                 
                })
              await  b.save();
                
            }
           

            
           

        
        })
    });
    await carts.findOne({User_id:res.locals.idu})
    .then(d=>{
        if(d!==null){
        req.session.cartl=d.Products.length;
        }
    })
    
    return  res.redirect("/carts");

   
})
routing.get("/carts",auth,(req,res)=>{
    let g=[];
        let name;
        let total=0;
    carts.findOne({User_id:res.locals.idu})
    .then(d=>{
        
        if(d!==null){
            g=d.Products;
            name=d.Username;
            total=d.Total;
        }
        res.render("carts",{g,name,total});

    });

    
});
routing.get("/remove/item/:id", async(req,res)=>{
    let p=req.params.id;
    let pri=0;
    let count=0;
    let dis=0;
    let total=0;
    console.log(p,res.locals.idu);
    
   await carts.findOne({User_id:res.locals.idu})
    .then(async(d)=>{
        if(d!==null){
        let pro=d.Products
        total=d.Total      
        console.log(total)  
        for(let f of pro){
            // console.log(pro[f],"hee");
          if(f._id==p){
            pri=f.Price;
            count=f.Quentity;
            dis=f.Discount;
            console.log(f.Price,pri,f.Quentity, count,f.Discount, dis);
            let to=((pri)-((pri)*((dis)/100)));
            to*=count;
            console.log(to);
 await carts.findOneAndUpdate({User_id:res.locals.idu},
                {
                Total:(total-to)
             }).then(d=>{
                     // console.log(d);
                 });
          }
        }
    }
    })
await carts.findOneAndUpdate({User_id:res.locals.idu},{
    $pull:{
        
        Products:{_id:p}
        
    }})
    .then(async(d)=>{
        // console.log(d);
         await carts.findOne({User_id:res.locals.idu})
        .then(f=>{
            if(f!==null){
            console.log(f.Products.length);
            req.session.cartl=f.Products.length;
            }

        })
    });
    // console.log(pri,count,dis);
    //  let g=;
    return res.redirect("/carts");
   
   
  

    }
   
  
   

    
)
routing.post("/updatepQ",async(req,res)=>{
    console.log(req.body);
    let to=0;

    await carts.findOne({Username: req.body.Name})
    .then(d=>{
        // (d.Products.Productname==req.body.Productname){
           let g=d.Products
           to=d.Total
            let Quen=0;
            let Dis=0;

        for(let  i of g){
            if(i.Productname==req.body.Productname){
                console.log(i.Productname);
              Quen=i.Quentity;
              Dis=i.Discount;
            }
        }
        console.log(Quen);


  
        if(Quen<=req.body.Quentity){
            let min=parseInt(req.body.Quentity)-Quen;
            let prac=(parseInt(req.body.Price)*min);
            let p=((prac)-((prac)*((Dis*min)/100)));
            to+=p;
            plus=true;
            console.log(req.body.Quentity);

         }
  else{
            let min=Quen-parseInt(req.body.Quentity);
            let prac=(parseInt(req.body.Price)*min);
            let p=((prac)-((prac)*((Dis*min)/100)));
            to-=p;

           
         }
         carts.findOneAndUpdate(
            { Username: req.body.Name,"Products.Productname":req.body.Productname},
        { $set: {
                 "Products.$.Quentity":req.body.Quentity,
               //  Total:parseInt(req.body.Total)+parseInt(req.body.Price)*parseInt(req.body.Quentity)
                Total:to
            }},
              {new:true}
         
            )
          .then(g => {
         //   console.log(g);
     
              });
         
        })
    
    
    console.log(to);   
    
    
    
    res.json({ redirectUrl: "/carts" });
        
})
routing.get("/userColloection",(req,res)=>{
    users_D.find()
    .then(d=>{
        res.json(d);
    })
});
routing.post("/Payment",async(req,res)=>{
    // console.log(req.body);
    console.log(req.body)
    // return false
    let datas=JSON.parse(req.body.Products);
    // console.log(typeof datas);
    
    try{
        let data=[];
      
    for(let v of datas){   
        // let p=parseInt(v.Price);
        // let q=parseInt(v.Quentity);
        // console.log(p,q);
        let d=((v.Price)-((v.Price)*(v.Discount/100)));
        // console.log(d,typeof d);

     data.push({   
    price_data:{
      currency:'inr',
      product_data:{
        name:v.Productname,

      },
      unit_amount:d*100,
    },
    quantity:v.Quentity,
  })
  
}

// console.log(data);
    const session = await stripe.checkout.sessions.create({   
        line_items:data,
      mode: 'payment',
      success_url: 'http://localhost:2002/p/'+res.locals.idu,
      cancel_url: 'http://localhost:4242/cancel',
       
        
       
    });
    
    res.redirect(303, session.url);
    console.log(session.cancel_url);

}catch(error){
    console.log(error);
}
});
routing.get("/p/:id",(req,res)=>{
    console.log(req.params.id);
    let date=new Date(Date.now())
    let f=date.toDateString();
    console.log(date.toString());
    carts.findOne({User_id:req.params.id})
    .then(d=>{
        // console.log(d);)
        let prod=d.Products;
      let  Status={
            Status_prod:"",
           Result:"",
           Deadline:""
         }
        let Prod=[]
        for(let i of prod){
          Prod.push({
            ProductName:i.Productname,
            Quentity:i.Quentity,
            Price:i.Price,
            Discount:i.Discount,
            img:i.img,
            Status:Status
          })
        }
        Purch.findOne({UserName:d.Username})
        .then(g=>{
            
             if(g!==null){
                let f=g.Totals;

                Purch.findOneAndUpdate({UserName:d.Username},{$push:{
                    Purches:[{
                      Products:Prod,
                    Total:d.Total,
                    Date:date.toString(),
                    
                        
                     
                  }
                ]
            }
                })
                .then(d=>{
                    console.log("done");
                });
                Purch.findOneAndUpdate({UserName:d.Username},{$set:{
                    Totals:f+d.Total
                }
            
            }).then(d=>{
                console.log("done");

            })
             }else{
                const coll=new Purch({
                    UserName:d.Username,
                    ids:d.User_id,
                    
                    Purches:[
                       
                        {
                         Products: Prod,
                        Total:d.Total,
                         Date:date.toString(),
                         
                        }
                    
                    ],
                    Totals:d.Total,
        
                })
                coll.save();
             }
        })
        
    })

    carts.findOneAndDelete({User_id:req.params.id})
     .then(d=>{
        req.session.cartl=0;
        res.redirect("/MyAccount");
     })

})
routing.get("/MyAccount",auth, async(req,res)=>{
  await Purch.findOne({ids:res.locals.idu})
   .then(d=>{
    // let g=[];
    // if(d!==null){
    res.render("MyAccount",{d});
       
    // }
   })

    
})
routing.get("/Contact",(req,res)=>{
    res.render("Contect");
})
routing.get("/testimonial",(req,res)=>{
    res.render("termonal");
})

module.exports=routing;
