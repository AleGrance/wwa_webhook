module.exports = (app) => {
  const Messages = app.db.models.Messages;

  // GET ALL
  app.route("/api/messages").get((req, res) => {
    Messages.findAll().then((result) => {
      res.json(result);
    });
  });

  // GET ONE
  app.route("/api/messages/:id").get((req, res) => {
    Messages.findOne({
      where: {
        msg_id: req.params.id,
      },
    }).then((result) => {
      res.json(result);
    });
  });

  // GET by chat
  app.route("/api/messagesChat/:id").get((req, res) => {
    Messages.findAll({
      where: {
        chat_id: req.params.id + "@c.us",
      },
      order: [["createdAt", "ASC"]],
    }).then((result) => {
      res.json(result);
    });
  });
};
