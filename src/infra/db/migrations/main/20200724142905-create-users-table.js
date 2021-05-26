module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user', {
      id: {
        type: Sequelize.DataTypes.UUID,
        unique: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.DataTypes.ENUM('admin', 'user'),
        allowNull: false
      },
      access_token: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
      },
      password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      birthdate: {
        type: Sequelize.DataTypes.DATEONLY,
        allowNull: false
      },
      created_at: Sequelize.DataTypes.DATE,
      updated_at: Sequelize.DataTypes.DATE
    })
    .then(() => {
      return queryInterface.addIndex('user', ['id']);
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('user');
  }
};