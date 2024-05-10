module.exports = (app) => {
  const Chats = app.db.models.Chats;

  // GET ALL
  app.route("/api/chats").get((req, res) => {
    Chats.findAll({
      order: [['createdAt', 'ASC']]
    }).then((result) => {
      res.json(result);
    });
  });

  // GET ONE
  app.route("/api/chats/:id").get((req, res) => {
    Chats.findOne({
      where: {
        chat_id: req.params.id + '@c.us',
      },
    }).then((result) => {
      res.json(result);
    });
  });



};
