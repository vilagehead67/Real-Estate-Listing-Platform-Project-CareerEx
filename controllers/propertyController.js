
const User = require("../models/User")
const Property = require("../models/Property")





const handlePropertyListingsByAgent = async(req, res) =>{
    const {title, description, image, price, location, category, agent} = req.body

    try {
        const user = await User.findById(agent);

     const newProperty = new Property({
    title,
    description,
    image,
    price,
    location,
    category,
    agent
})

await newProperty.save();

res.status(201).json({
    message: "Property added successfully",
    newProperty: {
        title,
        description,
        image,
        price,
        location,
        category,
        agent
    }
})

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
 }

const handleUpdatePropertyByAgent = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const agentId = req.user.id;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (!property.agent.equals(agentId)) {
      return res.status(403).json({ message: "You can only update your own property" });
    }

    // If new image is uploaded, update it
    if (req.file) {
      req.body.image = req.file.path;
    } else {
      delete req.body.image; 
      // prevent replacing image with undefined
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
        message: "Property updated successfully",
        updatedProperty
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const handleDeletePropertyByAgent = async(req, res) =>{
    const propertyId = req.params.id;
    const agentId = req.user.id

    const property = await Property.findById(propertyId);

    if (!property) {
        return res.status(404).json({
            message: "Property not found"
        })
    }
    if (!property.agent.equals(agentId)) {
        return res.status(403).json({
            message: "You can only delete your own property"
        })
    }
    await Property.findByIdAndDelete(propertyId);
    res.status(200).json({
        message: "Property deleted successfully."
    })
 }

const handleGetAvailableProperties = async(req, res) =>{
    try {
         const {location, category, minPrice, maxPrice} = req.query;


        // Add property filters
        let filters = {};
        if(location) filters.location = {$regex: new RegExp(location, "i")};
        if(category) filters.category = {$regex: new RegExp(category, "i")};
        if(minPrice || maxPrice) {
            filters.price = {};
            if(minPrice) filters.price.$gte = parseFloat(minPrice);
            if(maxPrice) filters.price.$lte = parseFloat(maxPrice) 
        }
        const availableProperties = await Property.find(filters).populate("agent", "email phoneNumber");
        res.status(200).json({
            message: "Success",
            availableProperties
        }); 
    } catch (error) {
        res.status(500).json({error: "Failed to fetch properties"});
    }
}

const handleGetSpecificProperty = async(req, res) =>{
       const {id} = req.params
       try {
           const property = await Property.findById(id).populate("agent", "email phoneNumber")
   
           if (!property){
               return res.status(404).json({
                   message: "Property not found."
               })
           }
           res.status(200).json({
               message: "Success",
               property
           })
       } catch (error) {
          res.status(500).json({error: "Failed to fetch property"}) 
       }
   }
   
 
 module.exports = {
    handlePropertyListingsByAgent,
    handleUpdatePropertyByAgent,
    handleDeletePropertyByAgent,
    handleGetAvailableProperties,
    handleGetSpecificProperty
 }