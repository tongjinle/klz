const socket = io("http://10.6.131.27:3000");
// const socket = io.connect("localhost", { port: 3000 });
socket.on("connect", () => {
  console.log("connect");
});
console.log("index.js");

$.get("http://localhost:3000/test", res => {
  console.log(res);
});

let store = { username: "", isOnline: false };

$(function() {
  let username = localStorage.getItem("username");
  setUsername(username);
  setIsOnline(store.isOnline);

  $("#reg").click(() => {
    socket.emit("reg");
  });

  $("#login").click(() => {
    let username = localStorage.getItem("username");
    if (username) {
      socket.emit("login", { username });
    } else {
      alert("请先注册");
    }
  });

  $("#logout").click(() => {
    socket.emit("logout");
  });

  $("#send").click(() => {
    let text = $("#text").val();
    if (text.length) {
      socket.emit("message", { type: "chat", data: { text } });
      $("#text").val("");
      appendMessage(text, "right");
    }
  });
});

socket.on("reg", data => {
  let username = data.username;
  console.log(username);
  localStorage.setItem("username", username);
  setUsername(username);
});

socket.on("login", data => {
  let { flag } = data;
  if (flag) {
    setIsOnline(true);
  }
});

socket.on("logout", data => {
  let { flag } = data;
  if (flag) {
    setIsOnline(false);
  }
});

socket.on("disconnet", () => {
  setIsOnline(false);
});

socket.on("message", ({ type, data }) => {
  console.log(data);
  appendMessage(data.text, "left");
});

function setUsername(username) {
  if (!username) {
    $(".username").text("未注册");
  } else {
    store.username = username;
    $(".username").text(username);
  }
}

function setIsOnline(flag) {
  store.isOnline = flag;
  $(".isOnline").text(flag ? "在线" : "离线");
}

function appendMessage(text, direction) {
  let textNode = $("<div/>")
    .addClass("text")
    .addClass(direction)
    .text(text);
  $("#board").append(textNode);
}
