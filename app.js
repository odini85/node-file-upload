const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");

dotenv.config();

const app = express();
app.set("port", process.env.PORT || 3000);
app.use(cors());
app.use("/static", express.static(__dirname + "/uploads"));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: { httpOnly: true, secure: false },
    name: "session-cookie",
  })
);

app.use((req, res, next) => {
  console.log("모든 요청에 다 실행됩니다.");
  next();
});

app.listen(app.get("port"), () => {
  console.log(`${app.get("port")} port ready`);
});

try {
  fs.readdirSync("uploads");
} catch (e) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성");
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, res, done) {
      done(null, "uploads/");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, `${path.basename(file.originalname, ext)}${Date.now()}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

app.get("/", (req, res) => {
  let html = `
  <nav>
    <a href="/">홈</a> |
    <a href="/upload">upload</a>
  </nav>
`;
  try {
    const files = fs.readdirSync("uploads");
    html += `<ul>`;
    files.forEach((filename) => {
      html += `<li><img src="/static/${filename}" alt="" style="border:2px solid red; width:100px;" /></li>`;
    });
    html += `</ul>`;
  } catch (e) {
    console.log("!!!!", e);
  }

  res.send(html);
});

app.get("/upload", (req, res, next) => {
  res.sendFile(path.join(__dirname, "multipart.html"));
});

app.post(
  "/upload",
  upload.fields([{ name: "image1" }, { name: "image2" }]),
  (req, res) => {
    // console.log(req.files, req.body);

    res.status(200).send({
      header: {
        resultCode: 0,
        resultMessage: "",
        successful: true,
      },
    });
  }
);

app.post("/upload-single", upload.fields([{ name: "file" }]), (req, res) => {
  // console.log(req.files, req.body);

  res.status(200).send({
    header: {
      resultCode: 0,
      resultMessage: "",
      successful: true,
    },
  });
});

app.use((err, res, next) => {
  console.error("404 !!!error");
  res.status(404).send({
    header: {
      resultCode: 0,
      resultMessage: "404 error",
      successful: false,
    },
  });
});
