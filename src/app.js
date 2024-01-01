const express = require("express");
const path = require("path");
const hbs = require("hbs");
const session = require("express-session");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { getSurahList, getSurahDetail } = require("./utils/quran");
const { getBerita } = require("./utils/berita");
const { getDoaList } = require("./utils/doa");
const nodemailer = require("nodemailer");

const app = express();
const port = process.env.PORT || 3000;

// Mongoose connection
mongoose.connect("mongodb://localhost:27017/muslimExpressDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Body parser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Mengatur view engine
app.set("view engine", "hbs");

// Mengatur direktori untuk file statis
const direktoriPublic = path.join(__dirname, "../public");
app.use(express.static(direktoriPublic));

// Mengatur direktori views dan partials untuk Handlebars
const direktoriViews = path.join(__dirname, "../templates/views");
const direktoriPartials = path.join(__dirname, "../templates/partials");

app.set("views", direktoriViews);
hbs.registerPartials(direktoriPartials);

// Express session setup
app.use(
  session({
    secret: "your-secret-key",
    resave: true,
    saveUninitialized: true,
  })
);

// MongoDB User schema
const User = mongoose.model("User", {
  email: String,
  password: String,
});

// Routes
app.get("/", (req, res) => {
  if (req.session.userId) {
    // User sudah login, arahkan ke halaman utama atau yang diinginkan
    res.redirect("/dashboard");
  } else {
    // User belum login, arahkan ke halaman login
    res.render("login");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && bcrypt.compareSync(password, user.password)) {
    // Login berhasil
    req.session.userId = user._id;
    res.redirect("/dashboard");
  } else {
    // Login gagal
    res.render("login", { error: "email atau password salah" });
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = new User({
    email,
    password: hashedPassword,
  });

  await user.save();

  // Redirect ke halaman dashboard setelah registrasi berhasil
  res.redirect("/dashboard");
});

app.get("/dashboard", (req, res) => {
  // Halaman utama setelah login berhasil
  res.render("dashboard");
});


app.get("/logout", (req, res) => {
  // Logout user dan redirect ke halaman login
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.get("/quran", async (req, res) => {
  try {
    const surahList = await getSurahList();
    res.render("quran", {
      title: "Al-Qur'an",
      surahList,
    });
  } catch (error) {
    res.render("error", {
      title: "Error",
      errorMessage: "Failed to fetch Quran data.",
    });
  }
});

app.get("/quran/:surahNumber", async (req, res) => {
  const surahNumber = req.params.surahNumber;

  try {
    const surahDetail = await getSurahDetail(surahNumber);
    res.render("detailSurah", {
      title: `Surah ${surahDetail.nama}`,
      surahDetail,
    });
  } catch (error) {
    res.render("error", {
      title: "Error",
      errorMessage: "Failed to fetch surah detail.",
    });
  }
});


// Halaman berita islam
app.get("/berita", async (req, res) => {
  try {
    const berita = await getBerita();
    res.render("berita", {
      judul: "Berita Islami",
      berita,
    });
  } catch (error) {
    res.status(500).render("error", {
      errorMessage: "Terjadi kesalahan dalam memproses permintaan berita.",
    });
  }
});

app.get("/doa", async (req, res) => {
  try {
    const doaList = await getDoaList();

    res.render("doa", {
      judul: "Daftar Doa",
      doaList,
    });
  } catch (error) {
    res.status(500).render("error", {
      errorMessage: "Terjadi kesalahan dalam memproses permintaan.",
    });
  }
});

// Halaman bantuan
app.get("/bantuan", (req, res) => {
  res.render("bantuan", {
    judul: "Bantuan",
    teksBantuan: "Ini adalah teks bantuan",
    nama: "Mukhtarijal",
  });
});

// Endpoint untuk menangani formulir laporan
app.post("/lapor", (req, res) => {
  // Ambil data dari formulir
  const { nama, email, pesan } = req.body;

  // Konfigurasi transporter nodemailer (sesuaikan dengan akun email Anda)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mukhtarijal6902@gmail.com",
      pass: "krgnkyxxmgcsjvdj",
    },
  });

  // Konfigurasi email
  const mailOptions = {
    from: "mukhtarijal6902@gmail.com",
    to: "mukhtarijal6902@gmail.com",
    subject: "Laporan Pengguna",
    text: `Nama: ${nama}\nEmail: ${email}\nPesan: ${pesan}`,
  };

  // Kirim email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Email sent successfully");
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
