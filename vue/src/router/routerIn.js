const home = resolve => require(["@/page/home/home.vue"], resolve);

let timestamp = null;
if (!sessionStorage.getItem("timestamp")) {
  var timeInit = Date.parse(new Date());
  sessionStorage.setItem("timeInit", timeInit);
  timestamp = timestamp;
} else {
  timestamp = sessionStorage.getItem("timestamp");
}

export const routes = [
  {
    path: "/",
    name: "home",
    component: home
  }
];
