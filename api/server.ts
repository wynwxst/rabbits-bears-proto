const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let rabbits = [
  { name: "Fluffy", color: "beige", safe: false },
  { name: "Shadow", color: "black", safe: false },
  { name: "John D. Rabbit", color: "brown", safe: false },
  { name: "Miffy", color: "white", safe: false },
  { name: "Nyx", color: "black", safe: false },
  { name: "Anastasia", color: "white", safe: false }

];

let user = { username: "guest", isBears: false };




// Hmm, this is totally not vulnerable to prototype pollution
function merge(target, source) {
    /*It would be a shame if source happened to have something it shouldn't */

  for (let key in source) {
    if (typeof source[key] === "object" && source[key] !== null) {
      if (!target[key]) target[key] = {};
      merge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

// User preferences
app.post("/update", (req, res) => {
    /* All it takes is a post request
        maybe post malone?
        {"my_request":{...}}
     */
  merge(user, req.body);
  res.json({ message: "Preferences updated!", user });
});

// View rabbits
app.get("/rabbits", (req, res) => {
  res.json(rabbits);
});

app.get("/", (req, res) => {
    return res.type("text").send(`The story so far:\n
        \n  A bunch of rabbits were playing in the huckleberry patch.
        \n  However, one rabbit dared Fluffy to go into a bear's cave.
        \n  No one dares Fluffy.
        \n  So they all went together into the cave.
        \n  The silly little rabbits were apprehended by the bears.
        \n  The bears plan to eat them by dawn.
        \nCan you save them?`);
  });

// Target :
app.get("/save", (req, res) => {
    if (!user.isBears) {
      return res.status(403).send("Access denied. Only Bears can save rabbits (They never will).");
    }
    for (let rabbit of rabbits){
        rabbit.safe = true;
    }
    res.type("text").send(`                      /|      __
        *             +      / |   ,-~ /             +
             .              Y :|  //  /                .         *
                 .          | jj /( .^     *
                       *    >-"~"-v"              .        *        .
        *                  /       Y
           .     .        jo  o    |     .            +
                         ( ~T~     j                     +     .
              +           >._-' _./         +
                       /| ;-"~ _  l
          .           / l/ ,-"~    \     +
                      \//\/      .- \
               +       Y        /    Y
                       l       I     !
                       ]\      _\    /"\
                      (" ~----( ~   Y.  )
                  ~~~~~~~~~~~~~~~~~~~~~~~~~~\n` + "For some reason the bears kept this endpoint, the rabbits are safe!!\nThey nuzzle up to you happily!");
    ;

  });

console.log("(\_._/)  Welcome to Rabbit Farm!");
console.log("( o.o )  Can you rescue them from the evil bears?");
console.log(" > ^ < ");

app.listen(4000, () => {
  console.log("🐇 Rabbit farm running on http://localhost:4000");
}).on("error", err => {
    console.error("Failed to start server:", err);
});

module.exports = app;


