let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../src/server");
let should = chai.should();

chai.use(chaiHttp);

describe("Requst to /", () => {
  it("it should return welcome message", (done) => {
    chai
      .request(server)
      .get("/")
      .end((err, res) => {
        res.body.should.be.a("object");
        res.body.should.have.status(200);
        res.body.should.have
          .property("message")
          .eql("Hello welcome to Movie World");
        done();
      });
  });
});

describe("GET Movies", () => {
  it("it should GET all the movies", (done) => {
    chai
      .request(server)
      .get("/movies")
      .end((err, res) => {
        res.body.should.be.a("object");
        res.body.should.have.property("movies");
        res.body.should.have.status(200);
        res.body["movies"].should.have.property("1");
        res.body["movies"].should.have.property("2");
        res.body["movies"].should.have.property("3");
        res.body["movies"][1].should.have.property("title").eql("Batman");
        res.body["movies"][2].should.have.property("actor").eql("Henry Cavill");
        res.body["movies"][3].should.have
          .property("description")
          .eql("Catch em all");
        done();
      });
  });
});
describe("POST Movie", () => {
  describe("POST New Movie with all parameters", () => {
    it("it should add a new movie", (done) => {
      chai
        .request(server)
        .post("/movies")
        .send({
          title: "Ip Man",
          actor: "Donnie Yen",
          rating: 4.8,
          description: "Wo yao da shi ge",
        })
        .end((err, res) => {
          res.body.should.have.status(201);
          res.body.should.have.property("message").eql("Ip Man has been added");
          done();
        });
    });
  });

  describe("POST New Movie with missing description", () => {
    it("it should return a bad request response", (done) => {
      chai
        .request(server)
        .post("/movies")
        .send({
          title: "Fight Club",
          actor: "Brad Pitt",
          rating: 4.9,
        })
        .end((err, res) => {
          res.body.should.have.status(400);
          res.body.should.have
            .property("message")
            .eql("Please provide a description");
          done();
        });
    });
  });

  describe("POST Existing Movie with all parameters", () => {
    it("it should add a copy of the existing movie under a different ID", (done) => {
      chai
        .request(server)
        .post("/movies")
        .send({
          title: "Batman",
          actor: "Bruce Wayne",
          rating: 4.2,
          description: "Bruce Wayne is Batman",
        })
        .end((err, res) => {
          res.body.should.have.status(201);
          res.body.should.have.property("message").eql("Batman has been added");
          done();
        });
    });
  });
});

describe("PUT Movie", () => {
  describe("PUT New Movie", () => {
    it("it should add a new movie", (done) => {
      chai
        .request(server)
        .put("/movies")
        .send({
          title: "Star Wars",
          actor: "Mark Hamill",
          rating: 4.1,
          description: "May the force",
        })
        .end((err, res) => {
          res.body.should.have.status(201);
          res.body.should.have
            .property("message")
            .eql("Star Wars has been added");
          done();
        });
    });
  });

  describe("PUT Existing Movie with all parameters", () => {
    it("it should modify the existing movie", (done) => {
      chai
        .request(server)
        .put("/movies")
        .send({
          title: "Batman",
          actor: "Bruce Wayne",
          rating: 4.2,
          description: "Bruce Wayne is not Batman?",
        })
        .end((err, res) => {
          res.body.should.have.status(200);
          res.body.should.have
            .property("message")
            .eql("Batman has been modified");
          res.body.should.have.property("movie");
          done();
        });
    });
  });

  describe("PUT Existing Movie with some parameters", () => {
    it("it should modify the existing movie", (done) => {
      chai
        .request(server)
        .put("/movies")
        .send({
          title: "Superman",
          actor: "Clark Kent",
          description: "Man of Steel",
        })
        .end((err, res) => {
          res.body.should.have.status(200);
          res.body.should.have
            .property("message")
            .eql("Superman has been modified");
          res.body.should.have.property("movie");
          res.body["movie"]["rating"].should.be.eql(3.9); // unchanged
          res.body["movie"]["actor"].should.be.eql("Clark Kent"); // changed
          done();
        });
    });
  });
});

describe("DELETE Movies", () => {
  describe("DELETE Movie specificed by ID", () => {
    it("it should delete movie specified by movie ID", (done) => {
      chai
        .request(server)
        .delete("/movies?id=4")
        .end((err, res) => {
          res.body.should.be.a("object");
          res.body.should.have.status(200);
          res.body.should.have
            .property("message")
            .equal("Ip Man has been deleted");
          done();
        });
    });
  });
  describe("DELETE Movie without specifying ID", () => {
    it("it should return a BAD REQUEST response", (done) => {
      chai
        .request(server)
        .delete("/movies")
        .end((err, res) => {
          res.body.should.be.a("object");
          res.body.should.have.status(400);
          res.body.should.have
            .property("message")
            .equal("Please specify movie ID");
          done();
        });
    });
  });

  describe("DELETE Movie specifying invalid ID", () => {
    it("it should return a NOT FOUND response", (done) => {
      chai
        .request(server)
        .delete("/movies?id=404")
        .end((err, res) => {
          res.body.should.be.a("object");
          res.body.should.have.status(404);
          res.body.should.have
            .property("message")
            .equal("Movie with the ID: 404 does not exist");
          done();
        });
    });
  });
});
