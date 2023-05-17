function fetchData(url) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // chuyển đổi từ json sang type js
      return response.json();
    })
    .then((data) => {
      console.log("data", data);
      // Thực hiện xử lý với dữ liệu đã nhận được ở đây
      if (data.data.length > 0) {
        //
        const randomIndex = Math.floor(Math.random() * data.data.length);

        const randomContent = data.data[randomIndex].content;

        const randomId = data.data[randomIndex].id;
        // Lấy ra element content
        let content = document.querySelector(".question-content");
        // Lấy element button like
        let like = document.getElementById("like");
        // Lấy element button dislike
        let dislike = document.getElementById("dislike");
        // Hiển thị nội dung ra ngoài trình duyệt
        content.innerHTML = randomContent;

        // Lắng nghe sự kiện click trên nút "like"
        like.addEventListener("click", () => {
          // Gửi yêu cầu GET để lấy thông tin câu hỏi hiện tại
          fetch(`http://localhost:3000/api/v1/questions/${randomId}`)
            .then((response) => {
              console.log("res", response);
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then((question) => {
              // Tăng giá trị like lên một đơn vị
              const updatedLike = parseInt(question.data.like) + 1;
              console.log("like", updatedLike);

              // Gửi yêu cầu PUT để cập nhật số lượng like
              return fetch(
                `http://localhost:3000/api/v1/questions/${randomId}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    like: parseInt(updatedLike),
                    content: question.data.content,
                    dislike: parseInt(question.data.dislike),
                  }), // Gửi số lượng like mới
                }
              );
            })
            .then((response) => {
              if (response.ok) {
                //   question.like = updatedLike;
                //   console.log(response.data.like);
                console.log("success");
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              // Xử lý lỗi ở đây nếu có
            });
        });

        // Lắng nghe sự kiện click trên nút "like"
        dislike.addEventListener("click", () => {
          // Gửi yêu cầu GET để lấy thông tin câu hỏi hiện tại
          fetch(`http://localhost:3000/api/v1/questions/${randomId}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then((question) => {
              console.log(question.data);
              // Tăng giá trị like lên một đơn vị
              const updatedDisLike = parseInt(question.data.dislike) + 1;

              // Gửi yêu cầu PUT để cập nhật số lượng like
              return fetch(
                `http://localhost:3000/api/v1/questions/${randomId}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    dislike: parseInt(updatedDisLike),
                    content: question.data.content,
                    like: parseInt(question.data.like),
                  }), // Gửi số lượng like mới
                }
              );
            })
            .then((response) => {
              if (response.ok) {
                console.log("success");
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              // Xử lý lỗi ở đây nếu có
            });
        });
      } else {
        console.log("No data available.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      // Xử lý lỗi ở đây nếu có
    });
}

fetchData("http://localhost:3000/api/v1/questions");
