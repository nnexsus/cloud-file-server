const express = require("express");
const db = require('./config/db');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const nodemailer = require('nodemailer');
const { randomUUID, randomInt, randomBytes } = require("crypto");

const app = express();

const PORT = 3001;
app.use(cors());
app.use(express.static('public'), bodyParser.urlencoded({extends: false}), express.json(), fileUpload());

const { user, pass } = require("./config.json")

// Route to get user info
app.get("/api/user/:id", (req, res) => {

    const id = req.params.id;

    db.query("SELECT username, pfp FROM users WHERE postToken = ?", id, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).send(err)
        }
        res.send(result)
    })
})

// Route to get user data usage
app.get("/api/user/data/:id", (req, res) => {

    const author = req.params.id;

    db.query("SELECT size FROM files WHERE author = ?", author, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).send(err)
        }
        console.log(result)
        const totalSize = 50000000000;
        var size = 0;

            result.map((file) => {
                size += file.size
            })

        const percent = (size / totalSize).toFixed(2);

        const data = {
            "size": size,
            "totalSize": totalSize,
            "percentUsed": percent
        }
        res.send(data)
    })
})

// Route to get all posts
app.get("/api/get", (req, res) => {
    db.query("SELECT * FROM files", (err, result) => {
        if(err) {
            console.log(err)
            return res.status(500).send(err)
        } 
    res.send(result)
    }
    );   
});

// Route to get one post
app.get("/api/get/:id", (req, res) => {

const id = "/files/" + req.params.id;
    db.query("SELECT * FROM files WHERE filename = ? AND public = 1", id, (err, result) => {
        console.log(result)
        if(err) {
            console.log(err)
            return res.status(500).send(err)
        } 
    res.send(result)
    });   
});

// Route to get posts from user
app.get("/api/get/user/:id", (req, res) => {

    const id = req.params.id;
        db.query("SELECT * FROM files WHERE author = ?", id, (err, result) => {
            if(err) {
                console.log(err)
                return res.status(500).send(err)
            } 
        res.send(result)
        });   
    });

    // Route to get recent posts from user
app.get("/api/get/user/:id/recent", (req, res) => {

    const id = req.params.id;
        db.query("SELECT * FROM files WHERE author = ? ORDER BY uploadDate DESC LIMIT 5;", id, (err, result) => {
            if(err) {
                console.log(err)
                return res.status(500).send(err)
            } 
        res.send(result)
        });   
    });

// Route for creating the post
app.post('/api/create', (req, res) => {

        console.log(req.body)

    const username = req.body.username;
    const file = req.files.file;

    db.query("SELECT size FROM files WHERE author = ?", username, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).send(err)
        }
        const totalSize = 50000000000;
        const size = 0;

            /*result.data.map((file) => {
                size += file.size
            })*/

        if ((size + file.size) >= totalSize) {
            res.send("Not enough storage. --Increase options")
            return
        } 

    })

    console.log(username, file.name, file)

    const filename =  Date.now() + file.name;

    file.mv(`${__dirname}/files/${filename}`, err => {
        if (err) {
            console.log(err)
            return res.status(500).send(err)
        }

        res.json({fileName: filename, filePath: `/files/${filename}`, message: "Uploaded!"})
    })

    const date = new Date();
    const stamp = date.getFullYear() + "-" + date.getDay() + "-" + date.getMonth() + "/" + date.getHours() + ":" + date.getMinutes();

    db.query("INSERT INTO files (filename, author, size, type, uploadDate, downloads) VALUES (?, ?, ?, ?, ?, ?)", ["/files/" + filename, username, file.size, file.mimetype, stamp, 0], (err, result) => {
            if(err) {
                console.log(err)
            } 
            console.log(result)
        });   
})

// Route for creating a user
app.post('/api/createuser', (req, res) => {

    console.log(req.body)

    const data = JSON.stringify(req.body.data);
    console.log(data)
    const username = req.body.data.username;
    //const password = bcrypt.hashSync(req.body.password, 10);
    const password = req.body.data.password;
    const email = req.body.data.email;
    const token = Date.now * randomUUID();
    
    db.query("INSERT INTO users (email, password, username, postToken) VALUES (?, ?, ?, ?);", [email, password, username, token], (err, result) => {
            if(err) {
                console.log(err)
            } 
                console.log(result)
                res.send()
            });   
    })

// Route for signin
app.post('/api/signin', (req, res) => {

    console.log(req.body)

    const data = JSON.stringify(req.body.data);
    console.log(data)
    const username = req.body.data.username;
    //const password = bcrypt.hashSync(req.body.password, 10);
    const password = req.body.data.password;

    db.query("SELECT * FROM users WHERE username = ? OR email = ?;", [username, username], (err, result) => {
        if (err) {
            console.log(err)
        }

        result.map((user) => {
            if (password === user.password) {
                res.send({"username": user.username, "pfp": user.pfp, "__vnn": user.activated, "postToken": user.postToken, "email": user.email});
            }
        })
        
        console.log(result)

            /*bcrypt.compare(password, result.password, (err, res) => {
                if (err) {
                    console.log(err)
                }
                if (res) {
                    console.log(res)
                    return response.json({success: true, message: 'Signed In', username: result.username})
                } else {
                    return response.json({success: false, message: 'Passwords do not match.'});
                }
            })*/
    })
})

// Route to check admin status
app.get('/api/user/isadmin', (req, res) => {

    const username = req.body.data.username;

    db.query("SELECT * FROM users WHERE username = ?;", [username], (err, result) => {

        if (err) {
            console.log(err)
        }

        result.map((user) => {
            if (user.isAdmin === 1) {
                res.send("true");
            }
        })
    })
})

// Route for like
app.post('/api/like/:id', (req, res) => {

const id = req.params.id;
db.query("UPDATE posts SET likes = likes + 1 WHERE id = ?", id, (err, result) => {
    if(err) {
        console.log(err)
    } 
        console.log(result)
    });    
});

// Route to delete a post
app.post('/api/delete/', (req, res) => {

    console.log(req)
    const id = req.body.filename;
    const author = req.body.author;

db.query("SELECT * FROM files WHERE filename = ?", id, (err, res) => {
    if(err) {
        console.log(err)
    }
    if (res.author !== author) {
        return
    }
})

db.query("DELETE FROM files WHERE filename = ?", id, (err, response) => {
    if(err) {
        console.log(err)
            } 
        res.send({message: `Deleted ${id}`})
        try {
            fs.unlinkSync(id)
            return
        } catch (err) {
            console.log(err)
        }
    })
})

// Route for setting pfp
app.post('/api/user/pfp/:id', (req, res) => {

    const username = req.params.id;
    const file = req.files.file;

    const filename =  Date.now() + file.name;

    if (file.size >= 8388608) {
        res.send({message: "File too large. Anything under 8Mb is good."})
        return
    }
    if (!(file.mimetype).includes("image")) {
        res.send({message: "Wrong filetype. Image types only please."})
        return
    }

    file.mv(`${__dirname}/files/pfps/${filename}`, err => {
        if (err) {
            console.log(err)
            return res.status(500).send(err)
        }
    })

    db.query("UPDATE users SET pfp = ? WHERE username = ?", ["/files/pfps/" + filename, username], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).send(err)
        }
        res.send({message: "Upload Succesful"})
    })
})


// Route for creating a pass reset req & email
app.post('/api/forgot', (req, res) => {

    console.log(req.body.email)
    const email = req.body.email
    const token = Date.now() + randomBytes(5)
    
    db.query('UPDATE users SET token = ? WHERE email = ?', [token, email], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).send(err)
        }
        console.log(result)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: `${user}`,
                pass: `${pass}`,
            }
        });

        const date = new Date

        const mailOptions = {
            from: 'nnexsus.service@gmail.com',
            to: `${email}`,
            subject: 'Reset Password Request',
            text:
            "Click the link below to reset your password. If you didn't request a password reset, then ignore this message.\n\n"
            + `This link expires after an hour, or after use. Request was made at ${date.getHours}:${date.getMinutes} on ${date.getDate}. Please make sure this is when the request was made.\n`
            + `http://localhost:3000/reset/${token}\n`
            + "Thank you for using nnexsus-server. If you have any more needs or questions, you can reply to this email: nnexsus.service@gmail.com.\n\n"
            + "-nnexsus.service / nnexsus.server\n",
        }
        console.log(`${email} send a password request. sending req email now`)

        transporter.sendMail(mailOptions, (err, emailResponse) => {
            if (err) {
                console.log(err)
                return res.status(500).send(err)
            }
            console.log(emailResponse)
            res.send({message: "Recovery Email Sent"})
        })


    })
})

// Route for resetting password
app.post('/api/reset/:id', (req, res) => {

    const token = req.params.id
    const newPass = req.body.newpass

    if ((Date.now - token) / 1000 > 3600) {
        return res.status(417).send({err: "Token lifetime > 1 hour, expired."})
    }

    db.query('UPDATE users SET password = ? WHERE token = ?', [newPass, token], (err, response) => {
        if (err) {
            console.log(err)
            return res.status(500).send(err)
        }
        console.log(response)
        db.query('UPDATE users SET token = ? WHERE token = ?', [null, token], (err, rstRes) => {
            if (err) {
                console.log(err)
                return res.status(500).send(err)
            }
            console.log(response)
            res.send({message: "Password reset successful"})
        })
    })
})

// Route to delete account and all posts
app.post('/api/deleteall', (req, res) => {
    console.log(req.body)
    
    const pass = req.body.password;
    const author = req.body.username;

    db.query('DELETE FROM files WHERE author = ?', author, (err, response) => {
        if (err) {
            console.log(err)
            return res.status(500).send(err)
        }
        console.log(response)
        db.query('DELETE FROM users WHERE username = ?', author, (err, response) => {
            if (err) {
                console.log(err)
                return res.status(500).send(err)
            }
            res.send({message: "Account Deleted."})
        })
    })
    
})

// Route to send verify emali
app.post('/api/verify', (req, res) => {

    console.log(req.body.email)
    const email = req.body.email
    const token = Date.now() + "vnn"  + randomBytes(5)
    
    db.query('UPDATE users SET token = ? WHERE email = ?', [token, email], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).send(err)
        }
        console.log(result)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: `${user}`,
                pass: `${pass}`,
            }
        });

        const mailOptions = {
            from: 'nnexsus.service@gmail.com',
            to: `${email}`,
            subject: 'Verify Server Account',
            text:
            "Click the link below to verify your account.\n\n"
            + "Thank you for registering for nnexsus-server. Upon verifying your account you'll gain access to a secured, 50Gb cloud server.\n"
            + "By verifying this account, you agree to the terms of service. Which can be found here: http://localhost:3000/tos\n"
            + `http://localhost:3000/verify/${token}\n`
            + "Thank you for using nnexsus-server. If you have any more needs or questions, you can reply to this email: nnexsus.service@gmail.com.\n\n"
            + "-nnexsus.service / nnexsus.server\n",
        }
        console.log(`${email} send a verification request. sending req email now`)

        transporter.sendMail(mailOptions, (err, emailResponse) => {
            if (err) {
                console.log(err)
                return res.status(500).send(err)
            }
            console.log(emailResponse)
            res.send({message: "Verification Email Sent"})
        })


    })
})

// Route to verify account
app.post('/api/verify/:id', (req, res) => {

    const token = req.params.id

    db.query('UPDATE users SET activated = 1 WHERE token = ?', token, (err, response) => {
        if (err) {
            console.log(err)
            return res.status(500).send(err)
        }
    })
    db.query('UPDATE users SET token = ? WHERE token = ?', [null, token], (err, response) => {
        if (err) {
            console.log(err)
            return
        }
        res.send({message: "Account Verified"})
    })

})

// Route to star a posts from user
app.post("/api/star/:id", (req, res) => {

    const id = req.params.id;
    const auth = req.body.author;

    db.query("SELECT * FROM files WHERE author = ? AND filename = ?", [auth, "/files/" + id], (err, result) => {
        var star = null;
        if (err) {
            console.log(err)
            return res.status(500).send(err)
        }
        console.log(result)
        result.map((file) => {
            console.log(file)
            if (file.starByAuth == 1) {
                star = 0;
                return
            }
            star = 1;
        })
        db.query("UPDATE files SET starByAuth = ? WHERE filename = ?", [star, "/files/" +  id], (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).send(err)
            } 
                res.send({message: `${star == 1 ? "Post Favorited" : "Removed From Favorites"}`})
        });  
    }); 
});

// Route to private someones post
app.post('/api/private/:id', (req, res) => {

    const id = req.params.id;
    const rqAuth = req.body.admin;

    db.query("UPDATE files SET public = 0 WHERE filename = ?", id).then((response) => {
        if (err) {
            console.log(err)
            return res.status(500).send(err)
        } 
            res.send(result)
    })
})

// Route to update download count
app.post('/api/download/:id', (req, res) => {

    const id = req.params.id;
    const downloads = req.body.downloads;

    db.query("UPDATE files SET downloads = ? WHERE filename = ?", [downloads, id]).then((response) => {
        if (err) {
            console.log(err)
            return res.status(500).send(err)
        } 
        return res.status(200)
    })
})

//
//
//
//  discord api below this point
//
//

// Route for creating the post
app.post('/api/create/discord', (req, res) => {

    console.log(req)

const username = req.body.username;
const server = req.body.server;
const serverid = req.body.serverid;
const customname = req.body.customname;
const file = req.body.file;

const date = new Date();
const stamp = date.getFullYear() + "-" + date.getDay() + "-" + date.getMonth() + "/" + date.getHours() + ":" + date.getMinutes();

db.query("INSERT INTO discord (filename, customname, author, server, serverid, date) VALUES (?, ?, ?, ?, ?, ?)", [file, customname, username, server, serverid, stamp], (err, result) => {
        if(err) {
            console.log(err)
            return
        } 
        console.log(result)
    });   
})

app.get('/api/get/discord/:id', (req, res) => {

    const customname = req.params.id;

    db.query("SELECT * FROM discord WHERE customname = ?", customname, (err, result) => {
        if (err) {
            console.log(err)
            return
        }
        res.send(result)
    })

})

app.get('/api/getall/discord', (req, res) => {
    db.query("SELECT * FROM discord", (err, result) => {
        if (err) {
            console.log(err)
            return
        }
        res.send(result)
    })
})

app.get('/api/get/discorduser/:id', (req, res) => {
    const author = req.params.id
    db.query("SELECT * FROM discord WHERE author = ? LIMIT 25", author, (err, result) => {
        if (err) {
            console.log(err)
            return
        }
        res.send(result)
    })
})

app.post('/api/get/discordserver', (req, res) => {
    const server = req.body.server
    console.log(req.body)
    db.query("SELECT * FROM discord WHERE serverID = ? LIMIT 25", server, (err, result) => {
        if (err) {
            console.log(err)
            return
        }
        res.send(result)
    })
})

app.post('/api/get/discordserveruser', (req, res) => {
    const author = req.body.author
    const server = req.body.server
    console.log(req.body)
    db.query("SELECT * FROM discord WHERE server = ? AND author = ? LIMIT 25", [server, author], (err, result) => {
        if (err) {
            console.log(err)
            return
        }
        res.send(result)
    })
})

app.get('/api/getall/discordrand', (req, res) => {
    db.query("SELECT * FROM discord ORDER BY RAND() LIMIT 1", (err, result) => {
        if (err) {
            console.log(err)
            return
        }
        res.send(result)
    })
})

app.get('/api/getview/discord', (req, res) => {
    db.query("SELECT * FROM discord LIMIT 5", (err, result) => {
        if (err) {
            console.log(err)
            return
        }
        res.send(result)
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})