const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
// lấy dữ liệu từ client
var bodyParser = require("body-parser");
// SInh id tự động
const { v4: uuidv4 } = require("uuid");

app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// GetAll question
app.get("/api/v1/questions", (req, res) => {
  fs.readFile("./dev-data/questions.json", (err, data) => {
    if (err) {
      return res.status(500).json({
        status: "false",
        message: err.message,
      });
    } else {
      const questions = JSON.parse(data);
      return res.status(200).json({
        status: "success",
        results: questions.length,
        data: questions,
      });
    }
  });
});

// GetById question
app.get("/api/v1/questions/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile("./dev-data/questions.json", (err, data) => {
    if (err) {
      return res.status(500).json({
        status: "false",
        message: err.message,
      });
    }

    const questions = JSON.parse(data);
    const question = questions.find((q) => q.id === parseInt(id));
    console.log(question);

    if (!question) {
      return res.status(404).json({
        status: "success",
        message: "Question not found",
      });
    } else {
      return res.status(200).json({
        status: "success",
        data: question,
      });
    }
  });
});

// Middleware checkExist
const checkExist = (req, res, next) => {
  const { content } = req.body;
  const questions = JSON.parse(fs.readFileSync("./dev-data/questions.json"));

  // Kiểm tra theo content
  const questionByContent = questions.find(
    (question) => question.content === content
  );
  if (questionByContent) {
    return res.status(404).json({ message: "Question already exists" });
  }

  next();
};

// Post qustion
app.post("/api/v1/questions", checkExist, (req, res) => {
  const { content } = req.body;

  fs.readFile("./dev-data/questions.json", (err, data) => {
    if (err) {
      return res.status(500).json({
        status: "false",
        message: err.message,
      });
    }

    const questions = JSON.parse(data);

    const id = uuidv4();

    const newQuestion = {
      id: id,
      content,
      like: parseInt(1),
      dislike: parseInt(1),
    };

    questions.push(newQuestion);

    fs.writeFile(
      "./dev-data/questions.json",
      JSON.stringify(questions),
      (err) => {
        if (err) {
          return res.status(500).json({
            status: "false",
            message: err.message,
          });
        }

        return res.status(201).json({
          status: "success",
          message: "Create successfully",
        });
      }
    );
  });
});

// Update questions
app.put("/api/v1/questions/:id", (req, res) => {
  const questionId = parseInt(req.params.id);
  const { content, like, dislike } = req.body;

  fs.readFile("./dev-data/questions.json", (err, data) => {
    if (err) {
      return res.status(500).json({
        status: "false",
        message: err.message,
      });
    }

    const questions = JSON.parse(data);
    const question = questions.find((q) => q.id === questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Cập nhật các trường thông tin mới
    Object.assign(question, {
      content: content,
      like: parseInt(like),
      dislike: parseInt(dislike),
    });

    fs.writeFile(
      "./dev-data/questions.json",
      JSON.stringify(questions),
      (err) => {
        if (err) {
          return res.status(500).json({
            status: "false",
            message: err.message,
          });
        } else {
          return res.status(200).json({
            status: "success",
            message: "Update successfully",
          });
        }
      }
    );
  });
});

// Xoa question theo id
app.delete("/api/v1/questions/:id", (req, res) => {
  const questionId = req.params.id;

  fs.readFile("./dev-data/questions.json", (err, data) => {
    if (err) {
      return res.status(500).json({
        status: "false",
        message: err.message,
      });
    }

    const questions = JSON.parse(data);
    const questionIndex = questions.findIndex((q) => q.id === questionId);

    if (questionIndex === -1) {
      return res.status(404).json({ message: "Question not found" });
    }

    questions.splice(questionIndex, 1);

    fs.writeFile(
      "./dev-data/questions.json",
      JSON.stringify(questions),
      (err) => {
        if (err) {
          return res.status(500).json({
            status: "false",
            message: err.message,
          });
        }
        return res.status(200).json({ message: "Delete successfully" });
      }
    );
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/html/index.html");
});

app.get("/ask", (req, res) => {
  res.sendFile(__dirname + "/public/html/ask.html");
});

app.get("/question-detail", (req, res) => {
  res.sendFile(__dirname + "/public/html/question-detail.html");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
