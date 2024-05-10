module.exports = (sequelize, DataTypes) => {
  const Contacts = sequelize.define("Contacts", {
    contact_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pushname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_contact: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    pic_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  // Aso con Chats
  Contacts.associate = (models) => {
    Contacts.hasOne(models.Chats, {
      foreignKey: {
        name: "chat_id",
        allowNull: false,
      },
    });
  };

  return Contacts;
};
