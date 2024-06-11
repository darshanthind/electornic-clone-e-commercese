const express = require("express");
const app = express();
const bodyparser = require('body-parser');
const path = require("path");
const nodemailer = require('nodemailer');
const admin_d = require("./model/admin_modb");
const users_D = require("./model/user_mod");
const cors = require('cors');
const product_collection = require("./model/admin_product");
const status = require("./model/status");
const Product_c = require("./model/Purches_collection");
const p_carts = require("./model/products_cart");
const session = require("express-session");
const stripe = require('stripe')(process.env.STRIP_KEY);
require('dotenv').config()

const { v4: uuidv4 } = require("uuid");

const mongoose = require("mongoose");
const home_p = require("./Routers_font/produ");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./files"));
app.use(cors())
app.use("/", home_p);
// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static("uploads"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(session({
    secret: "abs",
    resave: false,
    saveUninitialized: true
}));

app.use(function (req, res, next) {
    res.locals.fid = req.session.fid;
    res.locals.a = req.session.login;
    res.locals.active = req.session.activeid;

    next()
});

const auth = function (req, res, next) {
    if ('user' in req.session) {
        return next();
    } else if ('fid' in req.session) {
        return next();

    }

    else {
        res.redirect("/admin");
    }
}
// const authf=function(req,res,next){
//     if('otp' in req.session){
//         return next();
//     }else{
//         res.redirect("/admin");
//     }
// }
mongoose.connect(process.env.CONNECTION)
    .then(() => {
        console.log("done")
    }).catch((err) => {
        console.log(err);
    })


const data = {
    name: String,
    age: String,
    city: String
};
const base = mongoose.model("d1", data);


app.get("/admin", (req, res) => {

    res.render("bak_Files/admin_form");

});

app.post("/admin/login", (req, res) => {
    admin_d.findOne({ Username: req.body.Username, Password: req.body.Password })
        .then((data) => {
            if (data !== null && data.Active == true) {
                req.session.user = data._id;
                res.redirect("/admin/ui");
                console.log(req.session.user);
            } else {
                res.redirect("/admin");
            }
        });
});
app.get("/admin/ui", auth, (req, res) => {
    let a = true;
    base.find()
        .then((data) => {
            res.render("bak_Files/admin_table", { datas: data, a });
        })

})
app.get("/admin/fo", auth, (req, res) => {
    let a = true;

    res.render("bak_Files/form", { a });
});
app.get("/admin/edit/:ids", auth, (req, res) => {
    let a = true;
    base.findOne({ _id: req.params.ids })
        .then((data) => {
            res.render("bak_Files/admin_edit", { datas: data, a });
        })

});
app.get("/admin/view/:ids", auth, (req, res) => {
    let a = true;
    base.findOne({ _id: req.params.ids })
        .then((data) => {
            res.render("bak_Files/admin_view", { datas: data, a });
        })

});
app.get("/admin/remove/:ids", auth, (req, res) => {

    base.findOneAndDelete({ _id: req.params.ids })
        .then((data) => {
            res.redirect("/admin");
        })

});
app.get("/admin/add", auth, (req, res) => {
    let a = true;
    res.render("bak_Files/admin_add", { a });
})
app.get("/admin/show", auth, (req, res) => {
    let a = true;
    admin_d.find()
        .then(data => res.render("bak_Files/admin_show", { data, a }));

})


app.post("/admin/editupdate/:uid", (req, res) => {
    base.findByIdAndUpdate({ _id: req.params.uid }, req.body)
        .then((data) => {
            res.redirect("/admin");
        })

});
app.post("/admin/fo", (req, res) => {

    const d = new base(req.body);
    d.save();

    res.redirect("/admin/fo");
});
app.post("/admin/addadmin", (req, res) => {
    let d = req.body;
    d['Active'] = false;
    const b = new admin_d(d);
    b.save();
    try {
        let config = {
            service: "gmail", // your email domain
            auth: {
                user: "gurpreetsinghthind1001@gmail.com",   // your email address
                pass: "mlcs qtah nllp hyxq" // your password
            }
        }
        let transporter = nodemailer.createTransport(config);

        let message = {
            from: "gurpreetsinghthind1001@gmail.com", // sender address
            to: req.body.Email, // list of receivers
            subject: `Hi ${req.body.Username}`, // Subject line
            html: `<b>Thanks for sig</b>`, // html body

        };
        transporter.sendMail(message).then((info) => {

            res.redirect(`/admin/ui`)

        });
    } catch (Error) {
        res.send("Error!")
    }
    // res.redirect("/admin/show");

});
app.get("/adminid/view/:ids", (req, res) => {
    let a = true;
    admin_d.findOne({ _id: req.params.ids })
        .then((data) => {
            res.render("bak_Files/adminID_Views", { datas: data, a });
        })

});

app.get("/adminid/edit/:ids", auth, (req, res) => {
    let a = true;
    admin_d.findOne({ _id: req.params.ids })
        .then((data) => {
            res.render("bak_Files/adminId_edit", { datas: data, a });
        })

});

app.post("/admin/editupdateid/:uid", (req, res) => {
    admin_d.findByIdAndUpdate({ _id: req.params.uid }, req.body)
        .then((data) => {
            res.redirect("/admin/show");

        })

});
app.get("/adminid/active/:uid/:ac", (req, res) => {
    //     let a;
    //     let b;
    //    admin_d.findOne({_id:req.params.uid})
    //    .then((data)=>
    //    {
    //     if(data.Active==true){
    //         a=false
    //     }else{
    //         a=true
    //     }
    //    })
    console.log(req.params.ac);
    let b = req.params.ac;
    console.log(b);
    if (b == "true") {
        admin_d.findOneAndUpdate({ _id: req.params.uid }, {
            $set: {
                Active: false
            }
        }
        )
            .then((data) => {
                res.redirect("/admin/show");
            })
    } else {

        admin_d.findOneAndUpdate({ _id: req.params.uid }, {
            $set: {
                Active: true
            }
        }
        )
            .then((data) => {
                res.redirect("/admin/show");
            })
    }


});
app.get("/adminid/remove/:ids", (req, res) => {
    admin_d.findOneAndDelete({ _id: req.params.ids })
        .then((data) => {

            res.redirect("/admin/show");
        });

});
app.get("/admin/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/admin");
})
// app.get("/react/data",(req,res)=>{
//     admin_d.find()
//     .then((data)=>{
//         res.json(data);
//     })
// })
// app.get("/adminview/:ids",(req,res)=>{
//     admin_d.findOne({_id:req.params.ids})
//     .then((data)=>{
//         res.json(data);
//     })

// });

app.post("/admin/forget", (req, res) => {
    admin_d.findOne({ Email: req.body.email })
        .then((data) => {
            if (data !== null) {
                let config = {
                    service: "gmail", // your email domain
                    auth: {
                        user: "gurpreetsinghthind1001@gmail.com",   // your email address
                        pass: "mlcs qtah nllp hyxq" // your password
                    }
                }
                let transporter = nodemailer.createTransport(config);
                let otp = Math.floor(1000000 + Math.random() * 999999);
                let message = {
                    from: "gurpreetsinghthind1001@gmail.com", // sender address
                    to: data.Email, // list of receivers
                    subject: `Hi ${data.Username}`, // Subject line
                    html: `<b>hello world</b> ${otp}`, // html body
                    // attachments: [ // use URL as an attachment
                    //     {
                    //       filename: 'receipt_test.pdf',
                    //       path: 'receipt_test.pdf',
                    //       cid: 'uniqreceipt_test.pdf' 
                    //     }
                    // ]
                };

                transporter.sendMail(message).then((info) => {
                    let p = data._id;


                    req.session.otp = otp;
                    req.session.fid = data._id;
                    res.redirect(`/admin/forgetpassword`)

                });
                //     return res.status(201).json(
                //         {
                //             msg: "Email sent",
                //             info: info.messageId,
                //             preview: nodemailer.getTestMessageUrl(info)
                //         }
                //     )
                // }).catch((err) => {
                //     return res.status(500).json({ msg: err });
                // }

            } else {
                res.redirect("/admin/forgetpassword?msg=0")
            }
        })

})
app.post("/otps", auth, (req, res) => {
    if (req.session.otp == req.body.otp) {
        res.redirect("/admin/reset_password");
    } else {
        res.redirect("/admin/forgetpassword?otp=0");
    }
})

app.get("/admin/forgetpassword", (req, res) => {
    // req.session.destroy();\\\\
    console.log(req.session.id)
    res.render("bak_Files/admin_forgetPassword", { msg: req.query.msg, otp: req.query.otp });
})

app.get("/admin/reset_password", auth, (req, res) => {
    // req.session.destroy();\\\\

    console.log(req.session.id)
    res.render("bak_Files/reset_password", { action: req.query.action });
})
app.post("/updatepassword", auth, (req, res) => {
    //console.log(req.session.fid)
    // console.log(req.body.passwordC);
    if (req.body.password !== req.body.passwordC) {
        return res.redirect("/admin/reset_password?action=2");
    }
    admin_d.findOneAndUpdate({ _id: req.session.fid }, {
        Password: req.body.passwordC


    })
        .then((d) => {
            console.log(d)
            if (d !== null) {
                res.redirect("/admin/reset_password?action=1");
            }
            else {
                res.redirect("/admin/reset_password?action=0");
            }

        })

})

// app.get('/email',(req, res)=>{
//     let config = {
//         service: "gmail", // your email domain
//         auth: {
//             user: "gurpreetsinghthind1001@gmail.com",   // your email address
//             pass: "mlcs qtah nllp hyxq" // your password
//         }
//     }
//     let transporter = nodemailer.createTransport(config);

//     let message = {
//         from: "gurpreetsinghthind1001@gmail.com", // sender address
//         to: "deepsinghthind0gmail.com", // list of receivers
//         subject: 'Welcome to ABC Website!', // Subject line
//         html: "<b>hello world</b>", // html body
//         // attachments: [ // use URL as an attachment
//         //     {
//         //       filename: 'receipt_test.pdf',
//         //       path: 'receipt_test.pdf',
//         //       cid: 'uniqreceipt_test.pdf' 
//         //     }
//         // ]
//     };

//     transporter.sendMail(message).then((info) => {
//         return res.status(201).json(
//             {
//                 msg: "Email sent",
//                 info: info.messageId,
//                 preview: nodemailer.getTestMessageUrl(info)
//             }
//         )
//     }).catch((err) => {
//         return res.status(500).json({ msg: err });
//     }
//     );
// })
app.get("/admin/pruches", auth, (req, res) => {
    Product_c.find()
        .then(d => {
            res.render("bak_Files/admin_proch", { d });

        })

})
app.get("/admin/pruch_v/:id", auth, (req, res) => {
    let id = req.params.id;
    Product_c.findById(id)
        .then(d => {

            res.render("bak_Files/admin_prorch_view", { product: d.Purches, id });

        })
});
app.get("/admin/edit_S/:id_p/:id_u", auth, async (req, res) => {
    let p = req.params.id_p;
    let u = req.params.id_u;
    await Product_c.findById(u)
        .then(d => {
            let data = [];
            for (let i of d.Purches) {
                for (let f of i.Products) {
                    if (f._id == p) {
                        data.push(f);
                        break;
                    }
                }
                console.log(data);
                if (data.length > 0) {
                    break;
                }
            }
            res.render("bak_Files/admin_prod_st", { prod: data, userid: u });

        })
});
app.get("/admin/users_ca", auth, (req, res) => {
    p_carts.find()
        .then(d => {
            res.render("bak_Files/admin_us_ca", { d });
        })
})
app.post("/admin/status_up/:idp/:idu", auth, async (req, res) => {
    let p = req.params.idp;
    let u = req.params.idu;
    console.log(req.body.Status);
    await Product_c.findOne({ _id: u })
        .then(d => {
            console.log(d);
        });

    Product_c.findOneAndUpdate({ _id: u, "Purches.Products._id": p }, {
        $set: {
            "Purches.$.Products.$[elem].Status": req.body.Status


        }
    }, {
        new: true,
        arrayFilters: [{ "elem._id": p }]
    })
        .then(d => console.log(d))

    res.redirect(`/admin/pruch_v/${u}`);
});
app.get("/admin/product_show", auth, (req, res) => {

    product_collection.find()
        .then(d => {
            res.render("bak_Files/admin_show_products", { d });
        })

});
app.get("/admin/user_ca_p/:id", auth, (req, res) => {
    let id = req.params.id;
    p_carts.findOne({ _id: id })
        .then(d => {
            res.render("bak_Files/admin_user_c_p", { d });
        })
});

app.get("/removeProduct/:id", (req, res) => {
    product_collection.findOneAndDelete({ _id: req.params.id })
        .then((d, err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect("/admin/product_show");
            }
        })
})
app.listen(process.env.PORT, console.log("server run..."))