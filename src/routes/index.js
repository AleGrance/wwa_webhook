const axios = require("axios");
const wwaUrl = "http://localhost:3001/lead/";

module.exports = (app) => {
  const Chats = app.db.models.Chats;
  const Messages = app.db.models.Messages;
  const Contacts = app.db.models.Contacts;

  const htmlBody = `
  <div style="text-align: center;">
  <h1>ERROR 404</h1>
  <br>
  <img src="http://i.stack.imgur.com/SBv4T.gif" alt="I choose you!"  width="250" />
  <br>
  <h1>Page not found</h1>
  </div>
  `;
  app.get("/", (req, res) => {
    res.status(404).send(htmlBody);
    //res.json({message: "EndPoint API"})
  });

  app.route("/api").get((req, res) => {
    res.status(404).send(htmlBody);
    //res.json({message: "EndPoint API"})
  });

  // Recibe el cuerpo del mensaje recibido enviado por CUSTOMER
  app.post("/api/msgRecibido", async (req, res) => {
    res.status(200).send();
    console.log("BODY DEL MENSAJE RECIBIDO ENVIADO POR CUSTOMER");
    //console.log(req.body);

    const newMessage = {
      msg_id: req.body.id.id,
      msg_body: req.body.body,
      type: req.body.type,
      notifyName: req.body.notifyName,
      msg_time: req.body.t,
      msg_act: req.body.ack,
      chat_id: req.body.from,
    };

    console.log(newMessage);

    // Buscar el chat_id y si no existe crearlo por Customer y luego insertar el mensaje
    const chat = await Chats.findByPk(req.body.from);
    if (!chat) {
      // Si no existe el chat se guarda el chat y luego de eso se guarda el mensaje
      const newChat = {
        chat_id: req.body.from,
        chat_creator: "Customer",
        chat_status: 1,
      };

      // Insert new chat and message
      createChat(newChat, newMessage);
    } else {
      // Si ya existe el chat se guarda el mensaje solamente
      createMessage(newMessage);
    }
  });

  // Recibe el cuerpo del mensaje enviado por BUSINESS
  app.post("/api/msgEnviado", async (req, res) => {
    res.status(200).send();
    console.log("BODY DEL MENSAJE ENVIADO POR BUSINESS");
    console.log(req.body);
    const newMessage = req.body;

    // Buscar el chat_id y si no existe crearlo por Business y luego insertar el mensaje
    const chat = await Chats.findByPk(req.body.chat_id);
    if (!chat) {
      // Si no existe el chat se guarda el chat y luego de eso se guarda el mensaje
      const newChat = {
        chat_id: req.body.chat_id,
        chat_creator: "Business",
        chat_status: 1,
      };

      // Insert new chat and message
      createChat(newChat, newMessage);
      console.log("NO EXISTE CHAT CON ESE ID");
    } else {
      // Si ya existe el chat se guarda el mensaje solamente
      createMessage(newMessage);
      console.log("EXISTE CHAT CON ESE ID");
    }
  });

  // Recibe el estado del mensaje cuando se haya leido y se actualiza en la tabla
  app.post("/api/messageAct", async (req, res) => {
    res.status(200).send();
    console.log("BODY DEL MENSAJE ACK RECIBIDO");
    console.log(req.body);

    const resultado = await Messages.update(
      { msg_act: 3 },
      { where: { msg_id: req.body.messageId.id } }
    );

    console.log(`${resultado} registros actualizados.`);
  });

  // Crear chat por Customer o por Business
  async function createChat(newChat, newMessage) {
    // Buscar el contacto y crearlo si no existe
    const contact = await Contacts.findByPk(newChat.chat_id);
    if (!contact) {
      // Si no existe el contacto en la base se pide sus datos al wwa
      const newContact = await axios.get(wwaUrl + "contactInfo/" + newChat.chat_id);
      console.log('RESPUESTA DE WWA - DATOS DEL CONTACTO', newContact.data);
    }

    // Insert new chat
    // Chats.create(newChat)
    //   .then(
    //     (result) => {
    //       console.log("CHAT INSERTADO - CUSTOMER");
    //       console.log(result.dataValues);
    //       // Una vez creado el chat por Customer se guarda el mensaje
    //       createMessage(newMessage);
    //     }
    //     // res.json({
    //     //   status: "success",
    //     //   body: result,
    //     // })
    //   )
    //   .catch(
    //     (error) => {
    //       console.log(error);
    //     }
    //     // res.json({
    //     //   status: "error",
    //     //   body: error.errors,
    //     // })
    //   );
  }

  // Crear mensaje luego de haber creado un chat
  function createMessage(newMessage) {
    Messages.create(newMessage)
      .then(
        (result) => {
          console.log("MENSAJE INSERTADO");
          console.log(result.dataValues);
        }
        // res.json({
        //   status: "success",
        //   body: result,
        // })
      )
      .catch(
        (error) => {
          console.log(error);
        }
        // res.json({
        //   status: "error",
        //   body: error.errors,
        // })
      );
  }
};
