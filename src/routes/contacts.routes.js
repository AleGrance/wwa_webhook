module.exports = (app) => {
  const Contacts = app.db.models.Contacts;

  // GET ALL
  app.route("/api/contacts").get((req, res) => {
    Contacts.findAll().then((result) => {
      res.json({
        msg: "Respuesta desde contacts routes",
      });
      console.log(result);
    });
  });

  // POST
  app.route("/api/contacts").post((req, res) => {
    console.log(req.body);

    Contacts.create(req.body)
    .then((result) => {
        res.json({
            msg: 'Contacto creado..'
        })
    })
  })
};
