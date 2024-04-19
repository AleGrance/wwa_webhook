import axios from "axios";
const moment = require('moment');
const Sequelize = require("sequelize");

module.exports = (app) => {
  const Chats = app.db.models.Chats;
  const Messages = app.db.models.Messages;

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

  app.post("/", async (req, res) => {
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
    if (chat === null) {
      // Si no existe el chat se guarda el chat y luego de eso se guarda el mensaje
      const newChat = {
        chat_id: req.body.from,
        chat_creator: "Customer",
        chat_status: 1,
      };

      // Insert new chat and message
      createChatCustomer(newChat, newMessage);
    } else {
      // Si ya existe el chat se guarda el mensaje solamente
      createMessage(newMessage);
    }
  });

  // Recibe el estado del mensaje cuando se haya leido
  app.post("/messageAct", async (req, res) => {
    res.status(200).send();
    console.log("BODY DEL MENSAJE ACK RECIBIDO");
    console.log(req.body);

    const resultado = await Messages.update(
      {msg_act: 3},
      { where: { msg_id: req.body.messageId.id } }
    );

    console.log(`${resultado} registros actualizados.`);
  });

  async function enviarMensaje() {
    const wwaUrl = "http://localhost:3001/lead";
    const dataBody = {
      message: "Prueba Webhook UPDA",
      phone: "595986153301",
      mimeType: "",
      data: "",
      fileName: "",
      fileSize: "",
    };

    try {
      const response = await axios.post(wwaUrl, dataBody, { timeout: 1000 * 60 });

      // Se envia el mensaje y se recibe el ID del chat para guardar en la tabla
      console.log("MENSAJE ENVIADO DESDE LA APP POR BUSINESS");
      console.log(response.data);

      // Se guarda en la tabla el id del chat nuevo
      console.log("Se procede a guardar el ID del chat en la BD");
      const newChat = {
        chat_id: response.data.responseExSave.chat_id,
        chat_creator: "Business",
        chat_status: 1,
      };

      console.log(newChat);

      // Insert new chat
      createChatBusiness(newChat);
      // Insert new message created by BUSINESS
      const fechaActualMiliseg = moment().valueOf();
      const newMessage = {
        msg_id: response.data.responseExSave.id,
        msg_body: dataBody.message,
        type: 'chat',
        notifyName: 'Business',
        msg_time: 1707516170,//fechaActualMiliseg,
        msg_act: 0,
        chat_id: response.data.responseExSave.chat_id,
      };

      createMessage(newMessage);
    } catch (error) {
      console.log("Error al enviar.", error.code);
    }
  }

  setTimeout(() => {
    enviarMensaje();
  }, 5000);

  // Crear chat por Customer o por Business
  function createChatCustomer(newChat, newMessage) {
    // Insert new chat
    Chats.create(newChat)
      .then(
        (result) => {
          console.log("CHAT INSERTADO - CUSTOMER");
          console.log(result.dataValues);
          // Una vez creado el chat por Customer se guarda el mensaje
          createMessage(newMessage);
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

  function createChatBusiness(newChat) {
    // Insert new chat
    Chats.create(newChat)
      .then(
        (result) => {
          console.log("CHAT INSERTADO - BUSINESS");
          console.log(result.dataValues);
        }
        // res.json({
        //   status: "success",
        //   body: result,
        // })
      )
      .catch(
        (error) => {
          if (error.original.code == 23505) {
            console.log({ error: error.original.detail });
          } else {
            console.log(error);
          }
        }
        // res.json({
        //   status: "error",
        //   body: error.errors,
        // })
      );
  }

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
