//import the install service to handle communication with the database
import installService from '../services/install.service.js';

//create the function to handle the install page request
async function install(req,res,next){
    
     //call the install service to create the database and tables
        const installmessage = await installService.install2();
        //check if the installation was successful or not
        if (installmessage.status === 200) {
            res.status(200).json({ message: installmessage });
        } else {
            res.status(500).json({ message: installmessage });
        }
   
};

//export the install function to be used in the routes
export default {
    install
}


