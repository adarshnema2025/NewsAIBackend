const {DataTypes}=require('sequelize');

module.exports=(sequelize)=>{
    const Notebook=sequelize.define('Notebook',{
        id:{
            type:DataTypes.UUID,
            defaultValue:DataTypes.UUIDV4,
            primaryKey:true
        },
         user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
        name:{
            type:DataTypes.STRING,
            
            allowNull:false
        },
        description:{
            type:DataTypes.STRING,
            allowNull:false
        },
        is_public:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            default:false
        }

    },{timestamps:true})
    return Notebook;
}